# Production Checklist — {App Name}

> The bar for "it works on my machine" → "anyone can use it".
> `audit-webapp.mjs` automates the marker checks; the auditor subagent signs off the judgment calls.

## A. Code & repo

- [ ] App has an entry point + run script (`npm run dev` / `start`) — documented in README
- [ ] `.gitignore` present (node_modules, `.env`, build dirs) — nothing secret committed
- [ ] `.env.example` committed with every env var documented (real values never committed)
- [ ] README: what it is, setup, env vars, deploy + rollback runbook
- [ ] No hardcoded secrets (API keys, tokens, DB URLs, private keys) anywhere in source
- [ ] Inputs validated (zod/joi/pydantic) — no raw `eval`, no unsanitized HTML
- [ ] Error handling: try/catch or error boundaries on every async path; failures shown to the user
- [ ] CORS + rate limiting in place for public endpoints

## B. Identity & data

- [ ] Auth: signup/login, password hashing (bcrypt/argon2), session handling
- [ ] Users can only read/write their own data (ownership checks on every route)
- [ ] Database: schema committed (migrations/prisma), indexes on lookups
- [ ] Backups enabled on the DB (Supabase/Railway/plan default or documented manual step)
- [ ] Payments (if monetized): test mode wired, webhook verified, refund path exists

## C. Quality gates

- [ ] Tests exist for auth, billing, and anything that deletes data
- [ ] Lint + format configured and passing
- [ ] CI runs tests on push (GitHub Actions is 5 minutes)
- [ ] App actually runs: `npm run dev`, first user flow complete end-to-end, no TODO stubs or mocked data in the shipped flow

## D. Go-live

- [ ] Deploy config added (Vercel / Railway / Fly / Dockerfile)
- [ ] Domain + SSL (auto via host) — no `http://localhost` in prod code
- [ ] Analytics installed (PostHog/Plausible) with the KPI defined in PRD
- [ ] SEO: `<title>`, meta description, OG tags on public pages
- [ ] Error tracking or at least structured logs (Vercel logs / Sentry optional)
- [ ] Legal basics for public SaaS: privacy policy + terms pages

## E. Craft (vibe-coding quality)

- [ ] App is runnable after every feature (never "finish it later")
- [ ] One feature at a time, committed after each working feature
- [ ] No gold-plating — extra ideas parked in `NEXT.md`
- [ ] Mobile responsive at phone width; empty/loading/error states on every view
- [ ] Accessibility basics: labels on inputs, contrast, keyboard navigation

---

> Run `node scripts/audit-webapp.mjs --dir . --name {app} {--payments}` → complete the report → auditor subagent signs off **PASS** → deliver.
