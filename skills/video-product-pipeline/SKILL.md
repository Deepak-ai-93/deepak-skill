---
name: video-product-pipeline
description: Premium production workflow for ANY short-form video request (reels, TikTok, Shorts) — analyze the prompt (even vague or sloppy ones), write a video-product.md spec, STOP and wait for user approval, then generate using text-motion-reels / video-asset-reels / voice-sfx-audio, and finally audit the finished composition with an automated script plus a dedicated auditor subagent (spelling, text overlap, safe zones, style, readability). Use for every video-generation request.
---

# skill: video-product-pipeline

**Name:** Prompt → Video Product → Approval → Generation → Audit pipeline
**Description:** The premium gatekeeper around every video-generation skill in this repo. A bad prompt can no longer produce a bad video silently: the agent **analyzes** the prompt, writes a complete **`video-product.md`** spec, **waits for explicit user approval**, only then generates (delegating to `text-motion-reels`, `video-asset-reels`, `voice-sfx-audio`), and after rendering **audits** the frames with an automated script + a dedicated auditor subagent before anything is delivered.

---

## When to use

Use this skill for **every** "make a reel / short / TikTok" request, no matter how good or how broken the prompt is:

- "make a reel about motivation" (vague) → analyze → spec → approve → generate → audit
- A fully scripted, detailed request → still spec → approve → generate → audit (the spec is the contract)
- A prompt with typos, contradictions, or missing info → never guess silently — ask, then spec

**Invariant:** *No HTML, no rendering, no audio is produced before the user has approved `video-product.md`.*

---

## Install anywhere (standalone)

```bash
# install ONLY this skill into the current project
npx skills add Deepak-ai-93/deepak-skill --skill video-product-pipeline

# globally — available in every project on this machine
npx skills add Deepak-ai-93/deepak-skill --skill video-product-pipeline -g
```

Installs to `.agents/skills/video-product-pipeline/` (`SKILL.md` + `scripts/`). It *orchestrates* the other skills, so also install them:

```bash
npx skills add Deepak-ai-93/deepak-skill --skill text-motion-reels --skill video-asset-reels --skill voice-sfx-audio
```

**Prerequisites:** Node.js 18+, Google Chrome, FFmpeg, Playwright (`npm i -D playwright`), and the same per-skill prerequisites (Kokoro for voice, etc.). In a repo clone the identical pipeline scripts also live in `render/`; either path works.

---

## The 5-stage workflow

```
prompt ──► 0. ANALYZE ──► 1. video-product.md ──► USER APPROVAL ──► 2. GENERATE ──► 3. AUDIT ──► 4. DELIVER
                 │              │                     ▲                                 │
                 └── ask up to 3 questions ──────────┘  (edit / reject loops)          └─ fix loop until PASS
```

### Stage 0 — Analyze the prompt (never generate yet)

Read the prompt **as written** — including the bad ones. Extract or confirm:

| Field | Notes |
|---|---|
| Topic / niche | The single subject. If absent → ask. |
| Platform | Reels / TikTok / Shorts (affects duration + caption pack). |
| Duration | Default **15s**. Beat count ≈ seconds ÷ 2. |
| Visual style | Pick from the format/style libraries (see delegation table). Default by niche. |
| Hook | Use a hook formula (`hook-storyboard-retention`) if the user didn't give one. |
| Assets | Own clips/images, or none (text-only)? Only CC0/CC-BY/MIT sources. |
| Voice / music | Kokoro voice (default), CC0 bed. |

**Rules for non-premium prompts:**
1. One-word / typo'd / contradictory prompt → ask **at most 3** clarifying questions with defaults ("Topic? Default 15s? Text-only or with your clips?"). Never invent assets.
2. If the prompt is *actionable but sloppy*, fix the copy yourself in the spec (grammar, spelling, hook structure) — and mark every rewrite in the spec's **Decisions** section so the user sees what changed.
3. If you cannot determine topic or assets after one round of questions, write the spec with the safest defaults and let the approval gate catch it.

### Stage 1 — Write `video-product.md` and STOP for approval (the gate)

Copy `scripts/spec-template.md` → **`video-product.md`** in the project root and fill it completely:

