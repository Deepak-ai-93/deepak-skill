#!/usr/bin/env node
// The podcast-to-shorts clip finder — scores a timestamped transcript for
// viral moments and generates (or runs) the FFmpeg cut commands.
//
// Two modes:
//   Score:   node clip-finder.mjs --transcript transcript.txt [--clips 5] [--out clip-plan.md]
//   Cut:     node clip-finder.mjs --cuts clip-plan.md --input episode.mp4 [--out clips/] [--run]
//
// Transcript contract: one line per timestamped segment:
//   [00:01:23] This is the spoken line for this segment.
//   [01:02:45] Another line.
// (auto-transcribe your audio/video to this format first — whisper.cpp etc.)
//
// Exit codes: 0 = OK, 1 = no clips above cutoff, 2 = usage error.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve, dirname, basename, join } from "node:path";

// ─── brand banner (deepak-skill · crafted by Deepak) ────────────────────────
const BRAND_LINE = "═".repeat(56);
const banner = (label) =>
  `\n${BRAND_LINE}\n  🎬 deepak-skill — crafted by Deepak\n  skill: podcast-to-shorts · ${label}\n${BRAND_LINE}\n`;
console.log(banner("clip-finder.mjs"));

// --- tiny arg parser (same style as the other skill scripts) ----------------
const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const needle = `--${name}`;
  const found = args.find((a) => a === needle || a.startsWith(`${needle}=`));
  if (found === undefined) return fallback;
  const eq = found.indexOf("=");
  return eq !== -1 ? found.slice(eq + 1) : args[args.indexOf(found) + 1];
};

// --- time helpers ------------------------------------------------------------
const toSec = (ts) => {
  const parts = ts.split(":").map((p) => parseFloat(p));
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return parts[0] || 0;
};
const toStamp = (s) => {
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = Math.round(s % 60);
  const p = (n) => String(n).padStart(2, "0");
  return `${p(h)}:${p(m)}:${p(sec)}`;
};

// --- virality scoring (heuristic — the auditor makes the final call) --------
const SCORE_WORDS = {
  // hooks
  hook: ["imagine", "here's the thing", "what if", "the reason", "nobody tells", "everyone thinks", "i used to", "my client", "listen to me", "this is why", "the truth", "biggest", "first time", "the one thing"],
  // emotion
  emotion: ["hate", "love", "scared", "furious", "cried", "laughed", "angry", "painful", "hurt", "excited", "terrified", "ashamed", "proud", "wish", "regret", "betrayed"],
  // controversy
  controversy: ["wrong", "myth", "lying", "scam", "overrated", "hypocrite", "bullshit", "they don't want", "actually hurts", "don't do", "never do", "avoid", "stop doing", "against"],
  // numbers
  numbers: /(\$[\d,]+|\d+(\.\d+)?%|\d{2,} |\d+x\b)/i,
  // quotable one-liners (short punchy segments)
  quotable: ["never", "always", "it's not", "it is what it is", "simple", "done", "period", "that's it", "end of story"],
};
const SCORE_WEIGHTS = { hook: 3, emotion: 2, controversy: 2, numbers: 2, quotable: 1 };

function scoreSegment(text) {
  const lower = text.toLowerCase();
  let score = 0;
  const breakdown = [];
  for (const [key, list] of Object.entries(SCORE_WORDS)) {
    if (Array.isArray(list)) {
      const hits = list.filter((w) => lower.includes(w));
      if (hits.length) {
        score += SCORE_WEIGHTS[key] * Math.min(hits.length, 2);
        breakdown.push(`${key}+${Math.min(hits.length, 2) * SCORE_WEIGHTS[key]} (${hits.slice(0, 2).join(", ")})`);
      }
    } else if (list.test(text)) {
      score += SCORE_WEIGHTS[key];
      breakdown.push(`${key}+${SCORE_WEIGHTS[key]}`);
    }
  }
  // Short punchy segments are more quotable; very long ones need more signal.
  const words = text.split(/\s+/).length;
  if (words <= 18) { score += 2; breakdown.push("short+2"); }
  if (words >= 60) { score -= 1; breakdown.push("long-1"); }
  return { score, breakdown, words };
}

// --- transcript parsing ------------------------------------------------------
function parseTranscript(txt) {
  const segments = [];
  const re = /\[(\d{1,2}:\d{2}(?::\d{2})?(?:\.\d+)?)\]\s*(.+)/g;
  let m;
  while ((m = re.exec(txt)) !== null) {
    segments.push({ start: toSec(m[1]), text: m[2].trim() });
  }
  return segments;
}

