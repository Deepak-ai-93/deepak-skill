#!/usr/bin/env node
// The youtube-video-pipeline title pack — generates and scores 10 title
// variants for a video using CTR formulas, length limits and keyword checks.
//
// Usage:
//   node title-pack.mjs --topic "saas pricing" --angle "3 pricing mistakes founders make" [--keyword "pricing mistakes"] [--out titles.md]
//
// The script is a generator + heuristic scorer — the agent marks the winner
// with rationale, pairs the best with thumbnail briefs, and the auditor makes
// the final call. Titles are ≤ 60 chars (mobile truncation) with the hook in
// the first ~5 words.
//
// Exit codes: 0 = OK, 2 = usage error.
import { writeFileSync } from "node:fs";
import { resolve, basename } from "node:path";

// ─── brand banner (deepak-skill · crafted by Deepak) ────────────────────────
const BRAND_LINE = "═".repeat(56);
const banner = (label) =>
  `\n${BRAND_LINE}\n  🎬 deepak-skill — crafted by Deepak\n  skill: youtube-video-pipeline · ${label}\n${BRAND_LINE}\n`;
console.log(banner("title-pack.mjs"));

// --- tiny arg parser (same style as the other skill scripts) ----------------
const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const needle = `--${name}`;
  const found = args.find((a) => a === needle || a.startsWith(`${needle}=`));
  if (found === undefined) return fallback;
  const eq = found.indexOf("=");
  return eq !== -1 ? found.slice(eq + 1) : args[args.indexOf(found) + 1];
};

const topic = opt("topic", "");
const angle = opt("angle", "");
if (!topic) {
  console.error("Usage: node title-pack.mjs --topic \"saas pricing\" --angle \"3 pricing mistakes founders make\" [--keyword \"pricing mistakes\"] [--out titles.md]");
  process.exit(2);
}
const keyword = opt("keyword", topic);
const outPath = resolve(process.cwd(), opt("out", "titles.md"));
const A = angle || topic;
const K = keyword;

// --- 10 title variants across ≥ 4 formulas ----------------------------------
const formulas = [
  { name: "Number/list", make: () => `3 ${K} mistakes that quietly kill your SaaS` },
  { name: "Question", make: () => `Why is your ${K} not converting?` },
  { name: "Curiosity gap", make: () => `The ${K} metric nobody watches (until it's late)` },
  { name: "How-to/result", make: () => `How to fix your ${K} in 20 minutes` },
  { name: "Contrarian", make: () => `Stop optimizing ${K} — do this instead` },
  { name: "Pain + outcome", make: () => `Your ${K} is leaking users. Here's the fix.` },
  { name: "Specific number", make: () => `We cut ${K} time 61% — here's exactly how` },
  { name: "Story/case", make: () => `How one founder fixed ${K} in 8 weeks` },
  { name: "Announcement/trend", make: () => `${K} in 2025: what actually changed` },
  { name: "Pattern interrupt", make: () => `Forget ${K} checklists. Do this.` },
];

// --- scoring (heuristic) ------------------------------------------------------
const SPAM = /\b(shocking|guaranteed|amazing|incredible|miracle|secret|winner|!!|100%)\b/i;
const ALLCAPS_WORDS = /\b[A-Z]{4,}\b/;

function scoreTitle(t, i) {
  let score = 10;
  const notes = [];
  if (t.length > 60) { score -= 3; notes.push(`over 60 chars (${t.length}) — mobile truncation`); }
  else if (t.length < 25) { score += 1; notes.push("snappy"); }
  else { score += 2; notes.push(`good length (${t.length})`); }
  if (SPAM.test(t)) { score -= 4; notes.push("spam word detected"); }
  if (ALLCAPS_WORDS.test(t)) { score -= 2; notes.push("ALL-CAPS word"); }
  if (t.toLowerCase().includes(K.toLowerCase())) { score += 2; notes.push(`keyword present`); }
  if (/[!?]$/.test(t)) { score += 1; notes.push("question/exclamation punch"); }
  const first5 = t.split(/\s+/).slice(0, 5).join(" ");
  notes.push(`hook first 5 words: "${first5}"`);
  return { score: Math.min(15, score), notes, formula: formulas[i].name };
}

const lines = [];
lines.push(`# Title Pack — "${topic}"`);
lines.push("");
lines.push(`**Angle:** ${A} · **Target keyword:** \`${K}\` · **Rule:** every title ≤ 60 chars, hook in the first ~5 words, no spam words.`);
lines.push("");
lines.push("| # | Formula | Title (chars) | Score | Notes |");
lines.push("|---|---|---|---|---|");
const scored = formulas.map((f, i) => {
  const title = f.make();
  return { title, ...scoreTitle(title, i) };
}).sort((a, b) => b.score - a.score);
scored.forEach((s, i) => {
  lines.push(`| ${i + 1} | ${s.formula} | ${s.title} (${s.title.length}) | ${s.score}/15 | ${s.notes.join(" · ")} |`);
});
lines.push("");
lines.push("## How to pick the winner");
lines.push("- **Score is a heuristic** — the auditor decides. Highest score ≠ best; match the title to YOUR channel's voice.");
lines.push("- Mark the winner + 2 alternates with a one-line rationale (why THIS for your audience).");
lines.push("- The winner's promise must be **exactly what the script delivers** — re-read the hook before locking.");
lines.push("");
lines.push("## Thumbnail pairing");
lines.push("- For the winner + alternates, write a thumbnail brief: ONE subject, ONE emotion, ≤ 5 words of text, readable at 160px.");
lines.push("- Generate the thumbnail with your image tool (photoreal or style-matched, exact text overlay) — verify the text at 160px.");
lines.push("");
lines.push("## Metadata reminder");
lines.push("- Description: hook line + 'In this video:' bullets + chapters with timestamps + links.");
lines.push("- Tags: the target keyword + synonyms (8–15). Upload a clean transcript as captions.");

writeFileSync(outPath, lines.join("\n"), "utf8");
console.log(`✅ 10-title pack for "${topic}" → ${basename(outPath)}`);
console.log(`Best scored: "${scored[0].title}" (${scored[0].score}/15, ${scored[0].formula})`);
console.log("Next: mark the winner + thumbnail brief → write script → audit.");
process.exit(0);
