import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  ShieldCheck, 
  Search, 
  Filter, 
  ExternalLink, 
  FileText, 
  Scale, 
  Building2,
  CheckCircle2,
  ArrowUpRight
} from 'lucide-react';
import { Contractor, RiskTier } from '../types';

interface ContractorLeaderboardProps {
  contractors: Contractor[];
  onSelectContractor: (contractor: Contractor) => void;
  onGenerateAction: (contractor: Contractor) => void;
  onCompareContractors: (contractorId: string) => void;
  selectedCompareIds: string[];
}

export const ContractorLeaderboard: React.FC<ContractorLeaderboardProps> = ({
  contractors,
  onSelectContractor,
  onGenerateAction,
  onCompareContractors,
  selectedCompareIds,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRisk, setSelectedRisk] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'integrity_asc' | 'integrity_desc' | 'monsoon_desc' | 'budget_desc' | 'dlp_desc'>('integrity_asc');
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 8;

  // Filter and sort
  const filtered = contractors.filter((c) => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.primaryWard.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRisk = selectedRisk === 'all' || c.riskTier === selectedRisk;
    return matchesSearch && matchesRisk;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'integrity_asc') return a.integrityScore - b.integrityScore; // Worst first
    if (sortBy === 'integrity_desc') return b.integrityScore - a.integrityScore; // Best first
    if (sortBy === 'monsoon_desc') return b.monsoonFailureRate - a.monsoonFailureRate;
    if (sortBy === 'dlp_desc') return b.activeDlpViolationsCount - a.activeDlpViolationsCount;
    if (sortBy === 'budget_desc') return b.totalContractsValueCrores - a.totalContractsValueCrores;
    return 0;
  });

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paged = sorted.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  // Reset to first page when filters change
  React.useEffect(() => { setPage(1); }, [searchTerm, selectedRisk, sortBy]);

  const getRiskBadge = (tier: RiskTier, score: number) => {
    switch (tier) {
      case 'CRITICAL_RISK':
        return (
          <span className="bg-[var(--bad-solid)] text-white px-2.5 py-0.5 text-xs font-bold inline-flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            CRITICAL OFFENDER • {score}/100
          </span>
        );
      case 'HIGH_RISK':
        return (
          <span className="bg-[var(--surface-inverse)] text-bad border rounded-[10px] border-bad px-2.5 py-0.5 text-xs font-bold inline-flex items-center gap-1">
            <ShieldAlert className="w-3 h-3 text-bad" />
            HIGH RISK • {score}/100
          </span>
        );
      case 'MODERATE':
        return (
          <span className="bg-surface-3 text-ink border rounded-[10px] border-line px-2.5 py-0.5 text-xs font-bold inline-flex items-center">
            MODERATE • {score}/100
          </span>
        );
      case 'COMPLIANT':
        return (
          <span className="bg-emerald-800 text-white px-2.5 py-0.5 text-xs font-bold inline-flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            COMPLIANT • {score}/100
          </span>
        );
      case 'EXEMPLARY':
        return (
          <span className="bg-emerald-950 text-emerald-200 border rounded-[10px] border-emerald-600 px-2.5 py-0.5 text-xs font-bold inline-flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            EXEMPLARY • {score}/100
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Header & Filter Card */}
      <div className="bg-surface border rounded-[10px] border-line p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-[0.2em] opacity-60">
                Audited Contractor Directory
              </span>
              <span className="text-xs font-bold bg-[var(--surface-inverse)] text-white px-2 py-0.5">
                {sorted.length} Providers
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink mt-1">
              Contractor Scorecards & Hall of Shame
            </h2>
            <p className="text-xs text-ink-3 mt-1 max-w-2xl">
              Cross-referenced from State e-Procurement + GeM + Municipal Work Orders. Scored against Indian Road Congress (IRC) Defect Liability enforcement and first-monsoon collapse records.
            </p>
          </div>

          {/* Sort Switcher */}
          <div className="flex items-center gap-2 self-start md:self-end">
            <span className="text-xs font-bold opacity-60">Sort:</span>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-surface-2 border rounded-[10px] border-line text-xs font-bold text-ink px-3 py-1.5 focus:outline-none cursor-pointer tracking-tight"
            >
              <option value="integrity_asc">Worst Integrity First (Hall of Shame)</option>
              <option value="monsoon_desc">Highest Monsoon Failure Rate</option>
              <option value="dlp_desc">Most Active DLP Breaches</option>
              <option value="budget_desc">Highest Public Funds (₹ Cr)</option>
              <option value="integrity_desc">Highest Integrity First</option>
            </select>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-line">
          
          {/* Search */}
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 text-ink-3 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search contractor name, registration ID (PWD/BMC/BBMP), or ward..."
              className="w-full bg-surface-2 border rounded-[10px] border-line pl-9 pr-3 py-2 text-xs font-medium text-ink placeholder:text-ink-4 focus:outline-none focus:bg-surface"
            />
          </div>

          {/* Risk Tier Filter */}
          <div className="relative">
            <Filter className="w-4 h-4 text-ink-3 absolute left-3 top-2.5" />
            <select
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
              className="w-full bg-surface-2 border rounded-[10px] border-line pl-9 pr-3 py-2 text-xs font-bold text-ink focus:outline-none focus:bg-surface cursor-pointer"
            >
              <option value="all">All Risk Tiers</option>
              <option value="CRITICAL_RISK">Critical Risk (0-30)</option>
              <option value="HIGH_RISK">High Risk (31-50)</option>
              <option value="MODERATE">Moderate (51-70)</option>
              <option value="COMPLIANT">Compliant (71-85)</option>
              <option value="EXEMPLARY">Exemplary (86-100)</option>
            </select>
          </div>

        </div>
      </div>

      {/* Contractor Cards / High-Density Grid */}
      <div className="grid grid-cols-1 gap-3.5">
        {paged.map((contractor, index) => {
          const isCompared = selectedCompareIds.includes(contractor.id);
          const isCritical = contractor.riskTier === 'CRITICAL_RISK';
          
          return (
            <div
              key={contractor.id}
              className={`bg-surface border rounded-[10px] ${
 isCritical 
 ? 'border-[var(--bad)] shadow-sm' 
 : 'border-line'
 } p-4 sm:p-5 transition-all hover:translate-x-0.5`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                
                {/* Left: Identity & Core Details */}
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold bg-[var(--surface-inverse)] text-white px-2 py-0.5">
                      #{index + 1}
                    </span>
                    <h3 
                      onClick={() => onSelectContractor(contractor)}
                      className="text-lg font-bold text-ink hover:text-bad cursor-pointer transition-colors flex items-center gap-1.5 tracking-tight"
                    >
                      {contractor.name}
                      <ExternalLink className="w-3.5 h-3.5 opacity-60 inline" />
                    </h3>
                    {getRiskBadge(contractor.riskTier, contractor.integrityScore)}
                  </div>

                  {/* Sub-details */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-3">
                    <span className="flex items-center gap-1 font-bold text-ink">
                      <Building2 className="w-3.5 h-3.5 text-ink-3" />
                      <span>{contractor.registrationNumber}</span>
                    </span>
                    <span>•</span>
                    <span>Primary Ward: <strong className="text-ink">{contractor.primaryWard}</strong></span>
                    <span>•</span>
                    <span>Contracts: <strong className="text-ink font-bold">₹{contractor.totalContractsValueCrores} Cr</strong> ({contractor.totalRoadsBuiltCount} works)</span>
                  </div>

                  {/* Warning Tags */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                    {contractor.tags.map((tag, tIdx) => (
                      <span 
                        key={tIdx}
                        className={`text-xs font-bold px-2 py-0.5 ${
 tag.includes('Breaches') || tag.includes('Substandard') || tag.includes('Monopoly') || tag.includes('Lokayukta')
 ? 'bg-[var(--bad)]/10 text-[var(--bad)] border rounded-[10px] border-[var(--bad)]/40'
 : 'bg-surface-3 text-ink border border-line'
 }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Center: Core Failure Indices */}
                <div className="grid grid-cols-3 gap-2 sm:gap-3 bg-surface-2 border rounded-[10px] border-line p-3 min-w-[280px]">
                  
                  {/* Monsoon Failure */}
                  <div className="text-center">
                    <span className="text-xs opacity-60 block font-bold">
                      Monsoon Fail
                    </span>
                    <span className={`text-xl font-bold ${
 contractor.monsoonFailureRate > 50 ? 'text-[var(--bad)]' : contractor.monsoonFailureRate > 20 ? 'text-ink' : 'text-good'
 }`}>
                      {contractor.monsoonFailureRate}%
                    </span>
                    <span className="text-xs opacity-50 block">1st season</span>
                  </div>

                  {/* Active DLP Breaches */}
                  <div className="text-center border-x-2 border-line px-2">
                    <span className="text-xs opacity-60 block font-bold">
                      DLP Breaches
                    </span>
                    <span className={`text-xl font-bold ${
 contractor.activeDlpViolationsCount > 0 ? 'text-[var(--bad)]' : 'text-good'
 }`}>
                      {contractor.activeDlpViolationsCount}
                    </span>
                    <span className="text-xs opacity-50 block">unrepaired</span>
                  </div>

                  {/* Ward Monopoly */}
                  <div className="text-center">
                    <span className="text-xs opacity-60 block font-bold">
                      Monopoly
                    </span>
                    <span className={`text-xl font-bold ${
 contractor.wardMonopolyIndex > 60 ? 'text-[var(--bad)]' : 'text-ink'
 }`}>
                      {contractor.wardMonopolyIndex}%
                    </span>
                    <span className="text-xs opacity-50 block">tender share</span>
                  </div>

                </div>

                {/* Right: Actions */}
                <div className="flex flex-row lg:flex-col items-center gap-2 shrink-0">
                  <button
                    onClick={() => onGenerateAction(contractor)}
                    className="flex-1 lg:w-full inline-flex items-center justify-center space-x-1.5 bg-[var(--bad-solid)] hover:bg-[var(--surface-inverse)] text-white text-xs font-bold tracking-tight px-3 py-2 transition-colors shadow-sm"
                    title="Generate 1-Click RTI or Vigilance Show-Cause Notice"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Citizen Dossier</span>
                  </button>

                  <div className="flex items-center gap-1.5 w-full">
                    <button
                      onClick={() => onSelectContractor(contractor)}
                      className="flex-1 bg-surface hover:bg-surface-3 text-ink text-xs font-bold px-2.5 py-1.5 border rounded-[10px] border-line transition-colors"
                    >
                      Audit View
                    </button>
                    <button
                      onClick={() => onCompareContractors(contractor.id)}
                      className={`px-2.5 py-1.5 border rounded-[10px] border-line text-xs font-bold transition-colors ${
 isCompared 
 ? 'bg-[var(--surface-inverse)] text-white' 
 : 'bg-surface text-ink hover:bg-surface-3'
 }`}
                      title={isCompared ? 'Remove from comparison' : 'Add to compare'}
                    >
                      <Scale className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          );
        })}

        {sorted.length === 0 && (
          <div className="text-center py-12 bg-surface border rounded-[10px] border-line">
            <p className="text-sm opacity-60">No contractors found matching search criteria.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={safePage === 1}
            className="bg-surface border rounded-[10px] border-line text-ink text-xs font-bold px-3 py-1.5 disabled:opacity-40 cursor-pointer hover:bg-surface-3 transition-colors"
          >
            ← Prev
          </button>
          <span className="text-xs font-bold opacity-70">
            Page {safePage} of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={safePage === totalPages}
            className="bg-surface border rounded-[10px] border-line text-ink text-xs font-bold px-3 py-1.5 disabled:opacity-40 cursor-pointer hover:bg-surface-3 transition-colors"
          >
            Next →
          </button>
        </div>
      )}

    </div>
  );
};
