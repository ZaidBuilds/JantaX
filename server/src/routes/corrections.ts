import { Router } from 'express';
import type { Request, Response } from 'express';
import { prisma } from '../prisma';
import { ModerationStatus } from '@prisma/client';

const router = Router();

// POST /api/corrections — disputed state, audit trail, 72h SLA
router.post('/corrections', async (req: Request, res: Response) => {
  const { pinCode, moduleId, recordId, reason, details } = req.body as {
    pinCode: string; moduleId: string; recordId?: string; reason: string; details: string;
  };
  const code = String(pinCode||'').replace(/\D/g,'');
  if (!/^\d{6}$/.test(code)) return res.status(400).json({ error: 'Valid PIN required' });
  if (!reason || !details) return res.status(400).json({ error: 'reason + details required' });
  if (details.length > 2000) return res.status(400).json({ error: 'details ≤2000 chars' });

  let pin = await prisma.pincode.findUnique({ where: { code } });
  if (!pin) pin = await prisma.pincode.create({ data: { code, state: 'Unknown', district: 'Unknown', region: 'CENTRAL' as const } });

  const report = await prisma.citizenReport.create({
    data: {
      pincodeCode: code,
      moduleId: moduleId || 'correction',
      title: `Correction: ${reason} ${recordId?`(${recordId})`:''}`.slice(0,120),
      description: `[CORRECTION] ${details}\n— disputed. Original preserved. SLA 72h.`,
      status: ModerationStatus.FLAGGED,
    },
    include: { media: true },
  });
  // Never delete original — audit trail kept via FLAGGED status
  res.status(201).json({ correction: report, sla: '72h', message: 'Correction queued — original preserved, review in 72h. See /data-sources methodology.' });
});

// GET /api/corrections — list disputed
router.get('/corrections', async (_req: Request, res: Response) => {
  const list = await prisma.citizenReport.findMany({ where: { status: ModerationStatus.FLAGGED }, orderBy: { createdAt: 'desc' }, take: 50, include: { media: true } });
  res.json({ corrections: list });
});

export default router;
