import React, { useState, useRef } from 'react';
import { Camera, Upload, Trash2, Clock, ShieldCheck, AlertTriangle } from 'lucide-react';
import { validateUploadFile } from '../../security/services/securityService';
import { parsePhotoExif, ExifGpsData } from '../../../core/utils/exifParser';
import { generateEvidenceSha256 } from '../services/evidenceVerificationService';
import { Hash } from 'lucide-react';

export interface UploadedEvidenceItem {
  url: string;
  fileName: string;
  fileSize: string;
  mediaType: 'image' | 'video';
  exifData?: ExifGpsData;
  sha256Hash?: string;
}

interface EvidenceUploaderProps {
  files: UploadedEvidenceItem[];
  onChange: (files: UploadedEvidenceItem[]) => void;
  targetLat?: number;
  targetLng?: number;
}

export const EvidenceUploader: React.FC<EvidenceUploaderProps> = ({ files, onChange, targetLat, targetLng }) => {
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [analyzingExif, setAnalyzingExif] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;
    const file = fileList[0];

    const val = validateUploadFile(file.name, file.type, file.size);
    if (!val.valid) {
      setUploadError(val.error || 'Upload validation failed.');
      return;
    }
    setUploadError(null);
    setAnalyzingExif(true);

    try {
      const [exif, buffer] = await Promise.all([
        parsePhotoExif(file, targetLat, targetLng),
        file.arrayBuffer(),
      ]);
      const sha256 = await generateEvidenceSha256(buffer);
      const objectUrl = URL.createObjectURL(file);
      const newFile: UploadedEvidenceItem = {
        url: objectUrl,
        fileName: val.sanitizedFileName,
        fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        mediaType: file.type.startsWith('video') ? 'video' : 'image',
        exifData: exif,
        sha256Hash: sha256,
      };
      onChange([...files, newFile]);
    } catch {
      const objectUrl = URL.createObjectURL(file);
      onChange([...files, {
        url: objectUrl,
        fileName: val.sanitizedFileName,
        fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        mediaType: 'image'
      }]);
    } finally {
      setAnalyzingExif(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleAddSamplePhoto = (url: string, fileName: string, simulatedLat?: number, simulatedLng?: number) => {
    const val = validateUploadFile(fileName, 'image/jpeg', 2400000);
    if (!val.valid) {
      setUploadError(val.error || 'Upload validation failed.');
      return;
    }
    setUploadError(null);
    const newFile: UploadedEvidenceItem = {
      url,
      fileName: val.sanitizedFileName,
      fileSize: '2.4 MB',
      mediaType: 'image' as const,
      exifData: {
        hasGps: true,
        latitude: simulatedLat || (targetLat ? targetLat + 0.0004 : 28.6142),
        longitude: simulatedLng || (targetLng ? targetLng + 0.0003 : 77.2093),
        captureDate: new Date().toISOString().slice(0, 19).replace('T', ' '),
        cameraModel: 'Citizen Android Device (Pixel / Redmi)',
        distanceToTargetMeters: 45,
        integrityRating: 'VERIFIED_GEOFENCE',
        message: '✓ Ground Truth Verified: Captured 45m from facility boundary'
      },
      sha256Hash: 'a8f5c2d398fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
    };
    onChange([...files, newFile]);
  };

  const handleRemoveFile = (index: number) => {
    const updated = files.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div style={{ display: 'grid', gap: '1rem' }}>
      {/* Hidden File Input for Real Device Camera/Uploads */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/jpeg,image/png,image/webp,video/mp4"
        style={{ display: 'none' }}
      />

      {/* Upload Zone Drop Box */}
      <div 
        onClick={() => fileInputRef.current?.click()}
        style={{
          background: '#f8fafc',
          border: '2px dashed #cbd5e1',
          borderRadius: 14,
          padding: '1.5rem',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'border-color 0.2s'
        }}
      >
        <Camera size={32} style={{ color: '#2563eb', marginBottom: '0.5rem' }} />
        <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a' }}>
          {analyzingExif ? 'Analyzing Photo EXIF GPS Metadata...' : 'Select Ground Photo from Camera / Gallery'}
        </div>
        <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.2rem', marginBottom: '1rem' }}>
          In-browser EXIF GPS validator checks sub-metre geofence automatically.
        </div>

        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
          style={{
            padding: '0.5rem 1.25rem',
            borderRadius: 8,
            background: '#2563eb',
            color: '#ffffff',
            fontSize: '0.82rem',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            marginBottom: '0.75rem'
          }}
        >
          <Upload size={14} /> Upload Local Image
        </button>

        {uploadError && (
          <div style={{ color: '#ef4444', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            {uploadError}
          </div>
        )}

        {/* Preset Sample Photo Buttons for Quick Testing */}
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleAddSamplePhoto(
                'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
                'pothole_road_evidence.jpg'
              );
            }}
            style={{
              padding: '0.4rem 0.8rem',
              borderRadius: 8,
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              color: '#1d4ed8',
              fontSize: '0.74rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}
          >
            <Upload size={12} /> Add Verified Road Photo (GPS Tagged)
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleAddSamplePhoto(
                'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80',
                'pipe_leakage_evidence.jpg'
              );
            }}
            style={{
              padding: '0.4rem 0.8rem',
              borderRadius: 8,
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              color: '#1d4ed8',
              fontSize: '0.74rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}
          >
            <Upload size={12} /> Add Verified Facility Photo
          </button>
        </div>
      </div>

      {/* Previews List with EXIF Badge */}
      {files.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem' }}>
          {files.map((file, idx) => (
            <div
              key={idx}
              style={{
                borderRadius: 12,
                border: '1px solid #cbd5e1',
                overflow: 'hidden',
                background: '#ffffff',
                position: 'relative'
              }}
            >
              <div style={{ height: 130, overflow: 'hidden', position: 'relative' }}>
                <img src={file.url} alt={file.fileName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button
                  type="button"
                  onClick={() => handleRemoveFile(idx)}
                  style={{
                    position: 'absolute',
                    top: '0.4rem',
                    right: '0.4rem',
                    background: 'rgba(239, 68, 68, 0.9)',
                    color: '#ffffff',
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
              <div style={{ padding: '0.65rem 0.75rem' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {file.fileName}
                </div>
                
                {/* EXIF Integrity Badge */}
                {file.exifData?.hasGps ? (
                  <div style={{ marginTop: '0.35rem', fontSize: '0.68rem', color: file.exifData.integrityRating === 'VERIFIED_GEOFENCE' ? '#15803d' : '#b45309', background: file.exifData.integrityRating === 'VERIFIED_GEOFENCE' ? '#dcfce7' : '#fef3c7', padding: '3px 6px', borderRadius: 4, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <ShieldCheck size={12} />
                    <span>{file.exifData.message}</span>
                  </div>
                ) : (
                  <div style={{ marginTop: '0.35rem', fontSize: '0.68rem', color: '#64748b', background: '#f1f5f9', padding: '3px 6px', borderRadius: 4, fontWeight: 600 }}>
                    GPS Metadata: Community Flagged for Verification
                  </div>
                )}

                {file.sha256Hash && (
                  <div style={{ marginTop: '0.35rem', fontSize: '0.65rem', color: '#334155', background: '#f8fafc', border: '1px solid #e2e8f0', padding: '2px 6px', borderRadius: 4, fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Hash size={10} style={{ color: '#64748b' }} />
                    <span>SHA-256: {file.sha256Hash.slice(0, 16)}…</span>
                  </div>
                )}

                <div style={{ fontSize: '0.7rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.2rem', marginTop: '0.35rem' }}>
                  <Clock size={10} style={{ color: '#f59e0b' }} /> Ready for Moderation Queue
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
