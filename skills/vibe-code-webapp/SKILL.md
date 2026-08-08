---
name: vibe-code-webapp
description: Build production-ready vibe-coded web apps from a single idea. The skill ANALYZES the idea + stack preference (Next.js, Vite, whatever), EVALUATES it on a SaaS scorecard (BUILD / ITERATE / PIVOT), then produces a complete distraction-free BUILD PACK — PRD.md + stack-blueprint.md with a locked open-source design system (Tailwind + shadcn/ui), backend architecture (Drizzle/Postgres, Auth.js, Stripe), paste-ready data model, build order and handoff prompts — so the user can build in ANY tool (Claude Code, Cursor, Lovable, Bolt, v0) without design/architecture decisions. Research (research-idea.mjs) + production audit (audit-webapp.mjs + auditor subagent) included.
---

# skill: vibe-code-webapp

**Name:** Vibe-Coding Web App Builder (analyze → evaluate → build pack → approve → build anywhere → audit)
**Description:** Turns any app idea — "I want to build something like X with Next.js" — into a **complete, distraction-free build pack** and then a **working, production-ready web app**. The skill first **analyzes the idea and the stack preference**, **evaluates** it (kill the dud ideas cheaply), then writes the **Build Pack**: `PRD.md` (what to build) + `stack-blueprint.md` (exactly HOW — locked open-source design system, backend architecture, paste-ready data model, numbered build order, and **handoff prompts**). The pack is **tool-agnostic**: build with any CLI (Claude Code, Cursor, Codex, Gemini CLI, Antigravity, Grok Build, Freebuff) **or** paste it into web builders (Lovable, Bolt, v0). The production audit runs on whatever folder any tool produces.

---

## When to use

- "I want to build something like **X**" / "an app with **Next.js**" — any idea + optional stack preference
- "Turn this idea into a SaaS / MVP / tool" — full pipeline
- User has a stack in mind ("React + Vite", "Next.js + Supabase") → the skill validates it and locks it into the pack
- Non-SaaS too (tools, internal apps, landing+waitlist): skip monetization-specific checks, keep the rest

**Invariant:** *Research and evaluation are always allowed; **no code is written before the user has approved the Build Pack** (`PRD.md` + `stack-blueprint.md`).*

---

## Install anywhere (standalone)

```bash
# install ONLY this skill into the current project
npx skills add Deepak-ai-93/deepak-skill --skill vibe-code-webapp

# globally — available in every project on this machine
npx skills add Deepak-ai-93/deepak-skill --skill vibe-code-webapp -g
```

Installs to `.agents/skills/vibe-code-webapp/`:

```
SKILL.md
scripts/
  research-idea.mjs     # demand research (Reddit + Google Trends, no API key)
  audit-webapp.mjs      # production-readiness audit (marker-based, any stack)
templates/
  prompts.md                 # copy-paste prompts for any CLI + handoff prompts
  prd-template.md            # PRD (what to build)
  stack-blueprint-template.md# BUILD PACK: stack lock, design system, architecture, data, build order, handoff prompts
  design-system.md           # open-source design system pack (Tailwind + shadcn/ui tokens + components)
  backend-architecture.md    # backend architecture pack (Drizzle/Postgres, Auth.js, Stripe, security, ops)
  production-checklist.md    # the go-live bar (mirrors audit-webapp.mjs)
```

**Prerequisites:** Node.js 18+ (for the scripts). Everything else is the chosen stack's (`npm create next-app@latest` etc.) — no other dependencies.

---

## The 6-stage workflow

```
idea ──► 0. RESEARCH ──► 1. ANALYZE + EVALUATE ──► 2. BUILD PACK (PRD + blueprint) ──► USER APPROVAL ──► 3. BUILD ANYWHERE ──► 4. AUDIT ──► 5. DELIVER
              │                   │                        │                              ▲                         │
              └─ idea-brief.md    └─ scorecard /35         └─ ask ≤3 questions            └─ (edit / reject)       └─ fix loop until PASS
```

### Stage 0 — Research the idea (don't build on vibes alone)

Goal: one **`idea-brief.md`** (from `scripts/research-idea.mjs`) that proves (or disproves) demand.

```bash
node scripts/research-idea.mjs --niche "saas for freelancers" --subreddits "freelance,Entrepreneur,webdev" --geo US
```

- **0a — keyless signals:** Reddit top-of-day (real pain + user language) + Google Trends (rising topics). Copy the scaffold to the project root as the live `idea-brief.md`.
- **0b — agent web research:** Product Hunt, Hacker News, X, competitor sites → competition, pricing, open gaps.
- **0c — brainstorm ≥5 product angles**, pick the best **problem-to-effort** winner (section 4 of the brief).

### Stage 1 — Analyze the idea + stack, then evaluate

**Analyze (extract — ask ≤3 questions if vague, never guess silently):**

