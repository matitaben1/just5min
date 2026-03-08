import { copyToClipboard } from '../utils.js';

export function render(container) {
  container.innerHTML = `
    <div class="tool-section">
      <div class="tool-section-title">Settings</div>
      <div class="controls-grid">
        <div class="input-group">
          <label>Base Font Size (px)</label>
          <input type="number" id="ptr-base" value="16" min="1" max="100" />
        </div>
      </div>
    </div>
    <div class="tool-section">
      <div class="tool-section-title">Converter</div>
      <div class="controls-grid" style="margin-bottom:16px;">
        <div class="input-group">
          <label>PX Value</label>
          <input type="number" id="ptr-px" value="16" min="0" step="1" />
        </div>
        <div class="input-group">
          <label>REM Value</label>
          <input type="number" id="ptr-rem" value="1" min="0" step="0.0625" />
        </div>
      </div>
    </div>
    <div class="tool-section">
      <div class="tool-section-title">Reference Table</div>
      <div id="ptr-table" style="overflow-x:auto;"></div>
    </div>
  `;

  const base = document.getElementById('ptr-base');
  const pxInput = document.getElementById('ptr-px');
  const remInput = document.getElementById('ptr-rem');

  function updateFromPx() {
    remInput.value = (parseFloat(pxInput.value) / parseFloat(base.value)).toFixed(4);
    buildTable();
  }

  function updateFromRem() {
    pxInput.value = (parseFloat(remInput.value) * parseFloat(base.value)).toFixed(1);
    buildTable();
  }

  function buildTable() {
    const b = parseFloat(base.value);
    const sizes = [8, 10, 11, 12, 13, 14, 15, 16, 18, 20, 22, 24, 28, 32, 36, 40, 48, 56, 64, 72, 80, 96];
    const table = `<table style="width:100%;border-collapse:collapse;font-size:13px;">
      <thead><tr style="border-bottom:2px solid var(--border-primary);">
        <th style="text-align:left;padding:8px;color:var(--text-tertiary);">Pixels</th>
        <th style="text-align:left;padding:8px;color:var(--text-tertiary);">REM</th>
        <th style="text-align:left;padding:8px;color:var(--text-tertiary);">Preview</th>
        <th style="padding:8px;"></th>
      </tr></thead>
      <tbody>${sizes.map(px => {
        const rem = (px / b).toFixed(4).replace(/0+$/, '').replace(/\\.$/, '');
        return `<tr style="border-bottom:1px solid var(--border-primary);">
          <td style="padding:8px;font-family:var(--font-mono);">${px}px</td>
          <td style="padding:8px;font-family:var(--font-mono);">${rem}rem</td>
          <td style="padding:8px;"><span style="font-size:${px}px;line-height:1.2;">Aa</span></td>
          <td style="padding:8px;"><button class="copy-btn" data-val="${rem}rem">Copy</button></td>
        </tr>`;
      }).join('')}</tbody>
    </table>`;

    document.getElementById('ptr-table').innerHTML = table;
    document.querySelectorAll('#ptr-table .copy-btn').forEach(btn => {
      btn.addEventListener('click', () => copyToClipboard(btn.dataset.val));
    });
  }

  pxInput.addEventListener('input', updateFromPx);
  remInput.addEventListener('input', updateFromRem);
  base.addEventListener('input', updateFromPx);
  updateFromPx();
}
