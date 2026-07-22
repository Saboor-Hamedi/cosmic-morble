import React, { memo, useCallback } from 'react';
import { Minus, X } from 'lucide-react';
import { playHoverSound } from '../audio/SoundSynthesizer.js';

export const TitleBarControls = memo(function TitleBarControls() {
  const handleMinimize = useCallback((e) => {
    e.stopPropagation();
    if (window.electronAPI?.minimize) {
      window.electronAPI.minimize();
    }
  }, []);

  const handleClose = useCallback((e) => {
    e.stopPropagation();
    if (window.electronAPI?.close) {
      window.electronAPI.close();
    } else {
      window.close();
    }
  }, []);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      WebkitAppRegion: 'no-drag',
      pointerEvents: 'auto',
      zIndex: 1000
    }}>
      <button
        onClick={handleMinimize}
        onMouseEnter={playHoverSound}
        style={{
          background: 'transparent',
          border: 'none',
          outline: 'none',
          color: 'var(--text-dim)',
          width: '32px',
          height: '28px',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          WebkitAppRegion: 'no-drag',
          pointerEvents: 'auto'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.color = '#ffffff';
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.color = 'var(--text-dim)';
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
        title="Minimize"
      >
        <Minus size={15} style={{ WebkitAppRegion: 'no-drag', pointerEvents: 'none' }} />
      </button>
      <button
        onClick={handleClose}
        onMouseEnter={playHoverSound}
        style={{
          background: 'transparent',
          border: 'none',
          outline: 'none',
          color: 'var(--text-dim)',
          width: '32px',
          height: '28px',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          WebkitAppRegion: 'no-drag',
          pointerEvents: 'auto'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.color = '#ff3366';
          e.currentTarget.style.backgroundColor = 'rgba(255, 51, 102, 0.15)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.color = 'var(--text-dim)';
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
        title="Close Application"
      >
        <X size={15} style={{ WebkitAppRegion: 'no-drag', pointerEvents: 'none' }} />
      </button>
    </div>
  );
});
