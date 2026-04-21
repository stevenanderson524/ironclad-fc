export default function decorate(block) {
  const rows = [...block.children];

  rows.forEach((row) => {
    const cells = [...row.children];
    const title = cells[0]?.textContent.trim() || '';
    const slug = cells[1]?.textContent.trim() || '';
    const desc = cells[2]?.textContent.trim() || '';
    const statsRaw = cells[3]?.textContent.trim() || '';
    const stats = statsRaw.split(',').map((s) => s.trim()).filter(Boolean);
    const href = `/brand/${title.toLowerCase()}`;

    row.className = 'brand-chapters-row';

    const titleDiv = document.createElement('div');
    titleDiv.className = 'brand-chapters-title';
    const accent = document.createElement('div');
    accent.className = 'brand-chapters-accent';
    accent.setAttribute('aria-hidden', 'true');

    const h2 = document.createElement('h2');
    h2.className = 'brand-chapters-h2';
    h2.textContent = title;

    const slugEl = document.createElement('span');
    slugEl.className = 'brand-chapters-slug ic-eyebrow';
    slugEl.textContent = slug;

    const inner = document.createElement('div');
    inner.append(accent, h2, slugEl);

    const link = document.createElement('a');
    link.className = 'brand-chapters-link';
    link.href = href;
    link.textContent = 'Open Chapter \u2192';

    titleDiv.append(inner, link);

    const descDiv = document.createElement('div');
    descDiv.className = 'brand-chapters-desc';
    descDiv.textContent = desc;

    const statsDiv = document.createElement('div');
    statsDiv.className = 'brand-chapters-stats';
    stats.forEach((s) => {
      const statEl = document.createElement('div');
      statEl.className = 'brand-chapters-stat';
      const dot = document.createElement('span');
      dot.className = 'brand-chapters-stat-dot';
      dot.setAttribute('aria-hidden', 'true');
      const text = document.createTextNode(s);
      statEl.append(dot, text);
      statsDiv.appendChild(statEl);
    });

    row.replaceChildren(titleDiv, descDiv, statsDiv);
  });
}
