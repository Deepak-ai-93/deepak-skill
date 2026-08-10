---
name: podcast-to-shorts
description: Turn long-form podcast or video content into viral-ready vertical shorts (Reels / TikTok / Shorts) — transcript → find the highest-virality moments → write per-clip hooks + captions → cut the clips with FFmpeg → sync captions. Includes a clip-scoring script (transcript analysis → ranked moments with timestamps), FFmpeg cut commands, and a Deepak-branded pipeline that reuses the repo's reel/caption conventions.
---

# skill: podcast-to-shorts

**Name:** Podcast-to-Shorts — long-form → viral vertical clips
**Description:** Ingests a **podcast/video transcript** (or audio/video file), scores every moment for **virality** (hook strength, emotion, standalone value, controversy, quotability), picks the top clips, writes a **hook + caption per clip**, and produces **ready-to-run FFmpeg cut commands** for vertical 9:16 output — plus the repo's standard audit before delivery. One hour of content → 5–10 short-form posts that drive discovery back to the full episode.

---

## The quality bar (non-negotiable — read before anything else)

| Rail | Rule |
|---|---|
| **Clip = standalone value** | Every clip must make sense to someone who NEVER saw the episode: hook in the first 2 seconds, payoff inside 60 seconds, no context needed. If a clip needs setup you didn't cut, it's not a clip. |
| **Virality before length** | Score beats by hook strength + emotion + controversy + quotability + standalone value (script does the scoring). Never clip "interesting" — clip "arguable". A 25s clip that stops the scroll beats a 60s one that doesn't. |
| **Hook in the first 2s** | Every short starts with a punch: a bold claim, a specific number, a story tease, or a pattern interrupt — never "So in this episode we talked about…". |
| **Captions + safe zones** | On-screen captions on every clip (most views are sound-off); text inside 9:16 safe zones (x 8–92%, y 15–85%); accurate to the audio. |
| **Deliverability of output** | Deliver: `clips/` folder (one MP4 per clip at 1080×1920) + `captions.md` (hook-first caption per platform, no hashtags) + `clip-plan.md` (score table). |

---

## When to use

- "Turn this podcast episode into 5 shorts"
- "Clip the best moments from this video/audio file"
- "Make TikTok/Reels/Shorts from our long-form content"
- "Which 3 moments from this episode would go viral?"

**Complements:** `video-asset-reels` (this skill's output can feed its pipeline) · `voice-sfx-audio` (add music/SFX under clips) · `hook-storyboard-retention` (hook formulas).

---

## Workflow (7 stages)

### Stage 1 — Analyze the brief (ask ≤3 questions if vague)
Extract: **source** (transcript file, audio file, video file, or episode link) · **number of clips** (default 5) · **platforms** (TikTok / Reels / Shorts — same 9:16, different caption styles) · **voice/audience** (the podcast's POV so hooks match) · **brand** (any on-screen name/lower-third?).

If the source is an audio/video file with no transcript, generate one first (whisper.cpp local, or your CLI's transcription tool) → `transcript.txt` with `[HH:MM:SS]` timestamps per line.

### Stage 2 — Score the moments (automated)
```bash
node scripts/clip-finder.mjs --transcript transcript.txt --clips 5 --out clip-plan.md
```
The script scores every timestamped segment on the virality scorecard (hook strength, emotion, controversy, quotability, standalone value), ranks them, and writes `clip-plan.md` — one block per candidate: `start-end`, score breakdown, why it's viral, suggested hook. **Never clip below the script's cutoff** — if it says a moment isn't standalone, don't force it.

### Stage 3 — Write hooks + captions per clip → `captions.md`
For each chosen clip: a **2-second hook line** (the on-screen opener) + a platform caption pack. Hook formulas from `hook-storyboard-retention`: bold claim ("This is why your SaaS dies"), specific number ("$40k on a retainer that did nothing"), story tease ("My client quit in week 2"), pattern interrupt ("Everyone tells you to niche down. They're wrong.").

Caption rules: hook first, one idea, one CTA ("Follow for part 2" / "Full episode linked"), no hashtags, 100–220 chars for TikTok/Reels, 300–400 for Shorts description. Quote the exact clip line in the caption — it's the proof.

### Stage 4 — Cut the clips (automated commands)
```bash
node scripts/clip-finder.mjs --cuts clip-plan.md --input episode.mp4 --out clips/
```
Generates the exact FFmpeg commands (or runs them with `--run`): vertical **9:16 crop (1080×1920)**, clip to the scored timestamps, `-c:v libx264 -c:a aac`, loudness-normalized. Works for any source: podcast video, webinar, interview, YouTube download.

### Stage 5 — Captions on video (optional but recommended)
Add burned-in captions to each clip (ass tools / FFmpeg `subtitles` filter, or a `caption.srt` per clip that the platform's auto-caption can ingest). Verify text fits safe zones.

### Stage 6 — Audit (subagent, before delivery)
Spawn a fresh subagent to check, on every clip:
1. **Standalone** — makes sense without the episode (hook → payoff in 60s).
2. **Hook** — first 2 seconds punch, matches the clip's actual content (no clickbait mismatch).
3. **Score honesty** — the clip-plan score matches what's actually in the clip.
4. **Technical** — 1080×1920, audio clean, captions legible + inside safe zones, no hard cuts mid-word.
5. **Captions.md** — hook first, no hashtags, one CTA, correct per-platform lengths.
Any FAIL → re-cut / re-write → re-audit.

### Stage 7 — Deliver
`clip-plan.md` (scores) + `clips/*.mp4` + `captions.md` (+ `caption.srt` files if burned). Note in delivery: post 2–3 clips over a week (not all at once), put the full episode link in the caption, and reply to comments with the episode timestamp.

---

## Production checklist

- [ ] Source analyzed; transcript exists with `[HH:MM:SS]` timestamps (auto-transcribed if needed)
- [ ] `clip-plan.md` from `clip-finder.mjs --transcript` — only clips above the standalone cutoff
- [ ] Every clip: hook in first 2s, payoff ≤ 60s, standalone without episode context
- [ ] `captions.md`: hook-first captions, no hashtags, one CTA, per-platform lengths, quote the clip line
- [ ] Clips cut 1080×1920 via the generated FFmpeg commands (verified `--run` output)
- [ ] Captions burned or per-clip SRT provided; text inside safe zones
- [ ] Auditor subagent signed off: standalone, hook, score honesty, technical, captions
- [ ] Delivery: `clip-plan.md` + `clips/` + `captions.md` + posting cadence note
