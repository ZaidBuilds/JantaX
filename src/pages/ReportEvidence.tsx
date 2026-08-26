import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ReportEvidencePage() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    source: '',
    entityType: '',
    entityId: '',
    observedAt: '',
    location: '',
    evidenceType: '',
    description: '',
    privacyStatus: 'PUBLIC',
  });
  
  const [mediaFiles, setMediaFiles] = useState<Array<File>>([]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Here we would upload media files to storage (e.g., AWS S3) and get URLs
    // Then create the evidence record via API
    // For now, we'll just log and redirect
    console.log('Submitting evidence:', { ...formData, mediaFiles });
    // In a real app, we would call an API endpoint
    // After submission, redirect to a success page or the evidence page
    navigate('/evidence/submitted');
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Report Evidence</h1>
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
              <input
                type="text"
                value={formData.source}
                onChange={(e) => setFormData({...formData, source: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Government Portal, Citizen App"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Entity Type</label>
              <input
                type="text"
                value={formData.entityType}
                onChange={(e) => setFormData({...formData, entityType: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., INFRA_PROJECT, SCHOOL"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Entity ID</label>
              <input
                type="text"
                value={formData.entityId}
                onChange={(e) => setFormData({...formData, entityId: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., PROJECT_12345"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Observed At</label>
              <input
                type="datetime-local"
                value={formData.observedAt}
                onChange={(e) => setFormData({...formData, observedAt: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location (Pincode)</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 110001"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Evidence Type</label>
              <select
                value={formData.evidenceType}
                onChange={(e) => setFormData({...formData, evidenceType: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select evidence type</option>
                <option value="OFFICIAL_RECORD">Official Record</option>
                <option value="GOVERNMENT_DOCUMENT">Government Document</option>
                <option value="INDEPENDENT_RESEARCH">Independent Research</option>
                <option value="CITIZEN_OBSERVATION">Citizen Observation</option>
                <option value="PHOTO_EVIDENCE">Photo Evidence</option>
                <option value="VIDEO_EVIDENCE">Video Evidence</option>
                <option value="TIMESTAMPED_REPORT">Timestamped Report</option>
                <option value="LOCATION_EVIDENCE">Location Evidence</option>
                <option value="GOVERNMENT_RESPONSE">Government Response</option>
                <option value="RESOLUTION_EVIDENCE">Resolution Evidence</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Privacy Status</label>
              <select
                value={formData.privacyStatus || 'PUBLIC'}
                onChange={(e) => setFormData({...formData, privacyStatus: e.target.value as any})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="PUBLIC">Public</option>
                <option value="ANONYMIZED">Anonymized</option>
                <option value="RESTRICTED">Restricted</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
              placeholder="Describe the evidence in detail..."
              required
              minLength={10}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Media Upload (Photos, Videos, Documents)</label>
            <div className="mt-2">
              <input
                type="file"
                multiple
                accept="image/*,video/*,application/pdf,.doc,.docx"
                onChange={(e) => {
                  if (e.target.files) {
                    setMediaFiles(Array.from(e.target.files));
                  }
                }}
                className="w-full text-sm text-gray-500"
              >
                <div className="flex flex-col items-center justify-between px-4 py-2">
                  <span className="text-sm font-medium text-gray-700">Click to upload or drag and drop</span>
                  <p className="text-xs text-gray-500">Supported formats: JPG, PNG, PDF, MP4, etc. (Max 10 files)</p>
                </div>
              </input>
            </div>
            {mediaFiles.length > 0 && (
              <div className="mt-3">
                <p className="font-medium text-gray-700">Selected Files ({mediaFiles.length}):</p>
                <ul className="mt-2 space-y-1 text-sm">
                  {mediaFiles.map((file, index) => (
                    <li key={index} className="flex justify-between">
                      <span>{file.name}</span>
                      <span className="text-gray-500">{(file.size / 1024).toFixed(1)} KB</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              Submit Evidence
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}