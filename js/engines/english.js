// Englisch: unregelmäßige Verben + Zeitformen-Generator.

// [Infinitiv, Simple Past, Past Participle, Deutsch] – Alternativen mit "/"
export const IRREGULAR = [
  ['be', 'was/were', 'been', 'sein'], ['beat', 'beat', 'beaten', 'schlagen'], ['become', 'became', 'become', 'werden'],
  ['begin', 'began', 'begun', 'beginnen'], ['bite', 'bit', 'bitten', 'beißen'], ['blow', 'blew', 'blown', 'blasen, wehen'],
  ['break', 'broke', 'broken', 'brechen, zerbrechen'], ['bring', 'brought', 'brought', 'bringen'], ['build', 'built', 'built', 'bauen'],
  ['buy', 'bought', 'bought', 'kaufen'], ['catch', 'caught', 'caught', 'fangen'], ['choose', 'chose', 'chosen', 'wählen, aussuchen'],
  ['come', 'came', 'come', 'kommen'], ['cost', 'cost', 'cost', 'kosten'], ['cut', 'cut', 'cut', 'schneiden'],
  ['do', 'did', 'done', 'tun, machen'], ['draw', 'drew', 'drawn', 'zeichnen'], ['dream', 'dreamt/dreamed', 'dreamt/dreamed', 'träumen'],
  ['drink', 'drank', 'drunk', 'trinken'], ['drive', 'drove', 'driven', 'fahren'], ['eat', 'ate', 'eaten', 'essen'],
  ['fall', 'fell', 'fallen', 'fallen'], ['feed', 'fed', 'fed', 'füttern'], ['feel', 'felt', 'felt', 'fühlen'],
  ['fight', 'fought', 'fought', 'kämpfen'], ['find', 'found', 'found', 'finden'], ['fly', 'flew', 'flown', 'fliegen'],
  ['forget', 'forgot', 'forgotten', 'vergessen'], ['forgive', 'forgave', 'forgiven', 'vergeben, verzeihen'], ['freeze', 'froze', 'frozen', 'frieren, einfrieren'],
  ['get', 'got', 'got/gotten', 'bekommen'], ['give', 'gave', 'given', 'geben'], ['go', 'went', 'gone', 'gehen'],
  ['grow', 'grew', 'grown', 'wachsen'], ['hang', 'hung', 'hung', 'hängen'], ['have', 'had', 'had', 'haben'],
  ['hear', 'heard', 'heard', 'hören'], ['hide', 'hid', 'hidden', 'verstecken'], ['hit', 'hit', 'hit', 'schlagen, treffen'],
  ['hold', 'held', 'held', 'halten'], ['hurt', 'hurt', 'hurt', 'verletzen, wehtun'], ['keep', 'kept', 'kept', 'behalten'],
  ['know', 'knew', 'known', 'wissen, kennen'], ['lay', 'laid', 'laid', 'legen'], ['lead', 'led', 'led', 'führen'],
  ['learn', 'learnt/learned', 'learnt/learned', 'lernen'], ['leave', 'left', 'left', 'verlassen, abfahren'], ['lend', 'lent', 'lent', 'leihen, verleihen'],
  ['let', 'let', 'let', 'lassen'], ['lie', 'lay', 'lain', 'liegen'], ['lose', 'lost', 'lost', 'verlieren'],
  ['make', 'made', 'made', 'machen, herstellen'], ['mean', 'meant', 'meant', 'bedeuten, meinen'], ['meet', 'met', 'met', 'treffen'],
  ['pay', 'paid', 'paid', 'bezahlen'], ['put', 'put', 'put', 'setzen, stellen, legen'], ['read', 'read', 'read', 'lesen'],
  ['ride', 'rode', 'ridden', 'reiten, fahren'], ['ring', 'rang', 'rung', 'klingeln, läuten'], ['rise', 'rose', 'risen', 'steigen, aufgehen'],
  ['run', 'ran', 'run', 'rennen, laufen'], ['say', 'said', 'said', 'sagen'], ['see', 'saw', 'seen', 'sehen'],
  ['sell', 'sold', 'sold', 'verkaufen'], ['send', 'sent', 'sent', 'schicken, senden'], ['set', 'set', 'set', 'setzen, festlegen'],
  ['shake', 'shook', 'shaken', 'schütteln'], ['shine', 'shone', 'shone', 'scheinen'], ['shoot', 'shot', 'shot', 'schießen'],
  ['show', 'showed', 'shown', 'zeigen'], ['shut', 'shut', 'shut', 'schließen'], ['sing', 'sang', 'sung', 'singen'],
  ['sink', 'sank', 'sunk', 'sinken'], ['sit', 'sat', 'sat', 'sitzen'], ['sleep', 'slept', 'slept', 'schlafen'],
  ['speak', 'spoke', 'spoken', 'sprechen'], ['spend', 'spent', 'spent', 'ausgeben, verbringen'], ['stand', 'stood', 'stood', 'stehen'],
  ['steal', 'stole', 'stolen', 'stehlen'], ['swim', 'swam', 'swum', 'schwimmen'], ['take', 'took', 'taken', 'nehmen'],
  ['teach', 'taught', 'taught', 'unterrichten, beibringen'], ['tear', 'tore', 'torn', 'zerreißen'], ['tell', 'told', 'told', 'erzählen, sagen'],
  ['think', 'thought', 'thought', 'denken, glauben'], ['throw', 'threw', 'thrown', 'werfen'], ['understand', 'understood', 'understood', 'verstehen'],
  ['wake', 'woke', 'woken', 'aufwachen, wecken'], ['wear', 'wore', 'worn', 'tragen (Kleidung)'], ['win', 'won', 'won', 'gewinnen'],
  ['write', 'wrote', 'written', 'schreiben'],
];

