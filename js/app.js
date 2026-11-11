// Lern App – Hauptdatei: Shell, Profile, Start, Einstellungen, Ideen
import { $, $$, esc, attr, modal, toast, confirmDlg, promptDlg, todayKey, fmtDate, pickFile, shareFile } from './ui.js';
import * as S from './store.js';
import { route, go, match, current, setRenderer, refresh } from './nav.js';
import * as IO from './io.js';
import './pages/area.js';
import './pages/quiz.js';
import './pages/notes.js';
import './pages/grammar.js';
import './pages/speak.js';

export const VERSION = '1.0.0';
const { state } = S;

// ---------- Shell ----------
const app = document.getElementById('app');

async function render() {
  const path = current();
  const open = ['/', '/profiles'];
  if (!state.profile && !open.includes(path.split('?')[0])) {
    const last = localStorage.getItem('lastProfile');
    if (last && state.profiles.find((p) => p.id === last) && !state.profiles.find((p) => p.id === last).pin) {
      await S.openProfile(last);
    } else return go('/profiles', true);
  }
  const m = match(path);
  if (!m) return go(state.profile ? '/home' : '/profiles', true);
  let view;
  try { view = await m.handler(m.params); } catch (e) { console.error(e); view = { title: 'Fehler', html: `<div class="card"><p>Da ist etwas schiefgelaufen:</p><pre>${esc(e.message)}</pre></div>`, back: '/home' }; }
  if (!view) return;
  document.querySelectorAll('.modal-wrap').forEach((m) => m.remove());
  document.body.classList.remove('no-scroll');
  show(view);
}

function show(v) {
  document.documentElement.style.setProperty('--accent', v.color || state.profile?.color || '#2563eb');
  const tabs = v.tabs !== false && !!state.profile;
  const tabPath = current().split('?')[0];
  app.innerHTML = `
  <header class="top">
    <div class="top-l">${v.back ? `<button class="icon-btn back" data-back aria-label="Zurück">‹</button>` : ''}</div>
    <div class="top-c"><h1>${esc(v.title || '')}</h1>${v.sub ? `<div class="sub">${esc(v.sub)}</div>` : ''}</div>
    <div class="top-r">${(v.actions || []).map((a, i) => `<button class="icon-btn" data-act-i="${i}" aria-label="${attr(a.label)}" title="${attr(a.label)}">${a.icon}</button>`).join('')}${v.menu ? `<button class="icon-btn" data-menu aria-label="Mehr">⋯</button>` : ''}</div>
  </header>
  <main id="main" class="${v.mainClass || ''}">${v.html || ''}</main>
  ${tabs ? `<nav class="tabbar">
    ${tab('/home', '🏠', 'Start', tabPath)}${tab('/learn', '🎯', 'Lernen', tabPath)}${tab('/ideas', '💡', 'Ideen', tabPath)}${tab('/settings', '⚙️', 'Mehr', tabPath)}
  </nav>` : ''}`;
  document.body.classList.toggle('has-tabs', tabs);
  const main = $('#main');
  $('[data-back]', app)?.addEventListener('click', () => go(v.back === true ? '/home' : v.back));
  $$('[data-act-i]', app).forEach((b) => b.addEventListener('click', () => v.actions[+b.dataset.actI].onClick()));
  $('[data-menu]', app)?.addEventListener('click', () => openMenu(v.menu));
  window.scrollTo(0, 0);
  if (v.mount) v.mount(main);
}
function tab(path, icon, label, cur) {
  const on = cur === path || (path === '/home' && ['/home'].includes(cur));
  return `<a href="#${path}" class="${on ? 'on' : ''}"><span>${icon}</span>${label}</a>`;
}
export function openMenu(items) {
  const m = modal({ body: `<div class="menu">${items.map((it, i) => `<button class="menu-item ${it.danger ? 'danger' : ''}" data-i="${i}">${it.icon || ''} ${esc(it.label)}</button>`).join('')}</div>` });
  m.el.classList.add('sheet');
  m.el.addEventListener('click', (e) => { const b = e.target.closest('.menu-item'); if (b) { m.close(); items[+b.dataset.i].onClick(); } });
}

