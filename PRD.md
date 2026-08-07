# Product Requirement Document (PRD): deepak-skill

## 1. Document Control & Overview

| Attribute | Details |
| :--- | :--- |
| **Product Name** | deepak-skill |
| **Description** | Open-source agent skills for programmatic, short-form video creation (Reels, TikTok, Shorts). |
| **Version** | 1.3.0 (Premium Video Generation & Interaction Interface Edition) |
| **Status** | Approved |
| **Author** | Jules (AI Assistant) |
| **Target Platforms** | Instagram Reels, TikTok, YouTube Shorts, and the agent skill ecosystem (Claude Code, Cursor, Codex, Gemini CLI, etc.) |

---

## 2. Executive Summary & Product Vision

### 2.1 Problem Statement
Creating engaging short-form video content (reels, shorts, TikToks) is highly resource-intensive, requiring specialized copywriting, motion graphics design, audio selection, and video editing expertise. Standard automated solutions produce low-quality, generic templates, while professional pipelines are expensive and slow. Existing AI tools often ignore mobile viewer behavior—where over **60% to 80% of content is watched on mute**, and the first **3 seconds determine retention**.

### 2.2 Product Vision
`deepak-skill` provides a highly optimized, modular, open-source set of AI skills that empowers developers and AI coding agents (such as Claude Code, Cursor, and Gemini CLI) to procedurally generate high-quality, high-retention, vertical (9:16) short-form videos. By centering around **deterministic HTML/CSS rendering (HyperFrames)**, **psychologically-driven retention engineering**, and **local open-source TTS & audio tools (Kokoro, FFmpeg)**, the product enables high-throughput, high-quality faceless video generation at zero commercial software cost.

---

## 3. Target Audience & Personas

- **AI Coding Agents (Primary Users):** Automated code interfaces that read these skills to write code, design animations, draft scripts, and build content pipelines directly in developer workspaces.
- **Indie Hackers & Content Engineers (Secondary Users):** Developers building automated faceless content channels, SaaS integrations, or viral programmatic traffic engines.
- **Digital Marketers & Creators:** Non-technical creators utilizing agent-assisted tools (like Cursor or Claude) to spin up localized or high-volume short-form campaigns.

---

## 4. Product Architecture & Skill Pipeline

The product operates as a unified three-part production pipeline where every stage directly feeds into the next:

```
[ Hook & Storyboard Skill ] ──(Syncs Script & Timebeats)──> [ Text Motion Reels Skill ]
                                                                       │
                                                            (Injects Timing & Visuals)
                                                                       ▼
[ Final Video / MP4 Output ] <───(FFmpeg Auto-Duck Mix)─── [ Voice & Audio SFX Skill ]
```

1. **What to Say (Hook & Storyboard):** Defines high-retention copywriting, maps out exact scene durations, and outputs timed script beats.
2. **How it Looks (Text Motion Reels):** Renders vertical 1080x1920 compositions utilizing HTML, CSS, and GSAP (Greensock) to sync visual animation with script timings.
3. **How it Sounds (Voice, SFX, Audio):** Generates broadcast-quality AI voices, introduces CC0/CC-BY music and SFX, and mixes them using FFmpeg sidechain compression.

---

## 5. Detailed Functional Requirements

### 5.1 Module 1: Hook, Storyboard & Retention Engineering (`hook-storyboard-retention`)

#### A. Purpose
To ensure videos stop the scroll in under 3 seconds, maximize average completion rates, and structuralize content around high-retention formulas.

#### B. Functional Specifications
- **Hook Formula Engine:** The system must suggest and structure content around one of the following key formulas:
  - *Curiosity Gap / Open Loop:* Creating incomplete loops (e.g., "Nobody is talking about this [X] strategy...").
  - *Contrarian / Pattern Break:* Challenging mainstream beliefs (e.g., "Everything you knew about [Y] is WRONG.").
  - *Results-First / Authority:* High-stakes proof (e.g., "How I went from 0 to 10k in 30 days.").
  - *Listicles & Numbers:* Specific, structured takeaways (e.g., "3 secrets that feel illegal to know.").
  - *Pain Point / Loss Aversion (PAS):* Identifying immediate struggle and introducing the cure.
