# Product Requirement Document (PRD): deepak-skill

## 1. Document Control & Overview

| Attribute | Details |
| :--- | :--- |
| **Product Name** | deepak-skill |
| **Description** | Open-source agent skills for programmatic, short-form video creation (Reels, TikTok, Shorts). |
| **Version** | 1.5.0 (Interactive Multistyle Selection & Premium Video Generation Edition) |
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

### 5.2 Module 2: Text-Only Motion Reels (`text-motion-reels`) — *UPGRADED (MULTISTYLE)*

#### A. Purpose
To handle visual representation using typography-driven layout styles in standard HTML, optimized for headless-browser rendering (HyperFrames compatibility).

#### B. Premium Functional Specifications & Supported Visual Styles
To scale viewer engagement, the video generation module must natively support three distinct trending visual aesthetics:

##### Style A: Vox-Style (The Analytical Explainer)
*   **Aesthetic Principle:** Clean, authoritative, documentary-style graphic reporting. Emulates investigative newspaper or factual reporting aesthetics.
*   **Typography:** Bold serif headings (e.g., Playfair Display or Georgia) combined with monospaced detail labels (e.g., Courier or Space Mono).
*   **Color Profile:** Cream or off-white background backgrounds (`#fbf9f5`) paired with jet-black text (`#1a1a1a`) and vibrant yellow highlighter sweeps (`#ffd166`).
*   **Unique Motion Cue:** Yellow highlighter sweeps that dynamically stretch across key words and slow map/document pan-and-zooms.

##### Style B: Hormozi-Style (High-Impact Captions)
*   **Aesthetic Principle:** Ultra-high impact, rapid engagement, loud and modern mobile captions. Optimized for instant read on mute.
*   **Typography:** Heavy, blocky, capitalized sans-serif fonts (e.g., Montserrat Black or Impact). Large size filling the lower-third quadrant.
*   **Color Profile:** Dark background (`#000000` or heavy gradient) with stark white text bounded by thick black strokes (`text-shadow` / outlines) and bright neon yellow or green highlights.
*   **Unique Motion Cue:** Word-by-word spring-scale bouncy pops where the active word highlights in neon yellow and scales up slightly on vocal cadence.

##### Style C: Minimalist Editorial (The Luxury Quiet)
*   **Aesthetic Principle:** High-end magazine layout, luxury quiet-fashion branding. Prioritizes generous white space and elegance.
*   **Typography:** High-contrast classic luxury serif typography (e.g., Bodoni, Didot, or Georgia) in regular weight with light italic accents.
*   **Color Profile:** Monochromatic slate, charcoal, or deep champagne backgrounds with thin low-opacity framing margins (opacity `0.05` to `0.15`).
*   **Unique Motion Cue:** Slow, soft fade-in slides and ambient floating shapes with subtle drifts.

- **Visual Retention Indicators:** A dedicated, ultra-thin hairline progress bar or loading track synced programmatically with the absolute duration of the video timeline to enhance completion metrics.
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

---

## 7. Developer & Agent Interaction Interfaces (Interactive Choice Wizard)

To enable developers and AI coding agents to interact with the skills dynamically, the system specifies an Interactive Wizard workflow.

### 7.1 Interactive Style Selection Prompts

When starting the workflow, the system prompts the user with the following select menus to configure the generation pipeline:

```
[System]: Welcome to the deepak-skill content generator. Which visual style do you want to build?
(1) Vox-Style (The Analytical Explainer)
(2) Hormozi-Style (High-Impact Captions)
(3) Minimalist Editorial (The Luxury Quiet)

[User]: 1

[System]: Vox-style selected (#fbf9f5 canvas, bold serif typography, dynamic highlighter elements).
         What is the core topic or niche for your video?

[User]: Psychology micro-lessons on cognitive biases.
```

### 7.2 Interactive Wizard Integration Prompt Templates

#### Template 1: Dynamic Vox-Style Selector Prompt
**Objective:** Programmatic wizard invoke for Style A.
```
Act as a content engineering agent. Initialize the deepak-skill choice wizard and choose:
- Visual Style: Option (1) - Vox-Style (Analytical Explainer)
- Niche: Psychology & Brain Bias
- Hook Formula: Curiosity Gap / Open Loop ("Nobody is talking about how your brain tricks you here...")
- Voiceover: Kokoro 'bm_george' (UK English male)
- Background track: CC0 acoustic investigatory guitar

Generate:
1. Double-column script and timed pacing beats.
2. Complete, responsive, 1080x1920 HTML5 composition utilizing GSAP for the drawing of the yellow highlight bar (#ffd166) under the active keyword.
```

#### Template 2: Dynamic Hormozi-Style Selector Prompt
**Objective:** Programmatic wizard invoke for Style B.
```
Act as a content engineering agent. Initialize the deepak-skill choice wizard and choose:
- Visual Style: Option (2) - Hormozi-Style (High-Impact Captions)
- Niche: Business & Entrepreneurship
- Hook Formula: Pain Point / Loss Aversion ("Stop wasting money on bad ads.")
- Voiceover: Kokoro 'am_adam' (US American male)

Generate:
1. Dynamic, highly dense vertical storyboard.
2. Complete, vertical HTML with GSAP executing word-by-word uppercase caption scaling on Montserrat Black.
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
| **v1.5.0** | `PRD.md` | **Interactive Upgrade** | Specified detailed user/agent Interactive Choice Wizard flow requirements and selection prompts for multiple visual styles. |
| **v1.4.0** | `PRD.md` | **Style Upgrades** | Defined explicit design guidelines and motion specs for Vox-style explainers, Hormozi-style captions, and Minimalist Editorial reels. Added Template 2 prompt for Vox shorts. |
| **v1.3.0** | `PRD.md` | **Interface Upgrade** | Embedded structured developer/agent Prompt Templates for Stoic and Financial listicle niches. |
| **v1.2.0** | `text-motion-reels` | **Premium Upgrade** | Enforced premium, anti-messy minimalist typography aesthetics. |
| **v1.2.0** | `text-motion-reels` | **Premium Upgrade** | Integrated fine horizontal/vertical framing lines with low opacity (0.05 - 0.15). |
| **v1.2.0** | `text-motion-reels` | **Premium Upgrade** | Added low-opacity animated geometric shapes and organic floating background blobs (0.04 - 0.10). |
| **v1.2.0** | `text-motion-reels` | **Premium Upgrade** | Programmed slow-drift, rotation, morphing, and path-entrance animations for framing lines and background shapes. |
| **v1.1.0** | `text-motion-reels` | **Feature Upgrade** | Added Fluid & Responsive Typography scaling via the `clamp()` formula. |
| **v1.1.0** | `text-motion-reels` | **Feature Upgrade** | Implemented 3D Spatial transitions with relative perspective & Z-axis translation. |
| **v1.1.0** | `text-motion-reels` | **Feature Upgrade** | Integrated dynamic film-grain & noise patterns via native background SVG fractal noise generation. |
| **v1.1.0** | `text-motion-reels` | **Feature Upgrade** | Built visual retention-boosting progress indicators into core template structure. |
| **v1.1.0-v1.5.0** | `PRD.md` | **Documentation** | Documented and synchronized the upgraded capabilities under Module 2 functional requirements and technical sections. |
