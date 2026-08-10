#!/usr/bin/env node
// trend-hunt.mjs — no-API-key trending-signal hunter for the
// video-product-pipeline Stage 0. Fetches two free, keyless signals:
//   1. Reddit top-of-day posts from the niche's subreddits (real pain points,
//      the exact language people use, what is already going viral).
//   2. Google Trends "Trending now" RSS (what is rising in a region TODAY).
// Then writes a trend-brief.md scaffold the agent completes with brainstormed
// angles and the viral scorecard — the raw material for a million-view reel.
//
// Usage:
//   node scripts/trend-hunt.mjs --niche "personal finance" \
//     --subreddits "personalfinance,Entrepreneur,financialindependence" --geo US
//   node scripts/trend-hunt.mjs --niche psychology --geo IN --out trend/
//
// Options:
//   --niche <s>       label for the brief (default: "this niche")
//   --subreddits <s>  comma-separated subreddits (optional — skipped if empty)
//   --geo <cc>        Google Trends region code (default: US)
//   --limit <n>       posts kept per subreddit (default: 8)
//   --trends <n>      Google Trends items kept (default: 20)
//   --out <dir>       output folder for trend-brief.md (default: "output/trend")
//
// Every source is optional and failure-tolerant: unreachable sources are
// skipped with a warning and the brief still documents what was found. If ALL
// sources fail, exit code 1 — the agent must fall back to web research.
import { writeFileSync, mkdirSync } from "node:fs";
import { resolve, join } from "node:path";

const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  if (i === -1) return fallback;
  const inline = args[i].split("=")[1];
  if (inline !== undefined) return inline;
  return args[i + 1];
};

const NICHE = opt("niche", "this niche");
const SUBS = (opt("subreddits", "") || "")
  .split(",")
  .map((s) => s.trim().toLowerCase().replace(/^r\//, ""))
  .filter(Boolean);
const GEO = opt("geo", "US");
const LIMIT = parseInt(opt("limit", "8"), 10);
const N_TRENDS = parseInt(opt("trends", "20"), 10);
const OUT_DIR = opt("out", "output/trend");
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

const md = `# Trend Brief — ${NICHE}

- **Date:** ${new Date().toISOString().slice(0, 10)}
- **Sources reached:** ${okSources.length ? okSources.join(" · ") : "none — agent must do web research"}
${redditFailures.length ? `- **Reddit skipped:** ${redditFailures.join(", ")}` : ""}
${trendsFailed ? "- **Google Trends skipped** (region or network issue)" : ""}
- **Next:** fill sections 2–5, then the winner angle feeds \`video-product.md\`.

## 1. Signals found (dated + sourced)

### Reddit — top posts of the day (pain points + real language)
| r/ | Score | Title |
|---|---|---|
${redditRows || "| — | — | (no Reddit signal — add via web research) |"}

### Google Trends — "Trending now" (${GEO})
| # | Topic | Published |
|---|---|---|
${trendRows || "| — | — | (no Trends signal — add via web research) |"}

## 2. Agent web research (add platform-native signals)
| Signal | Source | Date | Why it matters |
|---|---|---|
| | | | |

## 3. Brainstormed angles (≥5 — hook-formula remix, audience lens, pain-first)
| # | Angle | Hook (≤8 words) | Hook formula | Viral score /35 |
|---|---|---|---|---|
| 1 | | | | |

## 4. Winner + why
**Winner:** 
**Why:** (highest score; curiosity gap tiebreak)

## 5. Format fit + risk
- **Format:** {word-pop / highlighter / 3d-editorial / card-listicle / chat-thriller / svg-ambient / micro-fiction / quiz-trap / day-counter / notification-drop / thread-court / documentary / aesthetic / montage}
- **Trend risk:** {rising vs decayed — expected shelf life}
- **Loop ending:** {last frame mirrors first — rewatch = second view}
`;

writeFileSync(join(OUT, "trend-brief.md"), md, "utf8");

// --- 4. summary + exit code ------------------------------------------------------
console.log(`\n✅ trend-brief.md → ${join(OUT, "trend-brief.md")}`);
console.log(`   signals: reddit ${redditPosts.length} · google trends ${trendItems.length}`);
if (!redditPosts.length && !trendItems.length) {
  console.log("\n❌ No source was reachable — complete section 2 with agent web research (TikTok Creative Center, X, YouTube Trending) before brainstorming.");
  process.exitCode = 1;
} else {
  console.log("\n✅ Signals harvested — brainstorm ≥5 angles, apply the viral scorecard, lock the winner.");
}
