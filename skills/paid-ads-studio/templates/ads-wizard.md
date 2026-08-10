# Ads Wizard — the 3-question onboarding (Stage 1 of paid-ads-studio)

> **How to run it:** when the user says anything like *"I want to create ads for X"*, ask these **three questions in chat, ONE at a time**, with the options shown. Record the answers verbatim into `campaign-brief.md` as you go. The user can pick an option, type their own answer, or say **"skip — you decide"** (defaults are listed). **Never guess silently** — the forecast and the whole pack depend on these three answers.
>
> **The rule of three:** exactly 3 questions, always in this order. If the user already answered one in their prompt ("Meta ads for my tumbler store, $50/day"), mark it answered and don't re-ask it. **Anything still missing after all three (audience, geo, offer, dates…) gets a sensible default the agent picks** — `geo US · audience broad · offer as-is · 30 days` — and every default is flagged in the brief's **Decisions** section so the user sees what was assumed.

---

## Question 1 — Platform (where will the ads run?)

> *"Which platform should the campaign target?"*

| # | Option | What it means | When to pick |
|---|---|---|---|
| 1 | **Meta** (Facebook + Instagram) | Advantage+ audiences, Reels/Feed/Stories, single image + video ads | Product/offer that sells visually; social-first audience; retargeting |
| 2 | **Google** (Search + Display + YouTube) | Search intent, Demand Gen, Performance Max, Display network | Intent-driven (people searching for the product); B2B; broad reach |
| 3 | **Both** (recommended default) | Full funnel: Meta for prospecting + Google for intent/capture | Budget ≥ $80/day; wants the whole funnel |

**Default if skipped:** `both` (Meta prospecting + Google capture — the full-funnel stack the skill's blueprint covers). **Forecast path for Both:** run `forecast-ads.mjs` **twice — once per platform** (`--platform meta` and `--platform google --campaign pmax`) — and present both forecasts (Meta = cold-prospecting economics, Google = intent/capture economics) in `forecast.md`; the blueprint merges them into the blended funnel view.

---

## Question 2 — Goal (what should the campaign achieve?)

> *"What's the primary goal?"*

| # | Option | Objective used | Forecast focus |
|---|---|---|---|
| 1 | **Sales** (default) | Meta: Sales (ODAX) · Google: tROAS | Conversions, CPA, ROAS — needs AOV (Question 3) |
| 2 | **Leads** | Meta: Leads · Google: tCPA | Leads, cost per lead, quality signals |
| 3 | **Traffic / awareness** | Meta: Traffic/Awareness · Google: Demand Gen reach | Clicks, reach, CTR — no revenue math |

**Default if skipped:** `sales`.

---

## Question 3 — Budget + AOV (the economics the forecast runs on)

> *"What's the daily budget — and, for sales, the average order value (AOV)?"*

| # | Field | Used for | Default |
|---|---|---|---|
| — | Daily budget (e.g. `$50`) | `--daily-budget` in `forecast-ads.mjs` | $50/day |
| — | AOV for sales (e.g. `$40`) | `--aov` — CPA and ROAS math | $40 |
| — | Flight length (optional) | `--days` | 30 days |
| — | Niche (ecommerce / saas / app / local) | `--niche` — picks the benchmark table | ecommerce |
| — | Google campaign type (if Google/Both) | `--campaign` (search/pmax/demandgen/display) | pmax |

**Default if skipped:** `$50/day · AOV $40 · 30 days · niche ecommerce` (the worked-example numbers) · Google forecast defaults to `pmax`. The user can refine after seeing the forecast.

---

## After the wizard

1. Write `campaign-brief.md` from the answers (product, offer, audience, goal, budget, platforms, geo, dates, niche) + a **Decisions** line noting anything you defaulted.
2. Run **Stage 2 — forecast first** (`forecast-ads.mjs` with the exact budget/AOV/niche). Show the user the economics BEFORE any creative is written.
3. Continue the pipeline: consistency tokens → creatives → copy → plan files → approval gate → audit harness.

> **Invariant:** no creative, no copy, no prompts are produced before the 3 answers are locked and the forecast is shown.
