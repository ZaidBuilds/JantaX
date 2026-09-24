import { useEffect, useState } from 'react';
import Antigravity from './Antigravity';

/**
 * Absolutely-positioned, non-interactive Antigravity layer for the hero.
 * Skips rendering when the user prefers reduced motion.
 */
export default function HeroBackground() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setEnabled(!mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  if (!enabled) return null;

  return (
    <div className="hero-antigravity" aria-hidden="true">
      <Antigravity
        count={300}
        magnetRadius={6}
        ringRadius={7}
        waveSpeed={0.4}
        waveAmplitude={1}
        particleSize={1.5}
        lerpSpeed={0.05}
        color="#2563EB"
        autoAnimate
        particleVariance={1}
      />
    </div>
  );
}
