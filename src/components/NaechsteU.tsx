import { useRef, useState, type FormEvent, type TouchEvent } from 'react';
import { Link, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { abstandAlsText, letzterTag, tageZwischen } from '../lib/alter';
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
import { useSeitentitel } from '../lib/seite';

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
  const wischStart = useRef<{ x: number; y: number } | null>(null);

  // Nachbar-U zum Wischen und für die Leiste unten
  const alle = uTermine(kind);
  const index = alle.findIndex((t) => t.untersuchung.id === termin.untersuchung.id);
  const vorige = alle[index - 1]?.untersuchung.id;
  const folgende = alle[index + 1]?.untersuchung.id;
  const wechseln = (ziel: string | undefined, richtung: 'vor' | 'zurueck') =>
    ziel && navigate(`/u/${ziel}`, { replace: true, state: { richtung } });

  // Deutlich waagerecht wischen wechselt die U – senkrechtes Scrollen bleibt unberührt
  function beiStart(e: TouchEvent) {
    const ziel = e.target as HTMLElement;
    wischStart.current = ziel.closest('input, textarea') ? null : { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }
  function beiEnde(e: TouchEvent) {
    const start = wischStart.current;
    wischStart.current = null;
    if (!start) return;
    const dx = e.changedTouches[0].clientX - start.x;
    const dy = e.changedTouches[0].clientY - start.y;
    if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    if (dx < 0) wechseln(folgende, 'vor');
    else wechseln(vorige, 'zurueck');
  }
  const richtung = (state as { richtung?: string } | null)?.richtung;

  // Unbekannte Adresse wie /u/U9 oder /u/xyz → zur nächsten U
  if (id && !gewaehlt) return <Navigate to="/naechste-u" replace />;

  return (
    <div
      className={`u-seite ${richtung === 'vor' ? 'rein-von-rechts' : richtung === 'zurueck' ? 'rein-von-links' : ''}`}
      key={termin.untersuchung.id}
      onTouchStart={beiStart}
      onTouchEnd={beiEnde}
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
        <Link to={`/u/${termin.untersuchung.id}/schritte`} className="u-schritte-knopf">
          <span aria-hidden="true">▶</span> {termin.untersuchung.id} Schritt für Schritt
        </Link>
      </div>
      <Zeitfenster termin={termin} kind={kind} />
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

function Zeitfenster({ termin, kind }: { termin: UTermin; kind: Kind }) {
  const vorbei = termin.ende <= kind.jetzt;
  const laeuft = !vorbei && termin.beginn <= kind.jetzt;
  const status = vorbei ? 'vorbei' : laeuft ? 'Fenster läuft' : abstandAlsText(tageZwischen(kind.jetzt, termin.beginn));
  const einTag = termin.untersuchung.id === 'U1';

  return (
    <section className="karte-schatten u-zeitfenster" aria-label="Zeitfenster">
      <div className="naechste-u-kopf">
        <span className="titel-klein">Zeitfenster</span>
        <span className="pille">{status}</span>
      </div>
      {einTag ? (
        <p>Direkt nach der Geburt – meist noch im Kreißsaal.</p>
      ) : (
        <Datumskacheln von={termin.beginn} bis={letzterTag(termin.ende)} />
      )}
      {vorbei ? (
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
    if (!frage || eigene.some((f) => f.toLowerCase() === frage.toLowerCase())) {
      setNeueFrage('');
      setEingabeOffen(false);
      return;
    }
    aendern({ ...notizen, eigeneFragen: { ...notizen.eigeneFragen, [u.id]: [...eigene, frage] } });
    setNeueFrage('');
    setEingabeOffen(false);
  }

  function frageLoeschen(index: number) {
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
            <button type="submit" className="knopf">Merken</button>
          </form>
        ) : (
          <button type="button" className="frage-neu" onClick={() => setEingabeOffen(true)}>+ Eigene Frage notieren</button>
        )}
        <p className="gedaempft klein">Die Fragen und Beobachtungen sind Anregungen und bleiben nur auf diesem Gerät.</p>
      </section>
    </>
  );
}
