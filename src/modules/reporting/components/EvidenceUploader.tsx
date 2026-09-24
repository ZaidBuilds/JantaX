import React, { useState } from 'react';
import { Camera, Upload, Trash2, Clock } from 'lucide-react';
import { validateUploadFile } from '../../security/services/securityService';

interface EvidenceUploaderProps {
  files: Array<{ url: string; fileName: string; fileSize: string; mediaType: 'image' | 'video' }>;
  onChange: (files: Array<{ url: string; fileName: string; fileSize: string; mediaType: 'image' | 'video' }>) => void;
}

export const EvidenceUploader: React.FC<EvidenceUploaderProps> = ({ files, onChange }) => {
  const [samplePhotoUrl, setSamplePhotoUrl] = useState('');
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleAddSamplePhoto = (url: string, fileName: string) => {
    const val = validateUploadFile(fileName, 'image/jpeg', 2400000);
    if (!val.valid) {
      setUploadError(val.error || 'Upload validation failed.');
      return;
    }
    setUploadError(null);
    const newFile = {
      url,
      fileName: val.sanitizedFileName,
      fileSize: '2.4 MB',
      mediaType: 'image' as const
    };
    onChange([...files, newFile]);
  };

  const handleRemoveFile = (index: number) => {
    const updated = files.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div style={{ display: 'grid', gap: '1rem' }}>
      {/* Upload Zone Drop Box */}
      <div style={{
        background: 'var(--surface-2)',
        border: '2px dashed var(--border-strong)',
        borderRadius: 14,
        padding: '1.5rem',
        textAlign: 'center',
        cursor: 'pointer'
      }}>
        <Camera size={32} style={{ color: 'var(--brand-ink)', marginBottom: '0.5rem' }} />
        <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--ink)' }}>
          Upload Ground Photo or Short Video Evidence
        </div>
        <div style={{ fontSize: '0.78rem', color: 'var(--ink-3)', marginTop: '0.2rem', marginBottom: '1rem' }}>
          Supports JPG, PNG, MP4 up to 10MB. All uploads undergo automated moderation.
        </div>

        {/* Preset Sample Photo Buttons for Quick Testing */}
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => handleAddSamplePhoto(
              'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
              'pothole_road_evidence.jpg'
            )}
            style={{
              padding: '0.4rem 0.8rem',
              borderRadius: 8,
              background: 'var(--brand-soft)',
              border: '1px solid var(--brand-line)',
              color: 'var(--brand-ink)',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}
          >
            <Upload size={12} /> Add Sample Road Photo
          </button>
          <button
            type="button"
            onClick={() => handleAddSamplePhoto(
              'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80',
              'pipe_leakage_evidence.jpg'
            )}
            style={{
              padding: '0.4rem 0.8rem',
              borderRadius: 8,
              background: 'var(--brand-soft)',
              border: '1px solid var(--brand-line)',
              color: 'var(--brand-ink)',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}
          >
            <Upload size={12} /> Add Sample Water Photo
          </button>
        </div>
      </div>

      {/* Previews List */}
      {files.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.85rem' }}>
          {files.map((file, idx) => (
            <div
              key={idx}
              style={{
                borderRadius: 12,
                border: '1px solid var(--border-strong)',
                overflow: 'hidden',
                background: 'var(--surface)',
                position: 'relative'
              }}
            >
              <div style={{ height: 120, overflow: 'hidden', position: 'relative' }}>
                <img src={file.url} alt={file.fileName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button
                  type="button"
                  onClick={() => handleRemoveFile(idx)}
                  style={{
                    position: 'absolute',
                    top: '0.4rem',
                    right: '0.4rem',
                    background: 'rgba(239, 68, 68, 0.9)',
                    color: 'var(--on-solid)',
                    border: 'none',
                    borderRadius: '50%',
                    width: 24,
                    height: 24,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <Trash2 size={12} />
                </button>
              </div>
              <div style={{ padding: '0.55rem 0.75rem' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {file.fileName}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--ink-3)', display: 'flex', alignItems: 'center', gap: '0.2rem', marginTop: '0.15rem' }}>
                  <Clock size={10} style={{ color: 'var(--warn)' }} /> Pending Moderation
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
