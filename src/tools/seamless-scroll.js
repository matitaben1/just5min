import { createFileDropZone, downloadBlob } from '../utils.js';

export function render(container) {
  let img = null;
  container.innerHTML = `
    <div class="tool-section">
      <div class="tool-section-title">Upload Image</div>
      <div id="ss-drop"></div>
    </div>
    <div class="tool-section" id="ss-settings" style="display:none;">
      <div class="tool-section-title">Split Settings</div>
      <div class="input-group" style="max-width:300px;">
        <label>Number of slides</label>
        <input type="number" id="ss-count" value="3" min="2" max="10" />
      </div>
      <button class="btn btn-primary" id="ss-split" style="margin-top:16px">Split</button>
    </div>
    <div class="tool-section" id="ss-result" style="display:none;">
      <div class="tool-section-title">Slides</div>
      <div id="ss-slides" style="display:flex;gap:8px;flex-wrap:wrap;"></div>
      <button class="btn btn-primary" id="ss-download-all" style="margin-top:16px">Download All</button>
    </div>
  `;

  createFileDropZone(document.getElementById('ss-drop'), {
    accept: 'image/*', icon: '📜',
    text: 'Drop a wide image or <strong>click to browse</strong>',
    onFile: file => {
      const r = new FileReader();
      r.onload = e => {
        img = new Image();
        img.onload = () => document.getElementById('ss-settings').style.display = 'block';
        img.src = e.target.result;
      };
      r.readAsDataURL(file);
    }
  });

  document.getElementById('ss-split').addEventListener('click', () => {
    if (!img) return;
    const count = parseInt(document.getElementById('ss-count').value);
    const slideW = Math.floor(img.width / count);
    const slides = document.getElementById('ss-slides');
    slides.innerHTML = '';
    const canvases = [];

    for (let i = 0; i < count; i++) {
      const c = document.createElement('canvas');
      c.width = slideW;
      c.height = img.height;
      const ctx = c.getContext('2d');
      ctx.drawImage(img, i * slideW, 0, slideW, img.height, 0, 0, slideW, img.height);
      const wrapper = document.createElement('div');
      wrapper.style.cssText = 'border:1px solid var(--border-primary);border-radius:8px;overflow:hidden;';
      wrapper.innerHTML = `<div style="padding:4px 8px;font-size:11px;color:var(--text-tertiary);text-align:center;">Slide ${i + 1}</div>`;
      c.style.cssText = 'max-width:200px; display:block;';
      wrapper.appendChild(c);
      slides.appendChild(wrapper);
      canvases.push(c);
    }

    document.getElementById('ss-result').style.display = 'block';

    document.getElementById('ss-download-all').onclick = () => {
      canvases.forEach((c, i) => {
        c.toBlob(b => downloadBlob(b, `slide-${i + 1}.png`), 'image/png');
      });
    };
  });
}
