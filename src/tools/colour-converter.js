import { copyToClipboard, hexToRgb, rgbToHex, rgbToHsl, hslToRgb } from '../utils.js';

export function render(container) {
  container.innerHTML = `
    <div class="tool-section">
      <div class="tool-section-title">Input Color</div>
      <div class="controls-grid">
        <div class="input-group">
          <label>HEX</label>
          <div style="display:flex;gap:8px;align-items:center">
            <input type="color" id="cc-picker" value="#8b5cf6" />
            <input type="text" id="cc-hex" value="#8b5cf6" style="flex:1" />
          </div>
        </div>
        <div class="input-group">
          <label>RGB</label>
          <input type="text" id="cc-rgb" readonly />
        </div>
        <div class="input-group">
          <label>HSL</label>
          <input type="text" id="cc-hsl" readonly />
        </div>
        <div class="input-group">
          <label>OKLCH (approx)</label>
          <input type="text" id="cc-oklch" readonly />
        </div>
      </div>
    </div>
    <div class="tool-section">
      <div class="tool-section-title">All Formats</div>
      <div id="cc-outputs" style="display:flex;flex-direction:column;gap:8px;"></div>
    </div>
  `;

  const picker = document.getElementById('cc-picker');
  const hexInput = document.getElementById('cc-hex');
  const rgbInput = document.getElementById('cc-rgb');
  const hslInput = document.getElementById('cc-hsl');
  const oklchInput = document.getElementById('cc-oklch');
  const outputsDiv = document.getElementById('cc-outputs');

  function update(hex) {
    hex = hex.startsWith('#') ? hex : '#' + hex;
    if (!/^#[0-9a-fA-F]{6}$/.test(hex)) return;
    picker.value = hex;
    hexInput.value = hex;
    const { r, g, b } = hexToRgb(hex);
    const hsl = rgbToHsl(r, g, b);
    const rgbStr = `rgb(${r}, ${g}, ${b})`;
    const hslStr = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;

    // Approximate OKLCH
    const lr = r / 255, lg = g / 255, lb = b / 255;
    const ll = 0.2126 * lr + 0.7152 * lg + 0.0722 * lb;
    const L = Math.round(Math.cbrt(ll) * 100) / 100;
    const C = Math.round(Math.sqrt(hsl.s / 100 * (1 - Math.abs(2 * hsl.l / 100 - 1))) * 0.4 * 100) / 100;
    const oklchStr = `oklch(${L} ${C} ${hsl.h})`;

    rgbInput.value = rgbStr;
    hslInput.value = hslStr;
    oklchInput.value = oklchStr;

    const formats = [
      { label: 'HEX', value: hex.toUpperCase() },
      { label: 'RGB', value: rgbStr },
      { label: 'RGB %', value: `rgb(${Math.round(r/2.55)}%, ${Math.round(g/2.55)}%, ${Math.round(b/2.55)}%)` },
      { label: 'HSL', value: hslStr },
      { label: 'OKLCH', value: oklchStr },
      { label: 'CSS Named', value: hex },
      { label: 'Integer', value: (r << 16 | g << 8 | b).toString() },
    ];

    outputsDiv.innerHTML = formats.map(f => `
      <div class="output-area" style="display:flex;align-items:center;justify-content:space-between;">
        <div><span style="color:var(--text-tertiary);margin-right:12px;">${f.label}</span><span style="font-family:var(--font-mono)">${f.value}</span></div>
        <button class="copy-btn" data-val="${f.value}">Copy</button>
      </div>
    `).join('');

    outputsDiv.querySelectorAll('.copy-btn').forEach(btn => {
      btn.addEventListener('click', () => copyToClipboard(btn.dataset.val));
    });
  }

  picker.addEventListener('input', () => update(picker.value));
  hexInput.addEventListener('input', () => update(hexInput.value));
  update('#8b5cf6');
}
