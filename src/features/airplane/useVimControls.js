import { useEffect } from 'react';
import { useGameStore } from '../game-state/useGameStore.js';
import { useSelectionStore } from '../game-state/useSelectionStore.js';

export function useVimControls() {
  const { registerKey, resetAttitude } = useGameStore();

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      
      // Instant Quit/Close Shortcuts
      if (key === 'q' || e.key === 'Escape') {
        if (window.electronAPI?.close) {
          window.electronAPI.close();
        } else {
          window.close();
        }
        return;
      }

      // Toggle Free 360 Cursor Orbit Rotation Mode ('v' or 'i')
      if (key === 'v' || key === 'i') {
        const { cameraMode, toggleCameraMode } = useSelectionStore.getState();
        toggleCameraMode();
        return;
      }

      if (key === 'h') registerKey('h', true);
      else if (key === 'j') registerKey('j', true);
      else if (key === 'k') registerKey('k', true);
      else if (key === 'l') registerKey('l', true);
      else if (key === 'w' || key === '+' || key === '=') registerKey('w', true);
      else if (key === 'b' || key === '-' || key === '_') registerKey('b', true);
      else if (key === '0' || key === ' ') registerKey('zero', true);
      else if (key === 'r') resetAttitude();
    };

    const handleKeyUp = (e) => {
      const key = e.key.toLowerCase();
      if (key === 'h') registerKey('h', false);
      else if (key === 'j') registerKey('j', false);
      else if (key === 'k') registerKey('k', false);
      else if (key === 'l') registerKey('l', false);
      else if (key === 'w' || key === '+' || key === '=') registerKey('w', false);
      else if (key === 'b' || key === '-' || key === '_') registerKey('b', false);
      else if (key === '0' || key === ' ') registerKey('zero', false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [registerKey, resetAttitude]);
}
