# U & Me

Web-App, die Eltern zwischen den U-Untersuchungen (U1–U9, Geburt bis Einschulung) begleitet. Details: `docs/spec.md`.

## Kontext

- Lernprojekt: Der Nutzer lernt, mit Claude Code Software zu bauen. **Erkläre kurz, was du baust und warum**, besonders bei neuen Konzepten (Tools, Dateien, Befehle).
- Arbeite in **kleinen, lauffähigen Schritten**. Kein großes Umbauen auf einmal.
- Zielgruppe: Freundeskreis, ca. 10–30 Familien. Einfachheit vor Skalierbarkeit.

## Regeln

- **Local-first:** Keine Daten an Server senden. Kein Backend, keine Accounts, kein Tracking, keine externen Analytics- oder Font-Dienste.
- **Inhalte als Daten:** Texte zu Phasen, Etappen und U-Untersuchungen gehören in JSON-Dateien unter `src/content/`, nicht in Komponenten.
- **Quellen:** Jeder fachliche Inhalt nennt seine Quelle. Keine erfundenen Fakten; bei Unsicherheit markieren statt raten.
- **Tonalität:** Deutsch, freundlich-sachlich, beruhigend. Entwicklung immer als Spannbreite, nie als Stichtag. Keine Diagnosen, keine Bewertung des Kindes.
- **Kein „Sprünge“-Modell** (Wonder Weeks o. ä.) – stattdessen eigene **Etappen** (`src/content/etappen.json`) mit Spannbreiten, keine festen Wochen, keine übernommenen Namen oder Texte.
  In der Oberfläche heißen die Etappen **„Sprünge“** (Entscheidung 27.09.2026) – der Begriff ist Eltern vertraut; Inhalte bleiben unsere eigenen, mit Quelle und Spannbreite.
  Wann ein Sprung beginnt, zeigt die App **ungefähr** („ab etwa Mitte März“) – nie als genauen Tag.

## Design

- Stilrichtung „Bilderbuch“: warm, verspielt, rund – aber Texte klar und gut lesbar.
- Vier wählbare Maskottchen: Löwen-, Hunde-, Pinguin- und Elefantenbaby.
- **Logo ist immer der Elefantenkopf** – unabhängig davon, welches Tier als Avatar gewählt ist (entschieden 26.09.2026).
- Dunkelmodus ist Pflicht und soll warm wirken (Nachtlicht), nicht kalt invertiert.
- Keine Rosa/Hellblau-Codierung, keine Bewertung des Kindes (Ampeln, Scores, Streaks).
- Details: `docs/design.md` (Regeln, Tokens, Bauteile – Werte stehen in `src/styles/tokens.css`), Ursprung: `docs/claude-design/briefing.md`.

## Technik

- Vite + React + TypeScript
- Mobile first: Die App wird fast ausschließlich auf dem Handy genutzt.

## Veröffentlichen

- Live: https://tokodev1.github.io/u-and-me/ (GitHub Pages, Zweig `gh-pages`)
- Code: https://github.com/ToKoDev1/u-and-me (öffentlich)
- Veröffentlichen per `npm run veroeffentlichen` (baut und lädt `dist` hoch). Vorher committen und `git push`.
- Nur auf ausdrücklichen Wunsch veröffentlichen – die Seite ist für Freunde erreichbar.
- Vor jedem Veröffentlichen die Version in `package.json` erhöhen (steht in der Fußzeile – so sieht man, welcher Stand läuft). Nach jedem Veröffentlichen den Live-Link nennen.
- Die App hat einen Service Worker (offline nutzbar): Beim Öffnen lädt sie eine neue Version im Hintergrund und lädt sich dann einmal selbst neu (`registerSW` in `src/main.tsx`).
- Entwicklungs-Helfer (nur lokal): `?demo=tier,YYYY-MM-DD,Name`, `?zeitreise`, `?neu`, `?darstellung=dunkel`
