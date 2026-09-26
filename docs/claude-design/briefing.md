# Design-Briefing: „U & Me“

> Für Claude Design · Stand: 26.09.2026
> Beigelegt: Ordner `maskottchen/` mit den fertigen Maskottchen (SVG + PNG)

## Was ist das?
Eine mobile Web-App, die Eltern in den ersten zwei Lebensjahren ihres Kindes zwischen den U-Untersuchungen (Vorsorgeuntersuchungen U1–U7 in Deutschland) begleitet. Man gibt einmal das Geburtsdatum ein, wählt ein Maskottchen und sieht dann:
1. „Du bist hier“: welche Entwicklung in der aktuellen Phase typisch ist, immer als Spannbreite („zwischen 4 und 7 Monaten“), nie als Stichtag.
2. „Nächste U“: wann die nächste Untersuchung ansteht, was dort passiert und wie man sich vorbereiten kann.

Name: „U & Me“, „U“ wie U-Untersuchung, gelesen wie „you and me“, also Eltern und Kind.

## Für wen?
Eltern von Babys und Kleinkindern (0–2 Jahre), oft übermüdet und manchmal verunsichert. Die App wird im Freundeskreis geteilt und ist kein kommerzielles Produkt.

## Nutzungssituation
- Fast ausschließlich auf dem Handy, oft mit einer Hand (das Baby auf dem anderen Arm).
- Häufig nachts oder im Halbdunkel, etwa beim Füttern. Ein Dunkelmodus ist deshalb Pflicht und soll warm wirken (wie ein Nachtlicht), nicht kalt invertiert.
- Kurze Momente: öffnen, kurz lesen, beruhigt schließen.

## Die Maskottchen sind fertig. Bitte nicht neu zeichnen.
Im Ordner `maskottchen/` liegen vier Tierbabys, zwischen denen Eltern beim Start wählen:

| Datei | Tier | Kleine Geschichte |
|---|---|---|
| `loewe` | Löwenbaby | Im Rudel packen alle mit an, die Löwinnen säugen auch die Jungen der anderen |
| `hund` | Hundebaby | Der treue Begleiter |
| `pinguin` | Pinguinbaby | Beim Kaiserpinguin brütet der Papa das Ei aus |
| `elefant` | Elefantenbaby | Die ganze Herde zieht die Kleinen groß |

Pro Tier gibt es:
- `<tier>.svg / .png`: Ganzkörper, freigestellt (transparenter Hintergrund)
- `<tier>-avatar.svg / .png`: quadratischer Kopfausschnitt, gedacht für einen **runden** Avatar (border-radius: 50 %)
- `alle-tiere.svg / .png`: alle vier nebeneinander

**Das Design der App soll sich an den Maskottchen orientieren**: an ihren Farben, ihren weichen runden Formen und ihrem dunkelbraunen Umriss.

### Farben aus den Maskottchen
| Farbe | Hex | Vorkommen |
|---|---|---|
| Dunkelbraun | `#4A3428` | Umrisse, Augen |
| Creme | `#FBF3E6` | Hund, Bäuche, Augenglanz |
| Honig | `#F2C98A` | Löwe |
| Ocker | `#D9A441` | Löwenmähne, Schnäbel, Pfoten |
| Haselnuss | `#8A5A3C` | Hundeohren, Fleck |
| Petrol | `#5E8F8A` | Pinguin |
| Taubenblau | `#AFC0D4` | Elefant |
| Rosé | `#F2A9A0` | Bäckchen, Ohren innen |

Diese Farben bilden die Grundlage für die App-Palette. Die Palette darf ergänzt werden, etwa um Hintergründe, Flächen oder eine Akzentfarbe für Buttons. Eine Idee: Die gewählte Maskottchen-Farbe könnte als persönliche Akzentfarbe durch die App tragen.

## Stilrichtung: „Bilderbuch“
Warm, verspielt, rund, wie ein gutes modernes Kinderbuch, aber für Erwachsene lesbar und ernst zu nehmen.
- Cremiger, warmer Grund statt reinem Weiß
- Weiche, großzügige Rundungen bei Karten und Buttons, passend zu den Maskottchen
- Flächig: keine Fotos, kein 3D, keine Verläufe, höchstens sehr weiche Schatten
- Die Wärme kommt aus Farben und Maskottchen, die Texte bleiben klar und gut lesbar
- Dunkelmodus: warmes Dunkelbraun statt Schwarz oder Blaugrau. Die Maskottchen funktionieren dank ihrer Umrisse auch auf dunklem Grund.

