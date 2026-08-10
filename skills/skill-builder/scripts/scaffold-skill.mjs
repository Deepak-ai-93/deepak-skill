#!/usr/bin/env node
// The skill-builder scaffolder — creates a NEW skill folder that follows the
// deepak-skill conventions: SKILL.md (frontmatter + quality bar + workflow +
// checklist), Deepak-branded scripts with the shared opt() arg parser, template
// reference docs, and an examples/ folder.
//
// Usage:
//   node scaffold-skill.mjs --name podcast-to-shorts --desc "Long audio/video → viral vertical shorts" [--scripts clip-finder,cut-clips] [--templates prompt-pack,hook-formulas] [--example 1]
//   node scaffold-skill.mjs --list          # show every skill in skills/
//
// Exit codes: 0 = scaffolded OK, 1 = error, 2 = usage error.
import { mkdirSync, writeFileSync, readdirSync, existsSync, readFileSync } from "node:fs";
import { join, basename, dirname } from "node:path";
import { fileURLToPath } from "node:url";

// ─── brand banner (deepak-skill · crafted by Deepak) ────────────────────────
const BRAND_LINE = "═".repeat(56);
const banner = (label) =>
  `\n${BRAND_LINE}\n  🎬 deepak-skill — crafted by Deepak\n  skill: skill-builder · ${label}\n${BRAND_LINE}\n`;
console.log(banner("scaffold-skill.mjs"));

// --- tiny arg parser (same style as the other skill scripts) ----------------
const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const needle = `--${name}`;
  const found = args.find((a) => a === needle || a.startsWith(`${needle}=`));
  if (found === undefined) return fallback;
  const eq = found.indexOf("=");
  return eq !== -1 ? found.slice(eq + 1) : args[args.indexOf(found) + 1];
};

const SKILLS_DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

// --- --list mode: show every skill ------------------------------------------
if (args.includes("--list")) {
  console.log(`\nSkills in ${SKILLS_DIR}:\n`);
  for (const dir of readdirSync(SKILLS_DIR).sort()) {
    const skillDir = join(SKILLS_DIR, dir);
    if (!existsSync(join(skillDir, "SKILL.md"))) continue;
    const md = readFileSafe(join(skillDir, "SKILL.md"));
    // description may span multiple lines in the frontmatter — grab until the
    // closing --- and collapse whitespace.
    const fm = (md.match(/^---\s*\n([\s\S]*?)\n---\s*\n/) || [])[1] || "";
    const descRaw = (fm.match(/^description:\s*([\s\S]*)$/m) || [])[1] || "";
    const desc = descRaw.replace(/\n\s+/g, " ").trim() || "(no description)";
    const hasScripts = existsSync(join(skillDir, "scripts")) ? readdirSync(join(skillDir, "scripts")).filter((f) => f.endsWith(".mjs")).length : 0;
    const hasTemplates = existsSync(join(skillDir, "templates")) ? readdirSync(join(skillDir, "templates")).length : 0;
    const hasExamples = existsSync(join(skillDir, "examples")) ? readdirSync(join(skillDir, "examples")).length : 0;
    console.log(`  ${dir.padEnd(28)} scripts:${hasScripts} templates:${hasTemplates} examples:${hasExamples}`);
    console.log(`    ${desc}`);
  }
  process.exit(0);
}

const name = opt("name");
// Sanitize the description for YAML frontmatter — strip newlines (they break
// the frontmatter block) and collapse whitespace before interpolating it into
// SKILL.md. Quotes/colons are fine inside double-quoted YAML, newlines are not.
const desc = (opt("desc", "") || "").replace(/[\r\n]+/g, " ").replace(/\s{2,}/g, " ").trim();
if (!name || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name)) {
  console.error("Usage: node scaffold-skill.mjs --name <kebab-case-name> --desc \"one-line description\" [--scripts t1,t2] [--templates d1,d2] [--example 1]");
  console.error("       node scaffold-skill.mjs --list");
  process.exit(2);
}

const target = join(SKILLS_DIR, name);
if (existsSync(target)) {
  console.error(`❌ Skill "${name}" already exists at ${target} — pick another name or edit the existing folder.`);
  process.exit(1);
}

const scripts = opt("scripts", "").split(",").filter(Boolean);
const templates = opt("templates", "").split(",").filter(Boolean);
const withExample = opt("example", "0") === "1";

