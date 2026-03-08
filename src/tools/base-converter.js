import { copyToClipboard } from '../utils.js';

const BASES = [
  { name: 'Decimal', base: 10, prefix: '' },
  { name: 'Hexadecimal', base: 16, prefix: '0x' },
  { name: 'Binary', base: 2, prefix: '0b' },
  { name: 'Octal', base: 8, prefix: '0o' },
];

export function render(container) {
  container.innerHTML = `
    <div class="tool-section">
      <div class="tool-section-title">Input</div>
      <div class="controls-grid">
        <div class="input-group">
          <label>Value</label>
          <input type="text" id="bc-val" value="255" />
        </div>
        <div class="input-group">
          <label>Input Base</label>
          <select id="bc-base">
            ${BASES.map(b => `<option value="${b.base}">${b.name} (base ${b.base})</option>`).join('')}
          </select>
        </div>
      </div>
    </div>
    <div class="tool-section">
      <div class="tool-section-title">Conversions</div>
      <div id="bc-results" style="display:flex;flex-direction:column;gap:8px;"></div>
    </div>
    <div class="tool-section">
      <div class="tool-section-title">Bit Visualization</div>
      <div id="bc-bits" style="display:flex;flex-wrap:wrap;gap:2px;font-family:var(--font-mono);"></div>
    </div>
  `;

  function update() {
    const val = document.getElementById('bc-val').value.trim();
    const fromBase = parseInt(document.getElementById('bc-base').value);
    const num = parseInt(val, fromBase);

    if (isNaN(num)) {
      document.getElementById('bc-results').innerHTML = '<div style="color:var(--error);font-size:13px;">Invalid input for selected base</div>';
      return;
    }

    document.getElementById('bc-results').innerHTML = BASES.map(b => {
      const converted = num.toString(b.base).toUpperCase();
      return `<div class="output-area" style="display:flex;justify-content:space-between;align-items:center;">
        <div><span style="color:var(--text-tertiary);font-size:12px;min-width:100px;display:inline-block;">${b.name}</span>
        <span style="font-family:var(--font-mono);font-weight:600;">${b.prefix}${converted}</span></div>
        <button class="copy-btn" data-val="${b.prefix}${converted}">Copy</button>
      </div>`;
    }).join('');

    document.querySelectorAll('#bc-results .copy-btn').forEach(btn => {
      btn.addEventListener('click', () => copyToClipboard(btn.dataset.val));
    });

    // Bit visualization
    const bits = (num >>> 0).toString(2).padStart(Math.max(8, Math.ceil(num.toString(2).length / 8) * 8), '0');
    document.getElementById('bc-bits').innerHTML = bits.split('').map((b, i) =>
      `<span style="display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;background:${b === '1' ? 'var(--accent-glow)' : 'var(--bg-glass)'};border:1px solid var(--border-primary);border-radius:4px;font-size:12px;${b === '1' ? 'color:var(--accent-primary);font-weight:600;' : 'color:var(--text-tertiary);'}${i > 0 && i % 8 === 0 ? 'margin-left:8px;' : ''}">${b}</span>`
    ).join('');
  }

  document.getElementById('bc-val').addEventListener('input', update);
  document.getElementById('bc-base').addEventListener('change', update);
  update();
}
