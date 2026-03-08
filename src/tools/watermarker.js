import { createFileDropZone, downloadBlob } from '../utils.js';

export function render(container) {
  let img = null;
  container.innerHTML = `
    <div class="tool-section">
      <div class="tool-section-title">Upload Image</div>
      <div id="wm-drop"></div>
    </div>
    <div class="tool-section" id="wm-settings" style="display:none;">
      <div class="tool-section-title">Watermark Settings</div>
      <div class="controls-grid">
        <div class="input-group">
          <label>Text</label>
          <input type="text" id="wm-text" value="© My Brand" />
        </div>
        <div class="input-group">
          <label>Font Size</label>
          <input type="number" id="wm-fontsize" value="32" min="10" max="200" />
        </div>
        <div class="input-group">
          <label>Color</label>
          <input type="color" id="wm-color" value="#ffffff" />
        </div>
        <div class="input-group">
          <label>Opacity: <span id="wm-op-val">50</span>%</label>
          <input type="range" id="wm-opacity" min="5" max="100" value="50" />
        </div>
        <div class="input-group">
          <label>Position</label>
          <select id="wm-pos">
            <option value="center">Center</option>
            <option value="bottom-right" selected>Bottom Right</option>
            <option value="bottom-left">Bottom Left</option>
            <option value="top-right">Top Right</option>
            <option value="top-left">Top Left</option>
            <option value="tile">Tiled</option>
          </select>
        </div>
      </div>
      <button class="btn btn-primary" id="wm-apply" style="margin-top:16px">Apply Watermark</button>
    </div>
    <div class="tool-section" id="wm-result" style="display:none;">
      <div class="tool-section-title">Result</div>
      <div class="preview-area"><canvas id="wm-canvas"></canvas></div>
      <button class="btn btn-primary" id="wm-download" style="margin-top:16px">Download</button>
    </div>
  `;

  const opSlider = document.getElementById('wm-opacity');
  const opVal = document.getElementById('wm-op-val');
  opSlider.addEventListener('input', () => opVal.textContent = opSlider.value);

  createFileDropZone(document.getElementById('wm-drop'), {
    accept: 'image/*', icon: '💧',
    text: 'Drop an image or <strong>click to browse</strong>',
    onFile: file => {
      const r = new FileReader();
      r.onload = e => {
        img = new Image();
        img.onload = () => document.getElementById('wm-settings').style.display = 'block';
        img.src = e.target.result;
      };
      r.readAsDataURL(file);
    }
  });

  document.getElementById('wm-apply').addEventListener('click', () => {
    if (!img) return;
    const canvas = document.getElementById('wm-canvas');
    canvas.width = img.width; canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    const text = document.getElementById('wm-text').value;
    const fontSize = parseInt(document.getElementById('wm-fontsize').value);
    const color = document.getElementById('wm-color').value;
    const opacity = parseInt(opSlider.value) / 100;
    const pos = document.getElementById('wm-pos').value;

    ctx.globalAlpha = opacity;
    ctx.font = `${fontSize}px Inter, sans-serif`;
    ctx.fillStyle = color;
    ctx.textBaseline = 'middle';

    const pad = fontSize;

    if (pos === 'tile') {
      ctx.textAlign = 'center';
      for (let y = pad; y < img.height; y += fontSize * 4) {
        for (let x = pad; x < img.width; x += ctx.measureText(text).width + fontSize * 2) {
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(-Math.PI / 6);
          ctx.fillText(text, 0, 0);
          ctx.restore();
        }
      }
    } else {
      const positions = {
        'center': () => { ctx.textAlign = 'center'; ctx.fillText(text, img.width/2, img.height/2); },
        'bottom-right': () => { ctx.textAlign = 'right'; ctx.fillText(text, img.width - pad, img.height - pad); },
        'bottom-left': () => { ctx.textAlign = 'left'; ctx.fillText(text, pad, img.height - pad); },
        'top-right': () => { ctx.textAlign = 'right'; ctx.fillText(text, img.width - pad, pad + fontSize); },
        'top-left': () => { ctx.textAlign = 'left'; ctx.fillText(text, pad, pad + fontSize); },
      };
      positions[pos]();
    }

    ctx.globalAlpha = 1;
    document.getElementById('wm-result').style.display = 'block';
  });

  document.getElementById('wm-download').addEventListener('click', () => {
    document.getElementById('wm-canvas').toBlob(b => downloadBlob(b, 'watermarked.png'), 'image/png');
  });
}
