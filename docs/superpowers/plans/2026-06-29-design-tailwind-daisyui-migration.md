# Design Prototype → Tailwind v4 + daisyUI v5 Migration Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the hand-written, per-page inline CSS across the 13-page `design/landing` static prototype with a single Tailwind v4 + daisyUI v5 build, themed to match `DESIGN.md`, so the prototype becomes readable, maintainable, and on-system.

**Architecture:** Introduce a self-contained build under `design/` (its own `package.json`, isolated from the Next/Mantine app) that compiles **one** shared stylesheet from a single CSS input. The design tokens in `DESIGN.md` become the canonical source for a daisyUI **`menufic`** dark theme (Brand + App + Admin surfaces) and a **`menufic-public`** light theme (the diner-facing Public menu). Component look lives in **one place** — daisyUI theme variables plus a thin custom `@layer components` — so markup is semantic (`btn btn-primary`, `card`, `badge badge-secondary`). The Public menu's live owner-customization keeps working by writing **daisyUI's own variables inline** on the menu root at runtime. The 3 signature components (Live Menu device, Theme Builder, video hero) stay as custom-CSS islands that consume the theme tokens. Pages migrate incrementally — old inline-CSS pages and new daisyUI pages coexist safely because Tailwind scans both.

**Tech Stack:** Tailwind CSS v4, daisyUI v5, Node (npm) for the build, existing static file server on `:8765` + `live.js` reload. No framework — semantic HTML + vanilla JS (unchanged behavior).

## Global Constraints

- **Versions:** Tailwind CSS **v4.x**, daisyUI **v5.x** (daisyUI v5 requires Tailwind v4; both are oklch-native). Pin majors in `design/package.json`.
- **Isolation:** All new tooling lives under `design/`. Do **not** add Tailwind/daisyUI to the root `package.json` or touch the Mantine app.
- **One stylesheet:** Exactly one compiled output, `design/landing/assets/css/styles.css`, linked by every migrated page. No per-page `<style>` blocks survive on a migrated page except the documented signature-component islands.
- **Token source of truth:** `DESIGN.md` frontmatter. Theme values in code must equal the frontmatter values (oklch forms). Do not invent colours.
- **Two-Accent Rule (amended):** tomato = `primary` (act), saffron = `secondary` (attention), herb-green = `success` (confirm). Extra daisyUI slots use **distinct on-brand shades**: `accent` = saffron-deep, `warning` = saffron, `error` = a dedicated danger-red distinct from tomato, `info` = cream-soft. The danger-red is a **functional state colour**, not a 4th brand accent — document the carve-out.
- **Named rules are hard constraints:** Warm-Light (no cream/paper body), Rim-Light, Tonal-First, the font bans (no DM Serif/Sans, Fraunces, Playfair, Cormorant, Inter), no gradient text, no glassmorphism, no `01/02/03` markers except the one How-it-works sequence. Verify every migrated page against `DESIGN.md` §6.
- **Fidelity bar:** On-spec / visually equivalent at **390 / 768 / 1440** — same layout, palette, type, signature components, named rules intact. Minor sub-pixel/spacing differences from daisyUI defaults are acceptable. Not pixel-identical to the old CSS.
- **Accessibility:** Preserve the global 3px saffron `:focus-visible` ring (3px offset), body text ≥4.5:1, large/bold ≥3:1 on actual surface, `prefers-reduced-motion` off-switches retained.
- **Behavior parity:** All existing vanilla JS (nav-on-scroll, mobile nav, tabs, theme builder, carousels, reveal-on-scroll) must keep working. When class names change, rewire the JS selectors in the same task.
- **Per-page verification (the "test" for this plan):** Each page task is "done" only after (1) `styles.css` builds clean, (2) the page renders with **no console errors** and **no horizontal overflow** at 390/768/1440, (3) an impeccable `critique` pass finds no named-rule violations, (4) it is visually equivalent to the pre-migration page. Capture screenshots.

---

## File Structure

