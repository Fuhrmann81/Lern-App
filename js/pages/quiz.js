// Abfrage: Einstellungen + Sitzung (Karteikarte, Eintippen, Multiple Choice)
import { $, $$, esc, toast, checkAnswer, shuffle } from '../ui.js';
import * as S from '../store.js';
import { route, go, query, pass, refresh } from '../nav.js';
import { termLabel, ttsLang, sayFor } from './area.js';
import { celebrate } from '../app.js';

const { state } = S;

route('/quizsetup/:id', ({ id }) => {
  const a = S.area(id); if (!a) return go('/home', true);
  const q = query();
  const units = S.unitsOf(id);
  const saved = JSON.parse(localStorage.getItem('quizPrefs') || '{}');
  const pre = q.unit ? [q.unit] : (saved.units?.[id] || units.map((u) => u.id));
  const isLang = a.type === 'lang';
  return {
    title: 'Abfrage', sub: a.name, back: q.unit ? `/unit/${q.unit}` : `/area/${id}`, color: a.color,
    html: `
    <h2 class="sec">Was?</h2>
    <div class="list">${units.map((u) => {
      const its = state.items.filter((i) => i.unitId === u.id);
      return `<label class="list-row"><input type="checkbox" value="${u.id}" ${pre.includes(u.id) ? 'checked' : ''}><span class="grow">${esc(u.name)}<small>${its.filter((i) => i.kind === 'vocab').length} ${isLang ? 'Vokabeln' : 'Begriffe'} · ${its.filter((i) => i.kind === 'card').length} Karten · ${its.filter((i) => S.isDue(i)).length} fällig</small></span></label>`;
    }).join('') || '<div class="empty">Noch keine Units.</div>'}</div>
    <div class="seg" id="which"><button data-v="due" class="on">Nur fällige</button><button data-v="all">Alle</button><button data-v="hard">Schwierige</button></div>
    <label class="switch"><input type="checkbox" id="cards" checked><span>Lernzettel-Karten einbeziehen</span></label>
    <h2 class="sec">Wie?</h2>
    <div class="seg" id="mode"><button data-v="type" class="on">⌨️ Eintippen</button><button data-v="flip">🃏 Karteikarte</button><button data-v="mc">🔘 Auswahl</button></div>
    <div class="seg" id="dir"><button data-v="f2d" class="on">${isLang ? `${esc(a.name)} → Deutsch` : 'Begriff → Erklärung'}</button><button data-v="d2f">${isLang ? `Deutsch → ${esc(a.name)}` : 'Erklärung → Begriff'}</button><button data-v="mix">Gemischt</button></div>
    ${!isLang ? '<p class="hint">Tipp: Bei langen Erklärungen ist „Karteikarte“ am angenehmsten.</p>' : ''}
    <button class="btn primary big block" id="go">Los geht's</button>`,
    mount(root) {
      const segVal = (sel) => $(`${sel} .on`, root).dataset.v;
      $$('.seg', root).forEach((seg) => seg.addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) return; $$('button', seg).forEach((x) => x.classList.toggle('on', x === b)); }));
      if (saved.mode) $$('#mode button', root).forEach((b) => b.classList.toggle('on', b.dataset.v === saved.mode));
      if (!isLang) $$('#mode button', root).forEach((b) => b.classList.toggle('on', b.dataset.v === (saved.modeSub || 'flip')));
      const dirSaved = saved.dirs?.[id]; if (dirSaved) $$('#dir button', root).forEach((b) => b.classList.toggle('on', b.dataset.v === dirSaved));
      $('#go', root).addEventListener('click', () => {
        const sel = $$('input[type=checkbox][value]', root).filter((c) => c.checked).map((c) => c.value);
        const which = segVal('#which'), mode = segVal('#mode'), dir = segVal('#dir');
        const withCards = $('#cards', root).checked;
        let items = state.items.filter((i) => sel.includes(i.unitId) && (i.kind === 'vocab' || (withCards && i.kind === 'card')));
        if (which === 'due') items = items.filter((i) => S.isDue(i));
        if (which === 'hard') items = items.filter((i) => (i.stats?.wrong || 0) > 0 && (i.box || 0) <= 2);
        if (!items.length) return toast(which === 'due' ? 'Nichts fällig – wähle „Alle“' : 'Keine passenden Einträge');
        saved.units = { ...(saved.units || {}), [id]: q.unit ? saved.units?.[id] : sel };
        if (isLang) saved.mode = mode; else saved.modeSub = mode;
        saved.dirs = { ...(saved.dirs || {}), [id]: dir };
        localStorage.setItem('quizPrefs', JSON.stringify(saved));
        pass.quiz = { ids: items.map((i) => i.id), mode, dir, title: a.name, back: q.unit ? `/unit/${q.unit}` : `/area/${id}` };
        go('/quiz');
      });
    },
  };
});

