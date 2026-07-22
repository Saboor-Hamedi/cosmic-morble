import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTypingGameStore } from '../typing-game/useTypingGameStore.js';

const STAR_COUNT = 16;
const TRAIL_LEN = 12;

// ─── Rich colour palettes per star — head color + trail gradient ───────────
const PALETTES = [
  { head: '#ffffff', trail: ['#ffffff','#fffde7','#fff176','#ffee58','#fdd835','#f9a825','#ff8f00','#e65100','#bf360c','#4e342e','#212121','#000000'] },
  { head: '#e3f2fd', trail: ['#e3f2fd','#bbdefb','#90caf9','#64b5f6','#42a5f5','#2196f3','#1e88e5','#1976d2','#1565c0','#0d47a1','#1a237e','#000000'] },
  { head: '#fce4ec', trail: ['#fce4ec','#f8bbd0','#f48fb1','#f06292','#ec407a','#e91e63','#d81b60','#c2185b','#ad1457','#880e4f','#4a0020','#000000'] },
  { head: '#e8f5e9', trail: ['#e8f5e9','#c8e6c9','#a5d6a7','#81c784','#66bb6a','#4caf50','#43a047','#388e3c','#2e7d32','#1b5e20','#0a2e0a','#000000'] },
  { head: '#f3e5f5', trail: ['#f3e5f5','#e1bee7','#ce93d8','#ba68c8','#ab47bc','#9c27b0','#8e24aa','#7b1fa2','#6a1b9a','#4a148c','#1a0030','#000000'] },
  { head: '#fff3e0', trail: ['#fff3e0','#ffe0b2','#ffcc80','#ffb74d','#ffa726','#ff9800','#fb8c00','#f57c00','#ef6c00','#e65100','#bf360c','#000000'] },
  { head: '#e0f7fa', trail: ['#e0f7fa','#b2ebf2','#80deea','#4dd0e1','#26c6da','#00bcd4','#00acc1','#0097a7','#00838f','#006064','#002828','#000000'] },
  { head: '#fffde7', trail: ['#fffde7','#fff9c4','#fff59d','#fff176','#ffee58','#ffeb3b','#fdd835','#fbc02d','#f9a825','#f57f17','#7f3f00','#000000'] },
];

