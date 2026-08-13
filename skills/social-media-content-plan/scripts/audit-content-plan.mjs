#!/usr/bin/env node
// social-media-content-plan — the audit harness, automated half of the
// content-plan-auditor gate. Scans a delivered content-plan pack and checks
// what a script CAN check: strategy.md (per-platform coverage, honest reset
// framing, native rules), pillars.md (3–4 narrow pillars, shares ≈ 1, hook
// bank ≥ 8, angles), calendar.md (30 days, hooks, one CTA, posting times,
// format variety), engagement.md (first-60-minute protocol, comment strategy,
// daily budget), metrics.md (per-platform signals + review cadence), plus the
// anti-fluff blocklist across the whole pack. Writes content-plan-audit.md
// with the automated verdicts + an AUDITOR section for the subagent (hook
// strength, clustering tightness, sustainability judgment). Exit 1 on any FAIL.
//
// Usage:
//   node audit-content-plan.mjs --pack <plan-folder> [--platforms instagram,x] [--out content-plan-audit.md]
//
// Exit codes: 0 = all automated checks PASS, 1 = any FAIL, 2 = usage error.
import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { resolve, basename, join } from "node:path";

// ─── brand banner (deepak-skill · crafted by Deepak) ────────────────────────
const BRAND_LINE = "═".repeat(56);
const banner = (label) =>
  `\n${BRAND_LINE}\n  🎬 deepak-skill — crafted by Deepak\n  skill: social-media-content-plan · ${label}\n${BRAND_LINE}\n`;
console.log(banner("audit-content-plan.mjs"));

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
  console.error("Usage: node audit-content-plan.mjs --pack <plan-folder> [--platforms instagram,x] [--out content-plan-audit.md]");
  process.exit(2);
}
const packDir = resolve(process.cwd(), packArg);
const outPath = resolve(process.cwd(), opt("out", "content-plan-audit.md"));
if (!existsSync(packDir)) {
  console.error(`❌ Plan folder not found: ${packDir}`);
  console.error("   Pass the folder that holds strategy.md / pillars.md / calendar.md / engagement.md / metrics.md");
  process.exit(2);
}
const platformsArg = opt("platforms", "").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
const checkPlatforms = platformsArg.length > 0;

const read = (f) => (existsSync(join(packDir, f)) ? readFileSync(join(packDir, f), "utf8") : null);

// ─── results collector ──────────────────────────────────────────────────────
const results = []; // { status: "PASS"|"FAIL"|"WARN", check, detail }
const add = (status, check, detail) => results.push({ status, check, detail });
let auditSections = [];

// the shared anti-fluff / hype blocklist (see templates/algorithm-reset.md)
const FLUFF = [
  "algorithm hack", "reset button", "guaranteed", "instantly", "viral hack",
  "go viral overnight", "100k in 24", "unlock", "game-changer", "supercharge",
  "elevate", "agreed?", "who else feels", "like this post if", "thrilled to announce",
  "fake it till you make it",
];
const countFluff = (text) => FLUFF.filter((w) => new RegExp(`\\b${w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`, "i").test(text));

