# Handoff: U & Me – Begleiter zwischen den U-Untersuchungen (MVP, Richtung 1b)

## Overview
Mobile-first Web-App/PWA für Eltern von Kindern (0–2 J.) zwischen den U-Untersuchungen U1–U7. Einmal Geburtsdatum eingeben, Maskottchen wählen → Startseite „Heute / Du bist hier“, Detailseite „Nächste U“, Zeitstrahl „Euer Weg“. Emotionaler Kern: beruhigen („Das ist gerade häufig, und darauf könnt ihr achten“). Vollständiges Briefing inkl. Inhalte: `briefing.md`.

## About the Design Files
Die `.dc.html`-Dateien sind **Design-Referenzen in HTML** (im Browser öffnen, `support.js` muss daneben liegen) – kein Produktionscode. Aufgabe: die Designs **in React neu umsetzen** (Vorschlag: Vite + React + vite-plugin-pwa, CSS mit den Variablen aus `tokens.css`, keine UI-Library nötig). In den Referenzen heißen die Variablen kurz (`--bg`, `--ink` …); `tokens.css` enthält dieselben Werte mit sprechenden Namen (`--farbe-hintergrund` …) – im Code bitte `tokens.css` verwenden. Mapping siehe Abschnitt „Design Tokens“.

## Fidelity
**High-fidelity.** Farben, Typo, Abstände, Radien sind final. Pixelgenau umsetzen. Inhalte sind Platzhalter („Entwurf – noch nicht fachlich geprüft“ muss sichtbar bleiben).

## Plattform-Regeln
- Mobile first, Referenzbreite 375 px. Ab ~900 px zweispaltiges Desktop-Layout (max. Inhaltsbreite 1120 px).
- Keine festen Viewport-Höhen (Browser-Adressleiste!). `100dvh` höchstens für Mindesthöhen.
- Schwebende Nav unten: `position: fixed; bottom: calc(20px + env(safe-area-inset-bottom))`, links/rechts 24 px. Seiteninhalt bekommt unten 110 px Padding.
- Touch-Flächen ≥ 48 px. Keine Gesten als einziger Weg.
- Schrift Nunito **selbst hosten** (400/600/700/800), kein Google-Fonts-Request. Fallback `ui-rounded, system-ui`.
- Hell/Dunkel: Systemeinstellung (`prefers-color-scheme`) + manueller Override über `<html data-theme="hell|dunkel">`.
- Persönlicher Akzent: `<html data-maskottchen="elefant|loewe|pinguin|hund">` (Werte in `tokens.css`).
- Alle Daten nur lokal (localStorage). Kein Backend, kein Tracking.

## Screens / Views
Alle in `UundMe MVP.dc.html`, jeweils Hell + Dunkel.

### 2·0 Heute / Du bist hier (mobil)
Reihenfolge von oben:
1. Kopfzeile: Wortmarke „U & Me“ (16 px/800) links, Chip „Entwurf“ (12.5 px, 1.5 px dashed `--farbe-linie`, radius rund) rechts. Padding 8 px 20 px.
2. Begrüßung: Avatar 72 px (Kreis, 2.5 px Umriss `--farbe-umriss`, Hintergrund `--farbe-akzent-flaeche`, Bild `maskottchen/<tier>-avatar.png` cover) + Sprechblase (`--farbe-akzent-flaeche`, radius 26/26/26/8, padding 16/18): „Hallo!“ 15 px/700 gedämpft, darunter „Mila ist heute **5 Monate und 1 Woche** alt.“ 19 px/700, Zeilenhöhe 1.35. Ohne Namen: „Euer Kind ist heute …“.
3. Karte „Du bist hier“ (volle Breite, Fläche, 1.5 px Linie, radius 26, padding 16/18): Titel „Du bist hier: zwischen U4 und U5“ 17 px/800. Darunter ein Wegstück, 52 px hoch: gestrichelte Linie (3 px, 8 an / 6 aus, `--farbe-linie-kraeftig`), links Kreis 36 px „U4“ (Fläche 2, gedämpft), rechts Kreis 36 px „U5“ (Akzent, Text auf Akzent). Das laufende U-Fenster ist als 15 px hohe Pille in `--farbe-akzent-flaeche` hinterlegt. Avatar 52 px an der relativen Position des heutigen Datums. Fußzeile 13.5 px gedämpft: „U4 im Sommer“ / „U5-Fenster läuft bis 18. Nov.“
4. **„Was euch gerade begegnen kann“** (22 px/800): pro Eintrag eine Sprechblasen-Karte in `--farbe-beruhigend` (radius 28/28/28/8, padding 18/20). Meta „Alltag · meist mit 4–7 Monaten“ 13.5 px/700 `--farbe-beruhigend-text`, Titel 20 px/800, Text 17 px, dann gestrichelter Trenner (1.5 px `--farbe-beruhigend-linie`) + „**Darauf könnt ihr achten:** …“ 15.5 px.
5. „Gerade dran“ (20 px/800): Karten (Fläche, 1.5 px Linie, radius 24, padding 18). Bereichs-Pille (z. B. „Bewegung“, Hintergrund `--farbe-bewegung-flaeche`, 13 px/800) + Spannbreite 13.5 px gedämpft, Titel 18 px/800, Text, optional Tipp-Box (`--farbe-hinweis`, radius 18, padding 12/14, 15.5 px, Punkt 22 px in Bereichsfarbe; bei Sicherheitshinweis Punkt in `--farbe-warnung-punkt`).
6. „Als Nächstes, irgendwann“: 3 Chips (Fläche, 1.5 px Linie, radius rund, padding 8/14): **Titel** + „6–10 M.“ gedämpft. Keine Reihenfolge-Nummern.
7. Warnhinweis „Nicht bis zur nächsten U warten, wenn …“: Karte Fläche, 1.5 px `--farbe-warnung-linie`, radius 24, „i“-Kreis 34 px (`--farbe-warnung-flaeche` / `--farbe-warnung-text`). Ruhig, kein Rot.
8. Vorschau nächste U: Karte mit weichem Schatten, „Nächste U: U5“ + Pille „Zeitfenster läuft“, zwei Datumskacheln (Fläche 2, radius 18, Tag 26 px/800), Link „Was bei der U5 passiert →“ (Akzent-Text, 800).
9. Fußnoten 13.5 px gedämpft: Quelle, Frühgeboren-Link, „ersetzt keine ärztliche Beratung“.
10. Schwebende Nav (s. u.), „Heute“ aktiv.

