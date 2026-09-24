import { Router } from 'express';
import type { Request, Response } from 'express';
import { prisma } from '../prisma';
import { PincodeRegion, regionForState, ensurePincodeExists } from './pinHelpers';
import { requireRole } from '../middleware/auth';

const router = Router();

router.get('/pincode/:code', async (req: Request, res: Response) => {
  const code = String(req.params.code).replace(/\D/g, '');

  if (!/^\d{6}$/.test(code)) {
    return res.status(400).json({ error: 'Invalid PIN code' });
  }

  let pincode = await prisma.pincode.findUnique({ where: { code } });
  if (!pincode) {
    pincode = await ensurePincodeExists(code);
  }

  if (!pincode) {
    return res.status(404).json({ error: 'PIN code not found' });
  }

  const where = { pincodeCode: code };
  const newest = { orderBy: { updatedAt: 'desc' } as const, select: { updatedAt: true } };

  const [schoolCount, infraCount, reraCount, hospitalCount, pdsCount, grievanceCount, reportCount] = await Promise.all([
    prisma.school.count({ where }),
    prisma.infraProject.count({ where }),
    prisma.reraProject.count({ where }),
    prisma.hospital.count({ where }),
    prisma.pdsShop.count({ where }),
    prisma.cpgramGrievance.count({ where }),
    prisma.citizenReport.count({ where: { ...where, status: { not: 'PENDING' } } }),
  ]);

  // Rule 40: how many of those rows are fixtures. The UI must badge any
  // domain where sampleCounts > 0 as "Sample data".
  const sample = { ...where, isSample: true };
  const [schoolSample, infraSample, reraSample, hospitalSample, pdsSample, grievanceSample, reportSample] = await Promise.all([
    prisma.school.count({ where: sample }),
    prisma.infraProject.count({ where: sample }),
    prisma.reraProject.count({ where: sample }),
    prisma.hospital.count({ where: sample }),
    prisma.pdsShop.count({ where: sample }),
    prisma.cpgramGrievance.count({ where: sample }),
    prisma.citizenReport.count({ where: { ...sample, status: { not: 'PENDING' } } }),
  ]);

  // Freshness is part of the data — a stale record must never look current.
  const [school, infra, rera, hospital, pds, grievance] = await Promise.all([
    prisma.school.findFirst({ where, ...newest }),
    prisma.infraProject.findFirst({ where, ...newest }),
    prisma.reraProject.findFirst({ where, ...newest }),
    prisma.hospital.findFirst({ where, ...newest }),
    prisma.pdsShop.findFirst({ where, ...newest }),
    prisma.cpgramGrievance.findFirst({ where, ...newest }),
  ]);

  res.json({
    code: pincode.code,
    state: pincode.state,
    district: pincode.district,
    region: pincode.region,
    areaType: pincode.areaType,
    lat: pincode.lat,
    lng: pincode.lng,
    counts: {
      schools: schoolCount,
      infraProjects: infraCount,
      reraProjects: reraCount,
      hospitals: hospitalCount,
      pdsShops: pdsCount,
      grievances: grievanceCount,
      citizenReports: reportCount,
    },
    sampleCounts: {
      schools: schoolSample,
      infraProjects: infraSample,
      reraProjects: reraSample,
      hospitals: hospitalSample,
      pdsShops: pdsSample,
      grievances: grievanceSample,
      citizenReports: reportSample,
    },
    // Most recent update per domain. `null` means no record exists for this
    // PIN — the UI must render "no public record", never a zero.
    lastUpdated: {
      schools: school?.updatedAt ?? null,
      infraProjects: infra?.updatedAt ?? null,
      reraProjects: rera?.updatedAt ?? null,
      hospitals: hospital?.updatedAt ?? null,
      pdsShops: pds?.updatedAt ?? null,
      grievances: grievance?.updatedAt ?? null,
    },
    retrievedAt: new Date().toISOString(),
  });
});

router.get('/admin/pincode/:code', requireRole('ADMIN'), async (req: Request, res: Response) => {
  const code = String(req.params.code).replace(/\D/g, '');

  if (!/^\d{6}$/.test(code)) {
    return res.status(400).json({ error: 'Invalid PIN code — must be 6 digits' });
  }

  let pincode = await prisma.pincode.findUnique({ where: { code } });

  if (!pincode) {
    // Admin-only creation with explicit state/district required
    const { state, district, region } = req.query as { state?: string; district?: string; region?: string };
    if (!state || !district) {
      return res.status(400).json({ error: 'state & district required to create new PIN (admin)' });
    }
    const validRegion = (region as PincodeRegion) || regionForState(state) || PincodeRegion.CENTRAL;
    pincode = await prisma.pincode.create({
      data: { code, state, district, region: validRegion },
    });
  }

  res.json(pincode);
});

export default router;
