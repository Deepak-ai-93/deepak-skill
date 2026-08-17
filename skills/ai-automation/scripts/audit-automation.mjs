#!/usr/bin/env node
// ai-automation — the automated audit half of the automation-auditor gate.
// Scans an automation design pack (automation-design.md) and checks everything
// a script can: design exists; automation-worthiness verdict present (automatable
// or not) + cost-benefit; trigger defined; ≥ 2 workflow steps each with a
// Tool/Input/Output/Human-checkpoint/Error-handling contract; irreversible steps
// (send/publish/delete/charge/deploy) marked human-checkpoint yes; ## Human
// checkpoints lists every yes; cost estimate present; build handoff names a
// builder; author memory present (WARN if missing). Writes automation-audit.md
// with automated verdicts + an AUDITOR section. Exit 1 on any FAIL.
//
// Usage:
//   node audit-automation.mjs --pack <design-folder> [--out automation-audit.md]
//
// Exit codes: 0 = clean, 1 = FAIL, 2 = usage error.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, basename, join } from "node:path";

// ─── brand banner (deepak-skill · crafted by Deepak) ────────────────────────
const BRAND_LINE = "═".repeat(56);
const banner = (label) =>
  `\n${BRAND_LINE}\n  🎬 deepak-skill — crafted by Deepak\n  skill: ai-automation · ${label}\n${BRAND_LINE}\n`;
console.log(banner("audit-automation.mjs"));

// --- tiny arg parser (same style as the other skill scripts) ----------------
const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const needle = `--${name}`;
  const found = args.find((a) => a === needle || a.startsWith(`${needle}=`));
  if (found === undefined) return fallback;
  const eq = found.indexOf("=");
  return eq !== -1 ? found.slice(eq + 1) : args[args.indexOf(found) + 1];
};

const IRREVERSIBLE = /\b(send|publish|delete|charge|deploy|post|email|pay)\b/i;
const MARKERS = ["Tool/agent", "Input", "Output", "Human checkpoint", "Error handling"];

const packArg = opt("pack");
if (!packArg) {
  console.error("Usage: node audit-automation.mjs --pack <design-folder> [--out automation-audit.md]");
  process.exit(2);
}
const packDir = resolve(process.cwd(), packArg);
const outPath = resolve(process.cwd(), opt("out", "automation-audit.md"));
if (!existsSync(packDir)) {
  console.error(`❌ Design folder not found: ${packDir}`);
  console.error("   Pass the pack folder (automation-design.md) — e.g. skills/ai-automation/examples/content-pipeline-agent");
  process.exit(2);
}

const results = [];
const add = (status, check, detail) => results.push({ status, check, detail });

const read = (f) => (existsSync(join(packDir, f)) ? readFileSync(join(packDir, f), "utf8") : null);

