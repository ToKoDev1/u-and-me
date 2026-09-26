import { useState } from 'react';
import { Onboarding } from './components/Onboarding';
import { DuBistHier } from './components/DuBistHier';
import { profilLaden, profilLoeschen, profilSpeichern, type Profil } from './lib/speicher';

export default function App() {
  const [profil, setProfil] = useState<Profil | null>(profilLaden);

  if (!profil) {
    return (
      <Onboarding
        onFertig={(neu) => {
          profilSpeichern(neu);
          setProfil(neu);
        }}
      />
    );
  }

  return (
    <DuBistHier
      profil={profil}
      onZuruecksetzen={() => {
        profilLoeschen();
        setProfil(null);
      }}
    />
  );
}
