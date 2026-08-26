import type { PublicAuthority, RtiFilter, RtiDraftTemplate } from '../types/rti';
import { MOCK_PUBLIC_AUTHORITIES, MOCK_RTI_TEMPLATES } from '../data/mockRti';
import { resolvePincode } from '../../../core/utils/pinResolver';

export function getAllAuthorities(filter?: RtiFilter): PublicAuthority[] {
  let list = [...MOCK_PUBLIC_AUTHORITIES];

  if (!filter) return list;

  if (filter.query && filter.query.trim()) {
    const q = filter.query.toLowerCase().trim();
    list = list.filter(
      (a) =>
        a.authorityName.toLowerCase().includes(q) ||
        a.authorityNameHi.toLowerCase().includes(q) ||
        a.parentMinistry.toLowerCase().includes(q) ||
        a.cpio.name.toLowerCase().includes(q) ||
        a.faa.name.toLowerCase().includes(q) ||
        a.city.toLowerCase().includes(q) ||
        a.pinCode.includes(q) ||
        a.id.toLowerCase().includes(q)
    );
  }

  if (filter.governmentLevel && filter.governmentLevel !== 'All') {
    list = list.filter((a) => a.governmentLevel === filter.governmentLevel);
  }

  if (filter.maxResponseDays) {
    list = list.filter((a) => a.avgResponseDays <= (filter.maxResponseDays || 30));
  }

  if (filter.onlineFilingOnly) {
    list = list.filter((a) => a.onlineFilingSupported);
  }

  if (filter.pinCode && filter.pinCode.trim()) {
    list = list.filter((a) => a.pinCode === filter.pinCode?.trim());
  }

  if (filter.sortBy === 'speed_asc') {
    list.sort((a, b) => a.avgResponseDays - b.avgResponseDays);
  } else if (filter.sortBy === 'requests_desc') {
    list.sort((a, b) => b.totalRequestsReceivedAnnual - a.totalRequestsReceivedAnnual);
  } else if (filter.sortBy === 'rejection_asc') {
    list.sort((a, b) => a.rejectionRatePercent - b.rejectionRatePercent);
  }

  return list;
}

export function getAuthorityById(id: string): PublicAuthority | undefined {
  return MOCK_PUBLIC_AUTHORITIES.find((a) => a.id.toLowerCase() === id.toLowerCase());
}

export function getAuthoritiesByPin(pinCode: string): PublicAuthority[] {
  return MOCK_PUBLIC_AUTHORITIES.filter((a) => a.pinCode === pinCode);
}

export function getAuthoritiesSummaryForPin(pinCode: string) {
  const loc = resolvePincode(pinCode);
  const authorities = MOCK_PUBLIC_AUTHORITIES.filter((a) => a.pinCode === pinCode);

  const matchedAuthority = authorities[0] || MOCK_PUBLIC_AUTHORITIES[0];
  const avgResponseDays = authorities.length > 0
    ? Math.round(authorities.reduce((sum, a) => sum + a.avgResponseDays, 0) / authorities.length)
    : matchedAuthority.avgResponseDays;

  return {
    pinCode,
    locality: loc.district ? `${loc.district}, ${loc.state}` : loc.state,
    authoritiesCount: authorities.length || 1,
    primaryAuthority: matchedAuthority,
    avgResponseDays,
    primaryCpio: matchedAuthority.cpio,
  };
}

export function compareAuthorities(authorityIds: string[]): PublicAuthority[] {
  return MOCK_PUBLIC_AUTHORITIES.filter((a) => authorityIds.includes(a.id));
}

export function getRtiTemplates(): RtiDraftTemplate[] {
  return MOCK_RTI_TEMPLATES;
}

export function getRtiTemplateByType(type: string): RtiDraftTemplate | undefined {
  return MOCK_RTI_TEMPLATES.find((t) => t.applicationType.toLowerCase().includes(type.toLowerCase()));
}
