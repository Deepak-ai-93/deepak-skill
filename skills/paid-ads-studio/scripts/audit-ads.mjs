#!/usr/bin/env node
// The paid-ads-studio audit harness — the automated half of the ads-auditor
// gate. Scans a delivered ad pack folder and checks what a script CAN check:
// hook-first copy inside char limits with no fluff, a CTA per placement,
// self-verified prompts, a sane forecast, a blueprint with the right platform
// structure, and a dated compliance checklist. Writes ad-audit.md with the
// automated verdicts + an AUDITOR section for the subagent to complete
// (hook worthiness, creative strength, judgment calls). Exit 1 on any FAIL.
//
// Usage:
//   node audit-ads.mjs --pack <campaign-folder> [--out ad-audit.md]
//
// The folder should contain: copy.md, prompts.md, forecast.md,
// campaign-blueprint.md, guidelines-checklist.md, cost-plan.md,
// launch-checklist.md, campaign-brief.md (subsets are allowed — missing
// files are reported as FAIL but the audit continues).
//
// Exit codes: 0 = all automated checks PASS, 1 = any FAIL, 2 = usage error.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, basename, join } from "node:path";

// ─── brand banner (deepak-skill · crafted by Deepak) ────────────────────────
const BRAND_LINE = "═".repeat(56);
const banner = (label) =>
  `\n${BRAND_LINE}\n  🎬 deepak-skill — crafted by Deepak\n  skill: paid-ads-studio · ${label}\n${BRAND_LINE}\n`;
console.log(banner("audit-ads.mjs"));

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
  console.error("Usage: node audit-ads.mjs --pack <campaign-folder> [--out ad-audit.md]");
  process.exit(2);
}
const packDir = resolve(process.cwd(), packArg);
const outPath = resolve(process.cwd(), opt("out", "ad-audit.md"));
if (!existsSync(packDir)) {
  console.error(`❌ Pack folder not found: ${packDir}`);
  console.error("   Pass the campaign folder that holds copy.md / prompts.md / forecast.md / blueprint / etc.");
  process.exit(2);
}

const read = (f) => (existsSync(join(packDir, f)) ? readFileSync(join(packDir, f), "utf8") : null);

// ─── anti-fluff + limits (shared with ad-copy.mjs — keep in sync) ──────────
const FLUFF = [
  "unlock", "game-changer", "game changer", "revolutionary", "amazing", "incredible",
  "stunning", "mind-blowing", "world-class", "best-in-class", "cutting-edge",
  "state-of-the-art", "revolutionize", "transform your", "supercharge", "skyrocket",
  "guaranteed", "100% free", "act now", "limited time only", "don't miss out",
  "!!", "!!!", "free money", "miracle", "magic",
];
const LIMITS = {
  "meta-primary": 125, "meta-headline": 40, "meta-description": 30,
  "google-headline": 30, "google-description": 90,
};

