# Consistency Tokens — character sheet, world, reference images

The layered system that keeps the SAME character across separately-generated Veo scenes. Read the SKILL.md § Consistency system first.

---

## 1. The character block (VERBATIM in every prompt — never reworded)

A single rigid paragraph. Fill the brackets; keep the structure. Once written, it is **copy-pasted identically** into every scene prompt — only action/camera/context change.

```
Character: {NAME}, a {AGE}-year-old {ROLE/PROFESSION}, {BUILD} with {FACE — jaw, eyes, nose, expression baseline}, {HAIR — color, length, style}, wearing {WARDROBE — exact pieces, colors, textures, one signature item}, carrying/holding {SIGNATURE PROP if any}. Distinctive detail: {ONE unique marker — scar, tattoo, glasses, specific watch}.
```

**Example:**
```
Character: Marcus, a 34-year-old detective, lean build with a sharp jawline and tired brown eyes, short salt-and-pepper buzzcut, wearing a worn olive trench coat over a rumpled blue shirt, silver flask in his left coat pocket. Distinctive detail: a thin scar across his left eyebrow.
```

**Rules:**
- Face, hair, wardrobe, prop — lock ALL of them. Never add adjectives to the character mid-reel.
- If a scene needs a wardrobe change (e.g. raincoat), write it as an ADDITION inside that scene's context, never by editing the block: `still wearing the olive trench coat, now over a soaked hoodie`.
- The signature prop and distinctive detail are your best anti-drift anchors — keep them in the frame where possible.

## 2. The world block (VERBATIM — overall setting + light)

```
World: {ONE overall setting — city/period/weather/light philosophy}. {overall color atmosphere}. {one recurring element — e.g. neon signs, fog, rain}.
```

**Example:**
```
World: a rain-soaked 1980s downtown, night, neon reflections on wet asphalt, perpetual low cloud, amber streetlight pools. One recurring element: a flickering neon diner sign always in the background.
```

## 3. Reference-image prompts (Nano Banana Pro / Imagen in Flow, or your image tool)

Generate **2–3 images** with the SAME character block, clean background, consistent light. Upload them to Flow's **Ingredients** and reuse for every scene.

| Image | Prompt skeleton |
|---|---|
| **Front portrait** | `{character block}. Front-facing portrait, head and shoulders, neutral expression, plain studio grey background, soft even lighting, photorealistic, sharp focus.` |
| **¾ angle** | `{character block}. Three-quarter view portrait, looking slightly past camera, subtle confident expression, plain studio grey background, soft even lighting, photorealistic, sharp focus.` |
| **Full body** | `{character block}. Full-body shot standing, neutral stance, plain studio grey background, soft even lighting, photorealistic, sharp focus, the outfit fully visible.` |

**Guidance:**
- Same background + light in all three → the model learns "this is the character", not "this is a mood".
- Face is the anchor: if the front portrait isn't a clean likeness, redo it before generating video.
- No text/logos/watermarks in the images.

## 4. What NOT to change between scenes
- Hair (length, color, style) · outfit (pieces, colors) · the prop · the distinctive detail · the face.
- Only the ACTION, CAMERA, and CONTEXT change per scene.

## 5. Bridge notes (seamless cuts)
When Scene B must cut cleanly from Scene A: generate A → export A's **last frame** → set it as B's **start frame** in Flow (Frames→video). The scene-plan marks these scenes with `"bridge": true`.
