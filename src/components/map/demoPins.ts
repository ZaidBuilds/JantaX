import { PIN_COORDINATES } from '../../core/utils/pinCoordinates';
import type { MapPin, PinStatus } from './mapTypes';

// Builds a nationally-spread set of accountability pins from REAL district
// coordinates (PIN_COORDINATES). Deterministic — same output every render, so
// the demo looks identical each time. Offline-safe: no backend needed.

const MODULES = ['school', 'hospital', 'infra', 'contractor', 'rera', 'ration'] as const;
const STATUSES: PinStatus[] = ['flagged', 'progress', 'resolved', 'neutral'];

const MODULE_LABEL: Record<string, string> = {
  school: 'School Scorecard',
  hospital: 'Hospital / PHC',
  infra: 'Infra Project',
  contractor: 'Contractor Ledger',
  rera: 'RERA Project',
  ration: 'PDS / Ration',
};

const MODULE_ROUTE: Record<string, string> = {
  school: '/schools',
  hospital: '/module/hospital',
  infra: '/projects',
  contractor: '/contractors',
  rera: '/rera',
  ration: '/module/ration',
};

/** Deterministic pin set spread across real districts and all live modules. */
export function buildDemoPins(): MapPin[] {
  const pins: MapPin[] = [];
  PIN_COORDINATES.forEach((c, i) => {
    // 1–2 pins per district, module + status rotate deterministically by index.
    const count = i % 3 === 0 ? 2 : 1;
    for (let k = 0; k < count; k++) {
      const module = MODULES[(i + k) % MODULES.length];
      const status = STATUSES[(i * 2 + k) % STATUSES.length];
      pins.push({
        id: `${c.prefix}-${module}-${k}`,
        lat: c.lat,
        lng: c.lng,
        status,
        module: MODULE_LABEL[module],
        title: `${MODULE_LABEL[module]} — ${c.district}`,
        subtitle: `${c.district}, ${c.state}`,
        href: MODULE_ROUTE[module],
      });
    }
  });
  return pins;
}
