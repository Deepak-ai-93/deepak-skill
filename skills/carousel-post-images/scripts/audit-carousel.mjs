#!/usr/bin/env node
// The carousel-post-images audit harness — the automated half of the
// carousel-auditor gate. Scans a delivered carousel pack and checks what a
// script CAN check: slides.html (slide count, headline ≤ 8 words, sub ≤ 20,
// fluff blocklist, scene tags), the Mode-2 prompts.md (per-slide 4K image-gen
// prompts with the deck's copy), the carousel/ output folder (PNG long edge
// ≥ 4000px is a visual check — the script flags file presence + count), and
// caption.md (500–900 chars per platform, no hashtags, hook-first, one CTA).
// Writes carousel-audit.md with the automated verdicts + an AUDITOR section
// for the subagent (text accuracy, scene authenticity, 4K verification).
// Exit 1 on any FAIL.
//
// Usage:
//   node audit-carousel.mjs --pack <carousel-folder> [--out carousel-audit.md]
//
// The folder should contain: slides.html, caption.md, and either
// carousel/*.png (Mode 1) or carousel/prompts.md (Mode 2). Subsets are
// allowed — missing files are FAIL but the audit continues.
//
// Exit codes: 0 = all automated checks PASS, 1 = any FAIL, 2 = usage error.
import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { resolve, basename, join } from "node:path";

// ─── brand banner (deepak-skill · crafted by Deepak) ────────────────────────
const BRAND_LINE = "═".repeat(56);
const banner = (label) =>
  `\n${BRAND_LINE}\n  🎬 deepak-skill — crafted by Deepak\n  skill: carousel-post-images · ${label}\n${BRAND_LINE}\n`;
console.log(banner("audit-carousel.mjs"));

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
  console.error("Usage: node audit-carousel.mjs --pack <carousel-folder> [--out carousel-audit.md]");
  process.exit(2);
}
const packDir = resolve(process.cwd(), packArg);
const outPath = resolve(process.cwd(), opt("out", "carousel-audit.md"));
if (!existsSync(packDir)) {
  console.error(`❌ Carousel folder not found: ${packDir}`);
  console.error("   Pass the folder that holds slides.html / caption.md / carousel/");
  process.exit(2);
}

const read = (f) => (existsSync(join(packDir, f)) ? readFileSync(join(packDir, f), "utf8") : null);

// ─── results collector ──────────────────────────────────────────────────────
const results = []; // { status: "PASS"|"FAIL"|"WARN", check, detail }
const add = (status, check, detail) => results.push({ status, check, detail });
let auditSections = [];

const FLUFF = [
  "unlock", "game-changer", "elevate", "supercharge", "level up", "unleash",
  "boost", "empower", "revolutionize", "optimize", "leverage", "journey",
  "transform your", "in today's fast-paced world", "skyrocket", "crush it",
];

