#!/usr/bin/env node
// pack-builder.mjs — assembles the vibe-code-webapp BUILD PACK from ONE
// `pack-plan.json` (the agent fills every judgment field; the script owns the
// structure): PRD.md + stack-blueprint.md + sitemap.md + TODO.md, all validated
// and deterministic — exit 1 on any missing field or leftover placeholder.
//
// This is the productivity layer of Stage 3: the LLM authors ONE JSON instead
// of hand-writing four files, batch mode turns N ideas into N packs, and the
// placeholder gate means an incomplete pack can never slip to the user.
//
// Usage:
//   node scripts/pack-builder.mjs --plan pack-plan.json
//   node scripts/pack-builder.mjs --plan pack-plan.json --check-only
//   node scripts/pack-builder.mjs --plan pack-plan.json --batch
//   node scripts/pack-builder.mjs --plan pack-plan.json --out-dir output/packs/myapp
//
//   --plan <file>        the pack-plan.json (schema below; ONE app)
//   --batch              treat the JSON as {"apps":[...]} → one pack per app in
//                        output/packs/<kebab-name>/ + output/packs/index.md
//   --check-only         validate only — write nothing
//   --out-dir <dir>      write the 4 files into <dir> (default: project root)
//
// Exit codes: 0 = pack valid + written · 1 = validation FAIL (nothing written)
// · 2 = usage error.
//
// pack-plan.json schema (all prose is authored by the agent; structure is owned here):
// {
//   "app": {
//     "name": "InvoiceFlow", "one_liner": "...", "audience": "...",
//     "platform": "web app", "monetized": true, "pricing": "...",
//     "mode": "new" | "existing", "idea_verbatim": "...", "stack_preference": "...",
//     "scope": "MVP for InvoiceFlow",
//     "validation": { "scores": [5,4,4,5,5,3,4], "guardrail": "...",
//       "risks": ["...", "...", "..."],
//       "economics": { "price": "...", "variable_cost": "...", "margin": "...",
//                      "cac": "...", "payback": "...", "ltv": "..." },
//       "moves": [ {"move":"5 user interviews","status":"","result":""} ] },
//     "problem": { "statement": "...", "proof": "...", "workaround": "...", "jtbd": "..." },
//     "personas": [ {"name":"The Solo Operator","who":"...","pain":"...","success":"..."} ],
//     "mvp": { "must": ["...","..."], "should": ["...","..."], "wont": ["...","..."] },
//     "flows": ["...","..."],
//     "data_model": { "sql": "..." }  OR  "tables": [{"entity":"users","fields":"...","relations":"..."}],
//     "auth": ["...","..."], "payments": ["...","..."],
//     "kpis": { "metric": "...", "tools": "...", "guardrail": "..." },
//     "risks": ["...","..."], "decisions": ["...","..."],
//     "ai": { "features": [ {"feature":"chat copilot","value":"...","model":"...",
//              "streaming":true,"cost_rail":"...","evals":"..."} ],
//              "non_ai_fallback": "...", "kill_guardrail": "..." },   // optional
//     "design": { "source": "figma"|"stitch"|"pack", "link": "...",
//                 "accent_hsl": "243 75% 59%", "notes": "..." },
//     "stack": { "framework":"...", "ui":"...", "fonts":"...", "data":"...",
//                "auth":"...", "payments":"...", "hosting":"...", "analytics":"...",
//                "notes":"..." },
//     "deploy": { "host": "Vercel", "domain": "invoiceflow.com" },
//     "routes": [ {"route":"/","purpose":"...","group":"Public","auth":"none","status":"🆕"} ],
//     "pages": [ {"route":"/","name":"Landing","purpose":"...","layout":"...","auth":"public",
//                 "components":"...","data":"...","actions":"...","states":"...","navigation":"..."} ],
//     "backend": { "folder": "...", "endpoints": [ {"method":"action","path":"createInvoice",
//                   "purpose":"...","auth":"session","input":"..."} ],
//                  "auth_flow": ["...","..."], "payments_flow": ["...","..."],
//                  "env_vars": [ {"var":"DATABASE_URL","example":"postgres://…","source":"Neon"} ] },
//     "workflows": [ {"title":"Get paid on an invoice","steps":["...","..."]} ],
//     "system_workflows": [ {"title":"Auth (signup → session)","steps":["..."]} ],
//     "build_order": [ {"step":1,"title":"Scaffold create-next-app","done":"`npm run dev` works","prio":"P0"} ],
//     "extra_ideas": ["...","..."]
//   }
// }
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve, join } from "node:path";

// ─── brand banner (deepak-skill · crafted by Deepak) ────────────────────────
const BRAND_LINE = "═".repeat(56);
const banner = (label) =>
  `\n${BRAND_LINE}\n  🎬 deepak-skill — crafted by Deepak\n  skill: vibe-code-webapp · ${label}\n${BRAND_LINE}\n`;
