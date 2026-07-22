import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CircularParticleShader } from './CircularParticleShader.js';

export const RealisticStarfield = React.memo(function RealisticStarfield() {
  const pointsRef = useRef();
  const starCount = 3500;

  const starMaterial = useMemo(() => new THREE.ShaderMaterial({
    ...CircularParticleShader,
    uniforms: {
      uOpacity: { value: 0.92 },
      uBaseSize: { value: 1.6 }
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  }), []);

  const { positions, colors, sizes } = useMemo(() => {
    const pos = new Float32Array(starCount * 3);
    const col = new Float32Array(starCount * 3);
    const sz = new Float32Array(starCount);

    for (let i = 0; i < starCount; i++) {
      const r = 80 + Math.random() * 150;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      const randClass = Math.random();
      const c = new THREE.Color();
      if (randClass < 0.15) c.set('#b5d2ff');
      else if (randClass < 0.35) c.set('#dce9ff');
      else if (randClass < 0.65) c.set('#ffffff');
      else if (randClass < 0.85) c.set('#ffeaad');
      else c.set('#ff9e80');

      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;

      sz[i] = 1.0 + Math.random() * 3.2;
    }

    return { positions: pos, colors: col, sizes: sz };
  }, []);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.003;
      pointsRef.current.rotation.x += delta * 0.001;
    }
  });

  return (
    <points ref={pointsRef} material={starMaterial}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
    </points>
  );
});
