import React, { useState } from 'react';

interface FollowUpFormProps {
  grievanceId?: string;
  issueId?: string;
  onSave: (followUp: any) => void;
}

export function FollowUpForm({ grievanceId, issueId, onSave }: FollowUpFormProps) {
  const [description, setDescription] = useState('');
  const [initiatedAt, setInitiatedAt] = useState(new Date().toISOString().slice(0, 16)); // For datetime-local input
  const [completedAt, setCompletedAt] = useState('');
  const [status, setStatus] = useState('PENDING');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we would call an API to save the follow-up
    const followUp = {
      grievanceId: grievanceId || undefined,
      issueId: issueId || undefined,
      description,
      initiatedAt,
      completedAt: completedAt || undefined,
      status,
    };
    onSave(followUp);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Add Follow-Up Action</h2>
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
            placeholder="Describe the follow-up action to be taken..."
            required
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="OVERDUE">Overdue</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Initiated At</label>
            <input
              type="datetime-local"
              value={initiatedAt}
              onChange={(e) => setInitiatedAt(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Completed At (optional)</label>
          <input
            type="datetime-local"
            value={completedAt}
            onChange={(e) => setCompletedAt(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            Save Follow-Up
          </button>
        </div>
      </form>
    </div>
  );
}
