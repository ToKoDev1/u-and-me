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
- **Keine „Sprünge“.** Wir übernehmen kein wissenschaftlich umstrittenes Sprung-Modell.

## Umfang v1

*(Annahmen, änderbar)*

| Entscheidung | v1 |
|---|---|
| Zeitraum | 0–2 Jahre (U1 bis U7) |
| Tonalität | Freundlich-sachlich – wie eine gute Hebamme: warm, klar, mit Fakten |
| Sprache | Deutsch |

### Features v1

1. **Onboarding** – Geburtsdatum eingeben (optional Name des Kindes) und ein **Maskottchen wählen**: Löwenbaby, Hundebaby, Pinguinbaby oder Elefantenbaby. Wird lokal im Browser gespeichert.
2. **„Du bist hier“** – aktuelle Phase mit:
   - Alter des Kindes (Wochen/Monate)
   - **„Was euch gerade begegnen kann“** – beantwortet „Warum ist mein Kind gerade so – und ist das normal?“ (z. B. unruhiger Schlaf, Fremdeln). Der emotionale Kern der App, steht ganz oben.
   - Was in dieser Phase typisch ist (Bewegung, Sprache, Sozialverhalten, Schlaf/Essen)
   - Worauf achten / wann ärztlich abklären
3. **Nächste U vorbereiten** – Zeitfenster der nächsten U, was dort passiert, Beobachtungs-Checkliste, mögliche Fragen an die Kinderärztin. Dazu **„In meinen Kalender eintragen“**: lädt eine .ics-Datei mit dem Zeitfenster herunter (lokal erzeugt, kein Server).
4. **Hinweis für Frühgeborene** – gut sichtbarer Hinweis, dass bei Frühchen für die Entwicklung das *korrigierte Alter* zählt (Alter ab errechnetem Geburtstermin), die U-Termine aber nach dem tatsächlichen Geburtsdatum laufen. Die App rechnet in v1 selbst noch nicht mit korrigiertem Alter.
5. **Allgemeiner Hinweis** – die App ersetzt keine ärztliche Beratung; bei Sorgen immer die Kinderarztpraxis fragen.

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
- **Zeitstrahl „Euer Weg“** – alle Us und Phasen mit echten Daten, aktuelle Phase hervorgehoben, Maskottchen als „Wanderer“
- **„Das könnt ihr zusammen ausprobieren“** – 2–3 Spiel-/Beschäftigungsideen pro Phase

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
