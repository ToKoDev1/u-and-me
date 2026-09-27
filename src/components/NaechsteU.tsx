import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { abstandAlsText, letzterTag, restzeitAlsText, tageZwischen } from '../lib/alter';
import {
  mitName,
  naechsteUntersuchung,
  uTermin,
  uTermine,
  untersuchungenAbgerufen,
  type UTermin,
} from '../lib/inhalte';
import type { Kind } from '../lib/kind';
import { uKalenderHerunterladen } from '../lib/kalender';
import type { Notizen } from '../lib/speicher';
import { Datumskacheln } from './Datumskacheln';
import { Symbol } from './Symbol';
import { UAbhaken } from './UAbhaken';
import { useSeitentitel } from '../lib/seite';
import { useWischen } from '../lib/wischen';

/** Detailseite einer U – ohne Parameter die nächste U, unter /u/U3 eine bestimmte */
type NotizProps = { notizen: Notizen; onNotizen: (neu: Notizen) => void };

export function NaechsteU({ kind, notizen, onNotizen }: { kind: Kind } & NotizProps) {
  const { id } = useParams();
  const naechste = naechsteUntersuchung(kind);
  const gewaehlt = id ? uTermin(kind, id) : undefined;
  const termin = gewaehlt || naechste || uTermine(kind).at(-1)!;
  const istNaechste = termin.untersuchung.id === naechste?.untersuchung.id;
  useSeitentitel(termin.untersuchung.id);
  const navigate = useNavigate();
  const { state } = useLocation();

  // Nachbar-U zum Wischen und für die Leiste unten
  const alle = uTermine(kind);
  const index = alle.findIndex((t) => t.untersuchung.id === termin.untersuchung.id);
  const vorige = alle[index - 1]?.untersuchung.id;
  const folgende = alle[index + 1]?.untersuchung.id;
  const wechseln = (ziel: string | undefined, richtung: 'vor' | 'zurueck') =>
    ziel && navigate(`/u/${ziel}`, { replace: true, state: { richtung } });

  // Nach links wischen → nächste U, nach rechts → vorige
  const wischen = useWischen(() => wechseln(folgende, 'vor'), () => wechseln(vorige, 'zurueck'));
  const richtung = (state as { richtung?: string } | null)?.richtung;

  // Unbekannte Adresse wie /u/U9 oder /u/xyz → zur nächsten U
  if (id && !gewaehlt) return <Navigate to="/naechste-u" replace />;

  return (
    <div
      className={`u-seite ${richtung === 'vor' ? 'rein-von-rechts' : richtung === 'zurueck' ? 'rein-von-links' : ''}`}
      key={termin.untersuchung.id}
      {...wischen}
    >
      <Link to="/" className="zurueck-link">← Heute</Link>
      <div className="u-kopf">
        <span className="u-kreis-gross">{termin.untersuchung.id}</span>
        <div>
          <div className="u-kopf-meta">{istNaechste ? 'Nächste Untersuchung' : 'Untersuchung'}</div>
          <h1 tabIndex={-1}>
            <span className="nur-screenreader">{termin.untersuchung.id}: </span>
            {termin.untersuchung.zeitraum}
          </h1>
        </div>
        {/* Leiser Link statt dritter Knopf – die Hauptaktion steht im Zeitfenster */}
        <Link to={`/u/${termin.untersuchung.id}/schritte`} className="u-schritte-link">
          <span aria-hidden="true">▶</span> So läuft die {termin.untersuchung.id} ab – Schritt für Schritt
        </Link>
      </div>
      <Zeitfenster termin={termin} kind={kind} notizen={notizen} onNotizen={onNotizen} />
      <WasPassiert termin={termin} />
      {/* key: Zustand beim Wechsel der U neu laden */}
      <Notizbereich key={termin.untersuchung.id} termin={termin} kind={kind} notizen={notizen} onNotizen={onNotizen} />
      <nav className="u-blaettern" aria-label="Andere U-Untersuchungen">
        {vorige ? (
          <Link to={`/u/${vorige}`} replace state={{ richtung: 'zurueck' }}>‹ {vorige}</Link>
        ) : (
          <span />
        )}
        <span className="gedaempft klein">Wischen zum Blättern</span>
        {folgende ? (
          <Link to={`/u/${folgende}`} replace state={{ richtung: 'vor' }}>{folgende} ›</Link>
        ) : (
          <span />
        )}
      </nav>
    </div>
  );
}

