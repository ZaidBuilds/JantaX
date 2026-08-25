import { Router } from 'express';
import type { Request, Response } from 'express';
import { prisma } from '../prisma';
import { ModerationStatus } from '@prisma/client';
import { requireRole, type AuthenticatedRequest } from '../middleware/auth';

const router = Router();

router.get('/moderation', requireRole('MODERATOR', 'ADMIN'), async (_req, res: Response) => {
  const pending = await prisma.citizenReport.findMany({
    where: { status: ModerationStatus.PENDING },
    include: { media: true, reviewer: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: 'asc' },
  });

  res.json({ reports: pending });
});

router.patch('/reports/:id/review', requireRole('MODERATOR', 'ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  const id = String(req.params.id);
  const { status, notes } = req.body as {
    status: 'APPROVED' | 'REJECTED' | 'FLAGGED';
    notes?: string;
  };

  const validStatuses = ['APPROVED', 'REJECTED', 'FLAGGED'] as const;

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  const existing = await prisma.citizenReport.findUnique({ where: { id } });

  if (!existing) {
    return res.status(404).json({ error: 'Report not found' });
  }

  if (existing.status !== ModerationStatus.PENDING) {
    return res.status(409).json({ error: 'Report already reviewed' });
  }

  const reviewStatus = status === 'FLAGGED'
    ? ModerationStatus.FLAGGED
    : status === 'APPROVED'
      ? ModerationStatus.APPROVED
      : ModerationStatus.REJECTED;

  const updated = await prisma.citizenReport.update({
    where: { id },
    data: {
      status: reviewStatus,
      reviewerId: req.user!.id,
    },
    include: { media: true },
  });

  await prisma.evidenceMedia.updateMany({
    where: { reportId: id, verificationStatus: ModerationStatus.PENDING },
    data: { verificationStatus: reviewStatus },
  });

  res.json({ report: updated, notes });
});

export default router;
