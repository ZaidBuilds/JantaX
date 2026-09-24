import { useMemo } from 'react';
import type { Particle } from './Antigravity.types';

/** Builds the initial particle field, spread across the current viewport. */
export function useAntigravityParticles(
  count: number,
  viewportWidth: number,
  viewportHeight: number
): Particle[] {
  return useMemo(() => {
    const temp: Particle[] = [];
    const width = viewportWidth || 100;
    const height = viewportHeight || 100;

    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100;
      const factor = 20 + Math.random() * 100;
      const speed = 0.01 + Math.random() / 200;
      const xFactor = -50 + Math.random() * 100;
      const yFactor = -50 + Math.random() * 100;
      const zFactor = -50 + Math.random() * 100;

      const x = (Math.random() - 0.5) * width;
      const y = (Math.random() - 0.5) * height;
      const z = (Math.random() - 0.5) * 20;

      const randomRadiusOffset = (Math.random() - 0.5) * 2;

      temp.push({
        t,
        factor,
        speed,
        xFactor,
        yFactor,
        zFactor,
        mx: x,
        my: y,
        mz: z,
        cx: x,
        cy: y,
        cz: z,
        vx: 0,
        vy: 0,
        vz: 0,
        randomRadiusOffset,
      });
    }
    return temp;
  }, [count, viewportWidth, viewportHeight]);
}
