import React, { useRef, useState, useCallback, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, MeshDistortionMaterial } from '@react-three/drei';
import { useTypingGameStore } from './useTypingGameStore.js';
import { useThemeStore } from '../theme/useThemeStore.js';
import * as THREE from 'three';

const FUN_CANDY_COLORS = [
  '#ffed4a', // Sunny Yellow
  '#38bdf8', // Electric Aqua
  '#ff71ce', // Bubblegum Pink
  '#00ff88', // Neon Lime
  '#a78bfa', // Magical Violet
  '#ff9e64', // Bright Orange
  '#ffffff'  // Pure Snow White
];

const FloatingWaterOrbItem = React.memo(function FloatingWaterOrbItem({ balloon: item }) {
  const outerGroupRef = useRef();
  const orbMeshRef = useRef();
  const waveRef1 = useRef();
  const waveRef2 = useRef();
  const letterRef = useRef();
  const bubblesGroupRef = useRef();
  const bubbleRefs = useRef([]);
  
  const { mode, clickBalloon, moveBalloonById, capsLock } = useTypingGameStore();
  const theme = useThemeStore((s) => s.theme);

  const [isDragging, setIsDragging] = useState(false);
  const [hovered, setHovered] = useState(false);
  const dragStartRef = useRef({ time: 0, x: 0, y: 0 });
  const planeRef = useRef(new THREE.Plane(new THREE.Vector3(0, 0, 1), 0));
  const planeIntersect = useRef(new THREE.Vector3());

  // Assign a cheerful, playful candy color to each letter to make typing extra fun!
  const letterCandyColor = useMemo(() => {
    return FUN_CANDY_COLORS[item.id % FUN_CANDY_COLORS.length];
  }, [item.id]);

  // Initial offsets for tiny air bubbles rising inside the water
  const internalBubblesData = useMemo(() => {
    return [
      { x: 0.28, y: -0.3, z: 0.15, speed: 0.35, size: 0.055 },
      { x: -0.25, y: -0.1, z: 0.2, speed: 0.42, size: 0.045 },
      { x: 0.12, y: 0.1, z: -0.22, speed: 0.38, size: 0.038 },
      { x: -0.18, y: -0.38, z: -0.15, speed: 0.48, size: 0.042 },
      { x: 0.05, y: -0.25, z: 0.28, speed: 0.31, size: 0.05 }
    ];
  }, []);

  useFrame((state, delta) => {
    if (!outerGroupRef.current || isDragging) return;
    const t = state.clock.elapsedTime;
    
    // Gentle upward floating rising up from the ground/world
    const swayX = Math.sin(t * (item.swaySpeed || 1.4) + (item.swayPhase || 0)) * (item.swayAmount || 0.14);
    const swayZ = Math.cos(t * 1.2 + (item.swayPhase || 0)) * 0.08;

    outerGroupRef.current.position.set(
      item.position[0] + swayX,
      item.position[1],
      item.position[2] + swayZ
    );

    // Strictly round scale (`100% equal width and height at all times`, NO oval squishing or eggs!)
    const baseScale = (item.scale || 0.45) * 2.3;
    const hoverScaleBonus = hovered ? 1.08 : 1.0;
    const strictRoundScale = baseScale * hoverScaleBonus;
    outerGroupRef.current.scale.set(strictRoundScale, strictRoundScale, strictRoundScale);

    // Outer water sphere shimmer
    if (orbMeshRef.current) {
      orbMeshRef.current.rotation.y = t * 0.2 + item.id;
    }

    // Internal liquid water waves swaying (`looks like actual water caustics`)
    if (waveRef1.current) {
      waveRef1.current.rotation.x = Math.sin(t * 1.8 + item.id) * 0.2;
      waveRef1.current.position.y = Math.sin(t * 2.4 + item.id) * 0.04;
    }
    if (waveRef2.current) {
      waveRef2.current.rotation.z = Math.cos(t * 1.6 + item.id) * 0.25;
      waveRef2.current.position.y = Math.cos(t * 2.1 + item.id) * 0.03;
    }

    // Fun, playful letter animation (`make them more fun`: happy wiggle + bouncy breathing!)
    if (letterRef.current) {
      letterRef.current.position.y = Math.sin(t * 3.0 + item.id) * 0.035;
      letterRef.current.rotation.z = Math.sin(t * 4.2 + item.id) * 0.13; // happy side-to-side wiggle!
      const letterScale = 1.0 + Math.sin(t * 5.0 + item.id) * 0.065; // bouncy pulsing!
      letterRef.current.scale.set(letterScale, letterScale, letterScale);
    }

    // Animate tiny internal air bubbles physically rising up through the liquid water
    if (bubblesGroupRef.current) {
      bubblesGroupRef.current.rotation.y = t * 0.4;
    }
    bubbleRefs.current.forEach((mesh, idx) => {
      if (mesh) {
        const data = internalBubblesData[idx];
        let newY = mesh.position.y + data.speed * delta;
        if (newY > 0.45) {
          newY = -0.45;
        }
        mesh.position.y = newY;
      }
    });
  });

  const handlePointerDown = useCallback((e) => {
    e.stopPropagation();
    setIsDragging(true);
    dragStartRef.current = {
      time: Date.now(),
      x: e.clientX,
      y: e.clientY
    };
    if (outerGroupRef.current) {
      planeRef.current.constant = -outerGroupRef.current.position.z;
    }
    e.target.setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e) => {
    if (!isDragging) return;
    e.stopPropagation();
    e.ray.intersectPlane(planeRef.current, planeIntersect.current);
    if (planeIntersect.current && outerGroupRef.current) {
      const newPos = [
        planeIntersect.current.x,
        planeIntersect.current.y,
        outerGroupRef.current.position.z
      ];
      outerGroupRef.current.position.set(...newPos);
      moveBalloonById(item.id, newPos);
    }
  }, [isDragging, item.id, moveBalloonById]);

  const handlePointerUp = useCallback((e) => {
    if (!isDragging) return;
    e.stopPropagation();
    setIsDragging(false);
    try {
      e.target.releasePointerCapture(e.pointerId);
    } catch (_) {}

    const dist = Math.hypot(
      e.clientX - dragStartRef.current.x,
      e.clientY - dragStartRef.current.y
    );
    const duration = Date.now() - dragStartRef.current.time;

    if (duration < 260 && dist < 12) {
      clickBalloon(item.id);
    }
  }, [isDragging, item.id, clickBalloon]);

  const displayText = capsLock ? item.text.toUpperCase() : item.text.toLowerCase();
  
  // Strictly equal width and height (`width and height are strictly 1:1:1 round`)
  const baseScale = (item.scale || 0.45) * 2.3;
  const uniformScale = [baseScale, baseScale, baseScale];

  const orbColor = item.color || theme.bubbleColor || '#38bdf8';

  return (
    <group
      ref={outerGroupRef}
      position={item.position}
      scale={uniformScale}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
      onPointerOut={(e) => { e.stopPropagation(); setHovered(false); }}
      style={{ cursor: isDragging ? 'grabbing' : 'pointer' }}
    >
      {/* 1. Soft Enchanted Outer Water Aura Halo (`sphere is perfectly round: [0.74]`) */}
      <mesh renderOrder={0}>
        <sphereGeometry args={[0.74, 32, 32]} />
        <meshStandardMaterial
          color={orbColor}
          emissive={orbColor}
          emissiveIntensity={hovered ? 0.9 : 0.4}
          transparent
          opacity={hovered ? 0.35 : 0.15}
          depthWrite={false}
        />
      </mesh>

      {/* 2. Fluid Liquid Water Drop (`MeshDistortionMaterial` gives real organic water ripples across the surface while staying 100% round!) */}
      <mesh ref={orbMeshRef} renderOrder={1}>
        <sphereGeometry args={[0.72, 64, 64]} />
        <MeshDistortionMaterial
          color={orbColor}
          speed={2.2}
          distortion={0.14}
          roughness={0.03}
          metalness={0.05}
          transmission={0.72}
          ior={1.333}
          thickness={1.6}
          clearcoat={1.0}
          clearcoatRoughness={0.02}
          transparent
          opacity={0.84}
          depthWrite={false}
        />
      </mesh>

      {/* 3. Shimmering Internal Water Caustic Waves floating inside the liquid (`looks like actual water currents`) */}
      <group renderOrder={3}>
        <mesh ref={waveRef1} position={[0, -0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.64, 32]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive={orbColor}
            emissiveIntensity={0.65}
            transparent
            opacity={0.45}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
        <mesh ref={waveRef2} position={[0, 0.08, 0]} rotation={[Math.PI / 2 + 0.3, 0.1, 0]}>
          <circleGeometry args={[0.58, 32]} />
          <meshStandardMaterial
            color="#e0f2fe"
            emissive="#ffffff"
            emissiveIntensity={0.55}
            transparent
            opacity={0.35}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* 4. Wet Surface Specular Glint / Gloss Highlight near the top so it glistens like a real water droplet */}
      <mesh position={[-0.26, 0.34, 0.5]} renderOrder={4}>
        <sphereGeometry args={[0.075, 16, 16]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1.2} transparent opacity={0.88} depthWrite={false} />
      </mesh>
      <mesh position={[-0.15, 0.44, 0.45]} renderOrder={4}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1.0} transparent opacity={0.82} depthWrite={false} />
      </mesh>

      {/* 5. Live Effervescent Air Bubbles physically bubbling up through the liquid water right inside the sphere */}
      <group ref={bubblesGroupRef} renderOrder={5}>
        {internalBubblesData.map((data, idx) => (
          <mesh
            key={idx}
            ref={(el) => { bubbleRefs.current[idx] = el; }}
            position={[data.x, data.y, data.z]}
          >
            <sphereGeometry args={[data.size, 16, 16]} />
            <meshPhysicalMaterial
              color="#ffffff"
              transmission={0.92}
              ior={1.333}
              roughness={0.04}
              transparent
              opacity={0.88}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>

      {/* 6. Fun, Playful Candy/Jewel Letters right inside the exact center ([0, 0, 0]) of the water orb (`make them more fun`) */}
      <group ref={letterRef} position={[0, 0, 0]} renderOrder={10}>
        {mode === 'letters' ? (
          <Text
            position={[0, 0, 0]}
            fontSize={0.88}
            fontWeight={900}
            color={letterCandyColor}
            outlineWidth={0.048}
            outlineColor="#090d16"
            outlineBlur={0.015}
            anchorX="center"
            anchorY="middle"
            renderOrder={10}
            material-depthTest={false}
          >
            {displayText}
          </Text>
        ) : (
          <group position={[0, 0, 0]}>
            {(() => {
              const len = Math.max(1, displayText.length);
              const wordFontSize = Math.min(0.52, 1.38 / Math.max(2.5, len));
              const charWidth = wordFontSize * 0.82;
              return displayText.split('').map((char, idx) => {
                const isTyped = idx < item.typedIndex;
                const isNext = idx === item.typedIndex;
                const offsetX = (idx - (len - 1) / 2) * charWidth;
                const charColor = isTyped ? '#00ff88' : isNext ? '#ffff00' : FUN_CANDY_COLORS[(item.id + idx) % FUN_CANDY_COLORS.length];
                return (
                  <Text
                    key={idx}
                    position={[offsetX, 0, 0]}
                    fontSize={wordFontSize}
                    fontWeight={900}
                    color={charColor}
                    outlineWidth={Math.max(0.02, wordFontSize * 0.065)}
                    outlineColor="#090d16"
                    outlineBlur={0.015}
                    anchorX="center"
                    anchorY="middle"
                    renderOrder={10}
                    material-depthTest={false}
                  >
                    {char}
                  </Text>
                );
              });
            })()}
          </group>
        )}
      </group>
    </group>
  );
});

export const FloatingShips3D = React.memo(function FloatingShips3D() {
  const { balloons: items, spawnBalloon, updateBalloons } = useTypingGameStore();

  useFrame((state, delta) => {
    updateBalloons(delta);
    if (Math.random() < delta * 1.15) {
      spawnBalloon();
    }
  });

  return (
    <group>
      {items.map((item) => (
        <FloatingWaterOrbItem key={item.id} balloon={item} />
      ))}
    </group>
  );
});
