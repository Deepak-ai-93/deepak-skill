#!/usr/bin/env node
// research-idea.mjs — no-API-key demand researcher for the vibe-code-webapp
// skill Stage 0. Fetches two free, keyless signals:
//   1. Reddit top-of-day posts from the niche's subreddits (real pain points,
//      the exact language users use, what already resonates).
//   2. Google Trends "Trending now" RSS (what is rising in a region TODAY).
// Then writes an idea-brief.md scaffold the agent completes with competitor
// research, brainstormed product angles and the SaaS scorecard — the raw
// material for a web app people actually want.
//
// Usage:
//   node scripts/research-idea.mjs --niche "saas for freelancers" \
//     --subreddits "freelance,Entrepreneur,webdev" --geo US --out output/idea
//
// Options:
//   --niche <s>       label for the brief (default: "this idea")
//   --subreddits <s>  comma-separated subreddits (optional — skipped if empty)
//   --geo <cc>        Google Trends region code (default: US)
//   --limit <n>       posts kept per subreddit (default: 8)
//   --trends <n>      Google Trends items kept (default: 20)
//   --out <dir>       output folder for idea-brief.md (default: "output/idea")
//
// Every source is optional and failure-tolerant: unreachable sources are
// skipped with a warning and the brief still documents what was found. If ALL
// sources fail, exit code 1 — the agent must fall back to web research.
import { writeFileSync, mkdirSync } from "node:fs";
import { resolve, join } from "node:path";

// ─── brand banner (deepak-skill · crafted by Deepak) ────────────────────────
const BRAND_LINE = "═".repeat(56);
const banner = (label) =>
  `\n${BRAND_LINE}\n  🎬 deepak-skill — crafted by Deepak\n  skill: vibe-code-webapp · ${label}\n${BRAND_LINE}\n`;
console.log(banner("research-idea.mjs"));

// --- tiny arg parser (--name value and --name=value forms) --------------------
const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const needle = `--${name}`;
  const found = args.find((a) => a === needle || a.startsWith(`${needle}=`));
  if (found === undefined) return fallback;
  const eq = found.indexOf("=");
  return eq !== -1 ? found.slice(eq + 1) : args[args.indexOf(found) + 1];
};

