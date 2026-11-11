// Backup, Teilen, Import (Backup / geteilte Unit / CSV), Drucken
import * as db from './db.js';
import * as S from './store.js';
import { $, $$, esc, modal, toast, confirmDlg, pickFile, shareFile, sanitize, uid, todayKey } from './ui.js';

const { state } = S;
const VOCAB_FIELDS = ['term', 'translation', 'example', 'phonetic', 'genus', 'wortart', 'genitiv', 'stammformen', 'formen', 'herkunft', 'notes'];

// ---------- Backup ----------
export async function exportBackup() {
  const p = state.profile;
  p.lastBackup = Date.now();
  await S.saveProfile();
  const data = { app: 'lern-app', type: 'backup', version: 1, exported: new Date().toISOString(), profile: p, areas: state.areas, units: state.units, items: state.items, notes: state.notes, ideas: state.ideas };
  const name = `LernApp-Backup_${p.name}_${todayKey()}.json`;
  await shareFile(name, JSON.stringify(data), 'application/json', 'Backup der Lern App');
  toast('Backup erstellt');
}

async function restoreBackup(data) {
  const p = data.profile;
  const exists = state.profiles.find((x) => x.id === p.id) || (await db.get('profiles', p.id));
  if (exists && !(await confirmDlg(`Profil „${p.name}“ gibt es auf diesem Gerät schon. Mit dem Backup überschreiben?`, 'Überschreiben', true))) return false;
  if (exists) await db.deleteProfileData(p.id);
  await db.put('profiles', p);
  for (const s of ['areas', 'units', 'items', 'notes', 'ideas']) await db.putMany(s, (data[s] || []).map((x) => ({ ...x, profileId: p.id })));
  await S.loadProfiles();
  if (state.profile?.id === p.id) await S.openProfile(p.id);
  toast(`Profil „${p.name}“ wiederhergestellt`);
  return true;
}

export async function restoreBackupFlow() {
  const f = await pickFile('.json,application/json');
  if (!f) return false;
  try {
    const data = JSON.parse(await f.text());
    if (data.app !== 'lern-app' || data.type !== 'backup') { toast('Das ist kein Backup der Lern App'); return false; }
    return await restoreBackup(data);
  } catch (e) { toast('Datei konnte nicht gelesen werden'); return false; }
}

