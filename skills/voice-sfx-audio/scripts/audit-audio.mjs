#!/usr/bin/env node
// The voice-sfx-audio audit harness — the automated half of the
// audio-auditor gate. Scans a delivered audio plan (voiceover + SFX + mix
// notes) and checks what a script CAN check: license compliance (no
// CC-NC/BBC/F5-TTS/XTTS/Edge-TTS for monetized work, no NC anywhere),
// voice choices (Kokoro default, deep-voice recipe), mixing contract
// (ducking, levels voice 100/music 30/SFX 80, -14 LUFS), attribution for
// CC-BY sources, and locally frozen audio files. Writes audio-audit.md with
// the automated verdicts + an AUDITOR section for the subagent (voice quality,
// mix judgment). Exit 1 on any FAIL.
//
// Usage:
//   node audit-audio.mjs --pack <audio-folder> [--out audio-audit.md]
//
// The folder should contain an audio plan .md (e.g. audio-plan.md or
// voiceover.md) and/or assets/ with the wav/mp3 files. Missing files are
// FAIL but the audit continues.
//
// Exit codes: 0 = all automated checks PASS, 1 = any FAIL, 2 = usage error.
import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { resolve, basename, join } from "node:path";

// ─── brand banner (deepak-skill · crafted by Deepak) ────────────────────────
const BRAND_LINE = "═".repeat(56);
const banner = (label) =>
  `\n${BRAND_LINE}\n  🎬 deepak-skill — crafted by Deepak\n  skill: voice-sfx-audio · ${label}\n${BRAND_LINE}\n`;
console.log(banner("audit-audio.mjs"));

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
  console.error("Usage: node audit-audio.mjs --pack <audio-folder> [--out audio-audit.md]");
  process.exit(2);
}
const packDir = resolve(process.cwd(), packArg);
const outPath = resolve(process.cwd(), opt("out", "audio-audit.md"));
if (!existsSync(packDir)) {
  console.error(`❌ Audio folder not found: ${packDir}`);
  console.error("   Pass the folder that holds the audio plan .md and/or assets/");
  process.exit(2);
}

const read = (f) => (existsSync(join(packDir, f)) ? readFileSync(join(packDir, f), "utf8") : null);

// ─── results collector ──────────────────────────────────────────────────────
const results = []; // { status: "PASS"|"FAIL"|"WARN", check, detail }
const add = (status, check, detail) => results.push({ status, check, detail });
let auditSections = [];

// ─── find the plan (audio-plan.md / voiceover.md / mix-notes.md / any .md) ──
let plan = null;
let planName = null;
{
  const candidates = ["audio-plan.md", "voiceover.md", "mix-notes.md", "sound-design.md", "plan.md"];
  for (const c of candidates) {
    if (existsSync(join(packDir, c))) { plan = read(c); planName = c; break; }
  }
  if (!plan) {
    try {
      const md = readdirSync(packDir).find((f) => /\.md$/i.test(f));
      if (md) { plan = read(md); planName = md; }
    } catch {
      plan = null;
    }
  }
}

if (!plan) {
  add("FAIL", "audio plan exists", "no .md plan found (audio-plan.md / voiceover.md / mix-notes.md) — the license + mix decisions must be documented");
} else {
  auditSections.push(`plan file: ${planName}`);
  // license compliance — the hard rail
  const ncLicensed = /F5-TTS|XTTS|CC-NC|non-commercial|BBC Sound Effects|BBC\b|Edge-TTS|gTTS/i.test(plan);
  if (ncLicensed) {
    // check whether they're flagged as banned (acceptable) or chosen (FAIL)
    const banned = /never|don't|avoid|banned|⚠️|not for|no commercial|skip/i.test(plan.replace(/F5-TTS|XTTS|CC-NC|BBC|Edge-TTS|gTTS/g, " "));
    if (banned) add("PASS", "license compliance", "NC/cloud engines referenced only as BANNED — good");
    else add("FAIL", "license compliance", "NC/cloud engines appear as choices (F5-TTS/XTTS/CC-NC/BBC/Edge-TTS) — not monetizable");
  } else {
    add("PASS", "license compliance", "no non-commercial engines/sources chosen");
  }
  const cc0 = (plan.match(/CC0|Kenney|Pixabay|Apache 2\.0|MIT/gi) || []).length;
  if (cc0) add("PASS", "commercial-safe sources", `${cc0} CC0/MIT/Apache source reference(s)`);
  else add("WARN", "commercial-safe sources", "no CC0/MIT/Apache source references found");
  const ccby = (plan.match(/CC-BY|Incompetech|attribution|Kevin MacLeod/gi) || []).length;
  if (ccby) add("PASS", "CC-BY attribution", `${ccby} CC-BY/attribution reference(s)`);
  else add("WARN", "CC-BY attribution", "no CC-BY attribution notes — if any CC-BY source is used, add the credit line");
  // voice choice
  const voice = plan.match(/Kokoro|Piper|Chatterbox|am_fenrir|am_michael|bm_george|af_heart/i);
  if (voice) add("PASS", "voice engine", `${voice[0]} selected`);
  else add("WARN", "voice engine", "no voice engine named (Kokoro recommended)");
  // mix contract
  const duck = /duck|sidechain|data-volume|0\.3/i.test(plan);
  if (duck) add("PASS", "music ducking", "ducking (sidechain or data-volume) present");
  else add("WARN", "music ducking", "no ducking mentioned — music must duck under the voice");
  const levels = /voice 100|music ~?30|music 0\.3|SFX ~?80|0\.9|0\.8/i.test(plan);
  if (levels) add("PASS", "mix levels", "voice 100 / music ~30 / SFX ~80 levels present");
  else add("WARN", "mix levels", "no explicit mix levels (voice 100% / music ~30% / SFX ~80%)");
  const lufs = /-14|LUFS|loudnorm/i.test(plan);
  if (lufs) add("PASS", "loudness -14 LUFS", "loudness target present");
  else add("WARN", "loudness -14 LUFS", "no -14 LUFS target mentioned");
  const frozen = /frozen|local|freeze|download once|assets\//i.test(plan);
  if (frozen) add("PASS", "local audio files", "local-freeze note present");
  else add("WARN", "local audio files", "no local-freeze note — files must be downloaded once, not hot-linked");
}

