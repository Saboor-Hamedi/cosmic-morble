import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../game-state/useGameStore.js';

export const SpeedStreaks = React.memo(function SpeedStreaks() {
  const { speed } = useGameStore();
  const linesRef = useRef();
  const streakCount = 380;

  const { positions, colors } = useMemo(() => {
    // LineSegments require 2 vertices (start & end) per streak
    const pos = new Float32Array(streakCount * 2 * 3);
    const col = new Float32Array(streakCount * 2 * 3);

    for (let i = 0; i < streakCount; i++) {
      const x = (Math.random() - 0.5) * 60;
      const y = (Math.random() - 0.5) * 45;
      const z = -60 + Math.random() * 75;
      const length = 1.0 + Math.random() * 2.5;

      // Start vertex
      pos[i * 6] = x;
      pos[i * 6 + 1] = y;
      pos[i * 6 + 2] = z;

      // End vertex (stretched along Z)
      pos[i * 6 + 3] = x;
      pos[i * 6 + 4] = y;
      pos[i * 6 + 5] = z - length;

      // Color mix between cyan (#00f0ff) and white (#ffffff)
      const isCyan = Math.random() > 0.3;
      const r = isCyan ? 0.0 : 1.0;
      const g = isCyan ? 0.94 : 1.0;
      const b = 1.0;

      col[i * 6] = r;
      col[i * 6 + 1] = g;
      col[i * 6 + 2] = b;
      col[i * 6 + 3] = r * 0.3;
      col[i * 6 + 4] = g * 0.3;
      col[i * 6 + 5] = b * 0.3;
    }

    return { positions: pos, colors: col };
  }, []);

  useFrame((state, delta) => {
    if (!linesRef.current) return;
    const material = linesRef.current.material;
    const posAttr = linesRef.current.geometry.attributes.position;
    const posArr = posAttr.array;

    // Fade in and lengthen streaks when speed > 3.0
    const intensity = Math.max(0, (speed - 2.5) / 9.5);
    material.opacity = intensity * 0.85;
    linesRef.current.visible = intensity > 0.02;

    if (!linesRef.current.visible) return;

    const streakVelocity = speed * 5.5;
    const stretchFactor = 1.0 + speed * 0.4;

    for (let i = 0; i < streakCount; i++) {
      // Move both start and end vertices toward the camera (+Z)
      posArr[i * 6 + 2] += streakVelocity * delta;
      posArr[i * 6 + 5] = posArr[i * 6 + 2] - stretchFactor;

      // Recycle when past camera
      if (posArr[i * 6 + 2] > 12) {
        const x = (Math.random() - 0.5) * 60;
        const y = (Math.random() - 0.5) * 45;
        const z = -65 - Math.random() * 20;

        posArr[i * 6] = x;
        posArr[i * 6 + 1] = y;
        posArr[i * 6 + 2] = z;
        posArr[i * 6 + 3] = x;
        posArr[i * 6 + 4] = y;
        posArr[i * 6 + 5] = z - stretchFactor;
      }
    }
    posAttr.needsUpdate = true;
  });

  return (
    <lineSegments ref={linesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <lineBasicMaterial
        vertexColors={true}
        transparent={true}
        opacity={0}
        blending={THREE.AdditiveBlending}
      />
    </lineSegments>
  );
});
