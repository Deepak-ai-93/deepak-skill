# Carousel-Auditor Subagent Brief — paste this to a fresh subagent

> **Rule: never audit your own work.** After `audit-carousel.mjs` runs clean, spawn a FRESH subagent (new context, second pair of eyes) with this exact brief. Nothing is delivered until the auditor signs off **PASS**.

---

```
You are the carousel-auditor for the carousel-post-images pack at
{carousel-folder}/.

1. Read carousel-audit.md (the automated harness results) and every pack
   file: slides.html · caption.md · carousel/*.png (Mode 1) or
   carousel/prompts.md (Mode 2).

2. Complete Section 2 of carousel-audit.md:
   - 2.1 Carousel-worthiness scorecard (rate 1–5 each, /50 — a deck worth
     posting scores ≥ 35):
       · Text accuracy — is every on-image character EXACTLY the planned copy
         (no garbling, no invented words)?
       · Copy punch — headline ≤ 8 words, specific > generic, cover loop
         open, CTA present, no fluff?
       · Scene authenticity — does each visual show the planned real-life
         moment (no stock clichés, no abstract gradients)?
       · World consistency — same person/location/light across the whole deck?
       · Contrast / readability — text readable at phone size (≥ 4.5:1 on the
         scrim, nothing clipped)?
       · Style consistency — same palette/type/scrim/accent across all slides?
       · 4K check — every image's long edge ≥ 4000px (visually confirm)?
       · Cover → payoff loop — does the cover's open loop resolve inside the
         deck?
       · Caption pack — 500–900 chars per platform, no hashtags, hook-first,
         one CTA, slide recap?
       · Save-worthiness — would the target audience save or share this?
   - 2.2 Creative judgment calls:
       · Any slide whose text would be garbled by the image model (regenerate
         or fall back to Mode 1)
       · Any scene that reads fake or stock-y
       · Any headline that could belong to any brand
   - 2.3 Verdict:
       · All PASS and scorecard ≥ 35 → mark PASS and sign.
       · Any FAIL (or a WARN you judge real) → mark FIX NEEDED and list
         concrete fixes PER SLIDE.

3. Report your verdict (PASS / FIX NEEDED + scorecard total) and the
   completed carousel-audit.md path.
```

---

## Why the scorecard matters (for the main agent)

The carousel-worthiness scorecard is the **"is it good to go?" gate** — it answers *"would I post this deck on LinkedIn/Instagram?"* before anything ships:

| Total /50 | Verdict |
|---|---|
| ≥ 40 | Strong — post as-is |
| 35–39 | Good — post with the small fixes listed |
| 25–34 | Weak — fix copy/scene gaps before posting |
| < 25 | Not ready — rework the deck plan + copy + scenes |

## Fix-loop rule (for the main agent)

Any FAIL or real WARN → fix the deck → **re-run `audit-carousel.mjs`** (re-render with `render-carousel.mjs` if the HTML changed) → re-submit to a fresh auditor. Loop until PASS. The deliverable folder ships `carousel-audit.md` with the signed PASS.
