# Product Requirement Document (PRD): deepak-skill

## 1. Document Control & Overview

| Attribute | Details |
| :--- | :--- |
| **Product Name** | deepak-skill |
| **Description** | Open-source agent skills for programmatic, short-form video creation (Reels, TikTok, Shorts). |
| **Version** | 1.0.0 |
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

### 5.2 Module 2: Text-Only Motion Reels (`text-motion-reels`)

#### A. Purpose
To handle visual representation using typography-driven layout styles in standard HTML, optimized for headless-browser rendering (HyperFrames compatibility).

#### B. Functional Specifications
- **Vertical Aspect Ratio:** Render exclusively in vertical 9:16 aspect ratio (**1080x1920 pixels**).
- **Mute-First Visual Layouts:** Typography-centric layouts where text remains perfectly legible in silence.
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

## 7. Non-Functional Requirements

### 7.1 Determinism
- **Frame-Perfect Rendering:** Same HTML composition input must produce the exact same sequence of frames and MP4 artifact. Randomization components (`Math.random()`) are banned unless seeded.
- **Timing Coherence:** If a storyboard specifies a visual cut at `2.5s`, the visual timeline must scale exactly at `2.5s` and the corresponding voiceover segment must match.

### 7.2 Developer Experience & Agent Compatibility
- **Clean Skill Metadata:** JSON/YAML header blocks (`SKILL.md`) so that LLM agents (Claude Code, Cursor) can instantly parse triggers, design specifications, and formulas.
- **Simplified CLI Installation:** Provide direct global and local setup commands using `npx skills` to streamline agent toolchains.

### 7.3 Licensing & Monetization
- All dependencies (TTS engines, voices, models, libraries, and asset packages) must adhere to commercial-use friendly licenses (MIT, Apache 2.0, CC0, CC-BY).
- Prevent model packages with non-commercial clauses (such as CC-BY-NC) from sneaking into default system templates.

---

## 8. Success Metrics & KPIs (Key Performance Indicators)

For content produced using these skills:

1. **Viewer Retention Rate:**
   - Over **70%** retention after the 3-second mark.
   - Average completion rate over **70-76%** on 15-second Reels.
2. **Audio Mixing Quality:** Master tracks outputted to exactly **-14 LUFS** with zero audio clipping.
3. **Execution Time:** A 15-second typography composition must build and export to MP4 in under 60 seconds on standard dual-core VPS setups.
4. **Agent Adoption Rate:** Integration compatibility across multiple major agent platforms (Claude Code, Cursor, Codex).
