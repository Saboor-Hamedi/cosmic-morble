import React, { useState } from 'react';
import { useGameStore } from '../game-state/useGameStore.js';
import { useSelectionStore } from '../game-state/useSelectionStore.js';
import { Menu, X, Gauge, Compass, Target, Video } from 'lucide-react';

export const SubtleSidebar = React.memo(function SubtleSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { speed, pitch, roll, yaw } = useGameStore();
  const { selectedTarget, cameraMode, setSelectedTarget, toggleCameraMode } = useSelectionStore();

  const mach = (speed * 0.28).toFixed(2);
  const pitchDeg = (pitch * (180 / Math.PI)).toFixed(0);
  const rollDeg = (roll * (180 / Math.PI)).toFixed(0);
  const yawDeg = (yaw * (180 / Math.PI)).toFixed(0);

  const targets = [
    { id: 'spaceship', label: '🛰️ Starship' },
    { id: 'sun', label: '☀️ Sun' },
    { id: 'moon', label: '🌙 Moon' },
    { id: 'planet', label: '🌍 Planet' },
  ];

  return (
    <div style={{
      position: 'absolute',
      top: '46px',
      left: '12px',
      zIndex: 50,
      pointerEvents: 'auto'
    }}>
      {/* Tiny, Ultra-Subtle Burger Button (Visible when closed) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            background: 'rgba(5, 8, 20, 0.4)',
            border: 'none',
            color: 'rgba(255, 255, 255, 0.6)',
            width: '32px',
            height: '32px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            backdropFilter: 'blur(4px)'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.color = '#00ffff';
            e.currentTarget.style.background = 'rgba(0, 240, 255, 0.15)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)';
            e.currentTarget.style.background = 'rgba(5, 8, 20, 0.4)';
          }}
          title="Open Flight & Inspection Sidebar"
        >
          <Menu size={16} />
        </button>
      )}

      {/* Sleek Glass Collapsible Sidebar Drawer (Visible when opened) */}
      {isOpen && (
        <div style={{
          background: 'rgba(5, 10, 24, 0.92)',
          border: '1px solid rgba(0, 240, 255, 0.25)',
          boxShadow: '0 0 25px rgba(0, 0, 0, 0.8)',
          borderRadius: '10px',
          padding: '14px',
          width: '240px',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          color: '#ffffff',
          fontFamily: 'var(--font-mono, monospace)',
          animation: 'fadeIn 0.2s ease'
        }}>
          {/* Header & Close Button */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#00ffff', letterSpacing: '1px' }}>
              FLIGHT SYSTEM HUD
            </span>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'rgba(255, 255, 255, 0.6)',
                cursor: 'pointer',
                padding: '2px',
                display: 'flex'
              }}
              onMouseOver={(e) => e.currentTarget.style.color = '#ff3366'}
              onMouseOut={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'}
            >
              <X size={16} />
            </button>
          </div>

          {/* Velocity & Mach Section */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.04)',
            padding: '8px 10px',
            borderRadius: '6px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', color: '#8fa2c4', marginBottom: '4px' }}>
              <Gauge size={13} color="#00ffff" />
              <span>SPEED & MACH</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: 700 }}>
              <span>{speed.toFixed(1)} <small style={{ fontSize: '9px', color: '#8fa2c4' }}>KTS</small></span>
              <span style={{ color: speed > 8 ? '#ff007f' : '#00ff88' }}>MACH {mach}</span>
            </div>
          </div>

          {/* Attitude Monitor */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.04)',
            padding: '8px 10px',
            borderRadius: '6px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', color: '#8fa2c4', marginBottom: '4px' }}>
              <Compass size={13} color="#ff007f" />
              <span>ATTITUDE (P / R / Y)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
              <span>P: {pitchDeg}°</span>
              <span>R: {rollDeg}°</span>
              <span>Y: {yawDeg}°</span>
            </div>
          </div>

          {/* Target Selector & Camera Mode Toggle */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.04)',
            padding: '8px 10px',
            borderRadius: '6px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', color: '#8fa2c4' }}>
              <Target size={13} color="#ffaa00" />
              <span>INSPECT TARGET (ORBIT)</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
              {targets.map((t) => {
                const isSel = cameraMode === 'orbit' && selectedTarget === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTarget(t.id)}
                    style={{
                      background: isSel ? 'rgba(0, 240, 255, 0.25)' : 'rgba(255, 255, 255, 0.06)',
                      color: isSel ? '#00ffff' : '#8fa2c4',
                      border: isSel ? '1px solid #00ffff' : 'none',
                      borderRadius: '4px',
                      padding: '5px',
                      fontSize: '11px',
                      cursor: 'pointer'
                    }}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
            <button
              onClick={toggleCameraMode}
              style={{
                background: cameraMode === 'flight' ? 'rgba(0, 255, 136, 0.2)' : 'rgba(255, 170, 0, 0.2)',
                color: cameraMode === 'flight' ? '#00ff88' : '#ffaa00',
                border: 'none',
                borderRadius: '4px',
                padding: '6px',
                fontSize: '10px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                marginTop: '2px'
              }}
            >
              <Video size={13} />
              {cameraMode === 'flight' ? 'MODE: CHASE (FLIGHT)' : 'MODE: 360° ORBIT'}
            </button>
          </div>

          {/* Quick Controls Legend */}
          <div style={{ fontSize: '9px', color: '#687b9e', lineHeight: '1.4', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '8px' }}>
            <div><strong>W/B:</strong> Throttle | <strong>H/L:</strong> Bank | <strong>K/J:</strong> Pitch</div>
            <div><strong>V:</strong> Toggle Orbit / Chase | <strong>Q/Esc:</strong> Quit</div>
          </div>
        </div>
      )}
    </div>
  );
});
