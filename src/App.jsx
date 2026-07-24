import React, { useEffect } from 'react';
import { GameProvider } from './features/game-state/GameContext.jsx';
import { GameLayout } from './features/layout/GameLayout.jsx';
import { useTypingGameStore } from './features/typing-game/useTypingGameStore.js';
import { useThemeStore } from './features/theme/useThemeStore.js';
import { UpdaterBadge } from './features/updater/UpdaterBadge.jsx';
import { VersionBadge } from './features/hud/VersionBadge.jsx';

function GlobalKeyboardListener() {
  const pressKey = useTypingGameStore((s) => s.pressKey);
  const togglePaused = useTypingGameStore((s) => s.togglePaused);

  useEffect(() => {
    // Force focus immediately and repeatedly on startup so typing works instantly without clicking (`make sure the moment i run the app we can type`)
    const forceFocus = () => {
      try {
        window.focus();
        if (document.activeElement && document.activeElement !== document.body) {
          document.activeElement.blur();
        }
      } catch (_) {}
    };

    forceFocus();
    const t1 = setTimeout(forceFocus, 80);
    const t2 = setTimeout(forceFocus, 250);
    const t3 = setTimeout(forceFocus, 600);
    const t4 = setTimeout(forceFocus, 1200);

    const handleKeyDown = (e) => {
      // Allow Enter to start the game if in menu or game over
      const state = useTypingGameStore.getState();
      if ((e.key === 'Enter' || e.code === 'Enter' || e.code === 'NumpadEnter') && state.gameState !== 'playing') {
        e.preventDefault();
        state.startGame();
        return;
      }

      // Check for Ctrl + Enter toggle pause (`cntl + enter toggle the game stop and start`)
      if (e.ctrlKey && (e.key === 'Enter' || e.code === 'Enter' || e.code === 'NumpadEnter')) {
        e.preventDefault();
        togglePaused();
        return;
      }

      // Check for Ctrl + Alt mode switch (`cntl + alt switch between letter and word`)
      if (e.ctrlKey && e.altKey) {
        e.preventDefault();
        const currentMode = state.mode;
        state.setMode(currentMode === 'letters' ? 'words' : 'letters');
        return;
      }

      // Check for Ctrl + S to change sound theme
      if (e.ctrlKey && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        state.cycleSoundTheme();
        return;
      }

      // Ctrl+T → cycle theme
      if (e.ctrlKey && (e.key === 't' || e.key === 'T')) {
        e.preventDefault();
        useThemeStore.getState().cycleTheme();
        return;
      }

      // Ignore modifier combinations (except pure letters/space/backspace/capslock)
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      // Intercept letters, space, or CapsLock right at the capture phase
      if (e.repeat) return; // Fix bug: prevent key holding from bursting multiple balloons instantly
      
      // ONLY allow typing if the game is actually playing
      if (state.gameState === 'playing' && (e.key === 'CapsLock' || (e.key && e.key.length === 1))) {
        pressKey(e.key);
      }
    };

    const handlePointerDown = () => {
      forceFocus();
    };

    window.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('pointerdown', handlePointerDown, true);
    window.addEventListener('focus', forceFocus, true);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      window.removeEventListener('keydown', handleKeyDown, true);
      window.removeEventListener('pointerdown', handlePointerDown, true);
      window.removeEventListener('focus', forceFocus, true);
    };
  }, [pressKey, togglePaused]);

  return null;
}

export default function App() {
  useEffect(() => {
    // Load SQLite3 database progress!
    useTypingGameStore.getState().loadProgress();
  }, []);

  return (
    <GameProvider>
      <GlobalKeyboardListener />
      <GameLayout />
      <UpdaterBadge />
      <VersionBadge />
    </GameProvider>
  );
}
