#!/usr/bin/env node
// The linkedin-personal-brand audit harness — the automated half of the
// brand-auditor gate. Scans a delivered LinkedIn brand pack and checks what a
// script CAN check: voice-profile.md (positioning + tone rules + topic pillars
// + proof arsenal), bio.md (headline + About in the captured voice, no
// buzzwords), calendar.md (2–5 posts, varied roles, one CTA each, posting
// times), and engagement.md (comment targets, connection note, monthly CTA).
// Writes brand-audit.md with the automated verdicts + an AUDITOR section for
// the subagent (voice authenticity, E-E-A-T judgment). Exit 1 on any FAIL.
//
// Usage:
//   node audit-brand.mjs --pack <brand-folder> [--out brand-audit.md]
//
// The folder should contain: voice-profile.md, bio.md, calendar.md,
// engagement.md (subsets are allowed — missing files are FAIL but the audit
// continues).
//
// Exit codes: 0 = all automated checks PASS, 1 = any FAIL, 2 = usage error.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, basename, join } from "node:path";

// ─── brand banner (deepak-skill · crafted by Deepak) ────────────────────────
const BRAND_LINE = "═".repeat(56);
const banner = (label) =>
  `\n${BRAND_LINE}\n  🎬 deepak-skill — crafted by Deepak\n  skill: linkedin-personal-brand · ${label}\n${BRAND_LINE}\n`;
console.log(banner("audit-brand.mjs"));

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
  console.error("Usage: node audit-brand.mjs --pack <brand-folder> [--out brand-audit.md]");
  process.exit(2);
}
const packDir = resolve(process.cwd(), packArg);
const outPath = resolve(process.cwd(), opt("out", "brand-audit.md"));
if (!existsSync(packDir)) {
  console.error(`❌ Brand folder not found: ${packDir}`);
  console.error("   Pass the folder that holds voice-profile.md / bio.md / calendar.md / engagement.md");
  process.exit(2);
}

const read = (f) => (existsSync(join(packDir, f)) ? readFileSync(join(packDir, f), "utf8") : null);

// ─── results collector ──────────────────────────────────────────────────────
const results = []; // { status: "PASS"|"FAIL"|"WARN", check, detail }
const add = (status, check, detail) => results.push({ status, check, detail });
let auditSections = [];

// the shared buzzword blocklist (from templates/post-formulas.md)
const BUZZWORDS = [
  "passionate", "guru", "ninja", "thought leader", "synergy", "game-changer",
  "elevate", "supercharge", "unlock", "journey", "leverage",
  "in today's fast-paced world", "agreed?", "who else feels", "like this post if",
];

// ─── voice-profile.md ───────────────────────────────────────────────────────
const voice = read("voice-profile.md");
if (!voice) {
  add("FAIL", "voice-profile.md exists", "missing — the voice must be captured FIRST (non-negotiable)");
} else {
  if (/positioning|positioning statement/i.test(voice)) add("PASS", "voice positioning", "positioning statement present");
  else add("WARN", "voice positioning", "no positioning statement found");
  if (/tone|would never use|never|phrasing|words/i.test(voice)) add("PASS", "voice tone rules", "tone rules from real phrasing present");
  else add("WARN", "voice tone rules", "no tone rules found");
  if (/topic pillar|pillar|proof arsenal|wins|stories/i.test(voice)) add("PASS", "voice pillars + proof", "topic pillars + proof arsenal present");
  else add("WARN", "voice pillars + proof", "no topic pillars / proof arsenal found");
  const buzz = BUZZWORDS.filter((w) => new RegExp(`\\b${w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`, "i").test(voice));
  if (buzz.length) add("WARN", "voice anti-buzzword", `blocklisted in the voice profile: ${buzz.join(", ")} — the person's voice shouldn't use these`);
  else add("PASS", "voice anti-buzzword", "no buzzwords in the voice profile");
}

