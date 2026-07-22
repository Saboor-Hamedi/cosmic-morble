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
        alignItems: 'flex-start',
        pointerEvents: 'none',
        zIndex: 50,
        fontFamily: `system-ui, -apple-system, sans-serif`
      }}>
        {/* Left: Ultra-Minimalist Score Pill (`clean 5px round, zero vertical pipe clutter`) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', pointerEvents: 'auto' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'rgba(15, 23, 42, 0.35)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '5px',
            padding: '5px 14px',
            fontSize: '14px',
            fontWeight: 700,
            color: '#ffffff',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.25)'
          }}>
            <span style={{ color: '#38bdf8' }}>⭐ {score.toLocaleString()}</span>

            {streak > 1 && (
              <span style={{ color: '#fb923c', animation: 'pulse 1.5s infinite' }}>
                🔥 {streak}x
              </span>
            )}

            {highScore > 0 && (
              <span style={{ color: '#facc15', fontSize: '13px', fontWeight: 600, opacity: 0.85 }}>
                🏆 {highScore.toLocaleString()}
              </span>
            )}
          </div>

          {/* Active Status Badges (Floating quietly under score when active) */}
          {(gameStyle === 'rush' || activePowerUp) && (
            <div style={{ display: 'flex', gap: '8px', fontSize: '12px', fontWeight: 700 }}>
              {gameStyle === 'rush' && (
                <div style={{
                  background: 'rgba(239, 68, 68, 0.25)',
                  border: '1px solid #ef4444',
                  borderRadius: '5px',
                  padding: '3px 10px',
                  color: '#fca5a5'
                }}>
                  ⚡ Rush: {Math.ceil(rushTimeLeft)}s
                </div>
              )}
              {activePowerUp && (
                <div style={{
                  background: 'rgba(168, 85, 247, 0.25)',
                  border: '1px solid #c084fc',
                  borderRadius: '5px',
                  padding: '3px 10px',
                  color: '#e9d5ff',
                  animation: 'pulse 1s infinite'
                }}>
                  {activePowerUp === 'rainbow' && '🌈 2x Double Points!'}
                  {activePowerUp === 'freeze' && '❄️ Freeze Time Active!'}
                  {activePowerUp === 'starburst' && '💥 Starburst Active!'}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Ultra-Compact Minimalist Icon Bar (`no ugly text overflow, no vertical line clutter, clean 5px tabs`) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          pointerEvents: 'auto',
          background: 'rgba(15, 23, 42, 0.35)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '5px',
          padding: '3px',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.25)'
        }}>
          {/* Mode Segment (`Letters / Words`) */}
          <div style={{ display: 'flex', gap: '2px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '4px', padding: '2px' }}>
            <button
              onClick={() => setMode('letters')}
              title="Letters Mode (Ctrl + Alt shortcut)"
              style={{
                background: mode === 'letters' ? 'rgba(56, 189, 248, 0.35)' : 'transparent',
                border: mode === 'letters' ? '1px solid rgba(56, 189, 248, 0.5)' : 'none',
                borderRadius: '3px',
                padding: '4px 8px',
                color: mode === 'letters' ? '#38bdf8' : '#94a3b8',
                fontSize: '12px',
                fontWeight: mode === 'letters' ? 700 : 500,
                cursor: 'pointer'
              }}
            >
              ABC
            </button>
            <button
              onClick={() => setMode('words')}
              title="Words Mode (Ctrl + Alt shortcut)"
              style={{
                background: mode === 'words' ? 'rgba(56, 189, 248, 0.35)' : 'transparent',
                border: mode === 'words' ? '1px solid rgba(56, 189, 248, 0.5)' : 'none',
                borderRadius: '3px',
                padding: '4px 8px',
                color: mode === 'words' ? '#38bdf8' : '#94a3b8',
                fontSize: '12px',
                fontWeight: mode === 'words' ? 700 : 500,
                cursor: 'pointer'
              }}
            >
              Words
            </button>
          </div>

          {/* Sound Pack Icon Tab */}
          <button
            onClick={cycleSoundTheme}
            title={`Keyboard Sound: ${soundLabel} (Click to switch)`}
            style={{
              background: 'transparent',
              border: 'none',
              borderRadius: '4px',
              padding: '5px 8px',
              fontSize: '15px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              color: '#e2e8f0',
              transition: 'background 0.2s'
            }}
            onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'; }}
            onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; }}
          >
            <span>{soundIcon}</span>
          </button>

          {/* Theme Icon Tab */}
          <button
            onClick={cycleTheme}
            title={`Current Theme: ${theme.name} (Click to switch)`}
            style={{
              background: 'transparent',
              border: 'none',
              borderRadius: '4px',
              padding: '5px 8px',
              fontSize: '15px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              color: '#e2e8f0',
              transition: 'background 0.2s'
            }}
            onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'; }}
            onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; }}
          >
            <span>{theme.icon}</span>
          </button>

          {/* Rush Challenge Icon Tab */}
          <button
            onClick={toggleRushMode}
            title="Toggle 60s Meteor Storm Rush Mode"
            style={{
              background: gameStyle === 'rush' ? 'rgba(239, 68, 68, 0.25)' : 'transparent',
              border: gameStyle === 'rush' ? '1px solid #ef4444' : 'none',
              borderRadius: '4px',
              padding: '5px 8px',
              fontSize: '15px',
              cursor: 'pointer',
              color: gameStyle === 'rush' ? '#f87171' : '#e2e8f0',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => { if (gameStyle !== 'rush') e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'; }}
            onMouseOut={(e) => { if (gameStyle !== 'rush') e.currentTarget.style.background = 'transparent'; }}
          >
            <span>⚡</span>
          </button>

          {/* Badges Trophy Icon Tab */}
          <button
            onClick={toggleBadgesModal}
            title="Open Trophy & Achievement Showcase"
            style={{
              background: 'transparent',
              border: 'none',
              borderRadius: '4px',
              padding: '5px 8px',
              fontSize: '15px',
              cursor: 'pointer',
              color: '#fef08a',
              transition: 'background 0.2s'
            }}
            onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'; }}
            onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; }}
          >
            <span>🏅</span>
          </button>

          {/* Caps Lock Compact Indicator (`subtle A / a`) */}
          <button
            onClick={toggleCapsLock}
            title="Toggle Caps Lock"
            style={{
              background: capsLock ? 'rgba(250, 204, 21, 0.25)' : 'transparent',
              border: capsLock ? '1px solid #facc15' : 'none',
              borderRadius: '4px',
              padding: '4px 8px',
              fontSize: '12px',
              fontWeight: 800,
              cursor: 'pointer',
              color: capsLock ? '#fde047' : '#64748b',
              transition: 'all 0.2s'
            }}
          >
            {capsLock ? 'A' : 'a'}
          </button>

          {/* Pause Icon Tab (`Ctrl+Enter`) */}
          <button
            onClick={togglePaused}
            title="Pause / Play (Ctrl + Enter)"
            style={{
              background: isPaused ? 'rgba(34, 197, 94, 0.25)' : 'transparent',
              border: isPaused ? '1px solid #22c55e' : 'none',
              borderRadius: '4px',
              padding: '5px 8px',
              fontSize: '14px',
              cursor: 'pointer',
              color: isPaused ? '#4ade80' : '#cbd5e1',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => { if (!isPaused) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'; }}
            onMouseOut={(e) => { if (!isPaused) e.currentTarget.style.background = 'transparent'; }}
          >
            <span>{isPaused ? '▶' : '⏸'}</span>
          </button>
        </div>
      </div>
    </>
  );
});
