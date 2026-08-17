# social-poster — MCP server

Post content drafts and pull engagement analytics for Instagram and X from any agent

**Deployment model:** remote-http · **Auth:** oauth2 (instagram-graph-api + x-api-v2)

## Run

```bash
npm install
npm start        # stdio server — connect an MCP client (below)
```

Test interactively with the MCP Inspector:

```bash
npx @modelcontextprotocol/inspector
```

## Connect

| Client | How |
|---|---|
| **Claude Code** | `claude mcp add --transport stdio social-poster -- node src/index.mjs` (from this folder) |
| **Cursor** | add `config/cursor-mcp.json` contents to `.cursor/mcp.json` |
| **Codex CLI** | add `config/codex-config.toml` contents to `~/.codex/config.toml` |
| **Gemini CLI** | `gemini mcp add social-poster -- node src/index.mjs` (see `config/gemini-cli.md`) |
| **OpenCode** | add `config/opencode.json` contents to `opencode.json` |

See `ide-cli-matrix.md` in the pack for the full matrix + troubleshooting.

## Auth

Copy `.env.example` to `.env` and fill the values. The server reads them at startup — never commit real values.

```
SOCIAL_POSTER_CLIENT_ID=
SOCIAL_POSTER_CLIENT_SECRET=
SOCIAL_POSTER_TOKEN=
```

## Tools

- `post_draft` — Post an approved content draft to a connected platform (instagram or x); requires user confirmation before posting
- `get_analytics` — Fetch engagement metrics (impressions, likes, replies) for a post or account-level summary on a platform
- `list_drafts` — List the pending content drafts available for posting
