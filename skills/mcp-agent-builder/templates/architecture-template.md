# Architecture — {server name}

> Copy this template → `mcp-architecture.md`. The HOW. Lock ONE deployment model; transport + auth flow must match it.

## Deployment model (pick ONE)

| Model | When | Transport | Run by |
|---|---|---|---|
| **stdio** | local IDE/CLI, touches the user's machine (files, localhost) | stdio | `npm start` |
| **remote-http** | wraps a cloud API, one URL for everyone, OAuth redirects work | Streamable HTTP | host (Cloudflare Workers / Express / FastMCP) |
| **mcpb** | distribute a local server as an installable bundle (no Node/Python for the user) | stdio (packaged) | `.mcpb` archive |

**Chosen:** {stdio / remote-http / mcpb} — {one-line why, from discovery}

## Stack

- **Default:** Node + `@modelcontextprotocol/sdk` (generated scaffold). **Alternative:** Python + FastMCP (same protocol). {language chosen}
- **Deps:** SDK + zod (Node) — nothing else at runtime unless the connector needs a client SDK.

## Transport

- {stdio (`StdioServerTransport`) or streamable HTTP (`streamableHttp` + Express) — MUST match the deployment model.}
- {Remote: expose `POST /mcp` (JSON-RPC), health endpoint, CORS if browser clients.}

## Tool design

- **One idea per tool** — a tool that does two things becomes two tools.
- **Descriptions ≥ 20 chars**, written for an agent: *when* to call, *what* it returns.
- **Params via zod schemas** — typed, optional where safe, described.
- **Errors are structured content, never crashes:** return `{ content: [{ type: "text", text: JSON.stringify({ error, hint }) }] }` — the agent reads the hint and retries.

## Auth flow

- **none:** no credential handling.
- **API key:** read from `.env` at startup (`{NAME}_API_KEY`); send in the upstream header; never log it.
- **OAuth 2.0:** {remote-http only for redirect flows — where the token is stored, refresh strategy, scopes. For stdio, use device-code/CLI flow or a stored long-lived token.}
- **Validation:** every tool validates the credential exists before calling upstream (fail fast with a hint).

## Error handling

| Case | Behavior |
|---|---|
| Bad params | zod rejects → agent sees the schema error |
| Missing/expired credential | structured error with a fix hint ("set {VAR} in .env") |
| Upstream 4xx/5xx | map to a readable message + the status code |
| Timeout | configurable, default 10s, hint to retry |

## Security

- Secrets only in `.env` / env vars — `.gitignore` `.env`; ship `.env.example` with placeholders.
- Validate + bound all inputs (types, lengths); no shell interpolation of user input.
- Rate-limit upstream calls (respect the provider's quota).
- Remote: TLS only, no secrets in URLs, minimal CORS, auth on the endpoint if it exposes private data.

## Testing

- **MCP Inspector:** `npx @modelcontextprotocol/inspector` — exercise every tool.
- **Mock mode:** generated handlers echo args — smoke-test the wiring before the real connector.
- **Real integration:** one happy-path + one error-path per tool with the real upstream.
- **Connect test:** add to the real client (`claude mcp add …` then ask the agent to call a tool).
