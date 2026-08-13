#!/usr/bin/env node
// newsletter-growth — assemble + validate a story-first newsletter issue from a
// plan JSON. Enforces the repo's storytelling + addiction rails: subject ≤ 60
// chars with a formula, story spine (hook opens a loop → conflict → payoff),
// 2+ value items with receipts, ONE CTA + ONE growth plug, anti-fluff
// blocklist. Exits 1 on any FAIL.
//
// Usage:
//   node issue-writer.mjs --plan issue-plan.json [--out issue.md]
//
// Exit codes: 0 = issue assembled, 1 = plan FAIL, 2 = usage error.
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

// ─── brand banner (deepak-skill · crafted by Deepak) ────────────────────────
const BRAND_LINE = "═".repeat(56);
const banner = (label) =>
  `\n${BRAND_LINE}\n  🎬 deepak-skill — crafted by Deepak\n  skill: newsletter-growth · ${label}\n${BRAND_LINE}\n`;
console.log(banner("issue-writer.mjs"));

// --- tiny arg parser (same style as the other skill scripts) ----------------
const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const needle = `--${name}`;
  const found = args.find((a) => a === needle || a.startsWith(`${needle}=`));
  if (found === undefined) return fallback;
  const eq = found.indexOf("=");
  return eq !== -1 ? found.slice(eq + 1) : args[args.indexOf(found) + 1];
};

// --- the repo's anti-fluff contract -----------------------------------------
const FLUFF = [
  "unlock", "game-changer", "elevate", "supercharge", "level up", "unleash",
  "boost", "empower", "revolutionize", "optimize", "leverage", "journey",
  "transform your", "skyrocket", "crush it", "secrets to", "amazing", "guaranteed",
];

const planPath = opt("plan");
const outPath = resolve(opt("out", "issue.md"));
if (!planPath) {
  console.error("Usage: node issue-writer.mjs --plan issue-plan.json [--out issue.md]");
  process.exit(2);
}

let plan;
try {
  plan = JSON.parse(readFileSync(resolve(planPath), "utf8"));
} catch (e) {
  console.error(`❌ Cannot read plan ${planPath}: ${e.message}`);
  process.exit(1);
}

const fails = [];
const check = (ok, label, detail) => { if (!ok) fails.push(`${label} — ${detail}`); };
const hasFluff = (t) => FLUFF.find((w) => t.toLowerCase().includes(w.toLowerCase()));
const scan = (text, label) => {
  const f = hasFluff(text);
  if (f) fails.push(`${label} — fluff word "${f}"`);
};

const topic = (plan.topic || "").trim();
const subject = (plan.subject || "").trim();
const formula = (plan.subjectFormula || "").trim();
const story = plan.story || {};
const value = Array.isArray(plan.value) ? plan.value : [];
const cta = (plan.cta || "").trim();
const growthPlug = (plan.growthPlug || "").trim();

check(topic, "topic", "plan.topic missing");
check(subject, "subject", "plan.subject missing");
check(subject.length <= 60, "subject length", `${subject.length}/60 chars — the subject must fit the inbox window`);
check(formula, "subject formula", "plan.subjectFormula missing — pick one from templates/issue-template.md");
check((story.hook || "").trim(), "story hook", "plan.story.hook missing — the issue must open a loop");
check((story.conflict || "").trim(), "story conflict", "plan.story.conflict missing — the middle must raise the stakes");
check((story.payoff || "").trim(), "story payoff", "plan.story.payoff missing — the open loop must close");
check(value.length >= 2, "value items", `need ≥ 2 value receipts, got ${value.length}`);
check(cta, "cta", "plan.cta missing — exactly ONE primary ask");
check(growthPlug, "growth plug", "plan.growthPlug missing — exactly ONE referral/forward ask");

scan(subject, "subject");
scan(`${story.hook} ${story.conflict} ${story.payoff}`, "story");
value.forEach((v, i) => scan(String(v), `value item ${i + 1}`));
scan(cta, "cta");
scan(growthPlug, "growth plug");

if (fails.length) {
  console.error(`❌ issue plan FAIL (${fails.length}):`);
  for (const f of fails) console.error(`   - ${f}`);
  console.error("Fix issue-plan.json and re-run — nothing was written.");
  process.exit(1);
}

const wordCount = (s) => s.trim().split(/\s+/).filter(Boolean).length;

const L = [];
L.push(`# ${topic} — issue draft`);
L.push("");
L.push(`**Subject:** ${subject} — *(${formula} · ${subject.length}/60 chars)*`);
L.push(`**Audience:** ${plan.audience || "—"} · **Voice:** ${plan.voice || "—"} · **Goal:** ${plan.goal || "opens"}`);
L.push("");
L.push("## The open (hook)");
L.push("");
L.push(story.hook.trim());
L.push("");
L.push("## The stakes (rising tension)");
L.push("");
L.push(story.conflict.trim());
L.push("");
L.push("## The payoff");
L.push("");
L.push(story.payoff.trim());
L.push("");
L.push("## Value — the receipts");
L.push("");
value.forEach((v) => L.push(`- ${v}`));
L.push("");
L.push("## One ask");
L.push("");
L.push(cta);
L.push("");
L.push("## Growth plug");
L.push("");
L.push(growthPlug);
L.push("");
const body = [story.hook, story.conflict, story.payoff, ...value, cta, growthPlug].join(" ");
L.push(`**Word count:** ${wordCount(body)} · **Read time:** ~${Math.max(1, Math.round(wordCount(body) / 200))} min`);
L.push("");
writeFileSync(outPath, L.join("\n"), "utf8");

console.log(`✅ Issue assembled → ${outPath} (subject ${subject.length}/60 · ${wordCount(body)} words)`);
process.exit(0);
