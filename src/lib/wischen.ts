import { useRef, type TouchEvent } from 'react';

/**
 * Waagerechtes Wischen erkennen (Handy). Nur deutlich waagerechte Bewegungen zählen,
 * damit normales Scrollen nichts auslöst; in Eingabefeldern ist Wischen aus.
 * Gibt die Handler für onTouchStart/onTouchEnd zurück.
 */
export function useWischen(nachLinks: () => void, nachRechts: () => void) {
  const start = useRef<{ x: number; y: number } | null>(null);
  return {
    onTouchStart(e: TouchEvent) {
      const ziel = e.target as HTMLElement;
      start.current = ziel.closest('input, textarea') ? null : { x: e.touches[0].clientX, y: e.touches[0].clientY };
    },
    onTouchEnd(e: TouchEvent) {
      const s = start.current;
      start.current = null;
      if (!s) return;
      const dx = e.changedTouches[0].clientX - s.x;
      const dy = e.changedTouches[0].clientY - s.y;
      if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
      if (dx < 0) nachLinks();
      else nachRechts();
    },
  };
}
