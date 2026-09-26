import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { spanneAlsText } from '../lib/alter';
import {
  aktuelleEtappen,
  aktuellePhase,
  bereichsName,
  kommendeEtappen,
  type Bereich,
  type Etappe,
} from '../lib/inhalte';
import type { Kind } from '../lib/kind';

/** Gemeinsamer Aufbau: Zurück, Titel, Einleitung, Inhalt, Fußnoten */
function Unterseite({ titel, intro, children }: { titel: string; intro: string; kind: Kind; children: ReactNode }) {
  return (
    <div className="unterseite">
      <Link to="/" className="zurueck-link">← Heute</Link>
      <h1>{titel}</h1>
      <p className="gedaempft">{intro}</p>
      {children}
    </div>
  );
}

function BereichMarke({ bereich, zusatz }: { bereich: Bereich; zusatz?: string }) {
  return (
    <span className="bereich-marke">
      <span className={`bereich-punkt ${bereich}`} aria-hidden="true" />
      {bereichsName[bereich]}
      {zusatz && <span className="gedaempft"> · {zusatz}</span>}
    </span>
  );
}

const Leer = ({ children }: { children: ReactNode }) => <p className="liste-leer">{children}</p>;

export function Begegnen({ kind }: { kind: Kind }) {
  const eintraege = aktuelleEtappen(kind).filter((e) => e.bereich === 'alltag');
  return (
    <Unterseite
      titel="Was euch gerade begegnen kann"
      intro="Typische Phasen in diesem Alter – damit ihr wisst: Das ist häufig und meist ganz normal."
      kind={kind}
    >
      {eintraege.length === 0 ? (
        <Leer>Gerade steht nichts Besonderes an. Genießt die Zeit!</Leer>
      ) : (
        <ul className="ruhige-liste">
          {eintraege.map((e) => (
            <li key={e.id}>
              <BereichMarke bereich={e.bereich} zusatz={`meist mit ${spanneAlsText(e.von, e.bis)}`} />
              <h2>{e.titel}</h2>
              <p>{e.text}</p>
              {e.zusatz && (
                <p className="zusatzzeile">
                  <b>{e.zusatz.label}</b> {e.zusatz.text}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </Unterseite>
  );
}

function EtappenEintrag({ e }: { e: Etappe }) {
  return (
    <li>
      <BereichMarke bereich={e.bereich} zusatz={`meist mit ${spanneAlsText(e.von, e.bis)}`} />
      <h2>{e.titel}</h2>
      <p>{e.text}</p>
      {e.tipp && (
        <p className={`zusatzzeile ${e.tippArt === 'hinweis' ? 'hinweis' : ''}`}>
          <b>{e.tippArt === 'hinweis' ? 'Hinweis:' : 'Spielidee:'}</b> {e.tipp}
        </p>
      )}
    </li>
  );
}

export function Entwicklung({ kind }: { kind: Kind }) {
  const phase = aktuellePhase(kind);
  const dran = aktuelleEtappen(kind).filter((e) => e.bereich !== 'alltag');
  const demnaechst = kommendeEtappen(kind);
  return (
    <Unterseite
      titel="Gerade dran"
      intro="Entwicklungsschritte, deren typische Zeit gerade läuft. Jedes Kind hat sein eigenes Tempo – das sind Spannbreiten, keine Termine."
      kind={kind}
    >
      {dran.length === 0 ? (
        <Leer>Gerade beginnt kein neuer Schritt – euer Kind festigt, was es schon kann.</Leer>
      ) : (
        <ul className="ruhige-liste">{dran.map((e) => <EtappenEintrag key={e.id} e={e} />)}</ul>
      )}

      {demnaechst.length > 0 && (
        <section className="unterabschnitt">
          <h2 className="unterabschnitt-titel">Als Nächstes, irgendwann</h2>
          <ul className="ruhige-liste kompakt">
            {demnaechst.map((e) => (
              <li key={e.id}>
                <BereichMarke bereich={e.bereich} zusatz={`meist mit ${spanneAlsText(e.von, e.bis)}`} />
                <h2>{e.titel}</h2>
              </li>
            ))}
          </ul>
        </section>
      )}

      {phase?.abklaeren && (
        <section className="warnhinweis" aria-labelledby="warnung-titel">
          <div className="warnhinweis-kopf">
            <span className="i-kreis" aria-hidden="true">i</span>
            <h2 id="warnung-titel">Nicht bis zur nächsten U warten, wenn …</h2>
          </div>
          <p>{phase.abklaeren}</p>
          <p className="gedaempft klein">Sprecht dann lieber zeitnah mit eurer Kinderarztpraxis.</p>
        </section>
      )}
    </Unterseite>
  );
}

export function Spielen({ kind }: { kind: Kind }) {
  const ideen = aktuellePhase(kind)?.spielideen ?? [];
  return (
    <Unterseite
      titel="Spielideen für diese Zeit"
      intro="Keine Pflicht – was euch beiden Spaß macht, ist richtig."
      kind={kind}
    >
      {ideen.length === 0 ? (
        <Leer>Für dieses Alter folgen die Spielideen noch.</Leer>
      ) : (
        <ul className="ruhige-liste">
          {ideen.map((s) => (
            <li key={s.titel}>
              <BereichMarke bereich={s.bereich} />
              <h2>{s.titel}</h2>
              <p>{s.text}</p>
              {s.hinweis && (
                <p className="zusatzzeile hinweis">
                  <b>Hinweis:</b> {s.hinweis}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </Unterseite>
  );
}
