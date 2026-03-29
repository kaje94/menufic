# Variables and Design Tokens

## Why This Matters

Pencil variables are the equivalent of design tokens. When you hardcode values like `fill: "#3b82f6"` or `cornerRadius: 8` instead of referencing a variable:

- Code generation produces hardcoded hex values or arbitrary Tailwind classes like `bg-[#3b82f6]`, making theming impossible
- Dark mode won't work because the values don't adapt to theme changes
- Global design updates require manual find-and-replace instead of changing one variable
- The design diverges from the codebase's token system

## Step-by-Step: Reading and Using Variables

### Step 1: Read All Variables

Always do this at the start of any design task:

```
pencil_get_variables({ filePath: "path/to/file.pen" })
```

This returns all defined variables with their values, organized by theme. Example output:

```json
{
  "variables": {
    "primary": { "value": "#3b82f6" },
    "primary-foreground": { "value": "#ffffff" },
    "secondary": { "value": "#64748b" },
    "background": { "value": "#ffffff" },
    "foreground": { "value": "#0a0a0a" },
    "border": { "value": "#e2e8f0" },
    "radius-sm": { "value": 4 },
    "radius-md": { "value": 6 },
    "radius-lg": { "value": 8 },
    "radius-xl": { "value": 12 }
  }
}
```

### Step 2: Map Your Values to Variables

Before applying any style, check if a variable exists for it:

| What you want | Don't use | Use instead |
|---------------|-----------|-------------|
| Blue brand color | `fill: "#3b82f6"` | Reference the `primary` variable |
| White text on primary | `textColor: "#ffffff"` | Reference the `primary-foreground` variable |
| Border color | `strokeColor: "#e2e8f0"` | Reference the `border` variable |
| Medium rounding | `cornerRadius: [6,6,6,6]` | Reference the `radius-md` variable |
| Page background | `fill: "#ffffff"` | Reference the `background` variable |
| Body text color | `textColor: "#0a0a0a"` | Reference the `foreground` variable |

### Step 3: Apply Variables in Design

When the .pen file schema supports variable binding, bind properties to variables instead of using raw values. The exact binding mechanism depends on the schema returned by `pencil_get_editor_state` - consult the schema for the correct variable reference syntax.

### Step 4: Create Missing Variables

If you need a token that doesn't exist, create it:

```
pencil_set_variables({
  filePath: "path/to/file.pen",
  variables: {
    "accent": { "value": "#f59e0b" },
    "accent-foreground": { "value": "#ffffff" }
  }
})
```

Then use the new variable instead of hardcoding.

## Theme Support

Variables can have different values per theme (e.g., light and dark mode):

```json
{
  "primary": {
    "themes": {
      "light": "#3b82f6",
      "dark": "#60a5fa"
    }
  }
}
```

When using themed variables, the design automatically adapts when switching themes. Hardcoded values break this entirely.

## Variables in Code Generation (Tailwind v4 + shadcn/ui)

When generating code from a Pencil design, Pencil variables map to **Tailwind v4 semantic utility classes**. NEVER use arbitrary value syntax.

### Color Token Mapping

Pencil variables map to `@theme { --color-* }` declarations in your CSS, which Tailwind v4 auto-generates into semantic utility classes:

| Pencil Variable | `@theme` declaration | Tailwind Utility Classes |
|----------------|---------------------|--------------------------|
| `primary` | `--color-primary` | `bg-primary`, `text-primary`, `border-primary` |
| `primary-foreground` | `--color-primary-foreground` | `text-primary-foreground`, `bg-primary-foreground` |
| `secondary` | `--color-secondary` | `bg-secondary`, `text-secondary` |
| `secondary-foreground` | `--color-secondary-foreground` | `text-secondary-foreground` |
| `background` | `--color-background` | `bg-background` |
| `foreground` | `--color-foreground` | `text-foreground` |
| `muted` | `--color-muted` | `bg-muted`, `text-muted` |
| `muted-foreground` | `--color-muted-foreground` | `text-muted-foreground` |
| `accent` | `--color-accent` | `bg-accent` |
| `accent-foreground` | `--color-accent-foreground` | `text-accent-foreground` |
| `destructive` | `--color-destructive` | `bg-destructive`, `text-destructive` |
| `destructive-foreground` | `--color-destructive-foreground` | `text-destructive-foreground` |
| `card` | `--color-card` | `bg-card` |
| `card-foreground` | `--color-card-foreground` | `text-card-foreground` |
| `border` | `--color-border` | `border-border` |
| `ring` | `--color-ring` | `ring-ring` |

