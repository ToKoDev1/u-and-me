import { alterAm, alterAlsText, datumBeiAlter, datumFormat, tageZwischen } from '../lib/alter';
import { uTermine } from '../lib/inhalte';
import type { Kind } from '../lib/kind';

type Props = {
  kind: Kind;
  onDatum: (datum: Date) => void;
  onBeenden: () => void;
};

const SCHRITTE = 1000;
const plusTage = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);

/**
 * Test-Werkzeug: Datum per Schieberegler simulieren – mit den U-Terminen als Marken auf der Schiene.
 * Die Schiene ist am Anfang gedehnt (Wurzel-Skala): Die ersten Wochen, in denen U1–U3 liegen
 * und sich viel tut, bekommen mehr Platz. Nichts wird gespeichert.
 */
export function Zeitreise({ kind, onDatum, onBeenden }: Props) {
  const maxTage = tageZwischen(kind.geburt, datumBeiAlter(kind.geburt, { monate: 24 })) - 1;
  const position = (tage: number) => Math.sqrt(Math.min(Math.max(tage, 0), maxTage) / maxTage); // 0 … 1
  const tageAus = (wert: number) => Math.round((wert / SCHRITTE) ** 2 * maxTage);
  const prozent = (tage: number) => `${position(tage) * 100}%`;

  const tage = tageZwischen(kind.geburt, kind.jetzt);
  const termine = uTermine(kind);

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

      <div className="zr-schiene">
        {/* U-Zeitfenster als Abschnitte auf der Schiene */}
        <div className="zr-spur" aria-hidden="true">
          {termine.map((t) => {
            const von = tageZwischen(kind.geburt, t.beginn);
            const bis = tageZwischen(kind.geburt, t.ende);
            return (
              <span
                key={t.untersuchung.id}
                className="zr-fenster"
                style={{ left: prozent(von), width: `calc(${prozent(bis)} - ${prozent(von)})` }}
              />
            );
          })}
        </div>
        <input
          type="range"
          className="zr-regler"
          min={0}
          max={SCHRITTE}
          step={1}
          value={Math.round(position(tage) * SCHRITTE)}
          onChange={(e) => onDatum(plusTage(kind.geburt, tageAus(Number(e.target.value))))}
          aria-label="Datum wählen"
          aria-valuetext={datumFormat.format(kind.jetzt)}
        />
      </div>

      <div className="zr-marken" aria-hidden="true">
        {termine.map((t) => (
          <span
            key={t.untersuchung.id}
            style={{
              // mittig unter dem Zeitfenster
              left: `${((position(tageZwischen(kind.geburt, t.beginn)) + position(tageZwischen(kind.geburt, t.ende))) / 2) * 100}%`,
            }}
          >
            {t.untersuchung.id}
          </span>
        ))}
      </div>
    </section>
  );
}
