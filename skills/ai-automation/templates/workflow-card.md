# Workflow card — the per-step decision card (reference for Stage 3)

Use one card per step while designing; the finished cards become the `## Workflow steps` section.

## The card

```
Step: {name}
┌─────────────────────────────────────────────┐
│ Tool/agent:   {tool or skill}               │
│ Input:        {exact data in}               │
│ Output:       {exact data out}              │
│ Human?        {yes/no}                      │
│  → why:       {irreversible / judgment / cost} │
│ On failure:   {retry | alert | stop}        │
└─────────────────────────────────────────────┘
```

## Tool choice (which skill runs the step)

| The step needs… | Use |
|---|---|
| A server that other tools call (API, MCP) | `mcp-agent-builder` |
| A UI, a scheduler/cron, or a web app | `vibe-code-webapp` |
| A repeatable, voice-tuned prompt | `prompt-engineering` |
| A human decision | mark the step `human` + checkpoint yes |

## The checkpoint test (one question per step)

> **If this step ran wrong, could a human undo it before it matters?**

- No (sent, published, charged, deleted, deployed) → **checkpoint: yes**, and list it in `## Human checkpoints` with the reason.
- Yes, and the output is reviewable later → checkpoint can be **no**, but say why.

## The failure test (one question per step)

> **When this step fails, does the next step notice?**

- Failure must retry, alert, or stop — never silently hand bad data downstream. Write the guardrail in `## Cost + risk`.

## Common step templates

| Step | Contract sketch |
|---|---|
| Collect | Input: source (RSS/API/folder) → Output: raw items list |
| Draft | Input: items → Output: draft (uses a `prompt-engineering` prompt) |
| Review | Input: draft → Output: approved draft (checkpoint yes — publishing is irreversible) |
| Publish | Input: approved draft → Output: published URL (checkpoint yes) |
| Report | Input: results → Output: summary to the author (alert on failure) |
