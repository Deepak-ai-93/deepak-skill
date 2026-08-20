# Stack Blueprint — InvoiceFlow

> Assembled by `pack-builder.mjs` from `pack-plan.json` · 2026-08-20. This file + `PRD.md` + `sitemap.md` are **the build pack**: everything the builder needs, nothing it doesn't. Tool-agnostic — works in any CLI (Claude Code, Cursor, Codex), Lovable, Bolt, v0.

## 1. Identity & verdict

| Field                      | Value                                                                            |
| -------------------------- | -------------------------------------------------------------------------------- |
| **App name / one-liner**   | InvoiceFlow — Invoices freelancers actually get paid on                          |
| **Idea given by user**     | I want to build something like Invoice Ninja but way simpler for freelancers.    |
| **Stack preference given** | Next.js + Supabase                                                               |
| **Evaluation verdict**     | 30/35 → BUILD (computed by `saas-score.mjs`)                                     |
| **Kill guardrail**         | If fewer than 10 paying users by day 45 → iterate (usage-based pricing) or kill. |
| **Audience**               | freelance designers & devs, 20-35                                                |
| **Monetized?**             | yes — Free tier (3 invoices/mo) → $12/mo unlimited                               |
| **Mode**                   | new project                                                                      |

## 2. Stack lock (NO more decisions after this)

| Layer     | Locked choice                            | Version/notes                                                         |
| --------- | ---------------------------------------- | --------------------------------------------------------------------- |
| Framework | Next.js 15 App Router + TypeScript       | npm create next-app@latest -- --typescript --tailwind --app --src-dir |
| UI        | Tailwind v4 + shadcn/ui + Radix + Lucide |                                                                       |
| Fonts     | Geist Sans + Geist Mono                  |                                                                       |
| Data      | Postgres + Drizzle ORM (Neon)            |                                                                       |
| Auth      | Auth.js v5 (credentials + Google)        |                                                                       |
| Payments  | Stripe Checkout + webhooks               |                                                                       |
| Hosting   | Vercel                                   | → deploy per deploy-runbook.md (host: Vercel)                         |
| Analytics | PostHog                                  |                                                                       |

> If the user gave a different stack preference, honor it — but lock it here exactly the same way.

## 3. Design — source of truth + design system (applied as-is)

- **Design source of truth (locked, never "TBD"):** **Open-source design pack** (`templates/design-system.md`) — applied as-is.
- **Palette:** neutral shadcn tokens + one accent (`--primary` hue only): `243 75% 59%`
- **Notes:** Neutral shadcn tokens, indigo accent, Geist fonts; editorial calm — one CTA per screen
- **Design parity:** every screen is visually checked against the source of truth (browser-MCP screenshot vs Figma/Stitch) at 375/768/1280 — `frontend-design.md` §3/§5.
- **Pages & components map (summary — full blocks in `sitemap.md` §2):**

| Page/Route          | Components (shadcn)                                            | Notes                                                  |
| ------------------- | -------------------------------------------------------------- | ------------------------------------------------------ |
| /                   | navbar, hero, card, pricing table, accordion, footer           | Hook-first pitch: get paid in 48h, not 6 weeks         |
| /pricing            | pricing table, badge, FAQ accordion                            | Free vs Pro plan, one CTA                              |
| /login              | card, input, label, button, separator                          | Email login                                            |
| /signup             | card, input, label, button                                     | Create account                                         |
| /dashboard          | sidebar, stat cards, data table, badge, dialog, sonner, button | Invoice list + paid/draft/unpaid stats + quick actions |
| /invoices/new       | form, input, textarea, currency input, button, sonner          | Create + optionally send an invoice                    |
| /invoices/:id       | card, badge, button (copy link), timeline                      | View invoice, copy pay link, see payment status        |
| /settings           | form, input, button, sonner                                    | Profile, company name, email                           |
| /p/:token           | card, invoice lines, button (Stripe Checkout redirect)         | Public invoice + pay button — no login                 |
| /api/health         | —                                                              | Liveness probe                                         |
| /api/stripe/webhook | —                                                              | checkout.session.completed → mark paid                 |

## 4. Backend architecture (open-source, applied as-is)

