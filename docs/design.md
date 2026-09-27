# Design von U & Me

Stand: Version 0.7 · 27.09.2026. Die verbindlichen Werte stehen in `src/styles/tokens.css`; dieses Dokument erklärt, **wofür** sie da sind und welche Regeln gelten. Herkunft: `docs/claude-design/briefing.md` (Auftrag) und die Design-Kritik vom 26.09.2026.

## Grundsätze

- **Bilderbuch:** warm, rund, verspielt – Texte trotzdem klar und gut lesbar. Die Wärme kommt aus den Maskottchen und ihren Farben, nicht aus Deko.
- **Flächig:** keine Fotos, kein 3D, **keine Verläufe**, höchstens sehr weiche Schatten.
- **Beruhigen statt bewerten:** keine Ampeln, Scores, Streaks, Fortschrittsbalken für das Kind. Entwicklung immer als Spannbreite. Keine Rosa/Hellblau-Codierung.
- **Für müde Eltern am Handy, oft nachts:** Mobile first (375 px), wenig Elemente pro Screen, das Wichtigste oben, große Berührflächen.
- **Hell und dunkel gleichwertig.** Dunkel wirkt wie ein Nachtlicht, nicht wie ein invertierter Bildschirm.
- **Local-first auch im Design:** keine externen Schriften, Icons oder CDNs.

## Feste Entscheidungen

| Was | Entscheidung |
|---|---|
| Logo | immer der Elefantenkopf – unabhängig vom gewählten Maskottchen |
| Maskottchen | Löwe, Hund, Pinguin, Elefant – fertig gezeichnet, nicht verändern |
| Schrift | Nunito, selbst gehostet (`@fontsource/nunito`), Fallback `ui-rounded`/System |
| Persönlicher Akzent | Farbe des gewählten Maskottchens (`[data-maskottchen]` auf `<html>`) |

## Farben

Alle Farben als Tokens mit Rolle – **nie feste Hex-Werte in `app.css`** (Ausnahme: Weiß im grünen Haken).

| Rolle | Token | Hell | Dunkel |
|---|---|---|---|
| Seitenhintergrund | `--farbe-hintergrund` | `#FCF6EC` Creme | `#141D2B` Nachtblau |
| Karte | `--farbe-flaeche` | `#FFFDF8` | `#1D2839` |
| Text | `--farbe-text` | `#4A3428` Dunkelbraun (= Maskottchen-Umriss) | `#F5EEE3` warmes Weiß |
| Text gedämpft | `--farbe-text-gedaempft` | `#76604F` | `#B8C2CF` |
| Akzent (Elefant) | `--farbe-akzent` | `#3F5A78` | `#AFC0D4` |
| Hauptknopf | `--farbe-knopf` / `--farbe-auf-knopf` | = Akzent | gedämpfte Mischung aus Akzent und Fläche (35 %), heller Text |
| „Heute wichtig“ / beruhigend | `--farbe-beruhigend` | `#F8E4C0` Honig | `#3A3224` |
| Warnung (ruhig, kein Alarmrot) | `--farbe-warnung-*` | Rosé-Töne | gedämpfte Rosé-Töne |
| Erledigt-Haken | `--farbe-erledigt` | `#3F7D4E` | `#7CC08C` |

**Maskottchen-Akzente** (hell / dunkel): Elefant `#3F5A78` / `#AFC0D4` · Pinguin `#3E6B66` / `#8FBDB7` · Löwe `#9A5418` / `#F2C98A` · Hund `#6B5A4E` / `#D9B08F`.

**Bereichsfarben** (Alltag, Bewegung, Sprache, Miteinander) haben je eine Farbe und eine Fläche. Sie dürfen nie die einzige Unterscheidung sein – Text oder Symbol trägt immer mit (Farbenblindheit).

**Kontrast:** Text mindestens 4,5 : 1 in beiden Modi. Gemessen für den dunklen Hauptknopf: Elefant 5,8 · Pinguin 6,1 · Löwe 5,4 · Hund 6,1.

## Schrift

| Token | Größe | Wofür |
|---|---|---|
| `--groesse-xs` | 13,5 px | Beschriftungen, Pillen, Quellen, Meta – **kleinste Größe in der App** |
| `--groesse-s` | 15,5 px | Nebentext, Tipps |
| `--groesse-m` | 17 px | Grundschrift, Knöpfe |
| `--groesse-l` | 19 px | Abschnitts- und Kartentitel |
| `--groesse-xl` | 26 px | Seitentitel, große Zahlen (Datumskachel) |
| `--groesse-xxl` | 28 px | Alter im Ring, Onboarding |

Gewichte: 400 normal, 700 halbfett, 800 fett. Zeilenhöhe Text 1,5, Titel 1,25.

Bewusst feste Größen (gehören zu einem Bauteil): Schriftzug im Logo (`.wortmarke`), Kreis „U5“ (`.u-kreis-gross`), Schließen-× der Zeitreise, Senden-Knopf der Fragen, Notruf-Nummer (`.kontakt-nummer`).

