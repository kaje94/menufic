# Design-to-Code Workflow

## Overview

Pencil enables a two-way sync between design and code. This reference covers the complete workflow for generating clean, production-ready React + Tailwind v4 + shadcn/ui code from Pencil designs.

**Target stack**: React/Next.js, TypeScript, Tailwind CSS v4, shadcn/ui, Lucide icons, CVA for variants.

## Step 1: Load the `frontend-design` Skill

**MANDATORY.** Before any design or code generation work, load the `frontend-design` skill. This provides:

- Aesthetic direction: bold, intentional design choices (not generic AI slop)
- Typography guidelines: distinctive font pairings, not overused defaults
- Color and theme guidelines: cohesive palettes with dominant colors and sharp accents
- Motion and animation: purposeful transitions and micro-interactions
- Spatial composition: unexpected layouts, asymmetry, generous negative space

Apply these guidelines both when designing in Pencil and when translating the design to code. The generated code should feel designed, not just mechanically translated from a node tree.

## Step 2: Read Design Guidelines

Before generating any code, call the relevant Pencil guidelines:

```
pencil_get_guidelines({ topic: "code" })
pencil_get_guidelines({ topic: "tailwind" })
```

These return the specific rules for translating .pen design properties into code.

## Step 3: Read Design Tokens

```
pencil_get_variables({ filePath: "path/to/file.pen" })
```

Map every Pencil variable to its Tailwind v4 `@theme` declaration and utility class. See [variables-and-tokens.md](variables-and-tokens.md) for the full mapping table.

Key principle: **Pencil variable names map 1:1 to Tailwind semantic utilities.** No arbitrary values.

| Pencil Variable | `@theme` Declaration | Utility Class |
|----------------|---------------------|---------------|
| `primary` | `--color-primary` | `bg-primary` / `text-primary` |
| `primary-foreground` | `--color-primary-foreground` | `text-primary-foreground` |
| `background` | `--color-background` | `bg-background` |
| `foreground` | `--color-foreground` | `text-foreground` |
| `border` | `--color-border` | `border-border` |
| `radius-md` | `--radius-md` | `rounded-md` |
| `muted` | `--color-muted` | `bg-muted` |
| `muted-foreground` | `--color-muted-foreground` | `text-muted-foreground` |

## Step 4: Read the Design Tree

```
pencil_batch_get({
  filePath: "path/to/file.pen",
  nodeIds: ["screenId"],
  readDepth: 5
})
```

Use sufficient `readDepth` to see the full structure. For complex screens, you may need to read specific subtrees separately.

## Step 5: Map Design Components to shadcn/ui Components

Identify reusable components (`reusable: true` nodes) and map them to shadcn/ui components:

```
pencil_batch_get({
  filePath: "path/to/file.pen",
  patterns: [{ reusable: true }],
  readDepth: 3
})
```

### Pencil-to-shadcn/ui Component Mapping

| Pencil Component Name | shadcn/ui Component | Import |
|----------------------|--------------------|----|
| Button / Btn | `<Button>` | `@/components/ui/button` |
| Card / Tile / Panel | `<Card>`, `<CardHeader>`, `<CardContent>`, `<CardFooter>` | `@/components/ui/card` |
| Input / TextField | `<Input>` | `@/components/ui/input` |
| Select / Dropdown | `<Select>`, `<SelectTrigger>`, `<SelectContent>`, `<SelectItem>` | `@/components/ui/select` |
| Checkbox | `<Checkbox>` | `@/components/ui/checkbox` |
| Switch / Toggle | `<Switch>` | `@/components/ui/switch` |
| Badge / Tag / Chip | `<Badge>` | `@/components/ui/badge` |
| Avatar | `<Avatar>`, `<AvatarImage>`, `<AvatarFallback>` | `@/components/ui/avatar` |
| Dialog / Modal | `<Dialog>`, `<DialogTrigger>`, `<DialogContent>` | `@/components/ui/dialog` |
| Tabs / TabBar | `<Tabs>`, `<TabsList>`, `<TabsTrigger>`, `<TabsContent>` | `@/components/ui/tabs` |
| Table / DataTable | `<Table>`, `<TableHeader>`, `<TableRow>`, `<TableCell>` | `@/components/ui/table` |
| Tooltip | `<Tooltip>`, `<TooltipTrigger>`, `<TooltipContent>` | `@/components/ui/tooltip` |
| Label | `<Label>` | `@/components/ui/label` |
| Separator / Divider | `<Separator>` | `@/components/ui/separator` |

