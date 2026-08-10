# PLAN — `paid-ads-studio` (end-to-end paid ad campaign production)

> **Status:** ✅ built · **Owner:** `paid-ads-studio` skill (see `skills/paid-ads-studio/`) · **Scope:** new files only — all 15 existing skills untouched.
> **Niche position:** every existing skill in this repo is *organic* content. This is the **paid** engine: ad creatives (Veo 3.1 video + Nano Banana Pro/Midjourney/Flux image), ad copy, Meta + Google campaign blueprints, cost management, and a **benchmark-driven forecast** that estimates results before a single dollar is spent.

---

## 1. Goal

A new open-source skill that produces a **complete paid-ads campaign pack** — everything an advertiser (creator, indie founder, agency) needs to launch on **Meta (Facebook/Instagram)** and **Google Ads**, plus a **forecast of expected results**:

1. **Video ad creatives** — copy-paste **Veo 3.1 / Google Flow** prompts (9:16 Reels/Shorts ads, 16:9 in-stream, 6s bumpers) with locked brand/product consistency.
2. **Image ad creatives** — copy-paste **Nano Banana Pro / Midjourney / Flux** prompts (1:1, 4:5, 1.91:1) with locked subject consistency + localized `Edit:` variants.
3. **Ad copy** — hook-first primary text, 40-char headlines, 30-char descriptions, CTA packs per platform — anti-fluff, compliant, benefit-led.
4. **Campaign blueprint** — the *exact* Meta and Google campaign structure: objective, audience strategy (Advantage+ / audience signals), placements, bidding, budget allocation.
5. **Latest guidelines** — an up-to-date compliance checklist for AI-generated ad content on both platforms (transparency labels, deepfake bans, text guidelines).
6. **Cost management plan** — ramp schedules, bid-strategy choices, kill/scale rules tied to KPIs.
7. **Forecast** — a `forecast-ads.mjs` engine that estimates impressions / clicks / conversions / CPA / ROAS across conservative–base–aggressive scenarios from platform + niche benchmarks.

The agent's job: interview → research → build the pack → **show the forecast → get approval → deliver**. Nothing is "launched" by the skill (no API keys, no ad account access — the user launches), but the pack is **launch-ready**.

---

## 2. Is it possible? Yes — five facts make it work (2026 research)

1. **Veo 3.1 (via Google Flow)** generates **8-second clips** (Extend chains them to 60s+), at 720p/1080p/4K, native **9:16 and 16:9**, with **native audio co-generation** (dialogue + SFX) and **full commercial rights** — ideal for ad creatives. Prompting follows a **7-layer template**: `[Camera/Lens] + [Subject] + [Action & Physics] + [Setting] + [Lighting] + [Style/Texture] + [Audio]`.
2. **Brand/product consistency** is already a solved problem in this repo: `veo-cinematic-reels` locks characters via **reference-image Ingredients + a verbatim character block in every prompt**, self-verified by script. `photoshoot-studio` does the same for products/persons. The ad skill **reuses both systems** (Ingredients-to-video, Frames-to-video bridging, verbatim product block).
3. **Nano Banana Pro** (in Google Flow + Ads Asset Studio) renders crisp labels/typography and multi-product compositions, and supports **conversational editing** — perfect for image ad variants. Midjourney/Flux cover the non-Google path.
4. **Meta targeting is now AI-led**: **Advantage+ audiences** treat inputs as *suggestions*, not hard rules; **creative IS the targeting**. Best practice: 50+ conversions/week and ~$50+/day for the learning phase. Campaigns are built around **6 ODAX objectives** (Sales, Leads, Engagement, App, Traffic, Awareness).
5. **Google is consolidated around AI campaign types**: **Performance Max** (full-funnel, ~45% of conversions across advertisers) + **Demand Gen** (YouTube/Discover/Gmail prospecting) + Search/Display/Video/App/Shopping/AI Max. **Audience signals ≠ hard targeting.** Transparency rules for AI-generated assets are **mandatory** (labels, no deceptive deepfakes).

**One hard rule (inherited):** the skill produces **launch-ready assets and a plan — it never touches the user's ad account.** No credentials, no API writes. The forecast is an *estimate* with explicit assumptions, never a guarantee.

