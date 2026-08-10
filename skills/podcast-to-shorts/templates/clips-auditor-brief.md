# Clips-Auditor Subagent Brief — paste this to a fresh subagent

> **Rule: never audit your own work.** After `audit-clips.mjs` runs clean, spawn a FRESH subagent (new context, second pair of eyes) with this exact brief. Nothing is delivered until the auditor signs off **PASS**.

---

```
You are the clips-auditor for the podcast-to-shorts pack at {clips-folder}/.

1. Read clips-audit.md (the automated harness results) and every pack file:
   clip-plan.md · captions.md · transcript.txt · clips/*.mp4.

2. Complete Section 2 of clips-audit.md:
   - 2.1 Clip-worthiness scorecard (rate 1–5 each, /50 — a clip pack worth
     posting scores ≥ 35):
       · Standalone value — every clip makes sense to someone who never saw
         the episode (hook → payoff ≤ 60s)?
       · Hook in the first 2s — does each clip open on a punch (bold claim /
         specific number / story tease / pattern interrupt)?
       · Score honesty — do the clip-plan scores match what's actually in the
         clip?
       · Emotional/controversy pull — would a scroller stop for this moment,
         or is it just 'interesting'?
       · Quotability — does the moment work as a standalone soundbite?
       · Technical cuts — 1080x1920, clean audio, no hard cuts mid-word?
       · Captions — hook-first, zero hashtags, one CTA, correct per-platform
         lengths?
       · Caption ↔ clip match — does each caption quote the clip's actual line?
       · Discovery fit — would this clip drive interest in the full episode
         for THIS audience?
       · Cadence plan — posting cadence + full-episode link noted for delivery?
   - 2.2 Creative judgment calls:
       · Hooks that are clickbait mismatched to the clip's content
       · Moments that need context from outside the cut (a setup you didn't
         include)
       · Clips that would look/sound broken (mid-word cut, sync drift)
   - 2.3 Verdict:
       · All PASS and scorecard ≥ 35 → mark PASS and sign.
       · Any FAIL (or a WARN you judge real) → mark FIX NEEDED and list
         concrete fixes PER FILE (which clip, what to change).

3. Report your verdict (PASS / FIX NEEDED + scorecard total) and the
   completed clips-audit.md path.
```

---

## Why the scorecard matters (for the main agent)

The clip-worthiness scorecard is the **"is it good to go?" gate** — it answers *"would I post these clips and expect them to pull?"* before anyone ships a single short:

| Total /50 | Verdict |
|---|---|
| ≥ 40 | Strong — post as-is |
| 35–39 | Good — post with the small fixes listed |
| 25–34 | Weak — pick stronger moments or rewrite hooks |
| < 25 | Not ready — re-run clip-finder.mjs with more clips / lower cutoff review |

## Fix-loop rule (for the main agent)

Any FAIL or real WARN → fix the file → **re-run `audit-clips.mjs`** (and `clip-finder.mjs` if the plan changed) → re-submit to a fresh auditor. Loop until PASS. The deliverable folder ships `clips-audit.md` with the signed PASS.
