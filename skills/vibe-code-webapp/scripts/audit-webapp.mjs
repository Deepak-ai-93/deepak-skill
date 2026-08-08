#!/usr/bin/env node
// audit-webapp.mjs — static production-readiness audit for vibe-coded web apps.
// Scans a project folder for the markers a production app needs (app entry,
// env/secret hygiene, auth, database, payments, error handling, validation,
// tests, lint, CI, deploy config, analytics, SEO, docs) and writes an
// audit-report.md for the auditor subagent to complete and sign off.
//
// Usage:
//   node scripts/audit-webapp.mjs --dir . --name my-app [--payments] [--out output/audit]
//
//   --dir <path>      project folder to audit (default: ".")
//   --name <slug>     report label (default: folder name)
//   --payments        also audit for payment/billing integration
//   --out <dir>       where audit-report.md is written (default: output/audit)
//
// Checks are marker-based: PASS = marker found, WARN = worth a human look,
// FAIL = blocker (no app entry, hardcoded secret, zero source files). The
// auditor subagent makes the final call on every WARN.
// Exit code 1 when any FAIL exists.
import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { resolve, join, extname, basename, dirname } from "node:path";

const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const needle = `--${name}`;
  const found = args.find((a) => a === needle || a.startsWith(`${needle}=`));
  if (found === undefined) return fallback;
  const eq = found.indexOf("=");
  return eq !== -1 ? found.slice(eq + 1) : args[args.indexOf(found) + 1];
};

const DIR = resolve(process.cwd(), opt("dir", "."));
const NAME = opt("name", basename(DIR) || "webapp");
const WITH_PAYMENTS = args.includes("--payments");
const OUT_DIR = resolve(process.cwd(), opt("out", "output/audit"));

// --- walk the project -----------------------------------------------------------
const SKIP = new Set([
  "node_modules", ".git", "dist", "build", ".next", "out", "coverage",
  ".venv", "venv", "__pycache__", ".cache", ".agents", ".claude", "output",
  ".expo", ".turbo", ".vite",
]);
const textFiles = []; // { path, rel, content }
const allFiles = [];
const srcExt = new Set([".js", ".jsx", ".ts", ".tsx", ".mjs", ".cjs", ".py", ".rb", ".go", ".php", ".rs", ".java", ".html", ".css", ".scss", ".vue", ".svelte"]);
let srcCount = 0;

function walk(dir, relBase) {
  let entries = [];
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of entries) {
    // Normalize to forward slashes so has()/anyOf() work identically on every
    // OS — path.join() uses backslashes on Windows and would miss matches.
    const rel = join(relBase, e.name).replace(/\\/g, "/");
    const full = join(dir, e.name);
    if (e.isDirectory()) {
      if (!SKIP.has(e.name)) walk(full, rel);
    } else {
      allFiles.push(rel);
      if (srcExt.has(extname(e.name).toLowerCase())) srcCount++;
      let size = 0;
      try {
        size = statSync(full).size;
      } catch {
        continue;
      }
      // read text-ish files up to 512 KB for pattern matching
      if (size > 0 && size <= 512 * 1024) {
        try {
          const buf = readFileSync(full);
          const content = buf.toString("utf8");
          if (!content.includes("\u0000")) textFiles.push({ path: full, rel, content });
        } catch {
          /* binary/unreadable — skip */
        }
      }
    }
  }
}
walk(DIR, "");

const rels = new Set(allFiles);
const has = (p) => rels.has(p);
const anyOf = (names) => names.some((n) => [...rels].some((r) => r.toLowerCase() === n.toLowerCase()));
const someMatch = (re) => textFiles.some((f) => re.test(f.content));
const pkg = (() => {
  try {
    return JSON.parse(readFileSync(join(DIR, "package.json"), "utf8"));
  } catch {
    return null;
  }
})();
const pyProject = has("requirements.txt") || has("pyproject.toml") || has("Pipfile");

