#!/usr/bin/env node
// package-deliverable.mjs — the vibe-code-webapp skill's handoff packager.
// Collects every artifact the skill produced (pack files, reports, memory,
// deploy runbook, audit) into output/handoff/: a HANDOFF.md the user can read
// in one minute, a manifest.json for machines, and an optional ZIP so the
// whole pack travels as ONE file to any other tool or machine.
//
// Usage:
//   node scripts/package-deliverable.mjs                      # write HANDOFF.md + manifest.json
//   node scripts/package-deliverable.mjs --zip                # + <app>-handoff.zip
//   node scripts/package-deliverable.mjs --dir . --app myapp  # explicit project dir + app name
//   node scripts/package-deliverable.mjs --out output/handoff # where the handoff goes
//
// Exit codes: 0 = packaged · 2 = usage error. App source is NOT zipped —
// the app lives in git; this packages the plan/report/handoff layer.
import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync, readdirSync } from "node:fs";
import { resolve, join, relative, basename } from "node:path";

// ─── brand banner (deepak-skill · crafted by Deepak) ────────────────────────
const BRAND_LINE = "═".repeat(56);
const banner = (label) =>
  `\n${BRAND_LINE}\n  🎬 deepak-skill — crafted by Deepak\n  skill: vibe-code-webapp · ${label}\n${BRAND_LINE}\n`;
console.log(banner("package-deliverable.mjs"));

const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const needle = `--${name}`;
  const found = args.find((a) => a === needle || a.startsWith(`${needle}=`));
  if (found === undefined) return fallback;
  const eq = found.indexOf("=");
  return eq !== -1 ? found.slice(eq + 1) : args[args.indexOf(found) + 1];
};
const hasFlag = (name) => args.includes(`--${name}`);

const ROOT = resolve(process.cwd(), opt("dir", "."));
const appName = opt("app", "") || basename(ROOT);
const OUT = resolve(ROOT, opt("out", "output/handoff"));
const today = new Date().toISOString().slice(0, 10);

// ─── the artifact set (root files + the output/ tree) ───────────────────────
const ROOT_FILES = [
  "PRD.md", "stack-blueprint.md", "sitemap.md", "TODO.md", "BUILD.md",
  "build-report.md", "MEMORY.md", "validation.md", "idea-brief.md",
  "idea-answers.md", "project-scan.md", "deploy-runbook.md", "README.md",
  ".env.example", "NEXT.md", "creator-portfolio.md",
];
const EXCLUDE_DIRS = ["node_modules", ".git", ".next", "dist", "build", ".vercel", ".netlify"];

function collect() {
  const found = [];
  for (const f of ROOT_FILES) {
    const p = join(ROOT, f);
    if (existsSync(p)) found.push({ rel: f, size: statSync(p).size, kind: "root" });
  }
  const outDir = join(ROOT, "output");
  if (existsSync(outDir)) {
    const walk = (d, prefix) => {
      for (const entry of readdirSync(d, { withFileTypes: true })) {
        if (EXCLUDE_DIRS.includes(entry.name)) continue;
        const full = join(d, entry.name);
        if (entry.isDirectory()) walk(full, `${prefix}${entry.name}/`);
        else {
          const rel = `output/${prefix}${entry.name}`;
          found.push({ rel, size: statSync(full).size, kind: "output" });
        }
      }
    };
    walk(outDir, "");
  }
  return found;
}

const artifacts = collect();
if (!artifacts.length) {
  console.error(`❌ No deliverable artifacts found in ${ROOT} — run the skill stages first (or pass --dir).`);
  process.exit(1);
}

// ─── state pulled from live files ───────────────────────────────────────────
function readMaybe(rel) {
  const p = join(ROOT, rel);
  return existsSync(p) ? readFileSync(p, "utf8") : "";
}

const todoHead = readMaybe("TODO.md");
const confirmed = /Confirmed:\*\*\s*(YES|NO)/i.test(todoHead)
  ? todoHead.match(/Confirmed:\*\*\s*(YES|NO)/i)[1].toUpperCase() === "YES" ? "YES" : "NO"
  : "n/a";
