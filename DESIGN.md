---
name: Menufic
description: A genuinely free digital menu generator that makes any restaurant's menu look its best.
colors:
  cocoa-bg: "#1c0d06"        # oklch(0.18 0.03 45) — canonical
  cocoa-deep: "#150903"      # oklch(0.155 0.026 52)
  surface: "#2b1910"         # oklch(0.235 0.034 46)
  surface-2: "#3d261b"       # oklch(0.295 0.04 48)
  saffron: "#f3a64a"         # oklch(0.785 0.14 68)
  saffron-deep: "#dc932e"    # oklch(0.72 0.14 70)
  tomato: "#cc361e"          # oklch(0.56 0.19 32)
  tomato-bright: "#f05940"   # oklch(0.66 0.19 32)
  herb-green: "#53be70"      # oklch(0.72 0.15 150)
  cream: "#f7f1e7"           # oklch(0.96 0.015 78)
  cream-soft: "#cfc6b8"      # oklch(0.83 0.022 78)
  line: "#5b483f"            # oklch(0.42 0.03 48 / 0.5) — used at ~50% alpha
  error-red: "oklch(0.50 0.17 25)"  # danger/destructive state — distinct from tomato; NOT a brand accent
typography:
  display:
    fontFamily: "Boska, Georgia, serif"
    fontSize: "clamp(2.6rem, 6.2vw, 6rem)"
    fontWeight: 700
    lineHeight: 1.02
    letterSpacing: "-0.03em"
  statement:
    fontFamily: "Boska, Georgia, serif"
    fontSize: "clamp(4rem, 15vw, 9.5rem)"
    fontWeight: 700
    lineHeight: 0.95
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Boska, Georgia, serif"
    fontSize: "clamp(2rem, 4.6vw, 3.4rem)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Boska, Georgia, serif"
    fontSize: "1.3rem"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Supreme, system-ui, sans-serif"
    fontSize: "clamp(1.05rem, 1.6vw, 1.2rem)"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "Supreme, system-ui, sans-serif"
    fontSize: "0.85rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "0.01em"
rounded:
  xs: "9px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  base: "18px"
  pill: "999px"
spacing:
  xs: "8px"
  sm: "14px"
  md: "24px"
  lg: "clamp(2rem, 5vw, 4rem)"
  section: "clamp(4.5rem, 10vw, 8rem)"
components:
  button-primary:
    backgroundColor: "{colors.tomato}"
    textColor: "#ffffff"
    rounded: "{rounded.pill}"
    padding: "0 24px"
    height: "48px"
  button-primary-hover:
    backgroundColor: "{colors.tomato-bright}"
    textColor: "#ffffff"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.cream}"
    rounded: "{rounded.pill}"
    padding: "0 24px"
    height: "48px"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.cream}"
    rounded: "{rounded.lg}"
    padding: "24px"
  input-select:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.cream}"
    rounded: "{rounded.sm}"
    height: "48px"
    padding: "0 16px"
  badge:
    backgroundColor: "{colors.saffron}"
    textColor: "{colors.cocoa-deep}"
    rounded: "{rounded.pill}"
    padding: "2px 10px"
---

# Design System: Menufic

## 1. Overview

**Creative North Star: "The Warm Pass"**

The pass is the counter in a working kitchen where finished plates land under warm service light before they go out to the room. That is Menufic's whole feeling: warm, low-lit, food-forward, and quietly confident. The interface is a dark, candle-warm world (cocoa-brown surfaces, not black, never paper) where the restaurant's food — photographed, plated, glowing — is the brightest thing on the screen. Menufic's own brand is the warm light and the gold rim around the plate; it frames the food and never out-shouts it.

This is a **Committed-to-Drenched** dark palette by intent. The body surface is a saturated warm cocoa (`oklch(0.18 0.03 45)`), warmth carried by the surface itself plus saffron-gold and tomato accents pulled straight from food — never by a near-white "paper" background. The type is editorial-confident (a high-contrast serif paired with a clean grotesque) but the layout is a *product* showcase, not a magazine spread. Motion is cinematic but purposeful: one orchestrated hero, looping food video, reveals that fit what they reveal.

