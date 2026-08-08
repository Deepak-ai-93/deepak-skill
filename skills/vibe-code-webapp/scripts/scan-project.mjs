#!/usr/bin/env node
// scan-project.mjs — existing-project mode for the vibe-code-webapp skill.
// Scans a folder that ALREADY has code and writes a project-scan.md: detected
// stack, folder structure, routes/pages, data/auth/payment markers, env files,
// quality markers (tests/lint/CI/deploy) — the ground truth the build pack is
// planned on. The agent completes the judgment sections (existing features,
// gaps, extension opportunities) before writing PRD.md + stack-blueprint.md.
//
// Usage:
//   node scripts/scan-project.mjs --dir . --name my-app [--out output/scan]
//
//   --dir <path>   project folder to scan (default: ".")
//   --name <slug>  report label (default: folder name)
//   --out <dir>    where project-scan.md is written (default: output/scan)
//
// Framework/feature detection is marker-based (like audit-webapp.mjs), so it
// works on any stack. Exit code 1 when nothing project-like is found.
import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { resolve, join, extname, basename } from "node:path";

const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const needle = `--${name}`;
  const found = args.find((a) => a === needle || a.startsWith(`${needle}=`));
  if (found === undefined) return fallback;
  const eq = found.indexOf("=");
  return eq !== -1 ? found.slice(eq + 1) : args[args.indexOf(found) + 1];
};

const DIR = resolve(process.cwd(), opt("dir", "."));
const NAME = opt("name", basename(DIR) || "project");
const OUT_DIR = resolve(process.cwd(), opt("out", "output/scan"));

// --- walk the project -----------------------------------------------------------
const SKIP = new Set([
  "node_modules", ".git", "dist", "build", ".next", "out", "coverage",
  ".venv", "venv", "__pycache__", ".cache", ".agents", ".claude", "output",
  ".expo", ".turbo", ".vite", ".idea", ".vscode", "Pods", "vendor",
]);
const srcExt = new Set([".js", ".jsx", ".ts", ".tsx", ".mjs", ".cjs", ".py", ".rb", ".go", ".php", ".rs", ".java", ".html", ".css", ".scss", ".vue", ".svelte", ".sql"]);
const allFiles = [];
const textFiles = [];
let srcCount = 0;
const dirCounts = new Map(); // dirRel -> file count

