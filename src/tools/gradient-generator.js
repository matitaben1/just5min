import { copyToClipboard } from '../utils.js';

export function render(container) {
  container.innerHTML = `
    <div class="tool-row">
      <div>
        <div class="tool-section">
          <div class="tool-section-title">Gradient Settings</div>
          <div class="input-group" style="margin-bottom:16px">
            <label>Type</label>
            <select id="gg-type">
              <option value="linear">Linear</option>
              <option value="radial">Radial</option>
              <option value="conic">Conic</option>
            </select>
          </div>
          <div class="input-group" style="margin-bottom:16px">
            <label>Angle: <span id="gg-angle-val">135</span>°</label>
            <input type="range" id="gg-angle" min="0" max="360" value="135" />
          </div>
          <div id="gg-stops">
            <div class="tool-section-title">Color Stops</div>
          </div>
          <div id="gg-stops-list"></div>
          <button class="btn btn-ghost" id="gg-add-stop" style="margin-top:8px">+ Add Stop</button>
        </div>
      </div>
      <div>
        <div class="gradient-preview" id="gg-preview" style="height:300px;margin-bottom:16px;"></div>
        <div class="output-area" id="gg-css" style="position:relative;"></div>
        <button class="btn btn-secondary" id="gg-copy" style="margin-top:12px">Copy CSS</button>
      </div>
    </div>
  `;

  let stops = [
    { color: '#8b5cf6', position: 0 },
    { color: '#ec4899', position: 50 },
    { color: '#06b6d4', position: 100 },
  ];

  const type = document.getElementById('gg-type');
  const angle = document.getElementById('gg-angle');
  const angleVal = document.getElementById('gg-angle-val');

  function renderStops() {
    const list = document.getElementById('gg-stops-list');
    list.innerHTML = stops.map((s, i) => `
      <div style="display:flex;gap:8px;align-items:center;margin-bottom:8px;" data-i="${i}">
        <input type="color" value="${s.color}" class="gs-color" data-i="${i}" />
        <input type="range" min="0" max="100" value="${s.position}" class="gs-pos" data-i="${i}" style="flex:1" />
        <span style="font-size:12px;font-family:var(--font-mono);min-width:36px;">${s.position}%</span>
        ${stops.length > 2 ? `<button class="btn btn-ghost btn-sm gs-del" data-i="${i}">✕</button>` : ''}
      </div>
    `).join('');

    list.querySelectorAll('.gs-color').forEach(el => {
      el.addEventListener('input', (e) => { stops[e.target.dataset.i].color = e.target.value; update(); });
    });
    list.querySelectorAll('.gs-pos').forEach(el => {
      el.addEventListener('input', (e) => {
        stops[e.target.dataset.i].position = parseInt(e.target.value);
        update();
      });
    });
    list.querySelectorAll('.gs-del').forEach(el => {
      el.addEventListener('click', (e) => {
        stops.splice(parseInt(e.target.dataset.i), 1);
        renderStops();
        update();
      });
    });
  }

  function getCSS() {
    const stopsStr = stops.map(s => `${s.color} ${s.position}%`).join(', ');
    const t = type.value;
    if (t === 'linear') return `linear-gradient(${angle.value}deg, ${stopsStr})`;
    if (t === 'radial') return `radial-gradient(circle, ${stopsStr})`;
    return `conic-gradient(from ${angle.value}deg, ${stopsStr})`;
  }

  function update() {
    const css = getCSS();
    document.getElementById('gg-preview').style.background = css;
    document.getElementById('gg-css').textContent = `background: ${css};`;
    renderStops();
  }

  angle.addEventListener('input', () => { angleVal.textContent = angle.value; update(); });
  type.addEventListener('change', update);
  document.getElementById('gg-add-stop').addEventListener('click', () => {
    stops.push({ color: '#ffffff', position: 50 });
    update();
  });
  document.getElementById('gg-copy').addEventListener('click', () => copyToClipboard(`background: ${getCSS()};`));

  update();
}