It explicitly rejects: the 2026 AI-slop brand page (cream/sand/paper backgrounds, DM Serif / Fraunces headlines, tracked-uppercase eyebrows over every section, editorial three-column restraint); the SaaS funnel (gradient blobs, the big-number hero-metric template, logo walls); cheap QR-menu tools; and interchangeable website-builder templates. If it could be mistaken for any of those, it has failed.

**Key Characteristics:**
- Warm cocoa **dark** surfaces — depth via tonal layering, warmth via accent + type + imagery, never via a beige body.
- Food is the hero; Menufic is the warm rim-light around it.
- High-contrast serif display (Boska) + clean grotesque body (Supreme); both off the over-used font list.
- Saffron-gold for highlights, tomato-red for action, used sparingly so they read as appetite, not decoration.
- Premium for fine dining, frictionless for a food truck — on one surface.

## 2. Colors

A warm, low-lit trattoria palette: cocoa-brown surfaces under saffron and tomato light, with cream type. Every accent is a colour you'd find on a plate.

### Primary
- **Saffron Gold** (`#f3a64a` / `oklch(0.785 0.14 68)`): The brand highlight — active tabs, prices, "Popular" / "Chef's pick" badges, the gold rim-light on the hero device, focus rings, emphasis words in headlines. Carries warmth and appetite. **Saffron Deep** (`#dc932e` / `oklch(0.72 0.14 70)`) is its border/pressed shade.

### Secondary
- **Tomato** (`#cc361e` / `oklch(0.56 0.19 32)`): Action only — the primary "Get started" CTA, the live status dot, the struck-through "what others charge" prices. **Tomato Bright** (`#f05940` / `oklch(0.66 0.19 32)`) is the hover. Pulled from the sauce; reserved for the one thing you want the owner to do.

### Tertiary
- **Herb Green** (`#53be70` / `oklch(0.72 0.15 150)`): Reassurance only — the "Published & live" indicator and success states. A small, fresh counterpoint to all the warmth.

### Neutral
- **Cocoa Background** (`#1c0d06` / `oklch(0.18 0.03 45)`): The body surface. Warm, saturated, near-black but unmistakably brown — the room's low light. **Cocoa Deep** (`#150903`) anchors footers and the deepest wells.
- **Surface** (`#2b1910` / `oklch(0.235 0.034 46)`) and **Surface-2** (`#3d261b` / `oklch(0.295 0.04 48)`): Elevated panels — cards, the theme-studio, nav-on-scroll. Two steps of warm tonal lift.
- **Cream** (`#f7f1e7` / `oklch(0.96 0.015 78)`): Primary text on dark (16.8:1). **Cream Soft** (`#cfc6b8` / `oklch(0.83 0.022 78)`): Secondary text, ledes, captions (≥8:1 on any surface — never a faint grey).
- **Line** (`oklch(0.42 0.03 48 / 0.5)`): Hairline borders and dividers at ~50% alpha; **Line Soft** at ~28% for the quietest separations.

### Named Rules
**The Warm-Light Rule.** Warmth comes from the surface, the accents, the type, and the food — *never* from a near-white "paper" background. A cream or beige body is forbidden; it is the single biggest tell of the look we reject.

**The Two-Accent Rule.** Saffron means *attention*; tomato means *act*. Don't blur them — tomato is the CTA and live status, saffron is everything else gold. Green appears only to confirm.

**The Rim-Light Rule.** The brightest, most saturated thing on any screen is the restaurant's food, lit by saffron. Menufic's chrome stays dimmer than the plate.

## 3. Typography

**Display Font:** Boska (with Georgia, serif fallback)
**Body Font:** Supreme (with system-ui, sans-serif fallback)

