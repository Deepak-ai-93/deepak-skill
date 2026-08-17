#!/usr/bin/env node
// thumbnail-studio — the variant + prompt builder half of the thumbs-auditor
// gate. Assembles a thumbnail pack from a validated plan (thumbnail-plan.json):
//   title + niche + idea + emotion, plus 3-5 variants, each with concept,
//   overlay (≤ 5 words), scene and style. Writes thumbnails.md with, per
//   variant, the concept, overlay, scene, a 1280×720 photoreal image-gen prompt
//   (Nano Banana / Midjourney / Flux compatible), and the no-cliché negative.
//   Self-verifies every constraint and exits 1 on any FAIL (writes nothing).
//
// Usage:
//   node thumbnail-prompts.mjs --plan thumbnail-plan.json --out thumbnails.md
//
// Exit codes: 0 = clean, 1 = FAIL (bad plan), 2 = usage error.
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

// ─── brand banner (deepak-skill · crafted by Deepak) ────────────────────────
const BRAND_LINE = "═".repeat(56);
const banner = (label) =>
  `\n${BRAND_LINE}\n  🎬 deepak-skill — crafted by Deepak\n  skill: thumbnail-studio · ${label}\n${BRAND_LINE}\n`;
console.log(banner("thumbnail-prompts.mjs"));

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
  console.error("Usage: node thumbnail-prompts.mjs --plan thumbnail-plan.json --out thumbnails.md");
  process.exit(2);
}
const outPath = resolve(process.cwd(), opt("out", "thumbnails.md"));

let plan;
try {
  plan = JSON.parse(readFileSync(resolve(process.cwd(), planArg), "utf8"));
} catch (e) {
  console.error(`❌ Cannot read plan "${planArg}": ${e.message}`);
  process.exit(2);
}

// --- the cliché blocklist ----------------------------------------------------
const CLICHES = [
  "red arrow", "red circle", "shocked hands", "hands on cheeks", "you won't believe",
  "gone wrong", "gone wrong", "mind blown", "shocked face", "crying", "reaction face",
  "clip art", "clipart", "explosion graphic", "$ raining", "money raining", "rocket ship",
  "click here", "watch this", "must watch", "insane", "omg", "crazy trick",
];

const fails = [];
const warn = (msg) => console.log(`  ⚠️  ${msg}`);

// --- validate the plan ------------------------------------------------------
if (!plan.title || !plan.niche || !plan.idea || !plan.emotion) {
  fails.push("plan must have title, niche, idea and emotion");
} else {
  if (plan.title.length > 100) warn(`title is ${plan.title.length} chars — keep it snappy`);
  warn(`idea: "${plan.idea}" · emotion: "${plan.emotion}"`);
}

const variants = Array.isArray(plan.variants) ? plan.variants : [];
if (variants.length < 3) fails.push(`need ≥ 3 variants, got ${variants.length}`);
if (variants.length > 5) warn(`${variants.length} variants — cap at 5; test the strongest 2`);

for (const v of variants) {
  if (!v.concept) fails.push("every variant needs a concept (the ONE idea in a sentence)");
  if (!v.overlay || v.overlay.split(/\s+/).filter(Boolean).length > 5) {
    fails.push(`variant "${v.concept || v.overlay || "?"}" overlay must be ≤ 5 words: "${v.overlay || ""}"`);
  }
  if (!v.scene) fails.push("every variant needs a scene (the exact visual moment)");
  if (!v.style) fails.push("every variant needs a style (photoreal / illustration / bold-graphic)");
  const lower = `${v.concept || ""} ${v.overlay || ""} ${v.scene || ""}`.toLowerCase();
  const hit = CLICHES.find((c) => lower.includes(c));
  if (hit) fails.push(`variant "${v.overlay || v.concept}" hits the cliché blocklist: "${hit}"`);
}

if (fails.length) {
  console.error(`❌ ${fails.length} plan FAIL(s):`);
  for (const f of fails) console.error(`   • ${f}`);
  console.error("   Fix thumbnail-plan.json and re-run — nothing was written.");
  process.exit(1);
}

// --- build the pack ----------------------------------------------------------
const L = [];
L.push("# Thumbnail Variants — CTR-engineered", "");
L.push(`**Video title:** ${plan.title}`);
L.push(`**Niche:** ${plan.niche} · **The ONE idea:** ${plan.idea} · **Emotion:** ${plan.emotion}`);
L.push("");
L.push("Every variant sells the SAME one idea — the execution varies, the promise never does. Overlays ≤ 5 words, one font, high-contrast band. Generate at **1280×720** (YouTube), then verify the overlay text on the image.", "");

const STYLE_GRADE = {
  photoreal: "photorealistic, real-life, cinematic lighting, shallow depth of field, shot on 35mm, natural skin texture",
  illustration: "bold flat illustration, thick outlines, limited palette, editorial poster energy",
  "bold-graphic": "bold graphic design, high contrast, minimal, strong negative space, swiss poster style",
};

variants.forEach((v, i) => {
  const grade = STYLE_GRADE[v.style] || STYLE_GRADE.photoreal;
  L.push(`### Variant ${i + 1} — ${v.concept}`, "");
  L.push(`| | |`);
  L.push(`|---|---|`);
  L.push(`| **Overlay (≤ 5 words)** | "${v.overlay}" |`);
  L.push(`| **Scene** | ${v.scene} |`);
  L.push(`| **Style** | ${v.style} — ${grade} |`);
  L.push(`| **Test?** | ${v.test ? "**A/B candidate**" : "secondary"} |`);
  L.push("");
  L.push("**Image prompt (1280×720, PNG):**", "```");
  L.push(`YouTube thumbnail, ${v.style === "photoreal" ? "photorealistic" : v.style} — ${v.scene} — the emotion on display is ${plan.emotion}. The idea: ${plan.idea}.`);
  L.push(`Composition: subject off-center (rule of thirds), high contrast between subject and background, one accent color, readable at small size.`);
  L.push(`Overlay text EXACTLY: "${v.overlay}" — large heavy font, high-contrast band/scrim behind it, no more than 5 words.`);
  L.push(`Grade: ${grade}. Negative: no clichés — ${CLICHES.slice(0, 6).join(", ")} — no extra words on the image, no watermark, no logo.`);
  L.push("```", "");
  L.push("**Verify after generation:** overlay text exactly matches (regenerate if garbled) · readable at 120×68px · matches the video title's promise.", "");
});

L.push("---", "Next: decide the A/B pair in `ab-test.md` (the two most different executions), then run `audit-thumbs.mjs` → thumbs-auditor subagent before shipping.");

writeFileSync(outPath, L.join("\n"), "utf8");
console.log(`✅ thumbnails.md → ${outPath} (${variants.length} variants, self-verified)`);
console.log("Next: write ab-test.md (see templates/ctr-benchmarks.md) then run audit-thumbs.mjs → thumbs-auditor subagent.");
process.exit(0);