function Zeitfenster({ termin, kind, notizen, onNotizen }: { termin: UTermin; kind: Kind } & NotizProps) {
  const erledigt = !!notizen.uErledigt[termin.untersuchung.id];
  const vorbei = termin.ende <= kind.jetzt;
  const laeuft = !vorbei && termin.beginn <= kind.jetzt;
  const rest = laeuft ? tageZwischen(kind.jetzt, termin.ende) : Infinity;
  const status = erledigt
    ? 'erledigt'
    : vorbei
      ? 'vorbei'
      : rest <= 14
        ? restzeitAlsText(rest)
        : laeuft
          ? 'läuft'
          : abstandAlsText(tageZwischen(kind.jetzt, termin.beginn));
  const einTag = termin.untersuchung.id === 'U1';

  return (
    <section className="karte-schatten u-zeitfenster" aria-label="Zeitfenster">
      <div className="naechste-u-kopf">
        <span className="titel-klein">Zeitfenster</span>
        <span className={`pille ${!erledigt && rest <= 14 ? 'pille-bald' : ''}`}>{status}</span>
      </div>
      {einTag ? (
        <p>Direkt nach der Geburt – meist noch im Kreißsaal.</p>
      ) : (
        <Datumskacheln von={termin.beginn} bis={letzterTag(termin.ende)} />
      )}
      {erledigt ? null : vorbei ? (
        <p className="gedaempft klein">Dieses Zeitfenster liegt hinter euch. Die Inhalte bleiben zum Nachlesen hier.</p>
      ) : (
        !einTag && (
          <>
            <p className="gedaempft klein">
              Am besten jetzt einen Termin in der Praxis ausmachen – ein Tag irgendwo in diesem Fenster ist gut.
            </p>
            <button type="button" className="knopf" onClick={() => uKalenderHerunterladen(termin, kind.name, kind.id)}>
              In euren Kalender eintragen
            </button>
            <p className="knopf-hinweis">Lädt eine Kalenderdatei (.ics) herunter</p>
          </>
        )
      )}
      <UAbhaken termin={termin} kind={kind} notizen={notizen} onNotizen={onNotizen} />
    </section>
  );
}

function WasPassiert({ termin }: { termin: UTermin }) {
  const u = termin.untersuchung;
  return (
    <section className="abschnitt">
      <div className="titel-mit-quelle">
        <h2>Was bei der {u.id} passiert</h2>
        <a href={u.url} target="_blank" rel="noreferrer">
          Quelle, Stand {untersuchungenAbgerufen}
        </a>
      </div>
      <div className="liste-karte">
        {u.passiert.map((p) => (
          <div key={p.titel} className="liste-eintrag">
            <b>{p.titel}</b>
            <div className="gedaempft">{p.text}</div>
          </div>
        ))}
        {u.impfungen && (
          <div className="liste-eintrag">
            <b>Impfungen</b>
            <div className="gedaempft">{u.impfungen}</div>
            {u.impfQuelle && (
              <a className="quelle-link" href={u.impfQuelle.url} target="_blank" rel="noreferrer">
                Quelle: {u.impfQuelle.name}
              </a>
            )}
          </div>
        )}
      </div>
      {u.mitbringen.length > 0 && (
        <div className="hinweisbox">
          <Symbol name={u.id === 'U1' ? 'info' : 'tasche'} className="hinweisbox-symbol" />
          <p>
            <b>{u.id === 'U1' ? 'Gut zu wissen:' : 'Mitbringen:'}</b> {u.mitbringen.join(', ')}
          </p>
        </div>
      )}
    </section>
  );
}

