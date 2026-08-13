---
name: podcast-to-shorts
description: Turn long-form podcast or video content into viral-ready vertical shorts (Reels / TikTok / Shorts) — transcript → find the highest-virality moments → write per-clip hooks + captions → cut the clips with FFmpeg → sync captions. Includes a clip-scoring script (transcript analysis → ranked moments with timestamps), FFmpeg cut commands, and a Deepak-branded pipeline that reuses the repo's reel/caption conventions.
---

<!-- ════════════════════════════════════════════════════════════════════════
     🎬 deepak-skill — crafted by Deepak · skill: podcast-to-shorts
     https://github.com/Deepak-ai-93/deepak-skill · MIT license
     ════════════════════════════════════════════════════════════════════════ -->

```
   ██████╗ ███████╗███████╗██████╗  █████╗ ██╗  ██╗
   ██╔══██╗██╔════╝██╔════╝██╔══██╗██╔══██╗██║ ██╔╝
   ██║  ██║█████╗  █████╗  ██████╔╝███████║█████╔╝
   ██║  ██║██╔══╝  ██╔══╝  ██╔══██╗██╔══██║██╔═██╗
   ██████╔╝███████╗███████╗██║  ██║██║  ██║██║  ██╗
   ╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝
```

**🎬 deepak-skill — crafted by Deepak** · skill: `podcast-to-shorts` · [deepak-skill on GitHub](https://github.com/Deepak-ai-93/deepak-skill) · MIT

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
| **Audited before delivery (the harness)** | Stage 6 is a harness, never a self-check: `audit-clips.mjs` runs the automated checks (transcript, scored moments, cut commands, clips output, captions) → a FRESH clips-auditor subagent scores clip-worthiness (/50, ≥ 35 = worth posting) → fix loop until signed **PASS** in `clips-audit.md`. |

---

## Storytelling + addiction rails (the universal contract — read before anything else)

Every deliverable this skill produces must tell **ONE micro-story** and engineer **rewatch**. These rails are the SAME contract every video/image skill in this repo follows — apply them to every beat, scene, slide, shot or clip before it ships.

**Applied to clips:** every clip must contain a complete micro-story — the hook opens the loop in the first 2s, the speaker's payoff closes it inside 60s, and the clip ends with the loop closed (a satisfying take) or deliberately open (a cliffhanger that begs for "Part 2"). Tension without resolution is not standalone — the scorecard's standalone-value test IS the story test.

### The story spine (all four beats, always)

| Beat | Rule |
|---|---|
| **Open loop (hook, 0–3s)** | The first thing the viewer sees — first frame, cover slide, first scene — opens an unresolved question, tension or promise the brain must see closed. No intro, no logo, no "hey guys". |
| **Rising tension** | Every beat after the hook escalates: new stakes, a twist, a pattern interrupt, an "and then…". Each beat either raises the question or raises the stakes — never just fills time. |
| **Payoff** | The open loop closes in the final seconds with the "aha" the hook promised. A loop opened and never closed kills trust and rewatch. |
| **Loop ending** | The last frame mirrors or seeds the first (rewatch counts as a second view) or chains into the next post ("Part 2", "Follow for part 2", "Save this"). |

### The addiction levers (use ≥3 per deliverable)

| Lever | Mechanism |
|---|---|
| **Curiosity gap** | The open loop the brain must close (Zeigarnik effect — unfinished tasks nag). |
| **Serialization / cliffhanger** | Cut before resolution; chain posts into a series so the audience returns for the next installment. |
| **Variable reward** | Reveal payoffs on a beat the viewer can't predict — countdowns, answer reveals, verdicts, twists. |
| **Pattern interrupt** | A scale pop, color flash or tempo break exactly where attention dips (the mid-video hump). |
| **Relatability / self-recognition** | "That's me" moments — the viewer watches to see their own life, then saves or shares it. |
| **Commitment bait** | Save / share / comment / "what's your #?" — an engaged viewer is a returning viewer. |

### The fluff rule

Every beat either **raises the question**, **raises the stakes**, or **pays off**. If a beat can be deleted without losing the story, delete it.

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

### Stage 6 — Audit harness (automated checks + clips-auditor subagent, before delivery)
**Step 6a — run the automated audit harness:**
```bash
node scripts/audit-clips.mjs --pack <clips-folder> --out clips-audit.md
```
`audit-clips.mjs` scans the pack and checks everything a script can: transcript presence + timestamps, clip-plan scored moment blocks + scores + FFmpeg cut commands + hooks, the clips/ output folder, and captions.md (zero hashtags, sections, CTA, per-platform length markers). Writes `clips-audit.md` (automated verdicts + scorecard scaffold). **Exit 1 on any FAIL.**

**Step 6b — spawn the clips-auditor subagent** — a FRESH subagent (never self-audit) with the exact brief from `templates/clips-auditor-brief.md`: reads `clips-audit.md` + all pack files, completes the **clip-worthiness scorecard** (10 criteria, /50 — **≥ 35 = worth posting**, with verdict bands), makes the creative judgment calls the script can't (standalone value, hook punch, score honesty, technical cuts), and signs **PASS / FIX NEEDED** with per-file fixes.

**Step 6c — fix loop.** Any FAIL (or an auditor-flagged WARN) → fix the file → re-run `audit-clips.mjs` (and `clip-finder.mjs` if the plan changed) → re-submit to a fresh auditor. **Nothing is delivered until the auditor signs off PASS.** The `clips-audit.md` ships with the pack.

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
- [ ] Story spine complete: open loop (hook) → rising tension → payoff → loop ending; no beat survives the fluff rule
- [ ] ≥3 addiction levers used (curiosity gap · serialization · variable reward · pattern interrupt · relatability · commitment bait)
- [ ] Every clip is a complete micro-story — hook opens the loop in 2s, payoff closes (or deliberately opens) inside 60s
- [ ] **Audit harness run:** `audit-clips.mjs` → automated checks (transcript, scored moments, cut commands, clips output, captions) — exit 0
- [ ] **Clips-auditor subagent** (fresh eyes) completed the clip-worthiness scorecard (/50 ≥ 35) and signed **PASS / FIX NEEDED** in `clips-audit.md`
- [ ] Delivery: `clip-plan.md` + `clips/` + `captions.md` + `clips-audit.md` + posting cadence note
