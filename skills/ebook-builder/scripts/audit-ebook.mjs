#!/usr/bin/env node
// ebook-builder — the automated audit half of the ebook-auditor gate.
// Scans an ebook pack (ebook.html + output) and checks everything a script
// can: page count ≥ 5, cover page present, ONE data-layout + data-palette +
// data-motif across pages (design picker consistency) + data-cover-style on the
// cover, headline ≤ 8 words, cover title ≤ 6 words, anti-fluff blocklist, scene
// tags, CTA on the last page, author memory + taste (ebook-memory.md present in
// the pack or working folder; taste banned-words from the author's profile FAIL
// the deck if they leak in), and the output (Mode 1: ebook.pdf + cover.png +
// pages/*.png, or Mode 2: prompts.md with per-page blocks + 4K canvas). Writes
// ebook-audit.md with automated verdicts + an AUDITOR section. Exit 1 on any FAIL.
//
// Usage:
//   node audit-ebook.mjs --pack <ebook-folder> [--out ebook-audit.md]
//
// Exit codes: 0 = clean, 1 = FAIL, 2 = usage error.
import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { resolve, basename, join } from "node:path";

// ─── brand banner (deepak-skill · crafted by Deepak) ────────────────────────
const BRAND_LINE = "═".repeat(56);
const banner = (label) =>
  `\n${BRAND_LINE}\n  🎬 deepak-skill — crafted by Deepak\n  skill: ebook-builder · ${label}\n${BRAND_LINE}\n`;
console.log(banner("audit-ebook.mjs"));

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
const LAYOUTS = [
  "editorial-classic", "modern-bold", "minimal-luxury",
  "playful-pop", "technical-dark", "nature-calm",
];
const PALETTES = [
  // editorial-classic
  "warm-paper", "cool-ivory", "charcoal-ink", "vintage-sage", "cream-terracotta",
  // modern-bold
  "electric-blue", "signal-red", "forest-green", "solar-orange", "midnight-purple",
  // minimal-luxury
  "champagne-noir", "emerald-noir", "ivory-gold", "rose-noir", "platinum-noir",
  // playful-pop
  "candy-pop", "lemon-soda", "bubblegum-blue", "mint-splash", "grape-soda",
  // technical-dark
  "terminal-green", "ocean-blue", "amber-code", "matrix", "cyber-violet",
  // nature-calm
  "sage", "terracotta", "ocean-breeze", "meadow", "lavender",
];
const COVER_STYLES = ["full-bleed", "solid", "split", "pattern", "scene-frame", "duotone"];
const MOTIFS = [
  "step-cards", "timeline", "checklist", "scenario",
  "quote-interstitial", "chapter-dividers", "comparison", "framework-map",
];

const packArg = opt("pack");
if (!packArg) {
  console.error("Usage: node audit-ebook.mjs --pack <ebook-folder> [--out ebook-audit.md]");
  process.exit(2);
}
const packDir = resolve(process.cwd(), packArg);
const outPath = resolve(process.cwd(), opt("out", "ebook-audit.md"));
if (!existsSync(packDir)) {
  console.error(`❌ Ebook folder not found: ${packDir}`);
  console.error("   Pass the pack folder (ebook.html + output) — e.g. skills/ebook-builder/examples/pricing-guide");
  process.exit(2);
}

const results = [];
const add = (status, check, detail) => results.push({ status, check, detail });

