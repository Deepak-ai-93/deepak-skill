---
name: text-motion-reels
description: Create trending, high-retention text-only motion graphic reels (kinetic typography) for Instagram Reels, TikTok, and YouTube Shorts as HyperFrames HTML compositions. Fully upgraded with 3D spatial typography, progress metrics, and dynamic organic backgrounds.
---

# skill: text-only-motion-reels

**Name:** Text-Only Motion Graphic Reels (Kinetic Typography) — Upgraded Edition
**Description:** Use this skill to plan, write, and render highly advanced, trending faceless text-only motion graphic reels for Instagram Reels, TikTok, and YouTube Shorts. Compositions are structured as fully responsive, deterministic HTML compositions (HyperFrames-compatible) boasting 3D kinetic transitions, ambient SVG filters, and retention-optimizing progress trackers.

---

## When to use

Use this skill whenever the user asks to:
- "Make a text-only reel / kinetic typography video / faceless reel"
- "Make a quote video / mindset reel / facts reel / storytime reel"
- Create highly engaging short-form vertical content (9:16) driven purely by typography, advanced motion physics, custom shader-like effects, and audio

---

## Core principles (always apply)

1. **Mute-first design** — most viewers scroll in silence. The motion type must carry the full message. Audio is enhancement, never a requirement.
2. **3-second hook rule** — the opening frame must create a curiosity gap: shocking stat, direct question, or "things I wish I knew sooner…". If frame 1 is boring, nothing else matters.
3. **1–2 second cuts** — words swap, scale, or reflow every 1–2 seconds. Target completion rates above 70%.
4. **Deterministic output** — same input → same frames → same MP4. No frame drops, no random timing.
5. **Design a loop** — end where the reel began so viewers rewatch.
6. **Responsive Layout-by-Design** — typography must scale smoothly utilizing fluid CSS formulas (like `clamp()`) so rendering is flawless across all display aspect ratios.

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

## Upgraded Design Elements & Styles

- **Fluid & Responsive Scaling:** Uses `clamp(2rem, 8vw, 6rem)` to dynamically scale titles and descriptions, avoiding overlap and clipping across diverse viewport resolutions.
- **3D Spatial Typography:** Text blocks rotate in a 3D perspective space (utilizing CSS properties `perspective: 1000px`, `transform-style: preserve-3d`) to simulate premium cinema-camera moves.
- **Dynamic CSS/SVG Ambient Backgrounds:** Backgrounds use organic grain overlays (via SVG `<filter>` turbulence and color matrix) and animated radial gradients that move in sync with text pacing.
- **Visual Retention Indicators:** A sleek, minimal custom-designed video progress bar or countdown ring that visually loops to incentivize completion rates.
- **Micro-interactions:** Character-level and word-level physics-based spring animations using GSAP's stagger properties.

---

## Production workflow (HyperFrames loop)

1. **Plan** — pick niche + hook + beat count. Estimate length (sweet spot 15–45s).
2. **Write HTML** — one composition per scene. Vertical 1080x1920 stage.
3. **Wire seekable animation** — GSAP timeline registered on `window.__timelines` (paused by default).
4. **Add audio** — optional trending/mood track with `data-start`/`data-duration`.
5. **Lint & check** — validate composition (`hyperframes check`).
6. **Preview** — live-reload browser preview.
7. **Render** — deterministic MP4 via headless Chrome + FFmpeg.