// --- SCORE MODE --------------------------------------------------------------
const transArg = opt("transcript");
if (transArg) {
  const txt = readFileSync(resolve(process.cwd(), transArg), "utf8");
  const segs = parseTranscript(txt);
  if (!segs.length) {
    console.error("❌ No timestamped segments found — transcript must use [HH:MM:SS] line format.");
    process.exit(2);
  }
  const clips = opt("clips", "5");
  const N = parseInt(clips, 10) || 5;
  const cutoff = parseFloat(opt("cutoff", "4"));
  const scored = segs.map((s) => ({ ...s, ...scoreSegment(s.text) })).sort((a, b) => b.score - a.score);
  const picks = scored.filter((s) => s.score >= cutoff);

  // Merge nearby picks into one clip window BEFORE capping at N — sort by TIME
  // first (the picks arrive score-sorted), then fold any pick that starts
  // within 3s of the previous window's end into that window. Windows are 12s
  // long by default. Capping after merging guarantees the user gets the full
  // count they asked for (adjacent moments don't eat each other).
  const byTime = [...picks].sort((a, b) => a.start - b.start);
  const merged = [];
  for (const p of byTime) {
    const last = merged[merged.length - 1];
    if (last && p.start <= last.end + 3) last.end = Math.max(last.end, p.start + 12);
    else merged.push({ ...p, end: p.start + 12 });
  }
  // Keep the order of the final plan ranked by score (best clip first), capped at N.
  merged.sort((a, b) => b.score - a.score).splice(N);

  const outPath = resolve(process.cwd(), opt("out", "clip-plan.md"));
  const lines = [
    "# Clip Plan — virality-scored moments",
    `Source: \`${basename(transArg)}\` · ${segs.length} segments scored · cutoff ≥ ${cutoff}`,
    "",
    "| # | Start | End | Score | Words | Why it scores | Suggested hook |",
    "|---|---|---|---|---|---|---|",
  ];
  merged.forEach((c, i) => {
    const why = c.breakdown.join(", ") || "low signal — auditor check";
    const has = (k) => c.breakdown.some((b) => b.startsWith(k));
    const hook = has("controversy") ? "Contrarian hook — the claim people will argue with"
      : has("emotion") ? "Emotion hook — lead with the feeling"
      : has("hook") ? "Bold-claim hook — state the outcome"
      : "Story hook — tease the moment";
    lines.push(`| ${i + 1} | ${toStamp(c.start)} | ${toStamp(c.end)} | ${c.score} | ${c.words} | ${why} | ${hook} |`);
  });
  lines.push("", "## FFmpeg cut commands (9:16 vertical)", "", "```bash");
  merged.forEach((c, i) => {
    const safe = `clip_${String(i + 1).padStart(2, "0")}`;
    lines.push(`# Clip ${i + 1} — ${toStamp(c.start)} → ${toStamp(c.end)} (score ${c.score})`);
    lines.push(`ffmpeg -ss ${c.start} -i episode.mp4 -t ${(c.end - c.start).toFixed(2)} -vf "crop=ih*9/16:ih,scale=1080:1920" -c:v libx264 -crf 18 -preset fast -c:a aac -b:a 192k clips/${safe}.mp4`);
    lines.push("");
  });
  lines.push("```", "", "Re-run with `--cuts clip-plan.md --input episode.mp4 --run` to execute all cuts.");
  writeFileSync(outPath, lines.join("\n"), "utf8");
  console.log(`✅ ${merged.length} viral moments (of ${segs.length} scored) → ${outPath}`);
  if (!merged.length) {
    console.error("⚠ No segments scored above the cutoff — either the content is flat or the transcript format is off. Lower --cutoff or re-transcribe.");
    process.exit(1);
  }
  process.exit(0);
}

// --- CUT MODE ----------------------------------------------------------------
const cutsArg = opt("cuts");
if (cutsArg) {
  const plan = readFileSync(resolve(process.cwd(), cutsArg), "utf8");
  const input = opt("input");
  if (!input) {
    console.error("Usage: node clip-finder.mjs --cuts clip-plan.md --input episode.mp4 [--run]");
    process.exit(2);
  }
  const out = resolve(process.cwd(), opt("out", "clips"));
  const lines = plan.split("\n").filter((l) => l.startsWith("ffmpeg "));
  if (!lines.length) {
    console.error("❌ No ffmpeg commands found in the clip plan — re-run with --transcript first.");
    process.exit(2);
  }
  if (opt("run") === "1" || args.includes("--run")) {
    mkdirSync(out, { recursive: true });
    const { execSync } = await import("node:child_process");
    for (const cmd of lines) {
      const final = cmd.replaceAll("clips/", `${out.replace(/\\/g, "/")}/`);
      console.log(`▶ ${final}`);
      execSync(final, { stdio: "inherit" });
    }
    console.log(`✅ ${lines.length} clips → ${out}`);
  } else {
    console.log(`✅ ${lines.length} cut commands ready — re-run with --run to execute, or copy the commands from ${cutsArg}.`);
  }
  process.exit(0);
}

console.error("Usage:");
console.error("  node clip-finder.mjs --transcript transcript.txt [--clips 5] [--cutoff 4] [--out clip-plan.md]");
console.error("  node clip-finder.mjs --cuts clip-plan.md --input episode.mp4 [--out clips/] [--run]");
process.exit(2);
