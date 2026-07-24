import React, { memo } from 'react';
import { TitleBar } from '../title-bar/TitleBar.jsx';
import { KidsTypingHUD } from '../hud/KidsTypingHUD.jsx';
import { StartMenu } from '../hud/StartMenu.jsx';
import { SceneContainer } from '../scene-3d/SceneContainer.jsx';
import { useTypingGameStore } from '../typing-game/useTypingGameStore.js';

export const GameLayout = memo(function GameLayout() {
  const gameState = useTypingGameStore(s => s.gameState);

  return (
    <div style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      overflow: 'hidden',
      background: 'transparent'
    }}>
      <TitleBar />
      {gameState === 'playing' && <KidsTypingHUD />}
      <StartMenu />
      <SceneContainer />
    </div>
  );
});
