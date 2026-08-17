#!/usr/bin/env node
// content-repurposing-hub — the plan builder half of the repurpose-auditor
// gate. Assembles a multi-platform content plan from a validated plan
// (repurpose-plan.json): source + story + audience + goal + cta, plus ≥ 2
// platforms, each with format / angle / hook / producer / cta. Writes
// hub-plan.md with the angle bank + per-platform cards — the handoff to the
// producer skills (x-threads-engagement, newsletter-growth, carousel-post-images,
// blog-seo-content, podcast-to-shorts, linkedin-personal-brand, …).
// Self-verifies every constraint — most importantly the anti-repost rule:
// no near-duplicate hooks across platforms (normalized overlap). Exit 1 on FAIL.
//
// Usage:
//   node repurpose-writer.mjs --plan repurpose-plan.json --out hub-plan.md
//
// Exit codes: 0 = clean, 1 = FAIL (bad plan), 2 = usage error.
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

// ─── brand banner (deepak-skill · crafted by Deepak) ────────────────────────
const BRAND_LINE = "═".repeat(56);
const banner = (label) =>
  `\n${BRAND_LINE}\n  🎬 deepak-skill — crafted by Deepak\n  skill: content-repurposing-hub · ${label}\n${BRAND_LINE}\n`;
console.log(banner("repurpose-writer.mjs"));

// --- tiny arg parser (same style as the other skill scripts) ----------------
const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const needle = `--${name}`;
  const found = args.find((a) => a === needle || a.startsWith(`${needle}=`));
  if (found === undefined) return fallback;
  const eq = found.indexOf("=");
  return eq !== -1 ? found.slice(eq + 1) : args[args.indexOf(found) + 1];
};

const planArg = opt("plan");
if (!planArg) {
  console.error("Usage: node repurpose-writer.mjs --plan repurpose-plan.json --out hub-plan.md");
  process.exit(2);
}
const outPath = resolve(process.cwd(), opt("out", "hub-plan.md"));

let plan;
try {
  plan = JSON.parse(readFileSync(resolve(process.cwd(), planArg), "utf8"));
} catch (e) {
  console.error(`❌ Cannot read plan "${planArg}": ${e.message}`);
  process.exit(2);
}

const FLUFF = [
  "unlock", "game-changer", "elevate", "supercharge", "level up", "unleash",
  "boost", "empower", "revolutionize", "optimize", "leverage", "journey",
  "transform your", "skyrocket", "crush it", "secrets to", "amazing", "guaranteed",
];
const PLATFORM_FORMATS = [
  "thread", "post", "issue", "carousel", "article", "short", "clip", "newsletter",
];

const fails = [];
const warns = [];

// --- validate the plan ------------------------------------------------------
if (!plan.source || !plan.story) fails.push("plan must have source and story");
if (!plan.platforms || !Array.isArray(plan.platforms)) {
  fails.push("plan must have platforms[]");
} else {
  if (plan.platforms.length < 2) fails.push(`need ≥ 2 platforms, got ${plan.platforms.length}`);
  const seen = new Set();
  for (const p of plan.platforms) {
    if (!p.platform) fails.push("every platform needs a platform name");
    else if (seen.has(p.platform.toLowerCase())) warns.push(`duplicate platform entry: ${p.platform}`);
    seen.add((p.platform || "").toLowerCase());
    if (!p.format) fails.push(`platform "${p.platform || "?"}" needs a format`);
    else if (!PLATFORM_FORMATS.includes(p.format)) warns.push(`platform "${p.platform}" format "${p.format}" not in known list: ${PLATFORM_FORMATS.join("/")}`);
    if (!p.angle) fails.push(`platform "${p.platform || "?"}" needs an angle (the native entry point)`);
    if (!p.hook) fails.push(`platform "${p.platform || "?"}" needs a hook`);
    if (p.hook && p.hook.length > 280) fails.push(`platform "${p.platform}" hook is ${p.hook.length} chars — over 280`);
    if (!p.producer) warns.push(`platform "${p.platform || "?"}" has no producer skill named — add it so the plan is executable`);
    if (!p.cta) warns.push(`platform "${p.platform || "?"}" has no CTA — every piece needs one`);
  }

  // anti-repost rule: no near-duplicate hooks
  const norm = (s) =>
    s.toLowerCase().replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter((w) => w.length > 3);
  const hooks = plan.platforms.filter((p) => p.hook).map((p) => ({ p, words: norm(p.hook) }));
  for (let i = 0; i < hooks.length; i++) {
    for (let j = i + 1; j < hooks.length; j++) {
      const a = hooks[i].words;
      const b = hooks[j].words;
      if (!a.length || !b.length) continue;
      const overlap = a.filter((w) => b.includes(w)).length / Math.min(a.length, b.length);
      if (overlap >= 0.6) {
        fails.push(`near-duplicate hooks: "${hooks[i].p.platform}" and "${hooks[j].p.platform}" overlap ${Math.round(overlap * 100)}% — the anti-repost rule requires native angles`);
      }
    }
  }
}

