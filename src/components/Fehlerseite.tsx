import { Component, type ErrorInfo, type ReactNode } from 'react';
import { allesLoeschen, sicherungHerunterladen } from '../lib/speicher';

type State = { fehler: Error | null };

/**
 * Fängt unerwartete Fehler ab und zeigt eine freundliche Seite statt einer weißen.
 * (Fehlergrenzen müssen in React als Klasse geschrieben werden.)
 */
export class Fehlerseite extends Component<{ children: ReactNode }, State> {
  state: State = { fehler: null };

  static getDerivedStateFromError(fehler: Error): State {
    return { fehler };
  }

  componentDidCatch(fehler: Error, info: ErrorInfo) {
    console.error('U & Me – unerwarteter Fehler', fehler, info.componentStack);
  }

  render() {
    if (!this.state.fehler) return this.props.children;
    return (
      <main className="fehlerseite">
        <h1>Da ist etwas schiefgelaufen.</h1>
        <p className="gedaempft">
          Das tut uns leid. Meistens hilft es, die Seite neu zu laden. Wenn der Fehler bleibt, könnt ihr die auf diesem
          Gerät gespeicherten Angaben zurücksetzen und neu starten – ladet vorher am besten eine Sicherung herunter. Die
          könnt ihr danach unter „Datenschutz & Daten“ wieder einspielen.
        </p>
        <button type="button" className="knopf" onClick={() => window.location.reload()}>
          Neu laden
        </button>
        <button type="button" className="knopf knopf-zweit" onClick={() => sicherungHerunterladen()}>
          Sicherung herunterladen
        </button>
        <button
          type="button"
          className="link-leise"
          onClick={() => {
            if (window.confirm('Alle Angaben auf diesem Gerät löschen und neu starten? Habt ihr eine Sicherung, könnt ihr sie danach wieder einspielen.')) {
              allesLoeschen();
              window.location.assign(import.meta.env.BASE_URL);
            }
          }}
        >
          Angaben zurücksetzen
        </button>
      </main>
    );
  }
}
