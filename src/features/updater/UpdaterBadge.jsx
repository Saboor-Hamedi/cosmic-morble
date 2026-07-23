import React, { useState, useEffect, useRef } from 'react';

// ─── Subtle VSCode-style auto-updater badge ────────────────────────────────
// States: idle → available → downloading → ready
// Sits fixed bottom-right, nearly invisible until needed

const STYLES = {
  wrapper: {
    position: 'fixed',
    bottom: '18px',
    right: '18px',
    zIndex: 9999,
    fontFamily: `'Inter', system-ui, -apple-system, sans-serif`,
    pointerEvents: 'auto',
  },
  pill: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    minWidth: '130px',
    background: 'rgba(0, 0, 0, 0.42)',
    backdropFilter: 'blur(14px)',
    WebkitBackdropFilter: 'blur(14px)',
    border: '1px solid rgba(255, 255, 255, 0.10)',
    borderRadius: '999px',
    padding: '7px 14px',
    fontSize: '12px',
    fontWeight: 500,
    color: 'rgba(255, 255, 255, 0.75)',
    cursor: 'default',
    userSelect: 'none',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 24px rgba(0,0,0,0.35)',
    whiteSpace: 'nowrap',
  },
  pillClickable: {
    cursor: 'pointer',
  },
};

// ─── Tiny animated progress ring ──────────────────────────────────────────
function ProgressRing({ percent }) {
  const r = 8;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;
  return (
    <svg width="20" height="20" style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}>
      {/* Track */}
      <circle cx="10" cy="10" r={r} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
      {/* Progress */}
      <circle
        cx="10" cy="10" r={r}
        fill="none"
        stroke="rgba(56, 189, 248, 0.85)"
        strokeWidth="2"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.4s ease' }}
      />
    </svg>
  );
}

// ─── Pulsing dot indicator ─────────────────────────────────────────────────
function PulseDot({ color = '#38bdf8' }) {
  return (
    <span style={{ position: 'relative', display: 'inline-flex', width: 8, height: 8, flexShrink: 0 }}>
      <span style={{
        position: 'absolute',
        inset: 0,
        borderRadius: '50%',
        background: color,
        opacity: 0.6,
        animation: 'updater-ping 1.4s cubic-bezier(0,0,0.2,1) infinite',
      }} />
      <span style={{
        position: 'relative',
        display: 'inline-flex',
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: color,
      }} />
    </span>
  );
}

