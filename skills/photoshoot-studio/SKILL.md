---
name: photoshoot-studio
description: Create professional photoshoot prompt packs for AI image tools (Google Flow / Nano Banana, Midjourney, Flux) — person photoshoots AND product photoshoots. Manual copy-paste workflow: one fully-engineered image-generation prompt per shot. Locks subject consistency (the same person or the same product across every shot) via reference-image ingredients + a verbatim subject block in every prompt, professional photography language (camera body, lens, f-stop, lighting setup, film stock), locked color grading per shoot, and an automated prompt-pack builder that self-verifies every prompt carries the consistency tokens. Includes localized edit/inpaint prompts for re-posing, re-outfitting, re-lighting and background swaps.
---

# skill: photoshoot-studio

**Name:** Photoshoot Studio — AI photoshoot prompt packs (people + products)
**Description:** Turns a photoshoot idea into a **copy-paste prompt pack** for AI image tools — **Google Flow / Nano Banana Pro (Imagen)**, **Midjourney**, **Flux** — for both **person photoshoots** (editorial, model, portrait, beauty) and **product photoshoots** (hero, floating, packaging, lifestyle). The pack has **one fully-engineered image prompt per shot**, plus **edit/inpaint prompts** for quick retouches (change outfit, change background, relight). Every generation prompt embeds a **verbatim subject block** (the person's face/hair/wardrobe OR the product's exact build/color/material) so the **same subject never changes** between shots — reinforced by reference-image ingredients uploaded once. Built for creators who generate shots one at a time and paste prompts manually.

---

## The quality bar (non-negotiable — read before anything else)

