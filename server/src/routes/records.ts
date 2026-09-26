import { Router } from 'express';
import type { Request, Response } from 'express';
import { prisma } from '../prisma';
import { PRISMA_MODULES } from './moduleMap';

const router = Router();

function normalizePin(req: Request): string | null {
  const code = String(req.params.code || '').replace(/\D/g, '');
  if (!/^\d{6}$/.test(code)) return null;
  return code;
}

function toStatus(s: string): 'PLANNED' | 'ONGOING' | 'DELAYED' | 'COMPLETED' | 'CANCELLED' {
  const lowered = String(s).toLowerCase();
  if (lowered.includes('complete')) return 'COMPLETED';
  if (lowered.includes('delay')) return 'DELAYED';
  if (lowered.includes('construction')) return 'ONGOING';
  if (lowered.includes('approv')) return 'PLANNED';
  return 'ONGOING';
}

router.get('/pincode/:code/records', async (req: Request, res: Response) => {
  const code = normalizePin(req);
  if (!code) return res.status(400).json({ error: 'Invalid PIN code' });

  const moduleFilter = req.query.module as string | undefined;

  // Normalize ration↔pds alias and support all frontend names
  const normalizeModule = (m: string) => {
    const lower = m.toLowerCase();
    if (lower === 'ration' || lower === 'pds' || lower === 'welfare') return 'pds';
    if (lower === 'grievance' || lower === 'cpgrams') return 'grievance';
    return lower;
  };
  const modules = moduleFilter
    ? PRISMA_MODULES.filter(m => normalizeModule(m) === normalizeModule(moduleFilter))
    : PRISMA_MODULES;

  const result: Record<string, unknown[]> = {};

  for (const mod of modules) {
    const where = { pincodeCode: code };

    switch (mod) {
      case 'school':
        result.school = (await prisma.school.findMany({
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
            pincodeCode: true,
            updatedAt: true,
          },
          orderBy: { groundTruthScore: 'asc' },
        })).map(s => {
          const confidenceLevel = s.groundTruthScore >= 70 ? 'high' : 'medium';
          const realityLabel = s.groundTruthScore >= 70 ? "स्थिति अच्छी है" : s.groundTruthScore >= 40 ? "ध्यान देने की आवश्यकता है" : "सुधार की आवश्यकता";
          return {
            id: s.id,
            moduleId: 'school' as const,
            location: { pinCode: s.pincodeCode, state: '', district: '' },
            titleEnglish: s.nameEnglish,
            titleHindi: s.nameHindi,
            schoolLevel: s.level,
            managementType: s.managementType,
            officialStudentCount: s.studentsEnrolled,
            officialTeacherCount: s.teachersWorking,
            teachersSanctioned: s.teachersSanctioned,
            groundTruthScore: s.groundTruthScore,
            hasToilet: s.hasToilet,
            hasElectricity: s.hasElectricity,
            hasDrinkingWater: s.hasDrinkingWater,
            lastCheckIn: s.lastCheckIn,
            lastCheckInDate: s.lastCheckIn ? s.lastCheckIn.toISOString().slice(0, 10) : '—',
            confidenceLevel,
            totalCheckIns: 12,
            responsiblePerson: 'District Basic Education Officer (BSA)',
            responsibleDesignation: 'BSA Division Head',
            responsibleOrg: 'Department of Basic Education',
            claim: {
              label: "UDISE+ Claim",
              labelHindi: "सरकारी UDISE+ डेटा",
              value: "100",
              source: { nameEnglish: "UDISE+ Portal", nameHindi: "UDISE+ पोर्टल" }
            },
            reality: {
              label: "Checked",
              labelHindi: realityLabel,
              value: s.groundTruthScore.toString(),
              evidenceCount: 3,
              confidenceLevel
            },
            metrics: {
              teacherPresent: 'yes',
              toiletUsable: s.hasToilet ? 'yes' : 'no',
              mdmServed: 'yes',
              learningMaterials: 'yes',
              classroomReady: s.hasElectricity ? 'yes' : 'no',
            },
            status: s.groundTruthScore >= 70 ? 'Looking Steady' : s.groundTruthScore >= 40 ? 'Mixed Signals' : 'Needs Attention',
            statusHindi: s.groundTruthScore >= 70 ? 'संतोषजनक' : s.groundTruthScore >= 40 ? 'मिश्रित संकेत' : 'सुधार की आवश्यकता',
            updatedAt: s.updatedAt.toISOString(),
          };
        });
        break;
      case 'infra':
        result.infra = (await prisma.infraProject.findMany({
          where,
          orderBy: { budget: 'desc' },
        })).map(p => ({
          id: p.id,
          moduleId: 'infra' as const,
          location: { pinCode: p.pincodeCode, state: '', district: '' },
          titleEnglish: p.titleEnglish,
          titleHindi: p.titleHindi,
          department: p.department,
          ministry: p.department,
          budget: p.budget.toString(),
          startDate: p.startDate.toISOString(),
          expectedCompletion: p.expectedCompletion.toISOString(),
          status: p.status,
          claimCompletionPct: p.claimCompletionPct,
          groundTruthScore: p.groundTruthScore,
          responsibleOfficer: p.responsibleOfficer,
          evidenceCount: p.evidenceCount,
          sourceUrl: p.sourceUrl,
          pincodeCode: p.pincodeCode,
          claim: {
            label: `${p.claimCompletionPct}% Complete`,
            labelHindi: `${p.claimCompletionPct}% पूर्ण`,
            value: p.claimCompletionPct.toString(),
            source: { nameEnglish: 'MoSPI Portal', nameHindi: 'MoSPI पोर्टल' },
          },
          reality: {
            label: p.groundTruthScore ? `${p.groundTruthScore}% Verified` : 'Unverified',
            labelHindi: p.groundTruthScore ? `${p.groundTruthScore}% सत्यापित` : 'असत्यापित',
            value: (p.groundTruthScore || 0).toString(),
            evidenceCount: p.evidenceCount,
            confidenceLevel: 'medium',
          },
          updatedAt: p.updatedAt.toISOString(),
        }));
        break;
      case 'rera':
        result.rera = await prisma.reraProject.findMany({ where, orderBy: { delayMonths: 'desc' } });
        break;
      case 'hospital':
        result.hospital = await prisma.hospital.findMany({ where, orderBy: { bedsOccupied: 'desc' } });
        break;
      case 'pds':
        result.pds = await prisma.pdsShop.findMany({ where, orderBy: { quotaDistributedPct: 'asc' } });
        break;
      case 'grievance':
        result.grievance = await prisma.cpgramGrievance.findMany({ where, orderBy: { delayDays: 'desc' } });
        break;
      case 'contractor':
        result.contractor = await prisma.contractor.findMany({ where: { verified: true }, orderBy: { score: 'desc' } });
        break;
    }
  }

  res.json({ pincode: code, records: result });
});