---

## 3. Architecture (the pipeline)

```
user brief (product, offer, audience, budget, goal, platforms)
   │
   ▼ 1. INTERVIEW — ≤3 questions, then lock the brief
brief.json   (product, offer, price/AOV, margin, goal, daily budget, platforms, geo, dates)
   │
   ▼ 2. RESEARCH — forecast-ads.mjs fetches niche/platform benchmarks (built-in tables)
benchmarks.md   (CPM / CTR / CVR / CPC / CPA per platform × objective × niche)
   │
   ▼ 3. STRATEGY — platform blueprint
campaign-blueprint.md   (Meta: objective, Advantage+ setup, placements, bidding, budget split
                         Google: PMax + Demand Gen + Search, audience signals, tCPA/tROAS)
   │
   ▼ 4. CREATIVES — 3 engines, all prompt-based, copy-paste ready
prompts.md   (video: Veo 3.1 per placement;  image: Nano Banana / MJ / Flux per format)
copy.md      (primary text, headlines ≤40c, descriptions ≤30c, CTAs, per placement)
   │
   ▼ 5. COMPLIANCE — guidelines-checklist.md (Meta + Google AI-content rules, dated)
   │
   ▼ 6. COST PLAN — ramp/kill/scale rules + budget allocation
cost-plan.md
   │
   ▼ 7. FORECAST — forecast-ads.mjs (scenario engine)
forecast.md   (conservative / base / aggressive: impressions, clicks, conv, CPA, ROAS, 30-day totals)
   │
   ▼ 8. APPROVAL GATE — show forecast + plan → user approves/edits
   │
   ▼ 9. DELIVER — one folder: brief + blueprint + prompts + copy + compliance + cost + forecast
```

All paths relative to the skill folder, zero external deps, deterministic where scripts are involved.

---

## 4. Deliverables (the pack)

| File | What it is |
|---|---|
| `campaign-brief.md` | Locked brief: product, offer, audience, goal, budget, geo, dates, KPIs |
| `campaign-blueprint.md` | Meta + Google structure: objectives, audiences, placements, bidding, budget split (prospecting vs retargeting) |
| `prompts.md` | **Veo 3.1 video prompts** (9:16, 16:9, 6s bumper, 15-30s) + **image prompts** (Nano Banana Pro, Midjourney, Flux; 1:1 / 4:5 / 1.91:1) + `Edit:` variants — every prompt carries the verbatim product/brand block, **self-verified** by `ad-prompts.mjs` |
| `copy.md` | Hook-first primary text, 3-5 headlines ≤40 chars, descriptions ≤30 chars, CTA pack, per placement (Feed/Reels/Stories/Search/Display/Shorts) |
| `guidelines-checklist.md` | Current Meta + Google ad policies for AI content (with "verified as of" date) |
| `cost-plan.md` | Ramp schedule, bid strategy, kill/scale rules, budget allocation table |
| `forecast.md` | Scenario forecast: conservative / base / aggressive with 30-day totals + assumptions |
| `launch-checklist.md` | The exact manual launch steps in each platform's UI (copy-paste order) |
| `ad-audit.md` | Audit report: automated verdicts from `audit-ads.mjs` + the **ads-auditor subagent's** hook-worthiness scorecard (/50) and PASS / FIX NEEDED verdict |

---

## 5. Files to build

| File | Status | Purpose |
|---|---|---|
| `ADS-PLAN.md` | **this file** | the plan |
| `skills/paid-ads-studio/SKILL.md` | **to build** | the skill (executable form of this plan) |
| `skills/paid-ads-studio/scripts/forecast-ads.mjs` | **to build** | scenario forecast engine (benchmark tables + math, `--platform --objective --budget --aov --niche`) |
| `skills/paid-ads-studio/scripts/ad-prompts.mjs` | **to build** | builds + **self-verifies** the Veo + image prompt pack (verbatim product block in every prompt; exits 1 on drift) |
| `skills/paid-ads-studio/scripts/ad-copy.mjs` | **to build** | generates copy.md from a brief (hook formulas, char-limit enforcement, anti-fluff blocklist) |
| `skills/paid-ads-studio/scripts/audit-ads.mjs` | ✅ built | the audit harness — automated pack checks (hooks, char limits, fluff, consistency, forecast, compliance) → `ad-audit.md` scaffold for the ads-auditor subagent |
| `skills/paid-ads-studio/templates/ads-auditor-brief.md` | ✅ built | the exact subagent brief + hook-worthiness scorecard (/50, ≥35 = worth running) |
| `skills/paid-ads-studio/templates/*.md` | **to build** | copy-paste reference docs: benchmarks, hook formulas, Veo 7-layer template, product-block grammar, compliance checklist |
| `skills/paid-ads-studio/examples/` | **to build** | one complete worked example (see §11) |
| `README.md` / `USAGE.md` / `prompt-examples.md` | + small changes | wire the skill in (repo now 16) |

