import { Router } from 'express';
import type { Request, Response } from 'express';
import { prisma } from '../prisma';
import { ModerationStatus, EvidenceType } from '@prisma/client';

const router = Router();

const VALID_EVIDENCE_TYPES = new Set<EvidenceType>(
  Object.values(EvidenceType) as `${EvidenceType}`[],
);
const MAX_MEDIA = 10;
const MAX_CAPTION = 2000;

function sanitizePin(pinCode: string): string | null {
  const code = String(pinCode).replace(/\D/g, '');
  return /^\d{6}$/.test(code) ? code : null;
}

function ensurePincode(code: string): string {
  return code;
}

router.post('/reports', async (req: Request, res: Response) => {
  const body: any = req.body || {};
  // Compat: accept both pinCode/pincode, moduleId/module, title/category
  const pinRaw = body.pinCode ?? body.pincode ?? body.pin_code ?? '';
  const modRaw = body.moduleId ?? body.module ?? body.module_id ?? '';
  const titleRaw = body.title ?? body.category ?? body.subject ?? '';
  const { description, media, submittedBy } = body as {
    description: string;
    media?: Array<{ type: string; url: string; caption?: string }>;
    submittedBy?: string;
  };
  const pinCode: string = String(pinRaw);
  const moduleId: string = String(modRaw);
  const title: string = String(titleRaw);

  const code = sanitizePin(pinCode);

  if (!code) {
    return res.status(400).json({ error: 'Valid 6-digit pinCode required' });
  }

  if (!moduleId || !title || !description) {
    return res.status(400).json({ error: 'moduleId, title, and description are required' });
  }

  if (description.length > MAX_CAPTION) {
    return res.status(400).json({ error: `Description must be ≤ ${MAX_CAPTION} characters` });
  }

  if (media && media.length > MAX_MEDIA) {
    return res.status(400).json({ error: `Maximum ${MAX_MEDIA} media items allowed` });
  }

  let pin = await prisma.pincode.findUnique({ where: { code } });

  if (!pin) {
    pin = await prisma.pincode.create({
      data: {
        code,
        state: 'Unknown',
        district: 'Unknown',
        region: 'CENTRAL' as const,
      },
    });
  }

  const report = await prisma.citizenReport.create({
    data: {
      pincodeCode: code,
      moduleId,
      title: title.trim(),
      description: description.trim(),
      submittedBy: submittedBy || undefined,
      status: ModerationStatus.PENDING,
      media: {
        create: media
          ? media.slice(0, MAX_MEDIA).map(m => ({
              type: VALID_EVIDENCE_TYPES.has(m.type as EvidenceType)
                ? (m.type as EvidenceType)
                : EvidenceType.PHOTO,
              url: m.url,
              caption: m.caption?.slice(0, MAX_CAPTION),
              verificationStatus: ModerationStatus.PENDING,
            }))
          : undefined,
      },
    },
    include: { media: true },
  });

  res.status(201).json({ report, message: 'Report submitted for moderation' });
});

router.get('/reports/pending-count', async (_req: Request, res: Response) => {
  const count = await prisma.citizenReport.count({ where: { status: ModerationStatus.PENDING } });
  res.json({ count });
});

// List reports filtered by pincode (and optionally module) — compat for api.getReports
router.get('/reports', async (req: Request, res: Response) => {
  const codeRaw = (req.query.pincode as string) || (req.query.pinCode as string) || (req.query.code as string) || '';
  const moduleFilter = (req.query.module as string) || (req.query.moduleId as string) || undefined;
  const code = codeRaw ? sanitizePin(String(codeRaw)) : null;
  const where: any = {};
  if (code) where.pincodeCode = code;
  if (moduleFilter) where.moduleId = moduleFilter;
  const reports = await prisma.citizenReport.findMany({
    where,
    include: { media: true },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });
  res.json({ reports, count: reports.length });
});

router.get('/reports/:id', async (req: Request, res: Response) => {
  const report = await prisma.citizenReport.findUnique({
    where: { id: String(req.params.id) },
    include: { media: true },
  });

  if (!report) {
    return res.status(404).json({ error: 'Report not found' });
  }

  res.json({ report });
});

export { ensurePincode };
export default router;