console.log(banner("pack-builder.mjs"));

const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const needle = `--${name}`;
  const found = args.find((a) => a === needle || a.startsWith(`${needle}=`));
  if (found === undefined) return fallback;
  const eq = found.indexOf("=");
  return eq !== -1 ? found.slice(eq + 1) : args[args.indexOf(found) + 1];
};
const hasFlag = (name) => args.includes(`--${name}`);

function usage() {
  console.log(`pack-builder.mjs — build-pack assembler (vibe-code-webapp skill)

Usage:
  node scripts/pack-builder.mjs --plan pack-plan.json                build ONE pack (project root)
  node scripts/pack-builder.mjs --plan pack-plan.json --check-only   validate only — write nothing
  node scripts/pack-builder.mjs --plan pack-plan.json --batch        {"apps":[...]} → output/packs/<app>/
  node scripts/pack-builder.mjs --plan pack-plan.json --out-dir <dir>  write the 4 files into <dir>

Writes: PRD.md · stack-blueprint.md · sitemap.md · TODO.md (todo.mjs-compatible)
Exit codes: 0 valid · 1 validation FAIL (nothing written) · 2 usage error
`);
  process.exit(2);
}

const planPath = opt("plan", "");
if (!planPath) usage();
if (!existsSync(resolve(planPath))) {
  console.error(`❌ plan file not found: ${planPath}`);
  process.exit(1);
}

let plan;
try {
  plan = JSON.parse(readFileSync(resolve(planPath), "utf8"));
} catch (e) {
  console.error(`❌ ${planPath} is not valid JSON: ${e.message}`);
  process.exit(1);
}

const checkOnly = hasFlag("check-only");
const batch = hasFlag("batch");
const apps = batch ? plan.apps : [plan.app];
if (batch && !Array.isArray(plan.apps)) {
  console.error("❌ --batch requires the plan to be { \"apps\": [ ... ] }.");
  process.exit(2);
}

// ─── validation ─────────────────────────────────────────────────────────────
const FAILS = [];
const warn = (app, msg) => console.log(`  ⚠️  ${app}: ${msg}`);
const fail = (app, msg) => FAILS.push(`  ❌ ${app}: ${msg}`);

const isBlank = (v) => v === undefined || v === null || String(v).trim() === "";
// Real placeholders are `{human prose}` like `{e.g. something}` or `{App Name}`.
// Runtime tokens (`{userId}`, `{userId, invoiceId}`, `{token}`) are legitimate
// code references and are allowed — braces holding only camelCase identifiers.
// Real placeholders are `{human prose}` like `{e.g. something}` or `{App Name}`.
// Runtime tokens (`{userId}`, `{userId, invoiceId}`) and JSON literals
// (`{ ok: true }`) are legitimate and allowed — braces holding only camelCase
// identifiers and/or `key: literal` pairs.
const TOKEN_SET =
  /^\{\s*(?:[a-z][a-zA-Z0-9]*)(?:\s*:\s*(?:true|false|null|[a-zA-Z0-9._-]+))?(?:\s*,\s*(?:[a-z][a-zA-Z0-9]*)(?:\s*:\s*(?:true|false|null|[a-zA-Z0-9._-]+))?)*\s*\}$/;
const hasPlaceholder = (v) =>
  (String(v).match(/{[^{}]*}/g) || []).some((g) => !TOKEN_SET.test(g.trim()));

function deepScan(value, path, appName, failFn) {
  if (value === null || value === undefined) return;
  if (typeof value === "string") {
    if (hasPlaceholder(value)) failFn(appName, `${path} still contains a {placeholder}`);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((v, i) => deepScan(v, `${path}[${i}]`, appName, failFn));
    return;
  }
  if (typeof value === "object") {
    for (const k of Object.keys(value)) deepScan(value[k], `${path}.${k}`, appName, failFn);
  }
}

