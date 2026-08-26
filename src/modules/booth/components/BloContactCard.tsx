import React from 'react';
import type { BoothLevelOfficer } from '../types/booth';
import { UserCheck, Phone, Building2, ShieldCheck, Calendar, MapPin } from 'lucide-react';

interface Props {
  blo: BoothLevelOfficer;
  stationNumber?: number;
  buildingName?: string;
}

export function BloContactCard({ blo, stationNumber, buildingName }: Props) {
  return (
    <div
      className="jantax-card"
      style={{
        padding: '1.5rem',
        borderLeft: '4px solid #2563eb',
        background: 'linear-gradient(to right, #f8fafc, #ffffff)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
            <span style={{ background: '#eff6ff', color: '#1d4ed8', fontSize: '0.72rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: 6 }}>
              OFFICIAL DESIGNATED BLO
            </span>
            {stationNumber && (
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
                Polling Station No. {stationNumber}
              </span>
            )}
          </div>

          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f2d59', margin: '0 0 0.2rem' }}>
            {blo.name} <span style={{ fontSize: '0.95rem', color: '#64748b', fontWeight: 600 }}>({blo.nameHi})</span>
          </h3>

          <div style={{ fontSize: '0.82rem', color: '#475569', fontWeight: 600 }}>
            {blo.designation}
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <a
            href={`tel:${blo.contactPhone.split(' ')[0]}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: '#2563eb',
              color: '#ffffff',
              padding: '0.55rem 1rem',
              borderRadius: 10,
              fontSize: '0.82rem',
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            <Phone size={14} /> Call Official BLO
          </a>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', background: '#f1f5f9', padding: '1rem', borderRadius: 10, fontSize: '0.78rem' }}>
        <div>
          <span style={{ color: '#64748b', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.68rem' }}>Department</span>
          <div style={{ color: '#1e293b', fontWeight: 600, marginTop: '0.15rem' }}>{blo.parentDepartment}</div>
        </div>

        <div>
          <span style={{ color: '#64748b', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.68rem' }}>Assigned Office</span>
          <div style={{ color: '#1e293b', fontWeight: 600, marginTop: '0.15rem' }}>{blo.officeLocation}</div>
        </div>

        <div>
          <span style={{ color: '#64748b', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.68rem' }}>Appointment Date</span>
          <div style={{ color: '#1e293b', fontWeight: 600, marginTop: '0.15rem' }}>{blo.appointedDate}</div>
        </div>
      </div>
    </div>
  );
}
