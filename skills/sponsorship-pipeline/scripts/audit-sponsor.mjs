#!/usr/bin/env node
// sponsorship-pipeline — the automated audit half of the sponsor-auditor gate.
// Scans a sponsorship pack (media-kit.md + rate-card.md + outreach.md +
// tracking.md) and checks everything a script can: media kit (niche, audience
// stats, engagement, offer, contact), rate card (CPM/RPM benchmarks, no
// "guaranteed" claims), outreach (≥ 2 pitches, each with problem/proof/offer/
// ask, FTC disclosure, NO {placeholder} text), tracking (pipeline + follow-up
// cadence). Writes sponsor-audit.md with automated verdicts + an AUDITOR
// section. Exit 1 on any FAIL.
//
// Usage:
//   node audit-sponsor.mjs --pack <sponsor-folder> [--out sponsor-audit.md]
//
// Exit codes: 0 = clean, 1 = FAIL, 2 = usage error.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, basename, join } from "node:path";

// ─── brand banner (deepak-skill · crafted by Deepak) ────────────────────────
const BRAND_LINE = "═".repeat(56);
const banner = (label) =>
  `\n${BRAND_LINE}\n  🎬 deepak-skill — crafted by Deepak\n  skill: sponsorship-pipeline · ${label}\n${BRAND_LINE}\n`;
console.log(banner("audit-sponsor.mjs"));

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
  console.error("Usage: node audit-sponsor.mjs --pack <sponsor-folder> [--out sponsor-audit.md]");
  process.exit(2);
}
const packDir = resolve(process.cwd(), packArg);
const outPath = resolve(process.cwd(), opt("out", "sponsor-audit.md"));
if (!existsSync(packDir)) {
  console.error(`❌ Sponsor folder not found: ${packDir}`);
  console.error("   Pass the pack folder (media-kit.md + rate-card.md + outreach.md + tracking.md)");
  process.exit(2);
}

const results = [];
const add = (status, check, detail) => results.push({ status, check, detail });
const read = (f) => (existsSync(join(packDir, f)) ? readFileSync(join(packDir, f), "utf8") : null);

const PLACEHOLDER = /\{[a-z_-]+\}/i;

// --- media kit ---------------------------------------------------------------
const kit = read("media-kit.md");
if (kit) {
  const checks = {
    "niche": /niche|audience|community/i,
    "audience stats": /followers|subscribers|audience/i,
    "engagement": /engagement|views|saves|replies|retention|ctr/i,
    "offer": /offer|format|placement|deliverable|sponsor/i,
    "contact": /contact|email|dm|booking|link/i,
  };
  const missing = Object.entries(checks).filter(([, re]) => !re.test(kit)).map(([k]) => k);
  if (!missing.length) add("PASS", "media kit", "niche, audience stats, engagement, offer and contact present");
  else add("WARN", "media kit", `media-kit.md missing: ${missing.join(", ")}`);
} else {
  add("FAIL", "media kit", "missing media-kit.md — the offer, not the resume");
}

// --- rate card ----------------------------------------------------------------
const rate = read("rate-card.md");
if (rate) {
  if (/CPM|RPM|benchmark|per 1,000/i.test(rate)) add("PASS", "rate card", "CPM/RPM benchmark-grounded rates present");
  else add("FAIL", "rate card", "rate-card.md lacks CPM/RPM benchmark grounding");
  // honesty check: flag actual promises ("guaranteed 100k views"), not the honesty-framing itself ("never guarantee reach")
  const promised = rate.match(/guarantee[ds]?\s+(?:you|the|up to)?\s*[\d,.]+\s*[km]?\s*(?:views|reach|impressions|subscribers|signups|conversions)|will\s+(?:get|deliver|reach|guarantee)\s+[\d,.]+/gi);
  if (promised) add("FAIL", "rate card honesty", `rate-card.md promises results: ${promised.join(" | ")} — rates are what to ASK, never guarantees`);
  else add("PASS", "rate card honesty", "no guaranteed-reach claims (only honest ranges)");
} else {
  add("FAIL", "rate card", "missing rate-card.md — run rate-card.mjs");
}

