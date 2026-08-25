import { Router } from 'express';
import type { Request, Response } from 'express';
import { prisma } from '../prisma';

const router = Router();

// Simple asyncHandler wrapper
const asyncHandler = (fn: any) => (req: Request, res: Response, next: any) => Promise.resolve(fn(req, res, next)).catch(next);

// Zod-lite validation for query
function validateSchoolsQuery(q: any) {
  const query = String(q.query || '').slice(0, 100);
  const district = String(q.district || '').slice(0, 50);
  const pincode = String(q.pincode || q.pin || '').replace(/\D/g,'').slice(0,6);
  const page = Math.max(1, parseInt(String(q.page||'1')) || 1);
  const limit = Math.min(50, Math.max(5, parseInt(String(q.limit||'10')) || 10));
  return { query, district, pincode, page, limit };
}

// GET /api/v1/schools?query=&district=&pincode=&page=&limit=
router.get('/schools', asyncHandler(async (req: Request, res: Response) => {
  const { query, district, pincode, page, limit } = validateSchoolsQuery(req.query);
  const where: any = {};
  if (pincode && /^\d{6}$/.test(pincode)) where.pincodeCode = pincode;
  if (district) where.pincode = { district: { contains: district, mode: 'insensitive' } };
  // For query across name / udiseCode, we need OR
  if (query) {
    where.OR = [
      { nameEnglish: { contains: query, mode: 'insensitive' } },
      { nameHindi: { contains: query } },
      { udiseCode: { contains: query } },
    ];
  }
  // If pincode filter via relation, need to handle differently
  const schools = await prisma.school.findMany({
    where: query || district ? where : (pincode ? { pincodeCode: pincode } : {}),
    orderBy: { groundTruthScore: 'desc' },
    skip: (page-1)*limit,
    take: limit,
    include: { pincode: true },
  });
  const total = await prisma.school.count({ where: query || district ? where : (pincode ? { pincodeCode: pincode } : {}) });
  res.json({
    data: schools.map(s=>({
      id: s.id,
      udiseCode: s.udiseCode,
      nameEn: s.nameEnglish,
      nameHi: s.nameHindi,
      level: s.level,
      managementType: s.managementType,
      district: (s as any).pincode?.district || '',
      pincode: s.pincodeCode,
      groundTruthScore: s.groundTruthScore,
      updatedAt: s.updatedAt,
      source: 'UDISE+ 2023-24',
      scoringVersion: 'v1.0-2026-08',
    })),
    pagination: { page, limit, total, totalPages: Math.ceil(total/limit) },
    provenance: { source: 'UDISE+ 2023-24', recalcAt: new Date().toISOString().slice(0,10), scoringVersion: 'v1.0-2026-08' },
  });
}));

// GET /api/v1/schools/:udiseCode
router.get('/schools/:udiseCode', asyncHandler(async (req: Request, res: Response) => {
  const code = String(req.params.udiseCode).trim();
  const school = await prisma.school.findUnique({ where: { udiseCode: code }, include: { pincode: true } });
  if (!school) return res.status(404).json({ error: 'School not found' });
  res.json({ data: school });
}));

// GET /api/v1/schools/:udiseCode/observations (mock)
router.get('/schools/:udiseCode/observations', asyncHandler(async (req: Request, res: Response) => {
  const code = String(req.params.udiseCode);
  const school = await prisma.school.findUnique({ where: { udiseCode: code } });
  if (!school) return res.status(404).json({ error: 'School not found' });
  // Mock observations derived from school metrics
  const obs = [
    { id: 'obs-1', schoolId: school.id, observedAt: new Date().toISOString().slice(0,10), teacherPresent: 'yes', toiletUsable: school.hasToilet?'yes':'no', mdmServed: 'yes', learningMaterials: 'yes', classroomReady: school.hasElectricity?'yes':'no', verificationStatus: 'APPROVED', distinctContributors: 3 },
  ];
  res.json({ data: obs, meta: { sampleSize: 12, reportingDays: 4, agreementRate: 0.68, confidence: 'building' } });
}));

export default router;
