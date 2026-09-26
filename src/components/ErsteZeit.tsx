import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { datumBeiAlter, kurzDatum, letzterTag } from '../lib/alter';
import { aufgabenFuer, fuerEuch, lebenswoche, wochen, type Quelle } from '../lib/inhalte';
import type { Kind } from '../lib/kind';
import { useSeitentitel } from '../lib/seite';
import type { Notizen } from '../lib/speicher';
import { useWischen } from '../lib/wischen';

function QuelleLink({ quelle }: { quelle: Quelle }) {
  return (
    <a className="quelle-link" href={quelle.url} target="_blank" rel="noreferrer">
      Quelle: {quelle.name}
    </a>
  );
}

// ---- Die ersten 12 Wochen ------------------------------------------------------

/** Eine Lebenswoche: typisch, was hilft, was euch selbst guttut. Wischen oder Leiste unten blättert. */
export function WocheSeite({ kind }: { kind: Kind }) {
  const { nr } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const jetzt = lebenswoche(kind);
  const gewuenscht = Number(nr) || jetzt;
  const w = wochen.find((x) => x.woche === gewuenscht) ?? wochen.find((x) => x.woche === Math.min(Math.max(gewuenscht, 1), wochen.length))!;
  useSeitentitel(`${w.woche}. Lebenswoche`);

  const beginn = datumBeiAlter(kind.geburt, { tage: (w.woche - 1) * 7 });
  const ende = datumBeiAlter(kind.geburt, { tage: w.woche * 7 });
  const vorige = w.woche > 1 ? w.woche - 1 : undefined;
  const folgende = w.woche < wochen.length ? w.woche + 1 : undefined;
  const wechseln = (ziel: number | undefined, richtung: 'vor' | 'zurueck') =>
    ziel && navigate(`/woche/${ziel}`, { replace: true, state: { richtung } });
  const wischen = useWischen(() => wechseln(folgende, 'vor'), () => wechseln(vorige, 'zurueck'));
  const richtung = (state as { richtung?: string } | null)?.richtung;

  return (
    <div
      className={`unterseite woche-seite ${richtung === 'vor' ? 'rein-von-rechts' : richtung === 'zurueck' ? 'rein-von-links' : ''}`}
      key={w.woche}
      {...wischen}
    >
      <Link to="/" className="zurueck-link">← Heute</Link>
      <p className="u-kopf-meta">
        {w.woche}. Lebenswoche · {kurzDatum.format(beginn)} – {kurzDatum.format(letzterTag(ende))}
        {w.woche === jetzt && <span className="pille woche-jetzt">diese Woche</span>}
      </p>
      <h1 tabIndex={-1}>{w.titel}</h1>

      <section className="ruhige-liste woche-abschnitte">
        <div>
          <h2>Das ist typisch</h2>
          <p>{w.typisch}</p>
        </div>
        <div>
          <h2>Das hilft</h2>
          <p>{w.hilft}</p>
        </div>
        <div>
          <h2>Für euch</h2>
          <p>{w.fuerEuch}</p>
          <Link to="/fuer-euch" className="woche-link">Hilfe und Ansprechpartner für euch ›</Link>
        </div>
      </section>

      {w.u && (
        <Link to={`/u/${w.u}`} className="zeile-link">
          <span>
            <b>Passend dazu: die {w.u}</b>
          </span>
          <span aria-hidden="true">›</span>
        </Link>
      )}
      <Link to="/entwicklung#warnzeichen" className="zeile-link zeile-warnung">
        <span className="zeile-warnung-text">Wann ihr nicht warten solltet</span>
        <span aria-hidden="true">›</span>
      </Link>

      <div className="quellen-liste">
        {w.quellen.map((q) => (
          <QuelleLink key={q.url} quelle={q} />
        ))}
      </div>

      <nav className="u-blaettern" aria-label="Andere Wochen">
        {vorige ? (
          <Link to={`/woche/${vorige}`} replace state={{ richtung: 'zurueck' }}>‹ Woche {vorige}</Link>
        ) : (
          <span />
        )}
        <span className="gedaempft klein">Wischen zum Blättern</span>
        {folgende ? (
          <Link to={`/woche/${folgende}`} replace state={{ richtung: 'vor' }}>Woche {folgende} ›</Link>
        ) : (
          <span />
        )}
      </nav>
    </div>
  );
}

