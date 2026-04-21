export default async function decorate(block) {
  const downloadHref = block.querySelector('a')?.href || '#';

  const svgRes = await fetch(`${window.hlx.codeBasePath}/icons/shield.svg`);
  const svgText = svgRes.ok ? await svgRes.text() : '';

  const navItems = [
    { label: 'Home', slug: null, path: '/brand' },
    { label: 'Identity', slug: 'identity', path: '/brand/identity' },
    { label: 'Voice', slug: 'voice', path: '/brand/voice' },
    { label: 'Assets', slug: 'assets', path: '/brand/assets' },
  ];

  const { pathname } = window.location;
  const activeItem = navItems.find((it) => {
    if (!it.slug) {
      return !navItems.slice(1).some((other) => pathname.includes(other.slug));
    }
    return pathname.includes(it.slug);
  }) || navItems[0];

  block.innerHTML = `
    <div class="brand-nav-left">
      <a href="/brand" class="brand-nav-lockup" aria-label="Ironclad FC Brand System home">
        <span class="brand-nav-shield" aria-hidden="true">${svgText}</span>
        <span class="brand-nav-wordmark">
          <span class="brand-nav-name">Ironclad</span>
          <span class="brand-nav-sub">F · C</span>
        </span>
      </a>
      <span class="brand-nav-divider" aria-hidden="true"></span>
      <span class="brand-nav-system ic-eyebrow">Brand System</span>
    </div>
    <nav class="brand-nav-tabs" aria-label="Brand site sections">
      ${navItems.map((it) => `
        <a href="${it.path}"
           class="brand-nav-tab${activeItem.slug === it.slug ? ' active' : ''}"
           ${activeItem.slug === it.slug ? 'aria-current="page"' : ''}>${it.label}</a>
      `).join('')}
    </nav>
    <div class="brand-nav-right">
      <span class="brand-nav-version ic-eyebrow">v4.2 · 04.21.26</span>
      <a href="${downloadHref}" class="brand-nav-cta">Download Kit</a>
    </div>
  `;

  block.closest('.section')?.classList.add('brand-nav-section');
}
