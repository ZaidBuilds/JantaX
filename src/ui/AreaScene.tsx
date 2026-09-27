import { getLang } from '../i18n';
/**
 * A drawn neighbourhood for the "Your area" card: a post office with the chosen PIN on its signboard,
 * an India Post pillar box, a CNG auto-rickshaw and a streetlight. The backdrop follows the place
 * (hills, coast, city skyline or fields) so the scene feels like the reader's own area without
 * pretending to be a photo of it. Colours come from --scene-* tokens, so it has a night version in dark mode.
 */

export type Landscape = 'hills' | 'coast' | 'city' | 'plains';

const HILL_STATES = ['himachal', 'uttarakhand', 'jammu', 'kashmir', 'ladakh', 'sikkim', 'arunachal', 'meghalaya', 'mizoram', 'nagaland', 'manipur', 'tripura'];
const COAST_STATES = ['goa', 'kerala', 'puducherry', 'pondicherry', 'lakshadweep', 'andaman', 'daman'];
const METROS = ['delhi', 'mumbai', 'kolkata', 'chennai', 'bengaluru', 'bangalore', 'hyderabad', 'pune', 'ahmedabad', 'gurugram', 'gurgaon', 'gautam buddha nagar', 'noida', 'thane'];

export function landscapeFor(state: string, district: string): Landscape {
  const s = state.toLowerCase();
  const d = district.toLowerCase();
  if (METROS.some((m) => d.includes(m) || s === m)) return 'city';
  if (HILL_STATES.some((h) => s.includes(h))) return 'hills';
  if (COAST_STATES.some((c) => s.includes(c))) return 'coast';
  return 'plains';
}

function Backdrop({ kind }: { kind: Landscape }) {
  switch (kind) {
    case 'hills':
      return (
        <g>
          <polygon points="0,100 46,52 84,80 132,40 184,90 236,50 286,94 330,58 372,86 400,64 400,100" fill="var(--scene-far-2)" />
          <polygon points="132,40 120,52 128,50 134,56 142,50" fill="var(--scene-snow)" />
          <polygon points="236,50 226,60 234,58 240,63 246,58" fill="var(--scene-snow)" />
          <polygon points="0,100 60,74 110,92 170,70 230,96 290,76 350,94 400,80 400,100" fill="var(--scene-far)" />
        </g>
      );
    case 'coast':
      return (
        <g>
          <rect x="0" y="82" width="400" height="18" fill="var(--scene-sea)" />
          <path d="M20 90 q10 -3 20 0 t20 0 M250 88 q10 -3 20 0 t20 0" stroke="var(--scene-lane)" strokeWidth="1.2" fill="none" opacity="0.7" />
          <path d="M372 100 C370 88 366 78 360 70" stroke="var(--scene-trunk)" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M360 70 q-14 -4 -22 4 M360 70 q-4 -12 -16 -14 M360 70 q8 -12 20 -10 M360 70 q14 -2 20 8" stroke="var(--scene-leaf)" strokeWidth="3.2" fill="none" strokeLinecap="round" />
        </g>
      );
    case 'city':
      return (
        <g fill="var(--scene-far)">
          <rect x="190" y="46" width="22" height="54" />
          <rect x="214" y="60" width="18" height="40" />
          <rect x="236" y="36" width="26" height="64" />
          <rect x="266" y="56" width="20" height="44" />
          <rect x="300" y="44" width="24" height="56" />
          <rect x="328" y="64" width="18" height="36" />
          <rect x="350" y="50" width="22" height="50" />
          <rect x="376" y="68" width="24" height="32" />
          <g fill="var(--scene-far-2)">
            <rect x="242" y="44" width="4" height="4" />
            <rect x="252" y="44" width="4" height="4" />
            <rect x="242" y="56" width="4" height="4" />
            <rect x="306" y="52" width="4" height="4" />
            <rect x="314" y="64" width="4" height="4" />
            <rect x="356" y="58" width="4" height="4" />
          </g>
        </g>
      );
    default:
      return (
        <g>
          <path d="M0 100 Q100 84 200 94 T400 90 V100 Z" fill="var(--scene-far)" />
          {/* Overhead water tank, the landmark of every Indian village and town */}
          <g transform="translate(334 52)">
            <rect x="2" y="0" width="30" height="16" rx="3" fill="var(--scene-far-2)" />
            <path d="M6 16 L2 46 M28 16 L32 46 M17 16 V46 M4 30 H30" stroke="var(--scene-far-2)" strokeWidth="2" />
          </g>
          <circle cx="176" cy="94" r="6" fill="var(--scene-leaf-2)" />
          <circle cx="386" cy="92" r="8" fill="var(--scene-leaf-2)" />
        </g>
      );
  }
}

