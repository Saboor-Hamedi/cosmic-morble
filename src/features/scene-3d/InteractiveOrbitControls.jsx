import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useSelectionStore } from '../game-state/useSelectionStore.js';

export const InteractiveOrbitControls = React.memo(function InteractiveOrbitControls() {
  const controlsRef = useRef();
  const { cameraMode, selectedTarget, setIsMouseOrbiting } = useSelectionStore();
  const { camera } = useThree();

  const targetVec = useRef(new THREE.Vector3(0, 0, 0));

  useFrame(() => {
    if (cameraMode !== 'orbit') return;

    if (selectedTarget === 'spaceship') {
      const shipPos = useSelectionStore.getState().shipPosition || [0, 0, 0];
      targetVec.current.set(shipPos[0], shipPos[1], shipPos[2]);
    } else if (selectedTarget === 'sun') {
      targetVec.current.set(55, 32, -150);
    } else if (selectedTarget === 'moon') {
      targetVec.current.set(-48, 20, -115);
    } else if (selectedTarget === 'planet') {
      targetVec.current.set(24, -48, -90);
    }

    if (controlsRef.current) {
      controlsRef.current.target.lerp(targetVec.current, 0.15);
      controlsRef.current.update();
    }
  });

  useEffect(() => {
    if (cameraMode === 'orbit' && controlsRef.current) {
      if (selectedTarget === 'spaceship') {
        const shipPos = useSelectionStore.getState().shipPosition || [0, 0, 0];
        camera.position.set(shipPos[0] + 4.5, shipPos[1] + 2.8, shipPos[2] + 5.5);
      } else if (selectedTarget === 'sun') {
        camera.position.set(55 + 35, 32 + 15, -150 + 40);
      } else if (selectedTarget === 'moon') {
        camera.position.set(-48 + 22, 20 + 12, -115 + 25);
      } else if (selectedTarget === 'planet') {
        camera.position.set(24 + 65, -48 + 25, -90 + 75);
      }
    }
  }, [cameraMode, selectedTarget, camera]);

  return (
    <OrbitControls
      ref={controlsRef}
      enabled={cameraMode === 'orbit'}
      enablePan={true}
      enableZoom={true}
      enableRotate={true}
      rotateSpeed={1.1}
      zoomSpeed={1.2}
      onStart={() => setIsMouseOrbiting(true)}
      onEnd={() => setIsMouseOrbiting(false)}
    />
  );
});
