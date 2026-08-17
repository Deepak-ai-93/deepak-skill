# deepak-skill 🎬

```
   ██████╗ ███████╗███████╗██████╗  █████╗ ██╗  ██╗
   ██╔══██╗██╔════╝██╔════╝██╔══██╗██╔══██╗██║ ██╔╝
   ██║  ██║█████╗  █████╗  ██████╔╝███████║█████╔╝
   ██║  ██║██╔══╝  ██╔══╝  ██╔══██╗██╔══██║██╔═██╗
   ██████╔╝███████╗███████╗██║  ██║██║  ██║██║  ██╗
   ╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝
```

**🎬 deepak-skill — crafted by Deepak** · [deepak-skill on GitHub](https://github.com/Deepak-ai-93/deepak-skill) · MIT

Open-source agent skills for the **full content-creator stack** — short-form video (text-motion + asset reels), **Google Flow / Veo cinematic scene prompts**, viral hooks & storyboards, AI voiceover + sound design, native-image-model carousels, designed ebook lead magnets, spam-free HTML emails with high-CTR subject lines, **long-form repurposing** (podcast→shorts, YouTube packaging, SEO blog content), **LinkedIn personal branding**, **platform-native social content plans (algorithm-reset calendars)**, vibe-coded web apps, a meta **skill-builder** that scaffolds new skills, and a **mcp-agent-builder** that scaffolds MCP servers + the AI agents that use them (full path: discovery → PRD → architecture → runnable server → agent wiring, in any IDE/CLI). Built for AI coding agents (Claude Code, Cursor, Codex, Gemini CLI, Antigravity CLI, Grok Build, and 70+ more via the skills ecosystem).

[![skills.sh](https://skills.sh/b/Deepak-ai-93/deepak-skill)](https://skills.sh/Deepak-ai-93/deepak-skill)

## What's inside

| Skill | What it does |
|---|---|
| **text-motion-reels** | Create trending text-only motion graphic reels (kinetic typography) as HyperFrames HTML compositions — 11 trending formats (Word Pop · Highlighter · 3D Editorial · Card Listicle · Chat Thriller · SVG Ambient · **Micro-Fiction · Quiz Trap · Day Counter · Notification Drop · Thread Court**), design styles, viral formulas. Starts with an interactive **format wizard** and renders at **4K** — **audit harness**: `audit-reel.mjs` (format slug, GSAP timeline, determinism, output, captions → `reel-audit.md`) + a fresh **reel-auditor subagent** signing PASS / FIX NEEDED |
| **hook-storyboard-retention** | Write scroll-stopping hooks, engineer watch-time, and build beat-by-beat storyboards with script ↔ video timeline in sync — **audit harness**: `audit-storyboard.mjs` (hook/beat/sync/retention/determinism → `storyboard-audit.md`) + a fresh **storyboard-auditor subagent** signing PASS / FIX NEEDED |
| **voice-sfx-audio** | Open-source TTS voiceovers (Kokoro, Piper, etc.), royalty-free SFX/music sources with license guidance, FFmpeg audio ducking, and a **deep-voice recipe** (Tier 1: Kokoro male voice + FFmpeg pitch/EQ — see [voice-plan.md](voice-plan.md)) — **audit harness**: `audit-audio.mjs` (license compliance, mix contract, loudness → `audio-audit.md`) + a fresh **audio-auditor subagent** signing PASS / FIX NEEDED |
| **video-asset-reels** | Build reels from your own video clips & images — understand the prompt, cut assets to beats, overlay kinetic text, sync a voiceover, render 4K (see [PLAN.md](PLAN.md)) — **audit harness**: `audit-asset-reel.mjs` (storyboard, cuts, HTML determinism, output, captions → `asset-reel-audit.md`) + a fresh **asset-reel-auditor subagent** signing PASS / FIX NEEDED |
| **video-product-pipeline** | The viral-engineered gatekeeper for every video request: hunt trending topics (`trend-hunt.mjs` + web research) → brainstorm + score angles → analyze ANY prompt (sloppy or not) → write a `video-product.md` spec → **get your approval** → generate (text-motion / asset reels) → audit the frames with a script + dedicated auditor subagent (spelling, text overlap, safe zones, style, readability) |
| **carousel-post-images** | Scroll-stopping carousel posts (LinkedIn/Instagram) as image sets — **one script, two CLI modes**: **browser render** (slides.html → deterministic 4K PNGs, any CLI) or **native image-model generation** (same deck exports photoreal 4K prompts for Antigravity / Codex `image_gen` / Grok `/imagine`). Photorealistic real-life visuals, viral anti-fluff copywriting, 4 trending styles (Cinematic Real-Life default), per-platform `caption.md` — **audit harness**: `audit-carousel.mjs` (deck, copy limits, fluff, output, captions → `carousel-audit.md`) + a fresh **carousel-auditor subagent** signing PASS / FIX NEEDED |
| **ebook-builder** | Build **beautiful lead-magnet ebooks** (guides / checklists / frameworks) as print-ready **A4 PDF + 4K page PNGs + cover.png** — **six layout presets** (Editorial Classic · Modern Bold · Minimal Luxury · Playful Pop · Technical Dark · Nature Calm), **30 design palettes** (5 per layout) + typography pairings + **6 cover styles** (full-bleed / solid / split / pattern / scene-frame / duotone) + page-motif families (step-cards / timeline / checklist / scenario / quote / chapter-dividers / comparison / framework-map) + mood/texture — ONE of each locked via the **design picker**, story-first structure (cover opens a loop → chapters escalate → payoff → CTA), and **two generation modes** like carousel-post-images (Mode 1 browser: `render-ebook.mjs` → headless Chrome A4 PDF + page PNGs; Mode 2 image-model: the same deck exports photoreal cover + interior scene prompts). Cross-session **author memory + taste** — `ebook-memory.md` (identity, voice fingerprint, design defaults, past builds) read at Stage 0 and written back at Stage 8, so every ebook is built in the author's voice with a **taste profile** (tone, rhythm, pet phrases, banned words the audit FAILs on). Cover-image brief built in — **audit harness**: `audit-ebook.mjs` (pages, cover, layout + palette + motif consistency, copy limits, fluff, **memory/taste**, output → `ebook-audit.md`) + a fresh **ebook-auditor subagent** (scores **copy punch + voice match**) signing PASS / FIX NEEDED |
| **email-marketing** | High-converting, **spam-free HTML emails** for Brevo / MailerLite / Mailchimp / Klaviyo — bulletproof responsive code, anti-fluff copywriting, **E-E-A-T trust signals** (real author + credentials + proof), and a **high-CTR subject line pack** (33–50 char formulas + A/B plan). Validated by `validate-email.mjs` (spam-trigger scan, CAN-SPAM compliance, EEAT signals → `validation-report.md`) and previewed at desktop + mobile via `preview-email.mjs` before send |
| **thumbnail-studio** | Engineer **click-worthy YouTube thumbnails** — a **CTR teardown** of the niche first (what wins, what's saturated, the ONE idea the video sells) → **3–5 thumbnail variants** (each = ONE idea + ≤ 5-word overlay + face/emotion/contrast + a 1280×720 photoreal image-gen prompt, self-verified by `thumbnail-prompts.mjs`) → **A/B plan** with niche CTR benchmarks (`templates/ctr-benchmarks.md`) — **audit harness**: `audit-thumbs.mjs` (teardown, variants, overlay caps, anti-cliché blocklist, A/B plan → `thumbs-audit.md`) + a fresh **thumbs-auditor subagent** signing PASS / FIX NEEDED |
| **content-repurposing-hub** | Turn ONE source (blog post / podcast / video / thread / idea) into a **multi-platform content pack** — per-platform NATIVE angles (X = thread, LinkedIn = story/lesson, newsletter = issue, carousel = slides, blog = SEO article, Shorts = clip — from `templates/platform-angles.md`), **no copy-paste reposts** (anti-repost hook-overlap check enforced by `repurpose-writer.mjs`, exit 1 on duplicates), a staggered cross-post calendar, one CTA per piece — **audit harness**: `audit-repurpose.mjs` (source, platform count, native angles, no duplicates, CTAs, calendar → `repurpose-audit.md`) + a fresh **repurpose-auditor subagent** signing PASS / FIX NEEDED. Delegates production to the producer skills |
| **sponsorship-pipeline** | Turn a creator's audience into **brand-deal revenue** — media kit (audience stats + engagement + the offer), **rate card computed from niche CPM/RPM benchmarks** by `rate-card.mjs` (honest ranges, no guarantees), personalized outreach + negotiation scripts (FTC disclosure built in, zero placeholders survive), and a deal-tracking sheet with the day 3/7/14 follow-up cadence — **audit harness**: `audit-sponsor.mjs` (kit, rate card honesty, outreach structure + disclosure + no placeholders, tracking → `sponsor-audit.md`) + a fresh **sponsor-auditor subagent** signing PASS / FIX NEEDED |
| **newsletter-growth** | Grow an editorial newsletter (Beehiiv / Substack / ConvertKit) with **story-first issues** people actually open and forward — subject-line packs from proven formulas (≤ 60 chars, one formula), a story-spine issue writer (open loop → rising tension → payoff → ONE CTA + growth plug, enforced by `issue-writer.mjs`), welcome-sequence + referral-loop + cross-promo growth tactics, and an analytics review loop — **audit harness**: `audit-newsletter.mjs` (subject, story spine, anti-fluff, CTA/growth, word window, growth plan → `newsletter-audit.md`) + a fresh **newsletter-auditor subagent** signing PASS / FIX NEEDED |
| **podcast-to-shorts** | Turn long-form podcast/video content into **viral-ready vertical clips** — `clip-finder.mjs` scores every transcript moment on a virality scorecard (hook/emotion/controversy/quotability), picks the standalone winners, and generates the exact **FFmpeg 9:16 cut commands** — plus a hook + caption per clip — **audit harness**: `audit-clips.mjs` (transcript, scored moments, cut commands, clips output, captions → `clips-audit.md`) + a fresh **clips-auditor subagent** signing PASS / FIX NEEDED |
| **youtube-video-pipeline** | Plan long-form YouTube videos end-to-end: researched `video-brief.md` → retention-engineered script (hook in 30s, open loops) → **10-variant title pack** scored on CTR formulas + 60-char limit (`title-pack.mjs`) → thumbnail brief + image-gen prompt → description + chapters + tags — **audit harness**: `audit-video-plan.mjs` (brief, script hook, title pack, thumbnail, metadata → `video-plan-audit.md`) + a fresh **video-plan-auditor subagent** signing PASS / FIX NEEDED |
| **blog-seo-content** | SEO articles that rank **and** get cited by AI search (GEO) — `keyword-outline.mjs` builds the keyword cluster + intent scores + outline scaffold → approved `seo-brief.md` → E-E-A-T-rich article (named author, cited stats, quotable blocks) + meta title/description pack — **audit harness**: `audit-blog.mjs` (brief, headings, EEAT, citations, quotable blocks, anti-fluff, meta → `blog-audit.md`) + a fresh **blog-auditor subagent** signing PASS / FIX NEEDED |
| **linkedin-personal-brand** | Founder/creator LinkedIn presence that compounds — **capture the user's real voice first** (`voice-capture.md`), then headline + About rewrite, a weekly post calendar (story/teaching/contrarian/win/question roles, one CTA each), and a comment + connection strategy — **audit harness**: `audit-brand.mjs` (voice, bio, calendar, engagement, blocklists → `brand-audit.md`) + a fresh **brand-auditor subagent** signing PASS / FIX NEEDED |
| **x-threads-engagement** | Write scroll-stopping **X/Twitter threads** that get read, shared, and followed — viral thread formulas (hook → numbered beats → CTA, from `thread-formulas.md`), story-spine + addiction rails (open loop → rising tension → payoff → loop ending, enforced by `thread-writer.mjs` with 280-char caps + anti-fluff/bait-spam blocklists), an engagement ritual (reply-first hour, quote-post strategy, DM follow-ups), and a day-7 metrics review — **audit harness**: `audit-threads.mjs` (hook, char caps, story spine, fluff, engagement → `threads-audit.md`) + a fresh **x-auditor subagent** signing PASS / FIX NEEDED |
| **social-media-content-plan** | **30-day algorithm-reset content plan across user-selected platforms** (Instagram · X · LinkedIn · TikTok · YouTube (Shorts + long-form) · Facebook · Threads) — honest per-platform strategy (how each algorithm actually ranks in 2026, the 14-day re-training sprint, native formats, cadence, hashtag/keyword rules — grounded by `platform-playbook.mjs`), 3–4 content pillars + hook bank, a deterministic day-by-day calendar (`build-calendar.mjs` from `plan.json`), a first-60-minute engagement protocol, and a metrics/review loop (day-7/14/21/30) — **audit harness**: `audit-content-plan.mjs` (platform coverage, reset framing, pillars, calendar, engagement, metrics, fluff blocklist → `content-plan-audit.md`) + a fresh **content-plan-auditor subagent** signing PASS / FIX NEEDED |
| **skill-builder** (meta) | Scaffold **new skills** the deepak-skill way — `scaffold-skill.mjs` generates the folder, SKILL.md contract (quality bar + workflow + checklist), Deepak-branded scripts, templates and examples, then wires the skill into README/USAGE/prompt-examples — **audit harness**: `audit-scaffold.mjs --docs` checks the new skill against the repo contract (SKILL.md, scripts, templates/examples, docs wiring + counts → `scaffold-audit.md`) + a fresh **scaffold-auditor subagent** signing PASS / FIX NEEDED |
| **mcp-agent-builder** | Build **MCP servers + the AI agents that use them** end-to-end in any IDE/CLI — a **discovery interview** (connector, users, action surface, auth, deployment model) → `mcp-prd.md` (problem, users, tools/resources/prompts, auth, non-goals, metrics) → `mcp-architecture.md` (ONE deployment model: stdio / remote HTTP / MCPB — transport + auth flow must match) → **runnable server** (`scaffold-server.mjs` generates a real `@modelcontextprotocol/sdk` server from `mcp-plan.json`, one handler per tool, exit 1 on bad plans) → `agent-design.md` (system prompt + tool wiring + guardrails) → `ide-cli-matrix.md` (connect in Claude Code, Cursor, Codex CLI, Gemini CLI, OpenCode, Cline, Windsurf, VS Code, Zed) — **audit harness**: `audit-mcp.mjs` (PRD, architecture, scaffold, agent wiring, IDE matrix, secrets → `mcp-audit.md`) + a fresh **mcp-auditor subagent** signing PASS / FIX NEEDED |
| **veo-cinematic-reels** | Reel scripts + **rich long-form copy-paste video prompts (~150–250 words) that work in ANY generator** — Google Flow / Veo 3.1, Kling, Luma, Runway, Hailuo, Vidu, Pika, PixVerse — manual copy-paste workflow with **character consistency locked** (reference-image ingredients + a verbatim character block in EVERY prompt, self-verified by `scene-prompts.mjs`), **IMAX-level cinematic language** with per-scene lens/tempo/lighting detail, locked color grading (film-stock tokens), native dialogue/SFX audio, a labeled **negative prompt** + locked **seed** per scene, per-tool upload instructions (Ingredients / Elements / image-to-video) — **and an audit harness**: `audit-reels.mjs` (automated per-scene token/verify/length/negative/seed/bridge checks → `reels-audit.md`) + a fresh **reel-auditor subagent** scoring reel-worthiness (/50) and signing PASS / FIX NEEDED |
| **serial-story-reels** | **EPISODIC story video series** for Google Flow / Veo 3.1 — comic, love story, action, thriller or fantasy (or the user's own characters via image uploads): a **story bible** (season arc + per-episode hooks + cliffhangers, validated by `series-arc.mjs`) → **character sheets** (verbatim blocks + reference-image prompts) → a **self-verified copy-paste prompt pack for EVERY scene of EVERY episode** (`episode-prompts.mjs`, exits 1 on drift) so the SAME characters stay consistent ACROSS episodes — plus cinematic action/motion language, native Veo dialogue/SFX, and a **voiceover line sheet** for a Kokoro post pass |
| **photoshoot-studio** | **AI photoshoot prompt packs for people AND products** (Google Flow / Nano Banana Pro, Midjourney, Flux) — manual copy-paste workflow with **subject consistency locked** (reference-image ingredients + a verbatim person/product block in EVERY prompt, self-verified by `shot-prompts.mjs`), **professional photography language** (camera body, lens, f-stop, lighting setup, film stock), locked grade per shoot, per-platform aspect ratios, short **edit/inpaint prompts** for re-posing / re-outfitting / re-lighting — **and an audit harness**: `audit-shoot.mjs` (per-shot token/verify/aspect/edit checks → `shoot-audit.md`) + a fresh **shoot-auditor subagent** scoring shoot-worthiness (/50) and signing PASS / FIX NEEDED |
| **paid-ads-studio** | **The paid engine** — end-to-end ad campaign production for **Meta + Google**: copy-paste **Veo 3.1 video ad prompts** + **image ad prompts** (Nano Banana Pro / Midjourney / Flux) with **locked brand consistency** (verbatim product block in EVERY prompt, self-verified by `ad-prompts.mjs`), **hook-first ad copy** inside every platform's char limits (anti-fluff enforced by `ad-copy.mjs`), **campaign blueprints** (Meta ODAX + Advantage+ audiences · Google Demand Gen + PMax + Search, audience signals ≠ targeting), **2026 AI-content compliance checklists**, a **cost-management plan** (ramp / learning / kill / scale), a **benchmark-driven forecast** of expected results — impressions, clicks, conversions, CPA, ROAS across conservative/base/aggressive scenarios (`forecast-ads.mjs`) — **and an audit harness**: `audit-ads.mjs` (automated hook/char/consistency/compliance checks → `ad-audit.md`) + a fresh **ads-auditor subagent** scoring hook worthiness (/50) and signing PASS / FIX NEEDED before anything ships. Built-in example: **"Brew & Co Tumbler — Paid Launch"** (full launch-ready pack). |
| **vibe-code-webapp** | Build **or extend** production-ready vibe-coded web apps at **20-year-expert depth** — **detailed idea interview** first (+ existing-project scan `scan-project.mjs` → `project-scan.md`) → **expert research** (`research-playbook.md`: signals + competitor teardown + TAM/SAM/SOM + channels + pricing + positioning) → **SaaS validator** (`saas-validator.md` + `saas-score.mjs` → `validation.md`: /35 verdict, kill criteria, unit economics, kill guardrail, validation moves) → **Build Pack** (`PRD.md` + `stack-blueprint.md` — with a **design source of truth**: Figma via the **Figma Developer MCP**, **Google Stitch** `DESIGN.md`, or the open-source pack (`frontend-design.md`), plus **AI-feature rails** when the PRD has AI (`ai-logic.md`) — + **`sitemap.md`** + **`TODO.md`** P0/P1/P2 via `todo.mjs`) → **you approve the pack AND the todo list** → builds **step by step** from `vibe-coder-instructions.md` (BUILD.md, golden loop + design parity) filing **detailed `build-report.md`** reports → **production audit** (`--payments`/`--ai` flags) → **everything-auditor** final review → **daily `MEMORY.md`** keeps you and any AI in sync |

The skills are a complete production pipeline: **what's trending** (research + brainstorm) → **what to say** (hooks) → **how it looks** (motion / assets / thumbnails) → **how it sounds** (voice/SFX) → **approved & audited** (video-product-pipeline) → **multiplied** (podcast→shorts, YouTube packaging, SEO blog, LinkedIn, X threads, editorial newsletters) → **paid** (Meta + Google ad campaigns with forecast-first economics via paid-ads-studio).

**Every skill now ships the same audit-harness pattern**: an `audit-*.mjs` script runs the automated checks on the delivered pack (consistency tokens, verify markers, char limits, blocklists, output files → `*-audit.md`, exit 0/1/2), then a FRESH `<skill>-auditor` subagent completes a /50 worthiness scorecard and signs **PASS / FIX NEEDED** — nothing ships until PASS. Skills with a harness: text-motion-reels, hook-storyboard-retention, voice-sfx-audio, video-asset-reels, carousel-post-images, veo-cinematic-reels, photoshoot-studio, podcast-to-shorts, youtube-video-pipeline, blog-seo-content, linkedin-personal-brand, social-media-content-plan, skill-builder, serial-story-reels, paid-ads-studio, vibe-code-webapp, video-product-pipeline, email-marketing, x-threads-engagement, newsletter-growth, mcp-agent-builder, ebook-builder, thumbnail-studio, content-repurposing-hub, sponsorship-pipeline.

---

## Quick start — install in your project (3 steps)

> **Want the DEEPAK banner in your terminal?** Clone the repo and run `./install.sh` — the branded installer prints the DEEPAK ASCII banner, lists all 25 skills, and installs them (Windows: use Git Bash). Full guide: [`install.md`](install.md).
>
> **Using the claude.com website (browser, no terminal)?** No install needed — copy-paste the skill instructions and Claude follows them in the chat. Step-by-step: [`CLAUDE-COM.md`](CLAUDE-COM.md).

### 1. Prerequisites

- **Node.js 18+** (installs `npx` automatically)
- **Google Chrome** — used to render frames
- **FFmpeg** — assembles the final MP4 (only needed for video output)

### 2. Install the skills

Run this **inside your project folder**:

```bash
npx skills add Deepak-ai-93/deepak-skill --all
```

That's it. It installs all twenty-five skills into `.agents/skills/` — no heavy media, no demo files. **Or run the branded installer** (`install.sh`) for the DEEPAK terminal banner.

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
| **ebook-builder only** (self-contained — SKILL.md + scripts/ + templates/ + examples/, works standalone in any project) | `npx skills add Deepak-ai-93/deepak-skill --skill ebook-builder` |
| **vibe-code-webapp only** (self-contained — SKILL.md + scripts/ + templates/, works standalone in any project) | `npx skills add Deepak-ai-93/deepak-skill --skill vibe-code-webapp` |
| **email-marketing only** (self-contained — SKILL.md + scripts/ + templates/ + examples/, works standalone in any project) | `npx skills add Deepak-ai-93/deepak-skill --skill email-marketing` |
| **thumbnail-studio only** (self-contained — SKILL.md + scripts/ + templates/ + examples/, works standalone in any project) | `npx skills add Deepak-ai-93/deepak-skill --skill thumbnail-studio` |
| **content-repurposing-hub only** (self-contained — SKILL.md + scripts/ + templates/ + examples/, works standalone in any project) | `npx skills add Deepak-ai-93/deepak-skill --skill content-repurposing-hub` |
| **sponsorship-pipeline only** (self-contained — SKILL.md + scripts/ + templates/ + examples/, works standalone in any project) | `npx skills add Deepak-ai-93/deepak-skill --skill sponsorship-pipeline` |
| **podcast-to-shorts only** (self-contained — SKILL.md + scripts/ + templates/ + examples/, works standalone in any project) | `npx skills add Deepak-ai-93/deepak-skill --skill podcast-to-shorts` |
| **youtube-video-pipeline only** (self-contained — SKILL.md + scripts/ + examples/, works standalone in any project) | `npx skills add Deepak-ai-93/deepak-skill --skill youtube-video-pipeline` |
| **blog-seo-content only** (self-contained — SKILL.md + scripts/ + templates/ + examples/, works standalone in any project) | `npx skills add Deepak-ai-93/deepak-skill --skill blog-seo-content` |
| **linkedin-personal-brand only** (self-contained — SKILL.md + templates/ + examples/, works standalone in any project) | `npx skills add Deepak-ai-93/deepak-skill --skill linkedin-personal-brand` |
| **x-threads-engagement only** (self-contained — SKILL.md + scripts/ + templates/ + examples/, works standalone in any project) | `npx skills add Deepak-ai-93/deepak-skill --skill x-threads-engagement` |
| **newsletter-growth only** (self-contained — SKILL.md + scripts/ + templates/ + examples/, works standalone in any project) | `npx skills add Deepak-ai-93/deepak-skill --skill newsletter-growth` |
| **social-media-content-plan only** (self-contained — SKILL.md + scripts/ + templates/ + examples/, works standalone in any project) | `npx skills add Deepak-ai-93/deepak-skill --skill social-media-content-plan` |
| **skill-builder only** (self-contained — SKILL.md + scripts/, works standalone in any project) | `npx skills add Deepak-ai-93/deepak-skill --skill skill-builder` |
| **mcp-agent-builder only** (self-contained — SKILL.md + scripts/ + templates/ + examples/, works standalone in any project) | `npx skills add Deepak-ai-93/deepak-skill --skill mcp-agent-builder` |
| **veo-cinematic-reels only** (self-contained — SKILL.md + scripts/ + templates/ + examples/, works standalone in any project) | `npx skills add Deepak-ai-93/deepak-skill --skill veo-cinematic-reels` |
| **serial-story-reels only** (self-contained — SKILL.md + scripts/ + templates/ + examples/, works standalone in any project) | `npx skills add Deepak-ai-93/deepak-skill --skill serial-story-reels` |
| **photoshoot-studio only** (self-contained — SKILL.md + scripts/ + templates/ + examples/, works standalone in any project) | `npx skills add Deepak-ai-93/deepak-skill --skill photoshoot-studio` |
| **paid-ads-studio only** (self-contained — SKILL.md + scripts/ + templates/ + examples/, works standalone in any project) | `npx skills add Deepak-ai-93/deepak-skill --skill paid-ads-studio` |
| Install globally (any project, any machine) | `npx skills add Deepak-ai-93/deepak-skill --all -g` |
| Target specific agents | `npx skills add Deepak-ai-93/deepak-skill --all -a claude-code -a cursor` |
| Install from a local clone | `npx skills add ./deepak-skill --all` |

**Verify the install:**

```bash
ls .agents/skills/
# blog-seo-content  carousel-post-images  content-repurposing-hub  ebook-builder  email-marketing  hook-storyboard-retention  newsletter-growth
# linkedin-personal-brand  mcp-agent-builder  paid-ads-studio  photoshoot-studio  podcast-to-shorts  serial-story-reels  skill-builder
# social-media-content-plan  sponsorship-pipeline  text-motion-reels  thumbnail-studio  veo-cinematic-reels  video-asset-reels  video-product-pipeline
# vibe-code-webapp  voice-sfx-audio  x-threads-engagement  youtube-video-pipeline
```

**Update:** `npx skills update` • **Remove:** `npx skills remove <skill-name>`

See the [skills.sh docs](https://www.skills.sh/docs) for more options (`--list`, `--copy`, packs, etc.).

---

## Usage

### Format wizard + 4K rendering (`text-motion-reels`)

The `text-motion-reels` skill starts with an **interactive format wizard** — the agent asks you to pick one of 11 trending text-only formats before building anything:

1. **Word Pop** — Hormozi-style high-impact captions (business, hot takes)
2. **Highlighter** — Vox-style analytical explainer (psychology, facts)
3. **3D Editorial** — luxury quiet minimalist (mindset, stoic)
4. **Card Listicle** — numbered save-bait grid (finance, productivity)
5. **Chat Thriller** — text-message storytime (reddit, drama)
6. **SVG Ambient** — animated SVG backgrounds (mindset, aesthetic, brand)
7. **Micro-Fiction** — word-by-word story reveal, cliffhanger endings (horror, sci-fi, drama)
8. **Quiz Trap** — countdown riddle / "only 2% can…" (trivia, psychology, watch-twice)
9. **Day Counter** — "Day 1 vs Day 90" metric timeline (finance, fitness, growth)
10. **Notification Drop** — simulated phone notification skits (humor, relatable)
11. **Thread Court** — Reddit-style post + verdict reveal (AITA, drama, comment bait)

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

Scroll-stopping LinkedIn/Instagram **carousels as image sets at 4K** — **one script, two CLI modes** on a shared `slides.html` deck. Every deck clears a fixed quality bar: **4K resolution** (≥ 4000px long edge), **photorealistic real-life scenario visuals**, and **viral anti-fluff copywriting** (hook formulas + a fluff blocklist — no "unlock", no "game-changer"). The agent always presents the two-mode choice before generating:

- **Mode 1 — Browser render (any CLI):** `node render/render-carousel.mjs --html slides.html --out carousel/ --4k` → pixel-perfect 4320×5400 (4:5) / 4320×4320 (1:1) PNGs, text never garbled
- **Mode 2 — Image-model generation (photoreal):** `node render/render-carousel.mjs --html slides.html --out carousel/ --mode model` → exports per-slide 4K prompts (`prompts.md`) with the deck's exact copy → dispatch to the CLI's native image tool (Codex `image_gen` / Grok `/imagine` / Antigravity artifacts) at 4K; text is verified — LLM models garble on-image text, so any wrong character gets regenerated or falls back to Mode 1

Then: **audit** (text accuracy, copy punch, scene authenticity, contrast, style consistency, 4K size) → **`caption.md`** (500–900 chars per platform, no hashtags, hook first, one CTA).

Built-in examples — **"Day in the life of an AI developer"** (`examples/day-in-the-life-dev/`, browser-mode deck) and **"3 Money Rules Nobody Told You"** (`examples/real-life-money/`, image-model mode: hand-written per-slide 4K prompts + fallback deck) — both with full caption packs.

> "Make a carousel: 3 money rules nobody told you. Real scenes, image-model mode, 8 slides, 4K, LinkedIn."
> → choose mode → `prompts.md` → 4K images → `caption.md` → auditor check → deliver

### Ebook lead magnets (`ebook-builder`)

Build **designed ebooks** (guides / checklists / frameworks) as print-ready **A4 PDF + 4K page PNGs + cover.png** — it starts from **author memory + taste** (`ebook-memory.md`: identity, voice fingerprint, design defaults, past builds — read at Stage 0, written back at Stage 8, so every book is written in the author's voice with zero banned words), then runs the **design picker**: pick ONE of **six layouts** (Editorial Classic · Modern Bold · Minimal Luxury · Playful Pop · Technical Dark · Nature Calm) + ONE of **30 palettes** + accent/type pairing + ONE of **6 cover styles** + ONE motif family + mood/texture, then generate in **two modes** like the carousel:

```bash
cd skills/ebook-builder
node scripts/render-ebook.mjs --html ebook.html --out ebook/ --pdf         # Mode 1: A4 PDF + cover.png + page PNGs (headless Chrome)
node scripts/render-ebook.mjs --html ebook.html --out ebook/ --mode model # Mode 2: photoreal cover + interior scene prompts (prompts.md)
node scripts/audit-ebook.mjs --pack <ebook-folder> --out ebook-audit.md   # automated audit → spawn ebook-auditor subagent
```

Deliverables: `ebook.html` (single source of truth, one `.page` per book page, `data-layout` + `data-palette` + `data-motif` on every page, `data-cover-style` on the cover) → `ebook.pdf` + `cover.png` + `pages/*.png` (Mode 1, 2× = 2160×3056) **or** `prompts.md` (Mode 2 — design-token prompts dispatched to Nano Banana / Midjourney / Flux at 4K) → `ebook-audit.md`. Story-first structure enforced (cover opens a loop → chapters escalate → payoff → CTA) + **author memory** (`templates/memory-profile.md` — the durable `ebook-memory.md` every build reads + writes) + **taste profile** (`templates/taste-profile.md` — voice capture card) + the **design picker card** (`templates/design-picker.md`) + **cover-image brief** (`templates/cover-brief.md` — one idea, title ≤ 6 words, thumbnail-readable). Built-in examples: **"The 5-Page Pricing Fix"** (`examples/pricing-guide/`, Modern Bold · Electric Blue) and **"The Shipping Playbook"** (`examples/dev-shipping-playbook/`, Technical Dark · Terminal Green) — decks + generated prompts, each with its author's `ebook-memory.md`.

> "Build me a lead-magnet ebook: the 5-Page SaaS Pricing Fix — Modern Bold design, ~7 pages, killer cover, A4 PDF."
> → memory + taste (author voice loaded) → design picker (layout + palette + cover style + motif) → `ebook.html` → render (PDF + cover + pages) → auditor check → deliver

### YouTube thumbnails (`thumbnail-studio`)

The visual CTR engine for `youtube-video-pipeline` — a **CTR teardown** of the niche first, then **3–5 thumbnail variants** with photoreal image-gen prompts + an A/B plan:

```bash
cd skills/thumbnail-studio
node scripts/thumbnail-prompts.mjs --plan thumbnail-plan.json --out thumbnails.md   # builds + self-verifies (overlay ≤ 5 words, anti-cliché, exit 1 on drift)
node scripts/audit-thumbs.mjs --pack <thumbnail-folder> --out thumbs-audit.md       # automated audit → spawn thumbs-auditor subagent
```

Deliverables: `thumbnail-teardown.md` (niche patterns + the ONE idea) → `thumbnails.md` (3–5 variants, each = ONE idea + ≤ 5-word overlay + 1280×720 photoreal prompt for Nano Banana / Midjourney / Flux) → `ab-test.md` (2 variants, identical title, window, niche CTR benchmarks) → `thumbs-audit.md`. Built-in example: **"3 Pricing Mistakes"** (`examples/pricing-video/`).

> "Make 3 thumbnails for my SaaS pricing video — teardown my niche first, give me prompts + an A/B plan."
> → CTR teardown → 3–5 variants (`thumbnail-prompts.mjs`) → `ab-test.md` → auditor check → deliver

### Repurposing hub (`content-repurposing-hub`)

Turn ONE source into **platform-native pieces** — the orchestrator that hands each piece to its producer skill:

```bash
cd skills/content-repurposing-hub
node scripts/repurpose-writer.mjs --plan repurpose-plan.json --out hub-plan.md   # builds + validates (≥ 2 platforms, no near-duplicate hooks, exit 1 on bad plans)
node scripts/audit-repurpose.mjs --pack <hub-folder> --out repurpose-audit.md    # automated audit → spawn repurpose-auditor subagent
```

Deliverables: `hub-plan.md` (angle bank + per-platform cards: format, native angle, unique hook, producer skill, one CTA) + `calendar.md` (staggered cross-post order — no same-day self-competing) + `repurpose-audit.md`. The **anti-repost rule** is script-enforced: two pieces opening with the same line fail the build. Built-in example: **"The 5-Page Pricing Fix hub"** (`examples/pricing-guide-hub/`, X + LinkedIn + newsletter + carousel).

> "Repurpose my pricing-guide blog post — X thread, LinkedIn post, newsletter issue and a carousel, all natively, no copy-paste."
> → angle bank → `hub-plan.md` (unique hooks per platform) → `calendar.md` → auditor check → deliver to each producer skill

### Sponsorship pipeline (`sponsorship-pipeline`)

The monetization layer — turn the audience into brand deals:

```bash
cd skills/sponsorship-pipeline
node scripts/rate-card.mjs --niche saas --followers 48000 --platform youtube --views 210000   # → rate-card.md from niche CPM/RPM benchmarks
node scripts/audit-sponsor.mjs --pack <sponsor-folder> --out sponsor-audit.md                   # automated audit → spawn sponsor-auditor subagent
```

Deliverables: `media-kit.md` (audience + engagement + the offer — the sponsor's problem first) → `rate-card.md` (benchmark-grounded ranges, no guarantees) → `outreach.md` (≥ 2 personalized pitches with problem/proof/offer/ask + negotiation scripts + FTC disclosure) → `tracking.md` (pipeline + day 3/7/14 follow-ups) → `sponsor-audit.md`. Built-in example: **"Alex Rivera — SaaS creator deals"** (`examples/saas-creator-deals/`).

> "Build my media kit + rate card + outreach for brand deals. Niche: SaaS, 48k YouTube, 12k newsletter."
> → interview → `rate-card.mjs` (benchmarks) → media kit → 3 personalized pitches → tracking → auditor check → deliver

### Emails (`email-marketing`)

High-converting, **spam-free HTML emails** for Brevo / MailerLite / Mailchimp / Klaviyo and any ESP — one folder per campaign with **five files**: a **high-CTR subject line pack** (`subject-lines.md` — 3–5 variants from proven formulas, winner marked, A/B plan), a **bulletproof responsive `email.html`** (tables + inline CSS, dark-mode aware, preheader, compliance footer), a **`plain.txt`** fallback, a **`validation-report.md`** from `validate-email.mjs` (spam-trigger scan, ALL-CAPS/`!!!` check, unsubscribe + physical-address compliance, alt text, text:image ratio, E-E-A-T signals — real author, proof, social proof, human reply-to), and **`preview/` screenshots** (desktop 600px + mobile 320px) for the visual audit.

Built-in example — **"Meet Replays" product launch** (`examples/product-launch/`): full email + subject pack + copy breakdown (why every line is there) + plain text + the ESP merge-tag swap sheet.

> "Write a product-launch email for our SaaS — audience: existing customers, goal: demo clicks. Make it spam-free with high-CTR subject lines and strong E-E-A-T."
> → subject line pack → `email.html` + `plain.txt` → `validate-email.mjs` report → preview screenshots → auditor sign-off → deliver

### Editorial newsletters (`newsletter-growth`)

Grow an editorial newsletter (Beehiiv / Substack / ConvertKit) with **story-first issues** — subject-line pack (≤ 60 chars, one proven formula) → story-spine issue (open loop → stakes → payoff → value receipts → **ONE CTA + ONE growth plug**):

```bash
cd skills/newsletter-growth
node scripts/issue-writer.mjs --plan issue-plan.json --out issue.md          # assembles + validates (exit 1 on bad plans)
node scripts/audit-newsletter.mjs --pack <newsletter-folder> --out newsletter-audit.md   # automated audit → spawn newsletter-auditor subagent
```

Deliverables: `issue.md` (subject + story-first body, word window 350–900, no fluff) + `growth-plan.md` (welcome sequence, referral loop, cross-promos, analytics review) + `newsletter-audit.md`. Distinct from `email-marketing` — that's transactional ESP campaigns; this is editorial + growth. Built-in example: **"Founder Welcome"** (`examples/founder-welcome/`).

> "Write my newsletter issue this week — story-first. Niche: SaaS pricing for founders. Goal: replies + forwards."
> → subject formula → story plan → `issue-writer.mjs` → `growth-plan.md` → auditor check → deliver

### Podcast → Shorts (`podcast-to-shorts`)

Long-form content → **viral-ready vertical clips**. The pipeline scores, picks, and cuts:

```bash
cd skills/podcast-to-shorts
node scripts/clip-finder.mjs --transcript transcript.txt --clips 5 --out clip-plan.md   # score moments
node scripts/clip-finder.mjs --cuts clip-plan.md --input episode.mp4 --run               # cut 1080x1920 clips
```

The transcript is auto-scored on hook/emotion/controversy/quotability; only standalone moments above the cutoff become clips. Each clip gets a hook + platform caption → `captions.md`. Built-in example: `examples/transcript-sample.txt` + `examples/clip-plan.md`.

> "Turn this 1-hour podcast episode into 5 shorts — clip the most viral moments."
> → transcript → score → clip-plan → FFmpeg cuts → captions → auditor check → deliver

### YouTube pipeline (`youtube-video-pipeline`)

Plan long-form YouTube videos end-to-end: researched angle → retention-engineered script (hook in the first 30s) → a **10-variant title pack** (scored on CTR formulas + the 60-char mobile limit):

```bash
cd skills/youtube-video-pipeline
node scripts/title-pack.mjs --topic "saas pricing" --angle "3 pricing mistakes founders make" --out titles.md
```

Then the agent writes the thumbnail brief (+ image-gen prompt), description with chapters, and tags — all matching the script's promise (no clickbait mismatch). Built-in example: `examples/titles.md`.

> "Plan a YouTube video: 3 SaaS pricing mistakes founders make — script, 10 titles, thumbnail brief, description."
> → brief → approve → script → title pack → thumbnail → metadata → auditor check → deliver

### SEO blog content (`blog-seo-content`)

Articles that rank on search **and** get cited by AI search engines:

```bash
cd skills/blog-seo-content
node scripts/keyword-outline.mjs --seed "saas onboarding" --out seo-brief.md
```

Keyword cluster + intent scores + outline scaffold → **your approval** → E-E-A-T-rich article (named author, every stat cited, quotable "Bottom line" block) + meta title/description/slug pack.

> "Write a blog post about saas onboarding that ranks and gets cited by ChatGPT — EEAT-heavy, one keyword, meta pack."
> → seo-brief → approve → article.md → meta.md → auditor check → deliver

### LinkedIn personal brand (`linkedin-personal-brand`)

Build a founder/creator presence that compounds — **your real voice captured first** (never template-speak), then a headline + About rewrite, a weekly post calendar (varied roles, one CTA each), and a comment + connection strategy. Ships `templates/voice-capture.md`, `templates/post-formulas.md`, and a week-one calendar example.

> "Help me build my LinkedIn — capture my voice, rewrite my bio, and give me a week of posts."
> → voice capture → voice-profile.md → bio.md → calendar.md → engagement.md → auditor check → deliver

### X threads & engagement (`x-threads-engagement`)

Write scroll-stopping **X threads** that get read, shared, and followed — one formula (curiosity / contrarian / results / list / pain / story) → story-spine thread plan (hook ≤ 100 chars opens a loop → rising beats → payoff → CTA/loop):

```bash
cd skills/x-threads-engagement
node scripts/thread-writer.mjs --plan thread-plan.json --out thread.md      # assembles + validates (exit 1 on bad plans)
node scripts/audit-threads.mjs --pack <thread-folder> --out threads-audit.md   # automated audit → spawn x-auditor subagent
```

Deliverables: `thread.md` (numbered tweets, 280-char caps, role-annotated story spine, no fluff/bait-spam) + `engagement.md` (the reply-first hour, quote-post strategy, DM follow-ups — the replies are the growth) + `threads-audit.md`. Built-in example: **"Founder Pricing Thread"** (`examples/founder-pricing-thread/`).

> "Write a viral X thread: 3 pricing mistakes founders make. Goal: follows + replies."
> → formula → thread plan → `thread-writer.mjs` → `engagement.md` → auditor check → deliver

### Social media content plans (`social-media-content-plan`)

Reset a stalled algorithm with a **platform-native 30-day content plan** — you pick the platforms (Instagram · X · LinkedIn · TikTok · YouTube (Shorts + long-form) · Facebook · Threads):

```bash
cd skills/social-media-content-plan
node scripts/platform-playbook.mjs --platform instagram,x,linkedin   # grounded 2026 algorithm facts for strategy.md
node scripts/build-calendar.mjs --plan plan.json --out calendar.md   # deterministic 30-day calendar (validated, exit 1 on bad plans)
node scripts/check-skills.mjs --out companion-skills.md              # companion gate: which producer skills are installed + install commands
node scripts/audit-content-plan.mjs --pack <plan-folder> --platforms instagram,x --out content-plan-audit.md   # automated audit → spawn content-plan-auditor subagent
```

Deliverables: `strategy.md` (per-platform algorithm strategy + **honest 14-day re-training sprint framing** — no "hacks", no guaranteed view counts) → `pillars.md` (3–4 narrow pillars + ≥ 8 hook bank) → `calendar.md` (day-by-day posts: pillar / format / hook / one CTA / metric-to-watch) → `engagement.md` (the **first-60-minute protocol** — the window that decides tier expansion) → `metrics.md` (dwell / completion / save-share / follower-conversion + day-7/14/21/30 review loop) → **`companion-skills.md`** (the **companion gate** — `check-skills.mjs` shows which producer skills are installed — text-motion-reels / veo-cinematic-reels / carousel-post-images / linkedin-personal-brand / youtube-video-pipeline / voice-sfx-audio — and installs the missing ones so the calendar is actually executable). Built-in example: **"Dan — fitness coach reset"** (Instagram + X + LinkedIn + YouTube, full pack in `examples/fitness-coach-reset/`).

> "My Instagram and X are dead — build me a 30-day content plan to reset the algorithm. Niche: fat loss for busy professionals."
> → Platform Wizard (3 questions) → playbook → strategy → pillars → 30-day calendar → engagement + metrics → auditor check → deliver

### Build new skills (`skill-builder`)

Scaffold the next skill in the repo's conventions — quality-bar SKILL.md, Deepak-branded scripts, templates, examples:

```bash
cd skills/skill-builder
node scripts/scaffold-skill.mjs --name my-new-skill --desc "one-liner" --scripts tool-a,tool-b --templates guide --example 1
node scripts/scaffold-skill.mjs --list   # show every skill in skills/
```

> "Add a new skill for {topic} to the repo."
> → scaffold → fill the placeholders → wire into README/USAGE/prompt-examples → validate → audit

### MCP servers + AI agents (`mcp-agent-builder`)

Build an **MCP server and the agent that uses it** end to end — the full path from idea to a running server connected in any IDE/CLI. Discovery first (never scaffold blind), then PRD, architecture, scaffold, agent wiring:

```bash
cd skills/mcp-agent-builder
node scripts/scaffold-server.mjs --plan mcp-plan.json --out server    # generates a real @modelcontextprotocol/sdk server (exit 1 on bad plans)
node scripts/audit-mcp.mjs --pack <mcp-folder> --out mcp-audit.md    # automated audit → spawn mcp-auditor subagent
```

Deliverables: `mcp-discovery.md` (interview + Decisions) → `mcp-prd.md` (problem/users/tools/auth/non-goals/metrics) → `mcp-architecture.md` (ONE deployment model — stdio / remote HTTP / MCPB — with matching transport + auth flow) → `server/` (runnable scaffold: SDK + zod, a handler per tool in mock mode, README, per-IDE `config/` snippets, `.env.example` — no secrets) → `agent-design.md` (system prompt + tool wiring + guardrails) → `ide-cli-matrix.md` (Claude Code `claude mcp add`, Cursor `.cursor/mcp.json`, Codex `config.toml`, Gemini CLI, OpenCode, Cline, Windsurf, VS Code, Zed) → `mcp-audit.md`. Built-in example: **"social-poster"** (an Instagram + X posting/analytics MCP server, full pack in `examples/social-poster/`).

> "Build me an MCP server that posts my drafts to Instagram and X — full path from idea to connected server in Claude Code."
> → discovery → PRD → architecture → scaffold (`scaffold-server.mjs`) → agent design + IDE matrix → audit (`audit-mcp.mjs` + mcp-auditor) → deliver

### Google Flow / Veo reels (`veo-cinematic-reels`)

Reel scripts + **rich, long-form copy-paste video prompts (~150–250 words) that work in any video generator** — Google Flow / Veo 3.1, Kling, Luma, Runway, Hailuo, Vidu, Pika, PixVerse — one prompt per scene, engineered so the **character never changes** between scenes (reference-image ingredients uploaded once per tool + a verbatim character block in EVERY prompt, self-verified word-by-word):

```bash
cd skills/veo-cinematic-reels
node scripts/scene-prompts.mjs --plan scene-plan.json --out prompts.md   # builds + verifies the prompt pack
```

Deliverables: `character-sheet.md` (verbatim character/world/grade blocks + 2–3 reference-image prompts for Nano Banana Pro) → `scene-script.md` (hook → agitate → payoff → CTA/loop with continuity written across boundaries) → `prompts.md` (IMAX-scale camera language, per-scene lens/tempo/lighting, locked film-grade token, native dialogue/SFX, a labeled **negative prompt** + locked **seed** per scene, and a header telling you exactly where to upload reference images for YOUR tool). Built-in example — **"The Last Courier"** cinematic action reel (full character sheet + scene plan + generated prompt pack).

> "Make a cinematic action reel with scenes and video prompts — same character in every scene, IMAX look, great color grading. I generate in Kling."
> → character sheet → scene script → prompt pack (self-verified) → paste into your tool → audit → deliver

### Episodic story series (`serial-story-reels`)

The **serialized sibling of veo-cinematic-reels** — multi-episode story video series (comic, love story, action, thriller, fantasy — or the user's own character photos) where the SAME characters stay consistent ACROSS every episode:

```bash
cd skills/serial-story-reels
node scripts/series-arc.mjs --plan series-plan.json --bible story-bible.md   # validates the arc + writes the story bible
node scripts/episode-prompts.mjs --plan series-plan.json --out prompts.md --vo voiceover.md   # builds + self-verifies the prompt pack + VO sheet
```

Deliverables: `story-bible.md` (season arc, per-episode hooks + cliffhangers, locked grade/world/cinematic tokens, cast blocks) → `character-sheet.md` (verbatim character blocks + 2–3 reference-image prompts per character → upload to Flow's Ingredients ONCE, reuse for the whole series) → `prompts.md` (ONE cinematic Veo 3.1 prompt per scene, grouped by episode, every prompt carrying the verbatim character blocks + grade + cinematic tokens, **self-verified word-by-word**, first/last-frame bridging 🔗 across scenes AND episodes) → `voiceover.md` (every line per episode with delivery direction — native Veo audio or a Kokoro post pass). Built-in example: **"Neon Hearts"** — a 3-episode comic love-story action series (2 characters, 12 scenes, full pack in `examples/neon-hearts/`).

> "Make me an episodic comic love story — 3 episodes, same 2 characters in every episode, cinematic action and proper voiceover, Google Flow prompts."
> → interview (≤3 questions) → story bible (arc validated) → character sheets → episode prompt pack (self-verified) → voiceover sheet → **audit harness** → paste into Flow → deliver

**The audit harness ("is it good to go?" before you generate):** after the pack is built, run the automated check then spawn a fresh auditor:

```bash
cd skills/serial-story-reels
node scripts/audit-series.mjs --pack examples/neon-hearts --out series-audit.md   # automated: arc re-validation, per-scene token consistency, verify/bridge counts, voiceover coverage, cinematic language, sheet + bible
# then spawn a fresh series-auditor subagent (see SKILL.md Stage 7 / templates/series-auditor-brief.md)
# → completes the consistency-worthiness scorecard (/50, ≥35 = good to go) → signs PASS or FIX NEEDED
```

### AI photoshoots (`photoshoot-studio`)

**Copy-paste image prompts for person AND product photoshoots** — Google Flow / Nano Banana Pro, Midjourney, Flux — engineered so the **same person or the same product never changes** between shots (reference-image ingredients uploaded once + a verbatim subject block in EVERY prompt, self-verified word-by-word):

```bash
cd skills/photoshoot-studio
node scripts/shot-prompts.mjs --plan shoot-plan.json --out prompts.md   # builds + verifies the prompt pack
```

Deliverables: `subject-sheet.md` (verbatim person OR product block + 2–3 reference-image prompts) → `shot-list.md` (hero → detail → lifestyle → closing) → `prompts.md` (professional photography language — camera body, lens, f-stop, lighting setup, film stock; locked grade token; per-platform aspect ratios; localized `Edit:` prompts for re-posing / re-outfitting / re-lighting). Built-in examples — **"Ava — Founder Editorial Shoot"** (person, warm Kodak Portra grade) and **"Brew & Co Tumbler — E-commerce Shoot"** (product, high-key commercial grade).

> "Give me AI photoshoot prompts — same person in every shot, different outfits and backgrounds, editorial look. Also a product photoshoot for my tumbler store."
> → subject sheet → shot list → prompt pack (self-verified) → paste into Flow / Midjourney → audit → deliver

### Paid ad campaigns (`paid-ads-studio`)

The **paid engine** for Meta + Google — a launch-ready campaign pack from one brief, with a **forecast of expected results before a dollar is spent**. Every "I want to create ads for X" prompt starts with the **Ads Wizard — exactly 3 questions** (1. platform: Meta / Google / Both · 2. goal: Sales / Leads / Traffic · 3. budget + AOV, with defaults if skipped) before anything is built:

```bash
cd skills/paid-ads-studio
node scripts/forecast-ads.mjs --platform meta --objective sales --daily-budget 50 --aov 40 --niche ecommerce --days 30 --margin 40   # → forecast.md (conservative/base/aggressive)
node scripts/ad-prompts.mjs --plan ads-plan.json --out prompts.md        # Veo 3.1 video + image ad prompts, self-verified
node scripts/ad-copy.mjs --brief copy-brief.json --out copy.md          # hook-first copy, char limits + anti-fluff enforced
```

Deliverables: `campaign-brief.md` → `forecast.md` (shown BEFORE creatives — if the economics don't clear, adjust the brief) → `prompts.md` (copy-paste Veo 3.1 video ads + Nano Banana Pro / Midjourney / Flux image ads, verbatim product block in every prompt) → `copy.md` (Meta ≤125/≤40/≤30, Google ≤30/≤90, no fluff) → `campaign-blueprint.md` (Meta ODAX + Advantage+ audiences · Google Demand Gen + PMax + Search) → `cost-plan.md` (ramp, learning phase, kill/scale rules) → `guidelines-checklist.md` (2026 AI-content compliance) → `launch-checklist.md` (manual copy-paste launch order) → **`ad-audit.md`** (the audit harness output). Built-in example: **"Brew & Co Tumbler — Paid Launch"** (full pack in `examples/brew-co-launch/`).

**The audit harness ("is it worthy?" before you spend):** after the pack is built, run the automated check then spawn a fresh auditor:

```bash
cd skills/paid-ads-studio
node scripts/audit-ads.mjs --pack examples/brew-co-launch --out ad-audit.md   # automated: hooks, char limits, fluff, consistency, forecast, compliance
# then spawn a fresh ads-auditor subagent (see SKILL.md Stage 8 / templates/ads-auditor-brief.md)
# → completes the hook-worthiness scorecard (/50, ≥35 = worth running) → signs PASS or FIX NEEDED
```

> "I want to create ads for my tumbler store" → Ads Wizard (3 questions: platform → goal → budget/AOV) → `campaign-brief.md` → forecast → approve → creative pack (self-verified) → copy → blueprint + cost plan → `audit-ads.mjs` → ads-auditor subagent (hook-worthiness scorecard, PASS/FIX NEEDED) → deliver

### Vibe-code web apps (`vibe-code-webapp`)

Build **or extend** production-ready vibe-coded web apps at **20-year-expert depth** — "I want to build something like X with Next.js" **or** "add subscriptions to my existing app" — on any CLI **or** web builder (Lovable, Bolt, v0):

0. **Onboard** — a **detailed idea interview** (`templates/idea-interview.md`) extracts the idea, users, scope, stack, business, timeline, success metrics — and design + AI intent (section 9) — (each question: answer or "skip — you decide"). In **existing projects**, a structure scan runs first — `node scripts/scan-project.mjs --dir . --name app` → `project-scan.md` (stack, routes, data/auth/payments, gaps) — so the plan **extends** what's already there. `MEMORY.md` is initialized as the daily shared memory
1. **Expert research** — `node scripts/research-idea.mjs --niche "saas for freelancers" --subreddits "freelance,Entrepreneur" --geo US` → `idea-brief.md` (Reddit pain + Google Trends, no API key), then the **deep layer** from `templates/research-playbook.md`: competitor teardown, **TAM/SAM/SOM**, channels, pricing anchors, and a one-line **positioning statement**
2. **SaaS validator** — scored on the /35 scorecard **with evidence**, verdict computed by `node scripts/saas-score.mjs --scores <7 numbers>` → **BUILD / ITERATE / PIVOT**, then kill-criteria check + unit economics + kill guardrail + ≥1 validation move → `validation.md`. Any kill criterion → stop and talk
3. **Build Pack + TODO** — `PRD.md` + `stack-blueprint.md` (locked **design source of truth** — Figma via the **Figma Developer MCP**, **Google Stitch** `DESIGN.md`, or the open-source pack (`templates/frontend-design.md`) — + **backend architecture** + **AI-feature rails** when the PRD has AI (`templates/ai-logic.md`) + paste-ready data model + numbered build order + **handoff prompts**) + **`sitemap.md`** (the whole app on one page: full **sitemap** with every route, every **frontend page** block, the **backend architecture** and all **workflows**) + **`TODO.md`** — the build order as P0/P1/P2 tasks managed by `node scripts/todo.mjs add|priority|done|list|confirm` → **your approval** — nothing is coded before you approve the pack AND the todo list, and you can add/re-prioritize tasks anytime
4. **Build anywhere, step by step** — copy `templates/vibe-coder-instructions.md` → `BUILD.md` (the vibe coder's operating manual: flowchart + golden loop — pick highest-priority task → implement → run → verify **design parity per screen** → `done` → commit → report). Works in any CLI (runnable at every step, one task at a time, `done` only when verified) or pasted into **Lovable / Bolt / v0** via the handoff prompt. Every session files a **detailed `build-report.md`** (what/where/evidence)
5. **Audit** — `node scripts/audit-webapp.mjs --dir . --name app --payments --ai` on whatever the builder produced (`--payments` if monetized, `--ai` if AI features) → auditor subagent signs **PASS**
6. **Final review — the everything-auditor** — a subagent analyzes **the app, the plan, the instructions, the memory and the reports** (including design parity + AI rails); then a fix loop applies **hardening** fixes, adds **test-harness** gaps, **brainstorms** next angles into `NEXT.md`, and feeds **skill improvements** back (with your approval) → signs off **PASS** → deliver

**Daily memory (always-on, separate from the stages)** — the AI reads `MEMORY.md` at session start and appends a `Did / Decided / Blocked / Next` entry at the end; you can add notes anytime, and any tool picks up exactly where the last session left off

Ships `templates/prompts.md` (copy-paste + handoff prompts), `templates/idea-interview.md`, `templates/research-playbook.md`, `templates/saas-validator.md` (→ `validation.md` via `scripts/saas-score.mjs`), `templates/frontend-design.md` (Figma MCP + Google Stitch + design QA), `templates/ai-logic.md` (AI-feature rails), `templates/design-system.md`, `templates/backend-architecture.md`, `templates/sitemap-pages.md` (→ `sitemap.md` — full sitemap + pages + backend architecture + workflows), `templates/stack-blueprint-template.md`, `templates/prd-template.md`, `templates/todo.md`, `templates/memory.md`, `templates/vibe-coder-instructions.md` (BUILD.md manual), `templates/build-report.md`, and `templates/production-checklist.md`.

> "Add a subscription tier to my existing app. Remember where we left off."
> → scan → interview → research → evaluate → pack + TODO → approve → build (CLI / Lovable / Bolt) → audit → deliver + memory

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
| `render-carousel.mjs` | Carousel-post renderer (`carousel-post-images`) — **two modes on one deck**: browser mode renders `.slide` elements → per-slide PNGs via headless Chrome (`--4k` = 4320×5400 / 4320×4320); `--mode model` exports the deck as per-slide native image-model prompts (`prompts.md`) |

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
