// Lernzettel: Liste, Editor, Bilder beschriften, Abfrage (Lückentext + Karten)
import { $, $$, esc, attr, modal, toast, confirmDlg, debounce, pickFile, resizeImage, checkAnswer, shuffle } from '../ui.js';
import * as S from '../store.js';
import { route, go, refresh, pass } from '../nav.js';
import * as IO from '../io.js';
import { recognize } from '../ocr.js';
import { celebrate } from '../app.js';

const { state } = S;
const SEL = { ed: null, range: null };
document.addEventListener('selectionchange', () => {
  const s = getSelection();
  if (SEL.ed && document.body.contains(SEL.ed) && s.rangeCount && SEL.ed.contains(s.anchorNode)) SEL.range = s.getRangeAt(0).cloneRange();
});

route('/notes/:id', ({ id }) => {
  const a = S.area(id); if (!a) return go('/home', true);
  const units = S.unitsOf(id);
  const notes = S.notesOf(id);
  const groups = [...units.map((u) => ({ u, list: notes.filter((n) => n.unitId === u.id) })), { u: null, list: notes.filter((n) => !n.unitId || !S.unit(n.unitId)) }].filter((g) => g.list.length);
  return {
    title: 'Lernzettel', sub: a.name, back: `/area/${id}`, color: a.color,
    html: `
    <button class="btn primary block" id="new">＋ Neuer Lernzettel</button>
    ${groups.map((g) => `<h3 class="book">${esc(g.u ? g.u.name : 'Ohne Unit')}</h3><div class="list">${g.list.map((n) => `<a class="list-row" href="#/note/${n.id}"><span class="ic">📝</span><span class="grow">${esc(n.title)}<small>${(n.html.match(/<mark/g) || []).length} Lücken · ${S.cardsOf(n.id).length} Karten</small></span><span class="chev">›</span></a>`).join('')}</div>`).join('')
      || '<div class="empty">Noch keine Lernzettel. Tipp: Markierte Begriffe werden später automatisch abgefragt.</div>'}`,
    mount(root) {
      $('#new', root).addEventListener('click', () => {
        if (!units.length) return create(null);
        modal({
          title: 'Neuer Lernzettel',
          body: `<label class="field"><span>Unit / Thema</span><select class="input" id="nn-u">${units.map((u) => `<option value="${u.id}">${esc(u.name)}</option>`).join('')}<option value="">Ohne Unit</option></select></label>`,
          actions: [{ label: 'Abbrechen' }, { label: 'Anlegen', primary: true, onClick: (w) => create($('#nn-u', w).value || null) }],
        });
      });
      async function create(unitId) { const n = await S.save('notes', { areaId: id, unitId, title: 'Neuer Lernzettel', html: '<p></p>' }); go(`/note/${n.id}`); }
    },
  };
});

