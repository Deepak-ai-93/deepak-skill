#!/usr/bin/env node
// The youtube-video-pipeline audit harness — the automated half of the
// video-plan-auditor gate. Scans a delivered YouTube packaging pack and checks
// what a script CAN check: video-brief.md (angle + search terms + retention
// promise), script.md (hook in the first 30s, timestamps, CTA, anti-fluff),
// titles.md (10 variants, each ≤ 60 chars, ≥ 4 different CTR formulas, no
// spam words / ALL-CAPS walls), thumbnail.md (one idea, ≤ 5 words of text,
// image-gen prompt), and metadata.md (hook-first description, chapters with
// timestamps, tags). Writes video-plan-audit.md with the automated verdicts +
// an AUDITOR section for the subagent (title↔content truth, hook pull).
// Exit 1 on any FAIL.
//
// Usage:
//   node audit-video-plan.mjs --pack <pack-folder> [--out video-plan-audit.md]
//
// The folder should contain: video-brief.md, script.md, titles.md,
// thumbnail.md, metadata.md (subsets are allowed — missing files are FAIL but
// the audit continues).
//
// Exit codes: 0 = all automated checks PASS, 1 = any FAIL, 2 = usage error.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, basename, join } from "node:path";

// ─── brand banner (deepak-skill · crafted by Deepak) ────────────────────────
const BRAND_LINE = "═".repeat(56);
const banner = (label) =>
  `\n${BRAND_LINE}\n  🎬 deepak-skill — crafted by Deepak\n  skill: youtube-video-pipeline · ${label}\n${BRAND_LINE}\n`;
console.log(banner("audit-video-plan.mjs"));

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
  console.error("Usage: node audit-video-plan.mjs --pack <pack-folder> [--out video-plan-audit.md]");
  process.exit(2);
}
const packDir = resolve(process.cwd(), packArg);
const outPath = resolve(process.cwd(), opt("out", "video-plan-audit.md"));
if (!existsSync(packDir)) {
  console.error(`❌ Pack folder not found: ${packDir}`);
  console.error("   Pass the folder that holds video-brief.md / script.md / titles.md / thumbnail.md / metadata.md");
  process.exit(2);
}

const read = (f) => (existsSync(join(packDir, f)) ? readFileSync(join(packDir, f), "utf8") : null);

// ─── results collector ──────────────────────────────────────────────────────
const results = []; // { status: "PASS"|"FAIL"|"WARN", check, detail }
const add = (status, check, detail) => results.push({ status, check, detail });
let auditSections = [];

// ─── video-brief.md ─────────────────────────────────────────────────────────
const brief = read("video-brief.md");
if (!brief) {
  add("FAIL", "video-brief.md exists", "missing — the researched brief is the approval gate");
} else {
  if (/angle|Angle|promise/i.test(brief)) add("PASS", "video-brief angle", "locked angle present");
  else add("WARN", "video-brief angle", "no explicit angle/promise found");
  const terms = (brief.match(/search term|keyword|target term/i) || []).length;
  if (terms) add("PASS", "video-brief search terms", `${terms} search-term reference(s)`);
  else add("WARN", "video-brief search terms", "no target search terms found");
}

// ─── script.md ──────────────────────────────────────────────────────────────
const script = read("script.md");
if (!script) {
  add("FAIL", "script.md exists", "missing — the retention-engineered script is the core deliverable");
} else {
  const timestamps = (script.match(/\b\d+:\d{2}(?::\d{2})?\b/g) || []).length;
  if (timestamps >= 2) add("PASS", "script timestamps", `${timestamps} timestamp(s) for chapters`);
  else add("WARN", "script timestamps", "few timestamps — every section needs one for chapters");
  const hookMark = /0:00|0:30|Hook|hook/i.test(script);
  if (hookMark) add("PASS", "script hook", "hook section present (0:00–0:30)");
  else add("WARN", "script hook", "no explicit hook section found — the opening 30s must state the payoff + a question");
  if (/CTA|subscribe|call to action/i.test(script)) add("PASS", "script CTA", "CTA present");
  else add("WARN", "script CTA", "no CTA found");
  const fluff = (script.match(/\b(so yeah|anyway|um|uh|like\s+you\s+know)\b/gi) || []).length;
  if (fluff) add("WARN", "script anti-fluff", `${fluff} filler phrase(s) found — cut them`);
  else add("PASS", "script anti-fluff", "no filler phrases detected");
  auditSections.push(`${(script.match(/\S+/g) || []).length} words in the script`);
}

