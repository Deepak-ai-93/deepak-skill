#!/usr/bin/env node
// The podcast-to-shorts audit harness — the automated half of the
// clips-auditor gate. Scans a delivered clips pack and checks what a script
// CAN check: the transcript exists, clip-plan.md has scored moment blocks
// (start-end, virality score, standalone-eligibility) + the FFmpeg cut
// commands, captions.md follows the hook-first / no-hashtags / per-platform
// length contract, and the clips/ folder has the expected output files.
// Writes clips-audit.md with the automated verdicts + an AUDITOR section for
// the subagent to complete (hook quality, score honesty, standalone value).
// Exit 1 on any FAIL.
//
// Usage:
//   node audit-clips.mjs --pack <clips-folder> [--out clips-audit.md]
//
// The folder should contain: clip-plan.md, captions.md, transcript.txt,
// clips/*.mp4 (subsets are allowed — missing files are FAIL but the audit
// continues).
//
// Exit codes: 0 = all automated checks PASS, 1 = any FAIL, 2 = usage error.
import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { resolve, basename, join } from "node:path";

// ─── brand banner (deepak-skill · crafted by Deepak) ────────────────────────
const BRAND_LINE = "═".repeat(56);
const banner = (label) =>
  `\n${BRAND_LINE}\n  🎬 deepak-skill — crafted by Deepak\n  skill: podcast-to-shorts · ${label}\n${BRAND_LINE}\n`;
console.log(banner("audit-clips.mjs"));

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
  console.error("Usage: node audit-clips.mjs --pack <clips-folder> [--out clips-audit.md]");
  process.exit(2);
}
const packDir = resolve(process.cwd(), packArg);
const outPath = resolve(process.cwd(), opt("out", "clips-audit.md"));
if (!existsSync(packDir)) {
  console.error(`❌ Clips folder not found: ${packDir}`);
  console.error("   Pass the folder that holds clip-plan.md / captions.md / transcript.txt / clips/");
  process.exit(2);
}

const read = (f) => (existsSync(join(packDir, f)) ? readFileSync(join(packDir, f), "utf8") : null);

// ─── results collector ──────────────────────────────────────────────────────
const results = []; // { status: "PASS"|"FAIL"|"WARN", check, detail }
const add = (status, check, detail) => results.push({ status, check, detail });
let auditSections = [];

// ─── transcript ─────────────────────────────────────────────────────────────
const transcript = read("transcript.txt");
if (!transcript) add("WARN", "transcript.txt exists", "missing — scores can't be re-verified against the source");
else {
  const stamps = (transcript.match(/\[\d{1,2}:\d{2}(?::\d{2})?\]/g) || []).length;
  if (stamps >= 3) add("PASS", "transcript timestamps", `${stamps} [HH:MM:SS] timestamps found`);
  else add("WARN", "transcript timestamps", `only ${stamps} timestamp(s) — clip scoring needs per-line [HH:MM:SS] stamps`);
}