- **Retention Curve Optimization:**
  - *The Cliff Fix:* Immediate hook visual in the first frame (no intros or slow logos).
  - *The Hump (Drop-off) Prevention:* Enforcing conceptual or visual shifts (scale pops, camera zooms, or layout swaps) every **1.5 to 2.0 seconds** (the mobile attention span threshold).
  - *Loop Architecture:* Hook matching the final frame seamlessly to trigger infinite rewatch counts.
- **Dual-Column Blueprint Sync:** Generates a structured Markdown table mapping exact audio scripts to visual motion transitions and exact text-on-screen timings.

---

### 5.2 Module 2: Text-Only Motion Reels (`text-motion-reels`) — *UPGRADED (PREMIUM)*

#### A. Purpose
To handle visual representation using typography-driven layout styles in standard HTML, optimized for headless-browser rendering (HyperFrames compatibility).

#### B. Premium Functional Specifications
- **Vertical Aspect Ratio:** Render exclusively in vertical 9:16 aspect ratio (**1080x1920 pixels**).
- **Mute-First Visual Layouts:** Typography-centric layouts where text remains perfectly legible in silence.
- **Clean Luxury Aesthetic (Anti-Messy):** Layouts must prioritize structured minimalism, high-end typography layout rules, elegant gold or champagne accent colors, and clean margins. Clashing text, high-frequency kinetic flickers, and overlapping frames are banned.
- **Low-Opacity Ambient Shapes:** Employs geometric decorations, background circular rings, or organic blobs at very low opacity (**0.04 to 0.10**) to build multi-layer cinematic depth.
- **Low-Opacity Structural Grid Lines:** Incorporates fine horizontal/vertical division lines and Luxury Crosshair framing details (at opacity **0.05 to 0.15**) acting as dynamic composition framing.
- **Slow Ambient Animations:** Background shapes and framing lines must possess slow, ambient micro-animations (e.g. drifting, 3D rotating, morphing, and line-drawing expansion effects) that run in parallel with kinetic text sequences.
- **Fluid & Responsive Typography Scale:** Uses CSS math functions (like `clamp()`) and relative viewport units (`vw`, `vh`) to automatically scale titles and details. This prevents overlapping and maintains perfect composition bounds on any render target device.
- **3D Spatial Typography Transitions:** Text containers and clips must leverage perspective and 3D transforms (`perspective: 1200px`, `transform-style: preserve-3d`) to enable Z-depth slides, 3D rotations, and camera-pan simulations.
- **Dynamic Organic Background Overlays:** Implement SVG `<filter>` elements generating fractal noise/turbulence color-mapped at small alphas (e.g. `0.05` to `0.15`) to supply dynamic, film-grain texture over standard gradients.
- **Visual Retention Indicators:** A dedicated, ultra-thin hairline progress bar or loading track synced programmatically with the absolute duration of the video timeline to enhance completion metrics.
- **Design Style Libraries:** Must support the creation of multiple styles:
  - *Stoic / Mindset Minimal:* Clean serif fonts, high contrast, atmospheric backgrounds.
  - *Reddit Storytime:* Chat/SMS interface bubbles with suspenseful pacing.
  - *Psychology Data Grids:* Modern sans-serif layouts with structured block reveals.
  - *Aesthetic Chaos Culture:* Poetic, raw typewriter typography with lo-fi aesthetics.
- **Programmatic Motion Sync (GSAP):**
  - Register a main paused timeline directly to `window.__timelines`.
  - Use programmatic timing triggers matching scene durations (via elements like `.clip` containing `data-start` and `data-duration` attributes).

---

### 5.3 Module 3: Open-Source Voiceover & Sound Design (`voice-sfx-audio`)

#### A. Purpose
To generate local, commercial-safe AI voiceovers and soundscapes, mixing them with programmatic ducking for a premium audio finish.

