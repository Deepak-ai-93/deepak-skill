#!/usr/bin/env node
// content-repurposing-hub — the automated audit half of the repurpose-auditor
// gate. Scans a hub pack (hub-plan.md + calendar.md) and checks everything a
// script can: source + story present, ≥ 2 platforms, per-platform
// format/angle/hook/cta, no near-duplicate hooks (anti-repost rule), hooks
// ≤ 280 chars, fluff blocklist, calendar.md present with staggering. Writes
// repurpose-audit.md with automated verdicts + an AUDITOR section. Exit 1 on any FAIL.
//
// Usage:
//   node audit-repurpose.mjs --pack <hub-folder> [--out repurpose-audit.md]
//
// Exit codes: 0 = clean, 1 = FAIL, 2 = usage error.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, basename, join } from "node:path";

// ─── brand banner (deepak-skill · crafted by Deepak) ────────────────────────
const BRAND_LINE = "═".repeat(56);
const banner = (label) =>
  `\n${BRAND_LINE}\n  🎬 deepak-skill — crafted by Deepak\n  skill: content-repurposing-hub · ${label}\n${BRAND_LINE}\n`;
console.log(banner("audit-repurpose.mjs"));

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
  console.error("Usage: node audit-repurpose.mjs --pack <hub-folder> [--out repurpose-audit.md]");
  process.exit(2);
}
const packDir = resolve(process.cwd(), packArg);
const outPath = resolve(process.cwd(), opt("out", "repurpose-audit.md"));
if (!existsSync(packDir)) {
  console.error(`❌ Hub folder not found: ${packDir}`);
  console.error("   Pass the pack folder (hub-plan.md + calendar.md)");
  process.exit(2);
}

const results = [];
const add = (status, check, detail) => results.push({ status, check, detail });
const read = (f) => (existsSync(join(packDir, f)) ? readFileSync(join(packDir, f), "utf8") : null);