### Radius Token Mapping

Pencil radius variables map to `@theme { --radius-* }` declarations, which generate `rounded-*` utilities:

| Pencil Variable | `@theme` declaration | Tailwind Utility |
|----------------|---------------------|------------------|
| `radius-sm` | `--radius-sm` | `rounded-sm` |
| `radius-md` | `--radius-md` | `rounded-md` |
| `radius-lg` | `--radius-lg` | `rounded-lg` |
| `radius-xl` | `--radius-xl` | `rounded-xl` |

### What NEVER to Generate

| Bad (arbitrary values) | Good (semantic utilities) |
|----------------------|--------------------------|
| `bg-[#3b82f6]` | `bg-primary` |
| `text-[#ffffff]` | `text-primary-foreground` |
| `text-[var(--primary)]` | `text-primary` |
| `bg-[var(--secondary)]` | `bg-secondary` |
| `rounded-[6px]` | `rounded-md` |
| `rounded-[var(--radius-md)]` | `rounded-md` |
| `border-[#e2e8f0]` | `border-border` |
| `ring-[var(--ring)]` | `ring-ring` |

The rule is simple: **if a Pencil variable exists for the value, there is a corresponding semantic Tailwind utility. Use the utility, not arbitrary syntax.**

### Opacity Modifiers

Tailwind v4 supports opacity modifiers on semantic classes:

```
bg-primary/90      -> primary color at 90% opacity
text-foreground/70 -> foreground color at 70% opacity
border-border/50   -> border color at 50% opacity
```

Use these instead of arbitrary `opacity` values or `color-mix()` in class names.

## Checklist

Before applying any style value:

- [ ] Have I called `pencil_get_variables` to see available tokens?
- [ ] Am I using a variable reference instead of a hardcoded color value?
- [ ] Am I using a variable reference instead of a hardcoded border radius?
- [ ] If the needed variable doesn't exist, have I created it with `pencil_set_variables`?
- [ ] For code generation: am I outputting semantic Tailwind classes (`bg-primary`, `rounded-md`), NOT arbitrary values (`bg-[#3b82f6]`, `rounded-[6px]`)?

## Common Variable Categories

| Category | Common Variable Names | Tailwind Prefix |
|----------|----------------------|-----------------|
| Brand colors | `primary`, `secondary`, `accent` | `--color-*` -> `bg-*`, `text-*` |
| Semantic colors | `destructive`, `success`, `warning`, `info` | `--color-*` -> `bg-*`, `text-*` |
| Surface colors | `background`, `foreground`, `card`, `card-foreground` | `--color-*` -> `bg-*`, `text-*` |
| UI colors | `border`, `ring`, `muted`, `muted-foreground` | `--color-*` -> `border-*`, `ring-*` |
| Border radius | `radius-sm`, `radius-md`, `radius-lg`, `radius-xl` | `--radius-*` -> `rounded-*` |
| Typography | `font-sans`, `font-mono`, `font-heading` | `--font-*` -> `font-*` |
| Spacing | `spacing-xs`, `spacing-sm`, `spacing-md`, `spacing-lg` | `--spacing-*` -> `gap-*`, `p-*` |

## See Also

- [tailwind-shadcn-mapping.md](tailwind-shadcn-mapping.md) — Full quick-reference mapping tables for code generation
- [design-to-code-workflow.md](design-to-code-workflow.md) — Complete code generation workflow using these tokens
- [responsive-breakpoints.md](responsive-breakpoints.md) — Breakpoint tokens and responsive patterns
