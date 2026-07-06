import { TEMPLATES, CATEGORIES, PromptTemplate } from './data/templates';
import {
  compilePrompt,
  filterTemplates,
  Storage,
  UrlSerializer,
  analyzePrompt
} from './services/engine';

// ==========================================
// 1. APPLICATION STATE
// ==========================================
let currentTemplate: PromptTemplate = TEMPLATES[0];
let formValues: Record<string, string> = {};
let searchQuery = '';
let activeCategory = '';
let activeDifficulty = '';
let activeSidebarTab: 'all' | 'favs' | 'recents' = 'all';

// ==========================================
// 2. DOM CACHE
// ==========================================
const DOM = {
  // Navigation & Header
  themeToggle: document.getElementById('theme-toggle') as HTMLButtonElement,
  kbToggle: document.getElementById('kb-toggle') as HTMLButtonElement,
  kbDrawer: document.getElementById('kb-drawer') as HTMLDivElement,
  kbClose: document.getElementById('kb-close') as HTMLButtonElement,
  
  // Sidebar (Panel 1)
  searchInput: document.getElementById('search-input') as HTMLInputElement,
  difficultyFilter: document.getElementById('difficulty-filter') as HTMLSelectElement,
  tabAll: document.getElementById('tab-all') as HTMLButtonElement,
  tabFavs: document.getElementById('tab-favs') as HTMLButtonElement,
  tabRecents: document.getElementById('tab-recents') as HTMLButtonElement,
  categoryButtons: document.getElementById('category-buttons') as HTMLDivElement,
  templatesContainer: document.getElementById('templates-container') as HTMLDivElement,
  listHeader: document.getElementById('list-header') as HTMLDivElement,
  
  // Form Builder (Panel 2)
  activeCatBadge: document.getElementById('active-category-badge') as HTMLSpanElement,
  activeDiffBadge: document.getElementById('active-difficulty-badge') as HTMLSpanElement,
  activeTitle: document.getElementById('active-template-title') as HTMLHeadingElement,
  activeDesc: document.getElementById('active-template-desc') as HTMLParagraphElement,
  favToggle: document.getElementById('fav-toggle') as HTMLButtonElement,
  promptForm: document.getElementById('prompt-form') as HTMLFormElement,
  
  // Preview (Panel 3)
  tabCompiled: document.getElementById('preview-tab-compiled') as HTMLButtonElement,
  tabMarkdown: document.getElementById('preview-tab-markdown') as HTMLButtonElement,
  tabOptimizer: document.getElementById('preview-tab-optimizer') as HTMLButtonElement,
  optimizerCount: document.getElementById('optimizer-count-badge') as HTMLSpanElement,
  
  contentCompiled: document.getElementById('content-compiled') as HTMLDivElement,
  contentMarkdown: document.getElementById('content-markdown') as HTMLDivElement,
  contentOptimizer: document.getElementById('content-optimizer') as HTMLDivElement,
  
  rawOutput: document.getElementById('raw-prompt-output') as HTMLTextAreaElement,
  renderedOutput: document.getElementById('rendered-markdown-output') as HTMLDivElement,
  
  // Optimizer View
  scoreCircle: document.getElementById('score-circle') as unknown as SVGPathElement,
  scoreText: document.getElementById('score-text') as unknown as SVGTextElement,
  metricComplexity: document.getElementById('metric-complexity') as HTMLElement,
  metricWords: document.getElementById('metric-words') as HTMLElement,
  metricChars: document.getElementById('metric-chars') as HTMLElement,
  suggestionsContainer: document.getElementById('suggestions-container') as HTMLUListElement,
  
  // Footer Action Buttons
  btnCopy: document.getElementById('btn-copy') as HTMLButtonElement,
  btnDownloadMd: document.getElementById('btn-download-md') as HTMLButtonElement,
  btnDownloadTxt: document.getElementById('btn-download-txt') as HTMLButtonElement,
  btnShare: document.getElementById('btn-share') as HTMLButtonElement,
  btnExportJson: document.getElementById('btn-export-json') as HTMLButtonElement,
  btnImportJson: document.getElementById('btn-import-json') as HTMLButtonElement,
  importJsonFile: document.getElementById('import-json-file') as HTMLInputElement,
  toastContainer: document.getElementById('toast-container') as HTMLDivElement,
  
  // Layout containers
  appMain: document.querySelector('.app-main') as HTMLElement,
  mobileBtnSidebar: document.getElementById('mobile-btn-sidebar') as HTMLButtonElement,
  mobileBtnForm: document.getElementById('mobile-btn-form') as HTMLButtonElement,
  mobileBtnPreview: document.getElementById('mobile-btn-preview') as HTMLButtonElement
};

