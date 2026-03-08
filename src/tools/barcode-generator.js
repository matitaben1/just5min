import JsBarcode from 'jsbarcode';
import { downloadBlob } from '../utils.js';

export function render(container) {
  container.innerHTML = `
    <div class="tool-row">
      <div>
        <div class="tool-section">
          <div class="tool-section-title">Settings</div>
          <div class="input-group" style="margin-bottom:16px">
            <label>Content</label>
            <input type="text" id="bc-text" value="1234567890" />
          </div>
          <div class="controls-grid">
            <div class="input-group">
              <label>Format</label>
              <select id="bc-format">
                <option value="CODE128">Code 128</option>
                <option value="EAN13">EAN-13</option>
                <option value="EAN8">EAN-8</option>
                <option value="UPC">UPC</option>
                <option value="CODE39">Code 39</option>
                <option value="ITF14">ITF-14</option>
                <option value="pharmacode">Pharmacode</option>
              </select>
            </div>
            <div class="input-group">
              <label>Width</label>
              <input type="number" id="bc-width" value="2" min="1" max="4" />
            </div>
            <div class="input-group">
              <label>Height</label>
              <input type="number" id="bc-height" value="100" min="20" max="300" />
            </div>
            <div class="input-group">
              <label>Show Text</label>
              <select id="bc-display">
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
            <div class="input-group">
              <label>Line Color</label>
              <input type="color" id="bc-line" value="#e8e8ed" />
            </div>
            <div class="input-group">
              <label>Background</label>
              <input type="color" id="bc-bg" value="#0a0a0f" />
            </div>
          </div>
        </div>
      </div>
      <div>
        <div class="preview-area barcode-preview" style="min-height:200px;background:#0a0a0f;">
          <svg id="bc-svg"></svg>
        </div>
        <div id="bc-error" style="color:var(--error);font-size:13px;margin-top:8px;display:none;"></div>
        <button class="btn btn-primary" id="bc-download" style="margin-top:16px">Download SVG</button>
      </div>
    </div>
  `;

  function generate() {
    const errorDiv = document.getElementById('bc-error');
    try {
      JsBarcode('#bc-svg', document.getElementById('bc-text').value, {
        format: document.getElementById('bc-format').value,
        width: parseInt(document.getElementById('bc-width').value),
        height: parseInt(document.getElementById('bc-height').value),
        displayValue: document.getElementById('bc-display').value === 'true',
        lineColor: document.getElementById('bc-line').value,
        background: document.getElementById('bc-bg').value,
        font: 'Inter',
        fontSize: 14,
        textMargin: 6,
      });
      errorDiv.style.display = 'none';
    } catch (e) {
      errorDiv.textContent = e.message;
      errorDiv.style.display = 'block';
    }
  }

  ['bc-text', 'bc-format', 'bc-width', 'bc-height', 'bc-display', 'bc-line', 'bc-bg'].forEach(id => {
    document.getElementById(id).addEventListener('input', generate);
    document.getElementById(id).addEventListener('change', generate);
  });

  document.getElementById('bc-download').addEventListener('click', () => {
    const svg = document.getElementById('bc-svg').outerHTML;
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    downloadBlob(blob, 'barcode.svg');
  });

  generate();
}
