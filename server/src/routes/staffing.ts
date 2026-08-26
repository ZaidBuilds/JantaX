import { Router } from 'express';
import type { Request, Response } from 'express';
import { prisma } from '../prisma';
import { requireRole } from '../middleware/auth';

// Staffing response types
export interface StaffInfo {
  id: string;
  name: string | null;
  email: string;
  role: string; // From UserRole
  pincode: string | null;
  state: string | null;
  district: string | null;
  metadata: Record<string, any>;
  sourceInfo: {
    name: string;
    freshness: string; // ISO timestamp
    reliability: 'high' | 'medium' | 'low';
  };
}

// Staffing response with pagination
export interface StaffingResponse {
  staff: StaffInfo[];
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
 * GET /api/staffing
 * Get government staff/officials with filtering, pagination, and sorting
 * Query parameters:
 *   role: filter by user role (optional)
 *   pincode: filter by PIN code (optional)
 *   state: filter by state (optional)
 *   district: filter by district (optional)
 *   page: page number (default: 1)
 *   limit: results per page (default: 10)
 *   sortBy: field to sort by (default: name)
 *   sortOrder: asc or desc (default: asc)
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const {
      role,
      pincode,
      state,
      district,
      page = 1,
      limit = 10,
      sortBy = 'name',
      sortOrder = 'asc'
    } = req.query as {
      role?: string;
      pincode?: string;
      state?: string;
      district?: string;
      page?: string;
      limit?: string;
      sortBy?: string;
      sortOrder?: string;
    };
    
    // Validate pagination
    const pageNum = Math.max(1, parseInt(String(page)));
    const limitNum = Math.min(50, Math.max(1, parseInt(String(limit))));
    
    // Validate sort order
    const validSortOrder = ['asc', 'desc'].includes(sortOrder ?? '') ? sortOrder : 'asc';
    
    // Build WHERE clause
    const where: any = {};
    
    if (role) {
      where.role = role;
    }
    
    // Note: Direct pincode/state/district filtering on User would require 
    // a relationship that doesn't exist in the current schema
    // This would need to be implemented based on how staff are associated with locations
    
    // Get staff with count for pagination
    const [staff, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          // Note: pincode/state/district would come from related entities
          // For now, we'll leave them as null since the relationship isn't defined
          updatedAt: true
        },
        orderBy: {
          [sortBy]: validSortOrder
        },
        skip: (pageNum - 1) * limitNum,
        take: limitNum
      }),
      prisma.user.count({ where })
    ]);
    
    // Format response
    const formattedStaff = staff.map(staffMember => ({
      id: staffMember.id,
      name: staffMember.name,
      email: staffMember.email,
      role: staffMember.role,
      pincode: null, // Would need relationship to get this
      state: null, // Would need relationship to get this
      district: null, // Would need relationship to get this
      metadata: {
        lastActive: staffMember.updatedAt?.toISOString(),
        daysSinceLastActive: staffMember.updatedAt ? 
          Math.floor((Date.now() - staffMember.updatedAt.getTime()) / (1000 * 60 * 60 * 24)) : 
          null
      },
      sourceInfo: {
        name: 'JantaX User Registry',
        freshness: staffMember.updatedAt?.toISOString() ?? new Date().toISOString(),
        reliability: 'high'
      }
    }));
    
    res.json({
      staff: formattedStaff,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      },
      filters: {
        role,
        pincode,
        state,
        district
      }
    });
  } catch (error) {
    console.error('[staffing] Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/staffing/:id
 * Get a specific staff member by ID
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const staffId = String(req.params.id);
    
    const staffMember = await prisma.user.findUnique({
      where: { id: staffId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        updatedAt: true
      }
    });
    
    if (!staffMember) {
      return res.status(404).json({ error: 'Staff member not found' });
    }
    
    res.json({
      id: staffMember.id,
      name: staffMember.name,
      email: staffMember.email,
      role: staffMember.role,
      pincode: null, // Would need relationship to get this
      state: null, // Would need relationship to get this
      district: null, // Would need relationship to get this
      metadata: {
        lastActive: staffMember.updatedAt?.toISOString(),
        daysSinceLastActive: staffMember.updatedAt ? 
          Math.floor((Date.now() - staffMember.updatedAt.getTime()) / (1000 * 60 * 60 * 24)) : 
          null
      },
      sourceInfo: {
        name: 'JantaX User Registry',
        freshness: staffMember.updatedAt?.toISOString() ?? new Date().toISOString(),
        reliability: 'high'
      }
    });
  } catch (error) {
    console.error('[staffing/:id] Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

