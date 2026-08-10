# Cost Plan — Brew & Co Tumbler Paid Launch

## Budget guardrails

- Daily budget: **$80** (Meta $50 + Google $30) — never exceed without a re-forecast.
- CPA kill rule: **$100 = 2.5× AOV**. Any creative/audience holding CPA > $100 after ≥2× AOV spend ($80) per asset gets paused.
- ROAS floor for scaling: **2.0× blended**. Below it → tighten, don't spend up.

## Ramp (days 1-3)

| Day | Action |
|---|---|
| 1 | Start at **50%** of final budget ($25 Meta / $15 Google); verify Pixel + CAPI + Google tag fire on a test purchase |
| 2-3 | Keep 50%; let learning run — **do not touch targeting or pause anything** |

## Learning phase

| Platform | Learning target | Rule |
|---|---|---|
| Meta | ≥50 conversions/week | Wait it out; scaling before learning ends misleads the algorithm |
| Google | ≥30 conversions/month per campaign | Same — no killing during learning |

## Kill / scale rules

| Situation | Action |
|---|---|
| CPA > $100 on an asset after $80 spend on it | Pause that asset; keep the rest of the ad set |
| Creative CTR < 0.8% after 2,000 impressions | Replace with the `Edit:` variant from `prompts.md` |
| ROAS ≥ 2.0× for 3 consecutive days | Increase budget **+20% every 3 days** while ROAS holds |
| ROAS < 1.0× for 5 days straight | Pause the placement/campaign, not the account — re-forecast with real numbers first |

## Creative rotation

- Refresh every **2-3 weeks** (Advantage+ burns creative fast). The pack ships 4 image + 3 video ads + `Edit:` variants = a built-in rotation bank.
- Run 3-5 distinct concepts per ad set; let the platform pick winners, then double down.

## Re-forecast after week 1

```bash
node scripts/forecast-ads.mjs --platform meta --objective sales --daily-budget 50 --aov 40 \
  --overrides cpm=9.5,ctr=0.017,cvr=0.032 --out forecast-week2.md
```
Plug the account's real CPM/CTR/CVR in — the benchmark estimates are replaced with actuals.
