# Agent design — {server name}

> Copy this template → `agent-design.md`. The wiring that turns the server into an agent capability — what the agent knows, when it calls what, and the guardrails.

## System prompt (add to the agent's context)

```
You have access to the {name} MCP server.

Capabilities:
- {tool}: {one-line when to use it}
- {tool}: {one-line when to use it}

Rules:
- Call {primary_tool} when the user asks to {task}.
- Read the tool result before deciding the next step; retry once with the hint if it returns an error.
- Never send secrets, tokens, or credentials through tool params.
- {destructive tool}: confirm with the user before calling.
- If a tool fails with a credential hint, tell the user what to set, don't guess.
```

## Tool wiring (call patterns)

| Trigger | Call | Then |
|---|---|---|
| "post {draft}" | `{tool}` with {params} | read result → confirm success / surface the error hint |
| "{question needing data}" | `{resource/tool}` | format the returned data for the user |
| "{multi-step task}" | `{tool A}` → `{tool B}` | chain results; stop and ask if a step fails twice |

## Guardrails

- **Secrets:** credentials live in `.env`, never in prompts, tool args, or logs.
- **Destructive actions:** {posting / deleting / writing} requires explicit user confirmation.
- **Rate limits:** no loops that hammer a tool; respect the server's upstream quota.
- **Scope:** the agent stays inside the PRD's tool surface — no improvisation of "similar" tools.
