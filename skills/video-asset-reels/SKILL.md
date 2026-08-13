---
name: video-asset-reels
description: Create proper reels from user-supplied video clips and images with HyperFrames — understand the prompt, cut assets to beats, overlay kinetic text, sync a voiceover, and render a deterministic 4K MP4 with a caption pack. Complements text-motion-reels (visuals reuse its design system) without touching it.
---

<!-- ════════════════════════════════════════════════════════════════════════
     🎬 deepak-skill — crafted by Deepak · skill: video-asset-reels
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

**🎬 deepak-skill — crafted by Deepak** · skill: `video-asset-reels` · [deepak-skill on GitHub](https://github.com/Deepak-ai-93/deepak-skill) · MIT

# skill: video-asset-reels

**Name:** Video/Image Asset Reels (HyperFrames) — cut, overlay, render
**Description:** Use this skill whenever the user wants a reel **built from their own video clips and images** (B-roll, product shots, footage, screenshots, photos) with text overlays — the agent reads the prompt, plans beats, cuts each asset to its beat, overlays kinetic text, adds a synced voiceover, and renders a deterministic vertical 4K MP4.

---

## Storytelling + addiction rails (the universal contract — read before anything else)

Every deliverable this skill produces must tell **ONE micro-story** and engineer **rewatch**. These rails are the SAME contract every video/image skill in this repo follows — apply them to every beat, scene, slide, shot or clip before it ships.

**Applied to asset reels:** the beat sheet IS the story — beat 1 = open loop, middle beats escalate (each asset raises the stakes), the last beat = payoff + loop CTA. Assets escalate, never just decorate: the strongest asset opens, the twist asset sits at the hump, the payoff asset closes.

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

## When to use

- "Make a reel from these clips" / "use these images + a voiceover"
- "Cut my footage into a 15-second reel with captions"
- Product/aesthetic montage, documentary-style explainer, storytime montage with real footage
- Any request where the visual comes from **user-provided media**, not pure typography

---

## Install anywhere (standalone)

This skill is **self-contained** — `SKILL.md` + `scripts/` travel together, so it installs cleanly into ANY project on its own:

```bash
# install ONLY this skill into the current project
npx skills add Deepak-ai-93/deepak-skill --skill video-asset-reels

# globally — available in every project on this machine
npx skills add Deepak-ai-93/deepak-skill --skill video-asset-reels -g
```

Installs to `.agents/skills/video-asset-reels/` (SKILL.md + scripts/).

**Prerequisites:** Node.js 18+, Google Chrome (rendering), FFmpeg (cuts + MP4 assembly), Playwright (`npm i -D playwright` in the target project — used by `render-frames.mjs`).

---

## The deterministic contract (non-negotiable)

A rendered frame is a **pure function of time t**. Therefore:

1. **Pre-cut every clip with FFmpeg** (`scripts/cut-assets.mjs`) → one exact-length clip per beat: 1080x1920 cover-crop, 30 fps, H.264 yuv420p, **muted** (`-an`).
2. **In HTML**, assets are `<video muted playsinline preload="auto" data-start data-duration src="assets/cuts/beat_01.mp4">` or `<img>` elements in `.asset-clip` containers at **z-index 1** (below text).
3. **The renderer seeks per frame**: for each visible clip, `currentTime = t − data-start` (clamped to `duration − 0.05`), waits for the `seeked` event, then screenshots. (`render-frames.mjs` does this automatically and is a no-op for text-only reels.)
4. **No audio inside the HTML** — clips are muted; the real mix (voice + bed) is muxed at the end with `--audio`.
5. **No SMIL, no Math.random, no `play()` timing.** Same input → same frames → same MP4.

---

## Workflow (6 stages)

> **Scripts:** all commands below use `scripts/` — the scripts bundled inside this skill (work standalone in any project). In a repo clone, the identical scripts also live in `render/`; either path works.

### Stage 1 — Ingest, trend-check & beat sheet
Research what is **rising** in the niche before writing anything (if `video-product-pipeline` is installed, run its `trend-hunt.mjs` + web-research TikTok Creative Center / X / YouTube; freshness rule: rising > peaked, nothing older than ~14 days), brainstorm ≥5 angles, score them (relatability · curiosity · hook · format fit · momentum · mute-first · loopability) and lock the winner. Then read the prompt, pick a style (see Styles), and build the beat sheet: hook → agitate → payoff → CTA. One beat = one asset + 3–6 words of text. Beat count ≈ seconds ÷ 2. Stage 1b writes the draft `storyboard.json` for you — same schema as below, with per-beat `alias` fields:

```json
{
  "out": "assets/cuts",
  "width": 1080, "height": 1920, "fps": 30,
  "beats": [
    { "id": "beat_01", "alias": "asset_01", "src": "assets/clips/sunrise.mp4", "in": 1.5, "duration": 3.0, "start": 0.0, "text": "Nobody teaches you this." },
    { "id": "beat_02", "alias": "asset_02", "src": "assets/photos/desk.jpg",  "duration": 2.5, "start": 3.0, "text": "Clarity is curated." }
  ]
}
```
- `in` = in-point inside the source clip (videos only), `duration` = beat window, `start` = beat start in the reel timeline. (`alias` is set by Stage 1b — the script/cut/audit ignore it, but it keeps the original filenames clean.)
- Text: 3–6 words per beat, hook in beat 1, CTA in the last beat.

### Stage 1b — Check assets & auto-arrange (the asset gate, no guessing)
Scan the assets folder, probe every file with ffprobe, validate it against the 9:16 spec, alias it, and auto-arrange the best-fit assets into a draft `storyboard.json` + `assets-report.md`:

```bash
node scripts/check-assets.mjs --dir assets --duration 15 --text "Nobody teaches you this.|Clarity is curated.|Save this."
```

- `--dir` = the assets folder (videos + images) · `--duration` = target reel length (default 15s) · `--text "a|b|c"` = one line per beat (hook first, CTA last) · `--beats N` = cap the beat count · `--dry-run` = print the plan without writing.
- **The "perfect video" rules the script uses:** real videos beat images · portrait beats landscape (landscape is cover-cropped) · higher resolution wins · the best asset lands on the hook beat · every beat window is capped at the source clip's length so **no beat can ever render black frames**.
- **Original filenames are never touched** — each asset gets an alias (`asset_01`, `asset_02`, …) used inside `storyboard.json`; `assets-report.md` lists the inventory, every check verdict (unreadable, low-res, landscape-cover-crop, odd names) and the arrangement plan.
- **Agent rule:** fill any empty beat texts (`--text` or edit `storyboard.json`), swap a beat's `src`/`alias` only when the content clearly fights the beat text (unused assets are listed in the report), then continue to Stage 2.

### Stage 2 — Cut assets
```bash
node scripts/cut-assets.mjs storyboard.json
```
Produces `assets/cuts/beat_01.mp4 …` — exact-length, cover-cropped, muted. (Images are looped for their duration.)

### Stage 3 — Compose HTML
One 1080x1920 composition. Layers:
- **z-index 1** — `.asset-clip` containers (one per beat, clipped + positioned; `<video>` or `<img>` fills them with cover-crop)
- **z-index 2** — readability backplate: soft dark gradient only where the text sits
- **z-index 3** — text container (kinetic type, reuse the text-motion-reels design system)
- **z-index 5** — hairline progress bar
- **z-index 10** — static feTurbulence grain overlay (opacity 0.06)

Register one paused GSAP timeline on `window.__timelines.reel`: text tweens at beat starts, Ken Burns (transform-only) on asset wrappers.

### Stage 4 — Render 4K
```bash
node scripts/render-frames.mjs --html reel.html --name {format-slug}_{topic-slug}_4k --duration 15 --fps 30 --scale 2
```
Output → `output/{name}/frames/` + `output/{name}/{name}.mp4` (2160x3840).

### Stage 5 — Audio (always-on, synced)
Kokoro voiceover via `voice-sfx-audio`: one line per beat, auto-fit into its window, mix with `mix-audio.sh` (-14 LUFS, bed ducked), then re-render with `--audio assets/full_mix.m4a`.

### Stage 6 — Caption pack
```bash
node scripts/generate-caption.mjs --name {name} --topic "{topic}" --format {format-slug} --hook "{hook}" --beats "beat text 1|beat text 2|…" --voice kokoro --duration 15
```
Writes `output/{name}/caption.md` — every platform section auto-checked into the **500–900 char window**, no hashtags.

### Stage 7 — Audit harness (automated checks + asset-reel-auditor subagent, before delivery)
**Step 7a — run the automated audit harness:**
```bash
node scripts/audit-asset-reel.mjs --pack <reel-folder> --out asset-reel-audit.md
```
`audit-asset-reel.mjs` scans the pack and checks everything a script can: storyboard.json (beat fields, hook in beat 1, CTA in the last beat, 3–6 words per beat, 9:16 spec, timing continuity), cut assets (assets/cuts/*), the HTML composition (GSAP timeline, no SMIL/Math.random/audio-in-HTML, asset layers), and the rendered output + caption pack. Writes `asset-reel-audit.md` (automated verdicts + scorecard scaffold). **Exit 1 on any FAIL.**

**Step 7b — spawn the asset-reel-auditor subagent** — a FRESH subagent (never self-audit) with the exact brief from `templates/asset-reel-auditor-brief.md`: reads `asset-reel-audit.md` + all pack files, completes the **asset-reel scorecard** (10 criteria, /50 — **≥ 35 = worth posting**, with verdict bands), makes the creative judgment calls the script can't (asset ↔ beat fit, cut quality, voiceover sync), and signs **PASS / FIX NEEDED** with per-file fixes.

**Step 7c — fix loop.** Any FAIL (or an auditor-flagged WARN) → fix the storyboard/composition → re-run `audit-asset-reel.mjs` → re-cut/re-render → re-submit to a fresh auditor. **Nothing is delivered until the auditor signs off PASS.** The `asset-reel-audit.md` ships with the pack.

---

## Styles (wizard picks one)

| Style | Vibe | Assets | Text treatment |
|---|---|---|---|
| **Documentary Vox** (`documentary`) | news/investigative | footage, interviews, B-roll | bold serif headlines + highlighter sweeps (cream bg cards) |
| **Product / Aesthetic** (`aesthetic`) | brand, luxury | product shots, close-ups, photos | minimal serif lower-third, letterboxed, champagne accent |
| **Storytime Montage** (`montage`) | reddit/story | quick cuts, memes, screenshots | bold captions, chat-style pops, flash cuts |

---

## HTML skeleton (asset layer + text overlay)

```html
<style>
  .stage { position: relative; width: 1080px; height: 1920px; overflow: hidden;
           background: #0a0a0d; color: #f5f2ea; font-family: 'Georgia', serif; }
  /* z-1: asset clips — one per beat, clipped, cover-cropped */
  .asset-clip { position: absolute; inset: 0; overflow: hidden; z-index: 1; opacity: 0; }
  .asset-clip video, .asset-clip img { width: 100%; height: 100%; object-fit: cover; }
  /* z-2: readability backplate behind the text zone */
  .backplate { position: absolute; left: 0; right: 0; top: 35%; bottom: 65%; z-index: 2;
               background: linear-gradient(180deg, transparent, rgba(0,0,0,0.55), transparent); }
  /* z-3: text */
  .text-container { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);
                    width: 75%; text-align: center; z-index: 3; }
  .title-large { font-size: clamp(3.8rem, 7.5vw, 6.8rem); line-height: 1.25; letter-spacing: -0.02em; }
  .highlight-text { color: #e5c158; font-style: italic; }
  /* z-10: grain */
  .noise-overlay { position: absolute; inset: 0; z-index: 10; opacity: 0.06; pointer-events: none; }
</style>

<div class="stage" data-composition-id="reel" data-start="0" data-width="1080" data-height="1920">
  <!-- z-1: pre-cut asset clips (muted video / cover images) -->
  <div id="asset1" class="asset-clip" data-start="0" data-duration="3">
    <video muted playsinline preload="auto" src="assets/cuts/beat_01.mp4"></video>
  </div>
  <div id="asset2" class="asset-clip" data-start="3" data-duration="2.5">
    <img src="assets/cuts/beat_02.mp4" alt="" />
  </div>

  <!-- z-2 + z-3 -->
  <div class="backplate"></div>
  <div class="text-container">
    <div id="scene1" class="clip" data-start="0" data-duration="3">
      <h1 class="title-large">Nobody teaches you <span class="highlight-text">this.</span></h1>
    </div>
  </div>

  <!-- z-10: grain -->
  <svg class="noise-overlay" xmlns="http://www.w3.org/2000/svg">
    <filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" stitchTiles="stitch"/>
      <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.12 0"/></filter>
    <rect width="100%" height="100%" filter="url(#noise)"/>
  </svg>
</div>

<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"></script>
<script>
  const tl = gsap.timeline({ paused: true });
  const D = 6;

  // Assets: show only inside their beat window; Ken Burns = transform-only.
  tl.set("#asset1", { display: "block" }, 0);
  tl.fromTo("#asset1 video", { scale: 1.0 }, { scale: 1.08, duration: 3, ease: "none" }, 0); // slow push-in
  tl.set("#asset1", { display: "none" }, 3);

  tl.set("#asset2", { display: "block" }, 3);
  tl.fromTo("#asset2 img", { scale: 1.12 }, { scale: 1.0, duration: 2.5, ease: "none" }, 3); // slow pull-out
  tl.set("#asset2", { display: "none" }, 5.5);

  // Text overlay (same pattern as text-motion-reels).
  tl.from("#scene1", { opacity: 0, y: 40, duration: 0.6, ease: "power2.out" }, 0);

  window.__timelines = window.__timelines || {};
  window.__timelines.reel = tl;
</script>
```

> Note: the renderer seeks `video[data-start]` per frame — the `data-start`/`data-duration` on the `.asset-clip` wrapper drive it. Keep `duration` here == the clip duration from Stage 2.

---

## Example prompts & how to use

Just ask any agent CLI (Claude Code, Cursor, Codex, Gemini CLI, …) once the skill is installed — the agent runs the whole 6-stage workflow from one prompt.

### Example prompts (copy-paste)

**1. Documentary Vox from footage**
> "Using the video-asset-reels skill, make a 15-second reel from the clips in `assets/footage/`. Hook: 'Nobody is talking about this.' Add captions per beat, a Kokoro voiceover, render in 4K, and write the caption pack."

**2. Product / aesthetic from photos**
> "Turn these 5 product photos in `assets/products/` into a 12-second aesthetic reel with luxury lower-third captions. Style: Product/Aesthetic. Add a voiceover and captions."

**3. Storytime montage from mixed assets**
> "Cut the screenshots and clips in `assets/story/` into a storytime montage reel, hook: 'I read this and couldn't sleep.' Fast cuts, bold captions, voiceover, 4K output."

**4. Fully scripted (you give the script + assets)**
> "Make a reel from `assets/clips/`: 15s, these beats — [beat 1 text] / [beat 2 text] / [beat 3 text]. Use one clip per beat and a calm voiceover."

### What the agent does after your prompt

1. Runs a mini-wizard: picks a style (Documentary / Aesthetic / Montage), confirms beat count
2. Runs the asset gate: `node scripts/check-assets.mjs --dir assets` — probes + validates + aliases every asset and auto-arranges the best-fit ones into a draft `storyboard.json` + `assets-report.md` (original filenames kept)
3. Fills the per-beat texts (or uses the ones you gave) and swaps any content mismatch — then cuts: `node scripts/cut-assets.mjs storyboard.json`
4. Composes the 1080x1920 HTML (asset layer + text overlay + grain) with a paused GSAP timeline
5. Renders 4K → `output/{name}/` (+ muxes the -14 LUFS voice+bed mix)
6. Writes `caption.md` (all sections 500–900 chars, no hashtags)

### Required inputs from the user

- **Assets**: a folder of video clips and/or images (their own footage, or CC0/CC-BY/MIT sources — never CC-NC)
- **Topic or hook** (optional — the agent writes the beat sheet if not provided)
- **Duration** (optional, default 15s)

---

## Production checklist

- [ ] Beat sheet: hook → agitate → payoff → CTA; one asset per beat; 3–6 words text per beat
- [ ] `check-assets.mjs` run on the assets folder → `assets-report.md` + draft `storyboard.json`; every beat text filled (hook in beat 1, CTA in the last)
- [ ] `storyboard.json` written; every beat has `id, src, in (videos), duration, start, text`
- [ ] `cut-assets.mjs` produced one clip per beat (1080x1920, H.264, muted, exact duration)
- [ ] HTML: assets at z-index 1, backplate z-2, text z-3, grain z-10; videos `muted playsinline preload="auto"`
- [ ] GSAP timeline registered on `window.__timelines.reel`; text at beat starts; Ken Burns transform-only
- [ ] No SMIL, no Math.random, no audio elements in the HTML
- [ ] Voiceover generated + auto-fit into every beat window (FITS ✓) and mixed to -14 LUFS
- [ ] Rendered 4K into `output/{name}/` with `--scale 2` (+ `--audio` for the mix)
- [ ] `caption.md` written via `generate-caption.mjs` — all sections 500–900 chars, no hashtags
- [ ] `hyperframes check` passes; two identical renders are identical
- [ ] Story spine complete: open loop (hook) → rising tension → payoff → loop ending; no beat survives the fluff rule
- [ ] ≥3 addiction levers used (curiosity gap · serialization · variable reward · pattern interrupt · relatability · commitment bait)
- [ ] Beats form one story — beat 1 opens the loop, middle beats escalate, last beat pays off + loops; assets chosen to escalate
- [ ] **Audit harness run:** `audit-asset-reel.mjs` → automated checks (storyboard, cuts, HTML determinism, output, caption) — exit 0
- [ ] **Asset-reel-auditor subagent** (fresh eyes) completed the asset-reel scorecard (/50 ≥ 35) and signed **PASS / FIX NEEDED** in `asset-reel-audit.md`