// ---------- Editor ----------
route('/note/:id', ({ id }) => {
  const n = state.notes.find((x) => x.id === id); if (!n) return go('/home', true);
  const a = S.area(n.areaId);
  const back = n.unitId && S.unit(n.unitId) ? `/unit/${n.unitId}` : `/notes/${a.id}`;
  const cards = S.cardsOf(id);
  return {
    title: 'Lernzettel', sub: a.name, back, color: a.color,
    actions: [{ icon: '🎯', label: 'Abfragen', onClick: () => go(`/notequiz/${id}`) }],
    menu: [
      { label: 'Unit ändern', icon: '📂', onClick: () => moveNote(n) },
      { label: 'Drucken / PDF', icon: '🖨', onClick: () => IO.printHTML(n.title, n.html + (cards.length ? `<h2>Fragen</h2><ol>${cards.map((c) => `<li><b>${esc(c.q)}</b><br>${esc(c.a)}</li>`).join('')}</ol>` : '')) },
      { label: 'Lernzettel löschen', icon: '🗑', danger: true, onClick: async () => { if (await confirmDlg(`„${n.title}“ löschen?`, 'Löschen', true)) { await S.remove('items', cards.map((c) => c.id)); await S.remove('notes', id); go(back); } } },
    ],
    html: `
    <input class="input title-in" id="ttl" value="${attr(n.title)}" placeholder="Titel">
    <div class="toolbar" id="tb">
      <button data-cmd="h2" title="Überschrift">H</button>
      <button data-cmd="bold" title="Fett"><b>B</b></button>
      <button data-cmd="mark" title="Markieren = Abfrage-Lücke" class="mk"><mark>Lücke</mark></button>
      <button data-cmd="ul" title="Liste">•</button>
      <button data-cmd="ol" title="Nummerierte Liste">1.</button>
      <button data-cmd="img" title="Bild einfügen">🖼</button>
      <button data-cmd="ocr" title="Text aus Foto">🔤</button>
      <button data-cmd="undo" title="Rückgängig">↶</button>
    </div>
    <div class="editor" id="ed" contenteditable="true" spellcheck="true">${n.html}</div>
    <p class="hint">Tipp: Text auswählen und <mark>Lücke</mark> tippen – diese Begriffe werden abgefragt. Bild antippen zum Beschriften.</p>
    <div class="sec-head"><h2 class="sec">Frage-Karten (${cards.length})</h2><button class="btn small" id="add-card">＋ Karte</button></div>
    <div class="list">${cards.map((c) => `<button class="list-row" data-c="${c.id}"><span class="grow"><b>${esc(c.q)}</b><small>${esc(c.a)}</small></span></button>`).join('') || '<p class="hint">Karten mit Frage und Antwort – werden zusammen mit den Vokabeln im Karteikasten abgefragt.</p>'}</div>
    <button class="btn primary big block" id="quiz">🎯 Lernzettel abfragen</button>`,
    mount(root) {
      const ed = $('#ed', root), ttl = $('#ttl', root);
      const saveNow = async () => { n.html = ed.innerHTML; n.title = ttl.value.trim() || 'Lernzettel'; await S.save('notes', n); };
      const save = debounce(saveNow, 600);
      ed.addEventListener('input', save); ttl.addEventListener('input', save);
      window.addEventListener('hashchange', saveNow, { once: true });
      // Auswahl merken (iOS verliert sie beim Antippen der Leiste)
      SEL.ed = ed; SEL.range = null;
      const restore = () => { if (SEL.range) { const s = getSelection(); s.removeAllRanges(); s.addRange(SEL.range); } };
      $$('#tb button', root).forEach((b) => {
        b.addEventListener('pointerdown', (e) => e.preventDefault());
        b.addEventListener('click', async () => {
          const c = b.dataset.cmd;
          if (c === 'img') return insertImage(ed, save);
          if (c === 'ocr') return insertOcr(ed, a, save);
          ed.focus(); restore();
          if (c === 'h2') document.execCommand('formatBlock', false, document.queryCommandValue('formatBlock') === 'h2' ? 'p' : 'h2');
          if (c === 'bold') document.execCommand('bold');
          if (c === 'ul') document.execCommand('insertUnorderedList');
          if (c === 'ol') document.execCommand('insertOrderedList');
          if (c === 'undo') document.execCommand('undo');
          if (c === 'mark') toggleMark(ed);
          save();
        });
      });
      ed.addEventListener('click', (e) => {
        const img = e.target.closest('img'); if (!img) return;
        imageMenu(img, save);
      });
      $('#add-card', root).addEventListener('click', () => cardForm(null, n));
      $$('[data-c]', root).forEach((b) => b.addEventListener('click', () => cardForm(state.items.find((x) => x.id === b.dataset.c), n)));
      $('#quiz', root).addEventListener('click', async () => { await saveNow(); go(`/notequiz/${id}`); });
      if (n.title === 'Neuer Lernzettel') { ttl.select(); }
    },
  };
});

function toggleMark(ed) {
  const sel = getSelection(); if (!sel.rangeCount) return;
  const r = sel.getRangeAt(0);
  const node = r.commonAncestorContainer.nodeType === 1 ? r.commonAncestorContainer : r.commonAncestorContainer.parentElement;
  const existing = node.closest('mark');
  if (existing && ed.contains(existing)) {
    const frag = document.createDocumentFragment();
    while (existing.firstChild) frag.appendChild(existing.firstChild);
    existing.replaceWith(frag); return;
  }
  if (r.collapsed) return toast('Erst ein Wort auswählen');
  const m = document.createElement('mark');
  try { r.surroundContents(m); } catch (_) { m.appendChild(r.extractContents()); r.insertNode(m); }
  sel.removeAllRanges();
}

