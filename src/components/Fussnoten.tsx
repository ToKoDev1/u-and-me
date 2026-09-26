import { useState } from 'react';
import { Link } from 'react-router-dom';
import { darstellungLaden, darstellungSpeichern, type Darstellung } from '../lib/darstellung';
import type { Quelle } from '../lib/inhalte';

const optionen: { wert: Darstellung; text: string }[] = [
  { wert: 'auto', text: 'Automatisch' },
  { wert: 'hell', text: 'Hell' },
  { wert: 'dunkel', text: 'Dunkel' },
];

type Props = { quelle: Quelle; fruehgeboren?: boolean };

/** Quelle, Frühchen-Hinweis, ärztliche Beratung, Angaben ändern, Hell/Dunkel */
export function Fussnoten({ quelle, fruehgeboren }: Props) {
  const [darstellung, setDarstellung] = useState(darstellungLaden);
  const [fruehInfo, setFruehInfo] = useState(false);

  return (
    <div className="fussnoten">
      <p>
        Quelle: <a href={quelle.url} target="_blank" rel="noreferrer">{quelle.name}</a> · Frühgeboren?{' '}
        <button type="button" className="link" aria-expanded={fruehInfo} onClick={() => setFruehInfo(!fruehInfo)}>
          Korrigiertes Alter
        </button>
      </p>
      {fruehInfo && (
        <div className="hinweisbox">
          <span className="hinweisbox-punkt sprache" />
          <p>
            <b>Frühgeboren?</b> Für die Entwicklung zählt das <i>korrigierte Alter</i> – ab dem errechneten Termin.
            Die U-Termine richten sich nach dem tatsächlichen Geburtsdatum.{' '}
            {fruehgeboren
              ? 'Ihr habt einen errechneten Termin eingetragen – die Etappen sind danach berechnet.'
              : 'Tragt unter „Angaben ändern“ den errechneten Termin ein, dann rechnet U & Me damit.'}
          </p>
        </div>
      )}
      <p>U &amp; Me ersetzt keine ärztliche Beratung.</p>
      <p>
        <Link to="/angaben">Angaben ändern</Link>
      </p>
      <div className="darstellung" role="group" aria-label="Darstellung">
        <span>Darstellung:</span>
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
      </div>
    </div>
  );
}
