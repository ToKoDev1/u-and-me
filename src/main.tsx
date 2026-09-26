import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
// Schrift Nunito – selbst gehostet über npm, kein Request an Google Fonts
import '@fontsource/nunito/latin-400.css';
import '@fontsource/nunito/latin-700.css';
import '@fontsource/nunito/latin-800.css';
import './styles/tokens.css';
import './styles/app.css';
import App from './App';
import { Fehlerseite } from './components/Fehlerseite';
import { darstellungAnwenden, systemBeobachten } from './lib/darstellung';
import { allesLoeschen } from './lib/speicher';

// Nur in der Entwicklung: ?neu löscht alle gespeicherten Angaben und startet mit dem Onboarding
if (import.meta.env.DEV && new URLSearchParams(window.location.search).has('neu')) {
  allesLoeschen();
  window.history.replaceState(null, '', window.location.pathname); // ?neu aus der Adresse entfernen
}

// Nur in der Entwicklung: ?darstellung=dunkel erzwingt eine Darstellung (für Screenshots), ohne sie zu speichern
const erzwungen = import.meta.env.DEV ? new URLSearchParams(window.location.search).get('darstellung') : null;
darstellungAnwenden(erzwungen === 'hell' || erzwungen === 'dunkel' ? erzwungen : undefined);
systemBeobachten();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Fehlerseite>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <App />
      </BrowserRouter>
    </Fehlerseite>
  </StrictMode>,
);

// Startbildschirm aus index.html kurz zeigen (die Erklärung übernimmt beim ersten Öffnen die Welcome-Tour)
const ANZEIGE_MS = 1500;
const start = document.getElementById('start');
if (start) {
  window.setTimeout(() => {
    start.classList.add('weg');
    window.setTimeout(() => start.remove(), 400); // nach dem Ausblenden (0,35 s)
  }, Math.max(0, ANZEIGE_MS - performance.now()));
}
