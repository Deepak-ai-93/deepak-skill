# Design System Pack — open-source, distraction-free

> Locked defaults for every vibe-coded app. Copy the tokens, use the component
> inventory, never think about design decisions again. The builder (any tool)
> applies these as-is — zero design meetings.
>
> **Stack (all open-source):** Tailwind CSS v4 + shadcn/ui + Radix UI + Lucide icons + Geist fonts.

## 1. Install (one-time per project)

```bash
npm create next-app@latest my-app -- --typescript --tailwind --app --src-dir
cd my-app
npx shadcn@latest init          # neutral base, CSS variables
npx shadcn@latest add button card input label select textarea checkbox radio
npx shadcn@latest add dialog dropdown-menu sheet tabs avatar badge table
npx shadcn@latest add sonner alert form skeleton separator tooltip
npm i lucide-react geist react-hook-form zod @hookform/resolvers
```

## 2. Design tokens (copy into `globals.css` / `tailwind.config`)

Neutral shadcn palette — works for every product. Accent = your brand color **in one place only**.

| Token | Light (HSL) | Dark (HSL) |
|---|---|---|
| `--background` / `--foreground` | `0 0% 100%` / `240 10% 3.9%` | `240 10% 3.9%` / `0 0% 98%` |
| `--card` / `--card-foreground` | `0 0% 100%` / same fg | `240 10% 3.9%` / fg |
| `--primary` / `--primary-foreground` | `240 5.9% 10%` / `0 0% 98%` | `0 0% 98%` / `240 5.9% 10%` |
| `--secondary` | `240 4.8% 95.9%` | `240 3.7% 15.9%` |
| `--muted` / `--muted-foreground` | `240 4.8% 95.9%` / `240 3.8% 46.1%` | `240 3.7% 15.9%` / `240 5% 64.9%` |
| `--accent` | `240 4.8% 95.9%` | `240 3.7% 15.9%` |
| `--destructive` | `0 84.2% 60.2%` | `0 62.8% 30.6%` |
| `--border` / `--ring` | `240 5.9% 90%` / `240 5.9% 10%` | `240 3.7% 15.9%` / `240 4.9% 83.9%` |
| `--radius` | `0.5rem` (cards `0.75rem`, buttons `0.625rem`) | same |

- **Dark mode:** class strategy + toggle persisted in localStorage; `next-themes`.
- **One accent:** override `--primary` hue only (e.g. brand indigo `243 75% 59%`). Never multi-color themes.

## 3. Typography

- **Fonts:** Geist Sans (headings + body) + Geist Mono (labels, numbers, code) — open source, Vercel.
- **Scale (Tailwind):** `text-xs` 12 · `text-sm` 14 · `text-base` 16 · `text-lg` 18 · `text-xl` 20 · `text-2xl` 24 · `text-3xl` 30 · `text-4xl` 36 · `text-5xl` 48 · `text-6xl` 60.
- **Headings:** weight 600–700, `tracking-tight`, `leading-tight`. **Body:** weight 400, `leading-relaxed`, `text-muted-foreground` for secondary text.
- **Display (landing hero):** `text-4xl md:text-6xl font-semibold tracking-tight` with a `text-primary` accent word.

## 4. Layout system

- **Container:** `mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8`.
- **Section spacing:** `py-16 md:py-24` between sections; card grids `grid gap-6 sm:grid-cols-2 lg:grid-cols-3`.
- **Page types:** App shell = fixed sidebar (collapsible on mobile) + topbar; Marketing = sticky navbar + hero + sections + footer.
- **Safe spacing:** consistent `gap-4` (16px) between stacked elements, `space-y-6` between form fields.

## 5. Component inventory (pick per app type)

| App type | Ship these components (shadcn) |
|---|---|
| **Landing / marketing** | `navbar`, `button`, `badge`, `card` (feature grid), `accordion` (FAQ), `table` (pricing), `avatar`, `footer` |
| **Auth** | `card` (centered, `max-w-md`), `input`, `label`, `button` (social OAuth `variant="outline"`), `separator` ("or"), error `alert` |
| **Dashboard** | `sidebar`/`sheet` (mobile nav), `table` (data), `badge` (status), `skeleton` (loading), `dropdown-menu` (row actions), `tabs`, `dialog` (create/edit), `sonner` (toasts) |
| **Billing** | `table` (invoices), `badge` (active/trialing/past_due), `dialog` (upgrade), usage meter = `progress` |
| **Forms** | react-hook-form + zod schema per form, `input`/`select`/`textarea`/`checkbox`, inline `form.message`, disabled + loading state on submit |

## 6. Micro-interactions (make it feel alive, stay minimal)

- Buttons: `transition-colors`, `active:scale-[0.98]`, disabled with `opacity-50 cursor-not-allowed`.
- Cards: `hover:border-primary/30 hover:shadow-sm transition-shadow` on clickable cards.
- Tables: row `hover:bg-muted/50`; loading rows = `skeleton` shimmer.
- Empty states: `flex flex-col items-center justify-center py-16 text-center` + icon + title + action button.
- Error states: destructive `alert` at top of the failing view + `sonner` toast for async actions.

## 7. Non-negotiables

- Mobile responsive at 375px — sidebar becomes `sheet`, tables get horizontal scroll (`overflow-x-auto`).
- Accessibility: every `input` has a `label`; icons get `aria-label`; contrast `>= 4.5:1`; focus rings via `--ring`.
- No custom colors/fonts per page — tokens only. One design language, every screen.
