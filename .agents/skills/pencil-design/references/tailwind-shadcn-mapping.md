# Tailwind + shadcn/ui Mapping Reference

Quick-reference mapping from Pencil design properties to Tailwind v4 + shadcn/ui code. Use this when generating code from Pencil designs.

## Color Tokens

### Pencil Variable -> Tailwind Utility

| Pencil Variable | Background | Text | Border |
|----------------|-----------|------|--------|
| `primary` | `bg-primary` | `text-primary` | `border-primary` |
| `primary-foreground` | `bg-primary-foreground` | `text-primary-foreground` | — |
| `secondary` | `bg-secondary` | `text-secondary` | `border-secondary` |
| `secondary-foreground` | — | `text-secondary-foreground` | — |
| `background` | `bg-background` | — | — |
| `foreground` | — | `text-foreground` | — |
| `muted` | `bg-muted` | — | — |
| `muted-foreground` | — | `text-muted-foreground` | — |
| `accent` | `bg-accent` | — | — |
| `accent-foreground` | — | `text-accent-foreground` | — |
| `destructive` | `bg-destructive` | `text-destructive` | `border-destructive` |
| `destructive-foreground` | — | `text-destructive-foreground` | — |
| `card` | `bg-card` | — | — |
| `card-foreground` | — | `text-card-foreground` | — |
| `border` | — | — | `border-border` |
| `ring` | — | — | `ring-ring` |

**`@theme` rule**: All color variables use `--color-` prefix: `--color-primary`, `--color-border`, etc.

### Common Combinations

| Design Intent | Tailwind Classes |
|--------------|-----------------|
| Primary button | `bg-primary text-primary-foreground` |
| Secondary button | `bg-secondary text-secondary-foreground` |
| Destructive button | `bg-destructive text-destructive-foreground` |
| Ghost button | `hover:bg-accent hover:text-accent-foreground` |
| Outline button | `border border-border bg-background hover:bg-accent` |
| Card surface | `bg-card text-card-foreground border border-border` |
| Muted text | `text-muted-foreground` |
| Page background | `bg-background text-foreground` |
| Input field | `border border-border bg-background text-foreground placeholder:text-muted-foreground` |
| Badge | `bg-primary text-primary-foreground` or `bg-secondary text-secondary-foreground` |

## Radius Tokens

| Pencil Variable | `@theme` Declaration | Tailwind Utility |
|----------------|---------------------|------------------|
| `radius-sm` | `--radius-sm: 0.25rem` | `rounded-sm` |
| `radius-md` | `--radius-md: 0.375rem` | `rounded-md` |
| `radius-lg` | `--radius-lg: 0.5rem` | `rounded-lg` |
| `radius-xl` | `--radius-xl: 0.75rem` | `rounded-xl` |

## Layout Properties

| Pencil Property | Tailwind Class |
|----------------|----------------|
| `layout: "vertical"` | `flex flex-col` |
| `layout: "horizontal"` | `flex` or `flex flex-row` |
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
| `width: "fill_container"` | `w-full` |
| `height: "fill_container"` | `h-full` or `flex-1` |
| `alignItems: "center"` | `items-center` |
| `alignItems: "start"` | `items-start` |
| `alignItems: "end"` | `items-end` |
| `justifyContent: "center"` | `justify-center` |
| `justifyContent: "space-between"` | `justify-between` |
| `justifyContent: "end"` | `justify-end` |

## Typography

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

## Pencil Component -> shadcn/ui Mapping

| Pencil Component | shadcn/ui | Key Classes |
|-----------------|-----------|-------------|
| Button | `<Button>` | `bg-primary text-primary-foreground rounded-md` |
| Card | `<Card>` | `rounded-lg border border-border bg-card text-card-foreground shadow-sm` |
| Input | `<Input>` | `rounded-md border border-border bg-background` |
| Select | `<Select>` | Uses Radix primitives |
| Badge | `<Badge>` | `rounded-md bg-primary text-primary-foreground` |
| Avatar | `<Avatar>` | `rounded-full` |
| Separator | `<Separator>` | `bg-border` |
| Switch | `<Switch>` | Uses Radix primitives |
| Checkbox | `<Checkbox>` | Uses Radix primitives |
| Dialog | `<Dialog>` | `bg-background border border-border rounded-lg shadow-lg` |
| Tabs | `<Tabs>` | `bg-muted rounded-md` (for TabsList) |
| Table | `<Table>` | `border-border text-foreground` |
| Tooltip | `<Tooltip>` | `bg-primary text-primary-foreground rounded-md` |
| Label | `<Label>` | `text-sm font-medium` |

## Icon Mapping (Material -> Lucide)

| Pencil (Material) | Lucide Component | Size Class |
|-------------------|-----------------|------------|
| `search` | `<Search />` | `size-4` or `size-5` |
| `close` | `<X />` | `size-4` |
| `menu` | `<Menu />` | `size-5` |
| `arrow_forward` | `<ArrowRight />` | `size-4` |
| `arrow_back` | `<ArrowLeft />` | `size-4` |
| `person` | `<User />` | `size-4` |
| `settings` | `<Settings />` | `size-4` |
| `home` | `<Home />` | `size-4` or `size-5` |
| `notifications` | `<Bell />` | `size-4` |
| `edit` | `<Pencil />` | `size-4` |
| `delete` | `<Trash2 />` | `size-4` |
| `add` | `<Plus />` | `size-4` |
| `check` | `<Check />` | `size-4` |
| `visibility` | `<Eye />` | `size-4` |
| `visibility_off` | `<EyeOff />` | `size-4` |
| `chevron_right` | `<ChevronRight />` | `size-4` |
| `chevron_down` | `<ChevronDown />` | `size-4` |
| `more_vert` | `<MoreVertical />` | `size-4` |
| `more_horiz` | `<MoreHorizontal />` | `size-4` |
| `favorite` | `<Heart />` | `size-4` |
| `star` | `<Star />` | `size-4` |
| `download` | `<Download />` | `size-4` |
| `upload` | `<Upload />` | `size-4` |
| `filter_list` | `<Filter />` | `size-4` |
| `sort` | `<ArrowUpDown />` | `size-4` |
| `mail` | `<Mail />` | `size-4` |
| `calendar_today` | `<Calendar />` | `size-4` |
| `logout` | `<LogOut />` | `size-4` |

## Anti-Patterns

These patterns indicate a code generation error. If you see them, fix immediately:

```
WRONG                           RIGHT
─────                           ─────
bg-[#3b82f6]                    bg-primary
text-[#ffffff]                  text-primary-foreground
text-[var(--primary)]           text-primary
bg-[var(--secondary)]           bg-secondary
rounded-[6px]                   rounded-md
rounded-[var(--radius-md)]      rounded-md
border-[#e2e8f0]                border-border
ring-[var(--ring)]              ring-ring
border-[1px]                    border
opacity-[0.5]                   opacity-50
gap-[16px]                      gap-4
p-[24px]                        p-6
text-[14px]                     text-sm
```

## See Also

- [design-to-code-workflow.md](design-to-code-workflow.md) — Complete step-by-step code generation workflow
- [variables-and-tokens.md](variables-and-tokens.md) — How to read and map Pencil design tokens
- [responsive-breakpoints.md](responsive-breakpoints.md) — Artboard sizes to Tailwind breakpoints
