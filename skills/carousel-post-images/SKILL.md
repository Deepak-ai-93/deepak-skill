---
name: carousel-post-images
description: Create scroll-stopping carousel posts (LinkedIn + Instagram) as image sets using the CLI's native image generation — Antigravity CLI (agy), OpenAI Codex (image_gen / gpt-image-2), Grok Build (/imagine). Generates at 4K with photorealistic real-life scenario visuals, viral anti-fluff copywriting (hook formulas + a fluff blocklist), four trending design styles (Cinematic Real-Life default), slide-by-slide planning, a per-platform caption pack, and a deterministic HTML→PNG fallback (scripts/render-carousel.mjs, --4k) for any agent.
---

# skill: carousel-post-images

**Name:** Carousel Post Images (LinkedIn / Instagram) — native image-model skill
**Description:** Turns a topic into a **cohesive 8–10 slide carousel** (images + `caption.md`). Optimized for CLI agents with a **built-in image generation model** (Antigravity CLI, OpenAI Codex, Grok Build). Every slide is generated at **4K**, shows a **real-life scenario** (a specific, believable moment — never a floating-text abstract), and carries **viral-grade copy**: punchy, specific, zero fluff. Slides follow one of four design styles and a fixed quality bar, so the deck looks like it came from a design team — not a template dump.

---

## The quality bar (non-negotiable — read before anything else)

Every carousel must clear all three rails. If a slide fails any of them, regenerate it.

| Rail | Rule |
|---|---|
| **4K resolution** | Generate/upscale to **≥ 4000px on the long edge** (native model: 4:5 → `4320×5400`, 1:1 → `4096×4096`, or model max + upscale). Never deliver below that. Posting size stays 1080px; 4K source survives re-encoding. |
| **Real-life visuals** | Every slide shows **one real scenario from the target's actual life** — photorealistic, specific, emotionally true. A person, a place, a moment, a prop. No abstract gradients, no floating 3D shapes as the main visual, no stock-photo clichés (no gold bars, no hand-on-chin thinking, no shaking hands). The scene IS the visual; the text rides on top of it. |
| **Copy that hits** | Every headline follows the anti-fluff contract (§ Copywriting): specific beats generic, numbers beat adjectives, ≤ 8 words, one idea, an open loop on the cover and a payoff per slide. If the copy reads like it could describe any brand, it's fluff — rewrite it. |

---

## When to use

- "Make a LinkedIn carousel about X" / "carousel post for Instagram"
- "Day in the life of…", "5 mistakes…", "How I…" — any save-bait / storytelling deck
- Building brand, dev, finance, or personal-brand content as image posts

**Examples built-in:** `examples/day-in-the-life-dev/` — "Day in the life of an AI developer" (8 slides, Dark Terminal, caption pack). `examples/real-life-money/` — "3 money rules nobody told you" (8 slides, **Style D Cinematic Real-Life**, per-slide 4K native image-gen prompts, fallback deck, caption pack). Copy the pattern: scene → overlay text → 4K prompt.

---

## CLI matrix — how the native image model is invoked

| CLI | Image model | How the agent generates slides |
|---|---|---|
| **Antigravity CLI** (`agy`) | Google native pipeline (Nano Banana Pro / Imagen) | Natural language — ask the agent to create the slide images with its artifact/image tools, at max resolution, and write them to `carousel/slide_01.png …` |
| **OpenAI Codex** | `gpt-image-2` via headless `image_gen` tool | Instruct the agent to dispatch its image tool per slide with the exact 4K prompt + style, saving to explicit paths |
| **Grok Build** (`grok`) | Grok Imagine (`/imagine`) | Instruct the agent to run `/imagine "<slide prompt>"` per slide (or trigger its built-in agent image loop), collecting outputs into one folder |

> **Cross-CLI rule:** the skill must work the same on every CLI. Detect the environment and route to the matching mechanism (artifact tool / `image_gen` / `/imagine`). Where no native model exists, fall back to the **deterministic renderer** (`scripts/render-carousel.mjs --4k` + the slides HTML) — same slides, 4K, pixel-perfect, any agent.

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

## 4K spec (applies to both generation paths)

| Platform | Aspect | Generation size (4K) | Posting size |
|---|---|---|---|
| LinkedIn | 1:1 | `4096×4096` (or 3840×3840 min) | 1080×1080 |
| Instagram | 4:5 | `4320×5400` (or model max + upscale) | 1080×1350 |

- Native model: ask for the **highest native resolution**, then **upscale to ≥ 4000px long edge** with the model's upscale/outpaint tool if it capped lower. Ask the model to export PNG (never lossy JPEG at 4K).
- Deterministic renderer: `node scripts/render-carousel.mjs --html slides.html --out carousel/ --4k` → deviceScaleFactor 4 = exactly `4320×5400` / `4320×4320`. Verify the log line says the 4K size.
- Deliver both: `carousel/slide_XX.png` at 4K (source) — and note the 1080px posting size in `caption.md`.

---

## Workflow (6 stages)

### Stage 1 — Analyze the prompt
Extract: **topic** (if vague, ask ≤3 questions), **audience**, **platform** (LinkedIn → square, Instagram → 4:5), **tone** (funny/authoritative/emotional), **style** (default: Cinematic Real-Life; dev/tech → A, business → B, aesthetic → C — in every case the visual layer is real-life per the quality bar).

