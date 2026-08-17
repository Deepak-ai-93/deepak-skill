# IDE/CLI matrix — connecting social-poster

## Remote HTTP (production deployment)

| Client | How to connect |
|---|---|
| **Claude Code** | `claude mcp add --transport http social-poster https://{host}/mcp` |
| **Cursor** | `.cursor/mcp.json`: `{"mcpServers": {"social-poster": {"url": "https://{host}/mcp"}}}` |
| **Codex CLI** | `~/.codex/config.toml`: `[mcp_servers.social-poster]` `command = "npx"` `args = ["mcp-remote", "https://{host}/mcp"]` |
| **Gemini CLI** | `gemini mcp add social-poster -- https://{host}/mcp` (remote servers via the CLI's MCP config) |

## Local dev (stdio, mock mode — no credentials needed)

| Client | How to connect |
|---|---|
| **Claude Code** | `claude mcp add --transport stdio social-poster -- node src/index.mjs` (from `server/`) |
| **Cursor** | add `server/config/cursor-mcp.json` to `.cursor/mcp.json` |
| **Codex CLI** | add `server/config/codex-config.toml` to `~/.codex/config.toml` |
| **OpenCode** | add `server/config/opencode.json` to `opencode.json` |

## First run

```bash
cd server && npm install && npm start          # stdio mock server
# then in Claude Code:
claude mcp add --transport stdio social-poster -- node src/index.mjs
# ask the agent: "list_drafts" → "post this draft to x"
```

## Troubleshooting

| Symptom | Fix |
|---|---|
| "Server disconnected" | Run `node src/index.mjs` in a terminal — read the stderr line |
| Token error on a real call | Run the OAuth flow once: `GET https://{host}/auth/instagram` in a browser |
| Rate limited | Wait `retry_after`, or reduce analytics polling frequency |
| Tool missing in the client | Verify the exact name; `claude mcp list` / client MCP panel; restart after config edits |