const NICHE = opt("niche", "this idea");
const SUBS = (opt("subreddits", "") || "")
  .split(",")
  .map((s) => s.trim().toLowerCase().replace(/^r\//, ""))
  .filter(Boolean);
const GEO = opt("geo", "US");
const LIMIT = parseInt(opt("limit", "8"), 10);
const N_TRENDS = parseInt(opt("trends", "20"), 10);
const OUT_DIR = opt("out", "output/idea");
const OUT = resolve(process.cwd(), OUT_DIR);

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";

async function getJson(url) {
  const ctrl = new AbortController();
  const to = setTimeout(() => ctrl.abort(), 12000);
  try {
    const res = await fetch(url, { headers: { "User-Agent": UA }, signal: ctrl.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(to);
  }
}

async function getText(url) {
  const ctrl = new AbortController();
  const to = setTimeout(() => ctrl.abort(), 12000);
  try {
    const res = await fetch(url, { headers: { "User-Agent": UA }, signal: ctrl.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.text();
  } finally {
    clearTimeout(to);
  }
}

const decode = (s) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(Number(d)));

// --- 1. Reddit top-of-day -----------------------------------------------------
const redditPosts = []; // { sub, title, score }
const redditFailures = [];
for (const sub of SUBS) {
  try {
    const data = await getJson(`https://www.reddit.com/r/${sub}/top.json?t=day&limit=${LIMIT * 3}`);
    const posts = (data.data?.children || [])
      .map((c) => c.data)
      .filter((p) => p && !p.stickied && p.title)
      .sort((a, b) => b.score - a.score)
      .slice(0, LIMIT);
    for (const p of posts) redditPosts.push({ sub, title: decode(p.title).trim(), score: p.score });
    console.log(`reddit r/${sub}: ${posts.length} posts`);
  } catch (e) {
    redditFailures.push(sub);
    console.log(`reddit r/${sub}: SKIPPED (${e.message})`);
  }
}

// --- 2. Google Trends "Trending now" RSS --------------------------------------
const trendItems = []; // { title, pub }
let trendsFailed = false;
try {
  const rss = await getText(`https://trends.google.com/trending/rss?geo=${GEO}`);
  const items = [...rss.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((m) => {
    const title = (m[1].match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/) || [])[1];
    const pub = (m[1].match(/<pubDate>([\s\S]*?)<\/pubDate>/) || [])[1];
    return { title: decode((title || "").trim()).replace(/^(?:Topic|Search):\s*/i, ""), pub: (pub || "").trim() };
  });
  for (const it of items) {
    if (it.title) trendItems.push(it);
    if (trendItems.length >= N_TRENDS) break;
  }
  console.log(`google trends (${GEO}): ${trendItems.length} items`);
} catch (e) {
  trendsFailed = true;
  console.log(`google trends (${GEO}): SKIPPED (${e.message})`);
}

// --- 3. write the brief scaffold -----------------------------------------------
const okSources = [];
if (redditPosts.length) okSources.push(`Reddit top-of-day (${[...new Set(redditPosts.map((p) => p.sub))].join(", ")})`);
if (trendItems.length) okSources.push(`Google Trends "Trending now" (${GEO})`);

mkdirSync(OUT, { recursive: true });

const redditRows = redditPosts
  .map((p) => `| r/${p.sub} | ${p.score} | ${p.title.slice(0, 110)} |`)
  .join("\n");
const trendRows = trendItems
  .map((t, i) => `| ${i + 1} | ${t.title.slice(0, 80)} | ${t.pub.slice(0, 25)} |`)
  .join("\n");

const md = `# Idea Brief — ${NICHE}

- **Date:** ${new Date().toISOString().slice(0, 10)}
- **Sources reached:** ${okSources.length ? okSources.join(" · ") : "none — agent must do web research"}
${redditFailures.length ? `- **Reddit skipped:** ${redditFailures.join(", ")}` : ""}
${trendsFailed ? "- **Google Trends skipped** (region or network issue)" : ""}
- **Next:** fill sections 2–4, then the winner feeds \`PRD.md\` (Stage 2).

## 1. Demand signals (dated + sourced)

### Reddit — top posts of the day (real pain points + user language)
| r/ | Score | Title |
|---|---|---|
${redditRows || "| — | — | (no Reddit signal — add via web research) |"}

### Google Trends — "Trending now" (${GEO})
| # | Topic | Published |
|---|---|---|
${trendRows || "| — | — | (no Trends signal — add via web research) |"}

## 2. Agent web research (competitors + pricing + similar tools)
| Signal | Source | Date | Why it matters |
|---|---|---|
| {e.g. "no good tool for X" mentioned everywhere} | {Hacker News / Product Hunt / X} | {date} | open gap or crowded market |
| {e.g. closest competitor pricing $9–29/mo} | {competitor site} | {date} | pricing anchor for the scorecard |
| {e.g. 3 similar apps launched last month} | {Product Hunt} | {date} | competition pressure |

## 3. Brainstormed product angles (≥5)
| # | Angle (product) | One-line pitch | Who it's for | Build effort (L/M/H) |
|---|---|---|---|---|
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |
| 4 | | | | |
| 5 | | | | |

## 4. Winner + why
**Winner:** 
**Why:** {best problem-to-effort ratio; most reachable buyers; weakest competition}

## 5. SaaS scorecard (fill during Stage 1 — 1–5 each, /35)
| Criterion | Score | Notes |
|---|---|---|
| Problem clarity (real, repeated pain) | | |
| Market size & reachability | | |
| Competition (differentiation) | | |
| Monetization (willingness to pay) | | |
| Technical feasibility (vibe-code-able) | | |
| Moat / why not copyable | | |
| Time-to-MVP (weeks) | | |
| **Total /35** | | |

> Status: feeds Stage 1 (evaluate) → Stage 2 (PRD approval gate) of the vibe-code-webapp skill.
`;

writeFileSync(join(OUT, "idea-brief.md"), md, "utf8");

// --- 4. summary + exit code ------------------------------------------------------
console.log(`\n✅ idea-brief.md → ${join(OUT, "idea-brief.md")}`);
console.log(`   signals: reddit ${redditPosts.length} · google trends ${trendItems.length}`);
if (!redditPosts.length && !trendItems.length) {
  console.log("\n❌ No source was reachable — complete section 2 with agent web research before brainstorming.");
  process.exitCode = 1;
} else {
  console.log("\n✅ Demand signals harvested — web-research competitors, brainstorm ≥5 angles, score the winner.");
}
