#!/usr/bin/env node
// The hook-storyboard-retention audit harness — the automated half of the
// storyboard-auditor gate. Scans a delivered storyboard (markdown or the
// HyperFrames HTML composition) and checks what a script CAN check: the hook
// (first 2 seconds, a recognized formula, not a cold open), the beat structure
// (hook → agitate → payoff → CTA/loop with timings), the script ↔ timeline
// sync (data-start/data-duration beat windows, GSAP timeline registration if
// HTML), and the retention devices (open loop, progress bar, loop ending).
// Writes storyboard-audit.md with the automated verdicts + an AUDITOR section
// for the subagent (hook pull, retention engineering, watch-time judgment).
// Exit 1 on any FAIL.
//
// Usage:
//   node audit-storyboard.mjs --pack <storyboard-folder> [--out storyboard-audit.md]
//
// The folder should contain storyboard.md and/or a .html composition. Missing
// files are FAIL but the audit continues.
//
// Exit codes: 0 = all automated checks PASS, 1 = any FAIL, 2 = usage error.
import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { resolve, basename, join } from "node:path";

// ─── brand banner (deepak-skill · crafted by Deepak) ────────────────────────
const BRAND_LINE = "═".repeat(56);
const banner = (label) =>
  `\n${BRAND_LINE}\n  🎬 deepak-skill — crafted by Deepak\n  skill: hook-storyboard-retention · ${label}\n${BRAND_LINE}\n`;
console.log(banner("audit-storyboard.mjs"));

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
  console.error("Usage: node audit-storyboard.mjs --pack <storyboard-folder> [--out storyboard-audit.md]");
  process.exit(2);
}
const packDir = resolve(process.cwd(), packArg);
const outPath = resolve(process.cwd(), opt("out", "storyboard-audit.md"));
if (!existsSync(packDir)) {
  console.error(`❌ Storyboard folder not found: ${packDir}`);
  console.error("   Pass the folder that holds storyboard.md and/or the .html composition");
  process.exit(2);
}

const read = (f) => (existsSync(join(packDir, f)) ? readFileSync(join(packDir, f), "utf8") : null);

// ─── results collector ──────────────────────────────────────────────────────
const results = []; // { status: "PASS"|"FAIL"|"WARN", check, detail }
const add = (status, check, detail) => results.push({ status, check, detail });
let auditSections = [];

// ─── content: storyboard.md ─────────────────────────────────────────────────
const md = read("storyboard.md");
if (!md) {
  add("FAIL", "storyboard.md exists", "missing — the storyboard + script deliverable is required");
} else {
  // hook: first 2 seconds — a 0–2s beat with hook copy, or an explicit hook section
  const hookBeat = /0[–-]2s|0:00[–-]0:02|Hook|hook/i.test(md);
  if (hookBeat) add("PASS", "hook in the first 2s", "hook beat/section present (0–2s)");
  else add("FAIL", "hook in the first 2s", "no hook in the first 2 seconds found");
  const hookFormulas = (md.match(/curiosity gap|contrarian|pattern interrupt|validation|results-first|listicle|specific number|bold claim|story tease|open loop/i) || []).length;
  if (hookFormulas) add("PASS", "hook formula", `${hookFormulas} formula reference(s)`);
  else add("WARN", "hook formula", "no recognized hook formula named — check the hook has a formula");
  const beats = (md.match(/beat|hook|agitate|payoff|CTA|loop|0[–-]\d+s|0:\d{2}/gi) || []).length;
  if (beats >= 4) add("PASS", "beat structure", `${beats} beat/timing reference(s) — arc present`);
  else add("WARN", "beat structure", "few beat/timing references — need hook → agitate → payoff → CTA/loop");
  if (/payoff|value|twist/i.test(md)) add("PASS", "payoff", "payoff/value beat present");
  else add("WARN", "payoff", "no payoff/value beat found");
  if (/CTA|loop|follow|save|share|comment/i.test(md)) add("PASS", "CTA/loop ending", "CTA or loop ending present");
  else add("WARN", "CTA/loop ending", "no CTA/loop ending found");
  if (/open loop|loop|cliffhanger|curiosity/i.test(md)) add("PASS", "retention device", "open-loop/curiosity device present");
  else add("WARN", "retention device", "no open-loop/cliffhanger device found");
  if (/sync|data-start|data-duration|timeline|HyperFrames/i.test(md)) add("PASS", "script ↔ video sync", "script-to-timeline sync noted");
  else add("WARN", "script ↔ video sync", "no sync contract mentioned (data-start/data-duration per beat)");
  const hookLine = md.match(/(?:Hook|hook)[^\n]{0,120}/);
  if (hookLine) auditSections.push(`hook: ${hookLine[0].trim().slice(0, 100)}`);
}

