#!/usr/bin/env node
// The blog-seo-content audit harness — the automated half of the
// blog-auditor gate. Scans a delivered blog pack and checks what a script CAN
// check: seo-brief.md (keyword cluster + intent + outline scaffold),
// article.md (answer in the first 100 words, named author + credential, cited
// stats with sources, quotable blocks — Bottom line / tables / lists, heading
// hierarchy H1→H2→H3 without skips, anti-fluff blocklist), and meta.md (meta
// title ≤ 60 chars keyword-first, meta description ≤ 155 chars, slug, links).
// Writes blog-audit.md with the automated verdicts + an AUDITOR section for
// the subagent (EEAT judgment, GEO quotability). Exit 1 on any FAIL.
//
// Usage:
//   node audit-blog.mjs --pack <blog-folder> [--out blog-audit.md]
//
// The folder should contain: seo-brief.md, article.md, meta.md (subsets are
// allowed — missing files are FAIL but the audit continues).
//
// Exit codes: 0 = all automated checks PASS, 1 = any FAIL, 2 = usage error.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, basename, join } from "node:path";

// ─── brand banner (deepak-skill · crafted by Deepak) ────────────────────────
const BRAND_LINE = "═".repeat(56);
const banner = (label) =>
  `\n${BRAND_LINE}\n  🎬 deepak-skill — crafted by Deepak\n  skill: blog-seo-content · ${label}\n${BRAND_LINE}\n`;
console.log(banner("audit-blog.mjs"));

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
  console.error("Usage: node audit-blog.mjs --pack <blog-folder> [--out blog-audit.md]");
  process.exit(2);
}
const packDir = resolve(process.cwd(), packArg);
const outPath = resolve(process.cwd(), opt("out", "blog-audit.md"));
if (!existsSync(packDir)) {
  console.error(`❌ Blog folder not found: ${packDir}`);
  console.error("   Pass the folder that holds seo-brief.md / article.md / meta.md");
  process.exit(2);
}

const read = (f) => (existsSync(join(packDir, f)) ? readFileSync(join(packDir, f), "utf8") : null);

// ─── results collector ──────────────────────────────────────────────────────
const results = []; // { status: "PASS"|"FAIL"|"WARN", check, detail }
const add = (status, check, detail) => results.push({ status, check, detail });
let auditSections = [];

// the repo's shared fluff blocklist (subset — the same playbook other skills use)
const FLUFF = [
  "unlock", "game-changer", "elevate", "supercharge", "level up", "unleash",
  "boost", "empower", "revolutionize", "optimize", "leverage", "journey",
  "in today's fast-paced world", "skyrocket", "crush it", "transform your",
];

// ─── seo-brief.md ───────────────────────────────────────────────────────────
const brief = read("seo-brief.md");
let primaryKeyword = null;
if (!brief) {
  add("FAIL", "seo-brief.md exists", "missing — the approved keyword/outline brief is the gate before writing");
} else {
  const cluster = (brief.match(/keyword|cluster|long-tail|question form/i) || []).length;
  if (cluster >= 3) add("PASS", "seo-brief keyword cluster", "keyword cluster signals present");
  else add("WARN", "seo-brief keyword cluster", "few keyword-cluster signals — seed + variants + long-tail expected");
  const intent = (brief.match(/informational|commercial|transactional|intent/i) || []).length;
  if (intent) add("PASS", "seo-brief intent", `${intent} intent reference(s) — one intent locked`);
  else add("WARN", "seo-brief intent", "no search-intent markers found");
  if (/outline|H1|H2|H3/i.test(brief)) add("PASS", "seo-brief outline", "outline scaffold present");
  else add("WARN", "seo-brief outline", "no outline scaffold found");
  const m = brief.match(/primary keyword[:：]?\s*["“']?([^"”\n,]+)/i);
  if (m) primaryKeyword = m[1].trim();
  if (primaryKeyword) auditSections.push(`primary keyword: ${primaryKeyword}`);
}