// Hook-openers that make a first line hook-first (the ad-copy formulas start
// with one of these, or a benefit-led statement). The SUBAGENT judges true
// hook worthiness — this is a mechanical sanity check.
const HOOK_OPENERS = [
  "tired of", "nobody tells", "cold coffee", "the trick", "not anymore", "rated",
  "join", "stop", "3 reasons", "the whole list", "hot coffee", "fixes it",
  // Product-led PAS hooks from ad-copy.mjs: "<Product> — <benefit>" / "<Product>: <benefit>"
  /^[A-Z][\w&' ]+ — /, /^[A-Z][\w&' ]+: /, /^[A-Z][\w&' ]+\.[^.]*\.$/, /^Rated /, /^The /, /^Cold /, /^Hot /,
];

// ─── results collector ──────────────────────────────────────────────────────
const results = []; // { status: "PASS"|"FAIL"|"WARN", check, detail }
const add = (status, check, detail) => results.push({ status, check, detail });
let auditSections = []; // auditor-facing notes for the subagent

// --- check copy.md -----------------------------------------------------------
function auditCopy(copy) {
  if (!copy) return add("FAIL", "copy.md exists", "missing — no ad copy to audit");
  // Extract sections between "## <PLACEMENT>" headers. A naive split on
  // "## " is wrong because "### " also contains "## " — split on the full
  // header line instead and take the text up to the next "## " header.
  const headerRe = /^## ([A-Z-]+)\s*$/gm;
  const placements = [...copy.matchAll(headerRe)].map((m) => m[1]);
  if (!placements.length) return add("FAIL", "copy.md placements", "no '## PLACEMENT' sections found");
  add("PASS", "copy.md placements", placements.join(", "));
  let primaryCount = 0;
  const markers = [...copy.matchAll(headerRe)].map((m) => m.index);
  for (let idx = 0; idx < placements.length; idx += 1) {
    const start = markers[idx];
    const end = markers[idx + 1] ?? copy.length;
    const sec = copy.slice(start, end);
    const primary = (sec.match(/### Primary text\s*\n`([^`]+)`/) || [])[1];
    const cta = (sec.match(/### CTA\s*\n`([^`]+)`/) || [])[1];
    const desc = (sec.match(/### Description\s*\n`([^`]+)`/) || [])[1];
    const heads = [...sec.matchAll(/### Headlines[\s\S]*?\n([\s\S]*?)(?=\n### Description)/g)].map((m) => m[1])[0] || "";
    const headLines = [...heads.matchAll(/^\d+\. `([^`]+)`/gm)].map((m) => m[1]);
    const p = placements[idx];
    if (primary) {
      primaryCount += 1;
      const limit = p.startsWith("GOOGLE") ? LIMITS["google-description"] : LIMITS["meta-primary"];
      const lower = primary.toLowerCase();
      const fluff = FLUFF.find((f) => lower.includes(f));
      const openerHit = HOOK_OPENERS.some((o) => (o instanceof RegExp ? o.test(primary) : lower.startsWith(o)));
      if (primary.length > limit) add("FAIL", `${p} primary length`, `${primary.length} > ${limit} chars`);
      else add("PASS", `${p} primary length`, `${primary.length} ≤ ${limit}`);
      if (fluff) add("FAIL", `${p} fluff`, `"${fluff}"`);
      else add("PASS", `${p} anti-fluff`, "clean");
      if (!openerHit) add("WARN", `${p} hook-first`, "primary doesn't open with a known hook formula — subagent to judge");
      else add("PASS", `${p} hook-first`, "hook opener detected");
      auditSections.push(`${p} primary: "${primary}"`);
    }
    if (cta) add("PASS", `${p} CTA`, `"${cta}"`);
    else add("WARN", `${p} CTA`, "no CTA line found");
    if (desc && desc.length > (p.startsWith("GOOGLE") ? LIMITS["google-description"] : LIMITS["meta-description"])) {
      add("FAIL", `${p} description length`, `${desc.length} > limit`);
    }
    for (const h of headLines) {
      const limit = p.startsWith("GOOGLE") ? LIMITS["google-headline"] : LIMITS["meta-headline"];
      if (h.length > limit) add("FAIL", `${p} headline length`, `"${h}" (${h.length} > ${limit})`);
    }
    auditSections.push(`${p} headlines: ${headLines.slice(0, 3).join(" | ")}`);
  }
  add("PASS", "copy.md coverage", `${primaryCount}/${placements.length} placements have primary text`);
}

// --- check prompts.md ---------------------------------------------------------
function auditPrompts(prompts) {
  if (!prompts) return add("FAIL", "prompts.md exists", "missing — no creative prompt pack to audit");
  const videos = (prompts.match(/### Video Ad \d+/g) || []).length;
  const images = (prompts.match(/### Image Ad \d+/g) || []).length;
  // The builder writes "**verify:** ✅" — match the emoji on the verify line
  // regardless of the bold markers/spacing around it.
  const verified = (prompts.match(/✅/g) || []).length;
  const unverified = (prompts.match(/❌/g) || []).length;
  if (videos + images === 0) return add("FAIL", "prompts.md ads", "no Video Ad / Image Ad sections found");
  add("PASS", "prompts.md ads", `${videos} video + ${images} image`);
  if (unverified) add("FAIL", "prompts.md self-verify", `${unverified} prompt(s) flagged ❌ by the builder`);
  else if (verified === videos + images && verified > 0) add("PASS", "prompts.md self-verify", `${verified}/${videos + images} consistency-verified`);
  else add("WARN", "prompts.md self-verify", `${verified}/${videos + images} verified — re-run ad-prompts.mjs if unsure`);
  if (/## Before you start \(do ONCE\)/.test(prompts)) add("PASS", "prompts.md header", "ingredients + do-once notes present");
  else add("WARN", "prompts.md header", "no 'Before you start' header found");
}

// --- check forecast.md --------------------------------------------------------
function auditForecast(forecast) {
  if (!forecast) return add("FAIL", "forecast.md exists", "missing — no forecast to sanity-check");
  if (/## Scenarios/.test(forecast)) add("PASS", "forecast.md scenarios", "scenario table present");
  else add("FAIL", "forecast.md scenarios", "no '## Scenarios' section");
  const roas = (forecast.match(/ROAS/g) || []).length;
  const cpa = (forecast.match(/CPA/g) || []).length;
  if (roas || cpa) add("PASS", "forecast.md economics", `${cpa} CPA + ${roas} ROAS references`);
  if (/estimates, not guarantees/i.test(forecast)) add("PASS", "forecast.md honesty", "honesty note present");
  else add("WARN", "forecast.md honesty", "no 'estimates, not guarantees' note — add it");
  const base = forecast.match(/\| base \|[^\n]*\|/);
  if (base) { add("PASS", "forecast.md base case", base[0].replace(/\|/g, " · ").trim()); auditSections.push(`forecast base: ${base[0].replace(/\|/g, " · ").trim()}`); }
}

// --- check blueprint / compliance / cost / brief -----------------------------
function auditBlueprint(bp) {
  if (!bp) return add("FAIL", "campaign-blueprint.md exists", "missing");
  const metaOk = /Advantage\+/.test(bp);
  const googleOk = /Demand Gen/.test(bp) && /Performance Max|PMax/.test(bp);
  if (metaOk) add("PASS", "blueprint Meta", "Advantage+ audience setup referenced");
  else add("WARN", "blueprint Meta", "no Advantage+ mention");
  if (googleOk) add("PASS", "blueprint Google", "Demand Gen + Performance Max referenced");
  else add("WARN", "blueprint Google", "no Demand Gen + PMax combo found");
  if (/budget split|prospecting|retargeting/i.test(bp)) add("PASS", "blueprint budget split", "prospecting/retargeting split present");
  else add("WARN", "blueprint budget split", "no budget split found");
}
function auditCompliance(c) {
  if (!c) return add("FAIL", "guidelines-checklist.md exists", "missing");
  if (/verified as of/i.test(c)) add("PASS", "compliance dated", "checklist carries a 'verified as of' date");
  else add("FAIL", "compliance dated", "no 'verified as of' date — must be dated before launch");
  if (/synthetic|AI label|deepfake/i.test(c)) add("PASS", "compliance AI rules", "Meta/Google AI-content rules present");
  else add("WARN", "compliance AI rules", "no AI-content rules found");
}
function auditCost(cost) {
  if (!cost) return add("FAIL", "cost-plan.md exists", "missing");
  if (/kill|learning|ramp|scale/i.test(cost)) add("PASS", "cost plan rules", "ramp/learning/kill/scale rules present");
  else add("WARN", "cost plan rules", "no cost-management rules found");
}
function auditLaunch(lc) {
  if (!lc) return add("FAIL", "launch-checklist.md exists", "missing");
  if (/\[ \]|\[x\]|\[X\]/.test(lc)) add("PASS", "launch checklist", "manual checklist present");
  else add("WARN", "launch checklist", "no checkboxes found");
}

// ─── run ─────────────────────────────────────────────────────────────────────
const copy = read("copy.md");
const prompts = read("prompts.md");
const forecast = read("forecast.md");
auditCopy(copy);
auditPrompts(prompts);
auditForecast(forecast);
auditBlueprint(read("campaign-blueprint.md"));
auditCompliance(read("guidelines-checklist.md"));
auditCost(read("cost-plan.md"));
auditLaunch(read("launch-checklist.md"));
if (!read("campaign-brief.md")) add("WARN", "campaign-brief.md", "missing (recommended but not required for the audit)");

const fails = results.filter((r) => r.status === "FAIL");
const warns = results.filter((r) => r.status === "WARN");
const passes = results.filter((r) => r.status === "PASS");

// ─── write ad-audit.md ──────────────────────────────────────────────────────
const L = [];
L.push(`# Ad Audit — ${basename(packDir)}`);
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
L.push("### 2.1 Hook-worthiness scorecard (rate 1–5 each, /50 — a hook worth running scores ≥ 35)");
L.push("");
L.push("| Criterion | Ask | Score /5 |");
L.push("|---|---|---|");
L.push("| **Hook stops the scroll** | Would the first line / first 2 seconds of the ad stop a distracted scroller? | |");
L.push("| **Benefit is instant** | Is the #1 benefit (outcome) clear within the first sentence? | |");
L.push("| **Mechanism credibility** | Does the mechanism make the claim believable (not magic)? | |");
L.push("| **Proof present** | One concrete proof signal (reviews, spec, numbers, social proof)? | |");
L.push("| **CTA clarity** | Exactly one clear action, matching the landing page? | |");
L.push("| **Offer pull** | Is the offer compelling enough to click (discount, shipping, trial)? | |");
L.push("| **Audience fit** | Does the copy speak the target audience's language? | |");
L.push("| **Mute-first (video)** | Is the creative comprehensible without sound? | |");
L.push("| **Compliance-safe** | No overclaims, no fluff, AI-label where required? | |");
L.push("| **Platform fit** | Right format, aspect and length for each placement? | |");
L.push("");
L.push("### 2.2 Creative judgment calls");
L.push("");
L.push("- Copy: any primary/headline the script couldn't judge (hook strength, tone, offer logic)?");
L.push("- Prompts: any prompt that would render poorly (warped text, impossible action, brand drift)?");
L.push("- Forecast: does the base case clear the brief's target CPA/ROAS, or does the plan need adjusting?");
L.push("- Blueprint/compliance/cost: anything the script can't check (bid logic, policy drift, audience sense)?");
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
console.log(`✅ ad-audit.md → ${basename(outPath)} (${passes.length} PASS · ${warns.length} WARN · ${fails.length} FAIL)`);
for (const r of results.filter((r) => r.status !== "PASS")) {
  console.log(`   ${r.status === "FAIL" ? "❌" : "⚠️"} ${r.check}: ${r.detail}`);
}
if (fails.length) {
  console.error(`❌ ${fails.length} automated FAIL(s) — fix and re-run before spawning the ads-auditor.`);
  process.exit(1);
}
console.log("Automated checks clean — now spawn the ads-auditor subagent (see SKILL.md Stage 8) to complete the scorecard + verdict in ad-audit.md.");
process.exit(0);
