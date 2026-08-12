---
name: carousel-post-images
description: Create scroll-stopping carousel posts (LinkedIn + Instagram) as image sets. ONE script, TWO CLI modes — Mode 1 browser render (slides.html → headless Chrome → pixel-perfect 4K PNGs on any agent) or Mode 2 native image-model generation (the same deck exports 4K photoreal prompts for Antigravity CLI / Codex image_gen / Grok /imagine). Photorealistic real-life scenario visuals, viral anti-fluff copywriting (hook formulas + a fluff blocklist), four trending design styles (Cinematic Real-Life default), per-platform caption pack, and an auditor stage.
---

<!-- ════════════════════════════════════════════════════════════════════════
     🎬 deepak-skill — crafted by Deepak · skill: carousel-post-images
     https://github.com/Deepak-ai-93/deepak-skill · MIT license
     ════════════════════════════════════════════════════════════════════════ -->

```
   ██████╗ ███████╗███████╗██████╗  █████╗ ██╗  ██╗
   ██╔══██╗██╔════╝██╔════╝██╔══██╗██╔══██╗██║ ██╔╝
   ██║  ██║█████╗  █████╗  ██████╔╝███████║█████╔╝
   ██║  ██║██╔══╝  ██╔══╝  ██╔══██╗██╔══██║██╔═██╗
   ██████╔╝███████╗███████╗██║  ██║██║  ██║██║  ██╗
   ╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝
```

