import { copyToClipboard } from '../utils.js';

export function render(container) {
  container.innerHTML = `
    <div class="tool-row">
      <div>
        <div class="tool-section">
          <div class="tool-section-title">Unix Timestamp</div>
          <div class="input-group" style="margin-bottom:12px">
            <label>Unix Timestamp (seconds)</label>
            <input type="number" id="tc-unix" value="${Math.floor(Date.now() / 1000)}" />
          </div>
          <button class="btn btn-secondary" id="tc-now" style="margin-bottom:16px">Use Current Time</button>
          <div id="tc-from-unix"></div>
        </div>
        <div class="tool-section" style="margin-top:16px;">
          <div class="tool-section-title">Date to Unix</div>
          <div class="controls-grid">
            <div class="input-group"><label>Date & Time</label>
              <input type="datetime-local" id="tc-datetime" />
            </div>
          </div>
          <div id="tc-to-unix" style="margin-top:12px;"></div>
        </div>
      </div>
      <div>
        <div class="tool-section">
          <div class="tool-section-title">Current Time</div>
          <div id="tc-clock" style="font-family:var(--font-mono);font-size:28px;font-weight:700;margin-bottom:16px;"></div>
          <div id="tc-zones" style="display:flex;flex-direction:column;gap:6px;"></div>
        </div>
        <div class="tool-section" style="margin-top:16px;">
          <div class="tool-section-title">Date Arithmetic</div>
          <div class="controls-grid">
            <div class="input-group"><label>Start Date</label><input type="date" id="tc-start" /></div>
            <div class="input-group"><label>End Date</label><input type="date" id="tc-end" /></div>
          </div>
          <div id="tc-diff" style="margin-top:12px;"></div>
        </div>
      </div>
    </div>
  `;

  const now = new Date();
  document.getElementById('tc-datetime').value = now.toISOString().slice(0, 16);
  document.getElementById('tc-start').value = now.toISOString().slice(0, 10);
  const future = new Date(now.getTime() + 30 * 86400000);
  document.getElementById('tc-end').value = future.toISOString().slice(0, 10);

  const zones = [
    { name: 'UTC', tz: 'UTC' },
    { name: 'New York', tz: 'America/New_York' },
    { name: 'London', tz: 'Europe/London' },
    { name: 'Tokyo', tz: 'Asia/Tokyo' },
    { name: 'Sydney', tz: 'Australia/Sydney' },
    { name: 'Dubai', tz: 'Asia/Dubai' },
    { name: 'Jakarta', tz: 'Asia/Jakarta' },
  ];

  function updateClock() {
    const n = new Date();
    document.getElementById('tc-clock').textContent = n.toLocaleTimeString();
    document.getElementById('tc-zones').innerHTML = zones.map(z => {
      try {
        const time = n.toLocaleString('en-US', { timeZone: z.tz, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
        const date = n.toLocaleString('en-US', { timeZone: z.tz, month: 'short', day: 'numeric' });
        return `<div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid var(--border-primary);font-size:13px;">
          <span style="color:var(--text-secondary);">${z.name}</span>
          <span style="font-family:var(--font-mono);">${time} <span style="color:var(--text-tertiary)">${date}</span></span>
        </div>`;
      } catch { return ''; }
    }).join('');
  }

  function updateFromUnix() {
    const unix = parseInt(document.getElementById('tc-unix').value);
    const d = new Date(unix * 1000);
    document.getElementById('tc-from-unix').innerHTML = `
      <div class="output-area" style="font-size:13px;">
        <div style="margin-bottom:4px;"><span style="color:var(--text-tertiary);">ISO 8601:</span> <span style="font-family:var(--font-mono)">${d.toISOString()}</span></div>
        <div style="margin-bottom:4px;"><span style="color:var(--text-tertiary);">Local:</span> <span style="font-family:var(--font-mono)">${d.toLocaleString()}</span></div>
        <div><span style="color:var(--text-tertiary);">UTC:</span> <span style="font-family:var(--font-mono)">${d.toUTCString()}</span></div>
      </div>
    `;
  }

  function updateToUnix() {
    const dt = new Date(document.getElementById('tc-datetime').value);
    const unix = Math.floor(dt.getTime() / 1000);
    document.getElementById('tc-to-unix').innerHTML = `
      <div class="output-area" style="display:flex;justify-content:space-between;align-items:center;">
        <span style="font-family:var(--font-mono);font-weight:600;">${unix}</span>
        <button class="copy-btn" id="tc-copy-unix">Copy</button>
      </div>
    `;
    document.getElementById('tc-copy-unix').addEventListener('click', () => copyToClipboard(String(unix)));
  }

  function updateDiff() {
    const start = new Date(document.getElementById('tc-start').value);
    const end = new Date(document.getElementById('tc-end').value);
    const diff = end - start;
    const days = Math.floor(Math.abs(diff) / 86400000);
    const weeks = Math.floor(days / 7);
    const hours = Math.floor(Math.abs(diff) / 3600000);

    document.getElementById('tc-diff').innerHTML = `
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;">
        <div class="result-card"><div class="result-value">${days}</div><div class="result-label">Days</div></div>
        <div class="result-card"><div class="result-value">${weeks}</div><div class="result-label">Weeks</div></div>
        <div class="result-card"><div class="result-value">${hours.toLocaleString()}</div><div class="result-label">Hours</div></div>
      </div>
    `;
  }

  document.getElementById('tc-unix').addEventListener('input', updateFromUnix);
  document.getElementById('tc-now').addEventListener('click', () => {
    document.getElementById('tc-unix').value = Math.floor(Date.now() / 1000);
    updateFromUnix();
  });
  document.getElementById('tc-datetime').addEventListener('input', updateToUnix);
  document.getElementById('tc-start').addEventListener('input', updateDiff);
  document.getElementById('tc-end').addEventListener('input', updateDiff);

  updateFromUnix();
  updateToUnix();
  updateDiff();
  updateClock();
  const interval = setInterval(updateClock, 1000);

  return () => clearInterval(interval);
}
