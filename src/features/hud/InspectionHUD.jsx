import React from 'react';
import { useSelectionStore } from '../game-state/useSelectionStore.js';

export const InspectionHUD = React.memo(function InspectionHUD() {
  const { selectedTarget, cameraMode, setSelectedTarget, setCameraMode, toggleCameraMode } = useSelectionStore();

  const targets = [
    { id: 'spaceship', label: '🛰️ STARSHIP', desc: 'S.S. Starfinder Voyager' },
    { id: 'sun', label: '☀️ VOLUMETRIC SUN', desc: 'Boiling Fire Core' },
    { id: 'moon', label: '🌙 CRATERED MOON', desc: 'Highlands & Maria' },
    { id: 'planet', label: '🌍 BLUE EXOPLANET', desc: 'Atmosphere Shell' },
  ];

  return (
    <div style={{
      position: 'absolute',
      top: '45px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 100,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '8px',
      pointerEvents: 'none'
    }}>
      {/* Target Selector Buttons */}
      <div style={{
        display: 'flex',
        gap: '6px',
        backgroundColor: 'rgba(6, 12, 24, 0.85)',
        padding: '6px 12px',
        borderRadius: '24px',
        border: '1px solid rgba(0, 240, 255, 0.4)',
        boxShadow: '0 0 20px rgba(0, 240, 255, 0.25)',
        backdropFilter: 'blur(8px)',
        pointerEvents: 'auto'
      }}>
        {targets.map((t) => {
          const isSelected = cameraMode === 'orbit' && selectedTarget === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setSelectedTarget(t.id)}
              style={{
                background: isSelected
                  ? 'linear-gradient(135deg, rgba(0, 240, 255, 0.4), rgba(0, 150, 255, 0.2))'
                  : 'transparent',
                color: isSelected ? '#00ffff' : '#8fa2c4',
                border: isSelected ? '1px solid #00ffff' : '1px solid transparent',
                borderRadius: '16px',
                padding: '6px 12px',
                fontSize: '11px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textShadow: isSelected ? '0 0 8px #00ffff' : 'none'
              }}
            >
              {t.label}
            </button>
          );
        })}

        <div style={{ width: '1px', backgroundColor: 'rgba(255, 255, 255, 0.2)', margin: '0 4px' }} />

        {/* Mode Toggle Button */}
        <button
          onClick={toggleCameraMode}
          style={{
            background: cameraMode === 'flight'
              ? 'linear-gradient(135deg, rgba(0, 255, 136, 0.3), rgba(0, 180, 100, 0.2))'
              : 'rgba(255, 170, 0, 0.25)',
            color: cameraMode === 'flight' ? '#00ff88' : '#ffaa00',
            border: cameraMode === 'flight' ? '1px solid #00ff88' : '1px solid #ffaa00',
            borderRadius: '16px',
            padding: '6px 14px',
            fontSize: '11px',
            fontWeight: '800',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            textShadow: cameraMode === 'flight' ? '0 0 8px #00ff88' : '0 0 8px #ffaa00'
          }}
        >
          {cameraMode === 'flight' ? '🎮 CHASE CAMERA (ACTIVE)' : '🔄 360° ORBIT MODE (V)'}
        </button>
      </div>

      {/* Mode Instructions / Active Target Banner */}
      {cameraMode === 'orbit' && (
        <div style={{
          backgroundColor: 'rgba(10, 18, 36, 0.9)',
          padding: '4px 14px',
          borderRadius: '12px',
          border: '1px solid rgba(255, 170, 0, 0.5)',
          color: '#ffcc00',
          fontSize: '10px',
          fontWeight: '600',
          letterSpacing: '0.6px',
          boxShadow: '0 0 12px rgba(255, 170, 0, 0.2)',
          textTransform: 'uppercase'
        }}>
          ✨ Mouse Drag to Rotate 360° Around {selectedTarget.toUpperCase()} | Scroll to Zoom | Press V or Click Chase to Resume Flight
        </div>
      )}
    </div>
  );
});
