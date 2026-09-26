# U & Me

Web-App, die Eltern zwischen den U-Untersuchungen (U1–U7, 0–2 Jahre) begleitet. Details: `docs/spec.md`.

## Kontext

- Lernprojekt: Der Nutzer lernt, mit Claude Code Software zu bauen. **Erkläre kurz, was du baust und warum**, besonders bei neuen Konzepten (Tools, Dateien, Befehle).
- Arbeite in **kleinen, lauffähigen Schritten**. Kein großes Umbauen auf einmal.
- Zielgruppe: Freundeskreis, ca. 10–30 Familien. Einfachheit vor Skalierbarkeit.

## Regeln

- **Local-first:** Keine Daten an Server senden. Kein Backend, keine Accounts, kein Tracking, keine externen Analytics- oder Font-Dienste.
- **Inhalte als Daten:** Texte zu Phasen und U-Untersuchungen gehören in JSON-Dateien unter `src/content/`, nicht in Komponenten.
- **Quellen:** Jeder fachliche Inhalt nennt seine Quelle. Keine erfundenen Fakten; bei Unsicherheit markieren statt raten.
- **Tonalität:** Deutsch, freundlich-sachlich, beruhigend. Entwicklung immer als Spannbreite, nie als Stichtag. Keine Diagnosen, keine Bewertung des Kindes.
- **Kein „Sprünge“-Modell** (Wonder Weeks o. ä.).

## Design

- Stilrichtung „Bilderbuch“: warm, verspielt, rund – aber Texte klar und gut lesbar.
- Vier wählbare Maskottchen: Löwen-, Hunde-, Pinguin- und Elefantenbaby.
- Dunkelmodus ist Pflicht und soll warm wirken (Nachtlicht), nicht kalt invertiert.
- Keine Rosa/Hellblau-Codierung, keine Bewertung des Kindes (Ampeln, Scores, Streaks).
- Details: `docs/claude-design/briefing.md` (später `docs/design.md` mit den finalen Werten).

## Technik

- Vite + React + TypeScript
- Mobile first: Die App wird fast ausschließlich auf dem Handy genutzt.
