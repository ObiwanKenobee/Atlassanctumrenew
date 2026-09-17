/**
 * AUDIO ALCHEMIST PROCEDURAL SOUNDSCAPE ENGINE
 * 
 * Maps bioregional data metrics and variance onto a continuous,
 * procedurally generated ambient harmonic soundscape using the Web Audio API.
 * 
 * Harmonics:
 * - Root Drone: 108 Hz (Sub-harmonic of planetary Earth resonance 432 Hz)
 * - Harmonic Partial: 162 Hz (Pure Pythagorean fifth)
 * - Upper Ambient Layer: 216 Hz & 270 Hz (Harmonic overtones)
 * - Solfeggio Chimes: 528 Hz (Transmutation), 639 Hz (Interconnection), 852 Hz (Intuitive Order)
 * - LFO respiration filter synchronized with the Planetary Pulse
 */

class AudioAlchemistEngine {
  private ctx: AudioContext | null = null;
  private isRunning: boolean = false;
  private masterGain: GainNode | null = null;
  private droneGain: GainNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private lfoNode: OscillatorNode | null = null;
  private lfoGain: GainNode | null = null;
  private droneOscillators: OscillatorNode[] = [];
  private chimeTimer: any = null;
  private volume: number = 0.6;
  private lastVariance: number = 0.05;
  private currentMode: 'consonant' | 'harmonic_bloom' | 'subtle_stress' = 'consonant';

