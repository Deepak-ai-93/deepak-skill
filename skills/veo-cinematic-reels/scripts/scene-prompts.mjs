#!/usr/bin/env node
// The veo-cinematic-reels prompt-pack builder — turns a scene-plan.json into a
// copy-paste prompt pack for ANY modern video generator (Google Flow / Veo 3.1,
// Kling, Luma, Runway, Hailuo, Vidu, Pika, PixVerse): ONE full video-generation
// prompt per scene, engineered for character consistency (verbatim character
// block + grade token + IMAX token in EVERY prompt), rich cinematic detail
// (lens, tempo, lighting hand-offs), native dialogue/SFX audio, a labeled
// negative prompt + locked seed, and first/last-frame bridge flags for
// seamless cuts.
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
//   "negative": "no warping, no morphing, ... (optional — default negative prompt)",
//   "seed": 482913,                       // optional — locked seed, appended per scene
//   "scenes": [
//     { "id": "hook", "action": "...", "dialogue": "...", "camera": "...",
//       "lens": "85mm portrait lens, shallow depth of field",     // optional
//       "tempo": "slow-motion (50% speed)",                        // optional
//       "lighting": "warm golden-hour side light",                 // optional
//       "negative": "no rain, no umbrellas",                        // optional per-scene override
//       "context": "...", "sfx": "...", "duration": 6, "bridge": false }
//   ]
// }
//
// Self-verify: every generated prompt is checked word-by-word for the FULL
// character block, grade token, IMAX token and world token. Any missing word
// is a FAIL.
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

// --- required-field guard (house style: exit 2 with a friendly message) ------
const missing = ["title", "grade", "character", "scenes"]
  .filter((k) => plan[k] === undefined || plan[k] === null || plan[k] === "" || (Array.isArray(plan[k]) && plan[k].length === 0));
if (missing.length) {
  console.error(`❌ scene-plan.json is missing required field(s): ${missing.join(", ")}`);
  console.error("   Required: title, grade, character, scenes (non-empty). Optional: world, imax, ingredients, negative, seed.");
  process.exit(2);
}

const DUR = plan.duration || 6;

// Default IMAX token (same as the skill's — override via plan.imax if needed).
const IMAX =
  plan.imax ||
  "IMAX-style cinematic scale: large-format digital cinema camera, full-frame sensor look, anamorphic-style widescreen feel adapted to vertical 9:16, smooth gimbal-stabilized camera motion, rich dynamic range, crisp highlight rolloff, premium film-grain finish, no camera shake, no warping, no morphing artifacts.";

// Default negative prompt — pasted per scene as a labeled line. Tools with a
// dedicated negative field (Kling, Luma, Hailuo, Vidu, Pika, Runway) take it
// verbatim; prompt-only tools (Flow/Veo) read it as harmless plain text.
const NEGATIVE =
  plan.negative ||
  "no warping, no morphing, no extra limbs, no extra fingers, no distorted faces, no flickering, no watermark, no text overlay, no logo, no camera shake, no jitter, no motion blur, no low resolution, no compression artifacts.";

