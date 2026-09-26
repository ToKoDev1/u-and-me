import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  allesLoeschen,
  alsNotizen,
  alsProfil,
  istIsoDatum,
  notizenLaden,
  profilLaden,
  sicherungLesen,
} from './speicher';

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
  it('liefert bei kaputten Daten kein Profil statt abzustürzen', () => {
    localStorage.setItem('u-and-me:profil', '{kaputt');
    expect(profilLaden()).toBeNull();
    localStorage.setItem('u-and-me:profil', '{"maskottchen":"loewe"}');
    expect(profilLaden()).toBeNull();
  });

  it('liefert immer vollständige Notizen', () => {
    localStorage.setItem('u-and-me:notizen', '{}');
    expect(notizenLaden()).toEqual({ beobachtet: {}, eigeneFragen: {} });
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

describe('sicherungLesen', () => {
  it('liest gültige Sicherungen und lehnt fremde Dateien ab', () => {
    const gut = JSON.stringify({ app: 'u-and-me', version: 1, profil: { maskottchen: 'hund', geburtsdatum: '2026-01-02' }, notizen: {} });
    expect(sicherungLesen(gut)?.profil.maskottchen).toBe('hund');
    expect(sicherungLesen('{"app":"andere"}')).toBeNull();
    expect(sicherungLesen('kein json')).toBeNull();
  });
});
