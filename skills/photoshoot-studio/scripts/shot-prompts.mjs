#!/usr/bin/env node
// The photoshoot-studio prompt-pack builder — turns a shoot-plan.json into a
// copy-paste image prompt pack for AI tools (Google Flow / Nano Banana Pro,
// Midjourney, Flux): ONE full image-generation prompt per shot, engineered
// for subject consistency (verbatim subject block + grade token + craft token
// in EVERY prompt), professional photography language, per-platform aspect
// ratios, and short localized edit/inpaint prompts for retouches.
//
// Usage:
//   node shot-prompts.mjs --plan shoot-plan.json [--out prompts.md]
//
// shoot-plan.json contract:
// {
//   "title": "Founder Editorial Shoot",
//   "kind": "person",              // "person" | "product"
//   "aspect": "4:5",               // default aspect (can be overridden per shot)
//   "grade": "Grade: warm golden Kodak Portra 400 look, ... (FULL token from the skill)",
//   "craft": "Craft: shot on Hasselblad X2D medium format, 85mm f/1.8, ... (FULL token)",
//   "subject": "Subject: Ava, a 29-year-old startup founder, ... (VERBATIM block)",
//   "references": ["ava-front.png", "ava-three-quarter.png", "ava-full-body.png"],
//   "shots": [
//     { "id": "hero", "style": "editorial fashion photography", "pose": "...",
//       "setting": "...", "props": "...", "lighting": "...",
//       "aspect": "4:5", "edit": "replace the background with a rooftop at dusk" }
//   ]
// }
//
// Self-verify: every generated prompt is checked word-by-word for the FULL
// subject block, grade token and craft token. Any missing word is a FAIL.
//
// Exit codes: 0 = OK, 1 = verify FAIL, 2 = usage error.
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, basename } from "node:path";

// ─── brand banner (deepak-skill · crafted by Deepak) ────────────────────────
const BRAND_LINE = "═".repeat(56);
const banner = (label) =>
  `\n${BRAND_LINE}\n  🎬 deepak-skill — crafted by Deepak\n  skill: photoshoot-studio · ${label}\n${BRAND_LINE}\n`;
console.log(banner("shot-prompts.mjs"));

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
  console.error("Usage: node shot-prompts.mjs --plan shoot-plan.json [--out prompts.md]");
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
const DEFAULT_ASPECT = plan.aspect || "4:5";

// --- mandatory fields (the quality rails — never silently drop them) --------
const required = ["subject", "grade", "craft"];
const missingFields = required.filter((f) => !plan[f] || typeof plan[f] !== "string" || !plan[f].trim());
if (missingFields.length) {
  console.error(`❌ shoot-plan.json is missing required field(s): ${missingFields.join(", ")}`);
  console.error("   Every plan needs the verbatim subject block + a grade token + a craft token (see templates/).");
  process.exit(2);
}

// Tool notes per platform (kept in the pack header so the user never has to
// remember them — upload ingredients, or add --cref, or set the reference).
const TOOL_NOTES = {
  flow: "Flow / Nano Banana Pro: upload the reference images to the Ingredients panel once, then paste each prompt and set its aspect ratio.",
  midjourney: "Midjourney: add --cref <reference-url> (use --cw 0 for face-only when shots change outfits — the default here — or --cw 100 when the outfit must stay locked) and set --ar <aspect>.",
  flux: "Flux: set the reference image in the UI and the aspect ratio in the settings panel — write prompts in natural language, no flags.",
};

