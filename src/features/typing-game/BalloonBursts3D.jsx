import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTypingGameStore } from './useTypingGameStore.js';
import * as THREE from 'three';

const SparklingBurstFireItem = React.memo(function SparklingBurstFireItem({ burst }) {
  const groupRef = useRef();
  const ringRef = useRef();
  
  // 16 dazzling fire/sparkle water particles that explode outward and catch the eye clearly
  const particles = useMemo(() => {
    const parts = [];
    const colors = ['#ffffff', burst.color || '#38bdf8', '#ffff00', '#60a5fa', '#facc15'];
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2;
      const elevation = (Math.random() - 0.3) * Math.PI * 0.8;
      const speed = 3.5 + Math.random() * 3.0;
      const vx = Math.cos(angle) * Math.cos(elevation) * speed;
      const vy = Math.sin(elevation) * speed + 1.2; // slight upward lift
      const vz = Math.sin(angle) * Math.cos(elevation) * speed;
      const scale = 0.16 + Math.random() * 0.12; // large enough (~15-20px) to be clearly seen!
      const color = colors[i % colors.length];
      parts.push({ vx, vy, vz, scale, color });
    }
    return parts;
  }, [burst.color]);

  useFrame(() => {
    if (!groupRef.current) return;
    const elapsed = Date.now() - burst.timestamp;
    const progress = Math.min(1.0, elapsed / 650);

    // Gently scale down over 650ms
    const scale = Math.max(0.01, 1.0 - progress * 0.8);
    groupRef.current.scale.set(scale, scale, scale);

    // Expand the outer glowing shockwave ring
    if (ringRef.current) {
      const ringScale = 1.0 + progress * 2.2;
      ringRef.current.scale.set(ringScale, ringScale, ringScale);
      ringRef.current.material.opacity = Math.max(0, (1.0 - progress) * 0.9);
    }
  });

  return (
    <group ref={groupRef} position={burst.position} renderOrder={50}>
      {/* 1. Expanding Glowing Shockwave Ring (`burst fire` splash ring) */}
      <mesh ref={ringRef} renderOrder={50}>
        <torusGeometry args={[0.65, 0.08, 16, 32]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive={burst.color || '#38bdf8'}
          emissiveIntensity={1.5}
          roughness={0.1}
          transparent
          opacity={0.9}
          depthWrite={false}
        />
      </mesh>

      {/* 2. 16 Sparkling Burst Fire / Splash Particles */}
      {particles.map((part, idx) => {
        const elapsedSec = (Date.now() - burst.timestamp) / 1000;
        const x = part.vx * elapsedSec;
        const y = part.vy * elapsedSec - 2.8 * elapsedSec * elapsedSec; // gravity curve
        const z = part.vz * elapsedSec;
        const progress = Math.min(1.0, (Date.now() - burst.timestamp) / 650);
        const particleOpacity = Math.max(0, 1.0 - progress);

        return (
          <mesh key={idx} position={[x, y, z]} renderOrder={51}>
            <sphereGeometry args={[part.scale, 16, 16]} />
            <meshStandardMaterial
              color={part.color}
              emissive={part.color}
              emissiveIntensity={1.8}
              roughness={0.1}
              transparent
              opacity={particleOpacity}
              depthWrite={false}
            />
          </mesh>
        );
      })}
    </group>
  );
});

export const BalloonBursts3D = React.memo(function BalloonBursts3D() {
  const { bursts, updateBursts } = useTypingGameStore();

  useFrame(() => {
    if (typeof updateBursts === 'function') {
      updateBursts();
    }
  });

  return (
    <group>
      {bursts.map((burst) => (
        <SparklingBurstFireItem key={burst.id} burst={burst} />
      ))}
    </group>
  );
});
