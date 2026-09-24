import React from 'react';
import IndiaMap from '@svg-maps/india';

interface IndiaLocation {
  name: string;
  id: string;
  path: string;
}

interface IndiaMapData {
  label: string;
  viewBox: string;
  locations: IndiaLocation[];
}

const map = IndiaMap as unknown as IndiaMapData;

/**
 * Renders the India state-boundary polygons as an inert base layer.
 * Real boundary geometry (@svg-maps/india, CC-BY-4.0) — no tiles, works offline.
 * Pins are drawn on top by the map wrapper.
 */
export function IndiaMapBase() {
  return (
    <g className="india-map-base">
      {map.locations.map((loc) => (
        <path
          key={loc.id}
          d={loc.path}
          fill="var(--map-land, #eef2f7)"
          stroke="var(--map-border, #c7d0dc)"
          strokeWidth={0.5}
        >
          <title>{loc.name}</title>
        </path>
      ))}
    </g>
  );
}