export function celebrate(text = '🎉 Tagesziel erreicht!') {
  toast(text, 3000);
  const c = document.createElement('div'); c.className = 'confetti';
  c.innerHTML = Array.from({ length: 40 }, (_, i) => `<i style="left:${Math.random() * 100}%;animation-delay:${Math.random() * 0.6}s;background:hsl(${i * 37},80%,60%)"></i>`).join('');
  document.body.appendChild(c); setTimeout(() => c.remove(), 2600);
}

// ---------- Profile ----------
route('/', () => go('/profiles', true));
route('/profiles', async () => {
  await S.loadProfiles();
  S.closeProfile();
  return {
    title: 'Lern App', tabs: false,
    html: `
    <div class="hero"><div class="logo">📚</div><p>Wer lernt heute?</p></div>
    <div class="profile-list">
      ${state.profiles.map((p) => `<button class="profile" data-id="${p.id}" style="--c:${p.color}"><span class="avatar">${esc(p.name[0] || '?')}</span><span>${esc(p.name)}</span>${p.pin ? '<span class="lock">🔒</span>' : ''}</button>`).join('')}
    </div>
    <div class="stack">
      <button class="btn primary big" id="new">＋ Profil anlegen</button>
      <button class="btn" id="restore">Backup wiederherstellen</button>
    </div>
    <p class="hint center">Alle Daten bleiben auf diesem Gerät. Für ein zweites Gerät: Backup exportieren und dort wiederherstellen.</p>`,
    mount(root) {
      $$('.profile', root).forEach((b) => b.addEventListener('click', () => unlock(b.dataset.id)));
      $('#new', root).addEventListener('click', newProfile);
      $('#restore', root).addEventListener('click', async () => { if (await IO.restoreBackupFlow()) refresh(); });
    },
  };
});

async function unlock(id) {
  const p = state.profiles.find((x) => x.id === id);
  if (p.pin) {
    const pin = await promptDlg(`PIN für ${p.name}`, '', '4 Ziffern');
    if (pin === null) return;
    if (pin !== p.pin) return toast('PIN falsch');
  }
  await S.openProfile(id);
  go('/home');
}

function newProfile() {
  const colors = ['#2563eb', '#db2777', '#16a34a', '#7c3aed', '#ea580c', '#0891b2'];
  modal({
    title: 'Neues Profil',
    body: `
      <label class="field"><span>Name</span><input class="input" id="np-name" placeholder="z. B. Lena"></label>
      <label class="field"><span>Vorlage</span><select class="input" id="np-tpl">
        ${Object.entries(S.TEMPLATES).map(([k, t]) => `<option value="${k}">${esc(t.name)}</option>`).join('')}</select></label>
      <div class="field"><span>Farbe</span><div class="colors">${colors.map((c, i) => `<label><input type="radio" name="np-col" value="${c}" ${i ? '' : 'checked'}><i style="background:${c}"></i></label>`).join('')}</div></div>
      <label class="field"><span>PIN (optional, 4 Ziffern)</span><input class="input" id="np-pin" inputmode="numeric" maxlength="4" placeholder="leer = ohne PIN"></label>
      <p class="hint">Die PIN trennt nur die Profile auf einem gemeinsamen Gerät – sie ist kein echter Schutz.</p>`,
    actions: [{ label: 'Abbrechen' }, {
      label: 'Anlegen', primary: true, onClick: async (w) => {
        const name = $('#np-name', w).value.trim();
        if (!name) { toast('Bitte einen Namen eingeben'); return false; }
        const pin = $('#np-pin', w).value.trim();
        if (pin && !/^\d{4}$/.test(pin)) { toast('PIN: genau 4 Ziffern'); return false; }
        const p = await S.createProfile({ name, template: $('#np-tpl', w).value, color: $('input[name=np-col]:checked', w).value, pin });
        await S.openProfile(p.id);
        go('/home');
      },
    }],
  });
}

