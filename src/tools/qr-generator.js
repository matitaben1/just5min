import QRCode from 'qrcode';
import { copyToClipboard, downloadDataURL } from '../utils.js';

export function render(container) {
  container.innerHTML = `
    <div class="tool-row">
      <div>
        <div class="tool-section">
          <div class="tool-section-title">Settings</div>
          <div class="input-group" style="margin-bottom:16px">
            <label>Content / URL</label>
            <input type="text" id="qr-text" value="https://example.com" placeholder="Enter text or URL" />
          </div>
          <div class="controls-grid" style="margin-bottom:16px">
            <div class="input-group">
              <label>Foreground</label>
              <div style="display:flex;gap:8px;align-items:center">
                <input type="color" id="qr-fg" value="#8b5cf6" />
                <input type="text" id="qr-fg-text" value="#8b5cf6" style="flex:1" />
              </div>
            </div>
            <div class="input-group">
              <label>Background</label>
              <div style="display:flex;gap:8px;align-items:center">
                <input type="color" id="qr-bg" value="#0a0a0f" />
                <input type="text" id="qr-bg-text" value="#0a0a0f" style="flex:1" />
              </div>
            </div>
          </div>
          <div class="controls-grid" style="margin-bottom:16px">
            <div class="input-group">
              <label>Size: <span id="qr-size-val">300</span>px</label>
              <input type="range" id="qr-size" min="100" max="800" value="300" />
            </div>
            <div class="input-group">
              <label>Error Correction</label>
              <select id="qr-ec">
                <option value="L">Low (7%)</option>
                <option value="M" selected>Medium (15%)</option>
                <option value="Q">Quartile (25%)</option>
                <option value="H">High (30%)</option>
              </select>
            </div>
            <div class="input-group">
              <label>Margin</label>
              <input type="number" id="qr-margin" min="0" max="10" value="2" />
            </div>
          </div>
          <div style="display:flex;gap:8px;">
            <button class="btn btn-primary" id="qr-download-png">Download PNG</button>
            <button class="btn btn-secondary" id="qr-download-svg">Download SVG</button>
          </div>
        </div>
      </div>
      <div>
        <div class="preview-area" id="qr-preview" style="min-height:300px;">
          <canvas id="qr-canvas"></canvas>
        </div>
      </div>
    </div>
  `;

  const text = document.getElementById('qr-text');
  const fg = document.getElementById('qr-fg');
  const fgText = document.getElementById('qr-fg-text');
  const bg = document.getElementById('qr-bg');
  const bgText = document.getElementById('qr-bg-text');
  const size = document.getElementById('qr-size');
  const sizeVal = document.getElementById('qr-size-val');
  const ec = document.getElementById('qr-ec');
  const margin = document.getElementById('qr-margin');
  const canvas = document.getElementById('qr-canvas');

  fg.addEventListener('input', () => { fgText.value = fg.value; generate(); });
  fgText.addEventListener('input', () => { fg.value = fgText.value; generate(); });
  bg.addEventListener('input', () => { bgText.value = bg.value; generate(); });
  bgText.addEventListener('input', () => { bg.value = bgText.value; generate(); });
  size.addEventListener('input', () => { sizeVal.textContent = size.value; generate(); });

  [text, ec, margin].forEach(el => el.addEventListener('input', generate));

  function generate() {
    QRCode.toCanvas(canvas, text.value || 'hello', {
      width: parseInt(size.value),
      margin: parseInt(margin.value),
      errorCorrectionLevel: ec.value,
      color: { dark: fg.value, light: bg.value },
    }).catch(err => console.error(err));
  }

  document.getElementById('qr-download-png').addEventListener('click', () => {
    downloadDataURL(canvas.toDataURL('image/png'), 'qrcode.png');
  });

  document.getElementById('qr-download-svg').addEventListener('click', () => {
    QRCode.toString(text.value || 'hello', {
      type: 'svg',
      margin: parseInt(margin.value),
      errorCorrectionLevel: ec.value,
      color: { dark: fg.value, light: bg.value },
    }).then(svg => {
      const blob = new Blob([svg], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'qrcode.svg'; a.click();
      URL.revokeObjectURL(url);
    });
  });

  generate();
}
