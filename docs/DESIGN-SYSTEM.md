# Menufic Design System

> **Source of truth:** `design/menufic-design.pen` — Design System frame at x:1640, y:0
> All reusable components live off-canvas at x:2920 in the same file.
> Variables (color/font tokens) are defined in the file via `set_variables`.

---

## Color Palette

| Token | Name | Hex | Role |
|-------|------|-----|------|
| `$--color-primary` | Warm Slate | `#2C3A4A` | Navbar, dark sections, headings, footer |
| `$--color-secondary` | Steel Teal | `#3D6B7A` | Hover states, secondary buttons, dividers |
| `$--color-accent` | Terracotta | `#D4622A` | CTAs, active states, highlights, badges |
| `$--color-surface` | Warm Sand | `#F5EDE0` | Page backgrounds, cards, light sections |
| `$--color-support` | Muted Sage | `#7A9E85` | Tags, success states, subtle icons |

### Neutrals

| Token | Hex | Usage |
|-------|-----|-------|
| `$--background` | `#FFFFFF` | Page / component backgrounds |
| `$--background-dark` | `#1A2530` | Pricing section, dark cards |
| `$--foreground` | `#1A1A18` | Primary text |
| `$--muted-foreground` | `#5C5C58` | Secondary text, captions |
| `$--border` | `#E8E0D4` | Borders, dividers, card strokes |
| Off-white | `#FAFAF7` | Design system canvas, subtle backgrounds |
| Light muted | `#8A9EAE` | Sidebar icon/text (inactive), dark card body |
| Tan | `#D4B896` | Step numbers in How It Works |

---

## Typography

| Role | Font | Weights | Usage |
|------|------|---------|-------|
| `$--font-primary` | **Lora** (serif) | 400, 700 | Hero headline, section titles, card titles, stat values |
| `$--font-secondary` | **Outfit** (geometric sans) | 400, 500, 600, 700 | Body copy, nav, buttons, labels, captions, tags |

### Type Scale

| Style | Font | Size | Weight | Token/Usage |
|-------|------|------|--------|-------------|
| Display | Lora | 72px | 700 | Hero headline |
| H1 | Lora | 48px | 700 | Page headings |
| H2 | Lora | 32px | 700 | Section titles |
| H3 | Lora | 24px | 400 | Sub-section titles |
| Large Label | Outfit | 18px | 600 | Feature titles |
| Button/Label | Outfit | 15–16px | 600 | Buttons, nav links |
| Body | Outfit | 14–15px | 400 | Body text, descriptions |
| Caption | Outfit | 12–13px | 400–500 | Captions, metadata |
| Tag/Meta | Outfit | 11px | 500–600 | Tags, section labels |

---

## Spacing

- **Base unit:** 8px
- **Section vertical padding:** 96px
- **Card padding:** 28–32px
- **Button padding:** `[14, 28]` (primary), `[13, 27]` (ghost/outline)
- **Gap between nav links:** 32px
- **Gap between cards:** 20–24px

---

## Components

All components are reusable nodes in `design/menufic-design.pen`. Reference by ID when building dashboard screens.

### Buttons

| Component | Node ID | Fill | Usage |
|-----------|---------|------|-------|
| `Button/Primary` | `shhqh` | `#D4622A` (Terracotta) | Main CTAs |
| `Button/Secondary` | `p80Lq` | `#2C3A4A` (Slate) | Secondary actions |
| `Button/Ghost` | `2gr0x` | Transparent + slate border | Tertiary, cancel |
| `Button/Ghost-Light` | `ZNun1` | Transparent + white border | CTAs on dark bg |

Customise label: `U(instance+"/label", {content: "New Text"})`

### Tags & Badges

| Component | Node ID | Fill | Usage |
|-----------|---------|------|-------|
| `Tag/Sage` | `0eV3i` | `#7A9E85` | Active, success |
| `Tag/Slate` | `PTtm2` | `#2C3A4A` | Free tier, neutral |
| `Tag/Accent` | `Y0cK5` | `#D4622A` | New, featured |
| `Tag/Outline` | `iC97K` | Transparent + border | Subtle labels |

Customise label: `U(instance+"/label", {content: "New Text"})`

### Cards

| Component | Node ID | Fill | Usage |
|-----------|---------|------|-------|
| `Card/Light` | `IpfGS` | `#FFFFFF` | White sections |
| `Card/Dark` | `iz7G3` | `#2C3A4A` | Slate sections |
| `Card/Sand` | `oUuLU` | `#F5EDE0` | Sand sections |

Children: `title` (Lora 20/700), `body` (Outfit 14, fixed-width)
Customise: `U(instance+"/title", {content: "..."})` / `U(instance+"/body", {content: "..."})`

