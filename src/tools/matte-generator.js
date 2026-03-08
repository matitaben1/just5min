import { createFileDropZone, downloadBlob } from '../utils.js';

export function render(container) {
  let img = null;
  container.innerHTML = `
    <div class="tool-section">
      <div class="tool-section-title">Upload Image</div>
      <div id="mg-drop"></div>
    </div>
    <div class="tool-section" id="mg-settings" style="display:none;">
      <div class="tool-section-title">Matte Settings</div>
      <div class="controls-grid">
        <div class="input-group">
          <label>Size</label>
          <input type="number" id="mg-size" value="1080" min="200" max="4000" />
        </div>
        <div class="input-group">
          <label>Background</label>
          <select id="mg-bg-type">
            <option value="color">Solid Color</option>
            <option value="blur">Blurred Image</option>
          </select>
        </div>
        <div class="input-group">
          <label>Color</label>
          <input type="color" id="mg-color" value="#0a0a0f" />
        </div>
        <div class="input-group">
          <label>Padding: <span id="mg-pad-val">10</span>%</label>
          <input type="range" id="mg-padding" min="0" max="30" value="10" />
        </div>
      </div>
      <button class="btn btn-primary" id="mg-generate" style="margin-top:16px">Generate</button>
    </div>
    <div class="tool-section" id="mg-result" style="display:none;">
      <div class="tool-section-title">Result</div>
      <div class="preview-area"><canvas id="mg-canvas"></canvas></div>
      <button class="btn btn-primary" id="mg-download" style="margin-top:16px">Download</button>
    </div>
  `;

  const padSlider = document.getElementById('mg-padding');
  const padVal = document.getElementById('mg-pad-val');
  padSlider.addEventListener('input', () => padVal.textContent = padSlider.value);

  createFileDropZone(document.getElementById('mg-drop'), {
    accept: 'image/*', icon: '🖼️',
    text: 'Drop an image or <strong>click to browse</strong>',
    onFile: (file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        img = new Image();
        img.onload = () => document.getElementById('mg-settings').style.display = 'block';
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

  document.getElementById('mg-generate').addEventListener('click', () => {
    if (!img) return;
    const size = parseInt(document.getElementById('mg-size').value);
    const bgType = document.getElementById('mg-bg-type').value;
    const color = document.getElementById('mg-color').value;
    const padding = parseInt(padSlider.value) / 100;
    const canvas = document.getElementById('mg-canvas');
    canvas.width = size; canvas.height = size;
    const ctx = canvas.getContext('2d');

    if (bgType === 'blur') {
      const scale = Math.max(size / img.width, size / img.height);
      const sw = size / scale, sh = size / scale;
      ctx.filter = 'blur(30px) brightness(0.7)';
      ctx.drawImage(img, (img.width - sw)/2, (img.height - sh)/2, sw, sh, -20, -20, size+40, size+40);
      ctx.filter = 'none';
    } else {
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, size, size);
    }

    const pad = size * padding;
    const avail = size - pad * 2;
    const scale = Math.min(avail / img.width, avail / img.height);
    const w = img.width * scale, h = img.height * scale;
    ctx.drawImage(img, (size - w)/2, (size - h)/2, w, h);

    document.getElementById('mg-result').style.display = 'block';
  });

  document.getElementById('mg-download').addEventListener('click', () => {
    document.getElementById('mg-canvas').toBlob(b => downloadBlob(b, 'matte.png'), 'image/png');
  });
}
