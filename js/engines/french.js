// Französisch: Konjugation (regelmäßig + wichtigste unregelmäßige Verben).

export const PRON = ['je', 'tu', 'il/elle', 'nous', 'vous', 'ils/elles'];
export const TENSES = [
  { id: 'present', name: 'Présent' },
  { id: 'pc', name: 'Passé composé' },
  { id: 'imparfait', name: 'Imparfait' },
  { id: 'pqp', name: 'Plus-que-parfait' },
  { id: 'futur', name: 'Futur simple' },
  { id: 'futurcomp', name: 'Futur composé' },
  { id: 'cond', name: 'Conditionnel présent' },
  { id: 'subj', name: 'Subjonctif présent' },
];

const AVOIR_PRES = ['ai', 'as', 'a', 'avons', 'avez', 'ont'];
const ETRE_PRES = ['suis', 'es', 'est', 'sommes', 'êtes', 'sont'];
const AVOIR_IMP = ['avais', 'avais', 'avait', 'avions', 'aviez', 'avaient'];
const ETRE_IMP = ['étais', 'étais', 'était', 'étions', 'étiez', 'étaient'];
const ALLER_PRES = ['vais', 'vas', 'va', 'allons', 'allez', 'vont'];

// Verben mit être im Passé composé
const ETRE_VERBS = new Set(['aller', 'venir', 'partir', 'sortir', 'arriver', 'entrer', 'rester', 'tomber', 'naître', 'mourir', 'monter', 'descendre', 'devenir', 'revenir', 'rentrer', 'retourner']);

// Unregelmäßige Verben: présent, participe passé, Futur-Stamm, subjonctif (optional, sonst regelhaft)
const IRR = {
  'être': { de: 'sein', pres: ETRE_PRES, pp: 'été', fut: 'ser', imp: 'ét', subj: ['sois', 'sois', 'soit', 'soyons', 'soyez', 'soient'] },
  avoir: { de: 'haben', pres: AVOIR_PRES, pp: 'eu', fut: 'aur', subj: ['aie', 'aies', 'ait', 'ayons', 'ayez', 'aient'] },
  aller: { de: 'gehen', pres: ALLER_PRES, pp: 'allé', fut: 'ir', subj: ['aille', 'ailles', 'aille', 'allions', 'alliez', 'aillent'] },
  faire: { de: 'machen', pres: ['fais', 'fais', 'fait', 'faisons', 'faites', 'font'], pp: 'fait', fut: 'fer', subj: ['fasse', 'fasses', 'fasse', 'fassions', 'fassiez', 'fassent'] },
  venir: { de: 'kommen', pres: ['viens', 'viens', 'vient', 'venons', 'venez', 'viennent'], pp: 'venu', fut: 'viendr' },
  prendre: { de: 'nehmen', pres: ['prends', 'prends', 'prend', 'prenons', 'prenez', 'prennent'], pp: 'pris', fut: 'prendr' },
  pouvoir: { de: 'können', pres: ['peux', 'peux', 'peut', 'pouvons', 'pouvez', 'peuvent'], pp: 'pu', fut: 'pourr', subj: ['puisse', 'puisses', 'puisse', 'puissions', 'puissiez', 'puissent'] },
  vouloir: { de: 'wollen', pres: ['veux', 'veux', 'veut', 'voulons', 'voulez', 'veulent'], pp: 'voulu', fut: 'voudr', subj: ['veuille', 'veuilles', 'veuille', 'voulions', 'vouliez', 'veuillent'] },
  devoir: { de: 'müssen', pres: ['dois', 'dois', 'doit', 'devons', 'devez', 'doivent'], pp: 'dû', fut: 'devr' },
  savoir: { de: 'wissen', pres: ['sais', 'sais', 'sait', 'savons', 'savez', 'savent'], pp: 'su', fut: 'saur', subj: ['sache', 'saches', 'sache', 'sachions', 'sachiez', 'sachent'] },
  dire: { de: 'sagen', pres: ['dis', 'dis', 'dit', 'disons', 'dites', 'disent'], pp: 'dit', fut: 'dir' },
  voir: { de: 'sehen', pres: ['vois', 'vois', 'voit', 'voyons', 'voyez', 'voient'], pp: 'vu', fut: 'verr' },
  mettre: { de: 'setzen, stellen, legen', pres: ['mets', 'mets', 'met', 'mettons', 'mettez', 'mettent'], pp: 'mis', fut: 'mettr' },
  partir: { de: 'abfahren, weggehen', pres: ['pars', 'pars', 'part', 'partons', 'partez', 'partent'], pp: 'parti', fut: 'partir' },
  sortir: { de: 'hinausgehen', pres: ['sors', 'sors', 'sort', 'sortons', 'sortez', 'sortent'], pp: 'sorti', fut: 'sortir' },
  dormir: { de: 'schlafen', pres: ['dors', 'dors', 'dort', 'dormons', 'dormez', 'dorment'], pp: 'dormi', fut: 'dormir' },
  lire: { de: 'lesen', pres: ['lis', 'lis', 'lit', 'lisons', 'lisez', 'lisent'], pp: 'lu', fut: 'lir' },
  'écrire': { de: 'schreiben', pres: ['écris', 'écris', 'écrit', 'écrivons', 'écrivez', 'écrivent'], pp: 'écrit', fut: 'écrir' },
  boire: { de: 'trinken', pres: ['bois', 'bois', 'boit', 'buvons', 'buvez', 'boivent'], pp: 'bu', fut: 'boir' },
  'connaître': { de: 'kennen', pres: ['connais', 'connais', 'connaît', 'connaissons', 'connaissez', 'connaissent'], pp: 'connu', fut: 'connaîtr' },
  croire: { de: 'glauben', pres: ['crois', 'crois', 'croit', 'croyons', 'croyez', 'croient'], pp: 'cru', fut: 'croir' },
  ouvrir: { de: 'öffnen', pres: ['ouvre', 'ouvres', 'ouvre', 'ouvrons', 'ouvrez', 'ouvrent'], pp: 'ouvert', fut: 'ouvrir' },
  recevoir: { de: 'erhalten, empfangen', pres: ['reçois', 'reçois', 'reçoit', 'recevons', 'recevez', 'reçoivent'], pp: 'reçu', fut: 'recevr' },
};

