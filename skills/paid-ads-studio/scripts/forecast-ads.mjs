#!/usr/bin/env node
// The paid-ads-studio forecast engine — turns a campaign brief into a
// scenario forecast (conservative / base / aggressive) of impressions, clicks,
// conversions, CPA, revenue and ROAS, from built-in 2026 platform benchmarks.
//
// Usage:
//   node forecast-ads.mjs --platform meta --objective sales --daily-budget 50 --aov 40 [--niche ecommerce] [--campaign pmax] [--days 30] [--margin 40] [--overrides cpm=11,ctr=0.015,cvr=0.03] [--out forecast.md]
//
// Models:
//   CPM model  (meta + google pmax/demandgen/display): impressions = budget / CPM * 1000
//   CPC model  (google search):                       clicks      = budget / CPC
//
// Benchmarks are launch-day starting points from 2026 research — the skill
// labels them as estimates and supports --overrides to re-forecast with real
// account data after week 1. Estimates, never guarantees.
//
// Exit codes: 0 = OK, 1 = error, 2 = usage error.
import { writeFileSync } from "node:fs";
import { resolve, basename } from "node:path";

// ─── brand banner (deepak-skill · crafted by Deepak) ────────────────────────
const BRAND_LINE = "═".repeat(56);
const banner = (label) =>
  `\n${BRAND_LINE}\n  🎬 deepak-skill — crafted by Deepak\n  skill: paid-ads-studio · ${label}\n${BRAND_LINE}\n`;
console.log(banner("forecast-ads.mjs"));

// --- tiny arg parser (same style as the other skill scripts) ----------------
const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const needle = `--${name}`;
  const found = args.find((a) => a === needle || a.startsWith(`${needle}=`));
  if (found === undefined) return fallback;
  const eq = found.indexOf("=");
  return eq !== -1 ? found.slice(eq + 1) : args[args.indexOf(found) + 1];
};
const num = (v, fallback) => {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : fallback;
};

const platform = opt("platform", "meta").toLowerCase();
const objective = opt("objective", "sales").toLowerCase();
const campaign = opt("campaign", "").toLowerCase();
const niche = opt("niche", "ecommerce").toLowerCase();
const dailyBudget = num(opt("daily-budget"), NaN);
const aov = num(opt("aov"), 0);
const days = num(opt("days"), 30);
const marginPct = num(opt("margin"), 0);
const outPath = resolve(process.cwd(), opt("out", "forecast.md"));

if (!Number.isFinite(dailyBudget)) {
  console.error("Usage: node forecast-ads.mjs --daily-budget 50 [--platform meta|google] [--objective sales|leads|traffic] [--aov 40] [--niche ecommerce|saas|app|local] [--campaign search|pmax|demandgen|display] [--days 30] [--margin 40] [--overrides cpm=11,ctr=0.015,cvr=0.03] [--out forecast.md]");
  process.exit(2);
}

// ─── 2026 launch-day benchmark tables (base values per scenario; conservative
//     and aggressive are derived with the multipliers below) ─────────────────
const BENCHMARKS = {
  meta: {
    sales: {
      ecommerce: { model: "cpm", cpm: 12, ctr: 0.014, cvr: 0.028 },
      saas:      { model: "cpm", cpm: 15, ctr: 0.011, cvr: 0.020 },
      app:       { model: "cpm", cpm: 10, ctr: 0.016, cvr: 0.040 },
      local:     { model: "cpm", cpm: 9,  ctr: 0.014, cvr: 0.035 },
    },
    leads: {
      ecommerce: { model: "cpm", cpm: 11, ctr: 0.014, cvr: 0.070 },
      saas:      { model: "cpm", cpm: 12, ctr: 0.012, cvr: 0.055 },
      app:       { model: "cpm", cpm: 9,  ctr: 0.016, cvr: 0.080 },
      local:     { model: "cpm", cpm: 8,  ctr: 0.015, cvr: 0.065 },
    },
    traffic: {
      ecommerce: { model: "cpm", cpm: 8,  ctr: 0.018, cvr: 0.0 },
      saas:      { model: "cpm", cpm: 8,  ctr: 0.016, cvr: 0.0 },
      app:       { model: "cpm", cpm: 7,  ctr: 0.020, cvr: 0.0 },
      local:     { model: "cpm", cpm: 6,  ctr: 0.018, cvr: 0.0 },
    },
  },
  google: {
    sales: {
      search:    { model: "cpc", cpc: 5.26, ctr: 0.028, cvr: 0.028 },
      pmax:      { model: "cpm", cpm: 10, ctr: 0.014, cvr: 0.025 },
      demandgen: { model: "cpm", cpm: 8,  ctr: 0.012, cvr: 0.018 },
      display:   { model: "cpm", cpm: 3,  ctr: 0.0046, cvr: 0.012 },
    },
    leads: {
      search:    { model: "cpc", cpc: 4.5, ctr: 0.030, cvr: 0.050 },
      pmax:      { model: "cpm", cpm: 9,  ctr: 0.014, cvr: 0.045 },
      demandgen: { model: "cpm", cpm: 8,  ctr: 0.012, cvr: 0.030 },
      display:   { model: "cpm", cpm: 3,  ctr: 0.005, cvr: 0.020 },
    },
    traffic: {
      search:    { model: "cpc", cpc: 3.5, ctr: 0.032, cvr: 0.0 },
      pmax:      { model: "cpm", cpm: 8,  ctr: 0.016, cvr: 0.0 },
      demandgen: { model: "cpm", cpm: 7,  ctr: 0.014, cvr: 0.0 },
      display:   { model: "cpm", cpm: 3,  ctr: 0.005, cvr: 0.0 },
    },
  },
};

