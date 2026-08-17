#!/usr/bin/env node
// positioning-studio — the automated audit half of the positioning-auditor gate.
// Scans a positioning pack (positioning.md + message-map.md) and checks everything
// a script can: positioning.md exists; one-liner ≤ 15 words; messaging hierarchy
// complete (Audience → Problem → Promise → Proof); ≥ 3 proof points; ≥ 3 taglines;
// anti-fluff blocklist; voice guide present; author memory + taste
// (positioning-memory.md present in the pack or working folder; taste banned-words
// FAIL the positioning if they leak in); message-map.md present (WARN if missing).
// Writes positioning-audit.md with automated verdicts + an AUDITOR section.
// Exit 1 on any FAIL.
//
// Usage:
//   node audit-positioning.mjs --pack <positioning-folder> [--out positioning-audit.md]
//
// Exit codes: 0 = clean, 1 = FAIL, 2 = usage error.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, basename, join } from "node:path";

// ─── brand banner (deepak-skill · crafted by Deepak) ────────────────────────
const BRAND_LINE = "═".repeat(56);
const banner = (label) =>
  `\n${BRAND_LINE}\n  🎬 deepak-skill — crafted by Deepak\n  skill: positioning-studio · ${label}\n${BRAND_LINE}\n`;
console.log(banner("audit-positioning.mjs"));

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
  "cutting-edge", "world-class", "best-in-class",
];

const packArg = opt("pack");
if (!packArg) {
  console.error("Usage: node audit-positioning.mjs --pack <positioning-folder> [--out positioning-audit.md]");
  process.exit(2);
}
const packDir = resolve(process.cwd(), packArg);
const outPath = resolve(process.cwd(), opt("out", "positioning-audit.md"));
if (!existsSync(packDir)) {
  console.error(`❌ Positioning folder not found: ${packDir}`);
  console.error("   Pass the pack folder (positioning.md + message-map.md) — e.g. skills/positioning-studio/examples/saas-tool-positioning");
  process.exit(2);
}

const results = [];
const add = (status, check, detail) => results.push({ status, check, detail });

const read = (f) => (existsSync(join(packDir, f)) ? readFileSync(join(packDir, f), "utf8") : null);

