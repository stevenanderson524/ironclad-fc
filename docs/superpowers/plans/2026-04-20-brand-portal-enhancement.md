# Brand Portal Enhancement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 5 new blocks + a global scroll animation layer to make the Ironclad FC brand site compelling for an NFL audience evaluating AEM EDS for brand.nfl.com.

**Architecture:** All code is vanilla JS ES modules + CSS — no dependencies, no build step. New blocks live in `blocks/{name}/`. The global motion layer is a utility function added to `scripts/scripts.js` that runs after sections load. Draft HTML files in `drafts/` serve as the test harness for each block.

**Tech Stack:** Vanilla JS (ES2020), CSS custom properties, IntersectionObserver, AEM EDS block pattern.

---

## File Map

| Action | File | Purpose |
|---|---|---|
| Modify | `scripts/scripts.js` | Add `initScrollReveal()` utility |
| Modify | `styles/lazy-styles.css` | Scroll reveal + heading accent CSS |
| Modify | `blocks/hero/hero.js` | Hero entrance animation |
| Modify | `blocks/hero/hero.css` | Hero animation keyframes |
| Create | `blocks/color-swatches/color-swatches.js` | Color palette block |
| Create | `blocks/color-swatches/color-swatches.css` | Color palette styles |
| Create | `blocks/type-specimen/type-specimen.js` | Typography specimen block |
| Create | `blocks/type-specimen/type-specimen.css` | Typography specimen styles |
| Create | `blocks/section-nav/section-nav.js` | Sticky in-page nav block |
| Create | `blocks/section-nav/section-nav.css` | Sticky nav styles |
| Create | `blocks/brand-showcase/brand-showcase.js` | Brand-in-action grid block |
| Create | `blocks/brand-showcase/brand-showcase.css` | Brand showcase styles |
| Create | `blocks/asset-grid/asset-grid.js` | Filterable asset library block |
| Create | `blocks/asset-grid/asset-grid.css` | Asset grid styles |
| Create | `drafts/identity.plain.html` | Test page for Tasks 3–5 |
| Create | `drafts/voice.plain.html` | Test page for Task 6 |
| Create | `drafts/assets.plain.html` | Test page for Task 7 |

---

## Task 1: Global scroll-reveal animation utility

**Files:**
- Modify: `scripts/scripts.js`
- Modify: `styles/lazy-styles.css`

- [ ] **Step 1: Add scroll reveal CSS to `styles/lazy-styles.css`**

Append to the end of `styles/lazy-styles.css`:

```css
/* scroll reveal — sections animate in as they enter the viewport */
main .section.reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.5s ease-out, transform 0.5s ease-out;
}

main .section.reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}

/* heading accent — Iron Orange underline animates in when section is visible */
main .section h2 {
  position: relative;
}

main .section h2::after {
  content: '';
  display: block;
  height: 3px;
  width: 0;
  background: var(--highlight-color);
  margin-top: 0.4em;
  transition: width 0.4s ease-out 0.2s;
}

main .section.is-visible h2::after {
  width: 48px;
}

@media (prefers-reduced-motion: reduce) {
  main .section.reveal {
    opacity: 1;
    transform: none;
    transition: none;
  }

  main .section h2::after {
    width: 48px;
    transition: none;
  }
}
```

- [ ] **Step 2: Add `initScrollReveal()` to `scripts/scripts.js`**

Add this function directly before the `loadEager` function (before line 465):

```javascript
/**
 * Adds scroll-triggered reveal animation to all main sections.
 * Skipped when prefers-reduced-motion is set.
 */
function initScrollReveal() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('main .section').forEach((section) => {
    section.classList.add('reveal');
    observer.observe(section);
  });
}
```

- [ ] **Step 3: Call `initScrollReveal()` at the end of `loadLazy()`**

In `scripts/scripts.js`, find the `loadLazy` function. It currently ends with `loadFonts();`. Add one line after it:

```javascript
async function loadLazy(doc) {
  autolinkModals(doc);

  const main = doc.querySelector('main');
  await loadSections(main);

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  loadHeader(doc.querySelector('header'));
  loadFooter(doc.querySelector('footer'));

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  loadFonts();
  initScrollReveal(); // ← add this line
}
```

- [ ] **Step 4: Start the dev server and verify**

```bash
npx -y @adobe/aem-cli up --no-open --forward-browser-logs --html-folder drafts
```

Open http://localhost:3000/index in a browser. Scroll down — each section should fade in from slightly below as it enters the viewport. The h2 "Upcoming Matches" and "Latest News" should get an Iron Orange underline on scroll.

