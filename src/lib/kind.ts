// Alles, was sich aus dem Profil über das Kind ableiten lässt.
// Wichtig bei Frühgeborenen: Etappen richten sich nach dem KORRIGIERTEN Alter
// (ab errechnetem Termin), U-Termine nach dem TATSÄCHLICHEN Geburtsdatum.
import { heute, parseDatum } from './alter';
import type { Profil } from './speicher';

export type Kind = {
  /** tatsächliches Geburtsdatum – für U-Termine und Phasen */
  geburt: Date;
  /** Bezugsdatum für die Entwicklung – bei Frühchen der errechnete Termin */
  entwicklungsStart: Date;
  fruehgeboren: boolean;
  jetzt: Date;
  name?: string;
  /** Kennung aus dem Speicher – unterscheidet z. B. Zwillinge im Kalender */
  id?: string;
  /** erledigte U-Untersuchungen: U-Id → Datum ("YYYY-MM-DD") */
  uErledigt: Record<string, string>;
  profil: Profil;
};

export function kindAus(profil: Profil, jetzt = heute(), id?: string, uErledigt: Record<string, string> = {}): Kind {
  const geburt = parseDatum(profil.geburtsdatum);
  const termin = profil.errechneterTermin ? parseDatum(profil.errechneterTermin) : undefined;
  const fruehgeboren = !!termin && termin > geburt;
  return {
    geburt,
    entwicklungsStart: fruehgeboren ? termin : geburt,
    fruehgeboren,
    jetzt,
    name: profil.name,
    id,
    uErledigt,
    profil,
  };
}
