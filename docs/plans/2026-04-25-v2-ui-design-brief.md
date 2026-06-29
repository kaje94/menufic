# Menufic V2 — UI Design Brief

This document is a design brief for creating the visual UI designs for Menufic V2, a free digital menu generator for restaurant owners. The designer should use this as a guide to create high-fidelity mockups for all screens described below.

For full product requirements, refer to the companion document: `v2-product-spec.md`

---

> **⚠️ Color & typography superseded (2026-06-28).** The light-mode / warm-paper background and DM Serif + DM Sans choices below are replaced by the **dark cinematic design system** in `DESIGN.md` — see [ADR-0001](../adr/0001-dark-cinematic-design-system.md). The design *philosophy* (food is the hero; warm, crafted, confident; Menufic supports, never competes) still holds — only the light/paper colour and the DM typography are retired. Sections 3–7 (components, screens, motion) remain valid.

## 1. Design Philosophy & Color Direction

### Design Philosophy

- **Aesthetic direction:** Warm & appetizing — food-forward, rich earth tones, editorial feel
- **Personality:** Elegant, Trustworthy, Modern, Crafted, Confident, Warm
- **Audience:** Restaurant owners of all kinds — from a family-run cafe to an upscale bistro. The design should feel premium enough for fine dining but approachable enough for a street food stall.
- **Key principle:** The UI should get out of the way and let the restaurant's content (food images, menu items) be the star. Menufic's own brand is confident but restrained — it supports, never competes with, the restaurant's identity.

### Color Direction

