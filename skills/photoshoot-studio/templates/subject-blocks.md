# Subject Blocks — person & product (VERBATIM in every prompt)

The rigid paragraph that keeps the SAME subject across every shot. Read the SKILL.md § Consistency system first. Fill ONE block (person OR product — never both) and **copy-paste it identically** into every generation prompt. Only pose/placement/setting/lighting change per shot.

---

## A. Person block (photoshoot of a person)

```
Subject: {NAME}, a {AGE}-year-old {ROLE/STYLE}, {BUILD} with {FACE — jaw, eyes, brows, expression baseline}, {HAIR — color, length, style}, wearing {WARDROBE — exact pieces, colors, textures, one signature item}, {ONE distinguishing detail — beauty mark, tattoo, glasses, piercing}. 
```

**Example:**
```
Subject: Ava, a 29-year-old startup founder, slim athletic build with a defined jawline, warm hazel eyes and a subtle confident expression, long chestnut-brown wavy hair, wearing a tailored cream blazer over a black silk top and straight-leg trousers, gold hoop earrings. Distinctive detail: a small freckle above her left eyebrow.
```

**Rules:**
- Face, hair, wardrobe — lock ALL of them. Never add adjectives to the subject mid-shoot.
- If a shot needs a wardrobe change, write it as an ADDITION inside that shot's setting field, never by editing the block: `still wearing the cream blazer, now with a red evening dress underneath`.
- The distinctive detail + signature wardrobe piece are your best anti-drift anchors — keep them visible where possible.

## B. Product block (product photoshoot)

```
Subject: a {CATEGORY} by {BRAND}, {EXACT COLOR + FINISH}, made of {MATERIALS — with texture words}, with {SIGNATURE FEATURE — handle, lid, logo plate, stitching}, label reads "{EXACT TEXT IF ANY}".
```

**Example:**
```
Subject: a matte-black insulated coffee tumbler by Brew & Co, brushed steel finish, made of double-wall stainless steel with a soft-touch rubber sleeve, with a minimalist white logo plate on the front, label reads "BREW & CO · 500ML".
```

**Rules:**
- Color, material, label text, signature feature — lock ALL. Never re-describe the product in shot fields.
- Put label text that must render EXACTLY in quotes — image models read quoted text best.
- If a variant is needed (different colorway), add it as an explicit note in that shot's setting: `same tumbler, now in sage green finish` — never edit the block.

---

## Reference-image prompts (generate ONCE, reuse in every shot)

Generate **2–3 images** with the SAME subject block, consistent lighting, clean background. Upload as Flow Ingredients / Midjourney `--cref` (use `--cw 0` for face-only since this skill changes outfits per shot — `--cw 100` only if the wardrobe must stay locked) / Flux reference.

### Person references

| Image | Prompt skeleton |
|---|---|
| **Front portrait** | `{subject block}. Front-facing portrait, head and shoulders, neutral expression, plain studio grey background, soft even lighting, photorealistic, sharp focus.` |
| **¾ angle** | `{subject block}. Three-quarter view portrait, looking slightly past camera, subtle confident expression, plain studio grey background, soft even lighting, photorealistic, sharp focus.` |
| **Full body** | `{subject block}. Full-body shot standing, neutral stance, plain studio grey background, soft even lighting, photorealistic, sharp focus, the outfit fully visible.` |

### Product references

| Image | Prompt skeleton |
|---|---|
| **Hero 45°** | `{product block}. Product hero shot at a 45-degree angle on a pure white seamless background, octabox key light, f/11 sharp focus, photorealistic, commercial catalog standard.` |
| **Top-down** | `{product block}. Top-down flat-lay on a light grey surface, soft even studio lighting, sharp focus, photorealistic, commercial catalog standard.` |
| **Detail close-up** | `{product block}. Extreme macro close-up of the {signature feature}, shallow depth of field, textured background, photorealistic, commercial catalog standard.` |

**Guidance:**
- Same background + light in all references → the model learns "this is the subject", not "this is a mood".
- Face is the anchor for people: if the front portrait isn't a clean likeness, redo it before generating the pack.
- No text/logos/watermarks in the images (except the product's own label).

---

## What NOT to change between shots

**Person:** hair (length/color/style) · face · wardrobe pieces · the distinctive detail.
**Product:** exact color · material · label text · signature feature.
Only the POSE/PLACEMENT, SETTING, PROPS, and LIGHTING change per shot.
