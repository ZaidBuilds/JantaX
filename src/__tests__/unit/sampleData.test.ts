import { describe, it, expect } from 'vitest';
import { claims } from '../../modules/andhbhakt/data/rawSeedData';
import { MOCK_CONTRACTORS } from '../../modules/contractor/data/mockContractors';
import { generateMockContractorDataset } from '../../modules/contractor/data/mockContractorDataset';
import { contractors as meerutContractors, representatives as meerutReps } from '../../modules/infra/data/meerutData';
import { MOCK_INFRA_PROJECTS } from '../../modules/infra/data/mockProjects';

/**
 * Sample records are there to design screens with. They must not pass for real ones: no names that
 * could belong to real firms or people, no registration numbers in a real format, and no citations
 * of real publications or report paragraphs for findings that were made up.
 */

// A real GSTIN: two-digit state code, a PAN (5 letters, 4 digits, 1 letter), entity number, Z, check.
const REAL_GSTIN = /\b\d{2}[A-Z]{5}\d{4}[A-Z][0-9A-Z]Z[0-9A-Z]\b/;
const SAMPLE = /sample|नमूना/i;

describe('sample data does not pass for real', () => {
  it('cites CM-claim findings as sample sources', () => {
    for (const c of claims) {
      expect(c.verificationSource, `${c.pincode}`).toMatch(/\(sample\)$/);
      expect(c.claimedBy, `${c.pincode}`).toMatch(SAMPLE);
      expect(c.officerName, `${c.pincode}`).toMatch(SAMPLE);
      expect(c.contractorName, `${c.pincode}`).toMatch(SAMPLE);
    }
  });

  it('labels every sample contractor as a sample', () => {
    const names = [
      ...MOCK_CONTRACTORS.map((c) => c.companyName),
      ...generateMockContractorDataset().contractors.map((c) => c.name),
      ...meerutContractors.flatMap((c) => [c.name, c.nameHi]),
      ...MOCK_INFRA_PROJECTS.map((p) => p.leadContractor),
    ];
    const unlabelled = names.filter((n) => !SAMPLE.test(n) && !/Delhi Jal Board/.test(n));
    expect(unlabelled).toEqual([]);
  });

  it('never uses a registration number in the real GSTIN format', () => {
    const numbers = [
      ...MOCK_CONTRACTORS.map((c) => c.gstin),
      ...meerutContractors.map((c) => c.registrationNumber),
    ];
    expect(numbers.filter((n) => n && REAL_GSTIN.test(n))).toEqual([]);
  });

  it('names sample officials by role', () => {
    for (const r of meerutReps) {
      expect(r.name, r.id).toMatch(SAMPLE);
      expect(r.nameHi, r.id).toMatch(SAMPLE);
    }
  });
});
