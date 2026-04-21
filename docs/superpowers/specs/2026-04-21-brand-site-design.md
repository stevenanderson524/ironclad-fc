# Brand Site — Design Spec
**Date:** 2026-04-21
**Status:** Approved

## Overview

Implement the Ironclad FC brand system as a four-page AEM EDS site, fully authorable in Document Authoring (DA). Modelled on `brand.ironcladfc.com` — a standalone brand reference for internal teams, partners, media, and agencies. The brand site replaces the global site header with its own sticky navigation on every brand page.

Source design: `Iron Clad-handoff.zip` — Claude Design prototype with four pages (Home, Identity, Voice, Assets).

---

## URL Structure

| Page | Path |
|---|---|
| Brand home | `/brand` |
| Identity | `/brand/identity` |
| Voice | `/brand/voice` |
| Assets | `/brand/assets` |

The fan site homepage (`/`) is **unchanged**.

---

## Global Code Changes

### `scripts/scripts.js`
Add a metadata check before `loadHeader()` to support header suppression on brand pages:

```js
if (getMetadata('header').toLowerCase() !== 'off') {
  loadHeader(doc.querySelector('header'));
}
```

### `/icons/shield.svg`
New file. The Ironclad FC shield mark as a standalone SVG, extracted from the handoff's `ShieldMark` component. Hexagonal outline, double-stroke inner ring, bold "IC" wordmark, Iron Orange accent bar. Used inline by `brand-nav` and `brand-mark` blocks.

### Page metadata (all brand pages)
```
| metadata  |         |
| header    | off     |
| template  | brand   |
```

---

## Block Inventory

### New Blocks (9)

#### `brand-nav`
Sticky navigation replacing the global header on all brand pages. Renders the ShieldLockup (inline SVG + "IRONCLAD / F·C" wordmark), four nav tabs (Home / Identity / Voice / Assets), a version eyebrow, and a "Download Kit" CTA button. Active tab is detected from `window.location.pathname` — no author input required. The only authored content is the Download Kit link target.

**DA content model:**
```
| brand-nav        |
| /brand/press-kit |
```

**Visual:** Iron Black background, 1px Forge White/14% bottom border, `position: sticky; top: 0; z-index: 20`. Active tab has Iron Orange background + Iron Black text. `backdrop-filter: blur(8px)` always applied (not triggered by scroll).

---

#### `brand-hero`
Full-width typographic hero used on every brand page. Four authored rows: eyebrow / headline / body / CTA links. Corner bracket decorations (Iron Orange, 32×32px, top-left and top-right). Optional grid-line background (`.ic-grid-bg` CSS class — applied when section has no image). Headline uses `clamp(88px, 11vw, 180px)` Roboto Slab 900, uppercase. CTAs: bold link = primary button (Iron Orange fill), italic link = ghost button (white border).

**DA content model:**
```
| brand-hero                                                 |
| BRAND · IRONCLADFC · SYSTEM v4.2                           |
| The brand system.                                          |
| How Ironclad FC shows up in the world. Use it exactly.     |
| **[Open the System →](#identity)**                         |
| *[Download Assets](#assets)*                               |
```

---

#### `marquee`
Scrolling ticker strip. White background, 3px Iron Orange borders top and bottom. Items authored as a comma-separated list in a single cell; block splits on `, ` and duplicates the array for seamless looping. Each item separated by a 6×6px Iron Orange square. Animation: `marquee` CSS keyframe, 55s linear infinite.

**DA content model:**
```
| marquee                                                                      |
| BRAND SYSTEM v4.2, LAST REV · 04.21.26, IDENTITY · VOICE · ASSETS, EST. MMXIV, DO NOT ALTER THE MARK |
```

---

#### `brand-overview`
"Brand at a glance" — three-column grid showing the mark, the primary color, and the type. Three authored rows (one per column): label / name / spec metadata. Block renders the shield SVG inline for the first row (detected by position), a solid Iron Orange color block for the second, and a large "Aa" type specimen for the third. Thin 1px Forge White/14% borders between columns.

