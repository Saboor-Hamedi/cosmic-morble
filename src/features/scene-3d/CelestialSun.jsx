import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SunShaderMaterial } from './SunShaderMaterial.js';
import { useSelectionStore } from '../game-state/useSelectionStore.js';

export const CelestialSun = React.memo(function CelestialSun() {
  const coronaRef = useRef();
  const outerGlowRef = useRef();
  const prominenceGroupRef = useRef();
  const prom1Ref = useRef();
  const prom2Ref = useRef();
  const prom3Ref = useRef();
  const { setSelectedTarget } = useSelectionStore();

  const sunMaterial = useMemo(() => new THREE.ShaderMaterial({
    ...SunShaderMaterial,
    uniforms: THREE.UniformsUtils.clone(SunShaderMaterial.uniforms)
  }), []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (sunMaterial) {
      sunMaterial.uniforms.uTime.value = t;
    }
    if (coronaRef.current) {
      const pulse = 1 + Math.sin(t * 3.0) * 0.04;
      coronaRef.current.scale.setScalar(pulse);
      coronaRef.current.rotation.y += delta * 0.05;
    }
    if (outerGlowRef.current) {
      const pulseGlow = 1.35 + Math.cos(t * 2.2) * 0.06;
      outerGlowRef.current.scale.setScalar(pulseGlow);
    }
    if (prominenceGroupRef.current) {
      prominenceGroupRef.current.rotation.y += delta * 0.08;
      prominenceGroupRef.current.rotation.x += delta * 0.03;
    }
    if (prom1Ref.current) prom1Ref.current.rotation.z = t * 0.4;
    if (prom2Ref.current) prom2Ref.current.rotation.y = -t * 0.35;
    if (prom3Ref.current) prom3Ref.current.rotation.x = t * 0.5;
  });

  return (
    <group
      position={[55, 32, -150]}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedTarget('sun');
      }}
    >
      {/* 1. Photorealistic 3D Boiling Solar Core Sphere */}
      <mesh material={sunMaterial}>
        <sphereGeometry args={[14, 128, 128]} />
      </mesh>

      {/* 2. Erupting Solar Prominence Flame Arcs */}
      <group ref={prominenceGroupRef}>
        <mesh ref={prom1Ref} position={[13, 4, 0]} rotation={[0.4, 0.2, 0]}>
          <torusGeometry args={[3.8, 0.45, 16, 48, Math.PI * 1.2]} />
          <meshBasicMaterial color="#ff4400" transparent={true} opacity={0.88} blending={THREE.AdditiveBlending} />
        </mesh>
        <mesh ref={prom2Ref} position={[-12, -6, 4]} rotation={[-0.5, 0.8, 0.3]}>
          <torusGeometry args={[4.5, 0.5, 16, 48, Math.PI * 1.3]} />
          <meshBasicMaterial color="#ff8800" transparent={true} opacity={0.82} blending={THREE.AdditiveBlending} />
        </mesh>
        <mesh ref={prom3Ref} position={[2, 14, -5]} rotation={[0.8, -0.4, 1.0]}>
          <torusGeometry args={[3.2, 0.4, 16, 48, Math.PI]} />
          <meshBasicMaterial color="#ffcc00" transparent={true} opacity={0.9} blending={THREE.AdditiveBlending} />
        </mesh>
      </group>

      {/* 3. Volumetric Coronal Fire Flame Shell */}
      <mesh ref={coronaRef} scale={[1.08, 1.08, 1.08]}>
        <sphereGeometry args={[14, 64, 64]} />
        <meshBasicMaterial color="#ffaa00" transparent={true} opacity={0.6} blending={THREE.AdditiveBlending} />
      </mesh>

      {/* 4. Deep Space Golden Flame Halo */}
      <mesh ref={outerGlowRef} scale={[1.35, 1.35, 1.35]}>
        <sphereGeometry args={[14, 48, 48]} />
        <meshBasicMaterial color="#ff2200" transparent={true} opacity={0.35} blending={THREE.AdditiveBlending} />
      </mesh>

      <directionalLight position={[-10, -5, 20]} color="#fff4d4" intensity={5.0} />
      <pointLight color="#ffbb44" intensity={24} distance={400} decay={1.5} />
    </group>
  );
});
