import React, { useState, useMemo } from 'react';
import { monthlyMinistries, monthlyStates } from '../data/cpgramsData';
import { useWhatsAppShare } from '../../../core/hooks/useWhatsAppShare';
import { getUpdatedGrievances } from '../../../core/utils/autoUpdater';

export function CpgramsDashboard() {
  const { share } = useWhatsAppShare();
  const [activeTab, setActiveTab] = useState<'ministry' | 'state'>('ministry');

  // Compute daily auto-updated caseload statistics
  const updatedMinistries = useMemo(() => getUpdatedGrievances(monthlyMinistries), []);
  const updatedStates = useMemo(() => getUpdatedGrievances(monthlyStates), []);

  const handleShareWhatsApp = (item: any, type: 'ministry' | 'state') => {
    const title = type === 'ministry' ? item.nameHi : item.nameHi;
    const statLabel = `Avg Resolution: ${item.avgDisposalDays} Days`;
    const statLabelHi = `औसत निपटान समय: ${item.avgDisposalDays} दिन`;
    const realityLabel = `Backlog Over 30 Days: ${item.backlogOver30Days.toLocaleString('hi-IN')} cases`;
    const realityLabelHi = `३० दिनों से अधिक लंबित: ${item.backlogOver30Days.toLocaleString('hi-IN')} मामले`;

    share({
      pinCode: '000000', // Central index
      titleHindi: `CPGRAMS रिपोर्ट कार्ड: ${title}`,
      titleEnglish: `CPGRAMS Grievance Performance: ${item.name}`,
      claimLabel: statLabel,
      claimLabelHindi: statLabelHi,
      realityLabel: realityLabel,
      realityLabelHindi: realityLabelHi,
      responsiblePerson: type === 'ministry' ? 'Ministry Secretary' : 'State Nodal Officer',
      responsibleOrg: item.name,
      sourceUrl: 'https://pgportal.gov.in',
      moduleNameHindi: 'M15 - CPGRAMS Shame Index (शिकायत विलंब सूचकांक)',
    });
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '1rem' }}>
      
      {/* Module Title */}
      <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem', borderLeft: '4px solid #ef4444' }}>
        <h2 style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>
          📉 CPGRAMS Shame Index (शिकायत विलंब सूचकांक)
        </h2>
        <p style={{ opacity: 0.8, fontSize: '0.9rem', lineHeight: 1.5 }}>
          <strong>M15 - स्व-मूल्यांकन रिपोर्ट:</strong> भारत सरकार के प्रशासनिक सुधार विभाग (DARPG) द्वारा जारी मासिक डेटा। सरकारी मंत्रालयों और राज्यों के शिकायत निपटान प्रदर्शन की पोल खोलता सूचकांक।
        </p>
      </div>

      {/* Switch Tabs */}
      <div className="dash-tab-group">
        <button
          onClick={() => setActiveTab('ministry')}
          className={`dash-tab-btn ${activeTab === 'ministry' ? 'active' : ''}`}
        >
          Worst Performing Ministries (केंद्रीय मंत्रालय)
        </button>
        <button
          onClick={() => setActiveTab('state')}
          className={`dash-tab-btn ${activeTab === 'state' ? 'active' : ''}`}
        >
          Worst Performing States (राज्य सरकारें)
        </button>
      </div>

      {/* Rankings List */}
      <div style={{ display: 'grid', gap: '1.5rem' }}>
        {activeTab === 'ministry' ? (
          updatedMinistries.map(item => (
            <div key={item.id} className="glass-card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
                <div>
                  <span style={{
                    fontSize: '0.75rem',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    background: 'rgba(239, 68, 68, 0.15)',
                    color: '#ef4444',
                    fontWeight: 700,
                    marginRight: '0.5rem',
                  }}>
                    SHAME RANK #{item.rank}
                  </span>
                  <h3 style={{ fontSize: '1.15rem', display: 'inline-block', margin: 0 }}>{item.nameHi}</h3>
                  <div style={{ fontSize: '0.75rem', opacity: 0.6, marginTop: '0.2rem' }}>{item.name}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ef4444' }}>
                    {item.avgDisposalDays} Days
                  </div>
                  <div style={{ fontSize: '0.6rem', opacity: 0.5 }}>Average Disposal Time</div>
                </div>
              </div>

              {/* Stats Split Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="stat-box">
                  <div style={{ fontSize: '0.65rem', opacity: 0.5 }}>Total Caseload / कुल मामले</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: '0.25rem' }}>
                    {item.totalGrievances.toLocaleString('hi-IN')}
                  </div>
                </div>

                <div style={{ background: 'var(--status-critical-bg)', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.15)' }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--status-critical)' }}>Backlog Over 30 Days / ३०+ दिन लंबित</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ef4444', marginTop: '0.25rem' }}>
                    {item.backlogOver30Days.toLocaleString('hi-IN')} cases
                  </div>
                </div>
              </div>

              {/* Worst performing category */}
              <div style={{ fontSize: '0.75rem', padding: '0.5rem 0.75rem', borderRadius: '6px', background: 'rgba(245, 158, 11, 0.05)', borderLeft: '3px solid #f59e0b', marginBottom: '1rem' }}>
                ⚠️ <strong>सर्वाधिक विफलता श्रेणी (Worst Category):</strong> {item.worstCategoryHi} ({item.worstCategoryEn})
              </div>

              {/* Share block */}
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={() => handleShareWhatsApp(item, 'ministry')} className="btn-whatsapp">
                  📤 Send Shame Card on WhatsApp
                </button>
              </div>
            </div>
          ))
        ) : (
          updatedStates.map(item => (
            <div key={item.id} className="glass-card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
                <div>
                  <span style={{
                    fontSize: '0.75rem',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    background: 'rgba(239, 68, 68, 0.15)',
                    color: '#ef4444',
                    fontWeight: 700,
                    marginRight: '0.5rem',
                  }}>
                    SHAME RANK #{item.rank}
                  </span>
                  <h3 style={{ fontSize: '1.15rem', display: 'inline-block', margin: 0 }}>{item.nameHi}</h3>
                  <div style={{ fontSize: '0.75rem', opacity: 0.6, marginTop: '0.2rem' }}>{item.name}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ef4444' }}>
                    {item.avgDisposalDays} Days
                  </div>
                  <div style={{ fontSize: '0.6rem', opacity: 0.5 }}>Average Disposal Time</div>
                </div>
              </div>

              {/* Stats Split Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="stat-box">
                  <div style={{ fontSize: '0.65rem', opacity: 0.5 }}>Total Caseload / कुल मामले</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: '0.25rem' }}>
                    {item.totalGrievances.toLocaleString('hi-IN')}
                  </div>
                </div>

                <div style={{ background: 'var(--status-critical-bg)', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.15)' }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--status-critical)' }}>Backlog Over 30 Days / ३०+ दिन लंबित</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ef4444', marginTop: '0.25rem' }}>
                    {item.backlogOver30Days.toLocaleString('hi-IN')} cases
                  </div>
                </div>
              </div>

              {/* Worst performing district */}
              <div style={{ fontSize: '0.75rem', padding: '0.5rem 0.75rem', borderRadius: '6px', background: 'rgba(245, 158, 11, 0.05)', borderLeft: '3px solid #f59e0b', marginBottom: '1rem' }}>
                ⚠️ <strong>सर्वाधिक विफलता जिला (Worst District Area):</strong> {item.worstDistrictHi} ({item.worstDistrictEn})
              </div>

              {/* Share block */}
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={() => handleShareWhatsApp(item, 'state')} className="btn-whatsapp">
                  📤 Send Shame Card on WhatsApp
                </button>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
