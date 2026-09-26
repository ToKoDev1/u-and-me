// Rechnen mit dem Alter des Kindes.
// Alle Zeitfenster in den Inhalten sind als „Alter ab Geburt“ angegeben,
// z. B. { monate: 5 } oder { tage: 21 }.

export type Alter = { monate?: number; tage?: number };

const MS_PRO_TAG = 24 * 60 * 60 * 1000;

/** "2026-03-14" (aus <input type="date">) → lokales Datum um 0 Uhr */
export function parseDatum(iso: string): Date {
  const [jahr, monat, tag] = iso.split('-').map(Number);
  return new Date(jahr, monat - 1, tag);
}

/** Heute um 0 Uhr – damit Vergleiche nicht von der Uhrzeit abhängen */
export function heute(): Date {
  const jetzt = new Date();
  return new Date(jetzt.getFullYear(), jetzt.getMonth(), jetzt.getDate());
}

/** Monate addieren, ohne über das Monatsende zu rutschen (31.1. + 1 Monat = 28./29.2.) */
function plusMonate(datum: Date, monate: number): Date {
  const ziel = new Date(datum.getFullYear(), datum.getMonth() + monate, 1);
  const letzterTag = new Date(ziel.getFullYear(), ziel.getMonth() + 1, 0).getDate();
  ziel.setDate(Math.min(datum.getDate(), letzterTag));
  return ziel;
}

/** Datum, an dem das Kind ein bestimmtes Alter erreicht */
export function datumBeiAlter(geburt: Date, alter: Alter): Date {
  const datum = plusMonate(geburt, alter.monate ?? 0);
  datum.setDate(datum.getDate() + (alter.tage ?? 0));
  return datum;
}

/** Ganze Tage zwischen zwei Daten (sommerzeit-sicher über UTC) */
export function tageZwischen(von: Date, bis: Date): number {
  const utc = (d: Date) => Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
  return Math.round((utc(bis) - utc(von)) / MS_PRO_TAG);
}

/** Liegt `datum` im Alters-Zeitfenster [von, bis)? */
export function imZeitfenster(geburt: Date, datum: Date, von: Alter, bis: Alter): boolean {
  return datum >= datumBeiAlter(geburt, von) && datum < datumBeiAlter(geburt, bis);
}

export type AlterAufgeteilt = { tage: number; monate: number; restWochen: number; restTage: number };

export function alterAm(geburt: Date, datum: Date): AlterAufgeteilt {
  let monate = 0;
  while (datumBeiAlter(geburt, { monate: monate + 1 }) <= datum) monate++;
  const rest = tageZwischen(datumBeiAlter(geburt, { monate }), datum);
  return {
    tage: tageZwischen(geburt, datum),
    monate,
    restWochen: Math.floor(rest / 7),
    restTage: rest % 7,
  };
}

const mehrzahl = (n: number, eins: string, viele: string) => `${n} ${n === 1 ? eins : viele}`;

/** Alter so, wie Eltern es sagen würden: „12 Tage“, „3 Wochen“, „5 Monate und 1 Woche“ */
export function alterAlsText(alter: AlterAufgeteilt): string {
  if (alter.tage < 14) return mehrzahl(alter.tage, 'Tag', 'Tage');
  if (alter.monate < 2) return mehrzahl(Math.floor(alter.tage / 7), 'Woche', 'Wochen');
  if (alter.monate >= 24) {
    const jahre = mehrzahl(Math.floor(alter.monate / 12), 'Jahr', 'Jahre');
    const rest = alter.monate % 12;
    return rest > 0 ? `${jahre} und ${mehrzahl(rest, 'Monat', 'Monate')}` : jahre;
  }
  const monate = mehrzahl(alter.monate, 'Monat', 'Monate');
  return alter.restWochen > 0 ? `${monate} und ${mehrzahl(alter.restWochen, 'Woche', 'Wochen')}` : monate;
}

/** „in 3 Tagen“, „in 2 Wochen“, „in 5 Wochen“ */
export function abstandAlsText(tage: number): string {
  if (tage <= 1) return tage === 1 ? 'morgen' : 'heute';
  if (tage < 14) return `in ${tage} Tagen`;
  return `in ${Math.round(tage / 7)} Wochen`;
}

type Einheit = { einzahl: string; mehrzahl: string };
const TAG: Einheit = { einzahl: 'Tag', mehrzahl: 'Tagen' };
const WOCHE: Einheit = { einzahl: 'Woche', mehrzahl: 'Wochen' };
const MONAT: Einheit = { einzahl: 'Monat', mehrzahl: 'Monaten' };

function alsZahlUndEinheit(alter: Alter): { n: number; einheit: Einheit } {
  if (alter.monate && !alter.tage) return { n: alter.monate, einheit: MONAT };
  const tage = alter.tage ?? 0;
  return tage >= 14 ? { n: Math.round(tage / 7), einheit: WOCHE } : { n: tage, einheit: TAG };
}

/** Spannbreite als Text für „meist mit …“: „4–7 Monaten“, „5–10 Wochen“, „2 Wochen – 3 Monaten“ */
export function spanneAlsText(von: Alter, bis: Alter): string {
  const a = alsZahlUndEinheit(von);
  const b = alsZahlUndEinheit(bis);
  const wort = (x: typeof a) => (x.n === 1 ? x.einheit.einzahl : x.einheit.mehrzahl);
  return a.einheit === b.einheit ? `${a.n}–${b.n} ${wort(b)}` : `${a.n} ${wort(a)} – ${b.n} ${wort(b)}`;
}

export const datumFormat = new Intl.DateTimeFormat('de-DE', { day: 'numeric', month: 'long', year: 'numeric' });

export const kurzDatum = new Intl.DateTimeFormat('de-DE', { day: 'numeric', month: 'short' });
export const monatJahr = new Intl.DateTimeFormat('de-DE', { month: 'short', year: 'numeric' });

/** Letzter Tag eines Zeitfensters (unsere Enddaten sind exklusiv) */
export const letzterTag = (ende: Date) => new Date(ende.getFullYear(), ende.getMonth(), ende.getDate() - 1);