**New files:**
- `design/package.json` — isolated build (devDeps: tailwindcss v4, @tailwindcss/cli, daisyui v5; scripts: `build:css`, `watch:css`).
- `design/.gitignore` — ignore `node_modules/`.
- `design/landing/assets/css/app.css` — the **input** CSS: `@import "tailwindcss"`, `@plugin "daisyui"`, the two `@plugin "daisyui/theme"` blocks, `@theme` (fonts + shadow/radius tokens), and the custom `@layer components`.
- `design/landing/assets/css/styles.css` — the **compiled output** (git-ignored or committed; see Task 1). Linked by every page.
- `docs/adr/0002-tailwind-daisyui-for-design-prototype.md` — records the daisyUI adoption + semantic-slot mapping decision.

**Modified files:**
- `DESIGN.md` — keep all prose/named rules; make frontmatter canonical; add **§7 Implementation (Tailwind v4 + daisyUI v5)**; amend colours for `error` (danger-red) + Two-Accent carve-out.
- `CONTEXT.md` — add one glossary line distinguishing **brand accent** vs **functional state colour** (only if it reads as a new canonical term; keep glossary-only).
- All 13 `design/landing/**/*.html` — strip inline `<style>`, link `styles.css`, rewrite markup to daisyUI/Tailwind, rewire JS selectors.
- `.claude/agents/ui-designer.md` — add the scoped Tailwind+daisyUI rule (Task 18).

**Page inventory (migration order, with line counts for sizing):**
1. Pilot: `app/dashboard.html` (607) — canonical app shell
2. App: `app/signin.html` (221), `app/qr.html` (580), `app/restaurant.html` (669), `app/banners.html` (852), `app/analytics.html` (876), `app/team.html` (971), `app/theme.html` (1021), `app/menu-editor.html` (1112)
3. Admin: `admin/restaurants.html` (548), `admin/review.html` (563)
4. Brand: `index.html` (1850)
5. Public: `public/index.html` (681)

---

## The Canonical Page-Migration Procedure (referenced by every page task)

Every page task (Tasks 4–17) follows this exact procedure. Page-specific notes in each task say *which* signature components are islands and *which* JS selectors to rewire. Do not skip steps.

1. **Read the whole page** end-to-end. Inventory: (a) the `<style>` block, (b) repeated chrome (nav, footer, buttons, cards), (c) signature/bespoke components, (d) every JS selector that targets a class/id you may rename.
2. **Confirm the head links.** Ensure the page links the compiled sheet and keeps the Fontshare font links and `live.js`:
   ```html
   <link rel="stylesheet" href="/assets/css/styles.css">
   ```
   Set the theme on `<html>`: `data-theme="menufic"` for Brand/App/Admin; `data-theme="menufic-public"` for the Public menu.
3. **Map components to the shared vocabulary** (DESIGN.md §7 / Task 3): standard UI → daisyUI classes (`btn btn-primary`, `card bg-base-200`, `badge badge-secondary`, `input`, `select`, `tabs`, `table`, `stat`, `drawer`, `modal`, `menu`); layout/spacing → Tailwind utilities; anything the vars+layer can't express → reuse a custom-layer class (add to the layer, don't inline per element).
4. **Keep signature components as islands.** Leave the bespoke component's CSS in a small scoped `<style>` block (or move shared ones into `app.css` if reused), but replace hard-coded colours/radii/shadows with the theme tokens (`var(--color-secondary)`, `var(--radius-box)`, `var(--shadow-floating)`, etc.).
5. **Delete the rest of the `<style>` block.** Everything now covered by daisyUI + utilities + custom layer goes.
6. **Rewire JS.** Update any `querySelector`/`getElementById`/`classList` calls whose targets you renamed. Behavior must be identical.
7. **Build:** `cd design && npm run build:css`. Must exit 0.
8. **Verify in browser** at 390/768/1440 (serve on :8765): no console errors, no horizontal overflow, focus ring present, images/video load, contrast holds. Capture screenshots.
9. **Impeccable `critique`** against DESIGN.md §6 named rules. Fix any violation before sign-off.
10. **Commit** the page + any additions to `app.css`.

---

