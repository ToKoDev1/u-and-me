import { useState } from 'react';
import { etappenInfo } from '../lib/inhalte';

type Props = { fruehgeboren?: boolean; onZeitreise?: () => void };

/** Fußzeile auf jeder Seite: Haftungshinweis und Quelle – Einstellungen stecken im Menü hinter dem Avatar */
export function Fusszeile({ fruehgeboren, onZeitreise }: Props) {
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
            : 'Tragt den errechneten Termin unter „Angaben ändern“ ein (Menü hinter dem Tier oben rechts), dann rechnet U & Me damit.'}
        </p>
      )}
      {onZeitreise && (
        <div className="fusszeile-einstellungen">
          <button type="button" className="link" onClick={onZeitreise}>
            Zeitreise (Test)
          </button>
        </div>
      )}
      <p className="fusszeile-version">Version {__APP_VERSION__} · {__BUILD_DATUM__}</p>
    </footer>
  );
}
