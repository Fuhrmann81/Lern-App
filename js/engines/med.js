// Medizinische Terminologie: anatomische Nomen, Adjektive, Präfixe/Suffixe.
import { analyzeNoun, declineNoun, analyzeAdj, adjForm } from './latin.js';

// [Nominativ, Genitiv, Genus, Deutsch]
export const NOUNS = [
  ['musculus', 'musculi', 'm', 'Muskel'], ['nervus', 'nervi', 'm', 'Nerv'], ['lobus', 'lobi', 'm', 'Lappen'],
  ['nodus', 'nodi', 'm', 'Knoten'], ['ramus', 'rami', 'm', 'Ast'], ['sulcus', 'sulci', 'm', 'Furche'],
  ['arteria', 'arteriae', 'f', 'Arterie, Schlagader'], ['vena', 'venae', 'f', 'Vene'], ['vertebra', 'vertebrae', 'f', 'Wirbel'],
  ['costa', 'costae', 'f', 'Rippe'], ['fossa', 'fossae', 'f', 'Grube'], ['glandula', 'glandulae', 'f', 'Drüse'],
  ['ligamentum', 'ligamenti', 'n', 'Band'], ['cranium', 'cranii', 'n', 'Schädel'], ['septum', 'septi', 'n', 'Scheidewand'],
  ['foramen', 'foraminis', 'n', 'Loch, Öffnung'], ['corpus', 'corporis', 'n', 'Körper'], ['caput', 'capitis', 'n', 'Kopf'],
  ['os', 'ossis', 'n', 'Knochen'], ['tendo', 'tendinis', 'm', 'Sehne'], ['margo', 'marginis', 'm', 'Rand'],
  ['apex', 'apicis', 'm', 'Spitze'], ['pulmo', 'pulmonis', 'm', 'Lunge'], ['dens', 'dentis', 'm', 'Zahn'],
  ['pes', 'pedis', 'm', 'Fuß'], ['regio', 'regionis', 'f', 'Gegend, Region'], ['articulatio', 'articulationis', 'f', 'Gelenk'],
  ['radix', 'radicis', 'f', 'Wurzel'], ['thorax', 'thoracis', 'm', 'Brustkorb'], ['larynx', 'laryngis', 'm', 'Kehlkopf'],
  ['manus', 'manus', 'f', 'Hand'], ['ductus', 'ductus', 'm', 'Gang'], ['processus', 'processus', 'm', 'Fortsatz'],
  ['sinus', 'sinus', 'm', 'Bucht, Höhle'], ['plexus', 'plexus', 'm', 'Geflecht'], ['cornu', 'cornus', 'n', 'Horn'],
  ['facies', 'faciei', 'f', 'Fläche, Gesicht'],
];

// [Formenangabe, Deutsch]
export const ADJECTIVES = [
  ['rectus, -a, -um', 'gerade'], ['transversus, -a, -um', 'quer'], ['obliquus, -a, -um', 'schräg'],
  ['longus, -a, -um', 'lang'], ['externus, -a, -um', 'äußerer'], ['internus, -a, -um', 'innerer'],
  ['profundus, -a, -um', 'tief'], ['medius, -a, -um', 'mittlerer'], ['dexter, dextra, dextrum', 'rechter'],
  ['sinister, sinistra, sinistrum', 'linker'], ['brevis, -e', 'kurz'], ['superficialis, -e', 'oberflächlich'],
  ['lateralis, -e', 'seitlich'], ['medialis, -e', 'zur Mitte hin'], ['communis, -e', 'gemeinsam'],
  ['major, majus', 'größer'], ['minor, minus', 'kleiner'], ['superior, superius', 'oberer'],
  ['inferior, inferius', 'unterer'], ['anterior, anterius', 'vorderer'], ['posterior, posterius', 'hinterer'],
];

export function nounParadigm(n) { return declineNoun(analyzeNoun(n[0], n[1], n[2])); }
export function phrase(noun, adjSpec, kas, num) {
  const a = analyzeNoun(noun[0], noun[1], noun[2]);
  const nf = declineNoun(a)[kas][num][0];
  const af = adjForm(analyzeAdj(adjSpec), kas, num, a.genus);
  return nf + ' ' + af;
}

