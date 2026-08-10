#!/usr/bin/env node
// The veo-cinematic-reels prompt-pack builder — turns a scene-plan.json into a
// copy-paste prompt pack for Google Flow / Veo 3.1: ONE full video-generation
// prompt per scene, engineered for character consistency (verbatim character
// block + grade token + IMAX token in EVERY prompt), native dialogue/SFX audio,
// and first/last-frame bridge flags for seamless cuts.
//
// Usage:
//   node scene-prompts.mjs --plan scene-plan.json [--out prompts.md]
//
// scene-plan.json contract:
// {
//   "title": "My Reel",
//   "grade": "Grade: cinematic teal-and-orange, ... (the FULL token from the skill)",
//   "world": "World: ... (verbatim world/lighting block)",
//   "character": "Character: Marcus, a 34-year-old detective, ... (VERBATIM block)",
//   "imax": "IMAX-style cinematic scale: ... (optional — defaults to the skill token)",
//   "ingredients": ["front-portrait.png", "three-quarter.png", "full-body.png"],
//   "scenes": [
//     { "id": "hook", "action": "...", "dialogue": "...", "camera": "...", "context": "...", "sfx": "...", "duration": 6, "bridge": false }
//   ]
// }
//
// Self-verify: every generated prompt is checked word-by-word for the FULL
// character block, grade token and IMAX token. Any missing word is a FAIL.
//
// Exit codes: 0 = OK, 1 = verify FAIL, 2 = usage error.
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, basename } from "node:path";

// ─── brand banner (deepak-skill · crafted by Deepak) ────────────────────────
const BRAND_LINE = "═".repeat(56);
const banner = (label) =>
  `\n${BRAND_LINE}\n  🎬 deepak-skill — crafted by Deepak\n  skill: veo-cinematic-reels · ${label}\n${BRAND_LINE}\n`;
console.log(banner("scene-prompts.mjs"));

// --- tiny arg parser (same style as the other skill scripts) ----------------
const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const needle = `--${name}`;
  const found = args.find((a) => a === needle || a.startsWith(`${needle}=`));
  if (found === undefined) return fallback;
  const eq = found.indexOf("=");
  return eq !== -1 ? found.slice(eq + 1) : args[args.indexOf(found) + 1];
};

const planArg = opt("plan");
if (!planArg) {
  console.error("Usage: node scene-prompts.mjs --plan scene-plan.json [--out prompts.md]");
  process.exit(2);
}

let plan;
try {
  plan = JSON.parse(readFileSync(resolve(process.cwd(), planArg), "utf8"));
} catch (e) {
  console.error(`❌ Could not parse ${planArg}: ${e.message}`);
  console.error("   Check the JSON syntax (commas, quotes, braces) and try again.");
  process.exit(2);
}
const outPath = resolve(process.cwd(), opt("out", "prompts.md"));
const DUR = plan.duration || 6;

// Default IMAX token (same as the skill's — override via plan.imax if needed).
const IMAX =
  plan.imax ||
  "IMAX-style cinematic scale: large-format digital cinema camera, full-frame sensor look, anamorphic-style widescreen feel adapted to vertical 9:16, smooth gimbal-stabilized camera motion, rich dynamic range, crisp highlight rolloff, premium film-grain finish, no camera shake, no warping, no morphing artifacts.";

