# PRD — InvoiceFlow

> Assembled by `pack-builder.mjs` from `pack-plan.json` · 2026-08-20 · **approval contract — nothing is coded until the user approves it.**

## 1. Identity

| Field          | Value                                              |
| -------------- | -------------------------------------------------- |
| **App name**   | InvoiceFlow                                        |
| **One-liner**  | Invoices freelancers actually get paid on          |
| **Audience**   | freelance designers & devs, 20-35                  |
| **Platform**   | web app (responsive)                               |
| **Mode**       | new project                                        |
| **Monetized?** | yes — Free tier (3 invoices/mo) → $12/mo unlimited |
| **Stack**      | Next.js 15 App Router + TypeScript                 |

## 2. Problem & validation

- **Problem:** Freelancers send invoices in Word/PDF and chase payments by email for weeks.

- **Proof it's real:** Reddit r/freelance + r/webdev threads on late payments (2026); competitor reviews complain about setup complexity.

- **Today's workaround:** Google Docs templates + email reminders by hand; accountants' spreadsheets.

- **Jobs-to-be-done:** When I invoice a client, I want payment in 48h so I don't chase emails.

## 3. Users & personas

| Persona           | Who                                        | Top pain                                  | What success looks like      |
| ----------------- | ------------------------------------------ | ----------------------------------------- | ---------------------------- |
| The Solo Operator | freelance designer/dev, 2-5 active clients | chasing payments, 3 reminders per invoice | gets paid without a reminder |

## 4. MVP scope

Must have (the approval contract):

- [ ] Signup/login with email (Auth.js credentials)
- [ ] Create + send an invoice with a client-pay link
- [ ] Stripe Checkout on the pay link (one-time payment)
- [ ] Webhook updates invoice status → paid
- [ ] Dashboard with invoice list + payment status

Should have (if time):

- [ ] PDF export
- [ ] Payment-reminder email after 7 days
- [ ] Free tier limit (3 invoices/mo)

Won't do (non-goals):

- Mobile apps
- Multi-currency
- Accounting integrations
- Recurring subscriptions in MVP

## 5. User flows

1. Signup → dashboard (empty state: create first invoice) → new invoice → client pays via link → status paid
2. Client opens pay link → sees invoice → pays with card → both get confirmation

## 6. Data model

```sql
users        (id uuid pk, email text unique, password_hash text, name text, created_at)
subscriptions(id uuid pk, user_id fk, stripe_customer_id, stripe_sub_id, status enum, current_period_end, created_at)
invoices     (id uuid pk, user_id fk, client_email, client_name, amount_cents, currency, status enum, stripe_session_id, created_at)
payments     (id uuid pk, invoice_id fk, provider_ref, amount_cents, created_at)
```

## 7. Auth & permissions

- email + password via Auth.js v5 (credentials provider); Google OAuth later (P2)
- middleware guards /dashboard/:path* and /api/:path* → redirect /login
- ownership: every query filters by eq(userId, session.user.id)

## 8. Payments (monetized)

- Stripe Checkout Session (mode: payment) per invoice; metadata { userId, invoiceId }
- webhook api/stripe/webhook verifies STRIPE_WEBHOOK_SECRET; checkout.session.completed → mark invoice paid + insert payment
- local test via stripe listen --forward-to localhost:3000/api/stripe/webhook

## 9. Analytics & KPIs

- **KPI:** Activated users (sent first invoice) + paid invoices + free→paid conversion

- **Tools:** PostHog + Stripe dashboard

- **Guardrail:** If < 40 activated users after 4 weeks, iterate the onboarding


## 10. Risks & open questions

- Stripe payout delays
- Chargebacks on first paid invoices
- Should invoices expire? (open question)

## 11. Decisions (what changed from the raw request)

- User said 'way simpler' → scoped to one-time invoices; subscriptions explicitly out of MVP
- Defaulted to Vercel + Neon over Supabase for zero-config hosting
- Free tier cap (3/mo) kept to create the upgrade path

## 12. AI features

> Rails locked in `stack-blueprint.md` §4.1 from `templates/ai-logic.md`.

| Feature                 | What the user gets                                               | Model               | Streaming? | Cost rail                                   | Eval cases                                       |
| ----------------------- | ---------------------------------------------------------------- | ------------------- | ---------- | ------------------------------------------- | ------------------------------------------------ |
| Invoice summary copilot | Writes a short client-friendly payment reminder from the invoice | cheap (gpt-4o-mini) | no         | maxTokens 200/request; 20 requests/user/day | 5 golden reminders; no invoice numbers in output |


- **Non-AI fallback:** Template reminder text — always rendered even if the AI call fails

- **Kill guardrail for AI:** If cost/user exceeds $0.15/mo or error rate > 5% → route to template-only mode


## 13. Design source of truth (from `templates/frontend-design.md`)

- **Source picked:** open-source design pack
- **Tokens:** Neutral shadcn tokens, indigo accent, Geist fonts; editorial calm — one CTA per screen
- **Design parity:** screens are visually checked against the source at 375/768/1280 — browser MCP vs Figma/Stitch
- **Validation verdict:** 30/35 → BUILD — guardrail: If fewer than 10 paying users by day 45 → iterate (usage-based pricing) or kill.

---

> **Status: awaiting user approval** — reply **approve** to build, **edit** to revise, or **reject** to stop.