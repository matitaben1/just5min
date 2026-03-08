import { copyToClipboard } from '../utils.js';

export function render(container) {
  container.innerHTML = `
    <div class="tool-section">
      <div class="tool-section-title">Input</div>
      <textarea id="enc-input" rows="4" placeholder="Enter text to encode/decode..." style="font-family:var(--font-mono);">Hello, World!</textarea>
    </div>
    <div class="tool-section">
      <div class="tool-section-title">Encoding Tools</div>
      <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px;">
        <button class="btn btn-secondary enc-btn" data-type="base64-enc">Base64 Encode</button>
        <button class="btn btn-secondary enc-btn" data-type="base64-dec">Base64 Decode</button>
        <button class="btn btn-secondary enc-btn" data-type="url-enc">URL Encode</button>
        <button class="btn btn-secondary enc-btn" data-type="url-dec">URL Decode</button>
        <button class="btn btn-secondary enc-btn" data-type="html-enc">HTML Encode</button>
        <button class="btn btn-secondary enc-btn" data-type="html-dec">HTML Decode</button>
        <button class="btn btn-secondary enc-btn" data-type="md5">MD5 Hash</button>
        <button class="btn btn-secondary enc-btn" data-type="sha256">SHA-256 Hash</button>
        <button class="btn btn-secondary enc-btn" data-type="sha512">SHA-512 Hash</button>
        <button class="btn btn-secondary enc-btn" data-type="hex-enc">Hex Encode</button>
        <button class="btn btn-secondary enc-btn" data-type="hex-dec">Hex Decode</button>
      </div>
    </div>
    <div class="tool-section">
      <div class="tool-section-title">Output</div>
      <div class="output-area" id="enc-output" style="min-height:60px;word-break:break-all;"></div>
      <button class="btn btn-secondary" id="enc-copy" style="margin-top:8px">Copy Output</button>
    </div>
  `;

  async function hashText(algo, text) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hash = await crypto.subtle.digest(algo, data);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  function simpleHash(str) {
    // Simple non-crypto hash for MD5 placeholder
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const chr = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + chr;
      hash |= 0;
    }
    return Math.abs(hash).toString(16).padStart(8, '0');
  }

  container.querySelectorAll('.enc-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const input = document.getElementById('enc-input').value;
      const output = document.getElementById('enc-output');
      let result = '';

      try {
        switch (btn.dataset.type) {
          case 'base64-enc': result = btoa(unescape(encodeURIComponent(input))); break;
          case 'base64-dec': result = decodeURIComponent(escape(atob(input))); break;
          case 'url-enc': result = encodeURIComponent(input); break;
          case 'url-dec': result = decodeURIComponent(input); break;
          case 'html-enc': result = input.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;'); break;
          case 'html-dec': { const t = document.createElement('textarea'); t.innerHTML = input; result = t.value; } break;
          case 'md5': result = '(MD5 not available in browser) Simulated: ' + simpleHash(input); break;
          case 'sha256': result = await hashText('SHA-256', input); break;
          case 'sha512': result = await hashText('SHA-512', input); break;
          case 'hex-enc': result = Array.from(new TextEncoder().encode(input)).map(b => b.toString(16).padStart(2, '0')).join(' '); break;
          case 'hex-dec': result = new TextDecoder().decode(new Uint8Array(input.split(/\s+/).map(h => parseInt(h, 16)))); break;
        }
      } catch (e) {
        result = `Error: ${e.message}`;
      }

      output.textContent = result;
      document.getElementById('enc-copy').onclick = () => copyToClipboard(result);
    });
  });
}
