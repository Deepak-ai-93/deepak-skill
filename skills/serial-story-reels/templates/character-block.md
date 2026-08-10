# Character Block — cross-episode consistency (serial-story-reels)

The **character block** is the anchor that keeps the SAME character across many separate Veo generations. Once written it is **copy-pasted identically into every prompt that character appears in** — never reworded, never trimmed. `episode-prompts.mjs` verifies it word-by-word.

---

## 1. The block grammar

```
Character: {NAME}, a {AGE}-year-old {ROLE/PROFESSION}, {BUILD} with {FACE — jaw, eyes, nose, expression baseline}, {HAIR — color, length, style}, wearing {WARDROBE — exact pieces, colors, textures, one signature item}, carrying/holding {SIGNATURE PROP if any}. Distinctive detail: {ONE unique marker — scar, tattoo, glasses, specific watch}.
```

**Example:**
```
Character: Maya, a 26-year-old bike courier, lean athletic build with a sharp jawline and fierce amber eyes, long black hair in a high ponytail, wearing a red leather jacket over a black hoodie, dark jeans, scuffed combat boots. Distinctive detail: a small lightning-bolt tattoo behind her left ear.
```

**Rules:**
- Lock face, hair, wardrobe, prop, distinctive detail — ALL of them. Never add adjectives mid-series.
- Wardrobe changes (raincoat, disguise) go in the scene's CONTEXT as an addition, never by editing the block: `still wearing the red leather jacket, now soaked and steaming`.
- The distinctive detail + signature prop are the anti-drift anchors — keep them in frame where possible.

## 2. Reference-image prompts (Nano Banana Pro / Imagen in Flow — generate ONCE, reuse for the WHOLE series)

Generate **2–3 clean images** per character with the SAME block, plain background, consistent light. Upload to Flow's **Ingredients** panel once; reuse for every scene of every episode.

| Image | Prompt skeleton |
|---|---|
| **Front portrait** | `{character block}. Front-facing portrait, head and shoulders, neutral expression, plain studio grey background, soft even lighting, photorealistic, sharp focus.` |
| **¾ angle** | `{character block}. Three-quarter view portrait, looking slightly past camera, subtle confident expression, plain studio grey background, soft even lighting, photorealistic, sharp focus.` |
| **Full body** | `{character block}. Full-body shot standing, neutral stance, plain studio grey background, soft even lighting, photorealistic, sharp focus, the outfit fully visible.` |

**Guidance:**
- Same background + light in all three → the model learns "this is the character", not "this is a mood".
- Face is the anchor: if the front portrait isn't a clean likeness, redo it before generating any video.
- No text/logos/watermarks in the images.

## 3. User's own reference images (the "I have character photos" path)

If the user uploads photos, those become the **Ingredients** directly. The character block is still written to DESCRIBE the same person (so the text anchor matches the images — same hair, same face shape, same wardrobe if visible). Rules:

- If the photo shows a specific outfit, lock THAT outfit in the block. If the user wants a different outfit, note it as a scene-context addition, never a block edit.
- If the photos are inconsistent (different lighting, old vs new), ask which look is canonical — pick ONE.
- State in `character-sheet.md`: "Ingredients = the user's uploads; blocks describe the same person."

## 4. The character sheet file (what you deliver)

```
# Character Sheet — "{series title}"

Upload the 3 reference images to Google Flow's Ingredients panel and reuse for every scene of every episode. Never reword the character block.

## Character block (VERBATIM in every prompt)
> {block}

## World block (VERBATIM)
> {world}

## Grade (locked — one per series)
> {grade}

## Reference-image prompts (or: user's uploads used as Ingredients)
### 1. Front portrait — {name}-front-portrait.png
### 2. Three-quarter — {name}-three-quarter.png
### 3. Full body — {name}-full-body.png

## Anti-drift rules for this character
- **Never change:** {locked items}
- **Scene-specific additions** go in the scene's CONTEXT, not the character block.
- If a generated scene shows a different face → regenerate with the IDENTICAL prompt + same ingredients. Never "fix" by editing the character block.
```

## 5. What NOT to change between scenes (or episodes)
Hair (length, color, style) · outfit (pieces, colors) · the prop · the distinctive detail · the face. Only ACTION, CAMERA, and CONTEXT change per scene.
