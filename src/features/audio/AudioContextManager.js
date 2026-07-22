class AudioContextManager {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
  }

  getContext() {
    if (this.isMuted) return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted && this.ctx) {
      this.ctx.suspend().catch(() => {});
    } else if (!this.isMuted && this.ctx) {
      this.ctx.resume().catch(() => {});
    }
    return this.isMuted;
  }

  getMuteState() {
    return this.isMuted;
  }
}

export const audioManager = new AudioContextManager();
