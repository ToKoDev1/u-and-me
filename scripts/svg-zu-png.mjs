// Rendert SVGs mit Microsoft Edge (headless) zu PNGs mit transparentem Hintergrund.
// Aufruf: node scripts/svg-zu-png.mjs <ordner> [hoehe-in-px]
import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';

const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const ordner = resolve(process.argv[2]);
const hoehe = Number(process.argv[3] ?? 800);
const tmp = mkdtempSync(join(tmpdir(), 'svg-png-'));

for (const datei of readdirSync(ordner).filter((d) => d.endsWith('.svg'))) {
  const svg = readFileSync(join(ordner, datei), 'utf8');
  const [, , w, h] = svg.match(/viewBox="([^"]+)"/)[1].split(' ').map(Number);
  const breite = Math.round((hoehe * w) / h);
  const html = join(tmp, datei + '.html');
  writeFileSync(
    html,
    `<!doctype html><style>html,body{margin:0;background:transparent}svg{display:block;width:${breite}px;height:${hoehe}px}</style>${svg}`
  );
  const png = join(ordner, datei.replace(/\.svg$/, '.png'));
  execFileSync(EDGE, [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--default-background-color=00000000',
    `--window-size=${breite},${hoehe}`,
    `--screenshot=${png}`,
    'file:///' + html.replace(/\\/g, '/'),
  ], { stdio: 'ignore' });
  console.log(`${datei} → ${breite}×${hoehe}px`);
}
