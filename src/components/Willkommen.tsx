import { useEffect, useRef, useState, type TouchEvent } from 'react';
import tourDaten from '../content/tour.json';
import { maskottchenBild, type MaskottchenId } from '../lib/inhalte';
import { useSeitentitel } from '../lib/seite';

type Seite = { bild: 'logo' | MaskottchenId; titel: string; text: string };
const seiten = tourDaten.seiten as Seite[];

const bildQuelle = (bild: Seite['bild']) =>
  bild === 'logo' ? `${import.meta.env.BASE_URL}icons/elefant-logo.png` : maskottchenBild(bild);

type Props = {
  /** Beschriftung des letzten Knopfs – „Los geht's“ beim ersten Mal, „Zur App“ beim erneuten Ansehen */
  fertigText: string;
  onFertig: () => void;
};

/** Welcome-Tour: ein paar kurze Seiten, die erklären, wie U & Me funktioniert */
export function Willkommen({ fertigText, onFertig }: Props) {
  useSeitentitel('Willkommen');
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
      if (e.key === 'ArrowRight') setNr((n) => Math.min(n + 1, seiten.length - 1));
      if (e.key === 'ArrowLeft') setNr((n) => Math.max(n - 1, 0));
    };
    window.addEventListener('keydown', taste);
    return () => window.removeEventListener('keydown', taste);
  }, []);

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
        {!letzte && (
          <button type="button" className="tour-skip" onClick={onFertig}>
            Überspringen
          </button>
        )}
      </div>

      <div className="tour-inhalt" key={nr}>
        <img className={`tour-bild ${seite.bild === 'logo' ? 'logo' : ''}`} src={bildQuelle(seite.bild)} alt="" />
        <h1 ref={titel} tabIndex={-1}>
          {seite.titel}
        </h1>
        <p>{seite.text}</p>
      </div>

      <div className="tour-unten">
        <div className="tour-punkte">
          {seiten.map((s, i) => (
            <button
              key={s.titel}
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
