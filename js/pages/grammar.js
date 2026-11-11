// Grammatik: Regel-Übersichten mit Mini-Übungen + Trainer (EN, FR, LA, Med)
import { $, $$, esc, attr, toast, checkAnswer, shuffle, pick, stripAccents } from '../ui.js';
import * as S from '../store.js';
import { route, go } from '../nav.js';
import { celebrate } from '../app.js';
import GR_EN from '../content/grammar-en.js';
import GR_FR from '../content/grammar-fr.js';
import GR_LA from '../content/grammar-la.js';
import GR_MED from '../content/grammar-med.js';
import * as E from '../engines/english.js';
import * as F from '../engines/french.js';
import * as L from '../engines/latin.js';
import * as M from '../engines/med.js';
import { sayFor } from './area.js';

const { state } = S;
const CONTENT = { en: GR_EN, fr: GR_FR, la: GR_LA, med: GR_MED };
const TRAINERS = {
  en: [{ id: 'en-irr', icon: '🔁', name: 'Unregelmäßige Verben', desc: 'Simple Past & Past Participle' }, { id: 'en-tense', icon: '⏱️', name: 'Zeitformen bilden', desc: '11 Zeiten, mit he/she-s & Co.' }],
  fr: [{ id: 'fr-conj', icon: '🔤', name: 'Konjugationstrainer', desc: '8 Zeiten, 45 Verben + Tabellen' }],
  la: [{ id: 'la-forms', icon: '🏛️', name: 'Formentrainer', desc: 'Deklination & Konjugation: bilden, bestimmen, Tabellen' }],
  med: [{ id: 'med', icon: '⚕️', name: 'Plural & Angleichung', desc: 'Nomen + Adjektiv in Nom./Gen.' }],
};

route('/grammar/:id', ({ id }) => {
  const a = S.area(id); if (!a || a.type !== 'lang') return go('/home', true);
  const topics = CONTENT[a.key] || [];
  return {
    title: 'Grammatik', sub: a.name, back: `/area/${id}`, color: a.color,
    html: `
    <h2 class="sec">Trainer</h2>
    <div class="tools">${(TRAINERS[a.key] || []).map((t) => `<a class="tool wide" href="#/trainer/${id}/${t.id}"><span class="tool-ic">${t.icon}</span><span>${t.name}</span><small>${t.desc}</small></a>`).join('')}</div>
    <h2 class="sec">Regeln</h2>
    <div class="list">${topics.map((t, i) => `<a class="list-row" href="#/topic/${id}/${t.id}"><span class="num">${i + 1}</span><span class="grow">${esc(t.title)}<small>${t.checks.length} Übungen</small></span><span class="chev">›</span></a>`).join('')}</div>`,
  };
});

route('/topic/:id/:tid', ({ id, tid }) => {
  const a = S.area(id); if (!a) return go('/home', true);
  const list = CONTENT[a.key] || [];
  const i = list.findIndex((t) => t.id === tid); const t = list[i]; if (!t) return go(`/grammar/${id}`, true);
  const prev = list[i - 1], next = list[i + 1];
  return {
    title: t.title, back: `/grammar/${id}`, color: a.color,
    menu: [{ label: 'Als eigenen Lernzettel kopieren', icon: '📝', onClick: async () => {
      const n = await S.save('notes', { areaId: id, unitId: null, title: t.title, html: t.html });
      toast('Kopiert – du kannst ihn jetzt ergänzen'); go(`/note/${n.id}`);
    } }],
    html: `
    <article class="card rule">${t.html}</article>
    <h2 class="sec">Kurz geübt</h2>
    <div class="checks">${t.checks.map((c, k) => `<form class="check" data-k="${k}"><p>${esc(c.q).replace(/___/g, '<span class="blank">___</span>')}</p><div class="row"><input class="input" autocapitalize="off" autocorrect="off" spellcheck="false"><button class="btn">✓</button></div><div class="fb"></div></form>`).join('')}</div>
    <div class="row between">${prev ? `<a class="btn" href="#/topic/${id}/${prev.id}">‹ ${esc(prev.title.split(' ')[0])}…</a>` : '<span></span>'}${next ? `<a class="btn" href="#/topic/${id}/${next.id}">${esc(next.title.split(' ')[0])}… ›</a>` : ''}</div>`,
    mount(root) {
      $$('.check', root).forEach((f) => f.addEventListener('submit', async (e) => {
        e.preventDefault();
        const c = t.checks[+f.dataset.k]; const inp = $('input', f);
        if (!inp.value.trim()) return;
        const r = checkAnswer(inp.value, c.a, { accentTolerant: state.profile.settings.accentTolerant });
        f.classList.toggle('good', r.ok); f.classList.toggle('bad', !r.ok);
        $('.fb', f).innerHTML = r.ok ? '✓ Richtig!' : `✗ Lösung: <b>${esc(c.a[0])}</b>`;
        if (!f.dataset.done) { f.dataset.done = 1; if (await S.recordActivity(1)) celebrate(); }
      }));
    },
  };
});