- **Reference:** `templates/backend-architecture.md` — folder structure, auth flow, payments flow, security, ops.
- **Folder structure:** `src/
├── app/                    # routes exactly as sitemap §1.2
│   ├── (marketing)/          # landing, pricing
│   ├── (auth)/login|signup/
│   ├── (app)/dashboard|invoices|settings/   # guarded layout group
│   ├── p/[token]/            # public pay page
│   ├── api/health/route.ts
│   ├── api/stripe/webhook/route.ts
│   └── layout.tsx            # fonts, theme provider, Toaster
├── components/               # ui/ (shadcn) + feature components
├── lib/                      # db.ts (drizzle), auth.ts, stripe.ts, utils.ts
├── db/                       # schema.ts, migrations/
├── actions/                  # createInvoice, sendInvoice, updateProfile
└── middleware.ts             # auth guard + rate limit`
- **Server actions:** `src/actions/{feature}.ts` — zod schema + ownership check + `revalidatePath`.
- **Auth:** `lib/auth.ts` + `middleware.ts` guarding `/dashboard/:path*` and `/api/:path*`.

### 4.1 AI features (locked rails)

- **Reference:** `templates/ai-logic.md` — streaming UX, prompts-as-code, cost rails, evals, security.
- **Invoice summary copilot:** Writes a short client-friendly payment reminder from the invoice — model: cheap (gpt-4o-mini) · streaming: no · cost rail: maxTokens 200/request; 20 requests/user/day · evals: 5 golden reminders; no invoice numbers in output
- **Prompts as code:** `lib/ai/prompts/{feature}.ts` with zod schemas + versioning — no literals in components.
- **Env vars:** AI keys server-only — never `NEXT_PUBLIC_`.

## 5. Data model (paste-ready)

```sql
users        (id uuid pk, email text unique, password_hash text, name text, created_at)
subscriptions(id uuid pk, user_id fk, stripe_customer_id, stripe_sub_id, status enum, current_period_end, created_at)
invoices     (id uuid pk, user_id fk, client_email, client_name, amount_cents, currency, status enum, stripe_session_id, created_at)
payments     (id uuid pk, invoice_id fk, provider_ref, amount_cents, created_at)
```

Rules: `user_id` FK on every owned table · `created_at` default now() · indexes on `user_id`, `status`, `email`.

**Env vars (paste into `.env.example`):**

| Var                     | Example                 | Where it comes from                       |
| ----------------------- | ----------------------- | ----------------------------------------- |
| DATABASE_URL            | postgres://…            | Neon                                      |
| AUTH_SECRET             | openssl rand -base64 32 | Auth.js                                   |
| STRIPE_SECRET_KEY       | sk_test_…               | Stripe (test mode)                        |
| STRIPE_WEBHOOK_SECRET   | whsec_…                 | Stripe dashboard → webhooks               |
| NEXT_PUBLIC_APP_URL     | http://localhost:3000   | you (production: https://invoiceflow.app) |
| NEXT_PUBLIC_POSTHOG_KEY | phc_…                   | PostHog                                   |
| OPENAI_API_KEY          | sk-…                    | OpenAI (AI reminder feature, server-only) |

## 6. Build order (the distraction-free sequence — do NOT skip ahead)

1. **Scaffold create-next-app (TS, Tailwind, App Router)** — done when: npm run dev works → commit
2. **Design tokens + fonts + theme provider + base layout (indigo accent)** — done when: landing renders per design pack → commit
3. **Drizzle schema + migrations + db client** — done when: db:check passes → commit
4. **Auth (lib/auth + middleware + login/signup + session)** — done when: protected route redirects → commit
5. **Dashboard + invoice list with status badges** — done when: list renders, ownership-filtered → commit
6. **Create + send invoice (form, zod, pay token)** — done when: invoice appears as draft; pay link copies → commit
7. **Public pay page /p/:token + Stripe Checkout** — done when: test-mode checkout completes → commit
8. **Webhook → paid status + payment record** — done when: stripe listen marks invoice paid → commit
9. **AI reminder copilot (streaming off, template fallback)** — done when: reminder renders with fallback → commit
10. **Analytics + SEO + error/empty states + polish** — done when: PostHog event fires, meta present → commit
11. **Tests for auth/billing + CI** — done when: npm test green, CI on push → commit
12. **Production audit + deploy (deploy-setup.mjs → Vercel)** — done when: deploy-runbook.md §5 list passes

**Definition of done per step:** the app runs (`npm run dev`), the step's flow works end-to-end (and matches the design for UI steps), committed. Never 2 steps before running.

## 7. Handoff prompts — paste the pack into ANY builder

### A. CLI agent (Claude Code / Cursor / Codex / …)

