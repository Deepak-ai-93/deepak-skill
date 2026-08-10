#!/usr/bin/env node
// The veo-cinematic-reels audit harness — the automated half of the
// reel-auditor gate. Scans a delivered reel pack and checks what a script CAN
// check: the scene-plan.json (title, grade, world, character block, scenes),
// the prompts.md prompt pack (every scene prompt still carries the VERBATIM
// character block + grade + IMAX + world tokens — word-level, catching
// hand-edits that drifted; verify markers; word counts in the rich long-form
// band; negative prompt + seed lines; bridge flags), cinematic language (no
// vague "cinematic shot"), the character sheet (reference-image prompts +
// upload note + anti-drift), and the scene script (retention arc + continuity).
// Writes reels-audit.md with the automated verdicts + an AUDITOR section for
// the subagent to complete (hook pull, cinematic judgment, render risk).
// Exit 1 on any FAIL.
//
// Usage:
//   node audit-reels.mjs --pack <reel-folder> [--out reels-audit.md]
//
// The folder should contain: scene-plan.json, prompts.md, character-sheet.md,
// scene-script.md (subsets are allowed — missing files are reported as FAIL
// but the audit continues).
//
// Exit codes: 0 = all automated checks PASS, 1 = any FAIL, 2 = usage error.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, basename, join } from "node:path";

// ─── brand banner (deepak-skill · crafted by Deepak) ────────────────────────
const BRAND_LINE = "═".repeat(56);
const banner = (label) =>
  `\n${BRAND_LINE}\n  🎬 deepak-skill — crafted by Deepak\n  skill: veo-cinematic-reels · ${label}\n${BRAND_LINE}\n`;
console.log(banner("audit-reels.mjs"));

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
  console.error("Usage: node audit-reels.mjs --pack <reel-folder> [--out reels-audit.md]");
  process.exit(2);
}
const packDir = resolve(process.cwd(), packArg);
const outPath = resolve(process.cwd(), opt("out", "reels-audit.md"));
if (!existsSync(packDir)) {
  console.error(`❌ Reel folder not found: ${packDir}`);
  console.error("   Pass the folder that holds scene-plan.json / prompts.md / character-sheet.md / scene-script.md");
  process.exit(2);
}

const read = (f) => (existsSync(join(packDir, f)) ? readFileSync(join(packDir, f), "utf8") : null);

// ─── results collector ──────────────────────────────────────────────────────
const results = []; // { status: "PASS"|"FAIL"|"WARN", check, detail }
const add = (status, check, detail) => results.push({ status, check, detail });
let auditSections = []; // auditor-facing notes for the subagent

