import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Plus, X, Download, BarChart3, ExternalLink, AlertTriangle } from 'lucide-react';
import { api } from '../../core/services/api';
import type { SchoolRecord } from '../../modules/school/types';
import { CompareSelector } from '../../components/compare/CompareSelector';
import { ComparisonTable } from '../../components/compare/ComparisonTable';
import type { ComparisonData, ComparisonEntity } from '../../components/compare/types';
import { SchoolHealthScore, getStatusFromScore } from '../../components/school/SchoolHealthScore';
import { SCORING_VERSION } from '../../core/utils/scoring';

export function SchoolsComparePage() {
  const navigate = useNavigate();
  const [selectedSchools, setSelectedSchools] = useState<ComparisonEntity[]>([]);
  const [schoolRecords, setSchoolRecords] = useState<Record<string, SchoolRecord>>({});
  const [loading, setLoading] = useState(false);

  const handleSchoolSelect = async (entity: ComparisonEntity) => {
    if (schoolRecords[entity.id]) return;
    setLoading(true);
    try {
      const res = await api.getRecord('school', entity.id) as any;
      const record = res.record || res;
      setSchoolRecords(prev => ({ ...prev, [entity.id]: record }));
    } catch {}
    setLoading(false);
  };

  const comparisonData: ComparisonData | null = useMemo(() => {
    const entities = selectedSchools.filter(e => schoolRecords[e.id]);
    if (entities.length < 2) return null;

    const rows = [
      {
        id: 'basic',
        category: 'School Name',
        metrics: entities.map(e => ({
          id: `${e.id}-name`,
          label: 'Name',
          value: schoolRecords[e.id]?.titleEnglish || schoolRecords[e.id]?.titleHindi || '—',
          status: 'available' as const,
        })),
      },
      {
        id: 'location',
        category: 'Location',
        metrics: entities.map(e => ({
          id: `${e.id}-loc`,
          label: 'PIN / District',
          value: `${schoolRecords[e.id]?.location?.pinCode} / ${schoolRecords[e.id]?.location?.district || '—'}`,
          status: 'available' as const,
        })),
      },
      {
        id: 'udise',
        category: 'UDISE+ Code',
        metrics: entities.map(e => ({
          id: `${e.id}-udise`,
          label: 'UDISE',
          value: schoolRecords[e.id]?.udiseCode || '—',
          status: 'available' as const,
        })),
      },
      {
        id: 'level',
        category: 'School Level',
        metrics: entities.map(e => ({
          id: `${e.id}-level`,
          label: 'Level',
          value: schoolRecords[e.id]?.schoolLevel || '—',
          status: 'available' as const,
        })),
      },
      {
        id: 'students',
        category: 'Students (Official)',
        metrics: entities.map(e => ({
          id: `${e.id}-students`,
          label: 'Students',
          value: schoolRecords[e.id]?.officialStudentCount ?? '—',
          unit: '',
          source: { name: 'UDISE+', type: 'A' as const },
          status: 'available' as const,
        })),
      },
      {
        id: 'teachers',
        category: 'Teachers (Official)',
        metrics: entities.map(e => ({
          id: `${e.id}-teachers`,
          label: 'Teachers',
          value: schoolRecords[e.id]?.officialTeacherCount ?? '—',
          source: { name: 'UDISE+', type: 'A' as const },
          status: 'available' as const,
        })),
      },
      {
        id: 'ptr',
        category: 'Pupil-Teacher Ratio',
        metrics: entities.map(e => ({
          id: `${e.id}-ptr`,
          label: 'PTR',
          value: schoolRecords[e.id]?.officialStudentCount && schoolRecords[e.id]?.officialTeacherCount
            ? `${Math.round(schoolRecords[e.id].officialStudentCount / schoolRecords[e.id].officialTeacherCount)}:1`
            : '—',
          source: { name: 'Calculated', type: 'A' as const },
          status: 'available' as const,
        })),
      },
      {
        id: 'ground-score',
        category: 'Ground Truth Score',
        metrics: entities.map(e => ({
          id: `${e.id}-gts`,
          label: 'Score /100',
          value: schoolRecords[e.id]?.groundTruthScore ?? '—',
          source: { name: `${schoolRecords[e.id]?.totalCheckIns || 0} Check-ins`, type: 'C' as const },
          freshness: schoolRecords[e.id]?.lastCheckInDate || null,
          status: schoolRecords[e.id]?.groundTruthScore !== undefined ? 'available' as const : 'unavailable' as const,
          color: (schoolRecords[e.id]?.groundTruthScore ?? 0) >= 75 ? '#10b981' : (schoolRecords[e.id]?.groundTruthScore ?? 0) >= 50 ? '#f59e0b' : '#ef4444',
        })),
      },
      {
        id: 'teacher-present',
        category: 'Teacher Present (Community)',
        metrics: entities.map(e => ({
          id: `${e.id}-tp`,
          label: 'Status',
          value: schoolRecords[e.id]?.metrics?.teacherPresent === 'yes' ? '✅ Yes' : schoolRecords[e.id]?.metrics?.teacherPresent === 'no' ? '❌ No' : '⚠ Not Sure',
          source: { name: 'Citizen Check-in', type: 'C' as const },
          status: 'available' as const,
        })),
      },
      {
        id: 'toilet',
        category: 'Toilet Usable (Community)',
        metrics: entities.map(e => ({
          id: `${e.id}-toilet`,
          label: 'Status',
          value: schoolRecords[e.id]?.metrics?.toiletUsable === 'yes' ? '✅ Usable' : schoolRecords[e.id]?.metrics?.toiletUsable === 'no' ? '❌ Not Usable' : '⚠ Not Sure',
          source: { name: 'Citizen Check-in', type: 'C' as const },
          status: 'available' as const,
        })),
      },
      {
        id: 'mdm',
        category: 'MDM Served (Community)',
        metrics: entities.map(e => ({
          id: `${e.id}-mdm`,
          label: 'Status',
          value: schoolRecords[e.id]?.metrics?.mdmServed === 'yes' ? '✅ Served' : schoolRecords[e.id]?.metrics?.mdmServed === 'no' ? '❌ Not Served' : '⚠ Not Sure',
          source: { name: 'Citizen Check-in', type: 'C' as const },
          status: 'available' as const,
        })),
      },
      {
        id: 'confidence',
        category: 'Confidence Level',
        metrics: entities.map(e => ({
          id: `${e.id}-conf`,
          label: 'Level',
          value: schoolRecords[e.id]?.confidenceLevel || '—',
          source: { name: 'Calculated', type: 'A' as const },
          status: 'available' as const,
        })),
      },
    ];

    return { entities, rows };
  }, [selectedSchools, schoolRecords]);

  return (
    <div className="container" style={{ padding: '2rem 1.25rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', color: 'var(--color-primary)', margin: 0 }}>Compare Schools</h2>
        <p style={{ fontSize: '0.85rem', opacity: 0.7, margin: '0.25rem 0 0' }}>
          Select 2-4 schools to compare official data, community reports, and ground truth scores.
        </p>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <CompareSelector
          value={selectedSchools}
          onChange={(entities) => {
            setSelectedSchools(entities);
            entities.forEach(handleSchoolSelect);
          }}
          maxItems={4}
          entityType="school"
          placeholder="Search schools by name or UDISE code…"
        />
      </div>

      {selectedSchools.length < 2 && (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', background: '#f8fafc', borderRadius: 12, border: '1px dashed #cbd5e1' }}>
          <GraduationCap size={40} style={{ opacity: 0.2, marginBottom: '0.75rem' }} />
          <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '0.4rem' }}>Select schools to compare</h3>
          <p style={{ fontSize: '0.82rem', opacity: 0.6 }}>Add at least 2 schools using the search box above.</p>
        </div>
      )}

      {loading && (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p style={{ fontSize: '0.85rem', opacity: 0.6 }}>Loading school data…</p>
        </div>
      )}

      {comparisonData && (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          <ComparisonTable data={comparisonData} showSourceDisclosure />
        </div>
      )}
    </div>
  );
}