#### B. Functional Specifications
- **Local AI Voiceover Generation:**
  - Support high-quality, local TTS models with permissive licensing (e.g., Apache 2.0 or MIT) to ensure users can monetize their videos without licensing fees.
  - Recommended default: **Kokoro-82M** (extremely natural, runs on local CPU, covers multiple accents/languages).
  - Secondary/Lightweight: **Piper** (MIT, ideal for low-spec resource machines).
- **Copyright-Safe Media Selection:**
  - Filter and enforce CC0 (public domain) or CC-BY (requires attribution) licensing for background tracks and SFX (whoosh sounds, paper rustles, click feedback).
  - Enforce zero usage of non-commercial licenses (CC-NC) or personal/educational restriction libraries.
- **Automated FFmpeg Sidechain Ducking Mixer:**
  - Standardize audio outputs to typical streaming targets: **-14 LUFS** loudness.
  - Mix voiceover, background music (BGM), and SFX using sidechain compression:
    - *Voiceover Level:* 100% (leads the audio profile).
    - *BGM Level:* ~30% base, automatically dropping further when voiceover activates (ducking).
    - *SFX Level:* ~80% (punchy triggers on motion cuts).

---

## 6. Technical Stack & Architecture

| Layer | Recommended Technology | Purpose |
| :--- | :--- | :--- |
| **Layout & Render Engine** | HTML5, CSS3, Google Fonts | Core layout, 1080x1920 canvas setup |
| **Animation Engine** | GSAP (GreenSock Animation Platform) | Deterministic, pause-and-seek timeline animation |
| **Text-to-Speech (TTS)** | Kokoro-82M / Piper | High-speed, local CPU-capable, natural narration |
| **Audio/Video Processing** | FFmpeg | Video assembly, audio mixing, sidechain ducking, MP4 encoding |
| **Validation Utility** | HyperFrames | Verifies deterministic frame generation & scene composition |

### 6.1 Programmatic Audio Integration Example
Audio elements are embedded directly within HTML layouts so rendering engines can compile them side-by-side with GSAP visual timelines:
```html
<!-- Background music on a separate track at low default volume -->
<audio data-start="0" data-duration="15" data-track-index="1" data-volume="0.3" src="bgm_track.mp3"></audio>
<!-- Main voice track timed to the narration of scene 2 -->
<audio data-start="1.5" data-duration="8" data-track-index="2" data-volume="0.9" src="voiceover_scene2.wav"></audio>
```

---

## 7. Developer & Agent Interaction Interfaces (Prompts & Templates)

To allow developers and AI coding agents to interact with and invoke these skills reliably, the system supports standardized Prompt Templates.

### 7.1 Template 1: Premium Mindset & Stoic Wisom Reel
**Objective:** Generate a premium, high-retention video displaying mindset wisdom with floating geometry.
```
Act as a content engineering agent. Using deepak-skill, make a 20-second Stoic Wisdom Reel.

Specifications:
- Niche: Mindset & Stoic Wisdom
- Hook Formula: Contrarian / Pattern Break ("Everything you knew about focus is WRONG.")
- Design Vibe: Premium minimalism (Champagne Gold accents, #050505 background)
- Visual Overlays: Low-opacity animated lines (opacity 0.08) expanding horizontally, 2 background circles (opacity 0.04) slowly rotating.
- Voiceover: Kokoro 'af_heart' (US American female)
- Background track: CC0 lo-fi ambient pad (ducked to 25% volume under voice)

Generate:
1. Synchronized dual-column script & visual storyboard beats.
2. Complete, responsive, 1080x1920 HTML5 composition utilizing GSAP for the 3D text perspective transition, ambient shape morphs, and a hairline video progress tracker.
```