If a Pencil component has no shadcn/ui equivalent, create a custom component following the same conventions (CVA variants, `cn()` utility, ref forwarding via React 19 prop).

### Querying the shadcn/ui Registry

When a Pencil component doesn't have an obvious match in the table above, query the shadcn/ui registry to check for available components:

```
shadcn_search_items_in_registries({
  registries: ["@shadcn"],
  query: "data table"  // search by the Pencil component's function
})
```

Use `shadcn_view_items_in_registries` to inspect a component's files and API:

```
shadcn_view_items_in_registries({
  items: ["@shadcn/data-table"]
})
```

Use `shadcn_get_item_examples_from_registries` to see usage patterns:

```
shadcn_get_item_examples_from_registries({
  registries: ["@shadcn"],
  query: "data-table-demo"
})
```

If a matching registry component exists, install it with `shadcn_get_add_command_for_items` and use it instead of building from scratch.

Instances (`ref` nodes) become usages of these components with their overridden props.

## Step 6: Generate Code

### CSS Setup (app.css / globals.css)

Generate the `@theme` block from Pencil design tokens. Use the `--color-*` namespace for colors and `--radius-*` for border radii so Tailwind auto-generates semantic utilities:

```css
@import "tailwindcss";

@theme {
  /* Colors from Pencil variables */
  --color-background: oklch(100% 0 0);
  --color-foreground: oklch(14.5% 0.025 264);
  --color-primary: oklch(14.5% 0.025 264);
  --color-primary-foreground: oklch(98% 0.01 264);
  --color-secondary: oklch(96% 0.01 264);
  --color-secondary-foreground: oklch(14.5% 0.025 264);
  --color-muted: oklch(96% 0.01 264);
  --color-muted-foreground: oklch(46% 0.02 264);
  --color-accent: oklch(96% 0.01 264);
  --color-accent-foreground: oklch(14.5% 0.025 264);
  --color-destructive: oklch(53% 0.22 27);
  --color-destructive-foreground: oklch(98% 0.01 264);
  --color-card: oklch(100% 0 0);
  --color-card-foreground: oklch(14.5% 0.025 264);
  --color-border: oklch(91% 0.01 264);
  --color-ring: oklch(14.5% 0.025 264);

  /* Radius from Pencil variables */
  --radius-sm: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
}

/* Dark mode */
@custom-variant dark (&:where(.dark, .dark *));

.dark {
  --color-background: oklch(14.5% 0.025 264);
  --color-foreground: oklch(98% 0.01 264);
  /* ... other dark overrides from Pencil theme variables */
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground antialiased;
  }
}
```

**Key rules for `@theme` block:**
- Colors MUST use the `--color-*` prefix so Tailwind generates `bg-*`, `text-*`, `border-*` utilities
- Radius MUST use the `--radius-*` prefix so Tailwind generates `rounded-*` utilities
- Prefer OKLCH color format for better perceptual uniformity
- If the Pencil file has hex values, convert them to OKLCH

### Component Code

For each reusable Pencil component, generate a component file using the CVA + `cn()` pattern:

```tsx
// components/ui/status-badge.tsx
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const statusBadgeVariants = cva(
  "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium",
  {
    variants: {
      status: {
        active: "bg-primary text-primary-foreground",
        inactive: "bg-muted text-muted-foreground",
        error: "bg-destructive text-destructive-foreground",
      },
    },
    defaultVariants: {
      status: "active",
    },
  }
)

interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusBadgeVariants> {}

export function StatusBadge({ className, status, ...props }: StatusBadgeProps) {
  return (
    <span className={cn(statusBadgeVariants({ status, className }))} {...props} />
  )
}
```

Notice:
- All colors use semantic Tailwind classes (`bg-primary`, `text-muted-foreground`)
- All radii use semantic classes (`rounded-md`)
- No arbitrary values anywhere
- Uses `cn()` from `@/lib/utils` for class merging
- React 19 style (no `forwardRef`)

