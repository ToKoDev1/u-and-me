import { useState } from 'react';
import { iosHinweisWeg, iosHinweisZeigen } from '../lib/speicher';
import { Symbol } from './Symbol';

// Zum Ausprobieren am Rechner: ?ioshinweis
const erzwungen = new URLSearchParams(window.location.search).has('ioshinweis');

/**
 * Nur auf iPhone/iPad im Safari-Tab: Safari löscht Website-Daten nach einigen Tagen ohne Besuch.
 * Auf dem Home-Bildschirm passiert das nicht – darum ein einmaliger, wegklickbarer Tipp.
 */
export function IosHinweis() {
  const [zeigen, setZeigen] = useState(() => erzwungen || iosHinweisZeigen());
  if (!zeigen) return null;
  return (
    <section className="ios-hinweis" aria-labelledby="ios-hinweis-titel">
      <h2 id="ios-hinweis-titel">
        <Symbol name="schloss" /> Damit eure Angaben bleiben
      </h2>
      <p>
        Safari löscht Daten von Websites, die einige Tage nicht geöffnet wurden. Legt U & Me auf euren Home-Bildschirm –
        dann bleiben eure Angaben erhalten:
      </p>
      <ol>
        <li>
          Unten auf <b>Teilen</b> tippen (Quadrat mit Pfeil)
        </li>
        <li>
          <b>Zum Home-Bildschirm</b> wählen
        </li>
        <li>Ab jetzt U & Me über das neue Symbol öffnen</li>
      </ol>
      <button
        type="button"
        className="knopf knopf-zweit"
        onClick={() => {
          iosHinweisWeg();
          setZeigen(false);
        }}
      >
        Verstanden
      </button>
    </section>
  );
}
