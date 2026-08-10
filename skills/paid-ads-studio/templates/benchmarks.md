# Ad Benchmarks — 2026 launch-day starting points

These are the base values baked into `forecast-ads.mjs` (conservative/aggressive are derived: cost ×1.17/×0.83, CTR ×0.71/×1.29, CVR ×0.71/×1.25). They are **launch-day estimates** — refine with real account data after week 1 via `--overrides cpm=11,ctr=0.015,cvr=0.03`.

## Meta (Facebook + Instagram) — Advantage+ audiences

| Objective | Niche | Model | CPM (base) | CTR (base) | CVR (base) |
|---|---|---|---|---|---|
| Sales | ecommerce | CPM | $12 | 1.4% | 2.8% |
| Sales | saas | CPM | $15 | 1.1% | 2.0% |
| Sales | app | CPM | $10 | 1.6% | 4.0% |
| Sales | local | CPM | $9 | 1.4% | 3.5% |
| Leads | ecommerce | CPM | $11 | 1.4% | 7.0% (instant form) |
| Leads | saas | CPM | $12 | 1.2% | 5.5% |
| Leads | app | CPM | $9 | 1.6% | 8.0% |
| Leads | local | CPM | $8 | 1.5% | 6.5% |
| Traffic | any | CPM | $6-8 | 1.6-2.0% | — |

## Google Ads

| Campaign type | Objective | Model | Cost (base) | CTR (base) | CVR (base) |
|---|---|---|---|---|---|
| Search | Sales (ecommerce) | CPC | $5.26 | 2.8% | 2.8% |
| Search | Leads | CPC | $4.50 | 3.0% | 5.0% |
| Performance Max | Sales (blended) | CPM | $10 | 1.4% | 2.5% |
| Demand Gen | Sales (video-led) | CPM | $8 | 1.2% | 1.8% |
| Display | Sales | CPM | $3 | 0.46% | 1.2% |
| YouTube / Video | Awareness (CPV) | — | CPV $0.02-0.06 | VTR 15-30% | — |

## Reference points (context, from 2026 research)

- Meta: **≥50 conversions/week** + ~$50+/day for the Advantage+ learning phase. Creative refresh every 2-3 weeks.
- Google: **≥30 conversions/month** per campaign to exit learning. PMax accounts for ~45% of conversions across advertisers.
- Search ecommerce averages: CPC ~$5.26, CVR ~2.81%. Display: CTR 0.46%, CPC ~$0.63.
- Video specs: 1080p H.264/AAC; skippable 16:9 or 1:1; bumper 6s; non-skippable 15s; Shorts 9:16 ≤60s.
- Image specs: 1.91:1 → 1200×628 · 1:1 → 1200×1200 · 4:5 → 960×1200 · ≤5 MB (static ≤150 KB) · safe zone = center 80%.

## How to update the tables

Edit the `BENCHMARKS` object in `scripts/forecast-ads.mjs` (base values). Add a niche or campaign type by adding a key. After a campaign has run ≥7 days, re-forecast with real numbers:

```bash
node scripts/forecast-ads.mjs --platform meta --objective sales --daily-budget 50 --aov 40 --overrides cpm=9.5,ctr=0.017,cvr=0.032
```
