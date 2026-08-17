---
name: sponsorship-pipeline
description: Turn a creator's audience into brand-deal revenue — a media kit (audience stats, engagement benchmarks, rate card with niche CPM/RPM benchmarks computed by rate-card.mjs), personalized outreach + negotiation scripts (FTC disclosure built in), a deal tracking sheet with follow-up cadence, and an audit harness (audit-sponsor.mjs → a fresh sponsor-auditor subagent scores deal-worthiness /50 and signs PASS / FIX NEEDED before anything is sent).
---

<!-- ════════════════════════════════════════════════════════════════════════
     🎬 deepak-skill — crafted by Deepak · skill: sponsorship-pipeline
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

**🎬 deepak-skill — crafted by Deepak** · skill: `sponsorship-pipeline` · [deepak-skill on GitHub](https://github.com/Deepak-ai-93/deepak-skill) · MIT

# skill: sponsorship-pipeline

**Name:** Sponsorship Pipeline — turn your audience into brand deals
**Description:** Turns a creator's audience + niche into a **brand-deal pack**: `media-kit.md` (audience stats, engagement benchmarks, the offer) → `rate-card.md` (CPM/RPM-based rate card computed by `rate-card.mjs` from the niche's benchmarks — honest ranges, no magic numbers) → `outreach.md` (3 personalized sponsor pitches + negotiation scripts + follow-ups, FTC disclosure built in) → `tracking.md` (the deal pipeline + follow-up cadence) + `sponsor-audit.md` (the audit harness output). Built for creators who've been doing the content — this is the monetization layer.

---

## Storytelling + addiction rails (the universal contract — read before anything else)

Every deliverable this skill produces must tell **ONE micro-story** and engineer **rewatch**. These rails are the SAME contract every video/image skill in this repo follows — apply them to every beat, scene, slide, shot or clip before it ships.

