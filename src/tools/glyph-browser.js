import { copyToClipboard, showToast } from '../utils.js';

const BLOCKS = [
  { name: 'Arrows', start: 0x2190, end: 0x21FF },
  { name: 'Math Operators', start: 0x2200, end: 0x22FF },
  { name: 'Box Drawing', start: 0x2500, end: 0x257F },
  { name: 'Block Elements', start: 0x2580, end: 0x259F },
  { name: 'Geometric Shapes', start: 0x25A0, end: 0x25FF },
  { name: 'Misc Symbols', start: 0x2600, end: 0x26FF },
  { name: 'Dingbats', start: 0x2700, end: 0x27BF },
  { name: 'Emoji (Misc)', start: 0x2600, end: 0x26FF },
  { name: 'Currency', start: 0x20A0, end: 0x20CF },
  { name: 'Latin Extended', start: 0x0100, end: 0x024F },
  { name: 'Greek', start: 0x0370, end: 0x03FF },
  { name: 'Cyrillic', start: 0x0400, end: 0x04FF },
  { name: 'Braille', start: 0x2800, end: 0x28FF },
];

export function render(container) {
  container.innerHTML = `
    <div class="tool-section">
      <div class="tool-section-title">Unicode Block</div>
      <select id="gb-block" style="max-width:300px;">
        ${BLOCKS.map((b, i) => `<option value="${i}">${b.name} (U+${b.start.toString(16).toUpperCase()}–U+${b.end.toString(16).toUpperCase()})</option>`).join('')}
      </select>
    </div>
    <div class="tool-section">
      <div class="tool-section-title">Glyphs <span id="gb-info" style="font-weight:400;color:var(--text-tertiary);"></span></div>
      <div id="gb-grid" class="glyph-grid"></div>
    </div>
    <div class="tool-section">
      <div class="tool-section-title">Selected</div>
      <div id="gb-selected" style="display:flex;align-items:center;gap:16px;">
        <span id="gb-char" style="font-size:48px;">—</span>
        <div>
          <div id="gb-char-name" style="font-weight:600;"></div>
          <div id="gb-char-code" style="font-family:var(--font-mono);font-size:13px;color:var(--text-tertiary);"></div>
        </div>
      </div>
    </div>
  `;

  const blockSelect = document.getElementById('gb-block');
  const grid = document.getElementById('gb-grid');

  function loadBlock(idx) {
    const block = BLOCKS[idx];
    let html = '';
    let count = 0;
    for (let cp = block.start; cp <= block.end; cp++) {
      const char = String.fromCodePoint(cp);
      html += `<div class="glyph-cell" data-cp="${cp}" data-char="${char}" title="U+${cp.toString(16).toUpperCase().padStart(4, '0')}">${char}</div>`;
      count++;
    }
    grid.innerHTML = html;
    document.getElementById('gb-info').textContent = `(${count} glyphs)`;

    grid.querySelectorAll('.glyph-cell').forEach(cell => {
      cell.addEventListener('click', () => {
        const cp = parseInt(cell.dataset.cp);
        const char = String.fromCodePoint(cp);
        document.getElementById('gb-char').textContent = char;
        document.getElementById('gb-char-code').textContent = `U+${cp.toString(16).toUpperCase().padStart(4, '0')} — HTML: &#${cp}; — CSS: \\${cp.toString(16)}`;
        copyToClipboard(char);
      });
    });
  }

  blockSelect.addEventListener('change', () => loadBlock(parseInt(blockSelect.value)));
  loadBlock(0);
}
