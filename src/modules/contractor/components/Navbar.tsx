import { useEffect, useState, type FormEvent } from 'react';
import { Split, MapPin, BarChart3, Layers, FileText, Sparkles, Scale, Camera, PlusCircle, HelpCircle } from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../translations';
import { INDIAN_STATES, getCitiesByState, getCityById } from '../data/statesAndCities';

type Tab = 'claim-reality' | 'pincode' | 'leaderboard' | 'map' | 'action' | 'ai-audit' | 'compare';

interface NavbarProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
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

/**
 * Contractor module toolbar. The module title lives in the shared module
 * frame, so this only carries area selection, actions and the section tabs.
 */
export function Navbar({
  activeTab,
  setActiveTab,
  selectedState,
  setSelectedState,
  selectedCity,
  setSelectedCity,
  selectedPincode,
  onSelectPincode,
  language,
  onOpenReportModal,
  onOpenAnonymousDrop,
  onOpenAboutModal,
  activeDlpBreaches,
}: NavbarProps) {
  const cities = getCitiesByState(selectedState);
  const [pinDraft, setPinDraft] = useState(selectedPincode);
  useEffect(() => setPinDraft(selectedPincode), [selectedPincode]);

  const pickState = (stateId: string) => {
    setSelectedState(stateId);
    const first = getCitiesByState(stateId)[0];
    if (first) {
      setSelectedCity(first.id);
      if (first.defaultPincode) onSelectPincode(first.defaultPincode);
    }
  };

  const pickCity = (cityId: string) => {
    setSelectedCity(cityId);
    const city = getCityById(cityId);
    if (city?.defaultPincode) onSelectPincode(city.defaultPincode);
  };

  const submitPin = (e: FormEvent) => {
    e.preventDefault();
    if (/^[1-9]\d{5}$/.test(pinDraft)) onSelectPincode(pinDraft);
  };

  const tabs: { id: Tab; label: string; icon: typeof Split }[] = [
    { id: 'claim-reality', label: getTranslation(language, 'navClaimsVsReality'), icon: Split },
    { id: 'pincode', label: getTranslation(language, 'navPincodeAudit'), icon: MapPin },
    { id: 'leaderboard', label: getTranslation(language, 'navContractorLeaderboard'), icon: BarChart3 },
    { id: 'map', label: getTranslation(language, 'navWardMap'), icon: Layers },
    { id: 'action', label: getTranslation(language, 'navTakeAction'), icon: FileText },
    { id: 'ai-audit', label: getTranslation(language, 'navAiTenderAudit'), icon: Sparkles },
    { id: 'compare', label: 'Compare', icon: Scale },
  ];

  return (
    <div className="stack" style={{ gap: 'var(--s-4)' }}>
      <div className="card card-pad contractor-toolbar">
        <div className="field">
          <label className="label" htmlFor="ct-state">{getTranslation(language, 'selectState')}</label>
          <select id="ct-state" className="select" value={selectedState} onChange={(e) => pickState(e.target.value)}>
            {INDIAN_STATES.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label className="label" htmlFor="ct-city">{getTranslation(language, 'selectCity')}</label>
          <select id="ct-city" className="select" value={selectedCity} onChange={(e) => pickCity(e.target.value)}>
            {cities.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <form className="field" onSubmit={submitPin}>
          <label className="label" htmlFor="ct-pin">PIN code</label>
          <div style={{ display: 'flex', gap: 'var(--s-2)' }}>
            <input id="ct-pin" className="input num" style={{ width: 120 }} inputMode="numeric" maxLength={6} value={pinDraft} onChange={(e) => setPinDraft(e.target.value.replace(/\D/g, ''))} />
            <button type="submit" className="btn btn-secondary">Go</button>
          </div>
        </form>
        <div className="contractor-actions">
          {activeDlpBreaches > 0 && (
            <span className="badge badge-bad" title="Works still under the defect liability period with open defects">
              {activeDlpBreaches} open warranty defects
            </span>
          )}
          <button type="button" className="btn btn-secondary" onClick={onOpenAnonymousDrop}>
            <Camera size={16} aria-hidden="true" /> Add a photo
          </button>
          <button type="button" className="btn btn-primary" onClick={onOpenReportModal}>
            <PlusCircle size={16} aria-hidden="true" /> Log a defect
          </button>
          <button type="button" className="btn btn-ghost btn-icon" onClick={onOpenAboutModal} aria-label="How this module works">
            <HelpCircle size={18} aria-hidden="true" />
          </button>
        </div>
      </div>
      <nav className="tabs" aria-label="Contractor ledger sections">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button key={id} type="button" className={`tab${activeTab === id ? ' is-active' : ''}`} aria-selected={activeTab === id} role="tab" onClick={() => setActiveTab(id)}>
            <Icon size={15} aria-hidden="true" />
            {label}
          </button>
        ))}
      </nav>
    </div>
  );
}
