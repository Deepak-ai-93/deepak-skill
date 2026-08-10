#!/usr/bin/env node
// The skill-builder audit harness — the automated half of the
// scaffold-auditor gate. Checks a scaffolded (or newly built) skill folder
// against the deepak-skill contract that every skill in the repo follows:
// SKILL.md (YAML frontmatter with name + description, # skill: header, the
// quality-bar table, when-to-use, numbered workflow, production checklist,
// and — since the harness rollout — an audit stage), scripts/ (each with the
// Deepak brand banner, the tiny opt() arg parser, usage exit 2), templates/
// (real reference docs), examples/ (at least one worked example), and the
// repo docs wiring (README row + install row, USAGE count, prompt-examples
// section) when --docs is passed. Writes scaffold-audit.md with the automated
// verdicts + an AUDITOR section for the subagent (methodology quality,
// completeness judgment). Exit 1 on any FAIL.
//
// Usage:
//   node audit-scaffold.mjs --pack <skill-folder> [--docs] [--out scaffold-audit.md]
//   node audit-scaffold.mjs --pack skills/my-skill --docs
//
// Exit codes: 0 = all automated checks PASS, 1 = any FAIL, 2 = usage error.
import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { resolve, basename, join } from "node:path";

// ─── brand banner (deepak-skill · crafted by Deepak) ────────────────────────
const BRAND_LINE = "═".repeat(56);
const banner = (label) =>
  `\n${BRAND_LINE}\n  🎬 deepak-skill — crafted by Deepak\n  skill: skill-builder · ${label}\n${BRAND_LINE}\n`;
console.log(banner("audit-scaffold.mjs"));

// --- tiny arg parser (same style as the other skill scripts) ----------------
const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const needle = `--${name}`;
  const found = args.find((a) => a === needle || a.startsWith(`${needle}=`));
  if (found === undefined) return fallback;
  const eq = found.indexOf("=");
  return eq !== -1 ? found.slice(eq + 1) : args[args.indexOf(found) + 1];
};

const packArg = opt("pack");
if (!packArg) {
  console.error("Usage: node audit-scaffold.mjs --pack <skill-folder> [--docs] [--out scaffold-audit.md]");
  process.exit(2);
}
const packDir = resolve(process.cwd(), packArg);
const outPath = resolve(process.cwd(), opt("out", "scaffold-audit.md"));
if (!existsSync(packDir)) {
  console.error(`❌ Skill folder not found: ${packDir}`);
  console.error("   Pass the skill folder (e.g. skills/my-skill) — add --docs to also check repo docs wiring");
  process.exit(2);
}
const checkDocs = args.includes("--docs");

// ─── results collector ──────────────────────────────────────────────────────
const results = []; // { status: "PASS"|"FAIL"|"WARN", check, detail }
const add = (status, check, detail) => results.push({ status, check, detail });
let auditSections = [];

const read = (f) => (existsSync(join(packDir, f)) ? readFileSync(join(packDir, f), "utf8") : null);

