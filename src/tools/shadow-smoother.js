export function render(container) {
  let elevation = 10;
  let shadowColor = '#000000';
  let spread = 0;

  // Pre-calculated layered shadow formula based on standard smooth shadows
  const getLayers = (y, c, s) => {
    // Generate 6 layers of increasing offset and blur, decreasing opacity
    const alphaBase = 0.07;
    return `
box-shadow: 
  0px ${Math.round(y * 0.1)}px ${Math.round(y * 0.2)}px 0px ${hexToRGBA(c, alphaBase * 0.8)},
  0px ${Math.round(y * 0.3)}px ${Math.round(y * 0.6)}px 0px ${hexToRGBA(c, alphaBase * 0.7)},
  0px ${Math.round(y * 0.6)}px ${Math.round(y * 1.2)}px 0px ${hexToRGBA(c, alphaBase * 0.6)},
  0px ${Math.round(y * 1.0)}px ${Math.round(y * 2.0)}px ${s}px ${hexToRGBA(c, alphaBase * 0.5)},
  0px ${Math.round(y * 1.6)}px ${Math.round(y * 3.2)}px ${s}px ${hexToRGBA(c, alphaBase * 0.4)},
  0px ${Math.round(y * 2.5)}px ${Math.round(y * 5.0)}px ${s}px ${hexToRGBA(c, alphaBase * 0.3)};
    `.trim();
  };

  function hexToRGBA(hex, alpha) {
    let r = parseInt(hex.slice(1, 3), 16),
        g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(3)})`;
  }

  container.innerHTML = `
    <div class="tool-row">
      <!-- Controls -->
      <div class="tool-section">
        <h2 class="section-heading">Settings</h2>
        
        <div class="input-group" style="margin-bottom: 24px;">
          <label>Elevation (Y-Offset): <span id="val-el">${elevation}</span>px</label>
          <input type="range" id="param-el" min="1" max="100" value="${elevation}" />
        </div>
        
        <div class="input-group" style="margin-bottom: 24px;">
          <label>Spread: <span id="val-spread">${spread}</span>px</label>
          <input type="range" id="param-spread" min="-20" max="20" value="${spread}" />
        </div>
        
        <div class="input-group" style="margin-bottom: 24px;">
          <label>Shadow Colour:</label>
          <input type="color" id="param-color" value="${shadowColor}" style="width: 100%; height: 40px; border-radius: var(--radius-sm); border: 1px solid var(--border-primary); padding: 2px;" />
        </div>
      </div>

      <!-- Preview & Output -->
      <div class="tool-section">
        <h2 class="section-heading">Preview</h2>
        <div class="preview-area" style="position: relative; overflow: hidden; height: 320px; background: #fafafa; display: flex; align-items: center; justify-content: center; border-radius: 12px; border: 1px solid var(--border-primary);">
          
          <div id="shadow-preview" style="
            width: 140px;
            height: 140px;
            background: #ffffff;
            border-radius: 16px;
          "></div>
        </div>

        <h2 class="section-heading" style="margin-top: 24px;">CSS Code</h2>
        <div class="output-area" id="css-output" style="white-space: pre; position: relative; padding-top: 36px; font-size: 12px; overflow-x: auto;"></div>
        <button class="btn btn-primary" id="copy-btn" style="margin-top: 12px; width: 100%;">Copy CSS</button>
      </div>
    </div>
  `;

  // DOM Elements
  const pEl = document.getElementById('param-el');
  const pSpread = document.getElementById('param-spread');
  const pColor = document.getElementById('param-color');
  
  const vEl = document.getElementById('val-el');
  const vSpread = document.getElementById('val-spread');

  const preview = document.getElementById('shadow-preview');
  const cssOutput = document.getElementById('css-output');
  const copyBtn = document.getElementById('copy-btn');

  function update() {
    elevation = parseInt(pEl.value);
    spread = parseInt(pSpread.value);
    shadowColor = pColor.value;

    vEl.textContent = elevation;
    vSpread.textContent = spread;

    const code = getLayers(elevation, shadowColor, spread);
    
    // Apply to preview
    preview.style.cssText = `width: 140px; height: 140px; background: #ffffff; border-radius: 16px; ${code}`;

    cssOutput.textContent = code;
  }

  [pEl, pSpread, pColor].forEach(el => {
    el.addEventListener('input', update);
  });

  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(cssOutput.textContent).then(() => {
      const orig = copyBtn.textContent;
      copyBtn.textContent = 'Copied!';
      setTimeout(() => copyBtn.textContent = orig, 1500);
    });
  });

  update();
}
