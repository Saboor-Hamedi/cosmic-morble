import React from 'react';

export function VersionBadge() {
  const version =
    window.electronAPI?.version ||
    (typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : '1.0.2');

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '18px',
        left: '18px',
        zIndex: 9999,
        pointerEvents: 'auto',
        fontFamily: `'Inter', system-ui, -apple-system, sans-serif`,
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        background: 'rgba(0, 0, 0, 0.28)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '999px',
        padding: '5px 12px',
        fontSize: '11px',
        fontWeight: 500,
        color: 'rgba(255, 255, 255, 0.45)',
        userSelect: 'none',
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = 'rgba(255, 255, 255, 0.85)';
        e.currentTarget.style.background = 'rgba(0, 0, 0, 0.45)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = 'rgba(255, 255, 255, 0.45)';
        e.currentTarget.style.background = 'rgba(0, 0, 0, 0.28)';
      }}
      title={`Cosmic Morble v${version}`}
    >
      <span style={{ opacity: 0.7 }}>v</span>
      <span>{version}</span>
    </div>
  );
}
