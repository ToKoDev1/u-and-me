// Erzeugt eine Kalenderdatei (.ics) für ein U-Zeitfenster – komplett im Browser, ohne Server.
import type { UTermin } from './inhalte';

const icsDatum = (d: Date) =>
  `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;

export function uKalenderDatei(termin: UTermin, name?: string): string {
  const u = termin.untersuchung;
  const fuer = name ? ` für ${name}` : '';
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//U & Me//DE',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:u-and-me-${u.id}-${icsDatum(termin.beginn)}@u-and-me`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').slice(0, 15)}Z`,
    // Ganztägig: DTEND ist exklusiv – passt genau zu unseren exklusiven Enddaten
    `DTSTART;VALUE=DATE:${icsDatum(termin.beginn)}`,
    `DTEND;VALUE=DATE:${icsDatum(termin.ende)}`,
    `SUMMARY:Zeitfenster ${u.id}${fuer}`,
    `DESCRIPTION:${u.id} (${u.zeitraum}): Termin in der Kinderarztpraxis ausmachen – ein Tag irgendwo in diesem Fenster ist gut.`,
    'TRANSP:TRANSPARENT',
    // Erinnerung am ersten Tag um 9 Uhr
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    `DESCRIPTION:Das Zeitfenster für die ${u.id} beginnt heute`,
    'TRIGGER;RELATED=START:PT9H',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

export function uKalenderHerunterladen(termin: UTermin, name?: string): void {
  const blob = new Blob([uKalenderDatei(termin, name)], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${termin.untersuchung.id}-Zeitfenster.ics`;
  link.click();
  URL.revokeObjectURL(url);
}
