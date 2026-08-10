#!/usr/bin/env node
// The photoshoot-studio audit harness — the automated half of the
// shoot-auditor gate. Scans a delivered photoshoot pack and checks what a
// script CAN check: the shoot-plan.json (subject kind, grade, craft, subject
// block, shots), the prompts.md prompt pack (every shot prompt still carries
// the VERBATIM subject block + grade token + craft token — word-level,
// catching hand-edits that drifted; verify markers; per-shot aspect ratios;
// Edit: lines), the subject sheet (reference-image prompts + upload note +
// anti-drift), and the shot list (hero → detail → lifestyle → closing arc).
// Writes shoot-audit.md with the automated verdicts + an AUDITOR section for
// the subagent to complete (subject-likeness judgment, retouch quality).
// Exit 1 on any FAIL.
//
// Usage:
//   node audit-shoot.mjs --pack <shoot-folder> [--out shoot-audit.md]
//
// The folder should contain: shoot-plan.json, prompts.md, subject-sheet.md,
// shot-list.md (subsets are allowed — missing files are FAIL but the audit
// continues).
//
// Exit codes: 0 = all automated checks PASS, 1 = any FAIL, 2 = usage error.
import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { resolve, basename, join } from "node:path";

// ─── brand banner (deepak-skill · crafted by Deepak) ────────────────────────
const BRAND_LINE = "═".repeat(56);
const banner = (label) =>
  `\n${BRAND_LINE}\n  🎬 deepak-skill — crafted by Deepak\n  skill: photoshoot-studio · ${label}\n${BRAND_LINE}\n`;
console.log(banner("audit-shoot.mjs"));

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
  console.error("Usage: node audit-shoot.mjs --pack <shoot-folder> [--out shoot-audit.md]");
  process.exit(2);
}
const packDir = resolve(process.cwd(), packArg);
const outPath = resolve(process.cwd(), opt("out", "shoot-audit.md"));
if (!existsSync(packDir)) {
  console.error(`❌ Shoot folder not found: ${packDir}`);
  console.error("   Pass the folder that holds shoot-plan.json / prompts.md / subject-sheet.md / shot-list.md");
  process.exit(2);
}

// read with prefix tolerance: the example packs use person-*/product-* names,
// so fall back to any *<name> match (person-shoot-plan.json → shoot-plan.json).
// product-spec.md counts as the subject sheet, so map spec → subject-sheet too.
const read = (f) => {
  const exact = join(packDir, f);
  if (existsSync(exact)) return readFileSync(exact, "utf8");
  const wants = f === "subject-sheet.md" ? [f, "spec.md"] : [f];
  try {
    const files = readdirSync(packDir);
    for (const want of wants) {
      const match = files.find((x) => x.toLowerCase().endsWith(want));
      if (match) return readFileSync(join(packDir, match), "utf8");
    }
  } catch {
    // ignore
  }
  return null;
};

// ─── results collector ──────────────────────────────────────────────────────
const results = []; // { status: "PASS"|"FAIL"|"WARN", check, detail }
const add = (status, check, detail) => results.push({ status, check, detail });
let auditSections = []; // auditor-facing notes for the subagent

