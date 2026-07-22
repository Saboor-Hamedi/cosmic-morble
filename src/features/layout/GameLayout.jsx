import React, { memo } from 'react';
import { TitleBar } from '../title-bar/TitleBar.jsx';
import { KidsTypingHUD } from '../hud/KidsTypingHUD.jsx';
import { SceneContainer } from '../scene-3d/SceneContainer.jsx';

export const GameLayout = memo(function GameLayout() {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      overflow: 'hidden',
      background: 'transparent'
    }}>
      <TitleBar />
      <KidsTypingHUD />
      <SceneContainer />
    </div>
  );
});
