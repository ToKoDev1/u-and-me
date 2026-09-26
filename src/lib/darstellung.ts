// Hell/Dunkel und persönlicher Akzent.
// tokens.css schaltet die dunklen Farben nur über <html data-theme="dunkel"> um –
// deshalb setzen wir das Attribut hier: nach Systemeinstellung oder manueller Wahl.
import type { MaskottchenId } from './inhalte';

export type Darstellung = 'auto' | 'hell' | 'dunkel';

const SCHLUESSEL = 'u-and-me:darstellung';
const systemDunkel = window.matchMedia('(prefers-color-scheme: dark)');

export function darstellungLaden(): Darstellung {
  try {
    const wert = localStorage.getItem(SCHLUESSEL);
    return wert === 'hell' || wert === 'dunkel' ? wert : 'auto';
  } catch {
    return 'auto';
  }
}

export function darstellungSpeichern(wert: Darstellung): void {
  try {
    if (wert === 'auto') localStorage.removeItem(SCHLUESSEL);
    else localStorage.setItem(SCHLUESSEL, wert);
  } catch {
    // ignorieren – gilt dann nur bis zum Neuladen
  }
  darstellungAnwenden(wert);
}

export function darstellungAnwenden(wert: Darstellung = darstellungLaden()): void {
  const dunkel = wert === 'dunkel' || (wert === 'auto' && systemDunkel.matches);
  document.documentElement.dataset.theme = dunkel ? 'dunkel' : 'hell';
  // Browserleiste (theme-color) passend einfärben
  const farbe = getComputedStyle(document.documentElement).getPropertyValue('--farbe-hintergrund').trim();
  document.querySelectorAll('meta[name="theme-color"]').forEach((m) => m.setAttribute('content', farbe));
}

/** Folgt der Systemeinstellung, solange „Automatisch“ gewählt ist */
export function systemBeobachten(): void {
  systemDunkel.addEventListener('change', () => {
    if (darstellungLaden() === 'auto') darstellungAnwenden('auto');
  });
}

export function akzentSetzen(maskottchen: MaskottchenId | undefined): void {
  if (maskottchen) document.documentElement.dataset.maskottchen = maskottchen;
  else delete document.documentElement.dataset.maskottchen;
}
