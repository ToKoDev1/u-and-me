import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { Heute } from './components/Heute';
import { Begegnen, Entwicklung, Spielen } from './components/Unterseiten';
import { NaechsteU } from './components/NaechsteU';
import { Onboarding } from './components/Onboarding';
import { Rahmen } from './components/Rahmen';
import { Zeitreise } from './components/Zeitreise';
import { heute } from './lib/alter';
import { akzentSetzen } from './lib/darstellung';
import { kindAus } from './lib/kind';
import { alsProfil, profilLaden, profilSpeichern, type Profil } from './lib/speicher';

const url = new URLSearchParams(window.location.search);

// Nur in der Entwicklung: Profil per URL vorgeben, z. B. für Screenshots
// ?demo=elefant,2026-04-19,Mila[,errechneterTermin] – wird nicht gespeichert.
const demo = import.meta.env.DEV ? url.get('demo')?.split(',') : undefined;
const demoProfil: Profil | null = demo
  ? alsProfil({ maskottchen: demo[0], geburtsdatum: demo[1], name: demo[2], errechneterTermin: demo[3] })
  : null;

// Zeitreise (Datum simulieren): in der Entwicklung per Link, überall per ?zeitreise
const zeitreiseVerfuegbar = import.meta.env.DEV || url.has('zeitreise');

export default function App() {
  const [profil, setProfil] = useState<Profil | null>(() => demoProfil ?? profilLaden());
  const [zeitreiseAn, setZeitreiseAn] = useState(url.has('zeitreise'));
  const [simuliert, setSimuliert] = useState<Date | null>(null);
  const navigate = useNavigate();

  // Persönlicher Akzent nach gewähltem Maskottchen
  useEffect(() => akzentSetzen(profil?.maskottchen), [profil]);

  function speichern(neu: Profil) {
    profilSpeichern(neu);
    setProfil(neu);
    navigate('/', { replace: true }); // Zurück-Knopf führt nicht wieder ins Formular
  }

  if (!profil) return <Onboarding onFertig={speichern} />;

  const echtesHeute = heute();
  const kind = kindAus(profil, zeitreiseAn && simuliert ? simuliert : echtesHeute);

  const zeitreise = zeitreiseAn ? (
    <Zeitreise
      kind={kind}
      onDatum={setSimuliert}
      onBeenden={() => {
        setZeitreiseAn(false);
        setSimuliert(null);
      }}
    />
  ) : null;

  return (
    <Routes>
      <Route
        element={
          <Rahmen
            profil={profil}
            oben={zeitreise}
            onZeitreise={zeitreiseVerfuegbar && !zeitreiseAn ? () => setZeitreiseAn(true) : undefined}
          />
        }
      >
        <Route index element={<Heute kind={kind} />} />
        <Route path="begegnen" element={<Begegnen kind={kind} />} />
        <Route path="entwicklung" element={<Entwicklung kind={kind} />} />
        <Route path="spielen" element={<Spielen kind={kind} />} />
        <Route path="naechste-u" element={<NaechsteU kind={kind} />} />
        <Route path="u/:id" element={<NaechsteU kind={kind} />} />
      </Route>
      <Route
        path="angaben"
        element={
          <Onboarding
            vorher={profil}
            onFertig={speichern}
            onAbbrechen={() => navigate('/', { replace: true })}
          />
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
