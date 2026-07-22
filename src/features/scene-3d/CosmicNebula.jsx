import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const CosmicNebula = React.memo(function CosmicNebula() {
  const cloud1Ref = useRef();
  const cloud2Ref = useRef();
  const cloud3Ref = useRef();

  useFrame((state, delta) => {
    if (cloud1Ref.current) {
      cloud1Ref.current.rotation.z += delta * 0.03;
      cloud1Ref.current.position.x = Math.sin(state.clock.elapsedTime * 0.25) * 2.0;
    }
    if (cloud2Ref.current) {
      cloud2Ref.current.rotation.z -= delta * 0.025;
      cloud2Ref.current.position.y = Math.cos(state.clock.elapsedTime * 0.2) * 1.5;
    }
    if (cloud3Ref.current) {
      cloud3Ref.current.rotation.x += delta * 0.015;
    }
  });

  return (
    <group position={[0, 0, -35]}>
      {/* Deep Space Cyan Volumetric Nebula */}
      <mesh ref={cloud1Ref} position={[-14, 8, -10]}>
        <sphereGeometry args={[26, 24, 24]} />
        <meshBasicMaterial
          color="#00f0ff"
          transparent
          opacity={0.08}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Deep Space Magenta Volumetric Nebula */}
      <mesh ref={cloud2Ref} position={[15, -6, -5]}>
        <sphereGeometry args={[30, 24, 24]} />
        <meshBasicMaterial
          color="#b026ff"
          transparent
          opacity={0.09}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Golden / Amber Galactic Core Dust Glow */}
      <mesh ref={cloud3Ref} position={[0, 14, -20]}>
        <sphereGeometry args={[34, 24, 24]} />
        <meshBasicMaterial
          color="#ffaa00"
          transparent
          opacity={0.05}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
});
