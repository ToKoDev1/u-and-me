import { useEffect, useRef, type ReactNode } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { kindAus } from '../lib/kind';
import { speicherVerfuegbar } from '../lib/speicher';
import type { Profil, Daten } from '../lib/speicher';
import { Fusszeile } from './Fusszeile';
import { KinderMenue } from './KinderMenue';

type Props = {
  profil: Profil;
  daten: Daten;
  onKindWaehlen: (id: string) => void;
  /** z. B. die Zeitreise-Leiste */
  oben?: ReactNode;
  /** zeigt in der Fußzeile einen Link „Zeitreise (Test)“ */
  onZeitreise?: () => void;
};

/**
 * Kopfzeile + Inhalt + Fußzeile. Keine Navigation: Die Startseite ist das Dashboard,
 * von dem aus alles erreichbar ist; Unterseiten führen mit „← Heute“ zurück.
 */
export function Rahmen({ profil, daten, onKindWaehlen, oben, onZeitreise }: Props) {
  const { pathname, hash } = useLocation();
  const ersterAufruf = useRef(true);

  // Beim Seitenwechsel: nach oben und Fokus auf die Überschrift (für Screenreader/Tastatur)
  useEffect(() => {
    if (ersterAufruf.current) {
      ersterAufruf.current = false;
      return;
    }
    // Sprungmarke (z. B. #warnzeichen) anspringen, sonst nach oben
    const ziel = hash ? document.getElementById(hash.slice(1)) : null;
    if (ziel) ziel.scrollIntoView();
    else window.scrollTo(0, 0);
    document.querySelector<HTMLElement>('main h1')?.focus({ preventScroll: true });
  }, [pathname, hash]);

  return (
    <div className="app">
      <header className="kopfzeile">
        <Link to="/" className="wortmarke">
          <img src={`${import.meta.env.BASE_URL}icons/elefant-logo.png`} alt="" className="wortmarke-logo" />
          U &amp; Me
        </Link>
        <div className="kopfzeile-rechts">
          <span className="chip-entwurf">Entwurf</span>
          <KinderMenue daten={daten} onKindWaehlen={onKindWaehlen} />
        </div>
      </header>
      {oben}
      {!speicherVerfuegbar() && <SpeicherWarnung />}
      <main className="seite">
        <Outlet />
      </main>
      <Fusszeile fruehgeboren={kindAus(profil).fruehgeboren} onZeitreise={onZeitreise} />
    </div>
  );
}

/** Hinweis, wenn der Browser nicht speichern darf – sonst ist nach dem Neuladen alles weg */
export function SpeicherWarnung() {
  return (
    <p className="speicher-warnung" role="alert">
      Euer Browser speichert gerade nichts (z. B. privates Fenster). Eure Angaben gehen beim Schließen verloren.
    </p>
  );
}
