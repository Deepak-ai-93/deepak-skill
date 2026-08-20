---
name: content-repurposing-hub
description: Turn ONE source idea/asset (blog post, thread, podcast, video, idea) into a platform-native multi-channel content pack — angle per platform (X thread ≠ LinkedIn post ≠ carousel ≠ newsletter ≠ blog ≠ Shorts), no copy-paste duplicates (each piece rewritten for its platform's native format, enforced by repurpose-writer.mjs), a cross-post calendar with one CTA per piece, and an audit harness (audit-repurpose.mjs → a fresh repurpose-auditor subagent scores hub-worthiness /50 and signs PASS / FIX NEEDED before delivery).
---

<!-- ════════════════════════════════════════════════════════════════════════
     🎬 deepak-skill — crafted by Deepak · skill: content-repurposing-hub
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

**🎬 deepak-skill — crafted by Deepak** · skill: `content-repurposing-hub` · [deepak-skill on GitHub](https://github.com/Deepak-ai-93/deepak-skill) · MIT

# skill: content-repurposing-hub

**Name:** Content Repurposing Hub — one idea, every platform, natively
**Description:** Turns ONE source (blog post / podcast / video / thread / even a bare idea) into a **multi-channel content pack with a per-platform angle**: `repurpose-plan.json` (the source + the goal + the chosen platforms) → `hub-plan.md` (one piece per platform, each with its **native angle + format + hook + CTA**, rewritten for the platform — never copy-paste duplicates, enforced by `repurpose-writer.mjs`) → `calendar.md` (the cross-post order + spacing) + `repurpose-audit.md` (the audit harness output). This is the **orchestrator** skill: it decides WHAT each platform gets, then delegates the actual production to the producer skills (`x-growth`, `newsletter-growth`, `carousel-post-images`, `blog-seo-content`, `podcast-to-shorts`, …).

---

## Storytelling + addiction rails (the universal contract — read before anything else)

Every deliverable this skill produces must tell **ONE micro-story** and engineer **rewatch**. These rails are the SAME contract every video/image skill in this repo follows — apply them to every beat, scene, slide, shot or clip before it ships.

**Applied to repurposing:** the SOURCE is one story; each platform piece is a **native retelling of the same story** — every piece opens a loop (its platform's hook), escalates (the platform's native tension: thread beats, carousel slides, subject line), pays off (the source's aha), and loops (the platform's CTA). The repurposing sin is copying: a pasted paragraph on a new platform opens NO loop because the audience has seen it. Each retelling must be rewritten for the platform's consumption pattern — that's what keeps the story addictive on every channel.

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
| **One source, one story, per-platform angles (the #1 rail)** | The pack starts from ONE source and gives every platform a **native angle** (from `templates/platform-angles.md`): the X thread leads with the contrarian claim, the newsletter leads with the story, the LinkedIn post leads with the lesson, the carousel leads with the list, the Shorts lead with the clip. Same story, different entry points — never a copy-paste repost. |
| **No duplicates — the anti-repost rule** | No two pieces share the same lead/hook text. `repurpose-writer.mjs` enforces a near-duplicate check (normalized sentence overlap) and exits 1 if two pieces open with the same line. Each piece is rewritten for its platform's native format. |
| **≥ 2 platforms, one CTA each** | The plan covers ≥ 2 platforms (or 1 + the source's home). Every piece has exactly ONE CTA that matches its platform (follow / subscribe / save / comment / read-more). |
| **Platform-native format** | X = thread (5–9 tweets) · LinkedIn = story/lesson post · Newsletter = story-first issue · Carousel = 7–10 slides · Blog = SEO article · Shorts = 30–60s clip. The plan names the format per platform; the producer skill builds it. |
| **Cross-post calendar** | `calendar.md` spaces the posts (same story on 4 platforms on one day = self-competing; stagger + lead with the best-fit platform). |
| **Audited before delivery (the harness)** | Stage 6 is a harness, never a self-check: `audit-repurpose.mjs` runs the automated checks (source, platform count, per-platform angles, no near-duplicates, CTAs, calendar) → a FRESH repurpose-auditor subagent scores hub-worthiness (/50, ≥ 35 = worth shipping) → fix loop until signed **PASS** in `repurpose-audit.md`. |

---

## When to use

- "Repurpose my blog post / podcast / thread into everything"
- "One idea — I want it on X, LinkedIn, my newsletter and a carousel, done natively"
- "Turn this YouTube video into shorts + a blog + a thread"
- "I keep posting the same thing everywhere — make me a repurposing system"

**Complements:** the **producer skills** this hub delegates to: `x-growth` · `newsletter-growth` · `carousel-post-images` · `blog-seo-content` · `podcast-to-shorts` · `linkedin-personal-brand` · `social-media-content-plan` (the hub plan slots into the calendar) · `youtube-video-pipeline` (long-form source → hub). Install the producers with `npx skills add Deepak-ai-93/deepak-skill --all` so the plan is executable.

---

## Workflow (6 stages)

### Stage 1 — Capture the source (ask ≤3 questions if vague)
Extract: **source** (the idea, or a link/transcript — blog post, podcast episode, video, existing thread) · **the ONE story/idea it sells** (the aha that travels) · **audience** · **goal** (reach / followers / subscribers / SEO / sales) · **platforms** (which channels the audience lives on; default: the source's home platform + 1–3 more) · **time budget**. Lock the story: every retelling must carry it.

### Stage 2 — Read the source, extract the angle bank
If the source is text (article/transcript), read it and pull: the **hook** (the opening), the **3–5 key beats/numbers**, the **aha/payoff**, the **quotable line**, the **proof** (stats, examples). If it's a bare idea, build these from the idea. This angle bank feeds every platform piece — each piece uses the SAME beats but a DIFFERENT entry point.

### Stage 3 — Write the plan → `repurpose-plan.json`
The creative contract the script enforces:
- `source` (title/type), `story` (the one idea), `audience`, `goal`, `cta` (the primary CTA)
- `platforms[]` — ≥ 2, each with `platform`, `format` (thread / post / issue / carousel / article / short / clip), `angle` (the native entry point — from `templates/platform-angles.md`), `hook` (the opening line — MUST differ from other platforms' hooks), `producer` (which skill builds it), `cta` (this platform's ask)

### Stage 4 — Build + validate → `hub-plan.md` (automated, exit 1 on bad plans)
```bash
node scripts/repurpose-writer.mjs --plan repurpose-plan.json --out hub-plan.md
```
The script validates: source + story present · ≥ 2 platforms · every platform has format/angle/hook/producer/cta · **no near-duplicate hooks** (normalized overlap check) · every hook ≤ 280 chars · anti-fluff blocklist. **Exits 1 on any FAIL** and writes nothing. On clean it writes the polished `hub-plan.md` — the angle bank + per-platform cards (platform, format, angle, hook, producer, CTA) — the handoff to the producer skills.

### Stage 5 — Write `calendar.md`
The cross-post order: lead with the platform where the audience is biggest, stagger the rest (≥ 24h apart; same story on 4 platforms in one day self-competes). Note which producer skill executes each piece and when.

### Stage 6 — Audit harness (automated checks + repurpose-auditor subagent, before delivery)
**Step 6a — run the automated audit harness:**
```bash
node scripts/audit-repurpose.mjs --pack <hub-folder> --out repurpose-audit.md
```
`audit-repurpose.mjs` scans the pack and checks everything a script can: hub-plan.md (source + story present, ≥ 2 platforms, per-platform format/angle/hook/cta, no near-duplicate hooks, hooks ≤ 280 chars, fluff blocklist) and calendar.md presence. Writes `repurpose-audit.md` (automated verdicts + scorecard scaffold). **Exit 1 on any FAIL.**

**Step 6b — spawn the repurpose-auditor subagent** — a FRESH subagent (never self-audit) with the exact brief from `templates/repurpose-auditor-brief.md`: reads `repurpose-audit.md` + all pack files, completes the **hub-worthiness scorecard** (10 criteria, /50 — **≥ 35 = worth shipping**, with verdict bands), makes the creative judgment calls the script can't (is each angle truly native to its platform, does every piece carry the same story, would the calendar actually build audience, are the CTAs right), and signs **PASS / FIX NEEDED** with per-piece fixes.

**Step 6c — fix loop.** Any FAIL (or an auditor-flagged WARN) → fix `repurpose-plan.json` → re-run `repurpose-writer.mjs` + `audit-repurpose.mjs` → re-submit to a fresh auditor. **Nothing is delivered until the auditor signs off PASS.** The `repurpose-audit.md` ships with the pack.

---

## Production checklist

- [ ] ONE source + the ONE story it sells, locked (the aha that travels)
- [ ] Angle bank extracted: hook, 3–5 beats, aha, quotable line, proof
- [ ] ≥ 2 platforms, each with a NATIVE angle (no copy-paste repost)
- [ ] No near-duplicate hooks across pieces (script-enforced, exit 1 on overlap)
- [ ] Every piece: format + hook + producer skill + exactly ONE platform-native CTA
- [ ] Anti-fluff blocklist clear; hooks ≤ 280 chars
- [ ] `repurpose-writer.mjs` ran clean (exit 0) → `hub-plan.md`
- [ ] `calendar.md`: staggered cross-post order, lead platform first, producer + date per piece
- [ ] **Audit harness run:** `audit-repurpose.mjs` → automated checks (source, platform count, angles, no duplicates, CTAs, calendar) — exit 0
- [ ] **Repurpose-auditor subagent** (fresh eyes) completed the hub-worthiness scorecard (/50 ≥ 35) and signed **PASS / FIX NEEDED** in `repurpose-audit.md`
- [ ] Delivery: `hub-plan.md` + `calendar.md` + `repurpose-audit.md` (then delegate each piece to its producer skill)
