#!/usr/bin/env node
// newsletter-growth — the automated audit half of the newsletter-auditor gate.
// Scans a newsletter pack (issue.md + growth-plan.md) and checks everything a
// script can: subject ≤ 60 chars with a formula, story-spine sections (open →
// stakes → payoff), ≥ 2 value bullets, ONE CTA + ONE growth plug, word window
// 350–900, anti-fluff blocklist, specificity (numbers/receipts), and
// growth-plan.md presence. Writes newsletter-audit.md with automated verdicts
// + an AUDITOR section. Exit 1 on any FAIL.
//
// Usage:
//   node audit-newsletter.mjs --pack <newsletter-folder> [--out newsletter-audit.md]
//
// Exit codes: 0 = clean, 1 = FAIL, 2 = usage error.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, basename, join } from "node:path";

// ─── brand banner (deepak-skill · crafted by Deepak) ────────────────────────
const BRAND_LINE = "═".repeat(56);
const banner = (label) =>
  `\n${BRAND_LINE}\n  🎬 deepak-skill — crafted by Deepak\n  skill: newsletter-growth · ${label}\n${BRAND_LINE}\n`;
console.log(banner("audit-newsletter.mjs"));

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

const packArg = opt("pack");
if (!packArg) {
  console.error("Usage: node audit-newsletter.mjs --pack <newsletter-folder> [--out newsletter-audit.md]");
  process.exit(2);
}
const packDir = resolve(process.cwd(), packArg);
const outPath = resolve(process.cwd(), opt("out", "newsletter-audit.md"));
if (!existsSync(packDir)) {
  console.error(`❌ Newsletter folder not found: ${packDir}`);
  console.error("   Pass the pack folder (issue.md + growth-plan.md) — e.g. skills/newsletter-growth/examples/founder-welcome");
  process.exit(2);
}

const results = [];
const add = (status, check, detail) => results.push({ status, check, detail });

