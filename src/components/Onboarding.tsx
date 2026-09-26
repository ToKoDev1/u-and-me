import { useEffect, useState, type FormEvent } from 'react';
import { datumBeiAlter, heute, parseDatum, tageZwischen } from '../lib/alter';
import { akzentSetzen } from '../lib/darstellung';
import { maskottchen, maskottchenBild, type MaskottchenId } from '../lib/inhalte';
import { speicherVerfuegbar, type Profil } from '../lib/speicher';
import { SpeicherWarnung } from './Rahmen';
import { Symbol } from './Symbol';

type Props = {
  /** Vorbefüllen bei „Angaben ändern“ */
  vorher?: Profil | null;
  onFertig: (profil: Profil) => void;
  onAbbrechen?: () => void;
  /** ab dem 2. Kind: Name ist Pflicht, damit man die Kinder im Menü unterscheiden kann */
  nameNoetig?: boolean;
  /** bei „Angaben ändern“ mit mehreren Kindern: dieses Kind entfernen */
  onEntfernen?: () => void;
  /** Akzentfarbe, die nach dem Verlassen wieder gilt (beim Hinzufügen: das bisher gezeigte Kind) */
  akzentDanach?: MaskottchenId;
};

const isoHeute = () => heute().toLocaleDateString('sv-SE'); // sv-SE = YYYY-MM-DD in lokaler Zeit

/** Schritt 1: Angaben zum Kind · Schritt 2: Maskottchen wählen */
export function Onboarding({ vorher, onFertig, onAbbrechen, nameNoetig, onEntfernen, akzentDanach }: Props) {
  const [schritt, setSchritt] = useState<1 | 2>(1);
  const [geburtsdatum, setGeburtsdatum] = useState(vorher?.geburtsdatum ?? '');
  const [name, setName] = useState(vorher?.name ?? '');
  const [zuFrueh, setZuFrueh] = useState(!!vorher?.errechneterTermin);
  const [termin, setTermin] = useState(vorher?.errechneterTermin ?? '');
  const [tier, setTier] = useState<MaskottchenId>(vorher?.maskottchen ?? 'elefant');
  const [fehler, setFehler] = useState<{ feld: 'geburt' | 'name' | 'termin'; text: string } | null>(null);

  // Beim Verlassen (Abbrechen, Zurück, Speichern) die Vorschau-Farbe zurücksetzen;
  // nach dem Speichern setzt die App danach die neue.
  useEffect(() => () => akzentSetzen(akzentDanach ?? vorher?.maskottchen), [vorher, akzentDanach]);

  function pruefen(): typeof fehler {
    if (!geburtsdatum) return { feld: 'geburt', text: 'Bitte tragt das Geburtsdatum ein.' };
    const geburt = parseDatum(geburtsdatum);
    if (geburt > heute()) return { feld: 'geburt', text: 'Das Geburtsdatum liegt in der Zukunft – bitte prüft es noch einmal.' };
    // Nur beim ersten Anlegen: Bestehende Familien sollen ihre Angaben immer ändern können
    if (!vorher && datumBeiAlter(geburt, { monate: 24 }) <= heute()) {
      return {
        feld: 'geburt',
        text: 'Euer Kind ist schon älter als 2 Jahre. U & Me begleitet euch im Moment nur bis zur U7 – für ältere Kinder folgen die Inhalte später.',
      };
    }
    if (nameNoetig && !name.trim()) {
      return { feld: 'name', text: 'Bitte gebt einen Namen an – so könnt ihr eure Kinder im Menü auseinanderhalten.' };
    }
    if (zuFrueh) {
      if (!termin) return { feld: 'termin', text: 'Bitte tragt den errechneten Termin ein – oder nehmt den Haken bei „Zu früh geboren?“ heraus.' };
      const abstand = tageZwischen(geburt, parseDatum(termin));
      if (abstand <= 0) return { feld: 'termin', text: 'Der errechnete Termin sollte nach dem Geburtsdatum liegen.' };
      if (abstand > 18 * 7) return { feld: 'termin', text: 'Der errechnete Termin liegt ungewöhnlich weit nach der Geburt – bitte prüft ihn noch einmal.' };
    }
    return null;
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
        {!speicherVerfuegbar() && <SpeicherWarnung />}
        <div className="onboarding-kopf">
          {onAbbrechen ? (
            <button type="button" className="zurueck" onClick={onAbbrechen}>← Abbrechen</button>
          ) : (
            <span className="wortmarke">U &amp; Me</span>
          )}
          <span className="schritt">Schritt 1 von 2</span>
        </div>
        <div className="onboarding-intro">
          <h1>{vorher ? 'Angaben ändern' : onAbbrechen ? 'Ein weiteres Kind' : 'Schön, dass ihr da seid.'}</h1>
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
              aria-invalid={fehler?.feld === 'geburt'}
              aria-describedby={fehler?.feld === 'geburt' ? 'fehler-meldung' : undefined}
              onChange={(e) => { setGeburtsdatum(e.target.value); setFehler(null); }}
            />
          </label>
          {fehler?.feld === 'geburt' && <p id="fehler-meldung" className="fehler" role="alert">{fehler.text}</p>}
          <label className="feld">
            <span className="feld-label">Name {!nameNoetig && <span className="gedaempft">(optional)</span>}</span>
            <input
              type="text"
              value={name}
              placeholder="z. B. Mila"
              autoComplete="off"
              aria-invalid={fehler?.feld === 'name'}
              aria-describedby={fehler?.feld === 'name' ? 'fehler-meldung' : undefined}
              onChange={(e) => { setName(e.target.value); setFehler(null); }}
            />
          </label>
          {fehler?.feld === 'name' && <p id="fehler-meldung" className="fehler" role="alert">{fehler.text}</p>}
          <label className="ankreuzen">
            <input type="checkbox" checked={zuFrueh} onChange={(e) => { setZuFrueh(e.target.checked); setFehler(null); }} />
            <span className="kaestchen" aria-hidden="true">{zuFrueh ? '✓' : ''}</span>
            <span><b>Zu früh geboren?</b> Dann tragt zusätzlich den errechneten Termin ein.</span>
          </label>
          {zuFrueh && (
            <label className="feld">
              <span className="feld-label">Errechneter Termin</span>
              <input
                type="date"
                value={termin}
                aria-invalid={fehler?.feld === 'termin'}
                aria-describedby={fehler?.feld === 'termin' ? 'fehler-meldung' : undefined}
                onChange={(e) => { setTermin(e.target.value); setFehler(null); }}
              />
            </label>
          )}
          {fehler?.feld === 'termin' && <p id="fehler-meldung" className="fehler" role="alert">{fehler.text}</p>}
        </div>

        <div className="datenschutz">
          <div className="hinweisbox">
            <Symbol name="schloss" className="hinweisbox-symbol" />
            <p><b>Alles bleibt auf diesem Gerät.</b> Kein Konto, keine Anmeldung – nichts wird verschickt.</p>
          </div>
        </div>

        <div className="onboarding-cta">
          <button type="submit" className="knopf">Weiter</button>
          {onEntfernen && (
            <button type="button" className="knopf-leise" onClick={onEntfernen}>
              {vorher?.name ?? 'Dieses Kind'} aus U &amp; Me entfernen
            </button>
          )}
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
              <span className="tier-haken" aria-hidden="true"><Symbol name="haken" /></span>
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
