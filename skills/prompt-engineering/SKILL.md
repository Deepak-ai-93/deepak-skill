---
name: prompt-engineering
description: Build a structured, versioned prompt library in the creator's voice — recurring use cases (content, research, code, email) each written with the role → context → task → format → constraints framework, through the taste profile so outputs sound like the author, with a test/iterate loop that records a verdict per prompt. Audit harness: audit-prompts.mjs (framework sections on every prompt, no placeholder gaps, ≥ 3 prompts, voice rules carry the taste banned-words, test results per prompt → prompts-audit.md) + a fresh prompt-auditor subagent scoring /50 and signing PASS / FIX NEEDED.
---

<!-- ════════════════════════════════════════════════════════════════════════
     🎬 deepak-skill — crafted by Deepak · skill: prompt-engineering
     https://github.com/Deepak-ai-93/deepak-skill · MIT license
     ════════════════════════════════════════════════════════════════════════ -->

```
   ██████╗ ███████╗███████╗██████╗  █████╗ ██╗  ██╗
   ██╔══██╗██╔════╝██╔════╝██╔══██╗██╔══██╗██║ ██╔╝
   ██║  ██║█████╗  █████╗  ██████╔╝███████║█████╔╝
   ██║  ██║██╔══╝  ██╔══╝  ██╔══██╗██╔══██║██╔═██╗
   ██████╔╝███████╗███████╗██║  ██║██║  ██║██║  ██╗
   ╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝
```

