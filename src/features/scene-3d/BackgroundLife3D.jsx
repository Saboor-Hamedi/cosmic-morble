import React, { useRef, useMemo } from 'react';
import { useFrame, useLoader, extend } from '@react-three/fiber';
import * as THREE from 'three';
import { shaderMaterial } from '@react-three/drei';

import whaleImgUrl from './cosmic_whale.jpg';
import birdImgUrl from './cosmic_bird.jpg';

const WhaleShaderMaterial = shaderMaterial(
  { tDiffuse: null, tintColor: new THREE.Color('#ffffff'), time: 0 },
  `
  varying vec2 vUv;
  uniform float time;
  void main() {
    vUv = uv;
    vec3 pos = position;
    
    // Very subtle, gentle wave so it doesn't look weirdly distorted
    float amplitude = abs(uv.x - 0.8) * 0.04;
    float wave = sin(uv.x * 10.0 - time * 4.0) * amplitude;
    
    pos.y += wave;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
  `,
  `
  uniform sampler2D tDiffuse;
  uniform vec3 tintColor;
  varying vec2 vUv;
  
  void main() {
    vec4 texColor = texture2D(tDiffuse, vUv);
    
    float brightness = max(max(texColor.r, texColor.g), texColor.b);
    float alpha = smoothstep(0.25, 0.5, brightness) * 0.9;
    if (alpha < 0.05) discard;
    
    vec3 finalColor = mix(texColor.rgb, tintColor, 0.6) + (texColor.rgb * 0.5);
    gl_FragColor = vec4(finalColor, alpha);
  }
  `
);

const BirdShaderMaterial = shaderMaterial(
  { tDiffuse: null, tintColor: new THREE.Color('#ffffff'), time: 0 },
  `
  varying vec2 vUv;
  uniform float time;
  void main() {
    vUv = uv;
    vec3 pos = position;
    
    // Flapping effect: bend the top (uv.y > 0.5) and bottom (uv.y < 0.5) to simulate wing flaps!
    float amplitude = abs(uv.y - 0.5) * 0.25;
    float flap = sin(time * 12.0) * amplitude;
    
    pos.y += flap;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
  `,
  `
  uniform sampler2D tDiffuse;
  uniform vec3 tintColor;
  varying vec2 vUv;
  
  void main() {
    vec4 texColor = texture2D(tDiffuse, vUv);
    
    float brightness = max(max(texColor.r, texColor.g), texColor.b);
    float alpha = smoothstep(0.2, 0.45, brightness) * 0.95;
    if (alpha < 0.05) discard;
    
    vec3 finalColor = mix(texColor.rgb, tintColor, 0.4) + (texColor.rgb * 0.6);
    gl_FragColor = vec4(finalColor, alpha);
  }
  `
);

extend({ WhaleShaderMaterial, BirdShaderMaterial });

// A generic function to animate background life creatures
const useLifeAnimation = (meshRef, speed, initialY, initialZ, scale, offsetTime) => {
  const startZ = useMemo(() => initialZ - Math.random() * 20, [initialZ]);
  const startX = useMemo(() => (Math.random() * 50 - 25), []);
  const dirRef = useRef(startX < 0 ? 1 : -1);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime + offsetTime;
    
    if (meshRef.current.material) {
      meshRef.current.material.time = t;
    }
    
    let newX = meshRef.current.position.x + (speed * dirRef.current * delta);
    let newZ = meshRef.current.position.z + (speed * 1.5 * delta);
    
    if (newZ > 10) {
      newZ = initialZ - 20 - Math.random() * 20;
      newX = (Math.random() > 0.5 ? -35 : 35);
      dirRef.current = newX < 0 ? 1 : -1;
    }
    
    const newY = initialY + Math.sin(t * 0.5) * 3.0;
    meshRef.current.position.set(newX, newY, newZ);
    
    const pitch = Math.cos(t * 0.5) * 0.1;
    meshRef.current.rotation.set(pitch, 0, 0);
    
    meshRef.current.scale.set(dirRef.current === -1 ? -scale : scale, scale, 1);
  });

  return { startX, startZ };
};

const CosmicWhale = React.memo(({ initialZ, initialY, speed, color, scale, texture, offsetTime }) => {
  const meshRef = useRef();
  const { startX, startZ } = useLifeAnimation(meshRef, speed, initialY, initialZ, scale, offsetTime);

  return (
    <mesh ref={meshRef} position={[startX, initialY, startZ]}>
      <planeGeometry args={[1, 1, 32, 16]} />
      <whaleShaderMaterial tDiffuse={texture} tintColor={new THREE.Color(color)} transparent={true} depthWrite={false} blending={THREE.AdditiveBlending} />
    </mesh>
  );
});

const CosmicBird = React.memo(({ initialZ, initialY, speed, color, scale, texture, offsetTime }) => {
  const meshRef = useRef();
  const { startX, startZ } = useLifeAnimation(meshRef, speed, initialY, initialZ, scale, offsetTime);

  return (
    <mesh ref={meshRef} position={[startX, initialY, startZ]}>
      <planeGeometry args={[1, 1, 16, 32]} />
      <birdShaderMaterial tDiffuse={texture} tintColor={new THREE.Color(color)} transparent={true} depthWrite={false} blending={THREE.AdditiveBlending} />
    </mesh>
  );
});

export const BackgroundLife3D = React.memo(function BackgroundLife3D() {
  const whaleTex = useLoader(THREE.TextureLoader, whaleImgUrl);
  const birdTex = useLoader(THREE.TextureLoader, birdImgUrl);
  
  return (
    <group>
      {/* 3 Cosmic Whales */}
      <CosmicWhale initialZ={-25} initialY={10} speed={2.5} color="#00ffff" scale={8} texture={whaleTex} offsetTime={0} />
      <CosmicWhale initialZ={-30} initialY={15} speed={1.8} color="#ff00ff" scale={6} texture={whaleTex} offsetTime={5} />
      <CosmicWhale initialZ={-40} initialY={6} speed={3.0} color="#ffaa00" scale={9} texture={whaleTex} offsetTime={12} />
      
      {/* 5 Flapping Cosmic Birds/Eagles, moving much faster! */}
      <CosmicBird initialZ={-20} initialY={18} speed={4.5} color="#ffffff" scale={4} texture={birdTex} offsetTime={2} />
      <CosmicBird initialZ={-25} initialY={12} speed={5.2} color="#ffbb00" scale={3.5} texture={birdTex} offsetTime={8} />
      <CosmicBird initialZ={-30} initialY={22} speed={4.0} color="#00ffcc" scale={4.5} texture={birdTex} offsetTime={15} />
      <CosmicBird initialZ={-35} initialY={16} speed={6.0} color="#ff44aa" scale={3.0} texture={birdTex} offsetTime={21} />
      <CosmicBird initialZ={-45} initialY={25} speed={4.8} color="#aaffff" scale={5.0} texture={birdTex} offsetTime={28} />
    </group>
  );
});
