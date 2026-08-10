# Cinematic Language — Veo prompt vocabulary

The 5-part formula for every Veo scene prompt:
`Cinematography + Subject + Action + Context + Style & Ambiance` (+ native audio lines).

Never write vague "cinematic shot" — be specific. Pick ONE term per element per scene.

---

## 1. Camera (framing + motion + lens)

| Element | Pick one, be specific |
|---|---|
| **Shot size** | extreme close-up · close-up · medium shot · medium-wide · full body · wide establishing · aerial |
| **Camera motion** | slow push-in · dolly-in · tracking shot (follows subject) · crane up · 180° arc · orbiting · handheld urgency · locked-off static · whip pan |
| **Lens / optics** | 24mm wide · 35mm · 50mm · 85mm portrait · 100mm macro · anamorphic flare · shallow depth of field · deep focus |
| **Speed** | slow-motion (50%) · real-time · speed-ramp |

**Action direction** is written in plain language: "she turns to camera", "he walks toward the lens", "the car drifts left across frame".

## 2. The IMAX token block (verbatim, every prompt)

```
IMAX-style cinematic scale: large-format digital cinema camera, full-frame sensor look, anamorphic-style widescreen feel adapted to vertical 9:16, smooth gimbal-stabilized camera motion, rich dynamic range, crisp highlight rolloff, premium film-grain finish, no camera shake, no warping, no morphing artifacts.
```

## 3. Lighting (continuity hand-offs)

Write the light state explicitly and carry it across scene boundaries:
- `warm golden-hour side light, long shadows`
- `cold blue practicals + soft key from the left`
- `harsh overhead fluorescent, green monitor glow`
- `rain-glossed street, neon reflections`

**Continuity rule:** if Scene N ends in golden hour, Scene N+1 starts with the SAME warm low light — write it into the context.

## 4. Color grade tokens (ONE per reel, verbatim everywhere)

| Grade | Token |
|---|---|
| Cinematic teal-orange | `Grade: cinematic teal-and-orange, cool shadows, warm skin tones, contrast-rich, 35mm Kodak Vision3 500T film stock, subtle grain.` |
| Warm Kodak / nostalgia | `Grade: warm golden Kodak Portra look, soft highlights, gentle halation, creamy film grain, sun-kissed tones.` |
| Cold sci-fi / tech | `Grade: cold desaturated blue-grey, clean highlights, high contrast, anamorphic flares, clinical precision, fine grain.` |
| Neo-noir | `Grade: deep crushed blacks, moody teal-and-amber, rain-glossed highlights, 1980s film noir, heavy grain.` |
| Editorial / luxury | `Grade: muted earth tones, matte shadows, soft window light, medium-format film look, ultra-fine grain, editorial stillness.` |

## 5. Native audio (Veo 3.1 generates it — write it in the prompt)

- **Dialogue:** exact words in quotes + delivery tone. `Dialogue: he says in a low, tired voice, "We're out of time."`
- **SFX:** labeled. `SFX: heavy rain drumming on a tin roof.`
- **Ambient:** labeled. `Ambient: distant thunder, a kettle hissing.`

**Rule:** label with `Dialogue:` / `SFX:` / `Ambient:` so the model treats them as audio instructions, not visual description.

---

## Negative phrasing (do it contextually, not as a list)

Instead of `no cars, no blur`: `a quiet coastal road entirely free of traffic, rendered in crisp focus.`
Phrase negatives as part of the scene description — abrupt word lists confuse the model.
