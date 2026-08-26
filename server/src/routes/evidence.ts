import { Router } from 'express';
import type { Request, Response } from 'express';
import { prisma } from '../prisma';
import { requireRole } from '../middleware/auth';

// Evidence response types
export interface EvidenceInfo {
  id: string;
  evidenceId: string;
  source: string;
  entityType: string;
  entityId: string;
  description: string;
  evidenceType: string; // From EvidenceTypeEnum
  location: {
    pincode: string;
    state: string;
    district: string;
  } | null;
  media: Array<{
    id: string;
    type: string; // From MediaType
    url: string;
    caption: string | null;
    privacyStatus: string; // From PrivacyStatus
  }>;
  verificationStatus: string; // From VerificationStatus
  confidence: number; // 0-100
  moderationStatus: string; // From ModerationStatus
  privacyStatus: string; // From PrivacyStatus
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
  metadata: Record<string, any>;
  sourceInfo: {
    name: string;
    freshness: string; // ISO timestamp
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
 * Get evidence with filtering, pagination, and sorting
 * Query parameters:
 *   entityType: filter by entity type (optional)
 *   entityId: filter by entity ID (optional)
 *   evidenceType: filter by evidence type (optional)
 *   verificationStatus: filter by verification status (optional)
 *   moderationStatus: filter by moderation status (optional)
 *   minConfidence: minimum confidence score (optional)
 *   maxConfidence: maximum confidence score (optional)
 *   pincode: filter by PIN code (optional)
 *   page: page number (default: 1)
 *   limit: results per page (default: 10)
 *   sortBy: field to sort by (default: createdAt)
 *   sortOrder: asc or desc (default: desc)
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const {
      entityType,
      entityId,
      evidenceType,
      verificationStatus,
      moderationStatus,
      minConfidence,
      maxConfidence,
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
    
    // Validate pagination
    const pageNum = Math.max(1, parseInt(String(page)));
    const limitNum = Math.min(50, Math.max(1, parseInt(String(limit))));
    
    // Validate sort order
    const validSortOrder = ['asc', 'desc'].includes(sortOrder ?? '') ? sortOrder : 'desc';
    
    // Build WHERE clause
    const where: any = {};
    
    if (entityType) {
      where.entityType = entityType;
    }
    
    if (entityId) {
      where.entityId = entityId;
    }
    
    if (evidenceType) {
      where.evidenceType = evidenceType;
    }
    
    if (verificationStatus) {
      where.verificationStatus = verificationStatus;
    }
    
    if (moderationStatus) {
      where.moderationStatus = moderationStatus;
    }
    
    if (minConfidence !== undefined && maxConfidence !== undefined) {
      const min = parseFloat(String(minConfidence));
      const max = parseFloat(String(maxConfidence));
      if (!isNaN(min) && !isNaN(max)) {
        where.confidence = { gte: min, lte: max };
      }
    } else if (minConfidence !== undefined) {
      const min = parseFloat(String(minConfidence));
      if (!isNaN(min)) {
        where.confidence = { gte: min };
      }
    } else if (maxConfidence !== undefined) {
      const max = parseFloat(String(maxConfidence));
      if (!isNaN(max)) {
        where.confidence = { lte: max };
      }
    }
    
    if (pincode) {
      const cleanPincode = String(pincode).replace(/\D/g, '');
      if (/^\d{6}$/.test(cleanPincode)) {
        where.pincodeCode = cleanPincode;
      }
    }
    
    // Get evidence with count for pagination
    const [evidence, total] = await Promise.all([
      prisma.evidence.findMany({
        where,
        select: {
          id: true,
          evidenceId: true,
          source: true,
          entityType: true,
          entityId: true,
          description: true,
          evidenceType: true,
          pincodeCode: true,
          pincode: {
            select: {
              code: true,
              state: true,
              district: true
            }
          },
          media: {
            select: {
              id: true,
              type: true,
              url: true,
              caption: true,
              privacyStatus: true
            }
          },
          verificationStatus: true,
          confidence: true,
          moderationStatus: true,
          privacyStatus: true,
          createdAt: true,
          updatedAt: true
        },
        orderBy: {
          [sortBy]: validSortOrder
        },
        skip: (pageNum - 1) * limitNum,
        take: limitNum
      }),
      prisma.evidence.count({ where })
    ]);
    
    // Format response
    const formattedEvidence = evidence.map(ev => ({
      id: ev.id,
      evidenceId: ev.evidenceId,
      source: ev.source,
      entityType: ev.entityType,
      entityId: ev.entityId,
      description: ev.description,
      evidenceType: ev.evidenceType,
      location: ev.pincodeCode ? {
        pincode: ev.pincodeCode,
        state: ev.pincode?.state ?? '',
        district: ev.pincode?.district ?? ''
      } : null,
      media: ev.media?.map(m => ({
        id: m.id,
        type: m.type,
        url: m.url,
        caption: m.caption ?? null,
        privacyStatus: m.privacyStatus
      })) ?? [],
      verificationStatus: ev.verificationStatus,
      confidence: ev.confidence,
      moderationStatus: ev.moderationStatus,
      privacyStatus: ev.privacyStatus,
      createdAt: ev.createdAt.toISOString(),
      updatedAt: ev.updatedAt.toISOString(),
      metadata: {
        entityInfo: ev.entityType + ':',
        hasMedia: ev.media?.length > 0,
        mediaCount: ev.media?.length ?? 0
      },
      sourceInfo: {
        name: ev.source,
        freshness: ev.updatedAt.toISOString(),
        reliability: 'high' // Evidence source reliability would need to be determined
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
        entityId,
        evidenceType,
        evidenceType,
        verificationStatus,
        moderationStatus,
        minConfidence,
        maxConfidence,
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
 * Get a specific evidence by ID
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const evidenceId = String(req.params.id);
    
    const evidence = await prisma.evidence.findUnique({
      where: { id: evidenceId },
      select: {
        id: true,
        evidenceId: true,
        source: true,
        entityType: true,
        entityId: true,
        description: true,
        evidenceType: true,
        pincodeCode: true,
        pincode: {
          select: {
            code: true,
            state: true,
            district: true
          }
        },
        media: {
            select: {
              id: true,
              type: true,
              url: true,
              caption: true,
              privacyStatus: true
            }
          },
          verificationStatus: true,
          confidence: true,
          moderationStatus: true,
          privacyStatus: true,
          createdAt: true,
          updatedAt: true
        }
      }
    });
    
    if (!evidence) {
      return res.status(404).json({ error: 'Evidence not found' });
    }
    
    res.json({
      id: evidence.id,
      evidenceId: evidence.evidenceId,
      source: evidence.source,
      entityType: evidence.entityType,
      entityId: evidence.entityId,
      description: evidence.description,
      evidenceType: evidence.evidenceType,
      location: evidence.pincodeCode ? {
        pincode: evidence.pincodeCode,
        state: evidence.pincode?.state ?? '',
        district: evidence.pincode?.district ?? ''
      } : null,
      media: evidence.media?.map(m => ({
        id: m.id,
        type: m.type,
        url: m.url,
        caption: m.caption ?? null,
        privacyStatus: m.privacyStatus
      })) ?? [],
      verificationStatus: evidence.verificationStatus,
      confidence: evidence.confidence,
      moderationStatus: evidence.moderationStatus,
      privacyStatus: evidence.privacyStatus,
      createdAt: evidence.createdAt.toISOString(),
      updatedAt: evidence.updatedAt.toISOString(),
      metadata: {
        entityInfo: \:\,
        hasMedia: evidence.media?.length > 0,
        mediaCount: evidence.media?.length ?? 0
      },
      sourceInfo: {
        name: evidence.source,
        freshness: evidence.updatedAt.toISOString(),
        reliability: 'high'
      }
    });
  } catch (error) {
    console.error('[evidence/:id] Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/evidence
 * Create new evidence (typically called after media upload)
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      evidenceId,
      source,
      entityType,
      entityId,
      description,
      evidenceType,
      pincodeCode,
      media,
      verificationStatus,
      confidence,
      moderationStatus,
      privacyStatus
    } = req.body as {
      evidenceId?: string;
      source?: string;
      entityType?: string;
      entityId?: string;
      description?: string;
      evidenceType?: string;
      pincodeCode?: string;
      media?: Array<{
        type: string; // From MediaType
        url: string;
        caption?: string;
        privacyStatus?: string; // From PrivacyStatus
      }>;
      verificationStatus?: string; // From VerificationStatus
      confidence?: string; // 0-100
      moderationStatus?: string; // From ModerationStatus
      privacyStatus?: string; // From PrivacyStatus
    };
    
    // Validate required fields
    if (!evidenceId || !source || !entityType || !entityId || !description || !evidenceType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Validate evidenceId uniqueness
    const existing = await prisma.evidence.findUnique({ where: { evidenceId } });
    if (existing) {
      return res.status(409).json({ error: 'Evidence ID already exists' });
    }
    
    // Validate pincode if provided
    if (pincodeCode) {
      const cleanPincode = String(pincodeCode).replace(/\D/g, '');
      if (!/^\d{6}$/.test(cleanPincode)) {
        return res.status(400).json({ error: 'Invalid PIN code format' });
      }
      
      const pincodeExists = await prisma.pincode.findUnique({ where: { code: cleanPincode } });
      if (!pincodeExists) {
        // Auto-create PIN code if it doesn't exist (with unknown state/district)
        await prisma.pincode.create({
          data: {
            code: cleanPincode,
            state: 'Unknown',
            district: 'Unknown',
            region: 'CENTRAL' as const
          }
        });
      }
    }
    
    // Create evidence
    const newEvidence = await prisma.evidence.create({
      data: {
        evidenceId,
        source,
        entityType,
        entityId,
        description,
        evidenceType: evidenceType as any, // Assuming it's a valid EvidenceTypeEnum value
        pincodeCode: pincodeCode ?? undefined,
        media: {
          create: media?.map(m => ({
            type: m.type as any, // Assuming it's a valid MediaType value
            url: m.url,
            caption: m.caption ?? undefined,
            privacyStatus: m.privacyStatus as any // Assuming it's a valid PrivacyStatus value
          })) ?? undefined
        },
        verificationStatus: verificationStatus as any, // Assuming it's a valid VerificationStatus value
        confidence: confidence ? parseFloat(String(confidence)) : 0,
        moderationStatus: moderationStatus as any, // Assuming it's a valid ModerationStatus value
        privacyStatus: privacyStatus as any // Assuming it's a valid PrivacyStatus value
      }
    });
    
    // Update evidence count on related entities if applicable
    // This would be done via triggers or application logic in a real implementation
    
    res.status(201).json({
      evidence: newEvidence,
      message: 'Evidence created successfully'
    });
  } catch (error) {
    console.error('[evidence POST] Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

