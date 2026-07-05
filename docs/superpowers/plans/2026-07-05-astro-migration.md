# Astro + React Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Re-author the `design/landing/` static-HTML prototype (13 pages, 4 surfaces) as a modular Astro + React app whose components port cleanly into the future Next.js + Tailwind/daisyUI product app.

**Architecture:** Hybrid — thin `.astro` pages/layouts own routing + `<head>` + composition; all real markup lives in `.tsx` React components (via `@astrojs/react`), server-rendered by default with `client:*` only for interactivity. daisyUI stays as theme tokens + atomic primitives; compound styles move from `app.css`'s `@layer` into components. A new app is scaffolded at `design/astro/` alongside the untouched `design/landing/`; pages are verified for parity, then the old tree is retired.

**Tech Stack:** Astro 5, `@astrojs/react`, React 18, Tailwind CSS v4 (`@tailwindcss/vite`), daisyUI 5, TypeScript, `puppeteer-core` (verification).

## Global Constraints

- **Design source of truth:** the existing markup in `design/landing/**/*.html` and the theme in `design/landing/assets/css/app.css`. This is a **like-for-like re-platform, not a redesign** — do not change layout, copy, colors, or spacing. When a task says "port the markup," copy the existing element structure and Tailwind classes verbatim, only swapping repeated shells/cards/nav for components and inline JS for hooks.
- **Styling tiers (from the spec):** single-element styling → global class in `app.css`; multi-element reused-across-files or stateful → exported `.tsx` component; multi-element local to one file → local non-exported element; single-use static → inline in the page. **Never re-wrap atomic daisyUI classes** (`.btn`, `.input`, `.select`, `.card`, `.badge`) in a React component.
- **No hard-coded colors/radii/shadows** anywhere — always theme tokens (`bg-base-200`, `text-secondary`, `var(--color-cocoa-deep)`, `shadow-floating`, etc.). This includes the signature islands.
- **Two daisyUI themes preserved verbatim:** `menufic` (dark, default) and `menufic-public` (light). App/Brand/Admin use `data-theme="menufic"`; Public menu uses `data-theme="menufic-public"`.
- **Accessibility parity:** keep every `aria-*`, `role`, focus ring, and reduced-motion behavior present in the source.
- **Scope fence:** never touch `apps/legacy-webapp`.

## Testing approach (adaptation note)

These are static presentational pages — there is no meaningful unit-test surface, so classic TDD does not apply. Each task's "test" is one or more of: **(a)** `npm run build` + `npx astro check` compile clean; **(b)** the page/component renders correctly in headless Chrome at 390 / 768 / 1440 with no console errors and no horizontal overflow; **(c)** visual parity against the corresponding `design/landing/` page. A reusable screenshot script (Task 2) makes (b)/(c) concrete and runnable.

## Page → route → layout map

| Source file | New route | Layout | Islands on page |
|---|---|---|---|
| `index.html` | `/` | BrandLayout | VideoHero, LiveMenuDevice |
| `app/signin.html` | `/app/signin` | BrandLayout | — |
| `app/dashboard.html` | `/app/dashboard` | AppShell | — |
| `app/restaurant.html` | `/app/restaurant` | AppShell | LiveMenuDevice |
| `app/menu-editor.html` | `/app/menu-editor` | AppShell | — |
| `app/banners.html` | `/app/banners` | AppShell | — |
| `app/theme.html` | `/app/theme` | AppShell | ThemeBuilderPreview |
| `app/analytics.html` | `/app/analytics` | AppShell | — |
| `app/team.html` | `/app/team` | AppShell | — |
| `app/qr.html` | `/app/qr` | AppShell | — |
| `public/index.html` | `/public` | PublicLayout | — |
| `admin/review.html` | `/admin/review` | AdminLayout | — |
| `admin/restaurants.html` | `/admin/restaurants` | AdminLayout | — |

## Page Migration Recipe (referenced by every Phase-1 page task)

For each page, the executing subagent MUST:
1. Open the source file `design/landing/<path>.html` and read it fully.
2. Create `design/astro/src/pages/<route>.astro` using the assigned layout: `---` frontmatter imports the layout, components, and data; the template composes them.
3. Replace the repeated **shell** (drawer/sidebar/topbar) with the layout wrapper.
4. Replace repeated **cards/nav/badges** with the Phase-0 components, mapped over the `src/data` modules (never re-paste duplicated card blocks).
5. Copy **page-unique** markup (headers, one-off sections) inline into the `.astro` template verbatim, keeping all classes and `aria-*`.
6. Drop the inline `<script>` — interactivity now comes from the layout's `<PageMotion />` and any assigned island. Remove the `<!-- impeccable-live-start -->…live.js…<!-- impeccable-live-end -->` block entirely.
7. Rewrite internal links from `*.html` to clean routes (`/app/restaurant.html` → `/app/restaurant`, `/index.html` → `/`).
8. Verify per the Testing approach.

