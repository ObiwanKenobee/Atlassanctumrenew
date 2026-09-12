/**
 * ATLAS SANCTUM — Smart Notification Machine Learning Service
 * 
 * Implements an online Bayesian Attention & Fatigue Learning Model that adapts
 * alert delivery sensitivities across the 24-hour circadian cycle.
 * 
 * CORE EPISTEMIC PRINCIPLE:
 * - High-priority EXISTENTIAL and CRITICAL threats always bypass fatigue suppression (100% delivery guarantee).
 * - Low & Moderate telemetry noise during predicted fatigue/quiet windows is intelligently batched into digests.
 */

export type HazardSeverity = 'EXISTENTIAL' | 'CRITICAL' | 'WARNING' | 'ADVISORY';

export interface HourlyAttentionProfile {
  hour: number; // 0 - 23
  interactionCount: number;
  dismissCount: number;
  receptivityScore: number; // 0.0 (high fatigue / low attention) to 1.0 (high receptivity)
  fatigueRisk: number; // 0.0 to 1.0
  isQuietWindow: boolean;
}

export interface SmartNotificationState {
  mlAdaptiveEnabled: boolean;
  userOverrideQuietHours: { start: number; end: number }; // e.g. 23:00 to 07:00
  hourlyProfiles: HourlyAttentionProfile[];
  totalAlertsDispatched: number;
  totalFatigueBatched: number;
  existentialThreatsDelivered: number;
  lastUpdatedTimestamp: number;
  digestQueue: QueuedDigestAlert[];
}

export interface QueuedDigestAlert {
  id: string;
  title: string;
  bioregionName: string;
  severity: HazardSeverity;
  category: string;
  timestamp: string;
  batchedReason: string;
}

export interface DispatchEvaluationResult {
  shouldDeliverImmediately: boolean;
  isExistentialBypass: boolean;
  batchedForDigest: boolean;
  currentReceptivity: number;
  reason: string;
  recommendedDeliveryWindow?: string;
}

const STORAGE_KEY = 'atlas_smart_notification_ml_state';

// Generate initial empirical prior based on typical diurnal cognitive circadian rhythms
const generateInitialDiurnalPriors = (): HourlyAttentionProfile[] => {
  return Array.from({ length: 24 }, (_, h) => {
    let baselineReceptivity = 0.5;
    let fatigueRisk = 0.5;
    let isQuiet = false;

    // Late night / sleep window (23:00 - 06:00)
    if (h >= 23 || h <= 5) {
      baselineReceptivity = 0.08;
      fatigueRisk = 0.92;
      isQuiet = true;
    } 
    // Early morning waking window (06:00 - 08:00)
    else if (h >= 6 && h <= 8) {
      baselineReceptivity = 0.65;
      fatigueRisk = 0.35;
    }
    // Peak morning alertness (09:00 - 12:00)
    else if (h >= 9 && h <= 12) {
      baselineReceptivity = 0.92;
      fatigueRisk = 0.12;
    }
    // Post-prandial dip (13:00 - 15:00)
    else if (h >= 13 && h <= 15) {
      baselineReceptivity = 0.55;
      fatigueRisk = 0.48;
    }
    // Afternoon vigilance peak (16:00 - 19:00)
    else if (h >= 16 && h <= 19) {
      baselineReceptivity = 0.88;
      fatigueRisk = 0.18;
    }
    // Evening winding down (20:00 - 22:00)
    else {
      baselineReceptivity = 0.45;
      fatigueRisk = 0.60;
    }

    return {
      hour: h,
      interactionCount: Math.round(baselineReceptivity * 8),
      dismissCount: Math.round(fatigueRisk * 4),
      receptivityScore: Math.round(baselineReceptivity * 100) / 100,
      fatigueRisk: Math.round(fatigueRisk * 100) / 100,
      isQuietWindow: isQuiet
    };
  });
};

class SmartNotificationLearningService {
  private state: SmartNotificationState;
  private listeners: Array<(state: SmartNotificationState) => void> = [];

  constructor() {
    this.state = this.loadState();
  }

