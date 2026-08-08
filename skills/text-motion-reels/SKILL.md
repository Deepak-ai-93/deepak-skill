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

## Step 0 — Trend research & brainstorming (do this before the wizard)

The wizard picks the *format*; first you must pick the *angle*. Research what is rising in the niche right now, then brainstorm:

1. **Trend signals** — if `video-product-pipeline` is installed, run `node scripts/trend-hunt.mjs --niche "{topic}" --subreddits "{r1},{r2}" --geo US` (Reddit top-of-day + Google Trends, no API key); web-research TikTok Creative Center, X, YouTube Trending, niche subreddits. **Freshness rule:** rising > peaked — nothing older than ~14 days.
2. **Brainstorm ≥5 angles** — hook-formula remix (curiosity / contrarian / results / list / PAS applied to the trend), audience lens (beginner / skeptic / expert), pain-first (the most repeated pain in the signals).
3. **Score with the viral scorecard (1–5 each, /35):** Relatability · Curiosity gap · Hook strength · Format fit · Trend momentum · Mute-first clarity · Loopability. Winner = highest score (tie → curiosity gap).
4. **Lock the winner** — the winning hook drives the format selection and the beat sheet. Then run the wizard below.

## Step 1 — Run the Format Wizard (always do this first)

Never start coding a composition without first running the **format selection wizard**. The wizard decides the visual language (typography, palette, motion system, effects) for the whole video — it is the single most important decision.

### Wizard prompt flow

```
[Agent]: Welcome to the Text-Motion Reel Generator. Pick a trending format:
        (1) Word Pop       — Hormozi-style high-impact captions (business, hot takes)
        (2) Highlighter    — Vox-style analytical explainer (psychology, facts)
        (3) 3D Editorial   — Luxury quiet minimalist (mindset, stoic)
        (4) Card Listicle  — Numbered save-bait grid (finance, productivity)
        (5) Chat Thriller  — Text-message storytime (reddit, drama)
        (6) SVG Ambient    — Animated SVG backgrounds (mindset, aesthetic, brand)

[User]: 3

[Agent]: 3D Editorial selected (slug: 3d-editorial).
        Topic / niche?        → "mental clarity"
        Hook (≤8 words)?      → "How I mastered mental clarity in three weeks."
        Duration? (default 15s)→ 15
        Audio? → voice (always-on, synced to text beats — see Always-on voiceover)
```

### Wizard rules

1. **Ask first.** Present the 1–6 menu and wait for the user's selection before writing any HTML.
2. **Always confirm the format slug** — it is reused for the output filename (see Rendering to 4K).
3. Collect topic, hook, duration, and audio preference after the format is locked in.
4. Build the composition using ONLY the chosen format's spec below (typography, palette, motion, effects). Do not mix format styles.
5. Default duration is 15s unless the user says otherwise. Beat count = seconds ÷ 2.
6. **Voiceover is always-on.** Every reel gets a Kokoro voiceover synced beat-for-beat to the text (see Always-on voiceover).

### Single-command agent template (wizard + build + render in one shot)

```
Act as a text-motion reel engineer using the text-motion-reels skill.
1. Run the format wizard: ask the user to pick format 1-6 (Word Pop / Highlighter /
   3D Editorial / Card Listicle / Chat Thriller / SVG Ambient) and gather topic, hook, duration, audio.
2. Build the 1080x1920 HTML composition strictly per the chosen format's spec.
3. Register the paused GSAP timeline on window.__timelines.reel.
4. Generate the voiceover and sync every line to its text beat (see Always-on voiceover).
5. Render at vertical 4K into the proper folder output/{format-slug}_{topic-slug}_4k/ (see Rendering to 4K section).
6. Write caption.md into the output folder (see Caption pack section).
```

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

---

## The 6 Trending Text-Only Formats (format library)

Pick ONE format via the wizard and build the composition strictly to its spec below.

### Format 1 — Word Pop (`word-pop`)
*Hormozi-style high-impact captions. Fast, loud, mute-first.*

