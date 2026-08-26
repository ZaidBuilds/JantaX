import React from 'react';

interface ResolutionCardProps {
  resolution: {
    resolutionId: string;
    description: string;
    status: string;
    verifiedByCitizen: boolean;
    verifiedByOfficial: boolean;
    evidenceCount?: number;
    createdAt: string; // ISO string
  };
}

export function ResolutionCard({ resolution }: ResolutionCardProps) {
  const statusColors: Record<string, string> = {
    PROPOSED: 'bg-yellow-100 text-yellow-800',
    VERIFIED_BY_CITIZEN: 'bg-blue-100 text-blue-800',
    VERIFIED_BY_OFFICIAL: 'bg-indigo-100 text-indigo-800',
    VERIFIED_BY_BOTH: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
  };

  const statusColorClass = statusColors[resolution.status] || 'bg-gray-100 text-gray-800';

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-start">
        <h3 className="font-semibold text-gray-900 flex-1">Resolution</h3>
        <span className={`px-2 py-0.5 text-xs rounded-full ${statusColorClass}`}>
          {resolution.status}
        </span>
      </div>
      <div className="px-4 py-3">
        <p className="text-sm text-gray-600 line-clamp-3">{resolution.description}</p>
        {resolution.evidenceCount !== undefined && (
          <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
            <span>{resolution.evidenceCount} supporting evidences</span>
          </div>
        )}
        <div className="mt-3 flex items-center gap-3 text-sm">
          <div className="flex items-center">
            <div className={`h-3 w-3 rounded-full ${resolution.verifiedByCitizen ? 'bg-green-500' : 'bg-gray-300'}`} />
            <span className="ml-1">Citizen Verified</span>
          </div>
          <div className="flex items-center">
            <div className={`h-3 w-3 rounded-full ${resolution.verifiedByOfficial ? 'bg-green-500' : 'bg-gray-300'}`} />
            <span className="ml-1">Officially Verified</span>
          </div>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          Created: {new Date(resolution.createdAt).toLocaleDateString()}
        </div>
      </div>
      <div className="px-4 py-3 border-t border-gray-200 flex justify-end space-x-2">
        <button
          className="text-sm text-blue-600 hover:text-blue-800"
          onClick={() => {/* View details */}}
        >
          View
        </button>
        {!resolution.verifiedByCitizen && (
          <button
            className="text-sm text-green-600 hover:text-green-800"
            onClick={() => {/* Verify by citizen */}}
          >
            Verify as Citizen
          </button>
        )}
        {!resolution.verifiedByOfficial && (
          <button
            className="text-sm text-indigo-600 hover:text-indigo-800"
            onClick={() => {/* Request official verification */}}
          >
            Request Official Verification
          </button>
        )}
      </div>
    </div>
  );
}
