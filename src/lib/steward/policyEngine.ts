/**
 * ATLAS STEWARD — Autonomy Policy Engine & Safety Gateways
 * Implements 4 Autonomy Levels + Inviolable Community Essential Service Invariants
 */

import { AutonomyLevel, AgentRole } from './types';

export interface PolicyCheckResult {
  allowed: boolean;
  requiresHumanApproval: boolean;
  assignedAutonomy: AutonomyLevel;
  policyName: string;
  reason: string;
  suggestedAction: 'EXECUTE_SILENTLY' | 'ESCALATE_TO_COCKPIT' | 'BLOCK_HAZARD';
}

export interface ActionIntent {
  actionType: string;
  targetAssetId?: string;
  targetAssetName?: string;
  isEssentialService: boolean;
  costUsd: number;
  isPreApprovedSupplier: boolean;
  isRoutineScheduledTask: boolean;
  estimatedDowntimeHours: number;
  populationImpacted: number;
  involvesSensitiveData: boolean;
  isEmergencyProtectiveAction: boolean;
}

export class StewardPolicyEngine {
  private autoSpendLimitUsd: number = 500.0;
  private maxAllowedDowntimeHoursWithoutApproval: number = 2.0;

  constructor(autoSpendLimitUsd: number = 500.0) {
    this.autoSpendLimitUsd = autoSpendLimitUsd;
  }

  public setAutoSpendLimit(limitUsd: number) {
    this.autoSpendLimitUsd = limitUsd;
  }

  public getAutoSpendLimit(): number {
    return this.autoSpendLimitUsd;
  }

  /**
   * Evaluate action against autonomy rules & safety invariants
   */
  public evaluateAction(intent: ActionIntent): PolicyCheckResult {
    // 1. Sensitive Data Disclosure Gateway
    if (intent.involvesSensitiveData) {
      return {
        allowed: false,
        requiresHumanApproval: true,
        assignedAutonomy: 'PREPARE',
        policyName: 'POL-01-SENSITIVE-DATA',
        reason: 'Transmission of community member PII or sensitive water rights records requires explicit human consent.',
        suggestedAction: 'ESCALATE_TO_COCKPIT'
      };
    }

    // 2. Emergency Autonomous Protective Action (e.g. pressure burst safety cutoff)
    if (intent.isEmergencyProtectiveAction) {
      return {
        allowed: true,
        requiresHumanApproval: false,
        assignedAutonomy: 'EXECUTE',
        policyName: 'POL-02-EMERGENCY-PROTECTIVE-SHUTOFF',
        reason: 'Immediate protective shutdown authorized to prevent pipe blowout or aquifer contamination.',
        suggestedAction: 'EXECUTE_SILENTLY'
      };
    }

    // 3. Spend Threshold Gateway
    if (intent.costUsd > this.autoSpendLimitUsd) {
      return {
        allowed: false,
        requiresHumanApproval: true,
        assignedAutonomy: 'PREPARE',
        policyName: 'POL-03-SPEND-THRESHOLD',
        reason: `Proposed expenditure ($${intent.costUsd.toFixed(2)}) exceeds autonomous threshold ($${this.autoSpendLimitUsd.toFixed(2)}).`,
        suggestedAction: 'ESCALATE_TO_COCKPIT'
      };
    }

    // 4. Essential Service Allocation / Major Downtime Gateway
    if (intent.isEssentialService && intent.estimatedDowntimeHours > this.maxAllowedDowntimeHoursWithoutApproval && intent.populationImpacted > 500) {
      return {
        allowed: false,
        requiresHumanApproval: true,
        assignedAutonomy: 'RECOMMEND',
        policyName: 'POL-04-ESSENTIAL-SERVICE-ALLOCATION',
        reason: `Downtime of ${intent.estimatedDowntimeHours} hours exceeds 2.0-hour autonomous ceiling for community zone serving ${intent.populationImpacted} residents.`,
        suggestedAction: 'ESCALATE_TO_COCKPIT'
      };
    }

    // 5. Routine Scheduled Inspection or Pre-Approved Maintenance
    if (intent.isRoutineScheduledTask || (intent.isPreApprovedSupplier && intent.costUsd <= this.autoSpendLimitUsd)) {
      return {
        allowed: true,
        requiresHumanApproval: false,
        assignedAutonomy: 'EXECUTE',
        policyName: 'POL-05-ROUTINE-COORDINATION',
        reason: 'Routine scheduled maintenance with pre-approved supplier within budget threshold.',
        suggestedAction: 'EXECUTE_SILENTLY'
      };
    }

    // Default: Safe automated execution
    return {
      allowed: true,
      requiresHumanApproval: false,
      assignedAutonomy: 'EXECUTE',
      policyName: 'POL-DEFAULT-AUTONOMOUS',
      reason: 'Action verified safe within autonomous boundaries.',
      suggestedAction: 'EXECUTE_SILENTLY'
    };
  }
}

export const stewardPolicyEngine = new StewardPolicyEngine(500.0);
