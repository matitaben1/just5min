import { copyToClipboard, hexToRgb, rgbToHex, rgbToHsl, hslToRgb, getTextColor } from '../utils.js';

function generateShades(hex) {
  const { r, g, b } = hexToRgb(hex);
  const { h, s } = rgbToHsl(r, g, b);
  const steps = [
    { name: '50', l: 97 }, { name: '100', l: 93 }, { name: '200', l: 86 },
    { name: '300', l: 74 }, { name: '400', l: 62 }, { name: '500', l: 50 },
    { name: '600', l: 42 }, { name: '700', l: 34 }, { name: '800', l: 26 },
    { name: '900', l: 18 }, { name: '950', l: 10 },
  ];
  return steps.map(step => {
    const rgb = hslToRgb(h, s, step.l);
    return { name: step.name, hex: rgbToHex(rgb.r, rgb.g, rgb.b) };
  });
}

export function render(container) {
  container.innerHTML = `
    <div class="tool-section">
      <div class="tool-section-title">Base Color</div>
      <div style="display:flex;gap:12px;align-items:center;margin-bottom:16px;">
        <input type="color" id="tw-color" value="#8b5cf6" />
        <input type="text" id="tw-hex" value="#8b5cf6" style="max-width:140px" />
        <input type="text" id="tw-name" value="brand" placeholder="Color name" style="max-width:160px" />
      </div>
    </div>
    <div class="tool-section">
      <div class="tool-section-title">Shade Scale</div>
      <div id="tw-scale"></div>
    </div>
    <div class="tool-section">
      <div class="tool-section-title">Tailwind Config</div>
      <div id="tw-config" class="output-area" style="position:relative;"></div>
      <button class="btn btn-secondary" id="tw-copy" style="margin-top:12px;">Copy Config</button>
    </div>
  `;

  const colorInput = document.getElementById('tw-color');
  const hexInput = document.getElementById('tw-hex');
  const nameInput = document.getElementById('tw-name');

  function update() {
    const hex = colorInput.value;
    hexInput.value = hex;
    const name = nameInput.value || 'brand';
    const shades = generateShades(hex);

    document.getElementById('tw-scale').innerHTML = `
      <div class="shade-scale">${shades.map(s => {
        const tc = getTextColor(s.hex);
        return `<div class="shade-step" style="background:${s.hex};color:${tc}" data-hex="${s.hex}" title="Click to copy">
          <span>${s.name}</span>
          <span>${s.hex}</span>
        </div>`;
      }).join('')}</div>
    `;

    document.querySelectorAll('.shade-step').forEach(el => {
      el.addEventListener('click', () => copyToClipboard(el.dataset.hex));
    });

    const configStr = `'${name}': {\n${shades.map(s => `  '${s.name}': '${s.hex}',`).join('\n')}\n}`;
    document.getElementById('tw-config').textContent = configStr;

    document.getElementById('tw-copy').onclick = () => copyToClipboard(configStr);
  }

  colorInput.addEventListener('input', () => { hexInput.value = colorInput.value; update(); });
  hexInput.addEventListener('input', () => { colorInput.value = hexInput.value; update(); });
  nameInput.addEventListener('input', update);
  update();
}