### 2·1 Onboarding (2 Schritte)
- Schritt 1: „Schritt 1 von 2“ als Text (kein Balken). H1 „Schön, dass ihr da seid.“ 28 px/800. „Wer begleitet euch?“ → 2×2-Grid, Gap 12. Karte: radius 24, padding 10, Bild 100 px hoch (Ganzkörper-PNG, contain), Name 16.5 px/800, Geschichte 13.5 px gedämpft. Ausgewählt: 2.5 px `--farbe-akzent` + `--farbe-akzent-flaeche`. Beim Wechsel wechselt der Akzent sofort. CTA unten, volle Breite: „Weiter mit dem Elefantenbaby“ (dynamisch).
- Schritt 2: „← Zurück“. Avatar + Sprechblase „Wann ist euer Kind auf die Welt gekommen?“. Feld Geburtsdatum (`<input type="date">`, radius 18, Fokus: 2 px Akzent), Feld Name (optional). Checkbox „Zu früh geboren?“ → blendet Feld „Errechneter Termin“ ein. Datenschutz-Box („Alles bleibt auf diesem Gerät …“). CTA „Los geht’s“. Validierung: Datum Pflicht, nicht in der Zukunft, nicht älter als 2 Jahre (dann freundlicher Hinweis).

### 2·2 Euer Weg
Vertikaler Zeitstrahl, 48 px linke Spalte, Linie mittig (3 px). Vergangenes: durchgezogen, gedämpft (Opacity .6). Kommendes: gestrichelt. Zeilentypen:
- U vergangen: Kreis 46 px Fläche 2, Text gedämpft. U laufend: Kreis Akzent + Pille „Zeitfenster läuft“. U kommend: Kreis Fläche mit 2.5 px `--farbe-linie-kraeftig`.
- Etappe vergangen: 16 px Punkt in Bereichsfarbe (Opacity .6), Titel gedämpft. **Etappe gerade dran** (heute innerhalb der Spannbreite): Karte mit Label „Gerade dran“. Etappe kommend: offener Ring in Bereichsfarbe + „ab Okt. 2026“.
- „Du bist hier“: Avatar 48 px auf der Linie + Sprechblase in Akzentfläche mit Datum und Alter.
Oben Legende mit den 4 Bereichen. Beim Öffnen zu „Du bist hier“ scrollen. **Keine Häkchen, kein „geschafft“, kein „verspätet“.** Etappen stehen am frühesten typischen Zeitpunkt.

### 2·3 Nächste U
U-Kreis 64 px + „6. bis 7. Lebensmonat“. Karte Zeitfenster mit Datumskacheln, Hinweistext, primärer Button **„In meinen Kalender eintragen“** → erzeugt und lädt eine `.ics` herunter (ganztägiges Ereignis vom Fensterbeginn bis -ende oder Erinnerung am ersten Tag, clientseitig per Blob). Liste „Was bei der U5 passiert“. Checkliste „Das könnt ihr vorher beobachten“ (antippbar, Zustand in localStorage; Kästchen 28 px, radius 10, an = Akzent mit ✓). „Fragen an die Praxis“ als Sprechblasen + „+ Eigene Frage notieren“ (gestrichelt, fügt eigene Frage hinzu, localStorage).

