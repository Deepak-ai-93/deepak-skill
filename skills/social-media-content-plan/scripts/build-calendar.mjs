#!/usr/bin/env node
// social-media-content-plan — the deterministic 30-day calendar builder.
// Reads plan.json (creator, niche, audience, goal, startDate, platforms with
// per-platform cadence + formats, weighted pillars, hook bank, CTA bank) and
// writes calendar.md: one day block per day, one post row per platform that
// posts that day, with pillar / format / hook / CTA / metric-to-watch chosen
// deterministically (no randomness — same input, same calendar). Validates
// the plan hard: unknown platforms, cadence outside 1–7, pillars not summing
// to ~1, or a thin hook bank → exit 1 with the exact fix.
//
// Usage:
//   node build-calendar.mjs --plan plan.json --out calendar.md
//
// Exit codes: 0 = calendar written, 1 = plan validation failed, 2 = usage.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, basename } from "node:path";

// ─── brand banner (deepak-skill · crafted by Deepak) ────────────────────────
const BRAND_LINE = "═".repeat(56);
const banner = (label) =>
  `\n${BRAND_LINE}\n  🎬 deepak-skill — crafted by Deepak\n  skill: social-media-content-plan · ${label}\n${BRAND_LINE}\n`;
console.log(banner("build-calendar.mjs"));

// --- tiny arg parser (same style as the other skill scripts) ----------------
const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const needle = `--${name}`;
  const found = args.find((a) => a === needle || a.startsWith(`${needle}=`));
  if (found === undefined) return fallback;
  const eq = found.indexOf("=");
  return eq !== -1 ? found.slice(eq + 1) : args[args.indexOf(found) + 1];
};

const planArg = opt("plan");
if (!planArg) {
  console.error("Usage: node build-calendar.mjs --plan plan.json [--out calendar.md]");
  process.exit(2);
}
const planPath = resolve(process.cwd(), planArg);
const outPath = resolve(process.cwd(), opt("out", "calendar.md"));
if (!existsSync(planPath)) {
  console.error(`❌ plan.json not found: ${planPath}`);
  console.error("   Required shape: creator, niche, audience, goal, startDate (YYYY-MM-DD), platforms[], pillars[] (shares sum to 1), hooks[], ctas[]");
  process.exit(2);
}

// ─── known platforms + default metrics ──────────────────────────────────────
const KNOWN = ["instagram", "x", "linkedin", "tiktok", "youtube", "facebook", "threads"];
const DEFAULT_METRIC = {
  instagram: "watch time · saves · DM shares",
  x: "first-hour replies · reposts · dwell",
  linkedin: "dwell (5s+) · first-hour comments",
  tiktok: "completion · rewatch",
  youtube: "CTR · retention · completion",
  facebook: "comment depth · 60s+ views",
  threads: "replies · reposts",
};
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// ─── validate the plan ──────────────────────────────────────────────────────
const fails = [];
let plan;
try {
  plan = JSON.parse(readFileSync(planPath, "utf8"));
} catch (e) {
  console.error(`❌ plan.json is not valid JSON: ${e.message}`);
  process.exit(1);
}

const req = (obj, key, label) => {
  if (!obj || typeof obj[key] !== "string" || !obj[key].trim()) fails.push(`${label} missing ("${key}" must be a non-empty string)`);
};
req(plan, "creator", "plan.json");
req(plan, "niche", "plan.json");
req(plan, "audience", "plan.json");
req(plan, "goal", "plan.json");

// startDate
const startMs = Date.parse(plan.startDate || "");
if (!plan.startDate || Number.isNaN(startMs)) fails.push('startDate missing or invalid — use YYYY-MM-DD, e.g. "2026-08-17"');