### Page/Screen Code

For the screen layout, generate a page component that:
- Imports shadcn/ui components matching the Pencil design system components
- Uses semantic Tailwind classes for all style values
- Matches the Pencil node tree structure (vertical/horizontal → flex-col/flex-row)

```tsx
// app/dashboard/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, Search } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header - from Pencil NavBar component */}
      <header className="flex items-center justify-between border-b border-border px-6 py-4">
        <h1 className="text-lg font-semibold text-foreground">Dashboard</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search..." />
        </div>
      </header>

      {/* Content - from Pencil layout */}
      <main className="flex-1 p-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-card-foreground">Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">$45,231</p>
              <p className="text-sm text-muted-foreground">+20% from last month</p>
            </CardContent>
          </Card>
          {/* ... more cards */}
        </div>

        <Button className="mt-6">
          View Details <ArrowRight className="ml-2 size-4" />
        </Button>
      </main>
    </div>
  )
}
```

## Step 7: Sync Variables Back (Optional)

If the design tokens were updated in code, sync them back:

```
pencil_set_variables({
  filePath: "path/to/file.pen",
  variables: { ... }
})
```

## Responsive Code from Multi-Artboard Designs

If the Pencil file has artboards at multiple widths (e.g., 375px mobile, 768px tablet, 1280px desktop):

1. Read all artboards and compare their structures
2. Generate mobile-first code (base styles match the smallest artboard)
3. Add Tailwind breakpoint prefixes (`md:`, `lg:`, `xl:`) for larger layouts
4. Never hardcode artboard pixel widths — use `w-full`, `max-w-7xl`, responsive grid columns

See [responsive-breakpoints.md](responsive-breakpoints.md) for the complete artboard-to-breakpoint mapping, responsive patterns, and anti-patterns.

## Code Generation Rules

### Layout Mapping (Pencil -> Tailwind)

| Pencil Property | Tailwind Class |
|----------------|----------------|
| `layout: "vertical"` | `flex flex-col` |
| `layout: "horizontal"` | `flex flex-row` or `flex` |
| `gap: 4` | `gap-1` |
| `gap: 8` | `gap-2` |
| `gap: 12` | `gap-3` |
| `gap: 16` | `gap-4` |
| `gap: 20` | `gap-5` |
| `gap: 24` | `gap-6` |
| `gap: 32` | `gap-8` |
| `padding: 8` | `p-2` |
| `padding: 12` | `p-3` |
| `padding: 16` | `p-4` |
| `padding: 20` | `p-5` |
| `padding: 24` | `p-6` |
| `padding: 32` | `p-8` |
| `paddingLeft: 16, paddingRight: 16` | `px-4` |
| `paddingTop: 24, paddingBottom: 24` | `py-6` |
| `width: "fill_container"` | `w-full` or `flex-1` |
| `height: "fill_container"` | `h-full` or `flex-1` |
| `cornerRadius` (via `radius-md` var) | `rounded-md` |
| `alignItems: "center"` | `items-center` |
| `alignItems: "start"` | `items-start` |
| `alignItems: "end"` | `items-end` |
| `justifyContent: "center"` | `justify-center` |
| `justifyContent: "space-between"` | `justify-between` |
| `justifyContent: "end"` | `justify-end` |

### Typography Mapping (Pencil -> Tailwind)

| Pencil Property | Tailwind Class |
|----------------|----------------|
| `fontSize: 12` | `text-xs` |
| `fontSize: 14` | `text-sm` |
| `fontSize: 16` | `text-base` |
| `fontSize: 18` | `text-lg` |
| `fontSize: 20` | `text-xl` |
| `fontSize: 24` | `text-2xl` |
| `fontSize: 30` | `text-3xl` |
| `fontSize: 36` | `text-4xl` |
| `fontSize: 48` | `text-5xl` |
| `fontWeight: "400"` | `font-normal` |
| `fontWeight: "500"` | `font-medium` |
| `fontWeight: "600"` | `font-semibold` |
| `fontWeight: "700"` | `font-bold` |

See [tailwind-shadcn-mapping.md](tailwind-shadcn-mapping.md) for the full quick-reference table including all layout, color, radius, typography, and icon mappings.