### 2·4 Desktop (≥ 900 px)
Kopfzeile: Wortmarke, Nav als Pillen-Gruppe in der Mitte, Entwurf-Chip + Avatar rechts. Grid `minmax(0,1fr) 360px`, Gap 40, max-width 1120, Padding 36/40. Links: Begrüßung (Avatar 112 px, Blase 26 px), Wegstück, „Begegnen“ und „Gerade dran“ jeweils 2-spaltig. Rechts: Nächste-U-Karte mit Kalender-Button, Als Nächstes, Warnhinweis, Fußnoten.

### 2·5 Komponenten
Nav, Buttons (primär: Akzent, radius rund, padding 14–15, 17 px/800; sekundär: 2 px Akzent-Umriss; Textlink unterstrichen), Eingabe, Checklisten-Eintrag, Avatar 72/48/32 px, Hinweise (Warnung, Frühgeboren, ärztliche Beratung, Entwurf-Chip, Quelle).

### 2·6 App-Icon & Splash
Icon A (Standard): Elefant-Avatar auf `#DDE5EF`, maskable (Motiv in der inneren 80 %-Zone). Icon B: Wortzeichen „U“ 800 in `#FBF3E6` + „& me“ in `#F2C98A` auf `#3F5A78`. Manifest: `background_color` `#DDE5EF`, `theme_color` `#FCF6EC` (dunkel `#141D2B` per `<meta name="theme-color" media="(prefers-color-scheme: dark)">`). Icons als 192/512 PNG + maskable exportieren.

## Interactions & Behavior
- Nav: 3 Ziele (Heute, Nächste U, Euer Weg), echte Routen (`/`, `/naechste-u`, `/weg`), Zurück-Button des Browsers muss funktionieren.
- Hover (Desktop): Karten/Links leicht dunklere Fläche; Fokus-Ring 3 px Akzent mit 2 px Abstand.
- Übergänge ruhig: 150–200 ms ease-out, `prefers-reduced-motion` respektieren.
- „Angaben ändern“ führt zurück ins Onboarding (vorbefüllt).

## State Management
`{ geburtsdatum, errechneterTermin?, name?, maskottchen, theme?, beobachtet: {[uId]: string[]}, eigeneFragen: {[uId]: string[]} }` in localStorage. Abgeleitet: Alter (Etappen nach korrigiertem Alter, U-Fenster nach tatsächlichem Geburtsdatum), aktuelle Phase, U-Zeitfenster, Status der Etappen (vergangen / gerade dran / kommend).

## Design Tokens
Siehe `tokens.css` (hell, dunkel, Akzente je Maskottchen). Mapping der Kurznamen in den Referenzen:
`--bg`→`--farbe-hintergrund`, `--surface`→`--farbe-flaeche`, `--surface2`→`--farbe-flaeche-2`, `--ink`→`--farbe-text`, `--muted`→`--farbe-text-gedaempft`, `--line`→`--farbe-linie`, `--line2`→`--farbe-linie-kraeftig`, `--outline`→`--farbe-umriss`, `--accentInk`→`--farbe-akzent`, `--accentText`→`--farbe-akzent-text`, `--onAccent`→`--farbe-auf-akzent`, `--accentSoft`→`--farbe-akzent-flaeche`, `--warm`→`--farbe-beruhigend`, `--warmMuted`→`--farbe-beruhigend-text`, `--warmLine`→`--farbe-beruhigend-linie`, `--tip`→`--farbe-hinweis`, `--warn`→`--farbe-warnung-flaeche`, `--warnInk`→`--farbe-warnung-text`, `--warnDot`→`--farbe-warnung-punkt`, `--warnLine`→`--farbe-warnung-linie`, `--aAlltag` usw.→`--farbe-alltag` usw., `--nav*`→`--farbe-nav*`.
Typo: 30/22/20/17/15.5/13 px, Gewichte 400/700/800, Zeilenhöhe 1.5 (Text) / 1.25 (Titel). Radien 16/24/28, Blase 26 26 26 8, rund 999. Abstände 4er-Raster. Schatten `0 2px 12px` (Karte), `0 6px 20px` (Nav).

## Assets
`maskottchen/`: fertige Maskottchen (PNG, SVG in `maskottchen/svg/`). Nicht verändern oder neu zeichnen. Avatare immer rund (`border-radius:50%`) auf Akzentfläche.

## Files
- `UundMe MVP.dc.html`: alle MVP-Screens (2·0 bis 2·7)
- `Heute Varianten.dc.html`: ursprüngliche Varianten 1a–1c (1b = gewählt)
- `tokens.css`: CSS-Variablen
- `briefing.md`: Briefing + Inhalte
- `support.js`: nur zum Öffnen der Referenzen im Browser
