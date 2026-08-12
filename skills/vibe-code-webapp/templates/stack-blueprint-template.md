# Stack Blueprint — {App Name}

> Copy this template to `stack-blueprint.md` (project root) and fill every field
> from the analysis + evaluation. This file + `PRD.md` + `sitemap.md` are **the
> build pack**: everything the builder needs, nothing it doesn't. Tool-agnostic —
> works in any CLI (Claude Code, Cursor, Codex), Lovable, Bolt, v0, anywhere.
>
> The pack = `PRD.md` (what to build) + `sitemap.md` (the map: every route, page,
> endpoint, workflow) + `stack-blueprint.md` (exactly HOW: design system +
> architecture + data + build order + handoff prompts).

## 1. Identity & verdict

| Field | Value |
|---|---|
| **App name / one-liner** | {e.g. InvoiceFlow — invoices freelancers actually get paid on} |
| **Idea given by user** | {their raw words, verbatim} |
| **Stack preference given** | {Next.js / Vite / none} |
| **Evaluation verdict** | {score /35 → BUILD / ITERATE / PIVOT} (from `validation.md`, computed by `saas-score.mjs`) |
| **Kill guardrail** | {if < X by date → iterate/pivot/kill} (from `validation.md`) |
| **Audience** | {e.g. freelance designers & devs} |
| **Monetized?** | {yes — plan · no} |

## 2. Stack lock (NO more decisions after this)

| Layer | Locked choice | Version/notes |
|---|---|---|
| Framework | Next.js 15 App Router + TypeScript | `npm create next-app@latest -- --typescript --tailwind --app --src-dir` |
| UI | Tailwind v4 + shadcn/ui + Radix + Lucide | see `templates/design-system.md` |
| Fonts | Geist Sans + Geist Mono | |
| Data | Postgres + Drizzle ORM (Supabase/Neon) | `db/schema.ts` below |
| Auth | Auth.js v5 (credentials + Google) | or Supabase Auth |
| Payments | Stripe Checkout + webhooks | test mode first |
| Files | UploadThing / R2 | only if PRD has uploads |
| Hosting | Vercel + Neon/Supabase | |
| Analytics | PostHog | |

> If the user gave a different stack preference, honor it — but lock it here exactly the same way.

## 3. Design — source of truth + design system (applied as-is)

- **Design source of truth (pick ONE — never "TBD"):** `templates/frontend-design.md`
  - **Figma file:** `{paste the Figma link}` → agent connects via the **Figma Developer MCP** and extracts real tokens/layout (`get_design_context` + `get_variable_defs`); screens match the frames.
  - **Google Stitch:** `{link to the Stitch canvas}` → UI generated from the sitemap; `DESIGN.md` extracted and mapped to tokens.
  - **Open-source pack** (no design): the defaults below.
