---
name: thumbnail-studio
description: Engineer click-worthy YouTube thumbnails with a CTR teardown — one-idea-per-thumbnail style system (face/emotion/contrast/≤5-word overlay rules, anti-cliché blocklist), 3–5 thumbnail variants per video with photoreal image-gen prompts (Nano Banana / Midjourney / Flux), an A/B test plan with CTR benchmarks by niche, and an audit harness (thumbnail-prompts.mjs builds + self-verifies the variant pack → audit-thumbs.mjs → a fresh thumbs-auditor subagent scores thumbnail-worthiness /50 and signs PASS / FIX NEEDED before delivery).
---

<!-- ════════════════════════════════════════════════════════════════════════
     🎬 deepak-skill — crafted by Deepak · skill: thumbnail-studio
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

**🎬 deepak-skill — crafted by Deepak** · skill: `thumbnail-studio` · [deepak-skill on GitHub](https://github.com/Deepak-ai-93/deepak-skill) · MIT

# skill: thumbnail-studio

**Name:** Thumbnail Studio — CTR-engineered thumbnails for YouTube
**Description:** Turns a video's title + angle into a **CTR teardown + 3–5 thumbnail variants**: `thumbnail-teardown.md` (what the niche's winning thumbnails do, the ONE idea this video sells, the emotion) → `thumbnails.md` (3–5 variants, each = ONE idea + ≤ 5-word overlay + exact visual scene + photoreal image-gen prompt, every constraint self-verified by `thumbnail-prompts.mjs`) → `ab-test.md` (the A/B plan with CTR benchmarks by niche) + `thumbs-audit.md` (the audit harness output). Built to slot directly into `youtube-video-pipeline` (which only writes a thumbnail *brief* — this is the full visual CTR engine).

---

## Storytelling + addiction rails (the universal contract — read before anything else)

Every deliverable this skill produces must tell **ONE micro-story** and engineer **rewatch**. These rails are the SAME contract every video/image skill in this repo follows — apply them to every beat, scene, slide, shot or clip before it ships.

**Applied to thumbnails:** the thumbnail IS a micro-story told in one glance — the **face/emotion opens the loop** (curiosity, tension, promise), the **visual tension holds it** (contrast, composition, the unresolved object), and the **overlay text closes or chains the loop** (the promise, the number, the question). A thumbnail is the hook of the hook: it must make a scroller STOP, then the video title + first frame make them CLICK, then the video pays off. The loop is: stop → click → watch. If the thumbnail promises what the video can't pay off, the click dies in the first 30 seconds — CTR without retention is churn.

### The story spine (all four beats, always)

| Beat | Rule |
|---|---|
| **Open loop (hook, 0–3s)** | The first thing the viewer sees — first frame, cover slide, first scene — opens an unresolved question, tension or promise the brain must see closed. No intro, no logo, no "hey guys". |
| **Rising tension** | Every beat after the hook escalates: new stakes, a twist, a pattern interrupt, an "and then…". Each beat either raises the question or raises the stakes — never just fills time. |
| **Payoff** | The open loop closes in the final seconds with the "aha" the hook promised. A loop opened and never closed kills trust and rewatch. |
| **Loop ending** | The last frame mirrors or seeds the first (rewatch counts as a second view) or chains into the next post ("Part 2", "Follow for part 2", "Save this"). |

### The addiction levers (use ≥3 per deliverable)

| Lever | Mechanism |
|---|---|
| **Curiosity gap** | The open loop the brain must close (Zeigarnik effect — unfinished tasks nag). |
| **Serialization / cliffhanger** | Cut before resolution; chain posts into a series so the audience returns for the next installment. |
| **Variable reward** | Reveal payoffs on a beat the viewer can't predict — countdowns, answer reveals, verdicts, twists. |
| **Pattern interrupt** | A scale pop, color flash or tempo break exactly where attention dips (the mid-video hump). |
| **Relatability / self-recognition** | "That's me" moments — the viewer watches to see their own life, then saves or shares it. |
| **Commitment bait** | Save / share / comment / "what's your #?" — an engaged viewer is a returning viewer. |

### The fluff rule

