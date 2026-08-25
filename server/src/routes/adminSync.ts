import { Router } from 'express';
import type { Request, Response } from 'express';
import { scheduler } from '../jobs/scheduler';
import { prisma } from '../prisma';
import { requireRole } from '../middleware/auth';

const router = Router();

// POST /api/admin/sync/:sourceId — manual trigger (ADMIN only)
router.post('/admin/sync/:sourceId', requireRole('ADMIN'), async (req: Request, res: Response) => {
  const id = String(req.params.sourceId);
  try {
    const obs = await scheduler.run(id);
    res.json({ observability: obs });
  } catch (e:any) {
    res.status(404).json({ error: e.message });
  }
});

// GET /api/admin/sync/status — observability for all sources
router.get('/admin/sync/status', requireRole('ADMIN'), async (_req: Request, res: Response) => {
  const sources = await prisma.source.findMany({ select: { sourceId: true, sourceName: true, lastChecked: true, lastSuccessfulSync: true, status: true, updateFrequency: true, expectedRefreshInterval: true } });
  const now = Date.now();
  const withStale = sources.map(s=>{
    const last = s.lastSuccessfulSync ? new Date(s.lastSuccessfulSync).getTime() : 0;
    const intervalMs = s.expectedRefreshInterval.includes('1h') ? 3600000 : s.expectedRefreshInterval.includes('1d') ? 86400000 : s.expectedRefreshInterval.includes('30d') ? 2592000000 : 31536000000;
    const stale = last && (now - last) > intervalMs*1.5;
    return { ...s, stale, staleWarning: stale ? `Stale • ${Math.floor((now-last)/86400000)}d ago` : null, failureWarning: s.status==='failed' ? 'Source failure — showing last successful' : null };
  });
  res.json({ sources: withStale });
});

// GET /api/admin/sync/runs?sourceId=&limit=10 — RawDocument/ParsedDocument/ValidationResult observability
router.get('/admin/sync/runs', requireRole('ADMIN'), async (req: Request, res: Response) => {
  const sourceId = String(req.query.sourceId || '');
  const where: any = sourceId ? { sourceId } : {};
  const raws = await prisma.rawDocument.findMany({ where, orderBy: { fetchedAt: 'desc' }, take: 10, include: { parsed: { include: { validation: true } } } });
  res.json({ raws });
});

export default router;
