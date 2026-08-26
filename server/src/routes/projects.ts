import { Router } from 'express';
import type { Request, Response } from 'express';
import { prisma } from '../prisma';
import { requireRole } from '../middleware/auth';

// Project response types
export interface ProjectInfo {
  id: string;
  projectId: string | null;
  title: string;
  description: string | null;
  projectType: string; // 'infra', 'rera', 'contractor', etc.
  status: string;
  location: {
    pincode: string;
    state: string;
    district: string;
  } | null;
  financial: {
    budget: number | null; // in Crores
    expenditure: number | null; // in Crores
  };
  timeline: {
    startDate: string | null; // ISO date
    endDate: string | null; // ISO date
    durationMonths: number | null;
  };
  progress: {
    completionPercentage: number | null;
    milestone: string | null;
  };
  metadata: Record<string, any>;
  sourceInfo: {
    name: string;
    freshness: string; // ISO timestamp
    reliability: 'high' | 'medium' | 'low';
  };
}

// Projects response with pagination
export interface ProjectsResponse {
  projects: ProjectInfo[];
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
 * GET /api/projects
 * Get projects with filtering, pagination, and sorting
 * Query parameters:
 *   projectType: filter by project type (optional)
 *   status: filter by status (optional)
 *   pincode: filter by PIN code (optional)
 *   minBudget: minimum budget in Crores (optional)
 *   maxBudget: maximum budget in Crores (optional)
 *   page: page number (default: 1)
 *   limit: results per page (default: 10)
 *   sortBy: field to sort by (default: budget)
 *   sortOrder: asc or desc (default: desc)
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const {
      projectType,
      status,
      pincode,
      minBudget,
      maxBudget,
      page = 1,
      limit = 10,
      sortBy = 'budget',
      sortOrder = 'desc'
    } = req.query as {
      projectType?: string;
      status?: string;
      pincode?: string;
      minBudget?: string;
      maxBudget?: string;
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
    
    // We'll search across multiple project types
    const projects: any[] = [];
    
    // Get infrastructure projects if requested or if no type specified
    if (!projectType || projectType === 'infra') {
      const infraProjects = await prisma.infraProject.findMany({
        where: {
          ...(pincode ? { pincodeCode: String(pincode).replace(/\D/g, '') } : {}),
          ...(status ? { status } : {}),
          ...(minBudget !== undefined && maxBudget !== undefined ? {
            budget: { gte: parseFloat(minBudget), lte: parseFloat(maxBudget) }
          } : {}),
          ...(minBudget !== undefined ? {
            budget: { gte: parseFloat(minBudget) }
          } : {}),
          ...(maxBudget !== undefined ? {
            budget: { lte: parseFloat(maxBudget) }
          } : {})
        },
        select: {
          id: true,
          titleEnglish: true,
          titleHindi: true,
          department: true,
          budget: true,
          startDate: true,
          expectedCompletion: true,
          status: true,
          claimCompletionPct: true,
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
      
      infraProjects.forEach(p => {
        projects.push({
          id: p.id,
          projectId: null,
          title: p.titleEnglish,
          description: null, // Not directly available in InfraProject
          projectType: 'infra',
          status: p.status,
          location: p.pincode ? {
            pincode: p.pincode.code,
            state: p.pincode.state,
            district: p.pincode.district
          } : null,
          financial: {
            budget: Number(p.budget),
            expenditure: null // Not directly available
          },
          timeline: {
            startDate: p.startDate?.toISOString() ?? null,
            endDate: p.expectedCompletion?.toISOString() ?? null,
            durationMonths: p.startDate && p.expectedCompletion ? 
              Math.floor((p.expectedCompletion.getTime() - p.startDate.getTime()) / (1000 * 60 * 60 * 24 * 30)) : 
              null
          },
          progress: {
            completionPercentage: Number(p.claimCompletionPct),
            milestone: null
          },
          metadata: {
            department: p.department,
            source: 'MoSPI'
          },
          sourceInfo: {
            name: 'MoSPI',
            freshness: p.updatedAt.toISOString(),
            reliability: 'high'
          }
        });
      });
    }
    
    // Get RERA projects if requested or if no type specified
    if (!projectType || projectType === 'rera') {
      const reraProjects = await prisma.reraProject.findMany({
        where: {
          ...(pincode ? { pincodeCode: String(pincode).replace(/\D/g, '') } : {}),
          ...(status ? { status } : {}),
          ...(minBudget !== undefined && maxBudget !== undefined ? {
            // RERA doesn't have budget in the same format, skip for now
          } : {})
        },
        select: {
          id: true,
          name: true,
          reraNumber: true,
          promoter: true,
          status: true,
          delayMonths: true,
          plannedPossession: true,
          actualPossession: true,
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
      
      reraProjects.forEach(p => {
        projects.push({
          id: p.id,
          projectId: p.reraNumber,
          title: p.name,
          description: null,
          projectType: 'rera',
          status: p.status,
          location: p.pincode ? {
            pincode: p.pincode.code,
            state: p.pincode.state,
            district: p.pincode.district
          } : null,
          financial: {
            budget: null, // Not directly available in RERA format
            expenditure: null
          },
          timeline: {
            startDate: null, // Not directly available
            endDate: p.actualPossession?.toISOString() ?? null,
            durationMonths: null
          },
          progress: {
            completionPercentage: null,
            milestone: p.delayMonths !== null && p.delayMonths !== 0 ? 
              Delayed by  months : 
              'On schedule'
          },
          metadata: {
            promoter: p.promoter,
            reraNumber: p.reraNumber,
            delayMonths: p.delayMonths
          },
          sourceInfo: {
            name: 'RERA',
            freshness: p.updatedAt.toISOString(),
            reliability: 'high'
          }
        });
      });
    }
    
    // Get contractor projects if requested or if no type specified
    if (!projectType || projectType === 'contractor') {
      const contractorProjects = await prisma.contractorProject.findMany({
        where: {
          ...(pincode ? { pincodeCode: String(pincode).replace(/\D/g, '') } : {}),
          ...(status ? { status } : {}),
          ...(minBudget !== undefined && maxBudget !== undefined ? {
            // ContractorProject doesn't have budget in the same format, skip for now
          } : {})
        },
        select: {
          id: true,
          name: true,
          projectName: true,
          status: true,
          pincode: {
            select: {
              code: true,
              state: true,
              district: true
            }
          },
          updatedAt: true,
          contractor: {
            select: {
              name: true
            }
          }
        }
      });
      
      contractorProjects.forEach(p => {
        projects.push({
          id: p.id,
          projectId: null,
          title: p.projectName || p.name,
          description: null,
          projectType: 'contractor',
          status: p.status,
          location: p.pincode ? {
            pincode: p.pincode.code,
            state: p.pincode.state,
            district: p.pincode.district
          } : null,
          financial: {
            budget: null,
            expenditure: null
          },
          timeline: {
            startDate: null,
            endDate: null,
            durationMonths: null
          },
          progress: {
            completionPercentage: null,
            milestone: null
          },
          metadata: {
            contractorName: p.contractor?.name,
            projectName: p.projectName
          },
          sourceInfo: {
            name: 'Contractor Project Registry',
            freshness: p.updatedAt.toISOString(),
            reliability: 'medium'
          }
        });
      });
    }
    
    // Sort projects
    if (sortBy === 'budget') {
      projects.sort((a, b) => {
        const budgetA = a.financial?.budget ?? 0;
        const budgetB = b.financial?.budget ?? 0;
        return validSortOrder === 'desc' ? budgetB - budgetA : budgetA - budgetB;
      });
    } else if (sortBy === 'title') {
      projects.sort((a, b) => {
        const titleA = a.title?.toLowerCase() ?? '';
        const titleB = b.title?.toLowerCase() ?? '';
        if (titleA < titleB) return validSortOrder === 'desc' ? 1 : -1;
        if (titleA > titleB) return validSortOrder === 'desc' ? -1 : 1;
        return 0;
      });
    }
    // Add more sort options as needed
    
    // Apply pagination
    const startIdx = (pageNum - 1) * limitNum;
    const endIdx = startIdx + limitNum;
    const paginatedProjects = projects.slice(startIdx, endIdx);
    
    res.json({
      projects: paginatedProjects,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: projects.length,
        totalPages: Math.ceil(projects.length / limitNum)
      },
      filters: {
        projectType,
        status,
        pincode,
        minBudget,
        maxBudget
      }
    });
  } catch (error) {
    console.error('[projects] Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/projects/:id
 * Get a specific project by ID
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const projectId = String(req.params.id);
    
    // Try to find the project in each type
    let project: any = null;
    let projectType: string = '';
    
    // Check infrastructure projects
    const infraProject = await prisma.infraProject.findUnique({
      where: { id: projectId },
      select: {
        id: true,
        titleEnglish: true,
        titleHindi: true,
        department: true,
        budget: true,
        startDate: true,
        expectedCompletion: true,
        status: true,
        claimCompletionPct: true,
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
    
    if (infraProject) {
      project = infraProject;
      projectType = 'infra';
    } else {
      // Check RERA projects
      const reraProject = await prisma.reraProject.findUnique({
        where: { id: projectId },
        select: {
          id: true,
          name: true,
          reraNumber: true,
          promoter: true,
          status: true,
          delayMonths: true,
          plannedPossession: true,
          actualPossession: true,
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
      
      if (reraProject) {
        project = reraProject;
        projectType = 'rera';
      } else {
        // Check contractor projects
        const contractorProject = await prisma.contractorProject.findUnique({
          where: { id: projectId },
          select: {
            id: true,
            name: true,
            projectName: true,
            status: true,
            pincode: {
              select: {
                code: true,
                state: true,
                district: true
              }
            },
            updatedAt: true,
            contractor: {
              select: {
                name: true
              }
            }
          }
        });
        
        if (contractorProject) {
          project = contractorProject;
          projectType = 'contractor';
        }
      }
    }
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    // Format response based on project type
    let formattedProject: any = null;
    
    if (projectType === 'infra') {
      formattedProject = {
        id: project.id,
        projectId: null,
        title: project.titleEnglish,
        description: null,
        projectType: 'infra',
        status: project.status,
        location: project.pincode ? {
          pincode: project.pincode.code,
          state: project.pincode.state,
          district: project.pincode.district
        } : null,
        financial: {
          budget: Number(project.budget),
          expenditure: null
        },
        timeline: {
          startDate: project.startDate?.toISOString() ?? null,
          endDate: project.expectedCompletion?.toISOString() ?? null,
          durationMonths: project.startDate && project.expectedCompletion ? 
            Math.floor((project.expectedCompletion.getTime() - project.startDate.getTime()) / (1000 * 60 * 60 * 24 * 30)) : 
            null
        },
        progress: {
          completionPercentage: Number(project.claimCompletionPct),
          milestone: null
        },
        metadata: {
          department: project.department,
          source: 'MoSPI'
        },
        sourceInfo: {
          name: 'MoSPI',
          freshness: project.updatedAt.toISOString(),
          reliability: 'high'
        }
      };
    } else if (projectType === 'rera') {
      formattedProject = {
        id: project.id,
        projectId: project.reraNumber,
        title: project.name,
        description: null,
        projectType: 'rera',
        status: project.status,
        location: project.pincode ? {
          pincode: project.pincode.code,
          state: project.pincode.state,
          district: project.pincode.district
        } : null,
        financial: {
          budget: null,
          expenditure: null
        },
        timeline: {
          startDate: null,
          endDate: project.actualPossession?.toISOString() ?? null,
          durationMonths: null
        },
        progress: {
          completionPercentage: null,
          milestone: project.delayMonths !== null && project.delayMonths !== 0 ? 
            Delayed by  months : 
            'On schedule'
        },
        metadata: {
          promoter: project.promoter,
          reraNumber: project.reraNumber,
          delayMonths: project.delayMonths
        },
        sourceInfo: {
          name: 'RERA',
          freshness: project.updatedAt.toISOString(),
          reliability: 'high'
        }
      };
    } else if (projectType === 'contractor') {
      formattedProject = {
        id: project.id,
        projectId: null,
        title: project.projectName || project.name,
        description: null,
        projectType: 'contractor',
        status: project.status,
        location: project.pincode ? {
          pincode: project.pincode.code,
          state: project.pincode.state,
          district: project.pincode.district
        } : null,
        financial: {
          budget: null,
          expenditure: null
        },
        timeline: {
          startDate: null,
          endDate: null,
          durationMonths: null
        },
        progress: {
          completionPercentage: null,
          milestone: null
        },
        metadata: {
          contractorName: project.contractor?.name,
          projectName: project.projectName
        },
        sourceInfo: {
          name: 'Contractor Project Registry',
          freshness: project.updatedAt.toISOString(),
          reliability: 'medium'
        }
      };
    }
    
    res.json(formattedProject);
  } catch (error) {
    console.error('[projects/:id] Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

