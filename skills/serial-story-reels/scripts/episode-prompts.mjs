#!/usr/bin/env node
// The serial-story-reels prompt-pack builder — turns a series-plan.json into a
// copy-paste Veo 3.1 / Google Flow prompt pack for a WHOLE episodic story:
// one cinematic video prompt per scene, grouped by episode, engineered so the
// SAME characters stay consistent ACROSS episodes (verbatim character block +
// grade token + cinematic token in EVERY prompt a character appears in,
// self-verified word-by-word). Also extracts a voiceover line sheet
// (dialogue/VO per scene with delivery direction) for native Veo audio or a
// Kokoro post-production pass.
//
// Usage:
//   node episode-prompts.mjs --plan series-plan.json [--out prompts.md] [--vo voiceover.md]
//
// series-plan.json contract (validated first by series-arc.mjs):
// {
//   "title": "Neon Hearts", "genre": "...", "aspect": "9:16",
//   "grade": "Grade: ... (FULL token — verbatim in every prompt)",
//   "cinematic": "Cinematic: ... (FULL IMAX token — verbatim in every prompt)",
//   "world": "World: ... (verbatim world/lighting block)",
//   "characters": [{ "id": "maya", "name": "Maya", "block": "Character: ... (VERBATIM)" }],
//   "episodes": [{ "id": "e1", "title": "...", "hook": "...", "cliffhanger": "...",
//     "scenes": [{ "id": "s1", "action": "...", "camera": "...", "context": "...",
//       "dialogue": "...", "sfx": "...", "vo": "...", "characters": ["maya"], "bridge": false }] }]
// }
//
// Self-verify: every prompt is checked word-by-word for the character blocks of
// ALL characters in the scene + the grade token + the cinematic token. Missing
// word = FAIL (exit 1).
//
// Exit codes: 0 = OK, 1 = verify FAIL, 2 = usage error.
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, basename } from "node:path";

// ─── brand banner (deepak-skill · crafted by Deepak) ────────────────────────
const BRAND_LINE = "═".repeat(56);
const banner = (label) =>
  `\n${BRAND_LINE}\n  🎬 deepak-skill — crafted by Deepak\n  skill: serial-story-reels · ${label}\n${BRAND_LINE}\n`;
console.log(banner("episode-prompts.mjs"));

// --- tiny arg parser (same style as the other skill scripts) ----------------
const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const needle = `--${name}`;
  const found = args.find((a) => a === needle || a.startsWith(`${needle}=`));
  if (found === undefined) return fallback;
  const eq = found.indexOf("=");
  return eq !== -1 ? found.slice(eq + 1) : args[args.indexOf(found) + 1];
};

const planArg = opt("plan");
if (!planArg) {
  console.error("Usage: node episode-prompts.mjs --plan series-plan.json [--out prompts.md] [--vo voiceover.md]");
  process.exit(2);
}

let plan;
try {
  plan = JSON.parse(readFileSync(resolve(process.cwd(), planArg), "utf8"));
} catch (e) {
  console.error(`❌ Could not parse ${planArg}: ${e.message}`);
  process.exit(2);
}
const outPath = resolve(process.cwd(), opt("out", "prompts.md"));
const voPath = opt("vo") ? resolve(process.cwd(), opt("vo")) : null;

// --- mandatory fields (the quality rails — never silently drop them) --------
const required = ["grade", "cinematic", "world", "title"];
const missingFields = required.filter((f) => !plan[f] || typeof plan[f] !== "string" || !plan[f].trim());
if (missingFields.length) {
  console.error(`❌ series-plan.json is missing required field(s): ${missingFields.join(", ")}`);
  console.error("   Run series-arc.mjs first — it validates the arc and locks the tokens.");
  process.exit(2);
}
if (!Array.isArray(plan.characters) || !plan.characters.length) {
  console.error("❌ series-plan.json needs at least one character with a verbatim block.");
  process.exit(2);
}

const characters = plan.characters;
const charById = Object.fromEntries(characters.map((c) => [c.id, c]));
const episodes = plan.episodes || [];
const DUR = plan.scene_duration || 6;

