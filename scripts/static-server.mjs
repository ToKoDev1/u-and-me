// Minimaler Webserver für den Ordner public/ – nur für Vorschauen,
// bis das Vite-Projekt steht. Aufruf: node scripts/static-server.mjs
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const ROOT = 'public';
const PORT = 5180;
const TYPES = { '.html': 'text/html; charset=utf-8', '.svg': 'image/svg+xml', '.css': 'text/css', '.js': 'text/javascript' };

createServer(async (req, res) => {
  const pfad = normalize(decodeURIComponent(req.url.split('?')[0])).replace(/^(\.\.[\\/])+/, '');
  try {
    const inhalt = await readFile(join(ROOT, pfad));
    res.writeHead(200, { 'Content-Type': TYPES[extname(pfad)] ?? 'application/octet-stream' });
    res.end(inhalt);
  } catch {
    res.writeHead(404).end('Nicht gefunden');
  }
}).listen(PORT, () => console.log(`Vorschau: http://localhost:${PORT}/`));
