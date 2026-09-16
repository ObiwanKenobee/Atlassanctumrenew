/**
 * Sanctum Alchemical Audio Engine
 * Pure Web Audio API synthesis of Solfeggio frequencies, singing bowls,
 * and elemental resonant harmonics.
 */

class AlchemicalAudioEngine {
  private ctx: AudioContext | null = null;
  private droneOsc1: OscillatorNode | null = null;
  private droneOsc2: OscillatorNode | null = null;
  private droneGain: GainNode | null = null;
  private currentDroneFreq: number | null = null;
  private isMuted: boolean = false;
  private masterGainNode: GainNode | null = null;

  constructor() {
    try {
      const storedMute = localStorage.getItem('atlas_audio_muted');
      if (storedMute !== null) {
        this.isMuted = storedMute === 'true';
      }
    } catch {
      // Ignore in sandboxed iframes
    }
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGainNode = this.ctx.createGain();
        this.masterGainNode.gain.setValueAtTime(0.2, this.ctx.currentTime);
        this.masterGainNode.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stopDrone();
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Continuous organic Solfeggio binaural drone
   */
  public startHarmonicDrone(frequency: number = 528) {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx || !this.masterGainNode) return;

    // If drone is already running at this frequency, keep it
    if (this.currentDroneFreq === frequency && this.droneGain) return;

    this.stopDrone();

    this.currentDroneFreq = frequency;
    const now = ctx.currentTime;

    // Create dual oscillators for gentle beating (e.g. 1.5Hz binaural drift)
    this.droneOsc1 = ctx.createOscillator();
    this.droneOsc2 = ctx.createOscillator();
    this.droneGain = ctx.createGain();

    const lowpass = ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(frequency * 2.2, now);

    this.droneOsc1.type = 'sine';
    this.droneOsc1.frequency.setValueAtTime(frequency, now);

    this.droneOsc2.type = 'sine';
    this.droneOsc2.frequency.setValueAtTime(frequency + 1.2, now); // Gentle 1.2Hz celestial pulsation

    // Soft fade in over 2.5 seconds
    this.droneGain.gain.setValueAtTime(0, now);
    this.droneGain.gain.linearRampToValueAtTime(0.08, now + 2.5);

    this.droneOsc1.connect(lowpass);
    this.droneOsc2.connect(lowpass);
    lowpass.connect(this.droneGain);
    this.droneGain.connect(this.masterGainNode);

    this.droneOsc1.start(now);
    this.droneOsc2.start(now);
  }

  public stopDrone() {
    if (!this.ctx || !this.droneGain) return;
    try {
      const now = this.ctx.currentTime;
      this.droneGain.gain.linearRampToValueAtTime(0.0001, now + 1.2);
      setTimeout(() => {
        try {
          this.droneOsc1?.stop();
          this.droneOsc2?.stop();
          this.droneOsc1?.disconnect();
          this.droneOsc2?.disconnect();
          this.droneGain?.disconnect();
        } catch {
          // Ignore
        }
        this.droneOsc1 = null;
        this.droneOsc2 = null;
        this.droneGain = null;
        this.currentDroneFreq = null;
      }, 1300);
    } catch {
      this.droneOsc1 = null;
      this.droneOsc2 = null;
      this.droneGain = null;
      this.currentDroneFreq = null;
    }
  }

  public isDroneActive(): boolean {
    return this.currentDroneFreq !== null;
  }

  public getActiveDroneFreq(): number | null {
    return this.currentDroneFreq;
  }

  /**
   * Resonant Tibetan Singing Bowl strike with overtone decay
   */
  public playSingingBowl(baseFreq: number = 432, duration = 3.5) {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx || !this.masterGainNode) return;

    const now = ctx.currentTime;
    // Harmonic overtones of singing bowls (fundamental, octave + minor 3rd, 5th, etc.)
    const overtones = [
      { ratio: 1.0, gain: 0.6, decay: duration },
      { ratio: 2.76, gain: 0.35, decay: duration * 0.8 },
      { ratio: 4.82, gain: 0.18, decay: duration * 0.6 },
      { ratio: 7.2, gain: 0.08, decay: duration * 0.4 }
    ];

    overtones.forEach(({ ratio, gain, decay }) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq * ratio, now);

      g.gain.setValueAtTime(0, now);
      g.gain.linearRampToValueAtTime(gain * 0.18, now + 0.04);
      g.gain.exponentialRampToValueAtTime(0.00001, now + decay);

      osc.connect(g);
      g.connect(this.masterGainNode!);

      osc.start(now);
      osc.stop(now + decay + 0.1);
    });
  }

  /**
   * Elemental Chimes (Earth, Water, Fire, Air, Aether)
   */
  public playElementalChime(element: 'earth' | 'water' | 'fire' | 'air' | 'aether') {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx || !this.masterGainNode) return;

    const freqMap = {
      earth: [194.18, 388.36, 582.54], // Earth day fundamental
      water: [417, 528, 639],          // Solfeggio flow
      fire: [528, 741, 1056],          // Solar brilliance
      air: [639, 852, 1278],           // Etheric wind
      aether: [432, 864, 1296, 1728]   // Pythagorean cosmic octave
    };

    const freqs = freqMap[element] || freqMap.aether;
    const now = ctx.currentTime;

    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();

      osc.type = element === 'fire' ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      const dur = 1.8 - idx * 0.2;
      g.gain.setValueAtTime(0, now + idx * 0.08);
      g.gain.linearRampToValueAtTime(0.12 / (idx + 1), now + idx * 0.08 + 0.03);
      g.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + dur);

      osc.connect(g);
      g.connect(this.masterGainNode!);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + dur + 0.05);
    });
  }

  /**
   * Transmutation pulse chime when an alchemical stage completes
   */
  public playTransmutationPulse(stage: 'nigredo' | 'albedo' | 'citrinitas' | 'rubedo') {
    const baseFreqs = {
      nigredo: 174,
      albedo: 417,
      citrinitas: 528,
      rubedo: 852
    };
    this.playSingingBowl(baseFreqs[stage], 2.8);
  }

  /**
   * Benediction chime for earth blessing
   */
  public playBenedictionChime() {
    this.playSingingBowl(528, 3.2);
    setTimeout(() => {
      this.playSingingBowl(963, 2.5);
    }, 400);
  }
}

export const alchemicalAudio = new AlchemicalAudioEngine();
