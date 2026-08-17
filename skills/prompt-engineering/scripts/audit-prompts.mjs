#!/usr/bin/env node
// prompt-engineering — the automated audit half of the prompt-auditor gate.
// Scans a prompt-library pack (prompt-library.md + test-results.md) and checks
// everything a script can: library exists; ≥ 3 prompts; every prompt has the
// Role → Context → Task → Format → Constraints framework; no placeholder gaps
// ({{…}}, [insert…], TODO); ## Voice rules present with tone + banned words
// carried from the taste profile; test-results.md has a verdict per prompt
// (counts match); author memory present (WARN if missing). Writes prompts-audit.md
// with automated verdicts + an AUDITOR section. Exit 1 on any FAIL.
//
// Usage:
//   node audit-prompts.mjs --pack <library-folder> [--out prompts-audit.md]
//
// Exit codes: 0 = clean, 1 = FAIL, 2 = usage error.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, basename, join } from "node:path";

// ─── brand banner (deepak-skill · crafted by Deepak) ────────────────────────
const BRAND_LINE = "═".repeat(56);
const banner = (label) =>
  `\n${BRAND_LINE}\n  🎬 deepak-skill — crafted by Deepak\n  skill: prompt-engineering · ${label}\n${BRAND_LINE}\n`;
console.log(banner("audit-prompts.mjs"));

// --- tiny arg parser (same style as the other skill scripts) ----------------
const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const needle = `--${name}`;
  const found = args.find((a) => a === needle || a.startsWith(`${needle}=`));
  if (found === undefined) return fallback;
  const eq = found.indexOf("=");
  return eq !== -1 ? found.slice(eq + 1) : args[args.indexOf(found) + 1];
};

const packArg = opt("pack");
if (!packArg) {
  console.error("Usage: node audit-prompts.mjs --pack <library-folder> [--out prompts-audit.md]");
  process.exit(2);
}
const packDir = resolve(process.cwd(), packArg);
const outPath = resolve(process.cwd(), opt("out", "prompts-audit.md"));
if (!existsSync(packDir)) {
  console.error(`❌ Library folder not found: ${packDir}`);
  console.error("   Pass the pack folder (prompt-library.md + test-results.md) — e.g. skills/prompt-engineering/examples/creator-prompt-library");
  process.exit(2);
}

const results = [];
const add = (status, check, detail) => results.push({ status, check, detail });

const read = (f) => (existsSync(join(packDir, f)) ? readFileSync(join(packDir, f), "utf8") : null);