// ---------- Trainer-Grundgerüst ----------
/**
 * Startet eine Übungsrunde.
 * gen() → { prompt: html, fields: [{label, sols:[...], check?(input)→bool, show}], choices?: [{label, ok}], say?: text, explain?: html }
 */
function runTrainer(root, gen, opts = {}) {
  const st = { right: 0, wrong: 0, n: 0 };
  const box = $('#tr', root);
  const step = () => {
    const task = gen();
    if (!task) { box.innerHTML = '<div class="empty">Keine passenden Aufgaben – bitte Auswahl ändern.</div>'; return; }
    st.n++;
    box.innerHTML = `
      <div class="qcount">Aufgabe ${st.n} · ✓ ${st.right} ✗ ${st.wrong}</div>
      <div class="qcard"><div class="qprompt small-prompt"><div>${task.prompt}</div>${task.say ? '<button class="icon-btn" id="say">🔊</button>' : ''}</div></div>
      ${task.choices ? `<div class="mc">${task.choices.map((c, i) => `<button class="btn mc-opt" data-i="${i}">${esc(c.label)}</button>`).join('')}</div>`
      : `<form class="qform" autocomplete="off">${task.fields.map((f, i) => `<label class="field"><span>${esc(f.label || 'Antwort')}</span><input class="input big" data-i="${i}" autocapitalize="off" autocorrect="off" spellcheck="false"></label>`).join('')}
        ${opts.accents ? `<div class="accents">${['é', 'è', 'ê', 'à', 'â', 'ç', 'ô', 'î', 'û', 'ù', 'ë', 'ï', 'œ'].map((c) => `<button type="button" class="key">${c}</button>`).join('')}</div>` : ''}
        <div class="qbtns"><button type="button" class="btn" id="skip">Weiß ich nicht</button><button class="btn primary">Prüfen</button></div></form>`}
      <div id="res"></div>`;
    $('#say', box)?.addEventListener('click', () => opts.area && sayFor(opts.area, task.say));
    const finish = async (ok, html) => {
      if (ok) st.right++; else st.wrong++;
      $('#res', box).innerHTML = `<div class="qres ${ok ? 'ok' : 'bad'}">${ok ? '✓ Richtig!' : '✗ Leider falsch'}${html ? `<div class="sol">${html}</div>` : ''}${task.explain ? `<div class="hint">${task.explain}</div>` : ''}</div><div class="qbtns"><button class="btn primary" id="nx">Weiter</button></div>`;
      $('#nx', box).addEventListener('click', step);
      $('#nx', box).focus();
      if (await S.recordActivity(1)) celebrate();
    };
    if (task.choices) {
      $$('.mc-opt', box).forEach((b) => b.addEventListener('click', () => {
        const c = task.choices[+b.dataset.i];
        $$('.mc-opt', box).forEach((x) => { x.disabled = true; if (task.choices[+x.dataset.i].ok) x.classList.add('good'); });
        if (!c.ok) b.classList.add('bad');
        finish(c.ok, c.ok ? task.okText || '' : task.solText || '');
      }));
      return;
    }
    const inputs = $$('input[data-i]', box);
    let last = inputs[0];
    inputs.forEach((i) => i.addEventListener('focus', () => { last = i; }));
    setTimeout(() => inputs[0]?.focus(), 50);
    $$('.key', box).forEach((k) => k.addEventListener('click', () => { const inp = last; const p = inp.selectionStart ?? inp.value.length; inp.value = inp.value.slice(0, p) + k.textContent + inp.value.slice(p); inp.focus(); inp.setSelectionRange(p + 1, p + 1); }));
    const evaluate = (skip) => {
      let all = true;
      const sols = [];
      task.fields.forEach((f, i) => {
        const v = inputs[i].value;
        const ok = !skip && (f.check ? f.check(v) : checkAnswer(v, f.sols, { accentTolerant: state.profile.settings.accentTolerant }).ok);
        inputs[i].classList.add(ok ? 'good' : 'bad'); inputs[i].disabled = true;
        if (!ok) all = false;
        sols.push(`${task.fields.length > 1 ? esc(f.label) + ': ' : ''}<b>${esc(f.show || f.sols[0])}</b>`);
      });
      $('.qbtns', box)?.remove(); $('.accents', box)?.remove();
      finish(all, all ? '' : sols.join('<br>'));
    };
    $('.qform', box).addEventListener('submit', (e) => { e.preventDefault(); if (inputs.some((i) => i.value.trim())) evaluate(false); });
    $('#skip', box).addEventListener('click', () => evaluate(true));
  };
  step();
}