// ─── strategy.md ────────────────────────────────────────────────────────────
const strategy = read("strategy.md");
if (!strategy) {
  add("FAIL", "strategy.md exists", "missing — the per-platform strategy is the core deliverable");
} else {
  const slugs = ["instagram", "x", "linkedin", "tiktok", "youtube", "facebook", "threads"];
  const mentioned = slugs.filter((s) => new RegExp(`\\b${s}\\b`, "i").test(strategy));
  if (checkPlatforms) {
    const missing = platformsArg.filter((s) => !mentioned.includes(s));
    if (missing.length) add("FAIL", "strategy platform coverage", `selected platform(s) not covered in strategy.md: ${missing.join(", ")}`);
    else add("PASS", "strategy platform coverage", `all selected platform(s) have a section: ${platformsArg.join(", ")}`);
  } else if (mentioned.length) {
    add("PASS", "strategy platform coverage", `${mentioned.length} platform section(s) found: ${mentioned.join(", ")}`);
  } else {
    add("WARN", "strategy platform coverage", "no named platform sections found — pass --platforms to verify selected platforms");
  }
  if (/re-train|retrain|sprint|first 60|60 minutes|first-hour|consistent/i.test(strategy)) add("PASS", "strategy reset framing", "honest reset framing (re-training sprint / first-hour velocity) present");
  else add("FAIL", "strategy reset framing", "no honest reset framing — the reset must be framed as a re-training sprint, never a 'hack'");
  if (/native|watermark|cross-post|recycled|aspect/i.test(strategy)) add("PASS", "strategy native rules", "native-content rules (no watermarks / no recycled cross-posts) present");
  else add("WARN", "strategy native rules", "no native-content penalty rules found");
  if (/hook|dwell|completion|watch time|velocity|save|share/i.test(strategy)) add("PASS", "strategy signals", "ranking signals referenced (dwell/completion/velocity/shares)");
  else add("WARN", "strategy signals", "no ranking-signal references found");
  const fluff = countFluff(strategy);
  if (fluff.length) add("FAIL", "strategy anti-fluff", `hype blocklist hit: ${fluff.join(", ")}`);
  else add("PASS", "strategy anti-fluff", "blocklist clear");
  auditSections.push(`${strategy.split(/\s+/).filter(Boolean).length} words in strategy.md`);
}