async function insertImage(ed, save) {
  const f = await pickFile('image/*'); if (!f) return;
  const src = await resizeImage(f);
  ed.focus();
  const fig = `<figure><img src="${src}"><figcaption>Bildunterschrift</figcaption></figure><p></p>`;
  if (!document.execCommand('insertHTML', false, fig)) ed.insertAdjacentHTML('beforeend', fig);
  save();
}

async function insertOcr(ed, a, save) {
  const f = await pickFile('image/*'); if (!f) return;
  const lang = a.type === 'lang' ? S.LANGS[a.key].ocr : 'deu';
  const m = modal({ title: 'Texterkennung', body: `<div class="progress"><i id="ob"></i></div><p id="om" class="hint center">Starte …</p>` });
  try {
    const text = await recognize(f, lang, (p, msg) => { const b = $('#ob', m.el); if (b) b.style.width = Math.round(p * 100) + '%'; const t = $('#om', m.el); if (t) t.textContent = msg; });
    m.close();
    modal({
      title: 'Erkannter Text', wide: true,
      body: `<p class="hint">Korrigieren und übernehmen:</p><textarea class="input" id="ot" rows="12">${esc(text.trim())}</textarea>`,
      actions: [{ label: 'Abbrechen' }, {
        label: 'Einfügen', primary: true, onClick: (w) => {
          const html = $('#ot', w).value.split(/\n{2,}/).map((p) => `<p>${esc(p).replace(/\n/g, '<br>')}</p>`).join('');
          ed.insertAdjacentHTML('beforeend', html); save();
        },
      }],
    });
  } catch (e) { m.close(); toast(e.message || 'Texterkennung fehlgeschlagen', 4000); }
}

function imageMenu(img, save) {
  const m = modal({ body: `<div class="menu"><button class="menu-item" data-a="draw">🖊 Beschriften / Zeichnen</button><button class="menu-item" data-a="small">↔︎ Größe umschalten</button><button class="menu-item danger" data-a="del">🗑 Bild entfernen</button></div>` });
  m.el.classList.add('sheet');
  m.el.addEventListener('click', (e) => {
    const b = e.target.closest('[data-a]'); if (!b) return;
    m.close();
    if (b.dataset.a === 'del') { (img.closest('figure') || img).remove(); save(); }
    if (b.dataset.a === 'small') { img.classList.toggle('c-small'); if (!img.className) img.removeAttribute('class'); save(); }
    if (b.dataset.a === 'draw') annotate(img.src).then((src) => { if (src) { img.src = src; save(); } });
  });
}

