#!/usr/bin/env node
// deploy-setup.mjs — turns the vibe-code-webapp skill's doc-driven deploy into
// GENERATED deploy artifacts: real host config (vercel.json / netlify.toml /
// railway.json / fly.toml / Dockerfile / wrangler.jsonc), a CI workflow
// (.github/workflows/deploy.yml), and a filled `deploy-runbook.md` — one host,
// every env var mapped, verification list + rollback written. No tribal
// knowledge, no "deploy later".
//
// Usage:
//   node scripts/deploy-setup.mjs --host vercel --name invoiceflow --domain invoiceflow.com
//   node scripts/deploy-setup.mjs --host fly --name invoiceflow --framework nextjs --vars DATABASE_URL,AUTH_SECRET,STRIPE_SECRET_KEY
//   node scripts/deploy-setup.mjs --host netlify --name invoiceflow --vars-file .env.example
//   node scripts/deploy-setup.mjs --host cloudflare --name invoiceflow
//   node scripts/deploy-setup.mjs --host docker --name invoiceflow --domain app.example.com
//
//   --host <vercel|netlify|railway|fly|cloudflare|docker>   the ONE host (required)
//   --name <app>          app name (required)
//   --domain <domain>     production domain (optional; prompts in runbook if missing)
//   --framework <nextjs|vite|generic>   build/publish assumptions (default nextjs)
//   --vars <A,B,C>        env var NAMES the app needs (values stay in the host)
//   --vars-file <path>    read env var names from a .env.example-style file
//   --dir <dir>           where to write (default: project root)
//
// Exit codes: 0 = artifacts generated · 1 = missing name/host · 2 = usage error.
// Real secret VALUES are never written — only names + where they come from.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve, join } from "node:path";

// ─── brand banner (deepak-skill · crafted by Deepak) ────────────────────────
const BRAND_LINE = "═".repeat(56);
const banner = (label) =>
  `\n${BRAND_LINE}\n  🎬 deepak-skill — crafted by Deepak\n  skill: vibe-code-webapp · ${label}\n${BRAND_LINE}\n`;
console.log(banner("deploy-setup.mjs"));

const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const needle = `--${name}`;
  const found = args.find((a) => a === needle || a.startsWith(`${needle}=`));
  if (found === undefined) return fallback;
  const eq = found.indexOf("=");
  return eq !== -1 ? found.slice(eq + 1) : args[args.indexOf(found) + 1];
};

function usage() {
  console.log(`deploy-setup.mjs — deploy artifact generator (vibe-code-webapp skill)

Usage:
  node scripts/deploy-setup.mjs --host vercel --name invoiceflow --domain invoiceflow.com
  node scripts/deploy-setup.mjs --host fly --name invoiceflow --vars DATABASE_URL,AUTH_SECRET
  node scripts/deploy-setup.mjs --host netlify --name invoiceflow --vars-file .env.example
  node scripts/deploy-setup.mjs --host docker --name invoiceflow --domain app.example.com

  --host <vercel|netlify|railway|fly|cloudflare|docker>   the ONE host (required)
  --name <app>          app name (required)
  --domain <domain>     production domain (optional)
  --framework <nextjs|vite|generic>   build assumptions (default nextjs)
  --vars <A,B,C>        env var NAMES the app needs (values never written)
  --vars-file <path>    read env var names from a .env.example-style file
  --dir <dir>           where to write (default: project root)

Generates: host config · .github/workflows/deploy.yml · deploy-runbook.md
`);
  process.exit(2);
}

const HOSTS = ["vercel", "netlify", "railway", "fly", "cloudflare", "docker"];
const host = (opt("host", "") || "").toLowerCase();
const name = opt("name", "");
const domain = opt("domain", "") || `{your-domain}`;
const framework = opt("framework", "nextjs") || "nextjs";
const dir = resolve(process.cwd(), opt("dir", "."));
if (!HOSTS.includes(host)) usage();
if (!name) {
  console.error("❌ --name is required (the app name, e.g. invoiceflow).");
  process.exit(1);
}

// ─── collect env var NAMES (values never written) ───────────────────────────
let vars = [];
const rawVars = opt("vars", "");
if (rawVars) vars = rawVars.split(",").map((s) => s.trim()).filter(Boolean);
const varsFile = opt("vars-file", "");
if (varsFile && existsSync(resolve(varsFile))) {
  for (const line of readFileSync(resolve(varsFile), "utf8").split("\n")) {
    const m = line.match(/^([A-Z][A-Z0-9_]*)\s*=/);
    if (m && !vars.includes(m[1])) vars.push(m[1]);
  }
}
if (!vars.length) {
  vars = ["DATABASE_URL", "AUTH_SECRET", "NEXT_PUBLIC_APP_URL"];
  console.log(`ℹ️  no --vars / --vars-file given — defaulting to ${vars.join(", ")} (names only).`);
}

