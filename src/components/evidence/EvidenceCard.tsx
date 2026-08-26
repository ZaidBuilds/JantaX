import React from 'react';
import { ConfidenceBadge } from './ConfidenceBadge';
import { VerificationBadge } from './VerificationBadge';
import { SourceBadge } from './SourceBadge';

interface EvidenceCardProps {
  evidence: {
    evidenceId: string;
    source: string;
    entityType: string;
    entityId: string;
    createdAt: string; // ISO string
    observedAt: string; // ISO string
    location: string;
    evidenceType: string;
    description: string;
    media: Array<any>; // We'll show the first media item if available
    verificationStatus: 'PENDING' | 'VERIFIED' | 'DISPUTED';
    confidence: number; // 0-100
    moderationStatus: 'PENDING' | 'APPROVED' | 'REJECTED' | 'FLAGGED';
    privacyStatus: 'PUBLIC' | 'ANONYMIZED' | 'RESTRICTED';
    submittedBy?: string;
  };
}

export function EvidenceCard({ evidence }: EvidenceCardProps) {
  // Format dates
  const observedDate = new Date(evidence.observedAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  
  // Get first media URL for thumbnail
  const thumbnailUrl = evidence.media && evidence.media.length > 0 
    ? evidence.media[0].url 
    : '/placeholder-image.jpg'; // We'll need a placeholder

  // Truncate description for card
  const shortDescription = 
    evidence.description.length > 100 
      ? evidence.description.substring(0, 100) + '...' 
      : evidence.description;

  return (
    <div className="glass-card border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Media thumbnail */}
      {evidence.media && evidence.media.length > 0 ? (
        <div className="w-full h-48">
          <img 
            src={evidence.media[0].url} 
            alt={evidence.description} 
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500">No Media</span>
        </div>
      )}
      
      {/* Card content */}
      <div className="p-4">
        {/* Header with type and verification */}
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-800">
            {evidence.evidenceType}
          </span>
          <VerificationBadge verificationStatus={evidence.verificationStatus} size="sm" />
        </div>
        
        {/* Title/Description */}
        <h3 className="font-semibold text-gray-900 line-clamp-2">
          {evidence.description.length > 50 
            ? evidence.description.substring(0, 50) + '...' 
            : evidence.description}
        </h3>
        
        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {evidence.location}
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M12 8v4l3 3" />
            </svg>
            {observedDate}
          </span>
          <SourceBadge source={evidence.source} size="sm" />
        </div>
        
        {/* Badges row */}
        <div className="flex flex-wrap items-center gap-2 mt-3">
          <ConfidenceBadge confidence={evidence.confidence} size="sm" />
          {/* We can add privacy status badge if needed */}
          {evidence.privacyStatus !== 'PUBLIC' && (
            <span className="px-2 py-0.5 text-xs rounded-full bg-purple-100 text-purple-800">
              {evidence.privacyStatus}
            </span>
          )}
        </div>
        
        {/* Action buttons (optional) */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end space-x-2">
          <button 
            className="text-sm text-blue-600 hover:text-blue-800"
            onClick={() => {/* View details */}}
          >
            View
          </button>
          {evidence.moderationStatus === 'PENDING' && (
            <>
              <button 
                className="text-sm text-green-600 hover:text-green-800"
                onClick={() => {/* Approve */}}
              >
                Approve
              </button>
              <button 
                className="text-sm text-red-600 hover:text-red-800"
                onClick={() => {/* Reject */}}
              >
                Reject
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}