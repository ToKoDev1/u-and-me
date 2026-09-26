import { Link } from 'react-router-dom';
import { abstandAlsText, datumFormat, spanneAlsText, tageZwischen } from '../lib/alter';
import {
  aktuelleEtappen,
  aktuellePhase,
  etappenBeginn,
  naechsteUntersuchung,
  type Etappe,
} from '../lib/inhalte';
import type { Kind } from '../lib/kind';
import { UZeitleiste } from './UZeitleiste';
import { Zeitring } from './Zeitring';

/** Startseite im reduzierten Stil: ein Zentrum, drei Kacheln, eine wichtige Sache */
export function Heute({ kind }: { kind: Kind }) {
  const phase = aktuellePhase(kind);
  const aktuell = aktuelleEtappen(kind);
  const begegnen = aktuell.filter((e) => e.bereich === 'alltag');
  const geradeDran = aktuell.filter((e) => e.bereich !== 'alltag');
  const spielideen = phase?.spielideen ?? [];
  const naechsteU = naechsteUntersuchung(kind);
  const wichtig = heuteWichtig(kind, begegnen, geradeDran);

  const kacheln = [
    { pfad: '/begegnen', titel: 'Begegnet euch', info: anzahl(begegnen.length, 'Thema', 'Themen') },
    { pfad: '/entwicklung', titel: 'Gerade dran', info: anzahl(geradeDran.length, 'Schritt', 'Schritte') },
    { pfad: '/spielen', titel: 'Spielideen', info: anzahl(spielideen.length, 'Idee', 'Ideen') },
  ];

  return (
    <div className="heute">
      <p className="heute-datum">{datumFormat.format(kind.jetzt)}</p>
      <UZeitleiste kind={kind} />
      <Zeitring kind={kind} />

      <nav className="kacheln" aria-label="Bereiche">
        {kacheln.map((k) => (
          <Link key={k.pfad} to={k.pfad} className="kachel">
            <span className="kachel-titel">{k.titel}</span>
            <span className="kachel-info">{k.info}</span>
          </Link>
        ))}
      </nav>

      {wichtig && (
        <Link to={wichtig.bereich === 'alltag' ? '/begegnen' : '/entwicklung'} className="wichtig">
          <span className="wichtig-label">Heute wichtig</span>
          <span className="wichtig-titel">{wichtig.titel}</span>
          <span className="wichtig-text">{wichtig.zusatz?.text ?? wichtig.text}</span>
          <span className="wichtig-meta">meist mit {spanneAlsText(wichtig.von, wichtig.bis)} · Mehr dazu ›</span>
        </Link>
      )}

      {naechsteU && (
        <Link to="/naechste-u" className="zeile-link">
          <span>
            <b>Nächste U: {naechsteU.untersuchung.id}</b>
            <span className="gedaempft"> · {naechsteU.untersuchung.zeitraum}</span>
          </span>
          <span className="pille">
            {naechsteU.laeuftSchon ? 'Zeitfenster läuft' : abstandAlsText(tageZwischen(kind.jetzt, naechsteU.beginn))}
          </span>
        </Link>
      )}

      {!phase && (
        <p className="gedaempft" style={{ textAlign: 'center' }}>
          U &amp; Me begleitet euch aktuell bis zum 2. Geburtstag. Für ältere Kinder folgen die Inhalte später.
        </p>
      )}
    </div>
  );
}

const anzahl = (n: number, eins: string, viele: string) => (n === 0 ? 'gerade nichts' : `${n} ${n === 1 ? eins : viele}`);

/**
 * „Heute wichtig“: die Alltags-Etappe, die zuletzt begonnen hat (das Frischeste, was Eltern gerade erleben).
 * Gibt es keine, dann die zuletzt begonnene Entwicklungs-Etappe.
 */
function heuteWichtig(kind: Kind, begegnen: Etappe[], geradeDran: Etappe[]): Etappe | undefined {
  const juengste = (liste: Etappe[]) =>
    [...liste].sort((a, b) => etappenBeginn(kind, b).getTime() - etappenBeginn(kind, a).getTime())[0];
  return juengste(begegnen) ?? juengste(geradeDran);
}
