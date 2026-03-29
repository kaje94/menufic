# Menufic v1 — Feature Documentation

> **Purpose:** Complete reference of all features in the existing Menufic v1 codebase, used to guide the v2 redesign and rebuild.
> **Source:** `/Users/kajendran/Documents/kajendran/menufic` (Next.js 13 app, running at http://localhost:3000)

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Data Models](#data-models)
3. [Pages & Routes](#pages--routes)
4. [Feature Areas](#feature-areas)
   - [Landing Page](#1-landing-page)
   - [Authentication](#2-authentication)
   - [Restaurant Management](#3-restaurant-management)
   - [Menu Builder](#4-menu-builder)
   - [Banner Management](#5-banner-management)
   - [Publish & Share](#6-publish--share)
   - [Public Menu View](#7-public-menu-view)
   - [Preview Mode](#8-preview-mode)
   - [Explore Page](#9-explore-page)
   - [Image Handling](#10-image-handling)
5. [Usage Limits (Free Tier)](#usage-limits-free-tier)
6. [Third-Party Integrations](#third-party-integrations)
7. [Planned / Placeholder Features](#planned--placeholder-features)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 13 (Pages Router) |
| Language | TypeScript |
| Database | PostgreSQL via Prisma ORM |
| API | tRPC v10 (type-safe API layer) |
| Auth | NextAuth.js v4 |
| UI Library | Mantine v5 + Tabler Icons |
| State/Data Fetching | TanStack React Query v4 (via tRPC) |
| Image Storage | ImageKit CDN |
| Image Processing | Sharp (AVIF conversion, resizing) |
| Blur Hash | blurhash library |
| Dominant Color Extraction | fast-average-color |
| QR Code | react-qr-code |
| QR Download | html2canvas + downloadjs |
| Drag & Drop | react-beautiful-dnd |
| Image Crop | react-easy-crop |
| Image Compression | browser-image-compression |
| Carousel | Embla Carousel (via @mantine/carousel) |
| Animations | @formkit/auto-animate |
| i18n | next-intl (English only currently) |
| SEO | next-seo |
| Error Monitoring | Sentry |
| Analytics | @vercel/analytics |
| Contact Form | Web3Forms |
| Testing | Playwright (E2E) |
| Deployment | Vercel |

---

## Data Models

### Restaurant
| Field | Type | Description |
|-------|------|-------------|
| id | String (cuid) | Unique identifier |
| userId | String | Owner's user ID |
| name | String | Restaurant name |
| location | String | Restaurant location (links to Google Maps) |
| contactNo | String | Contact phone number (clickable tel: link) |
| isPublished | Boolean | Whether menu is publicly accessible |
| imageId | String? | Profile image (1:1 relationship with Image) |
| banners | Image[] | Banner images for the carousel |
| menus | Menu[] | Menus belonging to this restaurant |
| createdAt | DateTime | |
| updatedAt | DateTime | |

### Menu
| Field | Type | Description |
|-------|------|-------------|
| id | String (cuid) | Unique identifier |
| userId | String | Owner's user ID |
| name | String | Menu name (e.g. "Lunch", "Dinner") |
| availableTime | String | Free-text time string (e.g. "10AM - 9PM") |
| position | Int | Display order (drag-and-drop sortable) |
| restaurantId | String? | Parent restaurant |
| categories | Category[] | Categories within this menu |

### Category
| Field | Type | Description |
|-------|------|-------------|
| id | String (cuid) | Unique identifier |
| userId | String | Owner's user ID |
| name | String | Category name (e.g. "Starters", "Mains") |
| position | Int | Display order (drag-and-drop sortable) |
| menuId | String? | Parent menu |
| items | MenuItem[] | Menu items in this category |

### MenuItem
| Field | Type | Description |
|-------|------|-------------|
| id | String (cuid) | Unique identifier |
| userId | String | Owner's user ID |
| name | String | Item name |
| description | String | Item description |
| price | String | Free-text price string |
| position | Int | Display order (drag-and-drop sortable) |
| categoryId | String? | Parent category |
| imageId | String? | Optional item image |

### Image
| Field | Type | Description |
|-------|------|-------------|
| id | String | ImageKit file ID |
| path | String | ImageKit file path |
| blurHash | String | Blur hash for progressive loading |
| color | String | Dominant hex color extracted from image |

---

## Pages & Routes

| Route | Auth Required | Description |
|-------|--------------|-------------|
| `/` | No | Landing page |
| `/auth/signin` | No | Sign-in page |
| `/auth/signin-test-user` | No | Test user login (dev/testing) |
| `/explore` | Yes | Browse all published restaurants |
| `/restaurant` | Yes | List user's own restaurants |
| `/restaurant/[restaurantId]` | Yes | Manage a specific restaurant |
| `/restaurant/[restaurantId]/edit-menu` | Yes | Edit menus, categories, items |
| `/restaurant/[restaurantId]/banners` | Yes | Manage banner images |
| `/restaurant/[restaurantId]/preview` | Yes (owner only) | Preview menu before publishing |
| `/restaurant/[restaurantId]/menu` | No | Public-facing menu page (ISR, revalidates every 30min) |
| `/privacy-policy` | No | Privacy policy |
| `/terms-and-conditions` | No | Terms and conditions |
| `/api/auth/[...nextauth]` | — | NextAuth.js handler |
| `/api/trpc/[trpc]` | — | tRPC API handler |
| `/api/health` | — | Health check endpoint |

---

## Feature Areas

### 1. Landing Page

The marketing homepage at `/`, composed of these sections:

- **Hero** — Tagline "The best way to create Digital Menus for your restaurant" + "Get started for free" CTA
- **How it Works (Steps)** — 4-step process:
  1. Create restaurant
  2. Add content
  3. Publish restaurant
  4. Share (QR code or URL)
- **Features** — 6 feature cards:
  1. *Optimized for the web* — SEO + social media crawler optimized pages
  2. *Dark and Light themes* — Per-customer theme toggle on menu page
  3. *Promotions using banners* — Image carousel for offers/promotions
  4. *Organize your data easily* — Intuitive multi-menu, multi-category structure
  5. *View from any device* — Responsive layout, no app install needed
  6. *QR code* — Generate, print, and share a QR code
- **Sample Menu** — Shows a QR code + button to a live sample menu
- **Pricing** — Two tiers:
  - **Free:** Configurable limits (default: 5 restaurants, 5 menus, 10 categories, 20 items/category, 5 banners). Basic support.
  - **Enterprise:** Unlimited everything. Contact us to get started.
- **Contact Us** — Form powered by Web3Forms (name, email, subject, message)
- **About Us** — Open source description with GitHub link

---

### 2. Authentication

- **Google OAuth** — Sign in with Google
- **GitHub OAuth** — Sign in with GitHub
- **Test User Login** — Credential-based login using a secret key (for testing/dev purposes only, at `/auth/signin-test-user`)
- **Session Strategy** — JWT-based, 30-day expiry
- **Protected Routes** — Dashboard pages redirect to `/auth/signin` if unauthenticated (enforced via `useSession({ required: true })` in AppShell)

---

### 3. Restaurant Management

**Page:** `/restaurant` (dashboard)

- **List all restaurants** — Grid of image cards showing name + location
- **Create restaurant** — Modal form with:
  - Name
  - Location
  - Contact number
  - Profile image (with crop + upload)
- **Edit restaurant** — Same form, pre-filled, updates existing restaurant
- **Delete restaurant** — Confirmation modal; cascades deletion of all menus, categories, items, and images (both DB records and ImageKit files)
- **Navigate into restaurant** — Click card to go to restaurant management hub

**Restaurant Management Hub** (`/restaurant/[restaurantId]`):
- Breadcrumb navigation
- Publish/Unpublish toggle button
- 4 management cards:
  1. **Menus** → `/edit-menu`
  2. **Banners** → `/banners`
  3. **Feedback** *(placeholder — not yet implemented)*
  4. **Stats** *(placeholder — not yet implemented)*

---

### 4. Menu Builder

**Page:** `/restaurant/[restaurantId]/edit-menu`

Three-level hierarchy: **Menu → Category → Menu Item**

#### Menus Panel (left column)
- List all menus for the restaurant
- **Create menu** — Modal form: name + available time (free text, e.g. "10AM - 9PM")
- **Edit menu** — Update name and available time
- **Delete menu** — Confirmation modal; cascades deletion of all categories, items, and images
- **Reorder menus** — Drag-and-drop to reorder; position saved on drop

#### Categories Panel (right column, appears on menu selection)
- List all categories for the selected menu
- **Create category** — Modal form: name only
- **Edit category** — Update name
- **Delete category** — Confirmation modal; cascades deletion of all items and images
- **Reorder categories** — Drag-and-drop to reorder; position saved on drop
- Each category expands to show its menu items

#### Menu Items (within each category)
- List items with thumbnail, name, price, description
- **Create menu item** — Modal form:
  - Name
  - Description
  - Price (free text)
  - Image (optional, with crop + upload)
- **Edit menu item** — Same form, pre-filled; supports replacing or removing the image
- **Delete menu item** — Confirmation modal; deletes image from ImageKit if present
- **Reorder menu items** — Drag-and-drop within category; position saved on drop

---

### 5. Banner Management

**Page:** `/restaurant/[restaurantId]/banners`

- List all banner images for the restaurant
- **Add banner** — Upload image (with crop + upload), shown in carousel on public menu
- **Delete banner** — Confirmation modal; removes from ImageKit and DB
- Limit enforced: max 5 banners per restaurant (configurable via env)

---

### 6. Publish & Share

**Component:** `PublishButton` (appears on restaurant manage, edit-menu, and banners pages)

- **Publish/Unpublish toggle** — Switch to make menu publicly accessible (or hide it)
  - On publish: triggers ISR revalidation of the public menu page
  - Changes take up to 30 minutes to reflect on published page (ISR cache)
- **Published menu URL** — Displays the shareable link; one-click copy to clipboard
- **QR Code** — Generated automatically when published; displays on screen
- **Download QR Code** — Downloads QR code as a PNG image (`{restaurantName}-menu-qr-code.png`) using html2canvas
- **Preview URL** — A separate `/preview` URL available at all times (even when unpublished) for the owner to test the menu. Not meant to be shared.

---

### 7. Public Menu View

**Page:** `/restaurant/[restaurantId]/menu` (statically generated with ISR, revalidates every 30 min)

- Only renders if `isPublished = true`; shows empty state otherwise
- **Banner/Image Carousel** — Displays restaurant profile image + all banner images in an auto-playing carousel (5s delay, loops, pauses on hover, shows dot indicators if >1 image)
- **Restaurant Header** — Shows restaurant name, location (links to Google Maps search), contact number (clickable `tel:` link) overlaid on the carousel
- **Menu Tabs** — One tab per menu; shows menu name + available time; clicking switches the displayed content
- **Category Sections** — Each category (that has items) renders as a labeled section
- **Menu Item Cards** — Each item displays as a card with:
  - Thumbnail image (150×150)
  - Name
  - Price (in red)
  - Description (truncated to 3 lines)
  - Background tinted to dominant color of item image
  - Click opens a detail modal
- **Menu Item Detail Modal** — Full view of item with larger image, name, price, description
- **Dark/Light Theme Toggle** — Floating button on the banner to switch between dark and light mode (persists in-session)
- **Responsive layout** — 3 columns (desktop), 2 columns (tablet), 1 column (mobile)
- **SEO optimized** — Dynamic title, description (restaurant name, location, contact), Open Graph image, theme color from restaurant image dominant color
- **No login required** — Fully public page

---

### 8. Preview Mode

**Page:** `/restaurant/[restaurantId]/preview` (server-side rendered, owner-only)

- Renders the same `RestaurantMenu` component as the public menu page
- Shows a red "Preview Mode" alert banner explaining this URL is not for sharing
- Always shows the latest data (no ISR cache) — real-time updates
- Accessible only to the restaurant owner (redirects others to home)
- Accessible even when menu is not published

---

### 9. Explore Page

**Page:** `/explore` (requires login)

- Grid of all published restaurants across all users
- Each card shows: restaurant image, name, location
- Clicking a card opens that restaurant's public menu in a new tab
- Empty state if no published restaurants exist

---

### 10. Image Handling

Consistent image pipeline used throughout:

- **Upload flow:**
  1. User selects JPEG in the dropzone
  2. Browser compresses the image
  3. Crop modal allows cropping and zooming
  4. Cropped base64 is sent to the server
  5. Server converts to AVIF format via Sharp (for smaller file size)
  6. Uploaded to ImageKit CDN with a nanoid filename
  7. Blur hash computed (32×32 resized, 4×4 components)
  8. Dominant color extracted (hex) stored in DB
- **Display:** Uses `ImageKitImage` wrapper that shows blur-hash placeholder while loading
- **Deletion:** Files deleted from ImageKit when the associated entity is deleted (individual files or bulk delete)
- **Supported input format:** JPEG only

---

## Usage Limits (Free Tier)

All limits are configurable via environment variables:

| Resource | Default Limit |
|----------|--------------|
| Restaurants per user | 5 |
| Menus per restaurant | 5 |
| Categories per menu | 10 |
| Menu items per category | 20 |
| Banners per restaurant | 5 |

Limits are enforced server-side in tRPC mutations and surfaced to the user by hiding the "Add" card when the limit is reached.

---

## Third-Party Integrations

| Service | Purpose |
|---------|---------|
| **ImageKit** | CDN for image storage and delivery |
| **Google OAuth** | Social login |
| **GitHub OAuth** | Social login |
| **Web3Forms** | Contact form submission (no backend needed) |
| **Sentry** | Error monitoring (client + server + edge) |
| **Vercel Analytics** | Page view analytics |
| **Google Maps** | Location link on public menu page |

---

## Planned / Placeholder Features

These appear in the UI as non-functional cards (no `href`, no functionality yet):

| Feature | Location | Notes |
|---------|----------|-------|
| **Feedback** | Restaurant management hub | Listed as a management option; icon: `IconStars` |
| **Stats/Analytics** | Restaurant management hub | Listed as a management option; icon: `IconChartDots` |

---

## Notable UX Patterns

- **Optimistic updates** — Publish/unpublish toggle uses optimistic UI with rollback on error
- **Auto-animate** — List additions/removals animate smoothly via `@formkit/auto-animate`
- **Breadcrumbs** — Consistent navigation trail in all nested pages
- **Drag-and-drop ordering** — All menus, categories, and items are drag-and-drop sortable (react-beautiful-dnd); position is saved immediately on drop
- **Blur-hash placeholders** — All images show a blurred color preview while loading
- **Dominant color theming** — Item card backgrounds tinted to the image's dominant color
- **ISR (Incremental Static Regeneration)** — Public menu pages are statically generated and revalidated every 30 minutes for performance
