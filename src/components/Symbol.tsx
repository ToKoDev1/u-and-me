// Kleine, einheitliche Linien-Symbole (24×24, Farbe über currentColor). Rein dekorativ.
const pfade = {
  schloss: (
    <>
      <rect x="5" y="11" width="14" height="10" rx="2.5" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </>
  ),
  tasche: (
    <>
      <rect x="4" y="8" width="16" height="12" rx="2.5" />
      <path d="M9 8V6.5A2.5 2.5 0 0 1 11.5 4h1A2.5 2.5 0 0 1 15 6.5V8" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </>
  ),
  haken: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  kalender: (
    <>
      <rect x="4" y="5" width="16" height="15" rx="2.5" />
      <path d="M4 10h16M9 3v4M15 3v4" />
    </>
  ),
} as const;

export type SymbolName = keyof typeof pfade;

export function Symbol({ name, className }: { name: SymbolName; className?: string }) {
  return (
    <svg
      className={`symbol ${className ?? ''}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {pfade[name]}
    </svg>
  );
}