- **Title, niche, platform, duration** — locked, no ambiguity left.
- **Style / format** (one entry, with slug) + hook formula + hook copy.
- **Beat sheet** — every beat: `id, start, duration, text (3–6 words), visual`. This IS the generation contract.
- **Safe-zone map** — the 9:16 numbers below (the audit enforces them).
- **Voice / music / SFX** — engine, voice id, license of the bed.
- **Output naming** — `{format-slug}_{topic-slug}_4k`.
- **Decisions** — what you rewrote or defaulted from the raw prompt.

Then **present the full file to the user and wait**. The user may:
- **Approve** → proceed to Stage 2.
- **Edit** → revise `video-product.md` and re-present (loop until approved).
- **Reject** → stop.

> Do NOT start any generation, render, or audio work before approval. The gate exists because the non-premium failure mode is exactly "prompt in → junk out".

### Stage 2 — Generate (only after approval)

Execute the spec by delegating to the production skills (never freelance the pipeline):

| Spec says | Delegate to | Produces |
|---|---|---|
| Text-only reel | `text-motion-reels` (format wizard locked from the spec) | 1080x1920 HTML composition + GSAP timeline |
| Reel from clips/images | `video-asset-reels` (`storyboard.json` from the beat sheet → `cut-assets.mjs`) | pre-cut clips + HTML composition |
| Voiceover / music | `voice-sfx-audio` (`generate-voice.mjs` → `mix-audio.sh`, -14 LUFS) | beat-synced voice + ducked mix |
| Caption pack | `generate-caption.mjs` | `caption.md` (500–900 chars/section) |

Hard rules inherited from the deterministic contract: one paused GSAP timeline on `window.__timelines.<name>`, `data-start`/`data-duration` on every beat, no SMIL / `Math.random()` / `.play()` timing, no `<audio>` in the HTML (mux with `--audio`), videos pre-cut and muted.

Copy `video-product.md` into `output/{name}/` for the record. Render at 4K (`--scale 2`).

### Stage 3 — Audit (automated checks + auditor subagent)

**Step 3a — run the automated audit script:**

```bash
# text-only reels
node scripts/audit-composition.mjs --html reel.html --duration 15 --out output --name {name}

# asset reels (optionally cross-check the beat text against storyboard.json)
node scripts/audit-composition.mjs --html reel.html --duration 15 --storyboard storyboard.json --out output --name {name}
```

The script captures **one keyframe per beat** into `output/{name}/audit/frames/` (add `--scale 2` for 4K keyframes), measures every visible text element against the 9:16 safe zone, flags **off-screen/clipped text, text overlap, word-cap violations, timeline incoherence**, runs **static determinism lint** (Math.random / SMIL / `.play()` / `<audio>`), and writes the **`audit-report.md`** scaffold with all automated verdicts.

**Step 3b — spawn the auditor subagent.** After the script finishes, spawn a fresh subagent (a second pair of eyes — never audit your own work) with this exact brief:

```
You are the video auditor for the reel at {output}/{name}/.
1. Read output/{name}/audit/audit-report.md and open every keyframe in
   audit/frames/ (open each image; do not judge from filenames alone).
   If the render produced output/{name}/frames/ or an MP4, also spot-check
   a few of THOSE frames — they are the true video generation output.
2. Complete Section 4 of the report:
   - 4.1 Spelling & grammar   — check the extracted text + frames
   - 4.2 Text overlap/clipping — no two text blocks collide; nothing cut off
   - 4.3 Style consistency    — matches the format spec in video-product.md
   - 4.4 Readability/contrast — mute test: text clear over the backdrop
   - 4.5 Safe-zone placement  — all text inside x 8–92% / y 15–85%
   - 4.6 Beat↔voice sync      — every voice line FITS ✓ its beat window
3. Verdict:
   - All PASS → mark PASS and stop.
   - Any FAIL or a WARN you judge real → mark FIX NEEDED and list concrete
     fixes (wrong beat text, overlap source, off-zone element, typo, style
     drift, etc.).
4. Report your verdict and the completed audit-report.md path.
```

