import { showToast, copyToClipboard, downloadBlob, createFileDropZone } from '../utils.js';

export function render(container) {
  container.innerHTML = `
    <div class="tool-section">
      <div class="tool-section-title">Upload Logo</div>
      <div id="bg-logo-drop"></div>
    </div>
    <div class="tool-section">
      <div class="tool-section-title">Banner Settings</div>
      <div class="controls-grid">
        <div class="input-group">
          <label>Preset</label>
          <select id="bg-preset">
            <option value="twitter">Twitter / X Banner (1500×500)</option>
            <option value="youtube">YouTube Banner (2560×1440)</option>
            <option value="facebook">Facebook Cover (820×312)</option>
            <option value="linkedin">LinkedIn Cover (1584×396)</option>
            <option value="og">Open Graph (1200×630)</option>
            <option value="instagram">Instagram Post (1080×1080)</option>
            <option value="custom">Custom Size</option>
          </select>
        </div>
        <div class="input-group" id="bg-custom-size" style="display:none;">
          <label>Custom (W × H)</label>
          <div style="display:flex;gap:8px;align-items:center;">
            <input type="number" id="bg-cw" value="1500" min="100" max="4096" style="max-width:100px;" />
            <span>×</span>
            <input type="number" id="bg-ch" value="500" min="100" max="4096" style="max-width:100px;" />
          </div>
        </div>
        <div class="input-group">
          <label>Background Color</label>
          <div style="display:flex;gap:8px;align-items:center;">
            <input type="color" id="bg-color" value="#1c1917" />
            <input type="text" id="bg-color-hex" value="#1c1917" style="max-width:100px;" />
          </div>
        </div>
        <div class="input-group">
          <label>Background Style</label>
          <select id="bg-style">
            <option value="solid">Solid Color</option>
            <option value="gradient-h">Gradient (Horizontal)</option>
            <option value="gradient-v">Gradient (Vertical)</option>
            <option value="gradient-r">Gradient (Radial)</option>
          </select>
        </div>
        <div class="input-group">
          <label>Second Color (Gradient)</label>
          <div style="display:flex;gap:8px;align-items:center;">
            <input type="color" id="bg-color2" value="#b45309" />
            <input type="text" id="bg-color2-hex" value="#b45309" style="max-width:100px;" />
          </div>
        </div>
        <div class="input-group">
          <label>Logo Scale: <span id="bg-scale-val">40</span>%</label>
          <input type="range" id="bg-scale" min="10" max="90" value="40" />
        </div>
        <div class="input-group">
          <label>Logo Position</label>
          <select id="bg-position">
            <option value="center">Center</option>
            <option value="left">Left</option>
            <option value="right">Right</option>
          </select>
        </div>
        <div class="input-group">
          <label>Token Name (optional)</label>
          <input type="text" id="bg-text" value="" placeholder="e.g. MyToken" />
        </div>
        <div class="input-group">
          <label>Text Color</label>
          <input type="color" id="bg-text-color" value="#ffffff" />
        </div>
        <div class="input-group">
          <label>Text Size: <span id="bg-text-size-val">48</span>px</label>
          <input type="range" id="bg-text-size" min="16" max="120" value="48" />
        </div>
      </div>
    </div>
    <div class="tool-section">
      <div class="tool-section-title">Preview</div>
      <div class="preview-area" style="position:relative;overflow:auto;">
        <canvas id="bg-canvas" style="max-width:100%;border-radius:8px;"></canvas>
      </div>
      <div style="display:flex;gap:8px;margin-top:12px;">
        <button class="btn btn-primary" id="bg-download">Download PNG</button>
        <button class="btn btn-secondary" id="bg-download-jpg">Download JPG</button>
      </div>
    </div>
  `;

  let logoImg = null;
  const presets = {
    twitter: [1500, 500],
    youtube: [2560, 1440],
    facebook: [820, 312],
    linkedin: [1584, 396],
    og: [1200, 630],
    instagram: [1080, 1080],
  };

  const presetSel = document.getElementById('bg-preset');
  const colorInput = document.getElementById('bg-color');
  const colorHex = document.getElementById('bg-color-hex');
  const color2Input = document.getElementById('bg-color2');
  const color2Hex = document.getElementById('bg-color2-hex');
  const styleSel = document.getElementById('bg-style');
  const scaleSl = document.getElementById('bg-scale');
  const positionSel = document.getElementById('bg-position');
  const textInput = document.getElementById('bg-text');
  const textColor = document.getElementById('bg-text-color');
  const textSizeSl = document.getElementById('bg-text-size');
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');

  createFileDropZone(document.getElementById('bg-logo-drop'), {
    accept: 'image/*', icon: '◇',
    text: 'Drop your logo or <strong>click to upload</strong>',
    onFile: file => {
      const r = new FileReader();
      r.onload = e => {
        logoImg = new Image();
        logoImg.onload = () => renderBanner();
        logoImg.src = e.target.result;
      };
      r.readAsDataURL(file);
    }
  });

  function getSize() {
    const v = presetSel.value;
    if (v === 'custom') {
      return [parseInt(document.getElementById('bg-cw').value) || 1500, parseInt(document.getElementById('bg-ch').value) || 500];
    }
    return presets[v] || [1500, 500];
  }

  function renderBanner() {
    const [w, h] = getSize();
    canvas.width = w;
    canvas.height = h;

    // Background
    const style = styleSel.value;
    if (style === 'solid') {
      ctx.fillStyle = colorInput.value;
      ctx.fillRect(0, 0, w, h);
    } else if (style === 'gradient-h') {
      const grad = ctx.createLinearGradient(0, 0, w, 0);
      grad.addColorStop(0, colorInput.value);
      grad.addColorStop(1, color2Input.value);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    } else if (style === 'gradient-v') {
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, colorInput.value);
      grad.addColorStop(1, color2Input.value);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    } else if (style === 'gradient-r') {
      const grad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) / 2);
      grad.addColorStop(0, colorInput.value);
      grad.addColorStop(1, color2Input.value);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    }

    // Logo
    if (logoImg) {
      const scale = parseInt(scaleSl.value) / 100;
      const logoH = h * scale;
      const logoW = (logoImg.width / logoImg.height) * logoH;
      let x;
      const pos = positionSel.value;
      if (pos === 'center') {
        x = (w - logoW) / 2;
      } else if (pos === 'left') {
        x = w * 0.05;
      } else {
        x = w - logoW - w * 0.05;
      }

      const textVal = textInput.value.trim();
      if (textVal && pos === 'center') {
        // If centered with text, move logo up slightly
        const y = (h - logoH) / 2 - h * 0.05;
        ctx.drawImage(logoImg, x, Math.max(y, h * 0.02), logoW, logoH);
      } else {
        const y = (h - logoH) / 2;
        ctx.drawImage(logoImg, x, y, logoW, logoH);
      }
    }

    // Text
    const textVal = textInput.value.trim();
    if (textVal) {
      const fontSize = parseInt(textSizeSl.value) || 48;
      ctx.font = `700 ${fontSize}px "JetBrains Mono", monospace`;
      ctx.fillStyle = textColor.value;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      if (logoImg && positionSel.value === 'center') {
        const logoScale = parseInt(scaleSl.value) / 100;
        const logoH = h * logoScale;
        ctx.fillText(textVal, w / 2, h / 2 + logoH / 2 + fontSize * 0.6);
      } else if (logoImg && positionSel.value === 'left') {
        const logoScale = parseInt(scaleSl.value) / 100;
        const logoH = h * logoScale;
        const logoW = (logoImg.width / logoImg.height) * logoH;
        ctx.textAlign = 'left';
        ctx.fillText(textVal, w * 0.05 + logoW + w * 0.03, h / 2);
      } else if (logoImg && positionSel.value === 'right') {
        const logoScale = parseInt(scaleSl.value) / 100;
        const logoH = h * logoScale;
        const logoW = (logoImg.width / logoImg.height) * logoH;
        ctx.textAlign = 'right';
        ctx.fillText(textVal, w - w * 0.05 - logoW - w * 0.03, h / 2);
      } else {
        ctx.fillText(textVal, w / 2, h / 2);
      }
    }
  }

  // Event listeners
  presetSel.addEventListener('change', () => {
    document.getElementById('bg-custom-size').style.display = presetSel.value === 'custom' ? '' : 'none';
    renderBanner();
  });
  colorInput.addEventListener('input', () => { colorHex.value = colorInput.value; renderBanner(); });
  colorHex.addEventListener('input', () => { colorInput.value = colorHex.value; renderBanner(); });
  color2Input.addEventListener('input', () => { color2Hex.value = color2Input.value; renderBanner(); });
  color2Hex.addEventListener('input', () => { color2Input.value = color2Hex.value; renderBanner(); });
  styleSel.addEventListener('change', renderBanner);
  scaleSl.addEventListener('input', () => { document.getElementById('bg-scale-val').textContent = scaleSl.value; renderBanner(); });
  positionSel.addEventListener('change', renderBanner);
  textInput.addEventListener('input', renderBanner);
  textColor.addEventListener('input', renderBanner);
  textSizeSl.addEventListener('input', () => { document.getElementById('bg-text-size-val').textContent = textSizeSl.value; renderBanner(); });
  document.getElementById('bg-cw').addEventListener('input', renderBanner);
  document.getElementById('bg-ch').addEventListener('input', renderBanner);

  document.getElementById('bg-download').addEventListener('click', () => {
    canvas.toBlob(b => downloadBlob(b, 'banner.png'), 'image/png');
  });
  document.getElementById('bg-download-jpg').addEventListener('click', () => {
    canvas.toBlob(b => downloadBlob(b, 'banner.jpg'), 'image/jpeg', 0.92);
  });

  renderBanner();
}
