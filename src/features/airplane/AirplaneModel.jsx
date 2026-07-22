import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { RealisticJetPlume } from './RealisticJetPlume.jsx';

export const AirplaneModel = React.memo(function AirplaneModel({ speed }) {
  const bridgeGlowRef = useRef();
  const navPortRef = useRef();
  const navStbdRef = useRef();
  const radarRef = useRef();
  const canardPortRef = useRef();
  const canardStbdRef = useRef();

  // Create ultra-detailed stealth delta fuselage contour shape
  const fuselageGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 3.4);        // Nose cone tip
    shape.lineTo(0.65, 1.8);     // Forward chiseled shoulder
    shape.lineTo(0.95, -0.5);    // Mid fuselage breadth
    shape.lineTo(0.82, -2.4);    // Aft engine housing
    shape.lineTo(-0.82, -2.4);
    shape.lineTo(-0.95, -0.5);
    shape.lineTo(-0.65, 1.8);
    shape.closePath();

    const extrudeSettings = {
      steps: 2,
      depth: 0.72,
      bevelEnabled: true,
      bevelThickness: 0.14,
      bevelSize: 0.16,
      bevelSegments: 4
    };

    const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geom.center();
    return geom;
  }, []);

  // Create swept stealth delta wing geometry
  const wingGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 1.2);        // Wing root leading edge
    shape.lineTo(4.4, -1.1);     // Wingtip leading edge
    shape.lineTo(4.1, -2.0);     // Wingtip trailing edge
    shape.lineTo(0.8, -1.9);     // Wing root aft
    shape.lineTo(-0.8, -1.9);
    shape.lineTo(-4.1, -2.0);
    shape.lineTo(-4.4, -1.1);
    shape.closePath();

    const extrudeSettings = {
      steps: 1,
      depth: 0.12,
      bevelEnabled: true,
      bevelThickness: 0.04,
      bevelSize: 0.06,
      bevelSegments: 3
    };

    const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geom.center();
    return geom;
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (bridgeGlowRef.current) {
      bridgeGlowRef.current.intensity = 2.5 + Math.sin(t * 3.5) * 0.4;
    }
    if (radarRef.current) {
      radarRef.current.rotation.y += delta * 1.5;
    }
    if (navPortRef.current) {
      navPortRef.current.intensity = Math.sin(t * 8) > 0 ? 5.0 : 0.2;
    }
    if (navStbdRef.current) {
      navStbdRef.current.intensity = Math.sin(t * 8 + Math.PI) > 0 ? 5.0 : 0.2;
    }
    if (canardPortRef.current && canardStbdRef.current) {
      const pitchTilt = Math.sin(t * 2.5) * 0.08;
      canardPortRef.current.rotation.x = pitchTilt;
      canardStbdRef.current.rotation.x = pitchTilt;
    }
  });

  return (
    <group rotation={[0, Math.PI, 0]}>
      {/* 1. Primary Chiseled Stealth Fuselage & Armor Plating */}
      <mesh geometry={fuselageGeometry} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.2]}>
        <meshStandardMaterial
          color="#0b111e"
          metalness={0.95}
          roughness={0.12}
        />
      </mesh>

      {/* Dorsal Spine Armor Shield */}
      <mesh position={[0, 0.42, 0.1]}>
        <boxGeometry args={[1.1, 0.25, 3.8]} />
        <meshStandardMaterial color="#141c2e" metalness={0.92} roughness={0.16} />
      </mesh>

      {/* 2. Panoramic Armored Cockpit Canopy & Holographic HUD Deck */}
      <group position={[0, 0.58, 1.1]}>
        {/* Outer Dark Tinted Glass Canopy housing */}
        <mesh rotation={[0.22, 0, 0]}>
          <boxGeometry args={[0.95, 0.52, 1.45]} />
          <meshStandardMaterial
            color="#040c18"
            metalness={0.96}
            roughness={0.06}
          />
        </mesh>
        {/* Emissive Golden Front Observation Window */}
        <mesh position={[0, 0.1, 0.74]} rotation={[0.22, 0, 0]}>
          <boxGeometry args={[0.8, 0.18, 0.04]} />
          <meshBasicMaterial color="#ffb700" />
        </mesh>
        {/* Emissive Cyan Lower Tactical Viewport */}
        <mesh position={[0, -0.12, 0.74]} rotation={[0.22, 0, 0]}>
          <boxGeometry args={[0.86, 0.1, 0.04]} />
          <meshBasicMaterial color="#00ffff" />
        </mesh>
        {/* Side Panoramic Observation Windows */}
        <mesh position={[-0.48, 0.05, 0.3]} rotation={[0.22, -0.32, 0]}>
          <boxGeometry args={[0.04, 0.14, 0.65]} />
          <meshBasicMaterial color="#00ffff" />
        </mesh>
        <mesh position={[0.48, 0.05, 0.3]} rotation={[0.22, 0.32, 0]}>
          <boxGeometry args={[0.04, 0.14, 0.65]} />
          <meshBasicMaterial color="#00ffff" />
        </mesh>
        <pointLight ref={bridgeGlowRef} position={[0, 0.28, 0.9]} color="#ffb700" intensity={3.0} distance={4.0} />
      </group>

      {/* 3. Swept Aerodynamic Stealth Delta Wings */}
      <group position={[0, -0.05, -0.25]}>
        <mesh geometry={wingGeometry} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="#0f1626" metalness={0.94} roughness={0.14} />
        </mesh>
        {/* Glowing Cyan Wing Trailing Edge Plasma Slats */}
        <mesh position={[0, 0.08, -0.92]}>
          <boxGeometry args={[7.6, 0.06, 0.08]} />
          <meshBasicMaterial color="#00ffff" />
        </mesh>
        {/* Wingtip Weapon & Shield Generator Pods */}
        <mesh position={[-4.2, 0.04, 0.1]}>
          <boxGeometry args={[0.38, 0.22, 1.4]} />
          <meshStandardMaterial color="#080c14" metalness={0.98} roughness={0.06} />
        </mesh>
        <mesh position={[4.2, 0.04, 0.1]}>
          <boxGeometry args={[0.38, 0.22, 1.4]} />
          <meshStandardMaterial color="#080c14" metalness={0.98} roughness={0.06} />
        </mesh>
      </group>

      {/* 4. Variable-Geometry Forward Canards */}
      <group position={[0, 0.12, 1.6]}>
        <mesh ref={canardPortRef} position={[-1.5, 0, 0]} rotation={[0, 0.18, 0]}>
          <boxGeometry args={[1.9, 0.08, 0.55]} />
          <meshStandardMaterial color="#121a2c" metalness={0.92} roughness={0.12} />
        </mesh>
        <mesh ref={canardStbdRef} position={[1.5, 0, 0]} rotation={[0, -0.18, 0]}>
          <boxGeometry args={[1.9, 0.08, 0.55]} />
          <meshStandardMaterial color="#121a2c" metalness={0.92} roughness={0.12} />
        </mesh>
      </group>

      {/* 5. Twin Angled Command Vertical Stabilizers (Stealth Fins) */}
      <group position={[0, 0.65, -1.8]}>
        <mesh position={[-0.75, 0, 0]} rotation={[0.32, 0, -0.32]}>
          <boxGeometry args={[0.12, 1.45, 1.25]} />
          <meshStandardMaterial color="#0d1424" metalness={0.94} roughness={0.1]} />
        </mesh>
        <mesh position={[0.75, 0, 0]} rotation={[0.32, 0, 0.32]}>
          <boxGeometry args={[0.12, 1.45, 1.25]} />
          <meshStandardMaterial color="#0d1424" metalness={0.94} roughness={0.1]} />
        </mesh>
        <mesh position={[-0.77, 0.62, 0.55]} rotation={[0.32, 0, -0.32]}>
          <boxGeometry args={[0.08, 0.45, 0.08]} />
          <meshBasicMaterial color="#ff007f" />
        </mesh>
        <mesh position={[0.77, 0.62, 0.55]} rotation={[0.32, 0, 0.32]}>
          <boxGeometry args={[0.08, 0.45, 0.08]} />
          <meshBasicMaterial color="#ff007f" />
        </mesh>
      </group>

      {/* 6. Dorsal Sensor Radar Dish & Target Scanner Array */}
      <group position={[0, 0.72, 0.1]}>
        <mesh>
          <cylinderGeometry args={[0.2, 0.28, 0.28, 24]} />
          <meshStandardMaterial color="#182238" metalness={0.9} roughness={0.14} />
        </mesh>
        <group ref={radarRef} position={[0, 0.24, 0]} rotation={[-0.3, 0, 0]}>
          <mesh>
            <cylinderGeometry args={[0.48, 0.08, 0.1, 32]} />
            <meshStandardMaterial color="#22304d" metalness={0.95} roughness={0.08} />
          </mesh>
          <mesh position={[0, 0.14, 0]}>
            <coneGeometry args={[0.06, 0.35, 16]} />
            <meshBasicMaterial color="#00ffff" />
          </mesh>
        </group>
      </group>

      {/* 7. Quad Heavy Ion Afterburners & Continuous Volumetric Fire Plumes */}
      <RealisticJetPlume speed={speed} />

      {/* Navigation Wingtip LED Beacons */}
      <pointLight ref={navPortRef} position={[-4.3, 0, 0.1]} color="#ff2626" distance={5.0} intensity={5.0} />
      <pointLight ref={navStbdRef} position={[4.3, 0, 0.1]} color="#00ff88" distance={5.0} intensity={5.0} />
    </group>
  );
});