  private loadState(): SmartNotificationState {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && Array.isArray(parsed.hourlyProfiles) && parsed.hourlyProfiles.length === 24) {
          return parsed;
        }
      }
    } catch {
      // Fallback
    }

    return {
      mlAdaptiveEnabled: true,
      userOverrideQuietHours: { start: 23, end: 6 },
      hourlyProfiles: generateInitialDiurnalPriors(),
      totalAlertsDispatched: 142,
      totalFatigueBatched: 38,
      existentialThreatsDelivered: 19,
      lastUpdatedTimestamp: Date.now(),
      digestQueue: [
        {
          id: 'digest-001',
          title: 'Minor LoRaWAN sensor drift in Mau Forest Station #4',
          bioregionName: 'Mau Forest Complex',
          severity: 'ADVISORY',
          category: 'canopy_stress',
          timestamp: '38 mins ago',
          batchedReason: 'Batched during Circadian Low Receptivity window (03:00 - 06:00)'
        },
        {
          id: 'digest-002',
          title: 'Sub-threshold nitrate variance in Mara tributary #2',
          bioregionName: 'Mara River Basin',
          severity: 'WARNING',
          category: 'siltation_surge',
          timestamp: '15 mins ago',
          batchedReason: 'Batched to minimize alert fatigue during deep work hours'
        }
      ]
    };
  }

  private saveState() {
    try {
      this.state.lastUpdatedTimestamp = Date.now();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      this.notifyListeners();
    } catch (e) {
      console.warn('Could not persist ML notification state:', e);
    }
  }

  public getState(): SmartNotificationState {
    return { ...this.state };
  }

  public subscribe(listener: (state: SmartNotificationState) => void): () => void {
    this.listeners.push(listener);
    listener(this.getState());
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners() {
    const currentState = this.getState();
    this.listeners.forEach(l => l(currentState));
  }

  /**
   * Evaluates whether an incoming satellite alert should be immediately delivered
   * or batched to minimize cognitive fatigue.
   */
  public evaluateAlertDelivery(alert: {
    id: string;
    title: string;
    bioregionName: string;
    severity: HazardSeverity;
    hazardCategory: string;
  }): DispatchEvaluationResult {
    const currentHour = new Date().getHours();
    const profile = this.state.hourlyProfiles[currentHour] || {
      hour: currentHour,
      receptivityScore: 0.5,
      fatigueRisk: 0.5,
      isQuietWindow: false
    };

    // 1. EXISTENTIAL & CRITICAL THREAT RULE (Hard Sovereign Constraint)
    // Existential threats to bioregional survival or human safety CAN NEVER BE SUPPRESSED
    if (alert.severity === 'EXISTENTIAL' || alert.severity === 'CRITICAL') {
      this.state.existentialThreatsDelivered++;
      this.state.totalAlertsDispatched++;
      this.saveState();

      return {
        shouldDeliverImmediately: true,
        isExistentialBypass: true,
        batchedForDigest: false,
        currentReceptivity: profile.receptivityScore,
        reason: `EXISTENTIAL_BYPASS: Severity level '${alert.severity}' bypasses all fatigue constraints for life-safety.`
      };
    }

    // If ML adaptive mode is disabled by user, deliver immediately
    if (!this.state.mlAdaptiveEnabled) {
      this.state.totalAlertsDispatched++;
      this.saveState();
      return {
        shouldDeliverImmediately: true,
        isExistentialBypass: false,
        batchedForDigest: false,
        currentReceptivity: 1.0,
        reason: 'ML adaptive sensitivity is toggled off; standard delivery active.'
      };
    }

    // 2. High Fatigue / Quiet Window Evaluation for non-critical alerts
    const isFatiguedHour = profile.receptivityScore < 0.40 || profile.fatigueRisk > 0.60 || profile.isQuietWindow;

    if (isFatiguedHour) {
      // Batch into digest
      this.state.totalFatigueBatched++;
      this.state.digestQueue.unshift({
        id: alert.id,
        title: alert.title,
        bioregionName: alert.bioregionName,
        severity: alert.severity,
        category: alert.hazardCategory,
        timestamp: 'Just now',
        batchedReason: `Suppressed during ${currentHour.toString().padStart(2, '0')}:00 fatigue window (${Math.round(profile.fatigueRisk * 100)}% fatigue risk)`
      });

      // Keep queue bounded
      if (this.state.digestQueue.length > 20) {
        this.state.digestQueue.pop();
      }

      this.saveState();

      // Recommend next high alertness hour
      const nextPeak = this.findNextHighReceptivityHour(currentHour);

      return {
        shouldDeliverImmediately: false,
        isExistentialBypass: false,
        batchedForDigest: true,
        currentReceptivity: profile.receptivityScore,
        reason: `Low/Moderate fatigue dampening active (Hour ${currentHour}:00 receptivity: ${Math.round(profile.receptivityScore * 100)}%). Alert queued in Bioregional Digest.`,
        recommendedDeliveryWindow: `Next optimal window: ${nextPeak}:00 (Receptivity: ${Math.round((this.state.hourlyProfiles[nextPeak]?.receptivityScore || 0.8) * 100)}%)`
      };
    }

    // Normal Delivery
    this.state.totalAlertsDispatched++;
    this.saveState();
    return {
      shouldDeliverImmediately: true,
      isExistentialBypass: false,
      batchedForDigest: false,
      currentReceptivity: profile.receptivityScore,
      reason: `Optimal attention window (Hour ${currentHour}:00 receptivity: ${Math.round(profile.receptivityScore * 100)}%). Direct delivery authorized.`
    };
  }

  /**
   * Online Bayesian Learning update when the user engages with an alert
   */
  public recordUserEngagement(hour: number, engagementType: 'AUDITED' | 'CLICKED' | 'DISMISSED' | 'SNOOZED') {
    const targetHour = (hour >= 0 && hour <= 23) ? hour : new Date().getHours();
    const profile = this.state.hourlyProfiles[targetHour];
    if (!profile) return;

    if (engagementType === 'AUDITED' || engagementType === 'CLICKED') {
      profile.interactionCount += 1;
      // Bayesian update: increase receptivity, decrease fatigue
      profile.receptivityScore = Math.min(0.99, profile.receptivityScore * 0.90 + 0.10);
      profile.fatigueRisk = Math.max(0.01, profile.fatigueRisk * 0.90);
    } else if (engagementType === 'DISMISSED' || engagementType === 'SNOOZED') {
      profile.dismissCount += 1;
      // Bayesian update: decrease receptivity, increase fatigue
      profile.receptivityScore = Math.max(0.05, profile.receptivityScore * 0.85);
      profile.fatigueRisk = Math.min(0.95, profile.fatigueRisk * 0.85 + 0.15);
    }

    profile.receptivityScore = Math.round(profile.receptivityScore * 100) / 100;
    profile.fatigueRisk = Math.round(profile.fatigueRisk * 100) / 100;

    this.saveState();
  }

  public toggleMlAdaptive(enabled?: boolean) {
    this.state.mlAdaptiveEnabled = enabled !== undefined ? enabled : !this.state.mlAdaptiveEnabled;
    this.saveState();
  }

  public setQuietHours(start: number, end: number) {
    this.state.userOverrideQuietHours = { start, end };
    this.state.hourlyProfiles.forEach(p => {
      if (start > end) {
        p.isQuietWindow = p.hour >= start || p.hour <= end;
      } else {
        p.isQuietWindow = p.hour >= start && p.hour <= end;
      }
    });
    this.saveState();
  }

  public clearDigestQueue() {
    this.state.digestQueue = [];
    this.saveState();
  }

  private findNextHighReceptivityHour(fromHour: number): number {
    for (let offset = 1; offset <= 24; offset++) {
      const h = (fromHour + offset) % 24;
      const p = this.state.hourlyProfiles[h];
      if (p && p.receptivityScore >= 0.70 && !p.isQuietWindow) {
        return h;
      }
    }
    return 8; // fallback 08:00 AM
  }
}

export const smartNotificationService = new SmartNotificationLearningService();
