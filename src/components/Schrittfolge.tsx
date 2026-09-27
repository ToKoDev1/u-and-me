import { useEffect, useRef, useState, type ReactNode, type TouchEvent } from 'react';

export type Seite = {
  /** eindeutiger Schlüssel, z. B. der Titel */
  schluessel: string;
  /** Bild über dem Titel (URL), optional */
  bild?: string;
  /** kleineres Bild, z. B. ein Logo */
  bildKlein?: boolean;
  titel: string;
  inhalt: ReactNode;
};

type Props = {
  seiten: Seite[];
  /** Beschriftung des letzten Knopfs */
  fertigText: string;
  onFertig: () => void;
  /** Text oben links, z. B. „U4 Schritt für Schritt“ */
  kopf?: ReactNode;
  /** oben rechts: „Überspringen“ (Welcome-Tour) oder „Schließen“ (U-Schritte) */
  abbrechenText?: string;
};

/**
 * Seiten nacheinander zeigen: Weiter/Zurück, Wischen, Pfeiltasten, Punkte.
 * Genutzt von der Welcome-Tour und von „Ux Schritt für Schritt“.
 */
export function Schrittfolge({ seiten, fertigText, onFertig, kopf, abbrechenText = 'Überspringen' }: Props) {
  const [nr, setNr] = useState(0);
  const titel = useRef<HTMLHeadingElement>(null);
  const wischStart = useRef<number | null>(null);
  const seite = seiten[nr];
  const letzte = nr === seiten.length - 1;

  const gehe = (ziel: number) => setNr(Math.min(Math.max(ziel, 0), seiten.length - 1));

  // Nach jedem Seitenwechsel die Überschrift fokussieren – Screenreader lesen die neue Seite vor
  const ersterRender = useRef(true);
  useEffect(() => {
    if (ersterRender.current) {
      ersterRender.current = false;
      return;
    }
    titel.current?.focus();
  }, [nr]);

  // Pfeiltasten auf dem Desktop
  useEffect(() => {
    const taste = (e: KeyboardEvent) => {
      // In Eingabefeldern (z. B. Datum) gehören die Pfeiltasten dem Feld
      if (e.target instanceof Element && e.target.closest('input, select, textarea')) return;
      if (e.key === 'ArrowRight') setNr((n) => Math.min(n + 1, seiten.length - 1));
      if (e.key === 'ArrowLeft') setNr((n) => Math.max(n - 1, 0));
    };
    window.addEventListener('keydown', taste);
    return () => window.removeEventListener('keydown', taste);
  }, [seiten.length]);

  // Wischen auf dem Handy
  const beiStart = (e: TouchEvent) => (wischStart.current = e.touches[0].clientX);
  const beiEnde = (e: TouchEvent) => {
    if (wischStart.current === null) return;
    const dx = e.changedTouches[0].clientX - wischStart.current;
    if (Math.abs(dx) > 50) gehe(nr + (dx < 0 ? 1 : -1));
    wischStart.current = null;
  };

  return (
    <main className="tour" onTouchStart={beiStart} onTouchEnd={beiEnde}>
      <div className="tour-oben">
        <span className="tour-kopf">
          {kopf && <span>{kopf}</span>}
          <span className="tour-zaehler">
            Schritt {nr + 1} von {seiten.length}
          </span>
        </span>
        {!letzte && (
          <button type="button" className="tour-skip" onClick={onFertig}>
            {abbrechenText}
          </button>
        )}
      </div>

      <div className="tour-inhalt" key={seite.schluessel}>
        {seite.bild && <img className={`tour-bild ${seite.bildKlein ? 'logo' : ''}`} src={seite.bild} alt="" />}
        <h1 ref={titel} tabIndex={-1}>
          {seite.titel}
        </h1>
        {seite.inhalt}
      </div>

      <div className="tour-unten">
        <div className="tour-punkte">
          {seiten.map((s, i) => (
            <button
              key={s.schluessel}
              type="button"
              className={i === nr ? 'aktiv' : ''}
              aria-label={`Seite ${i + 1} von ${seiten.length}`}
              aria-current={i === nr ? 'step' : undefined}
              onClick={() => gehe(i)}
            />
          ))}
        </div>
        <div className="tour-knoepfe">
          {nr > 0 ? (
            <button type="button" className="knopf knopf-zweit" onClick={() => gehe(nr - 1)}>
              Zurück
            </button>
          ) : null}
          <button
            type="button"
            className={nr === 0 ? 'knopf tour-breit' : 'knopf'}
            onClick={letzte ? onFertig : () => gehe(nr + 1)}
          >
            {letzte ? fertigText : 'Weiter'}
          </button>
        </div>
      </div>
    </main>
  );
}
