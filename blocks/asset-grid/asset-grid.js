function decorateAvailable(block, rows) {
  const assets = rows.map((row) => {
    const cells = [...row.children];
    return {
      category: cells[0]?.textContent.trim() || '',
      name: cells[1]?.textContent.trim() || '',
      picture: cells[2]?.querySelector('picture') || null,
      spec: cells[3]?.textContent.trim() || '',
      href: cells[4]?.querySelector('a')?.href || cells[4]?.textContent.trim() || '#',
    };
  }).filter(({ name }) => name);

  const grid = document.createElement('div');
  grid.className = 'asset-grid-available';

  assets.forEach(({
    category, name, picture, spec, href,
  }) => {
    const card = document.createElement('div');
    card.className = 'asset-card';

    if (picture) {
      const img = picture.querySelector('img');
      if (img) img.loading = 'lazy';
    }

    const isExternal = (() => {
      try {
        return new URL(href).origin !== window.location.origin;
      } catch {
        return false;
      }
    })();
    const ctaLabel = isExternal ? 'Open Google Fonts ↗' : 'Download ↓';

    const preview = document.createElement('div');
    preview.className = 'asset-card-preview';

    if (picture) {
      preview.appendChild(picture);
    } else {
      const noimg = document.createElement('div');
      noimg.className = 'asset-card-noimg';
      noimg.setAttribute('aria-hidden', 'true');
      preview.appendChild(noimg);
    }

    const badge = document.createElement('span');
    badge.className = 'asset-card-badge';
    badge.textContent = 'AVAILABLE';
    preview.appendChild(badge);

    const body = document.createElement('div');
    body.className = 'asset-card-body';

    const catEl = document.createElement('span');
    catEl.className = 'ic-eyebrow asset-card-cat';
    catEl.textContent = category;

    const nameEl = document.createElement('h3');
    nameEl.className = 'asset-card-name';
    nameEl.textContent = name;

    const specEl = document.createElement('div');
    specEl.className = 'asset-card-spec';
    specEl.textContent = spec;

    const dl = document.createElement('a');
    dl.className = 'asset-card-dl';
    dl.href = href;
    dl.textContent = ctaLabel;
    dl.setAttribute('aria-label', `${ctaLabel} ${name}`);
    if (isExternal) {
      dl.target = '_blank';
      dl.rel = 'noopener noreferrer';
    }

    body.append(catEl, nameEl, specEl, dl);
    card.append(preview, body);
    grid.appendChild(card);
  });

  block.replaceChildren(grid);
}

function decorateProduction(block, rows) {
  const assets = rows.map((row) => {
    const cells = [...row.children];
    return {
      category: cells[0]?.textContent.trim() || '',
      name: cells[1]?.textContent.trim() || '',
      spec: cells[2]?.textContent.trim() || '',
      phase: cells[3]?.textContent.trim() || '',
      tool: cells[4]?.textContent.trim() || '',
    };
  }).filter(({ name }) => name);

  const allCats = ['ALL', ...new Set(assets.map((a) => a.category))].filter(Boolean);
  let activeFilter = 'ALL';

  const filterBar = document.createElement('div');
  filterBar.className = 'asset-prod-filters';
  filterBar.setAttribute('role', 'tablist');
  filterBar.setAttribute('aria-label', 'Filter production assets by category');

  const grid = document.createElement('div');
  grid.className = 'asset-prod-grid';

  function renderGrid() {
    const shown = activeFilter === 'ALL' ? assets : assets.filter((a) => a.category === activeFilter);
    while (grid.firstChild) grid.removeChild(grid.firstChild);

    shown.forEach(({
      category, name, spec, phase, tool,
    }) => {
      const format = spec.split(' · ')[1] || spec.split(' · ')[0] || '';

      const brief = document.createElement('div');
      brief.className = 'asset-brief';

      const slot = document.createElement('div');
      slot.className = 'asset-brief-slot';
      slot.setAttribute('aria-hidden', 'true');

      const phaseEl = document.createElement('span');
      phaseEl.className = 'asset-brief-phase ic-eyebrow';
      phaseEl.textContent = phase;

      const formatEl = document.createElement('span');
      formatEl.className = 'asset-brief-format';
      formatEl.textContent = format;

      slot.append(phaseEl, formatEl);

      const body = document.createElement('div');
      body.className = 'asset-brief-body';

      const header = document.createElement('div');
      header.className = 'asset-brief-header';

      const catEl = document.createElement('span');
      catEl.className = 'ic-eyebrow asset-card-cat';
      catEl.textContent = category;

      const toolEl = document.createElement('span');
      toolEl.className = 'asset-brief-tool';
      toolEl.textContent = tool;

      header.append(catEl, toolEl);

      const nameEl = document.createElement('h3');
      nameEl.className = 'asset-brief-name';
      nameEl.textContent = name;

      const footer = document.createElement('div');
      footer.className = 'asset-brief-footer';

      const specEl = document.createElement('span');
      specEl.textContent = spec;

      const statusEl = document.createElement('span');
      statusEl.className = 'asset-brief-status';
      statusEl.textContent = 'IN PRODUCTION →';

      footer.append(specEl, statusEl);
      body.append(header, nameEl, footer);
      brief.append(slot, body);
      grid.appendChild(brief);
    });
  }

  function renderFilters() {
    while (filterBar.firstChild) filterBar.removeChild(filterBar.firstChild);

    allCats.forEach((cat) => {
      const count = cat === 'ALL' ? assets.length : assets.filter((a) => a.category === cat).length;
      const btn = document.createElement('button');
      btn.className = `asset-prod-filter${cat === activeFilter ? ' active' : ''}`;
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', String(cat === activeFilter));
      btn.dataset.cat = cat;
      btn.textContent = `${cat} · ${count}`;
      btn.addEventListener('click', () => {
        activeFilter = cat;
        renderFilters();
        renderGrid();
      });
      filterBar.appendChild(btn);
    });
  }

  filterBar.addEventListener('keydown', (e) => {
    if (!['ArrowLeft', 'ArrowRight'].includes(e.key)) return;
    const btns = [...filterBar.querySelectorAll('.asset-prod-filter')];
    const idx = btns.indexOf(document.activeElement);
    if (idx === -1) return;
    const next = e.key === 'ArrowRight' ? (idx + 1) % btns.length : (idx - 1 + btns.length) % btns.length;
    btns[next]?.focus();
    activeFilter = btns[next]?.dataset.cat || activeFilter;
    renderFilters();
    renderGrid();
  });

  renderFilters();
  renderGrid();
  block.replaceChildren(filterBar, grid);
}

export default function decorate(block) {
  const isProduction = block.classList.contains('production');
  const rows = [...block.children];

  if (isProduction) {
    decorateProduction(block, rows);
  } else {
    decorateAvailable(block, rows);
  }
}
