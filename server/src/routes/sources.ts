import { Router } from 'express';
import type { Request, Response } from 'express';
import { prisma } from '../prisma';
import { requireRole } from '../middleware/auth';

// Source response types
export interface SourceInfo {
  sourceId: string;
  sourceName: string;
  organization: string;
  sourceType: string;
  status: string;
  description: string | null;
  website: string | null;
  apiUrl: string | null;
  datasetUrl: string | null;
  license: string;
  termsUrl: string | null;
  attributionRequirement: string | null;
  reusePermission: string | null;
  dataSensitivity: string;
  updateFrequency: string;
  expectedRefreshInterval: string;
  lastChecked: string | null; // ISO date
  lastSuccessfulSync: string | null; // ISO date
  recordsCount: number;
  metadata: Record<string, any>;
  sourceInfo: {
    name: string;
    freshness: string; // ISO timestamp
    reliability: 'high' | 'medium' | 'low';
  };
}

// Sources response with pagination
export interface SourcesResponse {
  sources: SourceInfo[];
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
 * GET /api/sources
 * Get sources with filtering, pagination, and sorting
 * Query parameters:
 *   sourceType: filter by source type (optional)
 *   status: filter by status (optional)
 *   organization: filter by organization name (optional)
 *   dataSensitivity: filter by data sensitivity (optional)
 *   page: page number (default: 1)
 *   limit: results per page (default: 10)
 *   sortBy: field to sort by (default: organization)
 *   sortOrder: asc or desc (default: asc)
 */
router.get('/sources', async (req: Request, res: Response) => {
  try {
    const {
      sourceType,
      status,
      organization,
      dataSensitivity,
      page = 1,
      limit = 10,
      sortBy = 'organization',
      sortOrder = 'asc'
    } = req.query as {
      sourceType?: string;
      status?: string;
      organization?: string;
      dataSensitivity?: string;
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
    
    if (sourceType) {
      where.sourceType = { contains: sourceType, mode: 'insensitive' };
    }
    
    if (status) {
      where.status = status;
    }
    
    if (organization) {
      where.organization = { contains: organization, mode: 'insensitive' };
    }
    
    if (dataSensitivity) {
      where.dataSensitivity = dataSensitivity;
    }
    
    // Get sources with count for pagination
    const [sources, total] = await Promise.all([
      prisma.source.findMany({
        where,
        select: {
          sourceId: true,
          sourceName: true,
          organization: true,
          sourceType: true,
          status: true,
          notes: true,
          sourceUrl: true,
          apiUrl: true,
          datasetUrl: true,
          license: true,
          termsUrl: true,
          attributionRequirement: true,
          reusePermission: true,
          dataSensitivity: true,
          updateFrequency: true,
          expectedRefreshInterval: true,
          lastChecked: true,
          lastSuccessfulSync: true
        },
        orderBy: {
          [sortBy]: validSortOrder
        },
        skip: (pageNum - 1) * limitNum,
        take: limitNum
      }),
      prisma.source.count({ where })
    ]);
    
    // Format response
    const formattedSources = sources.map(source => ({
      sourceId: source.sourceId,
      sourceName: source.sourceName,
      organization: source.organization,
      sourceType: source.sourceType,
      status: source.status,
      description: source.notes,
      website: source.sourceUrl,
      apiUrl: source.apiUrl,
      datasetUrl: source.datasetUrl,
      license: source.license,
      termsUrl: source.termsUrl,
      attributionRequirement: source.attributionRequirement,
      reusePermission: source.reusePermission,
      dataSensitivity: source.dataSensitivity,
      updateFrequency: source.updateFrequency,
      expectedRefreshInterval: source.expectedRefreshInterval,
      lastChecked: source.lastChecked?.toISOString() ?? null,
      lastSuccessfulSync: source.lastSuccessfulSync?.toISOString() ?? null,
      recordsCount: 0, // Would need to count related records in a real implementation
      metadata: {
        syncStatus: source.lastSuccessfulSync ? 
          'Last synced: ' + source.lastSuccessfulSync?.toLocaleDateString() : 
          'Never synced',
        daysSinceLastCheck: source.lastChecked ? 
          Math.floor((Date.now() - source.lastChecked.getTime()) / (1000 * 60 * 60 * 24)) : 
          null
      },
      sourceInfo: {
        name: 'JantaX Source Registry',
        freshness: source.lastChecked?.toISOString() ?? new Date().toISOString(),
        reliability: source.status === 'active' ? 'high' : 
                   source.status === 'failed' ? 'low' : 'medium'
      }
    }));
    
    res.json({
      sources: formattedSources,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      },
      filters: {
        sourceType,
        status,
        organization,
        dataSensitivity
      }
    });
  } catch (error) {
    console.error('[sources] Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/sources/:id
 * Get a specific source by ID
 */
router.get('/sources/:id', async (req: Request, res: Response) => {
  try {
    const sourceId = String(req.params.id);
    
    const source = await prisma.source.findUnique({
      where: { sourceId: sourceId },
      select: {
        sourceId: true,
        sourceName: true,
        organization: true,
        sourceType: true,
        status: true,
        notes: true,
        sourceUrl: true,
        apiUrl: true,
        datasetUrl: true,
        license: true,
        termsUrl: true,
        attributionRequirement: true,
        reusePermission: true,
        dataSensitivity: true,
        updateFrequency: true,
        expectedRefreshInterval: true,
        lastChecked: true,
        lastSuccessfulSync: true,
        // Include a sample of recent records
        records: {
          take: 5,
          orderBy: { capturedAt: 'desc' }
        }
      }
    });
    
    if (!source) {
      return res.status(404).json({ error: 'Source not found' });
    }
    
    res.json({
      sourceId: source.sourceId,
      sourceName: source.sourceName,
      organization: source.organization,
      sourceType: source.sourceType,
      status: source.status,
      description: source.notes,
      website: source.sourceUrl,
      apiUrl: source.apiUrl,
      datasetUrl: source.datasetUrl,
      license: source.license,
      termsUrl: source.termsUrl,
      attributionRequirement: source.attributionRequirement,
      reusePermission: source.reusePermission,
      dataSensitivity: source.dataSensitivity,
      updateFrequency: source.updateFrequency,
      expectedRefreshInterval: source.expectedRefreshInterval,
      lastChecked: source.lastChecked?.toISOString() ?? null,
      lastSuccessfulSync: source.lastSuccessfulSync?.toISOString() ?? null,
      records: source.records?.map(record => ({
        id: record.id,
        entityType: record.entityType,
        entityId: record.entityId,
        field: record.field,
        value: record.value,
        capturedAt: record.capturedAt?.toISOString()
      })) ?? [],
      metadata: {
        recordsCount: source.records?.length ?? 0,
        daysSinceLastCheck: source.lastChecked ? 
          Math.floor((Date.now() - source.lastChecked.getTime()) / (1000 * 60 * 60 * 24)) : 
          null
      },
      sourceInfo: {
        name: 'JantaX Source Registry',
        freshness: source.lastChecked?.toISOString() ?? new Date().toISOString(),
        reliability: source.status === 'active' ? 'high' : 
                   source.status === 'failed' ? 'low' : 'medium'
      }
    });
  } catch (error) {
    console.error('[sources/:id] Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