const isConfig = (rel) =>
  /\.(example|sample|template|md|txt|lock|json|lockb|yaml|yml|toml)$/i.test(extname(rel) || "") ||
  /(^|\/)(\.env|package-lock|pnpm-lock|yarn\.lock|go\.sum|poetry\.lock|Gemfile\.lock|\.gitignore)$/i.test(rel);

// --- checks ----------------------------------------------------------------------
const checks = [];
const add = (key, label, status, note) => checks.push({ key, label, status, note });

// 1. Project manifest
if (pkg) {
  const scripts = Object.keys(pkg.scripts || {});
  add("manifest", "Project manifest (package.json)", "PASS", "package.json found");
  if (scripts.includes("dev") || scripts.includes("start") || scripts.includes("serve"))
    add("run", "Run script (dev/start/serve)", "PASS", "found in package.json scripts");
  else add("run", "Run script (dev/start/serve)", "FAIL", "no dev/start/serve script — how is it run?");
  add("build", "Build script", scripts.includes("build") || scripts.includes("build:prod") ? "PASS" : "WARN", scripts.includes("build") || scripts.includes("build:prod") ? "build script found" : "no build script — production builds will be manual");
} else if (pyProject) {
  add("manifest", "Project manifest (requirements.txt/pyproject.toml)", "PASS", "Python project detected");
  add("run", "Run script (start command)", "WARN", "no standard start entry verified — document how the app runs");
  add("build", "Build/collectstatic", "WARN", "no build step verified — confirm collectstatic/asset pipeline");
} else {
  add("manifest", "Project manifest", "FAIL", "no package.json / requirements.txt — what IS this project?");
}

// 2. Docs + ignore
add("readme", "README", has("README.md") || has("README.rst") || anyOf(["readme.md", "readme.rst"]) ? "PASS" : "WARN", has("README.md") ? "README.md found" : "no README — add setup + deploy instructions");
add("gitignore", ".gitignore", has(".gitignore") ? "PASS" : "WARN", has(".gitignore") ? "found" : "no .gitignore — node_modules/.env will be committed");

