# U & Me – Backlog

> Stand: 26.09.2026 · Grundlage: vier unabhängige Reviews (Design/UX, Technik, Inhalte & Motivation, Architektur „über 2 Jahre / mehrere Kinder“)
> Aufwand: S = bis ~1 h · M = halber Tag · L = mehr · Priorität: 🔴 hoch · 🟡 mittel · ⚪ niedrig

## Gesamteindruck

Farben, Schrift, Ton und die Grundidee (Zeitring, drei Kacheln, „Heute wichtig“) tragen. „Gebastelt“ wirkt die App an den **Rändern**: weiße Seiten bei unerwarteten Daten, leere Dashboards bei Neugeborenen und über 2 Jahren, winzige Tippziele, fehlendes App-Gerüst (Icon, Titel). Und die **Inhalte sind ungeprüft**, bei Impfungen teils veraltet.

---

## Sprint 1 – Fundament: stabil, ehrlich, aufgeräumt

**Stabilität (Bugs, alle nachgewiesen)**
- [x] 🔴 S · Gespeicherte Daten prüfen statt blind übernehmen (kaputtes/altes Profil → weiße Seite; `speicher.ts`)
- [x] 🔴 S · Notizen robust laden (`{}` → Absturz auf der U-Seite)
- [x] 🔴 S · Fehlerseite (ErrorBoundary) mit „Neu laden“ / „Angaben zurücksetzen“ statt weißer Seite
- [x] 🔴 S · Ab dem 2. Geburtstag lassen sich Angaben nicht mehr ändern (Prüfung nur beim ersten Onboarding)
- [x] 🟡 S · Neue Seite öffnet mitten im Inhalt → beim Seitenwechsel nach oben scrollen + Fokus auf Überschrift
- [x] 🟡 S · „Abbrechen“/„Speichern“ bei Angaben: sauber zur Startseite, Zurück-Knopf führt nicht ins Formular, Akzent zurücksetzen
- [x] 🟡 S · Doppelte eigene Fragen werden gemeinsam gelöscht (IDs statt Text)
- [x] 🟡 S · Errechneter Termin prüfen (max. ~18 Wochen nach Geburt; Haken ohne Datum = Fehler)
- [x] ⚪ S · `/u/xyz` zeigt still eine andere U → umleiten; Groß-/Kleinschreibung tolerieren

**Vertrauen & Daten**
- [x] 🔴 S · Datenschutzhinweis (localStorage, kein Tracking, Hosting GitHub Pages) – Impressumspflicht selbst prüfen
- [x] 🟡 S · „Alle Angaben auf diesem Gerät löschen“ (mit Bestätigung)
- [x] 🟡 S · Sicherung: Export/Import als Datei (Pflicht, bevor wir Erinnerungen sammeln)
- [x] 🟡 S · Hinweis, wenn der Browser nicht speichern darf (sonst nach Neuladen wieder Onboarding)

**Tests & Aufräumen**
- [x] 🔴 S–M · Vitest für `lib/` (Datum, Kind, nächste U, Speicher mit kaputten Daten)
- [x] 🟡 S · Inhalts-Test: JSON prüfen (Phasen lückenlos, gültige Bereiche, eindeutige IDs)
- [x] ⚪ S · Tote Exporte/CSS/Props entfernen, Version + Build-Datum in der Fußzeile

**Schnelle Design-Gewinne**
- [x] 🔴 S · Titel widerspricht Status: „Zwischen U4 und U5“ obwohl U5-Fenster läuft → „Zeit für die U5“
- [x] 🔴 S · „Nächste U“ liegt am Handy unter dem Falz → Ring kleiner, Datum weg, Nächste U höher
- [x] 🔴 S · Zeitleiste: Tippziele 21 px & U1/U2 kleben aneinander → größere Trefferflächen, Labels entzerren
- [x] 🔴 S · Kontrast vergangener U-Labels zu schwach (2,6:1) → Farbe statt Transparenz
- [x] 🔴 S · Leere Kreise vor Hinweisen sehen aus wie Checkboxen → echte Icons (Schloss, Tasche, i)
- [x] 🔴 S · Leere Kacheln („gerade nichts“) führen auf leere Seiten → nicht verlinken, ruhiger Text
- [x] 🟡 S · Seitentitel pro Seite, `<h1>` auf der Startseite
- [x] 🟡 S · Tippziele ≥ 44 px (Darstellung, Fußzeilen-Links, ×)
- [x] 🟡 S · Name aufs Dashboard („Mila · 5 Monate und 1 Woche“), „Willkommen, Mila“ am Geburtstag
- [x] 🟡 S · Texte: „In euren Kalender“, einheitliche Pillen, „normal“ vermeiden, Leerzustände ruhiger
- [x] 🟡 S · Löwe/Hund-Akzent zu ähnlich, Löwe verschwimmt mit „Heute wichtig“ → Farben nachschärfen
- [x] 🟡 S · Onboarding: Häkchen auf gewähltem Tier, Platzhalter nicht fett, Fehler am Feld markieren
- [ ] ⚪ S · Schrift-Skala auf 6 Stufen vereinheitlichen

