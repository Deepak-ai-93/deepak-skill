# Example — Brew & Co Tumbler Paid Launch 🎬

A complete launch-ready paid campaign pack for a **$40 matte-black insulated tumbler** — generated with the `paid-ads-studio` skill pipeline (forecast first → consistency tokens → creatives → copy → plan → compliance → launch).

## What's in the pack

| File | What it is |
|---|---|
| `campaign-brief.md` | Locked brief: product, offer, audience, budget, KPIs |
| `forecast.md` | Scenario forecast (conservative/base/aggressive) — **generated** by `forecast-ads.mjs` |
| `ads-plan.json` | Input for `ad-prompts.mjs` (product block + 3 video + 4 image ads) |
| `prompts.md` | **Generated** — 7 self-verified copy-paste prompts (3 Veo 3.1 video + 4 image) |
| `copy-brief.json` | Input for `ad-copy.mjs` (benefit, mechanism, proof, offer, hook, platforms) |
| `copy.md` | **Generated** — per-placement ad copy, all within char limits, no fluff |
| `campaign-blueprint.md` | Meta (Advantage+ Sales) + Google (Demand Gen + PMax + Search) structure |
| `cost-plan.md` | Ramp, learning phase, kill/scale rules, creative rotation |
| `guidelines-checklist.md` | 2026 AI-content compliance (Meta + Google), dated |
| `launch-checklist.md` | Manual copy-paste launch order for both platforms |
| `ad-audit.md` | **Generated** by `audit-ads.mjs` — automated verdicts (28 PASS · 0 FAIL here) + the ads-auditor's hook-worthiness scorecard + verdict |

## Regenerate the generated files

```bash
cd skills/paid-ads-studio/examples/brew-co-launch
node ../../scripts/forecast-ads.mjs --platform meta --objective sales --daily-budget 50 --aov 40 --niche ecommerce --days 30 --margin 40 --out forecast.md
node ../../scripts/ad-prompts.mjs --plan ads-plan.json --out prompts.md
node ../../scripts/ad-copy.mjs --brief copy-brief.json --out copy.md
node ../../scripts/audit-ads.mjs --pack . --out ad-audit.md
```

All scripts exit 0 and print the 🎬 brand banner. `ad-prompts.mjs` self-verifies the verbatim product block in every prompt; `ad-copy.mjs` enforces char limits + anti-fluff (a violation exits 1); `audit-ads.mjs` is the automated half of the audit gate (exit 1 on any FAIL — the ads-auditor subagent completes the hook-worthiness scorecard and PASS/FIX NEEDED verdict in `ad-audit.md`).
