import React, { memo } from 'react';

export const TitleBarLogo = memo(function TitleBarLogo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={{ 
          fontFamily: 'var(--font-sans)', 
          fontSize: '13px', 
          fontWeight: 800, 
          letterSpacing: '1px',
          color: '#ffffff',
          textShadow: '0 0 10px rgba(0, 240, 255, 0.8)'
        }}>
          🎈 3D BALLOON TYPING ADVENTURE FOR KIDS
        </span>
      </div>
    </div>
  );
});
