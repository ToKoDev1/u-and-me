import { useEffect, useRef, type ReactNode } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { kindAus } from '../lib/kind';
import { speicherVerfuegbar } from '../lib/speicher';
import type { Profil } from '../lib/speicher';
import { Avatar } from './Avatar';
import { Fusszeile } from './Fusszeile';

type Props = {
  profil: Profil;
  /** z. B. die Zeitreise-Leiste */
  oben?: ReactNode;
  /** zeigt in der Fußzeile einen Link „Zeitreise (Test)“ */
  onZeitreise?: () => void;
};

/**
 * Kopfzeile + Inhalt + Fußzeile. Keine Navigation: Die Startseite ist das Dashboard,
 * von dem aus alles erreichbar ist; Unterseiten führen mit „← Heute“ zurück.
 */
export function Rahmen({ profil, oben, onZeitreise }: Props) {
  const { pathname } = useLocation();
  const ersterAufruf = useRef(true);

  // Beim Seitenwechsel: nach oben und Fokus auf die Überschrift (für Screenreader/Tastatur)
  useEffect(() => {
    if (ersterAufruf.current) {
      ersterAufruf.current = false;
      return;
    }
    window.scrollTo(0, 0);
    document.querySelector<HTMLElement>('main h1')?.focus({ preventScroll: true });
  }, [pathname]);

  return (
    <div className="app">
      <header className="kopfzeile">
        <Link to="/" className="wortmarke">U &amp; Me</Link>
        <div className="kopfzeile-rechts">
          <span className="chip-entwurf">Entwurf</span>
          <Avatar tier={profil.maskottchen} groesse={40} />
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