const read = (f) => (existsSync(join(packDir, f)) ? readFileSync(join(packDir, f), "utf8") : null);
const issue = read("issue.md");
if (!issue) {
  add("FAIL", "issue.md exists", "missing — the pack must ship issue.md");
} else {
  // subject line
  const subjMatch = issue.match(/^\*\*Subject:\*\*\s+(.+?)\s+— \*\(([^)]+)\)/m);
  if (subjMatch) {
    const subject = subjMatch[1].trim();
    if (subject.length <= 60) add("PASS", "subject length", `${subject.length}/60 chars`);
    else add("FAIL", "subject length", `${subject.length}/60 chars — over the inbox window`);
    add("PASS", "subject formula", `formula annotated: ${subjMatch[2]}`);
  } else {
    add("FAIL", "subject line", "no annotated subject line (`**Subject:** … — *(formula · n/60 chars)*`) — rebuild with issue-writer.mjs");
  }

  // story spine sections
  const hasSection = (h) => new RegExp(`^##\\s+${h}`, "m").test(issue);
  const hookSection = /^## The open \(hook\)/m.test(issue);
  const stakesSection = /^## The stakes/m.test(issue);
  const payoffSection = /^## The payoff/m.test(issue);
  if (hookSection && stakesSection && payoffSection) add("PASS", "story spine", "open → stakes → payoff sections present");
  else {
    const missing = [hookSection && "open", stakesSection && "stakes", payoffSection && "payoff"].filter((x) => !x);
    add("FAIL", "story spine", `missing section(s): ${missing.join(", ")}`);
  }

  // value receipts
  const bullets = (issue.match(/^-\s+/gm) || []).length;
  if (bullets >= 2) add("PASS", "value receipts", `${bullets} value bullet(s)`);
  else add("FAIL", "value receipts", `only ${bullets} bullet(s) — need ≥ 2 receipts`);

  // one CTA + one growth plug
  if (/^## One ask/m.test(issue)) add("PASS", "one CTA", "a single 'One ask' section present");
  else add("FAIL", "one CTA", "no '## One ask' section — exactly ONE primary CTA required");
  if (/^## Growth plug/m.test(issue)) add("PASS", "growth plug", "a single 'Growth plug' section present");
  else add("FAIL", "growth plug", "no '## Growth plug' section — exactly ONE referral/forward ask required");

  // word window (body = all non-header lines: skip headings and ** header/footer rows)
  const bodyLines = issue.split("\n").filter((l) => !/^#/.test(l) && !l.trim().startsWith("**"));
  const words = bodyLines.join(" ").trim().split(/\s+/).filter(Boolean).length;
  if (words >= 350 && words <= 900) add("PASS", "word window", `${words} words (350–900)`);
  else add("WARN", "word window", `${words} words — outside 350–900 (short issues under-deliver, long ones get skimmed)`);

  // anti-fluff
  const fluff = FLUFF.filter((w) => issue.toLowerCase().includes(w.toLowerCase()));
  if (!fluff.length) add("PASS", "anti-fluff", "no fluff words");
  else add("FAIL", "anti-fluff", fluff.join(", "));

  // specificity — numbers/receipts present
  if (/\d|%|\$|€|£/.test(issue)) add("PASS", "specificity", "numbers/receipts present (specific beats generic)");
  else add("WARN", "specificity", "no numbers, $, % — add a concrete stat, amount, or count");
}

if (!existsSync(join(packDir, "growth-plan.md"))) add("FAIL", "growth-plan.md exists", "missing — the growth plan ships with every issue");
else add("PASS", "growth-plan.md exists", "welcome sequence + referral loop + cross-promos present");

// ─── write newsletter-audit.md ──────────────────────────────────────────────
const fails = results.filter((r) => r.status === "FAIL");
const warns = results.filter((r) => r.status === "WARN");
const passes = results.filter((r) => r.status === "PASS");

const L = [];
L.push(`# Newsletter Audit — ${basename(packDir)}`);
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
L.push("### 2.1 Issue-worthiness scorecard (rate 1–5 each, /50 — an issue worth sending scores ≥ 35)");
L.push("");
L.push("| Criterion | Ask | Score /5 |");
L.push("|---|---|---|");
L.push("| **Subject pull** | Would YOU open this email in a full inbox? Does it match the issue? | |");
L.push("| **Story believability** | Is the story specific and true-sounding (not generic 'here's a lesson')? | |");
L.push("| **Open-loop strength** | Does the first line create a question the reader must close? | |");
L.push("| **Payoff quality** | Does the payoff deliver the aha the hook promised? | |");
L.push("| **Value receipts** | Do the value items prove the point with numbers/examples/names? | |");
L.push("| **CTA clarity** | One clear ask — reply/forward/click — impossible to miss? | |");
L.push("| **Growth plug** | One referral/forward ask that feels earned, not begged? | |");
L.push("| **Voice consistency** | Does it sound like the writer, not a template? | |");
L.push("| **Anti-fluff** | Every paragraph informs, proves, or entertains? | |");
L.push("| **Growth plan** | Is growth-plan.md specific enough to execute? | |");
L.push("");
L.push("### 2.2 Creative judgment calls");
L.push("");
L.push("- Any section that reads like filler (fluff rule)?");
L.push("- Would a subscriber forward this to one friend? If not, what's missing?");
L.push("- Is the CTA genuinely one ask, or two buried in the copy?");
L.push("");
L.push("### 2.3 Verdict");
L.push("");
L.push("- All PASS and scorecard ≥ 35 → mark **PASS** and sign below.");
L.push("- Any FAIL (or a WARN you judge real) → mark **FIX NEEDED** and list per-section fixes.");
L.push("");
L.push(`> Auditor verdict: **PENDING** · Auditor: _(subagent)_ · Date: ${new Date().toISOString().slice(0, 10)}`);
L.push("");

writeFileSync(outPath, L.join("\n"), "utf8");

console.log(`✅ newsletter-audit.md → ${basename(outPath)} (${passes.length} PASS · ${warns.length} WARN · ${fails.length} FAIL)`);
for (const r of results.filter((r) => r.status !== "PASS")) {
  console.log(`   ${r.status === "FAIL" ? "❌" : "⚠️"} ${r.check}: ${r.detail}`);
}
if (fails.length) {
  console.error(`❌ ${fails.length} automated FAIL(s) — fix and re-run before spawning the newsletter-auditor.`);
  process.exit(1);
}
console.log("Automated checks clean — now spawn the newsletter-auditor subagent (see SKILL.md Stage 6 / templates/newsletter-auditor-brief.md) to complete the scorecard + verdict in newsletter-audit.md.");
process.exit(0);
