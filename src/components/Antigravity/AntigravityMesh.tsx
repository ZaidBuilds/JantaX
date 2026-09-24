/* eslint-disable react/no-unknown-property */
import { useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { ANTIGRAVITY_DEFAULTS, type AntigravityProps } from './Antigravity.types';
import { useAntigravityParticles } from './useAntigravityParticles';
import { runAntigravityFrame } from './antigravityFrame';

/** Inner scene: instanced particles animated toward a magnetic ring. */
export function AntigravityMesh(props: AntigravityProps) {
  const s = { ...ANTIGRAVITY_DEFAULTS, ...props };
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const { viewport } = useThree();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const lastMousePos = useRef({ x: 0, y: 0 });
  const lastMouseMoveTime = useRef({ value: 0 });
  const virtualMouse = useRef({ x: 0, y: 0 });

  const particles = useAntigravityParticles(s.count, viewport.width, viewport.height);

  useFrame((state) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    runAntigravityFrame(
      {
        mesh,
        dummy,
        particles,
        lastMousePos: lastMousePos.current,
        lastMouseMoveTime: lastMouseMoveTime.current,
        virtualMouse: virtualMouse.current,
      },
      s,
      {
        viewport: { width: state.viewport.width, height: state.viewport.height },
        pointer: { x: state.pointer.x, y: state.pointer.y },
        elapsed: state.clock.getElapsedTime(),
      }
    );
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, s.count]}>
      {s.particleShape === 'capsule' && <capsuleGeometry args={[0.1, 0.4, 4, 8]} />}
      {s.particleShape === 'sphere' && <sphereGeometry args={[0.2, 16, 16]} />}
      {s.particleShape === 'box' && <boxGeometry args={[0.3, 0.3, 0.3]} />}
      {s.particleShape === 'tetrahedron' && <tetrahedronGeometry args={[0.3]} />}
      <meshBasicMaterial color={s.color} />
    </instancedMesh>
  );
}
