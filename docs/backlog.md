# U & Me – Backlog

> Stand: 26.09.2026 · Grundlage: vier unabhängige Reviews (Design/UX, Technik, Inhalte & Motivation, Architektur „über 2 Jahre / mehrere Kinder“)
> Aufwand: S = bis ~1 h · M = halber Tag · L = mehr · Priorität: 🔴 hoch · 🟡 mittel · ⚪ niedrig

## Gesamteindruck

Farben, Schrift, Ton und die Grundidee (Zeitring, drei Kacheln, „Heute wichtig“) tragen. „Gebastelt“ wirkt die App an den **Rändern**: weiße Seiten bei unerwarteten Daten, leere Dashboards bei Neugeborenen und über 2 Jahren, winzige Tippziele, fehlendes App-Gerüst (Icon, Titel). Und die **Inhalte sind ungeprüft**, bei Impfungen teils veraltet.

---

## Sprint 1 – Fundament: stabil, ehrlich, aufgeräumt

**Stabilität (Bugs, alle nachgewiesen)**
- [ ] 🔴 S · Gespeicherte Daten prüfen statt blind übernehmen (kaputtes/altes Profil → weiße Seite; `speicher.ts`)
- [ ] 🔴 S · Notizen robust laden (`{}` → Absturz auf der U-Seite)
- [ ] 🔴 S · Fehlerseite (ErrorBoundary) mit „Neu laden“ / „Angaben zurücksetzen“ statt weißer Seite
- [ ] 🔴 S · Ab dem 2. Geburtstag lassen sich Angaben nicht mehr ändern (Prüfung nur beim ersten Onboarding)
- [ ] 🟡 S · Neue Seite öffnet mitten im Inhalt → beim Seitenwechsel nach oben scrollen + Fokus auf Überschrift
- [ ] 🟡 S · „Abbrechen“/„Speichern“ bei Angaben: sauber zur Startseite, Zurück-Knopf führt nicht ins Formular, Akzent zurücksetzen
- [ ] 🟡 S · Doppelte eigene Fragen werden gemeinsam gelöscht (IDs statt Text)
- [ ] 🟡 S · Errechneter Termin prüfen (max. ~18 Wochen nach Geburt; Haken ohne Datum = Fehler)
- [ ] ⚪ S · `/u/xyz` zeigt still eine andere U → umleiten; Groß-/Kleinschreibung tolerieren

**Vertrauen & Daten**
- [ ] 🔴 S · Datenschutzhinweis (localStorage, kein Tracking, Hosting GitHub Pages) – Impressumspflicht selbst prüfen
- [ ] 🟡 S · „Alle Angaben auf diesem Gerät löschen“ (mit Bestätigung)
- [ ] 🟡 S · Sicherung: Export/Import als Datei (Pflicht, bevor wir Erinnerungen sammeln)
- [ ] 🟡 S · Hinweis, wenn der Browser nicht speichern darf (sonst nach Neuladen wieder Onboarding)

**Tests & Aufräumen**
- [ ] 🔴 S–M · Vitest für `lib/` (Datum, Kind, nächste U, Speicher mit kaputten Daten)
- [ ] 🟡 S · Inhalts-Test: JSON prüfen (Phasen lückenlos, gültige Bereiche, eindeutige IDs)
- [ ] ⚪ S · Tote Exporte/CSS/Props entfernen, Version + Build-Datum in der Fußzeile

**Schnelle Design-Gewinne**
- [ ] 🔴 S · Titel widerspricht Status: „Zwischen U4 und U5“ obwohl U5-Fenster läuft → „Zeit für die U5“
- [ ] 🔴 S · „Nächste U“ liegt am Handy unter dem Falz → Ring kleiner, Datum weg, Nächste U höher
- [ ] 🔴 S · Zeitleiste: Tippziele 21 px & U1/U2 kleben aneinander → größere Trefferflächen, Labels entzerren
- [ ] 🔴 S · Kontrast vergangener U-Labels zu schwach (2,6:1) → Farbe statt Transparenz
- [ ] 🔴 S · Leere Kreise vor Hinweisen sehen aus wie Checkboxen → echte Icons (Schloss, Tasche, i)
- [ ] 🔴 S · Leere Kacheln („gerade nichts“) führen auf leere Seiten → nicht verlinken, ruhiger Text
- [ ] 🟡 S · Seitentitel pro Seite, `<h1>` auf der Startseite
- [ ] 🟡 S · Tippziele ≥ 44 px (Darstellung, Fußzeilen-Links, ×)
- [ ] 🟡 S · Name aufs Dashboard („Mila · 5 Monate und 1 Woche“), „Willkommen, Mila“ am Geburtstag
- [ ] 🟡 S · Texte: „In euren Kalender“, einheitliche Pillen, „normal“ vermeiden, Leerzustände ruhiger
- [ ] 🟡 S · Löwe/Hund-Akzent zu ähnlich, Löwe verschwimmt mit „Heute wichtig“ → Farben nachschärfen
- [ ] 🟡 S · Onboarding: Häkchen auf gewähltem Tier, Platzhalter nicht fett, Fehler am Feld markieren
- [ ] ⚪ S · Schrift-Skala auf 6 Stufen vereinheitlichen

