import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTypingGameStore } from '../typing-game/useTypingGameStore.js';
import * as THREE from 'three';

export const CosmicBuddy3D = React.memo(function CosmicBuddy3D() {
  const groupRef = useRef();
  const visorRef = useRef();
  const leftHandRef = useRef();
  const rightHandRef = useRef();

  const { streak, activePowerUp, isPaused } = useTypingGameStore();

  const visorColor = useMemo(() => {
    if (activePowerUp === 'rainbow') return '#ff00ff';
    if (activePowerUp === 'freeze') return '#00f0ff';
    if (activePowerUp === 'starburst') return '#ffaa00';
    if (streak >= 5) return '#facc15';
    if (streak >= 3) return '#4ade80';
    return '#38bdf8';
  }, [activePowerUp, streak]);

  useFrame((state, delta) => {
    if (!groupRef.current || isPaused) return;
    const t = state.clock.elapsedTime;

    // Gentle floating idle animation
    groupRef.current.position.y = 2.8 + Math.sin(t * 2.4) * 0.22;
    groupRef.current.position.x = -6.4 + Math.cos(t * 1.5) * 0.12;

    // Happy spinning animation during high streaks (`if streak >= 3 buddy spins happily`)
    if (streak >= 3) {
      groupRef.current.rotation.y += delta * (streak >= 5 ? 7.5 : 4.5);
    } else {
      groupRef.current.rotation.y = Math.sin(t * 1.8) * 0.25;
    }

    // Floating hands wiggling
    if (leftHandRef.current && rightHandRef.current) {
      leftHandRef.current.position.y = -0.15 + Math.sin(t * 4.0) * 0.08;
      rightHandRef.current.position.y = -0.15 + Math.cos(t * 4.0) * 0.08;
    }
  });

  return (
    <group ref={groupRef} position={[-6.4, 2.8, -2.5]} scale={[0.85, 0.85, 0.85]} raycast={() => null}>
      {/* Buddy Head (Smooth white sphere) */}
      <mesh position={[0, 0.35, 0]} castShadow={false} receiveShadow={false}>
        <sphereGeometry args={[0.48, 32, 32]} />
        <meshStandardMaterial color="#ffffff" roughness={0.3} metalness={0.1} />
      </mesh>

      {/* Glowing Cyber Visor (`changes color based on streak and active superpower`) */}
      <mesh ref={visorRef} position={[0, 0.38, 0.38]} rotation={[0, 0, 0]} castShadow={false} receiveShadow={false}>
        <boxGeometry args={[0.56, 0.24, 0.18]} />
        <meshStandardMaterial
          color={visorColor}
          emissive={visorColor}
          emissiveIntensity={1.2}
          roughness={0.1}
        />
      </mesh>

      {/* Cute Little Antenna on top of head */}
      <mesh position={[0, 0.9, 0]} castShadow={false} receiveShadow={false}>
        <cylinderGeometry args={[0.025, 0.025, 0.25, 12]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>
      <mesh position={[0, 1.05, 0]} castShadow={false} receiveShadow={false}>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshStandardMaterial color={visorColor} emissive={visorColor} emissiveIntensity={1.0} />
      </mesh>

      {/* Rounded Space Suit Body */}
      <mesh position={[0, -0.2, 0]} castShadow={false} receiveShadow={false}>
        <cylinderGeometry args={[0.36, 0.44, 0.72, 24]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.4} metalness={0.05} />
      </mesh>

      {/* Floating Hands */}
      <mesh ref={leftHandRef} position={[-0.58, -0.15, 0.1]} castShadow={false} receiveShadow={false}>
        <sphereGeometry args={[0.16, 16, 16]} />
        <meshStandardMaterial color={visorColor} emissive={visorColor} emissiveIntensity={0.6} />
      </mesh>
      <mesh ref={rightHandRef} position={[0.58, -0.15, 0.1]} castShadow={false} receiveShadow={false}>
        <sphereGeometry args={[0.16, 16, 16]} />
        <meshStandardMaterial color={visorColor} emissive={visorColor} emissiveIntensity={0.6} />
      </mesh>
    </group>
  );
});
