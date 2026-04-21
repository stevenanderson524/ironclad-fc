/**
 * Loads and decorates the section-nav block.
 * Expects DA table rows: Label | Anchor (e.g. "#logo")
 * Assigns matching IDs to sections by matching h2 text, then builds a sticky nav.
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const rows = [...block.children];
  const links = rows.map((row) => {
    const [labelCell, anchorCell] = [...row.children];
    return {
      label: labelCell?.textContent.trim() || '',
      anchor: (anchorCell?.textContent.trim() || '').replace(/^#/, ''),
    };
  }).filter(({ label, anchor }) => label && anchor);

  // Assign IDs to sections by matching their h2 text
  const main = document.querySelector('main');
  links.forEach(({ label, anchor }) => {
    const h2 = [...(main?.querySelectorAll('h2') || [])].find(
      (el) => el.textContent.trim().toLowerCase() === label.toLowerCase(),
    );
    if (h2) h2.closest('.section')?.setAttribute('id', anchor);
  });

  // Build nav
  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'Page sections');
  const ul = document.createElement('ul');

  links.forEach(({ label, anchor }) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = `#${anchor}`;
    a.textContent = label;
    a.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' });
    });
    li.append(a);
    ul.append(li);
  });

  nav.append(ul);
  block.replaceChildren(nav);

  // Active link tracking
  const sections = links
    .map(({ anchor }) => document.getElementById(anchor))
    .filter(Boolean);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const { id } = entry.target;
      ul.querySelectorAll('a').forEach((a) => {
        a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
      });
    });
  }, {
    threshold: 0.3,
    rootMargin: `-${getComputedStyle(document.documentElement).getPropertyValue('--nav-height').trim() || '64px'} 0px 0px 0px`,
  });

  sections.forEach((section) => observer.observe(section));
}
