import { hexToRgb, contrastRatio, copyToClipboard } from '../utils.js';

export function render(container) {
  container.innerHTML = `
    <div class="tool-row">
      <div>
        <div class="tool-section">
          <div class="tool-section-title">Colors</div>
          <div class="input-group" style="margin-bottom:16px">
            <label>Text Color</label>
            <div style="display:flex;gap:8px;align-items:center;">
              <input type="color" id="cc-fg" value="#ffffff" />
              <input type="text" id="cc-fg-hex" value="#ffffff" style="flex:1" />
            </div>
          </div>
          <div class="input-group">
            <label>Background Color</label>
            <div style="display:flex;gap:8px;align-items:center;">
              <input type="color" id="cc-bg" value="#0a0a0f" />
              <input type="text" id="cc-bg-hex" value="#0a0a0f" style="flex:1" />
            </div>
          </div>
          <button class="btn btn-ghost" id="cc-swap" style="margin-top:12px">🔄 Swap Colors</button>
        </div>
        <div class="tool-section" style="margin-top:16px">
          <div class="tool-section-title">Results</div>
          <div id="cc-results"></div>
        </div>
      </div>
      <div>
        <div class="tool-section" id="cc-preview" style="min-height:280px;"></div>
      </div>
    </div>
  `;

  const fgPicker = document.getElementById('cc-fg');
  const fgHex = document.getElementById('cc-fg-hex');
  const bgPicker = document.getElementById('cc-bg');
  const bgHex = document.getElementById('cc-bg-hex');

  function update() {
    const fg = hexToRgb(fgPicker.value);
    const bg = hexToRgb(bgPicker.value);
    const ratio = contrastRatio(fg, bg);
    const r = Math.round(ratio * 100) / 100;

    const aaLarge = ratio >= 3;
    const aaNormal = ratio >= 4.5;
    const aaaLarge = ratio >= 4.5;
    const aaaNormal = ratio >= 7;

    document.getElementById('cc-results').innerHTML = `
      <div class="result-card" style="margin-bottom:12px;">
        <div class="result-value">${r}:1</div>
        <div class="result-label">Contrast Ratio</div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
        <div class="result-card">
          <span class="badge ${aaNormal ? 'badge-pass' : 'badge-fail'}">${aaNormal ? '✓ Pass' : '✗ Fail'}</span>
          <div class="result-label" style="margin-top:4px">AA Normal</div>
        </div>
        <div class="result-card">
          <span class="badge ${aaLarge ? 'badge-pass' : 'badge-fail'}">${aaLarge ? '✓ Pass' : '✗ Fail'}</span>
          <div class="result-label" style="margin-top:4px">AA Large</div>
        </div>
        <div class="result-card">
          <span class="badge ${aaaNormal ? 'badge-pass' : 'badge-fail'}">${aaaNormal ? '✓ Pass' : '✗ Fail'}</span>
          <div class="result-label" style="margin-top:4px">AAA Normal</div>
        </div>
        <div class="result-card">
          <span class="badge ${aaaLarge ? 'badge-pass' : 'badge-fail'}">${aaaLarge ? '✓ Pass' : '✗ Fail'}</span>
          <div class="result-label" style="margin-top:4px">AAA Large</div>
        </div>
      </div>
    `;

    document.getElementById('cc-preview').innerHTML = `
      <div style="background:${bgPicker.value};color:${fgPicker.value};padding:24px;border-radius:12px;">
        <h3 style="font-size:24px;font-weight:700;margin-bottom:8px;">Preview Text</h3>
        <p style="font-size:16px;margin-bottom:12px;">This is how your text looks against the background at normal size (16px).</p>
        <p style="font-size:14px;margin-bottom:8px;">Small text at 14px for checking readability at smaller sizes.</p>
        <p style="font-size:24px;font-weight:700;">Large bold text (24px bold)</p>
      </div>
    `;
  }

  fgPicker.addEventListener('input', () => { fgHex.value = fgPicker.value; update(); });
  fgHex.addEventListener('input', () => { fgPicker.value = fgHex.value; update(); });
  bgPicker.addEventListener('input', () => { bgHex.value = bgPicker.value; update(); });
  bgHex.addEventListener('input', () => { bgPicker.value = bgHex.value; update(); });

  document.getElementById('cc-swap').addEventListener('click', () => {
    const tmp = fgPicker.value;
    fgPicker.value = bgPicker.value; fgHex.value = fgPicker.value;
    bgPicker.value = tmp; bgHex.value = bgPicker.value;
    update();
  });

  update();
}
