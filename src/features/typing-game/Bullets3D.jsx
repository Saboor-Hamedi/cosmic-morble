import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useBullet } from './useBullet.js';
import { useTypingGameStore } from './useTypingGameStore.js';
import * as THREE from 'three';

const Bullet = React.memo(({ bullet }) => {
  const meshRef = useRef();
  const removeBullet = useBullet(s => s.removeBullet);
  
  // Very fast projectile so typing doesn't feel laggy
  const speed = 60.0; 

  // Initial spawn position and rotation
  const { start, initialRotation } = React.useMemo(() => {
    const s = new THREE.Vector3(...bullet.start);
    const t = new THREE.Vector3(...bullet.target);
    const dir = new THREE.Vector3().subVectors(t, s).normalize();
    const axis = new THREE.Vector3(0, 1, 0);
    const rot = new THREE.Quaternion().setFromUnitVectors(axis, dir);
    return { start: s, initialRotation: rot };
  }, [bullet.start, bullet.target]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    // Find current balloon position for homing!
    const store = useTypingGameStore.getState();
    const balloon = store.balloons.find(b => b.id === bullet.targetId);
    
    let targetPos = new THREE.Vector3(...bullet.target);
    if (balloon) {
      targetPos.set(balloon.position[0], balloon.position[1], balloon.position[2]);
    }
    
    const currentPos = meshRef.current.position;
    
    // Calculate direction and distance to the current target
    const dir = new THREE.Vector3().subVectors(targetPos, currentPos);
    const distToTarget = dir.length();
    
    const step = speed * delta;
    
    // If we reach the target (or are extremely close)
    if (distToTarget <= step || distToTarget < 0.5) {
      store.finalizeBurst(bullet.targetId);
      removeBullet(bullet.id);
      return;
    }
    
    // Move bullet towards target
    dir.normalize();
    meshRef.current.position.add(dir.clone().multiplyScalar(step));
    
    // Update rotation to always point at the moving target
    const axis = new THREE.Vector3(0, 1, 0);
    meshRef.current.quaternion.setFromUnitVectors(axis, dir);
  });

  return (
    <group ref={meshRef} position={start} quaternion={initialRotation}>
      {/* Arrow shaft - VERY subtle and thin */}
      <mesh position={[0, -0.4, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 0.8, 8]} />
        <meshBasicMaterial color={bullet.color} />
      </mesh>
      
      {/* Arrow head - tiny and sharp */}
      <mesh position={[0, 0, 0]}>
        <coneGeometry args={[0.08, 0.25, 8]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      
      {/* Outer Glow - subtle */}
      <mesh scale={[1.2, 1.0, 1.2]} position={[0, -0.2, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 1.0, 8]} />
        <meshBasicMaterial color={bullet.color} transparent opacity={0.4} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  );
});

export const Bullets3D = React.memo(function Bullets3D() {
  const bullets = useBullet((s) => s.bullets);

  return (
    <group>
      {bullets.map((b) => (
        <Bullet key={b.id} bullet={b} />
      ))}
    </group>
  );
});
