import { Link } from 'react-router-dom';
import { abstandAlsText, spanneAlsText, tageZwischen } from '../lib/alter';
import {
  aktuelleEtappen,
  aktuellePhase,
  etappenBeginn,
  naechsteUntersuchung,
  type Etappe,
} from '../lib/inhalte';
import type { Kind } from '../lib/kind';
import { useSeitentitel } from '../lib/seite';
import { Symbol } from './Symbol';
import { UZeitleiste } from './UZeitleiste';
import { Zeitring } from './Zeitring';

/** Startseite im reduzierten Stil: ein Zentrum, die nächste U, drei Kacheln, eine wichtige Sache */
export function Heute({ kind }: { kind: Kind }) {
  useSeitentitel();
  const phase = aktuellePhase(kind);
  const aktuell = aktuelleEtappen(kind);
  const begegnen = aktuell.filter((e) => e.bereich === 'alltag');
  const geradeDran = aktuell.filter((e) => e.bereich !== 'alltag');
  const spielideen = phase?.spielideen ?? [];
  const naechsteU = naechsteUntersuchung(kind);
  const wichtig = heuteWichtig(kind, begegnen, geradeDran);

  const kacheln = [
    { pfad: '/begegnen', titel: 'Begegnet euch', n: begegnen.length, eins: 'Thema', viele: 'Themen' },
    { pfad: '/entwicklung', titel: 'Gerade dran', n: geradeDran.length, eins: 'Schritt', viele: 'Schritte' },
    { pfad: '/spielen', titel: 'Spielideen', n: spielideen.length, eins: 'Idee', viele: 'Ideen' },
  ];

  return (
    <div className="heute">
      <UZeitleiste kind={kind} />
      <Zeitring kind={kind} />

      {naechsteU && (
        <Link to="/naechste-u" className="zeile-link">
          <span>
            <b>Nächste U: {naechsteU.untersuchung.id}</b>
            <span className="gedaempft"> · {naechsteU.untersuchung.zeitraum}</span>
          </span>
          <span className="pille">
            {naechsteU.laeuftSchon ? 'Fenster läuft' : abstandAlsText(tageZwischen(kind.jetzt, naechsteU.beginn))}
          </span>
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

      {wichtig && (
        <Link to={wichtig.bereich === 'alltag' ? '/begegnen' : '/entwicklung'} className="wichtig">
          <span className="wichtig-label">Heute wichtig</span>
          <span className="wichtig-titel">{wichtig.titel}</span>
          <span className="wichtig-text">{wichtig.zusatz?.text ?? wichtig.text}</span>
          <span className="wichtig-meta">meist mit {spanneAlsText(wichtig.von, wichtig.bis)} · Mehr dazu ›</span>
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

      {!phase && (
        <p className="gedaempft" style={{ textAlign: 'center' }}>
          U &amp; Me begleitet euch im Moment bis zum 2. Geburtstag. Inhalte bis zur Einschulung (U7a bis U9) sind in
          Arbeit.
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
