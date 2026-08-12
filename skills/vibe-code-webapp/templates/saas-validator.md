# SaaS Validator — the go/no-go gate before a line of code

> **How to run it (Stage 2 of the skill):** score the idea 1–5 on all 7 criteria,
> compute the verdict (with `scripts/saas-score.mjs` so the math is deterministic),
> run the **kill criteria** check, sanity-check the unit economics, and write
> `validation.md`. The verdict (BUILD / ITERATE / PIVOT) is presented to the user
> with the top 3 risks **before** any build pack is written.
>
> **Expert principle:** the validator exists to make the cheap kill. Killing a
> weak idea now costs one conversation; building it costs months. Be brutally
> honest — the user would rather hear "this won't work" today than "told you so"
> in three months.

---

## 1. The scorecard (1–5 each, /35)

Score every criterion with **evidence** (from the research playbook), not vibes.
A score without a source in `idea-brief.md` is a guess — say so.

| # | Criterion | What a 5 looks like | Score |
|---|---|---|---|
| 1 | **Problem clarity** | Repeated, concrete pain, stated in the user's own words; they're already paying for a workaround | 1–5 |
| 2 | **Market size & reachability** | Big enough SOM (§2.2) AND at least one real channel you can actually use (§2.3) | 1–5 |
| 3 | **Competition** | Crowded but all incumbents have obvious, user-quoted complaints — you have a differentiated wedge | 1–5 |
| 4 | **Monetization** | Clear willingness to pay; price anchored to competitor band; unit economics positive (§3) | 1–5 |
| 5 | **Technical feasibility** | Buildable fast on the locked stack by vibe-coding; no research-grade risk | 1–5 |
| 6 | **Moat / why not copyable** | Data, workflow lock-in, network effects, distribution — something real | 1–5 |
| 7 | **Time-to-MVP** | Weeks, not quarters; a demoable first version on a defined scope | 1–5 |
| | **TOTAL /35** | | |

## 2. Verdict (deterministic — run the script)

```bash
node scripts/saas-score.mjs --scores 5 4 4 5 5 3 4           # → verdict + table
node scripts/saas-score.mjs --scores 5 4 4 5 5 3 4 --out validation.md   # also scaffold validation.md
```

| Total | Verdict | Meaning |
|---|---|---|
| ≥ 30 | **BUILD** | Go. Write the pack. Keep the kill guardrail from §5. |
| 25–29 | **ITERATE** | Sharpen scope / wedge / pricing first — fix the weakest criterion, then re-score |
| < 25 | **PIVOT or KILL** | Do NOT write a build pack. Brainstorm the pivot with the user (same pain, new angle) |

## 3. Unit economics sanity (monetized apps — 5-minute math)

| Input | Value | Notes |
|---|---|---|
| Price point (from research §2.4) | ${x}/mo | anchor to competitors |
| Variable cost per user (hosting + AI tokens + support share) | ${y}/mo | include AI per-request costs — see `ai-logic.md` |
| Gross margin | {z}% | (price − var cost) / price — SaaS target ≥ 70–80% |
| Target CAC (your budget per acquisition) | ${c} | channel-dependent |
| Payback period | {n} months | CAC / (price − var cost) — target < 12 months |
| LTV (48-month assumption) | ${l} | monthly margin × 48 × retention factor |

**Red flag:** if gross margin < 60% or payback > 12 months, either the price is too
low, the variable cost is too high (AI-heavy apps often are — fix with caching/limits),
or the channel is too expensive. Adjust the *plan*, not the story.

## 4. Kill criteria (ANY of these → stop and talk, regardless of score)

- [ ] No distribution channel you can actually use (you have no network, no budget, no SEO runway)
- [ ] The "problem" has no user language backing it — only your assumption
- [ ] Incumbent competitors have no complaints and full coverage of the space
- [ ] SOM × price is below your minimum viable living number (research §2.2)
- [ ] Unit economics can't clear §3 red flags at any reasonable price
- [ ] You are not willing to validate with real users before/while building (§6)

If any box is checked, present the finding with evidence and let the user decide:
pivot the wedge, adjust scope, or kill it. **The validator's job is to surface this
before the build pack, not after.**

## 5. Kill guardrail (goes into the PRD, stays with the build)

Write the number that proves failure so you can stop early:

> **Guardrail:** if we don't reach **{X} activated users / paid subscribers / weekly
> active users}** by **{date / milestone}**, we **{iterate the wedge / pivot / kill}**.

Also add: which top 3 risks would kill this, and what you'll watch.

## 6. Validation moves (do at least 1–2 before or during the build — they're cheap)

| Move | What it proves | Effort |
|---|---|---|
| **5 user interviews** (friends-of-friends, communities) | Pain is real; they'd pay; which feature sells it | L |
| **Landing page + waitlist** (from the design pack) | Reachability + copy resonance | L–M |
| **Fake-door test** (button that says "coming soon" → capture intent) | Click-through willingness | L |
| **Pre-orders / deposits** | Willingness to pay with real money | M |
| **Paid pilot with 1–3 target users** | The #1 flow works and they pay for it | M |

**Expert rule:** the #1 cause of dead SaaS is building for a persona you never
talked to. One interview beats one feature. Evidence from these moves feeds
`MEMORY.md` and the `build-report.md`.

---

## Output: `validation.md`

| Field | Value |
|---|---|
| Scores (/35) | {table from §1} |
| Verdict | BUILD / ITERATE / PIVOT |
| Top 3 risks | {risk} — {why} — {watch for} |
| Unit economics | {§3 table} |
| Kill guardrail | {§5 line} |
| Validation moves planned/done | {§6 list with dates + results} |

**Definition of done for the validator:** verdict computed by `saas-score.mjs`,
kill criteria checked honestly, guardrail written, validation moves ≥ 1. Present to
the user → only on **BUILD** (or user's explicit override after seeing the risks)
does Stage 3 (build pack) begin.
