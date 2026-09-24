// Projects geographic lat/lng into the @svg-maps/india viewBox coordinate space
// (viewBox "0 0 612 696"). The svg-map is a stylised drawing, not a true
// equirectangular projection, so we use a linear affine transform calibrated
// against four well-known anchor cities. Good enough for a national overview;
// street-level precision uses the Leaflet drill-down instead.

export const INDIA_VIEWBOX = { width: 612, height: 696 } as const;

// Calibration anchors: [lng, lat] -> [x, y] in viewBox pixels.
// Tuned so Delhi / Mumbai / Kolkata / Chennai land on their drawn positions.
// x = A * lng + B ; y = C * lat + D
const A = 18.4;
const B = -1205;
const C = -20.28;
const D = 785;

export interface ProjectedPoint {
  x: number;
  y: number;
}

/** Convert geographic coordinates to SVG viewBox coordinates. */
export function projectToIndiaSvg(lat: number, lng: number): ProjectedPoint {
  return {
    x: A * lng + B,
    y: C * lat + D,
  };
}

/** True when a projected point falls inside the drawn map bounds. */
export function isInsideIndiaSvg(p: ProjectedPoint): boolean {
  return p.x >= 0 && p.x <= INDIA_VIEWBOX.width && p.y >= 0 && p.y <= INDIA_VIEWBOX.height;
}
