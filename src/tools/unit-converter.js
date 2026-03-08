import { copyToClipboard } from '../utils.js';

const CATEGORIES = {
  Length: {
    units: { m: 1, km: 1000, cm: 0.01, mm: 0.001, mi: 1609.344, yd: 0.9144, ft: 0.3048, in: 0.0254 },
    labels: { m: 'Meters', km: 'Kilometers', cm: 'Centimeters', mm: 'Millimeters', mi: 'Miles', yd: 'Yards', ft: 'Feet', in: 'Inches' }
  },
  Weight: {
    units: { kg: 1, g: 0.001, mg: 0.000001, lb: 0.453592, oz: 0.0283495, ton: 1000 },
    labels: { kg: 'Kilograms', g: 'Grams', mg: 'Milligrams', lb: 'Pounds', oz: 'Ounces', ton: 'Metric Tons' }
  },
  Temperature: {
    special: true,
    units: ['celsius', 'fahrenheit', 'kelvin'],
    labels: { celsius: 'Celsius (°C)', fahrenheit: 'Fahrenheit (°F)', kelvin: 'Kelvin (K)' }
  },
  Data: {
    units: { B: 1, KB: 1024, MB: 1048576, GB: 1073741824, TB: 1099511627776, bit: 0.125 },
    labels: { B: 'Bytes', KB: 'Kilobytes', MB: 'Megabytes', GB: 'Gigabytes', TB: 'Terabytes', bit: 'Bits' }
  },
  Time: {
    units: { s: 1, ms: 0.001, min: 60, hr: 3600, day: 86400, wk: 604800, yr: 31536000 },
    labels: { s: 'Seconds', ms: 'Milliseconds', min: 'Minutes', hr: 'Hours', day: 'Days', wk: 'Weeks', yr: 'Years' }
  },
  Area: {
    units: { m2: 1, km2: 1e6, cm2: 1e-4, ft2: 0.092903, ac: 4046.86, ha: 10000 },
    labels: { m2: 'm²', km2: 'km²', cm2: 'cm²', ft2: 'ft²', ac: 'Acres', ha: 'Hectares' }
  },
};

function convertTemp(val, from, to) {
  let c;
  if (from === 'celsius') c = val;
  else if (from === 'fahrenheit') c = (val - 32) * 5/9;
  else c = val - 273.15;
  if (to === 'celsius') return c;
  if (to === 'fahrenheit') return c * 9/5 + 32;
  return c + 273.15;
}

export function render(container) {
  container.innerHTML = `
    <div class="tool-section">
      <div class="tool-section-title">Category</div>
      <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:16px;" id="uc-cats">
        ${Object.keys(CATEGORIES).map((cat, i) =>
          `<button class="btn ${i === 0 ? 'btn-primary' : 'btn-secondary'} uc-cat" data-cat="${cat}">${cat}</button>`
        ).join('')}
      </div>
      <div class="controls-grid">
        <div class="input-group">
          <label>Value</label>
          <input type="number" id="uc-val" value="1" step="any" />
        </div>
        <div class="input-group">
          <label>From Unit</label>
          <select id="uc-from"></select>
        </div>
      </div>
    </div>
    <div class="tool-section">
      <div class="tool-section-title">Results</div>
      <div id="uc-results" style="display:flex;flex-direction:column;gap:8px;"></div>
    </div>
  `;

  let currentCat = 'Length';

  function buildUnits() {
    const cat = CATEGORIES[currentCat];
    const units = cat.special ? cat.units : Object.keys(cat.units);
    const labels = cat.labels;
    const fromSel = document.getElementById('uc-from');
    fromSel.innerHTML = units.map(u => `<option value="${u}">${labels[u]}</option>`).join('');
  }

  function update() {
    const cat = CATEGORIES[currentCat];
    const val = parseFloat(document.getElementById('uc-val').value);
    const from = document.getElementById('uc-from').value;

    if (isNaN(val)) return;

    const units = cat.special ? cat.units : Object.keys(cat.units);
    const labels = cat.labels;

    document.getElementById('uc-results').innerHTML = units.map(u => {
      let converted;
      if (cat.special) {
        converted = convertTemp(val, from, u);
      } else {
        const inBase = val * cat.units[from];
        converted = inBase / cat.units[u];
      }
      const display = converted.toLocaleString(undefined, { maximumFractionDigits: 6 });
      return `<div class="output-area" style="display:flex;justify-content:space-between;align-items:center;${u === from ? 'border-color:var(--accent-primary);' : ''}">
        <div><span style="color:var(--text-tertiary);font-size:12px;min-width:100px;display:inline-block;">${labels[u]}</span>
        <span style="font-family:var(--font-mono);font-weight:600;">${display}</span></div>
        <button class="copy-btn" data-val="${display}">Copy</button>
      </div>`;
    }).join('');

    document.querySelectorAll('#uc-results .copy-btn').forEach(btn => {
      btn.addEventListener('click', () => copyToClipboard(btn.dataset.val));
    });
  }

  document.querySelectorAll('.uc-cat').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.uc-cat').forEach(b => b.className = 'btn btn-secondary uc-cat');
      btn.className = 'btn btn-primary uc-cat';
      currentCat = btn.dataset.cat;
      buildUnits();
      update();
    });
  });

  document.getElementById('uc-val').addEventListener('input', update);
  document.getElementById('uc-from').addEventListener('change', update);

  buildUnits();
  update();
}