const library = read("prompt-library.md");
if (!library) {
  add("FAIL", "prompt-library.md exists", "missing — the library is the deliverable");
} else {
  // split into ## sections (simple, robust: heading line → text until next heading line)
  const sections = [];
  const lines = library.split(/\r?\n/);
  let cur = null;
  for (const line of lines) {
    const h = line.match(/^##\s+(.+)$/);
    if (h) { cur = { heading: h[1].trim(), body: [] }; sections.push(cur); }
    else if (cur) cur.body.push(line);
  }
  const prompts = sections.filter((s) => !/voice rules/i.test(s.heading));
  if (prompts.length >= 3) add("PASS", "prompt count", `${prompts.length} prompt(s) — ≥ 3`);
  else add("FAIL", "prompt count", `only ${prompts.length} — need ≥ 3 real use cases`);

  // framework completeness per prompt
  const missing = prompts.filter((p) => {
    const b = p.body.join("\n");
    return !["Role", "Context", "Task", "Format", "Constraints"].every((k) => new RegExp(`-\\s*\\*{0,2}${k}\\*{0,2}\\s*:`, "i").test(b));
  });
  if (!missing.length) add("PASS", "prompt framework", "every prompt carries Role → Context → Task → Format → Constraints");
  else add("FAIL", "prompt framework", `${missing.length} prompt(s) missing framework parts: ${missing.map((p) => p.heading).join(" | ")}`);

  // placeholder gaps
  const gaps = library.match(/\{\{[^}]*\}\}|\[insert[^\]]*\]|\[your\s+[^\]]*\]|\bTODO\b/gi);
  if (!gaps) add("PASS", "placeholder gaps", "none — every prompt is copy-paste ready");
  else add("FAIL", "placeholder gaps", gaps.slice(0, 5).join(", ") + (gaps.length > 5 ? ` (+${gaps.length - 5} more)` : ""));

  // voice rules present
  const voiceRules = sections.find((s) => /voice rules/i.test(s.heading));
  const voiceBody = voiceRules ? voiceRules.body.join("\n") : "";
  if (voiceRules) {
    const hasTone = /tone/i.test(voiceBody);
    const hasBanned = /banned/i.test(voiceBody);
    const bullets = (voiceBody.match(/^\s*[-*]\s+(.+)$/gm) || []).length;
    if (hasTone && hasBanned && bullets >= 2) add("PASS", "voice rules", "tone + banned words present with bullets (author's taste carried in)");
    else add("FAIL", "voice rules", `voice rules incomplete — tone: ${hasTone}, banned-words: ${hasBanned}, bullets: ${bullets}`);
  } else {
    add("FAIL", "voice rules", "no ## Voice rules section — the library must carry the author's voice");
  }

  // taste banned words carried into the library (positive check — constraints SHOULD name them)
  const memPack = read("prompt-memory.md");
  const memCwdPath = join(process.cwd(), "prompt-memory.md");
  const memCwd = existsSync(memCwdPath) ? readFileSync(memCwdPath, "utf8") : null;
  const mem = memPack || memCwd;
  const banned = [];
  if (mem) {
    let inBanned = false;
    for (const line of mem.split(/\r?\n/)) {
      if (/^#{1,4}\s/.test(line)) { inBanned = /banned|never\s+use|avoid/i.test(line); continue; }
      if (/banned words/i.test(line)) { inBanned = true; continue; }
      if (inBanned && /^\s*[-*]\s+(.+)$/.test(line)) {
        const w = line.replace(/^\s*[-*]\s+/, "").trim().replace(/[`*_]/g, "");
        if (w && !/[|]/.test(w)) banned.push(w);
      }
    }
    if (banned.length) {
      const carried = banned.filter((w) => library.toLowerCase().includes(w.toLowerCase()));
      if (carried.length === banned.length) add("PASS", "taste banned words", `all ${banned.length} author-banned word(s) carried into the library's voice rules`);
      else add("FAIL", "taste banned words", `not carried: ${banned.filter((w) => !carried.includes(w)).join(", ")} — the voice rules must name them`);
    }
  } else {
    add("WARN", "author memory", "no prompt-memory.md in the pack or working folder — create one at Stage 0 (templates/memory-profile.md)");
  }

  // test results per prompt
  const tests = read("test-results.md");
  if (tests) {
    const testBlocks = [];
    let cur2 = null;
    for (const line of tests.split(/\r?\n/)) {
      const h = line.match(/^##\s+(.+)$/);
      if (h) { cur2 = { heading: h[1].trim(), body: [] }; testBlocks.push(cur2); }
      else if (cur2) cur2.body.push(line);
    }
    const verdicts = testBlocks.filter((t) => /\b(pass|needs-work|needs work)\b/i.test(t.body.join("\n")));
    if (testBlocks.length === prompts.length && verdicts.length === prompts.length)
      add("PASS", "test results", `${testBlocks.length}/${prompts.length} prompts tested with a verdict (pass / needs-work)`);
    else if (testBlocks.length !== prompts.length)
      add("FAIL", "test results", `${testBlocks.length} test entries vs ${prompts.length} prompts — every prompt needs a test verdict`);
    else add("FAIL", "test results", `${testBlocks.length - verdicts.length} test entry/entries missing a verdict`);
  } else {
    add("FAIL", "test results", "no test-results.md — an untested prompt is a guess; run the Stage 4 test loop");
  }
}

// ─── write prompts-audit.md ─────────────────────────────────────────────────
const fails = results.filter((r) => r.status === "FAIL");
const warns = results.filter((r) => r.status === "WARN");
const passes = results.filter((r) => r.status === "PASS");

const L = [];
L.push(`# Prompt Library Audit — ${basename(packDir)}`);
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
L.push("### 2.1 Prompt-library-worthiness scorecard (rate 1–5 each, /50 — a library worth keeping scores ≥ 35)");
L.push("");
L.push("| Criterion | Ask | Score /5 |");
L.push("|---|---|---|");
L.push("| **Voice match** | Would the outputs sound like the author (voice rules from the taste profile), not generic AI? | |");
L.push("| **Prompt craft** | Are the prompts specific (inputs, angles, caps, examples) rather than 'write a hook'? | |");
L.push("| **Framework discipline** | Role → Context → Task → Format → Constraints on every prompt, copy-paste ready? | |");
L.push("| **Use-case value** | Do the prompts cover the author's real weekly work, not a generic template? | |");
L.push("| **Constraint tightness** | Are caps and banned words enforceable (measurable), not vibes? | |");
L.push("| **Test honesty** | Are the test verdicts believable — did weak outputs get rewritten, not hand-waved? | |");
L.push("| **Tool fit** | Are prompts matched to the right tool (or marked as portable)? | |");
L.push("| **Reusability** | Would the author reach for these prompts next week without editing? | |");
L.push("| **Anti-fluff** | Zero fluff in prompt instructions; every output constraint measurable? | |");
L.push("| **Ship-readiness** | Would the author run these today and trust the output? | |");
L.push("");
L.push("### 2.2 Creative judgment calls");
L.push("");
L.push("- Do the constraints actually enforce the author's voice (tone, rhythm, banned words)?");
L.push("- Any prompt that would produce generic output no matter the tool?");
L.push("- Are the test inputs representative of real use, and are weak results honestly recorded?");
L.push("");
L.push("### 2.3 Verdict");
L.push("");
L.push("- All PASS and scorecard ≥ 35 → mark **PASS** and sign below.");
L.push("- Any FAIL (or a WARN you judge real) → mark **FIX NEEDED** and list concrete fixes per prompt.");
L.push("");
L.push(`> Auditor verdict: **PENDING** · Auditor: _(subagent)_ · Date: ${new Date().toISOString().slice(0, 10)}`);
L.push("");

writeFileSync(outPath, L.join("\n"), "utf8");

console.log(`✅ prompts-audit.md → ${basename(outPath)} (${passes.length} PASS · ${warns.length} WARN · ${fails.length} FAIL)`);
for (const r of results.filter((r) => r.status !== "PASS")) {
  console.log(`   ${r.status === "FAIL" ? "❌" : "⚠️"} ${r.check}: ${r.detail}`);
}
if (fails.length) {
  console.error(`❌ ${fails.length} automated FAIL(s) — fix and re-run before spawning the prompt-auditor.`);
  process.exit(1);
}
console.log("Automated checks clean — now spawn the prompt-auditor subagent (see SKILL.md Stage 6 / templates/prompt-auditor-brief.md) to complete the scorecard + verdict in prompts-audit.md.");
process.exit(0);
