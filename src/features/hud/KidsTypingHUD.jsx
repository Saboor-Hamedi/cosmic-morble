import React, { memo } from 'react';
import { useTypingGameStore } from '../typing-game/useTypingGameStore.js';
import { useThemeStore } from '../theme/useThemeStore.js';

export const KidsTypingHUD = memo(function KidsTypingHUD() {
  const { score, streak, highScore, mode, setMode, capsLock, toggleCapsLock, isPaused, togglePaused } = useTypingGameStore();
  const { theme, cycleTheme } = useThemeStore();

  return (
    <div style={{
      position: 'absolute',
      top: '28px',
      left: 0,
      right: 0,
      padding: '0 32px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      pointerEvents: 'none',
      zIndex: 50,
      fontFamily: `system-ui, -apple-system, sans-serif`
    }}>
      {/* Subtle, Minimalist Score & Combo Bar (ultra-light glass pill, 5px round) */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        pointerEvents: 'auto',
        background: 'rgba(0, 0, 0, 0.22)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '5px',
        padding: '6px 16px',
        fontSize: '14px',
        fontWeight: 600,
        color: '#e2e8f0',
        letterSpacing: '0.4px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ opacity: 0.75 }}>Score:</span>
          <span style={{ color: '#ffffff', fontWeight: 700, fontSize: '15px' }}>{score.toLocaleString()}</span>
        </div>

        {streak > 1 && (
          <>
            <span style={{ opacity: 0.3 }}>|</span>
            <div style={{
              color: '#fb923c',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              animation: 'pulse 1.5s infinite'
            }}>
              <span>🔥 {streak}x</span>
            </div>
          </>
        )}

        {highScore > 0 && (
          <>
            <span style={{ opacity: 0.3 }}>|</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fde047', fontSize: '13px' }}>
              <span>🏆 Best: {highScore.toLocaleString()}</span>
            </div>
          </>
        )}
      </div>

      {/* Subtle Control Ribbon (all sleek 5px round inside a soft dark bar) */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        pointerEvents: 'auto',
        background: 'rgba(0, 0, 0, 0.22)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '5px',
        padding: '4px',
        fontSize: '13px',
        fontWeight: 600,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
      }}>
        {/* Letters / Words Mode Switchers (`cntl + alt switch between letter and word`) */}
        <button
          onClick={() => setMode('letters')}
          title="Switch to Letters Mode (or press Ctrl + Alt)"
          style={{
            background: mode === 'letters' ? 'rgba(56, 189, 248, 0.25)' : 'transparent',
            border: mode === 'letters' ? '1px solid rgba(56, 189, 248, 0.5)' : '1px solid transparent',
            borderRadius: '5px',
            padding: '5px 12px',
            color: mode === 'letters' ? '#38bdf8' : '#94a3b8',
            cursor: 'pointer',
            outline: 'none',
            fontWeight: mode === 'letters' ? 700 : 500,
            transition: 'all 0.2s'
          }}
        >
          Letters
        </button>

        <button
          onClick={() => setMode('words')}
          title="Switch to Words Mode (or press Ctrl + Alt)"
          style={{
            background: mode === 'words' ? 'rgba(56, 189, 248, 0.25)' : 'transparent',
            border: mode === 'words' ? '1px solid rgba(56, 189, 248, 0.5)' : '1px solid transparent',
            borderRadius: '5px',
            padding: '5px 12px',
            color: mode === 'words' ? '#38bdf8' : '#94a3b8',
            cursor: 'pointer',
            outline: 'none',
            fontWeight: mode === 'words' ? 700 : 500,
            transition: 'all 0.2s'
          }}
        >
          Words
        </button>

        <span style={{ opacity: 0.25, color: '#ffffff', margin: '0 2px' }}>|</span>

        {/* Caps Lock Blob Badge (`subtle 5px round`) */}
        <button
          onClick={toggleCapsLock}
          title="Toggle Caps Lock"
          style={{
            background: capsLock ? 'rgba(250, 204, 21, 0.22)' : 'transparent',
            border: capsLock ? '1px solid rgba(250, 204, 21, 0.5)' : '1px solid transparent',
            borderRadius: '5px',
            padding: '5px 12px',
            color: capsLock ? '#fde047' : '#64748b',
            cursor: 'pointer',
            outline: 'none',
            fontWeight: 700,
            transition: 'all 0.2s'
          }}
        >
          {capsLock ? '● CAPS' : '○ caps'}
        </button>

        <span style={{ opacity: 0.25, color: '#ffffff', margin: '0 2px' }}>|</span>

        {/* Theme Switcher Button */}
        <button
          onClick={cycleTheme}
          title="Cycle 3D Theme"
          style={{
            background: 'transparent',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '5px',
            padding: '5px 12px',
            color: '#e2e8f0',
            cursor: 'pointer',
            outline: 'none',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s'
          }}
        >
          <span style={{ fontSize: '14px' }}>{theme.icon}</span>
          <span>{theme.name}</span>
        </button>

        <span style={{ opacity: 0.25, color: '#ffffff', margin: '0 2px' }}>|</span>

        {/* Subtle Pause / Play Toggle (`cntl + enter toggle the game stop and start`) */}
        <button
          onClick={togglePaused}
          title="Toggle Pause / Play (Ctrl + Enter)"
          style={{
            background: isPaused ? 'rgba(34, 197, 94, 0.25)' : 'transparent',
            border: isPaused ? '1px solid #22c55e' : '1px solid transparent',
            borderRadius: '5px',
            padding: '5px 12px',
            color: isPaused ? '#4ade80' : '#94a3b8',
            cursor: 'pointer',
            outline: 'none',
            fontWeight: 600,
            transition: 'all 0.2s'
          }}
        >
          <span>{isPaused ? '▶ Play' : '⏸ Pause'}</span>
        </button>
      </div>
    </div>
  );
});