const chips = (name, items, sel) => `<div class="chips" data-name="${name}">${items.map(([v, l]) => `<button type="button" class="chip toggle ${sel.includes(v) ? 'on' : ''}" data-v="${attr(v)}">${esc(l)}</button>`).join('')}</div>`;
const seg = (name, items, sel) => `<div class="seg" data-name="${name}">${items.map(([v, l]) => `<button type="button" data-v="${attr(v)}" class="${v === sel ? 'on' : ''}">${esc(l)}</button>`).join('')}</div>`;
function wireOptions(root) {
  $$('.chips[data-name] .chip', root).forEach((c) => c.addEventListener('click', () => c.classList.toggle('on')));
  $$('.seg[data-name]', root).forEach((s) => s.addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) return; $$('button', s).forEach((x) => x.classList.toggle('on', x === b)); s.dispatchEvent(new Event('change')); }));
}
const getChips = (root, name) => $$(`.chips[data-name="${name}"] .chip.on`, root).map((c) => c.dataset.v);
const getSeg = (root, name) => $(`.seg[data-name="${name}"] .on`, root)?.dataset.v;
const prefs = (k) => JSON.parse(localStorage.getItem('tr-' + k) || '{}');
const savePrefs = (k, v) => localStorage.setItem('tr-' + k, JSON.stringify(v));

route('/trainer/:id/:kind', ({ id, kind }) => {
  const a = S.area(id); if (!a) return go('/home', true);
  const t = Object.values(TRAINERS).flat().find((x) => x.id === kind);
  const builders = { 'en-irr': enIrr, 'en-tense': enTense, 'fr-conj': frConj, 'la-forms': laForms, med: medTrainer };
  const b = builders[kind](a);
  return { title: t.name, sub: a.name, back: `/grammar/${id}`, color: a.color, html: `<div id="opts">${b.options}</div><div id="tr"></div>`, mount: (root) => { wireOptions(root); b.mount(root); } };
});

