#!/usr/bin/env node
// x-growth — the automated audit half of the x-auditor gate.
// Scans a growth pack (content-plan.md + posts.md) and checks everything a
// script can: posts parse + TOP-CREATOR FORMAT (500–800 chars, hook line ≤ 100
// chars, ≥ 3 lines, ≥ 2 bullets), ZERO hashtags (any "#" FAILs — the copy-first
// rail), story-spine post mix (hook → value → story/proof → cta/loop),
// anti-fluff + bait-spam blocklists, plan sections present (goal, pillars,
// cadence, engagement schedule, KPIs). Writes x-audit.md with automated
// verdicts + an AUDITOR section. Exit 1 on any FAIL.
//
// Usage:
//   node audit-x.mjs --pack <plan-folder> [--out x-audit.md]
//
// Exit codes: 0 = clean, 1 = FAIL, 2 = usage error.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, basename, join } from "node:path";

// ─── brand banner (deepak-skill · crafted by Deepak) ────────────────────────
const BRAND_LINE = "═".repeat(56);
const banner = (label) =>
  `\n${BRAND_LINE}\n  🎬 deepak-skill — crafted by Deepak\n  skill: x-growth · ${label}\n${BRAND_LINE}\n`;
console.log(banner("audit-x.mjs"));

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
  "follow for follow", "follow back", "engagement group",
];
const ROLE_TAGS = ["hook", "value", "story", "proof", "cta", "loop"];

// --- the TOP-CREATOR POST FORMAT contract (mirrors post-writer.mjs) ----------
const MIN_CHARS = 500;
const MAX_CHARS = 800;
const MAX_HOOK_LINE = 100;
const MIN_LINES = 3;
const MIN_BULLETS = 2;

const packArg = opt("pack");
if (!packArg) {
  console.error("Usage: node audit-x.mjs --pack <plan-folder> [--out x-audit.md]");
  process.exit(2);
}
const packDir = resolve(process.cwd(), packArg);
const outPath = resolve(process.cwd(), opt("out", "x-audit.md"));
if (!existsSync(packDir)) {
  console.error(`❌ Growth pack folder not found: ${packDir}`);
  console.error("   Pass the pack folder (content-plan.md + posts.md) — e.g. skills/x-growth/examples/founder-growth-plan");
  process.exit(2);
}

const results = [];
const add = (status, check, detail) => results.push({ status, check, detail });

