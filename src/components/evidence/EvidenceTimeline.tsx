import React from 'react';

interface EvidenceTimelineProps {
  evidences: Array<any>; // Sorted by observedAt or createdAt
}

export function EvidenceTimeline({ evidences }: EvidenceTimelineProps) {
  if (evidences.length === 0) {
    return <p className="text-gray-500">No evidence to display</p>;
  }

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute inset-0 w-0.5 bg-gray-200" />
      
      {/* Timeline items */}
      {evidences.map((evidence, index) => (
        <div key={evidence.evidenceId} className="relative py-4 pl-6">
          {/* Timeline dot */}
          <div className="absolute left-0 top-2.5 w-3 h-3 rounded-full bg-primary-500" />
          
          {/* Timeline content */}
          <div className="ml-4">
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-xs text-gray-500">
                {new Date(evidence.observedAt).toLocaleDateString()}
              </span>
              {/* We'll add evidence type badge later */}
            </div>
            <h3 className="font-semibold text-gray-800">{evidence.title || evidence.description.substring(0, 50)}</h3>
            <p className="text-sm text-gray-600 line-clamp-2">
              {evidence.description}
            </p>
            {/* We can add badges here: verification, confidence, etc. */}
          </div>
        </div>
      ))}
      
      {/* Bottom line to indicate continuation */}
      <div className="absolute left-0 bottom-0 h-4 w-0.5 bg-gray-200" />
    </div>
  );
}