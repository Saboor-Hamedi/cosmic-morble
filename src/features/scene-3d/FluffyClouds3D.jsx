import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Clouds, Cloud } from '@react-three/drei';
import * as THREE from 'three';
import { useTypingGameStore } from '../typing-game/useTypingGameStore.js';

const MovingVolumetricCloud = React.memo(function MovingVolumetricCloud({ cloud }) {
  const groupRef = useRef();
  const isPaused = useTypingGameStore((s) => s.isPaused);

  useFrame((state, delta) => {
    if (!groupRef.current || isPaused) return;
    const t = state.clock.elapsedTime;

    // Wind drift across the sky
    groupRef.current.position.x += cloud.speed * delta;
    if (cloud.speed > 0 && groupRef.current.position.x > 35.0) {
      groupRef.current.position.x = -35.0;
    } else if (cloud.speed < 0 && groupRef.current.position.x < -35.0) {
      groupRef.current.position.x = 35.0;
    }

    const swayY = Math.sin(t * cloud.swaySpeed + cloud.swayPhase) * cloud.swayHeight;
    groupRef.current.position.y = cloud.baseY + swayY;
  });

  return (
    <group ref={groupRef} position={[cloud.startX, cloud.baseY, cloud.baseZ]}>
      <Cloud
        seed={cloud.id}
        bounds={cloud.bounds}
        volume={cloud.volume}
        segments={cloud.segments}
        color={cloud.color}
        opacity={cloud.opacity}
        fade={15}
        speed={0.15} // Internal soft-rolling speed
      />
    </group>
  );
});

export const FluffyClouds3D = React.memo(function FluffyClouds3D() {
  const clouds = useMemo(() => {
    const arr = [];
    
    // Generate 15 massive but highly transparent volumetric soft-particle clouds!
    for (let i = 0; i < 15; i++) {
      const isFarBackground = i < 7;
      const isMid = i >= 7 && i < 12;
      
      let baseZ, baseY, speed, bounds, volume, opacity, color;

      if (isFarBackground) {
        baseZ = -18.0 - Math.random() * 4.0; // Deep background
        baseY = 6.0 + Math.random() * 5.0;
        speed = (Math.random() > 0.5 ? 1 : -1) * (0.05 + Math.random() * 0.05);
        bounds = [15 + Math.random() * 5, 5 + Math.random() * 2, 4];
        volume = 12 + Math.random() * 4;
        opacity = 0.25 + Math.random() * 0.15; // highly transparent!
        color = '#cbd5e1'; 
      } else if (isMid) {
        baseZ = -12.0 - Math.random() * 4.0;
        baseY = 7.5 + Math.random() * 3.5;
        speed = (Math.random() > 0.5 ? 1 : -1) * (0.1 + Math.random() * 0.1);
        bounds = [10 + Math.random() * 4, 3 + Math.random() * 2, 3];
        volume = 8 + Math.random() * 3;
        opacity = 0.35 + Math.random() * 0.15; // semi-transparent
        color = '#f1f5f9';
      } else {
        baseZ = -7.0 - Math.random() * 3.0; // Nearest layer
        baseY = 9.0 + Math.random() * 2.5;
        speed = (Math.random() > 0.5 ? 1 : -1) * (0.15 + Math.random() * 0.15);
        bounds = [6 + Math.random() * 3, 2 + Math.random() * 1.5, 2];
        volume = 5 + Math.random() * 3;
        opacity = 0.45 + Math.random() * 0.15; // still very see-through
        color = '#ffffff';
      }

      arr.push({
        id: i,
        startX: -35.0 + Math.random() * 70.0,
        baseY,
        baseZ,
        speed,
        bounds,
        volume,
        segments: 15 + Math.floor(Math.random() * 10),
        color,
        opacity,
        swaySpeed: 0.3 + Math.random() * 0.8,
        swayHeight: 0.1 + Math.random() * 0.2,
        swayPhase: Math.random() * Math.PI * 2
      });
    }
    return arr;
  }, []);

  return (
    // Render clouds using a basic material to ensure they stay incredibly bright and fluffy, matching the reference image.
    <Clouds material={THREE.MeshBasicMaterial} limit={400}>
      {clouds.map((c) => (
        <MovingVolumetricCloud key={c.id} cloud={c} />
      ))}
    </Clouds>
  );
});
