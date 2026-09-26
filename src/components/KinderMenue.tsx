import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { alterAlsText, alterAm } from '../lib/alter';
import { darstellungLaden, darstellungSpeichern, type Darstellung } from '../lib/darstellung';
import { kindAus } from '../lib/kind';
import type { Daten } from '../lib/speicher';
import { Avatar } from './Avatar';

const darstellungen: { wert: Darstellung; text: string }[] = [
  { wert: 'hell', text: 'Hell' },
  { wert: 'dunkel', text: 'Dunkel' },
  { wert: 'auto', text: 'Wie das Gerät' },
];

type Props = { daten: Daten; onKindWaehlen: (id: string) => void };

/**
 * Der Avatar oben rechts öffnet dieses Menü: Kinder wechseln und hinzufügen, Einstellungen.
 * Schließt bei Escape, Tipp daneben oder Seitenwechsel.
 */
export function KinderMenue({ daten, onKindWaehlen }: Props) {
  // Merkt sich, auf welcher Seite das Menü geöffnet wurde – nach einem Seitenwechsel ist es damit zu
  const [offenAuf, setOffenAuf] = useState<string | null>(null);
  const [darstellung, setDarstellung] = useState(darstellungLaden);
  const knopf = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();
  const offen = offenAuf === pathname;
  const setOffen = (auf: boolean) => setOffenAuf(auf ? pathname : null);
  const aktiv = daten.kinder.find((k) => k.id === daten.aktiv);

  useEffect(() => {
    if (!offen) return;
    panel.current?.querySelector<HTMLElement>('button, a')?.focus();
    const taste = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOffenAuf(null);
        knopf.current?.focus();
      }
    };
    const klick = (e: PointerEvent) => {
      const ziel = e.target as Node;
      if (!panel.current?.contains(ziel) && !knopf.current?.contains(ziel)) setOffenAuf(null);
    };
    document.addEventListener('keydown', taste);
    document.addEventListener('pointerdown', klick);
    return () => {
      document.removeEventListener('keydown', taste);
      document.removeEventListener('pointerdown', klick);
    };
  }, [offen]);

  if (!aktiv) return null;

  return (
    <div className="menue">
      <button
        ref={knopf}
        type="button"
        className="menue-knopf"
        aria-expanded={offen}
        aria-controls="kinder-menue"
        aria-label={`Menü – ${aktiv.profil.name ?? 'euer Kind'}`}
        onClick={() => setOffen(!offen)}
      >
        <Avatar tier={aktiv.profil.maskottchen} groesse={40} />
      </button>

      {offen && (
        <div ref={panel} id="kinder-menue" className="menue-panel">
          <h2 className="menue-titel">{daten.kinder.length > 1 ? 'Eure Kinder' : 'Euer Kind'}</h2>
          <ul className="menue-kinder">
            {daten.kinder.map((k) => {
              const ist = k.id === daten.aktiv;
              const kind = kindAus(k.profil);
              return (
                <li key={k.id}>
                  <button
                    type="button"
                    className={`menue-kind ${ist ? 'aktiv' : ''}`}
                    aria-current={ist ? 'true' : undefined}
                    onClick={() => {
                      onKindWaehlen(k.id);
                      setOffen(false);
                    }}
                  >
                    <span data-maskottchen={k.profil.maskottchen}>
                      <Avatar tier={k.profil.maskottchen} groesse={40} />
                    </span>
                    <span className="menue-kind-text">
                      <b>{k.profil.name ?? 'Euer Kind'}</b>
                      <span className="gedaempft">{alterAlsText(alterAm(kind.geburt, kind.jetzt))}</span>
                    </span>
                    {ist && <span className="menue-haken" aria-hidden="true">✓</span>}
                  </button>
                </li>
              );
            })}
          </ul>
          <Link to="/kind-neu" className="menue-eintrag menue-neu">+ Kind hinzufügen</Link>

          <hr />
          <Link to="/angaben" className="menue-eintrag">Angaben zu {aktiv.profil.name ?? 'eurem Kind'} ändern</Link>
          <Link to="/datenschutz" className="menue-eintrag">Datenschutz &amp; Daten</Link>
          <Link to="/tour" className="menue-eintrag">App-Tour ansehen</Link>
          <div className="menue-darstellung" role="group" aria-label="Darstellung">
            {darstellungen.map((o) => (
              <button
                key={o.wert}
                type="button"
                aria-pressed={darstellung === o.wert}
                onClick={() => {
                  darstellungSpeichern(o.wert);
                  setDarstellung(o.wert);
                }}
              >
                {o.text}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
