import { createFileDropZone, downloadBlob } from '../utils.js';

export function render(container) {
  let img = null;
  container.innerHTML = `
    <div class="tool-section">
      <div class="tool-section-title">Upload Image</div>
      <div id="ic-drop"></div>
    </div>
    <div class="tool-section" id="ic-settings" style="display:none;">
      <div class="tool-section-title">Convert Settings</div>
      <div class="controls-grid">
        <div class="input-group">
          <label>Output Format</label>
          <select id="ic-format">
            <option value="image/png">PNG</option>
            <option value="image/jpeg">JPEG</option>
            <option value="image/webp">WebP</option>
            <option value="image/bmp">BMP</option>
          </select>
        </div>
        <div class="input-group">
          <label>Quality (JPEG/WebP): <span id="ic-q-val">92</span>%</label>
          <input type="range" id="ic-quality" min="10" max="100" value="92" />
        </div>
        <div class="input-group">
          <label>Resize Width (0=original)</label>
          <input type="number" id="ic-width" value="0" min="0" max="8000" />
        </div>
        <div class="input-group">
          <label>Resize Height (0=original)</label>
          <input type="number" id="ic-height" value="0" min="0" max="8000" />
        </div>
      </div>
      <button class="btn btn-primary" id="ic-convert" style="margin-top:16px">Convert & Download</button>
    </div>
    <div class="tool-section" id="ic-result" style="display:none;">
      <div class="tool-section-title">Preview</div>
      <div id="ic-info" style="font-size:13px;color:var(--text-secondary);margin-bottom:12px;"></div>
      <div class="preview-area"><canvas id="ic-canvas"></canvas></div>
    </div>
  `;

  const qSlider = document.getElementById('ic-quality');
  const qVal = document.getElementById('ic-q-val');
  qSlider.addEventListener('input', () => qVal.textContent = qSlider.value);

  createFileDropZone(document.getElementById('ic-drop'), {
    accept: 'image/*', icon: '🖼️',
    text: 'Drop an image or <strong>click to browse</strong>',
    onFile: file => {
      const r = new FileReader();
      r.onload = e => {
        img = new Image();
        img.onload = () => {
          document.getElementById('ic-settings').style.display = 'block';
          document.getElementById('ic-width').placeholder = img.width;
          document.getElementById('ic-height').placeholder = img.height;
        };
        img.src = e.target.result;
      };
      r.readAsDataURL(file);
    }
  });

  document.getElementById('ic-convert').addEventListener('click', () => {
    if (!img) return;
    const format = document.getElementById('ic-format').value;
    const quality = parseInt(qSlider.value) / 100;
    let w = parseInt(document.getElementById('ic-width').value) || img.width;
    let h = parseInt(document.getElementById('ic-height').value) || img.height;

    const canvas = document.getElementById('ic-canvas');
    canvas.width = w; canvas.height = h;
    canvas.getContext('2d').drawImage(img, 0, 0, w, h);

    const ext = format.split('/')[1];
    canvas.toBlob(b => {
      document.getElementById('ic-info').textContent = `${w}×${h} — ${(b.size / 1024).toFixed(1)} KB — ${ext.toUpperCase()}`;
      downloadBlob(b, `converted.${ext}`);
    }, format, quality);

    document.getElementById('ic-result').style.display = 'block';
  });
}
