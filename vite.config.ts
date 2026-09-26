import react from '@vitejs/plugin-react'
import { copyFileSync } from 'node:fs'
import { defineConfig, type Plugin } from 'vite'

/**
 * GitHub Pages kennt unsere Adressen (/naechste-u, /u/U3 …) nicht und liefert dort 404.html aus.
 * Deshalb kopieren wir index.html nach 404.html – dann startet die App trotzdem und der Router
 * zeigt die richtige Seite.
 */
function spaFallback(): Plugin {
  return {
    name: 'spa-404-fallback',
    apply: 'build',
    closeBundle() {
      copyFileSync('dist/index.html', 'dist/404.html')
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  // Veröffentlicht unter https://tokodev1.github.io/u-and-me/ – lokal weiterhin unter /
  base: mode === 'production' ? '/u-and-me/' : '/', // gilt für Build und Vorschau
  plugins: [react(), spaFallback()],
}))
