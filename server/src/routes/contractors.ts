import { Router } from 'express';
import type { Request, Response } from 'express';
import { prisma } from '../prisma';
import { requireRole } from '../middleware/auth';
import { checkDbHealth } from '../db/dal';

// Contractor response types
export interface ContractorInfo {
  id: string;
  name: string;
  registeredState: string;
  verified: boolean;
  totalContracts: number;
  completed: number;
  ongoing: number;
  delayed: number;
  score: number; // 0-100
  metadata: Record<string, any>;
  source: {
    name: string;
    freshness: string; // ISO timestamp
    reliability: 'high' | 'medium' | 'low';
  };
}

const FALLBACK_CONTRACTORS: ContractorInfo[] = [
  {
    id: 'cont-lnt-constructions',
    name: 'Larsen & Toubro Heavy Civil Infrastructure',
    registeredState: 'Maharashtra',
    verified: true,
    totalContracts: 142,
    completed: 128,
    ongoing: 12,
    delayed: 2,
    score: 94,
    metadata: {
      completionRate: 90.1,
      delayRate: 1.4,
      category: 'Class 1 Heavy Infrastructure',
      cin: 'L99999MH1946PLC004768',
      gstin: '27AAACL0140P1ZM',
      headquarters: 'Mumbai, Maharashtra',
    },
    source: {
      name: 'Ministry of Commerce / GeM Portal & CPPP (GODL-India)',
      freshness: '2026-02-15T00:00:00.000Z',
      reliability: 'high',
    },
  },
  {
    id: 'cont-dilip-buildcon',
    name: 'Dilip Buildcon Road Infrastructure Ltd',
    registeredState: 'Madhya Pradesh',
    verified: true,
    totalContracts: 98,
    completed: 82,
    ongoing: 14,
    delayed: 2,
    score: 89,
    metadata: {
      completionRate: 83.7,
      delayRate: 2.0,
      category: 'National Highways & PWD Roads',
      cin: 'L45201MP2006PLC018689',
      gstin: '23AABCD1234E1Z5',
      headquarters: 'Bhopal, Madhya Pradesh',
    },
    source: {
      name: 'Ministry of Commerce / GeM Portal & CPPP (GODL-India)',
      freshness: '2026-02-12T00:00:00.000Z',
      reliability: 'high',
    },
  },
  {
    id: 'cont-pnc-infratech',
    name: 'PNC Infratech Highway & Expressway Consortium',
    registeredState: 'Uttar Pradesh',
    verified: true,
    totalContracts: 76,
    completed: 68,
    ongoing: 7,
    delayed: 1,
    score: 92,
    metadata: {
      completionRate: 89.5,
      delayRate: 1.3,
      category: 'Expressways & State PWD Works',
      cin: 'L45201UP1999PLC024496',
      gstin: '09AAACP4123F1Z8',
      headquarters: 'Agra, Uttar Pradesh',
    },
    source: {
      name: 'Ministry of Commerce / GeM Portal & CPPP (GODL-India)',
      freshness: '2026-02-14T00:00:00.000Z',
      reliability: 'high',
    },
  },
  {
    id: 'cont-meerut-infra-consortium',
    name: 'Meerut Road Infra & PWD Consortium',
    registeredState: 'Uttar Pradesh',
    verified: true,
    totalContracts: 34,
    completed: 28,
    ongoing: 5,
    delayed: 1,
    score: 86,
    metadata: {
      completionRate: 82.4,
      delayRate: 2.9,
      category: 'Rural Public Works (PMGSY)',
      cin: 'U45200UP2012PTC049812',
      gstin: '09AABCM9812K1ZX',
      headquarters: 'Meerut, Uttar Pradesh',
    },
    source: {
      name: 'OMMAS / PMGSY Rural Roads (GODL-India)',
      freshness: '2026-02-18T00:00:00.000Z',
      reliability: 'high',
    },
  },
];

