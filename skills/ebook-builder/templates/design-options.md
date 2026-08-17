# Design options — reference for ebook-builder

Pick ONE of everything: **layout + palette + accent + type pairing + cover style + motif family + mood + texture**. Locked at Stage 3 (the **design picker**) and held across every page — the deck carries `data-layout`, `data-palette`, `data-cover-style` and `data-motif` on every `.page`, and the audit fails on mixed values.

## The design picker (fast path)

| Goal / audience | Recommended layout |
|---|---|
| Guides, how-to, personal brand, evergreen authority | **Editorial Classic** |
| Checklists, frameworks, marketing, sales-page energy | **Modern Bold** |
| Premium / luxury / aesthetic / brand ebooks | **Minimal Luxury** |
| Social-first, Gen-Z, fun topics, challenges, creator ebooks | **Playful Pop** |
| Tech, SaaS, developers, data, product docs | **Technical Dark** |
| Wellness, coaching, sustainability, journaling, calm topics | **Nature Calm** |

Then: pick the palette (5 per layout), the cover style (6), the motif family (8), the mood (4), the texture (3). All in this file.

---

## Layout A — Editorial Classic (`editorial-classic`)

*Warm paper, serif, literary. Best for: guides, "how-to" lead magnets, personal-brand ebooks.*

| Token | Value |
|---|---|
| Paper | `#faf7f2` (warm cream) |
| Ink | `#1f1a16` |
| Headline type | Playfair Display / Georgia, 700 |
| Body type | Inter / Georgia, 400, 1.65 line-height |
| Labels | small-caps mono `#8a7f70`, letter-spacing 0.12em |
| Signature | big chapter numerals (`01`–`10`, 140px, `#e0d6c6`), drop caps, hairline rules, generous margins |
| Grade (Mode 2) | warm golden light, soft halation, film grain |

**Palettes (pick ONE — `data-palette`):**
- `warm-paper` — cream `#faf7f2` / ink `#1f1a16` / accent `#8a4b2d`
- `cool-ivory` — `#f7f6f3` / ink `#22221f` / accent slate `#4a5d6e`
- `charcoal-ink` — `#efece5` / ink `#141414` / accent oxblood `#7a2e2e`
- `vintage-sage` — `#f2f0e8` / ink `#232019` / accent sage `#6b7f5e`
- `cream-terracotta` — `#f7f1e8` / ink `#241d15` / accent terracotta `#c1683f`

## Layout B — Modern Bold (`modern-bold`)

*White + color blocks, heavy sans. Best for: checklists, frameworks, marketing ebooks.*

| Token | Value |
|---|---|
| Base | `#ffffff` + 8% grey panels |
| Ink | `#0d0d0f` |
| Headline type | Archivo Black / Inter 900, uppercase, tight |
| Body type | Inter 400, 1.5 line-height |
| Labels | Inter 700 uppercase, 0.08em |
| Signature | color-block headers (accent bar over headline), numbered step cards, filled callout boxes, progress dots, step arrows |
| Grade (Mode 2) | clean bright commercial, crisp highlights |

**Palettes (pick ONE — `data-palette`):**
- `electric-blue` — base white / ink `#0d0d0f` / accent `#2f6fed`
- `signal-red` — base white / ink `#0d0d0f` / accent `#e63946`
- `forest-green` — base white / ink `#0d0d0f` / accent `#2e7d32`
- `solar-orange` — base white / ink `#0d0d0f` / accent `#ff6b1a`
- `midnight-purple` — base white / ink `#0d0d0f` / accent `#7c3aed`

## Layout C — Minimal Luxury (`minimal-luxury`)

*Near-black, one accent, huge numerals, enormous whitespace. Best for: premium, aesthetic, brand ebooks.*

| Token | Value |
|---|---|
| Base | `#0b0b0d` (noir) or ivory `#f5f2ea` |
| Ink | `#f5f2ea` (on noir) / `#1a1a1a` (on ivory) |
| Headline type | Cormorant Garamond / Bodoni Moda, 300–500 |
| Body type | Space Mono / Inter 300, 1.7 line-height |
| Labels | mono uppercase, 0.18em, 60% opacity |
| Signature | one giant numeral per section, hairline frames, corner crosshairs, one accent line, film-grain overlay |
| Grade (Mode 2) | muted earth tones, matte shadows, editorial stillness |

