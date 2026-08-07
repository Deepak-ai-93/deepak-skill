---
name: text-motion-reels
description: Create premium, high-retention text-only motion graphic reels (kinetic typography) as HyperFrames HTML compositions. Upgraded with elegant minimalist layouts, low-opacity animated geometric shapes, fine framing lines, and ambient dynamic backgrounds.
---

# skill: text-only-motion-reels

**Name:** Text-Only Motion Graphic Reels (Kinetic Typography) — Premium Edition
**Description:** Use this skill to plan, write, and render highly advanced, premium faceless text-only motion graphic reels for Instagram Reels, TikTok, and YouTube Shorts. Compositions are structured as fully responsive, clean, and deterministic HTML compositions (HyperFrames-compatible). Avoids "messy" chaotic styles by prioritizing high-end minimalism, fine framing lines (with low opacity), floating geometric shapes, and cinematic typography.

---

## When to use

Use this skill whenever the user asks to:
- "Make a premium text-only reel / kinetic typography video"
- "Create clean, high-end mindset/stoic wisdom reels"
- Create aesthetic vertical content (9:16) utilizing geometric structures, low-opacity animated elements, and elegant animations.

---

## Core principles (always apply)

1. **Clean Premium Aesthetic (Anti-Messy)** — Avoid high-frequency visual chaos, distracting transitions, or overlapping text. Use a unified, clean color palette, structured whitespace, and subtle layouts.
2. **Low-Opacity Ambient Geometry** — Integrate decorative geometric shapes (circles, rings, cards) and structural lines with low opacity (**0.05 to 0.15**) to construct premium depth without distracting from the text.
3. **Mute-first design** — the motion type must carry the full message. Audio is enhancement, never a requirement.
4. **3-second hook rule** — the opening frame must create a curiosity gap: shocking stat, direct question, or "things I wish I knew sooner…".
5. **Fluid Layout-by-Design** — typography must scale smoothly utilizing fluid CSS formulas (like `clamp()`) so rendering is flawless across all display aspect ratios.
6. **Deterministic output** — same input → same frames → same MP4. No frame drops, no random timing.

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

## Premium Design Elements & Styles

- **Low-Opacity Structural Lines:** Horizontal and vertical dividers (with opacity `0.05` to `0.12`) that slowly expand, fade, or act as bounding frames.
- **Floating Geometric Shapes:** Ambient background circles, rings, or rounded blocks (with opacity `0.05` to `0.10`) that exhibit slow, floating, or rotating micro-animations.
- **Fluid & Responsive Scaling:** Uses `clamp(2rem, 8vw, 6rem)` to dynamically scale titles and descriptions, avoiding overlap and clipping across diverse viewport resolutions.
- **3D Spatial Typography:** Text blocks rotate in a 3D perspective space (utilizing CSS properties `perspective: 1000px`, `transform-style: preserve-3d`) to simulate premium cinema-camera moves.
- **Dynamic CSS/SVG Ambient Backgrounds:** Backgrounds use organic grain overlays (via SVG `<filter>` turbulence and color matrix) and animated radial gradients that move in sync with text pacing.
- **Visual Retention Indicators:** A sleek, minimal custom-designed video progress bar or countdown ring that visually loops to incentivize completion rates.

---

## Production workflow (HyperFrames loop)

1. **Plan** — pick niche + hook + beat count. Estimate length (sweet spot 15–45s).
2. **Write HTML** — one composition per scene. Vertical 1080x1920 stage.
3. **Wire seekable animation** — GSAP timeline registered on `window.__timelines` (paused by default).
4. **Add audio** — optional trending/mood track with `data-start`/`data-duration`.
5. **Lint & check** — validate composition (`hyperframes check`).
6. **Preview** — live-reload browser preview.
7. **Render** — deterministic MP4 via headless Chrome + FFmpeg.

