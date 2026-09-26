import { Link } from 'react-router-dom';
import {
  alterAm,
  alterAlsText,
  jahreszeit,
  kurzDatum,
  letzterTag,
  monatJahr,
  spanneAlsText,
  abstandAlsText,
  tageZwischen,
} from '../lib/alter';
import {
  aktuelleEtappen,
  aktuellePhase,
  bereichsName,
  etappenInfo,
  kommendeEtappen,
  naechsteUntersuchung,
  vorherigeUntersuchung,
  type Etappe,
  type NaechsteU,
} from '../lib/inhalte';
import type { Kind } from '../lib/kind';
import { uKalenderHerunterladen } from '../lib/kalender';
import { Avatar } from './Avatar';
import { Fussnoten } from './Fussnoten';

export function Heute({ kind }: { kind: Kind }) {
  const phase = aktuellePhase(kind);
  const aktuell = aktuelleEtappen(kind);
  const begegnen = aktuell.filter((e) => e.bereich === 'alltag');
  const geradeDran = aktuell.filter((e) => e.bereich !== 'alltag');
  const demnaechst = kommendeEtappen(kind);
  const naechsteU = naechsteUntersuchung(kind);

  return (
    <div className="heute">
      <div className="heute-spalte links">
        <Begruessung kind={kind} />

        {phase ? <Wegstueck kind={kind} /> : (
          <p className="karte reihe-wegstueck" style={{ marginTop: 16 }}>
            U &amp; Me begleitet euch aktuell bis zum 2. Geburtstag. Für ältere Kinder folgen die Inhalte später.
          </p>
        )}

        {begegnen.length > 0 && (
          <section className="abschnitt abschnitt-begegnen reihe-begegnen">
            <h2>Was euch gerade begegnen kann</h2>
            <div className="zwei-spalten-liste">
              {begegnen.map((e) => <BegegnenKarte key={e.id} etappe={e} />)}
            </div>
          </section>
        )}

        {geradeDran.length > 0 && (
          <section className="abschnitt reihe-dran">
            <h2>Gerade dran</h2>
            <div className="zwei-spalten-liste">
              {geradeDran.map((e) => <EtappenKarte key={e.id} etappe={e} />)}
            </div>
          </section>
        )}
      </div>

      <div className="heute-spalte rechts">
        {naechsteU && <NaechsteUKarte termin={naechsteU} kind={kind} />}

        {demnaechst.length > 0 && (
          <section className="abschnitt reihe-naechstes">
            <h2>Als Nächstes, irgendwann</h2>
            <ul className="chips">
              {demnaechst.map((e) => (
                <li key={e.id} className="chip">
                  <b>{e.titel}</b> <span className="gedaempft">{spanneKurz(e)}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {phase?.abklaeren && (
          <section className="abschnitt reihe-warnung" aria-labelledby="warnung-titel">
            <div className="warnhinweis">
              <div className="warnhinweis-kopf">
                <span className="i-kreis" aria-hidden="true">i</span>
                <h2 id="warnung-titel">Nicht bis zur nächsten U warten, wenn …</h2>
              </div>
              <p>{phase.abklaeren}</p>
              <p className="gedaempft" style={{ fontSize: 'var(--groesse-s)' }}>
                Sprecht dann lieber zeitnah mit eurer Kinderarztpraxis.
              </p>
            </div>
          </section>
        )}

        <div className="reihe-fussnoten">
          <Fussnoten quelle={etappenInfo.quelle} fruehgeboren={kind.fruehgeboren} />
        </div>
      </div>
    </div>
  );
}

/** „6–10 M.“ für die Chips */
function spanneKurz(e: Etappe): string {
  return spanneAlsText(e.von, e.bis).replace(/ Monaten$/, ' M.').replace(/ Wochen$/, ' Wo.');
}

function Begruessung({ kind }: { kind: Kind }) {
  const alter = alterAm(kind.geburt, kind.jetzt);
  const korrigiert = kind.fruehgeboren ? alterAm(kind.entwicklungsStart, kind.jetzt) : null;
  return (
    <div className="begruessung reihe-begruessung">
      <Avatar tier={kind.profil.maskottchen} groesse={72} />
      <div className="sprechblase">
        <p className="hallo">Hallo!</p>
        <p className="satz">
          {alter.tage === 0 ? (
            <>{kind.name ?? 'Euer Kind'} ist heute <b>auf die Welt gekommen</b>. Willkommen!</>
          ) : (
            <>{kind.name ?? 'Euer Kind'} ist heute <b>{alterAlsText(alter)}</b> alt.</>
          )}
        </p>
        {korrigiert && korrigiert.tage >= 0 && (
          <p className="gedaempft" style={{ fontSize: 'var(--groesse-s)', marginTop: 4 }}>
            Korrigiert: {alterAlsText(korrigiert)}
          </p>
        )}
      </div>
    </div>
  );
}

/** „Du bist hier: zwischen U4 und U5“ mit Maskottchen an der heutigen Position */
function Wegstueck({ kind }: { kind: Kind }) {
  const vorher = vorherigeUntersuchung(kind);
  const naechste = naechsteUntersuchung(kind);
  if (!vorher || !naechste) return null;

  const start = vorher.beginn.getTime();
  const gesamt = naechste.ende.getTime() - start;
  const anteil = (d: Date) => Math.min(1, Math.max(0, (d.getTime() - start) / gesamt));
  // Die Kreise sitzen an den Enden (je 36 px) – Positionen innerhalb der Linie umrechnen
  const position = (a: number) => `calc(18px + (100% - 36px) * ${a})`;

  const titel = `Du bist hier: zwischen ${vorher.untersuchung.id} und ${naechste.untersuchung.id}`;
  const links = vorher.untersuchung.id === 'U1' ? 'U1 bei der Geburt' : `${vorher.untersuchung.id} im ${jahreszeit(vorher.beginn)}`;
  const rechts = naechste.laeuftSchon
    ? `${naechste.untersuchung.id}-Fenster läuft bis ${kurzDatum.format(letzterTag(naechste.ende))}`
    : `${naechste.untersuchung.id} ab ${kurzDatum.format(naechste.beginn)}`;

  return (
    <div className="wegstueck-karte reihe-wegstueck">
      <span className="wegstueck-titel">
        Du bist hier:<br className="nur-desktop" /> zwischen {vorher.untersuchung.id} und {naechste.untersuchung.id}
      </span>
      <div className="wegstueck" role="img" aria-label={`${titel}. ${rechts}.`}>
        <div className="wegstueck-linie" />
        <div className="wegstueck-fenster" style={{ left: position(anteil(naechste.beginn)) }} />
        <div className="u-kreis u-kreis-vorher">{vorher.untersuchung.id}</div>
        <Avatar tier={kind.profil.maskottchen} groesse={52} style={{ left: position(anteil(kind.jetzt)) }} />
        <div className="u-kreis u-kreis-naechste">{naechste.untersuchung.id}</div>
      </div>
      <div className="wegstueck-fuss">
        <span>{links}</span>
        <span>{rechts}</span>
      </div>
    </div>
  );
}

function BegegnenKarte({ etappe }: { etappe: Etappe }) {
  return (
    <article className="begegnen-karte">
      <div className="meta">
        {bereichsName[etappe.bereich]} · meist mit {spanneAlsText(etappe.von, etappe.bis)}
      </div>
      <h3>{etappe.titel}</h3>
      <p>{etappe.text}</p>
      {etappe.zusatz && (
        <div className="zusatz">
          <b>{etappe.zusatz.label}</b> {etappe.zusatz.text}
        </div>
      )}
    </article>
  );
}

export function EtappenKarte({ etappe }: { etappe: Etappe }) {
  const hinweis = etappe.tippArt === 'hinweis';
  return (
    <article className="karte etappe-karte">
      <div className="etappe-kopf">
        <span className={`bereich-pille ${etappe.bereich}`}>{bereichsName[etappe.bereich]}</span>
        <span className="spanne">meist mit {spanneAlsText(etappe.von, etappe.bis)}</span>
      </div>
      <h3>{etappe.titel}</h3>
      <p>{etappe.text}</p>
      {etappe.tipp && (
        <div className="tipp">
          <span className={`tipp-punkt ${hinweis ? 'hinweis' : ''}`} aria-hidden="true" />
          <span>
            <b>{hinweis ? 'Hinweis:' : 'Spielidee:'}</b> {etappe.tipp}
          </span>
        </div>
      )}
    </article>
  );
}

function Datumskacheln({ von, bis }: { von: Date; bis: Date }) {
  const kachel = (d: Date) => (
    <div className="datumskachel">
      <div className="tag">{d.getDate()}.</div>
      <div className="monat">{monatJahr.format(d)}</div>
    </div>
  );
  return (
    <div className="datumskacheln">
      {kachel(von)}
      <span className="gedaempft">bis</span>
      {kachel(bis)}
    </div>
  );
}

export { Datumskacheln };

function NaechsteUKarte({ termin, kind }: { termin: NaechsteU; kind: Kind }) {
  const id = termin.untersuchung.id;
  const status = termin.laeuftSchon ? 'Zeitfenster läuft' : abstandAlsText(tageZwischen(kind.jetzt, termin.beginn));
  return (
    <section className="karte-schatten naechste-u-karte reihe-naechste-u" aria-label={`Nächste U: ${id}`}>
      <div className="naechste-u-kopf">
        <span className="titel">Nächste U: {id}</span>
        <span className="pille">{status}</span>
      </div>
      <Datumskacheln von={termin.beginn} bis={letzterTag(termin.ende)} />
      <button type="button" className="knopf" onClick={() => uKalenderHerunterladen(termin, kind.name)}>
        In meinen Kalender eintragen
      </button>
      <Link to="/naechste-u" className="textlink">Was bei der {id} passiert →</Link>
    </section>
  );
}
