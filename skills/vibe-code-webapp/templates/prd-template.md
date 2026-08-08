# PRD — {App Name}

> Copy this template to `PRD.md` (project root) and fill every field.
> This file is the **approval contract**: nothing is coded until the user approves it.

## 1. Identity

| Field | Value |
|---|---|
| **App name** | {e.g. InvoiceFlow} |
| **One-liner** | {e.g. Invoices freelancers actually get paid on} |
| **Audience** | {e.g. freelance designers & devs, 20–35} |
| **Platform** | {web app / mobile-web PWA / internal tool} |
| **Monetized?** | {yes — $X/mo · no} |
| **Stack** | {Next.js + Vercel + Supabase + Stripe} |

## 2. Problem & validation

- **Problem:** {the repeated, concrete pain — from idea-brief.md signals}
- **Proof it's real:** {Reddit posts / forum threads / competitor reviews — with sources}
- **Today's workaround:** {spreadsheets, agencies, nothing}
- **Jobs-to-be-done:** {e.g. "When I invoice a client, I want payment in 48h so I don't chase emails"}

## 3. Users & personas

| Persona | Who | Top pain | What success looks like |
|---|---|---|---|
| {e.g. The Solo Operator} | {freelancer, 2–5 clients} | {chasing payments} | {gets paid without a reminder} |

## 4. MVP scope

Must have (the approval contract):
- [ ] {e.g. signup/login with email}
- [ ] {e.g. create + send an invoice}
- [ ] {e.g. Stripe checkout on the invoice link}
- [ ] {e.g. payment status dashboard}

Should have (if time):
- [ ] {e.g. PDF export}
- [ ] {e.g. reminder emails}

Won't do (non-goals):
- {e.g. mobile apps, multi-currency, accounting integrations}

## 5. User flows

1. {e.g. Signup → create workspace → create client → create invoice → send → get paid → see status}
2. {e.g. Client opens link → sees invoice → pays with card → both get confirmation}

## 6. Data model

| Entity | Key fields | Relations |
|---|---|---|
| User | id, email, password_hash, plan | 1—N Workspaces |
| Invoice | id, user_id, client_email, amount_cents, currency, status | N—1 User, 1—N Payments |
| Payment | id, invoice_id, provider_ref, amount_cents, created_at | N—1 Invoice |

## 7. Auth & permissions

- {email+password via Supabase Auth / NextAuth; owner-only access to own data}
- {role: owner (default) — no admin surface in MVP}

## 8. Payments (only if monetized)

- {Stripe: one-time checkout on invoice link, webhook → status update, test mode first}
- {Pricing: $0 free tier (3 invoices) → $12/mo unlimited — pending validation}

## 9. Analytics & KPIs

- **KPI:** {activated users (sent first invoice), paid invoices, conversion}
- **Tools:** {PostHog / Plausible + Stripe dashboard}
- **Guardrail:** {if < X activated users after 4 weeks, iterate or kill}

## 10. Risks & open questions

- {e.g. Stripe payout delays · chargebacks}
- {open question: should invoices expire?}

## 11. Decisions (what changed from the raw request)

- {User said "…" → interpreted as …}
- {Defaulted stack to … because …}

---

> **Status: awaiting user approval** — reply **approve** to build, **edit** to revise, or **reject** to stop.