// ─── bio.md ─────────────────────────────────────────────────────────────────
const bio = read("bio.md");
if (!bio) {
  add("FAIL", "bio.md exists", "missing — headline + About rewrite required");
} else {
  const buzz = BUZZWORDS.filter((w) => new RegExp(`\\b${w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`, "i").test(bio));
  if (buzz.length) add("FAIL", "bio anti-buzzword", `blocklisted: ${buzz.join(", ")}`);
  else add("PASS", "bio anti-buzzword", "blocklist clear");
  const headline = bio.match(/headline[:：]?\s*["“']?([^"”\n]{0,260})/i);
  if (headline) {
    const h = headline[1].trim();
    if (h.length <= 220) add("PASS", "bio headline length", `${h.length} chars (≤ 220 target)`);
    else add("WARN", "bio headline length", `${h.length} chars — over the ~220 target`);
  } else {
    add("WARN", "bio headline", "no explicit headline line found");
  }
  if (/story|proof|number|result|client|metric|\d/i.test(bio)) add("PASS", "bio proof", "story/proof/numbers present");
  else add("WARN", "bio proof", "no proof elements (numbers/stories) found");
  if (/CTA|DM|subscribe|download|consult|waitlist/i.test(bio)) add("PASS", "bio CTA", "one CTA present");
  else add("WARN", "bio CTA", "no CTA found");
  const words = (bio.match(/\S+/g) || []).length;
  auditSections.push(`${words} words in the bio`);
}

