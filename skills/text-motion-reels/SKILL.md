---
name: text-motion-reels
description: Create trending text-only motion graphic reels (kinetic typography) for Instagram Reels, TikTok, and YouTube Shorts as HyperFrames HTML compositions. Use for faceless, no-camera short-form videos.
---

# skill: text-only-motion-reels

**Name:** Text-Only Motion Graphic Reels (Kinetic Typography)
**Description:** Use this skill to plan, write, and render trending faceless text-only motion graphic reels for Instagram Reels, TikTok, and YouTube Shorts — built as HTML compositions (HyperFrames-compatible). No camera, no faces, no stock footage: motion typography IS the content.

---

## When to use

Use this skill whenever the user asks to:
- "Make a text-only reel / kinetic typography video / faceless reel"
- "Make a quote video / mindset reel / facts reel / storytime reel"
- Create short-form vertical content (9:16) driven purely by type, motion, and audio

---

## Core principles (always apply)

1. **Mute-first design** — most viewers scroll in silence. The motion type must carry the full message. Audio is enhancement, never a requirement.
2. **3-second hook rule** — the opening frame must create a curiosity gap: shocking stat, direct question, or "things I wish I knew sooner…". If frame 1 is boring, nothing else matters.
3. **1–2 second cuts** — words swap, scale, or reflow every 1–2 seconds. Target completion rates above 70%.
4. **Deterministic output** — same input → same frames → same MP4. No frame drops, no random timing.
5. **Design a loop** — end where the reel began so viewers rewatch.

---

## Trending niches (pick one per reel)

| # | Niche | Vibe | Example hooks |
|---|-------|------|----------------|
| 1 | Mindset & Stoic wisdom | Dark minimal, atmospheric audio | "Things I wish I knew sooner…" / "Nobody teaches you this." |
| 2 | Storytime & Reddit threads | Text-message style, suspenseful pacing | "I read this Reddit post and couldn't sleep." |
| 3 | Psychology micro-lessons | High-contrast layout, data-ish | "Your brain does this every time you scroll." |
| 4 | Finance / wealth / productivity | Structured grids, numbered reveals | "The 5 money rules nobody told you." |
| 5 | Aesthetic "chaos culture" vibes | Poetic raw text, lo-fi beats | "You're not lazy. You're exhausted." |
| 6 | Hot takes & listicles | Punchy numbered cards | "5 signs you're being taken for granted." |

## Trending design styles

- **Full-screen block typography** — words scale, snap, and grid-pop in rhythm with the beat
- **Minimal serif / editorial type** — clean magazine-style serifs, restrained fade/slide reveals
- **Glitch / vaporwave / retro-futurism** — chromatic aberration, scanlines, metallic sheens
- **Beat-synced kinetic captions** — words scale/shake/color-shift exactly on kick drums or vocal cadence
- **Masking & text reveals** — type slides out from behind geometric shapes or borders

## Viral formulas

- **Save-bait formats** — "10 psychology tricks", "budget cheat sheet" → viewers save → algorithm boosts
- **Trending audio pairing** — pick a popular sound; text still works fully muted
- **Felt-understood content** — psychology truths and practical value drive shares
- **Loop ending** — final frame mirrors frame 1 for rewatch views

---

## Production workflow (HyperFrames loop)

1. **Plan** — pick niche + hook + beat count. Estimate length (sweet spot 15–45s).
2. **Write HTML** — one composition per scene. Vertical 1080x1920 stage.
3. **Wire seekable animation** — GSAP timeline registered on `window.__timelines` (paused by default).
4. **Add audio** — optional trending/mood track with `data-start`/`data-duration`.
5. **Lint & check** — validate composition (`hyperframes check`).
6. **Preview** — live-reload browser preview.
7. **Render** — deterministic MP4 via headless Chrome + FFmpeg.

## HTML skeleton (reference)

```html
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    /* 1080x1920 stage, dark minimal, serif or bold block type */
    body { margin: 0; background: #0a0a0a; }
    .stage {
      width: 1080px; height: 1920px;
      display: grid; place-items: center;
      font-family: 'Georgia', serif; color: #f5f5f5;
    }
    .clip { position: absolute; opacity: 0; }
  </style>
</head>
<body>
  <div class="stage" data-composition-id="reel" data-start="0" data-width="1080" data-height="1920">
    <!-- Scene 1: HOOK -->
    <h1 id="hook" class="clip" data-start="0" data-duration="3" data-track-index="0">
      Things I wish I knew sooner
    </h1>
    <!-- Scene 2: BODY -->
    <p id="point1" class="clip" data-start="3" data-duration="2" data-track-index="0">
      Rest is productive.
    </p>
    <!-- optional mood audio -->
    <audio data-start="0" data-duration="15" data-track-index="1" data-volume="0.4" src="mood.wav"></audio>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"></script>
  <script>
    const tl = gsap.timeline({ paused: true });
    tl.from("#hook",   { opacity: 0, y: 40, scale: 0.95, duration: 0.5 }, 0);
    tl.from("#point1", { opacity: 0, y: 40, duration: 0.4 }, 3.2);
    window.__timelines = window.__timelines || {};
    window.__timelines.reel = tl;
  </script>
</body>
</html>
```

## Production checklist

- [ ] Hook in first 3 seconds (curiosity gap)
- [ ] Words move every 1–2s
- [ ] Message readable on mute
- [ ] Style = one of the trending styles (consistent)
- [ ] Niche = one of the 6 above (consistent)
- [ ] Optional: beat-synced emphasis on key words
- [ ] Optional: loop ending
- [ ] `hyperframes check` passes
- [ ] Rendered MP4 is deterministic
