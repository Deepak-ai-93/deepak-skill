#!/usr/bin/env node
// The blog-seo-content keyword + outline builder — turns a seed keyword into
// a keyword cluster (variants + long-tail + question forms), scores intent,
// and scaffolds a data-backed article outline (H1 + H2/H3s with the angle and
// proof to include per section).
//
// Usage:
//   node keyword-outline.mjs --seed "saas onboarding" [--out seo-brief.md] [--depth 3]
//
// This is a scaffold + heuristic scorer — the agent enriches it with real SERP
// research (competitors, People-Also-Ask, featured snippets) and gets your
// approval before writing the full article.
//
// Exit codes: 0 = OK, 2 = usage error.
import { writeFileSync } from "node:fs";
import { resolve, basename } from "node:path";

// ─── brand banner (deepak-skill · crafted by Deepak) ────────────────────────
const BRAND_LINE = "═".repeat(56);
const banner = (label) =>
  `\n${BRAND_LINE}\n  🎬 deepak-skill — crafted by Deepak\n  skill: blog-seo-content · ${label}\n${BRAND_LINE}\n`;
console.log(banner("keyword-outline.mjs"));

// --- tiny arg parser (same style as the other skill scripts) ----------------
const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const needle = `--${name}`;
  const found = args.find((a) => a === needle || a.startsWith(`${needle}=`));
  if (found === undefined) return fallback;
  const eq = found.indexOf("=");
  return eq !== -1 ? found.slice(eq + 1) : args[args.indexOf(found) + 1];
};

const seed = opt("seed", "");
if (!seed) {
  console.error("Usage: node keyword-outline.mjs --seed \"saas onboarding\" [--out seo-brief.md] [--depth 3]");
  process.exit(2);
}
const outPath = resolve(process.cwd(), opt("out", "seo-brief.md"));
const depth = parseInt(opt("depth", "3"), 10) || 3;

// --- keyword cluster ----------------------------------------------------------
const words = seed.toLowerCase().split(/\s+/).filter(Boolean);
const primary = seed.toLowerCase();
const singular = words[0];
const noun = words.slice(-1)[0];

const variants = new Set([
  primary,
  `${words.join(" ")} guide`,
  `${words.join(" ")} best practices`,
  `${words.join(" ")} checklist`,
  `${words.join(" ")} examples`,
  `${words.join(" ")} mistakes`,
  `${singular} ${noun} tips`,
  `how to improve ${primary}`,
  `what is ${primary}`,
  `how to ${primary} step by step`,
  `${primary} 2025`,
  `${primary} vs {competitor}`, // ← replace {competitor} with a real brand before publishing
  `${primary} tools`,
  `${primary} statistics`,
]);
// Question forms (People-Also-Ask fodder)
const questions = [
  `what is ${primary}?`,
  `why does ${primary} matter?`,
  `how long does ${primary} take?`,
  `how much does ${primary} cost?`,
  `what are common ${primary} mistakes?`,
  `what tools help with ${primary}?`,
  `is ${primary} worth it in 2025?`,
];
const cluster = [...variants].slice(0, depth * 4);

// --- intent scoring (heuristic) ----------------------------------------------
function intentOf(kw) {
  const k = kw.toLowerCase();
  if (/\b(buy|best|cheap|price|cost|vs|alternative|review|top)\b/.test(k)) return { intent: "Commercial", score: 3 };
  if (/\b(how|what|why|guide|tips|examples|checklist|step|tutorial|explain)\b/.test(k)) return { intent: "Informational", score: 3 };
  if (/\b(download|sign up|free trial|price|pricing|buy now|subscribe)\b/.test(k)) return { intent: "Transactional", score: 2 };
  return { intent: "Informational", score: 1 };
}
const primaryIntent = intentOf(primary).intent;

