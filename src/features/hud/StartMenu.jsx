import React from 'react';
import { useTypingGameStore } from '../typing-game/useTypingGameStore.js';
import { Play, RotateCcw } from 'lucide-react';

export const StartMenu = () => {
  const { gameState, startGame, score } = useTypingGameStore();

  if (gameState === 'playing') return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 90, // Reduced from 100 so it doesn't block the TitleBar!
        pointerEvents: 'auto',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
          textAlign: 'center',
          animation: 'pulse 2s infinite ease-in-out',
        }}
      >
        {gameState === 'menu' ? (
          <>
            <h1 style={{ fontSize: '4rem', fontFamily: 'var(--font-sci)', margin: 0, color: '#ffffff' }}>
              COSMIC MORBLE
            </h1>
            <p style={{ fontSize: '1.5rem', color: 'rgba(255, 255, 255, 0.8)' }}>
              Press <span style={{ color: 'var(--neon-cyan)', fontWeight: 'bold' }}>ENTER</span> to Start
            </p>
          </>
        ) : (
          <>
            <h1 style={{ fontSize: '4.5rem', fontFamily: 'var(--font-sci)', margin: 0, color: 'var(--neon-magenta)' }}>
              GAME OVER
            </h1>
            <div style={{ fontSize: '2rem', color: 'var(--text-primary)' }}>
              Final Score: <span style={{ color: '#ffcc00' }}>{score}</span>
            </div>
            <p style={{ fontSize: '1.5rem', color: 'rgba(255, 255, 255, 0.8)', marginTop: '20px' }}>
              Press <span style={{ color: 'var(--neon-magenta)', fontWeight: 'bold' }}>ENTER</span> to Restart
            </p>
          </>
        )}

        <button
          onClick={startGame}
          style={{
            marginTop: '10px',
            background: 'transparent',
            border: '2px solid rgba(255, 255, 255, 0.5)',
            borderRadius: '30px',
            padding: '12px 35px',
            fontSize: '1.2rem',
            fontFamily: 'var(--font-sci)',
            color: '#ffffff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            transition: 'all 0.2s ease',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.borderColor = '#ffffff';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
          }}
        >
          {gameState === 'menu' ? (
            <>
              <Play size={20} />
              PLAY NOW
            </>
          ) : (
            <>
              <RotateCcw size={20} />
              TRY AGAIN
            </>
          )}
        </button>
      </div>
    </div>
  );
};