/** Checkliste und Fragen – beides nur lokal gespeichert */
function Notizbereich({ termin, kind, notizen, onNotizen }: { termin: UTermin; kind: Kind } & NotizProps) {
  const u = termin.untersuchung;
  const [neueFrage, setNeueFrage] = useState('');
  const [eingabeOffen, setEingabeOffen] = useState(false);
  // Nach Speichern/Löschen: Fokus zurück auf „+ Eigene Frage“ (sonst fällt er ins Leere) und kurze Ansage
  const neuKnopf = useRef<HTMLButtonElement>(null);
  const [ansage, setAnsage] = useState('');
  const fokusZurueck = useRef(false);
  useEffect(() => {
    if (fokusZurueck.current && !eingabeOffen) {
      neuKnopf.current?.focus();
      fokusZurueck.current = false;
    }
  });

  const beobachtet = notizen.beobachtet[u.id] ?? [];
  const eigene = notizen.eigeneFragen[u.id] ?? [];

  function aendern(neu: Notizen) {
    onNotizen(neu);
  }

  function umschalten(text: string) {
    const liste = beobachtet.includes(text) ? beobachtet.filter((t) => t !== text) : [...beobachtet, text];
    aendern({ ...notizen, beobachtet: { ...notizen.beobachtet, [u.id]: liste } });
  }

  function frageHinzufuegen(e: FormEvent) {
    e.preventDefault();
    const frage = neueFrage.trim();
    // Leer oder schon notiert (Groß-/Kleinschreibung egal) → nichts doppelt speichern
    fokusZurueck.current = true;
    if (!frage || eigene.some((f) => f.toLowerCase() === frage.toLowerCase())) {
      setNeueFrage('');
      setEingabeOffen(false);
      return;
    }
    aendern({ ...notizen, eigeneFragen: { ...notizen.eigeneFragen, [u.id]: [...eigene, frage] } });
    setNeueFrage('');
    setEingabeOffen(false);
    setAnsage(`Frage gespeichert: ${frage}`);
  }

  function frageLoeschen(index: number) {
    fokusZurueck.current = true;
    setAnsage('Frage gelöscht');
    aendern({ ...notizen, eigeneFragen: { ...notizen.eigeneFragen, [u.id]: eigene.filter((_, i) => i !== index) } });
  }

  return (
    <>
      {u.beobachten.length > 0 && (
        <section className="abschnitt">
          <div>
            <h2>Was ist euch aufgefallen?</h2>
            <p className="gedaempft klein">Ein paar Gedankenstützen fürs Gespräch in der Praxis. Hakt ab, worüber ihr schon nachgedacht habt – es gibt kein Richtig oder Falsch.</p>
          </div>
          {u.beobachten.map((vorlage) => {
            const an = beobachtet.includes(vorlage);
            return (
              <label key={vorlage} className="check-eintrag">
                <input type="checkbox" checked={an} onChange={() => umschalten(vorlage)} />
                <span className="kaestchen check-kaestchen" aria-hidden="true">{an ? '✓' : ''}</span>
                <span>{mitName(vorlage, kind)}</span>
              </label>
            );
          })}
        </section>
      )}

      <section className="abschnitt">
        <h2>Fragen an die Praxis</h2>
        {u.fragen.map((f) => (
          <div key={f} className="frage-blase">„{f}“</div>
        ))}
        {eigene.map((f, i) => (
          <div key={`${i}-${f}`} className="frage-blase eigene">
            <span>„{f}“</span>
            <button type="button" onClick={() => frageLoeschen(i)} aria-label={`Frage „${f}“ löschen`}>×</button>
          </div>
        ))}
        {eingabeOffen ? (
          <form className="frage-eingabe" onSubmit={frageHinzufuegen}>
            <input
              type="text"
              value={neueFrage}
              onChange={(e) => setNeueFrage(e.target.value)}
              placeholder="Eure Frage …"
              aria-label="Eigene Frage"
              autoFocus
            />
            <button type="submit" className="knopf">Frage speichern</button>
          </form>
        ) : (
          <button ref={neuKnopf} type="button" className="frage-neu" onClick={() => setEingabeOffen(true)}>+ Eigene Frage notieren</button>
        )}
        <p className="nur-screenreader" aria-live="polite">{ansage}</p>
        <p className="gedaempft klein">Die Fragen und Beobachtungen sind Anregungen und bleiben nur auf diesem Gerät.</p>
      </section>
    </>
  );
}
