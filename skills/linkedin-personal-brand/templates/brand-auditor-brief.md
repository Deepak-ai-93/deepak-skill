# Brand-Auditor Subagent Brief — paste this to a fresh subagent

> **Rule: never audit your own work.** After `audit-brand.mjs` runs clean, spawn a FRESH subagent (new context, second pair of eyes) with this exact brief. Nothing is delivered until the auditor signs off **PASS**.

---

```
You are the brand-auditor for the linkedin-personal-brand pack at
{brand-folder}/.

1. Read brand-audit.md (the automated harness results) and every pack file:
   voice-profile.md · bio.md · calendar.md · engagement.md.

2. Complete Section 2 of brand-audit.md:
   - 2.1 Brand-worthiness scorecard (rate 1–5 each, /50 — a brand pack worth
     posting scores ≥ 35):
       · Voice authenticity — does every post sound like the ACTUAL person
         (their words, their stories), not template-speak?
       · E-E-A-T in every post — does each post carry a specific proof element
         (number, story, outcome, client result)?
       · Hook in the first 2 lines — would the first 2 lines stop a LinkedIn
         scroller?
       · One idea, one CTA — one idea per post, exactly one CTA, no
         engagement-bait?
       · Anti-buzzword — blocklist clear across bio + calendar?
       · Calendar realism — 2–5 posts, varied roles, posting times set, CTA
         mapped per post?
       · Bio strength — headline ~220 chars with a hook; About story → proof
         → CTA?
       · Specific > generic — do posts reference real work, not 'Top 5 tips
         for success'?
       · Engagement plan — comment targets + how-to-comment (add ONE insight),
         connection note, monthly CTA?
       · Credibility floor — would a stranger trust this profile after 2
         minutes?
   - 2.2 Creative judgment calls:
       · Any post that could have been written by anyone (rewrite in their
         voice)
       · Any CTA that feels like begging or bait
       · Any claim that needs proof the person hasn't provided
   - 2.3 Verdict:
       · All PASS and scorecard ≥ 35 → mark PASS and sign.
       · Any FAIL (or a WARN you judge real) → mark FIX NEEDED and list
         concrete fixes PER FILE.

3. Report your verdict (PASS / FIX NEEDED + scorecard total) and the
   completed brand-audit.md path.
```

---

## Why the scorecard matters (for the main agent)

The brand-worthiness scorecard is the **"is it good to go?" gate** — it answers *"would the user actually post this under their real name?"* before anything ships:

| Total /50 | Verdict |
|---|---|
| ≥ 40 | Strong — post as-is |
| 35–39 | Good — post with the small fixes listed |
| 25–34 | Weak — fix voice/CTA gaps before posting |
| < 25 | Not ready — re-capture the voice and rewrite |

## Fix-loop rule (for the main agent)

Any FAIL or real WARN → fix the file → **re-run `audit-brand.mjs`** → re-submit to a fresh auditor. Loop until PASS. The deliverable folder ships `brand-audit.md` with the signed PASS.