Expected: sections fade+slide in, h2 underlines animate. No layout shift.

- [ ] **Step 5: Run lint**

```bash
npm run lint
```

Expected: 0 errors, 0 warnings.

- [ ] **Step 6: Commit**

```bash
git add scripts/scripts.js styles/lazy-styles.css
git commit -m "feat: add scroll-reveal animation and h2 accent to all sections"
```

---

## Task 2: Hero entrance animation

**Files:**
- Modify: `blocks/hero/hero.js`
- Modify: `blocks/hero/hero.css`

- [ ] **Step 1: Verify draft test page for hero**

The file `drafts/index.plain.html` already exists with the hero block. The hero DOM after decoration looks like:
```html
<div class="hero block">
  <div>  <!-- row 1: background image -->
    <div><picture><img ...></picture></div>
  </div>
  <div>  <!-- row 2: text content -->
    <div>
      <h1>Iron Will. Ironclad.</h1>
      <p>The toughest club...</p>
      <p class="button-wrapper"><a class="button primary" href="/schedule">View Schedule</a></p>
      <p class="button-wrapper"><a class="button secondary" href="/roster">Meet the Squad</a></p>
    </div>
  </div>
</div>
```

The text content children that should animate are the direct children of `.hero > div:last-child > div`.

- [ ] **Step 2: Write `blocks/hero/hero.js`**

```javascript
/**
 * loads and decorates the hero block
 * @param {Element} block The block element
 */
export default function decorate(block) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const textRow = block.querySelector(':scope > div:last-child > div');
  if (!textRow) return;
  [...textRow.children].forEach((child, i) => {
    child.style.animationDelay = `${i * 150}ms`;
  });
  requestAnimationFrame(() => block.classList.add('hero-animate'));
}
```

- [ ] **Step 3: Add animation styles to `blocks/hero/hero.css`**

Append to the end of `blocks/hero/hero.css`:

```css
/* hero entrance animation */
.hero.hero-animate > div:last-child > div > * {
  opacity: 0;
  animation: hero-enter 0.6s ease-out forwards;
}

@keyframes hero-enter {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero.hero-animate > div:last-child > div > * {
    animation: none;
    opacity: 1;
  }
}
```

- [ ] **Step 4: Verify in browser**

With the dev server running, open http://localhost:3000/index. On page load, the hero text (h1, body paragraph, buttons) should stagger in from below: h1 first at 0ms, body at 150ms, first button at 300ms, second at 450ms.

Expected: smooth staggered entrance, no flash of invisible content.

- [ ] **Step 5: Run lint**

```bash
npm run lint
```

Expected: 0 errors.

- [ ] **Step 6: Commit**

```bash
git add blocks/hero/hero.js blocks/hero/hero.css
git commit -m "feat: add staggered entrance animation to hero block"
```

---

## Task 3: `color-swatches` block

**Files:**
- Create: `blocks/color-swatches/color-swatches.js`
- Create: `blocks/color-swatches/color-swatches.css`
- Create: `drafts/identity.plain.html`

- [ ] **Step 1: Create the draft test page `drafts/identity.plain.html`**

This is the test harness for Tasks 3–5. Create it now with the color-swatches block only (Tasks 4 and 5 will add to it):

```html
<div>
  <div class="section-nav">
    <div>
      <div>Logo</div>
      <div>#logo</div>
    </div>
    <div>
      <div>Colors</div>
      <div>#colors</div>
    </div>
    <div>
      <div>Typography</div>
      <div>#typography</div>
    </div>
  </div>
</div>

<div>
  <h2>Logo</h2>
  <p>The hexagonal iron shield mark symbolizes the city's industrial heritage and the club's unbreakable character.</p>
  <p>Use the primary lockup (white on dark) as the default. The shield mark alone is permitted for icon contexts only.</p>
</div>

<div>
  <h2>Colors</h2>
  <p>Five designated colors define the Ironclad visual system. Never use unapproved combinations.</p>
  <div class="color-swatches">
    <div>
      <div>Iron Black</div>
      <div>#0D0D0D</div>
      <div>Primary background</div>
    </div>
    <div>
      <div>Iron Orange</div>
      <div>#FF4500</div>
      <div>Accent, CTAs, emphasis</div>
    </div>
    <div>
      <div>Forge White</div>
      <div>#F5F4F0</div>
      <div>Body text, reversed type</div>
    </div>
    <div>
      <div>Steel</div>
      <div>#3A3A3A</div>
      <div>Secondary elements, surfaces</div>
    </div>
    <div>
      <div>Ember</div>
      <div>#FF6B35</div>
      <div>Interactive hover states only</div>
    </div>
  </div>
</div>

<div>
  <h2>Typography</h2>
  <p>Four typeface roles make up the Ironclad type system. Each has specific size and spacing requirements.</p>
</div>
```

