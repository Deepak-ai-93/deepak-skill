---
name: social-media-content-plan
description: Build a platform-native content plan (7/14/30/90 days) engineered to re-train a stalled social algorithm and start getting thousands of views — user selects platforms (Instagram, X, LinkedIn, TikTok, YouTube (Shorts + long-form), Facebook, Threads), then gets: research-brief + validation (/35 scorecard + earning math → validation.md), per-platform 2026 strategy (platform-playbook.mjs), pillars + hook bank, searchable calendar (calendar.md + calendar.html via build-calendar.mjs + Fuse.js), first-60-min protocol, metrics/review loop, companion gate + audit harness (audit-content-plan.mjs --search + X zero-hashtag rail + fresh auditor /60 >=42). Git-safe: docs/pack tracked vs output/.vibe ignored.
---

<!-- ════════════════════════════════════════════════════════════════════════
     🎬 deepak-skill — crafted by Deepak · skill: social-media-content-plan
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

**🎬 deepak-skill — crafted by Deepak** · skill: `social-media-content-plan` · [deepak-skill on GitHub](https://github.com/Deepak-ai-93/deepak-skill) · MIT

# skill: social-media-content-plan

**Name:** Social Media Content Plan — platform-native algorithm-reset planning
**Description:** Turns a stalled or new social account into a **content plan (7/14/30/90 days) engineered to re-train the algorithm** — the user picks platforms and gets: a research-brief + validation (/35 + earning → validation.md), honest per-platform 2026 strategy (reset sprint, native formats, X zero-hashtag rail), 3–4 pillars + hook bank, a **searchable** deterministic calendar (`calendar.md` + `calendar.html` via `build-calendar.mjs` with Fuse.js, URL-synced, keyboard), first-60-minute protocol, metrics/review loop, companion gate and audit harness (`audit-content-plan.mjs --search` + auditor `/60 ≥42`). Git-safe: `docs/pack/` tracked, `output/.vibe` ignored.

---

## The quality bar (non-negotiable — read before anything else)

| Rail | Rule |
|---|---|
| **Platform-native, never copy-paste** | Every post is engineered for the algorithm it's posted to: native formats, aspect ratios, hook timing, and caption style per platform. Recycled cross-posts with watermarks are distribution-killed on every 2026 algorithm — adapting ≠ copying. |
| **The reset is honest** | There is no algorithm "reset button" and no guaranteed view count. The reset is a **14-day re-training sprint**: dense, consistent, niche-clustered signals (cadence + first-60-minute engagement velocity + completion/share content) that give the recommendation model a clear embedding of your account. Any claim must tie to a real ranking signal — no "hack", no "instant virality", no guaranteed numbers. |
| **Interest-graph first** | All major 2026 platforms rank on interest-graph embedding, not follower count. Niche consistency beats hashtags; engagement velocity in the first 60 minutes decides second-tier distribution. The plan clusters every post into 3–4 pillars so the model learns exactly who to show you to. |
| **Hook in the first 1.5–3 seconds (video) / first 2 lines (text)** | Every calendar entry ships with a hook from the hook bank — curiosity gap, contrarian claim, specific outcome, or pattern interrupt. No entry is "just content". |
| **One CTA per post, save/share-bait over like-bait** | Each post has exactly one CTA. Like-bait and engagement-bait ("Agree? 👇") are banned — they're down-weighted or punished on every platform. |
| **Searchable calendar, not AI slop** | Every pack ships `calendar.html` — instant Fuse.js search (hook/pillar/platform), faceted URL-synced chips, keyboard (`/`, `Esc`), 3 empty states, `<mark>` highlight, typo-tolerant (threshold 0.3). `audit-content-plan.mjs --search` checks it. No `filter(includes)` on server. |
| **X is copy-first, zero hashtags** | If X is selected, a single `#` fails the plan (`audit-content-plan.mjs` X rail). Hook ≤100 chars, 500–800 char thread format, reply-first hour (10 replies) — from `x-growth`. |
| **Earning sanity + validation** | `score-plan.mjs` /35 (niche, reachability, wedge, monetization, feasibility, moat, time-to-signal) → `validation.md` (BUILD/ITERATE/PIVOT) + CPM/sponsor math + guardrail. No calendar without it. |
| **Git-safe (pack tracked, output ignored)** | `docs/pack/` (strategy/pillars/calendar/validation) is tracked; `output/` + `.vibe/` (research raw, audit zips) ignored — `git push` stays clean. |
| **Audited before delivery (the harness)** | Stage 6 is a harness, never a self-check: `audit-content-plan.mjs --search` runs checks (platform coverage, reset, pillars, calendar + `calendar.html`, engagement, metrics, blocklist, X rail, validation) → FRESH auditor scores /60 ≥42 → fix loop until **PASS** in `content-plan-audit.md`. |

---

## When to use

- "My account is dead — give me a content plan to reset the algorithm"
- "I want to start getting thousands of views on Instagram and X"
- "Build me a 30-day content plan for my brand across LinkedIn + Instagram"
- "My reach tanked — what should I post for the next month?"
- "Plan a content calendar that grows my followers on TikTok and Threads"

**Complements (the companion skills that PRODUCE the calendar's posts):** `text-motion-reels` / `veo-cinematic-reels` / `video-asset-reels` (Reels & Shorts) · `video-product-pipeline` (viral spec gate) · `hook-storyboard-retention` (hooks + storyboards) · `carousel-post-images` (4K carousels) · `linkedin-personal-brand` (LinkedIn posts in the user's voice) · `youtube-video-pipeline` (long-form packaging) · `voice-sfx-audio` (voiceovers + mixing) · `paid-ads-studio` (boost the winners once metrics.md shows a pattern). Stage 4b's `check-skills.mjs` gate detects which are installed and installs the missing ones.

---

## Workflow (7 stages — research + validation + searchable calendar)

### Stage 1 — Platform Wizard (exactly 3 questions, in order)
Ask, one at a time, then lock the answers into `plan.json`:
1. **Which platforms?** (multi-select: Instagram · X · LinkedIn · TikTok · YouTube (Shorts + long-form) · Facebook · Threads — max 4 to keep the sprint feasible; default: Instagram + X)
2. **Niche, audience, and goal** — what do you create about, who is it for, and what outcome are you chasing (views / followers / leads / sales)? (defaults: the user's niche, general audience, "views")
3. **Current state + time budget** — follower count, what happened in the last 30 days (views trend up/down/flat), and how many hours/week you can actually post and engage (default: 5 h/week, no posting history).

Then run the playbook for the selected platforms so the strategy is grounded, not invented:
```bash
node scripts/platform-playbook.mjs --platform instagram --platform x   # or: --all
```

### Stage 1b — Research brief (keyless signals + 8-platform teardown)
Harvest demand signals (no API key) + deep research before scoring:
```bash
node scripts/research-plan.mjs --niche "fitness for busy pros" --subreddits "fitness,Entrepreneur" --geo US --out research-brief.md
# then agent fills templates/research-brief.md section 2 (Reddit/X/PH/HN/IndieHackers/G2/SEO/Trends, dated sources, >=2 per criterion)
```
Writes `research-brief.md` scaffold (Reddit top-of-day + Google Trends). Agent completes 8-platform teardown (competitor table, TAM/SAM/SOM, channel matrix, CPM/price anchors, positioning). This feeds the scorecard.

### Stage 2 — Validation (/35 + earning -> validation.md)
Score with evidence, compute verdict deterministically:
```bash
node scripts/score-plan.mjs --scores 5 4 4 5 5 3 4 --out validation.md  # >=30 BUILD · 25-29 ITERATE · <25 PIVOT/KILL
```
Uses `templates/scorecard.md` (7 criteria /35) + kill criteria + earning sanity (CPM proxy, payback) + guardrail (followers/leads/completion by day 30) + validation moves. **No calendar without BUILD (or explicit override).**

### Stage 3 — Honest reset framing + per-platform strategy → `strategy.md`
Open with the honest truth from `templates/algorithm-reset.md` (no reset button; the reset = 14-day re-training sprint; views grow in tiers, not overnight). Then write **one section per selected platform**:
- **How it ranks in 2026** (from `platform-playbook.mjs` — the real signals, e.g. Instagram Reels = watch time/rewatches/shares/saves; LinkedIn = dwell time + first-hour comment velocity; X = engagement velocity + dwell).
- **The reset sprint for this platform** (14-day rules: cadence, niche clustering, first-60-minute protocol, what not to do — deleting underperformers, engagement pods, reply-bait).
- **Formats that win + native rules** (Reels < 90s looped with captions; LinkedIn PDF carousels; X threads as one idea per post; no watermarks, no recycled verticals).
- **Cadence + best times** (from the user's time budget — a plan they can't sustain fails).
- **Hashtag / keyword strategy** (Instagram 3–5 relevant tags + keywords in caption; Threads hashtags work; X minimal; LinkedIn zero hashtags except 2–3 niche ones).

### Stage 4 — Content pillars + hook bank → `pillars.md`
- **3–4 pillars** with explicit shares summing to 1 (e.g. Transformation receipts 40% · Myth-busting 30% · Process 20% · Behind the scenes 10%). Every pillar must be narrow enough that the algorithm can cluster it — "fitness" is not a pillar, "fat-loss myths for busy professionals" is.
- **Hook bank ≥ 8 hooks** from the four proven 2026 patterns (contrarian claim · specific outcome · open loop · pattern interrupt), each tagged to a pillar.
- **Angle bank** — 2–3 fresh angles per pillar so 30 days doesn't feel repetitive.

### Stage 5 — Calendar + engagement + metrics (searchable)
Build the deterministic 30-day calendar from `plan.json`:
```bash
node scripts/build-calendar.mjs --plan plan.json --out calendar.md --days 30  # 7|14|30|90 — also emits searchable calendar.html (Fuse.js, URL-synced)
```
`build-calendar.mjs` validates the plan (platforms, cadence 1–7/week, pillars summing to 1, hook bank ≥ 6, valid start date — **exit 1 on any violation**) and generates a day-by-day calendar with per-post platform / pillar / format / hook / CTA / metric-to-watch, at each platform's cadence, starting from `startDate`.
Then write:
- **`engagement.md`** — the **first-60-minute protocol** (post → engage 30–60 min: reply to every comment, seed 1–2 conversation-starting comments on 5–10 niche accounts, DM-share nudge for share-trigger content), daily engagement budget per platform, comment strategy (add ONE insight, never "Great post!").
- **`metrics.md`** — the 4 signals that correlate with compounding reach (dwell time, completion, save/share rate, follower conversion per post) + the platform-specific dashboard, and the **day-7 / day-14 / day-21 / day-30 review loop**: what to double down on, what to kill.

### Stage 5b — Companion skills gate (now includes earning) (install what the calendar needs)
The calendar schedules posts, but the **sibling skills that produce them** must be installed for the plan to be executable. Run the gate:
```bash
node scripts/check-skills.mjs --out companion-skills.md
# optional filters: --group video | carousel | text-post | long-form | voice | earning
```
It scans the repo's `skills/`, `.agents/skills/`, `.claude/skills/`, `.cursor/skills/`, and the global install dirs, and prints a matrix: **installed ✅ / missing ⚠️ + the exact install command**. The format→skill map (also in `templates/companion-skills.md`):

| Calendar row produces | Companion skill |
|---|---|
| Reels / Shorts (video) | `text-motion-reels` (text-only) · `veo-cinematic-reels` (cinematic AI prompts) · `video-asset-reels` (own clips) · `video-product-pipeline` (viral spec gate) · `hook-storyboard-retention` (hooks + storyboards) |
| Carousels | `carousel-post-images` |
| LinkedIn text posts | `linkedin-personal-brand` |
| YouTube long-form | `youtube-video-pipeline` |
| Voiceovers / audio | `voice-sfx-audio` |

**Show the user the missing list and get their OK, then** install in one shot:
```bash
node scripts/check-skills.mjs --install   # npx skills add … --skill <slug> for each missing one
```
Each calendar row then has a ready handoff prompt (`companion-skills.md`): e.g. a Day-N Reel → *"Using the text-motion-reels skill, make a 15s word-pop reel from the Day N hook…"*. Only skip an install if the user produces that format elsewhere — a plan full of "reel" rows with no video skill installed isn't executable.

### Stage 6 — Audit harness (search + X rail + validation) (automated checks + content-plan-auditor subagent, before delivery)
**Step 5a — run the automated audit harness:**
```bash
node scripts/audit-content-plan.mjs --pack <plan-folder> --platforms instagram,x --search --out content-plan-audit.md
```
`audit-content-plan.mjs --search` checks: `strategy.md`/ `pillars.md`/ `calendar.md`+`calendar.html` (search Fuse.js, a11y, URL sync, empties) / `engagement.md`/ `metrics.md`, plus extended blocklist, **X zero-hashtag rail** (if X selected, `#` fails) and `validation.md` (/35). Writes `content-plan-audit.md` (automated verdicts + scorecard scaffold). **Exit 1 on any FAIL.**

**Step 5b — spawn the content-plan-auditor subagent** — a FRESH subagent (never self-audit) with the exact brief from `templates/content-plan-auditor-brief.md`: reads `content-plan-audit.md` + all pack files, completes the **plan-worthiness scorecard** (12 criteria, /60 — **≥ 42 = worth posting**, with verdict bands), makes the creative judgment calls the script can't (hook strength, pillar clustering tightness, sustainability of cadence, honesty of the reset claims), and signs **PASS / FIX NEEDED** with per-file fixes.

**Step 5c — fix loop.** Any FAIL (or an auditor-flagged WARN) → fix the file → re-run `audit-content-plan.mjs` → re-submit to a fresh auditor. **Nothing is delivered until the auditor signs off PASS.** The `content-plan-audit.md` ships with the pack.

### Stage 7 — Deliver + the operating loop (git-safe)
Deliver `strategy.md` + `pillars.md` + `calendar.md` + `calendar.html` + `validation.md` + `engagement.md` + `metrics.md` + `research-brief.md` + `content-plan-audit.md` (in `docs/pack/` tracked; `output/.vibe` ignored). Hand over day-1 script: post → run the first-60-minute protocol → log the 4 signals → post again tomorrow. After day 7, the user reports the numbers and the calendar adjusts — doubling down on what the data says their audience clicks, killing what it doesn't.

---

## Production checklist

- [ ] **Platform Wizard (3 questions)**: platforms selected (≤ 4), niche + audience + goal, current state + time budget — all captured
- [ ] `research-plan.mjs` scaffold + 8-platform teardown → `research-brief.md` (dated sources, ≥2 per criterion)
- [ ] `score-plan.mjs` /35 → `validation.md` (BUILD/ITERATE/PIVOT, earning math, guardrail) — no calendar without BUILD
- [ ] `platform-playbook.mjs` run for every selected platform
- [ ] `strategy.md`: one native section per platform (how it ranks, reset sprint, formats, cadence + times, hashtags/keywords, pitfalls) — honest reset framing, no "hack"/"guaranteed" claims
- [ ] `pillars.md`: 3–4 narrow pillars with shares summing to 1, hook bank ≥ 8 tagged to pillars, angle bank
- [ ] `calendar.md` + `calendar.html`: 7/14/30/90 days via `build-calendar.mjs --days N` (validated, exit 0) — per-post pillar/format/hook/one-CTA/metric + searchable HTML (Fuse.js, URL-synced, a11y, empties)
- [ ] `engagement.md`: first-60-minute protocol + daily engagement budget + comment strategy (never "Great post!")
- [ ] **Companion gate run:** `check-skills.mjs --out companion-skills.md` (+ `--group earning` for sponsorship/paid-ads) — missing producers surfaced + installed, handoff prompts available
- [ ] `metrics.md`: dwell/completion/save-share/follower-conversion signals + day-7/14/21/30 review loop
- [ ] **Audit harness run:** `audit-content-plan.mjs --search` → checks (platform coverage, reset, pillars, calendar+calendar.html, engagement, metrics, blocklist, X rail, validation) — exit 0
- [ ] **Content-plan-auditor subagent** completed scorecard (/60 ≥ 42, 12 criteria: +Search UX +Earning) and signed **PASS / FIX NEEDED** in `content-plan-audit.md`
- [ ] Delivery: `strategy.md` + `pillars.md` + `calendar.md` + `calendar.html` + `validation.md` + `engagement.md` + `metrics.md` + `research-brief.md` + `content-plan-audit.md` + day-1 script (docs/pack tracked)