**🎬 deepak-skill — crafted by Deepak** · skill: `prompt-engineering` · [deepak-skill on GitHub](https://github.com/Deepak-ai-93/deepak-skill) · MIT

# skill: prompt-engineering

**Name:** Prompt Engineering — a prompt library that sounds like the author
**Description:** Turns a creator's recurring AI use cases into a **structured, versioned prompt library** — every prompt written with the **role → context → task → format → constraints** framework and injected with the creator's **voice rules** (taste profile), so outputs sound like them, not like generic AI. A **test/iterate loop** records a verdict per prompt (what passed, what needed rewriting) so the library only keeps what works. Deliverables: `prompt-library.md` + `test-results.md`. Audit harness: `audit-prompts.mjs` + a fresh prompt-auditor subagent (/50, ≥ 35 = worth keeping) before delivery.

---

## The quality bar (non-negotiable — read before anything else)

| Rail | Rule |
|---|---|
| **The framework (the #1 rail)** | Every prompt carries all five parts: **Role** (who the AI is) → **Context** (what it needs to know) → **Task** (what to produce) → **Format** (exact output shape) → **Constraints** (caps, banned words, voice rules). A prompt missing a part fails the audit. |
| **No placeholder gaps** | Every prompt is copy-paste ready: no `{{…}}`, `[insert …]`, TODO or "your X here" tokens. If a slot is genuinely per-use, the constraint names it explicitly ("keep the {topic} slot"). |
| **Written in the author's voice** | A `## Voice rules` section (from the taste profile: tone, rhythm, **banned words**) sits at the top of the library, and the constraints of every prompt reference it. The audit verifies the taste banned-words are carried into the voice rules. |
| **Versioned + tested** | `test-results.md` has a verdict per prompt (pass / needs-work + one line on what broke). Untested prompts fail the audit — a prompt that has never run is a guess. |
| **Specific beats generic** | Every task names inputs, examples and output examples. "Write a hook" is not a prompt; "Write 5 hooks, each ≤ 100 chars, from these 3 angles, using the voice rules" is. |
| **Audited before delivery (the harness)** | Final stage is a harness, never a self-check: `audit-prompts.mjs` runs the automated checks → a FRESH prompt-auditor subagent scores the library (/50, ≥ 35 = worth keeping) → fix loop until signed **PASS** in `prompts-audit.md`. |

---

## Memory + taste rails (the author's voice — read before anything else)

Same contract as `ebook-builder` and `positioning-studio`: the library is built for the same creator every time, and the voice rules come from THEIR taste.

**The memory file** — `prompt-memory.md` at the working folder root (format: `templates/memory-profile.md`): author identity, taste profile (tone, rhythm, pet phrases, **banned words**), a past-builds table (which libraries were built, what the author kept/dropped), and standing facts. Created at **Stage 0** (≤ 3 questions + optional writing sample), read every run, updated at the end.

**The taste profile** — inside the memory file. It becomes the `## Voice rules` section of the library: the tone every prompt's constraints enforce ("never use 'hack'; outputs in my short-sentence voice"). The audit checks the banned words actually made it into the voice rules.

---

## When to use

- "Build me a prompt library for my content workflow"
- "Write me a prompt that makes AI sound like me"
- "My AI outputs all sound the same — fix that"
- "Give me reusable prompts for research / email / code / carousels"
- "I have prompts that sort of work — organize and test them"
- "Make a prompt bank for my niche so I stop writing prompts from scratch"

**Complements:** `positioning-studio` (the positioning is injected into every content prompt's context), `blog-seo-content` / `x-threads-engagement` / `newsletter-growth` / `email-marketing` / `carousel-post-images` (the library's prompts feed these producer skills), `ai-automation` (library prompts become the per-step prompts in an agent workflow), `ebook-builder` (voice rules reuse the same taste profile).

---

## Workflow (Stage 0 → Stage 6)

### Stage 0 — Load the author's memory + taste (always first)
Read `prompt-memory.md` (format: `templates/memory-profile.md`). First run? Capture identity + taste in ≤ 3 questions (tone, one writing sample, banned words) and write the file. The taste profile becomes the `## Voice rules` section — every prompt in the library must reference it.

### Stage 1 — Analyze the use cases (ask ≤ 3 questions if vague)
Extract: **which use cases** (pick 3–6 the author actually does weekly: content hooks, email, research, code, repurposing…) · **which AI tools** per use case (Claude, ChatGPT, Gemini, the repo's producer skills…) · **what's already working** (any prompts they use today). The library is built around the author's real week, not a generic template.

### Stage 2 — Plan the library (the map before any writing)
For each use case record: `use case / goal / input (what the author pastes in) / output (what comes back) / tool / test input`. The test input matters: every prompt gets run against it in Stage 4, so plan it now.

### Stage 3 — Write the library → `prompt-library.md`
Write `## Voice rules` first (from the taste profile — tone, rhythm, banned words). Then one section per prompt using the framework from `templates/prompt-framework.md`: **Role → Context → Task → Format → Constraints** (caps, format, and "follow the Voice rules" / "never use: [banned words]"). Write the prompt text in the author's voice — the role line especially ("You are a copywriter who writes like [author]: short sentences, no buzzwords"). A prompt that could be used by anyone for anything gets rewritten.

### Stage 4 — Test loop → `test-results.md`
Run every prompt on its planned test input (one real sample). Record: `prompt / tool / input / output quality (1–5) / verdict (pass | needs-work) / what broke / fix`. Rewrite prompts that fail and re-run. Only prompts with a verdict ship. This is the loop that separates a prompt library from a pile of guesses.

### Stage 5 — Approval gate
Show the user: voice rules + the prompt map + test results. They say **approve / edit / reject**. Edits go back to the affected stage.

### Stage 6 — Audit harness (automated checks + prompt-auditor subagent, before delivery)
**Step 6a — run the automated audit:**
```bash
node scripts/audit-prompts.mjs --pack <library-folder> --out prompts-audit.md
```
`audit-prompts.mjs` checks: `prompt-library.md` exists; ≥ 3 prompts; every prompt has Role / Context / Task / Format / Constraints; no placeholder gaps ({{…}}, [insert…], TODO); `## Voice rules` present with tone + **banned words** carried from the taste profile; `test-results.md` has a verdict per prompt (counts match); memory present (WARN if missing). Writes `prompts-audit.md`. **Exit 1 on any FAIL.**

**Step 6b — spawn the prompt-auditor subagent** — a FRESH subagent (never self-audit) with the brief from `templates/prompt-auditor-brief.md`: reads `prompts-audit.md` + all pack files + the taste profile, completes the **prompt-library-worthiness scorecard** (10 criteria, /50 — **≥ 35 = worth keeping**), makes the judgment calls a script can't (would these prompts actually produce author-voiced output? are the constraints tight enough? are the tests honest?), and signs **PASS / FIX NEEDED**.

**Step 6c — fix loop.** Any FAIL (or an auditor-flagged WARN) → fix → re-run → re-submit to a fresh auditor. **Nothing ships until the auditor signs PASS.** `prompts-audit.md` ships with the pack.

### Stage 7 — Write memory back
Append this build to `prompt-memory.md`: date, use cases covered, what the author kept/dropped from the test loop, verdict (/50). Never delete standing facts.

---

## Production checklist

- [ ] Stage 0: `prompt-memory.md` read (created on first run) — taste known before writing
- [ ] Library planned around the author's real weekly use cases (3–6), not a generic template
- [ ] `## Voice rules` written from the taste profile (tone, rhythm, banned words) and referenced by every prompt
- [ ] Every prompt: Role → Context → Task → Format → Constraints — no missing part
- [ ] No placeholder gaps: copy-paste ready, every slot named
- [ ] Specific beats generic: inputs, angles, examples and caps named in the task
- [ ] Test loop: every prompt run on a real input; verdict recorded in `test-results.md`; failed prompts rewritten
- [ ] Approval gate: user approved voice rules + prompt map + test results before delivery
- [ ] **Audit harness run:** `audit-prompts.mjs` → automated checks — exit 0
- [ ] **Prompt-auditor subagent** (fresh eyes) completed the scorecard (/50 ≥ 35) and signed **PASS / FIX NEEDED** in `prompts-audit.md`
- [ ] Delivery: `prompt-library.md` + `test-results.md` + `prompts-audit.md` + `prompt-memory.md` (updated)