for (const p of plan.platforms || []) {
  const lower = `${p.angle || ""} ${p.hook || ""}`.toLowerCase();
  const hit = FLUFF.find((f) => lower.includes(f));
  if (hit) fails.push(`platform "${p.platform || "?"}" hits the fluff blocklist: "${hit}"`);
}

if (fails.length) {
  console.error(`❌ ${fails.length} plan FAIL(s):`);
  for (const f of fails) console.error(`   • ${f}`);
  console.error("   Fix repurpose-plan.json and re-run — nothing was written.");
  process.exit(1);
}
for (const w of warns) console.log(`  ⚠️  ${w}`);

// --- build the pack ----------------------------------------------------------
const L = [];
L.push("# Repurposing Hub Plan", "");
L.push(`**Source:** ${plan.source}`);
L.push(`**The ONE story:** ${plan.story}`);
L.push(`**Audience:** ${plan.audience || "—"} · **Goal:** ${plan.goal || "—"} · **Primary CTA:** ${plan.cta || "—"}`);
L.push("");
L.push("Same story, native retelling on every platform. Each piece opens a different loop, escalates in its platform's native format, pays off with the same aha, and closes with its own CTA. No copy-paste reposts — every hook is unique (script-verified).", "");
L.push("## Angle bank (extracted from the source)", "");
L.push("- **Hook / entry points:** " + (plan.hooks ? plan.hooks.join(" · ") : "per-platform hooks below"));
L.push("- **Key beats:** " + (plan.beats ? plan.beats.join(" · ") : "—"));
L.push("- **The aha:** " + (plan.aha || plan.story));
L.push("- **Quotable line:** " + (plan.quote || "—"));
L.push("- **Proof:** " + (plan.proof || "—"));
L.push("");

L.push("## Per-platform cards (handoff to the producer skills)", "");
plan.platforms.forEach((p, i) => {
  L.push(`### ${i + 1}. ${p.platform}`, "");
  L.push(`| | |`);
  L.push(`|---|---|`);
  L.push(`| **Format** | ${p.format} |`);
  L.push(`| **Native angle** | ${p.angle} |`);
  L.push(`| **Hook (unique)** | "${p.hook}" |`);
  L.push(`| **Producer skill** | ${p.producer || "_name the producer skill (x-threads-engagement / newsletter-growth / carousel-post-images / blog-seo-content / podcast-to-shorts / linkedin-personal-brand / youtube-video-pipeline)_"} |`);
  L.push(`| **CTA** | ${p.cta || "_add one platform-native CTA_"} |`);
  L.push("");
});

L.push("---", "Next: write calendar.md (staggered cross-post order, lead platform first), then run `audit-repurpose.mjs` → repurpose-auditor subagent before shipping. Then delegate each card to its producer skill.");

writeFileSync(outPath, L.join("\n"), "utf8");
console.log(`✅ hub-plan.md → ${outPath} (${plan.platforms.length} platform pieces, anti-repost verified)`);
console.log("Next: write calendar.md then run audit-repurpose.mjs → repurpose-auditor subagent.");
process.exit(0);