// ---------- Englisch ----------
function enIrr(a) {
  const p = prefs('en-irr');
  return {
    options: `${seg('mode', [['forms', 'Formen'], ['de', 'Deutsch → Englisch'], ['list', 'Liste']], p.mode || 'forms')}<button class="btn primary block" id="start">Start</button>`,
    mount(root) {
      $('#start', root).addEventListener('click', () => {
        const mode = getSeg(root, 'mode'); savePrefs('en-irr', { mode });
        if (mode === 'list') {
          $('#tr', root).innerHTML = `<div class="table-wrap"><table class="forms"><tr><th>Infinitive</th><th>Simple Past</th><th>Past Participle</th><th>Deutsch</th></tr>${E.IRREGULAR.map((r) => `<tr><td><b>${r[0]}</b></td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td></tr>`).join('')}</table></div>`;
          return;
        }
        $('#opts', root).hidden = true;
        let order = shuffle(E.IRREGULAR), k = 0;
        runTrainer(root, () => {
          if (k >= order.length) { order = shuffle(E.IRREGULAR); k = 0; }
          const [inf, past, pp, de] = order[k++];
          if (mode === 'de') return { prompt: `<span class="de">${esc(de)}</span>`, fields: [{ label: 'Infinitiv (ohne to)', sols: [inf], check: (v) => checkAnswer(v, [inf], { stripArticle: true }).ok }], explain: `${inf} – ${past} – ${pp}`, say: inf };
          return { prompt: `<b>${inf}</b> <small>(${esc(de)})</small>`, say: inf, fields: [{ label: 'Simple Past', sols: past.split('/'), show: past }, { label: 'Past Participle', sols: pp.split('/'), show: pp }] };
        }, { area: a });
      });
    },
  };
}

function enTense(a) {
  const p = prefs('en-tense');
  const sel = p.tenses || ['sp', 'pp', 'spa', 'prp', 'will'];
  return {
    options: `<h2 class="sec">Zeitformen</h2>${chips('tenses', E.TENSES.map((t) => [t.id, t.name]), sel)}<button class="btn primary block" id="start">Start</button>`,
    mount(root) {
      $('#start', root).addEventListener('click', () => {
        const tenses = getChips(root, 'tenses'); if (!tenses.length) return toast('Bitte mind. eine Zeitform wählen');
        savePrefs('en-tense', { tenses }); $('#opts', root).hidden = true;
        runTrainer(root, () => {
          const v = pick(E.TENSE_VERBS), person = pick(E.PERSONS), t = pick(tenses);
          const sols = E.form(v, person, t);
          const tn = E.TENSES.find((x) => x.id === t).name;
          return { prompt: `<b>${person}</b> · to ${v[0]} <small>(${esc(v[5])})</small><div class="tag">${tn}</div>`, fields: [{ label: 'Verbform (mit oder ohne Pronomen)', sols, check: (x) => E.check(x, person, sols), show: `${person} ${sols[0]}` }], explain: 'Bejahter Aussagesatz.' };
        }, { area: a });
      });
    },
  };
}

