// ==============================
// App.js - Module Loader
// ==============================

// Simple registry of modules and their global init functions
const MODULES = [
  { id: "analyzer", name: "Energy Analyzer", init: "initAnalyzer" },
  { id: "helper",   name: "Electrical Helper", init: "initHelper" }
];

const nav = document.getElementById("nav");
const content = document.getElementById("content");

// ✅ Ensure a shared context always exists
window.appContext = window.appContext || {};
window.appContext.analyzerData = window.appContext.analyzerData || [];

// Build sidebar
MODULES.forEach(m => {
  const btn = document.createElement("button");
  btn.textContent = m.name;
  btn.style.display = "block";
  btn.style.width = "100%";
  btn.style.margin = "6px 0";
  btn.onclick = () => loadModule(m);
  nav.appendChild(btn);
});

// ==============================
// Load a module: HTML + CSS + JS
// ==============================
async function loadModule(mod) {
  try {
    // 1) Load HTML
    const html = await fetch(`modules/${mod.id}/${mod.id}.html`).then(r => r.text());
    content.innerHTML = html;

    // 2) Load CSS (once)
    const cssId = `module-css-${mod.id}`;
    if (!document.getElementById(cssId)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = `modules/${mod.id}/${mod.id}.css`;
      link.id = cssId;
      document.head.appendChild(link);
    }

    // 3) Load JS files
    let scripts = [`${mod.id}.js`]; // default fallback (single file)
    try {
      const manifest = await fetch(`modules/${mod.id}/manifest.json`).then(r => {
        if (!r.ok) throw new Error("No manifest");
        return r.json();
      });
      if (manifest.scripts && Array.isArray(manifest.scripts)) {
        scripts = manifest.scripts;
      }
    } catch (e) {
      console.warn(`No manifest.json for ${mod.id}, using fallback: ${scripts[0]}`);
    }

    for (const file of scripts) {
      await loadScriptOnce(`modules/${mod.id}/${file}`, `module-js-${mod.id}-${file}`);
    }

    // 4) Call module init
    const initFn = window[mod.init];
    if (typeof initFn === "function") {
      initFn(content);
    } else {
      console.error(`Init function ${mod.init} not found on window`);
      alert(`Module script loaded but ${mod.init} was not found. Check console.`);
    }
  } catch (err) {
    console.error(`Failed to load module ${mod.id}:`, err);
    content.innerHTML = `<p style="color:red;">Error loading module "${mod.name}". Check console.</p>`;
  }
}

// ==============================
// Helper to load a script only once
// ==============================
function loadScriptOnce(src, id) {
  return new Promise((resolve, reject) => {
    const existing = document.getElementById(id);
    if (existing) { resolve(); return; }
    const s = document.createElement("script");
    s.src = src + `?v=${Date.now()}`; // cache-bust while developing
    s.id = id;
    s.onload = () => resolve();
    s.onerror = (e) => reject(e);
    document.body.appendChild(s);
  });
}

// ✅ Auto-load the first module
loadModule(MODULES[0]);
