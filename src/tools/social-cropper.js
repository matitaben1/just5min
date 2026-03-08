import { createFileDropZone, downloadBlob } from '../utils.js';

const PLATFORMS = {
  'ig-square': { name: 'Instagram Square', w: 1080, h: 1080 },
  'ig-portrait': { name: 'Instagram Portrait', w: 1080, h: 1350 },
  'ig-landscape': { name: 'Instagram Landscape', w: 1080, h: 608 },
  'ig-story': { name: 'Instagram Story', w: 1080, h: 1920 },
  'twitter': { name: 'Twitter / X', w: 1200, h: 675 },
  'facebook': { name: 'Facebook Post', w: 1200, h: 630 },
  'youtube': { name: 'YouTube Thumbnail', w: 1280, h: 720 },
  'linkedin': { name: 'LinkedIn Post', w: 1200, h: 627 },
  'threads': { name: 'Threads', w: 1080, h: 1080 },
  'bluesky': { name: 'Bluesky', w: 1200, h: 675 },
};

export function render(container) {
  let img = null;
  container.innerHTML = `
    <div class="tool-section">
      <div class="tool-section-title">Upload Image</div>
      <div id="sc-drop"></div>
    </div>
    <div class="tool-section" id="sc-options" style="display:none;">
      <div class="tool-section-title">Select Platform</div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:8px;">
        ${Object.entries(PLATFORMS).map(([k, v]) => `
          <button class="btn btn-secondary sc-platform" data-key="${k}" style="justify-content:flex-start;">
            ${v.name}<span style="color:var(--text-tertiary);margin-left:auto;font-size:11px;">${v.w}×${v.h}</span>
          </button>
        `).join('')}
      </div>
    </div>
    <div class="tool-section" id="sc-result" style="display:none;">
      <div class="tool-section-title">Result</div>
      <div class="preview-area"><canvas id="sc-canvas"></canvas></div>
      <button class="btn btn-primary" id="sc-download" style="margin-top:16px">Download</button>
    </div>
  `;

  createFileDropZone(document.getElementById('sc-drop'), {
    accept: 'image/*',
    icon: '📐',
    text: 'Drop an image to crop or <strong>click to browse</strong>',
    onFile: (file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        img = new Image();
        img.onload = () => document.getElementById('sc-options').style.display = 'block';
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

  container.addEventListener('click', (e) => {
    const btn = e.target.closest('.sc-platform');
    if (!btn || !img) return;
    const platform = PLATFORMS[btn.dataset.key];
    const canvas = document.getElementById('sc-canvas');
    canvas.width = platform.w;
    canvas.height = platform.h;
    const ctx = canvas.getContext('2d');

    // Cover crop
    const scale = Math.max(platform.w / img.width, platform.h / img.height);
    const sw = platform.w / scale, sh = platform.h / scale;
    const sx = (img.width - sw) / 2, sy = (img.height - sh) / 2;
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, platform.w, platform.h);
    document.getElementById('sc-result').style.display = 'block';
  });

  document.getElementById('sc-download').addEventListener('click', () => {
    const canvas = document.getElementById('sc-canvas');
    canvas.toBlob(blob => downloadBlob(blob, 'cropped.png'), 'image/png');
  });
}
