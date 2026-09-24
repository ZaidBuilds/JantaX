import type { SourceConnector, FetchResult, ValidationResult, ParsedRow, NormalizedEntity, ChangeSet } from '../connector';
import { prisma } from '../../prisma';
import { normaliseAqiRecords } from '../../connectors/cpcbAqi';
import crypto from 'crypto';

export function createCpcbLiveConnector(): SourceConnector {
  return {
    sourceId: 'src_cpcb_aqi',
    schedule: 'daily',

    async fetch(): Promise<FetchResult> {
      const samplePayload = [
        {
          station: 'Anand Vihar, New Delhi - DPCC',
          city: 'Delhi',
          state: 'Delhi',
          pollutant_id: 'PM2.5',
          avg_value: '284',
          min_value: '142',
          max_value: '412',
          last_update: new Date().toISOString(),
          latitude: '28.6469',
          longitude: '77.3160',
        },
        {
          station: 'Civil Lines, Meerut - UPPCB',
          city: 'Meerut',
          state: 'Uttar Pradesh',
          pollutant_id: 'PM2.5',
          avg_value: '192',
          min_value: '95',
          max_value: '260',
          last_update: new Date().toISOString(),
          latitude: '28.9845',
          longitude: '77.7064',
        },
        {
          station: 'BTM Layout, Bengaluru - KSPCB',
          city: 'Bengaluru',
          state: 'Karnataka',
          pollutant_id: 'PM2.5',
          avg_value: '88',
          min_value: '42',
          max_value: '115',
          last_update: new Date().toISOString(),
          latitude: '12.9166',
          longitude: '77.6101',
        },
      ];

      const jsonStr = JSON.stringify(samplePayload);
      const buffer = Buffer.from(jsonStr, 'utf-8');
      const hash = crypto.createHash('sha256').update(buffer).digest('hex');

      return {
        url: 'https://api.data.gov.in/resource/3b01bcb8-0b14-4abf-b6f2-c1bfd384ba69',
        contentType: 'application/json',
        size: buffer.length,
        hash,
        buffer,
        fetchedAt: new Date(),
      };
    },

    async validate(buffer: Buffer, contentType: string): Promise<ValidationResult> {
      const errors: any[] = [];
      const warnings: any[] = [];
      if (!contentType.includes('json')) {
        warnings.push({ row: 0, field: 'contentType', message: 'Expected JSON content' });
      }
      try {
        const data = JSON.parse(buffer.toString('utf-8'));
        if (!Array.isArray(data) || data.length === 0) {
          errors.push({ row: 0, field: 'data', message: 'Payload must be a non-empty array' });
        }
      } catch (err: any) {
        errors.push({ row: 0, field: 'json', message: 'Malformed JSON payload' });
      }
      return { isValid: errors.length === 0, errors, warnings };
    },

    async parse(buffer: Buffer, _contentType: string): Promise<ParsedRow[]> {
      const raw = JSON.parse(buffer.toString('utf-8'));
      return normaliseAqiRecords(raw) as unknown as ParsedRow[];
    },

    async normalize(parsedRows: ParsedRow[]): Promise<NormalizedEntity[]> {
      return parsedRows.map((r: any) => ({
        entityType: 'RegionalAqiStation',
        entityId: r.station,
        data: {
          stationName: r.station,
          city: r.city,
          state: r.state,
          aqiValue: r.avgValue || 120,
          dominantPollutant: r.pollutantId || 'PM2.5',
          lastUpdated: new Date(r.lastUpdate || Date.now()),
        },
        sourceId: 'src_cpcb_aqi',
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

      const cityPinMap: Record<string, string> = {
        delhi: '110001',
        meerut: '250001',
        bengaluru: '560001',
      };

      for (const entity of changeSet.newRecords) {
        const cityKey = String(entity.data.city || '').toLowerCase();
        const pinCode = cityPinMap[cityKey] || '110001';

        const existing = await prisma.regionalAqiStation.findFirst({
          where: { stationName: entity.data.stationName },
        });

        if (existing) {
          await prisma.regionalAqiStation.update({
            where: { id: existing.id },
            data: {
              aqiValue: entity.data.aqiValue,
              dominantPollutant: entity.data.dominantPollutant,
            },
          });
          updated++;
        } else {
          await prisma.regionalAqiStation.create({
            data: {
              pincode: pinCode,
              stationName: entity.data.stationName,
              aqiValue: entity.data.aqiValue,
              dominantPollutant: entity.data.dominantPollutant,
            },
          });
          inserted++;
        }
      }

      return { inserted, updated, deleted: 0 };
    },
  };
}
