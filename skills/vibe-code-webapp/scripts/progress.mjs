#!/usr/bin/env node
// progress.mjs — the vibe-code-webapp skill's stage tracker. Writes a single
// `output/progress.md` (append-only log + live state table) so the user and
// any AI can see at a glance which of the 8 stages is done, which task is
// blocked, and what's next — across sessions and tools.
//
// Usage:
//   node scripts/progress.mjs log --stage 3 --status done --note "pack approved"
//   node scripts/progress.mjs log --stage 4 --status doing --note "task #2 invoice form"
//   node scripts/progress.mjs log --milestone "deploy live" --status done
//   node scripts/progress.mjs show                     # render the live table
//   node scripts/progress.mjs clear                    # archive today's log to history
//
//   --stage <0-7|done>   which stage (0 onboard … 7 deliver; "done" = shipped)
//   --milestone <text>   OR a free milestone instead of a stage
//   --status <todo|doing|done|blocked>
//   --note <text>        what happened (evidence, file paths, next step)
//   --file <path>        default: output/progress.md (project-local)
//
// Exit codes: 0 = ok · 2 = usage error. The log is deterministic + append-only.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";

// ─── brand banner (deepak-skill · crafted by Deepak) ────────────────────────
const BRAND_LINE = "═".repeat(56);
const banner = (label) =>
  `\n${BRAND_LINE}\n  🎬 deepak-skill — crafted by Deepak\n  skill: vibe-code-webapp · ${label}\n${BRAND_LINE}\n`;
console.log(banner("progress.mjs"));

const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const needle = `--${name}`;
  const found = args.find((a) => a === needle || a.startsWith(`${needle}=`));
  if (found === undefined) return fallback;
  const eq = found.indexOf("=");
  return eq !== -1 ? found.slice(eq + 1) : args[args.indexOf(found) + 1];
};
const hasFlag = (name) => args.includes(`--${name}`);

function usage() {
  console.log(`progress.mjs — stage tracker (vibe-code-webapp skill)

Usage:
  node scripts/progress.mjs log --stage 3 --status done --note "pack approved"
  node scripts/progress.mjs log --milestone "deploy live" --status done
  node scripts/progress.mjs log --stage 4 --status blocked --note "waiting on Stripe keys"
  node scripts/progress.mjs show
  node scripts/progress.mjs clear

  --stage <0-7|done>    stage number (0 onboard … 7 deliver) or "done"
  --milestone <text>    log a free milestone instead of a stage
  --status <todo|doing|done|blocked>
  --note <text>         evidence / next step
  --file <path>         default: output/progress.md
`);
  process.exit(2);
}

const FILE = resolve(process.cwd(), opt("file", "output/progress.md"));
const CMD = (args.find((a) => ["log", "show", "clear"].includes(a.toLowerCase())) || "show").toLowerCase();
const today = new Date().toISOString().slice(0, 10);
const now = new Date().toISOString().slice(11, 19);

const STAGES = [
  "0 · Onboard (interview + scan)",
  "1 · Expert research",
  "2 · SaaS validator",
  "3 · Build pack + TODO (approval gate)",
  "4 · Build (confirmed TODO)",
  "5 · Audit",
  "6 · Report + everything-auditor",
  "7 · Deliver + deploy",
];
const GLYPH = { todo: "[ ]", doing: "[~]", done: "[x]", blocked: "[!]" };

function read() {
  if (!existsSync(FILE)) {
    mkdirSync(dirname(FILE), { recursive: true });
    writeFileSync(FILE, `# Progress — vibe-code-webapp\n\n> Project-local tracker: \`node scripts/progress.mjs log|show|clear\`.\n>\n> **State:** \`${STAGES.map((_, i) => i).join(" ")}\` (0–7) · status: todo / doing / done / blocked.\n\n## Live state\n\n| Stage | Status | Note |\n|---|---|---|\n\n## Log\n\n`, "utf8");
  }
  return readFileSync(FILE, "utf8");
}

if (CMD === "clear") {
  const doc = read();
  const [head, ...rest] = doc.split("## Log\n");
  const history = rest.join("## Log\n").trim();
  const archived = history
    .split("\n")
    .map((l) => (l.trim() === "" ? l : `    ${l}`))
    .join("\n");
  writeFileSync(FILE, `${head}## Log\n\n${archived ? `## History (archived ${today})\n\n${archived}\n` : ""}`, "utf8");
  console.log(`✅ Log cleared — today's entries archived under "## History".`);
  process.exit(0);
}

if (CMD === "show") {
  const doc = read();
  console.log(doc);
  process.exit(0);
}

// CMD === "log"
const status = (opt("status", "done") || "done").toLowerCase();
if (!["todo", "doing", "done", "blocked"].includes(status)) {
  console.error("❌ --status must be todo | doing | done | blocked");
  process.exit(2);
}
const stageRaw = opt("stage", "");
const milestone = opt("milestone", "");
const note = opt("note", "");
if (!note) {
  console.error("❌ --note is required (what happened / next step)");
  usage();
}
let label;
if (milestone) {
  label = `★ ${milestone}`;
} else if (stageRaw === "done") {
  label = "★ Project delivered";
} else {
  const n = parseInt(stageRaw, 10);
  if (!Number.isInteger(n) || n < 0 || n > 7) {
    console.error("❌ --stage must be 0–7 or \"done\" (or use --milestone)");
    process.exit(2);
  }
  label = STAGES[n];
}

const doc = read();
// Split into the live-state block (before the Log header) and the log entries.
const logHeader = "## Log";
const idx = doc.indexOf(logHeader);
const beforeLog = idx === -1 ? doc : doc.slice(0, idx);
const logBody = idx === -1 ? "" : doc.slice(idx + logHeader.length);

// 1) Update the Live state table row for this stage (replace, don't duplicate).
const rowRe = new RegExp(`(^\\| \\*\\*${label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\*\\* \\| ).*( \\| .* \\|$)`, "m");
const newRow = `| **${label}** | ${GLYPH[status]} ${status} | ${note.replace(/\|/g, "\\|")} |`;
const updatedBefore = rowRe.test(beforeLog)
  ? beforeLog.replace(rowRe, newRow)
  : `${beforeLog.replace(/\s+$/, "\n\n")}${newRow}\n`;
// 2) Append the log entry (append-only history).
const entry = `- \`${today} ${now}\` **${label}** → \`${status}\` — ${note}`;
const updatedLog = logBody.replace(/\s*$/, "") ? `${logBody.trimEnd()}\n${entry}\n` : `${entry}\n`;
const final = `${updatedBefore}\n${logHeader}\n${updatedLog}`;
writeFileSync(FILE, final, "utf8");
console.log(`✅ ${label} → ${status} — logged to ${FILE}`);
console.log(`   next: \`node scripts/progress.mjs show\``);
process.exit(0);