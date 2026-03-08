import { copyToClipboard, hexToRgb, rgbToHex, rgbToHsl, hslToRgb, getTextColor } from '../utils.js';

const HARMONIES = {
  complementary: { name: 'Complementary', offsets: [0, 180] },
  analogous: { name: 'Analogous', offsets: [0, 30, 60] },
  triadic: { name: 'Triadic', offsets: [0, 120, 240] },
  'split-complementary': { name: 'Split Complementary', offsets: [0, 150, 210] },
  tetradic: { name: 'Tetradic', offsets: [0, 90, 180, 270] },
  square: { name: 'Square', offsets: [0, 90, 180, 270] },
};

export function render(container) {
  container.innerHTML = `
    <div class="tool-section">
      <div class="tool-section-title">Base Color</div>
      <div style="display:flex;gap:12px;align-items:center;">
        <input type="color" id="hm-color" value="#8b5cf6" />
        <input type="text" id="hm-hex" value="#8b5cf6" style="max-width:140px" />
        <select id="hm-type" style="max-width:220px">
          ${Object.entries(HARMONIES).map(([k, v]) => `<option value="${k}">${v.name}</option>`).join('')}
        </select>
      </div>
    </div>
    <div class="tool-section">
      <div class="tool-section-title">Harmony</div>
      <div id="hm-result"></div>
    </div>
  `;

  const picker = document.getElementById('hm-color');
  const hexInput = document.getElementById('hm-hex');
  const typeSelect = document.getElementById('hm-type');

  function update() {
    const hex = picker.value;
    hexInput.value = hex;
    const { r, g, b } = hexToRgb(hex);
    const { h, s, l } = rgbToHsl(r, g, b);
    const harmony = HARMONIES[typeSelect.value];
    const colors = harmony.offsets.map(offset => {
      const newH = (h + offset) % 360;
      const rgb = hslToRgb(newH, s, l);
      return rgbToHex(rgb.r, rgb.g, rgb.b);
    });

    document.getElementById('hm-result').innerHTML = `
      <div class="palette-bar" style="height:120px;margin-bottom:16px;">
        ${colors.map(c => {
          const tc = getTextColor(c);
          return `<div class="palette-bar-color" style="background:${c};color:${tc}" data-color="${c}" title="Click to copy"><span>${c.toUpperCase()}</span></div>`;
        }).join('')}
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:8px;">
        ${colors.map(c => {
          const rgb = hexToRgb(c);
          const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
          return `<div class="result-card" style="cursor:pointer" data-color="${c}">
            <div style="width:100%;height:40px;background:${c};border-radius:6px;margin-bottom:6px;"></div>
            <div style="font-family:var(--font-mono);font-size:12px;">${c.toUpperCase()}</div>
            <div style="font-size:10px;color:var(--text-tertiary)">hsl(${hsl.h},${hsl.s}%,${hsl.l}%)</div>
          </div>`;
        }).join('')}
      </div>
    `;

    document.getElementById('hm-result').querySelectorAll('[data-color]').forEach(el => {
      el.addEventListener('click', () => copyToClipboard(el.dataset.color));
    });
  }

  picker.addEventListener('input', () => { hexInput.value = picker.value; update(); });
  hexInput.addEventListener('input', () => { picker.value = hexInput.value; update(); });
  typeSelect.addEventListener('change', update);
  update();
}
