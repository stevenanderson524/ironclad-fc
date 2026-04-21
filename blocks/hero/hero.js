/**
 * loads and decorates the hero block
 * @param {Element} block The block element
 */
export default function decorate(block) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const textRow = block.querySelector(':scope > div:last-child > div');
  if (!textRow) return;
  [...textRow.children].forEach((child, i) => {
    child.style.animationDelay = `${i * 150}ms`;
  });
  requestAnimationFrame(() => block.classList.add('hero-animate'));
}
