export function render(container) {
  let baseSize = 16;
  const PHI = 1.61803398875;

  container.innerHTML = `
    <div class="tool-row" style="grid-template-columns: 1fr;">
      
      <div class="tool-section">
        <h2 class="section-heading">Base Size Settings</h2>
        
        <div class="input-group" style="margin-bottom: 24px;">
          <label>Base Value (px, rem, or pt):</label>
          <input type="number" id="base-input" value="${baseSize}" min="1" max="1000" style="padding: 12px; font-size: 16px; border-radius: var(--radius-sm); border: 1px solid var(--border-primary);" />
        </div>
      </div>

      <div class="tool-row">
        <!-- Typography Scale -->
        <div class="tool-section">
          <h2 class="section-heading">Typographic Scale (Golden Ratio)</h2>
          <p class="hero-subtext" style="font-size: 12px; margin-bottom: 16px;">Each step is multiplied or divided by 1.618.</p>
          <div id="typo-scale" style="display: flex; flex-direction: column; gap: 12px;"></div>
        </div>
        
        <!-- Layout Elements -->
        <div class="tool-section">
          <h2 class="section-heading">Layout Dimensions</h2>
          <p class="hero-subtext" style="font-size: 12px; margin-bottom: 16px;">Width / Height calculated via Golden Ratio.</p>
          <div id="layout-grid" style="display: grid; gap: 8px;"></div>
        </div>
      </div>
    </div>
  `;

  const input = document.getElementById('base-input');
  const typoScale = document.getElementById('typo-scale');
  const layoutGrid = document.getElementById('layout-grid');

  function calculate() {
    baseSize = parseFloat(input.value) || 16;
    
    // Typographic Scale
    const scales = [
      { name: 'Micro (Base / Φ³)', val: baseSize / Math.pow(PHI, 3) },
      { name: 'Small (Base / Φ²)', val: baseSize / Math.pow(PHI, 2) },
      { name: 'Body (Base)', val: baseSize },
      { name: 'H3 (Base × Φ)', val: baseSize * PHI },
      { name: 'H2 (Base × Φ²)', val: baseSize * Math.pow(PHI, 2) },
      { name: 'H1 (Base × Φ³)', val: baseSize * Math.pow(PHI, 3) },
      { name: 'Display (Base × Φ⁴)', val: baseSize * Math.pow(PHI, 4) }
    ];

    let typoHTML = '';
    scales.reverse().forEach(scale => {
      const rounded = scale.val.toFixed(2);
      const isBase = scale.name.includes('(Base)');
      typoHTML += `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; background: ${isBase ? 'var(--text-primary)' : 'var(--bg-muted)'}; color: ${isBase ? '#fff' : 'var(--text-primary)'}; border-radius: var(--radius-sm);">
          <div style="font-weight: 600; font-size: 13px;">${scale.name}</div>
          <div style="font-family: var(--font-mono); font-size: 14px;">${rounded}</div>
        </div>
      `;
    });
    typoScale.innerHTML = typoHTML;

    // Layout Dimensions (Containers / Margins)
    const layouts = [
      { w: baseSize, h: baseSize / PHI, desc: 'Golden Rectangle (Landscape)' },
      { w: baseSize / PHI, h: baseSize, desc: 'Golden Rectangle (Portrait)' },
      { w: baseSize * PHI, h: baseSize, desc: 'Expanded Rectangle' }
    ];

    let layoutHTML = '';
    layouts.forEach(l => {
      layoutHTML += `
        <div style="padding: 16px; background: var(--bg-muted); border-radius: var(--radius-sm); border: 1px solid var(--border-primary);">
          <div style="font-size: 12px; color: var(--text-tertiary); margin-bottom: 8px; text-transform: uppercase; font-weight: 600;">${l.desc}</div>
          <div style="font-family: var(--font-mono); font-size: 16px; font-weight: 500;">
            ${l.w.toFixed(1)} × ${l.h.toFixed(1)}
          </div>
        </div>
      `;
    });
    layoutGrid.innerHTML = layoutHTML;
  }

  input.addEventListener('input', calculate);
  calculate();
}
