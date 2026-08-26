import { Router } from 'express';
import type { Request, Response } from 'express';
import { prisma } from '../prisma';
import { requireRole } from '../middleware/auth';

// Infrastructure project response types
export interface InfrastructureInfo {
  id: string;
  titleEnglish: string;
  titleHindi: string;
  department: string;
  ministry: string;
  budget: number; // in Crores
  startDate: string | null; // ISO date
  expectedCompletion: string | null; // ISO date
  status: string; // PLANNED, ONGOING, DELAYED, COMPLETED, CANCELLED
  claimCompletionPct: number; // 0-100
  groundTruthScore: number | null; // 0-100
  responsibleOfficer: string | null;
  evidenceCount: number;
  location: {
    pincode: string;
    state: string;
    district: string;
  };
  metadata: Record<string, any>;
  source: {
    name: string;
    freshness: string; // ISO timestamp
    reliability: 'high' | 'medium' | 'low';
  };
}

// Infrastructure response with pagination
export interface InfrastructureResponse {
  infrastructure: InfrastructureInfo[];
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
 * GET /api/infrastructure
 * Get infrastructure projects with filtering, pagination, and sorting
 * Query parameters:
 *   pincode: filter by PIN code (optional)
 *   department: filter by department (optional)
 *   status: filter by project status (optional)
 *   minBudget: minimum budget in Crores (optional)
 *   maxBudget: maximum budget in Crores (optional)
 *   minCompletion: minimum claim completion % (optional)
 *   maxCompletion: maximum claim completion % (optional)
 *   hasEvidence: filter by evidence availability (optional)
 *   page: page number (default: 1)
 *   limit: results per page (default: 10)
 *   sortBy: field to sort by (default: budget)
 *   sortOrder: asc or desc (default: desc)
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const {
      pincode,
      department,
      status,
      minBudget,
      maxBudget,
      minCompletion,
      maxCompletion,
      hasEvidence,
      page = 1,
      limit = 10,
      sortBy = 'budget',
      sortOrder = 'desc'
    } = req.query as {
      pincode?: string;
      department?: string;
      status?: string;
      minBudget?: string;
      maxBudget?: string;
      minCompletion?: string;
      maxCompletion?: string;
      hasEvidence?: string;
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
    
    if (department) {
      where.department = { contains: department, mode: 'insensitive' };
    }
    
    if (status) {
      where.status = status;
    }
    
    if (minBudget !== undefined && maxBudget !== undefined) {
      const min = parseFloat(String(minBudget));
      const max = parseFloat(String(maxBudget));
      if (!isNaN(min) && !isNaN(max)) {
        where.budget = { gte: min, lte: max };
      }
    } else if (minBudget !== undefined) {
      const min = parseFloat(String(minBudget));
      if (!isNaN(min)) {
        where.budget = { gte: min };
      }
    } else if (maxBudget !== undefined) {
      const max = parseFloat(String(maxBudget));
      if (!isNaN(max)) {
        where.budget = { lte: max };
      }
    }
    
    if (minCompletion !== undefined && maxCompletion !== undefined) {
      const min = parseFloat(String(minCompletion));
      const max = parseFloat(String(maxCompletion));
      if (!isNaN(min) && !isNaN(max)) {
        where.claimCompletionPct = { gte: min, lte: max };
      }
    } else if (minCompletion !== undefined) {
      const min = parseFloat(String(minCompletion));
      if (!isNaN(min)) {
        where.claimCompletionPct = { gte: min };
      }
    } else if (maxCompletion !== undefined) {
      const max = parseFloat(String(maxCompletion));
      if (!isNaN(max)) {
        where.claimCompletionPct = { lte: max };
      }
    }
    
    if (hasEvidence !== undefined) {
      where.evidenceCount = hasEvidence === 'true' ? { gt: 0 } : { eq: 0 };
    }
    
    // Get infrastructure projects with count for pagination
    const [infrastructure, total] = await Promise.all([
      prisma.infraProject.findMany({
        where,
        select: {
          id: true,
          titleEnglish: true,
          titleHindi: true,
          department: true,
          ministry: true,
          budget: true,
          startDate: true,
          expectedCompletion: true,
          status: true,
          claimCompletionPct: true,
          groundTruthScore: true,
          responsibleOfficer: true,
          evidenceCount: true,
          pincode: {
            select: {
              code: true,
              state: true,
              district: true
            }
          },
          updatedAt: true
        },
        orderBy: {
          [sortBy]: validSortOrder
        },
        skip: (pageNum - 1) * limitNum,
        take: limitNum
      }),
      prisma.infraProject.count({ where })
    ]);
    
    // Format response
    const formattedInfrastructure = infrastructure.map(infra => ({
      id: infra.id,
      titleEnglish: infra.titleEnglish,
      titleHindi: infra.titleHindi,
      department: infra.department,
      ministry: infra.ministry,
      budget: Number(infra.budget),
      startDate: infra.startDate?.toISOString() ?? null,
      expectedCompletion: infra.expectedCompletion?.toISOString() ?? null,
      status: infra.status,
      claimCompletionPct: Number(infra.claimCompletionPct),
      groundTruthScore: infra.groundTruthScore ?? null,
      responsibleOfficer: infra.responsibleOfficer,
      evidenceCount: infra.evidenceCount,
      location: infra.pincode ? {
        pincode: infra.pincode.code,
        state: infra.pincode.state,
        district: infra.pincode.district
      } : {
        pincode: '',
        state: '',
        district: ''
      },
      metadata: {
        daysSinceStart: infra.startDate ? 
          Math.floor((Date.now() - infra.startDate.getTime()) / (1000 * 60 * 60 * 24)) : 
          null,
        daysUntilCompletion: infra.expectedCompletion ? 
          Math.floor((infra.expectedCompletion.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 
          null
      },
      source: {
        name: 'MoSPI',
        freshness: infra.updatedAt.toISOString(),
        reliability: 'high'
      }
    }));
    
    res.json({
      infrastructure: formattedInfrastructure,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      },
      filters: {
        pincode,
        department,
        status,
        minBudget,
        maxBudget,
        minCompletion,
        maxCompletion,
        hasEvidence
      }
    });
  } catch (error) {
    console.error('[infrastructure] Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/infrastructure/:id
 * Get a specific infrastructure project by ID
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const infraId = String(req.params.id);
    
    const infra = await prisma.infraProject.findUnique({
      where: { id: infraId },
      select: {
        id: true,
        titleEnglish: true,
        titleHindi: true,
        department: true,
        ministry: true,
        budget: true,
        startDate: true,
        expectedCompletion: true,
        status: true,
        claimCompletionPct: true,
        groundTruthScore: true,
        responsibleOfficer: true,
        evidenceCount: true,
        pincode: {
          select: {
            code: true,
            state: true,
            district: true
          }
        },
        updatedAt: true
      }
    });
    
    if (!infra) {
      return res.status(404).json({ error: 'Infrastructure project not found' });
    }
    
    res.json({
      id: infra.id,
      titleEnglish: infra.titleEnglish,
      titleHindi: infra.titleHindi,
      department: infra.department,
      ministry: infra.ministry,
      budget: Number(infra.budget),
      startDate: infra.startDate?.toISOString() ?? null,
      expectedCompletion: infra.expectedCompletion?.toISOString() ?? null,
      status: infra.status,
      claimCompletionPct: Number(infra.claimCompletionPct),
      groundTruthScore: infra.groundTruthScore ?? null,
      responsibleOfficer: infra.responsibleOfficer,
      evidenceCount: infra.evidenceCount,
      location: infra.pincode ? {
        pincode: infra.pincode.code,
        state: infra.pincode.state,
        district: infra.pincode.district
      } : {
        pincode: '',
        state: '',
        district: ''
      },
      metadata: {
        daysSinceStart: infra.startDate ? 
          Math.floor((Date.now() - infra.startDate.getTime()) / (1000 * 60 * 60 * 24)) : 
          null,
        daysUntilCompletion: infra.expectedCompletion ? 
          Math.floor((infra.expectedCompletion.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 
          null
      },
      source: {
        name: 'MoSPI',
        freshness: infra.updatedAt.toISOString(),
        reliability: 'high'
      }
    });
  } catch (error) {
    console.error('[infrastructure/:id] Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