// ─── One meteor ────────────────────────────────────────────────────────────
const Meteor = React.memo(function Meteor({ slot }) {
  const headRef = useRef();
  const glowRef = useRef();
  const trailRefs = useRef(Array.from({ length: TRAIL_LEN }, () => null));

  useFrame((_, delta) => {
    const s = slot.current;

    if (!s.active) {
      if (headRef.current) headRef.current.visible = false;
      if (glowRef.current) glowRef.current.visible = false;
      trailRefs.current.forEach(r => { if (r) r.visible = false; });
      return;
    }

    const now = Date.now();
    const elapsed = now - s.startTime;

    if (elapsed < s.delay) {
      if (headRef.current) headRef.current.visible = false;
      if (glowRef.current) glowRef.current.visible = false;
      trailRefs.current.forEach(r => { if (r) r.visible = false; });
      return;
    }

    const t = Math.min((elapsed - s.delay) / s.duration, 1);
    if (t >= 1) {
      s.active = false;
      if (headRef.current) headRef.current.visible = false;
      if (glowRef.current) glowRef.current.visible = false;
      trailRefs.current.forEach(r => { if (r) r.visible = false; });
      return;
    }

    // Ease-in acceleration for dramatic feel
    const tAccel = t * t * 0.55 + t * 0.45;

    const curX = s.startX + s.velX * tAccel;
    const curY = s.startY + (s.endY - s.startY) * tAccel; // falls DOWN
    const curZ = s.startZ + (s.endZ - s.startZ) * tAccel; // comes FORWARD

    // Grows as it approaches
    const proximity = tAccel;
    const headScale = 0.05 + proximity * 0.55;
    const glowScale = headScale * 2.8;

    // Fade in fast, hold, fade out near end
    const fade = t < 0.07 ? t / 0.07 : t > 0.78 ? 1 - (t - 0.78) / 0.22 : 1;

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
      glowRef.current.material.opacity = 0.25 * fade;
    }

    // Trail: each segment is a snapshot of where the head was slightly earlier
    trailRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const segFrac = (i + 1) / TRAIL_LEN;
      const trailT = Math.max(0, tAccel - segFrac * 0.28);
      const trailX = s.startX + s.velX * trailT;
      const trailY = s.startY + (s.endY - s.startY) * trailT;
      const trailZ = s.startZ + (s.endZ - s.startZ) * trailT;
      const trailScale = Math.max(0.008, headScale * (1 - segFrac * 0.86));
      const trailOpacity = Math.max(0, (1 - segFrac) * 0.92 * fade);

      mesh.visible = tAccel > segFrac * 0.12;
      mesh.position.set(trailX, trailY, trailZ);
      mesh.scale.setScalar(trailScale);
      mesh.material.opacity = trailOpacity;
    });
  });

  return (
    <group>
      <mesh ref={headRef} visible={false} castShadow={false} receiveShadow={false}>
        <sphereGeometry args={[1, 14, 14]} />
        <meshBasicMaterial color={slot.current.palette?.head || '#ffffff'} transparent opacity={0} depthWrite={false} />
      </mesh>

      <mesh ref={glowRef} visible={false} castShadow={false} receiveShadow={false}>
        <sphereGeometry args={[1, 10, 10]} />
        <meshBasicMaterial color={slot.current.palette?.head || '#fffde7'} transparent opacity={0} depthWrite={false} />
      </mesh>

      {Array.from({ length: TRAIL_LEN }, (_, i) => (
        <mesh
          key={i}
          ref={el => { trailRefs.current[i] = el; }}
          visible={false}
          castShadow={false}
          receiveShadow={false}
        >
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial
            color={slot.current.palette?.trail[i] || '#006064'}
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
let _seed = 137;
function sr() {
  _seed = (_seed * 16807 + 13) % 2147483647;
  return (_seed - 1) / 2147483646;
}

function launchMeteor(slot, index) {
  const s = slot.current;
  const palette = PALETTES[Math.floor(sr() * PALETTES.length)];

  // Start: spread across the top of the sky
  s.startX = (sr() - 0.5) * 22;
  s.startY = 9 + sr() * 5;       // high up
  s.startZ = -16 - sr() * 10;    // deep background

  // End: falls DOWN past the bottom, while zooming forward
  s.endY = -8 - sr() * 5;        // falls way down off screen
  s.endZ = -1.5;                  // close to camera
  s.velX = (sr() - 0.5) * 3.5;  // slight horizontal drift

  s.duration = 1400 + sr() * 800;
  s.delay = index * 130;
  s.startTime = Date.now();
  s.palette = palette;
  s.active = true;
}

// ─── Controller ────────────────────────────────────────────────────────────
export const ShootingStars3D = React.memo(function ShootingStars3D() {
  const streak = useTypingGameStore(s => s.streak);
  const lastMilestone = useRef(0);

  const slots = useMemo(() =>
    Array.from({ length: STAR_COUNT }, () => ({
      current: {
        active: false, startX: 0, startY: 0, startZ: 0,
        endY: 0, endZ: 0, velX: 0,
        duration: 0, delay: 0, startTime: 0, palette: PALETTES[0]
      }
    })), []);

  useEffect(() => {
    const milestone = Math.floor(streak / 5) * 5;
    if (streak >= 5 && milestone > lastMilestone.current) {
      lastMilestone.current = milestone;
      // More stars for higher streaks
      const count = Math.min(STAR_COUNT, 5 + Math.floor(streak / 5));
      let fired = 0;
      for (let i = 0; i < slots.length && fired < count; i++) {
        if (!slots[i].current.active) {
          launchMeteor(slots[i], fired);
          fired++;
        }
      }
    }
    if (streak === 0) lastMilestone.current = 0;
  }, [streak, slots]);

  return (
    <group>
      {slots.map((slot, i) => <Meteor key={i} slot={slot} />)}
    </group>
  );
});
