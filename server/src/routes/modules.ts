import { Router } from 'express';
import type { Request, Response } from 'express';
import { prisma } from '../prisma';

const router = Router();

const asyncHandler =
  (fn: any) => (req: Request, res: Response, next: any) =>
    Promise.resolve(fn(req, res, next)).catch(next);

/**
 * Modules that are genuinely backed by a database table. Every entry here is
 * counted live from Postgres — these numbers are never hardcoded.
 *
 * A module absent from this list has no canonical table yet and must be
 * presented in the UI as demonstration data, never as an official record.
 * See docs/MODULE_EXPANSION_PROTOCOL.md.
 */
const DB_MODULES = [
  { id: 'school', label: 'Schools', source: 'UDISE+', model: 'school' },
  { id: 'infra', label: 'Public Works', source: 'PMGSY / PWD / NHAI', model: 'infraProject' },
  { id: 'rera', label: 'RERA Projects', source: 'State RERA portals', model: 'reraProject' },
  { id: 'hospital', label: 'Health Facilities', source: 'HMIS / NHM', model: 'hospital' },
  { id: 'pds', label: 'Ration Shops', source: 'NFSA / State ePOS', model: 'pdsShop' },
  { id: 'grievance', label: 'Public Grievances', source: 'DARPG CPGRAMS', model: 'cpgramGrievance' },
  { id: 'contractor', label: 'Contractors', source: 'GeM / CPPP', model: 'contractor' },
] as const;

/**
 * GET /api/modules
 *
 * Single source of truth for which modules are live. The UI uses this to
 * decide whether to render a "Live data" or "Demo data" label, so the two
 * can never drift apart.
 *
 * Optional ?pin=NNNNNN scopes the counts to one PIN code.
 */
router.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const pin = String(req.query.pin || '').replace(/\D/g, '').slice(0, 6);
    const where = pin.length === 6 ? { pincodeCode: pin } : undefined;

    const modules = await Promise.all(
      DB_MODULES.map(async (m) => {
        const delegate = (prisma as any)[m.model];
        try {
          const [recordCount, latest] = await Promise.all([
            delegate.count({ where }),
            delegate.findFirst({
              where,
              orderBy: { updatedAt: 'desc' },
              select: { updatedAt: true },
            }),
          ]);

          return {
            id: m.id,
            label: m.label,
            source: m.source,
            dataStatus: 'live' as const,
            recordCount,
            lastUpdated: latest?.updatedAt ?? null,
          };
        } catch {
          // Table unavailable — report it honestly rather than inventing a count.
          return {
            id: m.id,
            label: m.label,
            source: m.source,
            dataStatus: 'unavailable' as const,
            recordCount: null,
            lastUpdated: null,
          };
        }
      })
    );

    res.json({
      scope: pin.length === 6 ? { pincode: pin } : { scope: 'national' },
      retrievedAt: new Date().toISOString(),
      modules,
    });
  })
);

export default router;
