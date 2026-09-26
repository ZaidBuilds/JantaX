import type { CSSProperties } from 'react';
import { Activity } from 'lucide-react';
import { MODULE_REGISTRY } from '../core/registry/moduleRegistry';
import type { ModuleMeta } from '../core/types';

/**
 * UI metadata for the module catalogue: how modules are grouped for citizens,
 * which data colour each one uses, and where each one lives.
 */

export interface ModuleGroup {
  id: string;
  title: string;
  description: string;
  modules: string[];
}

export const MODULE_GROUPS: ModuleGroup[] = [
  {
    id: 'services',
    title: 'Services near you',
    description: 'Schools, clinics, ration shops and the civic basics your PIN depends on.',
    modules: ['school', 'hospital', 'ration', 'utility', 'nagar', 'pollution'],
  },
  {
    id: 'money',
    title: 'Money and public works',
    description: 'Who got the contract, what was sanctioned, and what was actually built.',
    modules: ['infra', 'contractor', 'mplads', 'budget', 'rera', 'land'],
  },
  {
    id: 'accountability',
    title: 'Rights and accountability',
    description: 'Courts, RTI, grievances, elections and the officials responsible.',
    modules: ['courts', 'rti', 'grievance', 'booth', 'election', 'andhbhakt'],
  },
];

const TONES: Record<string, string> = {
  school: 'var(--viz-1)',
  hospital: 'var(--viz-5)',
  ration: 'var(--viz-7)',
  utility: 'var(--viz-7)',
  nagar: 'var(--viz-4)',
  pollution: 'var(--viz-8)',
  infra: 'var(--viz-2)',
  contractor: 'var(--viz-2)',
  mplads: 'var(--viz-6)',
  budget: 'var(--viz-3)',
  rera: 'var(--viz-6)',
  land: 'var(--viz-3)',
  courts: 'var(--viz-4)',
  rti: 'var(--viz-1)',
  grievance: 'var(--viz-5)',
  booth: 'var(--viz-3)',
  election: 'var(--viz-5)',
  andhbhakt: 'var(--viz-8)',
  monitoring: 'var(--viz-8)',
};

/** Short, plain-language names for cards and navigation. */
const SHORT_NAMES: Record<string, string> = {
  infra: 'Roads and public works',
  school: 'Government schools',
  nagar: 'Ward and municipal services',
  budget: 'PIN budget tracker',
  contractor: 'Contractor ledger',
  andhbhakt: 'CM claims vs audits',
  hospital: 'Hospitals and PHCs',
  rera: 'RERA housing projects',
  ration: 'Ration shops (PDS)',
  utility: 'Power and water supply',
  rti: 'RTI response tracker',
  pollution: 'Air quality',
  land: 'Land records',
  election: 'Election spending',
  grievance: 'Public grievances',
  mplads: 'MP and MLA funds',
  booth: 'Polling booths and BLOs',
  courts: 'District courts',
};

/** One-line, plain-language descriptions used on cards and module headers. */
const DESCRIPTIONS: Record<string, string> = {
  infra: 'Roads, bridges and highways: sanctioned budget and progress against what citizens see on site.',
  school: 'UDISE+ records for every government school, checked against parent and teacher reports.',
  nagar: 'Ward-level sanitation, water, drains and streetlights, with the councillor and officer responsible.',
  budget: 'Where public money for your PIN is allocated, released and actually spent.',
  contractor: 'Who won each tender, for how much, and how their past work has held up.',
  andhbhakt: 'State government announcements set beside CAG audit findings and RTI replies.',
  hospital: 'Sanctioned beds, doctors and medicines at your PHC or CHC, against what patients found.',
  rera: 'Registered housing projects: promised possession dates, complaints and builder track record.',
  ration: 'Fair price shops: stock received, quota delivered and opening hours.',
  utility: 'Power cuts and water supply hours reported by the discom and the jal board.',
  rti: 'Response times and rejection rates for public authorities under the RTI Act.',
  pollution: 'Live AQI from the nearest CPCB station and the GRAP stage in force.',
  land: 'Mutation delays, record backlogs and encroachment notices at your tehsil.',
  election: 'What candidates declared they spent, set against independent estimates.',
  grievance: 'CPGRAMS backlog and disposal times, ranked by ministry and state.',
  mplads: 'Works recommended under MP and MLA local area funds, and what was completed.',
  booth: 'Your polling station, room number, BLO contact and accessibility facilities.',
  courts: 'District court pendency, judge vacancies and how long cases take to clear.',
  monitoring: 'Source health, change detection and quarantined records for data maintainers.',
};