**Step 3c — fix loop.** Any FAIL (or auditor-flagged WARN) → fix the composition / copy / storyboard, re-render, re-audit, re-submit to the auditor. **Nothing is delivered until the auditor signs off PASS.**

### Stage 4 — Deliver

- Final MP4 + `caption.md` + `video-product.md` + `audit-report.md` (all PASS) in `output/{name}/`.
- Tell the user exactly what was generated, the one-line spec summary, and the audit verdict.

---

## The 9:16 safe-zone spec (shared with the audit script — non-negotiable)

Design space is **1080x1920** (render at scale 2 → 4K). Platform UI overlays cover: bottom ~12% (like bar), top ~10% (status bar), right ~8% (share/CTA rail).

| Zone | Rule |
|---|---|
| **Hard safe zone** | ALL text stays inside **x 8–92% · y 15–85%** of the stage. |
| **Preferred reading column** | Centered, **75% width**, **y 28–72%** — put beat text here. |
| **Animations / assets** | Confined to the bands OUTSIDE the reading column (top 0–25%, bottom 75–100%, gutters x 0–8% / 92–100%), clipped with `overflow: hidden`. |
| **Per beat** | 3–6 words; word-by-word pops for mute-first impact; no two text blocks may overlap on screen. |

The audit script flags any text outside the hard safe zone (WARN) or off-screen/clipped (FAIL), any overlap (WARN), and any beat over 6 words (WARN) / 10 words (FAIL).

---

## Auditor checklist (subagent + script agree on these)

- [ ] Spelling & grammar on every beat (script extracts the text; subagent judges)
- [ ] No text overlap / no clipping at the stage edges
- [ ] Text style consistent with the chosen format (typography, palette, motion)
- [ ] Readable on mute — contrast vs backdrop, nothing busy behind the text column
- [ ] All text inside the safe zone (x 8–92%, y 15–85%)
- [ ] Beat windows sequential and within duration (script-verified)
- [ ] Determinism: no `Math.random`, no SMIL, no `.play()` timing, no `<audio>` in HTML
- [ ] Voice lines FITS ✓ every beat window; mix at -14 LUFS
- [ ] Two identical renders produce identical frames

---

## Example session

**User:** "maek a vid about money"

**Agent:** *(Stage 0 — asks ≤3 questions)* "Got it — a money reel. 15 seconds default? Text-only or do you have clips? And a topic: saving, investing, or spending habits?"

**User:** "savings, text only"

**Agent:** *(Stage 1 — writes `video-product.md`, presents the full spec, waits)*

> `video-product.md` — title: "3 Money Rules Nobody Told You", format: word-pop, 15s, hook: "Your savings are leaking. Fix these 3 rules.", beats: [0.0–3.0 "Your savings are leaking."], [3.0–4.5 "Rule one: pay yourself."] … voice: kokoro af_heart, no music. **Approve? (edit?)**

**User:** "approve"

**Agent:** *(Stage 2 — delegates to text-motion-reels + voice-sfx-audio, renders 4K)*

**Agent:** *(Stage 3 — runs audit-composition.mjs, spawns the auditor subagent, gets PASS)*

**Agent:** *(Stage 4 — delivers `output/word-pop_money-rules_4k/` with mp4 + caption.md + video-product.md + audit-report.md)*

---

## Production checklist

- [ ] Prompt analyzed; ≤3 clarifying questions if vague; no silent guessing
- [ ] `video-product.md` written from `scripts/spec-template.md` (root) with **Decisions** section
- [ ] **Approval gate: user explicitly approved before ANY generation**
- [ ] Generation delegated per the spec (text-motion-reels / video-asset-reels / voice-sfx-audio)
- [ ] Deterministic contract held: paused GSAP timeline, data-start/duration, no SMIL/Math.random/play()/audio
- [ ] `audit-composition.mjs` ran: keyframes + audit-report.md scaffold produced
- [ ] Auditor subagent completed Section 4 and signed off **PASS**
- [ ] Any FAIL → fixed → re-rendered → re-audited (loop closed)
- [ ] `video-product.md` + `audit-report.md` copied into `output/{name}/`
- [ ] Delivered: MP4 + `caption.md` + spec + audit report