const section = (md, heading) => {
  const lines = md.split(/\r?\n/);
  let capture = false;
  const out = [];
  for (const line of lines) {
    const h = line.match(/^##\s+(.+)$/);
    if (h) {
      if (capture) break;
      capture = h[1].trim().startsWith(heading);
      continue;
    }
    if (capture) out.push(line);
  }
  return out.join("\n").trim();
};

const design = read("automation-design.md");
if (!design) {
  add("FAIL", "automation-design.md exists", "missing — the design doc is the deliverable");
} else {
  // worthiness verdict
  const worth = section(design, "Automation-worthiness");
  if (worth) {
    const verdict = /verdict\s*:\s*(automatable|not automatable)/i.test(worth);
    const costBenefit = /cost[- ]benefit|worth it|by hand/i.test(worth);
    if (verdict && costBenefit) add("PASS", "automation-worthiness", "verdict (automatable / not automatable) + cost-benefit present — the honest gate ran first");
    else if (verdict) add("WARN", "automation-worthiness", "verdict present but no cost-benefit line — add why it's worth it (or not)");
    else add("FAIL", "automation-worthiness", "no verdict line — the design must record 'verdict: automatable' or 'verdict: not automatable' first");
  } else {
    add("FAIL", "automation-worthiness", "no ## Automation-worthiness section — worthiness comes before design");
  }

  // trigger
  const trigger = section(design, "Trigger");
  if (trigger) add("PASS", "trigger", "defined (schedule / event / manual)");
  else add("FAIL", "trigger", "no ## Trigger section — what starts a run?");

  // workflow steps with contracts
  const stepsBody = section(design, "Workflow steps");
  if (stepsBody) {
    const stepParts = stepsBody.split(/^\s*\d+\.\s+/m).filter((s) => s.trim());
    if (stepParts.length >= 2) {
      const missingMarkers = stepParts.filter((s) => MARKERS.some((mk) => !new RegExp(`-\\s*\\*{0,2}${mk}\\*{0,2}\\s*:`, "i").test(s)));
      if (!missingMarkers.length) {
        add("PASS", "step contracts", `${stepParts.length} step(s), each with Tool / Input / Output / Human checkpoint / Error handling`);
        // irreversible actions must be human-checkpoint: yes
        const risky = stepParts.filter((s) => IRREVERSIBLE.test(s));
        const riskyUnchecked = risky.filter((s) => !/human checkpoint\s*:\s*yes/i.test(s));
        if (riskyUnchecked.length) add("FAIL", "human checkpoints", `${riskyUnchecked.length} irreversible step(s) run unattended — mark human checkpoint: yes on send/publish/delete/charge/deploy steps`);
        else if (risky.length) add("PASS", "human checkpoints", `${risky.length} irreversible step(s) all marked human-checkpoint: yes`);
        else add("PASS", "human checkpoints", "no irreversible steps — all actions are reversible (or already reviewed)");
      } else {
        add("FAIL", "step contracts", `${missingMarkers.length} step(s) missing contract parts: ${missingMarkers.map((s) => (s.split(/\r?\n/)[0] || "step").trim()).join(" | ")}`);
      }
    } else {
      add("FAIL", "workflow steps", `only ${stepParts.length} step(s) — need ≥ 2 (a one-step job is a prompt, not an automation)`);
    }
  } else {
    add("FAIL", "workflow steps", "no ## Workflow steps section — the pipeline is the design");
  }

  // human checkpoints section covers every yes
  const checkpoints = section(design, "Human checkpoints");
  const yesCount = (stepsBody.match(/human checkpoint\s*:\s*yes/gi) || []).length;
  if (yesCount > 0) {
    const cpBullets = (checkpoints.match(/^\s*[-*]\s+(.+)$/gm) || []).length;
    if (checkpoints && cpBullets >= yesCount) add("PASS", "checkpoint list", `## Human checkpoints lists all ${yesCount} yes-step(s)`);
    else if (checkpoints) add("FAIL", "checkpoint list", `${yesCount} yes-step(s) but only ${cpBullets} listed — every yes must appear with its reason`);
    else add("FAIL", "checkpoint list", `${yesCount} yes-step(s) but no ## Human checkpoints section`);
  } else if (checkpoints) {
    add("PASS", "checkpoint list", "no yes-steps; checkpoints section present");
  }

  // cost + risk
  const cost = section(design, "Cost + risk");
  if (cost) {
    const hasEstimate = /\$|tokens?|per run|~|approx/i.test(cost);
    const hasFailure = /failure|risk|guardrail/i.test(cost);
    if (hasEstimate && hasFailure) add("PASS", "cost + risk", "per-run estimate + top failure mode with guardrail present");
    else add("WARN", "cost + risk", `cost/risk section present but missing ${[!hasEstimate && "estimate", !hasFailure && "failure mode"].filter(Boolean).join(" + ")}`);
  } else {
    add("FAIL", "cost + risk", "no ## Cost + risk section — no estimate, no design");
  }

  // build handoff
  const handoff = section(design, "Build handoff");
  if (handoff) {
    if (/mcp-agent-builder|vibe-code-webapp|prompt-engineering|none/i.test(handoff)) add("PASS", "build handoff", "names a builder (mcp-agent-builder / vibe-code-webapp / prompt-engineering / none)");
    else add("FAIL", "build handoff", "handoff present but names no builder — what gets built, and by which skill?");
  } else {
    add("FAIL", "build handoff", "no ## Build handoff section — a design that can't be built is fiction");
  }
}

// memory (author rails)
const memPack = read("automation-memory.md");
const memCwdPath = join(process.cwd(), "automation-memory.md");
const memCwd = existsSync(memCwdPath) ? readFileSync(memCwdPath, "utf8") : null;
if (memPack || memCwd) add("PASS", "author memory", "automation-memory.md present (pack or working folder) — past verdicts checked at Stage 0");
else add("WARN", "author memory", "no automation-memory.md in the pack or working folder — create one at Stage 0 (templates/memory-profile.md)");

// ─── write automation-audit.md ──────────────────────────────────────────────
const fails = results.filter((r) => r.status === "FAIL");
const warns = results.filter((r) => r.status === "WARN");
const passes = results.filter((r) => r.status === "PASS");

const L = [];
L.push(`# Automation Audit — ${basename(packDir)}`);
L.push("");
L.push(`**Automated checks (${new Date().toISOString().slice(0, 10)}):** ${passes.length} PASS · ${warns.length} WARN · ${fails.length} FAIL · **automated verdict:** ${fails.length ? "FIX NEEDED" : "PASS (pending auditor)"}`);
L.push("");
L.push("## 1. Automated results");
L.push("");
L.push("| Status | Check | Detail |");
L.push("|---|---|---|");
for (const r of results) L.push(`| ${r.status} | ${r.check} | ${r.detail} |`);
L.push("");
L.push("## 2. Auditor section — COMPLETE THIS (subagent, fresh eyes)");
L.push("");
L.push("### 2.1 Automation-worthiness scorecard (rate 1–5 each, /50 — a design worth building scores ≥ 35)");
L.push("");
L.push("| Criterion | Ask | Score /5 |");
L.push("|---|---|---|");
L.push("| **Verdict honesty** | Is the worthiness verdict genuinely right (frequent, rule-following, worth it) — or wishful? | |");
L.push("| **Pipeline logic** | Does each step's output feed the next step's input (no missing handoffs)? | |");
L.push("| **Checkpoint placement** | Are humans in the loop exactly where irreversible or judgment-heavy actions happen? | |");
L.push("| **Error handling** | Would a failure stop loudly, retry safely, or corrupt the next step silently? | |");
L.push("| **Cost realism** | Is the per-run estimate believable (tokens/API/hours), not hand-waved? | |");
L.push("| **Tool fit** | Are the tools/skills chosen right for each step (MCP server, webapp, prompts)? | |");
L.push("| **Trust** | Would the author actually let this run unattended at the checkpoints as designed? | |");
L.push("| **Scope control** | Is the workflow narrow (one job, done well) rather than an everything-agent? | |");
L.push("| **Build clarity** | Does the handoff tell the builder exactly what to build? | |");
L.push("| **Ship-readiness** | Would you hand this design to a builder today? | |");
L.push("");
L.push("### 2.2 Creative judgment calls");
L.push("");
L.push("- Is the worthiness verdict honest, or is this automating something better left human?");
L.push("- Are checkpoints in the RIGHT places (irreversible + judgment-heavy), not just the obvious ones?");
L.push("- Would a failure be caught before it matters, or would it silently cascade?");
L.push("");
L.push("### 2.3 Verdict");
L.push("");
L.push("- All PASS and scorecard ≥ 35 → mark **PASS** and sign below.");
L.push("- Any FAIL (or a WARN you judge real) → mark **FIX NEEDED** and list concrete fixes.");
L.push("");
L.push(`> Auditor verdict: **PENDING** · Auditor: _(subagent)_ · Date: ${new Date().toISOString().slice(0, 10)}`);
L.push("");

writeFileSync(outPath, L.join("\n"), "utf8");

console.log(`✅ automation-audit.md → ${basename(outPath)} (${passes.length} PASS · ${warns.length} WARN · ${fails.length} FAIL)`);
for (const r of results.filter((r) => r.status !== "PASS")) {
  console.log(`   ${r.status === "FAIL" ? "❌" : "⚠️"} ${r.check}: ${r.detail}`);
}
if (fails.length) {
  console.error(`❌ ${fails.length} automated FAIL(s) — fix and re-run before spawning the automation-auditor.`);
  process.exit(1);
}
console.log("Automated checks clean — now spawn the automation-auditor subagent (see SKILL.md Stage 6 / templates/automation-auditor-brief.md) to complete the scorecard + verdict in automation-audit.md.");
process.exit(0);
