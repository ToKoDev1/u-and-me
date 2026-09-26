import { useState, type FormEvent } from 'react';
import { datumBeiAlter, heute, parseDatum } from '../lib/alter';
import { akzentSetzen } from '../lib/darstellung';
import { maskottchen, maskottchenBild, type MaskottchenId } from '../lib/inhalte';
import type { Profil } from '../lib/speicher';

type Props = {
  /** Vorbefüllen bei „Angaben ändern“ */
  vorher?: Profil | null;
  onFertig: (profil: Profil) => void;
  onAbbrechen?: () => void;
};

const isoHeute = () => heute().toLocaleDateString('sv-SE'); // sv-SE = YYYY-MM-DD in lokaler Zeit

/** Schritt 1: Angaben zum Kind · Schritt 2: Maskottchen wählen */
export function Onboarding({ vorher, onFertig, onAbbrechen }: Props) {
  const [schritt, setSchritt] = useState<1 | 2>(1);
  const [geburtsdatum, setGeburtsdatum] = useState(vorher?.geburtsdatum ?? '');
  const [name, setName] = useState(vorher?.name ?? '');
  const [zuFrueh, setZuFrueh] = useState(!!vorher?.errechneterTermin);
  const [termin, setTermin] = useState(vorher?.errechneterTermin ?? '');
  const [tier, setTier] = useState<MaskottchenId>(vorher?.maskottchen ?? 'elefant');
  const [fehler, setFehler] = useState('');

  function pruefen(): string {
    if (!geburtsdatum) return 'Bitte tragt das Geburtsdatum ein.';
    const geburt = parseDatum(geburtsdatum);
    if (geburt > heute()) return 'Das Geburtsdatum liegt in der Zukunft – bitte prüft es noch einmal.';
    if (datumBeiAlter(geburt, { monate: 24 }) <= heute()) {
      return 'Euer Kind ist schon älter als 2 Jahre. U & Me begleitet euch im Moment nur bis zur U7 – für ältere Kinder folgen die Inhalte später.';
    }
    if (zuFrueh && termin && parseDatum(termin) <= geburt) return 'Der errechnete Termin sollte nach dem Geburtsdatum liegen.';
    return '';
  }

  function weiter(e: FormEvent) {
    e.preventDefault();
    const problem = pruefen();
    setFehler(problem);
    if (!problem) {
      akzentSetzen(tier);
      setSchritt(2);
    }
  }

  function tierWaehlen(id: MaskottchenId) {
    setTier(id);
    akzentSetzen(id); // Akzent wechselt sofort mit
  }

  function fertig(e: FormEvent) {
    e.preventDefault();
    onFertig({
      maskottchen: tier,
      geburtsdatum,
      name: name.trim() || undefined,
      errechneterTermin: zuFrueh && termin ? termin : undefined,
    });
  }

  if (schritt === 1) {
    return (
      <form className="onboarding" onSubmit={weiter} noValidate>
        <div className="onboarding-kopf">
          {onAbbrechen ? (
            <button type="button" className="zurueck" onClick={onAbbrechen}>← Abbrechen</button>
          ) : (
            <span className="wortmarke">U &amp; Me</span>
          )}
          <span className="schritt">Schritt 1 von 2</span>
        </div>
        <div className="onboarding-intro">
          <h1>{vorher ? 'Angaben ändern' : 'Schön, dass ihr da seid.'}</h1>
          <p className="gedaempft">U &amp; Me begleitet euch zwischen den U-Untersuchungen – mit Spannbreiten statt Terminen.</p>
        </div>

        <div className="onboarding-frage">
          <div className="sprechblase"><p>Wann ist euer Kind auf die Welt gekommen?</p></div>
        </div>

        <div className="felder">
          <label className="feld">
            <span className="feld-label">Geburtsdatum</span>
            <input
              type="date"
              value={geburtsdatum}
              max={isoHeute()}
              required
              onChange={(e) => { setGeburtsdatum(e.target.value); setFehler(''); }}
            />
          </label>
          <label className="feld">
            <span className="feld-label">Name <span className="gedaempft">(optional)</span></span>
            <input type="text" value={name} placeholder="Mila" autoComplete="off" onChange={(e) => setName(e.target.value)} />
          </label>
          <label className="ankreuzen">
            <input type="checkbox" checked={zuFrueh} onChange={(e) => setZuFrueh(e.target.checked)} />
            <span className="kaestchen" aria-hidden="true">{zuFrueh ? '✓' : ''}</span>
            <span><b>Zu früh geboren?</b> Dann tragt zusätzlich den errechneten Termin ein.</span>
          </label>
          {zuFrueh && (
            <label className="feld">
              <span className="feld-label">Errechneter Termin</span>
              <input type="date" value={termin} onChange={(e) => { setTermin(e.target.value); setFehler(''); }} />
            </label>
          )}
        </div>

        {fehler && <p className="fehler" role="alert">{fehler}</p>}

        <div className="datenschutz">
          <div className="hinweisbox">
            <span className="hinweisbox-punkt bewegung" aria-hidden="true" />
            <p><b>Alles bleibt auf diesem Gerät.</b> Kein Konto, keine Anmeldung – nichts wird verschickt.</p>
          </div>
        </div>

        <div className="onboarding-cta">
          <button type="submit" className="knopf">Weiter</button>
        </div>
      </form>
    );
  }

  return (
    <form className="onboarding" onSubmit={fertig}>
      <div className="onboarding-kopf">
        <button type="button" className="zurueck" onClick={() => setSchritt(1)}>← Zurück</button>
        <span className="schritt">Schritt 2 von 2</span>
      </div>
      <fieldset className="onboarding-auswahl">
        <legend>Wer begleitet {name.trim() || 'euch'}?</legend>
        <p className="gedaempft onboarding-auswahl-text">Sucht euch einen Begleiter aus – er zeigt euch, wo ihr gerade steht.</p>
        <div className="tier-raster">
          {maskottchen.map((m) => (
            <label key={m.id} className="tier-karte">
              <input type="radio" name="maskottchen" value={m.id} checked={tier === m.id} onChange={() => tierWaehlen(m.id)} />
              <span className="nur-screenreader">{m.name}</span>
              <span className="tier-bild"><img src={maskottchenBild(m.id)} alt="" /></span>
              <span className="tier-geschichte">{m.geschichte}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="onboarding-cta">
        <button type="submit" className="knopf">{vorher ? 'Speichern' : 'Los geht’s'}</button>
      </div>
    </form>
  );
}
