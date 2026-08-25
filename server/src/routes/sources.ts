import { Router } from 'express';
import type { Request, Response } from 'express';
import { prisma } from '../prisma';

const router = Router();

// GET /api/sources — list all, filter by tier/status
router.get('/sources', async (req: Request, res: Response) => {
  const { tier, status } = req.query as { tier?: string; status?: string };
  const where: any = {};
  if (tier) where.sourceType = { startsWith: tier };
  if (status) where.status = status;
  const sources = await prisma.source.findMany({ where, orderBy: [{ sourceType: 'asc' }, { organization: 'asc' }] });
  res.json({ sources, count: sources.length });
});

// GET /api/sources/:id
router.get('/sources/:id', async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const source = await prisma.source.findUnique({ where: { sourceId: id }, include: { records: { take: 5 } } });
  if (!source) return res.status(404).json({ error: 'Source not found' });
  res.json({ source });
});

export default router;
