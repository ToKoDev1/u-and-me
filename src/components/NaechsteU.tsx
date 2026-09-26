import { letzterTag } from '../lib/alter';
import { naechsteUntersuchung, untersuchungenQuelle } from '../lib/inhalte';
import type { Kind } from '../lib/kind';
import { uKalenderHerunterladen } from '../lib/kalender';
import { Fussnoten } from './Fussnoten';
import { Datumskacheln } from './Heute';

/** Vorläufig – wird in Schritt 4 nach Vorlage ausgebaut */
export function NaechsteU({ kind }: { kind: Kind }) {
  const termin = naechsteUntersuchung(kind);
  if (!termin) return <p className="karte" style={{ marginTop: 22 }}>Alle Us bis zur U7 liegen hinter euch.</p>;
  return (
    <div style={{ paddingTop: 22, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h1>{termin.untersuchung.id} · {termin.untersuchung.zeitraum}</h1>
      <div className="karte-schatten naechste-u-karte">
        <Datumskacheln von={termin.beginn} bis={letzterTag(termin.ende)} />
        <button type="button" className="knopf" onClick={() => uKalenderHerunterladen(termin, kind.name)}>
          In meinen Kalender eintragen
        </button>
      </div>
      <Fussnoten quelle={untersuchungenQuelle} fruehgeboren={kind.fruehgeboren} />
    </div>
  );
}
