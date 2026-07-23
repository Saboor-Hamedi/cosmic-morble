import React, { memo } from 'react';
import { TitleBarLogo } from './TitleBarLogo.jsx';
import { TitleBarControls } from './TitleBarControls.jsx';

export const TitleBar = memo(function TitleBar() {
  return (
    <header style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '38px',
      background: 'rgba(0, 0, 0, 0.15)',
      backdropFilter: 'blur(8px)',
      boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 16px',
      WebkitAppRegion: 'drag', // Makes the ENTIRE top bar draggable across the screen!
      pointerEvents: 'auto',
      zIndex: 100
    }}>
      {/* Left side: Draggable Logo & App Name */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        height: '100%',
        WebkitAppRegion: 'drag'
      }}>
        <TitleBarLogo />
      </div>

      {/* Center: Wide Draggable Spacer Strip guaranteeing easy window movement */}
      <div style={{
        flex: 1,
        height: '100%',
        WebkitAppRegion: 'drag'
      }} />

      {/* Right side: Non-draggable Window Controls (Minimize & Close) */}
      <div style={{
        WebkitAppRegion: 'no-drag',
        pointerEvents: 'auto'
      }}>
        <TitleBarControls />
      </div>
    </header>
  );
});