## Upgraded HTML Skeleton (Reference implementation)

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Upgraded Kinetic Reel</title>
  <style>
    :root {
      --bg-color: #050505;
      --text-primary: #f8f9fa;
      --accent-color: #ff007f; /* Kinetic Hot Pink */
      --progress-color: rgba(255, 255, 255, 0.4);
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      background: var(--bg-color);
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }

    /* 9:16 vertical stage with 3D perspective configured */
    .stage {
      position: relative;
      width: 1080px;
      height: 1920px;
      background: radial-gradient(circle at 50% 50%, #15151a 0%, var(--bg-color) 80%);
      color: var(--text-primary);
      font-family: 'Helvetica Neue', Arial, sans-serif;
      overflow: hidden;
      perspective: 1000px;
      transform-style: preserve-3d;
    }

    /* SVG Grain/Noise Overlay */
    .noise-overlay {
      position: absolute;
      top: 0; left: 0; width: 100%; height: 100%;
      pointer-events: none;
      opacity: 0.05;
      z-index: 10;
    }

    /* Responsive Typography & 3D Container */
    .text-container {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 80%;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
    }

    .clip {
      position: absolute;
      opacity: 0;
      transform-style: preserve-3d;
    }

    /* Clamp-based fluid responsive text sizes */
    .title-large {
      font-size: clamp(3.5rem, 7vw, 6.5rem);
      font-weight: 900;
      letter-spacing: -0.04em;
      line-height: 1.1;
      text-transform: uppercase;
    }

    .sub-detail {
      font-size: clamp(1.8rem, 3.5vw, 3rem);
      font-weight: 400;
      color: #8e9aaf;
    }

    .highlight-text {
      color: var(--accent-color);
      display: inline-block;
    }

    /* Retention-boosting Progress Bar */
    .progress-bar-container {
      position: absolute;
      bottom: 80px;
      left: 10%;
      width: 80%;
      height: 6px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 3px;
      overflow: hidden;
      z-index: 5;
    }

    .progress-bar-fill {
      width: 0%;
      height: 100%;
      background: linear-gradient(90deg, var(--accent-color), #ffd166);
    }
  </style>
</head>
<body>

  <!-- Background SVG Noise generator to produce dynamic grain film vibe -->
  <svg class="noise-overlay" xmlns="http://www.w3.org/2000/svg">
    <filter id="noise">
      <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
      <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.15 0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#noise)" />
  </svg>

  <div class="stage" data-composition-id="reel" data-start="0" data-width="1080" data-height="1920">

    <div class="text-container">
      <!-- Scene 1: 3D Hook Reveal -->
      <div id="scene1" class="clip" data-start="0" data-duration="3">
        <h1 class="title-large">They don't want you <br><span class="highlight-text">to know</span></h1>
      </div>

      <!-- Scene 2: 3D Body Reveal -->
      <div id="scene2" class="clip" data-start="3" data-duration="3">
        <h1 class="title-large">Rest is <br><span class="highlight-text">productive</span></h1>
        <p class="sub-detail">Burnout is the enemy of strategy.</p>
      </div>
    </div>

    <!-- Retention progress indicator -->
    <div class="progress-bar-container">
      <div id="progressbar" class="progress-bar-fill"></div>
    </div>

    <!-- optional mood audio -->
    <audio data-start="0" data-duration="6" data-track-index="1" data-volume="0.4" src="ambient_lofi.wav"></audio>
  </div>

  <!-- Include GSAP -->
  <script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"></script>
  <script>
    // Initialize deterministic, scrubbable animation timeline
    const tl = gsap.timeline({ paused: true });

    // Set timeline master duration to 6 seconds
    const totalDuration = 6;

    // SCENE 1: 3D Hook Animation (0s to 3s)
    // 3D pop from Z-depth, rotate on X-axis, fade-in
    tl.set("#scene1", { display: "block" });
    tl.fromTo("#scene1",
      { opacity: 0, scale: 0.8, rotationX: 45, z: -200 },
      { opacity: 1, scale: 1, rotationX: 0, z: 0, duration: 0.8, ease: "power4.out" },
      0
    );
    // 3D slide-out transition
    tl.to("#scene1",
      { opacity: 0, scale: 1.2, rotationX: -30, z: 150, duration: 0.6, ease: "power2.in" },
      2.4
    );
    tl.set("#scene1", { display: "none" }, 3);

    // SCENE 2: 3D Body Animation (3s to 6s)
    tl.set("#scene2", { display: "block" }, 3);
    tl.fromTo("#scene2",
      { opacity: 0, scale: 0.8, rotationY: -45, z: -150 },
      { opacity: 1, scale: 1, rotationY: 0, z: 0, duration: 0.8, ease: "power4.out" },
      3
    );
    // Infinite loop preparation: fade-out to transition cleanly back to start
    tl.to("#scene2",
      { opacity: 0, scale: 0.9, duration: 0.5, ease: "power1.in" },
      5.5
    );
    tl.set("#scene2", { display: "none" }, 6);

    // Dynamic, deterministic Progress Bar Animation
    tl.fromTo("#progressbar",
      { width: "0%" },
      { width: "100%", duration: totalDuration, ease: "none" },
      0
    );

    // Register with HyperFrames ecosystem
    window.__timelines = window.__timelines || {};
    window.__timelines.reel = tl;
  </script>
</body>
</html>
```

---

## Production checklist

- [ ] Hook in first 3 seconds (curiosity gap)
- [ ] Words move or camera angles transform every 1–2s (active visual stimulation)
- [ ] Typography scale is completely fluid using CSS `clamp()` or relative viewport units
- [ ] Added 3D spatial properties (`perspective`, `transform-style: preserve-3d`) to trigger dynamic Z-axis animations
- [ ] Added high-quality SVG filter overlays for custom background aesthetics (grain, noise, dynamic gradient maps)
- [ ] Message is easily readable on mute (crucial for short-form retention metrics)
- [ ] Includes a visible retention progress bar synced with the video duration
- [ ] Rendered MP4 is perfectly deterministic and seamlessly matches timeline durations
- [ ] `hyperframes check` passes successfully
