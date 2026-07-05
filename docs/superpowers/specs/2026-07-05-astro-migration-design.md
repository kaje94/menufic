# Design Spec — Migrate `design/` prototype from static HTML to Astro + React

**Date:** 2026-07-05
**Status:** Approved (design), pending implementation plan
**Scope:** The `design/` clickable prototype only (Brand / App / Public menu / Admin surfaces). Does **not** touch `apps/legacy-webapp` (the Next.js + Mantine product app).

---

## 1. Context & motivation

The prototype at `design/landing/` is 13 self-contained static HTML pages across 4 surfaces. The App pages repeat the **entire drawer/sidebar/topbar shell + inline vanilla JS verbatim**, dummy data is copy-pasted (e.g. 3 near-identical restaurant-card blocks in `dashboard.html`), and every page re-declares its `<head>`. HTML files cannot express reusable components, so the duplication is unavoidable in the current stack.

**Goal:** Re-author the prototype as a modular Astro + React app so shared UI becomes real components, and so those components **port cleanly into the future Next.js + Tailwind/daisyUI product app** (which will replace Mantine).

**Success criteria:**
- Every one of the 13 pages reaches visual + behavioral parity with the current prototype at 390 / 768 / 1440.
- Shared UI (shell, cards, nav, badges) exists once, as importable components.
- Components are authored so porting to Next.js is near-verbatim copy for `.tsx`, and a thin hand-rewrite for pages.
- The daisyUI theme system (DESIGN.md §7) is preserved unchanged in spirit.

## 2. Non-goals

- No changes to `apps/legacy-webapp`.
- No new visual design — this is a **like-for-like re-platform**, not a redesign. `/impeccable` is used for **parity verification and polish**, not to reinvent screens.
- No backend, routing to real data, or auth. Dummy data stays dummy.
- Not building the real app's primitive component library now (Button/Field/etc.) — see §4.

## 3. Target architecture — Hybrid Astro + React

- **`.astro` pages + layouts** own routing, `<head>`, and composition. They stay **thin**: imports + data wiring + component composition.
- **`.tsx` React components** (via `@astrojs/react`) own all real markup. Server-rendered by default (zero JS); `client:*` directives only where interactive.
- **Rationale:** `.tsx` components copy into Next.js near-verbatim (server component → RSC, `client:load` → `"use client"`). `.astro` pages get hand-rewritten into Next.js page format — cheaper the thinner they are. Everything ports; nothing is throwaway.

## 4. The styling & extraction rule (the core decision)

Styles are partitioned by **structural shape**, not by widget count:

| Tier | Trigger | Becomes |
|---|---|---|
| **1. Global CSS class** | Single-element styling (`.btn`, `.input`, `.select`, `.card`, focus ring, `@theme` tokens, base font defaults) | Stays in `app.css` |
| **2. Local non-exported element** | Multi-element block, repeats **within one file** or aids readability, not reused elsewhere | Local component/snippet in the same file |
| **3. Exported `.tsx` component** | Multi-element block, reused **across files**, or a domain unit, or carries state | Own file in `src/components/`, importable |
| **(inline)** | Single-use, static | Plain markup in the `.astro` page |

**daisyUI's role:** stays as **theme tokens + atomic primitives**. Atomic daisyUI classes (`.btn`, `.input`, `.card`, `.badge`) are **not** re-wrapped in React components — that would create two sources of truth for styling daisyUI already owns. Only **compound** styles move into components.

**Consequence for `app.css`:** shrinks from 254 → ~120 lines. Keeps: the two daisyUI `@theme` blocks (`menufic`, `menufic-public`), `@theme` tokens (fonts, shadows, `--color-cocoa-deep`), atomic primitive overrides (`.btn` pill/lift, `.input`/`.select` height, `.card` transition, global focus ring), base font defaults, `.stagger`/`.reveal` keyframe CSS, and reduced-motion. **Leaves** (become components): `.sectionbar`, `.app-nav`, `.app-subnav` (~70 lines of compound, stateful selectors) → `SectionBar`, `Sidebar`, `SubNav`.

## 5. Interactivity → React hooks

All inline vanilla JS is converted to React hooks inside `client:*` components (vanilla inline JS does not port; hooks do):

| Current inline behavior | New home |
|---|---|
| Drawer toggle + `aria` sync + escape-to-close | `client:load` interactive part of `<AppShell>` |
| Account dropdown (outside-click / escape) | `client:load` `<AccountMenu>` island |
| Entrance stagger (`setTimeout` by `data-delay`) | `useStagger()` hook / `<Reveal>` wrapper |
| Reveal-on-scroll (IntersectionObserver) | `useReveal()` hook |
| Theme-builder live preview (inline daisyUI vars) | `client:visible` `<ThemeBuilderPreview>` island |
| Live-menu device | `client:visible` `<LiveMenuDevice>` island |
| Video hero | `client:visible` `<VideoHero>` island |

Everything else renders server-side, zero JS.

## 6. Directory structure & coexistence

Scaffold a fresh Astro app at **`design/astro/`**; keep `design/landing/` untouched until parity is verified per-page, then swap. No big-bang — old and new diff side by side.