## Task 1: Build scaffold (isolated `design/` package + empty compile)

**Files:**
- Create: `design/package.json`, `design/.gitignore`, `design/landing/assets/css/app.css`
- Produces: `design/landing/assets/css/styles.css` (compiled)

**Interfaces:**
- Produces: `npm run build:css` (one-shot compile) and `npm run watch:css` (watch) from inside `design/`. Output path `design/landing/assets/css/styles.css`. Input path `design/landing/assets/css/app.css`.

- [ ] **Step 1: Create `design/.gitignore`**

```
node_modules/
```

- [ ] **Step 2: Create `design/package.json`**

```json
{
  "name": "menufic-design-prototype",
  "private": true,
  "version": "0.0.0",
  "scripts": {
    "build:css": "tailwindcss -i ./landing/assets/css/app.css -o ./landing/assets/css/styles.css --minify",
    "watch:css": "tailwindcss -i ./landing/assets/css/app.css -o ./landing/assets/css/styles.css --watch"
  },
  "devDependencies": {
    "@tailwindcss/cli": "^4.0.0",
    "daisyui": "^5.0.0",
    "tailwindcss": "^4.0.0"
  }
}
```

- [ ] **Step 3: Create a minimal `design/landing/assets/css/app.css`** (theme blocks come in Tasks 2–3; start minimal to prove the toolchain)

```css
@import "tailwindcss";
@source "../../**/*.html";
@plugin "daisyui";
```

- [ ] **Step 4: Install and build**

Run: `cd design && npm install && npm run build:css`
Expected: exits 0; `design/landing/assets/css/styles.css` is created and non-empty.

- [ ] **Step 5: Decide commit policy for `styles.css`**

Commit the compiled `styles.css` (so the prototype renders without a build for casual viewers). Confirm it is **not** matched by `design/.gitignore`.

- [ ] **Step 6: Commit**

```bash
git add design/package.json design/.gitignore design/landing/assets/css/app.css design/landing/assets/css/styles.css
git commit -m "build: add isolated Tailwind v4 + daisyUI v5 build for design prototype"
```

---

## Task 2: The `menufic` dark theme + `menufic-public` light theme + token layer

**Files:**
- Modify: `design/landing/assets/css/app.css`

**Interfaces:**
- Produces: daisyUI theme `menufic` (default, dark) and `menufic-public` (light); Tailwind `@theme` tokens `--font-display`, `--font-body`, `--radius-pill`, `--shadow-accent-glow`, `--shadow-accent-glow-hover`, `--shadow-floating`, `--shadow-nav`. Consumed by Task 3's custom layer and every page.

- [ ] **Step 1: Replace `app.css` body with the theme definitions**

