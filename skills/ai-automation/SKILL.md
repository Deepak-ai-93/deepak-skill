---
name: ai-automation
description: Design AI agent workflows BEFORE building them — an honest automation-worthiness check first (is it automatable? is it worth it? the skill says NO when it isn't), then a workflow design doc: trigger → per-step tool/agent with input/output contracts → human-in-the-loop checkpoints on irreversible actions → error handling → cost estimate → a build handoff that delegates to mcp-agent-builder / vibe-code-webapp / prompt-engineering. Audit harness: audit-automation.mjs (worthiness verdict, trigger, step contracts, checkpoints, error handling, cost → automation-audit.md) + a fresh automation-auditor subagent scoring /50 and signing PASS / FIX NEEDED.
---

<!-- ════════════════════════════════════════════════════════════════════════
     🎬 deepak-skill — crafted by Deepak · skill: ai-automation
     https://github.com/Deepak-ai-93/deepak-skill · MIT license
     ════════════════════════════════════════════════════════════════════════ -->

```
   ██████╗ ███████╗███████╗██████╗  █████╗ ██╗  ██╗
   ██╔══██╗██╔════╝██╔════╝██╔══██╗██╔══██╗██║ ██╔╝
   ██║  ██║█████╗  █████╗  ██████╔╝███████║█████╔╝
   ██║  ██║██╔══╝  ██╔══╝  ██╔══██╗██╔══██║██╔═██╗
   ██████╔╝███████╗███████╗██║  ██║██║  ██║██║  ██╗
   ╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝
```

**🎬 deepak-skill — crafted by Deepak** · skill: `ai-automation` · [deepak-skill on GitHub](https://github.com/Deepak-ai-93/deepak-skill) · MIT

# skill: ai-automation

**Name:** AI Automation — design agent workflows before building them
**Description:** Turns a repetitive job into a **designed AI workflow** — but only after an honest **automation-worthiness** check (automatable? worth it? the skill says NO when the answer is no). When it's a go, it produces `automation-design.md`: **trigger → per-step tool/agent with input/output contracts → human-in-the-loop checkpoints on irreversible actions → error handling → cost estimate → build handoff** (delegating to `mcp-agent-builder` / `vibe-code-webapp` / `prompt-engineering`). This is the design layer: `mcp-agent-builder` builds the server, `ai-automation` decides what it should DO and where a human must stay in the loop. Audit harness: `audit-automation.mjs` + a fresh automation-auditor subagent (/50, ≥ 35 = worth building) before delivery.

---

## The quality bar (non-negotiable — read before anything else)

| Rail | Rule |
|---|---|
| **Worthiness before design (the #1 rail)** | `## Automation-worthiness` comes FIRST and records a verdict: **automatable / not automatable** + why, and a cost-benefit line. If the job is rare, judgment-heavy, or cheaper by hand, the verdict is NO — and the skill stops there. Designing a bad automation is worse than not automating. |
| **Every step has a contract** | Each workflow step names its **Tool/agent** (which skill or tool runs it), an **Input** contract (exact data in), an **Output** contract (exact data out), a **Human checkpoint** (yes/no + why), and **Error handling** (what happens on failure). A step without a contract fails the audit. |
| **Humans on irreversible actions** | Steps that send, publish, delete, charge or deploy are **human-checkpoint: yes** — the `## Human checkpoints` section lists each one and why a human must approve. The audit fails a workflow that lets an irreversible action run unattended. |
| **Cost + risk, stated honestly** | `## Cost + risk` gives a per-run **cost estimate** and the top failure mode with its guardrail. No estimate = no design (the audit fails). |
| **Build handoff, not hand-waving** | `## Build handoff` names what gets built and WHICH skill builds it (`mcp-agent-builder` / `vibe-code-webapp` / `prompt-engineering` / none). An automation design that can't be built is fiction. |
| **Audited before delivery (the harness)** | Final stage is a harness, never a self-check: `audit-automation.mjs` runs the automated checks → a FRESH automation-auditor subagent scores the design (/50, ≥ 35 = worth building) → fix loop until signed **PASS** in `automation-audit.md`. |

---

## Memory rails

The skill remembers what's been automated before — `automation-memory.md` at the working folder root (format: `templates/memory-profile.md`): the jobs considered, which were worth automating (and which weren't — the NO verdicts are as valuable as the yeses), what broke in production, and standing facts (tools, budget). Created at **Stage 0**, read every run, updated at the end. The audit checks the memory file exists (WARN if missing).

---

## When to use

- "I keep doing {job} every week — could an AI agent do it?"
- "Design an automation for my content workflow"
- "Should I automate this, or is it not worth it?" (honest answer either way)
- "Where should a human stay in the loop in my AI workflow?"
- "How much would this agent cost to run?"
- "I built an MCP server — what workflow should it actually run?"

**Complements:** `mcp-agent-builder` (the build handoff target — this skill designs, that skill scaffolds), `vibe-code-webapp` (handoff target when the workflow needs a UI or cron), `prompt-engineering` (per-step prompts come from the author's prompt library), `positioning-studio` (context injected into steps that draft content).

---

## Workflow (Stage 0 → Stage 6)

### Stage 0 — Load the memory (always first)
Read `automation-memory.md` (format: `templates/memory-profile.md`). First run? Create it (≤ 3 questions: what jobs repeat, what tools/budget exist). Check the past-automations table before designing — maybe this was already tried.

### Stage 1 — Analyze the job (ask ≤ 3 questions if vague)
Extract: **the job** (what repeats — input, steps, output, frequency) · **today's cost** (hours/week + what goes wrong) · **failure tolerance** (what happens if the output is wrong). Ask until you can describe the job as a pipeline: data in → N steps → result out.

### Stage 2 — Automation-worthiness (the honest gate)
Fill `## Automation-worthiness` in `templates/automation-design.md`: is the job **frequent** (weekly+), **rule-following** (not judgment-heavy), and **worth it** (saved hours > setup + run cost + review time)? Verdict: **automatable** or **not automatable**, with reasons. If NO — deliver the design doc with the NO verdict and stop; that's a successful outcome. (The audit requires a verdict either way.)

### Stage 3 — Design the workflow → `automation-design.md`
Write `## Trigger` (what starts a run: schedule, event, manual). Then each step in order: **Tool/agent** (a named tool or a deepak-skill: `mcp-agent-builder`, `vibe-code-webapp`, `prompt-engineering`, or human) + **Input** contract (exact data) + **Output** contract (exact data, becomes the next step's input) + **Human checkpoint** (yes/no + why) + **Error handling** (retry / alert / stop). Mark any step that sends, publishes, deletes, charges or deploys as checkpoint **yes**.

### Stage 4 — Cost + risk + handoff
`## Cost + risk`: a per-run **cost estimate** (tokens/API/hours, rough but real) and the **top failure mode** with its guardrail. `## Build handoff`: what gets built, and by which skill — `mcp-agent-builder` (a server), `vibe-code-webapp` (a UI/cron app), `prompt-engineering` (the per-step prompts), or "none" if the workflow runs on existing tools.

### Stage 5 — Approval gate
Show the user: worthiness verdict + workflow diagram + checkpoints + cost. They say **approve / edit / reject**. A NO verdict still gets shown — the point was an honest answer.

### Stage 6 — Audit harness (automated checks + automation-auditor subagent, before delivery)
**Step 6a — run the automated audit:**
```bash
node scripts/audit-automation.mjs --pack <design-folder> --out automation-audit.md
```
`audit-automation.mjs` checks: `automation-design.md` exists; worthiness verdict present; trigger present; ≥ 2 workflow steps each with Tool / Input / Output / Human checkpoint / Error handling; irreversible steps (send/publish/delete/charge/deploy) marked checkpoint yes; `## Human checkpoints` lists every yes; cost estimate present; build handoff names a builder; memory present (WARN if missing). Writes `automation-audit.md`. **Exit 1 on any FAIL.**

**Step 6b — spawn the automation-auditor subagent** — a FRESH subagent (never self-audit) with the brief from `templates/automation-auditor-brief.md`: reads `automation-audit.md` + the design, completes the **automation-worthiness scorecard** (10 criteria, /50 — **≥ 35 = worth building**), makes the judgment calls a script can't (is the worthiness verdict actually honest? are the checkpoints in the right places? is the cost estimate believable? would a human trust the output?), and signs **PASS / FIX NEEDED**.

**Step 6c — fix loop.** Any FAIL (or an auditor-flagged WARN) → fix → re-run → re-submit to a fresh auditor. **Nothing ships until the auditor signs PASS.** `automation-audit.md` ships with the pack.

### Stage 7 — Write memory back
Append to `automation-memory.md`: date, job, verdict (automatable / NO), what got built, what broke. The NO verdicts go in the table too — that's the honest record.

---

## Production checklist

- [ ] Stage 0: `automation-memory.md` read (created on first run) — past verdicts checked before designing
- [ ] Worthiness first: verdict (automatable / not automatable) + reasons + cost-benefit — a NO stops the design honestly
- [ ] Trigger defined (schedule / event / manual)
- [ ] Every workflow step has a contract: Tool/agent + Input + Output + Human checkpoint + Error handling
- [ ] Irreversible steps (send / publish / delete / charge / deploy) are human-checkpoint: yes, and listed in `## Human checkpoints`
- [ ] Cost + risk: per-run estimate + top failure mode with guardrail
- [ ] Build handoff names what gets built and which skill builds it (mcp-agent-builder / vibe-code-webapp / prompt-engineering / none)
- [ ] Approval gate: user approved verdict + workflow + checkpoints + cost before delivery
- [ ] **Audit harness run:** `audit-automation.mjs` → automated checks — exit 0
- [ ] **Automation-auditor subagent** (fresh eyes) completed the scorecard (/50 ≥ 35) and signed **PASS / FIX NEEDED** in `automation-audit.md`
- [ ] Delivery: `automation-design.md` + `automation-audit.md` + `automation-memory.md` (updated)