// ---------- Start ----------
route('/home', () => {
  const p = state.profile;
  const goal = p.settings.dailyGoal, done = S.todayCount();
  const pct = Math.min(1, done / goal);
  const due = S.dueItems().length;
  const days = S.lastDays(7);
  const maxDay = Math.max(goal, ...days.map((d) => d.count));
  const langs = state.areas.filter((a) => a.type === 'lang');
  const subs = state.areas.filter((a) => a.type === 'subject');
  const tile = (a) => {
    const items = state.items.filter((i) => i.areaId === a.id);
    const d = items.filter((i) => S.isDue(i)).length;
    const pr = S.progress(items);
    return `<a class="tile" href="#/area/${a.id}" style="--c:${a.color}">
      <span class="tile-ic">${a.icon}</span><span class="tile-name">${esc(a.name)}</span>
      <span class="tile-meta">${items.length ? `${items.length} Einträge` : 'noch leer'}</span>
      ${items.length ? `<span class="bar"><i style="width:${pr.pct}%"></i></span>` : ''}
      ${d ? `<span class="badge">${d}</span>` : ''}</a>`;
  };
  return {
    title: `Hallo, ${p.name}!`,
    menu: [{ label: 'Profil wechseln', icon: '👥', onClick: () => go('/profiles') }],
    html: `
    ${S.needsBackup() ? `<div class="banner warn"><span>💾 Letztes Backup ist über eine Woche her.</span><button class="btn small" id="bk">Jetzt sichern</button></div>` : ''}
    <section class="card goal">
      <div class="ring" style="--p:${pct}"><svg viewBox="0 0 36 36"><circle cx="18" cy="18" r="15.9" class="bg"/><circle cx="18" cy="18" r="15.9" class="fg" ${pct ? '' : 'style="display:none"'} stroke-dasharray="${(pct * 100).toFixed(1)} 100"/></svg><div><b>${done}</b><small>/ ${goal}</small></div></div>
      <div class="goal-txt">
        <div class="goal-title">${done >= goal ? 'Tagesziel geschafft! 🎉' : 'Tagesziel'}</div>
        <div class="streak">🔥 ${S.streak()} ${S.streak() === 1 ? 'Tag' : 'Tage'} in Folge</div>
        <div class="week">${days.map((d) => `<span title="${d.key}"><i style="height:${Math.max(4, (d.count / maxDay) * 100)}%" class="${d.count >= goal ? 'ok' : ''}"></i><small>${'SMDMDFS'[new Date(d.key + 'T12:00').getDay()]}</small></span>`).join('')}</div>
      </div>
    </section>
    <a class="btn primary big block" href="#/learn">${due ? `🎯 Jetzt lernen – ${due} fällig` : '🎯 Lernen'}</a>
    ${langs.length ? `<h2 class="sec">Sprachen</h2><div class="tiles">${langs.map(tile).join('')}</div>` : ''}
    ${subs.length ? `<h2 class="sec">Fächer</h2><div class="tiles">${subs.map(tile).join('')}</div>` : ''}
    <button class="btn block" id="add-area">＋ Bereich hinzufügen</button>`,
    mount(root) {
      $('#bk', root)?.addEventListener('click', () => IO.exportBackup().then(refresh));
      $('#add-area', root).addEventListener('click', addArea);
    },
  };
});

export function addArea() {
  const have = new Set(state.areas.filter((a) => a.type === 'lang').map((a) => a.key));
  const free = Object.entries(S.LANGS).filter(([k]) => !have.has(k));
  modal({
    title: 'Bereich hinzufügen',
    body: `
      ${free.length ? `<div class="field"><span>Sprache</span><div class="chips">${free.map(([k, l]) => `<button class="chip" data-lang="${k}">${l.icon} ${esc(l.name)}</button>`).join('')}</div></div>` : ''}
      <div class="field"><span>Oder eigenes Fach</span>
        <div class="row"><input class="input" id="aa-icon" value="📘" maxlength="4" style="width:3.5em;text-align:center"><input class="input" id="aa-name" placeholder="z. B. Pharmakologie"></div></div>`,
    actions: [{ label: 'Abbrechen' }, {
      label: 'Fach anlegen', primary: true, onClick: async (w) => {
        const name = $('#aa-name', w).value.trim(); if (!name) { toast('Bitte einen Namen eingeben'); return false; }
        await S.save('areas', { type: 'subject', key: 'subject', name, icon: $('#aa-icon', w).value || '📘', color: S.SUBJECT_COLORS[state.areas.length % S.SUBJECT_COLORS.length], order: state.areas.length });
        refresh();
      },
    }],
    onMount(w, close) {
      $$('[data-lang]', w).forEach((b) => b.addEventListener('click', async () => {
        const k = b.dataset.lang, l = S.LANGS[k];
        await S.save('areas', { type: 'lang', key: k, name: l.name, icon: l.icon, color: l.color, order: state.areas.length });
        close(); refresh();
      }));
    },
  });
}

