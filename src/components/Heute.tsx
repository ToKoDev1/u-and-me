import { Link } from 'react-router-dom';
import { abstandAlsText, spanneAlsText, tageZwischen } from '../lib/alter';
import {
  aktuelleEtappen,
  aktuelleWoche,
  offeneAufgaben,
  danach,
  letzteUntersuchung,
  aktuellePhase,
  etappenBeginn,
  naechsteUntersuchung,
  type Etappe,
} from '../lib/inhalte';
import type { Kind } from '../lib/kind';
import type { Notizen } from '../lib/speicher';
import { useSeitentitel } from '../lib/seite';
import { Symbol } from './Symbol';
import { SprungZoom } from './Spruenge';
import { UZeitleiste } from './UZeitleiste';
import { Zeitring } from './Zeitring';

/** Startseite im reduzierten Stil: ein Zentrum, die nächste U, drei Kacheln, eine wichtige Sache */
export function Heute({ kind, notizen }: { kind: Kind; notizen: Notizen }) {
  useSeitentitel();
  const phase = aktuellePhase(kind);
  const aktuell = aktuelleEtappen(kind);
  const begegnen = aktuell.filter((e) => e.bereich === 'alltag');
  const geradeDran = aktuell.filter((e) => e.bereich !== 'alltag');
  const spielideen = phase?.spielideen ?? [];
  const naechsteU = naechsteUntersuchung(kind);
  const wichtig = heuteWichtig(kind, begegnen, geradeDran);
  // In den ersten 12 Wochen ersetzt die Woche „Heute wichtig“ – sie ist dann die wichtigste Orientierung
  const woche = aktuelleWoche(kind);
  const offen = offeneAufgaben(kind, notizen);

  const kacheln = [
    { pfad: '/begegnen', titel: 'Begegnet euch', n: begegnen.length, eins: 'Thema', viele: 'Themen' },
    { pfad: '/entwicklung', titel: 'Gerade dran', n: geradeDran.length, eins: 'Schritt', viele: 'Schritte' },
    { pfad: '/spielen', titel: 'Spielideen', n: spielideen.length, eins: 'Idee', viele: 'Ideen' },
  ];

  return (
    <div className="heute">
      <UZeitleiste kind={kind} />
      {/* Zoom auf die Strecke zwischen letzter und nächster U – mit den Sprüngen dieser Zeit */}
      <SprungZoom kind={kind} />
      <Zeitring kind={kind} />

      {/* Das Wichtigste gleich unter dem Ring – als Sprechblase des Maskottchens.
          In den ersten 12 Wochen ist das die Lebenswoche, danach „Heute wichtig“. */}
      {woche && (
        <Link to="/woche" className="wichtig">
          <span className="wichtig-label">{woche.woche}. Lebenswoche{kind.name ? ` mit ${kind.name}` : ''}</span>
          <span className="wichtig-titel">{woche.titel}</span>
          <span className="wichtig-text">{woche.typisch}</span>
          <span className="wichtig-meta">Was hilft · Für euch · Mehr dazu ›</span>
        </Link>
      )}

      {!woche && wichtig && (
        <Link to={wichtig.bereich === 'alltag' ? '/begegnen' : '/entwicklung'} className="wichtig">
          <span className="wichtig-label">Heute wichtig</span>
          <span className="wichtig-titel">{wichtig.titel}</span>
          {/* Ein Tipp („Das hilft oft“) ist hier hilfreicher als die Beschreibung – andere Zusätze (z. B. Hinweise für ältere Kinder) nicht */}
          <span className="wichtig-text">{wichtig.zusatz?.label === 'Das hilft oft:' ? wichtig.zusatz.text : wichtig.text}</span>
          <span className="wichtig-meta">meist mit {spanneAlsText(wichtig.von, wichtig.bis)} · Mehr dazu ›</span>
        </Link>
      )}

      {naechsteU && (
        // Wann die U dran ist, sagt schon der Ring – die Karte sagt, was zu tun ist
        <Link to="/naechste-u" className="zeile-link">
          <span className="zeile-stapel">
            <b>
              {naechsteU.laeuftSchon
                ? `${naechsteU.untersuchung.id}-Termin machen`
                : `${naechsteU.untersuchung.id} vorbereiten`}
            </b>
            <span className="gedaempft klein">Zeitfenster, Kalender, Ablauf</span>
          </span>
          {naechsteU.laeuftSchon ? (
            <span aria-hidden="true">›</span>
          ) : (
            <span className="pille">{abstandAlsText(tageZwischen(kind.jetzt, naechsteU.beginn))}</span>
          )}
        </Link>
      )}

      {phase && (
        <nav className="kacheln" aria-label="Bereiche">
          {kacheln.map((k) =>
            k.n > 0 ? (
              <Link key={k.pfad} to={k.pfad} className="kachel">
                <span className="kachel-titel">{k.titel}</span>
                <span className="kachel-info">{`${k.n} ${k.n === 1 ? k.eins : k.viele}`}</span>
              </Link>
            ) : (
              // Nichts drin → keine Verlinkung auf eine leere Seite
              <div key={k.pfad} className="kachel kachel-ruhig">
                <span className="kachel-titel">{k.titel}</span>
                <span className="kachel-info">ruhige Zeit</span>
              </div>
            ),
          )}
        </nav>
      )}

      {!naechsteU && (
        // Nach der letzten U: ruhiger Abschluss statt leerer Startseite
        <section className="ruhige-liste abschluss" aria-labelledby="abschluss-titel">
          <h2 id="abschluss-titel">{danach.titel}</h2>
          <p>{danach.text}</p>
          <ul>
            {danach.termine.map((t) => (
              <li key={t.id}>
                <b>
                  {t.id} <span className="gedaempft">· {t.alter}</span>
                </b>
                <span>{t.text}</span>
              </li>
            ))}
          </ul>
          <p className="gedaempft klein">{danach.hinweis}</p>
          <a className="quelle-link" href={danach.quelle.url} target="_blank" rel="noreferrer">
            Quelle: {danach.quelle.name}
          </a>
        </section>
      )}

      {offen.length > 0 && (
        <Link to="/erledigen" className="zeile-link">
          <span>
            <b>Zu erledigen</b>
            <span className="gedaempft"> · {offen[0].titel}</span>
          </span>
          <span className="pille">{offen.length} offen</span>
        </Link>
      )}

      {phase?.abklaeren && (
        // Warnzeichen immer erreichbar – auch wenn „Gerade dran“ gerade leer ist
        <Link to="/entwicklung#warnzeichen" className="zeile-link zeile-warnung">
          <span className="zeile-warnung-text">
            <Symbol name="info" />
            Wann ihr nicht bis zur nächsten U warten solltet
          </span>
          <span aria-hidden="true">›</span>
        </Link>
      )}

      {!phase && naechsteU && (
        <p className="gedaempft" style={{ textAlign: 'center' }}>
          Für dieses Alter gibt es in U &amp; Me gerade keine Inhalte. U &amp; Me begleitet euch bis zur {letzteUntersuchung.id}.
        </p>
      )}
    </div>
  );
}

/**
 * „Heute wichtig“: die Alltags-Etappe, die zuletzt begonnen hat (das Frischeste, was Eltern gerade erleben).
 * Gibt es keine, dann die zuletzt begonnene Entwicklungs-Etappe.
 */
function heuteWichtig(kind: Kind, begegnen: Etappe[], geradeDran: Etappe[]): Etappe | undefined {
  const juengste = (liste: Etappe[]) =>
    [...liste].sort((a, b) => etappenBeginn(kind, b).getTime() - etappenBeginn(kind, a).getTime())[0];
  return juengste(begegnen) ?? juengste(geradeDran);
}
