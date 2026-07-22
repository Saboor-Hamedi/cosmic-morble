import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSelectionStore } from '../game-state/useSelectionStore.js';
import { CircularParticleShader } from './CircularParticleShader.js';

export const InfiniteGalaxies = React.memo(function InfiniteGalaxies() {
  const galaxyGroupRef = useRef();
  const spiralPointsRef = useRef();
  const cloudGroupRef = useRef();

  const galaxyCount = 1800;
  const boxSize = 500;
  const halfBox = boxSize / 2;

  const galaxyMaterial = useMemo(() => new THREE.ShaderMaterial({
    ...CircularParticleShader,
    uniforms: {
      uOpacity: { value: 0.88 },
      uBaseSize: { value: 2.6 }
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  }), []);

  const { baseOffsets, colors, sizes } = useMemo(() => {
    const offsets = new Float32Array(galaxyCount * 3);
    const col = new Float32Array(galaxyCount * 3);
    const sz = new Float32Array(galaxyCount);

    for (let i = 0; i < galaxyCount; i++) {
      const cluster = i % 4;
      const clusterCenter = cluster === 0
        ? [120, 60, -180]
        : cluster === 1
        ? [-160, -80, -220]
        : cluster === 2
        ? [200, -120, 160]
        : [-240, 140, 240];

      const armIndex = i % 3;
      const armAngle = (armIndex * Math.PI * 2) / 3;
      const radius = Math.pow(Math.random(), 1.5) * 55;
      const spiralAngle = radius * 0.18 + armAngle;
      const spread = (Math.random() - 0.5) * (8 + radius * 0.25);

      offsets[i * 3] = clusterCenter[0] + Math.cos(spiralAngle) * radius + spread;
      offsets[i * 3 + 1] = clusterCenter[1] + (Math.random() - 0.5) * (12 + radius * 0.12);
      offsets[i * 3 + 2] = clusterCenter[2] + Math.sin(spiralAngle) * radius + spread;

      const c = new THREE.Color();
      if (cluster === 0) {
        c.setHSL(0.52 + Math.random() * 0.08, 0.9, 0.6 + Math.random() * 0.4);
      } else if (cluster === 1) {
        c.setHSL(0.82 + Math.random() * 0.08, 0.95, 0.65);
      } else if (cluster === 2) {
        c.setHSL(0.1 + Math.random() * 0.06, 0.95, 0.65);
      } else {
        c.setHSL(Math.random(), 0.85, 0.7);
      }

      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;

      sz[i] = 1.8 + Math.random() * 4.0;
    }

    return { baseOffsets: offsets, colors: col, sizes: sz };
  }, []);

  const currentPositions = useMemo(() => new Float32Array(galaxyCount * 3), []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (galaxyGroupRef.current) {
      galaxyGroupRef.current.rotation.y += delta * 0.008;
    }
    if (cloudGroupRef.current) {
      cloudGroupRef.current.rotation.z += delta * 0.005;
    }

    if (!spiralPointsRef.current) return;
    const posAttr = spiralPointsRef.current.geometry.attributes.position;
    const posArr = posAttr.array;

    const shipPos = useSelectionStore.getState().shipPosition || [0, 0, 0];
    const px = shipPos[0];
    const py = shipPos[1];
    const pz = shipPos[2];

    for (let i = 0; i < galaxyCount; i++) {
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

  const getWrappedPos = (baseX, baseY, baseZ) => {
    const shipPos = useSelectionStore.getState().shipPosition || [0, 0, 0];
    const px = shipPos[0];
    const py = shipPos[1];
    const pz = shipPos[2];

    let dx = (baseX - px) % boxSize;
    if (dx > halfBox) dx -= boxSize;
    else if (dx < -halfBox) dx += boxSize;

    let dy = (baseY - py) % boxSize;
    if (dy > halfBox) dy -= boxSize;
    else if (dy < -halfBox) dy += boxSize;

    let dz = (baseZ - pz) % boxSize;
    if (dz > halfBox) dz -= boxSize;
    else if (dz < -halfBox) dz += boxSize;

    return [px + dx, py + dy, pz + dz];
  };

  return (
    <group ref={galaxyGroupRef}>
      <points ref={spiralPointsRef} material={galaxyMaterial}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[currentPositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
          <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
        </bufferGeometry>
      </points>

      <group ref={cloudGroupRef}>
        <mesh position={getWrappedPos(120, 60, -180)}>
          <sphereGeometry args={[45, 32, 32]} />
          <meshBasicMaterial color="#00ffff" transparent opacity={0.12} blending={THREE.AdditiveBlending} side={THREE.BackSide} />
        </mesh>
        <mesh position={getWrappedPos(-160, -80, -220)}>
          <sphereGeometry args={[55, 32, 32]} />
          <meshBasicMaterial color="#ff007f" transparent opacity={0.14} blending={THREE.AdditiveBlending} side={THREE.BackSide} />
        </mesh>
        <mesh position={getWrappedPos(200, -120, 160)}>
          <sphereGeometry args={[50, 32, 32]} />
          <meshBasicMaterial color="#ffaa00" transparent opacity={0.11} blending={THREE.AdditiveBlending} side={THREE.BackSide} />
        </mesh>
        <mesh position={getWrappedPos(-240, 140, 240)}>
          <sphereGeometry args={[48, 32, 32]} />
          <meshBasicMaterial color="#0066ff" transparent opacity={0.13} blending={THREE.AdditiveBlending} side={THREE.BackSide} />
        </mesh>
      </group>
    </group>
  );
});
