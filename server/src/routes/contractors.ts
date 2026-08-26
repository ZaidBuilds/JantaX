import { Router } from 'express';
import type { Request, Response } from 'express';
import { prisma } from '../prisma';
import { requireRole } from '../middleware/auth';

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
 * Query parameters:
 *   name: filter by contractor name (optional)
 *   registeredState: filter by state of registration (optional)
 *   verified: filter by verification status (optional)
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
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
* GET /api/contractors/:id
 * Get a specific contractor by ID
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const contractorId = String(req.params.id);
    
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
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

