# Architecture — social-poster

> The HOW. One deployment model; transport + auth flow match it.

## Deployment model (pick ONE)

**Chosen: remote-http** — wraps two cloud APIs (Instagram Graph API, X API v2), one URL serves every client, and OAuth 2.0 redirects work properly (the stdio OAuth trap avoided).

## Stack

- Node + `@modelcontextprotocol/sdk` (generated scaffold), zod for schemas.
- Host: a small Express server (or Cloudflare Worker) exposing `POST /mcp` (JSON-RPC) + `GET /health`.
- Connectors: platform HTTP client SDKs added at integration time (mock mode until then).

## Transport

- Streamable HTTP: `POST /mcp` JSON-RPC, `GET /health`, CORS off (server-to-server clients), TLS only.
- The generated `src/index.mjs` runs stdio for local dev; the remote entry swaps in the streamable-http transport (see `server/README.md`).

## Tool design

- One idea per tool: `post_draft` (approval first), `get_analytics` (read-only), `list_drafts` (read-only).
- `post_draft` returns a **confirmation step** in v1: first call returns `{ pending: true, preview }`; the agent shows the user; a second call with `confirm: true` posts. This enforces the PRD's non-goal without extra tooling.
- Errors are structured content: `{ error, hint }` — e.g. missing token → "run the OAuth flow: {auth_url}".

## Auth flow

- **OAuth 2.0 per platform:** `GET /auth/{platform}` → provider consent → redirect back with code → server exchanges for access + refresh tokens → stored encrypted server-side → used to mint per-call tokens.
- Instagram: Graph API long-lived tokens (60 days, refreshable). X: API v2 OAuth 2.0 with PKCE, offline.access scope.
- **Validation:** every tool checks the platform token exists + is valid before calling upstream — fail fast with a fix hint.

## Error handling

| Case | Behavior |
|---|---|
| Bad params | zod rejects → agent sees the schema error |
| Missing/expired token | structured error + the auth URL hint |
| Instagram/X 4xx/5xx | mapped message + status code |
| Rate limited | `{ error: "rate_limited", retry_after }` — the agent waits and retries |
| Timeout | 10s default, hint to retry |

## Security

- Secrets: client id/secret + refresh tokens server-side only; `.env.example` documents the vars; `.env` gitignored.
- Input validation on every tool (zod); no shell interpolation; media URLs validated to http(s).
- Rate limits respected per platform; a small in-memory queue for posts.
- Remote: TLS only, auth-required endpoints, no secrets in URLs or logs.

## Testing

- **MCP Inspector:** `npx @modelcontextprotocol/inspector` against the dev stdio entry — exercise all 3 tools.
- **Mock mode:** generated handlers echo args — smoke-test wiring.
- **Real integration:** one happy + one error path per tool against sandbox accounts first.
- **Connect test:** `claude mcp add --transport http social-poster https://{host}/mcp` then ask the agent to `list_drafts`.
