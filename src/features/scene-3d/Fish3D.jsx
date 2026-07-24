import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';

export const Fish3D = React.memo(function Fish3D({ count = 25 }) {
  const meshRef = useRef();

  // Create a simple low-poly fish geometry by merging a squashed sphere and a cone
  const fishGeometry = useMemo(() => {
    const body = new THREE.SphereGeometry(0.3, 16, 8);
    body.scale(2, 1, 0.5); // Squash into a fish body shape
    
    const tail = new THREE.ConeGeometry(0.25, 0.5, 4);
    tail.rotateZ(-Math.PI / 2);
    tail.translate(-0.7, 0, 0); // Move to the back
    
    const merged = BufferGeometryUtils.mergeGeometries([body, tail]);
    merged.computeVertexNormals();
    return merged;
  }, []);

  const fishMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: '#ff9900', // Goldfish orange!
      metalness: 0.3,
      roughness: 0.2,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
    });
  }, []);

  // Initialize fish data
  const fishData = useMemo(() => {
    const data = [];
    for (let i = 0; i < count; i++) {
      // Position them under the flat ocean surface (y = -5)
      const radius = 4 + Math.random() * 15; // wide swimming circles
      const angleY = Math.random() * Math.PI * 2; 
      const speed = 0.3 + Math.random() * 0.6;
      const wiggleSpeed = 5 + Math.random() * 5;
      
      data.push({
        radius,
        angleY,
        speed,
        wiggleSpeed,
        scale: 0.2 + Math.random() * 0.3,
        baseY: -7.8 - Math.random() * 2, // Swim depth under the lowered shallow water (water is at -7.5)
        centerX: (Math.random() - 0.5) * 10, // Slight center offset
        centerZ: (Math.random() - 0.5) * 10
      });
    }
    return data;
  }, [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime;

    fishData.forEach((fish, i) => {
      // Update orbit angle horizontally
      fish.angleY += (fish.speed * 0.01);
      
      // Calculate position on the XZ plane under the water
      const x = fish.centerX + Math.sin(fish.angleY) * fish.radius;
      const z = fish.centerZ + Math.cos(fish.angleY) * fish.radius;
      const y = fish.baseY + Math.sin(time * fish.speed + i) * 0.5; // gentle vertical bob
      
      dummy.position.set(x, y, z);
      
      // Point fish in the direction of swimming
      const dx = fish.centerX + Math.sin(fish.angleY + 0.1) * fish.radius - x;
      const dz = fish.centerZ + Math.cos(fish.angleY + 0.1) * fish.radius - z;
      const dy = (fish.baseY + Math.sin((time + 0.1) * fish.speed + i) * 0.5) - y;
      
      const lookTarget = new THREE.Vector3(x + dx, y + dy, z + dz);
      dummy.lookAt(lookTarget);
      
      // Add fish tail wiggle!
      dummy.rotateY(Math.sin(time * fish.wiggleSpeed) * 0.15);
      
      dummy.scale.set(fish.scale, fish.scale, fish.scale);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[fishGeometry, fishMaterial, count]} receiveShadow castShadow />
  );
});