**Applied to sponsorship:** the pitch IS a micro-story — the **open loop is the sponsor's problem** (their audience gap, their campaign need), the **rising tension is the proof** (your audience stats + engagement + the fit), the **payoff is the offer** (what they get, at what price), and the **loop ending is the ask** (a reply, a call, a test run). The media kit and the pitch must tell the same story: the sponsor should read the kit and think "this creator gets MY problem" — that's the loop that closes deals. Every number in the kit is a beat; a number that doesn't raise the question or prove the fit gets cut (the fluff rule, applied to metrics).

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
| **The sponsor's problem first (the #1 rail)** | The media kit and every pitch lead with the sponsor's problem (their audience gap / campaign need), not the creator's resume. Nobody buys "I have 50k followers" — they buy "I reach the exact people your campaign needs". |
| **Honest numbers, benchmark-grounded** | Every rate is computed from the niche's CPM/RPM benchmarks by `rate-card.mjs` — honest ranges, no magic numbers, no "guaranteed 1M views" claims. The audit flags invented benchmarks. |
| **Media kit = the offer, not the resume** | `media-kit.md` has: the niche + audience stats + engagement (not just followers) + the offer (formats, placements, deliverables) + contact. One page of proof, not a CV. |
| **Personalized outreach, zero templates** | Every pitch is written to a specific sponsor (their product, their campaign, the specific fit). No `{sponsor}` placeholders survive — `audit-sponsor.mjs` fails on placeholder text. |
| **FTC disclosure built in** | Every pitch + deliverable template carries the disclosure rule (#ad / #sponsored in the first lines of the post). Non-compliance fails the audit. |
| **Audited before delivery (the harness)** | Stage 6 is a harness, never a self-check: `audit-sponsor.mjs` runs the automated checks (media kit, rate card, outreach, tracking, disclosure, placeholders) → a FRESH sponsor-auditor subagent scores deal-worthiness (/50, ≥ 35 = worth sending) → fix loop until signed **PASS** in `sponsor-audit.md`. |

---

## When to use

- "Help me make money from brand deals" / "Build my media kit + rate card"
- "Write outreach emails to brands that fit my audience"
- "What should I charge sponsors in my niche?"
- "Give me a sponsorship negotiation + tracking system"

**Complements:** `linkedin-personal-brand` (the same proof of audience feeds the media kit) · `social-media-content-plan` (the audience stats + pillars that sponsors buy) · `newsletter-growth` (sponsorships are a newsletter monetization path) · `email-marketing` (the outreach emails can ship via the email skill) · `paid-ads-studio` (understand what brands pay for, so the pitch speaks their language).

---

## Workflow (6 stages)

### Stage 1 — Interview (ask ≤3 questions if vague)
Extract: **niche** (finance, fitness, tech, …) · **platforms + audience stats** (followers, avg views/impressions, engagement rate per platform) · **content formats** (video, posts, newsletter, podcast) · **existing sponsorships** (what's worked, what they'd never do) · **goals** (revenue, specific brands, sponsorship type) · **contact** (email / DM / booking link). Lock the ONE thing the audience buys: the niche + the engagement story.

### Stage 2 — Ground the benchmarks
Run `rate-card.mjs` with the niche + audience stats — it computes the CPM/RPM-based rate card from honest benchmark ranges. Web-research the niche's typical sponsorship rates (2025–26) and record sources in `rate-card.md`. **Honesty rule:** benchmarks are ranges, never promises — a rate card is what you ASK, not what you guarantee.

### Stage 3 — Write the media kit → `media-kit.md`
One page of proof: the niche + audience (stats per platform) + engagement (not just followers — views, saves, replies, retention) + the offer (formats: integrated video, dedicated post, newsletter mention; placements; deliverables; timeline) + contact. The story: THIS audience, THESE results, THIS is what I can do for a sponsor's campaign. From `templates/media-kit.md`.

### Stage 4 — Write the outreach + negotiation → `outreach.md`
3 personalized pitches to 3 real sponsor candidates (researched: their product, their current campaigns, the specific fit — "your last campaign targeted X; my audience is exactly X and here's the proof"). Each pitch: sponsor's problem → your proof → the offer → the ask (a call / a test run). Plus the negotiation scripts (price anchoring, bundles, the no-answer follow-up cadence) and the FTC disclosure rule — from `templates/outreach-scripts.md`. **Zero placeholders survive.**

### Stage 5 — Write `tracking.md`
The deal pipeline: prospects → contacted → replied → call → proposal → closed. Columns: sponsor, contact date, follow-up dates (the cadence: day 3, day 7, day 14, then park), status, rate quoted, notes. Every outreach email gets a row.

### Stage 6 — Audit harness (automated checks + sponsor-auditor subagent, before delivery)
**Step 6a — run the automated audit harness:**
```bash
node scripts/audit-sponsor.mjs --pack <sponsor-folder> --out sponsor-audit.md
```
`audit-sponsor.mjs` scans the pack and checks everything a script can: media-kit.md (niche, audience stats, engagement, offer, contact) · rate-card.md (CPM/RPM benchmarks present, no invented "guaranteed" claims) · outreach.md (≥ 2 pitches, each with problem/proof/offer/ask, FTC disclosure present, **no `{placeholder}` text**) · tracking.md (pipeline columns + follow-up cadence). Writes `sponsor-audit.md` (automated verdicts + scorecard scaffold). **Exit 1 on any FAIL.**

**Step 6b — spawn the sponsor-auditor subagent** — a FRESH subagent (never self-audit) with the exact brief from `templates/sponsor-auditor-brief.md`: reads `sponsor-audit.md` + all pack files, completes the **deal-worthiness scorecard** (10 criteria, /50 — **≥ 35 = worth sending**, with verdict bands), makes the creative judgment calls the script can't (is the pitch truly personalized, would a sponsor read the kit and see their problem, is the rate defensible, are the numbers honest), and signs **PASS / FIX NEEDED** with per-file fixes.

**Step 6c — fix loop.** Any FAIL (or an auditor-flagged WARN) → fix the pack → re-run `audit-sponsor.mjs` → re-submit to a fresh auditor. **Nothing is sent until the auditor signs off PASS.** The `sponsor-audit.md` ships with the pack.

---

## Production checklist

- [ ] Sponsor's problem leads the kit + pitches (audience fit, not the resume)
- [ ] Niche + audience stats + engagement (views, saves, replies — not just followers)
- [ ] `rate-card.mjs` ran → `rate-card.md` from honest niche CPM/RPM benchmarks (ranges, no guarantees)
- [ ] Media kit = the offer: formats, placements, deliverables, timeline, contact
- [ ] ≥ 2 personalized pitches (their product, their campaign, the specific fit) — zero placeholders
- [ ] Negotiation scripts + follow-up cadence (day 3 / 7 / 14) in `outreach.md`
- [ ] FTC disclosure (#ad / #sponsored) in every pitch + deliverable template
- [ ] `tracking.md`: pipeline columns + a row per outreach + follow-up dates
- [ ] **Audit harness run:** `audit-sponsor.mjs` → automated checks (kit, rate card, outreach, tracking, disclosure, placeholders) — exit 0
- [ ] **Sponsor-auditor subagent** (fresh eyes) completed the deal-worthiness scorecard (/50 ≥ 35) and signed **PASS / FIX NEEDED** in `sponsor-audit.md`
- [ ] Delivery: `media-kit.md` + `rate-card.md` + `outreach.md` + `tracking.md` + `sponsor-audit.md`