export function AreaScene({ pin, state, district, className = '' }: { pin: string; state: string; district: string; className?: string }) {
  const kind = landscapeFor(state, district);
  const hindi = getLang() === 'hi';
  return (
    <svg className={`area-scene ${className}`.trim()} viewBox="0 20 400 120" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="scene-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: 'var(--scene-sky-top)' }} />
          <stop offset="1" style={{ stopColor: 'var(--scene-sky-bottom)' }} />
        </linearGradient>
        <radialGradient id="scene-glow">
          <stop offset="0" style={{ stopColor: 'var(--scene-lamp)', stopOpacity: 'var(--scene-glow-opacity)' }} />
          <stop offset="1" style={{ stopColor: 'var(--scene-lamp)', stopOpacity: 0 }} />
        </radialGradient>
      </defs>

      <rect y="20" width="400" height="120" fill="url(#scene-sky)" />
      <circle cx="378" cy="38" r="12" fill="var(--scene-sun)" />
      <Backdrop kind={kind} />

      {/* Footpath and road */}
      <rect x="0" y="100" width="400" height="7" fill="var(--scene-kerb)" />
      <rect x="0" y="107" width="400" height="33" fill="var(--scene-road)" />
      <path d="M8 124 H40 M64 124 H96 M120 124 H152 M176 124 H208 M232 124 H264 M288 124 H320 M344 124 H376" stroke="var(--scene-lane)" strokeWidth="2" />

      {/* Post office */}
      <g>
        <rect x="26" y="60" width="140" height="41" fill="var(--scene-wall)" />
        <rect x="22" y="54" width="148" height="8" rx="1.5" fill="var(--scene-post-red)" />
        <rect x="50" y="64" width="92" height="19" rx="2" fill="var(--scene-post-red)" />
        {hindi ? (
          <text x="96" y="77.5" textAnchor="middle" fontSize="9" fontWeight="700" fill="#fff" fontFamily="var(--font-sans)">डाकघर</text>
        ) : (
          <text x="96" y="76.5" textAnchor="middle" fontSize="7" fontWeight="700" letterSpacing="0.6" fill="#fff" fontFamily="var(--font-sans)">POST OFFICE</text>
        )}
        <rect x="36" y="87" width="16" height="10" rx="1" fill="var(--scene-window)" />
        <rect x="140" y="87" width="16" height="10" rx="1" fill="var(--scene-window)" />
        <path d="M44 87 V97 M148 87 V97" stroke="var(--scene-wall)" strokeWidth="1" />
        <rect x="86" y="86" width="20" height="15" rx="1" fill="var(--scene-door)" />
        <rect x="26" y="99" width="140" height="2" fill="var(--scene-far-2)" opacity="0.6" />
      </g>

      {/* The reader's PIN on a standing sign */}
      <g>
        <rect x="197" y="84" width="2" height="17" fill="var(--scene-pole)" />
        <rect x="176" y="68" width="44" height="18" rx="2.5" fill="var(--surface)" stroke="var(--scene-pole)" strokeWidth="1" />
        <text x="198" y="75" textAnchor="middle" fontSize="4.8" fontWeight="600" letterSpacing="0.8" fill="var(--ink-3)" fontFamily="var(--font-sans)">{hindi ? 'पिन' : 'PIN'}</text>
        <text x="198" y="83" textAnchor="middle" fontSize="8" fontWeight="700" fill="var(--brand-ink)" fontFamily="var(--font-display)" style={{ fontVariantNumeric: 'tabular-nums' }}>{pin}</text>
      </g>

      {/* India Post pillar box */}
      <g>
        <rect x="230" y="80" width="14" height="21" rx="2" fill="var(--scene-post-red)" />
        <path d="M229 82 Q237 72 245 82 Z" fill="var(--scene-post-red)" />
        <rect x="233" y="85" width="8" height="1.6" rx="0.8" fill="var(--scene-door)" />
        <rect x="232" y="90" width="10" height="4" rx="0.8" fill="#fff" opacity="0.85" />
        <rect x="228" y="100" width="18" height="2" rx="1" fill="var(--scene-door)" />
      </g>

      {/* Streetlight, with a glow at night */}
      <g>
        <circle cx="282" cy="52" r="22" fill="url(#scene-glow)" />
        <rect x="266" y="44" width="2" height="57" fill="var(--scene-pole)" />
        <path d="M267 45 Q270 40 282 44" stroke="var(--scene-pole)" strokeWidth="2" fill="none" />
        <rect x="277" y="44" width="10" height="3" rx="1.5" fill="var(--scene-lamp)" />
      </g>

      {/* Neem tree */}
      <g>
        <rect x="18" y="80" width="3" height="21" fill="var(--scene-trunk)" />
        <circle cx="14" cy="76" r="9" fill="var(--scene-leaf)" />
        <circle cx="24" cy="72" r="10" fill="var(--scene-leaf-2)" />
      </g>
      <g>
        <rect x="303" y="78" width="3" height="23" fill="var(--scene-trunk)" />
        <circle cx="298" cy="74" r="10" fill="var(--scene-leaf)" />
        <circle cx="310" cy="70" r="11" fill="var(--scene-leaf-2)" />
      </g>

      {/* CNG auto-rickshaw, heading left */}
      <g transform="translate(300 104)">
        <path d="M10 2 H52 Q60 2 60 10 V14 H10 Z" fill="var(--scene-auto-yellow)" />
        <path d="M3 22 Q3 12 12 12 H60 V27 H9 Q3 27 3 22 Z" fill="var(--scene-auto-green)" />
        <path d="M10 2 Q4 6 3 16" stroke="var(--scene-auto-yellow)" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        <rect x="22" y="13" width="28" height="8" rx="1.5" fill="var(--scene-auto-dark)" />
        <circle cx="4.5" cy="19" r="1.6" fill="var(--scene-lamp)" />
        <circle cx="14" cy="28" r="4.5" fill="var(--scene-tyre)" />
        <circle cx="14" cy="28" r="1.6" fill="var(--scene-pole)" />
        <circle cx="51" cy="28" r="4.5" fill="var(--scene-tyre)" />
        <circle cx="51" cy="28" r="1.6" fill="var(--scene-pole)" />
      </g>
    </svg>
  );
}
