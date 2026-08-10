#!/usr/bin/env node
// The serial-story-reels audit harness — the automated half of the
// series-auditor gate. Scans a delivered episodic series folder and checks
// what a script CAN check: the serialized arc (≥2 episodes, hooks +
// cliffhangers, characters defined, tokens locked), the per-scene prompt pack
// (every prompt still carries the VERBATIM character blocks + grade +
// cinematic + world tokens — word-level, catching hand-edits that drifted),
// verify/bridge markers, voiceover coverage (every speaking scene has a line),
// cinematic-action language (no vague "cinematic shot"), and the character
// sheet + story bible presence. Writes series-audit.md with the automated
// verdicts + an AUDITOR section for the subagent to complete (story pull,
// hook/cliffhanger strength, consistency judgment). Exit 1 on any FAIL.
//
// Usage:
//   node audit-series.mjs --pack <series-folder> [--out series-audit.md]
//
// The folder should contain: series-plan.json, story-bible.md,
// character-sheet.md, prompts.md, voiceover.md (subsets are allowed — missing
// files are reported as FAIL but the audit continues).
//
// Exit codes: 0 = all automated checks PASS, 1 = any FAIL, 2 = usage error.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, basename, join } from "node:path";

// ─── brand banner (deepak-skill · crafted by Deepak) ────────────────────────
const BRAND_LINE = "═".repeat(56);
const banner = (label) =>
  `\n${BRAND_LINE}\n  🎬 deepak-skill — crafted by Deepak\n  skill: serial-story-reels · ${label}\n${BRAND_LINE}\n`;
console.log(banner("audit-series.mjs"));

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
  console.error("Usage: node audit-series.mjs --pack <series-folder> [--out series-audit.md]");
  process.exit(2);
}
const packDir = resolve(process.cwd(), packArg);
const outPath = resolve(process.cwd(), opt("out", "series-audit.md"));
if (!existsSync(packDir)) {
  console.error(`❌ Series folder not found: ${packDir}`);
  console.error("   Pass the folder that holds series-plan.json / story-bible.md / character-sheet.md / prompts.md / voiceover.md");
  process.exit(2);
}

const read = (f) => (existsSync(join(packDir, f)) ? readFileSync(join(packDir, f), "utf8") : null);

// ─── results collector ──────────────────────────────────────────────────────
const results = []; // { status: "PASS"|"FAIL"|"WARN", check, detail }
const add = (status, check, detail) => results.push({ status, check, detail });
let auditSections = []; // auditor-facing notes for the subagent

