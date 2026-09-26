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

/** Notizen pro U: abgehakte Beobachtungen und eigene Fragen */
export type Notizen = {
  beobachtet: Record<string, string[]>;
  eigeneFragen: Record<string, string[]>;
};

export const PRAEFIX = 'u-and-me:';
const PROFIL = `${PRAEFIX}profil`;
const NOTIZEN = `${PRAEFIX}notizen`;
const MASKOTTCHEN: readonly MaskottchenId[] = ['elefant', 'loewe', 'pinguin', 'hund'];

function lesen(schluessel: string): unknown {
  try {
    const roh = localStorage.getItem(schluessel);
    return roh ? JSON.parse(roh) : null;
  } catch {
    return null; // privater Modus, blockierter Speicher oder kaputtes JSON
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
  return { beobachtet: alsTextListen(o.beobachtet), eigeneFragen: alsTextListen(o.eigeneFragen) };
}

// ---- Öffentliche Funktionen ------------------------------------------------------

export const profilLaden = (): Profil | null => alsProfil(lesen(PROFIL));
export const profilSpeichern = (profil: Profil) => schreiben(PROFIL, profil);

export const notizenLaden = (): Notizen => alsNotizen(lesen(NOTIZEN));
export const notizenSpeichern = (notizen: Notizen) => schreiben(NOTIZEN, notizen);

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

export type Sicherung = { app: 'u-and-me'; version: 1; erstellt: string; profil: Profil; notizen: Notizen };

export function sicherungErstellen(): Sicherung | null {
  const profil = profilLaden();
  if (!profil) return null;
  return { app: 'u-and-me', version: 1, erstellt: new Date().toISOString(), profil, notizen: notizenLaden() };
}

/** Prüft eine Sicherungsdatei; gibt die Daten zurück oder null, wenn sie nicht passt */
export function sicherungLesen(text: string): { profil: Profil; notizen: Notizen } | null {
  try {
    const daten: unknown = JSON.parse(text);
    if (!istObjekt(daten) || daten.app !== 'u-and-me') return null;
    const profil = alsProfil(daten.profil);
    return profil ? { profil, notizen: alsNotizen(daten.notizen) } : null;
  } catch {
    return null;
  }
}

export function sicherungEinspielen(daten: { profil: Profil; notizen: Notizen }): boolean {
  return profilSpeichern(daten.profil) && notizenSpeichern(daten.notizen);
}
