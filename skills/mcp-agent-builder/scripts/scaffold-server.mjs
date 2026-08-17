#!/usr/bin/env node
// mcp-agent-builder — generate a runnable MCP server scaffold from a plan JSON.
// Validates the plan (name, description, deployment model, auth mode, ≥ 1 tool
// with a name + description, param types) and writes a real
// @modelcontextprotocol/sdk server: package.json, src/index.mjs (one handler
// per plan tool, mock mode), README.md with run + per-IDE connect steps,
// config/ snippets, and a .env.example (never real secrets). Exits 1 on FAIL.
//
// Usage:
//   node scaffold-server.mjs --plan mcp-plan.json [--out server]
//
// Exit codes: 0 = scaffolded, 1 = plan FAIL, 2 = usage error.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, join } from "node:path";

// ─── brand banner (deepak-skill · crafted by Deepak) ────────────────────────
const BRAND_LINE = "═".repeat(56);
const banner = (label) =>
  `\n${BRAND_LINE}\n  🎬 deepak-skill — crafted by Deepak\n  skill: mcp-agent-builder · ${label}\n${BRAND_LINE}\n`;
console.log(banner("scaffold-server.mjs"));

// --- tiny arg parser (same style as the other skill scripts) ----------------
const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const needle = `--${name}`;
  const found = args.find((a) => a === needle || a.startsWith(`${needle}=`));
  if (found === undefined) return fallback;
  const eq = found.indexOf("=");
  return eq !== -1 ? found.slice(eq + 1) : args[args.indexOf(found) + 1];
};

const DEPLOYMENTS = ["stdio", "remote-http", "mcpb"];
const AUTH_MODES = ["none", "api-key", "oauth2"];
const PARAM_TYPES = ["string", "number", "boolean"];

const planPath = opt("plan");
const outDir = resolve(opt("out", "server"));
if (!planPath) {
  console.error("Usage: node scaffold-server.mjs --plan mcp-plan.json [--out server]");
  process.exit(2);
}

let plan;
try {
  plan = JSON.parse(readFileSync(resolve(planPath), "utf8"));
} catch (e) {
  console.error(`❌ Cannot read plan ${planPath}: ${e.message}`);
  process.exit(1);
}

const fails = [];
const check = (ok, label, detail) => { if (!ok) fails.push(`${label} — ${detail}`); };

const name = (plan.name || "").trim();
const version = (plan.version || "0.1.0").trim();
const description = (plan.description || "").trim();
const deployment = (plan.deployment || "stdio").trim();
const auth = plan.auth || {};
const authMode = (auth.mode || "none").trim();
const tools = Array.isArray(plan.tools) ? plan.tools : [];

check(/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name), "name", `"${name}" — must be kebab-case (e.g. social-poster)`);
check(description, "description", "plan.description missing");
check(DEPLOYMENTS.includes(deployment), "deployment", `"${deployment}" not in ${DEPLOYMENTS.join(" / ")}`);
check(AUTH_MODES.includes(authMode), "auth mode", `"${authMode}" not in ${AUTH_MODES.join(" / ")}`);
check(tools.length >= 1, "tools", "plan.tools needs ≥ 1 tool");

tools.forEach((t, i) => {
  const tn = (t.name || "").trim();
  const td = (t.description || "").trim();
  check(/^[a-z0-9_]+$/.test(tn), `tool ${i + 1}`, `name "${tn}" — must be snake_case (e.g. post_content)`);
  check(td.length >= 20, `tool ${i + 1}`, `description "${td}" — too short (< 20 chars); the agent matches on this`);
  for (const p of t.params || []) {
    if (!PARAM_TYPES.includes(p.type)) fails.push(`tool "${tn}" — param "${p.name}" type "${p.type}" not in ${PARAM_TYPES.join("/")}`);
  }
});

if (fails.length) {
  console.error(`❌ MCP plan FAIL (${fails.length}):`);
  for (const f of fails) console.error(`   - ${f}`);
  console.error("Fix mcp-plan.json and re-run — nothing was written.");
  process.exit(1);
}

mkdirSync(join(outDir, "src"), { recursive: true });
mkdirSync(join(outDir, "config"), { recursive: true });

// --- package.json -----------------------------------------------------------
writeFileSync(
  join(outDir, "package.json"),
  JSON.stringify(
    {
      name,
      version,
      private: true,
      type: "module",
      description,
      scripts: { start: "node src/index.mjs" },
      dependencies: {
        "@modelcontextprotocol/sdk": "^1.12.0",
        zod: "^3.24.0",
      },
    },
    null,
    2
  ),
  "utf8"
);

// --- src/index.mjs -----------------------------------------------------------
const zod = (type) => (type === "string" ? "z.string()" : type === "number" ? "z.number()" : "z.boolean()");
const toolBlocks = tools
  .map((t, i) => {
    const params = (t.params || []).map((p) => `    ${p.name}: ${zod(p.type)}.describe("${p.describe || p.name}"),`).join("\n");
    const schema = (t.params || []).length
      ? `  {\n${params}\n  },`
      : "  {}, // no params";
    return `// Tool ${i + 1}: ${t.name} — ${t.description}\nserver.tool(\n  "${t.name}",\n  "${t.description}",\n${schema}\n  async (args) => {\n    // TODO: implement the real handler — call the upstream API / read the resource\n    // (see mcp-architecture.md § error handling for the structured-error contract).\n    // Mock mode: echo the args back so the server runs end-to-end before integration.\n    return { content: [{ type: "text", text: JSON.stringify(args, null, 2) }] };\n  }\n);`;
  })
  .join("\n\n");

