import React from 'react';
import { 
  Scale, 
  X, 
  FileText
} from 'lucide-react';
import { Contractor } from '../types';

interface ContractorComparisonProps {
  contractors: Contractor[];
  selectedCompareIds: string[];
  onRemoveFromCompare: (id: string) => void;
  onAddToCompare: (id: string) => void;
  onGenerateAction: (contractor: Contractor) => void;
}

export const ContractorComparison: React.FC<ContractorComparisonProps> = ({
  contractors,
  selectedCompareIds,
  onRemoveFromCompare,
  onAddToCompare,
  onGenerateAction,
}) => {
  // If fewer than 2 selected, pick top 2 by default
  const effectiveIds = selectedCompareIds.length >= 2 
    ? selectedCompareIds.slice(0, 3) 
    : [contractors[0]?.id || 'cont-001', contractors[5]?.id || 'cont-006'];

  const comparedContractors = contractors.filter(c => effectiveIds.includes(c.id));

  return (
    <div className="space-y-4">
      
      {/* Header */}
      <div className="bg-surface border rounded-[10px] border-line p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-[var(--surface-inverse)] text-white px-2 py-0.5 text-xs font-bold">
                Cartel Detection & Quality Matrix
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink mt-1">
              Side-by-Side Contractor Comparison
            </h2>
            <p className="text-xs text-ink-3 mt-1">
              Compare infrastructure providers side-by-side to detect ward monopolies, contrast quality standards, and verify DLP breach frequencies.
            </p>
          </div>

          {/* Add Contractor to Compare Dropdown */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-ink">Add:</span>
            <select
              onChange={(e) => {
                if (e.target.value) {
                  onAddToCompare(e.target.value);
                  e.target.value = '';
                }
              }}
              defaultValue=""
              className="bg-surface-2 border rounded-[10px] border-line text-xs font-bold text-ink px-3 py-1.5 focus:outline-none cursor-pointer"
            >
              <option value="" disabled>Select contractor...</option>
              {contractors
                .filter(c => !effectiveIds.includes(c.id))
                .map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.riskTier.replace('_', ' ')})
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {comparedContractors.map((c) => {
          const isCritical = c.riskTier === 'CRITICAL_RISK' || c.riskTier === 'HIGH_RISK';

          return (
            <div 
              key={c.id} 
              className={`bg-surface border rounded-[10px] border-line p-5 flex flex-col justify-between space-y-4 shadow-sm ${
 isCritical ? 'ring-2 ring-[var(--bad)]' : ''
 }`}
            >
              {/* Header with remove */}
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-bold opacity-60">
                      {c.registrationNumber}
                    </span>
                    <h3 className="text-lg font-bold text-ink mt-0.5">
                      {c.name}
                    </h3>
                  </div>

                  {comparedContractors.length > 2 && (
                    <button
                      onClick={() => onRemoveFromCompare(c.id)}
                      className="p-1 text-ink hover:bg-[var(--bad-solid)] hover:text-white border rounded-[10px] border-line transition-colors"
                      title="Remove from comparison"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="mt-3 p-3 bg-surface-2 border rounded-[10px] border-line flex items-center justify-between">
                  <span className="text-xs font-bold opacity-70">Integrity Score:</span>
                  <span className={`text-2xl font-bold ${
 c.integrityScore < 40 ? 'text-[var(--bad)]' : c.integrityScore < 70 ? 'text-ink' : 'text-good'
 }`}>
                    {c.integrityScore}/100
                  </span>
                </div>
              </div>

              {/* Metrics Table */}
              <div className="space-y-2 text-xs divide-y divide-black/10">
                
                <div className="pt-2 flex justify-between items-center">
                  <span className="opacity-70">Risk Tier:</span>
                  <span className={`font-bold px-2 py-0.5 text-xs border rounded-[10px] ${
 isCritical ? 'bg-[var(--bad)] text-white border-[var(--bad)]' : 'bg-[var(--surface-inverse)] text-white border-line'
 }`}>
                    {c.riskTier.replace('_', ' ')}
                  </span>
                </div>

                <div className="pt-2 flex justify-between items-center">
                  <span className="opacity-70">Monsoon Failure:</span>
                  <span className={`font-bold ${c.monsoonFailureRate > 50 ? 'text-[var(--bad)]' : 'text-ink'}`}>
                    {c.monsoonFailureRate}%
                  </span>
                </div>

                <div className="pt-2 flex justify-between items-center">
                  <span className="opacity-70">Active DLP Breaches:</span>
                  <span className={`font-bold ${c.activeDlpViolationsCount > 0 ? 'text-[var(--bad)]' : 'text-ink'}`}>
                    {c.activeDlpViolationsCount} Roads
                  </span>
                </div>

                <div className="pt-2 flex justify-between items-center">
                  <span className="opacity-70">Ward Monopoly:</span>
                  <span className="font-bold text-ink">
                    {c.wardMonopolyIndex}% ({c.primaryWard})
                  </span>
                </div>

                <div className="pt-2 flex justify-between items-center">
                  <span className="opacity-70">Total Public Funds:</span>
                  <span className="font-bold text-ink">
                    ₹{c.totalContractsValueCrores} Cr ({c.totalRoadsBuiltCount} works)
                  </span>
                </div>

                <div className="pt-2 flex justify-between items-center">
                  <span className="opacity-70">Avg Lifespan:</span>
                  <span className="font-bold text-ink">
                    {c.avgPotholeAppearanceMonths} Months
                  </span>
                </div>

                <div className="pt-2 flex justify-between items-center">
                  <span className="opacity-70">Show-Cause Notices:</span>
                  <span className="font-bold text-bad">
                    {c.notices.length} Issued
                  </span>
                </div>

              </div>

              {/* Action Button */}
              <button
                onClick={() => onGenerateAction(c)}
                className="w-full inline-flex items-center justify-center space-x-1.5 bg-[var(--surface-inverse)] hover:bg-[var(--bad-solid)] text-white text-xs font-bold tracking-tight px-3 py-2.5 transition-colors shadow-sm"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Generate RTI for {c.name.split(' ')[0]}</span>
              </button>

            </div>
          );
        })}
      </div>

    </div>
  );
};
