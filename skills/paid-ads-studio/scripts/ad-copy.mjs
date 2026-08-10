#!/usr/bin/env node
// The paid-ads-studio ad-copy generator — turns a copy-brief.json into a
// per-placement copy.md: hook-first primary text, headlines, descriptions and
// CTA packs for Meta (Feed/Reels/Stories) and Google (Search/Display/PMax).
// Enforces hard char limits and an anti-fluff blocklist — a violation exits 1.
//
// Usage:
//   node ad-copy.mjs --brief copy-brief.json [--out copy.md]
//
// copy-brief.json contract:
// {
//   "product": "Brew & Co 500ml insulated tumbler",
//   "audience": "commuters and desk workers",
//   "benefit": "coffee stays hot 8 hours",
//   "mechanism": "triple-wall vacuum insulation",
//   "proof": "4.8 stars from 2,100 reviews",
//   "offer": "20% off + free shipping",
//   "cta": "Shop Now",
//   "hook": "PAS",              // PAS | curiosity | contrarian | results-first | listicle
//   "platforms": ["meta-feed", "meta-reels", "google-search", "google-display"]
// }
//
// Limits (2026): Meta primary ≤125 chars, headline ≤40, description ≤30;
// Google headline ≤30, description ≤90. Anti-fluff words are rejected.
// Long headlines are trimmed with an ellipsis — the copy is never widened.
//
// Exit codes: 0 = OK, 1 = violation, 2 = usage error.
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, basename } from "node:path";

// ─── brand banner (deepak-skill · crafted by Deepak) ────────────────────────
const BRAND_LINE = "═".repeat(56);
const banner = (label) =>
  `\n${BRAND_LINE}\n  🎬 deepak-skill — crafted by Deepak\n  skill: paid-ads-studio · ${label}\n${BRAND_LINE}\n`;
console.log(banner("ad-copy.mjs"));

// --- tiny arg parser (same style as the other skill scripts) ----------------
const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const needle = `--${name}`;
  const found = args.find((a) => a === needle || a.startsWith(`${needle}=`));
  if (found === undefined) return fallback;
  const eq = found.indexOf("=");
  return eq !== -1 ? found.slice(eq + 1) : args[args.indexOf(found) + 1];
};

const briefArg = opt("brief");
if (!briefArg) {
  console.error("Usage: node ad-copy.mjs --brief copy-brief.json [--out copy.md]");
  process.exit(2);
}

let brief;
try {
  brief = JSON.parse(readFileSync(resolve(process.cwd(), briefArg), "utf8"));
} catch (e) {
  console.error(`❌ Could not parse ${briefArg}: ${e.message}`);
  console.error("   Check the JSON syntax (commas, quotes, braces) and try again.");
  process.exit(2);
}
const outPath = resolve(process.cwd(), opt("out", "copy.md"));

// --- mandatory fields --------------------------------------------------------
const required = ["product", "benefit"];
const missingFields = required.filter((f) => !brief[f] || typeof brief[f] !== "string" || !brief[f].trim());
if (missingFields.length) {
  console.error(`❌ copy-brief.json is missing required field(s): ${missingFields.join(", ")}`);
  console.error("   Minimum: product + benefit (audience, offer, proof, mechanism, cta all optional but recommended).");
  process.exit(2);
}

// --- anti-fluff blocklist (enforced — exit 1 on any hit) ----------------------
const FLUFF = [
  "unlock", "game-changer", "game changer", "revolutionary", "amazing", "incredible",
  "stunning", "mind-blowing", "world-class", "best-in-class", "cutting-edge",
  "state-of-the-art", "revolutionize", "transform your", "supercharge", "skyrocket",
  "guaranteed", "100% free", "act now", "limited time only", "don't miss out",
  "!!", "!!!", "free money", "miracle", "magic",
];

const LIMITS = {
  "meta-primary": 125,
  "meta-headline": 40,
  "meta-description": 30,
  "google-headline": 30,
  "google-description": 90,
};

const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);
// Trim long text to a limit with an ellipsis — never widen the limit.
const fit = (s, limit) => (s.length > limit ? `${s.slice(0, limit - 1).trimEnd()}…` : s);

// --- primary text per hook formula (grammatically safe with the brief fields) -
function hookPrimary(hook) {
  const b = brief;
  switch (hook) {
    case "curiosity":
      return `The trick? ${b.mechanism || b.benefit}. ${cap(b.benefit)}.`;
    case "contrarian":
      return `Cold coffee by noon? Not anymore. ${b.product} — ${b.benefit}.`;
    case "results-first":
      return `Rated ${b.proof || "top"}. ${cap(b.benefit)}.`;
    case "listicle":
      return `${cap(b.benefit)}. ${cap(b.mechanism || b.product)}. That's the whole list.`;
    case "PAS":
    default:
      return `${b.product} — ${b.benefit}.`;
  }
}

