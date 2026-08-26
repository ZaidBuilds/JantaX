import React, { useState } from 'react';
import type { InfraProject } from '../types/projectInfra';
import { 
  Eye, 
  MapPin, 
  Camera, 
  ThumbsUp, 
  MessageSquare, 
  ShieldCheck, 
  CheckCircle2, 
  Send,
  User
} from 'lucide-react';
import { addCitizenReportToProject, upvoteCitizenReport } from '../services/projectService';

interface ProjectGroundTruthTabProps {
  project: InfraProject;
  onProjectUpdated: (updated: InfraProject) => void;
}

export const ProjectGroundTruthTab: React.FC<ProjectGroundTruthTabProps> = ({
  project,
  onProjectUpdated
}) => {
  const [userName, setUserName] = useState('');
  const [ratingValue, setRatingValue] = useState(70);
  const [comment, setComment] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleAddReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const updated = addCitizenReportToProject(project.id, {
      userName,
      ratingValue,
      comment,
      imageUrl
    });

    if (updated) {
      onProjectUpdated(updated);
      setComment('');
      setImageUrl('');
      setFormSubmitted(true);
      setTimeout(() => setFormSubmitted(false), 4000);
    }
  };

  const handleUpvote = (reportId: string) => {
    const updated = upvoteCitizenReport(project.id, reportId);
    if (updated) {
      onProjectUpdated(updated);
    }
  };

  return (
    <div style={{ display: 'grid', gap: '1.5rem' }}>
      {/* Ground Truth Overview Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        borderRadius: 16,
        padding: '1.5rem',
        color: '#ffffff',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
            <ShieldCheck size={20} style={{ color: '#10b981' }} />
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#a7f3d0', textTransform: 'uppercase' }}>
              Ground Reality Audit
            </span>
          </div>
          <h3 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0 }}>
            Physical Ground Truth Score: {project.groundTruth.physicalScore}%
          </h3>
          <div style={{ fontSize: '0.82rem', color: '#cbd5e1', marginTop: '0.3rem' }}>
            Last Verified: {project.groundTruth.lastVerifiedDate} · By {project.groundTruth.verifiedBy}
          </div>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(8px)',
          borderRadius: 12,
          padding: '0.75rem 1.25rem',
          border: '1px solid rgba(255,255,255,0.15)',
          textAlign: 'right'
        }}>
          <div style={{ fontSize: '0.74rem', color: '#cbd5e1', fontWeight: 600 }}>Official Claim vs Reality</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', marginTop: '0.1rem' }}>
            Claim: {project.progressPhysical}% · Reality: {project.groundTruth.physicalScore}%
          </div>
        </div>
      </div>

      {/* Field Surveyor Status Note */}
      <div style={{
        background: '#ffffff',
        borderRadius: 16,
        border: '1px solid #e2e8f0',
        padding: '1.25rem 1.5rem'
      }}>
        <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', marginTop: 0, marginBottom: '0.4rem' }}>
          Ground Reality Field Note
        </h4>
        <p style={{ fontSize: '0.9rem', color: '#334155', margin: 0, lineHeight: 1.55 }}>
          {project.groundTruth.physicalStatusNote}
        </p>
      </div>

      {/* Geo-tagged Photos Gallery */}
      <div style={{ background: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0', padding: '1.5rem' }}>
        <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginTop: 0, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Camera size={18} style={{ color: '#ea580c' }} /> Geo-Tagged Verification Photos ({project.groundTruth.geoTaggedPhotos.length})
        </h4>

        {project.groundTruth.geoTaggedPhotos.length === 0 ? (
          <div style={{ fontSize: '0.86rem', color: '#64748b' }}>No geo-tagged photos uploaded yet.</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            {project.groundTruth.geoTaggedPhotos.map((photo) => (
              <div
                key={photo.id}
                style={{
                  borderRadius: 12,
                  overflow: 'hidden',
                  border: '1px solid #cbd5e1',
                  background: '#f8fafc'
                }}
              >
                <div style={{ height: 160, overflow: 'hidden', position: 'relative' }}>
                  <img
                    src={photo.url}
                    alt={photo.caption}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{
                    position: 'absolute',
                    bottom: '0.5rem',
                    left: '0.5rem',
                    background: 'rgba(15, 23, 42, 0.8)',
                    color: '#ffffff',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    padding: '0.2rem 0.5rem',
                    borderRadius: 4,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}>
                    <MapPin size={11} style={{ color: '#fb923c' }} /> {photo.lat.toFixed(4)}, {photo.lng.toFixed(4)}
                  </div>
                </div>
                <div style={{ padding: '0.75rem', fontSize: '0.82rem', color: '#334155' }}>
                  <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '0.2rem' }}>{photo.caption}</div>
                  <div style={{ fontSize: '0.74rem', color: '#64748b' }}>Captured: {photo.timestamp}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Citizen Eye Field Observations Log */}
      <div style={{ background: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0', padding: '1.5rem' }}>
        <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginTop: 0, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <MessageSquare size={18} style={{ color: '#2563eb' }} /> Community Field Reports ({project.groundTruth.citizenReports.length})
        </h4>

        {project.groundTruth.citizenReports.length === 0 ? (
          <div style={{ fontSize: '0.86rem', color: '#64748b', marginBottom: '1rem' }}>
            No community reports submitted yet. Be the first citizen to report ground reality!
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '0.85rem', marginBottom: '1.5rem' }}>
            {project.groundTruth.citizenReports.map((report) => (
              <div
                key={report.id}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 12,
                  padding: '1rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <div style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: '#eff6ff',
                      color: '#1d4ed8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '0.75rem'
                    }}>
                      <User size={14} />
                    </div>
                    <div>
                      <span style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0f172a' }}>{report.userName}</span>
                      <span style={{ fontSize: '0.74rem', color: '#64748b', marginLeft: '0.5rem' }}>
                        {new Date(report.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <span style={{
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    color: report.ratingValue >= 70 ? '#047857' : '#b45309',
                    background: report.ratingValue >= 70 ? '#ecfdf5' : '#fffbebf',
                    padding: '0.2rem 0.6rem',
                    borderRadius: 6
                  }}>
                    Assessed Score: {report.ratingValue}%
                  </span>
                </div>

                <p style={{ fontSize: '0.88rem', color: '#334155', margin: '0.4rem 0 0.6rem', lineHeight: 1.5 }}>
                  {report.comment}
                </p>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => handleUpvote(report.id)}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #cbd5e1',
                      borderRadius: 6,
                      padding: '0.25rem 0.6rem',
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      color: '#475569',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem'
                    }}
                  >
                    <ThumbsUp size={12} style={{ color: '#2563eb' }} /> Upvote Field Audit ({report.upvotes})
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Submit Citizen Observation Form */}
        <div style={{
          background: '#f8fafc',
          border: '1px solid #cbd5e1',
          borderRadius: 14,
          padding: '1.25rem'
        }}>
          <h5 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', marginTop: 0, marginBottom: '0.85rem' }}>
            Submit Ground Reality Observation (Citizen Audit)
          </h5>

          {formSubmitted && (
            <div style={{
              background: '#ecfdf5',
              border: '1px solid #a7f3d0',
              color: '#047857',
              padding: '0.65rem 0.85rem',
              borderRadius: 8,
              fontSize: '0.84rem',
              fontWeight: 700,
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}>
              <CheckCircle2 size={16} /> Observation submitted successfully! Ground truth index updated.
            </div>
          )}

          <form onSubmit={handleAddReport} style={{ display: 'grid', gap: '0.85rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.3rem' }}>
                  Your Name (Optional / Citizen Auditor)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ankit Sharma"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.3rem' }}>
                  Observed Physical Progress Score ({ratingValue}%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={ratingValue}
                  onChange={(e) => setRatingValue(Number(e.target.value))}
                  style={{ width: '100%', marginTop: '0.4rem' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.3rem' }}>
                Field Observation Comment *
              </label>
              <textarea
                placeholder="Describe current work status on site, active machinery, pillars completed..."
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                style={{ width: '100%', padding: '0.65rem 0.75rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.85rem', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.3rem' }}>
                Optional Photo URL
              </label>
              <input
                type="url"
                placeholder="https://..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
              />
            </div>

            <button
              type="submit"
              style={{
                padding: '0.65rem 1.25rem',
                borderRadius: 8,
                background: 'var(--gradient-accent)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.86rem',
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                justifySelf: 'start'
              }}
            >
              <Send size={15} /> Submit Citizen Field Report
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
