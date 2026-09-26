# Briefing: Logo-Zeichen für „U & Me“ (für Higgsfield)

## Worum es geht

„U & Me“ ist eine Web-App für Eltern, die sie zwischen den U-Untersuchungen (U1–U7, 0–2 Jahre) begleitet: was das Kind gerade entdeckt, wann die nächste U ansteht, Ideen zum Spielen. Zielgruppe: Freundeskreis, junge Eltern, meist auf dem Handy, oft nachts.

## Das Problem

Das aktuelle Logo ist ein Elefantenkopf. Der Elefant ist aber auch eines der **vier wählbaren Maskottchen** (Löwe, Hund, Pinguin, Elefant). Wer den Pinguin wählt, sieht oben links einen Elefanten und oben rechts einen Pinguin – verwirrend.

## Ziel

Ein **eigenes, neutrales Zeichen** (Symbol ohne Schrift), das
- für „den Weg von U zu U“ steht,
- zu den vier Maskottchen passt, aber **kein Tier** ist,
- als App-Icon (bis 16 px Favicon) funktioniert,
- neben dem Schriftzug „U & Me“ in der Kopfzeile steht (ca. 36 px hoch).

## Ideen (Richtungen)

1. **U als Weg** – ein dickes, rundes „U“, das wie ein Pfad aussieht; darauf 3–5 kleine Punkte oder Fußspuren als Stationen (wie die U-Termine). Passt zur Zeitleiste und zum Startbildschirm der App.
2. **Kleine Fußspuren** – zwei Paar Babyfüße (groß + klein, „U & Me“), die zusammen eine U-Form bilden.
3. **Wegweiser / Stein-Pfad** – runde Trittsteine, die einen Bogen bilden; der letzte Stein ist ein kleines Herz oder ein Stern.

Favorit: Richtung 1 (einfach, eindeutig, skaliert gut).

## Stil

- Wie die Maskottchen: **Bilderbuch**, warm, rund, weiche dunkelbraune Kontur (#4A3428), flache Farben, keine Verläufe, kein 3D, kein Glanz.
- Freundlich, ruhig, nicht medizinisch.

## Farben

| Rolle | Hex |
|---|---|
| Icon-Grund hell (Taubenblau) | #DDE5EF |
| Icon-Grund dunkel (Nachtblau) | #1D2839 |
| Akzent (Blau) | #3F5A78 |
| Kontur / Text (Dunkelbraun) | #4A3428 |
| Hintergrund App (Creme) | #FCF6EC |
| Wangenrosa (sparsam) | #F2A99A |

## Bitte nicht

- keine Tiere, keine Gesichter
- kein Arztkreuz, Stethoskop, Spritze, Pflaster, Herzschlag-Linie
- kein Rosa/Hellblau als Mädchen/Jungen-Codierung
- keine Schrift im Bild (Bildmodelle schreiben unsauber – der Schriftzug kommt aus der App)
- nichts, was nach offiziellem Siegel, Krankenkasse oder dem gelben U-Heft aussieht

## Was wir brauchen

- Zeichen **freigestellt** (transparenter Hintergrund), quadratisch, mittig, mit Rand
- Variante auf Taubenblau (hell) und Nachtblau (dunkel) als App-Icon
- mehrere Varianten zur Auswahl (je Richtung 4)
- Danach: Favorit als Vektor (SVG) nachbauen, Exporte wie bisher (icon-192/512, maskable, apple-touch-icon-180, favicon-32/16, Kopfzeile)

## Prompts (englisch – Bildmodelle verstehen Englisch besser)

**Richtung 1 – U als Weg**
> Minimal flat app icon symbol: a thick, rounded letter-U shape drawn as a gentle winding path, with four small round stepping dots along it, the last dot slightly larger and glowing warm. Children's picture-book style, soft hand-drawn dark brown outline (#4A3428), flat muted colors, slate blue path (#3F5A78) on pale dove-blue background (#DDE5EF), cream highlights (#FCF6EC). Centered, generous padding, simple shapes that remain readable at 16 pixels. No text, no letters besides the U shape, no animals, no faces, no medical symbols, no gradients, no 3D, no shadows.

**Richtung 2 – Fußspuren**
> Minimal flat app icon symbol: two pairs of tiny footprints, one adult and one baby, walking side by side and curving together into a soft U-shaped path. Children's picture-book style, soft dark brown outline (#4A3428), flat muted colors, slate blue (#3F5A78) and cream (#FCF6EC) on pale dove-blue background (#DDE5EF). Centered, generous padding, readable at 16 pixels. No text, no animals, no faces, no medical symbols, no gradients, no 3D.

**Richtung 3 – Trittsteine**
> Minimal flat app icon symbol: five round stepping stones forming a gentle upward arc, growing slightly in size, the last stone a small soft star. Children's picture-book style, soft dark brown outline (#4A3428), flat muted colors, slate blue (#3F5A78) and warm cream (#FCF6EC) on pale dove-blue background (#DDE5EF). Centered, generous padding, readable at 16 pixels. No text, no animals, no faces, no medical symbols, no gradients, no 3D.

**Negativ-Prompt (falls das Modell einen hat)**
> text, letters, words, watermark, animal, face, cross, stethoscope, syringe, heartbeat line, pink and blue gender colors, gradient, 3D, glossy, photorealistic, busy details, drop shadow

**Einstellungen:** Seitenverhältnis 1:1, 4 Varianten pro Prompt. Danach Hintergrund entfernen für die freigestellte Version.
