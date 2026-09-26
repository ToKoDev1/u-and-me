import { useState, type FormEvent } from 'react';
import { datumBeiAlter, heute, parseDatum } from '../lib/alter';
import { akzentSetzen } from '../lib/darstellung';
import { maskottchen, maskottchenBild, maskottchenInfo, type MaskottchenId } from '../lib/inhalte';
import type { Profil } from '../lib/speicher';
import { Avatar } from './Avatar';

type Props = {
  /** Vorbefüllen bei „Angaben ändern“ */
  vorher?: Profil | null;
  onFertig: (profil: Profil) => void;
  onAbbrechen?: () => void;
};

const isoHeute = () => heute().toLocaleDateString('sv-SE'); // sv-SE = YYYY-MM-DD in lokaler Zeit

export function Onboarding({ vorher, onFertig, onAbbrechen }: Props) {
  const [schritt, setSchritt] = useState<1 | 2>(1);
  const [tier, setTier] = useState<MaskottchenId>(vorher?.maskottchen ?? 'elefant');
  const [geburtsdatum, setGeburtsdatum] = useState(vorher?.geburtsdatum ?? '');
  const [name, setName] = useState(vorher?.name ?? '');
  const [zuFrueh, setZuFrueh] = useState(!!vorher?.errechneterTermin);
  const [termin, setTermin] = useState(vorher?.errechneterTermin ?? '');
  const [fehler, setFehler] = useState('');

  function tierWaehlen(id: MaskottchenId) {
    setTier(id);
    akzentSetzen(id); // Akzent wechselt sofort mit
  }

  function absenden(e: FormEvent) {
    e.preventDefault();
    if (!geburtsdatum) return setFehler('Bitte tragt das Geburtsdatum ein.');
    const geburt = parseDatum(geburtsdatum);
    if (geburt > heute()) return setFehler('Das Geburtsdatum liegt in der Zukunft – bitte prüft es noch einmal.');
    if (datumBeiAlter(geburt, { monate: 24 }) <= heute()) {
      return setFehler(
        'Euer Kind ist schon älter als 2 Jahre. U & Me begleitet euch im Moment nur bis zur U7 – für ältere Kinder folgen die Inhalte später.',
      );
    }
    if (zuFrueh && termin && parseDatum(termin) <= geburt) {
      return setFehler('Der errechnete Termin sollte nach dem Geburtsdatum liegen.');
    }
    onFertig({
      maskottchen: tier,
      geburtsdatum,
      name: name.trim() || undefined,
      errechneterTermin: zuFrueh && termin ? termin : undefined,
    });
  }

  if (schritt === 1) {
    return (
      <div className="onboarding">
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
        <fieldset className="onboarding-auswahl">
          <legend>Wer begleitet euch?</legend>
          <div className="tier-raster">
            {maskottchen.map((m) => (
              <label key={m.id} className="tier-karte">
                <input
                  type="radio"
                  name="maskottchen"
                  value={m.id}
                  checked={tier === m.id}
                  onChange={() => tierWaehlen(m.id)}
                />
                <span className="tier-bild"><img src={maskottchenBild(m.id)} alt="" /></span>
                <span className="tier-name">{m.name}</span>
                <span className="tier-geschichte">{m.geschichte}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <div className="onboarding-cta">
          <button type="button" className="knopf" onClick={() => setSchritt(2)}>
            Weiter mit {maskottchenInfo(tier).artikel}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form className="onboarding" onSubmit={absenden} noValidate>
      <div className="onboarding-kopf">
        <button type="button" className="zurueck" onClick={() => { setSchritt(1); setFehler(''); }}>← Zurück</button>
        <span className="schritt">Schritt 2 von 2</span>
      </div>
      <div className="begruessung onboarding-frage">
        <Avatar tier={tier} groesse={72} />
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
        <button type="submit" className="knopf">{vorher ? 'Speichern' : 'Los geht’s'}</button>
      </div>
    </form>
  );
}