// ─── slides.html ────────────────────────────────────────────────────────────
const html = read("slides.html");
let slideCount = 0;
if (!html) {
  add("FAIL", "slides.html exists", "missing — the deck is the single source of truth");
} else {
  const slides = [...html.matchAll(/class="[^"]*\bslide\b[^"]*"/g)];
  slideCount = slides.length;
  if (slideCount >= 8) add("PASS", "slide count", `${slideCount} slides (target 8–10)`);
  else if (slideCount) add("WARN", "slide count", `${slideCount} slides — the contract is 8–10`);
  else add("FAIL", "slide count", "no .slide elements found");
  // headline word limits: pull .headline text per slide
  const headlines = [...html.matchAll(/class="[^"]*headline[^"]*"[^>]*>([^<]{0,120})/g)].map((m) => m[1].trim());
  const over8 = headlines.filter((h) => h && h.split(/\s+/).length > 8);
  if (over8.length) add("FAIL", "headline ≤ 8 words", `${over8.length}/${headlines.length} headline(s) over 8 words: ${over8.slice(0, 3).map((h) => `"${h}"`).join(", ")}`);
  else if (headlines.length) add("PASS", "headline ≤ 8 words", `${headlines.length} headline(s) all ≤ 8 words`);
  else add("WARN", "headline ≤ 8 words", "no .headline elements parsed (check the deck uses the standard classes)");
  const subs = [...html.matchAll(/class="[^"]*\bsub\b[^"]*"[^>]*>([^<]{0,160})/g)].map((m) => m[1].trim());
  const over20 = subs.filter((s) => s && s.split(/\s+/).length > 20);
  if (over20.length) add("WARN", "sub ≤ 20 words", `${over20.length} sub(s) over 20 words`);
  else if (subs.length) add("PASS", "sub ≤ 20 words", `${subs.length} sub(s) within limits`);
  // fluff across the deck
  const fluffHits = FLUFF.filter((w) => new RegExp(`\\b${w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`, "i").test(html));
  if (fluffHits.length) add("FAIL", "anti-fluff blocklist", `blocklisted: ${fluffHits.join(", ")}`);
  else add("PASS", "anti-fluff blocklist", "blocklist clear across the deck");
  const sceneTags = (html.match(/scene-tag|sceneTag|data-scene/gi) || []).length;
  if (sceneTags) add("PASS", "scene tags", `${sceneTags} scene annotation(s) present`);
  else add("WARN", "scene tags", "no scene-tag annotations — Mode 2 will fall back to placeholders");
  if (/CTA|Save this|Follow|Comment|part 2/i.test(html)) add("PASS", "cover loop + CTA", "open-loop/CTA pattern present");
  else add("WARN", "cover loop + CTA", "no clear cover-loop / CTA text found");
}