## Bitte vermeiden
- Klischee-Babyfarben (Rosa/Hellblau) und Gender-Codierung
- Stockfotos von Babys
- Ampeln, Punktzahlen, Fortschrittsbalken oder alles, was das Kind bewertet oder mit anderen vergleicht
- Gamification (Abzeichen, Streaks)
- Dramatik oder Alarmrot (außer für echte Warnhinweise, und auch dort ruhig)
- Überladene Screens, zu viel Deko auf Kosten der Lesbarkeit

## Design-Prinzipien
- Mobile first (Referenzbreite 375 px), großzügige Touch-Flächen, Kernaktionen mit dem Daumen erreichbar
- Sehr gut lesbar: große Grundschrift, hohe Kontraste (WCAG AA), auch im Dunkelmodus
- Klare Hierarchie, wenig Elemente pro Screen
- Hell- und Dunkelmodus gleichwertig gestaltet
- Keine externen Schriftdienste nötig (System-Fonts oder eine selbst gehostete Schrift)

## Aufgabe
Bitte gestalte mit den beigelegten Maskottchen:
1. **Onboarding:** kurze Begrüßung, Auswahl des Maskottchens (vier Karten mit den Tieren), Eingabe des Geburtsdatums (optional der Name des Kindes), Hinweis, dass alle Daten nur auf dem Gerät bleiben
2. **Startseite „Du bist hier“:** Maskottchen, Alter des Kindes, aktuelle Phase, typische Entwicklung in 3–4 Bereichen, „Wann ärztlich abklären“, Vorschau auf die nächste U
3. **Detailseite „Nächste U“:** Zeitfenster, was untersucht wird, Beobachtungs-Checkliste zum Abhaken, Fragen an die Kinderarztpraxis
4. **Hinweis-Komponenten:** Hinweis für Frühgeborene (korrigiertes Alter), allgemeiner Hinweis „ersetzt keine ärztliche Beratung“, Quellenangabe pro Inhalt

Alle Screens in Hell und Dunkel.

Zusätzlich bitte eine Übersicht der Design-Grundlagen (Design Tokens):
- Farbpalette hell und dunkel, mit Rollen (Hintergrund, Fläche, Text, Text gedämpft, Akzent, Hinweis, Warnung)
- Schriften, Größen, Zeilenhöhen
- Abstände, Eckenradien
- Komponenten: Karten, Buttons, Eingabefeld, Checkliste, Hinweisboxen, Avatar

**Wichtig für die Übergabe:** Die App wird mit React umgesetzt. Bitte die Tokens als **CSS-Variablen** ausgeben (z. B. `--farbe-hintergrund: #...`), jeweils für Hell und Dunkel.

## Beispielinhalte (Platzhalter, fachlich noch nicht geprüft)
Kind: Mila, 5 Monate und 1 Woche, Maskottchen: Elefantenbaby

Phase: „Zwischen U4 und U5“ (ca. 4.–6. Monat)
- Bewegung: dreht sich vom Rücken auf den Bauch (meist zwischen 4 und 7 Monaten); greift gezielt nach Spielzeug
- Sprache und Laute: lacht laut, brabbelt Silbenketten
- Miteinander: erkennt vertraute Gesichter, fremdelt manchmal erstmals
- Schlafen und Essen: Schlafrhythmus wird oft regelmäßiger; Beikost kann ab dem 5.–7. Monat Thema werden
- Ärztlich abklären, wenn: das Kind nicht auf Geräusche reagiert, nicht versucht zu greifen oder Fähigkeiten wieder verliert

Nächste U: U5, 6.–7. Lebensmonat (in ca. 4 Wochen)
- Beobachtungs-Checkliste: Dreht sich Mila? Greift sie mit beiden Händen? Wie reagiert sie auf Stimmen?
- Mögliche Fragen: „Wann und wie mit Beikost starten?“, „Ist unser Schlafrhythmus normal?“

Quelle: kindergesundheit-info.de, Stand 09/2026
