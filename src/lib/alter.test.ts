import { describe, expect, it } from 'vitest';
import { alterAm, alterAlsText, datumBeiAlter, parseDatum, spanneAlsText, tageZwischen } from './alter';

const d = (iso: string) => parseDatum(iso);
const iso = (datum: Date) => datum.toLocaleDateString('sv-SE');

describe('datumBeiAlter', () => {
  it('rutscht am Monatsende nicht in den Folgemonat', () => {
    expect(iso(datumBeiAlter(d('2026-01-31'), { monate: 1 }))).toBe('2026-02-28');
    expect(iso(datumBeiAlter(d('2024-01-31'), { monate: 1 }))).toBe('2024-02-29'); // Schaltjahr
    expect(iso(datumBeiAlter(d('2024-02-29'), { monate: 12 }))).toBe('2025-02-28');
  });

  it('addiert Tage und Monate', () => {
    expect(iso(datumBeiAlter(d('2026-04-19'), { tage: 21 }))).toBe('2026-05-10');
    expect(iso(datumBeiAlter(d('2026-04-19'), { monate: 5 }))).toBe('2026-09-19');
  });
});

describe('tageZwischen', () => {
  it('zählt über Sommerzeit-Umstellungen korrekt', () => {
    expect(tageZwischen(d('2026-03-28'), d('2026-03-30'))).toBe(2);
    expect(tageZwischen(d('2026-10-24'), d('2026-10-26'))).toBe(2);
  });
});

describe('alterAlsText', () => {
  const geburt = d('2026-04-19');
  const text = (heute: string) => alterAlsText(alterAm(geburt, d(heute)));

  it('zählt die ersten zwei Wochen in Tagen', () => {
    expect(text('2026-04-20')).toBe('1 Tag');
    expect(text('2026-04-30')).toBe('11 Tage');
  });
  it('zählt bis zwei Monate in Wochen', () => expect(text('2026-05-20')).toBe('4 Wochen'));
  it('nennt danach Monate und Wochen', () => {
    expect(text('2026-09-26')).toBe('5 Monate und 1 Woche');
    expect(text('2026-10-19')).toBe('6 Monate');
  });
  it('nennt ab 2 Jahren Jahre und Monate', () => {
    expect(text('2028-04-19')).toBe('2 Jahre');
    expect(text('2028-07-25')).toBe('2 Jahre und 3 Monate');
  });
});

describe('spanneAlsText', () => {
  it('formuliert Spannbreiten', () => {
    expect(spanneAlsText({ monate: 4 }, { monate: 7 })).toBe('4–7 Monaten');
    expect(spanneAlsText({ tage: 35 }, { tage: 70 })).toBe('5–10 Wochen');
    expect(spanneAlsText({ tage: 14 }, { monate: 3 })).toBe('2 Wochen – 3 Monaten');
  });

  it('nennt Spannen über den 2. Geburtstag hinaus in Jahren', () => {
    expect(spanneAlsText({ monate: 24 }, { monate: 72 })).toBe('2–6 Jahren');
    expect(spanneAlsText({ monate: 30 }, { monate: 48 })).toBe('2½–4 Jahren');
    expect(spanneAlsText({ monate: 15 }, { monate: 42 })).toBe('15 Monaten – 3½ Jahren');
    expect(spanneAlsText({ monate: 18 }, { monate: 24 })).toBe('18–24 Monaten'); // bis genau 2 Jahre: wie bisher
  });
});
