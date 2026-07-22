import React, { useState, useEffect, memo } from 'react';

export const TitleBarClock = memo(function TitleBarClock() {
  const [timeStr, setTimeStr] = useState(() => new Date().toTimeString().slice(0, 8));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeStr(new Date().toTimeString().slice(0, 8));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{
      fontFamily: 'var(--font-mono)',
      fontSize: '11px',
      color: 'var(--text-dim)',
      background: 'rgba(0, 240, 255, 0.05)',
      padding: '2px 10px',
      borderRadius: '4px',
      border: '1px solid rgba(0, 240, 255, 0.15)',
      letterSpacing: '1px'
    }}>
      TIME: <span style={{ color: 'var(--neon-cyan)' }}>{timeStr} UTC</span>
    </div>
  );
});