- [ ] **Step 2: Create `blocks/color-swatches/color-swatches.js`**

```javascript
/**
 * Loads and decorates the color-swatches block.
 * Expects DA table rows: Color Name | Hex | Usage
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const rows = [...block.children];
  const swatches = rows.map((row) => {
    const [nameCell, hexCell, usageCell] = [...row.children];
    return {
      name: nameCell?.textContent.trim() || '',
      hex: hexCell?.textContent.trim() || '',
      usage: usageCell?.textContent.trim() || '',
    };
  }).filter(({ hex }) => hex);

  const list = document.createElement('ul');
  list.className = 'swatches-list';

  swatches.forEach(({ name, hex, usage }, i) => {
    const li = document.createElement('li');
    li.className = 'swatch';
    li.style.setProperty('--swatch-delay', `${i * 60}ms`);

    const colorBlock = document.createElement('div');
    colorBlock.className = 'swatch-color';
    colorBlock.style.backgroundColor = hex;
    colorBlock.setAttribute('aria-hidden', 'true');

    const nameEl = document.createElement('p');
    nameEl.className = 'swatch-name';
    nameEl.textContent = name;

    const hexEl = document.createElement('p');
    hexEl.className = 'swatch-hex';
    hexEl.textContent = hex;

    const usageEl = document.createElement('p');
    usageEl.className = 'swatch-usage';
    usageEl.textContent = usage;

    li.append(colorBlock, nameEl, hexEl, usageEl);
    list.append(li);
  });

  block.replaceChildren(list);

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    list.querySelectorAll('.swatch').forEach((s) => s.classList.add('swatch-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.swatch').forEach((s) => s.classList.add('swatch-visible'));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  observer.observe(block);
}
```

- [ ] **Step 3: Create `blocks/color-swatches/color-swatches.css`**

```css
main .color-swatches .swatches-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 1.5rem;
  list-style: none;
  padding: 0;
  margin: 0;
}

main .color-swatches .swatch {
  display: flex;
  flex-direction: column;
  opacity: 0;
  transform: translateX(-12px);
  transition: opacity 0.4s ease-out, transform 0.4s ease-out;
  transition-delay: var(--swatch-delay, 0ms);
}

main .color-swatches .swatch.swatch-visible {
  opacity: 1;
  transform: translateX(0);
}

main .color-swatches .swatch-color {
  height: 100px;
  border-radius: 6px 6px 0 0;
  flex-shrink: 0;
}

main .color-swatches .swatch-name {
  font-weight: 700;
  font-size: 0.875rem;
  margin: 0.5rem 0 0.1rem;
  color: var(--text-color);
}

main .color-swatches .swatch-hex {
  font-family: var(--fixed-font-family);
  font-size: 0.8rem;
  color: var(--highlight-color);
  margin: 0 0 0.25rem;
}

main .color-swatches .swatch-usage {
  font-size: 0.75rem;
  color: var(--text-color);
  opacity: 0.6;
  margin: 0;
}

@media (prefers-reduced-motion: reduce) {
  main .color-swatches .swatch {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
```

- [ ] **Step 4: Verify in browser**

Open http://localhost:3000/identity. Scroll to the Colors section. Expected: five swatches render as colored tiles with Iron Black, Iron Orange, Forge White, Steel, Ember — each with name, hex, and usage below. They slide in left-to-right in sequence as they enter the viewport.

- [ ] **Step 5: Run lint**

```bash
npm run lint
```

Expected: 0 errors.

- [ ] **Step 6: Commit**

```bash
git add blocks/color-swatches/ drafts/identity.plain.html
git commit -m "feat: add color-swatches block with staggered entrance animation"
```

---

## Task 4: `type-specimen` block

**Files:**
- Create: `blocks/type-specimen/type-specimen.js`
- Create: `blocks/type-specimen/type-specimen.css`
- Modify: `drafts/identity.plain.html`

- [ ] **Step 1: Add the type-specimen block to `drafts/identity.plain.html`**

Replace the `<div>` containing `<h2>Typography</h2>` with:

