# Automation design — weekly content pipeline agent

## Automation-worthiness (Stage 2 — the honest gate, FIRST)
- Job to automate: turn the week's blog posts + top threads into a newsletter draft, get it approved, and ship it — every Friday, ~3 hours by hand
- Verdict: automatable
- Why: the job is frequent (weekly), rule-following (a fixed pipeline: collect → draft → review → publish), and the failure cost is contained by a human review step
- Cost-benefit: saves ~3 hours/week vs. setup (one weekend) + run cost (~$0.40/run) + review time (20 min) — worth it

## Trigger
Schedule: every Friday 16:00 local — or manual "run now" from the dashboard.

## Workflow steps
1. **Collect the week's source material**
   - Tool/agent: a `vibe-code-webapp` cron job reading the RSS feed + X API
   - Input: the week's blog posts (RSS) + top threads from the author's X lists
   - Output: a raw item list — title, URL, date, word count per item
   - Human checkpoint: no — output is reviewable later
   - Error handling: retry twice on API timeout, then alert the author via Slack; never proceed with an empty list
2. **Draft the newsletter**
   - Tool/agent: the `prompt-engineering` library prompt "Newsletter intro — in my voice" (voice rules injected)
   - Input: the raw item list + the author's voice rules (tone, banned words)
   - Output: a newsletter draft — subject ≤ 60 chars, 350–500 words, ONE CTA
   - Human checkpoint: no — the draft is reviewable in the next step
   - Error handling: stop + alert if the draft fails validation (missing subject, missing CTA, or a banned word); never auto-revise more than twice
3. **Author review**
   - Tool/agent: human — the author
   - Input: the draft
   - Output: approved draft + chosen publish time
   - Human checkpoint: yes — judgment-heavy: tone, facts and the CTA need the author's eyes
   - Error handling: n/a — a human decides; a rejected draft stops the run
4. **Publish**
   - Tool/agent: the newsletter platform API, called by the `vibe-code-webapp` scheduler
   - Input: the approved draft
   - Output: the published issue URL, appended to the metrics log
   - Human checkpoint: yes — irreversible: once sent, it cannot be recalled
   - Error handling: stop + alert on API failure; never auto-retry a publish (duplicate-send risk)

## Human checkpoints
- Step 3 (Author review): tone, facts and the CTA are judgment calls — the author decides what ships
- Step 4 (Publish): sending is irreversible — a human approved the exact draft that goes out

## Cost + risk
- Cost estimate: ~$0.40 per run (draft tokens + API calls) + 20 min of author review; the cron app costs ~$0
- Top failure mode: the API returns an empty or partial item list and the draft ships thin
- Guardrail: step 1 refuses to proceed on an empty list and alerts; step 3's review catches thin drafts before step 4

## Build handoff
- What gets built: (1) the `vibe-code-webapp` cron app that collects, calls the draft prompt, and queues for review; (2) the "Newsletter intro" prompt added to the author's `prompt-engineering` library
- Built by: `vibe-code-webapp` + `prompt-engineering` (no MCP server needed — the newsletter platform has a REST API)
