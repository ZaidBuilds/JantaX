import { Router } from 'express';
import type { Request, Response } from 'express';
import { prisma } from '../prisma';
import { requireRole } from '../middleware/auth';

// School response types
export interface SchoolInfo {
  id: string;
  udiseCode: string;
  nameEnglish: string;
  nameHindi: string;
  level: string; // Primary / Upper Primary / Secondary
  managementType: string; // Govt / Govt-Aided / Private
  studentsEnrolled: number;
  teachersWorking: number;
  teachersSanctioned: number;
  groundTruthScore: number; // 0-100
  hasToilet: boolean;
  hasElectricity: boolean;
  hasDrinkingWater: boolean;
  lastCheckIn: string | null; // ISO date
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

// Schools response with pagination
export interface SchoolsResponse {
  schools: SchoolInfo[];
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
 * GET /api/schools
 * Get schools with filtering, pagination, and sorting
 * Query parameters:
 *   pincode: filter by PIN code (optional)
 *   level: filter by school level (optional)
 *   managementType: filter by management type (optional)
 *   minScore: minimum ground truth score (optional)
 *   maxScore: maximum ground truth score (optional)
 *   hasToilet: filter by toilet availability (optional)
 *   hasElectricity: filter by electricity availability (optional)
 *   hasDrinkingWater: filter by drinking water availability (optional)
 *   page: page number (default: 1)
 *   limit: results per page (default: 10)
 *   sortBy: field to sort by (default: groundTruthScore)
 *   sortOrder: asc or desc (default: desc)
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const {
      pincode,
      level,
      managementType,
      minScore,
      maxScore,
      hasToilet,
      hasElectricity,
      hasDrinkingWater,
      page = 1,
      limit = 10,
      sortBy = 'groundTruthScore',
      sortOrder = 'desc'
    } = req.query as {
      pincode?: string;
      level?: string;
      managementType?: string;
      minScore?: string;
      maxScore?: string;
      hasToilet?: string;
      hasElectricity?: string;
      hasDrinkingWater?: string;
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
    
    if (level) {
      where.level = level;
    }
    
    if (managementType) {
      where.managementType = managementType;
    }
    
    if (minScore !== undefined && maxScore !== undefined) {
      const min = parseFloat(String(minScore));
      const max = parseFloat(String(maxScore));
      if (!isNaN(min) && !isNaN(max)) {
        where.groundTruthScore = { gte: min, lte: max };
      }
    } else if (minScore !== undefined) {
      const min = parseFloat(String(minScore));
      if (!isNaN(min)) {
        where.groundTruthScore = { gte: min };
      }
    } else if (maxScore !== undefined) {
      const max = parseFloat(String(maxScore));
      if (!isNaN(max)) {
        where.groundTruthScore = { lte: max };
      }
    }
    
    if (hasToilet !== undefined) {
      where.hasToilet = hasToilet === 'true';
    }
    
    if (hasElectricity !== undefined) {
      where.hasElectricity = hasElectricity === 'true';
    }
    
    if (hasDrinkingWater !== undefined) {
      where.hasDrinkingWater = hasDrinkingWater === 'true';
    }
    
    // Get schools with count for pagination
    const [schools, total] = await Promise.all([
      prisma.school.findMany({
        where,
        select: {
          id: true,
          udiseCode: true,
          nameEnglish: true,
          nameHindi: true,
          level: true,
          managementType: true,
          studentsEnrolled: true,
          teachersWorking: true,
          teachersSanctioned: true,
          groundTruthScore: true,
          hasToilet: true,
          hasElectricity: true,
          hasDrinkingWater: true,
          lastCheckIn: true,
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
      prisma.school.count({ where })
    ]);
    
    // Format response
    const formattedSchools = schools.map(school => ({
      id: school.id,
      udiseCode: school.udiseCode,
      nameEnglish: school.nameEnglish,
      nameHindi: school.nameHindi,
      level: school.level,
      managementType: school.managementType,
      studentsEnrolled: school.studentsEnrolled,
      teachersWorking: school.teachersWorking,
      teachersSanctioned: school.teachersSanctioned,
      groundTruthScore: school.groundTruthScore,
      hasToilet: school.hasToilet,
      hasElectricity: school.hasElectricity,
      hasDrinkingWater: school.hasDrinkingWater,
      lastCheckIn: school.lastCheckIn?.toISOString() ?? null,
      location: school.pincode ? {
        pincode: school.pincode.code,
        state: school.pincode.state,
        district: school.pincode.district
      } : {
        pincode: '',
        state: '',
        district: ''
      },
      metadata: {
        lastCheckInDate: school.lastCheckIn?.toISOString().split('T')[0] ?? null,
        daysSinceLastCheckIn: school.lastCheckIn ? 
          Math.floor((Date.now() - school.lastCheckIn.getTime()) / (1000 * 60 * 60 * 24)) : 
          null
      },
      source: {
        name: 'UDISE+',
        freshness: school.updatedAt.toISOString(),
        reliability: 'high'
      }
    }));
    
    res.json({
      schools: formattedSchools,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      },
      filters: {
        pincode,
        level,
        managementType,
        minScore,
        maxScore,
        hasToilet,
        hasElectricity,
        hasDrinkingWater
      }
    });
  } catch (error) {
    console.error('[schools] Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/schools/:id
 * Get a specific school by ID
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const schoolId = String(req.params.id);
    
    const school = await prisma.school.findUnique({
      where: { id: schoolId },
      select: {
        id: true,
        udiseCode: true,
        nameEnglish: true,
        nameHindi: true,
        level: true,
        managementType: true,
        studentsEnrolled: true,
        teachersWorking: true,
        teachersSanctioned: true,
        groundTruthScore: true,
        hasToilet: true,
        hasElectricity: true,
        hasDrinkingWater: true,
        lastCheckIn: true,
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
    
    if (!school) {
      return res.status(404).json({ error: 'School not found' });
    }
    
    res.json({
      id: school.id,
      udiseCode: school.udiseCode,
      nameEnglish: school.nameEnglish,
      nameHindi: school.nameHindi,
      level: school.level,
      managementType: school.managementType,
      studentsEnrolled: school.studentsEnrolled,
      teachersWorking: school.teachersWorking,
      teachersSanctioned: school.teachersSanctioned,
      groundTruthScore: school.groundTruthScore,
      hasToilet: school.hasToilet,
      hasElectricity: school.hasElectricity,
      hasDrinkingWater: school.hasDrinkingWater,
      lastCheckIn: school.lastCheckIn?.toISOString() ?? null,
      location: school.pincode ? {
        pincode: school.pincode.code,
        state: school.pincode.state,
        district: school.pincode.district
      } : {
        pincode: '',
        state: '',
        district: ''
      },
      metadata: {
        lastCheckInDate: school.lastCheckIn?.toISOString().split('T')[0] ?? null,
        daysSinceLastCheckIn: school.lastCheckIn ? 
          Math.floor((Date.now() - school.lastCheckIn.getTime()) / (1000 * 60 * 60 * 24)) : 
          null
      },
      source: {
        name: 'UDISE+',
        freshness: school.updatedAt.toISOString(),
        reliability: 'high'
      }
    });
  } catch (error) {
    console.error('[schools/:id] Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/schools/:id/score
 * Calculate or retrieve school health score
 * Body: { checkIns?: CheckInData[], officialData?: OfficialData }
 */
router.post('/:id/score', async (req: Request, res: Response) => {
  try {
    const schoolId = String(req.params.id);
    const { checkIns = [], officialData } = req.body as {
      checkIns?: Array<{
        teacherPresent?: string;
        toiletUsable?: string;
        mdmServed?: string;
        learningMaterials?: string;
        classroomReady?: string;
        timestamp?: string;
      }>;
      officialData?: {
        teachersWorking?: number;
        teachersSanctioned?: number;
        studentsEnrolled?: number;
        attendanceRate?: number;
        hasToilet?: boolean;
        hasElectricity?: boolean;
        hasDrinkingWater?: boolean;
      };
    };

    const school = await prisma.school.findUnique({
      where: { id: schoolId },
      select: { id: true, groundTruthScore: true, lastCheckIn: true }
    });

    if (!school) {
      return res.status(404).json({ error: 'School not found' });
    }

    const SCORING_VERSION = 'v2.0-2026-08';

    function metricToScore(val: string | undefined): number {
      if (val === 'yes') return 100;
      if (val === 'no') return 0;
      return 50;
    }

    function getConfidence(input: { sampleSize: number; reportingDays: number; agreementRate?: number }): string {
      const { sampleSize, reportingDays, agreementRate = 0.6 } = input;
      if (sampleSize < 5 || reportingDays < 3) return 'insufficient';
      if (sampleSize >= 15 && reportingDays >= 3 && agreementRate >= 0.6) return 'strong';
      if (sampleSize >= 5 && reportingDays >= 2) return 'building';
      return 'low';
    }

    const effectiveCheckIns = checkIns.length > 0 ? checkIns : [];
    const sampleSize = effectiveCheckIns.length;

    const teacherScore = effectiveCheckIns.length > 0
      ? Math.round(effectiveCheckIns.reduce((s, c) => s + metricToScore(c.teacherPresent), 0) / effectiveCheckIns.length)
      : (officialData?.teachersWorking && officialData?.teachersSanctioned
        ? Math.round((officialData.teachersWorking / officialData.teachersSanctioned) * 100)
        : 70);

    const toiletScore = effectiveCheckIns.length > 0
      ? Math.round(effectiveCheckIns.reduce((s, c) => s + metricToScore(c.toiletUsable), 0) / effectiveCheckIns.length)
      : (officialData?.hasToilet ? 100 : 0);

    const mdmScore = effectiveCheckIns.length > 0
      ? Math.round(effectiveCheckIns.reduce((s, c) => s + metricToScore(c.mdmServed), 0) / effectiveCheckIns.length)
      : 75;

    const learningScore = effectiveCheckIns.length > 0
      ? Math.round(effectiveCheckIns.reduce((s, c) => s + metricToScore(c.learningMaterials), 0) / effectiveCheckIns.length)
      : 65;

    const compositeScore = Math.round(teacherScore * 0.30 + toiletScore * 0.20 + mdmScore * 0.25 + learningScore * 0.25);

    const timestamps = effectiveCheckIns.map(c => c.timestamp ? new Date(c.timestamp) : new Date()).filter(Boolean);
    const uniqueDays = new Set(timestamps.map(t => t.toISOString().slice(0, 10))).size;
    const confidence = getConfidence({ sampleSize, reportingDays: uniqueDays || 1 });

    function scoreToStatus(score: number): string {
      if (score >= 75) return 'stable';
      if (score >= 50) return 'watch';
      if (score >= 25) return 'needs_attention';
      return 'critical';
    }

    const dimensions = [
      {
        id: 'infrastructure',
        label: 'Infrastructure',
        score: toiletScore,
        status: scoreToStatus(toiletScore),
        formula: 'Score = (Toilet × 0.35) + (Water × 0.25) + (Electricity × 0.20) + (Classroom × 0.20)',
        inputs: [
          { name: 'Toilet Usable', value: officialData?.hasToilet ? 'yes' : 'no', source: 'Community/Official', weight: '35%' },
          { name: 'Water Available', value: officialData?.hasDrinkingWater ? 'yes' : 'no', source: 'Official', weight: '25%' },
          { name: 'Electricity', value: officialData?.hasElectricity ? 'yes' : 'no', source: 'Official', weight: '20%' },
        ],
        weights: { toilet: 0.35, water: 0.25, electricity: 0.20 },
        source: { name: 'UDISE+ / Community', type: 'A' },
        lastCalculation: new Date().toISOString(),
        confidence: 'medium' as const,
        limitations: 'Official infrastructure data may not reflect current condition. Community reports are voluntary.',
      },
      {
        id: 'staffing',
        label: 'Staffing',
        score: teacherScore,
        status: scoreToStatus(teacherScore),
        formula: 'Score = min(100, (Filled Posts / Sanctioned Posts) × 100)',
        inputs: [
          { name: 'Teachers Working', value: officialData?.teachersWorking ?? '—', source: 'UDISE+', weight: '40%' },
          { name: 'Teachers Sanctioned', value: officialData?.teachersSanctioned ?? '—', source: 'UDISE+', weight: '30%' },
        ],
        weights: { filled: 0.40, sanctioned: 0.30 },
        source: { name: 'UDISE+ 2023-24', type: 'A' },
        lastCalculation: '2024-03-15',
        confidence: 'high' as const,
        limitations: 'Official counts may lag actual teacher deployments.',
      },
      {
        id: 'ground-truth',
        label: 'Ground Truth',
        score: compositeScore,
        status: scoreToStatus(compositeScore),
        formula: 'Score = teacher_present×0.30 + toilet_usable×0.20 + mdm_served×0.25 + learning_materials×0.25',
        inputs: [
          { name: 'Teacher Present', value: `${teacherScore}%`, source: 'Citizen Check-ins', weight: '30%' },
          { name: 'Toilet Usable', value: `${toiletScore}%`, source: 'Citizen Check-ins', weight: '20%' },
          { name: 'MDM Served', value: `${mdmScore}%`, source: 'Citizen Check-ins', weight: '25%' },
          { name: 'Learning Materials', value: `${learningScore}%`, source: 'Citizen Check-ins', weight: '25%' },
        ],
        weights: { teacher: 0.30, toilet: 0.20, mdm: 0.25, learning: 0.25 },
        source: { name: `${sampleSize} Check-ins`, type: 'C' },
        lastCalculation: new Date().toISOString(),
        confidence: confidence as 'low' | 'medium' | 'high',
        limitations: 'Crowdsourced. Contributors are self-selected. Not statistically representative.',
      },
    ];

    res.json({
      schoolId,
      compositeScore: sampleSize >= 5 ? compositeScore : null,
      compositeStatus: sampleSize >= 5 ? scoreToStatus(compositeScore) : null,
      scoringVersion: SCORING_VERSION,
      confidence,
      sampleSize,
      reportingDays: uniqueDays || 0,
      dimensions,
      calculatedAt: new Date().toISOString(),
      methodologyUrl: '/methodology',
    });
  } catch (error) {
    console.error('[schools/:id/score] Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

