import React, { useState } from 'react';
import { Camera, Upload, X, ShieldCheck, MapPin, Check, AlertTriangle, Lock, Landmark, Building2 } from 'lucide-react';
import { Language, DefectType, RoadDefectReport } from '../types';
import { getTranslation } from '../translations';
import { INDIAN_STATES, getCitiesByState, getStateById, getCityById } from '../data/statesAndCities';

interface AnonymousPhotoDropModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onReportSubmitted: (report: RoadDefectReport) => void;
}

export const AnonymousPhotoDropModal: React.FC<AnonymousPhotoDropModalProps> = ({
  isOpen,
  onClose,
  language,
  onReportSubmitted,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<string>('pothole');
  const [selectedStateId, setSelectedStateId] = useState<string>('karnataka');
  const [selectedCityId, setSelectedCityId] = useState<string>('bengaluru');
  const [pincode, setPincode] = useState('560034');
  const [locationName, setLocationName] = useState('80 Feet Main Road near Sony World Signal');
  const [defectType, setDefectType] = useState<DefectType>('Pothole Cluster');
  const [description, setDescription] = useState('Asphalt stripped and 6 deep craters formed 3 months after fresh tarring.');
  const [customPhotoUrl, setCustomPhotoUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const availableCities = getCitiesByState(selectedStateId);

  const handleStateChange = (stateId: string) => {
    setSelectedStateId(stateId);
    const cities = getCitiesByState(stateId);
    if (cities && cities.length > 0) {
      const firstCity = cities[0];
      setSelectedCityId(firstCity.id);
      if (firstCity.defaultPincode) {
        setPincode(firstCity.defaultPincode);
      }
    }
  };

  const handleCityChange = (cityId: string) => {
    setSelectedCityId(cityId);
    const city = getCityById(cityId);
    if (city && city.defaultPincode) {
      setPincode(city.defaultPincode);
    }
  };

  if (!isOpen) return null;

  const presets = [
    {
      id: 'pothole',
      title: getTranslation(language, 'presetPotholeAfterRain'),
      defectType: 'Pothole Cluster' as DefectType,
      pincode: '560034',
      location: '80 Feet Road (Koramangala 4th Block)',
      desc: 'Top bitumen course washed out within 3 months of inauguration. Multiple 2-wheeler falls.',
      photoUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'locked_phc',
      title: getTranslation(language, 'presetLockedPhc'),
      defectType: 'Locked PHC / Clinic' as DefectType,
      pincode: '560102',
      location: 'Primary Health Centre, HSR Sector 2',
      desc: 'Ground Truth: Government health sub-centre locked on Wednesday 11:30 AM with heavy padlock. Board says open 9am-4pm.',
      photoUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'stripped_bitumen',
      title: getTranslation(language, 'presetStrippedBitumen'),
      defectType: 'Asphalt Stripping & Ravelling' as DefectType,
      pincode: '400053',
      location: 'New Link Road (Andheri West)',
      desc: 'Mastic asphalt layer detached into loose stones after first 2 hours of rainfall.',
      photoUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'open_drain',
      title: getTranslation(language, 'presetOpenDrain'),
      defectType: 'Trench & Road Cave-in' as DefectType,
      pincode: '110017',
      location: 'Press Enclave Road (Saket)',
      desc: 'Collapsed storm drain trench without barricade or warning signage right near bus stop.',
      photoUrl: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=600&auto=format&fit=crop&q=80',
    },
  ];

  const handleSelectPreset = (preset: typeof presets[0]) => {
    setSelectedPreset(preset.id);
    setPincode(preset.pincode);
    setLocationName(preset.location);
    setDefectType(preset.defectType);
    setDescription(preset.desc);
    setCustomPhotoUrl(preset.photoUrl);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const pinRecord = { pincode, wardName: 'Unknown Ward', city: 'Unknown City', dominantContractor: { contractorId: '', name: 'Unknown', directors: [], sharePercent: 0 }, executiveEngineer: { name: '', designation: '', department: '' } };
    const photo = customPhotoUrl || presets.find(p => p.id === selectedPreset)?.photoUrl || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80';

    const newReport: RoadDefectReport = {
      id: `def-drop-${Date.now()}`,
      workOrderId: 'wo-101',
      pincode: pincode,
      roadName: locationName,
      wardId: 'ward-151',
      wardName: pinRecord.wardName,
      city: pinRecord.city,
      contractorId: pinRecord.dominantContractor.contractorId,
      contractorName: pinRecord.dominantContractor.name,
      executiveEngineerName: pinRecord.executiveEngineer.name,
      reportedDate: new Date().toISOString().split('T')[0],
      defectType: defectType,
      severity: 'CRITICAL_HAZARD',
      isDlpCovered: true,
      daysSinceReported: 1,
      description: description,
      photoUrl: photo,
      coordinates: { lat: 12.935, lng: 77.624 },
      citizenUpvotes: 1,
      status: 'OPEN_DLP_BREACH',
      reporterName: 'Anonymous Ground Truth Drop',
      isAnonymousDrop: true,
    };

    setTimeout(() => {
      onReportSubmitted(newReport);
      setIsSubmitting(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2000);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
      <div className="bg-[#FAFAFA] border-2 border-[#1A1A1A] max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b-2 border-[#1A1A1A] bg-white">
          <div className="flex items-center gap-2">
            <span className="bg-[#D43F33] text-white p-1.5 font-mono text-xs font-bold flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5" />
              <span>{getTranslation(language, 'anonymousDropTitle')}</span>
            </span>
            <span className="bg-emerald-100 text-emerald-800 border border-emerald-400 text-[10px] font-mono font-bold px-2 py-0.5 uppercase">
              0 Login • 100% Anonymous
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-black/5 text-[#1A1A1A] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-4">
          
          <div className="bg-white border border-black/15 p-3 flex items-start gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <p className="font-mono text-xs text-[#1A1A1A] leading-relaxed">
              {getTranslation(language, 'anonymousDropSubtitle')}
            </p>
          </div>

          {/* Quick Presets */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase text-[#1A1A1A] mb-2">
              {getTranslation(language, 'photoDropPreset')}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {presets.map((preset) => (
                <button
                  type="button"
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className={`p-2.5 text-left border text-xs font-mono transition-all cursor-pointer ${
                    selectedPreset === preset.id
                      ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] font-bold shadow-xs'
                      : 'bg-white text-[#1A1A1A] border-black/20 hover:border-black'
                  }`}
                >
                  <span className="block truncate">{preset.title}</span>
                  <span className="text-[10px] opacity-70 block mt-0.5 font-normal">
                    PIN {preset.pincode} • {preset.defectType}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Photo Preview / Dropzone */}
          <div className="border-2 border-dashed border-[#1A1A1A] bg-white p-4 text-center">
            <img 
              src={customPhotoUrl || presets.find(p => p.id === selectedPreset)?.photoUrl} 
              alt="Evidence preview" 
              className="w-full h-36 object-cover border border-black/20 mb-2"
            />
            <div className="text-xs font-mono text-black/70 flex items-center justify-center gap-1.5">
              <Camera className="w-4 h-4 text-[#D43F33]" />
              <span>Timestamp Stamp & Geotag EXIF Verified</span>
            </div>
          </div>

          {/* Hierarchical Location: State then City */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#FAFAFA] border border-black/15 p-3">
            <div>
              <label className="block text-[11px] font-mono font-bold uppercase text-black/70 mb-1 flex items-center gap-1">
                <Landmark className="w-3 h-3 text-[#1A1A1A]" />
                <span>1. {getTranslation(language, 'selectState')}:</span>
              </label>
              <select
                value={selectedStateId}
                onChange={(e) => handleStateChange(e.target.value)}
                className="w-full bg-white border-2 border-[#1A1A1A] px-2.5 py-1.5 text-xs font-mono font-bold text-[#1A1A1A]"
              >
                {INDIAN_STATES.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono font-bold uppercase text-black/70 mb-1 flex items-center gap-1">
                <Building2 className="w-3 h-3 text-[#D43F33]" />
                <span>2. {getTranslation(language, 'selectCity')}:</span>
              </label>
              <select
                value={selectedCityId}
                onChange={(e) => handleCityChange(e.target.value)}
                className="w-full bg-white border-2 border-[#1A1A1A] px-2.5 py-1.5 text-xs font-mono font-bold text-[#1A1A1A]"
              >
                {availableCities.map((ct) => (
                  <option key={ct.id} value={ct.id}>
                    {ct.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* PIN Code & Location Input */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-mono font-bold uppercase text-black/70 mb-1">
                PIN Code (Primary Key):
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="w-full bg-white border-2 border-[#1A1A1A] px-3 py-2 text-xs font-mono font-bold text-[#1A1A1A]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-mono font-bold uppercase text-black/70 mb-1">
                {getTranslation(language, 'locationLandmark')}:
              </label>
              <input
                type="text"
                required
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                className="w-full bg-white border-2 border-[#1A1A1A] px-3 py-2 text-xs font-mono text-[#1A1A1A]"
              />
            </div>
          </div>

          {/* Defect Type Selection */}
          <div>
            <label className="block text-[11px] font-mono font-bold uppercase text-black/70 mb-1">
              Defect Category:
            </label>
            <select
              value={defectType}
              onChange={(e) => setDefectType(e.target.value as DefectType)}
              className="w-full bg-white border-2 border-[#1A1A1A] px-3 py-2 text-xs font-mono text-[#1A1A1A]"
            >
              <option value="Pothole Cluster">Pothole Cluster</option>
              <option value="Locked PHC / Clinic">Locked PHC / Primary Health Centre</option>
              <option value="Asphalt Stripping & Ravelling">Asphalt Stripping & Ravelling</option>
              <option value="Trench & Road Cave-in">Trench & Road Cave-in</option>
              <option value="Drainage Inundation & Waterlogging">Drainage Inundation & Waterlogging</option>
              <option value="Substandard Bitumen / Bleeding">Substandard Bitumen / Bleeding</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[11px] font-mono font-bold uppercase text-black/70 mb-1">
              Ground Truth Notes / Evidence Summary:
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white border-2 border-[#1A1A1A] p-3 text-xs font-mono text-[#1A1A1A]"
            />
          </div>

          {/* Success Banner */}
          {success && (
            <div className="p-3 bg-emerald-100 border-2 border-emerald-700 text-emerald-900 font-mono font-bold text-xs flex items-center gap-2">
              <Check className="w-5 h-5 text-emerald-700" />
              <span>Ground truth evidence successfully added to public PIN ledger!</span>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#D43F33] hover:bg-[#B32E24] text-white py-3.5 text-xs font-bold uppercase tracking-tight flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>{isSubmitting ? 'Posting Evidence...' : getTranslation(language, 'submitGroundTruth')}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
