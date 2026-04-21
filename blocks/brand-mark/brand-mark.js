async function fetchShield() {
  const res = await fetch(`${window.hlx.codeBasePath}/icons/shield.svg`);
  if (!res.ok) return null;
  // eslint-disable-next-line secure-coding/no-xxe-injection
  const parser = new DOMParser();
  const doc = parser.parseFromString(await res.text(), 'image/svg+xml');
  return doc.querySelector('svg');
}

function buildContext(svgEl, className, label, usageText, fileText) {
  const ctx = document.createElement('div');
  ctx.className = `brand-mark-context ${className}`;

  const labelEl = document.createElement('span');
  labelEl.className = 'brand-mark-label ic-eyebrow';
  labelEl.textContent = label;
  ctx.appendChild(labelEl);

  if (svgEl) ctx.appendChild(svgEl.cloneNode(true));

  if (usageText) {
    const usage = document.createElement('span');
    usage.className = 'brand-mark-usage ic-eyebrow';
    usage.textContent = usageText;
    ctx.appendChild(usage);
  }

  if (fileText) {
    const file = document.createElement('span');
    file.className = 'brand-mark-file ic-eyebrow';
    file.textContent = fileText;
    ctx.appendChild(file);
  }

  return ctx;
}

export default async function decorate(block) {
  const svgEl = await fetchShield();

  if (!svgEl) {
    const err = document.createElement('p');
    err.className = 'brand-mark-error';
    err.textContent = 'Mark not found — upload /icons/shield.svg';
    block.replaceChildren(err);
    return;
  }

  const contexts = document.createElement('div');
  contexts.className = 'brand-mark-contexts';

  const primary = buildContext(svgEl, 'brand-mark-primary', '/ PRIMARY LOCKUP · DARK', 'DEFAULT USE', 'IC-MARK-01.SVG');

  const variants = document.createElement('div');
  variants.className = 'brand-mark-variants';
  variants.appendChild(buildContext(svgEl, 'brand-mark-reversed', '/ REVERSED · LIGHT', null, null));
  variants.appendChild(buildContext(svgEl, 'brand-mark-emergency', '/ EMERGENCY · ACCENT', null, null));

  contexts.appendChild(primary);
  contexts.appendChild(variants);
  block.replaceChildren(contexts);
}
