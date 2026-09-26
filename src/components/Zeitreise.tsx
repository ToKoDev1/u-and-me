import { alterAm, alterAlsText, datumFormat, tageZwischen } from '../lib/alter';
import type { Kind } from '../lib/kind';
import { UZeitleiste } from './UZeitleiste';

type Props = {
  kind: Kind;
  onDatum: (datum: Date) => void;
  onBeenden: () => void;
};

/** Test-Werkzeug: Datum per Schieberegler simulieren. Nichts wird gespeichert. */
export function Zeitreise({ kind, onDatum, onBeenden }: Props) {
  const tage = tageZwischen(kind.geburt, kind.jetzt);
  return (
    <section className="zeitreise" aria-label="Zeitreise">
      <div className="zeitreise-kopf">
        <b>Zeitreise</b>
        <span>
          {datumFormat.format(kind.jetzt)} · {kind.name ?? 'Euer Kind'}{' '}
          {tage === 0 ? 'kommt heute auf die Welt' : `ist ${alterAlsText(alterAm(kind.geburt, kind.jetzt))}`}
        </span>
        <button type="button" className="zeitreise-schliessen" onClick={onBeenden} aria-label="Zeitreise beenden">
          ×
        </button>
      </div>
      <UZeitleiste kind={kind} onDatum={onDatum} />
    </section>
  );
}
