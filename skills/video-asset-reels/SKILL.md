---
name: video-asset-reels
description: Create proper reels from user-supplied video clips and images with HyperFrames — understand the prompt, cut assets to beats, overlay kinetic text, sync a voiceover, and render a deterministic 4K MP4 with a caption pack. Complements text-motion-reels (visuals reuse its design system) without touching it.
---

# skill: video-asset-reels

**Name:** Video/Image Asset Reels (HyperFrames) — cut, overlay, render
**Description:** Use this skill whenever the user wants a reel **built from their own video clips and images** (B-roll, product shots, footage, screenshots, photos) with text overlays — the agent reads the prompt, plans beats, cuts each asset to its beat, overlays kinetic text, adds a synced voiceover, and renders a deterministic vertical 4K MP4.

---

## When to use

- "Make a reel from these clips" / "use these images + a voiceover"
- "Cut my footage into a 15-second reel with captions"
- Product/aesthetic montage, documentary-style explainer, storytime montage with real footage
- Any request where the visual comes from **user-provided media**, not pure typography

---

## The deterministic contract (non-negotiable)

A rendered frame is a **pure function of time t**. Therefore:

1. **Pre-cut every clip with FFmpeg** (`render/cut-assets.mjs`) → one exact-length clip per beat: 1080x1920 cover-crop, 30 fps, H.264 yuv420p, **muted** (`-an`).
2. **In HTML**, assets are `<video muted playsinline preload="auto" data-start data-duration src="assets/cuts/beat_01.mp4">` or `<img>` elements in `.asset-clip` containers at **z-index 1** (below text).
3. **The renderer seeks per frame**: for each visible clip, `currentTime = t − data-start` (clamped to `duration − 0.05`), waits for the `seeked` event, then screenshots. (`render-frames.mjs` does this automatically and is a no-op for text-only reels.)
4. **No audio inside the HTML** — clips are muted; the real mix (voice + bed) is muxed at the end with `--audio`.
5. **No SMIL, no Math.random, no `play()` timing.** Same input → same frames → same MP4.

---

## Workflow (6 stages)

### Stage 1 — Ingest & beat sheet
Read the prompt, pick a style (see Styles), and build the beat sheet: hook → agitate → payoff → CTA. One beat = one asset + 3–6 words of text. Beat count ≈ seconds ÷ 2. Write `storyboard.json`:

```json
{
  "out": "assets/cuts",
  "width": 1080, "height": 1920, "fps": 30,
  "beats": [
    { "id": "beat_01", "src": "assets/clips/sunrise.mp4", "in": 1.5, "duration": 3.0, "start": 0.0, "text": "Nobody teaches you this." },
    { "id": "beat_02", "src": "assets/photos/desk.jpg",  "duration": 2.5, "start": 3.0, "text": "Clarity is curated." }
  ]
}
```
- `in` = in-point inside the source clip (videos only), `duration` = beat window, `start` = beat start in the reel timeline.
- Text: 3–6 words per beat, hook in beat 1, CTA in the last beat.

### Stage 2 — Cut assets
```bash
node render/cut-assets.mjs storyboard.json
```
Produces `assets/cuts/beat_01.mp4 …` — exact-length, cover-cropped, muted. (Images are looped for their duration.)

### Stage 3 — Compose HTML
One 1080x1920 composition. Layers:
- **z-index 1** — `.asset-clip` containers (one per beat, clipped + positioned; `<video>` or `<img>` fills them with cover-crop)
- **z-index 2** — readability backplate: soft dark gradient only where the text sits
- **z-index 3** — text container (kinetic type, reuse the text-motion-reels design system)
- **z-index 5** — hairline progress bar
- **z-index 10** — static feTurbulence grain overlay (opacity 0.06)

Register one paused GSAP timeline on `window.__timelines.reel`: text tweens at beat starts, Ken Burns (transform-only) on asset wrappers.

