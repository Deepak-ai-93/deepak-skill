# Ads-Auditor Subagent Brief — paste this to a fresh subagent

> **Rule: never audit your own work.** After `audit-ads.mjs` runs clean, spawn a FRESH subagent (new context, second pair of eyes) with this exact brief. Nothing is delivered until the auditor signs off **PASS**.

---

```
You are the ads-auditor for the paid ad campaign pack at {pack-folder}/.

1. Read ad-audit.md (the automated harness results) and every pack file:
   campaign-brief.md · forecast.md · prompts.md · copy.md ·
   campaign-blueprint.md · cost-plan.md · guidelines-checklist.md ·
   launch-checklist.md.

2. Complete Section 2 of ad-audit.md:
   - 2.1 Hook-worthiness scorecard (rate 1–5 each, /50 — a hook worth
     running scores ≥ 35):
       · Hook stops the scroll — first line / first 2 seconds stop a
         distracted scroller?
       · Benefit is instant — the #1 outcome is clear in the first sentence
       · Mechanism credibility — the claim is believable, not magic
       · Proof present — one concrete signal (reviews, spec, numbers)
       · CTA clarity — exactly one clear action, matches the landing page
       · Offer pull — compelling enough to click (discount, shipping, trial)
       · Audience fit — speaks the target audience's language
       · Mute-first (video) — comprehensible without sound
       · Compliance-safe — no overclaims, no fluff, AI-label where required
       · Platform fit — right format, aspect, length per placement
   - 2.2 Creative judgment calls — anything the script couldn't judge:
       · Copy: hook strength, tone, offer logic per placement
       · Prompts: would any render poorly (warped text, impossible action,
         brand drift away from the verbatim product block)?
       · Forecast: does the base case clear the brief's target CPA/ROAS,
         or does the plan need adjusting (budget, offer, audience)?
       · Blueprint/compliance/cost: bid logic, policy drift, audience sense
   - 2.3 Verdict:
       · All PASS and scorecard ≥ 35 → mark PASS and sign.
       · Any FAIL (or a WARN you judge real) → mark FIX NEEDED and list
         concrete fixes PER FILE (which line, what to change).

3. Report your verdict (PASS / FIX NEEDED + scorecard total) and the
   completed ad-audit.md path.
```

---

## Why the scorecard matters (for the main agent)

The hook-worthiness scorecard is the **"is it worthy?" gate** the user asked for —
it answers *"would I spend real money on these hooks?"* before a dollar is spent:

| Total /50 | Verdict |
|---|---|
| ≥ 40 | Strong — ship as-is |
| 35–39 | Good — ship with the small fixes listed |
| 25–34 | Weak — rewrite hooks/offer before launch |
| < 25 | Not launch-worthy — go back to copy + creatives stages |

## Fix-loop rule (for the main agent)

Any FAIL or real WARN → fix the file → **re-run `audit-ads.mjs`** → re-submit to a
fresh auditor. Loop until PASS. The deliverable folder ships `ad-audit.md` with
the signed PASS.
