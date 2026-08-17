#!/usr/bin/env node
// thumbnail-studio — the automated audit half of the thumbs-auditor gate.
// Scans a thumbnail pack (thumbnail-teardown.md + thumbnails.md + ab-test.md)
// and checks everything a script can: teardown present (niche + patterns + the
// ONE idea), ≥ 3 variants, overlay ≤ 5 words each, idea + emotion present,
// 1280×720 canvas, anti-cliché blocklist, ab-test.md (test pair + window +
// benchmark). Writes thumbs-audit.md with automated verdicts + an AUDITOR
// section. Exit 1 on any FAIL.
//
// Usage:
//   node audit-thumbs.mjs --pack <thumbnail-folder> [--out thumbs-audit.md]
//
// Exit codes: 0 = clean, 1 = FAIL, 2 = usage error.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, basename, join } from "node:path";

// ─── brand banner (deepak-skill · crafted by Deepak) ────────────────────────
const BRAND_LINE = "═".repeat(56);
const banner = (label) =>
  `\n${BRAND_LINE}\n  🎬 deepak-skill — crafted by Deepak\n  skill: thumbnail-studio · ${label}\n${BRAND_LINE}\n`;
console.log(banner("audit-thumbs.mjs"));

// --- tiny arg parser (same style as the other skill scripts) ----------------
const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const needle = `--${name}`;
  const found = args.find((a) => a === needle || a.startsWith(`${needle}=`));
  if (found === undefined) return fallback;
  const eq = found.indexOf("=");
  return eq !== -1 ? found.slice(eq + 1) : args[args.indexOf(found) + 1];
};

const CLICHES = [
  "red arrow", "red circle", "shocked hands", "hands on cheeks", "you won't believe",
  "gone wrong", "mind blown", "shocked face", "clip art", "explosion graphic",
  "money raining", "rocket ship", "click here", "watch this", "must watch",
];

const packArg = opt("pack");
if (!packArg) {
  console.error("Usage: node audit-thumbs.mjs --pack <thumbnail-folder> [--out thumbs-audit.md]");
  process.exit(2);
}
const packDir = resolve(process.cwd(), packArg);
const outPath = resolve(process.cwd(), opt("out", "thumbs-audit.md"));
if (!existsSync(packDir)) {
  console.error(`❌ Thumbnail folder not found: ${packDir}`);
  console.error("   Pass the pack folder (thumbnail-teardown.md + thumbnails.md + ab-test.md)");
  process.exit(2);
}

const results = [];
const add = (status, check, detail) => results.push({ status, check, detail });

const read = (f) => (existsSync(join(packDir, f)) ? readFileSync(join(packDir, f), "utf8") : null);

// --- teardown ----------------------------------------------------------------
const teardown = read("thumbnail-teardown.md");
if (teardown) {
  if (/niche|pattern|idea/i.test(teardown)) add("PASS", "teardown present", "thumbnail-teardown.md with niche/pattern/idea content");
  else add("WARN", "teardown present", "thumbnail-teardown.md exists but is thin — needs niche patterns + the ONE idea");
} else {
  add("FAIL", "teardown present", "missing thumbnail-teardown.md — the CTR teardown comes first");
}

