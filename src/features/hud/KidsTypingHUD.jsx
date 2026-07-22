import React, { memo } from 'react';
import { useTypingGameStore } from '../typing-game/useTypingGameStore.js';
import { useThemeStore } from '../theme/useThemeStore.js';
import { AchievementsModal } from './AchievementsModal.jsx';

export const KidsTypingHUD = memo(function KidsTypingHUD() {
  const {
    score, streak, highScore, mode, setMode, capsLock, toggleCapsLock,
    isPaused, togglePaused, soundTheme, cycleSoundTheme,
    gameStyle, toggleRushMode, rushTimeLeft, activePowerUp, toggleBadgesModal
  } = useTypingGameStore();
  const { theme, cycleTheme } = useThemeStore();

  const soundIcon = soundTheme === 'piano' ? '🎹' : soundTheme === 'laser' ? '🤖' : soundTheme === 'water' ? '🫧' : '⌨️';
  const soundLabel = soundTheme === 'piano' ? 'Piano' : soundTheme === 'laser' ? 'Laser' : soundTheme === 'water' ? 'Water' : 'Synth';

  return (
    <>
      <AchievementsModal />

      <div style={{
        position: 'absolute',
        top: '46px',
        left: 0,
        right: 0,
        padding: '0 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        pointerEvents: 'none',
        zIndex: 50,
        fontFamily: `'Inter', system-ui, -apple-system, sans-serif`
      }}>
        {/* Left: Glass Capsule Score Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', pointerEvents: 'auto' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.16)',
            borderRadius: '999px',
            padding: '7px 18px',
            fontSize: '14px',
            fontWeight: 700,
            color: '#ffffff',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.35)'
          }}>
            <span style={{ color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>⭐</span>
              <span>{score.toLocaleString()}</span>
            </span>

            {streak > 1 && (
              <span style={{ color: '#fb923c', display: 'flex', alignItems: 'center', gap: '4px', animation: 'pulse 1.5s infinite' }}>
                <span>🔥</span>
                <span>{streak}x</span>
              </span>
            )}

            {highScore > 0 && (
              <span style={{ color: '#facc15', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '5px', opacity: 0.9 }}>
                <span>🏆</span>
                <span>{highScore.toLocaleString()}</span>
              </span>
            )}
          </div>

          {/* Active Rush / Superpower Capsule Badges */}
          {gameStyle === 'rush' && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.25)',
              backdropFilter: 'blur(10px)',
              border: '1px solid #ef4444',
              borderRadius: '999px',
              padding: '6px 14px',
              fontSize: '13px',
              fontWeight: 800,
              color: '#fca5a5',
              boxShadow: '0 4px 16px rgba(239, 68, 68, 0.3)'
            }}>
              ⚡ Rush: {Math.ceil(rushTimeLeft)}s
            </div>
          )}

          {activePowerUp && (
            <div style={{
              background: 'rgba(168, 85, 247, 0.25)',
              backdropFilter: 'blur(10px)',
              border: '1px solid #c084fc',
              borderRadius: '999px',
              padding: '6px 14px',
              fontSize: '13px',
              fontWeight: 800,
              color: '#e9d5ff',
              animation: 'pulse 1s infinite',
              boxShadow: '0 4px 16px rgba(168, 85, 247, 0.3)'
            }}>
              {activePowerUp === 'rainbow' && '🌈 2x Double Points!'}
              {activePowerUp === 'freeze' && '❄️ Freeze Time Active!'}
              {activePowerUp === 'starburst' && '💥 Starburst Active!'}
            </div>
          )}
        </div>

        {/* Right: VisionOS / Figma Styled Floating Capsule Dock (`crystal clear, pill shape, zero square borders`) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          pointerEvents: 'auto',
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.16)',
          borderRadius: '999px',
          padding: '5px 8px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.35)'
        }}>
          {/* Smooth Mode Switcher Capsule (`sleek gradient tab selector`) */}
          <div style={{
            display: 'flex',
            background: 'rgba(0, 0, 0, 0.35)',
            borderRadius: '999px',
            padding: '3px',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <button
              onClick={() => setMode('letters')}
              title="Practice single letters (Ctrl + Alt shortcut)"
              style={{
                background: mode === 'letters' ? 'linear-gradient(135deg, #0ea5e9, #38bdf8)' : 'transparent',
                border: 'none',
                borderRadius: '999px',
                padding: '5px 14px',
                color: mode === 'letters' ? '#ffffff' : '#94a3b8',
                fontSize: '13px',
                fontWeight: mode === 'letters' ? 700 : 600,
                cursor: 'pointer',
                boxShadow: mode === 'letters' ? '0 2px 10px rgba(56, 189, 248, 0.4)' : 'none',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              Letters
            </button>
            <button
              onClick={() => setMode('words')}
              title="Practice full words (Ctrl + Alt shortcut)"
              style={{
                background: mode === 'words' ? 'linear-gradient(135deg, #0ea5e9, #38bdf8)' : 'transparent',
                border: 'none',
                borderRadius: '999px',
                padding: '5px 14px',
                color: mode === 'words' ? '#ffffff' : '#94a3b8',
                fontSize: '13px',
                fontWeight: mode === 'words' ? 700 : 600,
                cursor: 'pointer',
                boxShadow: mode === 'words' ? '0 2px 10px rgba(56, 189, 248, 0.4)' : 'none',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              Words
            </button>
          </div>

          {/* Glass Pill Action Buttons */}
          <button
            onClick={cycleSoundTheme}
            title={`Keyboard Audio: ${soundLabel}`}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '999px',
              padding: '6px 12px',
              fontSize: '13px',
              fontWeight: 600,
              color: '#e2e8f0',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'; }}
            onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'; }}
          >
            <span>{soundIcon}</span>
            <span>{soundLabel}</span>
          </button>

          <button
            onClick={cycleTheme}
            title={`Current Theme: ${theme.name}`}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '999px',
              padding: '6px 12px',
              fontSize: '13px',
              fontWeight: 600,
              color: '#e2e8f0',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'; }}
            onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'; }}
          >
            <span>{theme.icon}</span>
            <span>Theme</span>
          </button>

          <button
            onClick={toggleRushMode}
            title="Toggle 60s Meteor Storm Rush Mode"
            style={{
              background: gameStyle === 'rush' ? 'linear-gradient(135deg, #ef4444, #f87171)' : 'rgba(255, 255, 255, 0.06)',
              border: gameStyle === 'rush' ? 'none' : '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '999px',
              padding: '6px 12px',
              fontSize: '13px',
              fontWeight: 700,
              color: gameStyle === 'rush' ? '#ffffff' : '#e2e8f0',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              boxShadow: gameStyle === 'rush' ? '0 2px 10px rgba(239, 68, 68, 0.4)' : 'none',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => { if (gameStyle !== 'rush') e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'; }}
            onMouseOut={(e) => { if (gameStyle !== 'rush') e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'; }}
          >
            <span>⚡</span>
            <span>Rush</span>
          </button>

          <button
            onClick={toggleBadgesModal}
            title="Open Trophy & Achievement Showcase (Press Escape to close)"
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '999px',
              padding: '6px 12px',
              fontSize: '13px',
              fontWeight: 600,
              color: '#fef08a',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'; }}
            onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'; }}
          >
            <span>🏅</span>
            <span>Badges</span>
          </button>

          <button
            onClick={toggleCapsLock}
            title="Caps Lock status"
            style={{
              background: capsLock ? 'linear-gradient(135deg, #eab308, #facc15)' : 'rgba(255, 255, 255, 0.06)',
              border: capsLock ? 'none' : '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '999px',
              padding: '6px 12px',
              fontSize: '12px',
              fontWeight: 800,
              color: capsLock ? '#1e293b' : '#64748b',
              cursor: 'pointer',
              boxShadow: capsLock ? '0 2px 10px rgba(250, 204, 21, 0.4)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            {capsLock ? 'CAPS' : 'caps'}
          </button>

          <button
            onClick={togglePaused}
            title="Pause / Play (Ctrl + Enter shortcut)"
            style={{
              background: isPaused ? 'linear-gradient(135deg, #22c55e, #4ade80)' : 'rgba(255, 255, 255, 0.06)',
              border: isPaused ? 'none' : '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '999px',
              padding: '6px 12px',
              fontSize: '13px',
              fontWeight: 700,
              color: isPaused ? '#ffffff' : '#cbd5e1',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              boxShadow: isPaused ? '0 2px 10px rgba(34, 197, 94, 0.4)' : 'none',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => { if (!isPaused) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'; }}
            onMouseOut={(e) => { if (!isPaused) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'; }}
          >
            <span>{isPaused ? '▶' : '⏸'}</span>
          </button>
        </div>
      </div>
    </>
  );
});
