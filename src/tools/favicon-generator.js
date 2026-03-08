import { createFileDropZone, downloadBlob } from '../utils.js';

export function render(container) {
  let img = null;
  container.innerHTML = `
    <div class="tool-section">
      <div class="tool-section-title">Upload Image</div>
      <div id="fv-drop"></div>
    </div>
    <div class="tool-section" id="fv-result" style="display:none;">
      <div class="tool-section-title">Generated Favicons</div>
      <div id="fv-sizes" style="display:flex;gap:16px;flex-wrap:wrap;align-items:flex-end;"></div>
      <button class="btn btn-primary" id="fv-download-all" style="margin-top:16px">Download All (ZIP)</button>
    </div>
  `;

  const sizes = [16, 32, 48, 64, 128, 180, 192, 512];

  createFileDropZone(document.getElementById('fv-drop'), {
    accept: 'image/*', icon: '⭐',
    text: 'Drop an image or <strong>click to browse</strong>',
    onFile: file => {
      const r = new FileReader();
      r.onload = e => {
        img = new Image();
        img.onload = () => generateFavicons();
        img.src = e.target.result;
      };
      r.readAsDataURL(file);
    }
  });

  function generateFavicons() {
    const div = document.getElementById('fv-sizes');
    div.innerHTML = '';
    sizes.forEach(size => {
      const c = document.createElement('canvas');
      c.width = size; c.height = size;
      const ctx = c.getContext('2d');
      ctx.drawImage(img, 0, 0, size, size);
      const wrapper = document.createElement('div');
      wrapper.style.cssText = 'text-align:center;';
      const preview = document.createElement('canvas');
      const displaySize = Math.min(size, 80);
      preview.width = displaySize; preview.height = displaySize;
      preview.getContext('2d').drawImage(c, 0, 0, displaySize, displaySize);
      preview.style.cssText = 'border:1px solid var(--border-primary);border-radius:8px;background:var(--bg-glass);';
      const label = document.createElement('div');
      label.textContent = `${size}×${size}`;
      label.style.cssText = 'font-size:11px;color:var(--text-tertiary);margin-top:4px;font-family:var(--font-mono);';
      const btn = document.createElement('button');
      btn.className = 'btn btn-ghost btn-sm';
      btn.textContent = 'Download';
      btn.style.cssText = 'margin-top:4px;font-size:10px;';
      btn.addEventListener('click', () => {
        c.toBlob(b => downloadBlob(b, `favicon-${size}x${size}.png`), 'image/png');
      });
      wrapper.appendChild(preview);
      wrapper.appendChild(label);
      wrapper.appendChild(btn);
      div.appendChild(wrapper);
    });
    document.getElementById('fv-result').style.display = 'block';

    document.getElementById('fv-download-all').addEventListener('click', () => {
      sizes.forEach(size => {
        const c = document.createElement('canvas');
        c.width = size; c.height = size;
        c.getContext('2d').drawImage(img, 0, 0, size, size);
        c.toBlob(b => downloadBlob(b, `favicon-${size}x${size}.png`), 'image/png');
      });
    });
  }
}
