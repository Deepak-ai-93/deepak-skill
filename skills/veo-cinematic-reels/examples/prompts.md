# Veo Prompt Pack — "The Last Courier — cinematic action reel"

**Any video generator:** Google Flow / Veo 3.1 · Kling · Luma · Runway · Hailuo · Vidu · Pika · PixVerse · **Aspect:** 9:16 vertical · **Clip:** 6s per scene · 4 scenes · ~24s reel

## Before you start (do ONCE)
1. **Upload these reference images to your tool's character-reference panel** (reuse for every scene):
   - kai-front-portrait.png  ← primary character anchor
   - kai-three-quarter.png
   - kai-full-body.png
   - Flow/Veo → **Ingredients** panel · Kling → **Elements** (tag `<<<element_1>>>` in each prompt) · Runway/Luma → **image-to-video** from the reference image
2. **Never edit the character block** — it is identical in every prompt below. Rewording breaks consistency.
3. **Grade locked:** Grade: cinematic teal-and-orange, cool shadows, warm skin tones, contrast-rich, 35mm Kodak Vision3 500T film stock, subtle grain.
4. **Negative prompt:** every scene block ends with a labeled `Negative prompt:` line. If your tool has a dedicated negative field (Kling, Luma, Hailuo, Vidu, Pika, Runway), paste that line into it verbatim. Prompt-only tools (Flow/Veo) ignore it as plain text.
5. **Seed locked:** 482913 — reuse the same seed across every scene. Tools with a seed setting (Kling, Luma, Hailuo, Vidu, Runway) take it there; API tools take it in the request; UI-only tools ignore it.
6. Generate at **9:16, 6s, 1080p** (4K upscale after). For bridged scenes (marked 🔗), export the previous scene's **last frame** and set it as the start frame (Flow: Frames→video · Kling: start-frame · Runway/Luma: first-frame image).

---

### Scene 1 — hook
**Time:** 0s–6s · **6s clip** · **223 words** · **verify:** ✅

```
Extreme close-up on the glowing cyan circuit strip, slow push-in. 100mm macro lens, shallow depth of field. Tempo: real-time. Character: Kai, a 28-year-old elite courier, athletic build with a chiseled jaw and intense dark eyes, short black hair, wearing a matte black tactical jacket with a glowing cyan circuit strip on the chest, black cargo pants, a silver data-drive on a lanyard around his neck. Distinctive detail: a thin cyan scar along his right cheek. Kai's chest breathes fast; his hand reaches for the silver data-drive on the lanyard. Alley at night, rain dripping off a neon sign overhead, cyan light pulsing on his jacket. Lighting: cool cyan key light from the neon sign above, rain-glazed highlights on the jacket. Grade: cinematic teal-and-orange, cool shadows, warm skin tones, contrast-rich, 35mm Kodak Vision3 500T film stock, subtle grain. IMAX-style cinematic scale: large-format digital cinema camera, full-frame sensor look, anamorphic-style widescreen feel adapted to vertical 9:16, smooth gimbal-stabilized camera motion, rich dynamic range, crisp highlight rolloff, premium film-grain finish, no camera shake, no warping, no morphing artifacts. World: a rain-soaked night in a near-future megacity, neon reflections on wet asphalt, perpetual low cloud, amber streetlight pools, distant sirens. Dialogue: He whispers, tense and urgent, "Sixty seconds. Don't fail me.". SFX: heavy rain on metal, a low electronic hum from the circuit strip. Ambient: distant sirens.

Negative prompt: no warping, no morphing, no extra limbs, no extra fingers, no distorted faces, no flickering, no watermark, no text overlay, no logo, no camera shake, no jitter, no motion blur, no low resolution, no compression artifacts.
Seed: 482913
```

---

### Scene 2 — agitate
**Time:** 6s–12s · **6s clip** · **219 words** · **verify:** ✅

```
Medium tracking shot following Kai as he sprints left across frame. 35mm lens, deep focus. Tempo: real-time. Character: Kai, a 28-year-old elite courier, athletic build with a chiseled jaw and intense dark eyes, short black hair, wearing a matte black tactical jacket with a glowing cyan circuit strip on the chest, black cargo pants, a silver data-drive on a lanyard around his neck. Distinctive detail: a thin cyan scar along his right cheek. Kai sprints through the rain, boots slapping wet asphalt, glancing back over his shoulder. Narrow alley between glowing billboards, rain streaks through the light beams, same cyan strip glowing. Lighting: mixed neon practicals — cyan strip on his chest, amber billboard glow raking across wet asphalt. Grade: cinematic teal-and-orange, cool shadows, warm skin tones, contrast-rich, 35mm Kodak Vision3 500T film stock, subtle grain. IMAX-style cinematic scale: large-format digital cinema camera, full-frame sensor look, anamorphic-style widescreen feel adapted to vertical 9:16, smooth gimbal-stabilized camera motion, rich dynamic range, crisp highlight rolloff, premium film-grain finish, no camera shake, no warping, no morphing artifacts. World: a rain-soaked night in a near-future megacity, neon reflections on wet asphalt, perpetual low cloud, amber streetlight pools, distant sirens. Dialogue: He mutters under his breath, "They found the building.". SFX: rapid footsteps splashing, rain hissing, a distant metallic clang. Ambient: city night hum.

Negative prompt: no warping, no morphing, no extra limbs, no extra fingers, no distorted faces, no flickering, no watermark, no text overlay, no logo, no camera shake, no jitter, no motion blur, no low resolution, no compression artifacts.
Seed: 482913
```

