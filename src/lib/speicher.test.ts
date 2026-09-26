import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  allesLoeschen,
  alsNotizen,
  alsProfil,
  aktivesKind,
  datenLaden,
  datenSpeichern,
  istIsoDatum,
  kindEntfernen,
  kindHinzufuegen,
  kindWaehlen,
  leereDaten,
  notizenSetzen,
  sicherungErstellen,
  sicherungLesen,
} from './speicher';

const hund = { maskottchen: 'hund' as const, geburtsdatum: '2026-01-02' };
const loewe = { maskottchen: 'loewe' as const, geburtsdatum: '2024-05-06', name: 'Ben' };

// Einfacher localStorage-Ersatz für die Tests
function speicherAttrappe() {
  const daten = new Map<string, string>();
  return {
    getItem: (k: string) => daten.get(k) ?? null,
    setItem: (k: string, v: string) => void daten.set(k, v),
    removeItem: (k: string) => void daten.delete(k),
    clear: () => daten.clear(),
    key: (i: number) => [...daten.keys()][i] ?? null,
    get length() {
      return daten.size;
    },
  };
}

beforeEach(() => {
  const s = speicherAttrappe();
  // Object.keys(localStorage) soll die gespeicherten Schlüssel liefern – wie im Browser
  vi.stubGlobal('localStorage', new Proxy(s, { ownKeys: () => [...Array(s.length)].map((_, i) => s.key(i)!), getOwnPropertyDescriptor: () => ({ enumerable: true, configurable: true }) }));
});

describe('istIsoDatum', () => {
  it('akzeptiert nur echte Daten im Format YYYY-MM-DD', () => {
    expect(istIsoDatum('2026-04-19')).toBe(true);
    expect(istIsoDatum('2026-02-31')).toBe(false);
    expect(istIsoDatum('19.04.2026')).toBe(false);
    expect(istIsoDatum(123)).toBe(false);
  });
});

describe('alsProfil', () => {
  it('lehnt unvollständige oder falsche Profile ab', () => {
    expect(alsProfil(123)).toBeNull();
    expect(alsProfil({ maskottchen: 'loewe' })).toBeNull();
    expect(alsProfil({ maskottchen: 'katze', geburtsdatum: '2026-04-19' })).toBeNull();
    expect(alsProfil({ maskottchen: 'loewe', geburtsdatum: '19.04.2026' })).toBeNull();
  });

  it('übernimmt gültige Profile und verwirft ungültige Zusatzfelder', () => {
    expect(alsProfil({ maskottchen: 'loewe', geburtsdatum: '2026-04-19', name: '  Mila ', errechneterTermin: 'bald' })).toEqual({
      maskottchen: 'loewe',
      geburtsdatum: '2026-04-19',
      name: 'Mila',
      errechneterTermin: undefined,
    });
  });
});

describe('Laden aus dem Speicher', () => {
  it('liefert bei kaputten Daten leere Daten statt abzustürzen', () => {
    localStorage.setItem('u-and-me:daten', '{kaputt');
    expect(datenLaden().kinder).toEqual([]);
    localStorage.setItem('u-and-me:daten', '{"version":2,"kinder":[{"profil":{"maskottchen":"loewe"}}]}');
    expect(datenLaden().kinder).toEqual([]);
  });

  it('behält gültige Kinder, auch wenn ein anderes kaputt ist', () => {
    localStorage.setItem('u-and-me:daten', JSON.stringify({ version: 2, kinder: [{ id: 'a', profil: hund }, { id: 'b', profil: 'kaputt' }], aktiv: 'b' }));
    const daten = datenLaden();
    expect(daten.kinder.map((k) => k.id)).toEqual(['a']);
    expect(daten.aktiv).toBe('a'); // aktives Kind gab es nicht mehr → das erste
  });

  it('liefert immer vollständige Notizen', () => {
    expect(alsNotizen({ beobachtet: { U5: ['a', 3] }, eigeneFragen: 'x' })).toEqual({ beobachtet: { U5: ['a'] }, eigeneFragen: {} });
  });

  it('allesLoeschen entfernt nur Schlüssel von U & Me', () => {
    localStorage.setItem('u-and-me:profil', '{}');
    localStorage.setItem('andere-app', 'bleibt');
    allesLoeschen();
    expect(localStorage.getItem('u-and-me:profil')).toBeNull();
    expect(localStorage.getItem('andere-app')).toBe('bleibt');
  });
});

describe('Migration von Version 1', () => {
  it('übernimmt Profil und Notizen als erstes Kind und räumt die alten Schlüssel auf', () => {
    localStorage.setItem('u-and-me:profil', JSON.stringify(loewe));
    localStorage.setItem('u-and-me:notizen', JSON.stringify({ beobachtet: { U7: ['x'] }, eigeneFragen: { U7: ['Zähne?'] } }));
    const daten = datenLaden();
    expect(daten.kinder).toHaveLength(1);
    expect(aktivesKind(daten)?.profil.name).toBe('Ben');
    expect(aktivesKind(daten)?.notizen.eigeneFragen.U7).toEqual(['Zähne?']);
    expect(localStorage.getItem('u-and-me:profil')).toBeNull();
    expect(localStorage.getItem('u-and-me:notizen')).toBeNull();
    // beim nächsten Laden kommt dasselbe Kind aus dem neuen Format
    expect(datenLaden().kinder[0].id).toBe(daten.kinder[0].id);
  });

  it('startet ohne alte Daten leer', () => {
    expect(datenLaden()).toEqual(leereDaten());
  });
});

describe('mehrere Kinder', () => {
  it('hinzufügen, wählen, Notizen pro Kind, entfernen', () => {
    let d = kindHinzufuegen(leereDaten(), hund);
    const erstes = d.aktiv!;
    d = kindHinzufuegen(d, loewe);
    const zweites = d.aktiv!;
    expect(d.kinder).toHaveLength(2);
    expect(aktivesKind(d)?.profil.maskottchen).toBe('loewe'); // neues Kind wird gleich gezeigt

    d = notizenSetzen(d, zweites, { beobachtet: {}, eigeneFragen: { U7: ['nur Ben'] } });
    d = kindWaehlen(d, erstes);
    expect(aktivesKind(d)?.notizen.eigeneFragen).toEqual({}); // Notizen gehören zum Kind

    d = kindEntfernen(d, erstes);
    expect(d.kinder.map((k) => k.id)).toEqual([zweites]);
    expect(d.aktiv).toBe(zweites);
  });

  it('wird gespeichert und wieder geladen', () => {
    const d = kindHinzufuegen(kindHinzufuegen(leereDaten(), hund), loewe);
    datenSpeichern(d);
    expect(datenLaden()).toEqual(d);
  });
});

describe('Sicherung', () => {
  it('liest Sicherungen aus Version 1 und 2 und lehnt fremde Dateien ab', () => {
    const v1 = JSON.stringify({ app: 'u-and-me', version: 1, profil: hund, notizen: {} });
    expect(aktivesKind(sicherungLesen(v1)!)?.profil.maskottchen).toBe('hund');

    const d = kindHinzufuegen(kindHinzufuegen(leereDaten(), hund), loewe);
    const v2 = JSON.stringify(sicherungErstellen(d));
    expect(sicherungLesen(v2)).toEqual(d);

    expect(sicherungLesen('{"app":"andere"}')).toBeNull();
    expect(sicherungLesen('kein json')).toBeNull();
    expect(sicherungErstellen(leereDaten())).toBeNull();
  });
});
