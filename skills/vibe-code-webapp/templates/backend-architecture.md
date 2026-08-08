# Backend Architecture Pack — open-source, distraction-free

> Locked architecture defaults so the builder never makes a backend decision.
> Apply as-is; every choice below is the boring, proven option.

## 1. Default stack (SaaS — pick this unless the PRD says otherwise)

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 15 (App Router) + TypeScript** | SSR/SSG, Server Actions, one deploy target |
| Styling/UI | Tailwind v4 + shadcn/ui (see design-system.md) | open-source, copy-paste components |
| Data | **Postgres + Drizzle ORM** (Supabase or Neon) | SQL you can see, type-safe, migrations |
| Auth | **Auth.js (NextAuth v5)** w/ credentials + OAuth, **or Supabase Auth** | battle-tested, session/JWT + RLS option |
| Payments | **Stripe** (Checkout + webhooks) | the standard; test mode first |
| Files | UploadThing or Cloudflare R2 (presigned) | no server-side file juggling |
| Background | Vercel Cron + `fetch`; queue later with Inngest | zero infra in MVP |
| Rate limit / cache | Upstash Redis (`@upstash/ratelimit`) | edge-friendly |
| Analytics | PostHog (open-source, self-hostable) | events + funnels |
| Hosting | **Vercel** + Neon/Supabase + Stripe | fastest to production |

## 2. Folder structure (Next.js App Router)

```
src/
├── app/                    # routes (file-based)
│   ├── (marketing)/        # landing, pricing, docs
│   ├── (auth)/login|signup|forgot-password/
│   ├── (app)/dashboard/    # authenticated app shell (group + layout guard)
│   ├── api/                # route handlers: stripe/webhook, uploads
│   └── layout.tsx          # fonts, theme provider, Toaster
├── components/             # ui/ (shadcn) + feature components
├── lib/                    # db.ts (drizzle), auth.ts, stripe.ts, utils.ts
├── db/                     # schema.ts, migrations/
├── actions/                # server actions per feature (zod-validated)
└── middleware.ts           # auth guard + rate limit
```

## 3. Data layer

- **Drizzle schema** in `db/schema.ts` → `drizzle-kit generate` → `migrate` (SQL you can read).
- Every table: `id uuid pk default gen_random_uuid()`, `created_at timestamptz default now()`, `updated_at` (trigger or app-level), and `user_id` FK where owned.
- **Ownership:** every user-scoped query filters `where(eq(x.userId, session.user.id))` — never trust the client.
- **Supabase option:** enable **RLS** per table (`using auth.uid() = user_id`) + `service_role` only server-side.
- Indexes on lookups: `userId`, `status`, `email`, slug.
- Soft-delete (deleted_at) for billing-critical data; hard-delete only for PII erasure.

## 4. Auth flow (Auth.js)

1. `lib/auth.ts` — `NextAuth({ providers: [Credentials, Google], session: { strategy: "jwt" } })`.
2. `middleware.ts` — `matcher: ["/dashboard/:path*", "/api/:path*"]` → redirect to `/login` when no session.
3. Server: `await auth()` in server components / actions; `getServerSession` style.
4. Client: `useSession()` + `signIn()/signOut()`; loading state while session hydrates.
5. Passwords: bcrypt/argon2 hash only; never log emails/passwords.

## 5. Payments flow (Stripe)

1. `lib/stripe.ts` — `Stripe(process.env.STRIPE_SECRET_KEY)` (server only).
2. **Checkout:** server action creates a Checkout Session (`mode: "subscription" | "payment"`, `customer_email`, `metadata: { userId }`, `success_url`).
3. **Webhook:** `app/api/stripe/webhook/route.ts` — verify `stripe.webhooks.constructEvent` with `STRIPE_WEBHOOK_SECRET`; switch on `checkout.session.completed`, `customer.subscription.updated`, `invoice.payment_failed` → update `subscriptions.status`; return 200 fast.
4. **Entitlements:** read subscription status server-side; gate premium routes/actions; `currentPlan()` helper.
5. Local testing: `stripe listen --forward-to localhost:3000/api/stripe/webhook`.

## 6. API contract

- **Mutations:** Server Actions (zod-validated, `revalidatePath` after) — no hand-rolled fetch for internal flows.
- **Public/external API:** Route Handlers with `NextResponse.json`, auth via session or API key (hashed), `export const runtime = "nodejs"`.
- Every handler: validate input (zod), auth-check, ownership-check, try/catch → `{ error }` JSON, log server-side.

## 7. Security checklist (from production-checklist.md)

- Secrets in `process.env` only; `.env.example` committed; `.env` gitignored.
- zod on every server input (actions + API); sanitize any rendered user HTML.
- Rate limit login/register/API with Upstash; CORS locked to your origin.
- Security headers via `next.config.ts` (CSP, X-Frame-Options, Referrer-Policy).
- Stripe/PostHog keys: publishable key client-side, secret key server-only (`NEXT_PUBLIC_` prefix rule).
- No `Math.random` auth tokens, no `eval`, no `dangerouslySetInnerHTML` without sanitize.

## 8. Ops

- Logging: structured `console` (Vercel) + optional Sentry for errors.
- Health check: `GET /api/health` → 200 `{ ok: true }`.
- Backups: Neon/Supabase built-in (enable), or nightly `pg_dump` for self-hosted.
- CI: GitHub Actions — install, lint, `drizzle-kit check`, test, build on push.
- Uptime: host handles it (Vercel); add UptimeRobot ping of `/api/health` if you want an inbox alert.

## 9. Alternatives (when the PRD picks a different path)

| Case | Stack |
|---|---|
| Simple tool / internal app / MVP < 2 weeks | Vite + React + Express + SQLite (better-sqlite3) + JWT — no ORM ceremony |
| Content-heavy / marketing site | Astro + content collections + API elsewhere |
| Real-time / collaborative | Next.js + Supabase Realtime or PartyKit |
| Heavy admin CRUD | Next.js + TanStack Table + Drizzle Studio |
| Non-Node team | Django + DRF + Postgres, or Rails + Postgres (same checklist applies) |

> The audit (`audit-webapp.mjs`) is stack-agnostic — it checks markers, not frameworks, so any of the above passes when done right.
