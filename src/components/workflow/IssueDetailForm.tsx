import React, { useState } from 'react';

interface IssueDetailFormProps {
  issueId: string;
  onSave: (detail: any) => void;
  initialData?: any;
}

export function IssueDetailForm({ issueId, onSave, initialData }: IssueDetailFormProps) {
  const [formData, setFormData] = useState({
    severity: initialData?.severity || '',
    impactArea: initialData?.impactArea || '',
    metadata: initialData?.metadata || '',
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we would call an API to save the issue detail
    const detail = {
      issueId,
      ...formData,
    };
    onSave(detail);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Issue Details</h2>
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
          <select
            value={formData.severity}
            onChange={(e) => setFormData({...formData, severity: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select severity</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Impact Area</label>
          <input
            type="text"
            value={formData.impactArea}
            onChange={(e) => setFormData({...formData, impactArea: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Education, Healthcare, Infrastructure"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Additional Metadata (JSON)</label>
          <textarea
            value={formData.metadata}
            onChange={(e) => setFormData({...formData, metadata: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
            placeholder="Enter JSON metadata"
          />
        </div>
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            Save Details
          </button>
        </div>
      </form>
    </div>
  );
}