### Stage 4 — Render 4K
```bash
node render/render-frames.mjs --html reel.html --name {format-slug}_{topic-slug}_4k --duration 15 --fps 30 --scale 2
```
Output → `output/{name}/frames/` + `output/{name}/{name}.mp4` (2160x3840).

### Stage 5 — Audio (always-on, synced)
Kokoro voiceover via `voice-sfx-audio`: one line per beat, auto-fit into its window, mix with `mix-audio.sh` (-14 LUFS, bed ducked), then re-render with `--audio assets/full_mix.m4a`.

### Stage 6 — Caption pack
```bash
node render/generate-caption.mjs --name {name} --topic "{topic}" --format {format-slug} --hook "{hook}" --beats "beat text 1|beat text 2|…" --voice kokoro --duration 15
```
Writes `output/{name}/caption.md` — every platform section auto-checked into the **500–900 char window**, no hashtags.

---

## Styles (wizard picks one)

| Style | Vibe | Assets | Text treatment |
|---|---|---|---|
| **Documentary Vox** (`documentary`) | news/investigative | footage, interviews, B-roll | bold serif headlines + highlighter sweeps (cream bg cards) |
| **Product / Aesthetic** (`aesthetic`) | brand, luxury | product shots, close-ups, photos | minimal serif lower-third, letterboxed, champagne accent |
| **Storytime Montage** (`montage`) | reddit/story | quick cuts, memes, screenshots | bold captions, chat-style pops, flash cuts |

---

## HTML skeleton (asset layer + text overlay)

```html
<style>
  .stage { position: relative; width: 1080px; height: 1920px; overflow: hidden;
           background: #0a0a0d; color: #f5f2ea; font-family: 'Georgia', serif; }
  /* z-1: asset clips — one per beat, clipped, cover-cropped */
  .asset-clip { position: absolute; inset: 0; overflow: hidden; z-index: 1; opacity: 0; }
  .asset-clip video, .asset-clip img { width: 100%; height: 100%; object-fit: cover; }
  /* z-2: readability backplate behind the text zone */
  .backplate { position: absolute; left: 0; right: 0; top: 35%; bottom: 65%; z-index: 2;
               background: linear-gradient(180deg, transparent, rgba(0,0,0,0.55), transparent); }
  /* z-3: text */
  .text-container { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);
                    width: 75%; text-align: center; z-index: 3; }
  .title-large { font-size: clamp(3.8rem, 7.5vw, 6.8rem); line-height: 1.25; letter-spacing: -0.02em; }
  .highlight-text { color: #e5c158; font-style: italic; }
  /* z-10: grain */
  .noise-overlay { position: absolute; inset: 0; z-index: 10; opacity: 0.06; pointer-events: none; }
</style>

<div class="stage" data-composition-id="reel" data-start="0" data-width="1080" data-height="1920">
  <!-- z-1: pre-cut asset clips (muted video / cover images) -->
  <div id="asset1" class="asset-clip" data-start="0" data-duration="3">
    <video muted playsinline preload="auto" src="assets/cuts/beat_01.mp4"></video>
  </div>
  <div id="asset2" class="asset-clip" data-start="3" data-duration="2.5">
    <img src="assets/cuts/beat_02.mp4" alt="" />
  </div>

  <!-- z-2 + z-3 -->
  <div class="backplate"></div>
  <div class="text-container">
    <div id="scene1" class="clip" data-start="0" data-duration="3">
      <h1 class="title-large">Nobody teaches you <span class="highlight-text">this.</span></h1>
    </div>
  </div>

  <!-- z-10: grain -->
  <svg class="noise-overlay" xmlns="http://www.w3.org/2000/svg">
    <filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" stitchTiles="stitch"/>
      <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.12 0"/></filter>
    <rect width="100%" height="100%" filter="url(#noise)"/>
  </svg>
</div>

<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"></script>
<script>
  const tl = gsap.timeline({ paused: true });
  const D = 6;

  // Assets: show only inside their beat window; Ken Burns = transform-only.
  tl.set("#asset1", { display: "block" }, 0);
  tl.fromTo("#asset1 video", { scale: 1.0 }, { scale: 1.08, duration: 3, ease: "none" }, 0); // slow push-in
  tl.set("#asset1", { display: "none" }, 3);

  tl.set("#asset2", { display: "block" }, 3);
  tl.fromTo("#asset2 img", { scale: 1.12 }, { scale: 1.0, duration: 2.5, ease: "none" }, 3); // slow pull-out
  tl.set("#asset2", { display: "none" }, 5.5);

  // Text overlay (same pattern as text-motion-reels).
  tl.from("#scene1", { opacity: 0, y: 40, duration: 0.6, ease: "power2.out" }, 0);

  window.__timelines = window.__timelines || {};
  window.__timelines.reel = tl;
</script>
```