---

# Phase 0 — Scaffold (serial; everything below depends on it)

### Task 1: Initialize Astro project with React + Tailwind v4

**Files:**
- Create: `design/astro/package.json`, `design/astro/astro.config.mjs`, `design/astro/tsconfig.json`
- Create: `design/astro/src/pages/index.astro` (temporary smoke page, replaced in Task 12)

**Interfaces:**
- Produces: a booting Astro dev server at `http://localhost:4321`; `@astrojs/react` and `@tailwindcss/vite` configured for all later tasks.

- [ ] **Step 1: Scaffold non-interactively**

```bash
cd design/astro 2>/dev/null || (mkdir -p design/astro && cd design/astro)
cd design/astro
npm create astro@latest . -- --template minimal --no-install --no-git --yes
npm install
npx astro add react --yes
npm install -D @tailwindcss/vite tailwindcss daisyui
npm install -D puppeteer-core
```

- [ ] **Step 2: Write `astro.config.mjs`**

```js
// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  integrations: [react()],
  vite: { plugins: [tailwindcss()] },
});
```

- [ ] **Step 3: Write the temporary smoke page `src/pages/index.astro`**

```astro
---
---
<html lang="en" data-theme="menufic">
  <head><meta charset="utf-8" /><title>Astro smoke</title></head>
  <body class="bg-base-100 text-base-content p-10">
    <h1 class="text-3xl font-bold">Astro is up</h1>
  </body>
</html>
```

- [ ] **Step 4: Verify dev server boots**

Run: `cd design/astro && npm run build`
Expected: build completes with no errors; `dist/index.html` produced.

- [ ] **Step 5: Commit**

```bash
git add design/astro
git commit -m "chore(design): scaffold Astro + React + Tailwind v4 app"
```

---

### Task 2: Port the trimmed theme (`app.css`), assets, fonts, and screenshot tooling

**Files:**
- Create: `design/astro/src/styles/app.css` (trimmed from `design/landing/assets/css/app.css`)
- Create: `design/astro/public/img/*`, `design/astro/public/video/*` (copied from `design/landing/assets/`)
- Create: `design/astro/scripts/shot.mjs` (verification screenshots)
- Create: `design/astro/src/layouts/BaseHead.astro` (shared `<head>` fragment: fonts + css import)

**Interfaces:**
- Produces: `import '../styles/app.css'`; `<BaseHead title=... description=... />`; `node scripts/shot.mjs <url> <outdir>`.

- [ ] **Step 1: Copy assets into `public/`**

```bash
cd design/astro
mkdir -p public/img public/video
cp ../landing/assets/img/* public/img/
cp ../landing/assets/video/* public/video/
```

- [ ] **Step 2: Create `src/styles/app.css` — KEEP tiers 1 + base + tokens, DROP compound `@layer`**

Copy `design/landing/assets/css/app.css` verbatim, then make exactly these changes:
- Change line 2 from `@source "../../**/*.html";` to `@source "../**/*.{astro,tsx,ts}";`
- **Delete** the `@layer components { … }` block containing `.sectionbar`, `.app-nav`, `.app-subnav` (lines ~131–204 in the source). These become components in Tasks 7 and 9.
- Keep everything else: both `@plugin "daisyui/theme"` blocks (`menufic`, `menufic-public`), the `@theme` token block, the unlayered `.btn`/`.btn-ghost`/`.input`/`.select`/`.card`/`:focus-visible` overrides, `@layer utilities` (`.shadow-floating`, `.measure`, `.stagger`, `.reveal`), `@layer base` (body/heading fonts), and the `prefers-reduced-motion` block.

- [ ] **Step 3: Create `src/layouts/BaseHead.astro`**

```astro
---
interface Props { title: string; description?: string; }
const { title, description = 'Menufic — beautiful digital menus.' } = Astro.props;
---
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>{title}</title>
<meta name="description" content={description} />
<link rel="preconnect" href="https://api.fontshare.com" crossorigin />
<link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=boska@400,500,700&f[]=supreme@400,500,600,700&display=swap" />
```
Import `../styles/app.css` from each layout (not here) so Vite bundles it once per page.

