---
name: blog-seo-content
description: Write SEO-optimized, E-E-A-T-rich blog articles that rank on search AND get cited by AI search (GEO) — keyword research → intent mapping → data-backed outline → full long-form article with meta title/description, heading hierarchy, internal links, and source citations. Includes a keyword/outline script (keyword difficulty + intent analysis + outline scaffold) and reuses the repo's EEAT + anti-fluff copywriting playbook.
---

<!-- ════════════════════════════════════════════════════════════════════════
     🎬 deepak-skill — crafted by Deepak · skill: blog-seo-content
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

**🎬 deepak-skill — crafted by Deepak** · skill: `blog-seo-content` · [deepak-skill on GitHub](https://github.com/Deepak-ai-93/deepak-skill) · MIT

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
| **Audited before delivery (the harness)** | Stage 5 is a harness, never a self-check: `audit-blog.mjs` runs the automated checks (brief, headings, EEAT, citations, quotable blocks, anti-fluff, meta) → a FRESH blog-auditor subagent scores blog-worthiness (/50, ≥ 35 = worth publishing) → fix loop until signed **PASS** in `blog-audit.md`. |

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

### Stage 5 — Audit harness (automated checks + blog-auditor subagent, before delivery)
**Step 5a — run the automated audit harness:**
```bash
node scripts/audit-blog.mjs --pack <blog-folder> --out blog-audit.md
```
`audit-blog.mjs` scans the pack and checks everything a script can: seo-brief (keyword cluster + intent + outline), article.md (heading hierarchy without skips, first-100-word answer, named author/credential, cited stats with sources, quotable blocks — Bottom line/tables/lists, anti-fluff blocklist), and meta.md (title ≤ 60 keyword-first, description ≤ 155 with CTA, slug + links). Writes `blog-audit.md` (automated verdicts + scorecard scaffold). **Exit 1 on any FAIL.**

**Step 5b — spawn the blog-auditor subagent** — a FRESH subagent (never self-audit) with the exact brief from `templates/blog-auditor-brief.md`: reads `blog-audit.md` + all pack files, completes the **blog-worthiness scorecard** (10 criteria, /50 — **≥ 35 = worth publishing**, with verdict bands), makes the creative judgment calls the script can't (EEAT credibility, GEO quotability, rank feasibility), and signs **PASS / FIX NEEDED** with per-file fixes.

**Step 5c — fix loop.** Any FAIL (or an auditor-flagged WARN) → fix the file → re-run `audit-blog.mjs` (and `keyword-outline.mjs` if the brief changed) → re-submit to a fresh auditor. **Nothing is delivered until the auditor signs off PASS.** The `blog-audit.md` ships with the pack.

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
- [ ] **Audit harness run:** `audit-blog.mjs` → automated checks (brief, headings, EEAT, citations, quotable blocks, anti-fluff, meta) — exit 0
- [ ] **Blog-auditor subagent** (fresh eyes) completed the blog-worthiness scorecard (/50 ≥ 35) and signed **PASS / FIX NEEDED** in `blog-audit.md`
- [ ] Delivery: `seo-brief.md` + `article.md` + `meta.md` + `blog-audit.md` + cadence note