// ---------- Lernen: alles Fällige ----------
route('/learn', () => {
  const due = S.dueItems();
  const byArea = state.areas.map((a) => ({ a, n: due.filter((i) => i.areaId === a.id).length })).filter((x) => x.n);
  return {
    title: 'Lernen',
    html: `
    <div class="card center">
      <div class="big-num">${due.length}</div><p>${due.length === 1 ? 'Eintrag ist' : 'Einträge sind'} heute fällig</p>
      ${due.length ? `<button class="btn primary big block" id="all">Alles Fällige abfragen</button>` : '<p class="hint">Super – alles erledigt! Du kannst trotzdem in jedem Bereich üben.</p>'}
    </div>
    ${byArea.length ? `<h2 class="sec">Nach Bereich</h2><div class="list">${byArea.map(({ a, n }) => `<button class="list-row" data-a="${a.id}"><span class="ic">${a.icon}</span><span class="grow">${esc(a.name)}</span><span class="badge static">${n}</span></button>`).join('')}</div>` : ''}
    <h2 class="sec">Üben</h2>
    <div class="list">${state.areas.map((a) => `<a class="list-row" href="#/area/${a.id}"><span class="ic">${a.icon}</span><span class="grow">${esc(a.name)}</span><span class="chev">›</span></a>`).join('')}</div>`,
    mount(root) {
      $('#all', root)?.addEventListener('click', () => startQuiz({ ids: due.map((i) => i.id), title: 'Alles Fällige', back: '/learn' }));
      $$('[data-a]', root).forEach((b) => b.addEventListener('click', () => startQuiz({ ids: due.filter((i) => i.areaId === b.dataset.a).map((i) => i.id), title: S.area(b.dataset.a).name, back: '/learn' })));
    },
  };
});

import { pass } from './nav.js';
export function startQuiz(cfg) { pass.quiz = cfg; go('/quiz'); }

// ---------- Ideen ----------
route('/ideas', () => {
  const ideas = state.ideas.slice().sort((a, b) => (a.done - b.done) || b.created - a.created);
  return {
    title: 'Ideen & Wünsche',
    html: `
    <div class="card">
      <p class="hint">Was fehlt dir? Was nervt? Was wäre cool? Schreib's auf – und schick es gesammelt weiter.</p>
      <textarea class="input" id="idea" rows="3" placeholder="Meine Idee …"></textarea>
      <button class="btn primary block" id="add">Notieren</button>
    </div>
    <div class="list">${ideas.map((i) => `<div class="list-row idea ${i.done ? 'done' : ''}"><button class="tick" data-t="${i.id}">${i.done ? '✓' : ''}</button><span class="grow">${esc(i.text)}<small>${fmtDate(i.created)}</small></span><button class="icon-btn" data-d="${i.id}">🗑</button></div>`).join('') || '<p class="hint center">Noch keine Ideen notiert.</p>'}</div>
    ${ideas.some((i) => !i.done) ? `<button class="btn block" id="share">📤 Offene Ideen teilen</button>` : ''}`,
    mount(root) {
      $('#add', root).addEventListener('click', async () => {
        const text = $('#idea', root).value.trim(); if (!text) return;
        await S.save('ideas', { text, done: false }); toast('Notiert 👍'); refresh();
      });
      $$('[data-t]', root).forEach((b) => b.addEventListener('click', async () => { const i = state.ideas.find((x) => x.id === b.dataset.t); i.done = !i.done; await S.save('ideas', i); refresh(); }));
      $$('[data-d]', root).forEach((b) => b.addEventListener('click', async () => { await S.remove('ideas', b.dataset.d); refresh(); }));
      $('#share', root)?.addEventListener('click', async () => {
        const text = `Ideen für die Lern App (${state.profile.name}):\n\n` + ideas.filter((i) => !i.done).map((i) => `• ${i.text}`).join('\n');
        if (navigator.share) { try { await navigator.share({ title: 'Ideen für die Lern App', text }); } catch (_) { /* abgebrochen */ } }
        else { await navigator.clipboard?.writeText(text); toast('In die Zwischenablage kopiert'); }
      });
    },
  };
});

