import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { EuerWeg } from './components/EuerWeg';
import { Heute } from './components/Heute';
import { NaechsteU } from './components/NaechsteU';
import { Onboarding } from './components/Onboarding';
import { Rahmen } from './components/Rahmen';
import { akzentSetzen } from './lib/darstellung';
import { kindAus } from './lib/kind';
import { profilLaden, profilSpeichern, type Profil } from './lib/speicher';

// Nur in der Entwicklung: Profil per URL vorgeben, z. B. für Screenshots
// ?demo=elefant,2026-04-19,Mila[,errechneterTermin] – wird nicht gespeichert.
const demo = import.meta.env.DEV ? new URLSearchParams(window.location.search).get('demo')?.split(',') : undefined;
const demoProfil: Profil | null = demo
  ? { maskottchen: demo[0] as Profil['maskottchen'], geburtsdatum: demo[1], name: demo[2] || undefined, errechneterTermin: demo[3] }
  : null;

export default function App() {
  const [profil, setProfil] = useState<Profil | null>(() => demoProfil ?? profilLaden());
  const navigate = useNavigate();

  // Persönlicher Akzent nach gewähltem Maskottchen
  useEffect(() => akzentSetzen(profil?.maskottchen), [profil]);

  function speichern(neu: Profil) {
    profilSpeichern(neu);
    setProfil(neu);
    navigate('/');
  }

  if (!profil) return <Onboarding onFertig={speichern} />;

  const kind = kindAus(profil);
  return (
    <Routes>
      <Route element={<Rahmen profil={profil} />}>
        <Route index element={<Heute kind={kind} />} />
        <Route path="naechste-u" element={<NaechsteU kind={kind} />} />
        <Route path="weg" element={<EuerWeg kind={kind} />} />
      </Route>
      <Route
        path="angaben"
        element={
          <Onboarding
            vorher={profil}
            onFertig={speichern}
            onAbbrechen={() => {
              akzentSetzen(profil.maskottchen);
              navigate(-1);
            }}
          />
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
