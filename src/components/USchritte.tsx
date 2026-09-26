import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { datumFormat } from '../lib/alter';
import { maskottchenBild, mitName, uSchritte, uTermine, untersuchungen, type Quelle } from '../lib/inhalte';
import { uKalenderHerunterladen } from '../lib/kalender';
import type { Kind } from '../lib/kind';
import { useSeitentitel } from '../lib/seite';
import type { Notizen } from '../lib/speicher';
import { Schrittfolge, type Seite } from './Schrittfolge';

const ERSTE_KLEINKIND_U = untersuchungen.findIndex((u) => u.id === 'U7');

function QuelleLink({ quelle }: { quelle: Quelle }) {
  return (
    <a className="quelle-link" href={quelle.url} target="_blank" rel="noreferrer">
      Quelle: {quelle.name}
    </a>
  );
}

/** „Ux Schritt für Schritt“: die U in der Reihenfolge des Praxisbesuchs – vom Vorbereiten bis danach */
export function USchritte({ kind, notizen }: { kind: Kind; notizen: Notizen }) {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const termine = uTermine(kind);
  const index = termine.findIndex((t) => t.untersuchung.id.toUpperCase() === id.toUpperCase());
  const termin = termine[index];
  useSeitentitel(termin ? `${termin.untersuchung.id} Schritt für Schritt` : 'Schritt für Schritt');
  if (!termin) return <Navigate to="/naechste-u" replace />;

  const u = termin.untersuchung;
  const alt = uSchritte;
  const kleinkind = index >= ERSTE_KLEINKIND_U;
  const uQuelle: Quelle = { name: `kindergesundheit-info.de – ${u.id}-Untersuchung`, url: u.url };
  const naechste = termine[index + 1];
  const zurueck = () => navigate(`/u/${u.id}`, { replace: true });

  // Was ihr euch notiert habt: eigene Fragen und abgehakte Beobachtungen
  const eigene = notizen.eigeneFragen[u.id] ?? [];
  const beobachtet = (notizen.beobachtet[u.id] ?? []).filter((b) => u.beobachten.includes(b)).map((b) => mitName(b, kind));
  const gespraechThemen = u.passiert.find((p) => p.titel === 'Gespräch')?.text;

  const seiten: Seite[] = [];

  seiten.push({
    schluessel: 'vorher',
    bild: maskottchenBild(kind.profil.maskottchen),
    titel: alt.vorher.titel,
    inhalt: (
      <>
        <p>{u.vorher ?? (kleinkind ? alt.vorher.kind.text : alt.vorher.baby.text)}</p>
        {/* U1: „Mitbringen“ ist dort nur ein Hinweis – ihr seid ja schon da */}
        {u.mitbringen.length > 0 && u.id !== 'U1' && (
          <div className="schritt-karte">
            <b>{alt.vorher.mitbringenTitel}</b>
            <ul>
              {u.mitbringen.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          </div>
        )}
        <QuelleLink quelle={u.vorher ? uQuelle : kleinkind ? alt.vorher.kind.quelle : alt.vorher.baby.quelle} />
      </>
    ),
  });

  if (!u.ohneMessen) {
    seiten.push({
      schluessel: 'messen',
      titel: alt.messen.titel,
      inhalt: (
        <>
          <p>{alt.messen.text}</p>
          <QuelleLink quelle={uQuelle} />
        </>
      ),
    });
  }

  for (const s of u.schritte) {
    seiten.push({
      schluessel: `schritt-${s.titel}`,
      titel: s.titel,
      inhalt: (
        <>
          <p>{s.text}</p>
          <QuelleLink quelle={uQuelle} />
        </>
      ),
    });
  }

  if (gespraechThemen) {
    seiten.push({
      schluessel: 'gespraech',
      titel: alt.gespraech.titel,
      inhalt: (
        <>
          <p>
            {alt.gespraech.text} {gespraechThemen}.
          </p>
          <div className="schritt-karte">
            <b>{alt.gespraech.eigeneTitel}</b>
            {eigene.length + beobachtet.length > 0 ? (
              <ul>
                {eigene.map((f, i) => (
                  <li key={`f-${i}`}>„{f}“</li>
                ))}
                {beobachtet.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            ) : (
              <p className="gedaempft klein">{alt.gespraech.leer}</p>
            )}
          </div>
          <QuelleLink quelle={uQuelle} />
        </>
      ),
    });
  }

  if (u.impfungen) {
    seiten.push({
      schluessel: 'impfung',
      titel: alt.impfung.titel,
      inhalt: (
        <>
          <p>{u.impfungen}</p>
          <div className="schritt-karte">
            <b>So könnt ihr helfen</b>
            <p>{kleinkind ? alt.impfung.kind.text : alt.impfung.baby.text}</p>
            {!kleinkind && /rotavir/i.test(u.impfungen) && <p className="klein">{alt.impfung.baby.rotaviren}</p>}
          </div>
          <QuelleLink quelle={alt.impfung.quelle} />
          {u.impfQuelle && <QuelleLink quelle={u.impfQuelle} />}
        </>
      ),
    });
  }

  seiten.push({
    schluessel: 'danach',
    bild: maskottchenBild(kind.profil.maskottchen),
    titel: alt.danach.titel,
    inhalt: (
      <>
        <p>{alt.danach.text}</p>
        {naechste ? (
          <div className="schritt-karte">
            <b>
              {alt.danach.naechste} {naechste.untersuchung.id}
            </b>
            <p>
              {naechste.untersuchung.zeitraum} · ab {datumFormat.format(naechste.beginn)}
            </p>
            {naechste.ende > kind.jetzt && (
              <button
                type="button"
                className="knopf knopf-zweit"
                onClick={() => uKalenderHerunterladen(naechste, kind.name, kind.id)}
              >
                {naechste.untersuchung.id} in den Kalender
              </button>
            )}
          </div>
        ) : (
          <p>{alt.danach.letzte}</p>
        )}
      </>
    ),
  });

  return (
    <Schrittfolge
      key={u.id} // neue U → wieder bei Schritt 1 beginnen
      kopf={`${u.id} Schritt für Schritt`}
      abbrechenText="Schließen"
      fertigText={`Zurück zur ${u.id}`}
      onFertig={zurueck}
      seiten={seiten}
    />
  );
}
