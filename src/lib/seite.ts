// Kleine Helfer rund um Seitenwechsel: Titel im Browser-Tab, nach oben scrollen, Fokus.
import { useEffect } from 'react';

/** Setzt den Titel im Browser-Tab, z. B. „Gerade dran · U & Me“ */
export function useSeitentitel(titel?: string) {
  useEffect(() => {
    document.title = titel ? `${titel} · U & Me` : 'U & Me';
  }, [titel]);
}
