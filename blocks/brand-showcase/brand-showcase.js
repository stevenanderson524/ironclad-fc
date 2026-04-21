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
  }).filter(({ label }) => label);

  const grid = document.createElement('ul');
  grid.className = 'showcase-grid';
  grid.setAttribute('aria-label', 'Brand in action');

  items.forEach(({ picture, label }) => {
    const li = document.createElement('li');
    li.className = 'showcase-item';

    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        img.loading = 'lazy';
        if (!img.alt) img.alt = label;
      }
      li.append(picture);
    } else {
      li.classList.add('showcase-placeholder');
    }

    const overlay = document.createElement('div');
    overlay.className = 'showcase-overlay';
    overlay.setAttribute('aria-hidden', 'true');

    const labelEl = document.createElement('span');
    labelEl.className = 'showcase-label';
    labelEl.textContent = label;
    overlay.append(labelEl);

    li.append(overlay);
    grid.append(li);
  });

  block.replaceChildren(grid);
}
