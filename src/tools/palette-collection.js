import { copyToClipboard, getTextColor } from '../utils.js';

const PALETTES = [
  { name: 'Sunset Blaze', colors: ['#FF6B6B', '#FFA07A', '#FFD700', '#FF4500', '#DC143C'] },
  { name: 'Ocean Breeze', colors: ['#0077B6', '#00B4D8', '#90E0EF', '#CAF0F8', '#023E8A'] },
  { name: 'Forest Mist', colors: ['#2D6A4F', '#40916C', '#52B788', '#95D5B2', '#D8F3DC'] },
  { name: 'Purple Rain', colors: ['#7B2D8E', '#9B59B6', '#8E44AD', '#6C3483', '#4A235A'] },
  { name: 'Warm Earth', colors: ['#8B4513', '#A0522D', '#CD853F', '#DEB887', '#FFDEAD'] },
  { name: 'Neon City', colors: ['#FF006E', '#8338EC', '#3A86FF', '#FB5607', '#FFBE0B'] },
  { name: 'Pastel Dream', colors: ['#FFB5E8', '#B28DFF', '#85E3FF', '#BFFCC6', '#FFF5BA'] },
  { name: 'Midnight', colors: ['#0F0F23', '#1A1A3E', '#2D2D62', '#3F3F8F', '#4A4ABF'] },
  { name: 'Coral Reef', colors: ['#FF6F61', '#FF9A76', '#FCEADE', '#99B898', '#4A7C59'] },
  { name: 'Arctic Aurora', colors: ['#0D1B2A', '#1B263B', '#415A77', '#778DA9', '#E0E1DD'] },
  { name: 'Candy', colors: ['#FF69B4', '#FF1493', '#C71585', '#DB7093', '#FFB6C1'] },
  { name: 'Cyberpunk', colors: ['#0D0221', '#0F084B', '#26408B', '#A6CFD5', '#C2E7D9'] },
  { name: 'Autumn Leaves', colors: ['#D4A574', '#C68B59', '#8B6914', '#CD853F', '#F4A460'] },
  { name: 'Minimal Grey', colors: ['#F8F9FA', '#E9ECEF', '#DEE2E6', '#ADB5BD', '#495057'] },
  { name: 'Tropical', colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'] },
  { name: 'Vintage Rose', colors: ['#E8C4C4', '#CE7777', '#B85C5C', '#8B4513', '#F5E6CC'] },
  { name: 'Deep Space', colors: ['#0C0C1D', '#19193D', '#292966', '#3D3D99', '#5252CC'] },
  { name: 'Spring Garden', colors: ['#FFD1DC', '#FFB7B2', '#FFDAC1', '#E2F0CB', '#B5EAD7'] },
  { name: 'Monokai', colors: ['#272822', '#F8F8F2', '#F92672', '#A6E22E', '#66D9EF'] },
  { name: 'Material Blue', colors: ['#E3F2FD', '#90CAF9', '#42A5F5', '#1E88E5', '#0D47A1'] },
];

export function render(container) {
  container.innerHTML = `
    <div class="tool-section">
      <div class="tool-section-title">Curated Palettes (${PALETTES.length})</div>
      <div id="pc-list" style="display:flex;flex-direction:column;gap:16px;"></div>
    </div>
  `;

  const list = document.getElementById('pc-list');
  list.innerHTML = PALETTES.map(p => `
    <div class="card" style="padding:16px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
        <span style="font-weight:600;font-size:14px;">${p.name}</span>
        <button class="copy-btn" data-colors='${JSON.stringify(p.colors)}'>Copy CSS</button>
      </div>
      <div class="palette-bar" style="height:60px;">
        ${p.colors.map(c => {
          const tc = getTextColor(c);
          return `<div class="palette-bar-color" style="background:${c};color:${tc}" data-color="${c}"><span>${c}</span></div>`;
        }).join('')}
      </div>
    </div>
  `).join('');

  list.querySelectorAll('.palette-bar-color').forEach(el => {
    el.addEventListener('click', () => copyToClipboard(el.dataset.color));
  });

  list.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const colors = JSON.parse(btn.dataset.colors);
      const css = colors.map((c, i) => `  --color-${i + 1}: ${c};`).join('\n');
      copyToClipboard(`:root {\n${css}\n}`);
    });
  });
}
