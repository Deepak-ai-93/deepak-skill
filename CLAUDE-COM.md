# Using deepak-skill on Claude.com (browser) — step-by-step

```
   ██████╗ ███████╗███████╗██████╗  █████╗ ██╗  ██╗
   ██╔══██╗██╔════╝██╔════╝██╔══██╗██╔══██╗██║ ██╔╝
   ██║  ██║█████╗  █████╗  ██████╔╝███████║█████╔╝
   ██║  ██║██╔══╝  ██╔══╝  ██╔══██╗██╔══██║██╔═██╗
   ██████╔╝███████╗███████╗██║  ██║██║  ██║██║  ██╗
   ╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝
```

**🎬 deepak-skill — crafted by Deepak** · [deepak-skill on GitHub](https://github.com/Deepak-ai-93/deepak-skill) · MIT

This guide shows you how to use every skill in this repo **in the claude.com website (browser)** — no terminal, no install, no coding. Claude.com web chat can't run scripts or render videos, but it **can** follow the `SKILL.md` instructions for each skill and deliver the planning, copywriting, image-generation and prompt-pack half of the pipeline. That's roughly **60–90% of every skill** depending on which one you pick.

---

## The short version (3 steps)

1. **Copy** the skill's `SKILL.md` (or add it to a Claude Project as a knowledge file — see [Pro tip: use a Project](#pro-tip-use-a-project)).
2. **Paste** it with the activation line: *"Follow this skill exactly. Skill instructions: [paste] "*
3. **Ask** for your deliverable with one of the ready-to-paste prompts below.

---

## Step-by-step

### Step 1 — Open claude.com

Go to **https://claude.com** (or claude.ai) and start a **new chat**. Any model works; Sonnet 4.5+ and Opus handle the long skill instructions best.

### Step 2 — Pick the skill

Every skill ships a `SKILL.md` — the instruction file the agent follows. Pick the one that matches your goal:

| Skill | Best for | What Claude delivers in the browser |
|---|---|---|
| **carousel-post-images** | LinkedIn/Instagram carousels | Slide plan + viral copy + per-slide **4K image prompts** + generated slide images + `caption.md` for 5 platforms ⭐ best web skill |
| **photoshoot-studio** | AI photoshoot prompts (people + products) | Subject sheet + shot list + photo prompts + **generated shots** via Claude's image tool |
| **veo-cinematic-reels** | Cinematic video prompts for any generator | Character sheet + scene script + **self-verified prompt pack** (negative prompt + seed) to paste into Flow/Veo, Kling, Luma, Runway… |
| **serial-story-reels** | Episodic story video series | Story bible + character sheets + per-episode prompt pack + voiceover line sheet |
| **hook-storyboard-retention** | Hooks + storyboards | Scroll-stopping hooks + beat-by-beat storyboard + retention engineering — 100% works |
| **blog-seo-content** | SEO articles | Keyword cluster + outline → E-E-A-T article + meta title/description pack — 100% works |
| **linkedin-personal-brand** | LinkedIn presence | Voice capture + bio rewrite + weekly post calendar + engagement strategy — 100% works |
| **email-marketing** | HTML emails | Subject-line pack + `email.html` + `plain.txt` + spam/compliance review (no preview screenshots) |
| **youtube-video-pipeline** | YouTube videos | Script + 10-variant title pack + thumbnail brief + description/chapters/tags |
| **podcast-to-shorts** | Long-form → shorts | Transcript scoring + per-clip hooks + captions + FFmpeg cut commands (no actual clips) |
| **video-product-pipeline** | Viral video workflow | Trend brainstorm (Claude does the web research manually) + `video-product.md` spec + approval flow |
| **text-motion-reels** | Text-only motion reels | Format choice + beat-by-beat script + captions + render-ready composition code (no MP4) |
| **video-asset-reels** | Reels from your clips | Storyboard + beat plan + cut commands + captions (no cutting) |
| **voice-sfx-audio** | Voiceovers + SFX | Voice/SFX/music recommendations + licensing + mixing commands (no audio files) |
| **paid-ads-studio** | Meta + Google ads | Ads wizard (3 questions) + forecast + Veo/image ad prompts + char-safe copy + campaign blueprint + checklists |
| **vibe-code-webapp** | Web apps | Idea interview + expert research + SaaS validator (`validation.md`) + `PRD.md` + design source (Figma/Stitch) + AI rails + sitemap + TODO + build instructions for Lovable/Bolt/v0 or any CLI |
| **skill-builder** | Scaffold new skills | The complete new-skill file set as copyable markdown (installing it still needs a CLI) |

### Step 3 — Get the SKILL.md contents

Any of these works:

- **A) GitHub (recommended):** open `https://github.com/Deepak-ai-93/deepak-skill`, go to `skills/<skill-name>/SKILL.md`, click **Raw**, copy everything.
- **B) Local clone:** `cat skills/<skill-name>/SKILL.md` and copy the output.
- **C) Claude Project (best for repeat use):** create a **Project** on claude.com → **Project knowledge** → upload the `SKILL.md` file (download it from GitHub first). Every chat inside that Project auto-loads the skill — no pasting ever again. See [Pro tip: use a Project](#pro-tip-use-a-project).

### Step 4 — Activate the skill

Paste with the activation line, then your request:

```
Follow this skill exactly. Skill instructions:

[paste the full SKILL.md contents here]

Request: <your request>
```

Claude reads the `SKILL.md` as its operating manual: quality bar → workflow stages → production checklist. It will ask its ≤3 clarifying questions (or use the defaults the skill defines), produce the deliverables in order, and end with the skill's checklist.

### Step 5 — Send a ready-to-paste request

Use the per-skill templates below — the more specific you are, the better the output (niche + audience + duration + style beats a one-liner).

### Step 6 — Iterate and audit

- The skills are built on **approval gates** — Claude shows you a spec (`video-product.md`, `seo-brief.md`, `campaign-brief.md`, `PRD.md`) and waits. Say **"approve"** or **"edit: …"**.
- Finish with: *"Run the skill's audit checklist and tell me PASS or FIX NEEDED."* — the audit scripts can't run in the browser, but the skill's checklist is written down in the SKILL.md, so Claude can self-check against it.
- Fix loops: anything flagged → ask Claude to fix → re-ask for the checklist.

---

## What works in the browser vs. what needs a terminal

| Capability | In claude.com web chat | In Claude Code / any CLI |
|---|---|---|
| Planning, hooks, storyboards, scripts, copy, captions | ✅ | ✅ |
| SEO/LinkedIn/email creative packs | ✅ | ✅ |
| Video/image **prompt packs** (Veo, photoshoots, carousels) | ✅ | ✅ |
| **Generating images** (carousels, photoshoots, thumbnails, reference images) | ✅ built-in image tool | ✅ native image tool |
| Running the `*.mjs` scripts (scoring, audit, trend research, title packs) | ❌ no terminal | ✅ |
| Rendering 4K MP4s / PNGs (Chrome + FFmpeg) | ❌ | ✅ |
| Saving files into folders | ❌ (use copy-paste / Artifacts) | ✅ |

---

## Ready-to-paste prompt library

### Generic template (any skill)

```
Follow this skill exactly. Skill instructions:

[paste SKILL.md]

Request: <goal>
Niche/topic: …
Audience: …
Platform: …
Style/format: …
Duration: …
Extra constraints: …
Deliverables: list what you want at the end (e.g. "a caption.md pack for 5 platforms")
```

### Carousels (⭐ the best web-mode skill — Claude can generate the images)

```
Follow this skill exactly. Skill instructions:

[paste skills/carousel-post-images/SKILL.md]

Request: Make a carousel: "3 money rules nobody told you."
Platform: LinkedIn + Instagram
Style: Cinematic Real-Life (photoreal real-life scenes)
Mode: image-model — generate the slides with your image tool
Deliverables:
1. Slide map with a real-life SCENE per slide
2. Headline/sub copy per slide (≤8 words, no fluff words like "unlock" or "game-changer")
3. One 4K image prompt per slide (4320×5400)
4. Generate each slide image
5. caption.md pack: LinkedIn, Instagram, X, Threads, Facebook — 500–900 chars each, no hashtags, one CTA
```

### AI photoshoots (generate the shots too)

```
Follow this skill exactly. Skill instructions:

[paste skills/photoshoot-studio/SKILL.md]

Request: An editorial photoshoot of the same person in 6 shots —
different outfits and backgrounds, same face. Editorial look, Kodak Portra grade.
1. Subject sheet with the verbatim person block + 2–3 reference-image prompts
2. Shot list (hero → detail → lifestyle → closing)
3. One photo prompt per shot (same person block in EVERY prompt, self-verified)
4. Generate the reference image, then each shot with your image tool
5. A short Edit prompt per shot (re-pose / re-outfit / re-light)
```

### Veo / cinematic video prompts (paste the pack into Flow/Kling)

```
Follow this skill exactly. Skill instructions:

[paste skills/veo-cinematic-reels/SKILL.md]

Request: A cinematic action reel — same character in every scene, IMAX look,
locked color grade, native dialogue. I generate in Kling.
1. Character sheet (verbatim character block + reference-image prompts)
2. Scene script (hook → agitate → payoff → CTA)
3. One ~200-word copy-paste prompt per scene with the verbatim character block,
   a labeled negative prompt and a locked seed — self-verified word-by-word
4. Where exactly to upload the reference images in Kling
```

### Email campaign

```
Follow this skill exactly. Skill instructions:

[paste skills/email-marketing/SKILL.md]

Request: A product-launch email for our SaaS. Audience: existing customers.
Goal: demo clicks. Spam-free, high-CTR subject lines, strong E-E-A-T.
1. Subject-line pack (3–5 variants, winner marked, A/B plan)
2. Bulletproof responsive email.html (tables + inline CSS, dark-mode aware, compliance footer)
3. plain.txt fallback
4. Run the skill's validation checklist manually (spam triggers, CAN-SPAM, text:image ratio)
   and report PASS / FIX NEEDED
```

### Podcast → shorts (scoring done by hand by Claude)

```
Follow this skill exactly. Skill instructions:

[paste skills/podcast-to-shorts/SKILL.md]

Request: Here is the transcript: [paste]. Turn it into 5 shorts.
1. Score every moment on the virality scorecard (hook/emotion/controversy/quotability/standalone)
2. Pick the 5 best, each with a 2-second hook + caption (no hashtags, one CTA)
3. Give the exact FFmpeg cut commands (9:16, timestamps)
4. Audit checklist PASS / FIX NEEDED
```

### YouTube / SEO / LinkedIn (100% works)

```
Follow this skill exactly. Skill instructions:

[paste skills/youtube-video-pipeline/SKILL.md]   # or blog-seo-content / linkedin-personal-brand

Request: Plan a YouTube video: "3 SaaS pricing mistakes founders make" —
script with hook in 30s, 10-variant title pack (≤60 chars, scored),
thumbnail brief + image prompt, description with chapters and tags.
```

### Vibe-code web app (plan here, build anywhere)

```
Follow this skill exactly. Skill instructions:

[paste skills/vibe-code-webapp/SKILL.md]

Request: I want to build a SaaS for freelancers. Run the idea interview first,
then the evaluation scorecard, then PRD.md + sitemap + TODO. I'll build it in Lovable.
```

---

## Hybrid workflow (get real files without a terminal agent)

Let claude.com produce the **creative pack** (copy, prompts, captions, `slides.html`/`email.html` content), copy it out of the chat, then render/validate on your own machine in one command each:

```bash
# carousel → real 4K PNGs
node render/render-carousel.mjs --html slides.html --out carousel/ --4k

# email → spam/compliance validation + preview screenshots
node skills/email-marketing/scripts/validate-email.mjs --html email.html --subject "…"
node skills/email-marketing/scripts/preview-email.mjs --html email.html

# reel composition → 4K MP4
node render/render-frames.mjs --html my-reel.html --name my-reel_4k --duration 15 --fps 30 --scale 2
```

---

## Pro tips

- **Use a Project (recommended):** create a Claude Project, add the `SKILL.md` of your most-used skills as **Project knowledge**, then every chat in the Project starts with the skill loaded. Keep one Project per skill (or per workflow) to avoid instruction collisions.
- **One skill per chat.** Two pasted skills can fight over the workflow. Split into separate chats.
- **Artifacts:** ask Claude to put long deliverables (email HTML, captions, PRDs) into **Artifacts** so they stay editable and don't blow up the context.
- **Images are downloads:** Claude generates images one at a time in chat — right-click → save. For a carousel that's 8 saves; ask for the prompts pack *and* the images so you can regenerate any slide.
- **Keep requests specific.** Niche + audience + duration + style + hook direction produces dramatically better output (the skills' own rule).
- **Paste fresh when context gets long.** After ~10 messages, re-paste the SKILL.md or start a new chat — the skill instructions get diluted by the conversation.
- **Audit at the end.** The skills ship an audit-harness contract; in the browser, close with *"Run the skill's audit checklist and give me PASS or FIX NEEDED with specific fixes."*
- **For full power (rendering, scripts, files):** install into any agentic CLI — Claude Code, Cursor, Codex, Gemini CLI, Freebuff — with `npx skills add Deepak-ai-93/deepak-skill --all`. See [`USAGE.md`](USAGE.md) and [`install.md`](install.md).

---

*deepak-skill 🎬 — MIT license. Free to use, modify, and monetize.*
