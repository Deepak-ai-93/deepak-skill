# Deploy Runbook — {App Name}

> **Copy this file to `deploy-runbook.md` (project root) in Stage 7 — it is the
> \"how this app actually ships\" document.** The production README links to it;
> `audit-webapp.mjs` checks for it. Fill every `{…}` with the real values from
> `stack-blueprint.md` §5 (env vars) and the host you actually chose. No tribal
> knowledge — if a new person (or you, in 3 months) can't deploy from this file
> alone, it isn't done.
>
> Env vars are **never** in this file's code blocks — only names + where they
> come from. Real values go in the host's dashboard / `.env`.

---

## 0. The stack being deployed

| Layer | Choice | Notes |
|---|---|---|
| App | {Next.js 15 / Vite+Express / …} | from `stack-blueprint.md` §2 |
| Database | {Supabase / Neon / SQLite} | migrations via {drizzle-kit / prisma} |
| Auth | {Auth.js / Supabase Auth} | |
| Payments | {Stripe} | test mode first |
| Files / media | {UploadThing / R2 / none} | |
| Host | {**Vercel** / Railway / Fly.io / Netlify / Docker} | pick ONE — delete the others |
| Domain | {yourdomain.com} | DNS points at the host |

## 1. Pre-deploy checklist (every deploy — 2 minutes)