// Regelmäßige Verben (mit Besonderheiten)
const REG = {
  parler: 'sprechen', aimer: 'lieben, mögen', habiter: 'wohnen', jouer: 'spielen', regarder: 'ansehen', travailler: 'arbeiten',
  manger: 'essen', commencer: 'anfangen', acheter: 'kaufen', 'préférer': 'vorziehen, lieber mögen', appeler: 'rufen, anrufen',
  arriver: 'ankommen', rester: 'bleiben', entrer: 'eintreten', tomber: 'fallen',
  finir: 'beenden', choisir: 'wählen', 'réussir': 'gelingen, schaffen',
  vendre: 'verkaufen', attendre: 'warten', 'répondre': 'antworten', descendre: 'hinuntergehen',
};
// Stammwechsel e → è / é → è / l → ll (betont: je, tu, il, ils)
const STEM_CHANGE = { acheter: 'achèt', 'préférer': 'préfèr', appeler: 'appell' };
const FUT_CHANGE = { acheter: 'achèter', appeler: 'appeller' };

export const VERB_LIST = [...Object.keys(IRR), ...Object.keys(REG)];
export function meaning(inf) { return IRR[inf]?.de || REG[inf] || ''; }
export function isIrregular(inf) { return !!IRR[inf]; }
export function usesEtre(inf) { return ETRE_VERBS.has(inf); }

function group(inf) {
  if (inf.endsWith('er')) return 'er';
  if (inf.endsWith('ir')) return 'ir';
  if (inf.endsWith('re')) return 're';
  return null;
}

/** présent – 6 Formen */
export function present(inf) {
  if (IRR[inf]) return IRR[inf].pres.slice();
  const g = group(inf);
  const s = inf.slice(0, -2);
  if (g === 'er') {
    const strong = STEM_CHANGE[inf] || s;
    let nous = s + 'ons';
    if (s.endsWith('g')) nous = s + 'eons';
    if (s.endsWith('c')) nous = s.slice(0, -1) + 'çons';
    return [strong + 'e', strong + 'es', strong + 'e', nous, s + 'ez', strong + 'ent'];
  }
  if (g === 'ir') return [s + 'is', s + 'is', s + 'it', s + 'issons', s + 'issez', s + 'issent'];
  if (g === 're') return [s + 's', s + 's', s, s + 'ons', s + 'ez', s + 'ent'];
  return null;
}

