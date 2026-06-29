# 1. Dark cinematic, landing-derived design system

Date: 2026-06-28
Status: Accepted

## Context

The original `docs/plans/2026-04-25-v2-ui-design-brief.md` specified a **light-mode** Menufic app with a **warm-paper background** and **DM Serif Display + DM Sans** typography.

During design exploration we found that direction read as the saturated 2026 "AI-slop" landing page (cream/paper bg + DM-serif + editorial restraint), which undercuts Menufic's promise to make a restaurant's menu look special. We explored several directions and converged on, refined, and shipped a **dark cinematic landing page** that the product owner reviewed and approved:

- Warm **dark cocoa** body surface (not paper/cream)
- **Saffron (gold)** and **tomato** accents, pulled from food imagery
- **Boska** (display) + **Supreme** (body) — both off the over-used font list
- A **looping food video** hero, sticky split-scroll, a live theme-builder, and a "Free. Forever." statement

This page now exists at `design/landing/index.html`, scored ~36/40 in an `/impeccable critique`, and is the most concrete, tested expression of the brand. The brief and the shipped design now contradict each other.

## Decision

Adopt the **dark cinematic system derived from the shipped landing page** as the canonical Menufic V2 design system. It supersedes the brief's light-mode / warm-paper / DM-fonts theme.

- `DESIGN.md` (generated via `/impeccable document` from `design/landing/index.html`) is the source of truth for colour, type, components, and motion.
- The brief's **Color Direction** and **Typography** sections are superseded; the brief is retained for product/IA content and annotated accordingly.
- The system distinguishes three **surfaces** (see `CONTEXT.md`): the **Brand surface** (marketing/landing — dark cinematic), the **App surface** (dashboard, menu editor, analytics, theme customizer — extends the dark system), and the **Public menu surface** (owner-themed, outside Menufic's palette). The **Admin portal** stays deliberately utilitarian.

## Consequences

- Future screens are designed in this dark system; shared accents (saffron/tomato) and fonts (Boska/Supreme) keep brand cohesion.
- **Open item:** validate dark-mode readability on *content-dense* App-surface screens (long menu-item lists, analytics tables) when we design them. The system already has layered `--surface` / `--surface-2` tokens; if density suffers, introduce a lighter elevated surface (or a scoped light mode) *within* the dark system rather than reverting wholesale.
- Public restaurant menus are unaffected — they render the owner's custom theme, not Menufic's.

## Alternatives considered

- **Keep the brief's light/paper/DM theme** — rejected: it's the AI-slop reflex we deliberately moved past, and the dark direction is already approved.
- **Dark brand + light app split** — deferred, not rejected: we may introduce a lighter App surface if dense screens prove hard to read in dark; this stays an extension of the one system, not a separate one.
