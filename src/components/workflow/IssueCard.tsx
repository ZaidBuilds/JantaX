import React from 'react';

interface IssueCardProps {
  issue: {
    issueId: string;
    title: string;
    description: string;
    status: string;
    detectedAt: string; // ISO string
    evidenceCount?: number;
    entityType?: string;
    entityId?: string;
  };
}

export function IssueCard({ issue }: IssueCardProps) {
  const statusColors: Record<string, string> = {
    DETECTED: 'bg-gray-100 text-gray-800',
    EVIDENCE_COLLECTED: 'bg-blue-100 text-blue-800',
    AUTHORITY_IDENTIFIED: 'bg-yellow-100 text-yellow-800',
    GRIEVANCE_DRAFTED: 'bg-indigo-100 text-indigo-800',
    GRIEVANCE_SUBMITTED: 'bg-green-100 text-green-800',
    AWAITING_RESPONSE: 'bg-orange-100 text-orange-800',
    RESOLVED: 'bg-green-200 text-green-900',
    REJECTED: 'bg-red-100 text-red-800',
  };

  const statusColorClass = statusColors[issue.status] || 'bg-gray-100 text-gray-800';

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-start">
        <h3 className="font-semibold text-gray-900 flex-1">{issue.title}</h3>
        <span className={`px-2 py-0.5 text-xs rounded-full ${statusColorClass}`}>
          {issue.status}
        </span>
      </div>
      <div className="px-4 py-3">
        <p className="text-sm text-gray-600 line-clamp-2">{issue.description}</p>
        {issue.evidenceCount !== undefined && (
          <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
            <span>{issue.evidenceCount} evidences</span>
            {issue.entityType && issue.entityId && (
              <span>{issue.entityType}: {issue.entityId}</span>
            )}
          </div>
        )}
        <div className="mt-2 text-xs text-gray-500">
          Detected: {new Date(issue.detectedAt).toLocaleDateString()}
        </div>
      </div>
      <div className="px-4 py-3 border-t border-gray-200 flex justify-end space-x-2">
        <button
          className="text-sm text-blue-600 hover:text-blue-800"
          onClick={() => {/* View details */}}
        >
          View
        </button>
        <button
          className="text-sm text-green-600 hover:text-green-800"
          onClick={() => {/* Add evidence */}}
        >
          Add Evidence
        </button>
      </div>
    </div>
  );
}
