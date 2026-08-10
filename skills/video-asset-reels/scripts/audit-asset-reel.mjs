#!/usr/bin/env node
// The video-asset-reels audit harness — the automated half of the
// asset-reel-auditor gate. Scans a delivered asset-reel pack and checks what
// a script CAN check: storyboard.json (every beat has id/src/in
// (videos)/duration/start/text; hook in beat 1; CTA in the last beat; 3–6
// words per beat; 9:16 spec), the cut assets (assets/cuts/beat_N.mp4 exist),
// the HTML composition (assets at z-index 1, paused GSAP timeline on
// window.__timelines.reel, no SMIL/Math.random/audio elements), the rendered
// output folder (MP4 + frames + caption.md). Writes asset-reel-audit.md with
// the automated verdicts + an AUDITOR section for the subagent (visual sync,
// asset choice, motion polish). Exit 1 on any FAIL.
//
// Usage:
//   node audit-asset-reel.mjs --pack <reel-folder> [--out asset-reel-audit.md]
//
// The folder should contain: storyboard.json, assets/cuts/*, the .html
// composition, output/*. Subsets are allowed — missing files are FAIL but the
// audit continues.
//
// Exit codes: 0 = all automated checks PASS, 1 = any FAIL, 2 = usage error.
import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { resolve, basename, join } from "node:path";

// ─── brand banner (deepak-skill · crafted by Deepak) ────────────────────────
const BRAND_LINE = "═".repeat(56);
const banner = (label) =>
  `\n${BRAND_LINE}\n  🎬 deepak-skill — crafted by Deepak\n  skill: video-asset-reels · ${label}\n${BRAND_LINE}\n`;
console.log(banner("audit-asset-reel.mjs"));

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
  console.error("Usage: node audit-asset-reel.mjs --pack <reel-folder> [--out asset-reel-audit.md]");
  process.exit(2);
}
const packDir = resolve(process.cwd(), packArg);
const outPath = resolve(process.cwd(), opt("out", "asset-reel-audit.md"));
if (!existsSync(packDir)) {
  console.error(`❌ Reel folder not found: ${packDir}`);
  console.error("   Pass the folder that holds storyboard.json / assets/cuts/ / the .html / output/");
  process.exit(2);
}

const read = (f) => (existsSync(join(packDir, f)) ? readFileSync(join(packDir, f), "utf8") : null);

// ─── results collector ──────────────────────────────────────────────────────
const results = []; // { status: "PASS"|"FAIL"|"WARN", check, detail }
const add = (status, check, detail) => results.push({ status, check, detail });
let auditSections = [];

// ─── storyboard.json ────────────────────────────────────────────────────────
let sb = null;
let sbOk = false;
{
  const raw = read("storyboard.json");
  if (!raw) {
    add("FAIL", "storyboard.json exists", "missing — the beat manifest drives everything");
  } else {
    try {
      sb = JSON.parse(raw);
      sbOk = true;
    } catch (e) {
      add("FAIL", "storyboard.json parse", `invalid JSON: ${e.message}`);
    }
  }
}

