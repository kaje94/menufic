# Responsive Breakpoints

## Why This Matters

Pencil designs often use multiple artboards at different widths to represent mobile, tablet, and desktop views. When generating code, these artboard sizes must map to Tailwind CSS breakpoints correctly — otherwise the responsive behavior in the browser won't match the design.

Getting this wrong produces:
- Layouts that break at wrong screen sizes
- Mobile designs appearing at tablet widths
- Desktop layouts that don't scale down properly
- Redundant or missing breakpoint overrides

## Pencil Artboard Sizes -> Tailwind Breakpoints

### Standard Artboard Widths

| Device | Pencil Artboard Width | Tailwind Breakpoint | Prefix |
|--------|----------------------|--------------------|----|
| Mobile (small) | 320px | Default (no prefix) | — |
| Mobile (standard) | 375px | Default (no prefix) | — |
| Mobile (large) | 393-430px | Default (no prefix) | — |
| Tablet (portrait) | 768px | `md` | `md:` |
| Tablet (landscape) | 1024px | `lg` | `lg:` |
| Desktop | 1280px | `xl` | `xl:` |
| Desktop (wide) | 1440px | `2xl` | `2xl:` |
| Desktop (ultrawide) | 1920px | `2xl` or custom | `2xl:` |

### Tailwind v4 Breakpoint Values

These are Tailwind's default breakpoints (unchanged in v4):

```css
/* Built into Tailwind — no @theme needed */
sm  →  640px
md  →  768px
lg  →  1024px
xl  →  1280px
2xl →  1536px
```

Custom breakpoints in Tailwind v4 use `@theme`:

```css
@theme {
  --breakpoint-xs: 475px;
  --breakpoint-3xl: 1920px;
}
```

## Mapping Pencil Multi-Artboard Designs to Code

### Reading Multiple Artboards

When a design has artboards at different widths, read all of them:

```
pencil_batch_get({
  filePath: "path/to/file.pen",
  patterns: [{ type: "frame", name: "Mobile|Tablet|Desktop" }],
  readDepth: 4
})
```

Or read top-level nodes to identify all screens:

```
pencil_batch_get({ filePath: "path/to/file.pen" })
```

### Code Generation Strategy

Generate mobile-first code, then add breakpoint overrides for larger screens:

```tsx
// Mobile-first: base styles match the mobile artboard
// md: styles match the tablet artboard  
// lg: styles match the desktop artboard

<div className="flex flex-col gap-4 p-4 md:flex-row md:gap-6 md:p-6 lg:gap-8 lg:p-8">
  {/* Sidebar: stacks below content on mobile, beside it on tablet+ */}
  <aside className="w-full md:w-64 lg:w-72">
    {/* ... */}
  </aside>

  {/* Main content: full width on mobile, flexible on tablet+ */}
  <main className="flex-1">
    {/* ... */}
  </main>
</div>
```

### Common Responsive Patterns

| Pencil Design Pattern | Tailwind Implementation |
|----------------------|------------------------|
| Single column (mobile) -> 2 columns (tablet) -> 3 columns (desktop) | `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3` |
| Stacked sidebar (mobile) -> side-by-side (desktop) | `flex flex-col lg:flex-row` |
| Hidden on mobile, visible on desktop | `hidden lg:block` |
| Visible on mobile, hidden on desktop | `block lg:hidden` |
| Full-width mobile, constrained desktop | `w-full max-w-7xl mx-auto` |
| Small text mobile, larger desktop | `text-sm md:text-base lg:text-lg` |
| Reduced padding mobile, more desktop | `p-4 md:p-6 lg:p-8` |
| Card grid: 1 col mobile, 2 tablet, 3 desktop | `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6` |
| Navigation hamburger (mobile) -> full nav (desktop) | Mobile: `<Sheet>` / Desktop: `<nav className="hidden md:flex">` |

### Layout Differences Between Artboards

When comparing mobile vs desktop artboards, look for these differences:

| What Changes | Mobile Artboard | Desktop Artboard | Code Pattern |
|-------------|----------------|-----------------|--------------|
| Layout direction | `layout: "vertical"` | `layout: "horizontal"` | `flex flex-col lg:flex-row` |
| Column count | 1 column | 2-4 columns | `grid-cols-1 lg:grid-cols-3` |
| Visibility | Element missing | Element present | `hidden lg:block` |
| Font size | Smaller | Larger | `text-2xl lg:text-4xl` |
| Padding | 16px | 24-32px | `p-4 lg:p-8` |
| Gap | 16px | 24px | `gap-4 lg:gap-6` |
| Sidebar | Hidden or stacked | Side-by-side | `hidden lg:block lg:w-64` |
| Image size | Smaller/cropped | Full size | `h-48 lg:h-80` |

## Container Queries (Advanced)

For component-level responsiveness (where a card adapts based on its container, not the viewport), Tailwind v4 supports container queries:

```css
@theme {
  /* No setup needed — Tailwind v4 supports @container natively */
}
```

```tsx
<div className="@container">
  <div className="flex flex-col @md:flex-row @lg:gap-8">
    {/* Responds to parent container width, not viewport */}
  </div>
</div>
```

Use container queries when the same component appears in different contexts (sidebar vs main content) and should adapt accordingly.

## Anti-Patterns

| Wrong | Right |
|-------|-------|
| Hardcoding pixel widths from artboard | Use Tailwind breakpoints + responsive utilities |
| Building separate components for mobile/desktop | One component with responsive classes |
| Using `max-width` media queries | Mobile-first with `min-width` (Tailwind default) |
| Ignoring the mobile artboard | Always start from mobile, add `md:` / `lg:` overrides |
| Using `@media` in CSS for breakpoints | Use Tailwind responsive prefixes in className |
| Generating `w-[375px]` from mobile artboard | Use `w-full` with responsive max-width |
| Generating `w-[1440px]` from desktop artboard | Use `max-w-7xl mx-auto` or similar |

## Checklist

When generating code from multi-artboard Pencil designs:

- [ ] Have I identified all artboard sizes and mapped them to Tailwind breakpoints?
- [ ] Am I generating mobile-first code (base styles = mobile artboard)?
- [ ] Am I using breakpoint prefixes (`md:`, `lg:`) for tablet/desktop overrides?
- [ ] Have I compared artboards to identify what changes between sizes?
- [ ] Am I using `grid-cols-*` with breakpoint prefixes for column count changes?
- [ ] Am I using `hidden` / `block` with breakpoint prefixes for visibility changes?
- [ ] Am I avoiding hardcoded pixel widths from artboard dimensions?
