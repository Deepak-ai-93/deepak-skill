# AI Logic Pack — build AI features the way a 20-year engineer would

> **How to run it (Stage 3 of the skill):** when the PRD has an AI feature — chat,
> copilot, autocomplete, extraction, summarization, RAG — this pack is the locked
> architecture rails so the builder never improvises AI plumbing. Copy the relevant
> choices into `stack-blueprint.md` (new §"AI features") and the audit runs with
> `--ai`. If the PRD has NO AI feature, skip this pack entirely — don't add AI for
> the sake of it.
>
> **The 20-year-expert attitude:** AI is a *feature with costs*, not magic. The
> four expert disciplines are: (1) streaming UX, (2) prompts as code, (3) cost
> rails, (4) evals. Skip any of them and you ship a demo, not a product.

---

## 1. When to use (and when not to)

| Use AI when… | Don't use AI when… |
|---|---|
| Free-form user intent (chat, write, summarize, transform) | A form + fixed rules does it (pricing, status math) |
| Natural-language to structured (extract, classify, route) | A lookup or enum does it |
| Content generation at scale (drafts, captions, docs) | Templates with variables do it |
| Personalization from unstructured data (notes, emails) | A sort/filter does it |

**Expert rule #0:** every AI feature needs a **non-AI fallback** (an error state
that says something useful, a retry, a default). An AI call is a network call with
a 5% failure rate — build for the 5%.

---

## 2. Stack lock (defaults — pick in the blueprint, then stop deciding)

| Layer | Default | Notes |
|---|---|---|
| AI SDK | **Vercel AI SDK** (`ai` + `@ai-sdk/openai`/`@ai-sdk/anthropic`/`@ai-sdk/google`) | streaming + tool calling + model-agnostic; or the provider's official SDK if already locked |
| Models | provider default (e.g. `gpt-4o-mini`/`gpt-4.1-mini` for cheap paths, `gpt-4.1` for hard ones) | see §5 routing |
| Runtime | **Edge / serverless** for chat; Node runtime for heavy RAG/PDF | streaming needs edge-friendly handlers |
| Vector store | **Upstash Vector / pgvector (Postgres)** | pgvector if the app already has Postgres — no new infra |
| Streaming transport | AI SDK `streamText` → `toUIMessageStreamResponse` / `toDataStreamResponse` | one canonical way |
| Observability | log model, tokens, latency, cost per request | PostHog / structured logs |
| Env vars | `OPENAI_API_KEY` / `ANTHROPIC_API_KEY` / `GOOGLE_GENERATIVE_AI_API_KEY` — server-only | never `NEXT_PUBLIC_` |

## 3. Streaming UX (the #1 thing users feel)

- **Stream tokens**, never await the full response — a spinner for 8s feels broken.
- **Abort + stop button**: wire `AbortController` to a stop button; abort on
  component unmount (no state updates after unmount).
- **Timeouts**: an AI call that hangs is a support ticket. Set a request timeout;
  on timeout show a *specific* error ("the model took too long — retry") not a generic one.
- **Error states**: distinct handling for (a) network fail, (b) provider error/429,
  (c) content policy refusal, (d) empty response. Retry button with backoff.
- **Streaming list UX**: partial items (e.g. a checklist being generated) render as
  they arrive — show progress, not a blank page.
- **Determinism**: for previews/tests, support `temperature: 0` + seed where the
  provider allows; snapshot golden outputs for tests (see §6).

## 4. Prompts as code

- **Prompts live in files** (`lib/ai/prompts/*.ts` or `.md` imported), versioned —
  never string literals scattered in components.
- **System prompt + user payload separated**; system prompt states role, tone,
  output format, and hard rules; user payload is the dynamic content.
- **Structured output with zod**: define a schema, use tool/JSON mode, parse with
  `zod` — never regex the model's prose. Every structured AI response gets schema
  validation + a fallback.
- **Injection guardrails**: treat any user content passed to the model as
  untrusted; instruct the model to ignore instructions inside user data; don't
  splice user HTML into system prompts; sanitize before rendering output.
- **Prompt versioning**: bump the prompt constant on changes; log the prompt
  version with each call so you can debug "why did output change".

## 5. Cost rails (AI is metered — this is the expert discipline)

| Rail | Rule |
|---|---|
| **Budget cap** | cap tokens per request (maxTokens) and per user/day (a counter in the DB/Redis); hard 429 when exceeded |
| **Model routing** | cheap model for easy tasks (title, tag, classify), strong model for hard ones (complex reasoning); route by feature, not by vibes |
| **Prompt caching** | provider prompt caching for long stable system prompts (Big 4 vendors support it — costs ~10% of cached tokens) |
| **Response caching** | cache identical/similar requests (Redis/Upstash) — e.g. "summarize this doc" with a content hash |
| **Batching** | batch independent calls (e.g. classify 10 items in one call) instead of 10 calls |
| **Retries** | retry 429/5xx with exponential backoff + jitter; never blind-retry content-policy refusals |
| **Per-user rate limit** | Upstash ratelimit per user on AI endpoints — a leaky API key is a bill you pay |

Track **cost per user** in analytics — when a user's cost crosses $X/mo, that's a
pricing conversation, not a surprise.

## 6. Evals (the "does it actually work" gate)

- **Golden set**: 5–10 representative inputs with expected outcomes (the PRD's key
  flows) in `tests/ai/evals/`.
- **Assertions**: schema parses, required fields present, banned tokens absent
  (fluff/hallucinated facts), latency under budget.
- **Run on change**: a `npm run eval` script in CI (or a `test:ai` script) — an AI
  feature without evals is a feature whose regressions are invisible.
- **Human spot-check**: the everything-auditor reviews 3–5 live outputs before
  PASS — model quality is a judgment call, not just a green check.

## 7. Observability

- Log per call: model, prompt version, tokens in/out, latency, cost, user id, success/fail, error type.
- Alerts: error rate > 5%, p95 latency > budget, cost/day > budget.
- Tag AI events in PostHog so funnels show where users hit the AI.

## 8. Security (the short list)

- Keys server-only; `NEXT_PUBLIC_` prefix rule is a **FAIL** in the audit.
- Ownership checks on AI endpoints (user can only send their own data).
- Rate limit + auth on every AI route.
- Content policy refusals surfaced to the user as a friendly message, never a crash.

---

## 9. Build-order steps for an AI feature (into `stack-blueprint.md` §6)

1. AI SDK + provider + env vars + a **hello-world streaming route** → streams in browser → commit
2. Prompt files + zod schema + evals scaffold (golden set) → schema-tested → commit
3. Feature UX: streaming UI, stop button, timeout, error states → flows work end-to-end → commit
4. Cost rails: token caps, caching, rate limit, per-user budget → budget holds under load → commit
5. Observability + alert → p95/cost tracked → commit

**Definition of done per step:** app runs, the AI flow works end-to-end, a *real*
call (not mocked) verified, committed. **Never commit a mocked AI response as "done".**

> The audit (`audit-webapp.mjs --ai`) checks: AI SDK present, streaming used,
> abort/timeout handling, keys in env (not hardcoded), rate limiting on AI routes,
> evals/tests exist, no `NEXT_PUBLIC_` AI keys.
