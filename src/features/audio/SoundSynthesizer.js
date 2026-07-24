import { audioManager } from './AudioContextManager.js';
import { useTypingGameStore } from '../typing-game/useTypingGameStore.js';

// Pre-cached AudioBuffer instances for instant, zero-latency playback
let popBuffer = null;
let clickBuffer = null;
let winBuffer = null;

function ensureBuffers(ctx) {
  if (!ctx) return;
  if (popBuffer) return;

  try {
    const sampleRate = ctx.sampleRate;
    
    // 1. Pre-generate ultra juicy Balloon Pop Impact Buffer (0.35 seconds)
    const popLen = Math.floor(sampleRate * 0.35);
    popBuffer = ctx.createBuffer(1, popLen, sampleRate);
    const popData = popBuffer.getChannelData(0);
    for (let i = 0; i < popLen; i++) {
      const t = i / sampleRate;
      
      // Punchy Bass Thump (Impact)
      const bassEnv = Math.exp(-t * 22);
      const lowThump = Math.sin(2 * Math.PI * (220 - t * 1500) * t); // Massive pitch drop
      
      // Glass/Water shatter noise (Squelch)
      const noiseEnv = Math.exp(-t * 14);
      const whiteNoise = (Math.random() * 2 - 1);
      
      // Mix and soft clip for saturation
      let sample = (lowThump * 1.8 * bassEnv) + (whiteNoise * 0.7 * noiseEnv);
      sample = Math.max(-1, Math.min(1, sample)); // Hard limiter
      popData[i] = sample;
    }

    // 2. Pre-generate juicy mechanical Key Click Buffer (0.06 seconds)
    const clickLen = Math.floor(sampleRate * 0.06);
    clickBuffer = ctx.createBuffer(1, clickLen, sampleRate);
    const clickData = clickBuffer.getChannelData(0);
    for (let i = 0; i < clickLen; i++) {
      const t = i / sampleRate;
      const env = Math.exp(-t * 60);
      const clickTone = Math.sin(2 * Math.PI * (800 - t * 6000) * t) * env; // sharp downward click
      const transient = (Math.random() * 2 - 1) * Math.exp(-t * 180) * 0.6;
      clickData[i] = (clickTone * 0.4 + transient);
    }

    // 3. Pre-generate cheerful Celebration Chime Buffer (0.28 seconds)
    const winLen = Math.floor(sampleRate * 0.28);
    winBuffer = ctx.createBuffer(1, winLen, sampleRate);
    const winData = winBuffer.getChannelData(0);
    for (let i = 0; i < winLen; i++) {
      const t = i / sampleRate;
      const env = Math.exp(-t * 12);
      const chord = Math.sin(2 * Math.PI * 1046.5 * t) + Math.sin(2 * Math.PI * 1318.5 * t) * 0.8 + Math.sin(2 * Math.PI * 1568 * t) * 0.6;
      winData[i] = (chord / 2.4) * env * 0.45;
    }
  } catch {}
}

export function playBalloonPopSound() {
  const ctx = audioManager.getContext();
  if (!ctx) return;
  ensureBuffers(ctx);

  const soundTheme = useTypingGameStore.getState().soundTheme || 'synth';

  try {
    const now = ctx.currentTime;

    // Optional win chord on top of pop
    if (winBuffer) {
      const source2 = ctx.createBufferSource();
      const gain2 = ctx.createGain();
      source2.buffer = winBuffer;
      gain2.gain.value = 0.25;
      source2.connect(gain2);
      gain2.connect(ctx.destination);
      source2.start(0);
    }

    if (soundTheme === 'piano') {
      // Musical chord pop
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.exponentialRampToValueAtTime(130.81, now + 0.4);
      gain.gain.setValueAtTime(0.8, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.4);
      return;
    }

    if (soundTheme === 'laser') {
      // Pew pew laser explosion
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(50, now + 0.3);
      gain.gain.setValueAtTime(0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
      return;
    }

    if (soundTheme === 'water') {
      // Bloop splash
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.linearRampToValueAtTime(600, now + 0.1);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.3);
      gain.gain.setValueAtTime(0.7, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
      return;
    }

    // Default 'synth' thick punchy thump
    if (popBuffer) {
      const source = ctx.createBufferSource();
      const gain = ctx.createGain();
      source.buffer = popBuffer;
      gain.gain.value = 0.9;
      source.connect(gain);
      gain.connect(ctx.destination);
      source.start(0);
    }
  } catch {}
}

// Pentatonic scale notes C4 to C6 for Musical Piano Mode
const PIANO_NOTES = [
  261.63, 293.66, 329.63, 392.00, 440.00, 
  523.25, 587.33, 659.25, 783.99, 880.00, 
  1046.50, 1174.66, 1318.51, 1567.98, 1760.00
];

export function playKeyClickSound(keyChar = '') {
  const ctx = audioManager.getContext();
  if (!ctx) return;
  ensureBuffers(ctx);

  const soundTheme = useTypingGameStore.getState().soundTheme || 'synth';

  try {
    const now = ctx.currentTime;

    if (soundTheme === 'piano') {
      const charCode = (keyChar || 'A').toUpperCase().charCodeAt(0) - 65;
      const freqIdx = Math.abs(charCode || 0) % PIANO_NOTES.length;
      const freq = PIANO_NOTES[freqIdx];

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
      return;
    }

    if (soundTheme === 'laser') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1100, now);
      osc.frequency.exponentialRampToValueAtTime(240, now + 0.09);
      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.09);
      return;
    }

    if (soundTheme === 'water') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(190, now);
      osc.frequency.exponentialRampToValueAtTime(480, now + 0.08);
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
      return;
    }

    // Default 'synth' mechanical key click
    if (clickBuffer) {
      const source = ctx.createBufferSource();
      const gain = ctx.createGain();
      source.buffer = clickBuffer;
      gain.gain.value = 0.6;
      source.connect(gain);
      gain.connect(ctx.destination);
      source.start(0);
    }
  } catch {}
}

export function playWinFanfare() {
  const ctx = audioManager.getContext();
  if (!ctx) return;
  ensureBuffers(ctx);

  try {
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      const now = ctx.currentTime + idx * 0.07;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    });
  } catch {}
}

export function playPowerUpSound() {
  const ctx = audioManager.getContext();
  if (!ctx) return;
  try {
    const notes = [440, 554.37, 659.25, 880];
    notes.forEach((freq, idx) => {
      const now = ctx.currentTime + idx * 0.05;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.2);
    });
  } catch {}
}

export function playHoverSound() {
  const ctx = audioManager.getContext();
  if (!ctx) return;
  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(700, now);
    osc.frequency.exponentialRampToValueAtTime(850, now + 0.06);
    gain.gain.setValueAtTime(0.03, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.06);
  } catch {}
}

export function playPulseSound() { playHoverSound(); }
export function playBoostSound() { playBalloonPopSound(); }
export function playWarpSound() { playBalloonPopSound(); }
export function playEngineRoar() {}
