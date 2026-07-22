import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { playHoverSound } from '../audio/SoundSynthesizer.js';
import { useThemeStore } from '../theme/useThemeStore.js';
import * as THREE from 'three';

const InteractiveCloudCluster = React.memo(function InteractiveCloudCluster({ cloud }) {
  const groupRef = useRef();
  const [puffScale, setPuffScale] = useState(1);
  const [hovered, setHovered] = useState(false);
  const theme = useThemeStore((s) => s.theme);

  const puffs = useMemo(() => {
    return [
      { type: 'sphere', pos: [-0.48, 0, 0], args: [0.42, 24, 24] },
      { type: 'sphere', pos: [0, 0.16, 0], args: [0.55, 24, 24] },
      { type: 'sphere', pos: [0.48, 0, 0], args: [0.4, 24, 24] },
      { type: 'cylinder', pos: [0, -0.12, 0], args: [0.38, 0.38, 0.96, 20], rot: [0, 0, Math.PI / 2] }
    ];
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    groupRef.current.position.x += cloud.speed * delta;
    if (groupRef.current.position.x > 12) {
      groupRef.current.position.x = -12;
    }

    const targetScale = cloud.scale * (hovered ? 1.12 : puffScale);
    groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 12);
  });

  return (
    <group
      ref={groupRef}
      position={cloud.position}
      scale={cloud.scale}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
      onClick={(e) => {
        e.stopPropagation();
        setPuffScale(1.25);
        playHoverSound();
        setTimeout(() => setPuffScale(1.0), 220);
      }}
    >
      {puffs.map((puff, idx) => (
        <mesh key={idx} position={puff.pos} rotation={puff.rot || [0, 0, 0]}>
          {puff.type === 'sphere' ? (
            <sphereGeometry args={puff.args} />
          ) : (
            <cylinderGeometry args={puff.args} />
          )}
          <meshStandardMaterial
            color="#ffffff"
            roughness={0.9}
            metalness={0.02}
            emissive={hovered ? '#e0f2fe' : '#ffffff'}
            emissiveIntensity={hovered ? 0.35 : 0.08}
          />
        </mesh>
      ))}

      {hovered && (
        <group position={[0, -0.4, 0]}>
          <mesh position={[-0.3, -0.1, 0.2]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.8} />
          </mesh>
          <mesh position={[0.3, -0.2, 0.1]}>
            <sphereGeometry args={[0.035, 8, 8]} />
            <meshStandardMaterial color="#60a5fa" emissive="#60a5fa" emissiveIntensity={0.8} />
          </mesh>
        </group>
      )}
    </group>
  );
});

export const FluffyClouds3D = React.memo(function FluffyClouds3D() {
  const clouds = useMemo(() => {
    return [
      // Far Left Cluster
      { id: 1, position: [-10.5, 6.4, -4.5], speed: 0.24, scale: 0.95 },
      { id: 2, position: [-8.8, 5.2, -4.8], speed: 0.18, scale: 0.88 },
      { id: 3, position: [-7.2, 6.6, -5.2], speed: 0.28, scale: 1.05 },
      { id: 4, position: [-5.8, 5.6, -4.6], speed: 0.22, scale: 0.92 },
      { id: 5, position: [-4.4, 6.2, -5.0], speed: 0.3, scale: 0.85 },

      // Center Cluster
      { id: 6, position: [-2.8, 5.4, -4.7], speed: 0.2, scale: 0.98 },
      { id: 7, position: [-1.2, 6.5, -5.1], speed: 0.26, scale: 1.1 },
      { id: 8, position: [0.5, 5.1, -4.6], speed: 0.21, scale: 0.86 },
      { id: 9, position: [2.2, 6.3, -4.9], speed: 0.27, scale: 0.94 },
      { id: 10, position: [3.8, 5.5, -5.2], speed: 0.23, scale: 0.89 },

      // Far Right Cluster
      { id: 11, position: [5.4, 6.6, -4.5], speed: 0.29, scale: 1.02 },
      { id: 12, position: [7.0, 5.3, -4.8], speed: 0.19, scale: 0.88 },
      { id: 13, position: [8.6, 6.4, -5.1], speed: 0.25, scale: 0.96 },
      { id: 14, position: [10.2, 5.6, -4.7], speed: 0.22, scale: 0.84 },
      { id: 15, position: [11.6, 6.2, -5.0], speed: 0.28, scale: 0.92 }
    ];
  }, []);

  return (
    <group>
      {clouds.map((c) => (
        <InteractiveCloudCluster key={c.id} cloud={c} />
      ))}
    </group>
  );
});
