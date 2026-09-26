import { monatJahr } from '../lib/alter';

/** „19. Sept. 2026 bis 18. Nov. 2026“ als zwei Kacheln */
export function Datumskacheln({ von, bis }: { von: Date; bis: Date }) {
  const kachel = (d: Date) => (
    <div className="datumskachel">
      <div className="tag">{d.getDate()}.</div>
      <div className="monat">{monatJahr.format(d)}</div>
    </div>
  );
  return (
    <div className="datumskacheln">
      {kachel(von)}
      <span className="gedaempft">bis</span>
      {kachel(bis)}
    </div>
  );
}