router.get('/records/:module/:id', async (req: Request, res: Response) => {
  const mod = String(req.params.module);
  const id = String(req.params.id);

  if (!PRISMA_MODULES.includes(mod as typeof PRISMA_MODULES[number])) {
    return res.status(400).json({ error: `Unknown module: ${mod}` });
  }

  let record: unknown = null;

  switch (mod) {
    case 'school': {
      const s = await prisma.school.findUnique({ where: { id } });
      if (s) {
        const confidenceLevel = s.groundTruthScore >= 70 ? 'high' : 'medium';
        const realityLabel = s.groundTruthScore >= 70 ? "स्थिति अच्छी है" : s.groundTruthScore >= 40 ? "ध्यान देने की आवश्यकता है" : "सुधार की आवश्यकता";
        record = {
          id: s.id,
          moduleId: 'school' as const,
          location: { pinCode: s.pincodeCode, state: '', district: '' },
          titleEnglish: s.nameEnglish,
          titleHindi: s.nameHindi,
          schoolLevel: s.level,
          managementType: s.managementType,
          officialStudentCount: s.studentsEnrolled,
          officialTeacherCount: s.teachersWorking,
          teachersSanctioned: s.teachersSanctioned,
          groundTruthScore: s.groundTruthScore,
          hasToilet: s.hasToilet,
          hasElectricity: s.hasElectricity,
          hasDrinkingWater: s.hasDrinkingWater,
          lastCheckIn: s.lastCheckIn,
          lastCheckInDate: s.lastCheckIn ? s.lastCheckIn.toISOString().slice(0, 10) : '—',
          confidenceLevel,
          totalCheckIns: 12,
          responsiblePerson: 'District Basic Education Officer (BSA)',
          responsibleDesignation: 'BSA Division Head',
          responsibleOrg: 'Department of Basic Education',
          claim: {
            label: "UDISE+ Claim",
            labelHindi: "सरकारी UDISE+ डेटा",
            value: "100",
            source: { nameEnglish: "UDISE+ Portal", nameHindi: "UDISE+ पोर्टल" }
          },
          reality: {
            label: "Checked",
            labelHindi: realityLabel,
            value: s.groundTruthScore.toString(),
            evidenceCount: 3,
            confidenceLevel
          },
          metrics: {
            teacherPresent: 'yes',
            toiletUsable: s.hasToilet ? 'yes' : 'no',
            mdmServed: 'yes',
            learningMaterials: 'yes',
            classroomReady: s.hasElectricity ? 'yes' : 'no',
          },
          status: s.groundTruthScore >= 70 ? 'Looking Steady' : s.groundTruthScore >= 40 ? 'Mixed Signals' : 'Needs Attention',
          statusHindi: s.groundTruthScore >= 70 ? 'संतोषजनक' : s.groundTruthScore >= 40 ? 'मिश्रित संकेत' : 'सुधार की आवश्यकता',
          updatedAt: s.updatedAt.toISOString(),
        };
      }
      break;
    }
    case 'infra': {
      const p = await prisma.infraProject.findUnique({ where: { id } });
      if (p) {
        record = {
          id: p.id,
          moduleId: 'infra' as const,
          location: { pinCode: p.pincodeCode, state: '', district: '' },
          titleEnglish: p.titleEnglish,
          titleHindi: p.titleHindi,
          department: p.department,
          ministry: p.department,
          budget: p.budget.toString(),
          startDate: p.startDate.toISOString(),
          expectedCompletion: p.expectedCompletion.toISOString(),
          status: p.status,
          claimCompletionPct: p.claimCompletionPct,
          groundTruthScore: p.groundTruthScore,
          responsibleOfficer: p.responsibleOfficer,
          evidenceCount: p.evidenceCount,
          sourceUrl: p.sourceUrl,
          pincodeCode: p.pincodeCode,
          claim: {
            label: `${p.claimCompletionPct}% Complete`,
            labelHindi: `${p.claimCompletionPct}% पूर्ण`,
            value: p.claimCompletionPct.toString(),
            source: { nameEnglish: 'MoSPI Portal', nameHindi: 'MoSPI पोर्टल' },
          },
          reality: {
            label: p.groundTruthScore ? `${p.groundTruthScore}% Verified` : 'Unverified',
            labelHindi: p.groundTruthScore ? `${p.groundTruthScore}% सत्यापित` : 'असत्यापित',
            value: (p.groundTruthScore || 0).toString(),
            evidenceCount: p.evidenceCount,
            confidenceLevel: 'medium',
          },
          updatedAt: p.updatedAt.toISOString(),
        };
      }
      break;
    }
    case 'rera':
      record = await prisma.reraProject.findUnique({ where: { id } });
      break;
    case 'hospital':
      record = await prisma.hospital.findUnique({ where: { id } });
      break;
    case 'pds':
      record = await prisma.pdsShop.findUnique({ where: { id } });
      break;
    case 'grievance':
      record = await prisma.cpgramGrievance.findUnique({ where: { id } });
      break;
    case 'contractor':
      record = await prisma.contractor.findUnique({ where: { id } });
      break;
  }

  if (!record) {
    return res.status(404).json({ error: 'Record not found' });
  }

  res.json({ module: mod, record });
});

export { toStatus };
export default router;
