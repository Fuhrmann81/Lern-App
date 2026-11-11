// Grammatik Französisch – eigene Regel-Übersichten (Gymnasium, ca. Kl. 6–10)
export default [
  {
    id: 'fr-present', title: 'Présent – regelmäßige & wichtige unregelmäßige Verben',
    html: `
<table>
<tr><th></th><th>-er (parler)</th><th>-ir (finir)</th><th>-re (vendre)</th></tr>
<tr><td>je</td><td>parl<b>e</b></td><td>fin<b>is</b></td><td>vend<b>s</b></td></tr>
<tr><td>tu</td><td>parl<b>es</b></td><td>fin<b>is</b></td><td>vend<b>s</b></td></tr>
<tr><td>il/elle/on</td><td>parl<b>e</b></td><td>fin<b>it</b></td><td>vend</td></tr>
<tr><td>nous</td><td>parl<b>ons</b></td><td>fin<b>issons</b></td><td>vend<b>ons</b></td></tr>
<tr><td>vous</td><td>parl<b>ez</b></td><td>fin<b>issez</b></td><td>vend<b>ez</b></td></tr>
<tr><td>ils/elles</td><td>parl<b>ent</b></td><td>fin<b>issent</b></td><td>vend<b>ent</b></td></tr>
</table>
<p><b>Besonderheiten:</b> nous mang<b>e</b>ons, nous commen<b>ç</b>ons · j'ach<b>è</b>te, je préf<b>è</b>re, j'appe<b>ll</b>e (nous: achetons, préférons, appelons)</p>
<p><b>Wichtige Unregelmäßige:</b> être (suis, es, est, sommes, êtes, sont) · avoir (ai, as, a, avons, avez, ont) · aller (vais, vas, va, allons, allez, vont) · faire (fais, fais, fait, faisons, faites, font)</p>
<p class="tip">Im Konjugationstrainer kannst du alle Formen üben.</p>`,
    checks: [
      { q: 'Nous ___ (manger) à la cantine.', a: ['mangeons'] },
      { q: 'Ils ___ (finir) leurs devoirs.', a: ['finissent'] },
      { q: 'Vous ___ (faire) du sport ?', a: ['faites'] },
      { q: "J'___ (acheter) un livre.", a: ['achète'] },
    ],
  },
  {
    id: 'fr-pc-avoir', title: 'Passé composé mit avoir',
    html: `
<p><b>Bildung:</b> Präsens von <b>avoir</b> + <b>participe passé</b></p>
<table>
<tr><th>Verbgruppe</th><th>Participe</th><th>Beispiel</th></tr>
<tr><td>-er</td><td>-é</td><td>j'ai parl<b>é</b></td></tr>
<tr><td>-ir</td><td>-i</td><td>tu as fin<b>i</b></td></tr>
<tr><td>-re</td><td>-u</td><td>il a vend<b>u</b></td></tr>
</table>
<p><b>Unregelmäßige Participes:</b> être → été, avoir → eu, faire → fait, prendre → pris, mettre → mis, dire → dit, écrire → écrit, voir → vu, lire → lu, boire → bu, pouvoir → pu, vouloir → voulu, devoir → dû, savoir → su, ouvrir → ouvert, recevoir → reçu</p>
<p><b>Verneinung</b> umschließt das Hilfsverb: Je <b>n'</b>ai <b>pas</b> mangé.</p>
<p class="tip">Angleichung bei avoir nur, wenn ein direktes Objekt <i>vorher</i> steht: La lettre ? Je l'ai écrit<b>e</b>.</p>`,
    checks: [
      { q: "Hier, j'___ (regarder) un film.", a: ['ai regardé'] },
      { q: 'Nous ___ (prendre) le bus.', a: ['avons pris'] },
      { q: 'Elle ___ (faire) ses devoirs.', a: ['a fait'] },
      { q: "Ils n'ont pas ___ (voir) le match.", a: ['vu'] },
    ],
  },
  {
    id: 'fr-pc-etre', title: 'Passé composé mit être & Angleichung',
    html: `
<p><b>Mit être</b> bilden das Passé composé:</p>
<ul><li>Verben der Bewegung/Zustandsveränderung („Maison d'être“): aller, venir, arriver, partir, entrer, sortir, monter, descendre, tomber, rester, naître, mourir, devenir, revenir, rentrer, retourner</li>
<li>alle <b>reflexiven</b> Verben: je me suis levé(e)</li></ul>
<p><b>Angleichung:</b> Das Participe richtet sich nach dem Subjekt (wie ein Adjektiv):</p>
<table>
<tr><td>il est allé</td><td>elle est allé<b>e</b></td></tr>
<tr><td>ils sont allé<b>s</b></td><td>elles sont allé<b>es</b></td></tr>
</table>
<p class="tip">Merksatz: Bei <b>être</b> passt sich das Participe an – bei <b>avoir</b> (fast) nie.</p>`,
    checks: [
      { q: 'Elle ___ (aller) au cinéma.', a: ['est allée'] },
      { q: 'Nous (les filles) ___ (partir) à 8 heures.', a: ['sommes parties'] },
      { q: 'Ils ___ (arriver) en retard.', a: ['sont arrivés'] },
      { q: 'Paul ___ (tomber) dans la rue.', a: ['est tombé'] },
    ],
  },
  {
    id: 'fr-imparfait', title: 'Imparfait & Unterschied zum Passé composé',
    html: `
<p><b>Bildung:</b> Stamm der <b>nous-Form im Präsens</b> (ohne ‑ons) + Endungen</p>
<table>
<tr><th>Endungen</th><th>Beispiel: nous finiss-ons</th></tr>
<tr><td>-ais, -ais, -ait, -ions, -iez, -aient</td><td>je finiss<b>ais</b>, nous finiss<b>ions</b></td></tr>
</table>
<p>Einzige Ausnahme: <b>être</b> → j'<b>étais</b>. Achtung: je mang<b>e</b>ais, je commen<b>ç</b>ais.</p>
<table>
<tr><th>Imparfait</th><th>Passé composé</th></tr>
<tr><td>Hintergrund, Beschreibung, Zustand</td><td>Handlung im Vordergrund, neu einsetzend</td></tr>
<tr><td>Gewohnheit (d'habitude, toujours, souvent)</td><td>einmalige Handlung (un jour, soudain, tout à coup)</td></tr>
<tr><td>Was lief gerade? (Il <b>pleuvait</b> …)</td><td>Was passierte dann? (… quand le téléphone <b>a sonné</b>.)</td></tr>
</table>`,
    checks: [
      { q: "Quand j'___ (être) petit, j'habitais à Paris.", a: ['étais'] },
      { q: 'Nous ___ (jouer) souvent au foot.', a: ['jouions'] },
      { q: 'Il ___ (faire) beau quand nous sommes partis.', a: ['faisait'] },
      { q: 'Tout à coup, le téléphone ___ (sonner).', a: ['a sonné'] },
    ],
  },
  {
    id: 'fr-futur', title: 'Futur composé & Futur simple',
    html: `
<h3>Futur composé (nahe Zukunft)</h3>
<p>aller (Präsens) + Infinitiv: Je <b>vais partir</b>. Nous <b>allons manger</b>.</p>
<h3>Futur simple</h3>
<p><b>Bildung:</b> Infinitiv (bei ‑re ohne e) + Endungen <b>-ai, -as, -a, -ons, -ez, -ont</b></p>
<p>parler → je parler<b>ai</b>, finir → tu finir<b>as</b>, vendre → il vendr<b>a</b></p>
<p><b>Unregelmäßige Stämme:</b> être → <b>ser</b>-, avoir → <b>aur</b>-, aller → <b>ir</b>-, faire → <b>fer</b>-, venir → <b>viendr</b>-, pouvoir → <b>pourr</b>-, vouloir → <b>voudr</b>-, devoir → <b>devr</b>-, savoir → <b>saur</b>-, voir → <b>verr</b>-, recevoir → <b>recevr</b>-</p>
<p class="tip">Die Endungen sind das Präsens von avoir: (j')ai, as, a, (av)ons, (av)ez, ont.</p>`,
    checks: [
      { q: 'Demain, nous ___ (aller) à la mer. (Futur simple)', a: ['irons'] },
      { q: 'Tu ___ (être) content. (Futur simple)', a: ['seras'] },
      { q: 'Ce soir, je ___ (regarder) un film. (Futur composé)', a: ['vais regarder'] },
      { q: 'Elles ___ (avoir) le temps. (Futur simple)', a: ['auront'] },
    ],
  },
  {
    id: 'fr-pronoms', title: 'Objektpronomen, y und en',
    html: `
<table>
<tr><th></th><th>direktes Objekt (wen?)</th><th>indirektes Objekt (à qn – wem?)</th></tr>
<tr><td>1. Sg.</td><td>me</td><td>me</td></tr>
<tr><td>2. Sg.</td><td>te</td><td>te</td></tr>
<tr><td>3. Sg.</td><td><b>le / la</b> (l')</td><td><b>lui</b></td></tr>
<tr><td>1. Pl.</td><td>nous</td><td>nous</td></tr>
<tr><td>2. Pl.</td><td>vous</td><td>vous</td></tr>
<tr><td>3. Pl.</td><td><b>les</b></td><td><b>leur</b></td></tr>
</table>
<p><b>y</b> ersetzt Ortsangaben (à Paris → j'y vais) und à + Sache (Je pense à l'examen → J'y pense).</p>
<p><b>en</b> ersetzt de + Nomen und Mengen: Tu veux du pain ? – Oui, j'<b>en</b> veux. J'<b>en</b> ai deux.</p>
<p><b>Stellung:</b> vor dem konjugierten Verb (Je <b>le</b> vois), im Passé composé vor dem Hilfsverb (Je <b>l'</b>ai vu), bei Verb + Infinitiv vor dem Infinitiv (Je vais <b>le</b> voir).</p>
<p><b>Reihenfolge</b> bei zwei Pronomen: me/te/nous/vous → le/la/les → lui/leur → y → en</p>`,
    checks: [
      { q: 'Tu vois Marie ? – Oui, je ___ vois.', a: ['la'] },
      { q: 'Tu téléphones à tes parents ? – Oui, je ___ téléphone.', a: ['leur'] },
      { q: 'Tu vas à Paris ? – Oui, j’___ vais.', a: ['y'] },
      { q: 'Tu as des frères ? – Oui, j’___ ai deux.', a: ['en'] },
    ],
  },
  {
    id: 'fr-partitif', title: 'Teilungsartikel & Mengenangaben',
    html: `
<p><b>Teilungsartikel</b> für unbestimmte Mengen (nicht zählbar):</p>
<table><tr><td><b>du</b> pain (m)</td><td><b>de la</b> confiture (f)</td><td><b>de l'</b>eau (Vokal)</td><td><b>des</b> pommes (Pl.)</td></tr></table>
<p><b>Nach Mengenangaben und Verneinung</b> steht nur <b>de / d'</b>:</p>
<ul><li>beaucoup <b>de</b> pain, un kilo <b>de</b> pommes, une bouteille <b>d'</b>eau, un peu <b>de</b> sucre, assez <b>de</b> temps</li>
<li>Je ne mange pas <b>de</b> viande. Il n'y a plus <b>d'</b>eau.</li></ul>
<p class="tip">Nach aimer, adorer, détester, préférer steht der bestimmte Artikel: J'aime <b>le</b> chocolat.</p>`,
    checks: [
      { q: 'Je voudrais ___ eau. (Teilungsartikel)', a: ["de l'", "de l’"] },
      { q: 'Il achète un kilo ___ tomates.', a: ['de'] },
      { q: 'Nous ne buvons pas ___ café.', a: ['de'] },
      { q: 'Elle mange ___ salade. (f, Teilungsartikel)', a: ['de la'] },
    ],
  },
  {
    id: 'fr-negation', title: 'Verneinung',
    html: `
<table>
<tr><th>Form</th><th>Bedeutung</th><th>Beispiel</th></tr>
<tr><td>ne … pas</td><td>nicht</td><td>Je <b>ne</b> parle <b>pas</b>.</td></tr>
<tr><td>ne … plus</td><td>nicht mehr</td><td>Il <b>n'</b>habite <b>plus</b> ici.</td></tr>
<tr><td>ne … jamais</td><td>nie</td><td>Nous <b>ne</b> mangeons <b>jamais</b> de viande.</td></tr>
<tr><td>ne … rien</td><td>nichts</td><td>Je <b>ne</b> vois <b>rien</b>.</td></tr>
<tr><td>ne … personne</td><td>niemand</td><td>Je <b>ne</b> connais <b>personne</b>.</td></tr>
<tr><td>ne … pas encore</td><td>noch nicht</td><td>Elle <b>n'</b>est <b>pas encore</b> là.</td></tr>
</table>
<p><b>Im Passé composé:</b> ne … pas um das Hilfsverb: Je <b>n'</b>ai <b>pas</b> dormi. Aber: Je n'ai vu <b>personne</b>.</p>
<p><b>Vor Infinitiv:</b> ne pas zusammen: Il est important de <b>ne pas</b> oublier.</p>`,
    checks: [
      { q: 'Il ne travaille ___ ici. (nicht mehr)', a: ['plus'] },
      { q: "Je n'ai ___ mangé. (nichts)", a: ['rien'] },
      { q: "Nous n'allons ___ au cinéma. (nie)", a: ['jamais'] },
      { q: 'Je ne connais ___ ici. (niemand)', a: ['personne'] },
    ],
  },
  {
    id: 'fr-subjonctif', title: 'Subjonctif présent',
    html: `
<p><b>Bildung:</b> Stamm der <b>ils-Form im Präsens</b> (ohne ‑ent) + <b>-e, -es, -e, -ions, -iez, -ent</b></p>
<p>ils finiss‑ent → que je finiss<b>e</b>, que nous finiss<b>ions</b></p>
<p>nous/vous haben oft den Stamm der nous-Form: que nous <b>venions</b> (aber: que je vienne)</p>
<p><b>Unregelmäßig:</b> être (que je sois, que nous soyons), avoir (que j'aie), aller (que j'aille), faire (que je fasse), pouvoir (que je puisse), savoir (que je sache), vouloir (que je veuille)</p>
<p><b>Wann?</b> Nach Ausdrücken von</p>
<ul><li>Notwendigkeit: <b>il faut que</b>, il est important que</li>
<li>Wunsch/Wille: <b>je veux que</b>, j'aimerais que</li>
<li>Gefühl: je suis content(e) que, j'ai peur que</li>
<li>Konjunktionen: <b>pour que</b>, avant que, bien que</li></ul>
<p class="tip">Nach <b>espérer que</b> und <b>je pense que</b> steht Indikativ!</p>`,
    checks: [
      { q: 'Il faut que tu ___ (faire) tes devoirs.', a: ['fasses'] },
      { q: 'Je veux que vous ___ (être) à l’heure.', a: ['soyez'] },
      { q: 'Il faut que nous ___ (partir).', a: ['partions'] },
      { q: 'Il faut que j’___ (aller) chez le médecin.', a: ['aille'] },
    ],
  },
  {
    id: 'fr-conditionnel', title: 'Conditionnel & si-Sätze',
    html: `
<p><b>Conditionnel présent:</b> Futur-Stamm + Imparfait-Endungen: je parler<b>ais</b>, nous ser<b>ions</b>, ils voudr<b>aient</b></p>
<p>Höflichkeit: Je <b>voudrais</b> un café. Tu <b>pourrais</b> m'aider ?</p>
<table>
<tr><th>Typ</th><th>si-Satz</th><th>Hauptsatz</th></tr>
<tr><td>real</td><td>si + Présent</td><td>Présent / Futur / Imperativ</td></tr>
<tr><td>irreal (Gegenwart)</td><td>si + <b>Imparfait</b></td><td><b>Conditionnel</b></td></tr>
</table>
<ul><li>S'il <b>fait</b> beau, nous <b>irons</b> à la plage.</li>
<li>Si j'<b>avais</b> le temps, je <b>viendrais</b>.</li></ul>
<p class="tip">Nie Futur oder Conditionnel im si-Satz!</p>`,
    checks: [
      { q: 'Si j’avais de l’argent, je ___ (acheter) un vélo.', a: ['achèterais'] },
      { q: 'S’il pleut, nous ___ (rester) à la maison. (Futur)', a: ['resterons'] },
      { q: 'Si tu ___ (être) là, ce serait super.', a: ['étais'] },
      { q: 'Je ___ (vouloir) un croissant, s’il vous plaît. (Conditionnel)', a: ['voudrais'] },
    ],
  },
  {
    id: 'fr-adjectifs', title: 'Adjektive: Angleichung & Stellung',
    html: `
<p><b>Angleichung</b> an Genus und Numerus: un petit chat – une petit<b>e</b> maison – des petit<b>s</b> chats – des petit<b>es</b> maisons</p>
<table>
<tr><th>Endung m</th><th>f</th><th>Beispiel</th></tr>
<tr><td>-e</td><td>-e</td><td>rouge → rouge</td></tr>
<tr><td>-er</td><td>-ère</td><td>cher → chère</td></tr>
<tr><td>-eux</td><td>-euse</td><td>heureux → heureuse</td></tr>
<tr><td>-f</td><td>-ve</td><td>sportif → sportive</td></tr>
<tr><td>-en / -on</td><td>-enne / -onne</td><td>italien → italienne, bon → bonne</td></tr>
</table>
<p><b>Unregelmäßig:</b> beau/bel/belle, nouveau/nouvel/nouvelle, vieux/vieil/vieille, blanc/blanche, long/longue</p>
<p><b>Stellung:</b> meist <b>nach</b> dem Nomen (un livre intéressant). <b>Vor</b> dem Nomen stehen kurze, häufige Adjektive – Merkwort <b>BAGS</b>: <b>B</b>eauty (beau, joli), <b>A</b>ge (jeune, vieux, nouveau), <b>G</b>oodness (bon, mauvais), <b>S</b>ize (petit, grand, gros).</p>`,
    checks: [
      { q: 'une fille ___ (sportif)', a: ['sportive'] },
      { q: 'une ___ voiture (nouveau)', a: ['nouvelle'] },
      { q: 'des maisons ___ (blanc)', a: ['blanches'] },
      { q: 'un ___ arbre (beau)', a: ['bel'] },
    ],
  },
  {
    id: 'fr-relatifs', title: 'Relativpronomen qui, que, où, dont',
    html: `
<table>
<tr><th>Pronomen</th><th>Funktion</th><th>Beispiel</th></tr>
<tr><td><b>qui</b></td><td>Subjekt (danach Verb)</td><td>La fille <b>qui</b> chante est ma sœur.</td></tr>
<tr><td><b>que / qu'</b></td><td>direktes Objekt (danach Subjekt)</td><td>Le livre <b>que</b> je lis est super.</td></tr>
<tr><td><b>où</b></td><td>Ort oder Zeit</td><td>La ville <b>où</b> j'habite. Le jour <b>où</b> …</td></tr>
<tr><td><b>dont</b></td><td>ersetzt de + Nomen</td><td>Le film <b>dont</b> je parle (parler <b>de</b>)</td></tr>
</table>
<p class="tip">Trick: Folgt direkt ein Verb → <b>qui</b>. Folgt ein Subjekt (je, tu, Marie …) → <b>que</b>.</p>`,
    checks: [
      { q: "C'est le garçon ___ habite à côté.", a: ['qui'] },
      { q: 'Voilà la robe ___ j’ai achetée.', a: ['que'] },
      { q: "C'est le village ___ je suis né.", a: ['où'] },
      { q: "C'est le prof ___ je t'ai parlé.", a: ['dont'] },
    ],
  },
];
