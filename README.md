# deepak-skill 🎬

Open-source agent skills for creating **short-form video content** — text-only motion graphic reels, hook copywriting, storyboarding, retention engineering, and AI voiceover + sound design. Built for AI coding agents (Claude Code, Cursor, Codex, Gemini CLI, and 70+ more via the skills ecosystem).

[![skills.sh](https://skills.sh/b/Deepak-ai-93/deepak-skill)](https://skills.sh/Deepak-ai-93/deepak-skill)

## What's inside

| Skill | What it does |
|---|---|
| **text-motion-reels** | Create trending text-only motion graphic reels (kinetic typography) as HyperFrames HTML compositions — 5 trending formats, design styles, viral formulas. Starts with an interactive **format wizard** and renders at **4K** |
| **hook-storyboard-retention** | Write scroll-stopping hooks, engineer watch-time, and build beat-by-beat storyboards with script ↔ video timeline in sync |
| **voice-sfx-audio** | Open-source TTS voiceovers (Kokoro, Piper, etc.), royalty-free SFX/music sources with license guidance, and FFmpeg audio ducking |

The three skills are a complete production pipeline: **what to say** (hooks) → **how it looks** (motion) → **how it sounds** (voice/SFX).

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

That's it. It installs only the three skills into `.agents/skills/` — no heavy media, no demo files.

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
| Install globally (any project, any machine) | `npx skills add Deepak-ai-93/deepak-skill --all -g` |
| Target specific agents | `npx skills add Deepak-ai-93/deepak-skill --all -a claude-code -a cursor` |
| Install from a local clone | `npx skills add ./deepak-skill --all` |

**Verify the install:**

```bash
ls .agents/skills/
# text-motion-reels  hook-storyboard-retention  voice-sfx-audio
```

**Update:** `npx skills update` • **Remove:** `npx skills remove <skill-name>`

See the [skills.sh docs](https://www.skills.sh/docs) for more options (`--list`, `--copy`, packs, etc.).

---

## Usage

### Format wizard + 4K rendering (`text-motion-reels`)

The `text-motion-reels` skill starts with an **interactive format wizard** — the agent asks you to pick one of 5 trending text-only formats before building anything:

1. **Word Pop** — Hormozi-style high-impact captions (business, hot takes)
2. **Highlighter** — Vox-style analytical explainer (psychology, facts)
3. **3D Editorial** — luxury quiet minimalist (mindset, stoic)
4. **Card Listicle** — numbered save-bait grid (finance, productivity)
5. **Chat Thriller** — text-message storytime (reddit, drama)

After you pick a format, the agent builds the composition to that format's spec and renders it at **vertical 4K (2160x3840)** with a proper filename:

```bash
node render/render-frames.mjs --html word-pop_reel.html --name word-pop_money-rules_4k --duration 15 --fps 30 --scale 2
```

Output → `output/{format-slug}_{topic-slug}_4k.mp4` (e.g. `3d-editorial_mental-clarity_4k.mp4`).

### Sample prompts

| Goal | Prompt |
|---|---|
| Hook + storyboard only | "Write a scroll-stopping hook and 15-second storyboard for a finance reel." |
| Full text-only reel | "Make a 20-second psychology reel using the Word Pop format, hook: 'Your brain does this every time you scroll.'" |
| Add voiceover | "Generate a Kokoro voiceover for this reel and mix it with a CC0 ambient track." |

---

## Render tooling (in this repo)

The `render/` folder contains the pipeline scripts the skills use to turn an HTML composition into a 4K MP4:

| Script | Purpose |
|---|---|
| `render-frames.mjs` | Seekable frame renderer → deterministic MP4 (CLI: `--html --name --duration --fps --scale --audio`) |
| `generate-voice.mjs` | Kokoro-82M TTS voiceover lines, auto-fit to beat windows |
| `mix-audio.sh` | FFmpeg sidechain-ducking mix to -14 LUFS |

```bash
cd render
npm install          # playwright (headless Chrome driver)

# Render a composition to vertical 4K with a proper name
node render-frames.mjs --html my-reel.html --name my-reel_4k --duration 15 --fps 30 --scale 2

# With a mixed audio track
node render-frames.mjs --html my-reel.html --name my-reel_4k --audio assets/full_mix.m4a
```

Requires Chrome and FFmpeg on your PATH. All paths are relative to the script, so the pipeline works from any clone location.

---

## License

MIT — free to use, modify, and monetize. See [LICENSE](LICENSE).