```html
<div>
  <h2>Typography</h2>
  <p>Four typeface roles make up the Ironclad type system. Each has specific size and spacing requirements.</p>
  <div class="type-specimen">
    <div>
      <div>Headline</div>
      <div>Roboto Slab</div>
      <div>900</div>
      <div>55px</div>
      <div>Iron Will. Ironclad.</div>
    </div>
    <div>
      <div>Subheading</div>
      <div>Roboto Slab</div>
      <div>700</div>
      <div>34px</div>
      <div>Built in the Forge</div>
    </div>
    <div>
      <div>Body</div>
      <div>Roboto</div>
      <div>400</div>
      <div>19px</div>
      <div>The city forged us. We play for them.</div>
    </div>
    <div>
      <div>Label / Eyebrow</div>
      <div>Roboto</div>
      <div>500</div>
      <div>12px</div>
      <div>MATCH DAY · IRON STADIUM · 7:00 PM</div>
    </div>
  </div>
</div>
```

- [ ] **Step 2: Create `blocks/type-specimen/type-specimen.js`**

```javascript
/**
 * Loads and decorates the type-specimen block.
 * Expects DA table rows: Role | Font Family | Weight | Size | Sample Text
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const rows = [...block.children];
  const specimens = rows.map((row) => {
    const cells = [...row.children];
    return {
      role: cells[0]?.textContent.trim() || '',
      family: cells[1]?.textContent.trim() || '',
      weight: cells[2]?.textContent.trim() || '',
      size: cells[3]?.textContent.trim() || '',
      sample: cells[4]?.textContent.trim() || '',
    };
  }).filter(({ sample }) => sample);

  const list = document.createElement('ul');
  list.className = 'specimens-list';

  specimens.forEach(({
    role, family, weight, size, sample,
  }) => {
    const li = document.createElement('li');
    li.className = 'specimen';

    const sampleEl = document.createElement('p');
    sampleEl.className = 'specimen-sample';
    sampleEl.textContent = sample;
    sampleEl.style.fontFamily = family;
    sampleEl.style.fontWeight = weight;
    sampleEl.style.fontSize = size;

    const meta = document.createElement('div');
    meta.className = 'specimen-meta';

    const roleEl = document.createElement('span');
    roleEl.className = 'specimen-role';
    roleEl.textContent = role;

    const detailEl = document.createElement('span');
    detailEl.className = 'specimen-detail';
    detailEl.textContent = `${family} ${weight}`;

    meta.append(roleEl, detailEl);
    li.append(sampleEl, meta);
    list.append(li);
  });

  block.replaceChildren(list);
}
```

- [ ] **Step 3: Create `blocks/type-specimen/type-specimen.css`**

```css
main .type-specimen .specimens-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0;
}

main .type-specimen .specimen {
  border-bottom: 1px solid var(--secondary-color);
  padding: 2rem 0;
}

main .type-specimen .specimen:last-child {
  border-bottom: none;
}

main .type-specimen .specimen-sample {
  margin: 0 0 1rem;
  line-height: 1.1;
  color: var(--text-color);
  word-break: break-word;
}

main .type-specimen .specimen-meta {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

main .type-specimen .specimen-role {
  font-size: 0.7rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--highlight-color);
}

main .type-specimen .specimen-detail {
  font-size: 0.75rem;
  color: var(--text-color);
  opacity: 0.5;
  font-family: var(--fixed-font-family);
}
```

- [ ] **Step 4: Verify in browser**

Open http://localhost:3000/identity. Scroll to the Typography section. Expected: four specimens — "Iron Will. Ironclad." rendered in Roboto Slab 900 at 55px; "Built in the Forge" in Roboto Slab 700 at 34px; body and label specimens below. Each row separated by a Steel border. Role label in Iron Orange beneath each specimen.

- [ ] **Step 5: Run lint**

```bash
npm run lint
```

Expected: 0 errors.

- [ ] **Step 6: Commit**

```bash
git add blocks/type-specimen/ drafts/identity.plain.html
git commit -m "feat: add type-specimen block for live typography showcase"
```

---

## Task 5: `section-nav` block

**Files:**
- Create: `blocks/section-nav/section-nav.js`
- Create: `blocks/section-nav/section-nav.css`

The draft `drafts/identity.plain.html` already has the section-nav block from Task 3, Step 1.

- [ ] **Step 1: Create `blocks/section-nav/section-nav.js`**