// ─── SKILL.md ───────────────────────────────────────────────────────────────
const skill = read("SKILL.md");
if (!skill) {
  add("FAIL", "SKILL.md exists", "missing — SKILL.md is the skill's contract");
} else {
  const fm = skill.match(/^---\n([\s\S]*?)\n---/);
  if (fm && /^name:/m.test(fm[1]) && /^description:/m.test(fm[1])) add("PASS", "frontmatter", "YAML frontmatter with name + description present");
  else add("FAIL", "frontmatter", "frontmatter missing name or description");
  const desc = fm ? fm[1].match(/^description:\s*(.+)$/m) : null;
  if (desc && desc[1].trim().length >= 80) add("PASS", "description richness", `${desc[1].trim().length} chars — rich enough to match`);
  else add("WARN", "description richness", "description is thin (< 80 chars) — agents match on this");
  if (/^# skill:/m.test(skill)) add("PASS", "skill header", "# skill: header present");
  else add("FAIL", "skill header", "no '# skill:' header");
  if (/quality bar/i.test(skill)) add("PASS", "quality bar", "quality-bar section present");
  else add("FAIL", "quality bar", "no quality-bar section — the contract requires it");
  if (/when to use/i.test(skill)) add("PASS", "when to use", "trigger-phrase section present");
  else add("WARN", "when to use", "no 'when to use' section");
  const stages = (skill.match(/^#{1,3}\s+.*(?:Stage|Step)\s*\d+/gim) || []).length;
  if (stages >= 3) add("PASS", "workflow stages", `${stages} numbered stage(s)`);
  else add("WARN", "workflow stages", `only ${stages} numbered stage(s) — the workflow should be staged`);
  if (/audit|harness|subagent|verif/i.test(skill)) add("PASS", "audit stage", "audit/harness/subagent stage present");
  else add("FAIL", "audit stage", "no audit/validation stage — the contract requires an audit gate");
  if (/checklist/i.test(skill)) add("PASS", "production checklist", "production checklist present");
  else add("FAIL", "production checklist", "no production checklist");
}

// ─── scripts/ ───────────────────────────────────────────────────────────────
let scriptCount = 0;
if (existsSync(join(packDir, "scripts"))) {
  try {
    const scripts = readdirSync(join(packDir, "scripts")).filter((f) => /\.mjs$/.test(f));
    scriptCount = scripts.length;
    if (scriptCount) add("PASS", "scripts present", `${scriptCount} .mjs script(s)`);
    else add("WARN", "scripts present", "scripts/ exists but no .mjs files");
    let withBanner = 0;
    let withOpt = 0;
    for (const s of scripts) {
      const src = readFileSync(join(packDir, "scripts", s), "utf8");
      if (/deepak-skill — crafted by Deepak/.test(src)) withBanner += 1;
      if (/const opt =/.test(src) && /--/.test(src)) withOpt += 1;
    }
    if (withBanner === scriptCount) add("PASS", "brand banner on scripts", `${withBanner}/${scriptCount} scripts carry the Deepak banner`);
    else add("WARN", "brand banner on scripts", `${withBanner}/${scriptCount} scripts carry the banner`);
    if (withOpt === scriptCount) add("PASS", "opt() arg parser", `${withOpt}/${scriptCount} scripts use the tiny opt() parser`);
    else add("WARN", "opt() arg parser", `${withOpt}/${scriptCount} scripts use opt()`);
  } catch {
    add("WARN", "scripts present", "could not read scripts/");
  }
} else {
  add("WARN", "scripts present", "no scripts/ folder — fine for pure-copywriting skills, otherwise add one");
}

// ─── templates/ + examples/ ─────────────────────────────────────────────────
if (existsSync(join(packDir, "templates"))) {
  try {
    const t = readdirSync(join(packDir, "templates")).length;
    if (t) add("PASS", "templates present", `${t} template file(s)`);
    else add("WARN", "templates present", "templates/ is empty");
  } catch {
    add("WARN", "templates present", "could not read templates/");
  }
} else {
  add("WARN", "templates present", "no templates/ folder — optional but expected for reference docs");
}
if (existsSync(join(packDir, "examples"))) {
  try {
    const ex = readdirSync(join(packDir, "examples")).filter((f) => f !== "." && f !== "..");
    if (ex.length) add("PASS", "examples present", `${ex.length} example entry/entries`);
    else add("WARN", "examples present", "examples/ is empty");
  } catch {
    add("WARN", "examples present", "could not read examples/");
  }
} else {
  add("WARN", "examples present", "no examples/ folder — one worked example is expected");
}

// ─── repo docs wiring (--docs) ──────────────────────────────────────────────
if (checkDocs) {
  const repoRoot = resolve(packDir, "..", "..");
  const skillName = basename(packDir);
  const readRepo = (f) => (existsSync(join(repoRoot, f)) ? readFileSync(join(repoRoot, f), "utf8") : null);
  const readme = readRepo("README.md");
  const usage = readRepo("USAGE.md");
  const pe = readRepo("prompt-examples.md");
  const installSh = readRepo("install.sh");
  const installMd = readRepo("install.md");
  if (readme && readme.includes(skillName)) add("PASS", "README wiring", `${skillName} referenced in README`);
  else add("FAIL", "README wiring", `${skillName} not found in README`);
  if (usage && usage.includes(skillName)) add("PASS", "USAGE wiring", `${skillName} referenced in USAGE.md`);
  else add("WARN", "USAGE wiring", `${skillName} not found in USAGE.md`);
  if (pe && pe.includes(skillName)) add("PASS", "prompt-examples wiring", `${skillName} referenced in prompt-examples.md`);
  else add("WARN", "prompt-examples wiring", `${skillName} not found in prompt-examples.md`);
  if (installSh && installSh.includes(skillName)) add("PASS", "install.sh wiring", `${skillName} in the installer list`);
  else add("WARN", "install.sh wiring", `${skillName} not in install.sh`);
  if (installMd && installMd.includes(skillName)) add("PASS", "install.md wiring", `${skillName} in install.md`);
  else add("WARN", "install.md wiring", `${skillName} not in install.md`);
  // skill count consistency
  const counts = [readme, usage, installSh, installMd].map((f) => {
    if (!f) return null;
    const m = f.match(/all\s+(\d{1,2})\s+skills?/i);
    return m ? Number(m[1]) : null;
  }).filter((n) => n !== null);
  const uniq = new Set(counts);
  if (uniq.size <= 1 && counts.length) add("PASS", "skill count consistency", `docs agree on ${counts[0]} skills`);
  else if (counts.length > 1) add("WARN", "skill count consistency", `docs disagree: ${[...uniq].join(" vs ")} — update the counts`);
}

const fails = results.filter((r) => r.status === "FAIL");
const warns = results.filter((r) => r.status === "WARN");
const passes = results.filter((r) => r.status === "PASS");

// ─── write scaffold-audit.md ────────────────────────────────────────────────
const L = [];
L.push(`# Scaffold Audit — ${basename(packDir)}`);
L.push("");
L.push(`**Automated checks (${new Date().toISOString().slice(0, 10)}):** ${passes.length} PASS · ${warns.length} WARN · ${fails.length} FAIL · **automated verdict:** ${fails.length ? "FIX NEEDED" : "PASS (pending auditor)"}`);
L.push("");
L.push("## 1. Automated results");
L.push("");
L.push("| Status | Check | Detail |");
L.push("|---|---|---|");
for (const r of results) L.push(`| ${r.status} | ${r.check} | ${r.detail} |`);
L.push("");
if (auditSections.length) {
  L.push("## 1b. Scaffold snippets for the auditor");
  L.push("");
  for (const s of auditSections) L.push(`- ${s}`);
  L.push("");
}
L.push("## 2. Auditor section — COMPLETE THIS (subagent, fresh eyes)");
L.push("");
L.push("### 2.1 Scaffold-worthiness scorecard (rate 1–5 each, /50 — a scaffold worth shipping scores ≥ 35)");
L.push("");
L.push("| Criterion | Ask | Score /5 |");
L.push("|---|---|---|");
L.push("| **Contract compliance** | SKILL.md has frontmatter, quality bar, when-to-use, numbered workflow, checklist, audit stage? | |");
L.push("| **Methodology quality** | Does the workflow read like a real playbook (not placeholder filler)? | |");
L.push("| **Quality-bar rigor** | Are the rails specific and enforceable (measurable rules, not vibes)? | |");
L.push("| **Script quality** | Every script has banner + opt() + exit codes + real logic (no stubs)? | |");
L.push("| **Template value** | Are templates real reference docs (formulas/checklists), not placeholders? | |");
L.push("| **Example completeness** | Does examples/ mirror the skill's actual deliverable? | |");
L.push("| **Docs wiring** | README row + install row + USAGE + prompt-examples section + consistent count? | |");
L.push("| **Naming** | kebab-case <what>-<descriptor>, no collision with existing skills? | |");
L.push("| **Audit gate** | Does the skill itself end in an audit/harness stage (per repo convention)? | |");
L.push("| **Ship-readiness** | Would a user get value from this skill on day one? | |");
L.push("");
L.push("### 2.2 Creative judgment calls");
L.push("");
L.push("- Any section that reads generic or copy-pasted from another skill?");
L.push("- Any quality-bar rail that can't actually be verified?");
L.push("- Any missing stage that would make the skill produce bad output silently?");
L.push("");
L.push("### 2.3 Verdict");
L.push("");
L.push("- All PASS and scorecard ≥ 35 → mark **PASS** and sign below.");
L.push("- Any FAIL (or a WARN you judge real) → mark **FIX NEEDED** and list concrete fixes per file.");
L.push("");
L.push(`> Auditor verdict: **PENDING** · Auditor: _(subagent)_ · Date: ${new Date().toISOString().slice(0, 10)}`);
L.push("");

writeFileSync(outPath, L.join("\n"), "utf8");

// ─── console ────────────────────────────────────────────────────────────────
console.log(`✅ scaffold-audit.md → ${basename(outPath)} (${passes.length} PASS · ${warns.length} WARN · ${fails.length} FAIL)`);
for (const r of results.filter((r) => r.status !== "PASS")) {
  console.log(`   ${r.status === "FAIL" ? "❌" : "⚠️"} ${r.check}: ${r.detail}`);
}
if (fails.length) {
  console.error(`❌ ${fails.length} automated FAIL(s) — fix and re-run before spawning the scaffold-auditor.`);
  process.exit(1);
}
console.log("Automated checks clean — now spawn the scaffold-auditor subagent (see SKILL.md Stage 5) to complete the scorecard + verdict in scaffold-audit.md.");
process.exit(0);
