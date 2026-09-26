import { useState } from 'react';
import { Link } from 'react-router-dom';
import { darstellungLaden, darstellungSpeichern, type Darstellung } from '../lib/darstellung';
import { etappenInfo } from '../lib/inhalte';

const optionen: { wert: Darstellung; text: string }[] = [
  { wert: 'hell', text: 'Hell' },
  { wert: 'dunkel', text: 'Dunkel' },
  { wert: 'auto', text: 'Wie das Gerät' },
];

type Props = { fruehgeboren?: boolean; onZeitreise?: () => void };

/** Einheitliche Fußzeile auf jeder Seite: Hinweise, Quelle, Einstellungen – klein und immer am Seitenende */
export function Fusszeile({ fruehgeboren, onZeitreise }: Props) {
  const [darstellung, setDarstellung] = useState(darstellungLaden);
  const [fruehInfo, setFruehInfo] = useState(false);
  const quelle = etappenInfo.quelle;

  return (
    <footer className="fusszeile">
      <p>
        {etappenInfo.status === 'entwurf' && <>Entwurf – Inhalte noch nicht fachlich geprüft · </>}
        Quelle: <a href={quelle.url} target="_blank" rel="noreferrer">{quelle.name}</a>
      </p>
      <p>
        U &amp; Me ersetzt keine ärztliche Beratung · Frühgeboren?{' '}
        <button type="button" className="link" aria-expanded={fruehInfo} onClick={() => setFruehInfo(!fruehInfo)}>
          Korrigiertes Alter
        </button>
      </p>
      {fruehInfo && (
        <p className="fusszeile-info">
          Für die Entwicklung zählt das <i>korrigierte Alter</i> – ab dem errechneten Termin. Die U-Termine richten sich
          nach dem tatsächlichen Geburtsdatum.{' '}
          {fruehgeboren
            ? 'Ihr habt einen errechneten Termin eingetragen – die Etappen sind danach berechnet.'
            : 'Tragt unter „Angaben ändern“ den errechneten Termin ein, dann rechnet U & Me damit.'}
        </p>
      )}
      <div className="fusszeile-einstellungen">
        <Link to="/angaben">Angaben ändern</Link>
        <span className="darstellung" role="group" aria-label="Darstellung">
          {optionen.map((o) => (
            <button
              key={o.wert}
              type="button"
              aria-pressed={darstellung === o.wert}
              onClick={() => {
                darstellungSpeichern(o.wert);
                setDarstellung(o.wert);
              }}
            >
              {o.text}
            </button>
          ))}
        </span>
        {onZeitreise && (
          <button type="button" className="link" onClick={onZeitreise}>
            Zeitreise (Test)
          </button>
        )}
      </div>
    </footer>
  );
}