| Field | Extract / default |
|---|---|
| **Idea** | Their words, verbatim — the kernel to build on |
| **Stack preference** | Next.js? Vite? Express? "whatever fits"? → validate it fits the idea (see below) |
| **Audience / platform** | Who uses it, web/PWA/internal |
| **Monetized?** | yes (which model) / no |
| **Constraints** | timeline, existing accounts, must-have features |

**Stack analysis:** if the user named a stack, check it against the idea (e.g. "Next.js" fits a SaaS; "Vite+React+Express+SQLite" fits a small tool; Astro fits content sites). If it fits, **lock it into the pack as-is**. If it fights the idea, say so in one line and recommend the default (`templates/backend-architecture.md` §1) — but the user's choice wins unless it can't do the job.

**Evaluate — the SaaS scorecard (1–5 each, /35):**

| Criterion | Ask |
|---|---|
| Problem clarity | Real, repeated pain — or a nice-to-have? |
| Market size & reachability | Enough buyers you can actually reach? |
| Competition | Crowded me-too (low) vs differentiated gap (high)? |
| Monetization | Would they pay? (skip for non-monetized apps) |
| Technical feasibility | Buildable fast with vibe-coding on the locked stack? |
| Moat / why not copyable | Network effects, data, workflow lock-in? |
| Time-to-MVP | Honest weeks-to-first-user |

**Verdict:** ≥ 30 **BUILD** · 25–29 **ITERATE** (sharpen scope) · < 25 **PIVOT or KILL** — share the verdict + top 3 risks before going further.

### Stage 2 — Write the BUILD PACK and STOP for approval (the gate)

The **build pack** is what makes vibe coding distraction-free: every decision is already made. Two files:

**`PRD.md`** ← `templates/prd-template.md` — what to build: problem, personas, MVP must-haves, flows, data model, auth/payments, KPIs, decisions.

**`stack-blueprint.md`** ← `templates/stack-blueprint-template.md` — exactly HOW:
- **Stack lock** — one row per layer, versions, zero open decisions
- **Design system** (from `templates/design-system.md`) — tokens, fonts, page→component map; open-source, applied as-is
- **Backend architecture** (from `templates/backend-architecture.md`) — folder structure, auth flow, payments flow, security, ops
- **Data model** — paste-ready SQL/Drizzle tables with FK + index rules
- **Build order** — numbered steps with a "definition of done" each; never skip ahead
- **Handoff prompts** — CLI prompt + Lovable/Bolt/v0 mega-prompt + re-prompt, pre-filled with the app's real details

Then **present both files and wait**. The user may **approve** (→ Stage 3), **edit** (revise + re-present), or **reject** (stop). No scaffolding before approval.

> A vague prompt ("make an app for productivity") → ask ≤3 questions (audience? monetized? stack?) and default the rest. A prompt with a stack ("Next.js + Supabase") → analyze, validate, and lock it.

### Stage 3 — Build ANYWHERE (the pack works in every tool)

Hand the approved pack to whichever builder the user wants — it's tool-agnostic by design:

| Builder | How the pack is used |
|---|---|
| **CLI agents** (Claude Code, Cursor, Codex, Gemini CLI, Freebuff…) | Agent builds in the repo: scaffold → follow the build order → run/verify/commit each step (craft rules below) |
| **Lovable / Bolt / v0** | Paste the handoff mega-prompt from `stack-blueprint.md` §7-B (it carries pages, design tokens, data model, auth/payments, feature order) |
| **Hybrid** | CLI agent builds; user opens the result in a web builder for UI tweaks — same pack, same contract |

**Vibe-coding craft rules** (CLI builds — the pack makes them easy):
1. **Run early, run often** — the app must start after every change, not at the end.
2. **One feature at a time** — implement → run → verify → commit. Follow the blueprint's build order.
3. **No gold-plating** — build the PRD must-haves; extra ideas go in `NEXT.md`.
4. **Secrets never in code** — `process.env` only, `.env.example` committed, `.env` gitignored.
5. **Tests for the money paths** — auth, billing, anything that deletes data.
6. **Commit after every working feature.**

### Stage 4 — Audit for production (works on ANY builder's output)

The audit is marker-based, not framework-based — run it on whatever folder the CLI agent or Lovable/Bolt produced.

**4a — run the script:**

```bash
node scripts/audit-webapp.mjs --dir . --name {app} --payments   # --payments only if monetized
```

Scans for app entry, run/build scripts, `.gitignore`, `.env.example`, hardcoded secrets, auth, database, payments, error handling, validation, CORS/rate-limit, tests, lint, CI, deploy config, analytics, SEO → `audit-report.md` with PASS/WARN/FAIL + auditor section. Exit 1 on any FAIL.

**4b — spawn the auditor subagent** (fresh eyes — never audit your own work):

