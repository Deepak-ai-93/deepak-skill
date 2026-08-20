# Creator Portfolio — your cross-project taste for vibe-coded apps

> **Copy this file to `creator-portfolio.md` (project root) at Stage 0** of the
> vibe-code-webapp skill, read it BEFORE the idea interview, and **write it back
> at Stage 7** (deliver) — so every app you build starts from what you already
> decided, in your voice, with your taste. One file per creator, travels with
> the project, never global.
>
> Like `ebook-builder`'s author memory: memory is cheap, rediscovery is
> expensive. If a decision is here, it is NOT re-asked.

## Identity

| Field | Value |
|---|---|
| **Creator / team** | {your name / studio name} |
| **What you build** | {e.g. SaaS tools for freelancers, internal ops apps} |
| **One-line taste** | {e.g. "Boring tech, beautiful UI, zero-fluff copy"} |
| **Preferred stack family** | {e.g. Next.js + Postgres + Tailwind — I'm fastest there} |
| **Time budget per app** | {e.g. "MVP in ≤ 2 weekends; production in ≤ 4 weeks"} |

## Stack taste (locked defaults — the skill starts here, not from zero)

| Layer | Default I like | Why / notes |
|---|---|---|
| Framework | {Next.js 15 App Router} | {SSR + server actions, deploy story} |
| UI | {Tailwind v4 + shadcn/ui} | {consistent, fast, accessible} |
| Fonts | {Geist / Inter / …} | |
| Data | {Postgres + Drizzle} | |
| Auth | {Auth.js v5} | |
| Payments | {Stripe} | |
| Hosting | {Vercel / Railway / Fly} | |
| Analytics | {PostHog / Plausible} | |
| AI (when used) | {Vercel AI SDK} | |

## Design taste (tokens I keep coming back to)

- **Palette:** {e.g. neutral grays + one accent — I rotate accents per product, never more than one}
- **Type:** {e.g. Geist Sans for UI, tight tracking on headings}
- **Mood:** {e.g. calm, editorial, generous whitespace; avoid dark-on-dark gimmicks}
- **Pet rules:** {e.g. no gradients on buttons · one CTA per screen · empty states always written}
- **Avoid (banned):** {e.g. purple-or-teal SaaS clichés, generic hero stock images, "Empower your" copy}

## Monetization patterns I accept

- {e.g. usage-based plans over seat-based; free tier ≤ 3 items; annual = 2 months free}
- {e.g. I don't do ads; I do paid tiers + affiliate}

## Past builds (append at Stage 7 — every build teaches the next)

| Date | App | Verdict (score/35) | Stack used | Outcome / lesson |
|---|---|---|---|---|
| {2026-08} | {InvoiceFlow} | {BUILD 30/35} | {Next.js + Drizzle + Stripe} | {…} |

## Pet decisions (decided once — never re-litigate)

- {e.g. Auth is always email + Google, never magic links in MVP}
- {e.g. Every owned table gets `user_id` FK + `created_at`}
- {e.g. Deploy is always scripted (`deploy-setup.mjs`) — no "deploy later"}

## Protocol

1. **Stage 0:** the agent reads this file first, greets you with your defaults, and only asks what's NEW about this idea — never re-asks decided things.
2. **Stage 3:** the build pack is written WITH these defaults (stack lock, palette, auth) unless you override for this app.
3. **Stage 7:** the agent appends the **Past builds** row + any new **pet decisions**, and saves — so the next app is faster and more "you".
4. Missing file → initialize from this template. Keep it short; it only grows when a decision is actually made.