// ─── pillars.md ─────────────────────────────────────────────────────────────
const pillars = read("pillars.md");
if (!pillars) {
  add("FAIL", "pillars.md exists", "missing — content pillars + hook bank required");
} else {
  // pillar rows look like: | **Transformation receipts** | 40% | … (table rows with bold name + share)
  const pillarRows = (pillars.match(/^\|\s*\*\*[^*]+\*\*\s*\|\s*(\d{1,3})\s*%/gm) || []);
  const pillarCount = pillarRows.length;
  if (pillarCount >= 3 && pillarCount <= 4) add("PASS", "pillars count", `${pillarCount} pillar row(s) with shares (target 3–4 narrow pillars)`);
  else add("WARN", "pillars count", `${pillarCount} pillar row(s) found — target 3–4 narrow pillars, each a table row like "| **Pillar** | 40% |"`);
  const shares = pillarRows.map((r) => Number((r.match(/\d{1,3}%/) || ["0"])[0].replace("%", "")));
  const sum = shares.reduce((a, b) => a + b, 0);
  if (shares.length >= 3 && sum >= 95 && sum <= 105) add("PASS", "pillars shares", `shares found (${shares.join("+")}=${sum}%) ≈ 100%`);
  else add("WARN", "pillars shares", "pillar shares not found or not ≈ 100% — each pillar row must carry a percentage share");
  // hook bank entries look like: - "…" (quoted bullets)
  const hooks = (pillars.match(/^[-*]\s+"[^"]+"/gm) || []).length;
  if (hooks >= 8) add("PASS", "pillars hook bank", `${hooks} hook entries (target ≥ 8)`);
  else add("WARN", "pillars hook bank", `${hooks} quoted hook bullets found — target ≥ 8 hooks tagged to pillars`);
  if (/angle|angle bank/i.test(pillars)) add("PASS", "pillars angle bank", "angle bank present");
  else add("WARN", "pillars angle bank", "no angle bank found — 2–3 fresh angles per pillar keep 30 days from repeating");
  const fluff = countFluff(pillars);
  if (fluff.length) add("FAIL", "pillars anti-fluff", `hype blocklist hit: ${fluff.join(", ")}`);
  else add("PASS", "pillars anti-fluff", "blocklist clear");
}

// ─── calendar.md ────────────────────────────────────────────────────────────
const calendar = read("calendar.md");
if (!calendar) {
  add("FAIL", "calendar.md exists", "missing — the 30-day calendar is required (generate with build-calendar.mjs)");
} else {
  const days = (calendar.match(/^## Day \d+/gm) || []).length;
  if (days >= 30) add("PASS", "calendar days", `${days} day blocks (target 30)`);
  else add("FAIL", "calendar days", `${days} day blocks — the contract is a 30-day calendar`);
  const rows = (calendar.match(/^\| \*\*[a-z]+\*\*/gmi) || []).length;
  if (rows >= 15) add("PASS", "calendar posts", `${rows} scheduled post row(s)`);
  else add("WARN", "calendar posts", `only ${rows} post row(s) — check cadence in plan.json`);
  if (/hook/i.test(calendar)) add("PASS", "calendar hooks", "hook column present on posts");
  else add("WARN", "calendar hooks", "no hook column — every post needs a hook");
  if (/CTA/i.test(calendar)) add("PASS", "calendar CTAs", "CTA column present");
  else add("WARN", "calendar CTAs", "no CTA column — one CTA per post");
  if (/best time|Timezone|posting/i.test(calendar)) add("PASS", "calendar posting times", "posting times set");
  else add("WARN", "calendar posting times", "no posting times found");
  const fluff = countFluff(calendar);
  if (fluff.length) add("FAIL", "calendar anti-fluff", `hype blocklist hit: ${fluff.join(", ")}`);
  else add("PASS", "calendar anti-fluff", "blocklist clear");
}

// ─── engagement.md ──────────────────────────────────────────────────────────
const engagement = read("engagement.md");
if (!engagement) {
  add("FAIL", "engagement.md exists", "missing — the first-60-minute protocol is required");
} else {
  if (/first 60|60 minutes|first-hour|first hour/i.test(engagement)) add("PASS", "engagement first-60-min", "first-60-minute protocol present");
  else add("FAIL", "engagement first-60-min", "no first-60-minute protocol — the engagement velocity window decides tier expansion");
  if (/comment|reply|reply to every|insight/i.test(engagement)) add("PASS", "engagement comment strategy", "comment strategy present (reply to every comment, add ONE insight)");
  else add("WARN", "engagement comment strategy", "no comment strategy found");
  if (/great post|nice post/i.test(engagement)) add("WARN", "engagement insight rule", "check the how-to-comment rule — 'Great post!' alone is banned");
  else add("PASS", "engagement insight rule", "no lazy-comment pattern in the strategy");
  if (/budget|min(utes)?\/day|30|60|per day/i.test(engagement)) add("PASS", "engagement daily budget", "daily engagement time budget set");
  else add("WARN", "engagement daily budget", "no daily engagement budget — a plan without a time budget fails by week two");
}

// ─── metrics.md ─────────────────────────────────────────────────────────────
const metrics = read("metrics.md");
if (!metrics) {
  add("FAIL", "metrics.md exists", "missing — the metrics + review loop is required");
} else {
  if (/dwell|completion|save|share|follower conversion|follow conversion/i.test(metrics)) add("PASS", "metrics signals", "compounding-reach signals (dwell/completion/save-share/follow conversion) present");
  else add("WARN", "metrics signals", "no compounding-reach signal list found");
  if (/day 7|day 7|day 14|day 21|day 30|review|double down|weekly/i.test(metrics)) add("PASS", "metrics review loop", "day-7/14/21/30 review loop present");
  else add("WARN", "metrics review loop", "no review loop found — the calendar adjusts on data, not vibes");
  if (checkPlatforms) {
    const perPlatform = platformsArg.filter((s) => new RegExp(`\\b${s}\\b`, "i").test(metrics));
    if (perPlatform.length !== platformsArg.length) add("WARN", "metrics per-platform", `platform-specific metrics missing for: ${platformsArg.filter((s) => !perPlatform.includes(s)).join(", ")}`);
    else add("PASS", "metrics per-platform", `per-platform metrics for ${platformsArg.join(", ")}`);
  }
}

// ─── companion gate ─────────────────────────────────────────────────────────
const companion = read("companion-skills.md");
if (companion) {
  if (/installed|missing|npx skills add/.test(companion)) add("PASS", "companion gate", "companion-skills.md present with install matrix (Stage 4b run)");
  else add("WARN", "companion gate", "companion-skills.md present but doesn't look like the gate output — re-run check-skills.mjs --out companion-skills.md");
} else {
  add("WARN", "companion gate", "no companion-skills.md — run check-skills.mjs --out companion-skills.md so the calendar's posts have producers installed");
}

// ─── summary + write ────────────────────────────────────────────────────────
const fails = results.filter((r) => r.status === "FAIL");
const warns = results.filter((r) => r.status === "WARN");
const passes = results.filter((r) => r.status === "PASS");

const L = [];
L.push(`# Content Plan Audit — ${basename(packDir)}`);
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
L.push("### 2.1 Plan-worthiness scorecard (rate 1–5 each, /50 — a plan worth posting scores ≥ 35)");
L.push("");
L.push("| Criterion | Ask | Score /5 |");
L.push("|---|---|---|");
L.push("| **Honest reset framing** | Is the 'algorithm reset' framed as a re-training sprint with no hack/guarantee claims? | |");
L.push("| **Platform-native depth** | Does each platform's section reflect how that algorithm ACTUALLY ranks (real signals), not generic advice? | |");
L.push("| **Niche clustering** | Are the pillars narrow enough that the model can build one embedding — or is it 'fitness' instead of 'fat-loss for busy professionals'? | |");
L.push("| **Hook strength** | Would the hooks stop a real scroll — curiosity gap, contrarian claim, specific outcome, pattern interrupt? | |");
L.push("| **Calendar realism** | 30 days at a cadence the user's time budget can sustain; varied formats; one CTA per post? | |");
L.push("| **First-60-minute protocol** | Engagement velocity is engineered (reply to every comment, 5–10 niche comments, budget set)? | |");
L.push("| **Metrics loop** | The 4 compounding signals tracked per platform + day-7/14/21/30 review that doubles down on winners? | |");
L.push("| **Anti-fluff / anti-bait** | Blocklist clear, no 'Agree? 👇', no guarantee claims, no engagement-bait? | |");
L.push("| **Sustainability** | Could a solo creator actually execute week two — or does the plan burn out after 5 days? | |");
L.push("| **Ship-readiness** | Would a stalled account get thousands of views if it followed this for 30 days? | |");
L.push("");
L.push("### 2.2 Creative judgment calls");
L.push("");
L.push("- Any 'reset' claim that overpromises (guaranteed views, instant virality)?");
L.push("- Any post that could run on any account (no niche specificity)?");
L.push("- Any cadence the user's stated time budget can't sustain?");
L.push("");
L.push("### 2.3 Verdict");
L.push("");
L.push("- All PASS and scorecard ≥ 35 → mark **PASS** and sign below.");
L.push("- Any FAIL (or a WARN you judge real) → mark **FIX NEEDED** and list concrete fixes per file.");
L.push("");
L.push(`> Auditor verdict: **PENDING** · Auditor: _(subagent)_ · Date: ${new Date().toISOString().slice(0, 10)}`);
L.push("");

writeFileSync(outPath, L.join("\n"), "utf8");

console.log(`✅ content-plan-audit.md → ${basename(outPath)} (${passes.length} PASS · ${warns.length} WARN · ${fails.length} FAIL)`);
for (const r of results.filter((r) => r.status !== "PASS")) {
  console.log(`   ${r.status === "FAIL" ? "❌" : "⚠️"} ${r.check}: ${r.detail}`);
}
if (fails.length) {
  console.error(`❌ ${fails.length} automated FAIL(s) — fix and re-run before spawning the content-plan-auditor.`);
  process.exit(1);
}
console.log("Automated checks clean — now spawn the content-plan-auditor subagent (see SKILL.md Stage 5) to complete the scorecard + verdict in content-plan-audit.md.");
process.exit(0);
