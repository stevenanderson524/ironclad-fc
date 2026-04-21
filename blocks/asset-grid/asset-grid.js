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
