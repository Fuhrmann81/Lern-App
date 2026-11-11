// UI-Helfer: Escaping, Dialoge, Toasts, Datum, Antwortprüfung
export const $ = (s, el = document) => el.querySelector(s);
export const $$ = (s, el = document) => [...el.querySelectorAll(s)];
export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

export function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
export const attr = esc;

export function todayKey(d = new Date()) {
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}
export function addDays(key, n) { const d = new Date(key + 'T12:00:00'); d.setDate(d.getDate() + n); return todayKey(d); }
export function fmtDate(ts) { return new Date(ts).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }); }
export function debounce(fn, ms = 400) { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; }
export function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
export const pick = (a) => a[Math.floor(Math.random() * a.length)];

// ---------- Toast ----------
export function toast(msg, ms = 2200) {
  let el = $('#toast');
  if (!el) { el = document.createElement('div'); el.id = 'toast'; document.body.appendChild(el); }
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove('show'), ms);
}

// ---------- Modal ----------
export function modal({ title = '', body = '', actions = [], wide = false, onMount }) {
  const wrap = document.createElement('div');
  wrap.className = 'modal-wrap';
  wrap.innerHTML = `<div class="modal ${wide ? 'wide' : ''}" role="dialog" aria-modal="true">
    ${title ? `<div class="modal-head"><h2>${esc(title)}</h2><button class="icon-btn" data-close aria-label="Schließen">✕</button></div>` : ''}
    <div class="modal-body">${body}</div>
    ${actions.length ? `<div class="modal-actions">${actions.map((a, i) => `<button class="btn ${a.primary ? 'primary' : ''} ${a.danger ? 'danger' : ''}" data-i="${i}">${esc(a.label)}</button>`).join('')}</div>` : ''}
  </div>`;
  document.body.appendChild(wrap);
  document.body.classList.add('no-scroll');
  const close = () => { wrap.remove(); if (!$('.modal-wrap')) document.body.classList.remove('no-scroll'); };
  wrap.addEventListener('click', async (e) => {
    if (e.target === wrap || e.target.closest('[data-close]')) return close();
    const b = e.target.closest('.modal-actions [data-i]');
    if (b) {
      const a = actions[+b.dataset.i];
      const r = a.onClick ? await a.onClick(wrap) : undefined;
      if (r !== false) close();
    }
  });
  if (onMount) onMount(wrap, close);
  const first = wrap.querySelector('input:not([type=file]):not([type=checkbox]), textarea');
  if (first && !('ontouchstart' in window)) setTimeout(() => first.focus(), 50);
  return { el: wrap, close };
}

export function confirmDlg(text, okLabel = 'OK', danger = false) {
  return new Promise((resolve) => {
    modal({ title: 'Bitte bestätigen', body: `<p>${esc(text)}</p>`, actions: [
      { label: 'Abbrechen', onClick: () => resolve(false) },
      { label: okLabel, primary: !danger, danger, onClick: () => resolve(true) },
    ] });
  });
}

export function promptDlg(title, value = '', placeholder = '') {
  return new Promise((resolve) => {
    let done = false;
    const m = modal({ title, body: `<input class="input" id="pd-in" value="${attr(value)}" placeholder="${attr(placeholder)}">`, actions: [
      { label: 'Abbrechen', onClick: () => { done = true; resolve(null); } },
      { label: 'OK', primary: true, onClick: (w) => { done = true; resolve($('#pd-in', w).value.trim()); } },
    ] });
    $('#pd-in', m.el).addEventListener('keydown', (e) => { if (e.key === 'Enter') { done = true; resolve(e.target.value.trim()); m.close(); } });
    const obs = new MutationObserver(() => { if (!document.body.contains(m.el)) { obs.disconnect(); if (!done) resolve(null); } });
    obs.observe(document.body, { childList: true });
  });
}

