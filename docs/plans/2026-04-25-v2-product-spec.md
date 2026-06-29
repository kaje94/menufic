# Menufic V2 — Product Specification

## 1. Product Overview

Menufic is a free digital menu generator for restaurant owners. Owners create, customize, and publish beautiful digital menus accessible via a shareable link and QR code at `menufic.com/r/{slug}`.

V2 is a complete rewrite adding team collaboration, analytics, theme customization, and an internal admin review system.

**Target audience:** Restaurant owners of all kinds — from single-location cafes to multi-branch restaurants.

**Pricing:** Completely free. No paid tiers. Menufic has been free since launch (3+ years).

**Public menu URL format:** `menufic.com/r/{restaurant-slug}`

### User Roles

| Role | Scope | Permissions |
|------|-------|------------|
| **Owner** | Organization | Full control. Create/edit/delete restaurants, menus, items. Manage team. View analytics. Publish. Transfer ownership. |
| **Editor** | Organization | Create/edit/delete menus, categories, items. Manage banners and themes. Cannot delete restaurant, manage team, or publish. |
| **Viewer** | Organization | View menus, analytics, and team. Read-only. |
| **Admin** | System-wide (internal) | Review first-time publishes. Search/modify any data. Internal Menufic team only. |
| **Public Visitor** | Single restaurant | View published menu. No account needed. |

---

## 2. Authentication & Organization Management

### Authentication

- **Provider:** Better Auth with Google social login (only provider)
- **User record:** On first login, auto-create a User record in the database (v1 had no User table — just userId on Restaurant)
- **V1 migration:** When a v1 user logs into v2 for the first time, auto-create their User record, create a personal Organization, assign them as Owner, and link their existing restaurants to that org

### Organization Management

- Every user gets a personal Organization on first login
- A Restaurant belongs to an Organization (not directly to a user)
- Owner can invite members via:
  - **Email invite** — enter email, invitee receives email with accept link. If no account, they sign up first then auto-join
  - **Invite link** — generate a shareable link with a role (Editor/Viewer) and optional expiry
- Roles: Owner, Editor, Viewer (permissions as defined in Section 1)
- **Ownership transfer:** Owner can transfer ownership to an existing member. The previous owner becomes an Editor. Requires confirmation.
- **Remove members:** Owner can remove any member. Editors and Viewers can leave voluntarily.
- One org can have multiple restaurants

---

## 3. Restaurant & Menu Management

### Restaurant Management

- **Create:** Name, location, contact number, cover image (with crop), URL slug (auto-generated from name, editable)
- **Edit:** All fields editable. Slug change redirects old URL (or warns owner).
- **Delete:** Cascading delete of all menus, categories, items, images, analytics. Confirmation required.
- **Banners:** Upload multiple banner images displayed as carousel on public menu. Drag to reorder. Max limit per restaurant.
- **Publish:** Toggle publish status. First-time publish triggers admin review. Subsequent changes go live immediately.

### Menu Management

- **Menu:** Name, available time (e.g., "Breakfast 7am-11am"), position (drag to reorder)
- **Category:** Name, position within menu
- **Menu Item fields:**
  - Name, description, price, image (with crop)
  - Position (drag to reorder within category)
  - **Status:** `available` (default), `sold_out`, `unavailable`. Sold out shows a badge; unavailable hides the item from public view.
  - **Tags:** Optional labels like "Popular", "New", "Chef's Special", "Spicy". Owner selects from a predefined list.

### QR Code

- Auto-generated QR code for the restaurant's public URL
- Downloadable as PNG
- Available from the restaurant management page

---

## 4. Theme Customization & Publishing/Admin Review

### Theme Customization

- Each restaurant has its own theme settings
- **Preset themes:** 8-12 curated presets (e.g., "Classic Bistro", "Modern Minimal", "Rustic Cafe", "Dark Elegant", "Tropical", "Nordic Clean")
- **Customizable properties on top of preset:**
  - **Font:** Choose from a curated list of 10-15 Google Fonts suitable for menus
  - **Primary color:** Color picker with preset swatches
  - **Corner radius:** Slider from sharp (0px) to fully rounded (16px)
