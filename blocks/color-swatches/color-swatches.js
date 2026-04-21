export default function decorate(block) {
  const rows = [...block.children];
  const swatches = rows.map((row) => {
    const cells = [...row.children];
    return {
      name: cells[0]?.textContent.trim() || '',
      hex: cells[1]?.textContent.trim() || '',
      usage: cells[2]?.textContent.trim() || '',
    };
  }).filter(({ hex }) => /^#[0-9a-f]{3,6}$/i.test(hex));

  const grid = document.createElement('div');
  grid.className = 'swatches-grid';
  grid.setAttribute('aria-label', 'Brand colour palette');

  swatches.forEach(({ name, hex, usage }, i) => {
    const normalHex = hex.toLowerCase();
    const col = document.createElement('div');
    col.className = `swatches-col${i === 0 ? ' swatches-col-wide' : ''}`;
    col.style.setProperty('--swatch-bg', normalHex);

    const fg = normalHex === '#f5f4f0' || normalHex === '#ff6b35' ? '#0d0d0d' : '#f5f4f0';

    const nameEl = document.createElement('div');
    nameEl.className = 'swatches-name';
    nameEl.style.color = fg;
    nameEl.textContent = name;

    const meta = document.createElement('div');
    meta.className = 'swatches-meta';
    meta.style.color = fg;

    const hexEl = document.createElement('div');
    hexEl.className = 'swatches-hex';
    hexEl.textContent = hex;

    const usageEl = document.createElement('div');
    usageEl.className = 'swatches-usage';
    usageEl.textContent = usage;

    meta.append(hexEl, usageEl);
    col.append(nameEl, meta);
    grid.appendChild(col);
  });

  const ratioBar = document.createElement('div');
  ratioBar.className = 'swatches-ratio';

  const ratioLabel = document.createElement('div');
  ratioLabel.className = 'swatches-ratio-label ic-eyebrow';
  ratioLabel.textContent = '/ USAGE RATIO · PRIMARY SURFACES';

  const ratioBarEl = document.createElement('div');
  ratioBarEl.className = 'swatches-ratio-bar';
  ratioBarEl.setAttribute('aria-hidden', 'true');

  const segs = [
    { flex: 60, bg: '#0D0D0D', fg: '#F5F4F0', label: 'IRON BLACK · 60%' },
    { flex: 25, bg: '#F5F4F0', fg: '#0D0D0D', label: 'FORGE WHITE · 25%' },
    { flex: 10, bg: '#FF4500', fg: '#0D0D0D', label: 'ORANGE · 10%' },
    { flex: 5, bg: '#3A3A3A', fg: '#F5F4F0', label: 'STEEL · 5%' },
  ];

  segs.forEach(({ flex, bg, fg, label }) => {
    const seg = document.createElement('div');
    seg.className = 'swatches-ratio-seg';
    seg.style.cssText = `flex: ${flex}; background: ${bg};`;
    const span = document.createElement('span');
    span.className = 'ic-eyebrow';
    span.style.color = fg;
    span.textContent = label;
    seg.appendChild(span);
    ratioBarEl.appendChild(seg);
  });

  ratioBar.append(ratioLabel, ratioBarEl);
  block.replaceChildren(grid, ratioBar);
}
