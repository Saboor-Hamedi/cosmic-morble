import React, { memo } from 'react';
import { Play, Pause } from 'lucide-react';
import { useTypingGameStore } from '../typing-game/useTypingGameStore.js';
import { useThemeStore } from '../theme/useThemeStore.js';
import { AchievementsModal } from './AchievementsModal.jsx';

// Shared subtle pill button style — very low-key, near-invisible
const pillBtn = (active = false, activeColor = '#38bdf8') => ({
  background: active ? `rgba(${hexToRgb(activeColor)}, 0.18)` : 'transparent',
  border: active ? `1px solid rgba(${hexToRgb(activeColor)}, 0.35)` : '1px solid transparent',
  borderRadius: '4px',
  padding: '3px 8px',
  color: active ? '#e2e8f0' : 'rgba(255,255,255,0.45)',
  fontSize: '11px',
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
    score, streak, highScore, lives, mode, setMode, capsLock, toggleCapsLock,
    isPaused, togglePaused, soundTheme, cycleSoundTheme,
    gameStyle, toggleRushMode, rushTimeLeft, activePowerUp, toggleBadgesModal
  } = useTypingGameStore();
  const { theme, cycleTheme } = useThemeStore();

  const soundIcon = soundTheme === 'piano' ? '🎹' : soundTheme === 'laser' ? '🤖' : soundTheme === 'water' ? '🫧' : '⌨️';
  const soundLabel = soundTheme === 'piano' ? 'Piano' : soundTheme === 'laser' ? 'Laser' : soundTheme === 'water' ? 'Water' : 'Synth';

  return (
    <>
      <AchievementsModal />

      {/* ── Left: Ultra-minimal score whisper ────────────────── */}
      <div style={{
        position: 'absolute',
        top: '48px',
        left: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        pointerEvents: 'auto',
        zIndex: 50,
        fontFamily: `'Inter', system-ui, -apple-system, sans-serif`
      }}>
        {/* Score capsule — very dim, almost ghostly */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(0, 0, 0, 0.28)',
          backdropFilter: 'blur(14px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '4px',
          padding: '4px 10px',
          fontSize: '11px',
          fontWeight: 600,
          color: 'rgba(255,255,255,0.7)',
        }}>
          <span style={{ color: 'rgba(56, 189, 248, 0.85)', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ fontSize: '11px' }}>⭐</span>
            <span>{score.toLocaleString()}</span>
          </span>

          {lives !== undefined && (
            <span style={{ color: 'rgba(239, 68, 68, 0.9)', display: 'flex', alignItems: 'center', gap: '3px', marginLeft: '4px' }}>
              <span style={{ fontSize: '12px' }}>{'❤️'.repeat(lives)}{'💔'.repeat(3 - lives)}</span>
            </span>
          )}

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

      {/* ── Bottom Center: Ghost-glass floating dock ─────────────────── */}
      <div style={{
        position: 'absolute',
        bottom: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '3px',
        maxWidth: 'calc(100vw - 32px)',
        pointerEvents: 'auto',
        background: 'rgba(0, 0, 0, 0.28)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '6px',
        padding: '4px 6px',
        zIndex: 50,
        fontFamily: `'Inter', system-ui, -apple-system, sans-serif`
      }}>

        {/* Mode segment — subtle glow on active */}
          <div style={{
            display: 'flex',
            background: 'rgba(0, 0, 0, 0.25)',
            borderRadius: '5px',
            padding: '2px',
            gap: '1px',
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
          <div style={{ width: '1px', height: '12px', background: 'rgba(255,255,255,0.08)', margin: '0 2px' }} />

          {/* Sound */}
          <button
            onClick={cycleSoundTheme}
            title={`Sound: ${soundLabel}`}
            style={{
              ...pillBtn(false),
              display: 'flex', alignItems: 'center', gap: '4px',
              padding: '3px 8px',
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
              display: 'flex', alignItems: 'center', gap: '4px',
              padding: '3px 8px',
            }}
            onMouseOver={(e) => { e.currentTarget.style.color = '#e2e8f0'; e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; }}
            onMouseOut={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; e.currentTarget.style.background = 'transparent'; }}
          >
            <span>{theme.icon}</span>
            <span>Theme</span>
          </button>

          {/* Divider */}
          <div style={{ width: '1px', height: '12px', background: 'rgba(255,255,255,0.08)', margin: '0 2px' }} />

          {/* Play / Pause — Prominent Circular Center Button */}
          <button
            onClick={togglePaused}
            title="Pause / Play (Ctrl + Enter)"
            style={{
              background: isPaused ? '#22c55e' : 'rgba(255, 255, 255, 0.1)',
              border: isPaused ? 'none' : '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '50%',
              width: '26px',
              height: '26px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isPaused ? '#ffffff' : 'rgba(255,255,255,0.6)',
              cursor: 'pointer',
              transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
              margin: '0 4px',
              boxShadow: isPaused ? '0 2px 8px rgba(34, 197, 94, 0.4)' : '0 1px 3px rgba(0,0,0,0.2)',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'scale(1.15)';
              if (!isPaused) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              if (!isPaused) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            }}
          >
            {isPaused ? (
              <Play size={12} fill="currentColor" style={{ marginLeft: '1px' }} />
            ) : (
              <Pause size={12} fill="currentColor" />
            )}
          </button>

          {/* Divider */}
          <div style={{ width: '1px', height: '12px', background: 'rgba(255,255,255,0.08)', margin: '0 2px' }} />

          {/* Rush */}
          <button
            onClick={toggleRushMode}
            title="60s Rush Mode"
            style={{
              ...pillBtn(gameStyle === 'rush', '#ef4444'),
              display: 'flex', alignItems: 'center', gap: '3px',
              padding: '3px 8px',
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
              display: 'flex', alignItems: 'center', gap: '3px',
              padding: '3px 8px',
              color: 'rgba(254, 240, 138, 0.55)',
            }}
            onMouseOver={(e) => { e.currentTarget.style.color = '#fef08a'; e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; }}
            onMouseOut={(e) => { e.currentTarget.style.color = 'rgba(254,240,138,0.55)'; e.currentTarget.style.background = 'transparent'; }}
          >
            <span>🏅</span>
            <span>Badges</span>
          </button>

          {/* Divider */}
          <div style={{ width: '1px', height: '12px', background: 'rgba(255,255,255,0.08)', margin: '0 2px' }} />

          {/* Caps — visual blob indicator */}
          <button
            onClick={toggleCapsLock}
            title="Caps Lock"
            style={{
              background: capsLock ? 'rgba(234, 179, 8, 0.15)' : 'transparent',
              border: capsLock ? '1px solid rgba(234, 179, 8, 0.35)' : '1px solid transparent',
              borderRadius: '4px',
              padding: '0',
              width: '18px',
              height: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseOver={(e) => { e.currentTarget.style.background = capsLock ? 'rgba(234, 179, 8, 0.25)' : 'rgba(255,255,255,0.07)'; }}
            onMouseOut={(e) => { e.currentTarget.style.background = capsLock ? 'rgba(234, 179, 8, 0.15)' : 'transparent'; }}
          >
            <div style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: capsLock ? '#fde047' : 'rgba(255,255,255,0.2)',
              boxShadow: capsLock ? '0 0 6px rgba(253, 224, 71, 0.8)' : 'none',
              transition: 'all 0.2s',
            }} />
          </button>


        </div>
    </>
  );
});