// Startpaket: Präfixe, Suffixe, Wortbausteine (Allgemeinwissen der klinischen Terminologie)
export const STARTER_AFFIXES = [
  ['a-, an-', 'nicht, ohne (z. B. Anämie)', 'Präfix'], ['ab-', 'weg von', 'Präfix'], ['ad-', 'hin zu', 'Präfix'],
  ['ana-', 'auf, hinauf', 'Präfix'], ['anti-', 'gegen', 'Präfix'], ['brady-', 'langsam (z. B. Bradykardie)', 'Präfix'],
  ['dys-', 'gestört, fehlerhaft', 'Präfix'], ['endo-', 'innen', 'Präfix'], ['epi-', 'auf, darüber', 'Präfix'],
  ['ex-, ekto-', 'außen, heraus', 'Präfix'], ['hemi-', 'halb', 'Präfix'], ['hyper-', 'über, übermäßig', 'Präfix'],
  ['hypo-', 'unter, vermindert', 'Präfix'], ['inter-', 'zwischen', 'Präfix'], ['intra-', 'innerhalb', 'Präfix'],
  ['para-', 'neben', 'Präfix'], ['peri-', 'um ... herum', 'Präfix'], ['poly-', 'viel', 'Präfix'],
  ['post-', 'nach, hinter', 'Präfix'], ['prä-, prae-', 'vor', 'Präfix'], ['retro-', 'rückwärts, hinter', 'Präfix'],
  ['sub-', 'unter', 'Präfix'], ['supra-', 'oberhalb', 'Präfix'], ['tachy-', 'schnell (z. B. Tachykardie)', 'Präfix'],
  ['-algie', 'Schmerz (z. B. Neuralgie)', 'Suffix'], ['-ämie', 'Blut(zustand)', 'Suffix'], ['-ektomie', 'operative Entfernung', 'Suffix'],
  ['-gramm', 'Aufzeichnung', 'Suffix'], ['-itis', 'Entzündung', 'Suffix'], ['-logie', 'Lehre, Wissenschaft', 'Suffix'],
  ['-lyse', 'Auflösung', 'Suffix'], ['-om', 'Geschwulst, Tumor', 'Suffix'], ['-ose', 'nicht entzündliche Erkrankung, Zustand', 'Suffix'],
  ['-pathie', 'Erkrankung', 'Suffix'], ['-penie', 'Mangel', 'Suffix'], ['-plastik', 'operative (Wieder-)Herstellung', 'Suffix'],
  ['-rrhö', 'Fluss, Ausfluss', 'Suffix'], ['-skopie', 'Betrachtung, Spiegelung', 'Suffix'], ['-stase', 'Stillstand, Stauung', 'Suffix'],
  ['-tomie', 'Schnitt, Eröffnung', 'Suffix'], ['-zyt', 'Zelle', 'Suffix'],
  ['cardia / cor', 'Herz (griech. / lat.)', 'Wortstamm'], ['hepar / iecur', 'Leber (griech. / lat.)', 'Wortstamm'],
  ['nephros / ren', 'Niere (griech. / lat.)', 'Wortstamm'], ['pneumon / pulmo', 'Lunge (griech. / lat.)', 'Wortstamm'],
  ['gaster / ventriculus', 'Magen (griech. / lat.)', 'Wortstamm'], ['enteron / intestinum', 'Darm (griech. / lat.)', 'Wortstamm'],
  ['osteon / os', 'Knochen (griech. / lat.)', 'Wortstamm'], ['derma / cutis', 'Haut (griech. / lat.)', 'Wortstamm'],
  ['haima / sanguis', 'Blut (griech. / lat.)', 'Wortstamm'], ['neuron / nervus', 'Nerv (griech. / lat.)', 'Wortstamm'],
  ['stoma / os, oris', 'Mund (griech. / lat.)', 'Wortstamm'], ['ophthalmos / oculus', 'Auge (griech. / lat.)', 'Wortstamm'],
];
