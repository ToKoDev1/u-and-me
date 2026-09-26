import { alterAm, alterAlsText, datumBeiAlter, datumFormat, tageZwischen } from '../lib/alter';
import { uTermine } from '../lib/inhalte';
import type { Kind } from '../lib/kind';

type Props = {
  kind: Kind;
  /** das echte Heute – für den „Heute“-Knopf */
  heute: Date;
  onDatum: (datum: Date) => void;
  onBeenden: () => void;
};

const plusTage = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const plusMonate = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth() + n, d.getDate());

/**
 * Test-Werkzeug: Datum simulieren und so die ganze Reise von der Geburt bis zur U7 durchgehen.
 * Nichts wird gespeichert – beim Neuladen ist wieder „heute“.
 */
export function Zeitreise({ kind, heute, onDatum, onBeenden }: Props) {
  const ende = plusTage(datumBeiAlter(kind.geburt, { monate: 24 }), -1);
  const maxTage = tageZwischen(kind.geburt, ende);
  const tage = tageZwischen(kind.geburt, kind.jetzt);

  const setzen = (d: Date) => onDatum(d < kind.geburt ? kind.geburt : d > ende ? ende : d);

  return (
    <section className="zeitreise" aria-label="Zeitreise">
      <div className="zeitreise-kopf">
        <b>Zeitreise</b>
        <span>
          {datumFormat.format(kind.jetzt)} · {kind.name ?? 'Euer Kind'} ist {alterAlsText(alterAm(kind.geburt, kind.jetzt))}
        </span>
        <button type="button" className="zeitreise-schliessen" onClick={onBeenden} aria-label="Zeitreise beenden">
          ×
        </button>
      </div>
      <input
        type="range"
        min={0}
        max={maxTage}
        step={1}
        value={Math.min(Math.max(tage, 0), maxTage)}
        onChange={(e) => setzen(plusTage(kind.geburt, Number(e.target.value)))}
        aria-label="Alter in Tagen"
      />
      <div className="zeitreise-knoepfe">
        <button type="button" onClick={() => setzen(plusMonate(kind.jetzt, -1))}>−1 Monat</button>
        <button type="button" onClick={() => setzen(plusTage(kind.jetzt, -7))}>−1 Woche</button>
        <button type="button" onClick={() => setzen(heute)}>Heute</button>
        <button type="button" onClick={() => setzen(plusTage(kind.jetzt, 7))}>+1 Woche</button>
        <button type="button" onClick={() => setzen(plusMonate(kind.jetzt, 1))}>+1 Monat</button>
      </div>
      <div className="zeitreise-knoepfe">
        <span>Springen zu:</span>
        {uTermine(kind).map((t) => (
          <button key={t.untersuchung.id} type="button" onClick={() => setzen(t.beginn)}>
            {t.untersuchung.id}
          </button>
        ))}
      </div>
    </section>
  );
}