const indexSrc = `// ${name} — MCP server (generated by scaffold-server.mjs from mcp-plan.json)\n// Run: npm install && npm start   ·   Test: npx @modelcontextprotocol/inspector\nimport { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";\nimport { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";\nimport { z } from "zod";\n\nconst server = new McpServer({\n  name: "${name}",\n  version: "${version}",\n});\n\n${toolBlocks}\n\n// stdio transport (deployment model: ${deployment})\n// For Remote Streamable HTTP, swap in the streamableHttp transport — see\n// mcp-architecture.md § transport (and the config/ snippets for remote URLs).\nconst transport = new StdioServerTransport();\nawait server.connect(transport);\nconsole.error("${name} MCP server running over stdio (v${version})");\n`;
writeFileSync(join(outDir, "src", "index.mjs"), indexSrc, "utf8");

// --- README.md --------------------------------------------------------------
const envVars = authMode === "api-key" ? `${name.toUpperCase().replaceAll("-", "_")}_API_KEY=your_key_here` : authMode === "oauth2" ? `${name.toUpperCase().replaceAll("-", "_")}_CLIENT_ID=\n${name.toUpperCase().replaceAll("-", "_")}_CLIENT_SECRET=\n${name.toUpperCase().replaceAll("-", "_")}_TOKEN=` : `# no auth configured for ${name}`;
const readme = `# ${name} — MCP server\n\n${description}\n\n**Deployment model:** ${deployment} · **Auth:** ${authMode}${auth.provider ? ` (${auth.provider})` : ""}\n\n## Run\n\n\`\`\`bash\nnpm install\nnpm start        # stdio server — connect an MCP client (below)\n\`\`\`\n\nTest interactively with the MCP Inspector:\n\n\`\`\`bash\nnpx @modelcontextprotocol/inspector\n\`\`\`\n\n## Connect\n\n| Client | How |\n|---|---|\n| **Claude Code** | \`claude mcp add --transport stdio ${name} -- node src/index.mjs\` (from this folder) |\n| **Cursor** | add \`config/cursor-mcp.json\` contents to \`.cursor/mcp.json\` |\n| **Codex CLI** | add \`config/codex-config.toml\` contents to \`~/.codex/config.toml\` |\n| **Gemini CLI** | \`gemini mcp add ${name} -- node src/index.mjs\` (see \`config/gemini-cli.md\`) |\n| **OpenCode** | add \`config/opencode.json\` contents to \`opencode.json\` |\n\nSee \`ide-cli-matrix.md\` in the pack for the full matrix + troubleshooting.\n\n## Auth\n\nCopy \`.env.example\` to \`.env\` and fill the values. The server reads them at startup — never commit real values.\n\n\`\`\`\n${envVars}\n\`\`\`\n\n## Tools\n\n${tools.map((t) => `- \`${t.name}\` — ${t.description}`).join("\n")}\n`;
writeFileSync(join(outDir, "README.md"), readme, "utf8");

// --- config/ snippets --------------------------------------------------------
writeFileSync(
  join(outDir, "config", "claude-mcp-add.sh"),
  `#!/usr/bin/env bash\n# Claude Code — connect this server (run from this server folder)\nclaude mcp add --transport stdio ${name} -- node src/index.mjs\n# verify: claude mcp list\n`,
  "utf8"
);
writeFileSync(
  join(outDir, "config", "cursor-mcp.json"),
  JSON.stringify(
    { mcpServers: { [name]: { command: "node", args: ["src/index.mjs"], cwd: process.cwd() } } },
    null,
    2
  ),
  "utf8"
);
writeFileSync(
  join(outDir, "config", "codex-config.toml"),
  `[mcp_servers.${name}]\ncommand = "node"\nargs = ["src/index.mjs"]\n# cwd = "${process.cwd()}"  # set to this server folder\n`,
  "utf8"
);
writeFileSync(
  join(outDir, "config", "gemini-cli.md"),
  `# Gemini CLI — connect ${name}\n\ngemini mcp add ${name} -- node src/index.mjs\n# verify: gemini mcp list   ·   remove: gemini mcp remove ${name}\n`,
  "utf8"
);
writeFileSync(
  join(outDir, "config", "opencode.json"),
  JSON.stringify({ mcp: { [name]: { type: "local", command: ["node", "src/index.mjs"], enabled: true } } }, null, 2),
  "utf8"
);

// --- .env.example ------------------------------------------------------------
writeFileSync(join(outDir, ".env.example"), `${envVars}\n`, "utf8");

console.log(`✅ MCP server scaffolded → ${outDir}/`);
console.log(`   package.json · src/index.mjs (${tools.length} tool(s)) · README.md · config/ (5 snippets) · .env.example`);
console.log("Next: fill the TODO handlers, connect per README/ide-cli-matrix, then run audit-mcp.mjs before delivery.");
process.exit(0);
