// Hash-Router
const routes = [];
let renderFn = null;

export function route(pattern, handler) {
  const keys = [...pattern.matchAll(/:(\w+)/g)].map((m) => m[1]);
  const re = new RegExp('^' + pattern.replace(/:(\w+)/g, '([^/?]+)') + '(?:\\?.*)?$');
  routes.push({ re, keys, handler });
}
export function current() { return decodeURI(location.hash.slice(1)) || '/'; }
export function query() { const q = current().split('?')[1] || ''; return Object.fromEntries(new URLSearchParams(q)); }
export function go(path, replace = false) {
  if (current() === path) return refresh();
  if (replace) location.replace('#' + path); else location.hash = path;
}
export function match(path) {
  for (const r of routes) {
    const m = path.match(r.re);
    if (m) return { handler: r.handler, params: Object.fromEntries(r.keys.map((k, i) => [k, decodeURIComponent(m[i + 1])])) };
  }
  return null;
}
export function setRenderer(fn) { renderFn = fn; }
export function refresh() { return renderFn && renderFn(); }

// Zwischenablage für Daten, die nicht in die URL gehören (z. B. Abfrage-Konfiguration)
export const pass = {};