// ---------- Französisch ----------
function frConj(a) {
  const p = prefs('fr-conj');
  const tSel = p.tenses || ['present', 'pc', 'imparfait', 'futur'];
  return {
    options: `${seg('mode', [['train', 'Üben'], ['table', 'Tabelle']], p.mode || 'train')}
      <div id="o-train"><h2 class="sec">Zeiten</h2>${chips('tenses', F.TENSES.map((t) => [t.id, t.name]), tSel)}
      <h2 class="sec">Verben</h2>${seg('verbs', [['all', 'Alle'], ['irr', 'Unregelmäßige'], ['reg', 'Regelmäßige']], p.verbs || 'all')}
      <button class="btn primary block" id="start">Start</button></div>
      <div id="o-table" hidden><select class="input" id="verb">${F.VERB_LIST.slice().sort((x, y) => x.localeCompare(y, 'fr')).map((v) => `<option>${v}</option>`).join('')}</select><div id="tbl"></div></div>`,
    mount(root) {
      const sync = () => { const m = getSeg(root, 'mode'); $('#o-train', root).hidden = m !== 'train'; $('#o-table', root).hidden = m !== 'table'; if (m === 'table') table(); };
      $('.seg[data-name=mode]', root).addEventListener('change', sync);
      const table = () => {
        const v = $('#verb', root).value;
        $('#tbl', root).innerHTML = `<p class="hint center">${esc(F.meaning(v))}${F.usesEtre(v) ? ' · Passé composé mit <b>être</b>' : ''}</p><div class="table-wrap"><table class="forms">${F.TENSES.map((t) => `<tr><th colspan="2">${t.name}</th></tr>${F.conjugate(v, t.id).map((f, i) => `<tr><td colspan="2">${esc(F.withPronoun(i, displayFr(f), t.id))} <button class="icon-btn mini" data-say="${attr(F.withPronoun(i, f[0], t.id))}">🔊</button></td></tr>`).join('')}`).join('')}</table></div>`;
        $$('[data-say]', root).forEach((b) => b.addEventListener('click', () => sayFor(a, b.dataset.say)));
      };
      $('#verb', root).addEventListener('change', table);
      sync();
      $('#start', root).addEventListener('click', () => {
        const tenses = getChips(root, 'tenses'), verbs = getSeg(root, 'verbs');
        if (!tenses.length) return toast('Bitte mind. eine Zeit wählen');
        savePrefs('fr-conj', { tenses, verbs, mode: 'train' }); $('#opts', root).hidden = true;
        const pool = F.VERB_LIST.filter((v) => verbs === 'all' || (verbs === 'irr' ? F.isIrregular(v) : !F.isIrregular(v)));
        runTrainer(root, () => {
          const v = pick(pool), t = pick(tenses), i = Math.floor(Math.random() * 6);
          const sols = F.conjugate(v, t)[i];
          const tn = F.TENSES.find((x) => x.id === t).name;
          const full = F.withPronoun(i, sols[0], t);
          return {
            prompt: `<b>${v}</b> <small>(${esc(F.meaning(v))})</small> · <b>${F.PRON[i]}</b><div class="tag">${tn}</div>`,
            fields: [{ label: 'Form (Pronomen optional)', sols, show: F.withPronoun(i, displayFr(sols), t), check: (x) => { const r = checkAnswer(F.stripPronoun(x), sols, { accentTolerant: state.profile.settings.accentTolerant }); return r.ok; } }],
            say: null, explain: F.usesEtre(v) && ['pc', 'pqp'].includes(t) ? 'Mit être → Participe passt sich an.' : '', _full: full,
          };
        }, { area: a, accents: true });
      });
    },
  };
}
function displayFr(f) { if (f.length >= 2 && f[1] === f[0] + 'e') return f[0] + '(e)'; if (f.length >= 2 && f[1] === f[0].replace(/s$/, 'es')) return f[0].replace(/s$/, '(e)s'); return f[0]; }

// ---------- Latein ----------
function latinWords(a, src) {
  const own = state.items.filter((i) => i.kind === 'vocab' && i.areaId === a.id);
  const nouns = [], verbs = [];
  if (src !== 'own') {
    L.SAMPLE_NOUNS.forEach(([n, g, ge, de]) => nouns.push({ label: `${n}, ${g} ${ge}`, de, an: L.analyzeNoun(n, g, ge) }));
    L.SAMPLE_VERBS.forEach(([f, de, intr]) => verbs.push({ label: f, de, v: L.analyzeVerb(f), intr }));
  }
  if (src !== 'samples') {
    own.forEach((it) => {
      if (it.wortart === 'Nomen' && it.genitiv) { const an = L.analyzeNoun(it.term, it.genitiv, it.genus); if (an) nouns.push({ label: `${it.term}, ${it.genitiv} ${an.genus}`, de: it.translation, an }); }
      if (it.wortart === 'Verb' && it.stammformen) { const v = L.analyzeVerb(it.stammformen, it.term); if (v) verbs.push({ label: it.stammformen, de: it.translation, v }); }
    });
  }
  return { nouns: nouns.filter((x) => x.an), verbs: verbs.filter((x) => x.v) };
}
const TENSE_NAME = (id) => L.TENSES.find((t) => t.id === id).name;
const PERS_LABEL = (i) => L.PERSON_NAMES[L.PERSONS[i]];