```css
@import "tailwindcss";
@source "../../**/*.html";
@plugin "daisyui";

/* ---- menufic (Brand + App + Admin): warm cocoa dark ---- */
@plugin "daisyui/theme" {
  name: "menufic";
  default: true;
  prefersdark: true;
  color-scheme: dark;

  --color-base-100: oklch(0.18 0.03 45);    /* cocoa-bg */
  --color-base-200: oklch(0.235 0.034 46);  /* surface */
  --color-base-300: oklch(0.295 0.04 48);   /* surface-2 */
  --color-base-content: oklch(0.96 0.015 78); /* cream */

  --color-primary: oklch(0.56 0.19 32);     /* tomato — ACT */
  --color-primary-content: oklch(1 0 0);    /* white */
  --color-secondary: oklch(0.785 0.14 68);  /* saffron — ATTENTION */
  --color-secondary-content: oklch(0.155 0.026 52); /* cocoa-deep */
  --color-accent: oklch(0.72 0.14 70);      /* saffron-deep */
  --color-accent-content: oklch(0.155 0.026 52);
  --color-neutral: oklch(0.295 0.04 48);    /* surface-2 */
  --color-neutral-content: oklch(0.96 0.015 78);

  --color-info: oklch(0.83 0.022 78);       /* cream-soft */
  --color-info-content: oklch(0.155 0.026 52);
  --color-success: oklch(0.72 0.15 150);    /* herb-green — CONFIRM */
  --color-success-content: oklch(0.155 0.026 52);
  --color-warning: oklch(0.785 0.14 68);    /* saffron */
  --color-warning-content: oklch(0.155 0.026 52);
  --color-error: oklch(0.50 0.17 25);       /* danger-red (functional state, NOT tomato) */
  --color-error-content: oklch(0.96 0.015 78);

  --radius-selector: 999px;  /* pills: badges, chips */
  --radius-field: 12px;      /* inputs/selects (DESIGN.md sm) */
  --radius-box: 24px;        /* cards/panels (DESIGN.md lg) */
  --border: 1px;
  --depth: 0;
  --noise: 0;
}

/* ---- menufic-public (diner Public menu): owner's LIGHT default ----
   Runtime: theme builder overrides --color-primary / --radius-box /
   --radius-field / font-family INLINE on the menu root. */
@plugin "daisyui/theme" {
  name: "menufic-public";
  color-scheme: light;

  --color-base-100: oklch(0.97 0.01 78);    /* warm light bg (NOT pure white) */
  --color-base-200: oklch(0.94 0.012 78);
  --color-base-300: oklch(0.90 0.014 78);
  --color-base-content: oklch(0.25 0.02 40);

  --color-primary: oklch(0.55 0.16 35);     /* terracotta default; owner-overridable */
  --color-primary-content: oklch(0.98 0.01 78);
  --color-secondary: oklch(0.72 0.14 70);
  --color-secondary-content: oklch(0.20 0.02 40);
  --color-success: oklch(0.62 0.15 150);
  --color-success-content: oklch(0.98 0.01 78);

  --radius-selector: 999px;
  --radius-field: 12px;
  --radius-box: 18px;
  --border: 1px;
  --depth: 0;
  --noise: 0;
}

/* ---- Tailwind tokens (fonts, pill radius, the Shadow Vocabulary) ---- */
@theme {
  --font-display: "Boska", Georgia, serif;
  --font-body: "Supreme", system-ui, sans-serif;
  --radius-pill: 999px;
  --shadow-accent-glow: 0 10px 30px -10px oklch(0.56 0.19 32 / 0.7);
  --shadow-accent-glow-hover: 0 16px 40px -12px oklch(0.56 0.19 32 / 0.8);
  --shadow-floating: 0 18px 40px -22px oklch(0 0 0 / 0.8);
  --shadow-nav: 0 8px 30px -18px oklch(0 0 0 / 0.8);
}
```

- [ ] **Step 2: Build and confirm both themes compile**

Run: `cd design && npm run build:css`
Expected: exits 0; grep the output proves both themes emitted:
`grep -c 'menufic-public' landing/assets/css/styles.css` → ≥1, and `grep -c "theme=\"menufic\"\|--color-primary" landing/assets/css/styles.css` → ≥1.

- [ ] **Step 3: Commit**

```bash
git add design/landing/assets/css/app.css design/landing/assets/css/styles.css
git commit -m "feat: define menufic dark + menufic-public light daisyUI themes from DESIGN.md tokens"
```

---

## Task 3: Custom `@layer components` (what theme vars can't express)

**Files:**
- Modify: `design/landing/assets/css/app.css`

**Interfaces:**
- Produces semantic classes used by all pages: pill `.btn` (48px, accent-glow, hover lift), `.btn-ghost` shape, global `:focus-visible` saffron ring, `.input`/`.select` 48px height, helper shadow utilities (`.shadow-floating`, `.shadow-nav`), measure cap + `text-wrap` helpers.

- [ ] **Step 1: Append the custom layer to `app.css`**

