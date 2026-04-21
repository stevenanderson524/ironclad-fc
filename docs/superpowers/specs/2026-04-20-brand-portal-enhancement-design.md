# Brand Portal Enhancement — Design Spec
_Date: 2026-04-20_

## Goal
Make the Ironclad FC brand site compelling for an NFL audience evaluating AEM Edge Delivery Services as a platform for brand.nfl.com. The site already has strong authored content across four pages; the gap is visual impact. This spec covers the code-layer changes needed to elevate it from functional to impressive.

## Scope

Four pages are in scope:

| Page | Changes |
|---|---|
| `/` (homepage) | Animated hero entrance; scroll-triggered section transitions |
| `/identity` | `color-swatches` block, `type-specimen` block, sticky in-page section nav |
| `/voice` | `brand-showcase` block |
| `/assets` | `asset-grid` block with category filter tabs |

Out of scope: rewriting existing DA page content, new pages, performance/SEO work.

**Note on DA authoring:** The new blocks (`color-swatches`, `type-specimen`, `brand-showcase`, `asset-grid`, `section-nav`) must be added to the relevant DA pages by the author after the code is merged. This is a small authoring step per page, not a content rewrite.

---

## New Blocks

### `color-swatches`
**Purpose:** Render the brand color palette as visual swatches with hex codes and usage rules — replacing what would otherwise be a bullet list.

**Authoring model (DA table):**
| Color Name | Hex | Usage |
|---|---|---|
| Iron Black | #0D0D0D | Primary background |

**Rendered output:** A horizontal row of swatch tiles. Each tile shows a filled color block, the name, hex code, and usage note beneath. On mobile, wraps to a 2-column grid.

**File:** `blocks/color-swatches/color-swatches.js` + `color-swatches.css`

---

### `type-specimen`
**Purpose:** Show the typography system live — each typeface role rendered as an actual specimen at scale, not described in prose.

**Authoring model (DA table):**
| Role | Family | Weight | Size | Sample Text |
|---|---|---|---|---|
| Headline | Roboto Slab | 900 | 55px | Iron Will. Ironclad. |

**Rendered output:** A stacked list of type specimens. Each row shows the sample text rendered in the specified style, with the role name, family, and weight as metadata beneath. Authors can supply custom sample copy.

**File:** `blocks/type-specimen/type-specimen.js` + `type-specimen.css`

---

### `brand-showcase`
**Purpose:** Show the brand identity applied in the real world — jersey, stadium signage, social mockups, campaign imagery. Gives the NFL audience a "this is what your brand could look like" moment.

**Authoring model (DA table — one row per image):**
| Image | Label |
|---|---|
| (image) | Jersey — 2025 Home Kit |

Each row is one showcase item: an image cell and a short label. The block reads all rows and renders them in a CSS grid (`auto-fill`, `minmax(280px, 1fr)`) — no JS masonry library.

**Rendered output:** A dark-background full-width grid of brand application images with Iron Orange label overlays on hover. On mobile, a single-column scroll.

**File:** `blocks/brand-showcase/brand-showcase.js` + `brand-showcase.css`

---

### `asset-grid`
**Purpose:** A filterable visual library for the `/assets` page — replaces a static list with an interactive grid that lets brand reviewers browse by category.

**Authoring model (DA table):**
| Category | Asset Name | Thumbnail | Format | Download Link |
|---|---|---|---|---|
| Logos | Primary Lockup | (image) | SVG, PNG | /assets/logo-primary.zip |

**Rendered output:** Filter tabs at the top (Logos / Photography / Templates / Campaign). Below: a card grid showing the thumbnail, asset name, format badges, and a download link. Filtering is client-side, no page reload.

**File:** `blocks/asset-grid/asset-grid.js` + `asset-grid.css`

---

## Motion Layer (global)

All animation is vanilla JS + CSS — no libraries, no dependencies. Animations respect `prefers-reduced-motion`.

### Hero entrance (`/`)
On `DOMContentLoaded`, the hero tagline and CTA buttons animate in with a staggered sequence:
1. Tagline: fade + 20px upward slide, 0ms delay
2. Body text: fade + 20px upward slide, 150ms delay
3. CTA buttons: fade + 20px upward slide, 300ms delay

Implementation: The hero block's `decorate()` function adds `hero-animate` class to the block after a single `requestAnimationFrame`. CSS targets `.hero-animate .hero-content > *:nth-child(n)` with increasing `animation-delay` per child.

### Scroll-triggered section entrances (all pages)
An `IntersectionObserver` watches every `.section-wrapper` and block. When a section enters the viewport (threshold: 0.15), it receives an `is-visible` class that triggers a CSS transition: `opacity 0 → 1`, `translateY(24px) → 0`, duration 500ms, ease-out.

Added in `scripts/scripts.js` as a utility that runs after `loadPage()`.

### Color swatch entrance (`/identity`)
When the `color-swatches` block becomes visible, swatches animate in left-to-right with a 60ms stagger between each tile.

### Heading accent animation
`h2` elements inside `.section-wrapper` get an Iron Orange underline (`::after` pseudo-element, `width: 0 → 48px`, 400ms ease-out) triggered by the same `IntersectionObserver` as sections.

---

## Sticky Section Nav (`/identity` only)

A slim secondary nav bar that sticks below the main site header as the user scrolls the `/identity` page.

**Links:** Logo · Colors · Typography (anchored to `#logo`, `#colors`, `#typography` section IDs)

**Behaviour:**
- Sticks at `top: 64px` (below the 64px main nav)
- Active link tracks scroll position via `IntersectionObserver` on each section
- Clicking a link smooth-scrolls to the section

**Authoring model (DA table — one row per section link):**
| Label | Anchor |
|---|---|
| Logo | #logo |
| Colors | #colors |
| Typography | #typography |

**Implementation:** A `section-nav` block placed by the author near the top of the `/identity` page in DA. The block reads its rows to build the nav links, then pins itself using `position: sticky`. The target sections must have matching `id` attributes — these are set by the block on the corresponding section wrappers by matching section headings. No layout shift — space is reserved in the document flow.

**File:** `blocks/section-nav/section-nav.js` + `section-nav.css`

---

## Technical constraints

- No runtime dependencies — all vanilla JS + CSS
- No build step — ES modules, `.js` extensions on all imports
- All selectors scoped to block: `.color-swatches .swatch`, never just `.swatch`
- Mobile-first: base styles target mobile, `min-width` media queries for 600/900/1200px
- Animations guarded by `@media (prefers-reduced-motion: reduce)` — reduce or eliminate transitions
- `scripts/aem.js` is not modified
- DA content is not modified — blocks read whatever the author puts in the table

---

## Success criteria

- `/identity` page: color palette visually rendered as swatches; typography rendered as live specimens; sticky nav functional and tracking scroll
- `/voice` page: brand-showcase grid rendering images with hover labels
- `/assets` page: asset-grid with working category filter, thumbnails visible
- All pages: scroll-triggered entrances firing correctly; hero animating on load
- `npm run lint` passes with zero errors
- No layout shift or render-blocking introduced
- PageSpeed score remains 100
