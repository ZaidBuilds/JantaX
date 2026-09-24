import React, { useState, useRef, useCallback } from 'react';
import { SlidersHorizontal, CheckCircle2, AlertTriangle } from 'lucide-react';

interface JuxtapositionSliderProps {
  claimTitle?: string;
  claimImageUrl?: string;
  claimDetails?: string;
  claimDate?: string;
  realityTitle?: string;
  realityImageUrl?: string;
  realityDetails?: string;
  realityDate?: string;
  aspectRatio?: string;
  height?: number | string;
  className?: string;
}

export function JuxtapositionSlider({
  claimTitle = 'Official Sanction Claim',
  claimImageUrl = 'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=800&q=80',
  claimDetails = 'Government portal reports: 100% completed & fully commissioned.',
  claimDate = 'Official Gazette 2024',
  realityTitle = 'Citizen Ground Reality',
  realityImageUrl = 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
  realityDetails = 'Ground inspection reveals: Unpaved surface, exposed rebar, no drainage.',
  realityDate = 'Citizen GPS Signal (Verified)',
  aspectRatio = '16/9',
  height = 360,
  className = '',
}: JuxtapositionSliderProps) {
  const [sliderPos, setSliderPos] = useState<number>(50); // percentage (0 - 100)
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPos(percentage);
  }, []);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length > 0) {
        handleMove(e.touches[0].clientX);
      }
    },
    [handleMove]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isDragging) {
        handleMove(e.clientX);
      }
    },
    [isDragging, handleMove]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') setSliderPos((p) => Math.max(5, p - 5));
    if (e.key === 'ArrowRight') setSliderPos((p) => Math.min(95, p + 5));
  };

  return (
    <div
      className={`juxtaposition-container ${className}`}
      style={{
        borderRadius: 16,
        overflow: 'hidden',
        border: '1px solid var(--border-color)',
        background: '#ffffff',
        boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.06)',
      }}
    >
      {/* Visual Slider Canvas */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onTouchMove={handleTouchMove}
        style={{
          position: 'relative',
          width: '100%',
          height,
          aspectRatio,
          overflow: 'hidden',
          userSelect: 'none',
          cursor: 'ew-resize',
          backgroundColor: '#0f172a',
        }}
      >
        {/* Right Layer (Ground Reality - Background) */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${realityImageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Reality Label Pill (Right side) */}
          <div
            style={{
              position: 'absolute',
              top: 14,
              right: 14,
              background: 'rgba(185, 28, 28, 0.92)',
              color: '#ffffff',
              padding: '4px 10px',
              borderRadius: 8,
              fontSize: '0.72rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              backdropFilter: 'blur(6px)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
              zIndex: 5,
            }}
          >
            <AlertTriangle size={13} /> {realityTitle}
          </div>
        </div>

        {/* Left Layer (Official Claim - Clipped Foreground) */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${claimImageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)`,
          }}
        >
          {/* Claim Label Pill (Left side) */}
          <div
            style={{
              position: 'absolute',
              top: 14,
              left: 14,
              background: 'rgba(4, 120, 87, 0.92)',
              color: '#ffffff',
              padding: '4px 10px',
              borderRadius: 8,
              fontSize: '0.72rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              backdropFilter: 'blur(6px)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
              zIndex: 5,
            }}
          >
            <CheckCircle2 size={13} /> {claimTitle}
          </div>
        </div>

        {/* Divider Bar & Handle */}
        <div
          tabIndex={0}
          role="slider"
          aria-valuenow={sliderPos}
          aria-label="Juxtaposition Comparison Slider"
          onKeyDown={handleKeyDown}
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: `${sliderPos}%`,
            width: 3,
            background: '#ffffff',
            transform: 'translateX(-50%)',
            boxShadow: '0 0 10px rgba(0,0,0,0.4)',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            outline: 'none',
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              background: '#ffffff',
              color: 'var(--navy-900)',
              border: '2px solid var(--navy-900)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
              cursor: 'ew-resize',
            }}
          >
            <SlidersHorizontal size={16} />
          </div>
        </div>
      </div>

      {/* Narrative Footer comparing Claim vs Reality Details */}
      <div
        style={{
          padding: '1rem 1.25rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1rem',
          background: 'var(--bg-subtle)',
          borderTop: '1px solid var(--border-color)',
        }}
      >
        <div style={{ padding: '0.6rem 0.8rem', background: '#ffffff', borderRadius: 8, border: '1px solid #d1fae5' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--emerald-700)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.2rem' }}>
            <CheckCircle2 size={13} /> {claimTitle} ({claimDate})
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{claimDetails}</div>
        </div>

        <div style={{ padding: '0.6rem 0.8rem', background: '#ffffff', borderRadius: 8, border: '1px solid #fee2e2' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--crimson-700)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.2rem' }}>
            <AlertTriangle size={13} /> {realityTitle} ({realityDate})
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{realityDetails}</div>
        </div>
      </div>
    </div>
  );
}