```css
@layer components {
  /* Buttons: pill + tactile lift (DESIGN.md §5 Buttons) */
  .btn {
    border-radius: var(--radius-pill);
    min-height: 48px;
    height: 48px;
    padding-inline: 24px;
    font-family: var(--font-body);
    font-weight: 600;
    transition: all 300ms cubic-bezier(0.16, 1, 0.3, 1);
  }
  .btn:hover { transform: translateY(-2px); }
  .btn-primary { box-shadow: var(--shadow-accent-glow); }
  .btn-primary:hover { box-shadow: var(--shadow-accent-glow-hover); }

  /* Ghost: transparent, 1px line border, cream text, warm fill on hover */
  .btn-ghost {
    background: transparent;
    color: var(--color-base-content);
    border: 1px solid color-mix(in oklch, var(--color-base-content) 22%, transparent);
  }
  .btn-ghost:hover { background: var(--color-base-200); }

  /* Inputs/selects: 48px shell (DESIGN.md §5 Inputs) */
  .input, .select { height: 48px; }

  /* Cards float only on lift (Tonal-First) */
  .card { transition: box-shadow 300ms cubic-bezier(0.16, 1, 0.3, 1); }
}

@layer utilities {
  .shadow-floating { box-shadow: var(--shadow-floating); }
  .shadow-nav { box-shadow: var(--shadow-nav); }
  .measure { max-width: 70ch; }       /* body 65–75ch */
  .text-balance { text-wrap: balance; }
  .text-pretty { text-wrap: pretty; }
}

@layer base {
  /* Global saffron focus ring — never removed (DESIGN.md §5) */
  :focus-visible {
    outline: 3px solid var(--color-secondary);
    outline-offset: 3px;
    border-radius: 6px;
  }
  /* Display headings default to Boska; body to Supreme */
  body { font-family: var(--font-body); }
  h1, h2, h3, h4 { font-family: var(--font-display); text-wrap: balance; }
}
```

- [ ] **Step 2: Build**

Run: `cd design && npm run build:css`
Expected: exits 0; `grep -c 'radius-pill\|translateY' landing/assets/css/styles.css` → ≥1.

- [ ] **Step 3: Commit**

```bash
git add design/landing/assets/css/app.css design/landing/assets/css/styles.css
git commit -m "feat: add custom component/utility/base layer for on-spec daisyUI components"
```

---

## Task 3b: DESIGN.md §7 + ADR-0002 + CONTEXT.md touch

**Files:**
- Modify: `DESIGN.md`, `CONTEXT.md`
- Create: `docs/adr/0002-tailwind-daisyui-for-design-prototype.md`

- [ ] **Step 1: Amend DESIGN.md frontmatter colours** — add the danger-red and mark canonicality:

```yaml
  error-red: "oklch(0.50 0.17 25)"  # danger/destructive state — distinct from tomato; NOT a brand accent
```

- [ ] **Step 2: Append DESIGN.md §7 Implementation** — include verbatim: the semantic-slot mapping table (base/primary/secondary/accent/neutral/info/success/warning/error → tokens + content), the theme-var encodings (`--radius-box/field/selector`, border, depth, noise), the Shadow Vocabulary as `@theme` tokens, the custom `@layer` inventory, and a component→class map (Primary CTA → `btn btn-primary`; Ghost → `btn btn-ghost`; Badge/active tab → `badge badge-secondary`; Card → `card bg-base-200`; nested card → `bg-base-300`; Input → `input`; Select → `select`; Tabs → `tabs`; Table → `table`; Stat → `stat`; Drawer → `drawer`; Modal → `modal`). Add a one-paragraph **Two-Accent carve-out**: brand accents are tomato/saffron/green; `error` is a functional state colour, not a 4th accent.

- [ ] **Step 3: Add one CONTEXT.md glossary line** (only if it reads as canonical) distinguishing **brand accent** (tomato/saffron/green, governed by the Two-Accent Rule) from **functional state colour** (info/success/warning/error daisyUI slots). Keep CONTEXT.md glossary-only — no implementation detail.

