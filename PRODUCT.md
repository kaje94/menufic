# Product

## Register

brand

## Users

Restaurant owners and operators, spanning a wide range:

- **Independent cafe / family restaurant owners** — non-technical, time-poor, running a physical business. Proud of their place, intimidated by "tech."
- **Street-food stalls & food trucks** — scrappy, fast-moving, price-sensitive, need something they can set up in minutes from a phone.
- **Upscale bistros & fine dining** — design-conscious, brand-protective, will reject anything that looks templated or cheap.
- **Multi-branch operators** — want consistency and control across locations.

**Context when they hit the landing page:** evaluating "should I bother making a digital / QR menu, and can I trust a *free* tool to make my food look good?" Many were burned by clunky, ugly COVID-era QR-menu tools. They are not designers or developers. The decision is emotional (pride in their establishment, fear of complexity/cost) before it is rational.

**Job to be done:** make my menu look as good as the best restaurants', without tech skills, money, or time — and let me share it instantly via a link and QR code.

## Product Purpose

Menufic is a genuinely free digital menu generator (free for 3+ years, no paid tiers). Owners create a restaurant, build a themeable menu, and publish it at `menufic.com/r/{slug}`, shareable by link and QR. V2 adds team collaboration, analytics, theme customization, and an internal admin review system.

The landing page's job: convince a busy, skeptical restaurant owner — in one warm, food-forward, frictionless scroll — that Menufic will make *their* menu look beautiful, that it's truly free, and that they can start in minutes. Success = "Get Started" with Google.

## Brand Personality

**Three-word voice:** Crafted · Warm · Confident.

Elegant and trustworthy, but never cold or corporate. Menufic is the calm, capable partner that makes a small operator look premium. It is confident enough for fine dining and approachable enough for a street stall. Its own brand is restrained on purpose — it *supports* the restaurant's identity, never competes with it. The food is always the hero.

Emotional goals: pride, appetite, reassurance, ease.

## Anti-references

- **SaaS funnel landing pages** — hyperactive gradient blobs, the big-number hero-metric template, "trusted by 10,000 teams" logo walls. Menufic is not a B2B tool; it is a craft.
- **The 2026 AI-slop brand page** — cream/sand/paper body background, DM Serif Display / Fraunces headline, tiny tracked uppercase eyebrows over every section, editorial-magazine three-column restraint. This look now signals "AI made this," which directly undermines "we'll make *your* menu look special."
- **Cheap QR-menu tools** — the clunky, ad-laden, slow PDF-in-a-frame experiences owners already resent.
- **Generic website-builder templates** (Wix-restaurant aesthetic) — interchangeable, soulless, obviously off-the-shelf.

## Design Principles

1. **The food is the hero.** Menufic's own visual brand supports and frames the restaurant's content; it never out-shouts the food.
2. **Premium for fine dining, frictionless for a food truck — on one page.** Every choice must read as both high-craft and unintimidating.
3. **Show the product working.** Tangible proof — a live, themed demo menu, a genuinely scannable QR — beats adjectives and feature lists.
4. **"Free forever" is confident generosity, not an apology.** State it plainly and proudly; make it feel credible, never too-good-to-be-true.
5. **Distinctive over safe.** Reach past the restaurant-category reflex (terracotta + serif + paper). A templated landing page silently contradicts the promise that Menufic will make a menu feel special. Warmth comes from imagery, color, and type — not from a beige background.

## Accessibility & Inclusion

- Target **WCAG 2.1 AA**. Verify body text ≥4.5:1 and large text ≥3:1 against its actual background — especially critical on saturated/drenched colored surfaces.
- Honor `prefers-reduced-motion` for every animation (the page is motion-rich by design): crossfade or instant alternatives, never gating content visibility on a transition.
- Full keyboard paths and visible focus states; touch targets ≥44px (owners often evaluate on a phone).
- Image alt text written as brand voice, not "image of food."
- Menufic's Brand and App surfaces use the **dark cinematic design system** (see `DESIGN.md` and [ADR-0001](docs/adr/0001-dark-cinematic-design-system.md)) — this supersedes the original brief's light-mode/paper mandate. Public restaurant menus render the owner's custom theme, not Menufic's palette. Verify dark-surface contrast meets AA, especially on content-dense App screens.