// ---------- Einstellungen ----------
route('/settings', () => {
  const p = state.profile, s = p.settings;
  return {
    title: 'Mehr',
    html: `
    <h2 class="sec">Profil</h2>
    <div class="card form">
      <label class="field"><span>Name</span><input class="input" id="s-name" value="${attr(p.name)}"></label>
      <label class="field"><span>PIN (leer = keine)</span><input class="input" id="s-pin" inputmode="numeric" maxlength="4" value="${attr(p.pin)}"></label>
      <label class="field"><span>Farbe</span><input type="color" id="s-color" value="${attr(p.color)}"></label>
    </div>
    <h2 class="sec">Lernen</h2>
    <div class="card form">
      <label class="field"><span>Tagesziel (Abfragen pro Tag)</span><input class="input" type="number" min="5" max="200" id="s-goal" value="${s.dailyGoal}"></label>
      <label class="field"><span>Fragen pro Abfrage-Runde</span><input class="input" type="number" min="5" max="100" id="s-size" value="${s.sessionSize}"></label>
      <label class="switch"><input type="checkbox" id="s-acc" ${s.accentTolerant ? 'checked' : ''}><span>Fehlende Akzente (é, è, ç) als richtig werten</span></label>
      <label class="switch"><input type="checkbox" id="s-auto" ${s.autoSpeak ? 'checked' : ''}><span>Englisch/Französisch automatisch vorlesen</span></label>
      <label class="field"><span>Englische Aussprache</span><select class="input" id="s-voice"><option value="en-GB" ${s.voiceEn === 'en-GB' ? 'selected' : ''}>Britisch (en-GB)</option><option value="en-US" ${s.voiceEn === 'en-US' ? 'selected' : ''}>Amerikanisch (en-US)</option></select></label>
      <label class="field"><span>Sprechtempo</span><input type="range" min="0.5" max="1.2" step="0.05" id="s-rate" value="${s.rate}"></label>
    </div>
    <button class="btn primary block" id="save">Speichern</button>

    <h2 class="sec">Bereiche</h2>
    <div class="list">${state.areas.map((a) => `<div class="list-row"><span class="ic">${a.icon}</span><span class="grow">${esc(a.name)}</span><button class="icon-btn" data-up="${a.id}">↑</button><button class="icon-btn" data-del="${a.id}">🗑</button></div>`).join('')}</div>
    <button class="btn block" id="add-area">＋ Bereich hinzufügen</button>

    <h2 class="sec">Daten & Geräte</h2>
    <div class="list">
      <button class="list-row" id="b-exp"><span class="ic">💾</span><span class="grow">Backup exportieren<small>Zuletzt: ${p.lastBackup ? fmtDate(p.lastBackup) : 'nie'}</small></span></button>
      <button class="list-row" id="b-imp"><span class="ic">📥</span><span class="grow">Datei importieren<small>Backup, geteilte Unit oder CSV (Quizlet, Anki …)</small></span></button>
    </div>
    <p class="hint">Zum Übertragen auf iPad/iPhone: Backup exportieren → per AirDrop oder „Dateien“ aufs andere Gerät → dort „Datei importieren“.</p>

    <h2 class="sec">App</h2>
    <div class="list">
      <a class="list-row" href="#/profiles"><span class="ic">👥</span><span class="grow">Profil wechseln</span><span class="chev">›</span></a>
      <button class="list-row" id="help"><span class="ic">❓</span><span class="grow">Hilfe & Tipps</span></button>
      <button class="list-row danger" id="p-del"><span class="ic">⚠️</span><span class="grow">Profil löschen</span></button>
    </div>
    <p class="hint center">Lern App ${VERSION}</p>`,
    mount(root) {
      $('#save', root).addEventListener('click', async () => {
        const pin = $('#s-pin', root).value.trim();
        if (pin && !/^\d{4}$/.test(pin)) return toast('PIN: genau 4 Ziffern');
        p.name = $('#s-name', root).value.trim() || p.name; p.pin = pin; p.color = $('#s-color', root).value;
        Object.assign(s, {
          dailyGoal: Math.max(5, +$('#s-goal', root).value || 20), sessionSize: Math.max(5, +$('#s-size', root).value || 20),
          accentTolerant: $('#s-acc', root).checked, autoSpeak: $('#s-auto', root).checked, voiceEn: $('#s-voice', root).value, rate: +$('#s-rate', root).value,
        });
        await S.saveProfile(); toast('Gespeichert'); refresh();
      });
      $$('[data-up]', root).forEach((b) => b.addEventListener('click', async () => {
        const i = state.areas.findIndex((a) => a.id === b.dataset.up); if (i <= 0) return;
        [state.areas[i - 1], state.areas[i]] = [state.areas[i], state.areas[i - 1]];
        state.areas.forEach((a, k) => { a.order = k; });
        await S.saveMany('areas', state.areas); refresh();
      }));
      $$('[data-del]', root).forEach((b) => b.addEventListener('click', async () => {
        const a = S.area(b.dataset.del);
        const n = state.items.filter((i) => i.areaId === a.id).length + state.notes.filter((x) => x.areaId === a.id).length;
        if (await confirmDlg(`„${a.name}“ löschen?${n ? ` Dabei werden ${n} Einträge/Lernzettel gelöscht.` : ''}`, 'Löschen', true)) { await S.removeArea(a.id); refresh(); }
      }));
      $('#add-area', root).addEventListener('click', addArea);
      $('#b-exp', root).addEventListener('click', () => IO.exportBackup().then(refresh));
      $('#b-imp', root).addEventListener('click', () => IO.importFileFlow().then((ok) => ok && refresh()));
      $('#help', root).addEventListener('click', showHelp);
      $('#p-del', root).addEventListener('click', async () => {
        if (!(await confirmDlg(`Profil „${p.name}“ mit allen Daten unwiderruflich löschen? Tipp: vorher ein Backup exportieren.`, 'Endgültig löschen', true))) return;
        const { deleteProfileData } = await import('./db.js');
        await deleteProfileData(p.id); S.closeProfile(); go('/profiles');
      });
    },
  };
});

