/**
 * Atlas Sanctum Mobile Haptic Feedback Engine
 * Utilizes the browser Vibration API to deliver tactile feedback on mobile/haptic-capable devices
 * for view transitions, high-stakes actions, confirmations, and warnings.
 */

class HapticFeedbackEngine {
  private isEnabled: boolean = true;

  constructor() {
    try {
      const stored = localStorage.getItem('atlas_haptics_enabled');
      if (stored !== null) {
        this.isEnabled = stored === 'true';
      }
    } catch {
      // Ignore storage errors in restricted contexts
    }
  }

  public isSupported(): boolean {
    return typeof window !== 'undefined' && typeof navigator !== 'undefined' && 'vibrate' in navigator;
  }

  public setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
    try {
      localStorage.setItem('atlas_haptics_enabled', String(enabled));
    } catch {
      // Ignore
    }
  }

  public getIsEnabled(): boolean {
    return this.isEnabled;
  }

  public toggleEnabled(): boolean {
    this.setEnabled(!this.isEnabled);
    if (this.isEnabled) {
      this.triggerViewTransitionHaptic();
    }
    return this.isEnabled;
  }

  /**
   * Low-level invocation of the Vibration API with safety checks.
   */
  public vibrate(pattern: number | number[]): boolean {
    if (!this.isEnabled || !this.isSupported()) return false;
    try {
      return navigator.vibrate(pattern);
    } catch {
      return false;
    }
  }

  /**
   * Subtle, crisp single tap (18-20ms) on major view transitions or navigation tab changes.
   */
  public triggerViewTransitionHaptic(): boolean {
    return this.vibrate(20);
  }

  /**
   * Firm, deliberate double-pulse pattern (45ms pulse, 60ms gap, 45ms pulse)
   * for high-stakes actions: reverting simulation states, deploying catalytic tranches,
   * overwriting checkpoints, or confirming moral covenants.
   */
  public triggerHighStakesHaptic(): boolean {
    return this.vibrate([45, 60, 45]);
  }

  /**
   * Uplifting harmonic triple-pulse for successful ledger anchoring, mission milestone completion.
   */
  public triggerSuccessHaptic(): boolean {
    return this.vibrate([25, 40, 25, 40, 30]);
  }

  /**
   * Distinct warning vibration (70ms pulse, 70ms pause, 70ms pulse) for priority floor breaches or critical alerts.
   */
  public triggerWarningHaptic(): boolean {
    return this.vibrate([70, 70, 70]);
  }

  /**
   * Micro-tactile click for small button presses or slider ticks.
   */
  public triggerLightClickHaptic(): boolean {
    return this.vibrate(10);
  }
}

export const hapticFeedback = new HapticFeedbackEngine();
