import { useState } from 'react';
import { Onboarding } from './components/Onboarding';
import { DuBistHier } from './components/DuBistHier';
import { EuerWeg } from './components/EuerWeg';
import { maskottchenBild } from './lib/inhalte';
import { profilLaden, profilLoeschen, profilSpeichern, type Profil } from './lib/speicher';

type Ansicht = 'heute' | 'weg';

// Nur in der Entwicklung: Profil und Ansicht per URL vorgeben, z. B. für Screenshots
// ?demo=elefant,2026-04-19,Mila&ansicht=weg – wird nicht gespeichert.
const url = new URLSearchParams(window.location.search);
const demo = import.meta.env.DEV ? url.get('demo')?.split(',') : undefined;
const demoProfil: Profil | null = demo
  ? { maskottchen: demo[0] as Profil['maskottchen'], geburtsdatum: demo[1], name: demo[2] }
  : null;
const startAnsicht: Ansicht = import.meta.env.DEV && url.get('ansicht') === 'weg' ? 'weg' : 'heute';

export default function App() {
  const [profil, setProfil] = useState<Profil | null>(() => demoProfil ?? profilLaden());
  const [ansicht, setAnsicht] = useState<Ansicht>(startAnsicht);

  if (!profil) {
    return (
      <Onboarding
        onFertig={(neu) => {
          profilSpeichern(neu);
          setProfil(neu);
          setAnsicht('heute');
        }}
      />
    );
  }

  return (
    <div className="seite">
      <nav className="navigation" aria-label="Hauptnavigation">
        <img className="avatar" src={maskottchenBild(profil.maskottchen, true)} alt="" />
        <button type="button" aria-current={ansicht === 'heute'} onClick={() => setAnsicht('heute')}>
          Heute
        </button>
        <button type="button" aria-current={ansicht === 'weg'} onClick={() => setAnsicht('weg')}>
          Euer Weg
        </button>
      </nav>

      <main className="inhalt">
        {ansicht === 'heute' ? <DuBistHier profil={profil} /> : <EuerWeg profil={profil} />}
      </main>

      <button
        type="button"
        className="leise"
        onClick={() => {
          profilLoeschen();
          setProfil(null);
        }}
      >
        Angaben ändern
      </button>
    </div>
  );
}
