---
name: youtube-video-pipeline
description: Plan long-form YouTube videos that get clicked and watched — topic + search research → script with retention hooks → 10-variant title pack (CTR-tested formulas) → thumbnail brief (and image-gen prompt) → description + chapters + tags. Includes a title-pack script (scores variants against CTR formulas + length limits) and reuses the repo's hook and anti-fluff playbooks for the video's opening 30 seconds.
---

# skill: youtube-video-pipeline

**Name:** YouTube Video Pipeline — script, title, thumbnail, description
**Description:** Takes a YouTube topic and produces the **full packaging stack** that determines whether a video gets clicked and watched: a **retention-engineered script** (hook in the first 30s, open loops, payoff map), a **title pack** (10 variants scored on CTR formulas + 60-char limit), a **thumbnail brief** (with a ready image-gen prompt), and the **description + chapters + tags**. The script and title work together — no clickbait mismatch.

---

## The quality bar (non-negotiable — read before anything else)

| Rail | Rule |
|---|---|
| **Hook in the first 30 seconds** | The script's opening 30s must state the payoff and raise a specific question the rest of the video answers. First-30s retention decides the algorithm. |
| **Title ↔ content truth** | The title + thumbnail promise must be EXACTLY what the video delivers — mismatch = bad retention + dislikes + channel damage. The title pack and script are written together. |
| **Title pack depth** | 10 variants, each ≤ 60 chars (mobile truncates), hook in the first ~5 words, from at least 4 different formulas (question / number / curiosity / how-to / contrarian). No ALL-CAPS walls, no spam words ("shocking", "guaranteed"). |
| **Thumbnail = one idea** | One subject, one emotion, 3–5 words of text max, readable at 160px, consistent channel style. Delivered as a brief + image-gen prompt. |
| **Description + metadata** | Description: hook line + what you'll learn + chapters with timestamps + links. Tags from the research. Closed captions/subs recommended. |
| **Audited before delivery (the harness)** | Stage 6 is a harness, never a self-check: `audit-video-plan.mjs` runs the automated checks (brief, script hook, title pack, thumbnail, metadata) → a FRESH video-plan-auditor subagent scores the video pack (/50, ≥ 35 = worth producing) → fix loop until signed **PASS** in `video-plan-audit.md`. |

---

## When to use

- "Plan a YouTube video about X"
- "Write a script + title + thumbnail for my channel"
- "Give me 10 title ideas for this video"
- "Turn this blog post / episode into a YouTube video"

