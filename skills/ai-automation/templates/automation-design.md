# Automation design — fill this at Stages 2–4 (the format IS the audit contract)

The final `automation-design.md` must contain EXACTLY these sections in this order. The audit (`audit-automation.mjs`) reads this structure — missing or renamed sections fail.

## The card

```
# Automation design — {name}

## Automation-worthiness (Stage 2 — the honest gate, FIRST)
- Job to automate: {input → output · frequency · what goes wrong today}
- Verdict: {automatable | not automatable}
- Why: {frequent + rule-following + worth it — or the honest reasons it isn't}
- Cost-benefit: {hours saved vs. setup + run + review cost}

## Trigger
{what starts a run — schedule / event / manual}

## Workflow steps
1. **{step name}**
   - Tool/agent: {named tool or deepak-skill: mcp-agent-builder / vibe-code-webapp / prompt-engineering / human}
   - Input: {exact data in — becomes the previous step's output}
   - Output: {exact data out — becomes the next step's input}
   - Human checkpoint: {yes | no — YES on send/publish/delete/charge/deploy}
   - Error handling: {retry / alert / stop — what happens on failure}
2. **{next step}**
   - …

## Human checkpoints
- {step N}: {why a human must approve — one bullet per yes-step}

## Cost + risk
- Cost estimate: {per-run — tokens / API / hours, rough but real}
- Top failure mode: {the most likely failure}
- Guardrail: {what catches it}

## Build handoff
- What gets built: {the server / the UI+cron app / the prompt set / nothing new}
- Built by: {mcp-agent-builder | vibe-code-webapp | prompt-engineering | none}
```

## Writing rules (the rails)

- **Worthiness first.** If the verdict is `not automatable`, the design doc is still the deliverable — an honest NO is the win. Don't sneak a "yes, but…" past the gate.
- **Contracts, not vibes.** Every step names its tool, its exact input and its exact output. "Summarize the emails" is not a contract; "Input: the 40 newest threads from the inbox API → Output: 5 bullets, each ≤ 30 words" is.
- **Humans on irreversible + judgment-heavy actions.** Sending, publishing, deleting, charging, deploying → checkpoint yes. Anything a wrong run can't undo → checkpoint yes.
- **Costs are honest.** Rough is fine; missing is not. If you can't estimate it, you don't understand the workflow yet.
- **Anti-drift:** the trigger, the step inputs/outputs and the checkpoints must connect — no step that appears from nowhere, no output nobody consumes.
