---
name: veo-cinematic-reels
description: Create reel scripts with scene-by-scene video-generation prompts for ANY modern video generator (Google Flow / Veo 3.1, Kling, Luma, Runway, Hailuo, Vidu, Pika, PixVerse) — manual copy-paste workflow, one rich long-form prompt per scene. Locks character consistency (no face/wardrobe drift) via reference-image ingredients + a verbatim character block in every prompt, IMAX-level cinematic language (large-format camera, lens, motion, tempo), great color grading (film stock + palette tokens), native dialogue/SFX audio, plus a labeled negative prompt and locked seed per scene — and an automated prompt-pack builder that self-verifies every prompt carries the consistency tokens.
---

# skill: veo-cinematic-reels

**Name:** Veo Cinematic Reels — scene scripts + copy-paste prompts for any video generator
**Description:** Turns a reel idea into **two deliverables that work together**: a **scene-by-scene script** (hook → beats → payoff, with timings) and a **rich, long-form copy-paste prompt pack** (~150–250 words per scene) that works in **any modern video generator** — Google Flow / Veo 3.1, Kling, Luma, Runway, Hailuo, Vidu, Pika, PixVerse. One complete video-generation prompt per scene that the user pastes manually, generates, and stitches into a reel. The prompts are engineered so the **character never changes** between scenes: a reference-image ingredient (uploaded once per tool) plus a **verbatim character block** embedded in every single prompt, along with IMAX-scale camera language, per-scene lens/tempo/lighting detail, a locked color grade, native dialogue/SFX audio, a labeled **negative prompt**, and a **locked seed**. Built for creators who generate scenes one at a time in their tool of choice.

---

## The quality bar (non-negotiable — read before anything else)

