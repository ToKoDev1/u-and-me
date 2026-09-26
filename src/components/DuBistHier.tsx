import { abstandAlsText, alterAm, alterAlsText, datumFormat, heute, parseDatum, tageZwischen } from '../lib/alter';
import { aktuellePhase, maskottchenBild, naechsteUntersuchung, untersuchungenQuelle } from '../lib/inhalte';
import type { Profil } from '../lib/speicher';

type Props = { profil: Profil; onZuruecksetzen: () => void };

export function DuBistHier({ profil, onZuruecksetzen }: Props) {
  const geburt = parseDatum(profil.geburtsdatum);
  const jetzt = heute();
  const alter = alterAm(geburt, jetzt);
  const phase = aktuellePhase(geburt, jetzt);
  const naechsteU = naechsteUntersuchung(geburt, jetzt);
  const wer = profil.name ?? 'Euer Kind';

  return (
    <main className="seite">
      <header className="kopf">
        <img className="avatar" src={maskottchenBild(profil.maskottchen, true)} alt="" />
        <div>
          <p className="gedaempft">{wer} ist heute</p>
          <p className="alter">{alterAlsText(alter)}</p>
        </div>
      </header>

      {phase ? (
        <section>
          <p className="gedaempft">Du bist hier</p>
          <h1>{phase.titel}</h1>

          {phase.inhalt ? (
            <>
              {phase.inhalt.status === 'entwurf' && (
                <p className="entwurf">Entwurf – diese Inhalte sind noch nicht fachlich geprüft.</p>
              )}
              {phase.inhalt.bereiche.map((b) => (
                <div key={b.titel} className="karte">
                  <h2>{b.titel}</h2>
                  <ul>{b.punkte.map((p) => <li key={p}>{p}</li>)}</ul>
                </div>
              ))}
              <div className="karte abklaeren">
                <h2>Nicht bis zur nächsten U warten, wenn …</h2>
                <ul>{phase.inhalt.abklaeren.map((p) => <li key={p}>{p}</li>)}</ul>
                <p>… sprecht in diesen Fällen lieber zeitnah mit eurer Kinderarztpraxis.</p>
              </div>
              <p className="quelle">
                Quelle: <a href={phase.inhalt.quelle.url} target="_blank" rel="noreferrer">{phase.inhalt.quelle.name}</a>
              </p>
            </>
          ) : (
            <p className="karte">Für diese Phase schreiben wir die Inhalte gerade noch.</p>
          )}
        </section>
      ) : (
        <p className="karte">U &amp; Me begleitet euch aktuell bis zum 2. Geburtstag. Für ältere Kinder folgen die Inhalte später.</p>
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
        <p>U &amp; Me ersetzt keine ärztliche Beratung. Wenn ihr euch Sorgen macht, fragt immer eure Kinderarztpraxis.</p>
      </aside>

      <button type="button" className="leise" onClick={onZuruecksetzen}>Angaben ändern</button>
    </main>
  );
}
