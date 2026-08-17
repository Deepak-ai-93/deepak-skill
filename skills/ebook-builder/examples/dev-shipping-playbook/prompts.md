# Ebook Image-Model Prompts
Deck: The Shipping Playbook — developer lead-magnet ebook
Auto-exported from ebook.html by 'render-ebook.mjs --mode model'. Fill the SCENE details,
then dispatch one block per page to your CLI's image tool (Nano Banana / Midjourney / Flux)
at **4K 4320x6112** (A4 ratio). Cover first (from the cover brief), then interior scenes.
Verify every word on generated images afterwards.

## Consistency tokens (repeat VERBATIM on every page — from the design picker)
- ONE layout + ONE palette + ONE accent hex + ONE motif family + ONE cover style for the whole ebook (same world)
- Grade: {layout's grade — e.g. warm paper editorial / bold color blocks / dark luxury / bright sticker pop / terminal glow / botanical calm}
- Text layer: {layout's type pairing}, exact overlay copy — no typos, no extra words
- No clichés: no gold bars, no hand-on-chin thinking, no floating 3D shapes as the main visual

### 1. cover
```
Ebook 1/7 — design tokens: technical-dark · terminal-green · step-cards · pattern. Canvas: 4K 4320x6112, PNG, no watermark, no logo.
SCENE (photoreal, real life): a developer's dual monitors at 2am, terminal full of green checkmarks, one merge button highlighted
CINEMATIC GRADE: {camera & lens, lighting source + color, depth of field, film grain, color mood}.
TEXT (render EXACTLY):
  Cover title: "The Shipping Playbook"
  Placement: legible over the scene — contrast guaranteed (scrim/panel behind text).
CONSISTENCY: layout technical-dark, same palette, same accent hex, same grade.
```

### 2. step-01
```
Ebook 2/7 — design tokens: technical-dark · terminal-green · step-cards. Canvas: 4K 4320x6112, PNG, no watermark, no logo.
SCENE (photoreal, real life): a git log screen, each commit one green dot, a reviewer clicking "approve" in seconds
CINEMATIC GRADE: {camera & lens, lighting source + color, depth of field, film grain, color mood}.
TEXT (render EXACTLY):
  Headline: "Ship the smallest thing that works."
  Body: "Big PRs rot. A 4,000-line diff sits for weeks, then dies in review. The 40-minute deploy started with one rule: every merge ships something usable."
  Callout: "avg PR size: 4,000 → 350 lines"
  Placement: legible over the scene — contrast guaranteed (scrim/panel behind text).
CONSISTENCY: layout technical-dark, same palette, same accent hex, same grade.
```

### 3. step-02
```
Ebook 3/7 — design tokens: technical-dark · terminal-green · step-cards. Canvas: 4K 4320x6112, PNG, no watermark, no logo.
SCENE (photoreal, real life): a CI pipeline dashboard, every check a green square, a red one auto-blocking a merge with a comment
CINEMATIC GRADE: {camera & lens, lighting source + color, depth of field, film grain, color mood}.
TEXT (render EXACTLY):
  Headline: "Automate the boring gate."
  Body: "Lint, tests, and type checks ran on a dev's machine — where everyone "forgot." Now they run in CI before review ever starts. Humans review logic; machines review style."
  Placement: legible over the scene — contrast guaranteed (scrim/panel behind text).
CONSISTENCY: layout technical-dark, same palette, same accent hex, same grade.
```

### 4. step-03
```
Ebook 4/7 — design tokens: technical-dark · terminal-green · step-cards. Canvas: 4K 4320x6112, PNG, no watermark, no logo.
SCENE (photoreal, real life): two developers over a laptop at a whiteboard, a clock showing the 4-hour review SLA, a merge button clicked
CINEMATIC GRADE: {camera & lens, lighting source + color, depth of field, film grain, color mood}.
TEXT (render EXACTLY):
  Headline: "Review in hours, not days."
  Body: "A review SLA turned waiting from a black hole into a contract. Small diffs + a 4-hour SLA meant merges stopped stacking. Throughput doubled with zero new hires."
  Callout: "time-to-merge: 96h → 3.2h"
  Placement: legible over the scene — contrast guaranteed (scrim/panel behind text).
CONSISTENCY: layout technical-dark, same palette, same accent hex, same grade.
```

### 5. step-04
```
Ebook 5/7 — design tokens: technical-dark · terminal-green · step-cards. Canvas: 4K 4320x6112, PNG, no watermark, no logo.
SCENE (photoreal, real life): a one-click deploy button on a dashboard, a green banner reading "deployed to production", a developer shrugging
CINEMATIC GRADE: {camera & lens, lighting source + color, depth of field, film grain, color mood}.
TEXT (render EXACTLY):
  Headline: "Deploy like it's nothing."
  Body: "Feature flags made the deploy boring — so we shipped daily. When a release stopped being an event, it stopped being a risk. Rollbacks became one command."
  Placement: legible over the scene — contrast guaranteed (scrim/panel behind text).
CONSISTENCY: layout technical-dark, same palette, same accent hex, same grade.
```

### 6. step-05
```
Ebook 6/7 — design tokens: technical-dark · terminal-green · step-cards. Canvas: 4K 4320x6112, PNG, no watermark, no logo.
SCENE (photoreal, real life): a wall board with four DORA metrics trending down to green, a team standing around it
CINEMATIC GRADE: {camera & lens, lighting source + color, depth of field, film grain, color mood}.
TEXT (render EXACTLY):
  Headline: "Measure the pipeline, not the heroics."
  Body: "Lead time, deploy frequency, change-failure rate — tracked on one board. The heroics stopped because the metrics made the system visible. 4 days → 40 minutes in 90 days."
  Callout: "lead time: 4 days → 40 min · deploys: 2/mo → 22/mo"
  Placement: legible over the scene — contrast guaranteed (scrim/panel behind text).
CONSISTENCY: layout technical-dark, same palette, same accent hex, same grade.
```

### 7. cta
```
Ebook 7/7 — design tokens: technical-dark · terminal-green · step-cards. Canvas: 4K 4320x6112, PNG, no watermark, no logo.
SCENE (photoreal, real life): a terminal scrolling deploy logs, ending on a blinking cursor at a prompt reading "next: part 2"
CINEMATIC GRADE: {camera & lens, lighting source + color, depth of field, film grain, color mood}.
TEXT (render EXACTLY):
  Headline: "Ready to ship faster?"
  Body: "Reply "pipeline" or save this page — the open loop closes in the next issue."
  CTA: "Get part 2 — the CI pipeline teardown with the actual configs"
  Placement: legible over the scene — contrast guaranteed (scrim/panel behind text).
CONSISTENCY: layout technical-dark, same palette, same accent hex, same grade.
```

---
After generation: visually verify every word, assemble the pages into the PDF/lead page, and audit (cover pull, layout consistency, copy, scenes, 4K ≥ 4000px long edge).