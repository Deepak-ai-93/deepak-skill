---
name: ebook-builder
description: Build beautiful, designed lead-magnet ebooks (guides, checklists, frameworks) as print-ready PDFs + page PNGs — SIX layout presets (Editorial Classic / Modern Bold / Minimal Luxury / Playful Pop / Technical Dark / Nature Calm), 30 design palettes + typography + 6 cover styles + page-motif families + mood/texture options (design picker locks ONE of each at Stage 3), a story-first structure (cover opens a loop → chapters escalate → payoff → CTA), and TWO generation modes like carousel-post-images (Mode 1 browser render: ebook.html → A4 PDF + 4K page PNGs via headless Chrome; Mode 2 image-model: the same deck exports photoreal cover + interior scene prompts). Cover-image brief built in, plus an audit harness (render-ebook.mjs + audit-ebook.mjs → a fresh ebook-auditor subagent scores /50 and signs PASS / FIX NEEDED).
---

<!-- ════════════════════════════════════════════════════════════════════════
     🎬 deepak-skill — crafted by Deepak · skill: ebook-builder
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

**🎬 deepak-skill — crafted by Deepak** · skill: `ebook-builder` · [deepak-skill on GitHub](https://github.com/Deepak-ai-93/deepak-skill) · MIT

# skill: ebook-builder

**Name:** Ebook Builder — designed lead-magnet ebooks, six layouts, print-ready
**Description:** Turns a topic into a **beautiful, designed ebook** (guide / checklist / framework lead magnet) as a print-ready **A4 PDF + 4K page PNGs + cover.png**. The agent writes ONE deck (`ebook.html`) — the single source of truth — picks **ONE of six layout presets** (Editorial Classic · Modern Bold · Minimal Luxury · Playful Pop · Technical Dark · Nature Calm) through the **design picker** (`templates/design-picker.md`): **30 palettes** (5 per layout), typography pairings, **6 cover styles**, page-motif families, mood + texture — ONE of each, locked across every page — then generates it in **either of two modes** like `carousel-post-images`: **Mode 1 — browser render** (`render-ebook.mjs` → headless Chrome → A4 PDF + per-page PNGs, works on any CLI) or **Mode 2 — image-model generation** (the same deck exports photoreal **cover + interior scene prompts** for Nano Banana / Midjourney / Flux). Story-first structure enforced (cover opens a loop → chapters escalate → payoff → CTA), cover-image brief built in, and an audit harness (`audit-ebook.mjs` + fresh ebook-auditor subagent, /50, PASS / FIX NEEDED) before delivery.

---

## Storytelling + addiction rails (the universal contract — read before anything else)

Every deliverable this skill produces must tell **ONE micro-story** and engineer **rewatch**. These rails are the SAME contract every video/image skill in this repo follows — apply them to every beat, scene, slide, shot or clip before it ships.

**Applied to ebooks:** the ebook IS the micro-story — the **cover opens the loop** (the promise: "the 5 mistakes that cost you X", "the 30-day fix"), the **chapters escalate** (each chapter raises the stakes or adds a new layer — mistake 1 → mistake 5, day 1 → day 30), the **payoff chapter delivers the system**, and the **final page is the CTA/loop** ("get part 2", "save this", "share it"). The open loop is what makes a visitor download it; the CTA/loop is what turns a reader into a subscriber.

### The story spine (all four beats, always)

| Beat | Rule |
|---|---|
| **Open loop (hook, 0–3s)** | The first thing the viewer sees — first frame, cover slide, first scene — opens an unresolved question, tension or promise the brain must see closed. No intro, no logo, no "hey guys". |
| **Rising tension** | Every beat after the hook escalates: new stakes, a twist, a pattern interrupt, an "and then…". Each beat either raises the question or raises the stakes — never just fills time. |
| **Payoff** | The open loop closes in the final seconds with the "aha" the hook promised. A loop opened and never closed kills trust and rewatch. |
| **Loop ending** | The last frame mirrors or seeds the first (rewatch counts as a second view) or chains into the next post ("Part 2", "Follow for part 2", "Save this"). |

### The addiction levers (use ≥3 per deliverable)

| Lever | Mechanism |
|---|---|
| **Curiosity gap** | The open loop the brain must close (Zeigarnik effect — unfinished tasks nag). |
| **Serialization / cliffhanger** | Cut before resolution; chain posts into a series so the audience returns for the next installment. |
| **Variable reward** | Reveal payoffs on a beat the viewer can't predict — countdowns, answer reveals, verdicts, twists. |
| **Pattern interrupt** | A scale pop, color flash or tempo break exactly where attention dips (the mid-video hump). |
| **Relatability / self-recognition** | "That's me" moments — the viewer watches to see their own life, then saves or shares it. |
| **Commitment bait** | Save / share / comment / "what's your #?" — an engaged viewer is a returning viewer. |

### The fluff rule

Every beat either **raises the question**, **raises the stakes**, or **pays off**. If a beat can be deleted without losing the story, delete it.

---

## The quality bar (non-negotiable — read before anything else)

| Rail | Rule |
|---|---|
| **Story-first structure (the #1 rail)** | The ebook tells ONE story: cover opens a loop → chapters escalate → payoff chapter → CTA page. A page that doesn't raise the question, raise the stakes, or pay off gets cut (the fluff rule). |
| **Six layouts, pick ONE** | Editorial Classic (`editorial-classic`) · Modern Bold (`modern-bold`) · Minimal Luxury (`minimal-luxury`) · Playful Pop (`playful-pop`) · Technical Dark (`technical-dark`) · Nature Calm (`nature-calm`). ONE layout + ONE palette across every page — the deck carries `data-layout` + `data-palette` + `data-motif` on every page and `data-cover-style` on the cover; mixed values fail the audit. |
| **Design options, locked (the design picker)** | Per layout: ONE of 5 palettes (30 total), ONE accent hex, ONE type pairing (primary/alt), ONE of 6 cover styles, ONE page-motif family, ONE mood + texture — all locked via the **design picker** card (`templates/design-picker.md`) and held from `templates/design-options.md`. Same world from cover to last page. |
| **Cover earns the download (the cover-image rail)** | The cover has ONE idea, title ≤ 6 words, readable at thumbnail size, high contrast, an emotion — and a `.cover-image` slot: Mode 1 renders the designed cover, Mode 2 exports a photoreal cover prompt (see `templates/cover-brief.md`). |
| **Copy that converts** | Anti-fluff (the blocklist — no "unlock", "game-changer", …), specific beats generic (numbers, receipts), headline ≤ 8 words, one idea per page, CTA on the last page. |
| **Print-ready output** | Mode 1: A4 PDF + 4K page PNGs + cover.png via headless Chrome (text always exact). Mode 2: per-page image-model prompts (photoreal cover + interior scenes) with the exact overlay copy. Either way the deliverable is `ebook.pdf` (or `prompts.md` + generated pages). |
| **Audited before delivery (the harness)** | Stage 7 is a harness, never a self-check: `audit-ebook.mjs` runs the automated checks (pages, cover, layout consistency, copy limits, fluff, output) → a FRESH ebook-auditor subagent scores ebook-worthiness (/50, ≥ 35 = worth publishing) → fix loop until signed **PASS** in `ebook-audit.md`. |

---

## When to use

- "Build me a lead-magnet ebook about [topic] — beautiful design, PDF"
- "Create a guide/checklist/framework ebook with a killer cover"
- "I want an ebook with [Editorial / Modern / Minimal / Playful / Technical / Nature] design — 6 layout options, 30 color schemes"
- "Pick the design for me — layout, palette, cover style, motif, mood"
- "Make an ebook cover image + interior pages"
- "Turn my blog post / thread into a downloadable ebook"

**Complements:** `carousel-post-images` (same two-mode render + design-system DNA) · `newsletter-growth` (the ebook becomes the lead magnet in the welcome sequence) · `x-threads-engagement` (the same story becomes the thread) · `blog-seo-content` (expand the ebook into an article) · `photoshoot-studio` (photoreal cover imagery via image prompts) · `social-media-content-plan` (the ebook slots into a pillar).

---

## The six layouts (pick ONE — full specs in `templates/design-options.md`)

| Layout | Vibe | Type pairing | Signature | Best for |
|---|---|---|---|---|
| **A. Editorial Classic** (`editorial-classic`) | warm paper, serif, literary | Playfair Display / Georgia + Inter | cream paper `#faf7f2`, drop caps, big chapter numerals, hairline rules, small-caps labels | guides, "how-to" lead magnets, personal-brand ebooks |
| **B. Modern Bold** (`modern-bold`) | white + color blocks, heavy sans | Archivo Black / Inter 900 + Inter | color-block headers, numbered steps, filled callout boxes, progress accents | checklists, frameworks, marketing ebooks |
| **C. Minimal Luxury** (`minimal-luxury`) | near-black, one accent, huge numerals | Cormorant / Bodoni Moda + Space Mono | near-black `#0b0b0d` or ivory, one champagne/emerald accent, enormous whitespace | premium, aesthetic, brand ebooks |
| **D. Playful Pop** (`playful-pop`) | bright, rounded, sticker energy | Baloo 2 / Fredoka + Nunito | rounded cards, sticker badges, thick borders, squiggle underlines, pastel tint | social-first, Gen-Z, fun topics, challenges, creator ebooks |
| **E. Technical Dark** (`technical-dark`) | dark, terminal/code aesthetic | JetBrains Mono / Fira Code + Inter | near-black `#0d1117`, hairline grids, `$` terminal prompts, syntax-highlight accents | tech, SaaS, developers, data, product docs |
| **F. Nature Calm** (`nature-calm`) | organic, botanical, soft | Fraunces / Lora + Nunito Sans | warm off-white, leaf motifs, organic shapes, soft shadows, breathing whitespace | wellness, coaching, sustainability, journaling |

**Design options per layout (locked at Stage 3 via the design picker):** 5 palettes each (**30 total**) · 6 cover styles (full-bleed image + title / solid color + type / split image-type / pattern-geometric / scene-frame / duotone) · 8 page-motif families (step-cards / timeline / checklist / scenario / quote-interstitial / chapter-dividers / comparison / framework-map) · mood (calm / confident / playful / urgent) · texture (paper / film / clean) · type pairing (primary / alt) — all in `templates/design-options.md` + `templates/design-picker.md`.

---

## Two generation modes — pick ONE (always present the choice, like carousel-post-images)

Same deck (`ebook.html`), two outputs:

| | **Mode 1 — Browser render** (default) | **Mode 2 — Image-model generation** |
|---|---|---|
| Command | `render-ebook.mjs --html ebook.html --out ebook/ --pdf` | `render-ebook.mjs --html ebook.html --out ebook/ --mode model` → dispatch `prompts.md` |
| Output | **A4 `ebook.pdf`** + `cover.png` + `pages/page_XX.png` (2× = 2160×3056) | Per-page **photoreal prompts** (cover + interior scene slots) → image tool |
| Text | Always exact (deterministic render) | Excellent, but verify words on generated images |
| Requires | Chrome + Node + Playwright | The CLI's native image tool |
| Best when | No image tool, or text must be pixel-perfect | The user wants photoreal cover/interior imagery |

**Decision rule:** surface the choice at Stage 1. No image tool → Mode 1. Tool available + user wants photoreal scenes → Mode 2. Undecided → Mode 2 when the tool exists (matches the cover-image rail), else Mode 1. Hybrid: render in Mode 1 and composite Mode-2 generated cover/scenes into the deck.

---

## Workflow (7 stages)

### Stage 1 — Analyze the prompt + CHOOSE THE MODE
Extract: **topic** (ask ≤3 questions if vague) · **audience** · **goal** (subscribers / leads / authority) · **length** (default 10–14 pages) · **tone** · **layout** (default via the picker's goal table: Editorial Classic for guides, Modern Bold for checklists/frameworks, Minimal Luxury for premium, Playful Pop for social/fun, Technical Dark for tech/SaaS, Nature Calm for wellness). Then **present the two-mode choice** (browser render vs image-model). Lock the mode; it drives Stage 5.

### Stage 2 — Plan the ebook (the page map)
Cover (open loop) → 4–8 content pages (each chapter escalates) → payoff page → CTA page. For each page record: `page / headline (≤ 8 words, anti-fluff) / body / layout element (chapter numeral, step card, callout, quote, scene-tag) / SCENE (the exact visual moment)`. The scene is planned before the deck — it's half the design.

### Stage 3 — The design picker: lock ONE of everything
Run the **design picker** (`templates/design-picker.md`) — a decision card that forces exactly ONE choice per knob: **layout** (`editorial-classic` / `modern-bold` / `minimal-luxury` / `playful-pop` / `technical-dark` / `nature-calm`) + **palette** (5 per layout, 30 total — e.g. `electric-blue`) + **accent hex** + **type pairing** (primary/alt) + **cover style** (6: full-bleed / solid / split / pattern-geometric / scene-frame / duotone) + **motif family** (8: step-cards / timeline / checklist / scenario / quote-interstitial / chapter-dividers / comparison / framework-map) + **mood** (calm / confident / playful / urgent) + **texture** (paper / film / clean). If the user is undecided, the picker's goal table picks the layout, then walk the palette choice. Show the filled card to the user before writing the deck. Write the cover brief (`templates/cover-brief.md`) — one idea, ≤ 6 words, thumbnail-readable. The card is the contract: every `data-*` attribute in the deck mirrors it.

### Stage 4 — Write the deck → `ebook.html` (the single source of truth for BOTH modes)
One `.page` div per ebook page; the cover page carries `data-page="cover"` **and** `data-cover-style="{cover-style}"`; **every page carries `data-layout="{layout}"` + `data-palette="{palette}"` + `data-motif="{motif}"`** (mirror the design-picker card — mixed values fail the audit); CSS custom properties on `:root` for `--base` / `--ink` / `--accent` / `--panel` / `--muted` from the palette hexes; text in `.cover-title` / `.cover-sub` / `.chapter-label` / `.headline` / `.body` / `.callout` / `.quote` / `.cta`; a `.scene-tag` annotation per page (Mode 2 reads it as the SCENE; Mode 1 renders it as the placeholder); a `.page-num` footer. Print CSS: `@page { size: A4; margin: 0 }` and `.page { page-break-after: always }` so the PDF gets one page per sheet.

### Stage 5 — Generate in the chosen mode
**Mode 1 (browser, pixel-perfect):** `node scripts/render-ebook.mjs --html ebook.html --out ebook/ --pdf` → A4 `ebook.pdf` + `cover.png` + `pages/page_01.png …` (2× scale = 2160×3056). Text never garbled.
**Mode 2 (image-model):** `node scripts/render-ebook.mjs --html ebook.html --out ebook/ --mode model` → `ebook/prompts.md` (per-page blocks with the deck's exact copy + scene tags + 4K canvas). Dispatch one block per page to the image tool (Nano Banana / Midjourney / Flux) — cover first (from `cover-brief.md`), then interior scenes — and verify every word on generated images.

### Stage 6 — Approval gate
Show the user: **page map + layout/palette + cover brief (+ rendered preview or prompts)**. They say **approve / edit / reject**. Edits go back to the affected stage and re-render.

### Stage 7 — Audit harness (automated checks + ebook-auditor subagent, before delivery)
**Step 7a — run the automated audit harness:**
```bash
node scripts/audit-ebook.mjs --pack <ebook-folder> --out ebook-audit.md
```
`audit-ebook.mjs` scans the pack and checks everything a script can: ebook.html (page count ≥ 5, cover page present, ONE `data-layout` across pages, headline ≤ 8 words, anti-fluff blocklist, scene tags, CTA on the last page, cover title ≤ 6 words) and the output (Mode 1: `ebook.pdf` + `cover.png` + pages/*.png, or Mode 2: `prompts.md` with per-page blocks + 4K canvas). Writes `ebook-audit.md` (automated verdicts + scorecard scaffold). **Exit 1 on any FAIL.**

**Step 7b — spawn the ebook-auditor subagent** — a FRESH subagent (never self-audit) with the exact brief from `templates/ebook-auditor-brief.md`: reads `ebook-audit.md` + all pack files, completes the **ebook-worthiness scorecard** (10 criteria, /50 — **≥ 35 = worth publishing**, with verdict bands), makes the creative judgment calls the script can't (cover pull, layout consistency, design quality, typography, copy punch, story structure, imagery, print quality, CTA strength), and signs **PASS / FIX NEEDED** with per-page fixes.

**Step 7c — fix loop.** Any FAIL (or an auditor-flagged WARN) → fix the deck → re-run `render-ebook.mjs` (re-render if the HTML changed) → re-submit to a fresh auditor. **Nothing is delivered until the auditor signs off PASS.** The `ebook-audit.md` ships with the pack.

---

## Production checklist

- [ ] Mode chosen and **presented to the user** (browser render vs image-model) before generating
- [ ] Story spine complete: cover opens the loop → chapters escalate → payoff → CTA/loop ending; no page survives the fluff rule
- [ ] ≥3 addiction levers used (curiosity gap · serialization · variable reward · pattern interrupt · relatability · commitment bait)
- [ ] Design picker filled: ONE of 6 layouts + ONE of 30 palettes + ONE accent + ONE type pairing + ONE of 6 cover styles + ONE motif family + ONE mood + ONE texture — shown to the user
- [ ] Page map: cover → 4–8 content pages → payoff → CTA; headline ≤ 8 words per page; anti-fluff blocklist clear
- [ ] Cover brief: one idea, title ≤ 6 words, thumbnail-readable, `.cover-image` slot present
- [ ] `ebook.html` written as the single source of truth (scene tags + exact copy per page; `data-layout` + `data-palette` + `data-motif` on every page, `data-cover-style` on the cover; print CSS for A4)
- [ ] Mode 1: rendered `ebook.pdf` + `cover.png` + `pages/*.png` (2× = 2160×3056) **or** Mode 2: `prompts.md` → image tool at 4K
- [ ] On-image text visually verified (no garbled characters — regenerate or fall back to the browser render)
- [ ] Approval gate: user approved page map + design + cover before delivery
- [ ] **Audit harness run:** `audit-ebook.mjs` → automated checks (pages, cover, layout consistency, copy limits, fluff, output) — exit 0
- [ ] **Ebook-auditor subagent** (fresh eyes) completed the ebook-worthiness scorecard (/50 ≥ 35) and signed **PASS / FIX NEEDED** in `ebook-audit.md`
- [ ] Delivery: `ebook.html` + `ebook.pdf` (or `prompts.md` + generated pages) + `cover.png` + `ebook-audit.md`