**DA content model:**
```
| brand-overview                                              |
| THE MARK  | Iron Shield | IC-MARK-01 · SVG · PNG · EPS      |
| THE COLOR | Iron Orange | #FF4500 · RGB 255·69·0             |
| THE TYPE  | Roboto Slab | WT 900 · HEADLINE · -0.03em TRACK  |
```

---

#### `brand-chapters`
Three-row chapter list linking to Identity, Voice, and Assets. Each row: title / slug line / description / stats (comma-separated, block splits into bullet points). Three-column internal layout: title+link / description / stats. Thin bordered grid, 4px Iron Orange accent bar per row.

**DA content model:**
```
| brand-chapters |
| Identity | The visual system.       | The shield mark, the palette… | 1 MARK, 5 COLORS, 4 TYPE ROLES, 12 RULES           |
| Voice    | How Ironclad speaks.     | Four core principles…         | 4 PRINCIPLES, 4 PAIRINGS, 6 TOUCHPOINTS            |
| Assets   | The production pipeline. | Downloadable marks today…     | 2 AVAILABLE, 10 IN PRODUCTION, ADOBE · FIREFLY · EXPRESS |
```

**Note:** Stats use commas as delimiter — pipes are reserved characters in DA table cells.

---

#### `brand-pillars`
2×2 grid of brand philosophy pillars. Each row: title / description. Thin bordered grid, 4px Iron Orange accent bar per pillar, Roboto Slab 900 38px title, Forge White/55% body copy.

**DA content model:**
```
| brand-pillars            |
| Forged, not designed.    | The mark wasn't drawn in a studio…  |
| Earned, not announced.   | We don't say we're tough…           |
| Community, not consumer. | The fan is not a target…            |
| Concrete, not clever.    | Specifics carry the iron…           |
```

---

#### `brand-mark`
Zero-content block. Auto-renders the Ironclad shield mark in three approved contexts: primary (white on Iron Black), reversed (black on Forge White), and emergency (black on Iron Orange). Fetches `/icons/shield.svg` and inlines it at the appropriate size and fill color. If the SVG file is missing, renders a visible error state: `"Mark not found — upload /icons/shield.svg"`. Used on the Identity page only.

**DA content model:**
```
| brand-mark |
```

---

#### `voice-principles`
Stacked rows, one per core voice principle. Each row three columns: principle title + description / ✓ Ironclad example / ✗ Not Ironclad example. The "not Ironclad" column has `text-decoration: line-through` with Iron Orange/50% decoration color and a Forge White/3% background. Each principle separated by a 4px Iron Orange accent bar.

**DA content model:**
```
| voice-principles |
| Show, don't tell.  | Demonstrate accomplishment… | Iron Army fills 24,812 seats. Every Saturday. | We have one of the league's most passionate fanbases. |
| Active. Concise.   | Short sentences…            | Reyes signs. Three years.                     | Captain Marcus Reyes has decided to sign a new three-year contract extension. |
| Community first.   | The city comes first…       | East Harbor, this one's for you.              | Ironclad FC proudly celebrates another victory. |
| Concrete details.  | Specifics carry the iron…   | 71st minute. Left foot. Far post.             | A brilliant late goal sealed the win. |
```

---

#### `voice-pairings`
"Say it this way" comparison table. Four rows, three columns per row: tag / Ironclad copy / Avoid copy. Tag column has Iron Black/ink background. Ironclad column uses Roboto Slab 900 22px. Avoid column uses italic Forge White/55%, 16px.

