import { describe, expect, it } from 'vitest';
import { parseDatum } from './alter';
import { uTermin } from './inhalte';
import { uKalenderDatei } from './kalender';
import { kindAus } from './kind';

const uid = (ics: string) => ics.match(/^UID:(.*)$/m)?.[1];

describe('Kalenderdatei', () => {
  it('gibt Zwillingen verschiedene Termin-Kennungen', () => {
    const profil = { maskottchen: 'hund' as const, geburtsdatum: '2026-04-19' };
    const termin = uTermin(kindAus(profil, parseDatum('2026-05-01')), 'U4')!;
    const ida = uKalenderDatei(termin, 'Ida', 'kind-a');
    const ole = uKalenderDatei(termin, 'Ole', 'kind-b');
    expect(uid(ida)).not.toBe(uid(ole));
    expect(ida).toContain('SUMMARY:Zeitfenster U4 für Ida');
  });

  it('beschreibt ein ganztägiges Zeitfenster mit exklusivem Ende', () => {
    const profil = { maskottchen: 'hund' as const, geburtsdatum: '2026-04-19' };
    const termin = uTermin(kindAus(profil, parseDatum('2026-05-01')), 'U4')!;
    const ics = uKalenderDatei(termin);
    expect(ics).toContain('DTSTART;VALUE=DATE:20260619'); // 2 Monate
    expect(ics).toContain('DTEND;VALUE=DATE:20260819'); // 4 Monate, exklusiv
  });
});