function laForms(a) {
  const p = prefs('la-forms');
  return {
    options: `
      ${seg('kind', [['noun', 'Nomen'], ['verb', 'Verben']], p.kind || 'noun')}
      ${seg('task', [['build', 'Form bilden'], ['ident', 'Form bestimmen'], ['table', 'Tabelle']], p.task || 'build')}
      ${seg('src', [['both', 'Beispiele + eigene'], ['samples', 'Nur Beispiele'], ['own', 'Nur eigene Vokabeln']], p.src || 'both')}
      <div id="o-verb"><h2 class="sec">Zeiten</h2>${chips('tenses', L.TENSES.map((t) => [t.id, t.name]), p.tenses || ['praes', 'impf', 'fut1', 'perf'])}
      ${seg('voice', [['act', 'Aktiv'], ['pass', 'Passiv'], ['both', 'Aktiv + Passiv']], p.voice || 'act')}</div>
      <p class="hint">Eigene Vokabeln zählen mit, wenn Wortart, Genitiv/Genus bzw. Stammformen eingetragen sind. Formen ohne Längenzeichen.</p>
      <div id="o-table" hidden><select class="input" id="word"></select><div id="tbl"></div></div>
      <button class="btn primary block" id="start">Start</button>`,
    mount(root) {
      const sync = () => {
        const kind = getSeg(root, 'kind'), task = getSeg(root, 'task');
        $('#o-verb', root).hidden = kind !== 'verb' || task === 'table';
        $('#o-table', root).hidden = task !== 'table';
        $('#start', root).hidden = task === 'table';
        if (task === 'table') {
          const W = latinWords(a, getSeg(root, 'src'));
          const list = kind === 'noun' ? W.nouns : W.verbs;
          $('#word', root).innerHTML = list.map((w, i) => `<option value="${i}">${esc(w.label)} – ${esc(w.de)}</option>`).join('');
          $('#word', root).onchange = () => drawTable(list[+$('#word', root).value], kind);
          if (list.length) drawTable(list[0], kind); else $('#tbl', root).innerHTML = '<div class="empty">Keine Wörter.</div>';
        }
      };
      const drawTable = (w, kind) => {
        if (kind === 'noun') {
          const d = L.declineNoun(w.an);
          $('#tbl', root).innerHTML = `<p class="hint center">${L.DECL_NAMES[w.an.decl]} · ${L.GENUS_NAMES[w.an.genus]}</p><table class="forms"><tr><th></th><th>Singular</th><th>Plural</th></tr>${L.CASES.map((c) => `<tr><td>${L.CASE_NAMES[c]}</td><td>${d[c].Sg[0]}</td><td>${d[c].Pl[0]}</td></tr>`).join('')}</table>`;
        } else {
          const voices = w.v.conj === 'irr' || w.intr ? ['act'] : ['act', 'pass'];
          $('#tbl', root).innerHTML = `<p class="hint center">${L.CONJ_NAMES[w.v.conj]}</p>` + voices.map((vo) => `<h3>${L.VOICES[vo]}</h3><div class="table-wrap"><table class="forms"><tr><th></th>${L.PERSONS.map((p2) => `<th>${p2}</th>`).join('')}</tr>${L.TENSES.map((t) => { const f = L.conjugate(w.v, t.id, vo); return f ? `<tr><td>${t.name}</td>${f.map((x) => `<td>${x[0]}</td>`).join('')}</tr>` : ''; }).join('')}</table></div>`).join('');
        }
      };
      $$('.seg[data-name]', root).forEach((s) => s.addEventListener('change', sync));
      sync();
      $('#start', root).addEventListener('click', () => {
        const kind = getSeg(root, 'kind'), task = getSeg(root, 'task'), src = getSeg(root, 'src');
        const tenses = getChips(root, 'tenses'), voice = getSeg(root, 'voice');
        savePrefs('la-forms', { kind, task, src, tenses, voice });
        const W = latinWords(a, src);
        if (kind === 'noun' && !W.nouns.length) return toast('Keine Nomen verfügbar');
        if (kind === 'verb' && (!W.verbs.length || !tenses.length)) return toast('Keine Verben/Zeiten gewählt');
        $('#opts', root).hidden = true;
        runTrainer(root, () => (kind === 'noun' ? nounTask(W.nouns, task) : verbTask(W.verbs, task, tenses, voice)));
      });
    },
  };
}

