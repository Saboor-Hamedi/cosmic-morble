import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';

const FluffyCloud3D = React.memo(function FluffyCloud3D({ position, scale = 1, speed = 0.4 }) {
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    groupRef.current.position.x += speed * delta;
    if (groupRef.current.position.x > 12) {
      groupRef.current.position.x = -12;
    }
    const t = state.clock.elapsedTime;
    groupRef.current.position.y = position[1] + Math.sin(t * 1.5 + position[0]) * 0.2;
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.8, 24, 24]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.8} />
      </mesh>
      <mesh position={[-0.6, -0.15, 0]}>
        <sphereGeometry args={[0.65, 24, 24]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.8} />
      </mesh>
      <mesh position={[0.6, -0.15, 0]}>
        <sphereGeometry args={[0.65, 24, 24]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.8} />
      </mesh>
    </group>
  );
});

const FloatingGemStar = React.memo(function FloatingGemStar({ position, color = '#ffd700', scale = 0.35 }) {
  const meshRef = useRef();

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += delta * 1.2;
    meshRef.current.rotation.z += delta * 0.8;
    const t = state.clock.elapsedTime;
    meshRef.current.position.y = position[1] + Math.sin(t * 2.5 + position[0]) * 0.15;
  });

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <octahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color={color}
        roughness={0.4}
        metalness={0.3}
      />
    </mesh>
  );
});

export const KidsPlaygroundScene = React.memo(function KidsPlaygroundScene() {
  const clouds = useMemo(() => [
    { pos: [-6, 3.8, -4], scale: 1.1, speed: 0.35 },
    { pos: [5, 4.5, -5], scale: 1.3, speed: -0.28 },
    { pos: [-2, 5.2, -4.5], scale: 0.9, speed: 0.42 },
    { pos: [7, 2.8, -3.5], scale: 1.0, speed: -0.32 }
  ], []);

  const gems = useMemo(() => [
    { pos: [-5, 2.2, -2.5], color: '#ff007f', scale: 0.4 },
    { pos: [5.2, 1.8, -2], color: '#00ff88', scale: 0.35 },
    { pos: [-4.2, -0.5, -2], color: '#00f0ff', scale: 0.38 },
    { pos: [4.5, -0.2, -2.2], color: '#ffd700', scale: 0.42 },
    { pos: [0, 3.5, -3.8], color: '#b026ff', scale: 0.45 }
  ], []);

  return (
    <group>
      {clouds.map((cl, idx) => (
        <FluffyCloud3D key={idx} position={cl.pos} scale={cl.scale} speed={cl.speed} />
      ))}

      {gems.map((g, idx) => (
        <FloatingGemStar key={idx} position={g.pos} color={g.color} scale={g.scale} />
      ))}

      {/* Subtle colorful border rings under keyboard */}
      <group position={[0, -5.8, -1.8]} rotation={[-0.45, 0, 0]}>
        <mesh position={[0, -0.35, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[6.8, 0.12, 16, 64]} />
          <meshStandardMaterial color="#ff007f" roughness={0.5} />
        </mesh>
        <mesh position={[0, -0.48, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[7.2, 0.12, 16, 64]} />
          <meshStandardMaterial color="#00f0ff" roughness={0.5} />
        </mesh>
        <mesh position={[0, -0.6, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[7.6, 0.12, 16, 64]} />
          <meshStandardMaterial color="#ffd700" roughness={0.5} />
        </mesh>
      </group>
    </group>
  );
});
