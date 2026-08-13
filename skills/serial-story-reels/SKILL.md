---
name: serial-story-reels
description: Create EPISODIC story video series with Google Flow / Veo 3.1 — a story bible (season arc + episode hooks/cliffhangers), character sheets with verbatim blocks (original or user's uploaded reference images → Flow Ingredients), and a self-verified copy-paste Veo prompt pack for every scene of every episode, engineered so the SAME characters stay consistent ACROSS episodes (verbatim character block + grade + cinematic token in every prompt). Cinematic action/motion language (fights, chases, physics), native Veo dialogue/SFX + a Kokoro voiceover line sheet, and genre presets (comic, love story, action, thriller, fantasy).
---

<!-- ════════════════════════════════════════════════════════════════════════
     🎬 deepak-skill — crafted by Deepak · skill: serial-story-reels
     https://github.com/Deepak-ai-93/deepak-skill · MIT license
     ════════════════════════════════════════════════════════════════════════ -->

```
   ██████╗ ███████╗███████╗██████╗  █████╗ ██╗  ██╗
   ██╔══██╗██╔════╝██╔════╝██╔══██╗██╔══██╗██║ ██╔╝
   ██║  ██║█████╗  █████╗  ██████╔╝███████║█████╔╝
   ██║  ██║██╔══╝  ██╔══╝  ██╔══██╗██╔══██║██╔═██╗
   ██████╔╝███████╗███████╗██║  ██║██║  ██║██║  ██╗
   ╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝
```

**🎬 deepak-skill — crafted by Deepak** · skill: `serial-story-reels` · [deepak-skill on GitHub](https://github.com/Deepak-ai-93/deepak-skill) · MIT

# skill: serial-story-reels

**Name:** Serial Story Reels — episodic story video series for Google Flow / Veo 3.1
**Description:** Turns a story idea (comic, love story, action, thriller, fantasy — or the user's own characters via image uploads) into a **serialized video series**: a **`story-bible.md`** (season arc, episode hooks + cliffhangers), **character sheets** (verbatim character blocks + reference-image prompts), per-episode **scene scripts**, and a **copy-paste Veo 3.1 prompt pack** (`prompts.md`) — ONE cinematic prompt per scene, grouped by episode, every prompt carrying the verbatim character blocks + grade token + cinematic token so the cast NEVER drifts between episodes. Plus a **voiceover line sheet** for native Veo audio or a Kokoro post pass. Manual copy-paste workflow (the user generates scene by scene in Flow) — this skill writes the story and the prompts, never the video itself.

---

## The quality bar (non-negotiable — read before anything else)

| Rail | Rule |
|---|---|
| **Cross-episode character consistency (the #1 rail)** | The SAME characters in EVERY episode. Enforced TWO ways, both mandatory: (1) the user uploads **character reference-image Ingredients** (from the character sheet, Stage 3) into Flow's Ingredients panel ONCE and reuses them for every scene of every episode, AND (2) the **exact same character block** appears VERBATIM in every prompt that character appears in — never reworded, never trimmed, across the whole series. `episode-prompts.mjs` self-verifies every prompt word-by-word; a missing word fails the build (exit 1). |
| **Serialized arc, not one-offs** | ≥2 episodes; each episode has a **hook** (3-second open loop) and a **cliffhanger** (end-of-episode loop); episodes chain via continuity (last frame of episode N bridges into episode N+1). `series-arc.mjs` validates this and exits 1 if any episode lacks an arc. |
| **Cinematic, real action** | Every scene prompt carries the **cinematic token** (IMAX-scale camera language) + specific camera motion/lens/framing and physics-accurate action (motion blur, water, impacts). No vague "cinematic shot". Fights/chases are broken into single-moment actions with timestamp pacing where needed. |
| **Voiceover always directed** | Every scene with speech has **dialogue in quotes with delivery tone** (native Veo audio) OR a **VO line with delivery direction** for the Kokoro post pass. The voiceover sheet (`--vo`) lists every line per episode with delivery notes. |
| **One grade, one world, whole series** | ONE grade token (film stock + palette) and ONE world block (overall setting/lighting) chosen at Stage 1 and appended verbatim to EVERY prompt in the series — never two grades, never a world switch. |
| **Copy-paste ready, zero API writes** | Every prompt is pure copy-paste into Flow (no meta-commentary inside). The skill never touches accounts or renders video — the user generates scene by scene in Flow. |
| **Audited before delivery** | Stage 7 is a harness, never a self-check: `audit-series.mjs` runs the automated checks (arc, per-scene tokens, voiceover coverage, cinematic language) → a FRESH series-auditor subagent scores consistency-worthiness (/50, ≥35 = good to go) → fix loop until signed **PASS** in `series-audit.md`. |

---

## Storytelling + addiction rails (this skill is the repo's exemplar — enforce the two serial rails explicitly)

This skill's design IS the universal storytelling + addiction contract every video/image skill in this repo now follows (open loop → rising tension → payoff → loop ending · curiosity gap · serialization · variable reward · pattern interrupt · relatability · commitment bait · the fluff rule — every beat either raises the question, raises the stakes, or pays off). The two rails to enforce explicitly on top of the story bible:

| Serial rail | Rule |
|---|---|
| **Cliffhanger chaining (serialization)** | Every episode ends on an unresolved beat that chains into the next episode — the season arc IS the open loop, episode hooks are the mini-loops. The last episode's cliffhanger teases the next season/part. |
| **Loop ending across episodes** | Episode N's last frame bridges into episode N+1's first frame (already in the consistency system) — the series restarts seamlessly on rewatch, and each episode's final loop ending makes rewatch count as a second view. |

---

## When to use

- "Create a serialized story series with episodes — same characters in every episode"
- "Make me an episodic comic/love/action story with Google Flow video prompts"
- "I have character photos — build a multi-episode story around them"
- "Veo prompts for a love story, 3 episodes, cinematic action and proper voiceover"
- "A web-series-style reel series with cliffhangers and consistent cast"

**Complements:** `veo-cinematic-reels` (single-reel scenes — this skill's serialized sibling; shares the consistency system + 7-layer prompt language) · `photoshoot-studio` (reference-image prompts + grade/craft tokens) · `voice-sfx-audio` (Kokoro VO + SFX + -14 LUFS mix for the post path) · `hook-storyboard-retention` (hook/cliffhanger formulas) · `text-motion-reels` (title cards, episode intros) · `carousel-post-images` (episode announcement cards).

---

## The cross-episode consistency system (read before anything else)

The layered system that holds characters across MANY separate generations:

1. **Character reference images — uploaded ONCE, reused for the whole series.** From the character sheet (Stage 3), generate 2-3 clean reference images per character (front portrait, ¾ angle, full body in signature outfit — Nano Banana Pro / Imagen in Flow, or the user's own uploads). Upload them to Flow's **Ingredients** panel. These anchor facial geometry, hair and wardrobe in EVERY scene of EVERY episode. Reuse the SAME Ingredients for the entire series.
2. **The character block (verbatim in every prompt).** One rigid paragraph per character: name, age, build, face (jaw, eyes, nose), hair (color/style), wardrobe (exact pieces + colors), signature prop. Only the characters in a scene get their block — but those blocks are copy-pasted IDENTICALLY every time.
3. **The grade block + world block + cinematic block (verbatim in every prompt).** Appended to every prompt in the series.
4. **First/last-frame bridging across scenes AND episodes.** Scene B cuts cleanly from scene A by feeding scene A's exported last frame as scene B's start frame (Flow: Frames→video). **Episode N+1's first scene starts from episode N's last frame** — this carries the cast, lighting and world across the episode boundary (the script flags bridged scenes with 🔗).
5. **Voice anchor (for voiceover consistency).** Save the clean dialogue audio from each character's FIRST scene and re-feed it as the voice reference for later episodes (matches Veo's native audio anchoring and Kokoro cloning paths).
6. **Seed (API only).** If generating via the Gemini API instead of the Flow UI, fix the same `seed` for every scene of a character.

---

## Cinematic language — the cinematic token (action + motion)

Append to every prompt (after the character blocks + grade + world). One line, verbatim:

```
Cinematic: IMAX-style cinematic scale, large-format digital cinema camera, full-frame sensor look, anamorphic-style widescreen feel adapted to vertical 9:16, smooth gimbal-stabilized camera motion, rich dynamic range, crisp highlight rolloff, premium film-grain finish, realistic physics and motion blur on fast action, no camera shake, no warping, no morphing artifacts.
```

**Camera grammar per scene (pick from the vocabulary, be specific):**

| Element | Vocabulary (pick one, be specific) |
|---|---|
| **Shot size** | extreme close-up · close-up · medium shot · medium-wide · full body · wide establishing · aerial |
| **Camera motion** | slow push-in · dolly-in · tracking shot (follows the subject) · crane up · 180° arc · handheld urgency · static locked-off · orbiting · whip pan · low-angle tracking |
| **Lens / optics** | 24mm wide · 35mm · 50mm · 85mm portrait · 100mm macro · anamorphic flare · shallow depth of field · deep focus |
| **Action physics** | motion blur on the striking limb · water droplets splashing · fabric snapping · dust kicked up · slow-motion 50% · speed-ramp on impact · realistic weight and gravity |
| **Time/tempo** | real-time · slow-motion · speed-ramp · timestamp pacing (0-2s / 2-4s / 4-6s beats for multi-moment action) |

**Action scenes are broken into SINGLE moments** — one dominant motion per 6s clip ("a spinning roundhouse kick that connects", "a leap across the alley gap"), never "a fight happens". For multi-beat sequences (a chase), use timestamp pacing inside one prompt or split into bridged clips.

---

## Color grading — the grade token block

Pick ONE grade at Stage 1 (see `templates/genre-presets.md` for the full set) and reuse the exact token in every prompt:

| Grade | Token block |
|---|---|
| **Neon-noir romantic** (love story) | `Grade: neon-noir romantic, deep teal shadows, warm magenta-neon highlights on skin, soft halation, anamorphic flares, cinematic 35mm film grain, dreamy contrast.` |
| **Comic pop** (comic story) | `Grade: vivid comic-pop palette, saturated primaries, bold inky outlines, halftone shading accents, clean highlights, punchy contrast, slight cel-shaded feel.` |
| **Gritty action** | `Grade: gritty action look, desaturated steel-blue shadows, warm tungsten highlights, hard contrast, rain-glossed surfaces, heavy grain, handheld energy.` |
| **Cold thriller** | `Grade: cold desaturated blue-grey thriller grade, crushed blacks, sickly green monitor glow, clinical highlights, fine grain, oppressive contrast.` |
| **Epic fantasy** | `Grade: epic fantasy grade, rich amber-gold highlights, cool misty shadows, volumetric light, medium-format film look, ultra-fine grain.` |

---

## Workflow (7 stages)

### Stage 1 — Interview the story (≤3 questions) + lock genre
Extract: **story idea** (logline) · **genre** (comic / love story / action / thriller / fantasy — from `templates/genre-presets.md`) · **characters** (original, or the user's uploaded reference images) · **episodes** (default 3) · **scenes per episode** (default 4) · **aspect** (default 9:16) · **tone**. Ask ≤3 questions if vague (never guess silently). Lock ONE grade token + ONE world from the genre preset.

### Stage 2 — Write the story bible → `story-bible.md` (automated)
Build `series-plan.json` (title, genre, logline, grade, cinematic, world, characters, episodes with hook + cliffhanger + scenes) and validate + generate the bible:
```bash
node scripts/series-arc.mjs --plan series-plan.json --bible story-bible.md
```
`series-arc.mjs` **validates the serialized arc** (≥2 episodes · every episode has a hook + cliffhanger + scenes · every scene's characters are defined · grade/cinematic/world locked) and exits 1 on any FAIL. It writes the `story-bible.md` with the season arc, per-episode hooks/cliffhangers, and the locked tokens.

### Stage 3 — Write the character sheets → `character-sheet.md`
One verbatim **character block** per character (grammar in `templates/character-block.md`) + 2-3 reference-image prompts (front/¾/full body). If the user uploaded reference images, use them as the Ingredients directly (the blocks still describe the SAME person so text anchors match the images). Save with a note: upload these to Flow's Ingredients ONCE, reuse for the whole series.

### Stage 4 — Build the prompt pack → `prompts.md` (automated, self-verified)
```bash
node scripts/episode-prompts.mjs --plan series-plan.json --out prompts.md --vo voiceover.md
```
The script assembles **one full Veo prompt per scene**, grouped by episode (with hook + cliffhanger headers), each carrying: camera → the VERBATIM character blocks of the scene's characters → action → context → grade + cinematic + world tokens → native dialogue/SFX. It **self-verifies** every prompt word-by-word (character blocks + grade + cinematic) — prints per-scene ✅/❌, exits 1 on drift. It also writes **`voiceover.md`** (every line per episode with delivery direction).

### Stage 5 — Generate in Google Flow (manual)
1. Upload the character reference images to the **Ingredients** panel (ONCE).
2. For each scene: copy the prompt from `prompts.md` → paste → generate at 9:16, 6s, 1080p. **Do not edit the character blocks.**
3. Bridged scenes (🔗): export the previous scene's last frame → set as start frame.
4. Episode N+1: start from episode N's last frame.
5. Regenerate any scene where a face drifts — do NOT fix it by editing the character block (rewording breaks consistency); regenerate with the identical prompt + same Ingredients.
6. Voiceover: either keep Veo's native dialogue (already in the prompts) or run the `voiceover.md` lines through `voice-sfx-audio` (Kokoro) and mix to -14 LUFS.

### Stage 6 — Approval gate
Show the user: **story bible + prompt pack + voiceover sheet**. They say **approve / edit / reject**. Edits go back to the affected stage (bible, character sheet, or plan) and re-run the scripts.

### Stage 7 — Audit + deliver (harness: script → subagent → fix loop)
**7a. Run the automated harness** — it scans the whole pack and checks everything a script can check:
```bash
node scripts/audit-series.mjs --pack <series-folder> --out series-audit.md
```
The script checks: **arc re-validation** (≥2 episodes · hooks + cliffhangers · characters defined · tokens locked) · **per-scene token consistency** (every scene prompt still carries the VERBATIM character blocks + grade + cinematic + world tokens — word-level, catching hand-edits that drifted) · **self-verify + bridge markers** (✅/❌ counts, 🔗 vs planned bridges) · **cinematic-action language** (no vague "cinematic shot") · **voiceover coverage** (every speaking scene has a line + voice-anchor note) · **character sheet** (reference-image prompts + upload note + anti-drift rules) · **story bible** (locked tokens + episode titles). Writes `series-audit.md` with automated verdicts + an AUDITOR section. **Exit 0 = clean, 1 = FAIL (fix + re-run), 2 = usage.**

**7b. Spawn the series-auditor subagent** — a FRESH subagent (never self-audit) with the exact brief from `templates/series-auditor-brief.md`: reads `series-audit.md` + all pack files, completes the **consistency-worthiness scorecard** (10 criteria, /50 — **≥ 35 = good to go**, with verdict bands), makes the creative judgment calls the script can't (hook/cliffhanger pull, render-risk prompts, voiceover tone, continuity jumps), and signs **PASS / FIX NEEDED** with per-file fixes.

**7c. Fix loop** — any FAIL or real WARN → fix the file → re-run `audit-series.mjs` (and `series-arc.mjs` / `episode-prompts.mjs` if the plan changed) → re-submit to a fresh auditor → loop until **PASS**. Only then deliver.

---

## Production checklist

- [ ] Story interviewed; genre preset locked (ONE grade token + world chosen)
- [ ] `series-plan.json`: title, logline, genre, grade, cinematic, world, characters, episodes (hook + cliffhanger + scenes)
- [ ] `series-arc.mjs` ran clean: ≥2 episodes, hooks + cliffhangers present, characters defined (exit 0)
- [ ] `story-bible.md` written: season arc + locked tokens + cast blocks
- [ ] `character-sheet.md`: verbatim character blocks + 2-3 reference-image prompts per character (or user uploads noted)
- [ ] User has generated + uploaded the Ingredients to Flow (or will, before generating)
- [ ] `episode-prompts.mjs` ran: every prompt self-verified (character blocks + grade + cinematic), exit 0
- [ ] `prompts.md`: one copy-paste Veo prompt per scene, grouped by episode, pure prompts (no meta-commentary)
- [ ] `voiceover.md`: every speaking scene has a line + delivery direction; voice-anchor note present
- [ ] Approval gate: user approved bible + prompt pack + voiceover before delivery
- [ ] Serial rails held: every episode ends on a cliffhanger chaining into the next; episode N's last frame bridges into episode N+1 (serialization + loop ending)
- [ ] `audit-series.mjs` ran clean (exit 0): arc re-validated, per-scene tokens verified, voiceover coverage, cinematic language, sheet + bible present
- [ ] Fresh **series-auditor subagent** completed the scorecard (/50, ≥35) + verdict in `series-audit.md` → **PASS** (fix loop until then)
- [ ] Delivery: `story-bible.md` + `character-sheet.md` + `prompts.md` + `voiceover.md` + `series-audit.md` + continuity/assembly notes
