import React, { useState } from 'react';
import { 
  X, 
  AlertTriangle, 
  CheckCircle2, 
  Send,
  Landmark,
  Building2
} from 'lucide-react';
import { WorkOrder, DefectType, SeverityLevel } from '../types';
import { INDIAN_STATES, getCitiesByState } from '../data/statesAndCities';
import { apiUrl } from '../../../core/services/api';

interface ReportFailureModalProps {
  isOpen: boolean;
  onClose: () => void;
  workOrders: WorkOrder[];
  preselectedWorkOrder: WorkOrder | null;
  onSubmitSuccess: () => void;
}

export const ReportFailureModal: React.FC<ReportFailureModalProps> = ({
  isOpen,
  onClose,
  workOrders,
  preselectedWorkOrder,
  onSubmitSuccess,
}) => {
  const [filterState, setFilterState] = useState<string>('all-india');
  const [filterCity, setFilterCity] = useState<string>('all');
  const [selectedWoId, setSelectedWoId] = useState<string>(
    preselectedWorkOrder?.id || workOrders[0]?.id || 'wo-101'
  );
  const [defectType, setDefectType] = useState<DefectType>('Pothole Cluster');
  const [severity, setSeverity] = useState<SeverityLevel>('HIGH');
  const [description, setDescription] = useState<string>('');
  const [reporterName, setReporterName] = useState<string>('');
  const [photoUrl, setPhotoUrl] = useState<string>(
    'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80'
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  if (!isOpen) return null;

  const availableCities = getCitiesByState(filterState);

  // Filter work orders by state / city if specified
  const filteredWorkOrders = workOrders.filter(wo => {
    if (filterCity !== 'all' && filterCity !== 'all-cities') {
      const cityKeyword = filterCity.toLowerCase();
      if (!wo.city.toLowerCase().includes(cityKeyword)) return false;
    }
    return true;
  });

  const currentWo = workOrders.find(w => w.id === selectedWoId) || filteredWorkOrders[0] || workOrders[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentWo) return;
    setIsSubmitting(true);

    try {
      const res = await fetch(apiUrl('/api/defects'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workOrderId: currentWo.id,
          roadName: currentWo.roadName,
          wardId: currentWo.wardId,
          wardName: currentWo.wardName,
          city: currentWo.city,
          contractorId: currentWo.contractorId,
          contractorName: currentWo.contractorName,
          defectType,
          severity,
          description: description || `Pothole and road deterioration reported along ${currentWo.roadName}.`,
          photoUrl,
          reporterName: reporterName || 'Concerned Citizen / RWA Member',
          coordinates: {
            lat: currentWo.coordinates.lat1,
            lng: currentWo.coordinates.lng1,
          },
        }),
      });

      if (res.ok) {
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          onSubmitSuccess();
          onClose();
        }, 1800);
      }
    } catch (err) {
      console.error('Failed to submit defect report:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-surface border rounded-[10px] border-line max-w-xl w-full flex flex-col shadow-lg overflow-hidden my-6">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-line flex items-start justify-between bg-surface-2">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-[var(--bad-solid)] text-white px-2 py-0.5 text-xs font-bold">
                Citizen Audit Tool
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-ink mt-1">
              Log Road Failure & Attribute Contractor
            </h2>
            <p className="text-xs text-ink-3 mt-1">
              Unlike generic complaint apps, this report directly flags the contractor's public integrity scorecard and DLP liability ledger.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 border rounded-[10px] border-line text-ink hover:bg-[var(--surface-inverse)] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 bg-[var(--good-solid)] text-white flex items-center justify-center mx-auto border rounded-[10px] border-line">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-ink">
              Road Failure Attributed Successfully!
            </h3>
            <p className="text-xs text-ink-2">
              Assigned to <strong className="font-sans font-bold text-ink">{currentWo.contractorName}</strong>. The Defect Liability Period breach counter has been incremented on the public scorecard.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
            
            {/* Filter Work Order by State & City */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-surface-2 border rounded-[10px] border-line p-2.5">
              <div>
                <label className="text-xs font-bold text-ink-2 block mb-1 flex items-center gap-1">
                  <Landmark className="w-3 h-3 text-ink" />
                  <span>Filter by State:</span>
                </label>
                <select
                  value={filterState}
                  onChange={(e) => {
                    setFilterState(e.target.value);
                    setFilterCity('all');
                  }}
                  className="w-full bg-surface border rounded-[10px] border-line px-2 py-1 text-xs font-bold text-ink cursor-pointer"
                >
                  <option value="all-india">All States & UTs (Pan-India)</option>
                  {INDIAN_STATES.filter(s => s.id !== 'all-india').map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-ink-2 block mb-1 flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-bad" />
                  <span>Filter by City:</span>
                </label>
                <select
                  value={filterCity}
                  onChange={(e) => setFilterCity(e.target.value)}
                  className="w-full bg-surface border rounded-[10px] border-line px-2 py-1 text-xs font-bold text-ink cursor-pointer"
                >
                  <option value="all">All Cities in State</option>
                  {availableCities.map((ct) => (
                    <option key={ct.id} value={ct.name}>
                      {ct.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Road / Work Order Picker */}
            <div>
              <label className="text-xs font-bold text-ink block mb-1">
                Select Road / Municipal Work Order ({filteredWorkOrders.length} Available):
              </label>
              <select
                value={selectedWoId}
                onChange={(e) => setSelectedWoId(e.target.value)}
                className="w-full bg-surface-2 border rounded-[10px] border-line px-3 py-2 text-xs font-bold text-ink focus:outline-none cursor-pointer"
              >
                {filteredWorkOrders.map((wo) => (
                  <option key={wo.id} value={wo.id}>
                    {wo.roadName} ({wo.city} • {wo.wardName} • {wo.contractorName})
                  </option>
                ))}
              </select>

              {currentWo && (
                <div className="mt-2 p-2.5 bg-surface-2 border rounded-[10px] border-line text-xs text-ink-2 flex justify-between">
                  <span>Executing: <strong className="text-ink font-bold">{currentWo.contractorName}</strong></span>
                  <span>DLP Warranty: <strong className="text-bad font-bold">{currentWo.dlpExpiryDate}</strong></span>
                </div>
              )}
            </div>

            {/* Defect Type & Severity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-ink block mb-1">
                  Defect Classification:
                </label>
                <select
                  value={defectType}
                  onChange={(e: any) => setDefectType(e.target.value)}
                  className="w-full bg-surface-2 border rounded-[10px] border-line px-3 py-2 text-xs font-bold text-ink focus:outline-none cursor-pointer"
                >
                  <option value="Pothole Cluster">Pothole Cluster / Craters</option>
                  <option value="Asphalt Stripping & Ravelling">Asphalt Stripping & Ravelling</option>
                  <option value="Trench & Road Cave-in">Trench & Road Cave-in</option>
                  <option value="Drainage Inundation & Waterlogging">Drainage Inundation & Waterlogging</option>
                  <option value="Premature Surface Cracking">Premature Surface Cracking</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-ink block mb-1">
                  Hazard Severity:
                </label>
                <select
                  value={severity}
                  onChange={(e: any) => setSeverity(e.target.value)}
                  className="w-full bg-surface-2 border rounded-[10px] border-line px-3 py-2 text-xs font-bold text-ink focus:outline-none cursor-pointer"
                >
                  <option value="CRITICAL_HAZARD">Critical Hazard (Accident Prone)</option>
                  <option value="HIGH">High (Deep Craters)</option>
                  <option value="MEDIUM">Medium (Wear & Tear)</option>
                  <option value="LOW">Low (Early Cracking)</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-xs font-bold text-ink block mb-1">
                Description / Landmark Details:
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Near Sony World junction turning, 4 deep potholes causing traffic snarls and water logging..."
                rows={3}
                className="w-full bg-surface-2 border rounded-[10px] border-line p-3 text-xs text-ink placeholder:text-ink-4 focus:outline-none focus:bg-surface resize-none"
              />
            </div>

            {/* Reporter Name & Photo Preset */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-ink block mb-1">
                  Your Name / RWA:
                </label>
                <input
                  type="text"
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  placeholder="e.g. Koramangala 4th Block RWA"
                  className="w-full bg-surface-2 border rounded-[10px] border-line px-3 py-2 text-xs text-ink placeholder:text-ink-4 focus:outline-none font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-ink block mb-1">
                  Evidence Photo URL:
                </label>
                <input
                  type="text"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-surface-2 border rounded-[10px] border-line px-3 py-2 text-xs text-ink placeholder:text-ink-4 focus:outline-none text-xs"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-3 border-t border-line flex items-center justify-between">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-surface hover:bg-surface-3 text-xs font-bold text-ink border rounded-[10px] border-line transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center space-x-1.5 bg-[var(--bad-solid)] hover:bg-[var(--surface-inverse)] text-white text-xs font-bold tracking-tight px-5 py-2.5 transition-colors disabled:opacity-50 shadow-sm"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Logging...' : 'Submit Defect to Scorecard'}</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