// ─── calendar.md ────────────────────────────────────────────────────────────
const calendar = read("calendar.md");
if (!calendar) {
  add("FAIL", "calendar.md exists", "missing — the weekly post calendar is required");
} else {
  const posts = (calendar.match(/^\s*(?:#{1,3}\s+|[-*]\s+|###?\s*Post\s*\d|Post\s*\d)/gm) || []).length;
  if (posts >= 2) add("PASS", "calendar post count", `${posts} post(s) found (target 2–5)`);
  else if (posts) add("WARN", "calendar post count", `${posts} post(s) — the contract is 2–5`);
  else add("FAIL", "calendar post count", "no post blocks found");
  const roles = (calendar.match(/story|teaching|contrarian|win|question/i) || []).length;
  if (roles >= 3) add("PASS", "calendar role variety", `${roles} role marker(s) — varied, not all the same kind`);
  else add("WARN", "calendar role variety", `only ${roles} role marker(s) — vary story/teaching/contrarian/win/question`);
  const ctas = (calendar.match(/CTA|comment|repost|DM|follow|share/i) || []).length;
  if (ctas) add("PASS", "calendar CTAs", `${ctas} CTA reference(s)`);
  else add("WARN", "calendar CTAs", "no CTAs found — one per post");
  if (/day|time|morning|evening|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday/i.test(calendar)) add("PASS", "calendar posting times", "posting days/times set");
  else add("WARN", "calendar posting times", "no posting days/times set");
  const buzz = BUZZWORDS.filter((w) => new RegExp(`\\b${w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`, "i").test(calendar));
  if (buzz.length) add("FAIL", "calendar anti-buzzword", `blocklisted: ${buzz.join(", ")}`);
  else add("PASS", "calendar anti-buzzword", "blocklist clear");
}

// ─── engagement.md ──────────────────────────────────────────────────────────
const engagement = read("engagement.md");
if (!engagement) {
  add("FAIL", "engagement.md exists", "missing — comment + connection strategy required");
} else {
  if (/comment|target|account/i.test(engagement)) add("PASS", "engagement comment targets", "comment strategy present");
  else add("WARN", "engagement comment targets", "no comment-target strategy found");
  if (/connect|connection|note/i.test(engagement)) add("PASS", "engagement connections", "connection note template present");
  else add("WARN", "engagement connections", "no connection strategy found");
  if (/CTA|drive|newsletter|consult|waitlist|profile/i.test(engagement)) add("PASS", "engagement monthly CTA", "monthly profile CTA plan present");
  else add("WARN", "engagement monthly CTA", "no monthly CTA plan found");
  if (/great post|nice post|Great post/i.test(engagement)) add("WARN", "engagement insight rule", "check the how-to-comment rule — 'Great post!' alone is banned");
  else add("PASS", "engagement insight rule", "no lazy-comment pattern in the strategy");
}

const fails = results.filter((r) => r.status === "FAIL");
const warns = results.filter((r) => r.status === "WARN");
const passes = results.filter((r) => r.status === "PASS");

// ─── write brand-audit.md ───────────────────────────────────────────────────
const L = [];
L.push(`# Brand Audit — ${basename(packDir)}`);
L.push("");
L.push(`**Automated checks (${new Date().toISOString().slice(0, 10)}):** ${passes.length} PASS · ${warns.length} WARN · ${fails.length} FAIL · **automated verdict:** ${fails.length ? "FIX NEEDED" : "PASS (pending auditor)"}`);
L.push("");
L.push("## 1. Automated results");
L.push("");
L.push("| Status | Check | Detail |");
L.push("|---|---|---|");
for (const r of results) L.push(`| ${r.status} | ${r.check} | ${r.detail} |`);
L.push("");
if (auditSections.length) {
  L.push("## 1b. Brand snippets for the auditor");
  L.push("");
  for (const s of auditSections) L.push(`- ${s}`);
  L.push("");
}
L.push("## 2. Auditor section — COMPLETE THIS (subagent, fresh eyes)");
L.push("");
L.push("### 2.1 Brand-worthiness scorecard (rate 1–5 each, /50 — a brand pack worth posting scores ≥ 35)");
L.push("");
L.push("| Criterion | Ask | Score /5 |");
L.push("|---|---|---|");
L.push("| **Voice authenticity** | Does every post sound like the ACTUAL person (their words, their stories) — not template-speak? | |");
L.push("| **E-E-A-T in every post** | Does each post carry a specific proof element (number, story, outcome, client result)? | |");
L.push("| **Hook in the first 2 lines** | Would the first 2 lines stop a LinkedIn scroller? | |");
L.push("| **One idea, one CTA** | One idea per post, exactly one CTA, no engagement-bait? | |");
L.push("| **Anti-buzzword** | Blocklist clear across bio + calendar? | |");
L.push("| **Calendar realism** | 2–5 posts, varied roles, posting times set, CTA mapped per post? | |");
L.push("| **Bio strength** | Headline ~220 chars with a hook; About story → proof → CTA? | |");
L.push("| **Specific > generic** | Do posts reference real work, not 'Top 5 tips for success'? | |");
L.push("| **Engagement plan** | Comment targets + how-to-comment (add ONE insight), connection note, monthly CTA? | |");
L.push("| **Credibility floor** | Would a stranger trust this profile after 2 minutes? | |");
L.push("");
L.push("### 2.2 Creative judgment calls");
L.push("");
L.push("- Any post that could have been written by anyone (rewrite in their voice)?");
L.push("- Any CTA that feels like begging or bait?");
L.push("- Any claim that needs proof the person hasn't provided?");
L.push("");
L.push("### 2.3 Verdict");
L.push("");
L.push("- All PASS and scorecard ≥ 35 → mark **PASS** and sign below.");
L.push("- Any FAIL (or a WARN you judge real) → mark **FIX NEEDED** and list concrete fixes per file.");
L.push("");
L.push(`> Auditor verdict: **PENDING** · Auditor: _(subagent)_ · Date: ${new Date().toISOString().slice(0, 10)}`);
L.push("");

writeFileSync(outPath, L.join("\n"), "utf8");

// ─── console ────────────────────────────────────────────────────────────────
console.log(`✅ brand-audit.md → ${basename(outPath)} (${passes.length} PASS · ${warns.length} WARN · ${fails.length} FAIL)`);
for (const r of results.filter((r) => r.status !== "PASS")) {
  console.log(`   ${r.status === "FAIL" ? "❌" : "⚠️"} ${r.check}: ${r.detail}`);
}
if (fails.length) {
  console.error(`❌ ${fails.length} automated FAIL(s) — fix and re-run before spawning the brand-auditor.`);
  process.exit(1);
}
console.log("Automated checks clean — now spawn the brand-auditor subagent (see SKILL.md Stage 5) to complete the scorecard + verdict in brand-audit.md.");
process.exit(0);
