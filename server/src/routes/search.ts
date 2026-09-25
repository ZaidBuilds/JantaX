import { Router } from 'express';
import type { Request, Response } from 'express';
import { prisma } from '../prisma';
import { requireRole } from '../middleware/auth';

// Search result types
export interface SearchResult {
  id: string;
  type: 'school' | 'infra' | 'rera' | 'hospital' | 'pds' | 'contractor' | 'source' | 'issue' | 'grievance';
  title: string;
  description: string;
  location?: {
    pincode: string;
    state: string;
    district: string;
  };
  metadata: Record<string, any>;
  score: number; // relevance score
  source: {
    name: string;
    freshness: string; // ISO timestamp or relative time
    reliability: 'high' | 'medium' | 'low';
  };
}

// Search response
export interface SearchResponse {
  results: SearchResult[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  query: string;
  filters: Record<string, any>;
}

const router = Router();

/**
 * GET /api/search
 * Search across multiple entities
 * Query parameters:
 *   q: search query (required)
 *   type: entity type to filter by (optional)
 *   pincode: filter by pincode (optional)
 *   page: page number (default: 1)
 *   limit: results per page (default: 10)
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const query = String(req.query.q || '').trim();
    const type = req.query.type as string | undefined;
    const pincode = String(req.query.pincode || '').replace(/\D/g, '');
    const page = Math.max(1, parseInt(String(req.query.page || '1')));
    const limit = Math.min(50, Math.max(1, parseInt(String(req.query.limit || '10'))));
    
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    // Validate pincode if provided
    const validPincode = pincode && /^\d{6}$/.test(pincode) ? pincode : null;
    
    // Validate type if provided
    const validTypes = ['school', 'infra', 'rera', 'hospital', 'pds', 'contractor', 'source', 'issue', 'grievance'];
    const validType = type && validTypes.includes(type) ? type : null;
    
    // Build WHERE clauses for each entity type
    
    // Initialize results array
    let results: SearchResult[] = [];
    let total = 0;
    
    // Search schools
    if (!validType || validType === 'school') {
      const [schools, schoolCount] = await Promise.all([
        prisma.school.findMany({
          where: {
            OR: [
              { nameEnglish: { contains: query, mode: 'insensitive' } },
              { nameHindi: { contains: query } },
              { udiseCode: { contains: query } },
            ],
            ...(validPincode ? { pincodeCode: validPincode } : {}),
          },
          select: {
            id: true,
            nameEnglish: true,
            nameHindi: true,
            udiseCode: true,
            level: true,
            managementType: true,
            pincode: {
              select: {
                code: true,
                state: true,
                district: true,
              }
            },
            groundTruthScore: true,
            updatedAt: true,
          },
          orderBy: { groundTruthScore: 'desc' },
          skip: (page - 1) * limit,
          take: limit,
        }),
        prisma.school.count({
          where: {
            OR: [
              { nameEnglish: { contains: query, mode: 'insensitive' } },
              { nameHindi: { contains: query } },
              { udiseCode: { contains: query } },
            ],
            ...(validPincode ? { pincodeCode: validPincode } : {}),
          },
        })
      ]);
      
      schools.forEach(school => {
        results.push({
          id: school.id,
          type: 'school',
          title: school.nameEnglish,
          description: `${school.level} ${school.managementType} school in ${school.pincode?.district ?? ''}, ${school.pincode?.state ?? ''}`,
          location: school.pincode ? {
            pincode: school.pincode.code,
            state: school.pincode.state,
            district: school.pincode.district,
          } : undefined,
          metadata: {
            udiseCode: school.udiseCode,
            level: school.level,
            managementType: school.managementType,
            groundTruthScore: school.groundTruthScore,
          },
          score: calculateRelevanceScore(school.nameEnglish + ' ' + (school.nameHindi || ''), query),
          source: {
            name: 'UDISE+',
            freshness: school.updatedAt.toISOString(),
            reliability: 'high',
          },
        });
      });
      
      total += schoolCount;
    }
    
    // Search infrastructure projects
    if (!validType || validType === 'infra') {
      const [infras, infraCount] = await Promise.all([
        prisma.infraProject.findMany({
          where: {
            OR: [
              { titleEnglish: { contains: query, mode: 'insensitive' } },
              { titleHindi: { contains: query } },
              { department: { contains: query, mode: 'insensitive' } },
            ],
            ...(validPincode ? { pincodeCode: validPincode } : {}),
          },
          select: {
            id: true,
            titleEnglish: true,
            titleHindi: true,
            department: true,
            pincode: {
              select: {
                code: true,
                state: true,
                district: true,
              }
            },
            budget: true,
            status: true,
            groundTruthScore: true,
            updatedAt: true,
          },
          orderBy: { budget: 'desc' },
          skip: (page - 1) * limit,
          take: limit,
        }),
        prisma.infraProject.count({
          where: {
            OR: [
              { titleEnglish: { contains: query, mode: 'insensitive' } },
              { titleHindi: { contains: query } },
              { department: { contains: query, mode: 'insensitive' } },
            ],
            ...(validPincode ? { pincodeCode: validPincode } : {}),
          },
        })
      ]);
      
      infras.forEach(infra => {
        results.push({
          id: infra.id,
          type: 'infra',
          title: infra.titleEnglish,
          description: `${infra.department} project in ${infra.pincode?.district ?? ''}, ${infra.pincode?.state ?? ''}`,
          location: infra.pincode ? {
            pincode: infra.pincode.code,
            state: infra.pincode.state,
            district: infra.pincode.district,
          } : undefined,
          metadata: {
            department: infra.department,
            budget: infra.budget.toString(),
            status: infra.status,
            groundTruthScore: infra.groundTruthScore,
          },
          score: calculateRelevanceScore(infra.titleEnglish + ' ' + (infra.titleHindi || '') + ' ' + (infra.department || ''), query),
          source: {
            name: 'MoSPI',
            freshness: infra.updatedAt.toISOString(),
            reliability: 'high',
          },
        });
      });
      
      total += infraCount;
    }
    
    // Search RERA projects
    if (!validType || validType === 'rera') {
      const [reras, reraCount] = await Promise.all([
        prisma.reraProject.findMany({
          where: {
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { promoter: { contains: query, mode: 'insensitive' } },
              { reraNumber: { contains: query } },
            ],
            ...(validPincode ? { pincodeCode: validPincode } : {}),
          },
          select: {
            id: true,
            name: true,
            promoter: true,
            reraNumber: true,
            pincode: {
              select: {
                code: true,
                state: true,
                district: true,
              }
            },
            status: true,
            delayMonths: true,
            updatedAt: true,
          },
          orderBy: { delayMonths: 'desc' },
          skip: (page - 1) * limit,
          take: limit,
        }),
        prisma.reraProject.count({
          where: {
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { promoter: { contains: query, mode: 'insensitive' } },
              { reraNumber: { contains: query } },
            ],
            ...(validPincode ? { pincodeCode: validPincode } : {}),
          },
        })
      ]);
      
      reras.forEach(rera => {
        results.push({
          id: rera.id,
          type: 'rera',
          title: rera.name,
          description: `RERA project ${rera.reraNumber} by ${rera.promoter} in ${rera.pincode?.district ?? ''}, ${rera.pincode?.state ?? ''}`,
          location: rera.pincode ? {
            pincode: rera.pincode.code,
            state: rera.pincode.state,
            district: rera.pincode.district,
          } : undefined,
          metadata: {
            reraNumber: rera.reraNumber,
            promoter: rera.promoter,
            status: rera.status,
            delayMonths: rera.delayMonths,
          },
          score: calculateRelevanceScore(rera.name + ' ' + (rera.promoter || '') + ' ' + (rera.reraNumber || ''), query),
          source: {
            name: 'RERA',
            freshness: rera.updatedAt.toISOString(),
            reliability: 'high',
          },
        });
      });
      
      total += reraCount;
    }
    
    // Search hospitals
    if (!validType || validType === 'hospital') {
      const [hospitals, hospitalCount] = await Promise.all([
        prisma.hospital.findMany({
          where: {
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { type: { contains: query, mode: 'insensitive' } },
            ],
            ...(validPincode ? { pincodeCode: validPincode } : {}),
          },
          select: {
            id: true,
            name: true,
            type: true,
            pincode: {
              select: {
                code: true,
                state: true,
                district: true,
              }
            },
            bedsTotal: true,
            bedsOccupied: true,
            medicinesAvailable: true,
            updatedAt: true,
          },
          orderBy: { bedsOccupied: 'desc' },
          skip: (page - 1) * limit,
          take: limit,
        }),
        prisma.hospital.count({
          where: {
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { type: { contains: query, mode: 'insensitive' } },
            ],
            ...(validPincode ? { pincodeCode: validPincode } : {}),
          },
        })
      ]);
      
      hospitals.forEach(hospital => {
        results.push({
          id: hospital.id,
          type: 'hospital',
          title: hospital.name,
          description: `${hospital.type} in ${hospital.pincode?.district ?? ''}, ${hospital.pincode?.state ?? ''}`,
          location: hospital.pincode ? {
            pincode: hospital.pincode.code,
            state: hospital.pincode.state,
            district: hospital.pincode.district,
          } : undefined,
          metadata: {
            type: hospital.type,
            bedsTotal: hospital.bedsTotal,
            bedsOccupied: hospital.bedsOccupied,
            medicinesAvailable: hospital.medicinesAvailable,
          },
          score: calculateRelevanceScore(hospital.name + ' ' + (hospital.type || ''), query),
          source: {
            name: 'HMIS/NHM',
            freshness: hospital.updatedAt.toISOString(),
            reliability: 'high',
          },
        });
      });
      
      total += hospitalCount;
    }
    
    // Search PDS shops
    if (!validType || validType === 'pds') {
      const [pdss, pdsCount] = await Promise.all([
        prisma.pdsShop.findMany({
          where: {
            OR: [
              { shopName: { contains: query, mode: 'insensitive' } },
              { dealerName: { contains: query, mode: 'insensitive' } },
            ],
            ...(validPincode ? { pincodeCode: validPincode } : {}),
          },
          select: {
            id: true,
            shopName: true,
            dealerName: true,
            pincode: {
              select: {
                code: true,
                state: true,
                district: true,
              }
            },
            isOpen: true,
            quotaDistributedPct: true,
            qualityOk: true,
            beneficiaries: true,
            updatedAt: true,
          },
          orderBy: { quotaDistributedPct: 'asc' },
          skip: (page - 1) * limit,
          take: limit,
        }),
        prisma.pdsShop.count({
          where: {
            OR: [
              { shopName: { contains: query, mode: 'insensitive' } },
              { dealerName: { contains: query, mode: 'insensitive' } },
            ],
            ...(validPincode ? { pincodeCode: validPincode } : {}),
          },
        })
      ]);
      
      pdss.forEach(pds => {
        results.push({
          id: pds.id,
          type: 'pds',
          title: pds.shopName,
          description: `PDS shop run by ${pds.dealerName} in ${pds.pincode?.district ?? ''}, ${pds.pincode?.state ?? ''}`,
          location: pds.pincode ? {
            pincode: pds.pincode.code,
            state: pds.pincode.state,
            district: pds.pincode.district,
          } : undefined,
          metadata: {
            dealerName: pds.dealerName,
            isOpen: pds.isOpen,
            quotaDistributedPct: pds.quotaDistributedPct,
            qualityOk: pds.qualityOk,
            beneficiaries: pds.beneficiaries,
          },
          score: calculateRelevanceScore(pds.shopName + ' ' + (pds.dealerName || ''), query),
          source: {
            name: 'NFSA/ePOS',
            freshness: pds.updatedAt.toISOString(),
            reliability: 'high',
          },
        });
      });
      
      total += pdsCount;
    }
    
    // Search contractors
    if (!validType || validType === 'contractor') {
      const [contractors, contractorCount] = await Promise.all([
        prisma.contractor.findMany({
          where: {
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { registeredState: { contains: query, mode: 'insensitive' } },
            ],
          },
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
            updatedAt: true,
          },
          orderBy: { score: 'desc' },
          skip: (page - 1) * limit,
          take: limit,
        }),
        prisma.contractor.count({
          where: {
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { registeredState: { contains: query, mode: 'insensitive' } },
            ],
          },
        })
      ]);
      
      contractors.forEach(contractor => {
        results.push({
          id: contractor.id,
          type: 'contractor',
          title: contractor.name,
          description: `Contractor based in ${contractor.registeredState} with score ${contractor.score}/100`,
          location: undefined, // Contractors don't have direct pincode linkage in schema
          metadata: {
            registeredState: contractor.registeredState,
            verified: contractor.verified,
            totalContracts: contractor.totalContracts,
            completed: contractor.completed,
            ongoing: contractor.ongoing,
            delayed: contractor.delayed,
            score: contractor.score,
          },
          score: calculateRelevanceScore(contractor.name + ' ' + (contractor.registeredState || ''), query),
          source: {
            name: 'GeM/CPPP',
            freshness: contractor.updatedAt.toISOString(),
            reliability: 'medium',
          },
        });
      });
      
      total += contractorCount;
    }
    
    // Search sources
    if (!validType || validType === 'source') {
      const [sources, sourceCount] = await Promise.all([
        prisma.source.findMany({
          where: {
            OR: [
              { sourceName: { contains: query, mode: 'insensitive' } },
              { organization: { contains: query, mode: 'insensitive' } },
              { sourceType: { contains: query, mode: 'insensitive' } },
            ],
          },
          select: {
            sourceId: true,
            sourceName: true,
            organization: true,
            sourceType: true,
            status: true,
            lastChecked: true,
            lastSuccessfulSync: true,
          },
          orderBy: { organization: 'asc' },
          skip: (page - 1) * limit,
          take: limit,
        }),
        prisma.source.count({
          where: {
            OR: [
              { sourceName: { contains: query, mode: 'insensitive' } },
              { organization: { contains: query, mode: 'insensitive' } },
              { sourceType: { contains: query, mode: 'insensitive' } },
            ],
          },
        })
      ]);
      
      sources.forEach(source => {
        results.push({
          id: source.sourceId,
          type: 'source',
          title: source.sourceName,
          description: `${source.organization} - ${source.sourceType}`,
          location: undefined, // Sources don't have direct pincode linkage
          metadata: {
            organization: source.organization,
            sourceType: source.sourceType,
            status: source.status,
            lastChecked: source.lastChecked?.toISOString(),
            lastSuccessfulSync: source.lastSuccessfulSync?.toISOString(),
          },
          score: calculateRelevanceScore(source.sourceName + ' ' + source.organization + ' ' + (source.sourceType || ''), query),
          source: {
            name: 'Source Registry',
            freshness: source.lastChecked?.toISOString() || new Date().toISOString(),
            reliability: source.status === 'active' ? 'high' : 'medium',
          },
        });
      });
      
      total += sourceCount;
    }
    
    // Search issues (from Phase 08 workflow)
    if (!validType || validType === 'issue') {
      const [issues, issueCount] = await Promise.all([
        prisma.issue.findMany({
          where: {
            OR: [
              { title: { contains: query, mode: 'insensitive' } },
              { description: { contains: query, mode: 'insensitive' } },
            ],
          },
          select: {
            id: true,
            issueId: true,
            title: true,
            description: true,
            entityType: true,
            entityId: true,
            status: true,
            detectedAt: true,
            updatedAt: true,
          },
          orderBy: { detectedAt: 'desc' },
          skip: (page - 1) * limit,
          take: limit,
        }),
        prisma.issue.count({
          where: {
            OR: [
              { title: { contains: query, mode: 'insensitive' } },
              { description: { contains: query, mode: 'insensitive' } },
            ],
          },
        })
      ]);
      
      issues.forEach(issue => {
        results.push({
          id: issue.id,
          type: 'issue',
          title: issue.title,
          description: issue.description,
          location: undefined, // Issues have pincode linkage but we'd need to join
          metadata: {
            issueId: issue.issueId,
            entityType: issue.entityType,
            entityId: issue.entityId,
            status: issue.status,
            detectedAt: issue.detectedAt.toISOString(),
          },
          score: calculateRelevanceScore(issue.title + ' ' + issue.description, query),
          source: {
            name: 'JantaX Issue Tracking',
            freshness: issue.updatedAt.toISOString(),
            reliability: 'high',
          },
        });
      });
      
      total += issueCount;
    }
    
    // Search grievances (workflow grievances from Phase 08)
    if (!validType || validType === 'grievance') {
      const [grievances, grievanceCount] = await Promise.all([
        prisma.grievance.findMany({
          where: {
            OR: [
              { draft: { contains: query, mode: 'insensitive' } },
              { officialResponse: { contains: query, mode: 'insensitive' } },
            ],
            ...(validPincode ? { 
              issue: {
                pincodeCode: validPincode
              } 
            } : {}),
          },
          select: {
            id: true,
            grievanceId: true,
            draft: true,
            officialResponse: true,
            officialChannel: true,
            status: true,
            submittedAt: true,
            updatedAt: true,
            issue: {
              select: {
                pincodeCode: true,
                pincode: {
                  select: {
                    code: true,
                    state: true,
                    district: true,
                  }
                }
              }
            }
          },
          orderBy: { submittedAt: 'desc' },
          skip: (page - 1) * limit,
          take: limit,
        }),
        prisma.grievance.count({
          where: {
            OR: [
              { draft: { contains: query, mode: 'insensitive' } },
              { officialResponse: { contains: query, mode: 'insensitive' } },
            ],
            ...(validPincode ? { 
              issue: {
                pincodeCode: validPincode
              } 
            } : {}),
          },
        })
      ]);
      
      grievances.forEach(grievance => {
        results.push({
          id: grievance.id,
          type: 'grievance',
          title: grievance.grievanceId || `Grievance ${grievance.id}`,
          description: grievance.draft.substring(0, 100) + (grievance.draft.length > 100 ? '...' : ''),
          location: grievance.issue?.pincode ? {
            pincode: grievance.issue.pincode.code,
            state: grievance.issue.pincode.state,
            district: grievance.issue.pincode.district,
          } : undefined,
          metadata: {
            grievanceId: grievance.grievanceId,
            officialChannel: grievance.officialChannel,
            status: grievance.status,
            submittedAt: grievance.submittedAt?.toISOString(),
            officialResponse: grievance.officialResponse,
          },
          score: calculateRelevanceScore(grievance.draft + ' ' + (grievance.officialResponse || ''), query),
          source: {
            name: 'JantaX Grievance System',
            freshness: grievance.updatedAt.toISOString(),
            reliability: 'high',
          },
        });
      });
      
      total += grievanceCount;
    }
    
    // Sort results by score (descending)
    results.sort((a, b) => b.score - a.score);
    
    // Apply pagination to the combined results
    const startIdx = (page - 1) * limit;
    const endIdx = startIdx + limit;
    const paginatedResults = results.slice(startIdx, endIdx);
    
    res.json({
      results: paginatedResults,
      pagination: {
        page,
        limit,
        total: results.length, // total across all types
        totalPages: Math.ceil(results.length / limit),
      },
      query,
      filters: {
        type: validType,
        pincode: validPincode,
      }
    });
  } catch (error) {
    console.error('[search] Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/search/autocomplete - Fast autocomplete suggestions
router.get('/autocomplete', async (req: Request, res: Response) => {
  const query = String(req.query.q || '').trim().slice(0, 100);
  try {
    const pincode = String(req.query.pincode || '').replace(/\D/g, '');
    const validPincode = pincode && /^\d{6}$/.test(pincode) ? pincode : null;

    if (!query || query.length < 2) {
      return res.json({ suggestions: [], query });
    }

    const limit = 8;
    const suggestions: Array<{ text: string; type: string; subtitle?: string; pincode?: string }> = [];

    // Check if query is a PIN code
    if (/^\d{6}$/.test(query)) {
      suggestions.push({ text: `PIN ${query}`, type: 'location', subtitle: 'PIN Code', pincode: query });
    }

    // Search schools
    const schools = await prisma.school.findMany({
      where: {
        OR: [
          { nameEnglish: { contains: query, mode: 'insensitive' } },
          { udiseCode: { contains: query } },
        ],
        ...(validPincode ? { pincodeCode: validPincode } : {}),
      },
      select: { id: true, nameEnglish: true, udiseCode: true, pincode: { select: { code: true, district: true } } },
      take: 3,
      orderBy: { nameEnglish: 'asc' },
    });
    schools.forEach(s => suggestions.push({
      text: s.nameEnglish,
      type: 'school',
      subtitle: `${s.pincode?.district || ''} · UDISE+`,
      pincode: s.pincode?.code,
    }));

    // Search RERA projects
    const reras = await prisma.reraProject.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { promoter: { contains: query, mode: 'insensitive' } },
          { reraNumber: { contains: query } },
        ],
        ...(validPincode ? { pincodeCode: validPincode } : {}),
      },
      select: { id: true, name: true, reraNumber: true, pincode: { select: { code: true, district: true } } },
      take: 3,
      orderBy: { name: 'asc' },
    });
    reras.forEach(r => suggestions.push({
      text: r.name,
      type: 'rera',
      subtitle: `${r.pincode?.district || ''} · ${r.reraNumber}`,
      pincode: r.pincode?.code,
    }));

    // Search contractors
    const contractors = await prisma.contractor.findMany({
      where: {
        name: { contains: query, mode: 'insensitive' },
      },
      select: { id: true, name: true, registeredState: true },
      take: 2,
      orderBy: { name: 'asc' },
    });
    contractors.forEach(c => suggestions.push({
      text: c.name,
      type: 'contractor',
      subtitle: c.registeredState,
    }));

    // Search infra
    const infras = await prisma.infraProject.findMany({
      where: {
        OR: [
          { titleEnglish: { contains: query, mode: 'insensitive' } },
          { department: { contains: query, mode: 'insensitive' } },
        ],
        ...(validPincode ? { pincodeCode: validPincode } : {}),
      },
      select: { id: true, titleEnglish: true, pincode: { select: { code: true, district: true } } },
      take: 2,
    });
    infras.forEach(i => suggestions.push({
      text: i.titleEnglish,
      type: 'infra',
      subtitle: `${i.pincode?.district || ''}`,
      pincode: i.pincode?.code,
    }));

    res.json({ suggestions: suggestions.slice(0, limit), query });
  } catch (error) {
    console.error('[autocomplete] Error:', error);
    res.json({ suggestions: [], query });
  }
});

/**
 * Calculate relevance score for search results
 * Simple implementation: frequency of query terms in text
 */
function calculateRelevanceScore(text: string, query: string): number {
  if (!text || !query) return 0;
  
  const textLower = text.toLowerCase();
  const queryLower = query.toLowerCase();
  const queryTerms = queryLower.split(/\s+/).filter(term => term.length > 0);
  
  if (queryTerms.length === 0) return 0;
  
  let score = 0;
  for (const term of queryTerms) {
    // Count occurrences of term in text
    const matches = textLower.match(new RegExp(term, 'g')) || [];
    score += matches.length;
  }
  
  // Normalize by text length to avoid bias toward longer texts
  return score / (textLower.length / 100);
}

export default router;

