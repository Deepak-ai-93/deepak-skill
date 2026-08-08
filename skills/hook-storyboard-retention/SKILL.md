---
name: hook-storyboard-retention
description: Write scroll-stopping hook copy, engineer watch-time and retention, and build beat-by-beat storyboards for Instagram Reels, TikTok, and YouTube Shorts with the script and video timeline generated in sync.
---

# skill: hook-storyboard-retention

**Name:** Hook Copywriting + Storyboard + Retention Engineering for Reels/Shorts
**Description:** Use this skill to write scroll-stopping hook copy, engineer watch-time (retention), and build beat-by-beat storyboards for Instagram Reels, TikTok, and YouTube Shorts — with the script and the video timeline generated together as one synchronized unit (HyperFrames-compatible). Pairs with `text-only-motion-reels` for faceless kinetic-typography videos.

---

## When to use

Use this skill whenever the user asks to:
- "Write a hook for a reel / short"
- "Make content that keeps people watching / increases watch time"
- "Make a storyboard for a short video"
- Create a script + video that must be in sync (content and video generation working together)

---

## The attention math (research-backed)

- **50–60%** of viewers drop off within the first **1.7–3 seconds** → the hook is 90% of the video
- High-retention hooks achieve **70%+ intro retention**
- Platforms push videos toward **70–76%+ average completion** → engineer for retention, not luck
- **60–80%** of shorts are watched on mute → text must carry the message
- Dynamic/word-level captions can boost retention by **15–25%**
- A visual change every **1.5–2 seconds** matches mobile attention span

---

## 0. Trend research & brainstorming (go viral on purpose)

Before writing any hook, find out what is **rising right now** in the niche. Research first, brainstorm second — never settle on the first idea:

1. **Harvest signals** — if the `video-product-pipeline` skill is installed, run `node scripts/trend-hunt.mjs --niche "{topic}" --subreddits "{r1},{r2}" --geo US` (Reddit top-of-day + Google Trends, no API key); then web-research **TikTok Creative Center, X trending, YouTube Trending**, and niche subreddits. **Freshness rule:** rising > peaked — nothing older than ~14 days. Note date + source per signal.
2. **Brainstorm ≥5 angles** — hook-formula remix (apply each formula in Section 1 to the trend topic), audience lens (beginner / skeptic / expert), pain-first (mine the Reddit signals for the most repeated pain).
3. **Score with the viral scorecard (1–5 each, /35):** Relatability · Curiosity gap · Hook strength · Format fit · Trend momentum · Mute-first clarity · Loopability. **Winner rule:** highest score; tie → strongest curiosity gap.
4. **Lock the winner** — it becomes the hook (Section 1) and the beat sheet (Section 3). Engineered virality = trend momentum + proven hook formula + mute-first craft, not luck.

---

## 1. Hook copywriting formulas (stop the scroll)

Pick ONE hook formula per video. Fill the blanks from the niche.

| Formula | Mechanism | Template | Example |
|---|---|---|---|
| **Curiosity gap / open loop** | Incomplete info → brain demands closure | "Nobody is talking about this [Topic] strategy…" | "The craziest thing happened at our retreat. Wait till you hear the ending." |
| **Contrarian / pattern break** | Challenges a belief → viewer must evaluate | "Everything you knew about [Subject] is WRONG." | "Stop running ads that don't convert — do this instead." |
| **Results-first / authority** | High-stakes outcome → "how did they do that?" | "How I went from [X] to [Y] in just [Time]." | "How I went from 0 to 10k followers in 3 months — steal my blueprint." |
| **Specific number / list** | Numbers = clarity + fast structured value | "X things that feel illegal to know about [Niche]." | "These 3 scripts feel illegal to know. #3 is the easiest to copy." |
| **Pain point / loss aversion (PAS)** | Spotlight the pain, promise relief | "Stop [Pain Point] right now. Instead, do this." | "Stop losing money on ads. One targeting trick doubled my results." |

**Hook rules:**
- Write the hook as the **first frame of text** — no logos, no "hey guys", no slow intro
- Use the most visually dense frame as frame 1
- One hook per video; the rest of the script is the payoff for that hook

---

## 2. Retention engineering (keep them watching)

### The retention curve — diagnose before you write

| Pattern | Cause | Fix |
|---|---|---|
| **The Cliff** (0–3s drop) | Slow intro, logo, greeting | Start mid-action / on the boldest text |
| **The Hump** (mid-video drop) | Pacing stalls | Visual/conceptual shift every 1.5–2s |
| **The Plateau / Loop** (target) | Flat retention 70%+, rewatch spike | Loop architecture: last frame matches first |

