import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { Heute } from './components/Heute';
import { Begegnen, Entwicklung, Spielen, Zahnarzt } from './components/Unterseiten';
import { Datenschutz } from './components/Datenschutz';
import { Erledigen, FuerEuch, WocheSeite } from './components/ErsteZeit';
import { NaechsteU } from './components/NaechsteU';
import { Onboarding } from './components/Onboarding';
import { Rahmen } from './components/Rahmen';
import { USchritte } from './components/USchritte';
import { Willkommen } from './components/Willkommen';
import { Zeitreise } from './components/Zeitreise';
import { heute } from './lib/alter';
import { akzentSetzen } from './lib/darstellung';
import { kindAus } from './lib/kind';
import {
  aktivesKind,
  alsProfil,
  datenLaden,
  datenSpeichern,
  kindAendern,
  kindEntfernen,
  kindHinzufuegen,
  kindWaehlen,
  leereDaten,
  notizenSetzen,
  tourGesehen,
  tourMerken,
  type Daten,
  type Notizen,
  type Profil,
} from './lib/speicher';

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
  const [daten, setDaten] = useState<Daten>(() => (demoProfil ? kindHinzufuegen(leereDaten(), demoProfil) : datenLaden()));
  const eintrag = aktivesKind(daten);
  const profil = eintrag?.profil ?? null;
  const [tourVorbei, setTourVorbei] = useState(tourGesehen);
  const [zeitreiseAn, setZeitreiseAn] = useState(url.has('zeitreise'));
  const [simuliert, setSimuliert] = useState<Date | null>(null);
  const navigate = useNavigate();

  // Persönlicher Akzent nach gewähltem Maskottchen
  useEffect(() => akzentSetzen(profil?.maskottchen), [profil]);

  /** Neuen Stand übernehmen und speichern (im Demo-Modus nur im Speicher der Seite) */
  function aendern(neu: Daten) {
    setDaten(neu);
    if (!demoProfil) datenSpeichern(neu);
  }

  const zurStartseite = () => navigate('/', { replace: true }); // Zurück-Knopf führt nicht wieder ins Formular

  /** Angaben aus dem Formular: aktives Kind ändern – oder das erste Kind anlegen */
  function speichern(neu: Profil) {
    aendern(eintrag ? kindAendern(daten, eintrag.id, neu) : kindHinzufuegen(daten, neu));
    zurStartseite();
  }

  function kindNeu(neu: Profil) {
    aendern(kindHinzufuegen(daten, neu));
    zurStartseite();
  }

  function entfernen() {
    if (!eintrag) return;
    const name = eintrag.profil.name ?? 'dieses Kind';
    if (!window.confirm(`Alle Angaben, Notizen und Fragen zu ${name} auf diesem Gerät löschen?`)) return;
    aendern(kindEntfernen(daten, eintrag.id));
    zurStartseite();
  }

  function waehlen(id: string) {
    aendern(kindWaehlen(daten, id));
    navigate('/'); // nach dem Wechsel auf die Startseite des Kindes
  }

  const mehrereKinder = daten.kinder.length > 1;

  const notizenAendern = (notizen: Notizen) => eintrag && aendern(notizenSetzen(daten, eintrag.id, notizen));

  // Erstes Öffnen: erst die Welcome-Tour, dann die Angaben zum Kind
  if (!profil && !tourVorbei) {
    return (
      <Willkommen
        fertigText="Los geht's"
        onFertig={() => {
          tourMerken();
          setTourVorbei(true);
        }}
      />
    );
  }
  if (!profil || !eintrag) return <Onboarding onFertig={speichern} />;

  const echtesHeute = heute();
  const kind = kindAus(profil, zeitreiseAn && simuliert ? simuliert : echtesHeute, eintrag.id);

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
            daten={daten}
            onKindWaehlen={waehlen}
            oben={zeitreise}
            onZeitreise={zeitreiseVerfuegbar && !zeitreiseAn ? () => setZeitreiseAn(true) : undefined}
          />
        }
      >
        <Route index element={<Heute kind={kind} notizen={eintrag.notizen} />} />
        <Route path="woche" element={<WocheSeite kind={kind} />} />
        <Route path="woche/:nr" element={<WocheSeite kind={kind} />} />
        <Route path="erledigen" element={<Erledigen kind={kind} notizen={eintrag.notizen} onNotizen={notizenAendern} />} />
        <Route path="fuer-euch" element={<FuerEuch />} />
        <Route path="begegnen" element={<Begegnen kind={kind} />} />
        <Route path="entwicklung" element={<Entwicklung kind={kind} />} />
        <Route path="spielen" element={<Spielen kind={kind} />} />
        <Route path="zahnarzt" element={<Zahnarzt kind={kind} />} />
        <Route path="naechste-u" element={<NaechsteU kind={kind} notizen={eintrag.notizen} onNotizen={notizenAendern} />} />
        <Route path="u/:id" element={<NaechsteU kind={kind} notizen={eintrag.notizen} onNotizen={notizenAendern} />} />
        <Route path="datenschutz" element={<Datenschutz />} />
      </Route>
      <Route
        path="angaben"
        element={
          <Onboarding
            key={eintrag.id}
            vorher={profil}
            onFertig={speichern}
            onAbbrechen={zurStartseite}
            nameNoetig={mehrereKinder}
            onEntfernen={mehrereKinder ? entfernen : undefined}
          />
        }
      />
      <Route
        path="kind-neu"
        element={
          <Onboarding
            onFertig={kindNeu}
            onAbbrechen={zurStartseite}
            nameNoetig
            akzentDanach={profil.maskottchen}
          />
        }
      />
      <Route path="u/:id/schritte" element={<USchritte kind={kind} notizen={eintrag.notizen} />} />
      <Route path="tour" element={<Willkommen fertigText="Zur App" onFertig={() => navigate('/', { replace: true })} />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