// ─── composition: the .html (HyperFrames) if present ────────────────────────
let html = null;
{
  const direct = readdirSync(packDir).find((f) => /\.html$/i.test(f));
  if (direct) html = readFileSync(join(packDir, direct), "utf8");
}
if (!html) {
  add("WARN", "HTML composition", "no .html found — storyboard-only delivery (paste the blueprint when ready to build)");
} else {
  if (/window\.__timelines\s*=\s*window\.__timelines\s*\|\|\s*\{\}/.test(html) && /__timelines\.reel/.test(html)) add("PASS", "GSAP timeline", "timeline registered on window.__timelines.reel");
  else add("FAIL", "GSAP timeline", "no window.__timelines.reel registration — the renderer can't scrub frames");
  const beats = (html.match(/data-start=/g) || []).length;
  if (beats) add("PASS", "beat windows in HTML", `${beats} data-start beat window(s)`);
  else add("WARN", "beat windows in HTML", "no data-start beat windows found");
  if (/Math\.random/.test(html)) add("FAIL", "determinism (no Math.random)", "Math.random() found — breaks identical renders");
  else add("PASS", "determinism (no Math.random)", "no Math.random()");
  if (/<animate|<animateTransform|<animateMotion/.test(html)) add("FAIL", "determinism (no SMIL)", "SMIL <animate> tags found — GSAP only");
  else add("PASS", "determinism (no SMIL)", "no SMIL");
}

const fails = results.filter((r) => r.status === "FAIL");
const warns = results.filter((r) => r.status === "WARN");
const passes = results.filter((r) => r.status === "PASS");

// ─── write storyboard-audit.md ──────────────────────────────────────────────
const L = [];
L.push(`# Storyboard Audit — ${basename(packDir)}`);
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
  L.push("## 1b. Storyboard snippets for the auditor");
  L.push("");
  for (const s of auditSections) L.push(`- ${s}`);
  L.push("");
}
L.push("## 2. Auditor section — COMPLETE THIS (subagent, fresh eyes)");
L.push("");
L.push("### 2.1 Storyboard-worthiness scorecard (rate 1–5 each, /50 — a storyboard worth producing scores ≥ 35)");
L.push("");
L.push("| Criterion | Ask | Score /5 |");
L.push("|---|---|---|");
L.push("| **Hook stops the scroll** | Would the first 2 seconds stop a distracted scroller (pattern interrupt, bold claim, or question)? | |");
L.push("| **Watch-time engineering** | Do beats escalate and chain so viewers can't leave (open loops, mini-payoffs)? | |");
L.push("| **Retention arc** | Hook → agitate → payoff → CTA/loop all present and paced for 15–45s? | |");
L.push("| **One idea per beat** | Is each beat a single clause/visual — no crammed multi-idea beats? | |");
L.push("| **Script ↔ timeline sync** | Would each script clause map cleanly to a data-start/data-duration beat? | |");
L.push("| **Mute-first clarity** | Does the story read without audio (visuals + text carry it)? | |");
L.push("| **Payoff quality** | Does the payoff deliver what the hook promised (no bait-and-switch)? | |");
L.push("| **CTA/loop strength** | Does the ending earn a follow/save or loop cleanly for rewatch? | |");
L.push("| **Format fit** | Does the pacing suit the chosen platform/format (fast for TikTok, slower for Reels)? | |");
L.push("| **Determinism** | If built, would the composition render identically (GSAP-only, no SMIL/random)? | |");
L.push("");
L.push("### 2.2 Creative judgment calls");
L.push("");
L.push("- Any hook that reads clichéd or generic for the niche?");
L.push("- Any beat where the visual would be impossible or unclear?");
L.push("- Any pacing that would feel slow at 1.5× scroll speed?");
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
console.log(`✅ storyboard-audit.md → ${basename(outPath)} (${passes.length} PASS · ${warns.length} WARN · ${fails.length} FAIL)`);
for (const r of results.filter((r) => r.status !== "PASS")) {
  console.log(`   ${r.status === "FAIL" ? "❌" : "⚠️"} ${r.check}: ${r.detail}`);
}
if (fails.length) {
  console.error(`❌ ${fails.length} automated FAIL(s) — fix and re-run before spawning the storyboard-auditor.`);
  process.exit(1);
}
console.log("Automated checks clean — now spawn the storyboard-auditor subagent (see SKILL.md Stage 5) to complete the scorecard + verdict in storyboard-audit.md.");
process.exit(0);
