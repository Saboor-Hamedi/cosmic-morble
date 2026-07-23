import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useThemeStore } from '../theme/useThemeStore.js';
import * as THREE from 'three';

// ─── Single bubble with shimmer highlight + custom water shader ripple ──────
const BackgroundWaterBubbleItem = React.memo(function BackgroundWaterBubbleItem({ bubble }) {
  const meshRef = useRef();
  const highlightRef = useRef();
  const shaderRef = useRef();
  const theme = useThemeStore((s) => s.theme);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;

    // Float upward, wrap back to bottom when it leaves top
    meshRef.current.position.y += bubble.speed * delta;
    if (meshRef.current.position.y > 9.5) {
      meshRef.current.position.y = -6.0;
    }

    // Organic sinusoidal left-right + fwd-back water drift
    const swayX = Math.sin(t * bubble.swaySpeed + bubble.swayPhase) * bubble.swayAmount;
    const swayX2 = Math.sin(t * bubble.swaySpeed * 0.47 + bubble.swayPhase * 1.3) * bubble.swayAmount * 0.35;
    const swayZ = Math.cos(t * (bubble.swaySpeed * 0.7) + bubble.swayPhase) * (bubble.swayAmount * 0.45);
    meshRef.current.position.x = bubble.baseX + swayX + swayX2;
    meshRef.current.position.z = bubble.baseZ + swayZ;

    // Slow organic spin
    meshRef.current.rotation.y = t * 0.22 + bubble.swayPhase;
    meshRef.current.rotation.x = Math.sin(t * 0.38 + bubble.swayPhase) * 0.04;

    // Surface ripple shader
    if (shaderRef.current) {
      shaderRef.current.uniforms.uTime.value = t + bubble.id * 1.8;
    }

    // Shimmer highlight orbits opposite the bubble's Y position
    if (highlightRef.current) {
      highlightRef.current.position.set(
        bubble.radius * 0.34,
        bubble.radius * 0.38,
        bubble.radius * 0.72
      );
    }
  });

  const bubbleColor = bubble.color || theme.bubbleColor || '#38bdf8';

  return (
    <group position={[bubble.baseX, bubble.baseY, bubble.baseZ]}>
      {/* Main water bubble — physical glass/water material */}
      <mesh ref={meshRef} castShadow={false} receiveShadow={false}>
        <sphereGeometry args={[bubble.radius, 48, 48]} />
        <meshPhysicalMaterial
          color={bubbleColor}
          transmission={0.98}
          ior={1.2}
          roughness={0.05}
          metalness={0.1}
          thickness={bubble.radius * 3.0}
          clearcoat={1.0}
          clearcoatRoughness={0.05}
          reflectivity={1.0}
          iridescence={1.0}
          iridescenceIOR={1.3}
          iridescenceThicknessRange={[100, 400]}
          transparent
          opacity={0.9}
          depthWrite={false}
          onBeforeCompile={(shader) => {
            shader.uniforms.uTime = { value: 0 };
            shaderRef.current = shader;
            shader.vertexShader = `
              uniform float uTime;
              ${shader.vertexShader}
            `.replace(
              `#include <begin_vertex>`,
              `#include <begin_vertex>
              float ripple = sin(position.y * 7.0 + uTime * 2.1) * 0.012
                           + sin(position.x * 5.5 + uTime * 1.7) * 0.009
                           + cos(position.z * 6.0 + uTime * 2.4) * 0.008;
              transformed += normal * ripple;`
            );
          }}
        />
      </mesh>

      {/* Bright specular water highlight dot */}
      <mesh ref={highlightRef} position={[bubble.radius * 0.3, bubble.radius * 0.36, bubble.radius * 0.7]} castShadow={false} receiveShadow={false}>
        <sphereGeometry args={[bubble.radius * 0.18, 12, 12]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.72} depthWrite={false} />
      </mesh>
    </group>
  );
});

// ─── Seed generator — deterministic seeded pseudo-random for stable positions ─
function seededRand(seed) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export const FloatingBackgroundWaterBubbles3D = React.memo(function FloatingBackgroundWaterBubbles3D() {
  const ambientBubbles = useMemo(() => {
    const arr = [];
    const rand = seededRand(42);

    // Color palette: ice-blues, aquas, teals, white, faint purple for variety
    const colors = [
      '#38bdf8', '#7dd3fc', '#bae6fd', '#e0f2fe',
      '#ffffff', '#a5f3fc', '#67e8f9', '#06b6d4',
      '#cffafe', '#e0fbff', '#b2f5ea', '#ccfbf1'
    ];

    // Foreground layer (z = -3.5 to -5.5) — larger, closer, slower
    for (let i = 0; i < 18; i++) {
      arr.push({
        id: arr.length,
        baseX: (rand() - 0.5) * 30,
        baseY: -6.0 + rand() * 14,
        baseZ: -3.5 - rand() * 2.0,
        radius: 0.22 + rand() * 0.44,
        speed: 0.28 + rand() * 0.30,
        swaySpeed: 0.9 + rand() * 0.8,
        swayAmount: 0.22 + rand() * 0.28,
        swayPhase: rand() * Math.PI * 2,
        color: colors[Math.floor(rand() * colors.length)]
      });
    }

    // Mid layer (z = -5.5 to -8.5) — medium size, medium speed
    for (let i = 0; i < 28; i++) {
      arr.push({
        id: arr.length,
        baseX: (rand() - 0.5) * 32,
        baseY: -6.5 + rand() * 15,
        baseZ: -5.5 - rand() * 3.0,
        radius: 0.12 + rand() * 0.30,
        speed: 0.38 + rand() * 0.42,
        swaySpeed: 1.1 + rand() * 0.9,
        swayAmount: 0.18 + rand() * 0.32,
        swayPhase: rand() * Math.PI * 2,
        color: colors[Math.floor(rand() * colors.length)]
      });
    }

    // Deep background layer (z = -8.5 to -13) — small, fast, abundant
    for (let i = 0; i < 34; i++) {
      arr.push({
        id: arr.length,
        baseX: (rand() - 0.5) * 34,
        baseY: -7.0 + rand() * 16,
        baseZ: -8.5 - rand() * 4.5,
        radius: 0.06 + rand() * 0.18,
        speed: 0.50 + rand() * 0.55,
        swaySpeed: 1.3 + rand() * 1.1,
        swayAmount: 0.14 + rand() * 0.22,
        swayPhase: rand() * Math.PI * 2,
        color: colors[Math.floor(rand() * colors.length)]
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
