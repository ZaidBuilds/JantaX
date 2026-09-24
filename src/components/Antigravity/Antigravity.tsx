import { Canvas } from '@react-three/fiber';
import type { AntigravityProps } from './Antigravity.types';
import { AntigravityMesh } from './AntigravityMesh';

/** Interactive magnetic-ring particle field (React Bits). */
export default function Antigravity(props: AntigravityProps) {
  return (
    <Canvas camera={{ position: [0, 0, 50], fov: 35 }}>
      <AntigravityMesh {...props} />
    </Canvas>
  );
}

export type { AntigravityProps };