```
Build the app described in PRD.md, stack-blueprint.md and sitemap.md in this folder. The sitemap is the map: every route/page/endpoint in it must exist, nothing else. Follow the build order exactly; keep the app runnable after every step; commit after each working feature; cover auth + billing with tests. Don't redesign — apply the locked design system and architecture as-is.
```

### B. Lovable / Bolt / v0 (web builders — paste everything)

```
Build a production-ready web app: Invoices freelancers actually get paid on.

STACK: Next.js 15 App Router + TypeScript + Tailwind v4 + shadcn/ui + Radix + Lucide + Postgres + Drizzle ORM (Neon) + Auth.js v5 (credentials + Google) + Stripe Checkout + webhooks + Vercel.

PAGES: / (Hook-first pitch: get paid in 48h, not 6 weeks) · /pricing (Free vs Pro plan, one CTA) · /login (Email login) · /signup (Create account) · /dashboard (Invoice list + paid/draft/unpaid stats + quick actions) · /invoices/new (Create + optionally send an invoice) · /invoices/:id (View invoice, copy pay link, see payment status) · /settings (Profile, company name, email) · /p/:token (Public invoice + pay button — no login) · /api/health (Liveness probe) · /api/stripe/webhook (checkout.session.completed → mark paid).
DESIGN: neutral shadcn tokens, accent 243 75% 59%, Geist Sans + Geist Mono fonts, navbar, hero, card, pricing table, accordion, footer, pricing table, badge, FAQ accordion, card, input, label, button, separator, card, input, label, button, sidebar, stat cards, data table, badge, dialog, sonner, button, form, input, textarea, currency input, button, sonner, card, badge, button (copy link), timeline, form, input, button, sonner, card, invoice lines, button (Stripe Checkout redirect), —, —.
DATA MODEL: users        (id uuid pk, email text unique, password_hash text, name text, created_at) · subscriptions(id uuid pk, user_id fk, stripe_customer_id, stripe_sub_id, status enum, current_period_end, created_at) · invoices     (id uuid pk, user_id fk, client_email, client_name, amount_cents, currency, status enum, stripe_session_id, created_at) · payments     (id uuid pk, invoice_id fk, provider_ref, amount_cents, created_at).
AUTH: email + password via Auth.js v5 (credentials provider); Google OAuth later (P2); protect the app area.
PAYMENTS: Stripe Checkout Session (mode: payment) per invoice; metadata { userId, invoiceId }.
ENV VARS (create .env.example): DATABASE_URL (postgres://…) · AUTH_SECRET (openssl rand -base64 32) · STRIPE_SECRET_KEY (sk_test_…) · STRIPE_WEBHOOK_SECRET (whsec_…) · NEXT_PUBLIC_APP_URL (http://localhost:3000) · NEXT_PUBLIC_POSTHOG_KEY (phc_…) · OPENAI_API_KEY (sk-…).
FEATURES (MVP, in order): Signup/login with email (Auth.js credentials) → Create + send an invoice with a client-pay link → Stripe Checkout on the pay link (one-time payment) → Webhook updates invoice status → paid → Dashboard with invoice list + payment status.
QUALITY: mobile responsive, empty/loading/error states, accessibility, SEO meta. First build the landing page, then auth, then Signup/login with email (Auth.js credentials), Create + send an invoice with a client-pay link, Stripe Checkout on the pay link (one-time payment). Run/verify after every step. No gold-plating.
```

### C. Any tool, re-prompt after edits

```
Keep this project's design system and architecture unchanged. Implement the next item from PRD.md's must-haves exactly as scoped; run it; verify; commit.
```

## 8. Definition of done (before this pack is "ready")

- [ ] Every field in §1–§6 filled; stack locked; no open decisions left
- [ ] **Design source of truth locked** (pack) — not "TBD"; tokens mapped per `frontend-design.md`
- [ ] Data model SQL paste-ready; build order numbered and complete
- [ ] **AI section present** (PRD has AI features) — rails locked per `ai-logic.md`
- [ ] Handoff prompts filled in with the real app details
- [ ] **Deploy plan locked**: ONE host — Vercel — mirrored in `deploy-runbook.md` (generated by `deploy-setup.mjs` at Stage 7)
- [ ] PRD.md must-haves match the build order 1:1
- [ ] `validation.md` verdict recorded — BUILD (30/35)
- [ ] Nothing in the pack references a tool-specific feature (works in CLI + web builders)