- **Best for:** Business, finance, hot takes, motivation. **Hook:** Contrarian / PAS.
- **Typography:** Montserrat Black or Impact, UPPERCASE, `clamp(3.5rem, 9vw, 8rem)`, line-height 1.05, letter-spacing -0.02em.
- **Palette:** bg `#000`, text `#fff`, accent `#ffd60a` (neon yellow, or `#39ff14`); thick black stroke via `text-shadow` ring so text survives any backdrop.
- **Layout:** Text anchored in the lower-third safe zone (below center, above UI overlays). MAX 6 words on screen at once.
- **Motion system (GSAP):** Word-by-word spring pop — each word `from { scale: 1.35, opacity: 0 }` to `{ scale: 1, opacity: 1 }` with `elastic.out(1, 0.6)` on cadence. Active word highlights neon + scales 1.08; previous words dim to 40% gray.
- **Signature effects:** 10ms full-frame white flash on the pattern-break word; micro screen shake (`x: ±4px`, 0.1s) on big claims; optional beat-synced audio thump.
- **Retention device:** 6-word cap = one-glance readability; the hook word pops FIRST, before the rest of the sentence.

### Format 2 — Highlighter (`highlighter`)
*Vox-style analytical explainer. Documentary, authoritative, "receipt" energy.*

- **Best for:** Psychology, science, "how X works", facts. **Hook:** Curiosity gap.
- **Typography:** Playfair Display / Georgia bold serif headline + Space Mono / Courier monospace detail labels, `clamp(3rem, 7vw, 6.5rem)`.
- **Palette:** bg `#fbf9f5` cream, text `#1a1a1a`, accent `#ffd166` (highlighter yellow); thin `#1a1a1a` at 12% grid lines.
- **Layout:** Centered headline with generous margins; monospace stat/source cards sit below as "receipts".
- **Motion system (GSAP):** Yellow highlighter sweeps left→right under the active keyword (`scaleX: 0 → 1`, 0.25s, `power3.out`, transform-origin left); underline re-draw; slow map-style pan/zoom of the whole canvas between beats (`scale: 1.0 → 1.06`, `x`/`y` drift, 2s, `none`).
- **Signature effects:** Stat numbers count up (e.g. `0 → 87%`); monospace labels typewriter-reveal; crosshair + grid lines for the "investigation" frame.
- **Retention device:** Every claim gets a visual receipt card → feels researched → drives saves.

### Format 3 — 3D Editorial (`3d-editorial`)
*Luxury quiet minimalist. The default premium skeleton in this skill.*

- **Best for:** Mindset, stoic wisdom, luxury branding. **Hook:** Results-first / authority.
- **Typography:** Bodoni Moda / Didot / Cormorant Garamond, regular weight with light italic accents, `clamp(3.8rem, 7.5vw, 6.8rem)`.
- **Palette:** bg `#0b0b0d`, text `#f5f2ea`, accent champagne `#e5c158`; framing lines `rgba(255,255,255,0.08)`; blobs `rgba(255,255,255,0.04)`.
- **Layout:** Centered text block at 75% width, generous whitespace, hairline framing lines + corner crosshairs.
- **Motion system (GSAP):** 3D perspective entry — `rotationX/rotationY: ±15°, z: -100 → 0` with `power3.out` (stage needs `perspective: 1200px; transform-style: preserve-3d`); slow camera push-in across scenes; key phrase gets a gentle Z-axis pull toward the viewer.
- **Signature effects:** SVG fractal-noise film grain overlay (opacity 0.06), breathing organic blobs (`scale 0.95 ↔ 1.05`, `rotation ±12°`), champagne-gold fade on the money word, hairline progress bar.
- **Retention device:** Slow luxury pace; loop ending mirrors frame 1 for infinite rewatch.

### Format 4 — Card Listicle (`card-listicle`)
*Numbered save-bait grid. Structured, scroll-stopping lists.*

- **Best for:** Wealth, productivity, "X things…". **Hook:** Specific number / list.
- **Typography:** Inter / Montserrat bold numerals + clean sans body, `clamp(2.6rem, 6.5vw, 5.5rem)` for numbers.
- **Palette:** bg `#0a0a0f`, cards `rgba(255,255,255,0.04)` with 1px `rgba(255,255,255,0.08)` borders, accent `#7c5cff` or gold; thin grid dividers.
- **Layout:** Vertical stack of numbered cards divided by hairlines; progress dots along the top edge.
- **Motion system (GSAP):** Cards flip in from alternating sides (`rotateY: -90° → 0`, `back.out(1.7)`, origin left/right); number badge count-up; the "best/easiest" item pops bigger with accent color change + micro shake.
- **Signature effects:** Progress dots fill one-per-item; end frame stacks ALL cards as a save bait; subtle glitch on the punchline number.
- **Retention device:** Open loop ("what's #4?") — the last card reveals only in the final 2 seconds.

### Format 5 — Chat Thriller (`chat-thriller`)
*Text-message storytime. Suspense via simulated iMessage UI.*

