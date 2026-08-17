# Thumbnail Variants — CTR-engineered

**Video title:** 3 Pricing Mistakes That Cost You Revenue
**Niche:** SaaS / B2B founders · **The ONE idea:** The mistake that quietly costs founders $12k — and the one-line fix · **Emotion:** uneasy realization

Every variant sells the SAME one idea — the execution varies, the promise never does. Overlays ≤ 5 words, one font, high-contrast band. Generate at **1280×720** (YouTube), then verify the overlay text on the image.

### Variant 1 — Founder staring at a shrinking revenue chart — the realization moment

| | |
|---|---|
| **Overlay (≤ 5 words)** | "the mistake that costs $12k" |
| **Scene** | a founder at their desk at night, one warm lamp, staring at a laptop showing a downward revenue chart, realization on their face |
| **Style** | photoreal — photorealistic, real-life, cinematic lighting, shallow depth of field, shot on 35mm, natural skin texture |
| **Test?** | **A/B candidate** |

**Image prompt (1280×720, PNG):**
```
YouTube thumbnail, photorealistic — a founder at their desk at night, one warm lamp, staring at a laptop showing a downward revenue chart, realization on their face — the emotion on display is uneasy realization. The idea: The mistake that quietly costs founders $12k — and the one-line fix.
Composition: subject off-center (rule of thirds), high contrast between subject and background, one accent color, readable at small size.
Overlay text EXACTLY: "the mistake that costs $12k" — large heavy font, high-contrast band/scrim behind it, no more than 5 words.
Grade: photorealistic, real-life, cinematic lighting, shallow depth of field, shot on 35mm, natural skin texture. Negative: no clichés — red arrow, red circle, shocked hands, hands on cheeks, you won't believe, gone wrong — no extra words on the image, no watermark, no logo.
```

**Verify after generation:** overlay text exactly matches (regenerate if garbled) · readable at 120×68px · matches the video title's promise.

### Variant 2 — Split-screen wrong way vs right way pricing page

| | |
|---|---|
| **Overlay (≤ 5 words)** | "your way vs mine" |
| **Scene** | split composition: left side a cluttered pricing page with a 'book a demo' button greyed out, right side a clean page with one visible price, the same founder's hand pointing at the right side |
| **Style** | bold-graphic — bold graphic design, high contrast, minimal, strong negative space, swiss poster style |
| **Test?** | **A/B candidate** |

**Image prompt (1280×720, PNG):**
```
YouTube thumbnail, bold-graphic — split composition: left side a cluttered pricing page with a 'book a demo' button greyed out, right side a clean page with one visible price, the same founder's hand pointing at the right side — the emotion on display is uneasy realization. The idea: The mistake that quietly costs founders $12k — and the one-line fix.
Composition: subject off-center (rule of thirds), high contrast between subject and background, one accent color, readable at small size.
Overlay text EXACTLY: "your way vs mine" — large heavy font, high-contrast band/scrim behind it, no more than 5 words.
Grade: bold graphic design, high contrast, minimal, strong negative space, swiss poster style. Negative: no clichés — red arrow, red circle, shocked hands, hands on cheeks, you won't believe, gone wrong — no extra words on the image, no watermark, no logo.
```

**Verify after generation:** overlay text exactly matches (regenerate if garbled) · readable at 120×68px · matches the video title's promise.

### Variant 3 — Close-up of a pricing page with a single circled number — the reveal

| | |
|---|---|
| **Overlay (≤ 5 words)** | "5 mistakes" |
| **Scene** | close-up of a laptop screen showing a pricing page, one price tag visually highlighted by natural light, shallow depth of field, the number is the focal point |
| **Style** | photoreal — photorealistic, real-life, cinematic lighting, shallow depth of field, shot on 35mm, natural skin texture |
| **Test?** | secondary |

**Image prompt (1280×720, PNG):**
```
YouTube thumbnail, photorealistic — close-up of a laptop screen showing a pricing page, one price tag visually highlighted by natural light, shallow depth of field, the number is the focal point — the emotion on display is uneasy realization. The idea: The mistake that quietly costs founders $12k — and the one-line fix.
Composition: subject off-center (rule of thirds), high contrast between subject and background, one accent color, readable at small size.
Overlay text EXACTLY: "5 mistakes" — large heavy font, high-contrast band/scrim behind it, no more than 5 words.
Grade: photorealistic, real-life, cinematic lighting, shallow depth of field, shot on 35mm, natural skin texture. Negative: no clichés — red arrow, red circle, shocked hands, hands on cheeks, you won't believe, gone wrong — no extra words on the image, no watermark, no logo.
```

**Verify after generation:** overlay text exactly matches (regenerate if garbled) · readable at 120×68px · matches the video title's promise.

---
Next: decide the A/B pair in `ab-test.md` (the two most different executions), then run `audit-thumbs.mjs` → thumbs-auditor subagent before shipping.