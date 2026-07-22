import React, { memo } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { FloatingShips3D } from '../typing-game/FloatingShips3D.jsx';
import { BalloonBursts3D } from '../typing-game/BalloonBursts3D.jsx';
import { FluffyClouds3D } from './FluffyClouds3D.jsx';
import { FloatingBackgroundWaterBubbles3D } from './FloatingBackgroundWaterBubbles3D.jsx';
import { ShootingStars3D } from './ShootingStars3D.jsx';
import { EarthIsland3D } from './EarthIsland3D.jsx';
import { useThemeStore } from '../theme/useThemeStore.js';

export const SceneContainer = memo(function SceneContainer() {
  const theme = useThemeStore((s) => s.theme);

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      zIndex: 1,
      pointerEvents: 'auto',
      background: theme.skyGradient,
      overflow: 'hidden'
    }}>
      {theme.previewImg && (
        <img
          src={theme.previewImg}
          alt={theme.name}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            zIndex: 0,
            pointerEvents: 'none',
            opacity: 0.95,
            filter: 'brightness(0.66) contrast(1.15) saturate(1.1)',
            transition: 'opacity 0.4s ease, filter 0.4s ease'
          }}
        />
      )}
      {/* Subtle Dark Vignette Overlay (`make the themes a little dark`) so glowing water bubbles and letters stand out vividly */}
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        background: 'radial-gradient(circle at center, rgba(15, 23, 42, 0.35) 0%, rgba(2, 6, 23, 0.78) 100%)'
      }} />
      <Canvas
        style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%' }}
        camera={{ position: [0, 0, 8.5], fov: 48, near: 0.1, far: 1000 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.NoToneMapping
        }}
        dpr={[1, 2]}
      >
        {/* Dynamic Studio & Directional Lighting matching active 3D Theme */}
        <ambientLight intensity={theme.ambientIntensity || 0.88} color={theme.ambientColor} />
        <directionalLight position={[7, 12, 9]} intensity={0.95} color="#ffffff" />
        <directionalLight position={[-6, -4, -4]} intensity={0.45} color={theme.directionalColor} />

        {/* 15 Serene, interactive fluffy clouds styled by theme */}
        <FluffyClouds3D />

        {/* Ambient real water bubbles floating in the deep background */}
        <FloatingBackgroundWaterBubbles3D />

        {/* 🌠 Shooting stars — burst across the sky on every 5x combo milestone */}
        <ShootingStars3D />

        {/* 3D Floating Low-Poly Earth Islands (Crystal Aqua, Pine Valley, Sakura Sanctuary, etc.) */}
        <EarthIsland3D />

        {/* 3D Glass Water Orb Letters (`media__1784724416174.png`) rising out of the Earth */}
        <FloatingShips3D />
        <BalloonBursts3D />
      </Canvas>
    </div>
  );
});