function nounTask(nouns, task) {
  const w = pick(nouns); const d = L.declineNoun(w.an);
  const c = pick(L.CASES), n = pick(L.NUMS);
  const form = d[c][n][0];
  const analyses = [];
  L.CASES.forEach((cc) => L.NUMS.forEach((nn) => { if (d[cc][nn][0] === form) analyses.push(`${L.CASE_NAMES[cc]} ${L.NUM_NAMES[nn]}`); }));
  const head = `<b>${esc(w.label)}</b> <small>(${esc(w.de)})</small>`;
  if (task === 'build') return { prompt: `${head}<div class="tag">${L.CASE_NAMES[c]} ${L.NUM_NAMES[n]}</div>`, fields: [{ label: 'Form', sols: [form] }], explain: `${L.DECL_NAMES[w.an.decl]}` };
  // bestimmen: 4 Optionen, eine davon korrekt
  const all = L.CASES.flatMap((cc) => L.NUMS.map((nn) => `${L.CASE_NAMES[cc]} ${L.NUM_NAMES[nn]}`));
  const wrong = shuffle(all.filter((x) => !analyses.includes(x))).slice(0, 3);
  const choices = shuffle([pick(analyses), ...wrong]).map((l) => ({ label: l, ok: analyses.includes(l) }));
  return { prompt: `<span class="form">${form}</span><div class="sub">von ${esc(w.label)}</div>`, choices, solText: `Möglich: ${analyses.join(' / ')}`, okText: analyses.length > 1 ? `Auch möglich: ${analyses.join(' / ')}` : '' };
}

function verbTask(verbs, task, tenses, voiceSel) {
  for (let tries = 0; tries < 30; tries++) {
    const w = pick(verbs), t = pick(tenses);
    let vo = voiceSel === 'both' ? pick(['act', 'pass']) : voiceSel;
    if (vo === 'pass' && (w.v.conj === 'irr' || w.intr)) { if (voiceSel === 'pass') continue; vo = 'act'; }
    const forms = L.conjugate(w.v, t, vo); if (!forms) continue;
    const i = Math.floor(Math.random() * 6);
    const sols = forms[i];
    const label = `${PERS_LABEL(i)} ${TENSE_NAME(t)} ${L.VOICES[vo]}`;
    const head = `<b>${esc(w.label)}</b> <small>(${esc(w.de)})</small>`;
    if (task === 'build') return { prompt: `${head}<div class="tag">${label}</div>`, fields: [{ label: 'Form', sols, show: sols[0] }], explain: L.CONJ_NAMES[w.v.conj] };
    // bestimmen: alle Analysen dieser Form im gewählten Bereich
    const analyses = [];
    tenses.forEach((tt) => ['act', 'pass'].forEach((vv) => { const f = L.conjugate(w.v, tt, vv); f && f.forEach((x, k) => { if (x.includes(sols[0])) analyses.push(`${PERS_LABEL(k)} ${TENSE_NAME(tt)} ${L.VOICES[vv]}`); }); }));
    const cands = [];
    for (let k = 0; k < 40 && cands.length < 3; k++) {
      const l = `${PERS_LABEL(Math.floor(Math.random() * 6))} ${TENSE_NAME(pick(tenses))} ${L.VOICES[voiceSel === 'both' ? pick(['act', 'pass']) : vo]}`;
      if (!analyses.includes(l) && !cands.includes(l)) cands.push(l);
    }
    const choices = shuffle([label, ...cands]).map((l) => ({ label: l, ok: analyses.includes(l) }));
    return { prompt: `<span class="form">${sols[0]}</span><div class="sub">von ${esc(w.label)}</div>`, choices, solText: `Richtig: ${analyses.join(' / ')}` };
  }
  return null;
}

