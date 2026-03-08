import { createFileDropZone } from '../utils.js';

const SIMULATIONS = {
  normal: { name: 'Normal Vision', matrix: null },
  protanopia: { name: 'Protanopia (No Red)', matrix: [0.567,0.433,0,0,0, 0.558,0.442,0,0,0, 0,0.242,0.758,0,0, 0,0,0,1,0] },
  deuteranopia: { name: 'Deuteranopia (No Green)', matrix: [0.625,0.375,0,0,0, 0.7,0.3,0,0,0, 0,0.3,0.7,0,0, 0,0,0,1,0] },
  tritanopia: { name: 'Tritanopia (No Blue)', matrix: [0.95,0.05,0,0,0, 0,0.433,0.567,0,0, 0,0.475,0.525,0,0, 0,0,0,1,0] },
  achromatopsia: { name: 'Achromatopsia (No Color)', matrix: [0.299,0.587,0.114,0,0, 0.299,0.587,0.114,0,0, 0.299,0.587,0.114,0,0, 0,0,0,1,0] },
};

export function render(container) {
  container.innerHTML = `
    <div class="tool-section">
      <div class="tool-section-title">Upload Image</div>
      <div id="cb-drop"></div>
    </div>
    <div class="tool-section" id="cb-sims" style="display:none;">
      <div class="tool-section-title">Simulations</div>
      <div id="cb-results" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px;"></div>
    </div>
    <svg style="display:none;">
      <defs>
        ${Object.entries(SIMULATIONS).filter(([k]) => k !== 'normal').map(([k, v]) => `
          <filter id="filter-${k}">
            <feColorMatrix type="matrix" values="${v.matrix.join(' ')}" />
          </filter>
        `).join('')}
      </defs>
    </svg>
  `;

  createFileDropZone(document.getElementById('cb-drop'), {
    accept: 'image/*',
    icon: '🔍',
    text: 'Drop an image here or <strong>click to browse</strong>',
    onFile: (file) => {
      const reader = new FileReader();
      reader.onload = (e) => showSimulations(e.target.result);
      reader.readAsDataURL(file);
    }
  });

  function showSimulations(src) {
    document.getElementById('cb-sims').style.display = 'block';
    const results = document.getElementById('cb-results');
    results.innerHTML = Object.entries(SIMULATIONS).map(([key, sim]) => `
      <div class="card" style="padding:12px;">
        <div style="font-weight:600;font-size:13px;margin-bottom:8px;">${sim.name}</div>
        <img src="${src}" style="width:100%;border-radius:8px;${key !== 'normal' ? `filter:url(#filter-${key})` : ''}" />
      </div>
    `).join('');
  }
}
