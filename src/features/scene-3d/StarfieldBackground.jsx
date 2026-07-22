import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Stars } from '@react-three/drei';

export const StarfieldBackground = React.memo(function StarfieldBackground() {
  const customStarsRef = useRef();

  const [positions, sizes] = useMemo(() => {
    const count = 500;
    const pos = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 80;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 80;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 80;
      sz[i] = Math.random() * 0.12 + 0.03;
    }
    return [pos, sz];
  }, []);

  useFrame((state, delta) => {
    if (customStarsRef.current) {
      customStarsRef.current.rotation.y += delta * 0.015;
      customStarsRef.current.rotation.x += delta * 0.005;
    }
  });

  return (
    <group>
      <Stars radius={100} depth={50} count={2500} factor={4} saturation={0} fade speed={1} />
      <points ref={customStarsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
        </bufferGeometry>
        <pointsMaterial color="#a0d8ff" size={0.1} transparent opacity={0.6} />
      </points>
    </group>
  );
});
