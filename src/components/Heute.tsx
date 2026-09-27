import { Link } from 'react-router-dom';
import { abstandAlsText, restzeitAlsText, spanneAlsText, tageZwischen } from '../lib/alter';
import {
  aktuelleEtappen,
  aktuelleWoche,
  offeneAufgaben,
  danach,
  letzteUntersuchung,
  aktuellePhase,
  etappenBeginn,
  naechsteUntersuchung,
  type Etappe,
} from '../lib/inhalte';
import type { Kind } from '../lib/kind';
import type { Notizen } from '../lib/speicher';
import { useSeitentitel } from '../lib/seite';
import { Symbol } from './Symbol';
import { SprungZoom } from './Spruenge';
import { UZeitleiste } from './UZeitleiste';
import { Zeitring } from './Zeitring';

/**
 * Startseite: Ring (wo ihr steht) → eine wichtige Sache → nächste U → euer Weg (Zeitleiste + Sprünge)
 * → Bereiche → Zu erledigen → Warnzeichen. Läuft ein U-Fenster bald ab, steht die U ganz oben.
 */
export function Heute({ kind, notizen }: { kind: Kind; notizen: Notizen }) {
  useSeitentitel();
  const phase = aktuellePhase(kind);
  const aktuell = aktuelleEtappen(kind);
  const begegnen = aktuell.filter((e) => e.bereich === 'alltag');
  const geradeDran = aktuell.filter((e) => e.bereich !== 'alltag');
  const spielideen = phase?.spielideen ?? [];
  const naechsteU = naechsteUntersuchung(kind);
  const wichtig = heuteWichtig(kind, begegnen, geradeDran);
  // In den ersten 12 Wochen ersetzt die Woche „Heute wichtig“ – sie ist dann die wichtigste Orientierung
  const woche = aktuelleWoche(kind);
  const offen = offeneAufgaben(kind, notizen);
  // Läuft das U-Fenster bald ab, gehört die U ganz nach oben
  const restTage = naechsteU?.laeuftSchon ? tageZwischen(kind.jetzt, naechsteU.ende) : undefined;
  const dringend = restTage !== undefined && restTage <= 14;

  // Die nächste U: Wann sagt der Ring, die Karte sagt, was zu tun ist
  const uKarte = naechsteU && (
    <Link to="/naechste-u" className="zeile-link">
      {/* Unsichtbare Überschriften: Screenreader können so von Abschnitt zu Abschnitt springen */}
      <h2 className="nur-screenreader">Nächste Untersuchung</h2>
      <span className="zeile-stapel">
        <b>
          {naechsteU.laeuftSchon
            ? `${naechsteU.untersuchung.id}-Termin machen`
            : `${naechsteU.untersuchung.id} vorbereiten`}
        </b>
        <span className="gedaempft klein">Zeitfenster, Kalender, Ablauf</span>
      </span>
      {dringend ? (
        <span className="pille pille-bald">{restzeitAlsText(restTage)}</span>
      ) : naechsteU.laeuftSchon ? (
        <span className="pille">läuft</span>
      ) : (
        <span className="pille">{abstandAlsText(tageZwischen(kind.jetzt, naechsteU.beginn))}</span>
      )}
    </Link>
  );

  // Zu erledigen: die Aufgabe mit der nächsten Frist – ohne Zähler, damit es nicht nach Pflichtliste klingt
  const naechsteAufgabe = offen[0];
  const aufgabeTage = naechsteAufgabe?.frist ? tageZwischen(kind.jetzt, naechsteAufgabe.ende) : undefined;
  const aufgabeDringend = aufgabeTage !== undefined && aufgabeTage > 0 && aufgabeTage <= 7;
  const aufgabenKarte = naechsteAufgabe && (
    <Link to="/erledigen" className="zeile-link">
      <span className="zeile-stapel">
        <b>{naechsteAufgabe.titel}</b>
        <span className="gedaempft klein">Zu erledigen · als Nächstes</span>
      </span>
      {aufgabeDringend ? <span className="pille pille-bald">{restzeitAlsText(aufgabeTage)}</span> : <span aria-hidden="true">›</span>}
    </Link>
  );

  const kacheln = [
    { pfad: '/begegnen', titel: 'Begegnet euch', n: begegnen.length, eins: 'Thema', viele: 'Themen' },
    { pfad: '/entwicklung', titel: 'Gerade dran', n: geradeDran.length, eins: 'Schritt', viele: 'Schritte' },
    { pfad: '/spielen', titel: 'Spielideen', n: spielideen.length, eins: 'Idee', viele: 'Ideen' },
  ];

  return (
    <div className="heute">
      <Zeitring kind={kind} />

      {/* Läuft das U-Fenster in den nächsten 14 Tagen ab, zuerst die U */}
      {dringend && uKarte}

      {/* Das Wichtigste gleich unter dem Ring – als Sprechblase des Maskottchens.
          In den ersten 12 Wochen ist das die Lebenswoche, danach „Heute wichtig“. */}
      {woche && (
        <Link to="/woche" className={`wichtig ${dringend ? 'ohne-zipfel' : ''}`}>
          <h2 className="nur-screenreader">Diese Woche</h2>
          <span className="wichtig-label">{woche.woche}. Lebenswoche{kind.name ? ` mit ${kind.name}` : ''}</span>
          <span className="wichtig-titel">{woche.titel}</span>
          <span className="wichtig-text">{woche.typisch}</span>
          <span className="wichtig-meta">Was hilft · Für euch · Mehr dazu ›</span>
        </Link>
      )}

      {!woche && wichtig && (
        <Link to={wichtig.bereich === 'alltag' ? '/begegnen' : '/entwicklung'} className={`wichtig ${dringend ? 'ohne-zipfel' : ''}`}>
          <h2 className="nur-screenreader">Heute wichtig</h2>
          <span className="wichtig-label" aria-hidden="true">Heute wichtig</span>
          <span className="wichtig-titel">{wichtig.titel}</span>
          {/* Ein Tipp („Das hilft oft“) ist hier hilfreicher als die Beschreibung – andere Zusätze (z. B. Hinweise für ältere Kinder) nicht */}
          <span className="wichtig-text">{wichtig.zusatz?.label === 'Das hilft oft:' ? wichtig.zusatz.text : wichtig.text}</span>
          <span className="wichtig-meta">meist mit {spanneAlsText(wichtig.von, wichtig.bis)} · Mehr dazu ›</span>
        </Link>
      )}

      {!dringend && uKarte}

      {/* Eine Frist in den nächsten 7 Tagen (z. B. Standesamt) gehört nach oben */}
      {aufgabeDringend && aufgabenKarte}

      {/* Euer Weg: Zeitleiste U1–U9 und Zoom auf die Strecke zwischen letzter und nächster U */}
      <section className="weg-karte" aria-labelledby="weg-titel">
        <h2 id="weg-titel" className="nur-screenreader">
          Euer Weg von U zu U
        </h2>
        <UZeitleiste kind={kind} />
        <SprungZoom kind={kind} />
      </section>

      {phase && (
        <nav className="kacheln" aria-labelledby="bereiche-titel">
          <h2 id="bereiche-titel" className="nur-screenreader">Mehr zu dieser Zeit</h2>
          {kacheln.map((k) =>
            k.n > 0 ? (
              <Link key={k.pfad} to={k.pfad} className="kachel">
                <span className="kachel-titel">{k.titel}</span>
                <span className="kachel-info">{`${k.n} ${k.n === 1 ? k.eins : k.viele}`}</span>
              </Link>
            ) : (
              // Nichts drin → keine Verlinkung auf eine leere Seite
              <div key={k.pfad} className="kachel kachel-ruhig">
                <span className="kachel-titel">{k.titel}</span>
                <span className="kachel-info">gerade nichts Neues</span>
              </div>
            ),
          )}
        </nav>
      )}

      {!naechsteU && (
        // Nach der letzten U: ruhiger Abschluss statt leerer Startseite
        <section className="ruhige-liste abschluss" aria-labelledby="abschluss-titel">
          <h2 id="abschluss-titel">{danach.titel}</h2>
          <p>{danach.text}</p>
          <ul>
            {danach.termine.map((t) => (
              <li key={t.id}>
                <b>
                  {t.id} <span className="gedaempft">· {t.alter}</span>
                </b>
                <span>{t.text}</span>
              </li>
            ))}
          </ul>
          <p className="gedaempft klein">{danach.hinweis}</p>
          <a className="quelle-link" href={danach.quelle.url} target="_blank" rel="noreferrer">
            Quelle: {danach.quelle.name}
          </a>
        </section>
      )}

      {!aufgabeDringend && aufgabenKarte}

      {phase?.abklaeren && (
        // Warnzeichen immer erreichbar – auch wenn „Gerade dran“ gerade leer ist
        <Link to="/entwicklung#warnzeichen" className="zeile-link zeile-warnung">
          <span className="zeile-warnung-text">
            <Symbol name="info" />
            Wann ihr nicht bis zur nächsten U warten solltet
          </span>
          <span aria-hidden="true">›</span>
        </Link>
      )}

      {!phase && naechsteU && (
        <p className="gedaempft" style={{ textAlign: 'center' }}>
          Für dieses Alter gibt es in U &amp; Me gerade keine Inhalte. U &amp; Me begleitet euch bis zur {letzteUntersuchung.id}.
        </p>
      )}
    </div>
  );
}

/**
 * „Heute wichtig“: die Alltags-Etappe, die zuletzt begonnen hat (das Frischeste, was Eltern gerade erleben).
 * Gibt es keine, dann die zuletzt begonnene Entwicklungs-Etappe.
 */
function heuteWichtig(kind: Kind, begegnen: Etappe[], geradeDran: Etappe[]): Etappe | undefined {
  const juengste = (liste: Etappe[]) =>
    [...liste].sort((a, b) => etappenBeginn(kind, b).getTime() - etappenBeginn(kind, a).getTime())[0];
  return juengste(begegnen) ?? juengste(geradeDran);
}