### Color Mapping (Pencil -> Tailwind)

| Pencil Style | Tailwind Class |
|-------------|----------------|
| `fill` bound to `primary` | `bg-primary` |
| `fill` bound to `background` | `bg-background` |
| `fill` bound to `card` | `bg-card` |
| `textColor` bound to `foreground` | `text-foreground` |
| `textColor` bound to `muted-foreground` | `text-muted-foreground` |
| `textColor` bound to `primary-foreground` | `text-primary-foreground` |
| `strokeColor` bound to `border` | `border-border` |

### Always Do

- Load the `frontend-design` skill and apply its aesthetic guidelines to the generated code
- Use semantic Tailwind utilities (`bg-primary`, `text-foreground`, `rounded-lg`)
- Map Pencil reusable components to shadcn/ui components where a match exists
- Use CVA for custom components with variants
- Use `cn()` from `@/lib/utils` for conditional class merging
- Use Lucide icons instead of Pencil's Material Icons (see icon mapping below)
- Use `@theme { --color-* }` for color tokens, `@theme { --radius-* }` for radii
- Map `ref` instances to component usages with the appropriate variant/size props
- Generate TypeScript (not JavaScript)
- Use React 19 patterns (ref as prop, no `forwardRef`)

### Never Do

- Use arbitrary value syntax: `bg-[#3b82f6]`, `text-[var(--primary)]`, `rounded-[6px]`
- Use `var(--primary)` in className strings
- Hardcode hex colors or pixel radii in class names
- Inline all styles when a shadcn/ui component exists
- Ignore the component hierarchy from the design tree
- Generate a single monolithic file for a multi-component screen
- Use `tailwind.config.ts` (Tailwind v4 uses CSS `@theme`)
- Use `@tailwind base/components/utilities` (v4 uses `@import "tailwindcss"`)
- Use `forwardRef` (React 19 passes ref as a regular prop)
- Skip the `frontend-design` skill — it is mandatory for both design and code generation
- Produce generic AI aesthetics (overused fonts, cliched color schemes, predictable layouts)

## Icon Library Mapping

Pencil uses Material Icons by default. Map them to Lucide icons:

| Pencil Icon (Material) | Lucide Import | Component |
|------------------------|---------------|-----------|
| `search` | `lucide-react` | `<Search />` |
| `close` | `lucide-react` | `<X />` |
| `menu` | `lucide-react` | `<Menu />` |
| `arrow_forward` | `lucide-react` | `<ArrowRight />` |
| `arrow_back` | `lucide-react` | `<ArrowLeft />` |
| `person` | `lucide-react` | `<User />` |
| `settings` | `lucide-react` | `<Settings />` |
| `home` | `lucide-react` | `<Home />` |
| `notifications` | `lucide-react` | `<Bell />` |
| `edit` | `lucide-react` | `<Pencil />` |
| `delete` | `lucide-react` | `<Trash2 />` |
| `add` | `lucide-react` | `<Plus />` |
| `check` | `lucide-react` | `<Check />` |
| `visibility` | `lucide-react` | `<Eye />` |
| `visibility_off` | `lucide-react` | `<EyeOff />` |
| `chevron_right` | `lucide-react` | `<ChevronRight />` |
| `chevron_down` | `lucide-react` | `<ChevronDown />` |
| `more_vert` | `lucide-react` | `<MoreVertical />` |
| `more_horiz` | `lucide-react` | `<MoreHorizontal />` |
| `mail` | `lucide-react` | `<Mail />` |
| `calendar_today` | `lucide-react` | `<Calendar />` |
| `favorite` | `lucide-react` | `<Heart />` |
| `star` | `lucide-react` | `<Star />` |
| `download` | `lucide-react` | `<Download />` |
| `upload` | `lucide-react` | `<Upload />` |
| `filter_list` | `lucide-react` | `<Filter />` |
| `sort` | `lucide-react` | `<ArrowUpDown />` |
| `logout` | `lucide-react` | `<LogOut />` |

All Lucide icons accept a `className` prop for sizing: `<Search className="size-4" />`.

## Utility Setup

Ensure `lib/utils.ts` exists:

```typescript
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```