const read = (f) => (existsSync(join(packDir, f)) ? readFileSync(join(packDir, f), "utf8") : null);
const deck = read("ebook.html");
if (!deck) {
  add("FAIL", "ebook.html exists", "missing — the deck is the single source of truth");
} else {
  // pages + cover
  const pages = (deck.match(/class="[^"]*\bpage\b[^"]*"/g) || []).length;
  if (pages >= 5) add("PASS", "page count", `${pages} .page element(s)`);
  else add("FAIL", "page count", `only ${pages} — need ≥ 5 (cover + 4 content pages)`);
  if (/data-page=["']cover["']/.test(deck)) add("PASS", "cover page", "a page with data-page=\"cover\" present");
  else add("FAIL", "cover page", "no data-page=\"cover\" — the cover opens the loop");

  // design-picker consistency: layout + palette + motif on every page, cover style on the cover
  const layouts = [...new Set([...deck.matchAll(/data-layout=["']([a-z-]+)["']/g)].map((m) => m[1]))];
  if (layouts.length === 1 && LAYOUTS.includes(layouts[0])) add("PASS", "layout consistency", `ONE layout: ${layouts[0]}`);
  else if (layouts.length > 1) add("FAIL", "layout consistency", `mixed layouts: ${layouts.join(", ")} — pick ONE`);
  else add("WARN", "layout consistency", "no data-layout attributes — add ONE (editorial-classic / modern-bold / minimal-luxury / playful-pop / technical-dark / nature-calm)");

  const palettes = [...new Set([...deck.matchAll(/data-palette=["']([a-z-]+)["']/g)].map((m) => m[1]))];
  if (palettes.length === 1 && PALETTES.includes(palettes[0])) add("PASS", "palette consistency", `ONE palette: ${palettes[0]} (of 30)`);
  else if (palettes.length > 1) add("FAIL", "palette consistency", `mixed palettes: ${palettes.join(", ")} — pick ONE`);
  else add("WARN", "palette consistency", "no data-palette attributes — add ONE of the 30 (see design-options.md)");

  const motifs = [...new Set([...deck.matchAll(/data-motif=["']([a-z-]+)["']/g)].map((m) => m[1]))];
  if (motifs.length === 1 && MOTIFS.includes(motifs[0])) add("PASS", "motif consistency", `ONE motif family: ${motifs[0]}`);
  else if (motifs.length > 1) add("FAIL", "motif consistency", `mixed motifs: ${motifs.join(", ")} — pick ONE (design picker)`);
  else add("WARN", "motif consistency", "no data-motif attributes — add ONE motif family (step-cards / timeline / checklist / scenario / quote-interstitial / chapter-dividers / comparison / framework-map)");

  const coverStyles = [...new Set([...deck.matchAll(/data-cover-style=["']([a-z-]+)["']/g)].map((m) => m[1]))];
  if (coverStyles.length === 1 && COVER_STYLES.includes(coverStyles[0])) add("PASS", "cover style", `ONE cover style: ${coverStyles[0]} (on the cover page)`);
  else if (coverStyles.length > 1) add("FAIL", "cover style", `mixed cover styles: ${coverStyles.join(", ")} — one cover style only`);
  else add("WARN", "cover style", "no data-cover-style on the cover page — add ONE (full-bleed / solid / split / pattern / scene-frame / duotone)");

  // copy limits + fluff
  const headlines = [...deck.matchAll(/class="[^"]*\bheadline\b[^"]*"[^>]*>([^<]+)</g)].map((m) => m[1].trim());
  const longHeadlines = headlines.filter((h) => h.split(/\s+/).filter(Boolean).length > 8);
  if (!longHeadlines.length) add("PASS", "headline limit", `${headlines.length} headline(s), all ≤ 8 words`);
  else add("FAIL", "headline limit", `${longHeadlines.length} headline(s) over 8 words: ${longHeadlines.join(" | ")}`);

  const coverTitle = deck.match(/class="[^"]*\bcover-title\b[^"]*"[^>]*>([^<]+)</);
  if (coverTitle) {
    const words = coverTitle[1].trim().split(/\s+/).filter(Boolean).length;
    if (words <= 6) add("PASS", "cover title", `${words} words — ≤ 6 (thumbnail-readable)`);
    else add("FAIL", "cover title", `${words} words — over 6; the cover must be one glance`);
  } else {
    add("WARN", "cover title", "no .cover-title on the cover page");
  }

  const fluff = FLUFF.filter((w) => deck.toLowerCase().includes(w.toLowerCase()));
  if (!fluff.length) add("PASS", "anti-fluff", "no fluff words");
  else add("FAIL", "anti-fluff", fluff.join(", "));

  if (/scene-tag/.test(deck)) add("PASS", "scene tags", ".scene-tag annotations present (Mode 2 reads them)");
  else add("WARN", "scene tags", "no .scene-tag — Mode 2 prompts will need manual scene fills");

  // story spine: CTA on the last page
  const pageStarts = [...deck.matchAll(/<div class="[^"]*\bpage\b[^"]*"[^>]*>/g)].map((m) => m.index);
  const lastPage = pageStarts.length ? deck.slice(pageStarts[pageStarts.length - 1]) : deck;
  if (/class="[^"]*\bcta\b[^"]*"/.test(lastPage)) add("PASS", "CTA on last page", "the final page carries a .cta (the loop ending)");
  else add("FAIL", "CTA on last page", "no .cta on the final page — the ebook must end on an ask");

  // print CSS for the A4 PDF
  if (/page-break-after|break-after/i.test(deck)) add("PASS", "print CSS", "page-break CSS present (A4 PDF = one page per sheet)");
  else add("WARN", "print CSS", "no page-break-after CSS — the PDF may merge pages");
}

// output: Mode 1 (pdf + cover + pages) or Mode 2 (prompts.md)
const pdf = read("ebook.pdf");
const cover = read("cover.png");
const prompts = read("prompts.md");
const pagesDir = existsSync(join(packDir, "pages")) ? readdirSync(join(packDir, "pages")).filter((f) => /\.png$/.test(f)) : [];
if (pdf && cover) add("PASS", "Mode 1 output", `ebook.pdf + cover.png present (+ ${pagesDir.length} page PNGs)`);
else if (prompts) add("PASS", "Mode 2 output", "prompts.md present (per-page image-model prompts)");
else add("WARN", "output", "no ebook.pdf/cover.png (Mode 1) or prompts.md (Mode 2) — render or export before delivery");

// memory + taste (author rails — read at Stage 0, written at Stage 8)
const memPack = read("ebook-memory.md");
const memCwdPath = join(process.cwd(), "ebook-memory.md");
const memCwd = existsSync(memCwdPath) ? readFileSync(memCwdPath, "utf8") : null;
const mem = memPack || memCwd;
if (mem) {
  add("PASS", "author memory", "ebook-memory.md present (pack or working folder) — Stage 0 read → Stage 8 write");
  // taste banned words: bullets under a heading (or bold-bullet marker) mentioning banned / never-use / avoid
  const banned = [];
  let inBanned = false;
  for (const line of mem.split(/\r?\n/)) {
    if (/^#{1,4}\s/.test(line)) {
      inBanned = /banned|never\s+use|avoid/i.test(line);
      continue;
    }
    if (/banned words/i.test(line)) { inBanned = true; continue; }
    if (inBanned && /^\s*[-*]\s+(.+)$/.test(line)) {
      const w = line.replace(/^\s*[-*]\s+/, "").trim().replace(/[`*_]/g, "");
      if (w && !/[|]/.test(w)) banned.push(w);
    }
  }
  if (banned.length) {
    const hits = banned.filter((w) => deck && deck.toLowerCase().includes(w.toLowerCase()));
    if (!hits.length) add("PASS", "taste banned words", `${banned.length} author-banned word(s) from the taste profile — none leaked into the deck`);
    else add("FAIL", "taste banned words", `${hits.join(", ")} — the author banned these (ebook-memory.md §2); rewrite in their voice`);
  }
} else {
  add("WARN", "author memory", "no ebook-memory.md in the pack or working folder — create one at Stage 0 (templates/memory-profile.md): identity, taste, design defaults, past builds");
}

// ─── write ebook-audit.md ───────────────────────────────────────────────────
const fails = results.filter((r) => r.status === "FAIL");
const warns = results.filter((r) => r.status === "WARN");
const passes = results.filter((r) => r.status === "PASS");

const L = [];
L.push(`# Ebook Audit — ${basename(packDir)}`);
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
L.push("### 2.1 Ebook-worthiness scorecard (rate 1–5 each, /50 — an ebook worth publishing scores ≥ 35)");
L.push("");
L.push("| Criterion | Ask | Score /5 |");
L.push("|---|---|---|");
L.push("| **Cover pull** | Would the cover earn a download at thumbnail size (one idea, ≤ 6 words, contrast)? | |");
L.push("| **Story structure** | Cover opens a loop → chapters escalate → payoff → CTA (fluff rule held)? | |");
L.push("| **Layout consistency** | ONE layout + palette + accent + cover style + motif family across every page (matches the design-picker card)? | |");
L.push("| **Design quality** | Does the design look premium (spacing, hierarchy, typography), not template-y? | |");
L.push("| **Copy punch + voice** | Headlines ≤ 8 words, specific beats generic, numbers/receipts present, AND the copy sounds like the author wrote it (taste profile in ebook-memory.md: tone, rhythm, pet phrases, no banned words)? | |");
L.push("| **Imagery** | Cover + interior scenes support the story (or prompts are scene-rich)? | |");
L.push("| **Readability** | Type legible over the design; contrast held on every page? | |");
L.push("| **Print quality** | PDF pages break cleanly; nothing clipped; images crisp? | |");
L.push("| **CTA strength** | The last page has one clear ask that loops (get part 2 / subscribe / share)? | |");
L.push("| **Ship-readiness** | Would a visitor download + read this today? | |");
L.push("");
L.push("### 2.2 Creative judgment calls");
L.push("");
L.push("- Does the cover promise something the ebook actually pays off?");
L.push("- Does the copy sound like the AUTHOR (taste profile in ebook-memory.md) — or could any AI have written it for any niche?");
L.push("- Any page that violates the fluff rule (doesn't raise the question, raise the stakes, or pay off)?");
L.push("- Would the design hold at print size / on a phone screen?");
L.push("");
L.push("### 2.3 Verdict");
L.push("");
L.push("- All PASS and scorecard ≥ 35 → mark **PASS** and sign below.");
L.push("- Any FAIL (or a WARN you judge real) → mark **FIX NEEDED** and list per-page fixes.");
L.push("");
L.push(`> Auditor verdict: **PENDING** · Auditor: _(subagent)_ · Date: ${new Date().toISOString().slice(0, 10)}`);
L.push("");

writeFileSync(outPath, L.join("\n"), "utf8");

console.log(`✅ ebook-audit.md → ${basename(outPath)} (${passes.length} PASS · ${warns.length} WARN · ${fails.length} FAIL)`);
for (const r of results.filter((r) => r.status !== "PASS")) {
  console.log(`   ${r.status === "FAIL" ? "❌" : "⚠️"} ${r.check}: ${r.detail}`);
}
if (fails.length) {
  console.error(`❌ ${fails.length} automated FAIL(s) — fix and re-run before spawning the ebook-auditor.`);
  process.exit(1);
}
console.log("Automated checks clean — now spawn the ebook-auditor subagent (see SKILL.md Stage 7 / templates/ebook-auditor-brief.md) to complete the scorecard + verdict in ebook-audit.md.");
process.exit(0);