function validateApp(app) {
  const name = app.name || "(unnamed app)";
  const f = (msg) => fail(name, msg);

  // Required core fields
  for (const field of ["name", "one_liner", "audience", "platform", "idea_verbatim"]) {
    if (isBlank(app[field])) f(`missing required field: app.${field}`);
  }
  if (isBlank(app.stack?.framework)) f("missing required field: app.stack.framework");
  if (!["new", "existing"].includes(app.mode)) f("app.mode must be \"new\" or \"existing\"");

  // Validation block
  const v = app.validation;
  if (!v || !Array.isArray(v.scores) || v.scores.length !== 7 ||
      v.scores.some((n) => !Number.isInteger(n) || n < 1 || n > 5)) {
    f("app.validation.scores must be exactly 7 integers 1–5");
  } else {
    const total = v.scores.reduce((a, b) => a + b, 0);
    const verdict = total >= 30 ? "BUILD" : total >= 25 ? "ITERATE" : "PIVOT or KILL";
    if (total !== v.total) f(`app.validation.total (${v.total}) ≠ sum of scores (${total})`);
    if (verdict !== v.verdict) f(`app.validation.verdict (${v.verdict}) ≠ computed (${verdict})`);
    if (!Array.isArray(v.risks) || v.risks.length < 3) f("app.validation.risks needs ≥ 3 entries");
    if (isBlank(v.guardrail)) f("app.validation.guardrail is required (the kill guardrail)");
  }

  // MVP + routes + pages + build order
  if (!Array.isArray(app.mvp?.must) || app.mvp.must.length === 0) f("app.mvp.must needs ≥ 1 must-have");
  if (!Array.isArray(app.routes) || app.routes.length < 3) f("app.routes needs ≥ 3 routes");
  const routeSet = new Set((app.routes || []).map((r) => r.route));
  for (const r of app.routes || []) {
    if (!/^\//.test(r.route)) f(`route "${r.route}" must start with "/"`);
    for (const field of ["purpose", "group", "auth", "status"]) {
      if (isBlank(r[field])) f(`route ${r.route} is missing ${field}`);
    }
  }
  if (!Array.isArray(app.pages) || app.pages.length === 0) f("app.pages needs ≥ 1 page block");
  for (const p of app.pages || []) {
    if (!routeSet.has(p.route)) f(`page block "${p.name}" references unknown route ${p.route}`);
    if (isBlank(p.components)) f(`page block ${p.route} is missing components`);
  }
  if (!Array.isArray(app.build_order) || app.build_order.length === 0) {
    f("app.build_order needs ≥ 1 step");
  } else {
    for (const s of app.build_order) {
      if (!/^P[012]$/.test(s.prio || "")) f(`build step ${s.step} "${s.title}" needs prio P0|P1|P2`);
      if (isBlank(s.done)) f(`build step ${s.step} "${s.title}" needs a definition of done`);
      if (isBlank(s.title)) f(`build step ${s.step} has no title`);
    }
  }

  // Monetization → payments required
  if (app.monetized) {
    if (isBlank(app.pricing)) f("monetized app needs app.pricing");
    if (!Array.isArray(app.payments) || app.payments.length === 0) f("monetized app needs app.payments flow");
  }

  // Data model
  const dm = app.data_model;
  if (!dm || (isBlank(dm.sql) && !Array.isArray(dm.tables))) f("app.data_model needs sql or tables[]");

  // AI block consistency
  if (app.ai) {
    if (!Array.isArray(app.ai.features) || app.ai.features.length === 0) f("app.ai.features needs ≥ 1 feature");
    for (const feat of app.ai.features || []) {
      if (typeof feat.streaming !== "boolean") f(`AI feature "${feat.feature}" needs streaming true/false`);
      if (isBlank(feat.cost_rail)) f(`AI feature "${feat.feature}" needs a cost rail`);
    }
    if (isBlank(app.ai.non_ai_fallback)) f("app.ai.non_ai_fallback is required when AI is present");
  }

  // Design source must be locked (never "TBD")
  const src = app.design?.source;
  if (!["figma", "stitch", "pack"].includes(src)) f("app.design.source must be figma | stitch | pack (never TBD)");
  if (isBlank(app.design?.accent_hsl)) f("app.design.accent_hsl is required (e.g. \"243 75% 59%\")");

  // Placeholder gate — no {bracket} survives anywhere in the plan
  deepScan(app, "app", name, fail);

  return name;
}

const appNames = apps.map(validateApp);
if (FAILS.length) {
  console.log(`\npack-builder — validation FAILED (${FAILS.length}):`);
  FAILS.forEach((l) => console.log(l));
  console.log("\nFix pack-plan.json and re-run. Nothing was written.");
  process.exit(1);
}

if (checkOnly) {
  console.log(`✅ ${apps.length} app(s) validated clean — pack-plan.json is complete (no placeholders).`);
  process.exit(0);
}

// ─── renderers ──────────────────────────────────────────────────────────────
const today = new Date().toISOString().slice(0, 10);
const table = (rows, headers) => {
  const esc = (s) => String(s ?? "").replace(/\|/g, "\\|").replace(/\n/g, " ");
  const cols = headers.map((h, i) => Math.max(h.length, ...rows.map((r) => esc(r[i]).length)));
  const line = (cells) => `| ${cells.map((c, i) => esc(c).padEnd(cols[i])).join(" | ")} |`;
  const sep = `| ${cols.map((c) => "-".repeat(c)).join(" | ")} |`;
  return [line(headers), sep, ...rows.map(line)].join("\n");
};

function prd(app) {
  const ai = app.ai;
  const out = [];
  out.push(`# PRD — ${app.name}`, "");
  out.push(`> Assembled by \`pack-builder.mjs\` from \`pack-plan.json\` · ${today} · **approval contract — nothing is coded until the user approves it.**`, "");
  out.push("## 1. Identity", "");
  out.push(table([
    ["**App name**", app.name],
    ["**One-liner**", app.one_liner],
    ["**Audience**", app.audience],
    ["**Platform**", app.platform],
    ["**Mode**", app.mode === "existing" ? "existing project — the pack EXTENDS what the scan found" : "new project"],
    ["**Monetized?**", app.monetized ? `yes — ${app.pricing}` : "no"],
    ["**Stack**", app.stack.framework],
  ], ["Field", "Value"]), "");
  out.push("## 2. Problem & validation", "");
  out.push(`- **Problem:** ${app.problem.statement}`, "");
  out.push(`- **Proof it's real:** ${app.problem.proof}`, "");
  out.push(`- **Today's workaround:** ${app.problem.workaround}`, "");
  out.push(`- **Jobs-to-be-done:** ${app.problem.jtbd}`, "");
  out.push("## 3. Users & personas", "");
  out.push(table(app.personas.map((p) => [p.name, p.who, p.pain, p.success]), ["Persona", "Who", "Top pain", "What success looks like"]), "");
  out.push("## 4. MVP scope", "");
  out.push("Must have (the approval contract):", "");
  app.mvp.must.forEach((m) => out.push(`- [ ] ${m}`));
  out.push("", "Should have (if time):", "");
  app.mvp.should.forEach((m) => out.push(`- [ ] ${m}`));
  out.push("", "Won't do (non-goals):", "");
  app.mvp.wont.forEach((m) => out.push(`- ${m}`));
  out.push("", "## 5. User flows", "");
  app.flows.forEach((f, i) => out.push(`${i + 1}. ${f}`));
  out.push("", "## 6. Data model", "");
  if (app.data_model.tables) {
    out.push(table(app.data_model.tables.map((t) => [t.entity, t.fields, t.relations]), ["Entity", "Key fields", "Relations"]), "");
  } else {
    out.push("```sql", app.data_model.sql.trim(), "```", "");
  }
  out.push("## 7. Auth & permissions", "");
  app.auth.forEach((a) => out.push(`- ${a}`));
  if (app.monetized) {
    out.push("", "## 8. Payments (monetized)", "");
    app.payments.forEach((p) => out.push(`- ${p}`));
  }
  out.push("", "## 9. Analytics & KPIs", "");
  out.push(`- **KPI:** ${app.kpis.metric}`, "");
  out.push(`- **Tools:** ${app.kpis.tools}`, "");
  out.push(`- **Guardrail:** ${app.kpis.guardrail}`, "");
  out.push("", "## 10. Risks & open questions", "");
  app.risks.forEach((r) => out.push(`- ${r}`));
  out.push("", "## 11. Decisions (what changed from the raw request)", "");
  app.decisions.forEach((d) => out.push(`- ${d}`));
  if (ai) {
    out.push("", "## 12. AI features", "");
    out.push("> Rails locked in `stack-blueprint.md` §4.1 from `templates/ai-logic.md`.", "");
    out.push(table(ai.features.map((f) => [f.feature, f.value, f.model, f.streaming ? "yes" : "no", f.cost_rail, f.evals]), ["Feature", "What the user gets", "Model", "Streaming?", "Cost rail", "Eval cases"]), "");
    out.push("", `- **Non-AI fallback:** ${ai.non_ai_fallback}`, "");
    out.push(`- **Kill guardrail for AI:** ${ai.kill_guardrail}`, "");
  }
  out.push("", "## 13. Design source of truth (from `templates/frontend-design.md`)", "");
  out.push(`- **Source picked:** ${app.design.source === "figma" ? `Figma — ${app.design.link}` : app.design.source === "stitch" ? `Google Stitch — ${app.design.link}` : "open-source design pack"}`);
  out.push(`- **Tokens:** ${app.design.notes || "neutral shadcn tokens + one accent hue"}`);
  out.push("- **Design parity:** screens are visually checked against the source at 375/768/1280 — browser MCP vs Figma/Stitch");
  out.push(`- **Validation verdict:** ${app.validation.total}/35 → ${app.validation.verdict} — guardrail: ${app.validation.guardrail}`, "");
  out.push("---", "");
  out.push("> **Status: awaiting user approval** — reply **approve** to build, **edit** to revise, or **reject** to stop.");
  return out.join("\n");
}

function blueprint(app) {
  const s = app.stack;
  const ai = app.ai;
  const out = [];
  out.push(`# Stack Blueprint — ${app.name}`, "");
  out.push(`> Assembled by \`pack-builder.mjs\` from \`pack-plan.json\` · ${today}. This file + \`PRD.md\` + \`sitemap.md\` are **the build pack**: everything the builder needs, nothing it doesn't. Tool-agnostic — works in any CLI (Claude Code, Cursor, Codex), Lovable, Bolt, v0.`, "");
  out.push("## 1. Identity & verdict", "");
  out.push(table([
    ["**App name / one-liner**", `${app.name} — ${app.one_liner}`],
    ["**Idea given by user**", app.idea_verbatim],
    ["**Stack preference given**", app.stack_preference || "none"],
    ["**Evaluation verdict**", `${app.validation.total}/35 → ${app.validation.verdict} (computed by \`saas-score.mjs\`)`],
    ["**Kill guardrail**", app.validation.guardrail],
    ["**Audience**", app.audience],
    ["**Monetized?**", app.monetized ? `yes — ${app.pricing}` : "no"],
    ["**Mode**", app.mode === "existing" ? "existing project — extends the scan; no re-platforming" : "new project"],
  ], ["Field", "Value"]), "");
  out.push("## 2. Stack lock (NO more decisions after this)", "");
  out.push(table([
    ["Framework", s.framework, s.notes || ""],
    ["UI", s.ui, ""],
    ["Fonts", s.fonts, ""],
    ["Data", s.data, ""],
    ["Auth", s.auth, ""],
    ["Payments", s.payments, app.monetized ? "" : "— (not monetized)"],
    ["Hosting", s.hosting, `→ deploy per deploy-runbook.md (host: ${app.deploy?.host || s.hosting})`],
    ["Analytics", s.analytics, ""],
  ], ["Layer", "Locked choice", "Version/notes"]), "");
  out.push("> If the user gave a different stack preference, honor it — but lock it here exactly the same way.", "");
  out.push("## 3. Design — source of truth + design system (applied as-is)", "");
  out.push(`- **Design source of truth (locked, never \"TBD\"):** ${app.design.source === "figma" ? `**Figma** — \`${app.design.link}\` → agent connects via the **Figma Developer MCP** and extracts real tokens/layout; screens match the frames.` : app.design.source === "stitch" ? `**Google Stitch** — \`${app.design.link}\` → UI generated from the sitemap; \`DESIGN.md\` extracted and mapped to tokens.` : `**Open-source design pack** (\`templates/design-system.md\`) — applied as-is.`}`);
  out.push(`- **Palette:** neutral shadcn tokens + one accent (\`--primary\` hue only): \`${app.design.accent_hsl}\``);
  out.push(`- **Notes:** ${app.design.notes || "defaults from the design pack"}`);
  out.push("- **Design parity:** every screen is visually checked against the source of truth (browser-MCP screenshot vs Figma/Stitch) at 375/768/1280 — `frontend-design.md` §3/§5.");
  out.push("- **Pages & components map (summary — full blocks in `sitemap.md` §2):**", "");
  out.push(table(app.pages.map((p) => [p.route, p.components, p.purpose]), ["Page/Route", "Components (shadcn)", "Notes"]), "");
  out.push("## 4. Backend architecture (open-source, applied as-is)", "");
  out.push(`- **Reference:** \`templates/backend-architecture.md\` — folder structure, auth flow, payments flow, security, ops.`);
  out.push(`- **Folder structure:** \`${app.backend.folder}\``);
  out.push("- **Server actions:** `src/actions/{feature}.ts` — zod schema + ownership check + `revalidatePath`.");
  out.push("- **Auth:** `lib/auth.ts` + `middleware.ts` guarding `/dashboard/:path*` and `/api/:path*`.");
  if (ai) {
    out.push("", "### 4.1 AI features (locked rails)", "");
    out.push("- **Reference:** `templates/ai-logic.md` — streaming UX, prompts-as-code, cost rails, evals, security.");
    ai.features.forEach((f) => {
      out.push(`- **${f.feature}:** ${f.value} — model: ${f.model} · streaming: ${f.streaming ? "yes" : "no"} · cost rail: ${f.cost_rail} · evals: ${f.evals}`);
    });
    out.push(`- **Prompts as code:** \`lib/ai/prompts/{feature}.ts\` with zod schemas + versioning — no literals in components.`);
    out.push(`- **Env vars:** AI keys server-only — never \`NEXT_PUBLIC_\`.`);
  }
  out.push("", "## 5. Data model (paste-ready)", "");
  if (app.data_model.tables) {
    out.push(table(app.data_model.tables.map((t) => [t.entity, t.fields, t.relations]), ["Entity", "Key fields", "Relations"]), "");
  } else {
    out.push("```sql", app.data_model.sql.trim(), "```", "");
  }
  out.push("Rules: `user_id` FK on every owned table · `created_at` default now() · indexes on `user_id`, `status`, `email`.", "");
  out.push("**Env vars (paste into `.env.example`):**", "");
  out.push(table(app.backend.env_vars.map((e) => [e.var, e.example, e.source]), ["Var", "Example", "Where it comes from"]), "");
  out.push("## 6. Build order (the distraction-free sequence — do NOT skip ahead)", "");
  app.build_order.forEach((b) => out.push(`${b.step}. **${b.title}** — done when: ${b.done}`));
  out.push("", "**Definition of done per step:** the app runs (`npm run dev`), the step's flow works end-to-end (and matches the design for UI steps), committed. Never 2 steps before running.", "");
  out.push("## 7. Handoff prompts — paste the pack into ANY builder", "");
  out.push("### A. CLI agent (Claude Code / Cursor / Codex / …)", "");
  out.push("```");
  out.push(`Build the app described in PRD.md, stack-blueprint.md and sitemap.md in this folder. The sitemap is the map: every route/page/endpoint in it must exist, nothing else. Follow the build order exactly; keep the app runnable after every step; commit after each working feature; cover auth + billing with tests. Don't redesign — apply the locked design system and architecture as-is.`);
  out.push("```", "", "### B. Lovable / Bolt / v0 (web builders — paste everything)", "");
  out.push("```");
  out.push(`Build a production-ready web app: ${app.one_liner}.`);
  out.push("");
  out.push(`STACK: ${s.framework} + ${s.ui} + ${s.data} + ${s.auth} + ${s.payments} + ${s.hosting}.`);
  out.push("");
  out.push(`PAGES: ${app.pages.map((p) => `${p.route} (${p.purpose})`).join(" · ")}.`);
  out.push(`DESIGN: neutral shadcn tokens, accent ${app.design.accent_hsl}, ${s.fonts} fonts, ${app.pages.map((p) => p.components).join(", ")}.`);
  out.push(`DATA MODEL: ${app.data_model.tables ? app.data_model.tables.map((t) => `${t.entity} (${t.fields})`).join(" · ") : app.data_model.sql.split("\n").map((l) => l.trim()).filter(Boolean).join(" · ")}.`);
  out.push(`AUTH: ${app.auth[0] || "email+password"}; protect the app area.`);
  out.push(`PAYMENTS: ${app.monetized ? app.payments[0] : "none in MVP"}.`);
  out.push(`ENV VARS (create .env.example): ${app.backend.env_vars.map((e) => `${e.var} (${e.example})`).join(" · ")}.`);
  out.push(`FEATURES (MVP, in order): ${app.mvp.must.join(" → ")}.`);
  out.push(`QUALITY: mobile responsive, empty/loading/error states, accessibility, SEO meta. First build the landing page, then auth, then ${app.mvp.must.slice(0, 3).join(", ")}. Run/verify after every step. No gold-plating.`);
  out.push("```", "", "### C. Any tool, re-prompt after edits", "");
  out.push("```");
  out.push(`Keep this project's design system and architecture unchanged. Implement the next item from PRD.md's must-haves exactly as scoped; run it; verify; commit.`);
  out.push("```", "", "## 8. Definition of done (before this pack is \"ready\")", "");
  out.push("- [ ] Every field in §1–§6 filled; stack locked; no open decisions left");
  out.push(`- [ ] **Design source of truth locked** (${app.design.source}) — not \"TBD\"; tokens mapped per \`frontend-design.md\``);
  out.push("- [ ] Data model SQL paste-ready; build order numbered and complete");
  out.push(ai ? "- [ ] **AI section present** (PRD has AI features) — rails locked per `ai-logic.md`" : "- [ ] AI section absent — the PRD has no AI features");
  out.push("- [ ] Handoff prompts filled in with the real app details");
  out.push(`- [ ] **Deploy plan locked**: ONE host — ${app.deploy?.host || s.hosting} — mirrored in \`deploy-runbook.md\` (generated by \`deploy-setup.mjs\` at Stage 7)`);
  out.push("- [ ] PRD.md must-haves match the build order 1:1");
  out.push(`- [ ] \`validation.md\` verdict recorded — ${app.validation.verdict} (${app.validation.total}/35)`);
  out.push("- [ ] Nothing in the pack references a tool-specific feature (works in CLI + web builders)");
  return out.join("\n");
}

function sitemap(app) {
  const out = [];
  out.push(`# Sitemap & App Map — ${app.name}`, "");
  out.push(`> Assembled by \`pack-builder.mjs\` from \`pack-plan.json\` · ${today}. **The single source of truth for the whole app** — every route, page, endpoint and workflow. If it's not here, it's not in the MVP.`, "");
  out.push("## 1. Full sitemap (every route in the app)", "");
  out.push("### 1.1 Visual sitemap (Mermaid — renders on GitHub)", "");
  out.push("```mermaid", "graph TD");
  const groups = {};
  for (const r of app.routes) (groups[r.group] = groups[r.group] || []).push(r);
  for (const g of Object.keys(groups)) {
    out.push(`    subgraph ${g.replace(/\s+/g, "_")}["${g}"]`);
    groups[g].forEach((r, i) => out.push(`        R${i}["${r.route} — ${r.purpose.slice(0, 40)}"]`));
    out.push("    end");
  }
  out.push("```", "");
  out.push("### 1.2 Complete route table (every row IS the app)", "");
  out.push(table(app.routes.map((r) => [r.route, r.purpose, r.group, r.auth, r.status]), ["Route", "Page / purpose", "Group", "Auth", "Status"]), "");
  out.push("> Rule: the final app MUST contain exactly these routes — nothing more (scope creep), nothing less (missing screens).", "");
  out.push("---", "", "## 2. Frontend pages — what each page needs", "");
  out.push("Page map → components uses the locked design system (`design-system.md`) component inventory.", "");
  for (const p of app.pages) {
    out.push(`### ${p.name} — \`${p.route}\``, "");
    out.push(table([
      ["**Purpose**", p.purpose],
      ["**Layout**", p.layout],
      ["**Auth level**", p.auth],
      ["**Key components**", p.components],
      ["**Data it reads**", p.data],
      ["**Actions it triggers**", p.actions],
      ["**States to build**", p.states],
      ["**Navigation**", p.navigation],
    ], ["Aspect", "Value"]), "");
  }
  out.push("---", "", "## 3. Backend architecture (this app's, not generic)", "");
  out.push("### 3.1 Folder structure (target — Next.js App Router)", "");
  out.push("```", app.backend.folder.trim(), "```", "");
  out.push("### 3.2 Data model (paste-ready — matches PRD §6)", "");
  if (app.data_model.tables) {
    out.push(table(app.data_model.tables.map((t) => [t.entity, t.fields, t.relations]), ["Entity", "Key fields", "Relations"]), "");
  } else {
    out.push("```sql", app.data_model.sql.trim(), "```", "");
  }
  out.push("Rules: `user_id` FK on every owned table · `created_at` default now() · indexes on `user_id`, `status`, `email` · every user-scoped query filters by `eq(x.userId, session.user.id)`.", "");
  out.push("### 3.3 Backend endpoints & server actions (every one the frontend calls)", "");
  out.push(table(app.backend.endpoints.map((e) => [e.method, e.path, e.purpose, e.auth, e.input]), ["Method", "Path / action", "Purpose", "Auth", "Input (zod)"]), "");
  out.push("### 3.4 Auth flow (this app)", "");
  app.backend.auth_flow.forEach((s, i) => out.push(`${i + 1}. ${s}`));
  if (app.monetized) {
    out.push("", "### 3.5 Payments flow (monetized)", "");
    app.backend.payments_flow.forEach((s, i) => out.push(`${i + 1}. ${s}`));
  }
  out.push("", "### 3.6 Env vars (paste into `.env.example`)", "");
  out.push(table(app.backend.env_vars.map((e) => [e.var, e.example, e.source]), ["Var", "Example", "Where it comes from"]), "");
  out.push("", "---", "", "## 4. Workflows — how users and the system move through the app", "");
  out.push("### 4.1 Core user journeys (step-by-step)", "");
  app.workflows.forEach((w, i) => {
    out.push(`**Journey ${i + 1} — ${w.title}**`, "");
    w.steps.forEach((s, j) => out.push(`${j + 1}. ${s}`));
    out.push("");
  });
  out.push("### 4.2 System workflows (backend, step-by-step)", "");
  app.system_workflows.forEach((w, i) => {
    out.push(`**${w.title}**`, "");
    w.steps.forEach((s, j) => out.push(`${j + 1}. ${s}`));
    out.push("");
  });
  out.push("---", "", "## 5. Definition of done (this file is complete when…)", "");
  out.push("- [ ] §1.2 route table has every route, no placeholders left");
  out.push("- [ ] §2 has one filled page block per route in §1.2");
  out.push("- [ ] §3 backend matches `PRD.md` §6 data model and `stack-blueprint.md` §4–5");
  out.push("- [ ] §4 covers every PRD must-have flow as a numbered journey/system workflow");
  out.push("- [ ] No route, page, table, endpoint, or step appears in the build order (`stack-blueprint.md` §6 / `TODO.md`) that is missing here");
  out.push(app.mode === "existing" ? "- [ ] Existing-project mode: ✅/➕/🆕 markers match `project-scan.md`" : "");
  return out.join("\n").replace(/\n{3,}/g, "\n\n");
}

function todo(app) {
  const byPrio = { P0: [], P1: [], P2: [] };
  const tasks = [];
  app.build_order.forEach((b) => {
    const id = tasks.length + 1;
    tasks.push({ id, prio: b.prio, text: `${b.title} — ref: blueprint §6.${b.step}` });
    byPrio[b.prio].push(id);
  });
  app.extra_ideas.forEach((idea) => {
    const id = tasks.length + 1;
    tasks.push({ id, prio: "P2", text: `${idea} (from the interview)` });
    byPrio.P2.push(id);
  });
  const lines = [
    `# TODO — ${app.name}`, "",
    `> **Confirmed:** NO · by: — · on: —`,
    `> The build may **NOT** start until the user approves this list (SKILL.md Stage 3 gate).`,
    `> Manage: \`node scripts/todo.mjs list | add "task" --p P1 | priority <id> P0 | done <id> | blocked <id> | confirm\``,
    `> Scope: ${app.scope || `MVP for ${app.name}`}`, "",
  ];
  for (const p of ["P0", "P1", "P2"]) {
    lines.push(`## ${p === "P0" ? "P0 — do first" : p === "P1" ? "P1 — important" : "P2 — nice to have"}`);
    if (!byPrio[p].length) lines.push("_none yet_", "");
    else {
      byPrio[p].forEach((id) => {
        const t = tasks[id - 1];
        lines.push(`- [ ] (${t.prio}) #${t.id} ${t.text}`);
      });
      lines.push("");
    }
  }
  lines.push("## Done", "_Completed tasks move here (status `[x]`) — `node scripts/todo.mjs done <id>`._", "");
  lines.push("---", "", "## Task line format (one task per line, agent- and human-readable)", "");
  lines.push("```", "- [ ] (P1) #N Example task — ref: PRD-4", "```", "");
  lines.push("- **Status:** `[ ]` todo · `[~]` doing · `[!]` blocked · `[x]` done", "");
  lines.push("- **Priority:** `(P0)` do first · `(P1)` important · `(P2)` nice to have", "");
  lines.push("- **ID:** `#n` — assigned by `todo.mjs add`, never reused; used by `priority/done/doing/blocked/todo/remove`", "");
  lines.push("- **Reference:** `— ref: PRD-4` links a task to the PRD/blueprint (optional)", "");
  lines.push("", "## How this list works (the contract)", "");
  lines.push("- **The user owns the list.** The agent proposes it; the user **confirms** it (gate), adds tasks, and changes priorities at any time — even mid-build.", "");
  lines.push("- **Priorities:** `P0` = do first (blocks everything else) · `P1` = important · `P2` = nice to have. Order within a group is the suggested build order.", "");
  lines.push("- **Confirm:** the agent runs `node scripts/todo.mjs confirm` only after the user explicitly approves. The build pack (`PRD.md` + `stack-blueprint.md` + `sitemap.md`) and this list are confirmed together — no code before both are approved.", "");
  lines.push("- **Done only when verified:** a task is `done` after it runs and is verified — not when the code is merely written.", "");
  lines.push("- **Script owns the four sections** (`P0/P1/P2/Done`): `todo.mjs` re-sorts tasks into them on every change. Keep prose notes **above the list** or **under the Done section**.", "");
  return lines.join("\n");
}

// ─── write ──────────────────────────────────────────────────────────────────
let wrote = 0;
for (const app of apps) {
  const name = app.name;
  const base = batch ? join("output", "packs", name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")) : opt("out-dir", ".");
  mkdirSync(resolve(base), { recursive: true });
  const files = {
    "PRD.md": prd(app),
    "stack-blueprint.md": blueprint(app),
    "sitemap.md": sitemap(app),
    "TODO.md": todo(app),
  };
  for (const [file, content] of Object.entries(files)) {
    writeFileSync(resolve(base, file), content, "utf8");
    console.log(`  ✅ ${name} → ${base}/${file}`);
    wrote++;
  }
  console.log(`\n${name} pack complete (4 files, ${today}). Present the pack + TODO, then wait for user approval.`);
}

if (batch && apps.length > 1) {
  const index = apps.map((a) => {
    const dir = a.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    return `- **${a.name}** — ${a.one_liner} · verdict ${a.validation?.total || "?"}/35 → ${a.validation?.verdict || "?"} · \`output/packs/${dir}/\``;
  });
  writeFileSync(resolve("output", "packs", "index.md"), `# Batch pack index — ${today}\n\n${index.join("\n")}\n`, "utf8");
  console.log(`\n📦 ${apps.length} packs → output/packs/ + index.md`);
}

console.log(`\n${BRAND_LINE}\n  ✅ pack-builder — ${checkOnly ? "validated" : `${wrote} files written`} (exit 0)\n${BRAND_LINE}`);
process.exit(0);