Every beat either **raises the question**, **raises the stakes**, or **pays off**. If a beat can be deleted without losing the story, delete it.

---

## The quality bar (non-negotiable — read before anything else)

| Rail | Rule |
|---|---|
| **ONE idea per thumbnail (the #1 rail)** | Each variant sells exactly ONE idea: a curiosity gap, a result, or a threat — never a mash-up. The overlay text ≤ 5 words. If the idea needs a sentence, cut the qualifiers. |
| **CTR teardown first** | Before any thumbnail, the niche's winning thumbnails are teardowned (what they show, the emotion, the composition) and the video's ONE idea is locked. No teardown → no thumbnails. |
| **Face + emotion + contrast** | The thumbnail has a real emotion on a face (or a high-tension object) + high contrast (subject vs background, one accent color) — readable at 120×68px in the YouTube feed. |
| **Overlay ≤ 5 words, one font** | ≤ 5 words on a high-contrast band/scrim, ONE font family, no clichés (no red arrows, no shocked-face-with-hands, no "!" spam, no "YOU WON'T BELIEVE"). |
| **Anti-cliché blocklist** | No red arrows/circles, no clip-art explosion, no "GONE WRONG" in impact font, no hands-on-cheeks shock, no "$" rain, no generic stock "strategy" icons as the main visual. |
| **Prompt-self-verification** | `thumbnail-prompts.mjs` verifies every variant: idea present, ≤ 5-word overlay, scene text, emotion, 1280×720 canvas, anti-cliché blocklist. Exits 1 on drift. |
| **A/B plan + benchmarks** | Every pack ships `ab-test.md`: which 2 variants to test, test duration, and the niche's CTR benchmarks (from `templates/ctr-benchmarks.md`) to judge the result. |
| **Audited before delivery (the harness)** | Stage 6 is a harness, never a self-check: `audit-thumbs.mjs` runs the automated checks (teardown, variants, overlay caps, blocklist, A/B plan, output) → a FRESH thumbs-auditor subagent scores thumbnail-worthiness (/50, ≥ 35 = worth shipping) → fix loop until signed **PASS** in `thumbs-audit.md`. |

---

## When to use

- "Make thumbnails for this video" / "Design my YouTube thumbnails"
- "Give me 3 thumbnail options with image prompts for [video title]"
- "Teardown my niche's thumbnails and beat them"
- "Set up an A/B test for my thumbnails"
- Anything that follows `youtube-video-pipeline` (its thumbnail *brief* becomes this skill's input)

**Complements:** `youtube-video-pipeline` (the video plan feeds the thumbnail brief — this skill is its visual CTR engine) · `veo-cinematic-reels` / `photoshoot-studio` (same image-model prompt DNA: Nano Banana / Midjourney / Flux) · `hook-storyboard-retention` (the same open-loop psychology, applied to a still) · `paid-ads-studio` (thumbnail craft = static ad creative craft).

---

## Workflow (6 stages)

### Stage 1 — Analyze the brief (ask ≤3 questions if vague)
Extract: **video title + angle** (from the video plan or the user) · **niche** (finance, tech, fitness, …) · **audience** · **goal** (CTR on browse/suggested, or impressions) · **channel style** (consistent look or per-video). Lock the ONE idea the video sells — the thumbnail must match the title's promise (no clickbait mismatch).

### Stage 2 — CTR teardown of the niche
Teardown 5–10 of the niche's highest-CTR thumbnails (web research or the user's feed): what's in them (face/object/scene), the emotion, the composition (rule of thirds, scale, contrast), the overlay words. Record the patterns in `thumbnail-teardown.md` with the rules from `templates/thumbnail-rules.md`. **Freshness rule:** thumbnails from the last ~3 months; note what's saturated (everyone does the shocked face → do the opposite).

### Stage 3 — Lock the ONE idea + write the plan → `thumbnail-plan.json`
The creative contract the script enforces: `title`, `niche`, `idea` (the single promise — curiosity / result / threat), `emotion`, plus `variants[]` — **3–5 variants**, each with `concept` (the idea in a sentence), `overlay` (≤ 5 words), `scene` (the exact visual moment), `style` (photoreal / illustration / bold-graphic). Every variant = ONE idea; variants vary the *execution*, not the promise.

### Stage 4 — Build + self-verify → `thumbnails.md` (automated, exit 1 on drift)
```bash
node scripts/thumbnail-prompts.mjs --plan thumbnail-plan.json --out thumbnails.md
```
The script assembles each variant's spec + **photoreal image-gen prompt** (1280×720 canvas, subject + emotion + scene + overlay text instruction + no-cliché negative, Nano Banana / Midjourney / Flux compatible) and **self-verifies**: ≥ 3 variants · overlay ≤ 5 words · idea present · emotion present · anti-cliché blocklist clean. **Exits 1 on any FAIL** and writes nothing. On clean it writes the polished `thumbnails.md` (per-variant: concept, overlay, scene, prompt, which to test).

### Stage 5 — Write `ab-test.md`
Which 2 variants to test first (the most different executions), the test window (1–2 weeks or until the CTR difference is decisive), and the niche's CTR benchmarks to judge the result (from `templates/ctr-benchmarks.md`). Include the rule: title stays identical across the A/B test — only the thumbnail changes, or you can't read the result.

### Stage 6 — Audit harness (automated checks + thumbs-auditor subagent, before delivery)
**Step 6a — run the automated audit harness:**
```bash
node scripts/audit-thumbs.mjs --pack <thumbnail-folder> --out thumbs-audit.md
```
`audit-thumbs.mjs` scans the pack and checks everything a script can: thumbnail-teardown.md present (niche + patterns + the ONE idea), thumbnails.md (≥ 3 variants, overlay ≤ 5 words each, idea + emotion present per variant, 1280×720 canvas, anti-cliché blocklist) and ab-test.md (test pair + window + benchmark). Writes `thumbs-audit.md` (automated verdicts + scorecard scaffold). **Exit 1 on any FAIL.**

**Step 6b — spawn the thumbs-auditor subagent** — a FRESH subagent (never self-audit) with the exact brief from `templates/thumbs-auditor-brief.md`: reads `thumbs-audit.md` + all pack files, completes the **thumbnail-worthiness scorecard** (10 criteria, /50 — **≥ 35 = worth shipping**, with verdict bands), makes the creative judgment calls the script can't (does the thumbnail match the title's promise, would it stop a scroll at 120×68px, is the emotion real, does the overlay add or repeat), and signs **PASS / FIX NEEDED** with per-variant fixes.

