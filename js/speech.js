// Vorlesen (iOS-Stimmen), Aufnehmen & Vergleichen, Spracherkennung (falls verfügbar)
const synth = window.speechSynthesis;
let voices = [];
function loadVoices() { voices = synth ? synth.getVoices() : []; }
if (synth) { loadVoices(); synth.onvoiceschanged = loadVoices; }

export const ttsAvailable = () => !!synth;

/** Beste Stimme für Sprache, z. B. 'en-GB', 'en-US', 'fr-FR' */
function voiceFor(lang) {
  if (!voices.length) loadVoices();
  const l = lang.toLowerCase();
  const exact = voices.filter((v) => v.lang.toLowerCase().replace('_', '-') === l);
  const base = voices.filter((v) => v.lang.toLowerCase().startsWith(l.slice(0, 2)));
  const pool = exact.length ? exact : base;
  // bevorzugt hochwertige/lokale Stimmen
  return pool.find((v) => /enhanced|premium|siri/i.test(v.name)) || pool.find((v) => v.localService) || pool[0] || null;
}

export function speak(text, lang, rate = 0.9) {
  if (!synth || !text) return Promise.resolve();
  synth.cancel();
  return new Promise((resolve) => {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    const v = voiceFor(lang); if (v) u.voice = v;
    u.rate = rate;
    u.onend = u.onerror = () => resolve();
    synth.speak(u);
  });
}
export function stopSpeaking() { synth && synth.cancel(); }

// ---------- Aufnahme ----------
export const recordAvailable = () => !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder);
let rec = null, chunks = [], stream = null;
export async function startRecording() {
  stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  chunks = [];
  const type = MediaRecorder.isTypeSupported?.('audio/mp4') ? 'audio/mp4' : (MediaRecorder.isTypeSupported?.('audio/webm') ? 'audio/webm' : '');
  rec = new MediaRecorder(stream, type ? { mimeType: type } : undefined);
  rec.ondataavailable = (e) => e.data.size && chunks.push(e.data);
  rec.start();
}
export function stopRecording() {
  return new Promise((resolve) => {
    if (!rec) return resolve(null);
    rec.onstop = () => {
      const blob = new Blob(chunks, { type: rec.mimeType || 'audio/mp4' });
      stream.getTracks().forEach((t) => t.stop());
      rec = null;
      resolve(URL.createObjectURL(blob));
    };
    rec.stop();
  });
}
export const isRecording = () => !!rec;

// ---------- Spracherkennung ----------
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
export const recognitionAvailable = () => !!SR;
/** Hört einmal zu und liefert erkannte Varianten */
export function listen(lang) {
  return new Promise((resolve, reject) => {
    if (!SR) return reject(new Error('nicht verfügbar'));
    const r = new SR();
    r.lang = lang; r.interimResults = false; r.maxAlternatives = 5; r.continuous = false;
    let done = false;
    r.onresult = (e) => { done = true; const alts = [...e.results[0]].map((a) => a.transcript); resolve(alts); };
    r.onerror = (e) => { if (!done) reject(new Error(e.error || 'Fehler')); };
    r.onend = () => { if (!done) resolve([]); };
    try { r.start(); } catch (e) { reject(e); }
    setTimeout(() => { try { r.stop(); } catch (_) { /* */ } }, 6000);
  });
}

/** Ähnlichkeit 0..1 zwischen Zielwort und Erkanntem */
export function similarity(a, b) {
  const n = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z' ]/g, '').replace(/\s+/g, ' ').trim();
  a = n(a); b = n(b);
  if (!a || !b) return 0;
  if (a === b) return 1;
  const m = a.length, k = b.length;
  let prev = Array.from({ length: k + 1 }, (_, i) => i);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= k; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    prev = cur;
  }
  return 1 - prev[k] / Math.max(m, k);
}
