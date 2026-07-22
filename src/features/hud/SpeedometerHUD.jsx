import React, { memo } from 'react';
import { useGameStore } from '../game-state/useGameStore.js';
import { Gauge, Compass, ShieldAlert, Power } from 'lucide-react';

export const SpeedometerHUD = memo(function SpeedometerHUD() {
  const { speed, pitch, roll, yaw } = useGameStore();

  const mach = (speed * 0.28).toFixed(2);
  const speedPct = Math.min(100, Math.round((speed / 12.0) * 100));
  const pitchDeg = (pitch * (180 / Math.PI)).toFixed(0);
  const rollDeg = (roll * (180 / Math.PI)).toFixed(0);
  const yawDeg = (yaw * (180 / Math.PI)).toFixed(0);

  let statusText = 'CRUISE MODE';
  let statusColor = 'var(--neon-cyan)';
  if (speed > 8.5) {
    statusText = 'AFTERBURNER MAX';
    statusColor = '#ff007f';
  } else if (speed > 4.5) {
    statusText = 'SUPERSONIC FLIGHT';
    statusColor = '#00ff88';
  } else if (speed < 1.0) {
    statusText = 'IDLE / STALL WARNING';
    statusColor = '#ffae00';
  }

  return (
    <div style={{
      position: 'absolute',
      bottom: '16px',
      left: '16px',
      right: '16px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      pointerEvents: 'none',
      zIndex: 20
    }}>
      {/* Left Panel: Speedometer & Mach Gauge */}
      <div style={{
        background: 'rgba(5, 10, 24, 0.85)',
        border: '1px solid rgba(0, 240, 255, 0.4)',
        boxShadow: '0 0 20px rgba(0, 240, 255, 0.15)',
        borderRadius: '10px',
        padding: '14px 18px',
        width: '260px',
        backdropFilter: 'blur(8px)',
        pointerEvents: 'auto'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Gauge size={16} color="var(--neon-cyan)" />
          <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '1.5px', color: 'var(--neon-cyan)' }}>
            VELOCITY & MACH
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
          <span style={{ fontSize: '24px', fontWeight: 800, color: '#ffffff', fontFamily: 'monospace' }}>
            {speed.toFixed(1)} <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>KNOTS</span>
          </span>
          <span style={{ fontSize: '16px', fontWeight: 700, color: statusColor, fontFamily: 'monospace' }}>
            MACH {mach}
          </span>
        </div>

        {/* Glowing Speed Progress Bar */}
        <div style={{
          width: '100%',
          height: '6px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '3px',
          overflow: 'hidden',
          marginBottom: '8px'
        }}>
          <div style={{
            width: `${speedPct}%`,
            height: '100%',
            background: `linear-gradient(90deg, var(--neon-cyan), ${statusColor})`,
            boxShadow: `0 0 8px ${statusColor}`,
            transition: 'width 0.1s linear'
          }} />
        </div>

        <div style={{
          fontSize: '10px',
          fontWeight: 700,
          color: statusColor,
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}>
          {statusText}
        </div>
      </div>

      {/* Center/Right Panel: Attitude Monitor & Quick Quit Legend */}
      <div style={{
        background: 'rgba(5, 10, 24, 0.85)',
        border: '1px solid rgba(255, 0, 127, 0.35)',
        boxShadow: '0 0 20px rgba(255, 0, 127, 0.12)',
        borderRadius: '10px',
        padding: '12px 16px',
        width: '320px',
        backdropFilter: 'blur(8px)',
        pointerEvents: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Compass size={15} color="var(--neon-magenta)" />
            <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '1px', color: 'var(--neon-magenta)' }}>
              ATTITUDE MONITOR
            </span>
          </div>
          <div style={{ display: 'flex', gap: '10px', fontSize: '11px', fontFamily: 'monospace', color: '#fff' }}>
            <span>P:{pitchDeg}°</span>
            <span>R:{rollDeg}°</span>
            <span>Y:{yawDeg}°</span>
          </div>
        </div>

        {/* Vim Legend & Quit Bar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '4px',
          fontSize: '10px',
          color: 'var(--text-dim)',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          paddingTop: '8px'
        }}>
          <div><strong style={{ color: 'var(--neon-cyan)' }}>W / B:</strong> Throttle</div>
          <div><strong style={{ color: 'var(--neon-cyan)' }}>H / L:</strong> Bank Turn</div>
          <div><strong style={{ color: 'var(--neon-cyan)' }}>K / J:</strong> Pitch Up/Down</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Power size={11} color="#ff2626" />
            <strong style={{ color: '#ff2626' }}>Q / ESC:</strong> Quit App
          </div>
        </div>
      </div>
    </div>
  );
});
