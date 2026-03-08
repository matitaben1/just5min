import { copyToClipboard } from '../utils.js';

export function render(container) {
  container.innerHTML = `
    <div class="tool-row">
      <div>
        <div class="tool-section">
          <div class="tool-section-title">Page Information</div>
          <div class="input-group" style="margin-bottom:12px"><label>Title</label><input type="text" id="mt-title" value="My Website" /></div>
          <div class="input-group" style="margin-bottom:12px"><label>Description</label><textarea id="mt-desc" rows="3" style="font-family:var(--font-sans)">A great website about amazing things.</textarea></div>
          <div class="input-group" style="margin-bottom:12px"><label>URL</label><input type="url" id="mt-url" value="https://example.com" /></div>
          <div class="input-group" style="margin-bottom:12px"><label>Image URL (OG)</label><input type="url" id="mt-image" value="https://example.com/og.jpg" /></div>
          <div class="controls-grid">
            <div class="input-group"><label>Type</label>
              <select id="mt-type"><option value="website">Website</option><option value="article">Article</option><option value="product">Product</option></select>
            </div>
            <div class="input-group"><label>Locale</label><input type="text" id="mt-locale" value="en_US" /></div>
            <div class="input-group"><label>Author</label><input type="text" id="mt-author" value="" placeholder="Optional" /></div>
            <div class="input-group"><label>Keywords</label><input type="text" id="mt-kw" value="" placeholder="keyword1, keyword2" /></div>
            <div class="input-group"><label>Twitter Handle</label><input type="text" id="mt-tw" value="" placeholder="@handle" /></div>
            <div class="input-group"><label>Theme Color</label><input type="color" id="mt-theme" value="#8b5cf6" /></div>
          </div>
        </div>
      </div>
      <div>
        <div class="tool-section">
          <div class="tool-section-title">Generated HTML</div>
          <pre id="mt-output" class="output-area" style="white-space:pre-wrap;font-size:12px;max-height:500px;overflow:auto;"></pre>
          <button class="btn btn-primary" id="mt-copy" style="margin-top:12px">Copy HTML</button>
        </div>
      </div>
    </div>
  `;

  function generate() {
    const title = document.getElementById('mt-title').value;
    const desc = document.getElementById('mt-desc').value;
    const url = document.getElementById('mt-url').value;
    const image = document.getElementById('mt-image').value;
    const type = document.getElementById('mt-type').value;
    const locale = document.getElementById('mt-locale').value;
    const author = document.getElementById('mt-author').value;
    const kw = document.getElementById('mt-kw').value;
    const tw = document.getElementById('mt-tw').value;
    const theme = document.getElementById('mt-theme').value;

    let tags = [];
    tags.push(`<meta charset="UTF-8">`);
    tags.push(`<meta name="viewport" content="width=device-width, initial-scale=1.0">`);
    tags.push(`<title>${title}</title>`);
    if (desc) tags.push(`<meta name="description" content="${desc}">`);
    if (kw) tags.push(`<meta name="keywords" content="${kw}">`);
    if (author) tags.push(`<meta name="author" content="${author}">`);
    tags.push(`<meta name="theme-color" content="${theme}">`);
    tags.push('');
    tags.push(`<!-- Open Graph -->`);
    tags.push(`<meta property="og:type" content="${type}">`);
    tags.push(`<meta property="og:title" content="${title}">`);
    if (desc) tags.push(`<meta property="og:description" content="${desc}">`);
    if (url) tags.push(`<meta property="og:url" content="${url}">`);
    if (image) tags.push(`<meta property="og:image" content="${image}">`);
    if (locale) tags.push(`<meta property="og:locale" content="${locale}">`);
    tags.push('');
    tags.push(`<!-- Twitter -->`);
    tags.push(`<meta name="twitter:card" content="summary_large_image">`);
    tags.push(`<meta name="twitter:title" content="${title}">`);
    if (desc) tags.push(`<meta name="twitter:description" content="${desc}">`);
    if (image) tags.push(`<meta name="twitter:image" content="${image}">`);
    if (tw) tags.push(`<meta name="twitter:site" content="${tw}">`);

    const html = tags.join('\n');
    document.getElementById('mt-output').textContent = html;
    document.getElementById('mt-copy').onclick = () => copyToClipboard(html);
  }

  container.querySelectorAll('input, textarea, select').forEach(el => {
    el.addEventListener('input', generate);
    el.addEventListener('change', generate);
  });

  generate();
}