// ---------- Antwortprüfung ----------
export function stripAccents(s) { return s.normalize('NFD').replace(/[̀-ͯ]/g, ''); }
export function norm(s) {
  return String(s ?? '').toLowerCase().replace(/[’`´]/g, "'").replace(/\([^)]*\)/g, ' ')
    .replace(/[.!?¿¡"„“”«»]/g, '').replace(/\s+/g, ' ').trim();
}
/** Mögliche Antworten aus einem Feld: "Haus, Gebäude; Heim" → [haus, gebäude, heim] + gesamt */
export function answerVariants(s) {
  const whole = norm(s);
  const parts = String(s ?? '').split(/[,;/]| oder /).map(norm).filter(Boolean);
  return [...new Set([whole, ...parts])];
}
function lev(a, b) {
  const m = a.length, n = b.length; if (!m) return n; if (!n) return m;
  let prev = Array.from({ length: n + 1 }, (_, i) => i);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    prev = cur;
  }
  return prev[n];
}
/**
 * Vergleicht Eingabe mit Lösungen.
 * → {ok, accent (nur Akzent falsch), typo (1 Tippfehler), match}
 */
export function checkAnswer(input, solutions, { accentTolerant = true, stripArticle = false } = {}) {
  let x = norm(input);
  const prep = (s) => {
    let v = norm(s);
    if (stripArticle) v = v.replace(/^(le |la |les |l'|un |une |des |the |a |an |to )/, '');
    return v;
  };
  if (stripArticle) x = prep(x);
  const sols = solutions.flatMap((s) => answerVariants(s)).map(prep).filter(Boolean);
  if (!x) return { ok: false };
  if (sols.includes(x)) return { ok: true, match: x };
  const xs = stripAccents(x);
  const accentHit = sols.find((s) => stripAccents(s) === xs);
  if (accentHit) return { ok: accentTolerant, accent: true, match: accentHit };
  const typo = sols.find((s) => s.length >= 6 && lev(stripAccents(s), xs) === 1);
  if (typo) return { ok: false, typo: true, match: typo };
  return { ok: false };
}

export function downloadFile(name, content, type = 'application/json') {
  const blob = content instanceof Blob ? content : new Blob([content], { type });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 5000);
}

/** Teilen über das iOS-Teilen-Menü, sonst Download */
export async function shareFile(name, content, type = 'application/json', text = '') {
  const file = new File([content], name, { type });
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try { await navigator.share({ files: [file], title: name, text }); return true; } catch (e) { if (e.name === 'AbortError') return false; }
  }
  downloadFile(name, content, type);
  return true;
}

export function pickFile(accept = '*/*', capture = false) {
  return new Promise((resolve) => {
    const i = document.createElement('input');
    i.type = 'file'; i.accept = accept;
    if (capture) i.setAttribute('capture', 'environment');
    i.style.display = 'none';
    i.onchange = () => { resolve(i.files[0] || null); i.remove(); };
    document.body.appendChild(i); i.click();
  });
}

/** Bild verkleinern → dataURL (JPEG) */
export function resizeImage(file, max = 1400, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const s = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement('canvas');
      c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height);
      ctx.drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(img.src);
      resolve(c.toDataURL('image/jpeg', quality));
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

/** Erlaubtes HTML für Lernzettel (z. B. aus geteilten Dateien) */
const ALLOWED = new Set(['P', 'DIV', 'BR', 'B', 'STRONG', 'I', 'EM', 'U', 'MARK', 'H2', 'H3', 'UL', 'OL', 'LI', 'TABLE', 'TBODY', 'THEAD', 'TR', 'TD', 'TH', 'IMG', 'FIGURE', 'FIGCAPTION', 'SPAN', 'SUB', 'SUP', 'BLOCKQUOTE', 'HR']);
export function sanitize(html) {
  const doc = new DOMParser().parseFromString(`<div>${html}</div>`, 'text/html');
  const walk = (el) => {
    [...el.children].forEach((c) => {
      if (!ALLOWED.has(c.tagName)) {
        if (['SCRIPT', 'STYLE', 'IFRAME', 'OBJECT', 'EMBED', 'LINK', 'META'].includes(c.tagName)) { c.remove(); return; }
        const frag = document.createDocumentFragment();
        while (c.firstChild) frag.appendChild(c.firstChild);
        c.replaceWith(frag); walk(el); return;
      }
      [...c.attributes].forEach((a) => {
        const n = a.name.toLowerCase();
        if (c.tagName === 'IMG' && n === 'src' && a.value.startsWith('data:image/')) return;
        if (n === 'class' && /^(c-[a-z]+|tip|small)$/.test(a.value)) return;
        if (n === 'data-color') return;
        c.removeAttribute(a.name);
      });
      walk(c);
    });
  };
  walk(doc.body.firstChild);
  return doc.body.firstChild.innerHTML;
}
