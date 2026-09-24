import React from 'react';
import { 
  IndianRupee, 
  AlertTriangle, 
  CloudRain, 
  RotateCcw, 
  ArrowUpRight
} from 'lucide-react';
import { Contractor, WorkOrder, RoadDefectReport } from '../types';

interface MetricsOverviewProps {
  contractors: Contractor[];
  workOrders: WorkOrder[];
  defects: RoadDefectReport[];
  onFilterDlpBreach: () => void;
}

export const MetricsOverview: React.FC<MetricsOverviewProps> = ({
  contractors,
  workOrders,
  defects,
  onFilterDlpBreach,
}) => {
  const totalFundsCrores = contractors.reduce((acc, c) => acc + c.totalContractsValueCrores, 0);
  const totalActiveDlpBreaches = contractors.reduce((acc, c) => acc + c.activeDlpViolationsCount, 0);
  const avgMonsoonFailure = Math.round(
    contractors.reduce((acc, c) => acc + c.monsoonFailureRate, 0) / (contractors.length || 1)
  );
  const totalOpenPotholes = defects.filter(d => d.status === 'OPEN_DLP_BREACH' || d.status === 'NOTICE_SERVED').length;

  return (
    <div className="space-y-2 mb-6">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-ink-2">
          At a glance
        </span>
        <span className="text-xs text-ink-3">
          Across all indexed tenders
        </span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* 1. Public Funds Audited */}
        <div className="bg-surface border rounded-[10px] border-line p-4 sm:p-5 relative overflow-hidden shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-xs font-bold opacity-60">
              Public Funds Audited
            </span>
            <div className="w-6 h-6 rounded-full bg-surface-3 flex items-center justify-center text-ink">
              <IndianRupee className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl sm:text-4xl font-bold text-ink tracking-tight">
              ₹{totalFundsCrores.toFixed(1)}<span className="text-xl font-bold ml-1 opacity-70">Cr</span>
            </div>
            <div className="text-xs font-bold opacity-60 mt-1">
              Across {workOrders.length} e-Procurement Tenders
            </div>
          </div>
        </div>

        {/* 2. Active Defect Liability (DLP) Violations */}
        <div 
          onClick={onFilterDlpBreach}
          className="bg-surface border rounded-[10px] border-line p-4 sm:p-5 relative overflow-hidden shadow-sm flex flex-col justify-between cursor-pointer hover:bg-[var(--bad-solid)]/5 transition-colors group"
        >
          <div className="absolute top-0 right-0 bg-[var(--bad-solid)] text-white px-2 py-0.5 text-xs font-bold">
            Critical
          </div>
          <div className="flex items-start justify-between">
            <span className="text-xs font-bold text-bad">
              Active DLP Breaches
            </span>
            <div className="w-6 h-6 rounded-full bg-[var(--bad-solid)]/10 flex items-center justify-center text-bad">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl sm:text-4xl font-bold text-bad tracking-tight flex items-baseline justify-between">
              <span>{totalActiveDlpBreaches}</span>
              <span className="text-xs font-bold text-bad flex items-center group-hover:underline">
                Inspect <ArrowUpRight className="w-3 h-3 ml-0.5" />
              </span>
            </div>
            <div className="text-xs font-bold text-bad/80 mt-1">
              Protected Roads Requiring Free Repair
            </div>
          </div>
        </div>

        {/* 3. Average Monsoon Failure Rate */}
        <div className="bg-surface border rounded-[10px] border-line p-4 sm:p-5 relative overflow-hidden shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-xs font-bold opacity-60">
              Avg. Monsoon Failure
            </span>
            <div className="w-6 h-6 rounded-full bg-surface-3 flex items-center justify-center text-ink">
              <CloudRain className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl sm:text-4xl font-bold text-ink tracking-tight">
              {avgMonsoonFailure}%
            </div>
            <div className="text-xs font-bold opacity-60 mt-1">
              Collapse in 1st Season (&lt;6 Mos)
            </div>
          </div>
        </div>

        {/* 4. Active Citizen Pothole Reports */}
        <div className="bg-surface border rounded-[10px] border-line p-4 sm:p-5 relative overflow-hidden shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-xs font-bold opacity-60">
              Citizen Defect Logs
            </span>
            <div className="w-6 h-6 rounded-full bg-surface-3 flex items-center justify-center text-ink">
              <RotateCcw className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl sm:text-4xl font-bold text-ink tracking-tight">
              {totalOpenPotholes}
            </div>
            <div className="text-xs font-bold opacity-60 mt-1">
              Directly Attributed to Contractors
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
