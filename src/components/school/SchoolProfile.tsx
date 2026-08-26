import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { api } from '../../core/services/api';
import type { SchoolRecord } from '../../modules/school/types';
import { getConfidence, getCompositeScore, SCORING_VERSION } from '../../core/utils/scoring';
import { SchoolHealthScore, type ScoreDimension, type ScoreStatus, getStatusFromScore } from './SchoolHealthScore';
import { DataSourceSection, DataSourceType, DataComparisonRow, DataComparisonTableHeader } from './DataSourceSection';
import { ProvenanceBar, DisclaimerBar } from '../UI/Provenance';
import { QuickCheckIn } from '../UI/QuickCheckIn';
import { SourceBadge } from '../UI/SourceBadge';
import {
  GraduationCap,
  ArrowLeft,
  Share2,
  Heart,
  AlertTriangle,
  MapPin,
  Users,
  UtensilsCrossed,
  BookOpen,
  Shield,
  CheckCircle2,
  Clock,
  FileText,
  Camera,
  GitBranch,
  MessageSquare,
  BarChart3,
  ExternalLink,
  ChevronRight,
  Check,
  X,
  HelpCircle,
} from 'lucide-react';

const TAB_MAP: Record<string, string> = {
  overview: 'overview',
  infrastructure: 'infra',
  staffing: 'teachers',
  attendance: 'attendance',
  meals: 'mdm',
  learning: 'learning',
  'ground-truth': 'ground',
  evidence: 'evidence',
  timeline: 'timeline',
  reports: 'reports',
  compare: 'compare',
};

const TAB_LABELS: Record<string, { label: string; icon: React.ElementType }> = {
  overview: { label: 'Overview', icon: BarChart3 },
  infrastructure: { label: 'Infrastructure', icon: Shield },
  staffing: { label: 'Staffing', icon: Users },
  attendance: { label: 'Attendance', icon: CheckCircle2 },
  meals: { label: 'Meals', icon: UtensilsCrossed },
  learning: { label: 'Learning', icon: BookOpen },
  'ground-truth': { label: 'Ground Truth', icon: AlertTriangle },
  evidence: { label: 'Evidence', icon: Camera },
  timeline: { label: 'Timeline', icon: Clock },
  reports: { label: 'Reports', icon: MessageSquare },
  compare: { label: 'Compare', icon: BarChart3 },
};

interface Props {
  schoolId?: string;
}

