import { create } from 'zustand';

export const useSelectionStore = create((set, get) => ({
  selectedTarget: 'spaceship', // 'spaceship' | 'sun' | 'moon' | 'planet' | null
  cameraMode: 'flight',        // 'flight' (chase camera) | 'orbit' (free 360 cursor orbit/rotation)
  isMouseOrbiting: false,
  shipPosition: [0, 0, 0],     // Real-time aircraft coordinates for infinite space wrapping & orbit target

  setSelectedTarget: (target) => set({ selectedTarget: target, cameraMode: 'orbit' }),
  setCameraMode: (mode) => set({ cameraMode: mode }),
  setIsMouseOrbiting: (isOrbiting) => set({ isMouseOrbiting: isOrbiting }),
  setShipPosition: (pos) => set({ shipPosition: pos }),
  toggleCameraMode: () => set((state) => ({
    cameraMode: state.cameraMode === 'flight' ? 'orbit' : 'flight'
  }))
}));