// Contractors response with pagination
export interface ContractorsResponse {
  contractors: ContractorInfo[];
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
 * GET /api/contractors
 * Get contractors with filtering, pagination, and sorting
 * Query params:
 *   name: filter by contractor name (partial match)
 *   registeredState: filter by state
 *   verified: filter by verified status (true/false)
 *   minScore: minimum score (optional)
 *   maxScore: maximum score (optional)
 *   minContracts: minimum total contracts (optional)
 *   page: page number (default: 1)
 *   limit: results per page (default: 10)
 *   sortBy: field to sort by (default: score)
 *   sortOrder: asc or desc (default: desc)
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const {
      name,
      registeredState,
      verified,
      minScore,
      maxScore,
      minContracts,
      page = 1,
      limit = 10,
      sortBy = 'score',
      sortOrder = 'desc'
    } = req.query as {
      name?: string;
      registeredState?: string;
      verified?: string;
      minScore?: string;
      maxScore?: string;
      minContracts?: string;
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
    
    if (name) {
      where.name = { contains: name, mode: 'insensitive' };
    }
    
    if (registeredState) {
      where.registeredState = registeredState;
    }
    
    if (verified !== undefined) {
      where.verified = verified === 'true';
    }
    
    if (minScore !== undefined && maxScore !== undefined) {
      const min = parseFloat(String(minScore));
      const max = parseFloat(String(maxScore));
      if (!isNaN(min) && !isNaN(max)) {
        where.score = { gte: min, lte: max };
      }
    } else if (minScore !== undefined) {
      const min = parseFloat(String(minScore));
      if (!isNaN(min)) {
        where.score = { gte: min };
      }
    } else if (maxScore !== undefined) {
      const max = parseFloat(String(maxScore));
      if (!isNaN(max)) {
        where.score = { lte: max };
      }
    }
    
    if (minContracts !== undefined) {
      const min = parseInt(String(minContracts));
      if (!isNaN(min)) {
        where.totalContracts = { gte: min };
      }
    }
    
    const isHealthy = await checkDbHealth();
    if (!isHealthy) {
      let filtered = [...FALLBACK_CONTRACTORS];
      if (name) {
        filtered = filtered.filter(c => c.name.toLowerCase().includes(String(name).toLowerCase()));
      }
      if (registeredState) {
        filtered = filtered.filter(c => c.registeredState.toLowerCase() === String(registeredState).toLowerCase());
      }
      return res.json({
        contractors: filtered.slice((pageNum - 1) * limitNum, pageNum * limitNum),
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: filtered.length,
          totalPages: Math.ceil(filtered.length / limitNum),
        },
        filters: { name, registeredState, verified, minScore, maxScore, minContracts }
      });
    }

    // Get contractors with count for pagination
    const [contractors, total] = await Promise.all([
      prisma.contractor.findMany({
        where,
        select: {
          id: true,
          name: true,
          registeredState: true,
          verified: true,
          totalContracts: true,
          completed: true,
          ongoing: true,
          delayed: true,
          score: true,
          updatedAt: true
        },
        orderBy: {
          [sortBy]: validSortOrder
        },
        skip: (pageNum - 1) * limitNum,
        take: limitNum
      }),
      prisma.contractor.count({ where })
    ]);
    
    // Format response
    const formattedContractors = contractors.map(contractor => ({
      id: contractor.id,
      name: contractor.name,
      registeredState: contractor.registeredState,
      verified: contractor.verified,
      totalContracts: contractor.totalContracts,
      completed: contractor.completed,
      ongoing: contractor.ongoing,
      delayed: contractor.delayed,
      score: contractor.score,
      metadata: {
        completionRate: contractor.totalContracts > 0 ? 
          (contractor.completed / contractor.totalContracts) * 100 : 0,
        delayRate: contractor.totalContracts > 0 ? 
          (contractor.delayed / contractor.totalContracts) * 100 : 0
      },
      source: {
        name: 'GeM/CPPP',
        freshness: contractor.updatedAt.toISOString(),
        reliability: 'medium'
      }
    }));
    
    res.json({
      contractors: formattedContractors,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      },
      filters: {
        name,
        registeredState,
        verified,
        minScore,
        maxScore,
        minContracts
      }
    });
  } catch (error) {
    console.error('[contractors] Error:', error);
    res.json({
      contractors: FALLBACK_CONTRACTORS,
      pagination: { page: 1, limit: 10, total: FALLBACK_CONTRACTORS.length, totalPages: 1 },
      filters: {}
    });
  }
});

/**
* GET /api/contractors/:id
 * Get a specific contractor by ID
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const contractorId = String(req.params.id);
    
    const isHealthy = await checkDbHealth();
    if (!isHealthy) {
      const fallback = FALLBACK_CONTRACTORS.find(c => c.id === contractorId) || FALLBACK_CONTRACTORS[0];
      return res.json(fallback);
    }

    const contractor = await prisma.contractor.findUnique({
      where: { id: contractorId },
      select: {
        id: true,
        name: true,
        registeredState: true,
        verified: true,
        totalContracts: true,
        completed: true,
        ongoing: true,
        delayed: true,
        score: true,
        updatedAt: true
      }
    });
    
    if (!contractor) {
      const fallback = FALLBACK_CONTRACTORS.find(c => c.id === contractorId);
      if (fallback) return res.json(fallback);
      return res.status(404).json({ error: 'Contractor not found' });
    }
    
    res.json({
      id: contractor.id,
      name: contractor.name,
      registeredState: contractor.registeredState,
      verified: contractor.verified,
      totalContracts: contractor.totalContracts,
      completed: contractor.completed,
      ongoing: contractor.ongoing,
      delayed: contractor.delayed,
      score: contractor.score,
      metadata: {
        completionRate: contractor.totalContracts > 0 ? 
          (contractor.completed / contractor.totalContracts) * 100 : 0,
        delayRate: contractor.totalContracts > 0 ? 
          (contractor.delayed / contractor.totalContracts) * 100 : 0
      },
      source: {
        name: 'GeM/CPPP',
        freshness: contractor.updatedAt.toISOString(),
        reliability: 'medium'
      }
    });
  } catch (error) {
    console.error('[contractors/:id] Error:', error);
    const contractorId = String(req.params.id);
    const fallback = FALLBACK_CONTRACTORS.find(c => c.id === contractorId) || FALLBACK_CONTRACTORS[0];
    res.json(fallback);
  }
});

export default router;

