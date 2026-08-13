#!/usr/bin/env node
// x-threads-engagement — the automated audit half of the x-auditor gate.
// Scans a thread pack (thread.md + engagement.md) and checks everything a
// script can: hook ≤ 100 chars opening a loop, ≤ 280 chars per tweet, ≥ 3
// tweets, story-spine roles (open loop → payoff → CTA/loop), anti-fluff +
// bait-spam blocklists, hashtag hygiene, and engagement.md presence. Writes
// threads-audit.md with automated verdicts + an AUDITOR section. Exit 1 on any FAIL.
//
// Usage:
//   node audit-threads.mjs --pack <thread-folder> [--out threads-audit.md]
//
// Exit codes: 0 = clean, 1 = FAIL, 2 = usage error.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, basename, join } from "node:path";

// ─── brand banner (deepak-skill · crafted by Deepak) ────────────────────────
const BRAND_LINE = "═".repeat(56);
const banner = (label) =>
  `\n${BRAND_LINE}\n  🎬 deepak-skill — crafted by Deepak\n  skill: x-threads-engagement · ${label}\n${BRAND_LINE}\n`;
console.log(banner("audit-threads.mjs"));

// --- tiny arg parser (same style as the other skill scripts) ----------------
const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const needle = `--${name}`;
  const found = args.find((a) => a === needle || a.startsWith(`${needle}=`));
  if (found === undefined) return fallback;
  const eq = found.indexOf("=");
  return eq !== -1 ? found.slice(eq + 1) : args[args.indexOf(found) + 1];
};

const FLUFF = [
  "unlock", "game-changer", "elevate", "supercharge", "level up", "unleash",
  "boost", "empower", "revolutionize", "optimize", "leverage", "journey",
  "transform your", "skyrocket", "crush it", "secrets to", "amazing", "guaranteed",
];
const BAIT = [
  "rt if", "retweet if", "like if", "tag someone", "share if you agree",
  "follow for follow",
];
const ROLE_TAGS = ["hook", "open-loop", "rising", "payoff", "value", "cta", "loop"];

const packArg = opt("pack");
if (!packArg) {
  console.error("Usage: node audit-threads.mjs --pack <thread-folder> [--out threads-audit.md]");
  process.exit(2);
}
const packDir = resolve(process.cwd(), packArg);
const outPath = resolve(process.cwd(), opt("out", "threads-audit.md"));
if (!existsSync(packDir)) {
  console.error(`❌ Thread folder not found: ${packDir}`);
  console.error("   Pass the pack folder (thread.md + engagement.md) — e.g. skills/x-threads-engagement/examples/founder-pricing-thread");
  process.exit(2);
}

const results = [];
const add = (status, check, detail) => results.push({ status, check, detail });