| Rail | Rule |
|---|---|
| **Subject consistency (the #1 rail)** | The same person or the same product across every shot. Enforced TWO ways, both mandatory: (1) the user uploads **reference-image ingredients** (from the subject sheet, § Workflow Stage 2) into Flow's Ingredients / Midjourney `--cref` / Flux reference slot, AND (2) the **exact same subject block text** appears VERBATIM in every generation prompt — never reworded, never trimmed. The script self-verifies this; if a prompt misses a word, regenerate it. |
| **One prompt per shot, copy-paste ready** | Every shot gets ONE complete image prompt following the 6-part formula + aspect ratio (photographic style + subject block + pose/placement + setting + craft block + grade, then the per-platform aspect), with the consistency tokens appended. No instructions, no meta-commentary inside the prompt — the user copies and pastes it as-is. |
| **Professional photography language** | Camera language is explicit and real: camera body (Hasselblad X2D, Sony A7R V, Leica M11, Phase One), lens + focal length (35mm/50mm/85mm/100mm macro), aperture (f/1.4–f/2.8 portrait, f/8–f/11 product), lighting setup (Rembrandt, butterfly, three-point softbox, golden-hour, high-key, octabox key + rim), film stock + grain. Never vague "professional photo". |
| **Color grading locked per shoot** | ONE grade token block (film stock + palette + grain) chosen at the start and appended verbatim to every prompt — warm Kodak Portra, cool Fuji, high-key clean, moody chiaroscuro, etc. Never two grades in one shoot. |
| **Aspect ratio per platform** | One aspect per shot, chosen for the platform: `4:5` (Instagram feed / editorials) · `1:1` (e-commerce grids) · `9:16` (Stories/TikTok) · `16:9` (banners) · `3:2` (print/portfolio). Written into the prompt AND the pack header. |
| **Edit prompts for retouching** | Beyond the generation prompts, each shot that needs a retouch gets a SHORT localized edit/inpaint prompt that describes ONLY what changes (outfit, background, light, pose) — never the whole scene — so the tool's lasso/inpaint keeps everything else intact. |

---

## When to use

- "Give me AI photoshoot prompts for this person — same face in every shot, different outfits"
- "Product photoshoot prompts for my e-commerce store — hero shot, floating shot, packaging"
- "Editorial/model photoshoot prompts I can paste into Google Flow / Nano Banana / Midjourney"
- "Make a prompt pack with one prompt per shot, great lighting and color grading"
- "Edit prompts to change the background / outfit / lighting of an image"

**Complements:** `carousel-post-images` (turn the generated shots into a carousel) · `veo-cinematic-reels` (same subject, but for Veo video scenes) · `email-marketing` (hero images for email campaigns) · `vibe-code-webapp` (product/marketing imagery for the site).

---

## The consistency system (read before anything else)

AI image tools generate each shot independently — **prompt drift = subject drift**. This skill uses the layered system that actually holds:

1. **Reference-image ingredients (uploaded once).** From the subject sheet (Stage 2), generate **2–3 clean reference images** (person: front portrait, ¾ angle, full body in the signature outfit; product: 45° hero on white, top-down, detail close-up) — use Nano Banana Pro / Imagen in Flow or your CLI's image tool. Upload them as Flow **Ingredients**, or use Midjourney `--cref <url>` / Flux reference input. **Character weight:** because this skill changes outfits and scenes per shot, use `--cw 0` (face-only) on Midjourney so the wardrobe isn't locked from the reference; use `--cw 100` only when the outfit must stay exactly as in the reference. Reuse the SAME ingredients for every shot.
2. **The subject block (verbatim in every prompt).** One rigid paragraph: for a **person** — name, age, build, face, hair, wardrobe, signature prop; for a **product** — exact item, brand, color, material, texture, label. This block is **copy-pasted identically** into every generation prompt — only pose/placement/setting/lighting change.
3. **The grade block + craft block (verbatim in every prompt).** One grade token (film stock/palette/grain) and one craft token (camera body + lens + lighting philosophy) appended to every prompt.
4. **Edit prompts stay local.** A retouch describes ONLY the change ("replace the white background with a rooftop at dusk", "change her blazer to a red evening dress") — never re-describes the subject or scene. This is how Flow's Select/Lasso and Midjourney Editor keep everything else untouched.

---

## Photography language — the craft token block

Append to every prompt (after the subject block). One line, verbatim:

```
Craft: shot on Hasselblad X2D medium format, 85mm f/1.8 portrait lens, shallow depth of field, creamy bokeh, three-point studio lighting (softbox key, rim, fill), rich dynamic range, crisp detail, premium photographic finish, no warping, no artifacts.
```

**Grammar per shot (pick from the vocabulary, be specific):**

| Element | Vocabulary (pick one, be specific) |
|---|---|
| **Camera body** | Hasselblad X2D (medium-format tonal range) · Sony A7R V (crisp digital) · Leica M11 (documentary) · Phase One XF IQ4 (product sharpness) · Canon EOS R5 |
| **Lens / focal** | 35mm (environmental) · 50mm (natural) · 85mm (portrait compression) · 100mm macro (product texture) · 135mm (compressed editorial) |
| **Aperture** | f/1.4–f/2.8 (isolated subject, creamy bokeh) · f/5.6 (balanced) · f/8–f/11 (full product sharpness) |
| **Lighting (people)** | Rembrandt (cheek triangle) · butterfly · split · three-point softbox · golden-hour side light · diffused window light · rim light · ring-light beauty |
| **Lighting (product)** | octabox key + rim separation · softbox overhead · strip-light edge glow · colored gel accent · high-key seamless · low-key dramatic |
| **Pose (person)** | walking toward camera · looking over shoulder · seated editorial · candid laugh · hand-in-hair · direct gaze · profile |
| **Product placement** | 45° hero angle · front-facing · levitating/floating mid-air · in-use lifestyle · detail macro · flat-lay top-down · on-model |
| **Background** | seamless studio grey/white/black · concrete brutalism · sun-drenched oak kitchen · rooftop at dusk · neon city night · textured plaster wall |

---

## Color grading — the grade token block

Pick ONE grade at Stage 1 and reuse the exact token in every prompt:

| Grade | Token block |
|---|---|
| **Warm Kodak / portrait** | `Grade: warm golden Kodak Portra 400 look, soft natural skin tones, gentle halation, creamy film grain, sun-kissed highlights.` |
| **Cool clean / fashion** | `Grade: cool muted Fuji Pro 400H look, clean pastel tones, soft contrast, fine film grain, editorial polish.` |
| **High-key e-commerce** | `Grade: bright high-key commercial look, pure white seamless background, crisp even exposure, zero shadows, ultra-clean.` |
| **Moody chiaroscuro** | `Grade: deep crushed blacks, dramatic low-key chiaroscuro, single-source light, rich shadow falloff, subtle grain.` |
| **Cinematic teal-orange** | `Grade: cinematic teal-and-orange, cool shadows, warm skin tones, contrast-rich, 35mm Kodak Vision3 500T film stock, subtle grain.` |
| **Luxury editorial** | `Grade: muted earth tones, matte shadows, soft window light, medium-format film look, ultra-fine grain, editorial stillness.` |

---

## Workflow (6 stages)

### Stage 1 — Analyze + plan the shoot
Extract: **subject kind** (person / product) · **the subject** (who/what: original, or based on the user's existing reference images) · **platform/tools** (Google Flow / Nano Banana · Midjourney · Flux) · **aspect ratio(s)** per platform · **style/tone** (editorial, luxury, commercial clean, candid) · **grade choice** (from the table; default warm Kodak for people, high-key for products) · **# of shots** (default 5). Lock ONE grade and ONE craft token (camera body + lens + lighting philosophy).

### Stage 2 — Write the subject sheet → `subject-sheet.md`
A complete subject spec + reference-image prompts:
- **Subject block** (the verbatim paragraph that goes in EVERY prompt — § Consistency system #2). Person or product, never both mixed.
- **2–3 reference-image prompts** for Nano Banana Pro / Imagen: person = front portrait / ¾ angle / full body in signature outfit; product = 45° hero on white / top-down / detail close-up. Same subject block, consistent lighting.
- A note: what NOT to change between shots (person: hair, face, outfit pieces, prop; product: exact color, material, label).

### Stage 3 — Write the shot list → `shot-list.md`
The shoot arc: **hero shot → establishing → detail → lifestyle/in-use → closing/CTA**. Each shot row: `# / shot type / pose or placement / setting / props / lighting / aspect / edit prompt (if any)`. For people: 1 hero editorial, 1 close-up beauty, 1 full-body outfit, 1 candid lifestyle, 1 environmental. For products: 1 hero on white, 1 floating, 1 detail macro, 1 lifestyle in-use, 1 packaging/flat-lay.

### Stage 4 — Build the prompt pack → `prompts.md` (automated)
```bash
node scripts/shot-prompts.mjs --plan shoot-plan.json --out prompts.md
```
`shoot-plan.json` holds the subject block, grade token, craft token, reference images, aspect ratio, and one object per shot (type, pose/placement, setting, props, lighting, aspect, edit). The script:
1. Assembles **one full image prompt per shot** from the 6-part formula + aspect ratio: `Photographic style + Subject block (verbatim) + Pose/placement + Setting + Craft block + Grade token + Aspect ratio`.
2. **Self-verifies** every prompt contains the FULL subject block, the grade token, and the craft token (word-level) — prints which shot passes/fails.
3. Appends a **localized edit/inpaint prompt** per shot when the plan provides one (labeled `Edit:` — describes ONLY the change).
4. Writes `prompts.md` with a header (ingredients to upload, tool flags per platform, aspect ratio, generation order) + one `### Shot N` block per shot — **pure copy-paste, no meta-commentary inside the prompt itself**.

### Stage 5 — Generate in Google Flow / Midjourney / Flux (manual)
1. Upload the reference images to the **Ingredients** panel (Flow), or add `--cref <url>` (Midjourney — use `--cw 0` for face-only since outfits change per shot; `--cw 100` only if the wardrobe must stay locked), or set the reference image (Flux).
2. For each shot: copy the prompt from `prompts.md` → paste → set aspect ratio → generate. **Do not edit the subject block** — paste the whole prompt as written.
3. For retouches, select the region (Flow Select/Lasso, Midjourney Editor) and paste the short `Edit:` prompt — it changes only that region.
4. Regenerate any shot where the subject drifts; do NOT fix it by editing the subject block mid-run (rewording breaks consistency — regenerate with the identical prompt + same ingredients).

### Stage 6 — Audit + deliver (subagent, before delivery)
Spawn a fresh subagent to check:
1. **Consistency** — every prompt contains the verbatim subject block + grade token + craft token (re-run `shot-prompts.mjs` verify if unsure); subject sheet has 2–3 reference-image prompts.
2. **Prompt quality** — 6-part formula + aspect complete per shot; camera/lens/lighting specific (no "professional photo" vagueness); one idea per shot.
3. **Shoot arc** — hero first, detail + lifestyle middle, closing/CTA last; shot count matches the plan.
4. **Aspect ratios** — every shot's aspect matches its platform (4:5 feed, 1:1 grid, 9:16 stories, 16:9 banner).
5. **Edit prompts** — each one describes ONLY the change (no subject re-description); flagged as `Edit:`.
Any FAIL → fix the plan → regenerate → re-audit.

---

## Production checklist

- [ ] Grade + craft locked at Stage 1 (ONE grade token + ONE craft token reused everywhere)
- [ ] `subject-sheet.md`: verbatim subject block + 2–3 reference-image prompts (person or product)
- [ ] User has generated + uploaded the ingredients (or will, before generating)
- [ ] `shot-list.md`: hero → establishing → detail → lifestyle → closing; aspects + edit prompts per shot
- [ ] `shoot-plan.json` matches the shot list exactly
- [ ] `prompts.md` from `shot-prompts.mjs` — every prompt self-verified to contain the full subject block + grade + craft tokens
- [ ] Edit prompts are short and localized (only the change, labeled `Edit:`)
- [ ] Every prompt is pure copy-paste (no meta-commentary inside)
- [ ] Auditor subagent signed off: consistency, prompt quality, shoot arc, aspects, edit prompts
- [ ] Delivery: `subject-sheet.md` + `shot-list.md` + `prompts.md` + tool notes (ingredients / `--cref` / reference image)