```javascript
/**
 * Loads and decorates the section-nav block.
 * Expects DA table rows: Label | Anchor (e.g. "#logo")
 * Assigns matching IDs to sections by matching h2 text, then builds a sticky nav.
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const rows = [...block.children];
  const links = rows.map((row) => {
    const [labelCell, anchorCell] = [...row.children];
    return {
      label: labelCell?.textContent.trim() || '',
      anchor: (anchorCell?.textContent.trim() || '').replace(/^#/, ''),
    };
  }).filter(({ label, anchor }) => label && anchor);

  // Assign IDs to sections by matching their h2 text
  const main = document.querySelector('main');
  links.forEach(({ label, anchor }) => {
    const h2 = [...(main?.querySelectorAll('h2') || [])].find(
      (el) => el.textContent.trim().toLowerCase() === label.toLowerCase(),
    );
    if (h2) h2.closest('.section')?.setAttribute('id', anchor);
  });

  // Build nav
  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'Page sections');
  const ul = document.createElement('ul');

  links.forEach(({ label, anchor }) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = `#${anchor}`;
    a.textContent = label;
    a.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' });
    });
    li.append(a);
    ul.append(li);
  });

  nav.append(ul);
  block.replaceChildren(nav);

  // Active link tracking
  const sections = links
    .map(({ anchor }) => document.getElementById(anchor))
    .filter(Boolean);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const { id } = entry.target;
      ul.querySelectorAll('a').forEach((a) => {
        a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
      });
    });
  }, {
    threshold: 0.3,
    rootMargin: `-${getComputedStyle(document.documentElement).getPropertyValue('--nav-height').trim() || '64px'} 0px 0px 0px`,
  });

  sections.forEach((section) => observer.observe(section));
}
```

- [ ] **Step 2: Create `blocks/section-nav/section-nav.css`**

```css
main .section-nav-wrapper {
  position: sticky;
  top: var(--nav-height, 64px);
  z-index: 10;
  padding: 0;
  max-width: unset;
}

main .section-nav {
  background: var(--background-color);
  border-bottom: 1px solid var(--secondary-color);
}

main .section-nav nav {
  max-width: var(--max-width-site, 1200px);
  margin: 0 auto;
  padding: 0 1.5rem;
}

main .section-nav ul {
  display: flex;
  gap: 0;
  list-style: none;
  margin: 0;
  padding: 0;
}

main .section-nav li {
  margin: 0;
}

main .section-nav a {
  display: block;
  padding: 0.75rem 1.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-color);
  text-decoration: none;
  border-bottom: 2px solid transparent;
  transition: color 0.2s, border-color 0.2s;
}

main .section-nav a:hover,
main .section-nav a.active {
  color: var(--highlight-color);
  border-bottom-color: var(--highlight-color);
}
```

- [ ] **Step 3: Verify in browser**

Open http://localhost:3000/identity. Expected:
- A slim nav bar sticks below the main site header as you scroll
- Links: Logo · Colors · Typography
- Clicking a link smooth-scrolls to the section
- The active link highlights in Iron Orange as each section enters the viewport

- [ ] **Step 4: Run lint**

```bash
npm run lint
```

Expected: 0 errors.

- [ ] **Step 5: Commit**

```bash
git add blocks/section-nav/
git commit -m "feat: add section-nav block with sticky positioning and active scroll tracking"
```

---

## Task 6: `brand-showcase` block

**Files:**
- Create: `blocks/brand-showcase/brand-showcase.js`
- Create: `blocks/brand-showcase/brand-showcase.css`
- Create: `drafts/voice.plain.html`

- [ ] **Step 1: Create `drafts/voice.plain.html`**

Note: real brand-in-action photography doesn't exist yet. Use existing draft assets as stand-ins for testing — the block renders whatever images the author provides in DA.

```html
<div>
  <h1>Voice &amp; Tone</h1>
  <p>Communication standards for Ironclad FC across all platforms.</p>
</div>

<div>
  <h2>Core Principles</h2>
  <p>Demonstrate accomplishments through actions. Use concise, active language. Center the community. Prioritize concrete details.</p>
</div>

<div>
  <h2>Brand in Action</h2>
  <p>The Ironclad identity applied across touchpoints.</p>
  <div class="brand-showcase">
    <div>
      <div>
        <picture>
          <img src="/drafts/assets/hero.jpg" alt="Ironclad FC at Iron Stadium">
        </picture>
      </div>
      <div>Stadium — Iron Stadium, matchday</div>
    </div>
    <div>
      <div>
        <picture>
          <img src="/drafts/assets/match-1.jpg" alt="Match action">
        </picture>
      </div>
      <div>Match Action — 2025 Season</div>
    </div>
    <div>
      <div>
        <picture>
          <img src="/drafts/assets/news-1.jpg" alt="Player portrait">
        </picture>
      </div>
      <div>Player Portrait — Marco Reyes</div>
    </div>
    <div>
      <div>
        <picture>
          <img src="/drafts/assets/news-2.jpg" alt="Training camp">
        </picture>
      </div>
      <div>Training — Spring Camp 2025</div>
    </div>
    <div>
      <div>
        <picture>
          <img src="/drafts/assets/match-2.jpg" alt="Fan moment">
        </picture>
      </div>
      <div>Fan Moment — Iron Stadium</div>
    </div>
    <div>
      <div>
        <picture>
          <img src="/drafts/assets/news-3.jpg" alt="Kit launch">
        </picture>
      </div>
      <div>Kit — Iron Series IV Away Kit</div>
    </div>
  </div>