/** Neutral Hindi display names where the registry label is editorial. */
const HINDI_OVERRIDES: Record<string, string> = {
  andhbhakt: 'मुख्यमंत्री दावे बनाम ऑडिट',
};

/**
 * Modules that read a connected official feed. Every other module shows illustrative sample data
 * until its connector exists (see docs/DATA_LAYER.md), and says so on the page.
 */
export const LIVE_FEEDS: Record<string, { label: string; sourceId: string }> = {
  pollution: { label: 'CPCB real-time air quality, via data.gov.in', sourceId: 'cpcb-realtime-aqi' },
};

export function moduleTone(id: string): string {
  return TONES[id] || 'var(--brand-ink)';
}

export type ModuleInfo = ModuleMeta & { shortName: string; hindi: string; summary: string };

const MONITORING: ModuleMeta = {
  id: 'monitoring' as ModuleMeta['id'],
  nameHindi: 'डेटा निगरानी',
  nameEnglish: 'Data Monitoring',
  icon: Activity,
  color: '#52607a',
  description: DESCRIPTIONS.monitoring,
  descriptionHindi: '',
  dataSource: 'JantaX sync engine',
  isLive: true,
  recordCount: 0,
};

export function getModule(id: string): ModuleInfo | undefined {
  const m = MODULE_REGISTRY.find((x) => x.id === id) || (id === 'monitoring' ? MONITORING : undefined);
  if (!m) return undefined;
  return {
    ...m,
    shortName: SHORT_NAMES[id] || m.nameEnglish,
    hindi: HINDI_OVERRIDES[id] || m.nameHindi,
    summary: DESCRIPTIONS[id] || m.description,
  };
}

/** Normalises the aliases people type in URLs (/module/health, /module/pds...). */
export function canonicalModuleId(raw: string): string {
  const id = raw.toLowerCase();
  const aliases: Record<string, string> = {
    schools: 'school', projects: 'infra', roads: 'infra', healthcare: 'hospital', health: 'hospital',
    housing: 'rera', contractors: 'contractor', pds: 'ration', cpgrams: 'grievance', court: 'courts',
    mp: 'mplads', ward: 'nagar', municipality: 'nagar', air: 'pollution', aqi: 'pollution',
    claims: 'andhbhakt', 'cm-accountability': 'andhbhakt', power: 'utility', water: 'utility', elections: 'election',
  };
  return aliases[id] || id;
}

export function moduleHref(id: string, pin?: string): string {
  if (id === 'school') return pin ? `/schools?pin=${pin}` : '/schools';
  return pin ? `/module/${id}?pin=${pin}` : `/module/${id}`;
}

export function ModuleIcon({ id, size = 'md' }: { id: string; size?: 'sm' | 'md' | 'lg' }) {
  const m = getModule(id);
  if (!m) return null;
  const Icon = m.icon;
  const px = size === 'sm' ? 16 : size === 'lg' ? 24 : 20;
  return (
    <span className={`icon-tile ${size === 'md' ? '' : size}`} style={{ '--tile': moduleTone(id) } as CSSProperties} aria-hidden="true">
      <Icon size={px} strokeWidth={1.9} />
    </span>
  );
}