// --- token presence check (word-level) ---------------------------------------
function missingWords(promptText, token) {
  if (!token) return [];
  const words = new Set(token.toLowerCase().match(/[a-z0-9'’]+/g) || []);
  const promptWords = new Set(promptText.toLowerCase().match(/[a-z0-9'’]+/g) || []);
  return [...words].filter((w) => !promptWords.has(w));
}

// --- build one prompt per shot ----------------------------------------------
function buildPrompt(shot) {
  const parts = [];
  // 1. Photographic style — the genre/mood of the shot (specific, never vague)
  parts.push(shot.style || (plan.kind === "product" ? "Commercial product photography" : "Editorial fashion photography"));
  // 2. Subject — the VERBATIM subject block (person or product)
  parts.push(plan.subject);
  // 3. Pose / placement — how the subject is posed or the product positioned
  parts.push(shot.pose || shot.placement || "");
  // 4. Setting — background + environment + props (skip literal "none")
  const props = shot.props && !/^(none|n\/a|-)$/i.test(shot.props) ? shot.props : "";
  parts.push([shot.setting, props].filter(Boolean).join(", "));
  // 5. Craft — camera body + lens + aperture + lighting (the craft token)
  parts.push(shot.lighting ? `Lighting: ${shot.lighting}. ${plan.craft}` : plan.craft);
  // 6. Grade — the locked grade token (film stock + palette + grain)
  parts.push(plan.grade);
  // Aspect — written into the prompt for tools that accept it in-prompt
  const aspect = shot.aspect || DEFAULT_ASPECT;
  parts.push(`Aspect ratio: ${aspect}`);
  // Join with ". " but strip only TRAILING periods per part — never collapse
  // mid-text dots, so ellipses and decimals survive intact.
  const prompt = parts
    .map((p) => p.trim().replace(/\.+$/, ""))
    .filter(Boolean)
    .join(". ") + ".";
  return { prompt, aspect };
}

// --- assemble -----------------------------------------------------------------
const shots = plan.shots || [];
const lines = [];
lines.push(`# Photoshoot Prompt Pack — "${plan.title}"`);
lines.push("");
lines.push(`**Subject kind:** ${plan.kind === "product" ? "🛍️ product" : "🧍 person"} · **Shots:** ${shots.length} · **Default aspect:** ${DEFAULT_ASPECT}`);
lines.push("");
lines.push("## Before you start (do ONCE)");
lines.push("1. **Generate + upload the reference images** (reuse for every shot):");
(plan.references || []).forEach((img, i) => lines.push(`   - ${img}${i === 0 ? "  ← primary subject anchor" : ""}`));
lines.push("2. **Never edit the subject block** — it is identical in every prompt below. Rewording breaks consistency.");
lines.push(`3. **Grade locked:** ${plan.grade}`);
lines.push(`4. **Craft locked:** ${plan.craft}`);
lines.push("5. **Tool notes:** " + (TOOL_NOTES[plan.platform] || TOOL_NOTES.flow));
lines.push("6. For shots with an `Edit:` prompt: select the region (Flow Select/Lasso, Midjourney Editor) and paste ONLY the Edit text — it changes only that region.");
lines.push("");
lines.push("---");
lines.push("");

let fail = 0;
shots.forEach((s, i) => {
  const { prompt, aspect } = buildPrompt(s);
  // Self-verify: full subject block + grade + craft present word-by-word
  const check = {
    subject: missingWords(prompt, plan.subject),
    grade: missingWords(prompt, plan.grade),
    craft: missingWords(prompt, plan.craft),
  };
  const ok = !check.subject.length && !check.grade.length && !check.craft.length;
  if (!ok) fail += 1;

  lines.push(`### Shot ${i + 1} — ${s.id}`);
  lines.push(`**Type:** ${s.type || "generation"} · **Aspect:** ${aspect} · **verify:** ${ok ? "✅" : "❌"}`);
  lines.push("");
  lines.push("```");
  lines.push(prompt);
  lines.push("```");
  if (check.subject.length) lines.push(`⚠ missing from subject block: ${check.subject.join(", ")}`);
  if (check.grade.length) lines.push(`⚠ missing from grade: ${check.grade.join(", ")}`);
  if (check.craft.length) lines.push(`⚠ missing from craft: ${check.craft.join(", ")}`);
  if (s.edit) {
    lines.push("");
    lines.push(`**Edit:** ${s.edit}`);
    lines.push(`> Select the region you want to change, then paste: "Edit: ${s.edit}" — nothing else.`);
  }
  lines.push("");
  lines.push("---");
  lines.push("");
});

lines.push("## Generation order");
shots.forEach((s, i) => lines.push(`${i + 1}. Shot ${i + 1} — ${s.id} (${s.aspect || DEFAULT_ASPECT})`));
lines.push("");
lines.push("Post: pick the winners, upscale, and export at the platform's required resolution.");

writeFileSync(outPath, lines.join("\n"), "utf8");

const total = shots.length;
console.log(`✅ ${total} image prompts → ${basename(outPath)} (${total - fail}/${total} consistency-verified)`);
if (fail) {
  console.error(`❌ ${fail} prompt(s) FAILED consistency verification — fix the plan fields (subject/grade/craft) and regenerate.`);
  process.exit(1);
}
console.log("Copy each prompt into Google Flow / Nano Banana, Midjourney or Flux — keep the same reference images and generate shot by shot.");
process.exit(0);