// --- word-level token check (same logic as shot-prompts.mjs) ----------------
function missingWords(text, token) {
  if (!token) return [];
  const words = new Set(token.toLowerCase().match(/[a-z0-9'’]+/g) || []);
  const textWords = new Set(text.toLowerCase().match(/[a-z0-9'’]+/g) || []);
  return [...words].filter((w) => !textWords.has(w));
}

// --- parse shoot-plan.json ----------------------------------------------------
let plan = null;
let planParseOk = false;
{
  const raw = read("shoot-plan.json");
  if (!raw) {
    add("FAIL", "shoot-plan.json exists", "missing — the plan drives every other file");
  } else {
    try {
      plan = JSON.parse(raw);
      planParseOk = true;
    } catch (e) {
      add("FAIL", "shoot-plan.json parse", `invalid JSON: ${e.message}`);
    }
  }
}

if (planParseOk) {
  const fails = [];
  const check = (ok, msg) => { if (!ok) fails.push(msg); };
  check(plan.title && plan.title.trim(), "missing title");
  check(plan.grade && plan.grade.trim(), "missing grade token");
  check(plan.craft && plan.craft.trim(), "missing craft token");
  const block = plan.subject || plan.person || plan.product;
  check(block && block.trim(), "missing subject block (subject/person/product)");
  check(plan.subjectKind || plan.kind || "person", "subject kind not stated (person/product)");
  const shots = plan.shots || [];
  check(shots.length > 0, "no shots defined");
  shots.forEach((s, i) => {
    const tag = `shot ${s.id || s.type || i + 1}`;
    check(s.pose || s.placement || s.setting, `${tag} missing pose/placement or setting`);
  });
  if (fails.length) {
    add("FAIL", "plan integrity", `${fails.length} violation(s): ${fails.slice(0, 5).join(" · ")}${fails.length > 5 ? " …" : ""}`);
  } else {
    add("PASS", "plan integrity", `title · grade · craft · subject block · ${shots.length} shots`);
  }
  if (plan.aspect || plan.aspectRatio) auditSections.push(`aspect: ${plan.aspect || plan.aspectRatio}`);
}

// --- parse prompts.md (shot blocks + verify markers) --------------------------
const prompts = read("prompts.md");
let shotsInPrompts = 0;
let verifiedCount = 0;
let unverifiedCount = 0;
let editCount = 0;
const promptByShot = new Map(); // shot id -> prompt text
if (!prompts) {
  add("FAIL", "prompts.md exists", "missing — no prompt pack to audit");
} else {
  const verifyAll = (prompts.match(/✅/g) || []).length;
  const failAll = (prompts.match(/❌/g) || []).length;
  verifiedCount = verifyAll;
  unverifiedCount = failAll;
  // shot blocks: ### Shot N — id ... ```\nprompt\n``` (may end with Edit: ...)
  const shotRe = /### Shot \d+\s*—\s*(\S+)[\s\S]*?```\n([\s\S]*?)```/g;
  let m;
  while ((m = shotRe.exec(prompts)) !== null) {
    shotsInPrompts += 1;
    promptByShot.set(m[1], m[2]);
  }
  editCount = (prompts.match(/^Edit:/gm) || []).length;
  if (shotsInPrompts === 0) {
    add("FAIL", "prompts.md shots", "no '### Shot N — id' blocks found");
  } else {
    add("PASS", "prompts.md shots", `${shotsInPrompts} shot prompt(s) parsed`);
    if (planParseOk && plan.shots && shotsInPrompts !== plan.shots.length) {
      add("WARN", "prompts.md vs plan shot count", `${shotsInPrompts} in prompts.md vs ${plan.shots.length} in the plan — re-run shot-prompts.mjs`);
    }
    if (unverifiedCount) add("FAIL", "prompts.md self-verify", `${unverifiedCount} prompt(s) flagged ❌ by the builder`);
    else if (verifiedCount >= shotsInPrompts && verifiedCount > 0) add("PASS", "prompts.md self-verify", `${verifiedCount} ✅ — all shots consistency-verified`);
    else add("WARN", "prompts.md self-verify", `${verifiedCount}/${shotsInPrompts} ✅ — re-run shot-prompts.mjs if unsure`);
    // aspect ratios per shot — the pack header + prompts should mention one
    const aspectLines = (prompts.match(/(4:5|1:1|9:16|16:9|3:2)/g) || []).length;
    if (aspectLines >= shotsInPrompts) add("PASS", "aspect ratio", `${aspectLines} aspect-ratio token(s) across the pack`);
    else if (aspectLines) add("WARN", "aspect ratio", `${aspectLines} aspect-ratio token(s) — check every shot carries its platform aspect`);
    else add("WARN", "aspect ratio", "no aspect-ratio tokens found (4:5 / 1:1 / 9:16 / 16:9 / 3:2)");
  }
  if (/Before you start|Ingredients|--cref|reference/i.test(prompts)) add("PASS", "prompts.md header", "upload/tool notes present");
  else add("WARN", "prompts.md header", "no upload/tool notes in the header");
  if (editCount) add("PASS", "edit prompts", `${editCount} localized Edit: prompt(s) found`);
  else add("WARN", "edit prompts", "no Edit: prompts found — check the plan's edit fields");
}

// --- per-shot word-level consistency: subject block + grade + craft ----------
function auditPromptConsistency() {
  if (!planParseOk) return;
  const block = plan.subject || plan.person || plan.product;
  let shotsWithTokens = 0;
  let totalShots = 0;
  let drift = [];
  for (const s of plan.shots || []) {
    totalShots += 1;
    const key = s.id || s.type || String(totalShots);
    const prompt = promptByShot.get(key);
    if (!prompt) {
      drift.push(`${key} — no prompt found in prompts.md`);
      continue;
    }
    const missing = {};
    if (block) missing.subject = missingWords(prompt, block);
    missing.grade = missingWords(prompt, plan.grade);
    missing.craft = missingWords(prompt, plan.craft);
    const bad = Object.entries(missing).filter(([, v]) => v.length);
    if (bad.length) drift.push(`${key} — missing from ${bad.map(([k, v]) => `${k} (${v.slice(0, 3).join(", ")}…)`).join(", ")}`);
    else shotsWithTokens += 1;
  }
  if (drift.length) add("FAIL", "per-shot token consistency", `${drift.length}/${totalShots} shot prompt(s) drifted from the locked tokens: ${drift.slice(0, 4).join(" · ")}`);
  else if (totalShots) add("PASS", "per-shot token consistency", `${shotsWithTokens}/${totalShots} prompts carry verbatim subject block + grade + craft`);
}
auditPromptConsistency();

// --- subject sheet -------------------------------------------------------------
const sheet = read("subject-sheet.md");
function auditSubjectSheet() {
  if (!sheet) {
    add("FAIL", "subject-sheet.md exists", "missing — the subject has no reference-image plan");
    return;
  }
  const refPrompts = (sheet.match(/Reference-image prompts|reference-image prompts/i) || []).length;
  const hasUpload = /upload|Ingredients|--cref|reference/i.test(sheet);
  if (refPrompts && hasUpload) add("PASS", "subject sheet reference images", "reference-image prompts + per-tool upload note present");
  else if (refPrompts || hasUpload) add("WARN", "subject sheet reference images", "partial reference-image plan — check it lists prompts AND an upload note");
  else add("FAIL", "subject sheet reference images", "no reference-image prompts and no upload note — the subject can't be locked");
  if (/Never change|anti-drift|never reword/i.test(sheet)) add("PASS", "subject sheet anti-drift", "anti-drift rules present");
  else add("WARN", "subject sheet anti-drift", "no explicit 'never change / never reword' rules");
}
auditSubjectSheet();

// --- shot list ------------------------------------------------------------------
const shotList = read("shot-list.md");
function auditShotList() {
  if (!shotList) {
    add("FAIL", "shot-list.md exists", "missing — the shoot arc is undocumented");
    return;
  }
  if (/hero|Hero/i.test(shotList)) add("PASS", "shot list arc", "hero shot present");
  else add("WARN", "shot list arc", "no hero shot found");
  if (/detail|macro|lifestyle|closing|CTA/i.test(shotList)) add("PASS", "shot list arc", "detail/lifestyle/closing beats present");
  else add("WARN", "shot list arc", "no detail/lifestyle/closing beats found");
  if (/aspect|4:5|1:1|9:16|16:9|3:2/i.test(shotList)) add("PASS", "shot list aspects", "per-shot aspects noted");
  else add("WARN", "shot list aspects", "no per-shot aspect ratios noted");
  const editRows = (shotList.match(/Edit|edit/i) || []).length;
  if (editRows) auditSections.push(`${editRows} edit-prompt mention(s) in the shot list`);
}
auditShotList();

const fails = results.filter((r) => r.status === "FAIL");
const warns = results.filter((r) => r.status === "WARN");
const passes = results.filter((r) => r.status === "PASS");

// ─── write shoot-audit.md ────────────────────────────────────────────────────
const L = [];
L.push(`# Shoot Audit — ${basename(packDir)}`);
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
  L.push("## 1b. Shoot snippets for the auditor");
  L.push("");
  for (const s of auditSections) L.push(`- ${s}`);
  L.push("");
}
L.push("## 2. Auditor section — COMPLETE THIS (subagent, fresh eyes)");
L.push("");
L.push("### 2.1 Shoot-worthiness scorecard (rate 1–5 each, /50 — a shoot worth generating scores ≥ 35)");
L.push("");
L.push("| Criterion | Ask | Score /5 |");
L.push("|---|---|---|");
L.push("| **Subject consistency** | Every prompt carries the verbatim subject block + grade + craft tokens (word-level checks passed)? Reference-image reuse plan is real? | |");
L.push("| **Subject-likeness plan** | Would the subject-sheet reference-image prompts generate a clean, consistent likeness (face or product) to anchor the user's tool? | |");
L.push("| **Shoot arc** | Hero → detail → lifestyle → closing/CTA present and sensible for the brief? | |");
L.push("| **Photography language** | Camera body + lens + f-stop + lighting setup specific (no \"professional photo\" vagueness)? | |");
L.push("| **Aspect ratios** | Every shot's aspect matches its platform (4:5 feed, 1:1 grid, 9:16 stories, 16:9 banner, 3:2 print)? | |");
L.push("| **Edit prompts** | Each Edit: prompt describes ONLY the change (no subject re-description)? | |");
L.push("| **Grade-tone fit** | Does the locked grade token match the shoot's tone (editorial/luxury/commercial/candid)? | |");
L.push("| **Copy-paste readiness** | Is every prompt pure copy-paste into Flow/Midjourney/Flux (no meta-commentary)? | |");
L.push("| **Tool fit** | Do the upload notes match the user's tool (Ingredients / --cref / reference image)? | |");
L.push("| **Retouch readiness** | Are edit prompts available for shots that obviously need them (outfit/background/light changes)? | |");
L.push("");
L.push("### 2.2 Creative judgment calls");
L.push("");
L.push("- Shots: any pose/placement/setting that would look forced or render poorly?");
L.push("- Edit prompts: any that would change more than the intended region?");
L.push("- Consistency: any shot that would visibly break the subject's identity (hair, face, outfit, product build/color)?");
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
console.log(`✅ shoot-audit.md → ${basename(outPath)} (${passes.length} PASS · ${warns.length} WARN · ${fails.length} FAIL)`);
for (const r of results.filter((r) => r.status !== "PASS")) {
  console.log(`   ${r.status === "FAIL" ? "❌" : "⚠️"} ${r.check}: ${r.detail}`);
}
if (fails.length) {
  console.error(`❌ ${fails.length} automated FAIL(s) — fix and re-run before spawning the shoot-auditor.`);
  process.exit(1);
}
console.log("Automated checks clean — now spawn the shoot-auditor subagent (see SKILL.md Stage 6) to complete the scorecard + verdict in shoot-audit.md.");
process.exit(0);
