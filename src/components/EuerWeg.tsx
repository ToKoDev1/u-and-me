import { datumFormat } from '../lib/alter';
import { bereichsName, etappenInfo, wegEintraege } from '../lib/inhalte';
import type { Kind } from '../lib/kind';
import { Avatar } from './Avatar';
import { Fussnoten } from './Fussnoten';

/** Vorläufig – wird in Schritt 5 nach Vorlage ausgebaut */
export function EuerWeg({ kind }: { kind: Kind }) {
  return (
    <div style={{ paddingTop: 22, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <h1>Euer Weg</h1>
      <ol style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingLeft: 20 }}>
        {wegEintraege(kind).map((e) =>
          e.art === 'heute' ? (
            <li key="heute" style={{ listStyle: 'none', display: 'flex', gap: 8, alignItems: 'center' }}>
              <Avatar tier={kind.profil.maskottchen} groesse={32} /> <b>Du bist hier · {datumFormat.format(e.datum)}</b>
            </li>
          ) : e.art === 'u' ? (
            <li key={e.termin.untersuchung.id}><b>{e.termin.untersuchung.id}</b> ({e.status})</li>
          ) : (
            <li key={e.etappe.id} className="gedaempft">
              {e.etappe.titel} · {bereichsName[e.etappe.bereich]} ({e.status})
            </li>
          ),
        )}
      </ol>
      <Fussnoten quelle={etappenInfo.quelle} fruehgeboren={kind.fruehgeboren} />
    </div>
  );
}