### Stage 2 — Plan the carousel (the slide map)
Write the deck plan: **cover (hook) → 6–8 content beats → CTA**. For each slide record: `# / headline (≤8 words, anti-fluff) / sub (≤20 words) / SCENE (the exact real-life moment) / prop / layout variant`. The scene is planned *before* the prompt — it's half the content.

> Content rules: one idea per slide; open a loop on the cover; resolve + CTA on the last; diary/step formats ("day in the life", "5 steps") convert best. If any headline contains a blocklisted word, rewrite it now.

### Stage 3 — Lock ONE style
Pick exactly one of the 4 styles above. Everything downstream uses its palette + type + signature, with a photorealistic real-life scene as the visual layer.

### Stage 4 — Generate the images at 4K
**Path A — native image model (PRIMARY, always try first):** one prompt per slide using the template below; instruct the model to keep the SAME scene-world + style tokens across all slides; request max resolution and upscale to 4K; save to `carousel/slide_01.png …`.

> ⚠️ **Text accuracy (non-negotiable):** LLM image models often garble on-image text. Ask the model to render the text **exactly as given**, then **visually verify every slide** — for a carousel, the text IS the content. Any wrong character → regenerate that slide or fall back to Path B (the deterministic renderer guarantees pixel-perfect text).

**Path B — deterministic renderer (any CLI, 4K):** build `slides.html` (one `.slide` div per slide, `data-name` optional; reserve a `.photo` band per slide for the scene) → `node scripts/render-carousel.mjs --html slides.html --out carousel/ --4k`. Pixel-perfect, reproducible, 4320×5400.

### Native image-model prompt template (Path A — copy per slide)

```
Carousel slide {n}/{total} — style: {cinematic-real-life | dark-terminal | editorial-cards | neon-gradient}.
CANVAS: 4K {4320x5400 | 4096x4096}, PNG, {platform}. No watermark, no logo.

SCENE (photoreal, real life — the visual IS this moment):
  {who is doing what, where, what time of day, what prop is in frame, what emotion shows on their face}
  No clichés (no gold bars / hand-on-chin / abstract gradients). Same world as every other slide.
CINEMATIC GRADE: {camera & lens, lighting source + color, depth of field, film grain, color mood}.
TEXT LAYER — render the text EXACTLY, no typos, no extra words:
  Headline: "{≤8 words, specific, zero fluff}"
  Sub: "{≤20 words}"   (optional)
  Label: "{rule #3 / 07:30 AM / swipe →}" (optional, mono)
  Placement: bottom {45}% over a dark scrim gradient; headline size ≈ {6}% of frame height; color {white}; accent {#ffb703} for the {number/keyword}.
CONSISTENCY (repeat on EVERY slide): same character, same location, same lens + light grade, same font, same scrim, same accent hex.
```

### Stage 5 — Caption pack → `caption.md`
Write `caption.md` next to the images: one section per platform (**LinkedIn, Instagram, X, Threads, Facebook**), each **500–900 chars (aim ~700)**, **no hashtags**, **hook-first**, **one CTA** ("Save this", "Follow for part 2", "Comment your #"), and a "swipe" cue. Include a slide-recap table (headline + scene) so the post and images never drift apart. (Same rules as `generate-caption.mjs` in this repo.)

### Stage 6 — Audit (subagent, before delivery)
Spawn a fresh subagent to check, on every slide:
1. **Text accuracy** — every on-image character is exactly the planned copy (no garbling, no invented words).
2. **Copy punch** — no blocklisted fluff; headline ≤ 8 words; specific > generic; cover loop open; CTA present.
3. **Scene authenticity** — the visual shows the planned real-life moment; consistent world across the deck; no clichés.
4. **Text overflow / contrast** — nothing clipped; text readable at phone size (≥ 4.5:1 on the scrim).
5. **Style consistency** — same palette/type/scrim/accent across all slides.
6. **4K check** — every file's long edge ≥ 4000px (script + image check).
Any FAIL → fix → re-generate/re-render → re-audit.

---

## Production checklist

- [ ] Quality bar held: 4K (≥ 4000px long edge), real-life scenario visuals, anti-fluff copy
- [ ] Prompt analyzed; platform chosen (4:5 vs 1:1) and kept for the whole deck
- [ ] Slide map: cover hook → 6–8 beats → CTA; headline ≤ 8 words, sub ≤ 20; every headline cleared against the fluff blocklist
- [ ] ONE style locked; palette + type + scrim + accent identical across every slide
- [ ] Scene planned per slide (who / where / when / prop / emotion) and written into the image prompt
- [ ] Images generated at 4K with the native model (Antigravity/Codex/Grok) or rendered with `render-carousel.mjs --4k` into `carousel/slide_01.png …`
- [ ] On-image text visually verified (no garbled characters — regenerate or Path B if any)
- [ ] `caption.md`: 500–900 chars per platform, no hashtags, hook first, one CTA, slide recap incl. scenes
- [ ] Auditor subagent signed off: text accuracy, copy punch, scene authenticity, contrast/safe zones, style consistency, 4K size
- [ ] Deliverables: `carousel/*.png` (4K) + `caption.md`
