#!/usr/bin/env node
// The paid-ads-studio prompt-pack builder — turns an ads-plan.json into a
// copy-paste ad creative pack for AI tools: Veo 3.1 / Google Flow VIDEO ad
// prompts (per placement: 9:16 Reels, 16:9 in-stream, 6s bumpers) AND image
// ad prompts (Nano Banana Pro / Midjourney / Flux at 1:1, 4:5, 1.91:1).
// Brand/product consistency is locked: reference-image ingredients + the
// VERBATIM product block + grade token (+ craft token on images) in EVERY
// prompt, self-verified word-by-word.
//
// Usage:
//   node ad-prompts.mjs --plan ads-plan.json [--out prompts.md]
//
// ads-plan.json contract:
// {
//   "title": "Brew & Co Tumbler — Paid Launch",
//   "brand": "Brand: Brew & Co — a matte-black 500ml vacuum-insulated ... (VERBATIM block)",
//   "grade": "Grade: high-key commercial, crisp whites, soft gradients, ... (FULL token)",
//   "craft": "Craft: shot on Hasselblad X2D medium format, 85mm f/2.8, ... (FULL token — images)",
//   "references": ["tumbler-hero.png", "tumbler-lifestyle.png"],
//   "videos": [
//     { "id": "reels-hook", "placement": "9:16 Reels/Shorts", "duration": 8,
//       "camera": "...", "action": "...", "setting": "...", "lighting": "...",
//       "audio": "Dialogue: ... SFX: ...", "style": "commercial lifestyle" }
//   ],
//   "images": [
//     { "id": "hero-square", "format": "1:1", "tool": "nanobanana|midjourney|flux",
//       "style": "commercial product photography", "scene": "...", "props": "...",
//       "lighting": "...", "edit": "swap the background for ..." }
//   ]
// }
//
// Self-verify: every prompt is checked word-by-word for the FULL brand block
// and grade token (videos) plus craft token (images). Missing words = FAIL.
//
// Exit codes: 0 = OK, 1 = verify FAIL, 2 = usage error / missing required fields.
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, basename } from "node:path";

// ─── brand banner (deepak-skill · crafted by Deepak) ────────────────────────
const BRAND_LINE = "═".repeat(56);
const banner = (label) =>
  `\n${BRAND_LINE}\n  🎬 deepak-skill — crafted by Deepak\n  skill: paid-ads-studio · ${label}\n${BRAND_LINE}\n`;
console.log(banner("ad-prompts.mjs"));

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
  console.error("Usage: node ad-prompts.mjs --plan ads-plan.json [--out prompts.md]");
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

// --- mandatory fields (the quality rails — never silently drop them) --------
const required = ["brand", "grade"];
const missingFields = required.filter((f) => !plan[f] || typeof plan[f] !== "string" || !plan[f].trim());
if (missingFields.length) {
  console.error(`❌ ads-plan.json is missing required field(s): ${missingFields.join(", ")}`);
  console.error("   Every plan needs the verbatim product/brand block + a grade token (see templates/product-block.md).");
  process.exit(2);
}
if (!Array.isArray(plan.videos) && !Array.isArray(plan.images)) {
  console.error("❌ ads-plan.json needs at least one of: videos[] (Veo) or images[] (image ads).");
  process.exit(2);
}
if (Array.isArray(plan.images) && plan.images.length && !(plan.craft && plan.craft.trim())) {
  console.error("❌ ads-plan.json has images but is missing the craft token (photography language — see templates/product-block.md).");
  process.exit(2);
}

// Tool notes per image platform (kept in the pack header).
const TOOL_NOTES = {
  nanobanana: "Nano Banana Pro (Google Flow / Ads Asset Studio): upload the reference images to the Ingredients panel once, paste each prompt, set the aspect ratio, and use the conversational Edit to regenerate variants.",
  midjourney: "Midjourney: add --cref <reference-url> (--cw 100 keeps the product locked) and --ar <aspect> (1:1, 4:5, 3:4 for 1.91:1 use --ar 16:9).",
  flux: "Flux: set the reference image in the UI, set the aspect ratio in the settings panel, and paste the prompt as-is.",
};

