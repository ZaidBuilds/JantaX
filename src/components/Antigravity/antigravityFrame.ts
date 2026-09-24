import * as THREE from 'three';
import type { Particle } from './Antigravity.types';

export interface FrameContext {
  mesh: THREE.InstancedMesh;
  dummy: THREE.Object3D;
  particles: Particle[];
  lastMousePos: { x: number; y: number };
  lastMouseMoveTime: { value: number };
  virtualMouse: { x: number; y: number };
}

export interface FrameSettings {
  autoAnimate: boolean;
  magnetRadius: number;
  ringRadius: number;
  waveSpeed: number;
  waveAmplitude: number;
  particleSize: number;
  lerpSpeed: number;
  particleVariance: number;
  rotationSpeed: number;
  depthFactor: number;
  pulseSpeed: number;
  fieldStrength: number;
}

interface FrameState {
  viewport: { width: number; height: number };
  pointer: { x: number; y: number };
  elapsed: number;
}

/** Advances every particle toward the magnetic ring for one frame. */
export function runAntigravityFrame(ctx: FrameContext, s: FrameSettings, st: FrameState): void {
  const { mesh, dummy, particles, lastMousePos, lastMouseMoveTime, virtualMouse } = ctx;
  const { width: vw, height: vh } = st.viewport;
  const m = st.pointer;

  const moved = Math.hypot(m.x - lastMousePos.x, m.y - lastMousePos.y);
  if (moved > 0.001) {
    lastMouseMoveTime.value = Date.now();
    lastMousePos.x = m.x;
    lastMousePos.y = m.y;
  }

  let destX = (m.x * vw) / 2;
  let destY = (m.y * vh) / 2;
  if (s.autoAnimate && Date.now() - lastMouseMoveTime.value > 2000) {
    destX = Math.sin(st.elapsed * 0.5) * (vw / 4);
    destY = Math.cos(st.elapsed * 0.5 * 2) * (vh / 4);
  }

  const smooth = 0.05;
  virtualMouse.x += (destX - virtualMouse.x) * smooth;
  virtualMouse.y += (destY - virtualMouse.y) * smooth;
  const targetX = virtualMouse.x;
  const targetY = virtualMouse.y;
  const globalRotation = st.elapsed * s.rotationSpeed;

  particles.forEach((p, i) => {
    p.t += p.speed / 2;
    const t = p.t;
    const projectionFactor = 1 - p.cz / 50;
    const ptX = targetX * projectionFactor;
    const ptY = targetY * projectionFactor;
    const dist = Math.hypot(p.mx - ptX, p.my - ptY);

    const target = { x: p.mx, y: p.my, z: p.mz * s.depthFactor };
    if (dist < s.magnetRadius) {
      const angle = Math.atan2(p.my - ptY, p.mx - ptX) + globalRotation;
      const wave = Math.sin(t * s.waveSpeed + angle) * (0.5 * s.waveAmplitude);
      const deviation = p.randomRadiusOffset * (5 / (s.fieldStrength + 0.1));
      const r = s.ringRadius + wave + deviation;
      target.x = ptX + r * Math.cos(angle);
      target.y = ptY + r * Math.sin(angle);
      target.z = p.mz * s.depthFactor + Math.sin(t) * (s.waveAmplitude * s.depthFactor);
    }

    p.cx += (target.x - p.cx) * s.lerpSpeed;
    p.cy += (target.y - p.cy) * s.lerpSpeed;
    p.cz += (target.z - p.cz) * s.lerpSpeed;

    dummy.position.set(p.cx, p.cy, p.cz);
    dummy.lookAt(ptX, ptY, p.cz);
    dummy.rotateX(Math.PI / 2);

    const distToMouse = Math.hypot(p.cx - ptX, p.cy - ptY);
    const scale = Math.max(0, Math.min(1, 1 - Math.abs(distToMouse - s.ringRadius) / 10));
    const finalScale = scale * (0.8 + Math.sin(t * s.pulseSpeed) * 0.2 * s.particleVariance) * s.particleSize;
    dummy.scale.set(finalScale, finalScale, finalScale);
    dummy.updateMatrix();
    mesh.setMatrixAt(i, dummy.matrix);
  });

  mesh.instanceMatrix.needsUpdate = true;
}
