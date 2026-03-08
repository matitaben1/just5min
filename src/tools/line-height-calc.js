export function render(container) {
  container.innerHTML = `
    <div class="tool-section">
      <div class="tool-section-title">Settings</div>
      <div class="controls-grid">
        <div class="input-group">
          <label>Font Size (px)</label>
          <input type="number" id="lh-size" value="16" min="8" max="120" />
        </div>
        <div class="input-group">
          <label>Line Height Ratio</label>
          <input type="number" id="lh-ratio" value="1.5" min="1" max="3" step="0.05" />
        </div>
      </div>
    </div>
    <div class="tool-row">
      <div>
        <div class="tool-section">
          <div class="tool-section-title">Results</div>
          <div id="lh-results" class="grid-2"></div>
        </div>
        <div class="tool-section" style="margin-top:16px;">
          <div class="tool-section-title">Recommended Ratios</div>
          <div id="lh-recommended"></div>
        </div>
      </div>
      <div>
        <div class="tool-section">
          <div class="tool-section-title">Preview</div>
          <div id="lh-preview" style="max-height:400px;overflow:auto;"></div>
        </div>
      </div>
    </div>
  `;

  const sizeInput = document.getElementById('lh-size');
  const ratioInput = document.getElementById('lh-ratio');

  function update() {
    const fontSize = parseInt(sizeInput.value);
    const ratio = parseFloat(ratioInput.value);
    const lineHeight = fontSize * ratio;

    document.getElementById('lh-results').innerHTML = `
      <div class="result-card"><div class="result-value">${lineHeight.toFixed(1)}px</div><div class="result-label">Line Height</div></div>
      <div class="result-card"><div class="result-value">${ratio}</div><div class="result-label">Ratio</div></div>
      <div class="result-card"><div class="result-value">${(lineHeight / 16).toFixed(3)}rem</div><div class="result-label">In REM</div></div>
      <div class="result-card"><div class="result-value">${(lineHeight - fontSize).toFixed(1)}px</div><div class="result-label">Leading</div></div>
    `;

    const text = 'The quick brown fox jumps over the lazy dog. Typography is the art and technique of arranging type to make written language legible, readable, and appealing when displayed.';
    document.getElementById('lh-preview').innerHTML = `
      <p style="font-size:${fontSize}px;line-height:${ratio};color:var(--text-primary);padding:16px;background:var(--bg-glass);border-radius:8px;">${text} ${text}</p>
    `;

    const ratios = [
      { r: 1.2, use: 'Headings' }, { r: 1.3, use: 'Compact UI' },
      { r: 1.4, use: 'Dense text' }, { r: 1.5, use: 'Body text' },
      { r: 1.6, use: 'Readable prose' }, { r: 1.75, use: 'Spacious' },
      { r: 2.0, use: 'Very loose' },
    ];
    document.getElementById('lh-recommended').innerHTML = ratios.map(r => `
      <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--border-primary);font-size:13px;${Math.abs(r.r - ratio) < 0.05 ? 'color:var(--accent-primary);font-weight:600;' : ''}">
        <span>${r.r}</span><span style="color:var(--text-tertiary)">${r.use}</span><span style="font-family:var(--font-mono)">${(fontSize * r.r).toFixed(1)}px</span>
      </div>
    `).join('');
  }

  sizeInput.addEventListener('input', update);
  ratioInput.addEventListener('input', update);
  update();
}
