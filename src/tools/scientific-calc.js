export function render(container) {
  let expression = '';
  let display = '0';
  let history = [];
  let newNumber = true;

  container.innerHTML = `
    <div style="max-width:400px;margin:0 auto;">
      <div class="calc-display">
        <div class="calc-expression" id="sc-expr">&nbsp;</div>
        <div class="calc-result" id="sc-display">0</div>
      </div>
      <div class="calc-grid">
        <button class="calc-btn" data-action="clear">AC</button>
        <button class="calc-btn" data-action="backspace">⌫</button>
        <button class="calc-btn op" data-action="op" data-val="%">%</button>
        <button class="calc-btn op" data-action="op" data-val="/">÷</button>

        <button class="calc-btn" data-action="num" data-val="7">7</button>
        <button class="calc-btn" data-action="num" data-val="8">8</button>
        <button class="calc-btn" data-action="num" data-val="9">9</button>
        <button class="calc-btn op" data-action="op" data-val="*">×</button>

        <button class="calc-btn" data-action="num" data-val="4">4</button>
        <button class="calc-btn" data-action="num" data-val="5">5</button>
        <button class="calc-btn" data-action="num" data-val="6">6</button>
        <button class="calc-btn op" data-action="op" data-val="-">−</button>

        <button class="calc-btn" data-action="num" data-val="1">1</button>
        <button class="calc-btn" data-action="num" data-val="2">2</button>
        <button class="calc-btn" data-action="num" data-val="3">3</button>
        <button class="calc-btn op" data-action="op" data-val="+">+</button>

        <button class="calc-btn" data-action="negate">±</button>
        <button class="calc-btn" data-action="num" data-val="0">0</button>
        <button class="calc-btn" data-action="num" data-val=".">.</button>
        <button class="calc-btn equals" data-action="equals">=</button>
      </div>
      <div style="margin-top:16px;">
        <div class="calc-grid" style="grid-template-columns:repeat(4,1fr);gap:4px;">
          <button class="calc-btn btn-sm op" data-action="fn" data-val="sin">sin</button>
          <button class="calc-btn btn-sm op" data-action="fn" data-val="cos">cos</button>
          <button class="calc-btn btn-sm op" data-action="fn" data-val="tan">tan</button>
          <button class="calc-btn btn-sm op" data-action="fn" data-val="sqrt">√</button>
          <button class="calc-btn btn-sm op" data-action="fn" data-val="log">log</button>
          <button class="calc-btn btn-sm op" data-action="fn" data-val="ln">ln</button>
          <button class="calc-btn btn-sm op" data-action="op" data-val="**">x^y</button>
          <button class="calc-btn btn-sm op" data-action="const" data-val="pi">π</button>
          <button class="calc-btn btn-sm op" data-action="fn" data-val="abs">|x|</button>
          <button class="calc-btn btn-sm op" data-action="fn" data-val="ceil">⌈x⌉</button>
          <button class="calc-btn btn-sm op" data-action="fn" data-val="floor">⌊x⌋</button>
          <button class="calc-btn btn-sm op" data-action="const" data-val="e">e</button>
        </div>
      </div>
      <div class="tool-section" style="margin-top:16px;max-height:200px;overflow-y:auto;">
        <div class="tool-section-title">History</div>
        <div id="sc-history" style="font-family:var(--font-mono);font-size:13px;"></div>
      </div>
    </div>
  `;

  const displayEl = document.getElementById('sc-display');
  const exprEl = document.getElementById('sc-expr');

  function updateDisplay() {
    displayEl.textContent = display;
    exprEl.textContent = expression || '\u00A0';
    document.getElementById('sc-history').innerHTML = history.slice().reverse().map(h =>
      `<div style="padding:4px 0;border-bottom:1px solid var(--border-primary);color:var(--text-secondary);">${h.expr} = <span style="color:var(--text-primary);font-weight:600;">${h.result}</span></div>`
    ).join('');
  }

  container.addEventListener('click', (e) => {
    const btn = e.target.closest('.calc-btn');
    if (!btn) return;
    const action = btn.dataset.action;
    const val = btn.dataset.val;

    switch (action) {
      case 'num':
        if (val === '.' && display.includes('.')) return;
        if (newNumber) { display = val === '.' ? '0.' : val; newNumber = false; }
        else { display += val; }
        break;
      case 'op':
        expression += display + ' ' + val + ' ';
        newNumber = true;
        break;
      case 'equals':
        expression += display;
        try {
          const result = Function('"use strict"; return (' + expression + ')')();
          history.push({ expr: expression, result: String(result) });
          display = String(result);
          expression = '';
          newNumber = true;
        } catch { display = 'Error'; expression = ''; newNumber = true; }
        break;
      case 'clear':
        display = '0'; expression = ''; newNumber = true;
        break;
      case 'backspace':
        display = display.length > 1 ? display.slice(0, -1) : '0';
        break;
      case 'negate':
        display = display.startsWith('-') ? display.slice(1) : '-' + display;
        break;
      case 'fn': {
        const n = parseFloat(display);
        const fns = {
          sin: Math.sin, cos: Math.cos, tan: Math.tan, sqrt: Math.sqrt,
          log: Math.log10, ln: Math.log, abs: Math.abs, ceil: Math.ceil, floor: Math.floor
        };
        display = String(fns[val](n));
        newNumber = true;
        break;
      }
      case 'const':
        display = val === 'pi' ? String(Math.PI) : String(Math.E);
        newNumber = true;
        break;
    }
    updateDisplay();
  });

  updateDisplay();
}
