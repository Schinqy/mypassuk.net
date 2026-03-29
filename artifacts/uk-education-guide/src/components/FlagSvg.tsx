import type { SVGProps } from "react";

type FlagProps = SVGProps<SVGSVGElement> & { className?: string };

// ─── England — St George's Cross ──────────────────────────────────────────────
export function EnglandFlagSvg({ className, ...props }: FlagProps) {
  return (
    <svg viewBox="0 0 60 40" className={className} xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect width="60" height="40" fill="white" />
      {/* Vertical red band */}
      <rect x="25" y="0" width="10" height="40" fill="#C8102E" />
      {/* Horizontal red band */}
      <rect x="0" y="15" width="60" height="10" fill="#C8102E" />
    </svg>
  );
}

// ─── Scotland — Saltire ────────────────────────────────────────────────────────
export function ScotlandFlagSvg({ className, ...props }: FlagProps) {
  return (
    <svg viewBox="0 0 60 40" className={className} xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect width="60" height="40" fill="#003087" />
      {/* White diagonal bands — Saltire */}
      <line x1="0" y1="0" x2="60" y2="40" stroke="white" strokeWidth="9" strokeLinecap="square" />
      <line x1="60" y1="0" x2="0" y2="40" stroke="white" strokeWidth="9" strokeLinecap="square" />
      {/* Thin blue lines in centre of white band */}
      <line x1="0" y1="0" x2="60" y2="40" stroke="#003087" strokeWidth="3" />
      <line x1="60" y1="0" x2="0" y2="40" stroke="#003087" strokeWidth="3" />
    </svg>
  );
}

// ─── Wales — Dragon Flag ───────────────────────────────────────────────────────
export function WalesFlagSvg({ className, ...props }: FlagProps) {
  return (
    <svg viewBox="0 0 60 40" className={className} xmlns="http://www.w3.org/2000/svg" {...props}>
      {/* White top half */}
      <rect width="60" height="20" fill="white" />
      {/* Green bottom half */}
      <rect y="20" width="60" height="20" fill="#00AB39" />
      {/* Red dragon (Y Ddraig Goch — simplified) */}
      {/* Body */}
      <ellipse cx="30" cy="22" rx="9" ry="6" fill="#C8102E" />
      {/* Neck */}
      <path d="M 36,17 Q 41,12 44,14 Q 46,16 43,19 Q 40,21 37,21 Z" fill="#C8102E" />
      {/* Head */}
      <ellipse cx="45" cy="14" rx="4.5" ry="4" fill="#C8102E" />
      {/* Snout / jaw */}
      <path d="M 48,14 Q 54,11 55,14 Q 54,17 50,16 Z" fill="#C8102E" />
      {/* Eye */}
      <circle cx="44" cy="12" r="1" fill="white" />
      <circle cx="44.2" cy="12" r="0.5" fill="#333" />
      {/* Left wing */}
      <path d="M 26,17 Q 18,9 12,11 Q 16,16 21,17 Z" fill="#C8102E" />
      {/* Right wing */}
      <path d="M 33,16 Q 38,7 43,9 Q 39,14 35,17 Z" fill="#C8102E" />
      {/* Front left leg */}
      <path d="M 23,27 L 19,34 L 21,34 L 22,29 L 25,27 Z" fill="#C8102E" />
      {/* Front right leg */}
      <path d="M 28,28 L 27,35 L 29,35 L 30,28 Z" fill="#C8102E" />
      {/* Back left leg */}
      <path d="M 33,28 L 33,35 L 35,35 L 35,28 Z" fill="#C8102E" />
      {/* Back right leg */}
      <path d="M 37,27 L 41,34 L 39,34 L 37,28 Z" fill="#C8102E" />
      {/* Tail */}
      <path d="M 21,22 Q 14,22 10,26 Q 12,19 18,21 Z" fill="#C8102E" />
      {/* Tail tip / arrow */}
      <path d="M 10,26 Q 7,24 8,28 Q 10,29 12,27 Z" fill="#C8102E" />
    </svg>
  );
}

// ─── Northern Ireland — Union Jack ─────────────────────────────────────────────
// Proper Union Jack: blue base + white Saltire (Scotland) + red Saltire (Ireland, counter-changed) + white cross (England frame) + red cross (England)
export function NIFlagSvg({ className, ...props }: FlagProps) {
  return (
    <svg viewBox="0 0 60 30" className={className} xmlns="http://www.w3.org/2000/svg" {...props}>
      {/* Navy blue base */}
      <rect width="60" height="30" fill="#012169" />

      {/* St Andrew's white Saltire (Scotland) — two wide white diagonals */}
      {/* Diagonal top-left → bottom-right */}
      <polygon points="0,0 6,0 60,27 60,30 54,30 0,3" fill="white" />
      {/* Diagonal top-right → bottom-left */}
      <polygon points="54,0 60,0 60,3 6,30 0,30 0,27" fill="white" />

      {/* St Patrick's red Saltire (Ireland) — counter-changed (offset red on white) */}
      {/* Top half: red on upper-left of diagonal 1, lower-right of diagonal 2 */}
      <polygon points="0,0 3,0 60,28.5 60,30 57,30 0,1.5" fill="#C8102E" />
      <polygon points="60,0 60,1.5 3,30 0,30 0,28.5 57,0" fill="#C8102E" />

      {/* St George's Cross white frame */}
      <rect x="24" y="0" width="12" height="30" fill="white" />
      <rect x="0" y="11" width="60" height="8" fill="white" />

      {/* St George's Cross red centre */}
      <rect x="26.4" y="0" width="7.2" height="30" fill="#C8102E" />
      <rect x="0" y="12.6" width="60" height="4.8" fill="#C8102E" />
    </svg>
  );
}

// ─── Dispatcher ───────────────────────────────────────────────────────────────

const FLAG_MAP = {
  england: EnglandFlagSvg,
  scotland: ScotlandFlagSvg,
  wales: WalesFlagSvg,
  "northern-ireland": NIFlagSvg,
} as const;

export type FlagNation = keyof typeof FLAG_MAP;

export function FlagSvg({ nation, className, ...props }: { nation: FlagNation } & FlagProps) {
  const Component = FLAG_MAP[nation];
  return <Component className={className} {...props} />;
}
