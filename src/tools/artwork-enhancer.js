import { createFileDropZone, downloadBlob } from '../utils.js';

export function render(container) {
  let img = null;
  container.innerHTML = `
    <div class="tool-section">
      <div class="tool-section-title">Upload Artwork</div>
      <div id="ae-drop"></div>
    </div>
    <div class="tool-section" id="ae-settings" style="display:none;">
      <div class="tool-section-title">Noise Settings</div>
      <div class="controls-grid">
        <div class="input-group">
          <label>Intensity: <span id="ae-int-val">30</span>%</label>
          <input type="range" id="ae-intensity" min="5" max="80" value="30" />
        </div>
        <div class="input-group">
          <label>Blend Mode</label>
          <select id="ae-blend">
            <option value="overlay">Overlay</option>
            <option value="soft-light">Soft Light</option>
            <option value="multiply">Multiply</option>
            <option value="screen">Screen</option>
          </select>
        </div>
        <div class="input-group">
          <label>Grain Size</label>
          <select id="ae-grain">
            <option value="1">Fine</option>
            <option value="2" selected>Medium</option>
            <option value="3">Coarse</option>
          </select>
        </div>
        <div class="input-group">
          <label>Color Tint</label>
          <input type="color" id="ae-tint" value="#8b5cf6" />
        </div>
      </div>
      <button class="btn btn-primary" id="ae-apply" style="margin-top:16px">Apply</button>
    </div>
    <div class="tool-section" id="ae-result" style="display:none;">
      <div class="tool-section-title">Result</div>
      <div class="preview-area"><canvas id="ae-canvas"></canvas></div>
      <button class="btn btn-primary" id="ae-download" style="margin-top:16px">Download</button>
    </div>
  `;

  const intSlider = document.getElementById('ae-intensity');
  const intVal = document.getElementById('ae-int-val');
  intSlider.addEventListener('input', () => intVal.textContent = intSlider.value);

  createFileDropZone(document.getElementById('ae-drop'), {
    accept: 'image/*', icon: '✨',
    text: 'Drop an artwork or <strong>click to browse</strong>',
    onFile: file => {
      const r = new FileReader();
      r.onload = e => {
        img = new Image();
        img.onload = () => document.getElementById('ae-settings').style.display = 'block';
        img.src = e.target.result;
      };
      r.readAsDataURL(file);
    }
  });

  document.getElementById('ae-apply').addEventListener('click', () => {
    if (!img) return;
    const canvas = document.getElementById('ae-canvas');
    canvas.width = img.width; canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    const intensity = parseInt(intSlider.value) / 100;
    const grain = parseInt(document.getElementById('ae-grain').value);
    const tint = document.getElementById('ae-tint').value;
    const tr = parseInt(tint.slice(1, 3), 16);
    const tg = parseInt(tint.slice(3, 5), 16);
    const tb = parseInt(tint.slice(5, 7), 16);
    const blend = document.getElementById('ae-blend').value;

    // Apply noise
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const d = imageData.data;
    for (let i = 0; i < d.length; i += 4 * grain) {
      const noise = (Math.random() - 0.5) * 2 * intensity * 255;
      for (let g = 0; g < grain && i + g * 4 < d.length; g++) {
        const idx = i + g * 4;
        d[idx] = Math.max(0, Math.min(255, d[idx] + noise * (tr / 255)));
        d[idx + 1] = Math.max(0, Math.min(255, d[idx + 1] + noise * (tg / 255)));
        d[idx + 2] = Math.max(0, Math.min(255, d[idx + 2] + noise * (tb / 255)));
      }
    }
    ctx.putImageData(imageData, 0, 0);
    document.getElementById('ae-result').style.display = 'block';
  });

  document.getElementById('ae-download').addEventListener('click', () => {
    document.getElementById('ae-canvas').toBlob(b => downloadBlob(b, 'enhanced.png'), 'image/png');
  });
}
