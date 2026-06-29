# 2. Tailwind v4 + daisyUI v5 for the design prototype

Date: 2026-06-29
Status: Accepted

## Context

The `design/` prototype consisted of 13 HTML pages (`design/landing/`) with duplicated, hand-authored inline CSS for every component — colours, radii, shadows, and focus rings repeated verbatim across files. This made readability and maintenance fragile: a single design-token change required touching every page.

The Next.js / Mantine production application (`src/`) is a separate codebase with its own styling layer and is intentionally out of scope for this decision.

## Decision

Adopt **Tailwind CSS v4** and **daisyUI v5** for the `design/` prototype only.

`design/landing/assets/css/app.css` is the single source of truth. It defines two daisyUI themes — `menufic` (dark App/Brand surfaces) and `menufic-public` (diner-facing Public menu) — plus Tailwind `@theme` tokens for the Shadow Vocabulary and fonts, and a thin `@layer` for the handful of rules that cannot be expressed as theme variables.

Key decisions within this adoption:

**1. Semantic-slot mapping.** Brand tokens are mapped to daisyUI slots by intent, not by colour family:

- tomato → `primary` ("act": single CTA, live-status dot)
- saffron → `secondary` ("attention": badges, active tabs, prices) — deliberately *not* `accent`
- herb-green → `success` ("confirm": Published & live indicator)
- Leftover slots receive distinct on-brand shades: `accent` = saffron-deep; `warning` = saffron; `info` = cream-soft; `error` = danger-red `oklch(0.50 0.17 25)`

**2. Error-red as a functional state colour.** `error` uses `oklch(0.50 0.17 25)` — a hue (≈25°) deliberately distinct from tomato (hue 32°) so destructive-action feedback cannot be mistaken for a CTA. This colour is a functional state colour, not a brand accent; it does not violate or extend the Two-Accent Rule (see `DESIGN.md §7.7`).

**3. Component policy.** Markup stays semantic (`btn btn-primary`, `card`, `badge badge-secondary`). The three signature components (Live Menu device, Theme Builder preview, video hero) are custom-CSS islands that consume the same theme tokens directly.

**4. Public-menu runtime theming.** The `menufic-public` light theme is the diner-facing base. At runtime the Theme Builder writes daisyUI's own CSS variables (`--color-primary`, `--radius-box`, `--radius-field`, `font-family`) inline on the menu root element; presets are inline var bundles. No class swaps or additional stylesheets are required.

## Consequences

- **Single source of truth.** All design tokens for the `design/` prototype live in one file. A token change is one edit, reflected across all 13 pages on next build.
- **daisyUI defaults must be overridden.** Any daisyUI component used in markup must be verified against the `menufic` theme; daisyUI's own defaults (blue primary, purple secondary, etc.) will surface if a slot is added without a matching theme override.
- **The Next.js / Mantine app is untouched.** Brand and App surface design decisions continue to be expressed separately in the production codebase; this ADR has no effect on it.
- **Runtime theming contract is stable.** Owner customizations target only `--color-primary`, `--radius-box`, `--radius-field`, and `font-family`; Menufic's Brand and App surfaces are never affected by any owner-level change.

## Alternatives considered

- **Keep hand-authored CSS** — rejected: 13 files with duplicated token values; any design-token change required editing every page and was error-prone.
- **Tailwind v4 without daisyUI** — rejected: we would need to recreate a full component library (buttons, cards, badges, modals, drawers) from scratch, duplicating work daisyUI already provides.
- **Use daisyUI defaults without remapping** — rejected: daisyUI's default colour palette bears no relation to the Menufic brand system; accepting defaults would violate the Two-Accent Rule and undermine the dark cinematic system documented in ADR-0001.
- **Apply Tailwind/daisyUI to the Next.js app** — out of scope and deferred: the production app uses Mantine and has its own styling conventions; that change was explicitly not the goal of this work.
