// Zugriff auf die Inhalte aus src/content/ – mit Typen, damit Tippfehler im JSON auffallen.
import phasenDaten from '../content/phasen.json';
import etappenDaten from '../content/etappen.json';
import untersuchungenDaten from '../content/untersuchungen.json';
import maskottchenDaten from '../content/maskottchen.json';
import { datumBeiAlter, imZeitfenster, type Alter } from './alter';
import type { Kind } from './kind';

export type Quelle = { name: string; url: string };
export type Status = 'entwurf' | 'geprueft';

export type Spielidee = { bereich: Bereich; titel: string; text: string; hinweis?: string };
export type Phase = {
  id: string;
  titel: string;
  von: Alter;
  bis: Alter;
  abklaeren: string | null;
  /** eigene Anregungen (Entwurf) */
  spielideen: Spielidee[];
};
export type Bereich = 'alltag' | 'bewegung' | 'sprache' | 'miteinander';
export type Etappe = {
  id: string;
  bereich: Bereich;
  titel: string;
  text: string;
  /** nur Alltag: „Darauf könnt ihr achten: …“ */
  zusatz?: { label: string; text: string };
  tipp?: string;
  tippArt?: 'spiel' | 'hinweis';
  von: Alter;
  bis: Alter;
};
export type Untersuchung = {
  id: string;
  zeitraum: string;
  von: Alter;
  bis: Alter;
  /** Quellseite zu dieser U */
  url: string;
  /** Was untersucht/besprochen wird – aus der Quelle */
  passiert: { titel: string; text: string }[];
  impfungen: string | null;
  mitbringen: string[];
  /** eigene Anregungen (Entwurf); {kind} = Name bzw. „euer Kind“ */
  beobachten: string[];
  fragen: string[];
};
export type MaskottchenId = 'loewe' | 'hund' | 'pinguin' | 'elefant';
export type Maskottchen = { id: MaskottchenId; name: string; geschichte: string };

export const phasen = phasenDaten.phasen as Phase[];
export const phasenInfo = { status: phasenDaten.status as Status, quelle: phasenDaten.quelle };
export const etappen = etappenDaten.etappen as Etappe[];
export const etappenInfo = { status: etappenDaten.status as Status, quelle: etappenDaten.quelle };
export const untersuchungen = untersuchungenDaten.untersuchungen as Untersuchung[];
export const untersuchungenQuelle: Quelle = untersuchungenDaten.quelle;
export const untersuchungenAbgerufen: string = untersuchungenDaten.abgerufen;
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

// ---- Phasen und Etappen ----------------------------------------------------

export function aktuellePhase(kind: Kind): Phase | undefined {
  return phasen.find((p) => imZeitfenster(kind.geburt, kind.jetzt, p.von, p.bis));
}

const beginn = (kind: Kind, e: Etappe) => datumBeiAlter(kind.entwicklungsStart, e.von);
const ende = (kind: Kind, e: Etappe) => datumBeiAlter(kind.entwicklungsStart, e.bis);

export type EtappenStatus = 'vergangen' | 'gerade-dran' | 'kommend';

export function etappenStatus(kind: Kind, e: Etappe): EtappenStatus {
  if (ende(kind, e) <= kind.jetzt) return 'vergangen';
  return beginn(kind, e) <= kind.jetzt ? 'gerade-dran' : 'kommend';
}

const nachBeginn = (kind: Kind) => (a: Etappe, b: Etappe) => beginn(kind, a).getTime() - beginn(kind, b).getTime();

/** Etappen, deren typisches Zeitfenster heute läuft */
export function aktuelleEtappen(kind: Kind): Etappe[] {
  return etappen.filter((e) => etappenStatus(kind, e) === 'gerade-dran').sort(nachBeginn(kind));
}

/** Die nächsten Etappen, deren Zeitfenster noch nicht begonnen hat */
export function kommendeEtappen(kind: Kind, anzahl = 3): Etappe[] {
  return etappen.filter((e) => etappenStatus(kind, e) === 'kommend').sort(nachBeginn(kind)).slice(0, anzahl);
}

// ---- U-Untersuchungen --------------------------------------------------------

export type UTermin = { untersuchung: Untersuchung; beginn: Date; ende: Date };

export function uTermine(kind: Kind): UTermin[] {
  return untersuchungen.map((u) => ({
    untersuchung: u,
    beginn: datumBeiAlter(kind.geburt, u.von),
    ende: datumBeiAlter(kind.geburt, u.bis),
  }));
}

export type NaechsteU = UTermin & { laeuftSchon: boolean };

export function uTermin(kind: Kind, id: string): UTermin | undefined {
  return uTermine(kind).find((t) => t.untersuchung.id === id);
}

/** {kind} im Text durch den Namen ersetzen */
export const mitName = (text: string, kind: Kind) => text.replaceAll('{kind}', kind.name ?? 'euer Kind');

/** Die nächste U, deren Zeitfenster noch nicht vorbei ist */
export function naechsteUntersuchung(kind: Kind): NaechsteU | undefined {
  const termin = uTermine(kind).find((t) => kind.jetzt < t.ende);
  return termin && { ...termin, laeuftSchon: kind.jetzt >= termin.beginn };
}

/** Die U direkt vor der nächsten – für das Wegstück „U4 → U5“ */
export function vorherigeUntersuchung(kind: Kind): UTermin | undefined {
  const termine = uTermine(kind);
  const naechste = naechsteUntersuchung(kind);
  const index = naechste ? termine.findIndex((t) => t.untersuchung.id === naechste.untersuchung.id) : termine.length;
  return index > 0 ? termine[index - 1] : undefined;
}

// ---- Zeitstrahl ------------------------------------------------------------

export type WegEintrag =
  | { art: 'u'; datum: Date; termin: UTermin; status: 'vergangen' | 'laeuft' | 'kommend' }
  | { art: 'etappe'; datum: Date; etappe: Etappe; status: EtappenStatus }
  | { art: 'heute'; datum: Date };

/** Alle Us und Etappen chronologisch, mit einer „heute“-Markierung */
export function wegEintraege(kind: Kind): WegEintrag[] {
  const eintraege: WegEintrag[] = [
    ...uTermine(kind).map((t) => ({
      art: 'u' as const,
      datum: t.beginn,
      termin: t,
      status: (t.ende <= kind.jetzt ? 'vergangen' : t.beginn <= kind.jetzt ? 'laeuft' : 'kommend') as
        | 'vergangen'
        | 'laeuft'
        | 'kommend',
    })),
    ...etappen.map((e) => ({ art: 'etappe' as const, datum: beginn(kind, e), etappe: e, status: etappenStatus(kind, e) })),
    { art: 'heute' as const, datum: kind.jetzt },
  ];
  // Bei gleichem Datum: U vor Etappe, „heute“ nach allem, was heute beginnt
  const rang = { u: 0, etappe: 1, heute: 2 };
  return eintraege.sort((a, b) => a.datum.getTime() - b.datum.getTime() || rang[a.art] - rang[b.art]);
}