let beatCount = 0;
if (sbOk) {
  const beats = sb.beats || [];
  beatCount = beats.length;
  if (beatCount) add("PASS", "storyboard beats", `${beatCount} beat(s) defined`);
  else add("FAIL", "storyboard beats", "no beats array");
  const missing = [];
  for (const b of beats) {
    if (!b.id) missing.push("a beat missing id");
    if (!b.src) missing.push(`${b.id || "?"} missing src`);
    if (b.duration === undefined) missing.push(`${b.id || "?"} missing duration`);
    if (b.start === undefined) missing.push(`${b.id || "?"} missing start`);
    if (!b.text) missing.push(`${b.id || "?"} missing text`);
    if (b.in === undefined && /\.(mp4|mov)$/i.test(b.src || "")) missing.push(`${b.id || "?"} video beat missing in-point`);
  }
  if (missing.length) add("FAIL", "storyboard beat fields", missing.slice(0, 5).join(" · "));
  else add("PASS", "storyboard beat fields", "every beat has id/src/in/duration/start/text");
  const first = beats[0];
  const last = beats[beats.length - 1];
  if (first && /hook|open|nobody|why|stop|wait/i.test(first.text)) add("PASS", "hook in beat 1", `beat 1: "${(first.text || "").slice(0, 40)}"`);
  else add("WARN", "hook in beat 1", "beat 1 text doesn't read like a hook");
  if (last && /CTA|follow|save|share|comment|part 2|like/i.test(last.text)) add("PASS", "CTA in last beat", `last beat: "${(last.text || "").slice(0, 40)}"`);
  else add("WARN", "CTA in last beat", "last beat has no CTA");
  const over6 = beats.filter((b) => b.text && b.text.split(/\s+/).length > 6);
  if (over6.length) add("WARN", "3–6 words per beat", `${over6.length} beat(s) over 6 words`);
  else if (beatCount) add("PASS", "3–6 words per beat", "all beats within 3–6 words");
  if (sb.width === 1080 && sb.height === 1920) add("PASS", "9:16 spec", "1080x1920 confirmed in the storyboard");
  else add("WARN", "9:16 spec", "width/height not 1080x1920 in the storyboard");
  // beat timing continuity
  let gap = 0;
  for (let i = 1; i < beats.length; i++) {
    if (Math.abs(beats[i].start - (beats[i - 1].start + beats[i - 1].duration)) > 0.01) gap += 1;
  }
  if (gap) add("WARN", "beat timing continuity", `${gap} gap(s)/overlap(s) between beat windows`);
  else if (beatCount > 1) add("PASS", "beat timing continuity", "beat windows are contiguous");
  auditSections.push(`reel length ≈ ${(beats.reduce((t, b) => t + (b.duration || 0), 0)).toFixed(1)}s across ${beatCount} beats`);
}

// ─── cut assets ─────────────────────────────────────────────────────────────
let cutCount = 0;
if (existsSync(join(packDir, "assets", "cuts"))) {
  try {
    cutCount = readdirSync(join(packDir, "assets", "cuts")).filter((f) => /\.(mp4|mov)$/i.test(f)).length;
  } catch {
    cutCount = 0;
  }
  if (cutCount) add("PASS", "cut assets", `${cutCount} pre-cut asset clip(s) in assets/cuts/`);
  else add("WARN", "cut assets", "assets/cuts/ exists but no clips — run cut-assets.mjs");
} else {
  add("WARN", "cut assets", "no assets/cuts/ folder — run cut-assets.mjs storyboard.json");
}

// ─── HTML composition ───────────────────────────────────────────────────────
let html = null;
{
  const direct = readdirSync(packDir).find((f) => /\.html$/i.test(f));
  if (direct) html = readFileSync(join(packDir, direct), "utf8");
  else if (existsSync(join(packDir, "output"))) {
    const inner = readdirSync(join(packDir, "output")).find((f) => /\.html$/i.test(f));
    if (inner) html = readFileSync(join(packDir, "output", inner), "utf8");
  }
}
if (!html) {
  add("FAIL", "HTML composition exists", "no .html found in the pack or output/");
} else {
  if (/window\.__timelines\s*=\s*window\.__timelines\s*\|\|\s*\{\}/.test(html) && /__timelines\.reel/.test(html)) add("PASS", "GSAP timeline", "timeline registered on window.__timelines.reel");
  else add("FAIL", "GSAP timeline", "no window.__timelines.reel registration");
  if (/Math\.random/.test(html)) add("FAIL", "determinism (no Math.random)", "Math.random() found");
  else add("PASS", "determinism (no Math.random)", "no Math.random()");
  if (/<animate|<animateTransform|<animateMotion/.test(html)) add("FAIL", "determinism (no SMIL)", "SMIL <animate> tags found");
  else add("PASS", "determinism (no SMIL)", "no SMIL");
  const audioEls = (html.match(/<audio[\s>]/g) || []).length;
  if (audioEls) add("FAIL", "no audio in HTML", `${audioEls} <audio> element(s) — clips must be muted, audio is muxed at render`);
  else add("PASS", "no audio in HTML", "no <audio> elements");
  const assetClips = (html.match(/class="[^"]*asset-clip[^"]*"/g) || []).length;
  if (assetClips) add("PASS", "asset layers", `${assetClips} asset-clip layer(s) present`);
  else add("WARN", "asset layers", "no .asset-clip layers found");
  if (/z-index:\s*1|z-index: 1/.test(html)) add("PASS", "layer order", "z-index layering present (assets 1 < text 3 < grain 10)");
  else add("WARN", "layer order", "no explicit z-index layering found");
}

