import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { AirplaneModel } from './AirplaneModel.jsx';
import { useGameStore } from '../game-state/useGameStore.js';
import { useSelectionStore } from '../game-state/useSelectionStore.js';
import { useVimControls } from './useVimControls.js';
import { playEngineRoar } from '../audio/SoundSynthesizer.js';

export const AirplaneContainer = React.memo(function AirplaneContainer() {
  useVimControls();

  const {
    speed,
    setSpeed,
    pitch,
    setPitch,
    roll,
    setRoll,
    yaw,
    setYaw,
    activeKeys,
  } = useGameStore();

  const { cameraMode, setSelectedTarget } = useSelectionStore();

  const planeRef = useRef();
  const { camera } = useThree();

  useFrame((state, delta) => {
    let nextPitch = pitch;
    let nextRoll = roll;
    let nextYaw = yaw;
    let nextSpeed = speed;

    if (activeKeys.h) {
      nextRoll = THREE.MathUtils.clamp(roll + delta * 2.6, -Math.PI / 2.6, Math.PI / 2.6);
      nextYaw += delta * 1.3 * (0.5 + speed * 0.15);
    } else if (activeKeys.l) {
      nextRoll = THREE.MathUtils.clamp(roll - delta * 2.6, -Math.PI / 2.6, Math.PI / 2.6);
      nextYaw -= delta * 1.3 * (0.5 + speed * 0.15);
    } else {
      nextRoll = THREE.MathUtils.lerp(roll, 0, delta * 3.5);
    }

    if (activeKeys.k) {
      nextPitch = THREE.MathUtils.clamp(pitch + delta * 1.8, -Math.PI / 2.8, Math.PI / 2.8);
    } else if (activeKeys.j) {
      nextPitch = THREE.MathUtils.clamp(pitch - delta * 1.8, -Math.PI / 2.8, Math.PI / 2.8);
    } else {
      nextPitch = THREE.MathUtils.lerp(pitch, 0, delta * 2.5);
    }

    if (activeKeys.w) {
      nextSpeed = Math.min(12.0, speed + delta * 4.5);
      playEngineRoar(nextSpeed, true);
    } else if (activeKeys.b) {
      nextSpeed = Math.max(0.0, speed - delta * 5.0);
    } else if (activeKeys.zero) {
      nextSpeed = THREE.MathUtils.lerp(speed, 2.5, delta * 4);
    }

    setPitch(nextPitch);
    setRoll(nextRoll);
    setYaw(nextYaw);
    if (nextSpeed !== speed) {
      setSpeed(nextSpeed);
    }

    if (planeRef.current) {
      const targetEuler = new THREE.Euler(nextPitch, nextYaw, nextRoll, 'YXZ');
      planeRef.current.quaternion.slerp(new THREE.Quaternion().setFromEuler(targetEuler), 0.22);

      const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(planeRef.current.quaternion);
      planeRef.current.position.addScaledVector(forward, nextSpeed * delta);

      // Save real-time ship coordinates to useSelectionStore for infinite galaxy wrapping and orbit target
      useSelectionStore.getState().setShipPosition([
        planeRef.current.position.x,
        planeRef.current.position.y,
        planeRef.current.position.z
      ]);

      // Chase Camera controls (ONLY active when cameraMode === 'flight'; otherwise OrbitControls allows 360 degree cursor rotation!)
      if (cameraMode === 'flight') {
        const targetFov = THREE.MathUtils.lerp(50, 72, Math.min(1.0, nextSpeed / 12.0));
        if (Math.abs(camera.fov - targetFov) > 0.1) {
          camera.fov = THREE.MathUtils.lerp(camera.fov, targetFov, delta * 4);
          camera.updateProjectionMatrix();
        }

        const pullBackZ = 6.5 + (nextSpeed / 12.0) * 1.5;
        const dropY = 2.2 - (nextSpeed / 12.0) * 0.4;
        const cameraOffset = new THREE.Vector3(0, dropY, pullBackZ).applyQuaternion(planeRef.current.quaternion);
        const targetCameraPos = planeRef.current.position.clone().add(cameraOffset);

        if (nextSpeed > 8.0) {
          const shake = Math.sin(state.clock.elapsedTime * 45) * ((nextSpeed - 8.0) * 0.015);
          targetCameraPos.x += shake;
          targetCameraPos.y += shake * 0.6;
        }

        camera.position.lerp(targetCameraPos, 0.14);
        camera.lookAt(planeRef.current.position);
      }
    }
  });

  return (
    <group
      ref={planeRef}
      position={[0, 0, 0]}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedTarget('spaceship');
      }}
    >
      <AirplaneModel speed={speed} />
    </group>
  );
});
