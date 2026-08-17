# PRD — social-poster

> The WHAT. Every tool listed here is the contract — anything not listed is out of scope.

## Problem

A creator manages Instagram and X posts in their chat agent. Today the agent writes great drafts but can't post them or read back the numbers — the creator copy-pastes drafts into the apps and screenshots analytics. An MCP server that exposes "post an approved draft" and "get engagement analytics" closes the loop: the agent drafts, the user approves, the server posts, the agent reports results.

## Users

- A solo creator (or small team) who does content in Claude Code / Cursor / Codex / Gemini CLI and wants posting + analytics without leaving the terminal.

## Features (the tool surface)

### Tools (actions the agent can call)

| Tool | Description | Params |
|---|---|---|
| `post_draft` | Post an approved content draft to a connected platform (instagram or x); requires user confirmation before posting | `platform: string` (instagram/x) · `text: string` (copy, ≤ 280 for x) · `media_url: string?` (optional image/video) |
| `get_analytics` | Fetch engagement metrics (impressions, likes, replies) for a post or account-level summary on a platform | `platform: string` · `post_id: string?` (omit for account summary) |
| `list_drafts` | List the pending content drafts available for posting | — |

### Resources (data the agent can read)

| Resource | URI scheme | Data |
|---|---|---|
| drafts | `social://drafts` | pending drafts with id, platform, text, status |

### Prompts (reusable instruction templates)

| Prompt | When the agent offers it |
|---|---|
| `weekly-report` | when the user asks "how did this week go" — pulls analytics and formats a summary |

## Auth + compliance

- **Credential flow:** OAuth 2.0 per platform (Instagram Graph API + X API v2). Server exchanges the code, stores refresh tokens server-side (remote-http deployment — redirects work).
- **Storage:** tokens in server-side storage (env-configured, encrypted at rest), never in client config, never in logs.
- **Data handled:** post text, media URLs, engagement counts. No DMs, no follower PII beyond public counts.
- **Rate limits:** respect Instagram (200 calls/hour standard) + X (per-app tier limits); server queues + throttles.

## Non-goals (scope control)

- **No posting without user confirmation** — `post_draft` returns a confirmation step first (v1).
- **No scheduling, no comment replies, no DM automation** in v1.
- **No multi-user auth / org permissions** — single-owner tokens.

## Success metrics

- An agent completes "post this draft to Instagram" with one approval, end-to-end.
- `get_analytics` returns a usable summary in ≤ 2 tool calls.
- A new user connects the server and posts once in ≤ 10 minutes.
