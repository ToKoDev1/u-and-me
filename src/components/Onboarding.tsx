import { useState, type FormEvent } from 'react';
import { maskottchen, maskottchenBild, type MaskottchenId } from '../lib/inhalte';
import { heute, parseDatum } from '../lib/alter';
import type { Profil } from '../lib/speicher';

type Props = { onFertig: (profil: Profil) => void };

export function Onboarding({ onFertig }: Props) {
  const [tier, setTier] = useState<MaskottchenId | null>(null);
  const [geburtsdatum, setGeburtsdatum] = useState('');
  const [name, setName] = useState('');
  const [fehler, setFehler] = useState('');

  function absenden(e: FormEvent) {
    e.preventDefault();
    if (!tier) return setFehler('Wählt bitte ein Maskottchen aus.');
    if (!geburtsdatum) return setFehler('Gebt bitte das Geburtsdatum ein.');
    if (parseDatum(geburtsdatum) > heute()) return setFehler('Das Geburtsdatum liegt in der Zukunft.');
    onFertig({ maskottchen: tier, geburtsdatum, name: name.trim() || undefined });
  }

  return (
    <form className="seite" onSubmit={absenden} noValidate>
      <h1>Willkommen bei U &amp; Me</h1>
      <p>Wir begleiten euch zwischen den U-Untersuchungen – mit dem, was gerade typisch ist, und dem, was als Nächstes kommt.</p>

      <fieldset>
        <legend>Wer begleitet euch?</legend>
        <div className="maskottchen-auswahl">
          {maskottchen.map((m) => (
            <label key={m.id} className={`maskottchen-karte ${tier === m.id ? 'gewaehlt' : ''}`}>
              <input
                type="radio"
                name="maskottchen"
                value={m.id}
                checked={tier === m.id}
                onChange={() => { setTier(m.id); setFehler(''); }}
              />
              <img src={maskottchenBild(m.id)} alt="" />
              <strong>{m.name}</strong>
              <small>{m.geschichte}</small>
            </label>
          ))}
        </div>
      </fieldset>

      <label className="feld">
        Geburtsdatum
        <input
          type="date"
          value={geburtsdatum}
          max={heute().toLocaleDateString('sv-SE') /* sv-SE liefert YYYY-MM-DD in lokaler Zeit */}
          onChange={(e) => { setGeburtsdatum(e.target.value); setFehler(''); }}
        />
      </label>

      <label className="feld">
        Name des Kindes <span className="gedaempft">(optional)</span>
        <input type="text" value={name} placeholder="Mila" onChange={(e) => setName(e.target.value)} />
      </label>

      {fehler && <p className="fehler" role="alert">{fehler}</p>}

      <button type="submit">Los geht's</button>

      <p className="hinweis">Alle Angaben bleiben nur auf diesem Gerät. Es gibt kein Konto und keinen Server.</p>
    </form>
  );
}
