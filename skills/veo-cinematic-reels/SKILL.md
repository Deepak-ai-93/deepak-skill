---
name: veo-cinematic-reels
description: Create reel scripts with scene-by-scene video-generation prompts for Google Flow / Veo 3.1 — manual copy-paste workflow, one prompt per scene. Locks character consistency (no face/wardrobe drift) via reference-image ingredients + a verbatim character block in every prompt, IMAX-level cinematic language (large-format camera, lens, motion), great color grading (film stock + palette tokens), native dialogue/SFX audio, and an automated prompt-pack builder that self-verifies every prompt carries the consistency tokens.
---

# skill: veo-cinematic-reels

**Name:** Veo Cinematic Reels — scene scripts + Google Flow video prompts
**Description:** Turns a reel idea into **two deliverables that work together**: a **scene-by-scene script** (hook → beats → payoff, with timings) and a **copy-paste prompt pack for Google Flow / Veo 3.1** — one cinematic video-generation prompt per scene that the user pastes manually, generates, and stitches into a reel. The prompts are engineered so the **character never changes** between scenes: a reference-image ingredient (uploaded once) plus a **verbatim character block** embedded in every single prompt, along with IMAX-scale camera language, a locked color grade, and native dialogue/SFX audio. Built for creators who generate scenes one at a time in Flow's Ingredients→video or text-to-video panel.

---

## The quality bar (non-negotiable — read before anything else)

| Rail | Rule |
|---|---|
| **Character consistency (the #1 rail)** | The same character across every scene. Enforced TWO ways, both mandatory: (1) the user uploads the character **reference-image ingredients** (from the character sheet, § Workflow Stage 2) into Flow's Ingredients panel, AND (2) the **exact same character block text** appears VERBATIM in every scene prompt — never reworded, never trimmed. The script self-verifies this; if a prompt misses a word, regenerate it. |
| **One prompt per scene, copy-paste ready** | Every scene gets ONE complete Veo prompt following the 5-part formula (cinematography + subject + action + context + style), with the consistency tokens appended. No instructions, no meta-commentary inside the prompt — the user copies and pastes it as-is into Google Flow. |
| **IMAX-level cinematic language** | Camera language is explicit and large-format: camera motion (dolly/tracking/crane/push-in/arc), lens + focal length, depth of field, framing (wide/medium/close-up/ECU), and the **IMAX token block** (below) — never vague "cinematic shot". Vertical 9:16 for reels (Veo 3.1 native aspect). |
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
4. **First/last-frame bridging (for seamless cuts).** When scene B must cut cleanly from scene A, generate scene A, export its **last frame**, and feed it as scene B's **start frame** (Flow: Frames→video or start-image). The script flags which scenes need this.
5. **Seed (API only).** If generating via the Gemini API instead of the Flow UI, fix the same `seed` across scenes.

---

## Cinematic language — the IMAX token block

Append to every prompt (after the character block + grade block). One line, verbatim:

```
IMAX-style cinematic scale: large-format digital cinema camera, full-frame sensor look, anamorphic-style widescreen feel adapted to vertical 9:16, smooth gimbal-stabilized camera motion, rich dynamic range, crisp highlight rolloff, premium film-grain finish, no camera shake, no warping, no morphing artifacts.
```

**Camera grammar per scene (pick from the vocabulary, be specific):**

| Element | Vocabulary (pick one, be specific) |
|---|---|
| **Shot size** | extreme close-up · close-up · medium shot · medium-wide · full body · wide establishing · aerial |
| **Camera motion** | slow push-in · dolly-in · tracking shot (follows the subject) · crane up · 180° arc · handheld urgency · static locked-off · orbiting |
| **Lens / optics** | 24mm wide · 35mm · 50mm · 85mm portrait · 100mm macro · anamorphic flare · shallow depth of field · deep focus |
| **Action direction** | "she turns to camera", "he walks toward the lens", "the car drifts left across frame" — write the motion in plain language |
| **Time/tempo** | slow-motion (50% speed) · real-time · speed-ramp |

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
`scene-plan.json` holds the character block, grade token, world block, and one object per scene (action, dialogue, camera, context, sfx, duration, bridge). The script:
1. Assembles **one full Veo prompt per scene** from the 5-part formula: `Cinematography + Subject(character block) + Action + Context + Style(grade + IMAX token + world)` plus native audio lines.
2. **Self-verifies** every prompt contains the FULL character block, the grade token, and the IMAX token (word-level) — prints which scene passes/fails.
3. Flags scenes that should use **first/last-frame bridging** for seamless cuts.
4. Writes `prompts.md` with a header (ingredients to upload, grade, clip length, assembly order) + one `### Scene N` block per scene — **pure copy-paste, no meta-commentary inside the prompt itself**.

### Stage 5 — Generate in Google Flow (manual)
1. Upload the character reference images to the **Ingredients** panel.
2. For each scene: copy the prompt from `prompts.md` → paste → generate at 9:16, 4–8s, 1080p (or 4K upscale). **Do not edit the character block** — paste the whole prompt as written.
3. For bridged scenes, export the previous scene's last frame and set it as the start frame.
4. Regenerate any scene where the face drifts; do NOT fix it by editing the character block mid-run (rewording breaks consistency — regenerate with the identical prompt + same ingredients).

### Stage 6 — Audit + deliver (subagent, before delivery)
Spawn a fresh subagent to check:
1. **Consistency** — every scene prompt contains the verbatim character block + grade token + IMAX token (re-run `scene-prompts.mjs` verify if unsure); character sheet has 2–3 reference-image prompts; bridge flags present.
2. **Prompt quality** — 5-part formula complete per scene; camera language specific (no "cinematic shot" vagueness); one idea per scene.
3. **Reel arc** — hook in scene 1 (0–3s), payoff before the last scene, CTA/loop ending; scene count × duration in the 30–60s target.
4. **Audio** — dialogue in quotes with delivery tone; SFX/ambient labeled; voice consistent per character.
5. **Continuity** — lighting hand-offs written between scenes; no wardrobe/hair state contradictions.
Any FAIL → fix the plan → regenerate → re-audit.

---

## Production checklist

- [ ] Grade + world locked at Stage 1 (ONE grade token reused everywhere)
- [ ] `character-sheet.md`: verbatim character block + world block + 2–3 reference-image prompts (front/¾/full body)
- [ ] User has generated + uploaded the ingredients to Flow (or will, before generating)
- [ ] `scene-script.md`: hook → agitate → payoff → CTA/loop; timings + continuity written between scenes
- [ ] `scene-plan.json` matches the script exactly
- [ ] `prompts.md` from `scene-prompts.mjs` — every prompt self-verified to contain the full character block + grade + IMAX tokens
- [ ] Bridge flags set where seamless cuts are needed (first/last-frame in Flow)
- [ ] Every prompt is pure copy-paste (no meta-commentary inside)
- [ ] Auditor subagent signed off: consistency, prompt quality, reel arc, audio, continuity
- [ ] Delivery: `character-sheet.md` + `scene-script.md` + `prompts.md` + assembly/stitching notes
