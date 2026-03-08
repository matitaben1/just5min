import { downloadBlob, copyToClipboard } from '../utils.js';

export function render(container) {
  container.innerHTML = `
    <div class="tool-section">
      <div class="tool-section-title">Settings</div>
      <div class="controls-grid">
        <div class="input-group">
          <label>Width</label>
          <input type="number" id="ph-w" value="800" min="50" max="4000" />
        </div>
        <div class="input-group">
          <label>Height</label>
          <input type="number" id="ph-h" value="400" min="50" max="4000" />
        </div>
        <div class="input-group">
          <label>Background</label>
          <input type="color" id="ph-bg" value="#1a1a25" />
        </div>
        <div class="input-group">
          <label>Text Color</label>
          <input type="color" id="ph-fg" value="#6a6a80" />
        </div>
        <div class="input-group">
          <label>Text</label>
          <input type="text" id="ph-text" value="" placeholder="Auto: WxH" />
        </div>
        <div class="input-group">
          <label>Format</label>
          <select id="ph-format">
            <option value="png">PNG</option>
            <option value="jpeg">JPEG</option>
            <option value="webp">WebP</option>
          </select>
        </div>
      </div>
      <button class="btn btn-primary" id="ph-gen" style="margin-top:16px">Generate</button>
    </div>
    <div class="tool-section">
      <div class="tool-section-title">Preview</div>
      <div class="preview-area"><canvas id="ph-canvas"></canvas></div>
      <div style="display:flex;gap:8px;margin-top:16px;">
        <button class="btn btn-primary" id="ph-download">Download</button>
        <button class="btn btn-secondary" id="ph-copy-url">Copy Data URL</button>
      </div>
    </div>
  `;

  function generate() {
    const w = parseInt(document.getElementById('ph-w').value);
    const h = parseInt(document.getElementById('ph-h').value);
    const bg = document.getElementById('ph-bg').value;
    const fg = document.getElementById('ph-fg').value;
    const text = document.getElementById('ph-text').value || `${w} × ${h}`;
    const canvas = document.getElementById('ph-canvas');
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);
    // Cross lines
    ctx.strokeStyle = fg;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.3;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(w, h); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(w, 0); ctx.lineTo(0, h); ctx.stroke();
    ctx.globalAlpha = 1;
    // Text
    const fontSize = Math.max(14, Math.min(w, h) / 8);
    ctx.font = `500 ${fontSize}px Inter, sans-serif`;
    ctx.fillStyle = fg;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, w / 2, h / 2);
  }

  document.getElementById('ph-gen').addEventListener('click', generate);
  document.getElementById('ph-download').addEventListener('click', () => {
    const format = document.getElementById('ph-format').value;
    const mime = format === 'jpeg' ? 'image/jpeg' : format === 'webp' ? 'image/webp' : 'image/png';
    document.getElementById('ph-canvas').toBlob(b => downloadBlob(b, `placeholder.${format}`), mime);
  });
  document.getElementById('ph-copy-url').addEventListener('click', () => {
    copyToClipboard(document.getElementById('ph-canvas').toDataURL());
  });

  generate();
}
