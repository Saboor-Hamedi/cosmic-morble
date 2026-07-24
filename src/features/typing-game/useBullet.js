import { create } from 'zustand';

export const useBullet = create((set) => ({
  bullets: [],
  fireBullet: (start, target, color, targetId) => {
    const bullet = {
      id: Date.now() + Math.random(),
      start,
      target,
      color,
      targetId,
      timestamp: Date.now()
    };
    set((state) => ({ bullets: [...state.bullets, bullet] }));
  },
  removeBullet: (id) => {
    set((state) => ({ bullets: state.bullets.filter(b => b.id !== id) }));
  }
}));
