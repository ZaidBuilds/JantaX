import type { Project } from '../../types/Project';
import { IndiaTileMap, type StateTile } from '../../../ui/IndiaTileMap';
import { t } from '../../../i18n';

interface StateMapProps {
  selectedState: string;
  onSelectState: (state: string) => void;
  projects: Project[];
}

/** Projects per state on the India tile map; picking a state filters the project list. */
export function StateMap({ selectedState, onSelectState, projects }: StateMapProps) {
  const data: Record<string, StateTile> = {};
  for (const p of projects) {
    const tile = (data[p.state] ??= { value: 0 });
    tile.value = Number(tile.value) + 1;
  }
  for (const [state, tile] of Object.entries(data)) {
    const inState = projects.filter((p) => p.state === state);
    const delayed = inState.filter((p) => p.status === 'Delayed').length;
    const done = inState.every((p) => p.status === 'Completed');
    tile.tone = delayed ? 'warn' : done ? 'good' : 'brand';
    const count = Number(tile.value);
    tile.description = [
      t(count === 1 ? '{n} project' : '{n} projects', { n: count }),
      delayed ? t('{n} delayed', { n: delayed }) : done ? t('all completed') : '',
    ].filter(Boolean).join(', ');
  }

  return (
    <div className="glass-card" style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--s-3)', marginBottom: '1.25rem' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', margin: 0 }}>Projects by state</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '4px 0 0' }}>Pick a state to see only its projects.</p>
        </div>
        {selectedState && (
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => onSelectState('')}>
            Show all states
          </button>
        )}
      </div>
      <IndiaTileMap
        label={t('Projects by state')}
        data={data}
        selected={selectedState}
        onSelect={(st) => onSelectState(st.name === selectedState ? '' : st.name)}
        legend={[
          { tone: 'neutral', label: 'No projects' },
          { tone: 'brand', label: 'Active' },
          { tone: 'good', label: 'Completed' },
          { tone: 'warn', label: 'Has delays' },
        ]}
      />
    </div>
  );
}