- **Mood:** Warm earth tones — terracotta, warm grays, muted natural accents. Not cold, not corporate. Think specialty coffee shop branding, not SaaS dashboard.
- **Primary:** A warm, appetizing hue — terracotta/brick/warm rose family
- **Neutrals:** Warm grays with a slight brown or taupe undertone. Page background should feel like natural paper, not sterile white.
- **Semantic colors:** Success (muted green), warning (warm amber), error (warm red), info (muted teal) — all should feel cohesive with the warm palette
- **Light mode only** — no dark theme for the Menufic app
- **Public restaurant menus** use fully owner-customized themes (not Menufic's palette)
- **Designer decides** the exact color palette, hex values, and tonal scale

---

## 2. Typography, Spacing & Motion

### Typography

- **Display font:** DM Serif Display — for hero headings and high-impact text
- **Body font:** DM Sans — for all UI text, body copy, labels, buttons
- Designer to define the full type scale, weights, and line heights

### Spacing & Layout

- Designer to define spacing scale and corner radius
- **General guidance:** Generous whitespace throughout. The design should breathe — menus are content-dense so readability matters. Avoid cramped layouts.

### Shadows & Motion

- Shadows: designer's discretion, keep them subtle and warm-tinted
- **Motion is important** — the app should feel alive and polished. Micro-interactions on buttons/toggles, smooth transitions for modals/drawers/page changes, carousel animations. Designer to define the motion system (durations, easing curves).

---

## 3. Component Library

### Buttons

- **Variants:** Primary (filled), Secondary (outlined), Ghost (text only), Destructive (for delete/remove actions)
- **Sizes:** sm, md, lg
- **States:** default, hover, active, disabled, loading (with spinner)
- Should feel tactile — subtle scale or shadow shift on hover/press

### Inputs

- Text input, textarea, select/dropdown
- Search input (with search icon)
- File/image upload area (drag-and-drop zone with preview)
- Color picker (for theme customization)
- Font selector dropdown (with font preview in each option)
- Radius slider (for theme customization)
- All inputs should have: placeholder, focus ring, error state with message, disabled state

### Cards

- **Restaurant card** — cover image, restaurant name, location, publish status badge, edit/delete menu
- **Menu item card** — thumbnail image, name, price, description (truncated), status badge (sold out). Clickable to expand.
- **Stat card** — icon, metric value, label, trend indicator (arrow + percentage)
- **Feature card** — icon/illustration, title, description (for landing page)
- **Action card** — icon, title, subtitle. Clickable. Used in dashboard for navigation (e.g., "Menus", "Banners", "Analytics")
- **Add new card** — dashed border, plus icon, title. Used for "Add new restaurant"

### Navigation

- **Top navbar** — logo (left), nav links (center or left-aligned), user avatar with dropdown (right). Sticky.
- **Sidebar** — for dashboard pages. Collapsible. Shows: restaurant list, active restaurant's sub-pages (Menus, Banners, Theme, Analytics, Team). Active state indicator.
- **Breadcrumbs** — for drill-down pages (Dashboard > Restaurant Name > Menus)
- **Tabs** — horizontal, for switching menus on the public view and within the editor
- **Mobile:** responsive — sidebar collapses to hamburger menu, navbar adapts

### Modals & Overlays

- **Modal** — centered, backdrop blur, for item detail view and confirmations
- **Drawer** — slides in from right, for forms (create/edit restaurant, menu item, etc.)
- **Dropdown menu** — for user avatar menu, edit/delete options on cards
- **Toast notifications** — bottom-right, for success/error/info feedback. Auto-dismiss.
- **Confirmation dialog** — small modal for destructive actions (delete restaurant, remove member, transfer ownership)

### Data Display

- **Table** — for admin portal (review queue, restaurant list, members list). Sortable columns, row actions.
- **Charts** — line chart (views over time), bar chart (popular items, peak hours), donut chart (device breakdown). Warm color palette matching the brand.
- **Badge** — small pill for status: Published (green), Pending Review (amber), Rejected (red), Draft (gray), Sold Out (red outline), New/Popular/Chef's Special (brand color variants)
- **Avatar** — circular, user photo with initials fallback
- **Empty state** — illustration + descriptive text + CTA button (e.g., "No menus yet. Create your first menu.")

### Feedback

- Loading: skeleton loaders for content areas, dot spinner for buttons/actions
- Progress indicator for image uploads
- Status badges (as defined above)

---

## 4. Screens — Landing Page & Auth

### Landing Page

#### Hero Section (high priority — first impression)

- Full-width, generous height (near viewport height)
- Large DM Serif Display headline — owner-focused messaging (e.g., "The easiest way to create a digital menu for your restaurant")
- Subtext in DM Sans reinforcing simplicity and that it's free
- Prominent "Get Started" CTA button
- Hero image/mockup: a phone showing a beautiful restaurant menu, or a styled food photography composition. Should immediately communicate "digital menu" at a glance.
- **Floating feature bubbles (suggestion):** Consider small, rounded bubble elements floating around the hero image/mockup area, each highlighting a key feature — e.g., "Scan to preview", "Customize themes", "Track analytics", "Share via QR". Gentle, organic callouts that vary in size and float at different speeds to create depth. The goal is to reinforce what Menufic does at a glance. Designer is free to interpret this differently or replace with an alternative approach that achieves the same effect.
- Warm, textured background — subtle gradient or pattern, not flat white

#### Hero Animation & Motion

- **Staggered entrance:** Elements animate in sequentially — headline first, then subtext, then CTA button, then hero image/mockup. Each with a subtle fade-up + slight scale. Creates a cinematic reveal.
- **Floating bubbles entrance:** Bubbles fade in with stagger after the hero image appears — they pop in gently one by one from different directions, then settle into a slow continuous float (subtle up-down or orbital drift). Each bubble has a slightly different speed and amplitude to feel organic, not mechanical.
- **Hero image/mockup:** Gentle floating animation (slow subtle up-down drift) to feel alive even when idle. Or a slow parallax tilt responding to mouse movement.
- **Background:** Subtle animated gradient shift or floating decorative elements (soft blurred shapes drifting slowly) to add depth without distraction.
- **CTA button:** Subtle pulse or glow animation to draw attention after the entrance sequence completes.

#### How It Works

- 3 steps in a horizontal row (stacks vertically on mobile)
- Each step: numbered icon/illustration, short title, one-line description
- Steps: Create your restaurant → Build your menu → Share with a QR code

#### Features

- 4-6 key features in alternating layout (image left/text right, then flipped)
- Features to highlight: Theme Customization, Analytics & Insights, Team Management, QR Code Sharing, Instant Updates, Mobile-First Menus
- Each with a supporting illustration or screenshot mockup

#### Example Menus

- 2-3 interactive cards showing real demo menus with different themes applied
- Each card: restaurant image, name, cuisine type, "View Menu" link
- Scannable QR codes alongside (reinforces the product's core purpose)

#### Pricing

- Single centered card — bold "Free" with supporting text: "Menufic has been free since launch, over 3 years ago. No hidden fees. No premium tiers."
- Keep it simple and confident, not apologetic

#### Testimonials

- 3-4 testimonial cards in a row or carousel
- Each: quote text, person's name, restaurant name, photo (optional)

#### Footer

- Logo, navigation links (Privacy Policy, Terms & Conditions), contact email
- Subtle "Powered by Menufic" branding
- Copyright

#### Scroll-Triggered Animations (rest of the page)

- **How It Works:** Steps animate in one by one as the user scrolls into view — fade-up with slight stagger between each step.
- **Features:** Each feature block slides in from its image side (left-aligned image slides from left, right-aligned from right) as the section enters the viewport.
- **Example Menus:** Cards fade-up with stagger. Subtle hover animation — lift with shadow increase.
- **Pricing:** Card scales up gently from 95% to 100% with fade as it enters view.
- **Testimonials:** Cards fade in with stagger, or carousel auto-advances with smooth slide transition.
- All scroll animations trigger once when elements first enter the viewport, not on every scroll.
- Easing should feel natural and organic — no harsh or mechanical movements.
- Animations should be fast enough to feel responsive (300-500ms) but not so fast they're missed.
- Respect `prefers-reduced-motion` media query for accessibility.

### Auth / Sign In

- Centered card on a warm-toned background
- Menufic logo and tagline above
- Single "Sign in with Google" button — clean, prominent
- Minimal — no distractions, no form fields

---

## 5. Screens — Dashboard

### Dashboard — Restaurant List

- **Layout:** Sidebar (left) + main content area (right)
- **Sidebar:** Menufic logo at top, list of user's restaurants (with small thumbnail + name), "Settings" and "Sign Out" at bottom. Active restaurant highlighted. Collapsible on mobile to hamburger.
- **Main content:**
  - Page title: "My Restaurants"
  - Grid of restaurant cards (2-3 columns on desktop, 1 on mobile)
  - Each card: cover image, restaurant name, location, publish status badge
  - Hover: subtle lift, reveal edit/delete options
  - Last card slot: "Add new restaurant" card with dashed border and plus icon
- **Empty state:** If no restaurants yet — warm illustration, "Create your first restaurant" text, prominent CTA button

### Restaurant Management

- **Breadcrumb:** My Restaurants > Restaurant Name
- **Restaurant header area:** Cover image (editable), restaurant name, location, publish status badge, "Publish" / "Unpublish" button
- **Action cards grid** (2-3 columns):
  - **Menus** — icon, title, subtitle ("Create and organize your menus")
  - **Banners** — icon, title, subtitle ("Manage banner images")
  - **Theme** — icon, title, subtitle ("Customize your menu's look")
  - **Analytics** — icon, title, subtitle ("View visitor insights")
  - **Team** — icon, title, subtitle ("Manage members and roles")
  - **QR Code** — icon, title, subtitle ("Download and share your QR code")
- Each card is a navigation link to its sub-page

### Menu Editor

- **Breadcrumb:** My Restaurants > Restaurant Name > Menus
- **Two-panel layout:**
  - **Left panel (narrow):** List of menus. Each shows name + available time. Drag handle for reordering. "Add menu" button at bottom. Click to select.
  - **Right panel (wide):** Selected menu's categories and items
    - Category headers with drag handle, edit/delete options, "Add item" button
    - Under each category: list of menu items — each row shows thumbnail, name, price, status toggle (available/sold out/unavailable), drag handle, edit/delete
    - "Add category" button
- **Adding/editing:** Opens a drawer from the right with the form (name, description, price, image upload, status, tags)
- Drag-and-drop throughout for reordering menus, categories, and items

### Banner Manager

- **Breadcrumb:** My Restaurants > Restaurant Name > Banners
- Grid of banner images with drag handles for reordering
- Each banner: image preview, delete button (with confirmation)
- "Upload banner" card with drag-and-drop zone
- Max banner limit shown (e.g., "3 of 5 banners used")

---

## 6. Screens — Theme Customizer, Analytics & Team

### Theme Customizer

- **Breadcrumb:** My Restaurants > Restaurant Name > Theme
- **Two-panel layout:**
  - **Left panel (controls):**
    - **Preset selector:** Grid of preset theme thumbnails (8-12 options). Each shows a small preview card with the theme applied. Selected state with border/check.
    - **Font picker:** Dropdown showing font names rendered in their own font. Curated list of 10-15 Google Fonts.
    - **Primary color:** Color picker with preset swatches + custom hex input
    - **Corner radius:** Slider from sharp (0px) to rounded (16px) with live numeric value
    - **Save** and **Reset to preset** buttons at bottom
  - **Right panel (live preview):** Real-time preview of the public menu with current theme applied. Shows a mock restaurant with sample items so the owner can see exactly how their menu will look. Responsive — toggle between phone/tablet/desktop preview sizes.

### Analytics Dashboard

- **Breadcrumb:** My Restaurants > Restaurant Name > Analytics
- **Date range selector** at top right: preset buttons (Today, 7 days, 30 days) + custom date range picker
- **Summary stat cards row** (3-4 cards):
  - Total page views (with trend arrow + % vs previous period)
  - Unique visitors (with trend)
  - Most viewed item (item name + view count)
- **Charts section** (2-column grid on desktop, stacked on mobile):
  - **Views over time** — line chart, daily granularity
  - **Popular items** — horizontal bar chart, top 10 most clicked items
  - **Peak hours** — vertical bar chart, visits by hour of day
  - **Device breakdown** — donut chart (mobile/desktop/tablet)
- **Location breakdown** — table below charts showing top visitor locations (city, country, view count)
- **Empty state:** If no analytics data yet — "Share your menu to start seeing insights" with a link to the QR code page

### Team Management

- **Breadcrumb:** My Restaurants > Restaurant Name > Team
- **Invite section** at top:
  - Email input + role selector (Editor/Viewer) + "Send Invite" button
  - "Copy Invite Link" button with role selector — generates a shareable link
- **Pending invites:** List of sent invites with email, role, status (pending/expired), revoke button
- **Members list:** Table/list of current members
  - Each row: avatar, name, email, role badge, joined date
  - Owner row: marked distinctly, no actions
  - Other members: dropdown with "Change Role" and "Remove" options
- **Transfer Ownership:** Button at bottom of page (visually de-emphasized). Opens a confirmation dialog — select a member to transfer to, confirm with re-authentication or typed confirmation.

---

## 7. Screens — Public Menu & Admin Portal

### Public Restaurant Menu

- **Important:** This page uses the owner's custom theme (font, colors, radius), NOT Menufic's brand design system. The designer should create one or two example themed versions to show how customization works.
- **Banner area:** Full-width carousel of banner images with auto-play. Restaurant name, location (linked to Google Maps), and phone number (tel: link) overlaid on the banner with text shadow for readability. On mobile, restaurant info moves below the banner.
- **Search bar:** Positioned below the banner area. Clean text input with search icon. Filters items in real-time as the user types — matching against item names and descriptions.
- **Menu tabs:** Horizontal tab bar to switch between menus (e.g., Breakfast, Lunch, Dinner). Each tab shows menu name and available time. Scrollable horizontally if many menus.
- **Category sections:** Category name as a section header. Items listed below in a responsive grid (3 columns desktop, 2 tablet, 1 mobile).
- **Menu item cards:** Thumbnail image (left), name + price + truncated description (right). Status badge overlay for "Sold Out" items. Hover: subtle lift. Click opens detail modal.
- **Item detail modal:** Centered modal with full-size image, item name, price, full description, tags (Popular, New, Chef's Special, Spicy as small badges). Warm backdrop blur.
- **Footer:** Subtle "Powered by Menufic" with link. Minimal.
- **Responsive:** Must look great on mobile first — this is primarily scanned via QR code on phones.

### Admin Portal

- **Intentionally simple and functional** — internal tool, not customer-facing. Can use a more standard/utilitarian design. Doesn't need the warm editorial aesthetic of the main app.
- **Layout:** Top navbar with "Menufic Admin" branding + admin user info. No sidebar — use top-level tabs instead.

#### Tab 1: Review Queue

- Table of pending first-time publish requests
- Columns: restaurant name, owner email, submitted date, AI recommendation (pass/flag badge)
- Expandable row or click-to-open: full menu preview rendered as the public would see it
- AI details panel: what was checked, what was flagged (if anything), confidence
- Action buttons: "Approve" (green) and "Reject" (red). Reject opens a text field for the admin's comment.
- Empty state: "No pending reviews" — celebratory/relaxed tone

#### Tab 2: Restaurants

- Searchable table of all restaurants
- Search by: restaurant name, owner email, slug, status
- Columns: name, slug, owner, status badge, created date, last updated
- Click to expand: full restaurant details — menu content, theme settings, org members
- Admin actions: edit data, change status, with audit logging