// Verben für den Zeitformen-Trainer: [inf, 3.Sg, -ing, past, pp, deutsch]
export const TENSE_VERBS = [
  ['go', 'goes', 'going', 'went', 'gone', 'gehen'], ['have', 'has', 'having', 'had', 'had', 'haben'],
  ['do', 'does', 'doing', 'did', 'done', 'tun'], ['make', 'makes', 'making', 'made', 'made', 'machen'],
  ['take', 'takes', 'taking', 'took', 'taken', 'nehmen'], ['write', 'writes', 'writing', 'wrote', 'written', 'schreiben'],
  ['run', 'runs', 'running', 'ran', 'run', 'rennen'], ['swim', 'swims', 'swimming', 'swam', 'swum', 'schwimmen'],
  ['eat', 'eats', 'eating', 'ate', 'eaten', 'essen'], ['see', 'sees', 'seeing', 'saw', 'seen', 'sehen'],
  ['come', 'comes', 'coming', 'came', 'come', 'kommen'], ['read', 'reads', 'reading', 'read', 'read', 'lesen'],
  ['play', 'plays', 'playing', 'played', 'played', 'spielen'], ['work', 'works', 'working', 'worked', 'worked', 'arbeiten'],
  ['watch', 'watches', 'watching', 'watched', 'watched', 'ansehen'], ['study', 'studies', 'studying', 'studied', 'studied', 'lernen, studieren'],
  ['stop', 'stops', 'stopping', 'stopped', 'stopped', 'anhalten, aufhören'], ['live', 'lives', 'living', 'lived', 'lived', 'leben, wohnen'],
  ['try', 'tries', 'trying', 'tried', 'tried', 'versuchen'], ['carry', 'carries', 'carrying', 'carried', 'carried', 'tragen'],
  ['visit', 'visits', 'visiting', 'visited', 'visited', 'besuchen'], ['help', 'helps', 'helping', 'helped', 'helped', 'helfen'],
  ['cook', 'cooks', 'cooking', 'cooked', 'cooked', 'kochen'], ['travel', 'travels', 'travelling/traveling', 'travelled/traveled', 'travelled/traveled', 'reisen'],
];

export const PERSONS = ['I', 'you', 'he', 'she', 'we', 'they'];
export const TENSES = [
  { id: 'sp', name: 'Simple Present' },
  { id: 'pp', name: 'Present Progressive' },
  { id: 'spa', name: 'Simple Past' },
  { id: 'pap', name: 'Past Progressive' },
  { id: 'prp', name: 'Present Perfect' },
  { id: 'prpp', name: 'Present Perfect Progressive' },
  { id: 'pastp', name: 'Past Perfect' },
  { id: 'will', name: 'will-Future' },
  { id: 'goingto', name: 'going to-Future' },
  { id: 'cond1', name: 'Conditional I (would)' },
  { id: 'cond2', name: 'Conditional II (would have)' },
];

const third = (p) => p === 'he' || p === 'she';
const be = (p) => (p === 'I' ? 'am' : third(p) ? 'is' : 'are');
const was = (p) => (p === 'I' || third(p) ? 'was' : 'were');
const has = (p) => (third(p) ? 'has' : 'have');
const alts = (s) => s.split('/');

/** Gibt Array möglicher Lösungen zurück (ohne Pronomen), z. B. ["has gone"]. */
export function form(v, person, tense) {
  const [inf, s3, ing, past, pp] = v;
  const ings = alts(ing), pasts = alts(past), pps = alts(pp);
  switch (tense) {
    case 'sp': return [third(person) ? s3 : inf];
    case 'pp': return ings.map((g) => be(person) + ' ' + g);
    case 'spa': return pasts;
    case 'pap': return ings.map((g) => was(person) + ' ' + g);
    case 'prp': return pps.map((x) => has(person) + ' ' + x);
    case 'prpp': return ings.map((g) => has(person) + ' been ' + g);
    case 'pastp': return pps.map((x) => 'had ' + x);
    case 'will': return ['will ' + inf];
    case 'goingto': return [be(person) + ' going to ' + inf];
    case 'cond1': return ['would ' + inf];
    case 'cond2': return pps.map((x) => 'would have ' + x);
  }
  return [];
}

// Kurzformen auflösen, damit "he's gone" ebenfalls zählt
const CONTRACT = [[/\bi'm\b/g, 'i am'], [/\b(he|she|it)'s been\b/g, '$1 has been'], [/'re\b/g, ' are'], [/'ve\b/g, ' have'], [/'ll\b/g, ' will'], [/'d have\b/g, ' would have'], [/'d\b/g, ' would']];
export function normalize(s) {
  let x = s.toLowerCase().replace(/[’`]/g, "'").replace(/[.!?]/g, '').replace(/\s+/g, ' ').trim();
  CONTRACT.forEach(([re, r]) => { x = x.replace(re, r); });
  return x;
}
/** Prüft Antwort; erlaubt mit oder ohne Pronomen, "he's" = he is / he has. */
export function check(input, person, solutions) {
  let x = normalize(input);
  const p = person.toLowerCase();
  const variants = new Set([x]);
  if (/\b(he|she)'s\b/.test(x)) { variants.add(x.replace(/'s\b/, ' is')); variants.add(x.replace(/'s\b/, ' has')); }
  const sols = solutions.map((s) => s.toLowerCase());
  for (let v of variants) {
    if (v.startsWith(p + ' ')) v = v.slice(p.length + 1);
    if (sols.includes(v)) return true;
  }
  return false;
}
