# Idea Interview — {App Name / Idea}

> **How to run it (Stage 0 of the skill):** ask the user these questions ONE SECTION at a time,
> in chat, and write their verbatim answers into `output/idea/idea-answers.md` as you go.
> The user can answer a section fully, partially, or say **"skip — you decide"** (defaults are listed).
> The interview is DETAILED on purpose — it feeds the research brief, the scorecard and the build pack.
> In an **existing project**, also run `scan-project.mjs` first and ask section 8 instead of re-asking what exists.

## 1. The idea (the kernel)

| # | Question | Why it matters | Default if skipped |
|---|---|---|---|
| 1.1 | What do you want to build, in your own words? (verbatim) | The kernel everything is checked against | — |
| 1.2 | One-liner: what does it do for whom? | The pitch used everywhere (handoff prompts, landing) | drafted by agent, user corrects |
| 1.3 | What is the concrete problem it solves? | Scorecard criterion 1 (problem clarity) | — |
| 1.4 | How do people solve this problem TODAY (workaround)? | Market readiness + pain proof | research (Stage 1) |
| 1.5 | Why now? (what changed / why hasn't it been built well) | Competition + timing | research |
| 1.6 | What does "done" look like for version 1? | MVP scope line | agent proposes, user trims |

## 2. Users & market

| # | Question | Why it matters | Default if skipped |
|---|---|---|---|
| 2.1 | Who exactly uses it? (one persona, not "everyone") | PRD persona + reachability score | research + agent guess, corrected |
| 2.2 | How many such people can you actually reach? (channel: SEO, community, ads, network) | Market size & reachability score | research |
| 2.3 | Who else serves them and what do they get wrong? | Competition score | research (Stage 1) |

## 3. Product scope (what to build)

| # | Question | Why it matters | Default if skipped |
|---|---|---|---|
| 3.1 | Top 3 things it MUST do in v1 (must-haves)? | PRD §4 — the approval contract | agent proposes from the idea |
| 3.2 | What is explicitly OUT of scope for v1? | PRD non-goals — stops scope creep | agent proposes |
| 3.3 | Walk me through the #1 user flow, step by step. | PRD §5 flows + build order | agent drafts, user corrects |
| 3.4 | Any ideas for later (not v1)? | `NEXT.md` backlog (P2 tasks) | — |

## 4. Stack & environment

| # | Question | Why it matters | Default if skipped |
|---|---|---|---|
| 4.1 | Any stack preference? (Next.js / Vite / Express / …) | Stack lock — validated, user's choice wins | "whatever fits" → default pack |
| 4.2 | Where should it run? (web / PWA / internal tool) | Platform field | web app |
| 4.3 | Existing accounts/services you want to use? (Supabase, Stripe, Vercel…) | Blueprint env vars | defaults from pack |
| 4.4 | Will you (or a team) build it, or paste it into Lovable/Bolt/v0? | Stage 4 handoff format | CLI agent + optional web builder |

## 5. Business & monetization

| # | Question | Why it matters | Default if skipped |
|---|---|---|---|
| 5.1 | Monetized? If yes, what model? (one-time / subscription / freemium / ads) | Scorecard + PRD §8 | not monetized (v1) |
| 5.2 | Rough price point you had in mind? | Pricing anchor | competitor research |
| 5.3 | Top 2 competitors users would compare you to? | Scorecard + PRD §2 | research |

## 6. Timeline & constraints

| # | Question | Why it matters | Default if skipped |
|---|---|---|---|
| 6.1 | When does v1 need to ship? | Time-to-MVP score + scope trimming | 2–4 weeks |
| 6.2 | Hard constraints? (budget, legal, must-not-break, single dev, mobile-first) | PRD risks | none |
| 6.3 | What can you NOT compromise on? (quality / speed / features / price) | Trade-off clarity | quality |

## 7. Success metrics (how we know it works)

| # | Question | Why it matters | Default if skipped |
|---|---|---|---|
| 7.1 | What number proves v1 works? (e.g. X activated users / paid invoices / retention) | PRD §9 KPI + kill-guardrail | agent proposes |
| 7.2 | What would make you call it a failure and stop? | Kill guardrail | <X activations after 4 weeks |

## 8. Existing project only (run after `scan-project.mjs` — skip for new projects)

| # | Question | Why it matters | Default if skipped |
|---|---|---|---|
| 8.1 | What do you want to ADD / CHANGE in the existing app? (not "build from scratch") | The PRD becomes an extension plan | scan §9 opportunities |
| 8.2 | What must NOT break or change? (existing users, data, design, stack) | Hard constraints for the extension | from scan gaps/risks |
| 8.3 | New idea, or a next phase of the current product? | Changes the research brief | next phase of current product |
| 8.4 | Are the existing features/bugs on the scan report accurate? Anything missing? | Ground-truth check | assume accurate |

## 9. Design & AI (new projects — helps the design source + AI rails)

| # | Question | Why it matters | Default if skipped |
|---|---|---|---|
| 9.1 | Do you have a **Figma design** (link?), a **Google Stitch** canvas, or should we use the design pack / generate a design? | Locks the design source of truth (`frontend-design.md`) | open-source pack; agent can offer Stitch |
| 9.2 | Does the app have an **AI feature**? (chat, copilot, autocomplete, extraction, summarization…) | Adds the AI rails section (`ai-logic.md`) to the blueprint | no AI — keep the stack simple |
| 9.3 | Any model/provider preference for the AI feature? (OpenAI / Anthropic / Google / local) | Locks the AI stack choice | provider default from `ai-logic.md` §2 |
| 9.4 | Are you willing to talk to 5 potential users or run a landing+waitlist before/during the build? | The validator's validation moves (`saas-validator.md` §6) | yes, if the verdict is ITERATE |

---

> **After the interview:** answers → `output/idea/idea-answers.md`, then Stage 1 (expert research
> per `research-playbook.md`), Stage 2 (SaaS validator → `validation.md`), Stage 3 (design source of
> truth + build pack + `TODO.md` + confirmation gate).
> Remember the invariant: **no code before the user approves the pack AND the todo list.**
