import { Link } from 'react-router-dom';
import { datumBeiAlter, datumFormat, tageZwischen } from '../lib/alter';
import { begleitetBis, naechsteUntersuchung, uTermine, zahnTermine } from '../lib/inhalte';
import type { Kind } from '../lib/kind';
import { Symbol } from './Symbol';

type Props = {
  kind: Kind;
  /** Mit Callback wird die Leiste zum Schieberegler (Zeitreise), sonst nur Anzeige */
  onDatum?: (datum: Date) => void;
};

/**
 * Lebensabschnitte der Leiste. Über die ganze Zeit (0 bis gut 5 Jahre) wären U1–U3 winzig –
 * deshalb zeigt die Anzeige nur den Abschnitt, in dem das Kind gerade ist.
 * Die ersten zwei Jahre sind am Anfang gedehnt (Wurzel-Skala), damit U1–U3 nicht übereinanderliegen.
 */
type Abschnitt = { vonMonate: number; bisMonate: number | null; wurzel: boolean };
const ERSTE_JAHRE: Abschnitt = { vonMonate: 0, bisMonate: 24, wurzel: true };
const BIS_ZUR_EINSCHULUNG: Abschnitt = { vonMonate: 18, bisMonate: null, wurzel: false }; // null = bis „begleitet bis“
const GESAMT: Abschnitt = { vonMonate: 0, bisMonate: null, wurzel: true }; // für den Schieberegler

const SCHRITTE = 1000;
const plusTage = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);

/** Zeitleiste mit den U-Zeitfenstern als Abschnitten, „heute“ als Punkt und den Zahnarzt-Terminen darunter */
export function UZeitleiste({ kind, onDatum }: Props) {
  const tageBis = (d: Date) => tageZwischen(kind.geburt, d);
  const tageBeiMonat = (m: number) => tageBis(datumBeiAlter(kind.geburt, { monate: m }));
  const heute = tageBis(kind.jetzt);

  const abschnitt = onDatum ? GESAMT : heute < tageBeiMonat(24) ? ERSTE_JAHRE : BIS_ZUR_EINSCHULUNG;
  const startTage = tageBeiMonat(abschnitt.vonMonate);
  const endeTage = abschnitt.bisMonate === null ? tageBis(datumBeiAlter(kind.geburt, begleitetBis)) : tageBeiMonat(abschnitt.bisMonate);
  const spanne = endeTage - 1 - startTage;

  /** Tag seit Geburt → Position 0 … 1 im Abschnitt */
  const position = (tage: number) => {
    const anteil = Math.min(Math.max(tage - startTage, 0), spanne) / spanne;
    return abschnitt.wurzel ? Math.sqrt(anteil) : anteil;
  };
  const prozent = (tage: number) => `${position(tage) * 100}%`;
  /** Nur zeigen, was in den Abschnitt hineinragt */
  const sichtbar = (von: number, bis: number) => bis > startTage && von < endeTage;

  const naechste = naechsteUntersuchung(kind)?.untersuchung.id;
  const termine = uTermine(kind)
    .map((t) => ({
      ...t,
      von: tageBis(t.beginn),
      bis: tageBis(t.ende),
      zustand: kind.uErledigt[t.untersuchung.id]
        ? 'erledigt'
        : t.ende <= kind.jetzt
          ? 'vorbei'
          : t.untersuchung.id === naechste
            ? 'naechste'
            : 'kommend',
    }))
    .filter((t) => sichtbar(t.von, t.bis));

  const zahn = zahnTermine(kind)
    .map((z) => {
      const von = tageBis(z.beginn);
      const bis = tageBis(z.ende);
      return {
        ...z,
        von,
        bis,
        mitte: (position(von) + position(bis)) / 2,
        zustand: z.ende <= kind.jetzt ? 'vorbei' : z.beginn <= kind.jetzt ? 'naechste' : 'kommend',
      };
    })
    .filter((z) => sichtbar(z.von, z.bis));

  // Beschriftungen, die zu dicht liegen (U1/U2 in den ersten Tagen), zu „U1·2“ zusammenfassen
  const ABSTAND = 0.07;
  const marken: { id: string; zustand: string; mitte: number; zusammen?: string; erledigt: boolean }[] = [];
  for (const t of termine) {
    const mitte = (position(t.von) + position(t.bis)) / 2;
    const vorige = marken.at(-1);
    if (vorige && !vorige.zusammen && mitte - vorige.mitte < ABSTAND) {
      marken[marken.length - 1] = {
        id: t.untersuchung.id,
        zustand: t.zustand,
        mitte: (vorige.mitte + mitte) / 2,
        zusammen: vorige.id,
        erledigt: vorige.erledigt && t.zustand === 'erledigt', // Haken nur, wenn beide erledigt sind
      };
    } else {
      marken.push({ id: t.untersuchung.id, zustand: t.zustand, mitte, erledigt: t.zustand === 'erledigt' });
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
            onChange={(e) => onDatum(plusTage(kind.geburt, Math.round((Number(e.target.value) / SCHRITTE) ** 2 * spanne)))}
            aria-label="Datum wählen"
            aria-valuetext={datumFormat.format(kind.jetzt)}
          />
        ) : (
          <span className="zr-heute" style={{ left: prozent(heute) }} aria-hidden="true" />
        )}
      </div>

      <nav className="zr-marken" aria-label="U-Untersuchungen">
        {marken.map((m) => {
          // „U1·2“, aber „U7·7a“ – gemeinsames „U“ nur einmal
          const text = m.zusammen ? `${m.zusammen}·${m.id.slice(1)}` : m.id;
          return (
            <Link
              key={m.id}
              to={`/u/${m.id}`}
              className={m.zustand}
              style={{ left: `${m.mitte * 100}%` }}
              aria-label={(m.zusammen ? `${m.zusammen} und ${m.id}` : m.id) + (m.erledigt ? ', erledigt' : '')}
            >
              {m.erledigt && (
                <span className="zr-haken" aria-hidden="true">
                  <Symbol name="haken" />
                </span>
              )}
              {text}
            </Link>
          );
        })}
      </nav>

      {/* Zweite, leisere Zeile: Zahnarzt-Termine */}
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
