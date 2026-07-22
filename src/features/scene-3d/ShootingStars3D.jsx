import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTypingGameStore } from '../typing-game/useTypingGameStore.js';
import * as THREE from 'three';

// ─── How many simultaneous shooting stars ──────────────────────────────────
const STAR_COUNT = 9;

// ─── One shooting star instance ────────────────────────────────────────────
const ShootingStar = React.memo(function ShootingStar({ starRef }) {
  const meshRef = useRef();
  const trailRef = useRef();

  useFrame((state, delta) => {
    const s = starRef.current;
    if (!s.active) {
      if (meshRef.current) meshRef.current.visible = false;
      if (trailRef.current) trailRef.current.visible = false;
      return;
    }

    const t = (Date.now() - s.startTime) / s.duration; // 0 → 1
    if (t >= 1) {
      s.active = false;
      if (meshRef.current) meshRef.current.visible = false;
      if (trailRef.current) trailRef.current.visible = false;
      return;
    }

    // Move along direction
    s.pos[0] += s.dir[0] * s.speed * delta;
    s.pos[1] += s.dir[1] * s.speed * delta;

    if (meshRef.current) {
      meshRef.current.visible = true;
      meshRef.current.position.set(s.pos[0], s.pos[1], s.pos[2]);
      // Fade in then out
      const fade = t < 0.15 ? t / 0.15 : t > 0.75 ? 1 - (t - 0.75) / 0.25 : 1;
      meshRef.current.material.opacity = 0.92 * fade;
      // Slight scale pulse
      const scl = 1 + Math.sin(t * Math.PI) * 0.3;
      meshRef.current.scale.set(scl * 3.5, scl * 0.55, scl * 0.55);
    }

    if (trailRef.current) {
      trailRef.current.visible = true;
      // Trail slightly behind the head
      trailRef.current.position.set(
        s.pos[0] - s.dir[0] * 1.4,
        s.pos[1] - s.dir[1] * 1.4,
        s.pos[2]
      );
      const fade = t < 0.15 ? t / 0.15 : t > 0.65 ? 1 - (t - 0.65) / 0.35 : 1;
      trailRef.current.material.opacity = 0.38 * fade;
      trailRef.current.scale.set(6.5, 0.28, 0.28);
    }
  });

  return (
    <group>
      {/* Bright head */}
      <mesh ref={meshRef} visible={false} castShadow={false} receiveShadow={false}>
        <sphereGeometry args={[0.14, 10, 10]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0} depthWrite={false} />
      </mesh>
      {/* Glowing comet tail */}
      <mesh ref={trailRef} visible={false} castShadow={false} receiveShadow={false}>
        <sphereGeometry args={[0.14, 8, 8]} />
        <meshBasicMaterial color="#a5f3fc" transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
});

// ─── Controller that watches streaks and fires stars ───────────────────────
export const ShootingStars3D = React.memo(function ShootingStars3D() {
  const streak = useTypingGameStore((s) => s.streak);

  // Mutable star state stored in refs (not React state — no re-render needed)
  const stars = useMemo(() => {
    return Array.from({ length: STAR_COUNT }, (_, i) => ({
      id: i,
      ref: { current: { active: false, pos: [0, 0, 0], dir: [0, 0], speed: 0, startTime: 0, duration: 0 } }
    }));
  }, []);

  // Track last milestone to avoid re-firing on same streak
  const lastMilestoneRef = useRef(0);

  useEffect(() => {
    // Trigger on every new multiple of 5 (5, 10, 15, …)
    const milestone = Math.floor(streak / 5) * 5;
    if (streak >= 5 && milestone > lastMilestoneRef.current) {
      lastMilestoneRef.current = milestone;
      fireCelebration(stars, streak);
    }
    if (streak === 0) lastMilestoneRef.current = 0;
  }, [streak, stars]);

  return (
    <group>
      {stars.map((s) => (
        <ShootingStar key={s.id} starRef={s.ref} />
      ))}
    </group>
  );
});

// ─── Spawn a burst of shooting stars on combo milestone ───────────────────
function fireCelebration(stars, streak) {
  // More stars for higher streaks
  const count = Math.min(STAR_COUNT, 4 + Math.floor(streak / 5));

  // Pick `count` idle stars to activate
  const idle = stars.filter((s) => !s.ref.current.active);
  const chosen = idle.slice(0, count);

  chosen.forEach((s, i) => {
    const state = s.ref.current;

    // Spawn anywhere along the top/sides of the scene
    const spawnEdge = Math.random();
    let startX, startY;
    if (spawnEdge < 0.5) {
      // From top-left area streaking right-and-down
      startX = -14 + Math.random() * 8;
      startY = 7 + Math.random() * 3;
    } else {
      // From top-right area streaking left-and-down
      startX = 6 + Math.random() * 8;
      startY = 7 + Math.random() * 3;
    }

    const angle = (spawnEdge < 0.5 ? -0.38 : -2.75) + (Math.random() - 0.5) * 0.35;

    state.active = true;
    state.pos = [startX, startY, -3.5 - Math.random() * 2];
    state.dir = [Math.cos(angle), Math.sin(angle)];
    state.speed = 12 + Math.random() * 8;
    state.duration = 1000 + Math.random() * 600; // ms
    state.startTime = Date.now() + i * 90; // stagger each star by 90 ms
  });
}
