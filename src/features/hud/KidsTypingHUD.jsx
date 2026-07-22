import React, { memo } from 'react';
import { useTypingGameStore } from '../typing-game/useTypingGameStore.js';
import { useThemeStore } from '../theme/useThemeStore.js';

export const KidsTypingHUD = memo(function KidsTypingHUD() {
  const { score, streak, highScore, mode, setMode, capsLock, toggleCapsLock, isPaused, togglePaused } = useTypingGameStore();
  const { theme, cycleTheme } = useThemeStore();

  return (
    <>
      <div style={{
        position: 'absolute',
        top: '40px',
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
        {/* Subtle, Clean Score, Streak & High Score Display (`subtle 5px round badges`) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', pointerEvents: 'auto' }}>
          <div style={{
            background: 'rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '5px',
            padding: '6px 14px',
            fontSize: '15px',
            fontWeight: 600,
            color: '#cbd5e1',
            letterSpacing: '0.5px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>Score:</span>
            <span style={{ color: '#ffffff', fontWeight: 700, fontSize: '16px' }}>{score.toLocaleString()}</span>
          </div>

          {streak > 1 && (
            <div style={{
              background: 'rgba(249, 115, 22, 0.25)',
              backdropFilter: 'blur(10px)',
              border: '1px solid #f97316',
              borderRadius: '5px',
              padding: '6px 14px',
              fontSize: '14px',
              fontWeight: 700,
              color: '#ffedd5',
              boxShadow: '0 0 16px rgba(249, 115, 22, 0.35)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              animation: 'pulse 1.5s infinite'
            }}>
              <span>🔥 {streak}x Combo!</span>
            </div>
          )}

          {highScore > 0 && (
            <div style={{
              background: 'rgba(234, 179, 8, 0.2)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(234, 179, 8, 0.4)',
              borderRadius: '5px',
              padding: '6px 12px',
              fontSize: '13px',
              fontWeight: 600,
              color: '#fef08a',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span>🏆 Best: {highScore.toLocaleString()}</span>
            </div>
          )}
        </div>

        {/* Subtle Mode Controls, Caps Lock Blob, Theme Switcher & Pause Button (`all subtle 5px round`) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          pointerEvents: 'auto',
          fontSize: '14px',
          fontWeight: 600
        }}>
          <button
            onClick={() => setMode('letters')}
            style={{
              background: mode === 'letters' ? 'rgba(56, 189, 248, 0.2)' : 'rgba(15, 23, 42, 0.35)',
              backdropFilter: 'blur(8px)',
              border: `1px solid ${mode === 'letters' ? '#38bdf8' : 'rgba(255, 255, 255, 0.1)'}`,
              borderRadius: '5px',
              padding: '6px 12px',
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
            style={{
              background: mode === 'words' ? 'rgba(56, 189, 248, 0.2)' : 'rgba(15, 23, 42, 0.35)',
              backdropFilter: 'blur(8px)',
              border: `1px solid ${mode === 'words' ? '#38bdf8' : 'rgba(255, 255, 255, 0.1)'}`,
              borderRadius: '5px',
              padding: '6px 12px',
              color: mode === 'words' ? '#38bdf8' : '#94a3b8',
              cursor: 'pointer',
              outline: 'none',
              fontWeight: mode === 'words' ? 700 : 500,
              transition: 'all 0.2s'
            }}
          >
            Words
          </button>

          {/* Caps Lock Blob Badge (`make sure the caps lock as blob, subtle 5px round`) */}
          <button
            onClick={toggleCapsLock}
            title="Click or press Caps Lock on your keyboard to switch case"
            style={{
              background: capsLock ? 'rgba(250, 204, 21, 0.25)' : 'rgba(15, 23, 42, 0.35)',
              backdropFilter: 'blur(8px)',
              border: `1px solid ${capsLock ? '#facc15' : 'rgba(255, 255, 255, 0.1)'}`,
              borderRadius: '5px',
              padding: '6px 14px',
              color: capsLock ? '#fde047' : '#94a3b8',
              cursor: 'pointer',
              outline: 'none',
              fontWeight: 700,
              fontSize: '13px',
              boxShadow: capsLock ? '0 0 16px rgba(250, 204, 21, 0.35)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            {capsLock ? '● CAPS ON' : '○ caps off'}
          </button>

          {/* Theme Switcher Button (cycles all 22 themes, saves to settings.json, 5px round) */}
          <button
            onClick={cycleTheme}
            title="Click to change 3D Theme (saves automatically to setting.json)"
            style={{
              background: 'rgba(255, 255, 255, 0.14)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.24)',
              borderRadius: '5px',
              padding: '6px 14px',
              color: '#ffffff',
              cursor: 'pointer',
              outline: 'none',
              fontWeight: 600,
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s'
            }}
          >
            <span style={{ fontSize: '15px' }}>{theme.icon}</span>
            <span>{theme.name}</span>
          </button>

          {/* Subtle Pause / Play Button (`cntl + enter toggle the game stop and start`) */}
          <button
            onClick={togglePaused}
            title="Toggle Pause / Play (Ctrl + Enter shortcut)"
            style={{
              background: isPaused ? 'rgba(34, 197, 94, 0.25)' : 'rgba(15, 23, 42, 0.35)',
              backdropFilter: 'blur(8px)',
              border: `1px solid ${isPaused ? '#22c55e' : 'rgba(255, 255, 255, 0.15)'}`,
              borderRadius: '5px',
              padding: '6px 14px',
              color: isPaused ? '#4ade80' : '#cbd5e1',
              cursor: 'pointer',
              outline: 'none',
              fontWeight: 600,
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: isPaused ? '0 0 16px rgba(34, 197, 94, 0.35)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            <span>{isPaused ? '▶ Play' : '⏸ Pause'}</span>
          </button>
        </div>
      </div>
    </>
  );
});
