# Layout and Text Overflow

## Why This Matters

Text and content overflowing outside its parent container or the artboard is one of the most common and visible design defects. It produces:

- Unreadable, clipped text
- Broken layouts on mobile screens
- Code that requires manual overflow fixes
- An unprofessional, broken appearance

This is especially critical for mobile designs where the artboard is typically only 375-393px wide.

## Prevention Strategy

### For Text Elements

1. **Always set text width to fill its container**:
   ```javascript
   text=I(container, { type: "text", content: "Long text...", width: "fill_container" })
   ```

2. **Use appropriate text properties**:
   - Set `maxLines` for text that should truncate (e.g., card titles, list items)
   - Long paragraphs should wrap naturally within their container
   - Headings that are too long should either wrap or be truncated with ellipsis

3. **Never use fixed pixel widths wider than the parent** on text elements

### For Container Frames

1. **Use auto-layout** (`layout: "vertical"` or `layout: "horizontal"`) on parent frames so children flow naturally

2. **Constrain children to parent width**:
   ```javascript
   child=I(parent, { type: "frame", width: "fill_container", layout: "vertical" })
   ```

3. **Set padding on parent frames** to prevent content from touching edges:
   ```javascript
   U("parentId", { padding: 16 })
   // or per-side: paddingLeft, paddingRight, paddingTop, paddingBottom
   ```

4. **Use `gap` for spacing between children** instead of margin hacks:
   ```javascript
   U("parentId", { layout: "vertical", gap: 12 })
   ```

### For Mobile Screens (375-393px)

Mobile layouts are the most prone to overflow. Extra care required:

1. **Screen frame**: Set to exactly the target width (e.g., 375px)
2. **All direct children**: Use `width: "fill_container"` with horizontal padding (16-20px)
3. **Text**: Always `width: "fill_container"`, never a fixed width wider than ~335px (375 - 2*20 padding)
4. **Images**: Constrain to container width or use `width: "fill_container"`
5. **Horizontal scroll areas**: Only use intentionally (e.g., carousels), never by accident

### For Nested Components

When inserting a `ref` component instance:

1. Set the instance width to `"fill_container"` if it should fill its parent:
   ```javascript
   card=I(container, { type: "ref", ref: "CardComponent", width: "fill_container" })
   ```

2. Verify the component's internal layout handles different widths correctly

## Detection: Post-Build Verification

After inserting content, always check for overflow:

```
pencil_snapshot_layout({
  filePath: "path/to/file.pen",
  parentId: "screenId",
  maxDepth: 3,
  problemsOnly: true
})
```

This returns only nodes with layout problems:
- **Clipped elements**: Children extending beyond parent bounds
- **Overlapping elements**: Siblings overlapping unintentionally
- **Overflow**: Content wider or taller than its container

### Interpreting Results

If `problemsOnly` returns results, fix each issue:

| Problem | Likely Fix |
|---------|-----------|
| Text clipped horizontally | Set text `width: "fill_container"` or reduce font size |
| Text clipped vertically | Increase parent height, use auto-height, or set `maxLines` |
| Child wider than parent | Set child `width: "fill_container"` instead of fixed width |
| Children overlapping | Add `layout: "vertical"` or `layout: "horizontal"` to parent |
| Content outside artboard | Reduce widths/padding, check all descendants fit within screen width |

## Fix Patterns

### Fix: Text Overflowing Parent

```javascript
// Before: fixed width wider than parent
U("textNodeId", { width: "fill_container" })
```

### Fix: Children Overflowing Frame

```javascript
// Add auto-layout so children stack instead of overlapping
U("parentFrameId", { layout: "vertical", gap: 8 })
// Make children fill parent width
U("child1Id", { width: "fill_container" })
U("child2Id", { width: "fill_container" })
```

### Fix: Content Touching Screen Edges

```javascript
// Add horizontal padding to the screen's content container
U("contentContainerId", { paddingLeft: 16, paddingRight: 16 })
```

### Fix: Long Title Truncation

```javascript
// Truncate to single line with ellipsis
U("titleTextId", { maxLines: 1, width: "fill_container" })
```

## Checklist

After every section of a design:

- [ ] Have I called `pencil_snapshot_layout` with `problemsOnly: true`?
- [ ] Are all text elements using `width: "fill_container"` inside auto-layout parents?
- [ ] Do mobile screens have appropriate padding (16-20px)?
- [ ] Are long titles/descriptions set with `maxLines` for truncation?
- [ ] Do all child frames use `width: "fill_container"` (not fixed widths wider than parent)?
- [ ] Have I verified the full screen with `pencil_get_screenshot`?

## See Also

- [visual-verification.md](visual-verification.md) — Screenshot verification workflow to catch visual overflow
- [responsive-breakpoints.md](responsive-breakpoints.md) — Mobile-specific layout constraints and patterns
