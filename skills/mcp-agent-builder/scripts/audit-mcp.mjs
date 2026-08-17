#!/usr/bin/env node
// mcp-agent-builder — the automated audit half of the mcp-auditor gate.
// Scans an MCP pack (mcp-prd.md, mcp-architecture.md, mcp-plan.json, server/,
// agent-design.md, ide-cli-matrix.md) and checks everything a script can:
// PRD sections (problem/users/features/auth/non-goals/metrics), architecture
// sections (deployment model/transport/auth flow/error handling/security/
// testing), the scaffold (SDK dep, a handler per plan tool, README connect
// steps, .env.example, no real secrets), agent-design (system prompt/tool
// wiring/guardrails), and the IDE/CLI matrix (≥ 3 clients). Writes mcp-audit.md
// with automated verdicts + an AUDITOR section. Exit 1 on any FAIL.
//
// Usage:
//   node audit-mcp.mjs --pack <mcp-folder> [--out mcp-audit.md]
//
// Exit codes: 0 = clean, 1 = FAIL, 2 = usage error.
import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { resolve, basename, join } from "node:path";

// ─── brand banner (deepak-skill · crafted by Deepak) ────────────────────────
const BRAND_LINE = "═".repeat(56);
const banner = (label) =>
  `\n${BRAND_LINE}\n  🎬 deepak-skill — crafted by Deepak\n  skill: mcp-agent-builder · ${label}\n${BRAND_LINE}\n`;
console.log(banner("audit-mcp.mjs"));

// --- tiny arg parser (same style as the other skill scripts) ----------------
const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const needle = `--${name}`;
  const found = args.find((a) => a === needle || a.startsWith(`${needle}=`));
  if (found === undefined) return fallback;
  const eq = found.indexOf("=");
  return eq !== -1 ? found.slice(eq + 1) : args[args.indexOf(found) + 1];
};

const packArg = opt("pack");
if (!packArg) {
  console.error("Usage: node audit-mcp.mjs --pack <mcp-folder> [--out mcp-audit.md]");
  process.exit(2);
}
const packDir = resolve(process.cwd(), packArg);
const outPath = resolve(process.cwd(), opt("out", "mcp-audit.md"));
if (!existsSync(packDir)) {
  console.error(`❌ MCP pack folder not found: ${packDir}`);
  console.error("   Pass the pack folder (mcp-prd.md + mcp-architecture.md + server/ + agent-design.md + ide-cli-matrix.md)");
  process.exit(2);
}

const results = [];
const add = (status, check, detail) => results.push({ status, check, detail });
const read = (f) => (existsSync(join(packDir, f)) ? readFileSync(join(packDir, f), "utf8") : null);
const readIn = (rel) => (existsSync(join(packDir, rel)) ? readFileSync(join(packDir, rel), "utf8") : null);