// --- token presence check (word-level) ---------------------------------------
function missingWords(promptText, token) {
  if (!token) return [];
  const words = new Set(token.toLowerCase().match(/[a-z0-9'’]+/g) || []);
  const promptWords = new Set(promptText.toLowerCase().match(/[a-z0-9'’]+/g) || []);
  return [...words].filter((w) => !promptWords.has(w));
}

// --- build one prompt per scene ----------------------------------------------
function buildPrompt(scene) {
  const parts = [];
  // 1. Cinematography — camera framing + motion + lens (specific, never vague)
  parts.push(scene.camera || "Medium shot, smooth push-in");
  // 2. Subject — the VERBATIM character block
  parts.push(plan.character);
  // 3. Action — what happens in this clip, written as plain motion
  parts.push(scene.action || "");
  // 4. Context — location + time + lighting state (continuity across scenes)
  parts.push(scene.context || "");
  // 5. Style & ambiance — grade token + IMAX token + world
  parts.push(plan.grade);
  parts.push(IMAX);
  if (plan.world) parts.push(plan.world);
  // Native audio — dialogue in quotes with delivery, SFX/ambient labeled.
  // Trim a redundant "SFX:"/"Ambient:" prefix already written in the plan so
  // "Ambient: ..." in the sfx field becomes "SFX: ..." not "SFX: Ambient: ...".
  const sfx = (scene.sfx || "").replace(/^(SFX|Ambient|Ambiance):\s*/i, "").trim();
  if (scene.dialogue) parts.push(`Dialogue: ${scene.dialogue}`);
  if (sfx) parts.push(`SFX: ${sfx}`);
  // Join with ". " but strip only TRAILING periods per part — never collapse
  // mid-text dots, so ellipses in dialogue ("Wait...") survive intact.
  const prompt = parts
    .map((p) => p.trim().replace(/\.+$/, ""))
    .filter(Boolean)
    .join(". ") + ".";
  return prompt;
}

// --- assemble -----------------------------------------------------------------
const scenes = plan.scenes || [];
const lines = [];
lines.push(`# Veo Prompt Pack — "${plan.title}"`);
lines.push("");
lines.push(`**Platform:** Google Flow / Veo 3.1 · **Aspect:** 9:16 vertical · **Clip:** ${DUR}s per scene · ${scenes.length} scenes · ~${scenes.length * DUR}s reel`);
lines.push("");
lines.push("## Before you start (do ONCE)");
lines.push("1. **Upload these reference images to Flow's Ingredients panel** (reuse for every scene):");
(plan.ingredients || []).forEach((img, i) => lines.push(`   - ${img}${i === 0 ? "  ← primary character anchor" : ""}`));
lines.push("2. **Never edit the character block** — it is identical in every prompt below. Rewording breaks consistency.");
lines.push(`3. **Grade locked:** ${plan.grade}`);
lines.push(`4. Generate at **9:16, ${DUR}s, 1080p** (4K upscale after). For bridged scenes (marked 🔗), export the previous scene's **last frame** and set it as the start frame.`);
lines.push("");
lines.push("---");
lines.push("");

let fail = 0;
scenes.forEach((s, i) => {
  const prompt = buildPrompt(s);
  // Self-verify: full character block + grade + IMAX present word-by-word
  const check = {
    character: missingWords(prompt, plan.character),
    grade: missingWords(prompt, plan.grade),
    imax: missingWords(prompt, IMAX),
  };
  const ok = !check.character.length && !check.grade.length && !check.imax.length;
  if (!ok) fail += 1;

  lines.push(`### Scene ${i + 1} — ${s.id}${s.bridge ? "  🔗 (bridge: start from scene " + (i) + "'s last frame)" : ""}`);
  lines.push(`**Time:** ${i * DUR}s–${(i + 1) * DUR}s · **${DUR}s clip** · **verify:** ${ok ? "✅" : "❌"}`);
  lines.push("");
  lines.push("```");
  lines.push(prompt);
  lines.push("```");
  if (check.character.length) lines.push(`⚠ missing from character block: ${check.character.join(", ")}`);
  if (check.grade.length) lines.push(`⚠ missing from grade: ${check.grade.join(", ")}`);
  if (check.imax.length) lines.push(`⚠ missing from IMAX token: ${check.imax.join(", ")}`);
  lines.push("");
  lines.push("---");
  lines.push("");
});

lines.push("## Assembly order (in Flow / editor)");
scenes.forEach((s, i) => lines.push(`${i + 1}. Scene ${i + 1} — ${s.id}${s.bridge ? " (start frame = scene " + i + " last frame)" : ""}`));
lines.push("");
lines.push("Post: cut to beats, add on-screen text/captions, mix to -14 LUFS.");

writeFileSync(outPath, lines.join("\n"), "utf8");

const total = scenes.length;
console.log(`✅ ${total} Veo prompts → ${basename(outPath)} (${total - fail}/${total} consistency-verified)`);
if (fail) {
  console.error(`❌ ${fail} prompt(s) FAILED consistency verification — fix the plan fields (character/grade/imax) and regenerate.`);
  process.exit(1);
}
console.log("Copy each prompt from the pack into Google Flow, keep the same Ingredients, and generate scene by scene.");
process.exit(0);
