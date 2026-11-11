// App-Zustand, Kataloge, Karteikasten-Logik, Motivation
import * as db from './db.js';
import { uid, todayKey, addDays } from './ui.js';

// Sprachen mit Sonderfunktionen
export const LANGS = {
  en: { name: 'Englisch', icon: '🇬🇧', color: '#2563eb', tts: 'en', ocr: 'eng+deu', fields: ['example', 'phonetic'], foreignLabel: 'Englisch' },
  fr: { name: 'Französisch', icon: '🇫🇷', color: '#db2777', tts: 'fr-FR', ocr: 'fra+deu', fields: ['genus', 'example'], foreignLabel: 'Französisch' },
  la: { name: 'Latein', icon: '🏛️', color: '#b45309', tts: null, ocr: 'lat+deu', fields: ['wortart', 'genitiv', 'genus', 'stammformen', 'formen'], foreignLabel: 'Latein' },
  med: { name: 'Med. Terminologie', icon: '⚕️', color: '#0d9488', tts: null, ocr: 'lat+deu', fields: ['wortart', 'genitiv', 'genus', 'formen', 'herkunft'], foreignLabel: 'Fachbegriff' },
};
export const SUBJECT_COLORS = ['#16a34a', '#7c3aed', '#0891b2', '#dc2626', '#ca8a04', '#4f46e5', '#ea580c', '#0f766e', '#be185d', '#475569'];

export const TEMPLATES = {
  schule: {
    name: 'Schule (Gymnasium)',
    langs: ['en', 'fr', 'la'],
    subjects: [['Biologie', '🧬'], ['Chemie', '⚗️'], ['Physik', '🔭'], ['Mathematik', '📐'], ['Deutsch', '📖'], ['Geschichte', '🏺'], ['Erdkunde', '🌍']],
  },
  medizin: {
    name: 'Medizinstudium',
    langs: ['en', 'fr', 'la', 'med'],
    subjects: [['Anatomie', '🦴'], ['Physiologie', '🫀'], ['Biochemie', '🧪'], ['Histologie', '🔬'], ['Biologie', '🧬'], ['Chemie', '⚗️'], ['Physik', '🔭'], ['Psychologie/Soziologie', '🧠']],
  },
  leer: { name: 'Leer (selbst einrichten)', langs: [], subjects: [] },
};

export const state = { profiles: [], profile: null, areas: [], units: [], items: [], notes: [], ideas: [] };

export async function loadProfiles() {
  state.profiles = (await db.getAll('profiles')).sort((a, b) => a.created - b.created);
  return state.profiles;
}

export async function createProfile({ name, color, template, pin }) {
  const p = {
    id: uid(), name, color: color || '#2563eb', pin: pin || '', created: Date.now(),
    settings: { dailyGoal: 20, accentTolerant: true, voiceEn: 'en-GB', rate: 0.9, sessionSize: 20, autoSpeak: false },
    activity: {}, lastBackup: Date.now(),
  };
  await db.put('profiles', p);
  const t = TEMPLATES[template] || TEMPLATES.leer;
  let order = 0;
  const areas = [];
  for (const k of t.langs) areas.push({ id: uid(), profileId: p.id, type: 'lang', key: k, name: LANGS[k].name, icon: LANGS[k].icon, color: LANGS[k].color, order: order++ });
  t.subjects.forEach(([n, ic], i) => areas.push({ id: uid(), profileId: p.id, type: 'subject', key: 'subject', name: n, icon: ic, color: SUBJECT_COLORS[i % SUBJECT_COLORS.length], order: order++ }));
  await db.putMany('areas', areas);
  await loadProfiles();
  return p;
}

export async function openProfile(id) {
  state.profile = state.profiles.find((p) => p.id === id) || (await db.get('profiles', id));
  if (!state.profile) return null;
  const [areas, units, items, notes, ideas] = await Promise.all(['areas', 'units', 'items', 'notes', 'ideas'].map((s) => db.byProfile(s, id)));
  Object.assign(state, {
    areas: areas.sort((a, b) => a.order - b.order),
    units: units.sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || a.created - b.created),
    items, notes, ideas,
  });
  localStorage.setItem('lastProfile', id);
  return state.profile;
}
export function closeProfile() { state.profile = null; localStorage.removeItem('lastProfile'); }

export async function saveProfile(p = state.profile) { await db.put('profiles', p); }