- **Live preview:** Side-by-side editor — controls on left, real-time preview of public menu on right
- Theme stored per restaurant, applied only to the public-facing menu page
- Dashboard UI uses the Menufic design system (not the restaurant's custom theme)

### Publishing & Admin Review

- **First-time publish flow:**
  1. Owner clicks "Publish"
  2. Status changes to `pending_review`
  3. AI pre-screening runs automatically — checks for junk/spam content, offensive language, placeholder text (e.g., "lorem ipsum", "test menu"). Uses Claude API via SDK.
  4. Entry appears in admin review queue with AI recommendation (pass/flag)
  5. Admin reviews, can preview the full menu
  6. Admin approves → status becomes `published`, owner gets email notification
  7. Admin rejects → status becomes `rejected`, owner gets email with admin's comment explaining why
  8. Owner can edit and re-submit for review
- **Subsequent updates:** After initial approval, all changes go live immediately. No re-review needed.
- **Unpublish:** Owner can unpublish at any time. Re-publishing after unpublish does not require review again.

---

## 5. Analytics & Insights

### Data Collection

- Tracked on the public menu page (no account needed for visitors)
- Events captured:
  - **Page view** — each visit to the restaurant's public menu (with timestamp, device type, browser, approximate location via IP geolocation)
  - **Item view** — when a visitor clicks/expands a menu item to see details
- No cookies or personal data stored — privacy-friendly, aggregate-only analytics
- Visitor fingerprinting kept minimal (just device type + rough location from IP)

### Data Storage Strategy

- **Raw events** stored temporarily (7 days) for processing
- **Nightly aggregation job** rolls up raw events into summary tables:
  - `daily_page_views` — date, restaurant_id, total_views, unique_visitors, device_breakdown (JSON), location_breakdown (JSON)
  - `daily_item_views` — date, restaurant_id, menu_item_id, view_count
  - `hourly_distribution` — date, restaurant_id, hour, view_count
- Raw events purged after aggregation
- Summary tables are compact and query-friendly — a restaurant with 3 years of data would still only have ~1,100 rows in `daily_page_views`

### Analytics Dashboard (for Owner & Viewer roles)

- **Date range selector:** Today, last 7 days, last 30 days, custom range
- **Summary stat cards:**
  - Total page views
  - Unique visitors (approximate, session-based)
  - Most viewed menu item
- **Charts:**
  - **Views over time** — line chart showing daily page views for selected range
  - **Popular items** — bar chart of top 10 most clicked menu items
  - **Peak hours** — bar chart showing visits by hour of day
  - **Device breakdown** — donut chart (mobile vs desktop vs tablet)
  - **Location breakdown** — table showing top visitor locations (country/city level)
- **Trend comparison:** Each stat card shows percentage change vs previous period (e.g., "+12% vs last week")

### Data Retention

- Analytics summary data kept indefinitely
- Raw events purged after 7-day aggregation window

---

## 6. Email Notifications & Public Menu

### Email Notifications

- **Welcome email** — sent on first registration. Brief, warm, explains what Menufic does and how to get started.
- **Menu published** — sent when admin approves first-time publish. Includes link to the live menu.
- **Menu rejected** — sent when admin rejects. Includes the admin's comment and a link to edit and re-submit.
- **Organization invite** — sent when owner invites someone by email. Includes role, restaurant name, and accept link.
- **Ownership transferred** — sent to new owner confirming the transfer.
- Email provider TBD at implementation (Resend, SendGrid, etc.)

### Public Menu

- Accessible at `menufic.com/r/{restaurant-slug}`, no login required
- **Banner carousel** at top with auto-play
- **Restaurant info** overlaid on banner (name, location as Google Maps link, phone as tel: link)
- **Menu tabs** to switch between menus (e.g., Breakfast, Lunch, Dinner)
- **Search bar** — text search filtering items by name and description, real-time as-you-type
- **Category sections** with item cards grouped under each
- **Item cards** show: thumbnail, name, price, description (truncated), status badge (sold out)
- **Item detail modal** on click — full image, full description, price, tags
- **Theme** reflects the owner's full customization (font, colors, radius)
- **"Powered by Menufic"** subtle link in footer
- **SEO optimized** — proper meta tags, Open Graph, structured data for restaurant menus
- Items marked `unavailable` are hidden entirely; `sold_out` items show with a badge but remain visible

---

## 7. Admin Portal

### Overview

- Internal tool for the Menufic team (small number of users)
- Accessed at a separate route (e.g., `menufic.com/admin`) guarded by admin role check
- Functional, clean design — not customer-facing, doesn't need to match the marketing aesthetic

### Review Queue

- List of restaurants with `pending_review` status, sorted by submission time (oldest first)
- Each entry shows: restaurant name, owner email, submission date, AI recommendation (pass/flag with reason)
- **Preview:** Admin can view the full menu exactly as it would appear publicly
- **Actions:**
  - **Approve** — publishes the menu, triggers email to owner
  - **Reject** — requires a comment explaining the reason, triggers email to owner
- AI pre-screening details shown alongside: what it checked, what it flagged (if anything), confidence level

### Data Management

- **Search:** Searchable table of all restaurants across all users. Search by name, owner email, slug, status.
- **View details:** Expand any restaurant to see full menu content, theme settings, org members
- **Edit:** Admin can modify restaurant data, menu items, or status when needed (e.g., removing inappropriate content discovered after initial approval)
- **Audit trail:** Admin actions (approvals, rejections, edits) logged with timestamp and admin user

### AI Content Validation

- Runs automatically on first-time publish submission
- Checks for: junk/spam content, offensive language, placeholder text, empty or near-empty menus
- Uses Claude API (lightweight, single API call per submission)
- Returns: pass/flag status, list of concerns (if any), confidence score
- Admin sees the AI output but always makes the final decision

---

## 8. Landing Page, Data Model & Tech Stack

### Landing Page

- **Hero:** Clear headline focused on restaurant owners (e.g., "The easiest way to create a digital menu for your restaurant"). Subtext reinforcing simplicity. "Get Started" CTA with Google sign-in. Accompanied by a hero image/mockup showing a beautiful menu on a phone.
- **How it Works:** 3 steps — Create your restaurant → Build your menu → Share with a QR code
- **Features:** Key features showcased with visuals — theme customization, analytics, team management, QR codes
- **Example Menus:** 2-3 clickable/scannable demo menus showing different themes
- **Pricing:** Single card — "Free. Always." Highlight that Menufic has been free for 3+ years.
- **Testimonials:** Customer quotes with name, restaurant, and photo
- **Footer:** Links (privacy policy, terms, contact), social links, copyright

### Data Model (Prisma — high level)

| Table | Key Fields |
|-------|-----------|
| `User` | id, email, name, avatarUrl, createdAt |
| `Organization` | id, name, createdAt |
| `OrganizationMember` | orgId, userId, role (owner/editor/viewer), joinedAt |
| `OrganizationInvite` | id, orgId, email, role, token, expiresAt, acceptedAt |
| `Restaurant` | id, orgId, slug, name, location, contactNo, imageId, publishStatus (draft/pending_review/published/rejected), approvedAt, createdAt |
| `RestaurantTheme` | id, restaurantId, presetName, fontFamily, primaryColor, cornerRadius |
| `Menu` | id, restaurantId, name, availableTime, position |
| `Category` | id, menuId, name, position |
| `MenuItem` | id, categoryId, name, description, price, position, imageId, status (available/sold_out/unavailable), tags (JSON array) |
| `Image` | id, path, blurHash, color |
| `Banner` | id, restaurantId, imageId, position |
| `DailyPageView` | id, restaurantId, date, totalViews, uniqueVisitors, deviceBreakdown, locationBreakdown |
| `DailyItemView` | id, restaurantId, menuItemId, date, viewCount |
| `HourlyDistribution` | id, restaurantId, date, hour, viewCount |
| `PageViewEvent` | id, restaurantId, menuItemId (nullable), timestamp, deviceType, location — *temporary, purged after aggregation* |
| `AdminReview` | id, restaurantId, adminUserId, action (approved/rejected), comment, aiRecommendation, createdAt |
| `EmailLog` | id, recipientEmail, type, sentAt, status |

### Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | TanStack Start |
| Auth | Better Auth (Google provider) |
| Styling | Tailwind CSS + DaisyUI |
| Database | Prisma 7+ + PostgreSQL |
| Images | ImageKit (carried from v1) |
| Email | TBD (Resend / SendGrid) |
| AI Validation | Claude API (Anthropic SDK) |
| Error Tracking | Sentry |
| Testing | Playwright (e2e), TDD approach |
| Hosting | TBD |

### Migration Strategy

- V1 data migrated via script: create User + Org for each unique userId, link restaurants
- Image paths compatible (same ImageKit account)
- Old public menu URLs (`/restaurant/[id]/menu`) redirect to new format (`/r/{slug}`)
