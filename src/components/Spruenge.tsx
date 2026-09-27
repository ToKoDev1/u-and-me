import { Link } from 'react-router-dom';
import { kurzDatum, spanneAlsText } from '../lib/alter';
import { sprungZoom, type ZoomEintrag } from '../lib/inhalte';
import type { Kind } from '../lib/kind';
import { useSeitentitel } from '../lib/seite';
import { BereichMarke, QuelleLink } from './Unterseiten';

const ZUSTAND_TEXT: Record<ZoomEintrag['zustand'], string> = { vorbei: 'war', jetzt: 'gerade', kommt: 'kommt' };

/**
 * Zoom unter der Zeitleiste: die Strecke von der letzten zur nächsten U mit allen Sprüngen
 * (unsere Etappen) und Zahnarzt-Terminen als Punkten – plus „heute“.
 */
export function SprungZoom({ kind }: { kind: Kind }) {
  const zoom = sprungZoom(kind);
  if (!zoom) return null;

  const start = zoom.von.datum.getTime();
  const laenge = zoom.bis.datum.getTime() - start;
  const pos = (d: Date) => `${Math.min(1, Math.max(0, (d.getTime() - start) / laenge)) * 100}%`;
  const sprunge = zoom.eintraege.filter((e) => e.art === 'sprung');
  // Einträge am selben Tag zu einem Punkt zusammenfassen (mit Zahl), damit nichts übereinanderliegt
  const gruppen = new Map<string, ZoomEintrag[]>();
  for (const e of zoom.eintraege) {
    const tag = e.datum.toDateString();
    gruppen.set(tag, [...(gruppen.get(tag) ?? []), e]);
  }
  const naechster = zoom.eintraege.find((e) => e.zustand === 'kommt') ?? zoom.eintraege.find((e) => e.zustand === 'jetzt');

  return (
    <Link to="/spruenge" className="zoom" aria-label={`Sprünge zwischen ${zoom.von.id ?? 'Geburt'} und ${zoom.bis.id}: ${sprunge.length}`}>
      <span className="zoom-kopf">
        <span>
          {zoom.von.id ?? 'Geburt'} → {zoom.bis.id}
        </span>
        <span className="gedaempft">
          {sprunge.length} {sprunge.length === 1 ? 'Sprung' : 'Sprünge'} ›
        </span>
      </span>
      <span className="zoom-schiene" aria-hidden="true">
        <span className="zoom-spur" />
        {[...gruppen.values()].map((g) => (
          <span
            key={g[0].id}
            className={`zoom-punkt ${g.every((e) => e.art === 'zahnarzt') ? 'zahnarzt' : 'sprung'} ${g[0].zustand} ${g.length > 1 ? 'mehrere' : ''}`}
            style={{ left: pos(g[0].datum) }}
          >
            {g.length > 1 ? g.length : null}
          </span>
        ))}
        <span className="zoom-heute" style={{ left: pos(kind.jetzt) }} />
      </span>
      {naechster && (
        <span className="zoom-naechster">
          <span className="gedaempft">{naechster.zustand === 'jetzt' ? 'Gerade:' : 'Nächster Sprung:'}</span> <b>{naechster.titel}</b>
          <span className="gedaempft"> · {naechster.zustand === 'jetzt' ? 'läuft' : `ab ${kurzDatum.format(naechster.datum)}`}</span>
        </span>
      )}
    </Link>
  );
}

/** Seite „Sprünge“: alles zwischen letzter und nächster U, nach Datum */
export function Spruenge({ kind }: { kind: Kind }) {
  useSeitentitel('Sprünge');
  const zoom = sprungZoom(kind);
  return (
    <div className="unterseite">
      <Link to="/" className="zurueck-link">← Heute</Link>
      <h1 tabIndex={-1}>{zoom ? `Sprünge bis zur ${zoom.bis.id}` : 'Sprünge'}</h1>
      <p className="gedaempft">
        Was zwischen {zoom?.von.id ? `der ${zoom.von.id}` : 'der Geburt'} und {zoom ? `der ${zoom.bis.id}` : 'der nächsten U'} typisch
        neu dazukommt. Das Datum zeigt, ab wann es bei vielen Kindern beginnt – jedes Kind hat sein eigenes Tempo, das sind
        Spannbreiten, keine Termine.
      </p>
      {!zoom || zoom.eintraege.length === 0 ? (
        <p className="liste-leer">In dieser Zeit beginnt nichts Neues – euer Kind festigt, was es schon kann.</p>
      ) : (
        <ol className="ruhige-liste sprung-liste">
          {zoom.eintraege.map((e) => (
            <li key={`${e.art}-${e.id}`} className={`sprung-eintrag ${e.zustand}`}>
              <span className="sprung-kopf">
                <span className="sprung-datum">{e.zustand === 'jetzt' ? 'gerade' : `${ZUSTAND_TEXT[e.zustand]} ab ${kurzDatum.format(e.datum)}`}</span>
                {e.etappe && <BereichMarke bereich={e.etappe.bereich} zusatz={`meist mit ${spanneAlsText(e.etappe.von, e.etappe.bis)}`} />}
              </span>
              {e.etappe ? (
                <>
                  <h2>{e.titel}</h2>
                  <p>{e.etappe.text}</p>
                  {e.etappe.zusatz && (
                    <p className="zusatzzeile">
                      <b>{e.etappe.zusatz.label}</b> {e.etappe.zusatz.text}
                    </p>
                  )}
                  {e.etappe.tipp && (
                    <p className={`zusatzzeile ${e.etappe.tippArt === 'hinweis' ? 'hinweis' : ''}`}>
                      <b>{e.etappe.tippArt === 'hinweis' ? 'Hinweis:' : 'Spielidee:'}</b> {e.etappe.tipp}
                    </p>
                  )}
                  <QuelleLink quelle={e.etappe.quelle} />
                </>
              ) : (
                <Link to="/zahnarzt" className="sprung-termin">
                  <h2>{e.titel}</h2>
                  <span className="gedaempft">Termin in der Zahnarztpraxis · Mehr dazu ›</span>
                </Link>
              )}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
