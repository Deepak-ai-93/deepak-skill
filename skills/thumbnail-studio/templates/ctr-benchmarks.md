# CTR benchmarks — reference for thumbnail-studio

Use these to judge the `ab-test.md` result. Benchmarks are **ranges for the video's context** (browse vs suggested vs search), not promises — a thumbnail's CTR is judged against the *channel's* baseline, not a universal number.

## What's normal

| Context | Weak CTR | Typical CTR | Strong CTR |
|---|---|---|---|
| **Browse (home feed)** | < 2% | 2–4% | 4–6%+ |
| **Suggested (up next)** | < 1.5% | 1.5–3% | 3–5%+ |
| **Search** | < 3% | 3–6% | 6–10%+ |

## The honest framing

- CTR is a *relative* metric: a channel with 30% browse CTR on a loyal audience and a channel with 3% on cold traffic are both healthy. **The number that matters is the lift** between your A/B variants — a 20–30% relative lift from one thumbnail over another is a real win; a 0.5pt absolute swing may be noise.
- Small channels get noisy data: a 100-impression test can't tell you anything. **Test on 1,000+ impressions per variant** (or ~1–2 weeks at your normal upload cadence) before declaring a winner.
- CTR without retention is churn: a clickbait thumbnail lifts CTR and murders retention + session time. The thumbnail must match the video's actual promise.

## Judging the A/B result

| Outcome | Decision |
|---|---|
| Variant B ≥ 15% relative lift over A, 1,000+ impressions each | **Winner** — ship B, then test B vs a new variant |
| Lift < 15% or impressions < 1,000 | **Keep testing** — the difference is noise; pick a more different execution |
| CTR up but retention/session time down | **Clickbait mismatch** — revert, fix the title/thubnail promise |

## The A/B rules (ship in ab-test.md)

1. **Test exactly 2 variants** — the two most different executions.
2. **Title stays identical** across the test — change only the thumbnail, or you can't read the result.
3. Same publish time, same promotion. One variable at a time.
4. Log the impressions + CTR per variant on the test date; judge at the window close.