export function UpdaterBadge() {
  const [phase, setPhase] = useState('idle'); // idle | available | downloading | ready
  const [percent, setPercent] = useState(0);
  const [version, setVersion] = useState('');
  const [visible, setVisible] = useState(false);
  const cleanupRef = useRef(null);

  useEffect(() => {
    // Inject keyframe animation into document head once
    if (!document.getElementById('updater-keyframes')) {
      const style = document.createElement('style');
      style.id = 'updater-keyframes';
      style.textContent = `
        @keyframes updater-ping {
          75%, 100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes updater-fadein {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `;
      document.head.appendChild(style);
    }

    // Guard: only hook up if running inside Electron with the bridge
    const api = window.electronAPI;
    if (!api?.onUpdaterEvent) return;

    const cleanup = api.onUpdaterEvent((data) => {
      console.log('Updater Event:', data); // Log to DevTools if available
      switch (data.event) {
        case 'checking':
          setPhase('checking');
          break;
        case 'not-available':
          setPhase('up-to-date');
          setTimeout(() => {
            // Only revert if we haven't clicked checking again
            setPhase(p => p === 'up-to-date' ? 'idle' : p);
          }, 3000);
          break;
        case 'available':
          setVersion(data.version || '');
          setPhase('available');
          setVisible(true);
          break;
        case 'progress':
          setPercent(data.percent ?? 0);
          setPhase('downloading');
          setVisible(true);
          break;
        case 'downloaded':
          setVersion(data.version || '');
          setPhase('ready');
          setVisible(true);
          break;
        case 'error':
          // Show error temporarily so we can debug why it failed
          setVersion(data.message || 'Error');
          setPhase('error');
          setVisible(true);
          setTimeout(() => setVisible(false), 8000); // hide after 8s
          break;
        default:
          break;
      }
    });

    cleanupRef.current = cleanup;
    return () => { if (cleanupRef.current) cleanupRef.current(); };
  }, []);

  // Hide completely unless we actively found an update or hit a critical error
  if (!visible || phase === 'idle' || phase === 'checking' || phase === 'up-to-date') return null;

  const handleClick = () => {
    if (phase === 'ready') {
      window.electronAPI?.installUpdate();
    } else if (phase === 'idle' || phase === 'error' || phase === 'available') {
      window.electronAPI?.checkForUpdates();
    }
  };

  const isClickable = phase === 'ready' || phase === 'idle' || phase === 'error' || phase === 'available';

  return (
    <div style={STYLES.wrapper}>
      <div
        style={{
          ...STYLES.pill,
          ...(isClickable ? STYLES.pillClickable : {}),
          animation: isClickable 
            ? 'updater-fadein 0.35s ease forwards, button-pulse 2s infinite' 
            : 'updater-fadein 0.35s ease forwards',
          background: phase === 'ready' 
            ? 'linear-gradient(145deg, rgba(34,197,94,0.3), rgba(21,128,61,0.6))'
            : 'linear-gradient(145deg, rgba(255,255,255,0.1), rgba(0,0,0,0.5))',
          borderTop: '2px solid rgba(255, 255, 255, 0.4)',
          borderBottom: '2px solid rgba(0, 0, 0, 0.6)',
          borderColor: phase === 'ready' ? 'rgba(74, 222, 128, 0.5)' : 'rgba(255, 255, 255, 0.2)',
          boxShadow: phase === 'ready'
            ? '0 10px 25px rgba(21,128,61,0.5), inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -3px 6px rgba(0,0,0,0.5)'
            : '0 8px 20px rgba(0,0,0,0.4), inset 0 2px 4px rgba(255,255,255,0.2), inset 0 -3px 6px rgba(0,0,0,0.5)',
          transformStyle: 'preserve-3d',
        }}
        onClick={handleClick}
        onMouseEnter={e => {
          if (isClickable) {
            e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
            e.currentTarget.style.boxShadow = '0 15px 30px rgba(21,128,61,0.6), inset 0 2px 4px rgba(255,255,255,0.4), inset 0 -3px 6px rgba(0,0,0,0.5)';
          }
        }}
        onMouseLeave={e => {
          if (isClickable) {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 10px 25px rgba(21,128,61,0.5), inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -3px 6px rgba(0,0,0,0.5)';
          }
        }}
        onMouseDown={e => {
          if (isClickable) {
            e.currentTarget.style.transform = 'translateY(2px) scale(0.98)';
            e.currentTarget.style.boxShadow = '0 4px 10px rgba(21,128,61,0.4), inset 0 4px 8px rgba(0,0,0,0.6)';
          }
        }}
        onMouseUp={e => {
          if (isClickable) {
            e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
            e.currentTarget.style.boxShadow = '0 15px 30px rgba(21,128,61,0.6), inset 0 2px 4px rgba(255,255,255,0.4), inset 0 -3px 6px rgba(0,0,0,0.5)';
          }
        }}
        title={
          phase === 'available' ? `Version ${version} is downloading…` :
          phase === 'downloading' ? `Downloading update… ${percent}%` :
          phase === 'ready' ? `v${version} is ready — click to restart` : ''
        }
      >
        {(phase === 'idle' || phase === 'available') && (
          <>
            <PulseDot color="#38bdf8" />
            <span style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>Update</span>
          </>
        )}

        {phase === 'checking' && (
          <>
            <ProgressRing percent={0} />
            <span style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>Checking...</span>
          </>
        )}

        {phase === 'up-to-date' && (
          <>
            <PulseDot color="#94a3b8" />
            <span style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>Up to date</span>
          </>
        )}

        {phase === 'downloading' && (
          <>
            <ProgressRing percent={percent} />
            <span style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>Downloading..</span>
          </>
        )}

        {phase === 'ready' && (
          <>
            <PulseDot color="#4ade80" />
            <span style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>Restart</span>
          </>
        )}

        {phase === 'error' && (
          <>
            <PulseDot color="#ef4444" />
            <span style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>Error</span>
          </>
        )}
      </div>
    </div>
  );
}