// --- variants -----------------------------------------------------------------
const pack = read("thumbnails.md");
if (pack) {
  const variants = (pack.match(/^### Variant \d+ /gm) || []).length;
  if (variants >= 3) add("PASS", "variant count", `${variants} variants — ≥ 3`);
  else add("FAIL", "variant count", `only ${variants} — need ≥ 3`);

  // overlay ≤ 5 words
  const overlays = [...pack.matchAll(/\*\*Overlay \(≤ 5 words\)\*\* \| "([^"]+)"/g)].map((m) => m[1]);
  const long = overlays.filter((o) => o.split(/\s+/).filter(Boolean).length > 5);
  if (!long.length) add("PASS", "overlay limit", `${overlays.length} overlay(s), all ≤ 5 words`);
  else add("FAIL", "overlay limit", `${long.length} overlay(s) over 5 words: ${long.join(" | ")}`);

  // idea + emotion present
  if (/The ONE idea/.test(pack) && /Emotion/.test(pack)) add("PASS", "idea + emotion", "the ONE idea and emotion are locked in the header");
  else add("FAIL", "idea + emotion", "missing the ONE idea or emotion in the header");

  // 1280×720 canvas
  if (/1280×720/.test(pack)) add("PASS", "canvas", "1280×720 (YouTube) present in every prompt header");
  else add("WARN", "canvas", "no 1280×720 mention — prompts should carry the canvas");

  // anti-cliché blocklist (skip the Negative: prompt lines, which list what NOT to do)
  const packMinusNegatives = pack
    .split(/\n/)
    .filter((l) => !/Negative: no clichés/i.test(l))
    .join("\n");
  const hit = CLICHES.filter((c) => packMinusNegatives.toLowerCase().includes(c.toLowerCase()));
  if (!hit.length) add("PASS", "anti-cliché", "no cliché words in the pack (outside Negative: prompt lines)");
  else add("FAIL", "anti-cliché", hit.join(", "));
} else {
  add("FAIL", "thumbnails.md", "missing thumbnails.md — run thumbnail-prompts.mjs first");
}

// --- A/B plan ------------------------------------------------------------------
const ab = read("ab-test.md");
if (ab) {
  if (/variant|A\/B|test|window|benchmark|CTR/i.test(ab)) add("PASS", "ab-test.md", "test pair + window + benchmark present");
  else add("WARN", "ab-test.md", "ab-test.md exists but needs the test pair, window and CTR benchmark");
} else {
  add("FAIL", "ab-test.md", "missing ab-test.md — which 2 variants, for how long, benchmarked against what");
}

// ─── write thumbs-audit.md ──────────────────────────────────────────────────
const fails = results.filter((r) => r.status === "FAIL");
const warns = results.filter((r) => r.status === "WARN");
const passes = results.filter((r) => r.status === "PASS");

const L = [];
L.push(`# Thumbnail Audit — ${basename(packDir)}`);
L.push("");
L.push(`**Automated checks (${new Date().toISOString().slice(0, 10)}):** ${passes.length} PASS · ${warns.length} WARN · ${fails.length} FAIL · **automated verdict:** ${fails.length ? "FIX NEEDED" : "PASS (pending auditor)"}`);
L.push("");
L.push("## 1. Automated results");
L.push("");
L.push("| Status | Check | Detail |");
L.push("|---|---|---|");
for (const r of results) L.push(`| ${r.status} | ${r.check} | ${r.detail} |`);
L.push("");
L.push("## 2. Auditor section — COMPLETE THIS (subagent, fresh eyes)");
L.push("");
L.push("### 2.1 Thumbnail-worthiness scorecard (rate 1–5 each, /50 — a thumbnail worth shipping scores ≥ 35)");
L.push("");
L.push("| Criterion | Ask | Score /5 |");
L.push("|---|---|---|");
L.push("| **Title match** | Does the thumbnail promise exactly what the video title promises (no clickbait mismatch)? | |");
L.push("| **Stop-the-scroll** | Would it stop a scroller at 120×68px in the feed (contrast, emotion, composition)? | |");
L.push("| **ONE idea** | Does each variant sell exactly one idea (curiosity/result/threat), not a mash-up? | |");
L.push("| **Overlay craft** | Overlay ≤ 5 words, one font, high-contrast band, adds (not repeats) the visual? | |");
L.push("| **Emotion** | Is the emotion real and readable on the face/object — not a stock reaction? | |");
L.push("| **Anti-cliché** | No red arrows, shocked-hands, 'GONE WRONG' impact-font clichés? | |");
L.push("| **Variety** | Do the 3–5 variants vary execution (different crops, styles, emotions), not just words? | |");
L.push("| **Prompt quality** | Would the image prompts generate what's described (scene, emotion, overlay text)? | |");
L.push("| **A/B plan** | Two testable variants, a window, and a niche CTR benchmark to judge the result? | |");
L.push("| **Ship-readiness** | Would you upload one of these today? | |");
L.push("");
L.push("### 2.2 Creative judgment calls");
L.push("");
L.push("- Does any variant promise something the video can't pay off in the first 30 seconds?");
L.push("- Would the strongest variant stand out against the niche's saturated patterns (from the teardown)?");
L.push("- Is the overlay text guaranteed to render on the generated image (or will it need a Mode 1 text pass)?");
L.push("");
L.push("### 2.3 Verdict");
L.push("");
L.push("- All PASS and scorecard ≥ 35 → mark **PASS** and sign below.");
L.push("- Any FAIL (or a WARN you judge real) → mark **FIX NEEDED** and list per-variant fixes.");
L.push("");
L.push(`> Auditor verdict: **PENDING** · Auditor: _(subagent)_ · Date: ${new Date().toISOString().slice(0, 10)}`);
L.push("");

writeFileSync(outPath, L.join("\n"), "utf8");

console.log(`✅ thumbs-audit.md → ${basename(outPath)} (${passes.length} PASS · ${warns.length} WARN · ${fails.length} FAIL)`);
for (const r of results.filter((r) => r.status !== "PASS")) {
  console.log(`   ${r.status === "FAIL" ? "❌" : "⚠️"} ${r.check}: ${r.detail}`);
}
if (fails.length) {
  console.error(`❌ ${fails.length} automated FAIL(s) — fix and re-run before spawning the thumbs-auditor.`);
  process.exit(1);
}
console.log("Automated checks clean — now spawn the thumbs-auditor subagent (see SKILL.md Stage 6 / templates/thumbs-auditor-brief.md) to complete the scorecard + verdict in thumbs-audit.md.");
process.exit(0);
