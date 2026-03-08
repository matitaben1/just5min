export function render(container) {
  container.innerHTML = `
    <div class="tool-section">
      <div class="tool-section-title">Text Input</div>
      <textarea id="wc-text" rows="10" placeholder="Paste or type your text here..." style="width:100%;font-family:var(--font-sans);"></textarea>
    </div>
    <div class="tool-section">
      <div class="tool-section-title">Statistics</div>
      <div id="wc-stats" class="controls-grid"></div>
    </div>
  `;

  const textarea = document.getElementById('wc-text');

  function update() {
    const text = textarea.value;
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, '').length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const sentences = text.trim() ? text.split(/[.!?]+/).filter(s => s.trim()).length : 0;
    const paragraphs = text.trim() ? text.split(/\n\s*\n/).filter(p => p.trim()).length : 0;
    const lines = text ? text.split('\n').length : 0;
    const readingTime = Math.ceil(words / 200);
    const speakingTime = Math.ceil(words / 130);

    document.getElementById('wc-stats').innerHTML = [
      { label: 'Characters', value: chars },
      { label: 'Characters (no spaces)', value: charsNoSpaces },
      { label: 'Words', value: words },
      { label: 'Sentences', value: sentences },
      { label: 'Paragraphs', value: paragraphs },
      { label: 'Lines', value: lines },
      { label: 'Reading Time', value: `${readingTime} min` },
      { label: 'Speaking Time', value: `${speakingTime} min` },
    ].map(s => `
      <div class="result-card">
        <div class="result-value">${s.value}</div>
        <div class="result-label">${s.label}</div>
      </div>
    `).join('');
  }

  textarea.addEventListener('input', update);
  update();
}
