// Grammatik Latein – eigene Regel-Übersichten (Gymnasium, Latein ab Kl. 5/6 bis ca. Kl. 10)
export default [
  {
    id: 'la-kasus', title: 'Kasus und ihre Funktionen',
    html: `
<table>
<tr><th>Kasus</th><th>Frage</th><th>wichtige Funktionen</th></tr>
<tr><td><b>Nominativ</b></td><td>wer? was?</td><td>Subjekt, Prädikatsnomen (Marcus <b>servus</b> est.)</td></tr>
<tr><td><b>Genitiv</b></td><td>wessen?</td><td>Besitz (Genitivus possessivus): domus <b>patris</b>; Teil (pars <b>militum</b>)</td></tr>
<tr><td><b>Dativ</b></td><td>wem?</td><td>indirektes Objekt (<b>amico</b> librum do); Besitz bei esse (<b>mihi</b> est liber = ich habe)</td></tr>
<tr><td><b>Akkusativ</b></td><td>wen? was?</td><td>direktes Objekt; Richtung (<b>Romam</b> ire); Zeitdauer (<b>multos annos</b>)</td></tr>
<tr><td><b>Ablativ</b></td><td>womit? wodurch? wo? wann?</td><td>Mittel (<b>gladio</b> pugnare), Ort (<b>in foro</b>), Zeit (<b>prima luce</b>), Grund, Trennung (ab, ex, de)</td></tr>
<tr><td><b>Vokativ</b></td><td>Anrede</td><td>meist = Nominativ; o-Dekl. auf -us → <b>-e</b> (Marce!), -ius → -i (Corneli!)</td></tr>
</table>
<p class="tip">Ablativ ohne Präposition übersetzt man meist mit „mit, durch, von“ – Präpositionen wie <i>cum, in, ab, ex, de, sine, pro</i> stehen mit Ablativ.</p>`,
    checks: [
      { q: 'In „Marcus amico donum dat“: In welchem Kasus steht „amico“?', a: ['dativ', 'dat'] },
      { q: 'Welcher Kasus beantwortet die Frage „womit?“', a: ['ablativ', 'abl'] },
      { q: 'Vokativ von „Marcus“?', a: ['marce'] },
    ],
  },
  {
    id: 'la-dekl', title: 'Deklinationen im Überblick',
    html: `
<table class="small">
<tr><th></th><th>a-Dekl.<br>rosa, f</th><th>o-Dekl.<br>dominus, m</th><th>o-Dekl.<br>templum, n</th><th>3. Dekl.<br>rex, m</th><th>u-Dekl.<br>senatus, m</th><th>e-Dekl.<br>res, f</th></tr>
<tr><td>N Sg</td><td>ros<b>a</b></td><td>domin<b>us</b></td><td>templ<b>um</b></td><td>rex</td><td>senat<b>us</b></td><td>r<b>es</b></td></tr>
<tr><td>G Sg</td><td>ros<b>ae</b></td><td>domin<b>i</b></td><td>templ<b>i</b></td><td>reg<b>is</b></td><td>senat<b>us</b></td><td>r<b>ei</b></td></tr>
<tr><td>D Sg</td><td>ros<b>ae</b></td><td>domin<b>o</b></td><td>templ<b>o</b></td><td>reg<b>i</b></td><td>senat<b>ui</b></td><td>r<b>ei</b></td></tr>
<tr><td>A Sg</td><td>ros<b>am</b></td><td>domin<b>um</b></td><td>templ<b>um</b></td><td>reg<b>em</b></td><td>senat<b>um</b></td><td>r<b>em</b></td></tr>
<tr><td>Abl Sg</td><td>ros<b>a</b></td><td>domin<b>o</b></td><td>templ<b>o</b></td><td>reg<b>e</b></td><td>senat<b>u</b></td><td>r<b>e</b></td></tr>
<tr><td>N Pl</td><td>ros<b>ae</b></td><td>domin<b>i</b></td><td>templ<b>a</b></td><td>reg<b>es</b></td><td>senat<b>us</b></td><td>r<b>es</b></td></tr>
<tr><td>G Pl</td><td>ros<b>arum</b></td><td>domin<b>orum</b></td><td>templ<b>orum</b></td><td>reg<b>um</b></td><td>senat<b>uum</b></td><td>r<b>erum</b></td></tr>
<tr><td>D Pl</td><td>ros<b>is</b></td><td>domin<b>is</b></td><td>templ<b>is</b></td><td>reg<b>ibus</b></td><td>senat<b>ibus</b></td><td>r<b>ebus</b></td></tr>
<tr><td>A Pl</td><td>ros<b>as</b></td><td>domin<b>os</b></td><td>templ<b>a</b></td><td>reg<b>es</b></td><td>senat<b>us</b></td><td>r<b>es</b></td></tr>
<tr><td>Abl Pl</td><td>ros<b>is</b></td><td>domin<b>is</b></td><td>templ<b>is</b></td><td>reg<b>ibus</b></td><td>senat<b>ibus</b></td><td>r<b>ebus</b></td></tr>
</table>
<p><b>Die Deklination erkennst du am Genitiv Singular</b> (-ae, -i, -is, -us, -ei) – deshalb lernt man ihn immer mit!</p>
<p><b>Neutrum-Regel:</b> Nominativ = Akkusativ, im Plural immer auf <b>-a</b>.</p>
<p><b>3. Deklination, Mischklasse (i-Stämme):</b> Gen. Pl. auf <b>-ium</b> bei gleichsilbigen Wörtern (civis, civis → civium) und Stämmen auf zwei Konsonanten (urbs, urbis → urbium). Neutra auf -e, -al, -ar: Abl. Sg. -i, Pl. -ia (mare → mari, maria).</p>`,
    checks: [
      { q: 'Genitiv Plural von „rosa“?', a: ['rosarum'] },
      { q: 'Akkusativ Plural von „templum“?', a: ['templa'] },
      { q: 'Dativ Singular von „rex, regis“?', a: ['regi'] },
      { q: 'An welchem Kasus erkennt man die Deklination? (Kasus + Numerus)', a: ['genitiv singular', 'gen sg', 'genitiv sg'] },
    ],
  },
  {
    id: 'la-konj', title: 'Konjugationen & Tempusbildung',
    html: `
<p><b>Konjugationsklassen</b> (am Infinitiv und der 1. Pers. Sg. erkennbar):</p>
<table>
<tr><th>a-Konj.</th><th>e-Konj.</th><th>i-Konj.</th><th>kons. Konj.</th><th>kons. mit i</th></tr>
<tr><td>laud<b>are</b>, laudo</td><td>mon<b>ere</b>, mon<b>eo</b></td><td>aud<b>ire</b>, audio</td><td>reg<b>ere</b>, rego</td><td>cap<b>ere</b>, cap<b>io</b></td></tr>
</table>
<p><b>Personalendungen Aktiv:</b> -o/-m, -s, -t, -mus, -tis, -nt</p>
<table>
<tr><th>Tempus</th><th>Kennzeichen</th><th>Beispiel</th></tr>
<tr><td>Präsens</td><td>–</td><td>lauda-t</td></tr>
<tr><td>Imperfekt</td><td><b>-ba-</b></td><td>lauda-<b>ba</b>-t, audi-e-<b>ba</b>-t</td></tr>
<tr><td>Futur I (a/e-Konj.)</td><td><b>-b-</b> (-bo, -bis, -bit …)</td><td>lauda-<b>bi</b>-t</td></tr>
<tr><td>Futur I (kons./i-Konj.)</td><td><b>-a-/-e-</b> (-am, -es, -et …)</td><td>reg-<b>e</b>-t, audi-<b>e</b>-t</td></tr>
<tr><td>Perfekt</td><td>Perfektstamm + -i, -isti, -it, -imus, -istis, -erunt</td><td>laudav-<b>it</b>, rex-<b>it</b></td></tr>
<tr><td>Plusquamperfekt</td><td>Perfektstamm + <b>-era-</b></td><td>laudav-<b>era</b>-t</td></tr>
<tr><td>Futur II</td><td>Perfektstamm + <b>-eri-</b> (-ero, -eris …)</td><td>laudav-<b>eri</b>-t</td></tr>
</table>
<p><b>Perfektbildung:</b> v-Perfekt (laudavi), u-Perfekt (monui), s-Perfekt (rexi = reg-s-i), Dehnung (veni, vidi), Reduplikation (dedi, cucurri) → <b>Stammformen lernen!</b></p>
<p><b>Konjunktiv:</b> Präsens -e- (a-Konj.: laud<b>e</b>t) bzw. -a- (übrige: mon<b>ea</b>t, reg<b>a</b>t); Imperfekt = Infinitiv + Endung (laudare-t); Perfekt -eri- (laudaverit); Plusquamperfekt -isse- (laudavisset).</p>`,
    checks: [
      { q: 'Imperfekt 3. Pers. Sg. von „laudare“?', a: ['laudabat'] },
      { q: 'Futur I 1. Pers. Sg. von „regere“?', a: ['regam'] },
      { q: 'Perfekt 3. Pers. Pl. von „venire“ (Perfektstamm ven-)?', a: ['venerunt'] },
      { q: 'Woran erkennt man das Imperfekt? (Kennzeichen)', a: ['-ba-', 'ba'] },
    ],
  },
  {
    id: 'la-passiv', title: 'Passiv',
    html: `
<p><b>Personalendungen Passiv</b> (Präsensstamm): <b>-r, -ris, -tur, -mur, -mini, -ntur</b></p>
<table>
<tr><th>Tempus</th><th>Bildung</th><th>Beispiel</th></tr>
<tr><td>Präsens</td><td>Stamm + Passivendung</td><td>laud<b>or</b>, lauda<b>ris</b>, lauda<b>tur</b></td></tr>
<tr><td>Imperfekt</td><td>-ba- + Passivendung</td><td>lauda<b>batur</b></td></tr>
<tr><td>Futur I</td><td>-bo-/-a-/-e- + Passivendung</td><td>lauda<b>bitur</b>, reg<b>etur</b></td></tr>
<tr><td>Perfekt</td><td><b>PPP + sum, es, est …</b></td><td>laudatus <b>est</b> (er ist gelobt worden)</td></tr>
<tr><td>Plusquamperfekt</td><td>PPP + eram …</td><td>laudatus <b>erat</b></td></tr>
<tr><td>Futur II</td><td>PPP + ero …</td><td>laudatus <b>erit</b></td></tr>
</table>
<p>Das PPP passt sich dem Subjekt an (KNG): puella laudat<b>a</b> est, pueri laudat<b>i</b> sunt.</p>
<p class="tip">Achtung Deponentien: passive Form, aktive Bedeutung (hortari – ermahnen: hortatur = er ermahnt).</p>`,
    checks: [
      { q: 'Präsens Passiv 3. Pers. Sg. von „laudare“?', a: ['laudatur'] },
      { q: 'Perfekt Passiv 3. Pers. Sg. f von „vocare“ (PPP vocatum)?', a: ['vocata est'] },
      { q: 'Imperfekt Passiv 3. Pers. Pl. von „monere“?', a: ['monebantur'] },
    ],
  },
  {
    id: 'la-adj', title: 'Adjektive & KNG-Kongruenz',
    html: `
<p>Adjektive richten sich in <b>K</b>asus, <b>N</b>umerus und <b>G</b>enus nach ihrem Bezugswort (<b>KNG-Kongruenz</b>) – die Endungen müssen dabei <i>nicht</i> gleich aussehen!</p>
<p>agricol<b>a</b> bon<b>us</b> (m) · nauta fess<b>us</b> · mare magn<b>um</b></p>
<table>
<tr><th>Typ</th><th>Beispiel</th><th>Deklination</th></tr>
<tr><td>a-/o-Dekl.</td><td>bonus, bona, bonum · liber, libera, liberum · pulcher, pulchra, pulchrum</td><td>m/n nach o-Dekl., f nach a-Dekl.</td></tr>
<tr><td>3. Dekl. dreiendig</td><td>acer, acris, acre</td><td>i-Stamm: Abl. Sg. -i, Gen. Pl. -ium, n Pl. -ia</td></tr>
<tr><td>3. Dekl. zweiendig</td><td>brevis, breve</td><td>wie oben</td></tr>
<tr><td>3. Dekl. einendig</td><td>felix, felicis · ingens, ingentis</td><td>wie oben</td></tr>
</table>
<p><b>Steigerung:</b> Komparativ -ior/-ius (longior), Superlativ -issimus (longissimus); unregelmäßig: bonus – melior – optimus, malus – peior – pessimus, magnus – maior – maximus, parvus – minor – minimus.</p>`,
    checks: [
      { q: 'Wofür steht KNG?', a: ['kasus numerus genus', 'kasus, numerus, genus'] },
      { q: '„agricola“ (m) + „bonus“: Nominativ Singular?', a: ['agricola bonus'] },
      { q: 'Komparativ von „bonus“ (m)?', a: ['melior'] },
    ],
  },
  {
    id: 'la-aci', title: 'AcI (Accusativus cum Infinitivo)',
    html: `
<p><b>Erkennen:</b> Ein <b>Akkusativ</b> + ein <b>Infinitiv</b> nach Verben des Sagens, Denkens, Wahrnehmens, Wissens und Fühlens (dicere, putare, videre, audire, scire, gaudere …).</p>
<p><b>Übersetzen:</b> mit einem <b>dass-Satz</b> – der Akkusativ wird zum Subjekt, der Infinitiv zum Prädikat.</p>
<p>Marcus <b>amicum venire</b> videt. → Marcus sieht, <b>dass der Freund kommt</b>.</p>
<table>
<tr><th>Infinitiv</th><th>Zeitverhältnis</th><th>Beispiel</th></tr>
<tr><td>Präsens (laudare)</td><td>gleichzeitig</td><td>… dass er lobt</td></tr>
<tr><td>Perfekt (laudavisse)</td><td>vorzeitig</td><td>… dass er gelobt hat</td></tr>
<tr><td>Futur (laudaturum esse)</td><td>nachzeitig</td><td>… dass er loben wird</td></tr>
</table>
<p><b>Reflexivpronomen</b> im AcI (se, sibi, suus) beziehen sich auf das Subjekt des übergeordneten Satzes: Marcus dicit <b>se</b> laetum esse. → Marcus sagt, dass <b>er (selbst)</b> froh ist.</p>`,
    checks: [
      { q: 'Mit welcher Satzart übersetzt man einen AcI meist? (…-Satz)', a: ['dass-satz', 'dass satz', 'dass'] },
      { q: 'Welches Zeitverhältnis drückt der Infinitiv Perfekt aus?', a: ['vorzeitig', 'vorzeitigkeit'] },
      { q: 'Im AcI wird der Akkusativ im Deutschen zum …?', a: ['subjekt'] },
    ],
  },
  {
    id: 'la-partizip', title: 'Partizipien & Participium coniunctum',
    html: `
<table>
<tr><th>Partizip</th><th>Bildung</th><th>Zeitverhältnis</th><th>Bedeutung</th></tr>
<tr><td><b>PPA</b> (Präsens Aktiv)</td><td>-ns, -ntis (laudans, laudantis)</td><td>gleichzeitig</td><td>aktiv: lobend</td></tr>
<tr><td><b>PPP</b> (Perfekt Passiv)</td><td>4. Stammform (laudatus, -a, -um)</td><td>vorzeitig</td><td>passiv: gelobt (worden)</td></tr>
<tr><td><b>PFA</b> (Futur Aktiv)</td><td>-urus, -a, -um (laudaturus)</td><td>nachzeitig</td><td>aktiv: im Begriff zu loben</td></tr>
</table>
<p><b>Participium coniunctum (PC):</b> Partizip ist KNG-gleich mit einem Nomen im Satz verbunden.</p>
<p>Milites <b>urbem captam</b> deleverunt.</p>
<ul><li>wörtlich: Die Soldaten zerstörten die eingenommene Stadt.</li>
<li>Relativsatz: …, die eingenommen worden war.</li>
<li>Adverbialsatz: Nachdem die Stadt eingenommen worden war, …</li>
<li>Beiordnung: Die Soldaten nahmen die Stadt ein und zerstörten sie.</li></ul>
<p class="tip">Sinnrichtungen für Adverbialsätze: temporal (als, nachdem, während), kausal (weil), konzessiv (obwohl), modal (indem).</p>`,
    checks: [
      { q: 'Welches Zeitverhältnis drückt das PPP aus?', a: ['vorzeitig', 'vorzeitigkeit'] },
      { q: 'PPA von „laudare“ (Nom. Sg.)?', a: ['laudans'] },
      { q: 'Wofür steht PFA?', a: ['partizip futur aktiv', 'participium futuri activi'] },
    ],
  },
  {
    id: 'la-ablabs', title: 'Ablativus absolutus',
    html: `
<p><b>Erkennen:</b> Nomen/Pronomen im <b>Ablativ</b> + KNG-gleiches <b>Partizip</b> im Ablativ, grammatisch „losgelöst“ (absolutus) vom Rest des Satzes.</p>
<p><b>Urbe capta</b> milites gaudebant.</p>
<ul><li>temporal: <b>Nachdem die Stadt eingenommen worden war</b>, freuten sich die Soldaten.</li>
<li>Präpositional: <b>Nach der Einnahme der Stadt</b> …</li></ul>
<table>
<tr><th>Partizip im Abl. abs.</th><th>Zeitverhältnis</th><th>Beispiel</th></tr>
<tr><td>PPP</td><td>vorzeitig</td><td>hostibus victis – nachdem die Feinde besiegt worden waren</td></tr>
<tr><td>PPA</td><td>gleichzeitig</td><td>sole oriente – während die Sonne aufgeht</td></tr>
</table>
<p><b>Nominaler Abl. abs.</b> (ohne Partizip): <b>Caesare duce</b> – unter der Führung Caesars; <b>Cicerone consule</b> – als Cicero Konsul war.</p>`,
    checks: [
      { q: 'Aus welchen zwei Teilen besteht ein Abl. abs.? (Nomen + …)', a: ['partizip', 'partizip im ablativ'] },
      { q: '„Caesare duce“ übersetzt man mit: unter der … Caesars', a: ['führung'] },
      { q: 'Zeitverhältnis bei PPA im Abl. abs.?', a: ['gleichzeitig', 'gleichzeitigkeit'] },
    ],
  },
  {
    id: 'la-konjunktiv', title: 'Konjunktiv im Gliedsatz & Consecutio temporum',
    html: `
<table>
<tr><th>Konjunktion</th><th>Bedeutung</th><th>Beispiel</th></tr>
<tr><td><b>ut</b> + Konj.</td><td>dass, damit, sodass</td><td>Rogo, <b>ut</b> venias. – Ich bitte, dass du kommst.</td></tr>
<tr><td><b>ne</b> + Konj.</td><td>dass nicht, damit nicht</td><td>Timeo, <b>ne</b> veniat. – Ich fürchte, dass er kommt.</td></tr>
<tr><td><b>cum</b> + Konj.</td><td>als, nachdem, weil, obwohl</td><td><b>Cum</b> venisset, … – Als er gekommen war, …</td></tr>
<tr><td>indirekte Frage</td><td>ob, wer, was …</td><td>Scio, quid <b>facias</b>.</td></tr>
</table>
<h3>Consecutio temporum (Zeitenfolge)</h3>
<table>
<tr><th>Hauptsatz</th><th>gleichzeitig</th><th>vorzeitig</th></tr>
<tr><td>Haupttempus (Präs., Fut.)</td><td>Konj. Präsens</td><td>Konj. Perfekt</td></tr>
<tr><td>Nebentempus (Vergangenheit)</td><td>Konj. Imperfekt</td><td>Konj. Plusquamperfekt</td></tr>
</table>
<p class="tip">Konjunktiv im Gliedsatz wird meist <b>mit Indikativ</b> übersetzt; im Hauptsatz drückt er Wunsch, Aufforderung oder Möglichkeit aus (Eamus! – Lasst uns gehen!).</p>`,
    checks: [
      { q: 'Hauptsatz in der Vergangenheit, Nebensatz gleichzeitig: Welcher Konjunktiv?', a: ['konjunktiv imperfekt', 'imperfekt'] },
      { q: 'Was bedeutet „ne“ + Konjunktiv nach Verben des Fürchtens?', a: ['dass'] },
      { q: 'Konjunktiv Imperfekt 3. Pers. Sg. von „esse“?', a: ['esset'] },
    ],
  },
  {
    id: 'la-pronomina', title: 'Pronomina',
    html: `
<table class="small">
<tr><th></th><th>is, ea, id<br>(er, sie, es; dieser)</th><th>hic, haec, hoc<br>(dieser hier)</th><th>ille, illa, illud<br>(jener)</th><th>qui, quae, quod<br>(der, die, das; welcher)</th></tr>
<tr><td>N Sg</td><td>is, ea, id</td><td>hic, haec, hoc</td><td>ille, illa, illud</td><td>qui, quae, quod</td></tr>
<tr><td>G Sg</td><td>eius</td><td>huius</td><td>illius</td><td>cuius</td></tr>
<tr><td>D Sg</td><td>ei</td><td>huic</td><td>illi</td><td>cui</td></tr>
<tr><td>A Sg</td><td>eum, eam, id</td><td>hunc, hanc, hoc</td><td>illum, illam, illud</td><td>quem, quam, quod</td></tr>
<tr><td>Abl Sg</td><td>eo, ea, eo</td><td>hoc, hac, hoc</td><td>illo, illa, illo</td><td>quo, qua, quo</td></tr>
<tr><td>N Pl</td><td>ei/ii, eae, ea</td><td>hi, hae, haec</td><td>illi, illae, illa</td><td>qui, quae, quae</td></tr>
<tr><td>G Pl</td><td>eorum, earum, eorum</td><td>horum, harum, horum</td><td>illorum, illarum, illorum</td><td>quorum, quarum, quorum</td></tr>
<tr><td>D/Abl Pl</td><td>eis/iis</td><td>his</td><td>illis</td><td>quibus</td></tr>
<tr><td>A Pl</td><td>eos, eas, ea</td><td>hos, has, haec</td><td>illos, illas, illa</td><td>quos, quas, quae</td></tr>
</table>
<p><b>Relativpronomen:</b> richtet sich in <b>Genus und Numerus</b> nach dem Bezugswort, der <b>Kasus</b> kommt aus dem Relativsatz.</p>
<p><b>Relativischer Satzanschluss:</b> Relativpronomen am Satzanfang nach Punkt → mit Demonstrativpronomen übersetzen (Quae cum ita sint … – Da dies so ist …).</p>`,
    checks: [
      { q: 'Genitiv Singular von „is“?', a: ['eius'] },
      { q: 'Akkusativ Singular m von „hic“?', a: ['hunc'] },
      { q: 'Dativ/Ablativ Plural von „qui“?', a: ['quibus'] },
    ],
  },
  {
    id: 'la-nd', title: 'Gerundium & Gerundivum',
    html: `
<p><b>Gerundium</b> = substantiviertes Verb (aktiv), nur Gen., Dat., Akk. (mit Präp.), Abl.: -nd- + o-Dekl. Endung</p>
<ul><li>ars <b>scribendi</b> – die Kunst des Schreibens</li><li>ad <b>discendum</b> – zum Lernen</li><li><b>legendo</b> – durch Lesen</li></ul>
<p><b>Gerundivum</b> = Verbaladjektiv (passiv), KNG-gleich mit einem Nomen: -ndus, -nda, -ndum</p>
<ul><li>Attributiv: ad urbem <b>defendendam</b> – um die Stadt zu verteidigen</li>
<li>Prädikativ mit esse (Notwendigkeit): Carthago <b>delenda est</b>. – Karthago muss zerstört werden.</li>
<li>Die handelnde Person steht im <b>Dativ</b> (dativus auctoris): <b>Mihi</b> laborandum est. – Ich muss arbeiten.</li></ul>`,
    checks: [
      { q: 'Kennzeichen von Gerundium und Gerundivum (Silbe)?', a: ['-nd-', 'nd'] },
      { q: '„Carthago delenda est“: Karthago muss … werden.', a: ['zerstört'] },
      { q: 'In welchem Kasus steht die handelnde Person beim Gerundivum + esse?', a: ['dativ'] },
    ],
  },
];