**Palettes (pick ONE — `data-palette`):**
- `champagne-noir` — `#0b0b0d` / `#f5f2ea` / accent `#e5c158`
- `emerald-noir` — `#0b0b0d` / `#eef2ec` / accent `#2ecc71`
- `ivory-gold` — `#f5f2ea` / `#1a1a1a` / accent `#b98a2f`
- `rose-noir` — `#0b0b0d` / `#f7ece6` / accent `#d98d8d`
- `platinum-noir` — `#0b0b0d` / `#f2f2f2` / accent `#9aa0a6`

## Layout D — Playful Pop (`playful-pop`)

*Bright, rounded, sticker energy. Best for: social-first, Gen-Z, fun topics, challenges, creator ebooks.*

| Token | Value |
|---|---|
| Base | tinted pastel (`#fff7f9` family) |
| Ink | deep warm `#2b2333` |
| Headline type | Baloo 2 / Fredoka, 700, rounded |
| Body type | Nunito / Poppins, 600, 1.5 line-height |
| Labels | thick rounded badge, uppercase, 0.06em, white on accent |
| Signature | rounded-24px cards with thick borders, sticker badges, squiggle underlines, dotted dividers, playful emoji-adjacent shapes |
| Grade (Mode 2) | bright candy light, soft bounce, sticker-layered, joyful |

**Palettes (pick ONE — `data-palette`):**
- `candy-pop` — `#fff7f9` / ink `#2b2333` / accent hot pink `#ff5a8a`
- `lemon-soda` — `#fffdf2` / ink `#2b2620` / accent sun `#ffc93c`
- `bubblegum-blue` — `#f2faff` / ink `#1f2a33` / accent `#4cc9f0`
- `mint-splash` — `#f0fbf4` / ink `#17352b` / accent `#2dd4a7`
- `grape-soda` — `#faf6ff` / ink `#2b2140` / accent `#9b5cf6`

## Layout E — Technical Dark (`technical-dark`)

*Dark, terminal/code aesthetic. Best for: tech, SaaS, developers, data, product docs.*

| Token | Value |
|---|---|
| Base | near-black `#0d1117` (terminal navy) |
| Ink | pale `#e6edf3` |
| Headline type | JetBrains Mono / Fira Code, 700 |
| Body type | Inter / IBM Plex Sans, 400, 1.6 line-height |
| Labels | mono uppercase, 0.14em, 60% opacity, `#` prompt prefix |
| Signature | hairline grid lines, terminal prompt (`$`), syntax-highlight accent words, corner brackets, code-block cards |
| Grade (Mode 2) | moody studio light, screen glow, subtle scanlines, dark contrast |

**Palettes (pick ONE — `data-palette`):**
- `terminal-green` — `#0d1117` / `#e6edf3` / accent `#3fb950`
- `ocean-blue` — `#0b1420` / `#e0eaf5` / accent `#58a6ff`
- `amber-code` — `#14100f` / `#f5e9d7` / accent `#f0a832`
- `matrix` — `#050d08` / `#d7ffe0` / accent `#00e676`
- `cyber-violet` — `#120c1f` / `#ece6ff` / accent `#b388ff`

## Layout F — Nature Calm (`nature-calm`)

*Organic, botanical, soft. Best for: wellness, coaching, sustainability, journaling, calm topics.*

| Token | Value |
|---|---|
| Base | warm off-white `#f2f5ee` |
| Ink | deep green-brown `#2b3526` |
| Headline type | Fraunces / Lora, 500–600 |
| Body type | Nunito Sans / Source Sans 3, 400, 1.7 line-height |
| Labels | serif italic small, letter-spacing 0.1em, 60% opacity |
| Signature | organic blob shapes, leaf/fern line motifs, soft shadows, rounded corners, breathing whitespace |
| Grade (Mode 2) | soft morning light, botanical shadows, matte paper texture |

