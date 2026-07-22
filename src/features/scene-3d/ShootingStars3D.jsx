import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTypingGameStore } from '../typing-game/useTypingGameStore.js';
import * as THREE from 'three';

const STAR_COUNT = 8;

// ─── Trail segment count per star ─────────────────────────────────────────
const TRAIL_LEN = 10;

// ─── Colors: bright white head → golden → cyan tail ──────────────────────
const TRAIL_COLORS = [
  '#ffffff', '#fffde7', '#fff9c4', '#e0f7fa',
  '#b2ebf2', '#80deea', '#4dd0e1', '#26c6da',
  '#00bcd4', '#006064'
];

// ─── Single meteor coming straight at the camera ──────────────────────────
const Meteor = React.memo(function Meteor({ slot }) {
  const headRef = useRef();
  const glowRef = useRef();
  const trailRefs = useRef(Array.from({ length: TRAIL_LEN }, () => ({ current: null })));

  useFrame((state, delta) => {
    const s = slot.current;
    if (!s.active) {
      if (headRef.current) headRef.current.visible = false;
      if (glowRef.current) glowRef.current.visible = false;
      trailRefs.current.forEach(r => { if (r.current) r.current.visible = false; });
      return;
    }

    const now = Date.now();
    const elapsed = now - s.startTime;

    // Staggered delay
    if (elapsed < s.delay) {
      if (headRef.current) headRef.current.visible = false;
      if (glowRef.current) glowRef.current.visible = false;
      trailRefs.current.forEach(r => { if (r.current) r.current.visible = false; });
      return;
    }

    const t = Math.min((elapsed - s.delay) / s.duration, 1); // 0→1
    if (t >= 1) {
      s.active = false;
      if (headRef.current) headRef.current.visible = false;
      if (glowRef.current) glowRef.current.visible = false;
      trailRefs.current.forEach(r => { if (r.current) r.current.visible = false; });
      return;
    }

    // Accelerate as it approaches (ease-in)
    const tAccel = t * t * 0.6 + t * 0.4;

    // Current Z: from startZ (far back) → endZ (close to camera)
    const curZ = s.startZ + (s.endZ - s.startZ) * tAccel;
    const curX = s.startX + s.driftX * tAccel;
    const curY = s.startY + (s.endY - s.startY) * tAccel;

    // Scale grows dramatically as it approaches (perspective zoom-in feel)
    const proximity = (curZ - s.startZ) / (s.endZ - s.startZ); // 0→1
    const headScale = 0.04 + proximity * proximity * 0.55;
    const glowScale = headScale * 3.2;

    // Fade: appear quickly, hold, then fade out near camera
    const fade = t < 0.08 ? t / 0.08 : t > 0.82 ? 1 - (t - 0.82) / 0.18 : 1;

    if (headRef.current) {
      headRef.current.visible = true;
      headRef.current.position.set(curX, curY, curZ);
      headRef.current.scale.setScalar(headScale);
      headRef.current.material.opacity = 0.98 * fade;
    }

    if (glowRef.current) {
      glowRef.current.visible = true;
      glowRef.current.position.set(curX, curY, curZ);
      glowRef.current.scale.setScalar(glowScale);
      glowRef.current.material.opacity = 0.22 * fade;
    }

    // Draw trail: each segment stretches backward in Z from the head
    trailRefs.current.forEach((ref, i) => {
      if (!ref.current) return;
      const segFrac = (i + 1) / TRAIL_LEN; // 0.1 → 1.0 (1 = furthest back)
      const trailT = Math.max(0, tAccel - segFrac * 0.22); // trail lags behind head
      const trailZ = s.startZ + (s.endZ - s.startZ) * trailT;
      const trailX = s.startX + s.driftX * trailT;
      const trailY = s.startY + (s.endY - s.startY) * trailT;

      const trailScale = Math.max(0.005, headScale * (1 - segFrac * 0.82));
      const trailOpacity = (1 - segFrac) * 0.88 * fade;

      ref.current.visible = tAccel > segFrac * 0.15;
      ref.current.position.set(trailX, trailY, trailZ);
      ref.current.scale.setScalar(trailScale);
      ref.current.material.opacity = trailOpacity;
    });
  });

  return (
    <group>
      {/* Bright white head */}
      <mesh ref={headRef} visible={false} castShadow={false} receiveShadow={false}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Soft outer aura glow */}
      <mesh ref={glowRef} visible={false} castShadow={false} receiveShadow={false}>
        <sphereGeometry args={[1, 12, 12]} />
        <meshBasicMaterial color="#fffde7" transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Trail segments — colour fades from warm white → deep cyan */}
      {Array.from({ length: TRAIL_LEN }, (_, i) => (
        <mesh
          key={i}
          ref={(el) => { trailRefs.current[i] = { current: el }; }}
          visible={false}
          castShadow={false}
          receiveShadow={false}
        >
          <sphereGeometry args={[1, 10, 10]} />
          <meshBasicMaterial
            color={TRAIL_COLORS[i] || '#006064'}
            transparent
            opacity={0}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
});

// ─── Seeded random ─────────────────────────────────────────────────────────
let _seed = 77;
function sr() {
  _seed = (_seed * 16807) % 2147483647;
  return (_seed - 1) / 2147483646;
}

function fireMeteor(slot, index, streakCount) {
  const s = slot.current;
  // Spawn high in the sky, spread across X, deep in Z
  s.startX = (sr() - 0.5) * 18;
  s.startY = 7 + sr() * 5;
  s.startZ = -18 - sr() * 8;    // deep background
  s.driftX = (sr() - 0.5) * 1.4; // very slight horizontal drift
  s.endY = s.startY - 1.5 - sr() * 2; // slight downward arc
  s.endZ = -0.8;                 // zooms right to near the camera
  s.duration = 1600 + sr() * 700; // ms
  s.delay = index * 110;         // stagger
  s.startTime = Date.now();
  s.active = true;
}

// ─── Main component ────────────────────────────────────────────────────────
export const ShootingStars3D = React.memo(function ShootingStars3D() {
  const streak = useTypingGameStore((s) => s.streak);
  const lastMilestoneRef = useRef(0);

  const slots = useMemo(() =>
    Array.from({ length: STAR_COUNT }, () => ({
      current: {
        active: false, startX: 0, startY: 0, startZ: 0,
        driftX: 0, endY: 0, endZ: 0,
        duration: 0, delay: 0, startTime: 0
      }
    })), []);

  useEffect(() => {
    const milestone = Math.floor(streak / 5) * 5;
    if (streak >= 5 && milestone > lastMilestoneRef.current) {
      lastMilestoneRef.current = milestone;
      const count = Math.min(STAR_COUNT, 3 + Math.floor(streak / 5));
      let fired = 0;
      for (let i = 0; i < slots.length && fired < count; i++) {
        if (!slots[i].current.active) {
          fireMeteor(slots[i], fired, streak);
          fired++;
        }
      }
    }
    if (streak === 0) lastMilestoneRef.current = 0;
  }, [streak, slots]);

  return (
    <group>
      {slots.map((slot, i) => (
        <Meteor key={i} slot={slot} />
      ))}
    </group>
  );
});
