export default async function decorate(block) {
  const rows = [...block.children];

  let shieldSvg = null;
  const svgRes = await fetch(`${window.hlx.codeBasePath}/icons/shield.svg`);
  if (svgRes.ok) {
    // eslint-disable-next-line secure-coding/no-xxe-injection
    const parser = new DOMParser();
    const doc = parser.parseFromString(await svgRes.text(), 'image/svg+xml');
    shieldSvg = doc.querySelector('svg');
  }

  [...rows].forEach((row, i) => {
    const cells = [...row.children];
    const label = cells[0]?.textContent.trim() || '';
    const name = cells[1]?.textContent.trim() || '';
    const spec = cells[2]?.textContent.trim() || '';

    const col = document.createElement('div');
    col.className = 'brand-overview-col';

    const labelEl = document.createElement('span');
    labelEl.className = 'brand-overview-label ic-eyebrow';
    labelEl.textContent = label;

    const visualDiv = document.createElement('div');
    visualDiv.className = 'brand-overview-visual';

    if (i === 0) {
      const shieldSpan = document.createElement('span');
      shieldSpan.className = 'brand-overview-shield';
      shieldSpan.setAttribute('aria-label', 'Iron Shield mark');
      if (shieldSvg) shieldSpan.appendChild(shieldSvg.cloneNode(true));
      visualDiv.appendChild(shieldSpan);
    } else if (i === 1) {
      const swatch = document.createElement('div');
      swatch.className = 'brand-overview-swatch';
      swatch.setAttribute('aria-label', 'Iron Orange colour swatch');
      visualDiv.appendChild(swatch);
    } else {
      const typeEl = document.createElement('div');
      typeEl.className = 'brand-overview-type';
      typeEl.setAttribute('aria-hidden', 'true');
      typeEl.textContent = 'Aa';
      visualDiv.appendChild(typeEl);
    }

    const infoDiv = document.createElement('div');
    const nameEl = document.createElement('div');
    nameEl.className = 'brand-overview-name';
    nameEl.textContent = name;
    const specEl = document.createElement('div');
    specEl.className = 'brand-overview-spec ic-eyebrow';
    specEl.textContent = spec;
    infoDiv.append(nameEl, specEl);

    col.append(labelEl, visualDiv, infoDiv);
    row.replaceWith(col);
  });
}
