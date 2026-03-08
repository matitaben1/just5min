export function render(container) {
  container.innerHTML = `
    <div class="tool-section">
      <div class="tool-section-title">Scratchpad</div>
      <textarea id="ts-text" rows="12" placeholder="Type or paste text here..." style="width:100%;font-family:var(--font-sans);font-size:15px;"></textarea>
    </div>
    <div class="tool-section">
      <div class="tool-section-title">Text Tools</div>
      <div style="display:flex;flex-wrap:wrap;gap:8px;">
        <button class="btn btn-secondary" data-action="upper">UPPERCASE</button>
        <button class="btn btn-secondary" data-action="lower">lowercase</button>
        <button class="btn btn-secondary" data-action="title">Title Case</button>
        <button class="btn btn-secondary" data-action="sentence">Sentence case</button>
        <button class="btn btn-secondary" data-action="reverse">Reverse</button>
        <button class="btn btn-secondary" data-action="trim-lines">Trim Lines</button>
        <button class="btn btn-secondary" data-action="remove-empty">Remove Empty Lines</button>
        <button class="btn btn-secondary" data-action="sort">Sort Lines</button>
        <button class="btn btn-secondary" data-action="deduplicate">Deduplicate Lines</button>
        <button class="btn btn-secondary" data-action="number-lines">Number Lines</button>
        <button class="btn btn-secondary" data-action="slug">Slugify</button>
        <button class="btn btn-secondary" data-action="camel">camelCase</button>
        <button class="btn btn-secondary" data-action="snake">snake_case</button>
        <button class="btn btn-secondary" data-action="kebab">kebab-case</button>
      </div>
    </div>
    <div class="tool-section">
      <div class="tool-section-title">Find & Replace</div>
      <div style="display:flex;gap:8px;align-items:flex-end;">
        <div class="input-group" style="flex:1"><label>Find</label><input type="text" id="ts-find" /></div>
        <div class="input-group" style="flex:1"><label>Replace</label><input type="text" id="ts-replace" /></div>
        <button class="btn btn-primary" id="ts-do-replace">Replace All</button>
      </div>
    </div>
    <div class="tool-section">
      <div class="tool-section-title">Stats</div>
      <div id="ts-stats" style="display:flex;gap:16px;flex-wrap:wrap;"></div>
    </div>
  `;

  const textarea = document.getElementById('ts-text');

  const actions = {
    upper: t => t.toUpperCase(),
    lower: t => t.toLowerCase(),
    title: t => t.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.substring(1).toLowerCase()),
    sentence: t => t.replace(/(^\s*\w|[.!?]\s*\w)/gm, c => c.toUpperCase()),
    reverse: t => t.split('').reverse().join(''),
    'trim-lines': t => t.split('\n').map(l => l.trim()).join('\n'),
    'remove-empty': t => t.split('\n').filter(l => l.trim()).join('\n'),
    sort: t => t.split('\n').sort().join('\n'),
    deduplicate: t => [...new Set(t.split('\n'))].join('\n'),
    'number-lines': t => t.split('\n').map((l, i) => `${i + 1}. ${l}`).join('\n'),
    slug: t => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    camel: t => t.replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase()).replace(/^[A-Z]/, c => c.toLowerCase()),
    snake: t => t.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, ''),
    kebab: t => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
  };

  container.querySelectorAll('[data-action]').forEach(btn => {
    btn.addEventListener('click', () => {
      textarea.value = actions[btn.dataset.action](textarea.value);
      updateStats();
    });
  });

  document.getElementById('ts-do-replace').addEventListener('click', () => {
    const find = document.getElementById('ts-find').value;
    const replace = document.getElementById('ts-replace').value;
    if (find) textarea.value = textarea.value.split(find).join(replace);
    updateStats();
  });

  function updateStats() {
    const t = textarea.value;
    const stats = [
      { label: 'Characters', value: t.length },
      { label: 'Words', value: t.trim() ? t.trim().split(/\s+/).length : 0 },
      { label: 'Lines', value: t ? t.split('\n').length : 0 },
    ];
    document.getElementById('ts-stats').innerHTML = stats.map(s =>
      `<div class="result-card" style="min-width:100px;"><div class="result-value">${s.value}</div><div class="result-label">${s.label}</div></div>`
    ).join('');
  }

  textarea.addEventListener('input', updateStats);
  updateStats();
}
