---
name: x-threads-engagement
description: Write scroll-stopping X/Twitter threads that get read, shared, and followed — viral thread formulas (hook → numbered beats → CTA), story-spine + addiction rails (open loop → rising tension → payoff → loop ending), 280-char enforcement with an anti-fluff + bait-spam blocklist, an engagement ritual (reply-first hour, quote-post strategy, DM follow-ups), and an audit harness (thread-writer.mjs assembles + validates the pack → audit-threads.mjs → a fresh x-auditor subagent scores thread-worthiness /50 and signs PASS / FIX NEEDED before delivery).
---

<!-- ════════════════════════════════════════════════════════════════════════
     🎬 deepak-skill — crafted by Deepak · skill: x-threads-engagement
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

**🎬 deepak-skill — crafted by Deepak** · skill: `x-threads-engagement` · [deepak-skill on GitHub](https://github.com/Deepak-ai-93/deepak-skill) · MIT

# skill: x-threads-engagement

**Name:** X Threads + Engagement — threads that get read, shared, and followed
**Description:** Turns a topic into a **ready-to-post X thread pack**: `thread.md` (hook tweet → 3–7 numbered beats → CTA/loop tweet, story-spine roles annotated per tweet, every constraint enforced by `thread-writer.mjs`) + `engagement.md` (the reply-first hour, quote-post strategy, and DM follow-ups — the replies are the growth) + `threads-audit.md` (the audit harness output). Built for creators building an X presence from one thread at a time.

---

## Storytelling + addiction rails (the universal contract — read before anything else)

Every deliverable this skill produces must tell **ONE micro-story** and engineer **rewatch**. These rails are the SAME contract every video/image skill in this repo follows — apply them to every beat, scene, slide, shot or clip before it ships.

**Applied to X threads:** the thread IS the micro-story — tweet 1 opens the loop (the hook), the middle tweets escalate (each adds a new stake, twist, or "and then…"), a payoff tweet delivers the aha, and the last tweet is the CTA/loop ("Follow for part 2", "Save this", "DM me"). The open loop is what makes a reader tap "show more"; the serial CTA is what turns a reader into a follower.

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
| **Hook in tweet 1 (the #1 rail)** | Tweet 1 is ≤ 100 chars, uses ONE hook formula (from `templates/thread-formulas.md`), and opens a curiosity gap the thread must close. No "I'm going to talk about", no hello threads, no "Day 1 of sharing…". |
| **One idea per tweet, 280-char cap** | Every tweet is ≤ 280 chars and makes exactly one point. No walls of text, no 30-tweet threads — **5–9 tweets** is the sweet spot. |
| **Story spine, always** | The thread is a micro-story: tweet 1 opens the loop → middle tweets escalate → a payoff tweet delivers the aha → the last tweet is the CTA/loop. `thread-writer.mjs` exits 1 if the roles don't line up. |
| **Anti-fluff + no bait spam** | No fluff words (unlock, game-changer, elevate, …), no "RT if you agree" / "tag someone" spam, ≤ 3 hashtags per tweet. Every tweet either informs, proves, or entertains. |
| **Engagement ritual ships with the thread** | Every pack includes `engagement.md` — the reply-first hour, quote-post strategy, and DM follow-ups — because the thread is the bait, the replies are the growth. |
| **Audited before delivery (the harness)** | Stage 6 is a harness, never a self-check: `audit-threads.mjs` runs the automated checks (hook, char caps, story spine, fluff, engagement) → a FRESH x-auditor subagent scores thread-worthiness (/50, ≥ 35 = worth posting) → fix loop until signed **PASS** in `threads-audit.md`. |

---

## When to use

- "Write me a viral X thread about [topic]"
- "Turn this idea into a thread that gets engagement"
- "Grow my Twitter/X with threads + a reply strategy"
- "I have a thread draft — audit it before I post"

**Complements:** `hook-storyboard-retention` (hook formulas) · `video-product-pipeline` (trend research via `trend-hunt.mjs`) · `linkedin-personal-brand` (repurpose the same story for LinkedIn) · `blog-seo-content` (expand a thread into an article) · `social-media-content-plan` (threads slot into the X column of a 30-day plan) · `newsletter-growth` (the same story becomes the week's issue).

---

## Workflow (6 stages)

### Stage 1 — Analyze the brief (ask ≤3 questions if vague)
Extract: **topic** · **angle** (the specific promise that makes THIS thread different) · **audience** · **goal** (engagement / followers / clicks / sales) · **voice** (the account's tone — threads must sound like the person, never a template) · **CTA** (follow, save, DM, link). Lock the goal — it decides the CTA tweet.

### Stage 2 — Research what's working on X right now
If `video-product-pipeline` is installed, run `node scripts/trend-hunt.mjs --niche "{topic}" --subreddits "{r1},{r2}" --geo US`; web-research X trending + the niche's top threads from the last week (which hooks got replies, which structures got shared). **Freshness rule:** nothing older than ~14 days. Then pick ONE formula from `templates/thread-formulas.md`.

### Stage 3 — Write the thread plan → `thread-plan.json`
The creative contract the script enforces:
- `topic`, `formula` (from the template), `goal`, `audience`
- `hook` (tweet 1 — ≤ 100 chars, opens a loop)
- `tweets[]` — 3–7 content tweets, each with `text` + `role` (`open-loop` / `rising` / `payoff` / `value` / `cta` / `loop`). Follow the fluff rule: every tweet either raises the question, raises the stakes, or pays off.
- The last tweet is the CTA/loop (serial follow-bait: "Follow for part 2", "Save this thread", "DM me X").

### Stage 4 — Assemble + validate → `thread.md` (automated, exit 1 on bad plans)
```bash
node scripts/thread-writer.mjs --plan thread-plan.json --out thread.md
```
The script validates: hook ≤ 100 chars + opens a loop · every tweet ≤ 280 chars with a valid role · ≥ 3 tweets · payoff present · CTA/loop last · fluff + bait-spam blocklists. **Exits 1 on any FAIL** and writes nothing. On clean, it writes the polished `thread.md` — numbered tweets, per-tweet role + char annotations — plus the post-plan (what to do right after posting).

### Stage 5 — Write `engagement.md`
The reply-first hour (reply to every reply within 60 minutes of posting), the quote-post strategy (3–5 niche quote posts per day), DM follow-ups that match the CTA, and follow/unfollow hygiene — from `templates/engagement-rituals.md`. The thread gets the reach; the replies compound it.

### Stage 6 — Audit harness (automated checks + x-auditor subagent, before delivery)
**Step 6a — run the automated audit harness:**
```bash
node scripts/audit-threads.mjs --pack <thread-folder> --out threads-audit.md
```
`audit-threads.mjs` scans the pack and checks everything a script can: thread.md (hook ≤ 100 chars + opens a loop, per-tweet ≤ 280, ≥ 3 tweets, story-spine roles — payoff present + CTA/loop last, fluff + bait-spam blocklists, hashtag hygiene) and engagement.md presence. Writes `threads-audit.md` (automated verdicts + scorecard scaffold). **Exit 1 on any FAIL.**

**Step 6b — spawn the x-auditor subagent** — a FRESH subagent (never self-audit) with the exact brief from `templates/x-auditor-brief.md`: reads `threads-audit.md` + all pack files, completes the **thread-worthiness scorecard** (10 criteria, /50 — **≥ 35 = worth posting**, with verdict bands), makes the creative judgment calls the script can't (hook pull, beat escalation, CTA strength, voice consistency, controversy-worthiness), and signs **PASS / FIX NEEDED** with per-tweet fixes.

**Step 6c — fix loop.** Any FAIL (or an auditor-flagged WARN) → fix `thread-plan.json` → re-run `thread-writer.mjs` + `audit-threads.mjs` → re-submit to a fresh auditor. **Nothing is delivered until the auditor signs off PASS.** The `threads-audit.md` ships with the pack.

---

## Production checklist

- [ ] Hook in tweet 1: ≤ 100 chars, one formula, opens a loop
- [ ] Every tweet ≤ 280 chars, one idea per tweet; 5–9 tweets
- [ ] Story spine complete: open loop → rising tension → payoff → CTA/loop ending
- [ ] ≥3 addiction levers used (curiosity gap · serialization · variable reward · pattern interrupt · relatability · commitment bait)
- [ ] Fluff + bait-spam blocklists clear; ≤ 3 hashtags per tweet
- [ ] Voice matches the account (no template-speak)
- [ ] `thread-writer.mjs` ran clean (exit 0) → `thread.md`
- [ ] `engagement.md` written: reply-first hour, quote posts, DM follow-ups
- [ ] **Audit harness run:** `audit-threads.mjs` → automated checks (hook, char caps, story spine, fluff, engagement) — exit 0
- [ ] **X-auditor subagent** (fresh eyes) completed the thread-worthiness scorecard (/50 ≥ 35) and signed **PASS / FIX NEEDED** in `threads-audit.md`
- [ ] Delivery: `thread.md` + `engagement.md` + `threads-audit.md`
