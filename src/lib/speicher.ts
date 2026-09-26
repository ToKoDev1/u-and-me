// Speichert alles nur lokal im Browser (localStorage) – nichts verlässt das Gerät.
// Gelesene Daten werden immer geprüft: Was nicht passt (alte Version, kaputt, manipuliert),
// wird ignoriert, statt die App abstürzen zu lassen.
import type { MaskottchenId } from './inhalte';

export type Profil = {
  maskottchen: MaskottchenId;
  geburtsdatum: string; // "YYYY-MM-DD"
  errechneterTermin?: string; // nur bei Frühgeborenen, "YYYY-MM-DD"
  name?: string;
};

/** Notizen pro U (abgehakte Beobachtungen, eigene Fragen) und erledigte Aufgaben („Zu erledigen“) */
export type Notizen = {
  beobachtet: Record<string, string[]>;
  eigeneFragen: Record<string, string[]>;
  erledigt: string[];
};

/** Ein Kind mit seinen Angaben und Notizen */
export type KindEintrag = { id: string; profil: Profil; notizen: Notizen };

/** Alles, was U & Me speichert (Version 2: mehrere Kinder) */
export type Daten = { version: 2; kinder: KindEintrag[]; aktiv: string | null };

export const PRAEFIX = 'u-and-me:';
const DATEN = `${PRAEFIX}daten`;
// Version 1 (ein Kind, zwei Schlüssel) – wird beim ersten Laden übernommen
const ALT_PROFIL = `${PRAEFIX}profil`;
const ALT_NOTIZEN = `${PRAEFIX}notizen`;
const MASKOTTCHEN: readonly MaskottchenId[] = ['elefant', 'loewe', 'pinguin', 'hund'];

function lesen(schluessel: string): unknown {
  try {
    const roh = localStorage.getItem(schluessel);
    return roh ? JSON.parse(roh) : null;
  } catch {
    return null; // privater Modus, blockierter Speicher oder kaputtes JSON
  }
}

function entfernen(schluessel: string): void {
  try {
    localStorage.removeItem(schluessel);
  } catch {
    // egal
  }
}

function schreiben(schluessel: string, wert: unknown): boolean {
  try {
    localStorage.setItem(schluessel, JSON.stringify(wert));
    return true;
  } catch {
    return false; // Speichern nicht möglich – die App funktioniert bis zum Neuladen trotzdem
  }
}

// ---- Prüfen --------------------------------------------------------------------

/** "YYYY-MM-DD" und ein echtes Kalenderdatum (kein 31.02.) */
export function istIsoDatum(wert: unknown): wert is string {
  if (typeof wert !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(wert)) return false;
  const [j, m, t] = wert.split('-').map(Number);
  const d = new Date(j, m - 1, t);
  return d.getFullYear() === j && d.getMonth() === m - 1 && d.getDate() === t;
}

const istObjekt = (wert: unknown): wert is Record<string, unknown> =>
  typeof wert === 'object' && wert !== null && !Array.isArray(wert);

export function alsProfil(wert: unknown): Profil | null {
  if (!istObjekt(wert)) return null;
  const { maskottchen, geburtsdatum, errechneterTermin, name } = wert;
  if (!MASKOTTCHEN.includes(maskottchen as MaskottchenId) || !istIsoDatum(geburtsdatum)) return null;
  return {
    maskottchen: maskottchen as MaskottchenId,
    geburtsdatum,
    errechneterTermin: istIsoDatum(errechneterTermin) ? errechneterTermin : undefined,
    name: typeof name === 'string' && name.trim() ? name.trim().slice(0, 40) : undefined,
  };
}

/** Record<U-Id, Texte> – alles andere wird verworfen */
function alsTextListen(wert: unknown): Record<string, string[]> {
  if (!istObjekt(wert)) return {};
  const ergebnis: Record<string, string[]> = {};
  for (const [schluessel, liste] of Object.entries(wert)) {
    if (Array.isArray(liste)) ergebnis[schluessel] = liste.filter((t): t is string => typeof t === 'string');
  }
  return ergebnis;
}

export function alsNotizen(wert: unknown): Notizen {
  const o = istObjekt(wert) ? wert : {};
  const erledigt = Array.isArray(o.erledigt) ? o.erledigt.filter((t): t is string => typeof t === 'string') : [];
  return { beobachtet: alsTextListen(o.beobachtet), eigeneFragen: alsTextListen(o.eigeneFragen), erledigt };
}

// ---- Öffentliche Funktionen ------------------------------------------------------

export const leereNotizen = (): Notizen => ({ beobachtet: {}, eigeneFragen: {}, erledigt: [] });
export const leereDaten = (): Daten => ({ version: 2, kinder: [], aktiv: null });

const neueId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