export function showHelp() {
  modal({
    title: 'Hilfe & Tipps', wide: true,
    body: `
    <h3>Aufbau</h3><p>Bereich (Sprache oder Fach) → Unit/Thema (optional mit Lehrwerk) → Vokabeln/Begriffe und Lernzettel.</p>
    <h3>Karteikasten</h3><p>Jede Vokabel wandert bei richtiger Antwort ein Fach weiter (Wiederholung nach 1, 3, 7, 16, 35 Tagen). Bei Fehlern zurück in Fach 1. Unter „Lernen“ siehst du, was heute fällig ist.</p>
    <h3>Foto-Import</h3><p>In einer Unit „📷 Foto“ wählen: Vokabelliste fotografieren oder Screenshot aus der BiBox wählen. Am besten gerade und gut beleuchtet. Gedruckter Text klappt gut, Handschrift weniger. Vor dem Speichern kannst du alles prüfen.</p>
    <h3>Lernzettel</h3><p>Mit <mark>Markieren</mark> hervorgehobene Begriffe werden in der Abfrage zu Lücken. Zusätzlich kannst du Frage-Karten anlegen. Bilder lassen sich beschriften.</p>
    <h3>Aussprache</h3><p>Englisch und Französisch werden mit den iPhone/iPad-Stimmen vorgelesen. Bessere Stimmen: Einstellungen → Bedienungshilfen → Gesprochene Inhalte → Stimmen. Mit „Aufnehmen“ vergleichst du dich selbst mit dem Original.</p>
    <h3>Als App installieren</h3><p>In Safari: Teilen-Symbol → „Zum Home-Bildschirm“. Dann startet die App im Vollbild und die Daten sind besser vor dem automatischen Löschen durch iOS geschützt.</p>
    <h3>Sicherung</h3><p>Die Daten liegen nur auf diesem Gerät. Exportiere regelmäßig ein Backup (z. B. in iCloud Drive).</p>`,
    actions: [{ label: 'Schließen', primary: true }],
  });
}

// ---------- Start ----------
setRenderer(render);
window.addEventListener('hashchange', render);
(async () => {
  try { await navigator.storage?.persist?.(); } catch (_) { /* */ }
  await S.loadProfiles();
  render();
})();

// Service Worker (Offline + Updates)
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').then((reg) => {
    reg.addEventListener('updatefound', () => {
      const nw = reg.installing;
      nw?.addEventListener('statechange', () => {
        if (nw.state === 'installed' && navigator.serviceWorker.controller) {
          const b = document.createElement('div'); b.className = 'update-bar';
          b.innerHTML = '<span>Neue Version verfügbar</span><button class="btn small primary">Aktualisieren</button>';
          b.querySelector('button').onclick = () => { nw.postMessage('skip'); };
          document.body.appendChild(b);
        }
      });
    });
  }).catch(() => {});
  let reloaded = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => { if (!reloaded) { reloaded = true; location.reload(); } });
}

export { shareFile, pickFile, todayKey };
