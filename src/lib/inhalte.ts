// Zugriff auf die Inhalte aus src/content/ – mit Typen, damit Tippfehler im JSON auffallen.
import phasenDaten from '../content/phasen.json';
import etappenDaten from '../content/etappen.json';
import untersuchungenDaten from '../content/untersuchungen.json';
import maskottchenDaten from '../content/maskottchen.json';
import { datumBeiAlter, imZeitfenster, type Alter } from './alter';

export type Quelle = { name: string; url: string };
export type Status = 'entwurf' | 'geprueft';

export type Phase = { id: string; titel: string; von: Alter; bis: Alter; abklaeren: string[] | null };
export type Bereich = 'alltag' | 'bewegung' | 'sprache' | 'miteinander';
export type Etappe = { id: string; bereich: Bereich; titel: string; text: string; tipp?: string; von: Alter; bis: Alter };
export type Untersuchung = { id: string; zeitraum: string; von: Alter; bis: Alter };
export type MaskottchenId = 'loewe' | 'hund' | 'pinguin' | 'elefant';
export type Maskottchen = { id: MaskottchenId; name: string; geschichte: string };

export const phasen = phasenDaten.phasen as Phase[];
export const phasenInfo = { status: phasenDaten.status as Status, quelle: phasenDaten.quelle };
export const etappen = etappenDaten.etappen as Etappe[];
export const etappenInfo = { status: etappenDaten.status as Status, quelle: etappenDaten.quelle };
export const untersuchungen = untersuchungenDaten.untersuchungen as Untersuchung[];
export const untersuchungenQuelle: Quelle = untersuchungenDaten.quelle;
export const maskottchen = maskottchenDaten as Maskottchen[];

export const bereichsName: Record<Bereich, string> = {
  alltag: 'Alltag',
  bewegung: 'Bewegung',
  sprache: 'Sprache & Laute',
  miteinander: 'Miteinander',
};

/** Pfad zum Maskottchen-Bild – BASE_URL, damit es auch unter einem Unterordner (GitHub Pages) funktioniert */
export const maskottchenBild = (id: MaskottchenId, avatar = false) =>
  `${import.meta.env.BASE_URL}maskottchen/${id}${avatar ? '-avatar' : ''}.svg`;

export function aktuellePhase(geburt: Date, datum: Date): Phase | undefined {
  return phasen.find((p) => imZeitfenster(geburt, datum, p.von, p.bis));
}

const nachBeginn = (geburt: Date) => (a: { von: Alter }, b: { von: Alter }) =>
  datumBeiAlter(geburt, a.von).getTime() - datumBeiAlter(geburt, b.von).getTime();

/** Etappen, deren typisches Zeitfenster heute läuft */
export function aktuelleEtappen(geburt: Date, datum: Date): Etappe[] {
  return etappen.filter((e) => imZeitfenster(geburt, datum, e.von, e.bis)).sort(nachBeginn(geburt));
}

/** Die nächsten Etappen, deren Zeitfenster noch nicht begonnen hat */
export function kommendeEtappen(geburt: Date, datum: Date, anzahl = 3): Etappe[] {
  return etappen
    .filter((e) => datumBeiAlter(geburt, e.von) > datum)
    .sort(nachBeginn(geburt))
    .slice(0, anzahl);
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

export type WegEintrag =
  | { art: 'u'; datum: Date; untersuchung: Untersuchung; ende: Date }
  | { art: 'etappe'; datum: Date; etappe: Etappe; ende: Date }
  | { art: 'heute'; datum: Date };

/** Alle Us und Etappen chronologisch, mit einer „heute“-Markierung – für den Zeitstrahl */
export function wegEintraege(geburt: Date, datum: Date): WegEintrag[] {
  const eintraege: WegEintrag[] = [
    ...untersuchungen.map((u) => ({
      art: 'u' as const,
      datum: datumBeiAlter(geburt, u.von),
      untersuchung: u,
      ende: datumBeiAlter(geburt, u.bis),
    })),
    ...etappen.map((e) => ({
      art: 'etappe' as const,
      datum: datumBeiAlter(geburt, e.von),
      etappe: e,
      ende: datumBeiAlter(geburt, e.bis),
    })),
    { art: 'heute' as const, datum },
  ];
  // Bei gleichem Datum: U vor Etappe, „heute“ zuletzt
  const rang = { u: 0, etappe: 1, heute: 2 };
  return eintraege.sort((a, b) => a.datum.getTime() - b.datum.getTime() || rang[a.art] - rang[b.art]);
}
