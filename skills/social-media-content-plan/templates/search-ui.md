# Search UI — proper calendar search (not AI slop)

> **When to include:** every pack ships a searchable calendar. The markdown `calendar.md` stays the source of truth (git diff friendly); `calendar.html` is the queryable view. No search = audit WARN.

## Tier (one locked choice)

| Tier | Stack | When |
|---|---|---|
| **A — client Fuse.js** | fuse.js CDN + URL-synced chips | 30-90 days, zero infra (default) |
| **B — local index** | prebuilt JSON + lunr | offline / >90 days |

Blueprint locks one in `strategy.md` search section. Default A.

## UX contract (Linear / Algolia patterns)

- Entry: visible search bar on `calendar.html` + `/` to focus, `Esc` clear
- Instant: debounce 150-200ms, stream as you type (not on Enter). Loading = skeleton row
- Ranked: hook > pillar > platform > CTA
- Faceted chips: platform | pillar | format | metric | day range — URL-synced (`?q=&platform=&pillar=`) shareable + back-button
- Keyboard: up/down, Enter to anchor to Day N, Esc to clear, `/` to focus. `role=listbox` + `aria-*`
- Empty states: (1) no query -> recent 5 + suggestions, (2) no results -> "No posts for ''x'' — try pillar Y", (3) error -> retry
- Recent: localStorage max 5
- Highlight: `<mark>` on matched term
- No AI slop: client filter only; optional AI re-rank behind flag never sole ranking
- No `items.filter(includes)` on server — client Fuse threshold 0.3 typo-tolerant

## Data rails

- Source is `plan.json` + `calendar.md` rows (never separate data)
- Pagination: show all 30 days, filter hides non-matches (not fetch)
- Build step generates `calendar.html` deterministically from `plan.json` (same input -> same HTML)

## Audit gate (NEW flag)

`audit-content-plan.mjs --search` checks:
- `calendar.html` present
- search input + Fuse/lunr script present
- URL param sync
- `aria` on combobox
- empty states exist
- no hardcoded secrets in search code

Checklist feeds auditor scorecard /60.
