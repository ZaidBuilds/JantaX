import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, X, Check, Search } from 'lucide-react';
import { isValidIndianPincode, resolvePincode, resolvePincodeAccurate, ResolvedLocation } from '../core/utils/pinResolver';
import { useLanguage } from '../core/context/LanguageContext';

interface PinModalProps {
  isOpen: boolean;
  currentPin: string;
  onClose: () => void;
  onSelectPin: (pin: string) => void;
  onDetectLocation: () => Promise<string | null>;
  isDetecting: boolean;
}

const TOP_CITIES = [
  { name: 'Delhi', pin: '110001', state: 'Delhi' },
  { name: 'Meerut', pin: '250001', state: 'Uttar Pradesh' },
  { name: 'Bengaluru', pin: '560001', state: 'Karnataka' },
  { name: 'Mumbai', pin: '400001', state: 'Maharashtra' },
  { name: 'Lucknow', pin: '226001', state: 'Uttar Pradesh' },
  { name: 'Kolkata', pin: '700001', state: 'West Bengal' },
  { name: 'Chennai', pin: '600001', state: 'Tamil Nadu' },
  { name: 'Patna', pin: '800001', state: 'Bihar' },
  { name: 'Hyderabad', pin: '500001', state: 'Telangana' },
];

export function PinModal({
  isOpen,
  currentPin,
  onClose,
  onSelectPin,
  onDetectLocation,
  isDetecting,
}: PinModalProps) {
  const { tr } = useLanguage();
  const [pinInput, setPinInput] = useState(currentPin || '');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [resolved, setResolved] = useState<ResolvedLocation | null>(null);

  useEffect(() => {
    setPinInput(currentPin || '');
    setErrorMsg(null);
  }, [currentPin, isOpen]);

  useEffect(() => {
    if (pinInput.length === 6 && isValidIndianPincode(pinInput)) {
      setResolved(resolvePincode(pinInput));
      let isCurrent = true;
      resolvePincodeAccurate(pinInput).then((accurate) => {
        if (isCurrent) setResolved(accurate);
      });
      return () => {
        isCurrent = false;
      };
    } else {
      setResolved(null);
    }
  }, [pinInput]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleApply = (pinToApply: string) => {
    const clean = pinToApply.replace(/\D/g, '');
    if (!isValidIndianPincode(clean)) {
      setErrorMsg(tr('Please enter a valid 6-digit Indian PIN code', 'कृपया 6 अंकों का मान्य भारतीय पिन कोड दर्ज करें'));
      return;
    }
    onSelectPin(clean);
    onClose();
  };

  const handleDetect = async () => {
    try {
      const pin = await onDetectLocation();
      if (pin) {
        onSelectPin(pin);
        onClose();
      }
    } catch {
      setErrorMsg(tr('Unable to detect location. Please enter your PIN manually.', 'स्थान प्राप्त करने में असमर्थ। कृपया मैन्युअल रूप से दर्ज करें।'));
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="pin-modal-title">
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--navy-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--navy-600)' }}>
              <MapPin size={18} />
            </div>
            <div>
              <h3 id="pin-modal-title" style={{ fontSize: '1.15rem', color: 'var(--navy-950)', margin: 0 }}>
                {tr('Set Your Locality', 'स्थान चुनें')}
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                {tr('Filter civic projects, schools, and hospitals by PIN', 'पिन कोड द्वारा स्थानीय स्कूलों, अस्पतालों व परियोजनाओं की जांच करें')}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.25rem', borderRadius: 6 }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.5rem' }}>
          {/* Geolocation Button */}
          <button
            type="button"
            onClick={handleDetect}
            disabled={isDetecting}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem',
              background: 'var(--bg-subtle)',
              border: '1.5px dashed var(--border-hover)',
              borderRadius: 'var(--radius-lg)',
              color: 'var(--navy-700)',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: isDetecting ? 'wait' : 'pointer',
              marginBottom: '1.25rem',
              transition: 'all 0.15s ease',
            }}
          >
            <Navigation size={16} className={isDetecting ? 'animate-spin' : ''} />
            <span>{isDetecting ? tr('Locating…', 'स्थान खोज रहे हैं…') : tr('Use My Current Location', 'मेरे वर्तमान स्थान का उपयोग करें')}</span>
          </button>

          <div style={{ position: 'relative', marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              {tr('Or Enter Any 6-Digit Indian PIN Code', 'या कोई भी 6 अंकों का भारतीय पिन कोड दर्ज करें')}
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Search size={18} style={{ position: 'absolute', left: '1rem', color: 'var(--text-muted)' }} />
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={pinInput}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  setPinInput(val);
                  setErrorMsg(null);
                }}
                placeholder="e.g. 110001, 682001, 302001..."
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem 0.85rem 2.75rem',
                  fontSize: '1.25rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  border: errorMsg ? '2px solid var(--crimson-500)' : '2px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  outline: 'none',
                }}
              />
            </div>

            {errorMsg && (
              <p style={{ color: 'var(--crimson-600)', fontSize: '0.78rem', marginTop: '0.35rem', fontWeight: 600 }}>
                {errorMsg}
              </p>
            )}

            {resolved && resolved.isValid && (
              <div style={{ marginTop: '0.6rem', padding: '0.6rem 0.85rem', background: 'var(--emerald-50)', border: '1px solid var(--emerald-100)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--emerald-700)', fontSize: '0.82rem', fontWeight: 600 }}>
                <Check size={16} />
                <span>
                  {resolved.isVerifiedByIndiaPost ? tr('✓ India Post Verified:', '✓ डाक विभाग द्वारा सत्यापित:') : tr('Resolved Locality:', 'सत्यापित स्थान:')}{' '}
                  {resolved.postOffice ? `${resolved.postOffice} · ` : ''}{resolved.district}, {resolved.state} ({resolved.region} India)
                </span>
              </div>
            )}
          </div>

          {/* Quick Popular Cities */}
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.5rem' }}>
              {tr('Popular Cities', 'प्रमुख शहर')}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.45rem' }}>
              {TOP_CITIES.map((c) => (
                <button
                  key={c.pin}
                  type="button"
                  onClick={() => handleApply(c.pin)}
                  style={{
                    padding: '0.5rem 0.4rem',
                    background: pinInput === c.pin ? 'var(--navy-50)' : '#ffffff',
                    border: pinInput === c.pin ? '1.5px solid var(--navy-600)' : '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--navy-950)' }}>{c.name}</div>
                  <div style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{c.pin}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div style={{ padding: '1rem 1.5rem', background: 'var(--bg-subtle)', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary"
            style={{ padding: '0.5rem 1.15rem' }}
          >
            {tr('Cancel', 'रद्द करें')}
          </button>
          <button
            type="button"
            onClick={() => handleApply(pinInput)}
            className="btn btn-primary"
            style={{ padding: '0.5rem 1.5rem' }}
          >
            {tr('Apply PIN', 'लागू करें')}
          </button>
        </div>
      </div>
    </div>
  );
}
