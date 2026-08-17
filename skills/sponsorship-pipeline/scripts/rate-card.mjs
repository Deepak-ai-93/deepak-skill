#!/usr/bin/env node
// sponsorship-pipeline — the rate card calculator. Computes a defensible rate
// card from the creator's audience stats + the niche's CPM/RPM benchmarks
// (ranges, never promises — what to ASK, not what to guarantee). Writes
// rate-card.md with per-format rates + the benchmark sources + honest framing.
// Exits 1 when the inputs are missing or impossible (e.g. 0 followers).
//
// Usage:
//   node rate-card.mjs --niche "saas" --followers 50000 --platform youtube
//                      [--views 250000] [--cpm 14] [--rpm 6] [--out rate-card.md]
//
// Exit codes: 0 = clean, 1 = FAIL (bad inputs), 2 = usage error.
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

// ─── brand banner (deepak-skill · crafted by Deepak) ────────────────────────
const BRAND_LINE = "═".repeat(56);
const banner = (label) =>
  `\n${BRAND_LINE}\n  🎬 deepak-skill — crafted by Deepak\n  skill: sponsorship-pipeline · ${label}\n${BRAND_LINE}\n`;
console.log(banner("rate-card.mjs"));

// --- tiny arg parser (same style as the other skill scripts) ----------------
const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const needle = `--${name}`;
  const found = args.find((a) => a === needle || a.startsWith(`${needle}=`));
  if (found === undefined) return fallback;
  const eq = found.indexOf("=");
  return eq !== -1 ? found.slice(eq + 1) : args[args.indexOf(found) + 1];
};

const niche = opt("niche");
const followers = parseInt(opt("followers", "0"), 10);
const platform = opt("platform", "youtube");
const views = parseInt(opt("views", "0"), 10);
const cpmOverride = opt("cpm"); // optional explicit CPM
const rpmOverride = opt("rpm"); // optional explicit RPM

if (!niche || !followers) {
  console.error("Usage: node rate-card.mjs --niche <niche> --followers <n> [--platform youtube|instagram|tiktok|x] [--views <n>] [--cpm <n>] [--rpm <n>] [--out rate-card.md]");
  process.exit(2);
}
if (followers <= 0) {
  console.error("❌ followers must be > 0");
  process.exit(1);
}
if (views < 0) {
  console.error("❌ views must be ≥ 0");
  process.exit(1);
}

// Niche CPM/RPM benchmark ranges (USD, 2025-26 reporting — RANGES, not promises).
// These are what brands typically pay per 1000 impressions/views in the niche.
const NICHE_CPM = {
  "saas": [18, 35], "b2b": [18, 35], "finance": [15, 30], "money": [15, 30],
  "tech": [12, 25], "ai": [14, 30], "fitness": [8, 18], "health": [8, 16],
  "beauty": [10, 22], "fashion": [10, 20], "food": [8, 16], "travel": [8, 18],
  "gaming": [8, 16], "education": [10, 20], "parenting": [8, 16], "lifestyle": [8, 18],
  "real-estate": [12, 24], "ecommerce": [10, 20], "default": [8, 18],
};
const cpmRange = NICHE_CPM[niche.toLowerCase()] || NICHE_CPM.default;
const cpm = cpmOverride ? parseFloat(cpmOverride) : null;
const cpmLo = cpm ?? cpmRange[0];
const cpmHi = cpm ?? cpmRange[1];
const rpm = rpmOverride ? parseFloat(rpmOverride) : cpmLo * 0.4; // RPM ≈ 40% of CPM (creator's cut, honest estimate)

// Estimate reachable impressions from followers (platform factor) + views.
const PLATFORM_FACTOR = { youtube: 0.6, instagram: 0.4, tiktok: 0.5, x: 0.5 };
const factor = PLATFORM_FACTOR[platform.toLowerCase()] || 0.5;
const reach = Math.max(followers * factor, views);

const rateLo = Math.round((reach / 1000) * cpmLo);
const rateHi = Math.round((reach / 1000) * cpmHi);
const rpmRate = Math.round((reach / 1000) * rpm);

const L = [];
L.push("# Rate Card", "");
L.push(`**Niche:** ${niche} · **Platform:** ${platform} · **Followers:** ${followers.toLocaleString()}${views ? ` · **Views/mo:** ${views.toLocaleString()}` : ""}`);
L.push("");
L.push(`## Suggested rates (${new Date().toISOString().slice(0, 10)})`);
L.push("");
L.push(`| Deliverable | Low | Mid | High |`);
L.push(`|---|---|---|---|`);
L.push(`| **Integrated video/post mention** | $${rateLo.toLocaleString()} | $${Math.round((rateLo + rateHi) / 2).toLocaleString()} | $${rateHi.toLocaleString()} |`);
L.push(`| **Dedicated sponsored video/post** | $${Math.round(rateLo * 1.5).toLocaleString()} | $${Math.round((rateLo + rateHi) * 0.75).toLocaleString()} | $${Math.round(rateHi * 1.5).toLocaleString()} |`);
L.push(`| **Bundle (mention + dedicated + newsletter/IG story)** | $${Math.round(rateLo * 2).toLocaleString()} | $${Math.round((rateLo + rateHi) * 1.2).toLocaleString()} | $${Math.round(rateHi * 2).toLocaleString()} |`);
L.push("");
L.push(`## How this was computed`);
L.push("");
L.push(`- **CPM benchmark (${niche} niche):** $${cpmLo}–$${cpmHi} per 1,000 impressions (${cpm ? "your explicit value" : "2025–26 niche range"})`);
L.push(`- **Reachable impressions:** ~${reach.toLocaleString()}/mo (${followers.toLocaleString()} followers × ${factor} platform factor${views ? `, or ${views.toLocaleString()} monthly views` : ""})`);
L.push(`- **Rate = reachable impressions ÷ 1000 × CPM** → $${rateLo.toLocaleString()}–$${rateHi.toLocaleString()}`);
L.push(`- **RPM (creator's cut estimate):** ~$${rpm.toLocaleString()} per 1,000 impressions → $${rpmRate.toLocaleString()}/mo at current reach`);
L.push("");
L.push(`## Honest framing (read this before sending anything)`);
L.push("");
L.push(`- These are **ranges to ASK, not promises to make.** Never guarantee reach, views, or conversions in a pitch.`);
L.push(`- The niche range is a benchmark — your engagement rate, retention, and audience quality move the actual number. If your engagement is above niche average, anchor to the high end and justify it with the kit's proof.`);
L.push(`- Brands pay for **fit + proof**, not follower counts: the media kit's engagement numbers are what justify the rate.`);
L.push(`- Update the benchmarks as you close real deals — the best rate card is the one your actual closed deals validate.`);
L.push("");
L.push(`_Benchmark sources: 2025–26 creator-sponsorship CPM reporting. Verify against your niche's current rates before sending._`);

const outPath = resolve(process.cwd(), opt("out", "rate-card.md"));
writeFileSync(outPath, L.join("\n"), "utf8");
console.log(`✅ rate-card.md → ${outPath} — ${niche} niche, ~${reach.toLocaleString()} reach, $${rateLo.toLocaleString()}–$${rateHi.toLocaleString()} integrated rate`);
console.log("Next: write media-kit.md + outreach.md + tracking.md (see templates/) then run audit-sponsor.mjs → sponsor-auditor subagent.");
process.exit(0);
