import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTypingGameStore } from './useTypingGameStore.js';
import * as THREE from 'three';

// Generate a soft, fluffy radial gradient texture for our cloud/smoke particles
const cloudTexture = (() => {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  
  // Soft, fluffy smoke puff
  const gradient = ctx.createRadialGradient(64, 64, 10, 64, 64, 64);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.8)');
  gradient.addColorStop(0.6, 'rgba(255, 255, 255, 0.3)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 128, 128);
  
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
})();

const EvaporatingCloudBurstItem = React.memo(function EvaporatingCloudBurstItem({ burst }) {
  const groupRef = useRef();
  const particleRefs = useRef([]);
  
  // 6 soft cloud puffs that explode outward, expand, and evaporate!
  const particles = useMemo(() => {
    const parts = [];
    for (let i = 0; i < 6; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.5 + Math.random() * 1.5;
      const vx = Math.cos(angle) * speed;
      const vy = 0.8 + Math.random() * 2.0; // Float up
      const vz = Math.sin(angle) * speed;
      
      const startScale = 0.5 + Math.random() * 0.5;
      // It will expand up to 4x its size as it evaporates quickly
      const targetScale = startScale * (3.0 + Math.random() * 2.0);
      
      // Determine color - mostly white/grey, with a hint of the balloon's color
      const isTinted = Math.random() > 0.6;
      const color = isTinted && burst.color ? burst.color : '#ffffff';

      parts.push({ vx, vy, vz, startScale, targetScale, color });
    }
    return parts;
  }, [burst.color]);

  useFrame(() => {
    if (!groupRef.current) return;
    const elapsed = Date.now() - burst.timestamp;
    const elapsedSec = elapsed / 1000;
    const progress = Math.min(1.0, elapsed / 1800); // 1.8 seconds life for faster evaporation

    // Animate each cloud puff
    particleRefs.current.forEach((mesh, idx) => {
      if (mesh) {
        const part = particles[idx];
        const friction = 1.0 / (1.0 + elapsedSec * 2.5); 
        
        // Move outward and float up
        const x = part.vx * elapsedSec * friction;
        const y = part.vy * elapsedSec; 
        const z = part.vz * elapsedSec * friction;
        mesh.position.set(x, y, z);
        
        // EVAPORATE: Expand in scale wildly as it dissipates
        // Use an easeOut effect so it puffs fast then slows down
        const easeOut = 1.0 - Math.pow(1.0 - progress, 3.0);
        const currentScale = part.startScale + (part.targetScale - part.startScale) * easeOut;
        mesh.scale.set(currentScale, currentScale, currentScale);

        // EVAPORATE: Fade opacity to 0
        if (mesh.material) {
          // Stay opaque for a tiny bit, then fade out smoothly but quickly
          const opacity = progress < 0.1 ? 0.5 : 0.5 * (1.0 - ((progress - 0.1) / 0.9));
          mesh.material.opacity = Math.max(0, opacity);
        }
      }
    });
  });

  return (
    <group ref={groupRef} position={burst.position}>
      {particles.map((part, idx) => (
        <sprite key={idx} ref={(el) => (particleRefs.current[idx] = el)}>
          <spriteMaterial 
            map={cloudTexture} 
            color={part.color} 
            transparent={true} 
            opacity={0.85} 
            depthWrite={false}
          />
        </sprite>
      ))}
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
        <EvaporatingCloudBurstItem key={burst.id} burst={burst} />
      ))}
    </group>
  );
});