**Step 6c — fix loop.** Any FAIL (or an auditor-flagged WARN) → fix `thumbnail-plan.json` → re-run `thumbnail-prompts.mjs` + `audit-thumbs.mjs` → re-submit to a fresh auditor. **Nothing is delivered until the auditor signs off PASS.** The `thumbs-audit.md` ships with the pack.

---

## Production checklist

- [ ] ONE idea locked per thumbnail: curiosity gap, result, or threat — never a mash-up
- [ ] CTR teardown done: niche's winning thumbnails + patterns + what's saturated (`thumbnail-teardown.md`)
- [ ] 3–5 variants, each = ONE idea + overlay ≤ 5 words + scene + emotion
- [ ] Face + emotion + contrast readable at 120×68px; one accent color
- [ ] Anti-cliché blocklist clear (no red arrows, no shocked-hands, no "GONE WRONG")
- [ ] Overlay matches the video title's promise — no clickbait mismatch
- [ ] `thumbnail-prompts.mjs` ran clean (exit 0) → `thumbnails.md` with 1280×720 photoreal prompts
- [ ] `ab-test.md`: which 2 variants, test window, niche CTR benchmarks
- [ ] **Audit harness run:** `audit-thumbs.mjs` → automated checks (teardown, variants, overlay caps, blocklist, A/B plan, output) — exit 0
- [ ] **Thumbs-auditor subagent** (fresh eyes) completed the thumbnail-worthiness scorecard (/50 ≥ 35) and signed **PASS / FIX NEEDED** in `thumbs-audit.md`
- [ ] Delivery: `thumbnail-teardown.md` + `thumbnails.md` + `ab-test.md` + `thumbs-audit.md`
