import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { abstandAlsText, datumFormat, letzterTag, spanneAlsText, tageZwischen } from '../lib/alter';
import {
  aktuelleEtappen,
  aktuellePhase,
  bereichsName,
  kommendeEtappen,
  zahnarzt,
  zahnTermine,
  type Bereich,
  type Etappe,
  type Quelle,
} from '../lib/inhalte';
import type { Kind } from '../lib/kind';
import { useSeitentitel } from '../lib/seite';

/** Gemeinsamer Aufbau: Zurück, Titel, Einleitung, Inhalt, Fußnoten */
function Unterseite({ titel, kurztitel, intro, children }: { titel: string; kurztitel: string; intro: string; children: ReactNode }) {
  useSeitentitel(kurztitel);
  return (
    <div className="unterseite">
      <Link to="/" className="zurueck-link">← Heute</Link>
      <h1 tabIndex={-1}>{titel}</h1>
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

/** Kleiner Quellen-Link unter einem Eintrag */
function QuelleLink({ quelle }: { quelle?: Quelle }) {
  if (!quelle) return null;
  return (
    <a className="quelle-link" href={quelle.url} target="_blank" rel="noreferrer">
      Quelle: {quelle.name}
    </a>
  );
}

const Leer = ({ children }: { children: ReactNode }) => <p className="liste-leer">{children}</p>;

export function Begegnen({ kind }: { kind: Kind }) {
  const eintraege = aktuelleEtappen(kind).filter((e) => e.bereich === 'alltag');
  return (
    <Unterseite
      titel="Was euch gerade begegnen kann"
      kurztitel="Begegnet euch"
      intro="Typische Phasen in diesem Alter – damit ihr wisst: Das ist häufig und meist ganz normal."
    >
      {eintraege.length === 0 ? (
        <Leer>Gerade ist es eher ruhig – euer Kind festigt, was es schon kann.</Leer>
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
              <QuelleLink quelle={e.quelle} />
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
      <QuelleLink quelle={e.quelle} />
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
      kurztitel="Gerade dran"
      intro="Entwicklungsschritte, deren typische Zeit gerade läuft. Jedes Kind hat sein eigenes Tempo – das sind Spannbreiten, keine Termine."
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
        <section id="warnzeichen" className="warnhinweis" aria-labelledby="warnung-titel">
          <div className="warnhinweis-kopf">
            <span className="i-kreis" aria-hidden="true">i</span>
            <h2 id="warnung-titel">Nicht bis zur nächsten U warten, wenn …</h2>
          </div>
          <p>{phase.abklaeren}</p>
          <p className="gedaempft klein">Sprecht dann lieber zeitnah mit eurer Kinderarztpraxis.</p>
          {phase.notfall && <p className="notfall">{phase.notfall}</p>}
          {phase.quellen?.map((q) => <QuelleLink key={q.url} quelle={q} />)}
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
      kurztitel="Spielideen"
      intro="Keine Pflicht – was euch beiden Spaß macht, ist richtig."
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

export function Zahnarzt({ kind }: { kind: Kind }) {
  const termine = zahnTermine(kind);
  return (
    <Unterseite
      titel="Beim Zahnarzt"
      kurztitel="Zahnarzt"
      intro="Neben den U-Untersuchungen gibt es bis zum 3. Geburtstag drei Termine in der Zahnarztpraxis. Bei gesetzlich Versicherten übernimmt die Krankenkasse sie."
    >
      <ul className="ruhige-liste kompakt">
        {termine.map(({ termin, beginn, ende }) => (
          <li key={termin.id}>
            <span className="zahn-kopf">
              <h2>{termin.id}</h2>
              <span className="pille">
                {ende <= kind.jetzt
                  ? 'vorbei'
                  : beginn <= kind.jetzt
                    ? 'jetzt dran'
                    : abstandAlsText(tageZwischen(kind.jetzt, beginn))}
              </span>
            </span>
            <p>
              {termin.zeitraum}
              <span className="gedaempft">
                {' '}
                · {datumFormat.format(beginn)} bis {datumFormat.format(letzterTag(ende))}
              </span>
            </p>
          </li>
        ))}
      </ul>

      <section className="unterabschnitt">
        <h2 className="unterabschnitt-titel">Was dort passiert</h2>
        <ul className="ruhige-liste">
          {zahnarzt.passiert.map((p) => (
            <li key={p.titel}>
              <h2>{p.titel}</h2>
              <p>{p.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="unterabschnitt">
        <h2 className="unterabschnitt-titel">Gut zu wissen</h2>
        <ul className="ruhige-liste kompakt">
          {zahnarzt.hinweise.map((h) => (
            <li key={h}>
              <p>{h}</p>
            </li>
          ))}
        </ul>
        <QuelleLink quelle={zahnarzt.quelle} />
        <QuelleLink quelle={zahnarzt.zeitraumQuelle} />
      </section>
    </Unterseite>
  );
}
