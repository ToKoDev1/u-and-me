import { maskottchenBild, type MaskottchenId } from '../lib/inhalte';

type Props = { tier: MaskottchenId; groesse: 32 | 40 | 48 | 52 | 72 | 112; style?: React.CSSProperties };

/** Runder Maskottchen-Avatar auf Akzentfläche mit Umriss – rein dekorativ */
export function Avatar({ tier, groesse, style }: Props) {
  return (
    <span
      className={`avatar avatar-${groesse}`}
      style={{ backgroundImage: `url(${maskottchenBild(tier, true)})`, ...style }}
      aria-hidden="true"
    />
  );
}
