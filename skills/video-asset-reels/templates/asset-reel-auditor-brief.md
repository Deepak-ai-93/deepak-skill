# Asset-Reel-Auditor Subagent Brief — paste this to a fresh subagent

> **Rule: never audit your own work.** After `audit-asset-reel.mjs` runs clean, spawn a FRESH subagent (new context, second pair of eyes) with this exact brief. Nothing is delivered until the auditor signs off **PASS**.

---

```
You are the asset-reel-auditor for the video-asset-reels pack at
{reel-folder}/.

1. Read asset-reel-audit.md (the automated harness results) and every pack
   file: storyboard.json · assets/cuts/* · the .html · output/*.

2. Complete Section 2 of asset-reel-audit.md:
   - 2.1 Asset-reel scorecard (rate 1–5 each, /50 — a reel worth posting
     scores ≥ 35):
       · Hook in beat 1 — does the opening asset + text stop the scroll in
         the first 2 seconds?
       · Asset ↔ beat fit — does each clip/image visually support its beat
         text (no mismatch)?
       · Cut quality — clean cuts, no mid-word edits, exact-length clips,
         cover-crop looks right?
       · Text overlay — 3–6 words per beat, readable, inside safe zones, no
         overflow?
       · Voiceover sync — does the voice land on the beat windows (FITS ✓,
         no drift)?
       · Motion polish — Ken Burns + text tweens smooth and intentional?
       · Retention pacing — hook → agitate → payoff → CTA with a visible
         progress bar?
       · Determinism — two identical renders identical (no SMIL / Math.random
         / audio-in-HTML)?
       · Caption pack — 500–900 chars per platform, no hashtags, hook-first,
         one CTA?
       · Mute-first clarity — does the story read without audio?
   - 2.2 Creative judgment calls:
       · Any asset that fights the beat (wrong mood, wrong subject)
       · Any cut that would visibly jump or feel off-beat
       · Any text that overflows or clashes with the asset
   - 2.3 Verdict:
       · All PASS and scorecard ≥ 35 → mark PASS and sign.
       · Any FAIL (or a WARN you judge real) → mark FIX NEEDED and list
         concrete fixes PER FILE.

3. Report your verdict (PASS / FIX NEEDED + scorecard total) and the
   completed asset-reel-audit.md path.
```

---

## Why the scorecard matters (for the main agent)

The asset-reel scorecard is the **"is it good to go?" gate** — it answers *"would I post a reel built from these assets?"* before anything ships:

| Total /50 | Verdict |
|---|---|
| ≥ 40 | Strong — post as-is |
| 35–39 | Good — post with the small fixes listed |
| 25–34 | Weak — fix asset/beat gaps before posting |
| < 25 | Not ready — rework the storyboard + cuts |

## Fix-loop rule (for the main agent)

Any FAIL or real WARN → fix the storyboard/composition → **re-run `audit-asset-reel.mjs`** → re-cut/re-render → re-submit to a fresh auditor. Loop until PASS. The deliverable folder ships `asset-reel-audit.md` with the signed PASS.