export function alsDaten(wert: unknown): Daten | null {
  if (!istObjekt(wert) || wert.version !== 2 || !Array.isArray(wert.kinder)) return null;
  const kinder: KindEintrag[] = [];
  for (const k of wert.kinder) {
    if (!istObjekt(k)) continue;
    const profil = alsProfil(k.profil);
    if (!profil) continue; // unbrauchbares Kind überspringen, die anderen behalten
    const id = typeof k.id === 'string' && k.id && !kinder.some((x) => x.id === k.id) ? k.id : neueId();
    kinder.push({ id, profil, notizen: alsNotizen(k.notizen) });
  }
  const aktiv = kinder.find((k) => k.id === wert.aktiv)?.id ?? kinder[0]?.id ?? null;
  return { version: 2, kinder, aktiv };
}

export const datenSpeichern = (daten: Daten) => schreiben(DATEN, daten);

/** Lädt die Daten – und übernimmt beim ersten Mal die alten Daten aus Version 1 */
export function datenLaden(): Daten {
  const daten = alsDaten(lesen(DATEN));
  if (daten) return daten;
  const altesProfil = alsProfil(lesen(ALT_PROFIL));
  if (!altesProfil) return leereDaten();
  const migriert = kindHinzufuegen(leereDaten(), altesProfil, alsNotizen(lesen(ALT_NOTIZEN)));
  // Alte Schlüssel erst löschen, wenn das neue Format sicher gespeichert ist
  if (datenSpeichern(migriert)) {
    entfernen(ALT_PROFIL);
    entfernen(ALT_NOTIZEN);
  }
  return migriert;
}

// Kleine Helfer: geben jeweils einen neuen Stand zurück, statt den alten zu verändern

export const aktivesKind = (daten: Daten): KindEintrag | null =>
  daten.kinder.find((k) => k.id === daten.aktiv) ?? null;

export function kindHinzufuegen(daten: Daten, profil: Profil, notizen: Notizen = leereNotizen()): Daten {
  const id = neueId();
  return { ...daten, kinder: [...daten.kinder, { id, profil, notizen }], aktiv: id };
}

export const kindAendern = (daten: Daten, id: string, profil: Profil): Daten => ({
  ...daten,
  kinder: daten.kinder.map((k) => (k.id === id ? { ...k, profil } : k)),
});

export const kindWaehlen = (daten: Daten, id: string): Daten =>
  daten.kinder.some((k) => k.id === id) ? { ...daten, aktiv: id } : daten;

export function kindEntfernen(daten: Daten, id: string): Daten {
  const kinder = daten.kinder.filter((k) => k.id !== id);
  return { ...daten, kinder, aktiv: daten.aktiv === id ? (kinder[0]?.id ?? null) : daten.aktiv };
}

export const notizenSetzen = (daten: Daten, id: string, notizen: Notizen): Daten => ({
  ...daten,
  kinder: daten.kinder.map((k) => (k.id === id ? { ...k, notizen } : k)),
});

/** Darf der Browser speichern? (Nein z. B. bei blockierten Website-Daten) */
export function speicherVerfuegbar(): boolean {
  try {
    const probe = `${PRAEFIX}probe`;
    localStorage.setItem(probe, '1');
    localStorage.removeItem(probe);
    return true;
  } catch {
    return false;
  }
}

/** Alle Angaben von U & Me auf diesem Gerät löschen */
export function allesLoeschen(): void {
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(PRAEFIX))
      .forEach((k) => localStorage.removeItem(k));
  } catch {
    // nichts zu löschen
  }
}

// ---- Sicherung (Export/Import) -----------------------------------------------------

export type Sicherung = { app: 'u-and-me'; version: 2; erstellt: string; daten: Daten };

export function sicherungErstellen(daten: Daten): Sicherung | null {
  if (daten.kinder.length === 0) return null;
  return { app: 'u-and-me', version: 2, erstellt: new Date().toISOString(), daten };
}

/** Prüft eine Sicherungsdatei (Version 1 oder 2); gibt die Daten zurück oder null, wenn sie nicht passt */
export function sicherungLesen(text: string): Daten | null {
  try {
    const datei: unknown = JSON.parse(text);
    if (!istObjekt(datei) || datei.app !== 'u-and-me') return null;
    if (datei.version === 2) {
      const daten = alsDaten(datei.daten);
      return daten && daten.kinder.length > 0 ? daten : null;
    }
    // Version 1: ein Kind
    const profil = alsProfil(datei.profil);
    return profil ? kindHinzufuegen(leereDaten(), profil, alsNotizen(datei.notizen)) : null;
  } catch {
    return null;
  }
}

export const sicherungEinspielen = (daten: Daten): boolean => datenSpeichern(daten);

// ---- Welcome-Tour ------------------------------------------------------------

const TOUR = `${PRAEFIX}tour-gesehen`;

/** Wurde die Welcome-Tour auf diesem Gerät schon gezeigt? */
export function tourGesehen(): boolean {
  try {
    return localStorage.getItem(TOUR) === '1';
  } catch {
    return false;
  }
}

export function tourMerken(): void {
  try {
    localStorage.setItem(TOUR, '1');
  } catch {
    // ohne Speicher kommt die Tour eben beim nächsten Mal wieder
  }
}
