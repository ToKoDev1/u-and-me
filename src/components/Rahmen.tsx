import type { ReactNode } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import type { Profil } from '../lib/speicher';
import { Avatar } from './Avatar';

const ziele = [
  { pfad: '/', text: 'Heute' },
  { pfad: '/naechste-u', text: 'Nächste U' },
  { pfad: '/weg', text: 'Euer Weg' },
];

function Navigation({ className }: { className: string }) {
  const { pathname } = useLocation();
  // Detailseiten einzelner Us (/u/U3) gehören zum Bereich „Nächste U“
  const uDetail = pathname.startsWith('/u/');
  return (
    <nav className={className} aria-label="Hauptnavigation">
      {ziele.map((z) => (
        <NavLink
          key={z.pfad}
          to={z.pfad}
          end
          className={({ isActive }) => (isActive || (uDetail && z.pfad === '/naechste-u') ? 'active' : undefined)}
        >
          {z.text}
        </NavLink>
      ))}
    </nav>
  );
}

/** Kopfzeile + Inhalt + Navigation (mobil schwebend unten, Desktop oben) */
type Props = {
  profil: Profil;
  /** z. B. die Zeitreise-Leiste */
  oben?: ReactNode;
  /** zeigt unten einen Link „Zeitreise starten“ */
  onZeitreise?: () => void;
};

export function Rahmen({ profil, oben, onZeitreise }: Props) {
  return (
    <>
      <header className="kopfzeile">
        <NavLink to="/" className="wortmarke">U &amp; Me</NavLink>
        <Navigation className="nav-oben" />
        <div className="kopfzeile-rechts">
          <span className="chip-entwurf">Entwurf</span>
          <Avatar tier={profil.maskottchen} groesse={40} />
        </div>
      </header>
      {oben}
      <main className="seite">
        <Outlet />
        {onZeitreise && (
          <p className="zeitreise-start">
            <button type="button" onClick={onZeitreise}>Zeitreise starten (Test)</button>
          </p>
        )}
      </main>
      <Navigation className="nav-unten" />
    </>
  );
}