**DA content model:**
```
| voice-pairings |
| MATCHDAY | Iron Stadium. 19:00. Bring the noise.        | Don't miss out on tonight's incredible matchup! |
| KIT DROP | Iron Series IV. Black. Orange. 2,014 units.  | Our new away kit has officially arrived — shop now! |
| WIN      | 2—0. Reyes 34'. Valenti 71'. East Harbor walks home loud. | What a great result for the team and the fans! |
| LOSS     | 0—1. We lost. We come back Saturday.          | A tough result, but we remain confident moving forward. |
```

---

### Upgraded Existing Blocks (3)

#### `color-swatches` — Visual upgrade
**Change:** From small swatch tiles to full-height color columns matching the handoff. First column (Iron Black) is twice the width of others. Each column: color name (Roboto Slab 900, large), hex code (Roboto Mono bold), RGB value (Roboto Mono/70%), role description. Usage ratio bar added below the swatches: proportional flex row showing 60% Black / 25% White / 10% Orange / 5% Steel.

**DA content model:** Unchanged — existing authored content works as-is.

---

#### `type-specimen` — Visual upgrade
**Change:** From flat list to 3-column table rows (role label / live type sample / spec metadata) plus a large specimen block at the bottom. Specimen shows `AaBbCcDd` at 220px Roboto Slab 900 with alternating Iron Orange letters, followed by `0123456789 · !?&@#%` at 60px. Role column has 4px Iron Orange accent bar. Sample renders live using the actual font/weight/size. Spec column uses Roboto Mono 12px dim.

**DA content model:** Unchanged — existing authored content works as-is.

---

#### `asset-grid` — Structural upgrade
**Change:** The existing `asset-grid` block JS is significantly restructured (not just restyled) to support two variants. The current single-mode filtering logic is replaced with variant-aware rendering. Both variants live in the same `blocks/asset-grid/` folder — the block JS reads the block's class list to determine mode. Split into two block variants used separately on the page:

- `asset-grid available` — Phase 1 section. Renders cards with thumbnail, category eyebrow, name, format spec, and download CTA button. "AVAILABLE" badge in Iron Orange. Three-column grid.
- `asset-grid production` — Phase 2 section. Renders brief cards in a two-column grid. Each card: slot preview panel (hatched pattern, format label), category, asset name, brief description (if provided), tool tag, phase timeline. No download button — "IN PRODUCTION →" label instead. Includes filter bar above the grid derived from the category column.

**DA content model (available):**
```
| asset-grid available |
| MARK | Shield Mark · Primary  | [img] | SVG · PNG   | /icons/shield.svg |
| MARK | Shield Mark · Reversed | [img] | SVG · PNG   | /icons/shield.svg |
| TYPE | Roboto Slab · Family   | [img] | WOFF2 · OTF | https://fonts.google.com/specimen/Roboto+Slab |
```

**DA content model (production):**
```
| asset-grid production |
| PHOTOGRAPHY | Matchday · Wide          | 4K · 16:9 · JPG | Q2 · 26 | FIREFLY           |
| PHOTOGRAPHY | Players · Portrait       | 4K · 4:5 · JPG  | Q2 · 26 | FIREFLY           |
| PHOTOGRAPHY | Kit · Detail             | 4K · 1:1 · JPG  | Q2 · 26 | FIREFLY           |
| PHOTOGRAPHY | Iron Army · Crowd        | 4K · 16:9 · JPG | Q3 · 26 | FIREFLY           |
| TEMPLATE    | Matchday Social · Square | 1:1 · PSD · FIG | Q2 · 26 | EXPRESS           |
| TEMPLATE    | Matchday Social · Story  | 9:16 · PSD · FIG| Q2 · 26 | EXPRESS           |
| CAMPAIGN    | Iron Will · Hero         | 4K · 16:9 · PSD | Q3 · 26 | FIREFLY + EXPRESS |
| CAMPAIGN    | Iron Series IV · Kit Launch | 4K · Multi  | Q3 · 26 | EXPRESS           |
| MOTION      | Shield Build · Title Card | 1080p · 1.8s   | Q3 · 26 | PREMIERE          |
| MOTION      | Goal Celebration · Sting  | 1080p · 2.4s   | Q4 · 26 | PREMIERE          |
```

