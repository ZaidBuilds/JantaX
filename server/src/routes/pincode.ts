import { Router } from 'express';
import type { Request, Response } from 'express';
import { prisma } from '../prisma';
import type { Region } from '@prisma/client';
import { PincodeRegion, regionForState } from './pinHelpers';
import { requireRole } from '../middleware/auth';
import { SOURCES } from '../jobs/sources';

const router = Router();

router.get('/pincode/:code', async (req: Request, res: Response) => {
  const code = String(req.params.code).replace(/\D/g, '');

  if (!/^\d{6}$/.test(code)) {
    return res.status(400).json({ error: 'Invalid PIN code' });
  }

  const [pincode, schoolCount, infraCount, reraCount, hospitalCount, pdsCount, grievanceCount, reportCount] = await Promise.all([
    prisma.pincode.findUnique({ where: { code } }),
    prisma.school.count({ where: { pincodeCode: code } }),
    prisma.infraProject.count({ where: { pincodeCode: code } }),
    prisma.reraProject.count({ where: { pincodeCode: code } }),
    prisma.hospital.count({ where: { pincodeCode: code } }),
    prisma.pdsShop.count({ where: { pincodeCode: code } }),
    prisma.cpgramGrievance.count({ where: { pincodeCode: code } }),
    prisma.citizenReport.count({ where: { pincodeCode: code, status: { not: 'PENDING' } } }),
  ]);

  if (!pincode) {
    return res.status(404).json({ error: 'PIN code not found' });
  }

  const [offices, directory] = await Promise.all([
    prisma.postOffice.findMany({
      where: { pincodeCode: code },
      select: { officeName: true, officeType: true, delivery: true, division: true },
      orderBy: [{ officeType: 'desc' }, { officeName: 'asc' }],
    }),
    prisma.source.findUnique({ where: { sourceId: SOURCES['india-post-pincode-directory'].sourceId }, select: { lastSuccessfulSync: true, lastPublishedDate: true } }),
  ]);

  res.json({
    code: pincode.code,
    state: pincode.state,
    district: pincode.district,
    region: pincode.region,
    areaType: pincode.areaType,
    lat: pincode.lat,
    lng: pincode.lng,
    postOffices: offices,
    // Present when the location came from the India Post directory rather than seed data.
    source: offices.length
      ? {
          name: SOURCES['india-post-pincode-directory'].sourceName,
          organization: SOURCES['india-post-pincode-directory'].organization,
          url: SOURCES['india-post-pincode-directory'].sourceUrl,
          license: SOURCES['india-post-pincode-directory'].license,
          publishedAt: directory?.lastPublishedDate ?? null,
          lastSync: directory?.lastSuccessfulSync?.toISOString() ?? null,
        }
      : null,
    counts: {
      schools: schoolCount,
      infraProjects: infraCount,
      reraProjects: reraCount,
      hospitals: hospitalCount,
      pdsShops: pdsCount,
      grievances: grievanceCount,
      citizenReports: reportCount,
    },
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
    const validRegion = (region as Region) || regionForState(state) || PincodeRegion.CENTRAL;
    pincode = await prisma.pincode.create({
      data: { code, state, district, region: validRegion },
    });
  }

  res.json(pincode);
});

export default router;
