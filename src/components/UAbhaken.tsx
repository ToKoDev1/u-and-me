import { useEffect, useRef, useState } from 'react';
import { datumFormat, parseDatum } from '../lib/alter';
import type { UTermin } from '../lib/inhalte';
import type { Kind } from '../lib/kind';
import { sicherungHerunterladen, type Notizen } from '../lib/speicher';
import { Symbol } from './Symbol';

type Props = { termin: UTermin; kind: Kind; notizen: Notizen; onNotizen: (n: Notizen) => void };

/**
 * U abhaken: „Als erledigt abhaken“ → „Erledigt am …“ (Datum änderbar, rückgängig machbar).
 * Erst möglich, wenn das Zeitfenster begonnen hat. Keine Wertung – nur eine Notiz für euch.
 */
export function UAbhaken({ termin, kind, notizen, onNotizen }: Props) {
  const id = termin.untersuchung.id;
  const datum = notizen.uErledigt[id];
  const heute = kind.jetzt.toLocaleDateString('sv-SE'); // YYYY-MM-DD, bei der Zeitreise das simulierte Datum

  // Nach dem Umschalten verschwindet das angetippte Element – Fokus gezielt weitergeben
  const datumFeld = useRef<HTMLInputElement>(null);
  const abhakenKnopf = useRef<HTMLButtonElement>(null);
  const umgeschaltet = useRef(false);
  // Direkt nach dem Abhaken einmal an die Sicherung erinnern – eure Angaben liegen nur auf diesem Gerät
  const [sichernTipp, setSichernTipp] = useState(false);
  useEffect(() => {
    if (!umgeschaltet.current) return;
    umgeschaltet.current = false;
    (datum ? datumFeld.current : abhakenKnopf.current)?.focus();
  }, [datum]);

  const setzen = (wert: string | null) => {
    umgeschaltet.current = true;
    setSichernTipp(!datum && !!wert);
    const uErledigt = { ...notizen.uErledigt };
    if (wert) uErledigt[id] = wert;
    else delete uErledigt[id];
    onNotizen({ ...notizen, uErledigt });
  };

  const ansage = (
    <span className="nur-screenreader" aria-live="polite">
      {datum ? `${id} als erledigt gespeichert am ${datumFormat.format(parseDatum(datum))}` : ''}
    </span>
  );

  // Die Ansage steht immer an derselben Stelle – so wird die Änderung zuverlässig vorgelesen
  if (!datum && termin.beginn > kind.jetzt) return null;
  return (
    <>
      {ansage}
      {datum ? (
        <div className="u-abgehakt">
          <span className="u-abgehakt-text">
            <Symbol name="haken" /> {id} erledigt am
          </span>
          <input
            ref={datumFeld}
            type="date"
            value={datum}
            max={heute}
            aria-label={`Datum der ${id}`}
            onChange={(e) => e.target.value && setzen(e.target.value)}
          />
          <button type="button" className="link-leise" onClick={() => setzen(null)}>
            Rückgängig
          </button>
          {sichernTipp && (
            <p className="u-sichern-tipp">
              Gute Gelegenheit für eine Sicherung – eure Angaben liegen nur auf diesem Gerät.{' '}
              <button type="button" className="link-leise" onClick={() => sicherungHerunterladen() && setSichernTipp(false)}>
                Sicherung herunterladen
              </button>
            </p>
          )}
        </div>
      ) : (
        <button ref={abhakenKnopf} type="button" className="knopf knopf-zweit knopf-mit-symbol" onClick={() => setzen(heute)}>
          <Symbol name="haken" /> {id} als erledigt abhaken
        </button>
      )}
    </>
  );
}
