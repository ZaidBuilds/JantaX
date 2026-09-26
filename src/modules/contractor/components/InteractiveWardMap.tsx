import React, { useState } from 'react';
import { 
  MapPin, 
  Search, 
  Calendar, 
  FileText, 
  AlertTriangle, 
  PlusCircle,
  ArrowUpRight
} from 'lucide-react';
import { WardData, WorkOrder, RoadDefectReport, Contractor } from '../types';

interface InteractiveWardMapProps {
  wards: WardData[];
  workOrders: WorkOrder[];
  defects: RoadDefectReport[];
  contractors: Contractor[];
  onSelectWorkOrder: (wo: WorkOrder) => void;
  onOpenReportModalWithWorkOrder: (wo: WorkOrder) => void;
  onGenerateActionWithWorkOrder: (wo: WorkOrder) => void;
}

export const InteractiveWardMap: React.FC<InteractiveWardMapProps> = ({
  wards,
  workOrders,
  defects,
  contractors,
  onOpenReportModalWithWorkOrder,
  onGenerateActionWithWorkOrder,
}) => {
  const [selectedWardId, setSelectedWardId] = useState<string>('ward-151');
  const [selectedRoadId, setSelectedRoadId] = useState<string>('wo-101');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const currentWard = wards.find(w => w.id === selectedWardId) || wards[0];
  
  // Filter work orders for this ward
  const wardWorkOrders = workOrders.filter(w => {
    const matchesWard = w.wardId === selectedWardId;
    const matchesStatus = statusFilter === 'all' || w.dlpStatus === statusFilter;
    const matchesSearch = searchQuery === '' || 
      w.roadName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.contractorName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesWard && matchesStatus && matchesSearch;
  });

  const selectedWorkOrder = workOrders.find(w => w.id === selectedRoadId) || wardWorkOrders[0] || workOrders[0];
  const roadDefects = defects.filter(d => d.workOrderId === selectedWorkOrder?.id);
  const roadContractor = contractors.find(c => c.id === selectedWorkOrder?.contractorId);

  // Calculate days left in DLP
  const calculateDlpDays = (expiryDateStr: string) => {
    const expiry = new Date(expiryDateStr).getTime();
    const now = new Date().getTime();
    const diffDays = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const dlpDaysLeft = selectedWorkOrder ? calculateDlpDays(selectedWorkOrder.dlpExpiryDate) : 0;

  return (
    <div className="space-y-4">
      
      {/* Top Banner: Ward Selector & Stats */}
      <div className="bg-surface border rounded-[10px] border-line p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[var(--surface-inverse)] text-white px-2 py-0.5 text-xs font-bold">
                GIS INSPECTOR & ROAD MATRIX
              </span>
              <span className="bg-[var(--bad-solid)] text-white px-2 py-0.5 text-xs font-bold">
                Defect Liability Layer
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink mt-1.5">
              {currentWard?.name} (Ward #{currentWard?.number}) • {currentWard?.zone}
            </h2>
            <p className="text-xs text-ink-2 mt-0.5">
              Dominant Contractor: <strong className="text-ink underline font-sans font-bold">{currentWard?.dominantContractor.name}</strong> ({currentWard?.dominantContractor.sharePercent}% ward contracts)
            </p>
          </div>

          {/* Ward Switcher */}
          <div className="flex items-center gap-2 self-start lg:self-end">
            <span className="text-xs font-bold opacity-60">Ward:</span>
            <select
              value={selectedWardId}
              onChange={(e) => {
                setSelectedWardId(e.target.value);
                const firstWoInWard = workOrders.find(w => w.wardId === e.target.value);
                if (firstWoInWard) setSelectedRoadId(firstWoInWard.id);
              }}
              className="bg-surface-2 border rounded-[10px] border-line text-xs font-bold text-ink px-3 py-1.5 focus:outline-none cursor-pointer"
            >
              {wards.map((w) => (
                <option key={w.id} value={w.id}>
                  Ward {w.number} - {w.name} ({w.city})
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Filter & Search */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-line">
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 text-ink-3 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search road name, landmark, or contractor in this ward..."
              className="w-full bg-surface-2 border rounded-[10px] border-line pl-9 pr-3 py-2 text-xs font-medium text-ink placeholder:text-ink-4 focus:outline-none focus:bg-surface"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-surface-2 border rounded-[10px] border-line px-3 py-2 text-xs font-bold text-ink focus:outline-none focus:bg-surface cursor-pointer"
            >
              <option value="all">All Road Statuses</option>
              <option value="DLP_BREACH_UNRESOLVED">Active DLP Breaches (Red)</option>
              <option value="ACTIVE_DLP_PROTECTED">Protected & Intact (Green)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Interactive Map & Road Detail Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left: Visual Map & Road Segment Explorer (7 cols) */}
        <div className="lg:col-span-7 bg-surface border rounded-[10px] border-line p-4 sm:p-5 flex flex-col justify-between shadow-sm">
          
          <div>
            {/* Map Legend */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-line text-xs">
              <div className="flex items-center space-x-3">
                <span className="flex items-center gap-1.5 text-bad font-bold">
                  <span className="w-2.5 h-2.5 bg-[var(--bad-solid)]"></span>
                  DLP Breach ({wardWorkOrders.filter(w => w.dlpStatus === 'DLP_BREACH_UNRESOLVED').length})
                </span>
                <span className="flex items-center gap-1.5 text-good font-bold">
                  <span className="w-2.5 h-2.5 bg-[var(--good-solid)]"></span>
                  Protected / Intact ({wardWorkOrders.filter(w => w.dlpStatus === 'ACTIVE_DLP_PROTECTED').length})
                </span>
              </div>
              <span className="text-xs font-bold opacity-60">
                Click segment to inspect
              </span>
            </div>

            {/* GIS Map Canvas */}
            <div className="relative w-full h-80 sm:h-96 bg-[var(--surface-inverse)] text-white p-4 overflow-hidden flex flex-col justify-between border rounded-[10px] border-line">
              
              {/* Background Technical Grid */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#333_1px,transparent_1px),linear-gradient(to_bottom,#333_1px,transparent_1px)] bg-[size:24px_24px] opacity-30 pointer-events-none"></div>

              {/* Ward Perimeter Label */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="bg-surface text-ink border rounded-[10px] border-line px-2.5 py-1 text-xs font-bold flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-bad" />
                  <span>Ward #{currentWard?.number} Boundary Sector</span>
                </div>
                <div className="text-xs bg-black/60 text-white px-2 py-0.5 border rounded-[10px] border-line">
                  {currentWard?.coordinates.centerLat.toFixed(4)}°N, {currentWard?.coordinates.centerLng.toFixed(4)}°E
                </div>
              </div>

              {/* Road Segments Rendering */}
              <div className="relative z-10 my-auto space-y-2 py-2 overflow-y-auto max-h-56 pr-1 no-scrollbar">
                {wardWorkOrders.map((wo) => {
                  const isSelected = selectedWorkOrder?.id === wo.id;
                  const isBreach = wo.dlpStatus === 'DLP_BREACH_UNRESOLVED';

                  return (
                    <div
                      key={wo.id}
                      onClick={() => setSelectedRoadId(wo.id)}
                      className={`cursor-pointer transition-all p-2.5 border rounded-[10px] flex items-center justify-between ${
 isSelected
 ? isBreach
 ? 'bg-[var(--bad)] text-white border-white'
 : 'bg-surface text-ink border-white'
 : isBreach
 ? 'bg-[var(--surface-inverse)] border-[var(--bad)] text-white hover:bg-black'
 : 'bg-[var(--surface-inverse)] border-line text-white/90 hover:border-white'
 }`}
                    >
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <div className={`w-2.5 h-2.5 shrink-0 ${
 isBreach ? 'bg-[var(--bad)]' : 'bg-emerald-400'
 } ${isSelected ? 'ring-2 ring-white' : ''}`} />
                        <div className="min-w-0">
                          <p className="text-xs font-bold truncate tracking-tight">
                            {wo.roadName}
                          </p>
                          <p className={`text-xs flex items-center gap-1.5 truncate ${isSelected && isBreach ? 'text-white/90' : 'opacity-70'}`}>
                            <span>{wo.contractorName}</span>
                            <span>•</span>
                            <span>₹{wo.sanctionedAmountLakhs}L</span>
                            <span>•</span>
                            <span>{wo.roadLengthKm} km</span>
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0 pl-2">
                        <span className={`text-xs font-bold px-2 py-0.5 border rounded-[10px] ${
 isSelected
 ? 'bg-black text-white border-white'
 : isBreach
 ? 'bg-[var(--bad)]/20 text-[var(--bad)] border-[var(--bad)]'
 : 'bg-emerald-950 text-emerald-300 border-emerald-500'
 }`}>
                          {isBreach ? `${wo.activeFailuresCount} Defects` : 'DLP Active'}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {wardWorkOrders.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-xs opacity-60">No road segments found matching filter.</p>
                  </div>
                )}
              </div>

              {/* Bottom Help Text */}
              <div className="relative z-10 flex items-center justify-between text-xs opacity-70 pt-2 border-t border-line">
                <span>State e-Procurement GIS Layer</span>
                <span className="font-bold text-bad">Warranty: 36 Months Mandatory</span>
              </div>

            </div>
          </div>

        </div>

        {/* Right: Selected Road & Contractor Inspector Panel (5 cols) */}
        <div className="lg:col-span-5 bg-surface border rounded-[10px] border-line p-5 space-y-4 shadow-sm">
          
          {selectedWorkOrder ? (
            <>
              {/* Road Title & Status */}
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold opacity-60">
                    Tender: {selectedWorkOrder.tenderNumber}
                  </span>
                  <span className={`text-xs font-bold px-2 py-0.5 ${
 selectedWorkOrder.dlpStatus === 'DLP_BREACH_UNRESOLVED'
 ? 'bg-[var(--bad)] text-white'
 : 'bg-[var(--surface-inverse)] text-white'
 }`}>
                    {selectedWorkOrder.dlpStatus === 'DLP_BREACH_UNRESOLVED' ? 'Active DLP Breach' : 'Warranty Intact'}
                  </span>
                </div>

                <h3 className="text-xl font-bold tracking-tight text-ink mt-1.5">
                  {selectedWorkOrder.roadName}
                </h3>
                <p className="text-xs text-ink-3 mt-0.5">
                  From {selectedWorkOrder.startPoint} to {selectedWorkOrder.endPoint} ({selectedWorkOrder.roadLengthKm} km)
                </p>
              </div>

              {/* Contractor Card */}
              <div className="bg-surface-2 p-3.5 border rounded-[10px] border-line space-y-2">
                <span className="text-xs opacity-60 font-bold block">
                  Executing Contractor
                </span>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-ink">
                    {selectedWorkOrder.contractorName}
                  </span>
                  {roadContractor && (
                    <span className={`text-xs font-bold px-2 py-0.5 ${
 roadContractor.integrityScore < 40 ? 'bg-[var(--bad)] text-white' : 'bg-[var(--surface-inverse)] text-white'
 }`}>
                      Score: {roadContractor.integrityScore}/100
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between text-xs text-ink-2 border-t border-line pt-1.5">
                  <span>Sanctioned: <strong className="text-ink">₹{selectedWorkOrder.sanctionedAmountLakhs} Lakhs</strong></span>
                  <span>Grade: <strong className="text-ink">{selectedWorkOrder.specifications.bitumenGrade}</strong></span>
                </div>
              </div>

              {/* Defect Liability Countdown Box */}
              <div className={`p-3.5 border rounded-[10px] ${
 dlpDaysLeft > 0 
 ? 'border-[var(--bad)] bg-[var(--bad)]/5 text-ink' 
 : 'border-line bg-surface-2 text-ink'
 }`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold tracking-tight flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-bad" />
                    Defect Liability Period (DLP)
                  </span>
                  <span className="text-xs font-bold bg-[var(--surface-inverse)] text-white px-2 py-0.5">
                    {dlpDaysLeft > 0 ? `${dlpDaysLeft} Days Left` : 'Expired'}
                  </span>
                </div>
                <p className="text-xs text-ink-2 mt-1.5">
                  Completed on {selectedWorkOrder.completionDate} • Warranty active till <strong>{selectedWorkOrder.dlpExpiryDate}</strong>.
                </p>
                <p className="text-xs text-bad font-bold mt-1">
                  *Under IRC SP:98 standards, contractor owes free restoration.
                </p>
              </div>

              {/* Active Pothole Logs on this Stretch */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span>Logged Defects ({roadDefects.length})</span>
                  <span className="text-xs text-bad">
                    {selectedWorkOrder.activeFailuresCount} active craters
                  </span>
                </div>

                <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                  {roadDefects.map((d) => (
                    <div key={d.id} className="p-2.5 bg-surface-2 border rounded-[10px] border-line text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-bad">{d.defectType}</span>
                        <span className="text-xs opacity-60">{d.reportedDate}</span>
                      </div>
                      <p className="text-xs text-ink-2 mt-0.5">{d.description}</p>
                      <div className="mt-1 flex items-center justify-between text-xs opacity-70">
                        <span>By: {d.reporterName}</span>
                        <span className="font-bold text-ink">{d.citizenUpvotes} verifications</span>
                      </div>
                    </div>
                  ))}

                  {roadDefects.length === 0 && (
                    <div className="p-3 bg-surface-2 border rounded-[10px] border-line text-center text-xs opacity-60">
                      No active road defects reported on this stretch yet.
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons for this specific road */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
                <button
                  onClick={() => onOpenReportModalWithWorkOrder(selectedWorkOrder)}
                  className="w-full sm:flex-1 inline-flex items-center justify-center space-x-1.5 bg-surface hover:bg-surface-3 text-ink text-xs font-bold px-3 py-2 border rounded-[10px] border-line transition-colors"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-bad" />
                  <span>Log Defect Here</span>
                </button>

                <button
                  onClick={() => onGenerateActionWithWorkOrder(selectedWorkOrder)}
                  className="w-full sm:flex-1 inline-flex items-center justify-center space-x-1.5 bg-[var(--bad-solid)] hover:bg-[var(--surface-inverse)] text-white text-xs font-bold tracking-tight px-3 py-2 transition-colors shadow-sm"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Generate RTI / Notice</span>
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-16 text-xs opacity-60">
              Select a road segment from the map to inspect details.
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