```
design/astro/
  astro.config.mjs        # @astrojs/react, Tailwind v4 via @tailwindcss/vite
  public/                 # images, video, favicon (from landing/assets)
  src/
    styles/app.css        # ~120-line trimmed theme (see §4)
    layouts/
      AppShell.astro       # App surface shell (Sidebar + Topbar + AccountMenu)
      BrandLayout.astro    # Brand (landing/auth)
      AdminLayout.astro    # Admin (no sidebar)
      PublicLayout.astro   # Public menu (light theme)
    components/
      app/     Sidebar.tsx, Topbar.tsx, AccountMenu.tsx, RestaurantCard.tsx,
               DishCard.tsx, StatusBadge.tsx, SectionBar.tsx, SubNav.tsx,
               EmptyState.tsx, Avatar.tsx
      brand/   BrandNav.tsx, Footer.tsx, VideoHero.tsx
      islands/ LiveMenuDevice.tsx, ThemeBuilderPreview.tsx
      hooks/   useStagger.ts, useReveal.ts
    data/      restaurants.ts, dishes.ts, team.ts   # typed dummy data
    pages/
      index.astro
      app/dashboard.astro, restaurant.astro, menu-editor.astro, banners.astro,
          theme.astro, analytics.astro, team.astro, qr.astro, signin.astro
      public/index.astro
      admin/review.astro, restaurants.astro
```

Component inventory is ~15–20 (Balanced-plus): surface shells, genuinely-repeated UI, and the 3 signature islands. Atomic primitives stay as daisyUI classes.

## 7. Routing / URL parity

Adopt Astro's clean URLs (`/app/dashboard`, `/public`, `/admin/review`) and rewrite internal links (currently `.html`). Matches how the real Next.js app will route. Dev server becomes `astro dev` (default :4321); the `python -m http.server` + `watch:css` workflow is retired for the Astro app (Astro compiles Tailwind via `@tailwindcss/vite`).

## 8. Page → route map

| Surface | Current file | New route | Layout |
|---|---|---|---|
| Brand | `index.html` | `/` | BrandLayout |
| Brand | `app/signin.html` | `/app/signin` | BrandLayout |
| App | `app/dashboard.html` | `/app/dashboard` | AppShell |
| App | `app/restaurant.html` | `/app/restaurant` | AppShell |
| App | `app/menu-editor.html` | `/app/menu-editor` | AppShell |
| App | `app/banners.html` | `/app/banners` | AppShell |
| App | `app/theme.html` | `/app/theme` | AppShell |
| App | `app/analytics.html` | `/app/analytics` | AppShell |
| App | `app/team.html` | `/app/team` | AppShell |
| App | `app/qr.html` | `/app/qr` | AppShell |
| Public | `public/index.html` | `/public` | PublicLayout |
| Admin | `admin/review.html` | `/admin/review` | AdminLayout |
| Admin | `admin/restaurants.html` | `/admin/restaurants` | AdminLayout |

## 9. Verification

Each migrated surface is checked through `/impeccable` (audit + critique) and headless-Chrome screenshots at **390 / 768 / 1440**, diffed against the corresponding old page for parity (layout, overflow, contrast, broken images, console errors). Per-surface honest parity report. The overflow check ignores elements clipped by an `overflow:auto/hidden` ancestor (per prototype convention).

## 10. Subagent-driven execution

Sonnet models, shallow mechanical work. **Sequenced by dependency:**

1. **Scaffold pass (serial, once):** Astro + `@astrojs/react` + Tailwind v4 setup; trimmed `app.css`; `@theme` tokens; the 4 layouts; `AppShell` shell with interactive islands; data modules; base components (`RestaurantCard`, `DishCard`, `StatusBadge`, `SectionBar`, `SubNav`, `Sidebar`, `Topbar`, `AccountMenu`, `Avatar`, `EmptyState`, hooks). Everything downstream depends on this, so it is **not** parallelized.
2. **Page fan-out (parallel):** one subagent per page, since pages are independent once the shell + components exist. Each builds its `.astro` page by composing existing components and wiring data, plus any page-unique inline markup and page-specific islands (theme-builder on `/app/theme`, video hero + live-menu on `/` and `/app/dashboard`).
3. **Verification pass:** `/impeccable` + screenshot parity per surface (§9).
4. **Swap:** once all 13 pages verified, retire `design/landing/`.

## 11. Risks & mitigations

- **Signature-island CSS** (theme-builder, live-menu, video hero) is bespoke and stateful — highest-risk conversions. Mitigation: handle as dedicated `client:visible` islands in the scaffold/early pass, not fanned out blind; they consume theme tokens, never hard-coded colors.
- **daisyUI compound classes** (`.menu`, `.drawer`) drive the shell — verify drawer + `aria` behavior matches after the hook rewrite.
- **Tailwind v4 in Astro** must load the same `@theme`/daisyUI config as today; verify compiled output matches the current `styles.css` token set before fanning out pages.
- **Parity drift** across parallel page agents — mitigated by the fixed component library from the scaffold pass (agents compose, they don't restyle) and the per-surface screenshot diff.

## 12. Open questions

None blocking. Primitive component library (Button/Field/etc.) for the real app is intentionally deferred — the prototype proves the visual system and domain components; the real app's needs will drive its primitives.