// ---------- Med. Terminologie ----------
function medTrainer(a) {
  const p = prefs('med');
  return {
    options: `
      ${seg('task', [['plural', 'Plural bilden'], ['phrase', 'Nomen + Adjektiv'], ['table', 'Tabelle']], p.task || 'plural')}
      ${seg('src', [['both', 'Beispiele + eigene'], ['samples', 'Nur Beispiele'], ['own', 'Nur eigene']], p.src || 'both')}
      <div id="o-table" hidden><select class="input" id="word"></select><div id="tbl"></div></div>
      <button class="btn primary block" id="start">Start</button>`,
    mount(root) {
      const words = () => {
        const src = getSeg(root, 'src');
        const nouns = [], adjs = [];
        if (src !== 'own') { M.NOUNS.forEach((n) => nouns.push({ n, de: n[3] })); M.ADJECTIVES.forEach(([f, de]) => adjs.push({ f, de })); }
        if (src !== 'samples') state.items.filter((i) => i.kind === 'vocab' && i.areaId === a.id).forEach((it) => {
          if (it.wortart === 'Nomen' && it.genitiv && L.analyzeNoun(it.term, it.genitiv, it.genus)) nouns.push({ n: [it.term, it.genitiv, L.analyzeNoun(it.term, it.genitiv, it.genus).genus], de: it.translation });
          if (it.wortart === 'Adjektiv' && it.formen && L.analyzeAdj(it.formen)) adjs.push({ f: it.formen, de: it.translation });
        });
        return { nouns, adjs };
      };
      const sync = () => {
        const task = getSeg(root, 'task');
        $('#o-table', root).hidden = task !== 'table'; $('#start', root).hidden = task === 'table';
        if (task === 'table') {
          const W = words();
          $('#word', root).innerHTML = W.nouns.map((w, i) => `<option value="${i}">${esc(w.n[0])} – ${esc(w.de)}</option>`).join('');
          const draw = () => { const w = W.nouns[+$('#word', root).value]; if (!w) return; const d = M.nounParadigm(w.n); $('#tbl', root).innerHTML = `<table class="forms"><tr><th></th><th>Singular</th><th>Plural</th></tr>${L.CASES.map((c) => `<tr><td>${L.CASE_NAMES[c]}</td><td>${d[c].Sg[0]}</td><td>${d[c].Pl[0]}</td></tr>`).join('')}</table>`; };
          $('#word', root).onchange = draw; draw();
        }
      };
      $$('.seg[data-name]', root).forEach((s) => s.addEventListener('change', sync));
      sync();
      $('#start', root).addEventListener('click', () => {
        const task = getSeg(root, 'task'); savePrefs('med', { task, src: getSeg(root, 'src') });
        const W = words(); if (!W.nouns.length) return toast('Keine Nomen verfügbar');
        $('#opts', root).hidden = true;
        runTrainer(root, () => {
          const w = pick(W.nouns); const d = M.nounParadigm(w.n);
          const g = L.analyzeNoun(w.n[0], w.n[1], w.n[2]).genus;
          if (task === 'plural' || !W.adjs.length) {
            return { prompt: `<b>${esc(w.n[0])}, ${esc(w.n[1])} ${g}</b> <small>(${esc(w.de)})</small>`, fields: [{ label: 'Nominativ Plural', sols: [d.Nom.Pl[0]] }, { label: 'Genitiv Plural', sols: [d.Gen.Pl[0]] }] };
          }
          const adj = pick(W.adjs);
          const [c, n] = pick([['Nom', 'Sg'], ['Gen', 'Sg'], ['Nom', 'Pl'], ['Gen', 'Pl']]);
          const sol = M.phrase(w.n, adj.f, c, n);
          return { prompt: `<b>${esc(w.n[0])}</b> (${g}) + <b>${esc(adj.f)}</b><div class="sub">${esc(w.de)} + ${esc(adj.de)}</div><div class="tag">${L.CASE_NAMES[c]} ${L.NUM_NAMES[n]}</div>`, fields: [{ label: 'Nomen + Adjektiv', sols: [sol] }] };
        });
      });
    },
  };
}

export { stripAccents };