// ─── titles.md ──────────────────────────────────────────────────────────────
const titles = read("titles.md");
if (!titles) {
  add("FAIL", "titles.md exists", "missing — the 10-variant title pack is required");
} else {
  // count title lines: numbered/bulleted items or quoted variants
  const titleLines = (titles.match(/^\s*(?:[-*]|\d+[.)])\s+/gm) || []).length;
  if (titleLines >= 8) add("PASS", "title pack depth", `${titleLines} title variant(s) found (target 10)`);
  else if (titleLines) add("WARN", "title pack depth", `${titleLines} title variant(s) — the contract is 10`);
  else add("FAIL", "title pack depth", "no title variants found");
  // ≤ 60 chars check — strip inline score annotations like (T1, 94/100) or (CTR 9.2%)
  // before measuring, so packed title lines (title + score on one line) don't false-FAIL.
  let tooLong = 0;
  const titleLineRe = /^\s*(?:[-*]|\d+[.)])\s+(.+)$/gm;
  for (const m of titles.matchAll(titleLineRe)) {
    const clean = m[1].replace(/\s*\(.*\)\s*$/, "").trim();
    if (clean.length > 60) tooLong++;
  }
  if (tooLong) add("FAIL", "title length (≤ 60 chars)", `${tooLong} title(s) exceed 60 chars — mobile truncates`);
  else add("PASS", "title length (≤ 60 chars)", "no over-60-char titles detected (annotations ignored)");
  const formulas = (titles.match(/question|number|curiosity|how-to|contrarian|formula/i) || []).length;
  if (formulas >= 4) add("PASS", "title formulas", "≥ 4 distinct CTR formulas referenced");
  else add("WARN", "title formulas", "fewer than 4 formula types referenced (question / number / curiosity / how-to / contrarian)");
  const spam = (titles.match(/\b(shocking|guaranteed|amazing|secret(?!s))\b/gi) || []).length;
  const capsWalls = (titles.match(/\b[A-Z]{4,}\b/g) || []).length;
  if (spam || capsWalls) add("FAIL", "title spam words / ALL-CAPS", `${spam} spam word(s), ${capsWalls} ALL-CAPS token(s) — clean them`);
  else add("PASS", "title spam words / ALL-CAPS", "no spam words or ALL-CAPS walls");
  if (/winner|best|rationale|why/i.test(titles)) add("PASS", "title winner", "winner + rationale marked");
  else add("WARN", "title winner", "no winner/alternates marked");
}

// ─── thumbnail.md ───────────────────────────────────────────────────────────
const thumb = read("thumbnail.md");
if (!thumb) {
  add("FAIL", "thumbnail.md exists", "missing — the thumbnail brief is part of the pack");
} else {
  if (/image.?gen prompt|prompt|--ar|9:16|16:9|1:1/i.test(thumb)) add("PASS", "thumbnail prompt", "image-gen prompt present");
  else add("WARN", "thumbnail prompt", "no image-gen prompt found");
  const textWords = (thumb.match(/\b\d+\s*words?\b|≤\s*5|3–5 words|fewer than 5/i) || []).length;
  if (textWords) add("PASS", "thumbnail text limit", "on-image text limited (≤ 5 words)");
  else add("WARN", "thumbnail text limit", "no explicit ≤ 5-word text rule mentioned");
  if (/160px|readable|legible/i.test(thumb)) add("PASS", "thumbnail readability", "160px-readability noted");
  else add("WARN", "thumbnail readability", "no readability-at-160px note");
}