// ---------- Sitzung ----------
route('/quiz', () => {
  const cfg = pass.quiz;
  if (!cfg) return go('/learn', true);
  const size = state.profile.settings.sessionSize;
  // Fällige zuerst, dann nach Fach sortiert, gemischt
  let items = cfg.ids.map((id) => state.items.find((i) => i.id === id)).filter(Boolean);
  items = shuffle(items).sort((x, y) => (x.box || 0) - (y.box || 0)).slice(0, size);
  items = shuffle(items);
  const mode = cfg.mode || 'type';
  const session = { queue: items.map((it) => ({ it, first: true })), right: 0, wrong: 0, wrongItems: [], total: items.length, done: 0 };
  return {
    title: cfg.title || 'Abfrage', back: cfg.back || '/learn', tabs: false, mainClass: 'quiz-main', color: cfg.color || (items[0] && S.area(items[0].areaId)?.color),
    html: `<div class="qprog"><i id="qbar"></i></div><div class="qcount" id="qcount"></div><div id="qcard"></div>`,
    mount(root) { next(root, session, mode, cfg); },
  };
});

function sides(it, dir) {
  const a = S.area(it.areaId);
  if (it.kind === 'card') return { a, q: it.q, ans: it.a, qForeign: false, ansForeign: false };
  let d = dir === 'mix' ? (Math.random() < 0.5 ? 'f2d' : 'd2f') : (dir || 'f2d');
  const foreign = termLabel(it, a);
  if (d === 'f2d') return { a, q: foreign, ans: it.translation, qForeign: true, extra: it.example, hint: '' };
  let hint = '';
  if (a.key === 'la' || a.key === 'med') hint = it.wortart ? `${it.wortart} – nur Grundform` : 'Grundform';
  if (a.key === 'fr' && /^(le |la |les |l')/i.test(it.term)) hint = 'mit Artikel';
  return { a, q: it.translation, ans: it.term, ansForeign: true, hint, extra: it.example };
}

function next(root, s, mode, cfg) {
  const bar = $('#qbar', root), count = $('#qcount', root), box = $('#qcard', root);
  bar.style.width = `${(s.done / s.total) * 100}%`;
  count.textContent = `${Math.min(s.done + 1, s.total)} / ${s.total}  ·  ✓ ${s.right}  ✗ ${s.wrong}`;
  if (!s.queue.length) return finish(root, s, cfg);
  const cur = s.queue.shift();
  const it = cur.it;
  const sd = sides(it, cfg.dir);
  const canSay = !!ttsLang(sd.a);
  const sayQ = canSay && sd.qForeign;
  const auto = state.profile.settings.autoSpeak;
  const header = `<div class="qmeta">${sd.a.icon} ${esc(S.unit(it.unitId)?.name || sd.a.name)}${it.kind === 'card' ? ' · Lernzettel-Karte' : ''}</div>
    <div class="qprompt">${esc(sd.q)}${sayQ ? ` <button class="icon-btn" id="say-q">🔊</button>` : ''}</div>${sd.hint ? `<div class="qhint">${esc(sd.hint)}</div>` : ''}`;

  const result = (ok, info = {}) => {
    // Bewertung nur beim ersten Versuch
    if (cur.first) {
      cur.prev = { box: it.box, due: it.due, stats: { ...(it.stats || { right: 0, wrong: 0 }) } };
      S.grade(it, ok); S.save('items', it);
      S.recordActivity(1).then((g) => g && celebrate());
      s.done++;
      if (ok) s.right++; else { s.wrong++; s.wrongItems.push(it); }
    }
    if (!ok) s.queue.splice(Math.min(3, s.queue.length), 0, { it, first: false });
    const say = canSay && sd.ansForeign;
    box.insertAdjacentHTML('beforeend', `
      <div class="qres ${ok ? 'ok' : 'bad'}">
        <div>${ok ? (info.accent ? '✓ Richtig – achte auf die Akzente' : '✓ Richtig!') : (info.typo ? '≈ Fast – kleiner Tippfehler' : '✗ Leider falsch')}</div>
        ${!ok || info.accent ? `<div class="sol">${esc(sd.ans)}${say ? ` <button class="icon-btn" id="say-a">🔊</button>` : ''}</div>` : ''}
        ${sd.extra ? `<div class="hint"><i>${esc(sd.extra)}</i></div>` : ''}
      </div>
      <div class="qbtns">${!ok && cur.first && mode !== 'flip' ? '<button class="btn" id="override">Ich hatte recht</button>' : ''}<button class="btn primary" id="nxt">Weiter</button></div>`);
    $('#say-a', box)?.addEventListener('click', () => sayFor(sd.a, it.term));
    if (auto && say) sayFor(sd.a, it.term);
    $('#override', box)?.addEventListener('click', () => {
      // Korrektur: als richtig zählen
      Object.assign(it, { box: cur.prev.box, due: cur.prev.due, stats: cur.prev.stats }); S.grade(it, true); S.save('items', it);
      s.wrong--; s.right++; s.wrongItems = s.wrongItems.filter((x) => x !== it);
      const qi = s.queue.findIndex((q) => q.it === it && !q.first); if (qi >= 0) s.queue.splice(qi, 1);
      next(root, s, mode, cfg);
    });
    const nb = $('#nxt', box);
    nb.addEventListener('click', () => next(root, s, mode, cfg));
    nb.focus();
  };

  if (mode === 'flip') {
    box.innerHTML = `<div class="qcard">${header}<div id="back" hidden><div class="sol">${esc(sd.ans)}${canSay && sd.ansForeign ? ` <button class="icon-btn" id="say-a2">🔊</button>` : ''}</div>${sd.extra ? `<div class="hint"><i>${esc(sd.extra)}</i></div>` : ''}</div></div>
      <div class="qbtns" id="flipb"><button class="btn primary big" id="reveal">Aufdecken</button></div>`;
    $('#reveal', box).addEventListener('click', () => {
      $('#back', box).hidden = false;
      if (auto && canSay && sd.ansForeign) sayFor(sd.a, it.term);
      $('#say-a2', box)?.addEventListener('click', () => sayFor(sd.a, it.term));
      $('#flipb', box).innerHTML = '<button class="btn bad" id="no">✗ Nicht gewusst</button><button class="btn good" id="yes">✓ Gewusst</button>';
      $('#no', box).addEventListener('click', () => { $('#flipb', box).remove(); result(false); });
      $('#yes', box).addEventListener('click', () => { $('#flipb', box).remove(); result(true); });
    });
  } else if (mode === 'mc') {
    const pool = state.items.filter((x) => x.areaId === it.areaId && x.id !== it.id && x.kind === it.kind);
    const other = (x) => { const o = sides(x, sd.ansForeign ? 'd2f' : 'f2d'); return x.kind === 'card' ? x.a : o.ans; };
    const opts = shuffle([...new Set(shuffle(pool).map(other).filter((t) => t && t !== sd.ans))].slice(0, 3).concat(sd.ans));
    if (opts.length < 2) return typeMode();
    box.innerHTML = `<div class="qcard">${header}</div><div class="mc">${opts.map((o, i) => `<button class="btn mc-opt" data-i="${i}">${esc(o)}</button>`).join('')}</div>`;
    $$('.mc-opt', box).forEach((b) => b.addEventListener('click', () => {
      const ok = opts[+b.dataset.i] === sd.ans;
      $$('.mc-opt', box).forEach((x) => { x.disabled = true; if (opts[+x.dataset.i] === sd.ans) x.classList.add('good'); });
      if (!ok) b.classList.add('bad');
      result(ok);
    }));
  } else typeMode();

  function typeMode() {
    box.innerHTML = `<div class="qcard">${header}</div>
      <form class="qform" autocomplete="off"><input class="input big" id="ans" placeholder="Antwort" autocapitalize="off" autocorrect="off" spellcheck="false" ${sd.ansForeign && sd.a.key === 'fr' ? 'lang="fr"' : ''}>
      ${sd.ansForeign && sd.a.key === 'fr' ? `<div class="accents">${['é', 'è', 'ê', 'à', 'â', 'ç', 'ô', 'î', 'û', 'ù', 'ë', 'ï', 'œ'].map((c) => `<button type="button" class="key">${c}</button>`).join('')}</div>` : ''}
      <div class="qbtns"><button type="button" class="btn" id="skip">Weiß ich nicht</button><button class="btn primary" type="submit">Prüfen</button></div></form>`;
    const inp = $('#ans', box);
    setTimeout(() => inp.focus(), 50);
    $$('.key', box).forEach((k) => k.addEventListener('click', () => { const p = inp.selectionStart ?? inp.value.length; inp.value = inp.value.slice(0, p) + k.textContent + inp.value.slice(p); inp.focus(); inp.setSelectionRange(p + 1, p + 1); }));
    const done = (r) => { $('.qform', box).remove(); box.insertAdjacentHTML('beforeend', `<div class="given">Deine Antwort: <b>${esc(inp.value || '–')}</b></div>`); result(r.ok, r); };
    $('.qform', box).addEventListener('submit', (e) => {
      e.preventDefault();
      if (!inp.value.trim()) return;
      const r = checkAnswer(inp.value, [sd.ans], { accentTolerant: state.profile.settings.accentTolerant, stripArticle: sd.ansForeign && ['en', 'fr'].includes(sd.a.key) && !/^(le |la |les |l')/i.test(sd.ans) });
      if (sd.ansForeign && sd.a.key === 'fr' && /^(le |la |les |l')/i.test(sd.ans) && !r.ok) {
        const r2 = checkAnswer(inp.value, [sd.ans], { accentTolerant: true, stripArticle: true });
        if (r2.ok) { done({ ok: false, typo: false }); $('.qres div', box).textContent = '✗ Artikel vergessen oder falsch'; return; }
      }
      done(r);
    });
    $('#skip', box).addEventListener('click', () => done({ ok: false }));
  }
  $('#say-q', box)?.addEventListener('click', () => sayFor(sd.a, it.term));
  if (auto && sayQ) sayFor(sd.a, it.term);
}

function finish(root, s, cfg) {
  const pct = s.total ? Math.round((s.right / s.total) * 100) : 0;
  const msg = pct === 100 ? 'Perfekt! 🏆' : pct >= 80 ? 'Sehr gut! 💪' : pct >= 50 ? 'Gut gemacht! 👍' : 'Dranbleiben – Übung macht den Meister! 🌱';
  $('#qbar', root).style.width = '100%';
  $('#qcount', root).textContent = '';
  $('#qcard', root).innerHTML = `
    <div class="card center">
      <div class="big-num">${pct}%</div><p>${msg}</p>
      <p>✓ ${s.right} richtig · ✗ ${s.wrong} falsch</p>
    </div>
    ${s.wrongItems.length ? `<h2 class="sec">Nochmal ansehen</h2><div class="list">${s.wrongItems.map((it) => { const sd = sides(it, 'f2d'); return `<div class="list-row"><span class="grow"><b>${esc(sd.q)}</b><small>${esc(sd.ans)}</small></span></div>`; }).join('')}</div>` : ''}
    <div class="stack">
      ${s.wrongItems.length ? '<button class="btn primary big" id="again">Fehler wiederholen</button>' : ''}
      <button class="btn big" id="fin">Fertig</button>
    </div>`;
  $('#again', root)?.addEventListener('click', () => { pass.quiz = { ...cfg, ids: s.wrongItems.map((i) => i.id) }; refresh(); });
  $('#fin', root).addEventListener('click', () => go(cfg.back || '/learn'));
}