// --- outline scaffold ----------------------------------------------------------
const sections = [
  { h2: `What is ${primary}?`, angle: "Define it in plain language + why it matters NOW", proof: "1 stat with a named source; a 2-line definition AI engines can quote" },
  { h2: `Why ${primary} matters in 2025`, angle: "The shift / the pain it solves", proof: "1–2 sourced stats + a firsthand example" },
  { h2: `How to ${primary} — step by step`, angle: "The practical walkthrough", proof: "Numbered steps, screenshots or a table, one real example" },
  { h2: `Common ${primary} mistakes`, angle: "What people get wrong (contrarian value)", proof: "3–5 mistakes, each with the fix" },
  { h2: `Tools for ${primary}`, angle: "Shortlist with honest pros/cons", proof: "3–5 tools, named + why, no affiliate fluff" },
  { h2: `${primary}: what the data says`, angle: "Statistics with receipts", proof: "A table of stats, each row cited to a named source" },
  { h2: "Bottom line", angle: "The quotable summary block (GEO)", proof: "3–5 bullet takeaways AI engines can lift" },
];

// Always keep the GEO-quotable "Bottom line" block even at low depth — the
// SKILL's quality bar promises it (AI engines lift it for featured answers).
const bottomLine = { h2: "Bottom line", angle: "The quotable summary block (GEO)", proof: "3–5 bullet takeaways AI engines can lift" };
const trimmed = sections.slice(0, Math.max(1, depth - 1));
if (!trimmed.some((s) => s.h2.startsWith("Bottom"))) trimmed.push(bottomLine);
const sectionsFinal = trimmed;

const lines = [];
lines.push(`# SEO Brief — "${primary}"`);
lines.push("");
lines.push(`**Primary keyword:** \`${primary}\` · **Primary intent:** ${primaryIntent} · **Target length:** ${1200 + depth * 400}–${1500 + depth * 500} words`);
lines.push("⚠️ Scaffold only — the agent enriches this with real SERP/GEO research, then waits for YOUR approval before writing.");
lines.push("");
lines.push("## Keyword cluster");
lines.push("| Keyword | Intent | Priority |");
lines.push("|---|---|---|");
cluster.forEach((k, i) => {
  const int = intentOf(k);
  lines.push(`| \`${k}\` | ${int.intent} | ${i === 0 ? "PRIMARY" : int.score >= 2 ? "secondary" : "long-tail"} |`);
});
lines.push("");
lines.push("## Question opportunities (People-Also-Ask / AI citation)");
questions.forEach((q) => lines.push(`- ${q}`));
lines.push("");
lines.push("## Outline");
lines.push(`### H1 — ${primary.charAt(0).toUpperCase() + primary.slice(1)}: the ${primaryIntent.toLowerCase()} guide`);
lines.push("> Answer the question in the FIRST 100 words (AI engines quote this).");
sectionsFinal.forEach((s, i) => {
  lines.push(`### H2 ${i + 1} — ${s.h2}`);
  lines.push(`- **Angle:** ${s.angle}`);
  lines.push(`- **Proof to include:** ${s.proof}`);
});
lines.push("");
lines.push("## Meta pack targets");
lines.push(`- **Meta title (≤ 60 chars):** ${primary.slice(0, 48)}: ${primaryIntent.toLowerCase()} guide for 2025`);
lines.push(`- **Meta description (≤ 155 chars):** ${primary.charAt(0).toUpperCase() + primary.slice(1)}, explained with real data${depth >= 3 ? ", step-by-step playbook and common mistakes" : ""}. ${intentOf(primary).score >= 2 ? "Includes tools + sourced stats." : ""}`);
lines.push(`- **Slug:** /${primary.replace(/\s+/g, "-")}/`);
lines.push("");
lines.push("## Deliverable contract");
lines.push("- [ ] `seo-brief.md` **approved by the user** before writing");
lines.push("- [ ] `article.md`: answer in first 100 words · one H2 per subtopic · every stat cited · firsthand experience · quotable blocks");
lines.push("- [ ] `meta.md`: title ≤ 60, description ≤ 155, slug, internal + external links");
lines.push("- [ ] Auditor subagent sign-off: SEO, EEAT, GEO, copy, meta");

writeFileSync(outPath, lines.join("\n"), "utf8");
console.log(`✅ SEO brief for "${primary}" (${cluster.length} keywords, ${sectionsFinal.length} H2 sections) → ${basename(outPath)}`);
console.log("Next: enrich with real SERP research → present for approval → write article.md → audit.");
process.exit(0);
