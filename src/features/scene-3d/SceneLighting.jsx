import React, { memo } from 'react';

export const SceneLighting = memo(function SceneLighting() {
  return (
    <group>
      {/* Soft Galactic Ambient Fill */}
      <ambientLight intensity={0.65} color="#5e82c4" />

      {/* Primary White Key Light for Crisp Specular Highlights & Bevels */}
      <directionalLight
        position={[12, 20, 15]}
        intensity={2.8}
        color="#ffffff"
      />

      {/* Cyan Ion Rim Light (Port Side / Planet Atmosphere Reflection) */}
      <pointLight
        position={[-10, -3, 6]}
        intensity={5.0}
        color="#00f0ff"
        distance={30}
        decay={1.8}
      />

      {/* Golden / Magenta Rim Light (Starboard Side / Nebula Bounce) */}
      <pointLight
        position={[10, 6, -5]}
        intensity={4.5}
        color="#ff007f"
        distance={30}
        decay={1.8}
      />

      {/* Solar Warmth Key Light (From Sun direction) */}
      <pointLight
        position={[35, 20, -90]}
        intensity={12.0}
        color="#ffbb44"
        distance={250}
        decay={1.5}
      />

      {/* Ventral Blue Planet Albedo Bounce Light (Underneath Cruiser) */}
      <pointLight
        position={[0, -15, -10]}
        intensity={3.5}
        color="#1060d0"
        distance={40}
        decay={1.8}
      />
    </group>
  );
});