- **Best for:** Reddit stories, confessionals, drama. **Hook:** Open loop / cliffhanger.
- **Typography:** System UI stack (`-apple-system, Segoe UI, Roboto`), `clamp(1.4rem, 3vw, 2.2rem)`.
- **Palette:** bg `#0f172a`-dark chat theme; bubbles `#262d40` (incoming) / `#2f6fed` (outgoing), text white.
- **Layout:** Full simulated chat — top contact bar, timestamps, chat bubbles, typing indicator, one bubble per beat.
- **Motion system (GSAP):** Bubbles pop in (`scale: 0.8 → 1`, `back.out(1.7)`); typing dots animate 0.6s before each reveal (suspense); read-receipt ticks fill in after each bubble.
- **Signature effects:** Bubble tint flips red/green on emotional turns; keystroke SFX cue per bubble; final frame flashes the full "screenshot" of the whole chat at the payoff.
- **Retention device:** The cliffhanger bubble ("…and then he replied:") IS the loop ending → forces rewatch.

### Format 6 — SVG Ambient (`svg-ambient`)
*Animated SVG motion graphics. Generative ambient layers behind luxury type.*

- **Best for:** Mindset, aesthetics, product/brand reveals, "vibe" content. **Hook:** Curiosity gap / aesthetic.
- **Typography:** Bodoni Moda / Cormorant Garamond serif headline with light italic accents, `clamp(3.8rem, 7.5vw, 6.8rem)` — same voice as 3D Editorial.
- **Palette:** deep charcoal bg `#0a0a0d`, ivory text `#f5f2ea`, ONE signature accent (champagne `#e5c158` or electric violet `#7c5cff`); all SVG strokes/shapes tinted to the accent at low opacity.
- **Layout:** Text in the central reading column (centered, 75% width, y 28–72%). SVG animation confined to the top band, bottom band, and side gutters via `.bg-clip` containers with `overflow: hidden` (see Animated SVG backgrounds section).
- **Motion system (GSAP only — NO SMIL):** rotating dashed ring in the top band; breathing/morphing blob in a corner; 8–12 drifting particles in the gutters; optional vivus.js fine-frame line draw. Every tween is transform-only (`rotation`, `scale`, `x/y`) for 4K GPU-cheap rendering.
- **Signature effects:** static feTurbulence grain overlay (z-index 10, opacity 0.06); accent pulse ring at 5% opacity behind the hook word; hairline progress bar.
- **Retention device:** ambient motion keeps the frame alive between text beats; loop ending mirrors frame 1 for rewatch.
- **4K perf:** max 4 SVG containers, ~20 nodes total, transforms only — never animate `fill`/`stroke` per frame.

### Format cheat-sheet

| # | Format | Slug | Pace | Best niche | Signature motion |
|---|--------|------|------|------------|------------------|
| 1 | Word Pop | `word-pop` | Fast | Business | spring-scale words, white flash |
| 2 | Highlighter | `highlighter` | Medium | Psychology | highlighter sweep, stat count-up |
| 3 | 3D Editorial | `3d-editorial` | Slow | Mindset | perspective tilt, film grain |
| 4 | Card Listicle | `card-listicle` | Medium | Finance | flip cards, progress dots |
| 5 | Chat Thriller | `chat-thriller` | Medium-fast | Storytime | bubbles, typing dots |
| 6 | SVG Ambient | `svg-ambient` | Slow-medium | Mindset / Brand | animated rings, morph blobs, particles |

## Animated SVG backgrounds (no text overlap)

Add open-source animated SVG motion BEHIND the typography — never on top of it. This is the library-tier (Option B) approach: permissively-licensed libraries driving your own SVG, all synchronized to the single paused GSAP timeline.

### Allowed libraries (all commercial-safe)

| Library | License | Use it for |
|---|---|---|
| GSAP core | Free (Standard) | transforms, `stroke-dashoffset`, `pathLength`, SVG attribute tweens — already in the stack |
| KUTE.js | MIT | free path morphing (shape A → shape B) |
| vivus.js | MIT | hand-drawn line reveals (fine wireframes) |
| anime.js | MIT | SVG attrs + path-following motion |
| SVG.js | MIT | procedural SVG building + animation |
| mo.js | MIT | bursts / curve motion graphics |
| lottie-web | MIT | Lottie JSON rendered to SVG (source: LottieFiles free library, Lottie Simple License — commercial use OK, attribution optional) |

