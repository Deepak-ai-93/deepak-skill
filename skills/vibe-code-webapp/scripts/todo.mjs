#!/usr/bin/env node
// todo.mjs — CLI manager for the vibe-code-webapp skill's TODO.md.
// Turns the todo list into a real contract: the user CONFIRMS it before any
// code is written, and can add tasks / change priorities at any time.
//
// Task line format (single line, agent- and human-readable):
//   - [ ] (P1) #3 Create the invoice form — ref: PRD-4
//
//   status:  [ ] todo · [~] doing · [!] blocked · [x] done
//   priority:(P0) must-do-first · (P1) important · (P2) nice-to-have
//   id:      #<n> — stable, assigned by `add`, never reused
//
// Usage:
//   node scripts/todo.mjs init                      create TODO.md if missing
//   node scripts/todo.mjs list                      show tasks grouped by priority
//   node scripts/todo.mjs add "task text" [--p P1] [--ref PRD-4] [--note x]
//   node scripts/todo.mjs priority <id> <P0|P1|P2>  re-prioritize a task
//   node scripts/todo.mjs done <id> | doing <id> | blocked <id> | todo <id>
//   node scripts/todo.mjs remove <id>               delete a task
//   node scripts/todo.mjs confirm [--yes|--no] [--by "Name"]   toggle the
//                    confirmation gate (build may NOT start before YES)
//   node scripts/todo.mjs --file ../TODO.md list    use a different file
//
// The script preserves the file's header and any content below the task list;
// it only re-owns the four task sections (P0 / P1 / P2 / Done).
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

// ─── brand banner (deepak-skill · crafted by Deepak) ────────────────────────
const BRAND_LINE = "═".repeat(56);
const banner = (label) =>
  `\n${BRAND_LINE}\n  🎬 deepak-skill — crafted by Deepak\n  skill: vibe-code-webapp · ${label}\n${BRAND_LINE}\n`;
console.log(banner("todo.mjs"));

const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const needle = `--${name}`;
  const found = args.find((a) => a === needle || a.startsWith(`${needle}=`));
  if (found === undefined) return fallback;
  const eq = found.indexOf("=");
  return eq !== -1 ? found.slice(eq + 1) : args[args.indexOf(found) + 1];
};
const hasFlag = (name) => args.includes(`--${name}`);

const FILE = resolve(process.cwd(), opt("file", "TODO.md"));
// The command is the first arg that names a known command (so `--file <path>`
// before the command can't be mistaken for one). Falls back to the first
// non-flag arg, then to `list`.
const COMMANDS = ["init", "list", "add", "priority", "done", "doing", "blocked", "todo", "remove", "confirm"];
const CMD = (args.find((a) => COMMANDS.includes(a.toLowerCase())) || args.find((a) => !a.startsWith("-")) || "list").toLowerCase();

const STATUS_GLYPH = { " ": "todo", "~": "doing", "!": "blocked", x: "done" };
const TASK_RE = /^- \[([ x~!])\] \(([Pp][012])\) #(\d+)\s+(.+?)\s*$/;
const SECTIONS = ["## P0 — do first", "## P1 — important", "## P2 — nice to have", "## Done"];

function usage() {
  console.log(`todo.mjs — TODO.md manager (vibe-code-webapp skill)

Usage:
  node scripts/todo.mjs init                       create TODO.md if missing
  node scripts/todo.mjs list                       show tasks grouped by priority
  node scripts/todo.mjs add "task" [--p P1] [--ref PRD-4] [--note x]
  node scripts/todo.mjs priority <id> <P0|P1|P2>
  node scripts/todo.mjs done <id> | doing <id> | blocked <id> | todo <id>
  node scripts/todo.mjs remove <id>
  node scripts/todo.mjs confirm [--yes|--no] [--by "Name"]
  node scripts/todo.mjs --file <path> <cmd>        operate on a different file
`);
  process.exit(2);
}

