import React from 'react';

interface AuthorityResolverCardProps {
  authorityResolver: {
    authority: string;
    officialChannel: string;
    submissionUrl?: string;
    isActive: boolean;
  } | null;
}

export function AuthorityResolverCard({ authorityResolver }: AuthorityResolverCardProps) {
  if (!authorityResolver) {
    return (
      <div className="text-center py-4 text-gray-500">
        No authority resolver found for this issue type.
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm">
      <div className="bg-blue-50 px-4 py-3">
        <h3 className="font-semibold text-gray-900">Responsible Authority</h3>
      </div>
      <div className="px-4 py-3">
        <div className="mb-3">
          <p className="text-sm font-medium text-gray-700">Authority</p>
          <p className="text-gray-900 mt-1">{authorityResolver.authority}</p>
        </div>
        <div className="mb-3">
          <p className="text-sm font-medium text-gray-700">Official Channel</p>
          <p className="text-gray-900 mt-1">{authorityResolver.officialChannel}</p>
        </div>
        {authorityResolver.submissionUrl && (
          <div className="mb-3">
            <p className="text-sm font-medium text-gray-700">Submission URL</p>
            <a
              href={authorityResolver.submissionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:text-blue-800 break-all"
            >
              {authorityResolver.submissionUrl}
            </a>
          </div>
        )}
        <div className="pt-3 border-t border-gray-200">
          <span className={`px-2 py-0.5 text-xs rounded-full ${authorityResolver.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
            {authorityResolver.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>
    </div>
  );
}