```
You are the web-app auditor for the project at {dir} ({name}).
1. Read output/audit/audit-report.md and complete section 2:
   2.1 real secrets anywhere? 2.2 the app actually runs? 2.3 broken/half-built
   screens (dead buttons, TODO stubs, mocked data) 2.4 error states on every
   async view 2.5 mobile responsive 2.6 accessibility basics 2.7 any WARN that
   is really a blocker.
2. Verdict: all PASS and no real WARN → PASS. Any FAIL or WARN you judge real
   → FIX NEEDED with a concrete fix list.
3. Report the verdict + the audit-report.md path.
```

**4c — fix loop.** Any FAIL (or auditor-flagged WARN) → fix → re-run → re-submit. **Nothing is delivered until the auditor signs off PASS.**

### Stage 5 — Deliver

- Working app + `PRD.md` + `stack-blueprint.md` + `idea-brief.md` + `audit-report.md` (PASS).
- A production README: what it is, setup, env vars, deploy + rollback runbook.
- Tell the user: the one-line pitch, the scorecard total + verdict, what was built, what's in `NEXT.md`, and how to rebuild/tweak it in their favorite tool (paste the blueprint's handoff prompt).

---

## Auditor checklist (script + subagent agree on these)

- [ ] App entry point + run script exist; app actually starts
- [ ] No hardcoded secrets; `.env.example` documents every env var; `.env` ignored
- [ ] Auth + ownership checks; database with committed schema + backups
- [ ] Payments wired and verified (if monetized)
- [ ] Error handling + input validation + CORS/rate limiting in place
- [ ] Tests for auth/billing/delete paths; lint passing; CI on push
- [ ] Deploy config, domain/SSL, analytics, SEO meta present
- [ ] No half-built screens, TODO stubs, or mocked data in shipped flows
- [ ] Mobile responsive; empty/loading/error states; accessibility basics
- [ ] Design system held: tokens-only, no per-page colors/fonts (per `design-system.md`)
- [ ] Two identical audit runs produce the same verdict (deterministic script)

---

## Example session

**User:** "I want to build something like a freelancer invoicing tool, with Next.js. Run it through the skill."

**Agent:** *(Stage 0)* `node scripts/research-idea.mjs --niche "freelancer invoicing" --subreddits "freelance,Entrepreneur"` → Reddit pain "I chase clients for 6 weeks" · Trends: "invoice software" → `idea-brief.md`, winner: **InvoiceFlow**.

**Agent:** *(Stage 1)* Stack: **Next.js — fits, locked.** Scorecard: 5/4/3/4/5/2/4 → **29/35 → ITERATE** → sharpens to "one-time invoices + Stripe link, no subscriptions in MVP" → **BUILD**.

**Agent:** *(Stage 2)* Writes `PRD.md` + `stack-blueprint.md` (design system pack applied: neutral tokens + indigo accent, Geist, page map; architecture pack applied: Drizzle schema, Auth.js, Stripe webhook; build order 1–8; handoff prompts filled). Presents both, waits. **User:** "approve — build it here."

**Agent:** *(Stage 3)* Builds per the blueprint's build order: scaffold → tokens → schema → auth → invoice form → Stripe checkout → status dashboard; runs after every step; commits each feature; tests auth + webhook.

**Agent:** *(Stage 4)* `audit-webapp.mjs --dir . --name invoiceflow --payments` → 1 FAIL (no CI) + 3 WARN → fixes → auditor signs **PASS**.

**Agent:** *(Stage 5)* Delivers: running app + the full build pack + audit-report (PASS) + README with the Vercel runbook and the **Lovable/Bolt handoff prompt** so the user can also open the same app in a web builder.

---

## Production checklist

- [ ] Idea + stack preference **analyzed** (user's words kept; stack validated and locked)
- [ ] `idea-brief.md` written: signals dated + sourced, ≥5 angles, winner locked
- [ ] SaaS scorecard applied (/35); BUILD / ITERATE / PIVOT verdict shared
- [ ] ≤3 clarifying questions if vague; no silent guessing
- [ ] **Build pack** written: `PRD.md` + `stack-blueprint.md` (stack lock, design system, architecture, paste-ready data model, numbered build order, filled handoff prompts)
- [ ] **Approval gate: user explicitly approved the build pack before ANY code**
- [ ] Built per the blueprint (CLI craft rules) or pasted into the user's chosen builder (Lovable/Bolt/v0) via the handoff prompt
- [ ] `audit-webapp.mjs` ran on the delivered folder: PASS/WARN/FAIL + `audit-report.md`
- [ ] Auditor subagent signed off **PASS**; any FAIL fixed and re-audited
- [ ] Delivered: working app + `PRD.md` + `stack-blueprint.md` + `idea-brief.md` + `audit-report.md` + production README
