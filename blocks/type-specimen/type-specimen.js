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

  const fontMap = {
    'Roboto Slab': 'var(--heading-font-family)',
    Roboto: 'var(--body-font-family)',
    'Roboto Mono': 'var(--fixed-font-family)',
  };

  const table = document.createElement('div');
  table.className = 'type-specimen-table';
  table.setAttribute('aria-label', 'Typography specimens');

  specimens.forEach(({
    role, family, weight, size, sample,
  }) => {
    const row = document.createElement('div');
    row.className = 'type-specimen-row';
    // eslint-disable-next-line secure-coding/detect-object-injection
    const ff = fontMap[family] || family;
    const isUpper = role === 'Headline' || role === 'Label / Eyebrow' || role === 'Eyebrow';

    const roleDiv = document.createElement('div');
    roleDiv.className = 'type-specimen-role';
    const accentBar = document.createElement('div');
    accentBar.className = 'type-specimen-accent';
    accentBar.setAttribute('aria-hidden', 'true');
    const roleLabel = document.createElement('span');
    roleLabel.className = 'ic-eyebrow';
    roleLabel.textContent = role;
    roleDiv.append(accentBar, roleLabel);

    const sampleDiv = document.createElement('div');
    sampleDiv.className = 'type-specimen-sample';
    sampleDiv.style.fontFamily = ff;
    sampleDiv.style.fontWeight = weight;
    if (isUpper) sampleDiv.style.textTransform = 'uppercase';
    sampleDiv.textContent = sample;

    const metaDiv = document.createElement('div');
    metaDiv.className = 'type-specimen-meta';
    [family.toUpperCase(), `WT ${weight}`, size].forEach((line) => {
      const d = document.createElement('div');
      d.textContent = line;
      metaDiv.appendChild(d);
    });

    row.append(roleDiv, sampleDiv, metaDiv);
    table.appendChild(row);
  });

  const display = document.createElement('div');
  display.className = 'type-specimen-display';

  const displayLabel = document.createElement('div');
  displayLabel.className = 'type-specimen-display-label ic-eyebrow';
  displayLabel.textContent = '/ SPECIMEN · ROBOTO SLAB BLACK';

  const alpha = document.createElement('div');
  alpha.className = 'type-specimen-display-alpha';
  alpha.setAttribute('aria-hidden', 'true');
  // eslint-disable-next-line secure-coding/no-improper-sanitization
  alpha.innerHTML = 'A<em>a</em>B<em>b</em>C<em>c</em>D<em>d</em>';

  const chars = document.createElement('div');
  chars.className = 'type-specimen-display-chars';
  chars.setAttribute('aria-hidden', 'true');
  chars.textContent = '0123456789 · !?&@#%';

  display.append(displayLabel, alpha, chars);
  block.replaceChildren(table, display);
}