// --- section extractor: text between a heading and the next heading ----------
const section = (md, heading) => {
  const lines = md.split(/\r?\n/);
  let capture = false;
  const out = [];
  for (const line of lines) {
    const h = line.match(/^##\s+(.+)$/);
    if (h) {
      if (capture) break;
      capture = h[1].trim() === heading;
      continue;
    }
    if (capture) out.push(line);
  }
  return out.join("\n").trim();
};

const positioning = read("positioning.md");
if (!positioning) {
  add("FAIL", "positioning.md exists", "missing — positioning.md is the single source of truth for the message");
} else {
  // one-liner ≤ 15 words (first non-empty line of ## One-liner)
  const oneLinerSec = section(positioning, "One-liner");
  const oneLiner = (oneLinerSec.split(/\r?\n/).find((l) => l.trim()) || "").replace(/^[-*]\s*/, "").trim();
  if (!oneLiner) add("FAIL", "one-liner", "no text under ## One-liner");
  else {
    const words = oneLiner.split(/\s+/).filter(Boolean).length;
    if (words <= 15) add("PASS", "one-liner", `${words} words — ≤ 15 (audience + outcome + difference in one breath)`);
    else add("FAIL", "one-liner", `${words} words — over 15; if it can't be said in one breath it isn't positioning`);
  }

  // messaging hierarchy complete
  const hierarchy = section(positioning, "Messaging hierarchy");
  const rungs = ["audience", "problem", "promise", "proof"];
  const missing = rungs.filter((r) => !new RegExp(`^[-*]\\s*\\*{0,2}${r}\\*{0,2}\\s*:`, "im").test(hierarchy));
  if (!hierarchy) add("FAIL", "messaging hierarchy", "no ## Messaging hierarchy section");
  else if (!missing.length) add("PASS", "messaging hierarchy", "all 4 rungs present: Audience → Problem → Promise → Proof");
  else add("FAIL", "messaging hierarchy", `missing rung(s): ${missing.join(", ")} — a missing rung is a gap in the message`);

  // proof points ≥ 3
  const proof = section(positioning, "Proof points");
  const proofBullets = (proof.match(/^\s*[-*]\s+(.+)$/gm) || []).length;
  if (proofBullets >= 3) add("PASS", "proof points", `${proofBullets} specific proof bullet(s) — ≥ 3 (numbers / named results)`);
  else if (proof) add("FAIL", "proof points", `only ${proofBullets} — need ≥ 3; no proof → shrink the promise until there is`);
  else add("FAIL", "proof points", "no ## Proof points section — the promise must be backed by receipts");

  // taglines ≥ 3
  const taglines = section(positioning, "Taglines");
  const taglineBullets = (taglines.match(/^\s*[-*]\s+(.+)$/gm) || []).map((b) => b.replace(/^\s*[-*]\s+/, "").trim());
  if (taglineBullets.length >= 3) {
    const longTaglines = taglineBullets.filter((t) => t.split(/\s+/).filter(Boolean).length > 8);
    if (!longTaglines.length) add("PASS", "taglines", `${taglineBullets.length} tagline(s), each ≤ 8 words`);
    else add("FAIL", "taglines", `${longTaglines.length} tagline(s) over 8 words: ${longTaglines.join(" | ")}`);
  } else if (taglines) add("FAIL", "taglines", `only ${taglineBullets.length} — need ≥ 3 distinct one-liners`);
  else add("FAIL", "taglines", "no ## Taglines section — 3 standalone hooks, ≤ 8 words each");

  // anti-fluff
  const fluff = FLUFF.filter((w) => positioning.toLowerCase().includes(w.toLowerCase()));
  if (!fluff.length) add("PASS", "anti-fluff", "no fluff words");
  else add("FAIL", "anti-fluff", fluff.join(", "));

  // voice guide
  const voice = section(positioning, "Voice guide");
  if (voice) {
    const hasTone = /tone/i.test(voice);
    const hasRhythm = /rhythm|sentence/i.test(voice);
    if (hasTone && hasRhythm) add("PASS", "voice guide", "tone + rhythm recorded (written from the taste profile)");
    else add("WARN", "voice guide", `voice guide present but missing ${[!hasTone && "tone", !hasRhythm && "rhythm"].filter(Boolean).join(" + ")}`);
  } else {
    add("FAIL", "voice guide", "no ## Voice guide section — the message must carry the author's voice");
  }
}

// memory + taste (author rails)
const memPack = read("positioning-memory.md");
const memCwdPath = join(process.cwd(), "positioning-memory.md");
const memCwd = existsSync(memCwdPath) ? readFileSync(memCwdPath, "utf8") : null;
const mem = memPack || memCwd;
if (mem) {
  add("PASS", "author memory", "positioning-memory.md present (pack or working folder) — Stage 0 read → Stage 7 write");
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
    // scan the actual marketing copy only — the ## Voice guide legitimately names the bans
    const copy = positioning ? positioning.split(/^##\s+Voice guide\s*$/m)[0] : "";
    const hits = banned.filter((w) => copy.toLowerCase().includes(w.toLowerCase()));
    if (!hits.length) add("PASS", "taste banned words", `${banned.length} author-banned word(s) from the taste profile — none leaked into the positioning copy`);
    else add("FAIL", "taste banned words", `${hits.join(", ")} — the author banned these (positioning-memory.md §2); rewrite in their voice`);
  }
} else {
  add("WARN", "author memory", "no positioning-memory.md in the pack or working folder — create one at Stage 0 (templates/memory-profile.md): identity, taste, past builds");
}

// message map (recommended)
if (read("message-map.md")) add("PASS", "message map", "message-map.md present (same message mapped to 3+ channels)");
else add("WARN", "message map", "no message-map.md — the hierarchy should be rephrased per channel (Stage 4)");

// ─── write positioning-audit.md ─────────────────────────────────────────────
const fails = results.filter((r) => r.status === "FAIL");
const warns = results.filter((r) => r.status === "WARN");
const passes = results.filter((r) => r.status === "PASS");

const L = [];
L.push(`# Positioning Audit — ${basename(packDir)}`);
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
L.push("### 2.1 Positioning-worthiness scorecard (rate 1–5 each, /50 — a positioning worth shipping scores ≥ 35)");
L.push("");
L.push("| Criterion | Ask | Score /5 |");
L.push("|---|---|---|");
L.push("| **One-liner pull** | Would the one-liner stop the right person in one breath (≤ 15 words, audience + outcome + difference)? | |");
L.push("| **Differentiation** | Does it separate the product from competitors (not 'we're the best X')? | |");
L.push("| **Hierarchy logic** | Audience → Problem → Promise → Proof — each rung follows from the last? | |");
L.push("| **Proof believability** | Are the proof points specific, honest and human (not invented-sounding)? | |");
L.push("| **Tagline quality** | Are the taglines distinct, ≤ 8 words, and usable as standalone hooks? | |");
L.push("| **Voice match** | Does the whole positioning sound like the author (taste profile), not AI marketing? | |");
L.push("| **Specificity** | Specific beats generic — pains, outcomes, numbers named? | |");
L.push("| **Anti-hype** | Zero fluff; every claim backed by a proof point? | |");
L.push("| **Message map** | Is the SAME message rephrased per channel (or clearly skipped)? | |");
L.push("| **Ship-readiness** | Would the creator confidently put this on their landing page today? | |");
L.push("");
L.push("### 2.2 Creative judgment calls");
L.push("");
L.push("- Does the one-liner actually differentiate, or could any competitor claim it?");
L.push("- Does the promise overreach the proof? (Shrink the promise until provable.)");
L.push("- Does the voice guide match the author's taste profile (tone, rhythm, banned words)?");
L.push("");
L.push("### 2.3 Verdict");
L.push("");
L.push("- All PASS and scorecard ≥ 35 → mark **PASS** and sign below.");
L.push("- Any FAIL (or a WARN you judge real) → mark **FIX NEEDED** and list concrete fixes.");
L.push("");
L.push(`> Auditor verdict: **PENDING** · Auditor: _(subagent)_ · Date: ${new Date().toISOString().slice(0, 10)}`);
L.push("");

writeFileSync(outPath, L.join("\n"), "utf8");

console.log(`✅ positioning-audit.md → ${basename(outPath)} (${passes.length} PASS · ${warns.length} WARN · ${fails.length} FAIL)`);
for (const r of results.filter((r) => r.status !== "PASS")) {
  console.log(`   ${r.status === "FAIL" ? "❌" : "⚠️"} ${r.check}: ${r.detail}`);
}
if (fails.length) {
  console.error(`❌ ${fails.length} automated FAIL(s) — fix and re-run before spawning the positioning-auditor.`);
  process.exit(1);
}
console.log("Automated checks clean — now spawn the positioning-auditor subagent (see SKILL.md Stage 6 / templates/positioning-auditor-brief.md) to complete the scorecard + verdict in positioning-audit.md.");
process.exit(0);