### Form Inputs

| Component | Node ID | Usage |
|-----------|---------|-------|
| `Input/Default` | `grQsh` | All form fields |

Children: `label` (Outfit 13/500), `box > placeholder` (Outfit 14, muted)
Customise label: `U(instance+"/x409d", {content: "Field Label"})`
Customise placeholder: `U(instance+"/r3uZK/Jh9mV", {content: "Placeholder..."})`

### Stat Blocks

| Component | Node ID | Usage |
|-----------|---------|-------|
| `Stat/Block` | `9cp3S` | Social proof, KPI metrics |

Children: `value` (Lora 32/700, slate), `label` (Outfit 12, muted)
Customise: `U(instance+"/ptUVi", {content: "500+"})` / `U(instance+"/DfRUz", {content: "Restaurants"})`

### Navigation

| Component | Node ID | Usage |
|-----------|---------|-------|
| `Nav/Link` | `WH3x4` | Navbar links (inactive) |
| `Nav/Link-Active` | `OYzRR` | Navbar links (active, terracotta) |

Customise: `U(instance+"/label", {content: "Pricing"})`

### Sidebar Navigation

| Component | Node ID | Usage |
|-----------|---------|-------|
| `Sidebar/NavItem` | `OO5CC` | Dashboard sidebar (inactive) |
| `Sidebar/NavItem-Active` | `kSvna` | Dashboard sidebar (active) |

Children: `icon` (lucide 18px), `label` (Outfit 14)
Customise icon: `U(instance+"/3VT3C", {iconFontName: "utensils"})`
Customise label: `U(instance+"/mK6yn", {content: "Restaurants"})`
Active icon: `U(instance+"/d6Jf9", {iconFontName: "..."})`
Active label: `U(instance+"/djXQi", {content: "..."})`

### Dividers

| Component | Node ID | Usage |
|-----------|---------|-------|
| `Divider/Horizontal` | `smuFY` | Light sections (`#E8E0D4`) |
| `Divider/Dark` | `XoT9v` | Dark sections (`#FFFFFF1A`) |

### Feature Icons

| Component | Node ID | Usage |
|-----------|---------|-------|
| `Feature/Icon` | `x4cnu` | Icon container for feature cards |

Sand bg + sage icon. Customise: `U(instance+"/FC6Ah", {iconFontName: "..."})`

---

## Icon Library

Use **Lucide** icon font (`iconFontFamily: "lucide"`).

Common icons used in Menufic:
- `utensils` — Restaurants
- `list` — Menu Builder
- `image` — Banners
- `share-2` — Publish & Share
- `layout-dashboard` — Dashboard
- `settings` — Settings
- `user` — Profile
- `plus` — Add/Create
- `pencil` — Edit
- `trash-2` — Delete
- `check` — Success/confirm
- `x` — Close/cancel
- `search` — Search
- `chevron-down` — Dropdown
- `qr-code` — QR code

---

## Section Backgrounds

| Section | Background | Notes |
|---------|-----------|-------|
| Navbar | `#2C3A4A` | Warm Slate, height 72px |
| Hero | Full-bleed photo | Dark overlay gradient |
| How It Works | `#FFFFFF` | White |
| Features | `#F5EDE0` | Warm Sand |
| Pricing | `#1A2530` | Dark Slate |
| Footer | `#2C3A4A` | Warm Slate |
| Dashboard sidebar | `#2C3A4A` | Warm Slate |
| Dashboard content | `#FAFAF7` | Off-white |

---

## Dashboard Layout Pattern

```
┌─────────────────────────────────────────────┐
│  Sidebar (240px, #2C3A4A)  │  Content Area  │
│  - Logo (Lora, white)      │  (#FAFAF7 bg)  │
│  - NavItem-Active          │  padding: 32   │
│  - NavItem × n             │  gap: 24       │
│  - Divider/Dark            │                │
│  - Settings, Profile       │                │
└─────────────────────────────────────────────┘
```

Dashboard screens to build (in order):
1. Restaurant List
2. Restaurant Management Hub
3. Menu Builder (Menus / Categories / Items)
4. Banner Management
5. Publish & Share Panel

---

## Usage Rules

1. **Always use component instances** — never build buttons, tags, or cards from scratch
2. **Always use hex from this doc** — no arbitrary colors
3. **Font pairing** — Lora for anything "editorial/display", Outfit for everything functional
4. **Terracotta (#D4622A) is reserved** for the single primary CTA per section
5. **Dark backgrounds** use `#8A9EAE` for muted text (not `#5C5C58`)
6. **Spacing** — always multiples of 8px
