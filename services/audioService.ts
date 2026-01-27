
class AudioService {
  private ctx: AudioContext | null = null;

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  private playTone(freq: number, type: OscillatorType, duration: number, volume: number = 0.1) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    
    gain.gain.setValueAtTime(volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  playSpin() {
    this.playTone(150, 'square', 0.1, 0.05);
  }

  playStop() {
    this.playTone(200, 'sine', 0.05, 0.1);
  }

  playWin() {
    this.playTone(440, 'triangle', 0.2, 0.1);
    setTimeout(() => this.playTone(554, 'triangle', 0.2, 0.1), 100);
    setTimeout(() => this.playTone(659, 'triangle', 0.4, 0.1), 200);
  }

  playError() {
    this.playTone(100, 'sawtooth', 0.3, 0.1);
  }
}

export const audioService = new AudioService();
