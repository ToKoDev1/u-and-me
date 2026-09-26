import tourDaten from '../content/tour.json';
import { maskottchenBild, type MaskottchenId } from '../lib/inhalte';
import { useSeitentitel } from '../lib/seite';
import { Schrittfolge } from './Schrittfolge';

type TourSeite = { bild: 'logo' | MaskottchenId; titel: string; text: string };
const seiten = tourDaten.seiten as TourSeite[];

const bildQuelle = (bild: TourSeite['bild']) =>
  bild === 'logo' ? `${import.meta.env.BASE_URL}icons/elefant-logo.png` : maskottchenBild(bild);

type Props = {
  /** Beschriftung des letzten Knopfs – „Los geht's“ beim ersten Mal, „Zur App“ beim erneuten Ansehen */
  fertigText: string;
  onFertig: () => void;
};

/** Welcome-Tour: ein paar kurze Seiten, die erklären, wie U & Me funktioniert */
export function Willkommen({ fertigText, onFertig }: Props) {
  useSeitentitel('Willkommen');
  return (
    <Schrittfolge
      fertigText={fertigText}
      onFertig={onFertig}
      seiten={seiten.map((s) => ({
        schluessel: s.titel,
        bild: bildQuelle(s.bild),
        bildKlein: s.bild === 'logo',
        titel: s.titel,
        inhalt: <p>{s.text}</p>,
      }))}
    />
  );
}