export function participe(inf) {
  if (IRR[inf]) return IRR[inf].pp;
  const g = group(inf), s = inf.slice(0, -2);
  return g === 'er' ? s + 'é' : g === 'ir' ? s + 'i' : s + 'u';
}

function impStem(inf) {
  if (IRR[inf]?.imp) return IRR[inf].imp;
  const nous = present(inf)[3];
  return nous.replace(/ons$/, '');
}
const IMP_END = ['ais', 'ais', 'ait', 'ions', 'iez', 'aient'];
export function imparfait(inf) {
  const st = impStem(inf);
  return IMP_END.map((e) => {
    let b = st;
    if (e.startsWith('i')) { if (b.endsWith('ge')) b = b.slice(0, -1); if (b.endsWith('ç')) b = b.slice(0, -1) + 'c'; }
    return b + e;
  });
}

function futStem(inf) {
  if (IRR[inf]) return IRR[inf].fut;
  if (FUT_CHANGE[inf]) return FUT_CHANGE[inf];
  return group(inf) === 're' ? inf.slice(0, -1) : inf;
}
export function futur(inf) { const s = futStem(inf); return ['ai', 'as', 'a', 'ons', 'ez', 'ont'].map((e) => s + e); }
export function conditionnel(inf) { const s = futStem(inf); return IMP_END.map((e) => s + e); }

export function subjonctif(inf) {
  if (IRR[inf]?.subj) return IRR[inf].subj.slice();
  const ils = present(inf)[5];
  const st = ils.replace(/ent$/, '');
  const imp = imparfait(inf);
  return [st + 'e', st + 'es', st + 'e', imp[3], imp[4], st + 'ent'];
}

/** Partizip-Varianten für être-Verben (Angleichung) */
function ppForms(inf, i) {
  const pp = participe(inf);
  if (!ETRE_VERBS.has(inf)) return [pp];
  if (i < 3) return [pp, pp + 'e'];
  if (i === 4) return [pp + 's', pp + 'es', pp, pp + 'e'];
  return [pp + 's', pp + 'es'];
}

/** Gibt 6 Einträge zurück, jeder ein Array möglicher Lösungen (ohne Pronomen). Erste = Anzeigeform. */
export function conjugate(inf, tense) {
  const one = (arr) => arr.map((x) => [x]);
  switch (tense) {
    case 'present': return one(present(inf));
    case 'imparfait': return one(imparfait(inf));
    case 'futur': return one(futur(inf));
    case 'cond': return one(conditionnel(inf));
    case 'subj': return one(subjonctif(inf));
    case 'futurcomp': return ALLER_PRES.map((a) => [a + ' ' + inf]);
    case 'pc':
    case 'pqp': {
      const etre = ETRE_VERBS.has(inf);
      const aux = tense === 'pc' ? (etre ? ETRE_PRES : AVOIR_PRES) : (etre ? ETRE_IMP : AVOIR_IMP);
      return aux.map((a, i) => ppForms(inf, i).map((p) => a + ' ' + p));
    }
  }
  return null;
}

const vowel = /^[aeiouyhâàéèêëîïôûœ]/i;
/** Pronomen + Form mit Elision (j', que j') */
export function withPronoun(i, form, tense) {
  let p = PRON[i];
  if (i === 0 && vowel.test(form)) p = "j'";
  const que = tense === 'subj' ? (i === 2 || i === 5 ? 'qu’' : 'que ') : '';
  const sep = p.endsWith("'") ? '' : ' ';
  return que + p + sep + form;
}

/** Normalisiert eine Eingabe: Pronomen am Anfang entfernen */
export function stripPronoun(s) {
  return s.trim().toLowerCase().replace(/[’`]/g, "'")
    .replace(/^(que |qu')/, '')
    .replace(/^(je |j'|tu |il |elle |on |nous |vous |ils |elles )/, '')
    .trim();
}
