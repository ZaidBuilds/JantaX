import React from 'react';
import { EvidenceCard } from './EvidenceCard';

interface EvidenceGalleryProps {
  evidences: Array<any>; // We'll type this properly later, but for now any
  columns?: number; // Number of columns in grid (default 3)
}

export function EvidenceGallery({ evidences, columns = 3 }: EvidenceGalleryProps) {
  // Responsive columns: we'll use Tailwind grid classes
  // We'll define the grid template columns based on columns prop
  const cols = `grid-cols-${columns} sm:grid-cols-${Math.min(columns + 1, 4)} lg:grid-cols-${Math.min(columns + 2, 6)}`;

  return (
    <div className={`grid gap-4 ${cols}`}>
      {evidences.map((evidence) => (
        <EvidenceCard key={evidence.evidenceId} evidence={evidence} />
      ))}
    </div>
  );
}