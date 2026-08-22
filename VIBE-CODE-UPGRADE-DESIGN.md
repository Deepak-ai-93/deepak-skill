# VIBE-CODE WEBAPP - Upgrade Design v2.0
## Proper Search UI + X-Native Virality + GitHub-Safe Structure + Full Research & Earning Score

> **Status:** DRAFT for approval | **Owner:** vibe-code-webapp skill upgrade | **Version:** 2.0
> **Goal:** upgrade from "app that works" to "app that ranks, spreads on X, and makes money - without AI slop, without dirtying git push"

---

## 1. Why upgrade

| v1 Gap | Symptom | v2 Fix |
|---|---|---|
| Research shallow (Reddit+Trends only) | PRD guesses TAM/monetization | 8-platform teardown, sourced+dtd, triangulation |
| No Search UX | input + filter() slop | Command-K + instant + typo-tolerant + filters |
| No X distribution | share button only | X growth rail: pillars + hooks + 500-800 char posts |
| AI slop | generic gradients, lorem | Blocklist + design parity gate + E-E-A-T |
| Folder pollutes GitHub | PRD.md in root | Git-safe split: docs/pack (tracked) vs output/.vibe (ignored) |

---

## 2. Anti AI slop rails

- One claim per screen. Hook <=8 words.
- Copy-first. Blocklist (audit fails if found): unlock, game-changer, revolutionary, elevate, delve, tapestry, landscape, cutting-edge, leverage (verb), supercharge, unleash, world-class (without proof)
- Proof over adjectives. No proof -> shrink promise.
- Deterministic: same pack-plan.json -> same pack, exit 1 on placeholder.
- Human taste: creator-portfolio.md loaded Stage 0.

See: skills/vibe-code-webapp/SKILL.md - quality bar, templates/taste-profile.

---

## 3. GitHub-safe folder structure

### 3.1 Contract

Only skill FILES are global (.agents/skills/vibe-code-webapp/). Everything CREATED lives INSIDE project (SKILL.md:52).

