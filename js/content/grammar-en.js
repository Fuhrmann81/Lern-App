// Grammatik Englisch – eigene Regel-Übersichten (Gymnasium, ca. Kl. 5–10)
// checks: q = Aufgabe (___ = Lücke), a = richtige Lösungen
export default [
  {
    id: 'en-present', title: 'Simple Present vs. Present Progressive',
    html: `
<h3>Simple Present</h3>
<p><b>Wann?</b> Gewohnheiten, Regelmäßiges, Fakten, Fahrpläne.</p>
<p><b>Bildung:</b> Infinitiv; bei <i>he/she/it</i> + <b>-s</b> („he, she, it – das s muss mit“).</p>
<ul><li>I <b>play</b> football every Sunday.</li><li>She <b>watches</b> TV. (‑es nach s, sh, ch, x, o)</li><li>He <b>studies</b>. (Konsonant + y → ‑ies)</li></ul>
<p><b>Verneinung/Frage</b> mit <i>do/does</i>: She <b>doesn't</b> play. <b>Does</b> she play?</p>
<p><b>Signalwörter:</b> always, usually, often, sometimes, never, every day, on Mondays</p>
<h3>Present Progressive</h3>
<p><b>Wann?</b> Handlung läuft <i>gerade jetzt</i> oder vorübergehend; feste Pläne in naher Zukunft.</p>
<p><b>Bildung:</b> am/is/are + Verb‑<b>ing</b>: I <b>am reading</b>. They <b>are playing</b>.</p>
<p><b>-ing-Regeln:</b> make → making (stummes e fällt weg), run → running (Konsonant verdoppelt nach kurzem betonten Vokal), lie → lying.</p>
<p><b>Signalwörter:</b> now, at the moment, look!, listen!, today, this week</p>
<p class="tip">Zustandsverben (know, like, want, believe, belong, need) stehen fast nie in der Progressive Form.</p>`,
    checks: [
      { q: 'Look! The baby ___ (sleep).', a: ['is sleeping'] },
      { q: 'My brother ___ (go) to school by bus every day.', a: ['goes'] },
      { q: '___ she ___ (like) pizza? (Frage, Simple Present)', a: ['does like', 'does she like'] },
      { q: 'I ___ (know) the answer. (kein Progressive!)', a: ['know'] },
    ],
  },
  {
    id: 'en-past', title: 'Simple Past vs. Present Perfect',
    html: `
<h3>Simple Past</h3>
<p><b>Wann?</b> Abgeschlossene Handlung zu einem <i>bestimmten</i> Zeitpunkt in der Vergangenheit.</p>
<p><b>Bildung:</b> regelmäßig + <b>-ed</b> (played, stopped, studied); unregelmäßig: 2. Form (went, saw).</p>
<p><b>Verneinung/Frage</b> mit <i>did</i> + Infinitiv: I <b>didn't go</b>. <b>Did</b> you <b>see</b> it?</p>
<p><b>Signalwörter:</b> yesterday, last week, ... ago, in 2020, when I was a child</p>
<h3>Present Perfect</h3>
<p><b>Wann?</b> Ergebnis/Bezug zur Gegenwart wichtig, Zeitpunkt unbestimmt oder Zeitraum dauert bis jetzt.</p>
<p><b>Bildung:</b> have/has + 3. Form: She <b>has finished</b>. I <b>have been</b> to London.</p>
<p><b>Signalwörter:</b> already, just, yet, ever, never, so far, since, for</p>
<table><tr><th>since</th><th>for</th></tr><tr><td>Zeitpunkt: since Monday, since 2019</td><td>Zeitraum: for two years, for ages</td></tr></table>
<p class="tip">Deutsch „Ich habe gestern … gemacht“ = <b>Simple Past</b>, weil „gestern“ ein bestimmter Zeitpunkt ist!</p>`,
    checks: [
      { q: 'We ___ (visit) our grandma last weekend.', a: ['visited'] },
      { q: 'I ___ (never / be) to Scotland.', a: ['have never been'] },
      { q: 'She has lived here ___ 2018. (since/for)', a: ['since'] },
      { q: '___ you ___ (see) the film yesterday?', a: ['did see', 'did you see'] },
    ],
  },
  {
    id: 'en-pastprog', title: 'Past Progressive & Past Perfect',
    html: `
<h3>Past Progressive</h3>
<p><b>Wann?</b> Handlung lief in der Vergangenheit gerade ab (oft: wird von einer anderen unterbrochen).</p>
<p><b>Bildung:</b> was/were + ‑ing: I <b>was reading</b> when the phone <b>rang</b>.</p>
<p><b>Signalwörter:</b> while, when, at 8 o'clock yesterday</p>
<h3>Past Perfect („Vorvergangenheit“)</h3>
<p><b>Wann?</b> Handlung lag <i>vor</i> einer anderen vergangenen Handlung.</p>
<p><b>Bildung:</b> had + 3. Form: When we arrived, the film <b>had</b> already <b>started</b>.</p>
<p><b>Signalwörter:</b> before, after, already, by the time</p>`,
    checks: [
      { q: 'While I ___ (cook), my sister was doing her homework.', a: ['was cooking'] },
      { q: 'They ___ (play) football when it started to rain.', a: ['were playing'] },
      { q: 'After she ___ (finish) her work, she went home.', a: ['had finished'] },
    ],
  },
  {
    id: 'en-future', title: 'Future: will, going to, Present Progressive',
    html: `
<table>
<tr><th>Form</th><th>Wann?</th><th>Beispiel</th></tr>
<tr><td><b>will</b> + Inf.</td><td>Vermutung, Vorhersage, spontaner Entschluss, Versprechen</td><td>I think it <b>will rain</b>. – I'<b>ll help</b> you!</td></tr>
<tr><td><b>going to</b> + Inf.</td><td>Absicht/Plan; sichere Vorhersage wegen Anzeichen</td><td>I'm <b>going to buy</b> a bike. Look at the clouds – it's <b>going to rain</b>.</td></tr>
<tr><td>Present Progressive</td><td>fest vereinbarter Termin</td><td>I'm <b>meeting</b> Tom at 5.</td></tr>
<tr><td>Simple Present</td><td>Fahrplan, Programm</td><td>The train <b>leaves</b> at 7.</td></tr>
</table>
<p><b>Signalwörter will:</b> I think, probably, maybe, perhaps, tomorrow</p>`,
    checks: [
      { q: 'Look at those black clouds! It ___ (rain). (going to)', a: ['is going to rain', "it's going to rain", 'it is going to rain'] },
      { q: 'The phone is ringing. – I ___ (answer) it! (spontan)', a: ['will answer', "i'll answer", 'i will answer'] },
      { q: 'Maybe she ___ (come) to the party. (Vermutung)', a: ['will come'] },
    ],
  },
  {
    id: 'en-if', title: 'If-Sätze (Conditional Sentences)',
    html: `
<table>
<tr><th>Typ</th><th>if-Satz</th><th>Hauptsatz</th><th>Bedeutung</th></tr>
<tr><td><b>I</b></td><td>Simple Present</td><td>will + Inf.</td><td>real/möglich</td></tr>
<tr><td><b>II</b></td><td>Simple Past</td><td>would + Inf.</td><td>unwahrscheinlich, gedacht</td></tr>
<tr><td><b>III</b></td><td>Past Perfect</td><td>would have + 3. Form</td><td>Vergangenheit, nicht mehr änderbar</td></tr>
</table>
<ul>
<li>I: If it <b>rains</b>, we <b>will stay</b> at home.</li>
<li>II: If I <b>had</b> more time, I <b>would learn</b> Spanish. (If I <b>were</b> you …)</li>
<li>III: If you <b>had studied</b>, you <b>would have passed</b> the test.</li>
</ul>
<p class="tip">Nie <i>will</i> oder <i>would</i> im if-Satz! Komma nur, wenn der if-Satz vorne steht.</p>`,
    checks: [
      { q: 'If you ___ (hurry), you will catch the bus.', a: ['hurry'] },
      { q: 'If I ___ (be) rich, I would travel around the world.', a: ['were', 'was'] },
      { q: 'If she had asked me, I ___ (help) her.', a: ['would have helped'] },
      { q: 'If we ___ (win) the lottery, we would buy a house.', a: ['won'] },
    ],
  },
  {
    id: 'en-passive', title: 'Passiv (Passive Voice)',
    html: `
<p><b>Wann?</b> Wenn die Handlung wichtiger ist als die handelnde Person (häufig in Sachtexten).</p>
<p><b>Bildung:</b> Form von <b>be</b> (in der passenden Zeit) + <b>3. Form</b>. Handelnde Person mit <b>by</b>.</p>
<table>
<tr><th>Zeit</th><th>Aktiv</th><th>Passiv</th></tr>
<tr><td>Simple Present</td><td>They build houses.</td><td>Houses <b>are built</b>.</td></tr>
<tr><td>Simple Past</td><td>They built the bridge.</td><td>The bridge <b>was built</b>.</td></tr>
<tr><td>Present Perfect</td><td>They have sold the car.</td><td>The car <b>has been sold</b>.</td></tr>
<tr><td>will-Future</td><td>They will open the shop.</td><td>The shop <b>will be opened</b>.</td></tr>
<tr><td>Modalverb</td><td>You must do it.</td><td>It <b>must be done</b>.</td></tr>
<tr><td>Progressive</td><td>They are repairing the road.</td><td>The road <b>is being repaired</b>.</td></tr>
</table>`,
    checks: [
      { q: 'English ___ (speak) all over the world. (Simple Present Passiv)', a: ['is spoken'] },
      { q: 'The window ___ (break) yesterday. (Simple Past Passiv)', a: ['was broken'] },
      { q: 'The homework must ___ (do) by Friday.', a: ['be done'] },
      { q: 'The letters ___ already ___ (send). (Present Perfect Passiv)', a: ['have been sent', 'have already been sent'] },
    ],
  },
  {
    id: 'en-reported', title: 'Indirekte Rede (Reported Speech)',
    html: `
<p>Steht das Einleitungsverb in der Vergangenheit (<i>he said, she told me</i>), rückt die Zeit <b>eine Stufe zurück</b> (backshift):</p>
<table>
<tr><th>direkte Rede</th><th>indirekte Rede</th></tr>
<tr><td>Simple Present: "I <b>am</b> tired."</td><td>Simple Past: He said (that) he <b>was</b> tired.</td></tr>
<tr><td>Present Progressive</td><td>Past Progressive</td></tr>
<tr><td>Simple Past / Present Perfect</td><td>Past Perfect</td></tr>
<tr><td>will</td><td>would</td></tr>
<tr><td>can / may</td><td>could / might</td></tr>
</table>
<p><b>Orts-/Zeitangaben:</b> now → then, today → that day, yesterday → the day before, tomorrow → the next day, here → there, this → that, ago → before</p>
<p><b>Fragen:</b> He asked <b>if/whether</b> I liked it. She asked where I <b>lived</b>. (Aussagesatz-Wortstellung, kein <i>do</i>!)</p>
<p><b>Aufforderungen:</b> She told me <b>to close</b> the door / <b>not to</b> be late.</p>`,
    checks: [
      { q: '"I like music." → She said that she ___ music.', a: ['liked'] },
      { q: '"We will come." → They said they ___ come.', a: ['would'] },
      { q: '"Do you play tennis?" → He asked ___ I played tennis.', a: ['if', 'whether'] },
      { q: '"Sit down!" → The teacher told us ___ down.', a: ['to sit'] },
    ],
  },
  {
    id: 'en-gerund', title: 'Gerund vs. Infinitive',
    html: `
<p><b>Gerund</b> (‑ing‑Form als Nomen) steht …</p>
<ul><li>nach bestimmten Verben: <i>enjoy, finish, avoid, mind, keep, miss, suggest, practise, give up</i> – I enjoy <b>reading</b>.</li>
<li>nach Präpositionen: interested <b>in learning</b>, good <b>at drawing</b>, before <b>leaving</b>, look forward <b>to seeing</b> you</li>
<li>als Subjekt: <b>Swimming</b> is fun.</li></ul>
<p><b>to-Infinitive</b> steht …</p>
<ul><li>nach <i>want, decide, hope, plan, agree, refuse, promise, learn, would like</i> – She decided <b>to stay</b>.</li>
<li>nach Adjektiven: It's easy <b>to understand</b>.</li></ul>
<p><b>Beides, mit Bedeutungsunterschied:</b> remember/forget/stop/try</p>
<ul><li>I stopped <b>smoking</b>. (aufgehört) – I stopped <b>to smoke</b>. (angehalten, um zu rauchen)</li>
<li>I remember <b>meeting</b> him. (erinnere mich daran) – Remember <b>to call</b> her! (denk daran)</li></ul>`,
    checks: [
      { q: 'I really enjoy ___ (dance).', a: ['dancing'] },
      { q: 'We decided ___ (go) to the beach.', a: ['to go'] },
      { q: 'She is good at ___ (paint).', a: ['painting'] },
      { q: "I'm looking forward to ___ (see) you.", a: ['seeing'] },
    ],
  },
  {
    id: 'en-relative', title: 'Relativsätze',
    html: `
<table>
<tr><th>Relativpronomen</th><th>für</th></tr>
<tr><td><b>who</b></td><td>Personen</td></tr>
<tr><td><b>which</b></td><td>Dinge, Tiere</td></tr>
<tr><td><b>that</b></td><td>Personen & Dinge (nur in notwendigen Relativsätzen)</td></tr>
<tr><td><b>whose</b></td><td>dessen/deren (Besitz)</td></tr>
</table>
<p><b>Notwendig</b> (defining): ohne Komma – The girl <b>who lives next door</b> is my friend.</p>
<p><b>Nicht notwendig</b> (non-defining): mit Kommas, nie <i>that</i> – My bike, <b>which is new</b>, is red.</p>
<p><b>Contact Clause:</b> Ist das Relativpronomen <i>Objekt</i>, kann es wegfallen: The book (that) <b>I read</b> was great.</p>`,
    checks: [
      { q: 'The man ___ helped us was very kind.', a: ['who', 'that'] },
      { q: 'This is the dog ___ bit me.', a: ['which', 'that'] },
      { q: 'That is the boy ___ father is a doctor.', a: ['whose'] },
    ],
  },
  {
    id: 'en-adverb', title: 'Adjektiv vs. Adverb, Steigerung',
    html: `
<p><b>Adjektiv</b> beschreibt ein Nomen (wie ist etwas?): She is a <b>careful</b> driver. / after <i>be, look, feel, seem</i>: You look <b>tired</b>.</p>
<p><b>Adverb</b> beschreibt ein Verb (wie macht jemand etwas?): She drives <b>carefully</b>.</p>
<p><b>Bildung:</b> Adjektiv + <b>-ly</b>; happy → happ<b>ily</b>; terrible → terrib<b>ly</b>; <b>Ausnahmen:</b> good → <b>well</b>, fast → fast, hard → hard, late → late</p>
<h3>Steigerung</h3>
<table>
<tr><th>einsilbig/‑y</th><th>mehrsilbig</th><th>unregelmäßig</th></tr>
<tr><td>small – small<b>er</b> – small<b>est</b><br>happy – happ<b>ier</b> – happ<b>iest</b></td><td>interesting – <b>more</b> interesting – <b>most</b> interesting</td><td>good – better – best<br>bad – worse – worst<br>much/many – more – most</td></tr>
</table>
<p>Vergleich: as big <b>as</b> / bigger <b>than</b></p>`,
    checks: [
      { q: 'He sings very ___ . (good)', a: ['well'] },
      { q: 'She answered the question ___ . (correct)', a: ['correctly'] },
      { q: 'This test was ___ than the last one. (difficult)', a: ['more difficult'] },
      { q: 'It was the ___ day of my life. (bad)', a: ['worst'] },
    ],
  },
  {
    id: 'en-modal', title: 'Modalverben & Ersatzformen',
    html: `
<table>
<tr><th>Modalverb</th><th>Bedeutung</th><th>Ersatzform (andere Zeiten)</th></tr>
<tr><td>can</td><td>können</td><td>be able to</td></tr>
<tr><td>must</td><td>müssen</td><td>have to</td></tr>
<tr><td>mustn't</td><td>nicht dürfen!</td><td>not be allowed to</td></tr>
<tr><td>needn't / don't have to</td><td>nicht müssen</td><td>not have to</td></tr>
<tr><td>may / can</td><td>dürfen</td><td>be allowed to</td></tr>
<tr><td>should</td><td>sollte</td><td>–</td></tr>
</table>
<p>Modalverben haben kein ‑s, kein <i>do</i>, und danach kommt der Infinitiv ohne <i>to</i>: She <b>can swim</b>.</p>
<p>Zukunft/Vergangenheit mit Ersatzform: I <b>will have to</b> work. She <b>was able to</b> help.</p>
<p class="tip">Falle: <b>You mustn't</b> = Du darfst nicht! – <b>You don't have to</b> = Du musst nicht.</p>`,
    checks: [
      { q: 'Yesterday I ___ (müssen) help my dad. (Ersatzform)', a: ['had to'] },
      { q: 'You ___ smoke here – it is forbidden!', a: ["mustn't", 'must not'] },
      { q: 'Tomorrow she will ___ (können) come. (Ersatzform)', a: ['be able to'] },
    ],
  },
];
