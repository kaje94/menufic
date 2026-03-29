# Design System Components

## Why This Matters

Pencil design files often contain a design system with reusable components (buttons, cards, inputs, navbars, etc.) marked with `reusable: true`. These are equivalent to Figma components or React components. When you recreate a component from scratch instead of reusing the existing one:

- The design becomes inconsistent (slightly different padding, colors, fonts)
- Changes to the design system don't propagate to your new element
- Code generation produces duplicated, non-DRY component code
- The design file grows with redundant elements

## Step-by-Step: Discovering and Using Components

### Step 1: List All Reusable Components

Always do this at the start of any design task:

```
pencil_batch_get({
  filePath: "path/to/file.pen",
  patterns: [{ reusable: true }],
  readDepth: 2,
  searchDepth: 3
})
```

This returns all components with their children (depth 2), searched up to 3 levels deep. You'll see components like:

```json
{
  "id": "btn-primary",
  "name": "Button",
  "type": "frame",
  "reusable": true,
  "children": [
    { "id": "btn-label", "type": "text", "content": "Button" }
  ]
}
```

### Step 2: Identify the Right Component

Look for components that match your need:
- **Name matching**: "Button", "Card", "Input", "NavBar", "Avatar", etc.
- **Structure matching**: If you need a card with image + title + description, look for a component with that structure
- **Variant matching**: Some design systems have multiple variants (e.g., "Button Primary", "Button Secondary")

### Step 3: Insert as a Ref Instance

Use the component's ID as the `ref` value:

```javascript
// Insert a button instance
btn=I("parentFrameId", { type: "ref", ref: "btn-primary", width: "fill_container" })
```

This creates a connected instance. Edits to the main component will propagate to this instance.

### Step 4: Customize the Instance

Override specific properties on the instance's descendants:

```javascript
// Change the button label text
U(btn+"/btn-label", { content: "Submit" })
```

For deeper customization, use the Update operation on nested paths:

```javascript
// Update nested content: instanceId/descendantId
U(btn+"/icon-container/icon", { content: "arrow_forward" })
```

### Step 5: Replace Slots

If a component has placeholder/slot areas, use Replace to swap content:

```javascript
// Replace a slot inside the component instance
newContent=R(btn+"/content-slot", { type: "text", content: "Custom Content" })
```

## When to Create a New Component

Only create a new component from scratch when:

1. **No similar component exists** in the design system after checking `reusable: true`
2. **The existing component is fundamentally different** (not just a color or text change)
3. **You're building a new design system** from an empty file

When creating a new component, consider making it reusable for future use by setting `reusable: true`.

## Design System Discovery Checklist

Before designing any element, answer these questions:

- [ ] Have I called `pencil_batch_get` with `{ reusable: true }` to list components?
- [ ] Have I checked if a matching component exists for: buttons, inputs, cards, navbars, headers, footers, modals, badges, avatars, tables?
- [ ] Am I inserting components as `ref` instances (not recreating the structure)?
- [ ] Am I customizing instances via `U()` on descendant paths (not replacing the whole thing)?

## Common Design System Components to Look For

| Need | Search for names containing |
|------|----------------------------|
| Button | button, btn, cta |
| Text input | input, field, text-field |
| Card | card, tile, panel |
| Navigation | nav, navbar, sidebar, menu |
| Header | header, topbar, appbar |
| Footer | footer, bottom-bar |
| Modal/Dialog | modal, dialog, sheet |
| Badge/Tag | badge, tag, chip, label |
| Avatar | avatar, profile-pic |
| Table row | row, table-row, list-item |
| Icon | icon, symbol |
| Checkbox/Radio | checkbox, radio, toggle, switch |
| Select/Dropdown | select, dropdown, picker |
| Tab | tab, tab-bar, segment |

## See Also

- [variables-and-tokens.md](variables-and-tokens.md) — Use variables when styling component instances
- [design-to-code-workflow.md](design-to-code-workflow.md) — Map reusable components to shadcn/ui
- [tailwind-shadcn-mapping.md](tailwind-shadcn-mapping.md) — Pencil component -> shadcn/ui component table
