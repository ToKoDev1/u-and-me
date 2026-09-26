import { NavLink, Outlet } from 'react-router-dom';
import type { Profil } from '../lib/speicher';
import { Avatar } from './Avatar';

const ziele = [
  { pfad: '/', text: 'Heute' },
  { pfad: '/naechste-u', text: 'Nächste U' },
  { pfad: '/weg', text: 'Euer Weg' },
];

function Navigation({ className }: { className: string }) {
  return (
    <nav className={className} aria-label="Hauptnavigation">
      {ziele.map((z) => (
        <NavLink key={z.pfad} to={z.pfad} end>
          {z.text}
        </NavLink>
      ))}
    </nav>
  );
}

/** Kopfzeile + Inhalt + Navigation (mobil schwebend unten, Desktop oben) */
export function Rahmen({ profil }: { profil: Profil }) {
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
      <main className="seite">
        <Outlet />
      </main>
      <Navigation className="nav-unten" />
    </>
  );
}
