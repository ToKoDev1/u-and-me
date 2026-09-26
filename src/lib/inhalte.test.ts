import { describe, expect, it } from 'vitest';
import { datumBeiAlter, parseDatum, tageZwischen, type Alter } from './alter';
import {
  aktuellePhase,
  begleitetBis,
  etappen,
  etappenStatus,
  naechsteUntersuchung,
  phasen,
  untersuchungen,
  uTermin,
  vorherigeUntersuchung,
  zahnarzt,
} from './inhalte';
import { kindAus } from './kind';

const kind = (geburt: string, heute: string, errechneterTermin?: string) =>
  kindAus({ maskottchen: 'elefant', geburtsdatum: geburt, errechneterTermin }, parseDatum(heute));

describe('nächste und vorherige U', () => {
  it('findet die laufende U5 und davor die U4', () => {
    const k = kind('2026-04-19', '2026-09-26');
    expect(naechsteUntersuchung(k)?.untersuchung.id).toBe('U5');
    expect(naechsteUntersuchung(k)?.laeuftSchon).toBe(true);
    expect(vorherigeUntersuchung(k)?.untersuchung.id).toBe('U4');
  });

  it('behandelt das Ende eines Fensters als exklusiv', () => {
    // U4-Fenster endet mit 4 Monaten: am 19.08. ist schon die U5 die nächste
    expect(naechsteUntersuchung(kind('2026-04-19', '2026-08-18'))?.untersuchung.id).toBe('U4');
    expect(naechsteUntersuchung(kind('2026-04-19', '2026-08-19'))?.untersuchung.id).toBe('U5');
  });

  it('kennt am Tag der Geburt die U1 und danach keine U mehr', () => {
    expect(naechsteUntersuchung(kind('2026-09-26', '2026-09-26'))?.untersuchung.id).toBe('U1');
    expect(naechsteUntersuchung(kind('2020-01-01', '2026-09-26'))).toBeUndefined(); // nach der U9
  });

  it('findet eine U unabhängig von Groß- und Kleinschreibung', () => {
    const k = kind('2024-01-01', '2026-09-26');
    for (const id of ['U7a', 'u7a', 'U7A']) expect(uTermin(k, id)?.untersuchung.id, id).toBe('U7a');
    expect(uTermin(k, 'U10')).toBeUndefined();
  });

  it('kennt nach der U7 die U7a, U8 und U9', () => {
    expect(naechsteUntersuchung(kind('2024-01-01', '2026-09-26'))?.untersuchung.id).toBe('U7a'); // 2 Jahre 8 Monate
    expect(naechsteUntersuchung(kind('2022-12-01', '2026-09-26'))?.untersuchung.id).toBe('U8'); // 3 Jahre 9 Monate
    expect(naechsteUntersuchung(kind('2021-10-01', '2026-09-26'))?.untersuchung.id).toBe('U9'); // 4 Jahre 11 Monate
  });
});

describe('Frühgeborene', () => {
  it('rechnen Etappen nach korrigiertem Alter', () => {
    const frueh = kind('2026-07-01', '2026-09-26', '2026-08-26'); // 8 Wochen zu früh
    const greifen = etappen.find((e) => e.id === 'greifen')!; // ab 3 Monaten
    expect(etappenStatus(frueh, greifen)).toBe('kommend');
    expect(etappenStatus(kind('2026-07-01', '2026-10-05'), greifen)).toBe('gerade-dran');
  });

  it('bekommen Warnzeichen und Spielideen passend zum korrigierten Alter', () => {
    // tatsächlich knapp 3 Monate (U3–U4), korrigiert gut 4 Wochen → Phase U2–U3
    expect(aktuellePhase(kind('2026-07-01', '2026-09-26', '2026-08-26'))?.id).toBe('u2-u3');
    expect(aktuellePhase(kind('2026-07-01', '2026-09-26'))?.id).toBe('u3-u4');
  });
});

describe('Inhalte (JSON) sind plausibel', () => {
  const tage = (a: Alter) => tageZwischen(parseDatum('2026-01-01'), datumBeiAlter(parseDatum('2026-01-01'), a));

  it('Phasen sind lückenlos von der Geburt bis zum Ende der letzten U', () => {
    const k = (heute: string) => kind('2025-01-01', heute);
    const bisTag = tageZwischen(parseDatum('2025-01-01'), datumBeiAlter(parseDatum('2025-01-01'), begleitetBis));
    for (let t = 0; t < bisTag; t++) {
      const datum = new Date(2025, 0, 1 + t).toLocaleDateString('sv-SE');
      expect(aktuellePhase(k(datum)), `Tag ${t}`).toBeDefined();
    }
  });

  it('jedes Zeitfenster beginnt vor seinem Ende', () => {
    for (const x of [...phasen, ...etappen, ...untersuchungen, ...zahnarzt.termine]) {
      expect(tage(x.von), x.id).toBeLessThan(tage(x.bis));
    }
  });

  it('IDs sind eindeutig und Bereiche gültig', () => {
    for (const liste of [phasen, etappen, untersuchungen]) {
      const ids = liste.map((x) => x.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
    const bereiche = ['alltag', 'bewegung', 'sprache', 'miteinander'];
    for (const e of etappen) expect(bereiche, e.id).toContain(e.bereich);
    for (const p of phasen) for (const s of p.spielideen) expect(bereiche, s.titel).toContain(s.bereich);
  });

  it('jede U hat Inhalte und eine Quellseite', () => {
    for (const u of untersuchungen) {
      expect(u.passiert.length, u.id).toBeGreaterThan(0);
      expect(u.url, u.id).toMatch(/^https:\/\//);
      expect(u.schritte.length, `${u.id}: Schritt für Schritt`).toBeGreaterThanOrEqual(3);
    }
  });
});