---

### Scene 3 — payoff  🔗 (bridge: start from scene 2's last frame)
**Time:** 12s–18s · **6s clip** · **237 words** · **verify:** ✅

```
Slow-motion 180-degree arc around Kai as he slides under a closing shutter door. 50mm lens, shallow depth of field. Tempo: slow-motion (50% speed). Character: Kai, a 28-year-old elite courier, athletic build with a chiseled jaw and intense dark eyes, short black hair, wearing a matte black tactical jacket with a glowing cyan circuit strip on the chest, black cargo pants, a silver data-drive on a lanyard around his neck. Distinctive detail: a thin cyan scar along his right cheek. Kai drops to a slide, the data-drive swinging on its lanyard, cyan scar catching the light as he looks up. Industrial shutter door closing behind him, orange sparks from a sparking junction box, rain still visible behind. Lighting: harsh orange spill from the sparking junction box, the only warm contrast to the locked teal-orange grade. Grade: cinematic teal-and-orange, cool shadows, warm skin tones, contrast-rich, 35mm Kodak Vision3 500T film stock, subtle grain. IMAX-style cinematic scale: large-format digital cinema camera, full-frame sensor look, anamorphic-style widescreen feel adapted to vertical 9:16, smooth gimbal-stabilized camera motion, rich dynamic range, crisp highlight rolloff, premium film-grain finish, no camera shake, no warping, no morphing artifacts. World: a rain-soaked night in a near-future megacity, neon reflections on wet asphalt, perpetual low cloud, amber streetlight pools, distant sirens. Dialogue: He shouts over the alarm, "Kai out. Data secure.". SFX: grinding shutter door, an alarm klaxon, his fast breathing. Ambient: rain fading as the door closes.

Negative prompt: no warping, no morphing, no extra limbs, no extra fingers, no distorted faces, no flickering, no watermark, no text overlay, no logo, no camera shake, no jitter, no motion blur, no low resolution, no compression artifacts.
Seed: 482913
```

---

### Scene 4 — cta-loop
**Time:** 18s–24s · **6s clip** · **232 words** · **verify:** ✅

```
Wide establishing shot, slow crane up from street level. 24mm wide lens, deep focus. Tempo: real-time. Character: Kai, a 28-year-old elite courier, athletic build with a chiseled jaw and intense dark eyes, short black hair, wearing a matte black tactical jacket with a glowing cyan circuit strip on the chest, black cargo pants, a silver data-drive on a lanyard around his neck. Distinctive detail: a thin cyan scar along his right cheek. Kai stands catching his breath, steam rising from his jacket in the cold rain, then turns to camera with a determined look. Rain-soaked street corner, neon signs reflecting in puddles, the cyan circuit strip dimming as he walks into the glow. Lighting: soft cyan-and-amber city glow returning as the sparks die out, steam rising through the light beams. Grade: cinematic teal-and-orange, cool shadows, warm skin tones, contrast-rich, 35mm Kodak Vision3 500T film stock, subtle grain. IMAX-style cinematic scale: large-format digital cinema camera, full-frame sensor look, anamorphic-style widescreen feel adapted to vertical 9:16, smooth gimbal-stabilized camera motion, rich dynamic range, crisp highlight rolloff, premium film-grain finish, no camera shake, no warping, no morphing artifacts. World: a rain-soaked night in a near-future megacity, neon reflections on wet asphalt, perpetual low cloud, amber streetlight pools, distant sirens. Dialogue: He says, calm now, "The city never stops. Neither do I.". SFX: rain steady, footsteps walking away, a single low electronic beat. Ambient: distant traffic.

Negative prompt: no warping, no morphing, no extra limbs, no extra fingers, no distorted faces, no flickering, no watermark, no text overlay, no logo, no camera shake, no jitter, no motion blur, no low resolution, no compression artifacts.
Seed: 482913
```

---

## Assembly order (in your editor)
1. Scene 1 — hook
2. Scene 2 — agitate
3. Scene 3 — payoff (start frame = scene 2 last frame)
4. Scene 4 — cta-loop

Post: cut to beats, add on-screen text/captions, mix to -14 LUFS.