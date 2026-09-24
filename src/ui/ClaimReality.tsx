import type { ReactNode } from 'react';
import { FileCheck2, Eye } from 'lucide-react';

interface ClaimRealityProps {
  claimLabel?: string;
  realityLabel?: string;
  claim: ReactNode;
  reality: ReactNode;
}

/** Side-by-side: what the official record says vs what was observed on the ground. */
export function ClaimReality({ claimLabel = 'Official record', realityLabel = 'Ground truth', claim, reality }: ClaimRealityProps) {
  return (
    <div className="compare-pair">
      <div className="pair-claim">
        <div className="pair-label">
          <FileCheck2 size={14} aria-hidden="true" />
          {claimLabel}
        </div>
        {claim}
      </div>
      <div className="pair-reality">
        <div className="pair-label">
          <Eye size={14} aria-hidden="true" />
          {realityLabel}
        </div>
        {reality}
      </div>
    </div>
  );
}
