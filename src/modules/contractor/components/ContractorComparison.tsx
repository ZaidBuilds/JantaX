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
      <div className="bg-white border-2 border-[#1A1A1A] p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-[#1A1A1A] text-white px-2 py-0.5 text-[10px] font-mono font-bold uppercase">
                Cartel Detection & Quality Matrix
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#1A1A1A] mt-1">
              Side-by-Side Contractor Comparison
            </h2>
            <p className="text-xs font-serif text-[#1A1A1A]/70 mt-1">
              Compare infrastructure providers side-by-side to detect ward monopolies, contrast quality standards, and verify DLP breach frequencies.
            </p>
          </div>

          {/* Add Contractor to Compare Dropdown */}
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-mono font-bold uppercase text-[#1A1A1A]">Add:</span>
            <select
              onChange={(e) => {
                if (e.target.value) {
                  onAddToCompare(e.target.value);
                  e.target.value = '';
                }
              }}
              defaultValue=""
              className="bg-[#FAFAFA] border-2 border-[#1A1A1A] text-xs font-bold uppercase text-[#1A1A1A] px-3 py-1.5 focus:outline-none cursor-pointer"
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
              className={`bg-white border-2 border-[#1A1A1A] p-5 flex flex-col justify-between space-y-4 shadow-sm ${
                isCritical ? 'ring-2 ring-[#D43F33]' : ''
              }`}
            >
              {/* Header with remove */}
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold opacity-60">
                      {c.registrationNumber}
                    </span>
                    <h3 className="text-lg font-black uppercase text-[#1A1A1A] mt-0.5">
                      {c.name}
                    </h3>
                  </div>

                  {comparedContractors.length > 2 && (
                    <button
                      onClick={() => onRemoveFromCompare(c.id)}
                      className="p-1 text-[#1A1A1A] hover:bg-[#D43F33] hover:text-white border border-[#1A1A1A] transition-colors"
                      title="Remove from comparison"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="mt-3 p-3 bg-[#FAFAFA] border-2 border-[#1A1A1A] flex items-center justify-between font-mono">
                  <span className="text-xs font-bold uppercase opacity-70">Integrity Score:</span>
                  <span className={`text-2xl font-black ${
                    c.integrityScore < 40 ? 'text-[#D43F33]' : c.integrityScore < 70 ? 'text-[#1A1A1A]' : 'text-emerald-800'
                  }`}>
                    {c.integrityScore}/100
                  </span>
                </div>
              </div>

              {/* Metrics Table */}
              <div className="space-y-2 text-xs font-mono divide-y divide-black/10">
                
                <div className="pt-2 flex justify-between items-center">
                  <span className="opacity-70 uppercase">Risk Tier:</span>
                  <span className={`font-bold px-2 py-0.5 text-[10px] uppercase border ${
                    isCritical ? 'bg-[#D43F33] text-white border-[#D43F33]' : 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                  }`}>
                    {c.riskTier.replace('_', ' ')}
                  </span>
                </div>

                <div className="pt-2 flex justify-between items-center">
                  <span className="opacity-70 uppercase">Monsoon Failure:</span>
                  <span className={`font-bold ${c.monsoonFailureRate > 50 ? 'text-[#D43F33]' : 'text-[#1A1A1A]'}`}>
                    {c.monsoonFailureRate}%
                  </span>
                </div>

                <div className="pt-2 flex justify-between items-center">
                  <span className="opacity-70 uppercase">Active DLP Breaches:</span>
                  <span className={`font-bold ${c.activeDlpViolationsCount > 0 ? 'text-[#D43F33]' : 'text-[#1A1A1A]'}`}>
                    {c.activeDlpViolationsCount} Roads
                  </span>
                </div>

                <div className="pt-2 flex justify-between items-center">
                  <span className="opacity-70 uppercase">Ward Monopoly:</span>
                  <span className="font-bold text-[#1A1A1A]">
                    {c.wardMonopolyIndex}% ({c.primaryWard})
                  </span>
                </div>

                <div className="pt-2 flex justify-between items-center">
                  <span className="opacity-70 uppercase">Total Public Funds:</span>
                  <span className="font-bold text-[#1A1A1A]">
                    ₹{c.totalContractsValueCrores} Cr ({c.totalRoadsBuiltCount} works)
                  </span>
                </div>

                <div className="pt-2 flex justify-between items-center">
                  <span className="opacity-70 uppercase">Avg Lifespan:</span>
                  <span className="font-bold text-[#1A1A1A]">
                    {c.avgPotholeAppearanceMonths} Months
                  </span>
                </div>

                <div className="pt-2 flex justify-between items-center">
                  <span className="opacity-70 uppercase">Show-Cause Notices:</span>
                  <span className="font-bold text-[#D43F33]">
                    {c.notices.length} Issued
                  </span>
                </div>

              </div>

              {/* Action Button */}
              <button
                onClick={() => onGenerateAction(c)}
                className="w-full inline-flex items-center justify-center space-x-1.5 bg-[#1A1A1A] hover:bg-[#D43F33] text-white text-xs font-bold uppercase tracking-tight px-3 py-2.5 transition-colors shadow-sm"
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