  private initContext(): AudioContext {
    if (!this.ctx || this.ctx.state === 'closed') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public isSoundscapeActive(): boolean {
    return this.isRunning;
  }

  public getVolume(): number {
    return this.volume;
  }

  public setVolume(val: number): void {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.08);
    }
  }

  public startSoundscape(): void {
    if (this.isRunning) return;
    try {
      const ctx = this.initContext();
      const now = ctx.currentTime;

      // Master output gain
      this.masterGain = ctx.createGain();
      this.masterGain.gain.setValueAtTime(0, now);
      this.masterGain.gain.linearRampToValueAtTime(this.volume, now + 2.5);
      this.masterGain.connect(ctx.destination);

      // Lowpass resonant filter simulating organic planetary acoustic atmosphere
      this.filterNode = ctx.createBiquadFilter();
      this.filterNode.type = 'lowpass';
      this.filterNode.frequency.setValueAtTime(450, now);
      this.filterNode.Q.setValueAtTime(2.2, now);
      this.filterNode.connect(this.masterGain);

      // LFO for slow planetary breath modulation (0.12 Hz ~ 8 seconds cycle)
      this.lfoNode = ctx.createOscillator();
      this.lfoNode.frequency.setValueAtTime(0.12, now);
      this.lfoGain = ctx.createGain();
      this.lfoGain.gain.setValueAtTime(140, now); // Filter cutoff sweep ±140Hz
      this.lfoNode.connect(this.lfoGain);
      this.lfoGain.connect(this.filterNode.frequency);
      this.lfoNode.start(now);

      // Drone Sub-Mix
      this.droneGain = ctx.createGain();
      this.droneGain.gain.setValueAtTime(0.35, now);
      this.droneGain.connect(this.filterNode);

      // Procedural Drones tuned to Earth harmonic proportions: 108Hz, 162Hz, 216Hz, 270Hz
      const droneFreqs = [108, 162, 216, 270];
      this.droneOscillators = droneFreqs.map((freq, i) => {
        const osc = ctx.createOscillator();
        osc.type = i === 0 ? 'sine' : i === 1 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq, now);

        // Micro-detune for lush spatial chorus effect
        const detuneAmount = (i % 2 === 0 ? 1 : -1) * (1.5 + i * 0.8);
        osc.detune.setValueAtTime(detuneAmount, now);

        const oscGain = ctx.createGain();
        oscGain.gain.setValueAtTime(0.22 / (i + 1), now);
        osc.connect(oscGain);
        oscGain.connect(this.droneGain!);
        osc.start(now);
        return osc;
      });

      this.isRunning = true;

      // Start procedural chime generator linked to data variance
      this.startGenerativeChimes();
    } catch (e) {
      console.warn('Audio Alchemist failed to initialize:', e);
    }
  }

  public stopSoundscape(): void {
    if (!this.isRunning) return;
    try {
      if (this.chimeTimer) {
        clearInterval(this.chimeTimer);
        this.chimeTimer = null;
      }

      if (this.masterGain && this.ctx) {
        const now = this.ctx.currentTime;
        this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
        this.masterGain.gain.linearRampToValueAtTime(0.0001, now + 1.2);

        setTimeout(() => {
          this.droneOscillators.forEach(osc => {
            try { osc.stop(); osc.disconnect(); } catch (_) {}
          });
          this.droneOscillators = [];

          if (this.lfoNode) {
            try { this.lfoNode.stop(); this.lfoNode.disconnect(); } catch (_) {}
            this.lfoNode = null;
          }

          this.filterNode?.disconnect();
          this.droneGain?.disconnect();
          this.masterGain?.disconnect();
          this.isRunning = false;
        }, 1300);
      } else {
        this.isRunning = false;
      }
    } catch (e) {
      console.warn('Audio Alchemist stop error:', e);
      this.isRunning = false;
    }
  }

  /**
   * Update the soundscape harmonic palette based on current chart metrics and variance.
   */
  public updateMetrics(ecologicalFlourishing: number, economicStability: number, variance: number): void {
    if (!this.isRunning || !this.ctx || !this.filterNode) return;
    const now = this.ctx.currentTime;
    this.lastVariance = variance;

    // Higher flourishing brightens the filter cutoff and enriches overtone harmonics
    const targetFilterFreq = 300 + (ecologicalFlourishing / 100) * 450 + (variance * 300);
    this.filterNode.frequency.setTargetAtTime(
      Math.min(1600, Math.max(250, targetFilterFreq)),
      now,
      0.5
    );

    // Adjust mode based on variance and balance
    if (variance > 0.08) {
      this.currentMode = 'subtle_stress';
    } else if (ecologicalFlourishing > 85 && economicStability > 80) {
      this.currentMode = 'harmonic_bloom';
    } else {
      this.currentMode = 'consonant';
    }
  }

  /**
   * Procedural chime trigger mapping specific data points or variance to bell overtones
   */
  public triggerChime(pitchModifier: number = 1.0, isSpecialTransmutation: boolean = false): void {
    if (!this.isRunning || !this.ctx || !this.masterGain) return;
    try {
      const now = this.ctx.currentTime;
      // Solfeggio Scale: 432Hz, 528Hz, 639Hz, 741Hz, 852Hz
      const pitches = [432, 528, 639, 741, 852, 963];
      const baseFreq = pitches[Math.floor(Math.random() * pitches.length)] * pitchModifier;

      const osc = this.ctx.createOscillator();
      const chimeGain = this.ctx.createGain();

      osc.type = isSpecialTransmutation ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(baseFreq, now);

      // Bell envelope (instant attack, long exponential decay)
      chimeGain.gain.setValueAtTime(0, now);
      chimeGain.gain.linearRampToValueAtTime(0.08 * this.volume, now + 0.04);
      chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + (isSpecialTransmutation ? 3.8 : 2.2));

      osc.connect(chimeGain);
      chimeGain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + (isSpecialTransmutation ? 4.0 : 2.5));
    } catch (_) {}
  }

  private startGenerativeChimes(): void {
    const scheduleNext = () => {
      if (!this.isRunning) return;
      // Interval between 3.5 and 7.5 seconds
      const nextDelay = 3500 + Math.random() * 4000;
      this.chimeTimer = setTimeout(() => {
        if (this.isRunning) {
          const isBloom = this.currentMode === 'harmonic_bloom';
          this.triggerChime(isBloom ? 1.0 : 0.75, isBloom);
          scheduleNext();
        }
      }, nextDelay);
    };
    scheduleNext();
  }

  public getStatus(): { isRunning: boolean; mode: string; volume: number; baseFrequency: string } {
    return {
      isRunning: this.isRunning,
      mode: this.currentMode,
      volume: this.volume,
      baseFrequency: '108 Hz (432 Hz Planetary Earth Harmonic)'
    };
  }
}

export const audioAlchemist = new AudioAlchemistEngine();