> Note: the renderer seeks `video[data-start]` per frame — the `data-start`/`data-duration` on the `.asset-clip` wrapper drive it. Keep `duration` here == the clip duration from Stage 2.

---

## Example prompts & how to use

Just ask any agent CLI (Claude Code, Cursor, Codex, Gemini CLI, …) once the skill is installed — the agent runs the whole 6-stage workflow from one prompt.

### Example prompts (copy-paste)

**1. Documentary Vox from footage**
> "Using the video-asset-reels skill, make a 15-second reel from the clips in `assets/footage/`. Hook: 'Nobody is talking about this.' Add captions per beat, a Kokoro voiceover, render in 4K, and write the caption pack."

**2. Product / aesthetic from photos**
> "Turn these 5 product photos in `assets/products/` into a 12-second aesthetic reel with luxury lower-third captions. Style: Product/Aesthetic. Add a voiceover and captions."

**3. Storytime montage from mixed assets**
> "Cut the screenshots and clips in `assets/story/` into a storytime montage reel, hook: 'I read this and couldn't sleep.' Fast cuts, bold captions, voiceover, 4K output."

**4. Fully scripted (you give the script + assets)**
> "Make a reel from `assets/clips/`: 15s, these beats — [beat 1 text] / [beat 2 text] / [beat 3 text]. Use one clip per beat and a calm voiceover."

### What the agent does after your prompt

1. Runs a mini-wizard: picks a style (Documentary / Aesthetic / Montage), confirms beat count
2. Writes `storyboard.json` — one beat per asset, with in-points, durations, text, and reel timings
3. Cuts assets → `node render/cut-assets.mjs storyboard.json`
4. Composes the 1080x1920 HTML (asset layer + text overlay + grain) with a paused GSAP timeline
5. Renders 4K → `output/{name}/` (+ muxes the -14 LUFS voice+bed mix)
6. Writes `caption.md` (all sections 500–900 chars, no hashtags)

### Required inputs from the user

- **Assets**: a folder of video clips and/or images (their own footage, or CC0/CC-BY/MIT sources — never CC-NC)
- **Topic or hook** (optional — the agent writes the beat sheet if not provided)
- **Duration** (optional, default 15s)

---

## Production checklist

- [ ] Beat sheet: hook → agitate → payoff → CTA; one asset per beat; 3–6 words text per beat
- [ ] `storyboard.json` written; every beat has `id, src, in (videos), duration, start, text`
- [ ] `cut-assets.mjs` produced one clip per beat (1080x1920, H.264, muted, exact duration)
- [ ] HTML: assets at z-index 1, backplate z-2, text z-3, grain z-10; videos `muted playsinline preload="auto"`
- [ ] GSAP timeline registered on `window.__timelines.reel`; text at beat starts; Ken Burns transform-only
- [ ] No SMIL, no Math.random, no audio elements in the HTML
- [ ] Voiceover generated + auto-fit into every beat window (FITS ✓) and mixed to -14 LUFS
- [ ] Rendered 4K into `output/{name}/` with `--scale 2` (+ `--audio` for the mix)
- [ ] `caption.md` written via `generate-caption.mjs` — all sections 500–900 chars, no hashtags
- [ ] `hyperframes check` passes; two identical renders are identical
