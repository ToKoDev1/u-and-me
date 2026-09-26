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

  // Läuft das Fenster schon, ist das die wichtigere Nachricht als „zwischen U4 und U5“
  const titel = !naechste
    ? 'Bis zur U7 begleitet'
    : naechste.laeuftSchon
      ? `Zeit für die ${naechste.untersuchung.id}`
      : vorher
        ? `Zwischen ${vorher.untersuchung.id} und ${naechste.untersuchung.id}`
        : `Kurz vor der ${naechste.untersuchung.id}`;
  const unterzeile = !naechste
    ? 'Als Nächstes: die U7a mit knapp 3 Jahren'
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
            {/* Nach der U7 kein voller Ring – das sähe aus wie „100 % geschafft“ */}
            {naechste && <circle className="ring-fenster" cx="100" cy="100" r={R} style={bogen(fensterAnteil, 1)} />}
            {naechste && <circle className="ring-zeit" cx="100" cy="100" r={R} style={bogen(0, heuteAnteil)} />}
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
      {unterzeile && <p className="zeitring-unterzeile">{unterzeile}</p>}
    </section>
  );
}