function walk(dir, relBase) {
  let entries = [];
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of entries) {
    const rel = join(relBase, e.name).replace(/\\/g, "/");
    const full = join(dir, e.name);
    if (e.isDirectory()) {
      if (!SKIP.has(e.name)) walk(full, rel);
    } else {
      allFiles.push(rel);
      if (srcExt.has(extname(e.name).toLowerCase())) srcCount++;
      const parent = (rel.split("/").slice(0, -1).join("/")) || ".";
      dirCounts.set(parent, (dirCounts.get(parent) || 0) + 1);
      let size = 0;
      try {
        size = statSync(full).size;
      } catch {
        continue;
      }
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

const deps = { ...(pkg?.dependencies || {}), ...(pkg?.devDependencies || {}) };
const depNames = Object.keys(deps).map((d) => d.toLowerCase());

// --- detection -------------------------------------------------------------------
const isNext = depNames.includes("next") || has("next.config.js") || has("next.config.mjs") || has("next.config.ts") || has("app/") || has("src/app/");
const isVite = depNames.includes("vite") || has("vite.config.js") || has("vite.config.ts") || has("vite.config.mjs");
const isExpress = depNames.includes("express") || depNames.includes("fastify") || depNames.includes("koa");
const isReact = isNext || isVite || depNames.includes("react") || depNames.includes("react-dom");
const isAstro = depNames.includes("astro") || has("astro.config.mjs");
const isSvelte = depNames.includes("svelte") || depNames.includes("sveltekit");
const isVue = depNames.includes("vue");
const isPython = pyProject || srcCount && someMatch(/\b(from flask import|import flask|from django|import django|from fastapi|import fastapi)\b/);
const pyFramework = isPython
  ? someMatch(/\bfrom flask import|import flask\b/) ? "Flask" : someMatch(/\bfrom django|import django\b/) ? "Django" : someMatch(/\bfrom fastapi|import fastapi\b/) ? "FastAPI" : "Python"
  : "";

let framework = "unknown";
if (isNext) framework = "Next.js (React)";
else if (isAstro) framework = "Astro";
else if (isSvelte) framework = "Svelte/SvelteKit";
else if (isVue) framework = "Vue";
else if (isVite) framework = "Vite (React)";
else if (isExpress) framework = "Express (Node)";
else if (pyFramework) framework = pyFramework;
else if (isReact) framework = "React (no framework detected)";

const tsCount = allFiles.filter((f) => /\.(ts|tsx)$/i.test(f)).length;
const jsCount = allFiles.filter((f) => /\.(js|jsx|mjs|cjs)$/i.test(f)).length;
const language = tsCount > jsCount ? "TypeScript" : jsCount > 0 ? "JavaScript" : pyFramework ? "Python" : "unknown";

// routes/pages
const pageFiles = allFiles.filter((f) => /(^|\/)page\.(tsx|jsx|ts|js|svelte|vue)$/i.test(f) || /(^|\/)routes\/.+\.(tsx|jsx|ts|js)$/i.test(f));
const apiRoutes = allFiles.filter((f) => /(^|\/)api\//.test(f) && /\.(ts|tsx|js|jsx|py)$/i.test(f));

// markers (mirrors audit-webapp.mjs so the two reports agree)
const dbMarker = someMatch(/\b(postgres|postgresql|mysql|sqlite|mongodb|redis|prisma|drizzle|supabase|firebase|dynamodb|knex|sequelize|typeorm|sqlalchemy|pg\b|mysql2|better-sqlite3)\b/i);
const authMarker = someMatch(/\b(auth|login|signin|signup|register|oauth|session|cookie|jwt|clerk|auth0|nextauth|firebase-auth)\b/i);
const payMarker = someMatch(/\b(stripe|paddle|lemonsqueezy|lemon-squeezy|razorpay|paypal|squareup|billing|subscription|checkout)\b/i);
const testFiles = allFiles.filter((r) => /\.(test|spec)\.[jt]sx?$/i.test(r) || /(^|\/)__tests__\//.test(r));
const testScript = pkg && /test|lint|check/gi.test(Object.keys(pkg.scripts || {}).join(" "));
const ciFiles = allFiles.filter((f) => /(^|\/)(\.github\/workflows\/|\.gitlab-ci\.yml|\.circleci\/config\.yml|azure-pipelines\.yml|\.travis\.yml)/.test(f));
const deployFiles = allFiles.filter((f) => /(vercel\.json|netlify\.toml|render\.yaml|fly\.toml|railway\.json|app\.json|Procfile|Dockerfile|wrangler\.toml|amplify\.yml)$/i.test(f));
const envFiles = allFiles.filter((f) => /(^|\/)\.env/i.test(f) && !f.includes(".example"));
const envExample = anyOf([".env.example", ".env.sample", ".env.template"]);

// folder tree (compact — dirs up to depth 4 with file counts)
function tree() {
  const depth = (rel) => (rel === "." ? 0 : rel.split("/").length);
  const rows = [];
  for (const [dir, count] of [...dirCounts.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    if (depth(dir) > 4) continue;
    if (dir === "." || !count) continue;
    rows.push(`| \`${dir}/\` | ${count} |`);
  }
  return rows.join("\n");
}

// --- write the scan ---------------------------------------------------------------
const scans = [
  ["manifest", "Project manifest", pkg ? "PASS" : pyProject ? "PASS" : "FAIL", pkg ? "package.json" : pyProject ? "Python project files" : "no manifest found"],
  ["framework", "Framework detected", framework !== "unknown" ? "PASS" : "FAIL", framework],
  ["language", "Language", language !== "unknown" ? "PASS" : "FAIL", `${language} (${tsCount} ts · ${jsCount} js)`],
  ["pages", "Pages/routes", pageFiles.length ? "PASS" : "WARN", `${pageFiles.length} page files`],
  ["api", "API routes", apiRoutes.length ? "PASS" : "WARN", `${apiRoutes.length} route handler files`],
  ["data", "Data layer markers", dbMarker ? "PASS" : "WARN", dbMarker ? "db markers found" : "none found — confirm where data lives"],
  ["auth", "Auth markers", authMarker ? "PASS" : "WARN", authMarker ? "auth markers found" : "none found"],
  ["payments", "Payments markers", payMarker ? "PASS" : "WARN", payMarker ? "payment markers found" : "none found"],
  ["env", "Env files", envExample ? "PASS" : envFiles.length ? "WARN" : "WARN", envExample ? ".env.example present" : `${envFiles.length} .env file(s) but no .env.example`],
  ["tests", "Tests", testFiles.length && testScript ? "PASS" : testFiles.length || testScript ? "WARN" : "WARN", `${testFiles.length} test files${testScript ? " + test/lint script" : ""}`],
  ["ci", "CI config", ciFiles.length ? "PASS" : "WARN", ciFiles.length ? ciFiles.join(", ") : "none found"],
  ["deploy", "Deploy config", deployFiles.length ? "PASS" : "WARN", deployFiles.length ? deployFiles.join(", ") : "none found"],
  ["source", "Source files", srcCount > 0 ? "PASS" : "FAIL", `${srcCount} source files`],
];

const scanRows = scans.map((s) => `| ${s[0]} | ${s[1]} | **${s[2]}** | ${s[3]} |`).join("\n");
const md = `# Project Scan — ${NAME}

- **Date:** ${new Date().toISOString().slice(0, 10)}
- **Project dir:** ${DIR} · **Source files:** ${srcCount} · **Files scanned:** ${textFiles.length}
- **Mode:** existing project — the build pack EXTENDS this app, it does not start from zero
- **Next:** agent completes sections 3–9, then writes \`PRD.md\` + \`stack-blueprint.md\` + \`TODO.md\` on top of this ground truth.

## 1. Automated scan (script verdicts)

| Key | Check | Verdict | Evidence |
|---|---|---|---|
${scanRows}

## 2. Folder structure (top 4 levels)

| Folder | Files |
|---|---|
${tree() || "| *(project root)* | all " + srcCount + " source files — no subfolders |"}

## 3. Stack details (agent fills from the scan + reading key files)

| Layer | In this project | Notes |
|---|---|---|
| Framework / router | ${framework} | |
| Styling | {Tailwind / CSS modules / …} | |
| Data + ORM | {Postgres/Drizzle / SQLite / …} | |
| Auth | {none / session / JWT / …} | |
| Payments | {none / Stripe / …} | |
| Hosting / deploy | {Vercel / Railway / self-host / none} | |
| Key dependencies | ${Object.keys(deps).slice(0, 15).join(", ") || "—"} | |

## 4. Existing features & routes (agent fills — what already works)

| Route / feature | Status (works / partial / stub / missing) | Where (file) |
|---|---|---|
| | | |

## 5. Existing data model (agent fills — tables, auth model, migrations)

| Entity | Key fields | File |
|---|---|---|
| | | |

## 6. Env vars already used (agent fills)

| Var | Used where | Documented in .env.example? |
|---|---|---|
| | | |

## 7. Quality markers (from the scan)

- **Tests:** ${testFiles.length ? `${testFiles.length} file(s)` : "none"} · **CI:** ${ciFiles.length ? "yes" : "no"} · **Deploy config:** ${deployFiles.length ? "yes" : "no"} · **README:** ${has("README.md") ? "yes" : "no"} · **.gitignore:** ${has(".gitignore") ? "yes" : "no"}

## 8. Gaps & risks (agent fills — honest read of what's fragile)

- {e.g. no auth yet · no error states on dashboard · schema not migrated anywhere · dead code from an abandoned feature}

## 9. Extension opportunities (agent fills — what the new idea can build on)

- {e.g. auth exists → add the paid tier on top · data layer is solid → only new tables needed · design system already in place → new pages are cheap}

> Status: feeds the idea interview (existing-project questions) and Stage 3 (build pack + TODO.md).
`;

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(join(OUT_DIR, "project-scan.md"), md, "utf8");

const fail = scans.filter((s) => s[2] === "FAIL").length;
console.log(`\n${fail ? "❌" : "✅"} ${NAME}: ${scans.length - fail} checks ok · ${fail} FAIL → project-scan.md → ${join(OUT_DIR, "project-scan.md")}`);
if (!srcCount && !pkg && !pyProject) {
  console.log("\n⚠️  Nothing project-like found — is this really an existing project? (If not, skip the scan and run the new-project flow.)");
  process.exitCode = 1;
} else {
  console.log("\n✅ Ground truth captured — complete the agent-fill sections (3–6, 8–9), then run the idea interview for what to CHANGE.");
}
