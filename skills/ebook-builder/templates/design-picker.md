# Design picker — lock ONE of everything at Stage 3

Fill this card before writing a single line of the deck. It IS the design contract — the deck must match it exactly, and the audit checks the `data-*` attributes against it.

## The card

```
Layout:            {editorial-classic | modern-bold | minimal-luxury | playful-pop | technical-dark | nature-calm}
Palette:           {one of the 5 for the layout, e.g. electric-blue}
Accent hex:        {from the palette — exactly ONE}
Type pairing:      {primary | alt — from design-options.md}
Cover style:       {full-bleed | solid | split | pattern | scene-frame | duotone}
Motif family:      {step-cards | timeline | checklist | scenario | quote-interstitial | chapter-dividers | comparison | framework-map}
Mood:              {calm | confident | playful | urgent}
Texture:           {paper | film | clean}
Why this combo:    {one line — audience + goal → these choices}
```

## Pick order (fast path)

1. **Layout** from the goal table in `design-options.md` (audience → layout).
2. **Palette** — 5 per layout; match the brand or the emotion (urgent → hot accent, calm → soft).
3. **Cover style** — needs no photo? `solid` / `pattern`. Story-led? `full-bleed` / `scene-frame`. Brand-true photo? `duotone`.
4. **Motif family** — the repeated page treatment; ONE per book (see the motif table).
5. **Mood + texture** — the last two knobs; they tune the grade, not the structure.

## What the deck must carry (mirror this card)

- Every `.page` → `data-layout="{layout}"` AND `data-palette="{palette}"` AND `data-motif="{motif}"`
- The cover page (`.page[data-page="cover"]`) → `data-cover-style="{cover-style}"`
- CSS custom properties on the root: `--base`, `--ink`, `--accent`, `--panel`, `--muted` from the palette hexes
- `.chapter-label` / `.headline` / `.callout` / `.quote` all use the accent + ink from the card — no stray colors

## Anti-drift

- If the user changes one choice mid-build (e.g. palette), update the card + the deck CSS + the `data-palette` on EVERY page — then re-audit. Mixed `data-*` values fail the audit.
- The audit's "layout consistency" check now covers layout + palette + motif + cover style, so a one-page drift is caught.
