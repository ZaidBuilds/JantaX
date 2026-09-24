import { Router } from 'express';
import type { Request, Response } from 'express';
import { prisma } from '../prisma';
import { ModerationStatus, EvidenceType } from '@prisma/client';

// Evidence response types
export interface EvidenceInfo {
  id: string;
  evidenceId: string;
  source: string;
  entityType: string;
  entityId: string;
  description: string;
  evidenceType: string;
  location: {
    pincode: string;
    state: string;
    district: string;
  } | null;
  media: Array<{
    id: string;
    type: string;
    url: string;
    caption: string | null;
    privacyStatus: string;
  }>;
  verificationStatus: string;
  confidence: number;
  moderationStatus: string;
  privacyStatus: string;
  createdAt: string;
  updatedAt: string;
  metadata: Record<string, any>;
  sourceInfo: {
    name: string;
    freshness: string;
    reliability: 'high' | 'medium' | 'low';
  };
}

// Evidence response with pagination
export interface EvidenceResponse {
  evidence: EvidenceInfo[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: Record<string, any>;
}

const router = Router();

/**
 * GET /api/evidence
 * Get citizen evidence reports backed by CitizenReport & EvidenceMedia
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const {
      entityType,
      moderationStatus,
      pincode,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query as {
      entityType?: string;
      entityId?: string;
      evidenceType?: string;
      verificationStatus?: string;
      moderationStatus?: string;
      minConfidence?: string;
      maxConfidence?: string;
      pincode?: string;
      page?: string;
      limit?: string;
      sortBy?: string;
      sortOrder?: string;
    };
    
    const pageNum = Math.max(1, parseInt(String(page)));
    const limitNum = Math.min(50, Math.max(1, parseInt(String(limit))));
    const validSortOrder = ['asc', 'desc'].includes(sortOrder ?? '') ? (sortOrder as 'asc' | 'desc') : 'desc';
    
    const where: any = {};
    if (entityType) where.moduleId = entityType;
    if (moderationStatus && Object.values(ModerationStatus).includes(moderationStatus as any)) {
      where.status = moderationStatus as ModerationStatus;
    }
    
    if (pincode) {
      const cleanPincode = String(pincode).replace(/\D/g, '');
      if (/^\d{6}$/.test(cleanPincode)) {
        where.pincodeCode = cleanPincode;
      }
    }
    
    const [reports, total] = await Promise.all([
      prisma.citizenReport.findMany({
        where,
        include: {
          pincode: {
            select: {
              code: true,
              state: true,
              district: true
            }
          },
          media: true
        },
        orderBy: {
          createdAt: validSortOrder
        },
        skip: (pageNum - 1) * limitNum,
        take: limitNum
      }),
      prisma.citizenReport.count({ where })
    ]);
    
    const formattedEvidence: EvidenceInfo[] = reports.map((r: any) => ({
      id: r.id,
      evidenceId: r.id,
      source: 'Citizen Ground Report',
      entityType: r.moduleId,
      entityId: r.id,
      description: r.description,
      evidenceType: r.media?.[0]?.type ?? 'PHOTO',
      location: r.pincode ? {
        pincode: r.pincode.code,
        state: r.pincode.state,
        district: r.pincode.district
      } : null,
      media: (r.media || []).map((m: any) => ({
        id: m.id,
        type: m.type,
        url: m.url,
        caption: m.caption ?? null,
        privacyStatus: 'PUBLIC'
      })),
      verificationStatus: r.status,
      confidence: r.status === ModerationStatus.APPROVED ? 90 : 50,
      moderationStatus: r.status,
      privacyStatus: 'ANONYMIZED',
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
      metadata: {
        title: r.title,
        hasMedia: (r.media?.length ?? 0) > 0,
        mediaCount: r.media?.length ?? 0
      },
      sourceInfo: {
        name: 'Citizen Report',
        freshness: r.updatedAt.toISOString(),
        reliability: r.status === ModerationStatus.APPROVED ? 'high' : 'medium'
      }
    }));
    
    res.json({
      evidence: formattedEvidence,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      },
      filters: {
        entityType,
        moderationStatus,
        pincode
      }
    });
  } catch (error) {
    console.error('[evidence] Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/evidence/:id
 * Get specific evidence report by ID
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const evidenceId = String(req.params.id);
    
    const r: any = await prisma.citizenReport.findUnique({
      where: { id: evidenceId },
      include: {
        pincode: {
          select: {
            code: true,
            state: true,
            district: true
          }
        },
        media: true
      }
    });
    
    if (!r) {
      return res.status(404).json({ error: 'Evidence not found' });
    }
    
    const formatted: EvidenceInfo = {
      id: r.id,
      evidenceId: r.id,
      source: 'Citizen Ground Report',
      entityType: r.moduleId,
      entityId: r.id,
      description: r.description,
      evidenceType: r.media?.[0]?.type ?? 'PHOTO',
      location: r.pincode ? {
        pincode: r.pincode.code,
        state: r.pincode.state,
        district: r.pincode.district
      } : null,
      media: (r.media || []).map((m: any) => ({
        id: m.id,
        type: m.type,
        url: m.url,
        caption: m.caption ?? null,
        privacyStatus: 'PUBLIC'
      })),
      verificationStatus: r.status,
      confidence: r.status === ModerationStatus.APPROVED ? 90 : 50,
      moderationStatus: r.status,
      privacyStatus: 'ANONYMIZED',
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
      metadata: {
        title: r.title,
        hasMedia: (r.media?.length ?? 0) > 0,
        mediaCount: r.media?.length ?? 0
      },
      sourceInfo: {
        name: 'Citizen Report',
        freshness: r.updatedAt.toISOString(),
        reliability: r.status === ModerationStatus.APPROVED ? 'high' : 'medium'
      }
    };
    
    res.json(formatted);
  } catch (error) {
    console.error('[evidence/:id] Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/evidence
 * Create new citizen report with evidence media
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      entityType = 'general',
      description,
      pincodeCode,
      title,
      media
    } = req.body as {
      entityType?: string;
      description?: string;
      pincodeCode?: string;
      title?: string;
      media?: Array<{
        type: string;
        url: string;
        caption?: string;
      }>;
    };
    
    if (!description || !pincodeCode) {
      return res.status(400).json({ error: 'description and pincodeCode are required' });
    }
    
    const cleanPincode = String(pincodeCode).replace(/\D/g, '');
    if (!/^\d{6}$/.test(cleanPincode)) {
      return res.status(400).json({ error: 'Invalid PIN code format' });
    }
    
    let pin = await prisma.pincode.findUnique({ where: { code: cleanPincode } });
    if (!pin) {
      pin = await prisma.pincode.create({
        data: {
          code: cleanPincode,
          state: 'Unknown',
          district: 'Unknown',
          region: 'CENTRAL'
        }
      });
    }
    
    const newReport = await prisma.citizenReport.create({
      data: {
        pincodeCode: cleanPincode,
        moduleId: entityType,
        title: title || description.slice(0, 60),
        description,
        status: ModerationStatus.PENDING,
        media: media && media.length > 0 ? {
          create: media.map((m: any) => ({
            type: (Object.values(EvidenceType).includes(m.type as any) ? m.type : EvidenceType.PHOTO) as EvidenceType,
            url: m.url,
            caption: m.caption || null,
            verificationStatus: ModerationStatus.PENDING
          }))
        } : undefined
      },
      include: {
        media: true,
        pincode: true
      }
    });
    
    res.status(201).json({
      evidence: newReport,
      message: 'Evidence created successfully'
    });
  } catch (error) {
    console.error('[evidence POST] Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
