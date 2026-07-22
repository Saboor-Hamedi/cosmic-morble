import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSelectionStore } from '../game-state/useSelectionStore.js';
import { CircularParticleShader } from './CircularParticleShader.js';

export const InfiniteStarfield = React.memo(function InfiniteStarfield() {
  const pointsRef = useRef();
  const starCount = 5000;
  const boxSize = 400;
  const halfBox = boxSize / 2;

  const starMaterial = useMemo(() => new THREE.ShaderMaterial({
    ...CircularParticleShader,
    uniforms: {
      uOpacity: { value: 0.95 },
      uBaseSize: { value: 1.8 }
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  }), []);

  const { baseOffsets, colors, sizes } = useMemo(() => {
    const offsets = new Float32Array(starCount * 3);
    const col = new Float32Array(starCount * 3);
    const sz = new Float32Array(starCount);

    for (let i = 0; i < starCount; i++) {
      offsets[i * 3] = (Math.random() - 0.5) * boxSize;
      offsets[i * 3 + 1] = (Math.random() - 0.5) * boxSize;
      offsets[i * 3 + 2] = (Math.random() - 0.5) * boxSize;

      const randClass = Math.random();
      const c = new THREE.Color();
      if (randClass < 0.2) c.set('#b5d2ff');
      else if (randClass < 0.45) c.set('#e2edff');
      else if (randClass < 0.75) c.set('#ffffff');
      else if (randClass < 0.9) c.set('#ffeaad');
      else c.set('#ff8454');

      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;

      sz[i] = 1.2 + Math.random() * 3.5;
    }

    return { baseOffsets: offsets, colors: col, sizes: sz };
  }, []);

  const currentPositions = useMemo(() => new Float32Array(starCount * 3), []);

  useFrame(() => {
    if (!pointsRef.current) return;
    const posAttr = pointsRef.current.geometry.attributes.position;
    const posArr = posAttr.array;

    const shipPos = useSelectionStore.getState().shipPosition || [0, 0, 0];
    const px = shipPos[0];
    const py = shipPos[1];
    const pz = shipPos[2];

    for (let i = 0; i < starCount; i++) {
      let dx = (baseOffsets[i * 3] - px) % boxSize;
      if (dx > halfBox) dx -= boxSize;
      else if (dx < -halfBox) dx += boxSize;

      let dy = (baseOffsets[i * 3 + 1] - py) % boxSize;
      if (dy > halfBox) dy -= boxSize;
      else if (dy < -halfBox) dy += boxSize;

      let dz = (baseOffsets[i * 3 + 2] - pz) % boxSize;
      if (dz > halfBox) dz -= boxSize;
      else if (dz < -halfBox) dz += boxSize;

      posArr[i * 3] = px + dx;
      posArr[i * 3 + 1] = py + dy;
      posArr[i * 3 + 2] = pz + dz;
    }

    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} material={starMaterial}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[currentPositions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
    </points>
  );
});
