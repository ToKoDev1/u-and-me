import { abstandAlsText, alterAm, alterAlsText, datumFormat, heute, parseDatum, spanneAlsText, tageZwischen } from '../lib/alter';
import {
  aktuelleEtappen,
  aktuellePhase,
  etappenInfo,
  kommendeEtappen,
  naechsteUntersuchung,
  untersuchungenQuelle,
} from '../lib/inhalte';
import type { Profil } from '../lib/speicher';
import { EtappenKarte } from './EtappenKarte';

type Props = { profil: Profil };

export function DuBistHier({ profil }: Props) {
  const geburt = parseDatum(profil.geburtsdatum);
  const jetzt = heute();
  const alter = alterAm(geburt, jetzt);
  const phase = aktuellePhase(geburt, jetzt);
  const aktuell = aktuelleEtappen(geburt, jetzt);
  const begegnen = aktuell.filter((e) => e.bereich === 'alltag');
  const geradeDran = aktuell.filter((e) => e.bereich !== 'alltag');
  const demnaechst = kommendeEtappen(geburt, jetzt);
  const naechsteU = naechsteUntersuchung(geburt, jetzt);
  const wer = profil.name ?? 'Euer Kind';

  return (
    <>
      <header className="kopf">
        <div>
          <p className="gedaempft">{wer} ist heute</p>
          <p className="alter">{alterAlsText(alter)}</p>
        </div>
      </header>

      {!phase && (
        <p className="karte">U &amp; Me begleitet euch aktuell bis zum 2. Geburtstag. Für ältere Kinder folgen die Inhalte später.</p>
      )}

      {phase && (
        <>
          <section>
            <p className="gedaempft">Du bist hier</p>
            <h1>{phase.titel}</h1>
            {etappenInfo.status === 'entwurf' && (
              <p className="entwurf">Entwurf – diese Inhalte sind noch nicht fachlich geprüft.</p>
            )}
          </section>

          {begegnen.length > 0 && (
            <section>
              <h2>Was euch gerade begegnen kann</h2>
              {begegnen.map((e) => <EtappenKarte key={e.id} etappe={e} />)}
            </section>
          )}

          {geradeDran.length > 0 && (
            <section>
              <h2>Gerade dran</h2>
              {geradeDran.map((e) => <EtappenKarte key={e.id} etappe={e} />)}
            </section>
          )}

          {demnaechst.length > 0 && (
            <section>
              <h2>Als Nächstes</h2>
              <ul className="karte vorschau-liste">
                {demnaechst.map((e) => (
                  <li key={e.id}>
                    <strong>{e.titel}</strong>
                    <span className="gedaempft"> · meist mit {spanneAlsText(e.von, e.bis)}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {phase.abklaeren && (
            <section className="karte abklaeren">
              <h2>Nicht bis zur nächsten U warten, wenn …</h2>
              <ul>{phase.abklaeren.map((p) => <li key={p}>{p}</li>)}</ul>
              <p>… sprecht in diesen Fällen lieber zeitnah mit eurer Kinderarztpraxis.</p>
            </section>
          )}

          <p className="quelle">
            Quelle: <a href={etappenInfo.quelle.url} target="_blank" rel="noreferrer">{etappenInfo.quelle.name}</a>
          </p>
        </>
      )}

      {naechsteU && (
        <section className="karte naechste-u">
          <p className="gedaempft">Nächste Untersuchung</p>
          <h2>
            {naechsteU.untersuchung.id} –{' '}
            {naechsteU.laeuftSchon ? 'Zeitfenster läuft' : abstandAlsText(tageZwischen(jetzt, naechsteU.beginn))}
          </h2>
          <p>
            {naechsteU.untersuchung.zeitraum}: {datumFormat.format(naechsteU.beginn)} bis{' '}
            {datumFormat.format(new Date(naechsteU.ende.getTime() - 1))}
          </p>
          <p className="quelle">
            Quelle: <a href={untersuchungenQuelle.url} target="_blank" rel="noreferrer">{untersuchungenQuelle.name}</a>
          </p>
        </section>
      )}

      <aside className="hinweis">
        <p><strong>Frühgeboren?</strong> Für die Entwicklung zählt dann das <em>korrigierte Alter</em> – gerechnet ab dem errechneten Geburtstermin. Die U-Termine richten sich aber nach dem tatsächlichen Geburtsdatum.</p>
        <p>Jedes Kind hat sein eigenes Tempo. Die Zeitangaben sind Spannbreiten, keine Termine.</p>
        <p>U &amp; Me ersetzt keine ärztliche Beratung. Wenn ihr euch Sorgen macht, fragt immer eure Kinderarztpraxis.</p>
      </aside>
    </>
  );
}