// --- parse the file -----------------------------------------------------------
function parse() {
  const lines = existsSync(FILE) ? readFileSync(FILE, "utf8").split("\n") : [];
  const tasks = []; // { line, idx, status, prio, id, text }
  const taskIdx = [];
  lines.forEach((line, idx) => {
    const m = line.match(TASK_RE);
    if (m) {
      const t = { idx, status: m[1] || " ", prio: m[2].toUpperCase(), id: parseInt(m[3], 10), text: m[4] };
      tasks.push(t);
      taskIdx.push(idx);
    }
  });
  const first = taskIdx.length ? taskIdx[0] : lines.length;
  const last = taskIdx.length ? taskIdx[taskIdx.length - 1] : -1;
  // Drop section headers and rendered placeholders/hints so they never
  // accumulate. NOTE: non-task lines BETWEEN tasks are not preserved on
  // rewrite — keep notes above the list or under the Done section.
  const keep = (arr) =>
    arr.filter((l) => !/^## /.test(l) && !/^_.*(tasks|none yet).*_$/i.test(l.trim()));
  const clean = (arr) => arr.join("\n").replace(/\n{3,}/g, "\n\n").replace(/^\n+/, "").replace(/\s+$/, "");
  const head = clean(keep(lines.slice(0, first)));
  // With no tasks the file is all header — keep it as head only, never as tail.
  const tail = taskIdx.length ? clean(keep(lines.slice(last + 1))) : "";
  return { lines, tasks, head, tail };
}

function maxId(tasks) {
  return tasks.reduce((m, t) => Math.max(m, t.id), 0);
}

function render({ head, tasks, tail }) {
  const open = (prio) => tasks.filter((t) => t.status !== "x" && t.prio === prio);
  const done = tasks.filter((t) => t.status === "x");
  const line = (t) => `- [${t.status}] (${t.prio}) #${t.id} ${t.text}`;
  const body = (items) => (items.length ? items.map(line).join("\n") : "_none yet_");
  const sections = [
    `## P0 — do first\n${body(open("P0"))}`,
    `## P1 — important\n${body(open("P1"))}`,
    `## P2 — nice to have\n${body(open("P2"))}`,
    `## Done\n${body(done)}`,
  ];
  return `${head}\n\n${sections.join("\n\n")}${tail ? `\n\n${tail}` : ""}\n`;
}

function save(doc) {
  writeFileSync(FILE, render(doc), "utf8");
}

function confirmed(doc) {
  const m = doc.head.match(/\*\*Confirmed:\*\*\s*(YES|NO)/i);
  return m ? m[1].toUpperCase() === "YES" : false;
}

// --- commands ------------------------------------------------------------------
if (CMD === "init") {
  if (existsSync(FILE)) {
    console.log(`TODO.md already exists (${FILE}).`);
    process.exit(0);
  }
  const scaffold = `# TODO — {App Name}

> **Confirmed:** NO · by: — · on: —
> The build may NOT start until the user approves this list (SKILL.md Stage 3).
> Manage: \`node scripts/todo.mjs list|add|priority|done|doing|blocked|todo|remove|confirm\`
> Scope: {one line — what this list covers, e.g. "MVP for InvoiceFlow"}

## P0 — do first
_Add P0 tasks with \`node scripts/todo.mjs add "task" --p P0\`._

## P1 — important
_none yet_

## P2 — nice to have
_none yet_

## Done
_none yet_
`;
  writeFileSync(FILE, scaffold, "utf8");
  console.log(`✅ TODO.md created (${FILE}). Fill the scope line, then add your build-order tasks:\n   node scripts/todo.mjs add "task" --p P0`);
  process.exit(0);
}

if (!existsSync(FILE)) {
  console.error(`❌ ${FILE} not found — run \`node scripts/todo.mjs init\` first.`);
  process.exit(1);
}

const doc = parse();

if (CMD === "list") {
  const byPrio = { P0: [], P1: [], P2: [] };
  doc.tasks.forEach((t) => (t.status === "x" ? null : byPrio[t.prio] && byPrio[t.prio].push(t)));
  const done = doc.tasks.filter((t) => t.status === "x");
  const badge = confirmed(doc) ? "YES ✓" : "NO — awaiting user approval";
  const title = (doc.head.split("\n")[0] || "").replace(/^#+\s*/, "");
  console.log(`${title || "TODO"} · Confirmed: ${badge}`);
  for (const p of ["P0", "P1", "P2"]) {
    if (!byPrio[p].length) continue;
    console.log(`\n${p}:`);
    for (const t of byPrio[p]) console.log(`  #${t.id} [${STATUS_GLYPH[t.status]}] ${t.text}`);
  }
  if (done.length) {
    console.log(`\nDone (${done.length}):`);
    for (const t of done) console.log(`  #${t.id} ${t.text}`);
  }
  console.log(doc.tasks.length ? "" : "\n(no tasks yet — use `add`)");
  process.exit(0);
}

if (CMD === "confirm") {
  const want = hasFlag("no") ? "NO" : "YES";
  const by = opt("by", "user");
  const date = new Date().toISOString().slice(0, 10);
  const replaced = doc.head.replace(
    /\*\*Confirmed:\*\*\s*.*/,
    `**Confirmed:** ${want} · by: ${by} · on: ${date}`
  );
  if (replaced === doc.head) {
    console.error("❌ Could not find the `**Confirmed:**` line in the header.");
    process.exit(1);
  }
  doc.head = replaced;
  save(doc);
  console.log(want === "YES" ? "✅ TODO list CONFIRMED — build may start (Stage 3 gate passed)." : "ℹ️ Confirmation cleared — wait for user approval before building.");
  process.exit(0);
}

const idArg = args[args.indexOf(CMD) + 1];
const task = idArg && doc.tasks.find((t) => t.id === parseInt(idArg, 10));

if (CMD === "add") {
  const addIdx = args.indexOf("add");
  const desc = args.slice(addIdx + 1).find((a) => !a.startsWith("-") && !/^p[012]$/i.test(a));
  if (!desc) usage();
  const prio = (opt("p", "P1") || "P1").toUpperCase().replace(/^P$/, "P1");
  if (!/^P[012]$/.test(prio)) {
    console.error("❌ Priority must be P0, P1 or P2.");
    process.exit(2);
  }
  const ref = opt("ref", "");
  const note = opt("note", "");
  const id = maxId(doc.tasks) + 1;
  let text = desc;
  if (ref) text += ` — ref: ${ref}`;
  if (note) text += ` (${note})`;
  doc.tasks.push({ status: " ", prio, id, text });
  save(doc);
  console.log(`✅ Added #${id} (${prio}): ${desc}`);
  process.exit(0);
}

if (["priority", "done", "doing", "blocked", "todo", "remove"].includes(CMD)) {
  if (!task) {
    console.error(`❌ No task with id #${idArg || "?"}.`);
    process.exit(1);
  }
  if (CMD === "priority") {
    const prio = (args[args.indexOf(CMD) + 2] || "").toUpperCase();
    if (!/^P[012]$/.test(prio)) {
      console.error("❌ Usage: todo.mjs priority <id> <P0|P1|P2>");
      process.exit(2);
    }
    task.prio = prio;
    console.log(`✅ #${task.id} → priority ${prio}`);
  } else if (CMD === "done") {
    task.status = "x";
    console.log(`✅ #${task.id} done.`);
  } else if (CMD === "doing") {
    task.status = "~";
    console.log(`ℹ️ #${task.id} marked in progress.`);
  } else if (CMD === "blocked") {
    task.status = "!";
    console.log(`🚧 #${task.id} blocked.`);
  } else if (CMD === "todo") {
    task.status = " ";
    console.log(`ℹ️ #${task.id} back to todo.`);
  } else if (CMD === "remove") {
    doc.tasks = doc.tasks.filter((t) => t.id !== task.id);
    console.log(`🗑️ Removed #${task.id}.`);
  }
  save(doc);
  process.exit(0);
}

usage();