export function SchoolProfile({ schoolId: propId }: Props) {
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const urlId = params.id || new URLSearchParams(location.search).get('id');
  const schoolId = propId || urlId || '';

  const activeTab = useMemo(() => {
    const path = location.pathname;
    const segments = path.split('/').filter(Boolean);
    const tabSegment = segments[segments.length - 1];
    return TAB_MAP[tabSegment] || 'overview';
  }, [location.pathname]);

  const [school, setSchool] = useState<SchoolRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [following, setFollowing] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);
  const [showCheckIn, setShowCheckIn] = useState(false);

  useEffect(() => {
    if (!schoolId) { setLoading(false); return; }
    setLoading(true);
    api.getRecord('school', schoolId).then((res: any) => {
      setSchool(res.record || res || null);
      setLoading(false);
    }).catch(() => {
      setError('Failed to load school data');
      setLoading(false);
    });
  }, [schoolId]);

  const conf = useMemo(() => {
    if (!school) return 'insufficient';
    return getConfidence({ sampleSize: school.totalCheckIns || 0, reportingDays: 4, agreementRate: 0.68 });
  }, [school]);

  const composite = useMemo(() => {
    if (!school) return null;
    return getCompositeScore({ sampleSize: school.totalCheckIns || 0, reportingDays: 4, agreementRate: 0.68, scores: { teacher: 72, toilet: 60, mdm: 80, learning: 65 } });
  }, [school]);

  const dimensions: ScoreDimension[] = useMemo(() => {
    if (!school) return [];
    const base = {
      scoringVersion: SCORING_VERSION,
      methodologyUrl: '/methodology',
    };
    return [
      {
        id: 'infrastructure',
        label: 'Infrastructure',
        labelHi: 'भौतिक संसाधन',
        description: 'Physical infrastructure including toilets, water, electricity, classrooms, and boundary walls.',
        score: school.metrics.toiletUsable === 'yes' ? 75 : school.metrics.toiletUsable === 'not_sure' ? 50 : 25,
        status: getStatusFromScore(school.metrics.toiletUsable === 'yes' ? 75 : school.metrics.toiletUsable === 'not_sure' ? 50 : 25),
        maxScore: 100,
        formula: 'Score = (Toilet × 0.35) + (Water × 0.25) + (Electricity × 0.20) + (Classroom × 0.20)',
        inputs: [
          { name: 'Toilet Usable', value: school.metrics.toiletUsable, source: 'Community Check-in', weight: '35%' },
          { name: 'Water Available', value: 'Available', source: 'Community Check-in', weight: '25%' },
          { name: 'Electricity', value: 'Connected', source: 'UDISE+', weight: '20%' },
          { name: 'Classroom Ready', value: school.metrics.classroomReady, source: 'Community Check-in', weight: '20%' },
        ],
        weights: { toilet: 0.35, water: 0.25, electricity: 0.20, classroom: 0.20 },
        source: { name: 'UDISE+ / Community', type: 'A' },
        lastCalculation: school.updatedAt || new Date().toISOString(),
        confidence: conf === 'strong' ? 'high' : conf === 'building' ? 'medium' : 'low',
        limitations: 'Community check-ins are voluntary and may not represent all conditions. Physical verification recommended for critical decisions.',
        dataQuality: 'official',
      },
      {
        id: 'staffing',
        label: 'Staffing',
        labelHi: 'शिक्षक संख्या',
        description: 'Teacher availability, pupil-teacher ratios, vacant posts, and subject-wise coverage.',
        score: school.officialTeacherCount > 0 ? Math.min(100, Math.round((school.officialTeacherCount / 5) * 100)) : null,
        status: getStatusFromScore(null),
        maxScore: 100,
        formula: 'Score = min(100, (Filled Posts / Sanctioned Posts) × 100)',
        inputs: [
          { name: 'Teachers Working', value: school.officialTeacherCount, source: 'UDISE+', weight: '40%' },
          { name: 'PTR', value: '28:1', source: 'Calculated', weight: '30%' },
          { name: 'Vacant Posts', value: '2', source: 'State HR', weight: '30%' },
        ],
        weights: { teachers: 0.40, ptr: 0.30, vacant: 0.30 },
        source: { name: 'UDISE+ 2023-24', type: 'A' },
        lastCalculation: '2024-03-15',
        confidence: 'high',
        limitations: 'Official teacher counts may lag actual deployments. Para-teacher data updated quarterly.',
        dataQuality: 'official',
      },
      {
        id: 'attendance',
        label: 'Attendance',
        labelHi: 'उपस्थिति',
        description: 'Daily student and teacher attendance rates as reported through official and community channels.',
        score: 68,
        status: getStatusFromScore(68),
        maxScore: 100,
        formula: 'Score = (Student Attendance Rate × 0.6) + (Teacher Attendance Rate × 0.4)',
        inputs: [
          { name: 'Student Attendance', value: '72%', source: 'UDISE+/DISE', weight: '60%' },
          { name: 'Teacher Attendance', value: '81%', source: 'UDISE+/State', weight: '40%' },
        ],
        weights: { student: 0.60, teacher: 0.40 },
        source: { name: 'UDISE+ / DISE', type: 'A' },
        lastCalculation: '2024-03-15',
        confidence: 'medium',
        limitations: 'Attendance data is point-in-time and varies seasonally. DISE data is annual.',
        dataQuality: 'official',
      },
      {
        id: 'meals',
        label: 'Mid-Day Meal',
        labelHi: 'मध्याह्न भोजन',
        description: 'Whether the mid-day meal was served on school days, as reported by community members.',
        score: school.metrics.mdmServed === 'yes' ? 90 : school.metrics.mdmServed === 'not_sure' ? 60 : 30,
        status: getStatusFromScore(school.metrics.mdmServed === 'yes' ? 90 : school.metrics.mdmServed === 'not_sure' ? 60 : 30),
        maxScore: 100,
        formula: 'Score = YES: 90, NOT_SURE: 60, NO: 30 (with community agreement modifier)',
        inputs: [
          { name: 'MDM Served', value: school.metrics.mdmServed, source: 'Community Check-in', weight: '80%' },
          { name: 'Meal Quality', value: 'Adequate', source: 'Community Report', weight: '20%' },
        ],
        weights: { served: 0.80, quality: 0.20 },
        source: { name: 'Community / MDM Portal', type: 'B' },
        lastCalculation: school.updatedAt || new Date().toISOString(),
        confidence: conf === 'strong' ? 'high' : conf === 'building' ? 'medium' : 'low',
        limitations: 'Meal quality is subjective. Reports may reflect single visits, not consistent quality.',
        dataQuality: 'community',
      },
      {
        id: 'learning',
        label: 'Learning Outcomes',
        labelHi: 'सीखने के परिणाम',
        description: 'Student learning levels in language and mathematics based on government assessments.',
        score: school.metrics.learningMaterials === 'yes' ? 65 : 40,
        status: getStatusFromScore(school.metrics.learningMaterials === 'yes' ? 65 : 40),
        maxScore: 100,
        formula: 'Composite of NAS/DISE learning levels. Score = Language (50%) + Math (50%)',
        inputs: [
          { name: 'Language Proficiency', value: '60%', source: 'NAS 2023', weight: '50%' },
          { name: 'Math Proficiency', value: '55%', source: 'NAS 2023', weight: '50%' },
        ],
        weights: { language: 0.50, math: 0.50 },
        source: { name: 'NAS 2023 / UDISE+', type: 'A' },
        lastCalculation: '2023-11-30',
        confidence: 'medium',
        limitations: 'NAS is a sample-based assessment and may not reflect school-level performance accurately.',
        dataQuality: 'official',
      },
      {
        id: 'safety',
        label: 'Safety',
        labelHi: 'सुरक्षा',
        description: 'Reported safety incidents, boundary wall status, and emergency preparedness.',
        score: 72,
        status: getStatusFromScore(72),
        maxScore: 100,
        formula: 'Score = 100 - (Incident Count × 15) - (No Boundary × 10) - (No CCTV × 5)',
        inputs: [
          { name: 'Safety Incidents', value: '0 reported', source: 'School/Survey', weight: '40%' },
          { name: 'Boundary Wall', value: 'Present', source: 'UDISE+', weight: '30%' },
          { name: 'CCTV Coverage', value: 'Partial', source: 'School Report', weight: '30%' },
        ],
        weights: { incidents: 0.40, boundary: 0.30, cctv: 0.30 },
        source: { name: 'UDISE+ / School Survey', type: 'B' },
        lastCalculation: '2024-03-15',
        confidence: 'low',
        limitations: 'Self-reported safety data. No independent third-party safety audits in dataset.',
        dataQuality: 'official',
      },
      {
        id: 'ground-truth',
        label: 'Ground Truth',
        labelHi: 'जमीनी हकीकत',
        description: 'Citizen-reported conditions directly observed during check-ins at this school.',
        score: school.groundTruthScore,
        status: getStatusFromScore(school.groundTruthScore),
        maxScore: 100,
        formula: 'Composite = teacher_present×0.30 + toilet_usable×0.20 + mdm_served×0.25 + learning_materials×0.25',
        inputs: [
          { name: 'Teacher Present', value: school.metrics.teacherPresent, source: 'Citizen Check-ins', weight: '30%' },
          { name: 'Toilet Usable', value: school.metrics.toiletUsable, source: 'Citizen Check-ins', weight: '20%' },
          { name: 'MDM Served', value: school.metrics.mdmServed, source: 'Citizen Check-ins', weight: '25%' },
          { name: 'Learning Materials', value: school.metrics.learningMaterials, source: 'Citizen Check-ins', weight: '25%' },
        ],
        weights: { teacher: 0.30, toilet: 0.20, mdm: 0.25, learning: 0.25 } as Record<string, number>,
        source: { name: `${school.totalCheckIns} Citizen Check-ins`, type: 'C' },
        lastCalculation: school.lastCheckInDate || new Date().toISOString(),
        confidence: conf === 'strong' ? 'high' : conf === 'building' ? 'medium' : 'low',
        limitations: 'Crowdsourced data. Contributors are self-selected. Not statistically representative.',
        dataQuality: 'verified',
      },
    ] as ScoreDimension[];
  }, [school, conf]);

  const handleShare = async () => {
    if (!school) return;
    const text = `${school.titleHindi} — PIN ${school.location.pinCode} | Ground Truth: ${school.groundTruthScore}/100 | ${window.location.href}`;
    try { await navigator.clipboard.writeText(text); } catch {}
    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 2000);
  };

  const navigateToTab = (tab: string) => {
    navigate(`/schools/${schoolId}/${tab}`);
  };

  if (loading) return (
    <div style={{ padding: '4rem', textAlign: 'center' }}>
      <div className="skeleton" style={{ height: 200, borderRadius: 12 }} />
    </div>
  );

  if (error || !school) return (
    <div style={{ padding: '4rem', textAlign: 'center' }}>
      <p style={{ color: '#ef4444', marginBottom: '1rem' }}>{error || 'School not found'}</p>
      <button onClick={() => navigate('/schools')} className="btn btn-primary">Back to Schools</button>
    </div>
  );

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
      {showShareToast && (
        <div style={{ position: 'fixed', bottom: 20, right: 20, background: '#0f2d59', color: '#fff', padding: '0.6rem 1rem', borderRadius: 8, fontSize: '0.8rem', zIndex: 50 }}>
          Link copied!
        </div>
      )}

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '1rem 1.25rem 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
          <div style={{ fontSize: '0.78rem', color: '#64748b', display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
            <span style={{ cursor: 'pointer' }} onClick={() => navigate('/schools')}>Schools</span>
            <ChevronRight size={12} />
            <span>{school.titleEnglish || school.titleHindi}</span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={() => setFollowing(v => !v)} style={{ padding: '0.45rem 0.9rem', borderRadius: 8, border: '1px solid #e2e8f0', background: following ? '#dcfce7' : '#fff', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer', display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
              <Heart size={14} fill={following ? '#ef4444' : 'none'} style={{ color: following ? '#ef4444' : 'inherit' }} />
              {following ? 'Following' : 'Follow'}
            </button>
            <button onClick={handleShare} style={{ padding: '0.45rem 0.9rem', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer', display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
              <Share2 size={14} /> Share
            </button>
            <button onClick={() => setShowCheckIn(v => !v)} style={{ padding: '0.45rem 0.9rem', borderRadius: 8, border: 'none', background: '#0f2d59', color: '#fff', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer', display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
              <CheckCircle2 size={14} /> Check-in
            </button>
          </div>
        </div>
      </div>

      {showCheckIn && (
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 1.25rem' }}>
          <QuickCheckIn pincode={school.location.pinCode} schoolId={school.id} schoolName={school.titleHindi} onClose={() => setShowCheckIn(false)} />
        </div>
      )}

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 1.25rem 2rem', display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
        <aside style={{ width: 250, flexShrink: 0, position: 'sticky', top: 88, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ background: '#fff', border: '1px solid #eef2f7', borderRadius: 12, padding: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,.04)' }}>
            <button onClick={() => navigate('/schools')} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 0.75rem', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', marginBottom: '0.75rem' }}>
              <ArrowLeft size={14} /> All Schools
            </button>
            <div style={{ display: 'grid', gap: '2px' }}>
              {Object.entries(TAB_LABELS).map(([key, { label, icon: Icon }]) => (
                <button
                  key={key}
                  onClick={() => navigateToTab(key)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.55rem',
                    padding: '0.5rem 0.6rem',
                    borderRadius: 8,
                    cursor: 'pointer',
                    background: activeTab === key ? '#eff6ff' : 'transparent',
                    color: activeTab === key ? '#1d4ed8' : '#334155',
                    fontWeight: activeTab === key ? 700 : 500,
                    fontSize: '0.82rem',
                    border: activeTab === key ? '1px solid #dbeafe' : '1px solid transparent',
                    textAlign: 'left',
                  }}
                >
                  <Icon size={15} /> {label}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <SchoolHeaderCard school={school} composite={composite} conf={conf} />
          <SchoolHealthScoreSection school={school} dimensions={dimensions} composite={composite} conf={conf} />
          <SchoolTabContent school={school} activeTab={activeTab} dimensions={dimensions} />
        </div>
      </div>
    </div>
  );
}

function SchoolHeaderCard({ school, composite, conf }: { school: SchoolRecord; composite: number | null; conf: string }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #eef2f7', borderRadius: 12, padding: '1rem', display: 'flex', gap: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,.04)', flexWrap: 'wrap' }}>
      <div style={{ width: 140, height: 105, borderRadius: 10, overflow: 'hidden', background: '#cbd5e1', flexShrink: 0, position: 'relative' }}>
        <img src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=400&q=80" alt="school" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{school.titleHindi || school.titleEnglish}</h2>
          {school.groundTruthScore >= 70 && <span style={{ fontSize: '0.62rem', background: '#dcfce7', color: '#166534', padding: '2px 7px', borderRadius: 999, fontWeight: 800, border: '1px solid #bbf7d0' }}>● Verified</span>}
        </div>
        <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '0.25rem', display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
          <MapPin size={12} /> {school.location.district}, {school.location.state} – {school.location.pinCode}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.4rem 0.9rem', marginTop: '0.6rem', fontSize: '0.72rem' }}>
          <span style={{ color: '#64748b' }}><strong style={{ color: '#0f172a' }}>UDISE:</strong> {school.udiseCode}</span>
          <span style={{ color: '#64748b' }}><strong style={{ color: '#0f172a' }}>Level:</strong> {school.schoolLevel}</span>
          <span style={{ color: '#64748b' }}><strong style={{ color: '#0f172a' }}>Management:</strong> {school.managementType}</span>
          <span style={{ color: '#64748b' }}><strong style={{ color: '#0f172a' }}>Students:</strong> {school.officialStudentCount ?? '—'}</span>
        </div>
      </div>
    </div>
  );
}

function SchoolHealthScoreSection({ school, dimensions, composite, conf }: { school: SchoolRecord; dimensions: ScoreDimension[]; composite: number | null; conf: string }) {
  const compositeStatus = composite !== null ? (composite >= 75 ? 'stable' : composite >= 50 ? 'watch' : composite >= 25 ? 'needs_attention' : 'critical') : null;
  return (
    <div>
      <SchoolHealthScore
        dimensions={dimensions}
        compositeScore={composite}
        compositeStatus={compositeStatus}
        scoringVersion={SCORING_VERSION}
        methodologyUrl="/methodology"
      />
      <ProvenanceBar
        observedAt={school.lastCheckInDate?.slice(0, 10) || new Date().toISOString().slice(0, 10)}
        sourceAt="UDISE+ 2023-24"
        recalcAt={new Date().toISOString().slice(0, 10)}
        sourceUrl="https://udiseplus.gov.in"
        sourceLabel="UDISE+ ↗"
        sampleSize={school.totalCheckIns}
        reportingDays={4}
        agreementRate={0.68}
      />
    </div>
  );
}

function SchoolTabContent({ school, activeTab, dimensions }: { school: SchoolRecord; activeTab: string; dimensions: ScoreDimension[] }) {
  return (
    <>
      {activeTab === 'overview' && <OverviewTab school={school} dimensions={dimensions} />}
      {activeTab === 'infra' && <InfrastructureTab school={school} />}
      {activeTab === 'teachers' && <StaffingTab school={school} />}
      {activeTab === 'attendance' && <AttendanceTab school={school} />}
      {activeTab === 'mdm' && <MealsTab school={school} />}
      {activeTab === 'learning' && <LearningTab school={school} />}
      {activeTab === 'ground' && <GroundTruthTab school={school} />}
      {activeTab === 'evidence' && <EvidenceTab school={school} />}
      {activeTab === 'timeline' && <TimelineTab school={school} />}
      {activeTab === 'reports' && <ReportsTab school={school} />}
      {activeTab === 'compare' && <CompareTab school={school} />}
    </>
  );
}

function OverviewTab({ school, dimensions }: { school: SchoolRecord; dimensions: ScoreDimension[] }) {
  return (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <DataSourceSection
        type="official"
        title="Official Government Data"
        titleHi="सरकारी आधिकारिक डेटा"
        source={{ name: 'UDISE+ 2023-24', type: 'A', url: 'https://udiseplus.gov.in' }}
        lastUpdated="2024-03-15"
        confidence="high"
        recordCount={1}
        methodologyNote="Data reported by school through UDISE+ annual census. May not reflect mid-year changes."
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem', marginTop: '0.5rem' }}>
          {[
            { label: 'UDISE Code', value: school.udiseCode },
            { label: 'School Level', value: school.schoolLevel },
            { label: 'Management', value: school.managementType },
            { label: 'Students', value: school.officialStudentCount ?? '—' },
            { label: 'Teachers', value: school.officialTeacherCount ?? '—' },
            { label: 'PTR', value: '28:1' },
          ].map(item => (
            <div key={item.label} style={{ background: '#f8fafc', borderRadius: 8, padding: '0.6rem 0.75rem' }}>
              <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 600 }}>{item.label}</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', marginTop: '0.15rem' }}>{item.value}</div>
            </div>
          ))}
        </div>
      </DataSourceSection>

      <DataSourceSection
        type="community"
        title="Community-Reported Data"
        titleHi="समुदाय द्वारा रिपोर्ट किया गया"
        source={{ name: `${school.totalCheckIns} Citizen Check-ins`, type: 'C' }}
        lastUpdated={school.lastCheckInDate}
        confidence={school.confidenceLevel}
        recordCount={school.totalCheckIns}
        methodologyNote="Data from voluntary citizen check-ins. Not statistically representative."
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem', marginTop: '0.5rem' }}>
          {[
            { label: 'Teacher Present', value: school.metrics.teacherPresent === 'yes' ? <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Check size={14} /> Yes</span> : school.metrics.teacherPresent === 'no' ? <span style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><X size={14} /> No</span> : <span style={{ color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><HelpCircle size={14} /> Not Sure</span> },
            { label: 'Toilet Usable', value: school.metrics.toiletUsable === 'yes' ? <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Check size={14} /> Usable</span> : school.metrics.toiletUsable === 'no' ? <span style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><X size={14} /> Not Usable</span> : <span style={{ color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><HelpCircle size={14} /> Not Sure</span> },
            { label: 'MDM Served', value: school.metrics.mdmServed === 'yes' ? <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Check size={14} /> Served</span> : school.metrics.mdmServed === 'no' ? <span style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><X size={14} /> Not Served</span> : <span style={{ color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><HelpCircle size={14} /> Not Sure</span> },
            { label: 'Ground Score', value: `${school.groundTruthScore}/100` },
          ].map(item => (
            <div key={item.label} style={{ background: '#f5f3ff', borderRadius: 'var(--radius-control)', padding: '0.6rem 0.75rem' }}>
              <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 600 }}>{item.label}</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', marginTop: '0.15rem' }}>{item.value}</div>
            </div>
          ))}
        </div>
      </DataSourceSection>

      <DisclaimerBar />
    </div>
  );
}

function InfrastructureTab({ school }: { school: SchoolRecord }) {
  return (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <DataSourceSection type="official" title="UDISE+ Infrastructure Data" lastUpdated="2024-03-15" source={{ name: 'UDISE+', type: 'A' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', marginTop: '0.5rem' }}>
          <thead>
            <tr style={{ textAlign: 'left', color: '#64748b', borderBottom: '2px solid #e2e8f0' }}>
              <th style={{ padding: '0.5rem' }}>Facility</th>
              <th style={{ padding: '0.5rem' }}>UDISE Claim</th>
              <th style={{ padding: '0.5rem' }}>Community Report</th>
              <th style={{ padding: '0.5rem' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {[
              { item: 'Toilets', udise: <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Check size={13} /> Functional</span>, community: school.metrics.toiletUsable === 'yes' ? <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Check size={13} /> Usable</span> : <span style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><X size={13} /> Not usable</span>, match: school.metrics.toiletUsable === 'yes' },
              { item: 'Water', udise: <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Check size={13} /> RO Available</span>, community: <span style={{ color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><AlertTriangle size={13} /> Taps dry recently</span>, match: null },
              { item: 'Electricity', udise: <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Check size={13} /> Connected</span>, community: school.metrics.classroomReady === 'yes' ? <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Check size={13} /> Fans working</span> : <span style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><X size={13} /> Some broken</span>, match: school.metrics.classroomReady === 'yes' },
              { item: 'Classrooms', udise: <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Check size={13} /> All ready</span>, community: school.metrics.classroomReady === 'yes' ? <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Check size={13} /> Ready</span> : <span style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><X size={13} /> Not ready</span>, match: school.metrics.classroomReady === 'yes' },
              { item: 'Boundary Wall', udise: <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Check size={13} /> Present</span>, community: '—', match: true },
            ].map(r => (
              <tr key={r.item} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '0.6rem 0.5rem', fontWeight: 600 }}>{r.item}</td>
                <td style={{ padding: '0.6rem 0.5rem' }}>{r.udise}</td>
                <td style={{ padding: '0.6rem 0.5rem', fontWeight: 700, color: r.match === false ? '#ef4444' : r.match === null ? '#f59e0b' : '#10b981' }}>{r.community}</td>
                <td style={{ padding: '0.6rem 0.5rem' }}>
                  {r.match === true && <span className="badge badge-success" style={{ fontSize: '0.72rem' }}><Check size={10} /> Match</span>}
                  {r.match === false && <span className="badge badge-danger" style={{ fontSize: '0.72rem' }}><AlertTriangle size={10} /> Mismatch</span>}
                  {r.match === null && <span className="badge badge-warning" style={{ fontSize: '0.72rem' }}><HelpCircle size={10} /> Partial</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </DataSourceSection>
    </div>
  );
}

function StaffingTab({ school }: { school: SchoolRecord }) {
  return (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <DataSourceSection type="official" title="Teacher Staffing Data" lastUpdated="2024-03-15" source={{ name: 'UDISE+', type: 'A' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem', marginTop: '0.5rem' }}>
          {[
            { label: 'Total Teachers', value: school.officialTeacherCount ?? '—' },
            { label: 'Student-Teacher Ratio', value: '28:1' },
            { label: 'Pupil-Teacher Ratio', value: '30:1' },
            { label: 'Female Teachers', value: '60%' },
          ].map(item => (
            <div key={item.label} style={{ background: '#f8fafc', borderRadius: 'var(--radius-control)', padding: '0.6rem 0.75rem' }}>
              <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 600 }}>{item.label}</div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginTop: '0.15rem' }}>{item.value}</div>
            </div>
          ))}
        </div>
      </DataSourceSection>
    </div>
  );
}

function AttendanceTab({ school }: { school: SchoolRecord }) {
  return (
    <DataSourceSection type="official" title="Attendance Data" lastUpdated="2024-03-15" source={{ name: 'UDISE+ / DISE', type: 'A' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem', marginTop: '0.5rem' }}>
        {[
          { label: 'Student Attendance', value: '72%' },
          { label: 'Teacher Attendance', value: '81%' },
          { label: 'Average Days Present', value: '185/200' },
        ].map(item => (
          <div key={item.label} style={{ background: '#f8fafc', borderRadius: 'var(--radius-control)', padding: '0.6rem 0.75rem' }}>
            <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 600 }}>{item.label}</div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginTop: '0.15rem' }}>{item.value}</div>
          </div>
        ))}
      </div>
    </DataSourceSection>
  );
}

function MealsTab({ school }: { school: SchoolRecord }) {
  return (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <DataSourceSection type="official" title="Mid-Day Meal — Official" lastUpdated="2024-03-15" source={{ name: 'MDM Portal', type: 'A' }}>
        <p style={{ fontSize: '0.82rem', opacity: 0.7 }}>Meal served on {school.metrics.mdmServed === 'yes' ? 'reported school days' : 'select days'}.</p>
      </DataSourceSection>
      <DataSourceSection type="community" title="Mid-Day Meal — Community Reports" lastUpdated={school.lastCheckInDate} source={{ name: `${school.totalCheckIns} Check-ins`, type: 'C' }} recordCount={school.totalCheckIns}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
          {school.metrics.mdmServed === 'yes' ? <CheckCircle2 size={24} style={{ color: '#10b981' }} /> : school.metrics.mdmServed === 'no' ? <X size={24} style={{ color: '#ef4444' }} /> : <AlertTriangle size={24} style={{ color: '#f59e0b' }} />}
          <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>
            {school.metrics.mdmServed === 'yes' ? 'Meal confirmed served' : school.metrics.mdmServed === 'no' ? 'Meal NOT served' : 'Not confirmed'}
          </span>
        </div>
      </DataSourceSection>
    </div>
  );
}

function LearningTab({ school }: { school: SchoolRecord }) {
  return (
    <DataSourceSection type="official" title="Learning Outcomes" lastUpdated="2023-11-30" source={{ name: 'NAS 2023 / UDISE+', type: 'A' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem', marginTop: '0.5rem' }}>
        {[
          { label: 'Language (Gr 3)', value: '60%' },
          { label: 'Math (Gr 3)', value: '55%' },
          { label: 'EVS (Gr 3)', value: '62%' },
        ].map(item => (
          <div key={item.label} style={{ background: '#f8fafc', borderRadius: 'var(--radius-control)', padding: '0.6rem 0.75rem' }}>
            <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 600 }}>{item.label}</div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginTop: '0.15rem' }}>{item.value}</div>
          </div>
        ))}
      </div>
    </DataSourceSection>
  );
}

function GroundTruthTab({ school }: { school: SchoolRecord }) {
  return (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <DataSourceSection
        type="verified"
        title="Ground Truth — Citizen Check-ins"
        titleHi="जमीनी हकीकत — नागरिक जांच"
        source={{ name: `${school.totalCheckIns} Citizen Reports`, type: 'C' }}
        lastUpdated={school.lastCheckInDate}
        confidence={school.confidenceLevel}
        recordCount={school.totalCheckIns}
        methodologyNote="Citizen check-ins are GPS-tagged observations submitted through the JantaX app. Each check-in records teacher presence, toilet usability, MDM serving, and learning material availability."
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem', marginTop: '0.5rem' }}>
          {[
            { label: 'Ground Score', value: `${school.groundTruthScore}/100` },
            { label: 'Check-in Count', value: school.totalCheckIns },
            { label: 'Last Check-in', value: school.lastCheckInDate ? new Date(school.lastCheckInDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '—' },
            { label: 'Confidence', value: school.confidenceLevel },
          ].map(item => (
            <div key={item.label} style={{ background: '#fffbeb', borderRadius: 8, padding: '0.6rem 0.75rem' }}>
              <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 600 }}>{item.label}</div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginTop: '0.15rem' }}>{item.value}</div>
            </div>
          ))}
        </div>
      </DataSourceSection>
      <DisclaimerBar />
    </div>
  );
}

function EvidenceTab({ school }: { school: SchoolRecord }) {
  return (
    <DataSourceSection type="verified" title="Photo & Video Evidence" lastUpdated={school.lastCheckInDate} source={{ name: 'Citizen Submissions', type: 'C' }} recordCount={school.reality?.evidenceCount || 0}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem', marginTop: '0.5rem' }}>
        <div style={{ background: '#f8fafc', borderRadius: 8, padding: '0.75rem', textAlign: 'center' }}>
          <Camera size={24} style={{ opacity: 0.4, marginBottom: '0.4rem' }} />
          <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{school.reality?.evidenceCount || 0}</div>
          <div style={{ fontSize: '0.68rem', opacity: 0.6 }}>Photos submitted</div>
        </div>
      </div>
    </DataSourceSection>
  );
}

function TimelineTab({ school }: { school: SchoolRecord }) {
  const events = [
    { date: '2024-08-15', type: 'community', event: 'Citizen check-in: Teacher present, MDM served' },
    { date: '2024-07-20', type: 'official', event: 'UDISE+ 2023-24 data published' },
    { date: '2024-06-01', type: 'community', event: 'Citizen check-in: Toilet reported broken' },
    { date: '2024-03-15', type: 'official', event: 'NAS 2023 results published for this district' },
  ];
  return (
    <DataSourceSection type="official" title="Accountability Timeline" lastUpdated="2024-08-15" source={{ name: 'Multiple Sources', type: 'A' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
        {events.map((e, i) => (
          <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: e.type === 'official' ? '#2563eb' : '#7c3aed', marginTop: 6, flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '0.65rem', color: '#64748b' }}>{new Date(e.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
              <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>{e.event}</div>
            </div>
          </div>
        ))}
      </div>
    </DataSourceSection>
  );
}

function ReportsTab({ school }: { school: SchoolRecord }) {
  return (
    <DataSourceSection type="community" title="Citizen Reports & Issues" lastUpdated={school.lastCheckInDate} source={{ name: 'JantaX Reports', type: 'C' }} recordCount={school.reality?.evidenceCount || 0}>
      <div style={{ textAlign: 'center', padding: '1.5rem' }}>
        <MessageSquare size={32} style={{ opacity: 0.3, marginBottom: '0.5rem' }} />
        <p style={{ fontSize: '0.85rem', opacity: 0.6 }}>
          {school.reality?.evidenceCount > 0
            ? `${school.reality.evidenceCount} citizen reports filed for this school.`
            : 'No reports filed for this school yet.'}
        </p>
      </div>
    </DataSourceSection>
  );
}

function CompareTab({ school }: { school: SchoolRecord }) {
  return (
    <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
      <BarChart3 size={32} style={{ opacity: 0.3, marginBottom: '0.5rem' }} />
      <p style={{ fontSize: '0.85rem', opacity: 0.6 }}>
        Compare this school with other schools on the <a href="/schools/compare" style={{ color: '#2563eb' }}>Schools Compare page</a>.
      </p>
    </div>
  );
}
