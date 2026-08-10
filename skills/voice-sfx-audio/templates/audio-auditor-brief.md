# Audio-Auditor Subagent Brief — paste this to a fresh subagent

> **Rule: never audit your own work.** After `audit-audio.mjs` runs clean, spawn a FRESH subagent (new context, second pair of eyes) with this exact brief. Nothing is delivered until the auditor signs off **PASS**.

---

```
You are the audio-auditor for the voice-sfx-audio pack at {audio-folder}/.

1. Read audio-audit.md (the automated harness results) and the deliverable:
   the audio plan .md (audio-plan.md / voiceover.md / mix-notes.md) +
   assets/ audio files.

2. Complete Section 2 of audio-audit.md:
   - 2.1 Audio-worthiness scorecard (rate 1–5 each, /50 — a mix worth
     shipping scores ≥ 35):
       · License safety — every engine + source commercial-safe (no CC-NC /
         BBC / F5-TTS / XTTS / Edge-TTS for monetized work)?
       · Voice quality — does the chosen voice suit the content (deep recipe
         applied for premium narration)?
       · Emotion fit — hook energetic, story calm — does the delivery match
         the beats?
       · Sync accuracy — does each voice line land in its beat window (no
         drift, no overflow)?
       · Ducking quality — does music duck cleanly under the voice
         (sidechain or data-volume)?
       · Mix levels — voice 100% / music ~30% / SFX ~80%?
       · Loudness — final mix ≈ -14 LUFS?
       · Attribution — every CC-BY source credited in the video description?
       · Local files — all audio frozen locally (no hot-linked CDNs at render
         time)?
       · SFX taste — SFX used sparingly and meaningfully (not a layer of
         noise)?
   - 2.2 Creative judgment calls:
       · Any voice line that would sound robotic or rushed (cap 1.15–1.35×)
       · Any SFX that fights the narration or the mood
       · Any license edge case worth double-checking before monetizing
   - 2.3 Verdict:
       · All PASS and scorecard ≥ 35 → mark PASS and sign.
       · Any FAIL (or a WARN you judge real) → mark FIX NEEDED and list
         concrete fixes PER FILE.

3. Report your verdict (PASS / FIX NEEDED + scorecard total) and the
   completed audio-audit.md path.
```

---

## Why the scorecard matters (for the main agent)

The audio-worthiness scorecard is the **"is it good to go?" gate** — it answers *"would I ship this mix on a monetized video?"* before anything gets muxed:

| Total /50 | Verdict |
|---|---|
| ≥ 40 | Strong — ship as-is |
| 35–39 | Good — ship with the small fixes listed |
| 25–34 | Weak — fix the mix/license gaps before shipping |
| < 25 | Not ready — rework the voice + mix |

## Fix-loop rule (for the main agent)

Any FAIL or real WARN → fix the plan/mix → **re-run `audit-audio.mjs`** → re-mix → re-submit to a fresh auditor. Loop until PASS. The deliverable folder ships `audio-audit.md` with the signed PASS.
