import { Router } from 'express';
import type { Request, Response } from 'express';
import { prisma } from '../prisma';
import { ModerationStatus, EvidenceType } from '@prisma/client';

// Report response types
export interface ReportInfo {
  id: string;
  pincode: string;
  moduleId: string;
  title: string;
  description: string;
  status: string; // From ModerationStatus
  submittedBy: string | null;
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
  media: Array<{
    id: string;
    type: string; // From EvidenceType
    url: string;
    caption: string | null;
    verificationStatus: string; // From ModerationStatus
  }>;
  metadata: Record<string, any>;
  source: {
    name: string;
    freshness: string; // ISO timestamp
    reliability: 'high' | 'medium' | 'low';
  };
}

// Reports response with pagination
export interface ReportsResponse {
  reports: ReportInfo[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: Record<string, any>;
}

const router = Router();

const VALID_EVIDENCE_TYPES = new Set<EvidenceType>(
  Object.values(EvidenceType) as EvidenceType[],
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

/**
 * POST /api/reports
 * Submit a new report for moderation
 */
router.post('/reports', async (req: Request, res: Response) => {
  try {
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
      return res.status(400).json({ error: 'Description must be ≤ ' + MAX_CAPTION + ' characters' });
    }

    if (media && media.length > MAX_MEDIA) {
      return res.status(400).json({ error: 'Maximum ' + MAX_MEDIA + ' media items allowed' });
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

    res.status(201).json({ 
      report: {
        id: report.id,
        pincode: report.pincodeCode,
        moduleId: report.moduleId,
        title: report.title,
        description: report.description,
        status: report.status,
        submittedBy: report.submittedBy,
        createdAt: report.createdAt.toISOString(),
        updatedAt: report.updatedAt.toISOString(),
        media: report.media?.map(m => ({
          id: m.id,
          type: m.type,
          url: m.url,
          caption: m.caption,
          verificationStatus: m.verificationStatus
        })) ?? [],
        metadata: {
          mediaCount: report.media?.length ?? 0,
          daysSinceCreation: Math.floor((Date.now() - report.createdAt.getTime()) / (1000 * 60 * 60 * 24))
        },
        source: {
          name: 'JantaX Citizen Reports',
          freshness: report.updatedAt.toISOString(),
          reliability: 'medium' // Citizen reports start as medium reliability until verified
        }
      },
      message: 'Report submitted for moderation'
    });
  } catch (error) {
    console.error('[reports POST] Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/reports/pending-count
 * Get count of pending reports (for moderation dashboard)
 */
router.get('/reports/pending-count', async (_req: Request, res: Response) => {
  try {
    const count = await prisma.citizenReport.count({ where: { status: ModerationStatus.PENDING } });
    res.json({ count });
  } catch (error) {
    console.error('[reports/pending-count] Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/reports
 * List reports with filtering, pagination, and sorting
 * Query parameters:
 *   pincode: filter by PIN code (optional)
 *   moduleId: filter by module ID (optional)
 *   status: filter by moderation status (optional)
 *   submittedBy: filter by submitter (optional)
 *   page: page number (default: 1)
 *   limit: results per page (default: 10)
 *   sortBy: field to sort by (default: createdAt)
 *   sortOrder: asc or desc (default: desc)
 */
router.get('/reports', async (req: Request, res: Response) => {
  try {
    const codeRaw = (req.query.pincode as string) || (req.query.pinCode as string) || (req.query.code as string) || '';
    const moduleFilter = (req.query.module as string) || (req.query.moduleId as string) || undefined;
    const statusFilter = (req.query.status as string) || undefined;
    const submittedByFilter = (req.query.submittedBy as string) || undefined;
    const page = parseInt(String(req.query.page || '1'));
    const limit = parseInt(String(req.query.limit || '10'));
    const sortBy = (req.query.sortBy as string) || 'createdAt';
    const sortOrder = (req.query.sortOrder as string) || 'desc';
    
    const code = codeRaw ? sanitizePin(String(codeRaw)) : null;
    
    // Validate pagination
    const pageNum = Math.max(1, page);
    const limitNum = Math.min(50, Math.max(1, limit));
    
    // Validate sort order
    const validSortOrder = ['asc', 'desc'].includes(sortOrder) ? sortOrder : 'desc';
    
    // Build WHERE clause
    const where: any = {};
    
    if (code) {
      where.pincodeCode = code;
    }
    
    if (moduleFilter) {
      where.moduleId = moduleFilter;
    }
    
    if (statusFilter) {
      where.status = statusFilter as ModerationStatus;
    }
    
    if (submittedByFilter) {
      where.submittedBy = submittedByFilter;
    }
    
    // Get reports with count for pagination
    const [reports, total] = await Promise.all([
      prisma.citizenReport.findMany({
        where,
        select: {
          id: true,
          pincodeCode: true,
          moduleId: true,
          title: true,
          description: true,
          status: true,
          submittedBy: true,
          createdAt: true,
          updatedAt: true,
          media: {
            select: {
              id: true,
              type: true,
              url: true,
              caption: true,
              verificationStatus: true
            }
          }
        },
        orderBy: {
          [sortBy]: validSortOrder
        },
        skip: (pageNum - 1) * limitNum,
        take: limitNum
      }),
      prisma.citizenReport.count({ where })
    ]);
    
    // Format response
    const formattedReports = reports.map(report => ({
      id: report.id,
      pincode: report.pincodeCode,
      moduleId: report.moduleId,
      title: report.title,
      description: report.description,
      status: report.status,
      submittedBy: report.submittedBy,
      createdAt: report.createdAt.toISOString(),
      updatedAt: report.updatedAt.toISOString(),
      media: report.media?.map(m => ({
        id: m.id,
        type: m.type,
        url: m.url,
        caption: m.caption,
        verificationStatus: m.verificationStatus
      })) ?? [],
      metadata: {
        mediaCount: report.media?.length ?? 0,
        daysSinceCreation: Math.floor((Date.now() - report.createdAt.getTime()) / (1000 * 60 * 60 * 24))
      },
      source: {
        name: 'JantaX Citizen Reports',
        freshness: report.updatedAt.toISOString(),
        reliability: report.status === ModerationStatus.APPROVED ? 'high' : 
                   report.status === ModerationStatus.PENDING ? 'medium' : 'low'
      }
    }));
    
    res.json({
      reports: formattedReports,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      },
      filters: {
        pincode: code,
        moduleId: moduleFilter,
        status: statusFilter,
        submittedBy: submittedByFilter
      }
    });
  } catch (error) {
    console.error('[reports GET] Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/reports/:id
 * Get a specific report by ID
 */
router.get('/reports/:id', async (req: Request, res: Response) => {
  try {
    const report = await prisma.citizenReport.findUnique({
      where: { id: String(req.params.id) },
      include: { media: true }
    });

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    res.json({ 
      id: report.id,
      pincode: report.pincodeCode,
      moduleId: report.moduleId,
      title: report.title,
      description: report.description,
      status: report.status,
      submittedBy: report.submittedBy,
      createdAt: report.createdAt.toISOString(),
      updatedAt: report.updatedAt.toISOString(),
      media: report.media?.map(m => ({
        id: m.id,
        type: m.type,
        url: m.url,
        caption: m.caption,
        verificationStatus: m.verificationStatus
      })) ?? [],
      metadata: {
        mediaCount: report.media?.length ?? 0,
        daysSinceCreation: Math.floor((Date.now() - report.createdAt.getTime()) / (1000 * 60 * 60 * 24))
      },
      source: {
        name: 'JantaX Citizen Reports',
        freshness: report.updatedAt.toISOString(),
        reliability: report.status === ModerationStatus.APPROVED ? 'high' : 
                   report.status === ModerationStatus.PENDING ? 'medium' : 'low'
      }
    });
  } catch (error) {
    console.error('[reports/:id] Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { ensurePincode };
export default router;

