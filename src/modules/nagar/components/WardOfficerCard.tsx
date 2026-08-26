import React from 'react';
import type { CouncillorDetails, SanitaryInspectorDetails } from '../types/nagar';
import { UserCheck, Phone, MapPin, Clock, ShieldCheck, Award } from 'lucide-react';

interface Props {
  councillor: CouncillorDetails;
  sanitaryInspector: SanitaryInspectorDetails;
  wardNumber: number;
  wardName: string;
}

export function WardOfficerCard({ councillor, sanitaryInspector, wardNumber, wardName }: Props) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
      {/* Elected Councillor Card */}
      <div className="jantax-card" style={{ padding: '1.5rem', borderLeft: '4px solid #f97316' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
          <Award size={16} style={{ color: '#f97316' }} />
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#f97316', textTransform: 'uppercase' }}>
            Elected Ward Councillor (पार्षद)
          </span>
        </div>

        <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f2d59', margin: '0 0 0.2rem' }}>
          {councillor.name}
        </h4>
        <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.75rem' }}>
          {councillor.nameHi} • Party: <strong>{councillor.party}</strong>
        </div>

        <div style={{ display: 'grid', gap: '0.4rem', fontSize: '0.8rem', color: '#334155' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Phone size={13} style={{ color: '#64748b' }} />
            <a href={`tel:${councillor.phone}`} style={{ color: '#2563eb', fontWeight: 700, textDecoration: 'none' }}>
              {councillor.phone}
            </a>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem', fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>
            <MapPin size={13} style={{ marginTop: 2, flexShrink: 0 }} />
            <span>{councillor.officeAddress}</span>
          </div>
        </div>
      </div>

      {/* Sanitary Inspector Card */}
      <div className="jantax-card" style={{ padding: '1.5rem', borderLeft: '4px solid #16a34a' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
          <UserCheck size={16} style={{ color: '#16a34a' }} />
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#16a34a', textTransform: 'uppercase' }}>
            Designated Sanitary Inspector (सफाई निरीक्षक)
          </span>
        </div>

        <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f2d59', margin: '0 0 0.2rem' }}>
          {sanitaryInspector.name}
        </h4>
        <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.75rem' }}>
          {sanitaryInspector.nameHi} • Ward #{wardNumber} Field Officer
        </div>

        <div style={{ display: 'grid', gap: '0.4rem', fontSize: '0.8rem', color: '#334155' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Phone size={13} style={{ color: '#64748b' }} />
            <a href={`tel:${sanitaryInspector.phone}`} style={{ color: '#16a34a', fontWeight: 700, textDecoration: 'none' }}>
              {sanitaryInspector.phone} (Call on Duty)
            </a>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: '#475569' }}>
            <Clock size={13} style={{ color: '#64748b' }} />
            <span>Duty: {sanitaryInspector.shiftTimings}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem', fontSize: '0.75rem', color: '#64748b' }}>
            <MapPin size={13} style={{ marginTop: 2, flexShrink: 0 }} />
            <span>{sanitaryInspector.officeLocation}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
