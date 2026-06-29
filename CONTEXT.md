# Context

Glossary of canonical terms for Menufic V2. One name per concept; if you mean one of these, use this word.

## Surfaces

The product renders three visually distinct **surfaces**. Naming them precisely keeps "the theme" from meaning three different things.

- **Brand surface** — public marketing pages (the landing page). Dark, cinematic, food-video-led. Menufic's brand voice at full volume. Source of truth: `DESIGN.md` (derived from `design/landing/index.html`). See [ADR-0001](docs/adr/0001-dark-cinematic-design-system.md).
- **App surface** — the signed-in product owners use: restaurant list, menu editor, banners, theme customizer, analytics, team. Extends the Brand surface's design system (same tokens, fonts, accents). Where "dashboard" or "the editor" is meant, it's the App surface.
- **Public menu surface** — the published menu a diner sees at `menufic.com/r/{slug}`. Rendered with the **owner's custom theme**, NOT Menufic's palette. "Theme customization" always refers to this surface; it never restyles the App or Brand surfaces.

The internal **Admin portal** is intentionally outside this system — utilitarian, not brand-styled.

## Theme (disambiguation)

- **Design system** — Menufic's own visual language (Brand + App surfaces). Defined in `DESIGN.md`.
- **Restaurant theme** — an owner's per-restaurant customization (preset + font + primary colour + corner radius) applied only to their **Public menu surface**.

Say "design system" for Menufic's look; say "restaurant theme" for an owner's menu styling. They are different things and never overlap.
