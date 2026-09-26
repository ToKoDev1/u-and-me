// Zugriff auf die Inhalte aus src/content/ – mit Typen, damit Tippfehler im JSON auffallen.
import phasenDaten from '../content/phasen.json';
import untersuchungenDaten from '../content/untersuchungen.json';
import maskottchenDaten from '../content/maskottchen.json';
import { datumBeiAlter, imZeitfenster, type Alter } from './alter';

export type Quelle = { name: string; url: string };

export type PhasenInhalt = {
  status: 'entwurf' | 'geprueft';
  bereiche: { titel: string; punkte: string[] }[];
  abklaeren: string[];
  quelle: Quelle;
};

export type Phase = { id: string; titel: string; von: Alter; bis: Alter; inhalt: PhasenInhalt | null };
export type Untersuchung = { id: string; zeitraum: string; von: Alter; bis: Alter };
export type MaskottchenId = 'loewe' | 'hund' | 'pinguin' | 'elefant';
export type Maskottchen = { id: MaskottchenId; name: string; geschichte: string };

export const phasen = phasenDaten.phasen as Phase[];
export const untersuchungen = untersuchungenDaten.untersuchungen as Untersuchung[];
export const untersuchungenQuelle: Quelle = untersuchungenDaten.quelle;
export const maskottchen = maskottchenDaten as Maskottchen[];

/** Pfad zum Maskottchen-Bild – BASE_URL, damit es auch unter einem Unterordner (GitHub Pages) funktioniert */
export const maskottchenBild = (id: MaskottchenId, avatar = false) =>
  `${import.meta.env.BASE_URL}maskottchen/${id}${avatar ? '-avatar' : ''}.svg`;

export function aktuellePhase(geburt: Date, datum: Date): Phase | undefined {
  return phasen.find((p) => imZeitfenster(geburt, datum, p.von, p.bis));
}

export type NaechsteU = { untersuchung: Untersuchung; beginn: Date; ende: Date; laeuftSchon: boolean };

/** Die nächste U, deren Zeitfenster noch nicht vorbei ist */
export function naechsteUntersuchung(geburt: Date, datum: Date): NaechsteU | undefined {
  for (const untersuchung of untersuchungen) {
    const beginn = datumBeiAlter(geburt, untersuchung.von);
    const ende = datumBeiAlter(geburt, untersuchung.bis);
    if (datum < ende) return { untersuchung, beginn, ende, laeuftSchon: datum >= beginn };
  }
  return undefined;
}