- [ ] `npm run build` passes locally (or the stack's build command)
- [ ] `npm test` passes (auth + billing + anything that deletes data)
- [ ] No secrets in source: grep for `sk-`, `AKIA`, `ghp_`, `-----BEGIN` in `src/` — all clear
- [ ] `.env.example` lists **every** env var the app reads (compare against `process.env.*` in the code)
- [ ] `.gitignore` covers `.env*` (except `.env.example`)
- [ ] DB migrations committed and **run against the production database** (step 3 below)
- [ ] `deploy-runbook.md` matches the host you're actually using (one host, no leftovers)

## 2. The env vars this app needs (fill names only — values live in the host)

| Var | Where it comes from | Needed for |
|---|---|---|
| `DATABASE_URL` | Neon / Supabase dashboard (production branch) | Drizzle/Postgres |
| `AUTH_SECRET` | `openssl rand -base64 32` | Auth.js sessions |
| `AUTH_GOOGLE_ID` · `AUTH_GOOGLE_SECRET` | Google Cloud Console OAuth | Google sign-in |
| `STRIPE_SECRET_KEY` | Stripe dashboard (test → live) | Checkout |
| `STRIPE_WEBHOOK_SECRET` | Stripe dashboard → webhooks | Webhook signature |
| `NEXT_PUBLIC_APP_URL` | **the production URL, not localhost** | absolute links, OAuth callbacks, Stripe `success_url` |
| `NEXT_PUBLIC_POSTHOG_KEY` | PostHog | analytics (if used) |
| {AI keys: `OPENAI_API_KEY` …} | provider dashboard | AI features (server-only, never `NEXT_PUBLIC_`) |

> **The #1 \"deploy works locally but not in prod\" cause:** `NEXT_PUBLIC_APP_URL`
> (or OAuth redirect URIs / Stripe webhook URL) still pointing at
> `http://localhost:3000`. Fix the var AND the provider-side callback lists.

## 3. Database migration (before or with the first deploy)

```bash
# run from the repo, against the PRODUCTION database URL — then verify
npm run db:generate   # if schema changed: emits a new migration
DATABASE_URL=postgres://…prod… npm run db:migrate
```

- Supabase/Neon: use the production branch's connection string; enable backups.
- Never migrate from a laptop against prod without the runbook open — if the
  migration fails, **roll back the schema first, then the app** (step 6).

## 4. Deploy — pick the ONE host (delete the others)

### 4a. Vercel (default for Next.js — fastest to production)

```bash
# one-time: link the repo, then every push to main deploys
npx vercel link
npx vercel env add DATABASE_URL production   # …repeat for every var in §2
npx vercel --prod                             # first deploy
```

- Dashboard → Project → Settings → Environment Variables: paste each var (production scope).
- Add the production URL to OAuth (Google) + Stripe webhook (`https://{domain}/api/stripe/webhook`).
- Custom domain: Project → Settings → Domains → add `{domain}` → follow DNS instructions.
- Migrations: run step 3 once, or add a `vercel build`-safe `prebuild`/post-deploy hook.

### 4b. Railway

- New project → Deploy from GitHub repo → add the vars from §2 in Variables.
- Add a Postgres plugin (or point `DATABASE_URL` at Neon/Supabase).
- Set the start command from the build (`npm run start` for Next.js standalone).
- Generate a public domain, then attach a custom domain in Settings.
- Run migrations via a one-off command in Railway's shell (`npm run db:migrate` with prod `DATABASE_URL`).

### 4c. Fly.io (containers — anything that needs a Dockerfile)

```bash
fly launch --name {app-name}          # generates fly.toml + Dockerfile
fly secrets set DATABASE_URL=…        # …repeat for every var in §2
fly deploy                            # first deploy
fly postgres create && fly postgres attach   # managed Postgres (or use Neon/Supabase)
```

- Set `NEXT_PUBLIC_APP_URL` as a build-time env var (`fly deploy` rebuilds the client bundle).
- Domain/SSL: `fly certs add {domain}` (auto-HTTPS).

### 4d. Netlify

- New site → Import from Git → build command + publish dir from the stack
  (`npm run build`, `.next` for Next.js; `dist` for Vite).
- Site settings → Environment variables: add §2.
- Redirects: for Vite SPAs add `_redirects` (`/* /index.html 200`); Next.js uses the Netlify plugin.
- Domain + SSL are automatic on the site's custom domain tab.

### 4e. Docker / self-host (own VPS, any app with a Dockerfile)

```bash
docker build -t {app-name}:{git-sha} .
docker run -d -p 3000:3000 --env-file .env.production {app-name}:{git-sha}
```

- `.env.production` lives **on the server**, never in the repo.
- Reverse proxy + HTTPS: Caddy or nginx + certbot; point `{domain}` at the box.
- Restart policy + health check: `--restart unless-stopped` and hit `GET /api/health`.

## 5. Post-deploy verification (run this list out loud, in order)

1. `GET https://{domain}/api/health` → `{ "ok": true }`
2. Landing page loads, title + meta present, no console errors
3. Signup/login works (OAuth callback URL is the **production** domain)
4. Create a record → refresh → it persists (DB read/write through prod)
5. Payments (if monetized): run a **test-mode** checkout end-to-end on prod; check the webhook delivered (`checkout.session.completed`) and status updated
6. AI (if any): a real call streams, abort button works, key is not in the browser's network tab
7. Mobile: phone-width check on the 3 main pages
8. Analytics: a test event appears in PostHog/Plausible within a minute

> Any failure here → fix, redeploy, re-run the list. **Never declare \"deployed\"
> from step 4 alone.**

## 6. Rollback (every host — do this BEFORE you need it)

| Host | Rollback |
|---|---|
| Vercel | Deployments tab → ⋯ on the last known-good deployment → **Promote to Production** (instant, no rebuild) |
| Railway | Deployments → ⋯ → Redeploy a previous deployment |
| Fly.io | `fly deploy --image registry.fly.io/{app}:{previous-sha}` or `fly releases` → `fly rollback` |
| Netlify | Deploys tab → ⋯ → Publish deploy |
| Docker | keep the previous image tag: `docker run {app-name}:{previous-sha}` |

**DB rollback:** app rollback ≠ data rollback. If the deploy changed the schema,
restore from the host's backup (Neon/Supabase point-in-time) **before** rolling
the app back — or the old app code will read a new schema it doesn't understand.

## 7. Common deploy failures → fix (the top 5)

| Symptom | Cause | Fix |
|---|---|---|
| Build fails only in prod | missing build-time env var (e.g. `NEXT_PUBLIC_APP_URL`) | add the var in the host, rebuild |
| `DATABASE_URL` errors at runtime | var missing or pointed at localhost | set prod `DATABASE_URL`; never commit `.env` |
| OAuth \"redirect_uri_mismatch\" | provider callback still on localhost | add `https://{domain}` to Google/Stripe callbacks |
| Migrations not applied | nobody ran step 3 against prod | run `db:migrate` with the prod URL |
| Old code after deploy | CDN cache / wrong branch | purge cache; confirm the git branch you pushed is the one the host tracks |

---

> **Done = the app is live at `https://{domain}`, the §5 list passes, and the
> rollback line for your host is written above.** Commit this file with the
> deploy. Update it whenever the host, env vars, or rollback steps change.
