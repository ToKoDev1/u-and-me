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

/** Alter so, wie Eltern es sagen würden: „12 Tage“, „3 Wochen“, „5 Monate, 1 Woche“ */
export function alterAlsText(alter: AlterAufgeteilt): string {
  if (alter.tage < 14) return mehrzahl(alter.tage, 'Tag', 'Tage');
  if (alter.monate < 2) return mehrzahl(Math.floor(alter.tage / 7), 'Woche', 'Wochen');
  const monate = mehrzahl(alter.monate, 'Monat', 'Monate');
  return alter.restWochen > 0 ? `${monate}, ${mehrzahl(alter.restWochen, 'Woche', 'Wochen')}` : monate;
}

/** „in 3 Tagen“, „in 2 Wochen“, „in 5 Wochen“ */
export function abstandAlsText(tage: number): string {
  if (tage <= 1) return tage === 1 ? 'morgen' : 'heute';
  if (tage < 14) return `in ${tage} Tagen`;
  return `in ${Math.round(tage / 7)} Wochen`;
}

export const datumFormat = new Intl.DateTimeFormat('de-DE', { day: 'numeric', month: 'long', year: 'numeric' });
