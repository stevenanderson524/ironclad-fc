export default function decorate(block) {
  const rows = [...block.children];
  const eyebrow = rows[0]?.querySelector('p')?.textContent.trim() || '';
  const headlineText = rows[1]?.querySelector('p')?.textContent.trim() || '';
  const bodyHTML = rows[2]?.querySelector('p')?.innerHTML || '';
  const ctaLinks = rows.slice(3).flatMap((row) => [...row.querySelectorAll('a')]);

  const words = headlineText.split(' ');
  const lastWord = words.pop();
  const firstLine = words.join(' ');

  block.closest('.section')?.classList.add('ic-grid-bg');

  // eslint-disable-next-line browser-security/no-innerhtml, secure-coding/no-improper-sanitization
  block.innerHTML = `
    <div class="brand-hero-corner brand-hero-tl" aria-hidden="true"></div>
    <div class="brand-hero-corner brand-hero-tr" aria-hidden="true"></div>
    <div class="brand-hero-kicker">
      <span class="brand-hero-eyebrow ic-eyebrow">
        <span class="brand-hero-dot" aria-hidden="true"></span>
        ${eyebrow}
      </span>
      <span class="brand-hero-domain ic-eyebrow">brand.ironcladfc.com · INTERNAL + AUTHORIZED USE</span>
    </div>
    <div class="brand-hero-headline">
      <h1 class="brand-hero-line1">${firstLine}</h1>
      <div class="brand-hero-line2-row">
        <p class="brand-hero-line2">${lastWord}</p>
        <p class="brand-hero-body">${bodyHTML}</p>
      </div>
    </div>
  `;

  if (ctaLinks.length) {
    const ctaRow = document.createElement('div');
    ctaRow.className = 'brand-hero-ctas';
    ctaLinks.forEach((a, i) => {
      a.className = i === 0 ? 'brand-hero-btn' : 'brand-hero-btn brand-hero-btn-ghost';
    });
    const scrollHint = document.createElement('span');
    scrollHint.className = 'brand-hero-scroll ic-eyebrow';
    scrollHint.textContent = 'SCROLL ↓ WHAT\'S INSIDE';
    ctaRow.append(...ctaLinks, scrollHint);
    block.appendChild(ctaRow);
  }
}