// ---------- Unit teilen ----------
export async function shareUnit(unitId) {
  const u = S.unit(unitId), a = S.area(u.areaId);
  const vocab = S.vocabOf(a.id, u.id).map((v) => Object.fromEntries(VOCAB_FIELDS.filter((f) => v[f]).map((f) => [f, v[f]])));
  const notes = S.notesOf(a.id, u.id);
  const data = {
    app: 'lern-app', type: 'share', version: 1,
    area: { type: a.type, key: a.key, name: a.name, icon: a.icon },
    unit: { name: u.name, book: u.book || '' },
    vocab,
    notes: notes.map((n) => ({ title: n.title, html: n.html, cards: S.cardsOf(n.id).map((c) => ({ q: c.q, a: c.a })) })),
  };
  await shareFile(`LernApp_${a.name}_${u.name}.json`.replace(/[\\/:*?"<>|]/g, '-'), JSON.stringify(data), 'application/json', `${a.name}: ${u.name}`);
}

async function importShare(data) {
  // Zielbereich wählen (gleiche Sprache vorschlagen)
  const match = state.areas.find((a) => a.type === data.area.type && (a.type === 'lang' ? a.key === data.area.key : a.name === data.area.name));
  const areaId = await new Promise((resolve) => {
    modal({
      title: 'Geteilte Unit importieren',
      body: `<p><b>${esc(data.unit.name)}</b> (${data.vocab.length} Einträge, ${data.notes.length} Lernzettel)</p>
      <label class="field"><span>In Bereich</span><select class="input" id="is-area">
        ${state.areas.map((a) => `<option value="${a.id}" ${match && match.id === a.id ? 'selected' : ''}>${a.icon} ${esc(a.name)}</option>`).join('')}
        <option value="__new">＋ Neuer Bereich „${esc(data.area.name)}“</option></select></label>`,
      actions: [{ label: 'Abbrechen', onClick: () => resolve(null) }, { label: 'Importieren', primary: true, onClick: (w) => resolve($('#is-area', w).value) }],
    });
  });
  if (!areaId) return false;
  let aId = areaId;
  if (areaId === '__new') {
    const L = data.area.type === 'lang' ? S.LANGS[data.area.key] : null;
    const a = await S.save('areas', { type: data.area.type, key: data.area.key, name: data.area.name, icon: data.area.icon, color: L ? L.color : S.SUBJECT_COLORS[0], order: state.areas.length });
    aId = a.id;
  }
  const u = await S.save('units', { areaId: aId, name: data.unit.name, book: data.unit.book, order: S.unitsOf(aId).length });
  await S.saveMany('items', data.vocab.map((v) => ({ ...Object.fromEntries(VOCAB_FIELDS.map((f) => [f, String(v[f] || '')])), kind: 'vocab', areaId: aId, unitId: u.id, box: 0 })));
  for (const n of data.notes) {
    const note = await S.save('notes', { areaId: aId, unitId: u.id, title: String(n.title || 'Lernzettel'), html: sanitize(String(n.html || '')) });
    await S.saveMany('items', (n.cards || []).map((c) => ({ kind: 'card', areaId: aId, unitId: u.id, noteId: note.id, q: String(c.q), a: String(c.a), box: 0 })));
  }
  toast(`„${data.unit.name}“ importiert`);
  return true;
}

// ---------- CSV ----------
export function parseDelimited(text) {
  const lines = text.replace(/^﻿/, '').split(/\r?\n/).filter((l) => l.trim());
  if (!lines.length) return [];
  const sample = lines.slice(0, 10).join('\n');
  const delim = ['\t', ';', ','].map((d) => [d, (sample.match(new RegExp(d === '\t' ? '\t' : d, 'g')) || []).length]).sort((a, b) => b[1] - a[1])[0][0];
  return lines.map((l) => splitLine(l, delim)).filter((r) => r.length >= 2 && r[0]);
}
function splitLine(line, d) {
  const out = []; let cur = '', q = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (q) { if (ch === '"' && line[i + 1] === '"') { cur += '"'; i++; } else if (ch === '"') q = false; else cur += ch; }
    else if (ch === '"') q = true;
    else if (ch === d) { out.push(cur.trim()); cur = ''; }
    else cur += ch;
  }
  out.push(cur.trim());
  return out;
}

/** Import-Dialog für Zeilen [fremd, deutsch, (beispiel)] in eine Unit */
export function importRowsDialog(rows, areaId, unitId, onDone) {
  const a = S.area(areaId);
  modal({
    title: `${rows.length} Zeilen importieren`, wide: true,
    body: `
      <label class="switch"><input type="checkbox" id="ir-swap"><span>Spalten tauschen (1. Spalte ist Deutsch)</span></label>
      <div class="table-wrap"><table class="preview"><tr><th>${a.type === 'lang' ? 'Fremdsprache' : 'Begriff'}</th><th>${a.type === 'lang' ? 'Deutsch' : 'Erklärung'}</th></tr>
      ${rows.slice(0, 8).map((r) => `<tr><td>${esc(r[0])}</td><td>${esc(r[1])}</td></tr>`).join('')}${rows.length > 8 ? `<tr><td colspan="2">… und ${rows.length - 8} weitere</td></tr>` : ''}</table></div>`,
    actions: [{ label: 'Abbrechen' }, {
      label: 'Importieren', primary: true, onClick: async (w) => {
        const swap = $('#ir-swap', w).checked;
        await S.saveMany('items', rows.map((r) => ({ kind: 'vocab', areaId, unitId, term: swap ? r[1] : r[0], translation: swap ? r[0] : r[1], example: r[2] || '', box: 0 })));
        toast(`${rows.length} Einträge importiert`);
        onDone && onDone();
      },
    }],
  });
}

/** Allgemeiner Datei-Import (Backup, geteilte Unit, CSV) */
export async function importFileFlow(areaId, unitId, onDone) {
  const f = await pickFile('.json,.csv,.txt,.tsv,application/json,text/csv,text/plain');
  if (!f) return false;
  const text = await f.text();
  if (/\.json$/i.test(f.name) || text.trim().startsWith('{')) {
    let data; try { data = JSON.parse(text); } catch (_) { toast('Datei konnte nicht gelesen werden'); return false; }
    if (data.app !== 'lern-app') { toast('Unbekanntes Dateiformat'); return false; }
    if (data.type === 'backup') return restoreBackup(data);
    if (data.type === 'share') return importShare(data);
    return false;
  }
  const rows = parseDelimited(text);
  if (!rows.length) { toast('Keine Zeilen erkannt'); return false; }
  if (!areaId || !unitId) {
    toast('CSV bitte direkt in einer Unit importieren (Unit öffnen → Import)');
    return false;
  }
  importRowsDialog(rows, areaId, unitId, onDone);
  return false;
}

// ---------- Drucken ----------
export function printHTML(title, html) {
  let el = $('#print');
  if (!el) { el = document.createElement('div'); el.id = 'print'; document.body.appendChild(el); }
  el.innerHTML = `<h1>${esc(title)}</h1>${html}`;
  document.body.classList.add('printing');
  setTimeout(() => { window.print(); setTimeout(() => document.body.classList.remove('printing'), 500); }, 100);
}

export { uid };