// ─── assets/ audio files ────────────────────────────────────────────────────
let audioFiles = 0;
if (existsSync(join(packDir, "assets"))) {
  try {
    audioFiles = readdirSync(join(packDir, "assets")).filter((f) => /\.(wav|mp3|m4a|flac)$/i.test(f)).length;
  } catch {
    audioFiles = 0;
  }
  if (audioFiles) add("PASS", "audio assets", `${audioFiles} local audio file(s) in assets/`);
  else add("WARN", "audio assets", "assets/ exists but no wav/mp3/m4a/flac files");
} else {
  add("WARN", "audio assets", "no assets/ folder with local audio files");
}

const fails = results.filter((r) => r.status === "FAIL");
const warns = results.filter((r) => r.status === "WARN");
const passes = results.filter((r) => r.status === "PASS");

// ─── write audio-audit.md ───────────────────────────────────────────────────
const L = [];
L.push(`# Audio Audit — ${basename(packDir)}`);
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
  L.push("## 1b. Audio snippets for the auditor");
  L.push("");
  for (const s of auditSections) L.push(`- ${s}`);
  L.push("");
}
L.push("## 2. Auditor section — COMPLETE THIS (subagent, fresh eyes)");
L.push("");
L.push("### 2.1 Audio-worthiness scorecard (rate 1–5 each, /50 — a mix worth shipping scores ≥ 35)");
L.push("");
L.push("| Criterion | Ask | Score /5 |");
L.push("|---|---|---|");
L.push("| **License safety** | Every engine + source commercial-safe (no CC-NC/BBC/F5-TTS/XTTS/Edge-TTS for monetized work)? | |");
L.push("| **Voice quality** | Does the chosen voice suit the content (deep recipe applied for premium narration)? | |");
L.push("| **Emotion fit** | Hook energetic, story calm — does the delivery match the beats? | |");
L.push("| **Sync accuracy** | Does each voice line land in its beat window (no drift, no overflow)? | |");
L.push("| **Ducking quality** | Music ducks cleanly under the voice (sidechain or data-volume)? | |");
L.push("| **Mix levels** | Voice 100% / music ~30% / SFX ~80%? | |");
L.push("| **Loudness** | Final mix ≈ -14 LUFS? | |");
L.push("| **Attribution** | Every CC-BY source credited in the video description? | |");
L.push("| **Local files** | All audio frozen locally (no hot-linked CDNs at render time)? | |");
L.push("| **SFX taste** | SFX used sparingly and meaningfully (not a layer of noise)? | |");
L.push("");
L.push("### 2.2 Creative judgment calls");
L.push("");
L.push("- Any voice line that would sound robotic or rushed (cap 1.15–1.35×)?");
L.push("- Any SFX that fights the narration or the mood?");
L.push("- Any license edge case worth double-checking before monetizing?");
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
console.log(`✅ audio-audit.md → ${basename(outPath)} (${passes.length} PASS · ${warns.length} WARN · ${fails.length} FAIL)`);
for (const r of results.filter((r) => r.status !== "PASS")) {
  console.log(`   ${r.status === "FAIL" ? "❌" : "⚠️"} ${r.check}: ${r.detail}`);
}
if (fails.length) {
  console.error(`❌ ${fails.length} automated FAIL(s) — fix and re-run before spawning the audio-auditor.`);
  process.exit(1);
}
console.log("Automated checks clean — now spawn the audio-auditor subagent (see SKILL.md Stage 7) to complete the scorecard + verdict in audio-audit.md.");
process.exit(0);
