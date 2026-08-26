import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { EvidenceCard } from '../components/evidence/EvidenceCard';

export default function ModerationEvidencePage() {
  const navigate = useNavigate();
  
  const [evidences, setEvidences] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'VERIFIED' | 'DISPUTED'>('ALL');
  
  // In a real app, we would fetch from an API endpoint
  // For now, we'll simulate with empty array and some mock data if needed
  useEffect(() => {
    setLoading(true);
    setEvidences([]);
    setLoading(false);
  }, [filter]);
  
  const handleApprove = async (evidenceId: string) => {
    // Call API to approve evidence
    // Then update state
    setEvidences(evidences.map(ev => 
      ev.evidenceId === evidenceId ? {...ev, verificationStatus: 'VERIFIED', moderationStatus: 'APPROVED'} : ev
    ));
  };
  
  const handleReject = async (evidenceId: string) => {
    // Call API to reject evidence
    setEvidences(evidences.map(ev => 
      ev.evidenceId === evidenceId ? {...ev, verificationStatus: 'DISPUTED', moderationStatus: 'REJECTED'} : ev
    ));
  };
  
  if (loading) {
    return <div className="flex h-64 items-center justify-center">Loading...</div>;
  }
  
  const filteredEvidences = evidences.filter(ev => 
    filter === 'ALL' || 
    (filter === 'PENDING' && ev.verificationStatus === 'PENDING') ||
    (filter === 'VERIFIED' && ev.verificationStatus === 'VERIFIED') ||
    (filter === 'DISPUTED' && ev.verificationStatus === 'DISPUTED')
  );
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Evidence Moderation</h1>
          <div className="flex space-x-3">
            <button 
              onClick={() => setFilter('ALL')}
              className={`px-3 py-1 text-sm rounded ${filter === 'ALL' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
            >
              All
            </button>
            <button 
              onClick={() => setFilter('PENDING')}
              className={`px-3 py-1 text-sm rounded ${filter === 'PENDING' ? 'bg-yellow-600 text-white' : 'bg-gray-200 text-gray-800'}`}
            >
              Pending ({filteredEvidences.filter(ev => ev.verificationStatus === 'PENDING').length})
            </button>
            <button 
              onClick={() => setFilter('VERIFIED')}
              className={`px-3 py-1 text-sm rounded ${filter === 'VERIFIED' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-800'}`}
            >
              Verified ({filteredEvidences.filter(ev => ev.verificationStatus === 'VERIFIED').length})
            </button>
            <button 
              onClick={() => setFilter('DISPUTED')}
              className={`px-3 py-1 text-sm rounded ${filter === 'DISPUTED' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-800'}`}
            >
              Disputed ({filteredEvidences.filter(ev => ev.verificationStatus === 'DISPUTED').length})
            </button>
          </div>
        </div>
        
        {filteredEvidences.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No evidence to moderate</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredEvidences.map((evidence) => (
              <div key={evidence.evidenceId} className="border rounded-lg overflow-hidden shadow-sm">
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900 flex-1">
                      {evidence.description.substring(0, 60)}...
                    </h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-800">
                      {evidence.evidenceType}
                    </span>
                  </div>
                  <EvidenceCard evidence={evidence} />
                  <div className="mt-4 flex justify-end space-x-2">
                    {evidence.moderationStatus === 'PENDING' && (
                      <>
                        <button 
                          onClick={() => handleApprove(evidence.evidenceId)}
                          className="px-3 py-1 text-sm text-green-600 hover:text-green-800"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => handleReject(evidence.evidenceId)}
                          className="px-3 py-1 text-sm text-red-600 hover:text-red-800"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}