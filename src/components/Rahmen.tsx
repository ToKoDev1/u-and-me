import type { ReactNode } from 'react';
import { Link, Outlet } from 'react-router-dom';
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
      <main className="seite">
        <Outlet />
      </main>
      <Fusszeile fruehgeboren={!!profil.errechneterTermin} onZeitreise={onZeitreise} />
    </div>
  );
}