const hub = read("hub-plan.md");
if (hub) {
  // source + story
  if (/Source:/.test(hub) && /The ONE story:/.test(hub)) add("PASS", "source + story", "source and the ONE story locked in the header");
  else add("FAIL", "source + story", "missing source or 'The ONE story' in hub-plan.md");

  // platform count
  const platforms = (hub.match(/^### \d+\. .+$/gm) || []).length;
  if (platforms >= 2) add("PASS", "platform count", `${platforms} platform piece(s) — ≥ 2`);
  else add("FAIL", "platform count", `only ${platforms} — need ≥ 2 (or 1 + the source's home)`);

  // per-platform fields (literal search — field names contain parens)
  const cards = hub.split(/^### \d+\. /gm).slice(1);
  let missingFields = 0;
  for (const c of cards) {
    for (const f of ["Format", "Native angle", "Hook (unique)", "CTA"]) {
      if (!c.includes(`**${f}**`)) missingFields++;
    }
  }
  if (!missingFields) add("PASS", "per-platform fields", "every card has format + angle + hook + CTA");
  else add("WARN", "per-platform fields", `${missingFields} missing card field(s) (format/angle/hook/CTA)`);

  // no near-duplicate hooks (anti-repost rule)
  const hooks = [...hub.matchAll(/\| \*\*Hook \(unique\)\*\* \| "([^"]+)"/g)].map((m) => m[1]);
  const norm = (s) => s.toLowerCase().replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter((w) => w.length > 3);
  let dupe = null;
  for (let i = 0; i < hooks.length; i++) {
    for (let j = i + 1; j < hooks.length; j++) {
      const a = norm(hooks[i]);
      const b = norm(hooks[j]);
      if (!a.length || !b.length) continue;
      const overlap = a.filter((w) => b.includes(w)).length / Math.min(a.length, b.length);
      if (overlap >= 0.6) dupe = `${hooks[i]} || ${hooks[j]}`;
    }
  }
  if (dupe) add("FAIL", "anti-repost", `near-duplicate hooks: ${dupe}`);
  else add("PASS", "anti-repost", `${hooks.length} unique hook(s) — no copy-paste reposts`);

  // hook length
  const long = hooks.filter((h) => h.length > 280);
  if (!long.length) add("PASS", "hook length", `${hooks.length} hook(s), all ≤ 280 chars`);
  else add("FAIL", "hook length", `${long.length} hook(s) over 280 chars`);

  // fluff
  const hit = FLUFF.filter((f) => hub.toLowerCase().includes(f.toLowerCase()));
  if (!hit.length) add("PASS", "anti-fluff", "no fluff words in the plan");
  else add("FAIL", "anti-fluff", hit.join(", "));
} else {
  add("FAIL", "hub-plan.md", "missing hub-plan.md — run repurpose-writer.mjs first");
}

// calendar
const cal = read("calendar.md");
if (cal) {
  if (/day|date|lead|stagger|producer/i.test(cal)) add("PASS", "calendar.md", "calendar present with stagger + producer + order");
  else add("WARN", "calendar.md", "calendar.md exists but needs the cross-post order + spacing");
} else {
  add("FAIL", "calendar.md", "missing calendar.md — the cross-post order ships with the pack");
}

// ─── write repurpose-audit.md ───────────────────────────────────────────────
const fails = results.filter((r) => r.status === "FAIL");
const warns = results.filter((r) => r.status === "WARN");
const passes = results.filter((r) => r.status === "PASS");

const L = [];
L.push(`# Repurposing Hub Audit — ${basename(packDir)}`);
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
L.push("### 2.1 Hub-worthiness scorecard (rate 1–5 each, /50 — a hub worth shipping scores ≥ 35)");
L.push("");
L.push("| Criterion | Ask | Score /5 |");
L.push("|---|---|---|");
L.push("| **One story** | Do ALL pieces carry the same story/aha from the source? | |");
L.push("| **Native angles** | Is each angle truly native to its platform (not the same post with a different header)? | |");
L.push("| **Hook variety** | Would each hook stop a scroller on THAT platform (native length + format)? | |");
L.push("| **No reposts** | No piece reads as a copy-paste of another or of the source? | |");
L.push("| **Platform fit** | X = thread, LinkedIn = story/lesson, newsletter = issue, carousel = slides, blog = SEO article, Shorts = clip? | |");
L.push("| **CTA quality** | Every piece has exactly ONE CTA that matches its platform? | |");
L.push("| **Producer handoff** | Every card names the producer skill that will build it? | |");
L.push("| **Calendar** | Staggered order (no same-day self-competing), lead platform first? | |");
L.push("| **Audience fit** | Are the chosen platforms where the audience actually lives? | |");
L.push("| **Ship-readiness** | Would you hand this plan to the producer skills today? | |");
L.push("");
L.push("### 2.2 Creative judgment calls");
L.push("");
L.push("- Does any piece open the loop on a platform but fail to pay off (story drift)?");
L.push("- Would a subscriber see the same story twice in their feed across channels — is the calendar truly staggered?");
L.push("- Is the goal served (each CTA moves reach/followers/subscribers/SEO/sales)?");
L.push("");
L.push("### 2.3 Verdict");
L.push("");
L.push("- All PASS and scorecard ≥ 35 → mark **PASS** and sign below.");
L.push("- Any FAIL (or a WARN you judge real) → mark **FIX NEEDED** and list per-piece fixes.");
L.push("");
L.push(`> Auditor verdict: **PENDING** · Auditor: _(subagent)_ · Date: ${new Date().toISOString().slice(0, 10)}`);
L.push("");

writeFileSync(outPath, L.join("\n"), "utf8");

console.log(`✅ repurpose-audit.md → ${basename(outPath)} (${passes.length} PASS · ${warns.length} WARN · ${fails.length} FAIL)`);
for (const r of results.filter((r) => r.status !== "PASS")) {
  console.log(`   ${r.status === "FAIL" ? "❌" : "⚠️"} ${r.check}: ${r.detail}`);
}
if (fails.length) {
  console.error(`❌ ${fails.length} automated FAIL(s) — fix and re-run before spawning the repurpose-auditor.`);
  process.exit(1);
}
console.log("Automated checks clean — now spawn the repurpose-auditor subagent (see SKILL.md Stage 6 / templates/repurpose-auditor-brief.md) to complete the scorecard + verdict in repurpose-audit.md.");
process.exit(0);
