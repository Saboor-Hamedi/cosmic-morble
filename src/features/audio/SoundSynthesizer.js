import { audioManager } from './AudioContextManager.js';

// Pre-cached AudioBuffer instances for instant, zero-latency playback
let popBuffer = null;
let clickBuffer = null;
let winBuffer = null;

function ensureBuffers(ctx) {
  if (!ctx) return;
  if (popBuffer) return;

  try {
    const sampleRate = ctx.sampleRate;
    
    // 1. Pre-generate crisp, instant Balloon Pop Buffer (0.14 seconds)
    // Combines percussive low-end thump with crisp white-noise snap
    const popLen = Math.floor(sampleRate * 0.14);
    popBuffer = ctx.createBuffer(1, popLen, sampleRate);
    const popData = popBuffer.getChannelData(0);
    for (let i = 0; i < popLen; i++) {
      const t = i / sampleRate;
      // Exponential decay envelope
      const env = Math.exp(-t * 32);
      const lowThump = Math.sin(2 * Math.PI * (160 - t * 800) * t);
      const whiteNoise = (Math.random() * 2 - 1) * Math.exp(-t * 45);
      popData[i] = (lowThump * 0.65 + whiteNoise * 0.5) * env;
    }

    // 2. Pre-generate crisp mechanical Key Click Buffer (0.04 seconds)
    const clickLen = Math.floor(sampleRate * 0.04);
    clickBuffer = ctx.createBuffer(1, clickLen, sampleRate);
    const clickData = clickBuffer.getChannelData(0);
    for (let i = 0; i < clickLen; i++) {
      const t = i / sampleRate;
      const env = Math.exp(-t * 90);
      const clickTone = Math.sin(2 * Math.PI * 400 * t) * env;
      const transient = (Math.random() * 2 - 1) * Math.exp(-t * 200) * 0.4;
      clickData[i] = (clickTone + transient) * 0.5;
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

  try {
    if (popBuffer) {
      const source = ctx.createBufferSource();
      const gain = ctx.createGain();
      source.buffer = popBuffer;
      gain.gain.value = 0.9;
      source.connect(gain);
      gain.connect(ctx.destination);
      source.start(0); // Zero latency immediate playback!
    }

    if (winBuffer) {
      const source2 = ctx.createBufferSource();
      const gain2 = ctx.createGain();
      source2.buffer = winBuffer;
      gain2.gain.value = 0.45;
      source2.connect(gain2);
      gain2.connect(ctx.destination);
      source2.start(0);
    }
  } catch {}
}

export function playKeyClickSound() {
  const ctx = audioManager.getContext();
  if (!ctx) return;
  ensureBuffers(ctx);

  try {
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