</div>
```

- [ ] **Step 2: Create `blocks/brand-showcase/brand-showcase.js`**

```javascript
/**
 * Loads and decorates the brand-showcase block.
 * Expects DA table rows: Image | Label
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const rows = [...block.children];
  const items = rows.map((row) => {
    const [imageCell, labelCell] = [...row.children];
    const picture = imageCell?.querySelector('picture');
    return {
      picture,
      label: labelCell?.textContent.trim() || '',
    };
  }).filter(({ picture }) => picture);

  const grid = document.createElement('ul');
  grid.className = 'showcase-grid';
  grid.setAttribute('aria-label', 'Brand in action');

  items.forEach(({ picture, label }) => {
    const li = document.createElement('li');
    li.className = 'showcase-item';

    const img = picture.querySelector('img');
    if (img) {
      img.loading = 'lazy';
      if (!img.alt) img.alt = label;
    }

    const overlay = document.createElement('div');
    overlay.className = 'showcase-overlay';
    overlay.setAttribute('aria-hidden', 'true');

    const labelEl = document.createElement('span');
    labelEl.className = 'showcase-label';
    labelEl.textContent = label;
    overlay.append(labelEl);

    li.append(picture, overlay);
    grid.append(li);
  });

  block.replaceChildren(grid);
}
```

- [ ] **Step 3: Create `blocks/brand-showcase/brand-showcase.css`**

```css
main .brand-showcase .showcase-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1rem;
  list-style: none;
  padding: 0;
  margin: 0;
}

main .brand-showcase .showcase-item {
  position: relative;
  overflow: hidden;
  border-radius: 4px;
  aspect-ratio: 4 / 3;
  background: var(--secondary-color);
}

main .brand-showcase .showcase-item picture {
  display: block;
  width: 100%;
  height: 100%;
}

main .brand-showcase .showcase-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

main .brand-showcase .showcase-item:hover img {
  transform: scale(1.05);
}

main .brand-showcase .showcase-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: flex-end;
  padding: 1rem;
  background: linear-gradient(to top, rgb(13 13 13 / 80%) 0%, transparent 60%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

main .brand-showcase .showcase-item:hover .showcase-overlay {
  opacity: 1;
}

main .brand-showcase .showcase-label {
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--highlight-color);
}

@media (width >= 600px) {
  main .brand-showcase .showcase-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
}

@media (prefers-reduced-motion: reduce) {
  main .brand-showcase .showcase-item img {
    transition: none;
  }

  main .brand-showcase .showcase-overlay {
    transition: none;
    opacity: 1;
  }
}
```

- [ ] **Step 4: Verify in browser**

```bash
npx -y @adobe/aem-cli up --no-open --forward-browser-logs --html-folder drafts
```

Open http://localhost:3000/voice. Scroll to "Brand in Action". Expected: 6 images in an auto-fill grid; hovering any image triggers a 5% zoom and an Iron Orange label overlay fades in at the bottom.

- [ ] **Step 5: Run lint**

```bash
npm run lint
```

Expected: 0 errors.

- [ ] **Step 6: Commit**

```bash
git add blocks/brand-showcase/ drafts/voice.plain.html
git commit -m "feat: add brand-showcase block for identity-in-action grid"
```

---

## Task 7: `asset-grid` block

**Files:**
- Create: `blocks/asset-grid/asset-grid.js`
- Create: `blocks/asset-grid/asset-grid.css`
- Create: `drafts/assets.plain.html`

- [ ] **Step 1: Create `drafts/assets.plain.html`**

```html
<div>
  <h1>Approved Brand Assets</h1>
  <p>For licensed partners, accredited media, and authorized agencies. Assets marked as cleared require no additional approval.</p>
</div>

<div>
  <h2>Asset Library</h2>
  <div class="asset-grid">
    <div>
      <div>Logos</div>
      <div>Primary Lockup — Light</div>
      <div>
        <picture>
          <img src="/drafts/assets/hero.jpg" alt="Primary Lockup Light">
        </picture>
      </div>
      <div>SVG, PNG</div>
      <div><a href="/drafts/assets/hero.jpg">Download</a></div>
    </div>
    <div>
      <div>Logos</div>
      <div>Shield Mark</div>
      <div>
        <picture>
          <img src="/drafts/assets/hero.jpg" alt="Shield Mark">
        </picture>
      </div>
      <div>SVG, PNG, EPS</div>
      <div><a href="/drafts/assets/hero.jpg">Download</a></div>
    </div>
    <div>
      <div>Photography</div>
      <div>Match Action — Reyes Derby</div>
      <div>
        <picture>
          <img src="/drafts/assets/match-1.jpg" alt="Match Action">
        </picture>
      </div>
      <div>JPG 4K</div>
      <div><a href="/drafts/assets/match-1.jpg">Download</a></div>
    </div>
    <div>
      <div>Photography</div>
      <div>Training — Spring Camp</div>
      <div>
        <picture>
          <img src="/drafts/assets/news-2.jpg" alt="Training">
        </picture>
      </div>
      <div>JPG 4K</div>
      <div><a href="/drafts/assets/news-2.jpg">Download</a></div>
    </div>
    <div>
      <div>Templates</div>
      <div>Matchday Social — Square</div>
      <div>
        <picture>
          <img src="/drafts/assets/match-2.jpg" alt="Social Template">
        </picture>
      </div>
      <div>PSD, Figma</div>
      <div><a href="/drafts/assets/match-2.jpg">Download</a></div>
    </div>
    <div>
      <div>Campaign</div>
      <div>Iron Will Hero Image</div>
      <div>
        <picture>
          <img src="/drafts/assets/match-3.jpg" alt="Campaign Hero">
        </picture>
      </div>
      <div>JPG 4K, PSD</div>
      <div><a href="/drafts/assets/match-3.jpg">Download</a></div>
    </div>
  </div>
</div>
```

- [ ] **Step 2: Create `blocks/asset-grid/asset-grid.js`**

```javascript
/**
 * Loads and decorates the asset-grid block.
 * Expects DA table rows: Category | Name | Thumbnail Image | Format | Download Link
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const rows = [...block.children];
  const assets = rows.map((row) => {
    const cells = [...row.children];
    return {
      category: cells[0]?.textContent.trim() || '',
      name: cells[1]?.textContent.trim() || '',
      picture: cells[2]?.querySelector('picture') || null,
      format: cells[3]?.textContent.trim() || '',
      link: cells[4]?.querySelector('a') || null,
    };
  }).filter(({ name }) => name);

  const categories = [...new Set(assets.map((a) => a.category))].filter(Boolean);

  // Build filter tabs
  const tabs = document.createElement('div');
  tabs.className = 'asset-tabs';
  tabs.setAttribute('role', 'tablist');
  tabs.setAttribute('aria-label', 'Filter assets by category');

  const allBtn = document.createElement('button');
  allBtn.className = 'asset-tab active';
  allBtn.textContent = 'All';
  allBtn.setAttribute('role', 'tab');
  allBtn.setAttribute('aria-selected', 'true');
  tabs.append(allBtn);

  categories.forEach((cat) => {
    const btn = document.createElement('button');
    btn.className = 'asset-tab';
    btn.textContent = cat;
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-selected', 'false');
    tabs.append(btn);
  });

  // Build grid
  const grid = document.createElement('ul');
  grid.className = 'asset-grid-list';

  assets.forEach(({
    category, name, picture, format, link,
  }) => {
    const li = document.createElement('li');
    li.className = 'asset-card';
    li.dataset.category = category;

    if (picture) {
      const img = picture.querySelector('img');
      if (img) img.loading = 'lazy';
      li.append(picture);
    }

    const body = document.createElement('div');
    body.className = 'asset-card-body';

    const nameEl = document.createElement('p');
    nameEl.className = 'asset-name';
    nameEl.textContent = name;

    const formatEl = document.createElement('p');
    formatEl.className = 'asset-format';
    formatEl.textContent = format;

    body.append(nameEl, formatEl);

    if (link) {
      link.className = 'asset-download';
      link.textContent = 'Download';
      link.setAttribute('aria-label', `Download ${name}`);
      body.append(link);
    }

    li.append(body);
    grid.append(li);
  });

  // Client-side filter
  function filterAssets(category) {
    grid.querySelectorAll('.asset-card').forEach((card) => {
      card.hidden = category !== 'All' && card.dataset.category !== category;
    });
    tabs.querySelectorAll('.asset-tab').forEach((btn) => {
      const selected = btn.textContent === category;
      btn.classList.toggle('active', selected);
      btn.setAttribute('aria-selected', String(selected));
    });
  }

  tabs.addEventListener('click', (e) => {
    const btn = e.target.closest('.asset-tab');
    if (btn) filterAssets(btn.textContent);
  });

  block.replaceChildren(tabs, grid);
}
```

- [ ] **Step 3: Create `blocks/asset-grid/asset-grid.css`**

```css
main .asset-grid .asset-tabs {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
}

main .asset-grid .asset-tab {
  padding: 0.5rem 1.25rem;
  background: transparent;
  border: 1px solid var(--secondary-color);
  color: var(--text-color);
  font-family: var(--body-font-family);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  cursor: pointer;
  border-radius: 2px;
  transition: background 0.2s, border-color 0.2s;
}

main .asset-grid .asset-tab:hover,
main .asset-grid .asset-tab.active {
  background: var(--highlight-color);
  border-color: var(--highlight-color);
  color: var(--text-color);
}

main .asset-grid .asset-grid-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
  list-style: none;
  padding: 0;
  margin: 0;
}

main .asset-grid .asset-card {
  background: var(--secondary-color);
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

main .asset-grid .asset-card[hidden] {
  display: none;
}

main .asset-grid .asset-card picture {
  display: block;
  aspect-ratio: 16 / 9;
  overflow: hidden;
}

main .asset-grid .asset-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

main .asset-grid .asset-card:hover img {
  transform: scale(1.03);
}

main .asset-grid .asset-card-body {
  padding: 0.875rem;
  display: flex;
  flex-direction: column;
  flex: 1;
}

main .asset-grid .asset-name {
  font-weight: 600;
  font-size: 0.875rem;
  margin: 0 0 0.25rem;
  color: var(--text-color);
}

main .asset-grid .asset-format {
  font-size: 0.7rem;
  color: var(--text-color);
  opacity: 0.5;
  margin: 0;
  font-family: var(--fixed-font-family);
}

main .asset-grid .asset-download {
  display: inline-block;
  margin-top: 0.75rem;
  padding: 0.4rem 0.75rem;
  background: var(--highlight-color);
  color: var(--text-color);
  text-decoration: none;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 500;
  border-radius: 2px;
  align-self: flex-start;
  transition: background 0.2s;
}

main .asset-grid .asset-download:hover {
  background: var(--hover-color);
}

@media (width >= 600px) {
  main .asset-grid .asset-grid-list {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  }
}

@media (prefers-reduced-motion: reduce) {
  main .asset-grid .asset-card img {
    transition: none;
  }
}
```

- [ ] **Step 4: Verify in browser**

Open http://localhost:3000/assets. Expected:
- Four filter tabs: All · Logos · Photography · Templates · Campaign
- 6 asset cards in a grid with thumbnail, name, format, and orange Download button
- Clicking "Logos" hides non-logo cards instantly; clicking "All" restores them

- [ ] **Step 5: Run lint**

```bash
npm run lint
```

Expected: 0 errors.

- [ ] **Step 6: Commit**

```bash
git add blocks/asset-grid/ drafts/assets.plain.html
git commit -m "feat: add asset-grid block with client-side category filtering"
```

---

## Task 8: Final lint + push

- [ ] **Step 1: Run full lint across the project**

```bash
npm run lint
```

Expected: 0 errors, 0 warnings.

- [ ] **Step 2: Verify all three draft pages in the browser**

```bash
npx -y @adobe/aem-cli up --no-open --forward-browser-logs --html-folder drafts
```

Check each page:
- http://localhost:3000/index — hero animates on load; sections scroll-reveal; h2 underlines animate
- http://localhost:3000/identity — section-nav sticks and tracks scroll; color swatches stagger in; type specimens render at correct sizes
- http://localhost:3000/voice — brand-showcase grid renders; hover zoom + label overlay work
- http://localhost:3000/assets — asset tabs filter correctly; download buttons styled correctly

- [ ] **Step 3: Push to GitHub**

```bash
git push
```

- [ ] **Step 4: Remind user to add blocks in DA**

After push, the author must add the new blocks to the live DA pages:
- `/identity` — add `section-nav` block (table: Logo/#logo, Colors/#colors, Typography/#typography), `color-swatches` block, `type-specimen` block
- `/voice` — add `brand-showcase` block with real brand imagery
- `/assets` — add `asset-grid` block with real asset thumbnails and download links

Then Preview + Publish each page in da.live to activate the new blocks on the live site.
