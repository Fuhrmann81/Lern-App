// Aussprache-Trainer (Englisch, Französisch)
import { $, $$, esc, toast } from '../ui.js';
import * as S from '../store.js';
import { route, go } from '../nav.js';
import * as SP from '../speech.js';
import { ttsLang } from './area.js';
import { celebrate } from '../app.js';

const { state } = S;

route('/speak/:id', ({ id }) => {
  const a = S.area(id); if (!a) return go('/home', true);
  const lang = ttsLang(a);
  if (!lang) return go(`/area/${id}`, true);
  const units = S.unitsOf(id);
  const canRec = SP.recordAvailable(), canSR = SP.recognitionAvailable();
  return {
    title: 'Aussprache', sub: a.name, back: `/area/${id}`, color: a.color,
    html: `
    <select class="input" id="unit"><option value="">Alle Units</option>${units.map((u) => `<option value="${u.id}">${esc(u.name)}</option>`).join('')}</select>
    <div id="card"></div>
    <h2 class="sec">Eigenen Text vorlesen lassen</h2>
    <div class="card"><textarea class="input" id="free" rows="2" placeholder="${a.key === 'fr' ? 'Bonjour, je m’appelle …' : 'Hello, my name is …'}"></textarea>
      <div class="row"><button class="btn" id="free-say">🔊 Vorlesen</button><button class="btn" id="free-slow">🐢 Langsam</button></div></div>
    ${!SP.ttsAvailable() ? '<p class="hint">Vorlesen wird von diesem Browser nicht unterstützt.</p>' : ''}
    ${!canSR ? '<p class="hint">Die automatische Sprechprüfung ist in diesem Browser nicht verfügbar – nutze „Aufnehmen & Vergleichen“.</p>' : ''}`,
    mount(root) {
      let list = [], idx = 0, recUrl = null;
      const load = () => {
        const u = $('#unit', root).value;
        list = S.vocabOf(id, u || undefined);
        idx = 0; draw();
      };
      const rate = () => state.profile.settings.rate;
      const draw = () => {
        const c = $('#card', root);
        if (!list.length) { c.innerHTML = '<div class="empty">Keine Vokabeln in dieser Auswahl.</div>'; return; }
        const v = list[idx];
        c.innerHTML = `
          <div class="qcard speak">
            <div class="qmeta">${idx + 1} / ${list.length}</div>
            <div class="qprompt">${esc(v.term)}</div>
            ${v.phonetic ? `<div class="qhint">[${esc(v.phonetic)}]</div>` : ''}
            <div class="hint">${esc(v.translation)}</div>
            ${v.example ? `<div class="hint"><i>${esc(v.example)}</i></div>` : ''}
          </div>
          <div class="speak-btns">
            <button class="btn big" id="say">🔊 Anhören</button><button class="btn big" id="slow">🐢 Langsam</button>
            ${v.example ? '<button class="btn" id="ex">🔊 Beispielsatz</button>' : ''}
          </div>
          ${canRec ? `<div class="speak-btns"><button class="btn big" id="rec">🎙️ Aufnehmen</button><button class="btn big" id="play" ${recUrl ? '' : 'disabled'}>▶︎ Meine Aufnahme</button></div>` : ''}
          ${canSR ? '<button class="btn primary big block" id="check">✓ Aussprache prüfen</button>' : ''}
          <div id="sr"></div>
          <div class="row between"><button class="btn" id="prev">‹ Zurück</button><button class="btn" id="next">Weiter ›</button></div>`;
        $('#say', c).onclick = () => SP.speak(v.term, lang, rate());
        $('#slow', c).onclick = () => SP.speak(v.term, lang, Math.max(0.4, rate() - 0.35));
        $('#ex', c) && ($('#ex', c).onclick = () => SP.speak(v.example, lang, rate()));
        $('#prev', c).onclick = () => { idx = (idx - 1 + list.length) % list.length; recUrl = null; draw(); };
        $('#next', c).onclick = () => { idx = (idx + 1) % list.length; recUrl = null; draw(); };
        const rec = $('#rec', c);
        if (rec) rec.onclick = async () => {
          if (SP.isRecording()) {
            recUrl = await SP.stopRecording(); rec.textContent = '🎙️ Aufnehmen'; rec.classList.remove('rec');
            $('#play', c).disabled = false;
            // direkt vergleichen: Original, dann eigene Aufnahme
            await SP.speak(v.term, lang, rate());
            new Audio(recUrl).play();
          } else {
            try { await SP.startRecording(); rec.textContent = '⏹ Stopp'; rec.classList.add('rec'); } catch (e) { toast('Kein Zugriff aufs Mikrofon – bitte in den Einstellungen erlauben'); }
          }
        };
        const play = $('#play', c);
        if (play) play.onclick = () => recUrl && new Audio(recUrl).play();
        const chk = $('#check', c);
        if (chk) chk.onclick = async () => {
          const out = $('#sr', c);
          out.innerHTML = '<p class="hint center">🎙️ Sprich jetzt …</p>';
          try {
            const alts = await SP.listen(lang);
            if (!alts.length) { out.innerHTML = '<p class="hint center">Nichts verstanden – nochmal versuchen.</p>'; return; }
            const best = alts.map((t) => ({ t, s: SP.similarity(v.term.replace(/^to /, ''), t) })).sort((x, y) => y.s - x.s)[0];
            const pct = Math.round(best.s * 100);
            const ok = pct >= 80;
            out.innerHTML = `<div class="qres ${ok ? 'ok' : pct >= 55 ? '' : 'bad'}"><div>${ok ? '✓ Sehr gut verstanden!' : pct >= 55 ? '≈ Fast – nochmal anhören und wiederholen' : '✗ Noch nicht ganz'}</div><div class="hint">Verstanden: „${esc(best.t)}“ (${pct}%)</div></div>`;
            if (await S.recordActivity(1)) celebrate();
          } catch (e) {
            out.innerHTML = `<p class="hint center">Spracherkennung nicht möglich (${esc(e.message)}). Tipp: „Aufnehmen & Vergleichen“ nutzen.</p>`;
          }
        };
      };
      $('#unit', root).addEventListener('change', load);
      $('#free-say', root).onclick = () => SP.speak($('#free', root).value, lang, rate());
      $('#free-slow', root).onclick = () => SP.speak($('#free', root).value, lang, Math.max(0.4, rate() - 0.35));
      load();
    },
  };
});
