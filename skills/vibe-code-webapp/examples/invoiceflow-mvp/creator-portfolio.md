# Creator Portfolio — worked example (InvoiceFlow)

> A filled example of `templates/creator-portfolio.md` — the cross-project
> memory the skill reads at Stage 0 and writes back at Stage 7. In a real
> build, this file lives in the project root and travels with the project.

## Identity

| Field | Value |
|---|---|
| **Creator / team** | Deepak |
| **What you build** | SaaS tools for freelancers, internal ops apps |
| **One-line taste** | "Boring tech, beautiful UI, zero-fluff copy" |
| **Preferred stack family** | Next.js + Postgres + Tailwind — fastest there |
| **Time budget per app** | MVP in ≤ 2 weekends; production in ≤ 4 weeks |

## Stack taste (locked defaults — the skill starts here, not from zero)

| Layer | Default I like | Why / notes |
|---|---|---|
| Framework | Next.js 15 App Router | SSR + server actions, deploy story |
| UI | Tailwind v4 + shadcn/ui | consistent, fast, accessible |
| Fonts | Geist Sans + Geist Mono | ships with Next.js |
| Data | Postgres + Drizzle (Neon) | typed schema, easy migrations |
| Auth | Auth.js v5 | credentials + Google |
| Payments | Stripe Checkout + webhooks | test mode first, always |
| Hosting | Vercel | zero-config deploys |
| Analytics | PostHog | product analytics + funnels |
| AI (when used) | Vercel AI SDK | streaming + prompts-as-code |

## Design taste (tokens I keep coming back to)

- **Palette:** neutral grays + one accent — I rotate accents per product, never more than one
- **Type:** Geist Sans for UI, tight tracking on headings
- **Mood:** calm, editorial, generous whitespace; avoid dark-on-dark gimmicks
- **Pet rules:** no gradients on buttons · one CTA per screen · empty states always written
- **Avoid (banned):** purple-or-teal SaaS clichés, generic hero stock images, "Empower your" copy

## Monetization patterns I accept

- Usage-based plans over seat-based; free tier ≤ 3 items; annual = 2 months free
- No ads; paid tiers + affiliate

## Past builds (append at Stage 7 — every build teaches the next)

| Date | App | Verdict (score/35) | Stack used | Outcome / lesson |
|---|---|---|---|---|
| 2026-08 | InvoiceFlow | BUILD 30/35 | Next.js + Drizzle + Stripe | First build with pack-builder.mjs — pack from ONE JSON |

## Pet decisions (decided once — never re-litigate)

- Auth is always email + Google, never magic links in MVP
- Every owned table gets `user_id` FK + `created_at`
- Deploy is always scripted (`deploy-setup.mjs`) — no "deploy later"
- Build packs come from `pack-builder.mjs` — one JSON, four validated files

## Protocol

1. **Stage 0:** the agent reads this file first, greets you with your defaults, and only asks what's NEW about this idea — never re-asks decided things.
2. **Stage 3:** the build pack is written WITH these defaults (stack lock, palette, auth) unless you override for this app.
3. **Stage 7:** the agent appends the **Past builds** row + any new **pet decisions**, and saves — so the next app is faster and more "you".
4. Missing file → initialize from this template. Keep it short; it only grows when a decision is actually made.