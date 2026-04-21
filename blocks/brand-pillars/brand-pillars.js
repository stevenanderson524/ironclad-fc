export default function decorate(block) {
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const title = cells[0]?.textContent.trim() || '';
    const desc = cells[1]?.textContent.trim() || '';

    row.className = 'brand-pillars-item';

    const accent = document.createElement('div');
    accent.className = 'brand-pillars-accent';
    accent.setAttribute('aria-hidden', 'true');

    const h3 = document.createElement('h3');
    h3.textContent = title;

    const p = document.createElement('p');
    p.textContent = desc;

    row.replaceChildren(accent, h3, p);
  });
}
