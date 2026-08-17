# PRD — {server name}

> Copy this template → `mcp-prd.md`. The WHAT. Every tool, resource, or prompt listed here is the contract — anything not listed is out of scope.

## Problem

{One paragraph: the trigger scenario — "a user asks an agent to {task}; today the agent can't because {gap}.}"

## Users

- {Who — e.g. "a solo founder who wants their agent to post drafts to Instagram"}

## Features (the tool surface)

Every capability is one of:

### Tools (actions the agent can call)

| Tool | Description (≥ 20 chars — agents match on this) | Params |
|---|---|---|
| `{tool_name}` | {what it does, when to call it, what it returns} | `{param}: {type} — {describe}` |

### Resources (data the agent can read)

| Resource | URI scheme | Data |
|---|---|---|
| `{resource}` | `{scheme}://{…}` | {what it exposes} |

### Prompts (reusable instruction templates)

| Prompt | When the agent offers it |
|---|---|
| `{prompt_name}` | {e.g. "when the user wants a weekly {x} report"} |

## Auth + compliance

- **Credential flow:** {API key / OAuth 2.0 — where the secret lives, who provides it}
- **Storage:** {`.env` only, never committed}
- **Data handled:** {what the server reads/writes, retention, PII notes}
- **Rate limits / quotas:** {upstream limits the server must respect}

## Non-goals (scope control)

- {Explicitly NOT: e.g. "no direct posting without approval", "no multi-user auth in v1"}

## Success metrics

- {Measurable: e.g. "an agent completes '{task}' end-to-end without human help", "≤ 2 tool calls per common task", "server starts + connects in ≤ 5 min for a new user"}