## Außer der Reihe erledigt (26.09.)

- [x] Logo Elefantenkopf in der Kopfzeile (bleibt Logo, egal welches Tier gewählt ist)
- [x] Startbildschirm (1,5 s, wippender Elefant, Leitsatz)
- [x] Welcome-Tour beim ersten Öffnen (5 Seiten, `src/content/tour.json`), erneut über das Menü
- [x] „Ux Schritt für Schritt“ für alle 10 U (Ablauf des Praxisbesuchs, mit Quellen, eigene Fragen im Gespräch)
- [x] Auf U-Seiten per Wischen (und Leiste unten) zur vorigen/nächsten U blättern
- [x] Fehler behoben: /u/U7a war nicht erreichbar (Großschreibung)

## Guidance für Erst-Eltern (26.09., nach Brainstorming)

- [x] Die ersten 12 Wochen, Woche für Woche (`wochen.json`): typisch · was hilft · für euch – Karte auf der Startseite ersetzt in dieser Zeit „Heute wichtig“
- [x] Zu erledigen (`orga.json`): Standesamt, Krankenkasse, Kinderarzt, Steuer-ID, Elterngeld, Kindergeld, Elternzeit, Betreuungsplatz – mit Datum, abhakbar pro Kind
- [x] Für euch (`fuer-euch.json`): Baby-Blues/Wochenbett-Depression, Ansprechpartner, Elterntelefon, Telefonseelsorge, Frühe Hilfen
- [ ] 🟡 Idee: „Noch nicht geboren“-Modus ab errechnetem Termin (Kinderarzt suchen, Hebamme, Checkliste vor der Geburt)
- [ ] 🟡 Idee: nach Woche 12 monatlicher Begleiter bis zum 1. Geburtstag
- [ ] 🔴 Test mit 2–3 Familien: zwei Wochen jede gegoogelte Frage notieren lassen und mit den Inhalten abgleichen

## Sprint 2 – Inhalte absichern

- [x] 🔴 M · **Impfungen auf STIKO-Impfkalender 2026** (RSV-Prophylaxe, Rotavirus ab 6. Woche, MenB prüfen) – mit Verweis + Stand statt fester Aufzählung
- [x] 🔴 M · **Warnzeichen für alle Phasen** (erste Tage, U2–U3, U6–U7, U7) – wörtlich aus Quellen
- [x] 🔴 S · „Lauflernwagen“ → „Schiebewagen/Karton – kein Gehfrei“
- [x] 🔴 M · Quelle + Abrufdatum **pro Eintrag** (statt nur Startseite)
- [x] 🟡 M · Etappen für die ersten 10 Tage (Gewicht, Nabel, Gelbsucht, Milcheinschuss, Heultage)
- [x] 🟡 M · 2. Lebensjahr ergänzen (Nachahmen, Symbolspiel, Löffel/Becher, Mittagsschlaf) + Phase U6→U7 teilen
- [x] 🟡 S · Zahnarzt Z1–Z3 als eigene Termine in die Zeitleiste + Seite `/zahnarzt` (G-BA: Z1 6.–9., Z2 10.–20., Z3 21.–33. Lebensmonat)
- [x] 🟡 S · Beobachtungs-Checkliste klingt wie Meilenstein-Test → „Was ist euch aufgefallen?“ (offene Fragen statt Ja/Nein)
- [x] 🟡 S · Spielideen ohne Prüf-Charakter formulieren; Altersangaben nachschärfen (Lächeln, Malen, Sortieren)
- [x] 🟡 S · Entscheidung: Phasen/Warnzeichen bei Frühchen nach korrigiertem Alter
- [x] 🟡 S · U7-Beginn prüfen (Quellen: „21.–24. Lebensmonat“ vs. „1 J 9 M“) → G-BA Kinder-Richtlinie (Stand 2026): 21.–24. Lebensmonat, also ab 20 vollendeten Monaten; so steht es schon in `untersuchungen.json`. „1 J 9 M“ ist eine Vereinfachung von kindergesundheit-info.de
- [ ] 🔴 – · **Fachliche Durchsicht** (Hebamme/Kinderärztin) vor dem Teilen mit mehr Familien

