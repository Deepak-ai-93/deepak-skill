# Blog-Auditor Subagent Brief — paste this to a fresh subagent

> **Rule: never audit your own work.** After `audit-blog.mjs` runs clean, spawn a FRESH subagent (new context, second pair of eyes) with this exact brief. Nothing is delivered until the auditor signs off **PASS**.

---

```
You are the blog-auditor for the blog-seo-content pack at {blog-folder}/.

1. Read blog-audit.md (the automated harness results) and every pack file:
   seo-brief.md · article.md · meta.md.

2. Complete Section 2 of blog-audit.md:
   - 2.1 Blog-worthiness scorecard (rate 1–5 each, /50 — an article worth
     publishing scores ≥ 35):
       · One keyword, one intent — does the article serve ONE search intent
         fully?
       · EEAT credibility — named author + credential + link? Firsthand
         experience present or flagged? No overclaiming?
       · Cited proof — is every stat linked to a named source (never bare
         'studies show')?
       · GEO quotability — could an AI search engine lift a 'Bottom line'
         block, table, or list from this article?
       · First-100-word answer — does the direct answer come within the first
         100 words?
       · Heading hierarchy — H1→H2→H3 contiguous, one idea per H2?
       · Copy quality — anti-fluff clear, specific > generic, no filler intro?
       · Meta pack — title ≤ 60 (keyword first), description ≤ 155 with CTA,
         clean slug?
       · Internal links — 3–5 relevant internal links with descriptive anchor
         text?
       · Rank feasibility — does the angle + depth match what's actually
         ranking for the keyword?
   - 2.2 Creative judgment calls:
       · Any claim that overpromises or would embarrass the author if
         challenged
       · Any section that reads thin vs. the SERP depth (word count, coverage)
       · Any place an internal link is obviously missing
   - 2.3 Verdict:
       · All PASS and scorecard ≥ 35 → mark PASS and sign.
       · Any FAIL (or a WARN you judge real) → mark FIX NEEDED and list
         concrete fixes PER FILE.

3. Report your verdict (PASS / FIX NEEDED + scorecard total) and the
   completed blog-audit.md path.
```

---

## Why the scorecard matters (for the main agent)

The blog-worthiness scorecard is the **"is it good to go?" gate** — it answers *"would I publish this under a real author's name?"* before anything ships:

| Total /50 | Verdict |
|---|---|
| ≥ 40 | Strong — publish as-is |
| 35–39 | Good — publish with the small fixes listed |
| 25–34 | Weak — fix EEAT/SEO gaps before publishing |
| < 25 | Not ready — rework the brief + outline + article |

## Fix-loop rule (for the main agent)

Any FAIL or real WARN → fix the file → **re-run `audit-blog.mjs`** (and `keyword-outline.mjs` if the brief changed) → re-submit to a fresh auditor. Loop until PASS. The deliverable folder ships `blog-audit.md` with the signed PASS.