// Conservative / aggressive multipliers (derived from base — matches the
// worked example in ADS-PLAN.md §10.4).
const MUL = {
  base:         { cost: 1.0, ctr: 1.0, cvr: 1.0 }, // the raw benchmark
  conservative: { cost: 1.17, ctr: 0.71, cvr: 0.71 }, // worse CPM/CPC, lower CTR/CVR
  aggressive:   { cost: 0.83, ctr: 1.29, cvr: 1.25 }, // cheaper CPM/CPC, better CTR/CVR
};

const platformTable = BENCHMARKS[platform];
if (!platformTable) {
  console.error(`❌ Unknown platform "${platform}" — use meta or google.`);
  process.exit(2);
}
const objTable = platformTable[objective];
if (!objTable) {
  console.error(`❌ Unknown objective "${objective}" — use sales, leads or traffic.`);
  process.exit(2);
}
// Google picks a campaign type (default pmax); Meta always uses Advantage+.
let key = "ecommerce";
let table = objTable.ecommerce;
if (platform === "google") {
  const googleCampaigns = Object.keys(objTable);
  key = campaign || "pmax";
  if (!googleCampaigns.includes(key)) {
    console.error(`❌ Unknown campaign "${campaign}" — use search, pmax, demandgen or display.`);
    process.exit(2);
  }
  table = objTable[key];
} else if (objTable[niche]) {
  table = objTable[niche];
} else {
  console.warn(`⚠ Unknown niche "${niche}" — falling back to ecommerce benchmarks.`);
  table = objTable.ecommerce;
}

// --overrides "cpm=11,ctr=0.015,cvr=0.03" (or cpc=...) — real data after week 1
const overrides = {};
for (const pair of (opt("overrides", "") || "").split(",").filter(Boolean)) {
  const [k, v] = pair.split("=");
  if (k && v) overrides[k.trim()] = Number(v.trim());
}
const base = { ...table, ...overrides };

function scenario(name) {
  const m = MUL[name];
  const s = { ...base };
  if (s.model === "cpc") s.cpc = s.cpc * m.cost;
  else s.cpm = s.cpm * m.cost;
  s.ctr = s.ctr * m.ctr;
  s.cvr = s.cvr * m.cvr;
  return s;
}

// ─── the math ────────────────────────────────────────────────────────────────
function compute(s) {
  const budget = dailyBudget;
  let impressions, clicks;
  if (s.model === "cpc") {
    clicks = budget / s.cpc;
    impressions = clicks / s.ctr;
  } else {
    impressions = (budget / s.cpm) * 1000;
    clicks = impressions * s.ctr;
  }
  const conversions = clicks * s.cvr;
  const cpa = conversions > 0 ? budget / conversions : Infinity;
  const revenue = conversions * aov;
  const roas = budget > 0 ? revenue / budget : 0;
  // Learning-phase discount: first 7 days run at ~50% expected volume.
  const learningDays = Math.min(days, 7);
  const effectiveDays = days - learningDays * 0.5;
  return { ...s, budget, impressions, clicks, conversions, cpa, revenue, roas, effectiveDays };
}

const fmt = (n, d = 0) => (Number.isFinite(n) ? n.toLocaleString("en-US", { maximumFractionDigits: d, minimumFractionDigits: d }) : "—");
const money = (n) => (Number.isFinite(n) ? `$${fmt(n, 2)}` : "—");

const scenarios = { conservative: compute(scenario("conservative")), base: compute(scenario("base")), aggressive: compute(scenario("aggressive")) };