## Sprint 2 – Inhalte absichern

- [ ] 🔴 M · **Impfungen auf STIKO-Impfkalender 2026** (RSV-Prophylaxe, Rotavirus ab 6. Woche, MenB prüfen) – mit Verweis + Stand statt fester Aufzählung
- [ ] 🔴 M · **Warnzeichen für alle Phasen** (erste Tage, U2–U3, U6–U7, U7) – wörtlich aus Quellen
- [ ] 🔴 S · „Lauflernwagen“ → „Schiebewagen/Karton – kein Gehfrei“
- [ ] 🔴 M · Quelle + Abrufdatum **pro Eintrag** (statt nur Startseite)
- [ ] 🟡 M · Etappen für die ersten 10 Tage (Gewicht, Nabel, Gelbsucht, Milcheinschuss, Heultage)
- [ ] 🟡 M · 2. Lebensjahr ergänzen (Nachahmen, Symbolspiel, Löffel/Becher, Mittagsschlaf) + Phase U6→U7 teilen
- [ ] 🟡 S · Zahnarzt Z1–Z3 als eigene Termine in die Zeitleiste
- [ ] 🟡 S · Beobachtungs-Checkliste klingt wie Meilenstein-Test → „Was ist euch aufgefallen?“
- [ ] 🟡 S · Spielideen ohne Prüf-Charakter formulieren; Altersangaben nachschärfen (Lächeln, Malen, Sortieren)
- [ ] 🟡 S · Entscheidung: Phasen/Warnzeichen bei Frühchen nach korrigiertem Alter
- [ ] 🟡 S · U7-Beginn prüfen (Quellen: „21.–24. Lebensmonat“ vs. „1 J 9 M“)
- [ ] 🔴 – · **Fachliche Durchsicht** (Hebamme/Kinderärztin) vor dem Teilen mit mehr Familien

## Sprint 3 – Avatar-Menü & mehrere Kinder

- [ ] 🔴 M · Speicher v2: alle Daten unter einem Schlüssel, Versionsnummer, Migration ohne Datenverlust
- [ ] 🔴 M · Avatar oben rechts wird Menü: Kinder wechseln, Kind hinzufügen, Angaben, Darstellung, Daten sichern/löschen, Datenschutz (Fußzeile nur noch Haftungshinweis + Quelle)
- [ ] 🟡 S · Notizen & Kalender-Einträge pro Kind (Kalender-ID mit Kind)
- [ ] 🟡 S · Zwillinge: Name Pflicht ab dem 2. Kind, kein Vergleich nebeneinander

## Sprint 4 – PWA: fühlt sich an wie eine App

- [ ] 🔴 M · Manifest, App-Icons (192/512/maskable, Apple), Vollbild, offline nutzbar
- [ ] ⚪ S · Sanfte Übergänge (Ring zeichnet sich ein, Tipp-Feedback) – mit „reduzierte Bewegung“

## Sprint 5 – Gemeinsame Momente (Tracking ohne Druck)

- [ ] 🔴 M · **„Haben wir gemacht“** an jeder Spielidee → optional ein Satz + Emoji → **Erinnerungsbuch** (chronologisch)
- [ ] 🟡 S · Eigene Ideen/Momente eintragen
- [ ] 🟡 S–M · Maskottchen freut sich mit (nie traurig, kein „vermisst euch“)
- [ ] ⚪ S · Sanfter Wochenrückblick (ohne Zahlen, leere Woche = entlastender Satz)

## Sprint 6 – Bis zur Einschulung (U9)

- [ ] 🟡 S · Alter in Jahren + Monaten, zentrale Konstante „begleitet bis“
- [ ] 🟡 M · U7a, U8, U9 (Inhalte aus Quelle), Zeitleiste in Lebensabschnitten (0–2 / 2–5 Jahre)
- [ ] 🟡 M · Phasen 2–5 Jahre (Warnzeichen, Spielideen)
- [ ] ⚪ L · Etappen 2–5 Jahre (Trotz, Sauberwerden, Kita, Laufrad, Fragealter …)
- [ ] ⚪ S · Abschluss-Kachel „Nach der U9“ (J1, Zusatz-Us)

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
