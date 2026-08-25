import React from 'react';
import { 
  ShieldAlert, 
  MapPin, 
  FileText, 
  Scale, 
  PlusCircle, 
  HelpCircle,
  BarChart3,
  Layers,
  Sparkles,
  Camera,
  Share2,
  Split,
  Globe,
  Landmark,
  Building2,
  ChevronRight
} from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../translations';
import { INDIAN_STATES, getCitiesByState, getStateById, getCityById } from '../data/statesAndCities';

interface NavbarProps {
  activeTab: 'claim-reality' | 'pincode' | 'leaderboard' | 'map' | 'action' | 'ai-audit' | 'compare';
  setActiveTab: (tab: 'claim-reality' | 'pincode' | 'leaderboard' | 'map' | 'action' | 'ai-audit' | 'compare') => void;
  selectedState: string;
  setSelectedState: (stateId: string) => void;
  selectedCity: string;
  setSelectedCity: (cityId: string) => void;
  selectedPincode: string;
  onSelectPincode: (pin: string) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  onOpenReportModal: () => void;
  onOpenAnonymousDrop: () => void;
  onOpenAboutModal: () => void;
  activeDlpBreaches: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  selectedState,
  setSelectedState,
  selectedCity,
  setSelectedCity,
  selectedPincode,
  onSelectPincode,
  language,
  setLanguage,
  onOpenReportModal,
  onOpenAnonymousDrop,
  onOpenAboutModal,
  activeDlpBreaches,
}) => {
  const currentStateObj = getStateById(selectedState) || INDIAN_STATES[0];
  const availableCities = getCitiesByState(selectedState);
  const currentCityObj = getCityById(selectedCity) || availableCities[0];

  const handleStateSelect = (stateId: string) => {
    setSelectedState(stateId);
    const citiesInState = getCitiesByState(stateId);
    if (citiesInState && citiesInState.length > 0) {
      const firstCity = citiesInState[0];
      setSelectedCity(firstCity.id);
      if (firstCity.defaultPincode) {
        onSelectPincode(firstCity.defaultPincode);
      }
    }
  };

  const handleCitySelect = (cityId: string) => {
    setSelectedCity(cityId);
    const city = getCityById(cityId);
    if (city && city.defaultPincode) {
      onSelectPincode(city.defaultPincode);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAFAFA] border-b-2 border-[#1A1A1A] text-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Header Row */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between py-3 gap-3">
          
          {/* Logo & Platform Name */}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-[#1A1A1A] text-white px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-widest">
                CIVIC AUDIT
              </span>
              <span className="bg-[#D43F33] text-white px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-tight flex items-center gap-1.5 animate-pulse">
                <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                {activeDlpBreaches} Active DLP Breaches
              </span>
              
              {/* State > City > PIN Breadcrumb Badge */}
              <div className="hidden sm:flex items-center gap-1 bg-black/5 border border-black/20 text-[10px] font-mono font-semibold px-2 py-0.5 text-[#1A1A1A]">
                <span className="font-bold text-[#D43F33]">{currentStateObj?.name || 'Pan-India'}</span>
                <ChevronRight className="w-2.5 h-2.5 opacity-50" />
                <span>{currentCityObj?.shortName || currentCityObj?.name || 'City'}</span>
                {selectedPincode && (
                  <>
                    <ChevronRight className="w-2.5 h-2.5 opacity-50" />
                    <span className="font-bold bg-[#1A1A1A] text-white px-1">PIN {selectedPincode}</span>
                  </>
                )}
              </div>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter leading-none mt-1.5">
              {getTranslation(language, 'brandTitle')} <span className="italic text-[#D43F33]">Audit</span>
            </h1>
            <p className="mt-0.5 font-mono text-[11px] uppercase tracking-wider opacity-75">
              {getTranslation(language, 'brandSubtitle')}
            </p>
          </div>

          {/* Controls: State Dropdown, City Dropdown, Language & Action CTAs */}
          <div className="flex flex-wrap items-center gap-2 self-start lg:self-end">
            
            {/* Hierarchical Tier 1: State Selector */}
            <div className="flex items-center gap-1 bg-white border-2 border-[#1A1A1A] px-2 py-1 shadow-2xs">
              <Landmark className="w-3.5 h-3.5 text-[#1A1A1A] shrink-0" />
              <div className="flex flex-col">
                <span className="text-[9px] font-mono uppercase text-gray-500 font-bold leading-none">
                  {getTranslation(language, 'selectState')}
                </span>
                <select
                  value={selectedState}
                  onChange={(e) => handleStateSelect(e.target.value)}
                  className="bg-transparent text-xs font-bold uppercase focus:outline-none cursor-pointer pr-1 leading-tight text-[#1A1A1A]"
                  aria-label="Select State"
                >
                  {INDIAN_STATES.map((state) => (
                    <option key={state.id} value={state.id} className="text-[#1A1A1A]">
                      {state.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Hierarchical Tier 2: City Selector (Populated from Chosen State) */}
            <div className="flex items-center gap-1 bg-white border-2 border-[#1A1A1A] px-2 py-1 shadow-2xs">
              <Building2 className="w-3.5 h-3.5 text-[#D43F33] shrink-0" />
              <div className="flex flex-col">
                <span className="text-[9px] font-mono uppercase text-gray-500 font-bold leading-none">
                  {getTranslation(language, 'selectCity')}
                </span>
                <select
                  value={selectedCity}
                  onChange={(e) => handleCitySelect(e.target.value)}
                  className="bg-transparent text-xs font-bold uppercase focus:outline-none cursor-pointer pr-1 leading-tight text-[#1A1A1A]"
                  aria-label="Select City"
                >
                  {availableCities.map((city) => (
                    <option key={city.id} value={city.id} className="text-[#1A1A1A]">
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center gap-1 bg-white border-2 border-[#1A1A1A] px-2 py-1">
              <Globe className="w-3.5 h-3.5 text-[#1A1A1A]" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="bg-transparent text-xs font-bold font-mono uppercase focus:outline-none cursor-pointer pr-1"
                aria-label="Select Language"
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी (Hindi)</option>
                <option value="kn">ಕನ್ನಡ (Kannada)</option>
                <option value="mr">मराठी (Marathi)</option>
                <option value="bn">বাংলা (Bengali)</option>
                <option value="ta">தமிழ் (Tamil)</option>
                <option value="te">తెలుగు (Telugu)</option>
                <option value="gu">ગુજરાતી (Gujarati)</option>
                <option value="ml">മലയാളം (Malayalam)</option>
                <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
              </select>
            </div>

            {/* Anonymous Photo Drop Button */}
            <button
              onClick={onOpenAnonymousDrop}
              className="bg-[#D43F33] hover:bg-[#B32E24] text-white px-3 py-1.5 text-xs font-bold uppercase tracking-tight transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
              title="Anonymous Photo Drop for Ground Truth"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Photo Drop</span>
            </button>

            {/* File Detailed Failure Report */}
            <button
              onClick={onOpenReportModal}
              className="bg-[#1A1A1A] hover:bg-black text-white px-3 py-1.5 text-xs font-bold uppercase tracking-tight transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
              title="Report road failure and attribute to contractor"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">File Notice</span>
            </button>

            {/* About / Methodology */}
            <button
              onClick={onOpenAboutModal}
              className="border-2 border-[#1A1A1A] bg-white hover:bg-black/5 text-[#1A1A1A] p-1.5 text-xs font-bold uppercase transition-colors cursor-pointer"
              title="About Defect Liability Period (DLP) & Methodology"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

          </div>

        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto py-2 border-t border-black/10 no-scrollbar">
          
          {/* 1. Claim vs Reality */}
          <button
            onClick={() => setActiveTab('claim-reality')}
            className={`inline-flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-bold uppercase tracking-tight border-2 transition-all shrink-0 cursor-pointer ${
              activeTab === 'claim-reality'
                ? 'bg-[#D43F33] text-white border-[#D43F33] shadow-xs'
                : 'bg-white text-[#1A1A1A] border-[#1A1A1A]/30 hover:border-[#1A1A1A] hover:bg-black/5'
            }`}
          >
            <Split className="w-3.5 h-3.5" />
            <span>{getTranslation(language, 'navClaimsVsReality')}</span>
          </button>

          {/* 2. PIN Code Primary Key Audit */}
          <button
            onClick={() => setActiveTab('pincode')}
            className={`inline-flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-bold uppercase tracking-tight border-2 transition-all shrink-0 cursor-pointer ${
              activeTab === 'pincode'
                ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-xs'
                : 'bg-white text-[#1A1A1A] border-[#1A1A1A]/30 hover:border-[#1A1A1A] hover:bg-black/5'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-amber-300" />
            <span>{getTranslation(language, 'navPincodeAudit')}</span>
          </button>

          {/* 3. Contractor Scorecards */}
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`inline-flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-bold uppercase tracking-tight border-2 transition-all shrink-0 cursor-pointer ${
              activeTab === 'leaderboard'
                ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-xs'
                : 'bg-white text-[#1A1A1A] border-[#1A1A1A]/30 hover:border-[#1A1A1A] hover:bg-black/5'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>{getTranslation(language, 'navContractorLeaderboard')}</span>
          </button>

          {/* 4. Ward Map */}
          <button
            onClick={() => setActiveTab('map')}
            className={`inline-flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-bold uppercase tracking-tight border-2 transition-all shrink-0 cursor-pointer ${
              activeTab === 'map'
                ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-xs'
                : 'bg-white text-[#1A1A1A] border-[#1A1A1A]/30 hover:border-[#1A1A1A] hover:bg-black/5'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{getTranslation(language, 'navWardMap')}</span>
          </button>

          {/* 5. Citizen Action / RTI */}
          <button
            onClick={() => setActiveTab('action')}
            className={`inline-flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-bold uppercase tracking-tight border-2 transition-all shrink-0 cursor-pointer ${
              activeTab === 'action'
                ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-xs'
                : 'bg-white text-[#1A1A1A] border-[#1A1A1A]/30 hover:border-[#1A1A1A] hover:bg-black/5'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{getTranslation(language, 'navTakeAction')}</span>
          </button>

          {/* 6. AI Tender Scrutiny */}
          <button
            onClick={() => setActiveTab('ai-audit')}
            className={`inline-flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-bold uppercase tracking-tight border-2 transition-all shrink-0 cursor-pointer ${
              activeTab === 'ai-audit'
                ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-xs'
                : 'bg-white text-[#1A1A1A] border-[#1A1A1A]/30 hover:border-[#1A1A1A] hover:bg-black/5'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D43F33]" />
            <span>{getTranslation(language, 'navAiTenderAudit')}</span>
          </button>

          {/* 7. Compare */}
          <button
            onClick={() => setActiveTab('compare')}
            className={`inline-flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-bold uppercase tracking-tight border-2 transition-all shrink-0 cursor-pointer ${
              activeTab === 'compare'
                ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-xs'
                : 'bg-white text-[#1A1A1A] border-[#1A1A1A]/30 hover:border-[#1A1A1A] hover:bg-black/5'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Compare</span>
          </button>

        </div>

      </div>
    </header>
  );
};
