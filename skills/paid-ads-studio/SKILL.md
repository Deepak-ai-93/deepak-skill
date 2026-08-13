---
name: paid-ads-studio
description: End-to-end paid ad campaign production for Meta (Facebook/Instagram) and Google Ads — ad creatives (Veo 3.1 / Flow video prompts + Nano Banana Pro / Midjourney / Flux image prompts with locked brand consistency), hook-first ad copy within platform char limits, campaign blueprints (Advantage+ audiences, PMax/Demand Gen, bidding), 2026 AI-content compliance checklists, cost-management rules, and a benchmark-driven forecast of expected results (impressions, clicks, conversions, CPA, ROAS) before a dollar is spent.
---

<!-- ════════════════════════════════════════════════════════════════════════
     🎬 deepak-skill — crafted by Deepak · skill: paid-ads-studio
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

**🎬 deepak-skill — crafted by Deepak** · skill: `paid-ads-studio` · [deepak-skill on GitHub](https://github.com/Deepak-ai-93/deepak-skill) · MIT

# skill: paid-ads-studio

**Name:** Paid Ads Studio — the paid engine (everything else in this repo is organic)
**Description:** Turns a product/offer brief into a **launch-ready paid campaign pack** for **Meta (Facebook + Instagram)** and **Google Ads**: copy-paste **Veo 3.1 video ad prompts**, **image ad prompts** (Nano Banana Pro / Midjourney / Flux), **hook-first ad copy** inside every platform's char limits, the exact **campaign blueprint** (objective, audience, placements, bidding, budget split), a **2026 compliance checklist** for AI-generated ads, a **cost-management plan**, and a **forecast of expected results** (conservative / base / aggressive) — then an **approval gate** before delivery. The skill produces launch-ready assets and a plan; it never touches the user's ad account (no credentials, no API writes).

---

## The quality bar (non-negotiable — read before anything else)

| Rail | Rule |
|---|---|
| **Brand/product consistency (the #1 rail)** | The same product/brand across every creative. Enforced TWO ways, both mandatory: (1) the user uploads **reference-image Ingredients** (from the product block, § Workflow Stage 3) into Flow / Nano Banana / `--cref` / Flux reference, AND (2) the **exact same product block text** appears VERBATIM in every prompt — never reworded, never trimmed. `ad-prompts.mjs` self-verifies this; a missing word fails the build (exit 1). |
| **Launch-ready, copy-paste creatives** | Every Veo prompt and every image prompt is ONE complete prompt following its formula (video: 7-layer Veo template; image: style + product block + scene + craft + grade + aspect) with no instructions or meta-commentary inside — the user copies and pastes as-is. |
| **Char limits + anti-fluff (hard-enforced)** | Meta: primary text ≤125 chars, headline ≤40, description ≤30. Google: headline ≤30, description ≤90. No fluff words (unlock, game-changer, amazing, guaranteed, !!!…) — `ad-copy.mjs` exits 1 on any violation. |
| **2026 platform correctness** | Meta blueprints use ODAX objectives + Advantage+ audiences (inputs are *suggestions*, not rules; ≥50 conversions/week learning target). Google uses Demand Gen (prospecting) + Performance Max (conversion capture) + Search, with audience *signals* ≠ hard targeting and AI-content transparency labels. |
| **Forecast honesty** | The forecast is an **estimate** from 2026 benchmarks, never a guarantee — every `forecast.md` ends with an assumptions list + a re-forecast workflow with real data after week 1 (`--overrides`). |
| **Never guess silently (the Ads Wizard)** | Every "I want to create X ads" prompt runs the **3-question Ads Wizard** (`templates/ads-wizard.md`) before anything is built: platform (Meta/Google/Both) → goal (Sales/Leads/Traffic) → budget + AOV. Answers already in the prompt are marked answered; anything missing gets a sensible default flagged in the brief's **Decisions** section. No creative is written until the wizard is complete. |
| **Audited by fresh eyes before delivery (the harness)** | After the pack is built, `audit-ads.mjs` runs the automated checks (hooks, char limits, fluff, consistency, forecast, compliance), then a **fresh ads-auditor subagent** (never self-audit) completes the hook-worthiness scorecard (/50) and signs **PASS / FIX NEEDED** in `ad-audit.md`. Nothing is delivered until PASS. |
| **Never touches the ad account** | No credentials, no API writes, no automated campaign creation. The deliverable is launch-ready files the user pastes into the platform UIs. |

---

## Storytelling + addiction rails (the universal contract — read before anything else)

Every deliverable this skill produces must tell **ONE micro-story** and engineer **rewatch**. These rails are the SAME contract every video/image skill in this repo follows — apply them to every beat, scene, slide, shot or clip before it ships.

**Applied to ads:** every ad is a 3–15 second story — the hook frame opens the loop (the pain or the promise), the middle raises the stakes or proves it (mechanism + proof), the CTA frame pays off and loops (the offer, the brand). Video ads: hook ≤ 1–2s, payoff in the last frames. Image ads: the visual opens the loop, the headline pays it off.

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

- "I want to create ads for my product" / "make me X ads" (→ runs the 3-question Ads Wizard)
- "Make me a full paid ad campaign pack for Meta and Google for my product"
- "Veo video ad prompts + image ads + ad copy for my offer"
- "Meta Advantage+ campaign structure and forecast for a $50/day budget"
- "Google Performance Max + Demand Gen campaign blueprint and cost plan"
- "What are the current AI-content guidelines for ads, and is my creative compliant?"

**Complements:** `photoshoot-studio` (reference-image prompts + grade/craft tokens this skill reuses) · `veo-cinematic-reels` (the consistency system + Veo prompt language) · `hook-storyboard-retention` (hook formulas for the copy stage) · `carousel-post-images` (organic companion content from the same product) · `email-marketing` (retargeting/email flows for the same offer).

---

## The consistency system (read before anything else)

The same layered system that holds in `veo-cinematic-reels` and `photoshoot-studio`:

1. **Reference-image Ingredients (uploaded once).** From the product block (Stage 3), generate 2-3 clean reference images (hero on white, lifestyle, detail macro — Nano Banana Pro / Imagen in Flow, or your CLI's image tool). Upload to Flow's **Ingredients** (video + Nano Banana), add `--cref` (Midjourney), or set the reference (Flux). Reuse for EVERY prompt.
2. **The product/brand block (verbatim in every prompt).** One rigid paragraph: brand name, product, shape, materials, colors, exact label text, one hero claim. Copy-pasted identically into every video + image prompt — only camera/action/scene change.
3. **The grade token + craft token (verbatim in every prompt).** One grade (film stock/palette/grain) and one craft (camera body/lens/aperture/lighting) locked at Stage 1.
4. **Frames-to-video bridging (video).** For seamless scene cuts in an 8s multi-shot ad, feed the previous clip's last frame as the next clip's start frame in Flow.

---

## Veo video-ad prompt language — the 7-layer template

Append every layer, one prompt per ad, pure copy-paste:

```
[Camera/lens] + [Subject = VERBATIM product block] + [Action & physics] +
[Setting] + [Lighting] + [Style = grade token] + [Audio: Dialogue in quotes, SFX labeled]
```

| Element | Vocabulary (be specific) |
|---|---|
| **Camera** | locked-off medium close-up · slow push-in · dolly-in · handheld urgency · macro ECU · overhead top-down · 35mm/50mm/85mm lens · shallow depth of field |
| **Action** | "a hand in a charcoal sleeve lifts the tumbler toward camera", "steam rises", "ice cubes clink" — plain motion, one idea per clip |
| **Setting** | location + time of day + mood (minimalist kitchen at morning golden hour, bright product studio, city desk at dusk) |
| **Lighting** | soft window light from the left, high-key studio softbox, dramatic side sweep, warm backlight rim |
| **Audio** | `Dialogue: "Coffee stays hot for 8 hours."` · `SFX: subtle lid click` · `Ambient: warm room tone` |
| **Text rule** | keep native text ≤3 words (brand name or one CTA word); render logos/fine print in post — generative text can warp |

**Per-placement durations:** Reels/Shorts 8-24s (9:16) · Meta feed video 15-30s (1:1 or 9:16) · YouTube in-stream 15-30s, hook ≤5s (16:9) · Bumper 6s non-skippable (16:9 or 9:16).

**Image ad formats:** 1:1 (1200×1200) · 4:5 (960×1200) · 1.91:1 (1200×628) · max 5 MB (static ≤150 KB) · key elements inside the center 80% safe zone.

---

## Workflow (8 stages)

### Stage 1 — The Ads Wizard (3 questions, always) + lock the brief

**Trigger:** any prompt like *"I want to create ads for X"* / *"make me X ads"* / *"run ads for my product"*. Run the wizard from `templates/ads-wizard.md` — **exactly 3 questions, in order, one at a time, with the options shown**:

| # | Question | Options | Default if skipped |
|---|---|---|---|
| 1 | **Platform** — where do the ads run? | Meta · Google · Both | both |
| 2 | **Goal** — what should they achieve? | Sales · Leads · Traffic/awareness | sales |
| 3 | **Budget + AOV** — daily budget, and AOV for sales | budget · AOV · days · niche | $50/day · $40 AOV · 30 days · ecommerce |

Rules: never guess silently · if an answer is already in the prompt, mark it answered and don't re-ask · anything still missing after all three (audience, geo, offer, dates…) gets a sensible default the agent picks (geo US · audience broad · offer as-is · 30 days) + a **Decisions** note in the brief. **If the platform is Both, Stage 2 runs the forecast twice** (Meta + Google) and presents both. Then write `campaign-brief.md` from the answers (product, offer, audience, goal, budget, platforms, geo, dates, niche) and proceed to Stage 2.

### Stage 2 — Forecast first (show the economics before the creatives)
```bash
cd skills/paid-ads-studio
node scripts/forecast-ads.mjs --platform meta --objective sales --daily-budget 50 --aov 40 --niche ecommerce --days 30 --margin 40 --out forecast.md
```
Writes the conservative/base/aggressive forecast (impressions, clicks, conversions, CPA, revenue, ROAS + 30-day totals with the 7-day learning discount). **Present this to the user** — if the economics don't clear the target CPA/ROAS, go back to Stage 1 and adjust (budget, offer, audience) before writing a single creative.

### Stage 3 — Lock the consistency tokens
Write the **product block** (verbatim paragraph — see `templates/product-block.md`) + **grade token** + **craft token**. Generate **2-3 reference-image prompts** (hero on white, lifestyle, detail macro) for the user to create and upload. Save as `product-block.md`.

### Stage 4 — Build the ad creative pack
```bash
node scripts/ad-prompts.mjs --plan ads-plan.json --out prompts.md
```
`ads-plan.json` holds the product block, grade, craft, references, and one object per **video ad** (placement, duration, camera, action, setting, lighting, audio) and per **image ad** (format, tool, style, scene, props, lighting, edit). The script assembles one copy-paste Veo prompt per video + one image prompt per image, **self-verifies** the verbatim product block + grade (+ craft on images) word-by-word, and writes `prompts.md` with per-placement header notes.

### Stage 5 — Write the ad copy
```bash
node scripts/ad-copy.mjs --brief copy-brief.json --out copy.md
```
`copy-brief.json` holds product, audience, benefit, mechanism, proof, offer, cta, hook formula, platforms. The script generates hook-first primary text + 5 headlines + description + CTA per placement, then **enforces char limits + anti-fluff** (exit 1 on violation). If a line overflows, shorten the copy — never widen the limit.

### Stage 6 — Write the plan files
- `campaign-blueprint.md` — Meta: ODAX objective, Advantage+ audience setup (controls vs suggestions), placements, CBO budget, bid strategy. Google: Demand Gen (prospecting) + PMax (conversion capture) + Search (intent), audience signals, tROAS/tCPA. Budget split: prospecting 60-70% / retargeting 30-40%.
- `cost-plan.md` — ramp (50% budget days 1-3), learning phase (Meta ≥50 conv/week, Google ≥30 conv/month — do not kill during learning), kill rules (CPA > 2× target after ≥2× AOV spend), scale (+20% every 3 days while ROAS ≥ target), creative refresh every 2-3 weeks.
- `guidelines-checklist.md` — the 2026 compliance checklist (Meta: synthetic-media labeling, no AI misrepresentation, Brand Memory consistency, consent for real-person likeness. Google: AI labels in Ads settings, no deceptive deepfakes, Text Guidelines locked, asset specs). Dated "verified as of" — the skill tells the user to re-check at launch.
- `launch-checklist.md` — the exact manual copy-paste launch order in each platform's UI.
- `ad-audit.md` — produced in Stage 8 by the audit harness (`audit-ads.mjs` + ads-auditor subagent): automated verdicts + hook-worthiness scorecard (/50) + PASS / FIX NEEDED. Ships with the pack.

### Stage 7 — Approval gate
Show the user: **forecast + blueprint + cost plan**. They say **approve / edit / reject** — nothing is delivered before approval. Edits go back to the affected stage (creative, copy, or plan) and re-run.

### Stage 8 — Audit harness (automated checks + ads-auditor subagent, before delivery)

**Step 8a — run the automated audit harness:**

```bash
node scripts/audit-ads.mjs --pack <campaign-folder> --out ad-audit.md
```

The script scans the whole pack and checks everything a script CAN check: hook-first copy inside char limits with no fluff, a CTA per placement, self-verified prompts (`verify: ✅` count vs ads count), a sane forecast (scenarios + CPA/ROAS + honesty note), a blueprint with Meta Advantage+ + Google Demand Gen/PMax + budget split, a **dated** compliance checklist, and cost/launch plans. It writes **`ad-audit.md`** with the automated verdicts + an empty auditor section. **Exit 1 on any automated FAIL** — fix and re-run before spawning the auditor.

**Step 8b — spawn the ads-auditor subagent.** Fresh eyes — never audit your own work. Paste the exact brief from `templates/ads-auditor-brief.md` (or use the inline brief):

```
You are the ads-auditor for the paid ad campaign pack at {pack-folder}/.
1. Read ad-audit.md + every pack file (brief, forecast, prompts, copy,
   blueprint, cost plan, compliance, launch checklist).
2. Complete Section 2 of ad-audit.md:
   - 2.1 Hook-worthiness scorecard (/50, ≥35 = worth running): hook stops
     the scroll · benefit instant · mechanism credible · proof present ·
     CTA clarity · offer pull · audience fit · mute-first (video) ·
     compliance-safe · platform fit
   - 2.2 Creative judgment calls (copy hook strength/tone/offer logic;
     prompts that would render poorly or drift from the product block;
     forecast vs the brief's target CPA/ROAS; bid/policy/audience sense)
   - 2.3 Verdict: all PASS and ≥35 → PASS. Any FAIL or real WARN →
     FIX NEEDED with concrete per-file fixes.
3. Report your verdict + scorecard total + the completed ad-audit.md path.
```

**Step 8c — fix loop.** Any FAIL (or an auditor-flagged WARN) → fix the file → re-run `audit-ads.mjs` → re-submit to a fresh auditor. **Nothing is delivered until the auditor signs off PASS.** The `ad-audit.md` ships with the pack.

---

## Example session (the wizard in action)

**User:** "i want to create ads for my tumbler"

**Agent:** *(Stage 1 — Ads Wizard, Q1)*

> **1/3 — Which platform should the ads run on?**
> 1. **Meta** (Facebook + Instagram) — Advantage+ audiences, Reels/Feed/Stories
> 2. **Google** (Search + Display + YouTube) — intent + Demand Gen + PMax
> 3. **Both** (recommended — full funnel: Meta prospecting + Google capture)

**User:** "meta"

**Agent:** *(Q2)*

> **2/3 — What's the primary goal?**
> 1. **Sales** (default) 2. **Leads** 3. **Traffic / awareness**

**User:** "sales"

**Agent:** *(Q3)*

> **3/3 — Daily budget, and AOV (average order value)?** (defaults: $50/day · AOV $40 · 30 days · niche ecommerce)

**User:** "$50, aov 40, 30 days"

**Agent:** *(writes `campaign-brief.md` — product: tumbler, platform: Meta, goal: sales, $50/day · AOV $40 · 30 days — then Stage 2)*

> `forecast.md` — Meta sales ecommerce $50/day · base: ~43 conversions over 30 days · CPA ~$31 · ROAS ~1.15× cold (with the learning discount) — shown before any creative. **Approve the economics? (edit?)**

**User:** "approve"

**Agent:** *(Stage 3 → product block → Stage 4 → `ad-prompts.mjs` 7/7 verified → Stage 5 → `ad-copy.mjs` → Stage 6 plan files → Stage 7 approval gate → Stage 8 `audit-ads.mjs` + ads-auditor subagent → PASS → deliver)*

---

## Production checklist

- [ ] **Ads Wizard ran (Stage 1)**: 3 questions asked in order with options — platform (Meta/Google/both), goal (sales/leads/traffic), budget + AOV; no silent guessing; defaults + Decisions noted
- [ ] `campaign-brief.md`: product, offer, audience, goal, budget, platforms, geo, dates, niche
- [ ] `forecast.md` from `forecast-ads.mjs` — shown to the user BEFORE creatives; assumptions + re-forecast note included
- [ ] `product-block.md`: verbatim product block + grade token + craft token + 2-3 reference-image prompts
- [ ] User has generated + uploaded the reference Ingredients (or will, before generating)
- [ ] `prompts.md` from `ad-prompts.mjs` — every video + image prompt self-verified to contain the full product block + grade (+ craft); every prompt pure copy-paste
- [ ] `copy.md` from `ad-copy.mjs` — char limits + anti-fluff enforced (exit 0), hook-first, one CTA per placement
- [ ] `campaign-blueprint.md`: Meta ODAX + Advantage+ · Google Demand Gen + PMax + Search · budget split · bidding strategy
- [ ] `cost-plan.md`: ramp, learning phase, kill rules, scale rules, creative refresh cadence
- [ ] `guidelines-checklist.md`: Meta + Google 2026 AI-content rules, dated "verified as of"
- [ ] `launch-checklist.md`: manual copy-paste launch order per platform
- [ ] Story spine complete: open loop (hook) → rising tension → payoff → loop ending; no beat survives the fluff rule
- [ ] ≥3 addiction levers used (curiosity gap · serialization · variable reward · pattern interrupt · relatability · commitment bait)
- [ ] Every ad is a mini-story — hook frame opens the loop, middle proves/raises stakes, CTA pays off and loops
- [ ] `audit-ads.mjs` ran: automated verdicts written to `ad-audit.md` (no automated FAIL)
- [ ] **Ads-auditor subagent** (fresh eyes) completed the hook-worthiness scorecard (/50 ≥ 35) and signed **PASS / FIX NEEDED** in `ad-audit.md`
- [ ] Fix loop closed: any FAIL → fixed → re-audited
- [ ] Approval gate: user approved forecast + blueprint + cost plan before delivery
- [ ] Delivery: one folder with all 9 files, launch-ready