// ==========================================
// 3. LIGHTWEIGHT MARKDOWN PARSER
// ==========================================
// ponytail: simple regex parser satisfies prompt previews without marked.js dependency
function parseMarkdown(md: string): string {
  let html = md
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Blockquotes
  html = html.replace(/^&gt;\s+(.*)$/gm, '<blockquote>$1</blockquote>');
  
  // Headers
  html = html.replace(/^### (.*)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.*)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.*)$/gm, '<h1>$1</h1>');
  
  // Fenced Code Blocks (escaped backticks in template)
  html = html.replace(/```(\w*)\n([\s\S]*?)\n```/g, '<pre><code class="language-$1">$2</code></pre>');
  
  // Inline Code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  // Bold
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  
  // Bullet Lists
  html = html.replace(/^- (.*)$/gm, '<li>$1</li>');
  
  // Double newlines to paragraph tags
  html = html.replace(/\n\n/g, '<br/>');

  return html;
}

// ==========================================
// 4. TOAST NOTIFICATIONS
// ==========================================
function showToast(message: string, type: 'info' | 'warning' = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
    <span>${message}</span>
  `;
  DOM.toastContainer.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// ==========================================
// 5. RENDER FUNCTIONS
// ==========================================

// Renders the Category menu in Sidebar
function renderCategories() {
  DOM.categoryButtons.innerHTML = `
    <button class="category-btn ${activeCategory === '' ? 'active' : ''}" data-id="">
      <span class="cat-name">All Categories</span>
      <span class="cat-desc">Browse the entire catalog of prompt tools</span>
    </button>
  `;

  CATEGORIES.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = `category-btn ${activeCategory === cat.id ? 'active' : ''}`;
    btn.setAttribute('data-id', cat.id);
    btn.innerHTML = `
      <span class="cat-name">${cat.name}</span>
      <span class="cat-desc">${cat.description}</span>
    `;
    DOM.categoryButtons.appendChild(btn);
  });
}

// Renders the list of templates in Sidebar
function renderTemplates() {
  let list = TEMPLATES;

  // 1. Filter by Sidebar tabs (All, Favorites, Recent History)
  if (activeSidebarTab === 'favs') {
    const favs = Storage.getFavorites();
    list = list.filter(t => favs.includes(t.id));
    DOM.listHeader.textContent = `Favorite Templates (${list.length})`;
  } else if (activeSidebarTab === 'recents') {
    const recents = Storage.getRecent();
    list = recents.map(id => TEMPLATES.find(t => t.id === id)).filter(Boolean) as PromptTemplate[];
    DOM.listHeader.textContent = `Recent History (${list.length})`;
  } else {
    DOM.listHeader.textContent = 'Templates';
  }

  // 2. Apply search queries, categories filter, and difficulty levels
  const filtered = filterTemplates(list, searchQuery, activeCategory, activeDifficulty);

  DOM.templatesContainer.innerHTML = '';
  if (filtered.length === 0) {
    DOM.templatesContainer.innerHTML = `<div class="help-text" style="padding:12px; text-align:center;">No templates match your filters.</div>`;
    return;
  }

  filtered.forEach(t => {
    const card = document.createElement('button');
    card.className = `template-card ${currentTemplate.id === t.id ? 'active' : ''}`;
    card.setAttribute('data-id', t.id);

    const isFav = Storage.isFavorite(t.id);
    const starIcon = isFav 
      ? '<span style="color:var(--warning)">★</span> '
      : '';

    card.innerHTML = `
      <h4>${starIcon}${t.title}</h4>
      <p>${t.description}</p>
      <div class="card-meta">
        <span class="difficulty-indicator ${t.difficulty}">${t.difficulty}</span>
        <div class="template-tags">
          ${t.tags.slice(0, 2).map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
      </div>
    `;
    DOM.templatesContainer.appendChild(card);
  });
}

// Renders configuration form for selected template
function renderForm() {
  // Update header badges & labels
  const cat = CATEGORIES.find(c => c.id === currentTemplate.category);
  DOM.activeCatBadge.textContent = cat ? cat.name : currentTemplate.category;
  DOM.activeDiffBadge.className = `badge-diff ${currentTemplate.difficulty}`;
  DOM.activeDiffBadge.textContent = currentTemplate.difficulty;
  DOM.activeTitle.textContent = currentTemplate.title;
  DOM.activeDesc.textContent = currentTemplate.description;

  // Toggle favorite star state
  const isFav = Storage.isFavorite(currentTemplate.id);
  DOM.favToggle.classList.toggle('active', isFav);

  // Generate dynamic inputs
  DOM.promptForm.innerHTML = '';
  currentTemplate.fields.forEach(field => {
    const group = document.createElement('div');
    group.className = 'form-group';
    group.setAttribute('data-field-id', field.id);

    const labelRow = document.createElement('label');
    labelRow.setAttribute('for', `input-${field.id}`);
    labelRow.innerHTML = `${field.label} ${field.required ? '<span class="required-star">*</span>' : ''}`;
    group.appendChild(labelRow);

    const value = formValues[field.id] !== undefined ? formValues[field.id] : (field.defaultValue || '');

    if (field.type === 'textarea') {
      const textarea = document.createElement('textarea');
      textarea.id = `input-${field.id}`;
      textarea.placeholder = field.placeholder || '';
      textarea.value = value;
      textarea.required = !!field.required;
      group.appendChild(textarea);
    } else if (field.type === 'select' && field.options) {
      const select = document.createElement('select');
      select.id = `input-${field.id}`;
      select.required = !!field.required;
      
      field.options.forEach(opt => {
        const option = document.createElement('option');
        option.value = opt;
        option.textContent = opt;
        if (opt === value) option.selected = true;
        select.appendChild(option);
      });
      group.appendChild(select);
    } else {
      const input = document.createElement('input');
      input.type = 'text';
      input.id = `input-${field.id}`;
      input.placeholder = field.placeholder || '';
      input.value = value;
      input.required = !!field.required;
      group.appendChild(input);
    }

    if (field.helpText) {
      const help = document.createElement('span');
      help.className = 'help-text';
      help.textContent = field.helpText;
      group.appendChild(help);
    }

    DOM.promptForm.appendChild(group);
  });
}

// Compiles prompt, evaluates heuristics, parses HTML preview
function renderPreview() {
  const compiled = compilePrompt(currentTemplate.template, formValues);
  
  // 1. Update text pane
  DOM.rawOutput.value = compiled;
  
  // 2. Render Markdown preview
  DOM.renderedOutput.innerHTML = parseMarkdown(compiled);
  
  // 3. Heuristic Analyzer (Optimizer)
  const analysis = analyzePrompt(currentTemplate, formValues, compiled);
  
  // Update score badge counts
  DOM.optimizerCount.textContent = analysis.suggestions.length.toString();
  DOM.optimizerCount.style.display = analysis.suggestions.length > 0 ? 'inline' : 'none';

  // Update Score Radial
  const scorePercent = analysis.score;
  DOM.scoreText.textContent = `${scorePercent}%`;
  
  // Circumference is 2 * pi * r = 2 * 3.14159 * 15.9155 = 100
  // DASHARRAY syntax: dash-length, gap-length
  DOM.scoreCircle.setAttribute('stroke-dasharray', `${scorePercent}, 100`);
  
  // Score color gradient based on health
  if (scorePercent > 80) {
    DOM.scoreCircle.setAttribute('stroke', 'var(--accent)');
  } else if (scorePercent > 50) {
    DOM.scoreCircle.setAttribute('stroke', 'var(--warning)');
  } else {
    DOM.scoreCircle.setAttribute('stroke', 'var(--danger)');
  }

  // Update text stats
  DOM.metricComplexity.textContent = analysis.complexity;
  DOM.metricComplexity.className = `difficulty-indicator ${analysis.complexity}`;
  DOM.metricWords.textContent = analysis.wordCount.toString();
  DOM.metricChars.textContent = analysis.charCount.toString();

  // Populate suggestions list
  DOM.suggestionsContainer.innerHTML = '';
  if (analysis.suggestions.length === 0) {
    DOM.suggestionsContainer.innerHTML = `
      <li class="help-text" style="text-align:center; padding:16px;">
        ✨ Excellent job! Your prompt meets all fidelity heuristics.
      </li>
    `;
    return;
  }

  analysis.suggestions.forEach(sug => {
    const item = document.createElement('li');
    item.className = `suggestion-item ${sug.type}`;
    
    let icon = 'ℹ️';
    if (sug.type === 'warning') icon = '⚠️';
    if (sug.type === 'tip') icon = '💡';

    item.innerHTML = `
      <span class="suggestion-icon">${icon}</span>
      <div>${sug.message}</div>
    `;

    // Click suggestion to focus the respective input field
    if (sug.fieldId) {
      item.addEventListener('click', () => {
        // Toggle mobile panel if on mobile to customize
        if (window.innerWidth < 1024) {
          switchMobilePanel('form');
        }
        const el = document.getElementById(`input-${sug.fieldId}`);
        if (el) {
          el.focus();
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    }

    DOM.suggestionsContainer.appendChild(item);
  });
}

// Consolidates rendering after state changes
function updateApp() {
  renderForm();
  renderPreview();
}

// ==========================================
// 6. ACTION EVENT HANDLERS
// ==========================================

// Copies current prompt to clipboard
function actionCopyPrompt() {
  const text = DOM.rawOutput.value;
  navigator.clipboard.writeText(text)
    .then(() => showToast('Prompt copied to clipboard!'))
    .catch(() => showToast('Failed to copy. Copy manually.', 'warning'));
}

// Shares active state via URL
function actionShareUrl() {
  const hash = UrlSerializer.encode(currentTemplate.id, formValues);
  if (hash) {
    const shareUrl = `${window.location.origin}${window.location.pathname}#${hash}`;
    window.location.hash = hash;
    navigator.clipboard.writeText(shareUrl)
      .then(() => showToast('Shareable link copied to clipboard!'))
      .catch(() => showToast('Failed to copy share link.', 'warning'));
  }
}

// Downloads prompt as file
function actionDownloadPrompt(format: 'md' | 'txt') {
  const text = DOM.rawOutput.value;
  const mime = format === 'md' ? 'text/markdown' : 'text/plain';
  const ext = format === 'md' ? 'md' : 'txt';
  const filename = `${currentTemplate.id}_prompt.${ext}`;

  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  showToast(`Downloaded ${ext.toUpperCase()} prompt file.`);
}

// Exports configuration to JSON
function actionExportJson() {
  const config = {
    templateId: currentTemplate.id,
    values: formValues,
    exportedAt: new Date().toISOString()
  };
  const jsonStr = JSON.stringify(config, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `sentinel_${currentTemplate.id}_config.json`;
  document.body.appendChild(link);
  link.click();
  
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  showToast('Configuration exported as JSON.');
}

// Imports configuration from JSON file
function actionImportJson(file: File) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const res = e.target?.result as string;
      const data = JSON.parse(res);
      if (data && data.templateId && data.values) {
        const found = TEMPLATES.find(t => t.id === data.templateId);
        if (found) {
          currentTemplate = found;
          formValues = data.values;
          
          // Sync recent list
          Storage.addRecent(found.id);
          
          renderTemplates();
          updateApp();
          showToast('Configuration loaded successfully.');
        } else {
          showToast('Unknown template type in JSON.', 'warning');
        }
      } else {
        showToast('Invalid JSON structure.', 'warning');
      }
    } catch {
      showToast('Failed to parse JSON file.', 'warning');
    }
  };
  reader.readAsText(file);
}

