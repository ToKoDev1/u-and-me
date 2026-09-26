import { describe, expect, it } from 'vitest';
import { datumBeiAlter, parseDatum, tageZwischen, type Alter } from './alter';
import {
  aktuellePhase,
  etappen,
  etappenStatus,
  naechsteUntersuchung,
  phasen,
  untersuchungen,
  vorherigeUntersuchung,
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
    expect(naechsteUntersuchung(kind('2024-01-01', '2026-09-26'))).toBeUndefined();
  });
});

describe('Frühgeborene', () => {
  it('rechnen Etappen nach korrigiertem Alter', () => {
    const frueh = kind('2026-07-01', '2026-09-26', '2026-08-26'); // 8 Wochen zu früh
    const greifen = etappen.find((e) => e.id === 'greifen')!; // ab 3 Monaten
    expect(etappenStatus(frueh, greifen)).toBe('kommend');
    expect(etappenStatus(kind('2026-07-01', '2026-10-05'), greifen)).toBe('gerade-dran');
  });
});

describe('Inhalte (JSON) sind plausibel', () => {
  const tage = (a: Alter) => tageZwischen(parseDatum('2026-01-01'), datumBeiAlter(parseDatum('2026-01-01'), a));

  it('Phasen sind lückenlos von der Geburt bis 24 Monate', () => {
    const k = (heute: string) => kind('2025-01-01', heute);
    for (let t = 0; t < 730; t++) {
      const datum = new Date(2025, 0, 1 + t).toLocaleDateString('sv-SE');
      expect(aktuellePhase(k(datum)), `Tag ${t}`).toBeDefined();
    }
  });

  it('jedes Zeitfenster beginnt vor seinem Ende', () => {
    for (const x of [...phasen, ...etappen, ...untersuchungen]) {
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
    }
  });
});
