// Texterkennung direkt auf dem Gerät (Tesseract.js, wird beim ersten Gebrauch geladen)
const TESS_URL = 'https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js';
let loading = null;

function loadLib() {
  if (window.Tesseract) return Promise.resolve();
  if (loading) return loading;
  loading = new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = TESS_URL; s.onload = resolve; s.onerror = () => { loading = null; reject(new Error('Texterkennung konnte nicht geladen werden (Internet nötig beim ersten Mal).')); };
    document.head.appendChild(s);
  });
  return loading;
}

/** Bild vorbereiten: verkleinern, Graustufen, Kontrast */
function prepare(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const max = 2000, s = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement('canvas');
      c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
      const ctx = c.getContext('2d');
      ctx.drawImage(img, 0, 0, c.width, c.height);
      const d = ctx.getImageData(0, 0, c.width, c.height), px = d.data;
      for (let i = 0; i < px.length; i += 4) {
        let g = 0.299 * px[i] + 0.587 * px[i + 1] + 0.114 * px[i + 2];
        g = Math.max(0, Math.min(255, (g - 128) * 1.35 + 140));
        px[i] = px[i + 1] = px[i + 2] = g;
      }
      ctx.putImageData(d, 0, 0);
      URL.revokeObjectURL(img.src);
      resolve(c);
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

/** Erkennt Text. langs z. B. 'eng+deu'. onProgress(0..1, text) */
export async function recognize(file, langs = 'deu', onProgress = () => {}) {
  onProgress(0, 'Lade Texterkennung …');
  await loadLib();
  const canvas = await prepare(file);
  const worker = await window.Tesseract.createWorker(langs.split('+'), 1, {
    logger: (m) => {
      if (m.status === 'recognizing text') onProgress(m.progress, 'Erkenne Text …');
      else if (/load/.test(m.status)) onProgress(0.05, 'Lade Sprachdaten …');
    },
  });
  try {
    const { data } = await worker.recognize(canvas);
    return data.text || '';
  } finally {
    await worker.terminate();
  }
}

/** Zerlegt erkannten Text in Vokabelpaare [links, rechts] */
export function parseVocabLines(text) {
  const rows = [];
  for (let raw of text.split(/\r?\n/)) {
    const line = raw.replace(/[|]/g, ' ').replace(/\s+$/, '').trim();
    if (!line || line.length < 2) continue;
    let parts = null;
    for (const sep of ['\t', ' - ', ' – ', ' — ', ' = ', ' : ', ';', '  ']) {
      if (line.includes(sep)) { const i = line.indexOf(sep); parts = [line.slice(0, i), line.slice(i + sep.length)]; break; }
    }
    if (!parts) {
      const m = line.match(/^(.+?)\s{2,}(.+)$/);
      parts = m ? [m[1], m[2]] : [line, ''];
    }
    rows.push(parts.map((p) => p.trim()));
  }
  return rows;
}

/** Latein-Zeile deuten: "rosa, rosae f" | "laudare, laudo, laudavi, laudatum" | "bonus, a, um" */
export function guessLatin(left) {
  const s = left.trim();
  const g = s.match(/\b([mfn])\.?$/);
  const genus = g ? g[1] : '';
  const body = g ? s.slice(0, g.index).trim().replace(/,$/, '') : s;
  const parts = body.split(/\s*,\s*/).filter(Boolean);
  const r = { term: parts[0] || s };
  if (genus && parts.length >= 2) Object.assign(r, { wortart: 'Nomen', genitiv: parts[1], genus });
  else if (parts.length >= 3 && parts.some((p) => /(are|ere|ire)$/.test(p))) {
    Object.assign(r, { wortart: 'Verb', term: parts[0], stammformen: parts.join(', ') });
  } else if (parts.length >= 2 && /^-?(a|um|e|is)$/.test(parts[1])) Object.assign(r, { wortart: 'Adjektiv', formen: parts.join(', ') });
  return r;
}