- [ ] **Step 4: Write ADR-0002** (use the repo's ADR-0001 as format reference): Context (prototype was 13 files of duplicated inline CSS; goal readability/maintainability), Decision (adopt Tailwind v4 + daisyUI v5 for the `design/` prototype only; the semantic-slot mapping incl. saffron-as-`secondary` and the new danger-red `error`; runtime owner theming via inline daisyUI vars on the Public menu), Alternatives (keep hand CSS; Tailwind-only; daisyUI defaults unmapped), Consequences (single source of truth; daisyUI defaults must be overridden to stay on-spec; Mantine app intentionally untouched).

- [ ] **Step 5: Commit**

```bash
git add DESIGN.md CONTEXT.md docs/adr/0002-tailwind-daisyui-for-design-prototype.md
git commit -m "docs: add DESIGN.md §7 implementation, ADR-0002, error-red amendment"
```

---

## Task 4: PILOT — migrate `app/dashboard.html` (locks the shared vocabulary)

**Files:**
- Modify: `design/landing/app/dashboard.html`
- Possibly modify: `design/landing/assets/css/app.css` (promote shared chrome — app nav/sidebar/footer — into the custom layer so the other 8 App pages reuse it)

**Interfaces:**
- Produces: the canonical **app shell** (top nav, account menu, mobile drawer, sidebar, footer) as reusable daisyUI markup + any shared classes added to `app.css`. Tasks 5–12 consume this shell verbatim.

- [ ] **Step 1–10:** Execute the **Canonical Page-Migration Procedure** above. Page-specific notes:
  - This is the app shell — extract nav/drawer/sidebar/footer into clean daisyUI patterns (`navbar`, `drawer`, `menu`, `dropdown`) and, where a pattern repeats across App pages, add a custom-layer class in `app.css` rather than leaving it page-local.
  - Set `<html data-theme="menufic">`.
  - JS to rewire: mobile-nav burger/scrim toggle, account dropdown open/close, keydown-escape handler (see `dashboard.html` ~lines 850–875 region in sibling pages). Behavior identical.
  - No signature islands here (dashboard is standard product UI) — this page should end up ~entirely daisyUI + utilities.
- [ ] **Step 11: Verify** at 390/768/1440 (procedure step 8) + impeccable `critique`.
- [ ] **Step 12: Commit**

```bash
git add design/landing/app/dashboard.html design/landing/assets/css/app.css design/landing/assets/css/styles.css
git commit -m "refactor(design): migrate dashboard to Tailwind+daisyUI; establish app shell"
```

> **Gate:** Do not start Task 5 until the pilot is signed off. The app shell + custom-layer additions are now frozen vocabulary for Tasks 5–12.

---

## Tasks 5–12: Migrate the remaining 8 App pages

Each task = the **Canonical Page-Migration Procedure** + reuse the frozen app shell from Task 4. Set `data-theme="menufic"`. Per-page signature islands and JS noted below. Each ends with browser verification (390/768/1440) + impeccable `critique` + a commit `refactor(design): migrate <page> to Tailwind+daisyUI`.

- [ ] **Task 5: `app/signin.html`** (221) — smallest; mostly `card` + `input` + `btn`. Island: none. JS: OAuth button handlers (no selector renames likely).
- [ ] **Task 6: `app/qr.html`** (580) — `card`, `btn`, QR image. Island: QR preview styling if bespoke. JS: download/copy handlers.
- [ ] **Task 7: `app/restaurant.html`** (669) — detail view; `card`, `tabs`, `badge`. JS: tab switching → `tabs` pattern.
- [ ] **Task 8: `app/banners.html`** (852) — banner list/upload; `card`, dropzone styling. Island: any carousel/preview. JS: reorder/upload, carousel.
- [ ] **Task 9: `app/analytics.html`** (876) — `stat`, `card`, charts. Island: chart/graph CSS (consume tokens). JS: chart rendering, range toggles.
- [ ] **Task 10: `app/team.html`** (971) — `table`, `badge`, `modal` (invite). JS: modal open/close, role menus.
- [ ] **Task 11: `app/theme.html`** (1021) — **the Theme Builder app-side controls**. This is the App-surface chrome around the builder; the *live preview device* is a signature island (see Task 13's note — the builder JS that sets vars is the same family). Migrate chrome to daisyUI (`range`, `select`, swatches as `btn`); keep the preview device as an island. JS: `applyPrimary`/`applyRadius`/`applyFont`/preset handlers — **rewire to write daisyUI vars** if this page previews via the public theme (coordinate with Task 17). Verify the live customizer still updates instantly.
- [ ] **Task 12: `app/menu-editor.html`** (1112) — largest App page; drag-reorder rows, `card`, `input`, `modal`. Island: the editable menu preview. JS: drag-and-drop, add/remove rows, inline edit.

---

## Tasks 13–14: Migrate the 2 Admin pages

Utilitarian by design (CONTEXT.md: intentionally outside the brand system) — these map cleanly to near-default daisyUI. Set `data-theme="menufic"` (still dark chrome, just plainer). Procedure as above.

- [ ] **Task 13: `admin/restaurants.html`** (548) — `table`, `badge`, `input` (search/filter), pagination. JS: filter/sort.
- [ ] **Task 14: `admin/review.html`** (563) — review queue; `card`, `btn` (approve/reject → `btn-success`/`btn-error`), `badge`. JS: approve/reject actions.

---

## Task 15: Migrate `index.html` (Brand landing — heaviest, most bespoke)

**Files:**
- Modify: `design/landing/index.html`
- Possibly modify: `design/landing/assets/css/app.css` (move genuinely shared marketing chrome into the layer; keep one-off animations page-local)

- [ ] **Steps:** Canonical procedure, with emphasis on islands. Set `data-theme="menufic"`. Signature islands to **keep as scoped custom CSS** (consuming tokens, not hard-coded values):
  - **The video hero** — `<video>` + warm scrim + poster fallback + `prefers-reduced-motion` off-switch.
  - **The Live Menu device** — phone frame, saffron rim-light (`var(--color-secondary)`), `var(--shadow-floating)`, parallax.
  - Reveal-on-scroll `IntersectionObserver` animations (see ~line 1554 region) — keep JS; classes may move to utilities.
  - Standard sections (nav, feature cards, How-it-works steps, footer, CTA buttons) → daisyUI + utilities. Preserve the **One Sequence Rule** (the `01·02·03` markers belong ONLY to How-it-works).
- [ ] **Verify** (390/768/1440) + impeccable `critique` — this page is the design system's showcase; named-rule compliance is strictest here.
- [ ] **Commit** `refactor(design): migrate Brand landing to Tailwind+daisyUI; signature components as token-driven islands`.

---

## Task 16: Migrate `public/index.html` (Public menu — light base, default look)

**Files:**
- Modify: `design/landing/public/index.html`

- [ ] **Steps:** Canonical procedure. Set `<html data-theme="menufic-public">` (LIGHT base — never the dark `menufic`). Map the diner UI (search, category tabs, dish rows, banners) to daisyUI (`input`, `tabs`, `card`, `badge`) themed by `menufic-public`. Islands: the **banner carousel transform** and any parallax stay custom CSS. Replace the bespoke `--bg/--ink/--terracotta/--surface` palette with the `menufic-public` daisyUI variables so components inherit the theme. Do **not** wire runtime overrides yet (that's Task 17) — this task delivers the correct *default* light look.
- [ ] **Verify** (390/768/1440) + impeccable `critique` (Warm-Light still applies in spirit: owner's light theme is warm, not flat white).
- [ ] **Commit** `refactor(design): migrate Public menu to menufic-public light theme`.

---

## Task 17: Wire the Theme Builder to override daisyUI vars at runtime

**Files:**
- Modify: `design/landing/app/theme.html` (the builder JS) and/or `design/landing/public/index.html` (if the preview lives there)

**Interfaces:**
- Consumes: `menufic-public` theme (Task 16) and the builder controls (Task 11).
- Produces: live owner customization by writing **daisyUI's own variables inline** on the menu-preview root.

- [ ] **Step 1: Repoint the builder setters** from bespoke `--p-*` names to daisyUI variable names on the preview root element:

```js
// colour picker
menuRoot.style.setProperty("--color-primary", hex);
// radius slider
menuRoot.style.setProperty("--radius-box", px + "px");
menuRoot.style.setProperty("--radius-field", px + "px");
// font selector
menuRoot.style.fontFamily = ownerFont;
```

- [ ] **Step 2: Presets as inline var bundles** — each light/dark preset is a small JS object of daisyUI base vars written inline on the menu root:

```js
function applyPreset(p) {
  menuRoot.style.setProperty("--color-base-100", p.bg);
  menuRoot.style.setProperty("--color-base-200", p.surface);
  menuRoot.style.setProperty("--color-base-300", p.surface2);
  menuRoot.style.setProperty("--color-base-content", p.text);
}
```

- [ ] **Step 3: Delete the now-dead `--p-*` indirection** and any CSS that read `var(--p-*)`.
- [ ] **Step 4: Verify the live customizer** — picking a colour, dragging radius, changing font, and toggling presets all restyle the daisyUI preview **instantly**, at 390/768/1440, no console errors. Confirm the colour picker's hex is accepted by the `--color-primary` var (daisyUI v5 accepts standard CSS colours; if any component mis-renders, convert hex→oklch in JS before setting).
- [ ] **Step 5: Commit** `feat(design): drive Public menu live theming via inline daisyUI vars`.

---

## Task 18: Update `ui-designer.md` to enforce Tailwind + daisyUI in `design/`

**Files:**
- Modify: `.claude/agents/ui-designer.md`

- [ ] **Step 1: Add a scoped hard rule** (new subsection under "How you work" or alongside the impeccable rule):

> **In the `design/` prototype (Brand / App / Public menu / Admin surfaces), ALWAYS build UI with Tailwind v4 + daisyUI v5 per `DESIGN.md` §7** — semantic daisyUI classes + theme variables + the custom `@layer` in `design/landing/assets/css/app.css`. Never add per-page `<style>` blocks or bespoke CSS except the documented signature-component islands (Live Menu device, Theme Builder preview, video hero), which still consume the theme tokens. Run `npm run watch:css` in `design/` while iterating. Outside `design/` (the Next/Mantine app), keep matching the existing stack.

- [ ] **Step 2: Update the existing stack line** — the agent's "do not introduce a new stack" guidance now explicitly excepts `design/`, which is Tailwind+daisyUI.
- [ ] **Step 3: Keep** the impeccable + browser-verification requirements intact (already present).
- [ ] **Step 4: Commit** `chore(agent): require Tailwind+daisyUI for design/ surfaces in ui-designer`.

---

## Self-Review

**Spec coverage:** All 4 surfaces (Tasks 4–16), runtime Public theming (17), build (1), themes (2), custom layer (3), DESIGN.md §7 + ADR + CONTEXT (3b), ui-designer update (18). ✅ Every grilled decision has a task.

**Decisions locked from grilling:** scope = all 13 pages ✅ (Tasks 4–16); Public theming = daisyUI base + inline-var overrides ✅ (16,17); presets = inline var bundle ✅ (17 step 2); build = self-contained `design/package.json` ✅ (1); semantic mapping = distinct on-brand shades + new error-red ✅ (2, 3b); component policy = tiered vars + daisyUI + custom layer ✅ (2,3); fidelity = on-spec/equivalent ✅ (global constraint + per-page verify); DESIGN.md = intent kept + §7 added + ADR-0002 ✅ (3b); sequencing = dashboard→App→Admin→Brand→Public ✅ (4–16); ui-designer scope = design/ only ✅ (18).

**Placeholder scan:** Per-page tasks (5–16) reference the Canonical Page-Migration Procedure rather than re-listing it — this is a single shared procedure block with concrete steps, not a "similar to Task N" placeholder. Page-specific islands/JS are named per task. Foundation tasks (1–3) carry complete code. ⚠️ Exact final markup per page is intentionally not pre-written: it requires reading each 200–1850-line file during execution, and the conversion is deterministic given the frozen vocabulary. This is the correct granularity for a CSS/markup migration.

**Consistency:** Theme name `menufic` / `menufic-public`, variable names (`--color-primary`, `--radius-box`, `--radius-field`, `--shadow-floating`), and class vocabulary are used identically across Tasks 2, 3, 16, 17, 18. ✅