// --- token presence check (word-level) ---------------------------------------
function missingWords(promptText, token) {
  if (!token) return [];
  const words = new Set(token.toLowerCase().match(/[a-z0-9'’]+/g) || []);
  const promptWords = new Set(promptText.toLowerCase().match(/[a-z0-9'’]+/g) || []);
  return [...words].filter((w) => !promptWords.has(w));
}

const wordCount = (t) => (t.match(/\S+/g) || []).length;

// --- build one rich prompt per scene ------------------------------------------
function buildPrompt(scene) {
  const parts = [];
  // 1. Cinematography — framing + motion (specific, never vague)
  parts.push(scene.camera || "Medium shot, smooth push-in");
  // 1b. Lens / optics (optional but recommended — pick one, be specific)
  if (scene.lens) parts.push(scene.lens);
  // 1c. Tempo (optional — slow-motion / real-time / speed-ramp)
  if (scene.tempo) parts.push(`Tempo: ${scene.tempo}`);
  // 2. Subject — the VERBATIM character block
  parts.push(plan.character);
  // 3. Action — what happens in this clip, written as plain motion
  parts.push(scene.action || "");
  // 4. Context — location + time + lighting state (continuity across scenes)
  parts.push(scene.context || "");
  // 4b. Lighting hand-off (optional — explicit light state carried across cuts)
  if (scene.lighting) parts.push(`Lighting: ${scene.lighting}`);
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
lines.push(`**Any video generator:** Google Flow / Veo 3.1 · Kling · Luma · Runway · Hailuo · Vidu · Pika · PixVerse · **Aspect:** 9:16 vertical · **Clip:** ${DUR}s per scene · ${scenes.length} scenes · ~${scenes.length * DUR}s reel`);
lines.push("");
lines.push("## Before you start (do ONCE)");
lines.push("1. **Upload these reference images to your tool's character-reference panel** (reuse for every scene):");
(plan.ingredients || []).forEach((img, i) => lines.push(`   - ${img}${i === 0 ? "  ← primary character anchor" : ""}`));
lines.push("   - Flow/Veo → **Ingredients** panel · Kling → **Elements** (tag `<<<element_1>>>` in each prompt) · Runway/Luma → **image-to-video** from the reference image");
lines.push("2. **Never edit the character block** — it is identical in every prompt below. Rewording breaks consistency.");
lines.push(`3. **Grade locked:** ${plan.grade}`);  lines.push(`4. **Negative prompt:** every scene block ends with a labeled \`Negative prompt:\` line. If your tool has a dedicated negative field (Kling, Luma, Hailuo, Vidu, Pika, Runway), paste that line into it verbatim. Prompt-only tools (Flow/Veo) ignore it as plain text.`);
if (plan.seed !== undefined) lines.push(`5. **Seed locked:** ${plan.seed} — reuse the same seed across every scene. Tools with a seed setting (Kling, Luma, Hailuo, Vidu, Runway) take it there; API tools take it in the request; UI-only tools ignore it.`);
lines.push(`${plan.seed !== undefined ? 6 : 5}. Generate at **9:16, ${DUR}s, 1080p** (4K upscale after). For bridged scenes (marked 🔗), export the previous scene's **last frame** and set it as the start frame (Flow: Frames→video · Kling: start-frame · Runway/Luma: first-frame image).`);
lines.push("");
lines.push("---");
lines.push("");

let fail = 0;
scenes.forEach((s, i) => {
  const prompt = buildPrompt(s);
  const words = wordCount(prompt);
  // Self-verify: full character block + grade + IMAX + world present word-by-word
  const check = {
    character: missingWords(prompt, plan.character),
    grade: missingWords(prompt, plan.grade),
    imax: missingWords(prompt, IMAX),
    world: missingWords(prompt, plan.world),
  };
  const ok = !check.character.length && !check.grade.length && !check.imax.length && !check.world.length;
  if (!ok) fail += 1;

  lines.push(`### Scene ${i + 1} — ${s.id}${s.bridge ? "  🔗 (bridge: start from scene " + (i) + "'s last frame)" : ""}`);
  lines.push(`**Time:** ${i * DUR}s–${(i + 1) * DUR}s · **${DUR}s clip** · **${words} words** · **verify:** ${ok ? "✅" : "❌"}`);
  lines.push("");
  lines.push("```");
  lines.push(prompt);
  lines.push("");
  lines.push(`Negative prompt: ${s.negative || NEGATIVE}`);
  if (plan.seed !== undefined) lines.push(`Seed: ${plan.seed}`);
  lines.push("```");
  if (check.character.length) lines.push(`⚠ missing from character block: ${check.character.join(", ")}`);
  if (check.grade.length) lines.push(`⚠ missing from grade: ${check.grade.join(", ")}`);
  if (check.imax.length) lines.push(`⚠ missing from IMAX token: ${check.imax.join(", ")}`);
  if (check.world.length) lines.push(`⚠ missing from world token: ${check.world.join(", ")}`);
  lines.push("");
  lines.push("---");
  lines.push("");
});

lines.push("## Assembly order (in your editor)");
scenes.forEach((s, i) => lines.push(`${i + 1}. Scene ${i + 1} — ${s.id}${s.bridge ? " (start frame = scene " + i + " last frame)" : ""}`));
lines.push("");
lines.push("Post: cut to beats, add on-screen text/captions, mix to -14 LUFS.");

writeFileSync(outPath, lines.join("\n"), "utf8");

const total = scenes.length;
console.log(`✅ ${total} Veo prompts → ${basename(outPath)} (${total - fail}/${total} consistency-verified)`);
if (fail) {
  console.error(`❌ ${fail} prompt(s) FAILED consistency verification — fix the plan fields (character/grade/imax/world) and regenerate.`);
  process.exit(1);
}
console.log("Copy each prompt block into your video generator, keep the same reference images, and generate scene by scene.");
process.exit(0);