// ---------- generische CRUD-Funktionen ----------
const LISTS = { areas: 'areas', units: 'units', items: 'items', notes: 'notes', ideas: 'ideas' };
export async function save(store, obj) {
  obj.profileId = obj.profileId || state.profile.id;
  if (!obj.id) { obj.id = uid(); obj.created = Date.now(); }
  obj.updated = Date.now();
  await db.put(store, obj);
  const list = state[LISTS[store]];
  const i = list.findIndex((x) => x.id === obj.id);
  if (i >= 0) list[i] = obj; else list.push(obj);
  return obj;
}
export async function saveMany(store, arr) {
  arr.forEach((o) => { o.profileId = o.profileId || state.profile.id; if (!o.id) { o.id = uid(); o.created = Date.now(); } o.updated = Date.now(); });
  await db.putMany(store, arr);
  const list = state[LISTS[store]];
  arr.forEach((o) => { const i = list.findIndex((x) => x.id === o.id); if (i >= 0) list[i] = o; else list.push(o); });
}
export async function remove(store, ids) {
  ids = [].concat(ids);
  await db.delMany(store, ids);
  state[LISTS[store]] = state[LISTS[store]].filter((x) => !ids.includes(x.id));
}

export const area = (id) => state.areas.find((a) => a.id === id);
export const unit = (id) => state.units.find((u) => u.id === id);
export const unitsOf = (areaId) => state.units.filter((u) => u.areaId === areaId);
export const vocabOf = (areaId, unitId) => state.items.filter((i) => i.kind === 'vocab' && i.areaId === areaId && (!unitId || i.unitId === unitId));
export const notesOf = (areaId, unitId) => state.notes.filter((n) => n.areaId === areaId && (!unitId || n.unitId === unitId));
export const cardsOf = (noteId) => state.items.filter((i) => i.kind === 'card' && i.noteId === noteId);
export const langOf = (a) => (a && a.type === 'lang' ? LANGS[a.key] : null);

export async function removeArea(areaId) {
  await remove('items', state.items.filter((i) => i.areaId === areaId).map((i) => i.id));
  await remove('notes', state.notes.filter((n) => n.areaId === areaId).map((n) => n.id));
  await remove('units', state.units.filter((u) => u.areaId === areaId).map((u) => u.id));
  await remove('areas', areaId);
}
export async function removeUnit(unitId) {
  const noteIds = state.notes.filter((n) => n.unitId === unitId).map((n) => n.id);
  await remove('items', state.items.filter((i) => i.unitId === unitId || noteIds.includes(i.noteId)).map((i) => i.id));
  await remove('notes', noteIds);
  await remove('units', unitId);
}

// ---------- Karteikasten (5 Fächer) ----------
export const BOX_DAYS = [0, 1, 3, 7, 16, 35];
export function isDue(it, today = todayKey()) { return !it.box || !it.due || it.due <= today; }
export function dueItems(filter = () => true) { const t = todayKey(); return state.items.filter((i) => filter(i) && isDue(i, t)); }
export function grade(it, correct) {
  const today = todayKey();
  it.stats = it.stats || { right: 0, wrong: 0 };
  if (correct) {
    it.box = Math.min(5, (it.box || 0) + 1);
    it.stats.right++;
    it.due = addDays(today, BOX_DAYS[it.box] || 35);
  } else {
    it.box = 1;
    it.stats.wrong++;
    it.due = today;
  }
  it.lastSeen = Date.now();
}
/** Fortschritt einer Item-Menge: Anteil in Fach ≥ 4 ("sicher") */
export function progress(items) {
  if (!items.length) return { pct: 0, known: 0, total: 0 };
  const known = items.filter((i) => (i.box || 0) >= 4).length;
  const learned = items.reduce((s, i) => s + Math.min(i.box || 0, 5), 0);
  return { pct: Math.round((learned / (items.length * 5)) * 100), known, total: items.length };
}

// ---------- Motivation ----------
export function todayCount() { return state.profile?.activity?.[todayKey()] || 0; }
export async function recordActivity(n = 1) {
  const p = state.profile; if (!p) return;
  const k = todayKey();
  const before = p.activity[k] || 0;
  p.activity[k] = before + n;
  await saveProfile();
  const goal = p.settings.dailyGoal;
  return before < goal && p.activity[k] >= goal; // Tagesziel gerade erreicht?
}
export function streak() {
  const p = state.profile; if (!p) return 0;
  const goal = p.settings.dailyGoal;
  let k = todayKey(), n = 0;
  if ((p.activity[k] || 0) < goal) k = addDays(k, -1);
  while ((p.activity[k] || 0) >= goal) { n++; k = addDays(k, -1); }
  return n;
}
export function lastDays(n = 7) {
  const out = []; let k = todayKey();
  for (let i = 0; i < n; i++) { out.unshift({ key: k, count: state.profile.activity[k] || 0 }); k = addDays(k, -1); }
  return out;
}
export function needsBackup() {
  const p = state.profile; if (!p) return false;
  const hasData = state.items.length + state.notes.length > 0;
  return hasData && Date.now() - (p.lastBackup || 0) > 7 * 864e5;
}