| Rail | Rule |
|---|---|
| **Character consistency (the #1 rail)** | The same character across every scene. Enforced TWO ways, both mandatory: (1) the user uploads the character **reference-image ingredients** (from the character sheet, § Workflow Stage 2) into Flow's Ingredients panel, AND (2) the **exact same character block text** appears VERBATIM in every scene prompt — never reworded, never trimmed. The script self-verifies this; if a prompt misses a word, regenerate it. |
| **One prompt per scene, copy-paste ready** | Every scene gets ONE complete prompt following the **7-part formula** (cinematography + lens + tempo + subject + action + context/lighting + style), with the consistency tokens appended. No instructions, no meta-commentary inside the prompt — the user copies and pastes it as-is into their video generator. |
| **Rich long-form prompts (~150–250 words)** | Each scene prompt is written full-length and cinematic: shot size, camera motion, lens + focal length, tempo (slow-motion / real-time / speed-ramp), explicit lighting state, action in plain motion language, native audio lines. The locked tokens (character + grade + IMAX + world) alone run ~140 words — the builder prints the total per scene so an under-specified scene is obvious. |
| **Tool-agnostic** | The same prompt pastes into Google Flow / Veo 3.1, Kling, Luma, Runway, Hailuo, Vidu, Pika and PixVerse. Reference-image mechanics differ per tool — the pack's header tells the user exactly where to upload for their tool (Ingredients / Elements / image-to-video), and every scene block ends with a labeled **`Negative prompt:`** line (Kling/Luma/Hailuo/Vidu/Pika/Runway have dedicated negative fields; prompt-only tools ignore it) plus a **`Seed:`** line when a seed is locked. |
| **IMAX-level cinematic language** | Camera language is explicit and large-format: camera motion (dolly/tracking/crane/push-in/arc), lens + focal length, depth of field, framing (wide/medium/close-up/ECU), and the **IMAX token block** (below) — never vague "cinematic shot". Vertical 9:16 for reels (native on every tool listed). |
| **Color grading locked per reel** | ONE grade token block (film stock + palette + contrast/grain) chosen at the start and appended verbatim to every prompt — teal-and-orange, warm Kodak, cold sci-fi, etc. Never two grades in one reel. |
| **Native audio in the prompt** | Veo 3.1 generates dialogue + SFX natively. Dialogue is written inside quotes, SFX/ambience labeled `SFX:`/`Ambient:` in the prompt, and delivery (tone/pace) specified — so the voice and sound design come out of the generation, not post. |
| **Scenes stitch into a reel** | 5–9 scenes, each 4–8s (Veo clip lengths), total 30–60s. Scenes follow the retention arc: hook (0–3s) → agitate → payoff → CTA/loop. Lighting and location continuity are written across scene boundaries (Scene N ends golden-hour → Scene N+1 starts with the same warm low light). |

---

## When to use

- "Make a reel script with scenes and Google Flow video prompts"
- "Veo prompts for a reel — character must stay the same in every scene"
- "Cinematic action reel, IMAX look, great color grading"
- "I generate scenes one at a time in Google Flow — give me prompts I can paste"

**Complements:** `hook-storyboard-retention` (hook formulas + retention arc — this skill's Stage 1 uses them) · `video-asset-reels` (post-production: cut the generated clips to beats, add text) · `voice-sfx-audio` (if you'd rather add voiceover/SFX in post instead of Veo's native audio) · `carousel-post-images` (a companion carousel from the same character).

---

## The consistency system (read before anything else)

Veo generates each clip independently — **prompt drift = face drift**. This skill uses the layered system that actually holds in Flow:

1. **Reference-image ingredients (uploaded once).** From the character sheet (Stage 2), generate **2–3 clean reference images** (front portrait, ¾ angle, full body in the signature outfit — use Nano Banana Pro / Imagen in Flow or your CLI's image tool). Upload them into Flow's **Ingredients** panel. They anchor facial geometry, hair and wardrobe across all scenes. Reuse the SAME ingredients for every scene.
2. **The character block (verbatim in every prompt).** One rigid paragraph: name, age, build, face (jaw, eyes, nose), hair (color/style), wardrobe (exact pieces + colors), signature prop. This block is **copy-pasted identically** into every scene prompt — only action/camera/context change.
3. **The grade block + world block (verbatim in every prompt).** One grade token (film stock/palette/grain) and one world token (overall setting/lighting) appended to every prompt.
4. **First/last-frame bridging (for seamless cuts).** When scene B must cut cleanly from scene A, generate scene A, export its **last frame**, and feed it as scene B's **start frame** (Flow: Frames→video or start-image; Kling: start-frame; Runway/Luma: first-frame image). The script flags which scenes need this.
5. **Seed (API only).** If generating via an API (Gemini, Kling, Luma, Hailuo, Vidu), fix the same `seed` across scenes — the builder appends a `Seed:` line to every scene block when `plan.seed` is set. UI-only tools ignore it.
6. **Negative prompt (per tool).** Every scene block ends with a labeled `Negative prompt:` line. Tools with a dedicated negative field (Kling, Luma, Hailuo, Vidu, Pika, Runway) take it verbatim; prompt-only tools (Flow/Veo) read it as harmless plain text.

---

## Cinematic language — the IMAX token block

Append to every prompt (after the character block + grade block). One line, verbatim:

```
IMAX-style cinematic scale: large-format digital cinema camera, full-frame sensor look, anamorphic-style widescreen feel adapted to vertical 9:16, smooth gimbal-stabilized camera motion, rich dynamic range, crisp highlight rolloff, premium film-grain finish, no camera shake, no warping, no morphing artifacts.
```

**Camera grammar per scene (pick from the vocabulary, be specific — the builder weaves lens + tempo + lighting into each prompt):**

| Element | Vocabulary (pick one, be specific) |
|---|---|
| **Shot size** | extreme close-up · close-up · medium shot · medium-wide · full body · wide establishing · aerial |
| **Camera motion** | slow push-in · dolly-in · tracking shot (follows the subject) · crane up · 180° arc · handheld urgency · static locked-off · orbiting |
| **Lens / optics** | 24mm wide · 35mm · 50mm · 85mm portrait · 100mm macro · anamorphic flare · shallow depth of field · deep focus |
| **Tempo** | slow-motion (50% speed) · real-time · speed-ramp |
| **Lighting hand-off** | warm golden-hour side light · cold blue practicals + soft key from the left · harsh overhead fluorescent + green monitor glow · rain-glossed street, neon reflections — write the light state explicitly and carry it across scene boundaries |
| **Action direction** | "she turns to camera", "he walks toward the lens", "the car drifts left across frame" — write the motion in plain language |

---

## Color grading — the grade token block

Pick ONE grade at Stage 1 and reuse the exact token in every prompt:

| Grade | Token block |
|---|---|
| **Cinematic teal-orange** | `Grade: cinematic teal-and-orange, cool shadows, warm skin tones, contrast-rich, 35mm Kodak Vision3 500T film stock, subtle grain.` |
| **Warm Kodak / nostalgia** | `Grade: warm golden Kodak Portra look, soft highlights, gentle halation, creamy film grain, sun-kissed tones.` |
| **Cold sci-fi / tech** | `Grade: cold desaturated blue-grey, clean highlights, high contrast, anamorphic flares, clinical precision, fine grain.` |
| **Neo-noir** | `Grade: deep crushed blacks, moody teal-and-amber, rain-glossed highlights, 1980s film noir, heavy grain.` |
| **Editorial / luxury** | `Grade: muted earth tones, matte shadows, soft window light, medium-format film look, ultra-fine grain, editorial stillness.` |

---

## Workflow (6 stages)

### Stage 1 — Analyze + plan the reel
Extract: **topic/hook** (ask ≤3 questions if vague — use `hook-storyboard-retention` formulas) · **audience** · **duration** (default 8 scenes × 6s = 48s) · **tone** (action / emotional / comedy / luxury) · **the character** (who it is: original or based on the user's existing reference images) · **grade choice** (from the table; default cinematic teal-orange). Lock ONE grade and ONE world (setting + overall lighting).

### Stage 2 — Write the character sheet → `character-sheet.md`
A complete character spec + reference-image prompts:
- **Character block** (the verbatim paragraph that goes in EVERY prompt — § Consistency system #2).
- **World block** (verbatim — the overall setting/lighting).
- **2–3 reference-image prompts** for Nano Banana Pro / Imagen: front portrait (neutral), ¾ angle, full body in signature outfit — same character block, clean background, consistent lighting. The user generates these, uploads them to Flow's **Ingredients**, and reuses them for every scene.
- A note: what NOT to change between scenes (hair, outfit pieces, prop).

### Stage 3 — Write the scene script → `scene-script.md`
The retention arc (from `hook-storyboard-retention`): **hook (0–3s) → agitate/setup → payoff/value → CTA/loop**. Each scene row: `# / time / duration / beat / action / dialogue or VO / camera / context-lighting / SFX`. Continuity is written explicitly across boundaries (lighting hand-offs, location logic, wardrobe state).

### Stage 4 — Build the prompt pack → `prompts.md` (automated)
```bash
node scripts/scene-prompts.mjs --plan scene-plan.json --out prompts.md
```
`scene-plan.json` holds the character block, grade token, world block, and one object per scene (action, dialogue, camera, context, sfx, duration, bridge — plus optional lens, tempo, lighting, negative). The script:
1. Assembles **one rich, long-form Veo prompt per scene** (~150–250 words) from the 7-part formula: `Cinematography + Lens + Tempo + Subject(character block) + Action + Context/Lighting + Style(grade + IMAX token + world)` plus native audio lines.
2. **Self-verifies** every prompt contains the FULL character block, the grade token, the IMAX token and the world token (word-level) — prints which scene passes/fails, and the word count per scene.
3. Flags scenes that should use **first/last-frame bridging** for seamless cuts.
4. Appends a labeled **`Negative prompt:`** line (per-scene override via `scene.negative`, else the plan default) and a **`Seed:`** line when `plan.seed` is set.
5. Writes `prompts.md` with a header (per-tool ingredient upload instructions, grade, negative, seed, clip length, assembly order) + one `### Scene N` block per scene — **pure copy-paste, no meta-commentary inside the prompt itself**.

### Stage 5 — Generate in your tool (manual)
1. Upload the character reference images per your tool: **Flow/Veo → Ingredients** · **Kling → Elements** (tag `<<<element_1>>>` in each prompt) · **Runway/Luma → image-to-video** from the reference image.
2. For each scene: copy the whole prompt block from `prompts.md` (main prompt + `Negative prompt:` + `Seed:`) → paste → generate at 9:16, 4–8s, 1080p (or 4K upscale). If your tool has a dedicated negative-prompt field, paste the `Negative prompt:` line into it instead. **Do not edit the character block** — paste the whole prompt as written.
3. For bridged scenes, export the previous scene's last frame and set it as the start frame (Flow: Frames→video · Kling: start-frame · Runway/Luma: first-frame).
4. Regenerate any scene where the face drifts; do NOT fix it by editing the character block mid-run (rewording breaks consistency — regenerate with the identical prompt + same reference images).

### Stage 6 — Audit + deliver (subagent, before delivery)
Spawn a fresh subagent to check:
1. **Consistency** — every scene prompt contains the verbatim character block + grade token + IMAX token + world token (re-run `scene-prompts.mjs` verify if unsure); character sheet has 2–3 reference-image prompts; bridge flags present.
2. **Prompt quality** — 7-part formula complete per scene; camera language specific (no "cinematic shot" vagueness); lens + tempo + lighting present; ~150–250 words per scene; one idea per scene.
3. **Reel arc** — hook in scene 1 (0–3s), payoff before the last scene, CTA/loop ending; scene count × duration in the 30–60s target.
4. **Audio** — dialogue in quotes with delivery tone; SFX/ambient labeled; voice consistent per character.
5. **Continuity** — lighting hand-offs written between scenes; no wardrobe/hair state contradictions.
6. **Safety nets** — negative prompt present per scene; seed locked across scenes (when API); tool header instructions match the user's generator.
Any FAIL → fix the plan → regenerate → re-audit.

---

## Porting to any video generator

Same prompts, different reference mechanics — the pack header already tells the user where to upload per tool:

| Tool | Reference images | Negative prompt | Seed | Notes |
|---|---|---|---|---|
| **Google Flow / Veo 3.1** | **Ingredients** panel (reuse for every scene) · bridged cuts via Frames→video | No field — line reads as harmless text | API only | Native dialogue/SFX; 9:16 native |
| **Kling AI** | **Elements** — upload 1–4 refs, tag `<<<element_1>>>` in the prompt | ✅ dedicated field | ✅ advanced settings | Strongest motion physics |
| **Luma Dream Machine** | image-to-video from the reference image | ✅ dedicated field | ✅ | Fast b-roll + atmospheric looks |
| **Runway Gen-4/4.5** | image-to-video from the reference image | ✅ (in prompt) | ✅ | Camera controls + inpainting |
| **Hailuo / MiniMax** | image + text prompt | ✅ dedicated field | ✅ | Budget-friendly testing |
| **Vidu** | reference-to-video from a master image | ✅ dedicated field | ✅ | Fast low-cost iteration |
| **Pika 2.5** | image + prompt, Modify Region for fixes | ✅ dedicated field | ❌ | Short-form social |
| **PixVerse V6** | image reference + prompt | ✅ dedicated field | ✅ | 1080p, multi-shot scenes |

If the user's tool isn't listed: same prompt, upload 2–3 clean reference images however that tool accepts them, keep every prompt's character block untouched.

---

## Production checklist

- [ ] Grade + world locked at Stage 1 (ONE grade token reused everywhere)
- [ ] `character-sheet.md`: verbatim character block + world block + 2–3 reference-image prompts (front/¾/full body)
- [ ] User has generated + uploaded the ingredients to Flow (or will, before generating)
- [ ] `scene-script.md`: hook → agitate → payoff → CTA/loop; timings + continuity written between scenes
- [ ] `scene-plan.json` matches the script exactly
- [ ] `prompts.md` from `scene-prompts.mjs` — every prompt self-verified to contain the full character block + grade + IMAX + world tokens
- [ ] Every scene prompt is ~150–250 words with lens + tempo + lighting woven in (word count printed per scene)
- [ ] Negative prompt present per scene; seed locked across scenes (when API)
- [ ] Header tells the user exactly where to upload reference images for THEIR tool (Ingredients / Elements / image-to-video)
- [ ] Bridge flags set where seamless cuts are needed (first/last-frame in Flow)
- [ ] Every prompt is pure copy-paste (no meta-commentary inside)
- [ ] Auditor subagent signed off: consistency, prompt quality, reel arc, audio, continuity
- [ ] Delivery: `character-sheet.md` + `scene-script.md` + `prompts.md` + assembly/stitching notes