const read = (f) => (existsSync(join(packDir, f)) ? readFileSync(join(packDir, f), "utf8") : null);
const thread = read("thread.md");
if (!thread) {
  add("FAIL", "thread.md exists", "missing — the pack must ship thread.md");
} else {
  const tweets = [];
  for (const line of thread.split("\n")) {
    const m = line.match(/^\d+\.\s+(.+)$/);
    if (!m) continue;
    const raw = m[1];
    const text = raw.replace(/\s+\*\([^)]*\)\s*$/, "").trim();
    const roleMatch = raw.match(/\*\(([a-z-]+)\s*·/);
    const role = roleMatch && ROLE_TAGS.includes(roleMatch[1]) ? roleMatch[1] : null;
    tweets.push({ text, role, len: text.length });
  }

  if (tweets.length >= 3) add("PASS", "tweet count", `${tweets.length} tweets`);
  else add("FAIL", "tweet count", `only ${tweets.length} — need ≥ 3`);

  const hook = tweets[0];
  if (hook && hook.len <= 100) add("PASS", "hook length", `${hook.len}/100 chars`);
  else add("FAIL", "hook length", hook ? `${hook.len}/100 chars — over the hook window` : "no tweet 1");

  if (hook && ["hook", "open-loop"].includes(hook.role)) add("PASS", "hook opens a loop", `tweet 1 role: ${hook.role}`);
  else add("FAIL", "hook opens a loop", hook ? `tweet 1 role: ${hook.role || "unannotated"}` : "no tweet 1");

  const over = tweets.filter((t) => t.len > 280);
  if (!over.length) add("PASS", "280-char cap", "every tweet ≤ 280 chars");
  else add("FAIL", "280-char cap", `${over.length} tweet(s) over 280: ${over.map((t) => `${t.len}c`).join(", ")}`);

  const roles = tweets.map((t) => t.role);
  if (roles.includes("payoff")) add("PASS", "payoff present", "a payoff tweet closes the loop");
  else add("FAIL", "payoff present", "no payoff tweet — the open loop never closes");

  if (tweets.length) {
    const last = roles[roles.length - 1];
    if (["cta", "loop"].includes(last)) add("PASS", "CTA/loop ending", `last tweet role: ${last}`);
    else add("FAIL", "CTA/loop ending", `last tweet role: ${last || "unannotated"} — must be cta/loop`);
  }

  if (tweets.some((t) => !t.role)) add("WARN", "story-spine annotations", "some tweets lack role annotations — rebuild with thread-writer.mjs");
  else add("PASS", "story-spine annotations", "every tweet carries a role tag");

  const fluff = [];
  const bait = [];
  tweets.forEach((t, i) => {
    for (const w of FLUFF) if (t.text.toLowerCase().includes(w)) fluff.push(`${w} (tweet ${i + 1})`);
    for (const w of BAIT) if (t.text.toLowerCase().includes(w)) bait.push(`${w} (tweet ${i + 1})`);
  });
  if (!fluff.length) add("PASS", "anti-fluff", "no fluff words");
  else add("FAIL", "anti-fluff", fluff.join(", "));
  if (!bait.length) add("PASS", "no bait-spam", "no RT/tag bait");
  else add("FAIL", "no bait-spam", bait.join(", "));

  const htLines = thread.split("\n").filter((l) => (l.match(/#/g) || []).length > 3);
  if (!htLines.length) add("PASS", "hashtag hygiene", "≤ 3 hashtags per line");
  else add("WARN", "hashtag hygiene", `${htLines.length} line(s) with > 3 hashtags`);
}

if (!existsSync(join(packDir, "engagement.md"))) add("FAIL", "engagement.md exists", "missing — the reply/engagement ritual ships with every thread");
else add("PASS", "engagement.md exists", "reply-first hour + quote-post ritual present");

// ─── write threads-audit.md ─────────────────────────────────────────────────
const fails = results.filter((r) => r.status === "FAIL");
const warns = results.filter((r) => r.status === "WARN");
const passes = results.filter((r) => r.status === "PASS");

const L = [];
L.push(`# Threads Audit — ${basename(packDir)}`);
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
L.push("### 2.1 Thread-worthiness scorecard (rate 1–5 each, /50 — a thread worth posting scores ≥ 35)");
L.push("");
L.push("| Criterion | Ask | Score /5 |");
L.push("|---|---|---|");
L.push("| **Hook pull** | Would tweet 1 stop the scroll in the feed? Does it open a real loop? | |");
L.push("| **Beat escalation** | Does each middle tweet raise the stakes, add a twist, or reward? | |");
L.push("| **Payoff quality** | Does the payoff deliver the aha the hook promised? | |");
L.push("| **CTA strength** | Is the last tweet a clear, specific action (follow/save/DM) with a serial hook? | |");
L.push("| **Story spine** | Open loop → rising tension → payoff → loop ending all present? | |");
L.push("| **Voice consistency** | Does it sound like the account, not a template? | |");
L.push("| **One idea per tweet** | Would any tweet be clearer split in two? | |");
L.push("| **Mute-first clarity** | Would a scroller get the story from the text alone? | |");
L.push("| **Controversy-worthiness** | Does it take a position people will reply to? | |");
L.push("| **Engagement plan** | Is engagement.md specific enough to execute? | |");
L.push("");
L.push("### 2.2 Creative judgment calls");
L.push("");
L.push("- Any beat that violates the fluff rule (doesn't raise the question, raise the stakes, or pay off)?");
L.push("- Is the CTA genuinely serial (Part 2 / save / DM) or a dead-end?");
L.push("- Would the hook get a reply from the target audience, or just a view?");
L.push("");
L.push("### 2.3 Verdict");
L.push("");
L.push("- All PASS and scorecard ≥ 35 → mark **PASS** and sign below.");
L.push("- Any FAIL (or a WARN you judge real) → mark **FIX NEEDED** and list per-tweet fixes.");
L.push("");
L.push(`> Auditor verdict: **PENDING** · Auditor: _(subagent)_ · Date: ${new Date().toISOString().slice(0, 10)}`);
L.push("");

writeFileSync(outPath, L.join("\n"), "utf8");

console.log(`✅ threads-audit.md → ${basename(outPath)} (${passes.length} PASS · ${warns.length} WARN · ${fails.length} FAIL)`);
for (const r of results.filter((r) => r.status !== "PASS")) {
  console.log(`   ${r.status === "FAIL" ? "❌" : "⚠️"} ${r.check}: ${r.detail}`);
}
if (fails.length) {
  console.error(`❌ ${fails.length} automated FAIL(s) — fix and re-run before spawning the x-auditor.`);
  process.exit(1);
}
console.log("Automated checks clean — now spawn the x-auditor subagent (see SKILL.md Stage 6 / templates/x-auditor-brief.md) to complete the scorecard + verdict in threads-audit.md.");
process.exit(0);