// ─── PRD ────────────────────────────────────────────────────────────────────
const prd = read("mcp-prd.md");
if (!prd) {
  add("FAIL", "mcp-prd.md exists", "missing — the PRD locks the WHAT before anything is built");
} else {
  const has = (re) => new RegExp(re, "mi").test(prd);
  const need = [
    [/^## .*problem/mi, "problem"],
    [/^## .*user/mi, "users"],
    [/^## .*(feature|tool|resource|prompt)/mi, "features"],
    [/^## .*auth/mi, "auth + compliance"],
    [/^## .*non-goal/mi, "non-goals"],
    [/^## .*metric/mi, "success metrics"],
  ];
  const missing = need.filter(([re]) => !has(re)).map(([, label]) => label);
  if (!missing.length) add("PASS", "PRD sections", "problem · users · features · auth · non-goals · metrics all present");
  else add("FAIL", "PRD sections", `missing: ${missing.join(", ")}`);
}

// ─── Architecture ───────────────────────────────────────────────────────────
const arch = read("mcp-architecture.md");
if (!arch) {
  add("FAIL", "mcp-architecture.md exists", "missing — the architecture locks the HOW");
} else {
  const has = (re) => new RegExp(re, "mi").test(arch);
  const need = [
    [/deployment model/i, "deployment model"],
    [/transport/i, "transport"],
    [/auth flow/i, "auth flow"],
    [/error handling/i, "error handling"],
    [/security/i, "security"],
    [/test/i, "testing"],
  ];
  const missing = need.filter(([re]) => !has(re)).map(([, label]) => label);
  if (!missing.length) add("PASS", "architecture sections", "deployment · transport · auth flow · error handling · security · testing all present");
  else add("FAIL", "architecture sections", `missing: ${missing.join(", ")}`);
}

// ─── Scaffold ───────────────────────────────────────────────────────────────
const pkg = readIn("server/package.json");
if (!pkg) {
  add("FAIL", "server/package.json exists", "missing — run scaffold-server.mjs");
} else {
  if (pkg.includes("@modelcontextprotocol/sdk")) add("PASS", "SDK dependency", "@modelcontextprotocol/sdk in package.json");
  else add("FAIL", "SDK dependency", "no @modelcontextprotocol/sdk dependency — the server won't run");
  if (/"start"\s*:\s*"node src\/index\.mjs"/.test(pkg)) add("PASS", "start script", "npm start present");
  else add("WARN", "start script", "no npm start script");
}

const index = readIn("server/src/index.mjs");
const plan = read("mcp-plan.json");
if (!index) {
  add("FAIL", "server/src/index.mjs exists", "missing — the server entry point is the deliverable");
} else {
  const handlers = (index.match(/server\.tool\(/g) || []).length;
  if (plan) {
    let planTools = 0;
    try { planTools = (JSON.parse(plan).tools || []).length; } catch { planTools = 0; }
    if (handlers >= 1) add("PASS", "tool handlers", `${handlers} server.tool() call(s)`);
    else add("FAIL", "tool handlers", "no server.tool() calls — the server exposes nothing");
    if (handlers >= planTools) add("PASS", "handler ↔ plan coverage", `${handlers} handlers ≥ ${planTools} plan tools`);
    else add("WARN", "handler ↔ plan coverage", `${handlers} handlers < ${planTools} plan tools — rebuild with scaffold-server.mjs`);
  } else {
    if (handlers >= 1) add("PASS", "tool handlers", `${handlers} server.tool() call(s) (no mcp-plan.json to cross-check)`);
    else add("FAIL", "tool handlers", "no server.tool() calls");
  }
  if (/McpServer/.test(index) && /StdioServerTransport/.test(index)) add("PASS", "server bootstrap", "McpServer + StdioServerTransport wired");
  else add("FAIL", "server bootstrap", "missing McpServer or transport wiring");
}

const serverReadme = readIn("server/README.md");
if (serverReadme && /claude mcp add|mcp\.json|mcpServers|gemini mcp|mcp_servers/.test(serverReadme)) add("PASS", "connect steps", "README documents how to connect a client");
else add("WARN", "connect steps", "server/README.md missing connect instructions");

const envExample = readIn("server/.env.example");
const envReal = readIn("server/.env");
if (envExample) add("PASS", ".env.example present", "auth vars documented without values");
else add("WARN", ".env.example present", "no .env.example — add one (auth vars, never values)");
if (envReal) add("FAIL", "no real secrets", ".env committed — secrets must never ship; add .env to .gitignore");
else add("PASS", "no real secrets", "no .env committed");

// ─── Agent wiring + IDE matrix ─────────────────────────────────────────────
const agent = read("agent-design.md");
if (!agent) {
  add("FAIL", "agent-design.md exists", "missing — the agent wiring ships with the server");
} else {
  const has = (re) => new RegExp(re, "mi").test(agent);
  const missing = [
    [/system prompt/i, "system prompt"],
    [/tool wiring|tool use|when to call/i, "tool wiring"],
    [/guardrail|never|secrets/i, "guardrails"],
  ].filter(([re]) => !has(re)).map(([, label]) => label);
  if (!missing.length) add("PASS", "agent-design sections", "system prompt · tool wiring · guardrails present");
  else add("FAIL", "agent-design sections", `missing: ${missing.join(", ")}`);
}

const matrix = read("ide-cli-matrix.md");
if (!matrix) {
  add("FAIL", "ide-cli-matrix.md exists", "missing — the connect matrix ships with the pack");
} else {
  const clients = ["claude mcp add", "cursor", "codex", "gemini", "opencode", "cline", "windsurf", "zed", "continue", "vscode"].filter((c) => matrix.toLowerCase().includes(c));
  if (clients.length >= 3) add("PASS", "IDE/CLI coverage", `${clients.length} clients covered: ${clients.join(", ")}`);
  else add("FAIL", "IDE/CLI coverage", `only ${clients.length} client(s) — need ≥ 3`);
}

// ─── write mcp-audit.md ─────────────────────────────────────────────────────
const fails = results.filter((r) => r.status === "FAIL");
const warns = results.filter((r) => r.status === "WARN");
const passes = results.filter((r) => r.status === "PASS");

const L = [];
L.push(`# MCP Pack Audit — ${basename(packDir)}`);
L.push("");
L.push(`**Automated checks (${new Date().toISOString().slice(0, 10)}):** ${passes.length} PASS · ${warns.length} WARN · ${fails.length} FAIL · **automated verdict:** ${fails.length ? "FIX NEEDED" : "PASS (pending auditor)"}`);
L.push("");
L.push("## 1. Automated results");
L.push("");
L.push("| Status | Check | Detail |");
L.push("|---|---|---|");
for (const r of results) L.push(`| ${r.status} | ${r.check} | ${r.detail} |`);
L.push("");
L.push("## 2. Auditor section — COMPLETE THIS (subagent, fresh eyes)");
L.push("");
L.push("### 2.1 MCP-pack scorecard (rate 1–5 each, /50 — a pack worth shipping scores ≥ 35)");
L.push("");
L.push("| Criterion | Ask | Score /5 |");
L.push("|---|---|---|");
L.push("| **Discovery depth** | Is the discovery doc specific (real connectors, real users, real auth)? | |");
L.push("| **PRD quality** | Do the tools read like real capabilities an agent would use (good names + descriptions)? | |");
L.push("| **Architecture fit** | Does the deployment model + transport + auth flow hang together? | |");
L.push("| **Scaffold runnability** | Would `npm install && npm start` work; are the TODO handlers clear? | |");
L.push("| **Auth soundness** | Is the credential flow realistic (storage, refresh, scopes) and secret-safe? | |");
L.push("| **Agent wiring** | Would the system prompt actually make an agent use the tools well? | |");
L.push("| **IDE matrix accuracy** | Are the connect commands correct for the clients covered? | |");
L.push("| **Non-goals** | Is scope control explicit — no silent feature creep? | |");
L.push("| **Error handling** | Do tool failures return structured results, not crashes? | |");
L.push("| **Ship-readiness** | Could a user run and connect this server today? | |");
L.push("");
L.push("### 2.2 Creative judgment calls");
L.push("");
L.push("- Any tool that's too vague for an agent to call correctly (name/description)?");
L.push("- Would the auth flow break in the deployment model chosen (e.g. OAuth redirect on stdio)?");
L.push("- Is the scaffold missing anything the PRD promised?");
L.push("");
L.push("### 2.3 Verdict");
L.push("");
L.push("- All PASS and scorecard ≥ 35 → mark **PASS** and sign below.");
L.push("- Any FAIL (or a WARN you judge real) → mark **FIX NEEDED** and list per-file fixes.");
L.push("");
L.push(`> Auditor verdict: **PENDING** · Auditor: _(subagent)_ · Date: ${new Date().toISOString().slice(0, 10)}`);
L.push("");

writeFileSync(outPath, L.join("\n"), "utf8");

console.log(`✅ mcp-audit.md → ${basename(outPath)} (${passes.length} PASS · ${warns.length} WARN · ${fails.length} FAIL)`);
for (const r of results.filter((r) => r.status !== "PASS")) {
  console.log(`   ${r.status === "FAIL" ? "❌" : "⚠️"} ${r.check}: ${r.detail}`);
}
if (fails.length) {
  console.error(`❌ ${fails.length} automated FAIL(s) — fix and re-run before spawning the mcp-auditor.`);
  process.exit(1);
}
console.log("Automated checks clean — now spawn the mcp-auditor subagent (see SKILL.md Stage 7 / templates/mcp-auditor-brief.md) to complete the scorecard + verdict in mcp-audit.md.");
process.exit(0);
