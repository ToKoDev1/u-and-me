import { abstandAlsText, alterAm, alterAlsText, kurzDatum, letzterTag, monatJahr, tageZwischen } from '../lib/alter';
import {
  letzteUntersuchung,
  maskottchenBild,
  naechsteUntersuchung,
  vorherigeUntersuchung,
  zahnTermine,
} from '../lib/inhalte';
import type { Kind } from '../lib/kind';

const R = 88; // Radius des Rings
const UMFANG = 2 * Math.PI * R;

/**
 * Das Zentrum der Startseite: Ring von der letzten zur nächsten U.
 * Er zeigt nur, wie viel ZEIT vergangen ist – keine Bewertung des Kindes.
 */
export function Zeitring({ kind }: { kind: Kind }) {
  const vorher = vorherigeUntersuchung(kind);
  const naechste = naechsteUntersuchung(kind);
  const alter = alterAm(kind.geburt, kind.jetzt);

  const start = (vorher?.beginn ?? kind.geburt).getTime();
  const ende = (naechste?.ende ?? kind.jetzt).getTime();
  const anteil = (d: Date) => (ende > start ? Math.min(1, Math.max(0, (d.getTime() - start) / (ende - start))) : 1);
  const heuteAnteil = anteil(kind.jetzt);
  const fensterAnteil = naechste ? anteil(naechste.beginn) : 1;

  // Läuft das Fenster schon, ist das die wichtigere Nachricht als „zwischen U4 und U5“
  const titel = !naechste
    ? `Bis zur ${letzteUntersuchung.id} begleitet`
    : naechste.laeuftSchon
      ? `Zeit für die ${naechste.untersuchung.id}`
      : vorher
        ? `Zwischen ${vorher.untersuchung.id} und ${naechste.untersuchung.id}`
        : `Kurz vor der ${naechste.untersuchung.id}`;
  const unterzeile = !naechste
    ? null
    : naechste.laeuftSchon
      ? `${naechste.untersuchung.id}-Fenster läuft bis ${kurzDatum.format(letzterTag(naechste.ende))}`
      : `${naechste.untersuchung.id}-Fenster ab ${kurzDatum.format(naechste.beginn)}`;

  // Kennzahlen unter dem Ring – nur Zeitangaben, nichts, was das Kind bewertet
  const tageAlt = tageZwischen(kind.geburt, kind.jetzt);
  const zahn = zahnTermine(kind).find((z) => kind.jetzt < z.ende);
  const kennzahlen = [
    tageAlt > 0 && tageAlt < 365 && { wert: String(tageAlt), text: tageAlt === 1 ? 'Tag alt' : 'Tage alt' },
    naechste && {
      wert: naechste.untersuchung.id,
      text: naechste.laeuftSchon
        ? `bis ${kurzDatum.format(letzterTag(naechste.ende))}`
        : abstandAlsText(tageZwischen(kind.jetzt, naechste.beginn)),
    },
    zahn && { wert: zahn.termin.id, text: zahn.beginn <= kind.jetzt ? 'jetzt dran' : `ab ${monatJahr.format(zahn.beginn)}` },
  ].filter((k): k is { wert: string; text: string } => !!k);

  // Punkt auf dem Ring (im gedrehten Koordinatensystem: 0 = oben)
  const punkt = (a: number) => ({ cx: 100 + R * Math.cos(2 * Math.PI * a), cy: 100 + R * Math.sin(2 * Math.PI * a) });

  // Bogen: Anfang oben (−90°), im Uhrzeigersinn
  const bogen = (von: number, bis: number) => ({
    strokeDasharray: `${Math.max(0, bis - von) * UMFANG} ${UMFANG}`,
    strokeDashoffset: -von * UMFANG,
  });

  return (
    <section className="zeitring" aria-label={unterzeile ? `${titel}. ${unterzeile}` : titel}>
      <div className="zeitring-grafik">
        <svg viewBox="0 0 200 200" aria-hidden="true">
          <g transform="rotate(-90 100 100)">
            <circle className="ring-spur" cx="100" cy="100" r={R} />
            {/* Nach der letzten U kein voller Ring – das sähe aus wie „100 % geschafft“ */}
            {naechste && <circle className="ring-fenster" cx="100" cy="100" r={R} style={bogen(fensterAnteil, 1)} />}
            {naechste && (
              <circle
                className="ring-zeit"
                cx="100"
                cy="100"
                r={R}
                style={bogen(0, heuteAnteil)}
              />
            )}
            {/* feine Markierung: hier beginnt das U-Fenster */}
            {naechste && fensterAnteil > 0.02 && fensterAnteil < 0.98 && (
              <circle className="ring-marke" r="3" {...punkt(fensterAnteil)} />
            )}
            {/* „heute“ – kleiner Knopf am Ende des Bogens */}
            {naechste && <circle className="ring-heute" r="7.5" {...punkt(heuteAnteil)} />}
          </g>
        </svg>
        <div className="zeitring-mitte">
          {/* Ganzes Maskottchen, freigestellt – der Ring ist der Rahmen */}
          <img className="zeitring-tier" src={maskottchenBild(kind.profil.maskottchen)} alt="" />
        </div>
      </div>
      <h1 className="zeitring-alter" tabIndex={-1}>
        {alter.tage === 0 ? (
          <>Willkommen{kind.name ? `, ${kind.name}` : ''}</>
        ) : (
          <>
            {kind.name && <span className="zeitring-name">{kind.name}</span>}
            {alterAlsText(alter)}
          </>
        )}
      </h1>
      <p className="zeitring-titel">{titel}</p>
      {kennzahlen.length > 0 ? (
        <dl className="kennzahlen">
          {kennzahlen.map((k) => (
            <div key={k.wert} className="kennzahl">
              <dt className="kennzahl-wert">{k.wert}</dt>
              <dd className="kennzahl-text">{k.text}</dd>
            </div>
          ))}
        </dl>
      ) : (
        unterzeile && <p className="zeitring-unterzeile">{unterzeile}</p>
      )}
    </section>
  );
}
