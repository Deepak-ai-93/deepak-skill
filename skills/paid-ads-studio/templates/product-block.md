# Product Block — the verbatim consistency token for paid-ads-studio

The **product block** is the single paragraph pasted VERBATIM into every video and image ad prompt. Never reword it, never trim it. Only the camera/action/scene changes around it. It anchors shape, materials, colors and label text so the AI renders the SAME product in every ad.

## The grammar (fill each field — keep it dense, specific, one paragraph)

```
Brand: <brand name> — <product type> in <color/material>, <shape/size>, with <signature detail: material, finish, texture>,
an exact label reading "<LABEL TEXT · SIZE>" on the <position>, and a hero claim: "<one claim — e.g. keeps drinks hot 8 hours>".
```

### Example (Brew & Co Tumbler — the repo's worked example)

```
Brand: Brew & Co — a matte-black 500ml vacuum-insulated stainless steel tumbler, tapered silhouette with a brushed-steel
rim and a silicone grip ring, an engraved label reading "BREW & CO · 500ML" on the front, and a hero claim: keeps drinks
hot for 8 hours or iced for 12.
```

## Grade token (pick ONE, reuse verbatim in every prompt)

| Grade | Token |
|---|---|
| **High-key commercial** (default) | `Grade: high-key commercial product photography, crisp whites, soft seamless gradients, premium product glow, clean highlights, subtle film grain.` |
| **Lifestyle warm** | `Grade: warm golden lifestyle look, soft natural light, gentle halation, creamy film grain, sun-kissed tones.` |
| **Editorial luxury** | `Grade: muted earth tones, matte shadows, soft window light, medium-format film look, ultra-fine grain, editorial stillness.` |
| **Cold tech / modern** | `Grade: cold desaturated blue-grey, clean highlights, high contrast, clinical precision, fine grain.` |

## Craft token (images only — reuse verbatim in every image prompt)

| Craft | Token |
|---|---|
| **Studio commercial** (default) | `Craft: shot on a Hasselblad X2D medium format, 85mm f/2.8 lens, focus-stacked macro sharpness, softbox key light, white V-flat bounce fill.` |
| **Lifestyle handheld** | `Craft: shot on a Sony A7 IV full frame, 35mm f/1.8 lens, shallow depth of field, natural window light, handheld realism.` |
| **E-commerce flat-lay** | `Craft: shot on a Canon R5, 100mm macro f/4, overhead top-down, even diffused light, sharp texture detail.` |

## Reference-image prompts (generate 2-3, upload as Ingredients / --cref / reference)

1. **Hero on white** — `Studio product hero shot on seamless white background, <product block>, centered composition, soft even lighting, no shadow, high-key commercial grade, aspect 1:1.`
2. **Lifestyle** — `Candid lifestyle shot, <product block> on a <setting: kitchen counter / office desk / hiking trail>, natural light, shallow depth of field, lifestyle warm grade, aspect 4:5.`
3. **Detail macro** — `Extreme macro close-up of <the signature detail: rim, grip, label text>, <product block>, razor-sharp texture, studio craft, aspect 1:1.`

## Rules

- **Never edit the block mid-run** — a reworded block breaks consistency across the whole ad set. If one ad drifts, regenerate it with the identical prompt + same Ingredients.
- **Keep native text in the prompt ≤3 words** (brand name or one CTA word). Logos, fine print and legal lines go on in post — generative text can warp.
- **Reference images are reused for every prompt** — the same hero/lifestyle/macro set anchors the product everywhere.