- [ ] **Step 4: Create `scripts/shot.mjs`**

```js
import puppeteer from 'puppeteer-core';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const [url, outdir = 'shots'] = process.argv.slice(2);
const widths = [390, 768, 1440];
const b = await puppeteer.launch({ executablePath: CHROME, headless: 'new' });
for (const w of widths) {
  const p = await b.newPage();
  const errs = [];
  p.on('console', m => m.type() === 'error' && errs.push(m.text()));
  await p.setViewport({ width: w, height: 900 });
  await p.goto(url, { waitUntil: 'networkidle0' });
  // overflow check ignoring scroll-clipped descendants
  const overflow = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  await p.screenshot({ path: `${outdir}/${w}.png`, fullPage: true });
  console.log(`w=${w} overflowPx=${overflow} consoleErrors=${errs.length}`, errs.slice(0, 3));
  await p.close();
}
await b.close();
```

- [ ] **Step 5: Verify CSS compiles and theme tokens survive**

Run: `cd design/astro && npm run build && grep -c "menufic-public" dist/**/*.css 2>/dev/null || grep -rc "color-base-100" dist/`
Expected: build clean; compiled CSS contains the daisyUI theme variables (`--color-base-100`, both theme names present).

- [ ] **Step 6: Commit**

```bash
git add design/astro
git commit -m "feat(design): port trimmed theme, assets, fonts, screenshot script"
```

---

### Task 3: Typed dummy-data modules

**Files:**
- Create: `design/astro/src/data/restaurants.ts`, `dishes.ts`, `team.ts`, `types.ts`

**Interfaces:**
- Produces:
  - `types.ts`: `export interface Restaurant { id: string; name: string; cuisine: string; location: string; dishCount: number; status: 'published' | 'pending' | 'draft'; image: string; }`
  - `types.ts`: `export interface Dish { id: string; name: string; description: string; price: string; image: string; tags?: string[]; }`
  - `types.ts`: `export interface TeamMember { id: string; name: string; email: string; role: 'Owner' | 'Manager' | 'Editor'; avatar: string; }`
  - `restaurants.ts`: `export const restaurants: Restaurant[]`
  - `dishes.ts`: `export const dishes: Dish[]`
  - `team.ts`: `export const team: TeamMember[]`
  - `restaurants.ts`: `export const owner = { name: 'Arun Kajendran', email: 'a.kajendran@gmail.com', avatar: '/img/photo-1507003211169-0a1dd7228f2d.jpg' }`

- [ ] **Step 1: Write `types.ts`** with the three interfaces above plus the `owner` shape.

- [ ] **Step 2: Write `restaurants.ts`** — transcribe the three restaurants from `design/landing/app/dashboard.html` (lines ~82–170): Saffron & Smoke (Modern grill · Downtown, 42 dishes, published, `/img/photo-1432139555190-58524dae6a55.jpg`), Bella Trattoria (Italian · Since 1998, 28 dishes, published, `/img/photo-1565299624946-b28f40a0ae38.jpg`), Verde Kitchen (All-day brunch · Riverside, 19 dishes, pending, `/img/photo-1517248135467-4c7edcad34c4.jpg`). Export `owner` too.

- [ ] **Step 3: Write `dishes.ts` and `team.ts`** — transcribe dish rows from `design/landing/app/menu-editor.html` and members from `design/landing/app/team.html` into the typed shapes (image paths rewritten to `/img/...`).

- [ ] **Step 4: Verify types**

Run: `cd design/astro && npx astro check`
Expected: 0 errors.

- [ ] **Step 5: Commit**

```bash
git add design/astro/src/data
git commit -m "feat(design): typed dummy-data modules (restaurants, dishes, team)"
```

---

### Task 4: Motion hooks + `<PageMotion>` island

**Files:**
- Create: `design/astro/src/components/hooks/useStagger.ts`, `useReveal.ts`
- Create: `design/astro/src/components/PageMotion.tsx`

**Interfaces:**
- Consumes: the `.stagger` / `.reveal` / `.js` CSS utilities kept in `app.css` (Task 2).
- Produces: `<PageMotion />` — a zero-markup `client:idle` component that reproduces the source inline script's stagger + reveal behavior via `useEffect`. Mounted once per layout.

- [ ] **Step 1: Write `PageMotion.tsx`** — on mount, add class `js` to `<html>`, then run the exact logic from `design/landing/app/dashboard.html` lines ~295–305 (stagger: sort `.stagger` by `data-delay`, add `.in` on a `data-delay*80+90`ms timeout; respect `prefers-reduced-motion` by adding `.in` immediately) and the reveal IntersectionObserver from `index.html`. Return `null`.

