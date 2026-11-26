import type { SourceConnector, FetchResult, ValidationResult, ParsedRow, NormalizedEntity, ChangeSet } from '../connector';
import { prisma } from '../../prisma';
import crypto from 'crypto';

export function createCpgramsFeedConnector(): SourceConnector {
  return {
    sourceId: 'src_darpg_202408',
    schedule: 'monthly',

    async fetch(): Promise<FetchResult> {
      const { fetchCpgramsMonthlySummary } = await import('../../connectors/cpgramsMonthlyConnector');
      const summary = await fetchCpgramsMonthlySummary();

      const feedData = summary.topMinistries.map((m: any, idx) => ({
        rank: idx + 1,
        name: m.ministryName || m.name,
        nameHi: m.ministryNameHi || m.nameHi,
        totalGrievances: m.totalGrievances,
        resolvedCount: m.resolvedCount,
        pendingCount: m.pendingCount,
        avgDisposalDays: m.avgDisposalDays,
        backlogOver30Days: m.backlogOver30Days,
        worstCategoryEn: m.worstCategoryEn,
        worstCategoryHi: m.worstCategoryHi,
        reportMonth: summary.reportMonth,
      }));

      const jsonStr = JSON.stringify(feedData);
      const buffer = Buffer.from(jsonStr, 'utf-8');
      const hash = crypto.createHash('sha256').update(buffer).digest('hex');

      return {
        url: 'https://darpg.gov.in/cpgrams/monthly-performance-bulletins',
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
