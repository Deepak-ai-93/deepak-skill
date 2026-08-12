# Frontend Design Pack — Figma · Google Stitch · MCP (design-to-code)

> **How to run it (Stage 3 of the skill):** every vibe-coded app needs a **design
> source of truth**. Three paths, in order of preference:
>
> 1. **Figma file exists** → connect via the **Figma Developer MCP** and extract
>    the real tokens/layout instead of guessing.
> 2. **No design yet** → generate one fast with **Google Stitch** (Google Labs'
>    AI design canvas — text/sketch → UI → exportable React + a `DESIGN.md`), or
>    fall back to the locked open-source `design-system.md` pack.
> 3. **Design QA** → verify the built app against the design with a **browser
>    MCP** (screenshot + compare), not by eyeballing.
>
> This template is the **bridge between design and code**. It plugs into the build
> pack: the blueprint's §3 (design) records the source of truth + how tokens map;
> BUILD.md's golden loop gains a "design parity" check per screen.

---

## 1. Path A — Figma file exists (Figma Developer MCP)

The **official Figma Developer MCP** turns a design file into context an agent can
read AND write. Best setup for coding agents:

```bash
# Claude Code / Cursor / Codex etc. — remote MCP (OAuth, no desktop app needed)
claude mcp add figma --transport remote https://mcp.figma.com/mcp
# or mcp.json:
# { "mcpServers": { "figma": { "type": "http", "url": "https://mcp.figma.com/mcp" } } }
```

**What it unlocks (agent-usable tools):**

| Tool | Use it for |
|---|---|
| `get_design_context` | Pull layout/styling for a selected frame → clean React+Tailwind structure (the default output) |
| `get_variable_defs` | Extract the design **tokens**: color collections, spacing scales, typography variables |
| `get_screenshot` / `get_metadata` | Visual preview / sparse structural outline of a file |
| `search_design_system` / `get_libraries` | Find existing components/variables in team libraries — reuse, don't hardcode |
| `get_code_connect_map` / `get_motion_context` | Map design components to your repo's real components; pull animation/keyframes |
| `download_assets` | Export high-fidelity assets |

**The workflow (paste into the build pack's design section):**

1. User pastes a **Figma file/selection link** in chat → agent calls `get_design_context` + `get_variable_defs` for the key frames.
2. Agent maps Figma variables → the design tokens in `design-system.md` §2 (see §4 mapping table).
3. Agent writes the page blocks in `sitemap.md` §2 from the **actual layout** — not a generic template.
4. During the build, each screen's DoD includes *"matches the Figma frame: layout, spacing, tokens, states"*.
5. If a design is tweaked, the agent updates the pack and re-checks parity — never silently diverges.

> **Rule:** the Figma file is the **spec**, `sitemap.md` is the **map**, the built
> app is the **proof**. The three must agree; where they disagree, flag it to the
> user before choosing.

---

## 2. Path B — no design yet (Google Stitch, or the open-source pack)

### 2.1 Google Stitch (`stitch.withgoogle.com`) — generate the design fast

Google Labs' **Stitch** is an AI-native design canvas: describe or sketch a UI and
it produces multi-screen prototypes + frontend code. It's a strong "design first,
code second" step when the user has no Figma file:

| Capability | What you get |
|---|---|
| Text / sketch / wireframe / screenshot → UI | Instant UI exploration on an infinite canvas |
| Voice iteration | Say "make the primary button green" — no drag-and-drop |
| Multi-screen stitching | Screens connected into interactive user journeys |
| **`DESIGN.md`** | An agent-friendly design-rules file — the design system as markdown the builder reads |
| **MCP / SDK + exports** | Plug Stitch into the agent loop; export to Figma or React code |
| React frontend export | Production-ready components in your stack |

**The workflow:**

1. User answers one question: *"do you have a Figma design, or should we generate the design?"* (default: generate in Stitch).
2. Agent prompts Stitch with the **page list from the sitemap** (landing → auth → dashboard → …), gets back screens + `DESIGN.md`.
3. Agent maps `DESIGN.md` tokens → the locked design system (§4) so the built app is consistent even if the user later abandons Stitch.
4. `DESIGN.md` (or the extracted tokens) becomes the blueprint's §3 design source of truth.

### 2.2 No design AND no Stitch — the open-source pack

Locked defaults from `design-system.md` — neutral shadcn tokens, one accent hue,
Geist fonts, per-app-type component inventory. Zero design meetings. This remains
the fallback that always works.

> **Rule:** never leave the design section of the blueprint as "TBD". Either a
> Figma link, a `DESIGN.md` from Stitch, or the open-source pack — a locked choice
> in exactly one place.

---

## 3. Design QA — verify parity with a browser MCP

A **browser MCP** (Puppeteer / Playwright / Real-Browser) lets the builder actually
look at the rendered app:

- Load `localhost` (or the deployed URL) → screenshot the built screens.
- Compare against the Figma screenshots (`get_screenshot`) or Stitch exports: layout, spacing, tokens, dark mode.
- Check responsive viewports (375 / 768 / 1280) and console errors.
- Confirm micro-interactions and empty/loading/error states exist per `design-system.md` §6.

**Add to BUILD.md's golden loop:** after "run + verify", do a *visual check* for
every UI task — cheap for a new screen, and it catches token drift before the audit.

---

## 4. Token mapping — Figma variable → Tailwind token (design-system.md §2)

| Figma variable / Stitch token | Tailwind shadcn token | Example |
|---|---|---|
| Color: background / surface | `--background` / `--card` | `0 0% 100%` / dark pair |
| Color: text primary / secondary | `--foreground` / `--muted-foreground` | `240 10% 3.9%` / `240 3.8% 46.1%` |
| Color: brand accent | `--primary` (hue only — ONE accent) | `243 75% 59%` |
| Color: danger / success | `--destructive` / `--success` | `0 84.2% 60.2%` |
| Radius: control / card | `--radius` | `0.5rem` / `0.75rem` |
| Spacing scale | Tailwind `gap-*` / `space-y-*` / `p-*` | 4/8/12/16/24/32/48 |
| Type scale + fonts | Tailwind `text-*` + Geist family | `text-base` body, `text-4xl` hero |
| Shadows / borders | `--border` / `shadow-sm` | neutral, never custom per page |

**Rules (from design-system.md §7, non-negotiable):**
- Tokens only — no per-page colors/fonts/shadows.
- One accent hue. Dark mode via class strategy + `next-themes`.
- Mobile at 375px; a11y contrast ≥ 4.5:1; focus rings via `--ring`.
- If a design uses a color outside the palette, **map it to the nearest token and
  note the mapping** — don't add a new token per screen.

---

## 5. Design QA checklist (feeds the auditor)

- [ ] Design source of truth recorded in blueprint §3 (Figma link / `DESIGN.md` / pack)
- [ ] Tokens mapped (§4) — no raw hex colors in components, one accent
- [ ] Every screen in `sitemap.md` §2 matches its design: layout, spacing, type, states
- [ ] Screenshot parity checked (browser MCP vs Figma/Stitch) at 375 / 768 / 1280
- [ ] Dark mode renders correctly; toggles persist
- [ ] Empty / loading / error states on every async view (per design-system.md §6)
- [ ] Micro-interactions present, minimal (hover/active/focus transitions)
- [ ] No design drift in the build report — deviations logged with the user's sign-off

> **Design source of truth for existing projects:** reuse the app's existing
> tokens/design (the scan says so); only NEW screens need the mapping. Never
> re-platform an existing design system without the blueprint saying so.