function primaryText(p) {
  const b = brief;
  const base = hookPrimary(b.hook || "PAS");
  const offer = b.offer ? `${b.offer}.` : "";
  const cta = b.cta ? `${b.cta}.` : "";
  if (p === "google-search") return `${b.product}: ${b.benefit}.`;
  if (p === "google-display") return `${cap(b.benefit)}. ${offer || b.mechanism || ""}`.replace(/\s+\./g, ".").trim();
  if (p === "meta-reels") return `${base} ${offer} ${cta}`.replace(/\s+/g, " ").trim();
  return `${base} ${offer} ${cta}`.replace(/\s+/g, " ").trim(); // meta-feed / default
}

// --- headlines (5 variants, each trimmed to the platform's limit) -------------
function headlines(p) {
  const b = brief;
  const limit = LIMITS[`${p.startsWith("google") ? "google" : "meta"}-headline`];
  const heads = [
    b.product,
    cap(b.benefit),
    "Cold coffee is a choice",
    b.offer || b.mechanism,
    b.mechanism || b.proof,
  ].filter(Boolean);
  return heads.map((h) => fit(h, limit));
}

function description(p) {
  const b = brief;
  const limit = LIMITS[`${p.startsWith("google") ? "google" : "meta"}-description`];
  if (p.startsWith("google")) {
    return fit(`${b.offer ? b.offer + ". " : ""}${b.mechanism ? b.mechanism + ". " : ""}${b.proof || ""}`.trim(), limit);
  }
  // Meta description is tiny (≤30) — offer first, else mechanism.
  return fit(b.offer || b.mechanism || b.proof || "", limit);
}

// --- validation (re-generates every line and enforces limits + fluff) --------
function violations() {
  const out = [];
  const check = (text, limit, label) => {
    if (text.length > limit) out.push(`${label} (${text.length} > ${limit}): "${text}"`);
    const lower = text.toLowerCase();
    for (const f of FLUFF) if (lower.includes(f)) out.push(`fluff "${f}" in ${label}: "${text}"`);
  };
  for (const p of brief.platforms || ["meta-feed"]) {
    const primaryLimit = p.startsWith("google") ? LIMITS["google-description"] : LIMITS["meta-primary"];
    check(primaryText(p), primaryLimit, `${p} primary`);
    headlines(p).forEach((h, i) => check(h, LIMITS[`${p.startsWith("google") ? "google" : "meta"}-headline`], `${p} headline ${i + 1}`));
    check(description(p), LIMITS[`${p.startsWith("google") ? "google" : "meta"}-description`], `${p} description`);
  }
  return out;
}

// --- build copy.md -----------------------------------------------------------
const platforms = brief.platforms || ["meta-feed"];
const L = [];
L.push(`# Ad Copy — "${brief.product}"`);
L.push("");
L.push(`**Audience:** ${brief.audience || "general"} · **Hook:** ${brief.hook || "PAS"} · **Offer:** ${brief.offer || "—"} · **CTA:** ${brief.cta || "Shop Now"}`);
L.push("");
for (const p of platforms) {
  L.push(`## ${p.toUpperCase()}`);
  L.push("");
  L.push("### Primary text");
  L.push(`\`${primaryText(p)}\``);
  L.push("");
  L.push("### Headlines (pick 1-3)");
  headlines(p).forEach((h, i) => L.push(`${i + 1}. \`${h}\``));
  L.push("");
  L.push("### Description");
  L.push(`\`${description(p)}\``);
  L.push("");
  L.push("### CTA");
  L.push(`\`${brief.cta || "Shop Now"}\``);
  L.push("");
  L.push("---");
  L.push("");
}
L.push(`> Anti-fluff contract enforced (no unlock, game-changer, guaranteed, !!! …) · limits: Meta primary ≤125 / headline ≤40 / description ≤30 · Google headline ≤30 / description ≤90.`);

writeFileSync(outPath, L.join("\n"), "utf8");

// --- enforce ------------------------------------------------------------------
const bad = violations();
if (bad.length) {
  console.error(`❌ ${bad.length} copy violation(s):`);
  bad.forEach((v) => console.error(`   • ${v}`));
  console.error("   Shorten the copy or rephrase — never widen the limit, never use fluff words.");
  process.exit(1);
}

console.log(`✅ copy.md → ${basename(outPath)} (${platforms.length} placements, all within limits, no fluff)`);
console.log("   Headlines/primary text are ready to paste into Meta Ads Manager / Google Ads asset groups.");
process.exit(0);