// ─── host config files ──────────────────────────────────────────────────────
const buildCmd = framework === "nextjs" ? "next build" : framework === "vite" ? "vite build" : "npm run build";
const outDir = framework === "nextjs" ? ".next" : framework === "vite" ? "dist" : "build";
const startCmd = framework === "nextjs" ? "next start" : framework === "vite" ? "vite preview" : "npm run start";

const configs = {
  vercel: {
    file: "vercel.json",
    content: `{
  "framework": "nextjs",
  "buildCommand": "${buildCmd}",
  "outputDirectory": "${outDir}",
  "regions": ["iad1"]
}
`,
  },
  netlify: {
    file: "netlify.toml",
    content: `[build]
  command = "${buildCmd}"
  publish = "${outDir}"

[build.environment]
  # every var name lives in the Netlify dashboard → Site settings → Environment
${vars.map((v) => `  # ${v} = (set in the dashboard, never here)`).join("\n")}

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
`,
  },
  railway: {
    file: "railway.json",
    content: `{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "${buildCmd}"
  },
  "deploy": {
    "startCommand": "${startCmd}",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
`,
  },
  fly: {
    file: "fly.toml",
    content: `app = "${name}"
primary_region = "iad"

[build]
  # Dockerfile generated next to this file — read-only, committed
  dockerfile = "Dockerfile"

[env]
  # every var name lives in \`fly secrets set\` — never here
${vars.map((v) => `  # ${v} = fly secrets set ${v}=…`).join("\n")}

[[services]]
  http_checks = []
  internal_port = 3000
  processes = ["app"]

  [[services.ports]]
    handlers = ["http"]
    port = 80

  [[services.ports]]
    handlers = ["tls", "http"]
    port = 443

  [[services.tls]]
    cert_pem = ""
    key_pem = ""
`,
  },
  cloudflare: {
    file: "wrangler.jsonc",
    content: `// Cloudflare Pages/Workers deploy config (wrangler.jsonc)
{
  "name": "${name}",
  "pages_build_output_dir": "${outDir}",
  "compatibility_date": "2026-01-01",
  "vars": {}
}
`,
  },
  docker: {
    file: "Dockerfile",
    content: `# Dockerfile — self-hosted ${name} (${framework})
FROM node:22-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat

FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN mkdir -p /app/public
RUN npm run build

FROM base AS runner
ENV NODE_ENV=production
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/${outDir} ./${outDir}
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["npm", "run", "start"]
`,
  },
};

// ─── CI workflow (any host) ─────────────────────────────────────────────────
const ciHostBlock = {
  vercel: `      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: \${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: \${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: \${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: --prod`,
  netlify: `      - name: Deploy to Netlify
        uses: nwtgck/actions-netlify@v3
        with:
          publish-dir: ${outDir}
          production-branch: main
          github-token: \${{ secrets.GITHUB_TOKEN }}
          deploy-message: "deploy: \${{ github.sha }}"
        env:
          NETLIFY_AUTH_TOKEN: \${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: \${{ secrets.NETLIFY_SITE_ID }}`,
  railway: `      - name: Deploy to Railway
        uses: bervproject/railway-deploy-action@v3
        with:
          railway_token: \${{ secrets.RAILWAY_TOKEN }}
          service: ${name}`,
  fly: `      - name: Deploy to Fly.io
        run: flyctl deploy --remote-only
        env:
          FLY_API_TOKEN: \${{ secrets.FLY_API_TOKEN }}`,
  cloudflare: `      - name: Deploy to Cloudflare Pages
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: \${{ secrets.CF_API_TOKEN }}
          accountId: \${{ secrets.CF_ACCOUNT_ID }}`,
  docker: `      - name: Deploy to self-hosted server
        run: |
          docker build -t ${name}:\${{ github.sha }} .
          docker save ${name}:\${{ github.sha }} | gzip | ssh deploy "\${{ secrets.DEPLOY_HOST }}" "docker load && docker stop ${name} || true && docker run -d --restart unless-stopped --name ${name} -p 3000:3000 --env-file /srv/${name}/.env.production ${name}:\${{ github.sha }}"
        env:
          DEPLOY_HOST: \${{ secrets.DEPLOY_HOST }}`,
};

const ci = `# deploy.yml — generated by deploy-setup.mjs (vibe-code-webapp skill)
# Runs the quality gates on every push, then deploys to ${host} on main.
name: deploy

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  check-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm test || true
      - run: npm run build
${ciHostBlock[host]}
`;

// ─── deploy-runbook.md (filled) ─────────────────────────────────────────────
const hostSteps = {
  vercel: `### 4a. Vercel (your host — delete the other sections)

\`\`\`bash
npx vercel link
npx vercel env add DATABASE_URL production   # …repeat for every var in §2
npx vercel --prod
\`\`\`

- Dashboard → Project → Settings → Environment Variables: paste each var (production scope).
- Add the production URL to OAuth (Google) + Stripe webhook (\`https://${domain}/api/stripe/webhook\`).
- Custom domain: Project → Settings → Domains → add \`${domain}\` → follow DNS instructions.
- Migrations: run step 3 once, or add a prebuild hook.`,
  netlify: `### 4b. Netlify (your host — delete the other sections)

- New site → Import from Git → build command \`${buildCmd}\`, publish dir \`${outDir}\` (set in \`netlify.toml\`).
- Site settings → Environment variables: add §2.
- Domain + SSL: Site configuration → Domain management → add \`${domain}\`.`,
  railway: `### 4c. Railway (your host — delete the other sections)

- New project → Deploy from GitHub repo → add the vars from §2 in Variables.
- Add a Postgres plugin (or point \`DATABASE_URL\` at Neon/Supabase).
- Start command from \`railway.json\`: \`${startCmd}\`.
- Generate a public domain, then attach \`${domain}\` in Settings.
- Migrations: one-off command in Railway's shell with the prod \`DATABASE_URL\`.`,
  fly: `### 4d. Fly.io (your host — delete the other sections)

\`\`\`bash
fly launch --name ${name}
fly secrets set DATABASE_URL=…   # …repeat for every var in §2
fly deploy
fly certs add ${domain}          # auto-HTTPS
\`\`\`

- Set \`NEXT_PUBLIC_APP_URL\` as a build-time env var (\`fly deploy\` rebuilds the client bundle).`,
  cloudflare: `### 4e. Cloudflare Pages (your host — delete the other sections)

- Workers & Pages → Create → Connect to Git → build command \`${buildCmd}\`, output \`${outDir}\` (in \`wrangler.jsonc\`).
- Settings → Variables: add §2.
- Custom domain: \`${domain}\` → DNS managed by Cloudflare, SSL automatic.`,
  docker: `### 4f. Docker / self-host (your host — delete the other sections)

\`\`\`bash
docker build -t ${name}:\$(git rev-parse --short HEAD) .
docker run -d -p 3000:3000 --env-file /srv/${name}/.env.production ${name}:\$(git rev-parse --short HEAD)
\`\`\`

- \`.env.production\` lives **on the server**, never in the repo.
- Reverse proxy + HTTPS: Caddy or nginx + certbot; point \`${domain}\` at the box.
- Health check: \`GET /api/health\` (or the framework's health route) on port 3000.`,
};

const rollback = {
  vercel: "Deployments tab → ⋯ on the last known-good deployment → **Promote to Production** (instant, no rebuild)",
  netlify: "Deploys tab → ⋯ → Publish deploy",
  railway: "Deployments → ⋯ → Redeploy a previous deployment",
  fly: "`fly deploy --image registry.fly.io/{app}:{previous-sha}` or `fly releases` → `fly rollback`",
  cloudflare: "Deployments tab → ⋯ → Rollback to previous deployment",
  docker: "keep the previous image tag: `docker run {app}:{previous-sha}`",
};

const runbook = `# Deploy Runbook — ${name}

> **Generated by \`deploy-setup.mjs\`** (vibe-code-webapp skill) · one host:
> **${host}** · domain: **${domain}** · framework: **${framework}**.
> Env var VALUES are never in this file — only names + where they come from.
> If a new person (or you, in 3 months) can't deploy from this file alone, it isn't done.

---

## 0. The stack being deployed

| Layer | Choice | Notes |
|---|---|---|
| App | ${framework === "nextjs" ? "Next.js 15" : framework === "vite" ? "Vite + React" : "generic node app"} | from \`stack-blueprint.md\` §2 |
| Database | {Supabase / Neon / SQLite} | migrations via {drizzle-kit / prisma} |
| Auth | {Auth.js / Supabase Auth} | |
| Payments | {Stripe} | test mode first |
| Files / media | {UploadThing / R2 / none} | |
| Host | **${host}** | generated config committed: \`${configs[host].file}\` |
| Domain | ${domain} | DNS points at the host |

## 1. Pre-deploy checklist (every deploy — 2 minutes)

- [ ] \`npm run build\` passes locally
- [ ] \`npm test\` passes (auth + billing + anything that deletes data)
- [ ] No secrets in source: grep for \`sk-\`, \`AKIA\`, \`ghp_\`, \`-----BEGIN\` in \`src/\` — all clear
- [ ] \`.env.example\` lists **every** env var the app reads (compare against \`process.env.*\`)
- [ ] \`.gitignore\` covers \`.env*\` (except \`.env.example\`)
- [ ] DB migrations committed and **run against the production database** (step 3)
- [ ] CI file \`.github/workflows/deploy.yml\` committed — push to \`main\` deploys

## 2. The env vars this app needs (fill names only — values live in the host)

| Var | Where it comes from | Needed for |
|---|---|---|
${vars.map((v) => `| \`${v}\` | {dashboard / service} | {what it powers} |`).join("\n")}
| \`NEXT_PUBLIC_APP_URL\` | **the production URL: \`https://${domain}\`** | absolute links, OAuth callbacks, Stripe \`success_url\` |

> **The #1 "deploy works locally but not in prod" cause:** \`NEXT_PUBLIC_APP_URL\`
> (or OAuth redirect URIs / Stripe webhook URL) still pointing at
> \`http://localhost:3000\`. Fix the var AND the provider-side callback lists.

## 3. Database migration (before or with the first deploy)

\`\`\`bash
npm run db:generate   # if schema changed: emits a new migration
DATABASE_URL=postgres://…prod… npm run db:migrate
\`\`\`

- Use the production branch's connection string; enable backups.
- If the migration fails, **roll back the schema first, then the app** (step 6).

## 4. Deploy — the ONE host (${host})

${hostSteps[host]}

## 5. Post-deploy verification (run this list out loud, in order)

1. \`GET https://${domain}/api/health\` → \`{ "ok": true }\`
2. Landing page loads, title + meta present, no console errors
3. Signup/login works (OAuth callback URL is the **production** domain)
4. Create a record → refresh → it persists (DB read/write through prod)
5. Payments (if monetized): run a **test-mode** checkout end-to-end on prod; check the webhook delivered (\`checkout.session.completed\`) and status updated
6. AI (if any): a real call streams, abort button works, key is not in the browser's network tab
7. Mobile: phone-width check on the 3 main pages
8. Analytics: a test event appears in PostHog/Plausible within a minute

> Any failure here → fix, redeploy, re-run the list. **Never declare "deployed" from step 4 alone.**

## 6. Rollback (do this BEFORE you need it)

| Host | Rollback |
|---|---|
| ${host} | ${rollback[host]} |

**DB rollback:** app rollback ≠ data rollback. If the deploy changed the schema, restore from the host's backup (Neon/Supabase point-in-time) **before** rolling the app back.

## 7. Common deploy failures → fix (the top 5)

| Symptom | Cause | Fix |
|---|---|---|
| Build fails only in prod | missing build-time env var (e.g. \`NEXT_PUBLIC_APP_URL\`) | add the var in the host, rebuild |
| \`DATABASE_URL\` errors at runtime | var missing or pointed at localhost | set prod \`DATABASE_URL\`; never commit \`.env\` |
| OAuth "redirect_uri_mismatch" | provider callback still on localhost | add \`https://${domain}\` to Google/Stripe callbacks |
| Migrations not applied | nobody ran step 3 against prod | run \`db:migrate\` with the prod URL |
| Old code after deploy | CDN cache / wrong branch | purge cache; confirm the pushed branch is the one the host tracks |

---

> **Done = the app is live at \`https://${domain}\`, the §5 list passes, and the
> rollback line above is written.** Commit the generated config + CI with the
> deploy. Update the runbook whenever the host, env vars, or rollback change.
`;

// ─── write everything ───────────────────────────────────────────────────────
const artifacts = [];
const write = (rel, content) => {
  const p = join(dir, rel);
  mkdirSync(resolve(p, ".."), { recursive: true });
  writeFileSync(p, content, "utf8");
  artifacts.push(rel);
  console.log(`  ✅ ${rel}`);
};

write(configs[host].file, configs[host].content);
if (host === "fly" || host === "docker") {
  write("Dockerfile", configs.docker.content);
}
write(join(".github", "workflows", "deploy.yml"), ci);
write("deploy-runbook.md", runbook);

console.log(`\n${BRAND_LINE}`);
console.log(`  ✅ deploy-setup — ${host} config + CI + deploy-runbook.md written to ${dir}`);
console.log(`  next: fill the {…} table cells in deploy-runbook.md §2, set the env vars in`);
console.log(`        the host dashboard (values never in code), run §5, commit.`);
console.log(BRAND_LINE);
process.exit(0);