import type { DatasetSpec } from '../spec';
import { GEOGRAPHY } from './geography';
import { SERVICES } from './services';
import { MONEY } from './money';
import { ACCOUNTABILITY } from './accountability';

/** Every catalogued dataset. The India Post directory and CPCB air quality have their own connectors. */
export const CATALOG: DatasetSpec[] = [...GEOGRAPHY, ...SERVICES, ...MONEY, ...ACCOUNTABILITY];

export const SPECS = new Map(CATALOG.map((s) => [s.id, s]));

export function datasetsForModule(module: string): DatasetSpec[] {
  return CATALOG.filter((s) => s.module === module);
}
