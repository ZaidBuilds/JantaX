import React, { useState } from 'react';

interface GrievanceDraftFormProps {
  issue: {
    issueId: string;
    title: string;
    description: string;
    evidenceCount: number;
  };
  authorityResolver: {
    authority: string;
    officialChannel: string;
    submissionUrl?: string;
  };
  onSubmit: (grievanceDraft: any) => void;
}

export function GrievanceDraftForm({ issue, authorityResolver, onSubmit }: GrievanceDraftFormProps) {
  const [draft, setDraft] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // In a real app, we would save the draft and then move to the next step
    const grievanceDraft = {
      issueId: issue.issueId,
      authority: authorityResolver.authority,
      officialChannel: authorityResolver.officialChannel,
      draft: draft,
    };
    onSubmit(grievanceDraft);
    setSubmitting(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Draft Your Grievance</h2>
      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-2">Issue Summary</h3>
        <p className="text-sm text-gray-600"><strong>Title:</strong> {issue.title}</p>
        <p className="text-sm text-gray-600"><strong>Description:</strong> {issue.description}</p>
        <p className="text-sm text-gray-600"><strong>Evidences Collected:</strong> {issue.evidenceCount}</p>
      </div>
      <div className="mb-4">
        <h3 className="font-semibold text-gray-900 mb-2">Authority and Channel</h3>
        <p className="text-sm text-gray-600"><strong>Authority:</strong> {authorityResolver.authority}</p>
        <p className="text-sm text-gray-600"><strong>Official Channel:</strong> {authorityResolver.officialChannel}</p>
        {authorityResolver.submissionUrl && (
          <p className="text-sm text-gray-600"><strong>Submission URL:</strong> <a href={authorityResolver.submissionUrl} target="_blank" rel="noopener noreferrer">{authorityResolver.submissionUrl}</a></p>
        )}
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Grievance Draft</label>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-48"
          placeholder="Describe the issue, present your evidence, and request action from the authority..."
          minLength={20}
        />
        {draft.length < 20 && (
          <p className="mt-1 text-xs text-red-600">Please provide a detailed draft (at least 20 characters).</p>
        )}
      </div>
      <div className="flex justify-end pt-4">
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={submitting || draft.length < 20}
          className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 ${submitting || draft.length < 20 ? 'disabled' : ''}`}
        >
          {submitting ? 'Submitting...' : 'Submit Grievance Draft'}
        </button>
      </div>
    </div>
  );
}
