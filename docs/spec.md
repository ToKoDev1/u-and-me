# U & Me – Spec v1

> Status: Entwurf · Stand: 26.09.2026

## Worum geht's?

Eine kleine Web-App, die Eltern **zwischen den U-Untersuchungen** begleitet. Man gibt das Geburtsdatum des Kindes ein und sieht:

- **Wo stehen wir gerade?** Welche Entwicklung ist in dieser Phase typisch – als *Spannbreite*, nicht als Stichtag.
- **Was kommt als Nächstes?** Wann ist die nächste U, was wird dort angeschaut, und wie kann ich mich vorbereiten?

Der Name: „U“ wie U-Untersuchung, „U & Me“ wie *you and me* – Eltern und Kind.

## Für wen?

Eltern im Freundes- und Bekanntenkreis (ca. 10–30 Familien), mit Kindern zwischen 0 und 2 Jahren. Kein öffentliches Produkt, keine Monetarisierung.

Nebenziel: Das Projekt dient dazu, **das Bauen von Software mit Claude Code zu lernen**.

## Haltung

- **Beruhigen statt verunsichern.** Kinder entwickeln sich unterschiedlich schnell. Wir zeigen Korridore („zwischen 6 und 10 Monaten“), keine Deadlines.
- **Informieren, nicht diagnostizieren.** Die App bewertet das Kind nicht. Sie erklärt, was typisch ist, und nennt klar, bei welchen Warnzeichen man nicht bis zur nächsten U warten sollte.
- **Seriöse Quellen.** Jeder Inhalt nennt seine Quelle (z. B. kindergesundheit-info.de, G-BA Kinder-Richtlinie, STIKO).
- **Kein Sprung-Modell mit festen Wochen.** Wir übernehmen kein wissenschaftlich umstrittenes Modell. Unsere eigenen Etappen heißen in der Oberfläche aber „Sprünge“ (Entscheidung 27.09.2026).

## Umfang v1

*(Annahmen, änderbar)*

| Entscheidung | v1 |
|---|---|
| Zeitraum | Geburt bis Einschulung (U1 bis U9, Zahnarzt Z1–Z6) |
| Tonalität | Freundlich-sachlich – wie eine gute Hebamme: warm, klar, mit Fakten |
| Sprache | Deutsch |

### Features v1

1. **Onboarding** – Geburtsdatum eingeben (optional Name des Kindes) und ein **Maskottchen wählen**: Löwenbaby, Hundebaby, Pinguinbaby oder Elefantenbaby. Wird lokal im Browser gespeichert.
2. **„Heute“ / Du bist hier** – aktuelle Phase (zwischen welchen Us) mit:
   - Alter des Kindes (Wochen/Monate)
   - **„Was euch gerade begegnen kann“** – Alltags-Etappen, die gerade laufen (z. B. unruhiger Schlaf, Fremdeln, Zähne). Beantwortet „Warum ist mein Kind gerade so – und ist das normal?“. Der emotionale Kern der App, steht ganz oben.
   - **„Gerade dran“** – Entwicklungs-Etappen, deren typisches Zeitfenster gerade läuft (Bewegung, Sprache, Miteinander), mit Tipps
   - **„Als Nächstes“** – die nächsten 3 Etappen
   - **„Spielideen für diese Zeit“** – 3–5 alltagsnahe Spiele pro Phase, die die Entwicklung fördern (ohne Kaufzwang, mit Sicherheitshinweisen). Motto: „Keine Pflicht – was euch beiden Spaß macht, ist richtig.“
   - Worauf achten / wann ärztlich abklären
3. **Aufbau als Dashboard** – keine Navigationsleiste. Die Startseite zeigt U-Zeitleiste (Lebensabschnitt 0–2 bzw. 1½–5½ Jahre, U und Z anklickbar), Zeitring mit Maskottchen, drei Kacheln (Begegnet euch, Gerade dran, Spielideen), „Heute wichtig“ und die nächste U. Unterseiten führen mit „← Heute“ zurück. Ein eigener Zeitstrahl „Euer Weg“ wurde bewusst verworfen.
4. **Nächste U vorbereiten** – Zeitfenster der nächsten U, was dort passiert, Beobachtungs-Checkliste, mögliche Fragen an die Kinderärztin. Dazu **„In meinen Kalender eintragen“**: lädt eine .ics-Datei mit dem Zeitfenster herunter (lokal erzeugt, kein Server).
5. **Hinweis für Frühgeborene** – gut sichtbarer Hinweis, dass bei Frühchen für die Entwicklung das *korrigierte Alter* zählt (Alter ab errechnetem Geburtstermin), die U-Termine aber nach dem tatsächlichen Geburtsdatum laufen. Die App rechnet in v1 selbst noch nicht mit korrigiertem Alter.
6. **Allgemeiner Hinweis** – die App ersetzt keine ärztliche Beratung; bei Sorgen immer die Kinderarztpraxis fragen.

### Etappen (in der Oberfläche: „Sprünge“)

