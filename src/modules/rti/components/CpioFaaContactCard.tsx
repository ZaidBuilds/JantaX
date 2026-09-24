import React from 'react';
import type { OfficerDetails } from '../types/rti';
import { UserCheck, Phone, Mail, MapPin, ShieldCheck, Scale } from 'lucide-react';

interface Props {
  cpio: OfficerDetails;
  faa: OfficerDetails;
}

export function CpioFaaContactCard({ cpio, faa }: Props) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
      {/* CPIO Card */}
      <div className="jantax-card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--brand-ink)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
          <UserCheck size={16} style={{ color: 'var(--brand-ink)' }} />
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--brand-ink)', textTransform: 'uppercase' }}>
            Central Public Information Officer (CPIO)
          </span>
        </div>

        <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--ink)', margin: '0 0 0.2rem' }}>
          {cpio.name}
        </h4>
        <div style={{ fontSize: '0.82rem', color: 'var(--ink-3)', marginBottom: '0.75rem' }}>
          {cpio.designation}
        </div>

        <div style={{ display: 'grid', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--ink-2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Mail size={13} style={{ color: 'var(--ink-3)' }} />
            <a href={`mailto:${cpio.email}`} style={{ color: 'var(--brand-ink)', textDecoration: 'none', fontWeight: 600 }}>
              {cpio.email}
            </a>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Phone size={13} style={{ color: 'var(--ink-3)' }} />
            <span>{cpio.phone}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--ink-3)', marginTop: '0.2rem' }}>
            <MapPin size={13} style={{ marginTop: 2, flexShrink: 0 }} />
            <span>{cpio.officeAddress}</span>
          </div>
        </div>
      </div>

      {/* First Appellate Authority (FAA) Card */}
      <div className="jantax-card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--accent)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
          <Scale size={16} style={{ color: 'var(--accent-ink)' }} />
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-ink)', textTransform: 'uppercase' }}>
            First Appellate Authority (FAA)
          </span>
        </div>

        <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--ink)', margin: '0 0 0.2rem' }}>
          {faa.name}
        </h4>
        <div style={{ fontSize: '0.82rem', color: 'var(--ink-3)', marginBottom: '0.75rem' }}>
          {faa.designation}
        </div>

        <div style={{ display: 'grid', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--ink-2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Mail size={13} style={{ color: 'var(--ink-3)' }} />
            <a href={`mailto:${faa.email}`} style={{ color: 'var(--brand-ink)', textDecoration: 'none', fontWeight: 600 }}>
              {faa.email}
            </a>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Phone size={13} style={{ color: 'var(--ink-3)' }} />
            <span>{faa.phone}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--ink-3)', marginTop: '0.2rem' }}>
            <MapPin size={13} style={{ marginTop: 2, flexShrink: 0 }} />
            <span>{faa.officeAddress}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
