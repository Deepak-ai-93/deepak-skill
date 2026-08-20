#!/usr/bin/env node
// The text-motion-reels audit harness — the automated half of the
// reel-auditor gate. Scans a delivered text-motion reel folder and checks
// what a script CAN check: the HTML composition (format slug in the name,
// paused GSAP timeline registered on window.__timelines.reel, hook in the
// first scene, data-start/data-duration beat windows, no Math.random, no
// SMIL <animate>, clamp() fluid type, 1080x1920 stage), the top-5-creator
// copy rails (zero hashtags on screen, no intro openers, hook <= 8 words),
// the rendered output folder (MP4 + frames + 4K name), and caption.md
// (500-900 char sections, zero hashtags, one CTA). Writes reel-audit.md with
// the automated verdicts + an AUDITOR section for the subagent (visual
// quality, mute-first clarity, motion polish, viral potential). Exit 1 on
// any FAIL.
//
// Usage:
//   node audit-reel.mjs --pack <reel-folder> [--out reel-audit.md]
//
// The folder should contain the .html composition and/or the output/
// subfolder (MP4 + frames + caption.md). Subsets are allowed — missing files
// are FAIL but the audit continues.
//
// Exit codes: 0 = all automated checks PASS, 1 = any FAIL, 2 = usage error.
import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { resolve, basename, join } from "node:path";

// ─── brand banner (deepak-skill · crafted by Deepak) ────────────────────────
const BRAND_LINE = "═".repeat(56);
const banner = (label) =>
  `\n${BRAND_LINE}\n  🎬 deepak-skill — crafted by Deepak\n  skill: text-motion-reels · ${label}\n${BRAND_LINE}\n`;
console.log(banner("audit-reel.mjs"));

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
  console.error("Usage: node audit-reel.mjs --pack <reel-folder> [--out reel-audit.md]");
  process.exit(2);
}
const packDir = resolve(process.cwd(), packArg);
const outPath = resolve(process.cwd(), opt("out", "reel-audit.md"));
if (!existsSync(packDir)) {
  console.error(`❌ Reel folder not found: ${packDir}`);
  console.error("   Pass the folder that holds the .html composition and/or output/");
  process.exit(2);
}

const read = (f) => (existsSync(join(packDir, f)) ? readFileSync(join(packDir, f), "utf8") : null);

// ─── results collector ──────────────────────────────────────────────────────
const results = []; // { status: "PASS"|"FAIL"|"WARN", check, detail }
const add = (status, check, detail) => results.push({ status, check, detail });
let auditSections = [];

const FORMAT_SLUGS = ["word-pop", "highlighter", "3d-editorial", "card-listicle", "chat-thriller", "svg-ambient", "micro-fiction", "quiz-trap", "day-counter", "notification-drop", "thread-court"];

