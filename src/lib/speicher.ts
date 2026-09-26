// Speichert alles nur lokal im Browser (localStorage) – nichts verlässt das Gerät.
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

const PROFIL = 'u-and-me:profil';
const NOTIZEN = 'u-and-me:notizen';

function lesen<T>(schluessel: string): T | null {
  try {
    const roh = localStorage.getItem(schluessel);
    return roh ? (JSON.parse(roh) as T) : null;
  } catch {
    return null; // z. B. privater Modus oder blockierter Speicher
  }
}

function schreiben(schluessel: string, wert: unknown): void {
  try {
    localStorage.setItem(schluessel, JSON.stringify(wert));
  } catch {
    // Speichern nicht möglich – die App funktioniert trotzdem, bis die Seite neu geladen wird.
  }
}

export const profilLaden = () => lesen<Profil>(PROFIL);
export const profilSpeichern = (profil: Profil) => schreiben(PROFIL, profil);

export const notizenLaden = (): Notizen => lesen<Notizen>(NOTIZEN) ?? { beobachtet: {}, eigeneFragen: {} };
export const notizenSpeichern = (notizen: Notizen) => schreiben(NOTIZEN, notizen);