```tsx
import { useEffect } from 'react';
export default function PageMotion() {
  useEffect(() => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.documentElement.classList.add('js');
    const stag = [...document.querySelectorAll<HTMLElement>('.stagger')];
    if (reduce) stag.forEach(el => el.classList.add('in'));
    else stag.sort((a,b)=>(+(a.dataset.delay||0))-(+(b.dataset.delay||0)))
      .forEach(el => setTimeout(()=>el.classList.add('in'), (+(el.dataset.delay||0))*80+90));
    const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && e.target.classList.add('in')), { threshold: 0.15 });
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
  return null;
}
```

- [ ] **Step 2: Verify** `npx astro check` is clean. Commit.

```bash
git add design/astro/src/components
git commit -m "feat(design): PageMotion island for stagger + reveal"
```

---

### Task 5: Atomic-ish leaf components — `StatusBadge`, `Avatar`, `EmptyState`

**Files:**
- Create: `design/astro/src/components/app/StatusBadge.tsx`, `Avatar.tsx`, `EmptyState.tsx`

**Interfaces:**
- Produces:
  - `StatusBadge`: `({ status }: { status: 'published' | 'pending' | 'draft' })` → the Published (success)/Pending review (secondary)/Draft badge; markup + classes from `dashboard.html` lines ~105–107 (published) and ~165–167 (pending). Conditional color/label/dot by status.
  - `Avatar`: `({ src, name, size?, className? }: { src: string; name: string; size?: number; className?: string })` → the account chip image; passes through `className` via string concat (no library needed).
  - `EmptyState`: `({ icon?, title, body, className? })` → the dashed "Add new" style block used by dashboard + empty lists.

- [ ] **Step 1: Write the three components**, porting classes verbatim from the referenced source lines. `StatusBadge` map:

```tsx
const MAP = {
  published: { cls: 'border-success/40 bg-success/15 text-success', dot: 'bg-success', label: 'Published' },
  pending:   { cls: 'badge badge-secondary border-0', dot: 'bg-secondary-content/65', label: 'Pending review' },
  draft:     { cls: 'border-base-content/30 bg-base-200 text-base-content/70', dot: 'bg-base-content/40', label: 'Draft' },
} as const;
```

- [ ] **Step 2: Verify** `npx astro check` clean. Commit `feat(design): StatusBadge, Avatar, EmptyState leaf components`.

---

### Task 6: Domain card — `RestaurantCard`

> **Re-scoped during execution:** originally `RestaurantCard` + `DishCard`. `DishCard` was dropped — the menu-editor dish row is an interactive island (drag grip, availability segmented control, ~40 bespoke CSS rules) used only on the menu-editor page, i.e. a single-file island, not a reusable domain card. It moves to **Task 16**, which also extends `Dish` with an `availability: 'available' | 'soldout' | 'unavailable'` field. `RestaurantCard` (pure daisyUI + Tailwind + `StatusBadge`) is the only deliverable here.

**Files:**
- Create: `design/astro/src/components/app/RestaurantCard.tsx`

**Interfaces:**
- Consumes: `Restaurant` (Task 3); `StatusBadge` (Task 5).
- Produces:
  - `RestaurantCard`: `({ r }: { r: Restaurant })` → the full card from `dashboard.html` lines ~83–110 (figure + hover edit/delete buttons + card-body + `StatusBadge`). Edit hover uses `hover:border-secondary hover:text-secondary`; delete uses `hover:border-error hover:text-error`.

- [ ] **Step 1: Write it**, mapping props into the verbatim markup; replace the inline badge with `<StatusBadge status={r.status} />`.

- [ ] **Step 2: Verify** `npx astro check` clean. Commit `feat(design): RestaurantCard`.

---

### Task 7: `SectionBar` (compound `@layer` → component)

**Files:**
- Create: `design/astro/src/components/app/SectionBar.tsx`

**Interfaces:**
- Produces: `SectionBar`: `({ items, current }: { items: { href: string; label: string; icon?: ReactNode }[]; current: string })` → the horizontal scrollable pill nav that was `.sectionbar` in `app.css` (deleted in Task 2). Reproduce those styles as Tailwind utilities on the elements; active item (`href === current`) gets `bg-secondary/15 border-secondary/45 text-secondary`, others `bg-base-200 text-base-content/70 hover:bg-base-300`.

