import { datumFormat, parseDatum } from '../lib/alter';
import type { UTermin } from '../lib/inhalte';
import type { Kind } from '../lib/kind';
import type { Notizen } from '../lib/speicher';
import { Symbol } from './Symbol';

type Props = { termin: UTermin; kind: Kind; notizen: Notizen; onNotizen: (n: Notizen) => void };

/**
 * U abhaken: „Als erledigt abhaken“ → „Erledigt am …“ (Datum änderbar, rückgängig machbar).
 * Erst möglich, wenn das Zeitfenster begonnen hat. Keine Wertung – nur eine Notiz für euch.
 */
export function UAbhaken({ termin, kind, notizen, onNotizen }: Props) {
  const id = termin.untersuchung.id;
  const datum = notizen.uErledigt[id];
  const heute = kind.jetzt.toLocaleDateString('sv-SE'); // YYYY-MM-DD, bei der Zeitreise das simulierte Datum

  const setzen = (wert: string | null) => {
    const uErledigt = { ...notizen.uErledigt };
    if (wert) uErledigt[id] = wert;
    else delete uErledigt[id];
    onNotizen({ ...notizen, uErledigt });
  };

  if (datum) {
    return (
      <div className="u-abgehakt">
        <span className="u-abgehakt-text">
          <Symbol name="haken" /> {id} erledigt am
        </span>
        <input
          type="date"
          value={datum}
          max={heute}
          aria-label={`Datum der ${id}`}
          onChange={(e) => e.target.value && setzen(e.target.value)}
        />
        <button type="button" className="link-leise" onClick={() => setzen(null)}>
          Rückgängig
        </button>
        <span className="nur-screenreader" aria-live="polite">
          {id} als erledigt gespeichert am {datumFormat.format(parseDatum(datum))}
        </span>
      </div>
    );
  }

  if (termin.beginn > kind.jetzt) return null;
  return (
    <button type="button" className="knopf knopf-zweit knopf-mit-symbol" onClick={() => setzen(heute)}>
      <Symbol name="haken" /> {id} als erledigt abhaken
    </button>
  );
}
