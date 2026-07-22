import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const EngineExhaustParticles = React.memo(function EngineExhaustParticles({ speed }) {
  const pointsRef = useRef();
  const particleCount = 450;

  // High-velocity roaring fire stream texture/shader
  const streamMaterial = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      uOpacity: { value: 0.92 }
    },
    vertexShader: `
      attribute float size;
      attribute float life;
      varying vec3 vColor;
      varying float vLife;

      void main() {
        vColor = color;
        vLife = life;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * (250.0 / -mvPosition.z) * vLife;
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform float uOpacity;
      varying vec3 vColor;
      varying float vLife;

      void main() {
        // Soft gaussian radial falloff for smooth volumetric fire blending (not sharp circle circles!)
        vec2 coord = gl_PointCoord - vec2(0.5);
        float dist = length(coord);
        if (dist > 0.5) discard;
        float alpha = pow(1.0 - dist * 2.0, 1.5) * vLife * uOpacity;
        gl_FragColor = vec4(vColor, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  }), []);

  const { positions, velocities, colors, sizes, lives } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const vel = new Float32Array(particleCount * 3);
    const col = new Float32Array(particleCount * 3);
    const sz = new Float32Array(particleCount);
    const lf = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const pod = i % 4;
      const xOffset = pod === 0 ? -0.55 : pod === 1 ? 0.55 : pod === 2 ? -0.3 : 0.3;
      const yOffset = pod < 2 ? 0.12 : -0.15;

      pos[i * 3] = xOffset + (Math.random() - 0.5) * 0.12;
      pos[i * 3 + 1] = yOffset + (Math.random() - 0.5) * 0.12;
      pos[i * 3 + 2] = -2.1 - Math.random() * 4.0;

      vel[i * 3] = (Math.random() - 0.5) * 0.15;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.15;
      vel[i * 3 + 2] = -6.0 - Math.random() * 10.0;

      const c = new THREE.Color();
      const rand = Math.random();
      if (rand < 0.4) c.set('#00ffff');       // Electric cyan plasma core
      else if (rand < 0.75) c.set('#0066ff'); // Deep blue ionization
      else if (rand < 0.9) c.set('#ffcc00');  // Roaring yellow fire ember
      else c.set('#ffffff');                  // White hot core

      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;

      sz[i] = 1.6 + Math.random() * 2.8;
      lf[i] = Math.random();
    }

    return { positions: pos, velocities: vel, colors: col, sizes: sz, lives: lf };
  }, []);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    const posAttr = pointsRef.current.geometry.attributes.position;
    const lifeAttr = pointsRef.current.geometry.attributes.life;
    const posArr = posAttr.array;
    const lifeArr = lifeAttr.array;

    const speedMultiplier = Math.max(0.6, speed / 3.0);

    for (let i = 0; i < particleCount; i++) {
      posArr[i * 3] += velocities[i * 3] * delta;
      posArr[i * 3 + 1] += velocities[i * 3 + 1] * delta;
      posArr[i * 3 + 2] += velocities[i * 3 + 2] * delta * speedMultiplier;

      lifeArr[i] -= delta * 1.5;

      // When particle fades or trails out, recycle directly at the engine nozzle
      if (lifeArr[i] <= 0 || posArr[i * 3 + 2] < -10.0 - speed * 1.2) {
        const pod = i % 4;
        const xOffset = pod === 0 ? -0.55 : pod === 1 ? 0.55 : pod === 2 ? -0.3 : 0.3;
        const yOffset = pod < 2 ? 0.12 : -0.15;

        posArr[i * 3] = xOffset + (Math.random() - 0.5) * 0.1;
        posArr[i * 3 + 1] = yOffset + (Math.random() - 0.5) * 0.1;
        posArr[i * 3 + 2] = -2.1;
        lifeArr[i] = 1.0;
      }
    }

    posAttr.needsUpdate = true;
    lifeAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} material={streamMaterial}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
        <bufferAttribute attach="attributes-life" args={[lives, 1]} />
      </bufferGeometry>
    </points>
  );
});
