import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  IndianRupee,
  MapPin,
  Search,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Building2,
  PieChart,
  BarChart3,
  Calendar,
  Share2,
  ChevronRight,
  FileText,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { resolvePincode, resolvePincodeAccurate } from '../../../core/utils/pinResolver';
import { useLanguage } from '../../../core/context/LanguageContext';
import { useWhatsAppShare } from '../../../core/hooks/useWhatsAppShare';

export interface BudgetSectorAllocation {
  sector: string;
  sectorHi: string;
  allocatedCr: number;
  spentCr: number;
  utilizationPct: number;
  marchRushSpendPct: number;
  capexPct: number;
  keyProjects: string[];
}

export function BudgetLedgerPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPin = searchParams.get('pin') || '250001';
  const [pinInput, setPinInput] = useState(currentPin);

  const { tr } = useLanguage();
  const { share } = useWhatsAppShare();
  const loc = useMemo(() => resolvePincode(currentPin), [currentPin]);
  const [districtName, setDistrictName] = useState(loc.district);

  useEffect(() => {
    resolvePincodeAccurate(currentPin).then((acc) => {
      if (acc && acc.district) setDistrictName(acc.district);
    });
  }, [currentPin]);

  const budgetSummary = useMemo(() => {
    const isMetro = ['11', '40', '56', '60'].includes(currentPin.slice(0, 2));
    const totalAllocated = isMetro ? 840.5 : 420.8;
    const totalSpent = isMetro ? 698.2 : 328.4;
    const unspent = Number((totalAllocated - totalSpent).toFixed(1));
    const utilizationRate = Math.round((totalSpent / totalAllocated) * 100);

    const sectors: BudgetSectorAllocation[] = [
      {
        sector: 'Roads, Bridges & Transport (PWD / PMGSY)',
        sectorHi: 'सड़कें, पुल एवं परिवहन अवसंरचना',
        allocatedCr: isMetro ? 280.0 : 145.0,
        spentCr: isMetro ? 245.0 : 112.5,
        utilizationPct: isMetro ? 87.5 : 77.6,
        marchRushSpendPct: 34.2,
        capexPct: 92,
        keyProjects: ['Corridor Ring Road Widening', 'Stormwater Culvert Network'],
      },
      {
        sector: 'Public Health & Family Welfare (NHM / CMO)',
        sectorHi: 'चिकित्सा, स्वास्थ्य एवं परिवार कल्याण',
        allocatedCr: isMetro ? 190.0 : 98.4,
        spentCr: isMetro ? 152.0 : 71.2,
        utilizationPct: isMetro ? 80.0 : 72.4,
        marchRushSpendPct: 28.5,
        capexPct: 45,
        keyProjects: ['District Hospital ICU Upgrade', '12 Urban Health Wellness Centers'],
      },
      {
        sector: 'School Education & Literacy (Samagra Shiksha)',
        sectorHi: 'बेसिक एवं माध्यमिक शिक्षा (समग्र शिक्षा)',
        allocatedCr: isMetro ? 175.5 : 92.0,
        spentCr: isMetro ? 148.0 : 78.4,
        utilizationPct: isMetro ? 84.3 : 85.2,
        marchRushSpendPct: 22.1,
        capexPct: 60,
        keyProjects: ['PM SHRI Model School Infrastructure', 'Smart Classrooms & Solar Inverters'],
      },
      {
        sector: '15th Finance Commission Local Grants (Panchayat & ULB)',
        sectorHi: '15वां वित्त आयोग स्थानीय निकाय अनुदान',
        allocatedCr: isMetro ? 195.0 : 85.4,
        spentCr: isMetro ? 153.2 : 66.3,
        utilizationPct: isMetro ? 78.6 : 77.6,
        marchRushSpendPct: 41.5,
        capexPct: 85,
        keyProjects: ['Solid Waste Processing Plant', 'Interlocking Tile Drainage Packages'],
      },
    ];

    return {
      totalAllocated,
      totalSpent,
      unspent,
      utilizationRate,
      sectors,
    };
  }, [currentPin]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (/^\d{6}$/.test(pinInput.trim())) {
      setSearchParams({ pin: pinInput.trim() });
    }
  };

  const handleShareBudget = () => {
    share({
      pinCode: currentPin,
      titleHindi: `सार्वजनिक बजट लेज़र: ${districtName} (वित्तीय वर्ष 2025-26)`,
      titleEnglish: `District Budget Ledger: ${districtName} (FY 2025-26)`,
      claimLabel: `Total Allocated: ₹${budgetSummary.totalAllocated} Cr`,
      claimLabelHindi: `कुल आवंटित बजट: ₹${budgetSummary.totalAllocated} करोड़`,
      realityLabel: `Utilized: ₹${budgetSummary.totalSpent} Cr (${budgetSummary.utilizationRate}%)`,
      realityLabelHindi: `व्यय: ₹${budgetSummary.totalSpent} करोड़ (${budgetSummary.utilizationRate}%)`,
      responsiblePerson: `Chief Treasury Officer / District Magistrate`,
      responsibleOrg: `${districtName} District Collectorate & Treasury`,
      sourceUrl: `https://jantax.in/budget?pin=${currentPin}`,
      moduleNameHindi: 'सार्वजनिक बजट एवं राजकोषीय निगरानी (Budget Watchdog)',
    });
  };

  return (
    <div style={{ padding: '2rem 0 4rem', minHeight: '80vh' }}>
      <div className="container">
        {/* Header Breadcrumb & Title */}
        <div style={{ marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: '#64748b', marginBottom: '0.5rem' }}>
            <Link to="/" style={{ color: '#2563eb', textDecoration: 'none' }}>Home</Link>
            <span>/</span>
            <Link to={`/pin/${currentPin}`} style={{ color: '#2563eb', textDecoration: 'none' }}>PIN {currentPin}</Link>
            <span>/</span>
            <span style={{ color: '#0f172a', fontWeight: 600 }}>District Public Budget & Treasury</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                <span className="glass-pill" style={{ background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0' }}>
                  📊 Public Financial Management System (PFMS) & State Treasury Audit
                </span>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  PIN {currentPin} · {districtName}, {loc.state}
                </span>
              </div>
              <h1 style={{ fontSize: '2.1rem', fontWeight: 900, color: '#0f172a', margin: '0 0 0.35rem' }}>
                {tr('District Public Budget & Treasury Ledger', 'जिला सार्वजनिक बजट एवं राजकोषीय लेज़र')}
              </h1>
              <p style={{ color: '#64748b', fontSize: '0.92rem', margin: 0, maxWidth: 680 }}>
                {tr(
                  'Track union and state financial allocations to your district: capital expenditure (Capex), 15th Finance Commission untied grants, and March rush spending alerts.',
                  'केंद्र एवं राज्य सरकार द्वारा जिले को जारी बजट का पारदर्शी लेज़र: पूंजीगत व्यय (परिसंपत्ति निर्माण), 15वें वित्त आयोग का अनुदान एवं वित्तीय वर्ष के अंत में हड़बड़ी में बजट खपाने (March Rush) की निगरानी।'
                )}
              </p>
            </div>

            {/* PIN Search Form */}
            <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
              <div style={{ position: 'relative' }}>
                <MapPin size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="text"
                  maxLength={6}
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 6-digit PIN"
                  style={{
                    padding: '0.65rem 0.85rem 0.65rem 2.25rem',
                    borderRadius: 10,
                    border: '1.5px solid #cbd5e1',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    width: 170,
                    outline: 'none',
                  }}
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ padding: '0.65rem 1.15rem' }}>
                <Search size={15} />
                <span>{tr('Locate', 'खोजें')}</span>
              </button>
            </form>
          </div>
        </div>

        {/* Treasury Highlight Strip */}
        <div
          style={{
            background: 'linear-gradient(135deg, var(--navy-950) 0%, var(--navy-900) 100%)',
            borderRadius: 16,
            padding: '1.5rem',
            color: '#ffffff',
            marginBottom: '1.75rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem',
            boxShadow: 'var(--shadow-hover)',
          }}
        >
          <div>
            <div style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
              Total Sanctioned District Budget
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#38bdf8', marginTop: '0.2rem' }}>
              ₹{budgetSummary.totalAllocated} Cr
            </div>
            <div style={{ fontSize: '0.74rem', color: '#cbd5e1' }}>FY 2025-26 Central + State Treasury</div>
          </div>

          <div>
            <div style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
              Expenditure Disbursed to Date
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#4ade80', marginTop: '0.2rem' }}>
              ₹{budgetSummary.totalSpent} Cr
            </div>
            <div style={{ fontSize: '0.74rem', color: '#cbd5e1' }}>{budgetSummary.utilizationRate}% funds disbursed</div>
          </div>

          <div>
            <div style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
              Unspent Treasury Balance
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#f87171', marginTop: '0.2rem' }}>
              ₹{budgetSummary.unspent} Cr
            </div>
            <div style={{ fontSize: '0.74rem', color: '#cbd5e1' }}>Risk of budget lapse on 31st March</div>
          </div>

          <div>
            <div style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
              March Rush Spending Alert
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#fb923c', marginTop: '0.2rem' }}>
              31.8%
            </div>
            <div style={{ fontSize: '0.74rem', color: '#cbd5e1' }}>Spent in Q4 without strict quality audit</div>
          </div>
        </div>

        {/* Sectoral Allocations Breakdown */}
        <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>
          Sectoral Allocation & Capex Quality Breakdown
        </h3>

        <div style={{ display: 'grid', gap: '1.25rem' }}>
          {budgetSummary.sectors.map((s, idx) => (
            <div
              key={idx}
              style={{
                background: '#ffffff',
                borderRadius: 16,
                border: '1px solid #e2e8f0',
                padding: '1.5rem',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.85rem' }}>
                <div>
                  <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.2rem' }}>
                    {s.sector}
                  </h4>
                  <div style={{ fontSize: '0.86rem', color: '#64748b' }}>
                    {s.sectorHi}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                    Allocated vs Spent
                  </div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f2d59' }}>
                    ₹{s.spentCr} Cr <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>/ ₹{s.allocatedCr} Cr</span>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div style={{ height: 8, background: '#e2e8f0', borderRadius: 999, overflow: 'hidden', marginBottom: '1rem' }}>
                <div style={{ height: '100%', width: `${s.utilizationPct}%`, background: s.utilizationPct >= 80 ? '#2563eb' : '#d97706', borderRadius: 999 }} />
              </div>

              {/* Badges Strip */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.82rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span style={{ background: '#ecfdf5', color: '#047857', padding: '0.2rem 0.6rem', borderRadius: 6, fontWeight: 700, border: '1px solid #a7f3d0' }}>
                    🏗️ {s.capexPct}% Capital Asset Creation (Capex)
                  </span>
                  {s.marchRushSpendPct > 30 && (
                    <span className="badge-overrun">
                      ⚠️ {s.marchRushSpendPct}% March Rush Disbursal
                    </span>
                  )}
                </div>

                <div style={{ color: '#64748b', fontSize: '0.78rem' }}>
                  Key Works: {s.keyProjects.join(', ')}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '0.75rem', marginTop: '1.5rem' }}>
          <button
            type="button"
            onClick={handleShareBudget}
            className="btn"
            style={{
              background: '#f8fafc',
              border: '1px solid #cbd5e1',
              fontSize: '0.84rem',
              padding: '0.55rem 1.15rem',
              borderRadius: 10,
              fontWeight: 700,
              color: '#334155',
            }}
          >
            <Share2 size={15} /> Share District Budget Card
          </button>

          <Link
            to={`/rti/draft?authority=${encodeURIComponent(districtName + ' District Collectorate & Treasury')}&topic=budget_utilization`}
            className="btn btn-primary"
            style={{
              fontSize: '0.84rem',
              padding: '0.55rem 1.25rem',
              borderRadius: 10,
            }}
          >
            <FileText size={15} />
            <span>Draft Section 6(1) RTI on Unspent Funds</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