**Complements:** `video-product-pipeline` (this skill's script can feed its generation stage — or the video can be a full production) · `podcast-to-shorts` (cut the long-form into Shorts after) · `hook-storyboard-retention` (hook formulas) · `blog-seo-content` (repurpose the script into a blog post).

---

## Workflow (6 stages)

### Stage 1 — Analyze the brief (ask ≤3 questions if vague)
Extract: **topic** · **channel context** (niche, audience, existing style — matters for thumbnails) · **goal** (views / subscribers / watch-time / a specific conversion) · **length target** (default 8–12 min) · **any assets** (existing script, blog post, podcast to adapt).

### Stage 2 — Topic + search research → `video-brief.md`
Research the topic on YouTube search + Google (what's already ranking, what angles are missing, what the comments ask). Lock: **the angle** (the specific promise that makes THIS video different) · **target search terms** (2–5, used naturally in title/description/tags) · **the retention promise** (what the viewer gets by the end). Write `video-brief.md` and **get approval** before scripting.

### Stage 3 — Write the script → `script.md`
Beat-by-beat with timestamps and a retention map:
- **0:00–0:30 Hook** — the payoff + a specific question (formula from `hook-storyboard-retention`).
- **0:30–2:00 Open loop + context** — who this is for, what's coming, why it matters (keep it fast).
- **Middle** — 2–4 sections, each with its own mini-hook + payoff (open loops chained so they can't leave).
- **End** — pay off every open loop, one CTA (subscribe should feel earned: "if part 2 helps, here's what's next").
- Timestamps per section for chapters. Word count ≈ 150 words/min (8 min ≈ 1200 words).
- Anti-fluff: every line either informs, proves, or entertains — cut filler ("so yeah", "anyway").

### Stage 4 — Title pack + thumbnail → `titles.md` + `thumbnail.md`
```bash
node scripts/title-pack.mjs --topic "…" --angle "…" --out titles.md
```
The script generates and scores **10 title variants** (CTR formula, length check, keyword presence). The agent then: marks the winner + 2 alternates with rationale, pairs the best 3 with **thumbnail briefs** (one subject, one emotion, ≤5 words of text, 160px-readable), and writes one **image-gen prompt** per thumbnail option (photoreal or style-matched, exact text overlay). Save to `titles.md` + `thumbnail.md`.

### Stage 5 — Description + metadata → `metadata.md`
Description: the hook line + "In this video:" bullet list of sections + chapters with `[timestamps]` + links (related video, website, socials). Tags: the research terms + synonyms (8–15). Subtitle/CAPTION note: upload a clean transcript as captions (helps SEO + accessibility).

### Stage 6 — Audit harness (automated checks + video-plan-auditor subagent, before delivery)
**Step 6a — run the automated audit harness:**
```bash
node scripts/audit-video-plan.mjs --pack <pack-folder> --out video-plan-audit.md
```
`audit-video-plan.mjs` scans the pack and checks everything a script can: video-brief (angle + search terms), script (hook section, timestamps, CTA, anti-fluff), titles.md (10 variants, ≤ 60 chars, ≥ 4 formulas, no spam/ALL-CAPS, winner marked), thumbnail.md (image-gen prompt, ≤ 5-word text, 160px note), and metadata.md (chapters + timestamps, tags, links, captions note). Writes `video-plan-audit.md` (automated verdicts + scorecard scaffold). **Exit 1 on any FAIL.**

**Step 6b — spawn the video-plan-auditor subagent** — a FRESH subagent (never self-audit) with the exact brief from `templates/video-plan-auditor-brief.md`: reads `video-plan-audit.md` + all pack files, completes the **video-pack scorecard** (10 criteria, /50 — **≥ 35 = worth producing**, with verdict bands), makes the creative judgment calls the script can't (title ↔ content truth, hook pull, open-loop payoff), and signs **PASS / FIX NEEDED** with per-file fixes.

**Step 6c — fix loop.** Any FAIL (or an auditor-flagged WARN) → fix the file → re-run `audit-video-plan.mjs` (and `title-pack.mjs` if the titles changed) → re-submit to a fresh auditor. **Nothing is delivered until the auditor signs off PASS.** The `video-plan-audit.md` ships with the pack.

---

## Production checklist

- [ ] Brief analyzed: topic, channel context, goal, length, assets
- [ ] `video-brief.md` researched + **approved** before scripting
- [ ] `script.md`: hook in first 30s, chained open loops, all paid off, timestamps per section, CTA earned
- [ ] `titles.md`: 10 variants, ≤ 60 chars, ≥ 4 formulas, no spam words; winner + alternates with rationale
- [ ] `thumbnail.md`: one idea, ≤ 5 words on the graphic, 160px-readable, matches winner title, image-gen prompt ready
- [ ] `metadata.md`: hook-first description, chapters with timestamps, tags from research, links, captions note
- [ ] **Audit harness run:** `audit-video-plan.mjs` → automated checks (brief, script hook, title pack, thumbnail, metadata) — exit 0
- [ ] **Video-plan-auditor subagent** (fresh eyes) completed the video-pack scorecard (/50 ≥ 35) and signed **PASS / FIX NEEDED** in `video-plan-audit.md`
- [ ] Delivery: `video-brief.md` + `script.md` + `titles.md` + `thumbnail.md` + `metadata.md` + `video-plan-audit.md`