// ─── write forecast.md ──────────────────────────────────────────────────────
const L = [];
L.push(`# Ad Forecast — ${platform.toUpperCase()} · ${objective} (${platform === "google" ? key.toUpperCase() : "Advantage+"})`);
L.push("");
L.push(`**Daily budget:** $${dailyBudget} · **Days:** ${days} · **AOV:** ${aov ? `$${aov}` : "n/a"}${marginPct ? ` · **Margin:** ${marginPct}%` : ""} · **Niche:** ${niche}`);
L.push(`**Benchmark source:** 2026 launch-day starting points (${base.model === "cpc" ? "CPC model" : "CPM model"}) — estimates, not guarantees. Re-forecast with real data after week 1 via \`--overrides\`.`);
L.push("");
L.push("## Scenarios (per day)");
L.push("");
L.push("| Scenario | CPM/CPC | CTR | CVR | Impressions/day | Clicks/day | Conv/day | CPA | Revenue/day | ROAS |");
L.push("|---|---|---|---|---|---|---|---|---|---|");
for (const name of ["conservative", "base", "aggressive"]) {
  const s = scenarios[name];
  const cost = s.model === "cpc" ? `$${s.cpc.toFixed(2)}` : `$${s.cpm.toFixed(2)}`;
  L.push(`| ${name} | ${cost} | ${(s.ctr * 100).toFixed(2)}% | ${(s.cvr * 100).toFixed(2)}% | ${fmt(s.impressions, 0)} | ${fmt(s.clicks, 0)} | ${fmt(s.conversions, 2)} | ${money(s.cpa)} | ${money(s.revenue)} | ${s.roas.toFixed(2)}× |`);
}
L.push("");
L.push(`## 30-day totals (learning discount: first 7 days at ~50% expected volume)`);
L.push("");
L.push(`| Scenario | Spend | Conversions | Revenue | ROAS${marginPct ? " | Profit" : ""} |`);
L.push(`|---|---|---|---${marginPct ? "|---|" : ""}|`);
for (const name of ["conservative", "base", "aggressive"]) {
  const s = scenarios[name];
  const spend = s.budget * days;
  const conv = s.conversions * s.effectiveDays;
  const rev = conv * aov;
  const roas = rev / spend;
  const profit = marginPct ? rev * (marginPct / 100) - spend : null;
  L.push(`| ${name} | ${money(spend)} | ${fmt(conv, 0)} | ${money(rev)} | ${roas.toFixed(2)}×${marginPct ? ` | ${money(profit)}` : ""} |`);
}
L.push("");
L.push("## What this means");
const b = scenarios.base;
if (objective === "sales") {
  L.push(`- **Cold prospecting (${platform === "google" ? key : "Advantage+"}) typically starts at or below 1× ROAS.** The pack pairs it with a retargeting layer + the other platform to lift blended ROAS toward 2×+.`);
  L.push(`- Base case: ~${fmt(b.conversions * b.effectiveDays, 0)} conversions over ${days} days at an estimated CPA of ${money(b.cpa)}${aov ? ` (${(b.cpa / aov).toFixed(1)}× AOV — the kill rule in the cost plan is 2× AOV)` : ""}.`);
} else {
  L.push(`- Base case: ~${fmt(b.conversions * b.effectiveDays, 0)} ${objective} conversions over ${days} days at an estimated cost per result of ${money(b.cpa)}.`);
  L.push("- For leads/traffic, judge the campaign on cost per result and quality signals, not ROAS.");
}
L.push(`- **Refine after week 1:** plug real numbers in — \`--overrides cpm=9.5,ctr=0.017,cvr=0.032\` uses your account's actual CPM/CTR/CVR instead of benchmarks.`);
L.push("");
L.push("> **Honesty contract:** this is a planning estimate built from 2026 industry benchmarks, not a promise. Actual results depend on creative quality, offer strength, landing page, tracking accuracy and seasonality.");
L.push("");

writeFileSync(outPath, L.join("\n"), "utf8");

// ─── console summary ────────────────────────────────────────────────────────
console.log(`✅ Forecast → ${basename(outPath)}`);
console.log(`   base:  ${fmt(scenarios.base.impressions, 0)} imp/day · ${fmt(scenarios.base.clicks, 0)} clicks/day · ${fmt(scenarios.base.conversions, 2)} conv/day · CPA ${money(scenarios.base.cpa)}${objective === "sales" ? ` · ROAS ${scenarios.base.roas.toFixed(2)}×` : ""}`);
console.log(objective === "sales" ? "   notes: cold prospecting ≈ ≤1× ROAS; retargeting + second platform lift blended ROAS toward 2×+. Estimates, not guarantees." : "   notes: estimates, not guarantees — re-forecast with real data after week 1 via --overrides.");
process.exit(0);
