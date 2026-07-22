import React, { useRef, useState, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { useTypingGameStore } from './useTypingGameStore.js';
import * as THREE from 'three';

const BalloonItem = React.memo(function BalloonItem({ balloon }) {
  const groupRef = useRef();
  const { clickBalloon, moveBalloonById, mode } = useTypingGameStore();
  const [isDragging, setIsDragging] = useState(false);
  const dragInfoRef = useRef({ startTime: 0, startPos: [0, 0, 0], planeZ: 0 });

  useFrame((state) => {
    if (!groupRef.current) return;
    
    if (isDragging) {
      groupRef.current.position.set(
        balloon.position[0],
        balloon.position[1],
        balloon.position[2]
      );
      return;
    }

    const t = state.clock.elapsedTime;
    const swayX = Math.sin(t * (balloon.swaySpeed || 1.8) + (balloon.swayPhase || 0)) * (balloon.swayAmount || 0.22);
    const swayZ = Math.cos(t * 1.5 + (balloon.swayPhase || 0)) * 0.12;

    groupRef.current.position.set(
      balloon.position[0] + swayX,
      balloon.position[1],
      balloon.position[2] + swayZ
    );

    groupRef.current.rotation.z = -swayX * 0.35;
    groupRef.current.rotation.y = Math.sin(t * 1.2 + balloon.id) * 0.08;
  });

  const handlePointerDown = useCallback((e) => {
    e.stopPropagation();
    e.target.setPointerCapture(e.pointerId);
    setIsDragging(true);
    dragInfoRef.current = {
      startTime: Date.now(),
      startPos: [e.point.x, e.point.y, balloon.position[2]],
      planeZ: balloon.position[2]
    };
  }, [balloon.position]);

  const handlePointerMove = useCallback((e) => {
    if (!isDragging) return;
    e.stopPropagation();
    moveBalloonById(balloon.id, [e.point.x, e.point.y, dragInfoRef.current.planeZ]);
  }, [isDragging, moveBalloonById, balloon.id]);

  const handlePointerUp = useCallback((e) => {
    if (!isDragging) return;
    e.stopPropagation();
    try { e.target.releasePointerCapture(e.pointerId); } catch {}
    setIsDragging(false);

    const elapsed = Date.now() - dragInfoRef.current.startTime;
    const dist = Math.hypot(
      e.point.x - dragInfoRef.current.startPos[0],
      e.point.y - dragInfoRef.current.startPos[1]
    );

    if (elapsed < 260 && dist < 0.35) {
      clickBalloon(balloon.id);
    }
  }, [isDragging, clickBalloon, balloon.id]);

  return (
    <group
      ref={groupRef}
      position={balloon.position}
      scale={balloon.scale}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => setIsDragging(false)}
    >
      {/* Clean, high-end realistic latex party balloon */}
      <mesh scale={[1.0, 1.25, 1.0]}>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshStandardMaterial
          color={balloon.color}
          roughness={0.24}
          metalness={0.04}
        />
      </mesh>

      {/* Subtle clean specular highlight on top shoulder */}
      <mesh position={[-0.25, 0.52, 0.48]} rotation={[0.4, -0.4, 0]} scale={[0.14, 0.08, 0.06]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial color="#ffffff" roughness={0.5} />
      </mesh>

      {/* Balloon Knot at bottom */}
      <mesh position={[0, -0.96, 0]}>
        <coneGeometry args={[0.14, 0.22, 16]} />
        <meshStandardMaterial color={balloon.color} roughness={0.3} />
      </mesh>

      {/* Trailing white ribbon string hanging down */}
      <mesh position={[0, -1.6, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 1.2, 8]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.6} />
      </mesh>

      {/* Razor-sharp, high-contrast 3D Letters right on the front face */}
      {mode === 'letters' ? (
        <Text
          position={[0, 0.05, 0.72]}
          fontSize={0.65}
          fontWeight={900}
          color="#ffffff"
          outlineWidth={0.045}
          outlineColor="#000000"
          anchorX="center"
          anchorY="middle"
        >
          {balloon.text}
        </Text>
      ) : (
        <group position={[0, 0.05, 0.72]}>
          {balloon.text.split('').map((char, idx) => {
            const isTyped = idx < balloon.typedIndex;
            const isNext = idx === balloon.typedIndex;
            const charWidth = 0.32;
            const offsetX = (idx - (balloon.text.length - 1) / 2) * charWidth;
            return (
              <Text
                key={idx}
                position={[offsetX, 0, 0]}
                fontSize={0.42}
                fontWeight={900}
                color={isTyped ? '#00ff88' : isNext ? '#ffff00' : '#ffffff'}
                outlineWidth={0.035}
                outlineColor="#000000"
                anchorX="center"
                anchorY="middle"
              >
                {char}
              </Text>
            );
          })}
        </group>
      )}
    </group>
  );
});

export const FloatingBalloons3D = React.memo(function FloatingBalloons3D() {
  const { balloons, spawnBalloon, updateBalloons } = useTypingGameStore();

  useFrame((state, delta) => {
    updateBalloons(delta);
    if (Math.random() < delta * 1.1) {
      spawnBalloon();
    }
  });

  return (
    <group>
      {balloons.map((b) => (
        <BalloonItem key={b.id} balloon={b} />
      ))}
    </group>
  );
});
