import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { CelestialSun } from './CelestialSun.jsx';
import { CelestialMoon } from './CelestialMoon.jsx';
import { OrbitalPlanet } from './OrbitalPlanet.jsx';
import { useSelectionStore } from '../game-state/useSelectionStore.js';

export const InfiniteSolarSystem = React.memo(function InfiniteSolarSystem() {
  const solarGroupRef = useRef();
  const solarBoxSize = 350;
  const halfSolarBox = solarBoxSize / 2;

  useFrame(() => {
    if (!solarGroupRef.current) return;
    const shipPos = useSelectionStore.getState().shipPosition || [0, 0, 0];
    const px = shipPos[0];
    const py = shipPos[1];
    const pz = shipPos[2];

    let dx = (0 - px) % solarBoxSize;
    if (dx > halfSolarBox) dx -= solarBoxSize;
    else if (dx < -halfSolarBox) dx += solarBoxSize;

    let dy = (0 - py) % solarBoxSize;
    if (dy > halfSolarBox) dy -= solarBoxSize;
    else if (dy < -halfSolarBox) dy += solarBoxSize;

    let dz = (0 - pz) % solarBoxSize;
    if (dz > halfSolarBox) dz -= solarBoxSize;
    else if (dz < -halfSolarBox) dz += solarBoxSize;

    solarGroupRef.current.position.set(px + dx, py + dy, pz + dz);
  });

  return (
    <group ref={solarGroupRef}>
      <CelestialSun />
      <CelestialMoon />
      <OrbitalPlanet />
    </group>
  );
});