// ─── token presence check (word-level) ──────────────────────────────────────
function missingWords(promptText, token) {
  if (!token) return [];
  const words = new Set(token.toLowerCase().match(/[a-z0-9'’]+/g) || []);
  const promptWords = new Set(promptText.toLowerCase().match(/[a-z0-9'’]+/g) || []);
  return [...words].filter((w) => !promptWords.has(w));
}

// --- build one Veo video-ad prompt (7-layer template) -----------------------
function buildVideoPrompt(v) {
  const parts = [];
  // 1. Camera / lens — framing + motion + optics (specific, never vague)
  parts.push(v.camera || "Locked-off medium close-up, slow push-in");
  // 2. Subject — the VERBATIM brand/product block
  parts.push(plan.brand);
  // 3. Action & physics — what happens, plain motion
  parts.push(v.action || "");
  // 4. Setting — location + time
  parts.push(v.setting || "");
  // 5. Lighting — direction + quality
  parts.push(v.lighting ? `Lighting: ${v.lighting}` : "");
  // 6. Style & texture — the locked grade token
  parts.push(plan.grade);
  if (v.style) parts.push(`Style: ${v.style}`);
  // 7. Audio — native dialogue in quotes + SFX labeled
  if (v.audio) parts.push(v.audio);
  const prompt = parts
    .map((p) => p.trim().replace(/\.+$/, ""))
    .filter(Boolean)
    .join(". ") + ".";
  return prompt;
}

// --- build one image-ad prompt ----------------------------------------------
function buildImagePrompt(img) {
  const parts = [];
  // 1. Photographic style
  parts.push(img.style || "Commercial product photography");
  // 2. Subject — the VERBATIM brand/product block
  parts.push(plan.brand);
  // 3. Scene / composition
  parts.push(img.scene || "");
  // 4. Props (skip literal "none"; capitalize so it reads as its own sentence)
  const props = img.props && !/^(none|n\/a|-)$/i.test(img.props) ? img.props.trim().replace(/^\.+/, "") : "";
  parts.push(props ? props.charAt(0).toUpperCase() + props.slice(1) : "");
  // 5. Craft — camera body + lens + aperture (the craft token)
  parts.push(img.lighting ? `Lighting: ${img.lighting}. ${plan.craft}` : plan.craft);
  // 6. Grade — the locked grade token
  parts.push(plan.grade);
  // 7. Aspect
  const aspect = img.format || "1:1";
  parts.push(`Aspect ratio: ${aspect}`);
  const prompt = parts
    .map((p) => p.trim().replace(/\.+$/, ""))
    .filter(Boolean)
    .join(". ") + ".";
  return { prompt, aspect };
}

// --- assemble -----------------------------------------------------------------
const videos = plan.videos || [];
const images = plan.images || [];
const lines = [];
lines.push(`# Ad Creative Prompt Pack — "${plan.title}"`);
lines.push("");
lines.push(`**Formats:** ${videos.length} video ad(s) (Veo 3.1 / Flow) · ${images.length} image ad(s)${images.length ? ` · **Default aspect:** ${images[0].format || "1:1"}` : ""}`);
lines.push("");
lines.push("## Before you start (do ONCE)");
lines.push("1. **Generate + upload the reference images** (reuse for every prompt — they anchor the product's shape, colors and label):");
(plan.references || []).forEach((img, i) => lines.push(`   - ${img}${i === 0 ? "  ← primary product anchor" : ""}`));
lines.push("2. **Never edit the brand block** — it is identical in every prompt below. Rewording breaks consistency.");
lines.push(`3. **Grade locked:** ${plan.grade}`);
if (plan.craft) lines.push(`4. **Craft locked:** ${plan.craft}`);
lines.push(`5. **Video tool note:** Google Flow / Veo 3.1 — upload the Ingredients once, paste each video prompt, generate at the placement's aspect (9:16 or 16:9), 8s clips (Extend for longer). Apply logos/fine print in post.`);
if (images.length) {
  lines.push(`6. **Image tool note:** ${TOOL_NOTES[images[0]?.tool] || TOOL_NOTES.nanobanana}`);
} else {
  lines.push(`6. **No image ads in this pack** — if you add images later, run with an image tool note for Nano Banana Pro / Midjourney / Flux.`);
}
lines.push("");
lines.push("---");
lines.push("");

let fail = 0;
let count = 0;

for (const v of videos) {
  count += 1;
  const prompt = buildVideoPrompt(v);
  // Self-verify: full brand block + grade present word-by-word
  const check = {
    brand: missingWords(prompt, plan.brand),
    grade: missingWords(prompt, plan.grade),
  };
  const ok = !check.brand.length && !check.grade.length;
  if (!ok) fail += 1;

  lines.push(`### Video Ad ${count} — ${v.id}`);
  lines.push(`**Placement:** ${v.placement || "9:16 Reels/Shorts"} · **Duration:** ${v.duration || 8}s · **verify:** ${ok ? "✅" : "❌"}`);
  lines.push("");
  lines.push("```");
  lines.push(prompt);
  lines.push("```");
  if (check.brand.length) lines.push(`⚠ missing from brand block: ${check.brand.join(", ")}`);
  if (check.grade.length) lines.push(`⚠ missing from grade: ${check.grade.join(", ")}`);
  lines.push("");
  lines.push("---");
  lines.push("");
}

for (const img of images) {
  count += 1;
  const { prompt, aspect } = buildImagePrompt(img);
  // Self-verify: full brand block + grade + craft present word-by-word
  const check = {
    brand: missingWords(prompt, plan.brand),
    grade: missingWords(prompt, plan.grade),
    craft: missingWords(prompt, plan.craft),
  };
  const ok = !check.brand.length && !check.grade.length && !check.craft.length;
  if (!ok) fail += 1;

  lines.push(`### Image Ad ${count} — ${img.id}`);
  lines.push(`**Format:** ${aspect} · **Tool:** ${img.tool || "nanobanana"} · **verify:** ${ok ? "✅" : "❌"}`);
  lines.push("");
  lines.push("```");
  lines.push(prompt);
  lines.push("```");
  if (check.brand.length) lines.push(`⚠ missing from brand block: ${check.brand.join(", ")}`);
  if (check.grade.length) lines.push(`⚠ missing from grade: ${check.grade.join(", ")}`);
  if (check.craft.length) lines.push(`⚠ missing from craft: ${check.craft.join(", ")}`);
  if (img.edit) {
    lines.push("");
    lines.push(`**Edit:** ${img.edit}`);
    lines.push(`> Select the region you want to change, then paste: "Edit: ${img.edit}" — nothing else.`);
  }
  lines.push("");
  lines.push("---");
  lines.push("");
}

lines.push("## Generation order");
let n = 0;
for (const v of videos) lines.push(`${++n}. Video — ${v.id} (${v.placement || "9:16"})`);
for (const img of images) lines.push(`${++n}. Image — ${img.id} (${img.format || "1:1"})`);
lines.push("");
lines.push("Post: export at the platform's specs (image ≤5 MB; video 1080p H.264/AAC), add logos/fine print in a real editor, keep on-image text ≤3 words.");

writeFileSync(outPath, lines.join("\n"), "utf8");

const total = count;
console.log(`✅ ${total} ad prompts → ${basename(outPath)} (${total - fail}/${total} consistency-verified)`);
if (fail) {
  console.error(`❌ ${fail} prompt(s) FAILED consistency verification — fix the plan fields (brand/grade/craft) and regenerate.`);
  process.exit(1);
}
console.log("Copy each prompt into Flow / Nano Banana Pro / Midjourney / Flux — keep the same reference images and generate one by one.");
process.exit(0);
