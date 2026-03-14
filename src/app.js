import { TOOLS, CATEGORIES } from './tools.js';

// Dynamic tool module loading
const toolModules = {
  // UI/UX Design (New additions)
  'glassmorphism-gen': () => import('./tools/glassmorphism-gen.js'),
  'shadow-smoother': () => import('./tools/shadow-smoother.js'),
  'golden-ratio': () => import('./tools/golden-ratio.js'),

  // Existing tools
  'launch-system': () => import('./tools/launch-system.js'),
  'qr-generator': () => import('./tools/qr-generator.js'),
  'palette-generator': () => import('./tools/palette-generator.js'),
  'banner-generator': () => import('./tools/banner-generator.js'),
  'bg-remover': () => import('./tools/bg-remover.js'),
  'social-cropper': () => import('./tools/social-cropper.js'),
  'matte-generator': () => import('./tools/matte-generator.js'),
  'watermarker': () => import('./tools/watermarker.js'),
  'seamless-scroll': () => import('./tools/seamless-scroll.js'),
  'colour-converter': () => import('./tools/colour-converter.js'),
  'tailwind-shades': () => import('./tools/tailwind-shades.js'),
  'harmony-generator': () => import('./tools/harmony-generator.js'),
  'palette-collection': () => import('./tools/palette-collection.js'),
  'contrast-checker': () => import('./tools/contrast-checker.js'),
  'colorblind-sim': () => import('./tools/colorblind-sim.js'),
  'gradient-generator': () => import('./tools/gradient-generator.js'),
  'favicon-generator': () => import('./tools/favicon-generator.js'),
  'placeholder-generator': () => import('./tools/placeholder-generator.js'),
  'image-splitter': () => import('./tools/image-splitter.js'),
  'image-converter': () => import('./tools/image-converter.js'),
  'artwork-enhancer': () => import('./tools/artwork-enhancer.js'),
  'px-to-rem': () => import('./tools/px-to-rem.js'),
  'line-height-calc': () => import('./tools/line-height-calc.js'),
  'typo-calc': () => import('./tools/typo-calc.js'),
  'paper-sizes': () => import('./tools/paper-sizes.js'),
  'word-counter': () => import('./tools/word-counter.js'),
  'glyph-browser': () => import('./tools/glyph-browser.js'),
  'text-scratchpad': () => import('./tools/text-scratchpad.js'),
  'barcode-generator': () => import('./tools/barcode-generator.js'),
  'meta-tag-generator': () => import('./tools/meta-tag-generator.js'),
  'regex-tester': () => import('./tools/regex-tester.js'),
  'encoding-tools': () => import('./tools/encoding-tools.js'),
  'scientific-calc': () => import('./tools/scientific-calc.js'),
  'base-converter': () => import('./tools/base-converter.js'),
  'unit-converter': () => import('./tools/unit-converter.js'),
  'time-calculator': () => import('./tools/time-calculator.js'),
};

// ─── DOM References ───
const heroSection = document.getElementById('hero-section');
const appShell = document.getElementById('app-shell');

let mainContent, sidebarNav, searchInput, sidebar, topBar;
let appInitialized = false;
let currentCleanup = null;

// ─── Contract Address from .env ───
const CA = import.meta.env.VITE_CA || '';

// Populate Hero CA (Landing Page)
const heroCaEl = document.getElementById('hero-ca-container');
if (heroCaEl && CA) {
  heroCaEl.style.display = 'flex';
  heroCaEl.innerHTML = `
    <span style="font-size: 13px; font-weight: 600; color: rgba(255, 255, 255, 0.8); letter-spacing: 0.5px;">CA:</span>
    <span id="hero-ca-display" title="Click to copy" style="background: rgba(255, 255, 255, 0.15); border: 1px solid rgba(255, 255, 255, 0.2); padding: 6px 16px; border-radius: 50px; color: #fff; font-family: var(--font-mono); font-size: 13px; font-weight: 500; cursor: pointer; backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); transition: all 0.2s ease; letter-spacing: 0.3px;">${CA}</span>
  `;
  
  const displayEl = document.getElementById('hero-ca-display');
  
  // Custom hover effects
  displayEl.addEventListener('mouseenter', () => {
    displayEl.style.background = 'rgba(255, 255, 255, 0.25)';
    displayEl.style.borderColor = 'rgba(255, 255, 255, 0.4)';
  });
  displayEl.addEventListener('mouseleave', () => {
    displayEl.style.background = 'rgba(255, 255, 255, 0.15)';
    displayEl.style.borderColor = 'rgba(255, 255, 255, 0.2)';
  });

  // Copy on click
  displayEl.addEventListener('click', () => {
    navigator.clipboard.writeText(CA).then(() => {
      const orig = displayEl.textContent;
      displayEl.textContent = 'Copied!';
      displayEl.style.background = 'rgba(255, 255, 255, 0.3)';
      setTimeout(() => { 
        displayEl.textContent = orig; 
        displayEl.style.background = 'rgba(255, 255, 255, 0.15)';
      }, 1500);
    });
  });
}

