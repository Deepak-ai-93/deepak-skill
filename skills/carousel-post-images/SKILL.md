---
name: carousel-post-images
description: Create scroll-stopping carousel posts (LinkedIn + Instagram) as image sets using the CLI's native image generation — Antigravity CLI (agy), OpenAI Codex (image_gen / gpt-image-2), Grok Build (/imagine). Three trending design styles, slide-by-slide planning, strict design principles, a per-platform caption pack, and a deterministic HTML→PNG fallback (scripts/render-carousel.mjs) for any agent.
---

# skill: carousel-post-images

**Name:** Carousel Post Images (LinkedIn / Instagram) — native image-model skill
**Description:** Turns a topic into a **cohesive 8–10 slide carousel** (images + `caption.md`). Optimized for CLI agents with a **built-in image generation model** (Antigravity CLI, OpenAI Codex, Grok Build). Every slide follows one of three trending design styles and a fixed set of design principles, so the deck looks like it came from a design team — not a template dump.

---

## When to use

- "Make a LinkedIn carousel about X" / "carousel post for Instagram"
- "Day in the life of…", "5 mistakes…", "How I…" — any save-bait / storytelling deck
- Building brand, dev, finance, or personal-brand content as image posts

**Example built-in:** `examples/day-in-the-life-dev/` — "Day in the life of an AI developer", 8 slides (Dark Terminal style) + `caption.md`.

---

## CLI matrix — how the native image model is invoked

| CLI | Image model | How the agent generates slides |
|---|---|---|
| **Antigravity CLI** (`agy`) | Google native pipeline (Nano Banana Pro / Imagen) | Natural language — ask the agent to create the slide images with its artifact/image tools and write them to `carousel/slide_01.png …` |
| **OpenAI Codex** | `gpt-image-2` via headless `image_gen` tool | Instruct the agent to dispatch its image tool per slide with exact prompt + resolution + style, saving to explicit paths |
| **Grok Build** (`grok`) | Grok Imagine (`/imagine`) | Instruct the agent to run `/imagine "<slide prompt>"` per slide (or trigger its built-in agent image loop), collecting outputs into one folder |

> **Cross-CLI rule:** the skill must work the same on every CLI. The agent should detect which environment it is in and route to the matching mechanism (artifact tool / `image_gen` / `/imagine`). Where no native model exists, fall back to the **deterministic renderer** (`scripts/render-carousel.mjs` + the slides HTML) — same slides, pixel-perfect, any agent.

---

## The 3 trending design styles (pick ONE per carousel)

### Style A — Dark Terminal / Code (`dark-terminal`)
*Best for: dev, AI, tech, engineering, SaaS. The default for dev-life content.*

- **Palette:** bg `#0d1117` (GitHub dark) · text `#e6edf3` · accent green `#3fb950` · secondary blue `#58a6ff`.
- **Type:** heavy sans headlines (Inter/Segoe UI, 800) + monospace (`JetBrains Mono` / Consolas) for code + labels.
- **Signature:** terminal chrome (traffic-light dots + title bar), timestamps (`07:30 AM`), fake code blocks, blinking cursor on the last slide.
- **Retention device:** the time-stamped diary format = "inside the mind of" curiosity.

### Style B — Editorial Card Stack (`editorial-cards`)
*Best for: LinkedIn save-bait, finance, consulting, personal brand.*

- **Palette:** bg `#fbf9f5` cream · text `#1a1a1a` · accent `#c8a24b` (or ink `#1a1a1a` for the number badges).
- **Type:** serif headline (Playfair/Georgia) + sans body (Inter) + big mono numerals.
- **Signature:** one giant number per card, thin hairline dividers, generous whitespace, light "receipt" footer.
- **Retention device:** numbered open loop ("#4 is the one everyone gets wrong") — forces the swipe.

### Style C — Neon Gradient 3D (`neon-gradient`)
*Best for: Instagram aesthetic, brands, bold hot takes.*

- **Palette:** deep violet `#1b1035` → pink `#ff2d78` → orange `#ff9f43` gradients; white + `#a78bfa` accents.
- **Type:** heavy condensed sans (Archivo Black / Impact), tight letter-spacing, uppercase.
- **Signature:** soft 3D blobs/shapes behind text, glow shadows, diagonal contrast band.
- **Retention device:** loud, recognizable brand block; good for short punchy statements.

---

## Design principles (non-negotiable — apply to every slide)