## Abstände, Radien, Berührflächen

- **Abstände:** 4er-Raster, `--abstand-1` (4 px) bis `--abstand-10` (40 px). Seitenrand mobil 20 px.
- **Radien:** `--radius-s` 16 (Tipp-Box, Datumskachel) · `--radius-m` 24 (Karte) · `--radius-l` 28 (große Karte, Sprechblase) · `--radius-rund` (Knöpfe, Pillen).
- **Berührfläche:** mindestens `--beruehrflaeche-min` (48 px), Links in Fließtext mindestens 44 px hoch.

## Bauteile

| Bauteil | Klasse | Regel |
|---|---|---|
| Zeitring | `.zeitring` | Zentrum der Startseite: Maskottchen im Ring, Knopf „heute“ am Bogenende, feine Marke am Beginn des U-Fensters; darunter bis zu drei Kennzahlen (`.kennzahlen`: Tage alt im 1. Jahr · nächste U · nächster Zahnarzt-Termin). Der Ring zeigt nur **Zeit** (letzte → nächste U), nie einen Fortschritt des Kindes. Im Dunkeln eine flache, warme Scheibe dahinter („Mond“). |
| Sprechblase | `.wichtig` | Das Wichtigste des Tages direkt unter dem Ring, mit Zipfel zum Maskottchen: in den ersten 12 Wochen die Lebenswoche, danach „Heute wichtig“. Es gibt immer genau eine. |
| Zeilen-Karte | `.zeile-link` | Eine Aktion pro Karte. Sagt, **was zu tun ist** („U5-Termin machen“), nicht was schon woanders steht. |
| Kacheln | `.kachel` | Drei Einstiege (Begegnet euch, Gerade dran, Spielideen). Leere Kachel = „ruhige Zeit“, nicht verlinkt. |
| Hauptknopf | `.knopf` | Höchstens einer pro Bereich. Im Dunkeln gedämpft, damit er nachts nicht blendet. |
| Zweitknopf | `.knopf-zweit` | Umriss in Akzentfarbe, transparent. |
| Pille | `.pille` | Kurzer Status („Fenster läuft“, „in 3 Wochen“, „3 offen“). |
| U-Zeitleiste | `.u-zeitleiste` | U1–U9 durchgehend (Wurzel-Skala, damit U1–U3 nicht kleben), U-Fenster als Abschnitte, heute als Punkt, erledigte U mit grünem Haken. Keine Zahnarzt-Zeile mehr. |
| Sprung-Zoom | `.zoom` | Direkt unter der Zeitleiste: Strecke von der letzten erledigten zur nächsten offenen U. Punkte = Sprünge (unsere Etappen) und Zahnarzt-Termine (Raute), Heute-Kreis, gleicher Tag = ein Punkt mit Zahl. Führt zur Seite „Sprünge“. |
| Warnhinweis | `.zeile-warnung` | Ruhig, Rosé statt Rot; immer erreichbar. |

## Bewegung

- Nur CSS (`transition`, `@keyframes`), keine Animations-Bibliotheken. Nur `transform` und `opacity` animieren (Ausnahme: der Ring zeichnet sich einmal über `stroke-dasharray` ein).
- Dauern und Kurven als Tokens: `--dauer-tipp` 100 · `--dauer-schnell` 180 · `--dauer-menue` 220 · `--dauer-seite` 300 · `--dauer-ring` 800 ms; `--kurve-raus` (Hereinkommen), `--kurve-rein` (Hinausgehen), `--kurve-wechsel` (Zustandswechsel). Kein `ease`.
- Keine Dauer-Animationen. Alles steht im Abschnitt „Bewegung“ am Ende von `app.css` innerhalb von `prefers-reduced-motion: no-preference`.
- Muster: Antippen gibt nach (`scale(0.97–0.98)`), Hover hebt leicht an (nur bei `hover: hover`), Startseite erscheint leicht versetzt, andere Seiten blenden ein, Menü öffnet aus der Avatar-Ecke, Ring zeichnet sich ein.
- Kein Belohnungs-Feuerwerk – beim Abhaken nur ein kurzes Bestätigen der Handlung der Eltern, nie „Leistungen“ des Kindes.

## Offene Punkte

- **Dunkelmodus-Grundton:** Das Briefing wünscht „warmes Dunkelbraun statt Schwarz oder Blaugrau“; gebaut ist Nachtblau (Richtung „1b Gute-Nacht-Gespräch“ laut `tokens.css`). Die Begründung für den Wechsel ist nicht dokumentiert – bitte hier nachtragen oder den Grundton noch einmal prüfen.
- **Abstände und Radien:** In `app.css` stehen noch rund 200 feste px-Abstände und Radien außerhalb der Skala (14, 18, 20 px). Schrittweise auf Tokens umstellen.
- **Kacheln:** „Begegnet euch“ bricht um, die anderen nicht – kürzere Beschriftung oder Symbol + Text prüfen.
