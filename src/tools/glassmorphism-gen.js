export function render(container) {
  let blur = 16;
  let opacity = 0.5;
  let outline = 1;

  container.innerHTML = `
    <div class="tool-row">
      <!-- Controls -->
      <div class="tool-section">
        <h2 class="section-heading">Settings</h2>
        
        <div class="input-group" style="margin-bottom: 24px;">
          <label>Blur: <span id="val-blur">${blur}</span>px</label>
          <input type="range" id="param-blur" min="0" max="100" value="${blur}" />
        </div>
        
        <div class="input-group" style="margin-bottom: 24px;">
          <label>Opacity: <span id="val-opacity">${opacity}</span></label>
          <input type="range" id="param-opacity" min="0" max="1" step="0.01" value="${opacity}" />
        </div>
        
        <div class="input-group" style="margin-bottom: 24px;">
          <label>Outline / Border: <span id="val-outline">${outline}</span>px</label>
          <input type="range" id="param-outline" min="0" max="5" step="1" value="${outline}" />
        </div>
      </div>

      <!-- Preview & Output -->
      <div class="tool-section">
        <h2 class="section-heading">Preview</h2>
        <div class="preview-area" style="position: relative; overflow: hidden; height: 320px; background: linear-gradient(45deg, #111, #444, #111); display: flex; align-items: center; justify-content: center; border-radius: 12px;">
          
          <!-- Background decorative elements to show frosted glass effect -->
          <div style="position: absolute; width: 140px; height: 140px; background: #3b82f6; border-radius: 50%; top: 30px; left: 40px; filter: blur(10px);"></div>
          <div style="position: absolute; width: 180px; height: 180px; background: #ec4899; border-radius: 50%; bottom: 20px; right: 20px; filter: blur(14px);"></div>

          <!-- Glass element -->
          <div id="glass-preview" style="
            position: relative;
            z-index: 10;
            width: 280px;
            height: 180px;
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            font-family: var(--font-sans);
            font-weight: 500;
            font-size: 18px;
            box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
          ">Frosted Glass</div>
        </div>

        <h2 class="section-heading" style="margin-top: 24px;">CSS Code</h2>
        <div class="output-area" id="css-output" style="white-space: pre; position: relative; padding-top: 36px;"></div>
        <button class="btn btn-primary" id="copy-btn" style="margin-top: 12px; width: 100%;">Copy CSS</button>
      </div>
    </div>
  `;

  // DOM Elements
  const pBlur = document.getElementById('param-blur');
  const pOpacity = document.getElementById('param-opacity');
  const pOutline = document.getElementById('param-outline');
  
  const vBlur = document.getElementById('val-blur');
  const vOpacity = document.getElementById('val-opacity');
  const vOutline = document.getElementById('val-outline');

  const preview = document.getElementById('glass-preview');
  const cssOutput = document.getElementById('css-output');
  const copyBtn = document.getElementById('copy-btn');

  function update() {
    blur = pBlur.value;
    opacity = pOpacity.value;
    outline = pOutline.value;

    vBlur.textContent = blur;
    vOpacity.textContent = opacity;
    vOutline.textContent = outline;

    const bgStr = `rgba(255, 255, 255, ${opacity})`;
    const borderStr = outline > 0 ? `${outline}px solid rgba(255, 255, 255, 0.18)` : 'none';
    const blurStr = `blur(${blur}px)`;

    preview.style.background = bgStr;
    preview.style.backdropFilter = blurStr;
    preview.style.webkitBackdropFilter = blurStr;
    preview.style.border = borderStr;

    const code = [
      `background: ${bgStr};`,
      `backdrop-filter: ${blurStr};`,
      `-webkit-backdrop-filter: ${blurStr};`,
      `border: ${borderStr};`,
      `border-radius: 16px;`
    ].join('\\n');

    cssOutput.textContent = code;
  }

  [pBlur, pOpacity, pOutline].forEach(el => {
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