1. **One message per slide.** Headline ≤ **8 words**; sub-line ≤ 20 words. If it doesn't fit, it's two slides.
2. **System consistency:** same grid (80–96 px margins), same 3-color palette, same type scale (1 headline style + 1 sub style + 1 label style) on **every** slide.
3. **Visual variety within the system:** vary time labels, code blocks, badges, layouts — never repeat a slide layout back-to-back.
4. **Hierarchy:** one dominant element per slide (headline), a quiet supporting line, nothing competing.
5. **Contrast:** text ≥ 4.5:1 on the background; readable on a phone at arm's length.
6. **Safe zones:** keep content inside 8–92% margins; no text at the very edge (profile UI can cover it).
7. **Hook on slide 1, CTA on the last.** Slide 1 = curiosity gap. Last slide = value recap + "save / follow".
8. **Aspect:** 4:5 `1080×1350` (Instagram) or 1:1 `1080×1080` (LinkedIn) — pick per platform and keep it for the whole deck.

---

## Workflow (6 stages)

### Stage 1 — Analyze the prompt
Extract: **topic** (if vague, ask ≤3 questions), **audience**, **platform** (LinkedIn → square, Instagram → 4:5), **tone** (funny/authoritative/emotional), **style** (default by niche: dev/tech → A, business → B, aesthetic → C).

### Stage 2 — Plan the carousel (the slide map)
Write the deck plan: **cover (hook) → 6–8 content beats → CTA**. For each slide record: `# / headline (≤8 words) / sub (≤20 words) / visual note / layout variant`.

> Content rules: one idea per slide; open a loop on the cover; resolve + CTA on the last; diary/step formats ("day in the life", "5 steps") convert best.

### Stage 3 — Lock ONE style
Pick exactly one of the 3 styles above. Everything downstream uses its palette + type + signature.

### Stage 4 — Generate the images
**Path A — native image model** (Antigravity / Codex / Grok): one prompt per slide using the template below; instruct the model to keep the SAME style tokens across all slides; save to `carousel/slide_01.png …` with explicit paths.

> ⚠️ **Text accuracy (non-negotiable):** LLM image models often garble on-image text. Ask the model to render the text **exactly as given**, then **visually verify every slide** — for a carousel, the text IS the content. Any wrong character → regenerate that slide or fall back to Path B (the deterministic renderer guarantees pixel-perfect text).

**Path B — deterministic renderer** (any CLI): build `slides.html` (one `.slide` div per slide, `data-name` optional) → `node scripts/render-carousel.mjs --html slides.html --out carousel/`. Pixel-perfect, reproducible.

### Native image-model prompt template (Path A)

```
Carousel slide {n}/{total} — style: {dark-terminal | editorial-cards | neon-gradient}.
Canvas {1080x1350 | 1080x1080}, {platform}.
Palette: {exact hexes}. Typography: {faces} — render all text exactly as given.
Layout: {margins, position}. Content:
- Headline: "{text}"
- Sub: "{text}"
- Visual: {code block / number badge / 3D shape / timestamp — keep it minimal, text must dominate}
Consistency tokens (repeat on EVERY slide): {same bg, same accent, same font, same margin}.
```

### Stage 5 — Caption pack → `caption.md`
Write `caption.md` next to the images: one section per platform (**LinkedIn, Instagram, X, Threads, Facebook**), each **500–900 chars (aim ~700)**, **no hashtags**, **hook-first**, **one CTA** ("Save this", "Follow for part 2", "Comment your #"), and a "swipe" cue. Include a slide-recap table so the post and images never drift apart. (Same rules as `generate-caption.mjs` in this repo.)

### Stage 6 — Audit (subagent, before delivery)
Spawn a fresh subagent to check: text overflow/clipping on every slide, spelling, contrast, style consistency (same palette/type across all 8), safe zones, cover-hook strength, CTA presence. Any FAIL → fix → re-render → re-audit.

---

## Production checklist

- [ ] Prompt analyzed; platform chosen (4:5 vs 1:1) and kept for the whole deck
- [ ] Slide map: cover hook → 6–8 beats → CTA; headline ≤8 words, sub ≤20
- [ ] ONE style locked; palette + type identical across every slide
- [ ] Design principles held: hierarchy, contrast ≥4.5:1, safe zones, variety-within-consistency
- [ ] Images generated (native model on Antigravity/Codex/Grok) or rendered (`render-carousel.mjs`) into `carousel/slide_01.png …`
- [ ] `caption.md`: 500–900 chars per platform, no hashtags, hook first, one CTA, slide recap
- [ ] Auditor subagent signed off (no overflow, typos, or style drift)
- [ ] Deliverables: `carousel/*.png` + `caption.md`
