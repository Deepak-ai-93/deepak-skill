# Content Plan Scorecard — the go / no-go before the 30-day sprint

> **How to run it (Stage 2 of the upgraded skill):** score the niche + creator + goal 1-5 on 7 criteria, compute verdict with `scripts/score-plan.mjs` (deterministic), run kill criteria, sanity-check earning math, write `validation.md`. Present verdict + top 3 risks BEFORE the calendar is built.

---

## 1. Scorecard (1-5 each, /35)

| # | Criterion | What a 5 looks like | Score |
|---|---|---|---|
| 1 | **Niche clarity** | Narrow, repeated pain in audience words; they pay for workaround | 1-5 |
| 2 | **Reachability** | SOM of addressable followers + >=1 real channel you can sustain (see research) | 1-5 |
| 3 | **Competition wedge** | Crowded but incumbents have user-quoted complaints; you have angle | 1-5 |
| 4 | **Monetization** | Clear willingness to pay/follow/convert; CPM/sponsor rate anchored | 1-5 |
| 5 | **Production feasibility** | 30 days at stated time budget with installed companions; no impossible formats | 1-5 |
| 6 | **Moat / why not copyable** | Proof arsenal, data, POV, community lock-in | 1-5 |
| 7 | **Time-to-signal** | 14-day sprint can re-train model; first 7 days measurable | 1-5 |
| | **TOTAL /35** | | |

## 2. Verdict (deterministic)

```bash
node scripts/score-plan.mjs --scores 5 4 4 5 5 3 4           # -> verdict
node scripts/score-plan.mjs --scores 5 4 4 5 5 3 4 --out validation.md
```

| Total | Verdict | Meaning |
|---|---|---|
| >=30 | **BUILD** | Go. Build the 30-day pack. |
| 25-29 | **ITERATE** | Sharpen niche/pillar/hook weakest, re-score |
| <25 | **PIVOT or KILL** | Do NOT write calendar. Brainstorm new wedge |

## 3. Earning sanity (creator — 5-min math)

| Input | Value | Notes |
|---|---|---|
| Niche CPM proxy (from research) | $X | sponsor/paid-ads benchmark |
| Target followers / leads | Y | goal from wizard |
| Conversion (follower->lead->sale) | Z% | channel-dependent |
| Sponsor rate (if applicable) | $ per 1k views | from rate-card.mjs |
| Months to earning signal | N | <2 mo target |

Red flag: CPM * expected views < living number, or cadence burns out.

## 4. Kill criteria (ANY checked -> stop and talk)

- [ ] No channel you can sustain at stated hours
- [ ] "Niche" is broad ("fitness" not "fat-loss for busy pros")
- [ ] No user language backing the niche
- [ ] Incumbents no complaints + full coverage
- [ ] Earning math never clears at any reasonable rate
- [ ] Not willing to do first-60-min protocol daily

## 5. Kill guardrail

> Guardrail: if we do not reach **{X followers / Y leads / Z% avg completion}** by **day 30**, we **iterate the pillar** (not rebuild blind).

Also list top 3 risks + watch metric.

## 6. Validation moves (>=1 before/during sprint)

| Move | Proves | Effort |
|---|---|---|
| 5 DM interviews | Pain real + hook resonates | L |
| Test week (7 posts) | Reachability + hook win | L-M |
| Waitlist / lead magnet | Willingness to convert | L |
| Paid boost $20 on winner | CPM sanity | M |

---

## Output: `validation.md`

| Field | Value |
|---|---|
| Scores /35 | table §1 |
| Verdict | BUILD / ITERATE / PIVOT |
| Top 3 risks | risk — why — watch |
| Earning math | §3 table |
| Guardrail | §5 line |
| Moves planned/done | §6 |

Definition of done: verdict computed, kill checked, guardrail written, moves >=1. Only on BUILD (or explicit override) does Stage 3 (pillars+calendar) begin.