- **Reference:** `templates/design-system.md` — tokens, typography, layout, components.
- **Full sitemap + page map:** see `sitemap.md` (every route, every page block, all workflows). The quick table below is the summary — fill BOTH from the same list of pages.
- **Palette:** neutral shadcn tokens + one accent (`--primary` hue only): `{243 75% 59%}` (mapped from the design source's colors — `frontend-design.md` §4).
- **Design parity:** every screen is visually checked against the source of truth (browser-MCP screenshot vs Figma/Stitch) at 375/768/1280 — `frontend-design.md` §3/§5.
- **Pages & components map (summary — full blocks in `sitemap.md` §2):**

| Page/Route | Components (shadcn) | Notes |
|---|---|---|
| `/` landing | navbar, hero, feature cards, pricing table, FAQ accordion, footer | hook-first hero, one CTA |
| `/login` `/signup` | card, input, label, OAuth buttons, separator | `max-w-md`, centered |
| `/dashboard` | sidebar/sheet, stat cards, data table, badge, tabs, dialog, sonner | app shell layout group |
| … | … | … |

## 4. Backend architecture (open-source, applied as-is)

- **Reference:** `templates/backend-architecture.md` — folder structure, auth flow, payments flow, security, ops.
- **Server actions:** `src/actions/{feature}.ts` — zod schema + ownership check + `revalidatePath`.
- **Route handlers:** `app/api/stripe/webhook/route.ts` (+ `/api/health`).
- **Auth:** `lib/auth.ts` + `middleware.ts` guarding `/dashboard/:path*` and `/api/:path*`.
- **Payments flow:** Checkout Session (`metadata.userId`) → webhook → `subscriptions.status` → `currentPlan()` gate.

### 4.1 AI features (ONLY if the PRD has AI — else delete this section)

- **Reference:** `templates/ai-logic.md` — the locked AI rails (stack, streaming, prompts-as-code, cost, evals).
- **AI SDK + models:** `{Vercel AI SDK + provider}` · cheap model `{gpt-4o-mini}` for `{easy tasks}`, strong model `{gpt-4.1}` for `{hard tasks}`.
- **Streaming:** `streamText` → `{toUIMessageStreamResponse}`; stop button + AbortController + timeout per request.
- **Prompts as code:** `lib/ai/prompts/{feature}.ts` with zod schemas + versioning — no literals in components.
- **Cost rails:** maxTokens per request, per-user/day budget, prompt + response caching, Upstash rate limit per user.
- **Evals:** `tests/ai/evals/` golden set (5–10 cases) + `npm run eval` in CI.
- **Env vars:** `OPENAI_API_KEY` / `ANTHROPIC_API_KEY` (server-only — never `NEXT_PUBLIC_`).

## 5. Data model (paste-ready)

```sql
-- drizzle schema (db/schema.ts) — generated via drizzle-kit
users        (id uuid pk, email text unique, password_hash text, name text, created_at)
subscriptions(id uuid pk, user_id fk, stripe_customer_id, stripe_sub_id, status enum,
              current_period_end, created_at)
invoices     (id uuid pk, user_id fk, client_email, amount_cents, currency, status enum,
              stripe_session_id, created_at)
payments     (id uuid pk, invoice_id fk, provider_ref, amount_cents, created_at)
```

Rules: `user_id` FK on every owned table · `created_at` default now() · indexes on `user_id`, `status`, `email`.

**Env vars (paste into `.env.example`):**

| Var | Example | Where it comes from |
|---|---|---|
| `DATABASE_URL` | `postgres://…` | Neon / Supabase |
| `AUTH_SECRET` | `openssl rand -base64 32` | Auth.js |
| `AUTH_GOOGLE_ID` · `AUTH_GOOGLE_SECRET` | … | Google Cloud OAuth |
| `STRIPE_SECRET_KEY` · `STRIPE_WEBHOOK_SECRET` | `sk_test_…` · `whsec_…` | Stripe dashboard (test mode) |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` | you |
| `NEXT_PUBLIC_POSTHOG_KEY` | `phc_…` | PostHog (only if analytics) |

## 6. Build order (the distraction-free sequence — do NOT skip ahead)

1. Scaffold `create-next-app` (TS, Tailwind, App Router) → `npm run dev` works → commit.
2. **Design tokens from the source of truth** (Figma variables via MCP / Stitch `DESIGN.md` / pack) + fonts + theme provider + base layout → landing renders per design → commit.
3. Drizzle schema + migrations + db client → `db:check` passes → commit.
4. Auth (lib/auth + middleware + login/signup pages + session) → protected route redirects → commit.
5. Feature 1 (highest PRD value) → Feature 2 … each: run → verify → **design parity check** → commit.
6. Payments (if monetized): Checkout → webhook → status UI → test with `stripe listen`.
7. AI features (if any, per `ai-logic.md` §9): streaming route → prompts+zod+evals → UX (stop/timeout/errors) → cost rails → observability.
8. Analytics + SEO meta + error states + empty states + polish (micro-interactions).
9. Tests for auth/billing/AI evals → CI → production audit → deploy.

**Definition of done per step:** the app runs (`npm run dev`), the step's flow works end-to-end (and matches the design for UI steps), committed. Never 2 steps before running.

## 7. Handoff prompts — paste the pack into ANY builder

### A. CLI agent (Claude Code / Cursor / Codex / …)

```
Build the app described in PRD.md, stack-blueprint.md and sitemap.md in this
folder. The sitemap is the map: every route/page/endpoint in it must exist,
nothing else. Follow the build order exactly; keep the app runnable after
every step; commit after each working feature; cover auth + billing with
tests. Don't redesign — apply the locked design system and architecture as-is.
```

### B. Lovable / Bolt / v0 (web builders — paste everything)

```
Build a production-ready web app: {one-liner}.

STACK: Next.js 15 + TypeScript + Tailwind CSS v4 + shadcn/ui + Drizzle ORM +
Postgres + Auth.js + Stripe + Vercel.

PAGES: {page map from §3 — one line each}.
DESIGN: neutral shadcn tokens, accent {hue}, Geist fonts, {component list}.
DATA MODEL: {paste SQL tables from §5}.
AUTH: email+password and Google sign-in; protect /dashboard.
PAYMENTS: {Stripe checkout + webhook → subscription status}.
ENV VARS (create .env.example): {the table from §5 — every var with an example value}.
FEATURES (MVP, in order): {bullet list from PRD must-haves}.
QUALITY: mobile responsive, empty/loading/error states, accessibility, SEO meta.
First build the landing page, then auth, then {feature 1}, then {feature 2},
then payments. Run/verify after every step. No gold-plating.
```

### C. Any tool, re-prompt after edits

```
Keep this project's design system and architecture unchanged. Implement the
next item from PRD.md's must-haves exactly as scoped; run it; verify; commit.
```

## 8. Definition of done (before this pack is "ready")

- [ ] Every field in §1–§6 filled; stack locked; no open decisions left
- [ ] **Design source of truth chosen (Figma link / Stitch DESIGN.md / pack) — not "TBD"**; tokens mapped per `frontend-design.md`
- [ ] Data model SQL paste-ready; build order numbered and complete
- [ ] **AI section present iff the PRD has AI features** (else removed) — rails locked per `ai-logic.md`
- [ ] Handoff prompts filled in with the real app details
- [ ] PRD.md must-haves match the build order 1:1
- [ ] `validation.md` verdict recorded (BUILD only — or user's explicit override after seeing the risks)
- [ ] Nothing in the pack references a tool-specific feature (works in CLI + web builders)
