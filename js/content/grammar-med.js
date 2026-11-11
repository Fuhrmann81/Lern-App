// Grammatik Medizinische Terminologie – eigene Übersichten (Vorklinik)
export default [
  {
    id: 'med-aufbau', title: 'Aufbau anatomischer Begriffe',
    html: `
<p>Anatomische Fachbegriffe folgen einem festen Muster:</p>
<p><b>Nomen</b> (Nominativ) + <b>Adjektiv</b> (KNG-gleich) + <b>Genitivattribut</b> (wessen?)</p>
<table>
<tr><th>Begriff</th><th>Aufbau</th><th>Übersetzung</th></tr>
<tr><td>Musculus <b>rectus</b> <i>abdominis</i></td><td>Nomen + Adj. + Gen.</td><td>gerader Muskel des Bauches</td></tr>
<tr><td>Arteria <b>carotis communis</b></td><td>Nomen + Nomen/Adj. + Adj.</td><td>gemeinsame Halsschlagader</td></tr>
<tr><td>Ligamentum <b>longitudinale anterius</b></td><td>Nomen + 2 Adjektive</td><td>vorderes Längsband</td></tr>
<tr><td>Foramen <i>venae cavae</i></td><td>Nomen + Gen.-Phrase</td><td>Loch der Hohlvene</td></tr>
</table>
<p><b>Übersetzungsweg:</b> 1. Hauptnomen finden (steht vorn) → 2. Adjektive zuordnen (KNG!) → 3. Genitive als „des/der …“ anhängen.</p>
<p class="tip">Abkürzungen: M. = Musculus (Mm. = Musculi), N. = Nervus, A. = Arteria (Aa.), V. = Vena (Vv.), Lig. = Ligamentum (Ligg.), R. = Ramus (Rr.)</p>`,
    checks: [
      { q: 'Wofür steht die Abkürzung „Mm.“?', a: ['musculi'] },
      { q: '„Musculus rectus abdominis“ – in welchem Kasus steht „abdominis“?', a: ['genitiv', 'gen'] },
      { q: 'Wofür steht „Aa.“?', a: ['arteriae'] },
    ],
  },
  {
    id: 'med-dekl', title: 'Deklinationen & Genus in der Anatomie',
    html: `
<table>
<tr><th>Dekl.</th><th>Nom. Sg.</th><th>Gen. Sg.</th><th>Genus</th><th>Beispiele</th></tr>
<tr><td>a</td><td>-a</td><td>-ae</td><td>f</td><td>arteria, vena, costa, vertebra</td></tr>
<tr><td>o</td><td>-us / -er</td><td>-i</td><td>m</td><td>musculus, nervus, lobus</td></tr>
<tr><td>o</td><td>-um</td><td>-i</td><td>n</td><td>ligamentum, cranium, septum</td></tr>
<tr><td>3.</td><td>versch.</td><td>-is</td><td>m/f/n</td><td>foramen, -inis (n); pulmo, -onis (m); regio, -onis (f)</td></tr>
<tr><td>u</td><td>-us / -u</td><td>-us</td><td>m (f) / n</td><td>ductus, processus, plexus, manus (f), cornu (n)</td></tr>
<tr><td>e</td><td>-es</td><td>-ei</td><td>f</td><td>facies, -ei</td></tr>
</table>
<p><b>Genus-Regeln 3. Deklination</b> (Faustregeln):</p>
<ul><li>-io, -tio, -go, -do (meist) → <b>f</b>: regio, articulatio, (aber: margo, tendo → m)</li>
<li>-men, -us (Gen. -oris/-eris), -ut, -ar, -al, -e → <b>n</b>: foramen, corpus, caput</li>
<li>-or, -o (Gen. -onis), -ex → <b>m</b>: pulmo, apex</li></ul>
<p class="tip">Bei Unsicherheit: Gen. Sg. und Genus immer mitlernen – im Vokabelbereich gibt es dafür eigene Felder.</p>`,
    checks: [
      { q: 'Genus von „foramen“?', a: ['n', 'neutrum'] },
      { q: 'Genitiv Singular von „ductus“?', a: ['ductus'] },
      { q: 'Zu welcher Deklination gehört „facies, faciei“? (Buchstabe)', a: ['e', 'e-deklination'] },
    ],
  },
  {
    id: 'med-plural', title: 'Pluralbildung',
    html: `
<table>
<tr><th>Singular</th><th>Plural Nom.</th><th>Plural Gen.</th><th>Beispiel</th></tr>
<tr><td>-a</td><td>-ae</td><td>-arum</td><td>vertebra → vertebrae, vertebrarum</td></tr>
<tr><td>-us (o-Dekl.)</td><td>-i</td><td>-orum</td><td>musculus → musculi, musculorum</td></tr>
<tr><td>-um</td><td>-a</td><td>-orum</td><td>ligamentum → ligamenta, ligamentorum</td></tr>
<tr><td>3. Dekl. m/f</td><td>-es</td><td>-um / -ium</td><td>pulmo → pulmones, pulmonum; dens → dentes, dentium</td></tr>
<tr><td>3. Dekl. n</td><td>-a</td><td>-um / -ium</td><td>foramen → foramina; corpus → corpora; os → ossa, ossium</td></tr>
<tr><td>-us (u-Dekl.)</td><td>-us</td><td>-uum</td><td>ductus → ductus, ductuum</td></tr>
<tr><td>-u (u-Dekl. n)</td><td>-ua</td><td>-uum</td><td>cornu → cornua</td></tr>
<tr><td>-es (e-Dekl.)</td><td>-es</td><td>-erum</td><td>facies → facies</td></tr>
</table>
<p><b>Griechische Wörter</b> (häufig in der Klinik): -is → -es (diagnosis → diagnoses), -ma → -mata (carcinoma → carcinomata), -on → -a (ganglion → ganglia)</p>
<p class="tip">Gleiche Endung -us ≠ gleicher Plural: musculus → musculi, aber ductus → ductus. Der Genitiv entscheidet!</p>`,
    checks: [
      { q: 'Plural von „vertebra“?', a: ['vertebrae'] },
      { q: 'Plural von „foramen“?', a: ['foramina'] },
      { q: 'Plural von „processus“?', a: ['processus'] },
      { q: 'Plural von „ganglion“?', a: ['ganglia'] },
    ],
  },
  {
    id: 'med-adj', title: 'Adjektive: Angleichung & Komparative',
    html: `
<p>Das Adjektiv passt sich in Kasus, Numerus und Genus dem Nomen an:</p>
<table>
<tr><th></th><th>m (musculus)</th><th>f (arteria)</th><th>n (ligamentum)</th></tr>
<tr><td>a/o-Dekl.: rectus, -a, -um</td><td>musculus rect<b>us</b></td><td>arteria rect<b>a</b></td><td>ligamentum rect<b>um</b></td></tr>
<tr><td>3. Dekl.: brevis, -e</td><td>musculus brev<b>is</b></td><td>arteria brev<b>is</b></td><td>ligamentum brev<b>e</b></td></tr>
<tr><td>Komparativ: superior, -ius</td><td>musculus superi<b>or</b></td><td>arteria superi<b>or</b></td><td>ligamentum superi<b>us</b></td></tr>
</table>
<p><b>Wichtige Komparative</b> (Lagebezeichnungen): superior/inferior (oberer/unterer), anterior/posterior (vorderer/hinterer), major/minor (größer/kleiner), interior/exterior – alle nach der 3. Deklination: Gen. Sg. <b>-ioris</b>, Nom. Pl. m/f <b>-iores</b>, n <b>-iora</b>.</p>
<p>Plural: Musculi recti, Arteriae superiores, Ligamenta brevia</p>
<p class="tip">Im Trainer „Plural & Angleichung“ kannst du alle Kombinationen üben.</p>`,
    checks: [
      { q: '„Ligamentum“ + „brevis, -e“ im Nom. Sg.?', a: ['ligamentum breve'] },
      { q: '„Musculus“ + „major, majus“ im Nom. Pl.?', a: ['musculi majores'] },
      { q: '„Arteria“ + „superior“ im Gen. Sg.?', a: ['arteriae superioris'] },
    ],
  },
  {
    id: 'med-affixe', title: 'Präfixe & Suffixe (klinische Terminologie)',
    html: `
<p>Klinische Begriffe werden aus <b>Präfix + Wortstamm + Suffix</b> zusammengesetzt – meist griechisch:</p>
<p><b>Peri</b>-<b>card</b>-<b>itis</b> = Entzündung (‑itis) des Herzbeutels (um das Herz herum)</p>
<table>
<tr><th>Präfix</th><th>Bedeutung</th><th>Suffix</th><th>Bedeutung</th></tr>
<tr><td>hyper-</td><td>über, zu viel</td><td>-itis</td><td>Entzündung</td></tr>
<tr><td>hypo-</td><td>unter, zu wenig</td><td>-ose</td><td>nicht-entzündliche Erkrankung</td></tr>
<tr><td>tachy- / brady-</td><td>schnell / langsam</td><td>-ektomie</td><td>operative Entfernung</td></tr>
<tr><td>a-/an-</td><td>ohne</td><td>-tomie</td><td>Schnitt</td></tr>
<tr><td>dys-</td><td>gestört</td><td>-algie</td><td>Schmerz</td></tr>
<tr><td>endo- / exo-</td><td>innen / außen</td><td>-skopie</td><td>Spiegelung</td></tr>
<tr><td>peri-</td><td>um … herum</td><td>-om</td><td>Geschwulst</td></tr>
<tr><td>inter- / intra-</td><td>zwischen / innerhalb</td><td>-penie / -ämie</td><td>Mangel / Blutzustand</td></tr>
</table>
<p class="tip">Im Bereich „Med. Terminologie“ kannst du ein Startpaket mit ca. 55 Bausteinen als Vokabeln hinzufügen.</p>`,
    checks: [
      { q: 'Was bedeutet die Endung „-itis“?', a: ['entzündung'] },
      { q: '„Tachykardie“ bedeutet: … Herzschlag', a: ['schneller', 'schnell'] },
      { q: 'Was bedeutet „-ektomie“?', a: ['operative entfernung', 'entfernung'] },
    ],
  },
  {
    id: 'med-griech', title: 'Latein vs. Griechisch: Doppelbegriffe',
    html: `
<p>Viele Organe haben einen <b>lateinischen</b> (Anatomie) und einen <b>griechischen</b> Namen (Klinik, Krankheiten):</p>
<table>
<tr><th>Deutsch</th><th>Latein (Anatomie)</th><th>Griechisch (Klinik)</th><th>Beispiel</th></tr>
<tr><td>Herz</td><td>cor, cordis</td><td>kardia</td><td>Kardiologie</td></tr>
<tr><td>Niere</td><td>ren, renis</td><td>nephros</td><td>Nephritis</td></tr>
<tr><td>Lunge</td><td>pulmo, -onis</td><td>pneumon</td><td>Pneumonie</td></tr>
<tr><td>Leber</td><td>iecur</td><td>hepar, hepatos</td><td>Hepatitis</td></tr>
<tr><td>Magen</td><td>ventriculus</td><td>gaster</td><td>Gastritis</td></tr>
<tr><td>Darm</td><td>intestinum</td><td>enteron</td><td>Enteritis</td></tr>
<tr><td>Haut</td><td>cutis</td><td>derma</td><td>Dermatologie</td></tr>
<tr><td>Knochen</td><td>os, ossis</td><td>osteon</td><td>Osteoporose</td></tr>
<tr><td>Blut</td><td>sanguis</td><td>haima</td><td>Hämatom</td></tr>
<tr><td>Auge</td><td>oculus</td><td>ophthalmos</td><td>Ophthalmologie</td></tr>
</table>`,
    checks: [
      { q: 'Griechisches Wort für Niere?', a: ['nephros'] },
      { q: 'Lateinisches Wort für Lunge?', a: ['pulmo'] },
      { q: '„Hepatitis“ ist eine Entzündung der …', a: ['leber'] },
    ],
  },
];