// ─── carousel/ output (Mode 1 PNGs or Mode 2 prompts.md) ────────────────────
let pngs = 0;
let promptsFile = null;
const carDir = join(packDir, "carousel");
if (existsSync(carDir)) {
  try {
    pngs = readdirSync(carDir).filter((f) => /\.png$/i.test(f)).length;
  } catch {
    pngs = 0;
  }
  promptsFile = existsSync(join(carDir, "prompts.md")) ? readFileSync(join(carDir, "prompts.md"), "utf8") : null;
  if (pngs) add("PASS", "Mode 1 PNG output", `${pngs} PNG(s) rendered — 4K long edge needs a visual check by the auditor`);
  else add("WARN", "Mode 1 PNG output", "no PNGs in carousel/ — run render-carousel.mjs --4k");
  if (promptsFile) {
    const canvas4k = (promptsFile.match(/4K|4320|4096|3840|4000/gi) || []).length;
    const blocks = (promptsFile.match(/^###\s+/gm) || []).length;
    if (blocks) add("PASS", "Mode 2 prompt blocks", `${blocks} per-slide prompt block(s)`);
    else add("WARN", "Mode 2 prompt blocks", "no '### ' prompt blocks in carousel/prompts.md");
    if (canvas4k) add("PASS", "Mode 2 4K canvas", `${canvas4k} 4K/canvas reference(s)`);
    else add("WARN", "Mode 2 4K canvas", "no explicit 4K canvas size in the prompts");
  } else {
    add("WARN", "Mode 2 prompts.md", "no carousel/prompts.md — run render-carousel.mjs --mode model");
  }
} else {
  add("WARN", "carousel/ output", "no carousel/ folder yet — render or generate before delivery");
}

// ─── caption.md ─────────────────────────────────────────────────────────────
const captions = read("caption.md");
if (!captions) {
  add("FAIL", "caption.md exists", "missing — the per-platform caption pack is required");
} else {
  const sections = (captions.match(/^##+\s+/gm) || []).length;
  if (sections >= 3) add("PASS", "caption platforms", `${sections} platform section(s)`);
  else add("WARN", "caption platforms", `${sections} section(s) — expected LinkedIn, Instagram, X, Threads, Facebook`);
  const hashtags = (captions.match(/#\w+/g) || []).length;
  if (hashtags) add("FAIL", "caption hashtags", `${hashtags} hashtag(s) — the contract is zero`);
  else add("PASS", "caption hashtags", "zero hashtags");
  if (/Save this|Follow|Comment|part 2|CTA|swipe/i.test(captions)) add("PASS", "caption CTA", "one-CTA + swipe cue present");
  else add("WARN", "caption CTA", "no CTA / swipe cue found");
  // 500–900 char window markers
  const windowMarks = (captions.match(/\d{3,4}\s*\/\s*500[-–]900|500–900|\d{3,4}\/500|\d{3,4}\/900/g) || []).length;
  if (windowMarks) add("PASS", "caption length window", `${windowMarks} 500–900 char marker(s)`);
  else add("WARN", "caption length window", "no 500–900 char length markers — verify each section lands in the window");
  if (/headline|scene|slide|recap/i.test(captions)) add("PASS", "caption slide recap", "slide/headline recap present");
  else add("WARN", "caption slide recap", "no slide recap table — the post and deck can drift apart");
}

const fails = results.filter((r) => r.status === "FAIL");
const warns = results.filter((r) => r.status === "WARN");
const passes = results.filter((r) => r.status === "PASS");

// ─── write carousel-audit.md ────────────────────────────────────────────────
const L = [];
L.push(`# Carousel Audit — ${basename(packDir)}`);
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
  L.push("## 1b. Carousel snippets for the auditor");
  L.push("");
  for (const s of auditSections) L.push(`- ${s}`);
  L.push("");
}
L.push("## 2. Auditor section — COMPLETE THIS (subagent, fresh eyes)");
L.push("");
L.push("### 2.1 Carousel-worthiness scorecard (rate 1–5 each, /50 — a deck worth posting scores ≥ 35)");
L.push("");
L.push("| Criterion | Ask | Score /5 |");
L.push("|---|---|---|");
L.push("| **Text accuracy** | Is every on-image character EXACTLY the planned copy (no garbling, no invented words)? | |");
L.push("| **Copy punch** | Headline ≤ 8 words, specific > generic, cover loop open, CTA present, no fluff? | |");
L.push("| **Scene authenticity** | Does each visual show the planned real-life moment (no stock clichés, no abstract gradients)? | |");
L.push("| **World consistency** | Same person/location/light across the whole deck (one day in one life)? | |");
L.push("| **Contrast / readability** | Text readable at phone size (≥ 4.5:1 on the scrim, nothing clipped)? | |");
L.push("| **Style consistency** | Same palette/type/scrim/accent across all slides? | |");
L.push("| **4K check** | Every image's long edge ≥ 4000px (visually confirm dimensions)? | |");
L.push("| **Cover → payoff loop** | Does the cover's open loop resolve inside the deck? | |");
L.push("| **Caption pack** | 500–900 chars per platform, no hashtags, hook-first, one CTA, slide recap? | |");
L.push("| **Save-worthiness** | Would the target audience save or share this? | |");
L.push("");
L.push("### 2.2 Creative judgment calls");
L.push("");
L.push("- Any slide whose text would be garbled by the image model (regenerate or fall back to Mode 1)?");
L.push("- Any scene that reads fake or stock-y?");
L.push("- Any headline that could belong to any brand?");
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
console.log(`✅ carousel-audit.md → ${basename(outPath)} (${passes.length} PASS · ${warns.length} WARN · ${fails.length} FAIL)`);
for (const r of results.filter((r) => r.status !== "PASS")) {
  console.log(`   ${r.status === "FAIL" ? "❌" : "⚠️"} ${r.check}: ${r.detail}`);
}
if (fails.length) {
  console.error(`❌ ${fails.length} automated FAIL(s) — fix and re-run before spawning the carousel-auditor.`);
  process.exit(1);
}
console.log("Automated checks clean — now spawn the carousel-auditor subagent (see SKILL.md Stage 6) to complete the scorecard + verdict in carousel-audit.md.");
process.exit(0);
