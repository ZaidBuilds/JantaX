import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useWhatsAppShare } from '../../../core/hooks/useWhatsAppShare';
import { resolvePincode } from '../../../core/utils/pinResolver';

export function RationDashboard() {
  const { share } = useWhatsAppShare();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialPin = searchParams.get('pin') || '250001';
  const [pinInput, setPinInput] = useState(initialPin);
  const [currentPin, setCurrentPin] = useState(initialPin);

  React.useEffect(() => {
    const p = searchParams.get("pin") || "250001";
    setPinInput(p);
    setCurrentPin(p);
  }, [searchParams]);

  const loc = useMemo(() => resolvePincode(currentPin), [currentPin]);

  const pdsStores = useMemo(() => {
    const suffix = parseInt(currentPin.substring(3, 6)) || 1;
    return [
      {
        shopNo: `FPS-UP-${suffix}892`,
        dealerName: loc.region === 'North' ? 'श्री संजय शर्मा' : 'श्री एम. रविचंद्रन',
        claimedQuota: 'गेहूं: 5kg/व्यक्ति, चावल: 3kg/व्यक्ति (मुफ्त)',
        realityStatus: 'दुकान महीने में केवल १२ दिन खुलती है। चावल का स्टॉक अक्सर गायब रहता है।',
        lastAuditDate: '2025-08-10',
        auditFinding: '12% राशन स्टॉक में विसंगति पाई गई (CAG ऑडिट संदर्भ)',
      }
    ];
  }, [currentPin, loc]);

  const handleShare = (shop: any) => {
    share({
      pinCode: currentPin,
      titleHindi: `राशन दुकान रिपोर्ट: FPS संख्या ${shop.shopNo}`,
      titleEnglish: `Ration Shop Audit Report: FPS ${shop.shopNo}`,
      claimLabel: `Claimed Quota: ${shop.claimedQuota}`,
      claimLabelHindi: `सरकारी राशन कोटा: ${shop.claimedQuota}`,
      realityLabel: `Reality check: ${shop.realityStatus}`,
      realityLabelHindi: `ज़मीनी हकीकत: ${shop.realityStatus}`,
      responsiblePerson: shop.dealerName,
      responsibleOrg: 'Food & Civil Supplies Department',
      sourceUrl: 'https://nfsa.gov.in',
      moduleNameHindi: 'M5 - राशन रिपोर्ट (PDS/Ration Audit)',
    });
  };

  return (
    <div className="module-dashboard">
      <div className="glass-card dash-header-card" style={{ borderLeftColor: '#d97706' }}>
        <h2>🍚 राशन और कल्याण रिपोर्ट (PDS/Ration & Welfare Audit)</h2>
        <p>
          राष्ट्रीय खाद्य सुरक्षा अधिनियम (NFSA) के तहत आवंटित अनाज कोटा बनाम राशन दुकान की कार्यप्रणाली की वास्तविक जांच।
        </p>
      </div>

      <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>Search Local PDS Shop</h3>
        <div className="dash-search-row">
          <input
            type="text"
            className="form-input"
            maxLength={6}
            value={pinInput}
            onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
            placeholder="पिन कोड दर्ज करें..."
          />
          <button onClick={() => { setCurrentPin(pinInput); setSearchParams({ pin: pinInput }); }} className="dash-search-btn">
            खोजें
          </button>
        </div>
        {loc.isValid && (
          <p className="dash-location-label">
            📍 Active: {loc.district} ({loc.state})
          </p>
        )}
      </div>

      <div style={{ display: 'grid', gap: '1.5rem' }}>
        {pdsStores.map((shop, idx) => (
          <div key={idx} className="glass-card" style={{ padding: '1.25rem' }}>
            <div className="card-ribbon" style={{ margin: '-1.25rem -1.25rem 1rem', borderRadius: '10px 10px 0 0' }}>
              <span>FPS LICENSE NO: <strong>{shop.shopNo}</strong></span>
              <span>Dealer: <strong>{shop.dealerName}</strong></span>
            </div>

            <div className="dash-panel-grid" style={{ marginBottom: '1rem' }}>
              <div className="dash-panel claim">
                <span className="dash-panel-label">📢 ALLOCATED QUOTA (आधिकारिक आवंटन)</span>
                <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>{shop.claimedQuota}</p>
              </div>
              <div className="dash-panel reality">
                <span className="dash-panel-label">👁️ GROUND REALITY (जमीनी हकीकत)</span>
                <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>{shop.realityStatus}</p>
              </div>
            </div>

            <div style={{ fontSize: '0.75rem', padding: '0.5rem 0.75rem', borderRadius: '6px', background: 'var(--status-critical-bg)', borderLeft: '3px solid var(--status-critical)', marginBottom: '1rem', color: 'var(--text-primary)' }}>
              📋 <strong>Audit Finding:</strong> {shop.auditFinding} (Report Date: {shop.lastAuditDate})
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => handleShare(shop)} className="btn-whatsapp">
                📤 Share Ration Audit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