**Palettes (pick ONE — `data-palette`):**
- `sage` — `#f2f5ee` / ink `#2b3526` / accent `#7a9e6e`
- `terracotta` — `#faf2ea` / ink `#33251c` / accent `#d2835a`
- `ocean-breeze` — `#eff7f8` / ink `#223238` / accent `#7fb6c9`
- `meadow` — `#f6f7ef` / ink `#33381f` / accent `#a8b85f`
- `lavender` — `#f7f3fb` / ink `#2d2436` / accent `#9d8ec9`

---

## Cover styles (pick ONE per ebook — `data-cover-style` on the cover page)

| Style | What it is | When |
|---|---|---|
| **Full-bleed image + title** | photoreal scene fills the page; title over a bottom scrim (Mode 2 generates the scene) | emotional / story-led ebooks |
| **Solid color + type** | palette block, huge title, no image needed (Mode 1 perfect) | checklists, frameworks, clean brands |
| **Split image-type** | image top 60%, type on the lower band | premium / editorial |
| **Pattern / geometric** | repeating shapes, grids or brand pattern behind the type — no photo | Playful Pop, Technical Dark, Modern Bold |
| **Scene-frame** | a framed "window/polaroid" inset with the scene inside, type beside it | editorial, Nature Calm, Minimal Luxury |
| **Duotone** | a photo forced into two palette colors (high contrast, brand-true) | anywhere a photo + strong brand color |

## Page motif families (pick ONE per ebook — `data-motif`)

The dominant page treatment repeated across content pages. ONE family per book = visual consistency.

| Motif | What it looks like | Best for |
|---|---|---|
| `step-cards` | numbered step cards (01, 02, …), one per page or stacked | checklists, frameworks |
| `timeline` | a progress line (Day 1 → Day 30, Mistake 1 → 5) with markers | journeys, before→after |
| `checklist` | tick-box items, one idea per row | guides, audit-style ebooks |
| `scenario` | a scene per page (the `.scene-tag` drives Mode 2) | story-led, case-study ebooks |
| `quote-interstitial` | pull-quotes / case-study voices between chapters | authority, proof-heavy |
| `chapter-dividers` | huge numeral + one-line tease before each chapter | long-form, premium |
| `comparison` | "this vs that" two-column layouts | decision guides, vs ebooks |
| `framework-map` | the system diagram: inputs → steps → output | methodology ebooks |

## Mood + texture (pick ONE each)

**Mood (drives palette + type + grade choice):** `calm` (soft, low-contrast) · `confident` (crisp, high-contrast) · `playful` (bright, rounded) · `urgent` (hot accent, tight type).

**Texture:** `paper` (grain, warm — editorial/nature/retro) · `film` (noise, halation — luxury/pop) · `clean` (flat, no grain — bold/technical).

## Type pairings per layout (primary + alt — pick ONE)

| Layout | Primary | Alt |
|---|---|---|
| Editorial Classic | Playfair Display + Inter | Crimson Text + Source Serif 4 |
| Modern Bold | Archivo Black + Inter | Bebas Neue + Roboto |
| Minimal Luxury | Cormorant Garamond + Space Mono | Marcellus + Jost |
| Playful Pop | Baloo 2 + Nunito | Quicksand + Poppins |
| Technical Dark | JetBrains Mono + Inter | IBM Plex Mono + IBM Plex Sans |
| Nature Calm | Fraunces + Nunito Sans | Cormorant + Work Sans |

## Rules

- **One world:** the same layout + palette + accent + type + motif across every page — the deck is one book, not a slide deck.
- **Accent = ONE hex** from the chosen palette. Used for: chapter numerals, callout fills, CTA underline, progress markers. Never a second accent.
- **Headline ≤ 8 words; cover title ≤ 6 words.** If it doesn't fit, cut the qualifiers.
- **Text over imagery always gets contrast** (scrim, panel, or ink-on-paper) — never type on a busy photo without it.
- **Mode 2 consistency tokens** repeat on every prompt: layout, palette, accent hex, cover style, motif, mood, texture, grade.
