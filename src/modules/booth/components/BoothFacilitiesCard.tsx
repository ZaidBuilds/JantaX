import React from 'react';
import type { BoothFacilities } from '../types/booth';
import { CheckCircle2, XCircle, Accessibility, Droplets, Users, Eye, ShieldCheck, Sun } from 'lucide-react';

interface Props {
  facilities: BoothFacilities;
}

export function BoothFacilitiesCard({ facilities }: Props) {
  const items = [
    { label: 'Wheelchair Ramp (दिव्यांग रैंप)', available: facilities.wheelchairRamp, icon: Accessibility },
    { label: 'Drinking Water (पेयजल व्यवस्था)', available: facilities.drinkingWater, icon: Droplets },
    { label: 'Separate Male/Female Toilets (शौचालय)', available: facilities.separateToilets, icon: Users },
    { label: 'Ground Floor Access (भूतल कक्ष)', available: facilities.groundFloor, icon: ShieldCheck },
    { label: 'Braille Signage & EVM Strips (ब्रेल लिपि)', available: facilities.brailleSignage, icon: Eye },
    { label: 'Shaded Waiting Area (छायादार प्रतीक्षा स्थल)', available: facilities.shadedWaitingArea, icon: Sun },
  ];

  return (
    <div className="jantax-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--ink)', margin: '0 0 1rem' }}>
        Assuring Minimum Facilities (AMF) & PwD Accessibility
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem' }}>
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                background: item.available ? 'var(--good-soft)' : 'var(--bad-soft)',
                border: `1px solid ${item.available ? '#bbf7d0' : '#fecaca'}`,
                borderRadius: 10,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Icon size={16} style={{ color: item.available ? 'var(--good)' : 'var(--bad)' }} />
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: item.available ? 'var(--good)' : 'var(--bad)' }}>
                  {item.label}
                </span>
              </div>

              {item.available ? (
                <CheckCircle2 size={16} style={{ color: 'var(--good)', flexShrink: 0 }} />
              ) : (
                <XCircle size={16} style={{ color: 'var(--bad)', flexShrink: 0 }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
