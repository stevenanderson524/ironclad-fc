export default function decorate(block) {
  const text = block.querySelector('p')?.textContent.trim() || '';
  const items = text.split(', ').map((s) => s.trim()).filter(Boolean);
  const doubled = [...items, ...items];

  const track = document.createElement('div');
  track.className = 'marquee-track';
  track.setAttribute('aria-hidden', 'true');
  track.innerHTML = doubled.map((item) => `
    <span class="marquee-item">${item}<span class="marquee-dot"></span></span>
  `).join('');

  block.replaceChildren(track);
}
