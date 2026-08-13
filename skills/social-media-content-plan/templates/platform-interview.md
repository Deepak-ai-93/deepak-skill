# Platform Interview — social-media-content-plan

Use this to capture what you need before writing `plan.json`. In chat, ask these
inline (each answer optional — "skip — you decide" is a valid answer; defaults
are in brackets).

## 1. The platform wizard (exactly 3 questions, in order)

| # | Question | Why it matters |
|---|---|---|
| 1 | **Which platforms?** (multi-select: Instagram · X · LinkedIn · TikTok · YouTube (Shorts + long-form) · Facebook · Threads — pick **max 4**) | Each platform gets its own native strategy section. More than 4 = a sprint nobody can sustain. [Default: Instagram + X] |
| 2 | **Niche, audience, goal** — What do you create about? Who is it for? What outcome are you chasing (views / followers / leads / sales)? | The niche cluster the algorithm has to learn; the goal defines the CTA and the metrics. [Default: your niche · general audience · views] |
| 3 | **Current state + time budget** — Followers now? What did the last 30 days look like (views up / down / flat)? How many hours/week can you ACTUALLY post and engage? | A plan that needs 15 h/week from someone with 5 fails by day 5. The time budget sets the cadence in `plan.json`. [Default: unknown · flat · 5 h/week] |

## 2. The details that make the plan real (ask after the wizard, only if answers aren't obvious)

- **Proof arsenal** — 3 wins / numbers / client results / stories you can reference. (Posts with a specific outcome outperform generic advice on every 2026 algorithm.)
- **What you'd never post** — tone boundaries and off-limit topics (keeps the hook bank on-brand).
- **Existing assets** — do you have footage, screenshots, testimonials, or past posts that performed? (The calendar can schedule repurposing days.)
- **Voice/name** — what should the creator name in the plan be? (Used in `plan.json` as `creator`.)
- **Start date** — when does Day 1 begin? [Default: next Monday]
- **Competitors you respect** — 2–3 accounts in the niche (they become the comment-and-engage targets in `engagement.md`).

## 3. What the answers become

| Answer | Goes into |
|---|---|
| Platforms + cadence + best times + formats | `plan.json` → `platforms[]` |
| Niche / audience / goal / creator / start date | `plan.json` top-level |
| Pillars with shares summing to 1 | `plan.json` → `pillars[]` → `pillars.md` |
| Hook formulas (≥ 8) + CTAs (≥ 3) | `plan.json` → `hooks[]` / `ctas[]` → `calendar.md` |
| Proof arsenal + tone boundaries + competitors | `strategy.md` + `engagement.md` |

> **After the interview, run the playbook for the chosen platforms**
> so `strategy.md` is grounded in how those algorithms actually rank:
> ```bash
> node scripts/platform-playbook.mjs --platform instagram,x,linkedin
> ```
