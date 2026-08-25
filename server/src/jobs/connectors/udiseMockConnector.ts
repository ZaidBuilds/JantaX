import type { SourceConnector, FetchResult, ValidationResult, ParsedRow, NormalizedEntity, ChangeSet } from '../connector';
import { prisma } from '../../prisma';

// Mock CSV for UDISE+ — 2 schools, same as seed but as CSV
const MOCK_CSV = `udiseCode,nameEnglish,nameHindi,level,managementType,studentsEnrolled,teachersWorking,teachersSanctioned,groundTruthScore,hasToilet,hasElectricity,hasDrinkingWater,pincodeCode
07011000101,Govt Primary School New Delhi Sector A9,राजकीय प्राथमिक विद्यालय नई दिल्ली,Primary,Government,85,4,5,68,true,true,true,110001
07011000102,Govt School 110001-1,सरकारी स्कूल 110001-1,Primary,Government,100,5,6,75,true,false,true,110001
`;

export function createUdiseMockConnector(): SourceConnector {
  return {
    sourceId: 'src_udise_2324',
    schedule: 'annual',
    async fetch(): Promise<FetchResult> {
      const buffer = Buffer.from(MOCK_CSV, 'utf-8');
      const hash = require('crypto').createHash('sha256').update(buffer).digest('hex');
      return {
        url: 'https://udiseplus.gov.in/p/dataset/mock.csv',
        contentType: 'text/csv',
        size: buffer.length,
        hash,
        buffer,
        fetchedAt: new Date(),
      };
    },
    async validate(buffer: Buffer, contentType: string): Promise<ValidationResult> {
      const text = buffer.toString('utf-8');
      const lines = text.trim().split('\n');
      const errors: any[] = [];
      const warnings: any[] = [];
      if (!contentType.includes('csv')) warnings.push({ row: 0, field: 'contentType', message: 'Expected csv' });
      if (lines.length < 2) errors.push({ row: 0, field: 'csv', message: 'No data rows' });
      const header = lines[0].split(',');
      const required = ['udiseCode','nameEnglish','pincodeCode'];
      for (const f of required) if (!header.includes(f)) errors.push({ row: 0, field: f, message: `Missing header ${f}` });
      // Validate each row has 6-digit pincode and udise
      for (let i=1;i<lines.length;i++) {
        const cols = lines[i].split(',');
        if (cols[0] && !/^0701/.test(cols[0])) warnings.push({ row: i, field: 'udiseCode', message: 'Unexpected udise prefix' });
        const pin = cols[12] || cols[cols.length-1];
        if (pin && !/^\d{6}$/.test(pin)) errors.push({ row: i, field: 'pincodeCode', message: `Invalid PIN ${pin}` });
      }
      return { isValid: errors.length===0, errors, warnings };
    },
    async parse(buffer: Buffer, _contentType: string): Promise<ParsedRow[]> {
      const text = buffer.toString('utf-8');
      const lines = text.trim().split('\n');
      const header = lines[0].split(',');
      return lines.slice(1).map((line, idx)=>{
        const cols = line.split(',');
        const row: any = {};
        header.forEach((h,i)=> row[h]=cols[i]);
        // Coerce booleans and ints
        row.studentsEnrolled = parseInt(row.studentsEnrolled)||0;
        row.teachersWorking = parseInt(row.teachersWorking)||0;
        row.teachersSanctioned = parseInt(row.teachersSanctioned)||0;
        row.groundTruthScore = parseInt(row.groundTruthScore)||60;
        row.hasToilet = row.hasToilet==='true';
        row.hasElectricity = row.hasElectricity==='true';
        row.hasDrinkingWater = row.hasDrinkingWater==='true';
        return row;
      });
    },
    async normalize(rows: ParsedRow[]): Promise<NormalizedEntity[]> {
      return rows.map(r=>({
        entityType: 'School',
        entityId: r.udiseCode,
        data: {
          udiseCode: r.udiseCode,
          nameEnglish: r.nameEnglish,
          nameHindi: r.nameHindi,
          level: r.level,
          managementType: r.managementType,
          studentsEnrolled: r.studentsEnrolled,
          teachersWorking: r.teachersWorking,
          teachersSanctioned: r.teachersSanctioned,
          groundTruthScore: r.groundTruthScore,
          hasToilet: r.hasToilet,
          hasElectricity: r.hasElectricity,
          hasDrinkingWater: r.hasDrinkingWater,
          pincodeCode: r.pincodeCode,
        },
        sourceId: 'src_udise_2324',
      }));
    },
    async detectChanges(normalized: NormalizedEntity[]): Promise<ChangeSet> {
      const existing = await prisma.school.findMany({ where: { udiseCode: { in: normalized.map(n=>n.entityId) } } });
      const existingMap = new Map(existing.map(e=>[e.udiseCode, e]));
      const newRecords: NormalizedEntity[] = [];
      const updatedRecords: { before: NormalizedEntity; after: NormalizedEntity }[] = [];
      const correctedRecords: { before: NormalizedEntity; after: NormalizedEntity }[] = [];
      let schemaChanged = false;
      // Simple schema check: if any normalized has missing required field, flag
      for (const n of normalized) {
        if (!n.data.udiseCode || !n.data.pincodeCode) schemaChanged = true;
        const before = existingMap.get(n.entityId);
        if (!before) {
          newRecords.push(n);
        } else {
          // Compare fields
          const changed = before.nameEnglish !== n.data.nameEnglish || before.groundTruthScore !== n.data.groundTruthScore;
          const isCorrection = before.hasToilet !== n.data.hasToilet;
          if (changed) {
            const beforeNorm: NormalizedEntity = { entityType:'School', entityId:before.udiseCode, data:before as any, sourceId:'src_udise_2324' };
            if (isCorrection) correctedRecords.push({ before: beforeNorm, after: n });
            else updatedRecords.push({ before: beforeNorm, after: n });
          }
        }
      }
      // Deleted: in DB but not in normalized (for this PIN scope) — we treat as not deleted for PoC (preserve)
      const deletedRecords: NormalizedEntity[] = [];
      return { newRecords, updatedRecords, deletedRecords, correctedRecords, schemaChanged };
    },
    async sync(changes: ChangeSet): Promise<{ inserted: number; updated: number; deleted: number }> {
      let inserted=0, updated=0;
      for (const n of changes.newRecords) {
        await prisma.school.create({
          data: {
            udiseCode: n.data.udiseCode,
            nameEnglish: n.data.nameEnglish,
            nameHindi: n.data.nameHindi,
            level: n.data.level,
            managementType: n.data.managementType,
            studentsEnrolled: n.data.studentsEnrolled,
            teachersWorking: n.data.teachersWorking,
            teachersSanctioned: n.data.teachersSanctioned,
            groundTruthScore: n.data.groundTruthScore,
            hasToilet: n.data.hasToilet,
            hasElectricity: n.data.hasElectricity,
            hasDrinkingWater: n.data.hasDrinkingWater,
            pincodeCode: n.data.pincodeCode,
          }
        });
        inserted++;
      }
      for (const { after } of [...changes.updatedRecords, ...changes.correctedRecords]) {
        await prisma.school.update({
          where: { udiseCode: after.entityId },
          data: {
            nameEnglish: after.data.nameEnglish,
            nameHindi: after.data.nameHindi,
            studentsEnrolled: after.data.studentsEnrolled,
            teachersWorking: after.data.teachersWorking,
            groundTruthScore: after.data.groundTruthScore,
            hasToilet: after.data.hasToilet,
          }
        });
        updated++;
      }
      // Do not delete — preserve previous versions per spec
      return { inserted, updated, deleted: 0 };
    },
  };
}
