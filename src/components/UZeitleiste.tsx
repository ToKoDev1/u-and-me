import { Link } from 'react-router-dom';
import { datumBeiAlter, datumFormat, tageZwischen } from '../lib/alter';
import { naechsteUntersuchung, uTermine, zahnTermine } from '../lib/inhalte';
import type { Kind } from '../lib/kind';

type Props = {
  kind: Kind;
  /** Mit Callback wird die Leiste zum Schieberegler (Zeitreise), sonst nur Anzeige */
  onDatum?: (datum: Date) => void;
};

const SCHRITTE = 1000;
const plusTage = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);

/**
 * Zeitleiste U1–U7 mit den U-Zeitfenstern als Abschnitten und „heute“ als Punkt.
 * Die Achse ist am Anfang gedehnt (Wurzel-Skala), damit U1–U3 in den ersten Wochen
 * nicht übereinanderliegen.
 */
export function UZeitleiste({ kind, onDatum }: Props) {
  const maxTage = tageZwischen(kind.geburt, datumBeiAlter(kind.geburt, { monate: 24 })) - 1;
  const position = (tage: number) => Math.sqrt(Math.min(Math.max(tage, 0), maxTage) / maxTage); // 0 … 1
  const prozent = (tage: number) => `${position(tage) * 100}%`;
  const tageBis = (d: Date) => tageZwischen(kind.geburt, d);

  const heute = tageBis(kind.jetzt);
  const naechste = naechsteUntersuchung(kind)?.untersuchung.id;
  const termine = uTermine(kind).map((t) => ({
    ...t,
    von: tageBis(t.beginn),
    bis: tageBis(t.ende),
    zustand: t.ende <= kind.jetzt ? 'vorbei' : t.untersuchung.id === naechste ? 'naechste' : 'kommend',
  }));

  const zahn = zahnTermine(kind).map((z) => {
    const von = tageBis(z.beginn);
    const bis = tageBis(z.ende);
    return {
      ...z,
      von,
      bis,
      mitte: (position(von) + position(bis)) / 2,
      zustand: z.ende <= kind.jetzt ? 'vorbei' : z.beginn <= kind.jetzt ? 'naechste' : 'kommend',
    };
  });

  // Beschriftungen, die zu dicht liegen (U1/U2 in den ersten Tagen), zu „U1·2“ zusammenfassen
  const ABSTAND = 0.07;
  const marken: { id: string; zustand: string; mitte: number; zusammen?: string }[] = [];
  for (const t of termine) {
    const mitte = (position(t.von) + position(t.bis)) / 2;
    const vorige = marken.at(-1);
    if (vorige && !vorige.zusammen && mitte - vorige.mitte < ABSTAND) {
      marken[marken.length - 1] = { id: t.untersuchung.id, zustand: t.zustand, mitte: (vorige.mitte + mitte) / 2, zusammen: vorige.id };
    } else {
      marken.push({ id: t.untersuchung.id, zustand: t.zustand, mitte });
    }
  }

  return (
    <div className={`u-zeitleiste ${onDatum ? 'interaktiv' : ''}`}>
      <div className="zr-schiene">
        <div className="zr-spur" aria-hidden="true">
          {termine.map((t) => (
            <span
              key={t.untersuchung.id}
              className={`zr-fenster ${t.zustand}`}
              style={{ left: prozent(t.von), width: `calc(${prozent(t.bis)} - ${prozent(t.von)})` }}
            />
          ))}
        </div>
        {onDatum ? (
          <input
            type="range"
            className="zr-regler"
            min={0}
            max={SCHRITTE}
            step={1}
            value={Math.round(position(heute) * SCHRITTE)}
            onChange={(e) => onDatum(plusTage(kind.geburt, Math.round((Number(e.target.value) / SCHRITTE) ** 2 * maxTage)))}
            aria-label="Datum wählen"
            aria-valuetext={datumFormat.format(kind.jetzt)}
          />
        ) : (
          <span className="zr-heute" style={{ left: prozent(heute) }} aria-hidden="true" />
        )}
      </div>

      <nav className="zr-marken" aria-label="U-Untersuchungen">
        {marken.map((m) => (
          <Link
            key={m.id}
            to={`/u/${m.id}`}
            className={m.zustand}
            style={{ left: `${m.mitte * 100}%` }}
            aria-label={m.zusammen ? `${m.zusammen} und ${m.id}` : m.id}
          >
            {m.zusammen ? `${m.zusammen}·${m.id.slice(1)}` : m.id}
          </Link>
        ))}
      </nav>

      {/* Zweite, leisere Zeile: Zahnarzt-Termine Z1–Z3 (Z3 reicht über 24 Monate hinaus) */}
      <nav className="zr-zahn" aria-label="Zahnarzt-Termine">
        {zahn.map((z) => (
          <span key={z.termin.id}>
            <span
              className={`zr-zahnfenster ${z.zustand}`}
              style={{ left: prozent(z.von), width: `calc(${prozent(z.bis)} - ${prozent(z.von)})` }}
              aria-hidden="true"
            />
            <Link to="/zahnarzt" className={z.zustand} style={{ left: `${z.mitte * 100}%` }} aria-label={`Zahnarzt ${z.termin.id}`}>
              {z.termin.id}
            </Link>
          </span>
        ))}
      </nav>
    </div>
  );
}