**🎬 deepak-skill — crafted by Deepak** · skill: `carousel-post-images` · [deepak-skill on GitHub](https://github.com/Deepak-ai-93/deepak-skill) · MIT

# skill: carousel-post-images

**Name:** Carousel Post Images (LinkedIn / Instagram) — two-mode generation
**Description:** Turns a topic into a **cohesive 8–10 slide carousel** (images + `caption.md`). The agent writes ONE deck (`slides.html`) — the single source of truth — then generates it in **either of two modes**:
- **Mode 1 — Browser render:** `render-carousel.mjs --4k` → pixel-perfect **4K PNGs** via headless Chrome. Works on **every** CLI, text is always exact.
- **Mode 2 — Image-model generation:** `render-carousel.mjs --mode model` → exports **per-slide 4K image-gen prompts** (`prompts.md`) that the CLI's native image model (Antigravity / Codex `image_gen` / Grok `/imagine`) turns into **photorealistic real-life scenes**.

Either way the quality bar is identical: **4K** (≥ 4000px long edge), **real-life scenario visuals**, and **viral-grade anti-fluff copy**.

---

## The quality bar (non-negotiable — read before anything else)

Every carousel must clear all three rails. If a slide fails any of them, regenerate it.

| Rail | Rule |
|---|---|
| **4K resolution** | Generate/render at **≥ 4000px on the long edge** (4:5 → `4320×5400`, 1:1 → `4096×4096`). Never deliver below that. Posting size stays 1080px; 4K source survives re-encoding. |
| **Real-life visuals** | Every slide shows **one real scenario from the target's actual life** — photorealistic, specific, emotionally true. A person, a place, a moment, a prop. No abstract gradients, no floating 3D shapes as the main visual, no stock-photo clichés (no gold bars, no hand-on-chin thinking, no shaking hands). The scene IS the visual; the text rides on top. |
| **Copy that hits** | Every headline follows the anti-fluff contract (§ Copywriting): specific beats generic, numbers beat adjectives, ≤ 8 words, one idea, an open loop on the cover and a payoff per slide. If the copy reads like it could describe any brand, it's fluff — rewrite it. |
| **Audited before delivery (the harness)** | Stage 6 is a harness, never a self-check: `audit-carousel.mjs` runs the automated checks (deck, copy limits, fluff, output, captions) → a FRESH carousel-auditor subagent scores carousel-worthiness (/50, ≥ 35 = worth posting) → fix loop until signed **PASS** in `carousel-audit.md`. |

---

## Two modes — pick ONE before generating (always present the choice)

The skill has **two generation modes behind one command**. Same deck (`slides.html`), two outputs:

| | **Mode 1 — Browser render** (`--mode browser`, default) | **Mode 2 — Image-model generation** (`--mode model`) |
|---|---|---|
| Command | `render-carousel.mjs --html slides.html --out carousel/ --4k` | `render-carousel.mjs --html slides.html --out carousel/ --mode model` → then dispatch `prompts.md` to the image tool |
| Output | Pixel-perfect **4K PNGs** (`slide_01.png …`) | Per-slide **4K image-gen prompts** → photoreal 4K images |
| Text | Always exact (deterministic render) | Excellent, but **must be visually verified** (LLM models garble text) |
| Visuals | Text-first deck; `.photo`/`.scene-tag` slots mark where a scene goes | **Photorealistic real-life scenes** — maximum visual impact |
| Requires | Chrome + Node + Playwright (any CLI) | The CLI's native image tool (Antigravity / Codex `image_gen` / Grok `/imagine`) |
| Best when | No image tool, or a garbled slide needs a pixel-perfect replacement | The user wants real-life photo scenes and the image tool exists |

**Decision rule — the agent must surface the choice, not silently pick:**
1. At Stage 1, tell the user: *"Carousel in **browser mode** (pixel-perfect text, works anywhere) or **image-model mode** (photoreal scenes, uses the image tool)?"*
2. No image tool on this CLI → Mode 1, no question asked.
3. Image tool available and the user wants real-life photo scenes → Mode 2.
4. User undecided → recommend **Mode 2** when the tool exists (matches the real-life visual rail), otherwise Mode 1.
5. **Hybrid path:** generate in Mode 2; any slide whose text comes out garbled is regenerated in Mode 1 (browser) and swapped in. The deck HTML is shared by both modes, so this is cheap.

---

## When to use

- "Make a LinkedIn carousel about X" / "carousel post for Instagram"
- "Day in the life of…", "5 mistakes…", "How I…" — any save-bait / storytelling deck
- Building brand, dev, finance, or personal-brand content as image posts

**Examples built-in:** `examples/day-in-the-life-dev/` — "Day in the life of an AI developer" (8 slides, Dark Terminal, **browser-mode** deck + caption pack). `examples/real-life-money/` — "3 money rules nobody told you" (8 slides, **Style D Cinematic Real-Life, image-model mode**: hand-written per-slide 4K prompts + fallback deck + caption pack). Copy the pattern: scene → overlay text → mode → 4K.

---

## CLI matrix — how each CLI runs Mode 2 (image-model)

| CLI | Image model | How the agent dispatches Mode 2 prompts |
|---|---|---|
| **Antigravity CLI** (`agy`) | Google native pipeline (Nano Banana Pro / Imagen) | Natural language — ask the agent to create the slide images with its artifact/image tools at max resolution from `prompts.md`, upscaled to 4K, written to `carousel/slide_01.png …` |
| **OpenAI Codex** | `gpt-image-2` via headless `image_gen` tool | Instruct the agent to dispatch its image tool per prompt block (exact 4K prompt + style), saving to explicit paths |
| **Grok Build** (`grok`) | Grok Imagine (`/imagine`) | Instruct the agent to run `/imagine "<prompt block>"` per slide (or trigger its built-in agent image loop), collecting outputs into one folder |

> **Cross-CLI rule:** Mode 1 (browser render) works identically on every CLI — it's the universal fallback and the fix for garbled text. Mode 2 requires the image tool; detect the environment and route accordingly.

---

## The 4 design styles (pick ONE per carousel)

Style D is the default — the other three keep their identity as the *text/accents layer*, but per the quality bar the **visual layer is always a photorealistic real-life scene**.

### Style D — Cinematic Real-Life (`cinematic-real-life`) ★ default
*Best for: everything. The viral-native format — real moments + bold type, like the reels that blow up.*

- **Visual layer:** full-bleed photorealistic scene (see § Real-life visuals) — a person mid-moment, real light, real props.
- **Palette:** the scene is the palette (moody, true-to-life); overlay text is white or near-black (whichever contrasts), one **accent color** per deck (e.g. amber `#ffb703`).
- **Type:** heavy condensed sans (Archivo Black / Inter 900), uppercase, tight; small mono label for the timestamp/rule number.
- **Signature:** full-bleed photo + bottom **scrim gradient** (dark, lower 45%) + one bold line of text in the scrim + small mono label. Film grain optional.
- **Retention device:** "that's me" recognition — the viewer sees their own life, so they save it.

### Style A — Dark Terminal / Code (`dark-terminal`)
*Best for: dev, AI, tech, engineering, SaaS.*
- **Palette:** bg `#0d1117` · text `#e6edf3` · accent green `#3fb950` · secondary blue `#58a6ff`.
- **Type:** heavy sans headlines (Inter/Segoe UI, 800) + monospace for labels/code.
- **Signature:** terminal chrome (traffic-light dots + title bar), timestamps, code blocks, blinking cursor. **Visual layer:** a real dev-life scene — hands on a mechanical keyboard at 7am, terminal glow on a face, coffee ring on the desk, rain on the office window. No pure text-only slides.
- **Retention device:** the time-stamped diary = "inside the mind of" curiosity.

### Style B — Editorial Card Stack (`editorial-cards`)
*Best for: LinkedIn save-bait, finance, consulting, personal brand.*
- **Palette:** bg `#fbf9f5` cream · text `#1a1a1a` · accent `#c8a24b`.
- **Type:** serif headline (Playfair/Georgia) + sans body (Inter) + big mono numerals.
- **Signature:** one giant number per card, thin hairlines, generous whitespace, "receipt" footer. **Visual layer:** real moments rendered in a warm editorial photo grade — receipts on a wooden table, a notebook mid-entry, a real desk at dusk. The number badge sits over the scene.
- **Retention device:** numbered open loop ("#4 is the one everyone gets wrong") — forces the swipe.

### Style C — Neon Gradient 3D (`neon-gradient`)
*Best for: Instagram aesthetic, brands, bold hot takes.*
- **Palette:** deep violet `#1b1035` → pink `#ff2d78` → orange `#ff9f43`; white + `#a78bfa` accents.
- **Type:** heavy condensed sans, tight letter-spacing, uppercase.
- **Signature:** neon glow + gradient band. **Visual layer:** real-life scenes shot *through* the neon aesthetic — a city street at night with neon signs, a phone glowing in a dark room, late-night gym lighting. Keep the photo recognizable as a real place.
- **Retention device:** loud recognizable brand block; short punchy statements.

---

## Copywriting — the anti-fluff contract

> Copy in a carousel is the product. If a headline could appear on any brand's ad, it's fluff. Rewrite until it can only belong to this deck.

### The fluff blocklist (never write these — in headlines, subs, or prompts)
`unlock` · `game-changer` · `elevate` · `supercharge` · `level up` · `unleash` · `boost` · `empower` · `revolutionize` · `optimize` · `leverage` · `journey` · `transform your` · `in today's fast-paced world` · `it's not just X, it's Y` · `skyrocket` · `crush it` · `secrets to` (unless a literal secret). If the audit finds any, the slide is regenerated.

### The 8 copy rules
1. **Specific beats generic.** "Save $1,820 a year" beats "save money"; "47 unread messages" beats "a lot of work".
2. **Numbers and receipts.** A concrete stat, amount, or count in as many slides as possible.
3. **Verbs over adjectives.** "Cut it" beats "dramatically reduce"; describe the action, not the vibe.
4. **One idea per slide.** Headline ≤ **8 words** (≤ 6 is stronger); sub ≤ 20 words. Doesn't fit → split the slide.
5. **Open a loop on the cover** ("rule #3 is the one that hurts") and **pay it off inside the deck** — never leave the cover's promise unpaid.
6. **Twist or payoff per slide.** Every slide either reveals, contradicts, or escalates. If a slide just restates its headline, cut it.
7. **Write like the viewer talks.** Use their words (from the niche, subreddits, comments). No corporate voice, no semicolon-heavy sentences.
8. **End with one command.** Last slide = value recap + a single CTA ("Save this" / "Follow for part 2" / "Comment your #").

### Viral hook formulas (pick one for the cover)
| Formula | Pattern | Example |
|---|---|---|
| Curiosity gap | State the outcome, hide the how | "3 money rules nobody told you" |
| Contrarian | Attack a widely-believed idea | "Deploy on Friday? Watch this." |
| Pattern interrupt | Break the scroll with a shock/stat | "Your inbox is the real boss." |
| Validation | Name the viewer's exact pain | "It's 5pm and you said 'one quick deploy'." |
| Results-first | Lead with the win, then the how | "How I went 0 → 10k followers" |
| Listicle with a twist | Number it, tease the outlier | "5 mistakes — #4 is the one everyone makes" |

---

## Real-life visuals — the scene rules

1. **One moment per slide.** A person doing something specific, in a specific place, at a specific time of day. ("Hands on a mechanical keyboard, 7:07am, one lamp on, terminal glow on the face.")
2. **Emotionally true, not perfect.** Real desks, real mess, real light. Imperfection is what reads as real.
3. **Props carry the story.** Coffee cups, receipts, phone screens, headphones, rain on glass — the prop is the proof of the moment.
4. **No clichés.** No gold bars, no hand-on-chin thinking pose, no cheesy handshakes, no "$" raining from the sky.
5. **Text sits on top.** Photo full-bleed → bottom scrim → bold overlay text. Never put text on a busy part of the photo; the scrim guarantees contrast.
6. **Same world every slide.** Same location/character consistency across the deck (same desk, same person, same light grade) — the deck is one day in one life, not eight unrelated photos.

---

## 4K spec (applies to both modes)

| Platform | Aspect | Generation size (4K) | Posting size |
|---|---|---|---|
| LinkedIn | 1:1 | `4096×4096` (or 3840×3840 min) | 1080×1080 |
| Instagram | 4:5 | `4320×5400` (or model max + upscale) | 1080×1350 |

- Mode 1 (browser): `node scripts/render-carousel.mjs --html slides.html --out carousel/ --4k` → deviceScaleFactor 4 = exactly `4320×5400` / `4320×4320`. Verify the log line says the 4K size.
- Mode 2 (image-model): the exported prompts carry `Canvas: 4K 4320x5400`. Ask the image tool for the **highest native resolution**, then **upscale to ≥ 4000px long edge** if it capped lower. Ask for PNG (never lossy JPEG at 4K).
- Deliver both: `carousel/slide_XX.png` at 4K (source) — and note the 1080px posting size in `caption.md`.

---

## Workflow (6 stages)

### Stage 1 — Analyze the prompt + CHOOSE THE MODE
Extract: **topic** (if vague, ask ≤3 questions), **audience**, **platform** (LinkedIn → square, Instagram → 4:5), **tone** (funny/authoritative/emotional), **style** (default: Cinematic Real-Life; dev/tech → A, business → B, aesthetic → C — in every case the visual layer is real-life per the quality bar).
Then **present the two-mode choice** (§ Two modes): browser render vs image-model generation — recommend Mode 2 if the image tool exists, else Mode 1. Lock the mode; it drives Stage 4.

### Stage 2 — Plan the carousel (the slide map)
Write the deck plan: **cover (hook) → 6–8 content beats → CTA**. For each slide record: `# / headline (≤8 words, anti-fluff) / sub (≤20 words) / SCENE (the exact real-life moment) / prop / layout variant`. The scene is planned *before* the prompt — it's half the content.

> Content rules: one idea per slide; open a loop on the cover; resolve + CTA on the last; diary/step formats ("day in the life", "5 steps") convert best. If any headline contains a blocklisted word, rewrite it now.

### Stage 3 — Lock ONE style + write the deck (`slides.html`)
Pick exactly one of the 4 styles. Then write `slides.html` — **the single source of truth for BOTH modes**: one `.slide` div per slide (`data-name` optional), a `.headline` / `.sub` / `.label` / `.cta` element per slide, plus a `.photo` band with a `.scene-tag` annotation describing the real-life moment (Mode 2 reads it as the SCENE; Mode 1 renders it as the placeholder). Legacy decks without `.scene-tag` still export fine — `--mode model` falls back to a `{describe the real-life moment}` placeholder.

### Stage 4 — Generate in the chosen mode
**Mode 2 — Image-model generation (photoreal 4K):**
1. `node scripts/render-carousel.mjs --html slides.html --out carousel/ --mode model` → writes `carousel/prompts.md` (per-slide blocks with the deck's exact copy + scene tags + 4K canvas + consistency tokens).
2. Polish the SCENE lines if the tags are terse, then **dispatch one block per slide** to the CLI's image tool (see CLI matrix) at max resolution; upscale to 4K; save to `carousel/slide_01.png …`.
3. ⚠️ **Visually verify every word** on every slide — LLM models garble on-image text. Any wrong character → regenerate that slide or swap it for the Mode 1 render.

**Mode 1 — Browser render (pixel-perfect 4K):**
1. `node scripts/render-carousel.mjs --html slides.html --out carousel/ --4k` → `4320×5400` PNGs, text never garbled.
2. The `.scene-tag` photo slots render as storyboard annotations — for a photo-real deck, fill them by compositing Mode 2 images (hybrid path).

> Both modes share the deck, so switching is free: write the HTML once, run `--mode model` *or* `--4k` (or both).

### Stage 5 — Caption pack → `caption.md`
Write `caption.md` next to the images: one section per platform (**LinkedIn, Instagram, X, Threads, Facebook**), each **500–900 chars (aim ~700)**, **no hashtags**, **hook-first**, **one CTA** ("Save this", "Follow for part 2", "Comment your #"), and a "swipe" cue. Include a slide-recap table (headline + scene) so the post and images never drift apart. (Same rules as `generate-caption.mjs` in this repo.)

### Stage 6 — Audit harness (automated checks + carousel-auditor subagent, before delivery)
**Step 6a — run the automated audit harness:**
```bash
node scripts/audit-carousel.mjs --pack <carousel-folder> --out carousel-audit.md
```
`audit-carousel.mjs` scans the pack and checks everything a script can: slides.html (slide count 8–10, headline ≤ 8 words, sub ≤ 20, fluff blocklist, scene tags, cover-loop/CTA), the carousel/ output (Mode 1 PNGs or Mode 2 prompts.md with 4K canvas + per-slide blocks), and caption.md (sections, zero hashtags, CTA, 500–900 char markers, slide recap). Writes `carousel-audit.md` (automated verdicts + scorecard scaffold). **Exit 1 on any FAIL.**

**Step 6b — spawn the carousel-auditor subagent** — a FRESH subagent (never self-audit) with the exact brief from `templates/carousel-auditor-brief.md`: reads `carousel-audit.md` + all pack files + the actual images, completes the **carousel-worthiness scorecard** (10 criteria, /50 — **≥ 35 = worth posting**, with verdict bands), makes the creative judgment calls the script can't (on-image text accuracy, scene authenticity, 4K visual check, contrast), and signs **PASS / FIX NEEDED** with per-slide fixes.

**Step 6c — fix loop.** Any FAIL (or an auditor-flagged WARN) → fix the deck → re-run `audit-carousel.mjs` (re-render with `render-carousel.mjs` if the HTML changed) → re-submit to a fresh auditor. **Nothing is delivered until the auditor signs off PASS.** The `carousel-audit.md` ships with the pack.

---

## Production checklist

- [ ] Mode chosen and **presented to the user** (browser render vs image-model generation) before generating
- [ ] Quality bar held: 4K (≥ 4000px long edge), real-life scenario visuals, anti-fluff copy
- [ ] Prompt analyzed; platform chosen (4:5 vs 1:1) and kept for the whole deck
- [ ] Slide map: cover hook → 6–8 beats → CTA; headline ≤ 8 words, sub ≤ 20; every headline cleared against the fluff blocklist
- [ ] ONE style locked; palette + type + scrim + accent identical across every slide
- [ ] `slides.html` written as the single source of truth (scene tags + exact copy per slide)
- [ ] Mode 1: rendered with `render-carousel.mjs --4k` → `carousel/slide_01.png …` (4320×5400 / 4320×4320) **or** Mode 2: `--mode model` → prompts dispatched to the image tool at 4K
- [ ] On-image text visually verified (no garbled characters — regenerate or fall back to the browser render)
- [ ] `caption.md`: 500–900 chars per platform, no hashtags, hook first, one CTA, slide recap incl. scenes
- [ ] **Audit harness run:** `audit-carousel.mjs` → automated checks (deck, copy limits, fluff, output, captions) — exit 0
- [ ] **Carousel-auditor subagent** (fresh eyes) completed the carousel-worthiness scorecard (/50 ≥ 35) and signed **PASS / FIX NEEDED** in `carousel-audit.md`
- [ ] Deliverables: `carousel/*.png` (4K) + `caption.md` + `carousel-audit.md`
