# PLAN — Asset Reel Skill (HyperFrames: video + images + text overlay)

> Status: **approved to build** · Owner: `video-asset-reels` skill · Scope: new files only — `text-motion-reels` and all existing skills stay untouched.

## 1. Goal

A new open-source skill that turns **user-supplied video clips and images** into proper short-form reels: the agent understands the prompt, **cuts** the assets to beats, and overlays **kinetic text** — then renders a deterministic **4K** MP4 with synced voiceover and a ready-to-post `caption.md`.

## 2. Is it possible? Yes — three facts make it work

1. **Playwright already in the stack** screenshots any DOM — including `<video>` and `<img>` — frame by frame.
2. **Headless Chrome plays muted/autoplay video**, and `video.currentTime` can be **seeked deterministically** per rendered frame (this is the key trick — no reliance on real-time playback).
3. **Text overlays are already solved** by the `text-motion-reels` design system: z-index layer stack, single paused GSAP timeline, film grain, hairline progress bar — all reusable.

**One hard rule (inherited):** a frame must be a pure function of time `t`. No SMIL, no `play()` timing, no `Math.random()`. Video clips are therefore **pre-cut by FFmpeg into exact beat-length clips** (deterministic inputs), then seeked in the HTML to match the timeline.

## 3. Architecture (the pipeline)

```
assets/  (user clips + images)
   │
   ▼ 1. INGEST — agent reads the prompt, builds a beat sheet
storyboard.json   (beats: id, src, in, duration, text, style)
   │
   ▼ 2. CUT — render/cut-assets.mjs (FFmpeg, one clip per beat)
assets/cuts/beat_01.mp4 …   (1080x1920 cover-crop, H.264, muted, exact duration)
   │
   ▼ 3. COMPOSE — HTML composition: asset layer z-1, text overlay z-3, grain z-10
reel.html + GSAP timeline (text beats + Ken Burns transforms on assets)
   │
   ▼ 4. RENDER — render/render-frames.mjs (--scale 2 → 2160x3840), video-seek-aware
output/{name}/frames/  +  output/{name}/{name}.mp4
   │
   ▼ 5. AUDIO — voice-sfx-audio: Kokoro VO synced to beats + ducked bed (-14 LUFS)
assets/full_mix.m4a  →  muxed at render with --audio
   │
   ▼ 6. CAPTION — render/generate-caption.mjs (500–900 char window, no hashtags)
output/{name}/caption.md
```

## 4. Deterministic video contract

1. **Pre-cut every clip with FFmpeg**: exact beat duration, 1080x1920 cover-crop, 30 fps, H.264 yuv420p, **muted** (`-an`).
2. **In HTML**: `<video muted playsinline preload="auto" data-start data-duration src="assets/cuts/beat_01.mp4">` inside a `.asset-clip` container (z-index 1). Images: `<img>` + cover-crop CSS.
3. **Renderer seeks per frame**: for every visible clip, `currentTime = t − data-start` (clamped to `duration − 0.05`), then waits for the `seeked` event (1.5s safety timeout) before screenshotting. This is a **guarded addition** to `render-frames.mjs` — a no-op when no `<video data-start>` exists, so text reels are unaffected.
4. **Audio never lives in the HTML** — clips are muted; the real mix (voice + bed) is muxed at the end with `--audio`.
5. **No SMIL, no Math.random, no real-time playback dependency.** Same input → same frames → same MP4.

## 5. Files (all new or backward-compatible)

| File | Status | Purpose |
|---|---|---|
| `PLAN.md` | this file | the plan |
| `skills/video-asset-reels/SKILL.md` | **to build** | the new skill (executable form of this plan) |
| `render/cut-assets.mjs` | done | FFmpeg per-beat cutter (video + images) |
| `render/generate-caption.mjs` | done | caption.md generator + 500–900 char auto-check |
| `render/render-frames.mjs` | + small guarded change | video-seek + wait for `seeked`; `--autoplay-policy` arg |
| `README.md` | + small change | document the new skill + tooling |

## 6. Beat structure & retention (reuse `hook-storyboard-retention`)

- **Hook ≤ 3s** (open loop) → **agitate** (visual shift every 1.5–2s) → **payoff/value** → **CTA + loop ending**.
- One asset per beat; **3–6 words of text per beat**; mute-first (60–80% watch without sound).
- Voiceover always-on: 1 script line = 1 beat = 1 voice line, auto-fit into its window (see `text-motion-reels` sync contract).

## 7. The 3 built-in asset styles (wizard picks one)

| Style | Vibe | Assets | Text treatment |
|---|---|---|---|
| **Documentary Vox** | news/investigative | footage, interviews, B-roll | serif headlines + highlighter sweeps |
| **Product / Aesthetic** | brand, luxury | product shots, close-ups, photos | minimal serif, letterboxed lower-third |
| **Storytime Montage** | reddit/story | quick cuts, memes, screenshots | bold captions, chat-style pops |

## 8. Risks & mitigations

| Risk | Mitigation |
|---|---|
| Blank/black video frames in headless Chrome | Pre-normalize to H.264 yuv420p; seek + wait for `seeked`; `--force-color-profile=srgb`; 1.5s safety timeout |
| Playback timing drifts from timeline | Never rely on `play()`; always set `currentTime` per frame |
| Text unreadable over busy footage | Dark gradient backplate behind the text zone + stroke/glow; text confined to center column |
| Licensing problems | Only user-supplied footage, CC0/CC-BY/MIT assets — same rules as `voice-sfx-audio` |
| 4K performance | Pre-cut clips (no live decode of huge files), ≤ 2 video layers, transform-only animation |

## 9. Success criteria

- [ ] A 15s reel from 3 clips + 2 images + 1 hook builds in < 2 minutes
- [ ] Deterministic: two identical renders produce identical output
- [ ] Text readable on mute; no asset/text overlap
- [ ] 4K output lands in `output/{name}/` with `caption.md` (all sections 500–900 chars)
- [ ] `hyperframes check` passes

## 10. Build order (this session)

1. ~~`render/cut-assets.mjs`~~ ✅
2. ~~`render/generate-caption.mjs`~~ ✅
3. `render/render-frames.mjs` — guarded video-seek support
4. `skills/video-asset-reels/SKILL.md` — the skill doc
5. `README.md` — docs
6. Validate: `node --check` all scripts + a real FFmpeg cut smoke test
7. Commit + push