// --- outreach ----------------------------------------------------------------
const outreach = read("outreach.md");
if (outreach) {
  const pitches = (outreach.match(/^### Pitch \d+ /gm) || []).length;
  if (pitches >= 2) add("PASS", "outreach count", `${pitches} personalized pitch(es) — ≥ 2`);
  else add("FAIL", "outreach count", `only ${pitches} pitch(es) — need ≥ 2`);

  const placeholder = outreach.match(PLACEHOLDER);
  if (placeholder) add("FAIL", "no placeholders", `placeholder text survived: ${placeholder[0]} — personalize or cut`);
  else add("PASS", "no placeholders", "no {placeholder} text in the outreach");

  const pitchBlocks = outreach.split(/^### Pitch \d+ /gm).slice(1);
  let incomplete = 0;
  for (const p of pitchBlocks) {
    for (const marker of ["problem", "proof", "offer", "ask"]) {
      if (!new RegExp(`\\*\\*${marker}:`, "i").test(p)) incomplete++;
    }
  }
  if (!incomplete) add("PASS", "pitch structure", "every pitch has problem / proof / offer / ask");
  else add("WARN", "pitch structure", `${incomplete} missing problem/proof/offer/ask marker(s)`);

  if (/disclosure|#ad|#sponsored|#spon/i.test(outreach)) add("PASS", "FTC disclosure", "FTC disclosure (#ad / #sponsored) present in the outreach");
  else add("FAIL", "FTC disclosure", "no FTC disclosure — every sponsored post must be labeled");
} else {
  add("FAIL", "outreach", "missing outreach.md — the personalized pitches ship with the pack");
}

// --- tracking -----------------------------------------------------------------
const tracking = read("tracking.md");
if (tracking) {
  if (/prospect|contact|follow|status|rate|date/i.test(tracking)) add("PASS", "tracking", "pipeline columns + follow-up cadence present");
  else add("WARN", "tracking", "tracking.md exists but needs the pipeline (prospect → contact → follow-up → closed) + cadence");
} else {
  add("FAIL", "tracking", "missing tracking.md — the deal pipeline ships with the pack");
}

// ─── write sponsor-audit.md ──────────────────────────────────────────────────
const fails = results.filter((r) => r.status === "FAIL");
const warns = results.filter((r) => r.status === "WARN");
const passes = results.filter((r) => r.status === "PASS");

const L = [];
L.push(`# Sponsorship Audit — ${basename(packDir)}`);
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
L.push("### 2.1 Deal-worthiness scorecard (rate 1–5 each, /50 — a pack worth sending scores ≥ 35)");
L.push("");
L.push("| Criterion | Ask | Score /5 |");
L.push("|---|---|---|");
L.push("| **Sponsor's problem first** | Does the kit/pitch lead with the sponsor's problem + audience fit, not the resume? | |");
L.push("| **Proof over followers** | Engagement (views, saves, replies, retention) proves the audience — not just counts? | |");
L.push("| **Rate defensibility** | Would a sponsor find the rate reasonable for the niche (benchmark-grounded, no guarantees)? | |");
L.push("| **Personalization** | Every pitch names the sponsor's product/campaign and the specific fit? | |");
L.push("| **Offer clarity** | Formats, placements, deliverables, timeline spelled out? | |");
L.push("| **Honest numbers** | No invented stats, no promised reach — every number traceable? | |");
L.push("| **Compliance** | FTC disclosure present and correct (#ad / #sponsored placement)? | |");
L.push("| **Negotiation depth** | Anchoring, bundling, follow-up cadence ready to use? | |");
L.push("| **Tracking readiness** | Pipeline + per-outreach rows + follow-up dates usable today? | |");
L.push("| **Ship-readiness** | Would you send pitch #1 today? | |");
L.push("");
L.push("### 2.2 Creative judgment calls");
L.push("");
L.push("- Would a brand manager read the kit and immediately see their campaign's problem in it?");
L.push("- Is any pitch copy-paste-able to a different sponsor (the personalization test)?");
L.push("- Are the rates defensible against the niche's real range — high end justified by proof?");
L.push("");
L.push("### 2.3 Verdict");
L.push("");
L.push("- All PASS and scorecard ≥ 35 → mark **PASS** and sign below.");
L.push("- Any FAIL (or a WARN you judge real) → mark **FIX NEEDED** and list per-file fixes.");
L.push("");
L.push(`> Auditor verdict: **PENDING** · Auditor: _(subagent)_ · Date: ${new Date().toISOString().slice(0, 10)}`);
L.push("");

writeFileSync(outPath, L.join("\n"), "utf8");

console.log(`✅ sponsor-audit.md → ${basename(outPath)} (${passes.length} PASS · ${warns.length} WARN · ${fails.length} FAIL)`);
for (const r of results.filter((r) => r.status !== "PASS")) {
  console.log(`   ${r.status === "FAIL" ? "❌" : "⚠️"} ${r.check}: ${r.detail}`);
}
if (fails.length) {
  console.error(`❌ ${fails.length} automated FAIL(s) — fix and re-run before spawning the sponsor-auditor.`);
  process.exit(1);
}
console.log("Automated checks clean — now spawn the sponsor-auditor subagent (see SKILL.md Stage 6 / templates/sponsor-auditor-brief.md) to complete the scorecard + verdict in sponsor-audit.md.");
process.exit(0);
