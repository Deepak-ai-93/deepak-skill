# Install — deepak-skill 🎬 (crafted by Deepak)

The **deepak-skill** repo ships a **branded installer** that prints the **DEEPAK** banner in your terminal, then installs the skills. One command, works on Windows (Git Bash), macOS and Linux.

## The install experience (what you'll see)

```bash
./install.sh
```

```
   ██████╗ ███████╗███████╗██████╗  █████╗ ██╗  ██╗
   ██╔══██╗██╔════╝██╔════╝██╔══██╗██╔══██╗██║ ██╔╝
   ██║  ██║█████╗  █████╗  ██████╔╝███████║█████╔╝
   ██║  ██║██╔══╝  ██╔══╝  ██╔══██╗██╔══██║██╔═██╗
   ██████╔╝███████╗███████╗██║  ██║██║  ██║██║  ██╗
   ╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝

  deepak-skill — 16 agent skills crafted by Deepak 🎬
  install once · use in any AI coding agent · MIT license

  17 skills installed:
  • text-motion-reels         → text-only motion graphic reels (4K)
  • video-asset-reels         → reels from your own clips & images
  • video-product-pipeline    → viral-engineered video workflow + audit
  • hook-storyboard-retention→ scroll-stopping hooks + retention storyboards
  • voice-sfx-audio           → open-source voiceovers + SFX + mixing
  • carousel-post-images      → LinkedIn/Instagram carousels at 4K
  • veo-cinematic-reels       → Google Flow/Veo scene prompts, IMAX + consistency
  • serial-story-reels        → episodic story series: bible + episode prompts + VO
  • photoshoot-studio         → AI photoshoot prompts: people + products
  • paid-ads-studio           → Meta + Google ad campaigns: creatives + forecast
  • email-marketing           → spam-free HTML emails + high-CTR subject lines
  • blog-seo-content          → SEO articles that rank and get AI-cited
  • youtube-video-pipeline    → script, 10-title pack, thumbnail, metadata
  • podcast-to-shorts         → long-form → viral vertical clips
  • linkedin-personal-brand   → voice-captured posts, bio, calendar
  • vibe-code-webapp          → production vibe-coded web apps
  • skill-builder             → scaffold new skills the deepak-skill way

🚀 Installing…
✅ Done — deepak-skill installed
```

---

## 1. Quick start (3 steps)

### Step 1 — Get the repo or go straight to install

```bash
# Option A — clone and use the branded installer
git clone https://github.com/Deepak-ai-93/deepak-skill.git
cd deepak-skill

# Option B — no clone needed (installs straight from the registry)
npx skills add Deepak-ai-93/deepak-skill --all
```

### Step 2 — Run the branded installer

```bash
./install.sh              # prints the DEEPAK banner + installs all 17 skills
```

> 💡 On Windows use **Git Bash** (not cmd/PowerShell) to run `./install.sh`. No clone? Skip straight to the `npx` command — the skills still work; you just don't get the banner.

### Step 3 — Use it with any AI agent

Tell your agent (Claude Code, Cursor, Codex, Gemini CLI, Antigravity, Grok Build, Freebuff…):

> "Using the **email-marketing** skill, write a promo email for our launch."
> "Using the **veo-cinematic-reels** skill, make a cinematic reel with Google Flow prompts."
> "Using the **podcast-to-shorts** skill, clip this episode into 5 shorts."

The agent loads the skill and runs its pipeline (with the **deepak-skill — crafted by Deepak** banner in every script).

---

## 2. Installer options

| Command | What it does |
|---|---|
| `./install.sh` | Install **all 17 skills** into `.agents/skills/` in the current project |
| `./install.sh --skill <name>` | Install a **single skill** (e.g. `--skill podcast-to-shorts`) |
| `./install.sh --all` | Same as no args (all skills) |
| `./install.sh --global` | Install **globally** (`-g`) — available in every project on your machine |
| `./install.sh --list` | Print the banner + full skill list only (nothing installed) |
| `./install.sh --local` | Install from **this clone** (works offline, no registry fetch) |
| `./install.sh --help` | Show all options |

**Examples:**
```bash
./install.sh --skill email-marketing
./install.sh --skill veo-cinematic-reels --global
./install.sh --skill podcast-to-shorts --skill youtube-video-pipeline
```

---

## 3. Install options without the script (registry / `npx`)

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
# blog-seo-content  carousel-post-images  email-marketing  hook-storyboard-retention
# linkedin-personal-brand  photoshoot-studio  podcast-to-shorts  skill-builder
# text-motion-reels  veo-cinematic-reels  video-asset-reels  video-product-pipeline
# vibe-code-webapp  voice-sfx-audio  youtube-video-pipeline
```

**Update:** `npx skills update` · **Remove:** `npx skills remove <skill-name>`

See the [skills.sh docs](https://www.skills.sh/docs) for more options (`--list`, `--copy`, packs, etc.).

---

## 4. Prerequisites

- **Node.js 18+** (installs `npx` automatically) — https://nodejs.org
- **Google Chrome** — only needed for the video/carousel render scripts
- **FFmpeg** — only needed for video output (reels, podcast clips)

The installer checks for `npx` and gives a clear error if it's missing.

---

## 5. Troubleshooting

| Problem | Fix |
|---|---|
| `./install.sh: No such file or directory` on Windows | Use **Git Bash**; or run `bash install.sh` |
| `npx: command not found` | Install Node.js 18+ and reopen your terminal |
| `Unknown option` / `Unknown skill` | Run `./install.sh --help` or `./install.sh --list` |
| Skills not picked up by the agent | Make sure the agent runs in the project that has `.agents/skills/` (or install with `--global`) |
