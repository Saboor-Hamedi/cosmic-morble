import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Text } from '@react-three/drei';
import { useTypingGameStore } from './useTypingGameStore.js';
import { useThemeStore } from '../theme/useThemeStore.js';

const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
];

const KeyCap3D = React.memo(function KeyCap3D({ char, rowIdx, colIdx }) {
  const meshRef = useRef();
  const { activeKey, pressKey, capsLock } = useTypingGameStore();
  const theme = useThemeStore((s) => s.theme);
  
  const isDown = activeKey === char.toUpperCase();
  const displayChar = capsLock ? char.toUpperCase() : char.toLowerCase();

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const targetZ = isDown ? -0.06 : 0;
    meshRef.current.position.z += (targetZ - meshRef.current.position.z) * (delta * 20);
  });

  // Base key color by row or active state
  const rowColors = theme.keyRowColors || ['#f0fdf4', '#dcfce7', '#bbf7d0'];
  const baseColor = isDown ? (theme.keyActive || '#facc15') : rowColors[rowIdx % rowColors.length];

  return (
    <group
      ref={meshRef}
      onPointerDown={(e) => {
        e.stopPropagation();
        pressKey(char);
      }}
    >
      <RoundedBox args={[0.54, 0.54, 0.2]} radius={0.06} smoothness={4}>
        <meshStandardMaterial
          color={baseColor}
          roughness={0.25}
          metalness={0.08}
        />
      </RoundedBox>

      {/* Crisp Typography on Keycap */}
      <Text
        position={[0, 0, 0.12]}
        fontSize={0.25}
        fontWeight={900}
        color={isDown ? '#000000' : (theme.keyText || '#14532d')}
        anchorX="center"
        anchorY="middle"
      >
        {displayChar}
      </Text>
    </group>
  );
});

const SpecialKeyCap3D = React.memo(function SpecialKeyCap3D({ label, width, color, onClick, isActive }) {
  const meshRef = useRef();
  const theme = useThemeStore((s) => s.theme);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const targetZ = isActive ? -0.06 : 0;
    meshRef.current.position.z += (targetZ - meshRef.current.position.z) * (delta * 20);
  });

  return (
    <group
      ref={meshRef}
      onPointerDown={(e) => {
        e.stopPropagation();
        if (onClick) onClick();
      }}
    >
      <RoundedBox args={[width, 0.54, 0.2]} radius={0.06} smoothness={4}>
        <meshStandardMaterial
          color={isActive ? '#facc15' : (color || theme.keySpacebar || '#86efac')}
          roughness={0.25}
          metalness={0.08}
          emissive={isActive ? '#facc15' : '#000000'}
          emissiveIntensity={isActive ? 0.3 : 0}
        />
      </RoundedBox>

      <Text
        position={[0, 0, 0.12]}
        fontSize={0.22}
        fontWeight={900}
        color={isActive ? '#000000' : (theme.keyText || '#14532d')}
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
    </group>
  );
});

export const Keyboard3D = React.memo(function Keyboard3D() {
  const groupRef = useRef();
  const { pressKey, capsLock, toggleCapsLock } = useTypingGameStore();
  const theme = useThemeStore((s) => s.theme);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    // Gentle floating breathing
    groupRef.current.position.y = -4.1 + Math.sin(t * 1.5) * 0.05;
    groupRef.current.rotation.x = -0.38 + Math.sin(t * 1.2) * 0.02;
  });

  return (
    <group ref={groupRef} position={[0, -4.1, 0.6]} rotation={[-0.38, 0, 0]}>
      {/* 1. Keyboard Chassis / Tray */}
      <RoundedBox position={[0, 0, -0.16]} args={[7.8, 2.8, 0.28]} radius={0.12} smoothness={4}>
        <meshStandardMaterial color={theme.keyboardTray} roughness={0.4} metalness={0.1} />
      </RoundedBox>

      {/* 2. Inner Rim Trim */}
      <RoundedBox position={[0, 0, -0.06]} args={[7.4, 2.4, 0.12]} radius={0.08} smoothness={4}>
        <meshStandardMaterial color={theme.keyboardTrim} roughness={0.6} metalness={0.15} />
      </RoundedBox>

      {/* 3. Letter Rows */}
      {KEYBOARD_ROWS.map((row, rowIdx) => {
        const rowWidth = row.length * 0.6;
        const startX = -rowWidth / 2 + 0.3;
        const yPos = 0.65 - rowIdx * 0.62;

        return (
          <group key={rowIdx} position={[0, yPos, 0]}>
            {row.map((char, colIdx) => (
              <group key={char} position={[startX + colIdx * 0.6, 0, 0]}>
                <KeyCap3D char={char} rowIdx={rowIdx} colIdx={colIdx} />
              </group>
            ))}
          </group>
        );
      })}

      {/* 4. Bottom Row: CAPS LOCK, SPACEBAR, BACKSPACE */}
      <group position={[0, -1.2, 0]}>
        {/* CAPS LOCK Toggle Button right on the 3D Keyboard */}
        <group position={[-2.8, 0, 0]}>
          <SpecialKeyCap3D
            label={capsLock ? 'CAPS ON' : 'CAPS'}
            width={1.2}
            color={capsLock ? '#fde047' : (theme.keyRowColors ? theme.keyRowColors[0] : '#f0fdf4')}
            isActive={capsLock}
            onClick={toggleCapsLock}
          />
        </group>

        {/* Spacebar */}
        <group position={[0.2, 0, 0]}>
          <SpecialKeyCap3D
            label="SPACE"
            width={4.2}
            color={theme.keySpacebar}
            onClick={() => pressKey(' ')}
          />
        </group>

        {/* Backspace */}
        <group position={[2.9, 0, 0]}>
          <SpecialKeyCap3D
            label="DEL"
            width={0.9}
            color="#fca5a5"
            onClick={() => pressKey('Backspace')}
          />
        </group>
      </group>
    </group>
  );
});