// ---------- Bild beschriften ----------
export function annotate(src) {
  return new Promise((resolve) => {
    const m = modal({
      wide: true,
      body: `<div class="annot">
        <div class="annot-tools">
          <button data-t="pen" class="on">✏️</button><button data-t="arrow">➝</button><button data-t="text">T</button><button data-t="rect">▭</button>
          <span class="sep"></span>
          ${['#e11d48', '#2563eb', '#16a34a', '#111827'].map((c, i) => `<button class="col ${i ? '' : 'on'}" data-c="${c}" style="--c:${c}"></button>`).join('')}
          <span class="sep"></span><button data-t="undo">↶</button>
        </div>
        <div class="annot-canvas"><canvas id="cv"></canvas></div>
        <div class="modal-actions"><button class="btn" data-x>Abbrechen</button><button class="btn primary" data-ok>Speichern</button></div>
      </div>`,
    });
    const cv = $('#cv', m.el), ctx = cv.getContext('2d');
    const img = new Image();
    let tool = 'pen', color = '#e11d48';
    const history = [];
    img.onload = () => {
      cv.width = img.naturalWidth; cv.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0);
      history.push(ctx.getImageData(0, 0, cv.width, cv.height));
    };
    img.src = src;
    const lw = () => Math.max(3, cv.width / 250);
    const pos = (e) => { const r = cv.getBoundingClientRect(); return { x: (e.clientX - r.left) * (cv.width / r.width), y: (e.clientY - r.top) * (cv.height / r.height) }; };
    let start = null, snap = null;
    cv.addEventListener('pointerdown', async (e) => {
      e.preventDefault(); const p = pos(e);
      if (tool === 'text') {
        const t = prompt('Beschriftung:'); if (!t) return;
        const fs = Math.max(18, cv.width / 28);
        ctx.font = `bold ${fs}px -apple-system, sans-serif`; ctx.lineWidth = fs / 5; ctx.strokeStyle = '#fff'; ctx.fillStyle = color; ctx.lineJoin = 'round';
        ctx.strokeText(t, p.x, p.y); ctx.fillText(t, p.x, p.y);
        history.push(ctx.getImageData(0, 0, cv.width, cv.height)); return;
      }
      start = p; snap = ctx.getImageData(0, 0, cv.width, cv.height);
      cv.setPointerCapture(e.pointerId);
      ctx.strokeStyle = color; ctx.lineWidth = lw(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      if (tool === 'pen') { ctx.beginPath(); ctx.moveTo(p.x, p.y); }
    });
    cv.addEventListener('pointermove', (e) => {
      if (!start) return; e.preventDefault(); const p = pos(e);
      if (tool === 'pen') { ctx.lineTo(p.x, p.y); ctx.stroke(); return; }
      ctx.putImageData(snap, 0, 0); ctx.strokeStyle = color; ctx.lineWidth = lw();
      if (tool === 'rect') { ctx.strokeRect(start.x, start.y, p.x - start.x, p.y - start.y); }
      if (tool === 'arrow') {
        ctx.beginPath(); ctx.moveTo(start.x, start.y); ctx.lineTo(p.x, p.y); ctx.stroke();
        const ang = Math.atan2(p.y - start.y, p.x - start.x), h = lw() * 5;
        ctx.beginPath(); ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - h * Math.cos(ang - 0.45), p.y - h * Math.sin(ang - 0.45));
        ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - h * Math.cos(ang + 0.45), p.y - h * Math.sin(ang + 0.45)); ctx.stroke();
      }
    });
    const end = () => { if (!start) return; start = null; history.push(ctx.getImageData(0, 0, cv.width, cv.height)); };
    cv.addEventListener('pointerup', end); cv.addEventListener('pointercancel', end);
    $$('[data-t]', m.el).forEach((b) => b.addEventListener('click', () => {
      if (b.dataset.t === 'undo') { if (history.length > 1) { history.pop(); ctx.putImageData(history[history.length - 1], 0, 0); } return; }
      tool = b.dataset.t; $$('[data-t]', m.el).forEach((x) => x.classList.toggle('on', x === b));
    }));
    $$('[data-c]', m.el).forEach((b) => b.addEventListener('click', () => { color = b.dataset.c; $$('[data-c]', m.el).forEach((x) => x.classList.toggle('on', x === b)); }));
    $('[data-x]', m.el).addEventListener('click', () => { m.close(); resolve(null); });
    $('[data-ok]', m.el).addEventListener('click', () => { const out = cv.toDataURL('image/jpeg', 0.85); m.close(); resolve(out); });
  });
}

function moveNote(n) {
  const units = S.unitsOf(n.areaId);
  modal({
    title: 'Unit ändern',
    body: `<select class="input" id="mn-u">${units.map((u) => `<option value="${u.id}" ${u.id === n.unitId ? 'selected' : ''}>${esc(u.name)}</option>`).join('')}<option value="">Ohne Unit</option></select>`,
    actions: [{ label: 'Abbrechen' }, {
      label: 'Speichern', primary: true, onClick: async (w) => {
        n.unitId = $('#mn-u', w).value || null; await S.save('notes', n);
        const cs = S.cardsOf(n.id); cs.forEach((c) => { c.unitId = n.unitId; }); await S.saveMany('items', cs); refresh();
      },
    }],
  });
}

function cardForm(c, n) {
  const isNew = !c;
  c = c || { kind: 'card', areaId: n.areaId, unitId: n.unitId, noteId: n.id, box: 0 };
  modal({
    title: isNew ? 'Neue Karte' : 'Karte bearbeiten',
    body: `<label class="field"><span>Frage</span><textarea class="input" id="cf-q" rows="2">${esc(c.q || '')}</textarea></label>
      <label class="field"><span>Antwort</span><textarea class="input" id="cf-a" rows="3">${esc(c.a || '')}</textarea></label>`,
    actions: [
      ...(isNew ? [] : [{ label: 'Löschen', danger: true, onClick: async () => { await S.remove('items', c.id); refresh(); } }]),
      ...(isNew ? [{ label: 'Speichern + nächste', onClick: async (w) => { if (!fill(w)) return false; await S.save('items', c); refresh(); setTimeout(() => cardForm(null, n), 120); } }] : []),
      { label: 'Speichern', primary: true, onClick: async (w) => { if (!fill(w)) return false; await S.save('items', c); refresh(); } },
    ],
  });
  function fill(w) { c.q = $('#cf-q', w).value.trim(); c.a = $('#cf-a', w).value.trim(); if (!c.q || !c.a) { toast('Frage und Antwort ausfüllen'); return false; } return true; }
}