// --- word-level token check (same logic as episode-prompts.mjs) -------------
function missingWords(text, token) {
  if (!token) return [];
  const words = new Set(token.toLowerCase().match(/[a-z0-9'’]+/g) || []);
  const textWords = new Set(text.toLowerCase().match(/[a-z0-9'’]+/g) || []);
  return [...words].filter((w) => !textWords.has(w));
}

// --- parse series-plan.json + re-validate the arc ---------------------------
let plan = null;
let planParseOk = false;
{
  const raw = read("series-plan.json");
  if (!raw) {
    add("FAIL", "series-plan.json exists", "missing — the plan drives every other file");
  } else {
    try {
      plan = JSON.parse(raw);
      planParseOk = true;
    } catch (e) {
      add("FAIL", "series-plan.json parse", `invalid JSON: ${e.message}`);
    }
  }
}

if (planParseOk) {
  const fails = [];
  const check = (ok, msg) => { if (!ok) fails.push(msg); };
  check(plan.title && plan.title.trim(), "missing title");
  check(plan.logline && plan.logline.trim(), "missing logline");
  check(plan.grade && plan.grade.trim(), "missing grade token");
  check(plan.cinematic && plan.cinematic.trim(), "missing cinematic token");
  check(plan.world && plan.world.trim(), "missing world block");
  const characters = plan.characters || [];
  const charIds = new Set(characters.map((c) => c.id));
  check(characters.length > 0, "no characters defined");
  check(characters.filter((c) => !c.block || !c.block.trim()).length === 0, "character(s) missing verbatim blocks");
  const episodes = plan.episodes || [];
  check(episodes.length >= 2, `a serialized story needs ≥2 episodes (found ${episodes.length})`);
  episodes.forEach((ep, i) => {
    const tag = `episode ${ep.id || i + 1}`;
    check(ep.title && ep.title.trim(), `${tag} missing title`);
    check(ep.hook && ep.hook.trim(), `${tag} missing hook`);
    check(ep.cliffhanger && ep.cliffhanger.trim(), `${tag} missing cliffhanger`);
    check(Array.isArray(ep.scenes) && ep.scenes.length > 0, `${tag} has no scenes`);
    (ep.scenes || []).forEach((s, j) => {
      const stag = `${tag} scene ${s.id || j + 1}`;
      check(s.action && s.action.trim(), `${stag} missing action`);
      check(s.camera && s.camera.trim(), `${stag} missing camera language`);
      const unknown = (s.characters || []).filter((id) => !charIds.has(id));
      check(unknown.length === 0, `${stag} references undefined character(s): ${unknown.join(", ")}`);
    });
  });
  if (fails.length) {
    add("FAIL", "arc re-validation", `${fails.length} violation(s): ${fails.slice(0, 5).join(" · ")}${fails.length > 5 ? " …" : ""}`);
  } else {
    add("PASS", "arc re-validation", `≥2 episodes · hooks + cliffhangers present · characters defined · tokens locked`);
  }
}

// --- parse prompts.md (scene headers + fenced prompts + verify markers) -----
const prompts = read("prompts.md");
let scenesInPrompts = 0;
let verifiedCount = 0;
let unverifiedCount = 0;
let bridgeCount = 0;
const bridgedScenes = new Set(); // scene ids (eN/sN) whose header carries a 🔗 marker
const promptByScene = new Map(); // "e1/s1" -> prompt text
if (!prompts) {
  add("FAIL", "prompts.md exists", "missing — no prompt pack to audit");
} else {
  const verifyAll = (prompts.match(/✅/g) || []).length;
  const failAll = (prompts.match(/❌/g) || []).length;
  verifiedCount = verifyAll;
  unverifiedCount = failAll;
  // scene blocks: ### e1/s1 — Scene N ... ```\nprompt\n```
  const sceneRe = /### (\S+)\s*—\s*Scene \d+[\s\S]*?```\n([\s\S]*?)```/g;
  let m;
  while ((m = sceneRe.exec(prompts)) !== null) {
    scenesInPrompts += 1;
    promptByScene.set(m[1], m[2]);
    if (m[0].includes("🔗")) bridgedScenes.add(m[1]);
  }
  bridgeCount = bridgedScenes.size;
  if (scenesInPrompts === 0) {
    add("FAIL", "prompts.md scenes", "no '### eN/sN — Scene' blocks found");
  } else {
    add("PASS", "prompts.md scenes", `${scenesInPrompts} scene prompt(s) parsed`);
    if (planParseOk) {
      const planScenes = (plan.episodes || []).reduce((n, ep) => n + (ep.scenes || []).length, 0);
      if (planScenes && scenesInPrompts !== planScenes) {
        add("WARN", "prompts.md vs plan scene count", `${scenesInPrompts} in prompts.md vs ${planScenes} in the plan — orphan/stale scenes? re-run episode-prompts.mjs`);
      }
    }
    if (unverifiedCount) add("FAIL", "prompts.md self-verify", `${unverifiedCount} prompt(s) flagged ❌ by the builder`);
    else if (verifiedCount >= scenesInPrompts && verifiedCount > 0) add("PASS", "prompts.md self-verify", `${verifiedCount} ✅ — all scenes consistency-verified`);
    else add("WARN", "prompts.md self-verify", `${verifiedCount}/${scenesInPrompts} ✅ — re-run episode-prompts.mjs if unsure`);
  }
  if (/## Before you start \(do ONCE/.test(prompts)) add("PASS", "prompts.md header", "ingredients + do-once notes present");
  else add("WARN", "prompts.md header", "no 'Before you start' header found");
  if (/Series continuity notes/.test(prompts)) add("PASS", "prompts.md continuity", "series continuity notes present");
  else add("WARN", "prompts.md continuity", "no 'Series continuity notes' section found");
}

// --- per-scene word-level consistency: character blocks + grade + cinematic + world
function auditPromptConsistency() {
  if (!planParseOk) return;
  const characters = plan.characters || [];
  const charById = Object.fromEntries(characters.map((c) => [c.id, c]));
  let scenesWithTokens = 0;
  let totalScenes = 0;
  let drift = [];
  for (const ep of plan.episodes || []) {
    for (const s of ep.scenes || []) {
      totalScenes += 1;
      const key = `${ep.id}/${s.id}`;
      const prompt = promptByScene.get(key);
      if (!prompt) {
        drift.push(`${key} — no prompt found in prompts.md`);
        continue;
      }
      const missing = {};
      missing.grade = missingWords(prompt, plan.grade);
      missing.cinematic = missingWords(prompt, plan.cinematic);
      missing.world = missingWords(prompt, plan.world);
      for (const cid of s.characters || []) {
        const ch = charById[cid];
        if (ch && ch.block) missing[`char:${cid}`] = missingWords(prompt, ch.block);
      }
      const bad = Object.entries(missing).filter(([, v]) => v.length);
      if (bad.length) drift.push(`${key} — missing from ${bad.map(([k, v]) => `${k} (${v.slice(0, 3).join(", ")}…)`).join(", ")}`);
      else scenesWithTokens += 1;
    }
  }
  if (drift.length) add("FAIL", "per-scene token consistency", `${drift.length}/${totalScenes} scene prompt(s) drifted from the locked tokens/character blocks: ${drift.slice(0, 4).join(" · ")}`);
  else if (totalScenes) add("PASS", "per-scene token consistency", `${scenesWithTokens}/${totalScenes} prompts carry verbatim character blocks + grade + cinematic + world`);
}
auditPromptConsistency();

// --- bridge flags vs plan ----------------------------------------------------
if (planParseOk && prompts) {
  const plannedBridges = [];
  for (const ep of plan.episodes || []) {
    for (const s of ep.scenes || []) if (s.bridge) plannedBridges.push(`${ep.id}/${s.id}`);
  }
  if (plannedBridges.length === 0) {
    add("WARN", "bridge continuity", "no scenes marked bridge:true in the plan — check episode boundaries are still bridged via last frames");
  } else if (bridgeCount === plannedBridges.length) {
    add("PASS", "bridge continuity", `${bridgeCount} scene(s) 🔗 match the ${plannedBridges.length} planned bridge(s)`);
  } else {
    add("WARN", "bridge continuity", `prompts.md shows ${bridgeCount} bridged scene(s) but the plan marks ${plannedBridges.length} — re-run episode-prompts.mjs`);
  }
}

// --- cinematic-action language (mechanical sanity: no vague "cinematic shot")
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
  else if (specific === total) add("PASS", "cinematic language", `${specific}/${total} prompts carry specific camera language (shot size + motion + optics)`);
  else add("WARN", "cinematic language", `${specific}/${total} prompts with specific camera language`);
}
auditCinematicLanguage();

// --- voiceover coverage ------------------------------------------------------
const vo = read("voiceover.md");
function auditVoiceover() {
  if (!vo) {
    add("FAIL", "voiceover.md exists", "missing — no voiceover line sheet");
    return;
  }
  if (!planParseOk) {
    add("WARN", "voiceover coverage", "skipped — series-plan.json missing/unparsable, cannot count speaking scenes");
    return;
  }
  const speakingScenes = [];
  for (const ep of plan.episodes || []) {
    for (const s of ep.scenes || []) {
      if (s.dialogue || s.vo) speakingScenes.push(`${ep.id}/${s.id}`);
    }
  }
  // Markdown bolds the scene id INCLUDING the colon: `**s1:** "line"`
  const voLines = (vo.match(/^- \*\*[a-z0-9]+:\*\* /gm) || []).length;
  if (voLines) add("PASS", "voiceover coverage", `${voLines} line(s) in the sheet`);
  else add("FAIL", "voiceover coverage", "no '**sN:** \"line\"' entries found");
  if (speakingScenes.length && voLines < speakingScenes.length) {
    add("FAIL", "voiceover completeness", `${voLines} lines for ${speakingScenes.length} speaking scenes — every speaking scene needs a line`);
  } else if (speakingScenes.length) {
    add("PASS", "voiceover completeness", `${voLines} lines cover ${speakingScenes.length} speaking scene(s)`);
  }
  if (/voice anchor/i.test(vo)) add("PASS", "voiceover voice-anchor", "voice-anchor note present");
  else add("WARN", "voiceover voice-anchor", "no voice-anchor note — add it for cross-episode voice consistency");
  auditSections.push(`voiceover mode: ${/Kokoro/i.test(vo) ? "native Veo + Kokoro post path" : "see sheet"}`);
}
auditVoiceover();

// --- character sheet ----------------------------------------------------------
const sheet = read("character-sheet.md");
function auditCharacterSheet() {
  if (!sheet) {
    add("FAIL", "character-sheet.md exists", "missing — characters have no reference-image plan");
    return;
  }
  if (!planParseOk) {
    add("WARN", "character sheet cast", "skipped — series-plan.json missing/unparsable, cannot verify cast names");
    return;
  }
  const characters = plan.characters || [];
  let named = 0;
  for (const c of characters) {
    const name = c.name || c.id;
    if (sheet.includes(name)) named += 1;
  }
  if (named === characters.length) add("PASS", "character sheet cast", `${named}/${characters.length} characters present`);
  else add("WARN", "character sheet cast", `${named}/${characters.length} characters named in the sheet`);
  const refPrompts = (sheet.match(/Reference-image prompts|reference-image prompts/i) || []).length;
  const hasUploads = /upload|Ingredients|user's uploads|uploaded/i.test(sheet);
  if (refPrompts && hasUploads) add("PASS", "character sheet reference images", "reference-image prompts + upload-to-Ingredients note present");
  else if (refPrompts || hasUploads) add("WARN", "character sheet reference images", "partial reference-image plan — check it lists prompts AND the Ingredients upload note");
  else add("FAIL", "character sheet reference images", "no reference-image prompts and no upload note — the cast can't be locked in Flow");
  if (/Never change|anti-drift|never reword/i.test(sheet)) add("PASS", "character sheet anti-drift", "anti-drift rules present");
  else add("WARN", "character sheet anti-drift", "no explicit 'never change / never reword' rules");
}
auditCharacterSheet();

// --- story bible ---------------------------------------------------------------
const bible = read("story-bible.md");
function auditBible() {
  if (!bible) {
    add("FAIL", "story-bible.md exists", "missing — the season arc is undocumented");
    return;
  }
  if (!planParseOk) {
    add("WARN", "story bible tokens", "skipped — series-plan.json missing/unparsable, cannot verify locked tokens");
    return;
  }
  let tokensOk = 0;
  for (const t of [plan.grade, plan.world, plan.cinematic]) {
    if (t && missingWords(bible, t).length === 0) tokensOk += 1;
  }
  const epTitles = (plan.episodes || []).map((e) => e.title).filter(Boolean);
  const titlesOk = epTitles.filter((t) => bible.includes(t)).length;
  if (tokensOk === 3) add("PASS", "story bible tokens", "grade + world + cinematic locked tokens present");
  else add("WARN", "story bible tokens", `${tokensOk}/3 locked tokens found in story-bible.md`);
  if (titlesOk === epTitles.length && epTitles.length) add("PASS", "story bible episodes", `all ${epTitles.length} episode title(s) present`);
  else add("WARN", "story bible episodes", `${titlesOk}/${epTitles.length} episode titles present`);
  auditSections.push(`season: ${epTitles.join(" → ")}`);
}
auditBible();

const fails = results.filter((r) => r.status === "FAIL");
const warns = results.filter((r) => r.status === "WARN");
const passes = results.filter((r) => r.status === "PASS");

// ─── write series-audit.md ──────────────────────────────────────────────────
const L = [];
L.push(`# Series Audit — ${basename(packDir)}`);
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
  L.push("## 1b. Series snippets for the auditor");
  L.push("");
  for (const s of auditSections) L.push(`- ${s}`);
  L.push("");
}
L.push("## 2. Auditor section — COMPLETE THIS (subagent, fresh eyes)");
L.push("");
L.push("### 2.1 Consistency-worthiness scorecard (rate 1–5 each, /50 — a series worth generating scores ≥ 35)");
L.push("");
L.push("| Criterion | Ask | Score /5 |");
L.push("|---|---|---|");
L.push("| **Cross-episode consistency** | Every prompt carries the verbatim character blocks + grade + cinematic + world tokens (word-level checks passed)? Ingredients reuse plan is real? | |");
L.push("| **Episode-1 hook pull** | Would the Episode 1 hook stop a distracted scroller in the first 2 seconds? | |");
L.push("| **Cliffhanger pull** | Does every episode end on a loop that makes you click Episode 2? | |");
L.push("| **Cinematic action** | Is camera language specific (no vague \"cinematic shot\")? One dominant motion per clip? Physics/motion blur on action? | |");
L.push("| **Voiceover direction** | Are lines in-character with concrete delivery tones? Does the VO sheet cover every speaking scene? | |");
L.push("| **Story logic** | Does the season arc hold together (hooks → cliffhangers → payoff)? Continuity written across episode boundaries? | |");
L.push("| **Copy-paste readiness** | Is every prompt pure copy-paste into Flow (no meta-commentary)? One idea per scene? | |");
L.push("| **Reference-image readiness** | Would the character-sheet reference-image prompts generate a clean, consistent likeness to anchor Flow's Ingredients? | |");
L.push("| **Genre-grade fit** | Does the locked grade/world/cinematic token match the chosen genre preset (comic/love/action/thriller/fantasy)? | |");
L.push("| **Retention pacing** | Do scenes escalate (hook → rise → turn → cliffhanger) per episode, and does the season escalate overall? | |");
L.push("");
L.push("### 2.2 Creative judgment calls");
L.push("");
L.push("- Hooks/cliffhangers: any that read weak, clichéd, or that break the season logic the script can't judge?");
L.push("- Prompts: any prompt that would render poorly (impossible action, character drift, text/warping risk, missing native-audio labels)?");
L.push("- Voiceover: any delivery tone that doesn't fit the character or genre?");
L.push("- Continuity: any scene-to-scene or episode-to-episode cut that would visibly jump (lighting, wardrobe state, location)?");
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
console.log(`✅ series-audit.md → ${basename(outPath)} (${passes.length} PASS · ${warns.length} WARN · ${fails.length} FAIL)`);
for (const r of results.filter((r) => r.status !== "PASS")) {
  console.log(`   ${r.status === "FAIL" ? "❌" : "⚠️"} ${r.check}: ${r.detail}`);
}
if (fails.length) {
  console.error(`❌ ${fails.length} automated FAIL(s) — fix and re-run before spawning the series-auditor.`);
  process.exit(1);
}
console.log("Automated checks clean — now spawn the series-auditor subagent (see SKILL.md Stage 7) to complete the scorecard + verdict in series-audit.md.");
process.exit(0);
