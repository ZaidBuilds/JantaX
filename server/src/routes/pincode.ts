import { Router } from 'express';
import type { Request, Response } from 'express';
import { prisma } from '../prisma';
import { PincodeRegion, regionForState } from './pinHelpers';
import { requireRole } from '../middleware/auth';

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
    prisma.grievance.count({ where: { pincodeCode: code } }),
    prisma.citizenReport.count({ where: { pincodeCode: code, status: { not: 'PENDING' } } }),
  ]);

  if (!pincode) {
    return res.status(404).json({ error: 'PIN code not found' });
  }

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
