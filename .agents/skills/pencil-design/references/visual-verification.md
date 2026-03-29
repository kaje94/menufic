# Visual Verification

## Why This Matters

Layout and spacing issues are invisible in the node tree. The only way to catch them is to look at the rendered output. Common issues that only screenshots reveal:

- Misaligned elements that seem correct in the tree
- Spacing that is technically valid but visually unbalanced
- Text that renders differently than expected (wrong font size, weight, color contrast)
- Colors that look wrong together despite individual correctness
- Missing content or empty areas
- Broken component instances

## Verification Workflow

### Section-by-Section Verification

Do NOT build an entire screen and then verify at the end. Verify after each logical section:

```
Build header    -> Screenshot header    -> Fix issues
Build hero      -> Screenshot hero      -> Fix issues  
Build features  -> Screenshot features  -> Fix issues
Build footer    -> Screenshot footer    -> Fix issues
Final           -> Screenshot full page -> Final review
```

### Step 1: Take a Screenshot

After completing a section:

```
pencil_get_screenshot({
  filePath: "path/to/file.pen",
  nodeId: "sectionNodeId"
})
```

For the full screen at the end:

```
pencil_get_screenshot({
  filePath: "path/to/file.pen",
  nodeId: "screenNodeId"
})
```

### Step 2: Analyze the Screenshot

Look for these specific issues:

**Alignment**
- Are elements properly centered or left/right aligned?
- Do columns have equal widths?
- Are grid items consistently spaced?

**Spacing**
- Is there adequate padding inside containers?
- Are gaps between elements consistent?
- Does the spacing follow an 8px grid or the design system's spacing scale?

**Typography**
- Is text readable (sufficient size and contrast)?
- Are headings visually distinct from body text?
- Is any text cut off, overlapping, or overflowing?

**Color and Contrast**
- Do colors match the design system variables?
- Is there sufficient contrast for readability?
- Does the color scheme feel cohesive?

**Completeness**
- Are all expected elements present?
- Are icons/images placed correctly?
- Are there any empty or broken areas?

### Step 3: Check Layout Problems

In parallel with the screenshot, run layout checks:

```
pencil_snapshot_layout({
  filePath: "path/to/file.pen",
  parentId: "sectionNodeId",
  maxDepth: 3,
  problemsOnly: true
})
```

This catches programmatic issues the screenshot might not make obvious:
- Clipped elements (content extends beyond parent bounds)
- Overlapping siblings
- Elements positioned outside their parent

### Step 4: Fix and Re-verify

If issues are found:

1. Fix each issue using `pencil_batch_design` with `U()` operations
2. Take a new screenshot to confirm the fix
3. Run `pencil_snapshot_layout` again to confirm no new issues

## When to Take Screenshots

| Moment | What to Screenshot |
|--------|--------------------|
| After building a section | The section's root frame |
| After fixing an issue | The affected area |
| When design is complete | The full screen/artboard |
| After modifying an existing design | The changed section |
| After bulk property updates | At least one affected area |
| When comparing variants | Both variants side by side |

## Full-Screen Final Review Checklist

When taking the final full-screen screenshot:

- [ ] Does the overall visual hierarchy make sense?
- [ ] Are sections clearly separated?
- [ ] Is the spacing consistent from top to bottom?
- [ ] Does it look professional and polished?
- [ ] On mobile: does everything fit within the 375px frame?
- [ ] Are there any empty gaps or broken areas?
- [ ] Does the color scheme work as a whole?
- [ ] Is there adequate white space?

## Common Issues Found Only Through Screenshots

| Issue | Symptom in Screenshot |
|-------|----------------------|
| Wrong font weight | Text looks too thin or too bold compared to surroundings |
| Inconsistent padding | Some cards have more internal space than others |
| Color too similar to background | Element is hard to see or "disappears" |
| Alignment drift | Elements seem slightly off from each other |
| Missing gap | Two sections run directly into each other |
| Broken auto-layout | Children stack in unexpected direction |
| Icon too small/large | Icon is disproportionate to adjacent text |
| Image aspect ratio wrong | Image appears stretched or squished |

## See Also

- [layout-and-text-overflow.md](layout-and-text-overflow.md) — Fix patterns for common overflow issues
- [asset-reuse.md](asset-reuse.md) — Verify copied assets look correct after placement