// --- word-level token check (same logic as scene-prompts.mjs) ---------------
function missingWords(text, token) {
  if (!token) return [];
  const words = new Set(token.toLowerCase().match(/[a-z0-9'’]+/g) || []);
  const textWords = new Set(text.toLowerCase().match(/[a-z0-9'’]+/g) || []);
  return [...words].filter((w) => !textWords.has(w));
}

// --- parse scene-plan.json ---------------------------------------------------
let plan = null;
let planParseOk = false;
{
  const raw = read("scene-plan.json");
  if (!raw) {
    add("FAIL", "scene-plan.json exists", "missing — the plan drives every other file");
  } else {
    try {
      plan = JSON.parse(raw);
      planParseOk = true;
    } catch (e) {
      add("FAIL", "scene-plan.json parse", `invalid JSON: ${e.message}`);
    }
  }
}

if (planParseOk) {
  const fails = [];
  const check = (ok, msg) => { if (!ok) fails.push(msg); };
  check(plan.title && plan.title.trim(), "missing title");
  check(plan.grade && plan.grade.trim(), "missing grade token");
  check(plan.character && plan.character.trim(), "missing character block");
  const scenes = plan.scenes || [];
  check(scenes.length > 0, "no scenes defined");
  scenes.forEach((s, i) => {
    const tag = `scene ${s.id || i + 1}`;
    check(s.camera && s.camera.trim(), `${tag} missing camera language`);
    check(s.action && s.action.trim(), `${tag} missing action`);
    if (!s.action && !s.dialogue) check(false, `${tag} has neither action nor dialogue — an empty clip`);
  });
  if (fails.length) {
    add("FAIL", "plan integrity", `${fails.length} violation(s): ${fails.slice(0, 5).join(" · ")}${fails.length > 5 ? " …" : ""}`);
  } else {
    add("PASS", "plan integrity", `title · grade · character · ${scenes.length} scenes with camera + action`);
  }
  if (plan.seed !== undefined && plan.seed !== null) auditSections.push(`seed locked: ${plan.seed}`);
}

// --- parse prompts.md (scene headers + fenced prompts + verify markers) -----
const prompts = read("prompts.md");
let scenesInPrompts = 0;
let verifiedCount = 0;
let unverifiedCount = 0;
let bridgeCount = 0;
const bridgedScenes = new Set();
const promptByScene = new Map(); // scene id -> prompt text
const wordCounts = [];           // per-scene word counts
if (!prompts) {
  add("FAIL", "prompts.md exists", "missing — no prompt pack to audit");
} else {
  const verifyAll = (prompts.match(/✅/g) || []).length;
  const failAll = (prompts.match(/❌/g) || []).length;
  verifiedCount = verifyAll;
  unverifiedCount = failAll;
  // scene blocks: ### Scene N — id ... ```\nprompt\n``` (+ Negative prompt / Seed lines)
  const sceneRe = /### Scene \d+\s*—\s*(\S+)[\s\S]*?```\n([\s\S]*?)```/g;
  let m;
  while ((m = sceneRe.exec(prompts)) !== null) {
    scenesInPrompts += 1;
    promptByScene.set(m[1], m[2]);
    if (m[0].includes("🔗")) bridgedScenes.add(m[1]);
    const words = (m[2].match(/\S+/g) || []).length;
    wordCounts.push(words);
  }
  bridgeCount = bridgedScenes.size;
  if (scenesInPrompts === 0) {
    add("FAIL", "prompts.md scenes", "no '### Scene N — id' blocks found");
  } else {
    add("PASS", "prompts.md scenes", `${scenesInPrompts} scene prompt(s) parsed`);
    if (planParseOk && plan.scenes && scenesInPrompts !== plan.scenes.length) {
      add("WARN", "prompts.md vs plan scene count", `${scenesInPrompts} in prompts.md vs ${plan.scenes.length} in the plan — orphan/stale scenes? re-run scene-prompts.mjs`);
    }
    if (unverifiedCount) add("FAIL", "prompts.md self-verify", `${unverifiedCount} prompt(s) flagged ❌ by the builder`);
    else if (verifiedCount >= scenesInPrompts && verifiedCount > 0) add("PASS", "prompts.md self-verify", `${verifiedCount} ✅ — all scenes consistency-verified`);
    else add("WARN", "prompts.md self-verify", `${verifiedCount}/${scenesInPrompts} ✅ — re-run scene-prompts.mjs if unsure`);
    // rich long-form band: ~150–250 words expected (tokens alone run ~140)
    const under = wordCounts.filter((w) => w < 120).length;
    const over = wordCounts.filter((w) => w > 320).length;
    if (under) add("WARN", "prompt length (rich long-form)", `${under}/${scenesInPrompts} prompt(s) under 120 words — scene-specific detail is thin (target ~150–250)`);
    else if (over) add("WARN", "prompt length (rich long-form)", `${over}/${scenesInPrompts} prompt(s) over 320 words — likely over-stuffed, one idea per scene`);
    else add("PASS", "prompt length (rich long-form)", `all ${scenesInPrompts} prompt(s) in the 120–320 word band (target ~150–250)`);
    const negativeLines = (prompts.match(/^Negative prompt:/gm) || []).length;
    const seedLines = (prompts.match(/^Seed: /gm) || []).length;
    if (negativeLines >= scenesInPrompts) add("PASS", "negative prompt per scene", `${negativeLines} labeled Negative prompt line(s)`);
    else if (negativeLines) add("WARN", "negative prompt per scene", `${negativeLines}/${scenesInPrompts} scene(s) carry a Negative prompt line`);
    else add("FAIL", "negative prompt per scene", "no labeled Negative prompt lines found — re-run scene-prompts.mjs");
    if (planParseOk && plan.seed !== undefined && plan.seed !== null && seedLines < scenesInPrompts) {
      add("WARN", "seed locked per scene", `${seedLines}/${scenesInPrompts} scene(s) carry the Seed line (plan has seed ${plan.seed})`);
    } else if (planParseOk && plan.seed !== undefined && plan.seed !== null) {
      add("PASS", "seed locked per scene", `${seedLines} Seed line(s) match the locked seed`);
    }
  }
  if (/Before you start \(do ONCE/.test(prompts)) add("PASS", "prompts.md header", "tool-agnostic 'Before you start' header present");
  else add("WARN", "prompts.md header", "no 'Before you start' header found");
  if (/Assembly order/.test(prompts)) add("PASS", "prompts.md assembly", "assembly order section present");
  else add("WARN", "prompts.md assembly", "no 'Assembly order' section found");
}

// --- per-scene word-level consistency: character + grade + IMAX + world -----
function auditPromptConsistency() {
  if (!planParseOk) return;
  let scenesWithTokens = 0;
  let totalScenes = 0;
  let drift = [];
  const imax =
    plan.imax ||
    "IMAX-style cinematic scale: large-format digital cinema camera, full-frame sensor look, anamorphic-style widescreen feel adapted to vertical 9:16, smooth gimbal-stabilized camera motion, rich dynamic range, crisp highlight rolloff, premium film-grain finish, no camera shake, no warping, no morphing artifacts.";
  for (const s of plan.scenes || []) {
    totalScenes += 1;
    const key = s.id || String(totalScenes);
    const prompt = promptByScene.get(key);
    if (!prompt) {
      drift.push(`${key} — no prompt found in prompts.md`);
      continue;
    }
    const missing = {};
    missing.character = missingWords(prompt, plan.character);
    missing.grade = missingWords(prompt, plan.grade);
    missing.imax = missingWords(prompt, imax);
    missing.world = missingWords(prompt, plan.world);
    const bad = Object.entries(missing).filter(([, v]) => v.length);
    if (bad.length) drift.push(`${key} — missing from ${bad.map(([k, v]) => `${k} (${v.slice(0, 3).join(", ")}…)`).join(", ")}`);
    else scenesWithTokens += 1;
  }
  if (drift.length) add("FAIL", "per-scene token consistency", `${drift.length}/${totalScenes} scene prompt(s) drifted from the locked tokens: ${drift.slice(0, 4).join(" · ")}`);
  else if (totalScenes) add("PASS", "per-scene token consistency", `${scenesWithTokens}/${totalScenes} prompts carry verbatim character block + grade + IMAX + world`);
}
auditPromptConsistency();

// --- bridge flags vs plan ----------------------------------------------------
if (planParseOk && prompts) {
  const plannedBridges = (plan.scenes || []).filter((s) => s.bridge).length;
  if (plannedBridges === 0) {
    add("WARN", "bridge continuity", "no scenes marked bridge:true in the plan — check seamless cuts are still planned");
  } else if (bridgeCount === plannedBridges) {
    add("PASS", "bridge continuity", `${bridgeCount} scene(s) 🔗 match the ${plannedBridges} planned bridge(s)`);
  } else {
    add("WARN", "bridge continuity", `prompts.md shows ${bridgeCount} bridged scene(s) but the plan marks ${plannedBridges} — re-run scene-prompts.mjs`);
  }
}

// --- cinematic-action language (mechanical sanity) ---------------------------
function auditCinematicLanguage() {
  if (!prompts) return;
  let vague = 0;
  let specific = 0;
  const vocab = /close-up|medium shot|wide|tracking|dolly|push-in|arc|handheld|crane|orbiting|whip pan|aerial|low-angle|85mm|24mm|35mm|50mm|100mm|slow-motion|speed-ramp|real-time/i;
  for (const [, prompt] of promptByScene) {
    if (/cinematic shot|cinematic scene/i.test(prompt)) vague += 1;
    else if (vocab.test(prompt)) specific += 1;
  }
  const total = promptByScene.size;
  if (!total) return;
  if (vague) add("FAIL", "cinematic language", `${vague}/${total} prompt(s) use vague "cinematic shot" phrasing — be specific`);
  else if (specific === total) add("PASS", "cinematic language", `${specific}/${total} prompts carry specific camera language (shot + motion + optics)`);
  else add("WARN", "cinematic language", `${specific}/${total} prompts with specific camera language`);
  const withLens = [...promptByScene.values()].filter((p) => /mm|macro|anamorphic|lens/i.test(p)).length;
  if (withLens === total) add("PASS", "lens detail", `all ${total} prompts carry lens/optics detail`);
  else add("WARN", "lens detail", `${withLens}/${total} prompts carry explicit lens detail`);
}
auditCinematicLanguage();

// --- character sheet ----------------------------------------------------------
const sheet = read("character-sheet.md");
function auditCharacterSheet() {
  if (!sheet) {
    add("FAIL", "character-sheet.md exists", "missing — the character has no reference-image plan");
    return;
  }
  const refPrompts = (sheet.match(/Reference-image prompts|reference-image prompts/i) || []).length;
  const hasUpload = /upload|Ingredients|Elements|image-to-video|--cref/i.test(sheet);
  if (refPrompts && hasUpload) add("PASS", "character sheet reference images", "reference-image prompts + per-tool upload note present");
  else if (refPrompts || hasUpload) add("WARN", "character sheet reference images", "partial reference-image plan — check it lists prompts AND an upload note");
  else add("FAIL", "character sheet reference images", "no reference-image prompts and no upload note — the character can't be locked");
  if (/Never change|anti-drift|never reword/i.test(sheet)) add("PASS", "character sheet anti-drift", "anti-drift rules present");
  else add("WARN", "character sheet anti-drift", "no explicit 'never change / never reword' rules");
}
auditCharacterSheet();

// --- scene script --------------------------------------------------------------
const script = read("scene-script.md");
function auditSceneScript() {
  if (!script) {
    add("FAIL", "scene-script.md exists", "missing — the retention arc is undocumented");
    return;
  }
  if (/hook|Hook/i.test(script)) add("PASS", "scene script arc", "hook beat present");
  else add("FAIL", "scene script arc", "no hook beat found");
  if (/CTA|loop|payoff|Payoff/i.test(script)) add("PASS", "scene script payoff", "payoff / CTA / loop ending present");
  else add("WARN", "scene script payoff", "no payoff/CTA/loop ending found");
  if (/Continuity|continuity/i.test(script)) add("PASS", "scene script continuity", "continuity notes present");
  else add("WARN", "scene script continuity", "no continuity section (lighting/wardrobe hand-offs across scenes)");
  const dialogue = (script.match(/"[^"]+"/g) || []).length;
  if (dialogue) auditSections.push(`scene script has ${dialogue} quoted dialogue line(s)`);
}
auditSceneScript();

const fails = results.filter((r) => r.status === "FAIL");
const warns = results.filter((r) => r.status === "WARN");
const passes = results.filter((r) => r.status === "PASS");

// ─── write reels-audit.md ───────────────────────────────────────────────────
const L = [];
L.push(`# Reels Audit — ${basename(packDir)}`);
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
  L.push("## 1b. Reel snippets for the auditor");
  L.push("");
  for (const s of auditSections) L.push(`- ${s}`);
  L.push("");
}
L.push("## 2. Auditor section — COMPLETE THIS (subagent, fresh eyes)");
L.push("");
L.push("### 2.1 Reel-worthiness scorecard (rate 1–5 each, /50 — a reel worth generating scores ≥ 35)");
L.push("");
L.push("| Criterion | Ask | Score /5 |");
L.push("|---|---|---|");
L.push("| **Character consistency** | Every prompt carries the verbatim character block + grade + IMAX + world tokens (word-level checks passed)? Reference-image reuse plan is real? | |");
L.push("| **Hook pull (scene 1)** | Would the opening scene stop a distracted scroller in the first 2 seconds? | |");
L.push("| **Retention arc** | Hook → agitate → payoff → CTA/loop all present and escalating? Scene count × duration in the 30–60s target? | |");
L.push("| **Cinematic action** | Camera language specific (no vague \"cinematic shot\")? One dominant motion per clip? Lens/tempo/lighting detail present? | |");
L.push("| **Dialogue/SFX direction** | Dialogue in quotes with delivery tone? SFX/ambient labeled? Voice consistent per character? | |");
L.push("| **Continuity** | Lighting hand-offs written between scenes? No wardrobe/hair state contradictions? Bridge flags on the right cuts? | |");
L.push("| **Copy-paste readiness** | Is every prompt pure copy-paste into the user's tool (no meta-commentary)? One idea per scene? | |");
L.push("| **Reference-image readiness** | Would the character-sheet reference-image prompts generate a clean, consistent likeness for the user's tool (Ingredients/Elements/image-to-video)? | |");
L.push("| **Grade-tone fit** | Does the locked grade + world token match the reel's tone (action/emotional/luxury)? | |");
L.push("| **Safety nets** | Negative prompt per scene? Seed locked across scenes when API? | |");
L.push("");
L.push("### 2.2 Creative judgment calls");
L.push("");
L.push("- Hooks: any that read weak, clichéd, or mismatch the topic?");
L.push("- Prompts: any that would render poorly (impossible action, character drift, text/warping risk, missing audio labels)?");
L.push("- Continuity: any cut that would visibly jump (lighting, wardrobe state, location)?");
L.push("- Tool fit: do the header upload instructions match the user's actual generator?");
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
console.log(`✅ reels-audit.md → ${basename(outPath)} (${passes.length} PASS · ${warns.length} WARN · ${fails.length} FAIL)`);
for (const r of results.filter((r) => r.status !== "PASS")) {
  console.log(`   ${r.status === "FAIL" ? "❌" : "⚠️"} ${r.check}: ${r.detail}`);
}
if (fails.length) {
  console.error(`❌ ${fails.length} automated FAIL(s) — fix and re-run before spawning the reel-auditor.`);
  process.exit(1);
}
console.log("Automated checks clean — now spawn the reel-auditor subagent (see SKILL.md Stage 6) to complete the scorecard + verdict in reels-audit.md.");
process.exit(0);