### The one hard rule: NO SMIL

Native SVG `<animate>` tags cannot be scrubbed by the paused GSAP timeline (`tl.progress()`), which breaks deterministic frame rendering. Every animated property MUST be driven from the single paused timeline registered on `window.__timelines`. For Lottie: embed the JSON inline and call `lottie.goToAndStop(frame, true)` on every rendered frame. No `Math.random()` — seed anything random.

### Layer stack (text always wins)

| z-index | Layer |
|---|---|
| 1 | animated SVG background containers (clipped) |
| 2 | optional readability backplate — soft dark radial vignette only where text sits |
| 3 | text container (never below 3) |
| 5 | hairline progress bar |
| 10 | static film-grain overlay (opacity 0.06) |

### Zone map (9:16)

- Text lives ONLY in the central reading column: centered, 75% width, y ≈ 28%–72%.
- Animations live ONLY in: top band (y 0–25%), bottom band (y 75–100%), left/right gutters (x 0–12% / 88–100%).
- Wrap every animated SVG in a `.bg-clip` container with `overflow: hidden` so stray paths physically cannot cross into the text column.
- Opacity: full animated scenes 15–35%; decorative shapes 4–15% (existing rule). Tint to the reel palette.

### Working background-layer example (GSAP-driven)

```html
<style>
  .bg-clip { position: absolute; overflow: hidden; z-index: 1; pointer-events: none; }
  .bg-top    { top: 0;    left: 0;   width: 100%;   height: 480px; }
  .bg-corner { bottom: 0; left: 0;   width: 540px;  height: 540px; }
  .bg-gutter { top: 0;    right: 0;  width: 120px;  height: 100%; }
  .bg-clip svg { width: 100%; height: 100%; display: block; }
</style>

<!-- Layer 1: animated SVG, clipped to bands/gutters (z-index 1) -->
<div class="bg-clip bg-top">
  <svg viewBox="0 0 1080 480" xmlns="http://www.w3.org/2000/svg">
    <circle id="bgRing" cx="540" cy="240" r="170" fill="none"
            stroke="rgba(229,193,88,0.5)" stroke-width="1.5" stroke-dasharray="4 14"/>
  </svg>
</div>
<div class="bg-clip bg-corner">
  <svg viewBox="0 0 540 540" xmlns="http://www.w3.org/2000/svg">
    <path id="bgBlob" fill="rgba(255,255,255,0.06)"
          d="M270,60C390,60 470,140 470,260C470,390 380,480 270,480C160,480 70,390 70,260C70,140 150,60 270,60Z"/>
  </svg>
</div>
<div class="bg-clip bg-gutter">
  <svg viewBox="0 0 120 1920" xmlns="http://www.w3.org/2000/svg">
    <circle id="p1" cx="60" cy="300" r="3"    fill="rgba(255,255,255,0.5)"/>
    <circle id="p2" cx="60" cy="900" r="2"    fill="rgba(255,255,255,0.4)"/>
    <circle id="p3" cx="60" cy="1500" r="2.5" fill="rgba(255,255,255,0.45)"/>
  </svg>
</div>

<!-- Layer 3: text stays above all animation -->
<div class="text-container">
  <div id="scene1" class="clip" data-start="0" data-duration="3">
    <h1 class="title-large">Mastery is <span class="highlight-text">subtraction.</span></h1>
  </div>
</div>

<script>
  const tl = gsap.timeline({ paused: true });
  const D = 6; // seconds

  // Rotating dashed ring — transform-only, GPU cheap at 4K
  tl.fromTo("#bgRing", { rotation: 0, transformOrigin: "50% 50%" },
            { rotation: 360, duration: D, ease: "none" }, 0);

  // Blob breathing — same path, scale/rotate only
  tl.fromTo("#bgBlob", { scale: 0.92, rotation: 0, transformOrigin: "50% 50%" },
            { scale: 1.08, rotation: 8, duration: D, ease: "sine.inOut", yoyo: true, repeat: 1 }, 0);

  // Particles drift — transform-only loops
  tl.fromTo("#p1", { y: 0 }, { y: 260, duration: 3.0, ease: "none", yoyo: true, repeat: 1 }, 0);
  tl.fromTo("#p2", { y: 0 }, { y: 320, duration: 3.6, ease: "none", yoyo: true, repeat: 1 }, 0.6);
  tl.fromTo("#p3", { y: 0 }, { y: 300, duration: 3.2, ease: "none", yoyo: true, repeat: 1 }, 1.1);

  // Hook scene + progress bar (existing pattern)
  tl.from("#scene1", { opacity: 0, y: 40, duration: 0.6, ease: "power2.out" }, 0);
  tl.fromTo("#progressbar", { width: "0%" }, { width: "100%", duration: D, ease: "none" }, 0);

  window.__timelines = window.__timelines || {};
  window.__timelines.reel = tl;
</script>
```

