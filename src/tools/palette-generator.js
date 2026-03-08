import { copyToClipboard, hexToRgb, rgbToHex, rgbToHsl, hslToRgb, getTextColor } from '../utils.js';

function randomPalette() {
  const baseHue = Math.random() * 360;
  const modes = [
    () => Array.from({ length: 5 }, (_, i) => (baseHue + i * 72) % 360),
    () => Array.from({ length: 5 }, (_, i) => (baseHue + i * 30) % 360),
    () => [baseHue, (baseHue + 180) % 360, (baseHue + 30) % 360, (baseHue + 210) % 360, (baseHue + 60) % 360],
    () => Array.from({ length: 5 }, () => Math.random() * 360),
    () => Array.from({ length: 5 }, (_, i) => (baseHue + (i - 2) * 15) % 360),
  ];
  const hues = modes[Math.floor(Math.random() * modes.length)]();
  return hues.map(h => {
    const s = 50 + Math.random() * 40;
    const l = 35 + Math.random() * 35;
    const { r, g, b } = hslToRgb(h, s, l);
    return rgbToHex(r, g, b);
  });
}

export function render(container) {
  let palette = randomPalette();

  container.innerHTML = `
    <div class="tool-section">
      <div class="tool-section-title">Generated Palette</div>
      <div id="palette-display"></div>
      <div style="display:flex;gap:8px;margin-top:16px;">
        <button class="btn btn-primary" id="palette-gen">🎲 Generate New</button>
        <button class="btn btn-secondary" id="palette-copy">Copy CSS</button>
      </div>
    </div>
    <div class="tool-section">
      <div class="tool-section-title">Palette Colors</div>
      <div id="palette-details" class="grid-5" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:12px;"></div>
    </div>
  `;

  function renderPalette() {
    const display = document.getElementById('palette-display');
    display.innerHTML = `<div class="palette-bar">${palette.map(c => {
      const tc = getTextColor(c);
      return `<div class="palette-bar-color" style="background:${c};color:${tc}" data-color="${c}" title="Click to copy"><span>${c}</span></div>`;
    }).join('')}</div>`;

    display.querySelectorAll('.palette-bar-color').forEach(el => {
      el.addEventListener('click', () => copyToClipboard(el.dataset.color));
    });

    const details = document.getElementById('palette-details');
    details.innerHTML = palette.map(c => {
      const rgb = hexToRgb(c);
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      return `<div class="result-card" style="cursor:pointer" data-color="${c}">
        <div style="width:100%;height:60px;background:${c};border-radius:8px;margin-bottom:8px;"></div>
        <div style="font-family:var(--font-mono);font-size:13px;font-weight:600;">${c.toUpperCase()}</div>
        <div style="font-size:11px;color:var(--text-tertiary);">rgb(${rgb.r}, ${rgb.g}, ${rgb.b})</div>
        <div style="font-size:11px;color:var(--text-tertiary);">hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)</div>
      </div>`;
    }).join('');

    details.querySelectorAll('.result-card').forEach(el => {
      el.addEventListener('click', () => copyToClipboard(el.dataset.color));
    });
  }

  document.getElementById('palette-gen').addEventListener('click', () => {
    palette = randomPalette();
    renderPalette();
  });

  document.getElementById('palette-copy').addEventListener('click', () => {
    const css = palette.map((c, i) => `  --color-${i + 1}: ${c};`).join('\n');
    copyToClipboard(`:root {\n${css}\n}`);
  });

  renderPalette();
}
