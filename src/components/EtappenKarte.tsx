import { spanneAlsText } from '../lib/alter';
import { bereichsName, type Etappe } from '../lib/inhalte';

type Props = { etappe: Etappe; mitTipp?: boolean };

export function EtappenKarte({ etappe, mitTipp = true }: Props) {
  return (
    <article className={`karte etappe bereich-${etappe.bereich}`}>
      <p className="etappe-meta">
        {bereichsName[etappe.bereich]} · meist mit {spanneAlsText(etappe.von, etappe.bis)}
      </p>
      <h3>{etappe.titel}</h3>
      <p>{etappe.text}</p>
      {mitTipp && etappe.tipp && (
        <p className="tipp">
          <strong>Tipp:</strong> {etappe.tipp}
        </p>
      )}
    </article>
  );
}
