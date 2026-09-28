import { Router } from 'express';
import type { Request, Response } from 'express';
import { dal } from '../db/dal';

const router = Router();

function normalizePin(req: Request): string | null {
  const code = String(req.params.code || '').replace(/\D/g, '');
  if (!/^\d{6}$/.test(code)) return null;
  return code;
}

router.get('/pincode/:code/records', async (req: Request, res: Response) => {
  const code = normalizePin(req);
  if (!code) return res.status(400).json({ error: 'Invalid PIN code' });

  const moduleFilter = req.query.module as string | undefined;

  try {
    const records = await dal.getRecordsForPin(code, moduleFilter);
    res.json({
      pincode: code,
      records,
      retrievedAt: new Date().toISOString(),
      provenance: {
        license: 'GODL-India',
        attribution: 'Official Union and State Government Portals (UDISE+, OMMAS, RERA, HMIS, NFSA, DARPG)',
        isSample: false,
      },
    });
  } catch (err: any) {
    console.error('[records:error]', err?.message || err);
    res.status(500).json({ error: 'Failed to retrieve records' });
  }
});

router.get('/records/:module/:id', async (req: Request, res: Response) => {
  const moduleName = String(req.params.module);
  const recordId = String(req.params.id);
  try {
    const record = await dal.getRecordById(moduleName, recordId);
    if (!record) {
      return res.status(404).json({ error: 'Record not found' });
    }
    return res.json({
      module: moduleName,
      record,
      retrievedAt: new Date().toISOString(),
      provenance: {
        license: 'GODL-India',
        attribution: 'Official Union and State Government Portals (UDISE+, OMMAS, RERA, HMIS, NFSA, DARPG)',
        isSample: false,
      },
    });
  } catch (err: any) {
    console.error('[records:id:error]', err?.message || err);
    res.status(500).json({ error: 'Failed to retrieve record' });
  }
});

export default router;
