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
    gap: '8px',
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
      switch (data.event) {
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
          // Silently hide on error — don't alarm the user
          setVisible(false);
          break;
        default:
          break;
      }
    });

    cleanupRef.current = cleanup;
    return () => { if (cleanupRef.current) cleanupRef.current(); };
  }, []);

  if (!visible || phase === 'idle') return null;

  const handleClick = () => {
    if (phase === 'ready') {
      window.electronAPI?.installUpdate();
    }
  };

  const isClickable = phase === 'ready';

  return (
    <div style={STYLES.wrapper}>
      <div
        style={{
          ...STYLES.pill,
          ...(isClickable ? STYLES.pillClickable : {}),
          animation: 'updater-fadein 0.35s ease forwards',
          borderColor: phase === 'ready'
            ? 'rgba(34, 197, 94, 0.35)'
            : 'rgba(255, 255, 255, 0.10)',
        }}
        onClick={handleClick}
        onMouseEnter={e => {
          if (isClickable) {
            e.currentTarget.style.background = 'rgba(34, 197, 94, 0.18)';
            e.currentTarget.style.color = 'rgba(255,255,255,0.95)';
          }
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'rgba(0,0,0,0.42)';
          e.currentTarget.style.color = 'rgba(255,255,255,0.75)';
        }}
        title={
          phase === 'available' ? `Version ${version} is downloading…` :
          phase === 'downloading' ? `Downloading update… ${percent}%` :
          phase === 'ready' ? `v${version} is ready — click to restart` : ''
        }
      >
        {phase === 'available' && (
          <>
            <PulseDot color="#38bdf8" />
            <span>Update available{version ? ` · v${version}` : ''}</span>
          </>
        )}

        {phase === 'downloading' && (
          <>
            <ProgressRing percent={percent} />
            <span>{percent}%</span>
          </>
        )}

        {phase === 'ready' && (
          <>
            <PulseDot color="#22c55e" />
            <span>Restart to apply{version ? ` v${version}` : ''}</span>
          </>
        )}
      </div>
    </div>
  );
}