### 4K performance rules

- Max 4 SVG containers / ~20 nodes per composition.
- Animate transforms ONLY (`rotation`, `scale`, `x/y`) — never `fill`, `stroke`, or `d` per frame.
- Do not apply filters to animated elements (feTurbulence grain stays static).
- Lottie: keep to one small loop, preload JSON inline, seek with `goToAndStop`.

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
4. **Add voiceover (always-on)** — one Kokoro voice line per text beat, auto-fit into its `data-start`/`data-duration` window (see Always-on voiceover).
5. **Lint & check** — validate composition (`hyperframes check`).
6. **Preview** — live-reload browser preview.
7. **Render** — deterministic vertical 4K MP4 (2160x3840) via headless Chrome + FFmpeg into the proper output folder (see below).
8. **Caption pack** — write `caption.md` into the output folder (see Caption pack section).

## Always-on voiceover (text ↔ voice sync contract)

Every reel gets a voiceover by default — no silent reels. The voice is generated with the `voice-sfx-audio` skill (Kokoro-82M, Apache 2.0, commercial-safe) and MUST be synchronized to the on-screen text beat-for-beat.

### The sync contract (hard rules)

1. **One script line = one text beat = one voice line.** Each beat is 3–6 words (2–2.5s window max).
2. **Write beats FIRST**, then derive everything from them:
   - HTML: `data-start` / `data-duration` on each `.clip`
   - GSAP: timeline positions identical to the beat starts
   - Voice: the `generate-voice.mjs` LINES array uses the same `[start, maxDur, text]`
3. **Auto-fit, don't stretch:** `generate-voice.mjs` fits each line into its window via Kokoro's speed param (cap 1.35x). If a line still can't fit, SHORTEN THE COPY — never widen the window.
4. **The text appears exactly when the voice says it** — a visual change at every beat start, matching the narration (1.5–2s stimulus cycle preserved).
5. **Mix + mux:** `mix-audio.sh` places each line at its beat start, sidechain-ducks the ambient bed under the voice (voice 100% / bed ~30% → ducked), masters to **-14 LUFS**. Render with `--audio assets/full_mix.m4a`.
6. **Verify:** check the `FITS ✓` log lines from `generate-voice.mjs` (every `dur <= window`).

Voice delivery by beat: hook = energetic/faster; body = calm natural cadence; CTA = confident. (See `voice-sfx-audio` for voices + licensing — commercial-safe only.)

---

## Rendering to 4K with a proper filename

### Resolution strategy

- **Design at 1080x1920 CSS** (the stage in the skeleton below) — ergonomic to author.
- **Render at device scale factor 2** → output is a true **2160x3840 vertical 4K (UHD)** image. All `clamp()` typography scales fluidly, so compositions hold pixel-perfect at 4K with zero extra CSS.
- FPS: 30. Determinism contract unchanged: same HTML → same frames → same MP4.

### Render command (this repo's `render/render-frames.mjs`)

```bash
node render/render-frames.mjs \
  --html word-pop_reel.html \
  --name word-pop_money-rules_4k \
  --duration 15 --fps 30 \
  --scale 2              # 1080x1920 CSS x2 -> 2160x3840 (4K)
  # --audio assets/full_mix.m4a   # optional: mux a mixed audio track
  # --no-assemble                 # frames only, skip the MP4 step
```

Outputs (one proper folder per video):
- `output/{name}/frames/frame_0000.jpg` … (source frames)
- `output/{name}/{name}.mp4` (H.264, yuv420p, CRF 18, faststart, resolution verified by ffprobe)
- `output/{name}/caption.md` (see Caption pack)

### Filename convention (the "proper name")

`{format-slug}_{topic-slug}_4k.mp4` — lowercase, hyphens for spaces, topic capped at 3 words.

| Format chosen | Topic | Output name |
|---|---|---|
| Word Pop | money rules | `word-pop_money-rules_4k.mp4` |
| Highlighter | cognitive biases | `highlighter_cognitive-biases_4k.mp4` |
| 3D Editorial | mental clarity | `3d-editorial_mental-clarity_4k.mp4` |
| Card Listicle | 5 habits | `card-listicle_5-habits_4k.mp4` |
| Chat Thriller | reddit roommate | `chat-thriller_reddit-roommate_4k.mp4` |

