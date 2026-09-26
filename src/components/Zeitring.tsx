import { alterAm, alterAlsText, kurzDatum, letzterTag } from '../lib/alter';
import { maskottchenBild, naechsteUntersuchung, vorherigeUntersuchung } from '../lib/inhalte';
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

  const titel =
    vorher && naechste
      ? `Zwischen ${vorher.untersuchung.id} und ${naechste.untersuchung.id}`
      : naechste
        ? `Kurz vor der ${naechste.untersuchung.id}`
        : 'Bis zum 2. Geburtstag begleitet';
  const unterzeile = !naechste
    ? ''
    : naechste.laeuftSchon
      ? `${naechste.untersuchung.id}-Fenster läuft bis ${kurzDatum.format(letzterTag(naechste.ende))}`
      : `${naechste.untersuchung.id}-Fenster ab ${kurzDatum.format(naechste.beginn)}`;

  // Bogen: Anfang oben (−90°), im Uhrzeigersinn
  const bogen = (von: number, bis: number) => ({
    strokeDasharray: `${Math.max(0, bis - von) * UMFANG} ${UMFANG}`,
    strokeDashoffset: -von * UMFANG,
  });

  return (
    <section className="zeitring" aria-label={`${titel}. ${unterzeile}`}>
      <div className="zeitring-grafik">
        <svg viewBox="0 0 200 200" aria-hidden="true">
          <g transform="rotate(-90 100 100)">
            <circle className="ring-spur" cx="100" cy="100" r={R} />
            {naechste && <circle className="ring-fenster" cx="100" cy="100" r={R} style={bogen(fensterAnteil, 1)} />}
            <circle className="ring-zeit" cx="100" cy="100" r={R} style={bogen(0, heuteAnteil)} />
          </g>
        </svg>
        <div className="zeitring-mitte">
          {/* Ganzes Maskottchen, freigestellt – der Ring ist der Rahmen */}
          <img className="zeitring-tier" src={maskottchenBild(kind.profil.maskottchen)} alt="" />
        </div>
      </div>
      <p className="zeitring-alter">
        {alter.tage === 0 ? 'Heute geboren' : alterAlsText(alter)}
      </p>
      <p className="zeitring-titel">{titel}</p>
      {unterzeile && <p className="zeitring-unterzeile">{unterzeile}</p>}
    </section>
  );
}
