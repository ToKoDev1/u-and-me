// Zugriff auf die Inhalte aus src/content/ – mit Typen, damit Tippfehler im JSON auffallen.
import phasenDaten from '../content/phasen.json';
import etappenDaten from '../content/etappen.json';
import untersuchungenDaten from '../content/untersuchungen.json';
import maskottchenDaten from '../content/maskottchen.json';
import zahnarztDaten from '../content/zahnarzt.json';
import uSchritteDaten from '../content/u-schritte.json';
import wochenDaten from '../content/wochen.json';
import orgaDaten from '../content/orga.json';
import fuerEuchDaten from '../content/fuer-euch.json';
import { datumBeiAlter, imZeitfenster, tageZwischen, type Alter } from './alter';
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
  /** echte Notfälle („sofort 112“), optional */
  notfall?: string | null;
  /** Quellen für die Warnzeichen */
  quellen?: Quelle[];
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
  /** konkrete Quelle für diesen Eintrag (sonst gilt die allgemeine Quelle der Datei) */
  quelle?: Quelle;
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
  /** Quelle der Impf-Angabe (STIKO) */
  impfQuelle?: Quelle;
  mitbringen: string[];
  /** eigene Anregungen (Entwurf); {kind} = Name bzw. „euer Kind“ */
  beobachten: string[];
  fragen: string[];
  /** Untersuchungsschritte für „Ux Schritt für Schritt“ */
  schritte: { titel: string; text: string }[];
  /** ersetzt den allgemeinen Vorbereitungs-Tipp (U1: nichts vorzubereiten, U2: meist in der Klinik) */
  vorher?: string;
  /** Messen und Wiegen steckt schon in den Schritten (U1) */
  ohneMessen?: boolean;
};
export type MaskottchenId = 'loewe' | 'hund' | 'pinguin' | 'elefant';
export type Maskottchen = { id: MaskottchenId; name: string; geschichte: string };

export const phasen = phasenDaten.phasen as Phase[];
export const etappen = etappenDaten.etappen as Etappe[];
export const etappenInfo = { status: etappenDaten.status as Status, quelle: etappenDaten.quelle };
export const untersuchungen = untersuchungenDaten.untersuchungen as Untersuchung[];
/** Bis wann U & Me begleitet: Ende des Zeitfensters der letzten U in untersuchungen.json */
export const begleitetBis: Alter = untersuchungen.at(-1)!.bis;
export const letzteUntersuchung = untersuchungen.at(-1)!;
/** Allgemeine Schritte für „Ux Schritt für Schritt“ (Vorher, Messen, Gespräch, Impfung, Danach) */
export const uSchritte = uSchritteDaten;

/** Was nach der letzten U kommt (J1, Zusatz-Untersuchungen) */
export const danach = untersuchungenDaten.danach;
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

/** Phase nach Entwicklungsalter – bei Frühchen korrigiert, wie die Etappen */
export function aktuellePhase(kind: Kind): Phase | undefined {
  return phasen.find((p) => imZeitfenster(kind.entwicklungsStart, kind.jetzt, p.von, p.bis));
}

const beginn = (kind: Kind, e: Etappe) => datumBeiAlter(kind.entwicklungsStart, e.von);
const ende = (kind: Kind, e: Etappe) => datumBeiAlter(kind.entwicklungsStart, e.bis);

/** Datum, ab dem eine Etappe typisch ist (bei Frühchen nach korrigiertem Alter) */
export const etappenBeginn = beginn;

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

/** U nach Kennung – Groß-/Kleinschreibung egal („u7a“, „U7A“ und „U7a“ finden dieselbe U) */
export function uTermin(kind: Kind, id: string): UTermin | undefined {
  return uTermine(kind).find((t) => t.untersuchung.id.toUpperCase() === id.toUpperCase());
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

// ---- Zahnarzt Z1–Z3 ----------------------------------------------------------

export type ZahnTermin = { id: string; zeitraum: string; von: Alter; bis: Alter };
export const zahnarzt = zahnarztDaten as Omit<typeof zahnarztDaten, 'termine'> & { termine: ZahnTermin[] };

/** Zahnarzt-Termine mit Datum – wie die U-Termine nach tatsächlichem Geburtsdatum */
export function zahnTermine(kind: Kind) {
  return zahnarzt.termine.map((z) => ({
    termin: z,
    beginn: datumBeiAlter(kind.geburt, z.von),
    ende: datumBeiAlter(kind.geburt, z.bis),
  }));
}

// ---- Die ersten 12 Wochen, Zu erledigen, Für euch ------------------------------

export const wochen = wochenDaten.wochen as Woche[];
export type Woche = {
  woche: number;
  titel: string;
  typisch: string;
  hilft: string;
  fuerEuch: string;
  quellen: Quelle[];
  /** passende U (Link) */
  u?: string;
};

/** Lebenswoche (1 = Tag 0–6) – bei Frühchen nach tatsächlichem Geburtsdatum, denn es geht um den Alltag nach der Geburt */
export function lebenswoche(kind: Kind): number {
  return Math.floor(tageZwischen(kind.geburt, kind.jetzt) / 7) + 1;
}

/** Die Woche, die gerade läuft – nur in den ersten 12 Wochen */
export const aktuelleWoche = (kind: Kind): Woche | undefined => wochen.find((w) => w.woche === lebenswoche(kind));

export type Aufgabe = { id: string; titel: string; text: string; von: Alter; bis: Alter; frist?: boolean; quelle: Quelle };
export const aufgaben = orgaDaten.aufgaben as Aufgabe[];

export type AufgabeMitDatum = Aufgabe & { beginn: Date; ende: Date };
/** Aufgaben mit echtem Datum, sortiert nach Frist */
export function aufgabenFuer(kind: Kind): AufgabeMitDatum[] {
  return aufgaben
    .map((a) => ({ ...a, beginn: datumBeiAlter(kind.geburt, a.von), ende: datumBeiAlter(kind.geburt, a.bis) }))
    .sort((a, b) => a.ende.getTime() - b.ende.getTime());
}

export const fuerEuch = fuerEuchDaten;