// ─── clip-plan.md ───────────────────────────────────────────────────────────
const plan = read("clip-plan.md");
let clipCount = 0;
if (!plan) {
  add("FAIL", "clip-plan.md exists", "missing — no scored moment plan to audit");
} else {
  // moment blocks: one per candidate with start–end, score, why it's viral, suggested hook
  const blocks = plan.split(/\n#{1,3} /).filter((b) => /--|–/.test(b) && /\d/.test(b));
  clipCount = blocks.length;
  if (clipCount === 0) {
    // fallback: count lines that look like a moment header
    clipCount = (plan.match(/^\s*[-*]?\s*\d+:\d{2}(?::\d{2})?\s*[-–]\s*\d+:\d{2}/gm) || []).length;
  }
  if (clipCount) add("PASS", "clip-plan moments", `${clipCount} scored moment block(s) parsed`);
  else add("FAIL", "clip-plan moments", "no scored moment blocks found (expected 'start–end · score · why · hook')");
  // score cards
  const scores = (plan.match(/\b\d{1,2}\s*\/\s*\d{1,2}\b|\bscore\s*[:=]\s*\d+/gi) || []).length;
  if (scores) add("PASS", "clip-plan scores", `${scores} score reference(s) found`);
  else add("WARN", "clip-plan scores", "no explicit score references found");
  // FFmpeg cut commands
  const hasFfmpeg = /ffmpeg|1080x1920|1080×1920|-c:v libx264/.test(plan);
  if (hasFfmpeg) add("PASS", "clip-plan cut commands", "FFmpeg cut commands (9:16 1080x1920) present");
  else add("WARN", "clip-plan cut commands", "no FFmpeg cut commands found — run clip-finder.mjs --cuts");
  const hooks = (plan.match(/hook[:：]/gi) || []).length;
  if (hooks) add("PASS", "clip-plan hooks", `${hooks} suggested hook(s) found`);
  else add("WARN", "clip-plan hooks", "no suggested hooks found in the plan");
  // standalone cutoff note
  if (/standalone|cutoff/i.test(plan)) add("PASS", "clip-plan cutoff", "standalone/cutoff guidance present");
  else add("WARN", "clip-plan cutoff", "no explicit standalone/cutoff guidance");
}

// ─── clips/ output folder ───────────────────────────────────────────────────
let renderedClips = 0;
if (existsSync(join(packDir, "clips"))) {
  try {
    renderedClips = readdirSync(join(packDir, "clips")).filter((f) => /\.(mp4|mov)$/i.test(f)).length;
  } catch {
    renderedClips = 0;
  }
  if (renderedClips) add("PASS", "clips/ output", `${renderedClips} rendered clip(s) found`);
  else add("WARN", "clips/ output", "clips/ folder exists but no .mp4/.mov files — run the cut commands with --run");
} else {
  add("WARN", "clips/ output", "no clips/ folder yet — expected after running the FFmpeg cut commands");
}

// ─── captions.md ────────────────────────────────────────────────────────────
const captions = read("captions.md");
if (!captions) {
  add("FAIL", "captions.md exists", "missing — no per-clip caption pack");
} else {
  const hashtags = (captions.match(/#\w+/g) || []).length;
  if (hashtags) add("FAIL", "captions.md hashtags", `${hashtags} hashtag(s) found — the contract is zero hashtags`);
  else add("PASS", "captions.md hashtags", "zero hashtags");
  const sections = (captions.match(/^##+\s+/gm) || []).length;
  if (sections) add("PASS", "captions.md sections", `${sections} caption section(s) found`);
  else add("WARN", "captions.md sections", "no ## sections found");
  const ctas = (captions.match(/Follow|Full episode|part 2|link|Comment|DM|Save|Share/i) || []).length;
  if (ctas) add("PASS", "captions.md CTA", "one-CTA pattern present");
  else add("WARN", "captions.md CTA", "no clear CTA found");
  // char-length window per platform: TikTok/Reels 100–220, Shorts 300–400
  const shorts = (captions.match(/\d{3,4}\s*\/\s*100[-–]220|\d{3,4}\s*\/\s*300[-–]400|100–220|300–400/g) || []).length;
  if (shorts) auditSections.push(`${shorts} length note(s) matching the per-platform windows`);
}

const fails = results.filter((r) => r.status === "FAIL");
const warns = results.filter((r) => r.status === "WARN");
const passes = results.filter((r) => r.status === "PASS");

// ─── write clips-audit.md ───────────────────────────────────────────────────
const L = [];
L.push(`# Clips Audit — ${basename(packDir)}`);
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
  L.push("## 1b. Clips snippets for the auditor");
  L.push("");
  for (const s of auditSections) L.push(`- ${s}`);
  L.push("");
}
L.push("## 2. Auditor section — COMPLETE THIS (subagent, fresh eyes)");
L.push("");
L.push("### 2.1 Clip-worthiness scorecard (rate 1–5 each, /50 — a clip pack worth posting scores ≥ 35)");
L.push("");
L.push("| Criterion | Ask | Score /5 |");
L.push("|---|---|---|");
L.push("| **Standalone value** | Every clip makes sense to someone who never saw the episode (hook → payoff ≤ 60s)? | |");
L.push("| **Hook in the first 2s** | Does each clip open on a punch (bold claim / specific number / story tease / pattern interrupt)? | |");
L.push("| **Score honesty** | Do the clip-plan scores match what's actually in the clip? | |");
L.push("| **Emotional/controversy pull** | Would a scroller stop for this moment, or is it just 'interesting'? | |");
L.push("| **Quotability** | Does the moment work as a standalone soundbite (re-share + comment bait)? | |");
L.push("| **Technical cuts** | 1080x1920, clean audio, no hard cuts mid-word? | |");
L.push("| **Captions** | Hook-first, zero hashtags, one CTA, correct per-platform lengths? | |");
L.push("| **Caption ↔ clip match** | Does each caption quote the clip's actual line (no mismatch)? | |");
L.push("| **Discovery fit** | Would this clip drive interest in the full episode for THIS audience? | |");
L.push("| **Cadence plan** | Posting cadence + full-episode link noted for delivery? | |");
L.push("");
L.push("### 2.2 Creative judgment calls");
L.push("");
L.push("- Hooks: any that are clickbait mismatched to the clip's content?");
L.push("- Moments: any that need context from outside the cut (a setup you didn't include)?");
L.push("- Technical: any clip that would look/ sound broken (mid-word cut, sync drift)?");
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
console.log(`✅ clips-audit.md → ${basename(outPath)} (${passes.length} PASS · ${warns.length} WARN · ${fails.length} FAIL)`);
for (const r of results.filter((r) => r.status !== "PASS")) {
  console.log(`   ${r.status === "FAIL" ? "❌" : "⚠️"} ${r.check}: ${r.detail}`);
}
if (fails.length) {
  console.error(`❌ ${fails.length} automated FAIL(s) — fix and re-run before spawning the clips-auditor.`);
  process.exit(1);
}
console.log("Automated checks clean — now spawn the clips-auditor subagent (see SKILL.md Stage 6) to complete the scorecard + verdict in clips-audit.md.");
process.exit(0);