// ==========================================
// 7. MULTI-PANEL VIEW MANAGER (MOBILE)
// ==========================================
type MobilePanel = 'sidebar' | 'form' | 'preview';

function switchMobilePanel(panel: MobilePanel) {
  // Clear classes
  DOM.appMain.classList.remove('show-sidebar', 'show-form', 'show-preview');
  DOM.mobileBtnSidebar.classList.remove('active');
  DOM.mobileBtnForm.classList.remove('active');
  DOM.mobileBtnPreview.classList.remove('active');

  if (panel === 'sidebar') {
    DOM.appMain.classList.add('show-sidebar');
    DOM.mobileBtnSidebar.classList.add('active');
  } else if (panel === 'form') {
    DOM.appMain.classList.add('show-form');
    DOM.mobileBtnForm.classList.add('active');
  } else if (panel === 'preview') {
    DOM.appMain.classList.add('show-preview');
    DOM.mobileBtnPreview.classList.add('active');
  }
}

// ==========================================
// 8. EVENT REGISTRATION
// ==========================================
function setupEventListeners() {
  
  // Theme Toggle
  DOM.themeToggle.addEventListener('click', () => {
    const isDark = document.documentElement.classList.toggle('dark');
    document.documentElement.classList.toggle('light', !isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });

  // Guide / Knowledge Base Drawer Toggle
  DOM.kbToggle.addEventListener('click', () => DOM.kbDrawer.classList.add('open'));
  DOM.kbClose.addEventListener('click', () => DOM.kbDrawer.classList.remove('open'));
  DOM.kbDrawer.querySelector('.drawer-overlay')?.addEventListener('click', () => {
    DOM.kbDrawer.classList.remove('open');
  });

  // Search input events
  DOM.searchInput.addEventListener('input', (e) => {
    searchQuery = (e.target as HTMLInputElement).value;
    renderTemplates();
  });

  // Difficulty filters
  DOM.difficultyFilter.addEventListener('change', (e) => {
    activeDifficulty = (e.target as HTMLSelectElement).value;
    renderTemplates();
  });

  // Sidebar Tabs (All, Favorites, Recents)
  DOM.tabAll.addEventListener('click', () => {
    activeSidebarTab = 'all';
    DOM.tabAll.classList.add('active');
    DOM.tabFavs.classList.remove('active');
    DOM.tabRecents.classList.remove('active');
    renderTemplates();
  });
  
  DOM.tabFavs.addEventListener('click', () => {
    activeSidebarTab = 'favs';
    DOM.tabAll.classList.remove('active');
    DOM.tabFavs.classList.add('active');
    DOM.tabRecents.classList.remove('active');
    renderTemplates();
  });
  
  DOM.tabRecents.addEventListener('click', () => {
    activeSidebarTab = 'recents';
    DOM.tabAll.classList.remove('active');
    DOM.tabFavs.classList.remove('active');
    DOM.tabRecents.classList.add('active');
    renderTemplates();
  });

  // Category navigation click
  DOM.categoryButtons.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest('.category-btn') as HTMLButtonElement;
    if (btn) {
      activeCategory = btn.getAttribute('data-id') || '';
      
      // Update active styling
      DOM.categoryButtons.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      renderTemplates();
    }
  });

  // Template select click
  DOM.templatesContainer.addEventListener('click', (e) => {
    const card = (e.target as HTMLElement).closest('.template-card') as HTMLButtonElement;
    if (card) {
      const templateId = card.getAttribute('data-id') || '';
      const selected = TEMPLATES.find(t => t.id === templateId);
      if (selected) {
        currentTemplate = selected;
        formValues = {}; // reset form values
        
        // Track recent list
        Storage.addRecent(selected.id);
        
        // Re-render
        DOM.templatesContainer.querySelectorAll('.template-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        
        updateApp();

        // On mobile, automatically slide to form panel after selection
        if (window.innerWidth < 1024) {
          switchMobilePanel('form');
        }
      }
    }
  });

  // Favorites star toggle click
  DOM.favToggle.addEventListener('click', () => {
    const isFav = Storage.toggleFavorite(currentTemplate.id);
    DOM.favToggle.classList.toggle('active', isFav);
    renderTemplates();
    showToast(isFav ? 'Added template to favorites.' : 'Removed template from favorites.');
  });

  // Capture input changes in form parameters dynamically
  DOM.promptForm.addEventListener('input', (e) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    const fieldId = target.id.replace('input-', '');
    formValues[fieldId] = target.value;
    
    // Instantly recompile preview output
    renderPreview();
  });

  // Preview panel tabs
  const switchPreviewTab = (tab: 'compiled' | 'markdown' | 'optimizer') => {
    DOM.tabCompiled.classList.toggle('active', tab === 'compiled');
    DOM.tabMarkdown.classList.toggle('active', tab === 'markdown');
    DOM.tabOptimizer.classList.toggle('active', tab === 'optimizer');

    DOM.contentCompiled.classList.toggle('active', tab === 'compiled');
    DOM.contentMarkdown.classList.toggle('active', tab === 'markdown');
    DOM.contentOptimizer.classList.toggle('active', tab === 'optimizer');
  };

  DOM.tabCompiled.addEventListener('click', () => switchPreviewTab('compiled'));
  DOM.tabMarkdown.addEventListener('click', () => switchPreviewTab('markdown'));
  DOM.tabOptimizer.addEventListener('click', () => switchPreviewTab('optimizer'));

  // Action button triggers
  DOM.btnCopy.addEventListener('click', actionCopyPrompt);
  DOM.btnShare.addEventListener('click', actionShareUrl);
  DOM.btnDownloadMd.addEventListener('click', () => actionDownloadPrompt('md'));
  DOM.btnDownloadTxt.addEventListener('click', () => actionDownloadPrompt('txt'));
  
  DOM.btnExportJson.addEventListener('click', actionExportJson);
  DOM.btnImportJson.addEventListener('click', () => DOM.importJsonFile.click());
  DOM.importJsonFile.addEventListener('change', (e) => {
    const files = (e.target as HTMLInputElement).files;
    if (files && files.length > 0) {
      actionImportJson(files[0]);
    }
  });

  // Keyboard Shortcuts (Global listener)
  document.addEventListener('keydown', (e) => {
    // Ctrl + / focuses search
    if (e.ctrlKey && e.key === '/') {
      e.preventDefault();
      DOM.searchInput.focus();
    }
    // Ctrl + C copies prompt (only when not focused on input fields)
    if (e.ctrlKey && e.key === 'c' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
      e.preventDefault();
      actionCopyPrompt();
    }
    // Ctrl + S triggers Share URL link
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      actionShareUrl();
    }
    // Esc closes KB guide drawer
    if (e.key === 'Escape') {
      DOM.kbDrawer.classList.remove('open');
    }
  });

  // Mobile navigation button binds
  DOM.mobileBtnSidebar.addEventListener('click', () => switchMobilePanel('sidebar'));
  DOM.mobileBtnForm.addEventListener('click', () => switchMobilePanel('form'));
  DOM.mobileBtnPreview.addEventListener('click', () => switchMobilePanel('preview'));
}