// ─── rendered output + caption ──────────────────────────────────────────────
let mp4 = 0;
const outDir = join(packDir, "output");
if (existsSync(outDir)) {
  try {
    const entries = readdirSync(outDir);
    mp4 = entries.filter((f) => /\.mp4$/i.test(f)).length;
    const inner = entries.find((f) => !/\./.test(f));
    if (!mp4 && inner) mp4 = readdirSync(join(outDir, inner)).filter((f) => /\.mp4$/i.test(f)).length;
  } catch {
    mp4 = 0;
  }
  if (mp4) add("PASS", "MP4 output", `${mp4} MP4(s) rendered`);
  else add("FAIL", "MP4 output", "no MP4 in output/ — render with --scale 2");
  const captionText = read("caption.md") || (existsSync(outDir) && readdirSync(outDir).some((f) => /^caption\.md$/i.test(f)) ? readFileSync(join(outDir, "caption.md"), "utf8") : null);
  if (captionText) {
    const hashtags = (captionText.match(/#\w+/g) || []).length;
    const sections = (captionText.match(/^##+\s+/gm) || []).length;
    if (hashtags) add("FAIL", "caption hashtags", `${hashtags} hashtag(s) — the contract is zero`);
    else add("PASS", "caption hashtags", "zero hashtags");
    if (sections >= 3) add("PASS", "caption sections", `${sections} platform section(s)`);
    else add("WARN", "caption sections", `${sections} section(s)`);
  } else {
    add("WARN", "caption.md", "no caption.md found");
  }
} else {
  add("WARN", "output/ folder", "no output/ folder yet — render before delivery");
}

const fails = results.filter((r) => r.status === "FAIL");
const warns = results.filter((r) => r.status === "WARN");
const passes = results.filter((r) => r.status === "PASS");

// ─── write asset-reel-audit.md ──────────────────────────────────────────────
const L = [];
L.push(`# Asset Reel Audit — ${basename(packDir)}`);
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
L.push("### 2.1 Asset-reel scorecard (rate 1–5 each, /50 — a reel worth posting scores ≥ 35)");
L.push("");
L.push("| Criterion | Ask | Score /5 |");
L.push("|---|---|---|");
L.push("| **Hook in beat 1** | Does the opening asset + text stop the scroll in the first 2 seconds? | |");
L.push("| **Asset ↔ beat fit** | Does each clip/image visually support its beat text (no mismatch)? | |");
L.push("| **Cut quality** | Clean cuts, no mid-word edits, exact-length clips, cover-crop looks right? | |");
L.push("| **Text overlay** | 3–6 words per beat, readable, inside safe zones, no overflow? | |");
L.push("| **Voiceover sync** | Does the voice land on the beat windows (FITS ✓, no drift)? | |");
L.push("| **Motion polish** | Ken Burns + text tweens smooth and intentional, not janky? | |");
L.push("| **Retention pacing** | Hook → agitate → payoff → CTA with a visible progress bar? | |");
L.push("| **Determinism** | Two identical renders identical (no SMIL/Math.random/audio-in-HTML)? | |");
L.push("| **Caption pack** | 500–900 chars per platform, no hashtags, hook-first, one CTA? | |");
L.push("| **Mute-first clarity** | Does the story read without audio? | |");
L.push("");
L.push("### 2.2 Creative judgment calls");
L.push("");
L.push("- Any asset that fights the beat (wrong mood, wrong subject)?");
L.push("- Any cut that would visibly jump or feel off-beat?");
L.push("- Any text that overflows or clashes with the asset?");
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
console.log(`✅ asset-reel-audit.md → ${basename(outPath)} (${passes.length} PASS · ${warns.length} WARN · ${fails.length} FAIL)`);
for (const r of results.filter((r) => r.status !== "PASS")) {
  console.log(`   ${r.status === "FAIL" ? "❌" : "⚠️"} ${r.check}: ${r.detail}`);
}
if (fails.length) {
  console.error(`❌ ${fails.length} automated FAIL(s) — fix and re-run before spawning the asset-reel-auditor.`);
  process.exit(1);
}
console.log("Automated checks clean — now spawn the asset-reel-auditor subagent (see SKILL.md Stage 6) to complete the scorecard + verdict in asset-reel-audit.md.");
process.exit(0);
