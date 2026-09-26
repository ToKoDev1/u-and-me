// Zerlegt das Gruppenbild der Maskottchen (alle-tiere.svg) in einzelne SVGs.
//
// Idee: Jede Form (<path>) gehört zu genau einem Tier. Wir berechnen für jede
// Form ihren horizontalen Mittelpunkt, sortieren und trennen an den drei
// größten Lücken – so entstehen vier Gruppen von links nach rechts.
//
// Aufruf: node scripts/split-maskottchen.mjs

import { readFileSync, writeFileSync } from 'node:fs';

const DIR = 'public/maskottchen';
const TIERE = ['loewe', 'hund', 'pinguin', 'elefant']; // Reihenfolge im Bild
const RAND = 12; // Abstand um das Tier herum
const KOPF_ANTEIL = 0.45; // Formen mit Mitte in den oberen 45 % der Figur zählen zum Kopf
const AVATAR_LUFT = 1.06; // Kreis-Avatar: 6 % Luft um den Kopf-Kreis

const svg = readFileSync(`${DIR}/alle-tiere.svg`, 'utf8');
const [, , canvasW, canvasH] = svg.match(/viewBox="([^"]+)"/)[1].split(' ').map(Number);

// Alle Formen einlesen und ihre Bounding Box aus den Koordinaten bestimmen.
// (Funktioniert, weil die Datei nur absolute M/L/C-Befehle nutzt.)
const formen = [...svg.matchAll(/<path[^>]*\/>/g)].map(([tag]) => {
  const d = tag.match(/ d="([^"]+)"/)[1];
  const zahlen = d.match(/-?\d+(\.\d+)?/g).map(Number);
  const xs = zahlen.filter((_, i) => i % 2 === 0);
  const ys = zahlen.filter((_, i) => i % 2 === 1);
  const box = { x1: Math.min(...xs), x2: Math.max(...xs), y1: Math.min(...ys), y2: Math.max(...ys) };
  const punkte = xs.map((x, i) => [x, ys[i]]);
  return { tag, box, punkte, mitteX: (box.x1 + box.x2) / 2 };
});

// Hintergrund (Fläche über die ganze Leinwand) aussortieren – die App bringt ihren eigenen mit.
const figuren = formen.filter(({ box }) => !(box.x2 - box.x1 >= canvasW && box.y2 - box.y1 >= canvasH));

// Nach Mittelpunkt sortieren und an den drei größten Lücken trennen.
const sortiert = [...figuren].sort((a, b) => a.mitteX - b.mitteX);
const luecken = sortiert
  .slice(1)
  .map((f, i) => ({ i: i + 1, groesse: f.mitteX - sortiert[i].mitteX }))
  .sort((a, b) => b.groesse - a.groesse)
  .slice(0, TIERE.length - 1)
  .map((l) => l.i)
  .sort((a, b) => a - b);

const gruppen = [0, ...luecken, sortiert.length].slice(0, -1).map((start, n, arr) =>
  sortiert.slice(start, [...luecken, sortiert.length][n])
);

const svgDatei = (viewBox, pfade) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">\n${pfade.join('\n')}\n</svg>\n`;

gruppen.forEach((gruppe, n) => {
  // Ursprüngliche Reihenfolge beibehalten, damit die Ebenen (vorne/hinten) stimmen.
  const pfade = figuren.filter((f) => gruppe.includes(f)).map((f) => f.tag);
  const x1 = Math.min(...gruppe.map((f) => f.box.x1)) - RAND;
  const x2 = Math.max(...gruppe.map((f) => f.box.x2)) + RAND;
  const y1 = Math.min(...gruppe.map((f) => f.box.y1)) - RAND;
  const y2 = Math.max(...gruppe.map((f) => f.box.y2)) + RAND;
  const r = (v) => Math.round(v);

  // Ganzkörper
  writeFileSync(`${DIR}/${TIERE[n]}.svg`, svgDatei(`${r(x1)} ${r(y1)} ${r(x2 - x1)} ${r(y2 - y1)}`, pfade));

  // Avatar: Kopf erkennen und einen Kreis drumherum legen, der nichts abschneidet.
  // 1. Kopfformen = Formen, deren Mitte im oberen Teil der Figur liegt (Augen, Ohren, Mähne …).
  //    Ihre Unterkante markiert den „Hals“.
  // 2. Alle Punkte aller Formen oberhalb des Halses gehören zum Kopf – so wird auch der
  //    Pinguin richtig erkannt, bei dem Kopf und Körper eine einzige Form sind.
  // 3. Kreis um die Mitte dieser Punkte, Radius = weitester Punkt.
  const kopfformen = gruppe.filter((f) => (f.box.y1 + f.box.y2) / 2 < y1 + (y2 - y1) * KOPF_ANTEIL);
  const hals = Math.max(...kopfformen.map((f) => f.box.y2));
  const kopfpunkte = gruppe.flatMap((f) => f.punkte).filter(([, y]) => y <= hals);
  const kxs = kopfpunkte.map(([x]) => x);
  const kys = kopfpunkte.map(([, y]) => y);
  const mx = (Math.min(...kxs) + Math.max(...kxs)) / 2;
  const my = (Math.min(...kys) + Math.max(...kys)) / 2;
  const radius = Math.max(...kopfpunkte.map(([x, y]) => Math.hypot(x - mx, y - my)));
  const seite = 2 * radius * AVATAR_LUFT;
  writeFileSync(
    `${DIR}/${TIERE[n]}-avatar.svg`,
    svgDatei(`${r(mx - seite / 2)} ${r(my - seite / 2)} ${r(seite)} ${r(seite)}`, pfade)
  );

  console.log(`${TIERE[n]}: ${pfade.length} Formen`);
});
