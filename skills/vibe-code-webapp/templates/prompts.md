# Prompt Pack — vibe-code-webapp (copy-paste for ANY agent)

Install once: `npx skills add Deepak-ai-93/deepak-skill --skill vibe-code-webapp`
Works in Claude Code, Cursor, Windsurf, Codex CLI, Gemini CLI, Antigravity, Grok Build, Freebuff — any CLI with a terminal.

---

## 1. New project — full pipeline (idea → interview → research → pack + todo → approve → build → audit)

> Using the **vibe-code-webapp** skill, I want to build **{idea}** for **{audience}**.
> Stack preference: **{Next.js / React + Vite / Express / whatever fits}** · Monetized: {yes / no}
> Run the full pipeline: run the detailed **idea interview** first (ask me the
> `idea-interview.md` questions, I'll answer or say "skip"), then research demand,
> evaluate my idea on the SaaS scorecard, write the **build pack**
> (`PRD.md` + `stack-blueprint.md` + **`sitemap.md`** — the full sitemap with
> every frontend page, the backend architecture and all workflows — + a
> **`TODO.md` with P0/P1/P2 priorities** managed by `todo.mjs`) → **wait for my
> approval of the pack AND the todo list**
> → build it **step by step** from `vibe-coder-instructions.md` (BUILD.md),
> file a detailed `build-report.md`, run the production audit, then spawn the
> **everything-auditor** for the final review (app + plan + instructions + memory
> + reports → hardening / tests / brainstorming) → deliver. Initialize
> **`MEMORY.md`** and log today's entry.

## 2. Existing project — extend what I already have (scan first)

> Using the **vibe-code-webapp** skill in EXISTING-PROJECT mode: this folder already
> has a working app. First run `node scripts/scan-project.mjs --dir . --name {app}`
> and complete `project-scan.md` (existing features, gaps, extension opportunities).
> Then run the existing-project **idea interview** (section 8 questions) for what I
> want to **{add / change}**: **{new feature / fix / next phase}**.
> Then research, evaluate, and write the **build pack** as an EXTENSION of the
> current code (keep my stack, schema and design system) + a **`TODO.md`**.
> **Wait for my approval of the pack AND the todo list** before writing any code.
> Then build step by step from `BUILD.md` (vibe-coder-instructions), file a
> detailed `build-report.md`, audit, and finish with the **everything-auditor**
> final review before delivering.

## 3. Idea interview only (Stage 0)

> Using the **vibe-code-webapp** skill, run the detailed **idea interview** for:
> **{one-line idea}**. Ask me the `idea-interview.md` questions section by section
> (idea → users → scope → stack → business → timeline → metrics). I'll answer or
> say "skip — you decide". Record my verbatim answers in `output/idea/idea-answers.md`.
> Don't research or build anything yet.

## 4. Scan an existing project only

> Using the **vibe-code-webapp** skill, scan this project's structure:
> `node scripts/scan-project.mjs --dir . --name {app}` → complete `project-scan.md`
> sections 3–9: stack details, existing features & routes, data model, env vars,
> gaps & risks, and what a new feature could build on. Don't write code.

## 5. Research only (Stage 1)

> Using the **vibe-code-webapp** skill, research demand for **{idea}**:
> run `node scripts/research-idea.mjs --niche "{niche}" --subreddits "{r1},{r2}" --geo US`,
> then web-research competitors + pricing, and write the completed `idea-brief.md`
> with 5+ product angles. Don't build anything yet.

## 6. Evaluate only (Stage 2 — the SaaS evaluator)

> Using the **vibe-code-webapp** skill, evaluate this idea before building:
> **{idea}** for **{audience}**. Score it 1–5 on all 7 scorecard criteria
> (problem clarity, market size, competition, monetization, feasibility,
> moat, time-to-MVP), give the /35 total and a BUILD / ITERATE / PIVOT verdict
> with the top 3 risks. Be brutally honest — I'd rather kill it now than build a dud.

## 7. Build pack + todo only (Stage 3 — approval gate)

> Using the **vibe-code-webapp** skill, write the **build pack** for **{idea}**:
> `PRD.md` (MVP scope, flows, KPIs) + `stack-blueprint.md` (locked stack,
> design system from the open-source pack, backend architecture, paste-ready
> data model, numbered build order, and filled handoff prompts for CLI +
> Lovable/Bolt/v0) + **`sitemap.md`** (from `templates/sitemap-pages.md`: the
> full sitemap with every route, every frontend page block, the backend
> architecture and all user/system workflows). Then turn the build order into a
> **`TODO.md`** task list with P0/P1/P2 priorities (`node scripts/todo.mjs init`
> + `add`). Stack: {Next.js / …}. Show me the pack AND the todo list — don't
> write a line of code until I say **approve**.

## 8. Build (Stage 4 — after approval)

> Using the **vibe-code-webapp** skill, build the approved `PRD.md` now.
> Work the confirmed **`TODO.md`** list in priority order — one task at a time:
> implement → run → verify → `node scripts/todo.mjs done <id>` → commit.
> Keep the app runnable after every task, and cover auth + {billing} with tests.
> Demo it to me when the MVP works.

## 9. User is the PM — add / re-prioritize tasks mid-build

> Using the **vibe-code-webapp** skill, update the todo list: run
> `node scripts/todo.mjs add "{new task}" --p {P0/P1/P2}` and/or
> `node scripts/todo.mjs priority {id} {P0/P1/P2}` exactly as I say, show me the
> new order with `node scripts/todo.mjs list`, and if it changes the confirmed
> PRD scope, re-confirm with me before continuing. Then keep building.

## 10. Confirm the pack + todo (the gate)

> Using the **vibe-code-webapp** skill, I **approve** the build pack
> (`PRD.md` + `stack-blueprint.md` + `sitemap.md`) AND the `TODO.md` list. Run
> `node scripts/todo.mjs confirm` (and `priority` re-orders if I gave any),
> then start building per the todo list.

## 11. Production audit (Stage 5)

> Using the **vibe-code-webapp** skill, run the production audit on this app:
> `node scripts/audit-webapp.mjs --dir . --name {app} {--payments}`,
> then spawn the auditor subagent per the skill brief, fix everything it flags,
> and re-audit until the report says PASS.

## 12. Deploy (Stage 7 — part of Deliver)

> Using the **vibe-code-webapp** skill, get this app to production:
> pick the best host for {Next.js / Vite / Express} (Vercel / Railway / Fly),
> add the deploy config, wire env vars, set up the domain + SSL, and give me
> a copy-paste deploy + rollback runbook in the README.

## 13. Memory — start the day (always first message of a session)

> Using the **vibe-code-webapp** skill, read `MEMORY.md` and pick up where we
> left off. Tell me the last session's date and the "Next" line, then continue
> from there. If `MEMORY.md` is missing, initialize it from `templates/memory.md`.

## 14. Memory — end the day (always last message of a session)

> Using the **vibe-code-webapp** skill, append today's entry to `MEMORY.md`:
> a `## {today}` section with **Did / Decided / Blocked / Next** (≤8 bullets each,
> tool-neutral — any tool must be able to continue). Move lasting decisions to
> **Standing decisions**. Then summarize what you logged.

## 15. Keep the vibe loop going

> Continue with the **vibe-code-webapp** skill: from the current state of the
> app (`MEMORY.md` + `TODO.md`), pick the next highest-priority open task,
> implement it, run it, verify, `todo.mjs done <id>`, commit. Keep the app green
> and demoable at all times.

## 16. Build anywhere — handoff prompts (paste the approved build pack)

### CLI agent

> Build the app in `PRD.md` + `stack-blueprint.md` + `sitemap.md` + `TODO.md`
> exactly — work the todo list in priority order, keep the app runnable after
> every task, commit after each working feature, tests for auth + billing. The
> sitemap is the map: every route/page/endpoint in it must exist, nothing else.
> Don't redesign; apply the locked design system and architecture as-is.

### Lovable / Bolt / v0 (paste this + the blueprint's §7 details)

> Build a production-ready web app: **{one-liner}**. Stack: Next.js + TypeScript
> + Tailwind v4 + shadcn/ui + Drizzle + Postgres + Auth.js + Stripe + Vercel.
> Pages: **{list}**. Design: neutral shadcn tokens, accent **{hue}**, Geist fonts,
> **{component list}**. Data model: **{tables}**. Auth: email/Google sign-in,
> protect /dashboard. Payments: **{checkout + webhook → status}**. Features in
> order: **{must-haves}**. Quality: mobile responsive, empty/loading/error
> states, accessibility, SEO meta. Run/verify after every step, no gold-plating.

### Any tool, re-prompt after edits

> Keep this project's design system and architecture unchanged. Implement the
> next open task from `TODO.md` exactly as scoped; run it; verify; commit.

## 17. Build step by step with the vibe-coder instructions (Stage 4)

> Using the **vibe-code-webapp** skill, copy `templates/vibe-coder-instructions.md`
> to `BUILD.md` in this project and build the confirmed `PRD.md` **step by step**
> from it: session-start ritual (read `MEMORY.md`, check the TODO gate) → golden
> loop per task (pick highest-priority open task → read its ref → implement →
> run → verify → `todo.mjs done <id>` → commit → append `build-report.md`) →
> memory + report at session end. Keep the app runnable after every change.

## 18. Write the detailed build report (Stage 6a)

> Using the **vibe-code-webapp** skill, write/update `build-report.md` for this
> session: tasks worked (mapped to TODO ids), what was built with exact file
> paths, verification evidence (commands + output), deviations from the
> blueprint, decisions, tests, risks, next steps. Make it proper and detailed —
> the everything-auditor will reject a vague report. Also append today's entry
> to `MEMORY.md` (Did / Decided / Blocked / Next).

## 19. Spawn the everything-auditor (Stage 6b — final review gate)

> Using the **vibe-code-webapp** skill, spawn the FINAL REVIEW everything-auditor
> subagent exactly as described in SKILL.md Stage 6b: it must analyze THE APP
> (audit-report.md), THE PLAN (PRD/blueprint/sitemap/TODO vs what was built —
> routes and pages must match `sitemap.md`), THE INSTRUCTIONS (SKILL.md +
> templates + BUILD.md — feedback to improve the skill), MEMORY (MEMORY.md),
> and REPORTS (build-report.md). Then run the fix loop: apply HARDENING fixes
> + TEST HARNESS gaps → re-audit → PASS; add the BRAINSTORMED angles to
> `NEXT.md`/P2; submit the SKILL FEEDBACK edits to the user and apply only with
> approval. Report the verdict + what changed.

## 20. Write the app map — sitemap + pages + backend architecture + workflows (Stage 3)

> Using the **vibe-code-webapp** skill, write **`sitemap.md`** for **{idea}** from
> `templates/sitemap-pages.md`: (1) the **full sitemap** — Mermaid diagram +
> complete route table (public / auth / app / API, auth level, existing-project
> ✅/➕/🆕 markers), (2) every **frontend page** block (purpose, layout, auth,
> components, data, actions, states), (3) the **backend architecture** (folder
> structure, paste-ready data model, every endpoint/server action, auth +
> payments flows, env vars), and (4) the **workflows** (numbered user journeys
> + system workflows + sequence diagram). No `{…}` placeholders left; every
> PRD must-have appears as a route + a workflow. Add it to the build pack before
> presenting it for approval.

## 21. SaaS validator only (Stage 2 — expert go/no-go gate)

> Using the **vibe-code-webapp** skill, validate **{idea}** for **{audience}**
> before we build: follow `templates/saas-validator.md` end-to-end — score it
> 1–5 on all 7 criteria **with evidence** (from research), run
> `node scripts/saas-score.mjs --scores <7 numbers>` for the deterministic
> verdict, check the **kill criteria** honestly, sanity-check the **unit
> economics** (margin, CAC, payback, LTV), write the **kill guardrail**, and
> recommend ≥1 **validation move** (interviews / landing+waitlist / fake-door /
> pilot). Write `validation.md`. Be brutally honest — I'd rather kill it now
> than build a dud. If the verdict is PIVOT/KILL, stop and brainstorm the pivot;
> don't write a build pack.

## 22. Design-first build — from a Figma file (Stage 3 design source)

> Using the **vibe-code-webapp** skill, design-first mode: here is the Figma
> design — **{paste the Figma link}**. Connect the **Figma Developer MCP**
> (remote `https://mcp.figma.com/mcp`), run `get_design_context` +
> `get_variable_defs` on the key frames, and map the real tokens into the build
> pack per `templates/frontend-design.md` (design source of truth §1 + token
> mapping §4). Every page block in `sitemap.md` must describe the **actual
> layout from the file**, not a generic template. Then finish the pack (PRD +
> blueprint + sitemap + TODO) and wait for my approval. During the build,
> require design parity per screen.

## 23. Design-first build — generate the design with Google Stitch

> Using the **vibe-code-webapp** skill, I have **no design yet** — generate one
> with **Google Stitch** (`stitch.withgoogle.com`) before the build pack:
> prompt the Stitch canvas with the page list from the sitemap (landing → auth
> → dashboard → …), get back multi-screen UI + **`DESIGN.md`**, map its tokens
> into the locked design system per `templates/frontend-design.md` §2/§4, and
> record Stitch + `DESIGN.md` as the blueprint's design source of truth. Then
> write the full build pack + TODO and wait for my approval.

## 24. Build with AI features (AI rails — `ai-logic.md`)

> Using the **vibe-code-webapp** skill, the approved PRD includes **{AI feature:
> chat / copilot / extraction / …}**. Lock the **AI rails** from
> `templates/ai-logic.md` into the blueprint: AI SDK + model routing (cheap for
> easy, strong for hard), **streaming UX** (streamText + stop button +
> AbortController + timeout), **prompts as code** (versioned files + zod
> schemas), **cost rails** (maxTokens, per-user budget, caching, rate limit),
> **evals** (golden set + `npm run eval` in CI). Build the feature step by step
> per `ai-logic.md` §9 — never commit a mocked AI response as done. Finish with
> `node scripts/audit-webapp.mjs --dir . --name {app} --ai` and the auditor
> sign-off.

## 25. Audit with AI features (Stage 5 + `--ai`)

> Using the **vibe-code-webapp** skill, run the production audit on this app
> (it has AI features): `node scripts/audit-webapp.mjs --dir . --name {app}
> --ai {--payments}`, then spawn the auditor subagent per the skill brief —
> confirm the AI rails held (streaming, abort/timeout, keys env-only, rate
> limits, evals), fix everything it flags, re-audit until PASS.

---

## The vibe-coding craft rules (what these prompts enforce)

1. **Read memory first** — `MEMORY.md` at session start; append today's entry at the end.
2. **Run early, run often** — the app must start after every change, not at the end.
3. **Work the TODO, one task at a time** — implement → run → verify → `done` → commit. No mega-branches.
4. **No gold-plating** — build what `PRD.md` + `sitemap.md` + the todo list say; ideas for later go in `NEXT.md` or P2.
5. **Tests for the money paths** — auth, billing, and anything that deletes data.
6. **Secrets never in code** — `process.env` only, `.env.example` committed, `.env` ignored.
7. **Production audit before handover** — every deliverable passes `audit-webapp.mjs` + the auditor.
8. **The user owns the list** — add / re-prioritize anytime via `todo.mjs`; re-confirm scope if it changes the pack.
9. **Reports are evidence** — `build-report.md` per session (what/where/evidence); the everything-auditor sends vague reports back.
10. **Final review before delivery** — the everything-auditor (app + plan + instructions + memory + reports) signs off PASS after hardening + test-harness fixes; brainstorm goes to `NEXT.md`.
