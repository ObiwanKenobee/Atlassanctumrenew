/**
 * Atlas Sanctum Web Audio Synthesis Engine
 * Generates organic, resonant harmonic micro-tones and soft acoustic chimes
 * using pure Web Audio API without external asset dependencies.
 */

class AudioFeedbackEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.18; // Soft, ambient, non-intrusive default

  constructor() {
    // Load persisted mute preference if available
    try {
      const storedMute = localStorage.getItem('atlas_audio_muted');
      if (storedMute !== null) {
        this.isMuted = storedMute === 'true';
      }
    } catch {
      // Ignore storage errors in restricted iframes
    }
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    try {
      localStorage.setItem('atlas_audio_muted', String(muted));
    } catch {
      // Ignore
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    if (!this.isMuted) {
      this.playViewTransition();
    }
    return this.isMuted;
  }

  /**
   * Generates a soft harmonic bell with warm exponential decay.
   */
  private playBell(frequencies: number[], duration = 0.8, type: OscillatorType = 'sine', baseGain = 1.0) {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(this.volume * baseGain, now);
    masterGain.connect(ctx.destination);

    // Low-pass filter for organic warmth
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2400, now);
    filter.frequency.exponentialRampToValueAtTime(400, now + duration);
    filter.connect(masterGain);

    frequencies.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      
      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);

      const amp = 0.5 / (idx + 1);
      oscGain.gain.setValueAtTime(0, now);
      oscGain.gain.linearRampToValueAtTime(amp, now + 0.02); // 20ms soft attack
      oscGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(oscGain);
      oscGain.connect(filter);

      osc.start(now);
      osc.stop(now + duration + 0.05);
    });
  }

  /**
   * Soft dual-tone on view transition (432Hz Pythagorean foundation)
   */
  public playViewTransition() {
    this.playBell([432, 648], 0.35, 'sine', 0.6);
  }

  /**
   * Uplifting harmonic chord on data synchronization / successful calculation (528Hz Solfeggio / C major triad)
   */
  public playSyncComplete() {
    this.playBell([528, 660, 792], 0.7, 'sine', 0.85);
  }

  /**
   * Subtle alert chime for ecological telemetry warnings (warm 396Hz harmonic)
   */
  public playAlertPing() {
    this.playBell([396, 594], 0.6, 'triangle', 0.7);
  }

  /**
   * Telemetry anomaly or critical warning chime
   */
  public playTelemetryWarning() {
    this.playBell([330, 495, 660], 0.65, 'triangle', 0.85);
  }

  /**
   * Uplifting impact milestone trigger tone
   */
  public playImpactTrigger() {
    this.playBell([528, 660, 792, 1056], 0.8, 'sine', 0.9);
  }

  /**
   * Deep sacred resonance for covenant inspection / 10 commandments interaction
   */
  public playCovenantResonance() {
    this.playBell([216, 324, 432], 1.2, 'sine', 1.0);
  }

  /**
   * Micro-haptic tactile feedback for slider manipulation / button clicks
   */
  public playMicroTick() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(440, now + 0.03);

    gain.gain.setValueAtTime(this.volume * 0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.035);
  }

  /**
   * Subtle soft click alias for buttons, cards, and modal toggles
   */
  public playSubtleClick() {
    this.playMicroTick();
  }

  /**
   * Generic dispatcher for named UI audio feedback events
   */
  public play(eventName: 'softClick' | 'actionSuccess' | 'warningAlert' | 'failure' | string) {
    switch (eventName) {
      case 'softClick':
        this.playMicroTick();
        break;
      case 'actionSuccess':
        this.playSyncComplete();
        break;
      case 'warningAlert':
        this.playTelemetryWarning();
        break;
      case 'failure':
        this.playAlertPing();
        break;
      default:
        this.playMicroTick();
        break;
    }
  }
}

export const audioFeedback = new AudioFeedbackEngine();
