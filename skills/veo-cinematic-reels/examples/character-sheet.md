# Character Sheet — "The Last Courier" (veo-cinematic-reels example)

Upload the 3 reference images to Google Flow's **Ingredients** panel and reuse them for every scene. Never reword the character block.

---

## Character block (VERBATIM in every scene prompt)

> Character: Kai, a 28-year-old elite courier, athletic build with a chiseled jaw and intense dark eyes, short black hair, wearing a matte black tactical jacket with a glowing cyan circuit strip on the chest, black cargo pants, a silver data-drive on a lanyard around his neck. Distinctive detail: a thin cyan scar along his right cheek.

## World block (VERBATIM)

> World: a rain-soaked night in a near-future megacity, neon reflections on wet asphalt, perpetual low cloud, amber streetlight pools, distant sirens.

## Grade (locked — one per reel)

> Grade: cinematic teal-and-orange, cool shadows, warm skin tones, contrast-rich, 35mm Kodak Vision3 500T film stock, subtle grain.

---

## Reference-image prompts (Nano Banana Pro / Imagen — generate ONCE, reuse everywhere)

### 1. Front portrait — `kai-front-portrait.png`
```
Character: Kai, a 28-year-old elite courier, athletic build with a chiseled jaw and intense dark eyes, short black hair, wearing a matte black tactical jacket with a glowing cyan circuit strip on the chest, black cargo pants, a silver data-drive on a lanyard around his neck. Distinctive detail: a thin cyan scar along his right cheek. Front-facing portrait, head and shoulders, neutral expression, plain studio grey background, soft even lighting, photorealistic, sharp focus.
```

### 2. Three-quarter — `kai-three-quarter.png`
```
Character: Kai, a 28-year-old elite courier, athletic build with a chiseled jaw and intense dark eyes, short black hair, wearing a matte black tactical jacket with a glowing cyan circuit strip on the chest, black cargo pants, a silver data-drive on a lanyard around his neck. Distinctive detail: a thin cyan scar along his right cheek. Three-quarter view portrait, looking slightly past camera, subtle confident expression, plain studio grey background, soft even lighting, photorealistic, sharp focus.
```

### 3. Full body — `kai-full-body.png`
```
Character: Kai, a 28-year-old elite courier, athletic build with a chiseled jaw and intense dark eyes, short black hair, wearing a matte black tactical jacket with a glowing cyan circuit strip on the chest, black cargo pants, a silver data-drive on a lanyard around his neck. Distinctive detail: a thin cyan scar along his right cheek. Full-body shot standing, neutral stance, plain studio grey background, soft even lighting, photorealistic, sharp focus, the outfit fully visible.
```

---

## Anti-drift rules for this character
- **Never change:** black hair (short), cyan circuit strip on the chest, silver data-drive on lanyard, cyan scar on right cheek, matte black tactical jacket + black cargo pants.
- **Scene-specific additions** go in the scene's CONTEXT, not the character block (e.g. "still wearing the tactical jacket, now wet from rain, steam rising off it").
- If a generated scene shows a different face → regenerate with the IDENTICAL prompt + same ingredients. Never "fix" by editing the character block.
