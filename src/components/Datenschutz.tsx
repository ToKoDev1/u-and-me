import { useRef, useState, type ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { useSeitentitel } from '../lib/seite';
import {
  allesLoeschen,
  sicherungEinspielen,
  sicherungHerunterladen,
  sicherungLesen,
  speicherVerfuegbar,
} from '../lib/speicher';
import { Symbol } from './Symbol';

/** Datenschutzhinweis und Verwaltung der auf dem Gerät gespeicherten Daten */
export function Datenschutz() {
  useSeitentitel('Datenschutz & Daten');
  const [meldung, setMeldung] = useState('');
  const dateiFeld = useRef<HTMLInputElement>(null);

  function exportieren() {
    if (!sicherungHerunterladen()) return setMeldung('Es sind noch keine Angaben gespeichert.');
    setMeldung('Die Sicherung wurde heruntergeladen. Bewahrt sie gut auf – sie enthält eure Angaben.');
  }

  async function importieren(e: ChangeEvent<HTMLInputElement>) {
    const datei = e.target.files?.[0];
    e.target.value = '';
    if (!datei) return;
    const daten = sicherungLesen(await datei.text());
    if (!daten) return setMeldung('Diese Datei ist keine U & Me-Sicherung. Wählt eine Datei, die ihr mit „Sicherung herunterladen“ gespeichert habt (u-and-me-sicherung-….json).');
    if (!window.confirm('Sicherung einspielen? Die jetzigen Angaben auf diesem Gerät werden dabei ersetzt.')) return;
    if (!sicherungEinspielen(daten)) return setMeldung('Die Sicherung konnte nicht gespeichert werden. Bitte versucht es noch einmal oder prüft, ob euer Browser Daten speichern darf.');
    window.location.assign(import.meta.env.BASE_URL); // neu laden mit den eingespielten Daten
  }

  function loeschen() {
    if (!window.confirm('Alle Angaben, Notizen und Fragen auf diesem Gerät endgültig löschen?')) return;
    allesLoeschen();
    window.location.assign(import.meta.env.BASE_URL);
  }

  return (
    <div className="unterseite">
      <Link to="/" className="zurueck-link">← Heute</Link>
      <h1 tabIndex={-1}>Datenschutz &amp; Daten</h1>

      {!speicherVerfuegbar() && (
        <p className="fehler" role="alert">
          Euer Browser erlaubt dieser Seite gerade nicht, Daten zu speichern (z. B. privates Fenster oder blockierte
          Website-Daten). Eure Angaben gehen dann beim Schließen verloren.
        </p>
      )}

      <section className="ruhige-liste text-liste">
        <h2>Eure Daten bleiben auf diesem Gerät</h2>
        <p>
          U &amp; Me speichert Geburtsdatum, Namen, Maskottchen, Beobachtungen und eure Fragen <b>nur im Speicher dieses
          Browsers</b> (localStorage). Nichts davon wird an uns oder an Dritte geschickt. Es gibt kein Konto, keine
          Cookies, kein Tracking und keine Werbung. Die Schrift wird mit der App ausgeliefert, nicht von Google geladen.
        </p>
        <h2>Hosting</h2>
        <p>
          Die App wird über GitHub Pages (GitHub Inc.) bereitgestellt. Beim Aufruf verarbeitet GitHub technisch nötige
          Daten wie eure IP-Adresse, um die Seite auszuliefern. Mehr dazu in der{' '}
          <a href="https://docs.github.com/de/site-policy/privacy-policies/github-general-privacy-statement" target="_blank" rel="noreferrer">
            Datenschutzerklärung von GitHub
          </a>
          .
        </p>
        <h2>Wer steckt dahinter?</h2>
        <p>Ein privates, nicht-kommerzielles Lernprojekt für den Freundeskreis. Die Inhalte ersetzen keine ärztliche Beratung.</p>
      </section>

      <section className="abschnitt">
        <h2>Eure Daten verwalten</h2>
        <button type="button" className="knopf knopf-zweit knopf-mit-symbol" onClick={exportieren}>
          <Symbol name="herunterladen" /> Sicherung herunterladen
        </button>
        <button type="button" className="knopf knopf-zweit knopf-mit-symbol" onClick={() => dateiFeld.current?.click()}>
          <Symbol name="hochladen" /> Sicherung einspielen
        </button>
        <input ref={dateiFeld} type="file" accept="application/json,.json" hidden onChange={importieren} />
        <p className="gedaempft klein">
          Mit einer Sicherung könnt ihr eure Angaben auf ein neues Handy mitnehmen oder nach dem Löschen der
          Browserdaten wiederherstellen.
        </p>
        {meldung && <p className="hinweisbox" role="status">{meldung}</p>}
        <button type="button" className="knopf-loeschen" onClick={loeschen}>
          Alle Angaben auf diesem Gerät löschen
        </button>
      </section>
    </div>
  );
}