### Tactics
1. **Pacing density** — new visual, cut, or text swap every **1.5–2 seconds**
2. **Mute-first text** — word-by-word or phrase captions; 2–4 words per frame in the setup
3. **Open loops + delayed payoff** — pose the question in the hook, resolve it only in the final 3 seconds
4. **Pattern interrupts** — a scale pop, color flash, or beat-synced emphasis exactly where the hump would form
5. **Loop ending** — final frame mirrors frame 1 so rewatch counts as a second view

---

## 3. Storyboard beat sheet (15–60s template)

| Time | Beat | Objective | Text-on-screen rule |
|---|---|---|---|
| **00:00–00:03** | **Hook** | Stop the scroll; open loop | Bold statement, high contrast, top/middle third |
| **00:03–00:10** | **Setup / Agitate** | Validate the problem, raise stakes | 2–4 words per frame; flash key trigger words |
| **00:10 → end−3s** | **Payoff / Value** | Deliver rapid insights/beats | Clean captions synced to rhythm |
| **end−3s → end** | **Loop + CTA** | Replay / share / follow | Short prompt: "Save for later", or cliffhanger |

**Beat count rule of thumb:** total seconds ÷ 2 ≈ number of visual beats. A 20s reel ≈ 10 beats.

---

## 4. Script ↔ storyboard ↔ video sync (dual-column blueprint)

Content and video generation work together **line by line**. Every script clause = one visual beat = one timed text element.

| Time | Audio / Script (3–5 word blocks) | Visual / Motion | Text on screen |
|---|---|---|---|
| 0.0s | "Everything you knew about habits…" | Dark bg, push-in zoom | HOOK in bold serif |
| 1.5s | "…is wrong." | Snap to center, beat pop | "WRONG." in accent color |
| 3.0s | "Your brain runs on cues." | Grid reveal | "CUES" highlighted |
| … | … | … | … |

**Synchronization rule:** every clause change triggers a visual shift (zoom, cut, or animated text transition) — this maintains the 1.5–2s stimulus cycle that keeps the retention curve flat.

---

## 5. Generating the video from the storyboard (HyperFrames)

The storyboard IS the composition map. Each beat becomes a `.clip` element with `data-start` / `data-duration`; each script clause becomes a GSAP timeline position.

```html
<div class="stage" data-composition-id="reel" data-start="0" data-width="1080" data-height="1920">
  <!-- Beat 1: HOOK (0-3s) -->
  <h1 id="hook" class="clip" data-start="0" data-duration="3" data-track-index="0">Everything you knew about habits…</h1>
  <!-- Beat 2: PATTERN BREAK (3-4.5s) -->
  <p id="twist" class="clip" data-start="3" data-duration="1.5" data-track-index="0">…is wrong.</p>
  <!-- Beat 3: VALUE (4.5-6s) -->
  <p id="cue" class="clip" data-start="4.5" data-duration="1.5" data-track-index="0">Your brain runs on cues.</p>
</div>

<script>
  const tl = gsap.timeline({ paused: true });
  tl.from("#hook",  { opacity: 0, y: 40, scale: 0.9, duration: 0.5 }, 0);
  tl.from("#twist", { opacity: 0, scale: 1.4, color: "#ffd60a", duration: 0.4 }, 3);   // pattern interrupt
  tl.from("#cue",   { opacity: 0, x: 80, duration: 0.4 }, 4.5);
  window.__timelines = window.__timelines || {};
  window.__timelines.reel = tl;
</script>
```

**Rule:** if the storyboard says a beat lands at 3.0s, `data-start="3"` AND the timeline position both say `3`. Content and video are one artifact.

---

## Production checklist

- [ ] One hook formula chosen (curiosity / contrarian / results / list / PAS)
- [ ] Hook occupies the first 3 seconds — no slow intro
- [ ] Beat sheet written: hook → setup → payoff → loop+CTA
- [ ] Beat count ≈ seconds ÷ 2
- [ ] Script written in 3–5 word blocks, each mapped to a visual beat
- [ ] Visual shift every 1.5–2s (pacing density)
- [ ] Open loop opened in hook, closed in final 3s
- [ ] Readable on mute (60–80% watch without sound)
- [ ] Loop ending: last frame ≈ first frame
- [ ] Storyboard timings match `data-start`/`data-duration` and GSAP positions exactly
- [ ] `hyperframes check` passes, preview OK, render deterministic
