import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { MoonShaderMaterial } from './MoonShaderMaterial.js';
import { useSelectionStore } from '../game-state/useSelectionStore.js';

export const CelestialMoon = React.memo(function CelestialMoon() {
  const moonGroupRef = useRef();
  const ringRef = useRef();
  const { setSelectedTarget } = useSelectionStore();

  const moonMaterial = useMemo(() => new THREE.ShaderMaterial({
    ...MoonShaderMaterial,
    uniforms: THREE.UniformsUtils.clone(MoonShaderMaterial.uniforms)
  }), []);

  useFrame((state, delta) => {
    if (moonGroupRef.current) {
      moonGroupRef.current.rotation.y += delta * 0.035;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.07;
    }
  });

  return (
    <group
      position={[-48, 20, -115]}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedTarget('moon');
      }}
    >
      {/* Photorealistic Moon Sphere with Procedural Craters & Maria */}
      <group ref={moonGroupRef}>
        <mesh material={moonMaterial}>
          <sphereGeometry args={[8.5, 64, 64]} />
        </mesh>
      </group>

      {/* Atmospheric Cyan Rim Halo */}
      <mesh scale={[1.05, 1.05, 1.05]}>
        <sphereGeometry args={[8.5, 32, 32]} />
        <meshBasicMaterial color="#00f0ff" transparent={true} opacity={0.22} blending={THREE.AdditiveBlending} />
      </mesh>

      {/* Shimmering Orbital Planetary Ring */}
      <group rotation={[0.4, -0.3, 0]}>
        <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[14.5, 0.45, 16, 64]} />
          <meshStandardMaterial color="#00f0ff" metalness={0.75} roughness={0.25} transparent={true} opacity={0.68} />
        </mesh>
      </group>
    </group>
  );
});