---

## 6. The creative engines

### 6.1 Video ads — Veo 3.1 via Google Flow

**Per-placement prompt packs** (aspect ratio set at generation time in Flow):

| Placement | Format | Length | Aspect |
|---|---|---|---|
| Reels / Shorts / TikTok | full-screen vertical ad | 8-24s (Extend) | 9:16 |
| Meta Feed (video) | in-feed video | 15-30s | 1:1 or 9:16 |
| YouTube in-stream | skippable | 15-30s (hook ≤5s) | 16:9 |
| Bumper | non-skippable | 6s | 16:9 or 9:16 |

**The 7-layer Veo ad prompt template** (verbatim, from the 2026 Flow research):

```
[Camera/lens] + [Subject = verbatim product/brand block] + [Action & physics] +
[Setting] + [Lighting] + [Style/texture] + [Audio: dialogue in quotes, SFX labeled]
```

- **Hook in frame 1** — the first 2 seconds carry the promise (no slow logos, no intros).
- **Timestamp pacing** for product ads: `0-3s open on…, 3-6s reveal…, 6-8s payoff macro…`.
- **UGC/founder style** needs a locked human identity (age, wardrobe, setting, one dominant action) + dialogue in quotes.
- **Brand consistency = the repo's proven system:** upload product/brand **Ingredients** once (from the product-block reference-image prompts), paste the **verbatim product block** into every prompt (self-verified), use **Frames-to-video** bridging for seamless scene cuts, and reuse the same Ingredients for every variant.
- **Text/logo rule:** keep native text short (brand name or one CTA word); render logos/fine print **in post** (generative text can warp).

### 6.2 Image ads — Nano Banana Pro / Midjourney / Flux

| Format | Size | Where it runs |
|---|---|---|
| Square 1:1 | 1200×1200 (min 300×300) | Meta Feed, PMax, Display |
| Portrait 4:5 | 960×1200 (min 480×600) | Meta Feed, Reels adjacent, Demand Gen |
| Landscape 1.91:1 | 1200×628 (min 600×314) | Google Display, PMax, YouTube companion |

