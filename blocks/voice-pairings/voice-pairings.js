export default function decorate(block) {
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const tag = cells[0]?.textContent.trim() || '';
    const good = cells[1]?.textContent.trim() || '';
    const bad = cells[2]?.textContent.trim() || '';

    const tagDiv = document.createElement('div');
    tagDiv.className = 'voice-pairings-tag';
    const tagLabel = document.createElement('span');
    tagLabel.className = 'ic-eyebrow';
    tagLabel.textContent = tag;
    tagDiv.appendChild(tagLabel);

    const goodDiv = document.createElement('div');
    goodDiv.className = 'voice-pairings-good';
    const goodLabel = document.createElement('span');
    goodLabel.className = 'ic-eyebrow';
    goodLabel.textContent = 'IRONCLAD';
    const goodP = document.createElement('p');
    goodP.textContent = good;
    goodDiv.append(goodLabel, goodP);

    const badDiv = document.createElement('div');
    badDiv.className = 'voice-pairings-bad';
    const badLabel = document.createElement('span');
    badLabel.className = 'ic-eyebrow';
    badLabel.textContent = 'AVOID';
    const badP = document.createElement('p');
    badP.textContent = `"${bad}"`;
    badDiv.append(badLabel, badP);

    row.className = 'voice-pairings-row';
    row.replaceChildren(tagDiv, goodDiv, badDiv);
  });
}