// ─── metadata.md ────────────────────────────────────────────────────────────
const meta = read("metadata.md");
if (!meta) {
  add("FAIL", "metadata.md exists", "missing — description + chapters + tags required");
} else {
  if (/chapters|timestamps|\[\d+:\d{2}\]/i.test(meta)) add("PASS", "metadata chapters", "chapters with timestamps present");
  else add("WARN", "metadata chapters", "no chapters-with-timestamps found");
  if (/tags?[:：]/i.test(meta)) add("PASS", "metadata tags", "tags section present");
  else add("WARN", "metadata tags", "no tags section found");
  if (/http(s)?:\/\//i.test(meta)) add("PASS", "metadata links", "links present");
  else add("WARN", "metadata links", "no links found");
  if (/caption|subtitles|transcript/i.test(meta)) add("PASS", "metadata captions", "captions/subtitles note present");
  else add("WARN", "metadata captions", "no captions note (upload a clean transcript)");
}

const fails = results.filter((r) => r.status === "FAIL");
const warns = results.filter((r) => r.status === "WARN");
const passes = results.filter((r) => r.status === "PASS");

// ─── write video-plan-audit.md ──────────────────────────────────────────────
const L = [];
L.push(`# Video Plan Audit — ${basename(packDir)}`);
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
  L.push("## 1b. Pack snippets for the auditor");
  L.push("");
  for (const s of auditSections) L.push(`- ${s}`);
  L.push("");
}
L.push("## 2. Auditor section — COMPLETE THIS (subagent, fresh eyes)");
L.push("");
L.push("### 2.1 Video-pack scorecard (rate 1–5 each, /50 — a pack worth producing scores ≥ 35)");
L.push("");
L.push("| Criterion | Ask | Score /5 |");
L.push("|---|---|---|");
L.push("| **Hook in the first 30s** | Does the script's opening state the payoff + raise a specific question new viewers care about? | |");
L.push("| **Title ↔ content truth** | Does the winner title + thumbnail promise EXACTLY what the script delivers (no clickbait mismatch)? | |");
L.push("| **Title pack depth** | 10 variants, ≤ 60 chars, ≥ 4 formulas, no spam/ALL-CAPS? | |");
L.push("| **Open-loop structure** | Are loops opened in the first 2 minutes and ALL paid off by the end? | |");
L.push("| **Thumbnail = one idea** | One subject, one emotion, ≤ 5 words, 160px-readable, matches the winner title? | |");
L.push("| **Script CTA** | Is the subscribe/CTA earned (not begged) and placed at the payoff? | |");
L.push("| **Metadata** | Description hook-first, chapters match script timestamps, tags from research, captions note? | |");
L.push("| **Anti-fluff** | Every line informs/proves/entertains — no filler, no vague claims? | |");
L.push("| **Search fit** | Do the locked search terms appear naturally in title/description/tags? | |");
L.push("| **Channel fit** | Does the angle match this channel's audience + existing style? | |");
L.push("");
L.push("### 2.2 Creative judgment calls");
L.push("");
L.push("- Hook: would a new viewer stay past 0:30, or is the opening generic?");
L.push("- Titles: any variant that overpromises what the script can't deliver?");
L.push("- Thumbnail: any subject/emotion mismatch with the winner title?");
L.push("- Structure: any open loop left unpaid or a middle section that drags?");
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
console.log(`✅ video-plan-audit.md → ${basename(outPath)} (${passes.length} PASS · ${warns.length} WARN · ${fails.length} FAIL)`);
for (const r of results.filter((r) => r.status !== "PASS")) {
  console.log(`   ${r.status === "FAIL" ? "❌" : "⚠️"} ${r.check}: ${r.detail}`);
}
if (fails.length) {
  console.error(`❌ ${fails.length} automated FAIL(s) — fix and re-run before spawning the video-plan-auditor.`);
  process.exit(1);
}
console.log("Automated checks clean — now spawn the video-plan-auditor subagent (see SKILL.md Stage 5) to complete the scorecard + verdict in video-plan-audit.md.");
process.exit(0);