// ─── article.md ─────────────────────────────────────────────────────────────
const article = read("article.md");
if (!article) {
  add("FAIL", "article.md exists", "missing — the article is the core deliverable");
} else {
  // heading hierarchy — no skipped levels (H1 → H2 → H3)
  const hs = [...article.matchAll(/^#{1,6}\s+/gm)].map((m) => m[0].trim().length);
  let skip = 0;
  for (let i = 1; i < hs.length; i++) if (hs[i] > hs[i - 1] + 1) skip += 1;
  if (hs.length === 0) add("FAIL", "heading hierarchy", "no headings found");
  else if (skip) add("FAIL", "heading hierarchy", `${skip} heading level(s) skipped — keep H1→H2→H3 contiguous`);
  else add("PASS", "heading hierarchy", `${hs.length} headings, no skipped levels`);
  // answer in the first 100 words
  const first100 = article.replace(/^#{1,6}\s+.*$/gm, "").split(/\s+/).slice(0, 100).join(" ");
  if (first100.length > 20) add("PASS", "first-100-word answer", "opening text present (answer should lead)");
  else add("WARN", "first-100-word answer", "very short opening — the direct answer must come in the first 100 words");
  // EEAT: named author + credential
  const author = /author|by\s+[A-Z][a-z]+|bio|credential/i.test(article);
  if (author) add("PASS", "EEAT named author", "author/bio/credential signal found");
  else add("FAIL", "EEAT named author", "no named author or credential — the bio is not optional");
  // every stat cited: look for numbers near "per/source/report/study"
  const stats = (article.match(/\b\d+(?:\.\d+)?\s*%|\$\s?\d+|\b\d+\s*(million|billion|people|users|companies|days|hours)\b/gi) || []).length;
  const sources = (article.match(/per\s+[A-Z]|source|report|study|survey|gartner|forrester|statista|research/i) || []).length;
  if (stats && sources) add("PASS", "cited stats", `${stats} stat(s) with ${sources} source reference(s)`);
  else if (stats) add("WARN", "cited stats", `${stats} stat(s) found but few explicit sources — every stat needs one`);
  else add("WARN", "cited stats", "no stats found — add specific numbers with sources");
  // quotable blocks: Bottom line / tables / lists
  const quotable = (article.match(/bottom line|^\|.+\|$/gm) || []).length;
  const lists = (article.match(/^\s*[-*]\s+/gm) || []).length;
  if (quotable || lists) add("PASS", "GEO quotable blocks", `${quotable} quotable block(s), ${lists} list item(s)`);
  else add("WARN", "GEO quotable blocks", "no Bottom line / table / list found — AI engines quote these");
  // anti-fluff
  const fluffHits = FLUFF.filter((w) => new RegExp(`\\b${w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`, "i").test(article));
  if (fluffHits.length) add("FAIL", "anti-fluff blocklist", `blocklisted: ${fluffHits.join(", ")}`);
  else add("PASS", "anti-fluff blocklist", "blocklist clear");
  const words = (article.match(/\S+/g) || []).length;
  auditSections.push(`${words} words in the article`);
}

// ─── meta.md ────────────────────────────────────────────────────────────────
const meta = read("meta.md");
if (!meta) {
  add("FAIL", "meta.md exists", "missing — meta title + description + slug + links required");
} else {
  const titleLine = meta.match(/title[:：]\s*["“']?([^"”\n]{0,100})/i);
  const title = titleLine ? titleLine[1].trim() : "";
  if (title) {
    if (title.length <= 60) add("PASS", "meta title ≤ 60 chars", `${title.length} chars`);
    else add("FAIL", "meta title ≤ 60 chars", `${title.length} chars — over the 60-char cap`);
    if (primaryKeyword && title.toLowerCase().includes(primaryKeyword.toLowerCase().slice(0, 8))) {
      add("PASS", "meta title keyword-first", "primary keyword appears early in the title");
    } else {
      add("WARN", "meta title keyword-first", "primary keyword not clearly front-loaded in the title");
    }
  } else {
    add("FAIL", "meta title", "no meta title line found");
  }
  const descLine = meta.match(/description[:：]\s*["“']?([^"”\n]{0,200})/i);
  const desc = descLine ? descLine[1].trim() : "";
  if (desc) {
    if (desc.length <= 155) add("PASS", "meta description ≤ 155 chars", `${desc.length} chars`);
    else add("FAIL", "meta description ≤ 155 chars", `${desc.length} chars — over the cap`);
    if (/CTA|read|learn|download|sign up|get/i.test(desc)) add("PASS", "meta description CTA", "CTA present");
    else add("WARN", "meta description CTA", "no CTA in the description");
  } else {
    add("FAIL", "meta description", "no meta description line found");
  }
  if (/slug|internal link|external link/i.test(meta)) add("PASS", "meta slug + links", "slug/link sections present");
  else add("WARN", "meta slug + links", "no slug/internal-link/external-link sections found");
}

const fails = results.filter((r) => r.status === "FAIL");
const warns = results.filter((r) => r.status === "WARN");
const passes = results.filter((r) => r.status === "PASS");

// ─── write blog-audit.md ────────────────────────────────────────────────────
const L = [];
L.push(`# Blog Audit — ${basename(packDir)}`);
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
  L.push("## 1b. Blog snippets for the auditor");
  L.push("");
  for (const s of auditSections) L.push(`- ${s}`);
  L.push("");
}
L.push("## 2. Auditor section — COMPLETE THIS (subagent, fresh eyes)");
L.push("");
L.push("### 2.1 Blog-worthiness scorecard (rate 1–5 each, /50 — an article worth publishing scores ≥ 35)");
L.push("");
L.push("| Criterion | Ask | Score /5 |");
L.push("|---|---|---|");
L.push("| **One keyword, one intent** | Does the article serve ONE search intent fully (not three half-heartedly)? | |");
L.push("| **EEAT credibility** | Named author + credential + link? Firsthand experience present or flagged? No overclaiming? | |");
L.push("| **Cited proof** | Is every stat linked to a named source — never bare 'studies show'? | |");
L.push("| **GEO quotability** | Could an AI search engine lift a 'Bottom line' block, table, or list from this article? | |");
L.push("| **First-100-word answer** | Does the direct answer come within the first 100 words? | |");
L.push("| **Heading hierarchy** | H1→H2→H3 contiguous, one idea per H2? | |");
L.push("| **Copy quality** | Anti-fluff clear, specific > generic, no filler intro? | |");
L.push("| **Meta pack** | Title ≤ 60 (keyword first), description ≤ 155 with CTA, clean slug? | |");
L.push("| **Internal links** | 3–5 relevant internal links with descriptive anchor text? | |");
L.push("| **Rank feasibility** | Does the angle + depth match what's actually ranking for the keyword? | |");
L.push("");
L.push("### 2.2 Creative judgment calls");
L.push("");
L.push("- Any claim that overpromises or would embarrass the author if challenged?");
L.push("- Any section that reads thin vs. the SERP depth (word count, coverage)?");
L.push("- Any place an internal link is obviously missing?");
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
console.log(`✅ blog-audit.md → ${basename(outPath)} (${passes.length} PASS · ${warns.length} WARN · ${fails.length} FAIL)`);
for (const r of results.filter((r) => r.status !== "PASS")) {
  console.log(`   ${r.status === "FAIL" ? "❌" : "⚠️"} ${r.check}: ${r.detail}`);
}
if (fails.length) {
  console.error(`❌ ${fails.length} automated FAIL(s) — fix and re-run before spawning the blog-auditor.`);
  process.exit(1);
}
console.log("Automated checks clean — now spawn the blog-auditor subagent (see SKILL.md Stage 5) to complete the scorecard + verdict in blog-audit.md.");
process.exit(0);