// ---- Zu erledigen ----------------------------------------------------------------

export function Erledigen({ kind, notizen, onNotizen }: { kind: Kind; notizen: Notizen; onNotizen: (n: Notizen) => void }) {
  useSeitentitel('Zu erledigen');
  const alle = aufgabenFuer(kind);
  const istErledigt = (id: string) => notizen.erledigt.includes(id);
  const sortiert = [...alle.filter((a) => !istErledigt(a.id)), ...alle.filter((a) => istErledigt(a.id))];

  function umschalten(id: string) {
    const erledigt = istErledigt(id) ? notizen.erledigt.filter((x) => x !== id) : [...notizen.erledigt, id];
    onNotizen({ ...notizen, erledigt });
  }

  return (
    <div className="unterseite">
      <Link to="/" className="zurueck-link">← Heute</Link>
      <h1 tabIndex={-1}>Zu erledigen</h1>
      <p className="gedaempft">
        Was nach der Geburt an Formalitäten ansteht – mit Daten für {kind.name ?? 'euer Kind'}. Hakt ab, was erledigt ist.
      </p>
      <ul className="ruhige-liste aufgaben">
        {sortiert.map((a) => {
          const erledigt = istErledigt(a.id);
          const vorbei = a.ende <= kind.jetzt;
          const status = erledigt
            ? 'erledigt'
            : a.status
              ? a.status
              : a.beginn > kind.jetzt
              ? `ab ${kurzDatum.format(a.beginn)}`
              : vorbei && a.frist
                ? 'Frist vorbei – fragt trotzdem nach'
                : `${a.frist ? 'bis' : 'am besten bis'} ${kurzDatum.format(letzterTag(a.ende))}`;
          return (
            <li key={a.id} className={erledigt ? 'aufgabe-erledigt' : ''}>
              <label className="check-eintrag">
                <input type="checkbox" checked={erledigt} onChange={() => umschalten(a.id)} />
                <span className="kaestchen check-kaestchen" aria-hidden="true">{erledigt ? '✓' : ''}</span>
                <span className="aufgabe-kopf">
                  <b>{a.titel}</b>
                  <span className={`pille ${a.frist && !erledigt ? 'pille-frist' : ''}`}>{status}</span>
                </span>
              </label>
              {!erledigt && (
                <>
                  <p>{a.text}</p>
                  <QuelleLink quelle={a.quelle} />
                </>
              )}
            </li>
          );
        })}
      </ul>
      <p className="gedaempft klein">Angaben ohne Gewähr – Zuständigkeiten und Fristen können je nach Ort abweichen.</p>
    </div>
  );
}

// ---- Für euch ------------------------------------------------------------------

export function FuerEuch() {
  useSeitentitel('Für euch');
  return (
    <div className="unterseite">
      <Link to="/" className="zurueck-link">← Heute</Link>
      <h1 tabIndex={-1}>Für euch</h1>
      <p className="gedaempft">{fuerEuch.intro}</p>

      <ul className="ruhige-liste">
        {fuerEuch.abschnitte.map((a) => (
          <li key={a.titel} className="fuer-euch-eintrag">
            <h2>{a.titel}</h2>
            <p>{a.text}</p>
            <QuelleLink quelle={a.quelle} />
          </li>
        ))}
      </ul>

      <section className="unterabschnitt">
        <h2 className="unterabschnitt-titel">Hier bekommt ihr Hilfe</h2>
        <ul className="ruhige-liste kontakte">
          {fuerEuch.kontakte.map((k) => (
            <li key={k.name}>
              <h2>{k.name}</h2>
              {'nummer' in k && k.nummer && (
                <a className="kontakt-nummer" href={`tel:${k.nummer.replace(/\s/g, '')}`}>
                  {k.nummer}
                </a>
              )}
              {'zeiten' in k && k.zeiten && <span className="gedaempft klein">{k.zeiten}</span>}
              <p>{k.text}</p>
              <a className="quelle-link" href={k.url} target="_blank" rel="noreferrer">
                Mehr erfahren
              </a>
            </li>
          ))}
        </ul>
      </section>
      <p className="notfall">{fuerEuch.notfall}</p>
    </div>
  );
}
