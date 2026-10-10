import { entwicklung, entwicklungsPunkte, mitName, type EntwicklungsBereich, type UTermin } from '../lib/inhalte';
import type { Kind } from '../lib/kind';
import type { Antwort, Notizen } from '../lib/speicher';

const ANTWORTEN = Object.entries(entwicklung.antworten) as [Antwort, string][];

/** „Was kann euer Kind schon?“ – die Entwicklungspunkte aus dem gelben Heft zum Ausfüllen vor der U */
export function EntwicklungsListe({
  termin,
  kind,
  notizen,
  onNotizen,
}: {
  termin: UTermin;
  kind: Kind;
  notizen: Notizen;
  onNotizen: (neu: Notizen) => void;
}) {
  const u = termin.untersuchung;
  const punkte = entwicklungsPunkte(u.id);
  if (punkte.length === 0) return null;
  const antworten = notizen.entwicklung[u.id] ?? {};

  function waehlen(punktId: string, antwort: Antwort) {
    onNotizen({ ...notizen, entwicklung: { ...notizen.entwicklung, [u.id]: { ...antworten, [punktId]: antwort } } });
  }

  // Nach Bereich gruppiert, in der Reihenfolge des Hefts
  const bereiche = [...new Set(punkte.map((p) => p.bereich))];

  return (
    <section className="abschnitt">
      <div>
        <h2>{mitName(entwicklung.titel, kind)}</h2>
        <p className="gedaempft klein">{entwicklung.intro.replace('{u}', u.id)}</p>
      </div>
      {bereiche.map((b) => (
        <div key={b} className="entwicklung-bereich">
          <h3 className="entwicklung-bereich-titel">{entwicklung.bereiche[b as EntwicklungsBereich]}</h3>
          {punkte
            .filter((p) => p.bereich === b)
            .map((p) => (
              <fieldset key={p.id} className="entwicklung-punkt">
                <legend>{mitName(p.text, kind)}</legend>
                <div className="entwicklung-wahl">
                  {ANTWORTEN.map(([wert, label]) => (
                    <label key={wert} className={`entwicklung-option ist-${wert}`}>
                      <input
                        type="radio"
                        name={`${u.id}-${p.id}`}
                        value={wert}
                        checked={antworten[p.id] === wert}
                        onChange={() => waehlen(p.id, wert)}
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}
        </div>
      ))}
      <p className="gedaempft klein">{entwicklung.hinweis}</p>
      <a className="quelle-link" href={entwicklung.quelle.url} target="_blank" rel="noreferrer">
        Quelle: {entwicklung.quelle.name}
      </a>
    </section>
  );
}