// platforms
if (!Array.isArray(plan.platforms) || plan.platforms.length === 0 || plan.platforms.length > 6) {
  fails.push("platforms must be an array of 1–6 platform objects");
} else {
  for (const [i, p] of plan.platforms.entries()) {
    if (!p || typeof p !== "object") { fails.push(`platforms[${i}] must be an object`); continue; }
    const slug = String(p.platform || "").toLowerCase();
    if (!KNOWN.includes(slug)) fails.push(`platforms[${i}].platform "${p.platform}" unknown — use one of: ${KNOWN.join(", ")}`);
    const ppw = p.postsPerWeek;
    if (typeof ppw !== "number" || ppw < 1 || ppw > 7 || !Number.isInteger(ppw)) fails.push(`platforms[${i}].postsPerWeek must be an integer 1–7 (got ${ppw})`);
    if (!Array.isArray(p.formats) || p.formats.length === 0 || p.formats.some((f) => typeof f !== "string" || !f.trim())) {
      fails.push(`platforms[${i}].formats must be a non-empty array of strings (e.g. ["reel", "carousel"])`);
    }
    if (p.bestTime && typeof p.bestTime !== "string") fails.push(`platforms[${i}].bestTime must be a string`);
  }
}

// pillars (1–4, shares sum to ~1)
if (!Array.isArray(plan.pillars) || plan.pillars.length < 1 || plan.pillars.length > 4) {
  fails.push("pillars must be an array of 1–4 pillar objects {name, share}");
} else {
  const sum = plan.pillars.reduce((acc, p) => {
    if (!p || typeof p.name !== "string" || !p.name.trim()) { fails.push("every pillar needs a non-empty name"); return acc; }
    if (typeof p.share !== "number" || p.share <= 0) { fails.push(`pillar "${p.name}" needs share > 0 (e.g. 0.4)`); return acc; }
    return acc + p.share;
  }, 0);
  if (sum < 0.99 || sum > 1.01) fails.push(`pillar shares must sum to 1 — they sum to ${sum.toFixed(2)}`);
}

// hooks + ctas
if (!Array.isArray(plan.hooks) || plan.hooks.length < 6 || plan.hooks.some((h) => typeof h !== "string" || !h.trim())) {
  fails.push("hooks must be an array of ≥ 6 non-empty hook strings (the hook bank)");
}
if (!Array.isArray(plan.ctas) || plan.ctas.length < 3 || plan.ctas.some((c) => typeof c !== "string" || !c.trim())) {
  fails.push("ctas must be an array of ≥ 3 non-empty CTA strings");
}

if (fails.length) {
  console.error(`❌ plan.json validation failed (${fails.length}):`);
  for (const f of fails) console.error(`   - ${f}`);
  console.error("   Fix the plan and re-run. No calendar was written.");
  process.exit(1);
}

// ─── deterministic scheduling ───────────────────────────────────────────────
// seeded LCG so pillar picks are stable across runs
let seed = 42;
const rnd = () => {
  seed = (seed * 1103515245 + 12345) % 2147483648;
  return seed / 2147483648;
};

const pillars = plan.pillars;
const cum = [];
let acc = 0;
for (const p of pillars) { acc += p.share; cum.push(acc); }
const pickPillar = () => {
  const r = rnd();
  return pillars[cum.findIndex((c) => r <= c)];
};

const postsPerDay = (d, ppw) => Math.ceil((d * ppw) / 7) - Math.ceil(((d - 1) * ppw) / 7);

const postCounts = new Map(); // slug -> how many posts so far (for format/hook cycling)
const cyc = (arr, i) => arr[i % arr.length];

