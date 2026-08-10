# Reel-Auditor Subagent Brief — paste this to a fresh subagent

> **Rule: never audit your own work.** After `audit-reel.mjs` runs clean, spawn a FRESH subagent (new context, second pair of eyes) with this exact brief. Nothing is delivered until the auditor signs off **PASS**.

---

```
You are the reel-auditor for the text-motion-reels pack at {reel-folder}/.

1. Read reel-audit.md (the automated harness results) and the composition:
   the .html + output/*.mp4 + output/caption.md.

2. Complete Section 2 of reel-audit.md:
   - 2.1 Reel-worthiness scorecard (rate 1–5 each, /50 — a reel worth posting
     scores ≥ 35):
       · 3-second hook — does the opening frame create a curiosity gap (stat /
         question / tease)?
       · Mute-first clarity — does the motion carry the full message without
         audio?
       · Premium aesthetic — clean, minimal, no messy/overlapping/flashing
         text?
       · Motion quality — do transitions + camera moves feel intentional and
         smooth, not janky?
       · Typography — fluid (clamp), readable at phone size, consistent with
         the format spec?
       · Format fidelity — does it follow ONLY the chosen format's spec
         (palette/type/motion/effects)?
       · Voiceover sync — does the voice land on the exact beat windows (FITS
         ✓, no drift)?
       · Retention pacing — visual change every 1–2s, progress bar present,
         loop ending?
       · Caption pack — 500–900 chars per platform, no hashtags, hook-first,
         one CTA?
       · Determinism — two identical renders identical (hyperframes check
         passes)?
   - 2.2 Creative judgment calls:
       · Any text that would overflow or clip at phone size
       · Any animation that fights the message instead of supporting it
       · Any beat where the voice and text drift apart
   - 2.3 Verdict:
       · All PASS and scorecard ≥ 35 → mark PASS and sign.
       · Any FAIL (or a WARN you judge real) → mark FIX NEEDED and list
         concrete fixes PER FILE.

3. Report your verdict (PASS / FIX NEEDED + scorecard total) and the
   completed reel-audit.md path.
```

---

## Why the scorecard matters (for the main agent)

The reel-worthiness scorecard is the **"is it good to go?" gate** — it answers *"would I post this reel and expect it to hold retention?"* before anything ships:

| Total /50 | Verdict |
|---|---|
| ≥ 40 | Strong — post as-is |
| 35–39 | Good — post with the small fixes listed |
| 25–34 | Weak — fix motion/format gaps before posting |
| < 25 | Not ready — rework the wizard selection + composition |

## Fix-loop rule (for the main agent)

Any FAIL or real WARN → fix the composition → **re-run `audit-reel.mjs`** → re-render → re-submit to a fresh auditor. Loop until PASS. The deliverable folder ships `reel-audit.md` with the signed PASS.
