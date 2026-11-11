# Lern App

Lernhilfe für Schule und Studium – Vokabeln, Lernzettel, Grammatik und Aussprache.
Läuft im Browser und lässt sich auf iPhone/iPad wie eine App installieren.
**Alle Lerndaten bleiben auf dem jeweiligen Gerät** – das Repository enthält nur den App-Code.

## Funktionen

| Bereich | Was drin ist |
|---|---|
| **Profile** | Ein Profil pro Kind (Vorlage *Schule* oder *Medizinstudium*), optional mit PIN |
| **Gliederung** | Bereich (Sprache/Fach) → Lehrwerk → Unit/Lektion/Thema → Vokabeln & Lernzettel |
| **Sprachen** | Englisch, Französisch, Latein, Medizinische Terminologie – jeweils mit eigenen Feldern (z. B. Genus, Genitiv, Stammformen) |
| **Fächer** | Frei anlegbar (Biologie, Anatomie, Physiologie …) mit Begriffen und Lernzetteln |
| **Wörterbuch** | Durchsuchbar, mit Formentabellen (Latein) und Links zu dict.cc, Langenscheidt, Wiktionary, DocCheck |
| **Vokabelabfrage** | Karteikasten mit 5 Fächern, Eintippen / Karteikarte / Auswahl, beide Richtungen, Akzent-Toleranz |
| **Lernzettel** | Editor mit Überschriften, Listen, Bildern (beschriften mit Pfeil, Stift, Text), Text aus Foto |
| **Lernzettel-Abfrage** | Markierte Begriffe werden zu Lückentexten + eigene Frage-Karten |
| **Grammatik** | Regel-Übersichten mit Mini-Übungen (EN 11, FR 12, LA 11, Med 6 Themen) |
| **Trainer** | EN: unregelmäßige Verben, 11 Zeitformen · FR: Konjugation (8 Zeiten, 45 Verben) · LA: Formentrainer (bilden, bestimmen, Tabellen) · Med: Plural & Adjektiv-Angleichung |
| **Aussprache** | Vorlesen (EN/FR, iOS-Stimmen), Aufnehmen & Vergleichen, Sprechprüfung (wo der Browser es kann) |
| **Eingabe** | Tippen, Liste einfügen, CSV/Quizlet/Anki-Import, Foto → Text (Texterkennung auf dem Gerät) |
| **Motivation** | Tagesziel, Serie (🔥), Wochenübersicht, Fortschritt pro Unit |
| **Daten** | Backup exportieren/wiederherstellen, Unit teilen, Drucken/PDF, Ideen-Sammlung |

## Einrichtung (einmalig)

1. Im Repository auf **Settings → Pages** gehen.
2. Bei *Build and deployment*: **Source = Deploy from a branch**, **Branch = `main`**, Ordner **`/ (root)`** → *Save*.
3. Nach 1–2 Minuten erscheint oben der Link, z. B. `https://fuhrmann81.github.io/Lern-App/`.
4. Den Link nur den Kindern geben (er ist nirgends verlinkt, Suchmaschinen sind ausgeschlossen).

## Auf iPhone / iPad installieren

1. Link in **Safari** öffnen.
2. Teilen-Symbol → **„Zum Home-Bildschirm“**.
3. App vom Home-Bildschirm starten und Profil anlegen.

> Wichtig: Die App immer vom Home-Bildschirm starten. Dort sind die Daten besser vor dem automatischen Aufräumen durch iOS geschützt.

## iPhone ↔ iPad (Testphase)

Es gibt noch keinen automatischen Abgleich. So geht's:

- **Mehr → Backup exportieren** → per AirDrop oder in „Dateien“/iCloud Drive speichern
- Auf dem anderen Gerät: **Mehr → Datei importieren** (oder auf dem Startbildschirm „Backup wiederherstellen“)

Am einfachsten lernt jedes Kind in der Testphase hauptsächlich auf **einem** Gerät. Die App erinnert nach 7 Tagen an ein Backup.

## Updates

Neue Versionen werden einfach ins Repository gepusht. Beim nächsten Öffnen erscheint „Neue Version verfügbar → Aktualisieren“. Bei jeder Änderung `VERSION` in `sw.js` erhöhen.

## Hinweise

- Texterkennung lädt beim ersten Gebrauch Daten aus dem Internet (danach offline). Gedruckter Text klappt gut, Handschrift weniger.
- Latein hat keine Vorlese-Stimme – dafür gibt es den Formentrainer.
- Die Sprechprüfung nutzt die Spracherkennung von Safari. Funktioniert sie nicht, „Aufnehmen & Vergleichen“ nutzen.
- Bessere iOS-Stimmen: Einstellungen → Bedienungshilfen → Gesprochene Inhalte → Stimmen.
- Inhalte aus Schulbüchern (Vokabellisten) sind nicht enthalten und werden nur auf dem eigenen Gerät gespeichert.

## Geplant (Version 2)

- Automatischer Abgleich zwischen Geräten und echter Zugangsschutz (Cloudflare)
- KI-Funktionen: bessere Handschrift-Erkennung, Fragen aus Lernzetteln erzeugen, Wörter nachschlagen
- Ideen der Kinder aus der Funktion „Ideen & Wünsche“

## Technik

Reines HTML/CSS/JavaScript ohne Build-Schritt. Daten in IndexedDB, Offline per Service Worker, Texterkennung mit Tesseract.js.