// 3. Env + secrets
const envExample = anyOf([".env.example", ".env.sample", ".env.template", ".env.example.js"]);
const envUsed = someMatch(/\bprocess\.env\b|os\.environ\b|\$env:|getenv\(/);
const secretRx = [
  /\bsk-[A-Za-z0-9_-]{20,}\b/, // OpenAI-style
  /\bAKIA[0-9A-Z]{16}\b/, // AWS access key
  /\bghp_[A-Za-z0-9]{20,}\b/, // GitHub PAT
  /\bxox[baprs]-[A-Za-z0-9-]{10,}\b/, // Slack
  /\bAIza[0-9A-Za-z_-]{20,}\b/, // Google API
  /-----BEGIN (RSA |OPENSSH |EC |DSA )?PRIVATE KEY-----/, // private keys
  /\b(password|passwd|api[_-]?key|secret|token|client[_-]?secret)\s*[:=]\s*['"][^'"]{24,}['"]/i, // long inline creds
];
const hardcoded = textFiles
  .filter((f) => !isConfig(f.rel) && !/^\.env\./i.test(basename(f.rel)))
  .map((f) => ({ file: f.rel, hits: secretRx.filter((re) => re.test(f.content)) }))
  .filter((x) => x.hits.length);
add("env-example", ".env.example", envExample ? "PASS" : "WARN", envExample ? "found — good practice" : "no .env.example — document required env vars");
if (envUsed && !envExample) add("env-doc", "Env vars documented", "WARN", "code reads env vars but there's no .env.example to document them");
if (hardcoded.length) {
  const worst = hardcoded[0];
  add("secrets", "No hardcoded secrets", "FAIL", `possible secret(s) in ${worst.file}${hardcoded.length > 1 ? ` (+${hardcoded.length - 1} more)` : ""} — move to env vars immediately`);
} else {
  add("secrets", "No hardcoded secrets", "PASS", "no high-confidence secret patterns found in source");
}

// 4. App entry
const entry =
  has("index.js") || has("index.ts") || has("main.js") || has("main.py") || has("app.js") || has("app.py") ||
  has("server.js") || has("server.ts") || has("manage.py") || has("wsgi.py") || has("asgi.py") ||
  has("src/index.js") || has("src/index.ts") || has("src/main.js") || has("src/main.tsx") || has("src/App.jsx") || has("src/App.tsx") ||
  has("src/app/page.tsx") || has("src/app/layout.tsx") || has("app/page.tsx") ||
  (pkg && (pkg.main || (pkg.scripts && (pkg.scripts.start || pkg.scripts.dev)))) ||
  false;
add("entry", "App entry point", entry ? "PASS" : "FAIL", entry ? "entry point found" : "no obvious app entry (index/main/app/server) — nothing runs");
add("source", "Source code present", srcCount > 0 ? "PASS" : "FAIL", srcCount > 0 ? `${srcCount} source files` : "zero source files found");

// 5. Data + identity (WARN when a user-facing app appears to lack them)
add("auth", "Auth / user identity", someMatch(/\b(auth|login|signin|signup|register|oauth|session|cookie|jwt|clerk|auth0|nextauth|firebase-auth)\b/i) ? "PASS" : "WARN", someMatch(/\b(auth|login|signin|signup|register|oauth|session|cookie|jwt|clerk|auth0|nextauth)\b/i) ? "auth markers found" : "no auth markers — add user identity if the app stores per-user data");
add("database", "Database / storage", someMatch(/\b(postgres|postgresql|mysql|sqlite|mongodb|redis|prisma|drizzle|supabase|firebase|dynamodb|knex|sequelize|typeorm|sqlalchemy|pg\b|mysql2)\b/i) ? "PASS" : "WARN", someMatch(/\b(postgres|postgresql|mysql|sqlite|mongodb|redis|prisma|drizzle|supabase|firebase|dynamodb)\b/i) ? "db markers found" : "no database markers — confirm where data is stored");
if (WITH_PAYMENTS) {
  add("payments", "Payments / billing", someMatch(/\b(stripe|paddle|lemonsqueezy|lemon-squeezy|razorpay|paypal|squareup|billing|subscription|checkout)\b/i) ? "PASS" : "WARN", someMatch(/\b(stripe|paddle|lemonsqueezy|razorpay|paypal|billing|subscription|checkout)\b/i) ? "payment markers found" : "--payments requested but no payment/billing markers found");
}

// 6. Robustness
add("errors", "Error handling", someMatch(/\btry\s*\{|\bcatch\s*\(|ErrorBoundary|componentDidCatch|process\.on\(['"]unhandledRejection|app\.use\([^)]*error|onUnhandledError|logging\.(error|exception)/) ? "PASS" : "WARN", "error-handling markers found or none — confirm crashes surface to the user/logs");
add("validation", "Input validation", someMatch(/\b(zod|joi|yup|valibot|class-validator|express-validator|pydantic|sanitize-html|validator)\b/i) ? "PASS" : "WARN", "validation library found or none — user input must be validated/sanitized");
add("cors-rate", "CORS / rate limiting", someMatch(/\b(cors|rate-?limit|helmet|express-rate-limit|throttle)\b/i) ? "PASS" : "WARN", "CORS/rate-limit markers found or none — required for public APIs");

// 7. Quality gates
const testScript = pkg && /test|lint|check/gi.test(Object.keys(pkg.scripts || {}).join(" "));
const testFiles = allFiles.some((r) => /\.(test|spec)\.[jt]sx?$/i.test(r) || /(^|\/)__tests__\//.test(r));
add("tests", "Tests", testScript && testFiles ? "PASS" : testScript || testFiles ? "WARN" : "WARN", testScript && testFiles ? "test script + test files found" : "no tests found — at least cover auth, billing and critical paths");
add("lint", "Lint / format", someMatch(/\b(eslint|prettier|biome|oxlint|flake8|black|ruff|gofmt)\b/i) ? "PASS" : "WARN", "linter markers found or none — linting prevents silent breakage");

// 8. Ops + go-live
add("ci", "CI config", anyOf([".github/workflows/ci.yml", ".github/workflows/main.yml", ".gitlab-ci.yml", ".circleci/config.yml", "azure-pipelines.yml", ".travis.yml"]) || rels.has(".github/workflows") ? "PASS" : "WARN", "CI config found or none — a simple GitHub Actions test-on-push is recommended");
add("deploy", "Deploy config", anyOf(["vercel.json", "netlify.toml", "render.yaml", "fly.toml", "railway.json", "app.json", "Procfile", "Dockerfile", "wrangler.toml", "amplify.yml"]) || has("Dockerfile") ? "PASS" : "WARN", "deploy config found or none — pick Vercel/Railway/Fly and add config");
add("analytics", "Analytics", someMatch(/\b(analytics|posthog|plausible|segment|gtag|google-analytics|umami|mixpanel|amplitude|fathom)\b/i) ? "PASS" : "WARN", "analytics markers found or none — you can't improve what you don't measure");
const htmlFiles = textFiles.filter((f) => /\.html$/i.test(f.rel));
const layoutFiles = textFiles.filter((f) => /(layout|index)\.(tsx|jsx|html)$/i.test(f.rel));
const seoDoc = [...htmlFiles, ...layoutFiles].some((f) => /<title[^>]*>.*<\/title>/i.test(f.content) && /<meta[^>]+(description|og:title|og:image)[^>]*>/i.test(f.content));
add("seo", "SEO meta (title/description/OG)", seoDoc ? "PASS" : "WARN", seoDoc ? "title + meta found" : "no title/meta description found in HTML/layout — add for sharing + search");

// --- report ----------------------------------------------------------------------
const pass = checks.filter((c) => c.status === "PASS").length;
const warn = checks.filter((c) => c.status === "WARN").length;
const fail = checks.filter((c) => c.status === "FAIL").length;
const verdict = fail ? "FIX NEEDED" : "PASS";

mkdirSync(OUT_DIR, { recursive: true });
const rows = checks.map((c) => `| ${c.key} | ${c.label} | **${c.status}** | ${c.note} |`).join("\n");
const md = `# Web App Audit — ${NAME}

- **Date:** ${new Date().toISOString().slice(0, 10)}
- **Project dir:** ${DIR} · **Source files:** ${srcCount} · **Files scanned:** ${textFiles.length}
- **Flags:** ${WITH_PAYMENTS ? "payments audit on" : "payments audit off (add --payments if monetized)"}
- **Automated verdict:** **${verdict}** (${pass} PASS · ${warn} WARN · ${fail} FAIL)

## 1. Automated checks (script verdicts)

| Key | Check | Verdict | Note |
|---|---|---|---|
${rows}

## 2. Auditor subagent sign-off (complete after reviewing the app + report)

- **2.1 Real secrets anywhere?** (script found patterns — check ${hardcoded.length ? hardcoded.map((h) => h.file).join(", ") : "none flagged"})
- **2.2 App actually runs?** (open it — does it start, is the first user flow complete?)
- **2.3 Broken or half-built screens** (vibe-code risk: dead buttons, TODO stubs, mocked data)
- **2.4 Error states** (empty state, loading state, failure state on every async view)
- **2.5 Mobile responsive at phone width?**
- **2.6 Accessibility basics** (labels, contrast, keyboard nav)
- **2.7 Any WARN above that is really a blocker?**

## 3. Verdict

- All PASS and no real WARN → **PASS**
- Any FAIL or a WARN judged real → **FIX NEEDED** — list concrete fixes, fix, re-run, re-audit.
`;

writeFileSync(join(OUT_DIR, "audit-report.md"), md, "utf8");
console.log(`\n${fail ? "❌" : "✅"} ${NAME}: ${pass} PASS · ${warn} WARN · ${fail} FAIL → verdict ${verdict}`);
console.log(`   audit-report.md → ${join(OUT_DIR, "audit-report.md")}`);
process.exitCode = fail ? 1 : 0;