| Bucket | Where | Git | Contents |
|---|---|---|---|
| Committed pack | docs/pack/ (--pack-dir flag) | tracked | PRD.md, stack-blueprint.md, sitemap.md, TODO.md, idea-brief.md, validation.md, project-scan.md, HANDOFF.md, MEMORY.md |
| Ephemeral | output/ + .vibe/ | ignored | output/progress.md, output/audit/audit-report.md, output/handoff/*.zip, .vibe/cache/research-notes.md |

Existing .gitignore already ignores output/, .agents/. v2 adds idempotently:

```gitignore
# vibe-code-webapp v2
.vibe/
output/
.env
.env.local
# docs/pack/ is COMMITTED - do NOT ignore
```

Legacy: pack-builder.mjs --pack-dir . still works. Default new apps: docs/pack/.

### 3.2 Tree

```
my-app/
|-- docs/pack/                  # COMMITTED
|   |-- PRD.md
|   |-- stack-blueprint.md
|   |-- sitemap.md
|   |-- TODO.md
|   |-- idea-brief.md
|   |-- validation.md
|   |-- project-scan.md         # existing-project only
|   |-- x-plan.md               # NEW
|   |-- HANDOFF.md
|-- output/                     # IGNORED
|   |-- progress.md
|   |-- audit/audit-report.md
|   |-- idea/idea-answers.md
|   |-- handoff/my-app-handoff.zip
|-- .vibe/cache/                # IGNORED
|-- src/ (or app/)              # app code
|-- .env.example                # committed
|-- .env                        # ignored
|-- MEMORY.md                   # committed
|-- package.json
```

### 3.3 Existing project mode

scan-project.mjs --dir . --pack-dir docs/pack detects stack/routes/DB/auth/payments (scripts/scan-project.mjs) -> docs/pack/project-scan.md. Pack planned ON TOP.

### 3.4 Git hygiene

- After Stage 3: git status shows only docs/pack/* + MEMORY.md
- After Stage 4: src/* + TODO updates
- CI (deploy-setup.mjs -> .github/workflows/deploy.yml) ignores docs/pack/ for cache

---

## 4. Research - proper, all platforms (Stage 1, research-playbook.md)

### 4.1 Two layers

Layer A - scripts (no API key, 2 min):
```bash
node scripts/research-idea.mjs --niche "saas for freelancers" --subreddits "freelance,Entrepreneur,webdev" --geo US
node scripts/platform-scan.mjs --idea "AI invoice tracker" --platforms all  # NEW
```

Layer B - agent deep research (fills docs/pack/idea-brief.md section 2):

| Platform | What to pull | Query | Signal |
|---|---|---|---|
| Reddit | 3-5 pain posts verbatim | site:reddit.com "chasing invoices" | Repeated pain + language |
| X | Top hooks, complaint threads | X search min_faves:50 | Hook patterns |
| Product Hunt | 5 rivals last 12mo | producthunt.com/search?q=invoicing | Positioning + pricing |
| Hacker News | Show HN / Ask HN | hn.algolia.com | Builder complaints |
| Indie Hackers | Revenue/churn posts | indiehackers.com/search | Monetization proof |
| G2/Capterra | 1-star reviews of 3 incumbents | g2.com | Roadmap = complaints |
| App Store/SEO | Ratings + SERP | ahrefs "invoice app" | Keyword difficulty |
| Google Trends | Rising terms + CPC | trends.google.com | Timing + CAC |

Every claim: Source (YYYY-MM-DD): link - one-line takeaway. Triangulation: >=2 sources per criterion. Raw -> .vibe/cache/research-notes.md

### 4.2 Outputs

- idea-brief.md section 2: competitor table (3-6 rivals)
- section 2.2 TAM -> SAM -> SOM (SOM x price must clear living costs)
- section 2.3 channel matrix (SEO/communities/paid/outreach/marketplace)
- section 2.4 pricing anchors (3+ prices + workaround cost)
- section 2.5 one-sentence positioning (verbatim into hero)
- Brainstorm >=5 angles -> winner = problem-to-effort x reachability

---

## 5. Scoring & earning potential (Stage 2, saas-validator.md)

### 5.1 Scorecard /35 - saas-score.mjs deterministic

| # | Criterion | What 5 looks like | Source |
|---|---|---|---|
| 1 | Problem clarity | Repeated pain; pay for workaround | pains |
| 2 | Market size & reachability | SOM x price clears bar AND >=1 channel | 2.2+2.3 |
| 3 | Competition | Crowded but complaints -> wedge | teardown |
| 4 | Monetization | Willingness to pay; economics positive | 2.4+5.2 |
| 5 | Technical feasibility | Vibe-code-able in weeks | stack+scan |
| 6 | Moat | Data/workflow/network | gap |
| 7 | Time-to-MVP | Weeks, not quarters | scope |

```bash
node scripts/saas-score.mjs --scores 5 4 4 5 5 3 4 --out docs/pack/validation.md
# >=30 BUILD | 25-29 ITERATE | <25 PIVOT/KILL
```
Any kill criterion hit -> stop even if >=30. Criteria: no channel, no user language, incumbents no complaints, SOM x price < living number, economics red, no validation willingness.

### 5.2 Earning potential - unit economics

| Input | Example (invoicing SaaS) | Target |
|---|---|---|
| Price | $19/mo (band $12-29) | anchored |
| Var cost / user | $2.10 (Vercel 0.40 + PG 0.60 + AI 0.80 + email 0.30) | - |
| Gross margin | 89% | >=70% SaaS |
| Target CAC | $35 (community+X) | channel |
| Payback | 2.1 mo | <12 mo |
| LTV (24mo x 0.85) | $323 | - |
| SOM x price | 4k x $19 x 12 = $912k ARR ceiling; 1% = $9k MRR | - |
| Forecast if paid | paid-ads-studio/forecast-ads.mjs (impressions -> CPA -> ROAS) | - |

Guardrail (PRD-anchored): if we dont reach 300 activated / 50 paid by 8 weeks, iterate wedge. Top 3 risks + watch metrics listed.

### 5.3 Validation moves (>=1 before/during build)

- 5 interviews (L) | Landing+waitlist (L-M) | Fake-door (L) | Pre-orders $9 (M) | Paid pilot 1-3 (M)

---

## 6. Search UI - proper, not slop

### 6.1 When

Always if PRD has >=1 list/table/feed. Interview 3.3: "Will users search/filter this list? What fields matter?" Skipped -> default yes for dashboard.

### 6.2 Tiers (one locked in blueprint section 3)

| Tier | Stack | When |
|---|---|---|
| A - Postgres FTS | pg_trgm + tsvector + GIN, ts_headline | <100k rows, zero infra (default MVP) |
| B - Meilisearch/Typesense | Docker, typo-tolerant, faceted | 100k+ rows |
| C - Algolia | InstantSearch | Search IS product |

### 6.3 UX contract (Linear/Algolia/shadcn patterns)

- Entry: Cmd+K / Ctrl+K palette (cmdk + shadcn command) + visible bar on list pages
- Instant: debounce 150-200ms, stream as you type. Loading = skeleton rows.
- Typo-tolerant: similarity >0.3 or minWordSizeForTypos:4
- Ranked: title 3x > description 1x > tags; recency boost
- Faceted filters: chips above results, URL-synced (?q=&status=&sort=) shareable
- Keyboard: up/down, Enter, Esc, / to focus. role=listbox + aria-*
- Empty states: (1) no query -> recent+suggestions, (2) no results -> "No results for X - try Y", (3) error -> retry
- Recent & saved: localStorage max 5, Save search optional
- Analytics: search_queried, search_result_clicked, search_zero_results -> PostHog
- Highlight: <mark> via ts_headline / Meilisearch highlight
- No AI slop: FTS first; AI re-rank behind flag only

### 6.4 Data rails

- tsvector column + trigger or Meilisearch sync on write (never client filter on full dataset)
- Pagination: cursor or limit 20 + load more
- No items.filter(i => i.name.includes(q)) on full dataset - fails audit

### 6.5 Audit gate

audit-webapp.mjs --search checks: command palette present, pg_trgm or search service in deps, URL sync, aria on combobox, empty states exist. Extends audit-webapp.mjs.

---

## 7. X best (reuse x-growth skill - zero hashtags)

### 7.1 Pack ships

- Content plan: goal + KPIs + 3-4 pillars + daily cadence + reply-first hour + weekly series loop (hook->value->proof->CTA) -> docs/pack/x-plan.md
- Week of posts: 7 posts, 500-800 chars, hook <=100 chars, role mix, post-writer.mjs blocklist -> docs/pack/x-posts.md
- Hook bank: 15 hooks scored (curiosity/contrarian/results-first/listicle/PAS)
- App wiring: OG image 1200x630 per page, share button copies hook-first CTA

### 7.2 Rituals

- Reply-first hour: 10 meaningful replies before self-promo
- 2 quote posts / week, DM follow-ups, Day-7 review -> MEMORY.md

### 7.3 Checklist

- [ ] Hero = positioning sentence (2.5) + social proof
- [ ] captions.md per-platform (500-900 chars, one CTA)
- [ ] OG + Twitter cards (audit checks meta property=og:image)

---

## 8. Stack rails

- Frontend: Next.js 15 App Router + Tailwind v4 + shadcn/ui + Geist (design-system.md) - one accent
- Backend: Drizzle + Postgres (or Supabase) + Auth.js + Stripe (backend-architecture.md)
- Design source: Figma MCP (get_design_context + get_variable_defs) OR Stitch DESIGN.md OR open-source pack - one locked choice in blueprint section 3 (frontend-design.md)
- AI features: ai-logic.md - streaming, AbortController, zod, cost caps, evals, audit --ai

---

## 9. Workflow 0->7

```
0. ONBOARD (interview idea-interview.md + scan + portfolio + MEMORY)
1. RESEARCH (signals + 8-platform teardown -> docs/pack/idea-brief.md)
2. VALIDATE (/35 + kill + economics + guardrail -> docs/pack/validation.md)
3. PACK + TODO (ONE pack-plan.json -> pack-builder.mjs --check-only -> PRD+stack+sitemap+TODO) -> USER CONFIRMS (todo.mjs confirm)
4. BUILD (golden loop per TODO: implement -> run -> parity -> done -> commit -> MEMORY+build-report)
5. AUDIT (audit-webapp.mjs --payments --ai --search -> audit-report.md + auditor PASS)
6. REPORT + EVERYTHING-AUDITOR (app+plan+instructions+memory+reports -> hardening/tests/NEXT.md)
7. DELIVER (deploy-setup.mjs + package-deliverable.mjs --zip -> output/handoff/*.zip; portfolio write-back)
```
Logging: progress.mjs --stage N -> output/progress.md

---

## 10. Deliverables checklist

- [ ] docs/pack/PRD.md + stack-blueprint.md (search tier + AI rails) + sitemap.md + TODO.md + idea-brief.md (8 platforms, dated) + validation.md (/35 + economics + guardrail) + x-plan.md + MEMORY.md
- [ ] Working app - search 6 + OG/captions 7 wired if in PRD
- [ ] output/audit/audit-report.md -> auditor + everything-auditor PASS
- [ ] output/handoff/ -> HANDOFF.md + manifest.json + ZIP
- [ ] deploy-runbook.md + .github/workflows/deploy.yml
- [ ] .env.example documents every var; zero secrets
- [ ] Design parity at 375/768/1280 + no slop
- [ ] output/progress.md complete

---

## 11. Implementation plan (one pass after approval)

- [ ] patch templates/research-playbook.md (8-platform), templates/saas-validator.md (earning math), templates/frontend-design.md (+search tier)
- [ ] add scripts/platform-scan.mjs + audit-webapp.mjs --search flag + templates/x-growth-brief.md
- [ ] wire docs/pack/ default + .gitignore patch in pack-builder.mjs + scan-project.mjs + todo.mjs + progress.mjs
- [ ] update skills/vibe-code-webapp/SKILL.md workflow stages 1/2/5 + README
- [ ] node --check all scripts -> example pack -> audit PASS

> Say "approve" and this ships in one build. Edits welcome - this doc is the gate.