const read = (f) => (existsSync(join(packDir, f)) ? readFileSync(join(packDir, f), "utf8") : null);
const plan = read("content-plan.md");
if (!plan) {
  add("FAIL", "content-plan.md exists", "missing — the pack must ship content-plan.md");
} else {
  add("PASS", "content-plan.md exists", "growth plan present");
  if (/## The growth rails[\s\S]*Zero hashtags/i.test(plan)) add("PASS", "zero-hashtag rail stated", "the plan declares the no-tags contract");
  else add("FAIL", "zero-hashtag rail stated", "plan missing the zero-hashtag rail — rebuild with post-writer.mjs");
  if (/## Weekly cadence/.test(plan)) add("PASS", "weekly cadence", "day-by-day post schedule present");
  else add("FAIL", "weekly cadence", "no cadence table — the plan must schedule the week");
  if (/## Engagement schedule/.test(plan)) add("PASS", "engagement schedule", "reply hour + quote posts + DM/follow rules present");
  else add("FAIL", "engagement schedule", "no engagement schedule — replies are the growth");
  if (/## KPIs/.test(plan)) add("PASS", "KPIs + day-7 review", "growth metrics + fix loop present");
  else add("FAIL", "KPIs + day-7 review", "no KPI table — a growth plan without metrics is a wish");
}

const posts = read("posts.md");
if (!posts) {
  add("FAIL", "posts.md exists", "missing — the pack must ship posts.md with the drafted copy");
} else {
  const items = [];
  for (const line of posts.split("\n")) {
    const m = line.match(/^### Post (\d+)\s*·\s*([a-z]+)\s*·\s*([^·]+?)\s*\*\((\d+)\/800 chars\)\*?\s*$/);
    if (!m) continue;
    items.push({ num: +m[1], role: m[2], pillar: m[3].trim(), len: +m[4] });
  }
  const bodies = posts.split(/^### Post \d+[^\n]*$/m).map((s) => s.trim()).filter(Boolean);

  if (items.length >= 7) add("PASS", "post count", `${items.length} posts (one week+)`);
  else add("FAIL", "post count", `only ${items.length} — a growth week needs ≥ 7`);

  const over = items.filter((p) => p.len > MAX_CHARS);
  if (!over.length) add("PASS", "800-char cap", "every post ≤ 800 chars (the top-creator window)");
  else add("FAIL", "800-char cap", `${over.length} post(s) over ${MAX_CHARS}: ${over.map((p) => `${p.num}:${p.len}c`).join(", ")}`);

  const thin = items.filter((p) => p.len < MIN_CHARS);
  if (!thin.length) add("PASS", "500-char floor", "every post ≥ 500 chars — none too thin to rank");
  else add("FAIL", "500-char floor", `${thin.length} post(s) under ${MIN_CHARS}: ${thin.map((p) => `${p.num}:${p.len}c`).join(", ")}`);

  const hashLines = posts.split("\n").filter((l) => l.includes("#"));
  const hashHits = hashLines.filter((l) => !l.startsWith("# ") && !l.startsWith("## ") && !l.startsWith("### "));
  if (!hashHits.length) add("PASS", "zero hashtags", "no hashtags anywhere in the copy — the copy-first rail holds");
  else add("FAIL", "zero hashtags", `hashtag(s) found: ${hashHits.map((l) => l.slice(0, 60)).join(" | ")} — delete every "#", none are allowed`);

  const formatIssues = [];
  items.forEach((p) => {
    const body = bodies[p.num] || "";
    const lines = body.split("\n").map((l) => l.trim()).filter(Boolean);
    const firstLine = lines[0] || "";
    const bullets = lines.filter((l) => /^[-•*]\s+/.test(l)).length;
    if (firstLine.length > MAX_HOOK_LINE) formatIssues.push(`post ${p.num}: hook line ${firstLine.length}c`);
    if (lines.length < MIN_LINES) formatIssues.push(`post ${p.num}: ${lines.length} lines`);
    if (bullets < MIN_BULLETS) formatIssues.push(`post ${p.num}: ${bullets} bullets`);
  });
  if (!formatIssues.length) add("PASS", "top-creator format", "every post: hook line ≤ 100 chars, ≥ 3 lines, ≥ 2 bullets — scannable micro-essays");
  else add("FAIL", "top-creator format", formatIssues.join(" · "));

  const roles = items.map((p) => p.role);
  const bad = items.filter((p) => !ROLE_TAGS.includes(p.role));
  if (!bad.length) add("PASS", "role annotations", "every post carries a valid role tag");
  else add("FAIL", "role annotations", bad.map((p) => `post ${p.num}: "${p.role}"`).join(", "));

  if (roles.includes("hook")) add("PASS", "hook post present", "a pure scroll-stop attention play exists");
  else add("FAIL", "hook post present", "no hook post — the week needs an attention play");
  if (roles.includes("value")) add("PASS", "value post present", "the week teaches something");
  else add("FAIL", "value post present", "no value post");
  if (roles.some((r) => r === "story" || r === "proof")) add("PASS", "story/proof post present", "the plan carries evidence/payoff");
  else add("FAIL", "story/proof post present", "no story/proof post — tips without evidence don't convert");
  if (roles.includes("cta") || roles.includes("loop")) add("PASS", "cta/loop post present", "the week converts the attention it earns");
  else add("FAIL", "cta/loop post present", "no cta/loop post — a growth plan must ask");

  if (items.length) {
    const noPillar = items.filter((p) => !p.pillar || p.pillar === "_").length;
    if (!noPillar) add("PASS", "pillar coverage", "every post is mapped to a pillar");
    else add("FAIL", "pillar coverage", `${noPillar} post(s) without a pillar tag`);
    const byPillar = new Map();
    for (const p of items) byPillar.set(p.pillar, (byPillar.get(p.pillar) || 0) + 1);
    const dead = [...byPillar.entries()].filter(([, n]) => n < 1);
    if (!dead.length && byPillar.size >= 3) add("PASS", "3+ pillars fed", `${byPillar.size} pillars, every one fed by posts`);
    else add("FAIL", "3+ pillars fed", `only ${byPillar.size} pillar(s) fed — the plan needs ≥ 3 live pillars`);
  }

  const fluff = [];
  const bait = [];
  items.forEach((p) => {
    const body = bodies[p.num] || "";
    for (const w of FLUFF) if (body.toLowerCase().includes(w)) fluff.push(`${w} (post ${p.num})`);
    for (const w of BAIT) if (body.toLowerCase().includes(w)) bait.push(`${w} (post ${p.num})`);
  });
  if (!fluff.length) add("PASS", "anti-fluff", "no fluff words");
  else add("FAIL", "anti-fluff", fluff.join(", "));
  if (!bait.length) add("PASS", "no bait-spam", "no RT/tag/follow bait");
  else add("FAIL", "no bait-spam", bait.join(", "));
}

// ─── write x-audit.md ─────────────────────────────────────────────────────────
const fails = results.filter((r) => r.status === "FAIL");
const warns = results.filter((r) => r.status === "WARN");
const passes = results.filter((r) => r.status === "PASS");

const L = [];
L.push(`# X Growth Audit — ${basename(packDir)}`);
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
L.push("### 2.1 Growth-plan worthiness scorecard (rate 1–5 each, /50 — a plan worth running scores ≥ 35)");
L.push("");
L.push("| Criterion | Ask | Score /5 |");
L.push("|---|---|---|");
L.push("| **Hook pull** | Would the FIRST LINES (hook lines ≤ 100 chars) stop the scroll for THIS audience? Do they open real loops? | |");
L.push("| **Value density** | Do the value posts teach something specific — not recycled advice? | |");
L.push("| **Evidence / story** | Do the story/proof posts land a payoff a reader can screenshot or cite? | |");
L.push("| **CTA strength** | Is the conversion post a clear, specific ask (follow/link/DM) that fits the goal? | |");
L.push("| **Series feel** | Does the week chain (hook → value → proof → CTA) so the account is worth following — not a random feed? | |");
L.push("| **Voice consistency** | Do ALL posts sound like the account, not a template? | |");
L.push("| **One idea per post** | Would any post be clearer split in two — or is it a wall of text with no line breaks? | |");
L.push("| **Copy-first, zero tags** | No hashtags, no keyword stuffing — does the copy carry the reach alone? | |");
L.push("| **Growth math** | Are the KPIs real and the day-7 fix loop specific enough to execute? | |");
L.push("| **Engagement plan** | Is the reply-hour + quote-post + DM schedule specific enough to execute daily? | |");
L.push("");
L.push("### 2.2 Creative judgment calls");
L.push("");
L.push("- Any post that violates the fluff rule (doesn't open a loop, raise stakes, or pay off)?");
L.push("- Is the weekly series genuinely serial (follow-worthy), or a pile of unrelated posts?");
L.push("- Would the hook posts get replies from the target audience, or just views?");
L.push("- Does the CTA post actually serve the stated growth goal (followers vs clicks vs DMs)?");
L.push("");
L.push("### 2.3 Verdict");
L.push("");
L.push("- All PASS and scorecard ≥ 35 → mark **PASS** and sign below.");
L.push("- Any FAIL (or a WARN you judge real) → mark **FIX NEEDED** and list per-post fixes.");
L.push("");
L.push(`> Auditor verdict: **PENDING** · Auditor: _(subagent)_ · Date: ${new Date().toISOString().slice(0, 10)}`);
L.push("");

writeFileSync(outPath, L.join("\n"), "utf8");

console.log(`✅ x-audit.md → ${basename(outPath)} (${passes.length} PASS · ${warns.length} WARN · ${fails.length} FAIL)`);
for (const r of results.filter((r) => r.status !== "PASS")) {
  console.log(`   ${r.status === "FAIL" ? "❌" : "⚠️"} ${r.check}: ${r.detail}`);
}
if (fails.length) {
  console.error(`❌ ${fails.length} automated FAIL(s) — fix and re-run before spawning the x-auditor.`);
  process.exit(1);
}
console.log("Automated checks clean — now spawn the x-auditor subagent (see SKILL.md Stage 6 / templates/x-auditor-brief.md) to complete the scorecard + verdict in x-audit.md.");
process.exit(0);