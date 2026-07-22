import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { EngineFireShader } from './EngineFireShader.js';
import { EngineExhaustParticles } from './EngineExhaustParticles.jsx';

export const RealisticJetPlume = React.memo(function RealisticJetPlume({ speed }) {
  const plume1Ref = useRef();
  const plume2Ref = useRef();
  const plume3Ref = useRef();
  const plume4Ref = useRef();

  const fireMats = useMemo(() => {
    return [0, 1, 2, 3].map(() => new THREE.ShaderMaterial({
      ...EngineFireShader,
      uniforms: THREE.UniformsUtils.clone(EngineFireShader.uniforms),
      transparent: true,
      blending: THREE.AdditiveBlending
    }));
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const throttle = Math.min(1.0, speed / 12.0);

    fireMats.forEach((mat) => {
      mat.uniforms.uTime.value = t;
      mat.uniforms.uThrottle.value = throttle;
    });

    const lengthMult = Math.max(0.8, throttle * 4.5);
    const pulse = Math.sin(t * 50) * 0.1;

    [plume1Ref, plume2Ref, plume3Ref, plume4Ref].forEach((ref) => {
      if (ref.current) {
        ref.current.scale.set(1 + pulse * 0.15, 1 + pulse * 0.15, lengthMult + pulse);
      }
    });
  });

  const thrusters = [
    { id: 'port-main', pos: [-0.55, 0.12, 0], scale: 1.15, ref: plume1Ref },
    { id: 'stbd-main', pos: [0.55, 0.12, 0], scale: 1.15, ref: plume2Ref },
    { id: 'port-aux', pos: [-0.3, -0.15, -0.1], scale: 0.85, ref: plume3Ref },
    { id: 'stbd-aux', pos: [0.3, -0.15, -0.1], scale: 0.85, ref: plume4Ref },
  ];

  return (
    <group position={[0, 0, -2.1]}>
      {/* Quad Heavy Ion Thruster Housings & Continuous Volumetric Fire Plumes */}
      {thrusters.map((th, idx) => (
        <group key={th.id} position={th.pos} scale={th.scale}>
          {/* Armored Heavy Engine Nacelle Base */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.26, 0.32, 0.48, 32]} />
            <meshStandardMaterial color="#101520" metalness={0.95} roughness={0.08} />
          </mesh>
          {/* Glowing Neon Cyan Cooling Ring */}
          <mesh position={[0, 0, -0.2]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.28, 0.035, 16, 32]} />
            <meshBasicMaterial color="#00ffff" />
          </mesh>
          {/* Inner Blinding White-Hot Plasma Core Beam */}
          <mesh position={[0, 0, -0.45]} rotation={[-Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.16, 1.4, 32, 1]} />
            <meshBasicMaterial color="#ffffff" transparent={true} opacity={0.96} blending={THREE.AdditiveBlending} />
          </mesh>
          {/* Continuous Roaring Volumetric Plasma Fire Cone (No floating circles!) */}
          <mesh ref={th.ref} position={[0, 0, -1.0]} rotation={[-Math.PI / 2, 0, 0]} material={fireMats[idx]}>
            <coneGeometry args={[0.25, 2.5, 32, 24]} />
          </mesh>
        </group>
      ))}

      {/* High-Velocity Continuous Fire & Plasma Trail Stream */}
      <EngineExhaustParticles speed={speed} />
    </group>
  );
});
