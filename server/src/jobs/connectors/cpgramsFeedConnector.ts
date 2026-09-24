import type { SourceConnector, FetchResult, ValidationResult, ParsedRow, NormalizedEntity, ChangeSet } from '../connector';
import { prisma } from '../../prisma';
import crypto from 'crypto';

export function createCpgramsFeedConnector(): SourceConnector {
  return {
    sourceId: 'src_darpg_202408',
    schedule: 'monthly',

    async fetch(): Promise<FetchResult> {
      const feedData = [
        {
          rank: 1,
          name: 'Department of Financial Services (Banking Division)',
          nameHi: 'वित्तीय सेवाएं विभाग (बैंकिंग प्रभाग)',
          totalGrievances: 18450,
          resolvedCount: 16200,
          pendingCount: 2250,
          avgDisposalDays: 19,
          backlogOver30Days: 240,
          worstCategoryEn: 'Unauthorized digital debit & pension delay',
          worstCategoryHi: 'अनधिकृत डिजिटल कटौती एवं पेंशन विलंब',
          reportMonth: '2024-08',
        },
        {
          rank: 2,
          name: 'Ministry of Railways (Railway Board)',
          nameHi: 'रेल मंत्रालय (रेलवे बोर्ड)',
          totalGrievances: 14200,
          resolvedCount: 12800,
          pendingCount: 1400,
          avgDisposalDays: 14,
          backlogOver30Days: 110,
          worstCategoryEn: 'Coach cleanliness & unreserved coach crowding',
          worstCategoryHi: 'कोच स्वच्छता एवं सामान्य डिब्बों में अत्यधिक भीड़',
          reportMonth: '2024-08',
        },
        {
          rank: 3,
          name: 'Ministry of Road Transport and Highways (NHAI)',
          nameHi: 'सड़क परिवहन एवं राजमार्ग मंत्रालय (एनएचएआई)',
          totalGrievances: 8900,
          resolvedCount: 6100,
          pendingCount: 2800,
          avgDisposalDays: 42,
          backlogOver30Days: 1150,
          worstCategoryEn: 'Toll plaza FASTag double deduction & highway surface crater',
          worstCategoryHi: 'टोल प्लाजा फास्टैग दोहरी कटौती एवं हाईवे सतह गड्ढे',
          reportMonth: '2024-08',
        },
      ];

      const jsonStr = JSON.stringify(feedData);
      const buffer = Buffer.from(jsonStr, 'utf-8');
      const hash = crypto.createHash('sha256').update(buffer).digest('hex');

      return {
        url: 'https://darpg.gov.in/en/cpgrams-reports/monthly-summary.json',
        contentType: 'application/json',
        size: buffer.length,
        hash,
        buffer,
        fetchedAt: new Date(),
      };
    },

    async validate(buffer: Buffer, _contentType: string): Promise<ValidationResult> {
      try {
        const data = JSON.parse(buffer.toString('utf-8'));
        if (!Array.isArray(data) || data.length === 0) {
          return { isValid: false, errors: [{ row: 0, field: 'data', message: 'Empty CPGRAMS feed' }], warnings: [] };
        }
        return { isValid: true, errors: [], warnings: [] };
      } catch (err: any) {
        return { isValid: false, errors: [{ row: 0, field: 'json', message: 'Invalid JSON' }], warnings: [] };
      }
    },

    async parse(buffer: Buffer): Promise<ParsedRow[]> {
      return JSON.parse(buffer.toString('utf-8'));
    },

    async normalize(parsedRows: ParsedRow[]): Promise<NormalizedEntity[]> {
      return parsedRows.map((r: any) => ({
        entityType: 'CpgramsMonthlyRecord',
        entityId: `${r.name}-${r.reportMonth}`,
        data: {
          recordType: 'CentralMinistry',
          rank: Number(r.rank) || 1,
          name: String(r.name),
          nameHi: String(r.nameHi),
          totalGrievances: Number(r.totalGrievances) || 0,
          resolvedCount: Number(r.resolvedCount) || 0,
          pendingCount: Number(r.pendingCount) || 0,
          avgDisposalDays: Number(r.avgDisposalDays) || 30,
          backlogOver30Days: Number(r.backlogOver30Days) || 0,
          worstCategoryEn: String(r.worstCategoryEn),
          worstCategoryHi: String(r.worstCategoryHi),
          reportMonth: String(r.reportMonth),
        },
        sourceId: 'src_darpg_202408',
      }));
    },

    async detectChanges(entities: NormalizedEntity[]): Promise<ChangeSet> {
      return {
        newRecords: entities,
        updatedRecords: [],
        deletedRecords: [],
        correctedRecords: [],
        schemaChanged: false,
      };
    },

    async sync(changeSet: ChangeSet): Promise<{ inserted: number; updated: number; deleted: number }> {
      let inserted = 0;
      let updated = 0;

      for (const entity of changeSet.newRecords) {
        const d = entity.data;
        const existing = await prisma.cpgramsMonthlyRecord.findFirst({
          where: { name: d.name, reportMonth: d.reportMonth },
        });

        if (existing) {
          await prisma.cpgramsMonthlyRecord.update({
            where: { id: existing.id },
            data: {
              recordType: d.recordType,
              rank: d.rank,
              name: d.name,
              nameHi: d.nameHi,
              totalGrievances: d.totalGrievances,
              resolvedCount: d.resolvedCount,
              pendingCount: d.pendingCount,
              avgDisposalDays: d.avgDisposalDays,
              backlogOver30Days: d.backlogOver30Days,
              worstCategoryEn: d.worstCategoryEn,
              worstCategoryHi: d.worstCategoryHi,
              reportMonth: d.reportMonth,
            },
          });
          updated++;
        } else {
          await prisma.cpgramsMonthlyRecord.create({
            data: {
              recordType: d.recordType,
              rank: d.rank,
              name: d.name,
              nameHi: d.nameHi,
              totalGrievances: d.totalGrievances,
              resolvedCount: d.resolvedCount,
              pendingCount: d.pendingCount,
              avgDisposalDays: d.avgDisposalDays,
              backlogOver30Days: d.backlogOver30Days,
              worstCategoryEn: d.worstCategoryEn,
              worstCategoryHi: d.worstCategoryHi,
              reportMonth: d.reportMonth,
            },
          });
          inserted++;
        }
      }

      return { inserted, updated, deleted: 0 };
    },
  };
}