// ─── Initialize App Shell (lazy, only when needed) ───
function initAppShell() {
  if (appInitialized) return;
  appInitialized = true;

  mainContent = document.getElementById('main-content');
  sidebarNav = document.getElementById('sidebar-nav');
  searchInput = document.getElementById('sidebar-search');
  sidebar = document.getElementById('sidebar');
  topBar = document.getElementById('top-bar');

  // Populate CA in header center
  const caEl = document.getElementById('top-bar-ca');
  if (caEl && CA) {
    caEl.innerHTML = `
      <span class="top-bar-ca-label">CA:</span>
      <span class="top-bar-ca" id="ca-display" title="Click to copy">${CA}</span>
    `;
    document.getElementById('ca-display').addEventListener('click', () => {
      navigator.clipboard.writeText(CA).then(() => {
        const el = document.getElementById('ca-display');
        const orig = el.textContent;
        el.textContent = 'Copied!';
        setTimeout(() => { el.textContent = orig; }, 1500);
      });
    });
  }

  // Search
  searchInput.addEventListener('input', (e) => {
    buildSidebar(e.target.value);
  });

  // Mobile sidebar toggle
  document.getElementById('mobile-toggle').addEventListener('click', () => {
    sidebar.classList.toggle('open');
  });

  // Close sidebar on overlay click
  document.getElementById('sidebar-overlay').addEventListener('click', () => {
    sidebar.classList.remove('open');
  });
}

// ─── View Toggle ───
function showHero() {
  heroSection.style.display = '';
  appShell.style.display = 'none';
}

function showApp() {
  heroSection.style.display = 'none';
  appShell.style.display = '';
  initAppShell();
}

// ─── Top Bar ───
function updateTopBar(title, icon) {
  const leftEl = document.querySelector('.top-bar-left');
  if (leftEl) {
    leftEl.innerHTML = `<span class="icon">${icon || '⊙'}</span><span>${title || 'Home'}</span>`;
  }
}

// Build sidebar navigation
function buildSidebar(filter = '') {
  if (!sidebarNav) return;
  const lf = filter.toLowerCase();
  let html = '';

  // Home link
  const homeActive = !location.hash || location.hash === '#/' ? 'active' : '';
  html += `<a href="#/" class="sidebar-link ${homeActive}"><span class="icon">⊙</span> Home</a>`;

  // Launch System link
  const launchActive = location.hash === '#/launch' ? 'active' : '';
  html += `<a href="#/launch" class="sidebar-link ${launchActive}"><span class="icon">→</span> Launch System</a>`;

  // Tools link
  const toolsActive = location.hash === '#/tools' ? 'active' : '';
  html += `<a href="#/tools" class="sidebar-link ${toolsActive}"><span class="icon">◇</span> Browse Tools</a>`;

  for (const cat of CATEGORIES) {
    const tools = TOOLS.filter(t => t.category === cat.name && (
      !lf || t.name.toLowerCase().includes(lf) || t.desc.toLowerCase().includes(lf)
    ));
    if (tools.length === 0) continue;
    html += `<div class="sidebar-category">${cat.icon} ${cat.name}</div>`;
    for (const tool of tools) {
      const active = location.hash === `#/${tool.id}` ? 'active' : '';
      html += `<a href="#/${tool.id}" class="sidebar-link ${active}">
        <span class="icon">${tool.icon}</span>
        <span>${tool.name}</span>
        ${tool.badge ? `<span class="sidebar-badge ${tool.badge.toLowerCase()}">${tool.badge}</span>` : ''}
      </a>`;
    }
  }
  sidebarNav.innerHTML = html;
}

