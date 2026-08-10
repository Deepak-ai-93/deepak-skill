# Character Sheet — "Neon Hearts" (serial-story-reels example)

Upload the reference images to Google Flow's **Ingredients** panel ONCE and reuse them for every scene of every episode. Never reword the character blocks.

---

## Maya — character block (VERBATIM in every prompt she appears in)

> Character: Maya, a 26-year-old bike courier, lean athletic build with a sharp jawline and fierce amber eyes, long black hair in a high ponytail, wearing a red leather jacket over a black hoodie, dark jeans, scuffed combat boots. Distinctive detail: a small lightning-bolt tattoo behind her left ear.

### Reference-image prompts (Nano Banana Pro / Imagen — generate ONCE, reuse everywhere)

**1. Front portrait — `maya-front-portrait.png`**
```
Character: Maya, a 26-year-old bike courier, lean athletic build with a sharp jawline and fierce amber eyes, long black hair in a high ponytail, wearing a red leather jacket over a black hoodie, dark jeans, scuffed combat boots. Distinctive detail: a small lightning-bolt tattoo behind her left ear. Front-facing portrait, head and shoulders, neutral expression, plain studio grey background, soft even lighting, photorealistic, sharp focus.
```

**2. Three-quarter — `maya-three-quarter.png`**
```
Character: Maya, a 26-year-old bike courier, lean athletic build with a sharp jawline and fierce amber eyes, long black hair in a high ponytail, wearing a red leather jacket over a black hoodie, dark jeans, scuffed combat boots. Distinctive detail: a small lightning-bolt tattoo behind her left ear. Three-quarter view portrait, looking slightly past camera, subtle confident expression, plain studio grey background, soft even lighting, photorealistic, sharp focus.
```

**3. Full body — `maya-full-body.png`**
```
Character: Maya, a 26-year-old bike courier, lean athletic build with a sharp jawline and fierce amber eyes, long black hair in a high ponytail, wearing a red leather jacket over a black hoodie, dark jeans, scuffed combat boots. Distinctive detail: a small lightning-bolt tattoo behind her left ear. Full-body shot standing beside her bike, neutral stance, plain studio grey background, soft even lighting, photorealistic, sharp focus, the outfit fully visible.
```

### Anti-drift rules (Maya)
- **Never change:** red leather jacket + black hoodie, high ponytail (long black hair), amber eyes, scuffed combat boots, lightning-bolt tattoo behind the left ear.
- **Scene additions go in CONTEXT:** e.g. "her jacket now soaked, water flicking off the zipper as she rides".
- If a scene's face drifts → regenerate with the IDENTICAL prompt + same Ingredients. Never edit the block to "fix" it.

---

## Leo — character block (VERBATIM in every prompt he appears in)

> Character: Leo, a 24-year-old comic-book artist, lanky build with soft hazel eyes behind round glasses, messy dark-brown hair, wearing a paint-splattered denim jacket over a mustard-yellow t-shirt, a silver ring on his right thumb. Distinctive detail: ink-stained fingers and a crescent-moon tattoo on his wrist.

### Reference-image prompts

**1. Front portrait — `leo-front-portrait.png`**
```
Character: Leo, a 24-year-old comic-book artist, lanky build with soft hazel eyes behind round glasses, messy dark-brown hair, wearing a paint-splattered denim jacket over a mustard-yellow t-shirt, a silver ring on his right thumb. Distinctive detail: ink-stained fingers and a crescent-moon tattoo on his wrist. Front-facing portrait, head and shoulders, neutral expression, plain studio grey background, soft even lighting, photorealistic, sharp focus.
```

**2. Three-quarter — `leo-three-quarter.png`**
```
Character: Leo, a 24-year-old comic-book artist, lanky build with soft hazel eyes behind round glasses, messy dark-brown hair, wearing a paint-splattered denim jacket over a mustard-yellow t-shirt, a silver ring on his right thumb. Distinctive detail: ink-stained fingers and a crescent-moon tattoo on his wrist. Three-quarter view portrait, looking slightly past camera, subtle shy expression, plain studio grey background, soft even lighting, photorealistic, sharp focus.
```

**3. Full body — `leo-full-body.png`**
```
Character: Leo, a 24-year-old comic-book artist, lanky build with soft hazel eyes behind round glasses, messy dark-brown hair, wearing a paint-splattered denim jacket over a mustard-yellow t-shirt, a silver ring on his right thumb. Distinctive detail: ink-stained fingers and a crescent-moon tattoo on his wrist. Full-body shot standing with a sketchbook under his arm, neutral stance, plain studio grey background, soft even lighting, photorealistic, sharp focus.
```

### Anti-drift rules (Leo)
- **Never change:** round glasses, messy dark-brown hair, paint-splattered denim jacket + mustard-yellow t-shirt, silver thumb ring, ink-stained fingers, crescent-moon tattoo on the wrist.
- **Scene additions go in CONTEXT:** e.g. "his glasses fogged with rain".
- If a scene's face drifts → regenerate with the IDENTICAL prompt + same Ingredients.

---

## Locked tokens (verbatim in EVERY prompt — see `story-bible.md`)

> **Grade:** Grade: vivid comic-pop palette, saturated primaries, bold inky outlines, halftone shading accents, clean highlights, punchy contrast, slight cel-shaded feel.

> **World:** World: a neon-soaked city at night, oversized comic-book architecture, bold graphic shadows, floating motion lines in the air, rain-slick streets reflecting pink and cyan light. One recurring element: a glowing neon heart sign always visible on the skyline.

> **Cinematic:** Cinematic: IMAX-style cinematic scale, large-format digital cinema camera, full-frame sensor look, anamorphic-style widescreen feel adapted to vertical 9:16, smooth gimbal-stabilized camera motion, rich dynamic range, crisp highlight rolloff, premium film-grain finish, realistic physics and motion blur on fast action, no camera shake, no warping, no morphing artifacts.

---

## Series continuity notes
- The **neon heart sign** is the recurring world element — keep it in frame in at least one scene per episode (it appears in the skyline of e1, the rooftop of e2, and as the finale backdrop of e3).
- **Wardrobe state across episodes:** Maya's jacket starts dry in e1-s1, soaked by e1-s3, and stays wet through e3 — write it in context, never the block.
- **Voice anchor:** save Maya's and Leo's clean dialogue from e1-s3 and e1-s4 as their voice references for e2/e3.
- **Bridge flags:** e1-s2 → e1-s3 and e2-s3 → e2-s4 are continuous motion (bridge 🔗). e3 starts from e2-s4's last frame (rooftop → rooftop).
