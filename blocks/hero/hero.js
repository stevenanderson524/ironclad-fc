export default function decorate(block) {
  // Lift picture out of the content div so it can be positioned relative to .hero,
  // not inside the flex-item stacking context that would bury it behind the scrim.
  const pic = block.querySelector('picture');
  if (pic) {
    const wrapper = pic.closest('p');
    block.prepend(pic);
    if (wrapper && !wrapper.textContent.trim()) wrapper.remove();
    const img = pic.querySelector('img');
    if (img) img.loading = 'eager';
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const textRow = block.querySelector(':scope > div:last-child > div');
  if (!textRow) return;
  [...textRow.children].forEach((child, i) => {
    child.style.animationDelay = `${i * 150}ms`;
  });
  requestAnimationFrame(() => block.classList.add('hero-animate'));
}
