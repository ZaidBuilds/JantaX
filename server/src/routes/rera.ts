import { Router } from 'express';
import type { Request, Response } from 'express';
import { prisma } from '../prisma';
import { requireRole } from '../middleware/auth';

// RERA project response types
export interface ReraInfo {
  id: string;
  name: string;
  reraNumber: string;
  promoter: string;
  pincode: string;
  state: string;
  district: string;
  status: string; // PLANNED, ONGOING, DELAYED, COMPLETED, CANCELLED
  delayMonths: number; // months of delay
  plannedPossession: string | null; // ISO date
  actualPossession: string | null; // ISO date
  complaints: number;
  refundsPending: number;
  metadata: Record<string, any>;
  source: {
    name: string;
    freshness: string; // ISO timestamp
    reliability: 'high' | 'medium' | 'low';
  };
}

// RERA response with pagination
export interface ReraResponse {
  rera: ReraInfo[];
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
 * GET /api/rera
 * Get RERA projects with filtering, pagination, and sorting
 * Query parameters:
 *   pincode: filter by PIN code (optional)
 *   promoter: filter by promoter name (optional)
 *   status: filter by project status (optional)
 *   minDelay: minimum delay in months (optional)
 *   maxDelay: maximum delay in months (optional)
 *   hasComplaints: filter by complaint existence (optional)
 *   hasRefunds: filter by refund existence (optional)
 *   page: page number (default: 1)
 *   limit: results per page (default: 10)
 *   sortBy: field to sort by (default: delayMonths)
 *   sortOrder: asc or desc (default: desc)
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const {
      pincode,
      promoter,
      status,
      minDelay,
      maxDelay,
      hasComplaints,
      hasRefunds,
      page = 1,
      limit = 10,
      sortBy = 'delayMonths',
      sortOrder = 'desc'
    } = req.query as {
      pincode?: string;
      promoter?: string;
      status?: string;
      minDelay?: string;
      maxDelay?: string;
      hasComplaints?: string;
      hasRefunds?: string;
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
    
    if (pincode) {
      const cleanPincode = String(pincode).replace(/\D/g, '');
      if (/^\d{6}$/.test(cleanPincode)) {
        where.pincodeCode = cleanPincode;
      }
    }
    
    if (promoter) {
      where.promoter = { contains: promoter, mode: 'insensitive' };
    }
    
    if (status) {
      where.status = status;
    }
    
    if (minDelay !== undefined && maxDelay !== undefined) {
      const min = parseInt(String(minDelay));
      const max = parseInt(String(maxDelay));
      if (!isNaN(min) && !isNaN(max)) {
        where.delayMonths = { gte: min, lte: max };
      }
    } else if (minDelay !== undefined) {
      const min = parseInt(String(minDelay));
      if (!isNaN(min)) {
        where.delayMonths = { gte: min };
      }
    } else if (maxDelay !== undefined) {
      const max = parseInt(String(maxDelay));
      if (!isNaN(max)) {
        where.delayMonths = { lte: max };
      }
    }
    
    if (hasComplaints !== undefined) {
      where.complaints = hasComplaints === 'true' ? { gt: 0 } : { eq: 0 };
    }
    
    if (hasRefunds !== undefined) {
      where.refundsPending = hasRefunds === 'true' ? { gt: 0 } : { eq: 0 };
    }
    
    // Get RERA projects with count for pagination
    const [reraProjects, total] = await Promise.all([
      prisma.reraProject.findMany({
        where,
        select: {
          id: true,
          name: true,
          reraNumber: true,
          promoter: true,
          pincode: {
            select: {
              code: true,
              state: true,
              district: true
            }
          },
          status: true,
          delayMonths: true,
          plannedPossession: true,
          actualPossession: true,
          complaints: true,
          refundsPending: true,
          updatedAt: true
        },
        orderBy: {
          [sortBy]: validSortOrder
        },
        skip: (pageNum - 1) * limitNum,
        take: limitNum
      }),
      prisma.reraProject.count({ where })
    ]);
    
    // Format response
    const formattedRera = reraProjects.map(rera => ({
      id: rera.id,
      name: rera.name,
      reraNumber: rera.reraNumber,
      promoter: rera.promoter,
      pincode: rera.pincode.code,
      state: rera.pincode.state,
      district: rera.pincode.district,
      status: rera.status,
      delayMonths: rera.delayMonths,
      plannedPossession: rera.plannedPossession?.toISOString() ?? null,
      actualPossession: rera.actualPossession?.toISOString() ?? null,
      complaints: rera.complaints,
      refundsPending: rera.refundsPending,
      metadata: {
        possessionStatus: rera.actualPossession ? 'Actual' : 'Planned',
        daysDelayApprox: rera.delayMonths * 30 // Approximate days
      },
      source: {
        name: 'RERA',
        freshness: rera.updatedAt.toISOString(),
        reliability: 'high'
      }
    }));
    
    res.json({
      rera: formattedRera,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      },
      filters: {
        pincode,
        promoter,
        status,
        minDelay,
        maxDelay,
        hasComplaints,
        hasRefunds
      }
    });
  } catch (error) {
    console.error('[rera] Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/rera/:id
 * Get a specific RERA project by ID
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const reraId = String(req.params.id);
    
    const rera = await prisma.reraProject.findUnique({
      where: { id: reraId },
      select: {
        id: true,
        name: true,
        reraNumber: true,
        promoter: true,
        pincode: {
          select: {
            code: true,
            state: true,
            district: true
          }
        },
        status: true,
        delayMonths: true,
        plannedPossession: true,
        actualPossession: true,
        complaints: true,
        refundsPending: true,
        updatedAt: true
      }
    });
    
    if (!rera) {
      return res.status(404).json({ error: 'RERA project not found' });
    }
    
    res.json({
      id: rera.id,
      name: rera.name,
      reraNumber: rera.reraNumber,
      promoter: rera.promoter,
      pincode: rera.pincode.code,
      state: rera.pincode.state,
      district: rera.pincode.district,
      status: rera.status,
      delayMonths: rera.delayMonths,
      plannedPossession: rera.plannedPossession?.toISOString() ?? null,
      actualPossession: rera.actualPossession?.toISOString() ?? null,
      complaints: rera.complaints,
      refundsPending: rera.refundsPending,
      metadata: {
        possessionStatus: rera.actualPossession ? 'Actual' : 'Planned',
        daysDelayApprox: rera.delayMonths * 30 // Approximate days
      },
      source: {
        name: 'RERA',
        freshness: rera.updatedAt.toISOString(),
        reliability: 'high'
      }
    });
  } catch (error) {
    console.error('[rera/:id] Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

