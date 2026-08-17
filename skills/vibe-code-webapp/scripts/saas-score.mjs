#!/usr/bin/env node
// saas-score.mjs — deterministic SaaS scorecard calculator for the
// vibe-code-webapp skill's Stage 2 (SaaS validator). Scores the idea 1–5 on the
// 7 validator criteria, computes the /35 total, and returns the BUILD /
// ITERATE / PIVOT verdict — identical output every run, so the gate never
// depends on mood.
//
// Usage:
//   node scripts/saas-score.mjs --scores 5 4 4 5 5 3 4
//   node scripts/saas-score.mjs --scores 5 4 4 5 5 3 4 --out validation.md
//
//   --scores <7 numbers 1-5>   the seven criterion scores, in order:
//                              problem, market, competition, monetization,
//                              feasibility, moat, time-to-mvp
//   --out <path>               ALSO scaffold validation.md from
//                              templates/saas-validator.md (default: none)
//   --verdict-only             print just the verdict line (for scripting)
//
// Exit code 0 always when scores are valid; 2 on usage errors. The verdict is a
// data call (thresholds in templates/saas-validator.md §2), the KILL-criteria
// judgment stays with the agent.
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

// ─── brand banner (deepak-skill · crafted by Deepak) ────────────────────────
const BRAND_LINE = "═".repeat(56);
const banner = (label) =>
  `\n${BRAND_LINE}\n  🎬 deepak-skill — crafted by Deepak\n  skill: vibe-code-webapp · ${label}\n${BRAND_LINE}\n`;
// Keep --verdict-only machine-parseable (single line) — banner is human-only.
const args = process.argv.slice(2);
if (!args.includes("--verdict-only")) console.log(banner("saas-score.mjs"));
const opt = (name) => {
  const i = args.indexOf(`--${name}`);
  return i !== -1 ? args[i + 1] : undefined;
};
// --scores <7 numbers> consumes every following token until the next --flag,
// so both "--scores 5 4 4 5 5 3 4" and "--scores=5,4,4,5,5,3,4" work.
function scoreList() {
  const i = args.indexOf("--scores");
  if (i !== -1) {
    const nums = [];
    for (let j = i + 1; j < args.length && !args[j].startsWith("--"); j++) {
      if (/^[\d,\s]+$/.test(args[j])) nums.push(args[j]);
    }
    return nums.join(" ");
  }
  const eq = args.find((a) => a.startsWith("--scores="));
  return eq ? eq.slice(eq.indexOf("=") + 1) : "";
}

const CRITERIA = [
  "Problem clarity",
  "Market size & reachability",
  "Competition",
  "Monetization",
  "Technical feasibility",
  "Moat / why not copyable",
  "Time-to-MVP",
];

const raw = scoreList().split(/[\s,]+/).filter(Boolean).map((s) => Number(s));
if (raw.length !== 7 || raw.some((n) => !Number.isInteger(n) || n < 1 || n > 5)) {
  console.error(
    "❌ Usage: node scripts/saas-score.mjs --scores <7 numbers 1-5> [--out validation.md] [--verdict-only]\n" +
      "   order: problem, market, competition, monetization, feasibility, moat, time-to-mvp"
  );
  process.exit(2);
}

const total = raw.reduce((a, b) => a + b, 0);
const verdict = total >= 30 ? "BUILD" : total >= 25 ? "ITERATE" : "PIVOT or KILL";

if (args.includes("--verdict-only")) {
  console.log(`${total}/35 → ${verdict}`);
  process.exit(0);
}

const rows = CRITERIA.map((c, i) => `| ${i + 1} | ${c} | ${raw[i]} |`).join("\n");
console.log(`\nSaaS scorecard — ${total}/35 → verdict: ${verdict}`);
console.log(`(≥30 BUILD · 25–29 ITERATE · <25 PIVOT or KILL)`);
console.log(`\n| # | Criterion | Score |\n|---|---|---|\n${rows}\n| | **TOTAL** | **${total}/35** |`);

const out = opt("out");
if (out) {
  const md = `# Validation — {App Name}

- **Verdict:** **${verdict}** (${total}/35) — computed by \`node scripts/saas-score.mjs\`
- **Date:** ${new Date().toISOString().slice(0, 10)}

## Scorecard (1–5 each)

| # | Criterion | Score |
|---|---|---|
${rows}
| | **TOTAL** | **${total}/35** |

## Top 3 risks
1. {risk} — {why} — {watch for}
2. {risk} — {why} — {watch for}
3. {risk} — {why} — {watch for}

## Kill criteria check
- [ ] No usable distribution channel
- [ ] No user-language proof of the problem
- [ ] Incumbents have no complaints / full coverage
- [ ] SOM × price below minimum viable number
- [ ] Unit economics can't clear red flags
- [ ] Not willing to validate with real users

## Unit economics
| Input | Value |
|---|---|
| Price | |
| Variable cost / user / mo | |
| Gross margin | |
| CAC | |
| Payback period | |
| LTV (48 mo) | |

## Kill guardrail
> If we don't reach **{X}** by **{date}** we **{iterate / pivot / kill}**.

## Validation moves
| Move | Status | Result / date |
|---|---|---|
| 5 user interviews | | |
| Landing + waitlist | | |
| Fake-door | | |
| Pre-orders / pilot | | |

> Completing this file is Stage 2 of the skill. Only on BUILD (or user override)
> does Stage 3 (build pack) begin. Full rubric: \`templates/saas-validator.md\`.
`;
  writeFileSync(resolve(process.cwd(), out), md, "utf8");
  console.log(`\n✅ validation.md scaffold → ${out}`);
}
