import React, { memo } from 'react';
import { useTypingGameStore } from '../typing-game/useTypingGameStore.js';

const BADGES = [
  { id: 'speedy_fingers', title: 'Speedy Fingers', desc: 'Reach a 5x Combo Streak', icon: '🔥', check: (s) => s.maxCombo >= 5 || s.streak >= 5 },
  { id: 'combo_master', title: 'Combo Master', desc: 'Reach a 10x Combo Streak', icon: '⚡', check: (s) => s.maxCombo >= 10 || s.streak >= 10 },
  { id: 'word_wizard', title: 'Word Wizard', desc: 'Type 10 complete words', icon: '📚', check: (s) => s.totalWordsTyped >= 10 },
  { id: 'power_collector', title: 'Superpower User', desc: 'Pop 3 superpower bubbles', icon: '🌈', check: (s) => s.powerUpsCollected >= 3 },
  { id: 'rush_champion', title: 'Meteor Survivor', desc: 'Survive 60s in Rush Mode', icon: '🏆', check: (s) => s.rushCompleted >= 1 },
  { id: 'cosmic_score', title: 'Starlight High Score', desc: 'Score over 500 points', icon: '✨', check: (s) => s.highScore >= 500 }
];

export const AchievementsModal = memo(function AchievementsModal() {
  const state = useTypingGameStore();
  const { showBadgesModal, toggleBadgesModal } = state;

  if (!showBadgesModal) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      background: 'rgba(15, 23, 42, 0.85)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.18)',
      borderRadius: '5px',
      padding: '28px 36px',
      width: '460px',
      maxWidth: '90vw',
      display: 'flex',
      flexDirection: 'column',
      gap: '18px',
      zIndex: 200,
      boxShadow: '0 24px 60px rgba(0, 0, 0, 0.65)',
      fontFamily: `system-ui, -apple-system, sans-serif`,
      pointerEvents: 'auto'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '24px' }}>🏅</span>
          <span style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', letterSpacing: '0.4px' }}>
            Trophy Showcase
          </span>
        </div>
        <button
          onClick={toggleBadgesModal}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#94a3b8',
            fontSize: '20px',
            cursor: 'pointer',
            padding: '4px'
          }}
        >
          ✕
        </button>
      </div>

      <div style={{ fontSize: '13px', color: '#cbd5e1', fontWeight: 500 }}>
        Unlock badges as you practice typing across the cosmos!
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '12px',
        maxHeight: '340px',
        overflowY: 'auto',
        paddingRight: '4px'
      }}>
        {BADGES.map((b) => {
          const unlocked = b.check(state);
          return (
            <div
              key={b.id}
              style={{
                background: unlocked ? 'rgba(34, 197, 94, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                border: `1px solid ${unlocked ? '#22c55e' : 'rgba(255, 255, 255, 0.08)'}`,
                borderRadius: '5px',
                padding: '12px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                transition: 'all 0.2s',
                opacity: unlocked ? 1 : 0.45
              }}
            >
              <div style={{ fontSize: '22px' }}>{unlocked ? b.icon : '🔒'}</div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: unlocked ? '#ffffff' : '#94a3b8' }}>
                  {b.title}
                </div>
                <div style={{ fontSize: '11px', color: unlocked ? '#86efac' : '#64748b', marginTop: '2px' }}>
                  {b.desc}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={toggleBadgesModal}
        style={{
          alignSelf: 'center',
          background: 'rgba(56, 189, 248, 0.22)',
          border: '1px solid #38bdf8',
          borderRadius: '5px',
          padding: '8px 28px',
          color: '#38bdf8',
          fontWeight: 700,
          fontSize: '14px',
          cursor: 'pointer',
          marginTop: '6px'
        }}
      >
        Close Showcase
      </button>
    </div>
  );
});
