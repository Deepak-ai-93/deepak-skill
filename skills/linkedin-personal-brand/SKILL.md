---
name: linkedin-personal-brand
description: Build a founder/creator LinkedIn presence that compounds — capture the user's real voice from their writing, then produce a weekly post calendar (thought-leadership sequences with hooks + story + one CTA), a profile bio + headline rewrite, and a comment strategy. Includes a voice-capture template (questions that extract the user's actual phrasing) and reuses the repo's anti-fluff + E-E-A-T playbook for professional credibility.
---

<!-- ════════════════════════════════════════════════════════════════════════
     🎬 deepak-skill — crafted by Deepak · skill: linkedin-personal-brand
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

**🎬 deepak-skill — crafted by Deepak** · skill: `linkedin-personal-brand` · [deepak-skill on GitHub](https://github.com/Deepak-ai-93/deepak-skill) · MIT

# skill: linkedin-personal-brand

**Name:** LinkedIn Personal Brand — posts, bio, voice, strategy
**Description:** Turns a professional's knowledge into a **consistent, credible LinkedIn presence**: a **voice profile** (built from how the user actually talks, not a generic "thought leader" tone), a **weekly post calendar** (2–5 posts: hook-first thought-leadership sequences with a story or data point and ONE CTA), a **headline + About rewrite**, and a **comment + engagement strategy**. E-E-A-T is the whole point — LinkedIn rewards the specific, the experienced, and the honest.

---

## The quality bar (non-negotiable — read before anything else)

| Rail | Rule |
|---|---|
| **Their voice, not a template's** | Every post must sound like the actual person: their words, their stories, their opinions. The voice profile is captured FIRST from their writing/speaking, and every draft is checked against it. If a post could be by anyone, rewrite it. |
| **Specific experience beats generic advice** | Posts lead with what the person actually did (a result, a failure, a number, a client story) — never "Top 5 tips for success". E-E-A-T in every post: experience is the content. |
| **Hook first, one idea, one CTA** | First 2 lines stop the scroll (hook formulas from the repo's playbook). One idea per post. One CTA max ("Comment your take" / "Repost if useful" / "DM for the template"). |
| **No engagement-bait slop** | No "Agree? 👇", no "Who else feels this?", no fake vulnerability, no hashtag walls (3 max, relevant). LinkedIn's algorithm + readers punish it. |
| **Consistency calendar** | A weekly plan (2–5 posts) with a clear role per post (story / teaching / contrarian / win / question) — not five of the same kind. |
| **Audited before delivery (the harness)** | Stage 5 is a harness, never a self-check: `audit-brand.mjs` runs the automated checks (voice, bio, calendar, engagement, blocklists) → a FRESH brand-auditor subagent scores brand-worthiness (/50, ≥ 35 = worth posting) → fix loop until signed **PASS** in `brand-audit.md`. |

---

## When to use

- "Help me build my LinkedIn presence"
- "Write me a LinkedIn post about X"
- "Rewrite my headline and About"
- "Give me a week of LinkedIn posts in my voice"

**Complements:** `carousel-post-images` (post carousels to LinkedIn) · `email-marketing` (same E-E-A-T playbook; drive post readers to a newsletter) · `hook-storyboard-retention` (hook formulas) · `blog-seo-content` (a post series can become an article).

---

## Workflow (6 stages)

### Stage 1 — Capture the voice (non-negotiable first step) → `voice-profile.md`
Walk the user through `templates/voice-capture.md` (or ask inline, ≤8 questions):
- What do you do, who do you help, what's the specific result?
- Your 3 biggest career wins + 2 failures (the failures are the most valuable content).
- What do you believe that your industry disagrees with?
- Pick 3 posts you'd repost — what draws you to them?
- Share 2–3 recent emails/posts/notes you wrote (their real phrasing).
Then write **`voice-profile.md`**: positioning statement, tone rules (from their actual words — words/phrases they use, ones they'd never use), topic pillars (3–4), proof arsenal (wins, numbers, stories, screenshots available).

### Stage 2 — Headline + About rewrite → `bio.md`
- **Headline** (~220 chars): who you help + the specific outcome + a hook. Not just your job title.
- **About** (1,300–2,600 chars for LinkedIn, but tight): story → proof (numbers/names) → what you do now → one CTA (DM me / subscribe / download). Written in their captured voice.
- Both pass the E-E-A-T bar: specific, credentialed, human, no buzzwords ("passionate", "guru", "ninja").

### Stage 3 — Week 1 post calendar → `calendar.md`
Write **2–5 posts for week one**, each with: role (story/teaching/contrarian/win/question) · hook (2 lines max, from the formulas) · body (their voice, one idea, one proof element) · CTA (one) · ideal posting day/time. Vary the roles — don't post five teaching posts. Mark which post drives to what (profile, newsletter, a specific offer).

### Stage 4 — Comment + engagement strategy → `engagement.md`
- **Comment strategy:** 5–10 target accounts/people to comment under (peers, clients' industries, 3–5 competitors' posts), how to comment (add ONE insight, never "Great post!"), 30–60 min/day.
- **Connection strategy:** who to connect with (capped at realistic), the personalized connection note template.
- **Profile CTA plan:** what the profile should drive to this month (newsletter signup / free consult / waitlist).

### Stage 5 — Audit harness (automated checks + brand-auditor subagent, before delivery)
**Step 5a — run the automated audit harness:**
```bash
node scripts/audit-brand.mjs --pack <brand-folder> --out brand-audit.md
```
`audit-brand.mjs` scans the pack and checks everything a script can: voice-profile.md (positioning, tone rules, pillars + proof), bio.md (headline length, proof, CTA, buzzword blocklist), calendar.md (2–5 posts, role variety, CTAs, posting times, blocklist), and engagement.md (comment targets, connection note, monthly CTA, no lazy-comment pattern). Writes `brand-audit.md` (automated verdicts + scorecard scaffold). **Exit 1 on any FAIL.**

**Step 5b — spawn the brand-auditor subagent** — a FRESH subagent (never self-audit) with the exact brief from `templates/brand-auditor-brief.md`: reads `brand-audit.md` + all pack files, completes the **brand-worthiness scorecard** (10 criteria, /50 — **≥ 35 = worth posting**, with verdict bands), makes the creative judgment calls the script can't (voice authenticity, E-E-A-T credibility, CTA taste), and signs **PASS / FIX NEEDED** with per-file fixes.

**Step 5c — fix loop.** Any FAIL (or an auditor-flagged WARN) → fix the file → re-run `audit-brand.mjs` → re-submit to a fresh auditor. **Nothing is delivered until the auditor signs off PASS.** The `brand-audit.md` ships with the pack.

### Stage 6 — Deliver + iterate
Deliver `voice-profile.md` + `bio.md` + `calendar.md` + `engagement.md`. Set a cadence: after week one, the user reports which posts performed (views, comments, profile visits) and the calendar for week two adjusts — doubling down on what the data says their audience clicks.

---

## Production checklist

- [ ] Voice captured FIRST via `voice-capture.md` (their words, not a template)
- [ ] `voice-profile.md`: positioning, tone rules from real phrasing, topic pillars, proof arsenal
- [ ] `bio.md`: headline (~220 chars) + About (tight, story → proof → CTA), their voice, no buzzwords
- [ ] `calendar.md`: 2–5 posts, varied roles, hook first 2 lines, one idea + one CTA each, posting times
- [ ] `engagement.md`: comment targets + how-to-comment, connection note template, monthly CTA
- [ ] **Audit harness run:** `audit-brand.mjs` → automated checks (voice, bio, calendar, engagement, blocklists) — exit 0
- [ ] **Brand-auditor subagent** (fresh eyes) completed the brand-worthiness scorecard (/50 ≥ 35) and signed **PASS / FIX NEEDED** in `brand-audit.md`
- [ ] Delivery: `voice-profile.md` + `bio.md` + `calendar.md` + `engagement.md` + `brand-audit.md` + week-2 iteration plan