- **Nano Banana Pro** is the default (native in Flow + Ads Asset Studio): crisp labels, multi-product scenes (up to 5 products), conversational edits → cheap variant generation. **Midjourney / Flux** offered as the non-Google path (user's choice).
- **Subject consistency locked** exactly like `photoshoot-studio`: verbatim product block (shape, materials, colors, exact label text) + grade token + craft token in **every** prompt; 2-3 reference-image prompts for Ingredients / `--cref` / reference upload.
- **Localized `Edit:` prompts** per image: background swap, seasonal variant, angle change, CTA banner — so a single hero image becomes a 5-variant ad set.
- Keep primary text **off the image** where possible (platforms overlay it); on-image text ≤3 words.

### 6.3 Ad copy — the anti-fluff contract

- **Hook-first:** every primary text opens with a hook formula (PAS · curiosity gap · contrarian · results-first · listicle) — same formulas as `hook-storyboard-retention`.
- **Hard char limits** (enforced by `ad-copy.mjs`, exit 1 on overflow):
  - Meta primary text: **≤125 chars** recommended (125 is the soft limit for full display; shorter = better), headlines **≤40**, descriptions **≤30**.
  - Google: headlines **≤30**, descriptions **≤90** (4 headlines + 5 descriptions per asset group).
- **Anti-fluff blocklist** (no "unlock", "game-changer", "revolutionary", "amazing deals!!!") + no ALL-CAPS, no fake urgency, no exaggerated claims — mirrors the `email-marketing`/`carousel` contract.
- **Benefit-led with proof:** one concrete outcome, one mechanism, one social-proof signal, one CTA.
- **Per-placement variants:** the same ad re-expressed for Feed (conversational), Reels/Shorts (bold, punchy), Search (keyword-anchored), Display (short + visual).
- **Compliance-aware:** no "guaranteed results", no health/financial claims without substantiation, clear CTA honesty.

---

## 7. Platform blueprints (2026)

### 7.1 Meta (Facebook + Instagram)

- **Objective (ODAX):** map the goal → Sales / Leads / Engagement / App Promotion / Traffic / Awareness. Default for ecommerce: **Sales**.
- **Audience = Advantage+** (suggestions, not rules):
  - *Controls (hard):* location, minimum age, language.
  - *Suggestions (soft):* custom audiences, lookalike seeds, age range beyond minimum, interest hints.
  - *Learning phase target:* **≥50 conversions/week** (scale budget to reach it; else the AI can't optimize).
- **Creative-first:** refresh creatives every **2-3 weeks** (Advantage+ burns creative faster); run 3-5 distinct creative concepts per ad set, let the system pick winners.
- **Bidding:**
  - New account / cold: **Highest volume** (data collection).
  - Scaling profitable: **Cost cap** (target CPA, average) → then **Minimum ROAS / Highest value** for ecommerce with CAPI purchase value.
  - **Bid cap** only as a hard ceiling (risks delivery).
- **Budget:** **CBO** (campaign budget optimization) default; ABO only for controlled creative tests.
- **Data foundation:** Pixel + **Conversions API** with high Event Match Quality — non-negotiable for Advantage+ performance.

### 7.2 Google Ads

- **The recommended stack for a creator/SaaS/ecommerce launch:**
  1. **Demand Gen** = prospecting + storytelling (YouTube in-stream/Shorts, Discover, Gmail). Supports 9:16 video, carousels, lookalikes. Best for the Veo creatives.
  2. **Performance Max** = full-funnel conversion capture (Search+Display+YouTube+Discover+Gmail+Maps in one). Feed it the same creative asset groups.
  3. **Search** = intent capture for the offer keywords (works with any budget).
  4. *(2026 note: Video Action Campaigns retired April 2026 → migrated to Demand Gen/PMax; DSA auto-upgrading to AI Max for Search from Sept 2026.)*
- **Audience signals ≠ targeting:** in PMax/Demand Gen, first-party signals (customer list, site visitors, custom intents) are *starting recommendations* — Google AI expands beyond them. Don't restrict.
- **Learning threshold:** ≥30 conversions/month per campaign to stabilize.
- **Negative keywords:** up to 10,000 (shared lists) on PMax to protect brand terms.
- **Bidding:** **tROAS** when revenue history exists; **tCPA** for lead/volume goals; let the system learn before tightening.
- **AI content transparency:** mark AI-generated assets via the **AI label settings** (Ads / DV360 / Merchant Center) — required for EU/India/NY compliance.

### 7.3 Budget split (default, tunable)

| Funnel stage | Meta | Google |
|---|---|---|
| Prospecting | 60-70% (Advantage+ sales) | Demand Gen |
| Retargeting/conv | 30-40% (catalog/custom audience) | Performance Max |
| Intent | — | Search (if budget allows) |

---

## 8. Guidelines & compliance checklist (AI-generated ads, 2026)

**Meta:**
- [ ] AI-generated content that could be mistaken for real events/people: follow Meta's **synthetic media labeling** where required.
- [ ] No AI misrepresentation of product function/quality/origin.
- [ ] Brand Memory / brand-consistency tools used so AI variants don't drift off-identity.
- [ ] Real-person likeness (AI or real) requires consent for ads.

**Google:**
- [ ] **AI label** set on every campaign/asset group using generative assets (Ads settings).
- [ ] No deceptive deepfakes or unverified AI alterations of real people.
- [ ] **Text Guidelines** locked in Ads settings to keep AI-written copy on-tone.
- [ ] Asset specs within limits (image ≤5 MB, static ≤150 KB; video 1080p H.264/AAC; key elements inside the center 80% safe zone).

**Universal:**
- [ ] Claims substantiated; no "guaranteed" earnings/results; honest CTAs.
- [ ] Landing page matches the ad's promise (no clickbait mismatch).
- [ ] This checklist carries a "verified as of <date>" line — the skill tells the user to re-check on their launch date.

---

## 9. Cost management plan (`cost-plan.md`)

| Phase | Rule |
|---|---|
| **Ramp (days 1-3)** | Start at **50% of final daily budget**; double-check tracking fires; never touch targeting during learning |
| **Learning** | Meta: wait for 50 conversions or ~7 days. Google: 30 conversions/month. Do NOT kill anything during learning |
| **Kill criteria** | Creative/audience with CPA > **2× target** after ≥2× AOV spend → pause that asset; keep the rest |
| **Scale** | Increase budget **20% every 3 days** while ROAS ≥ target; step down if ROAS dips |
| **Creative rotation** | Refresh/replace creatives every 2-3 weeks (Meta) — use the `Edit:` variants from the pack |
| **Guardrails** | tROAS floors for ecommerce (e.g., 2.0×) · tCPA caps for leads · daily budget never exceeds 2× AOV × target conversions |

---

## 10. The forecast engine (`forecast-ads.mjs`)

### 10.1 Inputs
`--platform meta|google` · `--objective sales|leads|traffic` · `--daily-budget 50` · `--aov 40` · `--niche ecommerce|saas|app|local` · `--days 30` · `--margin` (optional, for profit line)

### 10.2 Built-in benchmark tables (2026, editable — the skill tells the user to refine with real account data after week 1)

| Platform / type | CPM | CTR | CVR | CPC | Notes |
|---|---|---|---|---|---|
| Meta ecommerce (Advantage+ sales, US) | $10-15 | 1-2% | 2-4% | $0.5-1.5 | creative-led; wide CVR band |
| Meta leads | $8-12 | 1-2% | 5-10% (form) | — | instant forms convert higher |
| Google Search (ecommerce) | — | — | ~2.8% | ~$5.26 | highest intent, highest cost |
| Google Display | — | 0.46% | — | $0.63 | cheap reach, low CTR |
| YouTube / Demand Gen | CPM $8-12 (video view CPV $0.02-0.06) | VTR 15-30% | depends on landing | — | upper-funnel storytelling |
| Performance Max | blend of above | — | 1.5-3.5% blended | — | full-funnel aggregation |

*(These are launch-day starting points from 2026 research; the script labels them as such and allows `--overrides`.)*

### 10.3 The math (per scenario — conservative / base / aggressive)

```
impressions/day   = daily_budget ÷ CPM × 1000
clicks/day        = impressions × CTR
conversions/day   = clicks × CVR
CPA               = daily_budget ÷ conversions/day
revenue/day       = conversions/day × AOV
ROAS              = revenue/day ÷ daily_budget
30-day totals     = daily × days  (with a 7-day learning discount: first week ×0.5 expected volume)
```

Scenarios vary CPM (lower with better creative/learning) and CTR/CVR (better creative + audience fit). Output = a `forecast.md` table + plain-English "what this means" + the **assumptions list** (the honesty contract: *estimates, not guarantees; refine with real data*).

### 10.4 Worked example (the pack's example campaign)

**Brew & Co Tumbler — Meta Sales, US, $50/day, AOV $40, 30 days:**

| Scenario | CPM | CTR | CVR | Impr/day | Clicks/day | Conv/day | CPA | ROAS |
|---|---|---|---|---|---|---|---|---|
| Conservative | $14 | 1.0% | 2.0% | 3,571 | 36 | 0.71 | $70 | 0.57× |
| Base | $12 | 1.4% | 2.8% | 4,167 | 58 | 1.63 | $31 | 1.30× |
| Aggressive | $10 | 1.8% | 3.5% | 5,000 | 90 | 3.15 | $16 | 2.52× |

30-day base: ~$1,500 spend → ~49 conversions → ~$1,950 revenue → **ROAS 1.30×**. The plan reads this honestly: cold-prospecting Meta typically starts ≤1× and the pack pairs it with a retargeting layer + Google PMax to lift blended ROAS toward 2×+, which is why the blueprint allocates 30-40% to retargeting/catalog. Every forecast ends with "assumptions + how to re-forecast after week 1 with real numbers" (`--overrides`).

---

## 11. Worked example (in `examples/`)

**"Brew & Co Tumbler — Paid Launch"** (mirrors the existing `photoshoot-studio` example product for cross-skill reuse):
- Brief: $40 matte-black tumbler, ecommerce store, US, $80/day split Meta $50 + Google $30, 30 days, goal: sales at ≤2.5× AOV CPA → 2.0×+ ROAS.
- Complete pack: blueprint, 3 Veo video prompts (9:16 hook, 16:9 demo, 6s bumper), 6 image prompts (Nano Banana Pro default + Midjourney alternates, 1:1/4:5/1.91:1) + `Edit:` variants, copy.md (per-placement), compliance checklist, cost plan, forecast.md (from §10.4), launch checklist.

---

## 12. Risks & mitigations

| Risk | Mitigation |
|---|---|
| Forecast taken as a guarantee | Assumptions list + "estimates, not guarantees" + re-forecast workflow with real data after week 1 |
| Generative text/logos warp in Veo/MJ | Keep on-image text ≤3 words; render logos/fine print in post; Nano Banana Pro for label-critical images |
| Advantage+ creative fatigue | 3-5 concepts per set + `Edit:` variant bank + 2-3 week refresh cadence baked into cost-plan |
| Learning-phase killing | Explicit "do not touch during learning" rules + kill thresholds that require spend evidence |
| Policy drift (Meta/Google change rules) | Checklist dated "verified as of"; skill instructs re-check at launch |
| Product block drift between prompts | `ad-prompts.mjs` self-verify (verbatim block, exit 1 on drift) — same system as veo/photoshoot skills |
| Budget burned with no data | Ramp at 50%, Pixel+CAPI/Google tag verified before full spend |

---

## 13. Success criteria

- [ ] One brief → one launch-ready folder: brief + blueprint + prompts + copy + compliance + cost + forecast + launch checklist
- [ ] `forecast-ads.mjs` runs with no args → usage + exit 2; happy path → forecast.md (exit 0); supports `--overrides`
- [ ] `ad-prompts.mjs` self-verifies the verbatim product block in **every** prompt (missing block → exit 1)
- [ ] `ad-copy.mjs` enforces char limits + anti-fluff blocklist (violation → exit 1)
- [ ] Every prompt is pure copy-paste (no meta-commentary inside)
- [ ] All three scripts print the 🎬 Deepak brand banner, zero external deps
- [ ] Compliance checklist dated + covers Meta (synthetic media) and Google (AI labels) 2026 rules
- [ ] Examples folder has the complete Brew & Co pack
- [ ] README (16 skills), USAGE.md count, prompt-examples.md (new section) all wired
- [ ] Auditor subagent signed off against the skill-builder contract

---

## 14. Build order (this session)

1. `skills/paid-ads-studio/scripts/forecast-ads.mjs` — benchmark tables + scenario engine
2. `skills/paid-ads-studio/scripts/ad-prompts.mjs` — Veo + image prompt builder with self-verify
3. `skills/paid-ads-studio/scripts/ad-copy.mjs` — copy generator with char-limit/anti-fluff enforcement
4. `skills/paid-ads-studio/SKILL.md` — the skill playbook (quality bar + 8-stage workflow + checklist)
5. `skills/paid-ads-studio/templates/` — benchmarks, hook formulas, Veo 7-layer template, product-block grammar, compliance checklist
6. `skills/paid-ads-studio/examples/` — Brew & Co paid-launch pack
7. `skills/paid-ads-studio/scripts/audit-ads.mjs` + `templates/ads-auditor-brief.md` — the subagent audit harness (Stage 8)
8. `README.md` / `USAGE.md` / `prompt-examples.md` — wire in (repo now 16)
9. Validate: `node --check` all scripts + run each (`--help` exit 2, happy path exit 0) + run `audit-ads.mjs` on the example (PASS) + negative test (FAIL) + auditor subagent
10. Commit + push (only after the user says so)
