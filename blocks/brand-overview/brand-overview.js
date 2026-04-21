export default async function decorate(block) {
  const rows = [...block.children];

  const svgRes = await fetch(`${window.hlx.codeBasePath}/icons/shield.svg`);
  const svgText = svgRes.ok ? await svgRes.text() : '';

  rows.forEach((row, i) => {
    const cells = [...row.children];
    const label = cells[0]?.textContent.trim() || '';
    const name = cells[1]?.textContent.trim() || '';
    const spec = cells[2]?.textContent.trim() || '';

    let visual = '';
    if (i === 0) {
      visual = `<span class="brand-overview-shield" aria-label="Iron Shield mark">${svgText}</span>`;
    } else if (i === 1) {
      visual = `<div class="brand-overview-swatch" aria-label="Iron Orange colour swatch"></div>`;
    } else {
      visual = `<div class="brand-overview-type" aria-hidden="true">Aa</div>`;
    }

    row.className = 'brand-overview-col';
    row.innerHTML = `
      <span class="brand-overview-label ic-eyebrow">${label}</span>
      <div class="brand-overview-visual">${visual}</div>
      <div>
        <div class="brand-overview-name">${name}</div>
        <div class="brand-overview-spec ic-eyebrow">${spec}</div>
      </div>
    `;
  });
}
