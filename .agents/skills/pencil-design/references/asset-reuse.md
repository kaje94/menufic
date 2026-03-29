# Asset Reuse

## Why This Matters

AI image generation is non-deterministic. Every time you generate a logo, it will look different. If a project already has a logo on one screen, generating a new one for another screen creates visual inconsistency - the app appears to have two different brands.

The same applies to:
- Product images used across multiple screens
- Illustrations or decorative graphics
- Brand elements (logos, wordmarks, icons)
- Profile photos or avatars used in different contexts

## Step-by-Step: Finding and Reusing Assets

### Step 1: Search for Existing Assets

Before generating any image, search the document for existing ones:

```
pencil_batch_get({
  filePath: "path/to/file.pen",
  patterns: [{ name: "logo" }],
  searchDepth: 5
})
```

Search with multiple name patterns to cast a wide net:

```
pencil_batch_get({
  filePath: "path/to/file.pen",
  patterns: [
    { name: "logo" },
    { name: "brand" },
    { name: "icon" },
    { name: "image" }
  ],
  searchDepth: 5
})
```

You can also search by node type for frames that might contain image fills:

```
pencil_batch_get({
  filePath: "path/to/file.pen",
  patterns: [{ type: "frame", name: "logo|brand|hero" }],
  searchDepth: 5
})
```

### Step 2: Copy the Existing Asset

When you find an existing logo or image asset, copy it:

```javascript
// Copy the logo from another artboard into the current screen
logoCopy=C("existingLogoNodeId", "targetParentId", { width: 120, height: 40 })
```

The Copy operation (`C()`) creates a duplicate of the node, preserving its image fill, styling, and structure.

For reusable components that contain logos (e.g., a header component with a built-in logo), insert the component as a ref:

```javascript
// Insert the entire header component which already contains the logo
header=I("screenId", { type: "ref", ref: "HeaderComponent", width: "fill_container" })
```

### Step 3: Adjust Size and Position

After copying, you may need to resize:

```javascript
U("copiedLogoId", { width: 100, height: 32 })
```

Or adjust position within the new context.

## When to Generate New Images

Only use the `G()` (Generate) operation when:

1. **No similar asset exists** anywhere in the document
2. **The image is genuinely unique** to this screen (e.g., a specific hero photo, a unique illustration)
3. **You're building the first screen** and no assets exist yet

```javascript
// Only when no existing asset matches
heroImg=I("heroSection", { type: "frame", name: "Hero Image", width: "fill_container", height: 400 })
G(heroImg, "stock", "modern office workspace")
```

## Logo-Specific Rules

Logos have the strictest reuse requirements:

1. **ALWAYS search first** - A logo should exist if any other screen in the document has been designed
2. **ALWAYS copy** - Never generate a new logo if one exists. Generated logos will never match.
3. **Keep proportions** - When resizing a copied logo, maintain aspect ratio
4. **Check both artboards and components** - The logo might be inside a reusable header/navbar component

## Decision Tree

```
Need an image/logo?
├── Is it a logo or brand element?
│   ├── Does one exist elsewhere in the doc? -> COPY IT
│   └── First screen, nothing exists? -> Generate or ask user for asset
├── Is it a product photo / hero image?
│   ├── Same image used on another screen? -> COPY IT
│   └── Unique to this screen? -> Generate with G() or use stock
└── Is it an icon?
    ├── Exists in design system components? -> Use the component ref
    └── New icon needed? -> Use icon_font type or generate
```

## Checklist

Before generating any image:

- [ ] Have I searched for existing logos/images with `pencil_batch_get`?
- [ ] Have I searched using name patterns like `logo`, `brand`, `image`, `hero`?
- [ ] Have I checked if a reusable component (navbar, header) already contains the logo?
- [ ] Am I copying existing assets instead of regenerating them?
- [ ] For logos specifically: am I absolutely sure no logo exists in the document?

## See Also

- [design-system-components.md](design-system-components.md) — Check reusable components that may contain logos/icons
- [visual-verification.md](visual-verification.md) — Verify copied assets look correct after placement
