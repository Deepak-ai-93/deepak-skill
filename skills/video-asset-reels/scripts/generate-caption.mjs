#!/usr/bin/env node
// Generate caption.md (multi-platform caption pack) from storyboard beats.
// Every platform section is auto-checked against the 500–900 char window
// (skill contract: no hashtags, hook-first, E-E-A-T tone, one CTA).
//
// Usage:
//   node render/generate-caption.mjs \
//     --name word-pop_money-rules_4k \
//     --topic "money rules" --format word-pop \
//     --hook "Stop losing money on habits you don't even notice." \
//     --beats "Pay yourself first.|Track every rupee.|Wait 24 hours before buying.|Automate your savings." \
//     --value "I tested this for 90 days.|Three rules. Nothing else." \
//     --cta "Save this. Apply it this week." \
//     --voice af_heart --duration 15 --out output
//
// Writes: output/{name}/caption.md  (+ prints a character-count table)
import { writeFileSync, mkdirSync } from "node:fs";
import { resolve, join } from "node:path";

// --- tiny arg parser -------------------------------------------------------
const args = process.argv.slice(2);
const opt = (n, f) => {
  const i = args.indexOf(`--${n}`);
  if (i === -1) return f;
  const inline = args[i].split("=")[1];
  return inline !== undefined ? inline : args[i + 1];
};

const name = opt("name");
if (!name) {
  console.error("Usage: node render/generate-caption.mjs --name <base> [--topic t] [--format f] [--hook h] [--beats 'a|b|c'] [--value 'x|y'] [--cta c] [--voice v] [--duration s] [--out dir]");
  process.exit(1);
}

const topic = opt("topic", "this reel");
const format = opt("format", "reel");
const hook = opt("hook", "");
const beats = (opt("beats", "") || "").split("|").map((s) => s.trim()).filter(Boolean);
const valueLines = (opt("value", "") || "").split("|").map((s) => s.trim()).filter(Boolean);
const cta = opt("cta", "Save this. Share it with someone who needs it.");
const voice = opt("voice", "kokoro");
const duration = opt("duration", "15");
const OUT_DIR = resolve(process.cwd(), opt("out", "output"), name);

const MIN = 500, MAX = 900, AIM = 700;
const count = (s) => [...s].length;
const status = (s) => (count(s) < MIN ? "TOO SHORT" : count(s) > MAX ? "TOO LONG" : "OK ✓");

// --- copy assembly ---------------------------------------------------------
function body(tone = "") {
  const parts = [];
  if (hook) parts.push(hook);
  if (beats.length) parts.push(beats.map((b) => b.replace(/[.\s]+$/, "") + ".").join(" "));
  if (valueLines.length) parts.push(valueLines.join(" "));
  parts.push(cta);
  let b = parts.join("\n\n");
  if (tone) b += "\n\n" + tone;
  return b;
}

const youtubeTitle = (() => {
  const t = hook || beats[0] || topic;
  return t.length > 100 ? t.slice(0, 97).trimEnd() + "..." : t;
})();

const sections = [
  ["YouTube Shorts — Description", body(), 0],
  ["Instagram", body("P.S. Save this for your next scroll."), 0],
  ["X / Twitter", body(), 0],
  ["Threads", body("Thoughts?"), 0],
  ["LinkedIn", body("Applies to work and money — and honestly, to most of life."), 0],
  ["TikTok", body(), 0],
  ["Facebook", body(), 0],
].map(([label, text]) => [label, text, count(text)]);

// --- character-count validation -------------------------------------------
console.log("Character window: 500–900 (aim ~700) · title ≤100 (platform hard cap)\n");
console.log("Section".padEnd(34), "chars", "status");
let allOk = true;
for (const [label, , len] of sections) {
  const st = status(textOf(sections, label));
  if (st !== "OK ✓") allOk = false;
  console.log(label.padEnd(34), String(len).padStart(5), st);
}
function textOf(arr, label) { return arr.find(([l]) => l === label)[1]; }

// --- write caption.md ------------------------------------------------------
mkdirSync(OUT_DIR, { recursive: true });
const md = `# Caption Pack — ${topic} (${format})

Video: output/${name}/${name}.mp4
Voiceover: Kokoro (${voice}) • Duration: ${duration}s • 4K vertical • No hashtags

## YouTube Shorts
### Title (${count(youtubeTitle)}/100 chars)
${youtubeTitle}
### Description (${sections[0][2]}/500–900 chars)
${sections[0][1]}

## Instagram (${sections[1][2]}/500–900 chars)
${sections[1][1]}

## X / Twitter (${sections[2][2]}/500–900 chars — hook + CTA must fit in the first 280)
${sections[2][1]}

## Threads (${sections[3][2]}/500–900 chars)
${sections[3][1]}

## LinkedIn (${sections[4][2]}/500–900 chars)
${sections[4][1]}

## TikTok (${sections[5][2]}/500–900 chars)
${sections[5][1]}

## Facebook (${sections[6][2]}/500–900 chars)
${sections[6][1]}
`;

writeFileSync(join(OUT_DIR, "caption.md"), md, "utf8");
console.log(`\n✅ caption.md → ${join(OUT_DIR, "caption.md")}`);
if (!allOk) console.log("\n⚠️  Fix out-of-window sections before posting (under 500 → add a concrete example/stat; over 900 → cut filler, never the hook or CTA).");