// ---------- Abfrage ----------
route('/notequiz/:id', ({ id }) => {
  const n = state.notes.find((x) => x.id === id); if (!n) return go('/home', true);
  const a = S.area(n.areaId);
  const cards = S.cardsOf(id);
  const marks = (n.html.match(/<mark/g) || []).length;
  return {
    title: n.title, sub: 'Abfrage', back: `/note/${id}`, color: a.color, tabs: false,
    html: `
    <div class="seg" id="seg"><button data-v="gap" class="on">Lückentext (${marks})</button><button data-v="cards">Karten (${cards.length})</button></div>
    <div id="pane"></div>`,
    mount(root) {
      const pane = $('#pane', root);
      const show = (v) => {
        $$('#seg button', root).forEach((b) => b.classList.toggle('on', b.dataset.v === v));
        if (v === 'cards') {
          pane.innerHTML = cards.length ? `<div class="card center"><p>${cards.length} Karten aus diesem Lernzettel</p><button class="btn primary big block" id="go">Karten abfragen</button></div>` : '<div class="empty">Noch keine Karten angelegt.</div>';
          $('#go', pane)?.addEventListener('click', () => { pass.quiz = { ids: cards.map((c) => c.id), mode: 'flip', title: n.title, back: `/notequiz/${id}` }; go('/quiz'); });
          return;
        }
        gapQuiz(pane, n, marks);
      };
      $$('#seg button', root).forEach((b) => b.addEventListener('click', () => show(b.dataset.v)));
      show(marks || !cards.length ? 'gap' : 'cards');
    },
  };
});

function gapQuiz(pane, n, marks) {
  if (!marks) { pane.innerHTML = '<div class="empty">Keine markierten Begriffe. Im Editor Text auswählen und „Lücke“ tippen.</div>'; return; }
  const box = document.createElement('div');
  box.className = 'editor readonly gapq';
  box.innerHTML = n.html;
  const answers = [];
  $$('mark', box).forEach((m, i) => {
    const sol = m.textContent.trim();
    answers.push(sol);
    if (sol.length > 28 || /\n/.test(sol)) {
      m.outerHTML = `<button class="gap-reveal" data-i="${i}">Antippen zum Aufdecken</button>`;
    } else {
      const w = Math.max(4, Math.min(24, sol.length + 2));
      m.outerHTML = `<input class="gap" data-i="${i}" style="width:${w}ch" autocapitalize="off" autocorrect="off" spellcheck="false">`;
    }
  });
  pane.innerHTML = '';
  pane.appendChild(box);
  pane.insertAdjacentHTML('beforeend', `<div class="qbtns sticky"><button class="btn" id="sol">Lösung zeigen</button><button class="btn primary" id="chk">Prüfen</button></div><div id="score" class="center"></div>`);
  $$('.gap-reveal', box).forEach((b) => b.addEventListener('click', () => { b.outerHTML = `<mark class="revealed">${esc(answers[+b.dataset.i])}</mark>`; }));
  $('#chk', pane).addEventListener('click', async () => {
    let ok = 0, total = 0;
    $$('.gap', box).forEach((g) => {
      total++;
      const r = checkAnswer(g.value, [answers[+g.dataset.i]], { accentTolerant: state.profile.settings.accentTolerant });
      g.classList.toggle('good', r.ok); g.classList.toggle('bad', !r.ok);
      if (r.ok) ok++;
    });
    $('#score', pane).innerHTML = `<p><b>${ok} / ${total}</b> richtig</p>`;
    if (total && !pane.dataset.counted) { pane.dataset.counted = '1'; const g = await S.recordActivity(total); if (g) celebrate(); }
  });
  $('#sol', pane).addEventListener('click', () => {
    $$('.gap', box).forEach((g) => { if (!g.classList.contains('good')) { g.value = answers[+g.dataset.i]; g.classList.add('shown'); } });
    $$('.gap-reveal', box).forEach((b) => { b.outerHTML = `<mark class="revealed">${esc(answers[+b.dataset.i])}</mark>`; });
  });
}

export { shuffle };