// ==========================================
// 9. APP INITIALIZATION
// ==========================================
function init() {
  
  // 1. Initial viewport setups (mobile default)
  if (window.innerWidth < 1024) {
    switchMobilePanel('sidebar');
  } else {
    DOM.appMain.classList.add('show-sidebar', 'show-form', 'show-preview');
  }

  // 2. Setup theme settings
  const storedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = storedTheme === 'dark' || (!storedTheme && systemPrefersDark);
  document.documentElement.classList.toggle('dark', isDark);
  document.documentElement.classList.toggle('light', !isDark);

  // 3. Load share state from URL parameters if available
  let loadedFromHash = false;
  if (window.location.hash) {
    const hash = window.location.hash.substring(1);
    const decoded = UrlSerializer.decode(hash);
    if (decoded && decoded.id) {
      const found = TEMPLATES.find(t => t.id === decoded.id);
      if (found) {
        currentTemplate = found;
        formValues = decoded.vals;
        loadedFromHash = true;
        
        // Track recent list
        Storage.addRecent(found.id);
        
        // Show customize form tab on mobile by default if loaded from link
        if (window.innerWidth < 1024) {
          switchMobilePanel('form');
        }
      }
    }
  }

  // If no hash loaded, default tracking to current template
  if (!loadedFromHash) {
    Storage.addRecent(currentTemplate.id);
  }

  // 4. Render panels & bind listeners
  renderCategories();
  renderTemplates();
  updateApp();
  setupEventListeners();

  // 5. Register simple Service Worker for offline capability
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .then(reg => console.log('Service Worker registered successfully:', reg.scope))
        .catch(err => console.error('Service Worker registration failed:', err));
    });
  }
}

// Fire init when DOM loaded
window.addEventListener('DOMContentLoaded', init);
