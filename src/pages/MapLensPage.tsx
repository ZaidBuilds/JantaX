import React, { useMemo } from 'react';
import { IndiaAccountabilityMap } from '../components/map/IndiaAccountabilityMap';
import { buildDemoPins } from '../components/map/demoPins';

/**
 * National accountability lens — the "School Thik Karo"-style India map applied
 * across every JantaX module. Full-bleed, offline-safe, status-coloured pins.
 */
export function MapLensPage() {
  const pins = useMemo(() => buildDemoPins(), []);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '1.5rem 1.25rem' }}>
      <header style={{ marginBottom: '1rem' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0 }}>
          National Accountability Lens
        </h1>
        <p style={{ color: 'var(--text-secondary)', margin: '0.35rem 0 0', fontSize: '0.95rem' }}>
          Every tracked civic record across India — coloured by status. Pan, zoom,
          and click a pin to open its module. Tile-free and fully offline.
        </p>
      </header>
      <IndiaAccountabilityMap pins={pins} />
    </div>
  );
}

export default MapLensPage;
