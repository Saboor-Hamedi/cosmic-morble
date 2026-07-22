import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PlanetShaderMaterial } from './PlanetShaderMaterial.js';
import { useSelectionStore } from '../game-state/useSelectionStore.js';

export const OrbitalPlanet = React.memo(function OrbitalPlanet() {
  const planetRef = useRef();
  const atmosphereRef = useRef();
  const { setSelectedTarget } = useSelectionStore();

  const planetMat = useMemo(() => new THREE.ShaderMaterial({
    ...PlanetShaderMaterial,
    uniforms: THREE.UniformsUtils.clone(PlanetShaderMaterial.uniforms)
  }), []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (planetMat) {
      planetMat.uniforms.uTime.value = t;
    }
    if (planetRef.current) {
      planetRef.current.rotation.y += delta * 0.012;
    }
    if (atmosphereRef.current) {
      const pulse = 1.05 + Math.sin(t * 2.0) * 0.015;
      atmosphereRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group
      position={[24, -48, -90]}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedTarget('planet');
      }}
    >
      {/* Primary Procedural Blue Exoplanet Sphere */}
      <mesh ref={planetRef} material={planetMat}>
        <sphereGeometry args={[42, 64, 64]} />
      </mesh>

      {/* Outer Volumetric Atmosphere Cyan Halo Shell */}
      <mesh ref={atmosphereRef} scale={[1.05, 1.05, 1.05]}>
        <sphereGeometry args={[42, 48, 48]} />
        <meshBasicMaterial color="#00f0ff" transparent={true} opacity={0.25} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
});
