import React, { useMemo, useState } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { useNavigate } from 'react-router-dom';
import { IndiaMapBase } from './IndiaMapBase';
import { IndiaMapPins } from './IndiaMapPins';
import { INDIA_VIEWBOX } from './indiaProjection';
import { STATUS_COLORS, STATUS_LABELS, type MapPin, type PinStatus } from './mapTypes';

interface IndiaAccountabilityMapProps {
  pins: MapPin[];
  /** CSS height of the map surface. Defaults to a full-bleed hero height. */
  height?: string;
  onPinSelect?: (pin: MapPin) => void;
}

const LEGEND_ORDER: PinStatus[] = ['flagged', 'progress', 'resolved', 'neutral'];

/**
 * Full-bleed, pannable/zoomable India map with status-coloured pins — the
 * national "accountability lens" over any JantaX module. Tile-free (offline
 * safe). Click a pin to open its record; the counter and legend float on top.
 */
export function IndiaAccountabilityMap({
  pins,
  height = '78vh',
  onPinSelect,
}: IndiaAccountabilityMapProps) {
  const navigate = useNavigate();
  const [scale, setScale] = useState(1);
  const [hovered, setHovered] = useState<MapPin | null>(null);
  const [selected, setSelected] = useState<MapPin | null>(null);

  const counts = useMemo(() => {
    const c: Record<PinStatus, number> = { flagged: 0, progress: 0, resolved: 0, neutral: 0 };
    for (const p of pins) c[p.status] += 1;
    return c;
  }, [pins]);

  const handleSelect = (pin: MapPin) => {
    setSelected(pin);
    onPinSelect?.(pin);
    if (pin.href) navigate(pin.href);
  };

  const active = hovered ?? selected;

  return (
    <div className="jx-accountability-map" style={{ position: 'relative', height, width: '100%' }}>
      <TransformWrapper
        minScale={1}
        maxScale={8}
        doubleClick={{ mode: 'zoomIn' }}
        onTransform={(_ref, state) => setScale(state.scale)}
      >
        <TransformComponent
          wrapperStyle={{ width: '100%', height: '100%' }}
          contentStyle={{ width: '100%', height: '100%' }}
        >
          <svg
            viewBox={`0 0 ${INDIA_VIEWBOX.width} ${INDIA_VIEWBOX.height}`}
            width="100%"
            height="100%"
            role="img"
            aria-label="Map of India with civic accountability pins"
          >
            <IndiaMapBase />
            <IndiaMapPins
              pins={pins}
              scale={scale}
              activeId={active?.id}
              onHover={setHovered}
              onSelect={handleSelect}
            />
          </svg>
        </TransformComponent>
      </TransformWrapper>

      {/* Counter — audited vs impacted style */}
      <div className="jx-map-counter">
        <span className="jx-map-counter__total">{pins.length}</span>
        <span className="jx-map-counter__label">records tracked</span>
        <span className="jx-map-counter__resolved">{counts.resolved} resolved</span>
      </div>

      {/* Legend */}
      <div className="jx-map-legend">
        {LEGEND_ORDER.map((s) => (
          <span key={s} className="jx-map-legend__item">
            <i style={{ background: STATUS_COLORS[s] }} />
            {STATUS_LABELS[s]} <b>{counts[s]}</b>
          </span>
        ))}
      </div>

      {/* Hover / selection card */}
      {active && (
        <div className="jx-map-card" role="status">
          <span className="jx-map-card__dot" style={{ background: STATUS_COLORS[active.status] }} />
          <div>
            <strong>{active.title}</strong>
            {active.subtitle && <p>{active.subtitle}</p>}
            <span className="jx-map-card__module">{active.module}</span>
          </div>
        </div>
      )}

      <p className="jx-map-attribution">Boundaries: @svg-maps/india (CC-BY-4.0)</p>
    </div>
  );
}