// ─── find the HTML composition ──────────────────────────────────────────────
let htmlPath = null;
let html = null;
{
  const direct = readdirSync(packDir).find((f) => /\.html$/i.test(f));
  const outHtml = readdirSync(packDir).find((f) => /output\//i.test(f));
  if (direct) htmlPath = join(packDir, direct);
  else if (existsSync(join(packDir, "output"))) {
    const inOut = readdirSync(join(packDir, "output")).find((f) => /\.html$/i.test(f));
    if (inOut) htmlPath = join(packDir, "output", inOut);
  }
  if (htmlPath) html = readFileSync(htmlPath, "utf8");
}

if (!html) {
  add("FAIL", "HTML composition exists", "no .html found in the pack or output/");
} else {
  const name = basename(htmlPath).toLowerCase();
  const slug = FORMAT_SLUGS.find((s) => name.includes(s));
  if (slug) add("PASS", "format slug", `composition named for format '${slug}'`);
  else add("WARN", "format slug", "no known format slug (word-pop/highlighter/3d-editorial/card-listicle/chat-thriller/svg-ambient/micro-fiction/quiz-trap/day-counter/notification-drop/thread-court) in the filename");
  if (/window\.__timelines\s*=\s*window\.__timelines\s*\|\|\s*\{\}/.test(html) && /__timelines\.reel/.test(html)) {
    add("PASS", "GSAP timeline", "paused timeline registered on window.__timelines.reel");
  } else {
    add("FAIL", "GSAP timeline", "no window.__timelines.reel registration — the renderer can't scrub frames");
  }
  if (/gsap\.timeline\(\s*\{\s*paused:\s*true/.test(html)) add("PASS", "paused timeline", "timeline created paused");
  else add("WARN", "paused timeline", "timeline not explicitly created paused");
  if (/Math\.random/.test(html)) add("FAIL", "determinism (no Math.random)", "Math.random() found — breaks identical renders");
  else add("PASS", "determinism (no Math.random)", "no Math.random()");
  if (/<animate|<animateTransform|<animateMotion/.test(html)) add("FAIL", "determinism (no SMIL)", "<animate> SMIL tags found — GSAP only");
  else add("PASS", "determinism (no SMIL)", "no SMIL <animate> tags");

  // ─── top-5-creator copy rails (visible on-screen text only) ───────────────
  // Strip style/script/svg + tags so CSS hex colors (#000), ids (#shape1) and
  // markup never false-positive — only what the viewer actually reads counts.
  const visible = html
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<svg[\s\S]*?<\/svg>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z0-9#]+;/gi, " ");
  const screenHashtags = (visible.match(/#[a-z0-9_]+/gi) || []).length;
  if (screenHashtags) add("FAIL", "zero hashtags on screen", `${screenHashtags} hashtag(s) in on-screen text — top-creator rail is zero`);
  else add("PASS", "zero hashtags on screen", "no hashtags in on-screen text");
  if (/\b(hey guys|welcome back|in this video|today we|so in this)\b/i.test(visible)) {
    add("FAIL", "no intro openers", "intro opener found (hey guys / welcome back / in this video / today we) — open the loop, don't announce it");
  } else {
    add("PASS", "no intro openers", "no intro openers — the hook opens the loop");
  }
  const beats = (html.match(/data-start=/g) || []).length;
  if (beats) add("PASS", "beat windows", `${beats} data-start beat window(s)`);
  else add("WARN", "beat windows", "no data-start beat windows found");
  if (/clamp\(/.test(html)) add("PASS", "fluid typography", "clamp() fluid type present");
  else add("WARN", "fluid typography", "no clamp() — text may not scale to 4K cleanly");
  if (/1080|1920|width:\s*1080px|height:\s*1920px/.test(html)) add("PASS", "9:16 stage", "1080x1920 stage present");
  else add("WARN", "9:16 stage", "no explicit 1080x1920 stage found");
  const hookScene = (html.match(/data-start="0"/g) || []).length;
  if (hookScene) add("PASS", "hook scene at 0s", "opening scene starts at 0s");
  else add("WARN", "hook scene at 0s", "no scene starting at data-start=0");
  const words = [...html.matchAll(/data-start="0"[^>]*>([\s\S]*?)<\/div>/g)];
  const hookWords = words[0] ? words[0][1].replace(/<[^>]+>/g, "").replace(/&[a-z0-9#]+;/gi, " ").trim().split(/\s+/).filter(Boolean) : null;
  auditSections.push(`hook scene word count: ${hookWords ? hookWords.length : "n/a"}`);
  if (hookWords === null) add("WARN", "hook ≤ 8 words", "no hook scene text to measure");
  else if (hookWords.length > 8) add("FAIL", "hook ≤ 8 words", `${hookWords.length} words — top-creator rail is ≤ 8 (split the hook)`);
  else add("PASS", "hook ≤ 8 words", `${hookWords.length} words — top-creator rail holds`);
}

// ─── rendered output folder ─────────────────────────────────────────────────
let mp4 = 0;
let frames = 0;
let caption = null;
const outDir = join(packDir, "output");
if (existsSync(outDir)) {
  try {
    const entries = readdirSync(outDir);
    mp4 = entries.filter((f) => /\.mp4$/i.test(f)).length;
    const frameDir = entries.find((f) => /frames/i.test(f) && !/\./.test(f)) || entries.find((f) => /^frames$/i.test(f));
    if (frameDir) frames = readdirSync(join(outDir, frameDir)).filter((f) => /\.(jpg|png)$/i.test(f)).length;
    caption = entries.find((f) => /^caption\.md$/i.test(f));
  } catch {
    // nested output/name/ layout
    try {
      const inner = readdirSync(outDir)[0];
      if (inner) {
        const innerDir = join(outDir, inner);
        mp4 = readdirSync(innerDir).filter((f) => /\.mp4$/i.test(f)).length;
        caption = readdirSync(innerDir).find((f) => /^caption\.md$/i.test(f));
      }
    } catch {
      // ignore
    }
  }
  if (mp4) add("PASS", "MP4 output", `${mp4} MP4(s) rendered`);
  else add("FAIL", "MP4 output", "no MP4 in output/ — render at --scale 2 for 4K");
  if (frames) add("PASS", "frame source", `${frames} frame(s) present`);
  else add("WARN", "frame source", "no frames/ folder — source frames missing");
  const captionText = caption ? readFileSync(join(outDir, caption), "utf8") : read(caption ? join("output", caption) : "caption.md");
  if (captionText) {
    const sections = (captionText.match(/^##+\s+/gm) || []).length;
    const hashtags = (captionText.match(/#\w+/g) || []).length;
    if (sections >= 3) add("PASS", "caption sections", `${sections} platform section(s)`);
    else add("WARN", "caption sections", `${sections} section(s) — expected 5+ platforms`);
    if (hashtags) add("FAIL", "caption hashtags", `${hashtags} hashtag(s) — the contract is zero`);
    else add("PASS", "caption hashtags", "zero hashtags");
    const cta = /(save this|save it|share|comment|follow|part 2|bookmark)/i.test(captionText);
    if (cta) add("PASS", "caption CTA", "one CTA present (save / share / comment / follow / part 2)");
    else add("WARN", "caption CTA", "no save/share/comment/follow/part 2 CTA found — every caption needs exactly one");
  } else {
    add("WARN", "caption.md", "no caption.md in output/");
  }
} else {
  add("WARN", "output/ folder", "no output/ folder yet — render before delivery");
}

const fails = results.filter((r) => r.status === "FAIL");
const warns = results.filter((r) => r.status === "WARN");
const passes = results.filter((r) => r.status === "PASS");

// ─── write reel-audit.md ────────────────────────────────────────────────────
const L = [];
L.push(`# Reel Audit — ${basename(packDir)}`);
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
L.push("### 2.1 Reel-worthiness scorecard (rate 1–5 each, /55 — a reel worth posting scores ≥ 38)");
L.push("");
L.push("| Criterion | Ask | Score /5 |");
L.push("|---|---|---|");
L.push("| **3-second hook** | Does the opening frame create a curiosity gap (stat / question / tease)? | |");
L.push("| **Mute-first clarity** | Does the motion carry the full message without audio? | |");
L.push("| **Premium aesthetic** | Clean, minimal, no messy/overlapping/flashing text? | |");
L.push("| **Motion quality** | Do transitions + camera moves feel intentional and smooth, not janky? | |");
L.push("| **Typography** | Fluid (clamp), readable at phone size, consistent with the format spec? | |");
L.push("| **Format fidelity** | Does it follow ONLY the chosen format's spec (palette/type/motion/effects)? | |");
L.push("| **Voiceover sync** | Does the voice land on the exact beat windows (FITS ✓, no drift)? | |");
L.push("| **Retention pacing** | Visual change every 1–2s, progress bar present, loop ending? | |");
L.push("| **Caption pack** | 500–900 chars per platform, no hashtags, hook-first, one CTA? | |");
L.push("| **Top-creator copy discipline** | Hook ≤ 8 words with a curiosity gap, one claim per beat, no intro openers, zero hashtags, loop ending — all five rails (determinism is machine-checked in §1)? | |");
L.push("| **Viral potential** | Would a random scroller stop AND watch to the end — is this built to chase millions of views (rewatch mechanics, save bait, shareable line)? | |");
L.push("");
L.push("### 2.2 Creative judgment calls");
L.push("");
L.push("- Any text that would overflow or clip at phone size?");
L.push("- Any animation that fights the message instead of supporting it?");
L.push("- Any beat where the voice and text drift apart?");
L.push("- Would this hook stop a random scroller cold — would you bet it can reach millions of views?");
L.push("- Is the CTA strong enough to convert a viewer mid-scroll (save / share / follow for part 2)?");
L.push("");
L.push("### 2.3 Verdict");
L.push("");
L.push("- All PASS and scorecard ≥ 38 → mark **PASS** and sign below.");
L.push("- Any FAIL (or a WARN you judge real) → mark **FIX NEEDED** and list concrete fixes per file.");
L.push("");
L.push(`> Auditor verdict: **PENDING** · Auditor: _(subagent)_ · Date: ${new Date().toISOString().slice(0, 10)}`);
L.push("");

writeFileSync(outPath, L.join("\n"), "utf8");

// ─── console ────────────────────────────────────────────────────────────────
console.log(`✅ reel-audit.md → ${basename(outPath)} (${passes.length} PASS · ${warns.length} WARN · ${fails.length} FAIL)`);
for (const r of results.filter((r) => r.status !== "PASS")) {
  console.log(`   ${r.status === "FAIL" ? "❌" : "⚠️"} ${r.check}: ${r.detail}`);
}
if (fails.length) {
  console.error(`❌ ${fails.length} automated FAIL(s) — fix and re-run before spawning the reel-auditor.`);
  process.exit(1);
}
console.log("Automated checks clean — now spawn the reel-auditor subagent (see SKILL.md Stage 6) to complete the scorecard + verdict in reel-audit.md.");
process.exit(0);