Zwischen zwei Us liegen oft Monate. Damit sichtbar wird, was in dieser Zeit passiert, gibt es **Etappen**: kleine Entwicklungsschritte und typische Alltagsphasen, jeweils mit **Spannbreite** („meist mit 6–10 Monaten“), nie mit festem Termin. Bewusst *kein* Sprünge-Modell à la „Oje, ich wachse!“ – das ist wissenschaftlich nicht belegt, erzeugt mit festen Wochen Druck, und Namen/Inhalte sind geschützt.

Seit 27.09.2026 heißen die Etappen in der Oberfläche **„Sprünge“** – der Begriff ist Eltern vertraut, die Inhalte bleiben unsere eigenen. Eltern möchten sehen, wann der nächste Sprung ungefähr beginnt: Deshalb zeigt die App einen **ungefähren Beginn** („ab etwa Mitte März“), nie einen genauen Tag, und daneben immer die Spannbreite.

Bereiche: Alltag (→ „Was euch begegnen kann“), Bewegung, Sprache & Laute, Miteinander. Spielideen hängen als Tipp an der passenden Etappe. Inhalte: `src/content/etappen.json`.

### Die U-Untersuchungen im Zeitraum

| U | Zeitraum |
|---|---|
| U1 | direkt nach der Geburt |
| U2 | 3.–10. Lebenstag |
| U3 | 4.–5. Lebenswoche |
| U4 | 3.–4. Lebensmonat |
| U5 | 6.–7. Lebensmonat |
| U6 | 10.–12. Lebensmonat |
| U7 | 21.–24. Lebensmonat |

*(Zeiträume vor Verwendung in der App gegen die G-BA Kinder-Richtlinie prüfen.)*

### Inspiration & Abgrenzung: „Oje, ich wachse!“

Die bekannteste App im Bereich (4,6★, ~39.500 Bewertungen). Ihr Erfolg liegt weniger in der (umstrittenen) Sprung-Theorie als im emotionalen Job: *„Warum ist mein Baby gerade so anstrengend – und ist das normal?“*

- **Übernommen (als Prinzip, nicht als Inhalt):** „Was euch gerade begegnen kann“, persönlicher Zeitstrahl, Erinnerungen (bei uns: Kalender-Export statt Push), Spielideen pro Phase
- **Bewusst nicht:** Sprung-Modell mit exakten Vorhersagen, Abo/Paywall, Community-Forum, Texte oder Bilder der App

## Bewusst NICHT in v1

- Keine Accounts, kein Login, kein Backend
- Keine Speicherung von Daten auf einem Server
- Kein Tracking / keine Analytics
- Keine Bewertung oder „Ampel“ zur Entwicklung des Kindes
- Keine Push-Benachrichtigungen
- Keine native App (App Store)

## Später (Parkplatz)

**v1.1 (Design wird schon mitgestaltet):**

**Irgendwann:**

- Notizen / Beobachtungen, die vor der U gesammelt angezeigt werden
- Impf-Erinnerungen nach STIKO
- Mehrere Kinder
- Frühgeborene: App rechnet selbst mit **korrigiertem Alter** (Eingabe des errechneten Termins)
- Zeitraum bis U9 (Einschulung)
- Freundeskreis-Funktion („Luca ist gerade in derselben Phase“) – bräuchte ein Backend
- Installierbar als App (PWA)
- **Mitwachsendes Maskottchen:** eigene Illustration pro Phase (liegt → dreht sich → krabbelt → läuft)

## Technik

- **Web-App**, später PWA (auf dem Homescreen installierbar)
- **Local-first:** Alle Daten bleiben im Browser (localStorage). Gesundheitsdaten von Kindern gehören nicht auf unseren Server.
- **Inhalte als Daten:** Phasen und U-Infos liegen in JSON-Dateien, nicht im Code – so können Inhalte ohne Programmierung geprüft und angepasst werden.
- **Stack:** Vite + React + TypeScript (verbreitet, gut dokumentiert)
- **Hosting:** kostenlos über GitHub Pages oder Netlify

## Wann ist v1 erfolgreich?

- Mindestens 5 befreundete Familien haben die App ausprobiert.
- Mindestens eine Familie sagt: „Das hat mir vor der U geholfen.“
- Ich verstehe, wie die App aufgebaut ist, und kann Änderungen mit Claude Code selbstständig umsetzen.

## Fachliche Qualität

Aktuell gibt es niemanden, der die Inhalte fachlich gegenliest. Deshalb:

- Inhalte **nur** aus offiziellen bzw. etablierten Quellen (kindergesundheit-info.de, G-BA Kinder-Richtlinie, STIKO, Berufsverband der Kinder- und Jugendärzte / kinderaerzte-im-netz.de).
- Jeder Inhalt verlinkt seine Quelle, damit Eltern selbst nachlesen können.
- Formulierungen eng an den Quellen halten, keine eigenen Interpretationen.
- Jede Phase bekommt ein Feld „geprüft am“, damit klar ist, wie aktuell der Inhalt ist.

## Offene Fragen

- Findet sich später doch jemand für eine fachliche Durchsicht (Hebamme, Kinderärztin)? Wäre vor dem Teilen mit mehr Familien sinnvoll.
