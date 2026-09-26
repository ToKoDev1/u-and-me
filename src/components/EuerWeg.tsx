import { datumFormat, heute, parseDatum, spanneAlsText } from '../lib/alter';
import { bereichsName, etappenInfo, maskottchenBild, wegEintraege } from '../lib/inhalte';
import type { Profil } from '../lib/speicher';

type Props = { profil: Profil };

const monatJahr = new Intl.DateTimeFormat('de-DE', { month: 'short', year: 'numeric' });

export function EuerWeg({ profil }: Props) {
  const geburt = parseDatum(profil.geburtsdatum);
  const jetzt = heute();
  const eintraege = wegEintraege(geburt, jetzt);

  return (
    <>
      <section>
        <h1>Euer Weg</h1>
        <p className="gedaempft">
          Alle U-Untersuchungen und die Etappen dazwischen. Die Etappen stehen dort, wo sie frühestens typisch sind –
          viele Kinder sind später dran, und das ist normal.
        </p>
        {etappenInfo.status === 'entwurf' && (
          <p className="entwurf">Entwurf – diese Inhalte sind noch nicht fachlich geprüft.</p>
        )}
      </section>

      <ol className="zeitstrahl">
        {eintraege.map((e) => {
          if (e.art === 'heute') {
            return (
              <li key="heute" className="weg-heute">
                <img src={maskottchenBild(profil.maskottchen, true)} alt="" />
                <strong>Du bist hier</strong>
                <span className="gedaempft">{datumFormat.format(jetzt)}</span>
              </li>
            );
          }
          // Vorbei = Zeitfenster zu Ende; läuft = gerade im Zeitfenster
          const vorbei = e.ende <= jetzt;
          const laeuft = !vorbei && e.datum <= jetzt;
          const zustand = vorbei ? 'vorbei' : laeuft ? 'laeuft' : '';
          if (e.art === 'u') {
            return (
              <li key={e.untersuchung.id} className={`weg-u ${zustand}`}>
                <span className="u-marke">{e.untersuchung.id}</span>
                <div>
                  <strong>{e.untersuchung.id}-Untersuchung</strong>
                  <p className="gedaempft">
                    {e.untersuchung.zeitraum} · {datumFormat.format(e.datum)}
                    {e.untersuchung.id !== 'U1' && ` bis ${datumFormat.format(new Date(e.ende.getTime() - 1))}`}
                  </p>
                </div>
              </li>
            );
          }
          return (
            <li key={e.etappe.id} className={`weg-etappe bereich-${e.etappe.bereich} ${zustand}`}>
              <span className="punkt" />
              <div>
                <strong>{e.etappe.titel}</strong>
                <p className="gedaempft">
                  {bereichsName[e.etappe.bereich]} · meist mit {spanneAlsText(e.etappe.von, e.etappe.bis)} · ab{' '}
                  {monatJahr.format(e.datum)}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </>
  );
}
