import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTypingGameStore } from '../typing-game/useTypingGameStore.js';
import * as THREE from 'three';

const CLOUD_DESIGNS = {
  cumulus: [
    { type: 'sphere', pos: [0, 0.2, 0], args: [0.65, 24, 24] },
    { type: 'sphere', pos: [-0.55, 0.05, 0.1], args: [0.48, 24, 24] },
    { type: 'sphere', pos: [0.55, 0.05, -0.1], args: [0.46, 24, 24] },
    { type: 'sphere', pos: [-0.25, 0.28, -0.2], args: [0.42, 24, 24] },
    { type: 'sphere', pos: [0.28, 0.22, 0.2], args: [0.44, 24, 24] },
    { type: 'cylinder', pos: [0, -0.15, 0], args: [0.5, 0.5, 1.2, 20], rot: [0, 0, Math.PI / 2] }
  ],
  stratus: [
    { type: 'sphere', pos: [-0.8, 0, 0], args: [0.38, 20, 20] },
    { type: 'sphere', pos: [-0.35, 0.12, 0.08], args: [0.45, 20, 20] },
    { type: 'sphere', pos: [0.15, 0.15, -0.05], args: [0.48, 20, 20] },
    { type: 'sphere', pos: [0.65, 0.08, 0.1], args: [0.42, 20, 20] },
    { type: 'sphere', pos: [1.05, -0.05, 0], args: [0.35, 20, 20] },
    { type: 'cylinder', pos: [0.1, -0.12, 0], args: [0.35, 0.35, 1.9, 20], rot: [0, 0, Math.PI / 2] }
  ],
  twin_puff: [
    { type: 'sphere', pos: [-0.45, 0.15, 0], args: [0.52, 24, 24] },
    { type: 'sphere', pos: [0.45, 0.1, 0.1], args: [0.48, 24, 24] },
    { type: 'sphere', pos: [0, -0.05, -0.1], args: [0.45, 24, 24] },
    { type: 'cylinder', pos: [0, -0.16, 0], args: [0.42, 0.42, 1.1, 20], rot: [0, 0, Math.PI / 2] }
  ],
  cotton_bank: [
    { type: 'sphere', pos: [0, 0.3, 0], args: [0.7, 24, 24] },
    { type: 'sphere', pos: [-0.65, 0.12, 0.15], args: [0.55, 24, 24] },
    { type: 'sphere', pos: [0.65, 0.14, -0.12], args: [0.54, 24, 24] },
    { type: 'sphere', pos: [-1.15, -0.05, 0.05], args: [0.42, 24, 24] },
    { type: 'sphere', pos: [1.15, -0.04, -0.05], args: [0.4, 24, 24] },
    { type: 'cylinder', pos: [0, -0.18, 0], args: [0.55, 0.55, 2.2, 20], rot: [0, 0, Math.PI / 2] }
  ]
};

const OrganicFloatingCloud = React.memo(function OrganicFloatingCloud({ cloud }) {
  const groupRef = useRef();
  const isPaused = useTypingGameStore((s) => s.isPaused);

  const puffs = useMemo(() => {
    return CLOUD_DESIGNS[cloud.designType || 'cumulus'] || CLOUD_DESIGNS.cumulus;
  }, [cloud.designType]);

  useFrame((state, delta) => {
    if (!groupRef.current || isPaused) return;
    const t = state.clock.elapsedTime;

    // Multi-directional drifting: right or left
    groupRef.current.position.x += cloud.speed * delta;
    if (cloud.speed > 0 && groupRef.current.position.x > 14.5) {
      groupRef.current.position.x = -14.5;
    } else if (cloud.speed < 0 && groupRef.current.position.x < -14.5) {
      groupRef.current.position.x = 14.5;
    }

    // Gentle organic vertical floating & swaying
    const swayY = Math.sin(t * (cloud.swaySpeed || 1.1) + (cloud.swayPhase || 0)) * (cloud.swayHeight || 0.16);
    const swayZ = Math.cos(t * 0.9 + (cloud.swayPhase || 0)) * 0.06;
    const tiltZ = Math.sin(t * 0.7 + (cloud.swayPhase || 0)) * 0.03;

    groupRef.current.position.y = cloud.baseY + swayY;
    groupRef.current.position.z = cloud.baseZ + swayZ;
    groupRef.current.rotation.z = tiltZ;
  });

  return (
    <group
      ref={groupRef}
      position={[cloud.startX, cloud.baseY, cloud.baseZ]}
      scale={cloud.scale}
      raycast={() => null} // No pointer trapping or click bursts (`totally clean non-interactive clouds`)
    >
      {puffs.map((puff, idx) => (
        <mesh key={idx} position={puff.pos} rotation={puff.rot || [0, 0, 0]} raycast={() => null}>
          {puff.type === 'sphere' ? (
            <sphereGeometry args={puff.args} />
          ) : (
            <cylinderGeometry args={puff.args} />
          )}
          <meshStandardMaterial
            color="#ffffff"
            roughness={0.92}
            metalness={0.04}
            emissive="#f8fafc"
            emissiveIntensity={0.06}
          />
        </mesh>
      ))}
    </group>
  );
});

export const FluffyClouds3D = React.memo(function FluffyClouds3D() {
  const clouds = useMemo(() => {
    return [
      // High Altitude Layer (Drifting Right, deep in sky z = -7.5)
      { id: 1, designType: 'cumulus', startX: -12.0, baseY: 8.4, baseZ: -7.5, speed: 0.28, scale: 1.15, swaySpeed: 1.0, swayHeight: 0.15, swayPhase: 0.5 },
      { id: 2, designType: 'cotton_bank', startX: -2.0, baseY: 8.6, baseZ: -7.8, speed: 0.28, scale: 1.25, swaySpeed: 0.9, swayHeight: 0.12, swayPhase: 2.1 },
      { id: 3, designType: 'stratus', startX: 8.0, baseY: 8.2, baseZ: -7.2, speed: 0.28, scale: 1.1, swaySpeed: 1.1, swayHeight: 0.16, swayPhase: 4.3 },

      // Mid Altitude Layer (Drifting Left, mid-sky z = -5.5)
      { id: 4, designType: 'twin_puff', startX: 13.0, baseY: 6.8, baseZ: -5.5, speed: -0.22, scale: 0.95, swaySpeed: 1.2, swayHeight: 0.14, swayPhase: 1.2 },
      { id: 5, designType: 'cumulus', startX: 3.0, baseY: 6.9, baseZ: -5.8, speed: -0.22, scale: 1.0, swaySpeed: 1.3, swayHeight: 0.18, swayPhase: 3.0 },
      { id: 6, designType: 'cotton_bank', startX: -7.0, baseY: 6.6, baseZ: -5.3, speed: -0.22, scale: 0.92, swaySpeed: 1.1, swayHeight: 0.15, swayPhase: 5.1 },

      // Lower Background Accent Layer (Drifting Right, deep background z = -9.0)
      { id: 7, designType: 'stratus', startX: -14.0, baseY: 5.4, baseZ: -9.0, speed: 0.18, scale: 1.3, swaySpeed: 0.8, swayHeight: 0.10, swayPhase: 0.8 },
      { id: 8, designType: 'twin_puff', startX: 0.0, baseY: 5.6, baseZ: -8.8, speed: 0.18, scale: 1.1, swaySpeed: 0.85, swayHeight: 0.11, swayPhase: 3.6 }
    ];
  }, []);

  return (
    <group>
      {clouds.map((c) => (
        <OrganicFloatingCloud key={c.id} cloud={c} />
      ))}
    </group>
  );
});