## Sprint 3 – Avatar-Menü & mehrere Kinder

- [x] 🔴 M · Speicher v2: alle Daten unter einem Schlüssel, Versionsnummer, Migration ohne Datenverlust (getestet, auch Sicherungen v1)
- [x] 🔴 M · Avatar oben rechts wird Menü: Kinder wechseln, Kind hinzufügen, Angaben, Darstellung, Daten sichern/löschen, Datenschutz (Fußzeile nur noch Haftungshinweis + Quelle)
- [x] 🟡 S · Notizen & Kalender-Einträge pro Kind (Kalender-ID mit Kind)
- [x] 🟡 S · Zwillinge: Name Pflicht ab dem 2. Kind, kein Vergleich nebeneinander

## Sprint 4 – PWA: fühlt sich an wie eine App

- [x] 🔴 S · Manifest, App-Icons (192/512/maskable, Apple), Favicon – Elefantenkopf
- [x] 🔴 M · Offline nutzbar (Service Worker über `vite-plugin-pwa`, getestet mit gestopptem Server)
- [ ] ⚪ S · Sanfte Übergänge (Ring zeichnet sich ein, Tipp-Feedback) – mit „reduzierte Bewegung“

## Sprint 5 – Gemeinsame Momente (Tracking ohne Druck)

- [ ] 🔴 M · **„Haben wir gemacht“** an jeder Spielidee → optional ein Satz + Emoji → **Erinnerungsbuch** (chronologisch)
- [ ] 🟡 S · Eigene Ideen/Momente eintragen
- [ ] 🟡 S–M · Maskottchen freut sich mit (nie traurig, kein „vermisst euch“)
- [ ] ⚪ S · Sanfter Wochenrückblick (ohne Zahlen, leere Woche = entlastender Satz)

## Sprint 6 – Bis zur Einschulung (U9) · entschieden 26.09.: bis U9, ohne J1/U10/U11/J2 (nur Hinweis im Abschluss)

- [x] 🟡 S · Alter in Jahren + Monaten, zentrale Konstante „begleitet bis“
- [x] 🟡 M · U7a, U8, U9 (Inhalte aus Quelle), Zeitleiste in Lebensabschnitten (0–2 / 2–5 Jahre)
- [x] 🟡 M · Phasen 2–5 Jahre (Warnzeichen, Spielideen)
- [x] ⚪ L · Etappen 2–5 Jahre (Trotz, Sauberwerden, Kita, Laufrad, Fragealter …)
- [x] ⚪ S · Abschluss-Kachel „Nach der U9“ (J1, Zusatz-Us)

## Ideenspeicher (später)

- Impf- & Terminübersicht mit „erledigt am“ (ergänzt den gelben Impfpass)
- Fragen-Zettel fürs Wartezimmer + Notiz „Was die Ärztin gesagt hat“; Fragen abhakbar, teilen
- Fotos zu Momenten (lokal, IndexedDB) – erst nach Export/Import
- Teilen mit Partner:in ohne Server (Datei/Code, ggf. QR)
- „Für euch“: Wochenbett, Schlafmangel, Hilfe-Nummern (Elterntelefon, Frühe Hilfen)
- Themen: sicherer Schlaf, Beikost, Zähne, Unfallverhütung, Mehrsprachigkeit, Medien, Kita-Start
- Maskottchen in Leerzuständen; Desktop-Layout aufwerten

## Bewusst nicht

- Wachstums-/Gewichtskurven mit Perzentilen (Bewertung, Sorge) – höchstens freies Notizfeld
- Schlaf-, Still-, Windel-Tracker (Kontrollzwang, gibt es besser)
- Streaks, Punkte, Abzeichen, Freischalten, Ranglisten, Fortschrittsbalken
- Push-Benachrichtigungen mit Aktivitätsdruck
- KI-Chat / Symptom-Checker (Diagnose-Nähe, nicht local-first)
