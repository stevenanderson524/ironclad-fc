export default function decorate(block) {
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const title = cells[0]?.textContent.trim() || '';
    const desc = cells[1]?.textContent.trim() || '';
    const good = cells[2]?.textContent.trim() || '';
    const bad = cells[3]?.textContent.trim() || '';

    const rule = document.createElement('div');
    rule.className = 'voice-principles-rule';

    const accent = document.createElement('div');
    accent.className = 'voice-principles-accent';
    accent.setAttribute('aria-hidden', 'true');

    const h3 = document.createElement('h3');
    h3.textContent = title;

    const descP = document.createElement('p');
    descP.textContent = desc;

    rule.append(accent, h3, descP);

    const goodDiv = document.createElement('div');
    goodDiv.className = 'voice-principles-good';

    const goodLabel = document.createElement('span');
    goodLabel.className = 'ic-eyebrow';
    goodLabel.textContent = '✓ IRONCLAD';

    const goodP = document.createElement('p');
    goodP.textContent = good;

    goodDiv.append(goodLabel, goodP);

    const badDiv = document.createElement('div');
    badDiv.className = 'voice-principles-bad';

    const badLabel = document.createElement('span');
    badLabel.className = 'ic-eyebrow';
    badLabel.textContent = '✗ NOT IRONCLAD';

    const badP = document.createElement('p');
    badP.textContent = bad;

    badDiv.append(badLabel, badP);

    row.className = 'voice-principles-row';
    row.replaceChildren(rule, goodDiv, badDiv);
  });
}
