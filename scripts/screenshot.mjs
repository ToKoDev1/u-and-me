// Screenshot der laufenden Dev-App mit Edge (headless) – unabhängig vom Browser-Pane.
// Aufruf: node scripts/screenshot.mjs "<url-pfad-und-query>" <datei.png> [breite] [hoehe] [dunkel]
// Tipp (Git Bash): MSYS_NO_PATHCONV=1 davorsetzen, sonst wird "/" zu einem Windows-Pfad.
// Beispiel: node scripts/screenshot.mjs "/?demo=elefant,2026-04-19,Mila&ansicht=weg" weg.png 375 2400
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';

const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const [pfad = '/', datei = 'screenshot.png', breite = '375', hoehe = '1600', dunkel] = process.argv.slice(2);

execFileSync(EDGE, [
  '--headless=new',
  '--disable-gpu',
  '--hide-scrollbars',
  '--virtual-time-budget=4000', // Seite erst fertig laden lassen (Bilder, Schrift)
  `--window-size=${breite},${hoehe}`,
  ...(dunkel ? ['--force-dark-mode', '--blink-settings=preferredColorScheme=0'] : []),
  `--screenshot=${resolve(datei)}`,
  `http://localhost:5173${pfad}`,
], { stdio: 'ignore' });
console.log(`Gespeichert: ${datei}`);