- [ ] **Step 1: Write `SectionBar.tsx`** converting the deleted `.sectionbar` rules (source `app.css` lines ~135–168) into utility classes:

```tsx
import type { ReactNode } from 'react';
export default function SectionBar({ items, current }: { items: { href: string; label: string; icon?: ReactNode }[]; current: string }) {
  return (
    <nav className="mb-[clamp(20px,2.6vw,28px)] flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:thin]">
      {items.map(it => {
        const active = it.href === current;
        return (
          <a key={it.href} href={it.href} aria-current={active ? 'page' : undefined}
             className={`inline-flex min-h-[42px] flex-none items-center gap-2 whitespace-nowrap rounded-full border px-4 text-sm font-semibold transition-colors ${active ? 'border-secondary/45 bg-secondary/15 text-secondary' : 'border-base-content/10 bg-base-200 text-base-content/70 hover:bg-base-300 hover:text-base-content'}`}>
            {it.icon}{it.label}
          </a>
        );
      })}
    </nav>
  );
}
```
(The icon slot takes 16px SVGs; keep `flex-none` so pills don't shrink in the scroll strip.)

- [ ] **Step 2: Verify** `npx astro check` clean; render on a throwaway test page and screenshot at 390 to confirm the scroll strip matches. Commit `feat(design): SectionBar component (from .sectionbar @layer)`.

---

### Task 8: `AccountMenu` island + `Topbar`

**Files:**
- Create: `design/astro/src/components/app/AccountMenu.tsx` (client island), `Topbar.tsx`

**Interfaces:**
- Consumes: `owner` (Task 3), `Avatar` (Task 5).
- Produces:
  - `AccountMenu`: `({ owner }: { owner: typeof import('../../data/restaurants').owner })` → the account dropdown from `dashboard.html` lines ~44–63; `useState` open/close, outside-click + Escape close (port logic from lines ~273–293). Rendered `client:load`.
  - `Topbar`: `({ crumb }: { crumb: string })` → the sticky top bar (hamburger `<label for="app-drawer">` + breadcrumb + `<AccountMenu client:load owner={owner} />`). The hamburger is a plain daisyUI drawer `<label>` — no JS needed to toggle.

- [ ] **Step 1: Write `AccountMenu.tsx`** with `useState`, a `useEffect` document click/keydown listener closing on outside-click/Escape, `aria-expanded` synced to state. Port the menu markup + classes verbatim.

- [ ] **Step 2: Write `Topbar.tsx`** — hamburger as `<label htmlFor="app-drawer" class="… lg:hidden">`, breadcrumb from `crumb` prop, `<AccountMenu client:load owner={owner} />`.

- [ ] **Step 3: Verify** `npx astro check` clean. Commit `feat(design): AccountMenu island + Topbar`.

---

### Task 9: `Sidebar` + `SubNav` + `DrawerA11y` + `AppShell.astro`

**Files:**
- Create: `design/astro/src/components/app/Sidebar.tsx`, `SubNav.tsx`, `DrawerA11y.tsx`
- Create: `design/astro/src/layouts/AppShell.astro`

**Interfaces:**
- Consumes: `restaurants`, `owner` (Task 3); `Topbar` (Task 8); `Avatar` (Task 5); `PageMotion` (Task 4).
- Produces:
  - `Sidebar`: `({ restaurants, owner, currentRestaurantId? }: …)` → the `<aside>` from `dashboard.html` lines ~193–252; active item (`aria-current`) styling reproduces the deleted `.app-nav` rules (source `app.css` lines ~190–203) as utilities: active `li>a` gets `bg-secondary/13 text-secondary font-semibold`, its `.nav-dot` `bg-secondary`.
  - `SubNav`: `({ items, current }: …)` → the per-restaurant sub-nav (reproduces deleted `.app-subnav` active rules).
  - `DrawerA11y`: `({ drawerId }: { drawerId: string })` → `client:idle` component adding Escape-to-close + close-on-nav-click-on-mobile + `aria-expanded` sync to the daisyUI drawer checkbox (port from `dashboard.html` lines ~262–271, ~288–293). Returns `null`.
  - `AppShell.astro`: `Props { crumb: string; currentRestaurantId?: string }` → the daisyUI `drawer lg:drawer-open` wrapper with `<Topbar>`, a `<slot />` for page `<main>`, `<Sidebar>`, plus `<PageMotion client:idle />` and `<DrawerA11y client:idle drawerId="app-drawer" />`. Imports `../styles/app.css`. Full `<html data-theme="menufic">` document with `<BaseHead>`.

- [ ] **Step 1: Write `Sidebar.tsx` and `SubNav.tsx`** converting the deleted `.app-nav`/`.app-subnav` rules to conditional utility classes on active items.

- [ ] **Step 2: Write `DrawerA11y.tsx`** (useEffect wiring the checkbox `#app-drawer`).

- [ ] **Step 3: Write `AppShell.astro`:**

```astro
---
import BaseHead from './BaseHead.astro';
import Topbar from '../components/app/Topbar.tsx';
import Sidebar from '../components/app/Sidebar.tsx';
import PageMotion from '../components/PageMotion.tsx';
import DrawerA11y from '../components/app/DrawerA11y.tsx';
import { restaurants, owner } from '../data/restaurants';
import '../styles/app.css';
interface Props { crumb: string; currentRestaurantId?: string; }
const { crumb, currentRestaurantId } = Astro.props;
---
<html lang="en" data-theme="menufic">
  <head><BaseHead title={`${crumb} · Menufic`} /></head>
  <body class="min-h-screen bg-base-100 text-base-content">
    <div class="drawer lg:drawer-open">
      <input id="app-drawer" type="checkbox" class="drawer-toggle" aria-label="Toggle navigation" />
      <div class="drawer-content flex min-h-screen min-w-0 flex-col">
        <Topbar crumb={crumb} client:load />
        <slot />
      </div>
      <div class="drawer-side z-40">
        <label for="app-drawer" class="drawer-overlay" aria-label="Close navigation"></label>
        <Sidebar restaurants={restaurants} owner={owner} currentRestaurantId={currentRestaurantId} />
      </div>
    </div>
    <PageMotion client:idle />
    <DrawerA11y drawerId="app-drawer" client:idle />
  </body>
</html>
```

- [ ] **Step 4: Verify shell in isolation** — temporarily point `src/pages/index.astro` at `AppShell` with a stub `<main>`, `npm run build`, `node scripts/shot.mjs http://localhost:4321/ shots/shell` (after `npm run dev &`). Confirm sidebar persistent at 1440, drawer at 390, account menu opens, no console errors. Commit `feat(design): Sidebar, SubNav, DrawerA11y, AppShell layout`.

---

### Task 10: Remaining layouts — `BrandLayout`, `AdminLayout`, `PublicLayout` + `BrandNav`, `Footer`

**Files:**
- Create: `design/astro/src/layouts/BrandLayout.astro`, `AdminLayout.astro`, `PublicLayout.astro`
- Create: `design/astro/src/components/brand/BrandNav.tsx`, `Footer.tsx`

**Interfaces:**
- Consumes: `BaseHead`, `PageMotion`.
- Produces:
  - `BrandLayout.astro`: `Props { title: string; description?: string }` → `<html data-theme="menufic">` + `<BrandNav>` + `<slot />` + `<Footer>` + `<PageMotion client:idle />`. Nav/footer markup from `index.html`.
  - `AdminLayout.astro`: `Props { title: string }` → utilitarian shell, **no sidebar**, from `admin/review.html`.
  - `PublicLayout.astro`: `Props { title: string }` → `<html data-theme="menufic-public">` (light theme) from `public/index.html`.
  - `BrandNav`, `Footer`: extracted from `index.html` header/footer.

- [ ] **Step 1: Write the three layouts + BrandNav + Footer**, porting markup verbatim, each importing `../styles/app.css` and mounting `<PageMotion client:idle />`.

- [ ] **Step 2: Verify** `npx astro check` clean. Commit `feat(design): Brand/Admin/Public layouts + BrandNav + Footer`.

---

### Task 11: Signature islands — `VideoHero`, `LiveMenuDevice`, `ThemeBuilderPreview`

**Files:**
- Create: `design/astro/src/components/brand/VideoHero.tsx`, `design/astro/src/components/islands/LiveMenuDevice.tsx`, `ThemeBuilderPreview.tsx`

**Interfaces:**
- Produces:
  - `VideoHero`: `client:visible` — the `<video>` hero from `index.html` (poster `/video/hero-meatball-poster.jpg`, src `/video/hero-meatball.mp4`), autoplay/muted/loop/playsinline, respects reduced-motion (pause + show poster). Bespoke CSS allowed but colors via tokens.
  - `LiveMenuDevice`: `client:visible` — the phone-frame live menu preview from `index.html` / `app/restaurant.html`. Port its bespoke markup/CSS; all colors/radii via theme tokens.
  - `ThemeBuilderPreview`: `client:visible` — the theme-builder preview from `app/theme.html` that drives the menu preview via **inline daisyUI vars** (`--color-primary`, `--radius-box`, `--radius-field`, font) on the preview root; `useState` for the controls. Port logic from `theme.html` inline script (lines ~837+).

- [ ] **Step 1: Write the three islands**, porting bespoke CSS into co-located `<style>` (Astro scoped) or inline style objects; verify **no hard-coded hex/oklch** — everything reads a token or an inline CSS var.

- [ ] **Step 2: Verify** each renders on a throwaway page at 390/768/1440, no console errors, motion respects reduced-motion. Commit `feat(design): VideoHero, LiveMenuDevice, ThemeBuilderPreview islands`.

---

# Phase 1 — Page fan-out (parallel; one subagent per task)

Each task follows the **Page Migration Recipe** above. Each ends with: `npm run build` clean, `node scripts/shot.mjs http://localhost:4321/<route> shots/<name>` showing `overflowPx<=0` and `consoleErrors=0` at all three widths, and a visual parity note vs. the source page.

### Task 12: `/` landing (`index.html`, BrandLayout, VideoHero — which nests LiveMenuDevice)
- [ ] Build `src/pages/index.astro` per recipe; compose `BrandLayout`, `<VideoHero client:visible />` (VideoHero already nests LiveMenuDevice per Task 11 — do NOT mount a separate `<LiveMenuDevice>`), and the landing sections (features, pricing, etc.) inline from `index.html`. Rewrite CTA links to `/app/signin`, `/app/dashboard`. NOTE (from Task 11): the interactive hero tab-morph/theme-bubble demo JS was NOT ported into the island — if the landing needs that page-level interactivity for fidelity, port it here as a small client component; otherwise the static hero is acceptable. Verify + commit `feat(design): migrate landing page`.

### Task 13: `/app/signin` (`app/signin.html`, BrandLayout)
- [ ] Build `src/pages/app/signin.astro`; compose `BrandLayout` + the auth card inline. Verify + commit `feat(design): migrate signin page`.

### Task 14: `/app/dashboard` (`app/dashboard.html`, AppShell)
- [ ] Build `src/pages/app/dashboard.astro`: `<AppShell crumb="My Restaurants">`, `<main>` with page header inline + `restaurants.map(r => <RestaurantCard r={r} />)` + `<EmptyState>` add-card + footer note. Verify + commit `feat(design): migrate dashboard page`.

### Task 15: `/app/restaurant` (`app/restaurant.html`, AppShell) — NO device
- [ ] Build `src/pages/app/restaurant.astro`: `<AppShell crumb="Saffron & Smoke" currentRestaurantId="saffron-smoke">`, `<SectionBar>` for the per-restaurant tabs, restaurant detail inline. NOTE (corrected at Task 11): `restaurant.html` has NO live-menu device — do NOT mount `<LiveMenuDevice>`. Port whatever the source actually contains. Also resolve two-level sidebar `aria-current` here (see ledger Task 9 note: restaurant = `location`, active SectionBar tab = `page`) — pass `currentRestaurantId` so the sidebar tints the restaurant. Verify + commit.

### Task 16: `/app/menu-editor` (`app/menu-editor.html`, AppShell) — includes the dish row (moved from Task 6)
- [ ] First extend `Dish` in `src/data/types.ts` with `availability: 'available' | 'soldout' | 'unavailable'`, and set each dish's value from its `data-status` in `menu-editor.html` (re-transcribe faithfully).
- [ ] Build the dish row as a co-located island `DishRow` (an `.astro` component with scoped `<style>`, or `.tsx` + a CSS module) that faithfully ports the `.item` row from `menu-editor.html` lines ~518–535 and its bespoke `<style>` rules (`.item`, `.grip`, `.thumb`, `.it-text`/`.it-name`/`.it-desc`, `.price`, `.seg`+`.sdot` availability radiogroup with the `data-val` color mapping, `.it-actions`/`.rbtn`), including the responsive reflow rules. The segmented control renders statically reflecting `d.availability` (prototype fidelity; live toggling not required).
- [ ] Build page: `<AppShell>` + `<SectionBar>` + `dishes.map(d => <DishRow d={d} />)` + editor panels inline. Verify + commit.

### Task 17: `/app/banners` (`app/banners.html`, AppShell)
- [ ] Build page: `<AppShell>` + `<SectionBar>` + banners grid inline. Verify + commit.

### Task 18: `/app/theme` (`app/theme.html`, AppShell, ThemeBuilderPreview)
- [ ] Build page: `<AppShell>` + `<SectionBar>` + `<ThemeBuilderPreview client:visible />`. Verify the preview live-updates via inline vars. Commit.

### Task 19: `/app/analytics` (`app/analytics.html`, AppShell)
- [ ] Build page: `<AppShell>` + `<SectionBar>` + stat tiles/charts inline (stat tiles stay inline unless uniform enough to warrant a local element). Verify + commit.

### Task 20: `/app/team` (`app/team.html`, AppShell)
- [ ] Build page: `<AppShell>` + `<SectionBar>` + `team.map(...)` roster (rows inline or a local `Member` element if repeated). Verify + commit.

### Task 21: `/app/qr` (`app/qr.html`, AppShell)
- [ ] Build page: `<AppShell>` + QR/publish panels inline. Verify + commit.

### Task 22: `/public` (`public/index.html`, PublicLayout — light theme)
- [ ] Build `src/pages/public/index.astro` with `PublicLayout` (`data-theme="menufic-public"`); port the diner menu markup inline. Confirm the light theme renders (NOT the dark system). Verify + commit.

### Task 23: `/admin/review` (`admin/review.html`, AdminLayout)
- [ ] Build `src/pages/admin/review.astro` with `AdminLayout` (no sidebar); port the review queue/table inline. Verify table scroller has no false overflow. Commit.

### Task 24: `/admin/restaurants` (`admin/restaurants.html`, AdminLayout)
- [ ] Build `src/pages/admin/restaurants.astro` with `AdminLayout`; port the restaurants table inline. Verify + commit.

---

# Phase 2 — Verify & swap

### Task 25: Full-surface parity + `/impeccable` pass

**Files:** none (verification only)

- [ ] **Step 1:** `cd design/astro && npm run build && npx astro check` — both clean.
- [ ] **Step 2:** `npm run dev &` then run `node scripts/shot.mjs` for all 13 routes into `shots/<route>/`; confirm every width reports `overflowPx<=0` and `consoleErrors=0`.
- [ ] **Step 3:** For each of the 4 surfaces (Brand, App, Public, Admin), run `/impeccable audit` and `/impeccable critique` on the representative page; fix any P0/P1 regressions vs. the source. Record a per-surface parity note (matches / intentional-diff / bug).
- [ ] **Step 4:** Commit any fixes `fix(design): parity fixes from impeccable audit`.

### Task 26: Retire `design/landing/` and update docs

**Files:**
- Delete: `design/landing/` (after parity sign-off)
- Modify: `design/package.json` (point scripts at Astro or remove the old `watch:css`), root `DESIGN.md` §7 note if it references the HTML prototype, and the `menufic-prototype` memory.

- [ ] **Step 1:** Confirm all 13 pages signed off in Task 25.
- [ ] **Step 2:** Remove `design/landing/`; update `design/package.json` scripts to delegate to `design/astro` (`"dev": "npm --prefix astro run dev"`, `"build": "npm --prefix astro run build"`).
- [ ] **Step 3:** Update the `menufic-prototype` memory file to describe the Astro app (routes, `astro dev` on :4321, component structure) instead of the static-HTML served-root setup.
- [ ] **Step 4:** Commit `chore(design): retire static HTML prototype, Astro is canonical`.

---

## Self-review notes

- **Spec coverage:** §3 hybrid → Tasks 1,9,10 (layouts) + all `.tsx`. §4 tiers/`app.css` trim → Task 2 (drop `@layer`) + Tasks 7,9 (compound→component) + Tasks 5,6. §5 interactivity → Tasks 4 (motion), 8 (account menu), 9 (drawer a11y), 11 (islands). §6 structure → Tasks 1–11. §7 data → Task 3. §8 islands → Task 11. §9 routing/clean URLs → recipe step 7 + all pages. §10 page map → Tasks 12–24. §9-verify → Task 25. §10-subagent sequencing → Phase 0 serial, Phase 1 parallel. §11 risks (islands early, token-check before fan-out) → Tasks 2 step 5, 11, 25.
- **Placeholder scan:** page tasks intentionally reference source-file line ranges rather than re-pasting thousands of lines of existing HTML — the existing markup is the source of truth per Global Constraints; this is the documented adaptation, not a placeholder.
- **Type consistency:** `Restaurant.status` union `'published'|'pending'|'draft'` is used identically in Task 3 (definition), Task 5 (`StatusBadge`), Task 6 (`RestaurantCard`). `owner` shape defined once in Task 3, consumed in Tasks 8, 9. Drawer id `app-drawer` consistent across Tasks 8, 9.
