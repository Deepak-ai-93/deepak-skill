# USAGE — How to use this skill in Claude chat, ChatGPT chat, and coding CLIs

**Short answer:** Yes — but the experience depends on *which* product and *which tier*. This repo's skills are built for **agentic coding CLIs with a terminal** (Claude Code, Cursor, Windsurf, Codex CLI, Gemini CLI, Antigravity CLI, Grok Build, Freebuff, and 70+ more via the skills ecosystem). Plain web chats (**claude.ai chat, consumer chatgpt.com**) can't run the render pipeline, but they can still use roughly 60% of every skill — planning, viral copywriting, image-gen prompts, captions — by copy-pasting the `SKILL.md` instructions.

---

## 1. What the skills actually need to run

| Requirement | Needed for | Notes |
|---|---|---|
| **Terminal + Node.js 18+** | Installing + running the render scripts (`render-carousel.mjs`, `render-frames.mjs`, `trend-hunt.mjs`, …) | Mode 1 (browser render → PNGs/MP4) |
| **Google Chrome + Playwright** | Headless rendering (4K carousel PNGs, 4K reels) | Mode 1 |
| **FFmpeg** | Final MP4 assembly (video skills only) | Video output |
| **Native image tool** (Antigravity / Codex `image_gen` / Grok `/imagine`, or the chat's own image gen) | Mode 2 (photoreal 4K carousel scenes) | Optional — Mode 1 covers everything |
| **A model that follows the SKILL.md workflow** | Planning, copywriting, prompts, captions, audit | Every product has this |

The deciding factor is: **does the product let an agent run terminal commands?** That is the whole gap.

---

## 2. Capability matrix

| Product | Install skills (`npx skills add`) | Run terminal / Node / Chrome | Native image-gen | Verdict |
|---|---|---|---|---|
| **Claude Code** (terminal agent) | ✅ | ✅ | ✅ | **Full** |
| **Cursor / Windsurf / Gemini CLI / Codex CLI / Antigravity / Grok Build** | ✅ (open skills standard) | ✅ | ✅ | **Full** |
| **Freebuff / other chat-with-terminal agents** | ✅ | ✅ | ✅ | **Full** |
| **Claude.ai web chat** | ❌ no installer | ❌ no terminal | ✅ (native image gen) | **Partial** — copy-paste mode |
| **ChatGPT web (consumer)** | ❌ | ❌ (Python sandbox only; no Node/Playwright/Chrome) | ✅ (DALL·E / gpt-image) | **Partial** — copy-paste mode |
| **ChatGPT Work / Business / desktop app** | ✅ (OpenAI adopted the same open Agent Skills standard — Skills tab / Plugin Directory) | ✅ in Codex CLI / dev environments; ❌ in the hosted chat sandbox | ✅ | **Partial-to-full** — loads the skill, but the *render* step still needs a machine with Node + Chrome |
| **GPTs / Tasks** | ❌ skills | ❌ | ✅ | Partial — instructions + image gen only |

**Key nuance:** OpenAI has adopted the same **open Agent Skills standard** (`SKILL.md` folders, progressive disclosure) this repo uses — so a skill from `skills.sh` *can* be loaded in ChatGPT Work / the desktop app / Codex. But loading a skill ≠ running it: the hosted chat sandbox still can't execute the render scripts (no Node, no headless Chrome). The terminal parts must run on **your machine** (Claude Code, Codex CLI, etc.) or in an environment with a terminal agent.

---

## 3. Claude Code (and all agentic coding CLIs) — full, 2 minutes

```bash
# in your project folder — a single skill
npx skills add Deepak-ai-93/deepak-skill --skill carousel-post-images

# or everything (all 18 skills)
npx skills add Deepak-ai-93/deepak-skill --all

# or install globally for every project
npx skills add Deepak-ai-93/deepak-skill --all -g
```

Then just talk to it:

> "Using the carousel-post-images skill, make a LinkedIn carousel: *3 money rules nobody told you*. Real-life scenes, image-model mode, 8 slides, 4K."

The agent **presents the two-mode choice** (browser render vs image-model generation), plans the slides with real-life scenes, then either renders 4K PNGs (`--4k`) or exports per-slide image-model prompts (`--mode model`) for the CLI's image tool.

For email campaigns, the `email-marketing` skill has its own validation + preview pipeline:

```bash
cd email-marketing && node scripts/validate-email.mjs --html email.html --subject "Meet Replays: watch visitors fumble your signup"
cd email-marketing && node scripts/preview-email.mjs --html email.html --dark   # needs Chrome + playwright
```

> "Using the email-marketing skill, write a promo email for our Black Friday launch — Brevo, audience: warm leads, goal: sales. Spam-free, high-CTR subject lines, strong E-E-A-T."

The agent plans the email, writes the subject line pack, builds `email.html` + `plain.txt`, runs the spam/compliance validator, renders desktop + mobile previews, and has an auditor subagent sign off before delivering. In **web chat** (no terminal), paste the SKILL.md and the agent still delivers the full creative pack — subject lines, HTML, plain text, and copy — just without the automated screenshots.

The long-form repurposing skills follow the same pattern — score, approve, generate, audit:

```bash
# Podcast → shorts: score the transcript, then cut
cd skills/podcast-to-shorts && node scripts/clip-finder.mjs --transcript transcript.txt --clips 5
cd skills/podcast-to-shorts && node scripts/clip-finder.mjs --cuts clip-plan.md --input episode.mp4 --run

# YouTube: title pack → script → thumbnail → metadata
cd skills/youtube-video-pipeline && node scripts/title-pack.mjs --topic "saas pricing" --angle "3 pricing mistakes"

# SEO blog: keyword cluster + outline brief → approve → article
cd skills/blog-seo-content && node scripts/keyword-outline.mjs --seed "saas onboarding"

# LinkedIn: voice capture → bio → calendar → engagement
# Skill builder: scaffold a new skill in the repo's conventions
cd skills/skill-builder && node scripts/scaffold-skill.mjs --name my-skill --desc "…"

# Google Flow / Veo: rich long-form scene prompts, any video generator (Flow/Veo, Kling, Luma, Runway, Hailuo, Vidu, Pika, PixVerse) — locked character consistency + negative prompt + seed
cd skills/veo-cinematic-reels && node scripts/scene-prompts.mjs --plan scene-plan.json --out prompts.md
cd skills/veo-cinematic-reels && node scripts/audit-reels.mjs --pack <reel-folder> --out reels-audit.md   # automated audit → spawn reel-auditor subagent

# AI photoshoots: person + product prompt packs with locked subject consistency
cd skills/photoshoot-studio && node scripts/shot-prompts.mjs --plan shoot-plan.json --out prompts.md
cd skills/photoshoot-studio && node scripts/audit-shoot.mjs --pack <shoot-folder> --out shoot-audit.md   # automated audit → spawn shoot-auditor subagent

# Episodic story series: story bible → per-episode prompt pack + voiceover sheet
cd skills/serial-story-reels && node scripts/series-arc.mjs --plan series-plan.json --bible story-bible.md
cd skills/serial-story-reels && node scripts/episode-prompts.mjs --plan series-plan.json --out prompts.md --vo voiceover.md
cd skills/serial-story-reels && node scripts/audit-series.mjs --pack <series-folder> --out series-audit.md   # automated audit → spawn series-auditor subagent

# Podcast → shorts: score + cut, then audit the clip pack
cd skills/podcast-to-shorts && node scripts/clip-finder.mjs --transcript transcript.txt --clips 5
cd skills/podcast-to-shorts && node scripts/audit-clips.mjs --pack <clips-folder> --out clips-audit.md   # automated audit → spawn clips-auditor subagent

# YouTube: title pack → script → thumbnail → metadata, then audit the pack
cd skills/youtube-video-pipeline && node scripts/title-pack.mjs --topic "saas pricing" --angle "3 pricing mistakes"
cd skills/youtube-video-pipeline && node scripts/audit-video-plan.mjs --pack <pack-folder> --out video-plan-audit.md   # automated audit → spawn video-plan-auditor subagent

# SEO blog: keyword cluster + outline brief → approve → article, then audit
cd skills/blog-seo-content && node scripts/keyword-outline.mjs --seed "saas onboarding"
cd skills/blog-seo-content && node scripts/audit-blog.mjs --pack <blog-folder> --out blog-audit.md   # automated audit → spawn blog-auditor subagent

# LinkedIn: voice capture → bio → calendar → engagement, then audit
cd skills/linkedin-personal-brand && node scripts/audit-brand.mjs --pack <brand-folder> --out brand-audit.md   # automated audit → spawn brand-auditor subagent

# Social content plans: platform playbook → strategy → pillars → 30-day calendar → companion gate → engagement + metrics → audit
cd skills/social-media-content-plan && node scripts/platform-playbook.mjs --platform instagram,x,linkedin   # grounded 2026 algorithm facts
cd skills/social-media-content-plan && node scripts/build-calendar.mjs --plan plan.json --out calendar.md   # deterministic 30-day calendar
cd skills/social-media-content-plan && node scripts/check-skills.mjs --out companion-skills.md   # companion gate: producer skills installed? (--install to add missing)
cd skills/social-media-content-plan && node scripts/audit-content-plan.mjs --pack <plan-folder> --platforms instagram,x --out content-plan-audit.md   # automated audit → spawn content-plan-auditor subagent

# Carousels: render/generate, then audit the deck + captions
cd skills/carousel-post-images && node scripts/render-carousel.mjs --html slides.html --out carousel/ --4k
cd skills/carousel-post-images && node scripts/audit-carousel.mjs --pack <carousel-folder> --out carousel-audit.md   # automated audit → spawn carousel-auditor subagent

# Text-motion + asset reels: render, then audit the composition + output
cd skills/text-motion-reels && node scripts/audit-reel.mjs --pack <reel-folder> --out reel-audit.md   # automated audit → spawn reel-auditor subagent
cd skills/video-asset-reels && node scripts/audit-asset-reel.mjs --pack <reel-folder> --out asset-reel-audit.md   # automated audit → spawn asset-reel-auditor subagent

# Storyboards + audio: audit the deliverables
cd skills/hook-storyboard-retention && node scripts/audit-storyboard.mjs --pack <storyboard-folder> --out storyboard-audit.md   # automated audit → spawn storyboard-auditor subagent
cd skills/voice-sfx-audio && node scripts/audit-audio.mjs --pack <audio-folder> --out audio-audit.md   # automated audit → spawn audio-auditor subagent

# Skill builder: audit a new scaffold against the repo contract
cd skills/skill-builder && node scripts/audit-scaffold.mjs --pack skills/<new-skill> --docs --out scaffold-audit.md   # automated audit → spawn scaffold-auditor subagent

# Paid ads: forecast first, then Veo video + image ad prompts + compliant copy
cd skills/paid-ads-studio && node scripts/forecast-ads.mjs --platform meta --objective sales --daily-budget 50 --aov 40
cd skills/paid-ads-studio && node scripts/ad-prompts.mjs --plan ads-plan.json --out prompts.md
cd skills/paid-ads-studio && node scripts/ad-copy.mjs --brief copy-brief.json --out copy.md
cd skills/paid-ads-studio && node scripts/audit-ads.mjs --pack <campaign-folder> --out ad-audit.md   # automated audit → spawn ads-auditor subagent
```

> "Make a reel with scenes and Google Flow prompts — same character every scene, IMAX cinematic look" — the skill builds the character sheet → scene script → self-verified copy-paste prompt pack, then you generate scene by scene in Flow.

> "Turn this podcast episode into 5 shorts" · "Plan a YouTube video with 10 title options" · "Write an SEO blog post that AI search cites" · "Build my LinkedIn presence in my voice" · "Build me a 30-day content plan to reset my Instagram and X algorithm" — each runs score → approve → generate → audit.

Other skills follow the same pattern (text-motion reels, video-asset reels, voice/SFX, viral pipeline). See the [README](README.md) for the full install table and per-skill commands.

---

## 4. Claude.ai web chat / ChatGPT web — partial (copy-paste mode)

**Full browser walkthrough (claude.com):** [`CLAUDE-COM.md`](CLAUDE-COM.md) — the complete step-by-step guide with ready-to-paste prompts for every skill and a hybrid render workflow.

**What works without a terminal:**
1. Paste the skill as instructions: *"Follow this skill: [paste the contents of `skills/carousel-post-images/SKILL.md`]"* (or paste the GitHub link — the chat can read the repo). For emails: *"Follow this skill: [paste `skills/email-marketing/SKILL.md`]"*.
2. The model delivers: **slide plan with scenes → viral anti-fluff copy per slide → Mode 2 image prompts (4K) → `caption.md` for 5 platforms → audit checklist.**
3. Because both Claude and ChatGPT have **built-in image generation**, Mode 2 is usable: ask it to "generate slide 1 now" and it produces the photoreal image; you download each one manually.

**What won't work:**
- Mode 1 (HTML → PNG) — no terminal, no Chrome.
- "Save all 8 slides into `carousel/` as PNGs" — no file system.
- Any script execution (`render-carousel.mjs`, `trend-hunt.mjs`, caption scripts, FFmpeg).

**Ready-to-paste prompt for web chats:**

```
Follow this skill exactly: [paste SKILL.md contents]

Topic: 3 money rules nobody told you
Platform: LinkedIn + Instagram
Style: Cinematic Real-Life (photoreal real-life scenes)
Mode: image-model — generate the 8 slides with your image tool at 4K
Deliverables:
1. Slide map with a real-life SCENE per slide
2. Headline/sub copy per slide (≤8 words, no fluff words like "unlock" or "game-changer")
3. One 4K image prompt per slide (4320×5400)
4. Generate each slide image
5. A caption.md pack: LinkedIn, Instagram, X, Threads, Facebook — 500–900 chars each, no hashtags, one CTA
```

---

## 5. Hybrid workflow (recommended when you only have web chat)

Let the web chat produce the creative deliverables (`slides.html` text + `prompts.md` + captions), then run the render on your own machine:

```bash
node render/render-carousel.mjs --html slides.html --out carousel/ --4k
# or for the native image model path
node render/render-carousel.mjs --html slides.html --out carousel/ --mode model
```

This gets you the chat's best copywriting + image prompts and still ends with real 4K files.

---

## 6. Bottom line

- **Full experience** (one prompt → 4K carousel/reel files in a folder): **Claude Code, Cursor, Codex CLI, Gemini CLI, Antigravity, Grok Build, Freebuff** — all work today via `npx skills add Deepak-ai-93/deepak-skill`.
- **Web chat only**: you still get the creative + copywriting + image-gen half — just manual downloading and no automated render.
- **ChatGPT Work/Business + desktop app**: closest to full — the skill loads (open standard); paired with Codex CLI on your machine it runs end-to-end.

**Which is right for you?** If you produce content regularly, install into Claude Code (or any coding CLI) and get the full pipeline. If you only need ideas + copy, any chat works — just paste the skill.
