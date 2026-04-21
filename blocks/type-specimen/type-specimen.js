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
  list.setAttribute('aria-label', 'Typography specimens');

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
