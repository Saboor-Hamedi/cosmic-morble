import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useThemeStore } from '../theme/useThemeStore.js';
import * as THREE from 'three';

const BackgroundWaterBubbleItem = React.memo(function BackgroundWaterBubbleItem({ bubble }) {
  const meshRef = useRef();
  const theme = useThemeStore((s) => s.theme);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;

    // Gently float upward continuously through the deep background
    meshRef.current.position.y += bubble.speed * delta;
    if (meshRef.current.position.y > 8.5) {
      meshRef.current.position.y = -5.5;
    }

    // Natural physical water bubble sway
    const swayX = Math.sin(t * bubble.swaySpeed + bubble.swayPhase) * bubble.swayAmount;
    const swayZ = Math.cos(t * (bubble.swaySpeed * 0.8) + bubble.swayPhase) * (bubble.swayAmount * 0.5);
    meshRef.current.position.x = bubble.baseX + swayX;
    meshRef.current.position.z = bubble.baseZ + swayZ;

    meshRef.current.rotation.y = t * 0.3 + bubble.id;
  });

  const bubbleColor = bubble.color || theme.bubbleColor || '#38bdf8';

  return (
    <group position={[bubble.baseX, bubble.baseY, bubble.baseZ]}>
      {/* Real physical liquid water bubble (`high transmission, ior 1.333, clearcoat 1.0, zero shadow`) */}
      <mesh ref={meshRef} castShadow={false} receiveShadow={false}>
        <sphereGeometry args={[bubble.radius, 32, 32]} />
        <meshPhysicalMaterial
          color={bubbleColor}
          transmission={0.92}
          ior={1.333}
          roughness={0.03}
          metalness={0.04}
          thickness={1.5}
          clearcoat={1.0}
          clearcoatRoughness={0.02}
          transparent
          opacity={0.78}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
});

export const FloatingBackgroundWaterBubbles3D = React.memo(function FloatingBackgroundWaterBubbles3D() {
  const ambientBubbles = useMemo(() => {
    const arr = [];
    const colors = ['#38bdf8', '#7dd3fc', '#bae6fd', '#e0f2fe', '#ffffff', '#a5f3fc'];
    for (let i = 0; i < 24; i++) {
      arr.push({
        id: i,
        baseX: (Math.random() - 0.5) * 28, // Spread wide across the background horizon
        baseY: -5.0 + Math.random() * 12,  // Spread across different vertical starting heights
        baseZ: -4.5 - Math.random() * 6.5, // Deep behind the typing area (`z = -4.5 to -11`)
        radius: 0.14 + Math.random() * 0.32,
        speed: 0.35 + Math.random() * 0.45,
        swaySpeed: 1.1 + Math.random() * 0.9,
        swayAmount: 0.2 + Math.random() * 0.35,
        swayPhase: Math.random() * Math.PI * 2,
        color: colors[i % colors.length]
      });
    }
    return arr;
  }, []);

  return (
    <group>
      {ambientBubbles.map((b) => (
        <BackgroundWaterBubbleItem key={b.id} bubble={b} />
      ))}
    </group>
  );
});
