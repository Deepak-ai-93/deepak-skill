# deepak-skill 🎬

Open-source agent skills for creating **short-form video content and carousel posts** — text-only motion graphic reels, viral hook copywriting, storyboarding, retention engineering, AI voiceover + sound design, and native-image-model carousels. Built for AI coding agents (Claude Code, Cursor, Codex, Gemini CLI, Antigravity CLI, Grok Build, and 70+ more via the skills ecosystem).

[![skills.sh](https://skills.sh/b/Deepak-ai-93/deepak-skill)](https://skills.sh/Deepak-ai-93/deepak-skill)

## What's inside

| Skill | What it does |
|---|---|
| **text-motion-reels** | Create trending text-only motion graphic reels (kinetic typography) as HyperFrames HTML compositions — 5 trending formats, design styles, viral formulas. Starts with an interactive **format wizard** and renders at **4K** |
| **hook-storyboard-retention** | Write scroll-stopping hooks, engineer watch-time, and build beat-by-beat storyboards with script ↔ video timeline in sync |
| **voice-sfx-audio** | Open-source TTS voiceovers (Kokoro, Piper, etc.), royalty-free SFX/music sources with license guidance, FFmpeg audio ducking, and a **deep-voice recipe** (Tier 1: Kokoro male voice + FFmpeg pitch/EQ — see [voice-plan.md](voice-plan.md)) |
| **video-asset-reels** | Build reels from your own video clips & images — understand the prompt, cut assets to beats, overlay kinetic text, sync a voiceover, render 4K (see [PLAN.md](PLAN.md)) |
| **video-product-pipeline** | The viral-engineered gatekeeper for every video request: hunt trending topics (`trend-hunt.mjs` + web research) → brainstorm + score angles → analyze ANY prompt (sloppy or not) → write a `video-product.md` spec → **get your approval** → generate (text-motion / asset reels) → audit the frames with a script + dedicated auditor subagent (spelling, text overlap, safe zones, style, readability) |
| **carousel-post-images** | Scroll-stopping carousel posts (LinkedIn/Instagram) as image sets — **4K generation** via native image models (Antigravity CLI, Codex `image_gen`, Grok `/imagine`): photorealistic **real-life scenario visuals**, viral **anti-fluff copywriting** (hook formulas + fluff blocklist), 4 trending design styles (Cinematic Real-Life default), per-platform `caption.md`, + deterministic HTML→PNG fallback (`render-carousel.mjs --4k`) |

The skills are a complete production pipeline: **what's trending** (research + brainstorm) → **what to say** (hooks) → **how it looks** (motion / assets) → **how it sounds** (voice/SFX) → **approved & audited** (video-product-pipeline).

---

## Quick start — install in your project (3 steps)

### 1. Prerequisites

- **Node.js 18+** (installs `npx` automatically)
- **Google Chrome** — used to render frames
- **FFmpeg** — assembles the final MP4 (only needed for video output)

### 2. Install the video skills

Run this **inside your project folder**:

```bash
npx skills add Deepak-ai-93/deepak-skill --all
```

That's it. It installs all six skills into `.agents/skills/` — no heavy media, no demo files.

### 3. Use it with any CLI

Just ask your agent (Claude Code, Cursor, Codex, Gemini CLI, etc.):

> "Using the text-motion skills, make a 20-second psychology-facts reel with a strong hook, beat-synced typography, and a Kokoro voiceover."

The agent will run the format wizard, build the composition, and render your 4K reel.

---

## Install options

| What you want | Command |
|---|---|
| All skills into the current project | `npx skills add Deepak-ai-93/deepak-skill --all` |
| A single skill | `npx skills add Deepak-ai-93/deepak-skill --skill text-motion-reels` |
| **video-asset-reels only** (self-contained — SKILL.md + scripts/, works standalone in any project) | `npx skills add Deepak-ai-93/deepak-skill --skill video-asset-reels` |
| **video-product-pipeline only** (self-contained — SKILL.md + scripts/, works standalone in any project) | `npx skills add Deepak-ai-93/deepak-skill --skill video-product-pipeline` |
| **carousel-post-images only** (self-contained — SKILL.md + scripts/ + examples/, works standalone in any project) | `npx skills add Deepak-ai-93/deepak-skill --skill carousel-post-images` |
| Install globally (any project, any machine) | `npx skills add Deepak-ai-93/deepak-skill --all -g` |
| Target specific agents | `npx skills add Deepak-ai-93/deepak-skill --all -a claude-code -a cursor` |
| Install from a local clone | `npx skills add ./deepak-skill --all` |

**Verify the install:**

```bash
ls .agents/skills/
# carousel-post-images  hook-storyboard-retention  text-motion-reels
# video-asset-reels  video-product-pipeline  voice-sfx-audio
```

**Update:** `npx skills update` • **Remove:** `npx skills remove <skill-name>`

See the [skills.sh docs](https://www.skills.sh/docs) for more options (`--list`, `--copy`, packs, etc.).

---

## Usage

### Format wizard + 4K rendering (`text-motion-reels`)

The `text-motion-reels` skill starts with an **interactive format wizard** — the agent asks you to pick one of 6 trending text-only formats before building anything:

1. **Word Pop** — Hormozi-style high-impact captions (business, hot takes)
2. **Highlighter** — Vox-style analytical explainer (psychology, facts)
3. **3D Editorial** — luxury quiet minimalist (mindset, stoic)
4. **Card Listicle** — numbered save-bait grid (finance, productivity)
5. **Chat Thriller** — text-message storytime (reddit, drama)
6. **SVG Ambient** — animated SVG backgrounds (mindset, aesthetic, brand)

After you pick a format, the agent builds the composition to that format's spec, generates a **beat-synced voiceover** (Kokoro), renders it at **vertical 4K (2160x3840)** into a proper folder, and writes a ready-to-post `caption.md`:

```bash
node render/render-frames.mjs --html word-pop_reel.html --name word-pop_money-rules_4k --duration 15 --fps 30 --scale 2 --audio assets/full_mix.m4a
```

Output → one folder per video:

```
output/word-pop_money-rules_4k/
├── word-pop_money-rules_4k.mp4   # 2160x3840, H.264, -14 LUFS mix
├── frames/                        # source frames
└── caption.md                     # YouTube Shorts, Instagram, X, LinkedIn, TikTok, Threads captions
```

### Sample prompts

| Goal | Prompt |
|---|---|
| Hook + storyboard only | "Write a scroll-stopping hook and 15-second storyboard for a finance reel." |
| Full text-only reel | "Make a 20-second psychology reel using the Word Pop format, hook: 'Your brain does this every time you scroll.'" |
| Add voiceover | "Generate a Kokoro voiceover for this reel and mix it with a CC0 ambient track." |

> **Ready-to-paste prompts for SaaS, AI, web-dev life, finance, mindset & 10+ more niches → [`prompt-examples.md`](prompt-examples.md)** — every prompt runs trend-research → spec → approval → generate → audit.

### Prompt → spec → approve → generate → audit (`video-product-pipeline`)

The premium default for **every** video request — engineered to reach millions of views, and a sloppy prompt can't silently produce a sloppy video:

1. **Trend research + brainstorm** — `node render/trend-hunt.mjs --niche "{topic}" --subreddits "{r1},{r2}" --geo US` (Reddit top-of-day + Google Trends, no API key) + web research → ≥5 angles scored on the viral scorecard → winner locked in `trend-brief.md`
2. **Analyze** the prompt (asks ≤3 clarifying questions if vague — never guesses silently)
3. **Write `video-product.md`** — full spec: style, hook, beat-by-beat text + timings, safe-zone map, voice, audio, output name
4. **Stop and wait for your approval** — nothing is generated before you say "approve" (or "edit")
5. **Generate** by delegating to `text-motion-reels` / `video-asset-reels` / `voice-sfx-audio`
6. **Audit** — `node render/audit-composition.mjs --html reel.html` captures a keyframe per beat and auto-checks safe zones (x 8–92%, y 15–85%), text overlap, word caps & determinism, then a dedicated **auditor subagent** reviews spelling, style and readability and signs `audit-report.md` PASS before delivery
7. **Deliver** — MP4 + `caption.md` + `video-product.md` + `trend-brief.md` + `audit-report.md`

> "Make a 20-second psychology reel — hook: 'Your brain does this every time you scroll.'"
> → spec file first → approve → generate → audit → deliver

### Carousel posts (`carousel-post-images`)

Scroll-stopping LinkedIn/Instagram **carousels as image sets at 4K** — built for CLIs with a **native image model** (Antigravity CLI, OpenAI Codex, Grok Build), with a deterministic HTML→PNG fallback that works anywhere. Every deck clears a fixed quality bar: **4K resolution** (≥ 4000px long edge), **photorealistic real-life scenario visuals** (one real moment per slide — never floating text), and **viral anti-fluff copywriting** (hook formulas + a fluff blocklist — no "unlock", no "game-changer"):

1. The agent analyzes the prompt, locks **one of 4 styles** (Cinematic Real-Life default / Dark Terminal / Editorial Cards / Neon Gradient), and plans 8–10 slides (cover hook → beats → CTA) with a real-life **scene** planned per slide
2. **Path A — native model (primary, 4K):** one prompt per slide via the CLI's image tool (Codex `image_gen` / Grok `/imagine` / Antigravity artifacts) — scene + cinematic grade + exact overlay text at max resolution, upscaled to **4K** (≥ 4000px long edge); text is verified — LLM models garble on-image text, so any wrong character gets regenerated or falls back to Path B
3. **Path B — deterministic (any CLI, 4K):** `slides.html` → `node render/render-carousel.mjs --html slides.html --out carousel/ --4k` — pixel-perfect 4320×5400 (4:5) / 4320×4320 (1:1) PNGs, text never garbled
4. **Audit:** text accuracy, copy punch (no fluff), scene authenticity, contrast, style consistency, 4K size
5. **`caption.md`** written next to the images (500–900 chars per platform, no hashtags, hook first, one CTA)

Built-in examples — **"Day in the life of an AI developer"** (`examples/day-in-the-life-dev/`, Dark Terminal) and **"3 Money Rules Nobody Told You"** (`examples/real-life-money/`, Cinematic Real-Life with per-slide 4K native prompts + fallback deck) — both with full caption packs.

> "Make a carousel: 3 money rules nobody told you. Cinematic real-life style, real scenes, 8 slides, 4K, LinkedIn."
> → slide map with scenes → 4K PNGs → `caption.md` → auditor check → deliver

---

## Render tooling (in this repo)

The `render/` folder contains the pipeline scripts the skills use to turn an HTML composition into a 4K MP4:

| Script | Purpose |
|---|---|
| `render-frames.mjs` | Seekable frame renderer → deterministic 4K MP4 (CLI: `--html --name --duration --fps --scale --audio`; auto-seeks `<video data-start>` clips for asset reels) |
| `generate-voice.mjs` | Kokoro-82M TTS voiceover lines (deep male default: `am_fenrir`), auto-fit to beat windows, cap 1.15× |
| `enhance-voice.mjs` | Deep-voice enhancer (Tier 1): duration-preserving pitch shift (−2 st) + 120 Hz warmth EQ via FFmpeg — CPU-only, no new deps (see [voice-plan.md](voice-plan.md)) |
| `mix-audio.sh` | FFmpeg sidechain-ducking mix to -14 LUFS |
| `cut-assets.mjs` | FFmpeg cutter: pre-cuts video/image assets into per-beat 1080x1920 clips from a `storyboard.json` manifest |
| `generate-caption.mjs` | Writes `caption.md` from storyboard beats; auto-checks every section into the 500–900 char window |
| `audit-composition.mjs` | Post-generation audit: captures one keyframe per beat, auto-checks the 9:16 safe zone, text overlap, word caps, timeline coherence + determinism lint; writes `audit-report.md` for the auditor subagent |
| `trend-hunt.mjs` | Pre-generation viral research (no API key): Reddit top-of-day posts from niche subreddits + Google Trends "Trending now" RSS → `trend-brief.md` scaffold for the brainstorm + viral scorecard |
| `render-carousel.mjs` | Carousel-post renderer (fallback for `carousel-post-images`): one HTML deck with N `.slide` elements → per-slide PNGs via headless Chrome; `--4k` renders at 4320×5400 (4:5) / 4320×4320 (1:1) |

```bash
cd render
npm install          # playwright (headless Chrome driver)

# Render a composition to vertical 4K into output/my-reel_4k/
node render-frames.mjs --html my-reel.html --name my-reel_4k --duration 15 --fps 30 --scale 2

# With a mixed audio track
node render-frames.mjs --html my-reel.html --name my-reel_4k --audio assets/full_mix.m4a
```

Requires Chrome and FFmpeg on your PATH. All paths are relative to the script, so the pipeline works from any clone location.

---

## License

MIT — free to use, modify, and monetize. See [LICENSE](LICENSE).
