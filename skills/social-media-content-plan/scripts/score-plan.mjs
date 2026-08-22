#!/usr/bin/env node
// score-plan.mjs — deterministic /35 scorecard for social-media-content-plan Stage 2
// Usage: node scripts/score-plan.mjs --scores 5 4 4 5 5 3 4
//        node scripts/score-plan.mjs --scores 5 4 4 5 5 3 4 --out validation.md
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

const BRAND_LINE = "=".repeat(56);
const banner = (label) => `\n${BRAND_LINE}\n  deepak-skill — crafted by Deepak\n  skill: social-media-content-plan · ${label}\n${BRAND_LINE}\n`;
const args = process.argv.slice(2);
if(!args.includes("--verdict-only")) console.log(banner("score-plan.mjs"));

const CRITERIA = [
  "Niche clarity",
  "Reachability",
  "Competition wedge",
  "Monetization",
  "Production feasibility",
  "Moat / why not copyable",
  "Time-to-signal"
];

function scoreList(){
  const i=args.indexOf("--scores");
  if(i!==-1){
    const nums=[];
    for(let j=i+1;j<args.length && !args[j].startsWith("--"); j++){
      if(/^[\d,\s]+$/.test(args[j])) nums.push(args[j]);
    }
    return nums.join(" ");
  }
  const eq=args.find(a=>a.startsWith("--scores="));
  return eq ? eq.slice(eq.indexOf("=")+1) : "";
}
const raw = scoreList().split(/[\s,]+/).filter(Boolean).map(s=>Number(s));
if(raw.length!==7 || raw.some(n=>!Number.isInteger(n)||n<1||n>5)){
  console.error("Usage: node scripts/score-plan.mjs --scores <7 numbers 1-5> [--out validation.md] [--verdict-only]\n   order: niche, reachability, competition, monetization, feasibility, moat, time-to-signal");
  process.exit(2);
}
const total=raw.reduce((a,b)=>a+b,0);
const verdict=total>=30?"BUILD":total>=25?"ITERATE":"PIVOT or KILL";
if(args.includes("--verdict-only")){ console.log(`${total}/35 -> ${verdict}`); process.exit(0); }
const rows=CRITERIA.map((c,i)=>`| ${i+1} | ${c} | ${raw[i]} |`).join("\n");
console.log(`\nScorecard — ${total}/35 -> verdict: ${verdict}`);
console.log(`(>=30 BUILD · 25-29 ITERATE · <25 PIVOT or KILL)`);
console.log(`\n| # | Criterion | Score |\n|---|---|---|\n${rows}\n| | **TOTAL** | **${total}/35** |`);

const outIdx=args.indexOf("--out");
const out=outIdx!==-1?args[outIdx+1]:undefined;
if(out && !out.startsWith("--")){
  const md=`# Validation — {Niche}

- **Verdict:** **${verdict}** (${total}/35) — computed by \`node scripts/score-plan.mjs\`
- **Date:** ${new Date().toISOString().slice(0,10)}

## Scorecard (1-5 each)

| # | Criterion | Score |
|---|---|---|
${rows}
| | **TOTAL** | **${total}/35** |

## Top 3 risks
1. {risk} — {why} — {watch}
2. {risk} — {why} — {watch}
3. {risk} — {why} — {watch}

## Kill criteria
- [ ] No sustainable channel at stated hours
- [ ] Broad niche (not narrow pillar)
- [ ] No user language
- [ ] Incumbents no complaints
- [ ] Earning math never clears
- [ ] Not willing to do first-60-min daily

## Earning sanity

| Input | Value |
|---|---|
| Niche CPM proxy | |
| Expected views / 30d | |
| Sponsor rate / CPM | |
| Followers/leads target | |
| Payback | |

## Kill guardrail
> If we do not reach **{X followers / Y leads / Z% completion}** by **day 30** we **iterate the pillar**.

## Validation moves

| Move | Status | Result |
|---|---|---|
| 5 DM interviews | | |
| Test week (7 posts) | | |
| Waitlist / lead magnet | | |

> Complete before pillars.md. Only on BUILD does calendar build. See templates/scorecard.md
`;
  writeFileSync(resolve(process.cwd(), out), md, "utf8");
  console.log(`\n validation scaffold -> ${out}`);
}
