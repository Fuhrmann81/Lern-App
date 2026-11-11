// Bereich, Unit, Vokabel-Formular, Wörterbuch, Foto-Import
import { $, $$, esc, attr, modal, toast, confirmDlg, promptDlg, pickFile } from '../ui.js';
import * as S from '../store.js';
import { route, go, refresh } from '../nav.js';
import * as IO from '../io.js';
import { recognize, parseVocabLines, guessLatin } from '../ocr.js';
import { speak, ttsAvailable } from '../speech.js';
import * as L from '../engines/latin.js';
import { IRREGULAR } from '../engines/english.js';
import { STARTER_AFFIXES } from '../engines/med.js';
import { openMenu, startQuiz } from '../app.js';

const { state } = S;

export function ttsLang(a) {
  const l = S.langOf(a); if (!l || !l.tts) return null;
  return l.tts === 'en' ? state.profile.settings.voiceEn : l.tts;
}
export function sayFor(a, text) { const lang = ttsLang(a); if (lang && text) speak(text, lang, state.profile.settings.rate); }

/** Anzeige des Fremdwort-Eintrags inkl. Grammatik-Infos */
export function termLabel(v, a) {
  if (a?.key === 'la' || a?.key === 'med') {
    if (v.wortart === 'Nomen' && v.genitiv) return `${v.term}, ${v.genitiv}${v.genus ? ' ' + v.genus : ''}`;
    if (v.wortart === 'Verb' && v.stammformen) return v.stammformen;
    if (v.wortart === 'Adjektiv' && v.formen) return v.formen;
  }
  if (a?.key === 'fr' && v.genus) return `${v.term} (${v.genus})`;
  return v.term;
}
const plainTerm = (t) => (t || '').replace(/^(le |la |les |l'|l’|the |to )/i, '');

// ---------- Bereich ----------
route('/area/:id', ({ id }) => {
  const a = S.area(id); if (!a) return go('/home', true);
  const lang = S.langOf(a);
  const units = S.unitsOf(id);
  const items = state.items.filter((i) => i.areaId === id);
  const due = items.filter((i) => S.isDue(i)).length;
  const notes = S.notesOf(id);
  const books = [...new Set(units.map((u) => u.book || ''))];
  const tools = [
    { href: `#/quizsetup/${id}`, icon: '🎯', label: 'Abfrage', meta: due ? `${due} fällig` : `${items.length} Einträge` },
    { href: `#/dict/${id}`, icon: '📖', label: a.type === 'lang' ? 'Wörterbuch' : 'Begriffe', meta: `${S.vocabOf(id).length} Einträge` },
    { href: `#/notes/${id}`, icon: '📝', label: 'Lernzettel', meta: `${notes.length}` },
  ];
  if (a.type === 'lang') tools.push({ href: `#/grammar/${id}`, icon: '📐', label: 'Grammatik', meta: a.key === 'la' ? 'Regeln & Formen' : a.key === 'fr' ? 'Regeln & Konjugation' : a.key === 'en' ? 'Regeln & Verben' : 'Regeln & Plural' });
  if (lang && lang.tts) tools.push({ href: `#/speak/${id}`, icon: '🗣️', label: 'Aussprache', meta: 'Hören & Sprechen' });
  const unitRow = (u) => {
    const its = state.items.filter((i) => i.unitId === u.id);
    const pr = S.progress(its); const d = its.filter((i) => S.isDue(i)).length;
    return `<a class="list-row" href="#/unit/${u.id}"><span class="grow">${esc(u.name)}<small>${its.length} Einträge · ${S.notesOf(id, u.id).length} Lernzettel</small><span class="bar"><i style="width:${pr.pct}%"></i></span></span>${d ? `<span class="badge static">${d}</span>` : ''}<span class="chev">›</span></a>`;
  };
  const menu = [
    { label: 'Umbenennen / Symbol', icon: '✏️', onClick: () => editArea(a) },
    ...(a.key === 'en' ? [{ label: 'Unregelmäßige Verben als Vokabeln hinzufügen', icon: '➕', onClick: () => addStarter(a, 'en') }] : []),
    ...(a.key === 'med' ? [{ label: 'Startpaket Präfixe/Suffixe hinzufügen', icon: '➕', onClick: () => addStarter(a, 'med') }] : []),
    { label: 'Bereich löschen', icon: '🗑', danger: true, onClick: async () => { if (await confirmDlg(`„${a.name}“ mit allen Inhalten löschen?`, 'Löschen', true)) { await S.removeArea(a.id); go('/home'); } } },
  ];
  return {
    title: `${a.icon} ${a.name}`, back: '/home', color: a.color, menu,
    html: `
    <div class="tools">${tools.map((t) => `<a class="tool" href="${t.href}"><span class="tool-ic">${t.icon}</span><span>${t.label}</span><small>${t.meta}</small></a>`).join('')}</div>
    <div class="sec-head"><h2 class="sec">${a.type === 'lang' ? 'Units / Lektionen' : 'Themen'}</h2><button class="btn small" id="new-unit">＋ Neu</button></div>
    ${units.length ? books.map((b) => `${books.length > 1 || b ? `<h3 class="book">${esc(b || 'Ohne Lehrwerk')}</h3>` : ''}<div class="list">${units.filter((u) => (u.book || '') === b).map(unitRow).join('')}</div>`).join('')
      : `<div class="empty">Noch keine ${a.type === 'lang' ? 'Units' : 'Themen'}.<br>Lege eine an, z. B. „${a.type === 'lang' ? 'Unit 1' : 'Zellbiologie'}“.</div>`}`,
    mount(root) { $('#new-unit', root).addEventListener('click', () => editUnit(null, a)); },
  };
});

function editArea(a) {
  modal({
    title: 'Bereich bearbeiten',
    body: `<div class="row"><input class="input" id="ea-icon" value="${attr(a.icon)}" maxlength="4" style="width:3.5em;text-align:center"><input class="input" id="ea-name" value="${attr(a.name)}"></div>
    <label class="field"><span>Farbe</span><input type="color" id="ea-col" value="${attr(a.color)}"></label>`,
    actions: [{ label: 'Abbrechen' }, { label: 'Speichern', primary: true, onClick: async (w) => { a.name = $('#ea-name', w).value.trim() || a.name; a.icon = $('#ea-icon', w).value || a.icon; a.color = $('#ea-col', w).value; await S.save('areas', a); refresh(); } }],
  });
}

export function editUnit(u, a) {
  const books = [...new Set(S.unitsOf(a.id).map((x) => x.book).filter(Boolean))];
  modal({
    title: u ? 'Unit bearbeiten' : (a.type === 'lang' ? 'Neue Unit / Lektion' : 'Neues Thema'),
    body: `
    <label class="field"><span>Name</span><input class="input" id="eu-name" value="${attr(u?.name || '')}" placeholder="${a.type === 'lang' ? 'z. B. Unit 3 – At the market' : 'z. B. Herz-Kreislauf'}"></label>
    <label class="field"><span>Lehrwerk / Gruppe (optional)</span><input class="input" id="eu-book" list="eu-books" value="${attr(u?.book ?? books[books.length - 1] ?? '')}" placeholder="z. B. Green Line 5, Campus B 2, Semester 1"><datalist id="eu-books">${books.map((b) => `<option value="${attr(b)}">`).join('')}</datalist></label>`,
    actions: [{ label: 'Abbrechen' }, {
      label: 'Speichern', primary: true, onClick: async (w) => {
        const name = $('#eu-name', w).value.trim(); if (!name) { toast('Bitte einen Namen eingeben'); return false; }
        const obj = u || { areaId: a.id, order: S.unitsOf(a.id).length };
        obj.name = name; obj.book = $('#eu-book', w).value.trim();
        const saved = await S.save('units', obj);
        if (!u) go(`/unit/${saved.id}`); else refresh();
      },
    }],
  });
}

async function addStarter(a, kind) {
  const name = kind === 'en' ? 'Unregelmäßige Verben' : 'Präfixe & Suffixe';
  if (state.units.some((u) => u.areaId === a.id && u.name === name)) return toast('Ist schon vorhanden');
  const u = await S.save('units', { areaId: a.id, name, book: 'Startpaket', order: S.unitsOf(a.id).length });
  const rows = kind === 'en'
    ? IRREGULAR.map(([inf, past, pp, de]) => ({ term: inf, translation: de, example: `${past} – ${pp}` }))
    : STARTER_AFFIXES.map(([t, de, art]) => ({ term: t, translation: de, wortart: art === 'Wortstamm' ? 'Sonstiges' : art }));
  await S.saveMany('items', rows.map((r) => ({ ...r, kind: 'vocab', areaId: a.id, unitId: u.id, box: 0 })));
  toast(`${rows.length} Einträge hinzugefügt`);
  go(`/unit/${u.id}`);
}

// ---------- Unit ----------
route('/unit/:id', ({ id }) => {
  const u = S.unit(id); if (!u) return go('/home', true);
  const a = S.area(u.areaId);
  const vocab = S.vocabOf(a.id, id).sort((x, y) => x.created - y.created);
  const notes = S.notesOf(a.id, id);
  const tts = !!ttsLang(a);
  const dots = (b) => `<span class="dots">${[1, 2, 3, 4, 5].map((i) => `<i class="${(b || 0) >= i ? 'on' : ''}"></i>`).join('')}</span>`;
  return {
    title: u.name, sub: [a.name, u.book].filter(Boolean).join(' · '), back: `/area/${a.id}`, color: a.color,
    menu: [
      { label: 'Umbenennen / Lehrwerk', icon: '✏️', onClick: () => editUnit(u, a) },
      { label: 'Teilen (an Geschwister o. a.)', icon: '📤', onClick: () => IO.shareUnit(u.id) },
      { label: 'Vokabelliste drucken / PDF', icon: '🖨', onClick: () => printUnit(u, a, vocab) },
      { label: 'Unit löschen', icon: '🗑', danger: true, onClick: async () => { if (await confirmDlg(`„${u.name}“ mit ${vocab.length} Einträgen und ${notes.length} Lernzetteln löschen?`, 'Löschen', true)) { await S.removeUnit(u.id); go(`/area/${a.id}`); } } },
    ],
    html: `
    <div class="actions-row">
      <button class="btn primary" id="quiz" ${vocab.length ? '' : 'disabled'}>🎯 Abfragen</button>
      <button class="btn" id="add">＋ ${a.type === 'lang' ? 'Vokabel' : 'Begriff'}</button>
      <button class="btn" id="photo">📷 Foto</button>
      <button class="btn" id="imp">📥 Import</button>
    </div>
    <div class="seg"><button class="on" data-tab="v">${a.type === 'lang' ? 'Vokabeln' : 'Begriffe'} (${vocab.length})</button><button data-tab="n">Lernzettel (${notes.length})</button></div>
    <div data-pane="v">
      ${vocab.length ? `<div class="list vocab">${vocab.map((v) => `<div class="list-row" data-v="${v.id}">
        <span class="grow"><b>${esc(termLabel(v, a))}</b><small>${esc(v.translation)}</small></span>
        ${dots(v.box)}${tts ? `<button class="icon-btn" data-say="${v.id}" aria-label="Vorlesen">🔊</button>` : ''}</div>`).join('')}</div>`
      : `<div class="empty">Noch leer. Tippe „＋ ${a.type === 'lang' ? 'Vokabel' : 'Begriff'}“, nutze den Foto-Import oder importiere eine Liste.</div>`}
    </div>
    <div data-pane="n" hidden>
      <div class="list">${notes.map((n) => `<a class="list-row" href="#/note/${n.id}"><span class="ic">📝</span><span class="grow">${esc(n.title)}<small>${S.cardsOf(n.id).length} Karten</small></span><span class="chev">›</span></a>`).join('')}</div>
      <button class="btn block" id="new-note">＋ Lernzettel</button>
    </div>`,
    mount(root) {
      const tab = sessionStorage.getItem('unitTab');
      const setTab = (t) => { $$('[data-tab]', root).forEach((b) => b.classList.toggle('on', b.dataset.tab === t)); $$('[data-pane]', root).forEach((p) => { p.hidden = p.dataset.pane !== t; }); sessionStorage.setItem('unitTab', t); };
      if (tab) setTab(tab);
      $$('[data-tab]', root).forEach((b) => b.addEventListener('click', () => setTab(b.dataset.tab)));
      $('#quiz', root).addEventListener('click', () => go(`/quizsetup/${a.id}?unit=${u.id}`));
      $('#add', root).addEventListener('click', () => vocabForm(null, a, u.id));
      $('#photo', root).addEventListener('click', () => photoImport(a, u.id));
      $('#imp', root).addEventListener('click', () => importMenu(a, u.id));
      $('#new-note', root).addEventListener('click', async () => { const n = await S.save('notes', { areaId: a.id, unitId: u.id, title: 'Neuer Lernzettel', html: '<p></p>' }); go(`/note/${n.id}`); });
      $$('[data-v]', root).forEach((r) => r.addEventListener('click', (e) => {
        if (e.target.closest('[data-say]')) return;
        vocabForm(state.items.find((x) => x.id === r.dataset.v), a, u.id);
      }));
      $$('[data-say]', root).forEach((b) => b.addEventListener('click', () => { const v = state.items.find((x) => x.id === b.dataset.say); sayFor(a, v.term); }));
    },
  };
});

function importMenu(a, unitId) {
  openMenu([
    { label: 'Datei (CSV, Quizlet/Anki-Export, geteilte Unit)', icon: '📄', onClick: () => IO.importFileFlow(a.id, unitId, refresh).then((ok) => ok && refresh()) },
    { label: 'Liste einfügen (Text)', icon: '📋', onClick: () => pasteImport(a, unitId) },
  ]);
}

function pasteImport(a, unitId) {
  modal({
    title: 'Liste einfügen', wide: true,
    body: `<p class="hint">Eine Vokabel pro Zeile, getrennt durch Tab, Semikolon, „ - “ oder „ = “. Z. B. aus Quizlet „Exportieren“ kopiert.</p><textarea class="input" id="pi-text" rows="10" placeholder="house - Haus&#10;tree ; Baum"></textarea>`,
    actions: [{ label: 'Abbrechen' }, {
      label: 'Weiter', primary: true, onClick: (w) => {
        const text = $('#pi-text', w).value;
        const rows = (text.includes('\t') ? IO.parseDelimited(text) : parseVocabLines(text)).filter((r) => r[0]);
        if (!rows.length) { toast('Keine Zeilen erkannt'); return false; }
        setTimeout(() => reviewRows(a, unitId, rows), 50);
      },
    }],
  });
}

// ---------- Vokabel-Formular ----------
export function vocabForm(v, a, unitId) {
  const isNew = !v;
  v = v || { kind: 'vocab', areaId: a.id, unitId, box: 0 };
  const k = a.type === 'lang' ? a.key : 'subject';
  const units = S.unitsOf(a.id);
  const f = (id, label, ph = '', extra = '') => `<label class="field" data-f="${id}"><span>${label}</span><input class="input" id="vf-${id}" value="${attr(v[id] || '')}" placeholder="${attr(ph)}" autocapitalize="off" autocorrect="off" spellcheck="false" ${extra}></label>`;
  const sel = (id, label, opts) => `<label class="field" data-f="${id}"><span>${label}</span><select class="input" id="vf-${id}">${opts.map(([val, t]) => `<option value="${val}" ${v[id] === val ? 'selected' : ''}>${t}</option>`).join('')}</select></label>`;
  let body = '';
  if (k === 'subject') body = f('term', 'Begriff') + `<label class="field"><span>Erklärung</span><textarea class="input" id="vf-translation" rows="3">${esc(v.translation || '')}</textarea></label>`;
  else {
    const L2 = S.LANGS[k];
    body += f('term', L2.foreignLabel, k === 'fr' ? 'z. B. la maison' : k === 'la' ? 'z. B. rosa' : k === 'med' ? 'z. B. musculus' : 'z. B. to grow');
    body += f('translation', 'Deutsch', 'mehrere Bedeutungen mit Komma');
    if (k === 'en') body += f('example', 'Beispielsatz (optional)') + f('phonetic', 'Lautschrift (optional)');
    if (k === 'fr') body += sel('genus', 'Genus', [['', '–'], ['m', 'maskulin (m)'], ['f', 'feminin (f)']]) + f('example', 'Beispielsatz (optional)');
    if (k === 'la' || k === 'med') {
      body += sel('wortart', 'Wortart', [['', '–'], ['Nomen', 'Nomen'], ['Verb', 'Verb'], ['Adjektiv', 'Adjektiv'], ...(k === 'med' ? [['Präfix', 'Präfix'], ['Suffix', 'Suffix']] : []), ['Sonstiges', 'Sonstiges']]);
      body += f('genitiv', 'Genitiv Sg.', 'z. B. rosae oder -ae') + sel('genus', 'Genus', [['', '–'], ['m', 'm'], ['f', 'f'], ['n', 'n']]);
      if (k === 'la') body += f('stammformen', 'Stammformen (mit Infinitiv)', 'z. B. laudare, laudo, laudavi, laudatum');
      body += f('formen', 'Adjektiv-Formen', 'z. B. bonus, a, um / brevis, e');
      if (k === 'med') body += sel('herkunft', 'Herkunft', [['', '–'], ['lat', 'lateinisch'], ['griech', 'griechisch']]);
      body += `<div id="vf-check" class="hint"></div>`;
    }
  }
  body += `<label class="field"><span>Notiz (optional)</span><input class="input" id="vf-notes" value="${attr(v.notes || '')}"></label>`;
  if (units.length > 1) body += `<label class="field"><span>Unit</span><select class="input" id="vf-unit">${units.map((u) => `<option value="${u.id}" ${u.id === v.unitId ? 'selected' : ''}>${esc(u.name)}</option>`).join('')}</select></label>`;
  if (!isNew) body += `<p class="hint">Karteikasten: Fach ${v.box || 0} von 5 · richtig ${v.stats?.right || 0} · falsch ${v.stats?.wrong || 0}</p>`;
  const collect = (w) => {
    $$('[id^=vf-]', w).forEach((el) => { const key = el.id.slice(3); if (['check', 'unit'].includes(key)) return; v[key] = el.value.trim(); });
    if ($('#vf-unit', w)) v.unitId = $('#vf-unit', w).value;
    return v.term && v.translation;
  };
  const actions = [];
  if (!isNew) actions.push({ label: 'Löschen', danger: true, onClick: async () => { await S.remove('items', v.id); refresh(); } });
  if (isNew) actions.push({ label: 'Speichern + nächste', onClick: async (w) => { if (!collect(w)) { toast('Bitte beide Seiten ausfüllen'); return false; } await S.save('items', v); toast('Gespeichert'); refresh(); setTimeout(() => vocabForm(null, a, v.unitId), 120); } });
  actions.push({ label: 'Speichern', primary: true, onClick: async (w) => { if (!collect(w)) { toast('Bitte beide Seiten ausfüllen'); return false; } await S.save('items', v); refresh(); } });
  modal({
    title: isNew ? (a.type === 'lang' ? 'Neue Vokabel' : 'Neuer Begriff') : 'Bearbeiten', body, actions,
    onMount(w) {
      if (k !== 'la' && k !== 'med') return;
      const upd = () => {
        const wa = $('#vf-wortart', w).value;
        const show = (id, on) => { const el = $(`[data-f=${id}]`, w); if (el) el.hidden = !on; };
        show('genitiv', wa === 'Nomen' || !wa); show('genus', wa === 'Nomen' || !wa); show('stammformen', wa === 'Verb' || !wa); show('formen', wa === 'Adjektiv' || !wa);
        // Live-Prüfung, ob der Formentrainer das Wort versteht
        const chk = $('#vf-check', w); const term = $('#vf-term', w).value;
        let msg = '';
        if (wa === 'Nomen' && $('#vf-genitiv', w).value) {
          const an = L.analyzeNoun(term, $('#vf-genitiv', w).value, $('#vf-genus', w).value);
          msg = an ? `✓ ${L.DECL_NAMES[an.decl]} – Formentrainer kann dieses Wort üben.` : '⚠️ Deklination nicht erkannt – bitte Genitiv und Genus prüfen.';
        } else if (wa === 'Verb' && $('#vf-stammformen', w)?.value) {
          const vb = L.analyzeVerb($('#vf-stammformen', w).value, term);
          msg = vb ? `✓ ${L.CONJ_NAMES[vb.conj]} – Formentrainer kann dieses Verb üben.` : '⚠️ Konjugation nicht erkannt – bitte Infinitiv mit angeben.';
        } else if (wa === 'Adjektiv' && $('#vf-formen', w).value) {
          msg = L.analyzeAdj($('#vf-formen', w).value) ? '✓ Adjektiv erkannt.' : '⚠️ Formen nicht erkannt (Beispiel: bonus, a, um).';
        }
        chk.textContent = msg;
      };
      $$('input,select', w).forEach((el) => el.addEventListener('input', upd));
      upd();
    },
  });
}

// ---------- Foto-Import ----------
export async function photoImport(a, unitId) {
  const file = await pickFile('image/*');
  if (!file) return;
  const lang = a.type === 'lang' ? S.LANGS[a.key].ocr : 'deu';
  const m = modal({ title: 'Texterkennung', body: `<div class="progress"><i id="ocr-bar"></i></div><p id="ocr-msg" class="hint center">Starte …</p>` });
  try {
    const text = await recognize(file, lang, (p, msg) => { const b = $('#ocr-bar', m.el); if (b) b.style.width = Math.round(p * 100) + '%'; const t = $('#ocr-msg', m.el); if (t) t.textContent = msg; });
    m.close();
    const rows = parseVocabLines(text);
    if (!rows.length) return toast('Kein Text erkannt – bitte ein schärferes Foto versuchen');
    reviewRows(a, unitId, rows);
  } catch (e) {
    m.close(); toast(e.message || 'Texterkennung fehlgeschlagen', 4000);
  }
}

/** Erkannte Zeilen prüfen und übernehmen */
export function reviewRows(a, unitId, rows) {
  const lat = a.key === 'la' || a.key === 'med';
  modal({
    title: 'Erkannte Einträge prüfen', wide: true,
    body: `<p class="hint">Bitte kontrollieren und korrigieren. Haken entfernen, um eine Zeile zu überspringen. Fehlende Übersetzungen kannst du hier ergänzen.</p>
    <div class="review">${rows.map((r, i) => `<div class="rv" data-i="${i}"><input type="checkbox" checked><input class="input" value="${attr(r[0])}" placeholder="${a.type === 'lang' ? 'Fremdsprache' : 'Begriff'}"><input class="input" value="${attr(r[1])}" placeholder="Deutsch"></div>`).join('')}</div>
    <button class="btn small" id="rv-swap">⇄ Spalten tauschen</button>`,
    actions: [{ label: 'Abbrechen' }, {
      label: 'Übernehmen', primary: true, onClick: async (w) => {
        const out = [];
        $$('.rv', w).forEach((r) => {
          const [cb, x, y] = $$('input', r);
          if (!cb.checked || !x.value.trim()) return;
          let entry = { term: x.value.trim(), translation: y.value.trim() };
          if (lat) entry = { ...entry, ...guessLatin(entry.term) };
          out.push({ ...entry, kind: 'vocab', areaId: a.id, unitId, box: 0 });
        });
        const missing = out.filter((o) => !o.translation).length;
        await S.saveMany('items', out);
        toast(`${out.length} Einträge gespeichert${missing ? ` (${missing} ohne Übersetzung)` : ''}`, 3000);
        refresh();
      },
    }],
    onMount(w) {
      $('#rv-swap', w).addEventListener('click', () => $$('.rv', w).forEach((r) => { const [, x, y] = $$('input', r); [x.value, y.value] = [y.value, x.value]; }));
    },
  });
}

function printUnit(u, a, vocab) {
  IO.printHTML(`${a.name} – ${u.name}`, `<table class="print-table"><tr><th>${a.type === 'lang' ? a.name : 'Begriff'}</th><th>Deutsch</th></tr>${vocab.map((v) => `<tr><td>${esc(termLabel(v, a))}</td><td>${esc(v.translation)}</td></tr>`).join('')}</table>`);
}

// ---------- Wörterbuch ----------
const LOOKUP = {
  en: [['dict.cc', (q) => `https://www.dict.cc/?s=${q}`], ['Langenscheidt', (q) => `https://de.langenscheidt.com/englisch-deutsch/${q}`], ['Wiktionary', (q) => `https://de.wiktionary.org/wiki/${q}`]],
  fr: [['dict.cc', (q) => `https://defr.dict.cc/?s=${q}`], ['Langenscheidt', (q) => `https://de.langenscheidt.com/franzoesisch-deutsch/${q}`], ['Wiktionary', (q) => `https://de.wiktionary.org/wiki/${q}`]],
  la: [['dict.cc', (q) => `https://dela.dict.cc/?s=${q}`], ['Langenscheidt', (q) => `https://de.langenscheidt.com/latein-deutsch/${q}`], ['Wiktionary', (q) => `https://de.wiktionary.org/wiki/${q}`]],
  med: [['DocCheck Flexikon', (q) => `https://flexikon.doccheck.com/de/Spezial:Suche?search=${q}`], ['Wiktionary', (q) => `https://de.wiktionary.org/wiki/${q}`], ['dict.cc', (q) => `https://dela.dict.cc/?s=${q}`]],
  subject: [['Wikipedia', (q) => `https://de.wikipedia.org/w/index.php?search=${q}`], ['DocCheck Flexikon', (q) => `https://flexikon.doccheck.com/de/Spezial:Suche?search=${q}`]],
};
const lookupLinks = (k, q) => (LOOKUP[k] || LOOKUP.subject).map(([n, fn]) => `<a class="chip" target="_blank" rel="noopener" href="${attr(fn(encodeURIComponent(q)))}">${n} ↗</a>`).join('');

route('/dict/:id', ({ id }) => {
  const a = S.area(id); if (!a) return go('/home', true);
  const k = a.type === 'lang' ? a.key : 'subject';
  const all = S.vocabOf(id).slice().sort((x, y) => plainTerm(x.term).localeCompare(plainTerm(y.term), 'de'));
  return {
    title: a.type === 'lang' ? 'Wörterbuch' : 'Begriffe', sub: a.name, back: `/area/${id}`, color: a.color,
    html: `
    <div class="search"><input class="input" id="q" type="search" placeholder="Suchen (${a.type === 'lang' ? 'Fremdsprache oder Deutsch' : 'Begriff oder Erklärung'})" autocapitalize="off" autocorrect="off"></div>
    <div id="res"></div>`,
    mount(root) {
      const res = $('#res', root), q = $('#q', root);
      const draw = () => {
        const s = q.value.trim().toLowerCase();
        const hits = s ? all.filter((v) => (v.term + ' ' + v.translation + ' ' + (v.genitiv || '') + ' ' + (v.stammformen || '')).toLowerCase().includes(s)) : all;
        let html = '';
        if (!s) {
          let letter = '';
          html = hits.map((v) => { const l = (plainTerm(v.term)[0] || '#').toUpperCase(); const h = l !== letter ? `<div class="letter">${(letter = l)}</div>` : ''; return h + row(v); }).join('');
        } else html = hits.map(row).join('');
        res.innerHTML = `<div class="list vocab">${html || ''}</div>${s ? `<div class="card"><p class="hint">${hits.length ? 'Weiter nachschlagen:' : 'Nicht in deinen Einträgen. Nachschlagen bei:'}</p><div class="chips">${lookupLinks(k, q.value.trim())}</div></div>` : (all.length ? '' : '<div class="empty">Noch keine Einträge. Sie erscheinen hier automatisch, sobald du Vokabeln anlegst.</div>')}`;
        $$('[data-v]', res).forEach((r) => r.addEventListener('click', () => detail(all.find((x) => x.id === r.dataset.v), a, k)));
      };
      const row = (v) => `<button class="list-row" data-v="${v.id}"><span class="grow"><b>${esc(termLabel(v, a))}</b><small>${esc(v.translation)}</small></span><span class="chev">›</span></button>`;
      q.addEventListener('input', draw);
      draw();
    },
  };
});

function detail(v, a, k) {
  const u = S.unit(v.unitId);
  let forms = '';
  if (k === 'la' || k === 'med') forms = formsTable(v);
  modal({
    title: termLabel(v, a), wide: !!forms,
    body: `
    <p class="big">${esc(v.translation)}</p>
    ${v.example ? `<p><i>${esc(v.example)}</i></p>` : ''}${v.phonetic ? `<p>[${esc(v.phonetic)}]</p>` : ''}${v.notes ? `<p class="hint">${esc(v.notes)}</p>` : ''}
    ${forms}
    <p class="hint">${u ? `Unit: ${esc(u.name)} · ` : ''}Fach ${v.box || 0}/5</p>
    ${ttsLang(a) ? `<button class="btn" id="d-say">🔊 Anhören</button>` : ''}
    <div class="chips">${lookupLinks(k, plainTerm(v.term))}</div>`,
    actions: [{ label: 'Bearbeiten', onClick: () => setTimeout(() => vocabForm(v, a, v.unitId), 50) }, { label: 'Schließen', primary: true }],
    onMount(w) { $('#d-say', w)?.addEventListener('click', () => sayFor(a, v.term)); },
  });
}

/** Formentabelle für lateinische Nomen/Verben/Adjektive */
export function formsTable(v) {
  if (v.wortart === 'Nomen' || (!v.wortart && v.genitiv)) {
    const an = L.analyzeNoun(v.term, v.genitiv, v.genus); if (!an) return '';
    const d = L.declineNoun(an);
    return `<h3>${L.DECL_NAMES[an.decl]} (${L.GENUS_NAMES[an.genus]})</h3><table class="forms"><tr><th></th><th>Singular</th><th>Plural</th></tr>${L.CASES.map((c) => `<tr><td>${c}</td><td>${d[c].Sg[0]}</td><td>${d[c].Pl[0]}</td></tr>`).join('')}</table>`;
  }
  if (v.wortart === 'Verb' && v.stammformen) {
    const vb = L.analyzeVerb(v.stammformen, v.term); if (!vb) return '';
    const t = ['praes', 'impf', 'fut1', 'perf'];
    const rows = t.map((x) => L.conjugate(vb, x, 'act'));
    return `<h3>${L.CONJ_NAMES[vb.conj]} – Aktiv</h3><div class="table-wrap"><table class="forms"><tr><th></th>${t.map((x) => `<th>${L.TENSES.find((y) => y.id === x).name}</th>`).join('')}</tr>${L.PERSONS.map((p, i) => `<tr><td>${p}</td>${rows.map((r) => `<td>${r ? r[i][0] : '–'}</td>`).join('')}</tr>`).join('')}</table></div><p class="hint">Alle Zeiten, Konjunktiv und Passiv im Formentrainer (Grammatik).</p>`;
  }
  if (v.wortart === 'Adjektiv' && v.formen) {
    const ad = L.analyzeAdj(v.formen); if (!ad) return '';
    return `<table class="forms"><tr><th></th><th>m</th><th>f</th><th>n</th></tr>${['Sg', 'Pl'].flatMap((n) => L.CASES.map((c) => `<tr><td>${c} ${n}</td>${['m', 'f', 'n'].map((g) => `<td>${L.adjForm(ad, c, n, g)}</td>`).join('')}</tr>`)).join('')}</table>`;
  }
  return '';
}

export { startQuiz };
