/**
 * Loads and decorates the color-swatches block.
 * Expects DA table rows: Color Name | Hex | Usage
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const rows = [...block.children];
  const swatches = rows.map((row) => {
    const [nameCell, hexCell, usageCell] = [...row.children];
    return {
      name: nameCell?.textContent.trim() || '',
      hex: hexCell?.textContent.trim() || '',
      usage: usageCell?.textContent.trim() || '',
    };
  }).filter(({ hex }) => hex);

  const list = document.createElement('ul');
  list.className = 'swatches-list';

  swatches.forEach(({ name, hex, usage }, i) => {
    const li = document.createElement('li');
    li.className = 'swatch';
    li.style.setProperty('--swatch-delay', `${i * 60}ms`);

    const colorBlock = document.createElement('div');
    colorBlock.className = 'swatch-color';
    colorBlock.style.backgroundColor = hex;
    colorBlock.setAttribute('aria-hidden', 'true');

    const nameEl = document.createElement('p');
    nameEl.className = 'swatch-name';
    nameEl.textContent = name;

    const hexEl = document.createElement('p');
    hexEl.className = 'swatch-hex';
    hexEl.textContent = hex;

    const usageEl = document.createElement('p');
    usageEl.className = 'swatch-usage';
    usageEl.textContent = usage;

    li.append(colorBlock, nameEl, hexEl, usageEl);
    list.append(li);
  });

  block.replaceChildren(list);

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    list.querySelectorAll('.swatch').forEach((s) => s.classList.add('swatch-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.swatch').forEach((s) => s.classList.add('swatch-visible'));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  observer.observe(block);
}