// --- self-guard: the script must never silently drop a character or episode ---
if (!Array.isArray(plan.episodes) || !plan.episodes.length) {
  console.error("❌ series-plan.json has no episodes — a serialized story needs ≥2. Run series-arc.mjs first.");
  process.exit(2);
}
const unknownChars = new Set();
for (const ep of episodes) {
  for (const s of ep.scenes || []) {
    for (const id of s.characters || []) {
      if (!charById[id]) unknownChars.add(id);
    }
  }
}
if (unknownChars.size) {
  console.error(`❌ series-plan.json references undefined character(s): ${[...unknownChars].join(", ")}`);
  console.error("   Run series-arc.mjs first — it validates the arc and locks the cast.");
  process.exit(2);
}

// --- token presence check (word-level) ---------------------------------------
function missingWords(promptText, token) {
  if (!token) return [];
  const words = new Set(token.toLowerCase().match(/[a-z0-9'’]+/g) || []);
  const promptWords = new Set(promptText.toLowerCase().match(/[a-z0-9'’]+/g) || []);
  return [...words].filter((w) => !promptWords.has(w));
}

// --- voiceover parsing: split a Veo dialogue line into speech + delivery -------
// Input: `She mutters, breathless, "Not today."`  →  speech "Not today.", delivery "breathless"
// Keeps the sheet clean for a Kokoro TTS pass (no nested quotes, no framing words).
function splitDialogue(dialogue) {
  const m = dialogue.match(/"([^"]+)"/);
  if (!m) return { speech: dialogue.trim(), delivery: "" };
  const prefix = dialogue.slice(0, m.index).trim();
  let delivery = prefix
    .replace(/^[^,]+,\s*/i, "") // drop "She says," / "He mutters," / "The collector says,"
    .replace(/,\s*$/, "")
    .trim();
  if (!delivery && prefix) delivery = prefix.replace(/,\s*$/, "").trim().toLowerCase(); // keep the framing if no tone follows the speaker
  return { speech: m[1], delivery };
}

// --- build one Veo prompt per scene ------------------------------------------
function buildPrompt(scene) {
  const parts = [];
  // 1. Cinematography — camera framing + motion + lens (specific, never vague)
  parts.push(scene.camera || "Medium shot, smooth push-in");
  // 2. Subjects — the VERBATIM character blocks for every character in the scene
  for (const id of scene.characters || []) {
    const ch = charById[id];
    if (ch && ch.block) parts.push(ch.block);
  }
  // 3. Action — what happens in this clip, plain motion with physics
  parts.push(scene.action || "");
  // 4. Context — location + time + lighting state (continuity across scenes)
  parts.push(scene.context || "");
  // 5. Style & ambiance — grade token + cinematic token + world
  parts.push(plan.grade);
  parts.push(plan.cinematic);
  parts.push(plan.world);
  // Native audio — dialogue in quotes with delivery, SFX/ambient labeled.
  const sfx = (scene.sfx || "").replace(/^(SFX|Ambient|Ambiance):\s*/i, "").trim();
  if (scene.dialogue) parts.push(`Dialogue: ${scene.dialogue}`);
  if (sfx) parts.push(`SFX: ${sfx}`);
  const prompt = parts
    .map((p) => p.trim().replace(/\.+$/, ""))
    .filter(Boolean)
    .join(". ") + ".";
  return prompt;
}

// --- assemble -----------------------------------------------------------------
const lines = [];
lines.push(`# Veo Prompt Pack — "${plan.title}" (episodic)`);
lines.push("");
lines.push(`**Genre:** ${plan.genre || "—"} · **Aspect:** ${plan.aspect || "9:16"} · **Clip:** ${DUR}s per scene · **Episodes:** ${episodes.length}`);
lines.push("");
lines.push("## Before you start (do ONCE — the cast anchors every episode)");
lines.push("1. **Generate + upload the character reference images** to Flow's Ingredients panel (reuse for EVERY scene of EVERY episode):");
characters.forEach((c, i) => lines.push(`   - ${c.name || c.id}${i === 0 ? "  ← primary character anchor" : ""}`));
lines.push("2. **Never edit the character blocks** — they are identical in every prompt below. Rewording breaks cross-episode consistency.");
lines.push(`3. **Grade locked (whole series):** ${plan.grade}`);
lines.push(`4. **Cinematic locked:** ${plan.cinematic}`);
lines.push(`5. Generate at **${plan.aspect || "9:16"}, ${DUR}s, 1080p** (4K upscale after). Bridged scenes (🔗) use the previous scene's **last frame** as the start frame.`);
lines.push("6. For episodes 2+: paste the **final frame of the previous episode's last scene** as the first scene's start frame to carry the cast + world forward.");
lines.push("");
lines.push("---");
lines.push("");

let fail = 0;
let total = 0;
const voLines = []; // { episode, scene, speaker, line }

for (const ep of episodes) {
  lines.push(`## Episode ${ep.id || "?"} — ${ep.title}`);
  lines.push("");
  lines.push(`**Hook:** ${ep.hook}`);
  lines.push(`**Cliffhanger:** ${ep.cliffhanger}`);
  lines.push("");
  for (const s of ep.scenes || []) {
    total += 1;
    const prompt = buildPrompt(s);
    // Self-verify: every character block in the scene + grade + cinematic present
    const check = { grade: missingWords(prompt, plan.grade), cinematic: missingWords(prompt, plan.cinematic) };
    for (const id of s.characters || []) {
      const ch = charById[id];
      if (ch && ch.block) check[`char:${id}`] = missingWords(prompt, ch.block);
    }
    const ok = Object.values(check).every((v) => !v.length);
    if (!ok) fail += 1;

    lines.push(`### ${ep.id}/${s.id} — Scene ${total}${s.bridge ? "  🔗 (bridge: start from previous scene's last frame)" : ""}`);
    lines.push(`**Time:** ${(total - 1) * DUR}s–${total * DUR}s · **${DUR}s clip** · **verify:** ${ok ? "✅" : "❌"}`);
    lines.push("");
    lines.push("```");
    lines.push(prompt);
    lines.push("```");
    for (const [k, v] of Object.entries(check)) {
      if (v.length) lines.push(`⚠ missing from ${k}: ${v.join(", ")}`);
    }
    // Voiceover sheet entry — speech + delivery extracted cleanly
    if (s.dialogue) {
      const { speech, delivery } = splitDialogue(s.dialogue);
      voLines.push({ episode: ep.id, scene: s.id, speech, delivery: s.vo || delivery });
    } else if (s.vo) {
      voLines.push({ episode: ep.id, scene: s.id, speech: s.vo, delivery: "" });
    }
    lines.push("");
  }
  lines.push("---");
  lines.push("");
}

lines.push("## Series continuity notes");
lines.push("- Reuse the SAME Ingredients for every episode — the cast must not drift.");
lines.push("- Bridge across episode boundaries: last frame of episode N → first frame of episode N+1.");
lines.push("- Voice anchor: extract the clean dialogue from each character's first scene and re-feed it as the voice reference for later episodes.");
lines.push("- Post: cut to beats, add on-screen captions, mix VO + music to -14 LUFS (voice-sfx-audio).");

writeFileSync(outPath, lines.join("\n"), "utf8");

// --- voiceover line sheet (optional) ------------------------------------------
if (voPath && voLines.length) {
  const V = [];
  V.push(`# Voiceover Sheet — "${plan.title}"`);
  V.push("");
  V.push(`**Mode:** native Veo dialogue (paste into the scene prompt) OR Kokoro post-production (generate + mix with voice-sfx-audio).`);
  V.push("");
  for (const ep of episodes) {
    const epLines = voLines.filter((v) => v.episode === ep.id);
    if (!epLines.length) continue;
    V.push(`## Episode ${ep.id} — ${ep.title}`);
    V.push("");
    for (const v of epLines) {
      V.push(`- **${v.scene}:** "${v.speech}"${v.delivery ? ` — *delivery: ${v.delivery}*` : ""}`);
    }
    V.push("");
  }
  V.push(`> Voice anchor: save the clean dialogue from each character's FIRST scene as their voice reference for all later episodes (matches Veo's native audio + Kokoro's voice cloning paths).`);
  writeFileSync(voPath, V.join("\n"), "utf8");
}

const voNote = voPath ? ` + voiceover → ${basename(voPath)}` : "";
console.log(`✅ ${total} Veo prompts → ${basename(outPath)} (${total - fail}/${total} consistency-verified)${voNote}`);
if (fail) {
  console.error(`❌ ${fail} prompt(s) FAILED consistency verification — fix the plan fields (character blocks/grade/cinematic) and regenerate.`);
  process.exit(1);
}
console.log("Copy each prompt into Google Flow, keep the same Ingredients, generate scene by scene, and bridge across episode boundaries.");
process.exit(0);
