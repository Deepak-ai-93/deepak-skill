---
name: vibe-code-webapp
description: Build or EXTEND production-ready vibe-coded web apps at 20-year-expert depth. The skill ONBOARDS the user with a detailed idea interview (idea-interview.md), and in EXISTING projects first SCANS the current structure (scan-project.mjs → project-scan.md) so the plan extends what's already there. Then it RESEARCHES like an expert (research-playbook.md: keyless signals + competitor teardown + TAM/SAM/SOM + channels + pricing + positioning), EVALUATES like a SaaS validator (saas-validator.md + saas-score.mjs → validation.md with kill criteria, unit economics, kill guardrail, validation moves, BUILD / ITERATE / PIVOT verdict), and produces a complete distraction-free BUILD PACK — PRD.md + stack-blueprint.md (locked design source of truth — Figma via the Figma Developer MCP, Google Stitch DESIGN.md, or the open-source design-system.md pack (frontend-design.md) + backend architecture + paste-ready data model + AI-feature rails when the PRD has AI (ai-logic.md) + build order) + sitemap.md (full sitemap, every frontend page, the backend architecture and all workflows in one markdown) + a TODO.md task list with P0/P1/P2 priorities managed by todo.mjs. The user CONFIRMS the pack AND the todo list (gate) before any code, and can add/re-prioritize tasks mid-build. The vibe coder then builds STEP-BY-STEP from vibe-coder-instructions.md (flowchart + golden loop + design-parity checks + memory rules) and files a DETAILED evidence-backed build-report.md per session. Research (research-idea.mjs) + production audit (audit-webapp.mjs, --payments/--ai flags + auditor subagent) included, and a final EVERYTHING-AUDITOR subagent reviews the app, the plan, the instructions, the memory and the reports — then applies hardening fixes, adds tests, brainstorms next ideas, and feeds skill improvements back. A daily MEMORY.md protocol keeps the user and the AI in sync across every session and any tool.
---

<!-- ════════════════════════════════════════════════════════════════════════
     🎬 deepak-skill — crafted by Deepak · skill: vibe-code-webapp
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