---

### Unchanged Blocks (reused as-is)
- `brand-showcase` — Voice page "brand in action" grid
- `quote` — Brand home manifesto quote
- `columns` — Governance cards (home), voice attributes strip (voice)

---

## Page Structure

### `/brand` — Brand Home

1. Metadata (`header: off`, `template: brand`)
2. `brand-nav`
3. `brand-hero` (eyebrow, headline, body, 2 CTAs)
4. `marquee`
5. `brand-overview` (mark / color / type)
6. `brand-chapters` (identity / voice / assets)
7. `brand-pillars` (4 pillars)
8. `quote` (Marcus Reyes manifesto)
9. `columns` 3-col (governance: Brand Office / Version history / Audience)
10. Standard footer

### `/brand/identity` — Identity

1. Metadata (`header: off`, `template: brand`)
2. `brand-nav`
3. `brand-hero`
4. `brand-mark` (shield in 3 contexts + 3 rule cards via columns below)
5. `columns` 3-col (Clear Space / Minimum Size / Do Not rules)
6. `color-swatches` (upgraded)
7. `type-specimen` (upgraded)
8. Standard footer

### `/brand/voice` — Voice

1. Metadata (`header: off`, `template: brand`)
2. `brand-nav`
3. `brand-hero`
4. `columns` 4-col (voice attributes: DIRECT / CONCRETE / EARNED / COMMUNAL)
5. `voice-principles` (4 principles with do/don't)
6. `voice-pairings` (4 copy pairings)
7. `brand-showcase` (6 images — brand in action)
8. Standard footer

### `/brand/assets` — Assets

1. Metadata (`header: off`, `template: brand`)
2. `brand-nav`
3. `brand-hero`
4. `asset-grid available` (3 Phase 1 assets)
5. `asset-grid production` (10 Phase 2 briefs with filter bar)
6. `columns` 2-col (photography direction: IS / ISN'T)
7. `columns` 2-col (pipeline + use-terms)
8. Standard footer

---

## Visual Design Tokens

All blocks use existing CSS custom properties from `styles/styles.css`. No new global tokens needed.

| Token | Value | Usage |
|---|---|---|
| `--background-color` | `#0D0D0D` | Iron Black — block backgrounds |
| `--text-color` | `#F5F4F0` | Forge White — body copy |
| `--highlight-color` | `#FF4500` | Iron Orange — accents, CTAs |
| `--link-hover-color` | `#FF6B35` | Ember — hover states |
| `--secondary-color` | `#3A3A3A` | Steel — secondary surfaces |
| `--heading-font-family` | Roboto Slab | All display type |
| `--body-font-family` | Roboto | Body copy |
| `--fixed-font-family` | Roboto Mono | Eyebrows, labels, specs |

Block-level tokens follow the `--block-name-property` pattern in `block-name-tokens.css`.

---

## Shared CSS Utilities

New utility classes added to a new `styles/brand.css`. This file is loaded conditionally in `scripts/scripts.js` when `getMetadata('template') === 'brand'`, using the existing `loadCSS()` utility. This avoids polluting global styles.

- `.ic-eyebrow` — Roboto Mono 500, 11px, 0.18em tracking, uppercase, Iron Orange
- `.ic-grid-bg` — faint 80px grid lines (rgba white/4%) for hero section backgrounds
- `.ic-scan` — repeating horizontal scanline overlay for photo placeholders
- `@keyframes ic-marquee` — ticker scroll animation
- `@keyframes ic-flare` — pulsing dot animation for live indicators

---

## Out of Scope

- No server-side rendering changes
- No DA folder/permission setup (content authored separately)
- No actual asset files beyond `/icons/shield.svg`
- No new font loading (Roboto family already loaded in `styles/styles.css`)
- Fan site homepage (`/`) — untouched
