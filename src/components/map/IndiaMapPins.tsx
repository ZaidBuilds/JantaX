import React from 'react';
import { projectToIndiaSvg } from './indiaProjection';
import { STATUS_COLORS, type MapPin } from './mapTypes';

interface IndiaMapPinsProps {
  pins: MapPin[];
  /** Current zoom scale — used to keep pin size constant on screen. */
  scale: number;
  activeId?: string | null;
  onHover?: (pin: MapPin | null) => void;
  onSelect?: (pin: MapPin) => void;
}

/**
 * Draws status-coloured pins on top of the India base map. Radius is divided by
 * the zoom scale so pins stay a constant on-screen size while panning/zooming.
 */
export function IndiaMapPins({ pins, scale, activeId, onHover, onSelect }: IndiaMapPinsProps) {
  const r = 3.4 / scale;
  const rActive = 5.2 / scale;

  return (
    <g className="india-map-pins">
      {pins.map((pin) => {
        const { x, y } = projectToIndiaSvg(pin.lat, pin.lng);
        const isActive = pin.id === activeId;
        return (
          <circle
            key={pin.id}
            cx={x}
            cy={y}
            r={isActive ? rActive : r}
            fill={STATUS_COLORS[pin.status]}
            stroke="#ffffff"
            strokeWidth={(isActive ? 1.4 : 0.8) / scale}
            style={{ cursor: 'pointer', transition: 'r 120ms ease' }}
            onMouseEnter={() => onHover?.(pin)}
            onMouseLeave={() => onHover?.(null)}
            onClick={() => onSelect?.(pin)}
          >
            <title>{`${pin.title} — ${pin.status}`}</title>
          </circle>
        );
      })}
    </g>
  );
}
