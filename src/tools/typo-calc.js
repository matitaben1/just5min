import { copyToClipboard } from '../utils.js';

const UNITS = {
  px: { name: 'Pixels', factor: 1 },
  pt: { name: 'Points', factor: 1.333333 },
  em: { name: 'Em (base 16)', factor: 16 },
  rem: { name: 'Rem (base 16)', factor: 16 },
  cm: { name: 'Centimeters', factor: 37.795276 },
  mm: { name: 'Millimeters', factor: 3.7795276 },
  in: { name: 'Inches', factor: 96 },
  pc: { name: 'Picas', factor: 16 },
};

export function render(container) {
  container.innerHTML = `
    <div class="tool-section">
      <div class="tool-section-title">Input</div>
      <div class="controls-grid">
        <div class="input-group">
          <label>Value</label>
          <input type="number" id="tc-val" value="16" min="0" step="0.1" />
        </div>
        <div class="input-group">
          <label>From Unit</label>
          <select id="tc-from">${Object.entries(UNITS).map(([k, v]) => `<option value="${k}" ${k === 'px' ? 'selected' : ''}>${v.name} (${k})</option>`).join('')}</select>
        </div>
      </div>
    </div>
    <div class="tool-section">
      <div class="tool-section-title">Conversions</div>
      <div id="tc-results" class="controls-grid"></div>
    </div>
  `;

  function update() {
    const val = parseFloat(document.getElementById('tc-val').value);
    const from = document.getElementById('tc-from').value;
    const px = val * UNITS[from].factor;

    document.getElementById('tc-results').innerHTML = Object.entries(UNITS).map(([k, v]) => {
      const converted = (px / v.factor).toFixed(4).replace(/0+$/, '').replace(/\\.$/, '');
      return `<div class="output-area" style="display:flex;justify-content:space-between;align-items:center;">
        <div><span style="color:var(--text-tertiary);font-size:12px;">${v.name}</span><br/><span style="font-family:var(--font-mono);font-weight:600;">${converted} ${k}</span></div>
        <button class="copy-btn" data-val="${converted}${k}">Copy</button>
      </div>`;
    }).join('');

    document.querySelectorAll('#tc-results .copy-btn').forEach(btn => {
      btn.addEventListener('click', () => copyToClipboard(btn.dataset.val));
    });
  }

  document.getElementById('tc-val').addEventListener('input', update);
  document.getElementById('tc-from').addEventListener('change', update);
  update();
}
