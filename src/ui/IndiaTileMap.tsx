import { INDIA_STATES, findState, type IndiaState } from '../core/geo/indiaStates';
import { getLang } from '../i18n';

export type TileTone = 'neutral' | 'brand' | 'good' | 'warn' | 'bad';

export interface StateTile {
  tone?: TileTone;
  /** Small figure under the label, e.g. a count. */
  value?: number | string;
  /** Spoken after the state name, e.g. "2 projects, 1 delayed". */
  description?: string;
}

interface Props {
  /** Keyed by state name (any common spelling) or code. States not listed show as neutral. */
  data: Record<string, StateTile>;
  selected?: string | null;
  onSelect?: (state: IndiaState) => void;
  legend?: { tone: TileTone; label: string }[];
  /** Accessible name for the whole map. */
  label: string;
}

const COLS = Math.max(...INDIA_STATES.map((s) => s.tile[0]));
const ROWS = Math.max(...INDIA_STATES.map((s) => s.tile[1]));

/**
 * India as a grid of equal tiles, one per state and union territory, placed to follow the country's
 * outline. Equal tiles keep small states (Goa, Sikkim, Delhi) as easy to read and tap as large ones.
 */
export function IndiaTileMap({ data, selected, onSelect, legend, label }: Props) {
  const hindi = getLang() === 'hi';
  const byCode = new Map<string, StateTile>();
  for (const [key, tile] of Object.entries(data)) {
    const st = findState(key);
    if (st) byCode.set(st.code, tile);
  }
  const selectedCode = findState(selected ?? undefined)?.code;

  return (
    <figure className="india-map" aria-label={label}>
      <div className="india-map-grid" style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`, gridTemplateRows: `repeat(${ROWS}, auto)` }}>
        {INDIA_STATES.map((st) => {
          const tile = byCode.get(st.code) ?? {};
          const isSelected = st.code === selectedCode;
          const name = hindi ? st.nameHi : st.name;
          const spoken = [name, tile.description].filter(Boolean).join(', ');
          const content = (
            <>
              <span className="india-map-code" translate="no">{hindi ? st.shortHi : st.code}</span>
              {tile.value !== undefined && tile.value !== 0 && <span className="india-map-value">{tile.value}</span>}
            </>
          );
          const style = { gridColumn: st.tile[0], gridRow: st.tile[1] };
          const cls = `india-map-tile tone-${tile.tone ?? 'neutral'}${isSelected ? ' is-selected' : ''}${st.kind === 'ut' ? ' is-ut' : ''}`;
          return onSelect ? (
            <button key={st.code} type="button" className={cls} style={style} aria-pressed={isSelected} aria-label={spoken} title={spoken} onClick={() => onSelect(st)} translate="no">
              {content}
            </button>
          ) : (
            <div key={st.code} className={cls} style={style} role="img" aria-label={spoken} title={spoken} translate="no">
              {content}
            </div>
          );
        })}
      </div>
      {legend && legend.length > 0 && (
        <figcaption className="india-map-legend">
          {legend.map((l) => (
            <span key={l.tone + l.label} className="india-map-key">
              <span className={`india-map-swatch tone-${l.tone}`} aria-hidden="true" />
              {l.label}
            </span>
          ))}
          <span className="india-map-key">
            <span className="india-map-swatch is-ut" aria-hidden="true" />
            Union territory
          </span>
        </figcaption>
      )}
      <p className="india-map-note">Tiles follow India's outline to help you find a state; they do not show borders.</p>
    </figure>
  );
}