mkdirSync(join(target, "scripts"), { recursive: true });
mkdirSync(join(target, "templates"), { recursive: true });
if (withExample) mkdirSync(join(target, "examples"), { recursive: true });

// --- SKILL.md skeleton -------------------------------------------------------
const skillMd = `---
name: ${name}
description: ${desc}
---

# skill: ${name}

**Name:** ${name}
**Description:** ${desc}

---

## The quality bar (non-negotiable — read before anything else)

| Rail | Rule |
|---|---|
| **{{RAIL 1}}** | {{rule}} |
| **{{RAIL 2}}** | {{rule}} |
| **{{RAIL 3}}** | {{rule}} |

---

## When to use

- {{trigger phrase 1}}
- {{trigger phrase 2}}

---

## Workflow (5 stages)

### Stage 1 — {{stage name}}
{{what happens — analyze the request, ask ≤3 questions if vague}}

### Stage 2 — {{stage name}}
{{the plan / the map before any generation}}

### Stage 3 — {{stage name}}
{{build the deliverable}}

### Stage 4 — {{stage name}}
{{assemble / write the supporting files}}

### Stage 5 — Validate + audit
{{automated check(s)}} → auditor subagent sign-off → deliver.

---

## Production checklist

- [ ] {{check}}
- [ ] {{check}}
- [ ] Auditor subagent signed off
`;
writeFileSync(join(target, "SKILL.md"), skillMd, "utf8");

// --- scripts with the shared banner + arg parser -----------------------------
const scriptTemplate = `#!/usr/bin/env node
// ${name} — {{one-line purpose}}.
//
// Usage:
//   node ${basename(join(target, "scripts", "<name>.mjs"))} {{args}}
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

// ─── brand banner (deepak-skill · crafted by Deepak) ────────────────────────
const BRAND_LINE = "═".repeat(56);
const banner = (label) =>
  \`\\n\${BRAND_LINE}\\n  🎬 deepak-skill — crafted by Deepak\\n  skill: ${name} · \${label}\\n\${BRAND_LINE}\\n\`;
console.log(banner("{{tool}}.mjs"));

// --- tiny arg parser (same style as the other skill scripts) ----------------
const args = process.argv.slice(2);
const opt = (o, fallback) => {
  const needle = \`--\${o}\`;
  const found = args.find((a) => a === needle || a.startsWith(\`\${needle}=\`));
  if (found === undefined) return fallback;
  const eq = found.indexOf("=");
  return eq !== -1 ? found.slice(eq + 1) : args[args.indexOf(found) + 1];
};

const input = opt("input", "");
if (!input) {
  console.error("Usage: node {{tool}}.mjs --input <path>");
  process.exit(2);
}

// {{TODO: implement the real logic here}}

console.log("✅ Done.");
process.exit(0);
`;

for (const t of scripts) {
  const content = scriptTemplate
    .replaceAll("{{tool}}", t)
    .replaceAll("{{args}}", `--input <path>`)
    .replaceAll("{{TODO: implement the real logic here}}", `TODO: implement the real logic for ${name}/${t}`);
  writeFileSync(join(target, "scripts", `${t}.mjs`), content, "utf8");
}

// --- templates (copy-paste reference docs) -----------------------------------
for (const t of templates) {
  writeFileSync(
    join(target, "templates", `${t}.md`),
    `# ${t} — reference for ${name}\n\n{{fill with the real formulas / prompts / checklists}}\n`,
    "utf8"
  );
}

// --- examples ----------------------------------------------------------------
if (withExample) {
  writeFileSync(
    join(target, "examples", "README.md"),
    `# Examples — ${name}\n\n{{one complete worked example mirroring the skill's deliverable}}\n`,
    "utf8"
  );
}

console.log(`✅ Scaffolded skills/${name}/`);
console.log(`  SKILL.md` + (scripts.length ? ` · scripts/${scripts.join(", ")}.mjs` : "") + (templates.length ? ` · templates/${templates.join(", ")}.md` : "") + (withExample ? ` · examples/` : ""));
console.log("Next: fill every {{PLACEHOLDER}} (SKILL.md quality bar + workflow, script logic, template docs, example), then wire into README/USAGE/prompt-examples.");

// --- helpers -----------------------------------------------------------------
function readFileSafe(p) {
  try {
    return readFileSync(p, "utf8");
  } catch (e) {
    console.error(`⚠ readFileSafe failed for ${p}: ${e.message}`);
    return "";
  }
}
