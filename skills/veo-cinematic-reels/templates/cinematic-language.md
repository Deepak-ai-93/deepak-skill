# Cinematic Language — rich long-form prompt vocabulary

The 7-part formula for every scene prompt (works in any video generator):
`Cinematography + Lens + Tempo + Subject + Action + Context/Lighting + Style & Ambiance` (+ native audio lines + negative prompt + seed).

Each scene prompt should read **~150–250 words** — the locked tokens (character + grade + IMAX + world) alone run ~140 words, so the scene-specific detail (shot size, camera motion, lens, tempo, lighting state, action, context, audio) sits on top. Never write vague "cinematic shot" — be specific. Pick ONE term per element per scene.

---

## 1. Camera (framing + motion + lens)

| Element | Pick one, be specific |
|---|---|
| **Shot size** | extreme close-up · close-up · medium shot · medium-wide · full body · wide establishing · aerial |
| **Camera motion** | slow push-in · dolly-in · tracking shot (follows subject) · crane up · 180° arc · orbiting · handheld urgency · locked-off static · whip pan |
| **Lens / optics** | 24mm wide · 35mm · 50mm · 85mm portrait · 100mm macro · anamorphic flare · shallow depth of field · deep focus |
| **Tempo** | slow-motion (50%) · real-time · speed-ramp |

**Action direction** is written in plain language: "she turns to camera", "he walks toward the lens", "the car drifts left across frame".

**Lens + tempo + lighting go INSIDE the prompt** (the builder weaves them in when the plan provides them):
- Lens: `85mm portrait lens, shallow depth of field` · `24mm wide lens, deep focus`
- Tempo: `Tempo: slow-motion (50% speed)` · `Tempo: real-time` · `Tempo: speed-ramp`
- Lighting: `Lighting: warm golden-hour side light, long shadows` (carry it across scene boundaries)

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

## 6. Negative prompt + seed (appended per scene)

Every scene block ends with a labeled `Negative prompt:` line and — when a seed is locked — a `Seed:` line:

```
Negative prompt: no warping, no morphing, no extra limbs, no extra fingers, no distorted faces, no flickering, no watermark, no text overlay, no logo, no camera shake, no jitter, no motion blur, no low resolution, no compression artifacts.
Seed: 482913
```

- **Tools with a negative field** (Kling, Luma, Hailuo, Vidu, Pika, Runway): paste the `Negative prompt:` line into that field verbatim.
- **Prompt-only tools** (Flow/Veo): leave the line in the prompt — it reads as harmless plain text.
- **Seed:** reuse the same seed across every scene for identical priors (API tools only; UI tools ignore it).

## Negative phrasing inside the scene (contextual, not just the list)

In addition to the labeled negative prompt, phrase key negatives inside the scene description: instead of `no cars, no blur`, write `a quiet coastal road entirely free of traffic, rendered in crisp focus.` Abrupt word lists confuse the model.
