export function render(container) {
  container.innerHTML = `
    <div class="tool-row">
      <div>
        <div class="tool-section">
          <div class="tool-section-title">Pattern</div>
          <div class="input-group" style="margin-bottom:12px">
            <label>Regular Expression</label>
            <input type="text" id="rx-pattern" value="\\b[A-Z][a-z]+\\b" />
          </div>
          <div class="input-group">
            <label>Flags</label>
            <div style="display:flex;gap:8px;">
              ${['g', 'i', 'm', 's'].map(f => `<label style="display:flex;align-items:center;gap:4px;font-size:13px;cursor:pointer;">
                <input type="checkbox" class="rx-flag" value="${f}" ${f === 'g' ? 'checked' : ''} /> ${f}
              </label>`).join('')}
            </div>
          </div>
        </div>
        <div class="tool-section" style="margin-top:16px;">
          <div class="tool-section-title">Match Info</div>
          <div id="rx-info" style="font-size:13px;color:var(--text-secondary);"></div>
        </div>
      </div>
      <div>
        <div class="tool-section">
          <div class="tool-section-title">Test String</div>
          <div id="rx-result" class="output-area" contenteditable="true" style="min-height:200px;white-space:pre-wrap;font-size:14px;outline:none;line-height:1.8;">The Quick Brown Fox jumps over the Lazy Dog. Hello World and Foo Bar are here.</div>
        </div>
        <div class="tool-section" style="margin-top:16px;">
          <div class="tool-section-title">Matches</div>
          <div id="rx-matches" style="display:flex;flex-wrap:wrap;gap:4px;"></div>
        </div>
      </div>
    </div>
  `;

  const patternInput = document.getElementById('rx-pattern');
  const resultDiv = document.getElementById('rx-result');
  let originalText = resultDiv.textContent;

  function highlight() {
    const text = originalText;
    const flags = Array.from(document.querySelectorAll('.rx-flag:checked')).map(c => c.value).join('');
    const info = document.getElementById('rx-info');
    const matchesDiv = document.getElementById('rx-matches');

    try {
      const regex = new RegExp(patternInput.value, flags);
      const matches = [];
      let highlighted = '';
      let lastIndex = 0;

      if (flags.includes('g')) {
        let m;
        while ((m = regex.exec(text)) !== null) {
          matches.push(m[0]);
          highlighted += escapeHtml(text.slice(lastIndex, m.index));
          highlighted += `<span class="match-highlight">${escapeHtml(m[0])}</span>`;
          lastIndex = m.index + m[0].length;
          if (m[0].length === 0) { regex.lastIndex++; }
        }
        highlighted += escapeHtml(text.slice(lastIndex));
      } else {
        const m = text.match(regex);
        if (m) {
          matches.push(m[0]);
          const idx = text.indexOf(m[0]);
          highlighted = escapeHtml(text.slice(0, idx)) +
            `<span class="match-highlight">${escapeHtml(m[0])}</span>` +
            escapeHtml(text.slice(idx + m[0].length));
        } else {
          highlighted = escapeHtml(text);
        }
      }

      resultDiv.innerHTML = highlighted;
      info.innerHTML = `<span style="color:var(--success)">${matches.length} match${matches.length !== 1 ? 'es' : ''}</span>`;
      matchesDiv.innerHTML = matches.map((m, i) =>
        `<span style="background:var(--bg-glass);border:1px solid var(--border-primary);padding:2px 8px;border-radius:4px;font-family:var(--font-mono);font-size:12px;">${escapeHtml(m)}</span>`
      ).join('');
    } catch (e) {
      info.innerHTML = `<span style="color:var(--error)">${e.message}</span>`;
    }
  }

  function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  patternInput.addEventListener('input', highlight);
  document.querySelectorAll('.rx-flag').forEach(c => c.addEventListener('change', highlight));
  resultDiv.addEventListener('input', () => {
    originalText = resultDiv.textContent;
    highlight();
  });

  highlight();
}
