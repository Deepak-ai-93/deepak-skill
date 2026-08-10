# Video-Plan-Auditor Subagent Brief — paste this to a fresh subagent

> **Rule: never audit your own work.** After `audit-video-plan.mjs` runs clean, spawn a FRESH subagent (new context, second pair of eyes) with this exact brief. Nothing is delivered until the auditor signs off **PASS**.

---

```
You are the video-plan-auditor for the youtube-video-pipeline pack at
{pack-folder}/.

1. Read video-plan-audit.md (the automated harness results) and every pack
   file: video-brief.md · script.md · titles.md · thumbnail.md · metadata.md.

2. Complete Section 2 of video-plan-audit.md:
   - 2.1 Video-pack scorecard (rate 1–5 each, /50 — a pack worth producing
     scores ≥ 35):
       · Hook in the first 30s — does the script's opening state the payoff +
         raise a specific question new viewers care about?
       · Title ↔ content truth — does the winner title + thumbnail promise
         EXACTLY what the script delivers (no clickbait mismatch)?
       · Title pack depth — 10 variants, ≤ 60 chars, ≥ 4 formulas, no
         spam/ALL-CAPS?
       · Open-loop structure — loops opened in the first 2 minutes and ALL
         paid off by the end?
       · Thumbnail = one idea — one subject, one emotion, ≤ 5 words,
         160px-readable, matches the winner title?
       · Script CTA — is the subscribe/CTA earned (not begged)?
       · Metadata — description hook-first, chapters match script timestamps,
         tags from research, captions note?
       · Anti-fluff — every line informs/proves/entertains?
       · Search fit — do the locked search terms appear naturally in
         title/description/tags?
       · Channel fit — does the angle match this channel's audience + style?
   - 2.2 Creative judgment calls:
       · Would a new viewer stay past 0:30?
       · Any title variant that overpromises what the script can't deliver?
       · Any open loop left unpaid or a middle section that drags?
   - 2.3 Verdict:
       · All PASS and scorecard ≥ 35 → mark PASS and sign.
       · Any FAIL (or a WARN you judge real) → mark FIX NEEDED and list
         concrete fixes PER FILE.

3. Report your verdict (PASS / FIX NEEDED + scorecard total) and the
   completed video-plan-audit.md path.
```

---

## Why the scorecard matters (for the main agent)

The video-pack scorecard is the **"is it good to go?" gate** — it answers *"would I film/produce this video with this packaging?"* before anyone writes a script to camera:

| Total /50 | Verdict |
|---|---|
| ≥ 40 | Strong — produce as-is |
| 35–39 | Good — produce with the small fixes listed |
| 25–34 | Weak — fix the script/angle before producing |
| < 25 | Not ready — rework the brief + script + packaging |

## Fix-loop rule (for the main agent)

Any FAIL or real WARN → fix the file → **re-run `audit-video-plan.mjs`** (and `title-pack.mjs` if the titles changed) → re-submit to a fresh auditor. Loop until PASS. The deliverable folder ships `video-plan-audit.md` with the signed PASS.
