import { createFileDropZone, downloadBlob } from '../utils.js';

export function render(container) {
  let img = null;
  container.innerHTML = `
    <div class="tool-section">
      <div class="tool-section-title">Upload Image</div>
      <div id="is-drop"></div>
    </div>
    <div class="tool-section" id="is-settings" style="display:none;">
      <div class="tool-section-title">Grid Settings</div>
      <div class="controls-grid">
        <div class="input-group">
          <label>Columns</label>
          <input type="number" id="is-cols" value="3" min="1" max="20" />
        </div>
        <div class="input-group">
          <label>Rows</label>
          <input type="number" id="is-rows" value="3" min="1" max="20" />
        </div>
      </div>
      <button class="btn btn-primary" id="is-split" style="margin-top:16px">Split</button>
    </div>
    <div class="tool-section" id="is-result" style="display:none;">
      <div class="tool-section-title">Tiles</div>
      <div id="is-tiles"></div>
      <button class="btn btn-primary" id="is-download-all" style="margin-top:16px">Download All</button>
    </div>
  `;

  createFileDropZone(document.getElementById('is-drop'), {
    accept: 'image/*', icon: '🔲',
    text: 'Drop an image to split or <strong>click to browse</strong>',
    onFile: file => {
      const r = new FileReader();
      r.onload = e => {
        img = new Image();
        img.onload = () => document.getElementById('is-settings').style.display = 'block';
        img.src = e.target.result;
      };
      r.readAsDataURL(file);
    }
  });

  document.getElementById('is-split').addEventListener('click', () => {
    if (!img) return;
    const cols = parseInt(document.getElementById('is-cols').value);
    const rows = parseInt(document.getElementById('is-rows').value);
    const tw = Math.floor(img.width / cols);
    const th = Math.floor(img.height / rows);
    const tiles = document.getElementById('is-tiles');
    tiles.innerHTML = '';
    tiles.style.cssText = `display:grid;grid-template-columns:repeat(${cols},1fr);gap:4px;`;
    const canvases = [];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const canvas = document.createElement('canvas');
        canvas.width = tw; canvas.height = th;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, c * tw, r * th, tw, th, 0, 0, tw, th);
        canvas.style.cssText = 'width:100%;border-radius:4px;border:1px solid var(--border-primary);cursor:pointer;';
        canvas.title = `Tile ${r * cols + c + 1}`;
        canvas.addEventListener('click', () => {
          canvas.toBlob(b => downloadBlob(b, `tile-${r + 1}-${c + 1}.png`), 'image/png');
        });
        tiles.appendChild(canvas);
        canvases.push({ canvas, r: r + 1, c: c + 1 });
      }
    }
    document.getElementById('is-result').style.display = 'block';
    document.getElementById('is-download-all').onclick = () => {
      canvases.forEach(({ canvas, r, c }) => {
        canvas.toBlob(b => downloadBlob(b, `tile-${r}-${c}.png`), 'image/png');
      });
    };
  });
}