// ─── Render: Tools browse page ───
function renderToolsBrowse() {
  let html = '';

  for (const cat of CATEGORIES) {
    const tools = TOOLS.filter(t => t.category === cat.name);
    html += `<div class="category-section">`;
    html += `<div class="category-title">${cat.name}</div>`;
    html += `<div class="tools-grid">`;
    for (const tool of tools) {
      html += `
        <a href="#/${tool.id}" class="card">
          <div class="card-icon">${tool.icon}</div>
          <div class="card-title">${tool.name}
            ${tool.badge ? `<span class="card-badge ${tool.badge.toLowerCase()}">${tool.badge}</span>` : ''}
          </div>
          <div class="card-desc">${tool.desc}</div>
        </a>
      `;
    }
    html += `</div></div>`;
  }

  // About section
  html += `
    <div class="about-section">
      <h2>About</h2>
      <p>just5min is a collection of small, focused utilities that respect your privacy and work entirely in your browser. No data leaves your machine, no accounts required, no tracking. Just tools that do what they say.</p>
      <div class="about-meta">
        <dl><dt>Made by</dt><dd>Matitaben</dd></dl>
        <dl><dt>Source</dt><dd>just5min</dd></dl>
      </div>
      <div class="about-footer">Built with Vite and vanilla JS. All processing happens locally in your browser.</div>
    </div>
  `;

  mainContent.innerHTML = html;
  updateTopBar('Browse Tools', '◇');
}

// ─── Render: Launch System (all-in-one) ───
async function renderLaunchSystem() {
  mainContent.innerHTML = `
    <div id="tool-container">
      <div class="tool-header">
        <a href="#/" class="tool-back">← Back to home</a>
      </div>
      <div id="tool-body">
        <div style="text-align:center;padding:60px 20px;color:var(--text-tertiary);">Loading Launch System...</div>
      </div>
    </div>
  `;
  updateTopBar('Launch System', '→');

  try {
    const module = await toolModules['launch-system']();
    const body = document.getElementById('tool-body');
    if (body) {
      body.innerHTML = '';
      if (module.render) {
        currentCleanup = module.render(body) || null;
      }
    }
  } catch (err) {
    console.error('Failed to load launch system:', err);
    document.getElementById('tool-body').innerHTML = `<div class="tool-section"><p>Failed to load Launch System.</p></div>`;
  }
}

// ─── Render: Individual tool page ───
async function renderTool(toolId) {
  const tool = TOOLS.find(t => t.id === toolId);
  if (!tool) {
    mainContent.innerHTML = `<div><h2>Tool not found</h2><p><a href="#/tools">Back to tools</a></p></div>`;
    return;
  }

  updateTopBar(tool.name, tool.icon);

  mainContent.innerHTML = `
    <div id="tool-container">
      <div class="tool-header">
        <a href="#/tools" class="tool-back">← Back to tools</a>
        <h1>${tool.icon} ${tool.name}</h1>
        <p>${tool.desc}</p>
      </div>
      <div id="tool-body">
        <div style="text-align:center;padding:60px 20px;color:var(--text-tertiary);">Loading tool...</div>
      </div>
    </div>
  `;

  const loader = toolModules[toolId];
  if (loader) {
    try {
      const module = await loader();
      const body = document.getElementById('tool-body');
      if (body) {
        body.innerHTML = '';
        if (module.render) {
          currentCleanup = module.render(body) || null;
        }
      }
    } catch (err) {
      console.error('Failed to load tool:', err);
      const body = document.getElementById('tool-body');
      if (body) body.innerHTML = `<div class="tool-section"><p>Failed to load tool module.</p></div>`;
    }
  }
}

// ─── Router ───
function route() {
  if (currentCleanup) {
    if (typeof currentCleanup === 'function') currentCleanup();
    currentCleanup = null;
  }

  const hash = location.hash.slice(2) || '';

  if (!hash || hash === '/') {
    // Landing → show hero, hide app shell
    showHero();
  } else if (hash === 'launch') {
    showApp();
    renderLaunchSystem();
  } else if (hash === 'tools') {
    showApp();
    renderToolsBrowse();
  } else {
    showApp();
    renderTool(hash);
  }

  if (appInitialized) {
    buildSidebar();
    sidebar.classList.remove('open');
  }
}

window.addEventListener('hashchange', route);
window.addEventListener('load', route);

