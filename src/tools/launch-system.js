import { showToast, copyToClipboard, downloadBlob, downloadDataURL, createFileDropZone, debounce, hexToRgb, rgbToHex, rgbToHsl, hslToRgb, getTextColor } from '../utils.js';
import QRCode from 'qrcode';

export function render(container) {
  container.innerHTML = `
    <div class="launch-hero">
      <h1>Launch Token Bags System</h1>
      <p>All-in-one toolkit to prepare your token launch. Complete each section below.</p>
    </div>

    <!-- Step 1: Branding -->
    <div class="launch-step">
      <div class="launch-step-header">
        <span class="launch-step-num">01</span>
        <div>
          <h2>Branding & Colors</h2>
          <p>Pick your brand color and generate a full palette for your token.</p>
        </div>
      </div>
      <div class="launch-step-body">
        <div class="controls-grid">
          <div class="input-group">
            <label>Brand Color</label>
            <div style="display:flex;gap:8px;align-items:center;">
              <input type="color" id="ls-brand-color" value="#b45309" />
              <input type="text" id="ls-brand-hex" value="#b45309" style="max-width:120px;" />
            </div>
          </div>
          <div class="input-group">
            <label>Token Name</label>
            <input type="text" id="ls-token-name" value="MyToken" placeholder="e.g. BAGS" />
          </div>
          <div class="input-group">
            <label>Token Ticker</label>
            <input type="text" id="ls-ticker" value="$MTK" placeholder="e.g. $BAGS" />
          </div>
        </div>
        <div style="display:flex;gap:8px;align-items:center;margin-top:12px;">
          <button class="btn btn-secondary" id="ls-randomize">↻ Randomize palette</button>
        </div>
        <div id="ls-palette" style="display:flex;gap:4px;margin-top:12px;height:80px;border-radius:8px;overflow:hidden;"></div>
      </div>
    </div>

    <!-- Step 2: Logo / Image Upload -->
    <div class="launch-step">
      <div class="launch-step-header">
        <span class="launch-step-num">02</span>
        <div>
          <h2>Logo & Image</h2>
          <p>Upload your token logo. We'll generate favicons, social-ready versions, and QR codes from it.</p>
        </div>
      </div>
      <div class="launch-step-body">
        <div id="ls-logo-drop"></div>
        <div id="ls-logo-preview" style="display:none;margin-top:16px;">
          <div style="display:flex;gap:16px;align-items:flex-start;flex-wrap:wrap;">
            <div style="text-align:center;">
              <canvas id="ls-logo-canvas" style="max-width:200px;max-height:200px;border:1px solid var(--border-primary);border-radius:8px;"></canvas>
              <div style="font-size:11px;color:var(--text-tertiary);margin-top:4px;">Original</div>
            </div>
            <div id="ls-favicon-sizes" style="display:flex;gap:12px;flex-wrap:wrap;align-items:flex-end;"></div>
          </div>
          <button class="btn btn-primary" id="ls-download-favicons" style="margin-top:12px;">Download All Favicons</button>
        </div>
      </div>
    </div>

    <!-- Step 3: QR Code -->
    <div class="launch-step">
      <div class="launch-step-header">
        <span class="launch-step-num">03</span>
        <div>
          <h2>QR Code</h2>
          <p>Generate a branded QR code for your token link, contract, or website.</p>
        </div>
      </div>
      <div class="launch-step-body">
        <div class="tool-row">
          <div>
            <div class="input-group" style="margin-bottom:12px;">
              <label>URL / Content</label>
              <input type="text" id="ls-qr-text" value="https://bags.fm" placeholder="https://bags.fm/your-token" />
            </div>
            <div class="controls-grid">
              <div class="input-group">
                <label>Size</label>
                <input type="number" id="ls-qr-size" value="300" min="100" max="1000" />
              </div>
              <div class="input-group">
                <label>Error Correction</label>
                <select id="ls-qr-ec">
                  <option value="M">Medium (15%)</option>
                  <option value="L">Low (7%)</option>
                  <option value="Q">Quartile (25%)</option>
                  <option value="H">High (30%)</option>
                </select>
              </div>
            </div>
            <div style="display:flex;gap:8px;margin-top:12px;">
              <button class="btn btn-primary" id="ls-qr-download">Download PNG</button>
            </div>
          </div>
          <div class="preview-area" style="min-height:200px;">
            <canvas id="ls-qr-canvas"></canvas>
          </div>
        </div>
      </div>
    </div>

    <!-- Step 4: Banner Generator -->
    <div class="launch-step">
      <div class="launch-step-header">
        <span class="launch-step-num">04</span>
        <div>
          <h2>Banner Generator</h2>
          <p>Create branded banners for social media platforms using your logo.</p>
        </div>
      </div>
      <div class="launch-step-body">
        <div class="controls-grid">
          <div class="input-group">
            <label>Preset Size</label>
            <select id="ls-ban-preset">
              <option value="twitter">Twitter / X Banner (1500×500)</option>
              <option value="youtube">YouTube Banner (2560×1440)</option>
              <option value="facebook">Facebook Cover (820×312)</option>
              <option value="linkedin">LinkedIn Cover (1584×396)</option>
              <option value="og">Open Graph (1200×630)</option>
              <option value="instagram">Instagram Post (1080×1080)</option>
            </select>
          </div>
          <div class="input-group">
            <label>Background Color</label>
            <div style="display:flex;gap:8px;align-items:center;">
              <input type="color" id="ls-ban-color1" value="#1c1917" />
              <input type="text" id="ls-ban-color1-hex" value="#1c1917" style="max-width:100px;" />
            </div>
          </div>
          <div class="input-group">
            <label>Background Style</label>
            <select id="ls-ban-style">
              <option value="solid">Solid Color</option>
              <option value="gradient-h">Gradient (Horizontal)</option>
              <option value="gradient-v">Gradient (Vertical)</option>
              <option value="gradient-r">Gradient (Radial)</option>
            </select>
          </div>
          <div class="input-group">
            <label>Second Color</label>
            <div style="display:flex;gap:8px;align-items:center;">
              <input type="color" id="ls-ban-color2" value="#f59e0b" />
              <input type="text" id="ls-ban-color2-hex" value="#f59e0b" style="max-width:100px;" />
            </div>
          </div>
          <div class="input-group">
            <label>Logo Scale: <span id="ls-ban-scale-val">40</span>%</label>
            <input type="range" id="ls-ban-scale" min="10" max="90" value="40" />
          </div>
          <div class="input-group">
            <label>Logo Position</label>
            <select id="ls-ban-position">
              <option value="center">Center</option>
              <option value="left">Left</option>
              <option value="right">Right</option>
            </select>
          </div>
          <div class="input-group">
            <label>Show Token Name</label>
            <select id="ls-ban-showtext">
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
          <div class="input-group">
            <label>Text Color</label>
            <input type="color" id="ls-ban-textcolor" value="#ffffff" />
          </div>
          <div class="input-group">
            <label>Text Size: <span id="ls-ban-textsize-val">48</span>px</label>
            <input type="range" id="ls-ban-textsize" min="16" max="120" value="48" />
          </div>
        </div>
        <div class="preview-area" style="margin-top:16px;overflow:auto;">
          <canvas id="ls-ban-canvas" style="max-width:100%;border-radius:8px;"></canvas>
        </div>
        <p id="ls-ban-hint" style="font-size:12px;color:var(--text-tertiary);margin-top:8px;">Uses your brand color from step 01 and logo from step 02.</p>
        <div style="display:flex;gap:8px;margin-top:8px;">
          <button class="btn btn-primary" id="ls-ban-download">Download PNG</button>
          <button class="btn btn-secondary" id="ls-ban-download-jpg">Download JPG</button>
        </div>
      </div>
    </div>

    <!-- Step 5: Social Media Assets -->
    <div class="launch-step">
      <div class="launch-step-header">
        <span class="launch-step-num">05</span>
        <div>
          <h2>Social Media Assets</h2>
          <p>Generate profile pictures and banners sized for every platform.</p>
        </div>
      </div>
      <div class="launch-step-body">
        <div id="ls-social-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px;"></div>
        <p id="ls-social-hint" style="font-size:12px;color:var(--text-tertiary);margin-top:8px;">Upload a logo in step 02 first to generate social assets.</p>
      </div>
    </div>

    <!-- Step 5: Watermarked Version -->
    <div class="launch-step">
      <div class="launch-step-header">
        <span class="launch-step-num">06</span>
        <div>
          <h2>Watermarked Images</h2>
          <p>Add your token ticker as a watermark to protect your images.</p>
        </div>
      </div>
      <div class="launch-step-body">
        <div class="controls-grid" style="margin-bottom:16px;">
          <div class="input-group">
            <label>Watermark Text</label>
            <input type="text" id="ls-wm-text" value="$MTK" />
          </div>
          <div class="input-group">
            <label>Opacity: <span id="ls-wm-op-val">30</span>%</label>
            <input type="range" id="ls-wm-opacity" min="10" max="80" value="30" />
          </div>
          <div class="input-group">
            <label>Font Size</label>
            <input type="number" id="ls-wm-size" value="24" min="10" max="100" />
          </div>
        </div>
        <div class="preview-area" style="min-height:150px;">
          <canvas id="ls-wm-canvas"></canvas>
        </div>
        <button class="btn btn-primary" id="ls-wm-download" style="margin-top:12px;">Download Watermarked</button>
      </div>
    </div>

    <!-- Step 6: Meta Tags -->
    <div class="launch-step">
      <div class="launch-step-header">
        <span class="launch-step-num">07</span>
        <div>
          <h2>Website Meta Tags</h2>
          <p>Generate SEO and Open Graph meta tags for your token's landing page.</p>
        </div>
      </div>
      <div class="launch-step-body">
        <div class="controls-grid">
          <div class="input-group">
            <label>Page Title</label>
            <input type="text" id="ls-meta-title" value="" placeholder="MyToken — The Next Big Thing" />
          </div>
          <div class="input-group">
            <label>Description</label>
            <input type="text" id="ls-meta-desc" value="" placeholder="Launch your token on Bags..." />
          </div>
          <div class="input-group">
            <label>Website URL</label>
            <input type="url" id="ls-meta-url" value="" placeholder="https://mytoken.com" />
          </div>
          <div class="input-group">
            <label>OG Image URL</label>
            <input type="url" id="ls-meta-image" value="" placeholder="https://mytoken.com/og.jpg" />
          </div>
        </div>
        <pre id="ls-meta-output" class="output-area" style="white-space:pre-wrap;font-size:11px;max-height:300px;overflow:auto;margin-top:12px;"></pre>
        <button class="btn btn-primary" id="ls-meta-copy" style="margin-top:8px;">Copy HTML</button>
      </div>
    </div>
  `;

  // ─── State ───
  let logoImg = null;
  const brandColor = document.getElementById('ls-brand-color');
  const brandHex = document.getElementById('ls-brand-hex');
  const tokenName = document.getElementById('ls-token-name');
  const ticker = document.getElementById('ls-ticker');

  // ─── Step 1: Branding ───
  function randomHue() { return Math.floor(Math.random() * 360); }

  function generateRandomPalette() {
    const baseHue = randomHue();
    const modes = ['analogous', 'triadic', 'complementary', 'split'];
    const mode = modes[Math.floor(Math.random() * modes.length)];
    let hues;
    if (mode === 'analogous') {
      hues = [baseHue, (baseHue + 30) % 360, (baseHue + 60) % 360, (baseHue - 30 + 360) % 360, (baseHue + 15) % 360];
    } else if (mode === 'triadic') {
      hues = [baseHue, (baseHue + 120) % 360, (baseHue + 240) % 360, (baseHue + 60) % 360, (baseHue + 180) % 360];
    } else if (mode === 'complementary') {
      hues = [baseHue, baseHue, (baseHue + 180) % 360, (baseHue + 180) % 360, (baseHue + 90) % 360];
    } else {
      hues = [baseHue, (baseHue + 150) % 360, (baseHue + 210) % 360, (baseHue + 30) % 360, (baseHue + 330) % 360];
    }

    const paletteDiv = document.getElementById('ls-palette');
    paletteDiv.innerHTML = '';
    const colors = hues.map((h, i) => {
      const s = 50 + Math.random() * 35;
      const l = 40 + Math.random() * 35;
      const rgb = hslToRgb(h, s, l);
      return rgbToHex(rgb.r, rgb.g, rgb.b);
    });

    colors.forEach(hex => {
      const swatch = document.createElement('div');
      swatch.style.cssText = `flex:1;background:${hex};cursor:pointer;display:flex;align-items:flex-end;justify-content:center;padding-bottom:6px;`;
      const label = document.createElement('span');
      label.textContent = hex;
      label.style.cssText = `font-size:10px;font-family:var(--font-mono);color:${getTextColor(hex)};opacity:0.8;`;
      swatch.appendChild(label);
      swatch.addEventListener('click', () => copyToClipboard(hex));
      paletteDiv.appendChild(swatch);
    });

    // Set brand color to first color
    brandColor.value = colors[0];
    brandHex.value = colors[0];

    // Sync watermark text
    document.getElementById('ls-wm-text').value = ticker.value || '$MTK';
    // Sync meta title
    if (!document.getElementById('ls-meta-title').value) {
      document.getElementById('ls-meta-title').value = `${tokenName.value} — Launch on Bags`;
    }
  }

  function generatePalette() {
    const hex = brandColor.value;
    const rgb = hexToRgb(hex);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const lightnesses = [95, 82, 65, 50, 35, 20];
    const paletteDiv = document.getElementById('ls-palette');
    paletteDiv.innerHTML = '';
    lightnesses.forEach(l => {
      const c = hslToRgb(hsl.h, hsl.s, l);
      const h = rgbToHex(c.r, c.g, c.b);
      const swatch = document.createElement('div');
      swatch.style.cssText = `flex:1;background:${h};cursor:pointer;display:flex;align-items:flex-end;justify-content:center;padding-bottom:6px;`;
      const label = document.createElement('span');
      label.textContent = h;
      label.style.cssText = `font-size:10px;font-family:var(--font-mono);color:${getTextColor(h)};opacity:0.8;`;
      swatch.appendChild(label);
      swatch.addEventListener('click', () => copyToClipboard(h));
      paletteDiv.appendChild(swatch);
    });
    document.getElementById('ls-wm-text').value = ticker.value || '$MTK';
  }

  document.getElementById('ls-randomize').addEventListener('click', () => { generateRandomPalette(); updateQR(); });
  brandColor.addEventListener('input', () => { brandHex.value = brandColor.value; generatePalette(); updateQR(); });
  brandHex.addEventListener('input', () => { brandColor.value = brandHex.value; generatePalette(); updateQR(); });
  ticker.addEventListener('input', () => { document.getElementById('ls-wm-text').value = ticker.value; });
  tokenName.addEventListener('input', () => {});
  // Auto-generate random palette on load
  generateRandomPalette();

  // ─── Step 2: Logo Upload ───
  createFileDropZone(document.getElementById('ls-logo-drop'), {
    accept: 'image/*', icon: '◇',
    text: 'Drop your logo or <strong>click to upload</strong>',
    onFile: file => {
      const r = new FileReader();
      r.onload = e => {
        logoImg = new Image();
        logoImg.onload = () => {
          showLogoPreview();
          renderBanner();
          generateSocialAssets();
          generateWatermark();
          updateQR();
        };
        logoImg.src = e.target.result;
      };
      r.readAsDataURL(file);
    }
  });

  function showLogoPreview() {
    const canvas = document.getElementById('ls-logo-canvas');
    const size = Math.min(logoImg.width, logoImg.height, 200);
    canvas.width = size; canvas.height = size;
    canvas.getContext('2d').drawImage(logoImg, 0, 0, size, size);
    document.getElementById('ls-logo-preview').style.display = 'block';

    // Favicon sizes
    const sizes = [16, 32, 48, 64, 128, 192];
    const container = document.getElementById('ls-favicon-sizes');
    container.innerHTML = '';
    sizes.forEach(s => {
      const c = document.createElement('canvas');
      c.width = s; c.height = s;
      c.getContext('2d').drawImage(logoImg, 0, 0, s, s);
      const wrapper = document.createElement('div');
      wrapper.style.cssText = 'text-align:center;';
      const preview = document.createElement('canvas');
      const ds = Math.min(s, 48);
      preview.width = ds; preview.height = ds;
      preview.getContext('2d').drawImage(c, 0, 0, ds, ds);
      preview.style.cssText = 'border:1px solid var(--border-primary);border-radius:4px;';
      const label = document.createElement('div');
      label.textContent = `${s}px`;
      label.style.cssText = 'font-size:10px;color:var(--text-tertiary);margin-top:2px;';
      wrapper.appendChild(preview);
      wrapper.appendChild(label);
      container.appendChild(wrapper);
    });

    document.getElementById('ls-download-favicons').onclick = () => {
      sizes.forEach(s => {
        const c = document.createElement('canvas');
        c.width = s; c.height = s;
        c.getContext('2d').drawImage(logoImg, 0, 0, s, s);
        c.toBlob(b => downloadBlob(b, `favicon-${s}x${s}.png`), 'image/png');
      });
    };
  }

  // ─── Step 3: QR Code ───
  async function updateQR() {
    const text = document.getElementById('ls-qr-text').value || 'https://bags.fm';
    const size = parseInt(document.getElementById('ls-qr-size').value) || 300;
    const ec = document.getElementById('ls-qr-ec').value;
    const fg = brandColor.value;
    try {
      await QRCode.toCanvas(document.getElementById('ls-qr-canvas'), text, {
        width: size, margin: 2,
        errorCorrectionLevel: ec,
        color: { dark: fg, light: '#fdfcf0' },
      });
    } catch (e) { console.error(e); }
  }

  document.getElementById('ls-qr-text').addEventListener('input', debounce(updateQR, 300));
  document.getElementById('ls-qr-size').addEventListener('input', updateQR);
  document.getElementById('ls-qr-ec').addEventListener('change', updateQR);
  document.getElementById('ls-qr-download').addEventListener('click', () => {
    const c = document.getElementById('ls-qr-canvas');
    c.toBlob(b => downloadBlob(b, `${tokenName.value || 'token'}-qr.png`), 'image/png');
  });
  updateQR();

  // ─── Step 4: Banner Generator ───
  const banPresets = {
    twitter: [1500, 500], youtube: [2560, 1440], facebook: [820, 312],
    linkedin: [1584, 396], og: [1200, 630], instagram: [1080, 1080],
  };

  function renderBanner() {
    const preset = document.getElementById('ls-ban-preset').value;
    const [w, h] = banPresets[preset] || [1500, 500];
    const banCanvas = document.getElementById('ls-ban-canvas');
    banCanvas.width = w;
    banCanvas.height = h;
    const ctx = banCanvas.getContext('2d');

    const style = document.getElementById('ls-ban-style').value;
    const c1 = document.getElementById('ls-ban-color1').value;
    const c2 = document.getElementById('ls-ban-color2').value;

    // Background
    if (style === 'solid') {
      ctx.fillStyle = c1;
      ctx.fillRect(0, 0, w, h);
    } else {
      let grad;
      if (style === 'gradient-h') grad = ctx.createLinearGradient(0, 0, w, 0);
      else if (style === 'gradient-v') grad = ctx.createLinearGradient(0, 0, 0, h);
      else grad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) / 2);
      grad.addColorStop(0, c1);
      grad.addColorStop(1, c2);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    }

    // Logo
    if (logoImg) {
      const scale = parseInt(document.getElementById('ls-ban-scale').value) / 100;
      const logoH = h * scale;
      const logoW = (logoImg.width / logoImg.height) * logoH;
      const pos = document.getElementById('ls-ban-position').value;
      let x;
      if (pos === 'center') x = (w - logoW) / 2;
      else if (pos === 'left') x = w * 0.05;
      else x = w - logoW - w * 0.05;

      const showText = document.getElementById('ls-ban-showtext').value === 'yes';
      const textVal = showText ? (tokenName.value || '') : '';

      if (textVal && pos === 'center') {
        const y = (h - logoH) / 2 - h * 0.05;
        ctx.drawImage(logoImg, x, Math.max(y, h * 0.02), logoW, logoH);
      } else {
        ctx.drawImage(logoImg, x, (h - logoH) / 2, logoW, logoH);
      }

      // Text
      if (textVal) {
        const fontSize = parseInt(document.getElementById('ls-ban-textsize').value) || 48;
        ctx.font = `700 ${fontSize}px "JetBrains Mono", monospace`;
        ctx.fillStyle = document.getElementById('ls-ban-textcolor').value;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        if (pos === 'center') {
          ctx.fillText(textVal, w / 2, h / 2 + logoH / 2 + fontSize * 0.6);
        } else if (pos === 'left') {
          ctx.textAlign = 'left';
          ctx.fillText(textVal, w * 0.05 + logoW + w * 0.03, h / 2);
        } else {
          ctx.textAlign = 'right';
          ctx.fillText(textVal, w - w * 0.05 - logoW - w * 0.03, h / 2);
        }
      }
    }
    document.getElementById('ls-ban-hint').style.display = logoImg ? 'none' : '';
  }

  // Banner event listeners
  ['ls-ban-preset', 'ls-ban-style', 'ls-ban-position', 'ls-ban-showtext'].forEach(id => {
    document.getElementById(id).addEventListener('change', renderBanner);
  });
  document.getElementById('ls-ban-color1').addEventListener('input', () => {
    document.getElementById('ls-ban-color1-hex').value = document.getElementById('ls-ban-color1').value;
    renderBanner();
  });
  document.getElementById('ls-ban-color1-hex').addEventListener('input', () => {
    document.getElementById('ls-ban-color1').value = document.getElementById('ls-ban-color1-hex').value;
    renderBanner();
  });
  document.getElementById('ls-ban-color2').addEventListener('input', () => {
    document.getElementById('ls-ban-color2-hex').value = document.getElementById('ls-ban-color2').value;
    renderBanner();
  });
  document.getElementById('ls-ban-color2-hex').addEventListener('input', () => {
    document.getElementById('ls-ban-color2').value = document.getElementById('ls-ban-color2-hex').value;
    renderBanner();
  });
  document.getElementById('ls-ban-scale').addEventListener('input', () => {
    document.getElementById('ls-ban-scale-val').textContent = document.getElementById('ls-ban-scale').value;
    renderBanner();
  });
  document.getElementById('ls-ban-textsize').addEventListener('input', () => {
    document.getElementById('ls-ban-textsize-val').textContent = document.getElementById('ls-ban-textsize').value;
    renderBanner();
  });
  document.getElementById('ls-ban-textcolor').addEventListener('input', renderBanner);
  document.getElementById('ls-ban-download').addEventListener('click', () => {
    document.getElementById('ls-ban-canvas').toBlob(b => downloadBlob(b, `${tokenName.value || 'token'}-banner.png`), 'image/png');
  });
  document.getElementById('ls-ban-download-jpg').addEventListener('click', () => {
    document.getElementById('ls-ban-canvas').toBlob(b => downloadBlob(b, `${tokenName.value || 'token'}-banner.jpg`), 'image/jpeg', 0.92);
  });
  renderBanner();

  // ─── Step 5: Social Media Assets ───
  const socialSizes = [
    { name: 'Profile (Square)', w: 400, h: 400 },
    { name: 'Twitter Banner', w: 1500, h: 500 },
    { name: 'OG Image', w: 1200, h: 630 },
    { name: 'Instagram Post', w: 1080, h: 1080 },
    { name: 'Facebook Cover', w: 820, h: 312 },
    { name: 'YouTube Thumb', w: 1280, h: 720 },
  ];

  function generateSocialAssets() {
    if (!logoImg) return;
    const grid = document.getElementById('ls-social-grid');
    document.getElementById('ls-social-hint').style.display = 'none';
    grid.innerHTML = '';

    socialSizes.forEach(s => {
      const c = document.createElement('canvas');
      c.width = s.w; c.height = s.h;
      const ctx = c.getContext('2d');
      // Brand color bg
      ctx.fillStyle = brandColor.value;
      ctx.fillRect(0, 0, s.w, s.h);
      // Center logo
      const logoSize = Math.min(s.w, s.h) * 0.5;
      const x = (s.w - logoSize) / 2;
      const y = (s.h - logoSize) / 2;
      ctx.drawImage(logoImg, x, y, logoSize, logoSize);

      const wrapper = document.createElement('div');
      wrapper.style.cssText = 'text-align:center;';
      const preview = document.createElement('canvas');
      const pw = 200; const ph = Math.round((s.h / s.w) * pw);
      preview.width = pw; preview.height = ph;
      preview.getContext('2d').drawImage(c, 0, 0, pw, ph);
      preview.style.cssText = 'width:100%;border:1px solid var(--border-primary);border-radius:6px;cursor:pointer;';
      preview.addEventListener('click', () => {
        c.toBlob(b => downloadBlob(b, `${tokenName.value || 'token'}-${s.name.toLowerCase().replace(/\s+/g, '-')}.png`), 'image/png');
      });
      const label = document.createElement('div');
      label.style.cssText = 'font-size:11px;color:var(--text-tertiary);margin-top:4px;';
      label.textContent = `${s.name} (${s.w}×${s.h})`;
      const btn = document.createElement('button');
      btn.className = 'btn btn-ghost btn-sm';
      btn.textContent = 'Download';
      btn.style.cssText = 'margin-top:4px;font-size:10px;';
      btn.addEventListener('click', () => {
        c.toBlob(b => downloadBlob(b, `${tokenName.value || 'token'}-${s.name.toLowerCase().replace(/\s+/g, '-')}.png`), 'image/png');
      });
      wrapper.appendChild(preview);
      wrapper.appendChild(label);
      wrapper.appendChild(btn);
      grid.appendChild(wrapper);
    });
  }

  // ─── Step 5: Watermark ───
  const wmOpSlider = document.getElementById('ls-wm-opacity');
  document.getElementById('ls-wm-op-val').textContent = wmOpSlider.value;
  wmOpSlider.addEventListener('input', () => {
    document.getElementById('ls-wm-op-val').textContent = wmOpSlider.value;
    generateWatermark();
  });

  function generateWatermark() {
    if (!logoImg) return;
    const canvas = document.getElementById('ls-wm-canvas');
    canvas.width = logoImg.width; canvas.height = logoImg.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(logoImg, 0, 0);
    const text = document.getElementById('ls-wm-text').value || '$MTK';
    const size = parseInt(document.getElementById('ls-wm-size').value) || 24;
    const opacity = parseInt(wmOpSlider.value) / 100;
    ctx.globalAlpha = opacity;
    ctx.font = `600 ${size}px "JetBrains Mono", monospace`;
    ctx.fillStyle = '#ffffff';
    // Tile watermark
    const tw = ctx.measureText(text).width + 40;
    const th = size + 30;
    for (let y = 0; y < canvas.height; y += th) {
      for (let x = (Math.floor(y / th) % 2) * (tw / 2) - tw; x < canvas.width; x += tw) {
        ctx.save();
        ctx.translate(x + tw / 2, y + th / 2);
        ctx.rotate(-0.3);
        ctx.fillText(text, -tw / 2 + 20, 0);
        ctx.restore();
      }
    }
    ctx.globalAlpha = 1;
  }

  document.getElementById('ls-wm-text').addEventListener('input', generateWatermark);
  document.getElementById('ls-wm-size').addEventListener('input', generateWatermark);
  document.getElementById('ls-wm-download').addEventListener('click', () => {
    document.getElementById('ls-wm-canvas').toBlob(b => downloadBlob(b, `${tokenName.value || 'token'}-watermarked.png`), 'image/png');
  });

  // ─── Step 6: Meta Tags ───
  function generateMeta() {
    const title = document.getElementById('ls-meta-title').value || `${tokenName.value} — Launch on Bags`;
    const desc = document.getElementById('ls-meta-desc').value || `Discover ${tokenName.value} (${ticker.value}) — launching on Bags.`;
    const url = document.getElementById('ls-meta-url').value || 'https://bags.fm';
    const image = document.getElementById('ls-meta-image').value || '';
    const theme = brandColor.value;

    const tags = [
      `<meta charset="UTF-8">`,
      `<meta name="viewport" content="width=device-width, initial-scale=1.0">`,
      `<title>${title}</title>`,
      `<meta name="description" content="${desc}">`,
      `<meta name="theme-color" content="${theme}">`,
      ``,
      `<!-- Open Graph -->`,
      `<meta property="og:type" content="website">`,
      `<meta property="og:title" content="${title}">`,
      `<meta property="og:description" content="${desc}">`,
      `<meta property="og:url" content="${url}">`,
      image ? `<meta property="og:image" content="${image}">` : null,
      ``,
      `<!-- Twitter -->`,
      `<meta name="twitter:card" content="summary_large_image">`,
      `<meta name="twitter:title" content="${title}">`,
      `<meta name="twitter:description" content="${desc}">`,
      image ? `<meta name="twitter:image" content="${image}">` : null,
    ].filter(Boolean).join('\n');

    document.getElementById('ls-meta-output').textContent = tags;
  }

  ['ls-meta-title', 'ls-meta-desc', 'ls-meta-url', 'ls-meta-image'].forEach(id => {
    document.getElementById(id).addEventListener('input', generateMeta);
  });

  document.getElementById('ls-meta-copy').addEventListener('click', () => {
    copyToClipboard(document.getElementById('ls-meta-output').textContent);
  });

  generateMeta();
}
