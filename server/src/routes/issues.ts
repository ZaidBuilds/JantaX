import { Router } from 'express';
import type { Request, Response } from 'express';
import { prisma } from '../prisma';
import { requireRole } from '../middleware/auth';

// Issue response types
export interface IssueInfo {
  id: string;
  issueId: string;
  title: string;
  description: string;
  entityType: string;
  entityId: string;
  location: {
    pincode: string;
    state: string;
    district: string;
  } | null;
  status: string; // From IssueStatus
  detectedAt: string; // ISO date
  updatedAt: string; // ISO date
  metadata: Record<string, any>;
  sourceInfo: {
    name: string;
    freshness: string; // ISO timestamp
    reliability: 'high' | 'medium' | 'low';
  };
  relatedCounts: {
    evidenceCount: number;
    grievanceCount: number;
  };
}

// Issues response with pagination
export interface IssuesResponse {
  issues: IssueInfo[];
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
 * GET /api/issues
 * Get issues with filtering, pagination, and sorting
 * Query parameters:
 *   entityType: filter by entity type (optional)
 *   entityId: filter by entity ID (optional)
 *   status: filter by issue status (optional)
 *   pincode: filter by PIN code (optional)
 *   page: page number (default: 1)
 *   limit: results per page (default: 10)
 *   sortBy: field to sort by (default: detectedAt)
 *   sortOrder: asc or desc (default: desc)
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const {
      entityType,
      entityId,
      status,
      pincode,
      page = 1,
      limit = 10,
      sortBy = 'detectedAt',
      sortOrder = 'desc'
    } = req.query as {
      entityType?: string;
      entityId?: string;
      status?: string;
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
    
    if (status) {
      where.status = status;
    }
    
    if (pincode) {
      const cleanPincode = String(pincode).replace(/\D/g, '');
      if (/^\d{6}$/.test(cleanPincode)) {
        where.pincodeCode = cleanPincode;
      }
    }
    
    // Get issues with count for pagination
    const [issues, total] = await Promise.all([
      prisma.issue.findMany({
        where,
        select: {
          id: true,
          issueId: true,
          title: true,
          description: true,
          entityType: true,
          entityId: true,
          pincodeCode: true,
          pincode: {
            select: {
              code: true,
              state: true,
              district: true
            }
          },
          status: true,
          detectedAt: true,
          updatedAt: true
        },
        orderBy: {
          [sortBy]: validSortOrder
        },
        skip: (pageNum - 1) * limitNum,
        take: limitNum
      }),
      prisma.issue.count({ where })
    ]);
    
    // Format response
    const formattedIssues = issues.map(issue => ({
      id: issue.id,
      issueId: issue.issueId,
      title: issue.title,
      description: issue.description,
      entityType: issue.entityType,
      entityId: issue.entityId,
      location: issue.pincodeCode ? {
        pincode: issue.pincodeCode,
        state: issue.pincode?.state ?? '',
        district: issue.pincode?.district ?? ''
      } : null,
      status: issue.status,
      detectedAt: issue.detectedAt.toISOString(),
      updatedAt: issue.updatedAt.toISOString(),
      metadata: {
        daysSinceDetection: issue.detectedAt ? 
          Math.floor((Date.now() - issue.detectedAt.getTime()) / (1000 * 60 * 60 * 24)) : 
          null
      },
      sourceInfo: {
        name: 'JantaX Issue Tracking',
        freshness: issue.updatedAt.toISOString(),
        reliability: 'high'
      },
      relatedCounts: {
        evidenceCount: 0, // Would need to join with evidence table in a real implementation
        grievanceCount: 0 // Would need to join with grievance table in a real implementation
      }
    }));
    
    res.json({
      issues: formattedIssues,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      },
      filters: {
        entityType,
        entityId,
        status,
        pincode
      }
    });
  } catch (error) {
    console.error('[issues] Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/issues/:id
 * Get a specific issue by ID
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const issueId = String(req.params.id);
    
    const issue = await prisma.issue.findUnique({
      where: { id: issueId },
      select: {
        id: true,
        issueId: true,
        title: true,
        description: true,
        entityType: true,
        entityId: true,
        pincodeCode: true,
        pincode: {
          select: {
            code: true,
            state: true,
            district: true
          }
        },
        status: true,
        detectedAt: true,
        updatedAt: true
      }
    });
    
    if (!issue) {
      return res.status(404).json({ error: 'Issue not found' });
    }
    
    res.json({
      id: issue.id,
      issueId: issue.issueId,
      title: issue.title,
      description: issue.description,
      entityType: issue.entityType,
      entityId: issue.entityId,
      location: issue.pincodeCode ? {
        pincode: issue.pincodeCode,
        state: issue.pincode?.state ?? '',
        district: issue.pincode?.district ?? ''
      } : null,
      status: issue.status,
      detectedAt: issue.detectedAt.toISOString(),
      updatedAt: issue.updatedAt.toISOString(),
      metadata: {
        daysSinceDetection: issue.detectedAt ? 
          Math.floor((Date.now() - issue.detectedAt.getTime()) / (1000 * 60 * 60 * 24)) : 
          null
      },
      sourceInfo: {
        name: 'JantaX Issue Tracking',
        freshness: issue.updatedAt.toISOString(),
        reliability: 'high'
      },
      relatedCounts: {
        evidenceCount: 0, // Would need to join with evidence table in a real implementation
        grievanceCount: 0 // Would need to join with grievance table in a real implementation
      }
    });
  } catch (error) {
    console.error('[issues/:id] Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/issues
 * Create a new issue
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      issueId,
      title,
      description,
      entityType,
      entityId,
      pincodeCode,
      status
    } = req.body as {
      issueId?: string;
      title?: string;
      description?: string;
      entityType?: string;
      entityId?: string;
      pincodeCode?: string;
      status?: string; // From IssueStatus
    };
    
    // Validate required fields
    if (!issueId || !title || !description || !entityType || !entityId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Validate issueId uniqueness
    const existing = await prisma.issue.findUnique({ where: { issueId } });
    if (existing) {
      return res.status(409).json({ error: 'Issue ID already exists' });
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
    
    // Create issue
    const newIssue = await prisma.issue.create({
      data: {
        issueId,
        title,
        description,
        entityType,
        entityId,
        pincodeCode: pincodeCode ?? undefined,
        status: status as any // Assuming it's a valid IssueStatus value
      }
    });
    
    res.status(201).json({
      issue: newIssue,
      message: 'Issue created successfully'
    });
  } catch (error) {
    console.error('[issues POST] Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

