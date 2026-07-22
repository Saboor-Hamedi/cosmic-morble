import React, { createContext, useState, useCallback, useMemo } from 'react';
import { audioManager } from '../audio/AudioContextManager.js';
import { playBoostSound, playHoverSound } from '../audio/SoundSynthesizer.js';

export const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [speed, setSpeed] = useState(2.5); // Range: 0 to 12
  const [pitch, setPitch] = useState(0);   // Radians
  const [roll, setRoll] = useState(0);     // Radians
  const [yaw, setYaw] = useState(0);       // Radians
  const [isMuted, setIsMuted] = useState(false);

  const [activeKeys, setActiveKeys] = useState({
    h: false,
    j: false,
    k: false,
    l: false,
    w: false,
    b: false,
    zero: false,
    r: false,
  });

  const registerKey = useCallback((key, isDown) => {
    setActiveKeys((prev) => {
      if (prev[key] === isDown) return prev;
      return { ...prev, [key]: isDown };
    });
  }, []);

  const resetAttitude = useCallback(() => {
    setPitch(0);
    setRoll(0);
    setSpeed(2.5);
    playHoverSound();
  }, []);

  const toggleMute = useCallback(() => {
    const nextMuted = audioManager.toggleMute();
    setIsMuted(nextMuted);
  }, []);

  const value = useMemo(() => ({
    speed,
    setSpeed,
    pitch,
    setPitch,
    roll,
    setRoll,
    yaw,
    setYaw,
    activeKeys,
    registerKey,
    resetAttitude,
    isMuted,
    toggleMute,
  }), [
    speed,
    pitch,
    roll,
    yaw,
    activeKeys,
    registerKey,
    resetAttitude,
    isMuted,
    toggleMute,
  ]);

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}
