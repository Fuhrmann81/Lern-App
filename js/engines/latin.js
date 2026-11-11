// Latein: Deklination, Konjugation, Adjektive – regelbasiert, ohne Längenzeichen.

export const CASES = ['Nom', 'Gen', 'Dat', 'Akk', 'Abl'];
export const CASE_NAMES = { Nom: 'Nominativ', Gen: 'Genitiv', Dat: 'Dativ', Akk: 'Akkusativ', Abl: 'Ablativ' };
export const NUMS = ['Sg', 'Pl'];
export const NUM_NAMES = { Sg: 'Singular', Pl: 'Plural' };
export const GENUS_NAMES = { m: 'maskulin', f: 'feminin', n: 'neutrum' };

export const strip = (s) => (s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

// Ausnahmen bei Gen. Pl. der 3. Deklination
const GEN_PL_UM = new Set(['pater', 'mater', 'frater', 'iuvenis', 'canis', 'senex', 'panis', 'sedes', 'vates', 'ren', 'radix', 'mensis', 'larynx', 'pharynx', 'phalanx', 'meninx']);
const GEN_PL_IUM = new Set(['os', 'mus', 'vis', 'nix', 'urbs', 'nox', 'mons', 'pars', 'mors', 'ars', 'gens', 'dens', 'fons', 'pons', 'mens', 'lis', 'arx', 'ars', 'cor']);
const ABL_I = new Set(['mare', 'animal', 'exemplar', 'calcar', 'vectigal', 'turris', 'vis', 'sitis', 'febris', 'tussis', 'securis', 'puppis']);

const vowelEnd = /[aeiou]$/;

/**
 * Bestimmt die Deklination aus Nominativ + Genitiv.
 * Genitiv darf ausgeschrieben ("rosae") oder als Endung ("-ae") angegeben sein.
 * Gibt {decl, stem, nom, genus, iStem} oder null zurück.
 */
export function analyzeNoun(nomIn, genIn, genus) {
  const nom = strip(nomIn).split(/[ ,]/)[0];
  let gen = strip(genIn).replace(/\s/g, '');
  genus = (genus || '').toLowerCase()[0];
  if (!nom || !gen) return null;
  if (gen.startsWith('-')) {
    const e = gen.slice(1);
    if (e === 'ae' && nom.endsWith('a')) gen = nom.slice(0, -1) + 'ae';
    else if (e === 'i' && nom.endsWith('us')) gen = nom.slice(0, -2) + 'i';
    else if (e === 'i' && nom.endsWith('um')) gen = nom.slice(0, -2) + 'i';
    else if (e === 'i' && nom.endsWith('er')) gen = nom + 'i';
    else if (e === 'us' && nom.endsWith('us')) gen = nom;
    else if (e === 'us' && nom.endsWith('u')) gen = nom + 's';
    else if (e === 'ei' && nom.endsWith('es')) gen = nom.slice(0, -2) + 'ei';
    else if (e === 'is' && /(is|es)$/.test(nom)) gen = nom.slice(0, -2) + 'is';
    else return null;
  }
  let decl, stem;
  if (gen.endsWith('ae')) { decl = 1; stem = gen.slice(0, -2); if (!genus) genus = 'f'; }
  else if (gen.endsWith('ei') && nom.endsWith('es')) { decl = 5; stem = gen.slice(0, -2); if (!genus) genus = 'f'; }
  else if (gen.endsWith('us') && (nom.endsWith('us') || nom.endsWith('u')) && gen.length <= nom.length + 1) {
    decl = 4; stem = gen.slice(0, -2); if (!genus) genus = nom.endsWith('u') ? 'n' : 'm';
  }
  else if (gen.endsWith('is')) { decl = 3; stem = gen.slice(0, -2); }
  else if (gen.endsWith('i')) { decl = 2; stem = gen.slice(0, -1); if (!genus) genus = nom.endsWith('um') ? 'n' : 'm'; }
  else return null;
  if (!genus) return null;
  let iStem = false;
  if (decl === 3) {
    const sylNom = syllables(nom), sylGen = syllables(gen);
    if (GEN_PL_UM.has(nom)) iStem = false;
    else if (GEN_PL_IUM.has(nom)) iStem = true;
    else if (genus === 'n' && /(e|al|ar)$/.test(nom)) iStem = 'pure';
    else if (/(is|es)$/.test(nom) && sylNom === sylGen) iStem = true;
    else if (/[^aeiou][^aeiou]$/.test(stem) && !/(tr|dr|br|gr|cr|pl|cl)$/.test(stem)) iStem = true;
    if (ABL_I.has(nom)) iStem = 'pure';
  }
  return { decl, stem, nom, gen, genus, iStem };
}

function syllables(w) { return (w.match(/[aeiouy]+/g) || []).length; }

/** Vollständiges Paradigma {Nom:{Sg,Pl}, ...}. Werte sind Arrays (Alternativen). */
export function declineNoun(a) {
  if (!a) return null;
  const { decl, stem: s, nom, genus } = a;
  const neut = genus === 'n';
  let sg, pl;
  switch (decl) {
    case 1: sg = [nom, s + 'ae', s + 'ae', s + 'am', s + 'a']; pl = [s + 'ae', s + 'arum', s + 'is', s + 'as', s + 'is']; break;
    case 2:
      if (neut) { sg = [nom, s + 'i', s + 'o', nom, s + 'o']; pl = [s + 'a', s + 'orum', s + 'is', s + 'a', s + 'is']; }
      else { sg = [nom, s + 'i', s + 'o', s + 'um', s + 'o']; pl = [s + 'i', s + 'orum', s + 'is', s + 'os', s + 'is']; }
      break;
    case 3: {
      const pure = a.iStem === 'pure';
      const gpl = a.iStem ? s + 'ium' : s + 'um';
      const abl = pure ? s + 'i' : s + 'e';
      if (neut) { sg = [nom, s + 'is', s + 'i', nom, abl]; const np = pure ? s + 'ia' : s + 'a'; pl = [np, gpl, s + 'ibus', np, s + 'ibus']; }
      else { sg = [nom, s + 'is', s + 'i', s + 'em', abl]; pl = [s + 'es', gpl, s + 'ibus', s + 'es', s + 'ibus']; }
      break;
    }
    case 4:
      if (neut) { sg = [nom, s + 'us', s + 'u', nom, s + 'u']; pl = [s + 'ua', s + 'uum', s + 'ibus', s + 'ua', s + 'ibus']; }
      else { sg = [nom, s + 'us', s + 'ui', s + 'um', s + 'u']; pl = [s + 'us', s + 'uum', s + 'ibus', s + 'us', s + 'ibus']; }
      break;
    case 5: sg = [nom, s + 'ei', s + 'ei', s + 'em', s + 'e']; pl = [s + 'es', s + 'erum', s + 'ebus', s + 'es', s + 'ebus']; break;
  }
  const out = {};
  CASES.forEach((c, i) => { out[c] = { Sg: [sg[i]], Pl: [pl[i]] }; });
  return out;
}

export const DECL_NAMES = { 1: 'a-Deklination', 2: 'o-Deklination', 3: '3. Deklination', 4: 'u-Deklination', 5: 'e-Deklination' };

// ---------- Adjektive ----------
/**
 * Formen-Angabe: "bonus, a, um" | "bonus, bona, bonum" | "liber, era, erum" | "pulcher, chra, chrum"
 * | "brevis, e" | "acer, acris, acre" | "felix, felicis" | "superior, ius" (Komparativ)
 */
export function analyzeAdj(formsIn) {
  const parts = strip(formsIn).split(/[,;\/]\s*|\s+/).filter(Boolean);
  if (!parts.length) return null;
  const m = parts[0];
  const p2 = parts[1] || '', p3 = parts[2] || '';
  const expand = (base, end) => {
    if (!end.startsWith('-') && end.slice(0, 2) === m.slice(0, 2)) return end;
    end = end.replace(/^-/, '');
    // "a"/"um" → Stamm aus m-Form
    if (m.endsWith('us')) return m.slice(0, -2) + end;
    // liber, era, erum / pulcher, chra, chrum
    const idx = m.lastIndexOf(end[0]);
    if (idx > 0) return m.slice(0, idx) + end;
    return m + end;
  };
  // Komparativ
  if (/or$/.test(m) && /us$/.test(p2)) {
    const n = p2.replace(/^-/, '').length > 3 && !p2.startsWith('-') ? p2 : m.slice(0, -2) + 'us';
    return { type: 'comp', m, f: m, n, stem: m };
  }
  if (m.endsWith('us') && (!p2 || /^-?a$/.test(p2) || p2.endsWith('a'))) {
    const f = p2 && p2.slice(0, 2) === m.slice(0, 2) ? p2 : m.slice(0, -2) + 'a';
    const n = p3 && p3.slice(0, 2) === m.slice(0, 2) ? p3 : m.slice(0, -2) + 'um';
    return { type: 'ao', m, f, n };
  }
  if (m.endsWith('er') && p2 && (p2.endsWith('a') && !p2.endsWith('is'))) {
    const f = expand(m, p2); const n = p3 ? expand(m, p3) : f.slice(0, -1) + 'um';
    return { type: 'ao', m, f, n };
  }
  if (m.endsWith('er') && p2.endsWith('is')) { // acer, acris, acre
    const f = expand(m, p2); const n = p3 ? expand(m, p3) : f.slice(0, -2) + 'e';
    return { type: 'i3', m, f, n, stem: f.slice(0, -2) };
  }
  if (m.endsWith('is') && /^-?e$/.test(p2 || 'e')) { // brevis, e
    return { type: 'i3', m, f: m, n: m.slice(0, -2) + 'e', stem: m.slice(0, -2) };
  }
  if (p2.endsWith('is')) { // felix, felicis (einendig)
    const gen = p2.startsWith('-') ? m.slice(0, -1) + p2.slice(1) : p2;
    return { type: 'i3', m, f: m, n: m, stem: gen.slice(0, -2), oneEnd: true };
  }
  return null;
}

/** Adjektivform für Kasus/Numerus/Genus. Gibt String zurück. */
export function adjForm(adj, kas, num, genus) {
  if (!adj) return '';
  const ci = CASES.indexOf(kas);
  if (adj.type === 'ao') {
    if (genus === 'f') return declineNoun({ decl: 1, stem: adj.f.slice(0, -1), nom: adj.f, genus: 'f' })[kas][num][0];
    if (genus === 'n') return declineNoun({ decl: 2, stem: adj.n.slice(0, -2), nom: adj.n, genus: 'n' })[kas][num][0];
    const st = adj.f.slice(0, -1); // dextra → dextr, bona → bon
    return declineNoun({ decl: 2, stem: st, nom: adj.m, genus: 'm' })[kas][num][0];
  }
  const s = adj.stem;
  if (adj.type === 'comp') {
    const nomSg = genus === 'n' ? adj.n : adj.m;
    const sg = [nomSg, s + 'is', s + 'i', genus === 'n' ? adj.n : s + 'em', s + 'e'];
    const pl = genus === 'n' ? [s + 'a', s + 'um', s + 'ibus', s + 'a', s + 'ibus'] : [s + 'es', s + 'um', s + 'ibus', s + 'es', s + 'ibus'];
    return (num === 'Sg' ? sg : pl)[ci];
  }
  // i-Stamm (3. Dekl.)
  const nomSg = genus === 'm' ? adj.m : genus === 'f' ? adj.f : adj.n;
  const sg = [nomSg, s + 'is', s + 'i', genus === 'n' ? adj.n : s + 'em', s + 'i'];
  const pl = genus === 'n' ? [s + 'ia', s + 'ium', s + 'ibus', s + 'ia', s + 'ibus'] : [s + 'es', s + 'ium', s + 'ibus', s + 'es', s + 'ibus'];
  return (num === 'Sg' ? sg : pl)[ci];
}

// ---------- Verben ----------
export const PERSONS = ['1Sg', '2Sg', '3Sg', '1Pl', '2Pl', '3Pl'];
export const PERSON_NAMES = { '1Sg': '1. Pers. Sg.', '2Sg': '2. Pers. Sg.', '3Sg': '3. Pers. Sg.', '1Pl': '1. Pers. Pl.', '2Pl': '2. Pers. Pl.', '3Pl': '3. Pers. Pl.' };
export const TENSES = [
  { id: 'praes', name: 'Präsens', mood: 'Ind' },
  { id: 'impf', name: 'Imperfekt', mood: 'Ind' },
  { id: 'fut1', name: 'Futur I', mood: 'Ind' },
  { id: 'perf', name: 'Perfekt', mood: 'Ind' },
  { id: 'plqpf', name: 'Plusquamperfekt', mood: 'Ind' },
  { id: 'fut2', name: 'Futur II', mood: 'Ind' },
  { id: 'kpraes', name: 'Konjunktiv Präsens', mood: 'Konj' },
  { id: 'kimpf', name: 'Konjunktiv Imperfekt', mood: 'Konj' },
  { id: 'kperf', name: 'Konjunktiv Perfekt', mood: 'Konj' },
  { id: 'kplqpf', name: 'Konjunktiv Plusquamperfekt', mood: 'Konj' },
];
export const VOICES = { act: 'Aktiv', pass: 'Passiv' };
export const CONJ_NAMES = { a: 'a-Konjugation', e: 'e-Konjugation', i: 'i-Konjugation', k: 'konsonantische Konj.', ki: 'kons. Konj. (i-Erweiterung)', irr: 'unregelmäßig' };

const IRREG = {
  esse: {
    lemma: 'esse', perfStem: 'fu', noPass: true,
    praes: ['sum', 'es', 'est', 'sumus', 'estis', 'sunt'],
    impf: ['eram', 'eras', 'erat', 'eramus', 'eratis', 'erant'],
    fut1: ['ero', 'eris', 'erit', 'erimus', 'eritis', 'erunt'],
    kpraes: ['sim', 'sis', 'sit', 'simus', 'sitis', 'sint'],
    kimpf: ['essem', 'esses', 'esset', 'essemus', 'essetis', 'essent'],
  },
  posse: {
    lemma: 'posse', perfStem: 'potu', noPass: true,
    praes: ['possum', 'potes', 'potest', 'possumus', 'potestis', 'possunt'],
    impf: ['poteram', 'poteras', 'poterat', 'poteramus', 'poteratis', 'poterant'],
    fut1: ['potero', 'poteris', 'poterit', 'poterimus', 'poteritis', 'poterunt'],
    kpraes: ['possim', 'possis', 'possit', 'possimus', 'possitis', 'possint'],
    kimpf: ['possem', 'posses', 'posset', 'possemus', 'possetis', 'possent'],
  },
  ire: {
    lemma: 'ire', perfStem: 'i', noPass: true,
    praes: ['eo', 'is', 'it', 'imus', 'itis', 'eunt'],
    impf: ['ibam', 'ibas', 'ibat', 'ibamus', 'ibatis', 'ibant'],
    fut1: ['ibo', 'ibis', 'ibit', 'ibimus', 'ibitis', 'ibunt'],
    perf: [['ii'], ['isti', 'iisti'], ['iit', 'it'], ['iimus'], ['istis', 'iistis'], ['ierunt']],
    kpraes: ['eam', 'eas', 'eat', 'eamus', 'eatis', 'eant'],
    kimpf: ['irem', 'ires', 'iret', 'iremus', 'iretis', 'irent'],
    kplqpf: [['issem', 'iissem'], ['isses', 'iisses'], ['isset', 'iisset'], ['issemus', 'iissemus'], ['issetis', 'iissetis'], ['issent', 'iissent']],
  },
  velle: {
    lemma: 'velle', perfStem: 'volu', noPass: true,
    praes: ['volo', 'vis', 'vult', 'volumus', 'vultis', 'volunt'],
    impf: ['volebam', 'volebas', 'volebat', 'volebamus', 'volebatis', 'volebant'],
    fut1: ['volam', 'voles', 'volet', 'volemus', 'voletis', 'volent'],
    kpraes: ['velim', 'velis', 'velit', 'velimus', 'velitis', 'velint'],
    kimpf: ['vellem', 'velles', 'vellet', 'vellemus', 'velletis', 'vellent'],
  },
  ferre: {
    lemma: 'ferre', perfStem: 'tul', noPass: true,
    praes: ['fero', 'fers', 'fert', 'ferimus', 'fertis', 'ferunt'],
    impf: ['ferebam', 'ferebas', 'ferebat', 'ferebamus', 'ferebatis', 'ferebant'],
    fut1: ['feram', 'feres', 'feret', 'feremus', 'feretis', 'ferent'],
    kpraes: ['feram', 'feras', 'ferat', 'feramus', 'feratis', 'ferant'],
    kimpf: ['ferrem', 'ferres', 'ferret', 'ferremus', 'ferretis', 'ferrent'],
  },
};
IRREG.esse.aliases = ['sum'];
IRREG.posse.aliases = ['possum'];
IRREG.ire.aliases = ['eo'];
IRREG.velle.aliases = ['volo'];
IRREG.ferre.aliases = ['fero'];

/**
 * Stammformen analysieren: "laudare, laudo, laudavi, laudatum" in beliebiger Reihenfolge,
 * auch "laudo, laudavi, laudatum" + Infinitiv separat.
 */
export function analyzeVerb(formsIn, lemmaIn) {
  const parts = strip([lemmaIn, formsIn].filter(Boolean).join(', ')).split(/[,;\/]\s*|\s+/).filter(Boolean);
  for (const key of Object.keys(IRREG)) {
    const v = IRREG[key];
    if (parts.includes(key) || v.aliases.some((a) => parts[0] === a)) return { conj: 'irr', irr: v, lemma: key };
  }
  let inf = parts.find((p) => /(are|ere|ire)$/.test(p));
  let first = parts.find((p) => /o$/.test(p) && p !== inf);
  let perf = parts.find((p) => /i$/.test(p) && p !== inf && p !== first);
  let ppp = parts.find((p) => /(um|us)$/.test(p) && p !== inf);
  if (!inf && !first) return null;
  let conj, stem;
  if (inf && inf.endsWith('are')) { conj = 'a'; stem = inf.slice(0, -2); }
  else if (inf && inf.endsWith('ire')) { conj = 'i'; stem = inf.slice(0, -2); }
  else if (inf && inf.endsWith('ere')) {
    if (first && first.endsWith('eo')) { conj = 'e'; stem = inf.slice(0, -2); }
    else if (first && first.endsWith('io')) { conj = 'ki'; stem = first.slice(0, -2); }
    else if (first) { conj = 'k'; stem = first.slice(0, -1); }
    else { conj = 'k'; stem = inf.slice(0, -3); }
  } else if (first) {
    // ohne Infinitiv nur eindeutige Fälle
    if (first.endsWith('eo')) { conj = 'e'; stem = first.slice(0, -1); inf = stem + 're'; }
    else if (perf && perf.endsWith('ivi') && first.endsWith('io')) { conj = 'i'; stem = first.slice(0, -1); inf = stem + 're'; }
    else if (perf && perf.endsWith('avi') && !first.endsWith('io')) { conj = 'a'; stem = first.slice(0, -1) + 'a'; inf = stem + 're'; }
    else return null;
  }
  if (!inf) inf = conj === 'k' ? stem + 'ere' : conj === 'ki' ? stem + 'ere' : stem + 're';
  if (!first) first = conj === 'a' ? stem.slice(0, -1) + 'o' : conj === 'k' ? stem + 'o' : conj === 'ki' ? stem + 'io' : stem + 'o';
  // Perfekt-/PPP-Kurzformen wie "-avi", "-atum"
  if (perf && perf.startsWith('-')) perf = null;
  if (!perf && conj === 'a') perf = stem + 'vi';
  if (!perf && conj === 'i') perf = stem + 'vi';
  if (!ppp && conj === 'a') ppp = stem + 'tum';
  if (!ppp && conj === 'i') ppp = stem + 'tum';
  return { conj, stem, inf, first, perfStem: perf ? perf.slice(0, -1) : null, ppp: ppp || null, lemma: first };
}

const PE_ACT = ['o', 's', 't', 'mus', 'tis', 'nt'];
const PE_M = ['m', 's', 't', 'mus', 'tis', 'nt'];
const PE_PASS = ['r', 'ris', 'tur', 'mur', 'mini', 'ntur'];
const SUM = { praes: ['sum', 'es', 'est', 'sumus', 'estis', 'sunt'], impf: ['eram', 'eras', 'erat', 'eramus', 'eratis', 'erant'], fut: ['ero', 'eris', 'erit', 'erimus', 'eritis', 'erunt'], kpraes: ['sim', 'sis', 'sit', 'simus', 'sitis', 'sint'], kimpf: ['essem', 'esses', 'esset', 'essemus', 'essetis', 'essent'] };

/** Gibt Array von 6 Formen (je Array von Alternativen) zurück, oder null wenn nicht bildbar. */
export function conjugate(v, tense, voice = 'act') {
  if (!v) return null;
  const wrap = (arr) => arr.map((x) => (Array.isArray(x) ? x : [x]));
  if (v.conj === 'irr') {
    const I = v.irr;
    if (voice === 'pass') return null;
    if (I[tense]) return wrap(I[tense]);
    const p = I.perfStem;
    if (tense === 'perf') return wrap(['i', 'isti', 'it', 'imus', 'istis', 'erunt'].map((e) => p + e));
    if (tense === 'plqpf') return wrap(['eram', 'eras', 'erat', 'eramus', 'eratis', 'erant'].map((e) => p + e));
    if (tense === 'fut2') return wrap(['ero', 'eris', 'erit', 'erimus', 'eritis', 'erint'].map((e) => p + e));
    if (tense === 'kperf') return wrap(['erim', 'eris', 'erit', 'erimus', 'eritis', 'erint'].map((e) => p + e));
    if (tense === 'kplqpf') return wrap(['issem', 'isses', 'isset', 'issemus', 'issetis', 'issent'].map((e) => p + e));
    return null;
  }
  const { conj, stem: s } = v;
  const inf = v.inf;
  const res = [];
  if (voice === 'act') {
    switch (tense) {
      case 'praes':
        if (conj === 'a') return wrap([s.slice(0, -1) + 'o', ...PE_ACT.slice(1).map((e) => s + e)]);
        if (conj === 'e') return wrap([s + 'o', ...PE_ACT.slice(1).map((e) => s + e)]);
        if (conj === 'i') return wrap([s + 'o', s + 's', s + 't', s + 'mus', s + 'tis', s + 'unt']);
        if (conj === 'k') return wrap([s + 'o', s + 'is', s + 'it', s + 'imus', s + 'itis', s + 'unt']);
        if (conj === 'ki') return wrap([s + 'io', s + 'is', s + 'it', s + 'imus', s + 'itis', s + 'iunt']);
        break;
      case 'impf': {
        const b = conj === 'a' || conj === 'e' ? s : conj === 'k' ? s + 'e' : conj === 'ki' ? s + 'ie' : s + 'e';
        return wrap(['bam', 'bas', 'bat', 'bamus', 'batis', 'bant'].map((e) => b + e));
      }
      case 'fut1':
        if (conj === 'a' || conj === 'e') return wrap(['bo', 'bis', 'bit', 'bimus', 'bitis', 'bunt'].map((e) => s + e));
        {
          const b = conj === 'k' ? s : conj === 'ki' ? s + 'i' : s;
          return wrap(['am', 'es', 'et', 'emus', 'etis', 'ent'].map((e) => b + e));
        }
      case 'kpraes': {
        const b = conj === 'a' ? s.slice(0, -1) + 'e' : conj === 'e' ? s + 'a' : conj === 'k' ? s + 'a' : conj === 'ki' ? s + 'ia' : s + 'a';
        return wrap(PE_M.map((e) => b + e));
      }
      case 'kimpf': {
        const b = inf.slice(0, -1) + 'e'; // laudare → laudare-m
        return wrap(PE_M.map((e) => b + e));
      }
      default: {
        const p = v.perfStem; if (!p) return null;
        const E = { perf: ['i', 'isti', 'it', 'imus', 'istis', 'erunt'], plqpf: ['eram', 'eras', 'erat', 'eramus', 'eratis', 'erant'], fut2: ['ero', 'eris', 'erit', 'erimus', 'eritis', 'erint'], kperf: ['erim', 'eris', 'erit', 'erimus', 'eritis', 'erint'], kplqpf: ['issem', 'isses', 'isset', 'issemus', 'issetis', 'issent'] }[tense];
        return E ? wrap(E.map((e) => p + e)) : null;
      }
    }
  } else {
    switch (tense) {
      case 'praes':
        if (conj === 'a') return wrap([s.slice(0, -1) + 'or', s + 'ris', s + 'tur', s + 'mur', s + 'mini', s + 'ntur']);
        if (conj === 'e') return wrap([s + 'or', s + 'ris', s + 'tur', s + 'mur', s + 'mini', s + 'ntur']);
        if (conj === 'i') return wrap([s + 'or', s + 'ris', s + 'tur', s + 'mur', s + 'mini', s + 'untur']);
        if (conj === 'k') return wrap([s + 'or', s + 'eris', s + 'itur', s + 'imur', s + 'imini', s + 'untur']);
        if (conj === 'ki') return wrap([s + 'ior', s + 'eris', s + 'itur', s + 'imur', s + 'imini', s + 'iuntur']);
        break;
      case 'impf': {
        const b = conj === 'a' || conj === 'e' ? s : conj === 'k' ? s + 'e' : conj === 'ki' ? s + 'ie' : s + 'e';
        return wrap(['bar', 'baris', 'batur', 'bamur', 'bamini', 'bantur'].map((e) => b + e));
      }
      case 'fut1':
        if (conj === 'a' || conj === 'e') return wrap(['bor', 'beris', 'bitur', 'bimur', 'bimini', 'buntur'].map((e) => s + e));
        {
          const b = conj === 'ki' ? s + 'i' : s;
          return wrap(['ar', 'eris', 'etur', 'emur', 'emini', 'entur'].map((e) => b + e));
        }
      case 'kpraes': {
        const b = conj === 'a' ? s.slice(0, -1) + 'e' : conj === 'ki' ? s + 'ia' : s + 'a';
        return wrap(PE_PASS.map((e) => b + e));
      }
      case 'kimpf': {
        const b = inf.slice(0, -1) + 'e';
        return wrap(PE_PASS.map((e) => b + e));
      }
      default: {
        if (!v.ppp) return null;
        const base = v.ppp.replace(/(um|us)$/, '');
        const aux = { perf: SUM.praes, plqpf: SUM.impf, fut2: SUM.fut, kperf: SUM.kpraes, kplqpf: SUM.kimpf }[tense];
        if (!aux) return null;
        return aux.map((a, i) => {
          const sg = i < 3;
          const forms = sg ? [base + 'us', base + 'a', base + 'um'] : [base + 'i', base + 'ae', base + 'a'];
          return forms.map((f) => f + ' ' + a);
        });
      }
    }
  }
  return res.length ? res : null;
}

export function infinitive(v) { return v.conj === 'irr' ? v.irr.lemma : v.inf; }

// ---------- Beispielwörter (Standardwortschatz, keine Lehrbuch-Kopie) ----------
export const SAMPLE_NOUNS = [
  ['rosa', 'rosae', 'f', 'Rose'], ['amica', 'amicae', 'f', 'Freundin'], ['agricola', 'agricolae', 'm', 'Bauer'], ['via', 'viae', 'f', 'Weg'],
  ['dominus', 'domini', 'm', 'Herr'], ['amicus', 'amici', 'm', 'Freund'], ['puer', 'pueri', 'm', 'Junge'], ['ager', 'agri', 'm', 'Acker, Feld'],
  ['templum', 'templi', 'n', 'Tempel'], ['donum', 'doni', 'n', 'Geschenk'], ['bellum', 'belli', 'n', 'Krieg'],
  ['rex', 'regis', 'm', 'König'], ['mercator', 'mercatoris', 'm', 'Händler'], ['homo', 'hominis', 'm', 'Mensch'], ['vox', 'vocis', 'f', 'Stimme'],
  ['corpus', 'corporis', 'n', 'Körper'], ['nomen', 'nominis', 'n', 'Name'], ['civis', 'civis', 'm', 'Bürger'], ['urbs', 'urbis', 'f', 'Stadt'],
  ['mare', 'maris', 'n', 'Meer'], ['animal', 'animalis', 'n', 'Lebewesen'], ['pater', 'patris', 'm', 'Vater'],
  ['senatus', 'senatus', 'm', 'Senat'], ['manus', 'manus', 'f', 'Hand'], ['cornu', 'cornus', 'n', 'Horn'],
  ['res', 'rei', 'f', 'Sache'], ['dies', 'diei', 'm', 'Tag'],
];
export const SAMPLE_VERBS = [
  ['laudare, laudo, laudavi, laudatum', 'loben'], ['vocare, voco, vocavi, vocatum', 'rufen'], ['amare, amo, amavi, amatum', 'lieben'],
  ['monere, moneo, monui, monitum', 'mahnen, ermahnen'], ['videre, video, vidi, visum', 'sehen'], ['habere, habeo, habui, habitum', 'haben'],
  ['audire, audio, audivi, auditum', 'hören'], ['venire, venio, veni, ventum', 'kommen', true],
  ['regere, rego, rexi, rectum', 'lenken, regieren'], ['mittere, mitto, misi, missum', 'schicken'], ['ducere, duco, duxi, ductum', 'führen'],
  ['capere, capio, cepi, captum', 'fangen, nehmen'], ['facere, facio, feci, factum', 'machen, tun'],
  ['esse', 'sein'], ['posse', 'können'], ['ire', 'gehen'], ['velle', 'wollen'], ['ferre', 'tragen, bringen'],
];
