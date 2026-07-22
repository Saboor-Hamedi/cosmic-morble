import React, { memo } from 'react';
import { useTypingGameStore } from '../typing-game/useTypingGameStore.js';
import { useThemeStore } from '../theme/useThemeStore.js';
import { AchievementsModal } from './AchievementsModal.jsx';

// Shared subtle pill button style — very low-key, near-invisible
const pillBtn = (active = false, activeColor = '#38bdf8') => ({
  background: active ? `rgba(${hexToRgb(activeColor)}, 0.18)` : 'transparent',
  border: active ? `1px solid rgba(${hexToRgb(activeColor)}, 0.35)` : '1px solid transparent',
  borderRadius: '999px',
  padding: '5px 13px',
  color: active ? '#e2e8f0' : 'rgba(255,255,255,0.45)',
  fontSize: '12px',
  fontWeight: active ? 600 : 500,
  cursor: 'pointer',
  transition: 'all 0.2s',
  letterSpacing: '0.01em',
});

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
}

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
        padding: '0 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        pointerEvents: 'none',
        zIndex: 50,
        fontFamily: `'Inter', system-ui, -apple-system, sans-serif`
      }}>

        {/* ── Left: Ultra-minimal score whisper ────────────────── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', pointerEvents: 'auto' }}>

          {/* Score capsule — very dim, almost ghostly */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'rgba(0, 0, 0, 0.28)',
            backdropFilter: 'blur(14px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '999px',
            padding: '5px 14px',
            fontSize: '13px',
            fontWeight: 600,
            color: 'rgba(255,255,255,0.7)',
          }}>
            <span style={{ color: 'rgba(56, 189, 248, 0.85)', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ fontSize: '11px' }}>⭐</span>
              <span>{score.toLocaleString()}</span>
            </span>

            {streak > 1 && (
              <span style={{ color: 'rgba(251, 146, 60, 0.85)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                <span style={{ fontSize: '11px' }}>🔥</span>
                <span>{streak}x</span>
              </span>
            )}

            {highScore > 0 && (
              <span style={{ color: 'rgba(250, 204, 21, 0.7)', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: '11px' }}>🏆</span>
                <span>{highScore.toLocaleString()}</span>
              </span>
            )}
          </div>

          {/* Rush & Powerup status — only shown when active, low saturation */}
          {gameStyle === 'rush' && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.14)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '999px',
              padding: '4px 12px',
              fontSize: '12px',
              fontWeight: 600,
              color: 'rgba(252, 165, 165, 0.9)',
            }}>
              ⚡ {Math.ceil(rushTimeLeft)}s
            </div>
          )}

          {activePowerUp && (
            <div style={{
              background: 'rgba(168, 85, 247, 0.14)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(168, 85, 247, 0.28)',
              borderRadius: '999px',
              padding: '4px 12px',
              fontSize: '12px',
              fontWeight: 600,
              color: 'rgba(233, 213, 255, 0.85)',
              animation: 'pulse 2s infinite',
            }}>
              {activePowerUp === 'rainbow' && '🌈 2×'}
              {activePowerUp === 'freeze' && '❄️ Freeze'}
              {activePowerUp === 'starburst' && '💥 Burst'}
            </div>
          )}
        </div>

        {/* ── Right: Ghost-glass floating dock ─────────────────── */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2px',
          pointerEvents: 'auto',
          background: 'rgba(0, 0, 0, 0.28)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '999px',
          padding: '4px 6px',
        }}>

          {/* Mode segment — subtle glow on active */}
          <div style={{
            display: 'flex',
            background: 'rgba(0, 0, 0, 0.25)',
            borderRadius: '999px',
            padding: '2px',
          }}>
            <button
              onClick={() => setMode('letters')}
              title="Letters Mode (Ctrl + Alt)"
              style={pillBtn(mode === 'letters', '#38bdf8')}
              onMouseOver={(e) => { e.currentTarget.style.color = '#e2e8f0'; }}
              onMouseOut={(e) => { e.currentTarget.style.color = mode === 'letters' ? '#e2e8f0' : 'rgba(255,255,255,0.45)'; }}
            >
              Letters
            </button>
            <button
              onClick={() => setMode('words')}
              title="Words Mode (Ctrl + Alt)"
              style={pillBtn(mode === 'words', '#38bdf8')}
              onMouseOver={(e) => { e.currentTarget.style.color = '#e2e8f0'; }}
              onMouseOut={(e) => { e.currentTarget.style.color = mode === 'words' ? '#e2e8f0' : 'rgba(255,255,255,0.45)'; }}
            >
              Words
            </button>
          </div>

          {/* Divider */}
          <div style={{ width: '1px', height: '16px', background: 'rgba(255,255,255,0.08)', margin: '0 3px' }} />

          {/* Sound */}
          <button
            onClick={cycleSoundTheme}
            title={`Sound: ${soundLabel}`}
            style={{
              ...pillBtn(false),
              display: 'flex', alignItems: 'center', gap: '5px',
              padding: '5px 11px',
            }}
            onMouseOver={(e) => { e.currentTarget.style.color = '#e2e8f0'; e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; }}
            onMouseOut={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; e.currentTarget.style.background = 'transparent'; }}
          >
            <span>{soundIcon}</span>
            <span>{soundLabel}</span>
          </button>

          {/* Theme */}
          <button
            onClick={cycleTheme}
            title={`Theme: ${theme.name}`}
            style={{
              ...pillBtn(false),
              display: 'flex', alignItems: 'center', gap: '5px',
              padding: '5px 11px',
            }}
            onMouseOver={(e) => { e.currentTarget.style.color = '#e2e8f0'; e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; }}
            onMouseOut={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; e.currentTarget.style.background = 'transparent'; }}
          >
            <span>{theme.icon}</span>
            <span>Theme</span>
          </button>

          {/* Divider */}
          <div style={{ width: '1px', height: '16px', background: 'rgba(255,255,255,0.08)', margin: '0 3px' }} />

          {/* Rush */}
          <button
            onClick={toggleRushMode}
            title="60s Rush Mode"
            style={{
              ...pillBtn(gameStyle === 'rush', '#ef4444'),
              display: 'flex', alignItems: 'center', gap: '4px',
              padding: '5px 11px',
            }}
            onMouseOver={(e) => { e.currentTarget.style.color = '#e2e8f0'; e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; }}
            onMouseOut={(e) => { e.currentTarget.style.background = gameStyle === 'rush' ? 'rgba(239,68,68,0.18)' : 'transparent'; }}
          >
            <span>⚡</span>
            <span>Rush</span>
          </button>

          {/* Badges */}
          <button
            onClick={toggleBadgesModal}
            title="Badges"
            style={{
              ...pillBtn(false),
              display: 'flex', alignItems: 'center', gap: '4px',
              padding: '5px 11px',
              color: 'rgba(254, 240, 138, 0.55)',
            }}
            onMouseOver={(e) => { e.currentTarget.style.color = '#fef08a'; e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; }}
            onMouseOut={(e) => { e.currentTarget.style.color = 'rgba(254,240,138,0.55)'; e.currentTarget.style.background = 'transparent'; }}
          >
            <span>🏅</span>
            <span>Badges</span>
          </button>

          {/* Divider */}
          <div style={{ width: '1px', height: '16px', background: 'rgba(255,255,255,0.08)', margin: '0 3px' }} />

          {/* Caps — tiny indicator, not a big bold button */}
          <button
            onClick={toggleCapsLock}
            title="Caps Lock"
            style={{
              background: capsLock ? 'rgba(234, 179, 8, 0.20)' : 'transparent',
              border: capsLock ? '1px solid rgba(234, 179, 8, 0.35)' : '1px solid transparent',
              borderRadius: '999px',
              padding: '5px 10px',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.04em',
              color: capsLock ? 'rgba(253, 224, 71, 0.90)' : 'rgba(255,255,255,0.28)',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {capsLock ? 'CAPS' : 'caps'}
          </button>

          {/* Pause / Play */}
          <button
            onClick={togglePaused}
            title="Pause / Play (Ctrl + Enter)"
            style={{
              background: isPaused ? 'rgba(34, 197, 94, 0.18)' : 'transparent',
              border: isPaused ? '1px solid rgba(34, 197, 94, 0.32)' : '1px solid transparent',
              borderRadius: '999px',
              width: '30px',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              color: isPaused ? 'rgba(134, 239, 172, 0.9)' : 'rgba(255,255,255,0.4)',
              cursor: 'pointer',
              transition: 'all 0.2s',
              marginLeft: '2px',
            }}
            onMouseOver={(e) => { e.currentTarget.style.color = '#e2e8f0'; e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; }}
            onMouseOut={(e) => {
              e.currentTarget.style.color = isPaused ? 'rgba(134,239,172,0.9)' : 'rgba(255,255,255,0.4)';
              e.currentTarget.style.background = isPaused ? 'rgba(34,197,94,0.18)' : 'transparent';
            }}
          >
            {isPaused ? '▶' : '⏸'}
          </button>
        </div>
      </div>
    </>
  );
});