A voiceover is ALWAYS generated and synced to the beats (see Always-on voiceover), mixed with the `voice-sfx-audio` skill, and muxed at render time with `--audio assets/full_mix.m4a`.

---

## Caption pack (caption.md)

After rendering, write a **`caption.md`** into the output folder (same folder as the MP4). It contains ready-to-post, high-CTR captions for every major platform — formatted, character-compatible, and **zero hashtags**.

### Caption rules (apply to every platform)

1. **Hook-first:** the first sentence stops the scroll (question, bold claim, or result) — the caption mirrors the video's hook.
2. **High CTR / high engagement:** specific numbers, curiosity, one clear CTA ("Save this", "Comment your #", "Follow for part 2"). No hashtags, no tag-spam, max 2 emojis.
3. **E-E-A-T tone:** authoritative, honest, specific — no hype lies, no fake screenshots. Back claims ("I tested this for 90 days").
4. **Proper format:** short punchy lines, blank line between hook / value / CTA.
5. **Character-compatible:** every platform caption targets **500–900 characters (aim ~700)** — see Character window below. No control characters; smart quotes and em-dashes are safe everywhere.

### Character window (ALL platforms)

Every caption body targets **500–900 characters (aim ~700)** — uniform across every platform. No more platform-length variations.

| Platform | Target window |
|---|---|
| YouTube Shorts — title | ≤100 (platform hard cap — this is a title, not a caption) |
| YouTube Shorts — description | 500–900 |
| Instagram | 500–900 |
| TikTok | 500–900 |
| X (Twitter) | 500–900 (platform truncates at 280 → hook + CTA in first 280) |
| Threads | 500–900 |
| LinkedIn | 500–900 |
| Facebook | 500–900 |

**Truncation-safe rule:** put the hook in the first sentence and the CTA in the last line of EVERY section — then even if a platform cuts the middle, the post still converts.

### caption.md template

```markdown
# Caption Pack — {topic} ({format-slug})

Video: output/{name}_4k/{name}_4k.mp4
Voiceover: Kokoro ({voice}) • Duration: {s}s • 4K vertical • No hashtags

## YouTube Shorts
### Title (≤100 — platform hard cap)
[High-CTR title — hook phrase, ≤100 chars]
### Description ({n}/500–900 chars)
[Hook line]

[Value: 2–3 short lines, one per beat]

[CTA: "Save this. Share it with someone who needs it."]

## Instagram ({n}/500–900 chars)
[Same structure, platform tone — casual, ends with a conversation-starter question]

## X / Twitter ({n}/500–900 chars)
[Full 500–900 copy — hook + CTA must fit within the first 280 chars]

## Threads ({n}/500–900 chars)
[Conversational hook + one takeaway]

## LinkedIn ({n}/500–900 chars)
[Professional framing: insight → why it matters → CTA for your network]

## TikTok ({n}/500–900 chars)
[Trend-aware hook + caption text]
```

### Character-count rule

Count every section before finalizing (`wc -m`). Each section MUST land in the **500–900 window** (aim ~700):
- Under 500 → add value (a concrete example or stat), never padding.
- Over 900 → cut filler, never the hook or the CTA.

---

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
- [ ] Format wizard run first: format slug, topic, hook, duration, audio all confirmed
- [ ] Composition follows ONLY the chosen format's spec (typography, palette, motion, effects)
- [ ] Rendered MP4 is perfectly deterministic and seamlessly matches timeline durations
- [ ] Rendered at vertical 4K (2160x3840 via `--scale 2`)
- [ ] Output named `{format-slug}_{topic-slug}_4k.mp4` and resolution verified with ffprobe
- [ ] Animated SVG (if used) is GSAP-driven only — no SMIL, no per-frame `fill`/`stroke` animation
- [ ] SVG confined to top/bottom bands + gutters via `.bg-clip` (overflow hidden); text column untouched
- [ ] Voiceover generated for every beat and auto-fit into its window (FITS ✓ in the log)
- [ ] Voice ↔ text sync: `data-start`/`data-duration` == GSAP positions == voice line starts
- [ ] Rendered 4K into the proper folder `output/{name}/` with MP4 + frames
- [ ] `caption.md` written into the output folder — per-platform sections, no hashtags, under char limits
- [ ] `hyperframes check` passes successfully
