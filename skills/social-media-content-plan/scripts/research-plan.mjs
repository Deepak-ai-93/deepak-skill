#!/usr/bin/env node
// research-plan.mjs — keyless demand signals for social-media-content-plan Stage 1
// Fetches Reddit top-of-day + Google Trends RSS, writes research-brief scaffold
// Usage: node scripts/research-plan.mjs --niche "fitness for busy pros" --subreddits "fitness,Entrepreneur" --geo US --out research-brief.md
import { writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";

const BRAND_LINE = "=".repeat(56);
const banner = (label) => `\n${BRAND_LINE}\n  deepak-skill — crafted by Deepak\n  skill: social-media-content-plan · ${label}\n${BRAND_LINE}\n`;
console.log(banner("research-plan.mjs"));

const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const needle = `--${name}`;
  const found = args.find((a) => a === needle || a.startsWith(`${needle}=`));
  if (found === undefined) return fallback;
  const eq = found.indexOf("=");
  return eq !== -1 ? found.slice(eq + 1) : args[args.indexOf(found) + 1];
};

const NICHE = opt("niche", "this niche");
const SUBS = (opt("subreddits", "") || "").split(",").map(s=>s.trim().toLowerCase().replace(/^r\//,"")).filter(Boolean);
const GEO = opt("geo", "US");
const LIMIT = parseInt(opt("limit", "8"), 10);
const N_TRENDS = parseInt(opt("trends", "20"), 10);
const OUT = resolve(process.cwd(), opt("out", "research-brief.md"));

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";
async function getJson(url){
  const ctrl=new AbortController(); const to=setTimeout(()=>ctrl.abort(),12000);
  try{ const res=await fetch(url,{headers:{"User-Agent":UA},signal:ctrl.signal}); if(!res.ok) throw new Error(`HTTP ${res.status}`); return await res.json(); } finally{ clearTimeout(to); }
}
async function getText(url){
  const ctrl=new AbortController(); const to=setTimeout(()=>ctrl.abort(),12000);
  try{ const res=await fetch(url,{headers:{"User-Agent":UA},signal:ctrl.signal}); if(!res.ok) throw new Error(`HTTP ${res.status}`); return await res.text(); } finally{ clearTimeout(to); }
}
const decode = (s)=> s.replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&apos;/g,"'").replace(/&#(\d+);/g,(_,d)=>String.fromCharCode(Number(d)));

const redditPosts=[]; const failures=[];
for(const sub of SUBS){
  try{
    const data=await getJson(`https://www.reddit.com/r/${sub}/top.json?t=day&limit=${LIMIT*3}`);
    const posts=(data.data?.children||[]).map(c=>c.data).filter(p=>p&&!p.stickied&&p.title).sort((a,b)=>b.score-a.score).slice(0,LIMIT);
    for(const p of posts) redditPosts.push({sub,title:decode(p.title).trim(),score:p.score});
    console.log(`reddit r/${sub}: ${posts.length} posts`);
  }catch(e){ failures.push(sub); console.log(`reddit r/${sub}: SKIPPED (${e.message})`); }
}
const trendItems=[]; let trendsFailed=false;
try{
  const rss=await getText(`https://trends.google.com/trending/rss?geo=${GEO}`);
  const items=[...rss.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(m=>{
    const title=(m[1].match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/)||[])[1];
    const pub=(m[1].match(/<pubDate>([\s\S]*?)<\/pubDate>/)||[])[1];
    return {title:decode((title||"").trim()).replace(/^(?:Topic|Search):\s*/i,""), pub:(pub||"").trim()};
  });
  for(const it of items){ if(it.title) trendItems.push(it); if(trendItems.length>=N_TRENDS) break; }
  console.log(`google trends (${GEO}): ${trendItems.length} items`);
}catch(e){ trendsFailed=true; console.log(`google trends (${GEO}): SKIPPED (${e.message})`); }

const okSources=[];
if(redditPosts.length) okSources.push(`Reddit top-of-day (${[...new Set(redditPosts.map(p=>p.sub))].join(", ")})`);
if(trendItems.length) okSources.push(`Google Trends (${GEO})`);

const redditRows=redditPosts.map(p=>`| r/${p.sub} | ${p.score} | ${p.title.slice(0,110)} |`).join("\n");
const trendRows=trendItems.map((t,i)=>`| ${i+1} | ${t.title.slice(0,80)} | ${t.pub.slice(0,25)} |`).join("\n");

const md=`# Research Brief — ${NICHE}

- **Date:** ${new Date().toISOString().slice(0,10)}
- **Sources reached:** ${okSources.length?okSources.join(" · "):"none — agent must do web research"}
${failures.length?`- **Reddit skipped:** ${failures.join(", ")}`:""}
${trendsFailed?"- **Google Trends skipped**":""}
- **Next:** fill sections 2-3 per templates/research-brief.md, then score with score-plan.mjs.

## 1. Demand signals (dated + sourced)

### Reddit — top posts of the day
| r/ | Score | Title |
|---|---|---|
${redditRows || "| — | — | (no Reddit signal — add via web research) |"}

### Google Trends — Trending now (${GEO})
| # | Topic | Published |
|---|---|---|
${trendRows || "| — | — | (no Trends signal) |"}

## 2. Agent deep research (8 platforms — competitor teardown + channels + CPM)
| Signal | Source | Date | Why it matters |
|---|---|---|---|
| {e.g. no good tool for X mentioned everywhere} | {Hacker News / PH / X} | {date} | gap |
| {e.g. sponsor CPM $8-15 for niche} | {G2 / sponsorship benchmark} | {date} | earning anchor |
| {e.g. 3 similar accounts launched last month} | {Product Hunt} | {date} | competition |

## 3. Winner angle + positioning

**Winner:** 
**Why:** {best problem-to-effort x reachability}
**Positioning:** For {audience} who {needs}, this is {category} that {benefit}. Unlike {competitors}, it {difference}.

> Feeds scorecard (score-plan.mjs) -> pillars.md -> calendar.md. See templates/research-brief.md.
`;

writeFileSync(OUT, md, "utf8");
console.log(`\n research-brief -> ${OUT}`);
console.log(` signals: reddit ${redditPosts.length} · trends ${trendItems.length}`);
if(!redditPosts.length && !trendItems.length){ console.log("\n No source reachable — complete section 2 with web research."); process.exitCode=1; }
