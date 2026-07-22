import { useContext } from 'react';
import { GameContext } from './GameContext.jsx';

export function useGameStore() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameStore must be used within a GameProvider');
  }
  return context;
}