## Upgraded HTML Skeleton (Premium implementation)

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Premium Kinetic Reel</title>
  <style>
    :root {
      --bg-color: #030303;
      --text-primary: #f8f9fa;
      --accent-color: #e5c158; /* Premium Champagne Gold */
      --line-color: rgba(255, 255, 255, 0.08);
      --shape-color: rgba(255, 255, 255, 0.04);
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
      background: radial-gradient(circle at 50% 50%, #0d0d11 0%, var(--bg-color) 100%);
      color: var(--text-primary);
      font-family: 'Georgia', serif;
      overflow: hidden;
      perspective: 1200px;
      transform-style: preserve-3d;
    }

    /* SVG Grain/Noise Overlay */
    .noise-overlay {
      position: absolute;
      top: 0; left: 0; width: 100%; height: 100%;
      pointer-events: none;
      opacity: 0.06;
      z-index: 10;
    }

    /* Premium Decorative Background Grid Lines (Low Opacity) */
    .decor-line {
      position: absolute;
      background-color: var(--line-color);
      z-index: 1;
    }
    .line-left { top: 0; left: 100px; width: 1px; height: 100%; }
    .line-right { top: 0; right: 100px; width: 1px; height: 100%; }
    .line-top { top: 200px; left: 0; width: 100%; height: 1px; }
    .line-bottom { bottom: 200px; left: 0; width: 100%; height: 1px; }

    /* Animated Premium Ambient Shapes (Low Opacity) */
    .decor-shape {
      position: absolute;
      background: var(--shape-color);
      border: 1px solid rgba(255, 255, 255, 0.03);
      border-radius: 50%;
      z-index: 1;
      pointer-events: none;
    }
    #shape1 { width: 400px; height: 400px; top: 15%; left: -100px; }
    #shape2 { width: 500px; height: 500px; bottom: 10%; right: -150px; border-radius: 38% 62% 63% 37% / 41% 44% 56% 59%; /* Organic blob shape */ }

    /* Fine crosshair markers for luxury framing */
    .crosshair {
      position: absolute;
      width: 20px;
      height: 20px;
      z-index: 2;
    }
    .crosshair::before, .crosshair::after {
      content: '';
      position: absolute;
      background: rgba(255, 255, 255, 0.15);
    }
    .crosshair-tl { top: 210px; left: 110px; }
    .crosshair-tl::before { top: 10px; left: 0; width: 20px; height: 1px; }
    .crosshair-tl::after { top: 0; left: 10px; width: 1px; height: 20px; }

    /* Responsive Typography & 3D Container */
    .text-container {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 75%;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2rem;
      z-index: 3;
    }

    .clip {
      position: absolute;
      opacity: 0;
      transform-style: preserve-3d;
      width: 100%;
    }

    /* Clamp-based fluid responsive premium serif text sizes */
    .title-large {
      font-size: clamp(3.8rem, 7.5vw, 6.8rem);
      font-weight: 400;
      letter-spacing: -0.02em;
      line-height: 1.25;
    }

    .sub-detail {
      font-size: clamp(1.6rem, 3.2vw, 2.8rem);
      font-weight: 300;
      font-style: italic;
      color: #a0aab5;
      letter-spacing: 0.05em;
      margin-top: 1rem;
    }

    .highlight-text {
      color: var(--accent-color);
      display: inline-block;
      font-style: italic;
    }

    /* Retention-boosting Progress Bar */
    .progress-bar-container {
      position: absolute;
      bottom: 120px;
      left: 15%;
      width: 70%;
      height: 2px; /* Fine luxury hairline */
      background: rgba(255, 255, 255, 0.05);
      overflow: hidden;
      z-index: 5;
    }

    .progress-bar-fill {
      width: 0%;
      height: 100%;
      background: var(--accent-color);
    }
  </style>
</head>
<body>

  <!-- Background SVG Noise generator to produce dynamic grain film vibe -->
  <svg class="noise-overlay" xmlns="http://www.w3.org/2000/svg">
    <filter id="noise">
      <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" stitchTiles="stitch" />
      <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.12 0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#noise)" />
  </svg>

  <div class="stage" data-composition-id="reel" data-start="0" data-width="1080" data-height="1920">

    <!-- Framing lines -->
    <div class="decor-line line-left" id="lineLeft"></div>
    <div class="decor-line line-right" id="lineRight"></div>
    <div class="decor-line line-top" id="lineTop"></div>
    <div class="decor-line line-bottom" id="lineBottom"></div>

    <!-- Framing crosshair detail -->
    <div class="crosshair crosshair-tl"></div>

    <!-- Floating ambient luxury shapes -->
    <div class="decor-shape" id="shape1"></div>
    <div class="decor-shape" id="shape2"></div>

    <div class="text-container">
      <!-- Scene 1: Premium 3D Hook Reveal -->
      <div id="scene1" class="clip" data-start="0" data-duration="3">
        <h1 class="title-large">Mastery is not <br>about <span class="highlight-text">noise.</span></h1>
      </div>

      <!-- Scene 2: Premium 3D Body Reveal -->
      <div id="scene2" class="clip" data-start="3" data-duration="3">
        <h1 class="title-large">It is about <br><span class="highlight-text">subtraction.</span></h1>
        <p class="sub-detail">Simplify until only value remains.</p>
      </div>
    </div>

    <!-- Fine luxury retention progress indicator -->
    <div class="progress-bar-container">
      <div id="progressbar" class="progress-bar-fill"></div>
    </div>

    <!-- optional mood audio -->
    <audio data-start="0" data-duration="6" data-track-index="1" data-volume="0.4" src="cinematic_ambient.wav"></audio>
  </div>

  <!-- Include GSAP -->
  <script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"></script>
  <script>
    // Initialize deterministic, scrubbable animation timeline
    const tl = gsap.timeline({ paused: true });

    // Set timeline master duration to 6 seconds
    const totalDuration = 6;

    // --- Premium Ambient Shapes & Framing Lines Animation ---
    // Slow drifting float for background organic shape 1
    tl.fromTo("#shape1",
      { x: 0, y: 0, rotation: 0 },
      { x: 40, y: -30, rotation: 15, duration: totalDuration, ease: "none" },
      0
    );

    // Subtle breathing morph for blob shape 2
    tl.fromTo("#shape2",
      { scale: 0.95, y: 0, rotation: 0 },
      { scale: 1.05, y: 40, rotation: -12, duration: totalDuration, ease: "none" },
      0
    );

    // Elegant entry scale for structural lines
    tl.fromTo("#lineLeft", { height: "0%" }, { height: "100%", duration: 1.5, ease: "power2.out" }, 0);
    tl.fromTo("#lineRight", { height: "0%" }, { height: "100%", duration: 1.5, ease: "power2.out" }, 0.2);
    tl.fromTo("#lineTop", { width: "0%" }, { width: "100%", duration: 1.5, ease: "power2.out" }, 0.4);
    tl.fromTo("#lineBottom", { width: "0%" }, { width: "100%", duration: 1.5, ease: "power2.out" }, 0.6);

    // --- Kinetic Text Scene Timelines ---

    // SCENE 1: 3D Hook Animation (0s to 3s)
    tl.set("#scene1", { display: "block" });
    tl.fromTo("#scene1",
      { opacity: 0, scale: 0.95, rotationX: 15, z: -100 },
      { opacity: 1, scale: 1, rotationX: 0, z: 0, duration: 1.0, ease: "power3.out" },
      0
    );
    // Smooth elegant 3D tilt out
    tl.to("#scene1",
      { opacity: 0, scale: 1.05, rotationX: -10, z: 50, duration: 0.7, ease: "power2.in" },
      2.3
    );
    tl.set("#scene1", { display: "none" }, 3);

    // SCENE 2: 3D Body Animation (3s to 6s)
    tl.set("#scene2", { display: "block" }, 3);
    tl.fromTo("#scene2",
      { opacity: 0, scale: 0.95, rotationY: -15, z: -80 },
      { opacity: 1, scale: 1, rotationY: 0, z: 0, duration: 1.0, ease: "power3.out" },
      3
    );
    // Smooth fade out back to loop
    tl.to("#scene2",
      { opacity: 0, scale: 0.95, duration: 0.6, ease: "power1.in" },
      5.4
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

- [ ] Video has a clean, premium visual aesthetic (no messy, overlapping or flashing text)
- [ ] Framing lines are integrated with low opacity (0.05 to 0.15) to structure the scene
- [ ] Dynamic geometric shapes or blobs exist in the background with low opacity (0.04 to 0.10)
- [ ] Subtle slow-drift, rotation, or entrance animations are wired into lines and background shapes
- [ ] Hook in first 3 seconds (curiosity gap)
- [ ] Words move or camera angles transform every 1–2s (active visual stimulation)
- [ ] Typography scale is completely fluid using CSS `clamp()` or relative viewport units
- [ ] Added 3D spatial properties (`perspective`, `transform-style: preserve-3d`) to trigger dynamic Z-axis animations
- [ ] Added high-quality SVG filter overlays for custom background aesthetics (grain, noise, dynamic gradient maps)
- [ ] Message is easily readable on mute (crucial for short-form retention metrics)
- [ ] Includes a visible hairline retention progress bar synced with the video duration
- [ ] Rendered MP4 is perfectly deterministic and seamlessly matches timeline durations
- [ ] `hyperframes check` passes successfully
