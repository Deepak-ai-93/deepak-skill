# IDE/CLI matrix — connecting {server name}

> Copy this template → `ide-cli-matrix.md`. Cover every client the user named (≥ 3). Keep the commands exact — this is the "will it actually work for me" page.

## Local stdio server (default)

Assume `node src/index.mjs` run from the server folder.

| Client | How to connect | Verify / remove |
|---|---|---|
| **Claude Code** | `claude mcp add --transport stdio {name} -- node src/index.mjs` | `claude mcp list` / `claude mcp remove {name}` |
| **Cursor** | add to `.cursor/mcp.json` (or `~/.cursor/mcp.json`): `{"mcpServers": {"{name}": {"command": "node", "args": ["src/index.mjs"]}}}` | Settings → MCP |
| **Codex CLI** | add to `~/.codex/config.toml`: `[mcp_servers.{name}]` `command = "node"` `args = ["src/index.mjs"]` | `codex mcp` |
| **Gemini CLI** | `gemini mcp add {name} -- node src/index.mjs` | `gemini mcp list` / `gemini mcp remove {name}` |
| **OpenCode** | add to `opencode.json`: `{"mcp": {"{name}": {"type": "local", "command": ["node", "src/index.mjs"], "enabled": true}}}` | `/mcp` in chat |
| **Cline** | add to `cline_mcp_settings.json` (`mcpServers.{name}` with `command`/`args`) | Cline settings → MCP |
| **Windsurf** | `~/.codeium/windsurf/mcp_config.json` (`mcpServers.{name}`) | Windsurf MCP panel |
| **VS Code** | workspace `.vscode/mcp.json` (`servers.{name}`) or `/mcp` command | MCP panel |
| **Zed** | `~/.config/zed/settings.json` → `"mcp": {"{name}": {"command": "node", "args": ["src/index.mjs"]}}` | `/mcp` in assistant |

## Remote HTTP server

| Client | How to connect |
|---|---|
| **Claude Code** | `claude mcp add --transport http {name} https://{host}/mcp` |
| **Cursor** | `.cursor/mcp.json`: `{"mcpServers": {"{name}": {"url": "https://{host}/mcp"}}}` |
| **Codex CLI** | `~/.codex/config.toml`: `[mcp_servers.{name}]` `command = "npx"` `args = ["mcp-remote", "https://{host}/mcp"]` |

## Troubleshooting

| Symptom | Fix |
|---|---|
| "Server disconnected" on start | Run `node src/index.mjs` in a terminal — read the stderr line |
| Tool not listed in the client | Re-check the exact name; `claude mcp list` / client MCP panel |
| Credential error | `.env` missing the var — see README § Auth |
| Cursor/Codex stale config | Restart the client after editing the JSON |
