import { showToast, downloadBlob, createFileDropZone } from '../utils.js';

export function render(container) {
  container.innerHTML = `
    <div class="tool-section">
      <div class="tool-section-title">Upload Image</div>
      <div id="bgr-drop"></div>
    </div>
    <div class="tool-section">
      <div class="tool-section-title">Settings</div>
      <div class="controls-grid">
        <div class="input-group">
          <label>Tolerance: <span id="bgr-tol-val">30</span></label>
          <input type="range" id="bgr-tolerance" min="1" max="100" value="30" />
        </div>
        <div class="input-group">
          <label>Sample From</label>
          <select id="bgr-corner">
            <option value="tl">Top-Left Corner</option>
            <option value="tr">Top-Right Corner</option>
            <option value="bl">Bottom-Left Corner</option>
            <option value="br">Bottom-Right Corner</option>
          </select>
        </div>
        <div class="input-group">
          <label>Edge Softness: <span id="bgr-soft-val">1</span>px</label>
          <input type="range" id="bgr-softness" min="0" max="5" value="1" />
        </div>
      </div>
      <p style="font-size:11px;color:var(--text-muted);margin-top:8px;">This tool samples the background color from the selected corner and removes similar colors. Works best with solid-color backgrounds. For complex backgrounds, adjust tolerance.</p>
    </div>
    <div class="tool-section" id="bgr-result-section" style="display:none;">
      <div class="tool-section-title">Result</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
        <div style="text-align:center;">
          <div style="font-size:11px;color:var(--text-tertiary);margin-bottom:4px;">Original</div>
          <canvas id="bgr-original" style="max-width:100%;border:1px solid var(--border-primary);border-radius:8px;"></canvas>
        </div>
        <div style="text-align:center;">
          <div style="font-size:11px;color:var(--text-tertiary);margin-bottom:4px;">Background Removed</div>
          <div style="background:repeating-conic-gradient(#e5e5e5 0% 25%, #fff 0% 50%) 50%/16px 16px;border-radius:8px;border:1px solid var(--border-primary);overflow:hidden;">
            <canvas id="bgr-result" style="max-width:100%;display:block;"></canvas>
          </div>
        </div>
      </div>
      <div style="display:flex;gap:8px;margin-top:12px;">
        <button class="btn btn-primary" id="bgr-download">Download PNG (transparent)</button>
        <button class="btn btn-secondary" id="bgr-reprocess">Reprocess</button>
      </div>
    </div>
  `;

  let sourceImg = null;

  const tolSlider = document.getElementById('bgr-tolerance');
  const softSlider = document.getElementById('bgr-softness');
  const cornerSel = document.getElementById('bgr-corner');

  tolSlider.addEventListener('input', () => {
    document.getElementById('bgr-tol-val').textContent = tolSlider.value;
  });
  softSlider.addEventListener('input', () => {
    document.getElementById('bgr-soft-val').textContent = softSlider.value;
  });

  createFileDropZone(document.getElementById('bgr-drop'), {
    accept: 'image/*', icon: '◌',
    text: 'Drop an image or <strong>click to upload</strong>',
    onFile: file => {
      const r = new FileReader();
      r.onload = e => {
        sourceImg = new Image();
        sourceImg.onload = () => processImage();
        sourceImg.src = e.target.result;
      };
      r.readAsDataURL(file);
    }
  });

  function getSampleColor(imgData, w, h, corner) {
    // Sample a 5x5 area from the selected corner
    let sx, sy;
    if (corner === 'tl') { sx = 0; sy = 0; }
    else if (corner === 'tr') { sx = w - 5; sy = 0; }
    else if (corner === 'bl') { sx = 0; sy = h - 5; }
    else { sx = w - 5; sy = h - 5; }

    let rSum = 0, gSum = 0, bSum = 0, count = 0;
    for (let y = sy; y < sy + 5 && y < h; y++) {
      for (let x = sx; x < sx + 5 && x < w; x++) {
        const i = (y * w + x) * 4;
        rSum += imgData[i];
        gSum += imgData[i + 1];
        bSum += imgData[i + 2];
        count++;
      }
    }
    return {
      r: Math.round(rSum / count),
      g: Math.round(gSum / count),
      b: Math.round(bSum / count),
    };
  }

  function colorDistance(r1, g1, b1, r2, g2, b2) {
    return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2);
  }

  function processImage() {
    if (!sourceImg) return;
    const w = sourceImg.width;
    const h = sourceImg.height;

    // Draw original
    const origCanvas = document.getElementById('bgr-original');
    origCanvas.width = w;
    origCanvas.height = h;
    origCanvas.getContext('2d').drawImage(sourceImg, 0, 0);

    // Process
    const resultCanvas = document.getElementById('bgr-result');
    resultCanvas.width = w;
    resultCanvas.height = h;
    const ctx = resultCanvas.getContext('2d');
    ctx.drawImage(sourceImg, 0, 0);

    const imageData = ctx.getImageData(0, 0, w, h);
    const data = imageData.data;
    const tolerance = parseInt(tolSlider.value) * 2.55; // map 0-100 to 0-255 range roughly
    const softness = parseInt(softSlider.value);
    const corner = cornerSel.value;

    const bgColor = getSampleColor(data, w, h, corner);

    // First pass: flood fill from edges using BFS
    const visited = new Uint8Array(w * h);
    const isBackground = new Uint8Array(w * h);
    const queue = [];

    // Add edge pixels to queue
    for (let x = 0; x < w; x++) {
      queue.push(x); // top row
      queue.push((h - 1) * w + x); // bottom row
    }
    for (let y = 0; y < h; y++) {
      queue.push(y * w); // left col
      queue.push(y * w + (w - 1)); // right col
    }

    // BFS flood fill from edges
    let qi = 0;
    while (qi < queue.length) {
      const idx = queue[qi++];
      if (idx < 0 || idx >= w * h) continue;
      if (visited[idx]) continue;
      visited[idx] = 1;

      const i = idx * 4;
      const dist = colorDistance(data[i], data[i + 1], data[i + 2], bgColor.r, bgColor.g, bgColor.b);

      if (dist <= tolerance) {
        isBackground[idx] = 1;
        const x = idx % w;
        const y = Math.floor(idx / w);
        // Add neighbors
        if (x > 0) queue.push(idx - 1);
        if (x < w - 1) queue.push(idx + 1);
        if (y > 0) queue.push(idx - w);
        if (y < h - 1) queue.push(idx + w);
      }
    }

    // Apply transparency
    for (let i = 0; i < w * h; i++) {
      if (isBackground[i]) {
        data[i * 4 + 3] = 0; // fully transparent
      }
    }

    // Edge softness (simple alpha feathering)
    if (softness > 0) {
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const idx = y * w + x;
          if (!isBackground[idx]) {
            // Check if near a background pixel
            let minDist = softness + 1;
            for (let dy = -softness; dy <= softness; dy++) {
              for (let dx = -softness; dx <= softness; dx++) {
                const nx = x + dx, ny = y + dy;
                if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
                  if (isBackground[ny * w + nx]) {
                    const d = Math.sqrt(dx * dx + dy * dy);
                    minDist = Math.min(minDist, d);
                  }
                }
              }
            }
            if (minDist <= softness) {
              const alpha = Math.round((minDist / softness) * 255);
              data[idx * 4 + 3] = Math.min(data[idx * 4 + 3], alpha);
            }
          }
        }
      }
    }

    ctx.putImageData(imageData, 0, 0);
    document.getElementById('bgr-result-section').style.display = '';
    showToast('Background removed!');
  }

  document.getElementById('bgr-reprocess').addEventListener('click', processImage);
  document.getElementById('bgr-download').addEventListener('click', () => {
    document.getElementById('bgr-result').toBlob(b => downloadBlob(b, 'bg-removed.png'), 'image/png');
  });
}
