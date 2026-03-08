import { copyToClipboard } from '../utils.js';

const PAPERS = [
  { name: 'A0', mm: [841, 1189], series: 'A' }, { name: 'A1', mm: [594, 841], series: 'A' },
  { name: 'A2', mm: [420, 594], series: 'A' }, { name: 'A3', mm: [297, 420], series: 'A' },
  { name: 'A4', mm: [210, 297], series: 'A' }, { name: 'A5', mm: [148, 210], series: 'A' },
  { name: 'A6', mm: [105, 148], series: 'A' }, { name: 'A7', mm: [74, 105], series: 'A' },
  { name: 'B0', mm: [1000, 1414], series: 'B' }, { name: 'B1', mm: [707, 1000], series: 'B' },
  { name: 'B2', mm: [500, 707], series: 'B' }, { name: 'B3', mm: [353, 500], series: 'B' },
  { name: 'B4', mm: [250, 353], series: 'B' }, { name: 'B5', mm: [176, 250], series: 'B' },
  { name: 'Letter', mm: [216, 279], series: 'US' },
  { name: 'Legal', mm: [216, 356], series: 'US' },
  { name: 'Tabloid', mm: [279, 432], series: 'US' },
  { name: 'Executive', mm: [184, 267], series: 'US' },
  { name: 'Half Letter', mm: [140, 216], series: 'US' },
];

export function render(container) {
  container.innerHTML = `
    <div class="tool-section">
      <div class="tool-section-title">Paper Size Reference</div>
      <div style="display:flex;gap:8px;margin-bottom:16px;">
        <button class="btn btn-secondary tab-filter active" data-series="all">All</button>
        <button class="btn btn-ghost tab-filter" data-series="A">A Series</button>
        <button class="btn btn-ghost tab-filter" data-series="B">B Series</button>
        <button class="btn btn-ghost tab-filter" data-series="US">US Sizes</button>
      </div>
      <div id="ps-table" style="overflow-x:auto;"></div>
    </div>
    <div class="tool-section">
      <div class="tool-section-title">Visual Comparison</div>
      <div id="ps-visual" style="position:relative;width:100%;height:300px;background:var(--bg-glass);border-radius:8px;overflow:hidden;"></div>
    </div>
  `;

  function showPapers(series) {
    const filtered = series === 'all' ? PAPERS : PAPERS.filter(p => p.series === series);
    document.getElementById('ps-table').innerHTML = `<table style="width:100%;border-collapse:collapse;font-size:13px;">
      <thead><tr style="border-bottom:2px solid var(--border-primary);">
        <th style="text-align:left;padding:8px;color:var(--text-tertiary);">Name</th>
        <th style="text-align:left;padding:8px;color:var(--text-tertiary);">mm</th>
        <th style="text-align:left;padding:8px;color:var(--text-tertiary);">inches</th>
        <th style="text-align:left;padding:8px;color:var(--text-tertiary);">px @72dpi</th>
        <th style="text-align:left;padding:8px;color:var(--text-tertiary);">px @300dpi</th>
        <th style="padding:8px;"></th>
      </tr></thead>
      <tbody>${filtered.map(p => {
        const inW = (p.mm[0] / 25.4).toFixed(2);
        const inH = (p.mm[1] / 25.4).toFixed(2);
        return `<tr style="border-bottom:1px solid var(--border-primary);">
          <td style="padding:8px;font-weight:600;">${p.name}</td>
          <td style="padding:8px;font-family:var(--font-mono);">${p.mm[0]} × ${p.mm[1]}</td>
          <td style="padding:8px;font-family:var(--font-mono);">${inW} × ${inH}</td>
          <td style="padding:8px;font-family:var(--font-mono);">${Math.round(p.mm[0] / 25.4 * 72)} × ${Math.round(p.mm[1] / 25.4 * 72)}</td>
          <td style="padding:8px;font-family:var(--font-mono);">${Math.round(p.mm[0] / 25.4 * 300)} × ${Math.round(p.mm[1] / 25.4 * 300)}</td>
          <td style="padding:8px;"><button class="copy-btn" data-val="${p.mm[0]}x${p.mm[1]}mm">Copy</button></td>
        </tr>`;
      }).join('')}</tbody>
    </table>`;

    document.querySelectorAll('#ps-table .copy-btn').forEach(btn => {
      btn.addEventListener('click', () => copyToClipboard(btn.dataset.val));
    });

    // Visual comparison
    const maxW = Math.max(...filtered.map(p => p.mm[0]));
    const maxH = Math.max(...filtered.map(p => p.mm[1]));
    const scale = Math.min(280 / maxH, (container.offsetWidth - 60) / maxW);
    const colors = ['#8b5cf6', '#ec4899', '#06b6d4', '#f59e0b', '#22c55e', '#ef4444', '#3b82f6', '#a855f7'];

    document.getElementById('ps-visual').innerHTML = filtered.slice(0, 8).map((p, i) => {
      const w = p.mm[0] * scale;
      const h = p.mm[1] * scale;
      return `<div class="paper-visual" style="position:absolute;bottom:10px;left:10px;width:${w}px;height:${h}px;border:2px solid ${colors[i % colors.length]};border-radius:4px;background:rgba(255,255,255,0.02);">
        <span style="color:${colors[i % colors.length]};font-size:10px;">${p.name}</span>
      </div>`;
    }).join('');
  }

  document.querySelectorAll('.tab-filter').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.tab-filter').forEach(b => { b.className = 'btn btn-ghost tab-filter'; });
      e.target.className = 'btn btn-secondary tab-filter active';
      showPapers(e.target.dataset.series);
    });
  });

  showPapers('all');
}
