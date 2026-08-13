#!/usr/bin/env node
// x-threads-engagement — assemble + validate an X thread pack from a plan JSON.
// Enforces the repo's storytelling + addiction rails: hook ≤ 100 chars in tweet 1,
// ≤ 280 chars per tweet, one idea per tweet, story-spine roles (open loop → rising
// → payoff → CTA/loop), anti-fluff + bait-spam blocklists. Exits 1 on any FAIL.
//
// Usage:
//   node thread-writer.mjs --plan thread-plan.json [--out thread.md]
//
// Exit codes: 0 = pack assembled, 1 = plan FAIL, 2 = usage error.
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

// ─── brand banner (deepak-skill · crafted by Deepak) ────────────────────────
const BRAND_LINE = "═".repeat(56);
const banner = (label) =>
  `\n${BRAND_LINE}\n  🎬 deepak-skill — crafted by Deepak\n  skill: x-threads-engagement · ${label}\n${BRAND_LINE}\n`;
console.log(banner("thread-writer.mjs"));

// --- tiny arg parser (same style as the other skill scripts) ----------------
const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const needle = `--${name}`;
  const found = args.find((a) => a === needle || a.startsWith(`${needle}=`));
  if (found === undefined) return fallback;
  const eq = found.indexOf("=");
  return eq !== -1 ? found.slice(eq + 1) : args[args.indexOf(found) + 1];
};

// --- the repo's anti-fluff contract, plus X bait-spam patterns --------------
const FLUFF = [
  "unlock", "game-changer", "elevate", "supercharge", "level up", "unleash",
  "boost", "empower", "revolutionize", "optimize", "leverage", "journey",
  "transform your", "skyrocket", "crush it", "secrets to", "amazing", "guaranteed",
];
const BAIT = [
  "rt if", "retweet if", "like if", "tag someone", "share if you agree",
  "follow for follow",
];
const ROLES = new Set(["hook", "open-loop", "rising", "payoff", "value", "cta", "loop"]);

const planPath = opt("plan");
const outPath = resolve(opt("out", "thread.md"));
if (!planPath) {
  console.error("Usage: node thread-writer.mjs --plan thread-plan.json [--out thread.md]");
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
const warns = [];
const check = (ok, label, detail) => { if (!ok) fails.push(`${label} — ${detail}`); };
const hasFluff = (t) => FLUFF.find((w) => t.toLowerCase().includes(w.toLowerCase()));
const hasBait = (t) => BAIT.find((w) => t.toLowerCase().includes(w.toLowerCase()));

const topic = (plan.topic || "").trim();
const hook = (plan.hook || "").trim();
const tweets = Array.isArray(plan.tweets) ? plan.tweets : [];

check(topic, "topic", "plan.topic missing");
check(hook, "hook", "plan.hook missing");
check(tweets.length >= 3, "tweet count", `need ≥ 3 tweets, got ${tweets.length}`);
check(hook.length <= 100, "hook length", `${hook.length}/100 chars — the hook must fit the first tweet's attention window`);

const hookFluff = hasFluff(hook);
if (hookFluff) fails.push(`hook — fluff word "${hookFluff}"`);
const hookBait = hasBait(hook);
if (hookBait) fails.push(`hook — bait-spam "${hookBait}"`);

const items = [];
tweets.forEach((t, i) => {
  const text = (t.text || "").trim();
  const role = (t.role || "").trim();
  check(text, `tweet ${i + 1}`, "missing text");
  check(role && ROLES.has(role), `tweet ${i + 1}`, `role "${role}" not in ${[...ROLES].join(" / ")}`);
  check(text.length <= 280, `tweet ${i + 1}`, `${text.length}/280 chars`);
  const f = hasFluff(text);
  if (f) fails.push(`tweet ${i + 1} — fluff word "${f}"`);
  const b = hasBait(text);
  if (b) fails.push(`tweet ${i + 1} — bait-spam "${b}"`);
  items.push({ text, role, len: text.length });
});

// story-spine order: open the loop → escalate → pay off → CTA/loop
const roles = items.map((i) => i.role);
if (items.length) {
  const first = roles[0];
  const last = roles[roles.length - 1];
  check(["hook", "open-loop"].includes(first), "story spine", `tweet 1 must open the loop (role hook/open-loop), got "${first}"`);
  check(["cta", "loop"].includes(last), "story spine", `last tweet must be the CTA/loop, got "${last}"`);
  check(roles.includes("payoff"), "story spine", "no payoff tweet — the open loop must close before the CTA");
  check(roles.slice(1, -1).some((r) => r === "rising" || r === "value"), "story spine", "no rising/value tweets — the middle must escalate before the payoff");
}

if (fails.length) {
  console.error(`❌ thread plan FAIL (${fails.length}):`);
  for (const f of fails) console.error(`   - ${f}`);
  console.error("Fix thread-plan.json and re-run — nothing was written.");
  process.exit(1);
}

const L = [];
L.push(`# Thread — ${topic}`);
L.push("");
L.push(`**Formula:** ${plan.formula || "—"} · **Goal:** ${plan.goal || "engagement"} · **Audience:** ${plan.audience || "—"}`);
L.push(`**Hook:** ${hook} — *(${hook.length}/100 chars)*`);
L.push("");
L.push("## The thread");
L.push("");
items.forEach((t, i) => {
  L.push(`${i + 1}. ${t.text}  *(${t.role} · ${t.len}/280 chars)*`);
});
L.push("");
L.push("## After posting");
L.push("");
L.push("Follow the reply-first hour + quote-post ritual in `engagement.md` — the replies are the growth.");
L.push("");
writeFileSync(outPath, L.join("\n"), "utf8");

console.log(`✅ Thread assembled → ${outPath} (${items.length} tweets · hook ${hook.length}/100)`);
for (const w of warns) console.log(`   ⚠️ ${w}`);
process.exit(0);
