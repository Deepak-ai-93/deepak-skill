# Storyboard-Auditor Subagent Brief — paste this to a fresh subagent

> **Rule: never audit your own work.** After `audit-storyboard.mjs` runs clean, spawn a FRESH subagent (new context, second pair of eyes) with this exact brief. Nothing is delivered until the auditor signs off **PASS**.

---

```
You are the storyboard-auditor for the hook-storyboard-retention pack at
{storyboard-folder}/.

1. Read storyboard-audit.md (the automated harness results) and the
   deliverable: storyboard.md (+ the .html composition if present).

2. Complete Section 2 of storyboard-audit.md:
   - 2.1 Storyboard-worthiness scorecard (rate 1–5 each, /50 — a storyboard
     worth producing scores ≥ 35):
       · Hook stops the scroll — would the first 2 seconds stop a distracted
         scroller (pattern interrupt, bold claim, or question)?
       · Watch-time engineering — do beats escalate and chain so viewers
         can't leave (open loops, mini-payoffs)?
       · Retention arc — hook → agitate → payoff → CTA/loop all present and
         paced for 15–45s?
       · One idea per beat — is each beat a single clause/visual?
       · Script ↔ timeline sync — would each clause map cleanly to a
         data-start/data-duration beat?
       · Mute-first clarity — does the story read without audio?
       · Payoff quality — does the payoff deliver what the hook promised (no
         bait-and-switch)?
       · CTA/loop strength — does the ending earn a follow/save or loop
         cleanly for rewatch?
       · Format fit — does the pacing suit the chosen platform/format?
       · Determinism — if built, would the composition render identically
         (GSAP-only, no SMIL/random)?
   - 2.2 Creative judgment calls:
       · Any hook that reads clichéd or generic for the niche
       · Any beat where the visual would be impossible or unclear
       · Any pacing that would feel slow at 1.5× scroll speed
   - 2.3 Verdict:
       · All PASS and scorecard ≥ 35 → mark PASS and sign.
       · Any FAIL (or a WARN you judge real) → mark FIX NEEDED and list
         concrete fixes PER BEAT.

3. Report your verdict (PASS / FIX NEEDED + scorecard total) and the
   completed storyboard-audit.md path.
```

---

## Why the scorecard matters (for the main agent)

The storyboard-worthiness scorecard is the **"is it good to go?" gate** — it answers *"would I build + render this storyboard?"* before anyone spends an hour in the editor:

| Total /50 | Verdict |
|---|---|
| ≥ 40 | Strong — build as-is |
| 35–39 | Good — build with the small fixes listed |
| 25–34 | Weak — fix hook/arc gaps before building |
| < 25 | Not ready — rework the hook + beats |

## Fix-loop rule (for the main agent)

Any FAIL or real WARN → fix the storyboard → **re-run `audit-storyboard.mjs`** → re-submit to a fresh auditor. Loop until PASS. The deliverable folder ships `storyboard-audit.md` with the signed PASS.
