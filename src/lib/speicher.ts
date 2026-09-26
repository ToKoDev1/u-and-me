// Speichert das Profil nur lokal im Browser (localStorage) – nichts verlässt das Gerät.
import type { MaskottchenId } from './inhalte';

export type Profil = {
  maskottchen: MaskottchenId;
  geburtsdatum: string; // "YYYY-MM-DD"
  name?: string;
};

const SCHLUESSEL = 'u-and-me:profil';

export function profilLaden(): Profil | null {
  try {
    const roh = localStorage.getItem(SCHLUESSEL);
    return roh ? (JSON.parse(roh) as Profil) : null;
  } catch {
    return null; // z. B. privater Modus oder blockierter Speicher
  }
}

export function profilSpeichern(profil: Profil): void {
  try {
    localStorage.setItem(SCHLUESSEL, JSON.stringify(profil));
  } catch {
    // Speichern nicht möglich – die App funktioniert trotzdem, bis die Seite neu geladen wird.
  }
}

export function profilLoeschen(): void {
  try {
    localStorage.removeItem(SCHLUESSEL);
  } catch {
    // ignorieren
  }
}
