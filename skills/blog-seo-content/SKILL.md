---
name: blog-seo-content
description: Write SEO-optimized, E-E-A-T-rich blog articles that rank on search AND get cited by AI search (GEO) — keyword research → intent mapping → data-backed outline → full long-form article with meta title/description, heading hierarchy, internal links, and source citations. Includes a keyword/outline script (keyword difficulty + intent analysis + outline scaffold) and reuses the repo's EEAT + anti-fluff copywriting playbook.
---

# skill: blog-seo-content

**Name:** Blog SEO Content — articles that rank and get cited
**Description:** Produces **long-form SEO articles** with the same rigor as the repo's video/email work: research-driven angles, **E-E-A-T signals** (named author, firsthand experience, cited sources, real metrics), on-page SEO (one primary keyword, proper H1→H3 hierarchy, meta description, internal links), and **GEO awareness** (structured so AI search engines can quote it). Ships a `seo-brief.md` (keywords + intent + outline) for approval, then the article + meta pack.

---

## The quality bar (non-negotiable — read before anything else)

| Rail | Rule |
|---|---|
| **One primary keyword, one intent** | Pick ONE search intent (informational / commercial / transactional) and serve it fully. A post that tries to rank for three intents ranks for none. |
| **EEAT in every article** | Named author + credential + link, firsthand experience (what the writer actually did), cited sources for every stat, no overclaiming ("best" needs proof). The author bio and experience section are not optional. |
| **Search + AI-citable structure** | H1 = the primary keyword question · answer it in the first 100 words · H2/H3 per subtopic · tables/lists for quotable facts · a "Bottom line" summary block (AI engines quote these). |
| **Anti-fluff copywriting** | No filler introductions ("In today's fast-paced world"), no weak claims, specific beats generic, one idea per H2, internal links where relevant. Same blocklist as the repo's other skills. |
| **Meta pack delivered** | Meta title (≤ 60 chars, keyword front-loaded), meta description (≤ 155 chars with a CTA), slug, and 3–5 suggested internal/external links. |

---

## When to use

- "Write a blog post about X that ranks"
- "SEO article for our SaaS / agency / niche site"
- "Research keywords and outline an article for us"
- "Make this topic citable by AI search (GEO)"

**Complements:** `email-marketing` (same EEAT + anti-fluff playbook; article → newsletter) · `content-repurposer` (article → social posts) if added later · `vibe-code-webapp` (content site).

---

## Workflow (6 stages)

### Stage 1 — Analyze the brief (ask ≤3 questions if vague)
Extract: **topic or seed keyword** · **audience / buyer stage** · **goal** (rank for a keyword, build topical authority, get cited by AI) · **brand/author** (who's the named author, what's their credential) · **existing content** (URLs to interlink).

### Stage 2 — Keyword + intent research → `seo-brief.md`
```bash
node scripts/keyword-outline.mjs --seed "saas onboarding" --out seo-brief.md
```
The script builds the **keyword cluster** (seed → variants + long-tail + question forms), scores **intent** for each, and generates a **data-backed outline scaffold** (H1 + H2/H3s with the angle and proof-to-include per section). The agent then:
- Enriches with real SERP/GEO research (top-ranking competitors, People-Also-Ask questions, featured-snippet formats).
- Marks the primary keyword + 3–5 secondary ones with natural placement targets.
- **Stops for your approval** of `seo-brief.md` before writing the article (nothing full-length is written before you say go).

### Stage 3 — Write the article (H1 → full long-form)
Write against the brief: answer the question in the first 100 words, then one H2 per subtopic with specific content and proof. Rules:
- **Every stat has a source** — inline link to a named source ("Per Gartner's 2025 report…"), never a bare "studies show".
- **Firsthand experience where possible** — "When we ran this on our own signup flow…" beats generic advice (this is the differentiator).
- **Quotable blocks** — tables, lists, and a "Bottom line" summary that AI engines can lift.
- **Anti-fluff** — cut every sentence that doesn't add information or proof.
- Word count: match the SERP (the script suggests a range from the outline), not "always 2000".

### Stage 4 — Meta pack + internal links
Write `meta.md`: meta title (≤ 60 chars, keyword first) · meta description (≤ 155 chars, includes the payoff + a CTA) · slug · 3–5 internal links (anchor text descriptive) · 2–3 external authority links. Add an image alt-text list if images are planned.

### Stage 5 — Validate + audit (subagent, before delivery)
Spawn a fresh subagent to check:
1. **SEO** — primary keyword in H1 + first 100 words + meta title; heading hierarchy clean (no skipped levels); one intent served.
2. **EEAT** — named author + credential + bio link; every stat cited; experience present or flagged as missing.
3. **GEO/quotability** — a "Bottom line" block, at least one table or list, first-100-word direct answer.
4. **Copy quality** — anti-fluff blocklist clear, no filler intros, specific > generic, internal links actually relevant.
5. **Meta pack** — title ≤ 60, description ≤ 155, slug clean, links correct.
Any FAIL → fix → re-audit.

### Stage 6 — Deliver
`seo-brief.md` (approved) + `article.md` + `meta.md`. Note in delivery: suggested publishing cadence (topical-authority clusters, not one-off posts), and how to wire the article into email (reuse `email-marketing` for a newsletter issue).

---

## Production checklist

- [ ] Brief analyzed: seed keyword, intent, audience, author/credential, goal
- [ ] `seo-brief.md`: keyword cluster + intent scores + outline with proof-to-include per section; enriched with real SERP research
- [ ] **User approved the brief** before the article was written
- [ ] Article: answer in first 100 words · one H2 per subtopic · every stat cited · firsthand experience · quotable blocks
- [ ] Anti-fluff blocklist cleared; no filler intros; specific > generic
- [ ] `meta.md`: title ≤ 60 chars (keyword first), description ≤ 155 chars, slug, internal + external links
- [ ] Auditor subagent signed off: SEO, EEAT, GEO, copy, meta
- [ ] Delivery: `seo-brief.md` + `article.md` + `meta.md` + cadence note