*(Gambetta, Sentient and General Sans are also loaded — but only as selectable options inside the theme-builder demo, i.e. choices an owner can apply to their own Public menu. They are not Menufic's own type.)*

**Character:** A high-contrast display serif against a clean, slightly warm grotesque — pairing on a real contrast axis (serif + sans), not two lookalikes. Boska brings editorial confidence and appetite; Supreme keeps the product copy quiet and readable. Distinctive without drifting into the magazine-cover cliché.

### Hierarchy
- **Statement** (Boska 700, `clamp(4rem, 15vw, 9.5rem)`, line-height 0.95): Reserved for the single "Free. Forever." pricing moment. The one place the page is allowed to shout. Use once.
- **Display** (Boska 700, `clamp(2.6rem, 6.2vw, 6rem)`, -0.03em): The hero `<h1>`. One per page. Emphasis word coloured Saffron Gold.
- **Headline** (Boska 700, `clamp(2rem, 4.6vw, 3.4rem)`): Section titles ("Make it yours in seconds", "Everything you need").
- **Title** (Boska 600, ~`1.3rem`): Card and component headings, dish names in the live menu.
- **Body** (Supreme 400, `clamp(1.05rem, 1.6vw, 1.2rem)`, line-height 1.6): Ledes and paragraphs. Cap measure at **65–75ch**; use `text-wrap: pretty`.
- **Label** (Supreme 600, ~`0.85rem`): Control labels, captions, tabular-num prices. Sentence case.

### Named Rules
**The One Sequence Rule.** Numbered markers (`01 · Create`, `02 · Build`, `03 · Share`) are allowed for exactly one genuine ordered sequence (the How-it-works steps) and nowhere else. Numbered eyebrows over ordinary sections are forbidden.

**The Balance Rule.** `text-wrap: balance` on every h1–h3; `text-wrap: pretty` on prose. Headlines never orphan a single word.

## 4. Elevation

A hybrid: depth comes first from **warm tonal layering** (Cocoa → Surface → Surface-2), then from **soft, warm-tinted shadows** used sparingly to lift interactive and floating elements. Surfaces are flat at rest; shadow is a response to elevation or state, never default decoration. Shadows are tinted with the brand's own warmth or pure black at low opacity — never cool grey, never a hard 2014-era drop shadow.

### Shadow Vocabulary
- **Accent glow** (`box-shadow: 0 10px 30px -10px oklch(0.56 0.19 32 / 0.7)`): Under the primary CTA and tomato elements — a warm halo, not a hard edge. Deepens on hover (`0 16px 40px -12px … / 0.8`).
- **Floating panel** (`box-shadow: 0 18px 40px -22px oklch(0 0 0 / 0.8)`): The hero device, the theme-studio preview, cards on hover. Large blur, large negative spread, low opacity.
- **Sticky nav** (`box-shadow: 0 8px 30px -18px oklch(0 0 0 / 0.8)` + `backdrop-filter: blur(14px)`): Appears only once the nav condenses on scroll.

### Named Rules
**The Tonal-First Rule.** Reach for a lighter surface step before reaching for a shadow. Stacked cards separate by tone; shadow is reserved for things that genuinely float.

## 5. Components

### Buttons
- **Shape:** Full pill (`border-radius: 999px`), `min-height: 48px`, `padding: 0 24px`, Supreme 600 / 16px. Tactile: lift `translateY(-2px)` on hover with `cubic-bezier(0.16,1,0.3,1)` easing (~250–350ms).
- **Primary:** Tomato background, **pure white** text (≈5:1 AA), warm accent-glow shadow. Hover → Tomato Bright + deeper glow. The single most important action on any view; rarely more than one per fold.
- **Ghost:** Transparent with a 1px Line border, Cream text. Hover fills with a faint warm surface. For secondary actions ("See a live menu").
- **Focus:** 3px Saffron `:focus-visible` outline, 3px offset — global, never removed.

### Chips / Badges
- **Style:** Saffron-gold pill with Cocoa-deep text (`#150903` on `#f3a64a` ≈ 7.8:1) for "Popular" / "Chef's pick" / active menu tabs. Small caps-free labels.
- **Status:** Herb-green dot + label for "Published & live"; Tomato dot for live/recording states.

### Cards / Containers
- **Corner Style:** `border-radius: 24px` (lg) for major panels, `16px` (md) for inner cards, `12px` (sm) for list rows.
- **Background:** Surface (`#2b1910`); nested content on Surface-2. Never nest a card inside a card with the same tone.
- **Shadow Strategy:** Flat at rest; **Floating panel** shadow on hover/lift only (see Elevation).
- **Border:** 1px Line hairline where separation is needed; tone usually does the work.
- **Internal Padding:** 24px (md) standard; 14–16px on dense rows.

### Inputs / Fields
- **Style:** Surface background, 1px Line stroke, `12px` radius, `48px` height, Cream text. Native `<input type=color>` and `<input type=range>` are restyled to match (range: thin saffron track + cream thumb with a 40px tap area).
- **Focus:** Saffron `:focus-visible` ring (shared global rule).
- **Select:** Same shell, 48px, chevron affordance; option labels in their own font where it's a font picker.

### Navigation
- **Style:** Fixed, transparent over the hero; **condenses on scroll** to a warm translucent bar (`Cocoa 92%` + `backdrop-filter: blur(14px)` + Line-soft hairline). Wordmark left, anchor links centre, Tomato "Get Started" right.
- **States:** Links Cream, hover to full Cream/Saffron; condensed state reduces padding (transitioned via background/shadow, not layout props).
- **Mobile:** Collapses to wordmark + CTA (and hamburger for links).

### Signature Components
- **The Live Menu device.** A realistic phone showing a *real* themed restaurant menu (cover photo, tabs, dish rows with thumbnails, prices, gold tags), floated with a saffron rim-light and a Floating-panel shadow, gently parallaxed in the hero. It is the product, shown working — not a screenshot of a phone.
- **The Theme Builder.** A live customiser: accent swatches **+ a real colour picker**, a corner-radius slider, a font selector, dark/light tone, and a phone/desktop toggle — all restyling a live menu preview instantly via CSS custom properties. Proof that "make it yours" is real.
- **The video hero.** A darkened, slowed, **seamlessly looping** food clip (crossfade/boomerang-baked, no brightness dip) under a strong warm scrim, with a poster fallback and `prefers-reduced-motion` off-switch.

## 6. Do's and Don'ts

### Do:
- **Do** keep the body a warm cocoa dark (`oklch(0.18 0.03 45)`). Carry warmth through accent, type, and food imagery.
- **Do** let the restaurant's food be the brightest, most saturated thing on screen; keep Menufic's chrome dimmer (the Rim-Light Rule).
- **Do** reserve Tomato for the single primary action and live status; use Saffron for all other emphasis (the Two-Accent Rule).
- **Do** pair Boska (display serif) with Supreme (grotesque body) on a real contrast axis; keep body measure 65–75ch.
- **Do** separate stacked surfaces by tone first, shadow second (the Tonal-First Rule); keep shadows warm and soft.
- **Do** ship real, verified food imagery and seamless, reduced-motion-safe video. Verify body text ≥4.5:1 and large/bold ≥3:1 on its actual surface.

### Don't:
- **Don't** use a cream / sand / paper / beige body background, or token names like `--paper` / `--cream-bg`. It is the 2026 AI-slop tell and it directly contradicts "we'll make your menu look special."
- **Don't** use DM Serif Display, DM Sans, Fraunces, Playfair, Cormorant, or Inter. They read as training-data defaults.
- **Don't** drift into the SaaS funnel: gradient blobs, the big-number hero-metric template, "trusted by 10,000 teams" logo walls. Menufic is a craft, not a B2B tool.
- **Don't** add tracked-uppercase eyebrows above every section, or numbered `01/02/03` markers anywhere except the one real How-it-works sequence.
- **Don't** use gradient text (`background-clip: text`), side-stripe borders (`border-left` > 1px as a colour accent), or default glassmorphism.
- **Don't** let Menufic's brand out-shout the restaurant's content, or look like an interchangeable website-builder template (the Wix-restaurant aesthetic).

## 7. Implementation (Tailwind v4 + daisyUI v5)

The `design/` prototype uses **Tailwind CSS v4** and **daisyUI v5**. The Next.js / Mantine production application (`src/`) is intentionally untouched — this layer exists solely to replace 13 pages of duplicated hand-authored inline CSS with a single maintainable source of truth. All values below are transcribed from `design/landing/assets/css/app.css`.

### 7.1 Semantic-slot mapping

The `menufic` daisyUI theme maps brand tokens to semantic slots. The non-obvious calls:

- **tomato → `primary`** ("act": the single CTA and live-status dot — the one thing you want the owner to do).
- **saffron → `secondary`** ("attention": badges, active tabs, prices). Deliberately *not* `accent` — see §7.7.
- **herb-green → `success`** ("confirm": Published & live indicator).
- Leftover daisyUI slots receive distinct on-brand shades rather than defaults: `accent` = saffron-deep; `warning` = saffron; `info` = cream-soft; `error` = danger-red (see §7.7).

| daisyUI slot | Brand token | oklch value | Role |
|---|---|---|---|
| `base-100` | cocoa-bg | `oklch(0.18 0.03 45)` | Body surface |
| `base-200` | surface | `oklch(0.235 0.034 46)` | Cards, panels |
| `base-300` | surface-2 | `oklch(0.295 0.04 48)` | Nested content, elevated panels |
| `base-content` | cream | `oklch(0.96 0.015 78)` | Primary text |
| `primary` | tomato | `oklch(0.56 0.19 32)` | ACT — single CTA, live-status dot |
| `primary-content` | white | `oklch(1 0 0)` | Text on primary |
| `secondary` | saffron | `oklch(0.785 0.14 68)` | ATTENTION — badges, active tabs, prices |
| `secondary-content` | cocoa-deep | `oklch(0.155 0.026 52)` | Text on secondary |
| `accent` | saffron-deep | `oklch(0.72 0.14 70)` | Border / pressed shade for saffron |
| `accent-content` | cocoa-deep | `oklch(0.155 0.026 52)` | Text on accent |
| `neutral` | surface-2 | `oklch(0.295 0.04 48)` | Neutral elements |
| `neutral-content` | cream | `oklch(0.96 0.015 78)` | Text on neutral |
| `info` | cream-soft | `oklch(0.83 0.022 78)` | Informational state |
| `info-content` | cocoa-deep | `oklch(0.155 0.026 52)` | Text on info |
| `success` | herb-green | `oklch(0.72 0.15 150)` | CONFIRM — Published & live |
| `success-content` | cocoa-deep | `oklch(0.155 0.026 52)` | Text on success |
| `warning` | saffron | `oklch(0.785 0.14 68)` | Warning state (on-brand saffron) |
| `warning-content` | cocoa-deep | `oklch(0.155 0.026 52)` | Text on warning |
| `error` | danger-red | `oklch(0.50 0.17 25)` | Destructive / error state (see §7.7) |
| `error-content` | cream | `oklch(0.96 0.015 78)` | Text on error |

### 7.2 daisyUI theme variables

Radius, border, and texture are set inside the `@plugin "daisyui/theme"` block:

| Variable | Value | Maps to |
|---|---|---|
| `--radius-selector` | `999px` | Pills: badges, chips |
| `--radius-field` | `12px` | Inputs, selects (`rounded.sm`) |
| `--radius-box` | `24px` | Cards, panels (`rounded.lg`) |
| `--border` | `1px` | Default border width |
| `--depth` | `0` | No automatic daisyUI depth effect |
| `--noise` | `0` | No automatic daisyUI noise texture |

### 7.3 Shadow Vocabulary as @theme tokens

Declared in the Tailwind `@theme` block so they are available as design-system-level tokens across all 13 prototype pages:

| Token | Value |
|---|---|
| `--font-display` | `"Boska", Georgia, serif` |
| `--font-body` | `"Supreme", system-ui, sans-serif` |
| `--radius-pill` | `999px` |
| `--shadow-accent-glow` | `0 10px 30px -10px oklch(0.56 0.19 32 / 0.7)` |
| `--shadow-accent-glow-hover` | `0 16px 40px -12px oklch(0.56 0.19 32 / 0.8)` |
| `--shadow-floating` | `0 18px 40px -22px oklch(0 0 0 / 0.8)` |
| `--shadow-nav` | `0 8px 30px -18px oklch(0 0 0 / 0.8)` |

### 7.4 Custom @layer inventory

A thin `@layer` handles the handful of rules that cannot be expressed as theme variables alone. Every rule below has a reason it cannot be a variable.

**@layer components**

| Rule | What it does | Why the layer, not a var |
|---|---|---|
| `.btn` (shape, height, font, transition) | Pill radius (`--radius-pill`), 48px min/height, Supreme 600, 300ms cubic-bezier lift transition | daisyUI buttons default to `--radius-field`; buttons must be pill (999px) while inputs stay at 12px — one radius var cannot serve both |
| `.btn:hover` | `translateY(-2px)` tactile lift | Motion is a response to state; cannot be a static custom property |
| `.btn-primary` | Applies `--shadow-accent-glow` | Shadow is applied to a specific variant, not a global default |
| `.btn-primary:hover` | Deepens to `--shadow-accent-glow-hover` | Hover state requires an explicit rule |
| `.btn-ghost` | Transparent, 1px `color-mix` border (22% base-content), cream text; `base-200` warm fill on hover | Ghost semantics diverge from daisyUI's default ghost; the border uses a dynamic `color-mix` expression |
| `.input, .select` | `height: 48px` | Enforces §5 Inputs 48px height; daisyUI's default shell is shorter |
| `.card` | `box-shadow` transition only | Flat at rest, animated to floating on hover (Tonal-First Rule); the transition must be present even when shadow is zero |

**@layer utilities**

| Class | Value | Purpose |
|---|---|---|
| `.shadow-floating` | `var(--shadow-floating)` | Hero device, theme-studio, cards on hover |
| `.shadow-nav` | `var(--shadow-nav)` | Condensed sticky nav |
| `.measure` | `max-width: 70ch` | Body copy measure (65–75ch rule) |
| `.text-balance` | `text-wrap: balance` | h1–h3 (no orphans) |
| `.text-pretty` | `text-wrap: pretty` | Prose paragraphs |

**@layer base**

| Rule | What it does |
|---|---|
| `:focus-visible` | 3px saffron (`--color-secondary`) outline, 3px offset, 6px border-radius — global, never removed (§5 Buttons) |
| `body` | `font-family: var(--font-body)` (Supreme) |
| `h1, h2, h3, h4` | `font-family: var(--font-display)` (Boska) + `text-wrap: balance` |

### 7.5 Component → class map

Markup stays semantic; daisyUI classes are the single source of truth. The three signature components (Live Menu device, Theme Builder preview, video hero) are custom-CSS islands that consume the above tokens directly.

| Component | daisyUI classes |
|---|---|
| Primary CTA | `btn btn-primary` |
| Ghost | `btn btn-ghost` |
| Badge / active tab | `badge badge-secondary` |
| Card | `card bg-base-200` |
| Nested card | `bg-base-300` |
| Input | `input` |
| Select | `select` |
| Tabs | `tabs` |
| Table | `table` |
| Stat | `stat` |
| Drawer | `drawer` |
| Modal | `modal` |

### 7.6 Public-menu runtime-theming contract

The `menufic-public` theme provides a warm-light base (`color-scheme: light`; `base-100` is a warm near-white, not pure white). At runtime the Theme Builder writes daisyUI's own CSS variables **inline on the menu root element** — no class swaps, no separate stylesheets:

- `--color-primary` — owner's chosen accent colour (default: terracotta `oklch(0.55 0.16 35)`)
- `--radius-box` — card / panel corner radius
- `--radius-field` — input / chip corner radius
- `font-family` — owner's selected font

Presets are inline var bundles that write all four properties at once. The customization contract is therefore stable: adding a preset means defining its four var values; Menufic's App and Brand surfaces are never affected by any owner-level change.

### 7.7 Two-Accent Rule carve-out for error

The Two-Accent Rule (§2) governs **brand accents**: saffron means *attention*, tomato means *act*, herb-green *confirms*. Those three colours form the entire brand accent vocabulary; no fourth brand accent is permitted.

The `error` slot (`oklch(0.50 0.17 25)`, danger-red) is a **functional state colour**, not a brand accent. Its hue (≈25°) is deliberately distinct from tomato (hue 32°) so destructive-action feedback cannot be mistaken for a primary CTA. Because `error` signals UI state rather than brand intent, it sits outside the Two-Accent Rule's count. The rule remains: two brand accents, full stop.