const doneCount = (todoHead.match(/^\- \[x\]/gm) || []).length;
const totalTasks = (todoHead.match(/^\- \[[ x~!]\] \(P[012]\)/gm) || []).length;
const memory = readMaybe("MEMORY.md");
const memoryDates = [...memory.matchAll(/^## (\d{4}-\d{2}-\d{2})/gm)].map((m) => m[1]);
const lastDay = memoryDates.length ? memoryDates[memoryDates.length - 1] : "—";
const progress = readMaybe(join("output", "progress.md"));
const progressLines = (progress.match(/^\| \*\*/gm) || []).length;
const audit = readMaybe(join("output", "audit", "audit-report.md"));
const auditVerdict = /VERDICT.*?(PASS|FAIL)/i.test(audit)
  ? audit.match(/VERDICT.*?(PASS|FAIL)/i)[1] : (audit.includes("PASS") && !audit.includes("FAIL")) ? "PASS" : "n/a";

// ─── manifest ───────────────────────────────────────────────────────────────
const manifest = {
  app: appName,
  packaged: new Date().toISOString(),
  confirmed_todo: confirmed,
  tasks: { total: totalTasks, done: doneCount },
  last_memory_day: lastDay,
  audit_verdict: auditVerdict,
  artifacts: artifacts.map((a) => ({ file: a.rel, bytes: a.size })),
  next_step: "Read HANDOFF.md → open the app → deploy per deploy-runbook.md",
};

// ─── HANDOFF.md ─────────────────────────────────────────────────────────────
const handoff = `# Handoff — ${appName}

> Packaged by \`package-deliverable.mjs\` · ${today}. Everything the vibe-code-webapp skill produced, in one folder.

## State at a glance

| | |
|---|---|
| **TODO confirmed?** | ${confirmed} (${doneCount}/${totalTasks} tasks done) |
| **Audit verdict** | ${auditVerdict} (see \`output/audit/audit-report.md\`) |
| **Memory** | \`MEMORY.md\` — last entry: ${lastDay} |
| **Deploy** | \`deploy-runbook.md\` + generated config + CI (\`.github/workflows/deploy.yml\`) |

## The contract files (read these first)

| File | What it is |
|---|---|
| \`PRD.md\` | what was approved to build |
| \`stack-blueprint.md\` | exactly HOW — stack lock, design source of truth, data model, build order |
| \`sitemap.md\` | every route, page, endpoint, workflow — the map of the app |
| \`TODO.md\` | the user-owned task list (manage with \`todo.mjs\`) |
| \`validation.md\` | scorecard + verdict + kill guardrail |
| \`idea-brief.md\` | demand research behind the decision |
| \`build-report.md\` | per-session evidence-backed build log |
| \`MEMORY.md\` | daily shared brain — pick up exactly where it stopped |
| \`deploy-runbook.md\` | the ONE host, env var mapping, verification list, rollback |
| \`output/audit/audit-report.md\` | production-readiness audit (script + auditor verdicts) |
| \`output/progress.md\` | stage-by-stage tracker (0 Onboard → 7 Deliver) |

## What was NOT packaged

- The app source — it lives in git. \`node_modules\`, \`.git\`, \`.next\`/build output are excluded.
- Secret values — env vars are names-only in \`deploy-runbook.md\`; values belong in the host dashboard.

## Next steps (in order)

1. **Read \`MEMORY.md\`** — last session's \`Next:\` line is where to start.
2. Open \`TODO.md\` — work the highest-priority open task (\`todo.mjs list\`).
3. Build/run the app and verify against \`sitemap.md\` (every route exists, nothing more).
4. Deploy per \`deploy-runbook.md\` (one host, env vars in the host, §5 verification list).
5. Hand the app to anyone with: this folder + the git repo.
`;

const totalBytes = artifacts.reduce((a, x) => a + x.size, 0);

// ─── write + optional zip ───────────────────────────────────────────────────
mkdirSync(OUT, { recursive: true });
writeFileSync(join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n", "utf8");
writeFileSync(join(OUT, "HANDOFF.md"), handoff, "utf8");
console.log(`  ✅ output/handoff/manifest.json (${artifacts.length} artifacts, ${(totalBytes / 1024).toFixed(0)} KB)`);
console.log(`  ✅ output/handoff/HANDOFF.md`);

if (hasFlag("zip")) {
  // Minimal zero-dep zip writer (store, no compression) — keeps the pack in ONE file.
  const crcTable = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    crcTable[n] = c >>> 0;
  }
  const crc32 = (buf) => {
    let c = 0xffffffff;
    for (const b of buf) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8);
    return (c ^ 0xffffffff) >>> 0;
  };
  // Local file header (30 bytes) + name + data.
  const localHeader = (name, data, crc) => {
    const h = Buffer.alloc(30);
    h.writeUInt32LE(0x04034b50, 0);   // signature
    h.writeUInt16LE(20, 4);           // version needed
    h.writeUInt16LE(0x0800, 6);       // UTF-8 name flag
    h.writeUInt16LE(0, 8);            // method: stored
    h.writeUInt16LE(0, 10);           // mod time
    h.writeUInt16LE(0, 12);           // mod date
    h.writeUInt32LE(crc, 14);         // crc-32
    h.writeUInt32LE(data.length, 18); // compressed size
    h.writeUInt32LE(data.length, 22); // uncompressed size
    h.writeUInt16LE(name.length, 26); // name length
    h.writeUInt16LE(0, 28);           // extra length
    return h;
  };
  // Central directory entry (46 bytes) + name.
  const centralEntry = (name, data, crc, offset) => {
    const c = Buffer.alloc(46);
    c.writeUInt32LE(0x02014b50, 0);   // signature
    c.writeUInt16LE(20, 4);           // version made by
    c.writeUInt16LE(20, 6);           // version needed
    c.writeUInt16LE(0x0800, 8);       // UTF-8 name flag
    c.writeUInt16LE(0, 10);           // method: stored
    c.writeUInt16LE(0, 12);           // mod time
    c.writeUInt16LE(0, 14);           // mod date
    c.writeUInt32LE(crc, 16);         // crc-32
    c.writeUInt32LE(data.length, 20); // compressed size
    c.writeUInt32LE(data.length, 24); // uncompressed size
    c.writeUInt16LE(name.length, 28); // name length
    c.writeUInt16LE(0, 30);           // extra length
    c.writeUInt16LE(0, 32);           // comment length
    c.writeUInt16LE(0, 34);           // disk number
    c.writeUInt16LE(0, 36);           // internal attrs
    c.writeUInt32LE(0, 38);           // external attrs
    c.writeUInt32LE(offset, 42);      // local header offset
    return c;
  };
  const chunks = [];
  const central = [];
  let offset = 0;
  for (const a of artifacts) {
    const name = a.rel.replace(/\\/g, "/");
    const data = readFileSync(join(ROOT, a.rel));
    const crc = crc32(data);
    const nameBuf = Buffer.from(name, "utf8");
    chunks.push(localHeader(nameBuf, data, crc), nameBuf, data);
    central.push(centralEntry(nameBuf, data, crc, offset), nameBuf);
    offset += 30 + nameBuf.length + data.length;
  }
  const centralSize = central.reduce((a, b) => a + b.length, 0);
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);      // signature
  eocd.writeUInt16LE(0, 4);               // disk number
  eocd.writeUInt16LE(0, 6);               // central dir disk
  eocd.writeUInt16LE(artifacts.length, 8);
  eocd.writeUInt16LE(artifacts.length, 10);
  eocd.writeUInt32LE(centralSize, 12);
  eocd.writeUInt32LE(offset, 16);
  eocd.writeUInt16LE(0, 20);
  const zipPath = join(OUT, `${appName}-handoff.zip`);
  writeFileSync(zipPath, Buffer.concat([...chunks, ...central, eocd]));
  console.log(`  ✅ ${relative(ROOT, zipPath)} (${(statSync(zipPath).size / 1024).toFixed(0)} KB)`);
}

console.log(`\n${BRAND_LINE}`);
console.log(`  ✅ package-deliverable — handoff ready in ${relative(ROOT, OUT)}`);
console.log(`  next: read HANDOFF.md, open the app, deploy per deploy-runbook.md.`);
console.log(BRAND_LINE);
process.exit(0);