// ─── build the markdown ─────────────────────────────────────────────────────
const L = [];
L.push(`# 30-Day Content Plan — ${plan.creator}`);
L.push("");
L.push(`- **Niche:** ${plan.niche}`);
L.push(`- **Audience:** ${plan.audience}`);
L.push(`- **Goal:** ${plan.goal}`);
L.push(`- **Start date:** ${plan.startDate} (Day 1) · **Timezone for posting:** ${plan.platforms.map((p) => p.bestTime || "your audience's peak (check analytics)").filter((v, i, a) => a.indexOf(v) === i).join(" · ")}`);
L.push(`- **Pillars:** ${pillars.map((p) => `${p.name} (${Math.round(p.share * 100)}%)`).join(" · ")}`);
L.push("");
L.push("> **How to run Day N:** post at your platform's best time → run the **first-60-minute protocol** from `engagement.md` (reply to every comment, comment with ONE insight on 5–10 niche accounts) → log the 4 signals from `metrics.md`. **Day 7 / 14 / 21 / 30 are review days** — check `metrics.md`, double down on what the data says, kill what it doesn't.");
L.push("");

const [sy, sm, sd] = plan.startDate.split("-").map(Number); // Date.UTC months are 0-indexed
const start = new Date(Date.UTC(sy, sm - 1, sd));
const DAYS_N = 30;

for (let d = 1; d <= DAYS_N; d++) {
  const dayDate = new Date(start.getTime() + (d - 1) * 86400000);
  const iso = dayDate.toISOString().slice(0, 10);
  const wd = DAYS[dayDate.getUTCDay()];
  const isReview = [7, 14, 21, 30].includes(d);
  L.push(`## Day ${d} — ${wd} ${iso}${isReview ? " 🔍 review day" : ""}`);
  L.push("");

  const rows = [];
  for (const p of plan.platforms) {
    const slug = String(p.platform).toLowerCase();
    const n = postsPerDay(d, p.postsPerWeek);
    if (n === 0) continue;
    const count = postCounts.get(slug) || 0;
    postCounts.set(slug, count + n);
    for (let k = 0; k < n; k++) {
      const idx = count + k;
      const pillar = pickPillar();
      const hook = cyc(plan.hooks, idx * 2 + rows.length);
      const cta = cyc(plan.ctas, idx);
      const format = cyc(p.formats, idx);
      const metric = p.metric || DEFAULT_METRIC[slug] || "engagement";
      rows.push({ platform: p.platform, pillar: pillar.name, format, hook, cta, metric });
    }
  }
  if (!rows.length) {
    L.push("_Rest day — no scheduled post. Use the time for the engagement protocol (comment on 5–10 niche accounts) or batch-create ahead._");
    L.push("");
    continue;
  }
  L.push("| Platform | Pillar | Format | Hook | CTA | Metric to watch |");
  L.push("|---|---|---|---|---|---|");
  for (const r of rows) {
    L.push(`| **${r.platform}** | ${r.pillar} | ${r.format} | ${r.hook} | ${r.cta} | ${r.metric} |`);
  }
  L.push("");
}

L.push("---");
L.push("");
L.push("## The 14-day reset sprint reminder");
L.push("");
L.push("- **Days 1–14 are a re-training sprint**, not a content dump: same niche cluster, every post, no exceptions. The model builds a stable embedding from consistency + first-hour engagement velocity.");
L.push("- **Never delete underperformers** — every post is training signal. Keep them public and learn from the retention data.");
L.push("- **No cross-posting with watermarks / recycled formats** — adapt natively per platform or accept the distribution penalty.");
L.push("- **Day 7 review:** which pillar + format won? Double its share. **Day 14 review:** same, then start scaling the winners.");
L.push("- Views grow in tiers (100 → 1K → 10K), not overnight. The sprint's job is to get the model to re-test you — the calendar's job is to give it dense, consistent signals.");
L.push("");
L.push(`_Calendar generated deterministically by build-calendar.mjs from ${basename(planPath)} — same input, same calendar. Hand-tune hooks/CTAs as you go._`);

writeFileSync(outPath, L.join("\n"), "utf8");
console.log(`✅ calendar.md → ${basename(outPath)} (30 days, ${[...postCounts.values()].reduce((a, b) => a + b, 0)} posts across ${plan.platforms.length} platform(s))`);
console.log("Next: write strategy.md + pillars.md + engagement.md + metrics.md, then run the audit harness (audit-content-plan.mjs).");
process.exit(0);
