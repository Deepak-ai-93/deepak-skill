# deepak-skill 🎬

Open-source agent skills for creating **short-form video content** — text-only motion graphic reels, hook copywriting, storyboarding, retention engineering, and AI voiceover + sound design. Built for AI coding agents (Claude Code, Cursor, Codex, Gemini CLI, and 70+ more via the skills ecosystem).

[![skills.sh](https://skills.sh/b/Deepak-ai-93/deepak-skill)](https://skills.sh/Deepak-ai-93/deepak-skill)

## What's inside

| Skill | What it does |
|---|---|
| **text-motion-reels** | Create trending text-only motion graphic reels (kinetic typography) as HyperFrames HTML compositions — niches, design styles, viral formulas |
| **hook-storyboard-retention** | Write scroll-stopping hooks, engineer watch-time, and build beat-by-beat storyboards with script ↔ video timeline in sync |
| **voice-sfx-audio** | Open-source TTS voiceovers (Kokoro, Piper, etc.), royalty-free SFX/music sources with license guidance, and FFmpeg audio ducking |

The three skills are a complete production pipeline: **what to say** (hooks) → **how it looks** (motion) → **how it sounds** (voice/SFX).

## Install

```bash
# Install all skills (into the current project)
npx skills add Deepak-ai-93/deepak-skill --all

# Install a single skill
npx skills add Deepak-ai-93/deepak-skill --skill text-motion-reels

# Install globally — available in ANY project, on ANY machine
npx skills add Deepak-ai-93/deepak-skill --all -g

# Target a specific agent
npx skills add Deepak-ai-93/deepak-skill --all -a claude-code -a cursor
```

See the [skills.sh docs](https://www.skills.sh/docs) for more options (`--list`, `--copy`, etc.).

## Usage example

After installing, just ask your agent:

> "Using the text-motion skills, make a 20-second psychology-facts reel with a strong hook, beat-synced typography, and a Kokoro voiceover."

## License

MIT — free to use, modify, and monetize. See [LICENSE](LICENSE).