**🎬 deepak-skill — crafted by Deepak** · skill: `vibe-code-webapp` · [deepak-skill on GitHub](https://github.com/Deepak-ai-93/deepak-skill) · MIT

# skill: vibe-code-webapp

**Name:** Vibe-Coding Web App Builder (onboard → scan existing → expert research → SaaS validation → design source of truth + build pack + todo → confirm → build step-by-step → audit → report + everything-auditor → deliver)
**Description:** Turns any app idea — "I want to build something like X with Next.js" — into a **complete, distraction-free build pack** and then a **working, production-ready web app**. The skill first **onboards** you with a detailed idea interview, and if you're already in a project with code, **scans the existing structure** so the plan *extends* what exists instead of restarting. Then it **researches like an expert** (`research-playbook.md`: Reddit/Trends signals + competitor teardown + TAM/SAM/SOM + channels + pricing + a one-line positioning statement), **validates like a SaaS expert** (`saas-validator.md` + `saas-score.mjs`: the /35 scorecard, kill criteria, unit economics, a kill guardrail, validation moves → `validation.md` with an honest BUILD / ITERATE / PIVOT), locks a **design source of truth** (Figma via the **Figma Developer MCP**, **Google Stitch** with its `DESIGN.md`, or the open-source design pack — see `frontend-design.md`), and writes the **Build Pack**: `PRD.md` (what to build) + `stack-blueprint.md` (exactly HOW — locked design system, backend architecture, **AI-feature rails when the PRD has AI** (`ai-logic.md`), paste-ready data model, numbered build order) + **`sitemap.md`** (the whole app on one page — full sitemap, every frontend page, backend architecture, workflows) + `TODO.md` (the task list with P0/P1/P2 priorities). **You confirm the pack AND the todo list before any code** — and you can add tasks or re-prioritize them anytime, even mid-build. The pack is **tool-agnostic**: build with any CLI (Claude Code, Cursor, Codex, Gemini CLI, Antigravity, Grok Build, Freebuff) **or** paste it into web builders (Lovable, Bolt, v0). A **daily `MEMORY.md`** records decisions, progress and next steps so you (or any AI, in any tool) can pick up exactly where you left off — every single day. The production audit runs on whatever folder any tool produces (with `--payments` and `--ai` flags).

---

## When to use

- "I want to build something like **X**" / "an app with **Next.js**" — any idea + optional stack preference (new project)
- "**Extend** my app / add this feature to the project I already have" — **existing project mode**: the skill scans your structure first, then plans the extension on top of it
- "Turn this idea into a SaaS / MVP / tool" — full pipeline
- User has a stack in mind ("React + Vite", "Next.js + Supabase") → the skill validates it and locks it into the pack
- "Is this idea worth building?" → **SaaS validator only** (`saas-validator.md` + `saas-score.mjs` → `validation.md`)
- "I have a Figma design" / "build from this Figma link" → **design-first**: Figma Developer MCP extracts tokens + layout into the pack (`frontend-design.md`)
- "No design — generate one" → **Google Stitch** canvas → `DESIGN.md` → locked tokens, or the open-source design pack
- "The app has a chat/AI feature" → **AI rails** (`ai-logic.md`) locked into the blueprint + `audit --ai` at the end
- Non-SaaS too (tools, internal apps, landing+waitlist): skip monetization-specific checks, keep the rest
- "Start the day with context" / "remember where we are" → the **memory protocol** (`MEMORY.md`) is always on

**Invariant:** *Research, scanning and evaluation are always allowed; **no code is written before the user has approved the Build Pack** (`PRD.md` + `stack-blueprint.md` + `sitemap.md`) **and the todo list** (`TODO.md`).*

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
  saas-score.mjs        # SaaS validator scorecard → BUILD/ITERATE/PIVOT + validation.md
  scan-project.mjs      # existing-project mode: structure scan → project-scan.md
  todo.mjs              # TODO.md manager (list/add/priority/status/confirm)
  audit-webapp.mjs      # production-readiness audit (marker-based, any stack; --payments/--ai)
templates/
  prompts.md                 # copy-paste prompts for any CLI + handoff prompts
  idea-interview.md          # the detailed idea questionnaire (Stage 0)
  research-playbook.md       # EXPERT research: signals → competitor teardown → TAM/SAM/SOM → channels → pricing → positioning
  saas-validator.md          # SaaS VALIDATOR: /35 scorecard + kill criteria + unit economics + guardrail + validation moves
  prd-template.md            # PRD (what to build)
  stack-blueprint-template.md# BUILD PACK: stack lock, design source of truth, architecture, AI rails, data, build order, handoff prompts
  frontend-design.md         # DESIGN-TO-CODE: Figma Developer MCP + Google Stitch DESIGN.md + browser-MCP QA + token mapping
  ai-logic.md                # AI-FEATURE RAILS: streaming UX, prompts-as-code, cost rails, evals, security, build order
  todo.md                    # TODO.md format + the confirmation contract
  memory.md                  # MEMORY.md daily memory protocol
  vibe-coder-instructions.md # BUILD.md — the step-by-step build manual (flowchart, golden loop, design parity, memory + report rules)
  build-report.md            # the detailed, evidence-backed build report (per session + final handover)
  design-system.md           # open-source design system pack (Tailwind + shadcn/ui tokens + components)
  backend-architecture.md    # backend architecture pack (Drizzle/Postgres, Auth.js, Stripe, security, ops)
  sitemap-pages.md           # sitemap.md — full sitemap + every frontend page + backend architecture + workflows (one markdown)
  production-checklist.md    # the go-live bar (mirrors audit-webapp.mjs)
```

**Prerequisites:** Node.js 18+ (for the scripts). Everything else is the chosen stack's (`npm create next-app@latest` etc.) — no other dependencies.

---

## The workflow

```
start ──► 0. ONBOARD ──► 1. EXPERT RESEARCH ──► 2. SAAS VALIDATOR ──► 3. BUILD PACK + TODO ──► USER CONFIRMS ──► 4. BUILD ──► 5. AUDIT ──► 6. REPORT + FINAL REVIEW ──► 7. DELIVER
            │              │                    │                   │                        ▲                 │            │                │
            ├─ idea-       ├─ idea-brief.md     ├─ saas-score.mjs   └─ PRD.md + stack-       └─ (edit /        └─ work the └─ fix loop       └─ build-report.md
            │  answers.md  │  (signals +        │  (scorecard /35)     blueprint.md +            reject)         TODO list     until PASS        (detailed)
            │  (interview) │   teardown +       ├─ validation.md   sitemap.md +                             (todo.mjs +                       +
            └─ project-    │   TAM/SAM/SOM +    │  (kill criteria,   TODO.md (P0/P1/P2)                       BUILD.md instructions)              everything-
               scan.md     │   channels +       │   economics,       └─ design source of truth:              + design parity              auditor subagent
               (existing   │   positioning)     │   guardrail)         Figma MCP / Stitch / pack            (frontend-design.md)          (app + plan +
                projects)  │                    └─ BUILD/ITERATE/      + AI rails if PRD has AI                                                instructions +
                           ▼                    PIVOT verdict          (ai-logic.md)                                                         memory + reports
              MEMORY (always on): read MEMORY.md at session start · append today's entry at the end                                     → hardening /
                                                                                                                                    tests / brainstorm)
```

### Stage 0 — Onboard: interview the idea, scan the project (always first)

The skill NEVER guesses the idea silently. It starts with a **detailed interview** (not just 3 questions — the full `templates/idea-interview.md`), and when run inside a project that already has code, it **scans the existing structure** first so the plan is grounded in what's actually there.

**0a — Detect the mode.** Does the current folder already contain a project (package.json / requirements.txt / src / app)? 
- **No → New-project mode.** Go straight to the interview (0b).
- **Yes → Existing-project mode.** Run the scan first (0a′), then interview with the *existing-project* questions.

**0a′ — Scan the existing project (existing-project mode only):**

```bash
node scripts/scan-project.mjs --dir . --name {app}        # → output/scan/project-scan.md
```

The scan captures the **ground truth**: detected stack, folder structure, pages/routes, data/auth/payment markers, env files, tests/CI/deploy config. The agent then completes the judgment sections — *existing features & routes, data model, gaps & risks, extension opportunities*. This file is what the build pack is planned **on top of**: the plan EXTENDS the existing app, never ignores it.

**0b — The detailed idea interview.** Walk through `templates/idea-interview.md` one section at a time (idea → users → scope → stack → business → timeline → metrics → design & AI; plus section 8 in existing-project mode). Every question can be answered, partially answered, or **"skip — you decide"** (defaults are listed). Record the user's verbatim answers to `output/idea/idea-answers.md`.

**0c — Initialize the shared memory (first session only):** copy `templates/memory.md` → `MEMORY.md` (project root). It records the goal, stack, standing decisions, and the daily log — the user and any AI read/write it every session from now on.

> The interview feeds everything downstream: the research brief, the scorecard, the PRD, and the TODO list. Skipping it means guessing — and the skill never guesses silently.

### Stage 1 — Expert research (don't build on vibes alone)

Goal: an **`idea-brief.md`** that proves (or disproves) demand at expert depth — the evidence the validator scores. In existing-project mode, the research validates the **change** you're planning, not a from-scratch product. Follow **`templates/research-playbook.md`** end-to-end.

```bash
node scripts/research-idea.mjs --niche "saas for freelancers" --subreddits "freelance,Entrepreneur,webdev" --geo US
```

- **1a — keyless signals:** Reddit top-of-day (real pain + user language) + Google Trends (rising topics). Copy the scaffold to the project root as the live `idea-brief.md`.
- **1b — agent deep research (the expert layer):** competitor teardown (3–6 rivals, their complaints = your roadmap), **TAM → SAM → SOM** sizing, distribution channels you can actually use, pricing anchors, and a **one-line positioning statement** (research-playbook.md §2).
- **1c — brainstorm ≥5 product angles**, pick the best **problem-to-effort × reachability** winner (research-playbook.md §3). For existing projects: ≥5 extension angles on the current app.

**Definition of done:** every validator criterion (§1 of saas-validator.md) can be scored with a sourced answer — no "probably", no "I think".

### Stage 2 — Analyze the idea + stack, then validate (SaaS validator)

**Analyze (extract — the interview already captured most of this; only re-ask if something is still vague):**

| Field | Extract / default |
|---|---|
| **Idea** | Their words, verbatim — the kernel to build on |
| **Stack preference** | Next.js? Vite? Express? "whatever fits"? → validate it fits the idea (see below) |
| **Audience / platform** | Who uses it, web/PWA/internal |
| **Monetized?** | yes (which model) / no |
| **Constraints** | timeline, existing accounts, must-have features |

**Stack analysis:** if the user named a stack, check it against the idea (e.g. "Next.js" fits a SaaS; "Vite+React+Express+SQLite" fits a small tool; Astro fits content sites). If it fits, **lock it into the pack as-is**. If it fights the idea, say so in one line and recommend the default (`templates/backend-architecture.md` §1) — but the user's choice wins unless it can't do the job. **In existing-project mode the existing stack is the default** — no re-platforming unless the user insists and the scan justifies it.

**Evaluate — the SaaS validator (templates/saas-validator.md), scored 1–5 each on the /35 scorecard with evidence:**

| Criterion | Ask | What a 5 looks like |
|---|---|---|
| Problem clarity | Real, repeated pain — or a nice-to-have? | Pain in the user's own words; they already pay for a workaround |
| Market size & reachability | Enough buyers you can actually reach? | SOM × price clears the bar AND a real channel exists |
| Competition | Crowded me-too (low) vs differentiated gap (high)? | Incumbents have user-quoted complaints; you have a wedge |
| Monetization | Would they pay? (skip for non-monetized apps) | Clear willingness to pay; unit economics positive |
| Technical feasibility | Buildable fast with vibe-coding on the locked stack? (existing projects: how much of it already exists in the scan?) | No research-grade risk; vibe-code-able in weeks |
| Moat / why not copyable | Network effects, data, workflow lock-in? | Something real: data, lock-in, distribution |
| Time-to-MVP | Honest weeks-to-first-user (existing projects: often shorter — you're extending) | Weeks, not quarters |

**Verdict (deterministic):**

```bash
node scripts/saas-score.mjs --scores 5 4 4 5 5 3 4            # → BUILD/ITERATE/PIVOT
node scripts/saas-score.mjs --scores 5 4 4 5 5 3 4 --out validation.md   # + scaffold validation.md
```

≥ 30 **BUILD** · 25–29 **ITERATE** (sharpen scope) · < 25 **PIVOT or KILL** — then run the **kill-criteria check + unit-economics sanity + kill guardrail** (saas-validator.md §3–§5), plan ≥1 **validation move** (§6), write `validation.md`, and share the verdict + top 3 risks before going further. **Any kill criterion hit → stop and talk to the user — never write a build pack for a dead idea.**

### Stage 3 — Write the BUILD PACK + TODO list, and STOP for approval (the gate)

The **build pack** is what makes vibe coding distraction-free: every decision is already made, and the work is broken into a task list you own. Four files:

**`PRD.md`** ← `templates/prd-template.md` — what to build: problem, personas, MVP must-haves, flows, data model, auth/payments, KPIs, decisions. *(Existing-project mode: the PRD describes the EXTENSION — what changes in the existing app, what stays untouched.)*

**`sitemap.md`** ← `templates/sitemap-pages.md` — the **whole app on one page**: (1) the full **sitemap** — every route in a Mermaid diagram + a complete route table, (2) every **frontend page** with purpose, layout, components, data and states, (3) the **backend architecture** — folder structure, paste-ready data model, every endpoint/server action, auth + payments flows, env vars, (4) the **workflows** — numbered user journeys + system workflows + an end-to-end sequence diagram. *(Existing-project mode: start from `project-scan.md` and mark existing routes ✅ / changed ➕ / new 🆕.)*

**`stack-blueprint.md`** ← `templates/stack-blueprint-template.md` — exactly HOW:
- **Stack lock** — one row per layer, versions, zero open decisions *(existing projects: locked to the scanned stack + what's added)*
- **Design source of truth** (from `templates/frontend-design.md`) — Figma file (via the **Figma Developer MCP**: `get_design_context` + `get_variable_defs` → real tokens), **Google Stitch** canvas (text/sketch → UI + `DESIGN.md`), or the open-source pack; token-mapping rules + design-parity QA *(existing projects: reuse the app's existing design tokens if present — the scan says so)*
- **Design system** (from `templates/design-system.md`) — tokens, fonts, page→component map; open-source, applied as-is
- **Backend architecture** (from `templates/backend-architecture.md`) — folder structure, auth flow, payments flow, security, ops
- **AI-feature rails** (from `templates/ai-logic.md`, ONLY if the PRD has an AI feature) — AI SDK, streaming UX, prompts-as-code, cost rails, evals, security; if no AI, this section is simply absent
- **Data model** — paste-ready SQL/Drizzle tables with FK + index rules *(existing projects: only the NEW tables/changes; existing schema stays)*
- **Build order** — numbered steps with a "definition of done" each; never skip ahead
- **Handoff prompts** — CLI prompt + Lovable/Bolt/v0 mega-prompt + re-prompt, pre-filled with the app's real details

**`TODO.md`** ← `templates/todo.md` + managed by **`scripts/todo.mjs`** — the build plan as a task list the user owns:

```bash
node scripts/todo.mjs init                                # create TODO.md
node scripts/todo.mjs list                                # view, grouped by priority
node scripts/todo.mjs add "build the invoice form" --p P0 --ref PRD-4
node scripts/todo.mjs priority 3 P0                       # user re-prioritizes anytime
node scripts/todo.mjs doing 2 / done 2 / blocked 2        # status tracking
node scripts/todo.mjs confirm                             # user approves → build may start
```

Every build-order step becomes a TODO task (P0 = do first, P1 = important, P2 = nice to have). Extra ideas from the interview go to P2 (or `NEXT.md`).

Then **present all four files and wait**. The user may **approve** (agent runs `todo.mjs confirm` — the gate), **edit** (revise + re-present), or **reject** (stop). **No scaffolding before the user approves the pack AND the todo list.**

> A vague prompt ("make an app for productivity") → the interview extracts the details (audience? monetized? stack?) and defaults the rest. A prompt with a stack ("Next.js + Supabase") → analyze, validate, and lock it. In an existing project → scan first, then plan the extension.

### Stage 4 — Build ANYWHERE, STEP BY STEP (work the confirmed TODO list)

Hand the approved pack to whichever builder the user wants — it's tool-agnostic by design:

| Builder | How the pack is used |
|---|---|
| **CLI agents** (Claude Code, Cursor, Codex, Gemini CLI, Freebuff…) | Copy `templates/vibe-coder-instructions.md` → `BUILD.md` in the repo, then build **step by step** from it: session-start ritual → golden loop (one task at a time) → memory + report rules (craft rules below) |
| **Lovable / Bolt / v0** | Paste the handoff mega-prompt from `stack-blueprint.md` §7-B (it carries pages, design tokens, data model, auth/payments, feature order) |
| **Hybrid** | CLI agent builds; user opens the result in a web builder for UI tweaks — same pack, same contract |

**The vibe coder's step-by-step instructions** (`templates/vibe-coder-instructions.md` → `BUILD.md`) tell the builder exactly how to work, and cover **both new and existing projects**:
1. **Session-start ritual** — read `MEMORY.md` → check the TODO gate (NO confirmation = STOP) → read `PRD.md` + `stack-blueprint.md` + `sitemap.md` + `TODO.md`.
2. **The golden loop, per task** — pick highest-priority open task → read its scope (`— ref:`) → implement the smallest change → **run** the app → verify the definition of done → `todo.mjs done <id>` (only when verified) → commit → append `build-report.md` → log lasting decisions to `MEMORY.md`.
3. **Design parity per screen** — UI tasks include a visual check against the design source of truth (Figma frame / Stitch export / pack tokens) — screenshot + compare, don't eyeball (`frontend-design.md` §3).
4. **AI tasks (if any)** — follow the AI rails: streaming UI, abort/stop, timeouts, zod-validated output, cost caps, evals — and never commit a mocked AI response as done (`ai-logic.md` §9).
5. **Build order** — `stack-blueprint.md` §6, never skipped ahead; never two steps before the app runs again.
6. **Memory + reports** — append `MEMORY.md` (Did/Decided/Blocked/Next) and a **detailed `build-report.md` session entry** (what/where/evidence) at the end of every session.

**Vibe-coding craft rules** (CLI builds — the pack makes them easy):
1. **Run early, run often** — the app must start after every change, not at the end.
2. **Work the TODO list, one task at a time** — implement → run → verify → `node scripts/todo.mjs done <id>` → commit. Follow the priorities.
3. **No gold-plating** — build the PRD must-haves; extra ideas go in `NEXT.md` (or P2 tasks).
4. **Secrets never in code** — `process.env` only, `.env.example` committed, `.env` gitignored.
5. **Tests for the money paths** — auth, billing, anything that deletes data.
6. **Commit after every working feature.** Update `MEMORY.md` + `build-report.md` at the end of each session.

**The user is the PM, mid-build:** at any point the user can say *"make task 4 P0"* or *"add a task: …"* → the agent runs `node scripts/todo.mjs priority 4 P0` / `add "…" --p P1`, says what changed, and works the new order. If the change contradicts the confirmed PRD, the agent re-confirms scope with the user first.

### Stage 5 — Audit for production (works on ANY builder's output)

The audit is marker-based, not framework-based — run it on whatever folder the CLI agent or Lovable/Bolt produced.

**5a — run the script:**

```bash
node scripts/audit-webapp.mjs --dir . --name {app} --payments   # --payments only if monetized
node scripts/audit-webapp.mjs --dir . --name {app} --ai         # +AI-feature checks if the PRD has AI
```

Scans for app entry, run/build scripts, `.gitignore`, `.env.example`, hardcoded secrets, auth, database, payments, error handling, validation, CORS/rate-limit, tests, lint, CI, deploy config, analytics, SEO → `audit-report.md` with PASS/WARN/FAIL + auditor section. `--ai` adds AI checks from `ai-logic.md`: LLM SDK present, streaming UX, abort/timeout handling, AI keys in env (never hardcoded or `NEXT_PUBLIC_`), rate limiting on AI routes, evals/tests. Exit 1 on any FAIL.

**5b — spawn the auditor subagent** (fresh eyes — never audit your own work):

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

**5c — fix loop.** Any FAIL (or auditor-flagged WARN) → fix → re-run → re-submit. **Nothing is delivered until the auditor signs off PASS.**

### Stage 6 — Report, then the EVERYTHING-auditor (final review), then fix

The reports must be **proper and detailed** — they are what the final review is judged on. Three artifacts: `audit-report.md` (automated, Stage 5), `build-report.md` (per-session, evidence-backed), `MEMORY.md` (daily).

**6a — Write the detailed build report.** `build-report.md` ← `templates/build-report.md`: per session — tasks worked (mapped to TODO ids), what was built with exact file paths, verification evidence (commands + output), deviations from the blueprint (and whether the blueprint was updated), decisions, tests, risks, next steps. A vague report is sent back.

**6b — Spawn the EVERYTHING-auditor subagent** (fresh eyes — the final gate. It analyzes ALL of it, not just the code):

```
You are the FINAL REVIEW auditor for the vibe-coded app at {dir} ({name}).
Analyze EVERYTHING, then make changes where needed:
1. THE APP — read output/audit/audit-report.md; confirm the production verdict
   (secrets, actually runs, broken/half-built screens, error states, mobile,
   accessibility).
2. THE PLAN — read PRD.md + stack-blueprint.md + sitemap.md + TODO.md: was
   every confirmed must-have actually built? Do the routes/pages/endpoints
   match sitemap.md (no missing or extra screens)? Scope drift? Half-built
   features? Gaps? Does the UI match the design source of truth (Figma /
   Stitch / pack) — layout, spacing, tokens, states? If the PRD promised AI
   features, do they stream, handle abort/timeout, keep keys env-only, and
   have evals (ai-logic.md)?
3. THE INSTRUCTIONS — read SKILL.md + templates + BUILD.md: were the
   step-by-step instructions followed? Where did they cause friction or
   missing steps? (This is feedback to improve the skill itself.)
4. MEMORY — read MEMORY.md: does it reflect reality? Standing decisions
   captured? Today's entry present?
5. REPORTS — read build-report.md: is it detailed and evidence-backed?
Then produce:
- VERDICT: PASS / CHANGES NEEDED
- FIX LIST, three kinds:
  a. HARDENING — production issues (from the audit or your review): concrete fixes
  b. TEST HARNESS — tests missing for money paths (auth/billing/delete): list
  c. BRAINSTORM — 3–5 new feature angles/improvements from what exists → NEXT.md / P2
- SKILL FEEDBACK — concrete suggested edits to SKILL.md/templates so the next
  build goes smoother (submit to the user; apply only with their approval).
Report the verdict, the fix list, and the paths you reviewed.
```

**6c — Fix loop (harness + brainstorming).** Apply the auditor's **hardening** fixes and **test-harness** gaps → re-run `audit-webapp.mjs` → re-submit. Add the **brainstormed** angles to `NEXT.md` (and P2 tasks via `todo.mjs add` if the user wants them). If the auditor flagged **instruction** problems, apply the user-approved **skill feedback** edits. **Nothing ships until the everything-auditor signs off PASS.**

### Stage 7 — Deliver

- Working app + `PRD.md` + `stack-blueprint.md` + `sitemap.md` (full sitemap + pages + backend architecture + workflows) + `TODO.md` (confirmed, done-state) + `BUILD.md` + `build-report.md` (detailed, auditor-signed) + `idea-brief.md` + `idea-answers.md` + `validation.md` (verdict + guardrail) + (existing projects) `project-scan.md` + `audit-report.md` (PASS) + `MEMORY.md` (today's entry written).
- A production README: what it is, setup, env vars, deploy + rollback runbook.
- Tell the user: the one-line pitch, the scorecard total + verdict, what was built (map to the confirmed TODO), the auditor's verdict + what the fix loop changed, what's in `NEXT.md`, and how to rebuild/tweak it in their favorite tool (paste the blueprint's handoff prompt).

---

## Memory — the daily shared brain (`MEMORY.md`)

**The web-app building process is done — memory keeps it going.** `MEMORY.md` (project root, from `templates/memory.md`) is the project's shared memory: the **user and any AI** read and write it every day, in any tool, so no session ever starts from zero.

| When | Who | What |
|---|---|---|
| Session start | AI | Read `MEMORY.md` first → greet with *"Picking up from {last date}: next is …"* — never re-ask decided things |
| During session | Both | Lasting decisions append to **Standing decisions** immediately |
| Session end | AI | Append `## YYYY-MM-DD` → **Did / Decided / Blocked / Next** (≤8 bullets, tool-neutral) |
| Anytime | User | Add their own lines under today's date ("remember: pricing is $9, not $12") |
| Daily | Both | **User or AI uses the memory daily** — it is the continuity between sessions and between tools |

If `MEMORY.md` is missing → initialize it from the template (Stage 0c). **Memory is cheap, rediscovery is expensive:** when in doubt, check `MEMORY.md` first.

---

## Todo — the user-owned task list (`TODO.md`)

| Command | What it does |
|---|---|
| `node scripts/todo.mjs list` | Show tasks grouped by priority + confirmation status |
| `node scripts/todo.mjs add "task" --p P1 --ref PRD-4` | User or AI adds a task (stable `#id`) |
| `node scripts/todo.mjs priority <id> P0` | User re-prioritizes anytime — even mid-build |
| `node scripts/todo.mjs doing/done/blocked/todo <id>` | Status tracking (done only when verified) |
| `node scripts/todo.mjs remove <id>` | Remove a task |
| `node scripts/todo.mjs confirm` | **The gate** — only after the user approves (pack + list together) |

Rules: the **user owns the list** · `P0` do first / `P1` important / `P2` nice-to-have · a task is `done` only when it runs and is verified · the list stays in sync with `PRD.md` + `stack-blueprint.md` + `sitemap.md` (contradictions → update both + re-confirm).

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
- [ ] Every route/page/endpoint in `sitemap.md` exists in the app (and nothing major is missing from the sitemap)
- [ ] Mobile responsive; empty/loading/error states; accessibility basics
- [ ] Design system held: tokens-only, no per-page colors/fonts (per `design-system.md`)
- [ ] Design parity: screens match the design source of truth (Figma/Stitch/pack) — layout, spacing, tokens, states (per `frontend-design.md`)
- [ ] AI features (if any): streaming UX, abort/timeout, keys env-only, rate-limited, evals exist (per `ai-logic.md` + `audit --ai`)
- [ ] Two identical audit runs produce the same verdict (deterministic script)

---

## Example session

**Existing project + new feature, with memory:**

**User:** "I want to add a subscription tier to my existing app. Also, remember where we left off."

**Agent:** *(Start)* Reads `MEMORY.md` → "Picking up from yesterday: the app is live, last task was fixing the invoice PDF export. The confirmed TODO has 2 open items." Then runs the scan: `node scripts/scan-project.mjs --dir . --name invoiceflow` → `project-scan.md`: Next.js 15 + Drizzle/Postgres + Auth.js already wired, Stripe one-time checkout present, no subscription logic.

**Agent:** *(Stage 0 — interview)* Asks the existing-project questions (8.1–8.4): what to ADD (subscriptions + a plans page), what must NOT break (current one-time invoices), records answers to `output/idea/idea-answers.md`.

**Agent:** *(Stage 1)* `research-idea.mjs --niche "freelancer invoicing subscriptions"` → brief confirms competitors all moved to recurring → angle: "usage-based paid plan".

**Agent:** *(Stage 2)* Runs `saas-score.mjs --scores 5 4 4 5 5 3 4` → **30/35 → BUILD**, checks kill criteria (none hit) + unit economics (margin 82%, payback 6 mo), writes `validation.md` with the guardrail, and proposes a validation move (2 interviews with freelancer communities).

**Agent:** *(Stage 3)* Writes `PRD.md` (extension: plans page + Stripe subscriptions + entitlement gate), `stack-blueprint.md` (stack locked to the existing one; new `subscriptions` table; build order 1–6), `sitemap.md` (marks the existing routes ✅, the new plans/billing pages 🆕, and the subscription workflows), and builds the `TODO.md` from the build order with priorities. Presents all four files, waits. **User:** "approve, and make task 4 P0 — I want the plans page first." Agent runs `node scripts/todo.mjs priority 4 P0` then `node scripts/todo.mjs confirm`.

**Agent:** *(Stage 4)* Works the confirmed TODO in priority order: plans page → checkout → webhook → entitlements → tests. Runs after every task, `todo.mjs done <id>` when verified, commits each feature. **User mid-build:** "add a task — annual discount." → `node scripts/todo.mjs add "annual discount (20%)" --p P1 --ref PRD-6`, continues.

**Agent:** *(Stage 5)* `audit-webapp.mjs --dir . --name invoiceflow --payments` → 1 FAIL (webhook secret in code) → fixes → auditor signs **PASS**.

**Agent:** *(Stage 6 — report + everything-auditor)* Writes `build-report.md` (tasks → files → evidence, deviations, tests, risks). Spawns the everything-auditor: it reviews the app (PASS), the plan (all confirmed must-haves built; 1 gap: no cancel-subscription path in the PRD → added as P2), the instructions (BUILD.md flow worked; suggested one edit: call out Stripe test keys earlier in the blueprint), memory (accurate), reports (detailed). Fix loop: hardening (webhook idempotency guard) + test harness (subscription-cancel test) applied; brainstorm → `NEXT.md`: churn emails, usage metering, annual invoicing; skill feedback edit approved by the user and applied to the blueprint.

**Agent:** *(Stage 7)* Delivers: extension live, `TODO.md` all done, `MEMORY.md` today's entry appended ("Shipped subscriptions; next: churn emails"), plus the handoff prompt so the user can tweak in Lovable/Bolt.

---

## Production checklist

- [ ] Mode detected: **new project** vs **existing project** (code in the folder?)
- [ ] Existing project → `scan-project.mjs` ran; `project-scan.md` completed (features, gaps, extension opportunities)
- [ ] **Detailed idea interview** ran (`idea-interview.md`); verbatim answers in `idea-answers.md`; "skip — you decide" used for defaults, never silent guessing
- [ ] `MEMORY.md` initialized (first session) from `templates/memory.md`
- [ ] **Expert research** ran per `research-playbook.md`: `idea-brief.md` with dated+sourced signals, competitor teardown, TAM/SAM/SOM, channels, pricing, positioning; ≥5 angles, winner locked
- [ ] **SaaS validator** ran: `saas-score.mjs` verdict (/35) + kill-criteria check + unit-economics sanity + kill guardrail + ≥1 validation move → `validation.md`; BUILD / ITERATE / PIVOT shared; no pack written on a kill criterion
- [ ] **Build pack** written: `PRD.md` + `stack-blueprint.md` (stack lock, **design source of truth** — Figma/Stitch/pack per `frontend-design.md`, design system, architecture, **AI rails if the PRD has AI** per `ai-logic.md`, paste-ready data model, numbered build order, filled handoff prompts)
- [ ] **`sitemap.md` written** from `templates/sitemap-pages.md` — full sitemap (every route), every frontend page block, backend architecture + endpoints, workflows; no `{…}` placeholders left
- [ ] **`TODO.md` built from the build order with priorities (P0/P1/P2)**; `todo.mjs list` shows it
- [ ] **Approval gate: user explicitly approved the pack AND the todo list** (`todo.mjs confirm`) before ANY code
- [ ] Built per the blueprint + TODO list (CLI craft rules) or pasted into the user's chosen builder (Lovable/Bolt/v0) via the handoff prompt
- [ ] User additions/re-prioritizations mid-build handled via `todo.mjs` and re-confirmed if scope changed
- [ ] `audit-webapp.mjs` ran on the delivered folder with the right flags (`--payments` if monetized, `--ai` if AI features): PASS/WARN/FAIL + `audit-report.md`
- [ ] Auditor subagent signed off **PASS**; any FAIL fixed and re-audited
- [ ] **`BUILD.md`** (vibe-coder instructions) copied to the project root; build followed its golden loop
- [ ] **`build-report.md` written — detailed and evidence-backed** (what/where/evidence, deviations, tests, risks)
- [ ] **Everything-auditor subagent ran** (app + plan + instructions + memory + reports): verdict recorded, hardening + test-harness fixes applied, brainstorm → `NEXT.md`, skill feedback submitted/approved
- [ ] Everything-auditor signed off **PASS** after the fix loop
- [ ] **`MEMORY.md` today's entry appended (Did / Decided / Blocked / Next)**
- [ ] Delivered: working app + `PRD.md` + `stack-blueprint.md` + `sitemap.md` + `TODO.md` + `BUILD.md` + `build-report.md` + `idea-brief.md` + `audit-report.md` + production README