### 7.2 Template 2: Financial Grid-Reveals Reel
**Objective:** Create a structured grid template with numbered highlights.
```
Using deepak-skill, write and build a 15-second financial lists short.

Specifications:
- Niche: Finance & Wealth
- Hook Formula: Listicle ("3 finance secrets that feel illegal to know.")
- Design Vibe: Modern sans-serif, high-contrast grid lines
- Visual Overlays: Framing structural lines and crosshairs with 0.1 opacity. A progress bar loading at the bottom.
- Voiceover: Kokoro 'am_adam' (US American male)

Generate:
1. Line-by-line script and storyboard pacing beats.
2. Complete HyperFrames-compliant HTML with GSAP 3D Z-axis stagger animations on key financial secrets.
```

---

## 8. Non-Functional Requirements

### 8.1 Determinism
- **Frame-Perfect Rendering:** Same HTML composition input must produce the exact same sequence of frames and MP4 artifact. Randomization components (`Math.random()`) are banned unless seeded.
- **Timing Coherence:** If a storyboard specifies a visual cut at `2.5s`, the visual timeline must scale exactly at `2.5s` and the corresponding voiceover segment must match.

### 8.2 Developer Experience & Agent Compatibility
- **Clean Skill Metadata:** JSON/YAML header blocks (`SKILL.md`) so that LLM agents (Claude Code, Cursor) can instantly parse triggers, design specifications, and formulas.
- **Simplified CLI Installation:** Provide direct global and local setup commands using `npx skills` to streamline agent toolchains.

### 8.3 Licensing & Monetization
- All dependencies (TTS engines, voices, models, libraries, and asset packages) must adhere to commercial-use friendly licenses (MIT, Apache 2.0, CC0, CC-BY).
- Prevent model packages with non-commercial clauses (such as CC-BY-NC) from sneaking into default system templates.

---

## 9. Success Metrics & KPIs (Key Performance Indicators)

For content produced using these skills:

1. **Viewer Retention Rate:**
   - Over **70%** retention after the 3-second mark.
   - Average completion rate over **70-76%** on 15-second Reels.
2. **Audio Mixing Quality:** Master tracks outputted to exactly **-14 LUFS** with zero audio clipping.
3. **Execution Time:** A 15-second typography composition must build and export to MP4 in under 60 seconds on standard dual-core VPS setups.
4. **Agent Adoption Rate:** Integration compatibility across multiple major agent platforms (Claude Code, Cursor, Codex).

---

## 10. Upgrades & Changelog

| Version | Skill / Module | Type | Description |
| :--- | :--- | :--- | :--- |
| **v1.3.0** | `PRD.md` | **Interface Upgrade** | Embedded structured developer/agent Prompt Templates for Stoic and Financial listicle niches. |
| **v1.2.0** | `text-motion-reels` | **Premium Upgrade** | Enforced premium, anti-messy minimalist typography aesthetics. |
| **v1.2.0** | `text-motion-reels` | **Premium Upgrade** | Integrated fine horizontal/vertical framing lines with low opacity (0.05 - 0.15). |
| **v1.2.0** | `text-motion-reels` | **Premium Upgrade** | Added low-opacity animated geometric shapes and organic floating background blobs (0.04 - 0.10). |
| **v1.2.0** | `text-motion-reels` | **Premium Upgrade** | Programmed slow-drift, rotation, morphing, and path-entrance animations for framing lines and background shapes. |
| **v1.1.0** | `text-motion-reels` | **Feature Upgrade** | Added Fluid & Responsive Typography scaling via the `clamp()` formula. |
| **v1.1.0** | `text-motion-reels` | **Feature Upgrade** | Implemented 3D Spatial transitions with relative perspective & Z-axis translation. |
| **v1.1.0** | `text-motion-reels` | **Feature Upgrade** | Integrated dynamic film-grain & noise patterns via native background SVG fractal noise generation. |
| **v1.1.0** | `text-motion-reels` | **Feature Upgrade** | Built visual retention-boosting progress indicators into core template structure. |
| **v1.1.0-v1.3.0** | `PRD.md` | **Documentation** | Documented and synchronized the upgraded capabilities under Module 2 functional requirements and technical sections. |
